export function createDashboardView({ button, onStart }) {
  if (button) {
    button.addEventListener("click", onStart);
  }
}

const icons = ["🧠", "⚛️", "🔬", "💻", "📚", "💡"];

export function renderLessons(topics, container) {
  if (!container) return;
  
  container.innerHTML = "";
  
  if (!topics || topics.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: rgba(255,255,255,0.5); border-radius: var(--radius-lg); border: 1px dashed #cbd5e1;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
        <h3 style="margin: 0 0 0.5rem; font-family: var(--font-heading);">No notes generated yet</h3>
        <p style="color: var(--color-muted); margin: 0;">Create your first note to see it appear here!</p>
      </div>
    `;
    return;
  }
  
  // Deduplicate topics
  const uniqueTopics = [...new Set(topics)];
  
  uniqueTopics.slice(0, 4).forEach((topic, index) => {
    // Generate a basic title from the topic hint
    const shortTitle = topic.length > 30 ? topic.substring(0, 30) + '...' : topic;
    const icon = icons[index % icons.length];
    
    // For data-topic, create a slug-friendly string
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
    
    const card = document.createElement("div");
    card.className = "lesson-card";
    card.innerHTML = `
      <div class="lesson-icon">${icon}</div>
      <div class="lesson-content">
        <h3>${shortTitle}</h3>
        <p>Review your auto-generated notes and test your knowledge on this topic.</p>
        <div class="lesson-actions">
          <button class="button button-secondary button-sm btn-read-notes" data-topic="${slug}">Review Notes</button>
          <button class="button button-primary button-sm btn-take-quiz" data-topic="${slug}">Take Quiz</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
