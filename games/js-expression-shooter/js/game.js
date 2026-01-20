// Main Game Controller

class Game {
  constructor() {
    // Canvas setup
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Game state
    this.state = 'menu'; // menu, playing, paused, gameover
    this.score = 0;
    this.lives = 3;
    this.combo = 0;
    this.maxCombo = 0;
    this.questionsAnswered = 0;
    this.learnMode = true;

    // Entities
    this.player = null;
    this.currentExpression = null;
    this.bullets = [];
    this.floatingTexts = [];

    // Systems
    this.particleSystem = new ParticleSystem();
    this.starField = new StarField(this.canvas.width, this.canvas.height);

    // Current question data
    this.currentQuestion = null;
    this.answers = [];
    this.correctIndex = -1;

    // Visual effects state
    this.screenShake = 0;
    this.flash = null;
    this.levelUpNotification = null;
    this.victoryNotification = null;

    // Timing
    this.lastTime = 0;
    this.deltaTime = 0;

    // Bind methods
    this.gameLoop = this.gameLoop.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    // Initialize
    this.setupEventListeners();
    this.setupUI();

    // Start render loop (for menu animations)
    requestAnimationFrame(this.gameLoop);
  }

  resizeCanvas() {
    const container = document.getElementById('game-container');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
  }

  setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (this.starField) {
        this.starField.resize(this.canvas.width, this.canvas.height);
      }
    });

    // Mouse/touch for shooting
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);

    // Answer buttons
    document.querySelectorAll('.answer-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => this.shoot(index));
    });
  }

  setupUI() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());

    // High scores button
    document.getElementById('scores-btn').addEventListener('click', () => this.showScores());

    // Back from scores
    document.getElementById('back-btn').addEventListener('click', () => this.showMenu());

    // Learn mode toggle
    const learnToggle = document.getElementById('learn-mode-toggle');
    learnToggle.addEventListener('change', (e) => {
      this.learnMode = e.target.checked;
    });

    // Game over buttons
    document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
    document.getElementById('menu-btn').addEventListener('click', () => this.showMenu());

    // Save score button
    document.getElementById('save-score-btn').addEventListener('click', () => this.saveHighScore());

    // Enter key for initials input
    document.getElementById('initials-input').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.saveHighScore();
    });
  }

  handleClick(e) {
    if (this.state !== 'playing') return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (this.player) {
      this.player.moveTo(x);
    }
  }

  handleMouseMove(e) {
    if (this.state !== 'playing') return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (this.player) {
      this.player.moveTo(x);
    }
  }

  // Game state management
  startGame() {
    this.state = 'playing';
    this.score = 0;
    this.lives = 10;
    this.combo = 0;
    this.maxCombo = 0;
    this.questionsAnswered = 0;
    this.bullets = [];
    this.floatingTexts = [];
    this.currentExpression = null;
    this.currentQuestion = null;

    // Create player
    this.player = new Player(this.canvas);

    // Hide screens, show HUD
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('scores-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('answers').classList.remove('hidden');

    this.updateHUD();
    this.nextQuestion();
  }

  showMenu() {
    this.state = 'menu';
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('scores-screen').classList.add('hidden');
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('answers').classList.add('hidden');
  }

  showScores() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('scores-screen').classList.remove('hidden');
    ScoreManager.renderScoresList(document.getElementById('scores-list'));
  }

  gameOver() {
    this.state = 'gameover';

    document.getElementById('hud').classList.add('hidden');
    document.getElementById('answers').classList.add('hidden');
    document.getElementById('gameover-screen').classList.remove('hidden');
    document.getElementById('final-score-value').textContent = this.score.toLocaleString();

    // Check for high score
    if (ScoreManager.isHighScore(this.score)) {
      document.getElementById('highscore-entry').classList.remove('hidden');
      document.getElementById('initials-input').value = '';
      document.getElementById('initials-input').focus();
    } else {
      document.getElementById('highscore-entry').classList.add('hidden');
    }
  }

  saveHighScore() {
    const input = document.getElementById('initials-input');
    const name = input.value.trim() || 'AAA';
    ScoreManager.addScore(name, this.score);
    document.getElementById('highscore-entry').classList.add('hidden');
  }

  // Question management
  nextQuestion() {
    const currentCategory = getCurrentCategory(this.questionsAnswered);

    // Check for WIN condition (completed all 6 levels)
    if (hasWonGame(this.questionsAnswered)) {
      this.showVictoryNotification();
      // Delay the UNLIMITED mode question until after victory celebration
      setTimeout(() => this.spawnQuestion(currentCategory), 3500);
      return;
    }
    // Check if we moved to a new level
    else if (this.questionsAnswered > 0) {
      const prevCategory = getCurrentCategory(this.questionsAnswered - 1);
      if (currentCategory !== prevCategory) {
        this.showLevelUpNotification(CATEGORY_NAMES[currentCategory]);
      }
    }

    this.spawnQuestion(currentCategory);
  }

  spawnQuestion(category) {
    this.currentQuestion = getRandomQuestion(category);
    const prepared = WrongAnswerGenerator.prepareAnswers(this.currentQuestion);
    this.answers = prepared.answers;
    this.correctIndex = prepared.correctIndex;

    // Update answer buttons
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
      btn.textContent = this.answers[i];
      btn.classList.remove('correct', 'wrong');
      btn.disabled = false;
    });

    // Create expression block
    this.currentExpression = new ExpressionBlock(this.canvas, this.currentQuestion);
  }

  showLevelUpNotification(categoryName) {
    this.levelUpNotification = {
      category: categoryName,
      alpha: 1,
      timer: 120 // frames
    };
  }

  showVictoryNotification() {
    this.victoryNotification = {
      alpha: 1,
      timer: 180 // frames (3 seconds)
    };
    // Big particle celebration
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.particleSystem.explode(
          Math.random() * this.canvas.width,
          Math.random() * this.canvas.height * 0.5,
          ['#ffcc00', '#ff6600', '#00ff88', '#ff00ff', '#00ffff'][i]
        );
      }, i * 200);
    }
  }

  shoot(answerIndex) {
    if (this.state !== 'playing' || !this.currentExpression) {
      return;
    }

    // Disable buttons temporarily
    document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);

    // Create bullet from player to expression
    const buttons = document.querySelectorAll('.answer-btn');
    const buttonRect = buttons[answerIndex].getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    const bullet = new Bullet(
      this.player.x,
      this.player.y - 20,
      this.currentExpression.x,
      this.currentExpression.y,
      answerIndex
    );
    this.bullets.push(bullet);

    // Highlight selected button
    buttons[answerIndex].classList.add(answerIndex === this.correctIndex ? 'correct' : 'wrong');
  }

  handleAnswer(answerIndex) {
    const isCorrect = answerIndex === this.correctIndex;

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }

    // Show learn mode popup if enabled
    if (this.learnMode) {
      this.showLearnPopup(isCorrect);
    } else {
      // Delay before next question
      setTimeout(() => this.nextQuestion(), 500);
    }

    this.questionsAnswered++;
    this.updateHUD();
  }

  handleCorrectAnswer() {
    // Combo
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);

    // Calculate score
    let points = 100;

    // Combo multiplier
    if (this.combo >= 10) points = Math.floor(points * 3);
    else if (this.combo >= 5) points = Math.floor(points * 2);
    else if (this.combo >= 3) points = Math.floor(points * 1.5);

    // Difficulty bonus
    const difficulty = this.currentQuestion.difficulty;
    points = Math.floor(points * (1 + (difficulty - 1) * 0.25));

    this.score += points;

    // Visual effects
    this.particleSystem.explode(
      this.currentExpression.x,
      this.currentExpression.y,
      '#00ff88'
    );

    if (this.combo >= 5) {
      this.particleSystem.combo(this.currentExpression.x, this.currentExpression.y);
    }

    // Floating text
    this.floatingTexts.push(new FloatingText(
      this.currentExpression.x,
      this.currentExpression.y - 50,
      `+${points}`,
      '#00ff88'
    ));
  }

  handleWrongAnswer() {
    this.combo = 0;
    this.lives--;

    // Visual effects
    this.particleSystem.errorBurst(
      this.currentExpression.x,
      this.currentExpression.y
    );

    this.screenShake = 10;
    this.flash = { color: 'rgba(255, 0, 0, 0.2)', frames: 10 };

    // Shake container
    document.getElementById('game-container').classList.add('shake');
    setTimeout(() => {
      document.getElementById('game-container').classList.remove('shake');
    }, 300);

    if (this.lives <= 0) {
      setTimeout(() => this.gameOver(), 1000);
    }
  }

  showLearnPopup(isCorrect) {
    const popup = document.getElementById('learn-popup');
    const expr = document.getElementById('learn-expression');
    const result = document.getElementById('learn-result');
    const explanation = document.getElementById('learn-explanation');
    const hint = document.getElementById('learn-hint');

    expr.textContent = this.currentQuestion.expression;
    result.textContent = `= ${this.currentQuestion.correct}`;
    result.className = isCorrect ? 'correct' : 'wrong';
    explanation.textContent = this.currentQuestion.explanation;

    // Show "click to continue" hint for wrong answers
    if (isCorrect) {
      hint.classList.add('hidden');
    } else {
      hint.classList.remove('hidden');
    }

    popup.classList.remove('hidden');

    // Wrong answers require click to continue (no auto-dismiss)
    // Correct answers auto-dismiss after 2 seconds
    if (isCorrect) {
      setTimeout(() => {
        popup.classList.add('hidden');
        if (this.lives > 0) {
          this.nextQuestion();
        }
      }, 2000);
    }

    // Click to dismiss (required for wrong answers)
    popup.onclick = () => {
      popup.classList.add('hidden');
      if (this.lives > 0) {
        this.nextQuestion();
      }
    };
  }

  updateHUD() {
    document.getElementById('score').textContent = this.score.toLocaleString();

    // Lives as hearts
    const hearts = '❤️'.repeat(this.lives) + '🖤'.repeat(Math.max(0, 10 - this.lives));
    document.getElementById('lives').textContent = hearts;

    // Combo
    const comboEl = document.getElementById('combo');
    if (this.combo >= 3) {
      comboEl.classList.remove('hidden');
      comboEl.textContent = `🔥 x${this.combo}`;
    } else {
      comboEl.classList.add('hidden');
    }
  }

  // Game loop
  gameLoop(currentTime) {
    // Delta time calculation
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update
    this.update();

    // Render
    this.render();

    // Continue loop
    requestAnimationFrame(this.gameLoop);
  }

  update() {
    // Always update starfield for menu background
    this.starField.update();

    if (this.state !== 'playing') return;

    // Update player
    if (this.player) {
      this.player.update();
    }

    // Update expression
    if (this.currentExpression) {
      this.currentExpression.update();
    }

    // Update bullets
    this.bullets.forEach(bullet => {
      bullet.update(this.particleSystem);

      if (bullet.arrived) {
        this.handleAnswer(bullet.answerIndex);
      }
    });
    this.bullets = this.bullets.filter(b => !b.arrived);

    // Update particles
    this.particleSystem.update();

    // Update floating texts
    this.floatingTexts.forEach(ft => ft.update());
    this.floatingTexts = this.floatingTexts.filter(ft => !ft.isDead());

    // Update screen shake
    if (this.screenShake > 0) {
      this.screenShake -= 0.5;
    }

    // Update flash
    if (this.flash) {
      this.flash.frames--;
      if (this.flash.frames <= 0) {
        this.flash = null;
      }
    }

    // Update level up notification
    if (this.levelUpNotification) {
      this.levelUpNotification.timer--;
      if (this.levelUpNotification.timer < 30) {
        this.levelUpNotification.alpha -= 0.033;
      }
      if (this.levelUpNotification.timer <= 0) {
        this.levelUpNotification = null;
      }
    }

    // Update victory notification
    if (this.victoryNotification) {
      this.victoryNotification.timer--;
      if (this.victoryNotification.timer < 30) {
        this.victoryNotification.alpha -= 0.033;
      }
      if (this.victoryNotification.timer <= 0) {
        this.victoryNotification = null;
      }
    }
  }

  render() {
    const ctx = this.ctx;

    // Apply screen shake
    ctx.save();
    if (this.screenShake > 0) {
      Renderer.applyScreenShake(ctx, this.screenShake);
    }

    // Clear and draw background
    Renderer.clear(ctx, this.canvas);
    this.starField.draw(ctx);

    // Only draw game elements when playing
    if (this.state === 'playing') {
      // Draw particles (behind entities)
      this.particleSystem.draw(ctx);

      // Draw expression block
      if (this.currentExpression) {
        this.currentExpression.draw(ctx);

        // Draw category indicator
        if (this.currentQuestion) {
          Renderer.drawCategory(
            ctx,
            this.currentQuestion.category,
            this.currentExpression.x,
            this.currentExpression.y - 55
          );
        }
      }

      // Draw bullets
      this.bullets.forEach(bullet => bullet.draw(ctx));

      // Draw player
      if (this.player) {
        this.player.draw(ctx);
      }

      // Draw floating texts
      this.floatingTexts.forEach(ft => ft.draw(ctx));

      // Draw flash effect
      if (this.flash) {
        Renderer.drawFlash(ctx, this.canvas, this.flash.color);
      }

      // Draw level up notification
      if (this.levelUpNotification) {
        Renderer.drawLevelUp(
          ctx,
          this.canvas,
          this.levelUpNotification.category,
          this.levelUpNotification.alpha
        );
      }

      // Draw victory notification
      if (this.victoryNotification) {
        Renderer.drawVictory(
          ctx,
          this.canvas,
          this.victoryNotification.alpha
        );
      }
    }

    // Post-processing effects
    Renderer.drawScanLines(ctx, this.canvas);
    Renderer.drawVignette(ctx, this.canvas);

    ctx.restore();
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
