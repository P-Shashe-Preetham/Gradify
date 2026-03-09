import { AuthService } from "../api/authService.js";

export function createRegisterView({ elements, onRegisterSuccess }) {
  const { form, usernameInput, passwordInput, errorMsg } = elements;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (username && password) {
      if (AuthService.register(username, password)) {
        usernameInput.value = "";
        passwordInput.value = "";
        errorMsg.hidden = true;
        if (onRegisterSuccess) onRegisterSuccess();
      } else {
        errorMsg.hidden = false;
      }
    }
  });

  usernameInput.addEventListener('input', () => errorMsg.hidden = true);
  passwordInput.addEventListener('input', () => errorMsg.hidden = true);

  return { form };
}
