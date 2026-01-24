# 念舒的数字花园 (Digital Garden)

> 一个基于 **Next.js 16** 和 **React 19** 构建的现代化个人博客与数字花园。
> 融合了技术笔记、生活随笔与个人服务导航，致力于提供优雅、快速且极致的阅读体验。

[![部署状态](https://img.shields.io/badge/Deploy-Docker-2496ED?style=flat-square&logo=docker)](https://hub.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

🌐 **在线访问**: [https://blog.nianshu2022.cn](https://blog.nianshu2022.cn)

---

## ✨ 核心特性

### � 极致性能与技术
- **Next.js 16 (App Router)**: 拥抱最新的 React 服务端组件 (RSC) 架构。
- **Turbopack**: 采用 Rust 编写的下一代打包工具，秒级热更新。
- **React 19**: 尝鲜最新的 React 特性。
- **Tailwind CSS 4**: 下一代 CSS 框架，构建高性能的原子化样式。
- **PWA 支持**: 支持安装到桌面或手机，离线访问能力（Service Worker）。
- **静态导出 (SSG)**: 纯静态 HTML 生成，依托 Edge Network 实现全球极速加载。

### 📝 内容与体验
- **双内容流**: 
  - **技术博客**: 专注代码、部署与技术折腾。
  - **生活随笔**: 记录感悟、阅读与生活点滴（独立样式设计）。
- **极简快捷交互**:
  - **命令菜单 (Command Menu)**: 支持 `Ctrl + K` 或 `/` 快捷键，全局快速搜索文章。
  - **动态问候语**: 首页根据当前时间段（清晨、午后、深夜等）展示温馨问候。
- **极致阅读体验**:
  - **暗黑模式**: 支持系统跟随及手动一键切换，完美适配持久化。
  - **Markdown 渲染**: 基于 `react-markdown` + `rehype-slug` + `rehype-sanitize` 的安全渲染，支持 GFM 语法与标题自动描点。
  - **精美表格**: 专门为技术博文优化的表格样式（Responsive & Styled Table）。
  - **代码高亮**: 精美的代码块样式。
  - **阅读进度**: 顶部的阅读进度条，直观反馈阅读状态。
  - **滚动记忆**: 智能记录列表页滚动位置，丝滑的返回体验。
  - **文章导航**: 底部自动关联“上一篇”与“下一篇”，引导深度阅读。
- **SEO & 传播**:
  - **JSON-LD**: 自动生成结构化数据，大幅提升搜索引擎收录权重。
  - **RSS 订阅**: 自动生成 `feed.xml`，页脚快速订阅入口。
- **交互与统计**:
  - **评论系统**: 集成 [Giscus](https://giscus.app/)，基于 GitHub Discussions。
  - **访问统计**: 集成不蒜子 (Busuanzi) 统计，已解决跨域兼容性问题。

### 🎨 界面设计
- **现代化 UI**: 基于极致简洁的审美，使用 Radix UI 无头组件库配合 Lucide 图标。
- **动态效果**: 平滑的过渡动画、背景毛玻璃效果与细腻的微交互。
- **响应式布局**: 全设备、全尺寸完美适配。

---

## 🛠️ 技术栈清单

| 类别 | 技术/库 | 说明 |
| --- | --- | --- |
| **核心框架** | [Next.js 16.1](https://nextjs.org/) | App Router, Turbopack |
| **UI 库** | [React 19](https://react.dev/) | Server Components, Actions |
| **样式** | [Tailwind CSS 4](https://tailwindcss.com/) | Styling, Dark Mode |
| **内容处理** | `gray-matter` | Frontmatter 解析 |
| | `react-markdown` | Markdown 转 React 组件 |
| | `rehype-sanitize` | **安全加固**，防止 XSS 攻击 |
| | `rehype-slug` | 自动生成标题 ID |
| | `remark-gfm` | 表格、删除线等扩展语法 |
| | `reading-time` | 阅读时长预估 |
| **图标** | [Lucide React](https://lucide.dev/) | 现代化图标库 |
| **评论** | [@giscus/react](https://giscus.app/) | 评论系统 |
| **工具** | `clsx` + `tailwind-merge` | 样式类名合并 |
| **部署** | Docker + Nginx | 容器化部署 |

---

## 🚀 本地开发

### 环境要求
- **Node.js**: 18.17 或更高版本
- **包管理器**: npm, yarn, pnpm 或 bun

### 1. 克隆项目
```bash
git clone https://github.com/nianshu2022/my-portfolio.git
cd my-portfolio
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
使用 Turbopack 启动开发环境：
```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 4. 构建生产版本
```bash
npm run build
```
构建产物将位于 `.next/` 目录（或 `out/` 目录，取决于配置）。

---

## 📝 内容创作指南

### 1. 新建文章
在 `src/content` 目录下创建 Markdown 文件：
- **技术博客**: `src/content/posts/YYYY/filename.md`
- **生活随笔**: `src/content/essays/filename.md`

### 2. Frontmatter 格式
文件头部需包含 YAML 格式的元数据：

```markdown
---
title: "Next.js 16 尝鲜体验"
date: "2025-01-23"
description: "探索 Turbopack 带来的极致开发体验..."
tags: ["Next.js", "React", "Frontend"]
cover: "/img/cover-nextjs.png"  # [可选] 封面图，存放在 public/img/
award: ""                        # [可选] 随笔专属：获奖或特殊标注
---

这里是正文内容...
```

### 3. 图片引用
支持标准 Markdown 图片语法，图片建议存放于 `public/img/`：
```markdown
![图片描述](/img/my-image.png)
```
支持通过 URL 参数控制样式：
- `?width=500px`: 强制设置宽度
- `?shadow=true`: 添加阴影效果

---

## 🌐 部署指南 (Docker)
 
推荐使用 Docker 容器化部署，支持所有云厂商服务器。

### 1. 本地构建 (必选)
由于 Dockerfile 采用静态文件复制模式，请先在本地生成构建产物：
```bash
npm run build
```
*(构建产物将输出至 `out/` 目录)*

### 2. 构建 Docker 镜像
```bash
docker build -t my-portfolio .
```
 
### 3. 运行容器
```bash
docker run -d -p 80:80 --name my-portfolio --restart always my-portfolio
```

### 4. 高级配置 (可选)
如果需要自定义 Nginx 配置，可以挂载配置文件：
```bash
docker run -d -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf \
  --name my-portfolio my-portfolio
```

---

## 📁 目录结构

```
.
├── public/                 # 静态资源 (图片, favicon, sw.js 等)
├── src/
│   ├── app/                # Next.js App Router 路由
│   │   ├── about/          # [页面] 关于我
│   │   ├── blog/           # [页面] 技术博客列表 & 详情
│   │   ├── essays/         # [页面] 生活随笔列表 & 详情
│   │   ├── portal/         # [页面] 服务导航
│   │   ├── globals.css     # 全局样式 (Tailwind @theme)
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   │   ├── ui/             # 基础 UI 组件
│   │   ├── BlogList.tsx    # 博客列表逻辑
│   │   ├── Comments.tsx    # Giscus 评论
│   │   └── ...
│   ├── content/            # Markdown 内容源文件
│   └── lib/                # 工具函数 (posts.ts 等)
├── next.config.ts          # Next.js 配置
├── package.json            # 依赖声明
└── README.md               # 项目文档
```

---

## 📄 版权说明

除另有声明外，本博客内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。
源代码采用 MIT 协议开源。

Copyright © 2025 念舒.
