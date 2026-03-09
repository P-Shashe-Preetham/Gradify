import { createApp } from "./app.js";
import { initParticles } from "./ui/particles.js";

// Initialize animated background
initParticles("bgCanvas");

createApp({
  // Screens
  loginScreen: document.getElementById("loginScreen"),
  homeScreen: document.getElementById("homeScreen"),
  dashboardScreen: document.getElementById("dashboardScreen"),
  feedScreen: document.getElementById("feedScreen"),
  profileScreen: document.getElementById("profileScreen"),
  registerScreen: document.getElementById("registerScreen"),

  // Navigation
  appNav: document.getElementById("appNav"),
  navHome: document.getElementById("navHome"),
  navLogin: document.getElementById("navLogin"),
  navDashboard: document.getElementById("navDashboard"),
  navGenerate: document.getElementById("navGenerate"),
  navProfile: document.getElementById("navProfile"),
  navLogout: document.getElementById("navLogout"),

  // Login View
  loginForm: document.getElementById("loginForm"),
  usernameInput: document.getElementById("usernameInput"),
  passwordInput: document.getElementById("passwordInput"),
  loginError: document.getElementById("loginError"),

  // Register View
  registerForm: document.getElementById("registerForm"),
  regUsernameInput: document.getElementById("regUsernameInput"),
  regPasswordInput: document.getElementById("regPasswordInput"),
  regError: document.getElementById("regError"),

  // Dashboard / Home View
  startLearningButton: document.getElementById("startLearningButton"),
  dashGenerateBtn: document.getElementById("dashGenerateBtn"),
  dashProfileBtn: document.getElementById("dashProfileBtn"),
  dashboardLessonScreen: document.getElementById("dashboardScreen"),

  // Quiz Modal View
  quizModal: document.getElementById("quizModal"),
  closeQuizBtn: document.getElementById("closeQuizBtn"),
  quizTopic: document.getElementById("quizTopic"),
  quizQuestion: document.getElementById("quizQuestion"),
  quizOptions: document.getElementById("quizOptions"),
  quizFeedback: document.getElementById("quizFeedback"),
  
  // Note Generation View
  noteInput: document.getElementById("noteInput"),
  generateButton: document.getElementById("generateButton"),
  copyButton: document.getElementById("copyButton"),
  resetButton: document.getElementById("resetButton"),
  retryButton: document.getElementById("retryButton"),
  inputSection: document.querySelector(".input-section"),
  outputSection: document.getElementById("outputSection"),
  loadingState: document.getElementById("loadingState"),
  notesResult: document.getElementById("notesResult"),
  notesContent: document.getElementById("notesContent"),
  errorState: document.getElementById("errorState"),
  errorMessage: document.getElementById("errorMessage"),

  // Profile View
  profileTitle: document.getElementById("profileTitle"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileEmail: document.getElementById("profileEmail"),
  totalNotesStat: document.getElementById("totalNotesStat"),
  recentTopicsList: document.getElementById("recentTopicsList"),
  
  // Quiz View
  dashboardLessonScreen: document.getElementById("dashboardScreen"),
  quizModal: document.getElementById("quizModal"),
  closeQuizBtn: document.getElementById("closeQuizBtn"),
  quizTopic: document.getElementById("quizTopic"),
  quizQuestion: document.getElementById("quizQuestion"),
  quizOptions: document.getElementById("quizOptions"),
  quizFeedback: document.getElementById("quizFeedback")
});
