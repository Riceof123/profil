import * as THREE from 'three';
import { audioManager } from '../core/AudioManager.js';

/**
 * Main Exit Door system
 * Requires all 15 collected keys to open.
 */
export class ExitDoor {
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
    this.isOpen = false;
    this.isOpening = false;
    this.doorMesh = null;
    this.leftDoor = null;
    this.rightDoor = null;
    this.lockMeshes = [];
    this.exitLight = null;
    this.onEscapeSuccess = null;

    this.buildDoor();
  }

  buildDoor() {
    const group = new THREE.Group();
    group.position.set(0, 0, 18.9);

    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x24180e,
      roughness: 0.8,
      metalness: 0.2
    });

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x22262a,
      roughness: 0.6,
      metalness: 0.75
    });

    // Left door wing (pivots around x = -1.5)
    this.leftDoor = new THREE.Group();
    this.leftDoor.position.set(-1.5, 0, 0);

    const leftPanelGeo = new THREE.BoxGeometry(1.5, 3.2, 0.15);
    const leftPanel = new THREE.Mesh(leftPanelGeo, doorMat);
    leftPanel.position.set(0.75, 1.6, 0);
    this.leftDoor.add(leftPanel);

    const bandGeo = new THREE.BoxGeometry(1.5, 0.08, 0.18);
    const band1 = new THREE.Mesh(bandGeo, ironMat);
    band1.position.set(0.75, 0.8, 0);
    leftPanel.add(band1);
    const band2 = new THREE.Mesh(bandGeo, ironMat);
    band2.position.set(0.75, 2.4, 0);
    leftPanel.add(band2);

    group.add(this.leftDoor);

    // Right door wing (pivots around x = 1.5)
    this.rightDoor = new THREE.Group();
    this.rightDoor.position.set(1.5, 0, 0);

    const rightPanelGeo = new THREE.BoxGeometry(1.5, 3.2, 0.15);
    const rightPanel = new THREE.Mesh(rightPanelGeo, doorMat);
    rightPanel.position.set(-0.75, 1.6, 0);
    this.rightDoor.add(rightPanel);

    const band3 = new THREE.Mesh(bandGeo, ironMat);
    band3.position.set(-0.75, 0.8, 0);
    rightPanel.add(band3);
    const band4 = new THREE.Mesh(bandGeo, ironMat);
    band4.position.set(-0.75, 2.4, 0);
    rightPanel.add(band4);

    group.add(this.rightDoor);

    // 15 Heavy Padlocks
    const lockBodyGeo = new THREE.BoxGeometry(0.12, 0.14, 0.08);
    const shackleGeo = new THREE.TorusGeometry(0.05, 0.018, 6, 10, Math.PI);

    for (let i = 0; i < 15; i++) {
      const lockGroup = new THREE.Group();
      const lockBody = new THREE.Mesh(lockBodyGeo, ironMat);
      lockGroup.add(lockBody);

      const shackle = new THREE.Mesh(shackleGeo, ironMat);
      shackle.position.set(0, 0.07, 0);
      lockGroup.add(shackle);

      const row = Math.floor(i / 3);
      const col = (i % 3) - 1;
      lockGroup.position.set(col * 0.25, 0.8 + row * 0.4, 0.12);

      group.add(lockGroup);
      this.lockMeshes.push(lockGroup);
    }

    // Daylight beam for escape sequence (non-shadow-casting)
    this.exitLight = new THREE.SpotLight(0xfff5e6, 0.0, 30, Math.PI / 3, 0.3);
    this.exitLight.position.set(0, 2.0, 24);
    this.exitLight.target.position.set(0, 1.6, 16);
    this.scene.add(this.exitLight);
    this.scene.add(this.exitLight.target);

    leftPanel.userData = { isExitDoor: true };
    rightPanel.userData = { isExitDoor: true };

    this.scene.add(group);
    this.doorMesh = group;
  }

  interact(collectedCount, totalKeys = 15) {
    if (this.isOpen || this.isOpening) return;

    if (collectedCount < totalKeys) {
      audioManager.playDoorLocked();
      const needed = totalKeys - collectedCount;
      if (this.uiManager) {
        this.uiManager.showToast(`Pintu keluar terkunci rapat! Butuh ${needed} kunci lagi (${collectedCount}/${totalKeys}).`, 'red', 3500);
      }
    } else {
      this.unlockAndEscape();
    }
  }

  unlockAndEscape() {
    this.isOpening = true;
    audioManager.playDoorUnlocked();

    // Freeze entity so player cannot be killed during escape sequence
    if (window.gameInstance && window.gameInstance.entity) {
      window.gameInstance.entity.state = 'ESCAPED';
      audioManager.setChaseIntensity(0.0);
    }

    for (let i = 0; i < this.lockMeshes.length; i++) {
      this.lockMeshes[i].visible = false;
    }

    if (this.uiManager) {
      this.uiManager.showToast('Gembok terlepas! Pintu terbuka! Kamu bebas!', 'gold', 6000);
    }

    if (this.exitLight) {
      this.exitLight.intensity = 6.0;
    }

    setTimeout(() => {
      this.isOpen = true;
      audioManager.playVictory();
      if (this.onEscapeSuccess) {
        this.onEscapeSuccess();
      }
    }, 2200);
  }

  update(delta) {
    if (this.isOpening && this.leftDoor && this.rightDoor) {
      if (this.leftDoor.rotation.y > -Math.PI / 1.7) {
        this.leftDoor.rotation.y -= delta * 1.5;
      }
      if (this.rightDoor.rotation.y < Math.PI / 1.7) {
        this.rightDoor.rotation.y += delta * 1.5;
      }
    }
  }

  reset() {
    this.isOpen = false;
    this.isOpening = false;
    if (this.leftDoor) this.leftDoor.rotation.y = 0;
    if (this.rightDoor) this.rightDoor.rotation.y = 0;
    for (let i = 0; i < this.lockMeshes.length; i++) {
      this.lockMeshes[i].visible = true;
    }
    if (this.exitLight) {
      this.exitLight.intensity = 0.0;
    }
  }
}
