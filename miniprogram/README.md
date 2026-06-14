# Nianshu 的空间小程序版

这里用于存放微信小程序端代码。当前版本已从 MVP 骨架升级为「Liquid Space」风格的小程序体验，面向 00 后阅读节奏：高级、轻盈、可连续阅读。

## 备案信息
- **服务内容标识**：生活服务-工具
- **核心定位**：数字花园、个人成长工具、内容分发平台。

## 目标

- 使用原生微信小程序构建独立体验
- 读取网页端导出的静态内容 API
- 保持目录独立，便于后续单独开源到 GitHub
- 提供比网页端更轻、更快、更适合微信内浏览的内容动线

## 当前功能清单

已完成原生小程序体验重构：

- 首页：Liquid Glass 首屏、Bento 快捷入口、内容统计、随机漫游
- 混合内容流：支持「新鲜 / 精选 / 热力」三种内容分发
- 技术博客：关键词搜索、最新 / 深读 / 多标签排序
- 生活随笔：全部 / 有图 / 可延展筛选
- 标签地图：标签热力视觉分级、标签筛选内容流
- 内容详情：Markdown 渲染、正文图片预览、外链复制、同标签相关推荐
- 内容详情增强：喜欢、收藏、阅读进度、返回顶部、下一篇漫游
- 在读清单：本地阅读历史、本地收藏、本地喜欢、今日阅读统计、清空历史
- 关于念舒：个人介绍、能力标签、网站复制与分享入口
- 合作实验室：服务方向、合作流程、边界说明、咨询入口
- 数字货架：资源分区、模板预告、案例入口、轻量支持作者入口
- 基础体验：下拉刷新、错误重试、轻压反馈、统一空状态文案
- 自定义底部导航：悬浮玻璃胶囊、渐变激活态、tab 页面状态同步
- 体验组件：统一骨架屏、统一空态/错误态、空结果快捷操作

## 设计方向

本轮重构使用 `ui-ux-pro-max` 技能辅助生成设计系统，并结合微信小程序性能边界落地为：

- 主题：`Liquid Garden`
- 结构：Portfolio Grid + Bento 内容卡片
- 气质：明亮、年轻、高级，不做幼态化装饰
- 色彩：靛蓝 / 紫色 / 薄荷绿 / 珊瑚粉点缀
- 交互：轻压反馈、分段筛选、收藏与历史承接连续阅读

完整设计规范、交互策略、功能分期与目录建议见：

- `miniprogram/DESIGN.md`

## 本地预览

1. 打开微信开发者工具。
2. 选择「导入项目」。
3. 项目目录选择本目录 `miniprogram/`。
4. AppID 先使用测试号或替换 `project.config.json` 中的 `appid`。

如果计划后续单独开源小程序，可以不要把正式 AppID 提交到仓库：

- 保持 `project.config.json` 中的 `appid` 为 `touristappid` 或测试号
- 在微信开发者工具中用本地配置关联正式 AppID
- `project.private.config.json` 会被 Git 忽略，只保留在本机

正式调试前，需要在微信公众平台配置 request 合法域名：

```text
https://blog.nianshu2022.cn
```

如果正文图片来自第三方图床，还需要按微信要求补充对应图片域名。

## 内容 API

第一阶段直接读取网页版发布后的静态 JSON：

```text
https://blog.nianshu2022.cn/api/garden.json
https://blog.nianshu2022.cn/api/posts.json
https://blog.nianshu2022.cn/api/essays.json
https://blog.nianshu2022.cn/api/tags.json
```

详情页按类型读取：

```text
https://blog.nianshu2022.cn/api/posts/[slug].json
https://blog.nianshu2022.cn/api/essays/[slug].json
```

## 目录说明

```text
miniprogram/
├── app.js
├── app.json
├── app.wxss
├── custom-tab-bar/ # 高级感自定义底部导航
├── components/     # 空态、骨架屏等体验组件
├── pages/          # 首页、列表、标签、详情、在读、关于、合作实验室、数字货架
├── store/          # 本地收藏与阅读历史
├── styles/         # token、排版、动效
├── utils/          # API 与 Markdown 渲染
├── DESIGN.md
└── README.md
```

## 开源边界

后续单独开源小程序时，优先包含：

- `app.json`
- `app.js`
- `app.wxss`
- `project.config.json`
- `pages/`
- `store/`
- `styles/`
- `utils/`
- `README.md`

不包含网页端源码、Cloudflare 配置、私有环境变量和构建产物。
