# AiLM - AI Life Cycle Management Platform

AiLM 是一个企业级的 AI 全生命周期管理平台（线稿风格演示版），用于管理机器学习（AutoML）和大语言模型（LLM/Dify）项目。

## 🛠 技术栈

- **核心框架**: React 18, TypeScript, Vite
- **路由**: React Router DOM
- **样式**: Tailwind CSS (自定义线稿主题)
- **图表**: Recharts
- **图标**: Lucide React

## 🚀 本地部署与运行指南

### 1. 环境准备

确保您的电脑已安装 Node.js (推荐 v18 或更高版本)。
可以通过以下命令检查：

```bash
node -v
npm -v
```

### 2. 安装依赖

在项目根目录下运行以下命令安装所需依赖：

```bash
npm install
```

### 3. 启动开发服务器

安装完成后，运行以下命令启动本地开发环境：

```bash
npm run dev
```

终端将显示本地访问地址（通常为 `http://localhost:5173`），在浏览器中打开即可看到应用。

### 4. 构建生产版本

如果您需要部署到生产环境（如 Nginx、Vercel 或 Netlify），请运行：

```bash
npm run build
```

构建产物将生成在 `dist` 目录下。您可以通过 `npm run preview` 预览构建后的效果。

## 📂 项目结构

```
.
├── components/      # 通用 UI 组件 (Layout, etc.)
├── context/         # 全局状态管理 (AppContext)
├── pages/           # 页面组件 (Dashboard, AutoML, AIStudio, etc.)
├── services/        # API 服务 (Mocked)
├── App.tsx          # 路由配置
├── index.css        # 全局样式 & Tailwind 指令
├── index.html       # 入口 HTML
├── tailwind.config.js # Tailwind 配置
└── vite.config.ts   # Vite 构建配置
```

## ⚠️ 注意事项

- **Mock 数据**: 当前版本所有数据（用户登录、项目列表、训练状态）均为前端 Mock 数据，刷新页面后部分状态会重置。
- **AutoML 演示**: AutoML 流程是模拟的，不涉及真实的后端 Python 训练服务。
- **Dify 集成**: AI Studio 页面通过 iframe 嵌入外部 Dify 链接，确保网络环境可以访问目标 Dify 地址。
