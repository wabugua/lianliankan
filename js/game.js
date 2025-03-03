class GameEngine {
  constructor() {
    this.selectedCard = null;
    this.currentLevel = 1;
    this.canvas = document.getElementById('connection-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.initEventListeners();
    this.resizeCanvas();
  }

  initEventListeners() {
    document.getElementById('start-btn').addEventListener('click', () => {
      const grade = document.getElementById('grade-select').value;
      const semester = document.getElementById('semester-select').value;
      this.startGame(grade, semester);
    });

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startGame(grade, semester) {
    this.currentGrade = grade;
    this.currentSemester = semester;
    this.wordsPool = [...wordData[`grade${grade}`][semester]];
    this.currentLevel = 1;
    this.loadLevel();
  }

  checkLevelCompletion() {
    const remaining = document.querySelectorAll('.word-card').length;
    if (remaining === 0) {
      if (this.wordsPool.length > 0) {
        // 获取正确的列选择器
        const enColumn = document.getElementById('english-column');
        const cnColumn = document.getElementById('chinese-column');
        
        // 添加淡出动画
        enColumn.style.transition = 'opacity 0.3s, transform 0.3s';
        cnColumn.style.transition = 'opacity 0.3s, transform 0.3s';
        enColumn.style.opacity = '0';
        cnColumn.style.opacity = '0';
        enColumn.style.transform = 'translateY(20px)';
        cnColumn.style.transform = 'translateY(20px)';

        // 延迟加载新关卡
        setTimeout(() => {
          // 重置列的内容
          enColumn.innerHTML = '';
          cnColumn.innerHTML = '';
          
          // 加载新关卡
          this.loadLevel();
          
          // 重置过渡属性以确保新卡片初始状态正确
          enColumn.style.transition = 'none';
          cnColumn.style.transition = 'none';
          enColumn.style.opacity = '0';
          cnColumn.style.opacity = '0';
          enColumn.style.transform = 'translateY(20px)';
          cnColumn.style.transform = 'translateY(20px)';
          
          // 强制重排
          enColumn.offsetHeight;
          cnColumn.offsetHeight;
          
          // 重新添加过渡效果并设置最终状态
          enColumn.style.transition = 'opacity 0.3s, transform 0.3s';
          cnColumn.style.transition = 'opacity 0.3s, transform 0.3s';
          enColumn.style.opacity = '1';
          cnColumn.style.opacity = '1';
          enColumn.style.transform = 'translateY(0)';
          cnColumn.style.transform = 'translateY(0)';
        }, 300);
      } else {
        const semesterText = this.currentSemester === 'semester1' ? '上学期' : '下学期';
        alert(`${document.getElementById('grade-select').options[this.currentGrade-1].text}${semesterText}的单词已全部完成！`);
      }
      this.updateLevelDisplay();
    }
  }

  loadLevel() {
    const levelWords = this.getRandomWords();
    this.renderWords(levelWords);
    this.updateLevelDisplay();
    this.currentLevel++;
  }

  updateLevelDisplay() {
    // 检查是否已存在关卡显示元素
    let levelDisplay = document.getElementById('level-display');
    
    // 如果不存在，创建一个
    if (!levelDisplay) {
      levelDisplay = document.createElement('div');
      levelDisplay.id = 'level-display';
      levelDisplay.className = 'level-display';
      document.querySelector('.controls').appendChild(levelDisplay);
      
      // 添加关卡显示的CSS样式
      const style = document.createElement('style');
      style.textContent = `
        .level-display {
          background-color: var(--primary-color);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 更新关卡显示内容
    const totalLevels = Math.ceil(wordData[`grade${this.currentGrade}`][this.currentSemester].length / 6);
    levelDisplay.textContent = `关卡: ${this.currentLevel}/${totalLevels}`;
  }

  getRandomWords() {
    // 每次取6组单词（12张卡片）
    const currentBatch = this.wordsPool.splice(0, 6);
    return currentBatch
      .flatMap(word => [
        { ...word, type: 'en' },
        { ...word, type: 'cn' }
      ])
      .sort(() => Math.random() - 0.5);
  }

  renderWords(words) {
    const enColumn = document.getElementById('english-column');
    const cnColumn = document.getElementById('chinese-column');
    
    enColumn.innerHTML = '';
    cnColumn.innerHTML = '';

    words.forEach(word => {
      const card = this.createCardElement(word);
      if (word.type === 'en') {
        enColumn.appendChild(card);
      } else {
        cnColumn.appendChild(card);
      }
    });
  }

  createCardElement(word) {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.textContent = word.type === 'en' ? word.en : word.cn;
    card.dataset.wordId = word.en;
    card.dataset.type = word.type;
    
    card.addEventListener('click', (e) => this.handleCardClick(e, card));
    return card;
  }

  handleCardClick(e, card) {
    if (!this.selectedCard) {
      this.selectedCard = card;
      card.classList.add('active');
      this.startDrawingLine(e);
    } else {
      this.verifyMatch(card);
    }
  }

  startDrawingLine(startEvent) {
    const startPos = this.getCardPosition(this.selectedCard);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#e74c3c';

    const draw = (moveEvent) => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(startPos.x, startPos.y);
      this.ctx.lineTo(moveEvent.clientX, moveEvent.clientY);
      this.ctx.stroke();
    };

    const stopDrawing = () => {
      this.canvas.removeEventListener('mousemove', draw);
      this.canvas.removeEventListener('mouseup', stopDrawing);
    };

    this.canvas.addEventListener('mousemove', draw);
    this.canvas.addEventListener('mouseup', stopDrawing);
  }

  verifyMatch(secondCard) {
    const isMatch = this.selectedCard.dataset.wordId === secondCard.dataset.wordId &&
                    this.selectedCard.dataset.type !== secondCard.dataset.type;

    if (isMatch) {
      this.removeMatchedPair(this.selectedCard, secondCard);
      this.checkLevelCompletion();
    }
    
    this.clearSelection();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  removeMatchedPair(card1, card2) {
    card1.style.opacity = '0';
    card2.style.opacity = '0';
    setTimeout(() => {
      card1.remove();
      card2.remove();
      // 在卡片移除后检查关卡是否完成
      this.checkLevelCompletion();
    }, 300);
  }

  clearSelection() {
    if (this.selectedCard) {
      this.selectedCard.classList.remove('active');
      this.selectedCard = null;
    }
  }

  getCardPosition(card) {
    const rect = card.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
}

// 初始化游戏引擎
document.addEventListener('DOMContentLoaded', () => {
  const gameEngine = new GameEngine();
});
