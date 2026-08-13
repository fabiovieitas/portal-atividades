const wordDatabase = {
    simples: [
        "BOLA", "CASA", "GATO", "SOL", "PATO", "BOLO", "LUA", "MESA", "SAPO", "DADO",
        "LIMAO", "PIPOCA", "MAMAO", "PIPA", "RATO", "FOGO", "VACA", "BOCA", "CACHORRO", "SUCO"
    ],
    medias: [
        "ESCOLA", "BONECA", "JIRAFA", "FUTEBOL", "PANELA", "MACAVO", "TARTARUGA", 
        "CANETA", "JANELA", "CADERNO", "CHUVA", "TREM", "FLORESTA", "ESTRELA", "SAPATO"
    ],
    desafio: [
        "COMPUTADOR", "BORBOLETA", "ASTRONAUTA", "DINOSSAURO", "TECNOLOGIA", 
        "ROBOTICA", "LABORATORIO", "INTELIGENCIA", "UNIVERSO", "EXPERIMENTO"
    ]
};

let currentLevel = 'simples';
let currentWordList = [];
let currentIndex = 0;
let score = 0;
let timer = null;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startGame(level) {
    currentLevel = level;
    currentWordList = [...wordDatabase[level]].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    
    showScreen('game-screen');
    updateWordDisplay();
    startTimer();
}

function updateWordDisplay() {
    if (currentIndex >= currentWordList.length) {
        finishGame();
        return;
    }

    const wordCard = document.getElementById('word-card');
    const wordText = document.getElementById('word-text');
    
    wordCard.classList.remove('pop');
    void wordCard.offsetWidth; // Trigger reflow
    wordCard.classList.add('pop');

    wordText.textContent = currentWordList[currentIndex];

    // Update progress bar
    const progress = ((currentIndex + 1) / currentWordList.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;

    // Auto speak when word appears
    speakWord();
}

function startTimer() {
    clearInterval(timer);
    const speed = document.getElementById('speed-select').value;
    if (speed !== 'manual') {
        const interval = parseInt(speed);
        timer = setInterval(() => {
            nextWord();
        }, interval);
    }
}

function nextWord() {
    if (currentIndex < currentWordList.length - 1) {
        currentIndex++;
        updateWordDisplay();
    } else {
        finishGame();
    }
}

function prevWord() {
    if (currentIndex > 0) {
        currentIndex--;
        updateWordDisplay();
    }
}

function markCorrect() {
    score += 10;
    document.getElementById('score').textContent = score;
    
    // Sparkle effect
    confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 }
    });

    nextWord();
}

function speakWord() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop previous speech
        const word = currentWordList[currentIndex];
        const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8; // Slightly slower for clear reading
        window.speechSynthesis.speak(utterance);
    }
}

function finishGame() {
    clearInterval(timer);
    showScreen('win-screen');
    document.getElementById('final-score-val').textContent = score;

    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
    });
}

function restartGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    startGame(currentLevel);
}

function backToMenu() {
    clearInterval(timer);
    showScreen('setup-screen');
}
