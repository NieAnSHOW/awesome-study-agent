# 开发环境搭建

选择好工具后，需要正确配置才能发挥最大效果。

## 选择组合

### 常见组合

根据不同需求选择：

**组合 1：AI 原生（推荐新手）**

```
主工具：Cursor
辅助：Claude Code
适合：全栈开发，重度 AI 使用
成本：$20 + API
```

**组合 2：轻量级（预算有限）**

```
主工具：VS Code + Copilot Free
辅助：Codeium
适合：轻度使用，学生
成本：$0
```

**组合 3：终端爱好者**

```
主工具：任何编辑器 + Claude Code
适合：喜欢命令行，灵活配置
成本：API 费用
```

**组合 4：企业级**

```
主工具：JetBrains + Tabnine Enterprise
辅助：自定义 MCP 服务器
适合：大公司，敏感代码
成本：$49/用户/月
```

## Cursor 环境搭建

### 步骤 1：安装

1. **下载**
   - 访问 [cursor.com](https://cursor.com)
   - 选择对应平台（macOS/Windows/Linux）
   - 安装

2. **首次启动**
   - 登录账号（Google/GitHub/Email）
   - 选择主题（跟 VS Code 一样）
   - 导入 VS Code 配置（可选）

### 步骤 2：基本配置

**推荐 settings.json：**

```json
{
  "cursor.completion.enable": true,
  "cursor.chat.enable": true,
  "cursor.agent.enable": true,
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "workbench.colorTheme": "Default Dark+",
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

**如何设置：**
1. 按 `Cmd+,`（macOS）或 `Ctrl+,`（Windows）
2. 搜索 "settings json"
3. 点击"在 settings.json 中编辑"

### 步骤 3：项目规则

创建 `.cursorrules`：

```bash
# 在项目根目录
touch .cursorrules
```

**示例内容：**

```markdown
# 项目编码规范

## 技术栈
- TypeScript 严格模式
- React 18 + Next.js 14
- Tailwind CSS

## 代码风格
- 函数式组件 + Hooks
- 组件命名：PascalCase
- 函数命名：camelCase
- 常量：UPPER_SNAKE_CASE

## 导入顺序
1. React
2. 第三方库
3. 绝对导入（@/）
4. 相对导入（./）

## 约束
- 避免使用 any
- 所有 API 调用处理错误
- 组件文件最大 300 行
```

### 步骤 4：推荐插件

虽然 Cursor 内置了很多功能，但这些插件仍然有用：

```bash
# 必装
- Prettier - 代码格式化
- ESLint - 代码检查
- GitLens - Git 增强

# 推荐
- Error Lens - 内联错误显示
- Import Cost - 显示包大小
- TODO Highlight - 高亮 TODO
```

### 步骤 5：快捷键

**自定义快捷键（keybindings.json）：**

```json
[
  {
    "key": "cmd+shift+c",
    "command": "cursor.chat.open"
  },
  {
    "key": "cmd+shift+i",
    "command": "cursor.composer.open"
  },
  {
    "key": "cmd+shift+a",
    "command": "cursor.agent.toggle"
  }
]
```

## Claude Code 环境搭建

### 步骤 1：安装

```bash
# 全局安装
npm install -g @anthropic-ai/claude-code

# 验证
claude --version
```

### 步骤 2：认证

**方法一：API Key（适合按量付费）**

1. 访问 [Anthropic Console](https://console.anthropic.com)
2. 创建 API Key
3. 设置环境变量：

```bash
# 临时（当前会话）
export ANTHROPIC_API_KEY="your-key"

# 永久（加到配置文件）
echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.zshrc
source ~/.zshrc
```

**方法二：订阅登录（推荐）**

```bash
# 首次运行会提示登录
claude

# 按提示在浏览器登录
# Claude Pro 或 Max 订阅用户直接用
```

### 步骤 3：配置文件

**全局配置（~/.claude/settings.json）：**

```json
{
  "model": "claude-sonnet-4-6",
  "maxTokens": 8192,
  "permissions": {
    "allowedTools": [
      "Read",
      "Write",
      "Bash(git *)",
      "Bash(npm test)",
      "Bash(npm run dev)"
    ],
    "deny": [
      "Read(.env*)",
      "Write(.env*)",
      "Bash(rm -rf *)",
      "Bash(dd *)"
    ]
  }
}
```

**创建配置目录：**

```bash
mkdir -p ~/.claude
nano ~/.claude/settings.json
# 粘贴上面的配置
```

### 步骤 4：项目配置

**项目配置（.claude/settings.json）：**

```bash
cd your-project
mkdir -p .claude
nano .claude/settings.json
```

```json
{
  "model": "claude-sonnet-4-6",
  "maxTokens": 4096,
  "permissions": {
    "allowedTools": [
      "Read",
      "Write",
      "Bash(git *)",
      "Bash(npm *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.ts)",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $file"
          }
        ]
      },
      {
        "matcher": "Write(*.py)",
        "hooks": [
          {
            "type": "command",
            "command": "black $file"
          }
        ]
      }
    ]
  }
}
```

### 步骤 5：CLAUDE.md

**全局 CLAUDE.md（~/.claude/CLAUDE.md）：**

```bash
nano ~/.claude/CLAUDE.md
```

```markdown
# 我的开发偏好

## 编码风格
- TypeScript 严格模式
- 函数式编程优先
- 避免嵌套超过 3 层
- 函数不超过 50 行

## 注释习惯
- 复杂逻辑必须注释
- 简单代码不需要注释
- 注释说明"为什么"，不是"什么"

## 测试
- 所有新功能写测试
- 测试覆盖率 > 80%
- 用 TDD 或测试后置都行

## 性能
- 避免不必要的重渲染
- 大列表用虚拟滚动
- 图片懒加载
```

**项目 CLAUDE.md（./CLAUDE.md）：**

```bash
nano CLAUDE.md
```

```markdown
# 项目：[项目名]

## 概述
[项目简介]

## 技术栈
- 前端：[框架和版本]
- 后端：[框架和版本]
- 数据库：[数据库和版本]

## 架构
[项目架构说明]

## 编码规范
[团队编码规范]

## 文件结构
[目录结构说明]

## API 文档
[API 文档链接或说明]

## 常见问题
[开发中常见问题]
```

### 步骤 6：终端集成

**iTerm2（macOS）：**

1. 打开 Profiles → Keys
2. 添加快捷键：
   - `Cmd+L`：启动 Claude Code
   - `Shift+Enter`：发送到 Claude Code

**VS Code 集成：**

```bash
# 安装扩展
code --install-extension claude-code.vscode

# 在集成终端使用
claude
```

**Warp 终端：**

```bash
# Warp 有 AI 集成，配置 Claude Code
# Settings → AI → Configure → Claude Code
```

## VS Code + Copilot 环境搭建

### 步骤 1：安装 VS Code

```bash
# macOS
brew install --cask visual-studio-code

# Windows
# 从官网下载安装器
# code.visualstudio.com

# Linux
# 从官网下载 .deb 或 .rpm
```

### 步骤 2：安装 Copilot

1. 在 VS Code 中打开扩展面板（`Cmd+Shift+X`）
2. 搜索 "GitHub Copilot"
3. 点击安装
4. 登录 GitHub 账号
5. 开始免费试用（现在免费了）

### 步骤 3：配置 Copilot

```json
// settings.json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.inlineSuggest.enable": true,
  "github.copilot.advanced": {
    "inlineSuggestCount": 3
  }
}
```

### 步骤 4：Copilot Chat（可选）

安装 GitHub Copilot Chat 扩展：

```bash
# 在 VS Code 扩展市场搜索
# "GitHub Copilot Chat"
```

### 步骤 5：快捷键

```json
// keybindings.json
[
  {
    "key": "cmd+shift+i",
    "command": "github.copilot.openInlineChat"
  },
  {
    "key": "cmd+shift+/",
    "command": "github.copilot.openCopilotChat"
  }
]
```

## 多工具协同配置

### Cursor + Claude Code

**在 Cursor 终端用 Claude Code：**

1. 打开 Cursor
2. 打开集成终端（`` Ctrl+` ``）
3. 运行 `claude`
4. Cursor 编辑代码，Claude Code 处理复杂任务

**配置 .claude/settings.local.json：**

```json
{
  "model": "claude-opus-4-6",
  "maxTokens": 8192
}
```

这个文件不提交到 git，是个人的高级配置。

### VS Code + Copilot + Claude Code

**安装扩展：**

```bash
code --install-extension github.copilot
code --install-extension github.copilot-chat
```

**工作流：**
- Copilot：实时补全
- Copilot Chat：简单对话
- Claude Code：复杂任务

### Windsurf + Claude Code

类似 Cursor，Windsurf 也有集成终端。

```bash
# 启动 Windsurf
# 打开终端
claude
```

## 高级配置

### MCP 服务器

**什么是 MCP：**
Model Context Protocol，让 Claude Code 连接外部工具。

**安装示例：Google Drive MCP**

```bash
# 安装 MCP 服务器
npm install -g @modelcontextprotocol/server-gdrive

# 配置
claude mcp add gdrive -e GOOGLE_CREDENTIALS=/path/to/credentials.json
```

**使用：**

```
"读取 Google Drive 里的设计规范：
gdrive://设计规范.docx"
```

**其他 MCP 服务器：**
- `@modelcontextprotocol/server-postgres` - 数据库
- `@modelcontextprotocol/server-filesystem` - 文件系统
- `@modelcontextprotocol/server-github` - GitHub 集成

### 自定义命令

**创建命令目录：**

```bash
mkdir -p .claude/commands
```

**代码审查命令：**

```markdown
<!-- .claude/commands/review.md -->
审查以下代码：
- 安全性（SQL 注入、XSS、CSRF）
- 性能（时间/空间复杂度）
- 可读性（命名、注释）
- 测试覆盖

提供改进建议和修改方案。
```

使用：`/review @./src/components/UserAuth.tsx`

**创建组件命令：**

```markdown
<!-- .claude/commands/component.md -->
创建 React 组件：

参数：$ARGUMENTS

遵循规范：
- TypeScript 严格模式
- 函数式组件 + Hooks
- 样式用 Tailwind
- 添加 PropTypes 注释
- 导出 memo 优化
```

使用：`/component UserCard -id:string -name:string -email:string`

### 自动化 Hooks

**TypeScript 自动格式化：**

```json
// .claude/settings.json
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

**Python 自动格式化和类型检查：**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [
          {
            "type": "command",
            "command": "black $file && mypy $file"
          }
        ]
      }
    ]
  }
}
```

**提交前自动测试：**

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "*commit*",
        "hooks": [
          {
            "type": "command",
            "command": "npm test"
          }
        ]
      }
    ]
  }
}
```

## Shell 集成

### Zsh 配置

```bash
# ~/.zshrc

# Claude Code 快捷方式
alias cc='claude'
alias ccc='claude -c'  # 继续上次对话
alias ccp='claude -p'  # 打印模式

# 快速函数
ccg() {
  claude "git: $@"
}

# 示例：ccg status
```

### Bash 配置

```bash
# ~/.bashrc

# Claude Code
alias cc='claude'
alias ccc='claude -c'
alias ccp='claude -p'

# 快速函数
cc-test() {
  claude "运行测试并分析失败：npm test"
}

cc-review() {
  claude "审查当前改动：git diff"
}
```

### PowerShell（Windows）

```powershell
# $PROFILE

function cc { claude $args }
function ccc { claude -c }
function ccp { claude -p $args }

function cc-test {
  claude "运行测试：npm test"
}
```

## 性能优化

### 减少延迟

**使用更快的模型：**

```json
// 简单任务用 Haiku
{
  "model": "claude-haiku-4-5-20251001"
}
```

**限制上下文：**

```json
{
  "maxTokens": 2048,  // 减少 token 数
  "maxTurns": 3      // 限制对话轮数
}
```

### 本地缓存

```bash
# Claude Code 自动缓存会话
# 清理缓存
claude --clear-cache
```

### 并发使用

```bash
# 多个终端会话
# 终端 1
claude

# 终端 2
claude -c

# 终端 3
claude -r "session-id"
```

## 故障排查

### Cursor 问题

**问题：响应慢**
- 检查网络连接
- 切换到 Haiku 模型
- 减少上下文文件数量

**问题：Agent 失败**
- 查看错误日志
- 检查权限设置
- 手动执行失败的命令

**问题：插件冲突**
- 禁用其他 AI 插件
- 重启 Cursor
- 清理缓存

### Claude Code 问题

**问题：认证失败**
```bash
# 检查 API key
echo $ANTHROPIC_API_KEY

# 重新登录
claude --logout
claude
```

**问题：权限被拒**
```json
// 检查 permissions 配置
{
  "permissions": {
    "allowedTools": ["Read", "Write"]
  }
}
```

**问题：文件未找到**
```bash
# 检查当前目录
pwd

# 指定完整路径
claude "分析 @./full/path/to/file.ts"
```

### VS Code Copilot 问题

**问题：无法补全**
- 检查网络连接
- 确认登录状态
- 重启 VS Code

**问题：Copilot Chat 不工作**
- 更新扩展到最新版本
- 检查 GitHub 账号状态
- 查看 Copilot 日志

## 学习路径

### 新手（第 1 周）

1. 选择一个工具（推荐 Cursor 或 VS Code + Copilot）
2. 完成基本安装和配置
3. 尝试简单任务：
   - 代码补全
   - 解释代码
   - 重构函数
4. 熟悉快捷键

### 进阶（第 2-4 周）

1. 创建 `.cursorrules` 或 `CLAUDE.md`
2. 学习高级功能：
   - Composer / Agent 模式
   - 自定义命令
   - Hooks
3. 在真实项目中使用
4. 建立自己的 Prompt 库

### 高级（第 2-3 个月）

1. 配置 MCP 服务器
2. 创建自定义 Skills
3. 优化工作流
4. 分享给团队

## 下一步

1. **选择工具**
   - 新手：Cursor
   - 预算有限：VS Code + Copilot Free
   - 命令行：Claude Code

2. **安装配置**
   - 跟着上面的步骤
   - 5-10 分钟完成

3. **第一个项目**
   ```bash
   # 创建测试项目
   npm create vite@latest test-ai-coding
   cd test-ai-coding
   npm install

   # 用 AI 工具打开
   cursor .  # 或 code .
   ```

4. **尝试功能**
   ```
   "创建一个计数器组件：
   - 显示数字
   - 加减按钮
   - 重置按钮
   - 用 TypeScript 和 Tailwind"
   ```

5. **深入学习**
   - 阅读[最佳实践](/basics/06-ai-coding-tools/04-best-practices)
   - 探索其他工具
   - 建立自己的配置

## 参考资源

**官方文档：**
- [Cursor 文档](https://cursor.sh/docs)
- [Claude Code 文档](https://code.claude.com/docs)
- [GitHub Copilot 文档](https://docs.github.com/en/copilot)

**视频教程：**
- [Claude Code 初学者教程](https://www.youtube.com/watch?v=kddjxKEeCuM)
- [Cursor 快速上手](https://www.youtube.com/watch?v=oQDCAJnr1aY)

**社区：**
- [Cursor Discord](https://discord.gg/cursor)
- [Claude Discord](https://discord.gg/anthropic)
- [Reddit r/cursor](https://reddit.com/r/cursor)

---

**恭喜！** 你已经完成模块六的学习。现在可以选择一个工具开始实践了。

[← 返回课程首页](/preface)
