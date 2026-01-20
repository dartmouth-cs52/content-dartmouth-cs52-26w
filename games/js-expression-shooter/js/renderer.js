// Renderer - Canvas drawing utilities

const Renderer = {
  // Clear canvas with gradient background
  clear(ctx, canvas) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0d0d2b');
    gradient.addColorStop(1, '#1a1a3e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },

  // Draw scan lines for retro effect
  drawScanLines(ctx, canvas, intensity = 0.03) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 2);
    }
    ctx.restore();
  },

  // Draw vignette effect
  drawVignette(ctx, canvas) {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
      canvas.width / 2, canvas.height / 2, canvas.height * 0.8
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },

  // Screen shake effect
  applyScreenShake(ctx, intensity = 5) {
    const shakeX = (Math.random() - 0.5) * intensity;
    const shakeY = (Math.random() - 0.5) * intensity;
    ctx.translate(shakeX, shakeY);
    return { x: shakeX, y: shakeY };
  },

  // Flash effect for hit feedback
  drawFlash(ctx, canvas, color = 'rgba(255, 255, 255, 0.3)') {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  },

  // Draw category indicator
  drawCategory(ctx, category, x, y) {
    const colors = {
      'type-coercion': '#4a90d9',
      'truthy-falsy': '#9b59b6',
      'equality': '#e74c3c',
      'typeof': '#f39c12',
      'arrays': '#2ecc71',
      'objects': '#1abc9c',
      'unlimited': '#ff00ff'
    };

    const names = {
      'type-coercion': 'TYPE COERCION',
      'truthy-falsy': 'TRUTHY/FALSY',
      'equality': 'EQUALITY',
      'typeof': 'TYPEOF',
      'arrays': 'ARRAYS',
      'objects': 'OBJECTS',
      'unlimited': '⭐ UNLIMITED ⭐'
    };

    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = colors[category] || '#888888';
    ctx.fillText(names[category] || category.toUpperCase(), x, y);
    ctx.restore();
  },

  // Draw difficulty stars
  drawDifficulty(ctx, level, x, y) {
    ctx.save();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#ffaa00';
    let stars = '';
    for (let i = 0; i < level && i < 6; i++) {
      stars += '★';
    }
    for (let i = level; i < 6; i++) {
      stars += '☆';
    }
    ctx.fillText(stars, x, y);
    ctx.restore();
  },

  // Draw progress bar
  drawProgressBar(ctx, x, y, width, height, progress, color = '#00ff88') {
    ctx.save();

    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(x, y, width, height);

    // Fill
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * Math.min(1, progress), height);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.restore();
  },

  // Draw countdown timer
  drawCountdown(ctx, x, y, timeRemaining, maxTime) {
    const progress = timeRemaining / maxTime;
    const color = progress > 0.3 ? '#00ff88' : (progress > 0.1 ? '#ffaa00' : '#ff4444');

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(Math.ceil(timeRemaining / 1000), x, y);

    ctx.restore();
  },

  // Draw level up notification
  drawLevelUp(ctx, canvas, categoryName, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.font = '14px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 20;

    ctx.fillText('NEW CATEGORY UNLOCKED!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(categoryName, canvas.width / 2, canvas.height / 2 + 20);

    ctx.restore();
  },

  // Draw victory notification
  drawVictory(ctx, canvas, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;

    // Big rainbow glow effect
    const gradient = ctx.createLinearGradient(0, canvas.height / 2 - 50, canvas.width, canvas.height / 2 + 50);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.2, '#ffaa00');
    gradient.addColorStop(0.4, '#ffff00');
    gradient.addColorStop(0.6, '#00ff00');
    gradient.addColorStop(0.8, '#00ffff');
    gradient.addColorStop(1, '#ff00ff');

    ctx.font = 'bold 28px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 30;

    ctx.fillText('🎉 YOU WIN! 🎉', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '14px "Press Start 2P", cursive';
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillText('UNLIMITED MODE UNLOCKED!', canvas.width / 2, canvas.height / 2 + 20);

    ctx.restore();
  }
};
