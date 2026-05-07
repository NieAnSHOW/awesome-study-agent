# Claude Code

> **学习目标**：掌握 Claude Code 2.1 的完整能力，从基础使用到高级自定义
> **预计时间**：60 分钟
> **难度**：⭐⭐⭐

---

## 一句话结论

Claude Code 是终端里的 AI 程序员。51 万行代码、零向量数据库、grep 打败了 RAG。它的哲学很简单：**简洁即力量**。没有花哨的 UI，不是 IDE，就是一个命令行工具。但工程能力碾压所有图形界面工具。不是给你看代码的，是帮你改代码的。

## Claude Code 是什么

Anthropic 官方出的 AI 编程助手，跑在终端里。不是网页聊天，是直接在你的项目目录里干活。

**核心特点：**
- 命令行工具（CLI），在终端运行
- 同时提供 VS Code 原生扩展
- 能读、写、编辑你项目里的文件
- 理解整个代码库，不只是单个文件
- 支持 Git 集成
- 可扩展：MCP 服务器、Skills 系统、Hooks、自定义命令

**跟 Cursor 的区别：**
Cursor 是 IDE，Claude Code 是终端工具。花叔的标准组合：两个都装，在 Cursor 的终端里跑 Claude Code。Cursor 做手，Claude Code 做脑。

Cursor 负责：写代码、改代码、补全
Claude Code 负责：架构分析、大规模重构、批量操作、自动化

## 安装和配置

### 安装（原生 CLI 二进制）

Claude Code 2.1 提供原生二进制安装，不再依赖 Node.js：

```bash
# macOS / Linux — 推荐方式
curl -fsSL https://claude.ai/install.sh | sh

# 或者通过 npm（传统方式）
npm install -g @anthropic-ai/claude-code
```

原生二进制的优势：不依赖 Node.js 版本，启动更快，占用更少内存。

### 认证

**方法一：浏览器登录（推荐）**

有 Claude Pro 或 Max 订阅的话，直接浏览器登录，不用管 API key：

```bash
claude
# 首次运行会提示在浏览器登录
```

**方法二：API Key**

```bash
# 去 console.anthropic.com 拿 API key
export ANTHROPIC_API_KEY="your-api-key-here"
# 加到 ~/.zshrc 或 ~/.bashrc 让它永久生效
```

### 验证

```bash
claude --version
```

## 基本使用

### 启动方式

```bash
# 交互模式 — 跟 AI 结对编程
claude

# 带初始问题启动
claude "解释这个项目的结构"

# 查询一次就退出（pipe 模式）
claude -p "这个函数有什么问题？"

# 继续上次对话
claude -c

# 恢复指定会话
claude -r "session-id" "继续刚才的任务"
```

### 交互模式

进入交互模式后，你就像跟一个结对程序员聊天：

```
你: 帮我重构这个函数

Claude: [读取文件] 这个函数主要问题：
1. 嵌套太深
2. 变量命名不清晰
3. 缺少错误处理

我可以这样改... [展示方案]

要应用这些修改吗？ (y/n)
```

**关键：Claude Code 可以直接读写文件，不需要复制粘贴。** 这是它跟网页版 Claude 的核心区别。

## 核心功能

### 1. 文件操作

```bash
# 读取文件
"解释 @./src/utils/api.ts 这个文件"

# 编辑文件
"重构 @./src/components/Header.tsx ：
1. 抽取重复逻辑到自定义 hook
2. 改善错误处理
3. 添加 TypeScript 类型"

# 创建多个文件
"创建用户认证模块：src/auth/login.ts、src/auth/logout.ts、src/auth/types.ts"
```

### 2. Git 集成

```bash
"查看 git diff，生成提交信息"
"基于当前分支创建 pull request 描述"
"审查这个 PR 的改动"
```

Claude Code 能读懂 git 历史，理解项目演进。花叔常用的一个命令：`claude "查看最近的 git log，告诉我项目最近在做什么"`。

### 3. 终端命令

用 `!` 执行 shell 命令：

```bash
!npm test           # 单个命令
!#                  # 进入 shell 模式
```

Claude Code 可以自己跑命令、看结果、分析问题、修 bug。这是它比网页聊天强的地方——**它不是只给建议，它能操作你的系统。**

### 4. 斜杠命令

```bash
/help          # 显示所有命令
/config        # 配置设置
/allowed-tools # 配置工具权限
/hooks         # 配置自动化钩子
/mcp           # 管理 MCP 服务器
/agents        # 管理子代理
/model         # 切换 AI 模型
/vim           # 开启 vim 编辑模式
```

## CLAUDE.md — 项目指令

CLAUDE.md 是 Claude Code 最强大的功能之一。它让 AI 理解你的项目上下文，不用每次重复说明。

**不是写文档，是给 AI 画圈。**

### 三层结构

1. `~/.claude/CLAUDE.md` — 全局（你的编程偏好）
2. `./CLAUDE.md` — 项目根目录（项目规范）
3. `子目录/CLAUDE.md` — 特定目录（模块规范）

### 示例

```markdown
# 项目上下文

## 技术栈
- 前端：Next.js + TypeScript
- 后端：Node.js + Express
- 数据库：PostgreSQL + Prisma

## 编码规范
- 用 TypeScript 严格模式
- 组件用函数式 + Hooks
- API 调用必须处理错误
- 所有新功能写测试

## 文件结构
- src/components/ — React 组件
- src/utils/ — 工具函数
- src/api/ — API 调用
```

花叔的核心理论：**51 万行代码，零向量数据库，grep 打败了 RAG。** 不是因为它用了什么黑科技，而是因为 CLAUDE.md + grep + 上下文缓存的组合已经足够了。

CLAUDE.md 就是给 AI 画的圈——你告诉它你的项目是什么样，它就知道怎么干活。

## 高级功能

### Hooks 系统

Hooks 在特定事件自动执行命令，实现自动化工作流。

**不是手动配置，是自动纠偏。**

**示例：写完 TypeScript 代码自动格式化**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.{ts,tsx})",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $file && npx eslint --fix $file"
          }
        ]
      }
    ]
  }
}
```

**可用事件：**
- `PreToolUse` — 工具执行前
- `PostToolUse` — 工具执行后
- `UserPromptSubmit` — 用户提交提示前
- `SessionStart` — 会话开始时

花叔的配置：PostToolUse + Write 事件，自动格式化 + 跑 eslint。**每次改完代码不用手动格式化，省了至少 30% 的重复操作。**

### Skills 系统

Skills 是自然语言触发的自定义技能。

**不是插件，是 AI 的肌肉记忆。**

**创建 Skill：**

```bash
mkdir -p .claude/skills/add-test-coverage
```

在目录里创建 `SKILL.md`：

```markdown
---
name: add-test-coverage
description: 为函数添加单元测试
---

# 添加测试覆盖

1. 分析目标函数的输入输出
2. 识别边界情况和错误场景
3. 使用项目的测试框架（Jest/Vitest）
4. 确保测试覆盖率 > 80%
5. 运行测试验证
```

Claude Code 会自动识别何时使用这个技能。花叔的经验：每个项目配 3-5 个常见操作的 Skills，效率提升 40%。

### /loop 命令

`/loop` 命令让 Claude Code 自动循环执行任务，直到达到目标。

**不是跑一次，是跑到满意为止。**

```bash
/loop "修复所有 TypeScript 编译错误"
```

Claude Code 会：检查错误 → 修复 → 重新检查 → 修复 → 直到没有错误。

花叔实际使用场景：
- `/loop "给所有没有测试的函数加单元测试"`
- `/loop "把 console.log 全部替换为 logger 调用"`
- `/loop "把所有 any 类型改为具体类型"`

在批量修复、测试覆盖率提升、代码迁移等场景，**/loop 让 AI 从帮你干活变成替你干活。**

### Git Worktree 并行会话

Claude Code 2.1 支持 Git Worktree，让你在同一个项目里并行跑多个 Claude Code 会话。

**不是串行排队，是并行开发。**

```bash
# 创建 worktree
git worktree add ../feature-a feature-branch-a

# 在不同终端启动不同会话
cd ../feature-a && claude "实现功能 A"
cd ../main-project && claude "修复 bug B"
```

**效果：** 两个 Claude Code 实例同时在不同的 worktree 里工作，互不干扰。时间减半。

花叔评价：这才是真正的并行开发。以前你只能在一个分支上干活，现在 AI 帮你同时推进多个 feature。

### MCP 服务器

MCP（Model Context Protocol）扩展 Claude Code 的能力。

**不是封闭系统，是开放的连接器。**

```bash
# 添加 MCP 服务器
claude mcp add my-server -e API_KEY=123 -- /path/to/server arg1 arg2
```

MCP 工具采用**延迟加载**——只在需要时才连接，减少启动开销。

**常见用途：**
- 连接数据库直接查询
- 集成 Jira/线性管理
- 访问 Google Drive 文档
- 自定义构建工具
- 代码审查自动化

### VS Code 扩展

Claude Code 提供原生 VS Code 扩展：

1. 安装 Claude Code VS Code 扩展
2. 用 `Cmd+Esc`（macOS）或 `Ctrl+Esc`（Windows）打开面板
3. Claude 可以看到你打开的文件、光标位置
4. 支持 `/ide` 命令让 Claude 诊断当前文件的 LSP 错误

花叔用法：在 Cursor 里也用这个扩展。VS Code 扩展 = Claude Code 的图形界面入口。

## 定价

Claude Code 本身免费开源，但需要 Claude 订阅或 API 配额。

| 计划 | 月费 | 默认模型 | 适合谁 |
|------|------|---------|--------|
| Pro | $20/月 | Sonnet 4.6 | 日常开发，每天 1-2 小时 |
| Max 5x | $100/月 | Opus 4.6 | 重度用户，每天多个长会话 |
| Max 20x | $200/月 | Opus 4.6 | 全天候使用，Agent Teams |
| API 按量 | 用多少付多少 | 自选 | 自动化、灵活用量 |

::: info 省钱关键
缓存是关键。实测 170 轮 Opus 会话，缓存命中率 98.2%，实际花费 $21 而非 $168——省了 88%。保持会话不断，缓存持续命中。花叔的建议：**不要频繁开新会话，持续用一个会话更省钱。**
:::

## Claude Code vs Cursor

| 对比维度 | Claude Code | Cursor |
|---------|------------|--------|
| 类型 | 终端 CLI + VS Code 扩展 | 完整 IDE |
| 核心优势 | 工程化、自动化、可编程 | 集成度、图形界面、补全 |
| 学习曲线 | 中（要习惯命令行） | 低（像 VS Code） |
| 扩展性 | Hooks/Skills/MCP 高度可定制 | 兼容 VS Code 插件 |
| 定价 | 免费 + API/订阅 | $20/月起，信用额制度 |
| 最佳场景 | 架构、重构、批量操作 | 日常编码、原型开发 |

**花叔的最佳用法：Cursor 做手，Claude Code 做脑。** 在 Cursor 里打开终端，跑 Claude Code，两个一起用。

## 常见问题

**Q: 代码会发给 Anthropic 吗？**
A: 会。代码发送到 Anthropic 的 API 处理。隐私政策声明不会用客户代码训练模型。

**Q: 跟 Cursor 选哪个？**
A: 不是二选一。要图形界面、深度集成 → Cursor。要轻量、工程化 → Claude Code。预算充足 → 两个都用。

**Q: CLI 工具难学吗？**
A: 基本使用 5 分钟上手。进阶功能（Hooks、Skills、MCP）需要 1-2 周实践。

**Q: 51 万行代码是真的吗？**
A: Claude Code 团队自己用 Claude Code 做的统计——grep + CLAUDE.md 搞定，没有向量数据库。

---

## 本节小结

- Claude Code 是终端里的 AI 程序员，工程能力极强
- CLAUDE.md 是灵魂——给 AI 画圈比选模型重要 10 倍
- Hooks/Skills/MCP 三板斧实现高度自定义
- /loop 命令 + Git Worktree = 并行自动化
- "51 万行代码，grep 打败了 RAG"——简洁即力量
- 花叔组合：Cursor 做手 + Claude Code 做脑

---

[← 返回章节目录](/agent-ecosystem/06-ai-coding-tools) | [继续学习：Windsurf 与 Antigravity →](/agent-ecosystem/06-ai-coding-tools/03-other-tools)
