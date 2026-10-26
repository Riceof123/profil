import { audioManager } from '../core/AudioManager.js';

/**
 * Manages all UI, HUD, Modals, Menus, Overlays, and Settings.
 */
export class UIManager {
  constructor() {
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.onPlayClicked = null;
    this.onResumeClicked = null;
    this.onRestartClicked = null;
    this.onMainMenuClicked = null;
    this.onSettingsChanged = null;

    this.cacheDOMElements();
    this.attachEventListeners();
  }

  cacheDOMElements() {
    // Screens
    this.mainMenu = document.getElementById('main-menu');
    this.hud = document.getElementById('hud');
    this.pauseMenu = document.getElementById('pause-menu');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.victoryScreen = document.getElementById('victory-screen');

    // Modals
    this.settingsModal = document.getElementById('settings-modal');
    this.howToPlayModal = document.getElementById('how-to-play-modal');

    // HUD Elements
    this.keyCounterEl = document.getElementById('key-counter');
    this.staminaBarEl = document.getElementById('stamina-bar');
    this.flashlightStatusEl = document.getElementById('flashlight-status');
    this.timerEl = document.getElementById('hud-timer');
    this.interactionPromptEl = document.getElementById('interaction-prompt');
    this.toastEl = document.getElementById('toast-notification');
    this.dangerVignetteEl = document.getElementById('danger-vignette');
    this.jumpscareOverlayEl = document.getElementById('jumpscare-overlay');

    // Stats
    this.goKeysEl = document.getElementById('go-keys-collected');
    this.goTimeEl = document.getElementById('go-time-survived');
    this.vicTimeEl = document.getElementById('vic-escape-time');

    // Settings inputs
    this.volumeSlider = document.getElementById('setting-volume');
    this.sensitivitySlider = document.getElementById('setting-sensitivity');
    this.headBobCheckbox = document.getElementById('setting-headbob');
    this.graphicsSelect = document.getElementById('setting-graphics');
    this.fullscreenBtn = document.getElementById('setting-fullscreen');
  }

  attachEventListeners() {
    // Main Menu Buttons
    document.getElementById('btn-play')?.addEventListener('click', () => {
      audioManager.init();
      audioManager.resume();
      if (this.onPlayClicked) this.onPlayClicked();
    });

    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
      this.openModal(this.howToPlayModal);
    });

    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.openModal(this.settingsModal);
    });

    // Pause Menu Buttons
    document.getElementById('btn-resume')?.addEventListener('click', () => {
      if (this.onResumeClicked) this.onResumeClicked();
    });

    document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
      if (this.onRestartClicked) this.onRestartClicked();
    });

    document.getElementById('btn-pause-settings')?.addEventListener('click', () => {
      this.openModal(this.settingsModal);
    });

    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      if (this.onMainMenuClicked) this.onMainMenuClicked();
    });

    // Game Over Buttons
    document.getElementById('btn-restart-game')?.addEventListener('click', () => {
      if (this.onRestartClicked) this.onRestartClicked();
    });

    document.getElementById('btn-go-menu')?.addEventListener('click', () => {
      if (this.onMainMenuClicked) this.onMainMenuClicked();
    });

    // Victory Buttons
    document.getElementById('btn-play-again')?.addEventListener('click', () => {
      if (this.onRestartClicked) this.onRestartClicked();
    });

    document.getElementById('btn-vic-menu')?.addEventListener('click', () => {
      if (this.onMainMenuClicked) this.onMainMenuClicked();
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModals();
      });
    });

    // Settings Listeners
    this.volumeSlider?.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      audioManager.setVolume(vol);
      const label = document.getElementById('volume-val');
      if (label) label.textContent = `${Math.round(vol * 100)}%`;
    });

    this.sensitivitySlider?.addEventListener('input', (e) => {
      const sens = parseFloat(e.target.value);
      const label = document.getElementById('sens-val');
      if (label) label.textContent = sens.toFixed(1);
      if (this.onSettingsChanged) {
        this.onSettingsChanged({ sensitivity: sens * 0.0011 });
      }
    });

    this.headBobCheckbox?.addEventListener('change', (e) => {
      if (this.onSettingsChanged) {
        this.onSettingsChanged({ headBob: e.target.checked });
      }
    });

    this.graphicsSelect?.addEventListener('change', (e) => {
      if (this.onSettingsChanged) {
        this.onSettingsChanged({ graphics: e.target.value });
      }
    });

    this.fullscreenBtn?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // --- Screen State Changers ---
  showMainMenu() {
    this.stopTimer();
    this.hideAllScreens();
    this.mainMenu.classList.remove('hidden');
    this.dangerVignetteEl.style.opacity = '0';
  }

  showInGameHUD() {
    this.hideAllScreens();
    this.hud.classList.remove('hidden');
    this.startTimer();
  }

  showPauseMenu() {
    this.pauseMenu.classList.remove('hidden');
  }

  hidePauseMenu() {
    this.pauseMenu.classList.add('hidden');
  }

  showGameOver(keysCollected, totalKeys) {
    this.stopTimer();
    this.hideAllScreens();
    if (this.goKeysEl) this.goKeysEl.textContent = `${keysCollected} / ${totalKeys}`;
    if (this.goTimeEl) this.goTimeEl.textContent = this.formatTime(this.timerSeconds);
    this.gameOverScreen.classList.remove('hidden');
  }

  showVictory() {
    this.stopTimer();
    this.hideAllScreens();
    if (this.vicTimeEl) this.vicTimeEl.textContent = this.formatTime(this.timerSeconds);
    this.victoryScreen.classList.remove('hidden');
  }

  hideAllScreens() {
    this.mainMenu.classList.add('hidden');
    this.hud.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.victoryScreen.classList.add('hidden');
    this.closeModals();
  }

  openModal(modalEl) {
    if (modalEl) modalEl.classList.remove('hidden');
  }

  closeModals() {
    this.settingsModal?.classList.add('hidden');
    this.howToPlayModal?.classList.add('hidden');
  }

  // --- In-Game HUD Updates ---
  updateKeyCount(count, total = 15) {
    if (this.keyCounterEl) {
      this.keyCounterEl.textContent = `KEYS COLLECTED: ${count} / ${total}`;
      this.keyCounterEl.classList.add('pulse');
      setTimeout(() => this.keyCounterEl.classList.remove('pulse'), 600);
    }
  }

  updateStamina(current, max) {
    if (this.staminaBarEl) {
      const pct = Math.max(0, Math.min(100, (current / max) * 100));
      this.staminaBarEl.style.width = `${pct}%`;

      if (pct < 25) {
        this.staminaBarEl.style.backgroundColor = '#cc2222';
      } else if (pct < 55) {
        this.staminaBarEl.style.backgroundColor = '#d49b28';
      } else {
        this.staminaBarEl.style.backgroundColor = '#e0c068';
      }
    }
  }

  updateFlashlightStatus(isOn) {
    if (this.flashlightStatusEl) {
      this.flashlightStatusEl.textContent = isOn ? '[F] SENTER: AKTIF' : '[F] SENTER: MATI';
      this.flashlightStatusEl.style.color = isOn ? '#ffe082' : '#666';
    }
  }

  showInteractionPrompt(text) {
    if (this.interactionPromptEl) {
      this.interactionPromptEl.textContent = text;
      this.interactionPromptEl.style.display = 'block';
    }
  }

  hideInteractionPrompt() {
    if (this.interactionPromptEl) {
      this.interactionPromptEl.style.display = 'none';
    }
  }

  showToast(message, type = 'normal', durationMs = 4000) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.className = 'toast show';
    if (type === 'gold') this.toastEl.classList.add('toast-gold');
    if (type === 'red') this.toastEl.classList.add('toast-red');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.className = 'toast';
    }, durationMs);
  }

  setDangerLevel(intensity) {
    if (this.dangerVignetteEl) {
      this.dangerVignetteEl.style.opacity = (intensity * 0.85).toFixed(2);
    }
  }

  triggerJumpscareEffect() {
    if (this.jumpscareOverlayEl) {
      this.jumpscareOverlayEl.classList.add('active');
      setTimeout(() => {
        this.jumpscareOverlayEl.classList.remove('active');
      }, 1400);
    }
  }

  // --- Timer ---
  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      if (this.timerEl) {
        this.timerEl.textContent = this.formatTime(this.timerSeconds);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.timerSeconds = 0;
    if (this.timerEl) {
      this.timerEl.textContent = '00:00';
    }
  }

  formatTime(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
