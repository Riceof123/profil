/**
 * CYBER STRIKE 2D - Procedural Web Audio API Sound Synthesizer
 * No external audio files needed - runs offline and reliably on Mobile & Desktop
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.hapticsEnabled = true;
    this.masterGain = null;
    this.initialized = false;
  }

  // Trigger mobile haptic feedback if supported and enabled
  vibrate(ms = 30) {
    if (!this.hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  }

  toggleHaptics() {
    this.hapticsEnabled = !this.hapticsEnabled;
    return this.hapticsEnabled;
  }

  // Initialize or resume AudioContext on first touch / click
  init() {
    if (this.initialized && this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Comfortable default volume
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.initialized = true;
    } catch (e) {
      console.warn("AudioContext not supported or blocked:", e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  // Helper to generate white noise buffer
  createNoiseBuffer(duration = 0.5) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Weapon shooting sound effect
  playShoot(type = 'pistol') {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;

    switch (type) {
      case 'pistol': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case 'shotgun': {
        // Boom + Noise burst
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.25);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.25);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(now);
        break;
      }

      case 'smg': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'plasma': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'laser': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.22);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'vortex': {
        // Wind swirl whoosh sound
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(0.35);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.18);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(now);
        break;
      }
    }
  }

  // Enemy shoot
  playEnemyShoot() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Explosion sound
  playExplosion() {
    this.vibrate(50);
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.5);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  // Enemy hit blip
  playEnemyHit() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Player hurt thud
  playPlayerHurt() {
    this.vibrate(40);
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Dash sound effect
  playDash() {
    this.vibrate(20);
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.18);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.18);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  // Pickup sound
  playPickup() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.25, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.15);
    });
  }

  // Level Clear Fanfare
  playLevelClear() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.4, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.35);
    });
  }

  // Game Over Sound
  playGameOver() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const notes = [330, 311, 293, 261]; // Descending sad tones
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.22);

      gain.gain.setValueAtTime(0.35, now + i * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.22 + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.22);
      osc.stop(now + i * 0.22 + 0.3);
    });
  }

  // Victory Fanfare
  playVictory() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const chord1 = [523.25, 659.25, 783.99]; // C major
    const chord2 = [587.33, 739.99, 880.00]; // D major
    const chord3 = [659.25, 830.61, 987.77]; // E major
    const chord4 = [1046.50, 1318.51, 1567.98]; // High C chord

    const chords = [
      { notes: chord1, time: 0 },
      { notes: chord2, time: 0.25 },
      { notes: chord3, time: 0.5 },
      { notes: chord4, time: 0.8 }
    ];

    const now = this.ctx.currentTime;
    chords.forEach(c => {
      c.notes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + c.time);

        gain.gain.setValueAtTime(0.3, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.01, now + c.time + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + c.time);
        osc.stop(now + c.time + 0.6);
      });
    });
  }

  // Skill 1: Rapid Regeneration sound
  playSkillRegen() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.3, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  }

  // Skill 2: Summon Allies Drones sound
  playSkillSummon() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Skill 3: Instant Screen-Kill Nuke sound
  playSkillNuke() {
    this.vibrate([100, 50, 200]);
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    // Sub-bass boom
    const osc = this.ctx.createOscillator();
    const gainOsc = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 1.2);
    gainOsc.gain.setValueAtTime(0.8, now);
    gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    osc.connect(gainOsc);
    gainOsc.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.2);

    // Rumble noise
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(1.0);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 1.0);

    const gainNoise = this.ctx.createGain();
    gainNoise.gain.setValueAtTime(0.8, now);
    gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

    noise.connect(filter);
    filter.connect(gainNoise);
    gainNoise.connect(this.masterGain);
    noise.start(now);
  }
}

// Global audio instance
window.soundFx = new SoundEffects();
