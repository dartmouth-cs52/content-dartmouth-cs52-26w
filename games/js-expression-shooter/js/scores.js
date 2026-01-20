// High Score System using localStorage

const ScoreManager = {
  STORAGE_KEY: 'js-shooter-scores',
  MAX_SCORES: 10,

  // Get all scores
  getScores() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Could not load scores:', e);
      return [];
    }
  },

  // Save scores
  saveScores(scores) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
      console.warn('Could not save scores:', e);
    }
  },

  // Check if score qualifies for high scores
  isHighScore(score) {
    const scores = this.getScores();
    if (scores.length < this.MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
  },

  // Add a new score
  addScore(name, score) {
    const scores = this.getScores();
    const newScore = {
      name: name.toUpperCase().substring(0, 3),
      score: score,
      date: new Date().toISOString().split('T')[0]
    };

    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);

    // Keep only top scores
    const trimmed = scores.slice(0, this.MAX_SCORES);
    this.saveScores(trimmed);

    // Return position (1-indexed)
    return trimmed.findIndex(s => s === newScore) + 1;
  },

  // Get rank for a score (without saving)
  getRank(score) {
    const scores = this.getScores();
    let rank = 1;
    for (const s of scores) {
      if (score <= s.score) rank++;
    }
    return Math.min(rank, this.MAX_SCORES + 1);
  },

  // Clear all scores (for testing)
  clearScores() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // Format scores for display
  formatForDisplay() {
    const scores = this.getScores();
    return scores.map((s, i) => ({
      rank: i + 1,
      name: s.name,
      score: s.score.toLocaleString(),
      date: s.date
    }));
  },

  // Generate HTML for score list
  renderScoresList(listElement) {
    const scores = this.formatForDisplay();
    listElement.innerHTML = '';

    if (scores.length === 0) {
      const li = document.createElement('li');
      li.innerHTML = '<span class="name">NO SCORES YET</span>';
      li.style.justifyContent = 'center';
      listElement.appendChild(li);
      return;
    }

    scores.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="rank">${s.rank}.</span>
        <span class="name">${s.name}</span>
        <span class="score">${s.score}</span>
      `;
      listElement.appendChild(li);
    });
  }
};
