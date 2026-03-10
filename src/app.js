import { AuthService } from "./api/authService.js";
import { ProgressService } from "./api/progressService.js";
import { createDashboardView, renderLessons } from "./ui/dashboardView.js";
import { createGenerationView } from "./ui/generationView.js";
import { createLoginView } from "./ui/loginView.js";
import { createRegisterView } from "./ui/registerView.js";
import { createProfileView } from "./ui/profileView.js";
import { createQuizView } from "./ui/quizView.js";
import { hashForScreen, Screen, screenFromHash } from "./ui/router.js";

function toggleScreenVisibility(screens, activeScreen) {
  Object.values(screens).forEach((screenEl, index) => {
    if (!screenEl) return;
    const isVisible = Object.values(Screen)[index] === activeScreen;
    screenEl.classList.toggle("screen-active", isVisible);
    screenEl.setAttribute("aria-hidden", String(!isVisible));
    screenEl.hidden = !isVisible;
  });
}

function updateNavVisibility({ appNav, navHome, navLogin, navDashboard, navGenerate, navProfile, navLogout }) {
  if (appNav) appNav.hidden = false; // Always show nav now, but toggle links
  
  const isAuth = AuthService.isAuthenticated();
  if (navHome) navHome.hidden = isAuth;
  if (navLogin) navLogin.hidden = isAuth;
  if (navDashboard) navDashboard.hidden = !isAuth;
  if (navGenerate) navGenerate.hidden = !isAuth;
  if (navProfile) navProfile.hidden = !isAuth;
  if (navLogout) navLogout.hidden = !isAuth;
}

export function createApp(elements) {
  const {
    loginScreen,
    homeScreen,
    dashboardScreen,
    feedScreen,
    profileScreen,
    appNav,
    navHome,
    navLogin,
    navDashboard,
    navGenerate,
    navProfile,
    navLogout,
    loginForm,
    usernameInput,
    passwordInput,
    loginError,
    registerScreen,
    registerForm,
    regUsernameInput,
    regPasswordInput,
    regError,
    startLearningButton,
    dashGenerateBtn,
    dashProfileBtn,
    noteInput,
    generateButton,
    copyButton,
    resetButton,
    retryButton,
    inputSection,
    outputSection,
    loadingState,
    notesResult,
    notesContent,
    errorState,
    errorMessage,
    profileTitle,
    profileAvatar,
    profileEmail,
    totalNotesStat,
    averageScoreStat,
    recentTopicsList,
    dashboardLessonScreen,
    quizModal,
    closeQuizBtn,
    quizTopic,
    quizQuestion,
    quizOptions,
    quizFeedback,
    notesQuizBtn
  } = elements;

  const screens = { homeScreen, loginScreen, registerScreen, dashboardScreen, feedScreen, profileScreen };

  const loginView = createLoginView({
    elements: { form: loginForm, usernameInput, passwordInput, errorMsg: loginError },
    onLoginSuccess: handleRouteChange
  });

  const registerView = createRegisterView({
    elements: { form: registerForm, usernameInput: regUsernameInput, passwordInput: regPasswordInput, errorMsg: regError },
    onRegisterSuccess: handleRouteChange
  });

  const profileView = createProfileView({
    elements: { 
      title: profileTitle, 
      avatar: profileAvatar,
      email: profileEmail,
      totalNotesStat, 
      avgScoreStat: averageScoreStat,
      recentTopicsList 
    }
  });

  const generationView = createGenerationView({
    elements: {
      noteInput, generateButton, copyButton, resetButton, retryButton,
      inputSection, outputSection, loadingState, notesResult, notesContent, errorState, errorMessage
    },
    handlers: {
      onReset: () => {
        notesQuizBtn.hidden = true;
      },
      onQuizReady: (quizData) => {
        notesQuizBtn.hidden = false;
        notesQuizBtn.onclick = () => quizView.openModal(quizData);
      }
    }
  });

  const quizView = createQuizView({
    elements: {
      modal: quizModal,
      closeBtn: closeQuizBtn,
      topicLabel: quizTopic,
      questionLabel: quizQuestion,
      optionsContainer: quizOptions,
      feedbackLabel: quizFeedback
    }
  });

  // Intercept the generate button click inside generationView to also record progress
  // Since generationView triggers generation internally, an easier hook is to listen to the Generate button directly here
  // But wait, the generate function is encapsulated. We can wrap the event or add an onSuccess handler.
  // For MVP, we will just listen to the button click and record the input value *before* it clears.
  // Actually, generationView allows handlers object, but we didn't add onSuccess. 
  // Let's modify the Note Generator button event slightly by adding a listener here that just fires concurrently:
  generateButton.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (text) {
      // It might fail, but for mock purposes, we record generation attempt
      ProgressService.recordNoteGenerated(text.slice(0, 50) + (text.length > 50 ? "..." : ""));
    }
  });


  async function handleRouteChange() {
    let screen = screenFromHash(window.location.hash);
    
    // Route Guard
    const isPublicScreen = screen === Screen.LOGIN || screen === Screen.REGISTER || screen === Screen.HOME;
    
    if (!AuthService.isAuthenticated() && !isPublicScreen) {
      window.location.hash = hashForScreen(Screen.HOME);
      return;
    } else if (AuthService.isAuthenticated() && isPublicScreen) {
      window.location.hash = hashForScreen(Screen.DASHBOARD);
      return;
    }

    toggleScreenVisibility(screens, screen);
    updateNavVisibility({ appNav, navHome, navLogin, navDashboard, navGenerate, navProfile, navLogout });

    if (screen === Screen.FEED) {
      generationView.showInput();
    } else if (screen === Screen.PROFILE) {
      profileView.render();
    } else if (screen === Screen.DASHBOARD) {
      // Show loading state temporarily if desired, or just await
      const grid = document.getElementById('dashboardLessonGrid');
      if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading lessons...</div>';
      
      const stats = await ProgressService.getStats();
      renderLessons(stats.recentTopics, document.getElementById('dashboardLessonGrid'));
    }
  }

  createDashboardView({
    button: startLearningButton, // Start Learning on Home
    onStart: () => window.location.hash = hashForScreen(Screen.LOGIN) // Unauth goes to login
  });

  if (dashGenerateBtn) dashGenerateBtn.addEventListener("click", () => window.location.hash = hashForScreen(Screen.FEED));
  if (dashProfileBtn) dashProfileBtn.addEventListener("click", () => window.location.hash = hashForScreen(Screen.PROFILE));

  // Setup Navigation
  if (navHome) navHome.addEventListener("click", () => window.location.hash = hashForScreen(Screen.HOME));
  if (navLogin) navLogin.addEventListener("click", () => window.location.hash = hashForScreen(Screen.LOGIN));
  if (navDashboard) navDashboard.addEventListener("click", () => window.location.hash = hashForScreen(Screen.DASHBOARD));
  if (navGenerate) navGenerate.addEventListener("click", () => window.location.hash = hashForScreen(Screen.FEED));
  if (navProfile) navProfile.addEventListener("click", () => window.location.hash = hashForScreen(Screen.PROFILE));
  if (navLogout) navLogout.addEventListener("click", () => AuthService.logout());

  // Setup Dashboard Lessons
  if (dashboardLessonScreen) {
    dashboardLessonScreen.addEventListener('click', (e) => {
      // Handle "Take Quiz"
      if (e.target.classList.contains('btn-take-quiz')) {
        quizView.openModal(e.target.dataset.topic);
      }
      
      // Handle "Read Notes"
      if (e.target.classList.contains('btn-read-notes')) {
        const topic = e.target.dataset.topic;
        noteInput.value = `Explain ${topic.replace('-', ' ')} in detail`;
        window.location.hash = hashForScreen(Screen.FEED);
        // Automatically trigger generate click after a short delay
        setTimeout(() => {
          if (!generateButton.disabled) generateButton.click();
        }, 100);
      }
    });
  }

  window.addEventListener("hashchange", handleRouteChange);
  handleRouteChange();

  return {};
}
