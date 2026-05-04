# Hermes Agent 实战部署

> **学习目标**: 掌握 Hermes Agent 的多种部署方式和技能创建方法
>
> **预计时间**: 60 分钟
>
> **难度等级**: ⭐⭐⭐☆☆
>
> **更新时间**: 2026年5月

---

## 部署方式概览

### 六种终端后端

Hermes Agent 支持 **六种终端后端**，用于执行 Agent 的实际操作（运行命令、读写文件等）。不同的后端对应不同的使用场景：

| 后端 | 适用场景 | 资源要求 | 持久性 | 成本 |
|------|---------|---------|--------|------|
| **Local** | 本地开发测试 | 需 Python 环境 | 持久运行需保持终端 | 零成本 |
| **Docker** | 环境隔离、快速部署 | Docker Engine | 容器重启配置 | 零成本 |
| **SSH** | 远程服务器管理 | 可访问的远程机器 | 取决于远程服务 | VPS 费用 |
| **Daytona** | 开发环境即服务 | Daytona 账号 | 闲置时休眠 | 按需付费 |
| **Singularity** | 高性能计算/科研 | Singularity CE | 任务级持久 | 取决于集群 |
| **Modal** | Serverless 云部署 | Modal 账号 | 闲置时休眠，接近零成本 | 按需付费，闲置接近零 |

### 选型建议

**个人开发者（本地学习/实验）**：
- 推荐 **Local** 或 **Docker**。零额外成本，上手最快。
- 如果有多设备远程使用需求，搭配 SSH 后端。

**团队部署（24/7 在线）**：
- 推荐 **Docker + VPS**。docker-compose 一行命令启动，数据持久化在挂载卷中。
- 如果需要多成员接入同一 Agent，通过 Gateway 的消息平台（Telegram / Slack）实现共享。

**研究和实验（间歇使用）**：
- 推荐 **Modal** 或 **Daytona**。闲置时自动休眠，不产生成本，需要使用时秒级唤醒。

---

## 快速上手：Docker 部署

Docker 部署是最快、最一致的安装方式，适用于 macOS、Linux 和 Windows（WSL2）。

### 环境要求

- Docker Engine 20.10+
- 2 GB 可用内存
- 至少 5 GB 磁盘空间（用于镜像和持久数据）

### 数据持久化

在启动容器之前，创建一个本地目录用于持久化 Agent 的配置、记忆和技能：

```bash
mkdir -p ~/.hermes
```

这个目录存储了 Agent 的所有数据——API Key、会话、技能、记忆。**如果不挂载这个卷，容器重启后所有数据都会丢失。**

### 首次设置

运行交互式设置向导：

```bash
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent setup
```

向导会引导你完成以下步骤：

1. **选择 LLM 提供商**：OpenRouter、Anthropic、OpenAI、Nous Portal、Ollama 或自定义端点
2. **输入 API Key**：密钥保存在 `~/.hermes/.env` 中
3. **选择模型**：根据提供商列出可用模型
4. **连接消息平台**（可选）：Telegram、Discord、Slack 等

配置完成后，非敏感配置保存在 `~/.hermes/config.yaml` 中，API Key 等敏感信息保存在 `~/.hermes/.env` 中。

### 启动 Gateway

设置完成后，在后台启动消息网关：

```bash
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

启动后即可在终端与 Agent 交互，或通过已配置的消息平台发送消息。

### (可选) 启动 Web Dashboard

Hermes Agent 提供了一个 Web Dashboard，通过 9119 端口访问，用于查看系统状态、技能列表和会话日志：

```bash
docker run -d \
  --name hermes-dashboard \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  -p 9119:9119 \
  nousresearch/hermes-agent dashboard
```

### 验证部署

在终端中运行 `hermes`，如果看到欢迎横幅（显示模型、可用工具和已加载的技能列表），说明部署成功。

可以使用以下命令测试一个简单的工具调用：

```
What's in my current directory?
```

输入 `/exit` 退出交互模式。

### 更新镜像

当有新版本发布时，拉取最新镜像并替换容器——所有数据保留在挂载卷中：

```bash
docker pull nousresearch/hermes-agent:latest
docker rm -f hermes
# 重新运行上面的 gateway 启动命令
```

---

## VPS 部署实战

如果你需要 Agent 24/7 在线运行（例如定时任务、多平台消息响应），VPS 部署是更可靠的选择。

### 环境要求

- Linux VPS（建议 Ubuntu 22.04+）
- 至少 2 vCPU、2 GB RAM（运行基本服务）
- 建议 4 GB RAM 以上（运行 Gateway 加浏览器工具）
- root 或 sudo 权限

### 安装

首先更新系统并安装 Git：

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git -y
```

然后运行官方一键安装脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

这个脚本会克隆 Hermes Agent 仓库、设置 Python 虚拟环境、安装依赖，并注册全局 `hermes` 命令。

安装完成后，重新加载 Shell 配置：

```bash
source ~/.bashrc   # 或 source ~/.zshrc
```

### 初始配置

运行 `hermes setup` 完成初始配置，包括选择 LLM 提供商、输入 API Key 和连接消息平台。

API Key 存储在 `~/.hermes/.env` 中，配置存储在 `~/.hermes/config.yaml` 中。

### 作为系统服务运行

为实现持久运行，需要将 Gateway 注册为 **systemd 服务**，确保服务器重启后自动恢复：

```bash
sudo hermes gateway install --system
sudo hermes gateway start --system
```

查看运行状态：

```bash
sudo hermes gateway status --system
```

查看实时日志：

```bash
journalctl -u hermes-gateway -f
```

如果不用 `--system` 标志，Gateway 会安装为用户级服务，但在无交互的 headless 环境中可靠性较低。

::: warning 注意
**Cron 任务只在 Gateway 运行时生效。** 如果定时任务没有按时执行，首先检查 Gateway 是否在运行。
:::

### 生产环境安全建议

| 项目 | 建议 |
|------|------|
| **SSH 安全** | 使用密钥登录，禁用密码登录；设置 `PermitRootLogin no` |
| **防火墙** | 使用 ufw 仅开放需要端口（通常只有 SSH 22） |
| **API Key 管理** | 切勿在提示词或日志中泄露 Key，定期轮换 |
| **日志监控** | 定期查看 `journalctl -u hermes-gateway -f` 检查异常行为 |
| **数据备份** | 定期备份 `~/.hermes` 目录（含记忆、技能、Cron 任务配置） |
| **系统更新** | 保持系统和 Docker 镜像更新 |

### VPS 规格参考

| 使用场景 | 建议配置 |
|---------|---------|
| 基础 CLI 测试 | 1-2 vCPU, 2 GB RAM |
| 24/7 在线 + 轻量 Cron | 2 vCPU, 4 GB RAM |
| 自动化 + 浏览器工具 | 4 vCPU, 8 GB RAM |
| 本地模型推理 | 更高配置或外接 GPU 端点 |

---

## Serverless 部署(Modal)

对于间歇使用的场景（研究实验、按需任务），**Modal** 是一个不错的选择。

### Modal 平台简介

Modal 是一个 Serverless 云平台，支持 Python 应用的自动扩缩容。Hermes Agent 的 Modal 后端在闲置时自动休眠，再次使用秒级唤醒——**闲置期间基本不产生费用**。

### 配置步骤

1. 注册 Modal 账号（modal.com）
2. 安装 Modal CLI 并认证：

```bash
pip install modal
modal token new
```

3. 在 Hermes Agent 中切换到 Modal 后端：

```bash
hermes config set terminal.backend modal
```

Modal 后端的优势在于"零管理"——不需要自己维护服务器，不需要配置 systemd 服务，不需要担心系统更新。适合不想管运维的开发者。

---

## 平台集成配置

Hermes Agent 通过一个统一的 Gateway 进程管理所有消息平台连接。配置一次 Gateway，即可同时在多个平台与 Agent 交互。

### 初始化 Gateway

```bash
hermes gateway setup
```

这个命令会引导你配置需要连接的消息平台。你可以跳过所有平台，先通过 CLI 测试，后续再回来配置。

### 启动 Gateway

```bash
hermes gateway start
```

Gateway 启动后，Agent 的上下文、记忆和技能在所有平台间共享。你可以在 Telegram 上发起一个任务，然后在终端中继续。

### Telegram Bot 集成

1. 在 Telegram 中搜索 **@BotFather**，发送 `/newbot` 创建 Bot
2. 保存 BotFather 返回的 Token
3. 在 `hermes gateway setup` 时输入 Token，或在配置文件中设置：

```yaml
# ~/.hermes/config.yaml
gateway:
  platforms:
    telegram:
      bot_token: "YOUR_BOT_TOKEN"
      allowed_user_ids: ["YOUR_TELEGRAM_USER_ID"]
```

4. 打开 Telegram，搜索你的 Bot 用户名，发送 `/start`

Telegram Bot 支持群组 @提及 触发响应——只有在 `@你的Bot` 时才回应，不会干扰群聊。

### Discord 集成

1. 在 Discord Developer Portal 创建应用并添加 Bot
2. 启用 **Message Content Intent**（必需，否则 Bot 无法读取消息内容）
3. 获取 Bot Token 并在 Gateway 配置中设置

Discord 支持语音频道内的实时对话。

### Slack 集成

1. 在 Slack API 页面创建 App，启用 Bot Token 和 Socket Mode
2. 默认只在私信中响应，如需在公共频道使用，需订阅 `message.channels` 事件

### 多平台同时运行

Gateway 支持同时配置多个平台。在 `hermes gateway setup` 时，按提示依次配置你需要的平台即可。所有平台共享同一个 Agent 实例和记忆空间。

---

## 技能创建入门

### 技能系统概览

Hermes Agent 的技能（Skill）是**过程性知识文档**（Procedural Memory），告诉 Agent"怎么做某件事"。每个 Skill 是一个目录，包含一个 `SKILL.md` 文件，使用 YAML 前置元数据和 Markdown 正文。

Skill 采用**渐进披露**设计，最小化 Token 消耗：

- **Level 0**：Agent 看到所有 Skill 的名称和简短描述（约 3,000 个 Token）
- **Level 1**：需要时加载具体 Skill 的完整内容
- **Level 2**：在 Skill 内加载特定参考文件

### 从对话中自动产生技能

这是 Hermes Agent 最有特色的功能之一。当 Agent 完成一个复杂任务（通常需要 5 次及以上工具调用），它**自动创建一个 Skill 文档**：

- 任务描述：这个技能解决什么问题
- 执行步骤：具体的操作流程
- 已知失败点：什么情况下这个方案不适用
- 验证步骤：如何确认任务完成

生成的 Skill 存储在 `~/.hermes/skills/` 目录中。

::: tip 技能自我改进
Skill 在使用过程中会持续更新。如果 Agent 发现更好的方法，它会实时更新 Skill 文档——不需要人工介入。
:::

### 手动创建和编辑技能

你也可以手动创建 Skill。在 `~/.hermes/skills/` 下创建一个新的目录和 `SKILL.md` 文件：

```markdown
---
name: "daily-report"
description: "生成每日工作日报"
version: 1.0
author: user
---

# 每日工作日报生成

## 前置条件
- 需要访问项目管理系统
- 需要获取当日 git 提交记录

## 执行步骤
1. 收集当天的 git 提交信息
2. 汇总已完成的任务
3. 格式化为日报模板
4. 发送到指定的 Slack 频道

## 验证
- 日报包含所有当日变更
- 格式符合团队规范
```

### 技能管理与复用

- **查看所有技能**：在聊天中输入 `/skills`
- **调用特定技能**：Agent 会自动匹配当前任务到合适的 Skill
- **分享技能**：Skill 是纯文本文件，可以分享给团队。社区技能中心在 [agentskills.io](https://agentskills.io)
- **团队共享**：可以通过配置外部 Skill 目录实现团队级共享

---

## 自动化任务(Cron)

Hermes Agent 内置了 Cron 调度器，可以用自然语言创建定时任务。

### 工作原理

Cron 调度器集成在 Gateway 中，**Gateway 运行时每约 60 秒检查一次任务队列**。配置文件和输出文件存储在：

- 任务配置：`~/.hermes/cron/jobs.json`
- 任务输出：`~/.hermes/cron/output/`

### 创建 Cron 任务

你不需要学习 crontab 语法。直接告诉 Agent 你想做什么：

> "每天早上 9 点检查 Hacker News 的 AI 新闻，汇总发送到我的 Telegram。"

Agent 收到请求后，会自主创建一个 Cron 任务并按时执行。

### 常用 Cron 场景

| 场景 | 示例描述 |
|------|---------|
| **日报生成** | 每天下午 6 点汇总今日工作内容，生成日报并发送到 Slack |
| **定时备份** | 每周日凌晨 3 点备份 `~/projects` 目录到 S3 |
| **竞品监控** | 每小时检查一次指定网站的更新 |
| **周报整理** | 每周五下午 5 点汇总本周 git 提交记录 |

### 任务管理命令

| 命令 | 用途 |
|------|------|
| `hermes cron list` | 查看所有已配置的 Cron 任务 |
| `hermes cron status` | 查看任务执行状态 |
| `hermes cron pause <id>` | 暂停某个任务 |
| `hermes cron remove <id>` | 删除某个任务 |

::: warning 注意
- Cron 任务**只在 Gateway 运行时执行**
- 如果你在 VPS 上运行，确保 Gateway 注册为 systemd 服务
- 检查服务器时区是否与你的预期一致（`date` 命令查看）
- Cron 任务可以投递到 Gateway 支持的任何消息平台
:::

---

## 从 OpenClaw 迁移

如果你已经在使用 OpenClaw 并想迁移到 Hermes Agent，可以一键完成。

### 迁移范围

Hermes Agent 的迁移工具可以导入以下数据：

| 项目 | 是否支持 | 说明 |
|------|---------|------|
| 人格设定文件 SOUL.md | ✅ | 迁移后可直接使用 |
| 记忆文件 MEMORY.md / USER.md | ✅ | 跨会话记忆完整保留 |
| 用户创建的技能 | ✅ | 导入到 `~/.hermes/skills/openclaw-imports/` |
| 命令审批白名单 | ✅ | 保持原有的安全策略 |
| 消息平台配置 | ✅ | Telegram、Discord 等 |
| API Key | ✅ | 允许导入的 Key（Telegram、OpenRouter、OpenAI、Anthropic、ElevenLabs） |
| TTS 音频工作空间 | ✅ | 语音相关配置 |
| AGENTS.md 工作区指令 | ✅ | 项目级别的指令文件 |

### 迁移命令

```bash
hermes claw migrate
```

迁移工具会自动检测 `~/.openclaw` 目录的存在。你也可以在执行 `hermes setup` 时完成迁移——如果检测到 `~/.openclaw`，设置向导会主动询问是否迁移。

### 迁移选项

| 标志 | 用途 |
|------|------|
| `--dry-run` | 预览迁移结果，不执行实际迁移 |
| `--preset user-data` | 只迁移用户数据，不迁移密钥等敏感信息 |
| `--overwrite` | 冲突时覆盖已有文件 |

### 迁移后验证

迁移完成后，建议按以下步骤验证：

1. 运行 `hermes` 进入交互模式，确认模型和技能加载正常
2. 检查 `~/.hermes/skills/` 中是否包含导入的技能
3. 测试一个熟悉的任务，确认记忆和上下文正常
4. 确认消息平台连接正常（如 Telegram Bot 响应）

---

## 思考题

::: info 检验你的理解
- [ ] 能说出 Hermes Agent 六种终端后端的特点和适用场景
- [ ] 能独立完成 Docker 部署并配置消息平台
- [ ] 理解 VPS 部署中 systemd 服务对持久运行的重要性
- [ ] 知道 Modal 后端的优势和适用场景
- [ ] 能创建 Telegram Bot 并配置到 Hermes Agent
- [ ] 理解 Skill 系统的渐进披露机制和工作原理
- [ ] 能用自然语言创建 Cron 定时任务
- [ ] 知道 OpenClaw 迁移支持的数据范围和迁移命令
- [ ] 能排查 Gateway 运行状态和 Cron 任务的问题
- [ ] 理解不同部署方式的生产环境安全建议
:::

---

## 本节小结

通过本节学习，你应该掌握了：

✅ **部署方式**
- 六种终端后端对比（Local / Docker / SSH / Daytona / Singularity / Modal）
- 选型建议：个人开发推荐 Docker，生产环境推荐 VPS + systemd，间歇使用推荐 Modal
- Docker 部署完整流程：数据卷挂载、首次设置、Gateway 启动

✅ **生产环境部署**
- VPS 环境要求和安装步骤
- systemd 服务注册与日志查看
- 安全建议：SSH 密钥、防火墙、API Key 管理、数据备份

✅ **消息平台集成**
- Telegram Bot 创建和配置
- Discord / Slack 集成要点
- 多平台同时运行的配置
- Gateway 统一架构：共享上下文、记忆和技能

✅ **技能系统**
- 自动从复杂任务生成 Skill
- 手动创建和编辑 SKILL.md
- 渐进披露机制：Level 0 → Level 1 → Level 2
- 技能共享和团队协作

✅ **Cron 调度器**
- 自然语言创建定时任务
- 日报生成、定时备份等场景
- 任务管理命令

✅ **OpenClaw 迁移**
- 一键迁移命令 `hermes claw migrate`
- 支持的数据范围和验证步骤

---

**下一步**: 恭喜你完成了模块 07（Agent 生态）的全部内容。现在你已经了解了主流 Agent 框架、平台、技能系统和 Hermes Agent 的部署实战。接下来可以进入**附录部分**查阅术语表、工具清单或常见问题，或开始学习其他模块。

---

## 延伸阅读

- [Hermes Agent GitHub 仓库](https://github.com/NousResearch/hermes-agent)
- [Hermes Agent 官方网站](https://hermes-agent.nousresearch.com/)
- [Hermes Agent 官方文档](https://hermes-agent.nousresearch.com/docs/)
- [Hostinger Docker 部署教程](https://www.hostinger.com/tutorials/how-to-set-up-hermes-agent)
- [Bluehost VPS 部署指南](https://www.bluehost.com/blog/run-hermes-agent-vps/)
- [agentskills.io - 社区技能中心](https://agentskills.io)
- [模块 07 内容回顾：Hermes Agent 概述](/agent-ecosystem/07-agent-ecosystem/07-hermes-agent-overview)

---

[← 返回模块目录](/agent-ecosystem/07-agent-ecosystem)
