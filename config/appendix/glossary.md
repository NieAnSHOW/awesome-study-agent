# 术语表

> AI Agent 领域核心术语速查

## A

**AI（Artificial Intelligence，人工智能）**
计算机系统表现出的智能行为，包括学习、推理、自我修正等能力。

**Agent（智能体）**
能够感知环境并采取行动以实现目标的自主实体。AI Agent 是指基于 AI 技术的智能体。

**Attention Mechanism（注意力机制）**
深度学习中的一种技术，允许模型在处理输入时关注不同重要性的部分。

**API（Application Programming Interface，应用程序接口）**
软件系统之间交互的接口，在 AI 领域常指调用大模型服务的接口。

---

## B

**Base Model（基础模型）**
在大规模数据上预训练的模型，可以作为多种任务的基础。

**Batch Size（批次大小）**
在训练模型时，一次输入多少样本数据。

---

## C

**Chain of Thought（思维链）**
一种提示词技巧，引导模型逐步思考推理过程，提高复杂问题的解决能力。

**Context Window（上下文窗口）**
模型能够处理的最大文本长度，包括输入和输出。

**Completion（补全）**
模型根据输入生成的文本输出。

**Token**
文本的最小单位，可以是单词、词组或字符。模型按 Token 处理文本。

---

## D

**Deep Learning（深度学习）**
基于神经网络的机器学习方法，通常指多层神经网络。

**Distillation（模型蒸馏）**
将大型模型的知识转移到小型模型的技术，用于模型压缩。

---

## E

**Embedding（嵌入）**
将文本、图像等数据转换为数值向量的表示方法，用于捕捉语义关系。

**Epoch（轮次）**
在整个训练数据集上完整训练一次。

---

## F

**Fine-tuning（微调）**
在预训练模型基础上，使用特定任务数据进行进一步训练的过程。

**Few-shot Learning（少样本学习）**
只提供少量示例，让模型学会新任务的能力。

**Function Calling（函数调用）**
大模型调用外部工具或 API 的能力。

**Full Fine-tuning（全量微调）**
调整模型的所有参数进行微调。

---

## L

**LLM（Large Language Model，大语言模型）**
参数规模巨大、在海量文本数据上训练的语言模型，如 GPT-4、Claude 等。

**LoRA（Low-Rank Adaptation，低秩适应）**
一种参数高效的微调方法，只训练少量额外参数。

---

## M

**MCP（Model Context Protocol，模型上下文协议）**
连接 AI 模型和外部数据源的开放协议。

**Memory（记忆）**
Agent 存储和检索信息的能力，包括短期记忆和长期记忆。

**Multi-Agent（多 Agent）**
多个 Agent 协作完成复杂任务的系统。

---

## N

**NLP（Natural Language Processing，自然语言处理）**
让计算机理解、生成和处理人类语言的技术。

---

## O

**Orchestration（编排）**
协调和管理多个 Agent 或组件协同工作的过程。

---

## P

**Prompt（提示词）**
输入给大模型的文本指令，用于引导模型生成特定输出。

**Prompt Engineering（提示词工程）**
设计和优化提示词以获得更好输出的技术和方法。

**Pre-training（预训练）**
在大规模数据上训练模型的初始阶段。

---

## Q

**Quantization（量化）**
降低模型数值精度（如从 32 位浮点数降到 8 位整数）以减小模型大小和提高推理速度的技术。

**QLoRA**
量化感知的 LoRA，结合了量化和 LoRA 的优点。

---

## R

**RAG（Retrieval-Augmented Generation，检索增强生成）**
通过检索外部知识库来增强大模型生成能力的技术。

**RLHF（Reinforcement Learning from Human Feedback，基于人类反馈的强化学习）**
通过人类反馈来训练模型，使其输出更符合人类价值观的方法。

**Reasoning（推理）**
模型进行逻辑思考和推导的能力。

---

## S

**Sentinel AI**
用于监控和验证其他 AI 输出的 AI 系统。

**System Prompt（系统提示词）**
设置模型行为和角色的初始提示词。

---

## T

**Temperature（温度）**
控制模型输出随机性的参数，值越高输出越随机，值越低输出越确定。

**Transformer**
一种深度学习架构，是现代大语言模型的基础。

**Token Limit**
上下文窗口的 Token 数量限制。

---

## V

**Vector Database（向量数据库）**
专门存储和检索向量数据的数据库，常用于 RAG 系统。

---

## 常见缩写对照表

| 缩写 | 全称 | 中文 |
|------|------|------|
| AI | Artificial Intelligence | 人工智能 |
| API | Application Programming Interface | 应用程序接口 |
| LLM | Large Language Model | 大语言模型 |
| RAG | Retrieval-Augmented Generation | 检索增强生成 |
| RLHF | Reinforcement Learning from Human Feedback | 基于人类反馈的强化学习 |
| NLP | Natural Language Processing | 自然语言处理 |
| LoRA | Low-Rank Adaptation | 低秩适应 |
| MCP | Model Context Protocol | 模型上下文协议 |
| SaaS | Software as a Service | 软件即服务 |
| MVP | Minimum Viable Product | 最小可行产品 |

---

[← 返回首页](/)
