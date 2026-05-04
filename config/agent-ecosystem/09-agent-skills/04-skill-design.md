# Skill 设计与实战

> **学习目标**: 掌握 Skill 的设计原则，能够独立编写生产级 SKILL.md 文件
>
> **预计时间**: 35 分钟
>
> **难度等级**: ⭐⭐⭐☆☆

---

## 一、设计原则

### 1.1 单一职责

一个 Skill 只做一件事。

**反面案例**：

```yaml
name: everything_dev
description: "代码审查、测试生成、部署、监控、日志分析"
tools:
  - git_diff
  - pytest
  - docker
  - kubernetes
  - prometheus
  - elasticsearch
```

这个 Skill 试图做所有事情，结果是：
- Agent 不知道当前应该用哪个工具
- 指令体过长，Token 浪费严重
- 无法被复用（只需要日志分析的人也要加载整个 Skill）

**正面案例**：

```yaml
# Skill 1: 代码审查
name: code_review
description: "审查代码变更的质量和安全性"
tools:
  - git_diff
  - search_code

# Skill 2: 测试生成
name: test_generation
description: "为指定代码生成单元测试"
tools:
  - read_file
  - search_code

# Skill 3: 日志分析
name: log_analysis
description: "分析应用日志，发现异常模式"
tools:
  - elasticsearch_query
  - search_code
```

**判断标准**：能否用一句话描述 Skill 的功能？如果需要"和"、"以及"连接，说明职责太多。

### 1.2 确定性优先

Skill 的策略应该尽量确定，减少 LLM 的自主决策空间。

**反面案例**：

```markdown
## 审查流程

先看看代码有什么问题，然后给出建议。
注意安全问题和性能问题。
```

这段指令模糊，Agent 每次执行路径可能不同。

**正面案例**：

```markdown
## 审查流程

按以下固定顺序执行：

1. 调用 `git_diff` 获取变更文件列表
2. 对每个 `.py` 文件，检查以下模式：
   - `eval(` → 标记为"不安全的代码执行"
   - `SELECT.*+` → 标记为"可能的 SQL 注入"
   - `password\s*=` → 标记为"可能的硬编码密钥"
3. 对每个 `.js/.ts` 文件，检查以下模式：
   - `innerHTML` → 标记为"可能的 XSS"
   - `document.write` → 标记为"不安全的 DOM 操作"
4. 收集所有问题，按严重程度排序
5. 生成报告
```

**判断标准**：两个不同的 Agent 执行同一个 Skill，结果应该高度一致。

### 1.3 幂等性

同一个 Skill 对相同的输入多次执行，应该产生相同的结果。

```markdown
## 代码审查

审查结果只基于代码内容，不考虑执行时间、历史审查记录等可变因素。

如果代码没有变更，两次审查的结果应该一致。
```

**非幂等的反面案例**：

```markdown
## 日志分析

分析最近 1 小时的日志。
```

"最近 1 小时"随时间变化，同样的调用在不同时刻产生不同结果。如果需要时间窗口，应该作为参数显式传入：

```yaml
parameters:
  - name: time_range
    type: string
    default: "last_hour"
    description: "时间范围，格式: last_hour / last_day / specific_range"
```

### 1.4 明确约束

明确告诉 Agent 不能做什么，和必须做什么一样重要。

```markdown
## 约束

必须：
- 每个问题必须附带文件名和行号
- 严重问题必须附带修复建议
- 使用 markdown 格式输出

不能：
- 不能修改代码（只做审查，不做修复）
- 不能跳过安全审查步骤
- 不能将代码风格问题标记为"严重"
- 不能审查 node_modules/ 目录下的文件

边界：
- 单文件超过 500 行时，标记为"建议拆分"
- 单文件超过 2000 行时，标记为"需人工审查"，跳过自动审查
- 二进制文件跳过审查
```

---

## 二、编写 SKILL.md 实战

### 2.1 需求分析

我们要编写一个完整的"代码审查 Skill"。先明确需求：

```
需求：代码审查 Skill
├── 输入：PR 编号或文件路径
├── 处理：安全检查 → 逻辑检查 → 风格检查
├── 输出：结构化审查报告（Markdown）
├── 约束：只读，不修改代码
└── 适用：Python / JavaScript / TypeScript
```

### 2.2 第一步：确定元信息

```yaml
---
name: code_review
version: 1.0.0
description: "审查代码变更，生成结构化审查报告"
author: engineering-team
license: MIT
tags:
  - code-review
  - security
  - quality

scope:
  languages:
    - python
    - javascript
    - typescript
  max_files: 50
  max_file_lines: 2000
```

### 2.3 第二步：声明工具依赖

```yaml
tools:
  - name: read_file
    description: "读取文件内容"
    required: true
  - name: search_files
    description: "搜索代码库中的内容"
    required: true
  - name: run_command
    description: "运行 shell 命令（linter 等）"
    required: false
---
```

`run_command` 标记为 `required: false`，因为即使没有 linter，审查的核心流程仍然可以执行。

### 2.4 第三步：编写指令体

以下是完整的指令体部分（接在 YAML 前置元数据之后）：

````markdown
# 代码审查

你是一个代码审查专家。审查指定的代码变更，识别潜在问题并生成结构化报告。

## 执行流程

### 阶段一：确定审查范围

1. 如果用户提供 PR 编号：
   - 使用 `run_command` 执行 `git diff main...HEAD` 获取变更
   - 统计变更的文件数和行数
2. 如果用户提供文件路径：
   - 使用 `read_file` 读取文件内容
3. 如果用户未明确指定：
   - 询问用户需要审查的范围

### 阶段二：安全审查

对每个变更文件，检查以下安全模式：

**Python 文件**：
| 模式 | 问题 | 严重程度 |
|------|------|---------|
| `eval(` | 不安全的代码执行 | 严重 |
| `exec(` | 不安全的代码执行 | 严重 |
| `pickle.loads(` | 不安全的反序列化 | 严重 |
| `SELECT.*\+ str\|f"` | SQL 注入风险 | 严重 |
| `password\s*=\s*["']` | 硬编码密钥 | 严重 |
| `subprocess.call\(.*shell=True` | 命令注入风险 | 严重 |
| `os.system(` | 命令注入风险 | 警告 |

**JavaScript/TypeScript 文件**：
| 模式 | 问题 | 严重程度 |
|------|------|---------|
| `innerHTML\s*=` | XSS 风险 | 严重 |
| `document\.write(` | 不安全的 DOM 操作 | 严重 |
| `eval(` | 不安全的代码执行 | 严重 |
| `https?:\/\/.*\$\{` | URL 注入风险 | 警告 |
| `private_key\|secret\|password` | 敏感信息泄露 | 严重 |

### 阶段三：逻辑审查

检查以下逻辑问题：

1. **空值处理**：
   - 访问可能为 null/undefined 的属性
   - 缺少空值检查的链式调用

2. **错误处理**：
   - 空的 catch 块
   - 吞掉异常不处理
   - 缺少 try-catch 的异步操作

3. **资源管理**：
   - 未关闭的文件句柄
   - 未释放的数据库连接
   - 缺少 cleanup 的临时文件

4. **边界条件**：
   - 数组越界访问
   - 整数溢出
   - 空集合的迭代

### 阶段四：风格审查

仅当 `run_command` 可用时：

1. 运行 linter：
   - Python: `ruff check <file>`
   - JavaScript/TypeScript: `npx eslint <file>`
2. 收集风格问题
3. 风格问题不标记为"严重"，统一标记为"建议"

### 阶段五：生成报告

按以下格式输出：

```markdown
## 审查报告

### 概要
- 审查范围：[文件列表]
- 变更统计：+X 行 / -Y 行 / Z 个文件
- 问题统计：严重 A / 警告 B / 建议 C

### 严重问题
> 必须修复后才能合并

- **[文件:行号]** 问题描述
  - 类型：安全问题 / 逻辑错误
  - 修复建议：具体代码修改建议
  - 参考：相关文档或最佳实践链接

### 警告
> 建议修复

- **[文件:行号]** 问题描述
  - 改进建议：...

### 改进建议
> 可选优化

- ...
```

## 约束

1. **只读**：只做审查，不修改任何代码
2. **公平**：不对代码风格问题标记为"严重"
3. **审慎**：不确定的问题标注"[需确认]"，不做武断判断
4. **效率**：
   - 跳过 `node_modules/`、`vendor/`、`__pycache__/`、`.git/` 目录
   - 跳过标记 `@generated` 或 `auto-generated` 的文件
   - 跳过二进制文件
5. **分级**：
   - 超过 500 行的文件，在报告中建议拆分
   - 超过 2000 行的文件，标记为"需人工审查"

## 错误处理

- 如果 `git diff` 失败，告知用户并建议手动提供文件
- 如果文件不存在，列出不存在的文件并继续审查其余文件
- 如果 `run_command` 不可用，跳过风格审查阶段
````

### 2.5 第四步：添加示例

创建 `examples/python_pr.yaml`：

```yaml
scenario: "Python PR 安全审查"
input:
  pr_number: 42
  diff_content: |
    def get_user(user_id):
        query = f"SELECT * FROM users WHERE id = {user_id}"
        return db.execute(query)

expected_output:
  summary: "1 个文件，+3 行，1 个严重问题"
  critical:
    - file: "app/models.py"
      line: 2
      issue: "SQL 注入风险"
      detail: "使用 f-string 拼接 SQL 查询，用户输入未经过参数化处理"
      fix: "使用参数化查询: `db.execute('SELECT * FROM users WHERE id = %s', (user_id,))`"
```

创建 `examples/react_pr.yaml`：

```yaml
scenario: "React PR XSS 审查"
input:
  pr_number: 88
  diff_content: |
    function Comment({ content }) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

expected_output:
  summary: "1 个文件，+3 行，1 个严重问题"
  critical:
    - file: "src/components/Comment.jsx"
      line: 2
      issue: "XSS 风险"
      detail: "使用 dangerouslySetInnerHTML 渲染用户输入，可能导致 XSS 攻击"
      fix: "使用 React 的文本渲染，或引入 DOMPurify 进行内容净化"
```

### 2.6 第五步：添加测试

创建 `tests/test_code_review.py`：

```python
"""代码审查 Skill 的测试"""
import pytest
from skill_md import parse_skill_md

SKILL_PATH = ".claude/skills/code_review/SKILL.md"

class TestSkillMetadata:
    """测试元信息完整性"""

    def test_parse_success(self):
        """SKILL.md 应该能被正确解析"""
        meta, instructions = parse_skill_md(SKILL_PATH)
        assert meta["name"] == "code_review"
        assert meta["version"] == "1.0.0"
        assert "description" in meta

    def test_required_tools(self):
        """必需工具应该被正确声明"""
        meta, _ = parse_skill_md(SKILL_PATH)
        tool_names = [t["name"] for t in meta["tools"]]
        assert "read_file" in tool_names
        assert "search_files" in tool_names

    def test_optional_tools(self):
        """可选工具应该标记为 required=false"""
        meta, _ = parse_skill_md(SKILL_PATH)
        run_cmd = next(
            (t for t in meta["tools"] if t["name"] == "run_command"),
            None
        )
        assert run_cmd is not None
        assert run_cmd.get("required", True) is False

class TestSkillInstructions:
    """测试指令体内容"""

    def test_has_security_section(self):
        """指令体应该包含安全审查部分"""
        _, instructions = parse_skill_md(SKILL_PATH)
        assert "安全" in instructions
        assert "SQL 注入" in instructions

    def test_has_constraints(self):
        """指令体应该包含约束部分"""
        _, instructions = parse_skill_md(SKILL_PATH)
        assert "约束" in instructions
        assert "只读" in instructions

    def test_has_error_handling(self):
        """指令体应该包含错误处理部分"""
        _, instructions = parse_skill_md(SKILL_PATH)
        assert "错误处理" in instructions
```

---

## 三、最佳实践

### 3.1 指令体编写技巧

#### 使用检查清单代替叙述

**不好**：

```markdown
审查代码时要注意安全问题和逻辑错误，还有性能问题也要关注，
代码风格方面如果有 linter 就跑一下，没有就算了。
```

**好**：

```markdown
审查检查清单：

- [ ] SQL 注入
- [ ] XSS
- [ ] 硬编码密钥
- [ ] 空值处理
- [ ] 错误处理
- [ ] 资源泄露
- [ ] 边界条件
```

#### 给出具体的模式匹配

**不好**：

```markdown
检查有没有安全问题。
```

**好**：

```markdown
检查以下安全模式：
- `eval(` → 不安全的代码执行
- `innerHTML\s*=` → XSS 风险
- `password\s*=\s*["']` → 硬编码密钥
```

具体的模式让 Agent 的检查更稳定、可重复。

#### 明确优先级

```markdown
问题严重程度分级：
1. 严重：安全漏洞、数据丢失风险
2. 警告：性能问题、潜在的 Bug
3. 建议：代码风格、可维护性改进
```

### 3.2 版本管理最佳实践

```yaml
# 1.0.0 → 首个正式版本
# 1.1.0 → 新增 TypeScript 支持
# 1.1.1 → 修复误报：try-catch 中的空 catch 块不算严重问题
# 1.2.0 → 新增性能审查维度
# 2.0.0 → 输出格式变更（不兼容旧版）
```

维护 `CHANGELOG.md`：

```markdown
# Changelog

## 1.2.0 (2026-02-15)
### Added
- 性能审查维度：N+1 查询检测、不必要的循环检测

## 1.1.1 (2026-01-20)
### Fixed
- 误报修复：空 catch 块不再标记为严重问题

## 1.1.0 (2026-01-10)
### Added
- TypeScript 文件支持
- ESLint 集成

## 1.0.0 (2025-12-20)
### Added
- 首个正式版本
- Python / JavaScript 支持
- 安全、逻辑、风格三维度审查
```

### 3.3 性能优化

#### 控制指令体长度

```
理想长度：500-1500 tokens
可接受：1500-3000 tokens
过长：>3000 tokens → 考虑拆分为多个 Skills
```

如果指令体超过 3000 tokens，考虑拆分：

```yaml
# 拆分前：code_review_all（3000+ tokens）
# 拆分后：
code_review_security    # 安全审查（800 tokens）
code_review_quality     # 质量审查（600 tokens）
code_review_performance # 性能审查（500 tokens）
```

#### 使用示例代替长描述

一个具体的示例往往胜过长段描述：

```markdown
## 输出格式

（省略 500 tokens 的格式描述...）

→ 改为一个示例：

## 输出格式

参考以下示例：

### 严重问题
- **[app/models.py:42]** SQL 注入风险
  - 修复建议：使用参数化查询
```

---

## 四、常见陷阱

### 4.1 过度抽象

**问题**：试图让一个 Skill 覆盖所有场景。

```yaml
# 过度抽象
name: universal_review
description: "审查任何类型的文件，包括代码、配置、文档、数据..."
```

**后果**：
- 指令体膨胀，Token 消耗大
- Agent 不知道当前应该用哪个检查策略
- 维护困难，每次修改影响所有使用者

**解决**：按领域拆分，每个 Skill 聚焦一个领域。

### 4.2 忽略边界条件

**问题**：只描述正常流程，不处理异常情况。

```markdown
## 流程
1. 读取文件
2. 分析代码
3. 生成报告
```

**后果**：文件不存在、文件过大、格式不支持时，Agent 不知道怎么办。

**解决**：为每个步骤添加错误处理：

```markdown
## 流程

1. 读取文件
   - 如果文件不存在，告知用户并终止
   - 如果文件超过 2000 行，标记为"需人工审查"并跳过
   - 如果是二进制文件，跳过

2. 分析代码
   ...
```

### 4.3 指令冲突

**问题**：不同部分的指令相互矛盾。

```markdown
## 安全审查
发现任何安全问题都要标记为"严重"。

## 评级标准
只有安全漏洞和逻辑错误标记为"严重"。
（这两条对"安全问题"和"安全漏洞"的界定可能有冲突）
```

**解决**：统一术语，消除歧义：

```markdown
## 严重程度定义
- **严重**：可被利用的安全漏洞（SQL 注入、XSS 等）
- **警告**：潜在的安全隐患（不安全的配置、缺少验证）
```

### 4.4 工具依赖过多

**问题**：声明了太多工具依赖。

```yaml
tools:
  - read_file
  - write_file
  - search_files
  - run_command
  - http_request
  - database_query
  - send_email
  # ... 20 个工具
```

**后果**：
- 加载缓慢
- 增加了出错面（任何一个工具不可用都可能影响执行）
- 违反单一职责原则

**解决**：精简到只保留必需的工具，通常 2-5 个为宜。

```yaml
tools:
  - read_file        # 核心工具
  - search_files     # 核心工具
  - run_command      # 可选，用于 linter
```

### 4.5 忽略可测试性

**问题**：Skill 的结果难以验证。

```markdown
## 输出
给出审查意见。
```

**后果**：无法判断 Skill 是否正确执行，无法自动测试。

**解决**：明确输出结构，提供可验证的示例：

```markdown
## 输出格式

必须包含以下部分：
1. 概要段（文件数、行数、问题统计）
2. 严重问题列表（每个问题包含文件名、行号、描述、修复建议）
3. 警告列表
4. 改进建议列表
```

---

## 思考题

::: info 检验你的理解
1. **单一职责和功能完整性是否矛盾？** 一个"代码审查"Skill 只做安全检查，是否太碎片化了？如何判断拆分的粒度？

2. **如何保证 Skill 的幂等性？** 如果审查结果需要考虑项目的 linter 配置（不同项目配置不同），怎么处理？

3. **指令体的理想长度为什么是 500-1500 tokens？** 太短和太长分别有什么问题？

4. **"确定性优先"是否与 LLM 的灵活性冲突？** 如何在确定性和灵活性之间找到平衡？
:::

---

## 本节小结

- ✅ **单一职责**：一个 Skill 只做一件事，能否用一句话描述是判断标准
- ✅ **确定性优先**：策略应该尽量确定，减少 Agent 的自主决策空间
- ✅ **幂等性**：相同输入产生相同结果，可变因素应作为参数传入
- ✅ **明确约束**：告诉 Agent 不能做什么和边界在哪里
- ✅ **避免常见陷阱**：过度抽象、忽略边界、指令冲突、工具过多、不可测试

---

**下一步**: 掌握了 Skill 的设计和编写方法后，下一节我们将从微观走向宏观，看看 Skills 的生态系统——开放标准的治理、社区市场、安全风险，以及 Skills 与 MCP 的互补关系。

---

[← 返回模块首页](/agent-ecosystem/09-agent-skills) | [继续学习:Skills 生态与安全 →](/agent-ecosystem/09-agent-skills/05-skill-ecosystem)

---

[^1]: Anthropic Engineering Blog, "Skills as an Open Standard", December 2025. https://www.anthropic.com/engineering/skills-open-standard
[^2]: Agentic AI Foundation, "SKILL.md Best Practices Guide", 2026. https://agentic-ai.org/guides/skill-best-practices
