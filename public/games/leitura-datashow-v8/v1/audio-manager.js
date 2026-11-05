/**
 * AudioManager v8.0 - Motor de Trilhas Sonoras Únicas e Distintas
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgmTimer = null;
    this.currentMusicStyle = 'alegre';
    this.isMuted = false;
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.selectedVoiceURI = 'natural';
    this.pitch = 1.0;
    this.rate = 0.85;
    this.audioElement = new Audio();
    
    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }

    const unlock = () => this.initContext();
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    const all = this.synth.getVoices();
    this.voices = all.filter(v => 
      v.lang.toLowerCase().includes('pt') || 
      v.lang.toLowerCase().includes('br')
    );
    return this.voices;
  }

  getAvailableVoices() {
    if (!this.voices.length) this.loadVoices();
    return this.voices;
  }

  setVoiceSettings(voiceURI, pitch = 1.0, rate = 0.85) {
    this.selectedVoiceURI = voiceURI;
    this.pitch = parseFloat(pitch) || 1.0;
    this.rate = parseFloat(rate) || 0.85;
  }

  speak(text, rate = null, pitch = null) {
    if (this.isMuted) return;
    this.initContext();

    const currentRate = rate || this.rate;
    const currentPitch = pitch || this.pitch;

    if (navigator.onLine && text.length < 120 && this.selectedVoiceURI === 'natural') {
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=pt-BR&client=tw-ob`;
        this.audioElement.src = url;
        this.audioElement.playbackRate = currentRate;
        this.audioElement.play().catch(() => {
          this.speakWebSpeech(text, currentRate, currentPitch);
        });
        return;
      } catch (e) {}
    }

    this.speakWebSpeech(text, currentRate, currentPitch);
  }

  speakWebSpeech(text, rate, pitch) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.getAvailableVoices();
    
    let chosen = voices.find(v => v.voiceURI === this.selectedVoiceURI || v.name === this.selectedVoiceURI);
    if (!chosen) {
      chosen = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Luciana') || v.name.includes('Daniel') || v.name.includes('Maria'));
    }

    if (chosen) utterance.voice = chosen;
    utterance.lang = 'pt-BR';
    utterance.rate = rate;
    utterance.pitch = pitch;

    this.synth.speak(utterance);
  }

  previewVoice() {
    this.speak("Olá leitores da nossa escola! Esta é a voz de leitura no Datashow.");
  }

  playTone(freq, type = 'sine', duration = 0.25, gainVal = 0.15) {
    if (this.isMuted) return;
    this.initContext();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playCountBeep(number) {
    const freqs = { 3: 523.25, 2: 659.25, 1: 783.99 };
    const freq = freqs[number] || 523.25;
    this.playTone(freq, 'triangle', 0.3, 0.25);
  }

  playStartFanfare() {
    if (this.isMuted) return;
    this.initContext();

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.45, 0.3);
      }, idx * 100);
    });
  }

  playCardFlip() {
    this.playTone(480, 'sine', 0.1, 0.15);
  }

  playSublevelTransitionSound() {
    if (this.isMuted) return;
    this.initContext();

    const melody = [440.00, 523.25, 659.25, 783.99, 880.00];
    melody.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.2);
      }, idx * 110);
    });
  }

  playVictorySound() {
    if (this.isMuted) return;
    this.initContext();

    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    arpeggio.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.4, 0.25);
      }, idx * 120);
    });
  }

  // --------------------------------------------------
  // 4 TRILHAS SONORAS DISTINTAS E MELODIOSAS (COMPOSIÇÕES REALÍSTICAS)
  // --------------------------------------------------
  setMusicStyle(style) {
    this.currentMusicStyle = style;
    if (this.bgmTimer) {
      this.stopBGM();
      this.startBGM();
    }
  }

  previewBGM() {
    this.initContext();
    this.stopBGM();
    this.startBGM();

    // Toca a música durante 5 segundos para o professor ouvir
    setTimeout(() => {
      this.stopBGM();
    }, 5000);
  }

  startBGM() {
    this.initContext();
    if (this.bgmTimer) clearInterval(this.bgmTimer);
    if (this.currentMusicStyle === 'off') return;

    let melodySeq = [];
    let intervalMs = 400;
    let waveType = 'sine';
    let gainVal = 0.12;

    switch (this.currentMusicStyle) {
      case 'calma':
        // Melodia de Ninar / Lullaby Suave em Fá Maior (Sons Longos e Relaxantes)
        melodySeq = [
          { f: 349.23, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 523.25, d: 1.0 },
          { f: 349.23, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 523.25, d: 1.0 },
          { f: 392.00, d: 0.8 }, { f: 493.88, d: 0.8 }, { f: 587.33, d: 1.0 }
        ];
        intervalMs = 700;
        waveType = 'sine';
        gainVal = 0.08;
        break;

      case 'batuque':
        // Batuque da Floresta (Ritmo Percussivo com Baixo Animado)
        melodySeq = [
          { f: 150.00, d: 0.2 }, { f: 300.00, d: 0.2 }, { f: 220.00, d: 0.2 },
          { f: 150.00, d: 0.2 }, { f: 440.00, d: 0.2 }, { f: 330.00, d: 0.2 }
        ];
        intervalMs = 350;
        waveType = 'triangle';
        gainVal = 0.15;
        break;

      case 'aventura':
        // Aventura Espacial (Marcha Triunfante com Metais/Sintetizador em Sol Maior)
        melodySeq = [
          { f: 392.00, d: 0.4 }, { f: 523.25, d: 0.4 }, { f: 659.25, d: 0.4 }, { f: 783.99, d: 0.6 },
          { f: 659.25, d: 0.4 }, { f: 783.99, d: 0.6 }, { f: 1046.50, d: 0.8 }
        ];
        intervalMs = 450;
        waveType = 'sawtooth';
        gainVal = 0.07;
        break;

      case 'alegre':
      default:
        // Melodia Alegre Pop em Dó Maior (Piano Bright Arpeggios)
        melodySeq = [
          { f: 261.63, d: 0.3 }, { f: 329.63, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 523.25, d: 0.5 },
          { f: 440.00, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 329.63, d: 0.3 }, { f: 261.63, d: 0.5 }
        ];
        intervalMs = 420;
        waveType = 'sine';
        gainVal = 0.12;
        break;
    }

    let step = 0;
    this.bgmTimer = setInterval(() => {
      if (this.isMuted) return;
      const note = melodySeq[step % melodySeq.length];
      this.playTone(note.f, waveType, note.d, gainVal);
      step++;
    }, intervalMs);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
      if (this.synth) this.synth.cancel();
      if (this.audioElement) this.audioElement.pause();
    } else {
      this.startBGM();
    }
    return this.isMuted;
  }
}

const audioMgr = new AudioManager();
