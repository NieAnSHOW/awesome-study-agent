---
title: 模块十五：Markdown 阅读工具 — 设计文档
date: 2026-05-04
status: draft
---

# 模块十五：Markdown 阅读工具 — 设计文档

## 1. 概述

在基础模块中新增"Markdown 阅读工具"模块（模块十五），作为 AI Agent 学习之旅中的"工具补给站"。学习 AI Agent 的过程中，学习者会接触到大量 Markdown 格式的文档（项目 README、技术博客、API 文档、笔记资料），掌握一款好用的 Markdown 阅读/管理工具，能显著提升学习效率。

### 1.1 模块定位

- **模块编号**：15
- **模块名称**：Markdown 阅读工具
- **目标读者**：有基本电脑操作能力的学习者
- **核心诉求**：免费、易安装、上手快
- **内容基调**：实用导向，手把手教学

### 1.2 为什么放在这里

学习 AI Agent 的过程中，大量资料以 Markdown 格式存在（GitHub README、技术文档、课程笔记）。一个趁手的 Markdown 阅读工具，就像是给学习者配了一把好用的钥匙——不是 AI Agent 的核心知识，但能优化整个学习体验。

## 2. 页面结构

```
config/basics/15-markdown-reading-tools/
├── index.md              # 模块介绍 + 什么是 Markdown + 工具全景一览
├── 01-obsidian.md         # Obsidian：最强双链笔记工具
├── 02-logseq.md           # Logseq：开源大纲式知识管理
├── 03-marktext.md         # MarkText：简洁优雅的 Markdown 编辑器
├── 04-joplin.md           # Joplin：开源跨平台笔记应用
├── 05-zettlr.md           # Zettlr：面向学术写作的 Markdown 编辑器
└── 06-comparison.md       # 横向对比与选型建议
```

## 3. 每页统一模板

除 `index.md` 和 `06-comparison.md` 外，每篇工具页遵循以下结构：

| 章节 | 内容说明 | 篇幅 |
|------|---------|------|
| 一句话介绍 | 用一句话说清楚这是什么工具 | 1 句 |
| 核心特点 | 3-5 个 bullet points 概括亮点 | 短 |
| 下载与安装 | 分平台（Windows / macOS / Linux）列出下载方式 | 中 |
| 快速上手 | 新建第一个笔记 / 打开第一个文件 | 中 |
| 核心功能速览 | 最常用的功能点简介（配截图说明） | 中 |
| 优缺点 | 诚实列出优缺点，帮读者做判断 | 短 |

### 3.1 下载链接策略

每个工具的"下载与安装"章节按以下优先级提供下载源：

1. **官方下载页** — 官网直接提供下载（如 obsidian.md/download）
2. **GitHub Releases** — 开源项目在 GitHub 的发布页
3. **国内软件站** — 已验证可用的国内下载站（如大眼仔旭、系统之家等）
4. **应用商店** — App Store、Microsoft Store 等
5. **占位符** — 以上均未找到时，标注 `[待补充：中国大陆可直接访问的下载链接]`

### 3.2 工具信息汇总

| 工具 | 官网 | GitHub | 国内下载源 |
|------|------|--------|-----------|
| Obsidian | obsidian.md | github.com/obsidianmd/obsidian-releases | 阿里云镜像(mirrors.aliyun.com)、SourceForge、obsidian.md/zh/help/install |
| Logseq | logseq.com | github.com/logseq/logseq | uptodown 中文站 |
| MarkText | github.com/marktext/marktext | GitHub Releases | SourceForge、多个国内软件站 |
| Joplin | joplinapp.org（有中文页） | github.com/laurent22/joplin/releases | App Store 中国区、大眼仔旭等 |
| Zettlr | zettlr.com/download | github.com/Zettlr/Zettlr/releases | 大眼仔旭、系统之家等 |

## 4. 各页内容概要

### 4.1 index.md — 模块介绍

内容：
- 什么是 Markdown（极简解释，不超过 50 字）
- 为什么学习 AI Agent 需要一款 Markdown 工具
- 本模块涵盖的工具一览（简要对比表）
- 学习路径建议：新手从 Obsidian 或 MarkText 入手

### 4.2 01-obsidian.md — Obsidian

篇幅：最详细（预计 800-1000 字）

内容重点：
- 本地优先、隐私安全
- 双向链接与图谱视图
- 强大的插件生态
- 安装步骤分平台详细说明
- 快速上手：创建第一个笔记、使用双向链接

### 4.3 02-logseq.md — Logseq

篇幅：较详细（预计 600-800 字）

内容重点：
- 开源免费，大纲式笔记（Outliner）
- 块级引用（Block Reference）
- 白板功能
- 安装步骤 + 快速上手

### 4.4 03-marktext.md — MarkText

篇幅：中等（预计 500-600 字）

内容重点：
- 所见即所得（WYSIWYG）
- 极简设计，专注写作
- 适合：轻量编辑、阅读渲染
- 安装步骤 + 打开第一个 md 文件

### 4.5 04-joplin.md — Joplin

篇幅：中等（预计 500-600 字）

内容重点：
- 开源跨平台，支持端到端加密
- 支持笔记同步（多种同步方式）
- 待办事项管理
- 安装步骤 + 快速上手

### 4.6 05-zettlr.md — Zettlr

篇幅：中等（预计 500-600 字）

内容重点：
- 面向学术写作
- 支持 Zotero 集成（文献管理）
- 引用和导出（CiteKey 支持）
- 安装步骤 + 快速上手

### 4.7 06-comparison.md — 横向对比

篇幅：简洁（预计 300-400 字）

内容：
- 横向对比表格（功能/平台/难度/适合人群）
- 选型建议

| 工具 | 核心定位 | 难度 | 适合人群 |
|------|---------|------|---------|
| Obsidian | 双链知识管理 | ⭐⭐ | 知识工作者、笔记达人 |
| Logseq | 大纲式知识管理 | ⭐⭐⭐ | 结构化思维者 |
| MarkText | 轻量 Markdown 编辑 | ⭐ | 只需阅读/编辑 md 文件 |
| Joplin | 跨平台笔记同步 | ⭐⭐ | 多设备同步需求者 |
| Zettlr | 学术写作 | ⭐⭐⭐ | 学生、研究人员 |

## 5. 写作风格说明

- 使用 huashu-perspective 思维框架进行内容输出
- 语言风格：务实、直接、有画面感
- 用类比和场景化描述帮助理解
- 安装步骤要求 100% 可操作性，不跳步

## 6. 配置变更

需要在 `config/.vitepress/config.mts` 中：

1. 导航栏「基础知识」下拉菜单新增「Markdown 阅读工具」条目
2. 侧边栏「基础型路径」新增模块十五，包含子页面

## 7. 搜索建议

内容撰写前使用 unified-search 搜索以下信息进行补充：
- 各工具的最新版本号
- 中国大陆地区可用的下载链接
- 各工具的系统要求（最低版本）
- 各工具的当前维护状态（是否仍在活跃更新）
