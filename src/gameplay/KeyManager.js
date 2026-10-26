import * as THREE from 'three';
import { audioManager } from '../core/AudioManager.js';

/**
 * Manages the 15 collectible keys throughout the house.
 * Optimized: Uses high-performance emissive materials and shared geometry instead of 15 PointLights.
 */
export class KeyManager {
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
    this.keys = [];
    this.collectedCount = 0;
    this.totalKeys = 15;
    this.onAllKeysCollected = null;

    this.keyLocations = [
      { id: 1, name: 'Awakening Room', x: -11.5, y: 4 + 0.95, z: 15.5, desc: 'Di meja nakas samping kasur' },
      { id: 2, name: 'Upper Hallway', x: 0.0, y: 4 + 1.2, z: 12.0, desc: 'Di lorong atas bawah lampu' },
      { id: 3, name: 'Master Bedroom Vanity', x: 7.0, y: 4 + 0.88, z: 14.0, desc: 'Di meja rias antik' },
      { id: 4, name: 'Master Closet', x: 14.0, y: 4 + 0.6, z: 8.0, desc: 'Di dalam lemari pakaian kayu' },
      { id: 5, name: 'Guest Bedroom', x: 13.0, y: 4 + 0.45, z: -5.0, desc: 'Di samping tempat tidur twin' },
      { id: 6, name: 'Abandoned Nursery', x: -8.0, y: 4 + 0.85, z: -6.0, desc: 'Di atas peti mainan kayu tua' },
      { id: 7, name: 'Upstairs Bathroom', x: -14.0, y: 4 + 0.95, z: -9.0, desc: 'Di tepi bak mandi tua' },
      { id: 8, name: 'Living Room Mantle', x: -16.2, y: 0 + 2.05, z: 10.0, desc: 'Di atas perapian ruang tamu' },
      { id: 9, name: 'Living Room Bookshelf', x: -6.0, y: 0 + 1.2, z: 15.0, desc: 'Di rak buku roboh' },
      { id: 10, name: 'Dining Room Table', x: 10.0, y: 0 + 0.95, z: 10.0, desc: 'Di tengah meja makan panjang' },
      { id: 11, name: 'Kitchen Counter', x: 10.0, y: 0 + 0.95, z: -1.6, desc: 'Di sebelah wastafel dapur berkarat' },
      { id: 12, name: 'Kitchen Pantry', x: 14.0, y: 0 + 0.6, z: -8.0, desc: 'Di rak bawah tempat penyimpanan' },
      { id: 13, name: 'Storage Crates', x: -11.4, y: 0 + 2.45, z: -5.4, desc: 'Di atas tumpukan peti kayu' },
      { id: 14, name: 'Basement Workbench', x: 0.0, y: -4 + 0.95, z: 4.0, desc: 'Di meja kerja besi ruang bawah tanah' },
      { id: 15, name: 'Deep Boiler Room', x: -10.0, y: -4 + 1.2, z: -8.0, desc: 'Di balik pipa tungku pemanas raksasa' }
    ];

    this.createKeyMeshTemplate();
    this.spawnKeys();
  }

  createKeyMeshTemplate() {
    const keyGroup = new THREE.Group();

    // High performance glowing brass material without heavy point lights
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xffca28,
      roughness: 0.25,
      metalness: 0.9,
      emissive: 0xffaa00,
      emissiveIntensity: 0.55
    });

    // Bow (Handle Ring)
    const ringGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
    const ring = new THREE.Mesh(ringGeo, brassMat);
    ring.rotation.x = Math.PI / 2;
    keyGroup.add(ring);

    // Stem (Shaft)
    const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8);
    const stem = new THREE.Mesh(stemGeo, brassMat);
    stem.position.set(0, 0, 0.25);
    stem.rotation.x = Math.PI / 2;
    keyGroup.add(stem);

    // Bit (Teeth)
    const bitGeo = new THREE.BoxGeometry(0.02, 0.08, 0.08);
    const bit = new THREE.Mesh(bitGeo, brassMat);
    bit.position.set(0, 0.04, 0.38);
    keyGroup.add(bit);

    // Subtle aura halo ring for visibility in darkness
    const haloGeo = new THREE.RingGeometry(0.18, 0.22, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffea00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    keyGroup.add(halo);

    this.keyTemplate = keyGroup;
  }

  spawnKeys() {
    this.keyLocations.forEach(loc => {
      const keyInstance = this.keyTemplate.clone();
      keyInstance.position.set(loc.x, loc.y, loc.z);
      keyInstance.userData = {
        isKey: true,
        id: loc.id,
        name: loc.name,
        desc: loc.desc,
        baseY: loc.y,
        collected: false
      };

      this.scene.add(keyInstance);
      this.keys.push(keyInstance);
    });
  }

  update(time) {
    // Smooth floating and rotating animation
    for (let i = 0; i < this.keys.length; i++) {
      const key = this.keys[i];
      if (!key.userData.collected) {
        key.rotation.y = time * 1.6;
        key.position.y = key.userData.baseY + Math.sin(time * 3 + key.userData.id) * 0.05;
      }
    }
  }

  collectKey(keyMesh) {
    if (!keyMesh || !keyMesh.userData.isKey || keyMesh.userData.collected) return;

    keyMesh.userData.collected = true;
    this.collectedCount++;

    audioManager.playKeyPickup();
    this.scene.remove(keyMesh);

    if (this.uiManager) {
      this.uiManager.updateKeyCount(this.collectedCount, this.totalKeys);
      this.uiManager.showToast(`Kunci #${this.collectedCount} Ditemukan: ${keyMesh.userData.name}`, 'gold');
    }

    if (this.collectedCount >= this.totalKeys) {
      if (this.uiManager) {
        this.uiManager.showToast('SEMUA 15 KUNCI BERHASIL TERKUMPUL! Pintu Keluar Utama terbuka!', 'red', 8000);
      }
      if (this.onAllKeysCollected) {
        this.onAllKeysCollected();
      }
    }
  }

  reset() {
    for (let i = 0; i < this.keys.length; i++) {
      this.scene.remove(this.keys[i]);
    }
    this.keys = [];
    this.collectedCount = 0;
    this.spawnKeys();
    if (this.uiManager) {
      this.uiManager.updateKeyCount(0, this.totalKeys);
    }
  }
}
