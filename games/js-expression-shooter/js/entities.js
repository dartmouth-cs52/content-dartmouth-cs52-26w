// Game Entities: Player, Expression Block, Bullet

class Player {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = 50;
    this.height = 40;
    this.x = canvas.width / 2;
    this.y = canvas.height - 120;
    this.targetX = this.x;
    this.speed = 0.15; // Smoothing factor
  }

  update() {
    // Smooth movement towards target
    this.x += (this.targetX - this.x) * this.speed;
  }

  moveTo(x) {
    this.targetX = Math.max(this.width / 2, Math.min(this.canvas.width - this.width / 2, x));
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Ship body - triangle
    ctx.fillStyle = '#4a4aff';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.closePath();
    ctx.fill();

    // Glow effect
    ctx.shadowColor = '#6a6aff';
    ctx.shadowBlur = 15;
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Engine glow
    ctx.fillStyle = '#ff6600';
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(-12, this.height / 2 + 5, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, this.height / 2 + 5, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class ExpressionBlock {
  constructor(canvas, question) {
    this.canvas = canvas;
    this.question = question;
    this.expression = question.expression;
    this.x = canvas.width / 2;
    this.y = 50;
    this.targetY = 280; // Final resting position - centered in canvas for visibility

    // Calculate width based on text length
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 20px Consolas, "Courier New", monospace';
    const textWidth = ctx.measureText(this.expression + ' = ?').width;
    this.width = Math.max(280, textWidth + 60); // Min 280, or text width + padding

    this.height = 80;
    this.speed = 0.8;
    this.arrived = false;
    this.wobble = 0;
    this.glowIntensity = 0;
  }

  update() {
    if (!this.arrived) {
      this.y += this.speed;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.arrived = true;
      }
    }

    // Wobble animation
    this.wobble += 0.05;
    this.glowIntensity = 0.5 + 0.5 * Math.sin(this.wobble);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Slight wobble when descending
    if (!this.arrived) {
      ctx.rotate(Math.sin(this.wobble * 2) * 0.02);
    }

    // Glow
    ctx.shadowColor = `rgba(100, 100, 255, ${this.glowIntensity * 0.6})`;
    ctx.shadowBlur = 20;

    // Background box
    ctx.fillStyle = 'rgba(30, 30, 60, 0.9)';
    ctx.strokeStyle = `rgba(100, 100, 200, ${0.5 + this.glowIntensity * 0.3})`;
    ctx.lineWidth = 2;

    this.roundRect(ctx, -this.width / 2, -this.height / 2, this.width, this.height, 10);
    ctx.fill();
    ctx.stroke();

    // Expression text
    ctx.shadowBlur = 0;
    ctx.font = 'bold 20px Consolas, "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Code styling with colors
    ctx.fillStyle = '#ffcc66';
    ctx.fillText(this.expression + ' = ?', 0, 0);

    ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Check if descended too far (player loses life)
  isExpired() {
    return this.y > this.canvas.height;
  }
}

class Bullet {
  constructor(startX, startY, targetX, targetY, answerIndex) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.answerIndex = answerIndex;
    this.speed = 15;
    this.size = 6;
    this.trail = [];

    // Calculate direction
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;

    this.arrived = false;
  }

  update(particleSystem) {
    this.x += this.vx;
    this.y += this.vy;

    // Add trail particles
    if (particleSystem && Math.random() > 0.5) {
      particleSystem.trail(this.x, this.y + 5);
    }

    // Check if reached target area
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20 || this.y < this.targetY) {
      this.arrived = true;
    }
  }

  draw(ctx) {
    ctx.save();

    // Glow
    ctx.shadowColor = '#4a4aff';
    ctx.shadowBlur = 15;

    // Bullet body
    ctx.fillStyle = '#88aaff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Floating text for score popups
class FloatingText {
  constructor(x, y, text, color = '#00ff88') {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 1;
    this.vy = -2;
  }

  update() {
    this.y += this.vy;
    this.life -= 0.02;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.font = 'bold 18px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}
