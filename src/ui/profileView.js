import { ProgressService } from "../api/progressService.js";
import { AuthService } from "../api/authService.js";

export function createProfileView({ elements }) {
  const { title, avatar, email, totalNotesStat, recentTopicsList } = elements;

  async function render() {
    const user = AuthService.getCurrentUser();
    if (user && user.username) {
      title.textContent = `${user.username}'s Profile`;
      
      // Update avatar to first letter of username
      if (avatar) avatar.textContent = user.username.charAt(0).toUpperCase();
      
      // Mock an email address based on the username
      if (email) email.textContent = `${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.gradify.app`;
    }

    recentTopicsList.innerHTML = `<li style="text-align: center; color: var(--color-muted);">Loading your progress...</li>`;

    const stats = await ProgressService.getStats();
    totalNotesStat.textContent = stats.totalNotes || 0;

    recentTopicsList.innerHTML = "";
    if (!stats.recentTopics || stats.recentTopics.length === 0) {
      recentTopicsList.innerHTML = `<li class="empty-state">No notes generated yet.</li>`;
    } else {
      stats.recentTopics.forEach(topic => {
        const li = document.createElement("li");
        li.textContent = topic;
        recentTopicsList.appendChild(li);
      });
    }
  }

  return { render };
}
