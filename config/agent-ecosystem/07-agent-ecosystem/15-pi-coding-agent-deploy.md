# pi-coding-agent 实战

> **学习目标**: 掌握 pi-coding-agent 的安装配置、核心功能使用、扩展开发和 SDK 集成
>
> **预计时间**: 50 分钟
>
> **难度等级**: ⭐⭐⭐☆☆
>
> **更新时间**: 2026年5月

---

## 环境准备

### 软件依赖

pi-coding-agent 是一个纯 Node.js 应用，安装依赖非常轻量。在开始之前，确保你的环境中已具备以下软件：

| 软件 | 版本要求 | 用途 |
|------|---------|------|
| **Node.js** | 20+ | pi-coding-agent 运行环境 |
| **npm** | 10+（通常随 Node.js 自带） | 包管理与安装 |
| **Git** | 2.30+ | 版本控制（Agent 的 bash 工具会大量使用） |
| **Docker** | 20.10+（可选） | 安全隔离运行环境 |

安装完成后，验证各工具版本：

```bash
node --version     # 确认 Node.js 版本 ≥ 20
npm --version      # 确认 npm 版本
git --version      # 确认 Git 版本
docker --version   # (可选) 确认 Docker 版本
```

::: tip 关于 Docker
pi-coding-agent 采用 YOLO 安全模型，Agent 拥有完整的 Shell 权限。在生产环境或处理敏感项目时，**强烈建议在 Docker 容器中运行**，通过物理隔离保障安全。本地快速体验可以不用 Docker。
:::

### LLM API Key 配置

pi-coding-agent 支持 25+ 家 LLM Provider，你需要至少准备一个 API Key。推荐通过环境变量统一管理：

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中添加（按需选择）

# Anthropic Claude（推荐，推理能力强）
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# OpenAI GPT-4o
export OPENAI_API_KEY="sk-your-key-here"

# DeepSeek（性价比高）
export DEEPSEEK_API_KEY="sk-your-key-here"

# Google Gemini
export GOOGLE_API_KEY="your-key-here"

# 其他支持的 Provider：Bedrock、Mistral、Groq、Cerebras、xAI 等
```

配置完成后，执行 `source ~/.zshrc`（或重启终端）使环境变量生效。

::: warning 密钥安全
API Key 属于敏感信息，**不要硬编码在脚本中，也不要提交到 Git 仓库**。推荐做法是统一放在 Shell 配置文件中，并通过 `.gitignore` 排除。
:::

### 配置文件目录结构

pi-coding-agent 的所有配置和扩展文件集中在 `~/.pi/` 目录下。首次运行时会自动创建，你也可以手动创建：

```
~/.pi/
├── agent/
│   ├── prompts/        # Prompt Templates（第 1 层扩展）
│   ├── skills/         # Skills（第 2 层扩展）
│   └── extensions/     # Extensions（第 3 层扩展）
└── config.json         # 全局配置（可选）
```

---

## 安装与启动

### 全局安装

最简单的方式是通过 npm 全局安装：

```bash
npm install -g @nicepkg/pi-coding-agent
```

安装完成后，`pi` 命令就可以在终端中直接使用了。验证安装：

```bash
pi --version
# 输出示例: 0.x.x
```

### 免安装运行

如果你不想全局安装，也可以使用 `npx` 一次性运行：

```bash
npx @nicepkg/pi-coding-agent "列出当前目录的文件结构"
```

`npx` 会自动下载最新版本并执行，用完即走。

### 首次启动

全局安装后，直接输入 `pi` 启动交互模式：

```bash
pi
```

首次启动时，pi-coding-agent 会引导你完成以下配置：

1. **选择 LLM Provider**：从支持的 25+ 家 Provider 中选择一个
2. **配置 API Key**：输入对应 Provider 的 API Key（如果环境变量已配置，会自动读取）
3. **选择默认模型**：为选定的 Provider 指定默认模型

配置完成后，你会看到 pi-coding-agent 的交互界面，光标闪烁等待你的指令。

### 配置文件

如果你想跳过交互引导，可以手动创建配置文件。pi-coding-agent 的配置支持多种格式，以下是一个典型的 JSON 配置示例：

```json
// ~/.pi/config.json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "apiKey": "${ANTHROPIC_API_KEY}",
  "maxTokens": 8192,
  "temperature": 0.3
}
```

配置说明：

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| `provider` | LLM Provider 名称 | `anthropic`、`openai`、`deepseek` |
| `model` | 模型标识 | `claude-sonnet-4-20250514` |
| `apiKey` | API 密钥，支持 `${VAR}` 引用环境变量 | `"${ANTHROPIC_API_KEY}"` |
| `maxTokens` | 单次响应最大 Token 数 | `8192` |
| `temperature` | 生成随机性，推荐 0.1-0.5 | `0.3` |

::: tip Provider 切换
pi-coding-agent 支持在对话中动态切换 Provider，不需要重启。你可以先用便宜的模型做探索，再切换到更强的模型做关键决策——全程同一个会话，上下文不会丢失。
:::

---

## 核心功能演示

pi-coding-agent 的全部能力建立在四个原子工具之上：`read`、`write`、`edit`、`bash`。接下来通过三个实操案例，带你感受 Agent 的实际工作方式。

### 示例 1：read 工具 — 读取并理解代码

**目标**：让 Agent 读取一个源文件，分析其中的问题。

```bash
pi "读取 src/utils.ts，告诉我 formatDate 函数的实现有什么问题"
```

**Agent 的思考与执行过程**：

```
> 分析用户需求：需要读取 src/utils.ts 并分析 formatDate 函数
> 调用 read 工具读取文件内容
  [read] src/utils.ts
> 获得 47 行代码，定位到 formatDate 函数（第 12-35 行）
> 分析代码逻辑...
```

**Agent 输出**：

```
分析 `src/utils.ts` 中的 `formatDate` 函数：

1. **时区问题**：使用了 `new Date().toLocaleDateString()`，没有指定
   时区，在不同地区的服务器上会返回不同的结果
2. **缺少空值检查**：传入 `null` 或 `undefined` 时会抛出异常
3. **硬编码了中文格式**：`year年month月day日` 的格式不利于国际化

建议修复方案：
- 使用 dayjs 或 date-fns 等成熟的日期库
- 增加入参的空值检查
- 将格式字符串参数化，支持多语言
```

在这个过程中，Agent 自动选择了 `read` 工具来获取文件内容，然后基于读取到的代码进行分析和回答。

### 示例 2：edit 工具 — 精确修改代码

**目标**：让 Agent 修复上面发现的问题。

```bash
pi "修复 src/utils.ts 中 formatDate 函数的时区问题和空值检查问题"
```

**Agent 的思考与执行过程**：

```
> 理解用户需求：修复 formatDate 函数的时区和空值检查
> 先调用 read 工具读取当前文件内容
  [read] src/utils.ts
> 定位到需要修改的代码段
> 调用 edit 工具进行精确替换
  [edit] src/utils.ts
  - 旧内容: function formatDate(date) {
  + 新内容: function formatDate(date, timezone = 'UTC') {
> 继续修复空值检查
  [edit] src/utils.ts
  - 旧内容:   const d = new Date(date);
  + 新内容:   if (!date) return '';
    const d = new Date(date);
```

**Agent 输出**：

```
已完成修复，改动如下：

1. 增加了 timezone 参数，默认值 'UTC'，解决了时区不一致问题
2. 增加了空值检查，传入 null/undefined 时返回空字符串
3. 使用了 dayjs 的 timezone 插件处理时区转换

共修改 1 个文件，3 处变更。你可以用 `git diff` 查看详细差异。
```

`edit` 工具的核心能力是**精确字符串替换**——Agent 不是重写整个文件，而是只修改需要变更的部分。这种方式更安全，变更范围可控。

### 示例 3：bash 工具 — 执行命令链

**目标**：让 Agent 完成一个完整的工作流——运行测试、检查覆盖率、修复失败的测试。

```bash
pi "运行所有测试，如果有失败的测试就修复它们，最后确保全部通过"
```

**Agent 的思考与执行过程**：

```
> 分析用户需求：运行测试 → 检查结果 → 修复失败 → 再次验证
> 调用 bash 工具运行测试
  [bash] npm test
> 测试结果：42 passed, 3 failed
> 分析失败原因：
  - test_auth.py: token 过期未正确处理
  - test_utils.py: 时区相关断言失败
  - test_api.py: API 响应格式变更
> 逐一修复
  [read] src/auth.ts → [edit] src/auth.ts     # 修复 token 过期逻辑
  [read] src/utils.ts → [edit] src/utils.ts   # 修复时区处理
  [read] src/api.ts → [edit] src/api.ts       # 修复 API 响应格式
> 再次运行测试验证
  [bash] npm test
> 测试结果：45 passed, 0 failed ✓
```

**Agent 输出**：

```
全部测试已通过！修复过程：

1. `src/auth.ts`：增加 token 过期检查，在过期时自动刷新
2. `src/utils.ts`：统一使用 UTC 时区进行日期比较
3. `src/api.ts`：更新响应格式以匹配新的 API 规范

测试结果：45 passed, 0 failed
覆盖率：87.3%（行覆盖）
```

这个例子展示了 `bash` 工具的威力——pi-coding-agent 不需要专门的"运行测试"工具，直接用 `npm test` 就行。Bash 就是终极工具。

---

## 扩展开发

pi-coding-agent 提供四层扩展体系，本节从第 1 层到第 3 层逐步带你完成实际开发。

### Prompt Template 创建

Prompt Template 是最轻量的扩展方式，一个 Markdown 文件就能搞定。

#### 创建模板文件

```bash
mkdir -p ~/.pi/agent/prompts
```

创建模板文件 `~/.pi/agent/prompts/review.md`：

```markdown
<!-- ~/.pi/agent/prompts/review.md -->
Review this code for bugs, security issues, and performance problems.
Focus on: {{focus}}

Code to review:
{{code}}
```

模板中使用 `{{变量名}}` 语法声明占位符，调用时通过参数传入。

#### 调用模板

```bash
pi /review focus=security code="src/auth.ts"
```

pi-coding-agent 会将 `/review` 匹配到对应的模板文件，把 `focus=security` 替换到 `{{focus}}` 位置，然后读取 `src/auth.ts` 的内容替换 `{{code}}`，最终生成完整的提示词发给 LLM。

::: tip
Prompt Template 适合把高频使用的提示词固化下来。比如代码审查、文档生成、Bug 分析等重复性任务，都可以做成模板，避免每次手写长提示词。
:::

### Skill 开发

Skill 是基于 Markdown 的指令扩展，比 Prompt Template 更结构化。每个 Skill 是一个独立目录，核心文件是 `SKILL.md`。

#### 创建 Skill 目录

```bash
mkdir -p ~/.pi/agent/skills/git-workflow
```

创建 `~/.pi/agent/skills/git-workflow/SKILL.md`：

```markdown
<!-- ~/.pi/agent/skills/git-workflow/SKILL.md -->
# Git Workflow Skill

Use this skill when the user asks to commit code, create a PR, or manage git branches.

## Steps

1. Run `git status` to see changed files
2. Run `git diff` to review all changes
3. Summarize the changes in a clear commit message
4. Stage the relevant files with `git add`
5. Create the commit with the generated message
6. If the user asks for a PR, push the branch and create it

## Rules

- Always review changes before committing
- Generate commit messages in conventional commits format
- Never commit files in .gitignore or sensitive files like .env
- Ask the user to confirm if unsure about which files to stage
```

#### Skill 工作原理

Skill 不需要注册或声明——pi-coding-agent 会自动扫描 `~/.pi/agent/skills/` 目录。当你的指令匹配到某个 Skill 的触发条件时，Agent 会自动加载对应的 `SKILL.md`，将其中定义的 Steps 和 Rules 注入到上下文中。

也就是说，下次你直接说 "帮我提交代码" 或 "创建一个 PR"，Agent 就会按照 Skill 中定义的流程来执行。

### Extension 开发

Extension 是最强大的扩展方式，用 TypeScript 编写，可以注册自定义工具和命令、订阅事件、添加 UI 组件。

#### 创建 Extension 项目

```bash
mkdir pi-deploy-extension && cd pi-deploy-extension
npm init -y
```

编辑 `package.json`，声明 pi 扩展信息：

```json
{
  "name": "pi-deploy-extension",
  "version": "1.0.0",
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["./extensions"]
  }
}
```

#### 编写 Extension 代码

创建 `extensions/index.ts`：

```typescript
// extensions/index.ts
import type { ExtensionAPI } from "@nicepkg/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  // 注册自定义工具：deploy
  pi.registerTool({
    name: "deploy",
    description: "Deploy the project to production",
    parameters: {
      type: "object",
      properties: {
        environment: {
          type: "string",
          description: "Target environment: staging or production",
        },
      },
      required: ["environment"],
    },
    execute: async (args, ctx) => {
      const { environment } = args;

      // 显示确认对话框
      const confirmed = await pi.ui.confirm({
        message: `确认部署到 ${environment} 环境？`,
      });

      if (!confirmed) {
        return "部署已取消";
      }

      // 更新状态栏
      pi.ui.setStatus(`正在部署到 ${environment}...`);

      // 执行部署命令
      const result = await pi.bash(`npm run deploy:${environment}`);

      pi.ui.setStatus("部署完成");
      pi.ui.notify(`成功部署到 ${environment} 环境`);

      return result;
    },
  });

  // 注册自定义命令：stats
  pi.registerCommand("stats", {
    description: "Show project statistics",
    execute: async (args, ctx) => {
      const fileCount = await pi.bash("find . -name '*.ts' | wc -l");
      const lineCount = await pi.bash("find . -name '*.ts' -exec cat {} + | wc -l");
      const todoCount = await pi.bash("grep -r 'TODO' --include='*.ts' . | wc -l");

      return `
项目统计信息：
  TypeScript 文件数：${fileCount.trim()}
  总代码行数：${lineCount.trim()}
  待办事项数：${todoCount.trim()}
      `.trim();
    },
  });

  // 订阅工具调用事件
  pi.on("tool_call", async (event, ctx) => {
    console.log(`[Extension] 工具被调用: ${event.tool}`);
  });
}
```

#### 安装并使用

```bash
# 在项目目录下安装 Extension
npm install /path/to/pi-deploy-extension

# 启动 pi，Extension 会自动加载
pi "部署项目到 staging 环境"
```

Extension 的 UI Protocol 提供了丰富的交互组件：

| UI 组件 | 功能 | 适用场景 |
|---------|------|---------|
| `select` | 下拉选择 | 多个部署目标选择 |
| `confirm` | 确认对话框 | 危险操作前的二次确认 |
| `input` | 文本输入 | 让用户输入参数值 |
| `editor` | 代码编辑器 | 让用户编辑代码片段 |
| `notify` | 通知提示 | 操作完成后的消息提醒 |
| `setStatus` | 状态栏更新 | 显示当前操作进度 |
| `setWidget` | 自定义面板 | 展示复杂信息 |
| `setTitle` | 标题更新 | 动态修改窗口标题 |

### 包分发

Extension 和 Theme 可以通过 npm 发布和分发。在 `package.json` 中通过 `pi` 字段声明扩展资源，pi-coding-agent 会自动发现和加载：

```json
{
  "name": "my-pi-package",
  "version": "1.0.0",
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["./extensions"],
    "skills": ["./skills"],
    "prompts": ["./prompts"],
    "themes": ["./themes"]
  }
}
```

发布到 npm 后，其他用户只需一行命令安装：

```bash
npm install my-pi-package
```

pi-coding-agent 会自动识别 `keywords` 中的 `pi-package` 标记，加载 `pi` 字段中声明的所有扩展资源。

---

## 主题定制

pi-coding-agent 内置多套终端 UI 主题，同时支持自定义配色。

### 内置主题

| 主题名 | 风格 | 适用场景 |
|--------|------|---------|
| **default** | 深色底 + 亮色高亮 | 日常使用 |
| **light** | 浅色底 + 深色文字 | 浅色终端 |
| **monokai** | 经典 Monokai 配色 | 代码编辑偏好 |
| **solarized** | Solarized Dark | 护眼场景 |

切换主题：

```bash
pi config set theme monokai
```

### 自定义配色

在 `~/.pi/agent/themes/` 目录下创建自定义主题文件：

```json
// ~/.pi/agent/themes/my-theme.json
{
  "name": "my-theme",
  "colors": {
    "primary": "#61AFEF",
    "secondary": "#C678DD",
    "success": "#98C379",
    "warning": "#E5C07B",
    "error": "#E06C75",
    "background": "#282C34",
    "foreground": "#ABB2BF",
    "accent": "#56B6C2"
  }
}
```

应用自定义主题：

```bash
pi config set theme my-theme
```

::: tip
主题配置会立即生效，不需要重启 pi-coding-agent。你也可以通过 Extension 动态切换主题——比如根据时间自动在深色和浅色之间切换。
:::

---

## SDK 集成

pi-coding-agent 提供完整的 TypeScript SDK，可以将 Agent 能力嵌入到任何 Node.js 应用中。这是区别于其他编码 Agent 的核心优势之一。

### 基本用法

```typescript
import {
  AuthStorage,
  createAgentSession,
  ModelRegistry,
  SessionManager,
} from "@nicepkg/pi-coding-agent";

// 1. 创建认证存储（管理 API Key）
const authStorage = AuthStorage.create();

// 2. 创建模型注册表（管理 Provider 和模型信息）
const modelRegistry = ModelRegistry.create(authStorage);

// 3. 创建 Agent 会话
const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage,
  modelRegistry,
});

// 4. 发送提示并获取结果
const result = await session.prompt("当前目录下有哪些文件？");
console.log(result);
```

### API 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `sessionManager` | SessionManager | 会话管理器，控制会话的生命周期和持久化方式 |
| `authStorage` | AuthStorage | API Key 存储管理器，支持环境变量和文件存储 |
| `modelRegistry` | ModelRegistry | 模型注册表，管理可用的 Provider 和模型列表 |

`createAgentSession()` 返回的对象包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `session` | AgentSession | Agent 会话实例，提供 `prompt()` 方法 |
| `sessionId` | string | 会话唯一标识 |
| `state` | AgentState | 当前 Agent 状态 |

### 高级用法

#### 流式响应

```typescript
const stream = session.promptStream("分析这个项目的架构");

for await (const event of stream) {
  switch (event.type) {
    case "thinking":
      console.log(`[思考] ${event.content}`);
      break;
    case "tool_call":
      console.log(`[工具] 调用 ${event.tool}`);
      break;
    case "tool_result":
      console.log(`[结果] ${event.output.substring(0, 100)}...`);
      break;
    case "text":
      process.stdout.write(event.content);
      break;
  }
}
```

#### 多会话管理

```typescript
// 创建多个独立会话
const { session: sessionA } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage,
  modelRegistry,
});

const { session: sessionB } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage,
  modelRegistry,
});

// 并行处理不同任务
const [resultA, resultB] = await Promise.all([
  sessionA.prompt("分析 src/auth.ts 的安全性"),
  sessionB.prompt("为 src/utils.ts 编写单元测试"),
]);
```

#### 自定义工具注入

通过 SDK 可以向 Agent 注入自定义工具，扩展其能力边界：

```typescript
const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage,
  modelRegistry,
  tools: [
    {
      name: "query_database",
      description: "查询数据库",
      parameters: {
        type: "object",
        properties: {
          sql: { type: "string", description: "SQL 查询语句" },
        },
        required: ["sql"],
      },
      execute: async (args) => {
        // 你的数据库查询逻辑
        const results = await db.query(args.sql);
        return JSON.stringify(results);
      },
    },
  ],
});

// Agent 现在可以使用 query_database 工具了
const result = await session.prompt("查询活跃用户数量最多的前 5 个城市");
```

### RPC 模式（Python 集成）

如果你需要在 Python 项目中使用 pi-coding-agent，可以通过 RPC 模式。pi-coding-agent 使用 stdin/stdout 的 JSONL 协议通信，任何语言都能对接：

```python
import subprocess
import json

# 启动 RPC 模式
proc = subprocess.Popen(
    ["pi", "--rpc"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# 发送命令
request = {
    "id": "1",
    "command": "prompt",
    "args": {"text": "帮我检查这个项目的依赖是否有安全漏洞"}
}
proc.stdin.write(json.dumps(request) + "\n")
proc.stdin.flush()

# 读取事件流
for line in proc.stdout:
    event = json.loads(line)
    print(f"[{event.get('type', 'unknown')}] {event.get('content', '')}")

    # 收到完成事件时退出
    if event.get("type") == "complete":
        break

proc.terminate()
```

RPC 模式的命令集：

| 命令 | 说明 |
|------|------|
| `prompt` | 发送新提示 |
| `steer` | 调整 Agent 方向（纠正偏差） |
| `follow_up` | 追加后续指令 |
| `abort` | 中止当前任务 |
| `new_session` | 创建新会话 |
| `get_state` | 获取当前 Agent 状态 |

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| **API Key 无效** | 环境变量未正确设置或配置路径错误 | 检查 `echo $ANTHROPIC_API_KEY` 是否输出正确值；确认 `~/.pi/config.json` 中的 `${VAR}` 引用与环境变量名一致 |
| **工具调用失败** | 文件权限不足或路径不存在 | 使用 `ls -la` 检查目标文件权限；确保 pi 在正确的项目目录下运行 |
| **上下文溢出** | 对话历史过长，超出模型上下文窗口 | 输入 `/compact` 手动压缩上下文；或开启新会话 |
| **LLM 响应慢** | 网络延迟或 Provider 负载高 | 尝试切换到更快的 Provider（如 Groq、Cerebras）；检查网络代理配置 |
| **安装失败** | Node.js 版本不匹配 | 确认 Node.js 版本 ≥ 20：`node --version`；推荐使用 `nvm` 管理多版本 |
| **Extension 加载失败** | `package.json` 缺少 `pi-package` 关键字或路径错误 | 确认 `keywords` 包含 `"pi-package"`；检查 `pi.extensions` 路径是否正确 |
| **中文输出乱码** | 终端编码不支持 UTF-8 | 设置 `export LANG=en_US.UTF-8` 或 `export LC_ALL=en_US.UTF-8` |
| **Docker 中无法使用** | 容器内缺少必要工具 | 在 Dockerfile 中安装 git、node 等基础工具 |

---

## 思考题

::: info 检验你的理解
- [ ] 能独立完成 pi-coding-agent 的安装、API Key 配置和首次启动
- [ ] 理解四个原子工具（read / write / edit / bash）各自的使用场景
- [ ] 能创建自定义 Prompt Template 并通过 `/模板名` 调用
- [ ] 能编写 Skill（SKILL.md）和 Extension（TypeScript），将自定义能力注入 Agent
- [ ] 会使用 TypeScript SDK 的 `createAgentSession()` 进行编程集成
- [ ] 理解 RPC 模式的 JSONL 通信协议，能用 Python 等语言对接
:::

---

## 本节小结

通过本节学习，你应该掌握了：

✅ **环境准备**
- 软件依赖：Node.js 20+、npm、Git（Docker 可选）
- LLM API Key 通过环境变量管理
- 配置文件目录结构（`~/.pi/`）

✅ **安装与启动**
- 全局安装：`npm install -g @nicepkg/pi-coding-agent`
- 免安装运行：`npx @nicepkg/pi-coding-agent`
- 首次启动的 Provider 选择和 API Key 配置

✅ **核心功能**
- read 工具：读取文件内容，理解代码结构
- edit 工具：精确字符串替换，安全可控地修改代码
- bash 工具：执行任意 Shell 命令，覆盖测试、部署、Git 等场景

✅ **扩展开发**
- Prompt Template：Markdown + `{{变量}}`，最轻量的提示词复用
- Skill：SKILL.md 定义触发条件和执行步骤
- Extension：TypeScript 编写，注册工具/命令、订阅事件、添加 UI 组件
- 包分发：npm 发布，`pi-package` 关键字自动发现

✅ **主题定制**
- 内置主题切换
- 自定义 JSON 配色方案

✅ **SDK 集成**
- TypeScript SDK：`createAgentSession()` 基本用法
- 流式响应、多会话管理、自定义工具注入
- RPC 模式：Python 等非 Node.js 环境的 JSONL 协议对接

---

## 延伸阅读

- [pi-mono GitHub 仓库](https://github.com/badlogic/pi-mono)
- [pi-coding-agent 官方文档](https://pi-agent.dev)
- [pi-coding-agent 概述](/agent-ecosystem/07-agent-ecosystem/14-pi-coding-agent-overview)
- [Terminal-Bench 2.0 排行榜](https://www.kontrol.dev/terminal-bench)
- [Agent 编排模式](/agent-ecosystem/07-agent-ecosystem/06-orchestration)
- [Claude Code 设计解析](/agent-ecosystem/07-agent-ecosystem/09-claude-design)
- [DeerFlow 实战部署](/agent-ecosystem/07-agent-ecosystem/13-deerflow-deploy)

---

[← pi-coding-agent 概述](/agent-ecosystem/07-agent-ecosystem/14-pi-coding-agent-overview) | [返回模块目录](/agent-ecosystem/07-agent-ecosystem)
