export class GameEngine {
  constructor(data) {
    this.questions = data.questions || [];
    this.currentIndex = 0;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || { text: 'Nenhuma pergunta disponível.', options: [] };
  }

  checkAnswer(index) {
    const current = this.getCurrentQuestion();
    return parseInt(index, 10) === current.correctAnswer;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }
}

