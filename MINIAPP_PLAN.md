# 《念舒的数字花园》微信小程序计划清单

## 阶段 1：内容 API 改造

- [x] 保留现有 Next.js 网页版
- [x] 保留 Markdown 写作流
- [x] 新增小程序静态 JSON API 生成脚本
- [x] 生成 `/api/garden.json`
- [x] 生成 `/api/posts.json`
- [x] 生成 `/api/posts/[slug].json`
- [x] 生成 `/api/essays.json`
- [x] 生成 `/api/essays/[slug].json`
- [x] 生成 `/api/tags.json`
- [x] 接入 `npm run build`
- [x] 完整构建验证通过

## 阶段 2：微信小程序 MVP

- [x] 创建微信小程序项目目录 `miniprogram/`
- [ ] 配置小程序基础信息和 AppID
- [ ] 配置合法 request 域名：`https://blog.nianshu2022.cn`
- [ ] 设计小程序首页：数字花园入口
- [ ] 实现内容混合流，读取 `/api/garden.json`
- [ ] 实现技术博客列表，读取 `/api/posts.json`
- [ ] 实现生活随笔列表，读取 `/api/essays.json`
- [ ] 实现文章详情页，读取 `/api/posts/[slug].json`
- [ ] 实现随笔详情页，读取 `/api/essays/[slug].json`
- [ ] 实现标签页，读取 `/api/tags.json`
- [ ] 实现标签筛选
- [ ] 实现空状态、加载状态、错误状态
- [ ] 适配微信小程序 Markdown 渲染
- [ ] 处理文章图片展示
- [ ] 处理外链复制或打开提示

## 阶段 3：体验与发布准备

- [ ] 小程序底部导航：首页、文章、随笔、关于
- [ ] 首页做成数字花园风格，而不是普通博客列表
- [ ] 增加搜索入口
- [ ] 增加分享功能
- [ ] 增加收藏或本地喜欢功能
- [ ] 增加关于念舒页面
- [ ] 增加合作或联系入口
- [ ] 检查移动端排版、长标题、代码块、图片
- [ ] 使用微信开发者工具预览
- [ ] 真机测试
- [ ] 准备小程序名称、简介、头像、类目
- [ ] 准备隐私协议或用户协议，如功能需要
- [ ] 提交微信审核

## 阶段 4：Cloudflare Workers + D1 后续增强

- [ ] 创建 `api.nianshu2022.cn`
- [ ] 创建 Cloudflare Worker
- [ ] 创建 D1 数据库
- [ ] 设计 D1 表结构：文章、标签、浏览量、点赞
- [ ] 把 Markdown 内容导入 D1
- [ ] Workers 提供正式 API
- [ ] 网页版和小程序共用 Workers API
- [ ] 增加阅读量统计
- [ ] 增加点赞统计
- [ ] 增加收藏或用户偏好
- [ ] 增加后台内容管理
- [ ] 增加搜索 API
- [ ] 考虑 R2 存图片

## 阶段 5：商业化

- [ ] 增加合作咨询入口
- [ ] 增加服务介绍页
- [ ] 增加数字产品入口
- [ ] 增加赞赏入口
- [ ] 评估流量主广告
- [ ] 评估会员或付费内容
- [ ] 评估课程或模板售卖

## 下一步

从阶段 2 开始，先创建 `miniprogram/` 目录，并让首页成功读取：

```text
https://blog.nianshu2022.cn/api/garden.json
```
