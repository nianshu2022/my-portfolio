---
title: "白嫖 Cloudflare：零成本网站监控 Uptime Monitor 迎来史诗级 V2.0 重构！"
date: "2026-03-23"
description: "纯白嫖 Cloudflare 全家桶（Workers + D1 + Pages）的零成本网站监控系统 Uptime Monitor V2 重磅更新！现在支持飞书/TG/企业微信/Webhook 多渠道告警、高级请求配置、标签分类、事件公告栏以及导入导出功能。"
tags: ["Cloudflare", "Workers", "Vue3", "监控", "开源", "V2"]
---

> **前言**：距离我第一次发布 [Uptime Monitor]((https://github.com/nianshu2022/Uptime-Monitor)) 已经过去一段时间了。当初只是为了解决自己白嫖各种免费域名和小鸡无人看管的痛点，用 Cloudflare 免费全家桶手搓了一套。
> 
> 没想到开源后，收到了很多站长小伙伴的喜爱，大家也提出了很多非常棒的硬核需求：比如“能不能推送到 Telegram？”、“能不能检测 API 面板发起 POST 请求？”、“站点多了管理太麻烦怎么办？”……
> 
> 于是，经过大规模的代码爆肝重构，**Uptime Monitor V2.0 史诗级大版本正式发布！** 依然是熟悉的零成本，但功能和体验直接起飞 🚀！

---

## ✨ V2.0 到底更新了什么？一图（多图）胜千言

除了继承 V1 优秀的 **HTTP / SSL 证书过期 / 域名过期** 三位一体监控能力之外，这次我们重写了大量逻辑，直接把技能树点满了：

### 1. 📢 告警渠道全家桶，你想用啥就用啥！
V1 只有孤零零的钉钉群机器人。现在，我们加上了可视化的 **“通知渠道管理”**：
- **钉钉 (DingTalk)**
- **企业微信 (WeCom)**
- **飞书 (Feishu)**
- **Telegram Bot**
- **自定义 Webhook**

你可以在后台随意配置多个通知渠道，支持一键发送测试消息。监控对象 Down 掉时，多端齐发，再也不怕错过告警！

### 2. 🎛️ 高级 HTTP 监控，连 API 也能随时测
不仅支持 GET，V2 现在全面支持 **POST** 以及**自定义 Headers** 和 **Body**！
如果你想监控某些带鉴权的 API 接口是否存活，现在只需把 Token 放进 Request Header 即可，真正做到了灵活无死角。

### 3. 🤔 报错阈值 + 智能静默窗口 = 拒绝告警轰炸
网络抖动经常引起误报？
- **错误率阈值告警**：现在你可以设置只有连续失败率达到（比如 50%）才触发通知。
- **三重独立静默期**：V1 被吐槽最多的“一直发通知”，现在可用性、SSL 证书、域名过期 **三者的静默恢复期被完全隔离开来**。你可以分别设置 1h ~ 72h 不等的免打扰静默时间，安稳睡好觉！

### 4. 🏷️ 标签分类与批量操作
监控站点从几个增加到几十个，列表太乱？
V2 引入了 **多标签（Tags）系统**。你可以给站点打上 `前端`、`数据库`、`核心业务` 等标签，一键筛选；配合顶部的 **批量暂停/恢复/删除** 操作，运维爽感 max。

### 5. 📰 公开状态页升级：公告牌与个性化动态 UI
别人家的公开监控页不仅能看绿条，还能发布“土豆熟了”的日常维护公告！
- 我们在公开状态页（`index.html`）加入了 **事件公告（Incidents）面板**。你可以随时在后台发布“机房断电”、“业务升级”等维护公告。
- 状态页的 **Title、描述、Logo** 现在可以在后台直接可视化配置，动态响应，无需再去改代码硬编码，完美成为你专属的 Status 页面。

### 6. 🔐 鉴权双规流 & 数据进出口
- 后台引入了更安全的 `ADMIN_API_KEY` （优先级超高）与 `ADMIN_PASSWORD` 双模式认证体系。
- 怕重装丢失配置？现在可以一键 **导出/导入全部监控项 JSON 数据**。

---

## 🚀 依然是保姆级部署，依然是一分钱不花

**Uptime Monitor** 坚持完全借助 Cloudflare （Workers每天10万次请求免费、D1数据库零成本读写、Pages无限量托管）实现 **无限白嫖**。

> 👉 **开源地址 / GitHub**: [https://github.com/nianshu2022/Uptime-Monitor](https://github.com/nianshu2022/Uptime-Monitor)

### 极速部署指南（5分钟搞定）

1. 确保安装好了 `Node.js` 以及运行 `npm i -g wrangler`。
2. 克隆仓库拉取最新的 `main` 分支代码：
   ```bash
   git clone https://github.com/nianshu2022/Uptime-Monitor.git
   cd Uptime-Monitor
   ```
3. 在 Cloudflare 中打个响指，创建一个 D1 数据库：
   ```bash
   npx wrangler d1 create uptime-db
   ```
4. 将产生的 `database_id` 填入 `worker/wrangler.toml` 中，同时自己设定一个强力的 `ADMIN_API_KEY` 密码。
5. 推送全新的 V2 数据表（自动屏蔽旧版覆盖，放心食用）：
   ```bash
   cd worker
   npx wrangler d1 execute uptime-db --remote --file=schema.sql
   npx wrangler deploy
   ```
6. **敲黑板**：部署成功后你会拿到一枚 `https://xxxxx.workers.dev` 的后端 API，快去修改 `frontend/admin.html` 与 `index.html` 底部的 `API_BASE`，然后一把梭：
   ```bash
   npx wrangler pages deploy ../frontend --project-name uptime-monitor
   ```

**大功告成，访问你的前端 URL 开始享受 V2 吧！🎉**

---

## 📝 结语

从 V1 到 V2，不仅仅是代码库的翻新，更是因为诸多热爱开源的站长们一同提供的美好愿景。这也是造轮子最大的乐趣所在：以极致简单的架构，干极致复杂实用的事！

如果你觉得这个 V2 版本能帮你省下一点服务器月费甚至买杯奶茶，欢迎给我提 Issue、PR。
当然，最最重要的，**如果它真的帮到了你，请给我的 GitHub 仓库点一个小小的 Star ⭐️ 吧！谢谢你！**

> **GitHub**: https://github.com/nianshu2022/Uptime-Monitor
> **Blog**: https://nianshu2022.cn
