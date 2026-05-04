# Agent Skills 与 OpenClaw 模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 config/basics 新增模块 09（Agent Skills 系统）和模块 10（OpenClaw 开源 AI 助手），共 12 个 Markdown 文件 + 侧边栏配置更新

**Architecture:** 两个独立的 VitePress 文档模块，每个模块包含 1 个 index.md + 5 个子章节 md。内容遵循现有模块 07（Agent 生态）的写作风格：引用块元信息、`::: tip` / `::: info` 容器、代码块、ASCII/Mermaid 图、对比表格、脚注引用、底部导航。

**Tech Stack:** VitePress Markdown、Mermaid 图表

---

## 文件结构

```
config/basics/09-agent-skills/
├── index.md                          # Task 1
├── 01-what-are-skills.md             # Task 2
├── 02-skill-architecture.md          # Task 3
├── 03-skill-frameworks.md            # Task 4
├── 04-skill-design.md                # Task 5
└── 05-skill-ecosystem.md             # Task 6

config/basics/10-openclaw/
├── index.md                          # Task 7
├── 01-openclaw-overview.md           # Task 8
├── 02-architecture.md                # Task 9
├── 03-getting-started.md             # Task 10
├── 04-skills-and-memory.md           # Task 11
└── 05-community-and-future.md        # Task 12

config/.vitepress/config.mts          # Task 13（侧边栏 + 导航栏更新）
```

## 写作规范（所有文件遵循）

### 元信息格式
```markdown
# 页面标题

> **学习目标**: 一句话描述
>
> **预计时间**: X 分钟
>
> **难度等级**: ⭐⭐⭐☆☆
```

### 标题层级
- `## 一、xxx` / `## 二、xxx` — 主要板块（用中文数字）
- `### 1.1 xxx` / `### 1.2 xxx` — 小节（用阿拉伯数字）
- `#### xxx` — 更细粒度

### 必需板块（每个子章节文件）
1. 核心内容（2-4 个 `##` 板块，`---` 分隔）
2. `## 思考题`（用 `::: info 检验你的理解` 容器包裹，3-4 道题）
3. `## 本节小结`（用 `✅` 列出 3-4 个要点）
4. `**下一步**:` 过渡句指向下一节
5. 底部导航链接：`[← 返回模块首页](/basics/09-agent-skills) | [继续学习:下一节标题 →](/basics/09-agent-skills/02-xxx)`
6. 脚注引用（`[^1]`、`[^2]` 等）

### 禁止事项
- 不用"值得注意的是"、"需要指出的是"等套话
- 不用空洞过渡句（"让我们深入探讨"）
- 不用过多 emoji（标题和正文中不用，小结中可用 ✅）
- 不用 AI 生成式语气

### 参考资料
- 现有文件 `config/basics/07-agent-ecosystem/04-skills-system.md` 是模块 09 的前置知识（模块 07 已有 Skills 简介，模块 09 是深度展开）
- 现有文件 `config/basics/07-agent-ecosystem/03-mcp-protocol.md` 是风格参考模板

---

## Task 1: 模块 09 — index.md

**Files:**
- Create: `config/basics/09-agent-skills/index.md`

- [ ] **Step 1: 创建目录和文件**

创建 `config/basics/09-agent-skills/` 目录，写入 `index.md`。

内容要点：
- h1 标题：`# 模块九：Agent Skills 系统`
- 元信息引用块：学习目标、预计时间 2-3 小时、前置知识（模块 04 Agent 基础 + 模块 07 MCP 协议）、难度 ⭐⭐⭐☆☆
- `## 模块介绍`：从 Skills 的核心定位切入——Tools 给 Agent "能做什么"的能力，Skills 给 Agent "怎么做"的程序性知识。类比：厨房里 Tools 是灶具刀铲，Skills 是菜谱。指出模块 07 已有 Skills 概览，本模块是深度展开。
- `## 章节列表`：5 个链接（01 到 05），每项带简短描述
- `## 学习检验`：用 `- [ ]` 复选框列出 5-6 个可验证的学习成果
- `## 扩展阅读`：3-4 个外部链接（Claude Skills 官方文档、CrewAI Skills 文档、LangChain Skills 仓库、Block Engineering Skills 设计原则博文）
- 底部导航：`[← 返回课程目录](/curriculum) | [继续学习：什么是 Agent Skills →](/basics/09-agent-skills/01-what-are-skills)`

- [ ] **Step 2: 验证文件**

用 `cat config/basics/09-agent-skills/index.md | head -5` 确认文件已创建且标题正确。

---

## Task 2: 模块 09 — 01-what-are-skills.md

**Files:**
- Create: `config/basics/09-agent-skills/01-what-are-skills.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# 什么是 Agent Skills`
- 元信息：阅读时间 20 分钟、难度 ⭐⭐☆☆☆
- `## 一、Skills 的定义`：
  - 用简化语言解释四元组 S = (C, π, T, R)：适用条件、执行策略、终止条件、调用接口
  - 用"代码审查 Skill"作为贯穿全文的例子，将四元组映射到具体元素
  - 引用学术论文定义脚注
- `## 二、Skills 与 Tools/Plugins/Actions 的区别`：
  - 表格对比（本质、复杂度、控制权、Token 消耗、是否需要代码、是否修改 Prompt）
  - 三层模型图（ASCII art）：LLM（推理）→ Tools（动作）→ Skills（流程）
  - `::: tip 通俗理解`：Tools 是扳手，Skills 是维修手册
- `## 三、为什么需要 Skills`：
  - LLM 的局限性：知道"能做什么"但不知道"怎么做"
  - 具体场景：Agent 有了文件读写 Tool，但不知道"代码审查"的标准流程
  - Skills 解决程序性知识的封装和复用
- `## 四、Skills 的核心价值`：复用性、可组合性、社区共享、Token 效率（30-50 tokens 元数据）
- `## 思考题`（4 道）
- `## 本节小结`（4 个 ✅ 要点）
- 底部导航 + 脚注

---

## Task 3: 模块 09 — 02-skill-architecture.md

**Files:**
- Create: `config/basics/09-agent-skills/02-skill-architecture.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# Skills 技术架构`
- 元信息：阅读时间 25 分钟、难度 ⭐⭐⭐☆☆
- `## 一、SKILL.md 开放标准`：
  - YAML 前置元数据 + Markdown 指令体格式详解
  - 附一个完整的 SKILL.md 示例（30-50 行，用 yaml 代码块）
  - 前置元数据字段说明：name、description、allowed-tools、disallowedTools、effort、maxTurns、model
  - 脚注引用 Anthropic 2025 年 12 月发布开放标准
- `## 二、渐进式披露机制`：
  - 三阶段 ASCII art 图：发现（30-50 tokens 元数据）→ 激活（完整 SKILL.md）→ 执行（scripts/references）
  - 解释为什么这样设计：控制上下文窗口消耗
  - 用 `::: info` 容器说明 Token 成本对比（传统方式 vs 渐进式披露）
- `## 三、标准目录结构`：
  - 用 `tree` 格式展示目录结构（SKILL.md、scripts/、references/、assets/）
  - 每个文件/目录的作用说明
- `## 四、Skill 生命周期`：
  - 流程图（ASCII art）：注册 → 发现 → 匹配 → 激活 → 执行 → 卸载
  - 版本管理（语义化版本）
  - 动态加载/卸载优化资源使用
- 思考题 + 小结 + 导航 + 脚注

---

## Task 4: 模块 09 — 03-skill-frameworks.md

**Files:**
- Create: `config/basics/09-agent-skills/03-skill-frameworks.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# 主流框架的 Skills 实现`
- 元信息：阅读时间 30 分钟、难度 ⭐⭐⭐☆☆
- `## 一、Claude Code Skills`：
  - Anthropic 的实现方式
  - 目录结构和加载机制
  - 示例：一个 Claude Code Skill 的 SKILL.md 文件
  - 特色：运行时内置、`allowed-tools` 白名单/黑名单机制
- `## 二、CrewAI Skills`：
  - 五维能力体系图（ASCII art 或表格）：Tools / MCPs / Apps / Skills / Knowledge
  - Skills = 注入指令和上下文，告诉 Agent"怎么思考"
  - Tools = 提供可调用函数，让 Agent"采取行动"
  - 配置示例（yaml 代码块）
- `## 三、LangChain Skills`：
  - Deep Agents 的 Skills 支持
  - Match → Read → Execute 三步流程
  - langchain-ai/langchain-skills 开源仓库（11 个官方 Skills）
- `## 四、跨框架对比`：
  - 大对比表格：文件格式、发现机制、执行模型、生态规模、特色功能
  - 共同点：SKILL.md 标准、渐进式披露
  - 差异点：Claude Code 运行时内置、CrewAI 框架级集成、LangChain 库级支持
- 思考题 + 小结 + 导航 + 脚注

---

## Task 5: 模块 09 — 04-skill-design.md

**Files:**
- Create: `config/basics/09-agent-skills/04-skill-design.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# Skill 设计与实战`
- 元信息：阅读时间 35 分钟、难度 ⭐⭐⭐☆☆
- `## 一、设计原则`：
  - 单一职责（附好/坏对比示例）
  - 确定性优先（明确输入/输出、最小歧义）
  - 幂等性（运行两次产生相同结果）
  - 明确约束（护栏、验证步骤、输出约束）
- `## 二、编写 SKILL.md 实战`：
  - 以"代码审查 Skill"为完整案例，从零编写
  - Step 1-5 的逐步展示：
    1. 确定适用条件（什么样的 PR 该用这个 Skill）
    2. 编写 description（语义匹配的关键）
    3. 编写执行策略（Markdown 指令体，审查清单）
    4. 定义终止条件和输出格式
    5. 添加护栏（安全检查、大小限制）
  - 附完整的 SKILL.md 文件（50-80 行，放在 yaml 代码块中）
- `## 三、最佳实践`：
  - 控制 SKILL.md 在 500 行以内
  - description 是最关键字段——Agent 用它做语义匹配
  - 详细文档放 references/ 目录
  - 保持浅层委托：控制面板而非百科全书
- `## 四、常见陷阱`：
  - 过于宽泛的 Skill（"分析数据" vs "验证 BigQuery 分区策略"）
  - 缺乏护栏和验证
  - 忽视测试
  - SKILL.md 过长
- 思考题 + 小结 + 导航 + 脚注

---

## Task 6: 模块 09 — 05-skill-ecosystem.md

**Files:**
- Create: `config/basics/09-agent-skills/05-skill-ecosystem.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# Skills 生态与安全`
- 元信息：阅读时间 20 分钟、难度 ⭐⭐☆☆☆
- `## 一、开放标准与治理`：
  - Anthropic / OpenAI / Google 在 Linux 基金会下的 Agentic AI Foundation
  - 30+ 工具支持列表（Claude Code、Codex CLI、Gemini CLI、GitHub Copilot、Cursor、Windsurf 等）
  - 标准化意义：一份 SKILL.md，多平台通用
  - 脚注引用 Agentic AI Foundation 公告
- `## 二、社区市场`：
  - ClawHub：1700+ 预配置 Skills
  - 安装方式（命令行安装示例）
  - Skills 分类（代码、数据、DevOps、文档等）
- `## 三、安全考量`：
  - `::: danger 安全警告`：12-20% 的公开 Skills 被发现是恶意的
  - 安全审查流程：权限控制、输入验证、审计追踪
  - 最佳实践：白名单 Skills、沙箱执行、定期安全扫描
  - 引用安全审计报告脚注
- `## 四、Skills 与 MCP 的互补关系`：
  - MCP 连接外部工具和数据（"能做什么"）
  - Skills 封装程序性知识（"怎么做"）
  - 两者协作的架构图（ASCII art）
- 思考题 + 小结 + 导航 + 脚注

- [ ] **Step 2: 提交模块 09**

```bash
git add config/basics/09-agent-skills/
git commit -m "$(cat <<'EOF'
docs: 新增模块九 Agent Skills 系统

包含 Skills 概念定义、SKILL.md 开放标准架构、主流框架实现对比、
Skill 设计实战和生态安全五个子章节。
EOF
)"
```

---

## Task 7: 模块 10 — index.md

**Files:**
- Create: `config/basics/10-openclaw/index.md`

- [ ] **Step 1: 创建目录和文件**

创建 `config/basics/10-openclaw/` 目录，写入 `index.md`。

内容要点：
- h1：`# 模块十：OpenClaw 开源 AI 助手`
- 元信息：学习目标（了解 OpenClaw 定位和架构、掌握安装使用、理解自托管 Agent 设计理念）、预计时间 2-3 小时、前置知识（模块 04 Agent 基础 + 模块 09 Skills）、难度 ⭐⭐☆☆☆
- `## 模块介绍`：OpenClaw 是"有记录以来增长最快的开源项目"——60 天 25 万 GitHub Stars。不是开发框架，是开箱即用的 Agent 运行时。类比：LangChain 是"造车工具箱"，OpenClaw 是"已经造好的车"，写个 SOUL.md 就能开走。
- `## 章节列表`：5 个链接
- `## 学习检验`：5-6 个复选框
- `## 扩展阅读`：3-4 个链接（OpenClaw 官网、GitHub 仓库、ClawDocs、Peter Steinberger 博客）
- 底部导航

---

## Task 8: 模块 10 — 01-openclaw-overview.md

**Files:**
- Create: `config/basics/10-openclaw/01-openclaw-overview.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# OpenClaw 概览`
- 元信息：阅读时间 20 分钟、难度 ⭐☆☆☆☆
- `## 一、OpenClaw 是什么`：
  - 免费、开源（MIT）、自托管的个人 AI 助手
  - 通过 WhatsApp / Telegram / Discord / Slack 等聊天应用交互
  - 不是开发框架，是开箱即用的运行时
  - `::: tip 通俗理解`：把 OpenClaw 想象成一个住在你电脑里的私人助理，你用微信/Telegram/Slack 就能指挥它干活
- `## 二、核心特征`：
  - 四大特征用表格或列表：自主运行（Heartbeat）、自托管（数据本地）、多通道（50+ 平台）、模型无关（Claude/GPT/本地模型）
  - 每个特征附带一句话解释为什么重要
- `## 三、与传统 AI 助手的区别`：
  - 对比表格：维度包括响应方式、托管位置、数据控制、扩展方式、成本
  - vs ChatGPT Agent：自托管 vs 云端
  - vs LangChain：运行时 vs 框架
- `## 四、发展背景`：
  - Peter Steinberger 创建（PSPDFKit 创始人，九位数退出）
  - 时间线表格：2025.11 创建 → 2025.12 更名 → 2026.01-02 25 万 Stars → 2026.02 创始人加入 OpenAI → 转基金会
  - 社区规模数据（GitHub Stars、Forks）
- 思考题 + 小结 + 导航 + 脚注

---

## Task 9: 模块 10 — 02-architecture.md

**Files:**
- Create: `config/basics/10-openclaw/02-architecture.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# OpenClaw 架构`
- 元信息：阅读时间 25 分钟、难度 ⭐⭐⭐☆☆
- `## 一、Gateway 中心架构`：
  - WebSocket 服务器（端口 18789），单进程守护
  - ASCII art 架构图：Gateway 居中，连接 Brain/Hands/Memory/Heartbeat/Channels/Skills
  - 单进程设计的好处：简洁、可靠、易调试
- `## 二、六大核心组件`：
  - 表格：组件名 | 角色 | 说明
  - Brain（推理引擎）：LLM API 调用
  - Hands（执行环境）：Shell、文件系统、浏览器自动化
  - Memory（持久化）：本地 Markdown 文件
  - Heartbeat（自主调度）：定期任务检查器
  - Channels（I/O 桥接）：消息平台适配器
  - Skills（扩展）：YAML + Markdown 技能定义
- `## 三、数据流全景`：
  - Mermaid sequenceDiagram：输入 → Router → Brain → Hands → Memory → 响应
  - Heartbeat 触发流程详解：检查 HEARTBEAT.md → 评估 → 执行或 HEARTBEAT_OK
  - 用实际例子走一遍流程："用户发 Telegram 消息让 Agent 整理邮件"
- `## 四、设计理念`：
  - 四条理念，每条附一句话解释：
    - 单进程：简洁可靠
    - 本地优先：除 LLM API 外无云依赖
    - 模型无关：改配置即可切换
    - 透明可读：Memory 是 Markdown，配置是 YAML
- 思考题 + 小结 + 导航 + 脚注

---

## Task 10: 模块 10 — 03-getting-started.md

**Files:**
- Create: `config/basics/10-openclaw/03-getting-started.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# 快速上手 OpenClaw`
- 元信息：阅读时间 30 分钟、难度 ⭐⭐☆☆☆
- `## 一、安装和配置`：
  - 环境要求：Node.js >= 22
  - 安装命令（bash 代码块）：npm/pnpm/bun 三种方式
  - Gateway 启动命令
  - 配置文件位置和基本结构
- `## 二、连接消息平台`：
  - 以 Telegram 为例（步骤式：创建 Bot → 获取 Token → 配置通道 → 重启 Gateway）
  - 以 WhatsApp 为例（扫码配对流程）
  - 通道配置 yaml 示例
  - `::: tip`：推荐先从 Telegram 开始，配置最简单
- `## 三、SOUL.md 个性化`：
  - 用 Markdown 定义 Agent 身份和个性
  - 附一个实际 SOUL.md 示例（20-30 行，用 markdown 代码块展示）
  - 个性化技巧：角色定义、语气偏好、工作习惯
- `## 四、基本使用`：
  - 通过聊天平台发送指令的示例对话
  - 查看 Memory 中的记录
  - Heartbeat 任务管理：HEARTBEAT.md 的编写
  - CLI 命令速查表
- 思考题 + 小结 + 导航 + 脚注

---

## Task 11: 模块 10 — 04-skills-and-memory.md

**Files:**
- Create: `config/basics/10-openclaw/04-skills-and-memory.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# Skills 与记忆系统`
- 元信息：阅读时间 25 分钟、难度 ⭐⭐☆☆☆
- `## 一、Skills 扩展系统`：
  - OpenClaw 采用 SKILL.md 标准（衔接模块 09 知识）
  - 安装 ClawHub Skills 的命令
  - OpenClaw Skills 与 Claude Code Skills 的区别：运行时级别 vs 开发工具级别
  - 自定义 Skill 示例
- `## 二、持久记忆系统`：
  - 存储位置：`~/.openclaw/memory/`
  - 目录结构展示
  - 四类记忆内容：偏好、联系人、项目、学习
  - Memory 的读写机制（Brain 自动管理）
  - `::: tip`：为什么用 Markdown 而不是数据库——人类可读、Git 可追踪、直接编辑
- `## 三、多 Agent 路由`：
  - 将不同通道/账户路由到隔离的 Agent
  - 配置示例（yaml）
  - 实际案例：Discord 驱动 Agent 集群
- `## 四、高级特性`：
  - Live Canvas：Agent 驱动的可视化工作区（A2UI）
  - 语音唤醒：macOS/iOS 唤醒词，Android 连续语音
  - 伴侣应用：macOS 菜单栏 + iOS/Android 应用
- 思考题 + 小结 + 导航 + 脚注

---

## Task 12: 模块 10 — 05-community-and-future.md

**Files:**
- Create: `config/basics/10-openclaw/05-community-and-future.md`

- [ ] **Step 1: 写入文件**

内容要点：
- h1：`# 社区生态与展望`
- 元信息：阅读时间 20 分钟、难度 ⭐☆☆☆☆
- `## 一、社区生态`：
  - ClawHub：1700+ 预配置 Skills
  - 中文社区版：内置钉钉、企业微信、飞书、QQ、微信
  - 第三方教程和文档站
  - GitHub 仓库数据（Stars、Forks、Issues）
- `## 二、与其他框架对比`：
  - 大对比表格（6 列）：OpenClaw vs LangChain vs CrewAI vs ChatGPT Agent
  - 维度：类型、用户画像、配置方式、托管方式、自主性、通道支持、开源、成本
  - 每个框架的适用场景一句话总结
- `## 三、安全考量`：
  - `::: danger`：12-20% ClawHub Skills 被发现是恶意的
  - 安全措施：沙箱、VirusTotal 扫描、代码安全扫描器
  - 本地数据安全：数据在你手上，但也要你负责
- `## 四、适用场景与局限`：
  - 适合场景：个人助手、工作自动化、开发者工具（附具体用例）
  - 不适合场景：企业关键任务（无 SLA）、高并发
  - 成本：典型月费 $12-35（主机 + API），软件免费
  - 项目节奏：每 2 周可能破坏性变更
- 思考题 + 小结 + 导航 + 脚注

- [ ] **Step 2: 提交模块 10**

```bash
git add config/basics/10-openclaw/
git commit -m "$(cat <<'EOF'
docs: 新增模块十 OpenClaw 开源 AI 助手

包含 OpenClaw 概览、架构、快速上手、Skills 与记忆系统、
社区生态与展望五个子章节。
EOF
)"
```

---

## Task 13: 更新侧边栏和导航栏配置

**Files:**
- Modify: `config/.vitepress/config.mts`（在模块八之后、模块十二之前插入两个新模块的侧边栏配置；在导航栏中添加两个新模块链接）

- [ ] **Step 1: 添加侧边栏配置**

在 `config/.vitepress/config.mts` 中，找到模块八（模块八：模型训练与优化）的配置块（约第 198-210 行），在其 `]` 结束后、紧接的 `]` 之前，插入模块九和模块十的侧边栏配置：

```typescript
              {
                text: '模块九：Agent Skills 系统',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '09-agent-skills/' },
                  { text: '什么是 Agent Skills', link: '09-agent-skills/01-what-are-skills' },
                  { text: 'Skills 技术架构', link: '09-agent-skills/02-skill-architecture' },
                  { text: '主流框架的 Skills 实现', link: '09-agent-skills/03-skill-frameworks' },
                  { text: 'Skill 设计与实战', link: '09-agent-skills/04-skill-design' },
                  { text: 'Skills 生态与安全', link: '09-agent-skills/05-skill-ecosystem' },
                ]
              },
              {
                text: '模块十：OpenClaw 开源 AI 助手',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '10-openclaw/' },
                  { text: 'OpenClaw 概览', link: '10-openclaw/01-openclaw-overview' },
                  { text: 'OpenClaw 架构', link: '10-openclaw/02-architecture' },
                  { text: '快速上手', link: '10-openclaw/03-getting-started' },
                  { text: 'Skills 与记忆系统', link: '10-openclaw/04-skills-and-memory' },
                  { text: '社区生态与展望', link: '10-openclaw/05-community-and-future' },
                ]
              },
```

具体位置：在第 210 行 `}` （模块八的结束花括号）之后、第 211 行 `]` 之前插入。

- [ ] **Step 2: 更新导航栏**

在 `nav` 配置中，找到 `基础型路径` 下拉菜单（约第 56-67 行），在 `{ text: '模型训练', link: '/basics/08-model-training/' }` 之后、`{ text: 'AI 视频生成', link: '/basics/12-ai-video-generation/' }` 之前，添加两行：

```typescript
          { text: 'Agent Skills', link: '/basics/09-agent-skills/' },
          { text: 'OpenClaw', link: '/basics/10-openclaw/' },
```

- [ ] **Step 3: 验证配置**

运行 `pnpm run docs:dev`，在浏览器中确认：
1. 顶部导航栏出现 Agent Skills 和 OpenClaw 链接
2. 侧边栏出现模块九和模块十（默认折叠）
3. 点击各链接能正确跳转

- [ ] **Step 4: 提交配置变更**

```bash
git add config/.vitepress/config.mts
git commit -m "$(cat <<'EOF'
chore: 更新侧边栏和导航栏配置，添加模块九和模块十
EOF
)"
```

---

## 自检清单

- [ ] 模块 09 的 6 个文件全部创建且内容完整
- [ ] 模块 10 的 6 个文件全部创建且内容完整
- [ ] 侧边栏配置正确，两个新模块出现在模块八之后
- [ ] 导航栏配置正确，新模块链接可点击
- [ ] 所有文件的底部导航链接正确（前一页/后一页）
- [ ] 所有文件的脚注引用有效
- [ ] 内容风格与现有模块（特别是 07-agent-ecosystem）一致
- [ ] 无 AI 生成式套话
