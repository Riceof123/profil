import * as THREE from 'three';
import { audioManager } from '../core/AudioManager.js';

// Pre-allocated static temporary objects to eliminate GC pauses
const _tempBox = new THREE.Box3();
const _centerVec2 = new THREE.Vector2(0, 0);
const _moveDir = new THREE.Vector3();
const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _intersectPoint = new THREE.Vector3();

/**
 * Optimized First-Person Player Controller:
 * - Fluid movement, Sprint (Shift), Crouch (C/Ctrl), and Jump (Space)
 * - Landing impact sound, ground detection, and ceiling collision
 * - Broadphase wall collision filtering for peak FPS
 * - Occlusion raycasting for keys & exit door
 */
export class Player {
  constructor(camera, domElement, wallColliders, floorSurfaces, uiManager, ceilingHeights = [-0.4, 3.75, 7.75]) {
    this.camera = camera;
    this.domElement = domElement;
    this.wallColliders = wallColliders;
    this.floorSurfaces = floorSurfaces;
    this.ceilingHeights = ceilingHeights;
    this.uiManager = uiManager;

    // Movement speeds (m/s)
    this.walkSpeed = 3.4;
    this.sprintSpeed = 5.8;
    this.crouchSpeed = 1.7;
    this.jumpForce = 5.8;

    // Heights
    this.standingHeight = 1.65;
    this.crouchingHeight = 0.95;
    this.currentHeight = this.standingHeight;

    // Physics
    this.position = new THREE.Vector3(-10, 4 + this.standingHeight, 11);
    this.velocity = new THREE.Vector3();
    this.playerRadius = 0.38;
    this.gravity = 18.0;
    this.isGrounded = true;

    // Camera angles
    this.pitch = 0;
    this.yaw = 0;
    this.mouseSensitivity = 0.0022;

    // Stamina
    this.stamina = 100;
    this.maxStamina = 100;
    this.staminaDrainRate = 18;
    this.staminaRegenRate = 14;

    // Noise level
    this.noiseLevel = 0;

    // Flashlight
    this.flashlightOn = true;
    this.flashlight = null;
    this.setupFlashlight();

    // Head bobbing
    this.headBobTimer = 0;
    this.headBobEnabled = true;

    // Footstep timer
    this.stepTimer = 0;

    // Interaction Raycaster
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 2.6;
    this.currentInteractable = null;

    // Controls input state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      crouch: false,
      jump: false,
      interact: false
    };

    this.isLocked = false;
    this.setupInputListeners();
  }

  setupFlashlight() {
    this.flashlight = new THREE.SpotLight(0xfff3d6, 3.0, 24, Math.PI / 5.5, 0.4, 1.2);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.mapSize.width = 512;
    this.flashlight.shadow.mapSize.height = 512;
    this.flashlight.shadow.camera.near = 0.1;
    this.flashlight.shadow.camera.far = 24;
    this.flashlight.shadow.bias = -0.001;

    this.flashlightTarget = new THREE.Object3D();
    this.flashlight.target = this.flashlightTarget;

    this.camera.add(this.flashlight);
    this.camera.add(this.flashlightTarget);
    this.flashlight.position.set(0.18, -0.2, 0.1);
    this.flashlightTarget.position.set(0.18, -0.2, -10);
  }

  toggleFlashlight() {
    this.flashlightOn = !this.flashlightOn;
    this.flashlight.visible = this.flashlightOn;
    // Optimize: disable shadow pass completely when flashlight is off!
    this.flashlight.castShadow = this.flashlightOn;

    audioManager.playFlashlightClick();
    if (this.uiManager) {
      this.uiManager.updateFlashlightStatus(this.flashlightOn);
    }
  }

  setupInputListeners() {
    window.addEventListener('mousemove', (e) => {
      if (!this.isLocked) return;
      this.yaw -= e.movementX * this.mouseSensitivity;
      this.pitch -= e.movementY * this.mouseSensitivity;
      this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
    });

    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = true;
          break;
        case 'Space':
          this.keys.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.keys.sprint = true;
          break;
        case 'KeyC':
        case 'ControlLeft':
          this.keys.crouch = !this.keys.crouch;
          break;
        case 'KeyF':
          this.toggleFlashlight();
          break;
        case 'KeyE':
          this.keys.interact = true;
          this.triggerInteraction();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = false;
          break;
        case 'Space':
          this.keys.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.keys.sprint = false;
          break;
        case 'KeyE':
          this.keys.interact = false;
          break;
      }
    });
  }

  update(delta, keyManager, exitDoor) {
    if (!this.isLocked) return;

    // 1. Crouch Height Interpolation
    const targetHeight = this.keys.crouch ? this.crouchingHeight : this.standingHeight;
    this.currentHeight = THREE.MathUtils.lerp(this.currentHeight, targetHeight, delta * 12);

    // 2. Sprint & Stamina
    const isMoving = this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;
    const canSprint = this.keys.sprint && isMoving && !this.keys.crouch && this.stamina > 5;
    const isSprinting = canSprint;

    if (isSprinting) {
      this.stamina = Math.max(0, this.stamina - this.staminaDrainRate * delta);
    } else {
      this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRegenRate * delta);
    }

    // 3. Jump Action
    if (this.keys.jump && this.isGrounded && !this.keys.crouch && this.stamina >= 8) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      this.stamina = Math.max(0, this.stamina - 8);
      this.noiseLevel = 15;
      audioManager.playJump();
      this.keys.jump = false;
    }

    if (this.uiManager) {
      this.uiManager.updateStamina(this.stamina, this.maxStamina);
    }

    // 4. Speed & Noise
    let speed = this.walkSpeed;
    if (this.keys.crouch) {
      speed = this.crouchSpeed;
      this.noiseLevel = 0;
    } else if (isSprinting) {
      speed = this.sprintSpeed;
      this.noiseLevel = 25;
    } else if (isMoving) {
      speed = this.walkSpeed;
      this.noiseLevel = 5;
    } else if (this.isGrounded) {
      this.noiseLevel = 0;
    }

    // Horizontal Movement
    _moveDir.set(0, 0, 0);
    if (this.keys.forward) _moveDir.z -= 1;
    if (this.keys.backward) _moveDir.z += 1;
    if (this.keys.left) _moveDir.x -= 1;
    if (this.keys.right) _moveDir.x += 1;

    if (_moveDir.lengthSq() > 0) {
      _moveDir.normalize();
      _moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

      const targetVelX = _moveDir.x * speed;
      const targetVelZ = _moveDir.z * speed;

      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, targetVelX, delta * 14);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, targetVelZ, delta * 14);

      if (this.isGrounded) {
        const stepFreq = isSprinting ? 0.32 : this.keys.crouch ? 0.65 : 0.48;
        this.stepTimer += delta;
        if (this.stepTimer >= stepFreq) {
          this.stepTimer = 0;
          const stepType = isSprinting ? 'sprint' : this.keys.crouch ? 'crouch' : 'walk';
          audioManager.playFootstep(stepType);
        }

        if (this.headBobEnabled) {
          this.headBobTimer += delta * (isSprinting ? 14 : 9);
        }
      }
    } else {
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, 0, delta * 16);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, 0, delta * 16);
      this.stepTimer = 0;
    }

    // Gravity
    this.velocity.y -= this.gravity * delta;

    // 5. Physics Collision & Ceiling Check
    this.moveWithCollision(delta);

    // 6. Camera Positioning & Euler Rotation
    let bobOffset = 0;
    if (this.headBobEnabled && isMoving && this.isGrounded) {
      bobOffset = Math.sin(this.headBobTimer) * (isSprinting ? 0.05 : 0.025);
    }

    this.camera.position.set(
      this.position.x,
      this.position.y + bobOffset,
      this.position.z
    );

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;

    // 7. Interaction Raycasting
    this.updateRaycasting(keyManager, exitDoor);
  }

  moveWithCollision(delta) {
    const moveX = this.velocity.x * delta;
    const moveZ = this.velocity.z * delta;
    const moveY = this.velocity.y * delta;

    // Horizontal Movement with wall sliding
    const newX = this.position.x + moveX;
    if (!this.checkWallCollision(newX, this.position.y, this.position.z)) {
      this.position.x = newX;
    } else {
      this.velocity.x = 0;
    }

    const newZ = this.position.z + moveZ;
    if (!this.checkWallCollision(this.position.x, this.position.y, newZ)) {
      this.position.z = newZ;
    } else {
      this.velocity.z = 0;
    }

    // Vertical Movement & Ground Snap
    const newY = this.position.y + moveY;
    const groundY = this.findGroundHeight(this.position.x, this.position.z, this.position.y);

    if (this.velocity.y <= 0 && newY - this.currentHeight <= groundY + 0.06) {
      // Landing on floor / stairs / furniture top
      if (!this.isGrounded && this.velocity.y < -2.5) {
        audioManager.playLand(this.velocity.y);
        this.noiseLevel = 20; // Landing noise alerts nearby entity!
      }
      this.position.y = groundY + this.currentHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      // In the air (jumping or falling)
      this.position.y = newY;
      this.isGrounded = false;

      // Ceiling Collision Check (stops head from clipping through ceiling)
      const headY = this.position.y + 0.1;
      for (let i = 0; i < this.ceilingHeights.length; i++) {
        const ceil = this.ceilingHeights[i];
        if (headY >= ceil && headY - 0.5 <= ceil) {
          this.position.y = ceil - 0.1;
          this.velocity.y = 0;
          break;
        }
      }
    }
  }

  checkWallCollision(x, y, z) {
    const r = this.playerRadius;
    const feetY = y - this.currentHeight + 0.35; // Step tolerance
    const headY = y - 0.1;

    _tempBox.min.set(x - r, feetY, z - r);
    _tempBox.max.set(x + r, headY, z + r);

    for (let i = 0; i < this.wallColliders.length; i++) {
      const box = this.wallColliders[i];
      // Fast broadphase distance check (skips distant boxes)
      if (Math.abs(box.min.x - x) > 4.5 || Math.abs(box.min.z - z) > 4.5) continue;

      if (box.intersectsBox(_tempBox)) {
        return true;
      }
    }
    return false;
  }

  findGroundHeight(x, z, currentY) {
    let maxGround = -4.0;
    const feetY = currentY - this.currentHeight;

    for (let i = 0; i < this.floorSurfaces.length; i++) {
      const surface = this.floorSurfaces[i];

      if (x >= surface.minX && x <= surface.maxX && z >= surface.minZ && z <= surface.maxZ) {
        let surfaceY = surface.y;

        if (surface.isRamp) {
          const frac = (z - surface.startZ) / (surface.endZ - surface.startZ);
          surfaceY = surface.startY + frac * (surface.endY - surface.startY);
        }

        // Must be beneath or close to player's feet
        if (surfaceY <= feetY + 0.65) {
          if (surfaceY > maxGround) {
            maxGround = surfaceY;
          }
        }
      }
    }
    return maxGround;
  }

  updateRaycasting(keyManager, exitDoor) {
    this.raycaster.setFromCamera(_centerVec2, this.camera);

    const candidates = [];
    if (keyManager) {
      for (let i = 0; i < keyManager.keys.length; i++) {
        const k = keyManager.keys[i];
        if (!k.userData.collected) candidates.push(k);
      }
    }
    if (exitDoor && exitDoor.doorMesh) {
      candidates.push(exitDoor.doorMesh);
    }

    const intersects = this.raycaster.intersectObjects(candidates, true);

    if (intersects.length > 0) {
      const hitInfo = intersects[0];
      let hit = hitInfo.object;
      const hitDist = hitInfo.distance;

      // Occlusion check
      if (this.isOccludedByWall(this.camera.position, hitInfo.point, hitDist)) {
        this.currentInteractable = null;
        if (this.uiManager) this.uiManager.hideInteractionPrompt();
        return;
      }

      while (hit && !hit.userData.isKey && !hit.userData.isExitDoor && hit.parent) {
        hit = hit.parent;
      }

      if (hit && hit.userData.isKey && !hit.userData.collected) {
        this.currentInteractable = { type: 'key', obj: hit };
        if (this.uiManager) {
          this.uiManager.showInteractionPrompt(`[E] Ambil Kunci Kuningan (${hit.userData.name})`);
        }
        return;
      }

      if (hit && hit.userData.isExitDoor) {
        this.currentInteractable = { type: 'door', obj: hit };
        if (this.uiManager) {
          this.uiManager.showInteractionPrompt('[E] Buka / Periksa Pintu Keluar Utama');
        }
        return;
      }
    }

    this.currentInteractable = null;
    if (this.uiManager) {
      this.uiManager.hideInteractionPrompt();
    }
  }

  isOccludedByWall(startPos, endPos, maxDist) {
    _rayOrigin.copy(startPos);
    _rayDir.subVectors(endPos, startPos).normalize();
    const ray = new THREE.Ray(_rayOrigin, _rayDir);

    for (let i = 0; i < this.wallColliders.length; i++) {
      const intersect = ray.intersectBox(this.wallColliders[i], _intersectPoint);
      if (intersect) {
        const d = _rayOrigin.distanceTo(intersect);
        if (d < maxDist - 0.25) {
          return true;
        }
      }
    }
    return false;
  }

  triggerInteraction() {
    if (!this.currentInteractable) return;

    if (this.currentInteractable.type === 'key') {
      const keyMesh = this.currentInteractable.obj;
      this.currentInteractable = null;
      if (window.gameInstance && window.gameInstance.keyManager) {
        window.gameInstance.keyManager.collectKey(keyMesh);
      }
    } else if (this.currentInteractable.type === 'door') {
      if (window.gameInstance && window.gameInstance.exitDoor && window.gameInstance.keyManager) {
        window.gameInstance.exitDoor.interact(
          window.gameInstance.keyManager.collectedCount,
          window.gameInstance.keyManager.totalKeys
        );
      }
    }
  }

  reset() {
    this.position.set(-10, 4 + this.standingHeight, 11);
    this.velocity.set(0, 0, 0);
    this.yaw = 0;
    this.pitch = 0;
    this.stamina = 100;
    this.keys.forward = false;
    this.keys.backward = false;
    this.keys.left = false;
    this.keys.right = false;
    this.keys.sprint = false;
    this.keys.crouch = false;
    this.keys.jump = false;
    this.isGrounded = true;
    this.flashlightOn = true;
    this.headBobTimer = 0;
    this.currentInteractable = null;

    if (this.flashlight) {
      this.flashlight.visible = true;
      this.flashlight.castShadow = true;
    }
    if (this.uiManager) {
      this.uiManager.updateFlashlightStatus(true);
      this.uiManager.updateStamina(100, 100);
      this.uiManager.hideInteractionPrompt();
    }
  }
}
