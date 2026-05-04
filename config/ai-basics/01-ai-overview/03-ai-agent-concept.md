# 什么是 AI Agent?

> **本章目标**:搞清楚 AI Agent 是什么,它和普通的 AI 助手有什么不同
>
> **阅读时间**:25 分钟

---

## AI Agent 的定义

### 先搞懂"Agent"是什么

在计算机科学里,"Agent"指的是一个能够自主行动的实体。它不是被动的工具,而是能自己感知环境、做决策、采取行动。

用一句话概括:Agent = 感知 + 决策 + 行动

### AI Agent 是什么

AI Agent 就是基于 AI 技术构建的自主系统。给它一个目标,它能自己想办法完成,而不是被动等待指令。

**核心特征**:
- **自主性**:不需要人一直盯着,自己能跑
- **交互性**:能和环境、用户、其他 Agent 打交道
- **响应性**:环境变了能及时反应
- **主动性**:看到目标会主动去实现

### 一个简单的定义

Cubeo AI 的博客给了一个很直接的说法:

> **"AI Agent 就是一个能自主用工具、循环跑的大语言模型。"**

这个定义虽然简单,但抓住了本质:
- **LLM** 提供智能(理解、推理)
- **Tools** 提供能力(搜索、计算、API)
- **Loop** 持续运行,直到任务完成

### 其他定义

Alvarez & Marsal 认为 AI Agent 是"基于 LLM 和其他 AI/ML 模型的自主软件程序,能执行特定任务、做决策,并与用户、系统或其他 Agent 交互以实现目标"。

aiagent.app 的定义也类似,强调 Agent 能"从数据中学习,随时间适应,执行曾经只有人类才能做的决策和行动"。

---

## AI Agent vs 传统 AI 助手

这是理解 Agent 的关键。我们通过对比来看区别。

### 核心区别

| 特征 | 传统 AI 助手 | AI Agent |
|------|-------------------|---------------------|
| 工作方式 | 你问它答 | 自己规划并执行 |
| 交互次数 | 一次问答 | 多轮循环,直到完成 |
| 工具使用 | 没有 | 能调用外部工具 |
| 任务理解 | 理解问题 | 理解目标并拆解 |
| 自主性 | 低,需要人引导 | 高,自己决策 |
| 记忆能力 | 当前对话 | 可以持久化 |
| 目标 | 回答问题 | 完成任务 |

### 实例对比

**场景**:你想了解最新的 AI 发展趋势

**传统 AI 助手**(如 ChatGPT):
```
你: "告诉我最新的 AI 发展趋势"
AI: [根据训练数据回答,可能已经过时]
```

问题很明显:
- 没法访问实时信息
- 只能基于训练数据回答
- 一次回答完,没法深入研究

**AI Agent**:
```
你: "研究最新的 AI 发展趋势"

Agent 自动执行:
1. 用搜索工具获取最新新闻和论文
2. 阅读并总结关键内容
3. 分析趋势和模式
4. 生成结构化报告
5. 如果需要,再深入研究

最后: 给你一份包含来源、数据、趋势分析的完整报告
```

优势很明显:
- 能获取实时信息
- 能自主规划研究步骤
- 能调用多种工具
- 输出结构化内容

### 打个比方

**传统 AI 助手**就像一个超级聪明的顾问:
- 你问问题,他回答
- 知识渊博,但只能"说",不能"做"

**AI Agent**就像一个超级聪明的执行者:
- 你告诉目标,他自己想办法实现
- 不仅会"说",还能"做"一系列动作

**例子**:
- **AI 助手**: "如何预订机票?" → 告诉你步骤
- **AI Agent**: "帮我订明天去北京的机票" → 直接完成预订

---

## AI Agent 的核心架构

### 基本组件

一个完整的 AI Agent 通常包含这些模块:

```
用户输入目标
    ↓
感知模块 - 理解意图和目标,收集环境信息
    ↓
规划模块 - 拆解任务,制定执行计划
    ↓
决策模块 - 选择工具,决定下一步行动
    ↓
记忆模块 - 短期记忆(当前对话) + 长期记忆(历史经验)
    ↓
工具模块 - 搜索引擎、API 调用、文件操作、代码执行
    ↓
行动模块 - 执行操作,获取反馈
    ↓
循环判断: 目标完成?
  否 → 返回规划模块
  是 → 返回最终结果
```

### 工作流程示例

**任务**: "帮我做一个能追踪 GitHub star 数量的浏览器插件"

一个 AI Agent 的处理流程:

```
1. 感知:理解用户要浏览器插件,目标是追踪 GitHub star

2. 规划:拆解任务
   - 研究浏览器插件开发
   - 调用 GitHub API
   - 设计 UI
   - 编写代码
   - 测试功能

3. 决策:选技术栈(MetaV3 + Vanilla JS),确定功能范围

4. 工具调用:
   - 搜索插件开发教程
   - 调用 GitHub API 文档
   - 生成代码
   - 测试验证

5. 行动:
   - 生成 manifest.json
   - 编写 popup.html
   - 实现 content.js
   - 创建 background.js

6. 反馈与迭代:检查问题,调试修复,优化性能

7. 输出:完整代码 + 安装说明 + 使用指南
```

---

## AI Agent 的三要素

### 感知 (Perception)

**Agent 理解环境和用户需求的能力**

包括:
- 文本理解:理解用户输入的自然语言
- 上下文理解:理解对话历史和任务背景
- 环境感知:获取外部信息(搜索、API、文件)

**技术基础**:大语言模型、提示词工程、上下文学习

### 决策 (Decision Making)

**基于感知信息进行推理和规划的能力**

包括:
- 任务拆解:把复杂目标分解成子任务
- 规划:制定执行步骤和策略
- 推理:基于已知信息推导结论
- 选择:选择合适的工具和行动

**技术基础**:思维链(Chain of Thought)、ReAct 推理、任务规划算法

### 行动 (Action)

**执行具体操作、影响环境的能力**

包括:
- 工具调用:使用外部 API 和服务
- 信息检索:搜索网络、查询数据库
- 内容生成:创建文本、代码、图像
- 系统操作:读写文件、执行命令

**技术基础**:Function Calling、API 集成、执行环境(Sandbox)

---

## AI Agent 的类型

### 按能力分类

**反应式 Agent**
- 根据当前状态直接反应
- 没记忆,不考虑历史
- 简单快速
- 例子:简单客服机器人

**基于目标的 Agent**
- 有明确目标
- 能规划实现路径
- 考虑未来状态
- 例子:导航系统、任务规划 Agent

**基于效用的 Agent**
- 有效用函数(评估好坏的标准)
- 在不确定性下做最优决策
- 考虑多个目标的权衡
- 例子:金融交易 Agent、资源调度 Agent

**学习型 Agent**
- 能从经验中学习
- 不断改进性能
- 适应环境变化
- 例子:推荐系统、自动驾驶

### 按架构分类

**单 Agent 系统**
- 一个 Agent 完成所有任务
- 简单直接,易于实现
- 能力有限,不适合复杂任务

**多 Agent 系统**
- 多个 Agent 协作完成复杂任务

架构:
```
协调器(Orchestrator) - 任务分配、结果整合
    ↓        ↓        ↓
Agent 1   Agent 2   Agent 3
(搜索)    (分析)    (总结)
```

优点:分工协作、效率高、专业性强、容错性好
缺点:复杂度高、需要良好的协调机制

例子:AutoGPT、BabyAGI、研究助手 Agent

---

## AI Agent 的应用场景

### 个人助理

日程管理、邮件回复、信息汇总、任务规划

例子:Motion.ai(日程优化)

### 内容创作

文章写作、图像生成、视频脚本、音乐创作

例子:Notion AI、Jasper

### 软件开发

代码生成、Bug 修复、代码审查、测试生成

例子:Cursor、GitHub Copilot、Claude Code

### 数据分析

数据可视化、趋势分析、报告生成、洞察发现

例子:Julius AI、ChatBI

### 客服与销售

自动回复、问题解决、订单处理、产品推荐

例子:Intercom Fin、Drift

### 科研辅助

文献检索、论文阅读、假设生成、实验设计

例子:Elicit、Consensus

---

## 经典 Agent 案例

### AutoGPT

**发布**: 2023 年 3 月

**核心思想**:把 GPT-4"自主化",用户设定目标,Agent 自动规划、执行、迭代

**工作流程**:
1. 接收目标
2. 规划任务列表
3. 执行子任务
4. 反思评估
5. 调整计划
6. 循环到完成

**影响**:引发了 Agent 开发热潮,证明了自主 Agent 的可能性

**局限**:成本高、可能死循环、难以控制

### BabyAGI

**创造者**: Yohei Nakajima

**特点**:专注于任务管理,自动创建、排序、执行任务

**工作流程**:
1. 接收目标
2. 生成任务列表
3. 按优先级执行
4. 根据结果创建新任务
5. 循环到完成

**应用场景**:项目管理、研究助理、内容创作流水线

### Claude Code

**发布**: 2024 年

**特点**:命令行集成、代码库理解、多文件编辑、Git 集成

**为什么是 Agent**:
- 能感知:读取和理解代码库
- 能决策:规划修改方案
- 能行动:编辑文件、运行命令
- 能迭代:根据错误调整

---

## 如何体验 AI Agent?

### 低代码平台

**Coze(扣子)** - 字节跳动
- 可视化构建 Agent
- 简单易用,国内访问
- https://www.coze.cn

**Dify**
- 开源 Agent 平台
- 可私有部署,灵活
- https://dify.ai

**GPTs**
- OpenAI 的 Agent 构建工具
- 与 ChatGPT 深度集成
- https://chat.openai.com/gpts

### 开发框架

**LangChain / LangGraph**
- 最流行的 Agent 框架
- Python / JavaScript
- https://www.langchain.com

**AutoGen**
- 微软开发
- 多 Agent 协作
- https://github.com/microsoft/autogen

**CrewAI**
- 角色扮演的多 Agent 系统
- https://github.com/joaomdmoura/crewAI

### 体验建议

**初学者**:
1. 访问 Coze 或 Dify
2. 创建一个简单聊天机器人
3. 添加工具(搜索、计算等)
4. 测试自主执行能力

**开发者**:
1. 学习 LangChain 基础
2. 用 ReAct 模式构建第一个 Agent
3. 添加自定义工具
4. 体验完整工作流程

---

## 本章小结

AI Agent 本质上就是能自主感知、决策、行动的 AI 系统。它和传统 AI 助手的核心区别在于:AI 助手被动回答问题,AI Agent 主动完成任务。

核心三要素:
- **感知**:理解环境和需求
- **决策**:推理和规划
- **行动**:执行具体操作

基本工作流程:感知 → 规划 → 决策 → 行动 → 反馈 → 循环

应用场景已经覆盖个人助理、内容创作、软件开发、数据分析等多个领域。

**关键术语**:
- **Agent**:能自主行动的实体
- **Perception**:理解环境的能力
- **Reasoning**:基于信息的决策过程
- **Action**:执行具体操作
- **Tool Use**:调用外部工具和服务
- **Multi-Agent System**:多个 Agent 协作工作

---

## 思考题

1. **基础**:用自己的话解释 AI Agent 和传统 AI 助手的区别

2. **进阶**:如果要构建一个"旅行规划 Agent",它需要哪些模块?每个模块做什么?

3. **挑战**:AI Agent 会带来哪些新的挑战和风险?(失控、隐私、安全等)应该如何应对?

---

## 实践探索

**初级体验**:
1. 访问 [Coze](https://www.coze.cn)
2. 创建一个"新闻摘要 Agent"
3. 添加搜索工具
4. 测试自动获取和总结新闻的能力

**中级挑战**:
1. 使用 LangChain 构建简单 Agent
2. 实现一个"研究助手"Agent
3. 功能:搜索、阅读、总结
4. 参考: https://python.langchain.com/docs/modules/agents/

**高级项目**:
1. 构建多 Agent 系统
2. 角色分工:搜索者、分析师、总结者
3. 实现 Agent 之间的协作
4. 优化性能和准确性

---

## 扩展阅读

**推荐文章**:
- [What is an AI Agent? - Cubeo AI](https://www.cubeo.ai/what-is-an-ai-agent/)
- [Demystifying AI Agents in 2025 - Alvarez & Marsal](https://www.alvarezandmarsal.com/thought-leadership/demystifying-ai-agents-in-2025-separating-hype-from-reality-and-navigating-market-outlook)
- [What are AI agents? - aiagent.app](https://aiagent.app/blog/what-are-ai-agents-2025)

**经典论文**:
- "ReAct: Synergizing Reasoning and Acting in Language Models" (2022)
- "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023)

**实践框架**:
- [LangChain 官方文档](https://www.langchain.com/)
- [AutoGen GitHub](https://github.com/microsoft/autogen)
- [CrewAI 文档](https://www.crewai.com/)

**视频资源**:
- [AI Agents Explained](https://www.youtube.com/results?search_query=ai+agents+explained)
- [Building AI Agents with LangChain](https://www.youtube.com/results?search_query=building+ai+agents+langchain)

---

**下一章**:我们将探讨为什么 AI Agent 被认为是未来的核心,以及它将如何改变工作和生活。

[← 返回模块首页](/ai-basics/01-ai-overview) | [继续学习:为什么 Agent 是未来? →](/ai-basics/01-ai-overview/04-why-agent-matters)
