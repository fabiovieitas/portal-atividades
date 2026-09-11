/**
 * LABIRINTO DA TABUADA: MISSÃO DOS CAMPEÕES ⚽🕹️
 * Recriação fiel, animada e modernizada do clássico Blinky's Maze (Digipuzzle)
 * Autor: Lab Kids - Professor Fábio Vieitas
 */

// --- CONFIGURAÇÃO DA GRADE DO LABIRINTO (13 colunas x 9 linhas) ---
const COLS = 13;
const ROWS = 9;
const CELL_SIZE = 56; // Dimensões do Canvas: 728 x 504

// 0 = Caminho livre com número da tabuada
// 1 = Cone esportivo (obstáculo / barreira do labirinto)
// 2 = Painel central do desafio matemático (banner central)
const BASE_MAZE = [
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]
];

// Paleta de cores festivas para os cones de trânsito esportivos (estilo Digipuzzle)
const CONE_PALETTES = [
    { top: '#ea580c', mid: '#fb923c', base: '#c2410c', shadow: 'rgba(249, 115, 22, 0.28)' }, // Laranja
    { top: '#0284c7', mid: '#38bdf8', base: '#0369a1', shadow: 'rgba(56, 189, 248, 0.28)' },  // Azul
    { top: '#16a34a', mid: '#4ade80', base: '#15803d', shadow: 'rgba(74, 222, 128, 0.28)' },  // Verde
    { top: '#ca8a04', mid: '#facc15', base: '#a16207', shadow: 'rgba(250, 204, 21, 0.28)' },  // Amarelo
    { top: '#9333ea', mid: '#c084fc', base: '#7e22ce', shadow: 'rgba(192, 132, 252, 0.28)' }  // Roxo
];

// --- MOTOR DE ÁUDIO SINTETIZADO (Web Audio API) ---
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.lastMoveSound = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    playStep() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        if (now - this.lastMoveSound < 0.12) return;
        this.lastMoveSound = now;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playCorrect() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
        });
    }

    playHit() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playVictory() {
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
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
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'pt-BR';
            utter.rate = 1.05;
            utter.pitch = 1.1;
            window.speechSynthesis.speak(utter);
        } catch (e) {}
    }
}

// --- CLASSE PRINCIPAL DO JOGO ---
class BlinkyMazeGame {
    constructor() {
        this.sound = new SoundEngine();
        this.canvas = document.getElementById('maze-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = COLS * CELL_SIZE; // 728
        this.canvas.height = ROWS * CELL_SIZE; // 504

        this.level = 1; // 1: 2-4, 2: 5-7, 3: 8-10
        this.lives = 3;
        this.score = 0;
        this.questionsSolved = 0;
        this.targetQuestions = 5;

        // Tema de bola de esporte escolhido pelo jogador
        this.selectedSport = '⚽';

        // Estado do Robô Bit (Herói)
        this.hero = {
            gridX: 0,
            gridY: 4,
            fromX: 0,
            fromY: 4,
            toX: 0,
            toY: 4,
            moveProgress: 1.0,
            moveDuration: 0.17, // 170ms por célula para controle ágil e gostoso
            facing: 'right',
            animTime: 0,
            invulnerableTime: 0 // Cooldown de dano
        };

        // Buffer de entrada e teclas pressionadas
        this.keysDown = {};
        this.bufferedDir = null; // { dx, dy, facing }

        // Trilhas deixadas pelo robô
        this.visitedTiles = new Set();
        this.visitedTiles.add(`0,4`);

        // Inimigos (Cronômetros)
        this.enemies = [
            {
                gridX: 12,
                gridY: 1,
                fromX: 12,
                fromY: 1,
                toX: 12,
                toY: 1,
                moveProgress: 1.0,
                moveDuration: 0.65, // 650ms por célula (ritmo suave e cadenciado)
                color: '#ef4444',
                tickAngle: 0,
                freezeTime: 0
            },
            {
                gridX: 12,
                gridY: 7,
                fromX: 12,
                fromY: 7,
                toX: 12,
                toY: 7,
                moveProgress: 1.0,
                moveDuration: 0.70,
                color: '#f59e0b',
                tickAngle: 0,
                freezeTime: 0
            }
        ];

        // Grade de Números da Tabuada
        this.numberGrid = [];

        // Pergunta Atual
        this.currentQuestion = { factorA: 3, factorB: 4, answer: 12 };

        // Partículas flutuantes de feedback
        this.floatingTexts = [];

        this.isGameOver = false;
        this.isVictory = false;

        this.initDOM();
        this.bindEvents();
        this.startLevel(this.level);

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    initDOM() {
        this.equationDisplay = document.getElementById('equation-display');
        this.hudScore = document.getElementById('hud-score-value');
        this.hudLives = document.getElementById('hud-lives');
        this.modalVictory = document.getElementById('modal-victory');
        this.modalGameOver = document.getElementById('modal-gameover');
    }

    bindEvents() {
        // Teclado com suporte a manter pressionado
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'KeyW', 'ArrowDown', 'KeyS', 'ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
                e.preventDefault();
                this.sound.init();
                this.keysDown[e.code] = true;
                this.processInputQueue();
            }
        });

        window.addEventListener('keyup', (e) => {
            delete this.keysDown[e.code];
        });

        // Controles Touch / D-Pad (Clique & Manter Pressionado)
        const setupDpad = (btnId, dx, dy, facing) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;

            const trigger = (e) => {
                e.preventDefault();
                this.sound.init();
                this.queueDirection(dx, dy, facing);
            };

            btn.addEventListener('pointerdown', trigger);
        };

        setupDpad('dpad-up', 0, -1, 'up');
        setupDpad('dpad-down', 0, 1, 'down');
        setupDpad('dpad-left', -1, 0, 'left');
        setupDpad('dpad-right', 1, 0, 'right');

        // Seletor de Níveis
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.sound.playCorrect();
                this.startLevel(parseInt(btn.dataset.level, 10));
            });
        });

        // Seletor de Bolas de Esporte
        document.querySelectorAll('.sport-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sport-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedSport = btn.dataset.sport;
                this.sound.playStep();
            });
        });

        // Clique direto nas células adjacentes para navegar no tablet
        this.canvas.addEventListener('pointerdown', (e) => {
            this.sound.init();
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const clickX = (e.clientX - rect.left) * scaleX;
            const clickY = (e.clientY - rect.top) * scaleY;

            const targetCol = Math.floor(clickX / CELL_SIZE);
            const targetRow = Math.floor(clickY / CELL_SIZE);

            const dx = targetCol - this.hero.gridX;
            const dy = targetRow - this.hero.gridY;

            if (Math.abs(dx) + Math.abs(dy) === 1) {
                const facing = dx > 0 ? 'right' : (dx < 0 ? 'left' : (dy > 0 ? 'down' : 'up'));
                this.queueDirection(dx, dy, facing);
            }
        });
    }

    queueDirection(dx, dy, facing) {
        this.bufferedDir = { dx, dy, facing };
        this.processInputQueue();
    }

    processInputQueue() {
        if (this.isGameOver || this.isVictory) return;

        // Se o herói já terminou o movimento atual, podemos começar o próximo
        if (this.hero.moveProgress >= 1.0) {
            let nextMove = null;

            // Prioridade 1: Direção armazenada no buffer
            if (this.bufferedDir) {
                nextMove = this.bufferedDir;
                this.bufferedDir = null;
            } 
            // Prioridade 2: Teclas atualmente seguradas
            else if (this.keysDown['ArrowUp'] || this.keysDown['KeyW']) {
                nextMove = { dx: 0, dy: -1, facing: 'up' };
            } else if (this.keysDown['ArrowDown'] || this.keysDown['KeyS']) {
                nextMove = { dx: 0, dy: 1, facing: 'down' };
            } else if (this.keysDown['ArrowLeft'] || this.keysDown['KeyA']) {
                nextMove = { dx: -1, dy: 0, facing: 'left' };
            } else if (this.keysDown['ArrowRight'] || this.keysDown['KeyD']) {
                nextMove = { dx: 1, dy: 0, facing: 'right' };
            }

            if (nextMove) {
                const targetX = this.hero.gridX + nextMove.dx;
                const targetY = this.hero.gridY + nextMove.dy;
                this.hero.facing = nextMove.facing;

                if (this.canWalk(targetX, targetY)) {
                    this.hero.fromX = this.hero.gridX;
                    this.hero.fromY = this.hero.gridY;
                    this.hero.toX = targetX;
                    this.hero.toY = targetY;
                    this.hero.moveProgress = 0.0;
                    this.sound.playStep();
                }
            }
        }
    }

    startLevel(lvl) {
        this.level = lvl;
        this.lives = 3;
        this.score = 0;
        this.questionsSolved = 0;
        this.isGameOver = false;
        this.isVictory = false;

        this.modalVictory.classList.remove('active');
        this.modalGameOver.classList.remove('active');

        this.visitedTiles.clear();
        this.visitedTiles.add(`0,4`);

        this.resetHero();
        this.resetEnemies();
        this.generateMathQuestion();
        this.updateHUD();
    }

    resetHero() {
        this.hero.gridX = 0;
        this.hero.gridY = 4;
        this.hero.fromX = 0;
        this.hero.fromY = 4;
        this.hero.toX = 0;
        this.hero.toY = 4;
        this.hero.moveProgress = 1.0;
        this.hero.invulnerableTime = 2.5; // 2.5 segundos de imunidade ao renascer
    }

    resetEnemies() {
        const dur = this.level === 1 ? 0.65 : (this.level === 2 ? 0.55 : 0.48);

        this.enemies[0].gridX = 12;
        this.enemies[0].gridY = 1;
        this.enemies[0].fromX = 12;
        this.enemies[0].fromY = 1;
        this.enemies[0].toX = 12;
        this.enemies[0].toY = 1;
        this.enemies[0].moveProgress = 1.0;
        this.enemies[0].moveDuration = dur;
        this.enemies[0].freezeTime = 1.2;

        this.enemies[1].gridX = 12;
        this.enemies[1].gridY = 7;
        this.enemies[1].fromX = 12;
        this.enemies[1].fromY = 7;
        this.enemies[1].toX = 12;
        this.enemies[1].toY = 7;
        this.enemies[1].moveProgress = 1.0;
        this.enemies[1].moveDuration = dur + 0.05;
        this.enemies[1].freezeTime = 1.2;
    }

    canWalk(col, row) {
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
        const cell = BASE_MAZE[row][col];
        return cell === 0; // Apenas caminhos livres
    }

    generateMathQuestion() {
        let minF = 2, maxF = 4;
        if (this.level === 2) { minF = 5; maxF = 7; }
        if (this.level === 3) { minF = 8; maxF = 10; }

        const factorA = Math.floor(Math.random() * (maxF - minF + 1)) + minF;
        const factorB = Math.floor(Math.random() * 9) + 2; // 2 a 10
        const answer = factorA * factorB;

        this.currentQuestion = { factorA, factorB, answer };
        this.equationDisplay.textContent = `${factorA} × ${factorB} = ?`;
        this.sound.speak(`${factorA} vezes ${factorB}`);

        this.populateNumberGrid(answer, factorA);
    }

    populateNumberGrid(correctAnswer, factorA) {
        this.numberGrid = [];

        // Distratores baseados em múltiplos reais da tabuada
        const distractorPool = new Set();
        for (let m = 1; m <= 10; m++) {
            const val = factorA * m;
            if (val !== correctAnswer) distractorPool.add(val);
        }
        // Complementar com múltiplos de números vizinhos
        [factorA - 1, factorA + 1].forEach(f => {
            if (f >= 2) {
                for (let m = 2; m <= 10; m++) {
                    const val = f * m;
                    if (val !== correctAnswer) distractorPool.add(val);
                }
            }
        });

        const distractors = Array.from(distractorPool);

        // Coletar todas as células livres
        const freeCells = [];
        for (let r = 0; r < ROWS; r++) {
            this.numberGrid[r] = [];
            for (let c = 0; c < COLS; c++) {
                if (BASE_MAZE[r][c] === 0) {
                    freeCells.push({ c, r });
                }
                this.numberGrid[r][c] = null;
            }
        }

        // Embaralhar as células livres
        freeCells.sort(() => Math.random() - 0.5);

        // Espalhar entre 5 e 7 células com o resultado correto
        const correctCount = 6;
        for (let i = 0; i < correctCount && i < freeCells.length; i++) {
            const cell = freeCells[i];
            this.numberGrid[cell.r][cell.c] = {
                value: correctAnswer,
                isCorrect: true
            };
        }

        // Preencher o restante das células com os distratores da tabuada
        for (let i = correctCount; i < freeCells.length; i++) {
            const cell = freeCells[i];
            const randomVal = distractors[Math.floor(Math.random() * distractors.length)];
            this.numberGrid[cell.r][cell.c] = {
                value: randomVal,
                isCorrect: false
            };
        }
    }

    updateHUD() {
        this.hudScore.textContent = this.score;
        let heartsStr = '';
        for (let i = 0; i < 3; i++) {
            heartsStr += i < this.lives ? '❤️' : '🖤';
        }
        this.hudLives.textContent = heartsStr;
    }

    // --- GAME LOOP ---
    gameLoop(timestamp) {
        const delta = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        if (!this.isGameOver && !this.isVictory) {
            this.update(delta);
        }
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(delta) {
        this.hero.animTime += delta;

        // Atualizar imunidade
        if (this.hero.invulnerableTime > 0) {
            this.hero.invulnerableTime -= delta;
        }

        // 1. Atualizar interpolação do movimento do herói
        if (this.hero.moveProgress < 1.0) {
            this.hero.moveProgress += delta / this.hero.moveDuration;
            if (this.hero.moveProgress >= 1.0) {
                this.hero.moveProgress = 1.0;
                this.hero.gridX = this.hero.toX;
                this.hero.gridY = this.hero.toY;
                this.visitedTiles.add(`${this.hero.gridX},${this.hero.gridY}`);

                // Checar número da célula alcançada
                this.checkCellNumber(this.hero.gridX, this.hero.gridY);

                // Continuar movendo se o usuário estiver segurando tecla ou com buffer
                this.processInputQueue();
            }
        } else {
            this.processInputQueue();
        }

        // 2. Atualizar Cronômetros Malucos (Inimigos)
        this.updateEnemies(delta);

        // 3. Checar colisão com Inimigos
        this.checkEnemyCollisions();

        // 4. Atualizar partículas de texto
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= delta * 30;
            ft.alpha -= delta * 1.2;
            if (ft.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    updateEnemies(delta) {
        this.enemies.forEach(enemy => {
            enemy.tickAngle += delta * 4;

            if (enemy.freezeTime > 0) {
                enemy.freezeTime -= delta;
                return;
            }

            if (enemy.moveProgress < 1.0) {
                enemy.moveProgress += delta / enemy.moveDuration;
                if (enemy.moveProgress >= 1.0) {
                    enemy.moveProgress = 1.0;
                    enemy.gridX = enemy.toX;
                    enemy.gridY = enemy.toY;
                }
            } else {
                // Chegou na célula destino, escolher próximo passo inteligente no corredor
                const dirs = [
                    { x: 1, y: 0 }, { x: -1, y: 0 },
                    { x: 0, y: 1 }, { x: 0, y: -1 }
                ].filter(d => this.canWalk(enemy.gridX + d.x, enemy.gridY + d.y));

                if (dirs.length > 0) {
                    // Evitar inverter direção imediatamente, exceto se for beco sem saída
                    const forwardDirs = dirs.filter(d => 
                        !(enemy.gridX + d.x === enemy.fromX && enemy.gridY + d.y === enemy.fromY)
                    );
                    const chosen = forwardDirs.length > 0 
                        ? forwardDirs[Math.floor(Math.random() * forwardDirs.length)]
                        : dirs[Math.floor(Math.random() * dirs.length)];

                    enemy.fromX = enemy.gridX;
                    enemy.fromY = enemy.gridY;
                    enemy.toX = enemy.gridX + chosen.x;
                    enemy.toY = enemy.gridY + chosen.y;
                    enemy.moveProgress = 0.0;
                }
            }
        });
    }

    checkCellNumber(col, row) {
        const item = this.numberGrid[row] ? this.numberGrid[row][col] : null;
        if (!item) return;

        if (item.isCorrect) {
            // ACERTOU O CÁLCULO!
            this.sound.playCorrect();
            this.score += 100;
            this.questionsSolved++;
            this.updateHUD();

            this.floatingTexts.push({
                text: `+100! GOOOOL! ⚽`,
                x: col * CELL_SIZE + CELL_SIZE / 2,
                y: row * CELL_SIZE,
                alpha: 1.0,
                color: '#facc15'
            });

            this.sound.speak(`Muito bem! ${this.currentQuestion.factorA} vezes ${this.currentQuestion.factorB} é ${this.currentQuestion.answer}!`);

            if (this.questionsSolved >= this.targetQuestions) {
                this.triggerVictory();
            } else {
                // Próxima conta da tabuada
                setTimeout(() => {
                    this.generateMathQuestion();
                }, 400);
            }
        }
    }

    checkEnemyCollisions() {
        if (this.hero.invulnerableTime > 0) return;

        // Posição em pixels do herói
        const hx = (this.hero.fromX + (this.hero.toX - this.hero.fromX) * this.hero.moveProgress) * CELL_SIZE + CELL_SIZE / 2;
        const hy = (this.hero.fromY + (this.hero.toY - this.hero.fromY) * this.hero.moveProgress) * CELL_SIZE + CELL_SIZE / 2;

        this.enemies.forEach(enemy => {
            const ex = (enemy.fromX + (enemy.toX - enemy.fromX) * enemy.moveProgress) * CELL_SIZE + CELL_SIZE / 2;
            const ey = (enemy.fromY + (enemy.toY - enemy.fromY) * enemy.moveProgress) * CELL_SIZE + CELL_SIZE / 2;

            const dist = Math.hypot(hx - ex, hy - ey);
            if (dist < CELL_SIZE * 0.65) {
                // Colisão com cronômetro
                this.sound.playHit();
                this.lives--;
                this.updateHUD();
                this.sound.speak("Cuidado com o cronômetro!");

                this.floatingTexts.push({
                    text: `-1 ❤️`,
                    x: hx,
                    y: hy - 15,
                    alpha: 1.0,
                    color: '#ef4444'
                });

                if (this.lives <= 0) {
                    this.triggerGameOver();
                } else {
                    this.resetHero();
                    this.resetEnemies();
                }
            }
        });
    }

    triggerVictory() {
        this.isVictory = true;
        this.sound.playVictory();
        document.getElementById('modal-score-value').textContent = this.score;
        this.modalVictory.classList.add('active');
    }

    triggerGameOver() {
        this.isGameOver = true;
        this.sound.playHit();
        document.getElementById('gameover-score-value').textContent = this.score;
        this.modalGameOver.classList.add('active');
    }

    // --- RENDERIZADOR GRÁFICO CANVAS HD ---
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Fundo do Estádio / Gramado Arcade
        this.ctx.fillStyle = '#060913';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Renderizar Grade de Células
        let coneIndex = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const px = c * CELL_SIZE;
                const py = r * CELL_SIZE;
                const cellType = BASE_MAZE[r][c];

                if (cellType === 1) {
                    // CONE ESPORTIVO VIBRANTE
                    this.renderSportsCone(px, py, coneIndex++);
                } else if (cellType === 0) {
                    // CAMINHO LIVRE COM NÚMERO
                    this.renderNumberTile(px, py, c, r);
                }
            }
        }

        // 3. Renderizar Painel Central do Desafio Matemático
        this.renderCenterBanner();

        // 4. Renderizar Inimigos (Cronômetros)
        this.renderEnemies();

        // 5. Renderizar o Herói (Robô Bit)
        this.renderHero();

        // 6. Textos Flutuantes
        this.floatingTexts.forEach(ft => {
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, ft.alpha);
            this.ctx.font = 'bold 18px Fredoka, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = ft.color;
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 6;
            this.ctx.fillText(ft.text, ft.x, ft.y);
            this.ctx.restore();
        });
    }

    renderSportsCone(px, py, colorIndex) {
        const cx = px + CELL_SIZE / 2;
        const cy = py + CELL_SIZE / 2;

        const pal = CONE_PALETTES[colorIndex % CONE_PALETTES.length];

        // Sombra elíptica da base
        this.ctx.fillStyle = pal.shadow;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy + 16, 18, 7, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Base quadrada de suporte
        this.ctx.fillStyle = pal.base;
        this.ctx.beginPath();
        this.ctx.roundRect(cx - 17, cy + 12, 34, 7, [3]);
        this.ctx.fill();

        // Corpo cônico 3D
        const grad = this.ctx.createLinearGradient(cx - 14, cy, cx + 14, cy);
        grad.addColorStop(0, pal.base);
        grad.addColorStop(0.5, pal.mid);
        grad.addColorStop(1, pal.top);

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 18); // Topo
        this.ctx.lineTo(cx + 14, cy + 14); // Canto inferior direito
        this.ctx.lineTo(cx - 14, cy + 14); // Canto inferior esquerdo
        this.ctx.closePath();
        this.ctx.fill();

        // Faixa branca reflexiva do cone
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 6, cy - 1);
        this.ctx.lineTo(cx + 6, cy - 1);
        this.ctx.lineTo(cx + 9, cy + 6);
        this.ctx.lineTo(cx - 9, cy + 6);
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderNumberTile(px, py, c, r) {
        const cx = px + CELL_SIZE / 2;
        const cy = py + CELL_SIZE / 2;

        // Fundo sutil do tile com efeito de corte suave
        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
        this.ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);

        // Se o robô já passou por aqui, desenhar a bolinha esportiva da trilha
        if (this.visitedTiles.has(`${c},${r}`)) {
            this.ctx.font = '14px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.selectedSport, cx - 14, cy - 14);
        }

        // Número da tabuada nesta célula
        const cellData = this.numberGrid[r] ? this.numberGrid[r][c] : null;
        if (cellData) {
            this.ctx.font = 'bold 19px Fredoka, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // Destaque para os números
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(cellData.value, cx, cy);
            this.ctx.shadowBlur = 0;
        }
    }

    renderCenterBanner() {
        // Área central (Row 4, Cols 4 a 8)
        const bx = 4 * CELL_SIZE;
        const by = 4 * CELL_SIZE;
        const bw = 5 * CELL_SIZE;
        const bh = CELL_SIZE;

        // Placa do Desafio Neon
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(bx + 4, by + 4, bw - 8, bh - 8);

        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);

        // Texto do Cálculo Central
        this.ctx.fillStyle = '#facc15';
        this.ctx.font = 'bold 22px Fredoka, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = '#facc15';
        this.ctx.shadowBlur = 8;
        this.ctx.fillText(`${this.currentQuestion.factorA} × ${this.currentQuestion.factorB} = ?`, bx + bw / 2, by + bh / 2);
        this.ctx.shadowBlur = 0;
    }

    renderEnemies() {
        this.enemies.forEach(enemy => {
            const curX = enemy.fromX + (enemy.toX - enemy.fromX) * enemy.moveProgress;
            const curY = enemy.fromY + (enemy.toY - enemy.fromY) * enemy.moveProgress;
            const px = curX * CELL_SIZE + CELL_SIZE / 2;
            const py = curY * CELL_SIZE + CELL_SIZE / 2;

            // Sombra
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.beginPath();
            this.ctx.ellipse(px, py + 14, 14, 6, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Corpo do Cronômetro
            this.ctx.fillStyle = enemy.color;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 17, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();

            // Mostrador branco
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(px, py, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Ponteiro giratório do cronômetro
            this.ctx.strokeStyle = '#0f172a';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(px, py);
            this.ctx.lineTo(px + Math.cos(enemy.tickAngle) * 9, py + Math.sin(enemy.tickAngle) * 9);
            this.ctx.stroke();

            // Botão no topo do cronômetro
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(px - 4, py - 22, 8, 4);
        });
    }

    renderHero() {
        const curX = this.hero.fromX + (this.hero.toX - this.hero.fromX) * this.hero.moveProgress;
        const curY = this.hero.fromY + (this.hero.toY - this.hero.fromY) * this.hero.moveProgress;
        const hpx = curX * CELL_SIZE + CELL_SIZE / 2;
        const hpy = curY * CELL_SIZE + CELL_SIZE / 2;

        // Piscar se invulnerável
        if (this.hero.invulnerableTime > 0 && Math.floor(this.hero.animTime * 10) % 2 === 0) {
            return; // Efeito de piscar
        }

        // Aura de proteção se invulnerável
        if (this.hero.invulnerableTime > 0) {
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(hpx, hpy, 22, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Sombra / Propulsor
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(hpx, hpy + 14, 12, 0, Math.PI * 2);
        this.ctx.fill();

        // Cabeça do Robô Bit
        this.ctx.fillStyle = '#6366f1';
        this.ctx.beginPath();
        this.ctx.roundRect(hpx - 15, hpy - 16, 30, 28, [8]);
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Antena
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(hpx, hpy - 16);
        this.ctx.lineTo(hpx, hpy - 23);
        this.ctx.stroke();

        this.ctx.fillStyle = '#facc15';
        this.ctx.beginPath();
        this.ctx.arc(hpx, hpy - 24, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Olhos LED brilhantes
        const eyeOffset = this.hero.facing === 'left' ? -3 : (this.hero.facing === 'right' ? 3 : 0);
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.beginPath();
        this.ctx.arc(hpx - 6 + eyeOffset, hpy - 3, 4, 0, Math.PI * 2);
        this.ctx.arc(hpx + 6 + eyeOffset, hpy - 3, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Iniciar ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    window.mazeGame = new BlinkyMazeGame();
});
