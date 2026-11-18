# 砸金蛋 · 学汉字

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

面向 3–6 岁小朋友的识字网页小游戏。敲开金蛋，认识汉字，听读音、看组词、收集奖章。

仓库地址：<https://github.com/caifugao110/smash-eggs3>

## 特色

- **50 个主题关卡 / 200 个基础汉字**：数字、自然、动物、身体、家庭、生活、方位、情绪、安全等。
- **砸蛋识字**：4 / 6 / 8 个金蛋可选，看字找字与看图听音交替训练。
- **无惩罚设计**：敲错只蹦小鸡；达到设定次数后自动提示正确答案。
- **完整学习闭环**：汉字卡、拼音、组词、朗读、汉字册、字库总览、复习挑战、学习报告。
- **音效丰富**：Web Audio 合成敲击、碎裂、奖励音效与五声音阶背景音乐，中文朗读可调节。
- **触屏友好**：大按钮、触摸反馈、震动支持、横屏适配、高对比度与减少动画选项。
- **完全离线**：原生 HTML/CSS/JS，无依赖、无构建、无联网资源。

## 运行

直接双击 `index.html` 即可开始玩。推荐 Chrome 或 Edge。

可选本地服务器：

```bash
node server.js
```

然后访问 <http://localhost:8123>。

测试直达链接：`index.html?level=50`

## 自定义设置

首页右上角 ⚙️ 可调整：总声音、音效、背景音乐、朗读语音、自动读题、音量、语速、音调、金蛋数量、提示方式、提示时间、复习题量、自动下一关、震动反馈、超大按钮、高对比度、减少动画、拼音显示等。设置保存在浏览器本地。

## 文件结构

```text
index.html          页面结构
styles.css          基础样式、首页、地图、无障碍
game.css            游戏页、金蛋、弹窗、收藏、设置、特效
js/data.js          50 关 × 4 字数据
js/audio.js         Web Audio 音效、背景音乐、中文朗读
js/app.js           存档、导航、地图、收藏、设置、特效
js/game.js          游戏主流程、砸蛋、汉字卡、结算、复习
server.js           可选的本地静态服务器
游戏方案.md         完整设计文档
```

## 贡献

欢迎 Fork、Issue 和 Pull Request。新增汉字的标准为：常用、具体、可配 emoji 和生活化组词。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT License](LICENSE) © 2026 caifugao110
