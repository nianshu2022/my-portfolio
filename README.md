# 念舒档案局

一个 00 后技术折腾者的成长样本库。

`V1.0.0` 是主站从「数字花园」升级为「念舒档案局」后的第一个正式版本。它把博客、成长记录、在线服务和个人品牌入口整理成一套公开档案系统，让访客第一眼先记住「念舒是谁」，再进入内容。

## 当前版本

- 版本：`V1.0.4`
- 主站：<https://blog.nianshu2022.cn>
- 技术栈：Next.js 15、React 19、Tailwind CSS v4、TypeScript

## V1.0.4 更新

- 新增无文字品牌标识和 favicon：以生图生成的档案盒、技术路径和红色定位点作为站点图标。
- 完善 `/about` 和 `/gear`：补充个人品牌、可信线索、做事方法和装备档案细节。
- 优化技术案卷与成长样本详情页：调整登记信息、目录、上下篇、相关推荐和阅读工具区。
- 修复顶部工具组、返回按钮、移动端标题入场和标签/阅读工具拥挤等布局问题。
- 统一搜索、标签、时间索引、友链、隐私页、404 和公开服务页的档案局视觉。

## V1.0.0 重点

- 全站视觉升级为档案局风格：网格纸、档案编号、案卷列表、红色批注和公章元素。
- 首页聚焦个人品牌：技术折腾者、00 后成长样本、持续记录的公开档案。
- 技术文章改为「案卷」表达，按时间生成案卷编号。
- 成长内容改为「样本」表达，弱化普通博客模板感。
- 使用设计稿公章裁切生成透明 PNG，替代浏览器渲染不稳定的弧形 SVG 文字。

## 目录结构

```text
.
├── web/             # Next.js 主站
├── miniprogram/     # 小程序代码，当前版本不作为主站发布范围
├── backend/         # 后端实验代码，当前版本不作为主站发布范围
├── PRODUCT.md       # 主站产品与品牌定位
└── package.json     # 根目录快捷脚本
```

## 本地预览

在仓库根目录执行：

```bash
npm run dev
```

默认访问：

```text
http://localhost:3000
```

如果 `3000` 端口被占用，Next.js 会自动切到下一个可用端口，请以终端输出为准。

## 常用命令

```bash
npm run dev
npm run lint
npm run build
```

也可以进入 `web/` 单独执行：

```bash
cd web
npm run dev
npm run build
```

## Cloudflare Pages

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

## 发布范围

当前版本聚焦 Web 主站。小程序和后端目录仍保留在仓库中，但不纳入本次主站发布内容。
