/**
 * Procedural Horror Web Audio API Engine
 * Completely self-contained with zero external audio assets.
 * Optimized: Clean gain transitions, auto-suspended state recovery, jump & land sounds.
 */
export class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.chaseGain = null;
    this.isMuted = false;
    this.volume = 0.8;
    this.isPlaying = false;
    this.heartbeatTimer = null;
    this.heartbeatBpm = 60;
    this.chaseIntensity = 0;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.initialized = true;
      this.setupAmbience();
      this.setupChaseMusic();
      this.startHeartbeatLoop();
    } catch (e) {
      console.warn('Web Audio API could not be initialized:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // --- Ambient Horror Drone ---
  setupAmbience() {
    if (!this.ctx) return;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(110, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(45, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter1.frequency);

    osc1.connect(filter1);
    filter1.connect(this.ambientGain);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(58.27, this.ctx.currentTime);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.18, this.ctx.currentTime);
    osc2.connect(gain2);
    gain2.connect(this.ambientGain);

    // Atmospheric wind noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambientGain);

    osc1.start();
    osc2.start();
    lfo.start();
    whiteNoise.start();

    setInterval(() => {
      if (Math.random() < 0.3 && this.isPlaying) {
        this.playCreak();
      }
    }, 8000);
  }

  // --- Dynamic Chase Music ---
  setupChaseMusic() {
    if (!this.ctx) return;
    this.chaseGain = this.ctx.createGain();
    this.chaseGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.chaseGain.connect(this.masterGain);

    const chaseOsc = this.ctx.createOscillator();
    chaseOsc.type = 'triangle';
    chaseOsc.frequency.setValueAtTime(42, this.ctx.currentTime);

    const carrier = this.ctx.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(440, this.ctx.currentTime);

    const modulator = this.ctx.createOscillator();
    modulator.type = 'square';
    modulator.frequency.setValueAtTime(26, this.ctx.currentTime);

    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(160, this.ctx.currentTime);
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    const screechFilter = this.ctx.createBiquadFilter();
    screechFilter.type = 'bandpass';
    screechFilter.frequency.setValueAtTime(750, this.ctx.currentTime);
    screechFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    carrier.connect(screechFilter);
    screechFilter.connect(this.chaseGain);
    chaseOsc.connect(this.chaseGain);

    chaseOsc.start();
    carrier.start();
    modulator.start();
  }

  setChaseIntensity(intensity) {
    this.chaseIntensity = Math.max(0, Math.min(1, intensity));
    if (this.chaseGain && this.ctx) {
      const targetGain = this.chaseIntensity * 0.65;
      this.chaseGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }
    this.heartbeatBpm = 60 + this.chaseIntensity * 95;
  }

  startHeartbeatLoop() {
    const beat = () => {
      if (this.isPlaying && this.chaseIntensity > 0.12) {
        this.playHeartbeat(this.chaseIntensity);
      }
      const intervalMs = (60 / this.heartbeatBpm) * 1000;
      this.heartbeatTimer = setTimeout(beat, intervalMs);
    };
    beat();
  }

  playHeartbeat(intensity) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const vol = 0.2 + intensity * 0.45;

    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(65, t);
    osc1.frequency.exponentialRampToValueAtTime(35, t + 0.11);
    gain1.gain.setValueAtTime(vol, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.12);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(60, t + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(30, t + 0.24);
    gain2.gain.setValueAtTime(vol * 0.7, t + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.14);
    osc2.stop(t + 0.25);
  }

  // --- Footsteps ---
  playFootstep(type = 'walk') {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const isSprint = type === 'sprint';
    const isCrouch = type === 'crouch';

    const baseFreq = isSprint ? 120 : isCrouch ? 70 : 95;
    const vol = isSprint ? 0.32 : isCrouch ? 0.08 : 0.18;
    const dur = isSprint ? 0.11 : 0.08;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq + (Math.random() * 16 - 8), t);
    osc.frequency.exponentialRampToValueAtTime(30, t + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + dur + 0.02);

    if (!isCrouch && Math.random() < (isSprint ? 0.4 : 0.18)) {
      this.playWoodSnap();
    }
  }

  // --- Player Jump & Landing Sounds ---
  playJump() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Quick air whoosh and foot push
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  playLand(impactSpeed = 5) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const normalizedImpact = Math.min(1.0, Math.max(0.2, Math.abs(impactSpeed) / 10));
    const vol = 0.25 * normalizedImpact;

    // Heavy floorboard thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.19);

    if (normalizedImpact > 0.4) {
      this.playWoodSnap();
    }
  }

  playWoodSnap() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450 + Math.random() * 250, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.05);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // --- Entity Footsteps with 3D Stereo Panning ---
  playEntityFootstep(pan = 0, distance = 10) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const distFactor = Math.max(0, 1 - distance / 26);
    if (distFactor <= 0.01) return;

    const vol = distFactor * 0.55;

    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(55 + Math.random() * 12, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.18);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180 + distFactor * 350, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(gain);

    if (panner) {
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      gain.connect(this.masterGain);
    }

    osc.start(t);
    osc.stop(t + 0.2);
  }

  playEntityAlert(distance = 10) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const distFactor = Math.max(0.15, 1 - distance / 30);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(230, t + 0.22);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.65);

    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.35 * distFactor, t + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.68);
  }

  playKeyPickup() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66, 1760];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.0, t);
      gain.gain.setValueAtTime(0.22, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.05 + 1.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 1.15);
    });
  }

  playFlashlightClick() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1700, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.035);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playDoorLocked() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260 + i * 40, t + i * 0.05);
      gain.gain.setValueAtTime(0.18, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.06);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.07);
    }
  }

  playDoorUnlocked() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.65);

    for (let i = 0; i < 4; i++) {
      const clang = this.ctx.createOscillator();
      const clangGain = this.ctx.createGain();
      clang.type = 'triangle';
      clang.frequency.setValueAtTime(600 + Math.random() * 800, t + 0.1 + i * 0.08);
      clangGain.gain.setValueAtTime(0.2, t + 0.1 + i * 0.08);
      clangGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1 + i * 0.08 + 0.15);
      clang.connect(clangGain);
      clangGain.connect(this.masterGain);
      clang.start(t + 0.1 + i * 0.08);
      clang.stop(t + 0.1 + i * 0.08 + 0.16);
    }
  }

  playCreak() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.3);
    osc.frequency.linearRampToValueAtTime(230, t + 0.7);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  playJumpscare() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(120, t);
    sub.frequency.exponentialRampToValueAtTime(25, t + 0.8);
    subGain.gain.setValueAtTime(0.9, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(t);
    sub.stop(t + 1.25);

    const scream = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const screamGain = this.ctx.createGain();

    scream.type = 'sawtooth';
    scream.frequency.setValueAtTime(1300, t);
    scream.frequency.exponentialRampToValueAtTime(600, t + 1.3);

    mod.type = 'square';
    mod.frequency.setValueAtTime(90, t);
    modGain.gain.setValueAtTime(380, t);
    mod.connect(modGain);
    modGain.connect(scream.frequency);

    screamGain.gain.setValueAtTime(0.85, t);
    screamGain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

    scream.connect(screamGain);
    screamGain.connect(this.masterGain);

    mod.start(t);
    scream.start(t);
    mod.stop(t + 1.35);
    scream.stop(t + 1.35);
  }

  playVictory() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const chords = [261.63, 329.63, 392.0, 523.25, 659.25];

    chords.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 3.3);
    });
  }
}

export const audioManager = new AudioManager();
