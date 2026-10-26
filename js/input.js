/* ========================================================
   CYBER SURVIVOR 2D - INPUT MANAGER
   Handles Desktop (Keyboard + Mouse) & Mobile (Touch + Joysticks)
   ======================================================== */

class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Movement vector (-1 to 1)
    this.moveX = 0;
    this.moveY = 0;
    
    // Aim coordinates (in screen space)
    this.aimScreenX = window.innerWidth / 2;
    this.aimScreenY = window.innerHeight / 2;
    this.aimAngle = 0; // In radians
    
    // Fire state
    this.isFiring = false;
    
    // Key states
    this.keys = {};
    
    // Touch identifiers
    this.leftTouchId = null;
    this.rightTouchId = null;
    
    // Joystick elements
    this.leftZone = document.getElementById('left-stick-zone');
    this.leftThumb = document.getElementById('left-thumb');
    this.rightZone = document.getElementById('right-stick-zone');
    this.rightThumb = document.getElementById('right-thumb');
    
    this.stickRadius = 45; // Max displacement in pixels
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    this.init();
  }

  init() {
    this.bindKeyboard();
    this.bindMouse();
    this.bindTouch();
    
    // Audio unlock listener on first user interaction
    const unlockAudio = () => {
      if (window.soundManager) {
        window.soundManager.unlock();
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  }

  // --- RECALCULATE AIM ON EACH FRAME ---
  updateAim(camera, player) {
    // Only update from mouse position if right touch joystick is not currently active
    if (this.rightTouchId === null && player && camera) {
      const playerScreenPos = camera.worldToScreen(player.x, player.y);
      this.aimAngle = Math.atan2(
        this.aimScreenY - playerScreenPos.y,
        this.aimScreenX - playerScreenPos.x
      );
    }
  }

  // --- KEYBOARD HANDLING ---
  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.updateKeyboardMovement();

      // Number keys for weapon slots
      if (['1', '2', '3', '4'].includes(e.key)) {
        const slotIdx = parseInt(e.key, 10) - 1;
        if (window.game) {
          window.game.switchWeaponByIndex(slotIdx);
        }
      }

      // Q and E to cycle weapons
      if (e.key.toLowerCase() === 'q') {
        if (window.game) window.game.cycleWeapon(-1);
      } else if (e.key.toLowerCase() === 'e') {
        if (window.game) window.game.cycleWeapon(1);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.updateKeyboardMovement();
    });
  }

  updateKeyboardMovement() {
    // Only update keyboard movement if left touch stick is not being used
    if (this.leftTouchId !== null) return;

    let dx = 0;
    let dy = 0;

    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
    }

    this.moveX = dx;
    this.moveY = dy;
  }

  // --- MOUSE HANDLING ---
  bindMouse() {
    window.addEventListener('mousemove', (e) => {
      if (this.rightTouchId !== null) return;
      this.aimScreenX = e.clientX;
      this.aimScreenY = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('.modal-overlay') || e.target.closest('#hud-overlay') || e.target.closest('#mobile-controls')) {
        return;
      }
      if (e.button === 0) { // Left click
        this.isFiring = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isFiring = false;
      }
    });

    // Mouse wheel weapon cycle
    window.addEventListener('wheel', (e) => {
      if (window.game) {
        const direction = e.deltaY > 0 ? 1 : -1;
        window.game.cycleWeapon(direction);
      }
    }, { passive: true });
  }

  // --- TOUCH HANDLING (MOBILE DUAL JOYSTICK) ---
  bindTouch() {
    // Left joystick touch (Movement)
    if (this.leftZone) {
      this.leftZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.leftTouchId = touch.identifier;
        this.handleLeftStickMove(touch.clientX, touch.clientY);
      }, { passive: false });

      this.leftZone.addEventListener('touchmove', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.leftTouchId) {
            this.handleLeftStickMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
            break;
          }
        }
      }, { passive: false });

      const resetLeftStick = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.leftTouchId) {
            this.leftTouchId = null;
            this.moveX = 0;
            this.moveY = 0;
            if (this.leftThumb) {
              this.leftThumb.style.transform = `translate(0px, 0px)`;
            }
            this.updateKeyboardMovement();
            break;
          }
        }
      };

      this.leftZone.addEventListener('touchend', resetLeftStick);
      this.leftZone.addEventListener('touchcancel', resetLeftStick);
    }

    // Right joystick touch (Aim & Fire)
    if (this.rightZone) {
      this.rightZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.rightTouchId = touch.identifier;
        this.handleRightStickMove(touch.clientX, touch.clientY);
      }, { passive: false });

      this.rightZone.addEventListener('touchmove', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.rightTouchId) {
            this.handleRightStickMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
            break;
          }
        }
      }, { passive: false });

      const resetRightStick = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.rightTouchId) {
            this.rightTouchId = null;
            this.isFiring = false;
            if (this.rightThumb) {
              this.rightThumb.style.transform = `translate(0px, 0px)`;
            }
            break;
          }
        }
      };

      this.rightZone.addEventListener('touchend', resetRightStick);
      this.rightZone.addEventListener('touchcancel', resetRightStick);
    }
  }

  handleLeftStickMove(clientX, clientY) {
    const rect = this.leftZone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > this.stickRadius) {
      dx = (dx / dist) * this.stickRadius;
      dy = (dy / dist) * this.stickRadius;
    }

    if (this.leftThumb) {
      this.leftThumb.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    // Deadzone
    if (dist < 8) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = dx / this.stickRadius;
      this.moveY = dy / this.stickRadius;
    }
  }

  handleRightStickMove(clientX, clientY) {
    const rect = this.rightZone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > this.stickRadius) {
      dx = (dx / dist) * this.stickRadius;
      dy = (dy / dist) * this.stickRadius;
    }

    if (this.rightThumb) {
      this.rightThumb.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    // Aim and Fire logic
    if (dist > 10) {
      this.aimAngle = Math.atan2(dy, dx);
      this.isFiring = true;
    } else {
      this.isFiring = false;
    }
  }
}
