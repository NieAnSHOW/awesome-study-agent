# 模块三:提示词工程

> **学习目标**:掌握提示词工程的核心概念、模式和最佳实践,学会设计高质量的提示词
>
> **预计时间**:5-6 小时
>
> **前置知识**:完成模块二学习,了解大语言模型的基本原理
>
> **最后更新**:2025 年 1 月

## 模块介绍

欢迎进入 AI Agent 学习的关键模块!提示词工程(Prompt Engineering)是与 AI 模型有效沟通的核心技能,也是构建高质量 AI Agent 的基础。

本模块将系统探索:
- 提示词基础 - 理解什么是提示词工程及其核心要素
- 提示词模式 - 掌握 Zero-shot、Few-shot、CoT 等经典模式
- 进阶技巧 - 学习框架化思维和复杂任务拆解
- 不同任务的设计 - 针对写作、编程、分析等场景的实践
- 工具与资源 - 了解提示词管理和优化工具

### 为什么提示词工程很重要?

根据 2025 年最新的 AI 应用调查:
- 超过 70% 的 AI 项目失败源于提示词设计不当[^1]
- 优秀的提示词可以将模型性能提升 50-300%
- 提示词工程已成为 AI 从业者的核心技能之一

这意味着什么?提示词是与 AI 交互的"编程语言",掌握它能让您:
1. 充分发挥模型能力,获得更准确的输出
2. 减少试错成本,提高开发效率
3. 构建更可靠的 AI Agent 系统
4. 在 AI 时代保持竞争优势

### 学习方法建议

本模块采用理论与实践结合法:
1. 核心概念 - 用通俗语言讲解提示词工程的原理
2. 模式学习 - 通过经典案例掌握常用模式
3. 实战演练 - 针对不同任务设计并优化提示词
4. 工具实践 - 体验提示词管理和优化工具

---

## 章节列表

1. [提示词基础](/basics/03-prompt-engineering/01-prompt-basics) - 什么是提示词、核心要素、设计原则
2. [提示词模式](/basics/03-prompt-engineering/02-prompt-patterns) - Zero-shot、Few-shot、CoT、ReAct 等模式
3. [进阶技巧](/basics/03-prompt-engineering/03-advanced-techniques) - 框架化思维、复杂任务拆解、安全考虑
4. [不同任务的提示词设计](/basics/03-prompt-engineering/04-prompt-for-different-tasks) - 写作、编程、分析、摘要等场景
5. [工具与资源](/basics/03-prompt-engineering/05-tools-and-resources) - 提示词管理平台、评估工具、学习资源

---

## 学习检验

完成本模块学习后,你应该能够:

- [ ] 清晰解释什么是提示词工程,以及为什么它重要
- [ ] 描述至少 5 种提示词模式及其适用场景
- [ ] 应用 CO-STAR 等框架设计结构化提示词
- [ ] 针对特定任务(写作、编程、分析)设计有效提示词
- [ ] 识别并避免常见的安全问题(如提示注入)
- [ ] 使用至少一个提示词管理工具进行版本控制
- [ ] 通过迭代优化提升提示词质量

---

## 扩展阅读

**经典指南**:
- [Prompt Engineering Guide](https://www.promptingguide.ai/zh) - 最全面的提示词工程指南[^2]
- [Learn Prompting](https://learnprompting.org/zh-Hans) - 系统化的提示工程教程
- [提示词工程指南 - 中文版](https://github.com/PromptEngineeringGuide/Prompt-Engineering-Guide-zh-CN) - 开源中文翻译项目

**推荐框架**:
- [CO-STAR 框架](https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/) - 新加坡政府推广的结构化框架[^3]
- [CRISP 框架](https://pmtoolkit.ai/learn/ai-modern-pm/prompt-engineering-for-product-work) - 产品管理专用框架[^4]

**实践资源**:
- [PromptLayer 博客](https://blog.promptlayer.com) - 提示词工程最佳实践[^5]
- [LaunchDarkly 提示词工程指南](https://launchdarkly.com/blog/prompt-engineering-best-practices/) - 企业级实践[^6]

**工具平台**:
- [PromptLayer](https://promptlayer.com) - 提示词版本管理和 A/B 测试
- [LangSmith](https://smith.langchain.com) - LangChain 生态的提示词调试平台
- [Maxim AI](https://getmaxim.ai) - 企业级提示词管理平台[^7]

**互动体验**:
- 在 [ChatGPT](https://chat.openai.com) 中实践不同的提示词模式
- 在 [Claude](https://claude.ai) 中体验长文本提示词设计
- 在 [DeepSeek](https://deepseek.com) 中测试推理任务的提示词

---

**💡 学习提示**: 提示词工程是一门实践性很强的技能。建议在理解核心概念后,多动手尝试不同任务,通过对比实验来优化提示词。记住:优秀的提示词是迭代出来的,不是一次成型的。

---

[← 返回课程目录](/preface) | [继续学习:提示词基础 →](/basics/03-prompt-engineering/01-prompt-basics)

---

[^1]: McKinsey & Company, "The state of AI in 2025: Agents, innovation, and transformation", November 2025.
[^2]: Prompt Engineering Guide, https://www.promptingguide.ai/zh
[^3]: Parloa Knowledge Hub, "The complete guide to prompt engineering frameworks", https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/
[^4]: PM Toolkit, "Prompt Engineering for Product Work", https://pmtoolkit.ai/learn/ai-modern-pm/prompt-engineering-for-product-work
[^5]: PromptLayer Blog, https://blog.promptlayer.com
[^6]: LaunchDarkly, "Prompt Engineering Best Practices", https://launchdarkly.com/blog/prompt-engineering-best-practices/
[^7]: Maxim AI, "Prompt Engineering Platforms That Actually Work: 2025's Top Picks", https://www.getmaxim.ai/articles/prompt-engineering-platforms-that-actually-work-2025s-top-picks/
