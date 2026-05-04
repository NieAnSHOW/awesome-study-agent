# 跨框架互操作性与标准融合

> SKILL.md 从 Claude 独有走向跨平台标准，面临适配层设计、语义鸿沟与标准化边界的深层工程挑战 | 预计阅读时间：35 分钟

---

## 一、引言

基础模块的最后一节以"SKILL.md 走向融合"收尾，提出了 Skills 开放标准化的愿景。但在那个阶段，我们讨论的是"愿景"而非"工程现实"。2026 年 4 月的今天，这个愿景正在加速变为现实——但同时也暴露出了从"一个框架的标准"到"行业通用的标准"之间存在的深层工程挑战。

互操作性（Interoperability）在软件工程中从来不是一个简单的问题。从 CORBA 到 REST，从 SOAP 到 gRPC，每一次"标准统一"的尝试都伴随着折中与妥协。Skill 标准化面临的挑战更加独特：它要统一的不是"数据格式"或"通信协议"，而是**不同框架对"AI 应该如何执行一个任务"的理解方式**——这是一个涉及认知偏差、执行策略、安全策略等多个层面的复杂问题。

本章将沿着"标准演进 → 行业实践 → 适配层实现 → 深层挑战 → 前景展望"的路径，系统分析 Skills 跨框架互操作性的现状、问题与趋势。

---

## 二、SKILL.md 标准演进路线

SKILL.md 从一个 Claude Code 内部配置文件到开放标准的演进，经历了五个关键版本。每个版本都反映了社区需求、生态压力和设计理念的演进。

### 完整时间线

```
2025.09 ── Draft（草案）    ── 初始设计，仅 Claude Code 内部使用
2025.10 ── v0.5（预览版）   ── 开放讨论，首个社区反馈版本
2025.11 ── v0.9（候选版）   ── 功能冻结，协议稳定性验证
2025.12 ── v1.0（正式版）   ── 开放标准发布，企业级特性加入
2026.02 ── v1.1 Draft       ── 下一阶段演进，聚焦跨框架兼容
```

### 2025.09 Draft：从内部配置到草稿

Draft 版本的核心目的是**让 Claude Code 的 Skills 功能从内部实验走向更广泛的开发社区验证**。这个版本的 SKILL.md 仅有 8 个 YAML 字段——name、version、description、tools、scope、output、dependencies、examples——以及一段自由格式的 Markdown 指令体。

关键决策：**使用 Markdown + YAML，而非 JSON 或 TOML**。这个决策的核心理由是：Skill 的执行策略包含大量自然语言指令，Markdown 提供了最自然的人类可读格式。如果使用 JSON，指令体将被嵌套在字符串中，可读性和可编辑性大幅降低。

> 当时的讨论中有过一个提议：使用 YAML 描述所有内容，包括执行策略，让整个 SKILL.md 完全是结构化的。这个提案被否决了，理由是 "策略是人类写给 AI 读的，不是机器解析的配置" —— 这个理念奠定了 SKILL.md "两段式"设计的基础。

### 2025.10 v0.5：社区的第一次冲击

v0.5 是第一个公开发布供社区测试的版本。社区反馈主要集中在三个方面：

1. **scope 字段不足**：原始 scope 只有 `languages` 和 `directories`，社区要求增加 `branches`、`file_patterns`、`tags` 等更灵活的匹配维度。v0.5 中增加了 `branches`。

2. **工具声明的歧义**：原始设计中 `tools` 只声明工具名称，没有区分"必需"和"可选"。这导致 Agent 在不具备某些工具时做出不可预期的降级行为。v0.5 引入了 `required` 和 `optional` 的子字段划分。

3. **缺少安全声明**：企业用户提出，一个只知道需要什么工具的 Skill 无法通过安全审核——必须明确声明"这个 Skill 会做什么"和"这个 Skill 不会做什么"。这推动了 v0.9 中 `security` 字段的引入。

### 2025.11 v0.9：企业级需求的涌入

v0.9 是一个功能冻结版本，核心变更几乎全部源于企业用户的需求：

- **security 字段**：`no_network`、`no_file_write`、`no_command_execution`、`data_retention` 等安全声明字段的加入，使得企业安全团队可以在不审查 Markdown 内容的情况下评估 Skill 的风险等级。

- **execution 字段**：`mode`（sync/async）、`timeout`、`retry`、`concurrency_limit` 等执行参数的标准化，使得 Skill 的运行时行为可以脱离具体框架独立声明。

- **output 结构化**：从简单的"字段列表"升级为具有 `required`/`optional` 区分和 `constraints` 约束的结构化输出定义。

### 2025.12 v1.0：开放标准发布

v1.0 是 SKILL.md 作为开放标准的正式版本，也是决定 SKILL.md 是"Claude 内部格式"还是"行业标准"的关键里程碑。与 v0.9 相比，v1.0 的功能变更不大，但意义重大：

- **标准化流程**：建立了 IETF-style 的标准更新流程（RFC-style 提案、评审、投票）
- **品牌独立**：标准网站 [agentskills.io](https://agentskills.io) 上线，Anthropic 承诺标准将中立治理
- **参考实现**：发布了参考实现（Reference Implementation），包括 Schema 验证器和示例解析器
- **微软支持声明**：微软在 v1.0 发布当天宣布将在 VS Code 和 GitHub 中集成 SKILL.md 支持

### 2026.02 v1.1 Draft：跨框架兼容

v1.1 草案的推动力来源于 CrewAI SKILL.md 导入器的开发经验——标准在向其他框架迁移时暴露出了以下问题：

1. **执行策略的"主体"不明确**：自然语言的指令体假设"执行主体是 LLM"，但 CrewAI 和 LangChain 的执行主体是代码。v1.1 草案中提出了一个可选的 `execution_mode` 字段来声明策略的执行主体类型。

2. **缺少框架无关的条件表达**：SKILL.md 唯一支持条件判断的方式是自然语言"如果...那么..."，这对代码框架的导入造成了困难。v1.1 草案探索引入 `flow` 字段，使用 YAML 结构表达基本条件分支。

3. **工具声明的框架绑定问题**：`tools` 字段目前使用工具名称，但不同框架中同名工具可能有不同的接口签名。v1.1 草案规划引入工具签名标识（Tool Signature Identifier），使得工具声明独立于具体框架。

::: tip v1.1 草案的争议
v1.1 草案中的 `flow` 字段是最具争议的提案。支持者认为它解决了"指令体黑盒"的问题；反对者则认为结构化条件表达会让 SKILL.md 变得过于复杂，破坏其"人类可读"的核心优势。截至 2026 年 4 月，这个提案仍在讨论中。
:::

---

## 三、微软 VS Code / GitHub 集成实践

微软是 SKILL.md 标准最重要的外部支持者之一。2025 年 12 月 v1.0 发布时，微软同时宣布了在 VS Code 和 GitHub 两个产品线中的集成计划。

### 3.1 VS Code 的 Claude Code 扩展中的 Skill 面板

VS Code 通过 Claude Code 扩展（2026 年 1 月发布）集成了 Skill 管理面板。这个面板提供了三层功能：

**浏览层（Browse）**：

- 项目 Skill 目录树：在 VS Code 侧边栏中展示 `.claude/skills/` 目录结构
- Skill 详情预览：点击任意 Skill 文件时，在右侧面板渲染其 YAML 元数据摘要和 Markdown 指令体
- 错误提示：Schema 验证错误会以 VS Code 原生问题面板的形式展示（红色波浪线标记）

**编辑层（Edit）**：

- 可视化表单编辑：对于 YAML 前置元数据，VS Code 提供了表单编辑模式，开发者无需手写 YAML
- 自动补全：`name`、`version`、`tools` 等字段支持自动补全和建议
- 内联验证：保存时自动运行 Schema 校验和兼容性检查

**调试层（Debug）**：

- Skill 执行追踪：当 Claude Code Agent 执行某个 Skill 时，VS Code 的调试控制台会显示"哪个 Skill 被激活了、为什么被激活、执行了多长时间"
- 热重载：修改 SKILL.md 后无需重启 Agent，修改即时生效

### 3.2 GitHub Actions 中的 Skill 编排能力

GitHub Actions 的 Skill 集成是更值得关注的发展方向——它将 Skills 从"开发环境"扩展到了"CI/CD 流水线"。

在 GitHub Actions 中，一个 SKILL.md 可以被直接引用为一个 Action 步骤：

```yaml
# .github/workflows/pr-review.yml
name: Automated PR Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run code review skill
        uses: anthropic/skills-action@v1
        with:
          skill-path: .claude/skills/code_review/SKILL.md
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

这个编排能力的背后，是 GitHub Actions 团队实现的一个"Skill 运行时"（Skill Runtime）——一个轻量化的执行环境，能够解析 SKILL.md、解析工具声明、调用对应的 API 并执行策略指令。

这个运行时与 Claude Code 的运行时不同：

| 特性 | Claude Code 运行时 | GitHub Actions 运行时 |
|------|-------------------|---------------------|
| 执行主体 | LLM Agent | 预编译的 Node.js 程序 |
| 策略理解方式 | 阅读理解 Markdown | 解析结构化字段 + 预置行为 |
| 工具调用范围 | 所有 MCP 工具 | GitHub API + Actions |
| 确定性 | 依赖于 LLM | 100% 确定（代码级） |
| 输出处理 | 自然语言回复 | JSON 结构化输出 |

GitHub Actions 运行时对 SKILL.md 的解析策略是 "只信任结构化字段"：YAML 前置元数据中的 `tools`、`output`、`execution` 等字段被精确解析和执行，而 Markdown 指令体仅作为**执行策略的参考注释**——实际执行逻辑由 GitHub 预置的 Skill 处理器（Skill Handler）接管。

### 3.3 微软在 MCP + Skills 双标准上的战略布局

微软同时押注 MCP（Model Context Protocol）和 SKILL.md 两个开放标准，这并非巧合。从微软的战略视角看：

- **MCP 是"接口层"标准**：定义 AI Agent 如何发现和调用工具。MCP 解决了"工具互通"的问题——不同厂商的工具可以基于 MCP 协议被统一的 Agent 调用。

- **SKILL.md 是"策略层"标准**：定义 AI Agent 如何组织和编排这些工具来完成一个任务。SKILL.md 解决了"策略互通"的问题——同一个 Skill 定义可以被不同厂商的 Agent 理解。

微软的战略逻辑是：**如果 MCP 和 SKILL.md 都成为行业标准，那么微软的 GitHub Copilot、VS Code、Azure AI Studio 可以无缝地纳入来自任何生态的工具和策略**。这与微软在 PC 时代的"Wintel"联盟策略一脉相承——通过标准化接口（操作系统/协议）统一生态。

::: info 微软双标准的实际效果
2026 年 2 月，GitHub 发布了 Skills Showcase 页面，其中展示了 50 多个预制的 Skill 模板，涵盖代码审查、文档生成、测试自动化等场景。这些模板统一使用 SKILL.md 格式，可在 VS Code、GitHub Actions、Azure AI Studio 三个平台上跨平台使用。
:::

---

## 四、CrewAI/LangChain 适配层对比

当 SKILL.md 标准需要被 CrewAI 和 LangChain 这两个"非 Claude"框架消费时，适配层（Adapter Layer）的设计就成为跨越"标准定义"和"实际使用"之间鸿沟的关键。

### 4.1 CrewAI SKILL.md 导入器架构

CrewAI 于 2026 年 1 月发布的导入器采用**运行时适配（Runtime Adaptation）**模式：

```python
from crewai.skill_import import SkillMarkdownImporter
from crewai.skill import SkillConfig

class MarkdownToCrewAIAdapter:
    """
    运行时适配：在 SKILL.md 被加载时动态转换为 CrewAI 的 SkillConfig。
    不产生中间文件，不生成代码。
    """

    def adapt(self, md_path: str) -> SkillConfig:
        # 1. 解析 YAML 前置元数据
        metadata = self._parse_frontmatter(md_path)

        # 2. 映射元数据
        config = SkillConfig(
            name=metadata["name"],
            domain=self._infer_domain(metadata),
            tools=self._resolve_tools(metadata.get("tools", {})),
            # Markdown 指令体作为文档字符串保留
            documentation=self._extract_instruction_body(md_path),
        )

        # 3. 注册到全局 Registry
        SkillRegistry.register(config)
        return config

    def _infer_domain(self, metadata: dict) -> str:
        """从 scope.languages 推断领域"""
        langs = metadata.get("scope", {}).get("languages", [])
        domain_map = {
            "python": "software_engineering.python",
            "typescript": "software_engineering.typescript",
            # ...
        }
        primary = langs[0] if langs else "general"
        return domain_map.get(primary, "general")
```

运行时适配的核心设计决策是"中间表示（IR）共用"：既不把 SKILL.md 翻译成 Python 代码，也不保留原始格式，而是在内存中构造一个 `SkillConfig` 对象，由 CrewAI 的 Agent 运行时直接消费。

**优势**：不需要代码生成步骤，实现轻量，加载速度快。
**劣势**：每次启动都要重新解析和适配；无法利用编译期优化；Markdown 指令体在运行时被降级为纯文档。

### 4.2 LangChain 社区转换工具

社区驱动的 `skill-to-langgraph` 工具采用了不同的策略——**编译期转换（Compile-time Transformation）**：

```python
# skill-to-langgraph 的核心流程
from skill_to_langgraph import SkillToGraphConverter

converter = SkillToGraphConverter()

# 第一步：解析为抽象语法树（AST）
skill_ast = converter.parse("path/to/SKILL.md")

# 第二步：生成中间表示（IR）
skill_ir = converter.to_intermediate_representation(skill_ast)

# 第三步：输出 LangGraph Python 代码
generated_code = converter.to_langgraph_code(skill_ir)

# 第四步：写入文件
with open("generated_skills/code_review.py", "w") as f:
    f.write(generated_code)
```

编译期转换的目标是：**一次转换，永久使用**。转换后的代码可以像手写代码一样被版本控制、代码审查和优化。

### 4.3 两者的核心差异

| 维度 | CrewAI 导入器（运行时适配） | LangChain 社区工具（编译期转换） |
|------|---------------------------|-------------------------------|
| **转换时机** | 运行时加载时动态适配 | 离线时一次转换，生成代码后使用 |
| **产物形态** | 内存中的配置对象 | 可写入文件的 Python 代码 |
| **版本控制** | 不需要（无产物） | 转换后代码可纳入 Git |
| **优化空间** | 无（每次加载即时适配） | 可在转换后手动优化生成的代码 |
| **LLM 理解深度** | 仅解析结构化字段 | 尝试理解自然语言指令 |
| **成熟度** | 官方支持，2026.01 发布 | 社区维护，beta 阶段 |

这两种设计代表了两个极端：CrewAI 追求"零成本集成"（不需要额外步骤），LangChain 社区追求"深度集成"（转换后的代码可被开发者完全控制）。中间地带——例如"运行时缓存 + 部分转换"的方案——目前还没有框架实现。

---

## 五、Skill 转换工具链与语义鸿沟

### 5.1 什么是语义鸿沟

语义鸿沟（Semantic Gap）是指不同框架对"执行策略"的理解差异——同样的一段"策略描述"，在不同框架中的含义和可执行性完全不同。

以 SKILL.md 中的以下策略描述为例：

```markdown
## 执行策略

1. 对每个变更文件：
   a. 读取文件内容
   b. 检查安全漏洞
   c. 如果发现严重漏洞，停止当前审查并发出警报
   d. 否则继续检查代码质量
```

这段描述在四个框架中的理解：

| 框架 | 对"对每个"的理解 | 对"如果...否则"的理解 | 对"发出警报"的理解 |
|------|-----------------|---------------------|-----------------|
| Claude Code | LLM 自主决定如何迭代 | LLM 理解条件逻辑 | LLM 自行决定警报形式 |
| CrewAI | 需要手动编写循环 | 需要手动编码 if-else | 需要实现 alert 方法 |
| LangChain | 图结构表达迭代 | `add_conditional_edges` | 调用 alert 工具节点 |
| Coze | 拖拽循环节点 | 拖拽条件分支节点 | 配置通知节点 |

这个例子说明：**同样的"策略意图"，经过不同框架的"语义转换"后，变成了完全不同的执行逻辑**。这就是语义鸿沟的本质——策略意图和执行语义之间的鸿沟。

### 5.2 当前转换工具的局限

基于对 CrewAI 导入器和 `skill-to-langgraph` 的实际测试，当前转换工具的局限主要体现在：

**局限一：条件分支丢失**

CrewAI 导入器完全忽略 Markdown 指令体中的条件分支逻辑，仅将其保留为文档字符串。这意味着经过导入的 Skill 失去了"条件判断"的能力——它们在运行时表现为线性执行序列，而非包含分支逻辑的策略。

**局限二：状态管理语义丢失**

LangChain 的 Skill 子图包含显式的状态类型定义（`TypedDict`），但 SKILL.md 完全不声明状态数据结构。`skill-to-langgraph` 在转换时只能根据指令体的自然语言描述"推断"状态结构，准确率约 60-70%。

**局限三：循环语义不精确**

SKILL.md 中的"对每个文件"、"重复执行直到条件满足"等循环语义，在自然语言中看似清晰，但在转换到代码时缺乏精确的循环边界和终止条件定义。转换工具或者生成一个"固定次数"的循环（不精确），或者生成一个注释要求开发者手动填写（不完善）。

### 5.3 转换工具设计原则

基于前述分析，一个理想的跨框架 Skill 转换工具应该遵循以下设计原则：

**原则一：保底策略（Graceful Degradation）**

当转换工具无法精确翻译某个执行策略时，不应静默地丢失语义。应该：
- 生成一个"待办注释"（TODO comment），标注需要人工介入的位置
- 在转换报告中记录转换不完整的策略段落
- 提供默认的降级行为（如将"条件分支"降级为"串行执行"）

**原则二：语义保留（Semantic Preservation）**

转换工具应该区分"语义等价"和"语法等价"：
- 只要目标的执行效果与源相同，就是好的转换
- 不追求 Markdown 中的措辞与目标代码一一对应
- 例：Markdown 中的"发出警报"可以转换为 `alert()` 函数调用、发送 Slack 消息、或创建 GitHub Issue，都算语义保留

**原则三：双向可逆（Bidirectional）**

理想的转换工具应该支持"SKILL.md → 框架代码"和"框架代码 → SKILL.md"双向转换。这确保开发者可以自由地在"声明式标准格式"和"框架原生格式"之间切换，不受锁定的风险。当前没有任何工具实现完全的逆向转换。

---

## 六、标准化的边界在哪里

### 6.1 哪些应该标准化

基于 SKILL.md 的应用经验和转换工具的实际反馈，以下层面**适合也应当**标准化：

**元信息**：name、version、description — 这些是 Skill 的身份信息，在任何框架中含义相同。

**工具声明**：required_tools、optional_tools — 工具依赖的声明机制应该统一，但工具的运行时绑定（哪个具体的 API 被调用）可以留给框架。

**输出格式**：output.sections 的结构化定义 — 输出 Schema 的标准化使得不同框架产生的 Skill 执行结果可以被同一套验证工具消费。

**安全约束**：security 字段的基本声明 — 无论哪个框架，no_network 的含义都是一样的。这使得安全审核可以跨框架进行。

**兼容性元信息**：`dependencies` 中与框架无关的依赖声明（如运行时版本、语言版本）。

### 6.2 哪些应留给框架

以下层面**不应标准化**，而应留给框架各自实现：

**执行引擎**：LLM 自主理解（Claude Code）、方法调用（CrewAI）、图遍历（LangChain）、引擎解释执行（Coze）——每种执行模型都有自己的优势和适用场景，统一执行引擎既不可能也不合理。

**调度策略**：重试策略、超时处理、并发控制——这些与具体框架的运行时能力相关，标准化会限制框架的创新空间。

**容错机制**：降级策略、熔断机制、错误恢复——不同的框架和应用场景对容错的要求不同，标准化会导致要么过于严格（限制了使用场景）要么过于宽松（失去了容错的意义）。

**调试和可观测性接口**：每个框架有自己独特的调试工具链（LangSmith、CrewAI 日志、Coze 监控面板），标准化调试接口反而会限制这些工具的发展。

### 6.3 2026 年框架融合趋势预测

基于目前的技术趋势和行业动态，我们可以对 2026 年下半年的 Skills 框架融合做以下预测：

**趋势一：SKILL.md 成为"通用互换格式"**

SKILL.md 将扮演类似 JSON 在 API 生态中的角色——它是"传输格式"而非"执行格式"。各个框架都会支持 SKILL.md 的导入导出，但内部执行时各自转换为自己原生的格式。

**趋势二：结构化执行策略的出现**

v1.1 草案中提议的 `flow` 字段或其他形式的"结构化策略表达"将被越来越多地采纳。这不是要替代 Markdown 指令体（保留作为人类可读的"注释"），而是为机器可读的执行策略提供一个基础层。

**趋势三：转换工具的成熟**

到 2026 年底，我们有望看到首个支持"双向转换"并且条件分支保留率达到 80% 以上的转换工具。这需要结合 LLM 的自然语言理解能力和代码生成能力——也许转换工具本身就是一个 Agent。

**趋势四：生态分化加速**

标准化不意味着所有框架趋同。恰恰相反，标准化的基础元信息释放了框架在"如何执行 Skill"上的创新空间。我们可以预期更多差异化的框架出现：专注于低代码的、专注于高性能的、专注于安全合规的——它们基于统一的标准元信息互相交换 Skill，但执行方式截然不同。

---

## 七、实战示例：同一个代码审查 Skill 在四个框架中的实现

下面展示同一个"检查 Python 代码是否符合 PEP 8 标准"的简单 Skill，在四个框架中的不同实现方式。这个对比直观地体现了"同一个策略意图，四种执行语义"。

### Claude Code（SKILL.md）

```yaml
---
name: pep8_check
version: 1.0.0
description: "检查 Python 代码是否符合 PEP 8 编码规范"
scope:
  languages: [python]
  directories: [src/, tests/]
tools:
  required: [list_files, read_file, run_linter]
output:
  sections:
    - name: violations
      description: PEP 8 违规列表
      required: true
---
## 执行策略

1. 使用 `list_files` 获取目标目录中的 Python 文件列表
2. 对每个 Python 文件：
   a. 使用 `run_linter`（pycodestyle）检查
   b. 读取违规文件查看上下文
3. 汇总违规情况，按严重程度排序
4. 输出结构化报告
```

### CrewAI（装饰器）

```python
@skill(
    name="pep8_check",
    domain="software_engineering.python",
    version="1.0.0",
    description="检查 Python 代码是否符合 PEP 8 编码规范",
    tools=[ListFilesTool, ReadFileTool, PycodestyleTool],
    reasoning="chain_of_thought",
)
class PEP8CheckSkill:
    """检查 Python 代码是否符合 PEP 8 编码规范"""

    def check_directory(self, path: str = "src/") -> list[dict]:
        violations = []
        files = self.tools.list_files.run(path, pattern="*.py")
        for file in files:
            result = self.tools.pycodestyle.run(file)
            if result.violations:
                context = self.tools.read_file.run(file)
                for v in result.violations:
                    v["context"] = self._get_surrounding_lines(context, v["line"])
                violations.extend(result.violations)
        return sorted(violations, key=lambda v: v["severity"])
```

### LangChain（状态图）

```python
class PEP8State(TypedDict):
    target_dir: str
    python_files: list[str]
    current_file: str
    violations: list[dict]
    report: str

def create_pep8_skill() -> StateGraph:
    graph = StateGraph(PEP8State)

    graph.add_node("list_files", list_python_files)
    graph.add_node("check_file", run_pycodestyle)
    graph.add_node("read_context", read_violation_context)
    graph.add_node("generate_report", create_report)

    # 对每个文件循环检查
    graph.add_conditional_edges(
        "check_file",
        lambda s: "next" if s.current_file else "done",
        {"next": "read_context", "done": "generate_report"}
    )

    graph.set_entry_point("list_files")
    graph.set_finish_point("generate_report")
    return graph.compile()
```

### 扣子 2.0（可视化工作流）

在扣子 2.0 中，上述逻辑通过以下节点序列实现：

```
[定时触发器] → [代码节点: 列出 .py 文件] 
    → [循环开始: 对每个文件] 
        → [工具节点: 执行 pycodestyle] 
        → [条件分支: 有违规?] 
            ├── 是 → [代码节点: 读取上下文] → [循环结束]
            └── 否 → [循环结束]
    → [LLM 节点: 汇总违规报告]
    → [输出节点: 生成报告]
```

这个例子清晰地体现了四框架的差异化定位：
- **Claude Code** 最简洁，但"对每个文件"的循环和"条件分支"完全依赖 LLM 的理解
- **CrewAI** 最精确，循环和异常处理在 Python 代码级别显式控制
- **LangChain** 最有结构，状态类型和条件边使得执行路径可编程且可测试
- **扣子 2.0** 最可视化，节点拖拽让非技术人员也能理解和修改流程

---

## 思考题

::: info 检验你的理解

1. SKILL.md v1.1 草案中提议的 `flow` 字段（结构化条件表达）引发了"增加机器可读性 vs 破坏人类可读性"的争议。你认为应该如何在两者之间取得平衡？是否可能有一种"对机器友好也对人友好"的表达方式？

2. GitHub Actions 的 Skill 运行时只解析 SKILL.md 的结构化字段，将 Markdown 指令体降级为"参考注释"。这种设计对 Skill 的可移植性有什么影响——它是否意味着同一个 SKILL.md 在 Claude Code 和在 GitHub Actions 中"不是一个 Skill"？

3. CrewAI 的"运行时适配"和 LangChain 社区的"编译期转换"代表了适配层设计的两种极端。你认为是否存在一种"中间方案"可以在"零成本集成"和"深度集成"之间取得平衡？

4. 预测一下：2027 年的 Skills 生态会是什么样？SKILL.md 会成为类似 Dockerfile 那样的"业界通用格式"吗？还是会出现多个互相竞争的标准（类似 Kubernetes vs Docker Swarm）？你的判断依据是什么？

:::

---

## 本章小结

- SKILL.md 标准从 2025.09 的 Draft 到 2026.02 的 v1.1 Draft，经历了五次重要迭代，每版变更都反映了社区和企业的真实需求
- 微软在 VS Code 和 GitHub Actions 中对 SKILL.md 的集成，标志着 Skill 从"开发环境"扩展到"CI/CD 流水线"
- CrewAI 的运行时适配和 LangChain 社区的编译期转换代表了两种不同的互操作性实现哲学
- 语义鸿沟——不同框架对"执行策略"理解的差异——是当前跨框架 Skill 迁移的最大障碍
- 标准化的边界应当是"元信息 + 工具声明 + 输出格式"，而执行引擎、调度策略、容错机制应留给框架
- 2026 年的趋势预测：SKILL.md 将成为"通用互换格式"，结构化策略表达和双向转换工具将趋于成熟

---

## 参考资料

- [Anthropic. (2025-2026). Agent Skills Open Standard - Changelog & Version History.](https://agentskills.io/changelog) — SKILL.md 标准版本历史
- [Microsoft. (2026). VS Code Claude Code Extension - Skill Panel Documentation.](https://code.visualstudio.com/docs/claude-code/skills) — VS Code Skill 面板文档
- [GitHub. (2026). Actions Skill Runtime - Running SKILL.md in CI/CD.](https://docs.github.com/en/actions/using-skills) — GitHub Actions Skill 运行时
- [CrewAI. (2026). SKILL.md Importer Architecture.](https://docs.crewai.com/skills/import) — CrewAI 导入器架构文档
- [skill-to-langgraph. (2026). GitHub Repository.](https://github.com/langchain-community/skill-to-langgraph) — LangChain 社区转换工具
- [Fowler, M. (2004). Inversion of Control Containers and the Dependency Injection Pattern.](https://martinfowler.com/articles/injection.html) — 适配层模式参考
- [Knuth, D. E. (1984). Literate Programming. The Computer Journal, 27(2), 97-111.](https://doi.org/10.1093/comjnl/27.2.97) — 关于"人类可读"与"机器可读"的早期探索，与 SKILL.md 的设计哲学一脉相承
