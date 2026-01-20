// Particle System for visual effects

class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = options.vx || (Math.random() - 0.5) * 8;
    this.vy = options.vy || (Math.random() - 0.5) * 8;
    this.life = options.life || 1;
    this.decay = options.decay || 0.02;
    this.size = options.size || Math.random() * 4 + 2;
    this.color = options.color || '#00ff88';
    this.gravity = options.gravity || 0.1;
    this.friction = options.friction || 0.98;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.life -= this.decay;
    this.size *= 0.97;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life <= 0 || this.size < 0.5;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  update() {
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => !p.isDead());
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  // Explosion effect for correct answers
  explode(x, y, color = '#00ff88') {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = Math.random() * 6 + 3;
      this.particles.push(new Particle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        life: 1,
        decay: 0.025,
        size: Math.random() * 5 + 3,
        gravity: 0.05,
        friction: 0.96
      }));
    }
  }

  // Sparkle effect
  sparkle(x, y, color = '#ffaa00') {
    const count = 8;
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, {
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        color: color,
        life: 0.8,
        decay: 0.04,
        size: Math.random() * 3 + 1,
        gravity: 0,
        friction: 0.95
      }));
    }
  }

  // Error effect for wrong answers
  errorBurst(x, y) {
    const count = 15;
    const colors = ['#ff4444', '#ff6666', '#ff8888'];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, {
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.8,
        decay: 0.03,
        size: Math.random() * 4 + 2,
        gravity: 0.15,
        friction: 0.94
      }));
    }
  }

  // Trail effect for bullets
  trail(x, y, color = '#4a4aff') {
    this.particles.push(new Particle(x, y, {
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 2 + 1,
      color: color,
      life: 0.5,
      decay: 0.05,
      size: Math.random() * 2 + 1,
      gravity: 0,
      friction: 1
    }));
  }

  // Combo celebration
  combo(x, y) {
    const colors = ['#ffaa00', '#ff8800', '#ffcc00', '#ffff00'];
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.particles.push(new Particle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.015,
        size: Math.random() * 6 + 2,
        gravity: 0.08,
        friction: 0.97
      }));
    }
  }

  clear() {
    this.particles = [];
  }
}

// Star background
class StarField {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.stars = [];
    this.init();
  }

  init() {
    // Create layered stars for parallax effect
    const layers = [
      { count: 50, size: 1, speed: 0.2, alpha: 0.3 },
      { count: 30, size: 1.5, speed: 0.4, alpha: 0.5 },
      { count: 15, size: 2, speed: 0.6, alpha: 0.7 }
    ];

    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: layer.size,
          speed: layer.speed,
          alpha: layer.alpha,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    });
  }

  update() {
    this.stars.forEach(star => {
      star.y += star.speed;
      star.twinkle += 0.05;

      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    });
  }

  draw(ctx) {
    ctx.save();
    this.stars.forEach(star => {
      const twinkleAlpha = star.alpha * (0.7 + 0.3 * Math.sin(star.twinkle));
      ctx.globalAlpha = twinkleAlpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }
}
