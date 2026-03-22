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
- **我的传送门** (`/portal`)：私有部署服务入口
- **友链** (`/friends`)：收录喜爱的网站与博客

### 🎨 界面与交互
- **暗黑模式**：手动切换，持久化保存
- **动态问候**：首页根据时段显示不同问候语
- **字体大小调节**：文章页小/中/大三档，localStorage 记忆
- **阅读进度持久化**：离开文章后返回自动还原滚动位置
- **点赞按钮**：爱心动画，本地记录喜欢状态
- **分享按钮**：一键分享（原生 API / 复制链接 / 微博 / Twitter）
- **SEO**：JSON-LD 结构化数据 + Open Graph + 自动生成 sitemap / robots.txt
- **RSS 订阅**：自动生成 `feed.xml`
- **评论系统**：Giscus（基于 GitHub Discussions）
- **访问统计**：不蒜子 (Busuanzi)

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 内容 | gray-matter · react-markdown · remark-gfm · rehype-sanitize · rehype-slug |
| 图标 | Lucide React |
| 评论 | Giscus (@giscus/react) |
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
├── scripts/                # 构建脚本 (generate-rss.mjs 等)
├── src/
│   ├── app/                # Next.js 页面路由
│   │   ├── about/          # 关于我
│   │   ├── archive/        # 文章归档
│   │   ├── blog/           # 技术博客列表 & 详情
│   │   ├── essays/         # 生活随笔列表 & 详情
│   │   ├── friends/        # 友链
│   │   ├── gear/           # 数字装备
│   │   ├── portal/         # 服务导航
│   │   ├── tags/           # 标签聚合
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   ├── content/            # Markdown 内容
│   └── lib/                # 工具函数与数据 (posts.ts, gear-data.ts, friends-data.ts)
├── next.config.ts
└── package.json
```

---

## 📄 版权

内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议。
源代码采用 MIT 协议开源。

Copyright © 2025 念舒.
