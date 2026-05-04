# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Awesome-Study-Agent 是一个基于 VitePress 构建的 AI Agent 系统性学习文档网站。项目旨在为零基础学习者提供轻松掌握 AI Agent 的学习资源。

## 开发命令

### 启动开发服务器
```bash
pnpm run docs:dev
```
启动本地开发服务器,通常在 `http://localhost:5173` 访问。

### 构建生产版本
```bash
pnpm run docs:build
```
构建静态网站,输出到 `config/.vitepress/dist` 目录。

### 预览生产构建
```bash
pnpm run docs:preview
```
预览构建后的静态网站。

## 项目架构

### 核心目录结构

```
awesome-study-agent/
├── config/                    # VitePress 文档根目录
│   ├── .vitepress/           # VitePress 配置和缓存
│   │   ├── config.mts        # VitePress 主配置文件
│   │   └── cache/            # VitePress 构建缓存
│   ├── index.md              # 网站首页
│   ├── markdown-examples.md  # Markdown 示例页面
│   └── api-examples.md       # API 示例页面
├── node_modules/             # 依赖包
├── package.json              # 项目配置
└── pnpm-lock.yaml           # pnpm 锁文件
```

### VitePress 配置 (`config/.vitepress/config.mts`)

VitePress 配置文件使用 TypeScript,导出站点和主题配置:

- `title`: 网站标题
- `description`: 网站描述
- `themeConfig.nav`: 顶部导航栏配置
- `themeConfig.sidebar`: 侧边栏配置
- `themeConfig.socialLinks`: 社交媒体链接

### 内容组织

所有文档内容存储在 `config/` 目录下,使用 Markdown 格式:

- **首页** (`index.md`): 使用 VitePress 的 home 布局,包含 hero 区域和特性展示
- **Markdown 文件**: 支持完整的 VitePress Markdown 扩展,包括:
  - 语法高亮 (使用 Shiki)
  - 自定义容器 (info, tip, warning, danger, details)
  - frontmatter 配置
  - Vue 组件集成

### 包管理

项目使用 **pnpm** 作为包管理器 (版本 10.6.5),在 `package.json` 中已指定。

主要依赖:
- `vitepress`: ^1.6.4 - 静态网站生成器

## 添加新内容

1. 在 `config/` 目录下创建新的 `.md` 文件
2. 在 `config/.vitepress/config.mts` 中更新导航和侧边栏配置
3. 首页或其他页面可以通过相对路径链接到新页面
4. VitePress 支持热重载,保存后自动刷新浏览器

## 自定义和扩展

### 添加主题自定义
在 `config/.vitepress/theme/` 目录下创建自定义主题文件(如果需要):

- `index.ts`: 主题入口
- `components/`: 自定义 Vue 组件
- `styles/`: 自定义样式

### VitePress 特性
- 支持在 Markdown 中嵌入 Vue 组件
- 使用 `useData()` API 访问页面、主题和站点数据
- 内置搜索功能
- 响应式设计

## 许可证

项目使用 Apache License 2.0 许可证。
