# 新增基础模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 5 个基础模块 + 更新模块 6，共新增 32 篇文章，将项目从 154 篇扩展到 186 篇。

**Architecture:** 每个模块包含 index.md + 5-7 篇文章，采用现有模块的 Markdown 格式。需同步更新 config.mts 的 nav/sidebar、index.md 首页、preface.md 序言。

**Tech Stack:** Markdown + VitePress + vitepress-theme-teek

**Spec:** `docs/superpowers/specs/2026-05-07-new-modules-content-design.md`

---

## 文件结构总览

### 新增目录
```
config/agent-ecosystem/16-ai-audio-generation/
config/agent-ecosystem/17-ai-search-knowledge/
config/agent-ecosystem/18-nocode-agent-building/
config/ai-basics/20-domestic-llm/
config/agent-ecosystem/21-ai-automation-workflow/
```

### 需修改的现有文件
```
config/.vitepress/config.mts          — nav + sidebar 配置
config/index.md                        — 首页 features + 标语
config/preface.md                      — 序言新增模块介绍
```

### 需重写的现有文件
```
config/agent-ecosystem/06-ai-coding-tools/index.md      — 扩展为 8 篇
config/agent-ecosystem/06-ai-coding-tools/01-cursor.md  — 更新至 Cursor 3.x
config/agent-ecosystem/06-ai-coding-tools/02-claude-code.md — 更新至 Claude Code 2.1
config/agent-ecosystem/06-ai-coding-tools/03-other-tools.md — 重写为 Windsurf/Antigravity 专题
config/agent-ecosystem/06-ai-coding-tools/04-best-practices.md — 重写为 OpenAI Codex 与 Kiro
config/agent-ecosystem/06-ai-coding-tools/05-environment-setup.md — 重写为 Trae 与国内编程工具
config/agent-ecosystem/06-ai-coding-tools/06-cc-switch.md — 重写为工具组合与最佳实践
```

### 新增文件（模块 6 扩展）
```
config/agent-ecosystem/06-ai-coding-tools/07-full-project-practice.md — 新增
```

---

## Task 1: 创建模块 16 — AI 音频与音乐生成

**Files:**
- Create: `config/agent-ecosystem/16-ai-audio-generation/index.md`
- Create: `config/agent-ecosystem/16-ai-audio-generation/01-overview.md`
- Create: `config/agent-ecosystem/16-ai-audio-generation/02-tts.md`
- Create: `config/agent-ecosystem/16-ai-audio-generation/03-music-generation.md`
- Create: `config/agent-ecosystem/16-ai-audio-generation/04-voice-clone.md`
- Create: `config/agent-ecosystem/16-ai-audio-generation/05-business-application.md`
- Create: `config/agent-ecosystem/16-ai-audio-generation/06-tool-comparison.md`

- [ ] **Step 1: 创建目录和 index.md**

参照 `config/agent-ecosystem/12-ai-video-generation/index.md` 的格式，创建模块 16 的 index.md。包含：学习目标、章节概述表格（6 篇文章的标题、主题、难度）、适用人群、前置知识、学习建议、学习检验。

- [ ] **Step 2: 撰写 01-overview.md**

AI 音频技术概述：TTS、AI 音乐、声音克隆三大分类；2024-2026 发展脉络；市场规模；与 Agent 多模态能力的关系。

- [ ] **Step 3: 撰写 02-tts.md**

文本转语音：ElevenLabs（多语言、声音克隆）、IndexTTS（开源）、豆包语音（中文优化）、Edge TTS（免费）。每个工具的注册、使用方法、免费额度。

- [ ] **Step 4: 撰写 03-music-generation.md**

AI 音乐生成：Suno（文本生成完整歌曲）、Boomy（快速创作）、海绵音乐/Sponge Music（短视频 BGM）、Mubert（氛围音乐）。提示词设计、风格控制。

- [ ] **Step 5: 撰写 04-voice-clone.md**

声音克隆与音效：ElevenLabs Voice Clone（上传音频克隆声音）、声音设计（音效生成）、伦理与版权注意事项。

- [ ] **Step 6: 撰写 05-business-application.md**

商业场景：播客制作（TTS+配音）、短视频配乐、有声书、广告配音、游戏音效、教育培训。每个场景的工具推荐和工作流。

- [ ] **Step 7: 撰写 06-tool-comparison.md**

工具横评：各工具的功能矩阵、免费额度对比、音质对比、适用场景推荐。末尾附"检验标准"。

- [ ] **Step 8: Commit**

```bash
git add config/agent-ecosystem/16-ai-audio-generation/
git commit -m "docs: 新增模块 16 — AI 音频与音乐生成（6 篇文章）"
```

---

## Task 2: 创建模块 17 — AI 搜索与知识获取

**Files:**
- Create: `config/agent-ecosystem/17-ai-search-knowledge/index.md`
- Create: `config/agent-ecosystem/17-ai-search-knowledge/01-overview.md`
- Create: `config/agent-ecosystem/17-ai-search-knowledge/02-perplexity.md`
- Create: `config/agent-ecosystem/17-ai-search-knowledge/03-china-search-tools.md`
- Create: `config/agent-ecosystem/17-ai-search-knowledge/04-deep-research.md`
- Create: `config/agent-ecosystem/17-ai-search-knowledge/05-search-methodology.md`
- Create: `config/agent-ecosystem/17-ai-search-knowledge/06-tool-comparison.md`

- [ ] **Step 1: 创建目录和 index.md**

参照模块 12 index.md 格式。6 篇文章的章节表格。

- [ ] **Step 2: 撰写 01-overview.md**

搜索范式变革：关键词搜索 → AI 问答搜索。为什么 AI 搜索是所有学习行为的入口。传统搜索 vs AI 搜索的核心区别。

- [ ] **Step 3: 撰写 02-perplexity.md**

Perplexity 详解：注册使用、搜索模式（Focus、Academic、Writing）、Pro Search 多步推理、Source 引用机制。与 Google 搜索的使用习惯对比。

- [ ] **Step 4: 撰写 03-china-search-tools.md**

国内 AI 搜索工具：秘塔AI搜索（简洁/深入/研究三档）、纳米AI（多智能体蜂群）、腾讯元宝搜索（微信生态）、Kimi 搜索（长文档）。每个工具的特色和使用场景。

- [ ] **Step 5: 撰写 04-deep-research.md**

Deep Research 深度研究：Google Gemini Deep Research（自动生成研究报告）、Perplexity Deep Research。适用于论文调研、市场分析、技术选型等场景。

- [ ] **Step 6: 撰写 05-search-methodology.md**

搜索方法论：如何向 AI 搜索工具提好问题（结构化提问、追问技巧、多轮对话）、信息交叉验证、信源评估。

- [ ] **Step 7: 撰写 06-tool-comparison.md**

工具横评与选型：功能矩阵、免费额度、中文支持、适用场景。末尾附"检验标准"。

- [ ] **Step 8: Commit**

```bash
git add config/agent-ecosystem/17-ai-search-knowledge/
git commit -m "docs: 新增模块 17 — AI 搜索与知识获取（6 篇文章）"
```

---

## Task 3: 创建模块 18 — 零代码 Agent 构建

**Files:**
- Create: `config/agent-ecosystem/18-nocode-agent-building/index.md`
- Create: `config/agent-ecosystem/18-nocode-agent-building/01-overview.md`
- Create: `config/agent-ecosystem/18-nocode-agent-building/02-coze.md`
- Create: `config/agent-ecosystem/18-nocode-agent-building/03-dify.md`
- Create: `config/agent-ecosystem/18-nocode-agent-building/04-knowledge-workflow.md`
- Create: `config/agent-ecosystem/18-nocode-agent-building/05-plugins-tools.md`
- Create: `config/agent-ecosystem/18-nocode-agent-building/06-full-case.md`

- [ ] **Step 1: 创建目录和 index.md**

参照现有模块格式。强调"不写代码也能搭 Agent"的定位。

- [ ] **Step 2: 撰写 01-overview.md**

零代码 Agent 构建概述：为什么零代码是入门最佳路径；Coze vs Dify vs FastGPT 定位对比；从"用 AI"到"造 AI"的思维转变。

- [ ] **Step 3: 撰写 02-coze.md**

Coze(扣子)上手：注册、创建智能体、配置人设与提示词、添加知识库、设置开场白。国际版与国内版的区别。

- [ ] **Step 4: 撰写 03-dify.md**

Dify 平台实践：部署方式（云/本地）、工作流编排器、LLM 节点配置、变量传递、条件分支。与 Coze 的架构差异。

- [ ] **Step 5: 撰写 04-knowledge-workflow.md**

知识库与工作流编排：上传文档构建知识库（PDF/网页/数据库）、分块策略、检索方式；多步工作流设计（输入 → 检索 → 处理 → 输出）。

- [ ] **Step 6: 撰写 05-plugins-tools.md**

插件与工具调用：搜索插件、代码执行、图像生成、API 调用等能力扩展。自定义工具的接入方法。

- [ ] **Step 7: 撰写 06-full-case.md**

完整案例：从需求分析到 Agent 上线的全流程。以"个人学习助手"为例，覆盖需求拆解 → 知识库准备 → 工作流设计 → 插件配置 → 测试 → 部署。末尾附"检验标准"。

- [ ] **Step 8: Commit**

```bash
git add config/agent-ecosystem/18-nocode-agent-building/
git commit -m "docs: 新增模块 18 — 零代码 Agent 构建（6 篇文章）"
```

---

## Task 4: 更新模块 06 — AI 编程工具全景

**Files:**
- Rewrite: `config/agent-ecosystem/06-ai-coding-tools/index.md`
- Rewrite: `config/agent-ecosystem/06-ai-coding-tools/01-cursor.md`
- Rewrite: `config/agent-ecosystem/06-ai-coding-tools/02-claude-code.md`
- Rewrite: `config/agent-ecosystem/06-ai-coding-tools/03-other-tools.md`
- Rewrite: `config/agent-ecosystem/06-ai-coding-tools/04-best-practices.md`
- Rewrite: `config/agent-ecosystem/06-ai-coding-tools/05-environment-setup.md`
- Rewrite: `config/agent-ecosystem/06-ai-coding-tools/06-cc-switch.md`
- Create: `config/agent-ecosystem/06-ai-coding-tools/07-full-project-practice.md`

**重要**：此 Task 需要重写现有文件。建议先读取每个现有文件了解当前内容，再进行更新。保留有价值的内容，补充新工具和 2026 年最新信息。

- [ ] **Step 1: 重写 index.md**

扩展章节表格从 6 项到 8 项：概述 → Cursor → Claude Code → Windsurf/Antigravity → Codex 与 Kiro → Trae 与国内工具 → 工具组合最佳实践 → 从零搭建实战。

- [ ] **Step 2: 更新 01-cursor.md**

更新至 Cursor 3.x：Agent 模式、Composer 2、多仓库支持、异步子智能体。保留原有的基础使用指南，补充新功能。

- [ ] **Step 3: 更新 02-claude-code.md**

更新至 Claude Code 2.1：原生 CLI 二进制、CLAUDE.md、Hooks/Skills、/loop、Git Worktree 并行会话。保留原有内容，补充新功能。

- [ ] **Step 4: 重写 03-other-tools.md → Windsurf/Antigravity**

完全重写为 Windsurf/Antigravity 专题：Cascade 引擎、Arena Mode、Google 收购后的变化、定价调整。原"其他工具"内容分散到后续文章。

- [ ] **Step 5: 重写 04-best-practices.md → OpenAI Codex 与 Kiro**

重写为 OpenAI Codex CLI 和 Amazon Kiro 专题：Codex 沙箱执行、Kiro 规格驱动开发。

- [ ] **Step 6: 重写 05-environment-setup.md → Trae 与国内编程工具**

重写为 Trae（字节跳动）和其他国内 AI 编程工具介绍。包含环境搭建的通用指南。

- [ ] **Step 7: 重写 06-cc-switch.md → 工具组合与最佳实践**

重写为工具组合策略："Cursor 做手、Claude Code 做脑、Codex 做腿"。成本计算、场景匹配、黄金组合方案。CC Switch 内容整合到工具组合部分。

- [ ] **Step 8: 创建 07-full-project-practice.md**

新增：用 AI 编程工具从零搭建一个 Web 应用的端到端演示。包含需求分析 → 工具选择 → 编码 → 测试 → 部署的完整过程。末尾附"检验标准"。

- [ ] **Step 9: Commit**

```bash
git add config/agent-ecosystem/06-ai-coding-tools/
git commit -m "docs: 更新模块 06 — AI 编程工具全景（6→8 篇，覆盖 2026 新格局）"
```

---

## Task 5: 创建模块 20 — DeepSeek 与国产大模型

**Files:**
- Create: `config/ai-basics/20-domestic-llm/index.md`
- Create: `config/ai-basics/20-domestic-llm/01-overview.md`
- Create: `config/ai-basics/20-domestic-llm/02-deepseek.md`
- Create: `config/ai-basics/20-domestic-llm/03-qwen.md`
- Create: `config/ai-basics/20-domestic-llm/04-doubao.md`
- Create: `config/ai-basics/20-domestic-llm/05-kimi-others.md`
- Create: `config/ai-basics/20-domestic-llm/06-model-selection.md`

- [ ] **Step 1: 创建目录和 index.md**

放在 `ai-basics/` 路径下（与 LLM 基础、模型训练等同级）。参照 ai-basics 其他模块的 index 格式。

- [ ] **Step 2: 撰写 01-overview.md**

国产大模型崛起背景：2023-2026 发展脉络（从追赶者到并跑者）、全球竞争格局、开源 vs 闭源路线、国产模型的独特优势（中文、成本、本地化）。

- [ ] **Step 3: 撰写 02-deepseek.md**

DeepSeek 深度解析：V4 模型能力（本项目的内容生成工具）、R1 推理模型的突破、开源生态、API 使用指南、与 Claude/GPT 的对比。

- [ ] **Step 4: 撰写 03-qwen.md**

通义千问与 Qwen 生态：Qwen 模型家族（Qwen2.5、Qwen-Coder）、阿里云百炼平台、ModelScope 社区、开源权重部署。

- [ ] **Step 5: 撰写 04-doubao.md**

豆包与字节 AI 矩阵：豆包大模型能力、火山引擎 API、扣子生态联动、字节系产品的 AI 底座。

- [ ] **Step 6: 撰写 05-kimi-others.md**

Kimi K2.5（超长上下文、多 Agent 并行）、文心一言、智谱 GLM、讯飞星火、MiniMax。每个模型的核心特点和适用场景。

- [ ] **Step 7: 撰写 06-model-selection.md**

选型指南：国产 vs 海外模型的能力对比矩阵（推理、代码、中文、多模态）、成本分析（API 定价对比）、场景推荐。末尾附"检验标准"。

- [ ] **Step 8: Commit**

```bash
git add config/ai-basics/20-domestic-llm/
git commit -m "docs: 新增模块 20 — DeepSeek 与国产大模型（6 篇文章）"
```

---

## Task 6: 创建模块 21 — AI 自动化工作流

**Files:**
- Create: `config/agent-ecosystem/21-ai-automation-workflow/index.md`
- Create: `config/agent-ecosystem/21-ai-automation-workflow/01-overview.md`
- Create: `config/agent-ecosystem/21-ai-automation-workflow/02-zapier.md`
- Create: `config/agent-ecosystem/21-ai-automation-workflow/03-n8n.md`
- Create: `config/agent-ecosystem/21-ai-automation-workflow/04-make.md`
- Create: `config/agent-ecosystem/21-ai-automation-workflow/05-pipeline-design.md`
- Create: `config/agent-ecosystem/21-ai-automation-workflow/06-personal-workstation.md`

- [ ] **Step 1: 创建目录和 index.md**

参照现有模块格式。定位为"毕业课"——把前面所有工具串联起来。

- [ ] **Step 2: 撰写 01-overview.md**

概述：从"用工具"到"造流水线"的思维跃迁。自动化工作流的价值（减少重复操作、保证一致性、7×24 运行）。Zapier/n8n/Make 三大平台定位对比。

- [ ] **Step 3: 撰写 02-zapier.md**

Zapier 与 AI 自动化：触发器与动作机制、AI 步骤配置、Zapier Agents（自主决策步骤）。典型场景：邮件→AI 总结→Notion 笔记。

- [ ] **Step 4: 撰写 03-n8n.md**

n8n + AI 实践：开源优势、本地部署（Docker）、AI 节点（OpenAI/Anthropic）、自定义工作流。与 Zapier 的对比（开源 vs SaaS）。

- [ ] **Step 5: 撰写 04-make.md**

Make + AI 工作流：可视化编排器、AI 模块、场景路由、错误处理。与 Zapier/n8n 的差异化。

- [ ] **Step 6: 撰写 05-pipeline-design.md**

流水线设计方法论：信息抓取 → AI 处理（总结/分析/生成）→ 分发推送（邮件/飞书/微信）。设计原则、常见模式、调试技巧。衔接模块 18 的 Coze 工作流。

- [ ] **Step 7: 撰写 06-personal-workstation.md**

综合实战：搭建个人 AI 工作站。把前面模块学的工具全部串联——AI 搜索获取信息 → AI 总结提炼 → AI 生成内容 → 自动化分发。完整案例+配置截图。末尾附"检验标准"。

- [ ] **Step 8: Commit**

```bash
git add config/agent-ecosystem/21-ai-automation-workflow/
git commit -m "docs: 新增模块 21 — AI 自动化工作流（6 篇文章）"
```

---

## Task 7: 更新站点配置

**Files:**
- Modify: `config/.vitepress/config.mts`
- Modify: `config/index.md`
- Modify: `config/preface.md`

**依赖：** Task 1-6 全部完成后再执行。

- [ ] **Step 1: 更新 config.mts — nav 配置**

在 `themeConfig.nav` 中：
- "AI 基础知识" 下拉新增：`{ text: '国产大模型', link: '/ai-basics/20-domestic-llm/' }`
- "Agent 生态" 下拉新增：
  - `{ text: 'AI 音频生成', link: '/agent-ecosystem/16-ai-audio-generation/' }`
  - `{ text: 'AI 搜索', link: '/agent-ecosystem/17-ai-search-knowledge/' }`
  - `{ text: '零代码 Agent', link: '/agent-ecosystem/18-nocode-agent-building/' }`
  - `{ text: '自动化工作流', link: '/agent-ecosystem/21-ai-automation-workflow/' }`

- [ ] **Step 2: 更新 config.mts — sidebar /ai-basics/ 配置**

在 `sidebar['/ai-basics/'].items[0].items` 数组末尾新增模块 20 的 sidebar 配置块：

```typescript
{
  text: 'DeepSeek 与国产大模型',
  collapsed: true,
  items: [
    { text: '模块介绍', link: '20-domestic-llm/' },
    { text: '国产大模型崛起背景', link: '20-domestic-llm/01-overview' },
    { text: 'DeepSeek 深度解析', link: '20-domestic-llm/02-deepseek' },
    { text: '通义千问与 Qwen 生态', link: '20-domestic-llm/03-qwen' },
    { text: '豆包与字节 AI 矩阵', link: '20-domestic-llm/04-doubao' },
    { text: 'Kimi 与其他国产模型', link: '20-domestic-llm/05-kimi-others' },
    { text: '国产 vs 海外选型指南', link: '20-domestic-llm/06-model-selection' },
  ]
},
```

- [ ] **Step 3: 更新 config.mts — sidebar /agent-ecosystem/ 配置（新模块）**

在 `sidebar['/agent-ecosystem/'].items[0].items` 数组中，AI 图像生成之后新增 4 个模块的 sidebar 配置块：

```typescript
{
  text: 'AI 音频与音乐生成',
  collapsed: true,
  items: [
    { text: '模块介绍', link: '16-ai-audio-generation/' },
    { text: 'AI 音频概述', link: '16-ai-audio-generation/01-overview' },
    { text: '文本转语音', link: '16-ai-audio-generation/02-tts' },
    { text: 'AI 音乐生成', link: '16-ai-audio-generation/03-music-generation' },
    { text: '声音克隆与音效', link: '16-ai-audio-generation/04-voice-clone' },
    { text: '商业应用场景', link: '16-ai-audio-generation/05-business-application' },
    { text: '工具横评与选型', link: '16-ai-audio-generation/06-tool-comparison' },
  ]
},
{
  text: 'AI 搜索与知识获取',
  collapsed: true,
  items: [
    { text: '模块介绍', link: '17-ai-search-knowledge/' },
    { text: 'AI 搜索概述', link: '17-ai-search-knowledge/01-overview' },
    { text: 'Perplexity', link: '17-ai-search-knowledge/02-perplexity' },
    { text: '国内 AI 搜索工具', link: '17-ai-search-knowledge/03-china-search-tools' },
    { text: 'Deep Research', link: '17-ai-search-knowledge/04-deep-research' },
    { text: '搜索方法论', link: '17-ai-search-knowledge/05-search-methodology' },
    { text: '工具横评与选型', link: '17-ai-search-knowledge/06-tool-comparison' },
  ]
},
{
  text: '零代码 Agent 构建',
  collapsed: true,
  items: [
    { text: '模块介绍', link: '18-nocode-agent-building/' },
    { text: '零代码 Agent 概述', link: '18-nocode-agent-building/01-overview' },
    { text: 'Coze(扣子)上手', link: '18-nocode-agent-building/02-coze' },
    { text: 'Dify 平台实践', link: '18-nocode-agent-building/03-dify' },
    { text: '知识库与工作流编排', link: '18-nocode-agent-building/04-knowledge-workflow' },
    { text: '插件与工具调用', link: '18-nocode-agent-building/05-plugins-tools' },
    { text: '从想法到上线', link: '18-nocode-agent-building/06-full-case' },
  ]
},
{
  text: 'AI 自动化工作流',
  collapsed: true,
  items: [
    { text: '模块介绍', link: '21-ai-automation-workflow/' },
    { text: '自动化工作流概述', link: '21-ai-automation-workflow/01-overview' },
    { text: 'Zapier 与 AI 自动化', link: '21-ai-automation-workflow/02-zapier' },
    { text: 'n8n + AI 实践', link: '21-ai-automation-workflow/03-n8n' },
    { text: 'Make + AI 工作流', link: '21-ai-automation-workflow/04-make' },
    { text: '流水线设计方法论', link: '21-ai-automation-workflow/05-pipeline-design' },
    { text: '搭建个人 AI 工作站', link: '21-ai-automation-workflow/06-personal-workstation' },
  ]
},
```

- [ ] **Step 4: 更新 config.mts — sidebar 模块 6（AI 编程工具）**

替换现有模块 6 的 sidebar 配置为 8 项：

```typescript
{
  text: 'AI 编程工具全景',
  collapsed: true,
  items: [
    { text: '模块介绍', link: '06-ai-coding-tools/' },
    { text: 'AI 编程概述与趋势', link: '06-ai-coding-tools/01-cursor' },  // 注意：文件名不变，内容更新
    { text: 'Cursor 深度使用', link: '06-ai-coding-tools/01-cursor' },
    { text: 'Claude Code 深度使用', link: '06-ai-coding-tools/02-claude-code' },
    { text: 'Windsurf/Antigravity', link: '06-ai-coding-tools/03-other-tools' },
    { text: 'OpenAI Codex 与 Kiro', link: '06-ai-coding-tools/04-best-practices' },
    { text: 'Trae 与国内编程工具', link: '06-ai-coding-tools/05-environment-setup' },
    { text: '工具组合与最佳实践', link: '06-ai-coding-tools/06-cc-switch' },
    { text: '从零搭建实战', link: '06-ai-coding-tools/07-full-project-practice' },
  ]
},
```

**注意**：现有文件名保持不变（01-cursor.md ~ 06-cc-switch.md），避免破坏已有链接。只新增 07-full-project-practice.md。sidebar 的 text 标签更新为新内容。

- [ ] **Step 5: 更新 index.md 首页**

更新标语：
```
15 个基础模块 + 3 个深度指南 + 6 个附录 · 共 154 篇文档
→
20 个基础模块 + 3 个深度指南 + 6 个附录 · 共 186 篇文档
```

在 features 数组中，模块 15（Markdown 阅读工具）之后新增 5 个 feature 卡片（模块 6 已存在，更新其 details 描述）：

```yaml
- title: 🎵 AI 音频与音乐生成
  details: Suno、ElevenLabs、Boomy——文本转语音、AI 作曲、声音克隆。从"看文字"到"能听能说"。
  link: /agent-ecosystem/16-ai-audio-generation/
  linkText: 学习音频生成

- title: 🔍 AI 搜索与知识获取
  details: Perplexity、秘塔AI搜索、Deep Research——新一代搜索不是"找链接"，是"直接给答案"。
  link: /agent-ecosystem/17-ai-search-knowledge/
  linkText: 学习 AI 搜索

- title: 🧪 零代码 Agent 构建
  details: Coze、Dify、FastGPT——不写代码也能搭 Agent。配置知识库、编排工作流、一键部署。
  link: /agent-ecosystem/18-nocode-agent-building/
  linkText: 搭建 Agent

- title: 🇨🇳 DeepSeek 与国产大模型
  details: DeepSeek V4/R1、通义千问、豆包、Kimi——国产模型已是学习者的主流选择，不是备选方案。
  link: /ai-basics/20-domestic-llm/
  linkText: 了解国产模型

- title: ⚡ AI 自动化工作流
  details: Zapier、n8n、Make——把零散的 AI 能力串成流水线。整个基础模块的毕业课。
  link: /agent-ecosystem/21-ai-automation-workflow/
  linkText: 搭建工作流
```

同时更新模块 6 的 details：
```yaml
- title: 💻 AI 编程工具
  details: Cursor、Claude Code、Windsurf、Codex、Kiro、Trae——2026 年 AI 编程工具格局已大变，全面对比帮你选对工具。
```

- [ ] **Step 6: 更新 preface.md 序言**

在"基础知识（15个模块）"部分，将标题改为"基础知识（20个模块）"。在模块 15 之后新增 5 个模块的介绍段落。在"深度指南"和"附录"段落之前插入。

在序言底部的统计更新：
```
> **154 篇文档 · 15 个模块 · 3 个深度专题 · 6 个附录**
→
> **186 篇文档 · 20 个模块 · 3 个深度专题 · 6 个附录**
```

- [ ] **Step 7: Commit**

```bash
git add config/.vitepress/config.mts config/index.md config/preface.md
git commit -m "feat: 更新站点配置，新增 5 个模块的 nav/sidebar 和首页卡片"
```

---

## Task 8: 构建验证与最终检查

**依赖：** Task 1-7 全部完成后再执行。

- [ ] **Step 1: 运行本地开发服务器验证**

```bash
pnpm run docs:dev
```

验证：
- 首页显示 20 个模块卡片
- 顶部导航栏新增模块可点击
- 侧边栏展开可看到所有新模块的文章列表
- 点击链接可正常跳转到文章页面

- [ ] **Step 2: 运行构建验证**

```bash
pnpm run docs:build
```

预期：构建成功，无 404 链接错误。

- [ ] **Step 3: 检查所有文章的"检验标准"**

确认每个模块的最后一篇文章或 index.md 包含"检验标准"小节，内容与 spec 一致。

- [ ] **Step 4: 最终 Commit**

如有修复：
```bash
git add -A
git commit -m "fix: 修正在构建验证中发现的问题"
```
