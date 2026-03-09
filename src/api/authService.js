export const AuthService = {
  _getUsers() {
    const users = localStorage.getItem("gradify_users");
    return users ? JSON.parse(users) : [];
  },

  _saveUsers(users) {
    localStorage.setItem("gradify_users", JSON.stringify(users));
  },

  login(username, password) {
    const users = this._getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem("gradify_user", JSON.stringify({ username }));
      window.location.hash = "#dashboard";
      return true;
    }
    return false;
  },
  
  register(username, password) {
    const users = this._getUsers();
    if (users.find(u => u.username === username)) {
      return false; // Username already exists
    }
    
    users.push({ username, password });
    this._saveUsers(users);
    
    // Auto login
    localStorage.setItem("gradify_user", JSON.stringify({ username }));
    window.location.hash = "#dashboard";
    return true;
  },
  
  logout() {
    localStorage.removeItem("gradify_user");
    window.location.hash = "#home";
  },
  
  getCurrentUser() {
    const user = localStorage.getItem("gradify_user");
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};
