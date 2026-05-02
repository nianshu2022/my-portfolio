# 念舒的数字花园

> 一个基于 **Next.js 15** 构建的现代化个人博客与数字花园。
> 融合了技术笔记、生活随笔与个人服务导航，致力于提供优雅、快速且极致的阅读体验。

[![部署状态](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

🌐 **在线访问**: [https://blog.nianshu2022.cn](https://blog.nianshu2022.cn)

---

## ✨ 核心特性

### ⚡ 性能与技术
- **Next.js 15 (App Router)** + React Server Components
- **静态导出 (output: export)**：构建为纯静态 HTML，部署到 Cloudflare Pages 全球 CDN
- **PWA 支持**：Service Worker 离线缓存，可安装到桌面/手机
- **页面过渡动画**：`motion` (Framer Motion) 驱动的页面切换与滚动揭示效果
- **图片优化**：构建时自动压缩 (`optimize-images.mjs`)，运行时 wsrv.nl 代理

### 📝 内容系统
- **双内容流**：技术博客（`/blog`）与生活随笔（`/essays`），各有独立风格
- **Markdown 渲染**：`react-markdown` + `rehype-sanitize`（XSS 防护）+ `remark-gfm`
- **阅读体验增强**：
  - 字数统计与阅读时长预估
  - 顶部阅读进度条
  - 文章目录（桌面端侧边栏）
  - 文章导航（上一篇 / 下一篇）
  - 相关文章推荐
  - 代码块一键复制
  - 图片自动代理优化（wsrv.nl）

### 🗂️ 内容发现
- **标签聚合页** (`/tags`)：标签云 + 按来源分类统计
- **归档页** (`/archive`)：按年份时间线展示所有内容
- **命令菜单** (`Ctrl+K` / `/`)：全局快速搜索文章与随笔

### 👤 个人展示
- **关于我** (`/about`)：个人介绍、技术栈、联系方式
- **数字装备** (`/gear`)：硬件 & 软件清单
- **我的传送门** (`/portal`)：私有部署服务入口，实时在线状态检测
- **友链** (`/friends`)：收录喜爱的网站与博客，支持弹窗提交

### 🧩 首页小组件
- **GitHub 统计**：个人 GitHub 数据展示
- **GitHub 趋势**：热门开源项目
- **每日诗词** / **每日一言**：古诗词与随机语句
- **V2EX 热帖** / **IT 之家**：技术社区动态
- **音乐榜单**：热门音乐排行
- **历史上的今天**：历史事件回顾
- **天气卡片**：实时天气信息
- **访客地图**：Leaflet 世界地图展示访客分布
- **贡献热力图**：GitHub 风格的活跃度热力图

### 🎨 界面与交互
- **暗黑模式**：手动切换，持久化保存
- **动态问候**：首页根据时段显示不同问候语
- **字体大小调节**：文章页小/中/大三档，localStorage 记忆
- **阅读进度持久化**：离开文章后返回自动还原滚动位置
- **点赞按钮**：爱心动画，本地记录喜欢状态
- **分享按钮**：一键分享（原生 API / 复制链接 / 微博 / Twitter）
- **图片灯箱**：点击图片全屏预览，支持缩放
- **视觉特效**：网格背景、鼠标追踪光晕、倾斜卡片、发光边框
- **滚动动画**：ScrollReveal 滚动揭示、打字机效果
- **浮动导航**：文章页浮动目录 (TOC) 与导航栏
- **键盘快捷键**：`Ctrl+K` 命令菜单，键盘导航支持
- **返回顶部**：悬浮按钮，平滑滚动
- **赞助按钮**：支持打赏 / 捐赠
- **SEO**：JSON-LD 结构化数据 + Open Graph + 自动生成 sitemap / robots.txt
- **RSS 订阅**：自动生成 `feed.xml`
- **评论系统**：Giscus（基于 GitHub Discussions）
- **访问统计**：不蒜子 (Busuanzi) + 访客计数器

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 · class-variance-authority · tailwind-merge |
| 动画 | motion (Framer Motion) |
| 内容 | gray-matter · react-markdown · remark-gfm · rehype-sanitize · rehype-slug · reading-time |
| 地图 | Leaflet · react-leaflet |
| 图标 | Lucide React |
| 评论 | Giscus (@giscus/react) |
| 加载 | nextjs-toploader |
| 部署 | Cloudflare Pages |

---

## 🚀 本地开发

```bash
# 克隆项目
git clone https://github.com/nianshu2022/my-portfolio.git
cd my-portfolio

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 构建生产版本

```bash
npm run build
# 产物位于 out/ 目录（静态文件，可直接部署到任何静态托管）
```

---

## 📝 内容创作

在 `src/content` 目录下创建 Markdown 文件：

- **技术博客**: `src/content/posts/YYYY/filename.md`
- **生活随笔**: `src/content/essays/filename.md`

### Frontmatter 格式

```markdown
---
title: "文章标题"
date: "2025-01-23"
description: "摘要描述..."
tags: ["Next.js", "React"]
cover: "/img/cover.png"   # 可选，封面图
award: ""                  # 可选，随笔专属标注
---

正文内容...
```

### 图片自定义

```markdown
![描述](/img/image.png?width=500px&shadow=true)
```

---

## 🌐 部署（Cloudflare Pages）

| 配置项 | 值 |
|--------|---|
| 构建命令 | `npm run build` |
| 构建输出目录 | `out` |
| Node.js 版本 | 18+ |

---

## 📁 目录结构

```
.
├── public/                 # 静态资源 (图片, favicon, sw.js 等)
├── scripts/                # 构建脚本
│   ├── dev.mjs             # 开发服务器启动脚本
│   ├── generate-rss.mjs    # RSS feed 生成
│   ├── generate-pwa-icons.mjs  # PWA 图标生成
│   ├── generate-portal-status.mjs  # 传送门状态检测
│   └── optimize-images.mjs # 图片压缩优化
├── src/
│   ├── app/                # Next.js 页面路由
│   │   ├── about/          # 关于我
│   │   ├── archive/        # 文章归档
│   │   ├── blog/           # 技术博客列表 & 详情
│   │   ├── essays/         # 生活随笔列表 & 详情
│   │   ├── friends/        # 友链
│   │   ├── gear/           # 数字装备
│   │   ├── portal/         # 服务导航
│   │   ├── search/         # 搜索结果页
│   │   ├── tags/           # 标签聚合
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   │   ├── ui/             # 基础 UI 组件 (Button, CodeBlock)
│   │   └── widgets/        # 首页小组件 (GitHub 统计, 天气, 诗词等)
│   ├── content/            # Markdown 内容
│   └── lib/                # 工具函数与数据
│       ├── api/            # API 请求封装 (fetch-wrapper, types)
│       ├── hooks/          # 自定义 Hooks (useApi, useGeolocation, useKeyboardNav)
│       ├── posts.ts        # 文章数据处理
│       ├── gear-data.ts    # 装备数据
│       ├── friends-data.ts # 友链数据
│       └── site-stats.ts   # 站点统计
├── next.config.ts
└── package.json
```

---

## 📄 版权

内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议。
源代码采用 MIT 协议开源。

Copyright © 2026 念舒.
