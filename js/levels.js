/**
 * CYBER STRIKE 2D - Level Configurations & Progression (5 Levels)
 */

const DIFFICULTIES = {
  easy: {
    id: 'easy',
    name: 'Mudah',
    icon: '🌱',
    badgeClass: 'diff-easy',
    hpMultiplier: 0.75,
    damageMultiplier: 0.65,
    speedMultiplier: 0.85,
    dropRate: 0.35,
    scoreMultiplier: 0.8,
    desc: 'Musuh bergerak santai, tembakan tidak terlalu agresif, dan medkit sering muncul (35%). Cocok untuk pemula.'
  },
  normal: {
    id: 'normal',
    name: 'Normal',
    icon: '⚔️',
    badgeClass: 'diff-normal',
    hpMultiplier: 1.0,
    damageMultiplier: 1.0,
    speedMultiplier: 1.0,
    dropRate: 0.22,
    scoreMultiplier: 1.0,
    desc: 'Tantangan seimbang dengan kecepatan dan daya tahan musuh standar.'
  },
  hard: {
    id: 'hard',
    name: 'Sulit',
    icon: '🔥',
    badgeClass: 'diff-hard',
    hpMultiplier: 1.35,
    damageMultiplier: 1.3,
    speedMultiplier: 1.08,
    dropRate: 0.16,
    scoreMultiplier: 1.5,
    desc: 'Musuh lebih tebal, pukulan lebih sakit, dan tembakan lebih terarah. Butuh taktik dan kelincahan!'
  },
  extreme: {
    id: 'extreme',
    name: 'Extreme',
    icon: '⚡',
    badgeClass: 'diff-extreme',
    hpMultiplier: 1.75,
    damageMultiplier: 1.6,
    speedMultiplier: 1.16,
    dropRate: 0.12,
    scoreMultiplier: 2.2,
    desc: 'Musuh sangat ganas dan cepat. Peluru bertebaran dan medkit semakin langka!'
  },
  hell: {
    id: 'hell',
    name: 'Neraka',
    icon: '💀',
    badgeClass: 'diff-hell',
    hpMultiplier: 2.3,
    damageMultiplier: 2.0,
    speedMultiplier: 1.25,
    dropRate: 0.08,
    scoreMultiplier: 3.5,
    desc: 'Mode mimpi buruk tanpa ampun! Hanya untuk master shooter sejati yang siap bertarung sengit.'
  }
};

const LEVELS_CONFIG = [
  // ================= LEVEL 1 =================
  {
    level: 1,
    name: 'Sektor 1: Masuk Pangkalan',
    title: 'Zona Infiltrasi Terdepan',
    desc: 'Habisi seluruh pasukan penjaga cyborg untuk mengamankan area gerbang.',
    width: 1500,
    height: 1200,
    maxConcurrentEnemies: 6,
    spawnInterval: 1400, // ms between spawns
    unlockWeaponId: null, // Starts with Pistol & Shotgun
    bgColor: '#0a0d18',
    gridColor: 'rgba(0, 240, 255, 0.08)',
    wallColor: '#1a233a',
    wallGlow: '#00f0ff',
    enemyPool: [
      { type: 'walker', count: 14 }
    ],
    obstacles: [
      { x: 500, y: 400, w: 100, h: 100 },
      { x: 900, y: 400, w: 100, h: 100 },
      { x: 500, y: 700, w: 100, h: 100 },
      { x: 900, y: 700, w: 100, h: 100 },
      { x: 700, y: 550, w: 100, h: 100 }
    ]
  },

  // ================= LEVEL 2 =================
  {
    level: 2,
    name: 'Sektor 2: Koridor Laboratorium',
    title: 'Serangan Kawanan Lincah',
    desc: 'Laba-laba mutan berkecepatan tinggi telah dilepaskan! Waspadai gerakan cepat mereka.',
    width: 1700,
    height: 1400,
    maxConcurrentEnemies: 8,
    spawnInterval: 1200,
    unlockWeaponId: 'smg', // Unlocks SMG!
    bgColor: '#081210',
    gridColor: 'rgba(0, 255, 136, 0.08)',
    wallColor: '#12261e',
    wallGlow: '#00ff88',
    enemyPool: [
      { type: 'walker', count: 10 },
      { type: 'swarmer', count: 12 }
    ],
    obstacles: [
      { x: 400, y: 350, w: 120, h: 120 },
      { x: 1180, y: 350, w: 120, h: 120 },
      { x: 400, y: 930, w: 120, h: 120 },
      { x: 1180, y: 930, w: 120, h: 120 },
      { x: 790, y: 300, w: 120, h: 200 },
      { x: 790, y: 900, w: 120, h: 200 }
    ]
  },

  // ================= LEVEL 3 =================
  {
    level: 3,
    name: 'Sektor 3: Gudang Persenjataan',
    title: 'Baku Tembak Jarak Jauh',
    desc: 'Droid penembak musuh mulai menembakkan proyektil laser. Manfaatkan rintangan sebagai pelindung!',
    width: 1900,
    height: 1500,
    maxConcurrentEnemies: 9,
    spawnInterval: 1100,
    unlockWeaponId: 'plasma', // Unlocks Plasma Launcher!
    bgColor: '#100a18',
    gridColor: 'rgba(189, 0, 255, 0.08)',
    wallColor: '#241436',
    wallGlow: '#bd00ff',
    enemyPool: [
      { type: 'walker', count: 10 },
      { type: 'swarmer', count: 10 },
      { type: 'shooter', count: 8 }
    ],
    obstacles: [
      { x: 450, y: 400, w: 200, h: 80 },
      { x: 1250, y: 400, w: 200, h: 80 },
      { x: 450, y: 1020, w: 200, h: 80 },
      { x: 1250, y: 1020, w: 200, h: 80 },
      { x: 850, y: 650, w: 200, h: 200 },
      { x: 500, y: 700, w: 80, h: 120 },
      { x: 1320, y: 700, w: 80, h: 120 }
    ]
  },

  // ================= LEVEL 4 =================
  {
    level: 4,
    name: 'Sektor 4: Benteng Lapis Baja',
    title: 'Pasukan Tanker & Sniper',
    desc: 'Robot Tank lapis baja raksasa dengan HP sangat tebal memimpin serangan baris depan.',
    width: 2100,
    height: 1600,
    maxConcurrentEnemies: 11,
    spawnInterval: 1000,
    unlockWeaponId: 'vortex', // Unlocks Pusaran Angin Kuat after completing Level 3!
    bgColor: '#180a0e',
    gridColor: 'rgba(255, 51, 102, 0.08)',
    wallColor: '#36141c',
    wallGlow: '#ff3366',
    enemyPool: [
      { type: 'tank', count: 6 },
      { type: 'shooter', count: 10 },
      { type: 'swarmer', count: 12 },
      { type: 'walker', count: 8 }
    ],
    obstacles: [
      { x: 400, y: 350, w: 120, h: 300 },
      { x: 1580, y: 350, w: 120, h: 300 },
      { x: 400, y: 950, w: 120, h: 300 },
      { x: 1580, y: 950, w: 120, h: 300 },
      { x: 950, y: 400, w: 200, h: 100 },
      { x: 950, y: 1100, w: 200, h: 100 },
      { x: 900, y: 700, w: 300, h: 200 }
    ]
  },

  // ================= LEVEL 5 (FINAL BOSS) =================
  {
    level: 5,
    name: 'Sektor 5: Inti Komando Utama',
    title: 'Pertarungan Terakhir: Titan Overlord',
    desc: 'Hancurkan Sang Penguasa Cyborg raksasa! Hindari serangan spiral dan hancurkan pasukannya!',
    width: 2200,
    height: 2200,
    maxConcurrentEnemies: 10,
    spawnInterval: 2500, // Minions spawn periodically during boss fight
    unlockWeaponId: 'laser', // Unlocks Railgun Laser!
    bgColor: '#0c0714',
    gridColor: 'rgba(255, 238, 0, 0.09)',
    wallColor: '#2b1c3b',
    wallGlow: '#ffee00',
    isBossLevel: true,
    enemyPool: [
      { type: 'boss', count: 1 } // Titan Overlord
    ],
    bossMinionPool: ['swarmer', 'shooter'],
    obstacles: [
      // 4 large pillar fortresses for cover during boss bullet hell
      { x: 550, y: 550, w: 160, h: 160 },
      { x: 1490, y: 550, w: 160, h: 160 },
      { x: 550, y: 1490, w: 160, h: 160 },
      { x: 1490, y: 1490, w: 160, h: 160 }
    ]
  }
];
