// 单词数据
const wordData = {
    '一年级': [
        { word: 'apple', translation: '苹果' },
        { word: 'book', translation: '书' },
        { word: 'cat', translation: '猫' },
        { word: 'dog', translation: '狗' },
        { word: 'egg', translation: '蛋' },
        { word: 'fish', translation: '鱼' },
        { word: 'girl', translation: '女孩' },
        { word: 'hat', translation: '帽子' },
        { word: 'ice', translation: '冰' },
        { word: 'jump', translation: '跳' },
        { word: 'kite', translation: '风筝' },
        { word: 'lion', translation: '狮子' },
        { word: 'moon', translation: '月亮' },
        { word: 'nose', translation: '鼻子' },
        { word: 'pen', translation: '钢笔' },
        { word: 'queen', translation: '女王' },
        { word: 'red', translation: '红色' },
        { word: 'sun', translation: '太阳' },
        { word: 'tree', translation: '树' }
    ]
};

// 当前选择的年级
let currentGrade = '一年级';

// 游戏状态
let selectedCards = [];
let matchedPairs = 0;

// 初始化游戏
function initGame() {
    const gameContainer = document.querySelector('.game-container');
    if (!gameContainer) return;

    // 清空容器
    gameContainer.innerHTML = '';

    // 获取当前年级的单词
    const words = wordData[currentGrade];
    if (!words) return;

    // 创建卡片对（单词和翻译）
    const cards = [];
    words.forEach(item => {
        cards.push(
            { type: 'word', content: item.word },
            { type: 'translation', content: item.translation }
        );
    });

    // 打乱卡片顺序
    shuffleArray(cards);

    // 创建卡片元素
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = card.content;
        cardElement.dataset.type = card.type;
        cardElement.addEventListener('click', () => handleCardClick(cardElement, card));
        gameContainer.appendChild(cardElement);
    });
}

// 处理卡片点击
function handleCardClick(cardElement, card) {
    if (selectedCards.length === 2 || cardElement.classList.contains('matched') || 
        selectedCards.includes(cardElement)) return;

    cardElement.classList.add('selected');
    selectedCards.push({ element: cardElement, data: card });

    if (selectedCards.length === 2) {
        checkMatch();
    }
}

// 检查匹配
function checkMatch() {
    const [card1, card2] = selectedCards;
    const isMatch = (
        (card1.data.type === 'word' && card2.data.type === 'translation') ||
        (card1.data.type === 'translation' && card2.data.type === 'word')
    ) && (
        wordData[currentGrade].some(item => 
            (card1.data.content === item.word && card2.data.content === item.translation) ||
            (card2.data.content === item.word && card1.data.content === item.translation)
        )
    );

    if (isMatch) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === wordData[currentGrade].length) {
            setTimeout(() => alert('恭喜你完成了配对！'), 500);
        }
    } else {
        setTimeout(() => {
            card1.element.classList.remove('selected');
            card2.element.classList.remove('selected');
        }, 1000);
    }

    setTimeout(() => {
        selectedCards = [];
    }, 1000);
}

// 打乱数组顺序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 监听年级选择变化
document.querySelector('select').addEventListener('change', (e) => {
    currentGrade = e.target.value;
    matchedPairs = 0;
    selectedCards = [];
    initGame();
});

// 监听开始游戏按钮点击
document.querySelector('button').addEventListener('click', () => {
    matchedPairs = 0;
    selectedCards = [];
    initGame();
});

// 初始化游戏
initGame();