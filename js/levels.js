/* ========================================================
   CYBER SURVIVOR 2D - LEVEL CONFIGURATIONS
   5 Distinct Levels with progressive difficulty & boss battle
   ======================================================== */

const LEVEL_CONFIGS = [
  {
    level: 1,
    title: "SECTOR 1: FIRST BREACH",
    description: "Musuh pertama terdeteksi! Habisi semua 12 stalker drone untuk mengamankan area.",
    totalEnemies: 12,
    spawnInterval: 1.8,
    types: [
      { type: 'stalker', weight: 8, health: 35, speed: 130, damage: 12, color: '#ff3366', radius: 17 },
      { type: 'runner', weight: 2, health: 20, speed: 200, damage: 8, color: '#ffcc00', radius: 14 }
    ],
    arena: { width: 1600, height: 1600 }
  },
  {
    level: 2,
    title: "SECTOR 2: FAST SWARM",
    description: "Gerombolan musuh berkecepatan tinggi menyerang! Gunakan Shotgun atau SMG.",
    totalEnemies: 20,
    spawnInterval: 1.4,
    types: [
      { type: 'stalker', weight: 5, health: 45, speed: 145, damage: 14, color: '#ff3366', radius: 17 },
      { type: 'runner', weight: 5, health: 25, speed: 220, damage: 10, color: '#ffcc00', radius: 14 }
    ],
    arena: { width: 1700, height: 1700 }
  },
  {
    level: 3,
    title: "SECTOR 3: HEAVY ARMOR",
    description: "Tank berlapis baja mendekat! Mereka memiliki HP tebal dan damage tinggi.",
    totalEnemies: 26,
    spawnInterval: 1.2,
    types: [
      { type: 'stalker', weight: 4, health: 50, speed: 150, damage: 15, color: '#ff3366', radius: 17 },
      { type: 'runner', weight: 3, health: 28, speed: 230, damage: 12, color: '#ffcc00', radius: 14 },
      { type: 'tank', weight: 3, health: 220, speed: 90, damage: 30, color: '#a855f7', radius: 26 }
    ],
    arena: { width: 1800, height: 1800 }
  },
  {
    level: 4,
    title: "SECTOR 4: CROSSFIRE",
    description: "Waspada! Spitter drone dapat menembak proyektil energi ke arahmu dari jauh.",
    totalEnemies: 32,
    spawnInterval: 1.1,
    types: [
      { type: 'stalker', weight: 3, health: 55, speed: 150, damage: 16, color: '#ff3366', radius: 17 },
      { type: 'runner', weight: 3, health: 30, speed: 240, damage: 12, color: '#ffcc00', radius: 14 },
      { type: 'tank', weight: 2, health: 250, speed: 95, damage: 32, color: '#a855f7', radius: 26 },
      { type: 'shooter', weight: 3, health: 70, speed: 110, damage: 15, shootInterval: 1.8, color: '#00f0ff', radius: 18 }
    ],
    arena: { width: 1900, height: 1900 }
  },
  {
    level: 5,
    title: "SECTOR 5: CYBER TITAN",
    description: "BOSS TERAKHIR! Kalahkan Cyber Titan dan pasukan pengawalnya untuk menuntaskan misi!",
    totalEnemies: 38, // 1 Boss + 37 Minions
    spawnInterval: 1.2,
    hasBoss: true,
    bossConfig: {
      type: 'boss',
      isBoss: true,
      health: 1600,
      speed: 85,
      damage: 40,
      radius: 46,
      color: '#ff0055',
      shootInterval: 2.2
    },
    types: [
      { type: 'stalker', weight: 4, health: 60, speed: 155, damage: 16, color: '#ff3366', radius: 17 },
      { type: 'runner', weight: 3, health: 35, speed: 250, damage: 14, color: '#ffcc00', radius: 14 },
      { type: 'shooter', weight: 3, health: 80, speed: 115, damage: 16, shootInterval: 1.6, color: '#00f0ff', radius: 18 }
    ],
    arena: { width: 2000, height: 2000 }
  }
];

class LevelManager {
  constructor(game) {
    this.game = game;
    this.currentLevelIndex = 0; // 0 to 4
    this.currentConfig = LEVEL_CONFIGS[0];
    this.spawnTimer = 0;
    this.spawnedCount = 0;
    this.killedCount = 0;
    this.bossSpawned = false;
  }

  loadLevel(levelIndex) {
    this.currentLevelIndex = Math.min(levelIndex, LEVEL_CONFIGS.length - 1);
    this.currentConfig = LEVEL_CONFIGS[this.currentLevelIndex];
    this.spawnTimer = 0;
    this.spawnedCount = 0;
    this.killedCount = 0;
    this.bossSpawned = false;
    return this.currentConfig;
  }

  getEnemiesRemaining() {
    return Math.max(0, this.currentConfig.totalEnemies - this.killedCount);
  }

  onEnemyKilled() {
    this.killedCount++;
  }

  isLevelComplete() {
    return this.killedCount >= this.currentConfig.totalEnemies;
  }

  hasNextLevel() {
    return this.currentLevelIndex < LEVEL_CONFIGS.length - 1;
  }

  nextLevel() {
    if (this.hasNextLevel()) {
      return this.loadLevel(this.currentLevelIndex + 1);
    }
    return null;
  }

  update(dt, player, arena) {
    // If still have enemies to spawn
    if (this.spawnedCount < this.currentConfig.totalEnemies) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= this.currentConfig.spawnInterval) {
        this.spawnTimer = 0;

        // If level 5 has boss and hasn't spawned boss yet
        if (this.currentConfig.hasBoss && !this.bossSpawned) {
          this.spawnBoss(player, arena);
          this.bossSpawned = true;
          this.spawnedCount++;
          return;
        }

        this.spawnRandomEnemy(player, arena);
        this.spawnedCount++;
      }
    }
  }

  spawnRandomEnemy(player, arena) {
    // Weighted random selection
    const types = this.currentConfig.types;
    const totalWeight = types.reduce((acc, t) => acc + t.weight, 0);
    let rand = Math.random() * totalWeight;
    let selected = types[0];

    for (let t of types) {
      if (rand < t.weight) {
        selected = t;
        break;
      }
      rand -= t.weight;
    }

    // Spawn location outside player's immediate view (at least 550px away)
    const pos = this.getRandomSpawnPosition(player, arena, 550);
    this.game.enemies.push(new Enemy(pos.x, pos.y, selected));
  }

  spawnBoss(player, arena) {
    const pos = this.getRandomSpawnPosition(player, arena, 650);
    const boss = new Enemy(pos.x, pos.y, this.currentConfig.bossConfig);
    this.game.enemies.push(boss);
    this.game.boss = boss;
    this.game.showBanner("⚠️ PERINGATAN: CYBER TITAN MUNCUL! ⚠️");
  }

  getRandomSpawnPosition(player, arena, minDistance) {
    let x, y, dist;
    let attempts = 0;
    do {
      x = 50 + Math.random() * (arena.width - 100);
      y = 50 + Math.random() * (arena.height - 100);
      dist = Math.hypot(x - player.x, y - player.y);
      attempts++;
    } while (dist < minDistance && attempts < 30);

    return { x, y };
  }
}
