import { ProgressService } from "../api/progressService.js";

export function createQuizView({ elements }) {
  const { modal, closeBtn, topicLabel, questionLabel, optionsContainer, feedbackLabel } = elements;

  let currentQuizData = null;
  let currentQuestionIndex = 0;
  let currentScore = 0;

  function loadQuestion() {
    if (!currentQuizData || currentQuestionIndex >= currentQuizData.questions.length) {
      finishQuiz();
      return;
    }

    const q = currentQuizData.questions[currentQuestionIndex];
    topicLabel.textContent = `${currentQuizData.topic} (Question ${currentQuestionIndex + 1}/${currentQuizData.questions.length})`;
    questionLabel.textContent = q.question;
    feedbackLabel.hidden = true;
    feedbackLabel.className = 'quiz-feedback';
    optionsContainer.innerHTML = '';

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = optText;
      btn.onclick = () => handleAnswer(idx);
      optionsContainer.appendChild(btn);
    });
  }

  function openModal(quizData) {
    if (!quizData || !quizData.questions || quizData.questions.length === 0) return;
    currentQuizData = quizData;
    currentQuestionIndex = 0;
    currentScore = 0;
    modal.hidden = false;
    loadQuestion();
  }

  function finishQuiz() {
    topicLabel.textContent = currentQuizData.topic;
    questionLabel.textContent = `Quiz Complete! You scored ${currentScore} out of ${currentQuizData.questions.length}.`;
    optionsContainer.innerHTML = '';
    feedbackLabel.hidden = true;
    
    // Upload Score
    ProgressService.recordQuizScore(currentQuizData.topic, currentScore, currentQuizData.questions.length);
  }

  function closeModal() {
    modal.hidden = true;
    currentQuizData = null;
  }

  function handleAnswer(selectedIndex) {
    const buttons = Array.from(optionsContainer.children);
    buttons.forEach(btn => btn.style.pointerEvents = 'none');

    const q = currentQuizData.questions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.answerIndex;
    
    if (isCorrect) currentScore++;

    buttons[q.answerIndex].classList.add('correct');
    if (!isCorrect) {
      buttons[selectedIndex].classList.add('incorrect');
    }

    feedbackLabel.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
    feedbackLabel.className = `quiz-feedback ${isCorrect ? 'success' : 'error'}`;
    feedbackLabel.hidden = false;

    // Wait 2 seconds, then load next question
    setTimeout(() => {
      currentQuestionIndex++;
      loadQuestion();
    }, 2000);
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  return { openModal, closeModal };
}
