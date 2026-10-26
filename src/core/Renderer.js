import * as THREE from 'three';

/**
 * Three.js Renderer & Scene Setup
 * Optimized WebGL pipeline, controlled pixel ratio, smooth shadow mapping.
 */
export class Renderer {
  constructor(container) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070a, 0.038);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    );
    this.scene.add(this.camera);

    // 3. WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio to 1.5 max for stellar performance on retina / 4K monitors
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setGraphicsQuality(level) {
    if (level === 'low') {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(0.85);
    } else if (level === 'medium') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.setPixelRatio(1.0);
    } else {
      // High
      this.renderer.shadowMap.enabled = true;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }
    this.renderer.shadowMap.needsUpdate = true;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
