# 砸金蛋 · 学汉字

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

面向 3–6 岁小朋友的识字网页小游戏。敲开金蛋，认识汉字，听读音、看组词、收集奖章。

仓库地址：[Gitee](https://gitee.com/caifugao110/smash-eggs3) · [GitHub](https://github.com/caifugao110/smash-eggs3)

## 特色

- **50 个主题关卡 / 200 个基础汉字**：数字、自然、动物、身体、家庭、生活、方位、情绪、安全等。
- **砸蛋识字**：4 / 6 / 8 个金蛋可选，看字找字与看图听音交替训练。
- **无惩罚设计**：敲错只蹦小鸡；达到设定次数后自动提示正确答案。
- **完整学习闭环**：汉字卡、拼音、组词、朗读、汉字册、字库总览、复习挑战、学习报告。
- **音效丰富**：Web Audio 合成敲击、碎裂、奖励音效与五声音阶背景音乐。
- **自然中文朗读**：默认真实童声，另有活泼女声、温暖女声和阳光男声可选；本地服务器统一合成并缓存。
- **触屏友好**：大按钮、触摸反馈、震动支持、横屏适配、高对比度与减少动画选项。
- **轻量易部署**：原生 HTML/CSS/JS，无前端构建；自然语音依赖由一键脚本自动安装。

## 运行

### Windows 一键启动（推荐）

安装 Node.js 和 Python 3 后，双击 `start.bat`。脚本会自动创建项目虚拟环境、安装语音依赖并启动服务器。

- 本机访问：<http://127.0.0.1:8123>
- 局域网访问：在手机或另一台电脑的浏览器中输入启动窗口显示的 `http://局域网IP:8123`。
- 首次启动若弹出 Windows 防火墙提示，请仅允许“专用网络”。设备需与服务器连接同一局域网。

自然音色首次合成需要联网，生成后的 MP3 会缓存在本地，可离线重复播放。语音服务异常时自动使用设备自带语音。直接双击 `index.html` 也能玩游戏，但只使用设备语音。

### 手动启动

```powershell
py -3 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
node server.js
```

测试直达链接：<http://127.0.0.1:8123/?level=50>

## 自定义设置

首页右上角 ⚙️ 可调整：总声音、音效、背景音乐、朗读语音、朗读音色、自动读题、音量、语速、金蛋数量、提示方式、提示时间、复习题量、自动下一关、震动反馈、超大按钮、高对比度、减少动画、拼音显示等。设置保存在浏览器本地。

## 文件结构

```text
index.html          页面结构
css/styles.css      基础样式、首页、地图、无障碍
css/game.css        游戏页、金蛋、弹窗、收藏、设置、特效
js/data.js          50 关 × 4 字数据
js/audio.js         Web Audio 音效、背景音乐、自然语音播放与兜底
js/app.js           存档、导航、地图、收藏、设置、特效
js/game.js          游戏主流程、砸蛋、汉字卡、结算、复习
server.js           本地静态服务器、TTS 接口与语音缓存
start.bat           Windows 一键安装与启动入口
requirements.txt    自然语音 Python 依赖
```

## 贡献

欢迎 Fork、Issue 和 Pull Request。新增汉字的标准为：常用、具体、可配 emoji 和生活化组词。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT License](LICENSE) © 2026 caifugao110
