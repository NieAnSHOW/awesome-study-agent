# 模块九：Agent Skills 系统

> **学习目标**: 掌握 Agent Skills 系统的设计理念和实战方法，能够独立设计和编写生产级 Skill
>
> **预计时间**: 2-3 小时
>
> **难度等级**: ⭐⭐⭐☆☆

::: tip 前置知识
本模块需要以下基础：
- **模块 04** Agent 基础——理解 Agent 架构和工作原理
- **模块 07** MCP 协议——理解工具调用的标准化机制
:::

---

## 模块介绍

模块 07 中我们了解了 Skills 的基本概念。本模块将深度展开 Skills 的设计哲学、技术架构和实战方法。

### Tools vs Skills：一个核心区分

Tools 告诉 Agent **"能做什么"**，Skills 告诉 Agent **"怎么做"**。

用一个厨房的类比：

| 概念 | 厨房类比 | 含义 |
|------|---------|------|
| **Tools** | 灶具、刀铲、烤箱 | Agent 可以调用的函数和 API |
| **Skills** | 菜谱、烹饪技法 | Agent 如何组合使用工具完成任务 |
| **MCP** | 统一的电源插座 | 工具接入 Agent 的标准接口 |

一把菜刀（Tool）谁都会拿，但如何用刀做出一道宫保鸡丁（Skill），需要具体的步骤指导。Skills 就是把这些步骤、经验和策略打包成可复用的模块。

### 本模块的定位

```
Agent 能力栈
┌─────────────────────────┐
│      应用层 (Tasks)      │  用户可见的任务和对话
├─────────────────────────┤
│     策略层 (Skills)      │  ← 本模块聚焦这里
│   如何组织工具完成任务    │
├─────────────────────────┤
│     接口层 (MCP)         │  标准化的工具调用协议
├─────────────────────────┤
│     资源层 (Tools)       │  函数、API、数据源
└─────────────────────────┘
```

Skills 处于策略层，它不定义工具本身，而是定义**如何使用工具组合完成任务**。

---

## 章节列表

### [01 - 什么是 Agent Skills](/agent-ecosystem/09-agent-skills/01-what-are-skills)

Skills 的形式化定义、与 Tools/Plugins/Actions 的区别、以及 Skills 存在的根本原因。用"代码审查 Skill"作为贯穿案例，从具体实例理解抽象概念。

**预计 20 分钟 | 难度 ⭐⭐☆☆☆**

### [02 - Skills 技术架构](/agent-ecosystem/09-agent-skills/02-skill-architecture)

SKILL.md 开放标准的详细规范、渐进式披露机制、标准目录结构，以及 Skill 的完整生命周期。理解这些内容是编写高质量 Skill 的前提。

**预计 25 分钟 | 难度 ⭐⭐⭐☆☆**

### [03 - 主流框架的 Skills 实现](/agent-ecosystem/09-agent-skills/03-skill-frameworks)

Claude Code、CrewAI、LangChain 三大框架的 Skills 实现方案对比。不同框架对 Skills 的理解各有侧重，横向比较有助于形成完整认知。

**预计 30 分钟 | 难度 ⭐⭐⭐☆☆**

### [04 - Skill 设计与实战](/agent-ecosystem/09-agent-skills/04-skill-design)

从设计原则到完整案例，手把手编写一个生产级 Skill。涵盖单一职责、确定性优先、幂等性等核心原则，以及常见陷阱和应对策略。

**预计 35 分钟 | 难度 ⭐⭐⭐☆☆**

### [05 - Skills 生态与安全](/agent-ecosystem/09-agent-skills/05-skill-ecosystem)

开放标准的治理机制、社区市场的发展现状、安全风险与防护策略，以及 Skills 与 MCP 协议的互补关系。理解生态才能更好地参与生态。

**预计 20 分钟 | 难度 ⭐⭐☆☆☆**

---

## 学习检验

完成本模块后，检查你是否掌握以下要点：

- [ ] 能用四元组 S = (C, π, T, R) 描述任意一个 Skill
- [ ] 理解 SKILL.md 标准的渐进式披露机制，能解释为什么需要三个阶段
- [ ] 能独立编写一个符合 SKILL.md 规范的完整 Skill
- [ ] 能说出至少两个框架在 Skills 实现上的核心差异
- [ ] 了解社区 Skills 的安全风险，知道基本的防护措施
- [ ] 理解 Skills 和 MCP 各自解决的问题以及它们的互补关系

---

## 扩展阅读

- [Anthropic Engineering Blog: Skills as an Open Standard](https://www.anthropic.com/engineering/skills-open-standard) — SKILL.md 规范的官方发布说明
- [Agentic AI Foundation: SKILL.md Specification](https://agentic-ai.org/specs/skill-md) — 开放标准的完整规范文档
- [ClawHub Skills Marketplace](https://clawhub.dev/skills) — 社区 Skills 市场，浏览和学习他人作品
- [Awesome Agent Skills](https://github.com/anthropics/awesome-agent-skills) — 精选 Skills 列表和学习资源

---

[← 返回基础教程](/basics/) | [开始学习:什么是 Agent Skills →](/agent-ecosystem/09-agent-skills/01-what-are-skills)
