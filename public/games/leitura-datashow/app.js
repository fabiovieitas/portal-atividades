/**
 * App.js v9.0 - Descrições Explicativas nos Níveis do Passo 1 e Tipografia Dinâmica no Card
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // ESTADO DA APLICAÇÃO
  // ----------------------------------------------------
  const state = {
    schoolName: localStorage.getItem('datashow_school_name') || 'Monteiro Lobato',
    selectedLevel: 1,
    selectedSublevel: '1.1',
    contentFilter: 'all',
    gameMode: 'cards',
    mode: 'auto-10',
    wordsLimit: '10',
    customSeconds: 7,
    musicStyle: 'alegre',
    autoSublevelAdvance: true,
    showSyllables: true,
    showImage: true,
    isPaused: false,
    
    currentSublevelList: [],
    sublevelListIndex: 0,
    currentDeck: [],
    currentIndex: 0,
    timerId: null,

    buildAssembledSyllables: []
  };

  // ----------------------------------------------------
  // REFERÊNCIAS DO DOM
  // ----------------------------------------------------
  const dom = {
    inputSchoolName: document.getElementById('input-school-name'),
    levelsGridCompact: document.getElementById('levels-grid-compact'),
    
    modalStep2: document.getElementById('modal-step2'),
    modalStep2Title: document.getElementById('modal-step2-title'),
    sublevelsStep2Grid: document.getElementById('sublevels-step2-grid'),
    btnCloseModal2: document.getElementById('btn-close-modal2'),
    btnGotoStep3: document.getElementById('btn-goto-step3'),

    modalStep3: document.getElementById('modal-step3'),
    modalStep3Title: document.getElementById('modal-step3-title'),
    btnCloseModal3: document.getElementById('btn-close-modal3'),
    btnConfirmStart: document.getElementById('btn-confirm-start'),

    selectContentFilter: document.getElementById('select-content-filter'),
    selectVoice: document.getElementById('select-voice'),
    btnPreviewVoice: document.getElementById('btn-preview-voice'),

    selectGameMode: document.getElementById('select-game-mode'),
    selectMode: document.getElementById('select-mode'),
    selectWordsLimit: document.getElementById('select-words-limit'),
    inputCustomSeconds: document.getElementById('input-custom-seconds'),
    selectMusicStyle: document.getElementById('select-music-style'),
    btnPreviewMusic: document.getElementById('btn-preview-music'),
    
    introSchoolName: document.getElementById('intro-school-name'),
    countdownNum: document.getElementById('countdown-num'),
    transPhrase: document.getElementById('trans-phrase'),
    breathLabel: document.getElementById('breath-label'),
    transCountdown: document.getElementById('trans-countdown'),
    
    presLevelTitle: document.getElementById('pres-level-title'),
    presProgressCount: document.getElementById('pres-progress-count'),
    wordCard: document.getElementById('word-card'),
    cardImage: document.getElementById('card-image'),
    cardWordContainer: document.getElementById('card-word-container'),
    cardHint: document.getElementById('card-hint'),

    mascotContainer: document.getElementById('mascot-container'),
    mascotSpeech: document.getElementById('mascot-speech'),
    
    btnPrev: document.getElementById('btn-prev'),
    btnPauseToggle: document.getElementById('btn-pause-toggle'),
    btnStopMenu: document.getElementById('btn-stop-menu'),
    btnTopStop: document.getElementById('btn-top-stop'),
    btnSpeak: document.getElementById('btn-speak'),
    btnSyllable: document.getElementById('btn-syllable'),
    btnImage: document.getElementById('btn-image'),
    btnMusic: document.getElementById('btn-music'),
    btnFullscreen: document.getElementById('btn-fullscreen'),
    btnNext: document.getElementById('btn-next'),
    
    btnRepeatLevel: document.getElementById('btn-repeat-level'),
    btnBackMenu: document.getElementById('btn-back-menu')
  };

  function showScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }
  }

  function clearAllGameTimers() {
    if (state.timerId) { clearTimeout(state.timerId); state.timerId = null; }
    if (state.introTimeout1) { clearTimeout(state.introTimeout1); state.introTimeout1 = null; }
    if (state.introInterval) { clearInterval(state.introInterval); state.introInterval = null; }
    if (state.introTimeout2) { clearTimeout(state.introTimeout2); state.introTimeout2 = null; }
    if (state.transitionInterval) { clearInterval(state.transitionInterval); state.transitionInterval = null; }
    if (state.transitionTimeout) { clearTimeout(state.transitionTimeout); state.transitionTimeout = null; }
  }

  // ----------------------------------------------------
  // INICIALIZAÇÃO
  // ----------------------------------------------------
  function initConfigUI() {
    showScreen('screen-config');
    if (dom.inputSchoolName) dom.inputSchoolName.value = state.schoolName;
    
    renderStep1LevelsGrid();
    populateVoiceDropdown();

    if (dom.inputSchoolName) {
      dom.inputSchoolName.addEventListener('input', (e) => {
        state.schoolName = e.target.value.trim() || 'Escola';
        localStorage.setItem('datashow_school_name', state.schoolName);
      });
    }

    if (dom.selectVoice) {
      dom.selectVoice.addEventListener('change', (e) => {
        if (audioMgr) audioMgr.setVoiceSettings(e.target.value);
      });
    }

    if (dom.btnPreviewVoice) {
      dom.btnPreviewVoice.addEventListener('click', () => {
        if (audioMgr) {
          audioMgr.initContext();
          audioMgr.previewVoice();
        }
      });
    }

    if (dom.btnPreviewMusic) {
      dom.btnPreviewMusic.addEventListener('click', () => {
        if (audioMgr) {
          audioMgr.initContext();
          audioMgr.setMusicStyle(state.musicStyle);
          audioMgr.previewBGM();
        }
      });
    }

    if (dom.selectGameMode) {
      dom.selectGameMode.addEventListener('change', (e) => {
        state.gameMode = e.target.value;
      });
    }

    if (dom.selectMode) {
      dom.selectMode.addEventListener('change', (e) => {
        state.mode = e.target.value;
        if (dom.inputCustomSeconds) dom.inputCustomSeconds.style.display = (state.mode === 'custom') ? 'block' : 'none';
      });
    }

    if (dom.inputCustomSeconds) {
      dom.inputCustomSeconds.addEventListener('input', (e) => {
        state.customSeconds = parseInt(e.target.value) || 5;
      });
    }

    if (dom.selectMusicStyle) {
      dom.selectMusicStyle.addEventListener('change', (e) => {
        state.musicStyle = e.target.value;
        if (audioMgr) audioMgr.setMusicStyle(state.musicStyle);
      });
    }

    if (dom.btnCloseModal2) dom.btnCloseModal2.addEventListener('click', closeStep2Modal);
    if (dom.btnGotoStep3) dom.btnGotoStep3.addEventListener('click', openStep3Modal);
    if (dom.btnCloseModal3) dom.btnCloseModal3.addEventListener('click', closeStep3Modal);
    if (dom.btnConfirmStart) dom.btnConfirmStart.addEventListener('click', window.startIntroSequenceGlobal);
    
    if (dom.btnRepeatLevel) {
      dom.btnRepeatLevel.addEventListener('click', () => {
        window.startIntroSequenceGlobal();
      });
    }

    if (dom.btnBackMenu) dom.btnBackMenu.addEventListener('click', stopAllAndReturnHome);
    if (dom.btnStopMenu) dom.btnStopMenu.addEventListener('click', stopAllAndReturnHome);

    setupControlButtons();
    setupKeyboardShortcuts();
  }

  function populateVoiceDropdown() {
    const voices = audioMgr.getAvailableVoices();
    dom.selectVoice.innerHTML = '<option value="natural" selected>Voz Humana HD (Recomendada)</option>';

    voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voiceURI || voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      dom.selectVoice.appendChild(option);
    });
  }

  // PASSO 1: CARDS DOS NÍVEIS PRINCIPAIS COM DESCRIÇÕES PEDAGÓGICAS EXPLICATIVAS
  function renderStep1LevelsGrid() {
    dom.levelsGridCompact.innerHTML = '';

    const levelDescriptions = {
      1: "Vogais e Sons Primários",
      2: "Sílabas Simples (BA, CA, DA...)",
      3: "Palavras Bisílabas Curtas",
      4: "Palavras Trisílabas",
      5: "Complexas (CH, LH, NH, RR)",
      6: "Encontros Consonantais (PR, TR)",
      7: "Frases Curtas e Ritmo",
      8: "Frases Médias e Pontuação",
      9: "Mini Histórias Ilustradas",
      10: "Trava-Línguas e Fluência"
    };

    Object.keys(WORDS_DATABASE).forEach(lvlNum => {
      const lvlData = WORDS_DATABASE[lvlNum];
      const btn = document.createElement('div');
      btn.className = `level-card-step1 ${state.selectedLevel == lvlNum ? 'active' : ''}`;
      
      const subCount = lvlData.sublevels ? Object.keys(lvlData.sublevels).length : 0;
      const desc = levelDescriptions[lvlNum] || (lvlData.title.split(':')[1] || lvlData.title);

      btn.innerHTML = `
        <span class="level-step1-num">Nível ${lvlNum}</span>
        <span class="level-step1-title">${desc}</span>
        <span class="level-step1-sub">${subCount} Subníveis</span>
      `;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.level-card-step1').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedLevel = parseInt(lvlNum);
        openStep2Modal();
      });

      dom.levelsGridCompact.appendChild(btn);
    });
  }

  function openStep2Modal() {
    dom.modalStep2Title.textContent = `Nível ${state.selectedLevel}: Escolha o Subnível`;
    dom.sublevelsStep2Grid.innerHTML = '';

    const lvlData = WORDS_DATABASE[state.selectedLevel];
    if (!lvlData || !lvlData.sublevels) return;

    const sublevelKeys = Object.keys(lvlData.sublevels);
    if (!sublevelKeys.includes(state.selectedSublevel)) {
      state.selectedSublevel = sublevelKeys[0];
    }

    sublevelKeys.forEach(code => {
      const sub = lvlData.sublevels[code];
      const btn = document.createElement('button');
      btn.className = `sublevel-step2-btn ${state.selectedSublevel === code ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="sublevel-code">Subnível ${code}</span>
        <span class="sublevel-title">${sub.title.split(':')[1] || sub.title} (${sub.items.length} itens)</span>
      `;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.sublevel-step2-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedSublevel = code;
        openStep3Modal();
      });

      dom.sublevelsStep2Grid.appendChild(btn);
    });

    closeStep3Modal();
    dom.modalStep2.style.display = 'flex';
    dom.modalStep2.classList.add('active');
  }

  function closeStep2Modal() {
    dom.modalStep2.classList.remove('active');
    dom.modalStep2.style.display = 'none';
  }

  function openStep3Modal() {
    closeStep2Modal();
    dom.modalStep3Title.textContent = `⚙️ Passo 3: Ajustes da Rodada (Subnível ${state.selectedSublevel})`;
    dom.modalStep3.style.display = 'flex';
    dom.modalStep3.classList.add('active');
  }

  function closeStep3Modal() {
    dom.modalStep3.classList.remove('active');
    dom.modalStep3.style.display = 'none';
  }

  window.startIntroSequenceGlobal = function() {
    if (dom.modalStep2) {
      dom.modalStep2.classList.remove('active');
      dom.modalStep2.style.display = 'none';
    }
    if (dom.modalStep3) {
      dom.modalStep3.classList.remove('active');
      dom.modalStep3.style.display = 'none';
    }

    const selLimit = document.getElementById('select-words-limit');
    if (selLimit) state.wordsLimit = selLimit.value;

    const selImg = document.getElementById('select-show-image');
    if (selImg) state.showImage = (selImg.value === 'yes');

    const selGame = document.getElementById('select-game-mode');
    if (selGame) state.gameMode = selGame.value;

    const selMode = document.getElementById('select-mode');
    if (selMode) state.mode = selMode.value;

    if (window.audioMgr) {
      window.audioMgr.initContext();
    }

    const lvlData = WORDS_DATABASE[state.selectedLevel] || WORDS_DATABASE[1];
    if (lvlData && lvlData.sublevels) {
      state.currentSublevelList = Object.keys(lvlData.sublevels);
      state.sublevelListIndex = state.currentSublevelList.indexOf(state.selectedSublevel);
      if (state.sublevelListIndex === -1) state.sublevelListIndex = 0;
    }

    const targetSub = state.selectedSublevel || (state.currentSublevelList && state.currentSublevelList[0]) || '1.1';
    initSublevelDeck(targetSub);
  };

  function startIntroSequence() {
    window.startIntroSequenceGlobal();
  }

  function playSublevelTransition(nextSublevelCode) {
    showScreen('screen-sublevel-transition');

    const phrases = [
      "Vamos para o próximo nível? Então vamos dar uma respirada...",
      "Que espetáculo de leitura! Vamos respirar fundo para o próximo desafio...",
      "Uau, vocês arrasaram! Dê uma respirada profunda...",
      "Sensacional! Preparados para o próximo subnível? Respirando..."
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    dom.transPhrase.textContent = phrase;
    dom.breathLabel.textContent = "INSPIRANDO...";
    dom.transCountdown.textContent = "8";

    setMascotSpeech("Respirando fundo... 🌬️", "happy");

    audioMgr.playSublevelTransitionSound();
    audioMgr.speak(`${phrase} Vamos respirar.`, 0.82, 1.0);

    let count = 8;
    state.transitionInterval = setInterval(() => {
      count--;
      dom.transCountdown.textContent = count;

      if (count === 4) {
        dom.breathLabel.textContent = "EXPIRANDO...";
      }

      if (count <= 3 && count > 0) {
        dom.breathLabel.textContent = "PREPARAR...";
        audioMgr.playCountBeep(count);
      }

      if (count <= 0) {
        if (state.transitionInterval) { clearInterval(state.transitionInterval); state.transitionInterval = null; }
        dom.transCountdown.textContent = "VAI!";
        audioMgr.playStartFanfare();

        state.transitionTimeout = setTimeout(() => {
          initSublevelDeck(nextSublevelCode);
        }, 800);
      }
    }, 1000);
  }

  function initSublevelDeck(sublevelCode) {
    state.selectedSublevel = sublevelCode;
    state.isPaused = false;
    dom.btnPauseToggle.textContent = '⏸️';

    showScreen('screen-presentation');

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    audioMgr.setMusicStyle(state.musicStyle);
    audioMgr.startBGM();

    const lvlData = WORDS_DATABASE[state.selectedLevel];
    const subData = lvlData.sublevels[sublevelCode];

    let items = [...subData.items];
    shuffleArray(items);

    if (state.wordsLimit && state.wordsLimit !== 'all') {
      const limit = parseInt(state.wordsLimit) || 10;
      items = items.slice(0, limit);
    }

    state.currentDeck = items.length ? items : [...subData.items];

    dom.presLevelTitle.textContent = `Subnível ${sublevelCode}: ${subData.title.split(':')[1] || subData.title}`;
    state.currentIndex = 0;

    setMascotSpeech("Vamos ler juntos! 🦉", "idle");

    renderCurrentCard();
  }

  function renderCurrentCard() {
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }

    if (state.currentIndex >= state.currentDeck.length) {
      handleSublevelCompletion();
      return;
    }

    const item = state.currentDeck[state.currentIndex];
    dom.presProgressCount.textContent = `${state.currentIndex + 1} / ${state.currentDeck.length}`;

    if (state.showImage && item.image) {
      dom.cardImage.textContent = item.image;
      dom.cardImage.style.display = 'block';
    } else {
      dom.cardImage.style.display = 'none';
    }

    dom.cardHint.textContent = item.hint || '';

    if (state.gameMode === 'build') {
      renderBuildSyllableGame(item);
    } else if (state.gameMode === 'flash') {
      renderFlashMemoryGame(item);
    } else if (state.gameMode === 'detetive') {
      renderDetetiveGame(item);
    } else {
      renderStandardCardWord(item);
    }

    dom.wordCard.classList.remove('flip-in');
    void dom.wordCard.offsetWidth;
    dom.wordCard.classList.add('flip-in');
    audioMgr.playCardFlip();

    scheduleNextAutoCard();
  }

  function renderFlashMemoryGame(item) {
    renderStandardCardWord(item);
    setMascotSpeech("Memorize rápido! ⚡", "happy");
    setTimeout(() => {
      if (state.gameMode === 'flash' && dom.cardWordContainer) {
        dom.cardWordContainer.innerHTML = `<div class="word-display" style="color: #fbbf24; cursor: pointer;" onclick="this.innerHTML='${item.text}'">❓ ❓ ❓ (Clique para ver)</div>`;
        setMascotSpeech("Qual era a palavra? Fale em voz alta! 🗣️", "happy");
      }
    }, 1800);
  }

  function renderDetetiveGame(item) {
    dom.cardWordContainer.innerHTML = `<div class="word-display" style="color: #38bdf8; cursor: pointer;" onclick="this.innerHTML='${item.text}'">🕵️ 🔒 [ CLIQUE PARA REVELAR ]</div>`;
    setMascotSpeech("Descubra a palavra pela imagem e dica! 🕵️", "idle");
  }

  function scheduleNextAutoCard() {
    if (state.isPaused) return;

    if (state.gameMode === 'cards' && (state.mode.startsWith('auto-') || state.mode === 'custom')) {
      let seconds = 10;
      if (state.mode.startsWith('auto-accel-')) {
        const startSecs = parseFloat(state.mode.replace('auto-accel-', '')) || 8;
        const step = startSecs <= 5 ? 0.4 : 0.7;
        seconds = Math.max(1.8, startSecs - state.currentIndex * step);
        setMascotSpeech(`⚡ Aceleração! Tempo: ${seconds.toFixed(1)}s 🔥`, "happy");
      } else if (state.mode === 'custom') {
        seconds = state.customSeconds || 7;
      } else {
        seconds = parseInt(state.mode.replace('auto-', '')) || 10;
      }

      state.timerId = setTimeout(() => {
        nextCard();
      }, seconds * 1000);
    }
  }

  function togglePause() {
    state.isPaused = !state.isPaused;
    dom.btnPauseToggle.textContent = state.isPaused ? '▶️' : '⏸️';
    dom.btnPauseToggle.classList.toggle('active', state.isPaused);

    if (state.isPaused) {
      if (state.timerId) {
        clearTimeout(state.timerId);
        state.timerId = null;
      }
      setMascotSpeech("Tempo pausado pelo professor ⏸️", "idle");
    } else {
      setMascotSpeech("Continuando a leitura! 🚀", "happy");
      scheduleNextAutoCard();
    }
  }

  // RENDERIZAR PALAVRA COM TIPOGRAFIA RESPONSIVA DINÂMICA
  function renderStandardCardWord(item) {
    const textLength = item.text.length;
    let sizeClass = 'word-short';

    if (textLength > 15 || item.text.includes(' ')) {
      sizeClass = 'word-long';
    } else if (textLength > 5) {
      sizeClass = 'word-medium';
    }

    dom.cardWordContainer.innerHTML = `<div id="card-word" class="word-display ${sizeClass}"></div>`;
    const cardWordEl = document.getElementById('card-word');

    if (state.showSyllables && item.syllables && item.syllables.length > 0 && textLength <= 15) {
      item.syllables.forEach(syl => {
        const span = document.createElement('span');
        span.className = 'syllable';
        span.textContent = syl;
        cardWordEl.appendChild(span);
      });
    } else {
      cardWordEl.textContent = item.text;
    }
  }

  function renderBuildSyllableGame(item) {
    const syllables = item.syllables || [item.text];
    const shuffledSyllables = [...syllables];
    shuffleArray(shuffledSyllables);

    state.buildAssembledSyllables = [];

    const gameBox = document.createElement('div');
    gameBox.className = 'syllable-game-box';

    const slotsRow = document.createElement('div');
    slotsRow.className = 'assembled-slots-row';
    slotsRow.id = 'assembled-slots-row';
    slotsRow.innerHTML = '<span style="color: #64748b; font-size: 1.5rem;">Clique nas sílabas para montar...</span>';

    const blocksRow = document.createElement('div');
    blocksRow.className = 'shuffled-blocks-row';

    shuffledSyllables.forEach((syl) => {
      const block = document.createElement('button');
      block.className = 'syllable-block';
      block.textContent = syl;

      block.addEventListener('click', () => {
        if (block.classList.contains('used')) return;
        
        block.classList.add('used');
        audioMgr.playTone(550 + (state.buildAssembledSyllables.length * 100), 'sine', 0.15, 0.2);
        
        state.buildAssembledSyllables.push(syl);
        updateAssembledSlots(item, syllables);
      });

      blocksRow.appendChild(block);
    });

    gameBox.appendChild(blocksRow);
    gameBox.appendChild(slotsRow);

    dom.cardWordContainer.innerHTML = '';
    dom.cardWordContainer.appendChild(gameBox);
  }

  function updateAssembledSlots(item, correctSyllables) {
    const slotsRow = document.getElementById('assembled-slots-row');
    if (!slotsRow) return;

    slotsRow.innerHTML = '';
    state.buildAssembledSyllables.forEach(syl => {
      const slot = document.createElement('span');
      slot.className = 'slot-item';
      slot.textContent = syl;
      slotsRow.appendChild(slot);
    });

    if (state.buildAssembledSyllables.length === correctSyllables.length) {
      const isCorrect = state.buildAssembledSyllables.join('') === correctSyllables.join('');

      if (isCorrect) {
        audioMgr.playStartFanfare();
        audioMgr.speak(item.text, 0.82, 1.0);
        setMascotSpeech("Muito bem! Acertaram! 🎉", "happy");
        triggerConfettiBurst(false);

        setTimeout(() => {
          nextCard();
        }, 2500);
      } else {
        audioMgr.playTone(200, 'sawtooth', 0.3, 0.2);
        setMascotSpeech("Ops! Tente novamente... 🦉", "idle");
        
        setTimeout(() => {
          renderCurrentCard();
        }, 1200);
      }
    }
  }

  function setMascotSpeech(text, emotion = "idle") {
    if (dom.mascotSpeech) dom.mascotSpeech.textContent = text;
    if (dom.mascotContainer) {
      dom.mascotContainer.className = `mascot-container ${emotion}`;
    }
  }

  function nextCard() {
    if (state.currentIndex < state.currentDeck.length - 1) {
      state.currentIndex++;
      renderCurrentCard();
    } else {
      handleSublevelCompletion();
    }
  }

  function prevCard() {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      renderCurrentCard();
    }
  }

  function handleSublevelCompletion() {
    if (state.timerId) clearTimeout(state.timerId);

    if (state.autoSublevelAdvance && state.sublevelListIndex < state.currentSublevelList.length - 1) {
      state.sublevelListIndex++;
      const nextCode = state.currentSublevelList[state.sublevelListIndex];
      playSublevelTransition(nextCode);
    } else {
      finishPresentation();
    }
  }

  function finishPresentation() {
    if (state.timerId) clearTimeout(state.timerId);
    showScreen('screen-victory');

    audioMgr.stopBGM();
    audioMgr.playVictorySound();
    
    const victoryMsg = "Parabéns, você terminou com sucesso. Até a próxima!";
    document.getElementById('victory-message').textContent = victoryMsg;
    audioMgr.speak(victoryMsg, 0.82, 1.0);

    triggerFireworksBarrage();
  }

  window.stopAllAndReturnHomeGlobal = function() {
    window.location.reload();
  };

  function stopAllAndReturnHome() {
    window.stopAllAndReturnHomeGlobal();
  }

  function setupControlButtons() {
    if (dom.btnNext) dom.btnNext.addEventListener('click', nextCard);
    if (dom.btnPrev) dom.btnPrev.addEventListener('click', prevCard);
    if (dom.btnPauseToggle) dom.btnPauseToggle.addEventListener('click', togglePause);
    
    if (dom.btnTopStop) dom.btnTopStop.addEventListener('click', stopAllAndReturnHome);
    if (dom.btnStopMenu) dom.btnStopMenu.addEventListener('click', stopAllAndReturnHome);
    if (dom.btnBackMenu) dom.btnBackMenu.addEventListener('click', stopAllAndReturnHome);
    if (dom.btnCloseModal2) dom.btnCloseModal2.addEventListener('click', stopAllAndReturnHome);

    if (dom.btnSpeak) {
      dom.btnSpeak.addEventListener('click', () => {
        const item = state.currentDeck[state.currentIndex];
        if (item && audioMgr) audioMgr.speak(item.text, 0.82, 1.0);
      });
    }

    if (dom.btnSyllable) {
      dom.btnSyllable.addEventListener('click', () => {
        state.showSyllables = !state.showSyllables;
        dom.btnSyllable.classList.toggle('active', state.showSyllables);
        renderCurrentCard();
      });
    }

    if (dom.btnImage) {
      dom.btnImage.addEventListener('click', () => {
        state.showImage = !state.showImage;
        dom.btnImage.classList.toggle('active', state.showImage);
        renderCurrentCard();
      });
    }

    if (dom.btnMusic) {
      dom.btnMusic.addEventListener('click', () => {
        if (audioMgr) {
          const isMuted = audioMgr.toggleMute();
          dom.btnMusic.classList.toggle('active', !isMuted);
        }
      });
    }

    if (dom.btnFullscreen) {
      dom.btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const presScreen = document.getElementById('screen-presentation');
      if (presScreen && presScreen.classList.contains('active')) {
        switch (e.code) {
          case 'Space':
          case 'ArrowRight':
            e.preventDefault();
            nextCard();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            prevCard();
            break;
          case 'KeyP':
            togglePause();
            break;
          case 'KeyS':
            dom.btnSpeak.click();
            break;
          case 'KeyD':
            dom.btnSyllable.click();
            break;
          case 'KeyI':
            dom.btnImage.click();
            break;
          case 'KeyM':
            dom.btnMusic.click();
            break;
          case 'KeyF':
          case 'F11':
            dom.btnFullscreen.click();
            break;
          case 'Escape':
            stopAllAndReturnHome();
            break;
        }
      }
    });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function triggerConfettiBurst(isBig = false) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: isBig ? 150 : 60,
        spread: isBig ? 100 : 70,
        origin: { y: 0.6 }
      });
    }
  }

  function triggerFireworksBarrage() {
    if (typeof confetti !== 'function') return;

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 150 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  initConfigUI();
});
