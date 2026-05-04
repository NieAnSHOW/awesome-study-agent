# CC Switch — AI 编程工具的统一配置管理中心

> 更新时间：2026-05-04

## 什么是 CC Switch

CC Switch（又名 cc-switch）是一款开源、跨平台的桌面工具，专为统一管理 AI 编程助手的配置而设计。GitHub 57K+ Stars，采用 Tauri 2 + Rust + React 构建。

**一句话概括：**它是你的 AI 编程工具配置中心 + 切换管家。

**支持管理的应用（5 款）：**
- **Claude Code**（Anthropic）— 终端 AI 编程助手
- **Codex**（OpenAI）— OpenAI CLI 编码代理
- **Gemini CLI**（Google）— Google 终端 AI 代理
- **OpenCode**（开源）— 开源终端编程助手
- **OpenClaw**（开源）— 跨应用自动化智能体

### 解决的核心痛点

| 之前（手动管理） | 之后（CC Switch） |
|----------------|----------------|
| 手动编辑 `~/.claude/settings.json`，容易改错格式崩溃 | 可视化界面，点一下切换 |
| 不同工具配置文件分散在各处 | 一个面板管理 5 款工具 |
| 切换供应商需改 JSON + 重启终端 | 一键切换，立刻生效 |
| 没有测速功能，不知道哪个快 | 内置延迟测试，一目了然 |
| 配置改崩了无法回滚 | 自动备份，一键还原 |

### GitHub 信息

- **项目地址**：<https://github.com/farion1231/cc-switch>
- **许可证**：MIT
- **技术栈**：Tauri 2.8 + Rust（后端）+ React 18 + TypeScript（前端）
- **最新版本**：v3.14.1（2026-04-23）
- **下载页面**：[GitHub Releases](https://github.com/farion1231/cc-switch/releases/latest)

---

## 核心功能

### 1. 供应商一键切换

50+ 内置供应商预设，包括：

- **官方渠道**：Anthropic Claude、OpenAI、Google Gemini
- **国产模型**：DeepSeek、智谱 GLM、Kimi（月之暗面）、通义千问、豆包、MiniMax
- **中继服务**：APIYI、New API、OpenRouter、SiliconFlow 等
- **云平台**：AWS Bedrock、NVIDIA NIM

选择预设 → 填入 API Key → 点启用，5 秒完成切换。

### 2. 本地 API 代理（核心功能）

CC Switch 在本地启动一个代理服务器，接管所有 API 请求，实现以下能力：

```
Claude Code → 本地代理 :15721 → 选中供应商 API
```

- **热切换**：切换模型不用重启终端
- **自动故障转移**：主供应商挂了自动切备用
- **请求日志**：所有请求一目了然，方便排查
- **格式修复**：修复第三方 API 的 thinking 签名兼容问题
- **熔断器**：检测供应商失败时自动隔离

### 3. MCP 服务器管理

统一面板管理 5 款应用的 MCP（Model Context Protocol）服务器：

- 支持 stdio、HTTP、SSE 三种传输类型
- 跨应用双向同步
- 可视化添加、编辑、删除
- 从已有应用一键导入 MCP 配置

### 4. Skills 管理

- 从 GitHub 仓库自动扫描并一键安装 Skills
- 支持本地 ZIP 文件安装
- 软链接同步到对应应用的 Skills 目录
- 内置 `baoyu-skills` 等预设仓库

### 5. 提示词（Prompts）管理

- 创建无限数量的 System Prompt 预设
- 支持 CLAUDE.md、AGENTS.md、GEMINI.md 同步
- CodeMirror 6 编辑器 + 实时预览
- 多场景快速切换

### 6. 会话管理器（Session Manager）

- 浏览 5 款应用的全部历史对话
- 支持目录导航和会话内搜索
- 自动按当前应用过滤

### 7. 用量统计

- Token 消耗统计
- 缓存命中率分析
- 按模型和供应商分类查看费用
- 自定义模型定价

### 8. 备份与同步

- 自动备份（保留最近 10 份）
- WebDAV 云同步（如坚果云）
- 自定义配置目录（Dropbox、OneDrive、iCloud）

---

## 安装指南

### 系统要求

| 系统 | 最低版本 | 架构 |
|------|---------|------|
| Windows | Windows 10+ | x64 |
| macOS | macOS 12 (Monterey)+ | Intel / Apple Silicon |
| Linux | Ubuntu 22.04+ / Debian 11+ / Fedora 34+ | x64 / arm64 |

### macOS 安装

**方法一：Homebrew（推荐）**

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch

# 更新
brew upgrade --cask cc-switch
```

**方法二：手动安装**

从 [GitHub Releases](https://github.com/farion1231/cc-switch/releases/latest) 下载 `.dmg` 或 `.zip`，解压后拖入「应用程序」文件夹。

> CC Switch for macOS 已经过 Apple 签名和公证，可直接安装。

### Windows 安装

下载 `.msi` 安装包（推荐），双击按向导安装。也有 `.zip` 便携版可选择。

### Linux 安装

| 发行版 | 命令 |
|--------|------|
| Ubuntu/Debian | `sudo apt install ./CC-Switch-*.deb` |
| Fedora/RHEL | `sudo dnf install ./CC-Switch-*.rpm` |
| Arch Linux | `paru -S cc-switch-bin` |
| 通用 | 下载 `.AppImage`，`chmod +x` 后运行 |

### 验证安装

启动 CC Switch，主界面会自动检测已安装的 CLI 工具并尝试导入现有配置。

---

## 快速上手

### 第一步：添加第一个供应商

1. 启动 CC Switch
2. 点击右上角 **「+」**
3. 从预设中选择（如 Anthropic Official、DeepSeek、智谱 GLM 等），或自定义填写：

   - **名称**：便于区分的备注名
   - **API Key**：服务商提供的密钥
   - **Base URL**（可选）：自定义代理地址
   - **默认模型**：选择主要使用的模型
4. 点击保存

### 第二步：切换供应商

在列表中点击目标供应商 → 点击 **「启用」**，CC Switch 自动将配置写入对应 CLI 工具的配置文件。

### 第三步：验证

```bash
# 在终端直接运行
claude

# 如果能正常对话，说明配置生效
```

### 第四步：开启本地代理（推荐）

进入 **设置 → 代理（Proxy）**，开启 **「启用本地代理（Enable Local Proxy）」**。

开启后可以实现：
- 切换模型无需重启终端
- 统一管理所有 AI 工具的网络出口
- 支持主备模型自动故障转移（主模型挂了自动切备用）

如果遇到连接问题，可以手动设置环境变量：

```bash
# macOS/Linux
export ANTHROPIC_BASE_URL="http://127.0.0.1:15721"

# Windows PowerShell
$env:ANTHROPIC_BASE_URL="http://127.0.0.1:15721"
```

然后在同一个终端中运行 `claude`。

---

## 进阶使用

### 切换回官方登录

想切回 Anthropic 官方登录时：

1. 从预设中添加一个「Official Login」供应商
2. 切换启用它
3. 重启 CLI 工具，执行登录流程

### MCP 服务器管理

1. 点击顶部 **「MCP」** 面板
2. 通过模板或自定义配置添加 MCP 服务器
3. 切换每个应用的同步开关
4. 配置自动同步到对应 CLI 工具

### Skills 一键安装

1. 点击顶部 **「Skills」** 面板
2. 从内置的 GitHub 仓库列表中选择
3. 点击「安装」
4. CC Switch 自动下载并软链接到对应应用的 Skills 目录

### 配置备份与同步

1. 进入 **设置 → 备份管理**
2. 查看所有备份、重命名、删除
3. 开启 **WebDAV 同步** 实现多设备共享（如坚果云）

### 修复第三方 API 兼容问题

使用第三方 API 网关时，Claude 的 thinking block 格式可能不兼容，出现 `400 thinking type` 错误：

**方法一：开启 Claude Rectifier**

进入 **设置 → 高级**，开启 **「Claude Rectifier（思考签名修复）」**，代理层会自动修复此问题。

**方法二：禁用 adaptive thinking**

在 CC Switch 的供应商编辑页面 → 通用配置中，添加：

```json
{
  "env": {
    "claude_code_disable_adaptive_thinking": "1"
  }
}
```

### 用量统计

进入 **「用量」** 页面，查看：
- Token 消耗趋势图
- 缓存命中率
- 按模型和供应商分类的费用
- 详细请求日志

---

## 数据流架构

```
┌──────────────────────────────────────────────────────────────┐
│                         CC Switch                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Providers│  │   MCP    │  │  Skills  │  │  Prompts   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       └──────────────┴─────────────┴──────────────┘          │
│                          │ SQLite (〜/.cc-switch/cc-switch.db)│
│                          ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                本地代理 (Proxy)                        │   │
│  │  127.0.0.1:15721 → 自动故障转移 → 选中供应商 API       │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
   Claude Code      Codex        Gemini CLI      OpenCode
```

**数据流向：**
1. CLI 工具（如 Claude Code）发出 API 请求
2. 如果开启本地代理，请求先发到 `127.0.0.1:15721`
3. CC Switch 代理层解析请求，进行协议格式转换
4. 转发到当前选中的供应商 API
5. 接收响应，逆向转换后返回 CLI 工具

**数据存储：**
- **SQLite 数据库**：`~/.cc-switch/cc-switch.db`（供应商、MCP、提示词、Skills）
- **设备设置**：`~/.cc-switch/settings.json`
- **备份**：`~/.cc-switch/backups/`（自动保留最近 10 份）
- **Skills**：`~/.cc-switch/skills/`（软链接到对应应用目录）

---

## 与其他工具对比

| 工具 | 类型 | 管理范围 | 特色功能 | 适合场景 |
|------|------|---------|---------|---------|
| **CC Switch** | 桌面应用 | 5 款 CLI 工具 | 全面管理、本地代理、自动故障转移 | 大多数用户 |
| **CC Switch CLI** | 命令行 | 同上 | 命令行版本 | 终端爱好者 |
| **Claude-Code-Router** | 代理服务 | Claude Code | 动态路由、多模型协作 | 复杂路由需求 |
| **CCS** | 混合工具 | Claude Code | OAuth 支持、可视化面板 | 需要 OAuth 登录 |

**推荐组合：** CC Switch（配置管理）+ 第三方 API 中继服务（降低成本）= 性价比最高的方案。

---

## 常见问题

**Q: CC Switch 支持哪些操作系统？**

A: Windows 10+、macOS 12+、Linux（Ubuntu 22.04+ / Debian 11+ / Fedora 34+ 等主流发行版）。

**Q: 切换供应商后需要重启终端吗？**

A: 大部分工具需要重启。但 Claude Code 在开启本地代理后支持热切换，无需重启。

**Q: 如何切换回官方登录？**

A: 添加一个「Official Login」预设供应商 → 切换启用 → 重启 CLI 工具 → 执行登录/OAuth 流程。

**Q: 我的数据存在哪里？**

A: 核心数据在 `~/.cc-switch/cc-switch.db`（SQLite），设备设置在 `~/.cc-switch/settings.json`，备份在 `~/.cc-switch/backups/`。

**Q: 可以删除当前正在使用的供应商吗？**

A: CC Switch 采用「最小侵入」设计——即使卸载应用，CLI 工具也能继续工作。系统始终保持一个活跃配置，不可以删除当前激活的供应商。如果想切回官方，参考上一条。

**Q: 遇到 `400 thinking type` 错误怎么办？**

A: 这是第三方 API 不支持 `adaptive` thinking 类型导致的。方法一：开启 CC Switch 的「Claude Rectifier」；方法二：在供应商配置中添加环境变量 `claude_code_disable_adaptive_thinking: "1"`。

**Q: CC Switch 收费吗？**

A: 完全开源免费（MIT 许可证）。如果你觉得好用，可以去 GitHub 点个 Star。

---

## 参考资源

- [GitHub 仓库](https://github.com/farion1231/cc-switch)
- [用户手册](https://github.com/farion1231/cc-switch/blob/main/docs/user-manual/en/README.md)
- [更新日志](https://github.com/farion1231/cc-switch/blob/main/CHANGELOG.md)
- [New API 集成文档](https://www.newapi.ai/en/docs/apps/cc-switch)
- [菜鸟教程：CC Switch 一键切换 API](https://www.runoob.com/ai-agent/cc-switch.html)
- [SiIiconFlow 集成文档](https://docs.siliconflow.cn/en/usercases/use-siliconcloud-in-ccswitch)

---

[← 上一章：开发环境搭建](/agent-ecosystem/06-ai-coding-tools/05-environment-setup) | [返回模块首页](/agent-ecosystem/06-ai-coding-tools)
