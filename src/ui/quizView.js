export function createQuizView({ elements }) {
  const { modal, closeBtn, topicLabel, questionLabel, optionsContainer, feedbackLabel } = elements;

  const quizData = {
    'intro-ai': {
      title: 'Intro to AI',
      question: 'Which of the following is considered a subset of Artificial Intelligence?',
      options: ['Cloud Computing', 'Machine Learning', 'Quantum Cryptography', 'Blockchain'],
      answerIndex: 1
    },
    'quantum': {
      title: 'Quantum Physics Basics',
      question: 'What principle states that a quantum system can exist in multiple states at once?',
      options: ['Superposition', 'Entanglement', 'Relativity', 'Thermodynamics'],
      answerIndex: 0
    }
  };

  let currentTopic = null;

  function openModal(topicId) {
    currentTopic = quizData[topicId];
    if (!currentTopic) return;

    topicLabel.textContent = currentTopic.title;
    questionLabel.textContent = currentTopic.question;
    feedbackLabel.hidden = true;
    feedbackLabel.className = 'quiz-feedback';
    optionsContainer.innerHTML = '';

    currentTopic.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = optText;
      btn.onclick = () => handleAnswer(idx);
      optionsContainer.appendChild(btn);
    });

    modal.hidden = false;
  }

  function closeModal() {
    modal.hidden = true;
    currentTopic = null;
  }

  function handleAnswer(selectedIndex) {
    const buttons = Array.from(optionsContainer.children);
    
    // Disable all options
    buttons.forEach(btn => btn.style.pointerEvents = 'none');

    const isCorrect = selectedIndex === currentTopic.answerIndex;
    
    // Highlight correct & incorrect
    buttons[currentTopic.answerIndex].classList.add('correct');
    if (!isCorrect) {
      buttons[selectedIndex].classList.add('incorrect');
    }

    feedbackLabel.textContent = isCorrect ? 'Correct! Great job.' : 'Incorrect. Review your notes and try again!';
    feedbackLabel.className = `quiz-feedback ${isCorrect ? 'success' : 'error'}`;
    feedbackLabel.hidden = false;
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  return { openModal, closeModal };
}
