# 主流框架的 Skills 实现

> **学习目标**: 理解 Claude Code、CrewAI、LangChain 三大框架的 Skills 实现方案及其设计取舍
>
> **预计时间**: 30 分钟
>
> **难度等级**: ⭐⭐⭐☆☆

---

## 一、Claude Code Skills

### 1.1 设计理念

Claude Code 的 Skills 实现最接近 SKILL.md 开放标准，因为 Anthropic 正是这一标准的发起者。核心设计理念：

- **Markdown 原生**：Skill 就是 `.md` 文件，不需要额外编译或打包
- **渐进式披露**：内置三级加载机制
- **零配置启用**：放入 `.claude/skills/` 目录即自动注册

### 1.2 文件结构

```
project/
└── .claude/
    └── skills/
        └── code_review/
            ├── SKILL.md          # 主文件
            ├── examples/         # 可选示例
            │   └── example.yaml
            └── tests/            # 可选测试
                └── test_review.py
```

### 1.3 SKILL.md 实例

```yaml
---
name: code_review
version: 1.0.0
description: "审查代码变更，生成结构化报告"
tools:
  - read_file
  - search_files
  - run_command
---

# Code Review Skill

当用户要求审查代码时，按以下流程执行。

## 工作流程

1. **确定审查范围**
   - 询问或推断需要审查的文件/PR
   - 使用 `read_file` 读取变更内容

2. **安全审查**
   - 检查硬编码的密钥和凭证
   - 检查 SQL 注入、XSS 风险
   - 检查不安全的函数调用（eval、exec）

3. **质量审查**
   - 检查函数复杂度
   - 检查命名规范
   - 检查错误处理完整性

4. **生成报告**
   - 按严重程度排序问题
   - 每个问题附带位置和修复建议

## 约束
- 跳过 node_modules/、vendor/、__pycache__/ 目录
- 跳过标记 @generated 的文件
- 不确定的问题标注"需确认"
```

### 1.4 加载机制

```python
# Claude Code 的 Skill 加载流程（概念简化版）
class ClaudeCodeSkillLoader:
    def __init__(self, project_root: str):
        self.skill_dirs = [
            Path(project_root) / ".claude" / "skills",   # 项目级
            Path.home() / ".claude" / "skills",           # 全局级
        ]

    def discover(self) -> list[SkillMetadata]:
        """第一阶段：扫描所有 SKILL.md，提取元信息"""
        skills = []
        for base_dir in self.skill_dirs:
            for skill_dir in base_dir.iterdir():
                skill_file = skill_dir / "SKILL.md"
                if skill_file.exists():
                    meta = parse_frontmatter(skill_file)
                    skills.append(SkillMetadata(
                        name=meta["name"],
                        description=meta["description"],
                        tags=meta.get("tags", []),
                        path=str(skill_file)
                    ))
        return skills

    def activate(self, skill_name: str) -> SkillActivation:
        """第二阶段：加载工具依赖"""
        skill = self.find_skill(skill_name)
        meta = parse_frontmatter(skill.path)
        return SkillActivation(
            tools=meta.get("tools", []),
            scope=meta.get("scope", {})
        )

    def load_full(self, skill_name: str) -> str:
        """第三阶段：加载完整指令体"""
        skill = self.find_skill(skill_name)
        return read_full_body(skill.path)
```

### 1.5 特点总结

| 特点 | 说明 |
|------|------|
| 格式 | 纯 Markdown + YAML 前置元数据 |
| 工具绑定 | 声明式，列出所需工具名称 |
| 扩展性 | 通过 extensions/ 目录扩展 |
| 社区生态 | ClawHub 市场，500+ 社区 Skills |
| 适用场景 | 通用开发任务，Claude 原生集成 |

---

## 二、CrewAI Skills

### 2.1 设计理念

CrewAI 采用了不同的思路。它不使用 Markdown 文件，而是将 Skills 作为 Python 类实现，通过装饰器声明能力。CrewAI 的核心理念是**五维能力体系**。

### 2.2 五维能力体系

CrewAI 认为一个 Agent 的能力可以沿五个维度描述：

```
┌─────────────────────────────────────────┐
│          CrewAI 五维能力体系             │
├─────────────────────────────────────────┤
│                                         │
│  1. Domain（领域知识）                   │
│     Agent 在什么领域工作                 │
│     例：Web 开发、数据分析、金融          │
│                                         │
│  2. Task（任务类型）                     │
│     Agent 能完成什么类型的任务            │
│     例：代码生成、测试、文档编写          │
│                                         │
│  3. Tool（工具技能）                     │
│     Agent 能使用什么工具                  │
│     例：搜索引擎、数据库、API 调用        │
│                                         │
│  4. Reasoning（推理模式）                │
│     Agent 如何思考和决策                  │
│     例：演绎推理、类比推理、因果推理      │
│                                         │
│  5. Collaboration（协作模式）            │
│     Agent 如何与其他 Agent 协作          │
│     例：委派、协商、审核                  │
│                                         │
└─────────────────────────────────────────┘
```

### 2.3 Skill 定义方式

```python
from crewai import Agent, Task, Skill
from crewai.skills import skill, tool_skill

# 方式一：装饰器定义
@skill(
    name="code_review",
    description="审查代码变更的质量和安全性",
    dimensions={
        "domain": ["web_development", "backend"],
        "task": ["code_review", "security_audit"],
        "tools": ["git", "linter", "ast_parser"],
        "reasoning": ["pattern_matching", "causal"],
    }
)
class CodeReviewSkill(Skill):
    """代码审查 Skill"""

    def execute(self, context: dict) -> dict:
        pr_number = context.get("pr_number")
        changes = self.tools.git_diff(pr_number)

        report = {
            "summary": self._summarize(changes),
            "security": self._check_security(changes),
            "quality": self._check_quality(changes),
        }

        return report

    def _check_security(self, changes):
        issues = []
        for file_change in changes:
            # 安全检查逻辑
            if self._has_sql_injection(file_change):
                issues.append({
                    "file": file_change.path,
                    "line": file_change.line,
                    "type": "sql_injection",
                    "severity": "critical"
                })
        return issues

    def _check_quality(self, changes):
        # 质量检查逻辑
        ...

    def _summarize(self, changes):
        # 摘要生成
        ...

# 方式二：工具型 Skill（更轻量）
@tool_skill(
    name="git_operations",
    tools=["git"]
)
class GitSkill(Skill):
    def execute(self, context: dict) -> dict:
        action = context.get("action")
        if action == "diff":
            return self.tools.git.diff(context.get("args", {}))
        elif action == "log":
            return self.tools.git.log(context.get("args", {}))
```

### 2.4 Agent 绑定 Skills

```python
from crewai import Agent, Crew

# 创建带 Skills 的 Agent
reviewer = Agent(
    role="Senior Code Reviewer",
    goal="确保代码质量和安全性",
    skills=[CodeReviewSkill(), GitSkill()],
    # CrewAI 的 Skills 自动关联到 Agent 的推理过程
)

# 创建 Crew 并分配任务
crew = Crew(
    agents=[reviewer],
    tasks=[
        Task(
            description="审查 PR #123 的代码变更",
            agent=reviewer,
            expected_output="结构化的代码审查报告"
        )
    ]
)

result = crew.kickoff()
```

### 2.5 特点总结

| 特点 | 说明 |
|------|------|
| 格式 | Python 类 + 装饰器 |
| 工具绑定 | 通过 `tools` 参数注入 |
| 扩展性 | 类继承和组合 |
| 社区生态 | CrewAI Hub，以 Python 包分发 |
| 适用场景 | 多 Agent 协作场景，Python 生态 |

---

## 三、LangChain Skills

### 3.1 设计理念

LangChain 在 2025 年底推出了 **Deep Agents** 架构[^2]，其中 Skills 的概念体现为"深度工具链"（Deep Toolchains）。与 Claude Code 和 CrewAI 不同，LangChain 强调：

- **链式编排**：Skill 由多个 ToolNode 串联而成
- **状态管理**：使用 LangGraph 的状态图管理执行过程
- **条件分支**：支持根据中间结果动态调整执行路径

### 3.2 架构图

```
┌─────────────────────────────────────────────────────┐
│                 LangChain Deep Agent                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐        │
│  │ToolNode1│───→│ToolNode2│───→│ToolNode3│        │
│  │ (分析)   │    │ (检索)   │    │ (生成)   │        │
│  └────┬────┘    └────┬────┘    └─────────┘        │
│       │              │                               │
│       └── 条件分支 ──┘                               │
│              │                                      │
│       ┌──────▼──────┐                              │
│       │  ToolNode4  │                              │
│       │  (验证)      │                              │
│       └─────────────┘                              │
│                                                     │
│  状态管理: LangGraph State                          │
│  条件路由: ConditionalEdge                          │
└─────────────────────────────────────────────────────┘
```

### 3.3 Skill 定义方式

```python
from langgraph.graph import StateGraph, END
from langchain_core.tools import tool
from typing import TypedDict, Annotated

# 定义状态
class CodeReviewState(TypedDict):
    pr_number: int
    diff_content: str
    security_issues: list
    quality_issues: list
    report: str

# 定义工具节点
@tool
def get_pr_diff(pr_number: int) -> str:
    """获取 PR 的变更内容"""
    # 调用 Git API 获取 diff
    return fetch_diff(pr_number)

@tool
def check_security(diff_content: str) -> list:
    """安全检查"""
    issues = []
    # 检查安全问题的逻辑
    return issues

@tool
def check_quality(diff_content: str) -> list:
    """质量检查"""
    issues = []
    # 检查质量问题的逻辑
    return issues

@tool
def generate_report(security_issues: list, quality_issues: list) -> str:
    """生成审查报告"""
    report = "# 审查报告\n\n"
    if security_issues:
        report += "## 严重问题\n"
        for issue in security_issues:
            report += f"- {issue}\n"
    if quality_issues:
        report += "## 质量建议\n"
        for issue in quality_issues:
            report += f"- {issue}\n"
    return report

# 构建 Skill 图
def build_code_review_skill():
    graph = StateGraph(CodeReviewState)

    # 添加节点
    graph.add_node("get_diff", lambda s: {
        "diff_content": get_pr_diff.invoke({"pr_number": s["pr_number"]})
    })
    graph.add_node("security_check", lambda s: {
        "security_issues": check_security.invoke({"diff_content": s["diff_content"]})
    })
    graph.add_node("quality_check", lambda s: {
        "quality_issues": check_quality.invoke({"diff_content": s["diff_content"]})
    })
    graph.add_node("report", lambda s: {
        "report": generate_report.invoke({
            "security_issues": s["security_issues"],
            "quality_issues": s["quality_issues"]
        })
    })

    # 定义边
    graph.add_edge("get_diff", "security_check")
    graph.add_edge("security_check", "quality_check")
    graph.add_edge("quality_check", "report")
    graph.add_edge("report", END)

    # 设置入口
    graph.set_entry_point("get_diff")

    return graph.compile()

# 使用 Skill
skill = build_code_review_skill()
result = skill.invoke({"pr_number": 123})
print(result["report"])
```

### 3.4 条件分支

LangChain 的 Skill 支持根据中间结果动态调整路径：

```python
def should_deep_analyze(state: CodeReviewState) -> str:
    """根据安全检查结果决定是否需要深度分析"""
    critical_count = sum(
        1 for issue in state["security_issues"]
        if issue.get("severity") == "critical"
    )
    if critical_count > 0:
        return "deep_analyze"
    return "report"

# 添加条件边
graph.add_conditional_edges(
    "security_check",
    should_deep_analyze,
    {
        "deep_analyze": "deep_security_analysis",
        "report": "quality_check"
    }
)
```

### 3.5 特点总结

| 特点 | 说明 |
|------|------|
| 格式 | Python 图定义（LangGraph） |
| 工具绑定 | 作为图节点（ToolNode）注入 |
| 扩展性 | 通过图的组合和嵌套 |
| 社区生态 | LangChain Hub，LangSmith 集成 |
| 适用场景 | 复杂工作流，需要条件分支和状态管理 |

---

## 四、跨框架对比

### 4.1 核心差异

| 维度 | Claude Code | CrewAI | LangChain |
|------|-------------|--------|-----------|
| **载体格式** | Markdown 文件 | Python 类 | Python 图 |
| **定义方式** | 声明式 YAML + 自然语言 | 装饰器 + 类继承 | 状态图 + 节点 |
| **工具绑定** | 名称引用 | 参数注入 | 节点封装 |
| **执行模型** | LLM 解释指令 | 类方法调用 | 图遍历 |
| **灵活性** | 高（LLM 自由发挥） | 中（代码约束） | 高（图可定制） |
| **确定性** | 低（依赖 LLM 理解） | 高（代码逻辑） | 中（图 + LLM） |
| **调试难度** | 较高（黑盒） | 低（断点调试） | 中（可视化图） |
| **学习曲线** | 低（写 Markdown） | 中（学 Python API） | 高（学 LangGraph） |
| **生态规模** | 500+ Skills | 200+ Skills | 1000+ Chains |
| **标准化** | SKILL.md 开放标准 | 框架私有 | 框架私有 |

### 4.2 选择建议

```
你的需求是什么？
│
├── 快速上手，通用开发任务
│   └── Claude Code Skills
│       优势：Markdown 格式简单，生态丰富
│
├── 多 Agent 协作场景
│   └── CrewAI Skills
│       优势：五维能力体系，天然支持协作
│
├── 复杂工作流，需要条件分支
│   └── LangChain Deep Agents
│       优势：状态图管理，可视化流程
│
└── 需要跨框架迁移
    └── SKILL.md 标准 + 各框架适配层
        优势：一次编写，多处使用
```

### 4.3 趋势：走向融合

三大框架正在向 SKILL.md 开放标准靠拢：

- **Claude Code**：原生支持，标准的发起者
- **CrewAI**：2026 年初宣布支持导入 SKILL.md 格式[^3]
- **LangChain**：社区已有 SKILL.md → LangGraph 的转换工具

```
当前状态（2026 年初）：

Claude Code ──── SKILL.md 标准 ──── Anthropic
                                    ↑
CrewAI ──────── 适配层（开发中）────┘
                                    ↑
LangChain ───── 社区转换工具 ────────┘

未来预期：
所有框架都能导入和导出 SKILL.md 格式
```

### 4.4 互操作性示例

```python
# 将 SKILL.md 转换为 CrewAI Skill（概念示例）
from skill_md import parse_skill_md
from crewai import Skill

def skill_md_to_crewai(skill_md_path: str) -> Skill:
    """将 SKILL.md 文件转换为 CrewAI Skill"""
    meta, instructions = parse_skill_md(skill_md_path)

    class ConvertedSkill(Skill):
        name = meta["name"]
        description = meta["description"]

        def execute(self, context: dict):
            # 将 SKILL.md 的指令注入到 Agent 的系统提示中
            self.agent.inject_instructions(instructions)
            return self.agent.run(context)

    return ConvertedSkill()
```

---

## 思考题

::: info 检验你的理解
1. **Claude Code 和 CrewAI 的 Skills 实现最大的区别是什么？** 从"谁来决定执行流程"的角度分析。

2. **LangChain 的条件分支能力解决了什么问题？** 举一个必须用条件分支才能处理的场景。

3. **如果 SKILL.md 成为所有框架的标准，各框架如何保持差异化？** 思考标准化的边界在哪里。

4. **在什么场景下你会选择 CrewAI 而不是 Claude Code？** 给出一个具体的业务场景和理由。
:::

---

## 本节小结

- ✅ **Claude Code Skills** 采用 Markdown + YAML 格式，最接近 SKILL.md 开放标准，灵活性高但确定性低
- ✅ **CrewAI Skills** 采用 Python 类 + 五维能力体系，天然支持多 Agent 协作，确定性高
- ✅ **LangChain Deep Agents** 采用状态图编排，支持条件分支和复杂工作流，学习曲线较陡
- ✅ **三大框架正在走向融合**，SKILL.md 开放标准正在成为跨框架的事实标准

---

**下一步**: 了解了不同框架的实现方案后，下一节我们将进入实战——学习如何设计和编写一个高质量的 Skill，包括设计原则、完整案例和常见陷阱。

---

[← 返回模块首页](/agent-ecosystem/09-agent-skills) | [继续学习:Skill 设计与实战 →](/agent-ecosystem/09-agent-skills/04-skill-design)

---

[^1]: Anthropic Engineering Blog, "Skills as an Open Standard", December 2025. https://www.anthropic.com/engineering/skills-open-standard
[^2]: LangChain Blog, "Introducing Deep Agents", October 2025. https://blog.langchain.dev/deep-agents
[^3]: CrewAI Changelog, "SKILL.md Import Support", January 2026. https://docs.crewai.com/changelog
