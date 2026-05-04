# 四大框架 Skills 实现深度剖析

> 从 Claude Code 的声明式 Markdown 到 Coze 的可视化工作流，深入理解四大 AI Agent 框架对 Skills 的不同实现哲学 | 预计阅读时间：40 分钟

---

## 一、引言

基础模块中我们对比了 Claude Code、CrewAI、LangChain 三大框架的 Skills 实现方式。那个对比侧重的是"入门的差异化认知"——帮助学习者快速理解不同框架的基本思路。但实际上，这个比较框架在今天已经不够用了。

2026 年 1 月，字节跳动旗下的扣子（Coze）2.0 正式发布，带来了企业级可视化工作流引擎，以及对 Skill 标准的初步兼容。这使得市场格局从"三足鼎立"变成了"四方争鸣"。更重要的是，每个框架都在过去半年中发生了重要的版本迭代：

- **Claude Code** 主导了 SKILL.md 标准的开放与生态化，ClawHub 市场已积累超过 3,000 个社区 Skills
- **CrewAI** 在 2026 年初正式引入了 SKILL.md 导入器，实现了从 Claude 生态到 CrewAI 的 Skill 迁移
- **LangChain** 借助 LangGraph 的状态图能力，将 Skill 转化为可组合的条件化子图
- **扣子 2.0** 以可视化工作流为核心，将 Skills 概念带入低代码和企业级场景

这四套实现代表了对同一个核心问题——"如何让 AI Agent 复用策略"——的四种截然不同的解答。本章将从设计哲学、核心优势、加载机制、局限性的维度，逐一深入分析每个框架的 Skills 实现，最后以对比矩阵和决策树的方式帮助你根据自身场景做出选择。

---

## 二、Claude Code：声明式 Markdown 范式

### 2.1 设计哲学：文件即配置

Claude Code 对 Skills 的设计哲学可以概括为一句话：**一个 Skill 就是一文件，一文件就是一个 Skill**。

这个理念源于 Unix 的"做一件事并做好"哲学，以及现代开发实践中"约定优于配置"的思想。在 Claude Code 中，SKILL.md 文件本身就是 Skill 的全部——不需要编译、不需要注册、不需要额外的配置文件。你只需在项目根目录的 `.claude/skills/` 下放置一个 Markdown 文件，Claude Code 就会自动识别并使用它。

```yaml
# .claude/skills/code_review/SKILL.md
---
name: code_review
version: 1.0.0
description: "审查 Pull Request 中的代码变更，识别安全漏洞和逻辑错误"
scope:
  languages: [python, typescript, go]
  directories: [src/, tests/]
tools:
  required: [git_diff, read_file, search_code]
output:
  sections:
    - name: summary
      description: 变更概述
      required: true
    - name: security_findings
      description: 安全漏洞
      required: true
    - name: code_quality
      description: 代码质量问题
      required: false
---
## 执行策略

1. 首先使用 `git_diff` 获取变更文件列表，了解变更范围
2. 对每个变更文件：
   a. 使用 `read_file` 读取完整文件内容
   b. 检查安全漏洞（SQL 注入、XSS、权限绕过）
   c. 检查逻辑错误（边界条件、竞态条件）
3. 生成结构化审查报告
```

这种"文件即配置"的哲学带来了极低的使用门槛——任何能写 Markdown 的开发者都可以在五分钟内创建第一个 Skill。

### 2.2 核心优势

**SKILL.md 标准发起者**

Claude Code 不仅是 SKILL.md 格式的第一个实现者，还是该开放标准的主要推动者。2025 年 9 月发布 Draft 后，Anthropic 在短短三个月内就将其推进到 v1.0 Release，并于 2026 年 2 月启动 v1.1 草案阶段。这种快速迭代速度，使得 SKILL.md 在 Skill 标准化竞争中占据了先发优势。

**生态规模与 ClawHub 市场**

截至 2026 年 4 月，ClawHub（clawhub.dev）上已有超过 3,000 个社区贡献的 Skills，覆盖代码审查、测试生成、文档编写、DevOps 自动化、数据库管理等多个领域。这些 Skills 全部以 SKILL.md 格式发布，意味着它们天然具备跨框架迁移的潜力。

社区生态的几个关键数据：

| 指标 | 数值 | 统计时间 |
|------|------|---------|
| 公开 Skills 总数 | 3,200+ | 2026.04 |
| 月活跃下载量 | 85 万次 | 2026.03 |
| 覆盖领域 | 23 个 | 2026.04 |
| 企业私有 Skills | 1,500+ | 2026.04 |
| 贡献者 | 1,800+ | 2026.04 |

**极低的开发者门槛**

Claude Code 的 Skill 创建流程是四框架中最简单的：写一个 Markdown 文件，放到指定目录，即可使用。不需要学习 Python 装饰器语法，不需要理解状态图概念，不需要拖拽可视化控件。这种极简设计让非专业开发者（如产品经理、技术写作人员）也能参与 Skill 的创建和维护。

### 2.3 加载机制：三阶段渐进式披露

Claude Code 的 Skill 加载机制采用了业界称为"渐进式披露"（Progressive Disclosure）的设计，分为三个阶段：

```
阶段一：注册（Registration）
├── Agent 启动时扫描 .claude/skills/ 目录
├── 解析所有 SKILL.md 的 YAML 前置元数据
├── 建立 Skill 索引（名称 + 描述 + 版本）
└── 不加载执行策略（Markdown 体）

阶段二：激活（Activation）
├── 当用户请求触发某个 Skill 的场景时
├── Agent 基于 scope 约束判断是否激活
├── 加载该 Skill 的 scope/dependencies 等结构化字段
└── 仍不加载完整执行策略

阶段三：执行（Execution）
├── Agent 确定需要执行该 Skill
├── 完整加载 SKILL.md 的全部内容（含 Markdown 指令体）
├── 将指令体注入系统提示词
└── LLM 在推理过程中遵循策略执行
```

这种三阶段设计解决了两个核心问题：

1. **Token 经济性**：数百个 Skill 目录扫描后如果全部加载，会消耗大量上下文窗口。渐进式披露确保 Agent 当前上下文只包含少数激活的 Skill 内容。

2. **按需精确匹配**：注册阶段只保留元信息，Agent 可以先根据 name 和 description 做模糊匹配，再根据 scope 条件做精确激活，最后才加载完整指令体。

::: tip 渐进式披露的实际效果
根据 Anthropic 官方博客的数据，一个包含 50 个 Skill 的项目中，渐进式披露使 Token 消耗降低了约 60%，同时 Skill 的命中率保持在 95% 以上。
:::

### 2.4 局限

Claude Code 的声明式 Markdown 范式虽然简单，但也有明显的局限：

**确定性低**：SKILL.md 的指令体是自然语言，最终的执行依赖 LLM 的理解能力。同样的 SKILL.md，在不同 LLM 版本上可能产生不同的执行效果。这与 CrewAI 的 Python 装饰器或 LangChain 的状态图相比，缺少编译期的行为验证。

**依赖 LLM 推理能力**：复杂的条件分支和循环在 Markdown 中难以精确表达。虽然可以使用自然语言描述"如果条件 X 成立，则执行步骤 Y"，但 LLM 是否严格遵循这个条件逻辑取决于其推理能力，而非强制约束。

**缺少运行时监控**：Claude Code 目前不提供 Skill 执行过程的可视化监控和调试界面。一旦 Skill 执行出现意外路径，开发者很难追踪问题根源。

**企业级特性薄弱**：SKILL.md 的 security 字段虽然提供了安全声明机制，但实际的权限执行取决于运行时的沙箱能力。相比之下，CrewAI 和 Coze 的权限模型更加成熟。

---

## 三、CrewAI：五维能力体系的装饰器实现

### 3.1 五维能力体系

CrewAI 对 Skills 的理解建立在一个称为"五维能力体系"（Five-Dimension Capability System）的理论框架上。这个框架认为，任何 Agent 能力都可以从五个维度来描述：

```
五维能力体系
├── Domain（领域维度）
│   └── 能力所属的知识领域
│   └── 例："网络安全"、"数据分析"
├── Task（任务维度）
│   └── 能力能够完成的任务类型
│   └── 例："代码审查"、"日志分析"
├── Tool（工具维度）
│   └── 能力依赖的工具集合
│   └── 例：[GitDiffTool, SearchCodeTool]
├── Reasoning（推理维度）
│   └── 能力使用的推理模式
│   └── 例："链式推理"、"树状推理"
└── Collaboration（协作维度）
    └── 能力如何与其他 Agent 协作
    └── 例："串行传递"、"广播通知"
```

每个 Skill 在 CrewAI 中被定义为这五个维度的结构化组合。与 Claude Code 的"文件即配置"不同，CrewAI 的观点是：**一个 Skill 是一个可组合的能力单元，必须在结构上与其他 Agent 能力严格区分**。

### 3.2 `@skill` 和 `@tool_skill` 装饰器工作原理

CrewAI 使用 Python 装饰器语法来定义 Skill。`@skill` 是最基础的装饰器，用于标注一个函数或类作为 Skill 实现：

```python
from crewai.skill import skill, SkillConfig

@skill(
    name="code_review",
    domain="software_engineering",
    version="2.1.0",
    description="审查代码变更，识别安全漏洞和逻辑错误",
    tools=[GitDiffTool, SearchCodeTool, ReadFileTool],
    reasoning="chain_of_thought",
    collaboration_mode="sequential"
)
class CodeReviewSkill:
    """
    代码审查 Skill 的完整实现。

    该 Skill 封装了从获取变更到生成报告的全部逻辑，
    通过五维能力体系的定义确保与其他 Agent 能力兼容。
    """

    def review(self, pr_number: int) -> ReviewReport:
        """执行 PR 代码审查"""
        changes = self.tools.git_diff.run(pr_number)
        findings = self._analyze_security(changes)
        quality_issues = self._analyze_quality(changes)
        return ReviewReport(findings=findings, quality=quality_issues)

    def _analyze_security(self, changes):
        # 安全分析的具体实现
        pass

    def _analyze_quality(self, changes):
        # 代码质量分析的具体实现
        pass
```

`@tool_skill` 是 `@skill` 的变体，专门用于将现有工具封装为 Skill。当一个工具本身已经足够"智能"、可以作为一个独立能力单元时，使用 `@tool_skill` 可以在不修改工具实现代码的情况下将其注册为 Skill：

```python
from crewai.skill import tool_skill

@tool_skill(
    name="ast_analysis",
    tool=ASTParserTool,
    domain="software_engineering",
    description="使用 AST 解析分析代码结构",
    reasoning="direct"
)
class ASTAnalysisSkill:
    """将 ASTParserTool 直接包装为 Skill"""
    pass
```

装饰器在 Python 中本质上是语法糖——`@skill(...)` 等价于 `CodeReviewSkill = skill(...)(CodeReviewSkill)`。CrewAI 的装饰器在运行时做以下几件事：

1. **元数据注入**：将五维能力的配置信息作为类属性注入
2. **依赖注入**：根据 `tools` 参数将工具实例绑定到类的 `self.tools` 属性
3. **能力注册**：将 Skill 注册到全局 SkillRegistry，供 Agent 在运行时发现
4. **接口生成**：根据五维能力配置自动生成 Agent 可调用的标准化接口

### 3.3 Skills 与 Agent 推理过程的绑定机制

CrewAI 的一个重要创新是 Skills 与 Agent 推理过程的直接绑定。当 CrewAI Agent 需要决定"下一步做什么"时，它会查询 SkillRegistry 中的可用 Skills，并根据当前上下文选择最匹配的那个。

绑定机制的核心流程：

```
Agent 推理循环
┌────────────────────────────────────────┐
│ 1. 接收任务输入                       │
│ 2. 查询 SkillRegistry                  │
│    ├── 按 Domain 过滤（领域匹配）      │
│    ├── 按 Tool 可用性过滤（依赖满足）  │
│    └── 按描述语义匹配（相似度排序）    │
│ 3. 选择 Top-1 Skill                    │
│ 4. 执行 Skill 的入口方法              │
│ 5. 将 Skill 输出注入推理上下文        │
│ 6. 回到步骤 2（或结束）               │
└────────────────────────────────────────┘
```

这个机制与 Claude Code 的"Agent 自主理解 SKILL.md 并执行"有本质区别：CrewAI 的 Skill 执行是强类型的——Agent 不"理解"Skill 的逻辑，而是严格调用 Skill 定义的方法。这带来了更高的确定性，但也失去了 Claude Code 式灵活性（Agent 可以在执行过程中根据上下文调整策略）。

### 3.4 2026 年初 SKILL.md 导入支持

2026 年 1 月，CrewAI 发布了 SKILL.md 导入器（Importer），这是业界首个官方的跨框架 Skill 导入工具。导入器的工作流程如下：

```python
from crewai.skill_import import SkillMarkdownImporter

# 从 SKILL.md 导入到 CrewAI Skill
importer = SkillMarkdownImporter()
crewai_skill = importer.import_from(
    path="./claude-skills/code_review/SKILL.md",
    target_framework="crewai",
    auto_register=True
)

# 导入后的 Skill 可以直接在 CrewAI Agent 中使用
agent = Agent(
    role="Code Reviewer",
    skills=[crewai_skill]
)
```

导入器的核心挑战在于"语义翻译"：SKILL.md 中的自然语言指令体需要被翻译成 CrewAI 的五维能力结构和 Python 代码。目前 CrewAI 的实现采用了一种"半自动"策略：

- **自动转换部分**：YAML 前置元数据中的 `name`、`description`、`scope.languages`、`tools` 可以直接映射到五维能力维度
- **需要人工介入部分**：Markdown 指令体中的执行逻辑需要开发者手动编写为 Python 方法
- **辅助生成**：导入器会根据 Markdown 指令体生成一段注释说明，辅助开发者理解应实现什么逻辑

这种设计务实但有限——它解决了"元数据迁移"的问题，但没有解决"执行策略迁移"的问题。我们将在第六章深入分析这个语义鸿沟。

---

## 四、LangChain：状态图编排的条件分支

### 4.1 ToolNode 设计模式与 LangGraph 状态管理

LangChain 对 Skills 的实现在哲学上与 Claude Code 和 CrewAI 都不同。在 LangChain 的视角中，Skill 不是一个"能力单元"或"策略文档"，而是一个**可组合的状态图子图**。

这个设计的核心是 ToolNode 模式。在 LangGraph 中，每个工具可以被包装为一个 ToolNode，多个 ToolNode 通过图的边连接形成执行流程。一个 Skill 本质上就是一个预定义的、可复用的 ToolNode 子图：

```python
from langgraph.graph import StateGraph, ToolNode
from typing import TypedDict, List

# 1. 定义状态
class ReviewState(TypedDict):
    pr_number: int
    changes: List[str]
    security_findings: List[dict]
    quality_issues: List[dict]
    report: str

# 2. 创建 ToolNodes
git_diff_node = ToolNode(tools=[GitDiffTool])
read_file_node = ToolNode(tools=[ReadFileTool])
security_scan_node = ToolNode(tools=[SecurityScanner])
quality_check_node = ToolNode(tools=[LinterTool])

# 3. 构建 Skill 子图
def create_code_review_skill() -> StateGraph:
    """创建一个代码审查 Skill"""
    graph = StateGraph(ReviewState)

    # 添加节点
    graph.add_node("get_changes", git_diff_node)
    graph.add_node("read_files", read_file_node)
    graph.add_node("scan_security", security_scan_node)
    graph.add_node("check_quality", quality_check_node)
    graph.add_node("generate_report", report_node)

    # 添加边
    graph.add_edge("get_changes", "read_files")
    graph.add_edge("read_files", "scan_security")
    graph.add_edge("scan_security", "check_quality")
    graph.add_edge("check_quality", "generate_report")

    # 设置入口和出口
    graph.set_entry_point("get_changes")
    graph.set_finish_point("generate_report")

    return graph.compile()
```

这种基于状态图的设计带来了几个关键特性：

1. **显式的状态管理**：ReviewState 类型定义了 Skill 执行过程中传递的数据结构，所有节点共享这个状态。这使得数据流可追踪、可调试。

2. **确定性执行**：由于执行路径被编码为图结构，LangGraph 的 Skill 执行在理论上具有 100% 的确定性——给定相同的输入和状态，一定走相同的路径。

3. **可组合性**：一个 Skill 子图可以被嵌入到更大的 Agent 图中，也可以与其他 Skill 子图组合形成更复杂的编排。

### 4.2 条件路由深度分析

LangGraph 的 `add_conditional_edges` 方法是其 Skill 实现中最强大的特性之一。它允许根据当前状态动态决定执行路径：

```python
from langgraph.graph import add_conditional_edges

def route_by_severity(state: ReviewState) -> str:
    """根据安全问题的严重程度决定下一步"""
    critical_count = sum(
        1 for f in state["security_findings"]
        if f["severity"] == "critical"
    )
    if critical_count > 0:
        return "escalate_review"   # 存在严重问题，升级审查
    elif state["quality_issues"]:
        return "suggest_fixes"     # 仅有质量问题，建议修复
    else:
        return "approve"           # 无问题，直接通过

# 添加条件路由
graph.add_conditional_edges(
    "scan_security",          # 源节点
    route_by_severity,        # 路由函数
    {
        "escalate_review": "escalate_review",
        "suggest_fixes": "suggest_fixes",
        "approve": "check_quality"
    }
)
```

条件路由的核心价值在于它能够表达 **SKILL.md 自然语言难以精确描述的分支逻辑**。上面这个例子的业务逻辑在 SKILL.md 中只能写成：

```markdown
- 检查安全漏洞
- 如果发现严重漏洞，升级审查
- 如果仅有质量问题，建议修复方案
- 否则继续检查代码风格
```

这两种表达方式的差异不仅是形式上的——状态图的条件路由是**可测试的**（可以针对路由函数编写单元测试），而 SKILL.md 的"如果"是**不可测试的**（无法验证 LLM 是否理解并遵循了条件）。

::: warning 条件路由的代价
条件路由虽然带来了精确性和可测试性，但也增加了复杂度。一个包含 10 个以上条件节点的状态图，调试难度显著高于等价的 SKILL.md。LangGraph 官方建议在单个 Skill 子图中条件节点不超过 5 个。
:::

### 4.3 可观测性与 LangSmith 集成

LangChain 的另一个核心优势是其可观测性基础设施——LangSmith。当 Skill 以 LangGraph 子图的形式执行时，LangSmith 可以捕获每个节点的执行细节：

```
LangSmith Trace - code_review_skill
│
├─ get_changes           ✓  1.2s  输出: 5 files changed
├─ read_files            ✓  3.5s  输出: 1,234 lines read
├─ scan_security         ✓  2.1s  输出: 2 findings (1 critical)
│   └─ route_by_severity → "escalate_review"
├─ escalate_review       ✓  1.8s  输出: Escalation sent
└─ generate_report       ✓  0.9s  输出: Report generated
```

这种可观测性带来的直接好处是：当 Skill 执行出现问题时，开发者可以精确地定位到是哪个节点出了什么问题，而不是像 Claude Code 那样只能看到一个黑盒结果。

### 4.4 社区 SKILL.md 转 LangGraph 转换工具

LangChain 社区开发了多个工具来将 SKILL.md 转换为 LangGraph 图结构。其中最活跃的是 `skill-to-langgraph` 开源项目，其核心思路是将 SKILL.md 解析为中间表示（IR），然后由代码生成器输出 LangGraph 代码：

```
SKILL.md
  │  (YAML解析器)
  ▼
结构化元数据（name, tools, scope...）
  │  (NLU 策略解析器)
  ▼
中间表示（IR - 节点 + 边 + 条件）
  │  (LangGraph 代码生成器)
  ▼
Python 代码（StateGraph + ToolNode + conditional_edges）
```

但需要指出的是，这个转换过程目前在"策略解析"环节仍然高度依赖人工干预。自然语言描述的步骤序列（"首先检查安全漏洞，然后分析质量"）相对容易解析，但条件分支（"如果发现严重问题则升级"）和循环（"对每个文件重复上述步骤"）的解析质量不稳定。

---

## 五、扣子（Coze）2.0：可视化工作流的企业级实现

### 5.1 可视化编排 vs 代码定义范式

2026 年 1 月发布的扣子 2.0 代表了 Skills 实现的第四种范式：**可视化工作流**。与前三者（Markdown 文件、Python 装饰器、状态图代码）不同，扣子 2.0 的核心交互方式是拖拽式的图形界面。

```
范式光谱
┌─────────────────────────────────────────────────────┐
│  代码密度高                   代码密度低              │
│                                                        │
│  LangChain  CrewAI  Claude Code           Coze         │
│  (状态图)   (装饰器)  (Markdown)        (可视化)      │
│                                                        │
│  确定性高 ←───────────────────────────→ 灵活性高       │
└─────────────────────────────────────────────────────┘
```

在扣子 2.0 中，一个 Skill 对应一个"工作流模板"（Workflow Template）。你可以通过拖拽以下节点类型来构建工作流：

- **触发器节点**：定义 Skill 的触发条件（Webhook、定时、事件）
- **LLM 节点**：调用大模型进行推理和生成
- **代码节点**：执行自定义 Python/JavaScript 代码
- **工具节点**：调用预置或自定义工具（API、数据库、文件操作）
- **逻辑节点**：条件分支、循环、并行、等待
- **人工节点**：等待人工审批或输入

扣子 2.0 的工作流编辑器界面抽象如下（文字描述）：

```
┌─── 代码审查工作流 ─────────────────────────────────┐
│                                                      │
│  [触发器] → [获取变更] → [LLM分析:安全] ─→ [分支判断] │
│                  │                    │       │      │
│                  │                    │   [有严重问题] │
│                  │                    │       ↓      │
│                  │                    │   [人工审批]  │
│                  │                    │       │      │
│                  │                    │   [无问题]    │
│                  ↓                    │       ↓      │
│             [读取文件] → [LLM分析:质量] → [生成报告]  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 5.2 企业级特性

扣子 2.0 的 Skills 实现瞄准的是企业级市场，因此包含了许多开发者框架中所没有的企业级特性：

**审批流（Approval Flow）**

在企业环境中，某些 Skill 的执行可能需要人工审批。例如，一个"自动部署"Skill 在执行前需要团队 Leader 的批准。扣子 2.0 的原生审批流支持：

- **多级审批**：一二级审批人依次批准
- **条件审批**：根据风险等级决定是否需要审批
- **超时处理**：审批超时自动降级或取消
- **审计日志**：所有审批操作记录在案

**环境隔离（Environment Isolation）**

扣子 2.0 支持三个标准环境：

| 环境 | 用途 | 数据隔离 | 审批要求 |
|------|------|---------|---------|
| 开发（Dev） | Skill 开发和调试 | 完全隔离 | 无 |
| 测试（Staging） | 集成测试和验证 | 与生产隔离 | 部署审批 |
| 生产（Production） | 正式投入使用 | 完全隔离 | 变更审批 + 回滚计划 |

**版本审批（Version Approval）**

每个 Skill 的版本发布遵循严格的审批流程：开发 → 测试验证 → 管理员审批 → 灰度发布 → 全量发布。这个流程与企业级软件发布的成熟度模型（如 ITIL）保持一致。

### 5.3 可视化 Skills 对 SKILL.md 标准的兼容程度

扣子 2.0 在发布时宣布了"对 SKILL.md 标准的初步兼容"。具体来说，兼容性体现在以下层面：

**支持的 SKILL.md 字段**：

- `name` → 工作流模板名称
- `description` → 工作流描述
- `version` → 工作流版本号
- `tools` → 映射到工具节点的配置
- `output` → 工作流输出格式定义

**不支持的字段**：

- `scope.languages`、`scope.directories` — 扣子使用自有的事件触发机制
- `security` — 扣子使用平台级的安全策略，不支持字段级声明
- `dependencies` — 扣子的依赖管理通过平台市场实现
- Markdown 指令体 — 扣子使用可视化节点替代自然语言指令

所以扣子 2.0 的 SKILL.md 兼容本质上是"元数据兼容"而非"策略兼容"。一个完整的 SKILL.md 导入扣子后，只有 YAML 前置元数据被解析，Markdown 指令体被忽略—开发者需要在可视化界面上重新实现执行逻辑。

### 5.4 适用场景

**最适合扣子 2.0 的场景**：

- **低代码团队**：团队中非技术成员（业务分析师、产品经理）需要参与 Skill 的定义和维护
- **企业合规场景**：需要严格审批流程、审计日志、环境隔离的行业（金融、医疗、政府）
- **跨部门协作**：多个业务部门共同使用同一套 Skill 模板，各自配置参数
- **快速原型**：通过可视化编排快速验证 Skill 设计，再决定是否迁移到代码框架

**最不适合扣子 2.0 的场景**：

- **复杂的条件逻辑**：超过 5 层的嵌套条件分支在可视化界面中会变得难以维护
- **高性能要求**：可视化工作流的执行开销高于代码框架，对于延迟敏感的场景不适合
- **版本控制深度集成**：扣子 2.0 的工作流模板以平台托管为主，与 Git 的集成不如代码框架紧密

---

## 六、四框架执行引擎对比矩阵

### 6.1 多维度对比

| 维度 | Claude Code | CrewAI | LangChain | 扣子 2.0 |
|------|-----------|--------|----------|---------|
| **范式类型** | 声明式 Markdown | 装饰器 + Python | 状态图 + 代码 | 可视化工作流 |
| **载体格式** | SKILL.md | Python 类 | LangGraph Subgraph | 平台工作流模板 |
| **执行模型** | LLM 自主理解 | 方法调用 | 图遍历 | 引擎解释执行 |
| **确定性** | 中（依赖 LLM） | 高（代码级） | 高（图级） | 中高（引擎级） |
| **调试难度** | 困难（黑盒） | 中等（Python 调试） | 中等（LangSmith） | 简单（可视化） |
| **学习曲线** | 极低 | 中（需 Python） | 高（需 Graph 理解） | 极低 |
| **生态规模** | 大（3,000+ Skills） | 中（800+ Skills） | 大（社区工具多） | 企业私有为主 |
| **企业特性** | 弱 | 中 | 中 | 强（审批/隔离） |
| **扩展性** | 通过工具声明 | 通过装饰器参数 | 通过子图组合 | 通过插件市场 |
| **可观测性** | 无原生支持 | Agent 日志 | LangSmith | 平台监控面板 |
| **LLM 依赖度** | 高 | 中 | 中低 | 中 |

### 6.2 决策树

根据你的团队和技术背景，以下决策树可以帮助你做出选择：

```
你的团队有 Python 开发能力吗？
├── 否 → 你需要低代码方案吗？
│   ├── 是 → 扣子 2.0
│   └── 否 → Claude Code（Markdown 就够了）
└── 是 → 你需要精确的条件分支和状态管理吗？
    ├── 否 → CrewAI（装饰器更简洁）或 Claude Code
    └── 是 → 你需要企业级审批和隔离吗？
        ├── 是 → 扣子 2.0（Python 插件扩展）
        └── 否 → LangChain（状态图最灵活）

你的核心关注点是生态规模还是可观测性？
├── 生态规模 → Claude Code（最大 Skill 市场）
├── 可观测性 → LangChain（LangSmith 集成）
├── 团队协作 → CrewAI（五维能力体系便于分工）
└── 企业合规 → 扣子 2.0（审批流和环境隔离）
```

---

## 思考题

::: info 检验你的理解

1. 假设你正在设计一个"多语言代码审查"Skill，要求在审查 Python 代码时使用 `ruff` 工具，审查 TypeScript 代码时使用 `eslint` 工具。在 Claude Code（SKILL.md）、CrewAI（装饰器）、LangChain（状态图）中分别如何实现这个条件工具选择？哪种设计的表达力最精确？

2. 扣子 2.0 的"可视化工作流"与 LangChain 的"状态图"在本质上都是图结构，但一个面向非开发者，一个面向开发者。你认为这两种图结构的设计理念差异具体体现在哪些方面？举出三个具体的差异点。

3. CrewAI 的 "SKILL.md 导入器" 设计为"元数据自动转换 + 策略体需人工编写"。你认为是否存在一种方式可以自动地将 Markdown 自然语言指令体转换为 CrewAI 的 Python 装饰器逻辑？如果有，可能的实现思路是什么？如果没有，根本的障碍是什么？

4. 考虑一个实际的企业场景：你需要为一个金融合规团队实现"交易审计 Skill"，该 Skill 需要多级审批流、与内部 Kafka 系统集成、并在每个执行步骤记录审计日志。基于本章的对比分析，你推荐选择哪个框架？为什么？

:::

---

## 本章小结

- Claude Code 的声明式 Markdown 范式以"文件即配置"为哲学，门槛极低，生态最大，但确定性和可观测性较弱
- CrewAI 的五维能力体系通过 Python 装饰器实现强类型的 Skill 定义，确定性强，适合有 Python 背景的团队
- LangChain 的状态图编排使用 LangGraph 的条件路由，执行路径可编程、可测试、可观测，但学习曲线最高
- 扣子 2.0 的可视化工作流将 Skills 带入企业级场景，提供审批流、环境隔离、版本审批等特性，但灵活性受限
- 四个框架从"确定性"到"灵活性"形成一个连续光谱，没有绝对的最优选择，只有最匹配场景的选择
- 选型的关键考量因素：团队技术能力、确定性需求、企业合规要求、生态规模偏好

---

## 参考资料

- [Anthropic. (2025). Agent Skills Open Standard v1.0.](https://agentskills.io) — SKILL.md 官方标准
- [CrewAI. (2026). Skills Documentation - Five-Dimension Capability System.](https://docs.crewai.com/skills) — CrewAI Skills 官方文档
- [LangChain. (2026). LangGraph Skills Guide - Stateful Agent Orchestration.](https://docs.langchain.com/langgraph/skills) — LangGraph Skills 子图指南
- [字节跳动扣子团队. (2026). 扣子 2.0 企业版发布公告.](https://www.coze.cn/blog/enterprise-2.0) — Coze 2.0 企业特性说明
- [DeepLearning.AI. (2026). Building Agent Skills Across Frameworks.](https://learn.deeplearning.ai/) — 跨框架 Skills 构建课程
- [ClawHub. (2026). Skills Marketplace Statistics.](https://clawhub.dev/stats) — 社区 Skills 市场数据
- [LangSmith. (2026). Observability for LangGraph Skills.](https://docs.smith.langchain.com/skills) — LangSmith Skills 可观测性文档
