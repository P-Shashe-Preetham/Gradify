import { AuthService } from "./authService.js";

const API_URL = 'http://localhost:3001/api';

export const ProgressService = {
  async recordNoteGenerated(topic) {
    try {
      const token = AuthService.getToken();
      if (!token) return;

      await fetch(`${API_URL}/user/progress`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic })
      });
    } catch (err) {
      console.error("Failed to record progress:", err);
    }
  },
  
  async getStats() {
    try {
      const token = AuthService.getToken();
      if (!token) return { totalNotes: 0, recentTopics: [] };

      const resp = await fetch(`${API_URL}/user/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (resp.ok) {
        return await resp.json();
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
    return { totalNotes: 0, recentTopics: [] };
  }
};
