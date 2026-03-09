const PROGRESS_KEY = "gradify_progress";

function getProgress() {
  const data = localStorage.getItem(PROGRESS_KEY);
  if (!data) {
    return { totalNotes: 0, recentTopics: [] };
  }
  return JSON.parse(data);
}

function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export const ProgressService = {
  recordNoteGenerated(topic) {
    const progress = getProgress();
    progress.totalNotes++;
    
    // Add current topic to top of string list, keep up to 10
    progress.recentTopics.unshift(topic);
    if (progress.recentTopics.length > 10) {
      progress.recentTopics.pop();
    }
    
    saveProgress(progress);
  },
  
  getStats() {
    return getProgress();
  }
};
