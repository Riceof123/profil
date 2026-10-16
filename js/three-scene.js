/**
 * THE COMPANY ARCHIVES // 3D INTERACTIVE COSMIC ENGINE (THREE.JS)
 * Features:
 * [Journal 01 Modes]:
 * - Galaxy & Cosmic Timeline Orbit
 * - Holo-Planet Xpax-12 with Atmosphere & Cataclysmic Disintegration Event
 * - The Trinity Citadel (Foundation, Azis, Imperium -> The Company)
 * - 5 Celestial Orbs (Lima Ibu Prinsip Langit)
 * [New Added Modes for Journal 02, 03, 04]:
 * - Three Great Labs (Libra, Helium, Azix -> Lone Trail Heptaseas)
 * - Solo Vs Squad Arena (Crossed Iron Sword & Nihilux Blade + Wedding Rings + 5 Potential God Glyphs)
 * - Five Standing Institutions Shield (TCDF, Classic Mamber, TPCDF, Startech, LDET)
 */

class CosmicScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    this.mode = 'galaxy'; // 'galaxy', 'planet', 'trinity', 'mothers', 'labs', 'solo', 'institutions'
    this.animating = true;

    // Groups for different visual states
    this.galaxyGroup = new THREE.Group();
    this.planetGroup = new THREE.Group();
    this.trinityGroup = new THREE.Group();
    this.mothersGroup = new THREE.Group();

    // New groups for added journals
    this.labsGroup = new THREE.Group();
    this.soloGroup = new THREE.Group();
    this.institutionsGroup = new THREE.Group();

    // Planet destruction state
    this.planetMesh = null;
    this.planetAtmosphere = null;
    this.planetRings = null;
    this.debrisParticles = null;
    this.isPlanetDestroyed = false;
    this.isExploding = false;
    this.explosionProgress = 0;

    // Celestial Mothers objects
    this.mothersList = [];

    // Camera targets
    this.targetCameraPos = new THREE.Vector3(0, 40, 100);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060b19, 0.003);

    // 2. Camera setup
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
    this.camera.position.set(0, 45, 110);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 350;
      this.controls.minDistance = 15;
    }

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    this.scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00f0ff, 2.5, 400);
    mainLight.position.set(50, 80, 50);
    this.scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xff3366, 2, 400);
    fillLight.position.set(-60, -40, -50);
    this.scene.add(fillLight);

    const amberLight = new THREE.PointLight(0xffb84d, 2.2, 300);
    amberLight.position.set(0, 60, -80);
    this.scene.add(amberLight);

    // Add Groups to Scene
    this.scene.add(this.galaxyGroup);
    this.scene.add(this.planetGroup);
    this.scene.add(this.trinityGroup);
    this.scene.add(this.mothersGroup);
    this.scene.add(this.labsGroup);
    this.scene.add(this.soloGroup);
    this.scene.add(this.institutionsGroup);

    // 6. Build Environments
    this.buildGalaxyBackground();
    this.buildTimelineWaypoints();
    this.buildPlanetXpax();
    this.buildTrinityCitadel();
    this.buildCelestialMothers();

    // Build New Environments
    this.buildThreeLabs();
    this.buildSoloVsSquadArena();
    this.buildInstitutionsShield();

    // Set initial active mode
    this.setMode('galaxy');

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onResize());

    // 8. Start Loop
    this.animate();
  }

  // ===================== GALAXY / BACKGROUND BUILDER =====================
  buildGalaxyBackground() {
    const particleCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x00f0ff), // Cyan Foundation
      new THREE.Color(0x3b82f6), // Blue Hilim
      new THREE.Color(0xff3366), // Crimson Imperium
      new THREE.Color(0x10b981), // Emerald Azis
      new THREE.Color(0xffb84d), // Golden Company
      new THREE.Color(0xffffff)  // Pure starlight
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 2.2) * 280;
      const branches = 4;
      const branchAngle = ((i % branches) * ((2 * Math.PI) / branches));
      const spinAngle = r * 0.05;
      const angle = branchAngle + spinAngle + (Math.random() - 0.5) * 0.5;

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * (40 + (280 - r) * 0.2);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.starsPoints = new THREE.Points(geometry, material);
    this.galaxyGroup.add(this.starsPoints);

    const coreGeo = new THREE.SphereGeometry(6, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.galaxyGroup.add(this.coreMesh);
  }

  buildTimelineWaypoints() {
    this.waypointGroup = new THREE.Group();
    const eras = [
      { name: "Lost Era", r: 35, angle: 0, color: 0xf59e0b, id: "part-01" },
      { name: "Era Purba", r: 55, angle: 1.1, color: 0x10b981, id: "part-01" },
      { name: "Era Perluasan", r: 75, angle: 2.2, color: 0x38bdf8, id: "part-01" },
      { name: "Pecah Hilim", r: 95, angle: 3.3, color: 0xec4899, id: "part-02" },
      { name: "Xpax-12 Crisis", r: 120, angle: 4.4, color: 0xef4444, id: "part-02" },
      { name: "The Company", r: 145, angle: 5.5, color: 0x00f0ff, id: "part-03" }
    ];

    eras.forEach((era) => {
      const x = Math.cos(era.angle) * era.r;
      const z = Math.sin(era.angle) * era.r;
      const y = Math.sin(era.angle * 2) * 12;

      const ringGeo = new THREE.RingGeometry(2.8, 3.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: era.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);

      const sphereGeo = new THREE.SphereGeometry(1.4, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: era.color,
        emissive: era.color,
        emissiveIntensity: 0.6,
        roughness: 0.3
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(x, y, z);

      this.waypointGroup.add(ring);
      this.waypointGroup.add(sphere);
    });

    const curvePoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      const r = 35 + (theta / (Math.PI * 2)) * 110;
      curvePoints.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta * 2) * 8, Math.sin(theta) * r));
    }
    const pathGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const pathMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35
    });
    this.timelinePath = new THREE.Line(pathGeo, pathMat);
    this.waypointGroup.add(this.timelinePath);

    this.galaxyGroup.add(this.waypointGroup);
  }

  // ===================== PLANET XPAX-12 BUILDER =====================
  buildPlanetXpax() {
    const planetGeo = new THREE.SphereGeometry(18, 64, 64);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#04172e');
    grad.addColorStop(0.5, '#0a2e5c');
    grad.addColorStop(1, '#020b18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = '#1c4966';
    for (let i = 0; i < 35; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 512;
      const cr = 40 + Math.random() * 90;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffb84d';
    for (let i = 0; i < 150; i++) {
      const px = Math.random() * 1024;
      const py = 100 + Math.random() * 312;
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let y = 60; y < 512; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    const planetTexture = new THREE.CanvasTexture(canvas);

    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.6,
      metalness: 0.2,
      bumpScale: 0.05
    });

    this.planetMesh = new THREE.Mesh(planetGeo, planetMat);
    this.planetGroup.add(this.planetMesh);

    const atmosGeo = new THREE.SphereGeometry(19.5, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x00c8ff,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    this.planetAtmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    this.planetGroup.add(this.planetAtmosphere);

    const ringGeo = new THREE.RingGeometry(24, 27, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    this.planetRings = new THREE.Mesh(ringGeo, ringMat);
    this.planetRings.rotation.x = Math.PI * 0.4;
    this.planetGroup.add(this.planetRings);

    this.invadersSatellites = new THREE.Group();
    const satColors = [0x00f0ff, 0x10b981, 0xef4444];
    for (let i = 0; i < 3; i++) {
      const satGeo = new THREE.OctahedronGeometry(1.2, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: satColors[i],
        emissive: satColors[i],
        emissiveIntensity: 0.8
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(
        Math.cos((i / 3) * Math.PI * 2) * 32,
        Math.sin(i) * 5,
        Math.sin((i / 3) * Math.PI * 2) * 32
      );
      this.invadersSatellites.add(sat);
    }
    this.planetGroup.add(this.invadersSatellites);

    const debrisCount = 1500;
    const debrisGeo = new THREE.BufferGeometry();
    const debrisPos = new Float32Array(debrisCount * 3);
    const debrisVel = new Float32Array(debrisCount * 3);
    const debrisCol = new Float32Array(debrisCount * 3);

    for (let i = 0; i < debrisCount; i++) {
      debrisPos[i * 3] = 0;
      debrisPos[i * 3 + 1] = 0;
      debrisPos[i * 3 + 2] = 0;

      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = 12 + Math.random() * 35;
      const sinPhi = Math.sin(phi);

      debrisVel[i * 3] = speed * sinPhi * Math.cos(theta);
      debrisVel[i * 3 + 1] = speed * sinPhi * Math.sin(theta);
      debrisVel[i * 3 + 2] = speed * Math.cos(phi);

      debrisCol[i * 3] = 1.0;
      debrisCol[i * 3 + 1] = Math.random() * 0.6;
      debrisCol[i * 3 + 2] = 0.1;
    }

    debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
    debrisGeo.setAttribute('color', new THREE.BufferAttribute(debrisCol, 3));
    this.debrisVelocities = debrisVel;

    const debrisMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.debrisParticles = new THREE.Points(debrisGeo, debrisMat);
    this.planetGroup.add(this.debrisParticles);
  }

  // ===================== TRINITY CITADEL BUILDER =====================
  buildTrinityCitadel() {
    const factionData = [
      { name: "Foundation", color: 0x06b6d4, angle: 0 },
      { name: "Azis", color: 0x10b981, angle: (Math.PI * 2) / 3 },
      { name: "Imperium", color: 0xef4444, angle: (Math.PI * 4) / 3 }
    ];

    this.trinityPillars = [];
    const pillarRadius = 28;

    factionData.forEach((f) => {
      const x = Math.cos(f.angle) * pillarRadius;
      const z = Math.sin(f.angle) * pillarRadius;

      const geo = new THREE.ConeGeometry(4, 24, 4);
      const mat = new THREE.MeshStandardMaterial({
        color: f.color,
        emissive: f.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
      });
      const pillar = new THREE.Mesh(geo, mat);
      pillar.position.set(x, 0, z);
      this.trinityGroup.add(pillar);
      this.trinityPillars.push(pillar);

      const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, pillarRadius, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: f.color,
        transparent: true,
        opacity: 0.6
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(x / 2, 8, z / 2);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-x, 8, -z).normalize());
      this.trinityGroup.add(beam);
    });

    const apexGeo = new THREE.IcosahedronGeometry(7, 0);
    const apexMat = new THREE.MeshStandardMaterial({
      color: 0xffb84d,
      emissive: 0xffb84d,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9
    });
    this.companyCore = new THREE.Mesh(apexGeo, apexMat);
    this.companyCore.position.set(0, 12, 0);
    this.trinityGroup.add(this.companyCore);

    const hexGeo = new THREE.RingGeometry(10, 11, 6);
    const hexMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    this.hexRing1 = new THREE.Mesh(hexGeo, hexMat);
    this.hexRing1.position.set(0, 12, 0);
    this.trinityGroup.add(this.hexRing1);

    const hexRing2 = new THREE.Mesh(hexGeo, hexMat.clone());
    hexRing2.material.color.setHex(0xffb84d);
    hexRing2.rotation.x = Math.PI * 0.5;
    hexRing2.position.set(0, 12, 0);
    this.hexRing2 = hexRing2;
    this.trinityGroup.add(this.hexRing2);
  }

  // ===================== CELSIAL MOTHERS BUILDER =====================
  buildCelestialMothers() {
    const mothers = [
      { name: "Nova", title: "Dewi Kematian", color: 0x9333ea, r: 20, speed: 0.8 },
      { name: "Nabiru", title: "Dewi Kehidupan", color: 0x22c55e, r: 28, speed: 0.6 },
      { name: "Anastasia", title: "Dewi Emas", color: 0xeab308, r: 36, speed: 0.5 },
      { name: "Ines", title: "Dewi Ruang", color: 0x06b6d4, r: 44, speed: 0.4 },
      { name: "Xin", title: "Dewi Waktu", color: 0xec4899, r: 52, speed: 0.3 }
    ];

    const skyGeo = new THREE.SphereGeometry(6, 32, 32);
    const skyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.0,
      roughness: 0.1
    });
    this.skyCore = new THREE.Mesh(skyGeo, skyMat);
    this.mothersGroup.add(this.skyCore);

    this.mothersList = [];
    mothers.forEach((m, idx) => {
      const geo = new THREE.SphereGeometry(2.4, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: m.color,
        emissive: m.color,
        emissiveIntensity: 0.7,
        roughness: 0.3
      });
      const orb = new THREE.Mesh(geo, mat);
      this.mothersGroup.add(orb);

      const trailPoints = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        trailPoints.push(new THREE.Vector3(Math.cos(a) * m.r, Math.sin(a * 2 + idx) * 3, Math.sin(a) * m.r));
      }
      const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
      const trailMat = new THREE.LineBasicMaterial({
        color: m.color,
        transparent: true,
        opacity: 0.4
      });
      const trail = new THREE.Line(trailGeo, trailMat);
      this.mothersGroup.add(trail);

      this.mothersList.push({
        mesh: orb,
        data: m,
        angle: (idx / 5) * Math.PI * 2
      });
    });
  }

  // ===================== [NEW] THREE GREAT LABS BUILDER =====================
  buildThreeLabs() {
    const labs = [
      { name: "Libra Lab", leader: "Charlie Vinsen", color: 0x00f0ff, angle: 0 },
      { name: "Helium Lab", leader: "Kristen White & Arkan", color: 0xf59e0b, angle: (Math.PI * 2) / 3 },
      { name: "Azix Lab", leader: "Kevin Viano", color: 0xa855f7, angle: (Math.PI * 4) / 3 }
    ];

    this.labNodes = [];
    labs.forEach((lab) => {
      const r = 26;
      const x = Math.cos(lab.angle) * r;
      const z = Math.sin(lab.angle) * r;

      // Lab Hub geometry
      const hubGeo = new THREE.DodecahedronGeometry(4, 0);
      const hubMat = new THREE.MeshStandardMaterial({
        color: lab.color,
        emissive: lab.color,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        wireframe: false
      });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.set(x, 0, z);
      this.labsGroup.add(hub);
      this.labNodes.push(hub);

      // Orbital research rings
      const ringGeo = new THREE.TorusGeometry(6, 0.2, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: lab.color, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, 0, z);
      ring.rotation.x = Math.PI * 0.4;
      this.labsGroup.add(ring);
    });

    // Central Heptaseas Research Core (Lone Trail Heptaseas)
    const coreGeo = new THREE.OctahedronGeometry(6, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      wireframe: true
    });
    this.heptaseasCore = new THREE.Mesh(coreGeo, coreMat);
    this.heptaseasCore.position.set(0, 0, 0);
    this.labsGroup.add(this.heptaseasCore);
  }

  // ===================== [NEW] SOLO VS SQUAD ARENA BUILDER =====================
  buildSoloVsSquadArena() {
    // Crossed Swords: Iron Sword (Charlie) + Nihilux Blade (Kristen)
    this.swordGroup = new THREE.Group();

    // Sword 1: Iron Sword (Charlie)
    const bladeGeo = new THREE.BoxGeometry(0.8, 26, 0.2);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
    const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
    blade1.rotation.z = Math.PI * 0.25;
    this.swordGroup.add(blade1);

    // Sword 2: Nihilux Blade (Kristen)
    const bladeMat2 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, metalness: 0.8 });
    const blade2 = new THREE.Mesh(bladeGeo, bladeMat2);
    blade2.rotation.z = -Math.PI * 0.25;
    this.swordGroup.add(blade2);

    // Two Intertwined Wedding Rings
    const ringGeo = new THREE.TorusGeometry(3.5, 0.4, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffb84d, metalness: 0.9, roughness: 0.2 });
    
    const ringA = new THREE.Mesh(ringGeo, ringMat);
    ringA.position.set(-1.5, -4, 2);
    ringA.rotation.y = Math.PI * 0.3;
    this.swordGroup.add(ringA);

    const ringB = new THREE.Mesh(ringGeo, ringMat);
    ringB.position.set(1.5, -4, 2);
    ringB.rotation.y = -Math.PI * 0.3;
    this.swordGroup.add(ringB);

    // Orbiting 5 Potential God Glyphs
    const pGods = [
      { name: "Barracuda", color: 0xf59e0b, r: 24, speed: 0.7 },
      { name: "Chixian", color: 0x06b6d4, r: 28, speed: 0.6 },
      { name: "Vesnas", color: 0xec4899, r: 32, speed: 0.5 },
      { name: "The Mutant", color: 0x84cc16, r: 36, speed: 0.4 },
      { name: "Nihilux", color: 0x38bdf8, r: 40, speed: 0.3 }
    ];

    this.pGodOrbs = [];
    pGods.forEach((pg, i) => {
      const orbGeo = new THREE.TetrahedronGeometry(1.6, 0);
      const orbMat = new THREE.MeshStandardMaterial({ color: pg.color, emissive: pg.color, emissiveIntensity: 0.8 });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      this.soloGroup.add(orb);
      this.pGodOrbs.push({ mesh: orb, data: pg, angle: (i / 5) * Math.PI * 2 });
    });

    this.soloGroup.add(this.swordGroup);
  }

  // ===================== [NEW] INSTITUTIONS SHIELD BUILDER =====================
  buildInstitutionsShield() {
    // 5 Standing Institutions Pentagram Shield (TCDF, Classic, TPCDF, Startech, LDET)
    const insts = [
      { name: "TCDF", color: 0x00f0ff },
      { name: "Classic Mamber", color: 0x3b82f6 },
      { name: "TPCDF", color: 0x10b981 },
      { name: "Startech", color: 0xf59e0b },
      { name: "LDET", color: 0xec4899 }
    ];

    this.instPillars = [];
    const r = 28;
    insts.forEach((inst, i) => {
      const theta = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const geo = new THREE.CylinderGeometry(2, 2.5, 16, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: inst.color,
        emissive: inst.color,
        emissiveIntensity: 0.5,
        roughness: 0.3
      });
      const pillar = new THREE.Mesh(geo, mat);
      pillar.position.set(x, 0, z);
      this.institutionsGroup.add(pillar);
      this.instPillars.push(pillar);
    });

    // Pentagram shield perimeter lines
    const linePoints = [];
    for (let i = 0; i <= 5; i++) {
      const theta = ((i % 5) / 5) * Math.PI * 2 - Math.PI / 2;
      linePoints.push(new THREE.Vector3(Math.cos(theta) * r, 8, Math.sin(theta) * r));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
    this.institutionsGroup.add(new THREE.Line(lineGeo, lineMat));
  }

  // ===================== MODE SWITCHER & CAMERA LERP =====================
  setMode(mode) {
    this.mode = mode;

    if (window.soundEngine) {
      window.soundEngine.playWarp();
    }

    // Set visibility
    this.galaxyGroup.visible = (mode === 'galaxy');
    this.planetGroup.visible = (mode === 'planet');
    this.trinityGroup.visible = (mode === 'trinity');
    this.mothersGroup.visible = (mode === 'mothers');
    this.labsGroup.visible = (mode === 'labs');
    this.soloGroup.visible = (mode === 'solo');
    this.institutionsGroup.visible = (mode === 'institutions');

    if (mode === 'galaxy') {
      this.targetCameraPos.set(0, 50, 120);
      this.targetLookAt.set(0, 0, 0);
    } else if (mode === 'planet') {
      this.targetCameraPos.set(0, 15, 65);
      this.targetLookAt.set(0, 0, 0);
    } else if (mode === 'trinity') {
      this.targetCameraPos.set(45, 35, 65);
      this.targetLookAt.set(0, 8, 0);
    } else if (mode === 'mothers') {
      this.targetCameraPos.set(0, 45, 80);
      this.targetLookAt.set(0, 0, 0);
    } else if (mode === 'labs') {
      this.targetCameraPos.set(0, 40, 70);
      this.targetLookAt.set(0, 0, 0);
    } else if (mode === 'solo') {
      this.targetCameraPos.set(0, 20, 60);
      this.targetLookAt.set(0, 0, 0);
    } else if (mode === 'institutions') {
      this.targetCameraPos.set(0, 55, 75);
      this.targetLookAt.set(0, 0, 0);
    }

    const hudBadge = document.getElementById('scene-active-mode');
    if (hudBadge) {
      const modeNames = {
        galaxy: "GALAXY COSMIC TIMELINE",
        planet: "HOLO-PLANET XPAX-12",
        trinity: "THE TRINITY CITADEL",
        mothers: "5 LIMA IBU PRINSIP LANGIT",
        labs: "TIGA LAB: LIBRA, HELIUM, AZIX",
        solo: "SOLO VS SQUAD: DUA BILAH & DUA CINCIN",
        institutions: "5 INSTITUSI UTAMA (TCDF SHIELD)"
      };
      hudBadge.textContent = modeNames[mode] || mode.toUpperCase();
    }
  }

  // ===================== PLANETARY CATACLYSM EVENT =====================
  triggerPlanetaryCataclysm() {
    if (this.isPlanetDestroyed || this.isExploding) return;

    this.isExploding = true;
    this.explosionProgress = 0;

    if (window.soundEngine) {
      window.soundEngine.playExplosion();
    }

    this.planetMesh.visible = false;
    this.planetAtmosphere.visible = false;
    this.planetRings.visible = false;
    this.debrisParticles.material.opacity = 1.0;

    const positions = this.debrisParticles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    this.debrisParticles.geometry.attributes.position.needsUpdate = true;

    this.targetCameraPos.add(new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 0));

    setTimeout(() => {
      this.isExploding = false;
      this.isPlanetDestroyed = true;
    }, 2500);
  }

  resetPlanet() {
    this.isPlanetDestroyed = false;
    this.isExploding = false;
    this.explosionProgress = 0;

    this.planetMesh.visible = true;
    this.planetAtmosphere.visible = true;
    this.planetRings.visible = true;
    this.debrisParticles.material.opacity = 0;

    if (window.soundEngine) {
      window.soundEngine.playBeep(440, 0.15, 'triangle');
    }
  }

  // ===================== ANIMATION LOOP =====================
  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    this.camera.position.lerp(this.targetCameraPos, 0.04);
    this.currentLookAt.lerp(this.targetLookAt, 0.04);
    this.camera.lookAt(this.currentLookAt);

    if (this.controls) {
      this.controls.update();
    }

    if (this.mode === 'galaxy') {
      if (this.starsPoints) this.starsPoints.rotation.y = time * 0.02;
      if (this.coreMesh) {
        this.coreMesh.rotation.y = time * 0.1;
        this.coreMesh.rotation.x = time * 0.08;
      }
      if (this.waypointGroup) this.waypointGroup.rotation.y = time * 0.015;
    }

    if (this.mode === 'planet') {
      if (!this.isPlanetDestroyed && !this.isExploding) {
        if (this.planetMesh) this.planetMesh.rotation.y = time * 0.08;
        if (this.planetAtmosphere) this.planetAtmosphere.rotation.y = -time * 0.05;
        if (this.planetRings) this.planetRings.rotation.z = time * 0.03;
        if (this.invadersSatellites) this.invadersSatellites.rotation.y = time * 0.15;
      }

      if (this.isExploding || this.isPlanetDestroyed) {
        const positions = this.debrisParticles.geometry.attributes.position.array;
        const vels = this.debrisVelocities;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += vels[i] * delta;
          positions[i + 1] += vels[i + 1] * delta;
          positions[i + 2] += vels[i + 2] * delta;
        }
        this.debrisParticles.geometry.attributes.position.needsUpdate = true;
        this.debrisParticles.rotation.y = time * 0.05;

        if (this.isPlanetDestroyed) {
          this.debrisParticles.material.opacity = Math.max(0.2, 1.0 - (time % 5) * 0.1);
        }
      }
    }

    if (this.mode === 'trinity') {
      if (this.companyCore) {
        this.companyCore.rotation.y = time * 0.3;
        this.companyCore.rotation.x = Math.sin(time) * 0.2;
      }
      if (this.hexRing1) this.hexRing1.rotation.z = time * 0.2;
      if (this.hexRing2) this.hexRing2.rotation.z = -time * 0.25;

      this.trinityPillars.forEach((p, idx) => {
        p.rotation.y = time * 0.4 + idx;
      });
      this.trinityGroup.rotation.y = time * 0.05;
    }

    if (this.mode === 'mothers') {
      if (this.skyCore) {
        this.skyCore.rotation.y = time * 0.2;
        const scale = 1.0 + Math.sin(time * 3) * 0.08;
        this.skyCore.scale.set(scale, scale, scale);
      }

      this.mothersList.forEach((m) => {
        m.angle += m.data.speed * delta * 0.7;
        const x = Math.cos(m.angle) * m.data.r;
        const z = Math.sin(m.angle) * m.data.r;
        const y = Math.sin(m.angle * 2) * 5;
        m.mesh.position.set(x, y, z);
        m.mesh.rotation.y = time * 1.5;
      });
    }

    if (this.mode === 'labs') {
      if (this.heptaseasCore) {
        this.heptaseasCore.rotation.y = time * 0.5;
        this.heptaseasCore.rotation.x = time * 0.3;
      }
      this.labNodes.forEach((node, i) => {
        node.rotation.y = time * 0.4 + i;
      });
      this.labsGroup.rotation.y = time * 0.04;
    }

    if (this.mode === 'solo') {
      if (this.swordGroup) {
        this.swordGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
      }
      this.pGodOrbs.forEach(pg => {
        pg.angle += pg.data.speed * delta * 0.6;
        pg.mesh.position.set(Math.cos(pg.angle) * pg.data.r, Math.sin(pg.angle * 2) * 4, Math.sin(pg.angle) * pg.data.r);
        pg.mesh.rotation.y = time * 2;
      });
    }

    if (this.mode === 'institutions') {
      this.institutionsGroup.rotation.y = time * 0.06;
      this.instPillars.forEach((p, i) => {
        p.rotation.y = -time * 0.2 + i;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

window.CosmicScene = CosmicScene;
