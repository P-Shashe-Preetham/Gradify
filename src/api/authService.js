const API_URL = 'http://localhost:3001/api';

export const AuthService = {
  async login(username, password) {
    try {
      const resp = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!resp.ok) return false;
      
      const data = await resp.json();
      localStorage.setItem("gradify_token", data.token);
      localStorage.setItem("gradify_username", data.username);
      window.location.hash = "#dashboard";
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  },
  
  async register(username, password) {
    try {
      const resp = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!resp.ok) return false;
      
      const data = await resp.json();
      localStorage.setItem("gradify_token", data.token);
      localStorage.setItem("gradify_username", data.username);
      window.location.hash = "#dashboard";
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  },
  
  logout() {
    localStorage.removeItem("gradify_token");
    localStorage.removeItem("gradify_username");
    window.location.hash = "#home";
  },
  
  getToken() {
    return localStorage.getItem("gradify_token");
  },
  
  getCurrentUser() {
    const token = this.getToken();
    const username = localStorage.getItem("gradify_username");
    return token ? { username, token } : null;
  },
  
  isAuthenticated() {
    return !!this.getToken();
  }
};
