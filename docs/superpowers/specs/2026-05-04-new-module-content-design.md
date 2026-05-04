# 新知识模块设计：Agent 生态扩展

> **日期**：2026-05-04
> **状态**：已批准
> **对应任务**：为 Agent 生态模块新增 Hermes Agent、Claude Design、Pencil 知识点

## 1. 背景与目标

当前「Agent 生态」模块（07-agent-ecosystem）已覆盖 6 个主题：Agent 框架、Agent 平台、MCP 协议、Skills 系统、Function Calling、Agent 编排。现需扩展 3 个新主题：Hermes Agent、Claude Design、Pencil 原型设计工具。

## 2. 方案选择

**推荐方案：按需分配篇幅**
- Hermes Agent → 2 篇（概述 + 实战部署）
- Claude Design → 1 篇（综合指南）
- Pencil → 2 篇（工具入门 + MCP 集成）
- 共 5 篇新文章，编号 07-11

理由：Hermes Agent（132K stars）作为开源大型项目需要更多篇幅；Claude Design 是方法论型内容 1 篇即可；Pencil 需要工具使用和 MCP 集成分开覆盖。

## 3. 文章结构

```
config/agent-ecosystem/07-agent-ecosystem/
├── 01-agent-frameworks.md      # 已有
├── 02-agent-platforms.md       # 已有
├── 03-mcp-protocol.md          # 已有
├── 04-skills-system.md         # 已有
├── 05-function-calling.md      # 已有
├── 06-orchestration.md         # 已有
├── 07-hermes-agent-overview.md # 新增
├── 08-hermes-agent-deploy.md   # 新增
├── 09-claude-design.md         # 新增
├── 10-pencil-intro.md          # 新增
├── 11-pencil-mcp.md            # 新增
└── index.md                    # 更新
```

## 4. 内容大纲

### 07. Hermes Agent 概述

**预计篇幅**：~5000 字 | **难度**：⭐⭐☆☆☆

大纲：
1. **Hermes Agent 是什么** — NousResearch 背景、项目定位（带自学习循环的 Agent）、与其他 Agent 框架的差异
2. **核心架构** — Agent 核心层、Gateway 消息层、Skills 系统、工具集、MCP 集成
3. **自学习循环机制** — 技能自动创建与改进、跨会话记忆（FTS5 + LLM 摘要）
4. **多平台支持** — Telegram/Discord/Slack/CLI/TUI 等平台集成架构
5. **模型兼容性** — 支持的模型提供商（Nous Portal、OpenRouter、OpenAI 等）、切换方式
6. **核心特点总结** — 对比已有 Agent 框架（LangGraph、CrewAI）的不同定位
7. **检验标准**

### 08. Hermes Agent 实战部署

**预计篇幅**：~6000 字 | **难度**：⭐⭐⭐☆☆

大纲：
1. **部署方式概览** — 六种后端对比（本地/Docker/SSH/Daytona/Singularity/Modal）
2. **快速上手（Docker 部署）** — docker-compose 配置、服务启动、首次配置
3. **VPS 部署实战** — 环境要求、uv 包管理、持久化配置
4. **Serverless 部署** — Modal 部署、近零闲置成本
5. **平台集成配置** — 连接 Telegram Bot / Discord / Slack
6. **技能创建入门** — 内置技能系统、从对话中自动产生技能、手动创建技能
7. **自动化任务（Cron）** — 定时任务配置、日报/备份等场景
8. **从 OpenClaw 迁移** — 导入已有配置和数据
9. **检验标准**

### 09. Claude 设计能力

**预计篇幅**：~5000 字 | **难度**：⭐⭐☆☆☆

大纲：
1. **Claude 的设计能力概览** — 能做什么类型的设计工作（UI/UX、概念图、海报、原型描述等）
2. **设计工作流** — 从口头描述到视觉产出的提示词工程方法
3. **UI/UX 原型设计** — 用 Claude 生成 HTML/CSS 原型、交互式 Demo 的实践
4. **设计与开发的桥梁** — 将 Claude 的设计输出转化为开发资产（代码、规范、设计说明）
5. **与其他设计工具配合** — Claude + Figma / Pencil / 其他工具的协作模式
6. **最佳实践与局限** — 提示词技巧、迭代策略、当前限制
7. **检验标准**

### 10. Pencil 原型设计工具入门

**预计篇幅**：~5000 字 | **难度**：⭐⭐☆☆☆

大纲：
1. **Pencil 是什么** — 开源原型工具定位、适用场景（线框图/原型/UI 设计）
2. **安装与界面** — 各平台安装、核心界面组件介绍
3. **基本操作** — 创建页面、拖拽控件、编辑属性、组织图层
4. **设计系统组件** — 内置模板库、自定义组件、复用模式
5. **导出与交付** — PNG/SVG/PDF 导出、与开发协作
6. **Pencil 在 Agent 生态中的角色** — 作为 Agent 的设计产出工具
7. **检验标准**

### 11. Pencil MCP 集成

**预计篇幅**：~6000 字 | **难度**：⭐⭐⭐☆☆

大纲：
1. **MCP 与设计工具的桥梁** — 为什么把 Pencil 接入 MCP 协议
2. **Pencil MCP 架构** — MCP Server 能力概览（读取/搜索/创建/修改/导出）
3. **核心操作演示** — 通过 MCP 命令创建页面、插入控件、修改属性、导出图片
4. **自动化设计工作流** — 用 Agent 驱动 Pencil 自动生成原型、批量修改
5. **Agent + Pencil 实践案例** — 从需求描述到原型输出的端到端流程
6. **局限与注意** — 当前 MCP 能力边界、最佳实践
7. **检验标准**

## 5. 需要修改的文件

| 文件 | 修改内容 |
|------|----------|
| `config/agent-ecosystem/07-agent-ecosystem/index.md` | 更新章节列表（增加 07-11）、学习检验条目 |
| `config/.vitepress/config.mts` | 更新 sidebar 中模块 07 的文章列表 |
| `README.md` | 更新模块 07 的篇数（7 → 12） |

## 6. 内容风格

- 保持与现有文章一致：每篇含学习目标头、难度分级、更新日期
- 每篇文章末尾加「检验标准」小节
- 使用已有的文档样式（提示框、代码块、对比表格等）

## 7. 执行参考

每篇文章撰写时需联网搜索补充最新信息，确保内容时效性。Hermes Agent 引用其 GitHub 和官方文档；Claude Design 参考 Anthropic 官方文档和社区实践；Pencil 参考 Pencil 项目和 MCP 相关文档。
