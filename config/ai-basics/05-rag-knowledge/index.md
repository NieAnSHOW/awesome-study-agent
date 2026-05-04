# 模块五:RAG 与知识增强

> **学习目标**:掌握 RAG 技术的核心原理、实现方法和高级应用,能够构建生产级 RAG 系统
>
> **预计时间**:6-8 小时
>
> **前置知识**:完成模块二《LLM 基础》和模块四《Agent 基础》的学习
>
> **最后更新**:2025 年 1 月

## 模块介绍

在模块二中,我们了解到大语言模型有一个致命弱点:它的知识截止于训练完成的那一天。如果你想问它昨天发布的新闻或者公司内部文档,它完全无能为力。

RAG(Retrieval-Augmented Generation,检索增强生成)就是为了解决这个问题而生的。它让大模型能够"查阅资料",就像人类在做研究时会参考书籍、论文和网络信息一样。

本模块会带你从零开始,深入理解 RAG 的方方面面:
- **核心概念** - RAG 是什么,为什么需要它
- **完整流程** - 从文档处理到答案生成的全链路
- **向量化技术** - 如何把文本变成机器能理解的数字
- **向量数据库** - 高效检索相似内容的关键组件
- **进阶技巧** - 混合检索、重排序、多模态等高级技术
- **实践指南** - 亲手构建一个能用的 RAG 系统

### 为什么 RAG 这么重要?

你可能听说过微调(Fine-tuning),那也是让模型掌握新知识的方法。但 RAG 相比微调有几个明显优势:

::: tip RAG vs 微调
- **更新成本低**:添加新文档只需要向量化存入,不需要重新训练模型
- **可追溯性强**:答案能标注来源,用户能验证信息的真实性
- **不会遗忘**:不会因为学习新知识而忘记旧知识(灾难性遗忘)
- **隐私友好**:敏感数据不需要暴露给模型服务商
:::

**学习本模块后,你将能够**:
- 🎯 **理解 RAG 本质**:知道它为什么能解决大模型的幻觉问题
- 🔨 **构建实用系统**:从零搭建一个问答系统或知识库助手
- 🚀 **优化系统性能**:掌握检索质量、响应速度和准确度的平衡技巧
- 💡 **应对复杂场景**:处理多轮对话、多语言、多模态等高级需求

### 学习方法建议

RAG 涉及多个技术点,建议采用"螺旋式"学习法:
1. **快速理解全貌** - 先跑通一个最简单的 RAG demo
2. **逐个击破组件** - 深入理解每个环节的作用和优化方法
3. **动手实验对比** - 改变参数、替换组件,观察效果变化
4. **实战项目巩固** - 用自己的数据构建一个完整的系统

## 章节列表

- [什么是 RAG?](/ai-basics/05-rag-knowledge/01-what-is-rag)
- [RAG 流程](/ai-basics/05-rag-knowledge/02-rag-pipeline)
- [向量化](/ai-basics/05-rag-knowledge/03-embedding)
- [向量数据库](/ai-basics/05-rag-knowledge/04-vector-database)
- [进阶 RAG](/ai-basics/05-rag-knowledge/05-advanced-rag)
- [RAG 实践](/ai-basics/05-rag-knowledge/06-rag-practice)

## 学习检验

完成本模块学习后,你应该能够:

- [ ] 清楚解释 RAG 的工作原理和核心价值
- [ ] 独立搭建一个基础的 RAG 问答系统
- [ ] 理解向量化在语义检索中的作用
- [ ] 根据场景选择合适的向量数据库
- [ ] 掌握至少 3 种提升 RAG 性能的技巧
- [ ] 评估和优化 RAG 系统的检索质量
- [ ] 处理 RAG 系统中的常见问题(检索不准确、答案错误等)

## 扩展阅读

**必读论文**:
- "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020) - RAG 的开山之作
- "Improving language models by retrieving from trillions of tokens" (2022) - 强化学习在 RAG 中的应用
- "Improving Retrieval-Augmented Large Language Models with Low-Rank Orthogonal Projection" (2024)

**经典教程**:
- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/) - 最流行的 RAG 实现框架
- [LlamaIndex RAG Guide](https://docs.llamaindex.ai/) - 专注于数据索引的 RAG 框架
- [RAG from Scratch](https://github.com/langchain-ai/rag-from-scratch) - 从零实现的教程

**实用工具**:
- [Vector Database Comparison](https://zilliz.com/comparison) - 向量数据库选型对比
- [RAG Evaluation Framework](https://github.com/explodinggradients/ragas) - RAG 系统评估工具
- [Embedding Model Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) - 嵌入模型排行榜

**行业报告**:
- [State of RAG 2024](https://arxiv.org/abs/2408.04042) - RAG 技术现状调研
- [RAG Best Practices (AWS)](https://docs.aws.amazon.com/prescriptive-guidance/latest/writing-best-practices-rag/introduction.html)
- [Optimizing RAG Retrieval (Google Cloud)](https://cloud.google.com/blog/products/ai-machine-learning/optimizing-rag-retrieval)

---

**学习提示**:RAG 系统的调优需要大量实验。建议每学完一个章节就动手实践,用真实数据测试,观察不同配置的效果差异。只有亲手踩过坑,才能真正理解每个技术选择背后的权衡。

---

[← 返回课程目录](/preface) | [继续学习:什么是 RAG? →](/ai-basics/05-rag-knowledge/01-what-is-rag)
