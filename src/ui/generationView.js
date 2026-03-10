import { AuthService } from "../api/authService.js";

const API_URL = 'http://localhost:3001/api';
function setStateVisibility({ elements, showInput, showLoading, showResult, showError }) {
  elements.inputSection.hidden = !showInput;
  elements.outputSection.hidden = !showLoading && !showResult && !showError;
  elements.loadingState.hidden = !showLoading;
  elements.notesResult.hidden = !showResult;
  elements.errorState.hidden = !showError;
}

export function createGenerationView({ elements, handlers }) {
  const { 
    noteInput, generateButton, copyButton, resetButton, retryButton,
    inputSection, outputSection, loadingState, notesResult, notesContent, errorState, errorMessage
  } = elements;

  // Handle Input Changes
  noteInput.addEventListener("input", () => {
    generateButton.disabled = noteInput.value.trim().length === 0;
  });

  // Handle Generation
  const triggerGeneration = async () => {
    const text = noteInput.value.trim();
    if (!text) return;

    // Show Loading
    setStateVisibility({ elements, showInput: false, showLoading: true, showResult: false, showError: false });

    try {
      const token = AuthService.getToken();
      
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ topic: text })
      });

      if (!response.ok) {
        throw new Error("Failed to generate notes. Please try again.");
      }

      const data = await response.json();
      const topicTitle = data.topic || text;
      const combinedMarkdown = `# ${topicTitle}\n\n## Study Notes\n${data.notes}\n\n## Step-by-Step Lesson Plan\n${data.lessonPlan}`;
      
      // Parse markdown to HTML using the 'marked' library injected in index.html
      const htmlContent = window.marked ? window.marked.parse(combinedMarkdown) : combinedMarkdown;
      notesContent.innerHTML = htmlContent;

      // Show Result
      setStateVisibility({ elements, showInput: false, showLoading: false, showResult: true, showError: false });
      
      if (handlers && handlers.onQuizReady && data.quiz) {
        handlers.onQuizReady({ topic: topicTitle, questions: data.quiz });
      }
    } catch (error) {
      errorMessage.textContent = error.message || "An unexpected error occurred.";
      // Show Error
      setStateVisibility({ elements, showInput: false, showLoading: false, showResult: false, showError: true });
    }
  };

  generateButton.addEventListener("click", triggerGeneration);
  retryButton.addEventListener("click", triggerGeneration);

  // Handle Copy
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(notesContent.innerText).then(() => {
      const originalText = copyButton.textContent;
      copyButton.textContent = "Copied!";
      setTimeout(() => copyButton.textContent = originalText, 2000);
    });
  });

  // Handle Reset
  resetButton.addEventListener("click", () => {
    noteInput.value = "";
    generateButton.disabled = true;
    setStateVisibility({ elements, showInput: true, showLoading: false, showResult: false, showError: false });
    noteInput.focus();
    
    if (handlers && handlers.onReset) {
      handlers.onReset();
    }
  });

  return {
    showInput() {
      setStateVisibility({ elements, showInput: true, showLoading: false, showResult: false, showError: false });
    }
  };
}
