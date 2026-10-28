/**
 * CYBER STRIKE 2D - Entities: Player, Enemies, Bullets, Pickups, and Particle Systems
 */

// Helper: Distance between two points
function dist(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.hypot(dx, dy);
}

// Helper: Fast squared distance (avoids expensive Math.sqrt in hot loops)
function distSq(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

// Helper: Circle to AABB obstacle collision resolution
function resolveCircleBoxCollision(circle, box) {
  const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.w));
  const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.h));

  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  if (distanceSquared < circle.radius * circle.radius) {
    const d = Math.sqrt(distanceSquared);
    if (d === 0) {
      circle.x += circle.radius;
      return true;
    }
    const overlap = circle.radius - d;
    circle.x += (distanceX / d) * overlap;
    circle.y += (distanceY / d) * overlap;
    return true;
  }
  return false;
}

// ========================================================
// PLAYER CLASS
// ========================================================
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 18;
    this.baseSpeed = 4.8;
    this.speed = this.baseSpeed;
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.angle = 0;

    // Dash ability
    this.canDash = true;
    this.isDashing = false;
    this.dashDuration = 160; // ms
    this.dashCooldown = 1200; // ms
    this.dashTimer = 0;
    this.dashCooldownTimer = 0;
    this.dashSpeedMultiplier = 3.2;

    // Visuals & Feedback
    this.hitFlashTimer = 0;
    this.invulnerableTimer = 0;
  }

  update(dt, input, obstacles, worldWidth, worldHeight, particles) {
    // Handle Dash timer
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
      if (this.dashCooldownTimer <= 0) {
        this.canDash = true;
      }
    }

    if (this.isDashing) {
      this.dashTimer -= dt;
      // Spawn dash ghost trail
      if (Math.random() < 0.6) {
        if (particles.spawn) {
          particles.spawn(this.x, this.y, 0, 0, '#00f0ff', 12, 250, 'ghost', this.angle);
        } else {
          particles.push(new Particle(this.x, this.y, 0, 0, '#00f0ff', 12, 250, 'ghost', this.angle));
        }
      }
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    }

    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;

    // Handle Movement
    let mx = input.moveX;
    let my = input.moveY;
    const len = Math.hypot(mx, my);

    if (len > 0) {
      mx /= len;
      my /= len;

      const currentSpeed = (this.isDashing ? this.baseSpeed * this.dashSpeedMultiplier : this.baseSpeed);
      this.vx = mx * currentSpeed;
      this.vy = my * currentSpeed;

      this.x += this.vx;
      this.y += this.vy;

      // Dust / step particle
      if (Math.random() < 0.25) {
        if (particles.spawn) {
          particles.spawn(
            this.x - mx * 10,
            this.y - my * 10,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
            'rgba(0, 240, 255, 0.4)',
            4,
            200
          );
        } else {
          particles.push(new Particle(
            this.x - mx * 10,
            this.y - my * 10,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
            'rgba(0, 240, 255, 0.4)',
            4,
            200
          ));
        }
      }
    } else {
      this.vx = 0;
      this.vy = 0;
    }

    // Dash Trigger
    if (input.dashRequested && this.canDash && len > 0) {
      this.isDashing = true;
      this.canDash = false;
      this.dashTimer = this.dashDuration;
      this.dashCooldownTimer = this.dashCooldown;
      this.invulnerableTimer = this.dashDuration + 50; // Invulnerable while dashing!
      window.soundFx.playDash();
      input.dashRequested = false;
    }

    // Aim Angle
    if (input.isAiming) {
      this.angle = input.aimAngle;
    } else if (len > 0) {
      this.angle = Math.atan2(my, mx);
    }

    // Collide with obstacles
    obstacles.forEach(box => {
      resolveCircleBoxCollision(this, box);
    });

    // World Boundary Collision
    this.x = Math.max(this.radius + 15, Math.min(worldWidth - this.radius - 15, this.x));
    this.y = Math.max(this.radius + 15, Math.min(worldHeight - this.radius - 15, this.y));
  }

  takeDamage(amount) {
    if (this.isDashing || this.invulnerableTimer > 0) return false;

    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 120;
    this.invulnerableTimer = 250; // Brief i-frames
    window.soundFx.playPlayerHurt();
    return true;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // If hit, flash white
    const isFlashing = this.hitFlashTimer > 0;

    // Rotate to facing angle
    ctx.rotate(this.angle);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius + 4, this.radius + 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // Weapon Barrel
    ctx.fillStyle = isFlashing ? '#ffffff' : '#1c2938';
    ctx.fillRect(8, 4, 18, 6);
    ctx.fillStyle = isFlashing ? '#ffffff' : '#00f0ff';
    ctx.fillRect(22, 5, 4, 4);

    // Hands
    ctx.beginPath();
    ctx.arc(12, 10, 5, 0, Math.PI * 2);
    ctx.arc(8, -8, 5, 0, Math.PI * 2);
    ctx.fillStyle = isFlashing ? '#ffffff' : '#00c3ff';
    ctx.fill();

    // Player Body (Armored Soldier with Cyber Shield)
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = isFlashing ? '#ffffff' : '#0e1e2d';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = isFlashing ? '#ffffff' : (this.isDashing ? '#ffee00' : '#00f0ff');
    ctx.stroke();

    // Glowing Visor / Helmet
    ctx.beginPath();
    ctx.arc(4, 0, 7, -Math.PI / 2.5, Math.PI / 2.5);
    ctx.lineWidth = 4;
    ctx.strokeStyle = isFlashing ? '#ffffff' : '#00ffcc';
    ctx.stroke();

    // Dash aura ring
    if (this.isDashing) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }
}

// ========================================================
// BULLET CLASS (Supports Standard, Explosive, Pierce & Vortex)
// ========================================================
class Bullet {
  constructor(x, y, angle, weapon, source = 'player') {
    this.x = x;
    this.y = y;
    this.source = source; // 'player' or 'enemy'

    // Compute velocity
    const speed = weapon.speed || 14;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.angle = angle;

    this.radius = weapon.bulletRadius || 4;
    this.damage = weapon.damage || 20;
    this.color = weapon.color || '#00f0ff';
    this.glow = weapon.glow || 'rgba(0, 240, 255, 0.8)';
    this.pierce = weapon.pierce || 0;
    this.explosive = weapon.explosive || false;
    this.explosionRadius = weapon.explosionRadius || 0;

    // Vortex Cyclone weapon mechanics
    this.isVortex = weapon.isVortex || false;
    this.vortexRadius = weapon.vortexRadius || 130;
    this.vortexTimer = weapon.duration || 3500;
    this.vortexRotation = 0;
    this.hitCooldowns = new Map(); // Damage tick timer per enemy

    this.traveled = 0;
    this.maxRange = weapon.range || 1200;
    this.isDead = false;
    this.hitEnemies = new Set(); // Prevent multi-hitting same enemy on same frame
  }

  update(dt, obstacles, worldWidth, worldHeight, enemies = [], particles = null) {
    if (this.isVortex) {
      this.vortexTimer -= dt;
      this.vortexRotation += dt * 0.012;

      // Update tick cooldowns for enemies
      for (const [enemy, cd] of this.hitCooldowns.entries()) {
        const newCd = cd - dt;
        if (newCd <= 0) this.hitCooldowns.delete(enemy);
        else this.hitCooldowns.set(enemy, newCd);
      }

      // Strong suction pull on all nearby enemies (Optimized fast squared distance)
      const vRadiusSq = this.vortexRadius * this.vortexRadius;
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        const dx = this.x - e.x;
        const dy = this.y - e.y;
        const dSq = dx * dx + dy * dy;

        if (dSq < vRadiusSq && dSq > 25) {
          const dist = Math.sqrt(dSq);
          const pullForce = (1 - dist / this.vortexRadius) * 4.2;
          e.x += (dx / dist) * pullForce;
          e.y += (dy / dist) * pullForce;

          // Continuous vortex slash damage every 280ms
          if (!this.hitCooldowns.has(e)) {
            e.takeDamage(this.damage, particles);
            this.hitCooldowns.set(e, 280);
          }
        }
      }

      // Spawn swirling wind particles
      if (particles && Math.random() < 0.4) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * (this.vortexRadius * 0.6);
        particles.spawn(
          this.x + Math.cos(a) * r,
          this.y + Math.sin(a) * r,
          -Math.sin(a) * 3,
          Math.cos(a) * 3,
          '#00ffff',
          3,
          250
        );
      }

      if (this.vortexTimer <= 0) {
        this.isDead = true;
        // Dissipate burst
        if (particles) {
          particles.spawn(this.x, this.y, 0, 0, '#00ffff', this.vortexRadius, 300, 'shockwave');
        }
        return;
      }
    }

    const stepDist = Math.hypot(this.vx, this.vy);
    this.x += this.vx;
    this.y += this.vy;
    this.traveled += stepDist;

    if (this.traveled >= this.maxRange && !this.isVortex) {
      this.isDead = true;
      return;
    }

    // World boundary check
    if (this.x < 0 || this.x > worldWidth || this.y < 0 || this.y > worldHeight) {
      this.isDead = true;
      return;
    }

    // Obstacle collision
    for (let i = 0; i < obstacles.length; i++) {
      const b = obstacles[i];
      if (
        this.x >= b.x &&
        this.x <= b.x + b.w &&
        this.y >= b.y &&
        this.y <= b.y + b.h
      ) {
        this.isDead = true;
        return;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.isVortex) {
      ctx.rotate(this.vortexRotation);

      // Glowing outer vortex aura
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 255, 0.22)';
      ctx.fill();

      // 4 Swirling Cyclone Spiral Arms
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(this.radius * 0.7, this.radius * 0.3, this.radius * 1.25, this.radius);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Bright eye of cyclone
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
      return;
    }

    ctx.rotate(this.angle);

    // Glow Effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.glow;

    // Bullet shape
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 2, this.radius, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hot center
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius, this.radius * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ========================================================
// ALLY DRONE CLASS (Summoned companion that attacks enemies)
// ========================================================
class AllyDrone {
  constructor(x, y, orbitAngle = 0) {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.orbitAngle = orbitAngle;
    this.orbitDistance = 55;
    this.angle = 0;
    this.shootCooldown = 0;
    this.shootInterval = 200; // Rapid support fire!
    this.droneWeapon = {
      speed: 18,
      bulletRadius: 3.5,
      damage: 18,
      color: '#00ffff',
      glow: 'rgba(0, 255, 255, 0.8)',
      range: 750,
      sound: 'smg'
    };
  }

  update(dt, player, enemies, playerBullets, particles, orbitOffset) {
    this.orbitAngle += dt * 0.003;
    const targetX = player.x + Math.cos(this.orbitAngle + orbitOffset) * this.orbitDistance;
    const targetY = player.y + Math.sin(this.orbitAngle + orbitOffset) * this.orbitDistance;

    // Smooth floating physics
    this.x += (targetX - this.x) * 0.2;
    this.y += (targetY - this.y) * 0.2;

    // Find closest enemy within 550px
    let closestEnemy = null;
    let minDistanceSq = 550 * 550;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const dSq = dx * dx + dy * dy;
      if (dSq < minDistanceSq) {
        minDistanceSq = dSq;
        closestEnemy = e;
      }
    }

    if (closestEnemy) {
      this.angle = Math.atan2(closestEnemy.y - this.y, closestEnemy.x - this.x);
      this.shootCooldown -= dt;
      if (this.shootCooldown <= 0) {
        this.shootCooldown = this.shootInterval;
        playerBullets.push(new Bullet(this.x, this.y, this.angle, this.droneWeapon, 'player'));
        window.soundFx.playShoot('smg');
        if (particles && particles.spawn) {
          particles.spawn(this.x, this.y, 0, 0, '#00ffff', 6, 60);
        }
      }
    } else {
      this.angle = player.angle;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 4, 10, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Drone outer chassis
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1926';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#00ffff';
    ctx.stroke();

    // Turret gun barrel
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(4, -2.5, 10, 5);

    // Glowing central core
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}

// ========================================================
// ENEMY CLASS (Supports Walker, Swarmer, Shooter, Tank, Boss)
// ========================================================
class Enemy {
  constructor(x, y, type = 'walker', difficulty = null) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.angle = 0;
    this.hitFlashTimer = 0;
    this.isDead = false;

    // Difficulty multipliers
    const diff = difficulty || (window.DIFFICULTIES ? window.DIFFICULTIES.normal : null);
    const hpMult = diff ? (diff.hpMultiplier || 1.0) : 1.0;
    const spdMult = diff ? (diff.speedMultiplier || 1.0) : 1.0;
    const dmgMult = diff ? (diff.damageMultiplier || 1.0) : 1.0;

    let baseHp = 85;
    let baseSpeed = 1.8;
    let baseDamage = 12;

    // Default configuration based on enemy type
    switch (type) {
      case 'walker':
        this.radius = 16;
        baseSpeed = 1.8; // Steady, tactical pace
        baseHp = 85;    // Durable
        baseDamage = 12;
        this.score = 100;
        this.color = '#00ff88';
        this.border = '#009955';
        break;

      case 'swarmer':
        this.radius = 12;
        baseSpeed = 2.7; // Agile, but reaction-friendly on mobile
        baseHp = 50;
        baseDamage = 10;
        this.score = 140;
        this.color = '#ffaa00';
        this.border = '#cc6600';
        this.erraticAngle = Math.random() * Math.PI * 2;
        break;

      case 'shooter':
        this.radius = 17;
        baseSpeed = 1.6; // Tactical hovering sniper
        baseHp = 100;
        baseDamage = 10;
        this.score = 220;
        this.color = '#bd00ff';
        this.border = '#7a00aa';
        this.shootTimer = 1100 + Math.random() * 800;
        this.shootInterval = 1900; // Shoots every 1.9s
        this.telegraphDuration = 450; // Telegraphs with laser beam 450ms before firing!
        break;

      case 'tank':
        this.radius = 27;
        baseSpeed = 1.2; // Slow, armored juggernaut
        baseHp = 420;   // Heavy bullet sponge
        baseDamage = 25;
        this.score = 450;
        this.color = '#ff3366';
        this.border = '#991133';
        break;

      case 'boss':
        this.radius = 48;
        baseSpeed = 1.5;
        baseHp = 2200;  // Imposing boss health
        baseDamage = 35;
        this.score = 5000;
        this.color = '#ff0055';
        this.border = '#ffff00';
        this.shootTimer = 1300;
        this.summonTimer = 7000;
        this.dashTimer = 8000;
        this.isEnraged = false;
        break;
    }

    // Apply difficulty modifiers
    this.maxHp = Math.round(baseHp * hpMult);
    this.hp = this.maxHp;
    this.speed = baseSpeed * spdMult;
    this.contactDamage = Math.round(baseDamage * dmgMult);
  }

  update(dt, player, obstacles, enemyBullets, newSpawnedEnemies, worldWidth, worldHeight) {
    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

    const d = dist(this.x, this.y, player.x, player.y);
    const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
    this.angle = angleToPlayer;

    // Boss Enrage check
    if (this.type === 'boss' && !this.isEnraged && this.hp < this.maxHp * 0.45) {
      this.isEnraged = true;
      this.speed = 2.3;
      this.color = '#ff0022';
    }

    // Movement Behavior
    let moveDirX = 0;
    let moveDirY = 0;

    if (this.type === 'walker' || this.type === 'tank') {
      // Direct chase
      moveDirX = Math.cos(angleToPlayer);
      moveDirY = Math.sin(angleToPlayer);
    } else if (this.type === 'swarmer') {
      // Fast erratic zig-zag chase
      this.erraticAngle += (Math.random() - 0.5) * 0.4;
      const combinedAngle = angleToPlayer + Math.sin(this.erraticAngle) * 0.6;
      moveDirX = Math.cos(combinedAngle);
      moveDirY = Math.sin(combinedAngle);
    } else if (this.type === 'shooter') {
      // Keeps comfortable shooting distance (~320px)
      const idealDist = 320;
      if (d > idealDist + 40) {
        moveDirX = Math.cos(angleToPlayer);
        moveDirY = Math.sin(angleToPlayer);
      } else if (d < idealDist - 40) {
        // Back off
        moveDirX = -Math.cos(angleToPlayer);
        moveDirY = -Math.sin(angleToPlayer);
      } else {
        // Strafe sideways around player
        moveDirX = -Math.sin(angleToPlayer);
        moveDirY = Math.cos(angleToPlayer);
      }

      // Shoot bullets at player
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = this.shootInterval;
        const enemyWeapon = {
          speed: 8.5,
          bulletRadius: 5,
          damage: 15,
          color: '#ff00aa',
          glow: 'rgba(255, 0, 170, 0.8)',
          range: 900
        };
        enemyBullets.push(new Bullet(this.x, this.y, angleToPlayer, enemyWeapon, 'enemy'));
        window.soundFx.playEnemyShoot();
      }
    } else if (this.type === 'boss') {
      // Boss chase + Attacks
      moveDirX = Math.cos(angleToPlayer);
      moveDirY = Math.sin(angleToPlayer);

      // Attack Pattern: Multi-shot bursts
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = this.isEnraged ? 900 : 1400;

        // 5-way spread attack or 8-directional radial attack
        if (this.isEnraged && Math.random() < 0.4) {
          // 8-directional ring burst!
          for (let i = 0; i < 8; i++) {
            const radAngle = (Math.PI * 2 / 8) * i + Math.random() * 0.2;
            const bossWeapon = {
              speed: 7,
              bulletRadius: 6,
              damage: 18,
              color: '#ffee00',
              glow: 'rgba(255, 238, 0, 0.9)',
              range: 1000
            };
            enemyBullets.push(new Bullet(this.x, this.y, radAngle, bossWeapon, 'enemy'));
          }
        } else {
          // 5-way spread towards player
          for (let i = -2; i <= 2; i++) {
            const spreadAngle = angleToPlayer + i * 0.18;
            const bossWeapon = {
              speed: 9,
              bulletRadius: 5.5,
              damage: 16,
              color: '#ff0055',
              glow: 'rgba(255, 0, 85, 0.9)',
              range: 1100
            };
            enemyBullets.push(new Bullet(this.x, this.y, spreadAngle, bossWeapon, 'enemy'));
          }
        }
        window.soundFx.playEnemyShoot();
      }

      // Boss Minion Summon
      this.summonTimer -= dt;
      if (this.summonTimer <= 0) {
        this.summonTimer = 7000;
        // Spawn 2 minions near boss
        for (let i = 0; i < 2; i++) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnX = this.x + Math.cos(spawnAngle) * 90;
          const spawnY = this.y + Math.sin(spawnAngle) * 90;
          const minionType = Math.random() < 0.6 ? 'swarmer' : 'shooter';
          newSpawnedEnemies.push(new Enemy(spawnX, spawnY, minionType));
        }
      }
    }

    // Apply movement
    this.x += moveDirX * this.speed;
    this.y += moveDirY * this.speed;

    // Obstacle collision
    obstacles.forEach(box => {
      resolveCircleBoxCollision(this, box);
    });

    // World bounds
    this.x = Math.max(this.radius + 15, Math.min(worldWidth - this.radius - 15, this.x));
    this.y = Math.max(this.radius + 15, Math.min(worldHeight - this.radius - 15, this.y));
  }

  takeDamage(amount, particles) {
    this.hp -= amount;
    this.hitFlashTimer = 100;
    window.soundFx.playEnemyHit();

    // Damage number popup
    if (particles) {
      if (particles.spawnText) {
        particles.spawnText(this.x, this.y - 10, `-${Math.round(amount)}`, '#ffff00');
      } else if (Array.isArray(particles)) {
        particles.push(new FloatingText(this.x, this.y - 10, `-${Math.round(amount)}`, '#ffff00'));
      }
    }

    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const isFlashing = this.hitFlashTimer > 0;

    // Rotate to angle
    ctx.rotate(this.angle);

    // Shooter telegraph laser sight before firing
    if (this.type === 'shooter' && this.shootTimer <= this.telegraphDuration) {
      const beamProgress = 1 - (this.shootTimer / this.telegraphDuration);
      ctx.save();
      ctx.strokeStyle = `rgba(255, 30, 80, ${0.35 + beamProgress * 0.65})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(340, 0);
      ctx.stroke();
      ctx.restore();
    }

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius + 4, this.radius + 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // Body drawing based on type
    if (this.type === 'walker') {
      // Cyborg Zombie
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isFlashing ? '#ffffff' : this.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = isFlashing ? '#ffffff' : this.border;
      ctx.stroke();

      // Cyber eyes
      ctx.fillStyle = '#ff0033';
      ctx.beginPath();
      ctx.arc(6, -4, 3, 0, Math.PI * 2);
      ctx.arc(6, 4, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'swarmer') {
      // Insectoid mutan
      ctx.beginPath();
      ctx.moveTo(this.radius + 4, 0);
      ctx.lineTo(-this.radius, -this.radius * 0.9);
      ctx.lineTo(-this.radius * 0.5, 0);
      ctx.lineTo(-this.radius, this.radius * 0.9);
      ctx.closePath();
      ctx.fillStyle = isFlashing ? '#ffffff' : this.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isFlashing ? '#ffffff' : this.border;
      ctx.stroke();
    } else if (this.type === 'shooter') {
      // Hover shooter bot
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isFlashing ? '#ffffff' : this.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = isFlashing ? '#ffffff' : this.border;
      ctx.stroke();

      // Cannon barrel
      ctx.fillStyle = '#1c2938';
      ctx.fillRect(4, -3, 14, 6);
      ctx.fillStyle = '#ff00aa';
      ctx.fillRect(16, -2, 4, 4);
    } else if (this.type === 'tank') {
      // Armored Heavy Tank
      ctx.beginPath();
      ctx.rect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
      ctx.fillStyle = isFlashing ? '#ffffff' : this.color;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = isFlashing ? '#ffffff' : this.border;
      ctx.stroke();

      // Heavy armor plates
      ctx.fillStyle = '#222';
      ctx.fillRect(0, -6, 26, 12);
    } else if (this.type === 'boss') {
      // Giant Titan Overlord
      ctx.shadowBlur = this.isEnraged ? 25 : 15;
      ctx.shadowColor = this.isEnraged ? '#ff0000' : '#ff0055';

      // Giant outer spiked hull
      ctx.beginPath();
      const points = 8;
      for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? this.radius : this.radius * 0.75;
        const a = (Math.PI / points) * i;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = isFlashing ? '#ffffff' : this.color;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = isFlashing ? '#ffffff' : this.border;
      ctx.stroke();

      // Dual cannons
      ctx.fillStyle = '#111';
      ctx.fillRect(15, -16, 28, 8);
      ctx.fillRect(15, 8, 28, 8);

      // Glowing central core
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fillStyle = this.isEnraged ? '#ffee00' : '#00ffff';
      ctx.fill();
    }

    ctx.restore();

    // Health Bar above enemy head (if damaged or boss)
    if (this.hp < this.maxHp || this.type === 'boss') {
      this.drawHealthBar(ctx);
    }
  }

  drawHealthBar(ctx) {
    const barWidth = Math.max(30, this.radius * 2);
    const barHeight = this.type === 'boss' ? 7 : 4;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.radius - 12;

    ctx.save();
    // Background bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

    // Current health
    const pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = this.type === 'boss' ? '#ff0055' : (pct > 0.4 ? '#00ff88' : '#ff3366');
    ctx.fillRect(barX, barY, barWidth * pct, barHeight);
    ctx.restore();
  }
}

// ========================================================
// PICKUP CLASS (Health, Boost)
// ========================================================
class Pickup {
  constructor(x, y, type = 'health') {
    this.x = x;
    this.y = y;
    this.type = type; // 'health' or 'ammo'
    this.radius = 14;
    this.bobOffset = Math.random() * Math.PI * 2;
    this.isDead = false;
    this.duration = 20000; // 20s life before despawn
  }

  update(dt, player) {
    this.bobOffset += dt * 0.005;
    this.duration -= dt;
    if (this.duration <= 0) {
      this.isDead = true;
      return;
    }

    // Check pickup by player
    if (dist(this.x, this.y, player.x, player.y) < this.radius + player.radius) {
      if (this.type === 'health') {
        player.heal(35);
      }
      window.soundFx.playPickup();
      this.isDead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    const bobY = this.y + Math.sin(this.bobOffset) * 4;
    ctx.translate(this.x, bobY);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff88';

    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Red/Green Cross symbol
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(-3, -8, 6, 16);
    ctx.fillRect(-8, -3, 16, 6);

    ctx.restore();
  }
}

// ========================================================
// PARTICLE SYSTEM & POOL (Zero-Allocation High Performance)
// ========================================================
class Particle {
  constructor(x = 0, y = 0, vx = 0, vy = 0, color = '#fff', radius = 3, life = 300, type = 'circle', angle = 0) {
    this.reset(x, y, vx, vy, color, radius, life, type, angle);
  }

  reset(x, y, vx, vy, color, radius, life = 300, type = 'circle', angle = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.radius = radius;
    this.maxLife = life;
    this.life = life;
    this.type = type;
    this.angle = angle;
    this.isDead = false;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.isDead = true;
      return;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.94; // Friction damping
    this.vy *= 0.94;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;

    if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * alpha, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    } else if (this.type === 'ghost') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.type === 'shockwave') {
      const currentRadius = this.radius * (1 - alpha) + 5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3 * alpha;
      ctx.stroke();
    }

    ctx.restore();
  }
}

// Floating Damage / Notification Numbers
class FloatingText {
  constructor(x, y, text, color = '#ffffff') {
    this.x = x + (Math.random() - 0.5) * 15;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 650;
    this.maxLife = 650;
    this.vy = -1.2;
    this.isDead = false;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.isDead = true;
      return;
    }
    this.y += this.vy;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// Particle Pool to completely avoid GC stutter on mobile phones
class ParticlePool {
  constructor(maxSize = 140) {
    this.particles = [];
    this.maxSize = maxSize;
    for (let i = 0; i < maxSize; i++) {
      const p = new Particle();
      p.isDead = true;
      this.particles.push(p);
    }
    this.floatingTexts = [];
  }

  spawn(x, y, vx, vy, color, radius, life = 300, type = 'circle', angle = 0) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.isDead) {
        p.reset(x, y, vx, vy, color, radius, life, type, angle);
        return p;
      }
    }
    // Recycle oldest
    let oldest = this.particles[0];
    for (let i = 1; i < this.particles.length; i++) {
      if (this.particles[i].life < oldest.life) oldest = this.particles[i];
    }
    oldest.reset(x, y, vx, vy, color, radius, life, type, angle);
    return oldest;
  }

  spawnText(x, y, text, color = '#ffffff') {
    if (this.floatingTexts.length > 25) {
      this.floatingTexts.shift();
    }
    this.floatingTexts.push(new FloatingText(x, y, text, color));
  }

  update(dt) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.isDead) p.update(dt);
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.update(dt);
      if (t.isDead) this.floatingTexts.splice(i, 1);
    }
  }

  draw(ctx, camera, viewW, viewH) {
    const minX = camera.x - 30;
    const maxX = camera.x + viewW + 30;
    const minY = camera.y - 30;
    const maxY = camera.y + viewH + 30;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.isDead && p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
        p.draw(ctx);
      }
    }
    for (let i = 0; i < this.floatingTexts.length; i++) {
      const t = this.floatingTexts[i];
      if (t.x >= minX && t.x <= maxX && t.y >= minY && t.y <= maxY) {
        t.draw(ctx);
      }
    }
  }

  clear() {
    this.particles.forEach(p => p.isDead = true);
    this.floatingTexts = [];
  }
}
