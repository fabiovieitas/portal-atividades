/* ==========================================================================
   O MISTÉRIO DO LABORATÓRIO SECRETO — LAB KIDS (100% MATEMÁTICA)
   Motor de Jogo: 4 Operações, Situações-Problema, Pontuação e Votação
   ========================================================================== */

class EscapeMathKidsQuest {
  constructor() {
    this.soundEnabled = true;
    this.audioCtx = null;

    // Cronômetro e Pontuação
    this.totalSeconds = 45 * 60; // 45 minutos regressivos
    this.elapsedSeconds = 0;
    this.roomStartTime = 0;
    this.timerInterval = null;
    this.isPaused = false;
    this.totalScore = 0; // XP Alquímico

    // Estado das Salas e Selos
    this.currentRoom = 0;
    this.unlockedEnvelopes = { 1: false, 2: false, 3: false, 4: false, 5: false };

    // Respostas Selecionadas pelo Aluno
    this.selectedFase1 = null;
    this.selectedFase2 = null;
    this.selectedFase3 = null;
    this.selectedFase5 = null;

    // Dicas do Robô (3 por fase)
    this.hints = {
      1: [
        "🤖 Bip-bop! Primeiro calcule o total de tubos que tínhamos: 45 azuis + 38 vermelhos = 83 tubos.",
        "🤖 Agora retire os 19 tubos que quebraram: 83 − 19.",
        "🤖 Pense assim: 83 − 20 seria 63. Como é menos 19, sobram exatamente 64 tubos intactos!"
      ],
      2: [
        "🤖 Em cada caixa há 7 cristais azuis e 5 dourados: 7 + 5 = 12 cristais por caixa!",
        "🤖 Como são 8 caixas no total, fazemos a multiplicação: 8 caixas × 12 cristais.",
        "🤖 8 × 10 = 80 e 8 × 2 = 16. Somando tudo: 80 + 16 = 96 cristais mágicos!"
      ],
      3: [
        "🤖 Temos 240 ml no caldeirão para dividir igualmente em 6 cilindros.",
        "🤖 Lembre-se da tabuada do 6: qual número multiplicado por 6 dá 24?",
        "🤖 6 × 4 = 24! Logo, 240 ÷ 6 = 40 ml em cada cilindro!"
      ],
      4: [
        "🤖 150 + 275: some 100 + 200 = 300; 50 + 75 = 125 ➔ Total: 425!",
        "🤖 500 − 185: 500 − 100 = 400; 400 − 85 = 315!",
        "🤖 Multiplicação: 9 × 7 = 63. E na divisão: 72 ÷ 8 = 9 (porque 9 × 8 = 72)!"
      ],
      5: [
        "🤖 No prato esquerdo há 4 frascos + 30 g. No prato direito há 150 g.",
        "🤖 Se tirarmos 30 g dos dois lados: os 4 frascos pesam juntos 150 − 30 = 120 gramas!",
        "🤖 Agora divida igualmente: 120 ÷ 4 frascos = 30 gramas cada frasco!"
      ]
    };
    this.hintCounters = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Canvas
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
  }

  init() {
    this.initAudio();
    this.initCanvas();
    this.setupFinalVaultInput();
  }

  setupFinalVaultInput() {
    const el = document.getElementById('final-vault-input');
    if (el) {
      el.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
      });
    }
  }

  /* ==================== WEB AUDIO API ==================== */
  initAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    } catch (e) {}
  }

  resumeAudio() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'seal' || type === 'success') {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'victory') {
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.12);
        gain.gain.setValueAtTime(0.25, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.8);
      });
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('btn-sound-hud');
    if (btn) btn.innerText = this.soundEnabled ? '🔊' : '🔇';
    if (this.soundEnabled) this.playSound('click');
  }

  /* ==================== CRONÔMETRO & PONTUAÇÃO ==================== */
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        if (this.totalSeconds > 0) this.totalSeconds--;
        this.elapsedSeconds++;
        this.renderTimer();
      }
    }, 1000);
    this.renderTimer();
  }

  renderTimer() {
    const mins = Math.floor(this.totalSeconds / 60);
    const secs = this.totalSeconds % 60;
    const formatted = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const el = document.getElementById('hud-timer-val');
    if (el) el.innerText = formatted;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const btn = document.getElementById('btn-pause-toggle');
    if (btn) btn.innerText = this.isPaused ? '▶️ Continuar' : '⏸️';
    this.playSound('click');
  }

  addScore(points) {
    this.totalScore += points;
    const scoreEl = document.getElementById('hud-score-val');
    if (scoreEl) scoreEl.innerText = `⭐ ${this.totalScore.toLocaleString('pt-BR')} XP`;
  }

  /* ==================== TRANSIÇÕES DE TELA ==================== */
  startQuest() {
    this.playSound('seal');
    const opening = document.getElementById('opening-screen');
    const hud = document.getElementById('main-hud-bar');
    const cluesFooter = document.getElementById('conquered-clues-box');

    if (opening) opening.classList.add('hidden');
    if (hud) hud.style.display = 'flex';
    if (cluesFooter) cluesFooter.style.display = 'flex';

    this.startTimer();
    this.goToRoom(1);
  }

  goBackToOpening() {
    this.playSound('click');
    document.querySelectorAll('.room-container').forEach(r => r.classList.remove('active'));
    const opening = document.getElementById('opening-screen');
    const hud = document.getElementById('main-hud-bar');
    const cluesFooter = document.getElementById('conquered-clues-box');

    if (opening) opening.classList.remove('hidden');
    if (hud) hud.style.display = 'none';
    if (cluesFooter) cluesFooter.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToRoom(roomNum) {
    this.playSound('click');
    this.currentRoom = roomNum;
    this.roomStartTime = Date.now();

    document.querySelectorAll('.room-container').forEach(r => r.classList.remove('active'));
    const targetRoom = document.getElementById(`room-${roomNum}`);
    if (targetRoom) targetRoom.classList.add('active');

    // Atualiza stepper
    document.querySelectorAll('#hud-stepper .step-bubble').forEach(b => {
      const step = parseInt(b.getAttribute('data-step'), 10);
      if (step === roomNum) b.classList.add('active');
      else b.classList.remove('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==================== MODAL DE FEEDBACK AMIGÁVEL ==================== */
  showModal(type, title, message, isSpeedy = false, secondsTaken = 0, avatarImg = 'img/robot_scholar.jpg') {
    const modal = document.getElementById('feedback-modal');
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const imgEl = document.getElementById('modal-img');
    const speedBadge = document.getElementById('modal-speed-badge');

    if (titleEl) {
      titleEl.innerText = title;
      titleEl.className = `modal-title ${type}`;
    }
    if (descEl) descEl.innerHTML = message;
    if (imgEl) imgEl.src = avatarImg;

    if (speedBadge) {
      if (isSpeedy) {
        speedBadge.style.display = 'inline-block';
        speedBadge.innerText = `⚡ RESPOSTA RELÂMPAGO! (${secondsTaken}s) +500 BÔNUS`;
      } else {
        speedBadge.style.display = 'none';
      }
    }

    if (modal) modal.classList.add('active');
  }

  closeModal() {
    this.playSound('click');
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.classList.remove('active');
  }

  markEnvelopeUnlocked(roomNum, letter) {
    this.unlockedEnvelopes[roomNum] = true;

    // Calcula tempo e pontos
    const secondsTaken = Math.max(1, Math.round((Date.now() - this.roomStartTime) / 1000));
    const isSpeedy = secondsTaken <= 45;
    const basePts = 1000;
    const speedBonus = isSpeedy ? 500 : 0;
    this.addScore(basePts + speedBonus);

    // Atualiza chip de selo no rodapé
    const chip = document.getElementById(`env-slot-${roomNum}`);
    if (chip) {
      chip.classList.add('unlocked');
      chip.innerHTML = `⭐ Selo ${roomNum}: <strong>${letter}</strong>`;
    }

    // Marca stepper
    const stepEl = document.querySelector(`#hud-stepper .step-bubble[data-step="${roomNum}"]`);
    if (stepEl) stepEl.classList.add('unlocked');

    // Desbloqueia botão de avançar
    const nextBtn = document.getElementById(`btn-next-${roomNum}`);
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.style.opacity = '1';
    }

    return { isSpeedy, secondsTaken };
  }

  /* ==================== SALA 1: ADIÇÃO E SUBTRAÇÃO (64 TUBOS) ==================== */
  selectFase1Opt(btn, val) {
    this.playSound('click');
    document.querySelectorAll('#fase1-options .math-opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selectedFase1 = val;
  }

  checkFase1() {
    if (!this.selectedFase1) {
      this.playSound('error');
      this.showModal('error', 'Escolha uma alternativa!', 'Clique em uma das opções com o número de tubos de ensaio intactos.');
      return;
    }

    // 45 + 38 = 83; 83 - 19 = 64
    if (this.selectedFase1 === 64) {
      this.playSound('seal');
      const { isSpeedy, secondsTaken } = this.markEnvelopeUnlocked(1, 'S');
      this.showModal(
        'success',
        '🎉 Cálculo Perfeito, Jovem Matemático!',
        `Você somou 45 + 38 = 83 e subtraiu os 19 tubos quebrados com maestria!<br><br><strong>Resultado: 64 tubos intactos!</strong><br><br>⭐ <strong>SELO 1 DESBLOQUEADO:</strong> Revelada a letra <strong>"S"</strong>.<br>Avance para a Fase 2!`,
        isSpeedy,
        secondsTaken
      );
    } else {
      this.playSound('error');
      this.showModal(
        'error',
        '🤖 Bip-bop! Atenção ao Cálculo!',
        'Lembre-se: primeiro some 45 + 38 = 83 tubos. Depois subtraia os 19 tubos quebrados (83 − 19)! Consulte a Dica do Robô abaixo e tente outra vez!',
        false,
        0,
        'img/dr_cosmos.jpg'
      );
    }
  }

  /* ==================== SALA 2: MULTIPLICAÇÃO (8 x 12 = 96) ==================== */
  selectFase2Opt(btn, val) {
    this.playSound('click');
    document.querySelectorAll('#fase2-options .math-opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selectedFase2 = val;
  }

  checkFase2() {
    if (!this.selectedFase2) {
      this.playSound('error');
      this.showModal('error', 'Escolha uma alternativa!', 'Clique na opção com a quantidade total de cristais mágicos nas 8 caixas.');
      return;
    }

    // 8 x (7 + 5) = 8 x 12 = 96
    if (this.selectedFase2 === 96) {
      this.playSound('seal');
      const { isSpeedy, secondsTaken } = this.markEnvelopeUnlocked(2, 'A');
      this.showModal(
        'success',
        '⭐ Multiplicação Impecável!',
        `Cada caixa tem 7 + 5 = 12 cristais. Em 8 caixas temos <strong>8 × 12 = 96 cristais</strong>!<br><br>⭐ <strong>SELO 2 DESBLOQUEADO:</strong> Revelada a letra <strong>"A"</strong>.<br>Avance para a Fase 3!`,
        isSpeedy,
        secondsTaken
      );
    } else {
      this.playSound('error');
      this.showModal(
        'error',
        '🤖 Quase lá!',
        'Lembre-se: em cada caixa há 7 + 5 = 12 cristais. Como são 8 caixas, faça 8 × 12! Tente novamente!',
        false,
        0,
        'img/dr_cosmos.jpg'
      );
    }
  }

  /* ==================== SALA 3: DIVISÃO (240 / 6 = 40) ==================== */
  selectFase3Opt(btn, val) {
    this.playSound('click');
    document.querySelectorAll('#fase3-options .math-opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selectedFase3 = val;
  }

  checkFase3() {
    if (!this.selectedFase3) {
      this.playSound('error');
      this.showModal('error', 'Escolha uma alternativa!', 'Clique na opção com a quantidade de ml em cada cilindro.');
      return;
    }

    // 240 / 6 = 40
    if (this.selectedFase3 === 40) {
      this.playSound('seal');
      const { isSpeedy, secondsTaken } = this.markEnvelopeUnlocked(3, 'B');
      this.showModal(
        'success',
        '🧪 Divisão Precisa!',
        `240 ml divididos igualmente entre 6 cilindros dá exatamente <strong>40 ml em cada frasco</strong>!<br><br>⭐ <strong>SELO 3 DESBLOQUEADO:</strong> Revelada a letra <strong>"B"</strong>.<br>Avance para o Terminal do Robô!`,
        isSpeedy,
        secondsTaken
      );
    } else {
      this.playSound('error');
      this.showModal(
        'error',
        '🤖 Cuidado com a Dose!',
        '240 dividido por 6! Lembre-se: 24 ÷ 6 = 4, logo 240 ÷ 6 = 40! Tente novamente!',
        false,
        0,
        'img/dr_cosmos.jpg'
      );
    }
  }

  /* ==================== SALA 4: AS 4 OPERAÇÕES (425, 315, 63, 9) ==================== */
  checkFase4() {
    const a1 = parseInt(document.getElementById('f4-ans1').value, 10);
    const a2 = parseInt(document.getElementById('f4-ans2').value, 10);
    const a3 = parseInt(document.getElementById('f4-ans3').value, 10);
    const a4 = parseInt(document.getElementById('f4-ans4').value, 10);

    if (isNaN(a1) || isNaN(a2) || isNaN(a3) || isNaN(a4)) {
      this.playSound('error');
      this.showModal('error', 'Preencha os 4 campos!', 'Digite o resultado das 4 operações nos visores do terminal.');
      return;
    }

    // 150 + 275 = 425; 500 - 185 = 315; 9 * 7 = 63; 72 / 8 = 9
    if (a1 === 425 && a2 === 315 && a3 === 63 && a4 === 9) {
      this.playSound('seal');
      const { isSpeedy, secondsTaken } = this.markEnvelopeUnlocked(4, 'E');
      this.showModal(
        'success',
        '💻 Terminal Restaurado com Sucesso!',
        `Você dominou as 4 operações:<br>• 150 + 275 = <strong>425</strong><br>• 500 − 185 = <strong>315</strong><br>• 9 × 7 = <strong>63</strong><br>• 72 ÷ 8 = <strong>9</strong><br><br>⭐ <strong>SELO 4 DESBLOQUEADO:</strong> Revelada a letra <strong>"E"</strong>.<br>Avance para o Desafio da Balança!`,
        isSpeedy,
        secondsTaken
      );
    } else {
      this.playSound('error');
      this.showModal(
        'error',
        '🤖 Circuito em Curto!',
        'Algum dos 4 resultados está incorreto! Revise suas contas nos visores e tente novamente.',
        false,
        0,
        'img/dr_cosmos.jpg'
      );
    }
  }

  /* ==================== SALA 5: EQUAÇÃO DA BALANÇA (30 GRAMAS) ==================== */
  selectFase5Opt(btn, val) {
    this.playSound('click');
    document.querySelectorAll('#fase5-options .math-opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selectedFase5 = val;
  }

  checkFase5() {
    if (!this.selectedFase5) {
      this.playSound('error');
      this.showModal('error', 'Escolha uma alternativa!', 'Clique na opção com o peso de cada frasco misterioso.');
      return;
    }

    // 4x + 30 = 150 -> 4x = 120 -> x = 30
    if (this.selectedFase5 === 30) {
      this.playSound('seal');
      const { isSpeedy, secondsTaken } = this.markEnvelopeUnlocked(5, 'R');
      this.showModal(
        'success',
        '⚖️ Equilíbrio Perfeito na Balança!',
        `Se 4 frascos + 30 g = 150 g, então 4 frascos pesam 120 g (120 ÷ 4 = <strong>30 gramas cada</strong>)!<br><br>⭐ <strong>SELO 5 DESBLOQUEADO:</strong> Revelada a letra <strong>"R"</strong>.<br>Você conquistou TODOS os 5 selos! Corra para o Grande Cofre!`,
        isSpeedy,
        secondsTaken
      );
    } else {
      this.playSound('error');
      this.showModal(
        'error',
        '🤖 A Balança Desequilibrou!',
        'Subtraia o peso fixo de 30 g do total de 150 g (150 − 30 = 120 g). Agora divida 120 g pelos 4 frascos iguais! Tente novamente!',
        false,
        0,
        'img/dr_cosmos.jpg'
      );
    }
  }

  /* ==================== SALA 6: O COFRE FINAL ("SABER") ==================== */
  unlockFinalVault() {
    const val = (document.getElementById('final-vault-input').value || '').trim().toUpperCase();

    if (val === 'SABER') {
      this.playSound('victory');
      this.triggerVictory();
    } else {
      this.playSound('error');
      this.showModal(
        'error',
        'Senha Incorreta!',
        'Junte na ordem os 5 selos conquistados nas 5 salas de matemática: <strong>S + A + B + E + R</strong>!',
        false,
        0,
        'img/dr_cosmos.jpg'
      );
    }
  }

  /* ==================== DICAS PROGRESSIVAS ==================== */
  revealHint(roomNum) {
    this.playSound('click');
    if (!this.hints[roomNum]) return;
    const box = document.getElementById(`hint-text-${roomNum}`);
    if (!box) return;

    const count = this.hintCounters[roomNum];
    if (count < this.hints[roomNum].length) {
      box.style.display = 'block';
      box.innerHTML = `<strong>💡 DICA ${count + 1} DE 3:</strong><br>${this.hints[roomNum][count]}`;
      this.hintCounters[roomNum]++;
    }
  }

  /* ==================== VITÓRIA & VOTAÇÃO DO ROBÔ ==================== */
  triggerVictory() {
    clearInterval(this.timerInterval);
    const modal = document.getElementById('victory-modal');
    if (modal) modal.classList.add('active');

    // Atualiza estatísticas finais
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const scoreEl = document.getElementById('v-final-score');
    const timeEl = document.getElementById('v-final-time');
    if (scoreEl) scoreEl.innerText = `${this.totalScore.toLocaleString('pt-BR')} XP`;
    if (timeEl) timeEl.innerText = timeFormatted;

    this.startConfetti();
  }

  castRobotVote(name) {
    this.playSound('seal');
    document.querySelectorAll('.btn-vote-name').forEach(b => b.classList.remove('selected'));
    const clickedBtn = Array.from(document.querySelectorAll('.btn-vote-name')).find(b => b.innerText.includes(name));
    if (clickedBtn) clickedBtn.classList.add('selected');

    localStorage.setItem('labkids_robot_vote', name);

    const toast = document.getElementById('vote-result-box');
    if (toast) {
      toast.style.display = 'block';
      toast.innerHTML = `🎉 Voto computado para <strong>"${name}"</strong>! Ele agora lidera a eleição do Lab Kids com 48% dos votos dos alunos!`;
    }
  }

  submitCustomRobotName() {
    const input = document.getElementById('custom-robot-name-input');
    const customName = (input.value || '').trim();

    if (!customName) {
      this.playSound('error');
      alert('Digite o nome que você quer sugerir antes de votar!');
      return;
    }

    this.playSound('seal');
    localStorage.setItem('labkids_robot_vote', customName);

    const toast = document.getElementById('vote-result-box');
    if (toast) {
      toast.style.display = 'block';
      toast.innerHTML = `🌟 Uau! O nome <strong>"${customName}"</strong> foi enviado para a votação oficial dos alunos com sucesso!`;
    }
    input.value = '';
  }

  restart() {
    location.reload();
  }

  initCanvas() {
    this.canvas = document.getElementById('magic-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startConfetti() {
    if (!this.canvas || !this.ctx) return;
    this.particles = [];
    const colors = ['#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#ffffff'];

    for (let i = 0; i < 220; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 5 + 3,
        rot: Math.random() * 360,
        vRot: Math.random() * 6 - 3
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        if (p.y > this.canvas.height) {
          p.y = -10;
          p.x = Math.random() * this.canvas.width;
        }
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rot * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        this.ctx.restore();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }
}

window.game = new EscapeMathKidsQuest();
window.addEventListener('DOMContentLoaded', () => {
  window.game.init();
});
