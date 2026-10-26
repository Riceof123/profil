import * as THREE from 'three';
import { Renderer } from './core/Renderer.js';
import { audioManager } from './core/AudioManager.js';
import { HouseBuilder } from './world/HouseBuilder.js';
import { Player } from './entities/Player.js';
import { YellowEntity } from './entities/YellowEntity.js';
import { KeyManager } from './gameplay/KeyManager.js';
import { ExitDoor } from './gameplay/ExitDoor.js';
import { UIManager } from './ui/UIManager.js';

export const GameState = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
};

class Game {
  constructor() {
    this.state = GameState.MENU;
    this.container = document.getElementById('canvas-container');

    // Core Systems
    this.graphics = new Renderer(this.container);
    this.uiManager = new UIManager();

    // World & Level
    this.houseBuilder = new HouseBuilder(this.graphics.scene);
    this.houseBuilder.build();

    // Gameplay Systems
    this.keyManager = new KeyManager(this.graphics.scene, this.uiManager);
    this.exitDoor = new ExitDoor(this.graphics.scene, this.uiManager);

    // Player with separated wall colliders, floor surfaces, and ceiling heights
    this.player = new Player(
      this.graphics.camera,
      this.graphics.renderer.domElement,
      this.houseBuilder.wallColliders,
      this.houseBuilder.floorSurfaces,
      this.uiManager,
      this.houseBuilder.ceilingHeights
    );

    // Yellow Entity Enemy
    this.entity = new YellowEntity(
      this.graphics.scene,
      this.houseBuilder.navGraph,
      this.houseBuilder.wallColliders,
      this.uiManager
    );

    this.clock = new THREE.Clock();
    this.menuCamAngle = 0;

    this.setupCallbacks();
    this.setupPointerLock();

    window.gameInstance = this;

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    this.uiManager.showMainMenu();
  }

  setupCallbacks() {
    this.uiManager.onPlayClicked = () => this.startGame();
    this.uiManager.onResumeClicked = () => this.resumeGame();
    this.uiManager.onRestartClicked = () => this.restartGame();
    this.uiManager.onMainMenuClicked = () => this.returnToMenu();

    this.uiManager.onSettingsChanged = (settings) => {
      if (settings.sensitivity) {
        this.player.mouseSensitivity = settings.sensitivity;
      }
      if (settings.headBob !== undefined) {
        this.player.headBobEnabled = settings.headBob;
      }
      if (settings.graphics) {
        this.graphics.setGraphicsQuality(settings.graphics);
      }
    };

    this.entity.onPlayerCaught = () => {
      this.state = GameState.GAME_OVER;
      this.uiManager.showGameOver(this.keyManager.collectedCount, this.keyManager.totalKeys);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };

    this.exitDoor.onEscapeSuccess = () => {
      this.state = GameState.VICTORY;
      this.uiManager.showVictory();
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };

    window.addEventListener('blur', () => {
      if (this.state === GameState.PLAYING) {
        this.pauseGame();
      }
    });
  }

  setupPointerLock() {
    const canvas = this.graphics.renderer.domElement;

    document.addEventListener('click', (e) => {
      if (e.target.closest('.modal-card') || e.target.closest('.modal-box') || e.target.closest('button')) {
        return;
      }
      if (this.state === GameState.PLAYING && !this.player.isLocked) {
        canvas.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      const isLocked = document.pointerLockElement === canvas;
      this.player.isLocked = isLocked;

      if (!isLocked && this.state === GameState.PLAYING) {
        this.pauseGame();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.state === GameState.PLAYING) {
          this.pauseGame();
        } else if (this.state === GameState.PAUSED) {
          this.resumeGame();
        }
      }
    });
  }

  startGame() {
    this.state = GameState.PLAYING;
    audioManager.isPlaying = true;
    this.uiManager.showInGameHUD();
    this.graphics.renderer.domElement.requestPointerLock();
    this.uiManager.showToast('Temukan 15 kunci dan hindari The Yellow Entity!', 'normal', 5000);
  }

  pauseGame() {
    if (this.state !== GameState.PLAYING) return;
    this.state = GameState.PAUSED;
    this.uiManager.showPauseMenu();
    audioManager.isPlaying = false;
  }

  resumeGame() {
    if (this.state !== GameState.PAUSED) return;
    this.state = GameState.PLAYING;
    this.uiManager.hidePauseMenu();
    audioManager.isPlaying = true;
    this.graphics.renderer.domElement.requestPointerLock();
  }

  restartGame() {
    this.resetAll();
    this.startGame();
  }

  returnToMenu() {
    this.resetAll();
    this.state = GameState.MENU;
    audioManager.isPlaying = false;
    this.uiManager.showMainMenu();
  }

  resetAll() {
    this.player.reset();
    this.entity.reset();
    this.keyManager.reset();
    this.exitDoor.reset();
    this.uiManager.resetTimer();
    audioManager.setChaseIntensity(0.0);
    this.clock = new THREE.Clock();
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    this.houseBuilder.update(delta);

    if (this.state === GameState.MENU) {
      this.menuCamAngle += delta * 0.12;
      this.graphics.camera.position.set(
        Math.sin(this.menuCamAngle) * 4.5,
        1.8,
        13 + Math.cos(this.menuCamAngle) * 2.5
      );
      this.graphics.camera.lookAt(0, 1.6, 5);

      this.entity.group.position.set(0, 0.5, 5);
      this.entity.rotationY = Math.PI;
      this.entity.animateModel(delta);
      this.entity.group.rotation.y = this.entity.rotationY;
    } else if (this.state === GameState.PLAYING) {
      this.player.update(delta, this.keyManager, this.exitDoor);
      this.entity.update(delta, this.player);
      this.keyManager.update(elapsedTime);
      this.exitDoor.update(delta);

      const distToEntity = this.player.position.distanceTo(this.entity.position);
      const dangerIntensity = Math.max(0, 1 - distToEntity / 20);
      this.uiManager.setDangerLevel(dangerIntensity);
    }

    this.graphics.render();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
