/**
 * JOGO ORIGINAL LAB KIDS: SUPER LISTA - MISSÃO ORGANIZAÇÃO
 * Autor: Professor Fábio Vieitas / Lab Kids
 * BNCC: EF01LP10, EF12LP04, EF01LP02, EF02LP04
 */

// --- BANCO DE DADOS DAS MISSÕES E MODOS ---
const GAME_DATA = {
    // Modo 1: Complete a Lista
    completeList: [
        {
            id: 1,
            title: "Mochila Escolar",
            emoji: "🎒",
            context: "Ajude o Robô Bit a arrumar os materiais escolares dentro da mochila!",
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
            context: "Vamos conferir a lista de alimentos saudáveis na feira do bairro!",
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
            context: "O Robô Bit precisa preparar os itens do experimento científico!",
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
            context: "Lista de compras para organizar o grande aniversário no Lab Kids!",
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
            context: "Identifique e organize a lista com os animais que vivem na fazendinha!",
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
            instruction: "Qual destes itens NÃO é um brinquedo?",
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
            instruction: "Qual destes itens NÃO é uma fruta?",
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
            instruction: "Qual destes itens NÃO é um meio de transporte?",
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
            instruction: "Qual destes itens NÃO é uma peça de roupa?",
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
            instruction: "Qual destes itens NÃO é um instrumento musical?",
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
            title: "Ordem Alfabética 1",
            instruction: "Organize as palavras na ordem correta do alfabeto (A - Z):",
            correctOrder: [
                { name: "Abelha", emoji: "🐝" },
                { name: "Bola", emoji: "⚽" },
                { name: "Casa", emoji: "🏠" }
            ]
        },
        {
            id: 2,
            title: "Ordem Alfabética 2",
            instruction: "Organize as palavras na ordem correta do alfabeto (A - Z):",
            correctOrder: [
                { name: "Dado", emoji: "🎲" },
                { name: "Elefante", emoji: "🐘" },
                { name: "Foca", emoji: "🦭" }
            ]
        },
        {
            id: 3,
            title: "Ordem Alfabética 3",
            instruction: "Organize as palavras na ordem correta do alfabeto (A - Z):",
            correctOrder: [
                { name: "Gato", emoji: "🐱" },
                { name: "Jacaré", emoji: "🐊" },
                { name: "Lápis", emoji: "✏️" },
                { name: "Navio", emoji: "🚢" }
            ]
        }
    ]
};

// --- MOTOR DE ÁUDIO WEB (Efeitos Sonoros Sintetizados) ---
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.speechEnabled = true;
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

    playPop() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
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
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    playVictory() {
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 0.35, 'triangle');
            }, idx * 120);
        });
    }

    playTone(freq, duration, type = 'sine') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    speak(text) {
        if (!this.speechEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'pt-BR';
        utter.rate = 0.92;
        utter.pitch = 1.1;
        window.speechSynthesis.speak(utter);
    }
}

// --- CONFETI CANVAS ENGINE ---
class Confetti {
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
                vy: Math.random() * 4 + 3,
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

// --- GERENCIADOR DO JOGO ---
class SuperListaGame {
    constructor() {
        this.sound = new SoundEngine();
        this.confetti = new Confetti('confetti-canvas');
        this.currentMode = null;
        this.currentStageIdx = 0;
        this.score = 0;
        this.filledSlotsCount = 0;
        this.totalSlotsToFill = 0;
        this.alphabeticalUserOrder = [];

        this.initDOM();
        this.bindEvents();
    }

    initDOM() {
        this.screenWelcome = document.getElementById('screen-welcome');
        this.screenGame = document.getElementById('screen-game');
        this.screenIntruders = document.getElementById('screen-intruders');
        this.screenAlphabetical = document.getElementById('screen-alphabetical');
        this.modalVictory = document.getElementById('modal-victory');
        this.scoreDisplay = document.getElementById('score-value');
    }

    bindEvents() {
        // Mode cards selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const mode = card.dataset.mode;
                this.sound.playPop();
                this.startMode(mode);
            });
        });

        // Speech Unlock on first touch/click
        const unlock = () => {
            this.sound.init();
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('click', unlock);
        };
        window.addEventListener('touchstart', unlock, { passive: true });
        window.addEventListener('click', unlock, { passive: true });
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

    // ==========================================
    // MODO 1: COMPLETE A LISTA
    // ==========================================
    startMode(mode) {
        this.currentMode = mode;
        this.currentStageIdx = 0;

        if (mode === 'complete') {
            this.loadCompleteStage(this.currentStageIdx);
        } else if (mode === 'intruders') {
            this.loadIntrudersStage(this.currentStageIdx);
        } else if (mode === 'alphabetical') {
            this.loadAlphabeticalStage(this.currentStageIdx);
        }
    }

    loadCompleteStage(stageIdx) {
        const stage = GAME_DATA.completeList[stageIdx];
        if (!stage) {
            this.showVictoryModal("Parabéns!", "Você completou todas as listas do Robô Bit com maestria!");
            return;
        }

        this.showScreen(this.screenGame);
        this.filledSlotsCount = 0;
        this.totalSlotsToFill = stage.targetItems.length;

        document.getElementById('mission-tag').innerHTML = `${stage.emoji} ${stage.title} (${stageIdx + 1}/${GAME_DATA.completeList.length})`;
        document.getElementById('notebook-title').innerHTML = `<span>${stage.emoji} Lista de ${stage.title}</span>`;
        document.getElementById('feedback-box').textContent = stage.context;
        this.sound.speak(`${stage.title}. ${stage.context}`);

        // Build Notebook List
        const itemsContainer = document.getElementById('notebook-items');
        itemsContainer.innerHTML = '';

        // Fixed pre-existing items
        stage.fixedItems.forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'list-slot fixed';
            slot.innerHTML = `
                <span class="slot-check">✔</span>
                <span>${item.emoji} ${item.name}</span>
                <button class="btn-speak-word" title="Ouvir palavra">🔊</button>
            `;
            slot.querySelector('.btn-speak-word').addEventListener('click', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });
            itemsContainer.appendChild(slot);
        });

        // Blank target slots to fill
        for (let i = 0; i < stage.targetItems.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'list-slot target-slot';
            slot.id = `target-slot-${i}`;
            slot.innerHTML = `
                <span class="slot-check">⏳</span>
                <span class="slot-label" style="color: #94a3b8; font-style: italic;">Toque no item correto...</span>
            `;
            itemsContainer.appendChild(slot);
        }

        // Build Words Pool (Shuffle targets + distractors)
        const allCards = [...stage.targetItems.map(i => ({ ...i, isTarget: true })), ...stage.distractors.map(i => ({ ...i, isTarget: false }))];
        allCards.sort(() => Math.random() - 0.5);

        const wordsGrid = document.getElementById('words-grid');
        wordsGrid.innerHTML = '';

        allCards.forEach(item => {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.innerHTML = `
                <span>${item.emoji} ${item.name}</span>
                <button class="btn-speak-word" title="Ouvir palavra">🔊</button>
            `;

            card.querySelector('.btn-speak-word').addEventListener('click', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });

            card.addEventListener('click', () => {
                this.handleWordCardClick(card, item, stage);
            });

            wordsGrid.appendChild(card);
        });
    }

    handleWordCardClick(cardElement, item, stage) {
        if (cardElement.classList.contains('selected')) return;

        if (item.isTarget) {
            // Correct Choice
            this.sound.playSuccess();
            this.sound.speak(`Muito bem! ${item.name}!`);
            cardElement.classList.add('selected');
            this.addPoints(100);

            // Fill empty slot
            const emptySlot = document.querySelector('.target-slot:not(.filled)');
            if (emptySlot) {
                emptySlot.classList.add('filled');
                emptySlot.innerHTML = `
                    <span class="slot-check">✅</span>
                    <span>${item.emoji} ${item.name}</span>
                    <button class="btn-speak-word" title="Ouvir palavra">🔊</button>
                `;
                emptySlot.querySelector('.btn-speak-word').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.sound.speak(item.name);
                });
            }

            this.filledSlotsCount++;
            if (this.filledSlotsCount >= this.totalSlotsToFill) {
                this.sound.playVictory();
                this.confetti.start();
                setTimeout(() => {
                    this.currentStageIdx++;
                    this.loadCompleteStage(this.currentStageIdx);
                }, 1500);
            }
        } else {
            // Incorrect Distractor
            this.sound.playError();
            this.sound.speak(`${item.name} não faz parte desta lista.`);
            cardElement.classList.add('shake-error');
            setTimeout(() => cardElement.classList.remove('shake-error'), 450);
            document.getElementById('feedback-box').textContent = `Ops! "${item.name}" não combina com a lista de ${stage.title}. Tente outro!`;
        }
    }

    // ==========================================
    // MODO 2: QUEM É O INTRUSO?
    // ==========================================
    loadIntrudersStage(stageIdx) {
        const stage = GAME_DATA.intruders[stageIdx];
        if (!stage) {
            this.showVictoryModal("Excelente Detetive!", "Você encontrou todos os intrusos nas listas!");
            return;
        }

        this.showScreen(this.screenIntruders);
        document.getElementById('intruder-mission-tag').innerHTML = `🕵️ ${stage.title} (${stageIdx + 1}/${GAME_DATA.intruders.length})`;
        document.getElementById('intruder-instruction').textContent = stage.instruction;
        this.sound.speak(`${stage.title}. ${stage.instruction}`);

        const grid = document.getElementById('intruder-grid');
        grid.innerHTML = '';

        stage.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'intruder-card';
            card.innerHTML = `
                <span class="emoji">${item.emoji}</span>
                <span class="name">${item.name}</span>
                <button class="btn-speak-word" title="Ouvir palavra">🔊 Ouvir</button>
            `;

            card.querySelector('.btn-speak-word').addEventListener('click', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });

            card.addEventListener('click', () => {
                if (item.isIntruder) {
                    this.sound.playSuccess();
                    this.sound.speak(`Acertou! ${item.name} é o intruso!`);
                    card.style.borderColor = '#10b981';
                    card.style.background = 'rgba(16, 185, 129, 0.3)';
                    this.addPoints(150);
                    this.confetti.start();

                    setTimeout(() => {
                        this.currentStageIdx++;
                        this.loadIntrudersStage(this.currentStageIdx);
                    }, 1400);
                } else {
                    this.sound.playError();
                    this.sound.speak(`${item.name} pertence à lista.`);
                    card.classList.add('shake-error');
                    setTimeout(() => card.classList.remove('shake-error'), 450);
                }
            });

            grid.appendChild(card);
        });
    }

    // ==========================================
    // MODO 3: ORDEM ALFABÉTICA (A-Z)
    // ==========================================
    loadAlphabeticalStage(stageIdx) {
        const stage = GAME_DATA.alphabetical[stageIdx];
        if (!stage) {
            this.showVictoryModal("Mestre do Alfabeto!", "Você colocou todas as palavras na ordem alfabética perfeita!");
            return;
        }

        this.showScreen(this.screenAlphabetical);
        document.getElementById('alpha-mission-tag').innerHTML = `🔤 ${stage.title} (${stageIdx + 1}/${GAME_DATA.alphabetical.length})`;
        document.getElementById('alpha-instruction').textContent = stage.instruction;
        this.sound.speak(stage.instruction);

        this.alphabeticalUserOrder = [];
        const slotsContainer = document.getElementById('alpha-slots');
        slotsContainer.innerHTML = '';

        for (let i = 0; i < stage.correctOrder.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'alpha-slot';
            slot.id = `alpha-slot-${i}`;
            slot.innerHTML = `
                <span class="num-badge">${i + 1}º</span>
                <span class="label" style="color: #64748b; font-style: italic;">Selecione a ${i + 1}ª palavra...</span>
            `;
            slotsContainer.appendChild(slot);
        }

        // Shuffled pool
        const shuffled = [...stage.correctOrder].sort(() => Math.random() - 0.5);
        const poolGrid = document.getElementById('alpha-pool-grid');
        poolGrid.innerHTML = '';

        shuffled.forEach(item => {
            const card = document.createElement('div');
            card.className = 'word-card';
            card.innerHTML = `
                <span>${item.emoji} ${item.name}</span>
                <button class="btn-speak-word" title="Ouvir palavra">🔊</button>
            `;

            card.querySelector('.btn-speak-word').addEventListener('click', (e) => {
                e.stopPropagation();
                this.sound.speak(item.name);
            });

            card.addEventListener('click', () => {
                if (card.classList.contains('selected')) return;

                const nextExpectedIdx = this.alphabeticalUserOrder.length;
                const expectedItem = stage.correctOrder[nextExpectedIdx];

                if (item.name === expectedItem.name) {
                    this.sound.playSuccess();
                    this.sound.speak(`${item.name}! Correto!`);
                    card.classList.add('selected');
                    this.alphabeticalUserOrder.push(item);
                    this.addPoints(120);

                    const slot = document.getElementById(`alpha-slot-${nextExpectedIdx}`);
                    if (slot) {
                        slot.style.border = '2px solid #10b981';
                        slot.style.background = 'rgba(16, 185, 129, 0.2)';
                        slot.innerHTML = `
                            <span class="num-badge" style="background: #10b981;">${nextExpectedIdx + 1}º</span>
                            <span style="color: white; font-weight: 700;">${item.emoji} ${item.name}</span>
                        `;
                    }

                    if (this.alphabeticalUserOrder.length === stage.correctOrder.length) {
                        this.sound.playVictory();
                        this.confetti.start();
                        setTimeout(() => {
                            this.currentStageIdx++;
                            this.loadAlphabeticalStage(this.currentStageIdx);
                        }, 1500);
                    }
                } else {
                    this.sound.playError();
                    this.sound.speak(`Observe a letra inicial de ${item.name}. Procure a que vem primeiro no alfabeto.`);
                    card.classList.add('shake-error');
                    setTimeout(() => card.classList.remove('shake-error'), 450);
                }
            });

            poolGrid.appendChild(card);
        });
    }

    showVictoryModal(title, message) {
        this.sound.playVictory();
        this.confetti.start();
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-text').textContent = message;
        document.getElementById('modal-score').textContent = `Pontuação Final: ${this.score} pontos ⭐`;
        this.modalVictory.classList.add('active');
    }

    goToWelcome() {
        this.confetti.stop();
        this.modalVictory.classList.remove('active');
        this.showScreen(this.screenWelcome);
    }
}

// Inicializa o jogo quando o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
    window.game = new SuperListaGame();
});
