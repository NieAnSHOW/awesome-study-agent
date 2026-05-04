# Skills 与记忆系统

> **学习目标**: 掌握 OpenClaw 的 Skills 扩展机制和持久记忆系统，了解多 Agent 路由和高级特性
>
> **预计时间**: 25 分钟
>
> **难度等级**: ⭐⭐☆☆☆

---

## 一、Skills 扩展系统

### 1.1 从模块 09 继续讲

模块 09 详细介绍了 SKILL.md 开放标准[^1]。OpenClaw 是 SKILL.md 标准的主要践行者之一——它通过加载 SKILL.md 文件来给 Agent 添加新能力。

快速回顾 SKILL.md 的核心结构：

```
SKILL.md（四元组 S = (C, π, T, R)）
├── C — Context：适用场景和上下文约束
├── π — Policy：执行策略和工作流程
├── T — Tools：依赖的工具列表
└── R — Result：输出规范和格式要求
```

### 1.2 安装 ClawHub Skills

ClawHub 是 OpenClaw 的社区 Skills 市场。安装一个 Skill 只需一条命令：

```bash
# 搜索 Skills
openclaw skill search weather

# 安装
openclaw skill add @community/weather

# 查看已安装
openclaw skill list
# 已安装的 Skills：
# ✅ @community/weather     v1.2.0  天气查询
# ✅ @community/news        v0.9.1  新闻摘要
# ✅ @community/translator  v2.0.0  多语言翻译
```

安装后，Skill 的 SKILL.md 文件会放在 `~/.openclaw/skills/` 目录下。你可以直接打开查看它做了什么。

### 1.3 OpenClaw Skills vs Claude Code Skills

两者都遵循 SKILL.md 标准，但定位不同：

| 维度 | Claude Code Skills | OpenClaw Skills |
|------|-------------------|-----------------|
| 运行环境 | IDE 终端 | 聊天应用 |
| 交互方式 | 命令行 | 自然语言对话 |
| 工具范围 | 文件系统、Git、终端 | 消息平台、Web、API |
| 典型场景 | 代码重构、调试、测试 | 信息查询、任务管理、自动化 |
| 用户群体 | 开发者 | 所有人 |

一个 Skill 可以同时兼容两个平台——只要它的工具依赖在两个平台上都可用。比如"翻译 Skill"在 Claude Code 和 OpenClaw 中都能工作，因为翻译本身不依赖特定环境。

### 1.4 编写自己的 Skill

创建目录和 SKILL.md：

```bash
mkdir -p ~/.openclaw/skills/my-daily-report
```

```markdown
<!-- ~/.openclaw/skills/my-daily-report/SKILL.md -->
---
name: daily-report
version: 1.0.0
description: "生成每日工作总结"
author: me
tools:
  - read_file  # 读取日志文件
  - web_fetch   # 获取外部数据
---

# 每日工作总结 Skill

## 适用场景 (C)

当用户说"生成今天的报告"或每天晚上 10 点自动触发时使用。

## 执行策略 (π)

1. 读取当天对话记录，提取关键任务
2. 检查记忆中的待办列表，标记完成状态
3. 如果有未完成任务，列出并说明原因
4. 汇总成 Markdown 格式的日报

## 工具依赖 (T)

- `read_file`：读取记忆和日志文件
- `web_fetch`：可选，获取外部数据源

## 输出规范 (R)

格式：

## 日报 - {日期}

### 已完成
- 任务1 ✅
- 任务2 ✅

### 未完成
- 任务3 ❌ (原因)

### 明日计划
- 建议任务
```

---

## 二、持久记忆系统

### 2.1 存储位置

所有记忆文件存储在 `~/.openclaw/memory/` 目录下：

```
~/.openclaw/memory/
├── conversations/          # 对话历史
│   ├── 2026-03-15.md
│   └── 2026-03-16.md
├── facts/                  # 记住的事实
│   ├── user-profile.md     # 用户基本信息
│   └── preferences.md      # 偏好设置
├── tasks/                  # 任务管理
│   ├── active.md           # 进行中的任务
│   └── completed.md        # 已完成的任务
└── summaries/              # 总结和摘要
    └── weekly-2026-03-3.md
```

### 2.2 四类记忆

| 类型 | 内容 | 示例 |
|------|------|------|
| **对话记忆** | 历史聊天记录 | "上周二你问过我关于 React 的问题" |
| **事实记忆** | 用户相关信息 | "用户是前端工程师，主要用 TypeScript" |
| **任务记忆** | 待办和完成的任务 | "用户要求每天早上发新闻摘要" |
| **总结记忆** | 周期性总结 | "本周完成了三个项目重构" |

### 2.3 Memory 读写机制

Agent 在每次交互时都会进行记忆的读写：

**读取（每轮对话开始时）：**

1. 读取最近 7 天的对话摘要
2. 读取与当前话题相关的事实
3. 读取活跃任务列表
4. 将以上信息注入 Prompt 上下文

**写入（每轮对话结束时）：**

1. 将本轮对话追加到当日对话文件
2. 如果发现新的用户信息，更新事实记忆
3. 如果涉及任务变更，更新任务记忆

::: tip 为什么用 Markdown 而不是数据库
1. **可读性**：你可以直接用文本编辑器查看和修改 Agent 的记忆
2. **可调试**：出问题时打开文件就能看到 Agent 记住了什么、记错了什么
3. **可移植**：Markdown 是通用格式，换工具时记忆可以带走
4. **版本控制**：可以用 Git 管理记忆文件，追踪变化历史
:::

### 2.4 手动管理记忆

你可以直接编辑记忆文件来纠正 Agent 的理解：

```bash
# 查看所有事实记忆
cat ~/.openclaw/memory/facts/user-profile.md

# 输出可能像这样：
# # 用户档案
# - 名字：小明
# - 职业：前端工程师
# - 主要语言：TypeScript / Python
# - 偏好：简洁回答，中文交流

# 直接编辑，修正错误信息
vim ~/.openclaw/memory/facts/user-profile.md
```

也可以通过对话让 Agent 修改：

```
你: 记住，我改用 Go 了，不用 Python

小爪: 好的，已更新。你的主要编程语言现在是 TypeScript 和 Go。
```

---

## 三、多 Agent 路由

### 3.1 为什么需要多 Agent

你可能希望不同的消息平台连接不同的 Agent：

- Telegram 上的 Agent 是你的工作助手，严肃专业
- Discord 上的 Agent 是你的娱乐伙伴，轻松幽默
- WhatsApp 上连接家庭群，负责日程提醒

OpenClaw 支持将不同通道路由到隔离的 Agent 实例。

### 3.2 配置示例

```yaml
# ~/.openclaw/config.yaml
agents:
  work-agent:
    soul: ~/.openclaw/souls/work-soul.md
    memory: ~/.openclaw/memory/work/
    skills:
      - code-review
      - meeting-notes
      - jira-helper

  fun-agent:
    soul: ~/.openclaw/souls/fun-soul.md
    memory: ~/.openclaw/memory/fun/
    skills:
      - trivia
      - game-recommender

routing:
  telegram: work-agent
  discord: fun-agent
  whatsapp: work-agent
```

### 3.3 隔离机制

不同 Agent 之间的记忆是完全隔离的：

```
work-agent 的记忆          fun-agent 的记忆
├── conversations/         ├── conversations/
├── facts/                 ├── facts/
│   └── "用户是前端工程师"     │   └── "用户喜欢策略游戏"
├── tasks/                 ├── tasks/
│   └── "周五代码审查"        │   └── "周末玩游戏"
```

你在 Telegram 上告诉 Agent 的工作秘密，Discord 上的 Agent 完全不知道。

---

## 四、高级特性

### 4.1 Live Canvas（A2UI）

Live Canvas 是 OpenClaw 的一个实验性特性，允许 Agent 生成实时的 Web 界面。

当你问 Agent"帮我做一个投票页面"时，它不只是回复文字描述，而是直接生成一个可以在浏览器中交互的页面。这背后是 A2UI（AI to UI）协议——Agent 将 UI 描述发送给前端渲染器。

当前状态：实验性，需要手动启用：

```yaml
# ~/.openclaw/config.yaml
features:
  live_canvas:
    enabled: true
    port: 18790  # Canvas 渲染服务端口
```

### 4.2 语音唤醒

OpenClaw 支持语音输入（通过消息平台的语音消息功能）：

1. 用户发送语音消息
2. Channel 将语音转写为文字（使用 Whisper 或平台自带的语音转文字）
3. Agent 处理文字内容
4. 回复可以是文字或语音（TTS）

### 4.3 伴侣应用

OpenClaw 提供了手机伴侣 App（iOS / Android），用于：

- 查看和管理 Gateway 运行状态
- 快速编辑 SOUL.md 和 Skills
- 查看记忆文件
- 接收通知

伴侣 App 不是必须的——所有功能都可以通过 CLI 和消息平台完成。

---

## 思考题

::: info 检验你的理解
1. OpenClaw Skills 和 Claude Code Skills 都遵循 SKILL.md 标准，但它们的工具依赖为什么不同？
2. Agent 的记忆存在文件系统中，如果文件被意外删除会怎样？有什么恢复方案？
3. 多 Agent 路由中，两个 Agent 能否共享部分记忆？思考一下如何实现。
4. Live Canvas 特性中，Agent 生成的 UI 存在哪些安全风险？
:::

---

## 本节小结

- OpenClaw Skills 遵循 SKILL.md 标准，通过 ClawHub 市场安装或自己编写
- 四类记忆（对话、事实、任务、总结）存储在 `~/.openclaw/memory/` 下，Markdown 格式可直接编辑
- 多 Agent 路由允许不同通道连接不同 Agent，记忆完全隔离
- 高级特性包括 Live Canvas（A2UI）、语音唤醒和伴侣应用

**下一步**: 掌握了使用方法后，最后一节看看社区生态——ClawHub 有什么好用的 Skill、安全风险有哪些，以及 OpenClaw 和其他方案的全面对比。

---

[← 返回模块首页](/agent-ecosystem/10-openclaw) | [继续学习:社区生态与展望 →](/agent-ecosystem/10-openclaw/05-community-and-future)

---

[^1]: Anthropic Engineering Blog, "Introducing Claude Agent Skills as an Open Standard", December 2025. https://www.anthropic.com/engineering/skills-open-standard
[^2]: OpenClaw 官方文档, "Skills & Memory". https://docs.openclaw.org/skills-and-memory
