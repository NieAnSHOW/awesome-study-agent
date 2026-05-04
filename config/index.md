---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "从零到一"
  text: "系统掌握 AI Agent"
  tagline: 15 个基础模块 + 3 个深度指南 + 6 个附录 · 共 154 篇文档<br>从零到一，一个人就是一个团队。<br><p style="display:flex;align-items:center;justify-content:left;margin-top:8px;">本知识库由 <img src="/deepseek.svg" style="width:1em;height:1em;margin-right:0.3em;margin-left:0.3em;"> <a href="https://api-docs.deepseek.com/zh-cn/" target="_blank" style="color:#4D6BFE;text-decoration:underline;text-decoration-style:dotted;">DeepSeek V4 模型</a><span style="margin-left:5px">撰写</span></p>
  image:
    src: /logo.png
    alt: Awesome Study Agent Logo
  actions:
    - text: 序言：课程大纲
      link: /preface
    - theme: alt
      text: 开始学习
      link: /basics/01-ai-overview/

features:
  - title: 🎯 模块一：AI 概述与 Agent 概念
    details: 不讲数学，不讲算法。讲清楚三件事——AI是什么、Agent是什么、为什么这两个东西结合在一起是大事。
    link: /basics/01-ai-overview/
    linkText: 开始学习
  - title: 🧠 模块二：大语言模型基础
    details: LLM 是 Agent 的"大脑"。不需要搞懂 Transformer 内部数学，但得明白 Token、Temperature、上下文窗口是什么。
    link: /basics/02-llm-fundamentals/
    linkText: 了解 LLM
  - title: ✍️ 模块三：提示词工程
    details: 提示词不是"好好说话"，有模式有结构的。思维链、ReAct、角色扮演——学会了跟 AI 沟通效率翻倍。
    link: /basics/03-prompt-engineering/
    linkText: 学习提示词
  - title: 🤖 模块四：Agent 基础与架构
    details: Agent 的核心组件：感知、记忆、工具、规划、行动。讲清楚这些组件怎么拼在一起工作。
    link: /basics/04-agent-fundamentals/
    linkText: 探索 Agent
  - title: 📖 模块五：RAG 与知识增强
    details: 最实用的 Agent 增强技术。文档分块、向量检索、混合搜索——搭 RAG 系统的必修课。
    link: /basics/05-rag-knowledge/
    linkText: 学习 RAG
  - title: 💻 模块六：AI 编程工具
    details: Cursor 更适合做产品原型，Claude Code 更适合做复杂工程。CC Switch 是配置管理利器。
    link: /basics/06-ai-coding-tools/
    linkText: 工具入门
  - title: 🔗 模块七：Agent 生态与协议
    details: MCP 协议是 Agent 生态里最重要的协议。LangChain/LangGraph 是生态最大的框架。搞清楚整个 Agent 世界的地图。
    link: /basics/07-agent-ecosystem/
    linkText: 探索生态
  - title: ⚙️ 模块八：模型训练与优化
    details: 微调和 RAG 的区别是什么？什么时候该微调、什么时候不该？LoRA 和 QLoRA 是什么？
    link: /basics/08-model-training/
    linkText: 学习训练
  - title: 🧩 模块九：Agent Skills 系统
    details: Skills 是给 Agent 装"技能包"的机制。本质是给模型划定行为边界和能力范围。
    link: /basics/09-agent-skills/
    linkText: 了解 Skills
  - title: 🐙 模块十：OpenClaw 开源 AI 助手
    details: 一个完整的开源 Agent 框架。它的 Skill 系统和四层记忆体系值得好好学习。
    link: /basics/10-openclaw/
    linkText: 了解 OpenClaw
  - title: 👷 模块十一：WorkBuddy 数字员工实践
    details: 不做理论，全是场景案例——写周报、竞品分析、改 Bug、做设计。直接拿来用。
    link: /basics/11-workbuddy/
    linkText: 了解 WorkBuddy
  - title: 🎬 模块十二：AI 视频生成
    details: Sora、Runway、可灵——不教你当导演，教你这些工具能干什么、怎么用在工作流里。
    link: /basics/12-ai-video-generation/
    linkText: 学习视频生成
  - title: 🖼️ 模块十三：多模态 AI 技术
    details: 能看懂文字、图片、音频、视频的模型。Agent 从"聊天机器"变成"能理解世界的助手"的关键一步。
    link: /basics/13-multimodal-ai/
    linkText: 学习多模态
  - title: 🎨 模块十四：AI 图像生成
    details: Midjourney、Stable Diffusion、通义万相——工具不重要，提示词的工程方法重要。
    link: /basics/14-ai-image-generation/
    linkText: 学习图像生成
  - title: 📝 模块十五：Markdown 阅读工具
    details: Obsidian、Logseq、MarkText——工具是手段不是目的，选一个建立自己的 AI 学习知识库。
    link: /tools-recommendation/15-markdown-reading-tools/
    linkText: 了解工具
  - title: 📘 深度指南
    details: Agent Skills 系统、大模型上下文管理、OpenClaw 架构——每个专题 14 篇文章的深度剖析。
    link: /deep-dive/context-management/
    linkText: 深入阅读
  - title: 📋 附录资源
    details: 术语表、工具清单、提示词模板库、FAQ、资源推荐、更新日志。用时来翻。
    link: /appendix/
    linkText: 浏览附录
---

## 学习路径建议

**看100篇文章不如动手跑一个Agent。先做出来比什么都重要。**

### 零基础
按顺序走模块一到十五，每个模块5-6篇文章，不深，但够你站住脚。

### 有一定基础
先看模块四（Agent架构）和模块七（生态协议），然后直接冲深度指南，回头补不熟的模块。

### 快速上手
模块四 → 模块七 → 模块十（OpenClaw上手）→ 模块十一（WorkBuddy实践）。做完这些够你开始干活了，遇到不懂的再翻其他模块。

---

> **154 篇文档 · 15 个模块 · 3 个深度专题 · 6 个附录**  
> 每个模块有"检验标准"，过不了别急着往下走——不是考试，是你真的听懂了。

[查看完整课程大纲 →](preface)
