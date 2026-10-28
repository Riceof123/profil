/**
 * CYBER STRIKE 2D - Core Game Engine
 * Manages game loop, levels, camera, collisions, combat, HUD, and mobile scaling
 */

const STATE_START = 'START';
const STATE_PLAYING = 'PLAYING';
const STATE_LEVEL_CLEAR = 'LEVEL_CLEAR';
const STATE_GAME_OVER = 'GAME_OVER';
const STATE_VICTORY = 'VICTORY';
const STATE_PAUSED = 'PAUSED';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.state = STATE_START;
    this.previousState = STATE_START;

    // Viewport & Scaling
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isPortrait = this.height > this.width;
    this.zoom = 1.0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Levels & Arsenal
    this.currentLevelIndex = 0; // 0 to 4 (5 Levels)
    this.levelConfig = LEVELS_CONFIG[0];
    this.unlockedWeapons = new Set(['pistol', 'shotgun']); // Default starting arsenal

    // Difficulty Settings (Mudah, Normal, Sulit, Extreme, Neraka)
    this.selectedDifficulty = DIFFICULTIES.normal;

    // Game stats
    this.score = 0;
    this.totalKills = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;

    // High-performance Particle Pool (Zero GC allocation)
    this.particlePool = new ParticlePool(140);
    this.particles = this.particlePool;

    // Entities
    this.player = null;
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.pickups = [];

    // Performance Monitoring & Auto-Optimization
    this.performanceMode = false;
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.lowFpsCount = 0;

    // Spawning system
    this.spawnTimer = 0;
    this.remainingEnemiesToSpawn = [];
    this.totalLevelEnemies = 0;

    // Camera & Screen Shake
    this.camera = { x: 0, y: 0 };
    this.screenShake = 0;

    // Weapon firing
    this.lastShootTime = 0;

    // 3 Skills System & Ultimate Nuke Flash
    this.skillManager = new SkillManager(this);
    this.nukeFlashTimer = 0;

    // Systems
    this.controls = new InputController(this.canvas);
    this.lastTime = performance.now();

    // DOM UI Elements
    this.initDOMRefs();
    this.bindEvents();
    this.resizeCanvas();
    this.renderWeaponSlots();

    // Start render loop
    requestAnimationFrame((t) => this.loop(t));
  }

  initDOMRefs() {
    this.hpBar = document.getElementById('hp-bar');
    this.hpText = document.getElementById('hp-text');
    this.levelDisplay = document.getElementById('level-display');
    this.difficultyBadge = document.getElementById('difficulty-badge');
    this.fpsDisplay = document.getElementById('fps-display');
    this.enemyCount = document.getElementById('enemy-count');
    this.scoreText = document.getElementById('score-text');
    this.weaponContainer = document.getElementById('weapon-slots-container');
    this.alertBanner = document.getElementById('alert-banner');
    this.alertText = document.getElementById('alert-text');
    this.diffDesc = document.getElementById('diff-description');

    // Initialize Skill Manager DOM
    this.skillManager.initDOM();

    // Modals
    this.screenStart = document.getElementById('screen-start');
    this.screenLevelClear = document.getElementById('screen-level-clear');
    this.screenGameOver = document.getElementById('screen-game-over');
    this.screenVictory = document.getElementById('screen-victory');
    this.screenPause = document.getElementById('screen-pause');

    // Level Clear stats
    this.levelClearTitle = document.getElementById('level-clear-title');
    this.statLevelKills = document.getElementById('stat-level-kills');
    this.statLevelAccuracy = document.getElementById('stat-level-accuracy');
    this.statLevelScore = document.getElementById('stat-level-score');
    this.unlockAnnouncement = document.getElementById('unlock-announcement');
    this.unlockName = document.getElementById('unlock-name');
    this.unlockDesc = document.getElementById('unlock-desc');

    // Game Over stats
    this.overLevel = document.getElementById('over-level');
    this.overScore = document.getElementById('over-score');
    this.overKills = document.getElementById('over-kills');

    // Victory stats
    this.victoryScore = document.getElementById('victory-score');
    this.victoryKills = document.getElementById('victory-kills');
  }

  bindEvents() {
    // Window Resize & Orientation
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resizeCanvas(), 200);
    });

    // Start Screen Button
    document.getElementById('btn-start-game').addEventListener('click', () => {
      window.soundFx.init();
      this.startLevel(0);
      this.screenStart.classList.add('hidden');
    });

    // Difficulty Selector Buttons (Mudah, Normal, Sulit, Extreme, Neraka)
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const diffKey = btn.dataset.diff;
        if (DIFFICULTIES[diffKey]) {
          this.selectedDifficulty = DIFFICULTIES[diffKey];
          document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (this.diffDesc) {
            this.diffDesc.textContent = this.selectedDifficulty.desc;
          }
          this.updateDifficultyBadge();
          window.soundFx.init();
          window.soundFx.vibrate(25);
        }
      });
    });

    // Next Level Button
    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.screenLevelClear.classList.add('hidden');
      if (this.currentLevelIndex + 1 < LEVELS_CONFIG.length) {
        this.startLevel(this.currentLevelIndex + 1);
      } else {
        this.showVictoryScreen();
      }
    });

    // Retry Level Button
    document.getElementById('btn-retry-level').addEventListener('click', () => {
      this.screenGameOver.classList.add('hidden');
      this.startLevel(this.currentLevelIndex);
    });

    // Restart Whole Game Button
    document.getElementById('btn-restart-game').addEventListener('click', () => {
      this.screenGameOver.classList.add('hidden');
      this.score = 0;
      this.totalKills = 0;
      this.unlockedWeapons = new Set(['pistol', 'shotgun']);
      this.controls.selectedWeaponIndex = 0;
      this.skillManager.resetAll(); // Reset single-use nuke and all skills
      this.startLevel(0);
    });

    // Play Again Button (Victory)
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.screenVictory.classList.add('hidden');
      this.score = 0;
      this.totalKills = 0;
      this.unlockedWeapons = new Set(['pistol', 'shotgun']);
      this.controls.selectedWeaponIndex = 0;
      this.skillManager.resetAll(); // Reset single-use nuke and all skills
      this.startLevel(0);
    });

    // Pause Resume & Restart Buttons
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('btn-restart-from-pause').addEventListener('click', () => {
      this.togglePause();
      this.startLevel(this.currentLevelIndex);
    });
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isPortrait = this.height > this.width;

    // Mobile / Touch Optimization:
    // Retina & OLED phones often have DPR 2.5 - 3.5, which causes heavy GPU fill-rate load.
    // Locking DPR to 1 on touch or performance mode ensures rock-solid 60+ FPS on Android & iOS.
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.dpr = (this.performanceMode || isTouch) ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    // Dynamic Camera Zoom for Portrait Mode:
    // In portrait mode, horizontal width is narrow (~360-420px). Zooming out slightly
    // expands horizontal visibility to ~480-520px so enemies and hazards are clearly visible.
    if (this.isPortrait && this.width < 580) {
      this.zoom = Math.max(0.72, Math.min(1.0, this.width / 490));
    } else {
      this.zoom = 1.0;
    }

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);

    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);
  }

  setPerformanceMode(enabled) {
    this.performanceMode = enabled;
    this.resizeCanvas();
    this.showAlert(enabled ? 'MODE PERFORMA AKTIF (60+ FPS)' : 'KUALITAS GRAFIS TINGGI', 1800);
  }

  updateDifficultyBadge() {
    if (this.difficultyBadge && this.selectedDifficulty) {
      this.difficultyBadge.textContent = this.selectedDifficulty.name.toUpperCase();
      this.difficultyBadge.className = `badge-diff ${this.selectedDifficulty.badgeClass}`;
    }
  }

  // ----------------------------------------------------
  // WEAPONS ARSENAL MANAGEMENT
  // ----------------------------------------------------
  isWeaponUnlocked(index) {
    if (index < 0 || index >= WEAPONS.length) return false;
    const weapon = WEAPONS[index];
    return this.unlockedWeapons.has(weapon.id);
  }

  cycleWeapon(dir) {
    const total = WEAPONS.length;
    let nextIdx = this.controls.selectedWeaponIndex;
    for (let i = 0; i < total; i++) {
      nextIdx = (nextIdx + dir + total) % total;
      if (this.isWeaponUnlocked(nextIdx)) {
        this.controls.selectedWeaponIndex = nextIdx;
        this.updateWeaponUI();
        break;
      }
    }
  }

  renderWeaponSlots() {
    this.weaponContainer.innerHTML = '';
    WEAPONS.forEach((wp, idx) => {
      const isUnlocked = this.unlockedWeapons.has(wp.id);
      const isActive = idx === this.controls.selectedWeaponIndex;

      const slot = document.createElement('div');
      slot.className = `weapon-slot ${isActive ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;
      slot.innerHTML = `
        <span class="weapon-key">${wp.key}</span>
        <span class="weapon-icon">${wp.icon}</span>
        <span class="weapon-name">${wp.shortName}</span>
      `;

      slot.addEventListener('click', () => {
        if (this.isWeaponUnlocked(idx)) {
          this.controls.selectedWeaponIndex = idx;
          this.updateWeaponUI();
          window.soundFx.init();
        } else {
          this.showAlert(`Terkunci! Buka di Level ${wp.unlockLevel}`);
        }
      });

      this.weaponContainer.appendChild(slot);
    });
  }

  updateWeaponUI() {
    const slots = this.weaponContainer.children;
    for (let i = 0; i < slots.length; i++) {
      const isUnlocked = this.isWeaponUnlocked(i);
      const isActive = i === this.controls.selectedWeaponIndex;

      slots[i].className = `weapon-slot ${isActive ? 'active' : ''} ${isUnlocked ? '' : 'locked'}`;
    }
  }

  showAlert(text, duration = 2200) {
    this.alertText.textContent = text;
    this.alertBanner.classList.remove('hidden');
    clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => {
      this.alertBanner.classList.add('hidden');
    }, duration);
  }

  // ----------------------------------------------------
  // LEVEL INITIALIZATION
  // ----------------------------------------------------
  startLevel(levelIdx) {
    this.currentLevelIndex = levelIdx;
    this.levelConfig = LEVELS_CONFIG[levelIdx];

    // Check if this level unlocks a weapon!
    if (this.levelConfig.unlockWeaponId) {
      this.unlockedWeapons.add(this.levelConfig.unlockWeaponId);
    }

    // Prepare enemy spawn queue
    this.remainingEnemiesToSpawn = [];
    this.levelConfig.enemyPool.forEach(entry => {
      for (let i = 0; i < entry.count; i++) {
        this.remainingEnemiesToSpawn.push(entry.type);
      }
    });

    // Shuffle non-boss enemies
    if (!this.levelConfig.isBossLevel) {
      for (let i = this.remainingEnemiesToSpawn.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.remainingEnemiesToSpawn[i], this.remainingEnemiesToSpawn[j]] = [this.remainingEnemiesToSpawn[j], this.remainingEnemiesToSpawn[i]];
      }
    }

    this.totalLevelEnemies = this.remainingEnemiesToSpawn.length;

    // Reset entities
    this.player = new Player(this.levelConfig.width / 2, this.levelConfig.height / 2);
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.pickups = [];
    this.particlePool.clear();
    this.spawnTimer = 200; // First enemy spawns quickly

    // Center camera
    this.camera.x = this.player.x - this.width / 2;
    this.camera.y = this.player.y - this.height / 2;

    this.state = STATE_PLAYING;
    this.skillManager.onLevelStart();
    this.updateHUD();
    this.updateDifficultyBadge();
    this.renderWeaponSlots();

    this.showAlert(`MASUK LEVEL ${this.currentLevelIndex + 1}: ${this.levelConfig.name.toUpperCase()}`);
  }

  togglePause() {
    if (this.state === STATE_PLAYING) {
      this.state = STATE_PAUSED;
      this.screenPause.classList.remove('hidden');
    } else if (this.state === STATE_PAUSED) {
      this.state = STATE_PLAYING;
      this.screenPause.classList.add('hidden');
    }
  }

  // ----------------------------------------------------
  // SPAWNER & ENEMY LOGIC
  // ----------------------------------------------------
  spawnEnemy() {
    if (this.remainingEnemiesToSpawn.length === 0) return;
    if (this.enemies.length >= this.levelConfig.maxConcurrentEnemies) return;

    const enemyType = this.remainingEnemiesToSpawn.shift();

    // Determine spawn position around edge of world or outside player screen
    let spawnX, spawnY;
    let attempts = 0;
    const minSpawnDist = 450; // Don't spawn right on top of player

    do {
      spawnX = 60 + Math.random() * (this.levelConfig.width - 120);
      spawnY = 60 + Math.random() * (this.levelConfig.height - 120);
      attempts++;
    } while (dist(spawnX, spawnY, this.player.x, this.player.y) < minSpawnDist && attempts < 20);

    const enemy = new Enemy(spawnX, spawnY, enemyType, this.selectedDifficulty);
    this.enemies.push(enemy);

    // Particle effect at spawn location (Pooled)
    for (let i = 0; i < 6; i++) {
      this.particlePool.spawn(
        spawnX, spawnY,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        '#bd00ff',
        5,
        300
      );
    }
  }

  // ----------------------------------------------------
  // SHOOTING LOGIC
  // ----------------------------------------------------
  handleShooting(now) {
    if (!this.controls.isShooting) return;

    const weapon = WEAPONS[this.controls.selectedWeaponIndex];
    if (now - this.lastShootTime < weapon.fireRate) return;

    this.lastShootTime = now;
    this.shotsFired++;

    // Apply Mobile Aim Assist if enabled
    this.controls.applyAimAssist(this.player, this.enemies);

    const baseAngle = this.player.angle;
    const count = weapon.count || 1;
    const spread = weapon.spread || 0;

    // Gun muzzle position
    const muzzleDist = 26;
    const muzzleX = this.player.x + Math.cos(baseAngle) * muzzleDist;
    const muzzleY = this.player.y + Math.sin(baseAngle) * muzzleDist;

    // Fire pellets / projectiles
    for (let i = 0; i < count; i++) {
      let shotAngle = baseAngle;
      if (count > 1) {
        // Spread evenly across arc
        const step = spread / (count - 1);
        shotAngle = baseAngle - spread / 2 + step * i;
      } else if (spread > 0) {
        shotAngle += (Math.random() - 0.5) * spread;
      }

      this.playerBullets.push(new Bullet(muzzleX, muzzleY, shotAngle, weapon, 'player'));
    }

    // Muzzle Flash Particle (Pooled)
    this.particlePool.spawn(muzzleX, muzzleY, 0, 0, weapon.color, 9, 70);

    // Audio SFX
    window.soundFx.playShoot(weapon.sound);

    // Minor screen recoil
    this.addScreenShake(weapon.explosive ? 5 : (weapon.count > 1 ? 3 : 1.5));
  }

  addScreenShake(amount) {
    this.screenShake = Math.min(18, this.screenShake + amount);
  }

  // ----------------------------------------------------
  // EXPLOSION AOE DAMAGE
  // ----------------------------------------------------
  triggerExplosion(x, y, radius, damage) {
    window.soundFx.playExplosion();
    this.addScreenShake(10);

    // Visual shockwave & embers (Pooled)
    this.particlePool.spawn(x, y, 0, 0, '#ff0055', radius, 350, 'shockwave');
    const particleCount = this.performanceMode ? 10 : 18;
    for (let i = 0; i < particleCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 6;
      this.particlePool.spawn(
        x, y,
        Math.cos(a) * spd,
        Math.sin(a) * spd,
        Math.random() < 0.5 ? '#ff0055' : '#ffee00',
        Math.random() * 5 + 3,
        400
      );
    }

    // Damage all enemies in blast radius
    this.enemies.forEach(enemy => {
      const d = dist(x, y, enemy.x, enemy.y);
      if (d <= radius + enemy.radius) {
        const falloff = 1 - (d / (radius + enemy.radius)) * 0.4;
        enemy.takeDamage(damage * falloff, this.particlePool);
      }
    });

    // Check if player is caught in blast
    const playerDist = dist(x, y, this.player.x, this.player.y);
    if (playerDist <= radius * 0.7) {
      this.player.takeDamage(12);
    }
  }

  // ----------------------------------------------------
  // UPDATE LOOP
  // ----------------------------------------------------
  update(dt, now) {
    if (this.state !== STATE_PLAYING) return;

    if (this.nukeFlashTimer > 0) {
      this.nukeFlashTimer -= dt;
    }

    this.controls.update();

    // Update Player Screen Pos for aim calculations (accounting for zoom scale around center)
    const playerScreenX = (this.player.x - this.camera.x - this.width / 2) * this.zoom + this.width / 2;
    const playerScreenY = (this.player.y - this.camera.y - this.height / 2) * this.zoom + this.height / 2;
    this.controls.setPlayerScreenPosition(playerScreenX, playerScreenY);

    // Update Player
    this.player.update(
      dt,
      this.controls,
      this.levelConfig.obstacles,
      this.levelConfig.width,
      this.levelConfig.height,
      this.particlePool
    );

    // Player Shooting
    this.handleShooting(now);

    // Spawner timer
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.levelConfig.spawnInterval;
      this.spawnEnemy();
    }

    // Update Player Bullets (Supports Vortex suction pull)
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const b = this.playerBullets[i];
      b.update(dt, this.levelConfig.obstacles, this.levelConfig.width, this.levelConfig.height, this.enemies, this.particlePool);

      if (b.isDead) {
        if (b.explosive) {
          this.triggerExplosion(b.x, b.y, b.explosionRadius, b.damage);
        }
        this.playerBullets.splice(i, 1);
        continue;
      }

      // Check collision with enemies using fast squared-distance
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (b.hitEnemies.has(enemy)) continue;

        const radSum = b.radius + enemy.radius;
        const dx = b.x - enemy.x;
        const dy = b.y - enemy.y;
        if (dx * dx + dy * dy < radSum * radSum) {
          b.hitEnemies.add(enemy);
          this.shotsHit++;
          enemy.takeDamage(b.damage, this.particlePool);

          // Impact spark particles (Pooled)
          const sparkCount = this.performanceMode ? 2 : 4;
          for (let k = 0; k < sparkCount; k++) {
            this.particlePool.spawn(
              b.x, b.y,
              (Math.random() - 0.5) * 5,
              (Math.random() - 0.5) * 5,
              b.color,
              3,
              200
            );
          }

          if (b.explosive) {
            b.isDead = true;
            this.triggerExplosion(b.x, b.y, b.explosionRadius, b.damage);
            break;
          }

          if (b.pierce > 0) {
            b.pierce--;
          } else {
            b.isDead = true;
            break;
          }
        }
      }

      if (b.isDead) {
        this.playerBullets.splice(i, 1);
      }
    }

    // Update Enemy Bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const eb = this.enemyBullets[i];
      eb.update(dt, this.levelConfig.obstacles, this.levelConfig.width, this.levelConfig.height);

      if (eb.isDead) {
        this.enemyBullets.splice(i, 1);
        continue;
      }

      // Check collision with player using fast squared-distance
      const radSum = eb.radius + this.player.radius;
      const dx = eb.x - this.player.x;
      const dy = eb.y - this.player.y;
      if (dx * dx + dy * dy < radSum * radSum) {
        eb.isDead = true;
        this.player.takeDamage(eb.damage);
        this.addScreenShake(6);
        this.enemyBullets.splice(i, 1);

        // Sparks on player hit (Pooled)
        const hitSparks = this.performanceMode ? 3 : 5;
        for (let k = 0; k < hitSparks; k++) {
          this.particlePool.spawn(
            this.player.x, this.player.y,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            '#ff3366',
            3.5,
            250
          );
        }
      }
    }

    // Update Enemies & handle their death/spawns
    const newEnemies = [];
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(
        dt,
        this.player,
        this.levelConfig.obstacles,
        this.enemyBullets,
        newEnemies,
        this.levelConfig.width,
        this.levelConfig.height
      );

      // Contact damage with player using fast squared-distance
      const radSum = enemy.radius + this.player.radius;
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      if (dx * dx + dy * dy < radSum * radSum) {
        if (this.player.takeDamage(enemy.contactDamage)) {
          this.addScreenShake(7);
        }
      }

      // Check if enemy died
      if (enemy.isDead) {
        const difficultyScoreMult = this.selectedDifficulty ? this.selectedDifficulty.scoreMultiplier : 1.0;
        this.score += Math.round(enemy.score * difficultyScoreMult);
        this.totalKills++;

        // Death sparks explosion (Pooled)
        const deathParticles = this.performanceMode ? 6 : 10;
        for (let k = 0; k < deathParticles; k++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 1.5 + Math.random() * 4;
          this.particlePool.spawn(
            enemy.x, enemy.y,
            Math.cos(a) * spd,
            Math.sin(a) * spd,
            enemy.color,
            Math.random() * 4 + 2,
            380
          );
        }

        // Drop health pack based on difficulty drop rate
        const dropRate = this.selectedDifficulty ? this.selectedDifficulty.dropRate : 0.22;
        if (Math.random() < dropRate || enemy.type === 'tank' || enemy.type === 'boss') {
          this.pickups.push(new Pickup(enemy.x, enemy.y, 'health'));
        }

        this.enemies.splice(i, 1);
      }
    }

    if (newEnemies.length > 0) {
      this.enemies.push(...newEnemies);
    }

    // Update Pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.update(dt, this.player);
      if (p.isDead) {
        this.pickups.splice(i, 1);
      }
    }

    // Update Particle Pool (No garbage generated!)
    this.particlePool.update(dt);

    // Update 3 Skills System (Regen, Summoned Drones, Nuke)
    this.skillManager.update(dt, this.player, this.enemies, this.playerBullets, this.particlePool);

    // Update Camera smoothly
    const targetCamX = this.player.x - this.width / 2;
    const targetCamY = this.player.y - this.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;

    // Clamp camera within world bounds (accounting for zoom visibility)
    const minCamX = (this.width / 2) * (1 / this.zoom - 1);
    const maxCamX = this.levelConfig.width - this.width - minCamX;
    if (minCamX <= maxCamX) {
      this.camera.x = Math.max(minCamX, Math.min(maxCamX, this.camera.x));
    } else {
      this.camera.x = (this.levelConfig.width - this.width) / 2;
    }

    const minCamY = (this.height / 2) * (1 / this.zoom - 1);
    const maxCamY = this.levelConfig.height - this.height - minCamY;
    if (minCamY <= maxCamY) {
      this.camera.y = Math.max(minCamY, Math.min(maxCamY, this.camera.y));
    } else {
      this.camera.y = (this.levelConfig.height - this.height) / 2;
    }

    // Screen Shake decay
    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }

    // Check Player Death
    if (this.player.hp <= 0) {
      this.handleGameOver();
      return;
    }

    // Check Level Complete (All enemies spawned and defeated)
    if (this.remainingEnemiesToSpawn.length === 0 && this.enemies.length === 0) {
      this.handleLevelClear();
      return;
    }

    this.updateHUD();
  }

  // ----------------------------------------------------
  // HUD REFRESH
  // ----------------------------------------------------
  updateHUD() {
    if (!this.player) return;

    // HP Bar
    const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    this.hpBar.style.width = `${hpPct}%`;
    this.hpText.textContent = `${Math.ceil(this.player.hp)} / ${this.player.maxHp}`;

    if (hpPct > 50) {
      this.hpBar.style.background = 'linear-gradient(90deg, #ffaa00, #00ff88)';
    } else if (hpPct > 25) {
      this.hpBar.style.background = 'linear-gradient(90deg, #ff3366, #ffaa00)';
    } else {
      this.hpBar.style.background = 'linear-gradient(90deg, #ff0033, #ff3366)';
    }

    // Level & Enemies
    this.levelDisplay.textContent = `LEVEL ${this.currentLevelIndex + 1}`;
    const remainingCount = this.remainingEnemiesToSpawn.length + this.enemies.length;
    this.enemyCount.textContent = remainingCount;

    // Score
    this.scoreText.textContent = this.score;
  }

  // ----------------------------------------------------
  // LEVEL CLEAR & GAME OVER MODALS
  // ----------------------------------------------------
  handleLevelClear() {
    this.state = STATE_LEVEL_CLEAR;
    window.soundFx.playLevelClear();

    // Check if next level exists or if game is won
    if (this.currentLevelIndex >= LEVELS_CONFIG.length - 1) {
      this.showVictoryScreen();
      return;
    }

    // Populate modal stats
    this.levelClearTitle.textContent = `${this.levelConfig.name} Berhasil Diamankan!`;
    this.statLevelKills.textContent = this.totalKills;
    const accuracy = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 100;
    this.statLevelAccuracy.textContent = `${accuracy}%`;
    this.statLevelScore.textContent = this.score;

    // Check next level unlock
    const nextLevelConfig = LEVELS_CONFIG[this.currentLevelIndex + 1];
    if (nextLevelConfig && nextLevelConfig.unlockWeaponId) {
      const unlockedWeapon = WEAPONS.find(w => w.id === nextLevelConfig.unlockWeaponId);
      if (unlockedWeapon) {
        this.unlockAnnouncement.classList.remove('hidden');
        this.unlockName.textContent = `${unlockedWeapon.icon} ${unlockedWeapon.name}`;
        this.unlockDesc.textContent = unlockedWeapon.desc;
      } else {
        this.unlockAnnouncement.classList.add('hidden');
      }
    } else {
      this.unlockAnnouncement.classList.add('hidden');
    }

    this.screenLevelClear.classList.remove('hidden');
  }

  handleGameOver() {
    this.state = STATE_GAME_OVER;
    window.soundFx.playGameOver();

    this.overLevel.textContent = `Level ${this.currentLevelIndex + 1} (${this.levelConfig.name})`;
    this.overScore.textContent = this.score;
    this.overKills.textContent = this.totalKills;

    this.screenGameOver.classList.remove('hidden');
  }

  showVictoryScreen() {
    this.state = STATE_VICTORY;
    window.soundFx.playVictory();

    this.victoryScore.textContent = this.score;
    this.victoryKills.textContent = this.totalKills;

    this.screenVictory.classList.remove('hidden');
  }

  // ----------------------------------------------------
  // DRAWING / RENDERING (With Viewport Culling & Optimization)
  // ----------------------------------------------------
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.state === STATE_START) {
      // Draw cool animated title background
      this.drawMenuBackground();
      return;
    }

    this.ctx.save();

    // Apply Screen Shake
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(shakeX, shakeY);
    }

    // Apply Camera Zoom around viewport center (crucial for portrait mobile FOV)
    if (this.zoom && this.zoom !== 1.0) {
      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.scale(this.zoom, this.zoom);
      this.ctx.translate(-this.width / 2, -this.height / 2);
    }

    // Apply Camera Offset
    this.ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // Frustum Culling bounds (expanded by zoom factor)
    const halfVisW = (this.width / this.zoom) / 2;
    const halfVisH = (this.height / this.zoom) / 2;
    const camCenterX = this.camera.x + this.width / 2;
    const camCenterY = this.camera.y + this.height / 2;
    const viewL = camCenterX - halfVisW - 70;
    const viewR = camCenterX + halfVisW + 70;
    const viewT = camCenterY - halfVisH - 70;
    const viewB = camCenterY + halfVisH + 70;

    // 1. Draw World Background & Grid
    this.drawWorldBackground();

    // 2. Draw Obstacles / Walls (Culled)
    this.drawObstacles(viewL, viewR, viewT, viewB);

    // 3. Draw Pickups (Culled)
    for (let i = 0; i < this.pickups.length; i++) {
      const p = this.pickups[i];
      if (p.x >= viewL && p.x <= viewR && p.y >= viewT && p.y <= viewB) {
        p.draw(this.ctx);
      }
    }

    // 4. Draw Particles from Pool (Culled inside pool)
    this.particlePool.draw(this.ctx, this.camera, this.width, this.height);

    // 5. Draw Enemies (Frustum Culled for mobile speed)
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (e.x + e.radius >= viewL && e.x - e.radius <= viewR &&
          e.y + e.radius >= viewT && e.y - e.radius <= viewB) {
        e.draw(this.ctx);
      }
    }

    // 6. Draw Player
    if (this.player) {
      this.player.draw(this.ctx);
    }

    // 7. Draw Bullets (player & enemies)
    for (let i = 0; i < this.playerBullets.length; i++) {
      const b = this.playerBullets[i];
      if (b.x >= viewL && b.x <= viewR && b.y >= viewT && b.y <= viewB) {
        b.draw(this.ctx);
      }
    }
    for (let i = 0; i < this.enemyBullets.length; i++) {
      const eb = this.enemyBullets[i];
      if (eb.x >= viewL && eb.x <= viewR && eb.y >= viewT && eb.y <= viewB) {
        eb.draw(this.ctx);
      }
    }

    // 8. Draw Active Skills (Ally Drones & Player Aura)
    this.skillManager.draw(this.ctx);

    this.ctx.restore();

    // 9. Screen-Space UI: Off-screen Enemy Radar Indicators
    this.drawOffScreenRadar();

    // 10. Super Nuke Screen Flash Overlay
    if (this.nukeFlashTimer > 0) {
      this.ctx.save();
      const alpha = Math.min(1, this.nukeFlashTimer / 500);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.restore();
    }
  }

  drawWorldBackground() {
    const w = this.levelConfig.width;
    const h = this.levelConfig.height;

    // Arena Floor
    this.ctx.fillStyle = this.levelConfig.bgColor;
    this.ctx.fillRect(0, 0, w, h);

    // Floor Grid lines
    this.ctx.save();
    this.ctx.strokeStyle = this.levelConfig.gridColor;
    this.ctx.lineWidth = 1;
    const gridSize = 64;

    for (let x = 0; x <= w; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    for (let y = 0; y <= h; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Outer Boundary Wall
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = this.levelConfig.wallGlow;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!this.performanceMode && !isTouch) {
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = this.levelConfig.wallGlow;
    }
    this.ctx.strokeRect(4, 4, w - 8, h - 8);
    this.ctx.restore();
  }

  drawObstacles(viewL, viewR, viewT, viewB) {
    this.ctx.save();
    for (let i = 0; i < this.levelConfig.obstacles.length; i++) {
      const b = this.levelConfig.obstacles[i];

      // Skip drawing if outside viewport
      if (b.x + b.w < viewL || b.x > viewR || b.y + b.h < viewT || b.y > viewB) {
        continue;
      }

      // Shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      this.ctx.fillRect(b.x + 6, b.y + 6, b.w, b.h);

      // Crate / Fortress body
      this.ctx.fillStyle = this.levelConfig.wallColor;
      this.ctx.fillRect(b.x, b.y, b.w, b.h);

      // Glowing border
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = this.levelConfig.wallGlow;
      this.ctx.strokeRect(b.x, b.y, b.w, b.h);

      // Cyber hazard stripes / interior detail
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.beginPath();
      this.ctx.moveTo(b.x, b.y);
      this.ctx.lineTo(b.x + b.w, b.y + b.h);
      this.ctx.moveTo(b.x + b.w, b.y);
      this.ctx.lineTo(b.x, b.y + b.h);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Off-screen neon radar arrows so the player always knows where enemies are!
  drawOffScreenRadar() {
    if (!this.player) return;

    const margin = 26;
    const screenL = margin;
    const screenR = this.width - margin;
    const screenT = 60 + margin;
    const screenB = this.height - margin;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    this.enemies.forEach(e => {
      // Screen coordinates accounting for zoom around center
      const screenX = (e.x - this.camera.x - this.width / 2) * this.zoom + this.width / 2;
      const screenY = (e.y - this.camera.y - this.height / 2) * this.zoom + this.height / 2;

      const isOffScreen = screenX < 0 || screenX > this.width || screenY < 50 || screenY > this.height;
      if (isOffScreen) {
        // Find angle from screen center to enemy
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const angle = Math.atan2(screenY - centerY, screenX - centerX);

        // Clamp arrow position along screen borders
        let arrowX = centerX + Math.cos(angle) * (this.width / 2 - margin);
        let arrowY = centerY + Math.sin(angle) * (this.height / 2 - margin);
        arrowX = Math.max(screenL, Math.min(screenR, arrowX));
        arrowY = Math.max(screenT, Math.min(screenB, arrowY));

        // Draw sleek arrow pointer
        this.ctx.save();
        this.ctx.translate(arrowX, arrowY);
        this.ctx.rotate(angle);

        if (!this.performanceMode && !isTouch) {
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = e.color;
        }
        this.ctx.fillStyle = e.color;

        this.ctx.beginPath();
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(-6, -6);
        this.ctx.lineTo(-3, 0);
        this.ctx.lineTo(-6, 6);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
      }
    });
  }

  drawMenuBackground() {
    // Ambient sci-fi grid animation on menu
    const t = performance.now() * 0.0005;
    this.ctx.fillStyle = '#0a0c16';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    this.ctx.lineWidth = 1;
    const gridSize = 50;
    const offsetX = (t * 20) % gridSize;
    const offsetY = (t * 20) % gridSize;

    for (let x = offsetX; x < this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = offsetY; y < this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  // ----------------------------------------------------
  // MAIN LOOP
  // ----------------------------------------------------
  loop(now) {
    const dt = Math.min(now - this.lastTime, 50); // Cap frame dt to avoid spiral
    this.lastTime = now;

    // Real-time FPS Monitoring & Performance Protection
    this.frameCount++;
    if (now - this.lastFpsUpdate >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;

      if (this.fpsDisplay) {
        this.fpsDisplay.textContent = `${this.fps} FPS`;
        this.fpsDisplay.style.color = this.fps >= 50 ? '#00ff88' : (this.fps >= 30 ? '#ffaa00' : '#ff3366');
      }

      // Auto performance throttling if phone lags
      if (this.fps < 40) {
        this.lowFpsCount++;
        if (this.lowFpsCount >= 3 && !this.performanceMode) {
          this.setPerformanceMode(true);
          const btnPerf = document.getElementById('toggle-perf-mode');
          if (btnPerf) {
            btnPerf.textContent = 'HEMAT (60+ FPS)';
            btnPerf.classList.add('active');
          }
        }
      } else {
        this.lowFpsCount = Math.max(0, this.lowFpsCount - 1);
      }
    }

    this.update(dt, now);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Instantiate game instance on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
