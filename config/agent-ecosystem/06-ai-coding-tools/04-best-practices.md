# OpenAI Codex 与 Kiro

> **学习目标**：掌握 Codex CLI 的沙箱执行机制和 Amazon Kiro 的规格驱动开发
> **预计时间**：40 分钟
> **难度**：⭐⭐⭐

---

## 一句话结论

Codex CLI 是 OpenAI 的终端编程代理，用 Rust 写的，在沙箱里执行——不是不给 AI 权限，是给它一个安全屋。Amazon Kiro 走了另一条路：先写规格再写代码——不是"AI 帮你写代码"，而是"AI 帮你想清楚要写什么"。两套完全不同的哲学，但都指向同一个方向：**给 AI 编程加上安全网和方向盘。**

## OpenAI Codex CLI

### 是什么

Codex CLI 是 OpenAI 推出的终端编码代理。用 Rust 构建，GitHub 75K+ Stars，完全开源。

**核心卖点：** 每个任务在独立的容器沙箱中运行。代码不会直接修改你的项目，而是先在沙箱里完成，你审查后再合并。

**花叔评价：这不是一个小改进，这是一个安全范式的转变。** Claude Code 和 Cursor 都直接操作你的文件系统，Codex CLI 说"不行，先在沙箱里试，没问题再放出来"。

### 安装

```bash
npm install -g @openai/codex
```

需要 Node.js 18+。

### 认证

```bash
# 设置 OpenAI API Key
export OPENAI_API_KEY="your-key-here"
```

### 基本使用

```bash
# 启动交互模式
codex

# 带问题启动
codex "给这个项目添加 ESLint 配置"

# 指定模型
codex --model o4-mini "优化这个函数的性能"
```

### 沙箱隔离机制

这是 Codex CLI 最重要的特性，值得单独讲清楚。

**传统 AI 工具的执行方式：**
```
AI 工具 → 直接读写你的文件系统
```

**Codex CLI 的执行方式：**
```
AI 工具 → 创建沙箱容器 → 在沙箱里执行 → 展示变更 → 你确认后合并
```

**沙箱提供什么：**
- 文件系统隔离：所有文件操作在沙箱中进行
- 网络隔离：默认不允许网络访问
- 权限最小化：只授予必要的权限
- 会话恢复：中断后可以恢复

**花叔的比喻：** 传统 AI 工具像让装修工人直接进你家，Codex CLI 像让工人在院子里先搭个棚子，做好了再搬进来。

**适合谁：**
- 处理敏感代码的项目
- 对安全性要求高的团队
- 不信任 AI 直接修改代码的开发者
- 金融、医疗等合规性强的行业

::: warning 注意
沙箱有性能开销。启动沙箱需要额外时间，不适合需要快速迭代的场景。安全性和速度之间要取舍。
:::

### 核心功能

**1. 自动文件操作**

Codex CLI 可以读写文件、执行命令、安装依赖——跟 Claude Code 类似，但所有操作在沙箱里。沙箱里的改动不会自动应用到你的项目，需要你手动审查合并。

**2. 会话恢复**

```bash
# 查看历史会话
codex sessions list

# 恢复上次会话
codex sessions resume <id>
```

**3. 多模型支持**

```bash
# 使用不同模型
codex --model gpt-4.1 "复杂重构"
codex --model o4-mini "简单修改"
```

**4. 开源 + 命令行原生**

Codex CLI 完全开源，社区活跃度很高。你可以在 GitHub 上查看源码、提 issue、参与开发。

### 定价

Codex CLI 本身开源免费，消耗 OpenAI API 配额。

| 模型 | 输入价格 | 输出价格 |
|------|---------|---------|
| GPT-4.1 | $2/百万 token | $8/百万 token |
| o4-mini | $1.50/百万 token | $6/百万 token |

按量付费，没有月费。轻度使用每月 $5-15。

### 花叔评价

Codex CLI 是一个"安全第一"的工具。不是最快的，不是功能最多的，但**是最让人放心的**。在接手遗留系统、处理敏感代码、做安全审计的场景，Codex CLI 是最佳选择。日常开发还是用 Cursor 或者 Claude Code。

## Amazon Kiro

### 是什么

Kiro 是 Amazon 推出的 AI IDE。核心思路跟其他 AI IDE 不同——**规格驱动开发（Spec-Driven Development）**。

**其他工具的流程：**
```
描述需求 → AI 直接写代码 → 你审查
```

**Kiro 的流程：**
```
描述需求 → AI 生成规格文档 → 你确认规格 → AI 按规格写代码 → 你审查
```

**花叔解读：先图纸，后施工。** 不是"AI 帮你写代码"，而是"AI 帮你想清楚要写什么代码"。这在大型项目中非常有用——80% 的 bug 都来自需求没想清楚，不是代码写错了。

### Steering Documents

Steering Documents 是 Kiro 的核心概念。它们定义了项目的方向和约束。

**不是 README，是 AI 的施工蓝图。**

**三层结构：**

1. **项目 Steering Documents** — 定义项目级别的规范
2. **功能 Steering Documents** — 定义单个功能的设计
3. **任务 Steering Documents** — 定义具体任务的实现方案

**示例：项目 Steering Document**

```markdown
# 项目规范：电商平台

## 架构决策
- 前端：Next.js + TypeScript
- 后端：Node.js + Express
- 数据库：PostgreSQL + Prisma
- 部署：AWS Lambda + API Gateway

## 编码规范
- 严格 TypeScript，禁止 any
- 函数式组件 + React Hooks
- Tailwind CSS，不用 styled-components
- API 遵循 RESTful 设计

## 安全要求
- 所有 API 必须认证
- 输入验证用 Zod
- SQL 查询用 Prisma（防注入）
```

Kiro 在生成代码前会先读取 Steering Documents，确保输出符合你的规范。**花叔说这就是 Harness Engineering 的终极实践——不是靠模型聪明，是靠约束条件精确。**

### 安装和使用

1. 去 [kiro.dev](https://kiro.dev) 下载
2. 登录 Amazon 账号
3. 打开项目目录
4. 创建 Steering Documents
5. 开始使用

### 核心功能

**1. 规格生成**

描述一个功能需求，Kiro 会先生成详细的功能规格，包括：
- 功能描述
- 数据模型
- API 设计
- 用户交互流程
- 测试计划

**2. 设计审查**

你可以审查 AI 生成的规格，修改不满意的部分，确认后再让它写代码。**不是让 AI 全权代劳，是人机共同设计。**

**3. 自动测试**

Kiro 会根据 Steering Documents 自动生成测试用例，确保代码符合规范。

**4. 持续同步**

代码变更后，Kiro 自动更新相关的 Steering Documents，保持文档和代码一致。文档不再是一锤子买卖。

### 定价

| 版本 | 价格 | 包含 |
|------|------|------|
| Free | $0 | 基础功能，有限 AI 使用 |
| Pro | $19/月 | 完整功能 |

对比 Cursor（$20/月）和 Windsurf（$15/月），价格居中。但 Kiro 的目标用户不同——它更适合需要规范开发流程的团队。

### 花叔评价

Kiro 的规格驱动开发理念很好，但有两个问题：

1. **学习成本高** — Steering Documents 要写好需要投入时间。小微企业可能觉得没必要。
2. **依赖 Amazon 生态** — 跟 AWS 深度绑定，如果你们不用 AWS，体验会打折扣。

但如果你是：
- 3 人以上的技术团队
- 项目需要多人协作
- 对代码质量有严格要求

Kiro 值得一试。

## Codex CLI vs Kiro 对比

| 维度 | Codex CLI | Kiro |
|------|-----------|------|
| **类型** | 终端 CLI | IDE |
| **核心卖点** | 沙箱安全 | 规格驱动 |
| **适合场景** | 安全敏感、遗留系统 | 团队协作、规范化开发 |
| **学习曲线** | 低（命令行） | 中（需要写 Steering Documents） |
| **模型** | OpenAI 系列 | Amazon 自研 + 第三方 |
| **价格** | API 按量 | $0-19/月 |
| **开源** | 是 | 否 |
| **团队协作** | 单人为主 | 团队原生 |

**花叔的建议：**
- 安全性是第一优先级 → Codex CLI
- 团队需要规范化的开发流程 → Kiro
- 两者都可以跟 Cursor/Claude Code 组合使用

## 跟其他工具组合

### Codex CLI + Claude Code

```bash
# Codex CLI 处理安全敏感任务
codex "审计这个模块的安全漏洞"

# Claude Code 处理日常开发
claude "添加新的 API 端点"
```

**分工：** Codex 管安全，Claude Code 管进度。

### Kiro + Cursor

- Kiro 负责设计阶段（生成规格）
- Cursor 负责实现阶段（写代码）
- 两个工具互补，不冲突

## 常见问题

**Q: Codex CLI 的沙箱安全吗？**
A: 相对安全。容器隔离提供了额外的保护层。但没有 100% 的安全，敏感代码还是要谨慎。

**Q: Kiro 的 Steering Documents 值得写吗？**
A: 值得。前期花在规格上的时间，后期在减少 bug 和沟通成本上 10 倍赚回来。花叔原话："写 Steering Documents 的时间不是浪费，是投资。"

**Q: 这两个能替代 Cursor 吗？**
A: 不能完全替代。Codex CLI 是终端工具，Kiro 是设计导向的 IDE。Cursor 在日常编码效率上仍然是首选。

---

## 本节小结

- Codex CLI 的沙箱隔离是 AI 编程工具中最安全的方案——先隔离后合并
- Kiro 的规格驱动开发改变了"直接写代码"的习惯，先想清楚再动手
- Codex CLI 适合安全敏感场景，Kiro 适合团队规范化开发
- 花叔说：Codex = 安全网，Kiro = 方向盘——各有各的用途

---

[← 返回章节目录](/agent-ecosystem/06-ai-coding-tools) | [继续学习：Trae 与国内编程工具 →](/agent-ecosystem/06-ai-coding-tools/05-environment-setup)
