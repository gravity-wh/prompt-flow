# PromptFlow - AI创意灵感库

PromptFlow 是一个现代化的、社区驱动的平台，旨在让分享和发现高质量的 AI 生成创意（Prompts）变得简单而令人上瘾。我们正在构建 "Prompts 的 GitHub"，专为大众用户采用和快速内容发现而优化。

## ✨ 功能特点

- 🎨 **现代化界面**：简约、科技感的设计，高级配色方案
- 📱 **双模式浏览**：
  - **列表模式**：传统的网格布局，便于快速浏览和筛选
  - **流式模式**：类似 TikTok 的沉浸式体验，全屏展示每个 Prompt
- 🗂️ **分类系统**：科技、教育、健康、运动等主题分类
- ✏️ **完整的 CRUD 功能**：
  - 添加新的 Prompt 创意
  - 编辑现有 Prompt
  - 删除 Prompt
  - 查看详细信息
- 🔍 **智能筛选**：按分类快速筛选内容
- 💾 **数据持久化**：使用 SQLite 数据库存储所有 Prompt 数据
- 🚀 **RESTful API**：完整的后端 API 支持

## 📋 数据结构

每个 Prompt 包含以下信息：
- **AI模型**：使用的模型（GPT-4, DALL-E 3, Midjourney 等）
- **模式**：文本生成、图像生成、代码生成等
- **分类**：科技、教育、健康、运动
- **作者**：创建者名称
- **标题**：吸引人的标题
- **简介**：一句话描述
- **Prompt文本**：完整的 Prompt 内容
- **效果图**：展示图片 URL

## 🚀 快速开始

### 前置要求

- Python 3.8 或更高版本
- pip（Python 包管理器）

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/gravity-wh/prompt-flow.git
   cd prompt-flow
   ```

2. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```

3. **启动服务器**
   ```bash
   python app.py
   ```

4. **访问应用**
   
   打开浏览器访问：`http://localhost:5000`

## 📖 使用说明

### 列表模式

1. **浏览 Prompts**：在主页查看所有 Prompt 卡片
2. **分类筛选**：点击顶部的分类按钮（全部、科技、教育、健康、运动）
3. **查看详情**：点击任意卡片查看完整信息
4. **添加 Prompt**：点击右上角的"+ 添加Prompt"按钮
5. **编辑/删除**：在详情页面可以编辑或删除 Prompt

### 流式模式

1. **进入流式模式**：点击顶部导航的"流式模式"链接
2. **浏览方式**：
   - 向下滚动查看下一个 Prompt
   - 向上滚动查看上一个 Prompt
   - 使用键盘方向键导航
3. **查看详情**：点击"查看详情"按钮展开完整信息
4. **返回列表**：点击左上角的"返回列表"按钮

## 🔧 API 文档

### 获取所有 Prompts
```
GET /api/prompts
GET /api/prompts?category=科技
```

### 获取单个 Prompt
```
GET /api/prompts/{id}
```

### 添加新 Prompt
```
POST /api/prompts
Content-Type: application/json

{
  "model": "GPT-4",
  "mode": "Text Generation",
  "category": "科技",
  "author": "作者名",
  "headline": "标题",
  "description": "简介",
  "prompt_text": "完整的Prompt文本",
  "effect_image": "图片URL（可选）"
}
```

### 更新 Prompt
```
PUT /api/prompts/{id}
Content-Type: application/json

{
  "headline": "新标题",
  ...
}
```

### 删除 Prompt
```
DELETE /api/prompts/{id}
```

### 获取所有分类
```
GET /api/categories
```

## 🗄️ 数据库

应用使用 SQLite 数据库（`prompts.db`），在首次启动时自动创建并填充示例数据。

数据库表结构：
```sql
CREATE TABLE prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT NOT NULL,
    mode TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    effect_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 技术栈

### 后端
- **Flask**：轻量级 Web 框架
- **SQLite**：嵌入式数据库
- **Flask-CORS**：跨域资源共享支持

### 前端
- **原生 JavaScript**：无框架依赖
- **CSS3**：现代化样式，渐变、动画、响应式设计
- **HTML5**：语义化标记

## 📁 项目结构

```
prompt-flow/
├── app.py                 # Flask 后端服务器
├── index.html            # 列表模式主页
├── streaming.html        # 流式模式页面
├── requirements.txt      # Python 依赖
├── prompts.db           # SQLite 数据库（自动生成）
├── static/
│   ├── style.css        # 主样式文件
│   ├── streaming.css    # 流式模式样式
│   ├── app.js          # 列表模式 JavaScript
│   ├── streaming.js    # 流式模式 JavaScript
│   └── images/         # 图片资源目录
└── README.md           # 项目文档
```

## 🎯 未来计划

- [ ] 用户认证系统
- [ ] 点赞和收藏功能
- [ ] 评论系统
- [ ] 标签系统
- [ ] 搜索功能
- [ ] 图片上传功能
- [ ] 分享到社交媒体
- [ ] 数据导出功能
- [ ] 多语言支持

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request 或创建 Issue。

## 📄 许可证

MIT License

## 👥 作者

PromptFlow Team

---

**享受创作和分享 AI Prompts 的乐趣！** 🚀
