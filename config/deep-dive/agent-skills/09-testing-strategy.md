# Skill 测试策略

> 从"基础模块单个测试文件"扩展为完整的测试体系。Skill 测试比传统软件测试更复杂，因为它需要同时验证指令质量和工具交互的正确性 | 预计阅读时间：45 分钟

---

## 一、引言

当你在本地编写了一个 SKILL.md，在 Agent 中加载它，手动跑了一两个场景，看起来工作正常——你觉得自己写了一个"能用的 Skill"。

但"能用"和"可靠"之间隔着一条巨大的鸿沟。

传统软件测试的目标是验证**代码逻辑**的正确性。一个函数输入 2 和 3，期望输出 5，断言通过，测试完成。Skill 测试则复杂得多：它不仅要验证指令本身的质量（指令是否完整、无矛盾、可执行），还要验证指令驱动下的**工具交互**是否符合预期（调用了正确的工具、按正确的顺序、传了正确的参数）。

这带来了两个独特的挑战：

- **测试对象是自然语言指令，而非代码**。指令的语义正确性无法像代码一样被静态分析工具精确判断。一段指令"审查这个 PR 的变更文件"可能在语义上是模糊的——它是要审查所有文件，还是只审查有改动的文件？这种模糊性在纯文本层面无法被检测。
- **测试输出是非确定性的**。LLM 的输出天然具有概率性，同样的输入在不同温度参数下可能产生不同的工具调用序列。这意味着传统的"期望输出等于具体值"的断言模式不再适用。

因此，Skill 测试需要一套专门的方法论和工具链。本章将借鉴软件工程中成熟的测试金字塔模型，同时针对 Skill 的特殊性进行改造，建立从单元测试、集成测试到端到端测试的完整体系。

::: info 测试在 Skill 生命周期中的位置
```
Skill 开发流程：
编写指令 ─→ 本地测试 ─→ 发布 ─→ 持续监控
                │
                ├── 单元测试：每次修改后运行（秒级）
                ├── 集成测试：每次提交前运行（分钟级）
                └── E2E 测试：发布前运行（十分钟级）
```
测试不是开发结束后的"收尾工作"，而是嵌入在每个环节的质量保障手段。
:::

---

## 二、Skill 测试金字塔

### 2.1 三层结构

Skill 测试金字塔沿用了传统测试金字塔的三层结构，但每层的测试焦点发生了根本性的变化：

```
Skill 测试金字塔

             ╱╲
            ╱  ╲
           ╱ E2E ╲           顶层：全链路验证
          ╱  测试   ╲         真实 Agent 执行 + 真实工具
         ╱──────────╲
        ╱  集成测试   ╲       中层：工具交互验证
       ╱               ╲      Mock 工具 + 模拟执行
      ╱─────────────────╲
     ╱   单元测试         ╲    底层：指令质量验证
    ╱                     ╲   YAML Schema + 文本分析
   ╱───────────────────────╲
```

| 层级 | 测试对象 | 覆盖目标 | 执行频率 | 执行时间 |
|------|---------|---------|---------|---------|
| **单元测试** | SKILL.md 元数据、指令文本 | Schema 合规性、指令完整性、工具声明一致性 | 每次文件保存 | < 1 秒 |
| **集成测试** | Mock 环境下的工具调用序列 | 工具调用顺序、参数正确性、异常路径处理 | 每次 PR 提交 | < 30 秒 |
| **E2E 测试** | 真实 Agent + 真实工具的执行结果 | 全链路正确性、输出质量、快照一致性 | 每次版本发布 | < 10 分钟 |

### 2.2 Skill 测试金字塔 vs 传统测试金字塔

理解两者的差异，是设计 Skill 测试体系的关键前提：

| 维度 | 传统测试金字塔 | Skill 测试金字塔 |
|------|--------------|-----------------|
| **单元测试的验证对象** | 函数/方法的返回值 | SKILL.md 的元数据和指令文本质量 |
| **Mock 的目标** | 外部依赖（数据库、网络） | 工具调用（Tool Calls） |
| **断言的确定性** | 确定性（输入 x 总是输出 y） | 概率性（检查模式和结构而非具体值） |
| **测试维护成本** | 较低，与代码耦合 | 较高，与 LLM 行为耦合 |
| **回归测试的重点** | API 行为不变性 | 指令语义不变性 |
| **快照测试的适用性** | 序列化输出快照 | 工具调用序列快照 |

::: warning 警告
传统测试中一个常见的误区是"单元测试应该覆盖所有分支"。在 Skill 测试中，**单元测试覆盖的是指令的声明属性**（字段、结构、引用完整性），而不是指令的语义行为。语义行为应该在集成测试和 E2E 测试中验证。
:::

---

## 三、单元测试实践

Skill 的单元测试聚焦在三个层面：**元数据验证**、**指令完整性检查**和**工具声明验证**。

### 3.1 元数据验证：YAML Schema 校验

SKILL.md 的 YAML frontmatter 包含结构化的元数据字段。单元测试的第一道防线是验证这些字段的**存在性、类型正确性和格式合规性**。

```yaml
# 一个典型的 SKILL.md frontmatter
---
name: code_review_skill
version: 1.2.0
description: "审查 Pull Request 变更代码的质量、安全性和风格"
type: skill
author: team-alpha
license: MIT

dependencies:
  - name: git-cli
    version: ">=2.0.0"
    type: tool

execution:
  mode: sequential
  max_retries: 2
  timeout: 300
---
```

对应的 Schema 验证规则：

```python
# test_skill_schema.py
import yaml
import json
import jsonschema
from pathlib import Path

SKILL_SCHEMA = {
    "type": "object",
    "required": ["name", "version", "description", "execution"],
    "properties": {
        "name": {
            "type": "string",
            "pattern": r"^[a-z][a-z0-9_]*$",   # snake_case 命名
        },
        "version": {
            "type": "string",
            "pattern": r"^\d+\.\d+\.\d+$",     # SemVer 格式
        },
        "description": {
            "type": "string",
            "minLength": 10,
            "maxLength": 200,
        },
        "type": {
            "type": "string",
            "enum": ["skill", "workflow", "template"],
        },
        "execution": {
            "type": "object",
            "required": ["mode"],
            "properties": {
                "mode": {
                    "type": "string",
                    "enum": ["sequential", "parallel", "async"],
                },
                "max_retries": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 10,
                },
                "timeout": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 3600,
                },
            },
        },
        "dependencies": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["name", "version"],
                "properties": {
                    "name": {"type": "string"},
                    "version": {"type": "string"},
                    "type": {
                        "type": "string",
                        "enum": ["tool", "skill", "mcp_server"],
                    },
                },
            },
        },
    },
}


class SkillValidator:
    """SKILL.md 单元验证器"""

    def __init__(self, skill_path: str):
        self.skill_path = Path(skill_path)
        self.errors = []
        self.warnings = []

    def validate(self) -> bool:
        """执行所有单元验证，返回是否通过"""
        self._parse_yaml()
        self._validate_schema()
        self._check_instruction_completeness()
        self._validate_tool_declarations()
        return len(self.errors) == 0

    def _parse_yaml(self):
        """解析 YAML frontmatter"""
        with open(self.skill_path, "r", encoding="utf-8") as f:
            content = f.read()

        # 提取 --- 之间的 frontmatter
        parts = content.split("---")
        if len(parts) < 3:
            self.errors.append("Missing YAML frontmatter (--- delimiters)")
            return

        try:
            self.metadata = yaml.safe_load(parts[1])
            self.instruction_body = "---".join(parts[2:])
        except yaml.YAMLError as e:
            self.errors.append(f"YAML parse error: {e}")

    def _validate_schema(self):
        """JSON Schema 校验"""
        if not hasattr(self, "metadata"):
            return
        try:
            jsonschema.validate(self.metadata, SKILL_SCHEMA)
        except jsonschema.ValidationError as e:
            self.errors.append(f"Schema validation failed: {e.message}")

    def _check_instruction_completeness(self):
        """检查指令体是否包含必需的部分"""
        if not hasattr(self, "instruction_body"):
            return

        required_sections = [
            ("角色设定", "## 角色", "角色设定缺失"),
            ("执行流程", "## 执行流程", "执行流程缺失"),
            ("约束条件", "## 约束", "约束条件缺失（可选，仅 warning）"),
        ]

        for section_name, marker, message in required_sections:
            if marker not in self.instruction_body:
                if "可选" in message:
                    self.warnings.append(f"Warning: {message}")
                else:
                    self.errors.append(f"Missing section '{section_name}': {message}")

    def _validate_tool_declarations(self):
        """验证声明的工具是否在指令体中被引用"""
        if not hasattr(self, "metadata"):
            return

        declared_tools = [
            dep["name"]
            for dep in self.metadata.get("dependencies", [])
            if dep.get("type") in ("tool", "mcp_server")
        ]

        for tool_name in declared_tools:
            # 简化的引用检查：工具名是否出现在指令体中
            if tool_name not in self.instruction_body:
                self.warnings.append(
                    f"Warning: Declared tool '{tool_name}' is not referenced "
                    f"in the instruction body"
                )

    def report(self):
        """输出验证报告"""
        status = "PASS" if not self.errors else "FAIL"
        print(f"\n=== Skill Validation Report: {self.skill_path.name} ===")
        print(f"Status: {status}")
        print(f"Errors: {len(self.errors)}")
        print(f"Warnings: {len(self.warnings)}")

        for err in self.errors:
            print(f"  [ERROR] {err}")
        for warn in self.warnings:
            print(f"  [WARN]  {warn}")

        return status


# 使用示例
if __name__ == "__main__":
    validator = SkillValidator("path/to/SKILL.md")
    validator.validate()
    validator.report()
```

### 3.2 指令完整性检查

除了 frontmatter 的结构校验，单元测试还需要验证指令体（instruction body）是否包含了**可执行所需的所有要素**。一个可执行的 Skill 指令通常需要覆盖：

| 要素 | 检查方式 | 严重性 |
|------|---------|-------|
| 角色设定（你是谁） | 正则匹配 `## 角色` 或自然语言分析 | 必需 |
| 执行步骤（怎么做） | 匹配 `## 执行流程` / `## 步骤` / `## 过程` | 必需 |
| 输出格式（产出什么） | 匹配 `## 输出` / `## 结果` | 必需 |
| 错误处理（出错了怎么办） | 匹配 `## 错误处理` / `## 异常` | 推荐 |
| 约束条件（什么不能做） | 匹配 `## 约束` / `## 限制` | 推荐 |
| 工具使用说明（怎么用工具） | 匹配具体工具名称 | 推荐 |

```python
def test_instruction_has_role_section():
    """测试指令体是否包含角色设定"""
    validator = SkillValidator("tests/fixtures/sample_skill.md")
    validator._parse_yaml()
    validator._check_instruction_completeness()
    assert len(validator.errors) == 0, f"Found errors: {validator.errors}"
```

::: tip 建议
对于团队标准化的 Skill 模版，可以在 `_check_instruction_completeness` 中使用更精细的 NLP 分析——比如检测"角色设定"段落是否真正包含了职责描述，而不仅仅是有一个标题。一个常见的反例是写了 `## 角色` 标题但内容只有一行"我是一个助手"——这种"形式上有、实质上无"的情况需要人工审查或 NER 分析来捕获。
:::

### 3.3 工具声明验证

工具声明验证确保两件事：**声明了的工具确实被使用了**，**使用了的工具确实被声明了**。前者已经在 `_validate_tool_declarations` 中实现，后者（反向检查）同样重要：

```python
def test_no_undeclared_tools():
    """检查指令体中是否引用了未声明的工具"""
    validator = SkillValidator("tests/fixtures/sample_skill.md")
    validator._parse_yaml()

    # 反向检查：从指令体中提取工具名引用
    import re
    declared = {dep["name"] for dep in validator.metadata.get("dependencies", [])}

    # 使用正则匹配常见的工具引用模式
    # 例如: `git_diff`、`read_file`、`search_code`
    mentioned_tools = set(
        re.findall(r"`([a-z_]+)`", validator.instruction_body)
    )

    undeclared = mentioned_tools - declared
    if undeclared:
        validator.warnings.append(
            f"Undeclared tools found in instruction body: {undeclared}"
        )
```

---

## 四、集成测试实践

单元测试验证 Skill 的"声明质量"，集成测试验证 Skill 的"行为质量"——即 Skill 在**模拟环境**中是否正确地调用了工具、按照预期的顺序、传递了正确的参数。

### 4.1 Mock 工具框架设计

集成测试的核心是 **Mock 工具框架**：拦截 Skill 执行中的所有工具调用，不真正执行工具，而是返回预设的模拟结果。

```python
# test_skill_integration.py
from unittest.mock import MagicMock, AsyncMock
import json
from typing import Any, Dict, List, Optional


class MockToolRegistry:
    """注册和管理 Mock 工具"""

    def __init__(self):
        self._tools: Dict[str, MockTool] = {}

    def register(self, name: str, mock_tool: "MockTool"):
        self._tools[name] = mock_tool

    def get(self, name: str) -> Optional["MockTool"]:
        return self._tools.get(name)

    def reset_all(self):
        """重置所有 Mock 工具的调用记录"""
        for tool in self._tools.values():
            tool.reset()


class MockTool:
    """可预设返回值的 Mock 工具"""

    def __init__(self, name: str):
        self.name = name
        self.call_history: List[Dict[str, Any]] = []
        self._preset_responses: Dict[str, Any] = {}
        self._default_response: Any = {"status": "ok", "data": None}

    def when(self, params_partial: Dict[str, Any], then_return: Any):
        """预设匹配特定参数时的返回值"""
        key = self._hash_params(params_partial)
        self._preset_responses[key] = then_return

    async def execute(self, **params) -> Dict[str, Any]:
        """模拟工具执行"""
        self.call_history.append({
            "tool": self.name,
            "params": params,
            "timestamp": len(self.call_history),
        })

        key = self._hash_params(params)
        if key in self._preset_responses:
            return self._preset_responses[key]

        return self._default_response

    def reset(self):
        self.call_history = []

    @staticmethod
    def _hash_params(params: Dict[str, Any]) -> str:
        return json.dumps(params, sort_keys=True)


# --- 示例：Mock git_diff 工具 ---

def setup_mock_git_diff(registry: MockToolRegistry):
    """设置 git_diff 工具的 Mock 配置"""
    git_diff = MockTool("git_diff")

    # 预设正常路径：返回模拟的 diff 内容
    git_diff.when(
        {"path": "src/main.py", "branch": "feature/add-auth"},
        then_return={
            "status": "ok",
            "data": """
+import jwt
+from fastapi import Depends, HTTPException
+
+def verify_token(token: str) -> dict:
+    try:
+        payload = jwt.decode(token, algorithms=["HS256"])
+        return payload
+    except jwt.InvalidTokenError:
+        raise HTTPException(status_code=401)
""",
            "changed_files": 1,
            "additions": 12,
            "deletions": 0,
        }
    )

    # 预设异常路径：文件不存在
    git_diff.when(
        {"path": "src/nonexistent.py"},
        then_return={
            "status": "error",
            "error_type": "file_not_found",
            "message": "File not found: src/nonexistent.py",
        }
    )

    # 预设边界条件：空 diff
    git_diff.when(
        {"path": "README.md", "branch": "feature/add-auth"},
        then_return={
            "status": "ok",
            "data": "",
            "changed_files": 0,
            "additions": 0,
            "deletions": 0,
        }
    )

    registry.register("git_diff", git_diff)
```

### 4.2 场景模拟

集成测试应该覆盖三类场景：**正常路径**、**异常路径**和**边界条件**。

```python
# --- 测试 Skill 执行引擎 ---

class SkillExecutionEngine:
    """简化的 Skill 执行引擎（用于集成测试）"""

    def __init__(self, skill_md: str, tool_registry: MockToolRegistry):
        self.skill_md = skill_md
        self.tools = tool_registry
        self.call_sequence: List[Dict] = []

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        模拟 Skill 执行过程。
        实际场景中会由 Agent 框架（如 Claude Code）处理，
        这里简化了逻辑用于演示测试模式。
        """
        # 模拟 Agent 解析指令并决定调用何种工具
        if "review_pr" in self.skill_md:
            # 模拟代码审查流程
            diff_result = await self.tools.get("git_diff").execute(
                path=input_data.get("path", ""),
                branch=input_data.get("branch", ""),
            )
            self.call_sequence.append({
                "step": "git_diff",
                "input": input_data,
                "output": diff_result,
            })

            if diff_result["status"] == "error":
                return {"status": "failed", "error": diff_result["message"],
                        "call_sequence": self.call_sequence}

            if not diff_result["data"]:
                return {"status": "no_changes", "message": "No diff found",
                        "call_sequence": self.call_sequence}

            # 模拟审查结果
            review_result = {
                "status": "ok",
                "issues_found": 2,
                "recommendation": "needs_review",
                "details": "Found potential security issues with JWT handling",
            }
            self.call_sequence.append({
                "step": "analyze",
                "output": review_result,
            })
            return {**review_result, "call_sequence": self.call_sequence}

        return {"status": "unknown_skill", "call_sequence": self.call_sequence}


# --- 测试用例 ---

class TestCodeReviewSkillIntegration:
    """代码审查 Skill 的集成测试"""

    @pytest.fixture
    def setup(self):
        registry = MockToolRegistry()
        setup_mock_git_diff(registry)
        with open("tests/fixtures/code_review_skill.md") as f:
            skill_md = f.read()
        engine = SkillExecutionEngine(skill_md, registry)
        return engine, registry

    @pytest.mark.asyncio
    async def test_normal_path(self, setup):
        """正常路径：审查存在的文件"""
        engine, registry = setup
        result = await engine.execute({
            "path": "src/main.py",
            "branch": "feature/add-auth",
        })

        # 验证工具调用顺序
        call_names = [c["step"] for c in result["call_sequence"]]
        assert call_names == ["git_diff", "analyze"], \
            f"Unexpected call sequence: {call_names}"

        # 验证输出结构
        assert result["status"] == "ok"
        assert "issues_found" in result
        assert "recommendation" in result

    @pytest.mark.asyncio
    async def test_error_path_file_not_found(self, setup):
        """异常路径：文件不存在"""
        engine, registry = setup
        result = await engine.execute({
            "path": "src/nonexistent.py",
            "branch": "feature/add-auth",
        })

        # 验证遇到错误时停止后续调用
        call_names = [c["step"] for c in result["call_sequence"]]
        assert call_names == ["git_diff"], \
            "Should stop after git_diff error, not proceed to analyze"
        assert result["status"] == "failed"
        assert "file_not_found" in result["error"]

    @pytest.mark.asyncio
    async def test_boundary_empty_diff(self, setup):
        """边界条件：空 diff（文件未修改）"""
        engine, registry = setup
        result = await engine.execute({
            "path": "README.md",
            "branch": "feature/add-auth",
        })

        assert result["status"] == "no_changes"
        assert "No diff found" in result["message"]
```

### 4.3 断言策略

Skill 集成测试的断言策略与传统测试有本质区别：

| 断言类型 | 传统测试 | Skill 集成测试 |
|---------|---------|--------------|
| **值断言** | `assert result == expected` | `assert "error" in result["status"] or result["status"] == "failed"` |
| **顺序断言** | 不常用 | `assert call_order == ["tool_a", "tool_b"]` |
| **结构断言** | `assert "key" in result` | `assert result 包含所有必需字段` |
| **不存在断言** | `assert result is None` | `assert "sensitive_data" not in result["output"]` |

```python
def test_tool_call_order_matches_skill_steps():
    """验证工具调用顺序与 SKILL.md 中描述的步骤一致"""
    expected_order = ["git_diff", "search_code", "analyze", "report"]
    actual_order = get_call_sequence("code_review_skill")

    # 断言核心步骤顺序（允许插入 Agent 框架自动添加的辅助调用）
    assert_core_steps_match(actual_order, expected_order)


def assert_core_steps_match(actual: List[str], expected: List[str]):
    """检查 expected 中的步骤是否以正确的相对顺序出现在 actual 中"""
    pos = 0
    for step in expected:
        try:
            pos = actual.index(step, pos) + 1
        except ValueError:
            pytest.fail(f"Expected step '{step}' not found in call sequence")
```

---

## 五、E2E 测试实践

集成测试验证了 Skill 在模拟环境中的行为正确性，但模拟永远无法完全复现真实环境。E2E 测试是在**真实的 Agent 环境 + 真实的工具**中验证 Skill 的全链路行为。

### 5.1 沙箱环境搭建

E2E 测试需要一个隔离的沙箱环境，以防止测试对真实工作区造成影响：

```dockerfile
# Dockerfile.skill-test
FROM python:3.12-slim

# 安装必要的工具
RUN apt-get update && apt-get install -y \
    git \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# 创建隔离的工作目录
WORKDIR /workspace

# 复制测试夹具（模拟的代码仓库）
COPY tests/fixtures/test_repo/ /workspace/test_repo/

# 安装 Claude Code CLI（或其他 Agent 框架）
# RUN npm install -g @anthropic-ai/claude-code

# 复制测试框架
COPY tests/e2e/ /workspace/tests/e2e/

# 设置沙箱安全策略
ENV SANDBOX_MODE=true
ENV MAX_FILE_WRITE_SIZE=10485760
ENV ALLOWED_COMMANDS="git,cat,grep,find,curl"
```

沙箱的启动脚本：

```python
# sandbox_runner.py
import subprocess
import tempfile
import shutil
from pathlib import Path


class SandboxRunner:
    """Docker 沙箱执行器"""

    def __init__(self, image_name: str = "skill-test-sandbox"):
        self.image_name = image_name
        self.container_id = None

    def build_image(self):
        """构建测试沙箱 Docker 镜像"""
        result = subprocess.run(
            ["docker", "build", "-t", self.image_name, "-f",
             "Dockerfile.skill-test", "."],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(f"Failed to build sandbox: {result.stderr}")

    def start(self):
        """启动沙箱容器"""
        result = subprocess.run(
            [
                "docker", "run", "--rm", "-d",
                "--workdir", "/workspace",
                self.image_name,
                "tail", "-f", "/dev/null",  # 保持容器运行
            ],
            capture_output=True, text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(f"Failed to start sandbox: {result.stderr}")
        self.container_id = result.stdout.strip()

    def run_command(self, cmd: list) -> subprocess.CompletedProcess:
        """在沙箱中执行命令"""
        docker_cmd = ["docker", "exec", self.container_id] + cmd
        return subprocess.run(docker_cmd, capture_output=True, text=True)

    def copy_to_container(self, src: str, dest: str):
        """将文件复制到沙箱"""
        subprocess.run(
            ["docker", "cp", src, f"{self.container_id}:{dest}"],
            check=True,
        )

    def stop(self):
        """停止并清理沙箱"""
        if self.container_id:
            subprocess.run(["docker", "stop", self.container_id],
                           capture_output=True)
            self.container_id = None
```

### 5.2 全链路验证

E2E 测试用例的典型结构：

```python
# test_e2e_code_review.py
import pytest
import json
from pathlib import Path


class TestCodeReviewSkillE2E:
    """代码审查 Skill 的 E2E 测试"""

    @pytest.fixture
    def sandbox(self):
        runner = SandboxRunner()
        runner.build_image()
        runner.start()

        # 将待测试的 SKILL.md 复制到沙箱
        runner.copy_to_container(
            "skills/code_review/SKILL.md",
            "/workspace/skills/code_review/SKILL.md",
        )

        yield runner
        runner.stop()

    def test_full_review_flow(self, sandbox):
        """全链路验证：输入 PR 变更 → 执行 Skill → 验证输出"""
        # 1. 准备测试输入
        sandbox.run_command([
            "bash", "-c",
            "cd /workspace/test_repo && "
            "git checkout -b test-branch && "
            "echo 'print(1/0)' >> src/buggy.py && "
            "git add . && git commit -m 'add buggy code'"
        ])

        # 2. 执行 Skill（通过 CLI 或 API）
        result = sandbox.run_command([
            "bash", "-c",
            "cd /workspace/test_repo && "
            "claude skill run code_review "
            "--input '{\"branch\": \"test-branch\"}' "
            "--output /workspace/review_result.json"
        ])

        assert result.returncode == 0, f"Skill execution failed: {result.stderr}"

        # 3. 读取并验证输出
        output = sandbox.run_command([
            "cat", "/workspace/review_result.json"
        ])
        review = json.loads(output.stdout)

        # 4. 验证输出结构
        assert "status" in review
        assert "issues" in review
        assert len(review["issues"]) >= 1  # 应该发现 print(1/0) 的问题

        # 5. 验证输出内容质量
        issue_types = {i["type"] for i in review["issues"]}
        assert "zero_division" in issue_types or "runtime_error" in issue_types
```

### 5.3 快照测试

快照测试是 E2E 测试的重要补充。它将 Skill 的执行结果与预期快照进行对比，快速发现回归问题：

```python
# snapshot_test.py
import json
import filecmp
from pathlib import Path


class SnapshotManager:
    """快照管理器"""

    def __init__(self, snapshot_dir: str = "tests/snapshots/"):
        self.snapshot_dir = Path(snapshot_dir)
        self.snapshot_dir.mkdir(parents=True, exist_ok=True)

    def save_snapshot(self, skill_name: str, version: str, data: dict):
        """保存当前执行结果为快照"""
        path = self.snapshot_dir / f"{skill_name}_v{version}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return path

    def assert_matches_snapshot(self, skill_name: str, version: str,
                                 actual: dict):
        """断言实际输出与快照匹配"""
        snapshot_path = self.snapshot_dir / f"{skill_name}_v{version}.json"

        if not snapshot_path.exists():
            # 首次运行：创建快照
            self.save_snapshot(skill_name, version, actual)
            pytest.skip(f"Snapshot created: {snapshot_path}")
            return

        with open(snapshot_path, "r", encoding="utf-8") as f:
            expected = json.load(f)

        # 结构化对比（忽略时间戳等易变字段）
        ignore_keys = {"timestamp", "execution_id", "duration_ms"}
        self._compare_dicts(expected, actual, ignore_keys, "")

    def _compare_dicts(self, expected: dict, actual: dict,
                       ignore_keys: set, path: str):
        """递归对比两个字典，忽略指定字段"""
        for key in expected:
            full_key = f"{path}.{key}" if path else key
            if key in ignore_keys:
                continue
            if key not in actual:
                raise AssertionError(f"Missing key: {full_key}")
            if isinstance(expected[key], dict):
                self._compare_dicts(
                    expected[key], actual[key], ignore_keys, full_key
                )
            elif isinstance(expected[key], list):
                assert len(actual[key]) == len(expected[key]), \
                    f"List length mismatch at {full_key}: " \
                    f"{len(actual[key])} != {len(expected[key])}"
            else:
                assert actual[key] == expected[key], \
                    f"Value mismatch at {full_key}: " \
                    f"'{actual[key]}' != '{expected[key]}'"
```

---

## 六、回归测试套件

### 6.1 版本升级的兼容性保障

Skill 的版本升级（尤其是大版本升级）是回归的高危区。最常见的回归问题来自：

1. **LLM 模型升级**：Claude 从 4.0 升级到 4.5 时，指令解析方式可能变化
2. **工具接口变更**：底层工具 API 的参数名或返回值格式变化
3. **框架版本升级**：Agent 框架的行为变化影响 Skill 执行

回归测试套件的核心职责是在每次变更后运行完整的测试金字塔：

```bash
# 回归测试运行脚本
#!/bin/bash
# run_regression.sh

set -e

echo "=== Skill Regression Test Suite ==="
echo ""

# 阶段 1：单元测试（所有 Skill）
echo "[Phase 1/3] Running unit tests..."
python -m pytest tests/unit/ \
    --junitxml=reports/unit-results.xml \
    --tb=short

# 阶段 2：集成测试（变更相关的 Skill）
echo "[Phase 2/3] Running integration tests..."
python -m pytest tests/integration/ \
    --junitxml=reports/integration-results.xml \
    --tb=short

# 阶段 3：E2E 测试（核心 Skill）
echo "[Phase 3/3] Running E2E tests..."
if [ "${CI}" == "true" ]; then
    # CI 环境中需要构建沙箱
    docker build -t skill-test-sandbox -f Dockerfile.skill-test .
fi
python -m pytest tests/e2e/ \
    --junitxml=reports/e2e-results.xml \
    --tb=long

echo ""
echo "=== Regression test complete ==="
```

### 6.2 GitHub Actions 配置

```yaml
# .github/workflows/skill-regression.yml
name: Skill Regression Tests

on:
  push:
    branches: [main, develop]
    paths:
      - 'skills/**/*.md'
      - 'tests/**'
  pull_request:
    paths:
      - 'skills/**/*.md'
      - 'tests/**'
  schedule:
    - cron: '0 6 * * 1'  # 每周一 06:00 UTC 运行完整回归

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install pyyaml jsonschema pytest pytest-asyncio
      - run: python -m pytest tests/unit/ --junitxml=reports/unit.xml
      - uses: dorny/test-reporter@v1
        if: success() || failure()
        with:
          name: Unit Tests
          path: reports/unit.xml
          reporter: java-junit

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install pyyaml pytest pytest-asyncio
      - run: python -m pytest tests/integration/ --junitxml=reports/integration.xml
      - uses: dorny/test-reporter@v1
        if: success() || failure()
        with:
          name: Integration Tests
          path: reports/integration.xml
          reporter: java-junit

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t skill-test-sandbox -f Dockerfile.skill-test .
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install pytest pytest-asyncio
      - run: python -m pytest tests/e2e/ --junitxml=reports/e2e.xml
      - uses: dorny/test-reporter@v1
        if: success() || failure()
        with:
          name: E2E Tests
          path: reports/e2e.xml
          reporter: java-junit

  coverage-report:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests, e2e-tests]
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "## Test Coverage Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Metric | Value |" >> $GITHUB_STEP_SUMMARY
          echo "|--------|-------|" >> $GITHUB_STEP_SUMMARY
          echo "| Skills tested | $(find skills -name 'SKILL.md' | wc -l) |" >> $GITHUB_STEP_SUMMARY
          echo "| Unit tests | $(grep -c 'def test_' tests/unit/*.py) |" >> $GITHUB_STEP_SUMMARY
          echo "| Integration tests | $(grep -c 'def test_' tests/integration/*.py) |" >> $GITHUB_STEP_SUMMARY
          echo "| E2E tests | $(grep -c 'def test_' tests/e2e/*.py) |" >> $GITHUB_STEP_SUMMARY
      - uses: dorny/test-reporter@v1
        if: success() || failure()
        with:
          name: All Tests
          path: reports/*.xml
          reporter: java-junit
```

### 6.3 测试覆盖率指标

Skill 测试的覆盖率不像代码测试那样有明确的"行覆盖"或"分支覆盖"概念。我们需要定义适合 Skill 的覆盖指标：

| 指标 | 定义 | 目标 | 测量方式 |
|------|------|------|---------|
| **指令覆盖** | SKILL.md 中每个 `##` 级别的段落至少被一个测试覆盖 | > 90% | 正则提取段落标题，与测试用例列表对比 |
| **路径覆盖** | 所有条件分支（if/else 导致的执行路径）至少被一个测试覆盖 | > 80% | 集成测试中 Mock 不同场景 |
| **工具覆盖** | 声明的每个工具都在集成测试中被至少调用一次 | 100% | MockToolRegistry 的调用记录 |
| **异常覆盖** | 每种错误处理路径至少被一个测试覆盖 | > 70% | 手动追踪错误处理段落 |
| **边界覆盖** | 空输入、超大输入、非法输入等边界场景 | 核心场景 | 手动定义的边界用例集合 |

```python
def measure_instruction_coverage(skill_path: str, test_cases: list) -> dict:
    """测量指令覆盖率的简化实现"""
    import re

    with open(skill_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 提取所有 ## 段落
    sections = re.findall(r"##\s+(.+)", content)

    # 检查每个段落是否被覆盖
    covered = []
    uncovered = []

    for section in sections:
        section_clean = section.strip()
        is_covered = any(
            section_clean.lower() in tc["description"].lower()
            or any(kw in tc["description"].lower()
                   for kw in section_clean.lower().split())
            for tc in test_cases
        )
        if is_covered:
            covered.append(section_clean)
        else:
            uncovered.append(section_clean)

    return {
        "total_sections": len(sections),
        "covered": len(covered),
        "uncovered": len(uncovered),
        "coverage_rate": len(covered) / len(sections) * 100 if sections else 0,
        "uncovered_sections": uncovered,
    }
```

---

## 七、完整的测试套件代码示例

下面是一个完整的测试套件框架，整合了单元、集成和 E2E 三层测试：

```python
# tests/conftest.py - 共享的测试配置
import pytest
import yaml
from pathlib import Path


@pytest.fixture
def skill_path():
    """返回待测试的 SKILL.md 路径"""
    return "skills/code_review/SKILL.md"


@pytest.fixture
def skill_metadata(skill_path):
    """加载 SKILL.md 的 YAML 元数据"""
    with open(skill_path, "r") as f:
        content = f.read()
    _, frontmatter, _ = content.split("---", 2)
    return yaml.safe_load(frontmatter)


@pytest.fixture
def mock_tool_registry():
    """创建并配置 Mock 工具注册表"""
    from test_skill_integration import MockToolRegistry, setup_mock_git_diff
    registry = MockToolRegistry()
    setup_mock_git_diff(registry)
    return registry
```

```python
# tests/unit/test_skill_metadata.py
import pytest
from skill_validator import SkillValidator


class TestSkillMetadata:
    """SKILL.md 元数据验证测试"""

    def test_name_format(self, skill_metadata):
        """验证 Skill 名称格式"""
        name = skill_metadata["name"]
        assert name == name.lower().replace("-", "_"), \
            "Name must be snake_case"

    def test_version_is_semver(self, skill_metadata):
        """验证版本号是 SemVer 格式"""
        import re
        version = skill_metadata["version"]
        assert re.match(r"^\d+\.\d+\.\d+$", version), \
            "Version must follow SemVer (MAJOR.MINOR.PATCH)"

    def test_execution_mode_valid(self, skill_metadata):
        """验证执行模式"""
        valid_modes = {"sequential", "parallel", "async"}
        assert skill_metadata["execution"]["mode"] in valid_modes

    def test_dependencies_have_required_fields(self, skill_metadata):
        """验证依赖声明完整性"""
        for dep in skill_metadata.get("dependencies", []):
            assert "name" in dep, "Missing 'name' in dependency"
            assert "version" in dep, "Missing 'version' in dependency"
```

```python
# tests/integration/test_code_review_flow.py
import pytest


class TestCodeReviewSkillIntegration:
    """代码审查 Skill 集成测试套件"""

    @pytest.mark.asyncio
    async def test_review_trivial_change(self, mock_tool_registry):
        """正常路径：普通代码变更"""
        from test_skill_integration import SkillExecutionEngine
        engine = SkillExecutionEngine("review_pr", mock_tool_registry)
        result = await engine.execute({
            "path": "src/main.py",
            "branch": "feature/add-auth",
        })
        assert result["status"] == "ok"

    @pytest.mark.asyncio
    async def test_review_missing_file(self, mock_tool_registry):
        """异常路径：文件不存在"""
        engine = SkillExecutionEngine("review_pr", mock_tool_registry)
        result = await engine.execute({
            "path": "src/nonexistent.py",
            "branch": "feature/add-auth",
        })
        assert result["status"] == "failed"

    @pytest.mark.asyncio
    async def test_review_no_changes(self, mock_tool_registry):
        """边界条件：无变更"""
        engine = SkillExecutionEngine("review_pr", mock_tool_registry)
        result = await engine.execute({
            "path": "README.md",
            "branch": "feature/add-auth",
        })
        assert result["status"] == "no_changes"
```

```python
# tests/e2e/test_code_review_e2e.py
import pytest


class TestCodeReviewSkillE2E:
    """E2E 测试 - 需要 Docker 沙箱"""

    @pytest.mark.slow
    @pytest.mark.docker
    def test_full_pipeline(self, sandbox):
        """完整的端到端测试"""
        from e2e.test_e2e_code_review import TestCodeReviewSkillE2E
        tester = TestCodeReviewSkillE2E()
        tester.test_full_review_flow(sandbox)
```

---

## 八、思考题

1. **非确定性输出测试**：LLM 的非确定性输出使得传统"期望值断言"失效。假设你发现同一个 Skill 在同样的输入下，一次调用了 3 个工具，另一次调用了 4 个工具——两种调用序列都产生了正确的最终结果。你应该把这种情况视为测试失败还是接受？如何设计能够包容合理变化、但捕获真正错误的断言策略？

2. **Mock 的边界在哪里**：在集成测试中，Mock 工具会返回预设数据。但如果 Mock 数据与真实工具的行为差异过大，集成测试的"绿灯"可能产生虚假的安全感。请分析以下场景：你 Mock 了一个搜索工具的返回值，假设它总是返回 5 条结果，但真实环境下搜索工具返回 0 条结果时 Skill 会产生错误。如何在 Mock 的真实性和测试的可控性之间找到平衡点？

3. **E2E 测试的成本控制**：完整的 E2E 测试需要真实的 Agent 执行，每次调用都会消耗 Token（即真实费用）。如果一次完整的 E2E 测试平均消耗 20K Token，每天运行 50 次 E2E 测试，每月成本是多少？你如何设计"分级 E2E 策略"——即在日常提交中只运行最小 E2E 集，在发布前运行全量 E2E 集？请设计一个三级 E2E 分级方案。

4. **快照测试的脆弱性**：快照测试容易因为输出中微小的非功能性变化（如 JSON 字段顺序变化、时间戳格式变化）而产生误报。请设计一个"智能快照比较器"，能够区分"真正的语义变化"和"无意义的格式变化"，并写出核心的比较逻辑伪代码。

---

## 九、本章小结

本章建立了 Skill 测试的完整体系，核心要点如下：

1. **Skill 测试金字塔**：单元测试（指令质量）→ 集成测试（工具交互）→ E2E 测试（全链路验证），每层有不同的测试焦点、执行频率和时间成本

2. **单元测试实践**：YAML Schema 校验确保元数据的结构正确性；指令完整性检查确保指令体包含角色、流程、约束等必需要素；工具声明验证确保声明与引用的一致性

3. **集成测试实践**：Mock 工具框架拦截工具调用并返回预设数据，支持正常路径、异常路径和边界条件的覆盖；断言策略从"值断言"转向"顺序断言"和"结构断言"

4. **E2E 测试实践**：Docker 沙箱提供隔离的执行环境；全链路验证从输入到输出覆盖完整流程；快照测试快速发现回归问题

5. **回归测试套件**：CI/CD 中自动按阶段运行三层测试；指令覆盖、路径覆盖、工具覆盖和异常覆盖构成 Skill 特有的质量度量体系

Skill 测试的核心挑战在于测试对象的非确定性和自然语言特性。传统软件测试的"精确断言"模式在这里让位于"模式匹配"和"结构验证"。一个好的 Skill 测试不是断言"输出必须是 X"，而是断言"输出在合理的模式范围内，并且没有触发已知的反模式"。

---

## 十、参考资料

- Cohn, M. (2009). *Succeeding with Agile: Software Development Using Scrum*. Addison-Wesley. —— 测试金字塔（Test Pyramid）概念的原始提出者，本章的三层金字塔结构受其启发
- Fowler, M. (2012). "TestPyramid". *martinfowler.com/bliki/TestPyramid.html*. —— 测试金字塔的经典阐述
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley. —— Mock 对象模式和测试反模式的权威参考
- [Agent Skills Open Standard (agentskills.io)](https://agentskills.io) —— SKILL.md 开放标准，测试用例中的 YAML Schema 定义参考了该标准
- [pytest-asyncio Documentation](https://pytest-asyncio.readthedocs.io/) —— 异步测试框架，本章的集成测试和 E2E 测试使用了 pytest-asyncio
- [Docker SDK for Python](https://docker-py.readthedocs.io/) —— 沙箱环境的构建基础
- [GitHub Actions Documentation](https://docs.github.com/en/actions) —— CI/CD 流水线配置参考
- [ClawHub Skills Marketplace](https://clawhub.dev/skills) —— 社区 Skills 市场，本章测试场景设计参考了社区中优秀 Skill 的测试实践
- Fewster, M., & Graham, D. (1999). *Software Test Automation*. ACM Press/Addison-Wesley. —— 自动化测试的经典著作，本章回归测试套件的设计参考了其中的分层自动化策略

---

[← 上一章：复杂 Skill 组合与编排](./08-composition-orchestration) | [返回索引](./) | [下一章：Token 优化与性能调优 →](./10-token-optimization)
