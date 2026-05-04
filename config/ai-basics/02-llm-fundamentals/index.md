# 模块二:大语言模型基础

> **学习目标**:深入理解大语言模型(LLM)的核心原理、工作机制和主流模型
>
> **预计时间**:4-5 小时
>
> **前置知识**:完成模块一学习,具备基础计算机知识
>
> **最后更新**:2025 年 1 月

## 模块介绍

大语言模型(LLM)是现代 AI 的基石,理解它的工作原理对于掌握 Agent 至关重要。本模块将涵盖以下内容:
- **什么是 LLM** - 大语言模型的定义和核心特征
- **LLM 如何工作** - Transformer 架构和注意力机制
- **主流大模型介绍** - GPT、Claude、DeepSeek、Qwen 等代表性模型
- **LLM 的核心能力** - 模型涌现的关键能力
- **LLM 的挑战** - 幻觉问题和局限性

### 为什么要学习这一模块?

2025 年的 LLM 应用调查显示:**超过 80% 的 AI Agent** 基于大语言模型构建[^1]。模型选型错误是 AI 项目失败的首要原因之一。

理解 LLM 的工作机制能帮你:
1. 选择适合的模型
2. 设计有效的 Agent 提示词
3. 快速诊断和解决问题
4. 评估模型输出质量

### 学习方法

本模块的学习路径:
1. **核心概念** - 通俗讲解技术原理
2. **可视化图解** - 通过图表理解复杂机制
3. **案例分析** - 对比真实模型
4. **动手实验** - 体验不同 LLM 的特点

---

## 章节列表

1. [什么是大语言模型?](/ai-basics/02-llm-fundamentals/01-what-is-llm) - LLM 的定义、特征和发展历程
2. [LLM 如何工作?](/ai-basics/02-llm-fundamentals/02-how-llm-works) - Transformer 架构与注意力机制详解
3. [主流大模型介绍](/ai-basics/02-llm-fundamentals/03-major-models) - GPT、Claude、DeepSeek、Qwen 等模型对比
4. [LLM 的核心能力](/ai-basics/02-llm-fundamentals/04-model-capabilities) - 涌现能力、推理、编程等关键能力
5. [LLM 的挑战](/ai-basics/02-llm-fundamentals/05-limits-and-challenges) - 幻觉问题、局限性及应对策略

---

## 学习检验

完成本模块学习后,你应该能够:

- [ ] 清晰解释什么是大语言模型,以及"大"体现在哪些方面
- [ ] 描述 Transformer 架构的核心组件和作用
- [ ] 对比至少 3 个主流 LLM 的特点和适用场景
- [ ] 列举 LLM 的 4-5 种核心能力
- [ ] 解释什么是"幻觉",以及如何缓解幻觉问题
- [ ] 根据任务需求选择合适的 LLM

---

## 扩展阅读

**权威论文**:
- [《Attention Is All You Need》](https://arxiv.org/abs/1706.03762) - Transformer 原始论文(2017)[^2]
- [《Language Models are Few-Shot Learners》](https://arxiv.org/abs/2005.14165) - GPT-3 论文[^3]

**推荐资源**:
- [【LLM 原理可视化】](https://github.com/changyeyu/LLM-RL-Visualized) - 100+ 原创原理图
- [【从零构建大模型】](https://github.com/rasbt/LLM-from-scratch) - Sebastian Raschka 的开源教程
- [【Transformer 详解】](https://jalammar.github.io/illustrated-transformer/) - Jay Alammar 的经典图解

**互动体验**:
- 访问 [ChatGPT](https://chat.openai.com) 体验 GPT 系列
- 访问 [Claude](https://claude.ai) 对比长文本处理能力
- 访问 [DeepSeek](https://deepseek.com) 体验推理模型
- 访问 [通义千问](https://qianwen.aliyun.com) 对比中文能力

**学习社区**:
- [Hugging Face](https://huggingface.co) - 模型与数据集开源社区
- [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA) - Reddit LLM 社区
- [Datawhale](https://github.com/datawhalechina/happy-llm) - 中文 LLM 教程

---

**💡 学习提示**: 本模块涉及较多技术细节,建议先理解核心概念,再深入研究具体机制。遇到难以理解的技术术语时,可以参考扩展阅读中的可视化资源,或加入社区讨论。

---

[← 返回课程目录](/preface) | [继续学习:什么是大语言模型? →](/ai-basics/02-llm-fundamentals/01-what-is-llm)

---

[^1]: McKinsey & Company, "The state of AI in 2025: Agents, innovation, and transformation", November 2025.
[^2]: Vaswani et al., "Attention Is All You Need", NeurIPS 2017, https://arxiv.org/abs/1706.03762
[^3]: Brown et al., "Language Models are Few-Shot Learners", NeurIPS 2020, https://arxiv.org/abs/2005.14165
