# Agent 类型

> **本章学习目标**：了解不同类型的 AI Agent、它们的特点、适用场景以及设计选择
>
> **预计阅读时间**：45 分钟

---

## 一、Agent 分类概述

### 1.1 为什么要分类？

AI Agent 不是"一刀切"的解决方案。不同任务需要不同类型的 Agent：

```
简单任务 → 反应式 Agent（快速、简单）
复杂任务 → 目标驱动 Agent（规划、推理）
长期运行 → 学习型 Agent（持续改进）
专业领域 → 专家 Agent（深度知识）
协作任务 → 多 Agent 系统（分工合作）
```

**理解分类的好处**：
- ✅ 选择合适的 Agent 类型
- ✅ 理解不同设计的权衡
- ✅ 避免过度设计或设计不足
- ✅ 为特定任务构建最佳方案

### 1.2 分类维度

Agent 可以从多个维度分类：

| 分类维度 | 类型 |
|---------|------|
| **按能力** | 反应式、目标驱动、学习型 |
| **按架构** | 单 Agent、多 Agent |
| **按自主性** | 半自主、全自主 |
| **按领域** | 通用、专家型 |
| **按交互方式** | 对话式、任务式、混合式 |

---

## 二、按能力分类

### 2.1 反应式 Agent (Reactive Agent)

**定义**：
仅根据当前输入做出反应，不考虑历史状态的 Agent。

**特点**：
```
✓ 响应快速
✓ 实现简单
✓ 资源消耗低
✗ 无记忆能力
✗ 无法规划
✗ 无法学习
```

**工作流程**：
```
输入 → 处理 → 输出
```

**适用场景**：
- 问答系统
- 简单的客服机器人
- 信息查询
- 单步任务

**例子**：
```python
# 反应式 Agent 示例
class ReactiveAgent:
    def respond(self, user_input):
        # 仅根据当前输入生成回复
        response = llm.generate(user_input)
        return response
        # 无记忆，无规划，单次交互
```

**现实案例**：
- 早期的 ChatGPT（无插件版本）
- 简单的聊天机器人
- FAQ 机器人

---

### 2.2 目标驱动 Agent (Goal-Based Agent)

**定义**：
有明确目标，能规划并执行任务以达成的 Agent。

**特点**：
```
✓ 有明确目标
✓ 能规划任务
✓ 能使用工具
✓ 有短期记忆
✗ 无长期学习能力
✗ 需要人工设定目标
```

**工作流程**：
```
目标 → 规划 → 执行 → 检查 → [未完成则循环] → 完成
```

**适用场景**：
- 任务自动化
- 研究助手
- 个人助理
- 代码助手

**例子**：
```python
# 目标驱动 Agent 示例
class GoalBasedAgent:
    def __init__(self, goal):
        self.goal = goal
        self.memory = []
        self.tools = [search_tool, calculator, api_tool]

    def run(self):
        plan = self.planner.make_plan(self.goal)
        while not self.is_completed():
            action = self.reasoner.decide_next(plan, self.memory)
            result = self.execute(action)
            self.memory.append(result)
        return self.get_result()
```

**现实案例**：
- AutoGPT
- Claude Code
- Cursor
- 订票 Agent

---

### 2.3 学习型 Agent (Learning Agent)

**定义**：
能从经验中学习，持续改进性能的 Agent。

**特点**：
```
✓ 能从经验学习
✓ 持续改进
✓ 适应环境变化
✗ 实现复杂
✗ 需要训练数据
✗ 可能不稳定
```

**工作流程**：
```
执行任务 → 收集反馈 → 学习改进 → 应用于新任务
    ↑                                         ↓
    └──────────────── 循环 ────────────────────┘
```

**学习机制**：
1. **强化学习**：根据奖励/惩罚优化行为
2. **监督学习**：从标注数据中学习
3. **自监督学习**：从无标签数据中发现模式
4. **记忆学习**：从历史经验中提取知识

**适用场景**：
- 推荐系统
- 个性化助理
- 游戏 Agent
- 自动驾驶

**例子**：
```python
# 学习型 Agent 示例
class LearningAgent:
    def __init__(self):
        self.knowledge_base = VectorDatabase()
        self.performance_history = []

    def execute_task(self, task):
        # 检索相关经验
        past_experiences = self.knowledge_base.search(task)
        # 基于经验执行
        result = self.execute_with_learning(task, past_experiences)
        # 记录结果
        self.knowledge_base.add(task, result)
        # 评估并改进
        self.evaluate_and_improve(result)
        return result
```

**现实案例**：
- AlphaGo（从对局中学习）
- 推荐系统（从用户反馈学习）
- 个性化新闻聚合器

---

### 2.4 效用驱动 Agent (Utility-Based Agent)

**定义**：
基于效用函数评估和选择最优行动的 Agent。

**什么是效用函数？**
效用函数是对状态"好坏程度"的度量。

```
效用函数 U(state) → 数值
数值越高，状态越好

例子：
导航 Agent 的效用函数：
U(state) = 时间权重 × 剩余时间
         + 舒适权重 × 道路质量
         + 成本权重 × 费用
         + 安全权重 × 风险系数
```

**特点**：
```
✓ 能处理不确定性
✓ 能权衡多个目标
✓ 能做出最优决策
✗ 需要设计效用函数
✗ 计算复杂度高
```

**适用场景**：
- 资源调度
- 金融交易
- 风险决策
- 多目标优化

**例子**：
```python
# 效用驱动 Agent 示例
class UtilityBasedAgent:
    def __init__(self):
        self.utility_function = self.design_utility()

    def design_utility(self):
        # 设计效用函数
        return lambda state: (
            0.4 * time_score(state) +
            0.3 * cost_score(state) +
            0.2 * quality_score(state) +
            0.1 * risk_score(state)
        )

    def choose_action(self, possible_actions):
        # 选择效用最高的行动
        utilities = []
        for action in possible_actions:
            future_state = self.predict(action)
            utility = self.utility_function(future_state)
            utilities.append((action, utility))

        return max(utilities, key=lambda x: x[1])[0]
```

**现实案例**：
- 金融交易 Agent（平衡收益和风险）
- 物流调度 Agent（优化时间和成本）
- 能源管理 Agent（平衡效率和环保）

---

## 三、按架构分类

### 3.1 单 Agent 系统

**定义**：
由一个 Agent 完成所有任务的系统。

**架构**：
```
用户 → Agent → 工具 → 结果
         ↑___↓
         记忆
```

**优点**：
```
✓ 简单直接
✓ 易于实现
✓ 上下文连贯
✓ 调试方便
```

**缺点**：
```
✗ 能力有限
✗ 单点故障
✗ 难以专业化
✗ 扩展性差
```

**适用场景**：
- 个人助理
- 简单任务
- 快速原型
- 单一领域任务

**例子**：
```python
# 单 Agent 示例
class SingleAgent:
    def __init__(self):
        self.tools = {
            'search': SearchTool(),
            'code': CodeTool(),
            'calculate': CalculatorTool(),
            # 所有能力集中在一个 Agent
        }

    def handle_task(self, task):
        # 一个 Agent 处理所有方面
        plan = self.plan(task)
        for subtask in plan:
            tool = self.select_tool(subtask)
            result = tool.execute(subtask)
        return self.aggregate(results)
```

---

### 3.2 多 Agent 系统 (Multi-Agent System)

**定义**：
多个 Agent 协作完成任务的系统。

**架构模式**：

#### A. 层级式 (Hierarchical)

```
        主控 Agent (Orchestrator)
           /     |     \
          ↓      ↓      ↓
    Agent 1  Agent 2  Agent 3
    (搜索)   (分析)   (写作)
```

**特点**：
- 有明确的领导者
- 自上而下的任务分配
- 适合结构化任务

**例子**：
```python
# 层级式多 Agent
class OrchestratorAgent:
    def __init__(self):
        self.sub_agents = {
            'researcher': ResearchAgent(),
            'analyst': AnalysisAgent(),
            'writer': WritingAgent()
        }

    def handle_task(self, task):
        # 分配任务给子 Agent
        research_result = self.sub_agents['researcher'].search(task)
        analysis = self.sub_agents['analyst'].analyze(research_result)
        report = self.sub_agents['writer'].write(analysis)
        return report
```

#### B. 平等协作式 (Collaborative)

```
Agent 1 ←→ Agent 2 ←→ Agent 3
   ↑         ↓          ↑
   └─────────┴──────────┘
      共享工作空间
```

**特点**：
- Agent 之间平等协作
- 通过协商达成共识
- 适合需要共识的场景

#### C. 竞争式 (Competitive)

```
Agent 1 ──┐
           ├─→ 仲裁 → 最佳方案
Agent 2 ──┘
```

**特点**：
- 多个 Agent 提供方案
- 通过竞争选择最优
- 适合需要创新的场景

#### D. 流水线式 (Pipeline)

```
输入 → Agent 1 → 中间结果 → Agent 2 → ... → Agent N → 输出
      (预处理)              (处理)           (后处理)
```

**特点**：
- 按阶段处理
- 每个 Agent 专精一个阶段
- 适合顺序处理任务

**多 Agent 系统的优点**：
```
✓ 分工协作，效率高
✓ 各展所长，专业性强
✓ 容错性好（一个失败不影响全部）
✓ 可扩展性强
✓ 可并行处理
```

**多 Agent 系统的挑战**：
```
✗ 复杂度高
✗ 通信开销大
✗ 需要良好的协调机制
✗ 可能出现冲突
✗ 调试困难
```

**现实案例**：
- **AutoGen**：微软的多 Agent 框架
- **CrewAI**：角色扮演式多 Agent 系统
- **MetaGPT**：软件公司模拟的多 Agent 系统

---

## 四、按自主性分类

### 4.1 半自主 Agent

**定义**：
需要人工监督和审批的 Agent。

**特点**：
```
✓ 安全可控
✓ 人类参与关键决策
✓ 适合高风险场景
✗ 效率较低
✗ 需要人工干预
```

**工作模式**：
```
Agent 执行 → 人类审批 → 继续执行
                ↑
             [拒绝] → 调整方案
```

**适用场景**：
- 医疗诊断辅助
- 金融交易
- 安全系统
- 法律建议

**例子**：
```python
# 半自主 Agent 示例
class SemiAutonomousAgent:
    def __init__(self):
        self.approval_required = {
            'delete_files': True,
            'send_email': True,
            'make_payment': True,
            'search': False
        }

    def execute_action(self, action):
        if self.approval_required.get(action.type, False):
            # 需要人工审批
            print(f"即将执行：{action.description}")
            if not self.get_human_approval():
                return "操作已取消"
        return action.execute()
```

---

### 4.2 全自主 Agent

**定义**：
完全独立运行，无需人工干预的 Agent。

**特点**：
```
✓ 高效率
✓ 24/7 运行
✓ 适合大规模任务
✗ 风险较高
✗ 可能失控
✗ 难以预测
```

**工作模式**：
```
设定目标 → Agent 完全自主执行 → 返回结果
```

**适用场景**：
- 数据采集
- 监控系统
- 自动化测试
- 批量处理

**例子**：
```python
# 全自主 Agent 示例
class FullyAutonomousAgent:
    def __init__(self, goal):
        self.goal = goal
        self.max_iterations = 100
        self.safety_checks = True

    def run(self):
        iteration = 0
        while not self.is_completed() and iteration < self.max_iterations:
            # 安全检查
            if self.safety_checks and self.is_unsafe():
                self.emergency_stop()
                break

            # 自主执行
            action = self.plan_next_action()
            self.execute(action)
            self.learn_from_feedback()
            iteration += 1

        return self.final_result()
```

**安全机制**：
```
全自主 Agent 应该有：
• 最大迭代次数限制
• 资源使用上限
• 紧急停止机制
• 行为边界限制
• 异常检测
```

---

## 五、按领域分类

### 5.1 通用 Agent (General Agent)

**定义**：
能够处理多种类型任务的 Agent。

**特点**：
```
✓ 灵活性高
✓ 应用范围广
✗ 深度能力有限
✗ 需要大量资源
```

**例子**：
- ChatGPT
- Claude
- AutoGPT

---

### 5.2 专家型 Agent (Specialized Agent)

**定义**：
在特定领域深度优化的 Agent。

**类型**：

#### 编程 Agent
```
能力：
• 代码生成
• Bug 修复
• 代码审查
• 重构优化
• 测试生成

工具：
• 代码编辑器 API
• 编译器
• 测试框架
• 文档搜索
```

#### 研究 Agent
```
能力：
• 文献检索
• 论文阅读
• 数据分析
• 趋势识别
• 报告生成

工具：
• 学术搜索 API
• PDF 解析
• 数据可视化
• 统计分析
```

#### 创意 Agent
```
能力：
• 文案写作
• 图像生成
• 视频脚本
• 音乐创作

工具：
• 文生图 API
• 文本生成模型
• 素材库
```

**专家型 Agent 的优势**：
```
✓ 深度高
✓ 专业性强
✓ 效率高
✓ 质量好
```

---

## 六、如何选择合适的 Agent 类型？

### 6.1 决策树

```
开始
  ↓
任务是否复杂？ ──否──→ 反应式 Agent
  ↓是
需要从经验学习？ ──是──→ 学习型 Agent
  ↓否
有多个目标需要权衡？ ──是──→ 效用驱动 Agent
  ↓否
任务可分解为子任务？ ──是──→ 多 Agent 系统
  ↓否
需要使用工具？ ──是──→ 目标驱动 Agent
  ↓否
               反应式 Agent
```

### 6.2 选择指南

| 任务特征 | 推荐类型 | 原因 |
|---------|---------|------|
| 简单问答 | 反应式 | 无需规划，快速响应 |
| 多步任务 | 目标驱动 | 需要规划和执行 |
| 长期运行 | 学习型 | 需要持续改进 |
| 多目标 | 效用驱动 | 需要权衡取舍 |
| 复杂大型任务 | 多 Agent | 分工协作效率高 |
| 高风险 | 半自主 | 需要人工监督 |
| 批量处理 | 全自主 | 效率优先 |
| 特定领域 | 专家型 | 专业化深度 |

### 6.3 实例分析

**场景 1：客服聊天机器人**
```
特征：
• 简单问答为主
• 偶尔需要查询订单
• 无需长期记忆
• 需要快速响应

推荐：反应式 Agent + 少量工具
```

**场景 2：旅行规划 Agent**
```
特征：
• 多步任务
• 需要多个工具
• 需要规划
• 单次执行

推荐：目标驱动 Agent
```

**场景 3：个性化推荐系统**
```
特征：
• 长期运行
• 需要从用户行为学习
• 持续改进
• 适应变化

推荐：学习型 Agent
```

**场景 4：研究助手**
```
特征：
• 复杂任务
• 需要多种能力（搜索、阅读、分析、写作）
• 可并行处理

推荐：多 Agent 系统
    ├─ 搜索 Agent
    ├─ 阅读 Agent
    ├─ 分析 Agent
    └─ 写作 Agent
```

---

## 七、Agent 类型对比总结

### 7.1 快速对比表

| 类型 | 自主性 | 记忆 | 学习 | 复杂度 | 适用场景 |
|-----|-------|------|------|--------|---------|
| **反应式** | 低 | 无 | 无 | 低 | 简单问答 |
| **目标驱动** | 中 | 短期 | 无 | 中 | 任务自动化 |
| **学习型** | 中高 | 长期 | 有 | 高 | 持续改进场景 |
| **效用驱动** | 中 | 短期 | 可选 | 中高 | 多目标优化 |
| **单 Agent** | 可变 | 可变 | 可变 | 低 | 简单任务 |
| **多 Agent** | 可变 | 共享 | 可变 | 高 | 复杂协作 |

### 7.2 类型演进

```
简单 → 复杂
反应式 → 目标驱动 → 学习型

单一 → 协作
单 Agent → 多 Agent

通用 → 专业
通用 Agent → 专家 Agent

人工 → 自主
半自主 → 全自主
```

---

## 本章小结

### 核心要点

1. **Agent 有多种分类方式**：
   - 按能力：反应式、目标驱动、学习型、效用驱动
   - 按架构：单 Agent、多 Agent
   - 按自主性：半自主、全自主
   - 按领域：通用、专家型

2. **不同类型适用于不同场景**：
   - 简单任务用简单 Agent（避免过度设计）
   - 复杂任务用复杂 Agent（保证能力）
   - 选择取决于任务需求、资源、风险

3. **多 Agent 系统是趋势**：
   - 适合复杂任务
   - 分工协作效率高
   - 但需要良好的协调

4. **选择 Agent 类型的关键**：
   - 理解任务特征
   - 评估需求
   - 考虑约束条件

### 类型记忆口诀

```
反应式，快又简，
目标驱动善规划，
学习型，能进化，
效用驱动优决策。

单 Agent，易实现，
多 Agent，强协作，
半自主，保安全，
全自主，高效率。
```

---

## 思考题

1. **基础题**：对比反应式 Agent 和目标驱动 Agent，列出 3 个主要区别。

2. **进阶题**：什么情况下应该使用多 Agent 系统而不是单 Agent？请举一个具体例子说明。

3. **挑战题**：设计一个"智能客服系统"，它会根据问题类型自动路由到不同类型的 Agent（简单问题用反应式，复杂问题用目标驱动，专业问题用专家 Agent）。画出系统架构图。

---

## 实践探索

**观察活动**：
1. 访问 [Coze](https://www.coze.cn)
2. 创建一个多 Agent 系统
3. 设置不同角色的 Agent（如：搜索者、分析者、总结者）
4. 观察它们如何协作

**设计练习**：
为以下场景选择最合适的 Agent 类型，并说明理由：
1. 股票交易助手
2. 代码审查工具
3. 个人日程管理
4. 新闻聚合器

---

## 扩展阅读

**多 Agent 系统**：
- [AutoGen 文档](https://github.com/microsoft/autogen) - 微软的多 Agent 框架
- [CrewAI](https://www.crewai.com/) - 角色扮演式多 Agent 系统

**经典论文**：
- "Cooperative Negotiation in Multi-Agent Systems" - 多 Agent 协作理论
- "Multi-Agent Systems: A Survey" - 多 Agent 系统综述

**实践案例**：
- [MetaGPT](https://github.com/geekan/MetaGPT) - 软件公司模拟的多 Agent 系统
- [ChatDev](https://github.com/OpenBMB/ChatDev) - 软件开发多 Agent 系统

---

**下一章**：我们将深入了解 Agent 的记忆系统。

[← 返回模块首页](/basics/04-agent-fundamentals) | [继续学习：记忆系统 →](/basics/04-agent-fundamentals/03-memory-system)
