/* ========================================================
   CYBER SURVIVOR 2D - GAME ENTITIES
   Player, Enemies, Projectiles, Pickups, and Particle Effects
   ======================================================== */

// --- FLOATING TEXT ---
class FloatingText {
  constructor(x, y, text, color = '#ffcc00', size = 16) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.size = size;
    this.alpha = 1.0;
    this.vy = -35; // Floats upward
    this.lifetime = 0.7; // seconds
    this.timer = 0;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.timer += dt;
    this.alpha = Math.max(0, 1 - (this.timer / this.lifetime));
    return this.timer < this.lifetime;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = `bold ${this.size}px sans-serif`;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// --- PARTICLE FX ---
class Particle {
  constructor(x, y, color, speed, size, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const vel = (Math.random() * 0.7 + 0.3) * speed;
    this.vx = Math.cos(angle) * vel;
    this.vy = Math.sin(angle) * vel;
    this.size = size;
    this.maxLife = life;
    this.life = life;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.94; // Friction
    this.vy *= 0.94;
    this.life -= dt;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(1, this.size * alpha), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// --- PROJECTILE ---
class Projectile {
  constructor(x, y, angle, speed, damage, radius, color, isEnemy = false, splashRadius = 0) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.damage = damage;
    this.radius = radius;
    this.color = color;
    this.isEnemy = isEnemy;
    this.splashRadius = splashRadius;
    this.alive = true;
    this.traveled = 0;
    this.maxDistance = 1400; // Despawn distance
  }

  update(dt, arena) {
    const stepX = this.vx * dt;
    const stepY = this.vy * dt;
    this.x += stepX;
    this.y += stepY;
    this.traveled += Math.hypot(stepX, stepY);

    // Wall collision
    if (this.x < 0 || this.x > arena.width || this.y < 0 || this.y > arena.height) {
      this.alive = false;
      return false;
    }

    if (this.traveled > this.maxDistance) {
      this.alive = false;
      return false;
    }

    return true;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;

    // Bullet trail
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Glow tail
    const tailLen = this.radius * 2.5;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.radius * 0.8;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.cos(this.angle) * tailLen, this.y - Math.sin(this.angle) * tailLen);
    ctx.stroke();

    ctx.restore();
  }
}

// --- PICKUP ITEM ---
class Pickup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'health', 'ammo', 'shield'
    this.radius = 16;
    this.timer = 0;
    this.lifetime = 25; // 25 seconds before fading
  }

  update(dt) {
    this.timer += dt;
    return this.timer < this.lifetime;
  }

  draw(ctx) {
    ctx.save();
    // Bobbing animation
    const bob = Math.sin(this.timer * 4) * 3;
    const renderY = this.y + bob;

    let color = '#00ff88';
    let icon = '➕';
    if (this.type === 'ammo') {
      color = '#ffcc00';
      icon = '⚡';
    } else if (this.type === 'shield') {
      color = '#00f0ff';
      icon = '🛡️';
    }

    // Outer aura
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2 + Math.sin(this.timer * 6) * 0.1;
    ctx.beginPath();
    ctx.arc(this.x, renderY, this.radius + 6, 0, Math.PI * 2);
    ctx.fill();

    // Core circle
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, renderY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Icon text
    ctx.globalAlpha = 1.0;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, this.x, renderY);

    ctx.restore();
  }
}

// --- PLAYER ---
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.speed = 260; // Pixels per second
    this.maxHealth = 100;
    this.health = 100;
    this.maxShield = 60;
    this.shield = 60;
    this.angle = 0;
    this.damageCooldown = 0;
    this.shieldRegenDelay = 0;
    this.alive = true;
  }

  takeDamage(amount) {
    if (this.damageCooldown > 0 || !this.alive) return;
    this.damageCooldown = 0.25; // Invulnerable frame
    this.shieldRegenDelay = 3.5; // Seconds before shield starts regening

    if (window.soundManager) window.soundManager.playPlayerHurt();

    // Damage shield first
    if (this.shield > 0) {
      if (this.shield >= amount) {
        this.shield -= amount;
        amount = 0;
      } else {
        amount -= this.shield;
        this.shield = 0;
      }
    }

    // Remaining damage to health
    if (amount > 0) {
      this.health -= amount;
      if (this.health <= 0) {
        this.health = 0;
        this.alive = false;
      }
    }
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  rechargeShield(amount) {
    this.shield = Math.min(this.maxShield, this.shield + amount);
  }

  update(dt, input, arena) {
    if (!this.alive) return;

    // Shield Regen
    if (this.shieldRegenDelay > 0) {
      this.shieldRegenDelay -= dt;
    } else if (this.shield < this.maxShield) {
      this.shield = Math.min(this.maxShield, this.shield + 18 * dt);
    }

    if (this.damageCooldown > 0) {
      this.damageCooldown -= dt;
    }

    // Movement
    if (input.moveX !== 0 || input.moveY !== 0) {
      this.x += input.moveX * this.speed * dt;
      this.y += input.moveY * this.speed * dt;
    }

    // Aim Angle
    this.angle = input.aimAngle;

    // Arena boundary clamp
    this.x = Math.max(this.radius, Math.min(arena.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(arena.height - this.radius, this.y));
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Laser sight line
    ctx.save();
    ctx.rotate(this.angle);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(this.radius + 10, 0);
    ctx.lineTo(260, 0);
    ctx.stroke();
    ctx.restore();

    // Flash white when taking damage
    if (this.damageCooldown > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Rotate player body towards aim
    ctx.rotate(this.angle);

    // Gun Barrel
    ctx.fillStyle = '#475569';
    ctx.fillRect(8, -4, 18, 8);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(22, -3, 6, 6);

    // Player Body (Cyber Armor)
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Helmet Visor
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(6, 0, 7, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Shield Aura indicator
    if (this.shield > 0) {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// --- ENEMIES ---
class Enemy {
  constructor(x, y, config) {
    this.x = x;
    this.y = y;
    this.type = config.type || 'stalker'; // 'stalker', 'runner', 'tank', 'shooter', 'boss'
    this.radius = config.radius || 18;
    this.speed = config.speed || 140;
    this.maxHealth = config.health || 40;
    this.health = this.maxHealth;
    this.damage = config.damage || 15;
    this.color = config.color || '#ff3366';
    this.shootCooldown = 0;
    this.shootInterval = config.shootInterval || 2.0;
    this.isBoss = config.isBoss || false;
    this.alive = true;
    this.hitFlashTimer = 0;
  }

  takeDamage(amount) {
    this.health -= amount;
    this.hitFlashTimer = 0.08;
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
    }
  }

  update(dt, player, arena, game) {
    if (!this.alive) return;

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= dt;
    }

    // Distance and vector to player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);
    const angleToPlayer = Math.atan2(dy, dx);

    // AI BEHAVIOR
    if (this.type === 'shooter') {
      // Keep distance around 280px
      if (dist < 230) {
        // Back off
        this.x -= Math.cos(angleToPlayer) * this.speed * dt;
        this.y -= Math.sin(angleToPlayer) * this.speed * dt;
      } else if (dist > 340) {
        // Approach
        this.x += Math.cos(angleToPlayer) * this.speed * dt;
        this.y += Math.sin(angleToPlayer) * this.speed * dt;
      }

      // Shoot projectile at player
      this.shootCooldown -= dt;
      if (this.shootCooldown <= 0) {
        this.shootCooldown = this.shootInterval;
        game.spawnEnemyBullet(this.x, this.y, angleToPlayer, 350, 15, 6, '#38bdf8');
      }

    } else if (this.isBoss) {
      // BOSS AI
      if (dist > 180) {
        this.x += Math.cos(angleToPlayer) * this.speed * dt;
        this.y += Math.sin(angleToPlayer) * this.speed * dt;
      }

      this.shootCooldown -= dt;
      if (this.shootCooldown <= 0) {
        this.shootCooldown = this.shootInterval;

        // Boss Attack 1: Ring of fire (8-way or 12-way)
        const bulletsCount = 10;
        for (let i = 0; i < bulletsCount; i++) {
          const spreadAngle = (Math.PI * 2 / bulletsCount) * i + Math.sin(Date.now() * 0.003);
          game.spawnEnemyBullet(this.x, this.y, spreadAngle, 320, 16, 7, '#ff3366');
        }

        // Play sound
        if (window.soundManager) window.soundManager.playShoot('shotgun');
      }

    } else {
      // Melee (Stalker, Runner, Tank): Charge directly at player
      this.x += Math.cos(angleToPlayer) * this.speed * dt;
      this.y += Math.sin(angleToPlayer) * this.speed * dt;
    }

    // Boundary clamp
    this.x = Math.max(this.radius, Math.min(arena.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(arena.height - this.radius, this.y));

    // Melee attack collision with player
    if (dist < this.radius + player.radius) {
      player.takeDamage(this.damage);
    }
  }

  draw(ctx, player) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    ctx.rotate(angle);

    // Hit flash
    if (this.hitFlashTimer > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Enemy body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.isBoss ? 4 : 2.5;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.isBoss ? 16 : 8;

    if (this.type === 'tank') {
      // Square/Heavy armored body
      ctx.strokeRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
      ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
      // Spikes
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.radius, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.isBoss) {
      // Mega Boss mechanical shape
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Core glowing reactor
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Gun Cannons
      ctx.fillStyle = '#64748b';
      ctx.fillRect(this.radius - 10, -22, 28, 10);
      ctx.fillRect(this.radius - 10, 12, 28, 10);
    } else {
      // Standard round bug/drone
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Red eye / front pincers
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.radius * 0.6, 0, this.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Health bar above head (if damaged or boss)
    if (this.health < this.maxHealth || this.isBoss) {
      const barW = this.radius * 2 + 10;
      const barH = 5;
      const barX = this.x - barW / 2;
      const barY = this.y - this.radius - 12;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(barX, barY, barW, barH);
      const pct = Math.max(0, this.health / this.maxHealth);
      ctx.fillStyle = this.isBoss ? '#ff0055' : '#00ff88';
      ctx.fillRect(barX, barY, barW * pct, barH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(barX, barY, barW, barH);
      ctx.restore();
    }
  }
}
