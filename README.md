# 英语单词连连看游戏开发文档

## 项目概述
```mermaid
graph TD
    A[游戏功能] --> B[年级选择]
    A --> C[单词配对]
    A --> D[进度保存]
    A --> E[音效系统]
    B --> F[1-9年级]
    C --> G[拖拽连线]
    C --> H[自动关卡]
```

## 技术架构
```mermaid
classDiagram
    class GameEngine {
        +loadWords()
        +generateLevel()
        +checkMatch()
        +saveProgress()
    }
    class UI {
        +renderBoard()
        +showTimer()
        +playSound()
    }
    GameEngine --> UI : 更新状态
```

## 数据结构示例（js/words.js）
```javascript
const wordData = {
  grade1: [
    { en: "apple", cn: "苹果", audio: "apple.mp3" },
    { en: "book", cn: "书", audio: "book.mp3" }
  ],
  //...其他年级数据
};
```

## 快速开始
1. 年级选择下拉菜单（HTML）
```html
<select id="grade-select">
  <option value="1">一年级</option>
  <!-- 2-9年级选项 -->
</select>
```

2. 游戏面板区域（HTML）
```html
<div class="game-board">
  <div class="words-column"></div>
  <div class="meanings-column"></div>
  <canvas id="connection-canvas"></canvas>
</div>
```

## 开发计划
```mermaid
gantt
    title 项目里程碑
    dateFormat  YYYY-MM-DD
    基础框架搭建     :2025-03-03, 3d
    核心逻辑开发     :2025-03-06, 5d
    界面美化        :2025-03-11, 4d
    测试调试        :2025-03-15, 3d
```

## 待办事项
- [ ] 获取人教版官方单词表
- [ ] 录制/生成游戏音效
- [ ] 设计连线动画效果
