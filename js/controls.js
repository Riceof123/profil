/**
 * CYBER STRIKE 2D - Unified Controls System
 * Supports Keyboard + Mouse (PC/Mac) and Multi-Touch Virtual Joysticks (Android & iOS)
 */

class InputController {
  constructor(canvas) {
    this.canvas = canvas;

    // Movement vectors (-1 to 1)
    this.moveX = 0;
    this.moveY = 0;

    // Aiming & Shooting
    this.isAiming = false;
    this.aimAngle = 0;
    this.isShooting = false;
    this.dashRequested = false;

    // Weapon selection
    this.selectedWeaponIndex = 0;

    // Mobile Optimizations
    this.aimAssistEnabled = true;
    this.performanceMode = false;

    // Device state
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Keyboard state
    this.keys = {};

    // Mouse coordinates in screen space
    this.mouseX = 0;
    this.mouseY = 0;

    // Player screen position for aim calculation
    this.playerScreenX = window.innerWidth / 2;
    this.playerScreenY = window.innerHeight / 2;

    // Virtual Joysticks State
    this.moveTouchId = null;
    this.moveStickOrigin = { x: 0, y: 0 };
    this.aimTouchId = null;
    this.aimStickOrigin = { x: 0, y: 0 };

    this.initDesktopEvents();
    this.initMobileEvents();
    this.initUIButtons();
  }

  // ----------------------------------------------------
  // DESKTOP: KEYBOARD & MOUSE
  // ----------------------------------------------------
  initDesktopEvents() {
    // Prevent context menu on right click or long press
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // Resume sound when returning to tab
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && window.soundFx && window.soundFx.ctx) {
        if (window.soundFx.ctx.state === 'suspended') {
          window.soundFx.ctx.resume();
        }
      }
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;

      // Spacebar for Dash
      if (e.code === 'Space') {
        this.dashRequested = true;
        e.preventDefault();
      }

      // Number keys 1-6 for weapon selection
      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const slotIdx = parseInt(e.key, 10) - 1;
        if (window.gameInstance && window.gameInstance.isWeaponUnlocked(slotIdx)) {
          this.selectedWeaponIndex = slotIdx;
          window.gameInstance.updateWeaponUI();
        }
      }

      // Skill hotkeys: F (Regen), G (Summon), V (Nuke)
      if (e.key.toLowerCase() === 'f') {
        window.gameInstance && window.gameInstance.skillManager && window.gameInstance.skillManager.activateSkill('regen');
      } else if (e.key.toLowerCase() === 'g') {
        window.gameInstance && window.gameInstance.skillManager && window.gameInstance.skillManager.activateSkill('summon');
      } else if (e.key.toLowerCase() === 'v') {
        window.gameInstance && window.gameInstance.skillManager && window.gameInstance.skillManager.activateSkill('nuke');
      }

      // Q and E to cycle weapons
      if (e.key.toLowerCase() === 'q') {
        window.gameInstance && window.gameInstance.cycleWeapon(-1);
      } else if (e.key.toLowerCase() === 'e') {
        window.gameInstance && window.gameInstance.cycleWeapon(1);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });

    // Mouse move -> updates aim angle
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      const dx = this.mouseX - this.playerScreenX;
      const dy = this.mouseY - this.playerScreenY;
      this.aimAngle = Math.atan2(dy, dx);
      this.isAiming = true;
    });

    // Left click -> Shoot
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        // Only if not clicking a UI button, weapon slot, or skill button
        if (!e.target.closest('button') && !e.target.closest('.weapon-slot') && !e.target.closest('.skill-btn')) {
          this.isShooting = true;
          window.soundFx.init(); // Unlock Web Audio
        }
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isShooting = false;
      }
    });

    // Mouse scroll -> cycle weapons
    window.addEventListener('wheel', (e) => {
      if (e.deltaY < 0) {
        window.gameInstance && window.gameInstance.cycleWeapon(-1);
      } else {
        window.gameInstance && window.gameInstance.cycleWeapon(1);
      }
    }, { passive: true });
  }

  // ----------------------------------------------------
  // MOBILE: VIRTUAL JOYSTICKS & TOUCH EVENTS
  // ----------------------------------------------------
  initMobileEvents() {
    const moveZone = document.getElementById('joystick-move-zone');
    const moveBase = document.getElementById('joystick-move-base');
    const moveStick = document.getElementById('joystick-move-stick');
    const aimZone = document.getElementById('joystick-aim-zone');
    const aimBase = document.getElementById('joystick-aim-base');
    const aimStick = document.getElementById('joystick-aim-stick');

    const maxRadius = 45; // Max joystick stick deflection distance

    // --- LEFT JOYSTICK: DYNAMIC FLOATING MOVEMENT ---
    const handleMoveStart = (touch) => {
      this.moveTouchId = touch.identifier;
      const baseRadius = 45; // half of 90px

      // Clamp touch within reasonable bounds
      const posX = Math.max(baseRadius + 5, Math.min(window.innerWidth * 0.48, touch.clientX));
      const posY = Math.max(window.innerHeight * 0.2, Math.min(window.innerHeight - baseRadius - 5, touch.clientY));

      moveBase.style.position = 'fixed';
      moveBase.style.left = `${posX - baseRadius}px`;
      moveBase.style.top = `${posY - baseRadius}px`;
      moveBase.style.bottom = 'auto';

      this.moveStickOrigin = { x: posX, y: posY };
      this.updateMoveStick(touch, maxRadius, moveStick);
      window.soundFx.init();
    };

    const handleMoveProcess = (touch) => {
      this.updateMoveStick(touch, maxRadius, moveStick);
    };

    const handleMoveEnd = () => {
      this.moveTouchId = null;
      this.moveX = 0;
      this.moveY = 0;
      moveStick.style.transform = 'translate(0px, 0px)';
      moveBase.style.position = '';
      moveBase.style.left = '';
      moveBase.style.top = '';
      moveBase.style.bottom = '';
    };

    moveZone.addEventListener('touchstart', (e) => {
      // Don't activate move stick if touching a UI button
      if (e.target.closest('button') || e.target.closest('.skill-btn') || e.target.closest('.action-btn') || e.target.closest('.weapon-slot')) {
        return;
      }
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (this.moveTouchId === null) {
          handleMoveStart(e.changedTouches[i]);
          break;
        }
      }
    }, { passive: false });

    // --- RIGHT JOYSTICK: DYNAMIC AIM & AUTO-FIRE ---
    const handleAimStart = (touch) => {
      this.aimTouchId = touch.identifier;
      const baseRadius = 45;

      const posX = Math.max(window.innerWidth * 0.52, Math.min(window.innerWidth - baseRadius - 5, touch.clientX));
      const posY = Math.max(window.innerHeight * 0.2, Math.min(window.innerHeight - baseRadius - 5, touch.clientY));

      aimBase.style.position = 'fixed';
      aimBase.style.left = `${posX - baseRadius}px`;
      aimBase.style.top = `${posY - baseRadius}px`;
      aimBase.style.right = 'auto';
      aimBase.style.bottom = 'auto';

      this.aimStickOrigin = { x: posX, y: posY };
      this.updateAimStick(touch, maxRadius, aimStick);
      this.isShooting = true;
      window.soundFx.init();
    };

    const handleAimProcess = (touch) => {
      this.updateAimStick(touch, maxRadius, aimStick);
      this.isShooting = true;
    };

    const handleAimEnd = () => {
      this.aimTouchId = null;
      this.isShooting = false;
      aimStick.style.transform = 'translate(0px, 0px)';
      aimBase.style.position = '';
      aimBase.style.left = '';
      aimBase.style.top = '';
      aimBase.style.right = '';
      aimBase.style.bottom = '';
    };

    aimZone.addEventListener('touchstart', (e) => {
      // Don't activate aim stick if touching a UI button
      if (e.target.closest('button') || e.target.closest('.skill-btn') || e.target.closest('.action-btn') || e.target.closest('.weapon-slot')) {
        return;
      }
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (this.aimTouchId === null) {
          handleAimStart(e.changedTouches[i]);
          break;
        }
      }
    }, { passive: false });

    // Global touch move & end to ensure seamless tracking even outside zone bounds
    window.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.moveTouchId) {
          handleMoveProcess(touch);
        } else if (touch.identifier === this.aimTouchId) {
          handleAimProcess(touch);
        }
      }
    }, { passive: false });

    const handleTouchEndGlobal = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.moveTouchId) {
          handleMoveEnd();
        } else if (touch.identifier === this.aimTouchId) {
          handleAimEnd();
        }
      }
    };

    window.addEventListener('touchend', handleTouchEndGlobal, { passive: false });
    window.addEventListener('touchcancel', handleTouchEndGlobal, { passive: false });

    // Mobile Dash & Manual Fire buttons
    const btnDash = document.getElementById('btn-dash');
    const btnManualFire = document.getElementById('btn-manual-fire');

    btnDash.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.dashRequested = true;
      window.soundFx.init();
      window.soundFx.vibrate(20);
    }, { passive: false });

    btnDash.addEventListener('click', () => {
      this.dashRequested = true;
      window.soundFx.vibrate(20);
    });

    btnManualFire.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isShooting = true;
      window.soundFx.init();
      window.soundFx.vibrate(15);
    }, { passive: false });

    btnManualFire.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.isShooting = false;
    }, { passive: false });
  }

  updateMoveStick(touch, maxRadius, element) {
    const dx = touch.clientX - this.moveStickOrigin.x;
    const dy = touch.clientY - this.moveStickOrigin.y;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      this.moveX = 0;
      this.moveY = 0;
      element.style.transform = 'translate(0px, 0px)';
      return;
    }

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxRadius);
    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    element.style.transform = `translate(${stickX}px, ${stickY}px)`;

    // Normalized move vector (-1 to 1)
    this.moveX = stickX / maxRadius;
    this.moveY = stickY / maxRadius;
  }

  updateAimStick(touch, maxRadius, element) {
    const dx = touch.clientX - this.aimStickOrigin.x;
    const dy = touch.clientY - this.aimStickOrigin.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      this.aimAngle = Math.atan2(dy, dx);
      this.isAiming = true;
    }

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);
    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    element.style.transform = `translate(${stickX}px, ${stickY}px)`;
  }

  // ----------------------------------------------------
  // UI BUTTONS (Sound, Fullscreen, Pause)
  // ----------------------------------------------------
  initUIButtons() {
    const btnSound = document.getElementById('btn-sound');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnPause = document.getElementById('btn-pause');

    btnSound.addEventListener('click', () => {
      window.soundFx.init();
      const isMuted = window.soundFx.toggleMute();
      btnSound.textContent = isMuted ? '🔇' : '🔊';
    });

    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    btnPause.addEventListener('click', () => {
      window.gameInstance && window.gameInstance.togglePause();
    });

    // Pause menu settings: Aim Assist
    const btnAimAssist = document.getElementById('toggle-aim-assist');
    if (btnAimAssist) {
      btnAimAssist.addEventListener('click', () => {
        this.aimAssistEnabled = !this.aimAssistEnabled;
        btnAimAssist.textContent = this.aimAssistEnabled ? 'AKTIF' : 'MATI';
        btnAimAssist.className = `toggle-btn ${this.aimAssistEnabled ? 'active' : ''}`;
        window.soundFx.vibrate(20);
      });
    }

    // Pause menu settings: Haptics
    const btnHaptics = document.getElementById('toggle-haptics');
    if (btnHaptics) {
      btnHaptics.addEventListener('click', () => {
        const isEnabled = window.soundFx.toggleHaptics();
        btnHaptics.textContent = isEnabled ? 'AKTIF' : 'MATI';
        btnHaptics.className = `toggle-btn ${isEnabled ? 'active' : ''}`;
        window.soundFx.vibrate(25);
      });
    }

    // Pause menu settings: Performance mode
    const btnPerf = document.getElementById('toggle-perf-mode');
    if (btnPerf) {
      btnPerf.addEventListener('click', () => {
        this.performanceMode = !this.performanceMode;
        btnPerf.textContent = this.performanceMode ? 'HEMAT (60+ FPS)' : 'TINGGI';
        btnPerf.className = `toggle-btn ${this.performanceMode ? 'active' : ''}`;
        if (window.gameInstance) {
          window.gameInstance.setPerformanceMode(this.performanceMode);
        }
        window.soundFx.vibrate(20);
      });
    }
  }

  // Smart Mobile Aim Assist: Subtly guides aim towards nearest enemy within cone
  applyAimAssist(player, enemies) {
    if (!this.aimAssistEnabled || enemies.length === 0) return;

    let closestEnemy = null;
    let minDiff = 0.55; // ~31 degree cone
    const maxAssistDistSq = 450 * 450; // 450px range
    const currentAngle = this.isAiming ? this.aimAngle : player.angle;

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < maxAssistDistSq) {
        const enemyAngle = Math.atan2(dy, dx);
        // Angular difference wrapped between -PI and PI
        let diff = enemyAngle - currentAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        const absDiff = Math.abs(diff);
        if (absDiff < minDiff) {
          minDiff = absDiff;
          closestEnemy = { angle: enemyAngle, diff: diff };
        }
      }
    }

    // Subtly nudge aim angle towards target
    if (closestEnemy) {
      this.aimAngle = currentAngle + closestEnemy.diff * 0.4; // 40% magnetic pull
      this.isAiming = true;
      player.angle = this.aimAngle;
    }
  }

  // Called every game frame to poll keyboard state (if not using joystick)
  update() {
    // If movement joystick isn't actively touched, read keyboard WASD
    if (this.moveTouchId === null) {
      let kx = 0;
      let ky = 0;

      if (this.keys['w'] || this.keys['arrowup']) ky -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) ky += 1;
      if (this.keys['a'] || this.keys['arrowleft']) kx -= 1;
      if (this.keys['d'] || this.keys['arrowright']) kx += 1;

      this.moveX = kx;
      this.moveY = ky;
    }
  }

  setPlayerScreenPosition(screenX, screenY) {
    this.playerScreenX = screenX;
    this.playerScreenY = screenY;

    // Recalculate mouse aim angle on desktop
    if (!this.isTouchDevice && this.moveTouchId === null && this.aimTouchId === null) {
      const dx = this.mouseX - this.playerScreenX;
      const dy = this.mouseY - this.playerScreenY;
      this.aimAngle = Math.atan2(dy, dx);
    }
  }
}
