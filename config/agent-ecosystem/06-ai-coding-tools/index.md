# AI 编程工具

> **学习目标**：掌握 2026 年主流 AI 编程工具的全景和用法，找到适合你的工具组合
> **预计时间**：8-10 小时
> **难度**：⭐⭐

---

## 一句话结论

AI 编程工具不是锦上添花，是必需品。2026 年，约 84% 的开发者已经在用 AI 辅助编程。不是"要不要用"的问题，是"用哪个、怎么组合"的问题。

花叔说的："不是 AI 替你写代码，是 AI 让你一天干三天的话。"

## 模块介绍

2026 年的 AI 编程工具格局跟两年前完全不同了。

Cursor 从 VS Code 的一个 fork 变成了 AI IDE 霸主 — 3.x 版本加入了异步子智能体，Composer 一次改几十个文件跟玩一样。Claude Code 从一个终端实验品变成了工程化编程的标杆 — 51 万行代码，grep 打败了 RAG。Windsurf 被 Google 收购后推出 Antigravity。OpenAI 搞了 Codex CLI 沙箱安全方案。Amazon 出了 Kiro。字节跳动做了 Trae。

神仙打架，用户受益。

但工具越多，选择越难。这个模块帮你解决一个核心问题：**哪个工具适合你，怎么组合最划算**。

## 章节列表

| # | 章节 | 核心内容 | 预计时间 |
|---|------|---------|---------|
| 1 | [概述与全景](/agent-ecosystem/06-ai-coding-tools) | 2026 年工具格局、选择标准、学习路径 | 20 分钟 |
| 2 | [Cursor 编辑器](/agent-ecosystem/06-ai-coding-tools/01-cursor) | AI 原生 IDE，Composer 2、Async Subagents、信用额制度 | 60 分钟 |
| 3 | [Claude Code](/agent-ecosystem/06-ai-coding-tools/02-claude-code) | 终端 AI 助手 2.1，CLAUDE.md、Hooks/Skills、MCP、Worktree | 60 分钟 |
| 4 | [Windsurf 与 Antigravity](/agent-ecosystem/06-ai-coding-tools/03-other-tools) | Cascade 引擎、Flow 体验、Google 收购后的变化 | 40 分钟 |
| 5 | [OpenAI Codex 与 Kiro](/agent-ecosystem/06-ai-coding-tools/04-best-practices) | 沙箱执行 CLI + 规格驱动开发 IDE | 40 分钟 |
| 6 | [Trae 与国内编程工具](/agent-ecosystem/06-ai-coding-tools/05-environment-setup) | 字节 Trae、国内 AI 编程生态、环境搭建 | 40 分钟 |
| 7 | [工具组合与最佳实践](/agent-ecosystem/06-ai-coding-tools/06-cc-switch) | "Cursor 做手、Claude Code 做脑、Codex 做腿"、成本计算、黄金组合 | 50 分钟 |
| 8 | [从零搭建实战](/agent-ecosystem/06-ai-coding-tools/07-full-project-practice) | 端到端演示：用 AI 工具从零搭一个 Web 应用 | 60 分钟 |

## 工具选择速查

### 按预算选

| 预算 | 推荐 | 理由 |
|------|------|------|
| $0 | Trae 国内版 + Codex CLI | 一个图形界面、一个终端，都免费 |
| $20/月 | Cursor Pro | 性价比之王，一个人干三个人的活 |
| $50/月 | Cursor Pro + Claude Pro | IDE + 终端双工具，覆盖所有场景 |
| $100+/月 | Cursor Ultra + Claude Max 5x | 重度用户的终极组合 |

### 按场景选

| 场景 | 推荐工具 | 原因 |
|------|---------|------|
| 前端开发 | Cursor + Claude Code | Cursor 做手、Claude Code 做脑 |
| 全栈项目 | Cursor + Codex CLI | Cursor 写界面，Codex 沙箱跑安全敏感代码 |
| 快速原型 | Trae / Windsurf | Builder 模式一键出活，Flow 体验丝滑 |
| 重构迁移 | Claude Code + Git Worktree | 终端工具擅长批量操作，Worktree 并行干活 |
| 安全敏感 | Codex CLI | 沙箱隔离，代码不直接接触文件系统 |
| 团队协作 | Kiro + Cursor | Kiro 管规格设计，Cursor 管代码实现 |
| 国内团队 | Trae | 免费直连，合规不翻墙 |

## 学习路径

### 路线 1：新手入门（推荐）

```
1. Trae 国内版 ← 免费上手，零门槛
2. Cursor 编辑器 ← 主力工具，花 60 分钟掌握
3. 工具组合与最佳实践 ← 学会搭配
4. 从零搭建实战 ← 跟着做一遍
```

### 路线 2：快速体验

```
1. 工具组合与最佳实践 ← 先看全局
2. 从零搭建实战 ← 跟着做一遍
3. 按兴趣深入具体工具
```

### 路线 3：深度学习

```
1. Cursor 编辑器 ← 深入掌握
2. Claude Code ← 进阶利器
3. Windsurf / Codex / Kiro ← 了解竞品
4. Trae 与国内工具 ← 国产方案
5. 工具组合与最佳实践 ← 系统总结
```

## 花叔的 AI 编程哲学

花叔有个理论叫 **Harness Engineering** — AI 编程的核心不是模型能力，是给模型造缰绳的工程。

什么意思？模型会犯错，会写出烂代码，会用你根本不知道的库。你的工作不是让模型更强，是给它设计约束条件，让它在你画的圈子里跳舞。

**三个原则：**

1. **CLAUDE.md > 向量数据库** — Claude Code 51 万行代码，零向量数据库，grep 打败了 RAG。简洁即力量。写好项目文档比搞什么 RAG 检索有用 10 倍。

2. **工具分工 > 工具选型** — 不是选一个工具干所有事。是让每个工具干最擅长的事。花叔的标准配置：Cursor 做手（写代码），Claude Code 做脑（架构思考），Codex 做腿（跑沙箱里安全操作）。

3. **先做 20 个垃圾出来** — 别纠结技术选型，先跑起来。花叔的经典案例：1.5 小时用 Cursor 做小猫补光灯，冲上 App Store 付费榜第一。不是技术多牛，是快。

## 学习检验

完成本模块学习后，你应该能够：

- [ ] 说出 Cursor、Claude Code、Windsurf、Codex、Kiro、Trae 各自的核心优势
- [ ] 根据预算和场景选择合适的工具组合
- [ ] 配置至少一个 AI 编程工具并投入实际项目
- [ ] 理解 Harness Engineering 的核心思想：给模型造缰绳
- [ ] 用 AI 工具从零搭建一个完整的 Web 应用
- [ ] 掌握"Cursor 做手、Claude Code 做脑、Codex 做腿"的分工策略

---

[← 返回课程目录](/preface) | [继续学习：Cursor 编辑器 →](/agent-ecosystem/06-ai-coding-tools/01-cursor)
