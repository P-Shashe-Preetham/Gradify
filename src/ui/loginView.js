import { AuthService } from "../api/authService.js";

export function createLoginView({ elements, onLoginSuccess }) {
  const { form, usernameInput, passwordInput, errorMsg } = elements;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (username && password) {
      if (AuthService.login(username, password)) {
        usernameInput.value = "";
        passwordInput.value = "";
        errorMsg.hidden = true;
        if (onLoginSuccess) onLoginSuccess();
      } else {
        errorMsg.hidden = false;
      }
    }
  });

  usernameInput.addEventListener('input', () => errorMsg.hidden = true);
  passwordInput.addEventListener('input', () => errorMsg.hidden = true);

  return {};
}
