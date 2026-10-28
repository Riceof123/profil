/**
 * CYBER STRIKE 2D - Weapon Definitions & Arsenal
 */

const WEAPONS = [
  {
    id: 'pistol',
    name: 'Pistol Laser',
    shortName: 'Pistol',
    icon: '🔫',
    key: '1',
    unlockLevel: 1,
    damage: 28,
    fireRate: 260, // ms cooldown
    speed: 16,
    bulletRadius: 4,
    color: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.8)',
    count: 1,
    spread: 0.04,
    pierce: 0,
    explosive: false,
    sound: 'pistol',
    desc: 'Akurasi tinggi dan seimbang untuk pertempuran jarak menengah.'
  },
  {
    id: 'shotgun',
    name: 'Shotgun Sebar',
    shortName: 'Shotgun',
    icon: '💥',
    key: '2',
    unlockLevel: 1,
    damage: 18, // 18 * 5 = 90 total burst damage
    fireRate: 650,
    speed: 13,
    bulletRadius: 3.5,
    color: '#ff9900',
    glow: 'rgba(255, 153, 0, 0.8)',
    count: 5,
    spread: 0.35,
    pierce: 0,
    explosive: false,
    sound: 'shotgun',
    desc: 'Menembakkan 5 peluru sekaligus. Sangat mematikan di jarak dekat!'
  },
  {
    id: 'smg',
    name: 'Senapan Mesin (SMG)',
    shortName: 'SMG',
    icon: '⚡',
    key: '3',
    unlockLevel: 2,
    damage: 15,
    fireRate: 95, // Rapid fire rate!
    speed: 18,
    bulletRadius: 3,
    color: '#ffee00',
    glow: 'rgba(255, 238, 0, 0.8)',
    count: 1,
    spread: 0.12,
    pierce: 0,
    explosive: false,
    sound: 'smg',
    desc: 'Tingkat tembakan ultra cepat untuk menyapu kawanan musuh yang padat.'
  },
  {
    id: 'plasma',
    name: 'Peluncur Plasma',
    shortName: 'Plasma',
    icon: '💣',
    key: '4',
    unlockLevel: 3,
    damage: 80,
    fireRate: 850,
    speed: 9,
    bulletRadius: 7,
    color: '#ff0077',
    glow: 'rgba(255, 0, 119, 0.85)',
    count: 1,
    spread: 0,
    pierce: 0,
    explosive: true,
    explosionRadius: 95,
    sound: 'plasma',
    desc: 'Menembakkan bola plasma yang meledak dan merusak semua musuh di sekitarnya!'
  },
  {
    id: 'vortex',
    name: 'Pusaran Angin Kuat',
    shortName: 'Pusaran Angin',
    icon: '🌪️',
    key: '5',
    unlockLevel: 4, // Unlocked upon completing Level 3!
    damage: 35,
    fireRate: 750,
    speed: 8,
    bulletRadius: 18,
    color: '#00ffff',
    glow: 'rgba(0, 255, 255, 0.95)',
    count: 1,
    spread: 0,
    pierce: 99, // Pierces all enemies while pulling them
    isVortex: true,
    vortexRadius: 130, // Pull radius
    duration: 3500, // 3.5s cyclone lifetime
    sound: 'vortex',
    desc: 'Menembakkan pusaran siklon dahsyat yang menyedot dan menyayat seluruh musuh di jalurnya!'
  },
  {
    id: 'laser',
    name: 'Railgun Laser',
    shortName: 'Railgun',
    icon: '🔮',
    key: '6',
    unlockLevel: 5,
    damage: 100,
    fireRate: 500,
    speed: 24,
    bulletRadius: 4.5,
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.9)',
    count: 1,
    spread: 0,
    pierce: 5, // Pierces up to 5 enemies!
    explosive: false,
    sound: 'laser',
    desc: 'Tembakan laser berkecepatan tinggi yang dapat menembus barisan musuh sekaligus!'
  }
];
