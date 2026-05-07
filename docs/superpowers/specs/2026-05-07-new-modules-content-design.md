# 新增基础模块设计方案

> 日期：2026-05-07
> 状态：已批准
> 背景：基于 2025-2026 年 AI 技术趋势搜索调研，补充现有 15 个基础模块未覆盖的热门方向

## 概述

新增 5 个基础模块 + 更新 1 个现有模块，新增 32 篇文章。项目总规模从 154 篇扩展到 186 篇。

编号按路径分类跳号：`ai-basics/` 和 `agent-ecosystem/` 各自独立编号。

## 模块清单

### 模块 16：AI 音频与音乐生成

- **路径**：`agent-ecosystem/16-ai-audio-generation/`
- **文章数**：6 篇
- **文章列表**：
  1. 概述 — AI 音频技术的现状与分类
  2. 文本转语音(TTS) — ElevenLabs、IndexTTS、豆包语音
  3. AI 音乐生成 — Suno、Boomy、海绵音乐、Mubert
  4. 声音克隆与音效 — ElevenLabs Voice Clone、声音设计
  5. 商业应用场景 — 播客、短视频配乐、有声书、广告配音
  6. 工具横评与选型 — 各工具能力对比、免费额度、适用场景
- **检验标准**：能用至少一个 AI 音频工具生成可用的语音或音乐素材

### 模块 17：AI 搜索与知识获取

- **路径**：`agent-ecosystem/17-ai-search-knowledge/`
- **文章数**：6 篇
- **文章列表**：
  1. 概述 — 从关键词搜索到 AI 问答搜索的范式变革
  2. Perplexity 与 AI 搜索范式 — Perplexity 的使用方法与搜索思维
  3. 国内 AI 搜索工具 — 秘塔AI搜索、纳米AI、腾讯元宝搜索、Kimi 搜索
  4. Deep Research 深度研究 — Google Deep Research、Gemini 深度研究模式
  5. 搜索方法论与提示词 — 如何向 AI 搜索工具提好问题
  6. 工具横评与选型 — 各工具能力对比、适用场景
- **检验标准**：能用 AI 搜索工具完成一次完整的研究任务，并说清楚它与传统搜索的区别

### 模块 18：零代码 Agent 构建

- **路径**：`agent-ecosystem/18-nocode-agent-building/`
- **文章数**：6 篇
- **文章列表**：
  1. 概述 — 不写代码也能搭 Agent 的时代
  2. Coze(扣子)上手 — 创建智能体、配置人设与提示词
  3. Dify 平台实践 — 工作流编排、LLM 节点配置
  4. 知识库与工作流编排 — 上传文档构建知识库、设计多步工作流
  5. 插件与工具调用 — 搜索插件、代码执行、图像生成等能力扩展
  6. 从想法到上线的完整案例 — 从需求分析到 Agent 部署的全流程实战
- **覆盖平台**：Coze(扣子)、Dify、FastGPT
- **检验标准**：能用零代码平台搭建一个具备知识库和工作流的 Agent，并成功部署

### 模块 06（更新）：AI 编程工具全景

- **路径**：`agent-ecosystem/06-ai-coding-tools/`
- **变化**：文章数从 6 篇扩展到 8 篇，内容全面更新
- **文章列表**：
  1. AI 编程概述与趋势 — 从代码补全到自主 Agent 的范式演变
  2. Cursor 深度使用 — Cursor 3.x 的 Agent 模式、Composer、多仓库支持
  3. Claude Code 深度使用 — 终端 Agent、CLAUDE.md、Hooks/Skills、Worktree
  4. Windsurf/Antigravity — Cascade 引擎、Arena Mode、Google 收购后的变化
  5. OpenAI Codex 与 Kiro — Codex CLI 沙箱执行、Amazon Kiro 规格驱动开发
  6. Trae 与国内编程工具 — 字节 Trae、其他国内 AI 编程工具
  7. 工具组合与最佳实践 — "Cursor 做手、Claude Code 做脑"的组合策略
  8. 从零搭建 Web 应用实战 — 用 AI 编程工具完成一个完整项目的端到端演示
- **检验标准**：能根据不同场景选择合适的 AI 编程工具组合，并用工具从零完成一个完整项目

### 模块 20：DeepSeek 与国产大模型

- **路径**：`ai-basics/20-domestic-llm/`
- **文章数**：6 篇
- **文章列表**：
  1. 国产大模型崛起背景 — 2024-2026 年国产模型发展脉络与全球竞争格局
  2. DeepSeek 深度解析 — DeepSeek V4/R1 的技术特点、开源生态、使用指南
  3. 通义千问与 Qwen 生态 — 阿里云百炼平台、Qwen 模型家族、ModelScope 社区
  4. 豆包与字节 AI 矩阵 — 豆包大模型、火山引擎、扣子生态联动
  5. Kimi 与其他国产模型 — Kimi K2.5 超长上下文、文心一言、智谱 GLM、讯飞星火、MiniMax
  6. 国产模型 vs 海外模型选型指南 — 能力对比、成本分析、场景推荐
- **检验标准**：能说清至少 3 个国产大模型的核心优势和适用场景，能根据需求选择合适的模型

### 模块 21：AI 自动化工作流

- **路径**：`agent-ecosystem/21-ai-automation-workflow/`
- **文章数**：6 篇
- **文章列表**：
  1. 概述 — 从"用工具"到"造流水线"的思维跃迁
  2. Zapier 与 AI 自动化 — Zapier Agents、触发器与动作、AI 步骤配置
  3. n8n + AI 实践 — 开源自动化平台、AI 节点、本地部署
  4. Make + AI 工作流 — 可视化编排、AI 模块、场景路由
  5. 从工具链到自动化流水线 — 设计思路：信息抓取 → AI 处理 → 分发推送
  6. 综合实战：搭建个人 AI 工作站 — 把前面学到的工具串联成完整工作流
- **覆盖工具**：Zapier/Zapier Agents、n8n、Make、Coze 工作流
- **检验标准**：能搭建一个包含 3 个以上节点的 AI 自动化工作流，并实际运行出结果

## 影响范围

### 需要更新的现有文件

1. **`config/index.md`** — 首页 features 区块新增 5 个模块卡片（模块 6 已存在，更新描述）
2. **`config/preface.md`** — 序言新增 5 个模块的介绍段落
3. **`config/.vitepress/config.mts`** — sidebar 和 nav 配置新增 5 个模块的目录
4. **`README.md`** — 内容架构表格更新

### 新增目录

```
config/basics/ (使用 ai-basics 路径)
└── 20-domestic-llm/
    └── index.md + 5 篇文章

config/basics/ (使用 agent-ecosystem 路径)
└── 16-ai-audio-generation/
    └── index.md + 5 篇文章
└── 17-ai-search-knowledge/
    └── index.md + 5 篇文章
└── 18-nocode-agent-building/
    └── index.md + 5 篇文章
└── 21-ai-automation-workflow/
    └── index.md + 5 篇文章
```

### 首页标语更新

```
15 个基础模块 + 3 个深度指南 + 6 个附录 · 共 154 篇文档
→
20 个基础模块 + 3 个深度指南 + 6 个附录 · 共 186 篇文档
```
