/**
 * DE OLHO NA LISTA - MOTOR COMPLETO DE ESTÚDIO
 * Física Real de Drag & Drop com Clone Flutuante, Narrativa em Cutscene,
 * Sistema de Progressão com Níveis Bloqueados e Modo Criador de Listas.
 */

// --- BANCO DE DADOS DE FASES E NÍVEIS ---
const GAME_CONFIG = {
    cutsceneSteps: [
        {
            text: "Olá! Eu sou o <span class='hl-red'>CALISTO</span>! Meus grandes amigos <span class='hl-red'>ANA</span>, <span class='hl-blue'>JOSÉ</span> e <span class='hl-red'>LUCAS</span> precisam muito da sua ajuda!",
            speech: "Olá! Eu sou o Calisto! Meus grandes amigos Ana, José e Lucas precisam muito da sua ajuda!"
        },
        {
            text: "Eles organizaram listas para seus compromissos, mas um vento forte passou e <span class='hl-red'>EMBARALHOU TODAS AS LISTAS</span> pelo laboratório!",
            speech: "Eles organizaram listas para seus compromissos, mas um vento forte passou e embaralhou todas as listas pelo laboratório!"
        },
        {
            text: "Vamos usar nossa atenção e conhecimento de leitura para <span class='hl-blue'>ORGANIZAR CADA LISTA</span> no lugar certo?",
            speech: "Vamos usar nossa atenção e conhecimento de leitura para organizar cada lista no lugar certo? Vamos lá!"
        }
    ],

    levels: [
        {
            id: 1,
            name: "Entregue as Listas",
            icon: "📋",
            type: "props_association",
            description: "Entregue os suportes certos para Ana, José e Lucas.",
            props: [
                {
                    id: "prop_ana",
                    type: "sheet",
                    targetChar: "ana",
                    lines: ["✓ LÁPIS", "✓ ENVELOPE", "✓ CALCULADORA"]
                },
                {
                    id: "prop_jose",
                    type: "tablet",
                    targetChar: "jose",
                    lines: ["PÃO - MARACUJÁ -", "CARNE"]
                },
                {
                    id: "prop_lucas",
                    type: "phone",
                    targetChar: "lucas",
                    lines: ["• DIVERSÃO", "• VÔLEI", "• LANCHE"]
                },
                {
                    id: "prop_distractor",
                    type: "spiral",
                    targetChar: "none",
                    lines: ["TREM, BONECA,", "ROBÔ"]
                }
            ],
            characters: [
                { id: "ana", name: "ANA", avatar: "👩🏾‍💼", bgClass: "ana" },
                { id: "jose", name: "JOSÉ", avatar: "🧔🏼‍♂️", bgClass: "jose" },
                { id: "lucas", name: "LUCAS", avatar: "👦🏽", bgClass: "lucas" }
            ]
        },
        {
            id: 2,
            name: "Quitanda do José",
            icon: "🍎",
            type: "interactive_list",
            charName: "JOSÉ",
            charAvatar: "🧔🏼‍♂️",
            title: "LISTA DO JOSÉ",
            fixedText: "PÃO - ALHO - FEIJÃO",
            instruction: "Arraste os alimentos da feira para a Lista do José.",
            targetCategory: "alimentos",
            words: [
                { name: "BORRACHA", isCorrect: false },
                { name: "BONECA", isCorrect: false },
                { name: "MAMÃO", isCorrect: true },
                { name: "CAJÁ", isCorrect: true },
                { name: "CHAVE", isCorrect: false },
                { name: "LÁPIS", isCorrect: false },
                { name: "LEITE", isCorrect: true },
                { name: "INGLÊS", isCorrect: false },
                { name: "NATAÇÃO", isCorrect: false }
            ]
        },
        {
            id: 3,
            name: "Mochila da Ana",
            icon: "🎒",
            type: "interactive_list",
            charName: "ANA",
            charAvatar: "👩🏾‍💼",
            title: "LISTA DA ANA",
            fixedText: "CANETA - BORRACHA - APONTADOR",
            instruction: "Arraste os materiais escolares para a Lista da Ana.",
            targetCategory: "material",
            words: [
                { name: "CADERNO", isCorrect: true },
                { name: "PIZZA", isCorrect: false },
                { name: "RÉGUA", isCorrect: true },
                { name: "ESTOJO", isCorrect: true },
                { name: "BOLA", isCorrect: false },
                { name: "SAPATO", isCorrect: false },
                { name: "PIÃO", isCorrect: false },
                { name: "MAÇÃ", isCorrect: false },
                { name: "PIJAMA", isCorrect: false }
            ]
        },
        {
            id: 4,
            name: "Brinquedos do Lucas",
            icon: "🧸",
            type: "interactive_list",
            charName: "LUCAS",
            charAvatar: "👦🏽",
            title: "LISTA DO LUCAS",
            fixedText: "CARRINHO - BOLA - ROBO",
            instruction: "Arraste os brinquedos e jogos para a Lista do Lucas.",
            targetCategory: "brinquedos",
            words: [
                { name: "PIÃO", isCorrect: true },
                { name: "CEBOLA", isCorrect: false },
                { name: "PATINETE", isCorrect: true },
                { name: "MARTELO", isCorrect: false },
                { name: "BONECA", isCorrect: true },
                { name: "SABONETE", isCorrect: false },
                { name: "PENTE", isCorrect: false },
                { name: "GARFO", isCorrect: false },
                { name: "TOALHA", isCorrect: false }
            ]
        }
    ],

    creatorThemes: {
        frutas: {
            title: "LISTA DE FRUTAS",
            words: ["BANANA", "UVA", "MORANGO", "LARANJA", "ABACAXI", "MELANCIA", "CADERNO", "CHAVE", "SAPATO"]
        },
        escola: {
            title: "LISTA ESCOLAR",
            words: ["LÁPIS", "MOCHILA", "TESOURA", "COLA", "LIVRO", "CANETA", "PIZZA", "BONECA", "MARTELO"]
        },
        animais: {
            title: "LISTA DE BICHINHOS",
            words: ["GATO", "CACHORRO", "COELHO", "LEÃO", "PATO", "CAVALO", "CELULAR", "CADEIRA", "MEIA"]
        }
    }
};

// --- MOTOR DE ÁUDIO SINTETIZADO WEB AUDIO API ---
class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    playGrab() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playSnap() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playSuccess() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.28, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.22);
        });
    }

    playError() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    playVictory() {
        this.init();
        if (!this.ctx) return;
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
            setTimeout(() => {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.35);
            }, idx * 120);
        });
    }

    speak(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'pt-BR';
        utter.rate = 0.95;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
    }
}

// --- MOTOR DE CONFETES ---
class ConfettiEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animId = null;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.particles = [];
        const colors = ['#f59e0b', '#10b981', '#38bdf8', '#ec4899', '#8b5cf6', '#ef4444'];
        for (let i = 0; i < 90; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 + 3.5,
                rotation: Math.random() * 360,
                vRot: Math.random() * 6 - 3
            });
        }
        if (!this.animId) this.loop();
    }

    stop() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let hasVisible = false;
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.vRot;
            if (p.y < this.canvas.height + 20) hasVisible = true;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        });

        if (hasVisible) {
            this.animId = requestAnimationFrame(() => this.loop());
        } else {
            this.stop();
        }
    }
}

// --- CLASSE PRINCIPAL DO JOGO ---
class DeOlhoNaListaGame {
    constructor() {
        this.sound = new SoundEngine();
        this.confetti = new ConfettiEngine('confetti-canvas');
        
        // Estado de Progresso Persistente
        this.unlockedLevel = parseInt(localStorage.getItem('deOlhoNaLista_unlocked') || '1', 10);
        this.starsMap = JSON.parse(localStorage.getItem('deOlhoNaLista_stars') || '{"1":0,"2":0,"3":0,"4":0}');
        this.creatorUnlocked = localStorage.getItem('deOlhoNaLista_creator') === 'true';

        this.currentLevelIdx = 0;
        this.currentCutsceneStep = 0;

        // Stage 1 State
        this.stage1Assignments = { ana: null, jose: null, lucas: null };

        // Stage Interactive State
        this.interactivePlacedWords = [null, null, null];

        this.initDOM();
        this.bindEvents();
        this.updateStarsDisplay();
    }

    initDOM() {
        this.viewMenu = document.getElementById('view-menu');
        this.viewLevelsMap = document.getElementById('view-levels-map');
        this.viewCutscene = document.getElementById('view-cutscene');
        this.viewStage1 = document.getElementById('view-stage1');
        this.viewStageInteractive = document.getElementById('view-stage-interactive');
        this.viewCreator = document.getElementById('view-creator');
        this.modalFeedback = document.getElementById('modal-feedback');

        this.btnTopMenu = document.getElementById('btn-top-menu');
        this.btnStartAdventure = document.getElementById('btn-start-adventure');
        this.btnCreatorMode = document.getElementById('btn-creator-mode');
        this.btnCutsceneNext = document.getElementById('btn-cutscene-next');
        this.btnBackToMain = document.getElementById('btn-back-to-main');
        this.btnConfirmStage1 = document.getElementById('btn-confirm-stage1');
        this.btnConfirmInteractive = document.getElementById('btn-confirm-interactive');
        this.btnFeedbackAction = document.getElementById('btn-feedback-action');
        this.btnCreatorBack = document.getElementById('btn-creator-back');
    }

    bindEvents() {
        this.btnTopMenu.addEventListener('click', () => {
            this.sound.playSnap();
            this.showView(this.viewMenu);
        });

        this.btnStartAdventure.addEventListener('click', () => {
            this.sound.playSnap();
            // If never played, start with cutscene. Otherwise go to Level Map!
            if (this.unlockedLevel === 1 && this.starsMap['1'] === 0) {
                this.startCutscene();
            } else {
                this.showLevelsMap();
            }
        });

        this.btnCreatorMode.addEventListener('click', () => {
            if (this.creatorUnlocked) {
                this.sound.playSnap();
                this.startCreatorMode();
            } else {
                this.sound.playError();
                this.sound.speak("Complete todas as 4 fases do Desafio das Listas para desbloquear o Criador!");
            }
        });

        this.btnBackToMain.addEventListener('click', () => {
            this.sound.playSnap();
            this.showView(this.viewMenu);
        });

        this.btnCutsceneNext.addEventListener('click', () => {
            this.nextCutsceneStep();
        });

        this.btnConfirmStage1.addEventListener('click', () => {
            this.validateStage1();
        });

        this.btnConfirmInteractive.addEventListener('click', () => {
            this.validateInteractiveStage();
        });

        this.btnFeedbackAction.addEventListener('click', () => {
            this.modalFeedback.classList.remove('active');
            this.confetti.stop();
            this.showLevelsMap();
        });

        this.btnCreatorBack.addEventListener('click', () => {
            this.sound.playSnap();
            this.showView(this.viewMenu);
        });

        // Theme buttons in Creator Mode
        document.querySelectorAll('.creator-theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.creator-theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.sound.playSnap();
                this.loadCreatorTheme(btn.dataset.theme);
            });
        });

        const unlockAudio = () => {
            this.sound.init();
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('pointerdown', unlockAudio);
        };
        window.addEventListener('touchstart', unlockAudio, { passive: true });
        window.addEventListener('pointerdown', unlockAudio, { passive: true });
    }

    showView(view) {
        document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
        view.classList.add('active');
        this.updateStarsDisplay();
    }

    updateStarsDisplay() {
        let totalStars = 0;
        for (let i = 1; i <= 4; i++) {
            if (this.starsMap[String(i)] > 0) totalStars++;
            const starEl = document.getElementById(`star-${i}`);
            if (starEl) {
                if (this.starsMap[String(i)] > 0) starEl.classList.add('filled');
                else starEl.classList.remove('filled');
            }
        }

        if (this.creatorUnlocked) {
            this.btnCreatorMode.classList.add('unlocked');
            this.btnCreatorMode.innerHTML = `<span>🎨</span> CRIADOR DE LISTAS`;
        }
    }

    // ==========================================
    // NARRATIVA / CUTSCENE
    // ==========================================
    startCutscene() {
        this.currentCutsceneStep = 0;
        this.showView(this.viewCutscene);
        this.renderCutsceneStep();
    }

    renderCutsceneStep() {
        const step = GAME_CONFIG.cutsceneSteps[this.currentCutsceneStep];
        document.getElementById('cutscene-text').innerHTML = step.text;
        this.sound.speak(step.speech);
    }

    nextCutsceneStep() {
        this.sound.playSnap();
        this.currentCutsceneStep++;
        if (this.currentCutsceneStep < GAME_CONFIG.cutsceneSteps.length) {
            this.renderCutsceneStep();
        } else {
            // Cutscene finished -> Start Stage 1!
            this.loadLevel(0);
        }
    }

    // ==========================================
    // MAPA DE FASES
    // ==========================================
    showLevelsMap() {
        this.showView(this.viewLevelsMap);
        const grid = document.getElementById('levels-grid');
        grid.innerHTML = '';

        GAME_CONFIG.levels.forEach((lvl, idx) => {
            const isCompleted = this.starsMap[String(lvl.id)] > 0;
            const isAvailable = lvl.id <= this.unlockedLevel;

            let statusClass = 'locked';
            let statusText = '🔒 Bloqueado';

            if (isCompleted) {
                statusClass = 'completed';
                statusText = '⭐ Concluído!';
            } else if (isAvailable) {
                statusClass = 'available';
                statusText = '▶ Jogar!';
            }

            const card = document.createElement('div');
            card.className = `level-card ${statusClass}`;
            card.innerHTML = `
                <div class="level-badge">${lvl.id}</div>
                <div style="font-size: 2rem;">${lvl.icon}</div>
                <div class="level-name">${lvl.name}</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #475569;">${statusText}</div>
            `;

            if (isAvailable) {
                card.addEventListener('click', () => {
                    this.sound.playSnap();
                    this.loadLevel(idx);
                });
            }

            grid.appendChild(card);
        });
    }

    loadLevel(index) {
        this.currentLevelIdx = index;
        const levelData = GAME_CONFIG.levels[index];

        if (levelData.type === 'props_association') {
            this.startStage1(levelData);
        } else {
            this.startInteractiveStage(levelData);
        }
    }

    // ==========================================
    // FASE 1: ENTREGUE AS LISTAS AOS PERSONAGENS
    // ==========================================
    startStage1(levelData) {
        this.showView(this.viewStage1);
        this.stage1Assignments = { ana: null, jose: null, lucas: null };
        this.btnConfirmStage1.classList.remove('active');
        this.sound.speak("Entregue as listas corretas para Ana, José e Lucas.");

        const propsArea = document.getElementById('stage1-props-area');
        propsArea.innerHTML = '';

        levelData.props.forEach(prop => {
            const el = document.createElement('div');
            el.className = `list-prop prop-${prop.type}`;
            el.id = prop.id;
            el.innerHTML = prop.lines.map(l => `<div>${l}</div>`).join('');

            this.attachTruePointerDrag(el, {
                onDragStart: () => {
                    this.sound.playGrab();
                },
                onDrop: (dropTarget) => {
                    const charCard = dropTarget ? dropTarget.closest('.character-target-card') : null;
                    if (charCard) {
                        const charId = charCard.dataset.charId;
                        this.assignPropToCharacter(el, prop, charId);
                    }
                },
                onTap: () => {
                    const emptyCharId = Object.keys(this.stage1Assignments).find(k => !this.stage1Assignments[k]);
                    if (emptyCharId) {
                        this.assignPropToCharacter(el, prop, emptyCharId);
                    }
                }
            });

            propsArea.appendChild(el);
        });

        const targetsCol = document.getElementById('stage1-targets-column');
        targetsCol.innerHTML = '';

        levelData.characters.forEach(char => {
            const card = document.createElement('div');
            card.className = 'character-target-card';
            card.dataset.charId = char.id;
            card.innerHTML = `
                <div class="char-info-col">
                    <div class="char-label">${char.name}</div>
                    <div class="char-avatar-small ${char.bgClass}">${char.avatar}</div>
                </div>
                <div class="character-drop-box" id="drop-box-${char.id}">
                    Solte a lista aqui
                </div>
            `;
            targetsCol.appendChild(card);
        });
    }

    assignPropToCharacter(propElement, propData, charId) {
        this.sound.playSnap();
        this.stage1Assignments[charId] = propData;

        const dropBox = document.getElementById(`drop-box-${charId}`);
        dropBox.classList.add('filled');
        dropBox.innerHTML = `
            <div style="font-size: 0.88rem; font-weight: 800; color: #065f46;">
                ${propData.lines[0]} ✅
            </div>
        `;

        propElement.style.display = 'none';

        const filledCount = Object.values(this.stage1Assignments).filter(Boolean).length;
        if (filledCount >= 3) {
            this.btnConfirmStage1.classList.add('active');
            this.sound.speak("Agora clique em Confirmar!");
        }
    }

    validateStage1() {
        if (!this.btnConfirmStage1.classList.contains('active')) return;

        const isAnaOk = this.stage1Assignments.ana && this.stage1Assignments.ana.targetChar === 'ana';
        const isJoseOk = this.stage1Assignments.jose && this.stage1Assignments.jose.targetChar === 'jose';
        const isLucasOk = this.stage1Assignments.lucas && this.stage1Assignments.lucas.targetChar === 'lucas';

        if (isAnaOk && isJoseOk && isLucasOk) {
            this.sound.playSuccess();
            this.confetti.start();
            this.completeLevel(1);
            this.showFeedbackModal("MUITO BEM!", "Você entregou as listas certas para Ana, José e Lucas!", "PRÓXIMO NÍVEL");
        } else {
            this.sound.playError();
            this.sound.speak("Ops! Alguma lista foi entregue para a pessoa errada. Tente novamente!");
            setTimeout(() => {
                this.startStage1(GAME_CONFIG.levels[0]);
            }, 1200);
        }
    }

    // ==========================================
    // FASES 2, 3 E 4: COMPLETE A LISTA NO DISPOSITIVO
    // ==========================================
    startInteractiveStage(levelData) {
        this.showView(this.viewStageInteractive);
        this.currentInteractiveLevel = levelData;
        this.interactivePlacedWords = [null, null, null];
        this.btnConfirmInteractive.classList.remove('active');

        document.getElementById('interactive-char-avatar').textContent = levelData.charAvatar;
        document.getElementById('interactive-list-title').textContent = levelData.title;
        document.getElementById('interactive-fixed-items').textContent = levelData.fixedText;
        this.sound.speak(`${levelData.instruction}`);

        const wordsGrid = document.getElementById('interactive-words-grid');
        wordsGrid.innerHTML = '';

        levelData.words.forEach((wordObj, idx) => {
            const pill = document.createElement('div');
            pill.className = 'word-pill';
            pill.id = `pill-${idx}`;
            pill.textContent = wordObj.name;

            this.attachTruePointerDrag(pill, {
                onDragStart: () => {
                    this.sound.playGrab();
                    this.sound.speak(wordObj.name);
                },
                onDrop: (dropTarget) => {
                    const slot = dropTarget ? dropTarget.closest('.tablet-slot') : null;
                    if (slot) {
                        const slotIdx = parseInt(slot.dataset.slotIndex, 10);
                        this.placeInteractiveWord(pill, wordObj, slotIdx);
                    }
                },
                onTap: () => {
                    this.sound.speak(wordObj.name);
                    const emptySlotIdx = this.interactivePlacedWords.findIndex(w => w === null);
                    if (emptySlotIdx !== -1) {
                        this.placeInteractiveWord(pill, wordObj, emptySlotIdx);
                    }
                }
            });

            wordsGrid.appendChild(pill);
        });

        const slotsRow = document.getElementById('interactive-drop-slots');
        slotsRow.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'tablet-slot';
            slot.dataset.slotIndex = i;
            slot.id = `interactive-slot-${i}`;
            slot.textContent = `[ ______ ]`;
            slotsRow.appendChild(slot);
        }
    }

    placeInteractiveWord(pillElement, wordObj, slotIdx) {
        this.sound.playSnap();
        this.interactivePlacedWords[slotIdx] = wordObj;

        const slot = document.getElementById(`interactive-slot-${slotIdx}`);
        slot.classList.add('filled');
        slot.textContent = wordObj.name;

        pillElement.style.display = 'none';

        const filledCount = this.interactivePlacedWords.filter(Boolean).length;
        if (filledCount >= 3) {
            this.btnConfirmInteractive.classList.add('active');
            this.sound.speak("Agora clique em Confirmar!");
        }
    }

    validateInteractiveStage() {
        if (!this.btnConfirmInteractive.classList.contains('active')) return;

        const allCorrect = this.interactivePlacedWords.every(w => w && w.isCorrect);

        if (allCorrect) {
            this.sound.playSuccess();
            this.confetti.start();
            const lvlId = this.currentInteractiveLevel.id;
            this.completeLevel(lvlId);

            if (lvlId === 4) {
                this.sound.playVictory();
                this.creatorUnlocked = true;
                localStorage.setItem('deOlhoNaLista_creator', 'true');
                this.showFeedbackModal("PARABÉNS! VOCÊ VENCEU!", "Você organizou todas as listas do jogo e desbloqueou o Criador de Listas!", "VER MAPA");
            } else {
                this.showFeedbackModal("EXCELENTE!", `Você completou a ${this.currentInteractiveLevel.title} com sucesso!`, "PRÓXIMO NÍVEL");
            }
        } else {
            this.sound.playError();
            this.sound.speak("Alguma palavra não combina com esta lista. Tente novamente!");
            setTimeout(() => {
                this.startInteractiveStage(this.currentInteractiveLevel);
            }, 1200);
        }
    }

    completeLevel(lvlId) {
        this.starsMap[String(lvlId)] = 1;
        if (this.unlockedLevel <= lvlId && lvlId < 4) {
            this.unlockedLevel = lvlId + 1;
        }
        localStorage.setItem('deOlhoNaLista_unlocked', String(this.unlockedLevel));
        localStorage.setItem('deOlhoNaLista_stars', JSON.stringify(this.starsMap));
        this.updateStarsDisplay();
    }

    // ==========================================
    // MODO ESPECIAL: CRIADOR DE LISTAS
    // ==========================================
    startCreatorMode() {
        this.showView(this.viewCreator);
        this.loadCreatorTheme('frutas');
    }

    loadCreatorTheme(themeKey) {
        const theme = GAME_CONFIG.creatorThemes[themeKey];
        document.getElementById('creator-list-title').textContent = theme.title;

        const wordsGrid = document.getElementById('creator-words-grid');
        wordsGrid.innerHTML = '';

        const slotsRow = document.getElementById('creator-drop-slots');
        slotsRow.innerHTML = '';

        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'tablet-slot';
            slot.dataset.slotIndex = i;
            slot.textContent = `[ ______ ]`;
            slotsRow.appendChild(slot);
        }

        theme.words.forEach((word, idx) => {
            const pill = document.createElement('div');
            pill.className = 'word-pill';
            pill.id = `creator-pill-${idx}`;
            pill.textContent = word;

            this.attachTruePointerDrag(pill, {
                onDragStart: () => {
                    this.sound.playGrab();
                    this.sound.speak(word);
                },
                onDrop: (dropTarget) => {
                    const slot = dropTarget ? dropTarget.closest('.tablet-slot') : null;
                    if (slot && !slot.classList.contains('filled')) {
                        this.sound.playSnap();
                        slot.classList.add('filled');
                        slot.textContent = word;
                        pill.style.display = 'none';
                    }
                },
                onTap: () => {
                    this.sound.speak(word);
                    const emptySlot = document.querySelector('#creator-drop-slots .tablet-slot:not(.filled)');
                    if (emptySlot) {
                        this.sound.playSnap();
                        emptySlot.classList.add('filled');
                        emptySlot.textContent = word;
                        pill.style.display = 'none';
                    }
                }
            });

            wordsGrid.appendChild(pill);
        });
    }

    showFeedbackModal(title, desc, actionText) {
        document.getElementById('feedback-title').textContent = title;
        document.getElementById('feedback-desc').textContent = desc;
        this.btnFeedbackAction.textContent = actionText;
        this.modalFeedback.classList.add('active');
    }

    // =======================================================
    // MOTOR DE DRAG & DROP POINTER COM CLONE FLUTUANTE REAL
    // =======================================================
    attachTruePointerDrag(element, callbacks = {}) {
        let isDragging = false;
        let ghost = null;
        let startX = 0;
        let startY = 0;
        let hasMoved = false;
        let currentDropOver = null;

        const onPointerDown = (e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;

            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;

            // Criar clone flutuante no body
            ghost = element.cloneNode(true);
            ghost.classList.add('drag-ghost-floating');
            ghost.style.left = `${e.clientX}px`;
            ghost.style.top = `${e.clientY}px`;
            ghost.style.width = `${element.offsetWidth}px`;
            ghost.style.height = `${element.offsetHeight}px`;
            ghost.style.display = 'none';
            document.body.appendChild(ghost);

            element.setPointerCapture(e.pointerId);
            if (callbacks.onDragStart) callbacks.onDragStart();
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (Math.hypot(dx, dy) > 6) {
                hasMoved = true;
                if (ghost) {
                    ghost.style.display = 'flex';
                    ghost.style.left = `${e.clientX}px`;
                    ghost.style.top = `${e.clientY}px`;
                }
                element.classList.add('item-origin-hidden');

                // Detecção de colisão matemática com bounding box
                const x = e.clientX;
                const y = e.clientY;

                const dropZones = document.querySelectorAll('.character-target-card, .character-drop-box, .tablet-slot, .desk-panel');
                let foundZone = null;

                for (const zone of dropZones) {
                    const rect = zone.getBoundingClientRect();
                    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                        foundZone = zone;
                        break;
                    }
                }

                if (currentDropOver && currentDropOver !== foundZone) {
                    currentDropOver.classList.remove('drag-over');
                }

                if (foundZone) {
                    foundZone.classList.add('drag-over');
                    currentDropOver = foundZone;
                } else {
                    currentDropOver = null;
                }
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;

            try { element.releasePointerCapture(e.pointerId); } catch(err) {}

            element.classList.remove('item-origin-hidden');

            if (ghost && ghost.parentNode) {
                ghost.parentNode.removeChild(ghost);
                ghost = null;
            }

            if (currentDropOver) {
                currentDropOver.classList.remove('drag-over');
            }

            if (hasMoved) {
                const x = e.clientX;
                const y = e.clientY;

                const dropZones = document.querySelectorAll('.character-target-card, .character-drop-box, .tablet-slot');
                let targetZone = null;

                for (const zone of dropZones) {
                    const rect = zone.getBoundingClientRect();
                    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                        targetZone = zone;
                        break;
                    }
                }

                if (callbacks.onDrop) callbacks.onDrop(targetZone);
            } else {
                if (callbacks.onTap) callbacks.onTap();
            }
        };

        const onPointerCancel = () => {
            isDragging = false;
            element.classList.remove('item-origin-hidden');
            if (ghost && ghost.parentNode) {
                ghost.parentNode.removeChild(ghost);
                ghost = null;
            }
            if (currentDropOver) currentDropOver.classList.remove('drag-over');
        };

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointermove', onPointerMove);
        element.addEventListener('pointerup', onPointerUp);
        element.addEventListener('pointercancel', onPointerCancel);
    }
}

// Inicializar após carregamento
window.addEventListener('DOMContentLoaded', () => {
    window.game = new DeOlhoNaListaGame();
});
