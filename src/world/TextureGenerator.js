import * as THREE from 'three';

/**
 * Procedural Texture Generator
 * Generates rich procedural textures via HTML5 Canvas for Three.js materials.
 * 100% self-contained, no external URLs or assets needed.
 */
export class TextureGenerator {
  static createWoodFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base dark weathered wood color
    ctx.fillStyle = '#261b14';
    ctx.fillRect(0, 0, 512, 512);

    // Plank lines
    const plankHeight = 64;
    for (let y = 0; y < 512; y += plankHeight) {
      // Staggered planks
      const offset = (y / plankHeight) % 2 === 0 ? 0 : 128;
      for (let x = -128 + offset; x < 512; x += 256) {
        ctx.fillStyle = (Math.random() > 0.5) ? '#2c2018' : '#1e140d';
        ctx.fillRect(x + 2, y + 2, 252, plankHeight - 4);

        // Wood grain lines
        ctx.strokeStyle = 'rgba(10, 6, 4, 0.45)';
        ctx.lineWidth = 1;
        for (let g = 0; g < 12; g++) {
          const gy = y + Math.random() * plankHeight;
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(
            x + 80, gy + (Math.random() * 6 - 3),
            x + 180, gy + (Math.random() * 6 - 3),
            x + 256, gy
          );
          ctx.stroke();
        }

        // Grime & water stains
        if (Math.random() > 0.6) {
          ctx.fillStyle = 'rgba(8, 5, 2, 0.5)';
          ctx.beginPath();
          ctx.arc(x + Math.random() * 200, y + Math.random() * plankHeight, 15 + Math.random() * 25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Deep dark gap between planks
      ctx.fillStyle = '#0a0604';
      ctx.fillRect(0, y, 512, 3);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static createWallpaperTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Decayed Victorian vintage wallpaper: sickly faded greenish-cream / yellowed paper
    ctx.fillStyle = '#443f33';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle damask floral pattern
    ctx.strokeStyle = 'rgba(50, 42, 32, 0.5)';
    ctx.lineWidth = 2;
    for (let y = 32; y < 512; y += 64) {
      for (let x = 32; x < 512; x += 64) {
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 12, y);
        ctx.lineTo(x + 12, y);
        ctx.moveTo(x, y - 12);
        ctx.lineTo(x, y + 12);
        ctx.stroke();
      }
    }

    // Heavy water stains, mould and decay
    for (let i = 0; i < 20; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rad = 25 + Math.random() * 60;
      const grad = ctx.createRadialGradient(rx, ry, 5, rx, ry, rad);
      grad.addColorStop(0, 'rgba(20, 22, 16, 0.75)');
      grad.addColorStop(0.6, 'rgba(38, 30, 20, 0.4)');
      grad.addColorStop(1, 'rgba(68, 63, 51, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(rx - rad, ry - rad, rad * 2, rad * 2);
    }

    // Peeling scratches
    ctx.strokeStyle = 'rgba(15, 12, 8, 0.8)';
    ctx.lineWidth = 1.5;
    for (let j = 0; j < 30; j++) {
      const sx = Math.random() * 512;
      const sy = Math.random() * 512;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() * 40 - 20), sy + Math.random() * 50);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static createBasementConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Cold, damp charcoal concrete
    ctx.fillStyle = '#1c1f21';
    ctx.fillRect(0, 0, 512, 512);

    // Noise specks
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 35;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Deep jagged cracks
    ctx.strokeStyle = '#08090a';
    ctx.lineWidth = 2;
    for (let c = 0; c < 6; c++) {
      let cx = Math.random() * 512;
      let cy = Math.random() * 512;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let seg = 0; seg < 8; seg++) {
        cx += (Math.random() - 0.5) * 60;
        cy += (Math.random() - 0.5) * 60;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Damp water puddles
    ctx.fillStyle = 'rgba(5, 10, 12, 0.6)';
    for (let p = 0; p < 8; p++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 512, 40 + Math.random() * 50, 20 + Math.random() * 30, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static createRustedMetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Dark iron base
    ctx.fillStyle = '#222326';
    ctx.fillRect(0, 0, 256, 256);

    // Corroded rust patches
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * 256;
      const ry = Math.random() * 256;
      const rad = 10 + Math.random() * 35;
      const grad = ctx.createRadialGradient(rx, ry, 2, rx, ry, rad);
      grad.addColorStop(0, '#592512');
      grad.addColorStop(0.5, '#783515');
      grad.addColorStop(1, 'rgba(34, 35, 38, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(rx - rad, ry - rad, rad * 2, rad * 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  static createPlasterCeilingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2c2a26';
    ctx.fillRect(0, 0, 256, 256);

    // Stains
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = 20 + Math.random() * 40;
      ctx.fillStyle = 'rgba(18, 16, 12, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static createDoorWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e140d';
    ctx.fillRect(0, 0, 256, 512);

    // Panels
    ctx.strokeStyle = '#0e0906';
    ctx.lineWidth = 6;
    // Top panel
    ctx.strokeRect(24, 30, 208, 190);
    // Bottom panel
    ctx.strokeRect(24, 260, 208, 220);

    // Dark grooves & scratches
    ctx.strokeStyle = 'rgba(8, 5, 2, 0.5)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, Math.random() * 512);
      ctx.lineTo(Math.random() * 256, Math.random() * 512);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  static createBrassKeyTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 128, 128);
    grad.addColorStop(0, '#ffd700');
    grad.addColorStop(0.3, '#ffae19');
    grad.addColorStop(0.7, '#8a6208');
    grad.addColorStop(1, '#ffeb7a');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  static createEntitySkinTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Sickly, decaying, dull mustard/yellow skin
    ctx.fillStyle = '#bfa532';
    ctx.fillRect(0, 0, 512, 512);

    // Mottled discoloration patches (jaundice, necrosis)
    for (let i = 0; i < 50; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      const rad = 20 + Math.random() * 50;
      const grad = ctx.createRadialGradient(px, py, 2, px, py, rad);
      grad.addColorStop(0, 'rgba(85, 70, 15, 0.6)');
      grad.addColorStop(0.7, 'rgba(140, 115, 25, 0.3)');
      grad.addColorStop(1, 'rgba(191, 165, 50, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(px - rad, py - rad, rad * 2, rad * 2);
    }

    // Dark bulging veins
    ctx.strokeStyle = 'rgba(45, 38, 12, 0.7)';
    ctx.lineWidth = 1.8;
    for (let v = 0; v < 15; v++) {
      let vx = Math.random() * 512;
      let vy = Math.random() * 512;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      for (let step = 0; step < 6; step++) {
        vx += (Math.random() - 0.5) * 50;
        vy += (Math.random() - 0.5) * 50;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}
