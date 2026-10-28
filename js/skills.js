/**
 * CYBER STRIKE 2D - 3 Skills System
 * 1. Regenerasi Cepat (30s duration, 60s cooldown)
 * 2. Memanggil Teman / Droid Sekutu (20s duration, 30s cooldown)
 * 3. Langsung Bunuh Seluruh Musuh (Super Nuke - 1x Pakai saja per permainan)
 */

class SkillManager {
  constructor(game) {
    this.game = game;

    this.skills = {
      regen: {
        id: 'regen',
        name: 'Regenerasi Cepat',
        shortName: 'Regen',
        icon: '💚',
        key: 'F',
        duration: 30000,    // 30 seconds duration
        cooldown: 60000,    // 60 seconds cooldown
        activeTimer: 0,
        cooldownTimer: 0,
        isActive: false,
        healPerSec: 5,      // Restores 5 HP per second
        healAccumulator: 0,
        desc: 'Memulihkan HP secara cepat selama 30 detik. Cooldown 60 detik.'
      },
      summon: {
        id: 'summon',
        name: 'Panggil Teman',
        shortName: 'Teman',
        icon: '🤖',
        key: 'G',
        duration: 20000,    // 20 seconds duration
        cooldown: 30000,    // 30 seconds cooldown
        activeTimer: 0,
        cooldownTimer: 0,
        isActive: false,
        drones: [],
        desc: 'Memanggil 2 Droid Sekutu tempur selama 20 detik. Cooldown 30 detik.'
      },
      nuke: {
        id: 'nuke',
        name: 'Pemusnah Massal',
        shortName: 'Nuke',
        icon: '☢️',
        key: 'V',
        isOneTime: true,
        used: false,        // Single-use only for whole run!
        desc: 'Hancurkan SELURUH musuh di arena secara instan! Hanya 1x pakai per game.'
      }
    };

    this.domElements = {};
  }

  initDOM() {
    this.domElements = {
      btnRegen: document.getElementById('skill-regen-btn'),
      cdRegen: document.getElementById('skill-regen-cd'),
      btnSummon: document.getElementById('skill-summon-btn'),
      cdSummon: document.getElementById('skill-summon-cd'),
      btnNuke: document.getElementById('skill-nuke-btn'),
      cdNuke: document.getElementById('skill-nuke-cd')
    };

    // Attach click / touch handlers for UI buttons
    if (this.domElements.btnRegen) {
      this.domElements.btnRegen.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activateSkill('regen');
      });
    }
    if (this.domElements.btnSummon) {
      this.domElements.btnSummon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activateSkill('summon');
      });
    }
    if (this.domElements.btnNuke) {
      this.domElements.btnNuke.addEventListener('click', (e) => {
        e.stopPropagation();
        this.activateSkill('nuke');
      });
    }
  }

  // Full reset (when starting Level 1 or restarting game from beginning)
  resetAll() {
    // Reset Regen
    this.skills.regen.isActive = false;
    this.skills.regen.activeTimer = 0;
    this.skills.regen.cooldownTimer = 0;
    this.skills.regen.healAccumulator = 0;

    // Reset Summon
    this.skills.summon.isActive = false;
    this.skills.summon.activeTimer = 0;
    this.skills.summon.cooldownTimer = 0;
    this.skills.summon.drones = [];

    // Reset Nuke single-use
    this.skills.nuke.used = false;

    this.updateUI();
  }

  // Level transition reset: keep Nuke state, clear active summons
  onLevelStart() {
    this.skills.summon.drones = [];
    if (this.skills.summon.isActive) {
      this.skills.summon.isActive = false;
      this.skills.summon.activeTimer = 0;
    }
    this.updateUI();
  }

  activateSkill(id) {
    if (this.game.state !== 'PLAYING' || !this.game.player) return;

    window.soundFx.init();

    if (id === 'regen') {
      const sk = this.skills.regen;
      if (sk.cooldownTimer > 0 || sk.isActive) return;

      sk.isActive = true;
      sk.activeTimer = sk.duration;
      sk.cooldownTimer = sk.cooldown;
      sk.healAccumulator = 0;

      window.soundFx.playSkillRegen();
      window.soundFx.vibrate(35);
      this.game.showAlert('💚 SKILL AKTIF: REGENERASI CEPAT (30 Detik)!', 2200);

      // Healing aura particles
      for (let i = 0; i < 15; i++) {
        const a = Math.random() * Math.PI * 2;
        this.game.particlePool.spawn(
          this.game.player.x + Math.cos(a) * 20,
          this.game.player.y + Math.sin(a) * 20,
          Math.cos(a) * 2,
          Math.sin(a) * 2 - 2,
          '#00ff88',
          4,
          500
        );
      }
    } else if (id === 'summon') {
      const sk = this.skills.summon;
      if (sk.cooldownTimer > 0 || sk.isActive) return;

      sk.isActive = true;
      sk.activeTimer = sk.duration;
      sk.cooldownTimer = sk.cooldown;

      // Spawn 2 Companion Drones flanking player
      sk.drones = [
        new AllyDrone(this.game.player.x - 45, this.game.player.y - 45, -Math.PI / 3),
        new AllyDrone(this.game.player.x + 45, this.game.player.y - 45, Math.PI / 3)
      ];

      window.soundFx.playSkillSummon();
      window.soundFx.vibrate(40);
      this.game.showAlert('🤖 SKILL AKTIF: DROID TEMAN MEMBANTU (20 Detik)!', 2200);

      // Summon warp particles
      for (let i = 0; i < 20; i++) {
        const a = Math.random() * Math.PI * 2;
        this.game.particlePool.spawn(
          this.game.player.x,
          this.game.player.y,
          Math.cos(a) * 4,
          Math.sin(a) * 4,
          '#00f0ff',
          5,
          400
        );
      }
    } else if (id === 'nuke') {
      const sk = this.skills.nuke;
      if (sk.used) {
        this.game.showAlert('⚠️ SKILL NUKE SUDAH TERPAKAI! (Hanya 1x per game)', 2000);
        return;
      }

      sk.used = true;
      this.triggerNuke();
    }

    this.updateUI();
  }

  triggerNuke() {
    window.soundFx.playSkillNuke();
    window.soundFx.vibrate([80, 50, 150]);
    this.game.addScreenShake(20);

    this.game.showAlert('☢️ PEMUSNAH MASSAL DIAKTIFKAN! SELURUH MUSUH DIELIMINASI!', 2800);

    // Massive screen flash effect
    this.game.nukeFlashTimer = 600;

    // Eliminate all active enemies
    const enemiesToKill = [...this.game.enemies];
    for (let i = 0; i < enemiesToKill.length; i++) {
      const e = enemiesToKill[i];
      e.hp = 0;
      e.isDead = true;

      // Award score & kills
      const mult = this.game.selectedDifficulty ? this.game.selectedDifficulty.scoreMultiplier : 1.0;
      this.game.score += Math.round(e.score * mult);
      this.game.totalKills++;

      // Massive death blast particles
      for (let k = 0; k < 14; k++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        this.game.particlePool.spawn(
          e.x, e.y,
          Math.cos(a) * spd,
          Math.sin(a) * spd,
          Math.random() < 0.5 ? '#ff0055' : '#ffee00',
          Math.random() * 6 + 3,
          500
        );
      }
    }

    // Clear active enemy bullets
    this.game.enemyBullets = [];

    // Trigger orbital shockwaves
    this.game.particlePool.spawn(this.game.player.x, this.game.player.y, 0, 0, '#ffffff', 400, 600, 'shockwave');
    this.game.particlePool.spawn(this.game.player.x, this.game.player.y, 0, 0, '#00f0ff', 600, 800, 'shockwave');
  }

  update(dt, player, enemies, playerBullets, particles) {
    // 1. Update Regen Skill
    const regen = this.skills.regen;
    if (regen.cooldownTimer > 0) {
      regen.cooldownTimer = Math.max(0, regen.cooldownTimer - dt);
    }

    if (regen.isActive) {
      regen.activeTimer -= dt;

      // Smooth rapid heal
      const healAmount = (regen.healPerSec * dt) / 1000;
      player.hp = Math.min(player.maxHp, player.hp + healAmount);

      // Healing aura particles
      if (Math.random() < 0.35) {
        const a = Math.random() * Math.PI * 2;
        particles.spawn(
          player.x + Math.cos(a) * 22,
          player.y + Math.sin(a) * 22,
          (Math.random() - 0.5) * 1.5,
          -1.5 - Math.random() * 2,
          '#00ff88',
          3.5,
          400
        );
      }

      if (regen.activeTimer <= 0) {
        regen.isActive = false;
        this.game.showAlert('Regenerasi Cepat Selesai.', 1200);
      }
    }

    // 2. Update Summon Skill
    const summon = this.skills.summon;
    if (summon.cooldownTimer > 0) {
      summon.cooldownTimer = Math.max(0, summon.cooldownTimer - dt);
    }

    if (summon.isActive) {
      summon.activeTimer -= dt;

      // Update companion drones
      summon.drones.forEach((drone, idx) => {
        const orbitOffset = (idx === 0 ? -1 : 1) * 0.7;
        drone.update(dt, player, enemies, playerBullets, particles, orbitOffset);
      });

      if (summon.activeTimer <= 0) {
        summon.isActive = false;
        // Drones vanish with spark effect
        summon.drones.forEach(d => {
          for (let i = 0; i < 12; i++) {
            const a = Math.random() * Math.PI * 2;
            particles.spawn(d.x, d.y, Math.cos(a) * 3, Math.sin(a) * 3, '#00f0ff', 4, 300);
          }
        });
        summon.drones = [];
        this.game.showAlert('Waktu Bantuan Teman Habis.', 1200);
      }
    }

    this.updateUI();
  }

  draw(ctx) {
    // Draw companion drones if active
    if (this.skills.summon.isActive) {
      this.skills.summon.drones.forEach(drone => drone.draw(ctx));
    }

    // Draw player healing aura ring if regen is active
    if (this.skills.regen.isActive && this.game.player) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.game.player.x, this.game.player.y, this.game.player.radius + 12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.restore();
    }
  }

  updateUI() {
    // Update Regen UI
    const reg = this.skills.regen;
    if (this.domElements.btnRegen && this.domElements.cdRegen) {
      if (reg.isActive) {
        const secLeft = Math.ceil(reg.activeTimer / 1000);
        this.domElements.btnRegen.className = 'skill-btn active';
        this.domElements.cdRegen.textContent = `${secLeft}s`;
        this.domElements.cdRegen.style.display = 'flex';
      } else if (reg.cooldownTimer > 0) {
        const secLeft = Math.ceil(reg.cooldownTimer / 1000);
        this.domElements.btnRegen.className = 'skill-btn on-cd';
        this.domElements.cdRegen.textContent = `${secLeft}s`;
        this.domElements.cdRegen.style.display = 'flex';
      } else {
        this.domElements.btnRegen.className = 'skill-btn ready';
        this.domElements.cdRegen.style.display = 'none';
      }
    }

    // Update Summon UI
    const sum = this.skills.summon;
    if (this.domElements.btnSummon && this.domElements.cdSummon) {
      if (sum.isActive) {
        const secLeft = Math.ceil(sum.activeTimer / 1000);
        this.domElements.btnSummon.className = 'skill-btn active';
        this.domElements.cdSummon.textContent = `${secLeft}s`;
        this.domElements.cdSummon.style.display = 'flex';
      } else if (sum.cooldownTimer > 0) {
        const secLeft = Math.ceil(sum.cooldownTimer / 1000);
        this.domElements.btnSummon.className = 'skill-btn on-cd';
        this.domElements.cdSummon.textContent = `${secLeft}s`;
        this.domElements.cdSummon.style.display = 'flex';
      } else {
        this.domElements.btnSummon.className = 'skill-btn ready';
        this.domElements.cdSummon.style.display = 'none';
      }
    }

    // Update Nuke UI
    const nuk = this.skills.nuke;
    if (this.domElements.btnNuke && this.domElements.cdNuke) {
      if (nuk.used) {
        this.domElements.btnNuke.className = 'skill-btn used';
        this.domElements.cdNuke.textContent = 'HABIS';
        this.domElements.cdNuke.style.display = 'flex';
      } else {
        this.domElements.btnNuke.className = 'skill-btn ready pulse-nuke';
        this.domElements.cdNuke.style.display = 'none';
      }
    }
  }
}
