# 什么是 Agent Skills

> **学习目标**: 理解 Skills 的形式化定义、与相关概念的区分，以及 Skills 存在的根本原因
>
> **预计时间**: 20 分钟
>
> **难度等级**: ⭐⭐☆☆☆

---

## 一、Skills 的定义

### 1.1 从具体实例出发

假设你需要构建一个"代码审查"功能。一个 Agent 要完成代码审查，需要：

1. 获取 PR 的变更文件列表
2. 逐个阅读变更内容
3. 识别潜在问题（安全漏洞、性能问题、代码风格）
4. 生成审查意见
5. 按严重程度排序并给出建议

这个流程不是单个工具调用能完成的。它需要**多个工具的组合**，并且需要**明确的策略**来编排这些工具。这就是一个 Skill。

### 1.2 形式化定义：四元组

一个 Skill 可以形式化为四元组：

```
S = (C, π, T, R)
```

| 元素 | 含义 | 代码审查 Skill 对应 |
|------|------|-------------------|
| **C** (Context) | 上下文约束 | 只审查 Python/JS/TS 代码，文件不超过 1000 行 |
| **π** (Policy) | 执行策略 | 先扫描语法错误，再检查安全漏洞，最后审查风格 |
| **T** (Tools) | 工具依赖 | git diff、AST 解析器、linter |
| **R** (Result) | 输出规范 | 按严重程度分级的审查报告，附带修改建议 |

::: tip 四元组的理解方式
可以把 Skill 想象成一份详细的"工作手册"：
- **C** — 这份手册适用于什么岗位、什么场景
- **π** — 遇到问题时按什么步骤处理
- **T** — 执行任务需要用到哪些设备和工具
- **R** — 工作成果应该以什么格式提交
:::

### 1.3 Skills 不是提示词

很多人容易把 Skills 等同于精心设计的提示词。它们有本质区别：

| 维度 | 提示词 (Prompt) | Skill |
|------|----------------|-------|
| 工具绑定 | 无，靠 Agent 自行选择 | 显式声明所需工具 |
| 边界约束 | 模糊 | 明确的上下文边界 |
| 可组合性 | 差，拼接导致冲突 | 好，每个 Skill 独立封装 |
| 可测试性 | 难以自动验证 | 有明确的输入输出规范 |
| 版本管理 | 无标准格式 | 语义化版本号 |

一段提示词可以是 Skill 的一部分（作为策略 π 的载体），但 Skill 远不止提示词。

### 1.4 代码审查 Skill 的完整形态

以下是一个代码审查 Skill 的概念化描述，展示四元组的实际含义：

```yaml
# C (Context) — 上下文约束
name: code_review
version: 1.2.0
description: "审查 Pull Request 中的代码变更"
scope:
  languages: ["python", "javascript", "typescript"]
  max_files: 50
  max_file_lines: 1000

# π (Policy) — 执行策略
instructions: |
  代码审查按以下优先级执行：
  1. 安全问题（SQL 注入、XSS、硬编码密钥）
  2. 逻辑错误（空指针、竞态条件、资源泄露）
  3. 性能问题（N+1 查询、不必要的循环）
  4. 代码风格（命名规范、注释完整性）
  每个问题必须附带具体位置和修改建议。

# T (Tools) — 工具依赖
tools:
  - name: git_diff
    description: "获取 PR 的变更内容"
  - name: ast_parser
    description: "解析代码的抽象语法树"
  - name: linter
    description: "运行代码风格检查"
  - name: search_code
    description: "搜索相关上下文代码"

# R (Result) — 输出规范
output:
  format: markdown
  sections:
    - summary: "变更概要"
    - critical: "严重问题（必须修复）"
    - warnings: "警告（建议修复）"
    - suggestions: "改进建议（可选）"
```

---

## 二、Skills 与 Tools/Plugins/Actions 的区别

### 2.1 概念对照

在 Agent 领域，有几个概念容易混淆：

| 概念 | 定义 | 类比 | 粒度 |
|------|------|------|------|
| **Tool** | Agent 可以调用的单个函数 | 厨房里的一把刀 | 最细，单个操作 |
| **Action** | 有副作用的工具调用 | 用刀切菜 | 细，单步操作 |
| **Plugin** | 一组相关工具的集合 | 一整套厨具 | 中等，工具包 |
| **Skill** | 使用工具完成任务的策略和知识 | 一道菜的完整菜谱 | 最粗，端到端流程 |

### 2.2 三层模型

可以用一个三层模型来理解它们的关系：

```
┌──────────────────────────────────────────────┐
│               Skill 层（策略层）               │
│  "怎么做" — 编排工具完成端到端任务              │
│  例：代码审查、文档生成、数据分析               │
├──────────────────────────────────────────────┤
│             Plugin 层（聚合层）                │
│  "有哪些" — 将相关工具打包成功能模块            │
│  例：Git 操作包、数据库操作包                   │
├──────────────────────────────────────────────┤
│              Tool 层（原子层）                 │
│  "能做什么" — 单个可调用的函数或 API            │
│  例：read_file、execute_sql、http_get          │
└──────────────────────────────────────────────┘
```

一个 Skill 可以调用多个 Plugin，一个 Plugin 包含多个 Tool。但这不是严格的层级关系——一个 Skill 也可以直接调用 Tool，跳过 Plugin 层。

### 2.3 从 Tools 到 Skills 的演进

Agent 能力经历了从 Tools 到 Skills 的演进：

**第一代：硬编码工具**

```python
# 每个能力都写死在 Agent 代码中
def review_code(pr_number):
    diff = git.get_diff(pr_number)
    issues = []
    for file in diff.files:
        if detect_sql_injection(file.content):
            issues.append("SQL injection risk")
    return issues
```

问题：能力固定，无法复用，修改需要改代码。

**第二代：Function Calling**

```python
# 工具独立定义，Agent 动态选择
tools = [
    {"name": "get_diff", "description": "获取 PR 变更"},
    {"name": "search_code", "description": "搜索代码"},
    {"name": "run_linter", "description": "代码检查"}
]
# Agent 自行决定调用哪个工具
```

问题：Agent 知道有哪些工具，但不知道怎么组合使用。

**第三代：Skills**

```yaml
# 明确定义工具使用策略
name: code_review
tools: [get_diff, search_code, run_linter]
instructions: |
  1. 用 get_diff 获取变更
  2. 对每个变更文件，用 search_code 查找上下文
  3. 用 run_linter 运行静态检查
  4. 综合分析，生成审查报告
```

Skills 把"如何使用工具"的知识显式编码，形成可复用的策略模块。

### 2.4 为什么不是 Plugin？

Plugin 和 Skill 都是对工具的封装，但侧重点不同：

| 维度 | Plugin | Skill |
|------|--------|-------|
| 关注点 | 提供哪些功能 | 如何使用功能 |
| 内容 | 工具集合 | 策略 + 工具 + 约束 |
| 类比 | 软件库（library） | 设计模式（pattern） |
| 可组合 | 通常不可组合 | 天然支持组合 |
| 更新影响 | 替换工具实现 | 优化执行策略 |

一个 Plugin 提供 `read_file` 和 `write_file` 工具，但不告诉你什么时候该读、什么时候该写、读写之间要注意什么。Skill 负责回答这些问题。

---

## 三、为什么需要 Skills

### 3.1 LLM 的局限性

即使是最强大的 LLM，在面对复杂任务时也存在固有局限：

**1. 工具选择的不确定性**

LLM 面对多个工具时，选择策略不稳定。同样的任务，可能一次选择了高效路径，下一次却绕了远路。

```
用户: "审查这个 PR"

无 Skill 的 LLM:
  尝试 1: get_diff → 分析 → 报告         ✓ 高效
  尝试 2: search_code → get_diff → ...    ✓ 能完成，但冗余
  尝试 3: run_linter → get_diff → ...     ✗ 顺序错误，遗漏上下文

有 Skill 的 LLM:
  始终: get_diff → search_code → run_linter → 分析 → 报告  ✓ 稳定
```

**2. 上下文窗口浪费**

没有 Skills 时，Agent 需要大量示例来学习如何完成任务。这些示例每次对话都要重新发送，消耗 Token。

```
无 Skill: 每次对话发送 ~2000 tokens 的示例
有 Skill: Skill 指令 ~500 tokens，一次加载，多次使用
节省: ~75% Token
```

**3. 经验无法积累**

Agent 完成一次成功的代码审查后，这些经验无法保存。下次审查还是从零开始。Skills 把成功经验固化下来，直接复用。

### 3.2 系统工程的需要

从工程角度看，Skills 解决了以下问题：

| 问题 | 无 Skills | 有 Skills |
|------|----------|----------|
| 能力复用 | 每个项目重写 | 一份 Skill 多处使用 |
| 质量一致性 | 依赖提示词稳定性 | 标准化流程保证质量 |
| 团队协作 | 靠文档传递经验 | Skill 文件即文档 |
| 版本管理 | 无 | 语义化版本，可回滚 |
| 测试验证 | 困难 | 可针对 Skill 编写测试 |

### 3.3 行业趋势

Skills 模式的兴起不是偶然，它反映了 AI 工程化的必然趋势：

- **从一次性到可复用**：企业不想每次都从零构建 Agent 能力
- **从黑盒到白盒**：需要明确知道 Agent 的行为策略
- **从单平台到跨平台**：Skills 作为开放标准，可以在不同框架间迁移
- **从个人到社区**：优秀的 Skill 可以被社区共享和改进

---

## 四、Skills 的核心价值

### 4.1 复用性

一个编写良好的 Skill 可以被不同 Agent、不同项目复用。

```
Skill: code_review
├── Agent A (前端项目) → 加载 code_review skill → 审查 React 代码
├── Agent B (后端项目) → 加载 code_review skill → 审查 Python 代码
└── Agent C (DevOps)   → 加载 code_review skill → 审查 CI/CD 配置
```

同一个 Skill，不同 Agent 根据各自上下文（C）自动适配。

### 4.2 可组合性

Skills 可以像乐高积木一样组合，形成更复杂的能力。

```yaml
# 组合多个 Skill 完成复杂任务
task: "准备发布"
skills:
  - code_review       # 先审查代码
  - test_generation   # 生成测试
  - changelog_update  # 更新变更日志
  - deployment_check  # 检查部署配置
```

每个 Skill 独立封装，互不干扰，但可以串行或并行执行。

### 4.3 社区共享

Skills 的开放标准催生了社区生态：

- **发布者**：将自己打磨的 Skill 分享给社区
- **使用者**：直接使用社区验证过的 Skill，无需从零构建
- **贡献者**：在现有 Skill 基础上改进，提交 Pull Request

这形成了类似 npm/PyPI 的生态循环：越多人使用 → 越多人贡献 → 质量越高 → 吸引更多用户。

### 4.4 Token 效率

Skills 通过**渐进式披露**（下一节详解）大幅减少 Token 消耗：

```
传统方式:
  系统提示 + 所有工具说明 + 完整指令 = ~8000 tokens

Skills 方式:
  Skill 摘要(第一阶段) = ~200 tokens
  需要时展开详细指令(第二阶段) = ~1500 tokens
  极少使用部分(第三阶段) = ~1000 tokens

平均节省: 60-70% Token
```

Token 效率的提升不仅降低成本，还提高了响应速度。

---

## 思考题

::: info 检验你的理解
1. **用四元组 S = (C, π, T, R) 描述一个"生成单元测试"的 Skill**，分别写出每个元素的具体内容。

2. **如果一个 Agent 已经有了 Function Calling 能力，为什么还需要 Skills？** 从确定性和效率两个角度分析。

3. **Skills 和 Plugin 的核心区别是什么？** 用你熟悉的编程框架类比来说明（例如 npm 包 vs 设计模式）。

4. **渐进式披露为什么能节省 Token？** 思考一下，在什么场景下这种节省最明显。
:::

---

## 本节小结

- ✅ **Skills 的本质是策略模块**——告诉 Agent 如何组合使用工具完成端到端任务
- ✅ **四元组 S = (C, π, T, R)** 提供了描述 Skill 的形式化框架：上下文、策略、工具、输出
- ✅ **Skills ≠ 提示词**，Skills 有工具绑定、边界约束、版本管理，是工程化的产物
- ✅ **Skills 存在的根本原因**是 LLM 的不确定性、Token 浪费和经验无法积累
- ✅ **核心价值**体现在复用性、可组合性、社区共享和 Token 效率四个方面

---

**下一步**: 理解了 Skills 的概念后，下一节我们将深入 Skills 的技术架构——SKILL.md 开放标准、渐进式披露机制和 Skill 生命周期。

---

[← 返回模块首页](/agent-ecosystem/09-agent-skills) | [继续学习:Skills 技术架构 →](/agent-ecosystem/09-agent-skills/02-skill-architecture)

---

[^1]: Anthropic Engineering Blog, "Introducing Skills as an Open Standard", December 2025. https://www.anthropic.com/engineering/skills-open-standard
[^2]: Agentic AI Foundation, "SKILL.md Specification v1.0", 2025. https://agentic-ai.org/specs/skill-md
