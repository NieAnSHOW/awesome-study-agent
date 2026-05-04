---
sidebar: false
---

# 课程目录结构

> 完整的学习路径，从基础到实战，系统性掌握 AI Agent

## 目录说明

教程采用模块化设计，每章独立且递进。你可以：
- 按顺序系统学习（推荐零基础学习者）
- 根据需要跳转到特定章节（适合有基础的学习者）
- 以实战项目为中心，反向学习所需知识（快速验证想法）


## 基础型路径（Basics）

**目标**：系统性掌握 AI 知识，建立完整的认知框架
**预计时间**：3-6 个月
**适合人群**：零基础学习者，希望从原理开始理解

### 第一模块：AI 概述与 Agent 概念（`basics/01-ai-overview/`）

```
01-ai-overview/
├── index.md              # 模块介绍
├── 01-what-is-ai.md      # 什么是 AI？
│   ├── AI 的定义与核心特征
│   ├── 弱 AI vs 强 AI
│   ├── AI 的三大要素：数据、算法、算力
│   └── 思考：AI 会取代人类吗？
│
├── 02-ai-history.md      # AI 发展简史
│   ├── 图灵测试到专家系统（1950-1980s）
│   ├── 深度学习革命（2000s）
│   ├── Transformer 诞生（2017）
│   ├── GPT 系列的演进（2018-2024）
│   └── 重要里程碑时间轴
│
├── 03-ai-agent-concept.md  # 什么是 AI Agent？
│   ├── Agent 的定义：能感知环境并采取行动的实体
│   ├── Agent vs 传统的 AI 助手
│   ├── Agent 的三要素：感知、决策、行动
│   ├── Agent 的应用场景
│   └── 案例分析：AutoGPT、BabyAGI
│
└── 04-why-agent-matters.md # 为什么 Agent 是未来？
    ├── 从 Copilot 到 Autopilot
    ├── 一个人就是一个团队
    ├── Agent 的商业价值
    └── 学习 Agent 的意义
```

**学习目标**：建立对 AI 和 Agent 的基本认知，理解为什么 Agent 是下一代 AI 的核心

**检验标准**：能用通俗语言向他人解释什么是 AI Agent


### 第二模块：大语言模型基础（`basics/02-llm-fundamentals/`）

```
02-llm-fundamentals/
├── index.md                    # 模块介绍
├── 01-what-is-llm.md           # 什么是大语言模型？
│   ├── 从语言模型到 ChatGPT
│   ├── 什么是"大"？（参数量、数据量、算力）
│   ├── LLM 能做什么？（文本理解、生成、推理）
│   └── LLM 的局限性（幻觉、知识截止、上下文限制）
│
├── 02-how-llm-works.md         # LLM 如何工作？
│   ├── Transformer 架构简介（无需数学推导）
│   ├── 注意力机制（Attention）的通俗解释
│   ├── 训练过程：预训练 + 微调 + RLHF
│   ├── Token：LLM 的基本单位
│   └── Temperature、Top-p 等参数的含义
│
├── 03-major-models.md          # 主流大模型介绍
│   ├── GPT 系列（OpenAI）
│   ├── Claude 系列（Anthropic）
│   ├── Gemini 系列（Google）
│   ├── LLaMA 系列（Meta）
│   ├── 通义千问、文心一言等国产模型
│   └── 如何选择合适的模型？
│
├── 04-model-capabilities.md    # LLM 的核心能力
│   ├── 文本理解与生成
│   ├── 逻辑推理
│   ├── 代码生成
│   ├── 多模态能力（文本、图像、音频、视频）
│   └── Function Calling（工具调用）
│
└── 05-limits-and-challenges.md # LLM 的挑战
    ├── 幻觉问题（Hallucination）
    ├── 知识截止与实时性问题
    ├── 上下文窗口限制
    ├── 计算与推理的边界
    └── 伦理与安全
```

**学习目标**：理解 LLM 的原理、能力和局限性，为后续学习打下基础

**检验标准**：能解释 Transformer、Token、Temperature 等核心概念


### 第三模块：提示词工程（`basics/03-prompt-engineering/`）

```
03-prompt-engineering/
├── index.md                    # 模块介绍
├── 01-prompt-basics.md         # 提示词基础
│   ├── 什么是提示词？
│   ├── 好提示词的标准（清晰、具体、有上下文）
│   ├── 基本结构：角色 + 任务 + 约束 + 示例
│   └── 常见错误示例
│
├── 02-prompt-patterns.md       # 提示词模式
│   ├── 角色扮演（Role-playing）
│   ├── 思维链（Chain of Thought）
│   ├── 少样本学习（Few-shot Learning）
│   ├── 自我一致性（Self-consistency）
│   └── ReAct 推理（推理 + 行动）
│
├── 03-advanced-techniques.md   # 进阶技巧
│   ├── 提示词链（Chaining）
│   ├── 提示词模板化
│   ├── 结构化输出（JSON、Markdown）
│   ├── 迭代优化方法
│   └── A/B 测试你的提示词
│
├── 04-prompt-for-different-tasks.md # 不同任务的提示词设计
│   ├── 文本创作（写作、翻译、润色）
│   ├── 代码相关（生成、解释、调试）
│   ├── 数据分析（解读、可视化）
│   ├── 问答系统（RAG 场景）
│   └── 创意生成（头脑风暴）
│
└── 05-tools-and-resources.md   # 工具与资源
    ├── 提示词优化工具
    ├── 社区提示词库
    ├── 提示词框架（LangChain、DSPy）
    └── 持续学习的资源
```

**学习目标**：掌握提示词工程的核心方法，能设计高质量的提示词解决实际问题

**检验标准**：能设计出稳定输出高质量结果的提示词

**实践项目**：用提示词完成一个复杂任务（如生成结构化报告）


### 第四模块：Agent 基础与架构（`basics/04-agent-fundamentals/`）

```
04-agent-fundamentals/
├── index.md                    # 模块介绍
├── 01-agent-architecture.md    # Agent 架构
│   ├── Agent 的核心组件
│   │   ├── 感知模块（Perception）
│   │   ├── 决策模块（Brain/Planner）
│   │   ├── 记忆模块（Memory）
│   │   ├── 工具模块（Tools）
│   │   └── 行动模块（Action）
│   ├── 单 Agent vs 多 Agent
│   └── Agent 工作流程
│
├── 02-agent-types.md           # Agent 类型
│   ├── 反应式 Agent（Reactive）
│   ├── 基于目标的 Agent（Goal-based）
│   ├── 基于效用的 Agent（Utility-based）
│   └── 学习型 Agent（Learning）
│
├── 03-memory-system.md         # 记忆系统
│   ├── 短期记忆 vs 长期记忆
│   ├── 向量数据库（Vector DB）
│   ├── RAG（检索增强生成）
│   └── 记忆检索策略
│
├── 04-tool-use.md              # 工具使用
│   ├── Function Calling
│   ├── 工具定义与注册
│   ├── 工具选择与执行
│   └── 常用工具生态（搜索、计算、API 调用）
│
└── 05-planning-and-reasoning.md # 规划与推理
    ├── 任务分解（Task Decomposition）
    ├── 子任务规划
    ├── 反思与自我修正
    └── 推理框架（ReAct、Reflexion）
```

**学习目标**：理解 Agent 的核心组件和工作原理

**检验标准**：能画出 Agent 的架构图并解释各部分的作用

**实践项目**：手动设计一个简单 Agent 的流程（不写代码）


### 第五模块：RAG 与知识增强（`basics/05-rag-knowledge/`）

```
05-rag-knowledge/
├── index.md                    # 模块介绍
├── 01-what-is-rag.md           # 什么是 RAG？
│   ├── RAG 的定义与价值
│   ├── RAG vs Fine-tuning
│   ├── RAG 的适用场景
│   └── RAG 的局限性
│
├── 02-rag-pipeline.md          # RAG 流程
│   ├── 文档加载与处理
│   ├── 文本分块（Chunking）策略
│   ├── 向量化（Embedding）
│   ├── 向量数据库存储
│   ├── 相似度检索
│   └── 生成增强
│
├── 03-embedding.md              # 向量化
│   ├── 什么是 Embedding？
│   ├── 主流 Embedding 模型
│   ├── 相似度计算（余弦、欧几里得）
│   └── Embedding 的应用
│
├── 04-vector-database.md       # 向量数据库
│   ├── 什么是向量数据库？
│   ├── 主流向量数据库对比
│   │   ├── Chroma（轻量级）
│   │   ├── Pinecone（云服务）
│   │   ├── Weaviate（开源）
│   │   └── Milvus（分布式）
│   └── 选择建议
│
├── 05-advanced-rag.md          # 进阶 RAG
│   ├── 混合检索（Hybrid Search）
│   ├── 重排序（Reranking）
│   ├── 查询扩展
│   ├── 多模态 RAG
│   └── Agentic RAG
│
└── 06-rag-practice.md          # RAG 实践
    ├── 搭建第一个 RAG 系统
    ├── 优化检索质量
    ├── 处理大文档
    └── 性能优化
```

**学习目标**：掌握 RAG 技术的原理和实现方法

**检验标准**：能搭建一个基于文档的问答系统

**实践项目**：构建个人知识库问答 Agent


### 第六模块：AI 编程工具（`basics/06-ai-coding-tools/`）

```
06-ai-coding-tools/
├── index.md                    # 模块介绍
├── 01-cursor.md                # Cursor 编辑器
│   ├── Cursor 是什么？
│   ├── 安装与配置
│   ├── 核心功能
│   │   ├── AI Chat（代码对话）
│   │   ├── Tab Autocomplete（自动补全）
│   │   ├── Codebase Understanding（代码理解）
│   │   └── Multi-file Editing（多文件编辑）
│   ├── 快捷键与技巧
│   └── 实战示例
│
├── 02-claude-code.md            # Claude Code
│   ├── Claude Code 是什么？
│   ├── 安装与配置
│   ├── CLI 使用方法
│   ├── 核心能力
│   │   ├── 代码生成
│   │   ├── 代码解释
│   │   ├── Bug 修复
│   │   ├── 重构建议
│   │   └── 测试生成
│   ├── 与 GitHub 集成
│   └── 实战示例
│
├── 03-other-tools.md           # 其他 AI 编程工具
│   ├── GitHub Copilot
│   ├── Codeium
│   ├── Tabnine
│   ├── Bolt.new
│   ├── v0.dev
│   └── 工具对比与选择
│
├── 04-best-practices.md        # 最佳实践
│   ├── AI 编程的工作流程
│   ├── 提示词设计（编程场景）
│   ├── 代码审查策略
│   ├── 安全与隐私
│   └── 避免 AI 依赖
│
└── 05-environment-setup.md     # 开发环境搭建
    ├── 基础环境（Node.js、Python）
    ├── IDE 配置
    ├── AI 工具集成
    └── 项目模板
```

**学习目标**：熟练使用 AI 编程工具提升开发效率

**检验标准**：能用 AI 工具独立完成一个中等复杂度的项目

**实践项目**：用 Cursor/Claude Code 从零开发一个 Web 应用


### 第七模块：Agent 生态与协议（`basics/07-agent-ecosystem/`）

```
07-agent-ecosystem/
├── index.md                    # 模块介绍
├── 01-agent-frameworks.md      # Agent 框架
│   ├── LangChain
│   │   ├── 简介与安装
│   │   ├── Chains、Agents、Tools
│   │   ├── Memory 与 RAG
│   │   └── 实战示例
│   ├── LangGraph
│   │   ├── 什么是 LangGraph？
│   │   ├── 状态图（State Graph）
│   │   ├── 构建复杂 Agent
│   │   └── 与 LangChain 的关系
│   ├── AutoGen（微软）
│   ├── CrewAI
│   ├── AgentOps
│   └── 框架对比与选择
│
├── 02-agent-platforms.md       # Agent 平台
│   ├── 低代码平台
│   │   ├── Coze（字节跳动）
│   │   ├── Dify
│   │   ├── FastGPT
│   │   └── GPTs
│   ├── 开源部署方案
│   │   ├── ChatGPT-Next-Web
│   │   ├── LobeChat
│   │   └── MaxKB
│   └── 平台选择建议
│
├── 03-mcp-protocol.md          # MCP 协议
│   ├── 什么是 MCP？（Model Context Protocol）
│   ├── MCP 的价值
│   ├── MCP Server 开发
│   ├── MCP Client 集成
│   ├── MCP 生态
│   └── 实战：构建一个 MCP Server
│
├── 04-skills-system.md         # Skills 系统
│   ├── Skills 的概念
│   ├── Claude Skills 详解
│   ├── 如何编写 Skill
│   ├── Skills 分发与共享
│   └── Skills 案例
│
├── 05-function-calling.md      # Function Calling
│   ├── 什么是 Function Calling？
│   ├── 工具定义（Tool Definition）
│   ├── 参数提取
│   ├── 工具执行与结果反馈
│   └── 多工具调用
│
└── 06-orchestration.md         # Agent 编排
    ├── 单 Agent 编排
    ├── 多 Agent 协作
    ├── Agent 通信协议
    └── 工作流引擎
```

**学习目标**：了解 Agent 生态，掌握主流框架和协议

**检验标准**：能用 LangChain/LangGraph 构建一个多 Agent 系统

**实践项目**：
- 使用 Coze 平台搭建一个多 Agent 应用
- 开发一个自定义的 MCP Server


### 第八模块：模型训练与优化（`basics/08-model-training/`）

```
08-model-training/
├── index.md                    # 模块介绍
├── 01-fine-tuning-basics.md    # 微调基础
│   ├── 什么是微调？
│   ├── 预训练 vs 微调 vs RAG
│   ├── 何时需要微调？
│   └── 微调的类型
│       ├── Full Fine-tuning
│       ├── LoRA（低秩适应）
│       ├── QLoRA
│       └── Prompt Tuning
│
├── 02-preparation.md           # 微调准备
│   ├── 数据收集与清洗
│   ├── 数据格式（指令微调、对话数据）
│   ├── 数据质量评估
│   └── 硬件需求
│
├── 03-fine-tuning-practice.md  # 微调实践
│   ├── 使用 Hugging Face
│   ├── 使用 PEFT（LoRA）
│   ├── 使用 OpenAI API 微调
│   ├── 本地微调（Ollama + LM Studio）
│   └── 评估微调效果
│
├── 04-model-optimization.md    # 模型优化
│   ├── 量化（Quantization）
│   ├── 蒸馏（Distillation）
│   ├── 剪枝（Pruning）
│   └── 推理加速
│
├── 05-deployment.md            # 模型部署
│   ├── 云部署
│   │   ├── OpenAI API
│   │   ├── Anthropic API
│   │   ├── 国内大模型 API
│   │   └── Hugging Face Inference
│   ├── 本地部署
│   │   ├── Ollama
│   │   ├── LM Studio
│   │   ├── LocalAI
│   │   └── vLLM
│   ├── 自托管方案
│   └── 成本优化
│
└── 06-evaluation.md            # 模型评估
    ├── 评估指标
    │   ├── 准确率、召回率、F1
    │   ├── BLEU、ROUGE
    │   └── 人工评估
    ├── 基准测试（Benchmark）
    ├── A/B 测试
    └── 持续监控
```

**学习目标**：了解模型训练、优化和部署的基本方法

**检验标准**：能对一个小模型进行微调并部署使用

**实践项目**：微调一个专门用于特定任务的模型


## 落地型路径（Practical）

**目标**：快速掌握 AI 应用技能，实现价值变现
**预计时间**：1-3 个月
**适合人群**：有一定基础，希望快速应用 AI 创造价值

### 第九模块：AI 助手的高效使用（`practical/09-ai-assistant-usage/`）

```
09-ai-assistant-usage/
├── index.md                    # 模块介绍
├── 01-free-ai-assistants.md    # 免费 AI 助手
│   ├── 主流产品对比
│   │   ├── z.ai
│   │   ├── 通义千问（qwen）
│   │   ├── 豆包
│   │   ├── 文心一言
│   │   ├── Kimi
│   │   └── DeepSeek
│   ├── 产品定位与适用场景
│   ├── 如何选择合适的助手？
│   └── 免费资源汇总
│
├── 02-deep-research.md         # 深度研究功能
│   ├── 什么是深度研究？
│   ├── 使用场景
│   │   ├── 学习未知领域
│   │   ├── 市场调研
│   │   ├── 竞品分析
│   │   └── 学术研究
│   ├── 深度研究的技巧
│   │   ├── 如何设计研究提示词
│   │   ├── 多轮验证策略
│   │   └── 信息整合方法
│   └── 实战案例
│
├── 03-content-creation.md      # 内容创作
│   ├── 文章写作
│   │   ├── 大纲生成
│   │   ├── 内容扩展
│   │   ├── 润色与优化
│   │   └── SEO 优化
│   ├── PPT 制作
│   │   ├── Gamma + AI
│   │   ├── Tome
│   │   └── Beautiful.ai
│   ├── 多媒体内容
│   │   ├── 脚本生成（视频、播客）
│   │   ├── 图文设计（Canva AI）
│   │   └── 视频生成（Sora、Runway）
│   └── 内容工作流
│
├── 04-efficiency-boost.md      # 效率提升
│   ├── 学习场景
│   │   ├── 快速理解新概念
│   │   ├── 论文阅读与总结
│   │   ├── 语言学习
│   │   └── 技能学习（编程、设计）
│   ├── 工作场景
│   │   ├── 会议记录与总结
│   │   ├── 邮件自动化
│   │   ├── 任务拆解与规划
│   │   ├── 数据分析
│   │   └── 报告生成
│   ├── 个人管理
│   │   ├── 知识管理（Obsidian + AI）
│   │   ├── 时间管理
│   │   └── 决策辅助
│   └── 自动化工作流
│
└── 05-prompt-optimization.md   # 提示词优化（实用版）
    ├── 通用提示词模板
    ├── 场景化提示词库
    │   ├── 写作类
    │   ├── 分析类
    │   ├── 创意类
    │   └── 编程类
    ├── 提示词调试技巧
    └── 我的提示词库（持续积累）
```

**学习目标**：熟练使用 AI 助手提升工作学习效率

**检验标准**：能用 AI 助手完成一个复杂的内容创作或研究任务

**实践项目**：
- 用 AI 深度研究一个行业并生成报告
- 建立个人提示词库


### 第十模块：AI 编程实战（`practical/10-coding-practice/`）

```
10-coding-practice/
├── index.md                    # 模块介绍
├── 01-quick-start.md           # 快速上手
│   ├── 环境搭建（10 分钟）
│   ├── 第一个 AI 辅助项目
│   ├── 常见问题解决
│   └── 学习资源
│
├── 02-project-types.md         # 项目类型
│   ├── 静态网页（HTML/CSS/JS）
│   ├── 前端应用（React、Vue）
│   ├── 后端服务（Node.js、Python）
│   ├── 全栈应用
│   ├── 浏览器插件
│   ├── 微信小程序
│   └── 数据脚本
│
├── 03-development-workflow.md  # 开发流程
│   ├── 需求分析与设计（AI 辅助）
│   ├── 技术选型（AI 建议）
│   ├── 代码生成（AI 主导）
│   ├── 代码审查（AI 检查）
│   ├── 调试与修复（AI 辅助）
│   ├── 测试与部署（AI 自动化）
│   └── 迭代优化（AI 分析）
│
├── 04-practical-projects.md    # 实战项目
│   ├── 项目 1：个人博客网站
│   │   ├── 技术栈：Next.js + Tailwind
│   │   ├── 功能：文章展示、评论、搜索
│   │   ├── AI 参与度：80%
│   │   └── 预计时间：1 周
│   ├── 项目 2：待办事项应用
│   │   ├── 技术栈：React + LocalStorage
│   │   ├── 功能：任务管理、分类、提醒
│   │   ├── AI 参与度：70%
│   │   └── 预计时间：3 天
│   ├── 项目 3：浏览器插件
│   │   ├── 技术栈：Vanilla JS + Manifest V3
│   │   ├── 功能：网页内容摘要、翻译
│   │   ├── AI 参与度：60%
│   │   └── 预计时间：1 周
│   ├── 项目 4：API 服务
│   │   ├── 技术栈：Node.js + Express
│   │   ├── 功能：RESTful API、数据库
│   │   ├── AI 参与度：50%
│   │   └── 预计时间：1 周
│   └── 项目 5：数据可视化看板
│       ├── 技术栈：Vue + ECharts
│       ├── 功能：数据图表、实时更新
│       ├── AI 参与度：70%
│       └── 预计时间：1 周
│
├── 05-best-practices.md        # 最佳实践
│   ├── AI 编程的工作习惯
│   ├── 代码质量控制
│   ├── 安全注意事项
│   ├── 性能优化
│   └── 避免 AI 依赖陷阱
│
└── 06-troubleshooting.md       # 问题排查
    ├── 常见错误与解决
    ├── AI 生成代码的调试方法
    ├── 如何向 AI 描述问题
    └── 获取帮助的渠道
```

**学习目标**：能用 AI 编程工具独立完成中小型项目

**检验标准**：在 1 周内完成一个功能完整的 Web 应用

**实践项目**：从上面的项目列表中选择 2-3 个完成


### 第十一模块：需求发现与产品化（`practical/11-demand-discovery/`）

```
11-demand-discovery/
├── index.md                    # 模块介绍
├── 01-demand-research.md       # 需求挖掘
│   ├── 利用 AI 进行市场调研
│   │   ├── Reddit 痛点挖掘
│   │   ├── Product Hunt 趋势分析
│   │   ├── 竞品评论分析
│   │   └── 关键词研究
│   ├── 传统行业的机会
│   │   ├── 低效环节识别
│   │   ├── 人工流程自动化
│   │   └── AI 赋能改造
│   ├── 用户访谈与问卷（AI 辅助）
│   ├── 数据分析与洞察
│   └── 实战：发现 10 个潜在需求
│
├── 02-demand-validation.md     # 需求验证
│   ├── 快速验证方法
│   ├── MVP 设计原则
│   ├── 用 AI 制作原型
│   │   ├── 需求文档生成
│   │   ├── 产品原型（Figma + AI）
│   │   ├── 交互设计
│   │   └── PRD 文档
│   ├── 用户测试（AI 辅导）
│   ├── 数据收集与分析
│   └── 实战：验证一个需求的可行性
│
├── 03-productization.md        # 产品化
│   ├── 从需求到产品
│   ├── 功能优先级排序
│   ├── 技术可行性分析
│   ├── 成本预估
│   ├── 商业模式设计
│   │   ├── 免费 + 增值
│   │   ├── 订阅制
│   │   ├── 按量付费
│   │   └── 企业定制
│   └── 实战：完成产品规划
│
├── 04-mvp-development.md       # MVP 开发
│   ├── MVP 的范围界定
│   ├── 技术选型（AI 建议）
│   ├── 快速开发策略
│   ├── 利用 AI 加速开发
│   ├── 测试与迭代
│   └── 实战：2 周内完成 MVP
│
├── 05-launch-and-promote.md    # 上线与推广
│   ├── 部署方案选择
│   │   ├── Vercel（前端）
│   │   ├── Railway（后端）
│   │   ├── 阿里云、腾讯云
│   │   └── 自建服务器
│   ├── 上线检查清单
│   ├── 推广渠道
│   │   ├── Product Hunt
│   │   ├── Hacker News
│   │   ├── Reddit
│   │   ├── Twitter/X
│   │   ├── 小红书、知乎
│   │   └── SEO 优化
│   ├── 用户反馈收集
│   └── 数据分析与迭代
│
└── 06-monetization.md          # 变现策略
    ├── 盈利模式
    │   ├── SaaS 订阅
    │   ├── 一次性购买
    │   ├── 按使用量计费
    │   ├── 广告收入
    │   └── 企业定制
    ├── 定价策略
    ├── 支付集成
    ├── 法律合规
    └── 案例分析
```

**学习目标**：掌握从需求发现到产品变现的完整流程

**检验标准**：完成一个从需求到上线到变现的完整项目

**实践项目**：从零到一做一个产品并获取前 100 个用户


### 第十二模块：商业化案例（`practical/12-business-cases/`）

```
12-business-cases/
├── index.md                    # 模块介绍
├── 01-success-stories.md       # 成功案例
│   ├── 案例 1：AI 写作助手
│   │   ├── 需求发现
│   │   ├── 产品设计
│   │   ├── 技术实现
│   │   ├── 推广策略
│   │   └── 收益分析
│   ├── 案例 2：AI 客服系统
│   ├── 案例 3：AI 数据分析工具
│   ├── 案例 4：AI 教育应用
│   └── 案例 5：AI 插件生态
│
├── 02-vertical-agents.md       # 垂直领域 Agent
│   ├── 法律 Agent
│   │   ├── 应用场景
│   │   ├── 技术方案
│   │   ├── 数据来源
│   │   └── 市场机会
│   ├── 医疗 Agent
│   ├── 教育 Agent
│   ├── 金融 Agent
│   ├── 电商 Agent
│   └── 其他垂直领域
│
├── 03-tools-ecosystem.md       # 工具类应用
│   ├── 浏览器插件
│   │   ├── 网页摘要
│   │   ├── 翻译助手
│   │   ├── 屏幕截图分析
│   │   └── 开发者工具
│   ├── 办公效率工具
│   │   ├── PPT 生成
│   │   ├── 表格处理
│   │   ├── 文档转换
│   │   └── 邮件自动化
│   ├── 创意工具
│   │   ├── 图像生成
│   │   ├── 视频编辑
│   │   ├── 音频处理
│   │   └── 设计辅助
│   └── 工具开发实践
│
├── 04-ai-wrapper.md            # AI 套壳应用
│   ├── 什么是套壳应用？
│   ├── 可行性分析
│   ├── 如何避免"伪需求"？
│   ├── 增值点设计
│   ├── 成本控制
│   └── 风险与挑战
│
├── 05-solo-preneur.md          # 超级个体
│   ├── 一个人就是一个团队
│   ├── 能力模型
│   ├── 工具链
│   ├── 时间管理
│   ├── 收入多元化
│   └── 案例故事
│
└── 06-future-opportunities.md  # 未来机会
    ├── AI + Web3
    ├── AI + IoT
    ├── AI + 机器人
    ├── AI + 生物科技
    ├── 个人 AI 助手市场
    └── 持续学习的方法
```

**学习目标**：通过案例学习，找到适合自己的商业机会

**检验标准**：制定出个人的商业计划书

**实践项目**：选择一个方向，完成可行性分析和 MVP 规划


## 实战项目（Projects）

**目标**：从零到一构建完整应用，深度体验 AI 在每个环节的作用
**适合人群**：所有学习者（尤其是零基础）

### 项目一：个人问答机器人（`projects/01-qa-bot/`）

```
难度：⭐ | 时间：1-2 周

项目描述：
构建一个基于个人知识库的问答机器人，能够回答你上传的文档内容

学习目标：
- 理解 RAG 的基本原理
- 掌握向量数据库的使用
- 学会调用大模型 API
- 完成一个完整的应用

涉及技术：
- Python/JavaScript（选一个）
- OpenAI API 或其他大模型 API
- Chroma（向量数据库）
- Streamlit/Gradio（前端界面）

实施步骤：
1. 需求分析与设计（AI 辅助）
   - 确定功能范围
   - 绘制原型图（用 AI 工具）

2. 环境搭建（AI 指导）
   - 安装依赖
   - 配置 API Key

3. 核心功能开发（AI 主导）
   - 文档加载与分块
   - 向量化与存储
   - 相似度检索
   - 问答生成

4. 前端界面（AI 生成）
   - 上传组件
   - 对话界面
   - 结果展示

5. 测试与优化（AI 辅助）
   - 测试不同文档类型
   - 优化回答质量
   - 性能优化

6. 部署上线（AI 协助）
   - 选择部署平台
   - 配置环境变量
   - 发布应用

7. 迭代改进
   - 收集反馈
   - 功能增强
   - 用户体验优化

AI 在各环节的作用：
- 需求分析：AI 帮助梳理需求和设计原型
- 代码生成：AI 生成 80% 的代码
- 代码解释：AI 解释代码逻辑
- Bug 修复：AI 协助调试
- 测试用例：AI 生成测试场景
- 部署：AI 提供部署指导和问题解决

验收标准：
- [ ] 能上传 PDF/Word/TXT 文档
- [ ] 能针对文档内容进行问答
- [ ] 回答准确率 > 70%
- [ ] 有友好的用户界面
- [ ] 已部署并可访问
- [ ] 能解释清楚 AI 在每个环节的作用

扩展功能（可选）：
- 支持多文档
- 添加来源引用
- 支持多轮对话
- 添加用户认证
- 支持多语言
```


### 项目二：多 Agent 研究助手（`projects/02-research-agent/`）

```
难度：⭐⭐⭐ | 时间：3-4 周

项目描述：
构建一个由多个 Agent 协作的研究助手，能够自动完成：搜索、阅读、分析、总结

学习目标：
- 理解多 Agent 协作机制
- 掌握 Agent 编排方法
- 学会设计 Agent 工作流
- 深入理解 LangChain/LangGraph

涉及技术：
- Python
- LangChain 或 LangGraph
- Tavily API（搜索）
- OpenAI API
- Serper API（可选）

Agent 架构：
1. 搜索 Agent（Search Agent）
   - 负责搜索相关信息
   - 工具：Tavily、Google Search

2. 阅读 Agent（Reader Agent）
   - 负责阅读网页内容
   - 提取关键信息
   - 工具：Web 浏览器、RAG

3. 分析 Agent（Analyst Agent）
   - 负责分析信息
   - 识别趋势和模式
   - 工具：数据分析、统计

4. 总结 Agent（Summarizer Agent）
   - 负责整合信息
   - 生成结构化报告
   - 工具：LLM

5. 协调器（Orchestrator）
   - 负责任务分配
   - 协调各 Agent
   - 整合最终结果

实施步骤：
1. 需求调研（AI 深度研究）
   - 研究现有研究助手产品
   - 分析用户痛点
   - 确定功能范围

2. 架构设计（AI 辅助）
   - 设计 Agent 交互流程
   - 定义各 Agent 职责
   - 选择技术方案

3. 单 Agent 开发（AI 主导）
   - 逐个实现各 Agent
   - 单元测试
   - 功能验证

4. Agent 编排（AI 协助）
   - 实现协调器
   - 定义通信协议
   - 处理异常情况

5. 前端界面（AI 生成）
   - 任务输入
   - 进度展示
   - 结果呈现

6. 集成测试
   - 端到端测试
   - 性能测试
   - 用户体验测试

7. 部署与监控
   - 部署到生产环境
   - 添加日志和监控
   - 持续优化

AI 在各环节的作用：
- 需求调研：AI 完成市场研究
- 架构设计：AI 提供架构建议
- 代码生成：AI 生成 70% 的代码
- Agent 设计：AI 帮助定义 Agent 行为
- 测试：AI 生成测试用例
- 部署：AI 解决部署问题

验收标准：
- [ ] 能自动完成完整的研究流程
- [ ] 各 Agent 协作顺畅
- [ ] 生成的研究报告质量高
- [ ] 用户界面友好
- [ ] 处理时间合理（< 5 分钟）
- [ ] 已部署并可访问
- [ ] 能详细说明 Agent 协作机制

扩展功能（可选）：
- 支持文件上传
- 添加可视化
- 支持多种研究类型
- 添加历史记录
- 支持导出（PDF、Markdown）
```


### 项目三：自动化财报分析 Agent（`projects/03-financial-agent/`）

```
难度：⭐⭐⭐⭐ | 时间：4-6 周

项目描述：
构建一个能自动下载财报、分析数据、生成洞察的 AI Agent

学习目标：
- 理解复杂 Agent 的设计
- 掌握数据处理与分析
- 学会集成外部 API
- 理解金融领域知识

涉及技术：
- Python
- Pandas（数据处理）
- Matplotlib/Plotly（可视化）
- LangChain
- 财报 API（如 SEC EDGAR）
- OpenAI API

实施步骤：
1. 需求分析（AI 深度研究）
   - 研究财报分析流程
   - 确定分析维度
   - 设计产品功能

2. 数据获取（AI 辅助）
   - 接入财报 API
   - 自动下载数据
   - 数据清洗

3. 数据分析（AI 主导）
   - 财务指标计算
   - 趋势分析
   - 同比环比分析

4. AI 分析（AI 核心）
   - 用 LLM 理解财报
   - 生成文字分析
   - 识别风险和机会

5. 可视化（AI 辅助）
   - 生成图表
   - 交互式界面
   - 报告生成

6. 部署上线（AI 协助）

验收标准：
- [ ] 能自动获取财报
- [ ] 分析准确度高
- [ ] 报告专业
- [ ] 用户界面友好
- [ ] 已部署

扩展功能：
- 支持多公司对比
- 添加预警功能
- 支持自定义指标
- 添加邮件通知
```


### 项目四：跨平台内容分发工具（`projects/04-content-distributor/`）

```
难度：⭐⭐⭐ | 时间：3-4 周

项目描述：
一键将内容发布到多个平台（微信公众号、知乎、小红书等）

学习目标：
- 掌握 API 集成
- 理解平台适配
- 学会内容格式化
- 理解用户认证

涉及技术：
- Node.js/Python
- 各平台 API
- 数据库
- 定时任务

实施步骤：
1. 平台调研（AI 深度研究）
2. API 集成（AI 主导）
3. 内容格式化（AI 辅助）
4. 用户界面（AI 生成）
5. 测试与部署

验收标准：
- [ ] 支持 3+ 平台
- [ ] 格式适配正确
- [ ] 发布成功率高
- [ ] 用户体验好

扩展功能：
- 定时发布
- 数据统计
- 多账号管理
```


### 项目五：端到端 SaaS 应用（`projects/05-saas-app/`）

```
难度：⭐⭐⭐⭐⭐ | 时间：6-8 周

项目描述：
从零到一构建一个完整的 SaaS 应用，实现商业闭环

学习目标：
- 完整的产品开发流程
- 用户系统设计
- 支付集成
- 数据分析与运营

涉及技术：
- Next.js（全栈）
- 数据库（PostgreSQL）
- 认证（NextAuth）
- 支付（Stripe）
- 部署（Vercel + Railway）

实施步骤：
完整的 AI 辅助产品开发流程（7 个阶段）

验收标准：
- [ ] 完整的功能
- [ ] 用户可以注册付费
- [ ] 已上线运营
- [ ] 获取真实用户
- [ ] 产生收入

扩展功能：
- 用户分析
- A/B 测试
- 推荐系统
```


## 附录（Appendix）

### 附录 A：术语表（`appendix/glossary.md`）

- AI 核心术语
- Agent 相关术语
- 工具与框架
- 缩写对照表

### 附录 B：工具清单（`appendix/tools-list.md`）

- AI 助手产品
- 编程工具
- Agent 框架
- 部署平台
- 学习资源

### 附录 C：提示词模板库（`appendix/prompts-library.md`）

- 通用提示词
- 场景化提示词
- 高级技巧

### 附录 D：常见问题（`appendix/faq.md`）

- 学习相关
- 技术相关
- 商业相关

### 附录 E：资源推荐（`appendix/resources.md`）

- 在线课程
- 书籍推荐
- 博客与网站
- 社区与论坛
- 开源项目

### 附录 F：更新日志（`appendix/changelog.md`）

- 版本历史
- 重要更新
- 计划路线图


## 学习路径建议

### 零基础学习者（推荐）
```
基础型路径（第一至八模块）
  ↓
落地型路径（第九至十二模块）
  ↓
实战项目（从项目一到项目五，逐步进阶）
```

### 有基础的学习者
```
落地型路径（第九至十二模块）
  ↓
实战项目（选择 2-3 个项目）
  ↓
根据需要回顾基础型路径的特定章节
```

### 快速验证想法
```
实战项目（选择一个项目）
  ↓
边做边学，遇到问题回溯相关章节
  ↓
完成项目后再系统学习
```


## 使用说明

1. **每章结构**：
   - 学习目标
   - 核心内容
   - 实践案例
   - 检验标准
   - 扩展阅读

2. **章节关系**：
   - 每章相对独立
   - 有依赖关系会明确标注
   - 可灵活选择学习顺序

3. **更新频率**：
   - 核心概念：每季度更新
   - 工具框架：每月更新
   - 实战案例：持续更新
   - 标注最后更新时间

4. **社区参与**：
   - 每章有讨论区
   - 欢迎贡献案例
   - 问题反馈渠道


## 现在开始

选择你的学习路径，开启 AI Agent 之旅！

> "最好的学习方式就是立即开始"

[返回首页](/) | [开始学习](basics/01-ai-overview/)
