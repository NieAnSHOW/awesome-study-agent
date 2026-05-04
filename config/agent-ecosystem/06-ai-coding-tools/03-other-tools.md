# 其他 AI 编程工具

> 更新时间：2026-05-04

除了 Cursor 和 Claude Code，还有不少 AI 编程工具。每个都有自己的特点和适用场景。

## 工具全景

### 主流工具对比

| 工具 | 类型 | 价格区间 | 主要特点 |
|------|------|----------|----------|
| Cursor | AI IDE | $20-200/月 | AI 原生 IDE，深度集成，Agent 模式最强 |
| Claude Code | CLI | API 计费 / 订阅 | 终端工具，Skills/MCP/Hooks 生态丰富 |
| GitHub Copilot | 插件 | $0-39/月 | VS Code 无缝集成，Workspace 全流程 |
| Windsurf | AI IDE | $0-15/月 | 速度快，Flow 体验独特 |
| Trae（国内版） | AI IDE | 免费 | 豆包/DeepSeek 模型，国内直连 |
| Trae（国际版） | AI IDE | $20/月 | Claude/GPT-4o 模型，Builder 模式 |
| CodeBuddy | 插件 | 免费 / ¥198/月 | 腾讯生态，企业级安全 |
| Gemini CLI | CLI | 免费 | Google 开源终端代理，免费 Gemini 模型 |
| Codex CLI | CLI | API 计费 | OpenAI 终端代理，沙箱隔离 |
| v0 by Vercel | 在线平台 | $0-30/月 | 自然语言生成 React 组件/页面 |
| Lovable | 在线平台 | $0-75/月 | 全栈 AI 应用构建，可视化编辑 |
| Bolt.new | 在线平台 | $0-50/月 | 在线沙箱 AI 开发 |
| Aider | CLI | 免费 | 开源终端结对编程，多模型支持 |
| Continue.dev | 插件 | 免费 | 开源 AI 编码插件，VS Code/JetBrains |
| Amazon Q Developer | 插件 | 免费 | AWS 深度集成（原 CodeWhisperer） |
| Codeium | 插件/IDE | 免费 | 功能全面，永久免费 |
| Tabnine | 插件 | $12-49/月 | 本地运行，隐私优先 |
| Replit AI | 云端 IDE | $0-20/月 | 无需本地配置，快速原型 |
| OpenClaw | 开源框架 | 免费 | 跨应用自动化智能体 |
| Devin | 平台 | 定制 | 端到端 AI 软件工程师 |

---

## GitHub Copilot

### 是什么

GitHub 和 OpenAI 合作的 AI 编程助手，作为编辑器插件存在，是市场上最早（2021年）的 AI 编程工具之一。

### 主要特点

**优点：**
- 跟 VS Code、JetBrains 无缝集成
- 补全速度快
- Copilot Chat 对话模式
- Copilot Workspace：从 Issue 到 Pull Request 的全流程自动化
- Vision Copilot：从设计图生成代码

**缺点：**
- 不能直接读写文件（需要手动复制）
- 上下文理解不如 Cursor 深

### 定价

> **重要变化**：从 2026 年 6 月 1 日起，GitHub Copilot 从按请求计费转为**用量计费（Usage-based billing）**。

- **Free**：$0（有限补全和聊天）
- **Pro**：$10/月（含 $10 AI Credits）
- **Pro+**：$39/月（含更多 Credits 和多模型选择）
- **Business**：$19/用户/月
- **Enterprise**：$39/用户/月

超出 Credits 后可按量购买附加包。Pro 版对大多数个人开发者仍然是最划算的选择。

### 适用场景

**适合：** VS Code/JetBrains 用户、GitHub 生态重度用户、主要需要代码补全
**不适合：** 需要多文件深度编辑、需要终端操作能力

---

## Windsurf

### 是什么

Codeium 出品的 AI 编辑器，主打快速响应。2025 年被 Cognition/Devin 以 $250M 收购。

### 主要特点

**独特功能：**
- **Cascade**：多步骤 Agentic 流
- **Flow**：AI 感知光标移动，主动提供建议
- **Arena Mode**：盲模型对比
- **Plan Mode**：结构化 Agent 工作流
- **SWE-grep**：RL 训练模型实现更快代码检索

**优点：** 速度快、免费版限制少
**缺点：** 社区比 Cursor 小、被收购后路线图不确定性

### 定价

- **Free**：$0（无限基础补全，每月 20-50 次高级对话）
- **Pro**：$15/月（所有高级模型 + 500 prompt credits/月）
- **Team**：定制价格

### 适用场景

追求速度、预算有限的开发者。Windsurf Flow 的响应体验是目前最快的之一。

---

## Tabnine

### 是什么

主打隐私和本地化的 AI 编程助手，企业友好。

### 主要特点

**独特卖点：**
- **本地运行**：代码不离开你的机器
- **私有模型**：可在你的代码上训练
- **企业友好**：符合安全合规要求

**优点：** 隐私保护强、可离线使用（本地模型）
**缺点：** 补全质量不如云端模型、本地运行需要好的硬件

### 定价

- **Starter**：免费
- **Pro**：$12/月
- **Enterprise**：$49/用户/月

### 适用场景

金融、医疗等敏感行业，需要代码不离开本地的场景。

---

## Amazon Q Developer

### 是什么

Amazon Q Developer 是 AWS 推出的 AI 编程助手，原名为 **Amazon CodeWhisperer**（2024 年 4 月更名）。

### 主要特点

**优点：**
- **完全免费**：不限使用次数
- 跟 AWS 服务深度集成（Lambda、EC2、DynamoDB 等）
- 安全扫描功能
- Amazon Q 还能帮助优化云成本与资源配置

**缺点：**
- 主要适合 AWS 生态
- 非 AWS 开发体验一般

### 定价

**Free**：完全免费（个人开发者）
**Pro**：按需付费（企业高级功能）

### 适用场景

AWS 开发者、使用 AWS Lambda/EC2 等服务的团队。如果你主要在 AWS 生态中工作，这是性价比最高的选择。

---

## Codeium

### 是什么

完全免费的 AI 编程助手，功能对标 Copilot。也提供自己的 IDE（类似 Cursor）。

### 主要特点

**优点：**
- **完全免费**：不限使用
- 功能全面（补全、聊天、重构）
- 支持主流编辑器

**缺点：**
- 补全质量略逊于付费工具
- 更新节奏不如 Cursor

### 定价

**核心功能永久免费**。企业版收费（管理功能）。

### 适用场景

不想花钱、需要基本 AI 功能的开发者和小团队。

---

## 国产 AI 编程工具

### Trae（字节跳动）

国内首个 AI 原生 IDE，从底层架构就将 AI 能力深度融入开发流程。支持 Builder 模式——描述需求，自动生成完整项目。

#### 国内版 vs 国际版

Trae 同时提供国内版和国际版，两个版本在功能上基本一致，主要区别在定价和可用模型：

| 对比维度 | 国内版 | 国际版 |
|---------|--------|--------|
| **定价** | 个人完全免费 | Pro $20/月（用量计费，加量不加价） |
| **可用模型** | 豆包 1.5 Pro、DeepSeek R1/V3、通义千问 | Claude Sonnet、GPT-4o、Gemini |
| **网络** | 国内直连，网络稳定 | 需国际网络，可能需要排队 |
| **安装包** | ~214MB，国内网络优化 | ~214MB |
| **生态集成** | 字节云生态、火山引擎 | 云平台无关 |
| **Builder 模式** | ✓ 完整支持 | ✓ 完整支持，模型更强 |
| **SOLO 智能体** | ✓ | ✓ |
| **MCP 生态** | ✓ | ✓ |

**选择建议：**
- **国内版**适合：个人学习、写简单脚本和中小型项目、预算有限、需要中文优化交互
- **国际版**适合：大型项目开发、需要 Claude/GPT 等更强模型的场景、国际团队协作

#### 核心功能

- **Builder 模式**：描述需求 → AI 自动规划 → 自动生成项目框架 → 自动运行调试
- **Chat + Composer**：对话式编程 + 多文件编辑
- **SOLO 智能体闭环**：完整的工作流自动化
- **MCP 生态**：支持 Model Context Protocol

#### 适用场景

- 国内开发者首选 AI IDE
- 预算有限但想体验 AI 原生 IDE
- 需要稳定网络访问的中文开发者
- 中小型项目的快速原型开发

---

### CodeBuddy（腾讯云）

腾讯云出品的轻量化 AI 代码助手，主打多端协同和腾讯生态集成。

#### 核心能力

- 基于**混元大模型（Hunyuan）**，专为腾讯生态定制
- 支持 200+ 编程语言
- VS Code / JetBrains 插件形态
- 深度集成 Cloud Studio、微信小程序开发
- 企业级安全扫描
- 代码生成质量在国产工具中口碑较好

#### 定价

> **注意**：2026 年 5 月 15 日起执行新计费方案，价格有所调整。

- **个人版**：可申请免费使用（功能无阉割）
- **企业旗舰版**：¥198/人/月（原价 ¥78/人/月，涨幅约 154%）
- **企业专享版（专有云）**：¥316/人/月
- 另有 Lite/Standard/Pro/Max 多档 Token 套餐可选

#### 适用场景

- 腾讯云/微信小程序/企业微信生态开发者
- 国内企业团队，需要私有化部署
- 需要中文理解能力强的编程助手
- 企业级安全合规要求较高的场景

---

## CLI 编码代理工具

2026 年，终端 AI 编码代理成为重要趋势。三大主流工具对比如下：

| 维度 | Claude Code | Gemini CLI | Codex CLI |
|------|------------|------------|-----------|
| **开发商** | Anthropic | Google | OpenAI |
| **开源** | 否（免费安装） | 是 | 是 |
| **实现语言** | TypeScript | TypeScript | Rust |
| **GitHub Stars** | — | — | 75K+ |
| **可用模型** | Claude 系列 | Gemini 系列 | OpenAI 系列 |
| **费用** | Pro/Max 订阅或 API | 免费（使用 Gemini 模型） | API 计费 |
| **沙箱隔离** | 权限控制 | 权限控制 | 容器沙箱 |
| **生态扩展** | Skills / MCP / Hooks | 插件系统 | 会话恢复 / 文件系统访问 |
| **开发环境** | 直接在项目目录运行 | 直接在项目目录运行 | 独立沙箱环境 |

### Google Gemini CLI

Google 开源终端 AI 代理，可以直接在终端中使用 Gemini 模型进行编码。

**主要特点：**
- **完全免费**：使用 Gemini 模型无需付费
- 开源项目，社区活跃
- 能读、写、编辑文件
- 支持从图片/PDF 生成应用
- Gemini Code Assist 的一部分

**安装：**
```bash
# 安装 Gemini CLI
# 详见 https://developers.google.com/gemini-code-assist/docs/gemini-cli
```

**适用场景：** 预算敏感但需要强大模型支持的开发者，喜欢 Google 生态的用户。

### OpenAI Codex CLI

OpenAI 推出的终端编码代理，用 Rust 构建，在隔离沙箱中运行。

**主要特点：**
- **沙箱隔离**：每个任务在独立的容器中运行，安全可靠
- Rust 实现，性能高效
- 支持会话恢复
- 已获得 75K+ GitHub Stars

**安装：**
```bash
npm install -g @openai/codex
```

**适用场景：** 需要沙箱隔离的安全性、喜欢终端体验的开发者，OpenAI 生态用户。

### 如何选择

- Claude Code：生态最丰富，Skills/MCP/Hooks 最完善
- Gemini CLI：免费使用 Gemini 模型，预算为零的最佳选择
- Codex CLI：沙箱隔离最安全，适合需要严格隔离的场景

---

## Vibe Coding 平台

2026 年兴起的"氛围编程"——用自然语言描述想法，AI 自动生成完整的应用。不需要写代码，只需要描述你想要什么。

### v0 by Vercel

Vercel 推出的 AI 编程平台，专注于生成 React 组件和页面。

**主要特点：**
- 自然语言描述→生成 React/Next.js 代码
- 支持 Tailwind CSS、shadcn/ui
- 可视化编辑和迭代
- 一键部署到 Vercel

**定价：**
- **Free**：$0（每月 200 次生成）
- **Pro**：$20/月（更多生成次数）
- **Team**：$30/人/月

**适用场景：** 前端开发者快速生成 UI 组件、原型设计、落地页制作。

### Lovable

全栈 AI 应用构建平台，支持从描述到完整应用的端到端生成。

**主要特点：**
- 全栈生成：前端+后端+数据库
- 可视化编辑器支持
- 一键部署
- Supabase 深度集成

**定价：**
- **Starter**：$0/月
- **Pro**：$50/月
- **Team**：$75/人/月

**适用场景：** 非技术用户构建 MVP、全栈快速原型、独立开发者做 side project。

### Bolt.new

StackBlitz 推出的在线 AI 开发平台，在浏览器中运行完整的开发环境。

**主要特点：**
- 浏览器内完整开发环境
- 实时预览
- 支持多种前端框架
- 沙箱安全运行

**定价：**
- **Free**：$0（有限使用）
- **Pro**：$20/月
- **Team**：$50/月

**适用场景：** 快速尝试想法、在线教学演示、不需要本地环境的开发。

### 选型建议

| 平台 | 最适合 | 价格 |
|------|--------|------|
| v0 | 前端 UI 组件 | 免费入门 |
| Lovable | 全栈应用 MVP | $50/月起 |
| Bolt.new | 在线快速原型 | 免费入门 |

---

## 开源 AI 编程工具

### Aider

终端 AI 结对编程工具，支持多种大模型，开源免费。

**主要特点：**
- 支持 Claude、GPT、DeepSeek、本地模型等多种后端
- 自动 git commit
- 地图文件（map file）技术理解项目结构
- 终端操作，vim 友好

**安装：**
```bash
pip install aider-chat
```

**定价：** **完全开源免费**，仅需自备模型 API Key

**适用场景：** 终端爱好者、需要灵活选择模型的开发者、预算敏感用户。

### Continue.dev

VS Code / JetBrains 的开源 AI 编码插件，可接入任意模型。

**主要特点：**
- 开源替代 Copilot
- 支持接入任意模型（本地或云端）
- 聊天、补全、编辑功能
- VS Code 和 JetBrains 双平台

**安装：** VS Code 扩展市场搜索 "Continue"

**定价：** **完全开源免费**，仅需自备模型 API Key

**适用场景：** 想用开源方案替代 Copilot、需要自行控制模型和数据流向的开发者。

---

## 新兴工具

### Replit AI

云端一体化开发工具，无需本地环境配置即可开发。

**主要特点：**
- **Ghostwriter**：实时代码补全
- 自然语言转全栈应用
- 无需本地配置
- 实时预览

**定价：**
- **Free**：基本功能
- **Core**：$20/月

**适用场景：** 新手入门、快速原型、不想配置本地环境。

### OpenClaw

开源自动化智能体框架，能跨应用完成复杂任务。接管操作系统，跨浏览器、终端、文件系统执行任务。

**定价：** 完全开源免费

**适用场景：** 极客用户、自动化爱好者、需要跨应用任务执行。

### Devin

AI 软件工程师，从需求到部署全流程自动化。2026 年 2 月收购 Windsurf，产品路线图正在整合。

**适用场景：** 大型企业、需要端到端自动化开发流程的团队。

---

## 选型建议

### 按场景选择

**场景 1：个人开发者，轻量使用**
推荐：GitHub Copilot Free 或 Codeium
成本：$0

**场景 2：个人开发者，深度依赖 AI**
推荐：Cursor Pro（$20/月）
替代：Windsurf Pro（$15/月）+ Claude Code（按需）

**场景 3：预算有限**
推荐：Windsurf Pro（$15/月）或 Trae 国内版（免费）
Gemini CLI 免费使用 Gemini 模型

**场景 4：企业，敏感代码**
推荐：Tabnine Enterprise（$49/用户/月）
或 CodeBuddy 企业版（¥198/人/月）支持私有化部署

**场景 5：国内开发团队**
推荐：Trae 国内版（免费）+ Cursor Pro（$20/月）
- Trae 国内直连，免费使用豆包/DeepSeek
- Cursor Agent 模式处理复杂任务
- CodeBuddy 作为腾讯生态补充

**场景 6：AWS 重度用户**
推荐：Amazon Q Developer（免费）

**场景 7：命令行爱好者**
推荐：Claude Code / Gemini CLI / Codex CLI
成本：Claude Code 需订阅，Gemini CLI 免费，Codex CLI API 计费

**场景 8：Vibe Coding 快速原型**
推荐：v0 / Lovable / Bolt.new
无需写代码，自然语言描述即可生成应用

**场景 9：隐私优先 / 开源偏好**
推荐：Aider（终端）或 Continue.dev（编辑器插件）
完全开源，可自备模型 API Key

### 按编程语言选择

| 语言 | 推荐工具 | 原因 |
|------|----------|------|
| TypeScript/JavaScript | Cursor / v0 | 前端生态支持好 |
| Python | Cursor / Aider | 数据科学场景强 |
| Go | Cursor | 后端支持好 |
| Java | GitHub Copilot | Java 生态理解深 |
| C/C++ | Tabnine / Codeium | 隐私或免费 |
| Rust | Cursor / Codex CLI | 现代语言支持好 |

### 组合使用

**1. Cursor + Claude Code**
Cursor 作为主 IDE，Claude Code 处理复杂任务。

**2. VS Code + Copilot + Claude Code**
Copilot 实时补全，Claude Code 对话和任务。

**3. 国内用户：Trae + Cursor Pro**
Trae 免费日常使用，Cursor Pro 复杂项目。

**4. 免费方案：Gemini CLI + Aider + VSCode**
Gemini CLI 免费终端代理，Aider 开源结对编程。

**5. Vibe Coding + IDE：Lovable + Cursor**
Lovable 快速原型，Cursor 精细开发。

---

## 未来趋势

### 2026 年发展方向

**1. Agentic Coding 成为主流**
- 从被动响应到主动执行
- Cursor、Claude Code 领先，其他工具跟进

**2. 终端 CLI 工具崛起**
- Claude Code、Gemini CLI、Codex CLI 三足鼎立
- 终端编码代理成为重要赛道

**3. Vibe Coding 兴起**
- 自然语言编程让非技术用户也能开发
- v0、Lovable、Bolt.new 等平台快速增长

**4. 国内工具生态成熟**
- Trae 国内版免费，成为国产 AI IDE 标杆
- 国产模型（豆包、DeepSeek、通义千问）编程能力快速提升

**5. 用量计费成为趋势**
- GitHub Copilot 2026 年 6 月转向用量计费
- Cursor 采用信用额制度
- 按量付费逐渐成为行业标准

**6. 开源方案崛起**
- Aider、Continue.dev、Gemini CLI、Codex CLI 开源
- 开发者对可控性和隐私的关注度提升

**7. 多模态能力增强**
- 从设计图/截图生成代码
- Vision Copilot、Builder 模式等

---

## 如何选择

### 决策流程

```
1. 预算多少？
   ├─ $0 → Trae 国内版 / Gemini CLI / Codeium / Aider / Amazon Q
   ├─ $10-20 → Cursor / Windsurf / Copilot Pro
   ├─ $20-40 → Cursor Pro / GitHub Copilot Pro+
   └─ $50+ → Tabnine / CodeBuddy 企业版

2. 主要需求？
   ├─ 代码补全 → Copilot / Codeium
   ├─ Agent 模式 → Cursor / Windsurf / Trae
   ├─ CLI 终端 → Claude Code / Gemini CLI / Codex CLI
   ├─ Vibe Coding → v0 / Lovable / Bolt.new
   ├─ 隐私优先 → Tabnine / Aider / Continue.dev
   ├─ 国产/中文 → Trae 国内版 / CodeBuddy
   └─ 企业私有化 → CodeBuddy / Tabnine Enterprise

3. 编辑器？
   ├─ VS Code → 所有工具都支持
   ├─ JetBrains → Copilot / Tabnine / Continue.dev
   ├─ 愿意换 IDE → Cursor / Windsurf / Trae
   └─ 终端 → Claude Code / Gemini CLI / Codex CLI / Aider

4. 生态？
   ├─ GitHub → Copilot
   ├─ AWS → Amazon Q Developer
   ├─ 腾讯 → CodeBuddy
   ├─ 字节 → Trae
   └─ Google → Gemini CLI
```

### 实际建议

**新手：**
从免费方案开始——国内用户选 Trae 国内版，国际用户选 Gemini CLI（免费）或 Copilot Free。

**个人开发者：**
Cursor Pro（$20/月）或 Windsurf Pro（$15/月），物有所值。

**国内开发者：**
Trae 国内版（免费）+ Cursor Pro（$20/月），成本可控，功能强大。CodeBuddy 可作为腾讯生态补充。

**Vibe Coding 爱好者：**
Lovable（$50/月）或 v0（免费入门），快速从想法到应用。

**开源/隐私导向：**
Aider（终端）+ Continue.dev（编辑器）+ Gemini CLI（免费模型），全开源方案。

**初创团队：**
Cursor Business 或 GitHub Copilot Business，按团队规模选择。

**大企业：**
Tabnine Enterprise 或 CodeBuddy 企业版，安全和合规优先。

---

## 订阅计划生态

2026 年，AI 编程工具的计费模式正在从单纯的月费制走向多元化。除了传统的个人/团队订阅，还出现了 **Coding Plan（编程计划）** 和 **Token Plan（Token 套餐）** 等新模式。

### Claude Code 订阅计划（Anthropic）

| 计划 | 价格 | 默认模型 | 适合场景 |
|------|------|----------|---------|
| Pro | $20/月 | Sonnet 4.6 | 个人日常开发 |
| Max 5x | $100/月 | Opus 4.6 | 重度使用，每日多会话 |
| Max 20x | $200/月 | Opus 4.6 | 全天候开发，Agent Teams |
| Team Premium | $125/座/月 | Opus 4.6 | 团队协作（含 Claude Code） |
| Enterprise | $20/座 + API 用量 | 自选 | 大型企业，合规需求 |

详见 [Claude Code 章节](/agent-ecosystem/06-ai-coding-tools/02-claude-code#定价)。

### Cursor 信用额制度

Cursor 从 2025 年 6 月起转为信用额（Credits）制度：

| 计划 | 价格 | 额度 | 说明 |
|------|------|------|------|
| Hobby | 免费 | 有限 | 基础补全和聊天 |
| Pro | $20/月 | 500 Pro Credits/月 | 所有高级模型 |
| Pro+ | $60/月 | 1500 Pro Credits/月 | 更多额度，优先排队 |
| Ultra | $200/月 | 5000 Pro Credits/月 | 无限使用 |

超出 Credits 后可按需购买附加包。

### GitHub Copilot 用量计费

从 2026 年 6 月起，GitHub Copilot 转为用量计费（Usage-based billing）：

| 计划 | 价格 | 含 AI Credits | 超出价格 |
|------|------|--------------|---------|
| Free | $0 | 有限补全 | — |
| Pro | $10/月 | $10 Credits | 按量购买附加包 |
| Pro+ | $39/月 | 更多 Credits + 多模型 | 按量购买 |
| Business | $19/用户/月 | 团队额度 | — |
| Enterprise | $39/用户/月 | 企业额度 | — |

### MiniMax Token Plan

MiniMax（稀宇科技）推出了专门的 Token Plan（Token 套餐），专为 AI 编程场景设计：

- 按 Token 量购买套餐，用多少扣多少
- 支持 Claude Code、Codex 等 CLI 工具接入
- 提供 Coding Plan 专属优惠（CC Switch 用户可享 12% 折扣）
- M2.7 模型在 SWE-Pro 评分 56.22%，接近 Claude Opus 水平
- 官方网站：[platform.minimax.io](https://platform.minimax.io/subscribe/coding-plan)

### GLM Coding Plan（智谱）

智谱 AI 推出的 GLM Coding Plan：

- 面向 Claude Code 等 CLI 工具的编程专属套餐
- GLM-5.1 模型在 Claude Code 测试中得分 45.3（Opus 4.6 为 47.9，达 94.6%）
- 国内可直接访问，无需国际网络
- 支持通过 CC Switch 一键切换
- 官方网站：[open.bigmodel.cn](https://open.bigmodel.cn)

### API 中继服务（Relay / Proxy）

还有大量第三方 API 中继服务，提供降价后的 Claude/Codex API 接入：

| 服务商 | 特点 | 折扣水平 |
|--------|------|---------|
| APIYI (apiyi.com) | 稳定低价，支持 Claude/GPT/Gemini | 官方价的 30-50% |
| New API (newapi.ai) | CC Switch 深度集成，一键导入 | 多种套餐 |
| AICodeMirror | 企业级并发，快速开票 | 官方 38% |
| PackyCode | 高效 API 中继 | 专属折扣 |
| SiliconFlow | 国产模型平台，赠送体验金 ¥16 | 按量计费 |

### 选择建议

**个人开发者：**
- 轻度使用 → Pro 订阅 或 Token Plan 按量买
- 重度使用 → Max 或 Cursor Ultra 更划算
- 国内用户 → GLM Coding Plan / SiliconFlow 按量计费

**团队/企业：**
- 小团队 → Team Premium 或 Cursor Business
- 大企业 → Enterprise + API Relay 组合
- 国内企业 → CodeBuddy / GLM 私有化部署

**省钱技巧：**
- 用 Sonnet 处理日常任务，Opus 只处理复杂架构决策
- 充分利用 Prompt Caching（缓存命中可节省 80-90% 输入成本）
- 长会话比多个短会话更省（缓存持续命中）
- 非实时任务用 Batch API（半价）

---

## 常见问题

**Q: 哪个工具最好？**
A: 没有最好，只有最合适。Cursor 功能最强但贵，Trae 国内版免费又好用。

**Q: 能同时用多个吗？**
A: 可以。推荐一个主力（IDE 类），一个辅助（CLI 类），如 Cursor + Claude Code 或 Trae + Cursor。

**Q: 国内工具够用吗？**
A: 够。Trae 国内版免费且功能完整，CodeBuddy 企业级。对大多数场景来说，国产模型（豆包、DeepSeek）编程能力已接近国际水平。

**Q: 免费版够用吗？**
A: 看情况。Trae 国内版完全免费，Gemini CLI 也免费，轻度使用完全够。重度使用建议付费版。

**Q: CLI 工具和 IDE 工具有什么区别？**
A: CLI（如 Claude Code、Gemini CLI）在终端运行，适合处理复杂任务和自动化流程；IDE（如 Cursor、Trae）有图形界面，适合日常编码。互补关系，可以一起用。

---

## 下一步

根据你的情况选择工具：

1. **国内开发者**：[Trae 国内版](https://trae.ai)（免费）
2. **要最佳体验**：[Cursor](https://cursor.com)（$20/月）
3. **VS Code 用户**：[GitHub Copilot](https://github.com/features/copilot)
4. **终端爱好者**：[Claude Code](https://code.claude.com) / [Gemini CLI](https://developers.google.com/gemini-code-assist/docs/gemini-cli)
5. **隐私优先**：[Tabnine](https://tabnine.com) / [Aider](https://aider.chat)
6. **AWS 用户**：[Amazon Q Developer](https://aws.amazon.com/q/developer/)
7. **腾讯生态**：[CodeBuddy](https://cloud.tencent.com/product/codebuddy)
8. **Vibe Coding**：[v0](https://v0.dev) / [Lovable](https://lovable.dev) / [Bolt.new](https://bolt.new)
9. **开源方案**：[Aider](https://aider.chat) / [Continue.dev](https://continue.dev)
10. **快速原型**：[Replit](https://replit.com)

选一个试用一周，感受差异。

[继续学习：最佳实践 →](/agent-ecosystem/06-ai-coding-tools/04-best-practices)
