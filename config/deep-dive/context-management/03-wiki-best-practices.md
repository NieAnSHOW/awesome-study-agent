# Wiki 系统最佳实践

> 如何用 Wiki 系统有效地管理和组织项目上下文

---

## 为什么选择 Wiki？

### Wiki vs 其他方式

| 方式 | 适合场景 | 优势 | 劣势 |
|-----|---------|------|------|
| README | 个人小项目 | 简单直接 | 信息量有限 |
| 代码注释 | API 文档 | 与代码同步 | 表达有限 |
| Confluence | 大企业 | 功能强大 | 复杂昂贵 |
| Notion | 小团队 | 协作方便 | 搜索弱 |
| **Wiki** | **中大型** | **平衡之选** | **需要维护** |

### Wiki 的独特优势

**1. 结构化**

```markdown
# Wiki 结构示例

docs/
├── overview/          # 项目概述
│   ├── intro.md      # 项目简介
│   ├── tech-stack.md # 技术栈
│   └── roadmap.md    # 路线图
├── development/       # 开发相关
│   ├── setup.md      # 环境搭建
│   ├── structure.md  # 项目结构
│   └── guidelines.md # 编码规范
├── business/          # 业务文档
│   ├── workflows.md  # 业务流程
│   ├── rules.md      # 业务规则
│   └── data-model.md # 数据模型
└── api/              # API 文档
    ├── users.md
    ├── orders.md
    └── payments.md
```

**2. 可搜索**

```
搜索："订单状态"
→ 找到：
  - business/workflows.md（订单流程）
  - business/rules.md（订单规则）
  - api/orders.md（订单API）
```

**3. 版本管理**

```
git log docs/business/rules.md

commit abc123...
Author: 张三 <zhangsan@example.com>
Date: 2024-02-15

更新：订单取消规则从24小时改为2小时
```

**4. AI 友好**

```
AI 可以：
✅ 读取 Markdown 文件
✅ 理解文档结构
✅ 按需引用特定章节
✅ 跟踪文档链接
✅ 解析代码示例
✅ 提取结构化数据
```

**5. 协作友好**

```
团队协作：
✅ 多人同时编辑不同文件
✅ PR/MR 流程完善
✅ 评论和讨论机制
✅ 变更历史可追溯
```

---

## Wiki 工具生态全景

### 主流 Wiki 工具深度对比

| 工具 | 难度 | 部署 | 定制 | 成本 | 推荐场景 |
|-----|------|------|------|------|---------|
| **VitePress** | ⭐ | Git | ⭐⭐⭐ | 免费 | 开发者项目、AI 友好 |
| **Docusaurus** | ⭐⭐ | Git | ⭐⭐⭐⭐ | 免费 | 大型开源项目、Meta 官方 |
| **GitBook** | ⭐ | 云端 | ⭐⭐ | 付费/免费 | 商业文档、对外发布 |
| **Notion** | ⭐ | 云端 | ⭐⭐ | 免费/付费 | 小团队内部知识库 |
| **Confluence** | ⭐⭐⭐ | 自建 | ⭐⭐⭐⭐⭐ | 昂贵 | 大企业、复杂权限管理 |
| **VuePress** | ⭐⭐ | Git | ⭐⭐⭐⭐ | 免费 | Vue 2.x 项目（已过时） |
| **Astro Starlight** | ⭐⭐ | Git | ⭐⭐⭐⭐ | 免费 | 现代化文档站、多框架支持 |

### 推荐：VitePress

**为什么选择 VitePress？**

**1. 极简上手**

```bash
# 安装
pnpm add -D vitepress

# 初始化
npx vitepress init

# 运行
pnpm docs:dev
```

**2. 纯 Markdown**

```markdown
# 项目简介

这是一个外卖订餐系统...

## 技术栈
- React 18
- TypeScript 5.0
```

**3. Git 原生集成**

```
- 文档就是代码仓库的一部分
- PR/MR 流程完善
- 版本管理天然支持
- 无需额外数据库
```

**4. 部署简单**

```bash
# 构建
pnpm docs:build

# 部署到 Vercel/Netlify
# 静态文件，直接上传
```

**5. AI 友好**

```
- Markdown 格式容易解析
- 文件系统组织，便于检索
- 支持代码块高亮
```

---

## Wiki 内容结构设计

### 推荐的目录结构

```
wiki/
├── index.md                    # Wiki 首页
│
├── overview/                   # 项目概述
│   ├── index.md               # 概述首页
│   ├── intro.md               # 项目简介
│   ├── tech-stack.md          # 技术栈
│   ├── architecture.md        # 架构设计
│   └── roadmap.md             # 发展路线
│
├── development/                # 开发指南
│   ├── index.md
│   ├── setup.md               # 环境搭建
│   ├── structure.md           # 项目结构
│   ├── coding-standards.md    # 编码规范
│   ├── git-workflow.md        # Git 流程
│   └── testing.md             # 测试规范
│
├── business/                   # 业务文档
│   ├── index.md
│   ├── workflows.md           # 业务流程
│   ├── rules.md               # 业务规则
│   └── data-model.md          # 数据模型
│
├── api/                        # API 文档
│   ├── index.md
│   ├── overview.md            # API 概述
│   ├── auth.md                # 认证相关
│   ├── users.md               # 用户 API
│   ├── orders.md              # 订单 API
│   └── payments.md            # 支付 API
│
├── modules/                    # 模块文档
│   ├── index.md
│   ├── user-module.md         # 用户模块
│   ├── order-module.md        # 订单模块
│   └── payment-module.md      # 支付模块
│
├── deployment/                 # 部署文档
│   ├── index.md
│   ├── environments.md        # 环境配置
│   ├── ci-cd.md               # CI/CD
│   └── monitoring.md          # 监控告警
│
├── faq/                        # 常见问题
│   ├── index.md
│   ├── development.md         # 开发问题
│   └── business.md            # 业务问题
│
└── decisions/                  # 技术决策
    ├── index.md
    ├── database-choice.md     # 为什么选择 PostgreSQL
    ├── state-management.md    # 为什么选择 Zustand
    └── api-design.md          # API 设计原则
```

### 每个章节应包含的内容

#### 1. 项目概述

让新人和 AI 快速了解项目。

```markdown
# 项目简介

## 项目定位
拉了么是一个外卖订餐平台，连接用户、商家和配送员。

## 核心功能
- 用户端：浏览商家、下单、支付、追踪订单
- 商家端：菜品管理、订单处理、营业设置
- 配送员端：接单配送、收入统计
- 管理后台：数据监控、用户管理

## 技术亮点
- 前后端分离架构
- 微服务化的业务模块
- 实时订单追踪
```

#### 2. 开发指南 (development/)

**目的**：指导开发者如何参与项目

**内容**：

```markdown
# 环境搭建

## 前置要求
- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

## 安装步骤
1. 克隆仓库
2. 安装依赖：pnpm install
3. 配置环境：cp .env.example .env
4. 初始化数据库：pnpm db:migrate
5. 启动开发：pnpm dev

## 常见问题
### 端口被占用
修改 .env 中的 PORT

### 数据库连接失败
检查 PostgreSQL 是否启动
```

#### 3. 业务文档 (business/)

**目的**：记录业务规则和流程

**内容**：

```markdown
# 订单业务规则

## 订单状态流转
```
pending → paid → preparing → delivering → completed
                    ↓
                 cancelled
```

## 规则说明
- pending: 订单已创建，等待支付
- paid: 用户已支付，等待商家接单
- preparing: 商家正在准备
- delivering: 配送员配送中
- completed: 订单完成
- cancelled: 订单取消（仅在 preparing 前可取消）

## 特殊规则
- 支付超时：15 分钟自动取消
- 商家接单超时：30 分钟自动取消
- 配送超时：2 小时后自动完成
```

#### 4. API 文档 (api/)

**目的**：描述所有 API 端点

**内容**：

```markdown
# 用户 API

## 认证
所有 API 需要在 Header 中携带：
```
Authorization: Bearer {token}
```

## POST /api/users/register
注册新用户

### 请求体
```json
{
  "phone": "13800138000",
  "password": "password123",
  "code": "123456"
}
```

### 响应
```json
{
  "code": 0,
  "data": {
    "user_id": "uuid",
    "token": "jwt_token"
  }
}
```

### 错误码
- 1001: 手机号已存在
- 1002: 验证码错误
- 1003: 密码不符合要求
```

#### 5. 技术决策 (decisions/)

**目的**：记录重要的技术决策及其原因

**内容**：

```markdown
# 为什么选择 PostgreSQL 而不是 MySQL？

## 背景
- 需要支持 JSON 字段查询
- 需要更好的并发性能
- 需要 GIS 功能（配送距离计算）

## 选项对比

| 数据库 | 优势 | 劣势 | 评分 |
|-------|-----|------|------|
| MySQL | 生态成熟 | JSON 支持弱 | ⭐⭐⭐ |
| PostgreSQL | JSON、并发、GIS | 运维经验少 | ⭐⭐⭐⭐⭐ |
| MongoDB | 灵活 | 事务支持弱 | ⭐⭐ |

## 决策
选择 PostgreSQL 15

## 结果
- 运行 6 个月，稳定性良好
- JSON 字段在订单扩展信息中发挥重要作用
- GIS 功能实现了配送距离计算

## 后续考虑
- 如果数据量持续增长，考虑分库分表
- 关注 PostgreSQL 新版本的特性
```

---

## VitePress vs Docusaurus：深度对比

### 技术架构对比

| 特性 | VitePress | Docusaurus |
|-----|-----------|------------|
| **底层技术** | Vite + Vue 3 | React + Webpack 5 |
| **构建速度** | ⚡ 极快（Vite HMR） | 🐢 较慢（Webpack） |
| **学习曲线** | 平缓（熟悉 Vue 更易） | 陡峭（需要 React 知识） |
| **插件生态** | 较少但精简 | 非常丰富（Meta 官方维护） |
| **国际化** | 内置 i18n | 内置 i18n |
| **版本管理** | 需要手动配置 | 内置版本化文档 |
| **文档搜索** | Algolia/本地搜索 | Algolia/本地搜索 |
| **AI 友好度** | ⭐⭐⭐⭐⭐ 纯 MD | ⭐⭐⭐⭐ MDX + React |
| **适用场景** | 开发者工具、小型文档 | 大型开源项目、多版本 |

### 选择建议

**选择 VitePress 如果你：**
- ✅ 团队熟悉 Vue.js
- ✅ 追求极致的构建速度和开发体验
- ✅ 需要简单的纯 Markdown 文档
- ✅ 项目规模中小型，文档量 < 500 页
- ✅ 希望 AI 能够轻松理解和解析

**选择 Docusaurus 如果你：**
- ✅ 团队熟悉 React
- ✅ 需要管理多版本文档（如 v1.x, v2.x）
- ✅ 需要丰富的插件和内容插件（博客、播客等）
- ✅ 项目是大型开源项目，文档量 > 500 页
- ✅ 需要 MDX 的强大功能（在文档中嵌入 React 组件）

### 实际案例

**VitePress 用户：**
- [Vue.js 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
- [Element Plus](https://element-plus.org/)

**Docusaurus 用户：**
- [React 官方文档](https://react.dev/)
- [Meta 开源项目](https://opensource.fb.com/)
- [Kubernetes 文档](https://kubernetes.io/docs/)
- [Jest 测试框架](https://jestjs.io/)

---

## VitePress 进阶配置

### 1. 完整配置文件示例

```typescript
// docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点配置
  title: '拉了么项目 Wiki',
  description: '外卖订餐平台文档中心',
  lang: 'zh-CN',
  base: '/wiki/', // 部署在子路径时设置

  // appearance: false, // 禁用深色模式切换

  // 主题配置
  themeConfig: {
    // Logo
    logo: '/logo.svg',

    // 站点元信息
    siteTitle: '拉了么 Wiki',
    siteDescription: '外卖订餐平台文档中心',

    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '项目概述',
        items: [
          { text: '项目简介', link: '/overview/intro' },
          { text: '技术栈', link: '/overview/tech-stack' },
          { text: '架构设计', link: '/overview/architecture' },
        ]
      },
      {
        text: '开发指南',
        items: [
          { text: '环境搭建', link: '/development/setup' },
          { text: '项目结构', link: '/development/structure' },
          { text: '编码规范', link: '/development/coding-standards' },
          { text: 'Git 流程', link: '/development/git-workflow' },
        ]
      },
      {
        text: 'API 文档',
        link: '/api/overview'
      },
      {
        text: '业务文档',
        link: '/business/workflows'
      },
      {
        text: '常见问题',
        link: '/faq/development'
      }
    ],

    // 侧边栏
    sidebar: {
      '/overview/': [
        {
          text: '项目概述',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '项目简介', link: '/overview/intro' },
            { text: '技术栈', link: '/overview/tech-stack' },
            { text: '架构设计', link: '/overview/architecture' },
            { text: '发展路线', link: '/overview/roadmap' },
          ]
        }
      ],
      '/development/': [
        {
          text: '开发指南',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '环境搭建', link: '/development/setup' },
            { text: '项目结构', link: '/development/structure' },
            { text: '编码规范', link: '/development/coding-standards' },
            { text: 'Git 工作流', link: '/development/git-workflow' },
            { text: '测试规范', link: '/development/testing' },
            { text: '调试技巧', link: '/development/debugging' },
          ]
        }
      ],
      '/business/': [
        {
          text: '业务文档',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '业务流程', link: '/business/workflows' },
            { text: '业务规则', link: '/business/rules' },
            { text: '数据模型', link: '/business/data-model' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          collapsible: true,
          collapsed: false,
          items: [
            { text: 'API 概述', link: '/api/overview' },
            { text: '认证', link: '/api/auth' },
            { text: '用户 API', link: '/api/users' },
            { text: '订单 API', link: '/api/orders' },
            { text: '支付 API', link: '/api/payments' },
            { text: '错误码', link: '/api/error-codes' },
          ]
        }
      ],
      '/modules/': [
        {
          text: '模块文档',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '用户模块', link: '/modules/user-module' },
            { text: '订单模块', link: '/modules/order-module' },
            { text: '支付模块', link: '/modules/payment-module' },
            { text: '配送模块', link: '/modules/delivery-module' },
          ]
        }
      ],
      '/deployment/': [
        {
          text: '部署文档',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '环境配置', link: '/deployment/environments' },
            { text: 'CI/CD', link: '/deployment/ci-cd' },
            { text: '监控告警', link: '/deployment/monitoring' },
          ]
        }
      ],
      '/faq/': [
        {
          text: '常见问题',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '开发问题', link: '/faq/development' },
            { text: '业务问题', link: '/faq/business' },
            { text: '部署问题', link: '/faq/deployment' },
          ]
        }
      ],
      '/decisions/': [
        {
          text: '技术决策',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '数据库选择', link: '/decisions/database-choice' },
            { text: '状态管理', link: '/decisions/state-management' },
            { text: 'API 设计', link: '/decisions/api-design' },
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/lamo' }
    ],

    // 页脚
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-present 拉了么团队'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/your-org/lamo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },

    // 搜索（Algolia）
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'lamo-wiki',
      locales: {
        zh: {
          placeholder: '搜索文档',
          translations: {
            button: {
              buttonText: '搜索文档',
              buttonAriaLabel: '搜索文档'
            },
            modal: {
              searchBox: {
                resetButtonTitle: '清除查询条件',
                resetButtonAriaLabel: '清除查询条件',
                cancelButtonText: '取消',
                cancelButtonAriaLabel: '取消'
              },
              startScreen: {
                recentSearchesTitle: '搜索历史',
                noRecentSearchesText: '没有搜索历史',
                saveRecentSearchButtonTitle: '保存至搜索历史',
                removeRecentSearchButtonTitle: '从搜索历史中移除',
                favoriteSearchesTitle: '收藏',
                removeFavoriteSearchButtonTitle: '从收藏中移除'
              },
              errorScreen: {
                titleText: '无法获取结果',
                helpText: '你可能需要检查你的网络连接'
              },
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
                searchByText: '搜索提供者'
              },
              noResultsScreen: {
                noResultsText: '无法找到相关结果',
                suggestedQueryText: '你可以尝试查询',
                reportMissingResultsText: '你认为该查询应该有结果？',
                reportMissingResultsLinkText: '点击反馈'
              }
            }
          }
        }
      }
    },

    // 大纲（TOC）配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    }
  },

  // Markdown 配置
  markdown: {
    // 代码行号
    lineNumbers: true,

    // 配置 markdown-it
    config: (md) => {
      // 添加自定义 markdown-it 插件
    }
  },

  // 构建优化
  vite: {
    build: {
      chunkSizeWarningLimit: 1000
    }
  },

  // 性能优化
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }],
    ['meta', { name: 'og:title', content: '拉了么 Wiki' }],
    ['meta', { name: 'og:site_name', content: '拉了么 Wiki' }],
  ]
})
```

### 2. 自定义主题扩展

```typescript
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 添加全局组件
    // app.component('MyComponent', MyComponent)
  }
} satisfies Theme
```

### 3. 自动生成侧边栏

```typescript
// 自动遍历目录生成侧边栏
function generateSidebar(dir: string) {
  const fs = require('fs')
  const path = require('path')

  const files = fs.readdirSync(path.join(__dirname, '..', dir))
  const items = files
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .map(f => ({
      text: f.replace('.md', '').replace(/-/g, ' '),
      link: `/${dir}/${f.replace('.md', '')}`
    }))

  return [
    {
      text: dir.charAt(0).toUpperCase() + dir.slice(1),
      collapsible: true,
      items
    }
  ]
}

export default defineConfig({
  themeConfig: {
    sidebar: {
      '/api/': generateSidebar('api')
    }
  }
})
```

---

## VitePress 快速搭建指南

### 步骤 1：初始化项目

```bash
# 在项目根目录
pnpm add -D vitepress

# 创建文档目录
mkdir -p docs/.vitepress
```

### 步骤 2：配置 VitePress

```typescript
// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '拉了么项目 Wiki',
  description: '外卖订餐平台文档中心',

  // 主题配置
  themeConfig: {
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '项目概述', link: '/overview/intro' },
      { text: '开发指南', link: '/development/setup' },
      { text: 'API 文档', link: '/api/overview' },
    ],

    // 侧边栏
    sidebar: {
      '/overview/': [
        {
          text: '项目概述',
          items: [
            { text: '项目简介', link: '/overview/intro' },
            { text: '技术栈', link: '/overview/tech-stack' },
            { text: '架构设计', link: '/overview/architecture' },
          ]
        }
      ],
      '/development/': [
        {
          text: '开发指南',
          items: [
            { text: '环境搭建', link: '/development/setup' },
            { text: '项目结构', link: '/development/structure' },
            { text: '编码规范', link: '/development/coding-standards' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: 'API 概述', link: '/api/overview' },
            { text: '认证', link: '/api/auth' },
            { text: '用户', link: '/api/users' },
            { text: '订单', link: '/api/orders' },
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/lamo' }
    ]
  }
})
```

### 步骤 3：创建首页

```markdown
<!-- docs/index.md -->
---
layout: home

hero:
  name: "拉了么 Wiki"
  text: "外卖订餐平台文档中心"
  tagline: "项目开发、业务规则、API 文档一站式查询"
  actions:
    - theme: brand
      text: 快速开始
      link: /development/setup
    - theme: alt
      text: 项目概述
      link: /overview/intro

features:
  - title: 🚀 快速上手
    details: 详细的环境搭建指南，10 分钟即可开始开发
  - title: 📖 完整文档
    details: 从技术架构到业务规则，全面覆盖
  - title: 🔍 API 文档
    details: 所有 API 端点的详细说明和示例
  - title: 🤖 AI 友好
    details: 结构化文档，便于 AI 理解项目
---

## 快速导航

### 项目信息
- [项目简介](/overview/intro)
- [技术栈](/overview/tech-stack)
- [架构设计](/overview/architecture)

### 开发相关
- [环境搭建](/development/setup)
- [项目结构](/development/structure)
- [编码规范](/development/coding-standards)

### API 文档
- [API 概述](/api/overview)
- [用户 API](/api/users)
- [订单 API](/api/orders)
```

### 步骤 4：添加内容

```markdown
<!-- docs/overview/intro.md -->
# 项目简介

拉了么（Lamo）是一个外卖订餐平台...

## 核心功能
...
```

### 步骤 5：运行和部署

**本地开发**：

```bash
# 启动开发服务器（支持热重载）
pnpm docs:dev

# 指定端口
pnpm docs:dev --port 4000

# 允许局域网访问（方便手机预览）
pnpm docs:dev --host
```

**生产构建**：

```bash
# 构建
pnpm docs:build

# 预览构建结果
pnpm docs:preview --port 8080
```

### 部署方案对比

| 方案 | 优点 | 缺点 | 适合场景 |
|-----|------|------|---------|
| **Vercel** | 零配置、全球 CDN、自动 HTTPS | 国内访问慢 | 开源项目、海外用户 |
| **Netlify** | 表单处理、部署预览 | 国内访问慢 | 开源项目、需要表单 |
| **GitHub Pages** | 完全免费、与 GitHub 集成 | 构建慢、国内不稳定 | 个人项目、开源文档 |
| **Cloudflare Pages** | 全球边缘网络、无限带宽 | 配置稍复杂 | 高流量站点 |
| **自建 Nginx** | 完全可控、内网可用 | 需要运维 | 企业内部文档 |

#### 方案 1：GitHub Pages（免费推荐）

```yaml
# .github/workflows/deploy-wiki.yml
name: Deploy Wiki

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm docs:build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/.vitepress/dist
```

#### 方案 2：Vercel（最简单）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 一键部署
vercel --prod
```

或者直接在 Vercel 控制台导入 GitHub 仓库，配置：
- 构建命令：`pnpm docs:build`
- 输出目录：`docs/.vitepress/dist`

#### 方案 3：自建 Nginx（企业内网）

```nginx
server {
    listen 80;
    server_name wiki.internal.com;

    root /var/www/wiki/docs/.vitepress/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Wiki 内容写作指南

### 原则 1：结构化

**❌ 不好的做法**：

```markdown
我们的项目用的是React和TypeScript，还有Tailwind CSS做样式，
状态管理用的是Zustand，路由是React Router，
后端是Nest.js，数据库是PostgreSQL...
```

**✅ 好的做法**：

```markdown
## 技术栈

### 前端
- 框架：React 18
- 语言：TypeScript 5.0
- 样式：Tailwind CSS
- 状态管理：Zustand
- 路由：React Router v6

### 后端
- 框架：Nest.js 9.0
- 语言：TypeScript 5.0
- ORM：Prisma 4.15
- 数据库：PostgreSQL 15
- 缓存：Redis 7.0
```

### 原则 2：示例丰富

**❌ 不好的做法**：

```markdown
用户 API 需要认证。
```

**✅ 好的做法**：

```markdown
## 认证

所有用户 API 需要在 Header 中携带 token：

```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 示例代码

```typescript
// 前端调用示例
const response = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```
```

### 原则 3：保持简洁

**❌ 不好的做法**：

```markdown
React 是一个由 Facebook 开发的 JavaScript 库，用于构建用户界面。
它于 2013 年首次发布，现在已经成为最流行的前端框架之一。
React 采用组件化的开发方式，每个组件负责渲染 UI 的一部分...
（复制了一整篇 React 介绍）
```

**✅ 好的做法**：

```markdown
## 前端框架

使用 React 18，函数组件 + Hooks 模式。

详细文档：[React 官方文档](https://react.dev)

相关规范：
- 组件命名：PascalCase
- 文件组织：按功能模块
```

### 原则 4：图表辅助

```markdown
## 订单状态流转

```mermaid
stateDiagram-v2
    [*] --> Pending: 创建订单
    Pending --> Paid: 支付成功
    Paid --> Preparing: 商家接单
    Preparing --> Delivering: 配送员接单
    Delivering --> Completed: 配送完成
    Pending --> Cancelled: 超时/用户取消
    Paid --> Cancelled: 退款
```

## 系统架构

```mermaid
graph TB
    A[用户端] --> B[API 网关]
    B --> C[用户服务]
    B --> D[订单服务]
    B --> E[商品服务]
    C --> F[(数据库)]
    D --> F
    E --> F
```
```

### 原则 5：交叉引用

文档之间要建立清晰的链接关系，避免信息孤岛。

**❌ 不好的做法**：

```markdown
# 订单模块

订单创建后需要支付。
```

**✅ 好的做法**：

```markdown
# 订单模块

订单创建后需要支付，详见 [支付流程](/business/payment-flow)。

相关文档：
- [订单状态流转](/business/workflows#订单状态)
- [订单 API](/api/orders)
- [支付模块](/modules/payment-module)
- [错误码：订单相关](/api/error-codes#order)
```

### 原则 6：面向受众分层

不同读者需要不同深度的信息。

```markdown
# 用户认证

## 快速了解（给产品经理看）
用户通过手机号 + 验证码登录，登录后获得 token，有效期 7 天。

## 技术实现（给开发者看）
- 认证方式：JWT（RS256）
- Token 有效期：7 天
- 刷新机制：滑动窗口，每次请求自动续期
- 存储位置：HttpOnly Cookie

## 接口详情（给前端看）
POST /api/auth/login
- 请求：{ phone, code }
- 响应：{ token, expires_at, user }
- 错误码：见 [认证错误码](/api/error-codes#auth)
```

### 原则 7：记录"为什么"而不只是"是什么"

**❌ 不好的做法**：

```markdown
订单取消时间限制为 2 小时。
```

**✅ 好的做法**：

```markdown
## 订单取消规则

**规则**：订单在商家接单前可取消，接单后 2 小时内可申请取消。

**为什么是 2 小时？**
- 之前是 24 小时，但商家反馈食材浪费严重
- 数据分析：95% 的合理取消发生在 2 小时内
- 2024-02 产品评审会决定调整（决策记录：[#DR-042](/decisions/dr-042)）

**影响范围**：
- 用户端：取消按钮在超时后隐藏
- 商家端：超时取消需要客服介入
- 配送端：配送中的订单不可取消
```

---

## Wiki 维护策略

### 1. 建立更新流程

```
代码变更 → 检查文档 → 更新文档 → 提交 PR → Code Review → 合并
```

**文档更新触发条件**：

| 代码变更类型 | 需要更新的文档 | 优先级 |
|------------|--------------|-------|
| 新增 API 端点 | API 文档、错误码列表 | 高 |
| 修改业务规则 | 业务文档、FAQ | 高 |
| 新增/修改数据模型 | 数据模型文档、API 文档 | 高 |
| 修改环境配置 | 环境搭建、部署文档 | 中 |
| 重构代码结构 | 项目结构、模块文档 | 中 |
| 修复 Bug | FAQ（如果是常见问题） | 低 |
| 依赖升级 | 技术栈文档 | 低 |

**PR 模板**：

```yaml
# .github/PULL_REQUEST_TEMPLATE.md
## 变更说明
<!-- 简要描述本次变更 -->

## 文档检查
- [ ] 已更新相关文档
- [ ] 已检查文档链接有效性
- [ ] 已更新 CHANGELOG（如有必要）

## 文档变更说明
<!-- 更新了哪些文档，为什么 -->
```

**文档变更的 Code Review 检查清单**：

```markdown
## 文档 Review 要点
- [ ] 内容准确性：与代码实现一致
- [ ] 示例可运行：代码示例经过验证
- [ ] 链接有效性：内部链接和外部链接可访问
- [ ] 格式规范性：符合 Markdown 规范
- [ ] 版本一致性：版本号与实际一致
```

### 2. 定期审查

```
每周：
- 检查本周代码变更
- 确认文档是否需要更新

每月：
- 全面检查文档完整性
- 清理过时内容

每季度：
- 根据使用反馈优化结构
- 补充缺失内容
```

### 3. 自动化检查

**基础检查：链接和格式**

```yaml
# .github/workflows/docs-check.yml
name: Docs Check

on:
  pull_request:
    paths:
      - 'docs/**'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: 检查文档链接
        uses: gaurav-nelson/github-action-markdown-link-check@v1
        with:
          use-quiet-mode: 'yes'
          config-file: '.markdown-link-check.json'

      - name: 检查文档格式
        run: npx prettier --check docs/**/*.md

      - name: 检查拼写
        uses: streetsidesoftware/cspell-action@v5
        with:
          files: 'docs/**/*.md'
```

**链接检查配置**：

```json
// .markdown-link-check.json
{
  "ignorePatterns": [
    { "pattern": "^https://localhost" },
    { "pattern": "^https://127.0.0.1" }
  ],
  "replacementPatterns": [
    {
      "pattern": "^/",
      "replacement": "docs/"
    }
  ],
  "httpHeaders": [
    {
      "urls": ["https://github.com"],
      "headers": {
        "Accept-Encoding": "zstd, br, gzip, deflate"
      }
    }
  ],
  "timeout": "10s",
  "retryOn429": true,
  "retryCount": 3,
  "aliveStatusCodes": [200, 206]
}
```

**进阶检查：文档覆盖率**

```bash
#!/bin/bash
# scripts/check-docs-coverage.sh
# 检查是否所有 API 路由都有对应文档

echo "=== 文档覆盖率检查 ==="

# 提取代码中的 API 路由
api_routes=$(grep -rn '@(Get|Post|Put|Delete|Patch)' src/ \
  | grep -oP "'\K[^']+")

# 检查每个路由是否在文档中提及
missing=0
for route in $api_routes; do
  if ! grep -rq "$route" docs/api/; then
    echo "❌ 缺少文档: $route"
    missing=$((missing + 1))
  fi
done

if [ $missing -eq 0 ]; then
  echo "✅ 所有 API 路由都有文档覆盖"
else
  echo "⚠️ 有 $missing 个 API 路由缺少文档"
  exit 1
fi
```

### 4. 让 AI 帮忙维护

AI 在文档维护中可以扮演多种角色：

**角色 1：文档审查员**

```
你：检查我们的 Wiki 是否有遗漏

AI：我看了你的 Wiki，以下内容可能缺失：
1. 没有错误码列表
2. 没有 WebSocket 连接说明
3. 缺少性能优化指南
4. 没有 CI/CD 流程文档
```

**角色 2：文档生成器**

```
你：根据这个 Controller 代码，帮我生成 API 文档

AI：（读取代码后自动生成）
## POST /api/orders
创建新订单

### 请求体
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| shop_id | string | 是 | 商家 ID |
| items | array | 是 | 商品列表 |
| address_id | string | 是 | 收货地址 ID |
...
```

**角色 3：文档同步检查器**

```
你：检查 API 文档和代码是否一致

AI：发现以下不一致：
1. ❌ docs/api/users.md 中 POST /api/users/register
   文档说需要 email 字段，但代码中已移除
2. ❌ docs/api/orders.md 中 GET /api/orders
   文档缺少 status 查询参数（代码中已添加）
3. ✅ docs/api/payments.md 与代码一致
```

**角色 4：文档翻译和润色**

```
你：帮我把这段技术文档改写得更易懂

AI：
原文：系统采用 CQRS 模式，读写分离，
     通过 Event Sourcing 实现最终一致性。

改写：系统把"读数据"和"写数据"分开处理：
     - 写操作：记录每一次变更事件
     - 读操作：从优化过的视图中查询
     - 好处：写入不会阻塞查询，系统更快
```

### 5. 文档健康度评估

定期对 Wiki 进行"体检"，量化文档质量：

```markdown
## Wiki 健康度报告 - 2024年3月

### 覆盖率
- API 文档覆盖率：85%（34/40 个端点）
- 模块文档覆盖率：70%（7/10 个模块）
- 业务规则覆盖率：90%

### 新鲜度
- 最近 30 天更新的文档：60%
- 超过 90 天未更新的文档：15%
- 需要紧急更新的文档：3 篇

### 质量
- 有示例代码的文档：75%
- 有图表的文档：40%
- 有交叉引用的文档：65%

### 待办
- [ ] 补充支付模块 API 文档
- [ ] 更新订单取消规则（已变更）
- [ ] 添加 WebSocket 推送文档
```

---

## 让 AI 使用 Wiki

> Wiki 的终极价值在于：让 AI 像团队成员一样理解你的项目。

### 方式 1：直接引用文件路径

**适用场景**：AI 工具支持读取本地文件（如 Claude Code、Cursor、GitHub Copilot Chat）

```
你：帮我写一个用户注册功能

参考：
- 技术栈：wiki/overview/tech-stack.md
- 编码规范：wiki/development/coding-standards.md
- 用户模块：wiki/modules/user-module.md
- 数据模型：wiki/business/data-model.md
```

**优点**：信息完整、不会遗漏细节
**缺点**：需要知道文件路径、可能引入过多无关信息

### 方式 2：总结传递

**适用场景**：AI 工具不支持读取文件，或需要精确控制上下文

```
你：帮我写一个用户注册功能

项目信息：
- 框架：Nest.js + TypeORM
- 数据库：PostgreSQL
- 认证方式：JWT
- 密码加密：bcrypt
- 代码风格：参考 src/modules/user

业务规则：
- 手机号必须唯一
- 密码至少 8 位，包含大小写和数字
- 需要短信验证码，有效期 5 分钟
- 同一手机号每天最多发送 10 次验证码
```

**优点**：精确控制、节省 token
**缺点**：需要手动整理、可能遗漏信息

### 方式 3：让 AI 自己读（推荐）

**前提**：AI 工具支持读取本地文件（如 Claude Code、Cursor）

```
你：帮我写一个用户注册功能

AI：（自动读取 Wiki）
我看了你的项目 Wiki：
- 技术栈：Nest.js + TypeORM + PostgreSQL
- 认证用 JWT
- 密码用 bcrypt 加密
- 参考 user 模块的现有代码

这是实现方案...
```

**为什么这是最佳方式？**

| 对比维度 | 手动引用 | 总结传递 | AI 自动读取 |
|---------|---------|---------|-----------|
| 信息完整性 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 操作便捷性 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Token 效率 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 上下文准确性 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

**配合 CLAUDE.md / .cursorrules 使用**：

在项目根目录创建 AI 配置文件，让 AI 自动知道去哪里找文档：

```markdown
# CLAUDE.md（或 .cursorrules）

## 项目文档
本项目的 Wiki 文档位于 docs/ 目录下：
- 项目概述：docs/overview/
- 开发指南：docs/development/
- 业务规则：docs/business/
- API 文档：docs/api/
- 技术决策：docs/decisions/

## 开发规范
在编写代码前，请先阅读：
1. docs/development/coding-standards.md - 编码规范
2. docs/development/git-workflow.md - Git 工作流
3. docs/business/rules.md - 相关业务规则
```

### 最佳实践：上下文卡片

上下文卡片是一种专门为 AI 设计的文档格式，把 AI 完成任务所需的所有信息集中在一个文件中。

**基础模板**：

```markdown
---
context card: user-registration
---

## 功能需求
实现用户注册功能

## 技术约束
- 框架：Nest.js
- 数据库：PostgreSQL
- 认证：JWT

## 业务规则
- 手机号必须唯一
- 密码至少 8 位
- 需要短信验证码

## 参考代码
- src/modules/user/auth.service.ts
- src/modules/user/user.entity.ts
```

**进阶模板：Bug 修复卡片**

```markdown
---
context card: fix-order-timeout
type: bug-fix
priority: high
---

## 问题描述
订单支付超时后，状态未自动变更为 cancelled

## 复现步骤
1. 创建订单（状态：pending）
2. 等待 15 分钟不支付
3. 预期：状态变为 cancelled
4. 实际：状态仍为 pending

## 相关代码
- src/modules/order/order.scheduler.ts（定时任务）
- src/modules/order/order.service.ts（状态变更逻辑）

## 相关文档
- docs/business/rules.md#订单超时规则
- docs/api/orders.md#订单状态

## 约束
- 不能影响正常支付流程
- 需要补偿已超时但未处理的历史订单
```

**进阶模板：新功能卡片**

```markdown
---
context card: add-coupon-system
type: feature
sprint: 2024-Q2
---

## 功能概述
为平台添加优惠券系统，支持满减、折扣、免配送费三种类型

## 业务规则
- 每个用户每种优惠券最多领取 1 张
- 优惠券有有效期，过期自动失效
- 满减券：订单金额 >= 门槛金额时可用
- 折扣券：最高优惠不超过 50 元
- 同一订单只能使用 1 张优惠券

## 数据模型
- coupon_template：优惠券模板（类型、面额、门槛、有效期）
- user_coupon：用户持有的优惠券（领取时间、使用状态）

## 技术约束
- 需要防止并发领取（使用 Redis 分布式锁）
- 优惠券核销需要在支付事务中完成
- 需要定时任务清理过期优惠券

## 参考
- 现有模块结构：src/modules/order/（参考模块组织方式）
- 数据库迁移：参考 src/database/migrations/
- API 风格：参考 docs/api/overview.md
```

### 方式 4：结合 RAG 系统（企业级）

对于大型项目，可以将 Wiki 接入 RAG（检索增强生成）系统：

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Wiki 文档   │ ──→ │  向量化存储   │ ──→ │  语义检索    │
│  (Markdown)  │     │  (Embedding) │     │  (Retrieval) │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  AI 生成回答 │ ←── │  上下文组装   │ ←── │  相关文档片段 │
│  (Generate)  │     │  (Augment)   │     │  (Context)   │
└─────────────┘     └──────────────┘     └─────────────┘
```

**工作流程**：
1. Wiki 文档被切分为小块并向量化
2. 用户提问时，系统自动检索最相关的文档片段
3. 将检索到的文档作为上下文传给 AI
4. AI 基于项目文档生成准确的回答

**适用场景**：
- 文档量超过 100 篇
- 团队成员频繁向 AI 提问项目相关问题
- 需要在 Slack/飞书等平台集成 AI 助手

---

## Wiki 文档模板库

为了降低写文档的门槛，提供一套开箱即用的模板。

### 模板 1：模块文档模板

```markdown
# [模块名称] 模块

## 概述
一句话描述模块的职责。

## 核心功能
- 功能 1：简要说明
- 功能 2：简要说明

## 目录结构
src/modules/[module-name]/
├── [module].controller.ts   # 路由控制器
├── [module].service.ts      # 业务逻辑
├── [module].entity.ts       # 数据实体
├── [module].dto.ts          # 数据传输对象
├── [module].module.ts       # 模块定义
└── __tests__/               # 单元测试

## 数据模型

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | UUID | 主键 | 自动生成 |
| ... | ... | ... | ... |

## 关键业务逻辑
<!-- 描述核心算法或业务流程 -->

## 依赖关系
- 依赖：[其他模块名]
- 被依赖：[其他模块名]

## 相关文档
- [API 文档](/api/[module])
- [业务规则](/business/[related-rules])
```

### 模板 2：API 端点文档模板

```markdown
# [资源名称] API

## 概述
[资源]相关的 CRUD 操作接口。

基础路径：`/api/v1/[resource]`

## 认证
所有接口需要 Bearer Token 认证，详见 [认证文档](/api/auth)。

---

### POST /api/v1/[resource]
创建[资源]

**请求体**：
| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| name | string | 是 | 名称 | "示例" |

**成功响应** (201)：
```json
{
  "code": 0,
  "data": { "id": "uuid", "name": "示例" }
}
```

**错误响应**：
| 错误码 | HTTP 状态 | 说明 |
|--------|----------|------|
| 1001 | 400 | 参数校验失败 |
| 1002 | 409 | 资源已存在 |

---

### GET /api/v1/[resource]
获取[资源]列表

**查询参数**：
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码 |
| limit | number | 20 | 每页数量 |
| sort | string | -created_at | 排序字段 |
```

### 模板 3：技术决策记录（ADR）模板

```markdown
# ADR-[编号]: [决策标题]

## 状态
[提议 | 已采纳 | 已废弃 | 已替代]

## 背景
<!-- 什么情况下需要做这个决策？ -->

## 决策
<!-- 我们决定做什么？ -->

## 选项对比
| 选项 | 优势 | 劣势 | 评分 |
|------|------|------|------|
| 选项 A | ... | ... | ⭐⭐⭐ |
| 选项 B | ... | ... | ⭐⭐⭐⭐ |

## 影响
<!-- 这个决策会带来什么影响？ -->

## 相关决策
- [ADR-xxx](/decisions/adr-xxx)
```

---

## 常见问题与解决方案

### Q1：文档总是过时怎么办？

**根本原因**：文档更新没有纳入开发流程。

**解决方案**：

```
1. 在 PR 模板中强制要求文档检查 ✅
2. CI 中添加文档覆盖率检查 ✅
3. 每周 Standup 中增加"文档更新"议题 ✅
4. 指定文档负责人（Documentation Owner）✅
```

### Q2：团队成员不愿意写文档？

**策略**：降低写文档的成本，提高写文档的收益。

| 策略 | 具体做法 |
|------|---------|
| 降低成本 | 提供模板、让 AI 辅助生成初稿 |
| 提高收益 | 在 Code Review 中引用文档、新人入职靠文档 |
| 建立习惯 | 代码和文档一起提交、PR 中包含文档变更 |
| 正向激励 | 文档贡献纳入绩效、每月评选最佳文档 |

### Q3：文档太多，找不到需要的信息？

**解决方案**：

1. **搜索优化**：配置 Algolia 或本地搜索
2. **导航优化**：合理的侧边栏分组 + 面包屑导航
3. **标签系统**：在 frontmatter 中添加标签

```markdown
---
tags: [订单, 支付, 业务规则]
---
```

4. **快速入口**：在首页提供常用文档的快捷链接

### Q4：多人同时编辑文档冲突怎么办？

**Git 工作流解决**：

```
1. 每人在自己的分支上编辑文档
2. 通过 PR 合并，自动检测冲突
3. Markdown 是纯文本，冲突容易解决
4. 建议：每个文档文件不超过 300 行，减少冲突概率
```

### Q5：如何衡量 Wiki 的价值？

**可量化的指标**：

```markdown
## Wiki ROI 评估

### 效率指标
- 新人入职时间：从 2 周 → 3 天（有 Wiki 后）
- AI 代码生成准确率：从 60% → 85%（提供 Wiki 上下文后）
- 重复问题咨询次数：减少 70%

### 使用指标
- 月活跃阅读人数：团队 90% 成员
- 文档搜索次数：日均 50+ 次
- AI 引用文档次数：日均 30+ 次
```

---

## 总结

### 核心要点

1. **Wiki 是上下文管理的最佳载体**
   - 结构化、可搜索、版本管理
   - AI 友好、易于维护

2. **VitePress 是简单高效的选择**
   - 纯 Markdown、Git 原生
   - 部署简单、免费托管

3. **内容组织要层次清晰**
   - 概述 → 开发 → 业务 → API
   - 每个章节有明确目的

4. **维护是持续的过程**
   - 代码变了，文档也要变
   - 定期检查、及时更新
   - 让 AI 帮忙

5. **写作质量决定 Wiki 价值**
   - 结构化 > 流水账
   - 示例 > 纯文字描述
   - 记录"为什么" > 只记录"是什么"
   - 交叉引用 > 信息孤岛

6. **AI 是 Wiki 的最大受益者**
   - 结构化文档让 AI 生成更准确的代码
   - 上下文卡片是 AI 协作的最佳实践
   - Wiki + AI = 团队生产力倍增器

### 快速行动清单

从零开始搭建 Wiki，按以下顺序执行：

```
第 1 天：基础搭建
□ 安装 VitePress，初始化项目
□ 创建基本目录结构（overview/、development/、api/）
□ 编写首页和项目简介

第 1 周：核心内容
□ 编写环境搭建指南（让新人能跑起来）
□ 编写技术栈文档
□ 编写 3-5 个核心 API 文档
□ 编写最重要的业务规则

第 1 月：完善体系
□ 补充所有 API 文档
□ 编写编码规范和 Git 工作流
□ 添加技术决策记录（ADR）
□ 配置搜索功能
□ 部署到线上

持续维护：
□ PR 模板中添加文档检查
□ CI 中添加链接检查
□ 每月文档健康度评估
□ 配置 CLAUDE.md 让 AI 自动使用 Wiki
```

### 下一步

搭建好 Wiki 后，我们将学习：

- [代码即文档：自动生成上下文](./04-code-as-docs/) → 从代码提取上下文
- [让 AI 使用上下文的技巧](./05-ai-context-tips/) → 实际操作方法

---

[← 返回文章目录](../context-management/) | [继续学习：代码即文档 →](./04-code-as-docs/)
