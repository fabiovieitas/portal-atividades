/**
 * LABIRINTO DOS CAMPEÕES: AVENTURA DA TABUADA
 * Inspirado na mecânica do Blinky's Maze (Digipuzzle)
 * Autor: Professor Fábio Vieitas / Lab Kids
 */

// --- CONFIGURAÇÃO DO LABIRINTO E GRID ---
const COLS = 15;
const ROWS = 11;
const CELL_SIZE = 48; // Canvas 720 x 528

// 1 = Parede Neon, 0 = Caminho Livre
const MAZE_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

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

    playMove() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playCorrect() {
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

    playHit() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.28);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
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
        utter.rate = 1.0;
        utter.pitch = 1.1;
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
        const colors = ['#facc15', '#10b981', '#38bdf8', '#ec4899', '#818cf8', '#ef4444'];
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
class MazeGame {
    constructor() {
        this.sound = new SoundEngine();
        this.confetti = new ConfettiEngine('confetti-canvas');

        this.canvas = document.getElementById('maze-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = COLS * CELL_SIZE; // 720
        this.canvas.height = ROWS * CELL_SIZE; // 528

        this.level = 1; // 1: 2-4, 2: 5-7, 3: 8-10
        this.lives = 3;
        this.score = 0;
        this.questionsSolved = 0;
        this.targetQuestions = 5;

        // Current Math Question
        this.currentQuestion = { factorA: 3, factorB: 4, answer: 12 };

        // Hero state (Robô Bit)
        this.hero = {
            gridX: 1,
            gridY: 1,
            pixelX: 1 * CELL_SIZE,
            pixelY: 1 * CELL_SIZE,
            targetPixelX: 1 * CELL_SIZE,
            targetPixelY: 1 * CELL_SIZE,
            dirX: 0,
            dirY: 0,
            nextDirX: 0,
            nextDirY: 0,
            speed: 4,
            facing: 'right',
            animFrame: 0
        };

        // Enemies: Cronômetros Malucos
        this.enemies = [
            { gridX: 13, gridY: 1, dirX: -1, dirY: 0, color: '#ef4444', tick: 0 },
            { gridX: 7, gridY: 5, dirX: 1, dirY: 0, color: '#f59e0b', tick: 0 },
            { gridX: 1, gridY: 9, dirX: 1, dirY: 0, color: '#ec4899', tick: 0 }
        ];

        // Numbered Items scattered in maze
        this.items = [];

        this.isGameOver = false;
        this.isVictory = false;

        this.initDOM();
        this.bindControls();
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

    bindControls() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'KeyW'].includes(e.code)) this.setHeroDirection(0, -1, 'up');
            if (['ArrowDown', 'KeyS'].includes(e.code)) this.setHeroDirection(0, 1, 'down');
            if (['ArrowLeft', 'KeyA'].includes(e.code)) this.setHeroDirection(-1, 0, 'left');
            if (['ArrowRight', 'KeyD'].includes(e.code)) this.setHeroDirection(1, 0, 'right');
        });

        // Touch Virtual D-Pad
        const bindBtn = (id, dx, dy, facing) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const handler = (e) => {
                e.preventDefault();
                this.sound.init();
                this.setHeroDirection(dx, dy, facing);
            };
            btn.addEventListener('pointerdown', handler);
        };

        bindBtn('dpad-up', 0, -1, 'up');
        bindBtn('dpad-down', 0, 1, 'down');
        bindBtn('dpad-left', -1, 0, 'left');
        bindBtn('dpad-right', 1, 0, 'right');

        // Level selector buttons
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.sound.playCorrect();
                this.startLevel(parseInt(btn.dataset.level, 10));
            });
        });
    }

    setHeroDirection(dx, dy, facing) {
        this.sound.init();
        this.hero.nextDirX = dx;
        this.hero.nextDirY = dy;
        this.hero.facing = facing;
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
        this.confetti.stop();

        this.updateHUD();
        this.resetHero();
        this.resetEnemies();
        this.generateMathQuestion();
    }

    resetHero() {
        this.hero.gridX = 1;
        this.hero.gridY = 1;
        this.hero.pixelX = 1 * CELL_SIZE;
        this.hero.pixelY = 1 * CELL_SIZE;
        this.hero.dirX = 0;
        this.hero.dirY = 0;
        this.hero.nextDirX = 0;
        this.hero.nextDirY = 0;
    }

    resetEnemies() {
        this.enemies[0].gridX = 13; this.enemies[0].gridY = 1; this.enemies[0].dirX = -1; this.enemies[0].dirY = 0;
        this.enemies[1].gridX = 7;  this.enemies[1].gridY = 5; this.enemies[1].dirX = 1;  this.enemies[1].dirY = 0;
        this.enemies[2].gridX = 1;  this.enemies[2].gridY = 9; this.enemies[2].dirX = 1;  this.enemies[2].dirY = 0;
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
        this.sound.speak(`Quanto é ${factorA} vezes ${factorB}?`);

        this.spawnItems(answer);
    }

    spawnItems(correctAnswer) {
        this.items = [];
        const candidateSpots = [];

        // Coletar todos os espaços livres do labirinto longe do spawn
        for (let r = 1; r < ROWS - 1; r++) {
            for (let c = 1; c < COLS - 1; c++) {
                if (MAZE_MAP[r][c] === 0 && !(r === 1 && c === 1)) {
                    candidateSpots.push({ x: c, y: r });
                }
            }
        }

        // Embaralhar spots
        candidateSpots.sort(() => Math.random() - 0.5);

        // Gerar 3 valores errados próximos
        const values = [correctAnswer];
        while (values.length < 4) {
            const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
            const wrongVal = Math.max(2, correctAnswer + offset);
            if (!values.includes(wrongVal)) values.push(wrongVal);
        }

        // Embaralhar valores
        values.sort(() => Math.random() - 0.5);

        // Definir itens com ícones de esportes
        const sportIcons = ['⚽', '🏀', '🎾', '🏐'];

        for (let i = 0; i < 4; i++) {
            const spot = candidateSpots[i];
            this.items.push({
                gridX: spot.x,
                gridY: spot.y,
                value: values[i],
                isCorrect: values[i] === correctAnswer,
                icon: sportIcons[i],
                pulse: 0
            });
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
        const delta = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (!this.isGameOver && !this.isVictory) {
            this.update(delta);
        }
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(delta) {
        this.hero.animFrame += delta * 6;

        // Atualizar movimento do herói por grid
        const atGridX = this.hero.pixelX % CELL_SIZE === 0;
        const atGridY = this.hero.pixelY % CELL_SIZE === 0;

        if (atGridX && atGridY) {
            this.hero.gridX = Math.round(this.hero.pixelX / CELL_SIZE);
            this.hero.gridY = Math.round(this.hero.pixelY / CELL_SIZE);

            // Tentar mudar para a próxima direção se livre
            if (this.canMove(this.hero.gridX + this.hero.nextDirX, this.hero.gridY + this.hero.nextDirY)) {
                this.hero.dirX = this.hero.nextDirX;
                this.hero.dirY = this.hero.nextDirY;
            } else if (!this.canMove(this.hero.gridX + this.hero.dirX, this.hero.gridY + this.hero.dirY)) {
                this.hero.dirX = 0;
                this.hero.dirY = 0;
            }
        }

        if (this.hero.dirX !== 0 || this.hero.dirY !== 0) {
            this.hero.pixelX += this.hero.dirX * this.hero.speed;
            this.hero.pixelY += this.hero.dirY * this.hero.speed;
            this.sound.playMove();
        }

        // Atualizar movimento dos inimigos (Cronômetros)
        this.updateEnemies(delta);

        // Checar colisão com Itens da Tabuada
        this.checkItemCollisions();

        // Checar colisão com Inimigos
        this.checkEnemyCollisions();
    }

    canMove(gx, gy) {
        if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return false;
        return MAZE_MAP[gy][gx] === 0;
    }

    updateEnemies(delta) {
        this.enemies.forEach(enemy => {
            enemy.tick += delta * 5;
            // Movimento simples e inteligente por corredores
            const nextX = enemy.gridX + enemy.dirX;
            const nextY = enemy.gridY + enemy.dirY;

            if (this.canMove(nextX, nextY) && Math.random() > 0.05) {
                enemy.gridX = nextX;
                enemy.gridY = nextY;
            } else {
                // Virar em cruzamentos
                const dirs = [
                    { x: 1, y: 0 }, { x: -1, y: 0 },
                    { x: 0, y: 1 }, { x: 0, y: -1 }
                ].filter(d => this.canMove(enemy.gridX + d.x, enemy.gridY + d.y));

                if (dirs.length > 0) {
                    const chosen = dirs[Math.floor(Math.random() * dirs.length)];
                    enemy.dirX = chosen.x;
                    enemy.dirY = chosen.y;
                }
            }
        });
    }

    checkItemCollisions() {
        const hx = Math.round(this.hero.pixelX / CELL_SIZE);
        const hy = Math.round(this.hero.pixelY / CELL_SIZE);

        for (let i = 0; i < this.items.length; i++) {
            const it = this.items[i];
            if (it.gridX === hx && it.gridY === hy) {
                if (it.isCorrect) {
                    // ACERTO!
                    this.sound.playCorrect();
                    this.score += 150;
                    this.questionsSolved++;
                    this.sound.speak(`Correto! ${this.currentQuestion.factorA} vezes ${this.currentQuestion.factorB} é igual a ${this.currentQuestion.answer}!`);
                    this.updateHUD();

                    if (this.questionsSolved >= this.targetQuestions) {
                        this.triggerVictory();
                    } else {
                        this.generateMathQuestion();
                    }
                } else {
                    // ERRO
                    this.sound.playHit();
                    this.lives--;
                    this.sound.speak(`Não é ${it.value}! Tente novamente!`);
                    this.updateHUD();
                    this.items.splice(i, 1);

                    if (this.lives <= 0) {
                        this.triggerGameOver();
                    }
                }
                break;
            }
        }
    }

    checkEnemyCollisions() {
        const hx = Math.round(this.hero.pixelX / CELL_SIZE);
        const hy = Math.round(this.hero.pixelY / CELL_SIZE);

        this.enemies.forEach(enemy => {
            if (enemy.gridX === hx && enemy.gridY === hy) {
                this.sound.playHit();
                this.lives--;
                this.sound.speak("Cuidado com o cronômetro!");
                this.updateHUD();
                this.resetHero();

                if (this.lives <= 0) {
                    this.triggerGameOver();
                }
            }
        });
    }

    triggerVictory() {
        this.isVictory = true;
        this.sound.playVictory();
        this.confetti.start();
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
        this.ctx.fillStyle = '#090d16';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Renderizar Paredes do Labirinto Neon
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const px = c * CELL_SIZE;
                const py = r * CELL_SIZE;

                if (MAZE_MAP[r][c] === 1) {
                    // Parede 3D Neon
                    this.ctx.fillStyle = '#1e1b4b';
                    this.ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

                    this.ctx.strokeStyle = '#38bdf8';
                    this.ctx.lineWidth = 2.5;
                    this.ctx.shadowColor = '#38bdf8';
                    this.ctx.shadowBlur = 8;
                    this.ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                    this.ctx.shadowBlur = 0;
                } else {
                    // Caminho Livre - Pequenos pontinhos brilhantes
                    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
                    this.ctx.beginPath();
                    this.ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 2.5, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        // 3. Renderizar Itens Esportivos com Números Flutuantes
        this.items.forEach(it => {
            const px = it.gridX * CELL_SIZE + CELL_SIZE / 2;
            const py = it.gridY * CELL_SIZE + CELL_SIZE / 2;

            // Halo Brilhante
            this.ctx.fillStyle = it.isCorrect ? 'rgba(250, 204, 21, 0.25)' : 'rgba(56, 189, 248, 0.15)';
            this.ctx.beginPath();
            this.ctx.arc(px, py, 18, 0, Math.PI * 2);
            this.ctx.fill();

            // Ícone Esportivo (Bola)
            this.ctx.font = '20px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(it.icon, px, py - 4);

            // Badge com o Número da Tabuada
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 13px Fredoka, sans-serif';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(it.value, px, py + 14);
            this.ctx.shadowBlur = 0;
        });

        // 4. Renderizar Inimigos (Cronômetros Malucos)
        this.enemies.forEach(enemy => {
            const px = enemy.gridX * CELL_SIZE + CELL_SIZE / 2;
            const py = enemy.gridY * CELL_SIZE + CELL_SIZE / 2;

            // Corpo do Cronômetro
            this.ctx.fillStyle = enemy.color;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 16, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();

            // Ponteiro giratório
            const angle = enemy.tick;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(px, py);
            this.ctx.lineTo(px + Math.cos(angle) * 10, py + Math.sin(angle) * 10);
            this.ctx.stroke();

            // Botãozinho no topo do cronômetro
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(px - 3, py - 20, 6, 4);
        });

        // 5. Renderizar o Herói (Robô Bit Atleta)
        const hpx = this.hero.pixelX + CELL_SIZE / 2;
        const hpy = this.hero.pixelY + CELL_SIZE / 2;

        // Propulsão / Sombra
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(hpx, hpy + 10, 12, 0, Math.PI * 2);
        this.ctx.fill();

        // Cabeça do Robô Bit
        this.ctx.fillStyle = '#818cf8';
        this.ctx.beginPath();
        this.ctx.roundRect(hpx - 14, hpy - 14, 28, 26, [8]);
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Antena com luz amarela
        this.ctx.fillStyle = '#facc15';
        this.ctx.beginPath();
        this.ctx.arc(hpx, hpy - 18, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Olhos expressivos LED
        this.ctx.fillStyle = '#38bdf8';
        const eyeOffset = this.hero.facing === 'left' ? -2 : (this.hero.facing === 'right' ? 2 : 0);
        this.ctx.beginPath();
        this.ctx.arc(hpx - 5 + eyeOffset, hpy - 3, 3.5, 0, Math.PI * 2);
        this.ctx.arc(hpx + 5 + eyeOffset, hpy - 3, 3.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Iniciar após carregamento do DOM
window.addEventListener('DOMContentLoaded', () => {
    window.mazeGame = new MazeGame();
});
