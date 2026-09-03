/**
 * JOGO ORIGINAL LAB KIDS: SUPER LISTA - MISSÃO ORGANIZAÇÃO
 * Autor: Professor Fábio Vieitas / Lab Kids
 * Motor de Drag & Drop por Pointer Events (Touch / Mouse) & Animações do Robô Bit
 */

const GAME_DATA = {
    // Modo 1: Complete a Lista
    completeList: [
        {
            id: 1,
            title: "Mochila Escolar",
            emoji: "🎒",
            context: "Arraste os materiais escolares para dentro da lista da mochila!",
            fixedItems: [
                { name: "Lápis", emoji: "✏️" },
                { name: "Caderno", emoji: "📓" }
            ],
            targetItems: [
                { name: "Borracha", emoji: "🧼" },
                { name: "Tesoura", emoji: "✂️" },
                { name: "Régua", emoji: "📏" }
            ],
            distractors: [
                { name: "Cenoura", emoji: "🥕" },
                { name: "Martelo", emoji: "🔨" },
                { name: "Boneca", emoji: "🪆" }
            ]
        },
        {
            id: 2,
            title: "Quitanda Saudável",
            emoji: "🍎",
            context: "Arraste as frutas e legumes saudáveis para a lista da feira!",
            fixedItems: [
                { name: "Banana", emoji: "🍌" },
                { name: "Maçã", emoji: "🍎" }
            ],
            targetItems: [
                { name: "Morango", emoji: "🍓" },
                { name: "Cenoura", emoji: "🥕" },
                { name: "Melancia", emoji: "🍉" }
            ],
            distractors: [
                { name: "Sapato", emoji: "👟" },
                { name: "Peteca", emoji: "🪶" },
                { name: "Celular", emoji: "📱" }
            ]
        },
        {
            id: 3,
            title: "Laboratório de Ciências",
            emoji: "🔬",
            context: "Arraste os instrumentos científicos para a bancada do laboratório!",
            fixedItems: [
                { name: "Microscópio", emoji: "🔬" },
                { name: "Lupa", emoji: "🔍" }
            ],
            targetItems: [
                { name: "Ímã", emoji: "🧲" },
                { name: "Tubo de Ensaio", emoji: "🧪" },
                { name: "Termômetro", emoji: "🌡️" }
            ],
            distractors: [
                { name: "Biscoito", emoji: "🍪" },
                { name: "Violão", emoji: "🎸" },
                { name: "Travesseiro", emoji: "🛏️" }
            ]
        },
        {
            id: 4,
            title: "Festa de Aniversário",
            emoji: "🎈",
            context: "Arraste os itens de festa para a lista de comemoração do Lab Kids!",
            fixedItems: [
                { name: "Bolo", emoji: "🎂" },
                { name: "Bexiga", emoji: "🎈" }
            ],
            targetItems: [
                { name: "Brigadeiro", emoji: "🍬" },
                { name: "Vela", emoji: "🕯️" },
                { name: "Presente", emoji: "🎁" }
            ],
            distractors: [
                { name: "Chave", emoji: "🔑" },
                { name: "Pneu", emoji: "🛞" },
                { name: "Escova de Dente", emoji: "🪥" }
            ]
        },
        {
            id: 5,
            title: "Animais da Fazenda",
            emoji: "🐮",
            context: "Arraste os bichinhos que moram na fazendinha para a lista!",
            fixedItems: [
                { name: "Cavalo", emoji: "🐴" },
                { name: "Galinha", emoji: "🐔" }
            ],
            targetItems: [
                { name: "Vaca", emoji: "🐮" },
                { name: "Porco", emoji: "🐷" },
                { name: "Ovelha", emoji: "🐑" }
            ],
            distractors: [
                { name: "Tubarão", emoji: "🦈" },
                { name: "Leão", emoji: "🦁" },
                { name: "Helicóptero", emoji: "🚁" }
            ]
        }
    ],

    // Modo 2: Quem é o Intruso?
    intruders: [
        {
            id: 1,
            title: "Lista de Brinquedos",
            instruction: "Arraste o item que NÃO é um brinquedo até a lixeira do Robô!",
            items: [
                { name: "Bola", emoji: "⚽", isIntruder: false },
                { name: "Carrinho", emoji: "🚗", isIntruder: false },
                { name: "Cebola", emoji: "🧅", isIntruder: true },
                { name: "Boneca", emoji: "🪆", isIntruder: false }
            ]
        },
        {
            id: 2,
            title: "Lista de Frutas",
            instruction: "Arraste o item que NÃO é uma fruta até a lixeira do Robô!",
            items: [
                { name: "Uva", emoji: "🍇", isIntruder: false },
                { name: "Sapato", emoji: "👞", isIntruder: true },
                { name: "Abacaxi", emoji: "🍍", isIntruder: false },
                { name: "Pera", emoji: "🍐", isIntruder: false }
            ]
        },
        {
            id: 3,
            title: "Meios de Transporte",
            instruction: "Arraste o item que NÃO é um meio de transporte até a lixeira!",
            items: [
                { name: "Bicicleta", emoji: "🚲", isIntruder: false },
                { name: "Avião", emoji: "✈️", isIntruder: false },
                { name: "Navio", emoji: "🚢", isIntruder: false },
                { name: "Pente", emoji: "🪮", isIntruder: true }
            ]
        },
        {
            id: 4,
            title: "Peças de Roupas",
            instruction: "Arraste o item que NÃO é uma roupa até a lixeira do Robô!",
            items: [
                { name: "Camiseta", emoji: "👕", isIntruder: false },
                { name: "Martelo", emoji: "🔨", isIntruder: true },
                { name: "Calça", emoji: "👖", isIntruder: false },
                { name: "Meia", emoji: "🧦", isIntruder: false }
            ]
        },
        {
            id: 5,
            title: "Instrumentos Musicais",
            instruction: "Arraste o item que NÃO é um instrumento musical até a lixeira!",
            items: [
                { name: "Violão", emoji: "🎸", isIntruder: false },
                { name: "Bateria", emoji: "🥁", isIntruder: false },
                { name: "Tambor", emoji: "🪘", isIntruder: false },
                { name: "Cadeira", emoji: "🪑", isIntruder: true }
            ]
        }
    ],

    // Modo 3: Ordem Alfabética (A-Z)
    alphabetical: [
        {
            id: 1,
            title: "Trem das Palavras 1",
            instruction: "Arraste as palavras para os vagões na ordem do alfabeto (A - Z):",
            correctOrder: [
                { name: "Abelha", emoji: "🐝" },
                { name: "Bola", emoji: "⚽" },
                { name: "Casa", emoji: "🏠" }
            ]
        },
        {
            id: 2,
            title: "Trem das Palavras 2",
            instruction: "Arraste as palavras para os vagões na ordem do alfabeto (A - Z):",
            correctOrder: [
                { name: "Dado", emoji: "🎲" },
                { name: "Elefante", emoji: "🐘" },
                { name: "Foca", emoji: "🦭" }
            ]
        },
        {
            id: 3,
            title: "Trem das Palavras 3",
            instruction: "Arraste as palavras para os vagões na ordem do alfabeto (A - Z):",
            correctOrder: [
                { name: "Gato", emoji: "🐱" },
                { name: "Jacaré", emoji: "🐊" },
                { name: "Lápis", emoji: "✏️" },
                { name: "Navio", emoji: "🚢" }
            ]
        }
    ]
};

// --- MOTOR DE ÁUDIO SINTETIZADO ---
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
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
    }

    playSnap() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playSuccess() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.07);
            gain.gain.setValueAtTime(0.25, now + i * 0.07);
            gain.gain.linearRampToValueAtTime(0.01, now + i * 0.07 + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.2);
        });
    }

    playError() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.22);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
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
            }, idx * 110);
        });
    }

    speak(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'pt-BR';
        utter.rate = 0.95;
        utter.pitch = 1.1;
        window.speechSynthesis.speak(utter);
    }
}

// --- CONFETTI ENGINE ---
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

// --- CLASSE PRINCIPAL DO JOGO COM DRAG AND DROP REAL ---
class SuperListaGame {
    constructor() {
        this.sound = new SoundEngine();
        this.confetti = new ConfettiEngine('confetti-canvas');
        this.currentMode = null;
        this.currentStageIdx = 0;
        this.score = 0;
        this.filledSlotsCount = 0;
        this.totalSlotsToFill = 0;
        this.activeDraggedCard = null;

        this.initDOM();
        this.bindEvents();
    }

    initDOM() {
        this.screenWelcome = document.getElementById('screen-welcome');
        this.screenMode1 = document.getElementById('screen-mode1');
        this.screenMode2 = document.getElementById('screen-mode2');
        this.screenMode3 = document.getElementById('screen-mode3');
        this.modalVictory = document.getElementById('modal-victory');
        this.scoreDisplay = document.getElementById('score-value');
        this.robotMascot = document.getElementById('robot-bit-mascot');
        this.speechBubble = document.getElementById('mascot-speech');
    }

    bindEvents() {
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                this.sound.playSnap();
                this.startMode(mode);
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

    setRobotState(state, text = '') {
        if (!this.robotMascot) return;
        this.robotMascot.classList.remove('happy', 'watching');
        if (state) this.robotMascot.classList.add(state);
        if (text && this.speechBubble) {
            this.speechBubble.textContent = text;
        }
    }

    showScreen(screen) {
        document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
        this.modalVictory.classList.remove('active');
    }

    addPoints(pts = 100) {
        this.score += pts;
        this.scoreDisplay.textContent = this.score;
    }

    startMode(mode) {
        this.currentMode = mode;
        this.currentStageIdx = 0;

        if (mode === 'complete') {
            this.loadMode1Stage(this.currentStageIdx);
        } else if (mode === 'intruders') {
            this.loadMode2Stage(this.currentStageIdx);
        } else if (mode === 'alphabetical') {
            this.loadMode3Stage(this.currentStageIdx);
        }
    }

    // ==========================================
    // MODO 1: COMPLETE A LISTA (DRAG & DROP REAL)
    // ==========================================
    loadMode1Stage(stageIdx) {
        const stage = GAME_DATA.completeList[stageIdx];
        if (!stage) {
            this.showVictoryModal("Missão Cumprida!", "Você organizou todas as listas com perfeição!");
            return;
        }

        this.showScreen(this.screenMode1);
        this.filledSlotsCount = 0;
        this.totalSlotsToFill = stage.targetItems.length;

        document.getElementById('mode1-title-tag').innerHTML = `${stage.emoji} ${stage.title} (${stageIdx + 1}/${GAME_DATA.completeList.length})`;
        document.getElementById('mode1-notebook-title').innerHTML = `<span>${stage.emoji} Lista de ${stage.title}</span>`;
        this.setRobotState('watching', stage.context);
        this.sound.speak(`${stage.title}. ${stage.context}`);

        // Build Notebook Slots
        const slotsContainer = document.getElementById('mode1-notebook-slots');
        slotsContainer.innerHTML = '';

        // Fixed items
        stage.fixedItems.forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'drop-slot fixed';
            slot.innerHTML = `
                <span class="check-icon">✔</span>
                <span>${item.emoji} ${item.name}</span>
                <button class="btn-speak" title="Ouvir">🔊</button>
            `;
            slot.querySelector('.btn-speak').addEventListener('click', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });
            slotsContainer.appendChild(slot);
        });

        // Target drop zones
        for (let i = 0; i < stage.targetItems.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'drop-slot target-drop-zone';
            slot.dataset.slotIndex = i;
            slot.innerHTML = `
                <span class="check-icon">⏳</span>
                <span class="slot-text" style="color: #94a3b8; font-style: italic;">Arraste um item aqui...</span>
            `;
            slotsContainer.appendChild(slot);
        }

        // Build Draggable Cards
        const poolGrid = document.getElementById('mode1-words-grid');
        poolGrid.innerHTML = '';

        const allItems = [
            ...stage.targetItems.map(i => ({ ...i, isTarget: true })),
            ...stage.distractors.map(i => ({ ...i, isTarget: false }))
        ].sort(() => Math.random() - 0.5);

        allItems.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'draggable-card';
            card.id = `card-m1-${idx}`;
            card.innerHTML = `
                <span>${item.emoji} ${item.name}</span>
                <button class="btn-speak-item" title="Ouvir">🔊</button>
            `;

            card.querySelector('.btn-speak-item').addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });

            // Make Card Truly Draggable with Touch & Pointer API
            this.attachPointerDrag(card, {
                onDragStart: () => {
                    this.sound.playGrab();
                    this.setRobotState('watching', `Arraste ${item.name} para a lista!`);
                },
                onDrop: (dropTarget) => {
                    this.handleMode1Drop(card, item, dropTarget, stage);
                },
                onTap: () => {
                    // Tap-to-place alternative
                    const emptySlot = document.querySelector('.target-drop-zone:not(.filled)');
                    if (emptySlot) {
                        this.handleMode1Drop(card, item, emptySlot, stage);
                    } else {
                        this.sound.speak(item.name);
                    }
                }
            });

            poolGrid.appendChild(card);
        });
    }

    handleMode1Drop(card, item, dropTarget, stage) {
        // Must be dropped on a target slot or notebook area
        const targetSlot = dropTarget ? dropTarget.closest('.target-drop-zone:not(.filled)') : null;

        if (targetSlot && item.isTarget) {
            // SUCCESS SNAP
            this.sound.playSnap();
            this.sound.playSuccess();
            this.setRobotState('happy', `Muito bem! ${item.name} colocado na lista!`);
            this.sound.speak(`${item.name}! Correto!`);
            this.addPoints(100);

            // Fill Slot with Snap Bounce
            targetSlot.classList.add('filled');
            targetSlot.innerHTML = `
                <span class="check-icon">✅</span>
                <span>${item.emoji} ${item.name}</span>
                <button class="btn-speak" title="Ouvir">🔊</button>
            `;
            targetSlot.querySelector('.btn-speak').addEventListener('click', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });

            card.classList.add('hidden-placed');

            this.filledSlotsCount++;
            if (this.filledSlotsCount >= this.totalSlotsToFill) {
                this.sound.playVictory();
                this.confetti.start();
                this.setRobotState('happy', "Sensacional! Lista completada com sucesso!");
                setTimeout(() => {
                    this.currentStageIdx++;
                    this.loadMode1Stage(this.currentStageIdx);
                }, 1600);
            }
        } else {
            // ERROR: Invalid Drop or Wrong Distractor
            this.sound.playError();
            card.classList.add('shake-error');
            setTimeout(() => card.classList.remove('shake-error'), 450);

            if (!item.isTarget) {
                this.setRobotState('', `Ops! ${item.name} não combina com esta lista.`);
                this.sound.speak(`${item.name} não faz parte desta lista.`);
            } else {
                this.setRobotState('', `Solte o item dentro de uma das caixas vazias da lista!`);
            }
        }
    }

    // ==========================================
    // MODO 2: QUEM É O INTRUSO? (DRAG TO TRASH)
    // ==========================================
    loadMode2Stage(stageIdx) {
        const stage = GAME_DATA.intruders[stageIdx];
        if (!stage) {
            this.showVictoryModal("Detetive Mestre!", "Você desintegrou todos os intrusos das listas!");
            return;
        }

        this.showScreen(this.screenMode2);
        document.getElementById('mode2-title-tag').innerHTML = `🕵️ ${stage.title} (${stageIdx + 1}/${GAME_DATA.intruders.length})`;
        this.setRobotState('watching', stage.instruction);
        this.sound.speak(`${stage.title}. ${stage.instruction}`);

        const cardsRow = document.getElementById('mode2-cards-row');
        cardsRow.innerHTML = '';

        stage.items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'intruder-card';
            card.innerHTML = `
                <span class="emoji">${item.emoji}</span>
                <span class="name">${item.name}</span>
                <button class="btn-speak" title="Ouvir">🔊</button>
            `;

            card.querySelector('.btn-speak').addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });

            this.attachPointerDrag(card, {
                onDragStart: () => {
                    this.sound.playGrab();
                    this.setRobotState('watching', `Arraste ${item.name} até a lixeira se for o intruso!`);
                },
                onDrop: (dropTarget) => {
                    const trashZone = dropTarget ? dropTarget.closest('.robot-trash-zone') : null;
                    if (trashZone && item.isIntruder) {
                        // SUCESSO
                        this.sound.playSuccess();
                        this.sound.speak(`Acertou! ${item.name} é o intruso!`);
                        this.setRobotState('happy', `Excelente! ${item.name} eliminado da lista!`);
                        card.classList.add('hidden-placed');
                        this.addPoints(150);
                        this.confetti.start();

                        setTimeout(() => {
                            this.currentStageIdx++;
                            this.loadMode2Stage(this.currentStageIdx);
                        }, 1500);
                    } else if (trashZone && !item.isIntruder) {
                        this.sound.playError();
                        this.sound.speak(`Não! ${item.name} pertence à lista!`);
                        this.setRobotState('', `Cuidado! ${item.name} faz parte da lista certa.`);
                        card.classList.add('shake-error');
                        setTimeout(() => card.classList.remove('shake-error'), 450);
                    }
                },
                onTap: () => {
                    if (item.isIntruder) {
                        this.sound.playSuccess();
                        this.sound.speak(`Acertou! ${item.name} é o intruso!`);
                        this.setRobotState('happy', `Excelente! ${item.name} eliminado!`);
                        card.classList.add('hidden-placed');
                        this.addPoints(150);
                        this.confetti.start();

                        setTimeout(() => {
                            this.currentStageIdx++;
                            this.loadMode2Stage(this.currentStageIdx);
                        }, 1500);
                    } else {
                        this.sound.playError();
                        this.sound.speak(`${item.name} pertence à lista.`);
                        card.classList.add('shake-error');
                        setTimeout(() => card.classList.remove('shake-error'), 450);
                    }
                }
            });

            cardsRow.appendChild(card);
        });
    }

    // ==========================================
    // MODO 3: ORDEM ALFABÉTICA (TREM DAS PALAVRAS)
    // ==========================================
    loadMode3Stage(stageIdx) {
        const stage = GAME_DATA.alphabetical[stageIdx];
        if (!stage) {
            this.showVictoryModal("Mestre do Alfabeto!", "Todos os vagões foram organizados perfeitamente!");
            return;
        }

        this.showScreen(this.screenMode3);
        document.getElementById('mode3-title-tag').innerHTML = `🔤 ${stage.title} (${stageIdx + 1}/${GAME_DATA.alphabetical.length})`;
        this.setRobotState('watching', stage.instruction);
        this.sound.speak(stage.instruction);

        this.alphaOrderCount = 0;
        const wagonsContainer = document.getElementById('mode3-wagons-row');
        wagonsContainer.innerHTML = '';

        for (let i = 0; i < stage.correctOrder.length; i++) {
            const wagon = document.createElement('div');
            wagon.className = 'train-wagon';
            wagon.dataset.wagonIndex = i;
            wagon.innerHTML = `
                <span class="wagon-badge">${i + 1}º Vagão</span>
                <span style="color: #94a3b8; font-size: 0.85rem; font-style: italic;">Arraste aqui</span>
            `;
            wagonsContainer.appendChild(wagon);
        }

        const wordsGrid = document.getElementById('mode3-words-grid');
        wordsGrid.innerHTML = '';

        const shuffled = [...stage.correctOrder].sort(() => Math.random() - 0.5);

        shuffled.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'draggable-card';
            card.id = `card-m3-${idx}`;
            card.innerHTML = `
                <span>${item.emoji} ${item.name}</span>
                <button class="btn-speak-item" title="Ouvir">🔊</button>
            `;

            card.querySelector('.btn-speak-item').addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });

            this.attachPointerDrag(card, {
                onDragStart: () => {
                    this.sound.playGrab();
                },
                onDrop: (dropTarget) => {
                    const wagon = dropTarget ? dropTarget.closest('.train-wagon:not(.filled)') : null;
                    if (wagon) {
                        const expectedIdx = this.alphaOrderCount;
                        const wagonIdx = parseInt(wagon.dataset.wagonIndex, 10);
                        const expectedItem = stage.correctOrder[expectedIdx];

                        if (wagonIdx === expectedIdx && item.name === expectedItem.name) {
                            // Correto
                            this.sound.playSnap();
                            this.sound.playSuccess();
                            this.sound.speak(`${item.name}! Correto!`);
                            this.setRobotState('happy', `${item.name} no ${expectedIdx + 1}º vagão!`);
                            wagon.classList.add('filled');
                            wagon.innerHTML = `
                                <span class="wagon-badge" style="background:#10b981;">${expectedIdx + 1}º Vagão</span>
                                <span style="font-size: 1.15rem; font-weight: 700; color: white;">${item.emoji} ${item.name}</span>
                            `;
                            card.classList.add('hidden-placed');
                            this.alphaOrderCount++;
                            this.addPoints(120);

                            if (this.alphaOrderCount >= stage.correctOrder.length) {
                                this.sound.playVictory();
                                this.confetti.start();
                                setTimeout(() => {
                                    this.currentStageIdx++;
                                    this.loadMode3Stage(this.currentStageIdx);
                                }, 1500);
                            }
                        } else {
                            this.sound.playError();
                            this.sound.speak(`Observe a letra inicial de ${item.name}. Procure a que vem primeiro.`);
                            this.setRobotState('', `A letra inicial de "${item.name}" não é a próxima no alfabeto.`);
                            card.classList.add('shake-error');
                            setTimeout(() => card.classList.remove('shake-error'), 450);
                        }
                    }
                },
                onTap: () => {
                    const expectedIdx = this.alphaOrderCount;
                    const expectedItem = stage.correctOrder[expectedIdx];
                    const nextWagon = document.querySelector(`.train-wagon[data-wagon-index="${expectedIdx}"]:not(.filled)`);

                    if (nextWagon && item.name === expectedItem.name) {
                        this.sound.playSnap();
                        this.sound.playSuccess();
                        this.sound.speak(`${item.name}! Correto!`);
                        this.setRobotState('happy', `${item.name} colocado no ${expectedIdx + 1}º vagão!`);
                        nextWagon.classList.add('filled');
                        nextWagon.innerHTML = `
                            <span class="wagon-badge" style="background:#10b981;">${expectedIdx + 1}º Vagão</span>
                            <span style="font-size: 1.15rem; font-weight: 700; color: white;">${item.emoji} ${item.name}</span>
                        `;
                        card.classList.add('hidden-placed');
                        this.alphaOrderCount++;
                        this.addPoints(120);

                        if (this.alphaOrderCount >= stage.correctOrder.length) {
                            this.sound.playVictory();
                            this.confetti.start();
                            setTimeout(() => {
                                this.currentStageIdx++;
                                this.loadMode3Stage(this.currentStageIdx);
                            }, 1500);
                        }
                    } else {
                        this.sound.playError();
                        this.sound.speak(`Observe o alfabeto para escolher a próxima palavra.`);
                        card.classList.add('shake-error');
                        setTimeout(() => card.classList.remove('shake-error'), 450);
                    }
                }
            });

            wordsGrid.appendChild(card);
        });
    }

    // ==========================================
    // MOTOR DE DRAG & DROP POINTER API UNIVERSAL
    // ==========================================
    attachPointerDrag(element, callbacks = {}) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let currentDropOver = null;
        let hasMoved = false;

        const onPointerDown = (e) => {
            // Only primary pointer (left mouse or primary finger)
            if (e.button !== 0 && e.pointerType === 'mouse') return;

            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            currentX = e.clientX;
            currentY = e.clientY;

            element.setPointerCapture(e.pointerId);

            if (callbacks.onDragStart) callbacks.onDragStart();
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (Math.hypot(dx, dy) > 8) {
                hasMoved = true;
                element.classList.add('is-dragging');
                element.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.12) rotate(3deg)`;

                // Highlight drop zone under cursor
                const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
                const dropZone = elementsBelow.find(el => 
                    el.classList.contains('target-drop-zone') || 
                    el.classList.contains('robot-trash-zone') || 
                    el.classList.contains('train-wagon')
                );

                if (currentDropOver && currentDropOver !== dropZone) {
                    currentDropOver.classList.remove('drag-over');
                }

                if (dropZone) {
                    dropZone.classList.add('drag-over');
                    currentDropOver = dropZone;
                } else {
                    currentDropOver = null;
                }
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;

            try { element.releasePointerCapture(e.pointerId); } catch(err) {}

            element.classList.remove('is-dragging');
            element.style.transform = '';

            if (currentDropOver) {
                currentDropOver.classList.remove('drag-over');
            }

            if (hasMoved) {
                // Find drop target at final pointer coordinates
                const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
                const dropTarget = elementsBelow.find(el => 
                    el.classList.contains('target-drop-zone') || 
                    el.classList.contains('robot-trash-zone') || 
                    el.classList.contains('train-wagon') ||
                    el.closest('.notebook-container') ||
                    el.closest('.robot-trash-zone') ||
                    el.closest('.train-wagon')
                );

                if (callbacks.onDrop) callbacks.onDrop(dropTarget);
            } else {
                // If the student simply tapped without dragging
                if (callbacks.onTap) callbacks.onTap();
            }
        };

        const onPointerCancel = (e) => {
            if (!isDragging) return;
            isDragging = false;
            try { element.releasePointerCapture(e.pointerId); } catch(err) {}
            element.classList.remove('is-dragging');
            element.style.transform = '';
            if (currentDropOver) currentDropOver.classList.remove('drag-over');
        };

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointermove', onPointerMove);
        element.addEventListener('pointerup', onPointerUp);
        element.addEventListener('pointercancel', onPointerCancel);
    }

    showVictoryModal(title, message) {
        this.sound.playVictory();
        this.confetti.start();
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-text').textContent = message;
        document.getElementById('modal-score').textContent = `Pontuação: ${this.score} ⭐`;
        this.modalVictory.classList.add('active');
    }

    goToWelcome() {
        this.confetti.stop();
        this.modalVictory.classList.remove('active');
        this.showScreen(this.screenWelcome);
    }
}

// Inicializar após carregamento
window.addEventListener('DOMContentLoaded', () => {
    window.game = new SuperListaGame();
});
