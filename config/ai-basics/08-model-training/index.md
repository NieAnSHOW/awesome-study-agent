# 模型训练与优化

> **学习目标**:掌握大模型微调的完整流程,从数据准备到部署上线的实战技能
>
> **预计时间**:8-10 小时
>
> **前置知识**:完成模块一、二学习,了解大语言模型基础
>
> **最后更新**:2025 年 1 月

## 模块介绍

微调(Fine-tuning)是让预训练模型适应特定任务的关键技术。本模块将从零开始,完成一次完整的模型微调、优化和部署流程。

**你将学到**:
- **微调基础** - 理解LoRA、QLoRA等微调方法
- **数据准备** - 收集和清洗高质量训练数据
- **实战训练** - 使用LLaMA-Factory、Axolotl等工具
- **模型优化** - 量化、剪枝等压缩技术
- **生产部署** - 云端、本地、边缘设备部署
- **效果评估** - 建立完整的评估体系

### 为什么要学习这一模块?

2025年的调查显示:**经过微调的模型**在专业任务上表现比通用模型提升30-50%[^1]。掌握微调技能,你就能:

1. 打造行业专属AI助手
2. 大幅提升模型在特定场景的表现
3. 优化推理速度和成本
4. 独立完成端到端的AI项目

### 学习方法

本模块采用"理论+实践"双轨制:
1. **概念讲解** - 通俗解释技术原理
2. **案例分析** - 真实项目经验分享
3. **动手实践** - 完整的代码示例
4. **最佳实践** - 避免常见坑点

---

## 章节列表

1. [微调基础](/ai-basics/08-model-training/01-fine-tuning-basics) - 什么是微调、为什么需要微调、主流微调方法
2. [微调准备](/ai-basics/08-model-training/02-preparation) - 选择模型、准备数据、配置环境
3. [微调实践](/ai-basics/08-model-training/03-fine-tuning-practice) - 三种工具的完整实战案例
4. [模型优化](/ai-basics/08-model-training/04-model-optimization) - 量化、Flash Attention等优化技术
5. [模型部署](/ai-basics/08-model-training/05-deployment) - 从本地到云端的多场景部署方案
6. [模型评估](/ai-basics/08-model-training/06-evaluation) - 建立完整的评估体系

---

## 学习检验

完成本模块学习后,你应该能够:

- [ ] 清晰解释微调与预训练的区别,以及何时需要微调
- [ ] 对比全量微调、LoRA、QLoRA等方法的优缺点
- [ ] 独立准备高质量的微调数据集(至少1000条)
- [ ] 使用LLaMA-Factory或Axolotl完成一次完整的微调
- [ ] 应用量化技术将模型大小减少70%以上
- [ ] 在本地或云端部署微调后的模型
- [ ] 设计并实施模型评估方案
- [ ] 计算AI项目的成本和投资回报率

---

## 扩展阅读

**核心论文**:
- [《LoRA: Low-Rank Adaptation of Large Language Models》](https://arxiv.org/abs/2106.09685) - LoRA原始论文(2021)
- [《QLoRA: Efficient Finetuning of Quantized LLMs》](https://arxiv.org/abs/2305.14314) - 4bit量化微调(2023)
- [《Training Compute-Optimal Large Language Models》](https://arxiv.org/abs/2203.15556) - Chinchilla论文,模型规模与数据量关系

**实战教程**:
- [Hugging Face PEFT教程](https://huggingface.co/docs/peft) - 官方PEFT库文档
- [LLaMA-Factory文档](https://github.com/hiyouga/LLaMA-Factory) - 可视化微调工具
- [Axolotl仓库](https://github.com/OpenAccess-AI-Collective/axolotl) - 配置驱动的训练框架

**数据集资源**:
- [COIG-CQIA](https://huggingface.co/datasets/m-a-p/COIG-CQIA) - 中文指令微调数据
- [Alpaca数据集](https://crfm.stanford.edu/2023/03/13/alpaca.html) - 52K英文指令
- [Firefly](https://huggingface.co/datasets/YeungNLP/firefly-train-1.1M) - 中文多任务数据集

**优化工具**:
- [vLLM](https://docs.vllm.ai) - 高吞吐量推理引擎
- [llama.cpp](https://github.com/ggerganov/llama.cpp) - CPU/GPU通用推理
- [Ollama](https://ollama.com) - 本地模型运行工具

**学习社区**:
- [Hugging Face Forums](https://discuss.huggingface.co) - 微调技术讨论
- [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA) - Reddit开源模型社区
- [Datawhale LLMDrive](https://github.com/datawhalechina/llm-drive) - 中文微调教程

---

**💡 实践建议**: 本模块包含大量代码和实践环节。建议按照章节顺序,先理解概念,再动手实践。微调需要GPU资源,可以在AutoDL、阿里云PAI等平台租用,每小时成本约¥2-5。

---

[← 返回课程目录](/preface) | [继续学习:微调基础 →](/ai-basics/08-model-training/01-fine-tuning-basics)

---

[^1]: McKinsey & Company, "The state of AI in 2025: Micro-tuning and domain adaptation", December 2025.
