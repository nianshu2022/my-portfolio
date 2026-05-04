# 念舒的数字花园小程序版

这里用于存放微信小程序端代码。

## 目标

- 使用原生微信小程序构建独立体验
- 读取网页端导出的静态内容 API
- 保持目录独立，便于后续单独开源到 GitHub

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

## 开源边界

后续单独开源小程序时，优先包含：

- `app.json`
- `app.ts` 或 `app.js`
- `app.wxss`
- `project.config.json`
- `pages/`
- `components/`
- `utils/`
- `README.md`

不包含网页端源码、Cloudflare 配置、私有环境变量和构建产物。
