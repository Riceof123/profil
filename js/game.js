/* ========================================================
   CYBER SURVIVOR 2D - MAIN GAME ENGINE
   Game Loop, Camera, Physics, Rendering, & State Machine
   ======================================================== */

class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
  }

  follow(targetX, targetY, arena, dt) {
    this.targetX = targetX;
    this.targetY = targetY;

    // Smooth lerp follow
    const lerpFactor = 8 * dt;
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;

    // Shake update
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      if (this.shakeDuration <= 0) this.shakeIntensity = 0;
    }
  }

  shake(intensity, duration) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = Math.max(this.shakeDuration, duration);
  }

  getOffset() {
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeDuration > 0) {
      shakeX = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * 2 * this.shakeIntensity;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    return {
      x: vw / 2 - this.x + shakeX,
      y: vh / 2 - this.y + shakeY
    };
  }

  worldToScreen(wx, wy) {
    const offset = this.getOffset();
    return {
      x: wx + offset.x,
      y: wy + offset.y
    };
  }

  screenToWorld(sx, sy) {
    const offset = this.getOffset();
    return {
      x: sx - offset.x,
      y: sy - offset.y
    };
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Core systems
    this.input = new InputManager(this.canvas);
    this.arsenal = new WeaponArsenal();
    this.levelManager = new LevelManager(this);
    this.camera = new Camera(this.canvas);
    
    // Entities
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.obstacles = [];
    this.boss = null;

    // Arena dimensions
    this.arena = { width: 1600, height: 1600 };

    // Game loop timing
    this.lastTime = performance.now();
    this.state = 'START_MENU'; // 'START_MENU', 'PLAYING', 'LEVEL_CLEAR', 'GAME_OVER', 'VICTORY'

    this.initResize();
    this.bindUI();
    this.setupLevel(0);
    this.render(); // Initial render for background
  }

  initResize() {
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      this.dpr = dpr;
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 200));
    resize();
  }

  bindUI() {
    // Start game button
    document.getElementById('start-btn').addEventListener('click', () => {
      this.hideAllModals();
      this.startGame();
    });

    // Next level button
    document.getElementById('next-level-btn').addEventListener('click', () => {
      this.hideAllModals();
      const cfg = this.levelManager.nextLevel();
      if (cfg) {
        this.setupLevel(this.levelManager.currentLevelIndex);
        this.state = 'PLAYING';
      }
    });

    // Retry button (Game Over)
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.hideAllModals();
      this.setupLevel(this.levelManager.currentLevelIndex);
      this.state = 'PLAYING';
    });

    // Victory play again button
    document.getElementById('victory-restart-btn').addEventListener('click', () => {
      this.hideAllModals();
      this.arsenal = new WeaponArsenal();
      this.setupLevel(0);
      this.state = 'PLAYING';
    });

    // Audio mute button
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.soundManager.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }

    // Mobile quick weapon switch button
    const quickSwitchBtn = document.getElementById('quick-switch-btn');
    if (quickSwitchBtn) {
      quickSwitchBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.cycleWeapon(1);
      }, { passive: false });
      quickSwitchBtn.addEventListener('click', () => {
        this.cycleWeapon(1);
      });
    }

    // Weapon slot UI clicks
    document.querySelectorAll('.weapon-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const idx = parseInt(slot.dataset.index, 10);
        this.switchWeaponByIndex(idx);
      });
      slot.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const idx = parseInt(slot.dataset.index, 10);
        this.switchWeaponByIndex(idx);
      }, { passive: false });
    });
  }

  hideAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  showModal(id) {
    this.hideAllModals();
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  setupLevel(levelIndex) {
    const config = this.levelManager.loadLevel(levelIndex);
    this.arena = { ...config.arena };

    // Reset entities
    this.player = new Player(this.arena.width / 2, this.arena.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.boss = null;

    // Reset camera position directly to player
    this.camera.x = this.player.x;
    this.camera.y = this.player.y;

    // Generate tactical obstacles/crates around arena
    this.generateObstacles();

    // Refill ammo each level
    this.arsenal.refillAllAmmo();

    // UI Updates
    document.getElementById('level-name').textContent = `LEVEL ${config.level} / 5`;
    this.updateHUD();
    this.showBanner(`SIAP? ${config.title}!`);
  }

  generateObstacles() {
    this.obstacles = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const ox = 150 + Math.random() * (this.arena.width - 300);
      const oy = 150 + Math.random() * (this.arena.height - 300);
      // Avoid spawning right on player center
      if (Math.hypot(ox - this.arena.width / 2, oy - this.arena.height / 2) > 220) {
        this.obstacles.push({
          x: ox,
          y: oy,
          width: 70 + Math.random() * 30,
          height: 70 + Math.random() * 30
        });
      }
    }
  }

  startGame() {
    this.setupLevel(0);
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  switchWeaponByIndex(idx) {
    this.arsenal.select(idx);
    this.updateWeaponHUD();
  }

  cycleWeapon(dir) {
    this.arsenal.cycle(dir);
    this.updateWeaponHUD();
  }

  showBanner(msg) {
    const banner = document.getElementById('floating-msg');
    if (banner) {
      banner.textContent = msg;
      banner.style.opacity = '1';
      banner.style.transform = 'translate(-50%, -50%) scale(1.1)';
      setTimeout(() => {
        banner.style.opacity = '0';
        banner.style.transform = 'translate(-50%, -60%) scale(0.9)';
      }, 2200);
    }
  }

  spawnEnemyBullet(x, y, angle, speed, damage, radius, color) {
    this.projectiles.push(new Projectile(x, y, angle, speed, damage, radius, color, true));
  }

  // --- OBSTACLE COLLISION HELPER ---
  resolveCircleBoxCollision(circle, box) {
    const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));
    const distX = circle.x - closestX;
    const distY = circle.y - closestY;
    const dist = Math.hypot(distX, distY);

    if (dist < circle.radius && dist > 0) {
      const overlap = circle.radius - dist;
      circle.x += (distX / dist) * overlap;
      circle.y += (distY / dist) * overlap;
    }
  }

  // --- WEAPON SHOOTING LOGIC ---
  handlePlayerShooting(currentTime) {
    if (!this.input.isFiring) return;
    const weapon = this.arsenal.getCurrentWeapon();

    if (weapon.canFire(currentTime)) {
      weapon.trigger(currentTime);

      // Audio
      window.soundManager.playShoot(weapon.id);

      // Recoil & Camera Shake
      this.camera.shake(weapon.recoil, 0.1);

      // Muzzle flash particle
      const spawnX = this.player.x + Math.cos(this.player.angle) * (this.player.radius + 15);
      const spawnY = this.player.y + Math.sin(this.player.angle) * (this.player.radius + 15);

      for (let p = 0; p < weapon.pellets; p++) {
        const spreadOffset = (Math.random() - 0.5) * weapon.spread;
        const fireAngle = this.player.angle + spreadOffset;

        this.projectiles.push(
          new Projectile(
            spawnX,
            spawnY,
            fireAngle,
            weapon.speed,
            weapon.damage,
            weapon.bulletRadius,
            weapon.color,
            false,
            weapon.splashRadius
          )
        );
      }

      this.updateWeaponHUD();
    }
  }

  // --- EXPLOSIONS & PARTICLES ---
  createExplosion(x, y, radius, damage, color = '#ff3366') {
    if (window.soundManager) window.soundManager.playExplosion();
    this.camera.shake(16, 0.3);

    // Shockwave particle ring
    for (let i = 0; i < 28; i++) {
      this.particles.push(new Particle(x, y, color, 300, 6, 0.5));
    }

    // Damage enemies in splash radius
    this.enemies.forEach(enemy => {
      const dist = Math.hypot(enemy.x - x, enemy.y - y);
      if (dist < radius + enemy.radius) {
        const falloff = 1 - (dist / (radius + enemy.radius));
        const effectiveDamage = Math.round(damage * Math.max(0.4, falloff));
        enemy.takeDamage(effectiveDamage);
        this.floatingTexts.push(new FloatingText(enemy.x, enemy.y - 15, `${effectiveDamage}`, '#ff0055', 20));

        if (!enemy.alive) {
          this.handleEnemyDeath(enemy);
        }
      }
    });
  }

  handleEnemyDeath(enemy) {
    if (window.soundManager) window.soundManager.playHit();
    this.levelManager.onEnemyKilled();

    if (enemy === this.boss) {
      this.boss = null;
    }

    // Death particles
    const pCount = enemy.isBoss ? 60 : 18;
    for (let i = 0; i < pCount; i++) {
      this.particles.push(new Particle(enemy.x, enemy.y, enemy.color, 190, 5, 0.6));
    }

    // Chance to drop pickup item (Health, Ammo, Shield)
    const dropRoll = Math.random();
    if (dropRoll < 0.38 || enemy.isBoss) {
      let type = 'ammo';
      if (dropRoll < 0.15 || this.player.health < 40) type = 'health';
      else if (dropRoll < 0.26) type = 'shield';
      this.pickups.push(new Pickup(enemy.x, enemy.y, type));
    }

    this.updateHUD();

    // Check Level Complete
    if (this.levelManager.isLevelComplete()) {
      setTimeout(() => this.triggerLevelComplete(), 600);
    }
  }

  triggerLevelComplete() {
    if (this.state !== 'PLAYING') return;

    if (this.levelManager.hasNextLevel()) {
      this.state = 'LEVEL_CLEAR';
      if (window.soundManager) window.soundManager.playLevelComplete();
      document.getElementById('cleared-level-title').textContent = `${this.levelManager.currentConfig.title} BERHASIL DIATASI!`;
      document.getElementById('cleared-summary').textContent = `Semua ${this.levelManager.currentConfig.totalEnemies} musuh berhasil dimusnahkan. Bersiap untuk sektor berikutnya!`;
      this.showModal('level-clear-modal');
    } else {
      // VICTORY!
      this.state = 'VICTORY';
      if (window.soundManager) window.soundManager.playVictory();
      this.showModal('victory-modal');
    }
  }

  triggerGameOver() {
    if (this.state !== 'PLAYING') return;
    this.state = 'GAME_OVER';
    if (window.soundManager) window.soundManager.playGameOver();
    document.getElementById('gameover-level-info').textContent = `Gugur pada ${this.levelManager.currentConfig.title}.`;
    this.showModal('game-over-modal');
  }

  // --- GAME LOOP ---
  loop(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    if (this.state === 'PLAYING') {
      this.update(dt, now / 1000);
    }

    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt, currentTime) {
    // 0. Update Aim tracking
    this.input.updateAim(this.camera, this.player);

    // 1. Update Player
    this.player.update(dt, this.input, this.arena);
    
    // Player vs Obstacles collision
    for (const obs of this.obstacles) {
      this.resolveCircleBoxCollision(this.player, obs);
    }

    this.handlePlayerShooting(currentTime);

    if (!this.player.alive) {
      this.triggerGameOver();
      return;
    }

    // 2. Camera follow
    this.camera.follow(this.player.x, this.player.y, this.arena, dt);

    // 3. Level Spawner
    this.levelManager.update(dt, this.player, this.arena);

    // 4. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      const alive = proj.update(dt, this.arena);
      if (!alive) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check Obstacle collision
      let hitObstacle = false;
      for (const obs of this.obstacles) {
        if (
          proj.x >= obs.x && proj.x <= obs.x + obs.width &&
          proj.y >= obs.y && proj.y <= obs.y + obs.height
        ) {
          hitObstacle = true;
          break;
        }
      }

      if (hitObstacle) {
        if (proj.splashRadius > 0) {
          this.createExplosion(proj.x, proj.y, proj.splashRadius, proj.damage, proj.color);
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      // Player projectile vs Enemies
      if (!proj.isEnemy) {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
          if (dist < proj.radius + enemy.radius) {
            if (proj.splashRadius > 0) {
              this.createExplosion(proj.x, proj.y, proj.splashRadius, proj.damage, proj.color);
            } else {
              enemy.takeDamage(proj.damage);
              this.floatingTexts.push(new FloatingText(enemy.x, enemy.y - 12, `-${proj.damage}`, '#ffcc00', 16));
              if (window.soundManager) window.soundManager.playHit();

              if (!enemy.alive) {
                this.handleEnemyDeath(enemy);
                this.enemies.splice(j, 1);
              }
            }
            this.projectiles.splice(i, 1);
            break;
          }
        }
      } else {
        // Enemy projectile vs Player
        const pDist = Math.hypot(proj.x - this.player.x, proj.y - this.player.y);
        if (pDist < proj.radius + this.player.radius) {
          this.player.takeDamage(proj.damage);
          this.camera.shake(10, 0.2);
          this.projectiles.splice(i, 1);
          this.updateHUD();
        }
      }
    }

    // 5. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player, this.arena, this);

      // Enemy vs Obstacles
      for (const obs of this.obstacles) {
        this.resolveCircleBoxCollision(enemy, obs);
      }

      if (!enemy.alive) {
        this.enemies.splice(i, 1);
      }
    }

    // 6. Update Pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pickup = this.pickups[i];
      const valid = pickup.update(dt);
      if (!valid) {
        this.pickups.splice(i, 1);
        continue;
      }

      // Player touch pickup
      const dist = Math.hypot(this.player.x - pickup.x, this.player.y - pickup.y);
      if (dist < this.player.radius + pickup.radius) {
        if (pickup.type === 'health') {
          this.player.heal(35);
          this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 20, '+35 HP', '#00ff88', 18));
        } else if (pickup.type === 'ammo') {
          this.arsenal.refillAllAmmo();
          this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 20, '+AMMO FULL', '#ffcc00', 18));
        } else if (pickup.type === 'shield') {
          this.player.rechargeShield(50);
          this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 20, '+50 SHIELD', '#00f0ff', 18));
        }

        if (window.soundManager) window.soundManager.playPickup();
        this.pickups.splice(i, 1);
        this.updateHUD();
      }
    }

    // 7. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update(dt)) {
        this.particles.splice(i, 1);
      }
    }

    // 8. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      if (!this.floatingTexts[i].update(dt)) {
        this.floatingTexts.splice(i, 1);
      }
    }

    this.updateHUD();
  }

  // --- HUD SYNC ---
  updateHUD() {
    if (!this.player) return;

    // Health Fill
    const hpPct = Math.max(0, (this.player.health / this.player.maxHealth) * 100);
    document.getElementById('health-bar').style.width = `${hpPct}%`;

    // Shield Fill
    const spPct = Math.max(0, (this.player.shield / this.player.maxShield) * 100);
    document.getElementById('shield-bar').style.width = `${spPct}%`;

    // Enemies remaining
    const enemiesLeft = this.levelManager.getEnemiesRemaining();
    document.getElementById('enemies-left').textContent = enemiesLeft;

    // Boss Bar
    const bossContainer = document.getElementById('boss-bar-container');
    if (bossContainer) {
      if (this.boss && this.boss.alive) {
        bossContainer.classList.remove('hidden');
        const bossPct = Math.max(0, (this.boss.health / this.boss.maxHealth) * 100);
        document.getElementById('boss-hp-fill').style.width = `${bossPct}%`;
      } else {
        bossContainer.classList.add('hidden');
      }
    }

    this.updateWeaponHUD();
  }

  updateWeaponHUD() {
    const curIdx = this.arsenal.currentIndex;
    document.querySelectorAll('.weapon-slot').forEach(slot => {
      const idx = parseInt(slot.dataset.index, 10);
      const weapon = this.arsenal.weapons[idx];
      slot.classList.toggle('active', idx === curIdx);

      const ammoEl = slot.querySelector('.weapon-ammo');
      if (ammoEl && weapon) {
        ammoEl.textContent = weapon.ammo === Infinity ? '∞' : weapon.ammo;
      }
    });
  }

  // --- RENDERING ---
  render() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const offset = this.camera.getOffset();
    this.ctx.save();
    this.ctx.translate(offset.x, offset.y);

    // Draw Arena Floor & Grid
    this.drawArena();

    // Draw Pickups
    this.pickups.forEach(p => p.draw(this.ctx));

    // Draw Obstacles
    this.drawObstacles();

    // Draw Enemies
    this.enemies.forEach(e => e.draw(this.ctx, this.player));

    // Draw Projectiles
    this.projectiles.forEach(p => p.draw(this.ctx));

    // Draw Player
    if (this.player) {
      this.player.draw(this.ctx);
    }

    // Draw Particles
    this.particles.forEach(p => p.draw(this.ctx));

    // Draw Floating Texts
    this.floatingTexts.forEach(t => t.draw(this.ctx));

    this.ctx.restore();
  }

  drawArena() {
    // Dark floor
    this.ctx.fillStyle = '#090e17';
    this.ctx.fillRect(0, 0, this.arena.width, this.arena.height);

    // Grid lines
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    this.ctx.lineWidth = 1;
    const gridSize = 80;

    this.ctx.beginPath();
    for (let x = 0; x <= this.arena.width; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.arena.height);
    }
    for (let y = 0; y <= this.arena.height; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.arena.width, y);
    }
    this.ctx.stroke();

    // Glowing Arena Border
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 6;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 18;
    this.ctx.strokeRect(0, 0, this.arena.width, this.arena.height);
    this.ctx.shadowBlur = 0;
  }

  drawObstacles() {
    this.ctx.save();
    this.obstacles.forEach(obs => {
      // Drop Shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(obs.x + 8, obs.y + 8, obs.width, obs.height);

      // Crate body
      this.ctx.fillStyle = '#1e293b';
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      this.ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

      // Tech details on crate
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.strokeRect(obs.x + 8, obs.y + 8, obs.width - 16, obs.height - 16);
    });
    this.ctx.restore();
  }
}

// Instantiate and start when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
