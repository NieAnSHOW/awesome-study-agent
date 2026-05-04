# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Awesome-Study-Agent 是一个面向零基础学习者的 AI Agent 系统性知识库。**15 个基础模块 + 3 个深度指南 + 6 个附录**，共 154 篇 Markdown 文档。所有内容由 DeepSeek V4 辅助生成。

## 开发命令

```bash
pnpm run docs:dev       # 启动本地开发服务器 (http://localhost:5173)
pnpm run docs:build     # 构建生产版本，输出到 config/.vitepress/dist
pnpm run docs:preview   # 预览构建后的静态网站
```

依赖：Node.js + pnpm 10.6.5。无测试流程。

## 项目架构

```
config/                     # 文档根目录（VitePress 内容源）
├── .vitepress/
│   ├── config.mts          # VitePress 主配置 (460 行)，含 nav/sidebar/teek 主题配置
│   └── theme/              # 自定义主题 (index.ts + root.css)
├── index.md                # 网站首页
├── preface.md              # 课程大纲/序言
├── basics/                 # 15 个基础模块 (15×5-8 篇文章)
│   ├── 01-ai-overview/     # AI 概述与 Agent 概念
│   ├── 02-llm-fundamentals/
│   ├── 03-prompt-engineering/
│   ├── 04-agent-fundamentals/
│   ├── 05-rag-knowledge/
│   ├── 06-ai-coding-tools/
│   ├── 07-agent-ecosystem/
│   ├── 08-model-training/
│   ├── 09-agent-skills/
│   ├── 10-openclaw/
│   ├── 11-workbuddy/
│   ├── 12-ai-video-generation/
│   ├── 13-multimodal-ai/
│   ├── 14-ai-image-generation/
│   └── 15-markdown-reading-tools/
├── deep-dive/              # 3 个深度指南 (各 14 篇文章)
│   ├── agent-skills/       # Agent Skills 系统
│   ├── context-management/ # 大模型上下文管理
│   └── openclaw/           # OpenClaw 深度指南
└── appendix/               # 6 个附录页面
    ├── glossary.md         # 术语表
    ├── tools-list.md       # 工具清单
    ├── prompts-library.md  # 提示词模板库
    ├── faq.md              # FAQ
    ├── resources.md        # 资源推荐
    └── changelog.md        # 更新日志

scripts/
└── humanize_docs.py        # 文档去 AI 味处理脚本

devlogs/                    # 项目开发日志
docs/superpowers/           # 开发计划与设计文档
```

## 技术栈

- **构建**: VitePress ^1.6.4
- **主题**: vitepress-theme-teek ^1.5.4 — 在 config.mts 中通过 `defineTeekConfig` 配置，提供深色切换动画、代码块折叠、版权信息等增强功能
- **包管理**: pnpm 10.6.5

## 内容约定

- 每个基础模块目录包含 `index.md` + 若干 Markdown 文档
- 每篇文章最后带「检验标准」小节，用于自测是否掌握
- 新增内容需要在 `config/.vitepress/config.mts` 中同步更新 nav（导航栏）和 sidebar（侧边栏）配置
- 添加模块时需同时在 README.md 的内容架构表格中更新

## 辅助脚本

```bash
python3 scripts/humanize_docs.py  # 对指定目录的 Markdown 文件执行去 AI 味处理
```

脚本目前硬编码了处理路径和文件列表，添加新目标需修改 `main()` 函数中的路径配置。
