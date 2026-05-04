# SKILL.md 完整规范与高级特性

> 从"YAML 前置元数据 + Markdown 指令体"的基础认知，深入到全部字段定义、缓存架构、Schema 版本化策略与格式选型对比 | 预计阅读时间：35 分钟

---

## 一、引言

基础模块中我们学习了 SKILL.md 的基本结构：YAML 前置元数据（frontmatter）承载结构化信息，Markdown 指令体承载执行策略。这个两层结构简洁优雅，但在生产环境中，我们需要面对更复杂的问题：

- 一个生产级 SKILL.md 到底能声明哪些字段？安全约束、执行模式、输出规范如何配置？
- 当系统中存在数十个 Skill 时，如何高效管理它们的加载和缓存？
- SKILL.md 的 Schema 版本如何演进？向前兼容的策略是什么？
- 为什么业界选择了 Markdown + YAML，而不是 JSON Schema、TOML 或 Python DSL？

本章将逐一回答这些问题，把 SKILL.md 从"入门级认知"提升到"生产级掌握"。

---

## 二、YAML 全部字段详解

### 2.1 基础元信息

每个 SKILL.md 以 `---` 分隔的 YAML 前置元数据开始。所有字段可分为若干组，下面逐一展开。

#### name

Skill 的唯一标识符，使用 **snake_case** 命名风格。

```yaml
name: code_review
# 正确：小写字母 + 下划线
# 错误：code-review（中划线）、CodeReview（驼峰）、Code Review（空格）
```

命名规范没有强制约束，但社区建议遵循以下层级结构：

```
# 按领域分组：{domain}_{action}
code_review           # 代码审查
test_generation       # 测试生成
docker_compose_lint   # Docker 编排检查

# 按功能分组：{action}_{target}
parse_logs            # 日志解析
analyze_performance   # 性能分析
```

**最佳实践**：name 应该自描述，让人一看就知道 Skill 的用途。过长的名字（超过 40 个字符）应该考虑拆分。

#### version

遵循语义化版本规范（SemVer）`MAJOR.MINOR.PATCH`：

```yaml
version: 2.1.0
```

版本号的意义在 Skill 场景中与软件包不完全相同，具体差异在第四章详细分析。简言之：

- MAJOR：输出格式或策略的重大变更，旧消费者需要适配
- MINOR：新增能力（如增加语言支持），向后兼容
- PATCH：修正误报、优化提示词、修复描述歧义

#### description

一句话功能描述，是 Agent 判断"这个 Skill 是否与当前任务相关"的重要依据。

```yaml
# 不推荐：过于笼统
description: "审查代码"

# 推荐：明确职责和边界
description: "审查 Pull Request 中的代码变更，识别安全漏洞和逻辑错误，生成结构化报告"
```

::: tip description 的撰写技巧
好的 description 应该让 Agnet 在 0.5 秒内判断出"要不要用这个 Skill"。建议包含三个要素：**动作**（审查/生成/分析）、**对象**（代码变更/测试/日志）、**产出**（结构化报告/测试用例/趋势分析）。
:::

### 2.2 上下文约束 scope

scope 定义了 Skill 的适用边界，Agnet 只有在当前上下文满足所有约束时才会激活该 Skill。

```yaml
scope:
  # 适用的编程语言
  languages:
    - python
    - typescript

  # 工作目录或分支约束
  directories:
    - src/
    - tests/
  branches:
    - main
    - feature/*

  # 文件规模约束
  max_files: 50
  max_file_lines: 1000
  max_file_size_kb: 512

  # 环境约束
  environments:
    - development
    - staging
  git_clean: true  # 要求工作区干净
```

**约束的类型和语义**：

| 字段 | 类型 | 语义 | 示例 |
|------|------|------|------|
| `languages` | string[] | 项目包含的编程语言 | `["python", "go"]` |
| `directories` | string[] | Skill 适用的目录路径 | `["backend/"]` |
| `branches` | string[] | 适用的 Git 分支模式 | `["feature/*"]` |
| `max_files` | int | 最多处理文件数 | `50` |
| `max_file_lines` | int | 单个文件最大行数 | `1000` |
| `max_file_size_kb` | int | 单个文件最大 KB | `512` |
| `environments` | string[] | 适用环境 | `["development"]` |
| `git_clean` | bool | 是否要求工作区无未提交变更 | `true` |

::: warning scope 的匹配语义
scope 中的约束默认是"且"的关系——所有约束都必须满足。对于 `languages`、`directories` 这类集合字段，只要当前项目包含其中一项即满足。这意味着 `languages: [python, go]` 表示"只要项目包含 python 或 go 之一"就可以应用，不是"必须同时包含 python 和 go"。
:::

### 2.3 工具声明 tools

tools 字段声明了 Skill 执行所需的全部工具及其属性。

```yaml
tools:
  - name: git_diff
    description: "获取 PR 的变更内容"
    required: true
    type: mcp
    server: filesystem
    fallback: manual_diff

  - name: run_linter
    description: "运行代码风格检查"
    required: false
    type: function
    fallback: null

  - name: send_report
    description: "发送审查报告到指定渠道"
    required: false
    type: api
    endpoint: "https://api.example.com/reports"
    auth: bearer
```

每个工具条目的完整结构：

| 字段 | 必填 | 类型 | 说明 |
|------|------|------|------|
| `name` | 是 | string | 工具名称，与运行时注册的工具名匹配 |
| `description` | 是 | string | 功能描述，帮助 LLM 理解何时使用该工具 |
| `required` | 否 | bool | 是否必需。默认为 `true` |
| `type` | 否 | enum | 工具类型：`mcp` / `function` / `api` |
| `server` | 否 | string | 当 `type=mcp` 时，指定 MCP 服务器名 |
| `endpoint` | 否 | string | 当 `type=api` 时，指定 API 端点 |
| `auth` | 否 | string | 当 `type=api` 时，认证方式 |
| `fallback` | 否 | string | 当主工具不可用时的替代工具名 |

**required 的设计哲学**：

标记为 `required: false` 的工具意味着 Skill 可以在缺少该工具时降级运行。这给了运行时更大的灵活性——在某些环境（如 CI 中缺少 linter），Skill 仍能执行核心流程，只是跳过非核心步骤。

### 2.4 输出规范 output

output 定义了 Skill 执行结果的格式和结构，是 Result 规范的可编程实现。

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
    - name: statistics
      description: "代码质量指标统计"
      required: false
      constraints:
        format: table
    - name: appendix
      description: "附录（详细数据）"
      required: false
```

**多 section 组织**：

当输出包含多种类型的信息时，通过多个 section 将输出结构化。每个 section 可以独立配置约束条件，便于后续的自动化验证。

| section 字段 | 必填 | 类型 | 说明 |
|-------------|------|------|------|
| `name` | 是 | string | 段落名称，用于验证器匹配 |
| `description` | 是 | string | 段落内容的自然语言描述 |
| `required` | 是 | bool | 该段落是否必须输出 |
| `constraints` | 否 | object | 格式约束（长度、条目数、格式类型） |

### 2.5 依赖声明 dependencies

dependencies 声明了 Skill 所依赖的其他 Skills、工具包或运行时。

```yaml
dependencies:
  # Skill 依赖
  - name: search_code
    version: ">=1.0.0 <2.0.0"
    type: skill

  # 工具包依赖
  - name: @anthropic/skills-core
    version: "~2.1.0"
    type: package

  # 运行时依赖
  - name: python-runtime
    version: ">=3.10"
    type: runtime
```

**版本范围语法**：

| 语法 | 含义 | 示例 |
|------|------|------|
| `>=1.0.0 <2.0.0` | 兼容 1.x 全系列 | 允许 1.0.0 到 1.99.99 |
| `~2.1.0` | 兼容补丁版本 | 允许 2.1.0 到 2.1.99 |
| `^1.2.0` | 兼容 minor 范围 | 允许 1.2.0 到 1.99.99 |
| `>=3.10` | 最低版本限制 | 允许 3.10 及以上 |
| `1.0.0` | 固定版本 | 仅允许 1.0.0 |

### 2.6 安全策略 security（高级字段）

security 字段定义了 Skill 的安全约束边界。它是高级选项，默认情况下 Skill 继承运行时的默认安全策略。

```yaml
security:
  no_network: false               # 是否禁止网络访问（默认 false）
  no_file_write: true              # 是否禁止写文件（默认 false）
  no_command_execution: true       # 是否禁止命令执行（默认 false）
  data_retention: session          # 数据保留策略：session | persist | no-store
  allowed_paths:                   # 允许读写的文件路径白名单
    - /home/user/project/src/
    - /home/user/project/tests/
  allowed_networks:                # 允许访问的网络地址白名单
    - api.github.com
    - pypi.org
  allowed_commands:                # 允许执行的命令白名单
    - git
    - ruff
    - eslint
```

**各字段含义**：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `no_network` | bool | false | 禁止 Skill 发起任何网络请求 |
| `no_file_write` | bool | false | 禁止 Skill 写入文件系统 |
| `no_command_execution` | bool | false | 禁止 Skill 执行 Shell 命令 |
| `data_retention` | enum | session | 数据处理后是否应该被清除 |
| `allowed_paths` | string[] | [] | 文件操作的白名单路径 |
| `allowed_networks` | string[] | [] | 网络请求的白名单域名 |
| `allowed_commands` | string[] | [] | 命令执行的白名单 |

安全策略的核心设计思想是**最小权限原则**（Principle of Least Privilege）：默认拒绝，按需开放。一个只做代码审查的 Skill 不应该有网络访问权限；一个只读的审计 Skill 不应该有文件写入权限。

::: warning 安全策略的执行层级
security 字段是"声明式"的——它告诉运行时这个 Skill 期望的安全边界。实际执行取决于运行时的安全沙箱能力。如果运行时不支持细粒度权限控制，security 字段会被忽略。
:::

### 2.7 执行模式 execution（高级字段）

execution 字段控制 Skill 的运行时行为。

```yaml
execution:
  mode: sync                     # sync | async
  timeout: 300                   # 超时时间（秒）
  retry:
    count: 3                     # 最大重试次数
    backoff: exponential         # 退避策略：fixed | exponential | linear
    backoff_base: 2.0            # 退避基数（秒）
    max_backoff: 60              # 最大退避间隔（秒）
  concurrency_limit: 1           # 并发执行限制
  priority: normal               # normal | high | low
```

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | enum | sync | 执行模式：同步或异步 |
| `timeout` | int | 300 | 超时时间（秒），超时后自动终止 |
| `retry.count` | int | 0 | 失败重试次数 |
| `retry.backoff` | enum | exponential | 退避策略 |
| `concurrency_limit` | int | 1 | 同一时刻最多执行实例数 |
| `priority` | enum | normal | 任务队列优先级 |

**退避策略对比**：

```
fixed:        5s → 5s → 5s → ...（固定间隔）
linear:       5s → 10s → 15s → ...（线性增长）
exponential:  2s → 4s → 8s → ...（指数增长）
```

推荐的默认配置是 `exponential` 退避，它在快速重试和避免雪崩之间取得了良好平衡。

### 2.8 标签 tags

tags 用于 Skills 的分类、搜索和过滤。一个好的标签系统能大幅提升 Agent 的 Skill 发现效率。

```yaml
tags:
  - code-review
  - security
  - python
  - git
```

**标签设计原则**：

1. **层级化**：从通用到具体。`quality > code-review > security`
2. **可搜索**：使用团队通用的术语，避免个人化缩写
3. **一致性**：同一概念统一命名。如果用了 `code-review`，就不要用 `codereview` 或 `code_review`

### 2.9 完整 YAML 示例

下面是一个包含所有高级字段的生产级 YAML 前置元数据：

```yaml
---
name: code_review
version: 2.1.0
description: "审查 Pull Request 代码变更，识别安全漏洞、逻辑错误和代码质量问题，生成结构化审查报告"
author: engineering-team
license: MIT

tags:
  - code-review
  - security
  - quality-assurance
  - git

scope:
  languages:
    - python
    - typescript
    - go
  directories:
    - src/
  max_files: 50
  max_file_lines: 1000
  max_file_size_kb: 512
  environments:
    - development
    - staging

tools:
  - name: git_diff
    description: "获取 PR 的变更内容"
    required: true
    type: mcp
    server: filesystem
    fallback: manual_diff
  - name: search_code
    description: "在代码库中搜索相关上下文"
    required: true
    type: mcp
    server: filesystem
  - name: ast_parser
    description: "解析代码的抽象语法树"
    required: false
    type: function
  - name: run_linter
    description: "运行代码风格检查"
    required: false
    type: function
    fallback: null

output:
  format: markdown
  sections:
    - name: summary
      description: "变更概要和影响范围"
      required: true
      constraints:
        max_length: 500
    - name: findings
      description: "发现的问题列表（含严重程度标记）"
      required: true
      constraints:
        min_items: 1
        max_items: 50
    - name: suggestions
      description: "改进建议"
      required: false

dependencies:
  - name: search_context
    version: ">=1.0.0 <2.0.0"
    type: skill

security:
  no_network: true
  no_file_write: true
  no_command_execution: false
  data_retention: session
  allowed_commands:
    - ruff
    - eslint

execution:
  mode: sync
  timeout: 300
  retry:
    count: 2
    backoff: exponential
    backoff_base: 2.0
    max_backoff: 30
  concurrency_limit: 1
---
```

---

## 三、渐进式披露三级缓存实现

基础模块中介绍了渐进式披露的三阶段（注册/激活/执行），本章将从缓存架构的角度，深入分析其工程实现。

### 3.1 第一阶段：注册 —— 元信息缓存

第一阶段加载每个 Skill 的元信息（name、version、description、tags），采用**内存 + 持久化双缓存**策略。

```python
import json
import hashlib
from pathlib import Path
from typing import Dict, Optional

class RegistrationCache:
    """Skill 注册信息双缓存"""

    def __init__(self, cache_dir: str = ".claude/cache/skills"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.memory_cache: Dict[str, dict] = {}

    def _cache_key(self, skill_path: str) -> str:
        """基于文件路径和修改时间生成缓存键"""
        path = Path(skill_path)
        mtime = path.stat().st_mtime
        raw = f"{skill_path}:{mtime}"
        return hashlib.sha256(raw.encode()).hexdigest()[:16]

    def get_registration(self, skill_path: str) -> Optional[dict]:
        """双缓存读取：优先从内存读取，miss 时从持久化缓存读取"""
        key = self._cache_key(skill_path)

        # 1. 尝试从内存缓存读取
        if key in self.memory_cache:
            return self.memory_cache[key]

        # 2. 尝试从持久化缓存读取
        cache_file = self.cache_dir / f"{key}.json"
        if cache_file.exists():
            with open(cache_file) as f:
                data = json.load(f)
            self.memory_cache[key] = data  # 回填内存缓存
            return data

        return None

    def set_registration(self, skill_path: str, metadata: dict):
        """写入双缓存"""
        key = self._cache_key(skill_path)

        # 写入内存缓存
        self.memory_cache[key] = metadata

        # 写入持久化缓存
        cache_file = self.cache_dir / f"{key}.json"
        with open(cache_file, "w") as f:
            json.dump(metadata, f)
```

**为什么需要双缓存**？

- **内存缓存**：毫秒级访问，适合热路径（Agent 频繁判断"哪个 Skill 匹配当前任务"）
- **持久化缓存**：进程级持久化，重启后无需重新扫描所有 Skill 文件
- **失效策略**：基于文件修改时间（mtime）生成缓存键，任何文件变更都会自动导致缓存 miss

### 3.2 第二阶段：激活 —— 工具摘要按需加载（LRU）

第二阶段加载 scope、tools 和策略摘要。由于 Agent 可能同时评估多个候选 Skill，但最终只会激活其中少数，这里需要**LRU（Least Recently Used）淘汰策略**来控制内存占用。

```python
from collections import OrderedDict
from typing import Dict, Optional

class LRUActivationCache:
    """LRU 淘汰的激活信息缓存"""

    def __init__(self, max_entries: int = 20):
        self.max_entries = max_entries
        self.cache: OrderedDict[str, dict] = OrderedDict()

    def get(self, skill_name: str) -> Optional[dict]:
        """读取并更新 LRU 位置"""
        if skill_name not in self.cache:
            return None
        self.cache.move_to_end(skill_name)  # 移动到末尾（最近使用）
        return self.cache[skill_name]

    def set(self, skill_name: str, activation_data: dict):
        """写入，如果超出容量则淘汰最久未使用的条目"""
        if skill_name in self.cache:
            self.cache.move_to_end(skill_name)
        self.cache[skill_name] = activation_data

        while len(self.cache) > self.max_entries:
            # 淘汰最久未使用的条目（第一个）
            evicted, _ = self.cache.popitem(last=False)
            print(f"LRU evict: {evicted}")

    def has(self, skill_name: str) -> bool:
        return skill_name in self.cache
```

LRU 容量的选择取决于几个因素：

- 每个 Skill 的激活信息大约 300-500 tokens
- 可用内存预算
- 典型工作流中同时激活的 Skill 数量

对于大多数场景，`max_entries=20` 是一个合理的默认值。

### 3.3 第三阶段：执行 —— 完整指令懒加载

第三阶段是最晚的加载时机——只有当 Agent 决定实际使用某个 Skill 时，才将完整指令体读入内存。

```python
class ExecutionLoader:
    """完整指令懒加载器"""

    def __init__(self):
        self.loaded: Dict[str, dict] = {}

    def load(self, skill_name: str, skill_path: str) -> dict:
        """按需加载完整指令（仅当尚未加载时）"""
        if skill_name not in self.loaded:
            with open(skill_path) as f:
                content = f.read()
            self.loaded[skill_name] = {
                "full_instructions": self._extract_body(content),
                "output_schema": self._extract_output_schema(content),
            }
        return self.loaded[skill_name]

    def _extract_body(self, content: str) -> str:
        """提取 Markdown 指令体"""
        parts = content.split("---", 2)
        return parts[2].strip() if len(parts) > 2 else ""

    def _extract_output_schema(self, content: str) -> dict:
        """提取 YAML 中的 output 字段"""
        import yaml
        parts = content.split("---", 2)
        if len(parts) > 1:
            metadata = yaml.safe_load(parts[1])
            return metadata.get("output", {})
        return {}

    def unload(self, skill_name: str):
        """主动卸载不再使用的 Skill（释放内存）"""
        self.loaded.pop(skill_name, None)
```

### 3.4 缓存失效与更新机制

当 SKILL.md 文件发生变更时，所有三个缓存层级都需要相应失效。**文件变更监听**是实现这一机制的基础。

```python
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class SkillFileWatcher(FileSystemEventHandler):
    """监听 SKILL.md 文件变更并触发缓存失效"""

    def __init__(self, reg_cache: RegistrationCache,
                 act_cache: LRUActivationCache,
                 exec_loader: ExecutionLoader):
        self.reg_cache = reg_cache
        self.act_cache = act_cache
        self.exec_loader = exec_loader

    def on_modified(self, event):
        if not event.src_path.endswith("SKILL.md"):
            return

        path = Path(event.src_path)
        skill_name = path.parent.name  # 目录名作为 Skill name

        # 失效所有三级缓存
        self.reg_cache.memory_cache.pop(
            self.reg_cache._cache_key(str(path)), None
        )
        self.act_cache.cache.pop(skill_name, None)
        self.exec_loader.unload(skill_name)

        print(f"Cache invalidated for {skill_name} (file modified)")
```

### 3.5 三级缓存的统一管理

将三个缓存组件统一管理，对外提供简洁的接口：

```python
class ProgressiveDisclosureManager:
    """渐进式披露三级缓存管理器"""

    def __init__(self):
        self.reg_cache = RegistrationCache()
        self.act_cache = LRUActivationCache(max_entries=20)
        self.exec_loader = ExecutionLoader()
        self.watcher = SkillFileWatcher(
            self.reg_cache, self.act_cache, self.exec_loader
        )

    def register(self, skill_path: str) -> dict:
        """第一级：注册（从缓存读取元信息）"""
        cached = self.reg_cache.get_registration(skill_path)
        if cached:
            return cached

        # 缓存 miss，解析文件
        with open(skill_path) as f:
            content = f.read()
        parts = content.split("---", 2)
        import yaml
        metadata = yaml.safe_load(parts[1])
        minimal = {
            "name": metadata["name"],
            "version": metadata.get("version", "0.0.0"),
            "description": metadata.get("description", ""),
            "tags": metadata.get("tags", []),
        }
        self.reg_cache.set_registration(skill_path, minimal)
        return minimal

    def activate(self, skill_name: str, skill_path: str) -> dict:
        """第二级：激活（含 LRU 淘汰）"""
        cached = self.act_cache.get(skill_name)
        if cached:
            return cached

        with open(skill_path) as f:
            content = f.read()
        import yaml
        parts = content.split("---", 2)
        metadata = yaml.safe_load(parts[1])

        activation_data = {
            "name": metadata["name"],
            "scope": metadata.get("scope", {}),
            "tools": metadata.get("tools", []),
            "dependencies": metadata.get("dependencies", []),
            "security": metadata.get("security", {}),
            "execution": metadata.get("execution", {}),
        }
        self.act_cache.set(skill_name, activation_data)
        return activation_data

    def execute(self, skill_name: str, skill_path: str) -> dict:
        """第三级：执行（懒加载完整指令）"""
        return self.exec_loader.load(skill_name, skill_path)
```

---

## 四、YAML Schema 版本化策略

### 4.1 Schema 版本 vs Skill 版本

这是两个容易混淆的概念，必须清晰区分：

| 维度 | Schema 版本 | Skill 版本 |
|------|-------------|-----------|
| **描述对象** | SKILL.md 文件格式规范本身 | 某个 Skill 的内容逻辑 |
| **影响范围** | 所有 SKILL.md 文件 | 单个 SKILL.md 文件 |
| **升级频率** | 数月甚至数年一次 | 按需发布 |
| **兼容性** | 需要所有解析器同时更新 | 仅影响该 Skill 的消费者 |

```yaml
# Schema 版本：定义在规范层面
# 在文件头部通过 $schema 字段声明
$schema: "https://agentskills.io/schemas/v1.0/skill-md"

# Skill 版本：定义在元信息层面
name: code_review
version: 2.1.0
```

### 4.2 Schema 向前兼容的演进模式

Schema 版本的演进遵循以下原则：

1. **新增字段必须是 optional**：新版本可以添加可选字段，但不能新增必填字段
2. **废弃字段使用 deprecated 标记**：旧字段保留但标记为 deprecated，解析器应给出警告
3. **字段语义不可变更**：不能改变已有字段的含义

**v1.0 到 v1.1 的演进示例**：

```yaml
# v1.0 schema（原始版本）
# 定义字段：
#   - name (required)
#   - version (required)
#   - description (required)
#   - tags (optional)
#   - scope (optional)
#   - tools (optional)

# v1.1 schema（演进版本）
# 新增字段（均为 optional）：
#   - security (新增)
#   - execution (新增)
#   - $schema (新增，用于声明自身的 schema 版本)
# 废弃字段（保留兼容，标记 deprecated）：
#   - license (deprecated: "请使用 metadata.license")
# 结构变更：
#   - tools 条目新增字段：type, server, fallback（均为 optional）
```

```yaml
# 符合 v1.1 schema 的向后兼容示例
$schema: "https://agentskills.io/schemas/v1.1/skill-md"
name: code_review
version: 1.0.0
description: "代码审查"
license: MIT
# ^^ license 仍可使用，但解析器会给出 deprecation 警告

security:
  no_network: true
# ^^ v1.1 新增的安全字段，v1.0 解析器会忽略它（不会报错）
```

**兼容性矩阵**：

| 变更类型 | 向前兼容？ | 说明 |
|---------|-----------|------|
| 新增 optional 字段 | 兼容 | 旧解析器会忽略 |
| 新增 required 字段 | **不兼容** | 旧解析器报错 |
| 废弃字段（保留） | 兼容 | 旧解析器正常工作 |
| 移除字段 | **不兼容** | 旧解析器可能报错 |
| 修改字段语义 | **不兼容** | 解析结果不一致 |
| 收缩取值范围 | **不兼容** | 旧值可能失效 |

---

## 五、SKILL.md vs 其他格式

### 5.1 候选格式概览

业界在定义 Agent 策略时，有多种格式选择：

```yaml
# —— JSON Schema ——
# 优点：工具生态丰富（验证器、代码生成器）
# 缺点：可读性差，不支持自然语言指令

# —— TOML ——
# 优点：比 YAML 更简洁，歧义少
# 缺点：表达能力有限，不支持复杂嵌套

# —— Python DSL (Pydantic) ——
# 优点：类型安全，IDE 支持好
# 缺点：非技术用户无法使用，运行时耦合

# —— YAML without Markdown ——
# 优点：纯结构化，解析简单
# 缺点：无法表达复杂的自然语言策略
```

### 5.2 多维度对比

| 维度 | SKILL.md | JSON Schema | TOML | Python DSL | YAML-only |
|------|----------|-------------|------|-----------|-----------|
| **人机可读性** | 高（Markdown + YAML 自然） | 低（纯 JSON 结构） | 中（简洁但指令嵌入难） | 低（需要编程知识） | 中（无自然语言段落） |
| **表达能力** | 高（结构化 + 自然语言） | 中（仅结构化） | 低（有限类型系统） | 高（完整编程语言能力） | 低（无自然语言载体） |
| **工具支持** | 中（新兴标准，工具正在丰富） | 高（JSON Schema 验证器遍布各语言） | 中（各语言解析器） | 高（IDE/类型检查/Pyright） | 中（YAML 解析器通用） |
| **扩展性** | 高（YAML 层可新增字段，Markdown 层可随意扩展） | 低（Schema 升级需要协调） | 中（新增 section 需要设计） | 中（Python 类需要维护） | 中（但自然语言的缺失限制了扩展） |
| **非技术用户友好度** | 高 | 低 | 中 | 极低 | 中 |
| **版本控制友好度** | 高（纯文本，diff 清晰） | 中（结构化 diff 但冗长） | 中（类似 INI，diff 可读） | 低（diff 可能包含格式化噪声） | 高 |
| **解析复杂度** | 低（YAML + Markdown 分割即可） | 中（需要完整 JSON Schema 验证器） | 低 | 高（需要 Python 环境） | 低 |
| **LLM 处理友好度** | 高（LLM 擅长理解和生成 Markdown） | 中（LLM 能生成 JSON 但不如 Markdown 直观） | 低（TOML 出现在训练数据中较少） | 高（LLM 擅长 Python 代码） | 中 |

### 5.3 为什么 Markdown + YAML 胜出

SKILL.md 选择 Markdown + YAML 的双层结构不是偶然的。有几个关键原因：

1. **自然语言是不可或缺的策略载体**。工具依赖和输出规范可以结构化，但执行策略的本质是"教 Agent 做事"——这需要自然语言。纯结构化的格式（JSON Schema、TOML、纯 YAML）无法承载复杂的策略指令。

2. **YAML 是比 JSON 更好的配置语言**。YAML 支持注释、多行字符串、锚点引用，对人类更友好。JSON 虽然解析更简单，但作为人类编写的配置语言存在天然缺陷——不能加注释是最致命的。

3. **LLM 的处理倾向性**。LLM 的训练数据中包含了海量的 Markdown 文档。让 LLM "阅读一段 Markdown 并遵照执行"比"解析一段 JSON Schema 并执行"要自然得多。

4. **版本控制的友好度**。Markdown + YAML 的文本结构在 Git diff 中清晰可读。相比之下，JSON 的括号闭合变化、Python DSL 的 import 顺序变化都会产生噪声 diff。

5. **渐进式披露的自然支持**。YAML 前置元数据天然是"可以快速解析的结构化摘要"，Markdown 正文是"需要时才读取的详细指令"。这种分层结构与渐进式披露的三级加载完美匹配。

---

## 六、完整 SKILL.md 示例（生产级）

下面是一个包含本章全部高级字段的生产级 SKILL.md 示例：

```yaml
---
$schema: "https://agentskills.io/schemas/v1.1/skill-md"
name: security_audit
version: 2.0.0
description: "对代码库执行全量安全审计，识别 OWASP Top 10 漏洞、敏感信息泄露和不安全配置"
author: security-team@example.com
license: MIT

tags:
  - security
  - audit
  - owasp
  - vulnerability-scan

scope:
  languages:
    - python
    - typescript
    - go
    - java
  directories:
    - src/
    - api/
  max_files: 200
  max_file_lines: 2000
  environments:
    - staging
    - production

tools:
  - name: git_diff
    description: "获取代码变更内容"
    required: true
    type: mcp
    server: filesystem
  - name: search_code
    description: "在代码库中搜索模式"
    required: true
    type: mcp
    server: filesystem
  - name: ast_parser
    description: "解析抽象语法树"
    required: false
    type: function
  - name: secret_scanner
    description: "扫描硬编码密钥和敏感信息"
    required: true
    type: mcp
    server: security-scanner
  - name: sbom_generator
    description: "生成软件物料清单"
    required: false
    type: function

output:
  format: markdown
  sections:
    - name: executive_summary
      description: "审计概要（问题总数、严重分布、修复建议数量）"
      required: true
      constraints:
        max_length: 800
    - name: critical_findings
      description: "严重安全问题列表"
      required: true
      constraints:
        min_items: 0
        max_items: 100
    - name: dependency_audit
      description: "第三方依赖安全审计结果"
      required: false
    - name: remediation_plan
      description: "修复计划和建议优先级"
      required: true
      constraints:
        min_items: 1

dependencies:
  - name: dependency_check
    version: ">=1.2.0 <2.0.0"
    type: skill

security:
  no_network: false
  no_file_write: true
  no_command_execution: false
  data_retention: no-store
  allowed_commands:
    - grype
    - trivy
    - semgrep

execution:
  mode: sync
  timeout: 600
  retry:
    count: 2
    backoff: exponential
    backoff_base: 5.0
    max_backoff: 120
  concurrency_limit: 1
  priority: high
---
```

---

## 思考题

::: info 检验你的理解

1. 一个 Skill 声明了 `security.no_network: true`，但其 `tools` 中有一个 `type: api` 的工具。这会产生什么样的矛盾？运行时应该如何处理这种配置冲突？

2. 假设一个基于 Skywork-MoE 的 Agent 框架支持 Skill 执行超时后自动降级。如果 `code_review` Skill 的 `execution.timeout=300`，但某次审查因为代码量过大在 300 秒内未完成，降级策略应该怎么设计？是返回部分结果，还是跳过该次审查？

3. Schema 从 v1.0 演进到 v1.1 时，新增了 `execution.mode` 字段（可选，默认 sync）。如果一个 v1.0 的解析器读取了一个包含 `execution.mode: async` 的 v1.1 SKILL.md，会发生什么？这个问题如何通过更好的 Schema 设计来避免？

4. 多级缓存中，如果开发者在编辑 SKILL.md 时使用软链接（symlink），`RegistrationCache._cache_key` 基于 mtime 的失效策略是否会失效？应该如何改进？

:::

---

## 本章小结

- ✅ YAML 前置元数据分为八大字段族：基础元信息、scope、tools、output、dependencies、security、execution、tags
- ✅ security 和 execution 是高级字段，分别控制安全边界和运行时行为
- ✅ 渐进式披露三级缓存采用"内存 + 持久化"双缓存 + LRU 淘汰 + 懒加载的组合策略
- ✅ 文件变更监听触发三级缓存的逐级失效，确保缓存与文件系统的一致性
- ✅ Schema 版本描述的是文件格式规范，Skill 版本描述的是 Skill 内容逻辑，两者正交
- ✅ Schema 向前兼容的核心原则：新增字段必须是 optional，废弃字段保留兼容
- ✅ Markdown + YAML 在人机可读性、表达能力、LLM 友好度和渐进式披露适配性上全面优于 JSON Schema、TOML、Python DSL 和纯 YAML

---

## 参考资料

- [Agent Skills Open Standard - SKILL.md Specification v1.1](https://agentskills.io) - 官方开放标准中的完整字段定义
- [SemVer.org - Semantic Versioning 2.0.0](https://semver.org/) - 语义化版本规范
- [OWASP Top 10 - 2021](https://owasp.org/www-project-top-ten/) - 安全审计 Skill 的检查参考
- [YAML Spec 1.2.2](https://yaml.org/spec/1.2.2/) - YAML 语言规范
- [P-E-N - Progressive Disclosure in AI Systems](https://www.interaction-design.org/literature/topics/progressive-disclosure) - 渐进式披露在人机交互中的应用
