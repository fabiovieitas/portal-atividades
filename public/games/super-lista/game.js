/**
 * DE OLHO NA LISTA - ENGINE OFICIAL STUDIO-GRADE
 * Fiel ao layout, física de arrastar e fluxo pedagógico da BNCC
 */

// --- BANCO DE DADOS DAS FASES ---
const STAGES_DATA = {
    // Fase 1: Associação de Listas aos Personagens
    stage1: {
        instruction: "Entregue as listas corretas para Ana, José e Lucas.",
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

    // Fase 2: Complete a Lista do José (Alimentos do Mercado)
    stage2: {
        charName: "JOSÉ",
        charAvatar: "🧔🏼‍♂️",
        title: "LISTA DO JOSÉ",
        fixedText: "PÃO - ALHO - FEIJÃO",
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

    // Fase 3: Complete a Lista da Ana (Materiais Escolares / Trabalho)
    stage3: {
        charName: "ANA",
        charAvatar: "👩🏾‍💼",
        title: "LISTA DA ANA",
        fixedText: "CANETA - BORRACHA - APONTADOR",
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
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
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
            gain.gain.setValueAtTime(0.25, now + i * 0.08);
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

// --- CONTROLADOR PRINCIPAL DO JOGO ---
class DeOlhoNaListaGame {
    constructor() {
        this.sound = new SoundEngine();
        this.confetti = new ConfettiEngine('confetti-canvas');
        this.currentStage = 1;
        this.starsEarned = 0;

        // Stage 1 Placed State
        this.stage1Assignments = { ana: null, jose: null, lucas: null };

        // Stage 2 & 3 Placed State
        this.tabletPlacedWords = [null, null, null];

        this.initDOM();
        this.bindEvents();
    }

    initDOM() {
        this.viewMenu = document.getElementById('view-menu');
        this.viewCutscene = document.getElementById('view-cutscene');
        this.viewStage1 = document.getElementById('view-stage1');
        this.viewStage2 = document.getElementById('view-stage2');
        this.modalFeedback = document.getElementById('modal-feedback');

        this.btnStartGame = document.getElementById('btn-start-game');
        this.btnCutsceneNext = document.getElementById('btn-cutscene-next');
        this.btnConfirmStage1 = document.getElementById('btn-confirm-stage1');
        this.btnConfirmStage2 = document.getElementById('btn-confirm-stage2');
        this.btnFeedbackAction = document.getElementById('btn-feedback-action');
    }

    bindEvents() {
        this.btnStartGame.addEventListener('click', () => {
            this.sound.playSnap();
            this.showView(this.viewCutscene);
            this.sound.speak("Ana, José e Lucas organizaram listas com diferentes objetivos, mas agora elas estão embaralhadas.");
        });

        this.btnCutsceneNext.addEventListener('click', () => {
            this.sound.playSnap();
            this.startStage1();
        });

        this.btnConfirmStage1.addEventListener('click', () => {
            this.validateStage1();
        });

        this.btnConfirmStage2.addEventListener('click', () => {
            this.validateStage2();
        });

        this.btnFeedbackAction.addEventListener('click', () => {
            this.modalFeedback.classList.remove('active');
            this.confetti.stop();
            if (this.currentStage === 2) {
                this.startStage2(STAGES_DATA.stage2);
            } else if (this.currentStage === 3) {
                this.startStage2(STAGES_DATA.stage3);
            } else {
                // Game Finished!
                this.showView(this.viewMenu);
            }
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
    }

    setStars(count) {
        this.starsEarned = count;
        for (let i = 1; i <= 3; i++) {
            const starEl = document.getElementById(`star-${i}`);
            if (i <= count) starEl.classList.add('filled');
            else starEl.classList.remove('filled');
        }
    }

    // =======================================================
    // FASE 1: ENTREGUE AS LISTAS AOS PERSONAGENS
    // =======================================================
    startStage1() {
        this.currentStage = 1;
        this.showView(this.viewStage1);
        this.stage1Assignments = { ana: null, jose: null, lucas: null };
        this.btnConfirmStage1.classList.remove('active');
        this.sound.speak(STAGES_DATA.stage1.instruction);

        // Build Draggable Props Area (Left)
        const propsArea = document.getElementById('stage1-props-area');
        propsArea.innerHTML = '';

        STAGES_DATA.stage1.props.forEach(prop => {
            const el = document.createElement('div');
            el.className = `list-prop prop-${prop.type}`;
            el.id = prop.id;
            el.innerHTML = prop.lines.map(l => `<div>${l}</div>`).join('');

            this.attachPointerDrag(el, {
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
                    // Tap alternative: find first empty character slot
                    const emptyCharId = Object.keys(this.stage1Assignments).find(k => !this.stage1Assignments[k]);
                    if (emptyCharId) {
                        this.assignPropToCharacter(el, prop, emptyCharId);
                    }
                }
            });

            propsArea.appendChild(el);
        });

        // Build Character Target Cards (Right)
        const targetsCol = document.getElementById('stage1-targets-column');
        targetsCol.innerHTML = '';

        STAGES_DATA.stage1.characters.forEach(char => {
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
            <div style="font-size: 0.9rem; font-weight: 800; color: #065f46;">
                ${propData.lines[0]}... ✅
            </div>
        `;

        propElement.classList.add('hidden-placed');

        // Check if all 3 characters have lists
        const filledCount = Object.values(this.stage1Assignments).filter(Boolean).length;
        if (filledCount >= 3) {
            this.btnConfirmStage1.classList.add('active');
            this.sound.speak("Agora clique em Confirmar!");
        }
    }

    validateStage1() {
        if (!this.btnConfirmStage1.classList.contains('active')) return;

        // Validation: Ana = prop_ana, Jose = prop_jose, Lucas = prop_lucas
        const isAnaOk = this.stage1Assignments.ana && this.stage1Assignments.ana.targetChar === 'ana';
        const isJoseOk = this.stage1Assignments.jose && this.stage1Assignments.jose.targetChar === 'jose';
        const isLucasOk = this.stage1Assignments.lucas && this.stage1Assignments.lucas.targetChar === 'lucas';

        if (isAnaOk && isJoseOk && isLucasOk) {
            // SUCCESS
            this.sound.playSuccess();
            this.confetti.start();
            this.setStars(1);
            this.currentStage = 2;

            this.showFeedbackModal("MUITO BEM!", "Você entregou as listas certas para Ana, José e Lucas!", "CONTINUAR");
        } else {
            // ERROR
            this.sound.playError();
            this.sound.speak("Ops! Alguma lista foi entregue para a pessoa errada. Tente novamente!");
            setTimeout(() => {
                this.startStage1();
            }, 1200);
        }
    }

    // =======================================================
    // FASE 2 & 3: COMPLETE A LISTA NO TABLET
    // =======================================================
    startStage2(stageConfig) {
        this.showView(this.viewStage2);
        this.currentStageConfig = stageConfig;
        this.tabletPlacedWords = [null, null, null];
        this.btnConfirmStage2.classList.remove('active');

        // Header Title & Avatar
        document.getElementById('stage2-char-avatar').textContent = stageConfig.charAvatar;
        document.getElementById('tablet-list-title').textContent = stageConfig.title;
        document.getElementById('tablet-fixed-items').textContent = stageConfig.fixedText;
        this.sound.speak(`Complete a ${stageConfig.title}. Arraste as palavras adequadas para a lista.`);

        // Build Word Pills (Left)
        const wordsGrid = document.getElementById('stage2-words-grid');
        wordsGrid.innerHTML = '';

        stageConfig.words.forEach((wordObj, idx) => {
            const pill = document.createElement('div');
            pill.className = 'word-pill';
            pill.id = `pill-${idx}`;
            pill.textContent = wordObj.name;

            this.attachPointerDrag(pill, {
                onDragStart: () => {
                    this.sound.playGrab();
                    this.sound.speak(wordObj.name);
                },
                onDrop: (dropTarget) => {
                    const slot = dropTarget ? dropTarget.closest('.tablet-slot') : null;
                    if (slot) {
                        const slotIdx = parseInt(slot.dataset.slotIndex, 10);
                        this.placeWordInTabletSlot(pill, wordObj, slotIdx);
                    }
                },
                onTap: () => {
                    this.sound.speak(wordObj.name);
                    // Tap alternative: find first empty tablet slot
                    const emptySlotIdx = this.tabletPlacedWords.findIndex(w => w === null);
                    if (emptySlotIdx !== -1) {
                        this.placeWordInTabletSlot(pill, wordObj, emptySlotIdx);
                    }
                }
            });

            wordsGrid.appendChild(pill);
        });

        // Build Tablet Slots (Right)
        const slotsRow = document.getElementById('tablet-drop-slots');
        slotsRow.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const slot = document.createElement('div');
            slot.className = 'tablet-slot';
            slot.dataset.slotIndex = i;
            slot.id = `tablet-slot-${i}`;
            slot.textContent = `[ ______ ]`;
            slotsRow.appendChild(slot);
        }
    }

    placeWordInTabletSlot(pillElement, wordObj, slotIdx) {
        this.sound.playSnap();
        this.tabletPlacedWords[slotIdx] = wordObj;

        const slot = document.getElementById(`tablet-slot-${slotIdx}`);
        slot.classList.add('filled');
        slot.textContent = wordObj.name;

        pillElement.classList.add('hidden-placed');

        // Check if all 3 slots are filled
        const filledCount = this.tabletPlacedWords.filter(Boolean).length;
        if (filledCount >= 3) {
            this.btnConfirmStage2.classList.add('active');
            this.sound.speak("Agora clique em Confirmar!");
        }
    }

    validateStage2() {
        if (!this.btnConfirmStage2.classList.contains('active')) return;

        // Check if all 3 placed words are correct
        const allCorrect = this.tabletPlacedWords.every(w => w && w.isCorrect);

        if (allCorrect) {
            // SUCCESS
            this.sound.playSuccess();
            this.confetti.start();

            if (this.currentStage === 2) {
                this.setStars(2);
                this.currentStage = 3;
                this.showFeedbackModal("EXCELENTE!", "Você completou a lista de alimentos com maestria!", "PRÓXIMA LISTA");
            } else if (this.currentStage === 3) {
                this.setStars(3);
                this.sound.playVictory();
                this.showFeedbackModal("PARABÉNS!", "Você completou todas as missões de De Olho na Lista!", "JOGAR NOVAMENTE");
            }
        } else {
            // ERROR
            this.sound.playError();
            this.sound.speak("Alguma palavra não faz parte desta lista. Tente novamente!");
            setTimeout(() => {
                this.startStage2(this.currentStageConfig);
            }, 1200);
        }
    }

    showFeedbackModal(title, desc, actionText) {
        document.getElementById('feedback-title').textContent = title;
        document.getElementById('feedback-desc').textContent = desc;
        this.btnFeedbackAction.textContent = actionText;
        this.modalFeedback.classList.add('active');
    }

    // =======================================================
    // MOTOR UNIVERSAL DE ARRASTAR COM POINTER API
    // =======================================================
    attachPointerDrag(element, callbacks = {}) {
        let isDragging = false;
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

                // Collision detection with drop zones
                const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
                const dropZone = elementsBelow.find(el => 
                    el.classList.contains('character-target-card') || 
                    el.classList.contains('tablet-slot')
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
                const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
                const dropTarget = elementsBelow.find(el => 
                    el.classList.contains('character-target-card') || 
                    el.classList.contains('tablet-slot') ||
                    el.closest('.character-target-card') ||
                    el.closest('.tablet-device-frame')
                );

                if (callbacks.onDrop) callbacks.onDrop(dropTarget);
            } else {
                if (callbacks.onTap) callbacks.onTap();
            }
        };

        const onPointerCancel = () => {
            isDragging = false;
            element.classList.remove('is-dragging');
            element.style.transform = '';
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
