# 快速上手 OpenClaw

> **学习目标**: 完成从安装到运行的完整流程，能够连接消息平台并个性化 Agent
>
> **预计时间**: 30 分钟
>
> **难度等级**: ⭐⭐☆☆☆

---

## 一、安装和配置

### 1.1 环境要求

| 依赖 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | >= 22 | 22 LTS |
| npm / pnpm / bun | 最新稳定版 | pnpm |
| 操作系统 | macOS / Linux / Windows (WSL) | macOS / Linux |

::: warning Node.js 版本
OpenClaw 使用了较新的 JavaScript 特性（如原生 WebSocket、流式 API），Node.js 22 以下版本无法运行[^1]。推荐使用 `nvm` 管理 Node.js 版本：

```bash
nvm install 22
nvm use 22
```
:::

### 1.2 三种安装方式

**方式一：npm 全局安装（最简单）**

```bash
npm install -g @openclaw/cli
openclaw init
```

**方式二：pnpm 全局安装**

```bash
pnpm add -g @openclaw/cli
openclaw init
```

**方式三：bun 安装（性能最优）**

```bash
bun add -g @openclaw/cli
openclaw init
```

`openclaw init` 会创建 `~/.openclaw/` 目录并生成默认配置文件。

### 1.3 配置 LLM

初始化后，编辑 `~/.openclaw/config.yaml`：

```yaml
# 选择你的 LLM 提供商
llm:
  provider: anthropic  # 或 openai / google / ollama
  model: claude-sonnet-4-20250514
  api_key: ${ANTHROPIC_API_KEY}  # 建议用环境变量

# 如果使用本地模型
# llm:
#   provider: ollama
#   model: llama3
#   base_url: http://localhost:11434
```

### 1.4 启动 Gateway

```bash
openclaw start
```

看到以下输出说明启动成功：

```
✓ OpenClaw Gateway 已启动
✓ 端口: 18789
✓ 记忆目录: ~/.openclaw/memory/
✓ 等待 Channel 连接...
```

---

## 二、连接消息平台

### 2.1 以 Telegram 为例

**步骤 1：创建 Telegram Bot**

在 Telegram 中搜索 `@BotFather`，发送 `/newbot`，按提示设置名称。记下返回的 API Token。

**步骤 2：配置 Channel**

编辑 `~/.openclaw/channels/telegram.yaml`：

```yaml
channel: telegram
enabled: true
config:
  bot_token: "你的 Telegram Bot Token"
  allowed_users:
    - "你的 Telegram User ID"  # 限制只有你能使用
```

::: tip 安全建议
一定要设置 `allowed_users`。否则任何人都能通过你的 Bot 与你的 Agent 对话。
:::

**步骤 3：重启 Gateway**

```bash
openclaw restart
```

**步骤 4：验证**

在 Telegram 中找到你的 Bot，发送"你好"。如果收到回复，说明连接成功。

### 2.2 以 WhatsApp 为例

WhatsApp 使用扫描二维码配对，配置更简单：

```bash
openclaw channel add whatsapp
```

终端会显示一个 QR 码，用 WhatsApp 手机端扫描即可。不需要 API Key，不需要注册开发者账号。

```yaml
# 自动生成的配置 ~/.openclaw/channels/whatsapp.yaml
channel: whatsapp
enabled: true
config:
  session_name: "default"
  # WhatsApp 不需要额外配置，扫码即用
```

### 2.3 通道配置一览

| 平台 | 认证方式 | 配置难度 | 备注 |
|------|---------|---------|------|
| Telegram | Bot Token | 简单 | 推荐入门使用 |
| WhatsApp | QR 码扫码 | 简单 | 无需开发者账号 |
| Discord | Bot Token | 中等 | 需在 Discord Developer Portal 创建应用 |
| Slack | OAuth Token | 中等 | 需创建 Slack App |
| 微信 (第三方) | 扫码 | 中等 | 中文社区适配器 |

---

## 三、SOUL.md 个性化

### 3.1 SOUL.md 是什么

SOUL.md 是 OpenClaw 中定义 Agent 身份的文件。用 Markdown 写，告诉你的 Agent 它是谁、应该怎么行事。

可以把它理解为 Agent 的"人设文件"或"工作手册"。

### 3.2 一个完整的 SOUL.md 示例

在 `~/.openclaw/SOUL.md` 中写入以下内容：

```markdown
# 我的 AI 助手

## 身份

你叫小爪，是我的个人 AI 助手。你通过 Telegram 和 WhatsApp 与我交流。

## 性格特点

- 回答简洁，不超过三段
- 善用列表和表格组织信息
- 技术问题用中文回答，代码注释用英文
- 不确定的事情直接说"我不确定"，不要编造

## 工作范围

### 你擅长的
- 技术问题解答（前端、后端、DevOps）
- 代码审查和优化建议
- 文档编写和翻译
- 日程管理和提醒

### 你不擅长的
- 实时股价查询（我没有这个工具）
- 生成图片（能力有限）
- 预测未来事件

## 沟通偏好

- 使用中文交流
- 重要信息用加粗标记
- 给出建议时附上理由
- 发现我可能犯的错误时，主动提醒

## 特殊指令

- 每天早上 9 点提醒我当天日程
- 如果我深夜发消息（23:00-7:00），提醒我注意休息
- 代码相关问题，先给出解决方案，再解释原理
```

### 3.3 SOUL.md 的关键要素

| 要素 | 说明 | 是否必须 |
|------|------|---------|
| 身份定义 | 名字、角色、称呼方式 | 推荐 |
| 性格特点 | 沟通风格、语言偏好 | 推荐 |
| 工作范围 | 擅长/不擅长的领域 | 推荐 |
| 沟通偏好 | 语言、格式、语气 | 可选 |
| 特殊指令 | 定时任务、条件行为 | 可选 |

SOUL.md 没有固定的格式要求，写什么 Agent 就按什么行事。写得越具体，Agent 的表现越符合预期。

---

## 四、基本使用

### 4.1 聊天交互

连接成功后，直接在消息平台中与 Agent 对话：

```
你: 今天天气怎么样？

小爪: 我无法直接查询天气，因为我没有安装天气 Skill。
你可以通过以下方式添加：
1. 运行 `openclaw skill add weather`
2. 或者手动在 ClawHub 搜索天气相关 Skill

需要我帮你安装吗？
```

### 4.2 Memory 查看

Agent 的记忆存储在 `~/.openclaw/memory/` 目录下，可以直接查看：

```bash
ls ~/.openclaw/memory/
# conversations/   # 对话历史
# facts/           # 记住的事实
# tasks/           # 待办任务
# preferences/     # 你的偏好

# 查看某个记忆文件
cat ~/.openclaw/memory/facts/user-preferences.md
```

记忆文件是纯 Markdown，你可以直接编辑。比如删除一条 Agent 记错了的事实。

### 4.3 Heartbeat 任务管理

通过聊天或配置文件管理定时任务：

```
你: 每天早上 9 点提醒我站会

小爪: 好的，已设置每日 9:00 站会提醒。
这条任务会通过 Heartbeat 执行，即使你没有发消息，我也会准时提醒。
```

或者在配置中直接写：

```yaml
# ~/.openclaw/config.yaml
heartbeat:
  enabled: true
  interval: 300  # 检查间隔，秒
```

### 4.4 CLI 命令速查表

| 命令 | 功能 |
|------|------|
| `openclaw start` | 启动 Gateway |
| `openclaw stop` | 停止 Gateway |
| `openclaw restart` | 重启 Gateway |
| `openclaw status` | 查看运行状态 |
| `openclaw channel add <name>` | 添加消息通道 |
| `openclaw channel list` | 列出已配置的通道 |
| `openclaw skill add <name>` | 安装 Skill |
| `openclaw skill list` | 列出已安装的 Skills |
| `openclaw memory list` | 查看记忆文件列表 |
| `openclaw memory show <file>` | 查看指定记忆内容 |
| `openclaw config edit` | 打开配置文件编辑 |
| `openclaw log` | 查看实时日志 |

---

## 思考题

::: info 检验你的理解
1. 为什么建议用环境变量而不是直接在配置文件中写 API Key？
2. `allowed_users` 配置不设置会有什么风险？思考一下攻击者可能利用的方式。
3. SOUL.md 写得越详细越好吗？是否存在过度约束的情况？
4. Heartbeat 的检查间隔设为 300 秒（5 分钟），如果你需要每分钟检查一次，有什么影响？
:::

---

## 本节小结

- 安装只需 Node.js 22 + 一条 npm 命令，`openclaw init` 生成默认配置
- 连接 Telegram 需要 Bot Token，连接 WhatsApp 只需扫 QR 码
- SOUL.md 用 Markdown 定义 Agent 身份，包括性格、工作范围、特殊指令
- 日常使用就是聊天，CLI 用于管理和查看状态

**下一步**: 基本用法掌握后，下一节深入了解 Skills 扩展系统和记忆机制——让你的 Agent 从"能聊天"进化到"能干活"。

---

[← 返回模块首页](/agent-ecosystem/10-openclaw) | [继续学习:Skills 与记忆系统 →](/agent-ecosystem/10-openclaw/04-skills-and-memory)

---

[^1]: OpenClaw 官方文档, "Getting Started". https://docs.openclaw.org/getting-started
[^2]: Telegram Bot API 官方文档. https://core.telegram.org/bots/api
