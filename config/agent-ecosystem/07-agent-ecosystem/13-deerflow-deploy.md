# DeerFlow 实战部署

> **学习目标**: 掌握 DeerFlow 的 Docker 部署、多模型配置、Sandbox 环境管理与 IM 渠道接入
>
> **预计时间**: 50 分钟
>
> **难度等级**: ⭐⭐⭐☆☆
>
> **更新时间**: 2026年5月

---

## 环境准备

### 硬件配置

DeerFlow 是一个完整的 Super Agent 运行时，包含 Lead Agent + Sub-Agent 调度、Docker Sandbox 隔离执行和持久化记忆系统，因此对硬件有一定的要求。根据使用场景的不同，以下是三档配置参考：

| 部署场景 | 起步配置 | 推荐配置 | 说明 |
|---------|---------|---------|------|
| **本地体验/快速测试** | 4 vCPU、8 GB 内存 | 4 vCPU、16 GB 内存 | 可运行单个任务，Sandbox 并发数受限 |
| **Docker 开发** | 4 vCPU、8 GB 内存 | 8 vCPU、16 GB 内存 | 开发调试为主，可同时运行 1-2 个 Sub-Agent |
| **长期运行服务** | 8 vCPU、16 GB 内存 | 16 vCPU、32 GB 内存 | 支持完整 Sandbox 热池，3+ 并发 Sub-Agent |

::: tip 磁盘空间
DeerFlow 使用 Docker 容器作为 Sandbox 执行环境，镜像体积较大。建议预留至少 **20 GB** 可用磁盘空间，用于存储 Docker 镜像、Sandbox 工作区文件和持久化数据。
:::

### 软件依赖

在开始部署之前，确保你的环境中已安装以下软件：

| 软件 | 版本要求 | 用途 |
|------|---------|------|
| **Docker** | 20.10+ | Sandbox 容器运行时和主服务容器化 |
| **Python** | 3.12+ | DeerFlow 核心运行环境 |
| **Node.js** | 22+ | Web UI 和部分工具链支持 |
| **pnpm** | 最新版 | 前端依赖管理 |
| **uv** | 最新版 | Python 包管理器（快速依赖安装） |
| **nginx** | 最新版 | 生产环境反向代理（可选） |

安装完成后，验证各工具版本：

```bash
docker --version      # 确认 Docker 版本
python3 --version     # 确认 Python 版本
node --version        # 确认 Node.js 版本
pnpm --version        # 确认 pnpm 版本
uv --version          # 确认 uv 版本
```

### 模型 API Key 准备

DeerFlow 自身不绑定 LLM 提供方，支持所有 OpenAI 兼容 API。你需要准备至少一个 LLM 的 API Key。推荐方式是在项目根目录创建 `.env` 文件，将敏感信息集中管理：

```bash
# .env 文件内容示例
# 豆包模型（推荐主模型）
ARK_API_KEY="your-ark-api-key-here"

# DeepSeek（备用模型）
DEEPSEEK_API_KEY="your-deepseek-api-key-here"

# Kimi（备用模型）
MOONSHOT_API_KEY="your-moonshot-api-key-here"

# LangSmith 链路追踪（可选）
LANGSMITH_API_KEY="your-langsmith-api-key"
```

::: warning 密钥安全
`.env` 文件包含敏感信息，**切勿提交到 Git 仓库**。建议将 `.env` 添加到 `.gitignore` 文件中。生产环境推荐通过 Docker Secret 或环境变量注入。
:::

---

## 安装部署

DeerFlow 提供两套部署方式：**Docker 部署（推荐）** 和 **本地开发模式**。如果你只是想快速体验功能，Docker 方式是最快入口。

### 方式一：Docker 部署（推荐）

Docker 部署将 DeerFlow 的所有组件（Gateway、Sandbox 管理、Web UI、记忆系统）打包为容器，一键启动，环境一致性好。

#### 开发模式

开发模式支持代码热更新，适合在本地进行二次开发和调试：

```bash
# 1. 克隆仓库
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow

# 2. 初始化 Docker 环境（拉取镜像、创建网络、初始化数据目录）
make docker-init

# 3. 启动开发模式（支持热更新）
make docker-start
```

启动后，DeerFlow 的 Web UI 在 **http://localhost:2026** 可访问。你修改代码后，容器会自动重新加载，无需手动重启。

#### 生产模式

生产模式使用 `docker compose`，适合 24/7 在线运行：

```bash
# 启动所有服务（后台运行）
make up

# 查看服务状态
docker compose ps

# 查看实时日志
docker compose logs -f

# 停止所有服务
make down
```

生产模式下，DeerFlow 会启动以下容器：

| 容器 | 功能 | 说明 |
|------|------|------|
| **deerflow-gateway** | 主网关 | 处理消息路由、模型调用、Agent 编排 |
| **deerflow-sandbox** | Sandbox 管理 | 管理 Docker 沙箱热池，负责 Sub-Agent 的执行环境 |
| **deerflow-web** | Web UI | 提供操作面板和记忆管理接口 |
| **deerflow-redis** | 状态存储 | 缓存、队列和会话状态存储 |

#### 访问地址

部署完成后，通过以下地址访问各服务：

| 服务 | 地址 | 说明 |
|------|------|------|
| **Web UI** | http://localhost:2026 | 主操作面板 |
| **Gateway API** | http://localhost:2027 | REST API 接口 |
| **Sandbox 状态** | http://localhost:2028 | Sandbox 热池监控 |

### 方式二：本地开发

如果不希望使用 Docker，也可以直接在宿主机上运行 DeerFlow。这种方式更轻量，但缺少 Sandbox 容器隔离：

```bash
# 1. 克隆仓库
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow

# 2. 检查环境依赖是否满足
make check

# 3. 安装 Python 和 Node.js 依赖
make install

# 4. (可选) 如果没有 Docker，跳过 Sandbox 相关功能
make setup-sandbox   # 跳过此步不影响基本功能

# 5. 启动开发服务器
make dev
```

本地模式的访问地址与 Docker 模式相同：Web UI 在 **http://localhost:2026**。

::: tip 首次启动
无论是 Docker 还是本地模式，首次启动时 DeerFlow 会自动在 `~/.deerflow/` 目录下初始化配置文件和默认数据目录。你也可以通过设置 `DEERFLOW_HOME` 环境变量来自定义这个路径。
:::

### 部署方式对比

| 维度 | Docker（推荐） | 本地开发 |
|------|--------------|---------|
| **部署复杂度** | 低（一行命令） | 中（需手动安装依赖） |
| **资源占用** | 较高（含完整容器） | 较低（无容器开销） |
| **热更新支持** | 开发模式支持（`make docker-start`） | 支持（`make dev`） |
| **Sandbox 隔离** | 原生支持 Docker Sandbox | 有限（宿主机直接执行） |
| **生产就绪度** | 高（docker compose 编排、自动重启） | 低（适合开发调试） |
| **环境一致性** | 高（容器化，团队一致） | 依赖宿主机环境 |

**选型建议**：团队协作或生产运行首选 Docker 模式；个人快速实验或调试代码可先用本地模式。

---

## 配置详解

### 模型配置

DeerFlow 的所有配置集中在 `~/.deerflow/config.yaml` 文件中。模型配置是其核心部分，你需要在此定义 Agent 使用的 LLM。

以下是一个典型的 `config.yaml` 示例，定义了三个模型，分别用于不同场景：

```yaml
# ~/.deerflow/config.yaml

models:
  # 主模型：用于 Lead Agent 调度和复杂推理
  - name: "doubao-seed-2.0-code"
    provider: "ark"
    api_key: "${ARK_API_KEY}"          # 从 .env 文件读取
    model: "doubao-seed-2.0-code"
    max_tokens: 8192
    temperature: 0.3
    # 适合：任务规划、代码生成、结构化输出

  # 备用模型：用于高并发或成本敏感场景
  - name: "deepseek-v3.2"
    provider: "openai"
    api_key: "${DEEPSEEK_API_KEY}"
    model: "deepseek-chat"
    base_url: "https://api.deepseek.com/v1"
    max_tokens: 4096
    temperature: 0.5
    # 适合：内容摘要、信息提取、日常对话

  # 备用模型：长上下文场景
  - name: "kimi-2.5"
    provider: "openai"
    api_key: "${MOONSHOT_API_KEY}"
    model: "kimi-2.5"
    base_url: "https://api.moonshot.cn/v1"
    max_tokens: 8192
    temperature: 0.3
    # 适合：长文档分析、多轮对话、记忆管理
```

配置说明：

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| `provider` | API 提供方类型 | `ark`（豆包）、`openai`（通用兼容） |
| `api_key` | API 密钥，支持 `${VAR}` 引用环境变量 | `"${ARK_API_KEY}"` |
| `model` | 模型名称 | `doubao-seed-2.0-code` |
| `temperature` | 生成随机性，DeerFlow 推荐 0.1-0.5 | `0.3` |
| `base_url` | 兼容 API 的自定义地址 | `https://api.deepseek.com/v1` |

::: tip 模型选择建议
DeerFlow 的 Lead Agent 需要较强的推理和工具调用能力，推荐将推理能力强、上下文窗口大的模型设置为主模型。Sub-Agent 可以使用成本更低或响应更快的模型，在 `agent_config` 中按需分配。
:::

### Sandbox 模式

Sandbox 是 DeerFlow 的关键基础设施，Sub-Agent 在 Sandbox 中实际执行代码、读写文件。DeerFlow 支持三种 Sandbox 执行模式：

| 模式 | 隔离级别 | 启动速度 | 适用场景 |
|------|---------|---------|---------|
| **本地执行** | 无隔离 | 极快 | 开发调试、信任代码 |
| **Docker 执行** | 进程级隔离 | 快（热池预热） | 标准生产环境 |
| **Docker + K8s** | Pod 级隔离 | 中等（需调度） | 多租户、大规模集群 |

```yaml
# config.yaml Sandbox 配置示例
sandbox:
  mode: docker                      # 执行模式：local / docker / k8s
  max_concurrency: 3                # 最大并行 Sub-Agent 数
  idle_timeout: 600                 # 空闲超时（秒）
  warm_pool_size: 2                 # 预热容器数量
  workspace: "/mnt/user-data/workspace"  # 工作区挂载路径
  outputs: "/mnt/user-data/outputs"
  uploads: "/mnt/user-data/uploads"
```

Sandbox 的热池机制（Warm Pool）会提前启动 2 个容器并保持就绪状态，当 Sub-Agent 被触发时，直接从热池分配容器，避免冷启动延迟。空闲超过 600 秒的容器会被 LRU 策略驱逐。

### MCP Server 集成

DeerFlow 支持通过 MCP（Model Context Protocol）集成外部工具服务。目前支持两种传输方式：

**HTTP/SSE MCP Server**：通过 SSE（Server-Sent Events）建立双向通信，适合远程工具服务。

```yaml
# config.yaml MCP 集成示例
mcp_servers:
  - name: "web-search"
    transport: "sse"
    url: "https://mcp.example.com/web-search"
    auth:
      type: "oauth"
      client_id: "${MCP_CLIENT_ID}"
      client_secret: "${MCP_CLIENT_SECRET}"
```

MCP Server 的 OAuth 认证流程由 DeerFlow Gateway 自动处理：首次连接时启动授权页面，获取 token 后自动刷新，对用户透明。

### LangSmith 链路追踪

LangSmith 可以帮助你追踪每一轮 LLM 调用，便于调试和优化。在配置文件中启用：

```yaml
# config.yaml LangSmith 配置
langsmith:
  api_key: "${LANGSMITH_API_KEY}"
  project: "deerflow-production"
  tracing_enabled: true
  metadata:
    environment: "production"
    version: "2.0.0"
```

启用后，每一次 Agent 任务都会在 LangSmith 中生成完整的调用链，包括 Lead Agent 的推理过程和每个 Sub-Agent 的执行细节。

---

## IM 渠道接入

DeerFlow 支持通过统一 Gateway 对接多个 IM（即时消息）平台，这样你可以在日常使用的聊天工具中直接与 Agent 交互。

### 渠道对比

| 渠道 | 传输方式 | 配置难度 | 说明 |
|------|---------|---------|------|
| **Telegram** | Bot API long-polling | 简单 | 配置最简洁，个人开发者首选 |
| **Slack** | Socket Mode | 中等 | 团队协作场景，需创建 App |
| **飞书** | WebSocket | 中等 | 国内团队使用，需企业版飞书 |
| **企微智能机器人** | WebSocket | 中等 | 企业微信场景，需企业管理员权限 |
| **钉钉** | Stream Push | 中等 | 钉钉组织内使用，需 Stream 模式 |

### 各渠道配置步骤

#### Telegram

1. 在 Telegram 中搜索 **@BotFather**，发送 `/newbot` 创建机器人
2. 保存 BotFather 返回的 Token
3. 在 `config.yaml` 中配置：

```yaml
im:
  telegram:
    bot_token: "${TELEGRAM_BOT_TOKEN}"
    allowed_user_ids: ["你的 Telegram 用户 ID"]
```

4. 搜索你的 Bot 用户名，发送 `/start` 开始对话

#### Slack

1. 在 [Slack API](https://api.slack.com) 创建 App，选择 **Socket Mode**
2. 添加 `chat:write`、`channels:history` 等 Bot Token Scope
3. 安装 App 到工作区，获取 Bot Token
4. 在 `config.yaml` 中配置：

```yaml
im:
  slack:
    app_token: "${SLACK_APP_TOKEN}"     # Socket Mode 需要
    bot_token: "${SLACK_BOT_TOKEN}"
```

#### 飞书

1. 在飞书开放平台创建应用，开启 **WebSocket 模式**
2. 获取 App ID 和 App Secret
3. 配置事件订阅（`im.message.receive_v1`）

```yaml
im:
  feishu:
    app_id: "${FEISHU_APP_ID}"
    app_secret: "${FEISHU_APP_SECRET}"
```

#### 企微智能机器人

1. 在企业微信管理后台创建智能机器人
2. 获取 Webhook URL 和 Token
3. 配置事件接收方式为 WebSocket

```yaml
im:
  wecom:
    webhook_url: "${WECOM_WEBHOOK_URL}"
    token: "${WECOM_TOKEN}"
```

#### 钉钉

1. 在钉钉开放平台创建应用，开启 **Stream Push 模式**
2. 获取 Client ID 和 Client Secret

```yaml
im:
  dingtalk:
    client_id: "${DINGTALK_CLIENT_ID}"
    client_secret: "${DINGTALK_CLIENT_SECRET}"
```

### 常用聊天命令

渠道配置完成后，你就可以在聊天中使用以下命令与 DeerFlow 交互：

| 命令 | 功能 | 示例 |
|------|------|------|
| `/new` | 开启新会话 | `/new` |
| `/status` | 查看当前任务状态 | `/status` |
| `/models` | 查看已配置的模型列表 | `/models` |
| `/memory` | 查看或管理记忆 | `/memory list` |
| `/help` | 查看帮助信息 | `/help` |

所有渠道共享同一个 Agent 实例和记忆空间——你可以在 Telegram 上发起一个研究任务，然后在飞书上查看结果。

---

## 基础使用与实战案例

### 内嵌 Python Client

DeerFlow 提供了 Python 客户端库，可以在你的代码中直接调用 Agent：

```python
from deerflow.client import DeerFlowClient

# 初始化客户端（默认连接本地 Gateway）
client = DeerFlowClient(base_url="http://localhost:2027")

# 发送聊天请求
response = client.chat(
    "Analyze this paper: https://arxiv.org/abs/2501.00001",
    thread_id="my-thread"
)

print(response.content)

# 简化为单次任务（不保留上下文）
quick_result = client.chat(
    "Summarize: Python 3.14 new features",
    thread_id="one-off"
)
```

参数说明：

| 参数 | 类型 | 说明 |
|------|------|------|
| `base_url` | str | Gateway API 地址，默认 `http://localhost:2027` |
| `thread_id` | str | 会话 ID，相同 ID 共享上下文 |
| `model` | str | (可选) 指定使用的模型名 |

### Claude Code 集成

如果你是 Claude Code 的用户，可以通过安装 DeerFlow Skill 直接在 Claude Code 中调用 DeerFlow 来执行复杂任务：

```bash
# 安装 DeerFlow 适配器
npx skills add https://github.com/bytedance/deer-flow --skill claude-to-deerflow
```

安装完成后，在 Claude Code 中可以用类似这样的方式调用：

```bash
# 将重任务委托给 DeerFlow
/deerflow 调研 2026 年 Q1 全球 AI 政策变化，输出详细报告
```

Claude Code 会将任务描述转发给 DeerFlow，DeerFlow 利用自身的 Sub-Agent 并行执行和 Sandbox 能力完成重活，最终将结果返回给 Claude Code。

### Web UI 操作

DeerFlow 的 Web UI（http://localhost:2026）提供了可视化操作界面，包含三个主要区域：

1. **对话面板**：与 Agent 直接交流，类似聊天界面。输入任务后，可以实时看到 Lead Agent 的任务拆解过程和 Sub-Agent 的执行进度。
2. **任务管理**：查看所有运行中和已完成的任务。可以查看每个 Sub-Agent 的详细执行日志、错误信息和产出文件。
3. **记忆管理**：查看和管理 DeerFlow 自动提取的事实数据。可以手动添加、编辑或删除记忆条目，也可以按关键词搜索。

---

## 进阶调优

### 自定义 Skills

DeerFlow 的 Skill 系统是基于 Markdown 文件定义的。你可以将自己团队的专属能力注册为 Skill，放在 `/mnt/skills/custom/` 目录下（该路径可配置）：

```markdown
# /mnt/skills/custom/code-review.md

---
name: "code-review"
description: "对指定代码仓库进行自动化 Code Review"
version: 1.0
---

# 自动化 Code Review

## 输入参数
- `repo_path`: 代码仓库本地路径
- `branch`: 待审查的分支名称

## 执行步骤
1. 切换到目标分支，拉取最新代码
2. 运行 `git diff main...HEAD` 获取变更文件列表
3. 对每个变更文件，检查：
   - 是否存在硬编码密钥或敏感信息
   - 异常处理是否完善
   - 函数/方法是否过长（建议不超过 50 行）
   - 命名是否遵循项目规范
4. 汇总所有问题，生成 Code Review 报告
```

DeerFlow 的 Skill 采用渐进式加载，意味著只有被触发的 Skill 才会被加载到上下文中，不会浪费 Token。

### Gateway API 使用

除了通过聊天和 Web UI，DeerFlow 的 Gateway 还提供了 REST API，用于程序化调用：

```bash
# 启动一个研究任务
curl -X POST http://localhost:2027/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "调研 2026 年 MCP 协议生态发展",
    "thread_id": "api-task-001",
    "model": "doubao-seed-2.0-code"
  }'

# 查询任务状态
curl http://localhost:2027/api/tasks/api-task-001/status

# 获取任务结果
curl http://localhost:2027/api/tasks/api-task-001/result
```

### 安全部署建议

将 DeerFlow 暴露到公网时，务必做好以下安全措施：

| 措施 | 说明 | 建议配置 |
|------|------|---------|
| **监听地址** | 默认监听 127.0.0.1（仅本地可达） | `host: "127.0.0.1"` |
| **IP 白名单** | 限制允许访问的 IP 范围 | 通过 nginx 或防火墙实现 |
| **前置身份验证** | 在 Gateway 前增加认证层 | nginx basic auth 或 OAuth Proxy |
| **网络隔离** | 将 Services 放在独立 Docker 网络 | 使用 internal 网络，限制外联 |
| **API 限流** | 防止被滥用 | `rate_limit: "10/minute"` |

```yaml
# 安全配置示例
gateway:
  host: "127.0.0.1"           # 仅本地监听
  port: 2027
  rate_limit: "10/minute"     # API 限流
  allowed_origins:            # CORS 白名单
    - "http://localhost:2026"
```

### 推荐大模型

DeerFlow 的性能在很大程度上取决于你选择的 LLM。根据实战经验，以下模型在 DeerFlow 中表现优异：

| 模型 | 推荐场景 | 关键优势 |
|------|---------|---------|
| **Doubao-Seed-2.0-Code** | Lead Agent 调度 + 代码任务 | 128K 上下文、强代码能力、稳定 tool use |
| **DeepSeek v3.2** | Sub-Agent 执行 + 成本敏感任务 | 超高性价比、响应快 |
| **Kimi 2.5** | 长文档分析 + 研究任务 | 长上下文窗口、多模态 |
| **Claude Sonnet 4** | 复杂推理 + 结构化输出 | 最强推理、精确 tool use |
| **GPT-4o** | 多模态 + 综合场景 | 生态最成熟、稳定性好 |

选型建议：**主模型选择长上下文 + 强推理能力的模型**（如 Doubao-Seed-2.0-Code 或 Claude Sonnet 4），让 Lead Agent 有足够的上下文窗口处理多 Sub-Agent 的返回结果。Sub-Agent 可以使用成本更低、响应更快的模型（如 DeepSeek v3.2）。

---

## 思考题

::: info 检验你的理解
- [ ] 能独立完成 Docker 部署 DeerFlow 的完整流程（开发模式和生产模式）
- [ ] 理解 Sandbox 三种执行模式的区别和适用场景
- [ ] 能正确配置多模型并在 config.yaml 中引用环境变量
- [ ] 能配置至少两种 IM 渠道（如 Telegram + 飞书）
- [ ] 会使用 Python Client 和 API 调用 DeerFlow
- [ ] 理解 Warm Pool 机制和 Sandbox 空闲驱逐策略
- [ ] 能自定义 Skill 并挂载到 DeerFlow 中
- [ ] 掌握生产环境的安全部署建议
- [ ] 能根据不同任务选择合适的大模型组合
- [ ] 理解 Gateway API 的基本用法和典型调用流程
:::

---

## 本节小结

通过本节学习，你应该掌握了：

✅ **环境与部署**
- 三档硬件配置参考（本地体验 / Docker 开发 / 长期运行）
- 软件依赖清单（Docker、Python 3.12+、Node.js 22+、pnpm、uv）
- Docker 部署：开发模式（`make docker-init` → `make docker-start`）和生产模式（`make up` / `make down`）
- 本地开发部署：`make check` → `make install` → `make dev`
- 部署方式对比和选型建议

✅ **配置详解**
- 多模型配置：config.yaml 格式、环境变量引用
- 推荐模型：Doubao-Seed-2.0-Code、DeepSeek v3.2、Kimi 2.5
- Sandbox 三种执行模式：本地 / Docker / Docker + K8s
- MCP Server 集成（HTTP/SSE + OAuth）
- LangSmith 链路追踪配置

✅ **IM 渠道接入**
- 五大渠道对比（Telegram / Slack / 飞书 / 企微 / 钉钉）
- 各渠道配置步骤和关键参数
- 常用聊天命令：`/new`、`/status`、`/models`、`/memory`、`/help`

✅ **实战使用**
- Python Client 调用 Agent（创建会话、发送任务）
- Claude Code 集成（`npx skills add`）
- Web UI 操作（对话面板、任务管理、记忆管理）

✅ **进阶调优**
- 自定义 Skills（Markdown 文件注册）
- Gateway API 调用（REST 接口）
- 安全部署建议（IP 白名单、前置认证、网络隔离、API 限流）
- 大模型选型策略

---

## 延伸阅读

- [DeerFlow GitHub 仓库](https://github.com/bytedance/deer-flow)
- [DeerFlow 官网](https://deerflow.tech)
- [LangGraph 1.0 官方文档](https://www.langchain.com/langgraph)
- [LangSmith 链路追踪文档](https://docs.smith.langchain.com/)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [DeerFlow 概述](/agent-ecosystem/07-agent-ecosystem/12-deerflow-overview)
- [Agent 编排模式](/agent-ecosystem/07-agent-ecosystem/06-orchestration)
- [Hermes Agent 实战部署](/agent-ecosystem/07-agent-ecosystem/08-hermes-agent-deploy)

---

[← 返回模块目录](/agent-ecosystem/07-agent-ecosystem) | [继续学习: 回到模块目录](/agent-ecosystem/07-agent-ecosystem)
