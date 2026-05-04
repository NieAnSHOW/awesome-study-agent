# Claude Code

## Claude Code 是什么

Claude Code 是 Anthropic 官方出的 AI 编程助手，跑在终端里。不是网页版 ChatGPT，是直接在你的开发环境里工作。

**主要特点：**
- 命令行工具（CLI），在终端运行
- 同时提供 VS Code 原生扩展，可以在编辑器内直接使用
- 能读、写、编辑你项目里的文件
- 理解整个代码库，不只是单个文件
- 支持 Git 集成
- 可扩展（MCP 服务器、Skills 系统、自定义命令）

跟 Cursor 不一样：Cursor 是完整 IDE，Claude Code 是终端工具+编辑器扩展。你可以跟 VS Code、Cursor 这些编辑器一起用。

## 安装和配置

### 安装

```bash
npm install -g @anthropic-ai/claude-code
```

需要 Node.js 18 或更高版本。

### 认证

**方法一：API Key**

1. 去 [Anthropic Console](https://console.anthropic.com) 拿 API key
2. 设置环境变量：

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

加到 `~/.bashrc` 或 `~/.zshrc` 让它永久生效。

**方法二：浏览器登录（推荐）**

有 Claude Pro 或 Max 订阅的话，可以直接用浏览器登录，不用管 API key。

### 验证安装

```bash
claude --version
```

能显示版本号就说明装好了。

## 基本使用

### 启动

```bash
# 启动交互模式
claude

# 带初始问题启动
claude "解释这个项目的结构"

# 查询一次就退出
claude -p "这个函数有什么问题？"

# 继续上次对话
claude -c

# 恢复指定会话
claude -r "session-id" "继续刚才的任务"
```

### 交互模式

进入交互模式后，你就像跟一个结对程序员聊天：

```
你: 帮我重构这个函数，让它更易读

Claude: 我来看一下... [读取文件]

Claude: 这个函数主要问题有：
1. 嵌套太深
2. 变量命名不清晰
3. 缺少错误处理

我可以这样改... [展示修改方案]

要应用这些修改吗？ (y/n)
```

Claude Code 可以直接读写文件，不需要你复制粘贴。

## 核心功能

### 1. 文件操作

**读取文件：**

```
解释 @./src/utils/api.ts 这个文件
```

**编辑文件：**

```
重构 @./src/components/Header.tsx ：
1. 抽取重复逻辑到自定义 hook
2. 改善错误处理
3. 添加 TypeScript 类型
```

**创建文件：**

```
创建一个用户认证模块：
- src/auth/login.ts
- src/auth/logout.ts
- src/auth/types.ts
```

### 2. Git 集成

```bash
# 查看改动
"查看 git diff，生成提交信息"

# 创建 PR
"基于当前分支创建 pull request 描述"

# 代码审查
"审查这个 PR 的改动"
```

Claude Code 能读懂 git 历史，理解项目演进。

### 3. 终端命令

用 `!` 执行 shell 命令：

```bash
# 单个命令
!npm test

# 进入 shell 模式
!#
# 现在可以直接执行命令
npm run build
npm run test
exit  # 退出 shell 模式
```

**实用场景：**

```
你: 运行测试，看看有没有失败

Claude: [执行 npm test]

有3个测试失败了。让我看看问题在哪... [分析错误]
```

Claude Code 可以自己跑命令、看结果、分析问题、修 bug。

### 4. 上下文管理

**引用文件：**

```
@./src/components/Button.tsx 这个按钮怎么实现无障碍？
```

**引用目录：**

```
@./src/api/ 这些 API 端点加认证
```

**引用多个文件：**

```
对比这两个实现：
@./src/old/utils.js
@./src/new/utils.ts
```

**Glob 模式：**

```
检查 @./src/**/*.test.ts 覆盖率够不够
```

### 5. 斜杠命令

内置命令，快速完成常见任务：

```bash
/help          # 显示所有命令
/config        # 配置设置
/allowed-tools # 配置工具权限
/hooks         # 配置自动化钩子
/mcp           # 管理 MCP 服务器
/agents        # 管理子代理
/vim           # 开启 vim 编辑模式
/model         # 切换 AI 模型
```

## 配置文件

### 设置层级

Claude Code 用三个层级的设置文件：

1. **全局设置**：`~/.claude/settings.json`
   - 影响所有项目

2. **项目设置**：`.claude/settings.json`
   - 影响当前项目，可以提交到 git

3. **本地设置**：`.claude/settings.local.json`
   - 个人配置，不提交到 git

### 示例配置

```json
{
  "model": "claude-sonnet-4-6",
  "maxTokens": 4096,
  "permissions": {
    "allowedTools": [
      "Read",
      "Write",
      "Bash(git *)",
      "Bash(npm test)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Write(./production.config.*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [
          {
            "type": "command",
            "command": "python -m black $file"
          }
        ]
      }
    ]
  }
}
```

**说明：**
- `model`：默认模型
- `permissions.allowedTools`：允许的工具
- `permissions.deny`：禁止操作敏感文件
- `hooks`：自动化操作（这里写 Python 文件后自动格式化）

### CLAUDE.md 文件

给 Claude Code 提供项目上下文。

**层级：**
1. `~/.claude/CLAUDE.md` - 全局
2. `./CLAUDE.md` - 项目根目录
3. `子目录/CLAUDE.md` - 特定目录

**示例：**

```markdown
# 项目上下文

## 技术栈
- 前端：Next.js + TypeScript
- 后端：Node.js + Express
- 数据库：PostgreSQL + Prisma
- 状态：Zustand

## 编码规范
- 用 TypeScript 严格模式
- 组件用函数式 + Hooks
- API 调用必须处理错误
- 所有新功能写测试

## 文件结构
- src/components/ - React 组件
- src/utils/ - 工具函数
- src/api/ - API 调用
- tests/ - 测试文件
```

这样 Claude Code 就知道怎么写符合你项目风格的代码。

## 高级功能

### 自定义命令

在 `.claude/commands/` 创建命令文件。

**简单命令：**

```markdown
<!-- .claude/commands/review.md -->
审查这段代码的安全漏洞：
```

使用：`/review`

**带参数的命令：**

```markdown
<!-- .claude/commands/fix.md -->
修复 issue #$ARGUMENTS，遵循项目编码规范
```

使用：`/fix 123`

**复杂命令（带上下文）：**

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: 创建 git 提交
---

## 上下文
- 当前状态：!`git status`
- 改动：!`git diff HEAD`
- 分支：!`git branch --show-current`

基于以上改动生成有意义的提交信息。
```

### Hooks（自动化）

在特定事件自动执行命令。

**示例：写完 Python 代码自动格式化**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [
          {
            "type": "command",
            "command": "python -m black $file"
          }
        ]
      }
    ]
  }
}
```

**可用事件：**
- `PreToolUse` - 工具执行前
- `PostToolUse` - 工具执行后
- `UserPromptSubmit` - 用户提交提示前
- `SessionStart` - 会话开始时

### MCP 服务器

扩展 Claude Code 的能力。MCP 工具采用**延迟加载**——只在需要时才连接和加载工具定义，减少启动开销。

**添加 MCP 服务器：**

```bash
claude mcp add my-server -e API_KEY=123 -- /path/to/server arg1 arg2
```

**常见用途：**
- 连接 Google Drive 看设计文档
- 集成 Jira 管理任务
- 访问外部数据库
- 添加自定义开发工具

### Skills（技能）

类似自定义命令，但用自然语言触发。

**创建技能：**

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

当用户要求添加测试时：

1. 分析目标函数的输入输出
2. 识别边界情况和错误场景
3. 使用项目的测试框架（Jest/Vitest）
4. 确保测试覆盖率 > 80%
5. 运行测试验证

示例：
用户："给 utils.ts 添加测试"
→ 创建 utils.test.ts 并编写完整测试
```

Claude Code 会自动识别何时使用这个技能。

### Subagents（子代理）

专门的 Claude 实例，处理特定领域任务。

**使用场景：**
- 代码审查专家
- 测试工程师
- 文档写手
- 性能优化顾问

**创建子代理：**

```bash
/agents create code-reviewer
```

然后定义它的角色和任务。

### Checkpointing（检查点）

Claude Code 自动为你创建会话检查点。你可以随时回退到之前的状态：

```bash
# 查看历史检查点
claude checkpoint list

# 恢复到某个检查点
claude checkpoint restore <id>
```

这在 Claude 做了大量修改后想撤回时特别有用。

### /batch 命令

批量执行多个独立任务，适合大规模代码变更：

```bash
/batch "给所有 API 路由添加认证中间件"
```

Claude Code 会：
1. 扫描项目中所有 API 路由
2. 并行处理多个文件修改
3. 统一展示变更结果

### 跨应用上下文

Claude Code 可以读取你在 Claude.ai 上的对话历史（需授权）。这意味着：
- 在 claude.ai 上讨论的设计方案，到 Claude Code 里直接实现
- 无需重复描述项目背景

## 实用技巧

### 1. 模型选择

| 模型 | 用途 | 特点 |
|------|------|------|
| Sonnet 4.6 | 默认选择 | 平衡速度和质量 |
| Haiku 4.5 | 简单任务 | 快速、便宜 |
| Opus 4.6 | 复杂任务 | 最强推理能力 |

切换模型：

```bash
/model claude-opus-4-6
```

### 2. 节省 token

- 只引用需要的文件
- 用 `.gitignore` 风格排除不相关内容
- CLAUDE.md 提供上下文，减少重复说明
- 用 Haiku 处理简单任务

### 3. 权限管理

**允许特定工具：**

```bash
claude --allowedTools "Write" "Bash(git *)"
```

**禁止危险操作：**

```bash
claude --disallowedTools "Bash(rm *)"
```

**配置文件里设置：**

```json
{
  "permissions": {
    "deny": [
      "Write(./.env)",
      "Write(./production.*)"
    ]
  }
}
```

### 4. 工作流集成

**在 VS Code 中使用（原生扩展）：**

1. 安装 Claude Code VS Code 扩展
2. 用 `Cmd+Esc`（macOS）或 `Ctrl+Esc`（Windows）打开 Claude Code 面板
3. 扩展直接与编辑器集成——Claude 可以看到你打开的文件、光标位置
4. 支持 `/ide` 命令让 Claude 诊断当前文件的 LSP 错误

**在终端中使用：**

1. 在 VS Code 集成终端运行 `claude`
2. Claude Code 跟编辑器同步

**在 Cursor 中使用：**

Claude Code 跟 Cursor 兼容，可以同时用。

## 典型使用场景

### 场景 1：理解新项目

```bash
cd new-project
claude "这个项目是干什么的？技术栈是什么？"
```

Claude Code 会：
- 读取 package.json、README.md
- 分析目录结构
- 总结项目功能和架构

### 场景 2：重构代码

```bash
claude "重构 src/api/user.ts：
1. 抽取重复的错误处理
2. 改善类型定义
3. 添加 JSDoc 注释"
```

Claude Code 会：
- 读取文件
- 分析代码
- 展示重构方案
- 等你确认后应用修改

### 场景 3：写测试

```bash
claude "为 src/utils/validation.ts 写单元测试"
```

Claude Code 会：
- 分析函数逻辑
- 识别边界情况
- 生成测试用例
- 运行测试验证

### 场景 4：调试

```bash
npm test
# 测试失败了

claude "分析测试失败原因并修复"
```

Claude Code 会：
- 读取测试代码
- 执行测试看错误信息
- 找出 bug
- 修复代码
- 重新测试

## 定价

Claude Code 本身免费开源，但需要消耗 Claude API 配额或订阅。没有免费版，至少需要 Pro ($20/月) 订阅或有 API Credits 才能使用。

### 个人订阅计划

| 计划 | 月费 | 默认模型 | 使用额度 | 适合场景 |
|------|------|----------|---------|---------|
| **Pro** | $20/月 ($17/月年付) | Sonnet 4.6 | 标准额度 (~44K tokens/5小时窗口) | 日常开发，每天 1-2 小时使用 |
| **Max 5x** | $100/月 | Opus 4.6 | Pro 的 5 倍 (~88K tokens/5小时窗口) | 重度用户，每天多个长会话 |
| **Max 20x** | $200/月 | Opus 4.6 | Pro 的 20 倍 (~220K tokens/5小时窗口) | 全天候使用，Agent Teams 多实例 |
| **API 按量付费** | 用多少付多少 | 自选 | 无硬性限制（有频率限制） | 自动化、灵活用量、工具构建 |

**额度说明：** 额度按 5 小时滚动窗口计算，不是按月/日计算。超出后不会硬阻断，而是自动按 API 标准费率继续服务（需开启超额使用）。

### 团队与企业计划

| 计划 | 价格 | Claude Code | 默认模型 | 额度 |
|------|------|------------|----------|------|
| **Team Standard** | $25/座/月 ($20 年付) | ❌ 不含 | Sonnet 4.6 | 比 Pro 多 |
| **Team Premium** | $125/座/月 ($100 年付) | ✅ 含 | Opus 4.6 | 5x Standard |
| **Enterprise** | $20/座/月 + API 用量 | ✅ 含预售座 | Opus 可用 | 无限 |

- Team 计划最少 5 个席位，最多 150 席，可混合 Standard/Premium
- Enterprise 提供 500K 上下文窗口、HIPAA 合规、审计日志、SCIM、IP 白名单
- Agent Teams 多实例会成倍消耗额度（3 实例 ≈ 7x 单实例消耗）

### 订阅 vs API：怎么选？

Anthropic 数据显示，普通开发者日均 API 花费约 $6（约 $180/月）。关键分水岭：

| API 月花费 | 推荐方案 |
|-----------|---------|
| < $50 | Pro ($20/月) 更划算 |
| $50-100 | Pro 加超额，或 Max 5x |
| > $100 | Max 5x 几乎必赢 |
| > $500 | Max 20x ($200) 比 API 便宜 18x |

**真实案例：** 某 Reddit 用户埋点统计，满负荷使用 Max 20x 时，API 直连约 $3,650/月，而 Max 订阅仅 $200/月，便宜 18 倍。

### API 按量价格

| 模型 | 输入 (≤200K) | 输入 (>200K) | 输出 (≤200K) | 输出 (>200K) |
|------|-------------|-------------|-------------|-------------|
| Opus 4.6 | $5/百万 token | $10/百万 token | $25/百万 token | $37.50/百万 token |
| Sonnet 4.6 | $3/百万 token | $6/百万 token | $15/百万 token | $22.50/百万 token |
| Haiku 4.5 | $1/百万 token | $5/百万 token | $5/百万 token | — |

**缓存价格：**

| 模型 | Cache 写入 | Cache 读取 |
|------|-----------|-----------|
| Opus 4.6 | $6.25/百万 token | $0.50/百万 token |
| Sonnet 4.6 | $3.75/百万 token | $0.30/百万 token |
| Haiku 4.5 | $1.25/百万 token | $0.10/百万 token |

**省钱要点：**
- **缓存是关键：** 实测 170 轮 Opus 会话，缓存命中率 98.2%，实际花费 $21 而非 $168（节省 88%）
- **Effort 级别：** `/effort medium` 比 `high` 节省 76% 输出 token，效果差别不大
- **Batch API：** 非实时任务用 Batch API 半价（Sonnet $1.50/$7.50 输入/输出）
- **长会话更便宜：** 一次 80 轮对话比四次 20 轮对话更省（缓存持续命中）
- **保持会话不要断：** 超过 5 分钟无消息缓存会过期

### Pro/Max 订阅的好处

- 不用管 API key 刷新和认证
- 浏览器登录更方便
- 优先访问新功能
- 跨应用上下文（claude.ai + Claude Code 联动）
- 费用完全可预测，适合控制预算

### 适合用 API 的场景

- 使用量不稳定或难以预测
- 团队需要集中计费
- 需要精确控制每轮对话成本
- 构建自动化工具或自定义工作流
- 需要选择特定模型（不限于默认模型）

## 跟其他工具对比

### vs Cursor

| Claude Code | Cursor |
|------------|--------|
| 终端工具 + VS Code 扩展 | 完整 IDE |
| 跟任何编辑器配合 | 只在 Cursor 里用 |
| 更轻量 | 功能更集成 |
| 免费开源 | 信用额制度 |

**可以同时用：**
在 Cursor 里打开终端，跑 Claude Code，两个一起用。

### vs GitHub Copilot

| Claude Code | Copilot |
|------------|---------|
| 命令行交互 | 编辑器内补全 |
| 能读写文件 | 主要补全代码 |
| Claude 模型 | OpenAI 模型 |
| 需要订阅/ API | $10/月 |

**互补关系：**
- Copilot：实时补全，像智能 autocomplete
- Claude Code：对话式，像结对程序员

### vs ChatGPT 网页版

| Claude Code | ChatGPT 网页 |
|------------|-------------|
| 直接操作文件 | 复制粘贴 |
| 理解项目结构 | 只看到贴的代码 |
| Git 集成 | 没有 |
| 可扩展 | 有限 |

## 优缺点

**优点：**
- 在真实开发环境工作
- 能直接操作文件和 Git
- 高度可定制（Skills、Hooks、MCP）
- 免费开源（需 API/订阅）
- VS Code 原生扩展支持
- 社区活跃，MCP 生态丰富
- 检查点功能，安全回退修改

**缺点：**
- 需要命令行基础
- 没有图形界面（部分人可能不习惯）
- 需要网络连接
- 学习曲线比 Cursor 陡

## 学习资源

**官方：**
- [Claude Code 文档](https://code.claude.com/docs)
- [Anthropic 官网](https://anthropic.com)

**社区：**
- [GitHub 仓库](https://github.com/anthropics/claude-code)
- [Claude Discord](https://discord.gg/anthropic)

**教程：**
- [Claude Code 完整指南](https://www.jitendrazaa.com/blog/ai/claude-code-complete-guide-2026)
- [CLI 速查表](https://shipyard.build/blog/claude-code-cheat-sheet/)
- [初学者教程](https://codewithmukesh.com/blog/claude-code-for-beginners/)

## 常见问题

**Q: Claude Code 会把我的代码发给 Anthropic 吗？**
A: 会。代码发送到 Anthropic 的 API 处理。隐私政策声明不会用客户代码训练模型。

**Q: 能在离线环境用吗？**
A: 不能。需要连接 Anthropic API。

**Q: 支持哪些编程语言？**
A: 所有语言。Claude 对 Python、JavaScript、TypeScript、Go、Rust 等支持最好。

**Q: 跟 Cursor 选哪个？**
A:
- 要图形界面、深度集成 → Cursor
- 要轻量、跟任何编辑器配合 → Claude Code
- 预算充足 → 两个都用

**Q: 如何限制成本？**
A:
- 用 Haiku 处理简单任务
- 限制上下文大小
- 设置 token 警告
- Pro/Max 订阅比按量付费划算（如果经常用）

## 下一步

1. 安装 Claude Code：`npm install -g @anthropic-ai/claude-code`
2. 配置认证（API key 或浏览器登录）
3. 在真实项目试试：`claude "解释这个项目"`
4. 创建 `.claude/settings.json` 配置
5. 写 `CLAUDE.md` 提供项目上下文
6. 探索 MCP 服务器扩展功能

[继续学习：其他 AI 编程工具 →](/agent-ecosystem/06-ai-coding-tools/03-other-tools)
