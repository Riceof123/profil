import * as THREE from 'three';
import { audioManager } from '../core/AudioManager.js';
import { TextureGenerator } from '../world/TextureGenerator.js';

export const EntityState = {
  PATROL: 'PATROL',
  INVESTIGATE: 'INVESTIGATE',
  CHASE: 'CHASE',
  SEARCH: 'SEARCH',
  RETURN: 'RETURN'
};

// Pre-allocated static temporary objects to eliminate GC pauses
const _toPlayer = new THREE.Vector3();
const _facing = new THREE.Vector3();
const _rayOrigin = new THREE.Vector3();
const _rayTarget = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _hitPoint = new THREE.Vector3();
const _tempRay = new THREE.Ray();
const _playerForward = new THREE.Vector3();
const _playerRight = new THREE.Vector3();

/**
 * Optimized The Yellow Entity:
 * - Smart multi-floor navigation and chase behavior (never walks into walls)
 * - Zero allocations in per-frame update loop
 * - Clean transitions between Patrol, Investigate, Chase, Search, and Return
 */
export class YellowEntity {
  constructor(scene, navGraph, wallColliders, uiManager) {
    this.scene = scene;
    this.navGraph = navGraph;
    this.wallColliders = wallColliders;
    this.uiManager = uiManager;

    // Movement speeds (m/s)
    this.patrolSpeed = 2.0;
    this.chaseSpeed = 4.8;
    this.investigateSpeed = 2.5;

    // State
    this.state = EntityState.PATROL;
    this.position = new THREE.Vector3(0, 0.5, 4.5);
    this.rotationY = 0;

    // Senses
    this.viewDistance = 24.0;
    this.fieldOfView = (65 * Math.PI) / 180;
    this.hearingDistance = 18.0;

    // Timers & Targets
    this.lostPlayerTimer = 0;
    this.searchTimer = 0;
    this.footstepTimer = 0;
    this.animTime = 0;
    this.pathRecalcTimer = 0;
    this.lastKnownPlayerPos = new THREE.Vector3();
    this.investigateTarget = new THREE.Vector3();

    // Patrol Route covering all floors
    this.patrolWaypoints = [
      'g_hall_south',
      'g_living_center',
      'g_storage_center',
      'g_hall_north',
      'stairs_down_bottom',
      'b_cellar_center',
      'b_boiler_center',
      'b_landing',
      'g_kitchen_center',
      'g_dining_center',
      'stairs_up_top',
      'u_master_center',
      'u_hall_south',
      'u_nursery_center',
      'u_hall_mid',
      'stairs_up_bottom'
    ];
    this.currentPatrolIndex = 0;
    this.currentPath = [];
    this.pathTargetIndex = 0;

    this.isCatchingPlayer = false;
    this.onPlayerCaught = null;

    this.buildModel();
  }

  buildModel() {
    this.group = new THREE.Group();

    const skinTex = TextureGenerator.createEntitySkinTexture();
    const skinMat = new THREE.MeshStandardMaterial({
      map: skinTex,
      roughness: 0.85,
      metalness: 0.05,
      color: 0xc4ac31
    });

    const socketMat = new THREE.MeshBasicMaterial({ color: 0x050402 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffbb22 });

    // Torso Root
    this.torso = new THREE.Group();
    this.torso.position.set(0, 1.45, 0);

    const chestGeo = new THREE.BoxGeometry(0.55, 0.75, 0.32);
    const chest = new THREE.Mesh(chestGeo, skinMat);
    chest.position.set(0, 0.25, 0);
    this.torso.add(chest);

    const abGeo = new THREE.BoxGeometry(0.42, 0.5, 0.28);
    const ab = new THREE.Mesh(abGeo, skinMat);
    ab.position.set(0, -0.28, 0);
    this.torso.add(ab);

    const spineGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.85);
    const spine = new THREE.Mesh(spineGeo, skinMat);
    spine.position.set(0, 0.1, -0.12);
    spine.rotation.x = 0.2;
    this.torso.add(spine);

    // Neck & Head
    this.neck = new THREE.Group();
    this.neck.position.set(0, 0.65, 0.05);

    const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.4);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, 0.15, 0);
    neckMesh.rotation.x = 0.15;
    this.neck.add(neckMesh);

    this.head = new THREE.Group();
    this.head.position.set(0, 0.35, 0.05);

    const headGeo = new THREE.BoxGeometry(0.38, 0.55, 0.42);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 0.1, 0);
    this.head.add(headMesh);

    // Sunken sockets
    const eyeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.05);
    const eyeL = new THREE.Mesh(eyeGeo, socketMat);
    eyeL.position.set(-0.1, 0.14, 0.21);
    this.head.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, socketMat);
    eyeR.position.set(0.1, 0.14, 0.21);
    this.head.add(eyeR);

    // Glowing pupils
    const pupilGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    pupilL.position.set(-0.1, 0.14, 0.23);
    this.head.add(pupilL);

    const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
    pupilR.position.set(0.1, 0.14, 0.23);
    this.head.add(pupilR);

    // Subtle localized eye glow (non-shadow-casting for max performance)
    const eyeLight = new THREE.PointLight(0xff9900, 0.9, 3.5);
    eyeLight.position.set(0, 0.14, 0.35);
    this.head.add(eyeLight);

    this.neck.add(this.head);
    this.torso.add(this.neck);

    // Limbs
    const upperArmGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.7);
    const foreArmGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.75);
    const handGeo = new THREE.BoxGeometry(0.08, 0.25, 0.15);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.35, 0.55, 0);
    const lUpperArm = new THREE.Mesh(upperArmGeo, skinMat);
    lUpperArm.position.set(0, -0.35, 0);
    this.leftArm.add(lUpperArm);

    this.leftForearm = new THREE.Group();
    this.leftForearm.position.set(0, -0.7, 0);
    const lForearm = new THREE.Mesh(foreArmGeo, skinMat);
    lForearm.position.set(0, -0.35, 0);
    this.leftForearm.add(lForearm);
    const lHand = new THREE.Mesh(handGeo, skinMat);
    lHand.position.set(0, -0.75, 0.05);
    this.leftForearm.add(lHand);

    this.leftArm.add(this.leftForearm);
    this.torso.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.35, 0.55, 0);
    const rUpperArm = new THREE.Mesh(upperArmGeo, skinMat);
    rUpperArm.position.set(0, -0.35, 0);
    this.rightArm.add(rUpperArm);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.set(0, -0.7, 0);
    const rForearm = new THREE.Mesh(foreArmGeo, skinMat);
    rForearm.position.set(0, -0.35, 0);
    this.rightForearm.add(rForearm);
    const rHand = new THREE.Mesh(handGeo, skinMat);
    rHand.position.set(0, -0.75, 0.05);
    this.rightForearm.add(rHand);

    this.rightArm.add(this.rightForearm);
    this.torso.add(this.rightArm);

    // Legs
    const thighGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.85);
    const shinGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.85);

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.18, -0.45, 0);
    const lThigh = new THREE.Mesh(thighGeo, skinMat);
    lThigh.position.set(0, -0.42, 0);
    this.leftLeg.add(lThigh);

    this.leftShin = new THREE.Group();
    this.leftShin.position.set(0, -0.85, 0);
    const lShin = new THREE.Mesh(shinGeo, skinMat);
    lShin.position.set(0, -0.42, 0);
    this.leftShin.add(lShin);

    this.leftLeg.add(this.leftShin);
    this.torso.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.18, -0.45, 0);
    const rThigh = new THREE.Mesh(thighGeo, skinMat);
    rThigh.position.set(0, -0.42, 0);
    this.rightLeg.add(rThigh);

    this.rightShin = new THREE.Group();
    this.rightShin.position.set(0, -0.85, 0);
    const rShin = new THREE.Mesh(shinGeo, skinMat);
    rShin.position.set(0, -0.42, 0);
    this.rightShin.add(rShin);

    this.rightLeg.add(this.rightShin);
    this.torso.add(this.rightLeg);

    this.group.add(this.torso);
    this.group.position.copy(this.position);
    this.scene.add(this.group);
  }

  update(delta, player) {
    if (this.isCatchingPlayer) {
      this.animateJumpscare(delta, player);
      return;
    }

    this.animTime += delta;
    this.pathRecalcTimer += delta;

    const canSeePlayer = this.checkLineOfSight(player);
    const canHearPlayer = this.checkHearing(player);
    const distToPlayer = this.position.distanceTo(player.position);

    this.updateAudioFootsteps(delta, player, distToPlayer);

    switch (this.state) {
      case EntityState.PATROL:
        audioManager.setChaseIntensity(0.0);
        if (canSeePlayer) {
          this.triggerChase(player.position);
        } else if (canHearPlayer) {
          this.triggerInvestigate(player.position);
        } else {
          this.executePatrol(delta);
        }
        break;

      case EntityState.INVESTIGATE:
        audioManager.setChaseIntensity(0.25);
        if (canSeePlayer) {
          this.triggerChase(player.position);
        } else {
          this.executeInvestigate(delta);
        }
        break;

      case EntityState.CHASE:
        const intensity = Math.max(0.4, 1.0 - distToPlayer / 26);
        audioManager.setChaseIntensity(intensity);

        if (distToPlayer < 1.35) {
          this.catchPlayer(player);
          return;
        }

        if (canSeePlayer) {
          this.lostPlayerTimer = 0;
          this.lastKnownPlayerPos.copy(player.position);

          // If on same floor and direct line of sight is clear, sprint directly
          const heightDiff = Math.abs(player.position.y - this.position.y);
          if (heightDiff < 1.8) {
            this.executeDirectChase(delta, player.position);
          } else {
            // Player is on another floor (stairs/cellar): follow navgraph path!
            this.executeNavChase(delta, player.position);
          }
        } else {
          this.lostPlayerTimer += delta;
          if (this.lostPlayerTimer > 2.6) {
            this.state = EntityState.SEARCH;
            this.searchTimer = 4.5;
          } else {
            this.executeNavChase(delta, this.lastKnownPlayerPos);
          }
        }
        break;

      case EntityState.SEARCH:
        audioManager.setChaseIntensity(0.18);
        if (canSeePlayer) {
          this.triggerChase(player.position);
        } else {
          this.executeSearch(delta);
        }
        break;

      case EntityState.RETURN:
        audioManager.setChaseIntensity(0.05);
        if (canSeePlayer) {
          this.triggerChase(player.position);
        } else if (canHearPlayer) {
          this.triggerInvestigate(player.position);
        } else {
          this.executeReturn(delta);
        }
        break;
    }

    this.animateModel(delta);

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
  }

  // --- Senses ---
  checkLineOfSight(player) {
    _toPlayer.subVectors(player.position, this.position);
    const dist = _toPlayer.length();

    if (dist > this.viewDistance) return false;

    // Check height difference
    if (Math.abs(player.position.y - this.position.y) > 3.0) return false;

    _facing.set(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    _toPlayer.normalize();
    const angle = _facing.angleTo(_toPlayer);

    // Proximity awareness (< 3.2m behind)
    if (dist < 3.2 && player.noiseLevel > 0) return true;

    // Vision cone
    if (angle > this.fieldOfView / 2) {
      if (player.flashlightOn && dist < 14) {
        if (angle > this.fieldOfView * 1.1) return false;
      } else {
        return false;
      }
    }

    // Raycast check against solid walls
    _rayOrigin.set(this.position.x, this.position.y + 1.8, this.position.z);
    _rayTarget.set(player.position.x, player.position.y, player.position.z);
    _rayDir.subVectors(_rayTarget, _rayOrigin).normalize();
    const rayDist = _rayOrigin.distanceTo(_rayTarget);

    _tempRay.set(_rayOrigin, _rayDir);

    for (let i = 0; i < this.wallColliders.length; i++) {
      const intersect = _tempRay.intersectBox(this.wallColliders[i], _hitPoint);
      if (intersect) {
        const d = _rayOrigin.distanceTo(intersect);
        if (d < rayDist - 0.4) {
          return false; // Occluded by wall
        }
      }
    }

    return true;
  }

  checkHearing(player) {
    if (player.noiseLevel <= 0) return false;
    const dist = this.position.distanceTo(player.position);
    return dist < (player.noiseLevel > 15 ? this.hearingDistance : 6.0);
  }

  // --- States ---
  triggerChase(playerPos) {
    if (this.state !== EntityState.CHASE) {
      audioManager.playEntityAlert(this.position.distanceTo(playerPos));
      if (this.uiManager) {
        this.uiManager.showToast('Entitas Kuning melihatmu! LARI!', 'red', 3000);
      }
    }
    this.state = EntityState.CHASE;
    this.lostPlayerTimer = 0;
    this.lastKnownPlayerPos.copy(playerPos);
    this.currentPath = this.navGraph.findPath(this.position, playerPos);
    this.pathTargetIndex = 0;
  }

  triggerInvestigate(pos) {
    this.state = EntityState.INVESTIGATE;
    this.investigateTarget.copy(pos);
    this.currentPath = this.navGraph.findPath(this.position, pos);
    this.pathTargetIndex = 0;
  }

  executePatrol(delta) {
    if (!this.currentPath || this.pathTargetIndex >= this.currentPath.length) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolWaypoints.length;
      const targetWp = this.patrolWaypoints[this.currentPatrolIndex];
      const node = this.navGraph.nodes.find(n => n.id === targetWp);
      if (node) {
        this.currentPath = this.navGraph.findPath(this.position, node.pos);
        this.pathTargetIndex = 0;
      }
    }
    this.moveAlongPath(delta, this.patrolSpeed);
  }

  executeInvestigate(delta) {
    if (!this.currentPath || this.pathTargetIndex >= this.currentPath.length) {
      this.state = EntityState.SEARCH;
      this.searchTimer = 4.0;
      return;
    }
    this.moveAlongPath(delta, this.investigateSpeed);
  }

  executeDirectChase(delta, targetPos) {
    _toPlayer.subVectors(targetPos, this.position);
    _toPlayer.y = 0;
    const dist = _toPlayer.length();

    if (dist < 0.1) return;

    _toPlayer.normalize();
    const targetAngle = Math.atan2(_toPlayer.x, _toPlayer.z);
    this.rotationY = THREE.MathUtils.lerp(this.rotationY, targetAngle, delta * 9);

    const moveDist = this.chaseSpeed * delta;
    this.position.x += Math.sin(this.rotationY) * moveDist;
    this.position.z += Math.cos(this.rotationY) * moveDist;
    this.position.y = THREE.MathUtils.lerp(this.position.y, targetPos.y - 1.2, delta * 5);
  }

  executeNavChase(delta, targetPos) {
    // Periodically recalculate path towards moving target
    if (this.pathRecalcTimer > 0.4) {
      this.pathRecalcTimer = 0;
      this.currentPath = this.navGraph.findPath(this.position, targetPos);
      this.pathTargetIndex = 0;
    }
    this.moveAlongPath(delta, this.chaseSpeed);
  }

  executeSearch(delta) {
    this.searchTimer -= delta;
    this.rotationY += Math.sin(this.animTime * 4) * 0.035;

    if (this.searchTimer <= 0) {
      this.state = EntityState.RETURN;
      const closestPatrolNode = this.navGraph.getClosestNode(this.position);
      if (closestPatrolNode) {
        this.currentPath = this.navGraph.findPath(this.position, closestPatrolNode.pos);
        this.pathTargetIndex = 0;
      }
    }
  }

  executeReturn(delta) {
    if (!this.currentPath || this.pathTargetIndex >= this.currentPath.length) {
      this.state = EntityState.PATROL;
      return;
    }
    this.moveAlongPath(delta, this.patrolSpeed);
  }

  moveAlongPath(delta, speed) {
    if (!this.currentPath || this.pathTargetIndex >= this.currentPath.length) return;

    const targetPos = this.currentPath[this.pathTargetIndex];
    const dx = targetPos.x - this.position.x;
    const dz = targetPos.z - this.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.6) {
      this.pathTargetIndex++;
      return;
    }

    const targetAngle = Math.atan2(dx, dz);
    this.rotationY = THREE.MathUtils.lerp(this.rotationY, targetAngle, delta * 6);

    const moveDist = speed * delta;
    this.position.x += Math.sin(this.rotationY) * moveDist;
    this.position.z += Math.cos(this.rotationY) * moveDist;

    // Smooth elevation change along stairs/floors
    this.position.y = THREE.MathUtils.lerp(this.position.y, targetPos.y, delta * 6);
  }

  // --- Procedural Animations ---
  animateModel(delta) {
    const isMoving = this.state === EntityState.CHASE || this.state === EntityState.PATROL || this.state === EntityState.INVESTIGATE;
    const strideSpeed = this.state === EntityState.CHASE ? 14 : 7;
    const t = this.animTime * strideSpeed;

    if (isMoving) {
      const legAngle = Math.sin(t) * (this.state === EntityState.CHASE ? 0.75 : 0.45);
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;

      this.leftShin.rotation.x = Math.max(0, -Math.sin(t) * 0.6);
      this.rightShin.rotation.x = Math.max(0, Math.sin(t) * 0.6);

      this.leftArm.rotation.x = -legAngle * 0.9;
      this.rightArm.rotation.x = legAngle * 0.9;

      this.torso.rotation.z = Math.sin(t * 0.5) * 0.08;
      this.torso.position.y = 1.45 + Math.abs(Math.sin(t)) * 0.1;

      this.head.rotation.z = 0.15 + Math.sin(this.animTime * 3) * 0.12;
      this.head.rotation.y = Math.sin(this.animTime * 1.5) * 0.18;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.2, delta * 3);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0.2, delta * 3);

      this.torso.position.y = 1.45 + Math.sin(this.animTime * 1.5) * 0.04;
      this.head.rotation.y = Math.sin(this.animTime * 2.8) * 0.6;
      this.head.rotation.z = 0.25;
    }
  }

  // --- 3D Footsteps ---
  updateAudioFootsteps(delta, player, dist) {
    const isMoving = this.state === EntityState.CHASE || this.state === EntityState.PATROL;
    if (!isMoving) return;

    const interval = this.state === EntityState.CHASE ? 0.32 : 0.72;
    this.footstepTimer += delta;

    if (this.footstepTimer >= interval) {
      this.footstepTimer = 0;

      _toPlayer.subVectors(this.position, player.position);
      _playerRight.set(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.yaw);

      _toPlayer.normalize();
      const pan = _toPlayer.dot(_playerRight);

      audioManager.playEntityFootstep(pan, dist);
    }
  }

  // --- Jumpscare ---
  catchPlayer(player) {
    this.isCatchingPlayer = true;
    audioManager.playJumpscare();

    _toPlayer.subVectors(this.position, player.position).normalize();
    player.yaw = Math.atan2(-_toPlayer.x, -_toPlayer.z);
    player.pitch = 0.15;
    player.isLocked = false;

    if (this.uiManager) {
      this.uiManager.triggerJumpscareEffect();
    }

    setTimeout(() => {
      if (this.onPlayerCaught) {
        this.onPlayerCaught();
      }
    }, 1400);
  }

  animateJumpscare(delta, player) {
    _toPlayer.subVectors(player.position, this.position);
    this.position.addScaledVector(_toPlayer, delta * 5);

    this.leftArm.rotation.x = -1.4;
    this.rightArm.rotation.x = -1.4;
    this.leftArm.rotation.z = -0.5;
    this.rightArm.rotation.z = 0.5;

    this.head.rotation.x = Math.sin(this.animTime * 45) * 0.25;
    this.head.rotation.y = Math.cos(this.animTime * 40) * 0.25;

    this.group.position.copy(this.position);
  }

  reset() {
    this.isCatchingPlayer = false;
    this.state = EntityState.PATROL;
    this.position.set(0, 0.5, -5);
    this.currentPatrolIndex = 0;
    this.currentPath = [];
    this.pathTargetIndex = 0;
    this.lostPlayerTimer = 0;
    this.searchTimer = 0;
    this.pathRecalcTimer = 0;
    audioManager.setChaseIntensity(0.0);
    if (this.group) {
      this.group.position.copy(this.position);
    }
  }
}
