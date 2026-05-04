# Skills 技术架构

> **学习目标**: 掌握 SKILL.md 开放标准的规范细节、渐进式披露机制和 Skill 生命周期管理
>
> **预计时间**: 25 分钟
>
> **难度等级**: ⭐⭐⭐☆☆

---

## 一、SKILL.md 开放标准

### 1.1 标准的由来

2025 年 12 月，Anthropic 将 Skills 作为开放标准发布，采用 `SKILL.md` 作为 Skill 的标准载体[^1]。选择 Markdown 格式的理由：

- **人机可读**：开发者可以直接阅读和编辑，LLM 可以直接解析
- **版本控制友好**：纯文本，天然适配 Git
- **扩展性强**：YAML 前置元数据 + Markdown 正文，结构清晰

### 1.2 文件格式

一个 `SKILL.md` 文件由两部分组成：

```
SKILL.md
├── YAML 前置元数据 (Frontmatter) — 结构化的机器可读信息
│   name, version, tools, ...
└── Markdown 指令体 (Body) — 自然语言的任务策略
    步骤、约束、示例、错误处理...
```

#### 完整的 SKILL.md 示例

```yaml
---
# ============ 基础元信息 ============
name: code_review
version: 1.2.0
description: "审查 Pull Request 代码变更，生成结构化审查报告"
author: engineering-team
license: MIT
tags:
  - code-review
  - git
  - quality-assurance

# ============ 上下文约束 (Context) ============
scope:
  languages:
    - python
    - javascript
    - typescript
  max_files: 50
  max_file_lines: 1000
  min_coverage_threshold: 0.8

# ============ 工具依赖 (Tools) ============
tools:
  - name: git_diff
    description: "获取 PR 的变更内容"
    required: true
  - name: search_code
    description: "在代码库中搜索相关上下文"
    required: true
  - name: ast_parser
    description: "解析代码的抽象语法树"
    required: false
  - name: run_linter
    description: "运行代码风格检查"
    required: false

# ============ 输出规范 (Result) ============
output:
  format: markdown
  sections:
    - name: summary
      description: "变更概要和影响范围"
      required: true
    - name: critical
      description: "严重问题（安全漏洞、逻辑错误）"
      required: true
    - name: warnings
      description: "警告（性能问题、代码异味）"
      required: false
    - name: suggestions
      description: "改进建议（代码风格、可维护性）"
      required: false
---

# 代码审查 Skill

你是一个资深的代码审查专家。你的任务是审查 Pull Request 中的代码变更，
识别潜在问题并生成结构化的审查报告。

## 审查策略

按以下优先级执行审查：

### 第一步：了解变更范围

1. 调用 `git_diff` 获取变更的文件列表
2. 识别变更类型：新功能 / 修复 / 重构 / 配置变更
3. 确定影响范围和审查重点

### 第二步：安全审查

检查以下安全问题（最高优先级）：

- **SQL 注入**：检查拼接的 SQL 语句
- **XSS**：检查未转义的用户输入输出
- **硬编码密钥**：检查 API Key、密码等敏感信息
- **不安全的反序列化**：检查 `eval()`、`pickle.loads()` 等

### 第三步：逻辑审查

- 空指针 / null 引用风险
- 竞态条件和并发问题
- 资源泄露（未关闭的文件、数据库连接）
- 边界条件处理

### 第四步：质量审查

- 代码风格和命名规范
- 函数复杂度（嵌套层级、参数数量）
- 注释和文档完整性
- 测试覆盖率

## 输出格式

```markdown
## 审查报告

### 概要
- 文件数：X
- 变更行数：+X/-Y
- 问题数：严重 X / 警告 Y / 建议 Z

### 严重问题
- **[文件:行号]** 问题描述
  - 修复建议：...

### 警告
- **[文件:行号]** 问题描述
  - 改进建议：...

### 改进建议
- ...
```

## 约束

- 不要审查自动生成的代码（标记有 `@generated`）
- 跳过超过 1000 行的文件，标记为"需人工审查"
- 对不确定的问题标注"需确认"而非断言
- 不对代码风格问题标记为"严重"
```

### 1.3 YAML 前置元数据详解

#### 必需字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | Skill 的唯一标识符，使用 snake_case |
| `version` | string | 语义化版本号（SemVer） |
| `description` | string | 一句话功能描述 |

#### 推荐字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `author` | string | 作者或团队名称 |
| `license` | string | 开源许可证 |
| `tags` | string[] | 分类标签，用于搜索和过滤 |
| `scope` | object | 上下文约束（语言、文件类型、大小限制等） |
| `tools` | object[] | 所需工具列表及其描述 |
| `output` | object | 输出格式和结构规范 |
| `dependencies` | object[] | 依赖的其他 Skills |

#### 工具声明

每个工具条目的详细结构：

```yaml
tools:
  - name: tool_name          # 工具名称（必需）
    description: "工具功能"    # 功能描述（必需）
    required: true            # 是否必需（默认 true）
    type: mcp                 # 类型：mcp | function | api
    server: filesystem        # MCP 服务器名称（type=mcp 时）
    fallback: backup_tool     # 替代工具（当主工具不可用时）
```

`required: false` 的工具表示 Skill 可以在缺少该工具时降级运行。

### 1.4 Markdown 指令体详解

指令体是策略 π 的载体，包含以下典型部分：

```
# Skill 名称和角色设定
  → 告诉 Agent 扮演什么角色

## 执行策略
  → 步骤化的工作流程

### 第一步 / 第二步 / ...
  → 每步的具体操作

## 输出格式
  → 结果应该长什么样

## 约束
  → 不能做什么、边界在哪里

## 错误处理
  → 遇到异常怎么办
```

::: tip 指令体的编写原则
1. **步骤化**：用明确的步骤编号，不要写大段叙述
2. **优先级**：重要的事情放在前面
3. **具体化**：说"检查空指针"而不说"检查代码质量"
4. **可判定**：每个检查项应该有明确的判定标准
:::

---

## 二、渐进式披露机制

### 2.1 为什么需要渐进式披露

Agent 在运行时可能同时加载数十个 Skills。如果把每个 Skill 的完整指令都加载到上下文中，会消耗大量 Token。

```
10 个 Skills × 平均 1500 tokens/Skill = 15,000 tokens

即使上下文窗口足够大，15,000 tokens 的前置成本也不低：
  - 按 Claude 定价：约 $0.045/次请求
  - 每天 1000 次请求：$45/天
  - 每月：~$1,350
```

渐进式披露将 Skill 信息分为三个层级，按需加载。

### 2.2 三个阶段

```
┌─────────────────────────────────────────────────────────┐
│  第一阶段：注册 (Registration)                           │
│  内容：name + description + tags                         │
│  大小：~50-100 tokens/Skill                              │
│  时机：Agent 启动时加载所有 Skills 的注册信息              │
│  目的：让 Agent 知道"有哪些 Skills 可用"                  │
├─────────────────────────────────────────────────────────┤
│  第二阶段：激活 (Activation)                             │
│  内容：scope + tools + 核心策略摘要                       │
│  大小：~300-500 tokens/Skill                             │
│  时机：Agent 判断某个 Skill 可能与当前任务相关时加载       │
│  目的：让 Agent 判断"是否真的需要这个 Skill"               │
├─────────────────────────────────────────────────────────┤
│  第三阶段：执行 (Execution)                              │
│  内容：完整指令体 + 输出格式 + 错误处理                   │
│  大小：~1000-3000 tokens/Skill                           │
│  时机：Agent 确认使用该 Skill 时加载完整内容               │
│  目的：提供执行任务所需的全部信息                          │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Token 消耗对比

以一个加载 20 个 Skills、每次任务使用 2 个 Skills 的场景为例：

```
无渐进式披露:
  20 Skills × 1500 tokens = 30,000 tokens/次

渐进式披露:
  第一阶段: 20 Skills × 75 tokens = 1,500 tokens
  第二阶段: 5 Skills × 400 tokens = 2,000 tokens（可能相关的）
  第三阶段: 2 Skills × 1500 tokens = 3,000 tokens（实际使用的）
  总计: 6,500 tokens/次

节省: (30,000 - 6,500) / 30,000 = 78.3%
```

### 2.4 实现原理

```python
class SkillRegistry:
    """Skill 注册表，实现渐进式披露"""

    def __init__(self):
        self.skills = {}  # name -> Skill 对象

    def register(self, skill_path: str):
        """第一阶段：只加载元信息"""
        metadata = parse_frontmatter(skill_path)
        self.skills[metadata["name"]] = {
            "name": metadata["name"],
            "description": metadata["description"],
            "tags": metadata.get("tags", []),
            "path": skill_path,
            "loaded_level": 1  # 只加载了注册信息
        }

    def activate(self, skill_name: str):
        """第二阶段：加载工具依赖和策略摘要"""
        skill = self.skills[skill_name]
        if skill["loaded_level"] < 2:
            metadata = parse_frontmatter(skill["path"])
            skill["scope"] = metadata.get("scope", {})
            skill["tools"] = metadata.get("tools", [])
            skill["summary"] = extract_summary(skill["path"])
            skill["loaded_level"] = 2

    def execute(self, skill_name: str):
        """第三阶段：加载完整指令"""
        skill = self.skills[skill_name]
        if skill["loaded_level"] < 3:
            skill["full_instructions"] = read_full_body(skill["path"])
            skill["loaded_level"] = 3
```

---

## 三、标准目录结构

### 3.1 单个 Skill 的目录结构

```
code_review/
├── SKILL.md              # Skill 定义（必需）
├── README.md             # 面向开发者的文档
├── CHANGELOG.md          # 版本变更记录
├── examples/             # 示例
│   ├── python_pr.yaml    # Python PR 审查示例
│   └── react_pr.yaml    # React PR 审查示例
├── tests/                # 测试
│   ├── test_skill.py     # Skill 加载测试
│   └── fixtures/         # 测试固件
│       ├── sample_diff.txt
│       └── expected_report.md
└── extensions/           # 扩展（可选）
    ├── security_scan.md  # 安全扫描扩展
    └── perf_check.md     # 性能检查扩展
```

### 3.2 Skills 集合的目录结构

一个项目中可能有多个 Skills，按以下结构组织：

```
.claude/skills/
├── core/                     # 核心 Skills
│   ├── code_review/
│   │   └── SKILL.md
│   ├── test_generation/
│   │   └── SKILL.md
│   └── documentation/
│       └── SKILL.md
├── domain/                   # 领域特定 Skills
│   ├── frontend_review/
│   │   └── SKILL.md
│   └── api_design/
│       └── SKILL.md
└── custom/                   # 用户自定义 Skills
    └── my_skill/
        └── SKILL.md
```

### 3.3 全局 vs 项目级 Skills

```
~/.claude/skills/            # 全局 Skills（所有项目可用）
├── git_operations/
│   └── SKILL.md
└── web_search/
    └── SKILL.md

project/.claude/skills/      # 项目级 Skills（仅当前项目）
├── code_review/
│   └── SKILL.md
└── deploy/
    └── SKILL.md
```

项目级 Skills 优先级高于全局 Skills。当同名时，使用项目级的版本。

---

## 四、Skill 生命周期

### 4.1 完整流程

```
编写 → 注册 → 发现 → 激活 → 执行 → 反馈 → 迭代
  │      │      │      │      │      │      │
  │      │      │      │      │      │      └→ 更新版本，修复问题
  │      │      │      │      │      └→ 收集执行结果和用户评价
  │      │      │      │      └→ 加载完整指令，执行任务
  │      │      │      └→ Agent 判断可能需要，加载摘要
  │      │      └→ Agent 扫描注册表，匹配任务需求
  │      └→ 加载元信息到 Skill 注册表
  └→ 创建 SKILL.md 文件和相关资源
```

### 4.2 各阶段详解

#### 编写阶段

```bash
# 创建 Skill 目录
mkdir -p .claude/skills/code_review/examples

# 编写 SKILL.md
vim .claude/skills/code_review/SKILL.md
```

编写时需要关注：
- 元信息的完整性（name、version、description 必填）
- 工具声明的准确性（required 标记是否正确）
- 指令体的可执行性（步骤是否清晰、判定标准是否明确）

#### 注册阶段

Agent 启动时自动扫描 Skills 目录：

```python
def scan_skills(base_path: str) -> SkillRegistry:
    """扫描目录，注册所有 Skills"""
    registry = SkillRegistry()

    # 扫描全局 Skills
    global_path = Path.home() / ".claude" / "skills"
    for skill_dir in global_path.iterdir():
        skill_file = skill_dir / "SKILL.md"
        if skill_file.exists():
            registry.register(str(skill_file))

    # 扫描项目级 Skills（优先级更高）
    project_path = Path(base_path) / ".claude" / "skills"
    for skill_dir in project_path.iterdir():
        skill_file = skill_dir / "SKILL.md"
        if skill_file.exists():
            registry.register(str(skill_file))  # 覆盖同名全局 Skill

    return registry
```

#### 发现阶段

Agent 根据用户请求匹配相关 Skills：

```
用户: "帮我审查一下这个 PR"

Agent 内部推理:
  1. 关键词: "审查"、"PR" → 匹配 tags: ["code-review", "git"]
  2. 候选 Skills: code_review (匹配度 0.92)
  3. 进入激活阶段
```

#### 激活阶段

加载 Skill 的工具依赖和策略摘要，检查前置条件：

```python
def check_readiness(skill: Skill, available_tools: list) -> tuple[bool, str]:
    """检查 Skill 是否可以执行"""
    missing = []
    for tool in skill.tools:
        if tool.required and tool.name not in available_tools:
            missing.append(tool.name)

    if missing:
        return False, f"缺少必需工具: {', '.join(missing)}"
    return True, "就绪"
```

#### 执行阶段

加载完整指令，按策略执行：

```
1. 注入角色设定（"你是一个资深的代码审查专家"）
2. 按步骤执行（安全审查 → 逻辑审查 → 质量审查）
3. 按输出格式生成结果
4. 遵守约束（跳过自动生成代码、不标记风格问题为严重）
```

#### 反馈阶段

收集执行数据用于后续改进：

```yaml
# 执行日志
execution_log:
  skill: code_review
  version: 1.2.0
  duration: 12.3s
  tokens_used: 3500
  tools_called:
    - git_diff: 1 次
    - search_code: 5 次
    - run_linter: 3 次
  result_quality:
    issues_found: 7
    false_positives: 1
    user_rating: 4/5
```

#### 迭代阶段

根据反馈数据更新 Skill：

- 发现误报 → 调整策略描述，增加排除条件
- 遗漏问题 → 增加检查步骤
- 执行缓慢 → 优化工具调用顺序
- 更新版本号 → `1.2.0` → `1.2.1`（修复）/ `1.3.0`（新增功能）

### 4.3 版本管理

Skill 版本遵循语义化版本规范：

```
MAJOR.MINOR.PATCH

MAJOR: 不兼容的 API 变更
  例：改变了输出格式结构，旧的使用者需要适配

MINOR: 向后兼容的功能新增
  例：新增一种语言的支持

PATCH: 向后兼容的问题修复
  例：修复误报率、优化提示词
```

```yaml
# 依赖声明
dependencies:
  - name: search_code
    version: ">=1.0.0 <2.0.0"  # 兼容 1.x
  - name: ast_parser
    version: "~2.1.0"           # 兼容 2.1.x
```

---

## 思考题

::: info 检验你的理解
1. **渐进式披露的三个阶段分别解决了什么问题？** 如果去掉第二阶段（激活），会有什么后果？

2. **`required: false` 的工具有什么意义？** 举一个具体的例子说明什么情况下应该标记为 false。

3. **如果一个 Skill 的输出格式变更了（例如增加了一个新字段），版本号应该怎么升？** 为什么？

4. **项目级和全局级 Skills 的优先级设计是否合理？** 思考一下，有没有可能导致意外的场景。
:::

---

## 本节小结

- ✅ **SKILL.md 标准**由 YAML 前置元数据（机器可读）和 Markdown 指令体（策略载体）组成
- ✅ **渐进式披露**通过注册→激活→执行三阶段，将平均 Token 消耗降低 60-80%
- ✅ **标准目录结构**区分全局和项目级 Skills，支持版本管理和依赖声明
- ✅ **Skill 生命周期**包含编写、注册、发现、激活、执行、反馈、迭代七个阶段

---

**下一步**: 了解了 Skills 的技术架构后，下一节我们将对比三大主流框架（Claude Code、CrewAI、LangChain）的 Skills 实现，看看不同框架如何理解和落地这个概念。

---

[← 返回模块首页](/agent-ecosystem/09-agent-skills) | [继续学习:主流框架的 Skills 实现 →](/agent-ecosystem/09-agent-skills/03-skill-frameworks)

---

[^1]: Anthropic Engineering Blog, "Skills as an Open Standard", December 2025. https://www.anthropic.com/engineering/skills-open-standard
[^2]: Agentic AI Foundation, "SKILL.md Specification v1.0", 2025. https://agentic-ai.org/specs/skill-md
