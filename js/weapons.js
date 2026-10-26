/* ========================================================
   CYBER SURVIVOR 2D - WEAPONS DEFINITIONS & BEHAVIOR
   Includes Handgun, Shotgun, Rapid SMG, and Plasma Rocket
   ======================================================== */

class Weapon {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.icon = config.icon;
    this.damage = config.damage;
    this.fireRate = config.fireRate; // Seconds between shots
    this.speed = config.speed; // Bullet speed (px/sec)
    this.ammo = config.ammo; // Current ammo
    this.maxAmmo = config.maxAmmo;
    this.spread = config.spread || 0; // In radians
    this.pellets = config.pellets || 1; // Pellets per shot (e.g. Shotgun)
    this.color = config.color || '#00f0ff';
    this.bulletRadius = config.bulletRadius || 4;
    this.splashRadius = config.splashRadius || 0; // For explosive rockets
    this.recoil = config.recoil || 0;
    this.unlocked = config.unlocked !== undefined ? config.unlocked : true;

    this.lastShotTime = 0;
  }

  canFire(currentTime) {
    if (!this.unlocked) return false;
    if (this.ammo <= 0 && this.ammo !== Infinity) return false;
    return (currentTime - this.lastShotTime) >= this.fireRate;
  }

  trigger(currentTime) {
    this.lastShotTime = currentTime;
    if (this.ammo !== Infinity) {
      this.ammo--;
    }
  }

  addAmmo(amount) {
    if (this.ammo === Infinity) return;
    this.ammo = Math.min(this.maxAmmo, this.ammo + amount);
  }
}

class WeaponArsenal {
  constructor() {
    this.weapons = [
      new Weapon({
        id: 'pistol',
        name: 'Pistol',
        icon: '🔫',
        damage: 25,
        fireRate: 0.22,
        speed: 850,
        ammo: Infinity,
        maxAmmo: Infinity,
        spread: 0.04,
        pellets: 1,
        color: '#00f0ff',
        bulletRadius: 4,
        recoil: 3,
        unlocked: true
      }),
      new Weapon({
        id: 'shotgun',
        name: 'Shotgun',
        icon: '💥',
        damage: 18,
        fireRate: 0.65,
        speed: 750,
        ammo: 35,
        maxAmmo: 60,
        spread: 0.28,
        pellets: 6,
        color: '#ffcc00',
        bulletRadius: 3.5,
        recoil: 10,
        unlocked: true
      }),
      new Weapon({
        id: 'smg',
        name: 'Rapid SMG',
        icon: '⚡',
        damage: 15,
        fireRate: 0.09,
        speed: 900,
        ammo: 150,
        maxAmmo: 250,
        spread: 0.12,
        pellets: 1,
        color: '#ff3366',
        bulletRadius: 3.5,
        recoil: 2,
        unlocked: true
      }),
      new Weapon({
        id: 'rocket',
        name: 'Plasma RPG',
        icon: '🚀',
        damage: 130,
        fireRate: 0.95,
        speed: 600,
        ammo: 12,
        maxAmmo: 25,
        spread: 0.02,
        pellets: 1,
        color: '#b537f2',
        bulletRadius: 8,
        splashRadius: 110,
        recoil: 14,
        unlocked: true
      })
    ];

    this.currentIndex = 0;
  }

  getCurrentWeapon() {
    return this.weapons[this.currentIndex];
  }

  select(index) {
    if (index >= 0 && index < this.weapons.length) {
      if (this.currentIndex !== index) {
        this.currentIndex = index;
        if (window.soundManager) window.soundManager.playWeaponSwitch();
      }
    }
  }

  cycle(dir) {
    let nextIndex = (this.currentIndex + dir + this.weapons.length) % this.weapons.length;
    this.select(nextIndex);
  }

  refillAllAmmo() {
    this.weapons.forEach(w => {
      if (w.ammo !== Infinity) {
        w.ammo = w.maxAmmo;
      }
    });
  }
}
