// app.js - Controller
import { fetchGameData } from './api.js';
import { GameEngine } from './game-engine.js';

const init = async () => {
  console.log('Initializing game...');
  const data = await fetchGameData();
  console.log('Data loaded:', data);
  const engine = new GameEngine(data);
  renderCurrentQuestion(engine);


};

const renderCurrentQuestion = (engine) => {
  const question = engine.getCurrentQuestion();
  const questionEl = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  if (!questionEl || !optionsContainer) return;

  questionEl.textContent = question.text;
  optionsContainer.innerHTML = '';
  question.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.index = idx;
    btn.textContent = opt;
    optionsContainer.appendChild(btn);
  });

  optionsContainer.addEventListener('click', (e) => {
    if (e.target.matches('.option-btn')) {
      const isCorrect = engine.checkAnswer(e.target.dataset.index);
      alert(isCorrect ? 'Correto!' : 'Tente novamente');
      if (isCorrect && engine.nextQuestion()) {
        renderCurrentQuestion(engine);
      }
    }
  }, { once: true });
};

document.addEventListener('DOMContentLoaded', init);

