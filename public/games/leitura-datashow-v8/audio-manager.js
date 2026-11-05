/**
 * AudioManager v8.0 Professional - Trilha Sonora Instrumental de Alta Qualidade (MP3)
 * Totalmente desacoplado de sintetizadores 8-bit e sem vozes robóticas (TTS).
 */

class AudioManager {
  constructor() {
    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.25; // Volume ambiente confortável para a sala
    this.isMuted = false;
    this.currentTrack = 'assets/reading-theme.mp3';

    // Desbloqueio seguro de áudio no primeiro clique do professor ou aluno
    const unlock = () => {
      this.initBGM();
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  initBGM() {
    if (!this.bgmAudio.src || this.bgmAudio.src === '') {
      this.bgmAudio.src = this.currentTrack;
    }
  }

  playBGM() {
    if (this.isMuted) return;
    this.initBGM();
    this.bgmAudio.play().catch(e => {
      console.log('Autoplay aguardando interação do usuário.');
    });
  }

  pauseBGM() {
    this.bgmAudio.pause();
  }

  toggleBGM() {
    if (this.bgmAudio.paused) {
      this.playBGM();
      return true;
    } else {
      this.pauseBGM();
      return false;
    }
  }

  setVolume(val) {
    const v = Math.max(0, Math.min(1, parseFloat(val)));
    this.bgmAudio.volume = v;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.pauseBGM();
    } else {
      this.playBGM();
    }
    return !this.isMuted;
  }

  // Sons de feedback sutis e polidos (sem 8-bit estridente)
  playCelebration() {
    if (this.isMuted) return;
    // Celebração suave usando sino melódico
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; // Senoide suave e aveludada
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.6);
      });
    } catch(e) {}
  }
}

window.audioManager = new AudioManager();
