import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';
import { NavGraph } from './NavGraph.js';

/**
 * Builds the entire abandoned 3D horror house:
 * - High performance: Shared geometries, shared materials, optimized lighting
 * - Separated Wall Colliders (horizontal blocking) and Floor Surfaces (smooth grounding & ramps)
 * - Furniture tops registered as walkable surfaces for realistic jumping
 * - Seamless stair climbing with continuous incline ramps
 * - NavGraph waypoints with floor elevation awareness
 */
export class HouseBuilder {
  constructor(scene) {
    this.scene = scene;
    this.wallColliders = [];   // THREE.Box3 for horizontal wall collisions
    this.floorSurfaces = [];   // { minX, maxX, minZ, maxZ, y, isRamp, minZ, maxZ, minY, maxY }
    this.ceilingHeights = [-0.4, 3.75, 7.75]; // For player jump ceiling clamping
    this.navGraph = new NavGraph();
    this.flickeringLights = [];
    this.materials = {};
    this.initMaterials();
  }

  initMaterials() {
    const woodFloorTex = TextureGenerator.createWoodFloorTexture();
    woodFloorTex.repeat.set(4, 4);

    const wallpaperTex = TextureGenerator.createWallpaperTexture();
    wallpaperTex.repeat.set(2, 2);

    const basementTex = TextureGenerator.createBasementConcreteTexture();
    basementTex.repeat.set(3, 3);

    const ceilingTex = TextureGenerator.createPlasterCeilingTexture();
    ceilingTex.repeat.set(4, 4);

    const rustTex = TextureGenerator.createRustedMetalTexture();
    const doorTex = TextureGenerator.createDoorWoodTexture();

    this.materials = {
      woodFloor: new THREE.MeshStandardMaterial({
        map: woodFloorTex,
        roughness: 0.85,
        metalness: 0.05
      }),
      wallpaper: new THREE.MeshStandardMaterial({
        map: wallpaperTex,
        roughness: 0.9,
        metalness: 0.05
      }),
      basementWall: new THREE.MeshStandardMaterial({
        map: basementTex,
        roughness: 0.95,
        metalness: 0.05
      }),
      basementFloor: new THREE.MeshStandardMaterial({
        map: basementTex,
        roughness: 0.9,
        metalness: 0.05
      }),
      ceiling: new THREE.MeshStandardMaterial({
        map: ceilingTex,
        roughness: 0.95,
        metalness: 0.0
      }),
      rustedMetal: new THREE.MeshStandardMaterial({
        map: rustTex,
        roughness: 0.7,
        metalness: 0.5
      }),
      woodDoor: new THREE.MeshStandardMaterial({
        map: doorTex,
        roughness: 0.8,
        metalness: 0.1
      }),
      furnitureWood: new THREE.MeshStandardMaterial({
        color: 0x24180e,
        roughness: 0.85,
        metalness: 0.05
      }),
      fabricDirty: new THREE.MeshStandardMaterial({
        color: 0x383228,
        roughness: 0.95,
        metalness: 0.0
      }),
      glassDirty: new THREE.MeshStandardMaterial({
        color: 0x182024,
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0.6
      }),
      brick: new THREE.MeshStandardMaterial({
        color: 0x3d1c15,
        roughness: 0.95
      })
    };
  }

  build() {
    this.buildFloorsAndCeilings();
    this.buildGroundFloor();
    this.buildUpperFloor();
    this.buildBasement();
    this.buildStairs();
    this.buildFurnitureAndProps();
    this.setupLighting();
    this.setupNavigationGraph();
  }

  // --- Helper Methods ---
  addWall(x, y, z, width, height, depth, material = this.materials.wallpaper) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y + height / 2, z);
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    const box = new THREE.Box3();
    box.setFromObject(mesh);
    this.wallColliders.push(box);
    return mesh;
  }

  addFloor(x, y, z, width, depth, material = this.materials.woodFloor) {
    const geo = new THREE.BoxGeometry(width, 0.3, depth);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y - 0.15, z);
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    this.floorSurfaces.push({
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: z - depth / 2,
      maxZ: z + depth / 2,
      y: y,
      isRamp: false
    });
    return mesh;
  }

  addWalkableTop(x, y, z, width, depth) {
    // Allows landing on top of furniture/crates after jumping
    this.floorSurfaces.push({
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: z - depth / 2,
      maxZ: z + depth / 2,
      y: y,
      isRamp: false
    });
  }

  addRampFloor(minX, maxX, startZ, endZ, startY, endY) {
    this.floorSurfaces.push({
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minZ: Math.min(startZ, endZ),
      maxZ: Math.max(startZ, endZ),
      startZ,
      endZ,
      startY,
      endY,
      isRamp: true
    });
  }

  addCeiling(x, y, z, width, depth) {
    const geo = new THREE.BoxGeometry(width, 0.2, depth);
    const mesh = new THREE.Mesh(geo, this.materials.ceiling);
    mesh.position.set(x, y + 0.1, z);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  // --- Floors and Ceilings ---
  buildFloorsAndCeilings() {
    // 1. Ground Floor (Y = 0)
    this.addFloor(0, 0, 3, 34, 32, this.materials.woodFloor);
    this.addCeiling(0, 3.8, 3, 34, 32);

    // 2. Upper Floor (Y = 4)
    this.addFloor(-10, 4, 3, 14, 30, this.materials.woodFloor);
    this.addCeiling(-10, 7.8, 3, 14, 30);

    this.addFloor(10, 4, 3, 14, 30, this.materials.woodFloor);
    this.addCeiling(10, 7.8, 3, 14, 30);

    this.addFloor(0, 4, 12, 6, 12, this.materials.woodFloor);
    this.addCeiling(0, 7.8, 12, 6, 12);

    this.addFloor(0, 4, -6.5, 6, 11, this.materials.woodFloor);
    this.addCeiling(0, 7.8, -6.5, 6, 11);

    // 3. Basement Floor (Y = -4) & Ceiling (Y = -0.4)
    this.addFloor(0, -4, -4, 32, 24, this.materials.basementFloor);
    this.addCeiling(0, -0.4, -4, 32, 24);
  }

  // --- Ground Floor Layout ---
  buildGroundFloor() {
    const H = 3.8;
    this.addWall(0, 0, 19, 34, H, 0.4);
    this.addWall(0, 0, -13, 34, H, 0.4);
    this.addWall(-17, 0, 3, 0.4, H, 32);
    this.addWall(17, 0, 3, 0.4, H, 32);

    this.addWall(-3.5, 0, 16.5, 0.3, H, 5);
    this.addWall(-3.5, 0, 6.5, 0.3, H, 7);
    this.addWall(-3.5, 0, -6.5, 0.3, H, 7);
    this.addWall(-3.5, 0, -11.5, 0.3, H, 3);

    this.addWall(3.5, 0, 16.5, 0.3, H, 5);
    this.addWall(3.5, 0, 6.5, 0.3, H, 7);
    this.addWall(3.5, 0, -6.5, 0.3, H, 7);
    this.addWall(3.5, 0, -11.5, 0.3, H, 3);

    this.addWall(-10.25, 0, 1, 13.5, H, 0.3);
    this.addWall(10.25, 0, 1, 13.5, H, 0.3);
    this.addWall(11, 0, -6, 0.3, H, 7);
  }

  // --- Upper Floor Layout ---
  buildUpperFloor() {
    const H = 3.8;
    const Y = 4.0;

    this.addWall(0, Y, 18, 34, H, 0.4);
    this.addWall(0, Y, -12, 34, H, 0.4);
    this.addWall(-17, Y, 3, 0.4, H, 30);
    this.addWall(17, Y, 3, 0.4, H, 30);

    this.addWall(-3.2, Y, 14.5, 0.3, H, 7);
    this.addWall(-3.2, Y, 2.5, 0.3, H, 7);
    this.addWall(-3.2, Y, -8.5, 0.3, H, 7);

    this.addWall(3.2, Y, 14.5, 0.3, H, 7);
    this.addWall(3.2, Y, 2.5, 0.3, H, 7);
    this.addWall(3.2, Y, -8.5, 0.3, H, 7);

    // Railings around stair opening
    this.addWall(-2.7, Y, 2.8, 0.15, 1.1, 7.0, this.materials.furnitureWood);
    this.addWall(2.7, Y, 2.8, 0.15, 1.1, 7.0, this.materials.furnitureWood);
    this.addWall(0, Y, -0.6, 5.4, 1.1, 0.15, this.materials.furnitureWood);

    this.addWall(-10.1, Y, 4, 13.8, H, 0.3);
    this.addWall(10.1, Y, 4, 13.8, H, 0.3);
  }

  // --- Basement Layout ---
  buildBasement() {
    const H = 3.6;
    const Y = -4.0;

    this.addWall(0, Y, 8, 32, H, 0.5, this.materials.basementWall);
    this.addWall(0, Y, -16, 32, H, 0.5, this.materials.basementWall);
    this.addWall(-16, Y, -4, 0.5, H, 24, this.materials.basementWall);
    this.addWall(16, Y, -4, 0.5, H, 24, this.materials.basementWall);

    this.addWall(-2, Y, 3, 0.4, H, 10, this.materials.basementWall);
    this.addWall(-2, Y, -11, 0.4, H, 10, this.materials.basementWall);
  }

  // --- Stairs with Continuous Smooth Incline Ramps ---
  buildStairs() {
    const stepCount = 14;
    const stepWidth = 3.0;
    const startZ = 0.0;
    const endZ = 6.5;

    for (let i = 0; i < stepCount; i++) {
      const frac = (i + 1) / stepCount;
      const stepY = frac * 4.0;
      const stepZ = startZ + frac * (endZ - startZ);
      const stepDepth = (endZ - startZ) / stepCount * 1.35;

      const stepGeo = new THREE.BoxGeometry(stepWidth, 0.22, stepDepth);
      const stepMesh = new THREE.Mesh(stepGeo, this.materials.furnitureWood);
      stepMesh.position.set(0, stepY - 0.11, stepZ);
      stepMesh.receiveShadow = true;
      this.scene.add(stepMesh);
    }
    this.addRampFloor(-1.5, 1.5, startZ, endZ, 0.0, 4.0);

    const bStepCount = 14;
    const bStartZ = -2.0;
    const bEndZ = -8.5;

    for (let i = 0; i < bStepCount; i++) {
      const frac = (i + 1) / bStepCount;
      const stepY = -frac * 4.0;
      const stepZ = bStartZ + frac * (bEndZ - bStartZ);
      const stepDepth = Math.abs(bEndZ - bStartZ) / bStepCount * 1.35;

      const stepGeo = new THREE.BoxGeometry(2.4, 0.22, stepDepth);
      const stepMesh = new THREE.Mesh(stepGeo, this.materials.basementFloor);
      stepMesh.position.set(0, stepY + 0.11, stepZ);
      stepMesh.receiveShadow = true;
      this.scene.add(stepMesh);
    }
    this.addRampFloor(-1.2, 1.2, bStartZ, bEndZ, 0.0, -4.0);
  }

  // --- Furniture & Props ---
  buildFurnitureAndProps() {
    // 1. Waking Room
    this.createBed(-14, 4, 14, 0);
    this.createNightstand(-11.5, 4, 15.5);
    this.createWardrobe(-8, 4, 15);
    this.createBoardedWindow(-16.8, 4 + 1.5, 11);

    // 2. Master Bedroom
    this.createFourPosterBed(12, 4, 13);
    this.createVanityDesk(7, 4, 14);
    this.createWardrobe(14, 4, 8);

    // 3. Guest Bedroom
    this.createBed(8, 4, -6, 0);
    this.createBed(13, 4, -6, 0);
    this.createWardrobe(14, 4, 0);

    // 4. Abandoned Child's Room
    this.createCradle(-12, 4, -2);
    this.createChest(-8, 4, -6);
    this.createBathtub(-14, 4, -9);

    // 5. Living Room
    this.createFireplace(-16.6, 0, 10);
    this.createSofa(-10, 0, 10);
    this.createCoffeeTable(-10, 0, 7.5);
    this.createBookshelf(-6, 0, 15);

    // 6. Dining Room
    this.createDiningTable(10, 0, 10);
    this.createSideboard(15.5, 0, 10);

    // 7. Kitchen & Pantry
    this.createKitchenCounter(10, 0, -2);
    this.createPantryShelves(14, 0, -8);

    // 8. Storage Room
    this.createCratesStack(-12, 0, -6);
    this.createMetalShelves(-6, 0, -8);

    // 9. Basement
    this.createWorkbench(0, -4, 4);
    this.createIndustrialBoiler(-10, -4, -6);
    this.createWineBarrels(10, -4, -6);

    this.createDoorFrame(0, 0, 18.8, 3.2, 3.0);
  }

  createBed(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(2.4, 0.4, 3.2);
    const frame = new THREE.Mesh(frameGeo, this.materials.furnitureWood);
    frame.position.set(0, 0.2, 0);
    group.add(frame);

    const matGeo = new THREE.BoxGeometry(2.2, 0.35, 3.0);
    const mat = new THREE.Mesh(matGeo, this.materials.fabricDirty);
    mat.position.set(0, 0.55, 0);
    group.add(mat);

    group.position.set(x, y, z);
    group.rotation.y = rotY;
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.72, z, 2.2, 3.0); // Jumpable bed surface
  }

  createFourPosterBed(x, y, z) {
    const group = new THREE.Group();
    this.createBed(0, 0, 0);

    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.0);
    const positions = [
      [-1.1, 1.5, -1.5], [1.1, 1.5, -1.5],
      [-1.1, 1.5, 1.5], [1.1, 1.5, 1.5]
    ];
    positions.forEach(pos => {
      const post = new THREE.Mesh(postGeo, this.materials.furnitureWood);
      post.position.set(pos[0], pos[1], pos[2]);
      group.add(post);
    });

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.72, z, 2.2, 3.0);
  }

  createNightstand(x, y, z) {
    const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 0.45, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.9, z, 0.9, 0.9);
  }

  createWardrobe(x, y, z) {
    const geo = new THREE.BoxGeometry(1.6, 2.8, 0.9);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 1.4, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
  }

  createVanityDesk(x, y, z) {
    const group = new THREE.Group();
    const tableGeo = new THREE.BoxGeometry(2.0, 0.8, 1.0);
    const table = new THREE.Mesh(tableGeo, this.materials.furnitureWood);
    table.position.set(0, 0.4, 0);
    group.add(table);

    const mirrorGeo = new THREE.BoxGeometry(1.4, 1.2, 0.1);
    const mirror = new THREE.Mesh(mirrorGeo, this.materials.glassDirty);
    mirror.position.set(0, 1.4, -0.4);
    group.add(mirror);

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.8, z, 2.0, 1.0);
  }

  createCradle(x, y, z) {
    const geo = new THREE.BoxGeometry(1.2, 0.7, 1.8);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 0.35, z);
    mesh.rotation.z = 0.2;
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
  }

  createChest(x, y, z) {
    const geo = new THREE.BoxGeometry(1.4, 0.8, 1.0);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 0.4, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.8, z, 1.4, 1.0);
  }

  createBathtub(x, y, z) {
    const geo = new THREE.BoxGeometry(1.3, 0.9, 2.6);
    const mesh = new THREE.Mesh(geo, this.materials.fabricDirty);
    mesh.position.set(x, y + 0.45, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
  }

  createFireplace(x, y, z) {
    const group = new THREE.Group();
    const mantleGeo = new THREE.BoxGeometry(0.8, 2.0, 3.2);
    const mantle = new THREE.Mesh(mantleGeo, this.materials.brick);
    mantle.position.set(0, 1.0, 0);
    group.add(mantle);

    const cavityGeo = new THREE.BoxGeometry(0.6, 1.2, 1.8);
    const cavityMat = new THREE.MeshBasicMaterial({ color: 0x050302 });
    const cavity = new THREE.Mesh(cavityGeo, cavityMat);
    cavity.position.set(0.15, 0.6, 0);
    group.add(cavity);

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 2.0, z, 0.8, 3.2);
  }

  createSofa(x, y, z) {
    const group = new THREE.Group();
    const seatGeo = new THREE.BoxGeometry(3.0, 0.5, 1.2);
    const seat = new THREE.Mesh(seatGeo, this.materials.fabricDirty);
    seat.position.set(0, 0.4, 0);
    group.add(seat);

    const backGeo = new THREE.BoxGeometry(3.0, 1.0, 0.4);
    const back = new THREE.Mesh(backGeo, this.materials.fabricDirty);
    back.position.set(0, 0.9, -0.4);
    group.add(back);

    group.position.set(x, y, z);
    group.rotation.y = 0.12;
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.65, z, 3.0, 1.2);
  }

  createCoffeeTable(x, y, z) {
    const geo = new THREE.BoxGeometry(2.0, 0.45, 1.1);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 0.22, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.45, z, 2.0, 1.1);
  }

  createBookshelf(x, y, z) {
    const geo = new THREE.BoxGeometry(2.4, 2.8, 0.8);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 1.4, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
  }

  createDiningTable(x, y, z) {
    const group = new THREE.Group();
    const topGeo = new THREE.BoxGeometry(2.4, 0.15, 5.0);
    const top = new THREE.Mesh(topGeo, this.materials.furnitureWood);
    top.position.set(0, 0.85, 0);
    group.add(top);

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.92, z, 2.4, 5.0);
  }

  createSideboard(x, y, z) {
    const geo = new THREE.BoxGeometry(0.9, 1.1, 3.2);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 0.55, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 1.1, z, 0.9, 3.2);
  }

  createKitchenCounter(x, y, z) {
    const group = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(4.0, 0.9, 1.2);
    const base = new THREE.Mesh(baseGeo, this.materials.furnitureWood);
    base.position.set(0, 0.45, 0);
    group.add(base);

    const sinkGeo = new THREE.BoxGeometry(1.2, 0.4, 0.8);
    const sink = new THREE.Mesh(sinkGeo, this.materials.rustedMetal);
    sink.position.set(0.6, 0.75, 0);
    group.add(sink);

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.9, z, 4.0, 1.2);
  }

  createPantryShelves(x, y, z) {
    const geo = new THREE.BoxGeometry(1.0, 2.4, 3.0);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 1.2, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
  }

  createCratesStack(x, y, z) {
    const group = new THREE.Group();
    const crateGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const offsets = [
      [0, 0.6, 0], [1.3, 0.6, 0], [0, 0.6, 1.3],
      [0.6, 1.8, 0.6]
    ];
    offsets.forEach(off => {
      const crate = new THREE.Mesh(crateGeo, this.materials.furnitureWood);
      crate.position.set(off[0], off[1], off[2]);
      group.add(crate);
    });

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);

    // Walkable landing tops on stacked crates for reaching Key #13
    this.addWalkableTop(x + 0.6, y + 1.2, z + 0.6, 2.6, 2.6);
    this.addWalkableTop(x + 0.6, y + 2.4, z + 0.6, 1.2, 1.2);
  }

  createMetalShelves(x, y, z) {
    const geo = new THREE.BoxGeometry(1.0, 2.6, 3.4);
    const mesh = new THREE.Mesh(geo, this.materials.rustedMetal);
    mesh.position.set(x, y + 1.3, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
  }

  createWorkbench(x, y, z) {
    const geo = new THREE.BoxGeometry(3.0, 0.9, 1.4);
    const mesh = new THREE.Mesh(geo, this.materials.furnitureWood);
    mesh.position.set(x, y + 0.45, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.wallColliders.push(box);
    this.addWalkableTop(x, y + 0.9, z, 3.0, 1.4);
  }

  createIndustrialBoiler(x, y, z) {
    const group = new THREE.Group();
    const cylGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.8, 16);
    const cyl = new THREE.Mesh(cylGeo, this.materials.rustedMetal);
    cyl.position.set(0, 1.4, 0);
    group.add(cyl);

    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 4.0);
    const pipe1 = new THREE.Mesh(pipeGeo, this.materials.rustedMetal);
    pipe1.position.set(0, 3.0, 0);
    group.add(pipe1);

    const emberLight = new THREE.PointLight(0xff4400, 1.2, 6);
    emberLight.position.set(0, 0.6, 1.4);
    group.add(emberLight);

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
  }

  createWineBarrels(x, y, z) {
    const group = new THREE.Group();
    const barrelGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 10);
    const positions = [
      [0, 0.7, 0], [1.5, 0.7, 0], [0.75, 0.7, 1.4],
      [0.75, 1.8, 0.7]
    ];
    positions.forEach(p => {
      const barrel = new THREE.Mesh(barrelGeo, this.materials.furnitureWood);
      barrel.position.set(p[0], p[1], p[2]);
      group.add(barrel);
    });

    group.position.set(x, y, z);
    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    this.wallColliders.push(box);
  }

  createBoardedWindow(x, y, z) {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(0.2, 2.2, 1.8);
    const frame = new THREE.Mesh(frameGeo, this.materials.furnitureWood);
    group.add(frame);

    for (let i = -0.6; i <= 0.6; i += 0.4) {
      const plankGeo = new THREE.BoxGeometry(0.25, 0.25, 2.0);
      const plank = new THREE.Mesh(plankGeo, this.materials.furnitureWood);
      plank.position.set(0.05, i, 0);
      plank.rotation.x = 0.25;
      group.add(plank);
    }

    group.position.set(x, y, z);
    this.scene.add(group);
  }

  createDoorFrame(x, y, z, w, h) {
    const frameGeo = new THREE.BoxGeometry(w, h, 0.6);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x120c08, roughness: 0.9 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(x, y + h / 2, z);
    this.scene.add(frame);
  }

  // --- Optimized Lighting Setup ---
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x0a0e16, 0.45);
    this.scene.add(ambientLight);

    const bulb1 = new THREE.PointLight(0xffe6a3, 1.6, 15, 1.8);
    bulb1.position.set(0, 7.2, 3);
    this.scene.add(bulb1);
    this.flickeringLights.push({ light: bulb1, baseIntensity: 1.6, flickerSpeed: 8 });

    const bulb2 = new THREE.PointLight(0xff9d42, 1.2, 13, 1.8);
    bulb2.position.set(-10, 3.2, 10);
    this.scene.add(bulb2);
    this.flickeringLights.push({ light: bulb2, baseIntensity: 1.2, flickerSpeed: 4 });

    const bulb3 = new THREE.PointLight(0x88e0c8, 1.0, 12, 2.0);
    bulb3.position.set(10, 3.2, -5);
    this.scene.add(bulb3);
    this.flickeringLights.push({ light: bulb3, baseIntensity: 1.0, flickerSpeed: 10 });

    const bulb4 = new THREE.PointLight(0xff2222, 1.4, 14, 1.6);
    bulb4.position.set(6, -1.2, -6);
    this.scene.add(bulb4);
    this.flickeringLights.push({ light: bulb4, baseIntensity: 1.4, flickerSpeed: 3 });

    const exitSpot = new THREE.SpotLight(0x6688aa, 1.6, 16, Math.PI / 4, 0.4);
    exitSpot.position.set(0, 3.5, 14);
    exitSpot.target.position.set(0, 1.5, 19);
    this.scene.add(exitSpot);
    this.scene.add(exitSpot.target);
  }

  // --- Navigation Graph Construction ---
  setupNavigationGraph() {
    const ng = this.navGraph;

    ng.addNode('g_foyer_exit', 0, 0.5, 17);
    ng.addNode('g_hall_south', 0, 0.5, 12);
    ng.addNode('g_hall_mid', 0, 0.5, 4.5);
    ng.addNode('g_hall_north', 0, 0.5, -2);
    ng.addNode('g_hall_deep', 0, 0.5, -9);

    ng.addNode('g_living_door', -3.5, 0.5, 12);
    ng.addNode('g_living_center', -10, 0.5, 10);
    ng.addNode('g_living_corner', -14, 0.5, 14);

    ng.addNode('g_storage_door', -3.5, 0.5, -1);
    ng.addNode('g_storage_center', -10, 0.5, -5);
    ng.addNode('g_storage_deep', -14, 0.5, -9);

    ng.addNode('g_dining_door', 3.5, 0.5, 12);
    ng.addNode('g_dining_center', 10, 0.5, 10);
    ng.addNode('g_dining_east', 14, 0.5, 6);

    ng.addNode('g_kitchen_door', 3.5, 0.5, -1);
    ng.addNode('g_kitchen_center', 10, 0.5, -4);
    ng.addNode('g_kitchen_pantry', 14, 0.5, -9);

    ng.addNode('stairs_up_bottom', 0, 0.5, 0.5);
    ng.addNode('stairs_up_mid', 0, 2.0, 3.5);
    ng.addNode('stairs_up_top', 0, 4.5, 6.8);

    ng.addNode('stairs_down_top', 0, 0.5, -2.0);
    ng.addNode('stairs_down_mid', 0, -2.0, -5.2);
    ng.addNode('stairs_down_bottom', 0, -3.5, -8.5);

    ng.addNode('u_hall_south', 0, 4.5, 13);
    ng.addNode('u_hall_mid', 0, 4.5, 7.5);
    ng.addNode('u_hall_north', 0, 4.5, -4);

    ng.addNode('u_waking_door', -3.2, 4.5, 9.5);
    ng.addNode('u_waking_center', -11, 4.5, 11);

    ng.addNode('u_nursery_door', -3.2, 4.5, -2.5);
    ng.addNode('u_nursery_center', -10, 4.5, -3);

    ng.addNode('u_master_door', 3.2, 4.5, 9.5);
    ng.addNode('u_master_center', 11, 4.5, 11);

    ng.addNode('u_guest_door', 3.2, 4.5, -2.5);
    ng.addNode('u_guest_center', 11, 4.5, -3);

    ng.addNode('b_landing', 0, -3.5, -8.5);
    ng.addNode('b_pass_north', 0, -3.5, -4);
    ng.addNode('b_boiler_door', -2, -3.5, -4);
    ng.addNode('b_boiler_center', -10, -3.5, -6);
    ng.addNode('b_cellar_door', 2, -3.5, -4);
    ng.addNode('b_cellar_center', 10, -3.5, -6);

    ng.connect('g_foyer_exit', 'g_hall_south');
    ng.connect('g_hall_south', 'g_hall_mid');
    ng.connect('g_hall_mid', 'g_hall_north');
    ng.connect('g_hall_north', 'g_hall_deep');

    ng.connect('g_hall_south', 'g_living_door');
    ng.connect('g_living_door', 'g_living_center');
    ng.connect('g_living_center', 'g_living_corner');

    ng.connect('g_hall_north', 'g_storage_door');
    ng.connect('g_storage_door', 'g_storage_center');
    ng.connect('g_storage_center', 'g_storage_deep');

    ng.connect('g_hall_south', 'g_dining_door');
    ng.connect('g_dining_door', 'g_dining_center');
    ng.connect('g_dining_center', 'g_dining_east');

    ng.connect('g_hall_north', 'g_kitchen_door');
    ng.connect('g_kitchen_door', 'g_kitchen_center');
    ng.connect('g_kitchen_center', 'g_kitchen_pantry');

    ng.connect('g_hall_mid', 'stairs_up_bottom');
    ng.connect('stairs_up_bottom', 'stairs_up_mid');
    ng.connect('stairs_up_mid', 'stairs_up_top');
    ng.connect('stairs_up_top', 'u_hall_mid');

    ng.connect('u_hall_south', 'u_hall_mid');
    ng.connect('u_hall_mid', 'u_hall_north');

    ng.connect('u_hall_south', 'u_waking_door');
    ng.connect('u_waking_door', 'u_waking_center');

    ng.connect('u_hall_north', 'u_nursery_door');
    ng.connect('u_nursery_door', 'u_nursery_center');

    ng.connect('u_hall_south', 'u_master_door');
    ng.connect('u_master_door', 'u_master_center');

    ng.connect('u_hall_north', 'u_guest_door');
    ng.connect('u_guest_door', 'u_guest_center');

    ng.connect('g_hall_north', 'stairs_down_top');
    ng.connect('stairs_down_top', 'stairs_down_mid');
    ng.connect('stairs_down_mid', 'stairs_down_bottom');
    ng.connect('stairs_down_bottom', 'b_landing');

    ng.connect('b_landing', 'b_pass_north');
    ng.connect('b_pass_north', 'b_boiler_door');
    ng.connect('b_boiler_door', 'b_boiler_center');
    ng.connect('b_pass_north', 'b_cellar_door');
    ng.connect('b_cellar_door', 'b_cellar_center');
  }

  update(delta) {
    for (const item of this.flickeringLights) {
      if (Math.random() < 0.1) {
        const drop = Math.random() > 0.5 ? 0.35 : 1.35;
        item.light.intensity = item.baseIntensity * drop;
      } else {
        item.light.intensity = THREE.MathUtils.lerp(item.light.intensity, item.baseIntensity, delta * item.flickerSpeed);
      }
    }
  }
}
