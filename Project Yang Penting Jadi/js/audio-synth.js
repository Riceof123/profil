/**
 * THE COMPANY ARCHIVES // PROCEDURAL SOUND SYNTHESIZER
 * Web Audio API based sound engine for futuristic UI and ambient drone
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientDrone = null;
    this.droneGain = null;
    this.filterNode = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  toggleSound() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startAmbient();
      this.playBeep(880, 0.1, 'sine');
    } else {
      this.stopAmbient();
    }
    return !this.isMuted;
  }

  startAmbient() {
    if (!this.ctx || this.isMuted) return;
    if (this.ambientDrone) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.5, this.ctx.currentTime); // Detuned drone beat

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientDrone = [osc1, osc2];
      this.droneGain = gain;
    } catch (e) {
      console.warn("Ambient drone error", e);
    }
  }

  stopAmbient() {
    if (!this.ctx || !this.ambientDrone) return;
    try {
      if (this.droneGain) {
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, this.ctx.currentTime);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      }
      setTimeout(() => {
        if (this.ambientDrone) {
          this.ambientDrone.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) {}
          });
          this.ambientDrone = null;
        }
      }, 1000);
    } catch (e) {}
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playWarp() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.35);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }

  playExplosion() {
    if (this.isMuted || !this.ctx) return;
    try {
      // Noise burst with deep decay
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 1.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 1.5);
    } catch (e) {}
  }

  playBeep(freq = 600, dur = 0.08, type = 'sine') {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }
}

window.soundEngine = new SoundEngine();
