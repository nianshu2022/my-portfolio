# 念舒的数字花园

这是《念舒的数字花园》的多端代码仓库。目录已经按端拆分，避免网页端、内容 API 和微信小程序代码混在一起。

## 目录

```text
.
├── web/             # Next.js 网页版与静态内容 API
├── miniprogram/     # 微信小程序版，后续可单独开源
├── MINIAPP_PLAN.md  # 小程序开发计划清单
└── package.json     # 根目录快捷脚本
```

## 网页版

网页版项目在 `web/` 目录，仍然是当前线上站点：

```text
https://blog.nianshu2022.cn
```

常用命令可以在根目录执行：

```bash
npm run dev
npm run build
npm run generate:miniapp-api
```

如果 Cloudflare Pages 从仓库根目录构建：

```text
Build command: npm run build
Build output directory: web/out
```

如果 Cloudflare Pages 的 Root directory 设置为 `web`：

```text
Build command: npm run build
Build output directory: out
```

也可以进入 `web/` 单独执行：

```bash
cd web
npm run dev
```

## 小程序版

小程序代码统一放在 `miniprogram/`。后续如果要单独开源，只需要把这个目录拆成独立仓库，并保留它自己的 `README.md`、`project.config.json`、`app.json` 等文件即可。

开发计划见 [MINIAPP_PLAN.md](./MINIAPP_PLAN.md)。
