# Skills 的四元组形式化分析

> 将 Skills 的形式化定义 S=(C,π,T,R) 从一句话公式展开为可实施的工程数学模型 | 预计阅读时间：35 分钟

---

## 一、引言

基础模块中我们介绍了 Skills 的四元组定义：

$$S = (C, \pi, T, R)$$

其中：
- $C$ (Context) 是上下文约束
- $\pi$ (Policy) 是执行策略
- $T$ (Tools) 是工具依赖
- $R$ (Result) 是输出规范

这个形式化定义简洁优雅，但作为工程实践者，我们需要将其展开为可实施、可验证、可分析的数学模型。仅仅知道"Skill 有四要素"不足以指导实际的 Skill 治理和组合工作。我们需要回答更深入的问题：

- $C$ 约束之间如何相互作用？当多个 Skill 组合时，约束是否会产生冲突？
- $\pi$ 的优先级如何定义？多个策略之间的偏序关系如何确定？
- $T$ 的依赖图如何分析？工具之间的依赖关系是否可以形式化建模？
- $R$ 的规范能否自动验证？输出 Schema 的兼容性如何判断？

本章将这四个问题逐一展开，用数学语言和工程实践相结合的方式，给出每个元素的深入分析。

---

## 二、Context 的形式化分析

### 2.1 上下文约束的集合论模型

上下文约束 $C$ 可以建模为一组逻辑谓词和约束条件的集合。每个约束是一个可评估的布尔表达式，表示 Agent 在特定条件下是否可以应用该 Skill。

形式化定义：

$$C = \{c_1, c_2, \ldots, c_n\}$$

其中每个 $c_i$ 是一个约束三元组：

$$c_i = (s_i, p_i, v_i)$$

- $s_i$ 是约束作用域（scope），如 `language`, `file_size`, `environment`
- $p_i$ 是约束谓词（predicate），如 `in`, `lt`, `eq`, `matches`
- $v_i$ 是约束值（value），如 `["python", "typescript"]`, `1000`, `"production"`

一个 Skill 是否适用于当前状态 $\Sigma$，由所有约束的合取决定：

$$\text{applicable}(S, \Sigma) = \bigwedge_{i=1}^{n} c_i(\Sigma)$$

只有所有约束都满足时，Skill 才是可应用的。

### 2.2 约束衰减模型

在多个 Skill 组合或长时间运行的 Agent 会话中，约束会经历"衰减"——随着上下文变化，原本满足的约束可能变弱或失效。约束衰减模型描述了这一过程。

定义约束强度函数 $\delta: C \times \mathbb{N} \to [0, 1]$，其中 $\mathbb{N}$ 表示自约束上次验证后的步数：

$$\delta(c_i, t) = \begin{cases}
1 & \text{if } t = 0 \\
\delta(c_i, t-1) \cdot \alpha(c_i) & \text{if } t > 0
\end{cases}$$

其中 $\alpha(c_i) \in (0, 1)$ 是约束 $c_i$ 的衰减因子。不同类型的约束有不同的衰减速度：

| 约束类型 | 衰减因子 | 衰减速度 | 举例 |
|---------|---------|---------|------|
| 静态约束 | $\alpha = 1.0$ | 永不衰减 | `language: python` |
| 稳定约束 | $\alpha = 0.95$ | 缓慢衰减 | `max_file_lines: 1000` |
| 动态约束 | $\alpha = 0.70$ | 快速衰减 | `branch: feature/*` |
| 瞬时约束 | $\alpha = 0.50$ | 急速衰减 | `last_commit: < 1h` |

**Scope 交叠分析**。当两个 Skill 的 Context 约束交叠时，需要分析交叠区域是否会产生冲突：

```yaml
# Skill A: python_code_review
context:
  language: python
  max_file_lines: 1000
  environment: development

# Skill B: security_audit
context:
  language: [python, javascript]
  min_file_lines: 100
  environment: any
```

这两个 Skill 的 Scope 交叠区域为：`language=python, file_lines=[100, 1000], environment=development`。在这个交叠区域中，两个 Skill 都是可应用的。如果某个 Agent 同时加载了这两个 Skill，需要明确优先级规则或冲突解决策略。

**冲突检测算法**。约束冲突发生在两个约束谓词断言了矛盾的条件下。形式化地，$c_i$ 与 $c_j$ 冲突当且仅当：

$$\exists \Sigma: c_i(\Sigma) \land c_j(\Sigma) = \text{false}$$

对于常见约束类型，冲突检测可以通过模式匹配实现：

```python
def detect_conflict(c1, c2):
    """检测两个约束是否冲突"""
    if c1.scope != c2.scope:
        return False  # 不同作用域不冲突
    
    # 单一值 vs 集合值
    if isinstance(c1.value, list) and isinstance(c2.value, str):
        return c2.value not in c1.value
    if isinstance(c1.value, str) and isinstance(c2.value, list):
        return c1.value not in c2.value
    
    # 范围冲突
    if c1.predicate == "lt" and c2.predicate == "gt":
        return c1.value <= c2.value  # x < N and x > M, 且 N <= M
    
    # 枚举冲突
    if c1.predicate == "in" and c2.predicate == "in":
        return len(set(c1.value) & set(c2.value)) == 0
    
    return False  # 其他情况默认不冲突
```

### 2.3 约束的偏序关系

约束之间可以定义偏序关系（partial order），用于确定多个满足条件的 Skill 中哪个更"匹配"。偏序关系 $\preceq$ 定义如下：

$$c_i \preceq c_j \iff \text{scope}(c_j) \subseteq \text{scope}(c_i) \land \text{precision}(c_i) \leq \text{precision}(c_j)$$

即：如果约束 $c_j$ 的作用域包含于 $c_i$，且 $c_j$ 的精度不低于 $c_i$，则 $c_j$ 是 $c_i$ 的精化（refinement）。

更直观的理解方式：

| 约束对 | 关系 | 解释 |
|-------|------|------|
| `language: python` vs `language: [python, js]` | 前者 <img src="https://render.githubusercontent.com/render/math?math=%5Cpreceq" alt="preceq"> 后者 | python 是 [python, js] 的子集，更精确 |
| `max_lines: 500` vs `max_lines: 1000` | 前者 <img src="https://render.githubusercontent.com/render/math?math=%5Cpreceq" alt="preceq"> 后者 | 500行的约束比1000行更严格 |
| `env: production` vs `env: any` | 前者 <img src="https://render.githubusercontent.com/render/math?math=%5Cpreceq" alt="preceq"> 后者 | production 是 any 的子集 |

偏序关系在 Skill 选择中的作用：当多个 Skill 都满足条件时，选择偏序关系中最"精确"的那个（即偏序链中的最大元素）。

---

## 三、Policy 的严格偏序

### 3.1 策略优先级的有向图表示

策略 $\pi$ 定义了 Skill 的执行步骤及其优先级关系。多个步骤之间的优先级可以建模为**有向图** $G_\pi = (V, E)$，其中：

- $V = \{v_1, v_2, \ldots, v_n\}$ 是策略步骤的集合
- $E \subseteq V \times V$ 是步骤间的依赖关系

边 $v_i \to v_j$ 表示 $v_i$ 必须在 $v_j$ 之前执行。

不同风格的策略对应不同类型的图结构：

```
串行策略（严格线性的优先级）：
  v1 → v2 → v3 → v4 → v5
  每个步骤只有一个直接后继

条件分支策略（选择性的优先级）：
       ┌→ v2 → v3 ─┐
  v1 ──┤            ├→ v5
       └→ v4 ──────┘
  在 v1 之后，根据条件选择 v2→v3 分支或 v4 分支

并行策略（无依赖的步骤可同时执行）：
  v1 ──┬→ v2 ──┬→ v4
       └→ v3 ──┘
  v2 和 v3 无依赖关系，可并行执行
```

### 3.2 偏序关系的拓扑排序

策略 $\pi$ 的严格偏序关系可以定义为二元关系 $\prec$，满足：

1. **非自反性**：$\neg(v \prec v)$，没有任何步骤优先于自身
2. **传递性**：若 $v_i \prec v_j$ 且 $v_j \prec v_k$，则 $v_i \prec v_k$
3. **反对称性**：若 $v_i \prec v_j$，则 $\neg(v_j \prec v_i)$

当所有步骤之间的优先级满足偏序关系时，策略图 $G_\pi$ 是一个**有向无环图（DAG）**。

**拓扑排序**是执行策略的关键算法。它将偏序集中的元素线性化，使得如果 $v_i \prec v_j$，则 $v_i$ 在线性顺序中出现在 $v_j$ 之前：

```python
from collections import deque

def topological_sort(steps, dependencies):
    """
    对策略步骤进行拓扑排序。
    
    Args:
        steps: 所有步骤标识符的列表 [v1, v2, ..., vn]
        dependencies: 依赖关系列表 [(before, after), ...]
    
    Returns:
        排序后的步骤列表，如果存在环则返回 None
    """
    # 构建入度表和邻接表
    in_degree = {v: 0 for v in steps}
    adjacency = {v: [] for v in steps}
    
    for before, after in dependencies:
        adjacency[before].append(after)
        in_degree[after] += 1
    
    # 使用 Kahn 算法进行拓扑排序
    queue = deque([v for v in steps if in_degree[v] == 0])
    sorted_steps = []
    
    while queue:
        v = queue.popleft()
        sorted_steps.append(v)
        
        for successor in adjacency[v]:
            in_degree[successor] -= 1
            if in_degree[successor] == 0:
                queue.append(successor)
    
    # 检查是否存在环
    if len(sorted_steps) != len(steps):
        return None  # 存在循环依赖
    
    return sorted_steps
```

### 3.3 死锁与循环策略的检测

策略图中的环（cycle）意味着存在循环依赖——这在策略编排中是致命的错误。循环依赖 $v_1 \prec v_2 \prec \ldots \prec v_k \prec v_1$ 意味着 Agent 永远无法找到一个合法的执行顺序。

::: warning 循环策略的危害
循环策略不仅仅是"不推荐"的——它会导致 Agent 在执行策略时无限循环或陷入决策死锁。在极端情况下，一个未被检测到的循环策略可能导致 Agent 在同一个步骤循环中消耗完整个上下文窗口。
:::

**环检测算法**：

```python
def detect_cycle(steps, dependencies):
    """
    检测策略中是否存在循环依赖。
    
    使用 DFS 三色标记法（White-Gray-Black）：
      WHITE: 未访问
      GRAY:  正在访问（在递归栈中）
      BLACK: 已访问完成
    
    Returns:
        (has_cycle, cycle_path) 元组
    """
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {v: WHITE for v in steps}
    adjacency = {v: [] for v in steps}
    
    for before, after in dependencies:
        adjacency[before].append(after)
    
    cycle_path = []
    
    def dfs(v):
        color[v] = GRAY
        cycle_path.append(v)
        
        for successor in adjacency[v]:
            if color[successor] == GRAY:
                # 找到环：从 successor 到 v 的路径
                cycle_start = cycle_path.index(successor)
                return True, cycle_path[cycle_start:]
            elif color[successor] == WHITE:
                has_cycle, path = dfs(successor)
                if has_cycle:
                    return True, path
        
        color[v] = BLACK
        cycle_path.pop()
        return False, []
    
    for v in steps:
        if color[v] == WHITE:
            has_cycle, path = dfs(v)
            if has_cycle:
                return True, path
    
    return False, []
```

### 3.4 死锁解决的策略

当检测到循环策略时，有以下几种解决方式：

1. **依赖修剪**：识别并移除循环中不必要的依赖边
2. **优先级显式化**：为循环中的步骤添加显式的优先级数值，打破对称性
3. **分层抽象**：将循环涉及的步骤抽象为一个更高层的原子步骤
4. **状态屏障**：在循环中引入状态检查，确保步骤不会无限重复

```yaml
# 依赖修剪示例：将循环依赖改为单向
# 有问题的方式：
# step_A → step_B → step_C → step_A（循环！）
policy:
  steps:
    - name: step_A
      depends_on: []
    - name: step_B
      depends_on: [step_A]
    - name: step_C
      depends_on: [step_B]

# 如果 step_C 对 step_A 的依赖是"可选优化"而非"必需"，
# 可以通过移除该依赖来打破循环。
```

---

## 四、Tools 依赖图

### 4.1 工具依赖的 DAG 建模

工具依赖 $T$ 定义了 Skill 执行所需的工具集合及其依赖关系。与策略 $\pi$ 类似，工具依赖也可以建模为有向图 $G_T = (V_T, E_T)$，但语义不同：边 $t_i \to t_j$ 表示工具 $t_i$ 的输出或功能被工具 $t_j$ 依赖。

工具依赖图同样是**有向无环图**——工具之间不能循环依赖。

```yaml
# 代码审查 Skill 的工具依赖
tools:
  - name: git_diff
    depends_on: []           # 根工具，无依赖
    
  - name: list_changed_files
    depends_on: [git_diff]   # 依赖 git_diff 的输出
    
  - name: read_file
    depends_on: [list_changed_files]  # 需要知道哪些文件变更了
    
  - name: ast_parser
    depends_on: [read_file]  # 需要文件内容
    
  - name: run_linter
    depends_on: [read_file]  # 也需要文件内容
    
  - name: report_generator
    depends_on: [ast_parser, run_linter]  # 合并多个工具的输出
```

对应的 DAG 结构：

```
git_diff → list_changed_files → read_file ─┬→ ast_parser ─┬→ report_generator
                                            └→ run_linter ──┘
```

### 4.2 拓扑排序与可达性分析

与策略类似，工具依赖的拓扑排序给出了工具的推荐使用顺序。除此之外，工具依赖图还需要**可达性分析**来确定哪些工具在特定场景下是必须的。

**可达性定义**：工具 $t_j$ 从工具 $t_i$ 可达（记为 $t_i \leadsto t_j$），当且仅当 $G_T$ 中存在一条从 $t_i$ 到 $t_j$ 的有向路径。

```python
def reachability_analysis(tools, dependencies):
    """
    计算工具依赖图的可达性矩阵。
    
    使用 Floyd-Warshall 算法的思想，
    确定每个工具可以到达哪些其他工具。
    
    Returns:
        可达性矩阵 R，其中 R[i][j] = True 表示 ti 可到达 tj
    """
    n = len(tools)
    index = {tool: i for i, tool in enumerate(tools)}
    
    # 初始可达性矩阵
    R = [[False] * n for _ in range(n)]
    for i in range(n):
        R[i][i] = True  # 自身可达
    
    for before, after in dependencies:
        R[index[before]][index[after]] = True
    
    # 传递闭包
    for k in range(n):
        for i in range(n):
            for j in range(n):
                R[i][j] = R[i][j] or (R[i][k] and R[k][j])
    
    return R
```

**可达性的工程应用**：

- **影响域分析**：修改工具 $t_i$ 会影响所有 $t_i \leadsto t_j$ 的可达工具
- **最小工具集**：给定目标输出类型 $O$，找到能够产生 $O$ 的最小工具子集
- **冗余检测**：如果移除工具 $t_i$ 后，所有输出类型仍然可达，则 $t_i$ 可能是冗余的

### 4.3 必需工具 vs 可选工具的图论解释

从图论角度理解"必需"与"可选"：

- **必需工具**（required）：该工具出现在所有可达目标输出的路径上。在依赖图中，如果移除一个必需工具，某些输出类型将变得不可达。

- **可选工具**（optional）：存在至少一条不经过该工具也能到达目标输出的路径。可选工具提供额外的能力或替代路径，但不影响核心功能。

```python
def classify_tools(tools, dependencies, output_tools):
    """
    将工具分类为必需和可选。
    
    Args:
        tools: 所有工具列表
        dependencies: 依赖关系 [(before, after), ...]
        output_tools: 输出类型的工具列表（终点）
    
    Returns:
        (required, optional) 元组
    """
    R = reachability_analysis(tools, dependencies)
    n = len(tools)
    
    required = []
    optional = []
    
    for i, tool in enumerate(tools):
        # 检查从该工具是否可以到达至少一个输出工具
        reaches_output = any(R[i][index[t]] for t in output_tools)
        
        if not reaches_output:
            optional.append(tool)
            continue
        
        # 检查是否存在不经过该工具的替代路径
        direct_deps = [t for t in tools 
                       if dependencies.count((tool, t)) > 0 
                       or dependencies.count((t, tool)) > 0]
        
        # 如果该工具是无入度的根工具，且是到达输出的唯一路径
        if reaches_output and not has_alternative_path(tool, tools, dependencies, output_tools):
            required.append(tool)
        else:
            optional.append(tool)
    
    return required, optional
```

**工程应用的指导意义**：

```
必需工具 vs 可选工具的部署策略：

必需工具（必须在运行时可用）：
  ████████████████████████████████
  - 影响核心功能不可用
  - 必须进行高可用部署
  - 必须有备份/降级方案

可选工具（缺失时不影响核心流程）：
  ████████░░░░░░░░░░░░░░░░░░░░░░
  - 缺失时功能降级但不中断
  - 可以按需加载
  - 允许延迟初始化
```

### 4.4 依赖分析算法的完整实现

下面是一个完整的工具依赖分析器的 Python 伪代码实现：

```python
from collections import deque
from typing import List, Tuple, Set, Dict, Optional

class ToolDependencyAnalyzer:
    """工具依赖分析器"""
    
    def __init__(self, tools: List[str], 
                 dependencies: List[Tuple[str, str]]):
        self.tools = tools
        self.deps = dependencies
        self._build_graph()
    
    def _build_graph(self):
        """构建依赖图"""
        self.adjacency = {t: [] for t in self.tools}
        self.in_degree = {t: 0 for t in self.tools}
        
        for before, after in self.deps:
            self.adjacency[before].append(after)
            self.in_degree[after] += 1
    
    def topological_sort(self) -> Optional[List[str]]:
        """拓扑排序，检测环"""
        queue = deque([t for t in self.tools 
                      if self.in_degree[t] == 0])
        result = []
        
        while queue:
            tool = queue.popleft()
            result.append(tool)
            
            for successor in self.adjacency[tool]:
                self.in_degree[successor] -= 1
                if self.in_degree[successor] == 0:
                    queue.append(successor)
        
        return result if len(result) == len(self.tools) else None
    
    def dependency_chain(self, tool: str) -> List[str]:
        """获取指定工具的完整依赖链"""
        visited = set()
        chain = []
        
        def dfs(t):
            if t in visited:
                return
            visited.add(t)
            # 查找以 t 为 after 的依赖（即 t 的前驱）
            for before, after in self.deps:
                if after == t and before not in visited:
                    dfs(before)
            chain.append(t)
        
        dfs(tool)
        return chain
    
    def parallelization_opportunities(self) -> List[Tuple[str, str]]:
        """识别可并行执行的工具对"""
        result = []
        for i, t1 in enumerate(self.tools):
            for t2 in self.tools[i+1:]:
                # 如果两个工具之间没有路径可达
                if not self._is_reachable(t1, t2) and \
                   not self._is_reachable(t2, t1):
                    result.append((t1, t2))
        return result
    
    def _is_reachable(self, start: str, end: str) -> bool:
        """BFS 可达性检测"""
        visited = {start}
        queue = deque([start])
        
        while queue:
            tool = queue.popleft()
            for successor in self.adjacency[tool]:
                if successor == end:
                    return True
                if successor not in visited:
                    visited.add(successor)
                    queue.append(successor)
        
        return False
```

---

## 五、Result 规范的可验证性

### 5.1 输出契约的形式化

Result 规范 $R$ 定义了 Skill 的**输出契约**（output contract），是对执行结果的形式化约束。输出契约可以建模为：

$$R = (S_{\text{out}}, \Phi, \Psi)$$

其中：
- $S_{\text{out}}$ 是输出结构（schema）定义
- $\Phi$ 是格式约束集合（如 `format: markdown`, `max_length: 5000`）
- $\Psi$ 是语义约束集合（如 `section: summary` 必须存在，`findings` 至少要有 1 条）

一个特定的输出实例 $o$ 满足输出契约 $R$，记作 $o \models R$，当且仅当：

$$o \models R \iff \text{validate}(o, S_{\text{out}}) \land \bigwedge_{\phi \in \Phi} \phi(o) \land \bigwedge_{\psi \in \Psi} \psi(o)$$

### 5.2 Schema 校验的自动化断言

Schema 校验是 Result 规范可验证性的基础。在 SKILL.md 中，output 部分定义了输出的结构规范：

```yaml
output:
  format: markdown
  sections:
    - name: summary
      description: "审查概要"
      required: true
      constraints:
        max_length: 500
    - name: findings
      description: "发现的问题列表"
      required: true
      constraints:
        min_items: 1
        max_items: 50
    - name: suggestions
      description: "改进建议"
      required: false
```

对应的自动化断言可以写成：

```python
import re
from typing import Any, Dict, List, Optional

class OutputValidator:
    """输出结果验证器"""
    
    def __init__(self, schema: Dict[str, Any]):
        self.schema = schema
    
    def validate(self, output: str) -> Dict[str, Any]:
        """
        验证输出是否符合 schema 规范。
        
        Returns:
            { "valid": bool, "errors": List[str], "warnings": List[str] }
        """
        result = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        # 1. 格式检查
        if self.schema.get("format") == "markdown":
            format_ok = self._check_markdown_format(output)
            if not format_ok:
                result["valid"] = False
                result["errors"].append("输出不是有效的 Markdown 格式")
        
        # 2. 必需段落检查
        for section in self.schema.get("sections", []):
            if section.get("required", False):
                if not self._section_exists(output, section["name"]):
                    result["valid"] = False
                    result["errors"].append(
                        f"缺少必需段落: {section['name']}"
                    )
            
            # 3. 约束检查
            constraints = section.get("constraints", {})
            if "max_length" in constraints:
                length = self._section_length(output, section["name"])
                if length > constraints["max_length"]:
                    result["warnings"].append(
                        f"段落 {section['name']} 长度 {length} "
                        f"超过限制 {constraints['max_length']}"
                    )
        
        return result
    
    def _check_markdown_format(self, text: str) -> bool:
        """检查是否为有效的 Markdown 格式"""
        # 检查基本的 Markdown 结构
        has_heading = bool(re.search(r'^#{1,6}\s', text, re.MULTILINE))
        return has_heading
    
    def _section_exists(self, text: str, section_name: str) -> bool:
        """检查指定段落是否存在"""
        pattern = rf'^##?\s+{section_name}\s*$'
        return bool(re.search(pattern, text, re.MULTILINE))
    
    def _section_length(self, text: str, section_name: str) -> int:
        """计算指定段落的字符数"""
        sections = re.split(r'^##?\s+', text, flags=re.MULTILINE)
        for section in sections:
            if section.strip().startswith(section_name):
                return len(section)
        return 0
```

### 5.3 兼容性验证的数学基础

当一个 Skill 升级版本时，Result 规范的兼容性验证变得至关重要。我们需要判断新版本的输出契约 $R'$ 是否向后兼容旧版本 $R$。

**兼容性定义**：$R'$ 向后兼容 $R$（记作 $R \sqsubseteq R'$）当且仅当：

$$\forall o: (o \models R) \implies (o \models R')$$

即：所有满足旧契约的输出都满足新契约。换句话说，新契约不能比旧契约更严格。

**兼容性条件的实际检查**：

| 变化类型 | 是否兼容 | 说明 |
|---------|---------|------|
| 新增可选段落 | 兼容 | 旧输出仍满足新规范 |
| 放宽长度限制 | 兼容 | 旧输出在更宽松的限制下仍然有效 |
| 移除必需字段 | 兼容 | 旧输出不再需要该字段 |
| 新增必需段落 | **不兼容** | 旧输出缺少新必需的段落 |
| 收紧长度限制 | **不兼容** | 旧输出可能超过新限制 |
| 修改字段类型 | **不兼容** | 旧输出格式与新要求不匹配 |

**兼容性验证的数学形式**：

```python
def check_backward_compatibility(old_schema, new_schema):
    """
    检查新 schema 是否向后兼容旧 schema。
    
    返回兼容性报告。
    """
    report = {
        "compatible": True,
        "breaking_changes": []
    }
    
    old_sections = {s["name"]: s for s in old_schema.get("sections", [])}
    new_sections = {s["name"]: s for s in new_schema.get("sections", [])}
    
    # 检查被移除或降级的段落
    for name, old in old_sections.items():
        if name not in new_sections:
            # 旧的可选段落被移除 —— 兼容
            if old.get("required", False):
                # 旧的必需段落被移除 —— 不兼容
                report["compatible"] = False
                report["breaking_changes"].append(
                    f"必需段落 '{name}' 在新版本中被移除"
                )
        else:
            new = new_sections[name]
            # 检查约束收紧
            old_max = old.get("constraints", {}).get("max_length")
            new_max = new.get("constraints", {}).get("max_length")
            
            if old_max and new_max and new_max < old_max:
                report["compatible"] = False
                report["breaking_changes"].append(
                    f"段落 '{name}' 长度限制从 {old_max} "
                    f"收紧至 {new_max}"
                )
            
            old_min = old.get("constraints", {}).get("min_items")
            new_min = new.get("constraints", {}).get("min_items")
            
            if old_min and new_min and new_min > old_min:
                report["compatible"] = False
                report["breaking_changes"].append(
                    f"段落 '{name}' 最小条目从 {old_min} "
                    f"提升至 {new_min}"
                )
    
    return report
```

### 5.4 可验证性的工程意义

Result 规范的可验证性不仅仅是理论上的优雅——它直接决定了 Skills 系统的工程质量：

1. **自动化测试**。可验证的输出契约使得 Skill 的单元测试成为可能。每个 Skill 可以用标准化的测试用例验证其输出是否符合契约。

2. **契约驱动的开发**。在编写 Skill 之前先定义输出契约，然后开发 Skill 使其满足契约——这种"契约优先"的方法提高了开发效率。

3. **运行时保障**。在 Agent 执行过程中实时验证输出，可以在问题输出到达用户之前捕获错误，实现"fail fast"。

::: tip 输出契约 vs 传统测试
传统的测试关注"代码是否正确"，而输出契约关注"行为是否符合预期"。在 Agent 系统中，后者的重要性往往超过前者——因为 Agent 的行为路径是高度动态的，正确性只能通过输出约束来间接验证。
:::

---

## 思考题

::: info 检验你的理解

1. 有两个 Skill：`Skill_A` 的 Context 约束为 `language: python, max_lines: 500`，`Skill_B` 的 Context 约束为 `language: [python, typescript], environment: production`。分析这两个 Skill 的 Scope 交叠区域，并判断是否存在约束冲突。如果两个 Skill 同时被加载，如何决定优先级？

2. 给定一个策略图：`A → B, B → C, C → A, B → D, D → E`。请用拓扑排序算法判断该图是否存在环。如果存在，指出环的位置并提出至少两种打破环的方案。

3. 在一个工具依赖图中，有三个工具：`T1（获取用户输入）、T2（查询数据库）、T3（格式化输出）`。其中 `T2` 依赖 `T1`，`T3` 依赖 `T2`。如果 `T2` 被标记为可选工具，请分析在 `T2` 不可用的情况下，`T3` 是否还能正常工作？如果可以，需要什么样的替代路径或降级策略？

4. 一个 Skill 的输出契约在 v1.0 中定义为：必需段落 `summary`（max_length=200）和 `findings`（min_items=3）。v2.0 中修改为：`summary` 长度限制放宽至 max_length=500，`findings` 最小条目提升至 min_items=5，并新增可选段落 `appendix`。请分析 v2.0 是否向后兼容 v1.0。

:::

---

## 本章小结

- ✅ Context 约束可以形式化为逻辑谓词集合，通过合取运算决定 Skill 的可应用性
- ✅ 约束衰减模型描述了不同类型约束随时间退化的速率，影响 Skill 的重新验证策略
- ✅ Policy 优先级通过有向图的偏序关系建模，拓扑排序给出推荐的执行顺序
- ✅ 循环策略检测使用 DFS 三色标记法，发现死锁后可以通过依赖修剪或优先级显式化解决
- ✅ Tools 依赖图是 DAG，必需工具定义为"移除后导致某些输出不可达"的工具
- ✅ 依赖分析器的完整实现包括拓扑排序、可达性分析、并行化机会检测等能力
- ✅ Result 规范通过输出契约实现可验证性，包括结构验证、格式约束和语义约束三层
- ✅ 兼容性验证的数学基础是 $R \sqsubseteq R'$，即新契约不能比旧契约更严格

---

## 参考资料

- [Cormen, T. H. et al. (2009). Introduction to Algorithms (3rd ed.). MIT Press.](https://mitpress.mit.edu/books/introduction-algorithms-third-edition) — 图论与拓扑排序的经典算法参考
- [Meyer, B. (1992). Applying "Design by Contract". Computer, 25(10), 40-51.](https://doi.org/10.1109/2.161279) — 契约式设计的理论基础
- [Jackson, D. (2002). Alloy: A Language and Tool for Relational Models.](https://alloytools.org/) — 形式化建模与约束分析
- [Anthropic. (2025). SKILL.md Specification v1.0.](https://agentskills.io) — Skills 标准规范
- [Gamma, E. et al. (1994). Design Patterns: Elements of Reusable Object-Oriented Software.](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/) — 模式与可复用设计的经典参考
