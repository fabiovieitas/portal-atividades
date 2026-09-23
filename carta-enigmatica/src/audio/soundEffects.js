// Web Audio API Sound Effects Synthesizer (No external MP3s)

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // 1. Som de tecla de máquina de escrever / carimbo
  playKeyPress() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Click noise transient
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);

      // Metallic body resonance
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 80, now);
      oscGain.gain.setValueAtTime(0.08, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // 2. Som de carimbo confirmado / Enter
  playStamp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // 3. Som de acerto animado e triunfal: "Tcharaaaam! 🎉🎺"
  playSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // --- PARTE 1: "TCHA!" (Ataque rápido do trompete em dominante G4 -> C5) ---
      const tchaNotes = [
        { f: 392.00, start: 0, dur: 0.09, vol: 0.22 },     // Sol (G4)
        { f: 523.25, start: 0.08, dur: 0.10, vol: 0.25 },   // Dó (C5)
      ];

      tchaNotes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.start);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now + n.start);
        filter.frequency.exponentialRampToValueAtTime(1200, now + n.start + n.dur);

        gain.gain.setValueAtTime(n.vol, now + n.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.02);
      });

      // --- PARTE 2: "RAAAAAM!" (Acorde triunfal sustentado de Metais C-Maior) ---
      const chordStart = now + 0.16;
      const chordDuration = 0.85;
      const brassNotes = [
        { f: 261.63, vol: 0.22 }, // C4 (grave de apoio)
        { f: 392.00, vol: 0.24 }, // G4 (quinta harmônica)
        { f: 523.25, vol: 0.26 }, // C5 (oitava principal)
        { f: 659.25, vol: 0.25 }, // E5 (terça alegre maior)
        { f: 783.99, vol: 0.22 }, // G5 (brilho agudo)
        { f: 1046.50, vol: 0.18 } // C6 (topo triunfal)
      ];

      brassNotes.forEach(b => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(b.f, chordStart);

        // Leve vibrato triunfal
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, chordStart);
        lfoGain.gain.setValueAtTime(2.5, chordStart);
        lfo.connect(osc.frequency);
        lfo.start(chordStart);
        lfo.stop(chordStart + chordDuration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, chordStart);
        filter.frequency.exponentialRampToValueAtTime(1400, chordStart + chordDuration);

        // Curva de envelope: Punch inicial + sustain brilhante + fade out macio
        gain.gain.setValueAtTime(0.01, chordStart);
        gain.gain.linearRampToValueAtTime(b.vol, chordStart + 0.03);
        gain.gain.setValueAtTime(b.vol * 0.9, chordStart + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, chordStart + chordDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(chordStart);
        osc.stop(chordStart + chordDuration + 0.05);
      });

      // --- PARTE 3: BRILHO DE SINOS CINTILANTES (Poeira mágica de acerto) ---
      const chimeNotes = [1046.5, 1318.5, 1567.98, 1975.5, 2093.0, 2637.0];
      chimeNotes.forEach((freq, i) => {
        const chimeTime = chordStart + 0.06 + i * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chimeTime);

        gain.gain.setValueAtTime(0.12, chimeTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, chimeTime + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(chimeTime);
        osc.stop(chimeTime + 0.40);
      });

    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // 4. Som de erro / shake
  playError() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(130, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  // 5. Som de mecanismo / destrancar porta da sala
  playUnlockRoom() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 3 clicks de engrenagem
      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + i * 150, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.07);
      }

      // Bell chime no final
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(880, now + 0.32); // A5
      bellGain.gain.setValueAtTime(0.22, now + 0.32);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      bell.connect(bellGain);
      bellGain.connect(this.ctx.destination);

      bell.start(now + 0.32);
      bell.stop(now + 0.9);
    } catch (e) {}
  }

  // 6. Fanfarra festiva de vitória final
  playVictoryFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Melodia triunfal festiva
      const melody = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.28 }, // E5
        { f: 783.99, d: 0.28 }, // G5
        { f: 1046.5, d: 0.65 }, // C6
      ];

      let elapsed = 0;
      melody.forEach(note => {
        const t = now + elapsed;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + note.d + 0.05);

        elapsed += note.d * 0.85;
      });
    } catch (e) {}
  }

  // 7. Som de dica ativada
  playHint() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(1108.73, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  // 8. Som de caneta / lápis escrevendo no papel
  playPenWrite() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [0, 0.07, 0.14].forEach(delay => {
        const t = now + delay;
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400 + Math.random() * 600, t);
        filter.Q.setValueAtTime(4, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(t);
      });
    } catch (e) {}
  }

  // 9. Brilho mágico / Chime de acerto
  playStarChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [880, 1174.66, 1396.91, 1760, 2093];
      freqs.forEach((freq, idx) => {
        const t = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {}
  }

  // 10. Virada de página de caderno
  playPageFlip() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {}
  }
}

export const sounds = new SoundSynthesizer();
