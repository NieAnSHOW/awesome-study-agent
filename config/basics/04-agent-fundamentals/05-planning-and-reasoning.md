# 规划与推理

> **本章学习目标**：深入理解 AI Agent 的规划能力、推理机制、思维模式以及优化策略
>
> **预计阅读时间**：50 分钟

---

## 一、规划与推理概述

### 1.1 什么是规划与推理？

**规划 (Planning)**：
将复杂目标分解为可执行步骤的能力。

**推理 (Reasoning)**：
基于信息和逻辑进行决策、得出结论的能力。

```
没有规划与推理的 Agent：
❌ 只能做单步任务
❌ 无法处理复杂问题
❌ 容易迷失方向
❌ 重复犯错

有规划与推理的 Agent：
✅ 能拆解复杂任务
✅ 能选择最优路径
✅ 能从错误中学习
✅ 能适应新情况
```

### 1.2 规划与推理的关系

```
┌─────────────────────────────────────────┐
│        规划与推理的协作关系              │
├─────────────────────────────────────────┤
│                                         │
│  规划："做什么"（What）                  │
│  • 理解目标                             │
│  • 分解任务                             │
│  • 制定计划                             │
│                                         │
│  推理："怎么做"（How）                   │
│  • 选择行动                             │
│  • 评估结果                             │
│  • 调整策略                             │
│                                         │
│  两者循环协作：                         │
│  规划 → 推理 → 行动 → 反馈 → 规划       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 二、规划机制

### 2.1 任务分解

**定义**：
将复杂目标拆解为可管理的子任务。

**为什么需要任务分解？**
```
目标："做一个网站"

不分解：
❌ 太大，无从下手
❌ 容易遗漏
❌ 难以跟踪

分解后：
✓ 1. 需求分析
✓ 2. 设计原型
✓ 3. 前端开发
✓ 4. 后端开发
✓ 5. 测试
✓ 6. 部署
```

**任务分解策略**：

#### 1. 层级分解
```python
def hierarchical_decompose(goal):
    """层级分解任务"""
    plan = {
        "goal": goal,
        "level_1": [  # 第一层子任务
            {
                "task": "研究",
                "subtasks": [  # 第二层
                    "搜索文献",
                    "阅读论文",
                    "总结发现"
                ]
            },
            {
                "task": "设计",
                "subtasks": [
                    "架构设计",
                    "UI设计",
                    "API设计"
                ]
            },
            {
                "task": "实现",
                "subtasks": [
                    "前端开发",
                    "后端开发",
                    "数据库"
                ]
            }
        ]
    }
    return plan
```

#### 2. 依赖关系分解
```python
def dependency_aware_decompose(goal):
    """考虑依赖关系的任务分解"""
    plan = [
        {
            "task": "设计数据库",
            "dependencies": [],  # 无依赖
            "priority": "high"
        },
        {
            "task": "创建后端 API",
            "dependencies": ["设计数据库"],
            "priority": "high"
        },
        {
            "task": "开发前端",
            "dependencies": ["创建后端 API"],
            "priority": "medium"
        },
        {
            "task": "编写测试",
            "dependencies": ["创建后端 API", "开发前端"],
            "priority": "medium"
        },
        {
            "task": "部署",
            "dependencies": ["编写测试"],
            "priority": "low"
        }
    ]
    return order_by_dependency(plan)
```

#### 3. 递归分解
```python
def recursive_decompose(task, max_depth=3):
    """递归分解任务"""
    if max_depth == 0 or is_atomic(task):
        return [task]

    # 分解为子任务
    subtasks = llm.decompose(task)

    # 递归分解每个子任务
    result = []
    for subtask in subtasks:
        result.extend(recursive_decompose(subtask, max_depth - 1))

    return result

# 示例
task = "开发一个博客网站"
plan = recursive_decompose(task, max_depth=3)
# 输出：
# [
#   "确定技术栈",
#   "设计数据库模式",
#   "实现用户认证",
#   "实现文章CRUD",
#   "设计前端界面",
#   "实现前端组件",
#   "部署上线"
# ]
```

---

### 2.2 计划表示

#### 任务列表
```python
plan = [
    "搜索最新 AI 论文",
    "阅读并总结论文",
    "分析研究趋势",
    "生成报告"
]
```

#### 结构化计划
```python
plan = {
    "goal": "研究 AI 趋势",
    "tasks": [
        {
            "id": 1,
            "description": "搜索论文",
            "tool": "search",
            "parameters": {"query": "AI agents 2025"},
            "expected_output": "论文列表",
            "status": "pending"
        },
        {
            "id": 2,
            "description": "阅读论文",
            "tool": "read_paper",
            "depends_on": [1],
            "status": "pending"
        }
    ]
}
```

#### 图表示
```python
# 使用有向无环图 (DAG)
from networkx import DiGraph

plan = DiGraph()

# 添加节点（任务）
plan.add_node("search", task="搜索论文")
plan.add_node("read", task="阅读论文")
plan.add_node("analyze", task="分析趋势")
plan.add_node("report", task="生成报告")

# 添加边（依赖关系）
plan.add_edge("search", "read")  # read 依赖 search
plan.add_edge("read", "analyze")
plan.add_edge("analyze", "report")

# 拓扑排序得到执行顺序
execution_order = list(topological_sort(plan))
```

---

### 2.3 规划算法

#### 前向搜索
```python
class ForwardPlanner:
    """前向搜索规划器"""

    def plan(self, initial_state, goal_state):
        """从初始状态搜索到目标状态"""
        path = []
        current_state = initial_state

        while not self.satisfies(current_state, goal_state):
            # 生成可能的下一步行动
            possible_actions = self.get_possible_actions(current_state)

            # 评估每个行动
            best_action = self.evaluate(possible_actions, goal_state)

            # 执行最佳行动
            current_state = self.execute(best_action)
            path.append(best_action)

        return path

    def get_possible_actions(self, state):
        """获取当前状态可能的行动"""
        actions = []
        # 基于状态生成行动
        if state["has_search_result"] == False:
            actions.append("search")
        if state["has_data"] == True:
            actions.append("analyze")
        return actions
```

#### 反向搜索
```python
class BackwardPlanner:
    """反向搜索规划器"""

    def plan(self, initial_state, goal_state):
        """从目标状态反向推导"""
        plan = []
        current_goal = goal_state

        while not self.satisfies(initial_state, current_goal):
            # 找到能实现当前目标的子目标
            subgoals = self.get_subgoals(current_goal)

            # 选择最佳子目标
            best_subgoal = self.select_best(subgoals)

            # 添加到计划（反向）
            plan.insert(0, best_subgoal)
            current_goal = best_subgoal["precondition"]

        return plan
```

#### 启发式搜索（A*）
```python
import heapq

class AStarPlanner:
    """A* 启发式搜索规划器"""

    def plan(self, start, goal):
        """使用 A* 算法规划"""
        # 优先队列：(f_score, state, path)
        open_set = [(self.heuristic(start, goal), start, [])]
        visited = set()

        while open_set:
            f_score, current, path = heapq.heappop(open_set)

            if current in visited:
                continue
            visited.add(current)

            # 到达目标
            if self.satisfies(current, goal):
                return path

            # 扩展子节点
            for action, next_state in self.get_successors(current):
                if next_state not in visited:
                    g = len(path) + 1  # 实际代价
                    h = self.heuristic(next_state, goal)  # 启发式
                    f = g + h
                    new_path = path + [action]
                    heapq.heappush(open_set, (f, next_state, new_path))

        return None  # 无解

    def heuristic(self, state, goal):
        """启发式函数：估算从 state 到 goal 的代价"""
        # 简单示例：未完成的目标数量
        return sum(1 for k in goal if state.get(k) != goal[k])
```

---

## 三、推理机制

### 3.1 思维链 (Chain of Thought, CoT)

**定义**：
让模型展示推理过程的提示技术。

**基本原理**：
```
问题：Roger 有 5 个网球。他又买了 2 罐网球。
每罐有 3 个球。现在他有多少个网球？

没有 CoT：
Roger = 5 + 2 × 3 = 11

有 CoT：
Roger 开始有 5 个球
买了 2 罐，每罐 3 个球 = 6 个球
5 + 6 = 11
答案：11
```

**实现方式**：
```python
def chain_of_thought_prompt(question):
    """生成思维链提示"""
    prompt = f"""
    问题：{question}

    让我们一步步思考：

    1. 首先理解问题
    2. 识别已知信息
    3. 确定需要做什么
    4. 逐步计算
    5. 得出答案

    思考过程：
    """
    return prompt

# 使用
response = llm.generate(chain_of_thought_prompt("复杂问题"))
```

**CoT 的优势**：
```
✓ 提高复杂问题准确率
✓ 可解释性强
✓ 容易调试

局限性：
✗ 增加计算成本
✗ 可能产生冗长输出
✗ 不一定总能改进结果
```

---

### 3.2 ReAct (Reasoning + Acting)

**定义**：
结合推理和行动的 Agent 框架。

**核心思想**：
```
循环：推理 → 行动 → 观察 → 推理 → ...

不是一次性规划所有步骤，
而是边推理边行动，根据观察调整。
```

**ReAct 流程**：
```python
class ReActAgent:
    """ReAct Agent 实现"""

    def run(self, task):
        thoughts = []
        actions = []
        observations = []

        while not self.is_completed(task, observations):
            # 1. 推理：决定下一步做什么
            thought = self.reason(task, thoughts, actions, observations)
            thoughts.append(thought)

            # 2. 行动：执行具体操作
            if "Action:" in thought:
                action = self.parse_action(thought)
                result = self.execute_action(action)
                actions.append(action)
                observations.append(result)

        return {
            "thoughts": thoughts,
            "actions": actions,
            "final_answer": self.extract_answer(thoughts[-1])
        }

    def reason(self, task, thoughts, actions, observations):
        """生成推理"""
        prompt = f"""
        任务：{task}

        之前的思考：{thoughts}
        之前的行动：{actions}
        观察结果：{observations}

        现在思考：
        1. 当前状态如何？
        2. 下一步应该做什么？
        3. 需要什么信息？

        思考：
        """

        return llm.generate(prompt)

    def execute_action(self, action):
        """执行行动"""
        tool_name, params = self.parse_action(action)
        return self.tools[tool_name].execute(**params)
```

**ReAct 示例**：
```
任务：ChatGPT 发布日期是什么？

思考 1：用户想知道 ChatGPT 的发布日期。
行动 1：Search["ChatGPT release date"]
观察 1：ChatGPT 于 2022 年 11 月 30 日发布

思考 2：我已经找到了答案。ChatGPT 于 2022 年 11 月 30 日首次发布。
答案：ChatGPT 于 2022 年 11 月 30 日发布
```

---

### 3.3 自我反思 (Self-Reflection)

**定义**：
Agent 检查自己的输出，发现并修正错误。

**为什么需要自我反思？**
```
没有反思：
AI: "Python 是 1991 年发明的"
（错误，但没有自我检查）

有反思：
AI: "Python 是 1991 年发明的"
反思：让我验证这个信息...
工具查询：确认 Python 是 1991 年发明的
修正：正确
```

**实现方式**：
```python
class ReflectiveAgent:
    """有自我反思能力的 Agent"""

    def answer_with_reflection(self, question):
        """回答问题并进行反思"""
        # 1. 初步回答
        initial_answer = llm.generate(f"回答：{question}")

        # 2. 自我反思
        reflection = self.reflect(question, initial_answer)

        # 3. 根据反思决定是否需要改进
        if self.needs_improvement(reflection):
            # 4. 改进回答
            improved_answer = self.improve(
                question,
                initial_answer,
                reflection
            )
            return improved_answer

        return initial_answer

    def reflect(self, question, answer):
        """反思回答"""
        prompt = f"""
        问题：{question}
        回答：{answer}

        请反思：
        1. 这个回答准确吗？
        2. 有什么遗漏或错误？
        3. 需要验证哪些信息？
        4. 如何改进？

        反思：
        """
        return llm.generate(prompt)

    def needs_improvement(self, reflection):
        """判断是否需要改进"""
        # 检查反思中是否提到问题
        keywords = ["不准确", "需要验证", "应该改进", "错误"]
        return any(kw in reflection for kw in keywords)
```

**Reflexion 框架**（进阶）：
```python
class ReflexionAgent:
    """Reflexion 框架实现"""

    def __init__(self):
        self.memory = []
        self.reflection_memory = []

    def solve(self, task, max_iterations=3):
        """带反思的问题解决"""
        for iteration in range(max_iterations):
            # 1. 生成解决方案
            solution = self.generate_solution(task, self.memory)

            # 2. 执行并评估
            result = self.execute(solution)
            evaluation = self.evaluate(task, result)

            # 3. 如果成功，返回
            if evaluation["success"]:
                return result

            # 4. 反思失败原因
            reflection = self.reflect(
                task,
                solution,
                evaluation
            )

            # 5. 存储反思以备后用
            self.reflection_memory.append({
                "task": task,
                "solution": solution,
                "reflection": reflection
            })

            # 6. 用反思指导下一次尝试
            self.memory.append(reflection)

        return None  # 失败

    def reflect(self, task, solution, evaluation):
        """反思失败"""
        prompt = f"""
        任务：{task}
        尝试的方案：{solution}
        结果：{evaluation}

        请反思：
        1. 为什么失败了？
        2. 之前采取了哪些错误的步骤？
        3. 应该采取什么不同的做法？

        反思：
        """
        return llm.generate(prompt)
```

---

### 3.4 树搜索推理

**定义**：
探索多种可能的推理路径，选择最优的。

**算法**：
```
        初始问题
           │
    ┌──────┴──────┐
    ↓             ↓
  路径 A        路径 B
    │             │
  评估          评估
    │             │
    ↓             ↓
  分数：7       分数：3

选择：路径 A（更高分数）
```

**实现**：
```python
class TreeOfThoughts:
    """树搜索推理"""

    def __init__(self, branching_factor=3, max_depth=5):
        self.branching_factor = branching_factor
        self.max_depth = max_depth

    def solve(self, problem):
        """使用树搜索求解"""
        root = {
            "state": problem,
            "thought": None,
            "parent": None,
            "children": []
        }

        # 广度优先搜索
        queue = [root]
        best_solution = None
        best_score = -float('inf')

        while queue:
            current = queue.pop(0)
            current_depth = self.get_depth(current)

            # 达到最大深度，评估
            if current_depth >= self.max_depth:
                score = self.evaluate(current["state"])
                if score > best_score:
                    best_solution = current
                    best_score = score
                continue

            # 生成多个可能的下一步
            next_thoughts = self.generate_thoughts(
                current["state"],
                n=self.branching_factor
            )

            for thought in next_thoughts:
                # 创建子节点
                child = {
                    "state": self.apply_thought(current["state"], thought),
                    "thought": thought,
                    "parent": current,
                    "children": []
                }
                current["children"].append(child)
                queue.append(child)

        # 返回最佳路径
        return self.extract_path(best_solution)

    def generate_thoughts(self, state, n):
        """生成 n 个不同的思考方向"""
        prompt = f"""
        当前状态：{state}

        生成 {n} 个不同的下一步思考方向。
        每个方向应该探索不同的可能性。

        格式：
        1. [思考 1]
        2. [思考 2]
        ...
        """
        response = llm.generate(prompt)
        return self.parse_thoughts(response)
```

---

## 四、高级推理技术

### 4.1 分解推理 (Decomposed Reasoning)

**思想**：
将复杂问题分解为子问题，分别解决后再综合。

```python
class DecomposedReasoning:
    """分解推理"""

    def solve(self, complex_problem):
        """分解并解决复杂问题"""
        # 1. 分解问题
        sub_problems = self.decompose(complex_problem)

        # 2. 解决每个子问题
        solutions = {}
        for sub_problem in sub_problems:
            solutions[sub_problem["id"]] = self.solve_subproblem(
                sub_problem
            )

        # 3. 综合结果
        final_answer = self.synthesize(
            complex_problem,
            sub_problems,
            solutions
        )

        return final_answer

    def decompose(self, problem):
        """分解问题为子问题"""
        prompt = f"""
        问题：{problem}

        请将这个问题分解为 3-5 个子问题。
        每个子问题应该：
        1. 相对独立
        2. 可以单独解决
        3. 有助于解决整体问题

        返回格式：
        1. [子问题 1]
        2. [子问题 2]
        ...
        """
        response = llm.generate(prompt)
        return self.parse_subproblems(response)
```

---

### 4.2 类比推理

**思想**：
通过类比相似问题来解决新问题。

```python
class AnalogicalReasoning:
    """类比推理"""

    def __init__(self):
        self.case_base = []  # 案例库

    def solve_by_analogy(self, new_problem):
        """通过类比解决问题"""
        # 1. 检索相似案例
        similar_cases = self.retrieve_similar_cases(new_problem)

        # 2. 分析案例的解决方案
        solutions = [case["solution"] for case in similar_cases]

        # 3. 类比推理：应用到新问题
        prompt = f"""
        新问题：{new_problem}

        相似案例及其解决方案：
        {self.format_cases(similar_cases)}

        通过类比这些案例，解决新问题。

        推理过程：
        """
        response = llm.generate(prompt)

        return response

    def retrieve_similar_cases(self, problem):
        """检索相似案例"""
        # 使用向量搜索找到相似案例
        problem_embedding = embed(problem)
        similarities = []

        for case in self.case_base:
            case_embedding = case["embedding"]
            similarity = cosine_similarity(problem_embedding, case_embedding)
            similarities.append((case, similarity))

        # 返回最相似的 k 个案例
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [case for case, _ in similarities[:3]]
```

---

### 4.3 多视角推理

**思想**：
从不同角度审视问题，综合得出结论。

```python
class MultiPerspectiveReasoning:
    """多视角推理"""

    def solve(self, problem):
        """从多个视角解决问题"""
        perspectives = [
            "技术视角",
            "商业视角",
            "用户视角",
            "风险视角"
        ]

        insights = {}
        for perspective in perspectives:
            insights[perspective] = self.analyze_from_perspective(
                problem,
                perspective
            )

        # 综合各视角的洞察
        final_solution = self.synthesize_insights(insights)

        return final_solution

    def analyze_from_perspective(self, problem, perspective):
        """从特定视角分析"""
        prompt = f"""
        问题：{problem}

        请从{perspective}分析这个问题。

        考虑：
        1. 这个视角关注什么？
        2. 有哪些关键因素？
        3. 得出什么结论？
        4. 有什么建议？

        分析：
        """
        return llm.generate(prompt)
```

---

## 五、规划与推理的优化

### 5.1 动态规划

**问题**：环境变化时如何调整计划？

```python
class DynamicPlanner:
    """动态规划器"""

    def __init__(self):
        self.current_plan = []
        self.completed_steps = []

    def execute_with_monitoring(self, initial_plan):
        """执行计划并监控"""
        self.current_plan = initial_plan

        while self.current_plan:
            # 执行下一步
            next_step = self.current_plan[0]
            result = self.execute_step(next_step)

            # 检查结果
            if result["success"]:
                # 成功，移动到下一步
                self.completed_steps.append(next_step)
                self.current_plan.pop(0)
            else:
                # 失败，重新规划
                self.current_plan = self.replan(
                    self.completed_steps,
                    self.current_plan,
                    result["error"]
                )

        return self.completed_steps

    def replan(self, completed, remaining, error):
        """基于失败重新规划"""
        prompt = f"""
        已完成：{completed}
        剩余计划：{remaining}
        遇到错误：{error}

        请重新规划剩余任务：
        1. 分析失败原因
        2. 调整策略
        3. 生成新计划

        新计划：
        """
        return llm.generate(prompt)
```

---

### 5.2 增量推理

**思想**：
逐步细化推理，而不是一次性完成。

```python
class IncrementalReasoning:
    """增量推理"""

    def reason_incrementally(self, problem):
        """逐步推理"""
        # 第 1 轮：粗略推理
        reasoning_1 = self.reason(problem, depth=1)

        # 第 2 轮：细化关键点
        key_points = self.identify_key_points(reasoning_1)
        reasoning_2 = self.refine_reasoning(
            problem,
            reasoning_1,
            key_points
        )

        # 第 3 轮：验证和修正
        reasoning_3 = self.verify_and_correct(
            problem,
            reasoning_2
        )

        return reasoning_3

    def identify_key_points(self, reasoning):
        """识别推理中的关键点"""
        prompt = f"""
        推理：{reasoning}

        识别其中的关键点（需要更详细论证的部分）：
        """
        return llm.generate(prompt)
```

---

### 5.3 推理验证

**思想**：
验证推理过程的正确性。

```python
class ReasoningVerifier:
    """推理验证器"""

    def verify_reasoning(self, problem, reasoning, answer):
        """验证推理是否正确"""
        # 1. 逻辑一致性检查
        logical_check = self.check_logical_consistency(reasoning)

        # 2. 事实验证
        fact_check = self.verify_facts(reasoning)

        # 3. 答案合理性检查
        sanity_check = self.check_answer_sanity(
            problem,
            reasoning,
            answer
        )

        # 综合评分
        verification = {
            "logical": logical_check,
            "factual": fact_check,
            "sanity": sanity_check,
            "overall": all([
                logical_check["passed"],
                fact_check["passed"],
                sanity_check["passed"]
            ])
        }

        return verification

    def check_logical_consistency(self, reasoning):
        """检查逻辑一致性"""
        prompt = f"""
        推理过程：{reasoning}

        检查：
        1. 推理步骤是否连贯？
        2. 有无逻辑矛盾？
        3. 结论是否从前提合理推出？

        检查结果：
        """
        return llm.generate(prompt)
```

---

## 六、实战案例

### 6.1 复杂问题解决 Agent

```python
class ComplexProblemSolver:
    """复杂问题解决 Agent"""

    def __init__(self):
        self.planner = ReActAgent()
        self.reflector = ReflectiveAgent()
        self.verifier = ReasoningVerifier()

    def solve(self, problem):
        """解决复杂问题"""
        max_attempts = 3

        for attempt in range(max_attempts):
            print(f"尝试 {attempt + 1}/{max_attempts}")

            # 1. 规划和推理
            solution = self.planner.run(problem)

            # 2. 验证解决
            verification = self.verifier.verify_reasoning(
                problem,
                solution["thoughts"],
                solution.get("final_answer")
            )

            # 3. 如果验证通过，返回
            if verification["overall"]:
                print("✓ 解决方案验证通过")
                return solution

            # 4. 反思和改进
            print("✗ 验证失败，进行反思...")
            reflection = self.reflector.reflect(
                problem,
                solution,
                verification
            )

            # 使用反思来改进下一次尝试
            problem = self.refine_problem_with_reflection(
                problem,
                reflection
            )

        return None  # 所有尝试都失败

    def refine_problem_with_reflection(self, problem, reflection):
        """基于反思细化问题"""
        return f"""
        原始问题：{problem}

        之前的反思：{reflection}

        基于这些反思，重新解决这个问题。
        """
```

### 6.2 研究 Agent

```python
class ResearchAgent:
    """研究 Agent"""

    def research(self, topic):
        """研究一个主题"""
        # 阶段 1：规划研究
        research_plan = self.plan_research(topic)

        # 阶段 2：执行研究
        findings = []
        for step in research_plan:
            result = self.execute_research_step(step)
            findings.append(result)

            # 动态调整计划
            if result["needs_more_research"]:
                research_plan = self.adjust_plan(
                    research_plan,
                    result
                )

        # 阶段 3：综合分析
        analysis = self.analyze_findings(findings)

        # 阶段 4：生成报告
        report = self.generate_report(topic, findings, analysis)

        return report

    def plan_research(self, topic):
        """规划研究步骤"""
        prompt = f"""
        研究主题：{topic}

        制定详细的研究计划：
        1. 需要搜索什么？
        2. 需要阅读哪些类型的资料？
        3. 需要分析哪些方面？
        4. 如何验证发现？

        研究计划：
        """
        response = llm.generate(prompt)
        return self.parse_research_plan(response)
```

---

## 本章小结

### 核心要点

1. **规划机制**：
   - 任务分解：层级、依赖、递归
   - 计划表示：列表、结构、图
   - 规划算法：前向、反向、启发式

2. **推理机制**：
   - 思维链 (CoT)：展示推理过程
   - ReAct：推理 + 行动循环
   - 自我反思：检查和改进
   - 树搜索：探索多条路径

3. **高级技术**：
   - 分解推理：分而治之
   - 类比推理：借鉴经验
   - 多视角：综合角度

4. **优化策略**：
   - 动态规划：适应变化
   - 增量推理：逐步细化
   - 推理验证：确保正确

### 规划与推理框架对比

| 框架 | 核心思想 | 优势 | 劣势 | 适用场景 |
|-----|---------|------|------|---------|
| **CoT** | 展示推理步骤 | 可解释、准确 | 成本高 | 复杂推理 |
| **ReAct** | 推理-行动循环 | 灵活、适应性强 | 可能不稳定 | 通用任务 |
| **Reflexion** | 自我反思改进 | 持续学习 | 多轮迭代 | 需要高质量 |
| **ToT** | 树搜索探索 | 全局最优 | 计算昂贵 | 关键决策 |

### 记忆口诀

```
规划分解任务，
推理指导行动，
反思修正错误，
迭代直到成功。
```

---

## 思考题

1. **基础题**：解释思维链 (CoT) 和 ReAct 的区别，它们分别适用于什么场景？

2. **进阶题**：设计一个"旅行规划 Agent"，描述它如何使用规划和推理来帮助用户规划旅行。

3. **挑战题**：在某些情况下，Agent 可能会陷入"推理死循环"（反复思考同一问题，无法做出决策）。如何从架构层面避免这个问题？

---

## 实践探索

**实现 ReAct Agent**：
```python
# 简化的 ReAct 实现
class SimpleReAct:
    def run(self, task):
        thought = self.think(task)
        while "Action:" in thought:
            action = self.parse_action(thought)
            observation = self.execute(action)

            thought = self.think(
                task,
                thought,
                observation
            )
        return thought

    def think(self, task, previous_thought="", observation=""):
        prompt = f"""
        任务：{task}
        之前：{previous_thought}
        观察：{observation}

        思考下一步...
        """
        return llm.generate(prompt)
```

**设计练习**：
为以下场景设计推理流程：
1. 数学问题求解
2. 代码调试
3. 创意写作

---

## 扩展阅读

**经典论文**：
- "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" - CoT 原始论文
- "ReAct: Synergizing Reasoning and Acting in Language Models" - ReAct 框架
- "Reflexion: Language Agents with Verbal Reinforcement Learning" - 自我反思
- "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" - 树搜索

**实践框架**：
- [LangChain Agents](https://python.langchain.com/docs/modules/agents/) - Agent 实现
- [LangGraph](https://www.langchain.com/langgraph) - 可控的推理流程

**推理优化**：
- "Self-Consistency: Boosting Performance of Language Models" - 自洽性方法
- "Least-to-Most Prompting" - 分步提示技术

---

**恭喜你完成了模块四的学习！**

你现在已经深入理解了 AI Agent 的核心架构、类型、记忆、工具使用以及规划推理能力。这些知识将帮助你构建更强大的 Agent 应用。

[← 返回模块首页](/basics/04-agent-fundamentals) | [继续学习下一模块 →](/basics/05-practical-guide)
