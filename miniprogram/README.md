# 念舒档案局 - 小程序版

## 项目简介

念舒档案局小程序版，与 Web 端（https://blog.nianshu2022.cn）风格统一，采用档案局设计语言。

## 设计特点

- **档案局风格**：网格纸背景、案卷编号、公章元素
- **主色调**：红色 #b4232a
- **品牌一致性**：延续 Web 端视觉语言

## 目录结构

```
miniprogram/
├── app.js                    # 应用入口
├── app.json                  # 应用配置
├── app.wxss                  # 全局样式
├── components/               # 组件
│   ├── case-card/           # 案卷卡片
│   ├── tag-chip/            # 标签胶囊
│   ├── skeleton-list/       # 骨架屏
│   ├── empty-state/         # 空状态
│   ├── archive-nav/         # 档案局导航
│   └── reading-bar/         # 阅读进度条
├── custom-tab-bar/          # 自定义 TabBar
├── pages/                   # 页面
│   ├── index/               # 首页（案卷）
│   ├── tags/                # 标签索引
│   ├── essays/              # 成长样本
│   ├── about/               # 个人档案
│   └── detail/              # 内容详情
├── styles/                  # 样式
│   ├── tokens.wxss          # 设计变量
│   ├── base.wxss            # 基础样式
│   └── grid.wxss            # 网格纸效果
└── utils/                   # 工具
    ├── api.js               # API 接口
    ├── format.js            # 格式化工具
    └── storage.js           # 本地存储
```

## 页面说明

| Tab | 页面 | 说明 |
|-----|------|------|
| 案卷 | index | 首页，展示最新技术文章 |
| 索引 | tags | 标签筛选，按分类浏览 |
| 样本 | essays | 成长记录 |
| 档案 | about | 个人介绍 |

## 开发方式

### 本地开发

1. 使用微信开发者工具打开 `miniprogram` 目录
2. 配置 `project.config.json` 中的 `appid`
3. 开始开发

### 数据来源

小程序数据通过 API 从 Web 端获取：
- 文章列表：`/api/posts`
- 文章详情：`/api/posts/[slug]`
- 随笔列表：`/api/essays`
- 随笔详情：`/api/essays/[slug]`

### 自定义 TabBar

使用自定义 TabBar 实现档案局风格的底部导航，需要在 `app.json` 中配置：
```json
{
  "tabBar": {
    "custom": true
  }
}
```

## 设计规范

### 色彩系统

```css
--color-primary: #b4232a;      /* 主色 */
--color-primary-dark: #8a1a20; /* 深色 */
--bg-page: #f5f0e8;           /* 页面背景 */
--bg-card: #ffffff;            /* 卡片背景 */
--text-title: #1a1a1a;         /* 标题文字 */
--text-body: #2d2d2d;          /* 正文文字 */
```

### 字体规范

- 标题：34rpx / 700
- 副标题：30rpx / 600
- 正文：28rpx / 400
- 辅助：24rpx / 400

### 间距系统

- 页面边距：28rpx
- 区块间距：16/20/24/32rpx
- 卡片内边距：24rpx

## 版本记录

### V1.0.0 (2026-06-14)

- 全新设计，采用档案局风格
- 4 个主页面 + 详情页
- 自定义 TabBar
- 骨架屏加载
- 收藏功能
- 阅读历史

## 相关链接

- Web 端：https://blog.nianshu2022.cn
- GitHub：https://github.com/nianshu2022/my-portfolio
