# Token 优化与性能调优

> Token 效率的本质是在有限预算内最大化执行质量，而非单纯追求"少"。上下文窗口的每一寸空间都应承载明确的策略价值 | 预计阅读时间：35 分钟

---

## 一、引言

"这个 Skill 写的太长了，Token 太多，要精简。"

这可能是关于 Token 优化最常见的误解。Token 优化的目标从来不是让 SKILL.md 文件变得尽可能短——如果长度不是问题，为什么不去掉所有指令让文件变成 0 字节？

**Token 优化的真正挑战是：在有限的上下文窗口和成本预算内，让 Agent 做出更高质量的执行决策。**

考虑一个具体的数字。假设你的 Agent 框架的上下文上限是 128K tokens。你加载了系统提示词（~2K）、用户请求（~1K）、对话历史（~20K），加上当前正在执行的 Skill（假设 8K）。这 8K 的 Skill 指令用得好不好，直接决定了剩余 ~97K Token 能否产生高质量的 Agent 行为。

从这个角度看，Token 优化本质上是一个**资源分配问题**：

```
上下文窗口 = 128K tokens
├── 系统提示词: ~2K  (1.6%)
├── 用户输入:   ~1K  (0.8%)
├── 对话历史:   ~20K (15.6%)
├── Skill 指令:  ~8K (6.3%)    ← 我们优化的焦点
└── 可用余量:   ~97K (75.7%)  ← Agent 思维和工具调用的空间
```

优化 Skill 指令的 Token 消耗，不是为了省下那 8K 本身，而是为了**释放更多可用余量给 Agent 的推理和工具操作**。在 Token 计费的商业模式下，这直接转化为成本节约和执行质量的双重收益。

本章将从四个维度系统探讨 Token 优化：预算管理、缓存策略、重复消除和懒加载。每个维度都提供可操作的策略和具体示例。

---

## 二、Token 预算管理

### 2.1 渐进式披露：各阶段的最优分配

SKILL.md 的执行可以划分为三个核心阶段，每个阶段有不同 Token 需求和分配策略：

```
Skill Token 分配模型

阶段 1：解析与理解             阶段 2：执行决策             阶段 3：工具调用
┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ 角色身份           │    │ 条件判断           │    │ 构造工具参数       │
│ 任务目标           │    │ 路径选择           │    │ 解析工具返回       │
│ 约束条件           │    │ 策略制定           │    │ 输出格式化         │
├────────────────────┤    ├────────────────────┤    ├────────────────────┤
│ ~30% Token        │    │ ~40% Token         │    │ ~30% Token        │
│ 一次性加载         │    │ 随执行进度消耗     │    │ 最后一次消耗       │
└────────────────────┘    └────────────────────┘    └────────────────────┘
```

**渐进式披露（Progressive Disclosure）** 的核心思想是：不在开头的"解析与理解"阶段就倾泻所有信息，而是按需、分阶段地向 Agent 呈现指令内容。

```yaml
# 渐进式披露的 SKILL.md 结构
---
name: code_review_skill
version: 1.0.0
execution:
  mode: sequential
  progressive_disclosure: true    # 启用渐进式披露
  disclosure_strategy:
    - phase: initialization       # 阶段 1：只加载最核心的信息
      load: [metadata, role, constraints]
    - phase: execution            # 阶段 2：按步骤逐步加载
      load: by_step
    - phase: completion           # 阶段 3：加载输出格式要求
      load: [output_format]
---

## 角色

你是一个高级代码审查专家，专注于安全性、性能和代码质量。

## 约束

- 仅审查变更的文件，不审查全部代码库
- 不修改任何文件，仅提供审查意见
- 每次输出最多列出 10 个关键问题

## 执行流程

<!-- 以下内容在"执行"阶段按步骤加载 -->

### 步骤 1：获取变更
<!-- 加载工具描述和调用说明 -->

### 步骤 2：分析变更
<!-- 加载分析策略 -->

### 步骤 3：生成报告
<!-- 加载报告模板 -->

## 输出格式

## 格式要求

- 输出 JSON 格式的审查报告
- 包含 severity/category/description/suggestion 字段
```

### 2.2 不同规模 Skill 的 Token 分配策略

Skill 的规模不同，Token 分配策略也随之变化：

| Skill 规模 | 总 Token 预算 | 角色设定 | 执行流程 | 约束条件 | 输出说明 | 工具描述 | 其他 |
|-----------|-------------|---------|---------|---------|---------|---------|------|
| **小型** | ~500 tokens | 15% (75) | 30% (150) | 15% (75) | 10% (50) | 20% (100) | 10% (50) |
| **中型** | ~1500 tokens | 10% (150) | 35% (525) | 10% (150) | 10% (150) | 25% (375) | 10% (150) |
| **大型** | ~3000 tokens | 7% (210) | 40% (1200) | 8% (240) | 10% (300) | 25% (750) | 10% (300) |

策略要点：

- **小型 Skill（~500 tokens）**：精炼指令，每句话承载明确策略价值。避免冗余解释，直接使用祈使句。示例："审查变更文件，标记安全风险。"而不是"本 Skill 的目的是审查代码变更文件，并且在审查过程中需要特别关注安全相关的风险点。"

- **中型 Skill（~1500 tokens）**：执行流程和工具描述占据最大比例。中型 Skill 通常涉及 3-5 个工具调用和多个条件分支，因此执行流的清晰度直接影响正确性。

- **大型 Skill（~3000 tokens）**：约束条件和输出格式占比降低（因为它们可以复用公共模板），执行流程占比进一步提高。大型 Skill 需要详细的步骤分解和异常处理路径。

::: info Token 不是越多越好
一个常见的错误是认为"指令越详细，执行越准确"。实际上，超过一定阈值后，额外的 Token 会带来**边际收益递减**——甚至**负收益**（因为 Agent 需要在更多文本中筛选关键信息）。每 500 tokens 是一个合理的检查点：写完后问自己"这部分指令如果不写，Agent 会怎么做？如果 Agent 的行为不会显著变差，去掉它。"
:::

---

## 三、三级缓存策略

缓存是降低 Token 消耗最直接的手段。Skill 系统中存在三级缓存机会：**指令体缓存**、**工具描述缓存**和**结果缓存**。

### 3.1 指令体缓存：LRU + TTL

指令体缓存存储解析后的 SKILL.md 内容，避免重复加载和解析同一 Skill。

```python
# skill_cache.py
import hashlib
import time
from collections import OrderedDict
from typing import Any, Optional


class LRUCache:
    """LRU + TTL 缓存实现"""

    def __init__(self, capacity: int = 128, default_ttl: int = 300):
        self.capacity = capacity
        self.default_ttl = default_ttl  # 默认 5 分钟有效期
        self._cache: OrderedDict[str, "CacheEntry"] = OrderedDict()
        self._hits = 0
        self._misses = 0

    def get(self, key: str) -> Optional[Any]:
        """获取缓存项，如果过期则自动清除"""
        if key not in self._cache:
            self._misses += 1
            return None

        entry = self._cache[key]
        if time.time() > entry.expires_at:
            # TTL 过期，删除
            del self._cache[key]
            self._misses += 1
            return None

        # LRU：移到最右端
        self._cache.move_to_end(key)
        self._hits += 1
        return entry.value

    def put(self, key: str, value: Any, ttl: Optional[int] = None):
        """写入缓存项"""
        if len(self._cache) >= self.capacity:
            # LRU 淘汰：移除最久未使用的项
            self._cache.popitem(last=False)

        expires_at = time.time() + (ttl or self.default_ttl)
        self._cache[key] = CacheEntry(value, expires_at)
        self._cache.move_to_end(key)

    def invalidate(self, key: str):
        """主动失效某缓存项（版本更新时调用）"""
        self._cache.pop(key, None)

    @property
    def hit_rate(self) -> float:
        """缓存命中率"""
        total = self._hits + self._misses
        return self._hits / total if total > 0 else 0.0

    def stats(self) -> dict:
        """缓存统计信息"""
        return {
            "size": len(self._cache),
            "capacity": self.capacity,
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": f"{self.hit_rate:.1%}",
        }


class CacheEntry:
    """缓存条目"""

    def __init__(self, value: Any, expires_at: float):
        self.value = value
        self.expires_at = expires_at


class SkillInstructionCache:
    """SKILL.md 指令体缓存"""

    def __init__(self):
        self._cache = LRUCache(capacity=256, default_ttl=600)

    def load_skill(self, skill_path: str) -> str:
        """加载 SKILL.md，优先从缓存读取"""
        cache_key = self._make_key(skill_path)

        cached = self._cache.get(cache_key)
        if cached:
            return cached

        # 缓存未命中，从文件系统加载
        with open(skill_path, "r", encoding="utf-8") as f:
            content = f.read()

        self._cache.put(cache_key, content)
        return content

    def on_skill_updated(self, skill_path: str):
        """Skill 文件更新时，使缓存失效"""
        cache_key = self._make_key(skill_path)
        self._cache.invalidate(cache_key)

    def report_hit_rate(self) -> float:
        """报告缓存命中率"""
        return self._cache.hit_rate

    @staticmethod
    def _make_key(skill_path: str) -> str:
        """生成缓存键（含文件修改时间以检测变更）"""
        import os
        mtime = os.path.getmtime(skill_path)
        return f"{skill_path}::mtime={mtime}"
```

### 3.2 工具描述缓存

工具描述是 Skill 执行中经常被重复加载的内容。例如，`git_diff` 工具的描述、参数列表和返回值格式，在同一个会话中可能会被多次使用。

```python
class ToolDescriptionCache:
    """工具描述缓存：预加载 + 增量更新"""

    def __init__(self):
        self._descriptions: dict = {}
        self._version_map: dict = {}

    def preload(self, tool_descriptions: dict):
        """预加载常用的工具描述"""
        self._descriptions.update(tool_descriptions)
        # 记录版本号，用于增量更新检测
        for name, desc in tool_descriptions.items():
            self._version_map[name] = desc.get("version", 1)

    def get(self, tool_name: str) -> Optional[dict]:
        """获取工具描述"""
        return self._descriptions.get(tool_name)

    def needs_update(self, tool_name: str, current_version: int) -> bool:
        """检查是否需要更新"""
        cached_version = self._version_map.get(tool_name, 0)
        return current_version > cached_version

    def update(self, tool_name: str, description: dict):
        """增量更新某个工具的描述"""
        self._descriptions[tool_name] = description
        self._version_map[tool_name] = description.get("version", 1)
```

### 3.3 结果缓存

结果缓存存储 Skill 执行的结果，用于相同输入的重复请求实现**去重和复用**：

```python
class ResultCache:
    """Skill 执行结果缓存：去重 + 有效期管理"""

    def __init__(self, max_entries: int = 1000):
        self._entries: dict = {}
        self._max_entries = max_entries
        self._cache_key_set: set = set()

    def make_key(self, skill_name: str, input_data: dict) -> str:
        """生成结果缓存键"""
        import json
        content = json.dumps({
            "skill": skill_name,
            "input": input_data,
        }, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()

    def get_result(self, skill_name: str, input_data: dict) -> Optional[dict]:
        """获取缓存的结果"""
        key = self.make_key(skill_name, input_data)

        if key not in self._entries:
            return None

        entry = self._entries[key]

        # 检查有效期
        if time.time() > entry["expires_at"]:
            del self._entries[key]
            self._cache_key_set.discard(key)
            return None

        return entry["result"]

    def cache_result(self, skill_name: str, input_data: dict,
                     result: dict, ttl: int = 60):
        """缓存执行结果"""
        key = self.make_key(skill_name, input_data)

        # 容量管理：淘汰最旧的条目
        if len(self._entries) >= self._max_entries:
            oldest_key = next(iter(self._entries))
            del self._entries[oldest_key]

        self._entries[key] = {
            "result": result,
            "expires_at": time.time() + ttl,
            "created_at": time.time(),
        }

    def invalidate_by_skill(self, skill_name: str):
        """Skill 版本更新时，清除所有相关结果缓存"""
        keys_to_delete = [
            k for k, v in self._entries.items()
            if v.get("result", {}).get("_skill_name") == skill_name
        ]
        for k in keys_to_delete:
            del self._entries[k]
```

### 3.4 缓存命中率监控

没有监控的缓存策略是盲目的。以下指标对缓存健康至关重要：

| 指标 | 定义 | 健康值 | 异常处理 |
|------|------|-------|---------|
| **指令命中率** | 指令体缓存在 TTL 内的命中比例 | > 90% | < 80% 说明 TTL 太短或缓存容量不足 |
| **工具描述命中率** | 工具描述在同会话中的复用比例 | > 95% | < 85% 说明预加载策略需要调整 |
| **结果去重率** | 相同输入被重复提交的比例 | 视场景而定，文本分析类可能很高 | 需要结合业务场景判断 |
| **缓存失效延迟** | Skill 更新后缓存失效的及时性 | < 1 秒 | 文件监听机制是否正常工作 |

```python
class CacheMonitor:
    """缓存监控聚合"""

    def __init__(self):
        self.metrics = {
            "instruction_cache": SkillInstructionCache(),
            "result_cache": ResultCache(),
            "tool_cache": ToolDescriptionCache(),
        }

    def report(self) -> dict:
        """生成缓存监控报告"""
        report = {}
        for name, cache in self.metrics.items():
            if hasattr(cache, "report_hit_rate"):
                report[name] = {
                    "hit_rate": cache.report_hit_rate(),
                }
            elif hasattr(cache, "stats"):
                report[name] = cache.stats()
        return report

    def log_alert(self, metric: str, message: str):
        """异常告警日志"""
        import logging
        logger = logging.getLogger("cache_monitor")
        logger.warning(f"[{metric}] {message}")
```

---

## 四、重复指令消除

### 4.1 公共指令片段的提取与共享

在拥有多个 Skill 的工程中，指令重复是一个容易被忽视但极其浪费的问题。许多 Skill 共享相同的"安全约束"、"输出格式"或"错误处理"逻辑。

指令重复消除的思路类似于 CSS 中的**样式提取（CSS Class Extraction）**：将公共样式抽取为 class 并在多个元素中复用。

```yaml
# 在多个 SKILL.md 中出现的重复指令（优化前）

## 安全约束
- 不执行任何写操作
- 不修改文件系统
- 不发起网络请求
- 不访问环境变量中的密钥
- 所有操作必须只读

## 输出格式
- 使用 JSON 格式输出
- 包含 status / message / data 三个顶层字段
- status 可选值: ok / error / warning
```

```yaml
# 提取为公共指令模板（优化后）

# shared/templates/safety_constraints.md
## 安全约束
- 不执行任何写操作
- 不修改文件系统
- 不发起网络请求
- 不访问环境变量中的密钥
- 所有操作必须只读

# shared/templates/output_format.md
## 输出格式
- 使用 JSON 格式输出
- 包含 status / message / data 三个顶层字段
- status 可选值: ok / error / warning
```

在 SKILL.md 中引用公共片段：

```yaml
---
name: code_inspector
version: 1.0.0
imports:
  - shared/templates/safety_constraints.md
  - shared/templates/output_format.md
```

消除重复前后的 Token 对比：

| 场景 | 消除前 | 消除后 | 节省 |
|------|-------|-------|------|
| 10 个 Skill 各含安全约束（200 tokens） | 2,000 | 200（共享）+ 10（引用开销） | ~90% |
| 8 个 Skill 各含输出格式（150 tokens） | 1,200 | 150（共享）+ 8（引用开销） | ~87% |
| 5 个 Skill 各含错误处理（180 tokens） | 900 | 180（共享）+ 5（引用开销） | ~79% |

### 4.2 Skill 之间的指令去重

更高级的指令去重是跨 Skill 的语义去重——当多个 Skill 用不同的措辞表达了相同的语义时，合并它们。

```python
def estimate_duplication(collection_of_skills: list[str]) -> dict:
    """估算多个 Skill 之间的指令重复率（简化版）"""
    from collections import Counter

    all_sentences = []
    per_skill_sentences = []

    for i, content in enumerate(collection_of_skills):
        # 按句号分割为句子
        sentences = [
            s.strip() for s in content.replace("\n", " ").split("。")
            if len(s.strip()) > 10
        ]
        all_sentences.extend(sentences)
        per_skill_sentences.append(set(sentences))

    # 统计在全集中出现超过一次的唯一句子
    sentence_counts = Counter(all_sentences)
    duplicated = {s: c for s, c in sentence_counts.items() if c > 1}

    # 计算去重潜力
    total_tokens = sum(len(s.split()) for s in all_sentences)
    dup_tokens = sum(
        len(s.split()) * (c - 1) for s, c in duplicated.items()
    )

    return {
        "total_sentences": len(all_sentences),
        "unique_duplicated": len(duplicated),
        "estimated_savable_tokens": dup_tokens,
        "duplication_rate": f"{dup_tokens / total_tokens * 100:.1f}%",
        "top_duplicates": sorted(
            duplicated.items(),
            key=lambda x: -x[1] * len(x[0]),
        )[:5],
    }
```

---

## 五、懒加载与分段加载

### 5.1 长 Skill 的分段加载策略

当一个 SKILL.md 文件很长时（超过 3000 tokens），将其一次性加载到上下文中可能不是最优选择。分段加载策略允许 Agent 只在需要时加载特定段落。

```
分段加载策略概览

按阶段分段：
┌──────────────────────────────────────────────────────┐
│  SKILL.md (4200 tokens)                               │
│                                                        │
│  [段 1: 元数据]  ~200 tokens    ← 始终加载            │
│  [段 2: 角色与约束]  ~800 tokens  ← 始终加载           │
│  [段 3: 步骤 1-3]  ~1200 tokens  ← 按阶段加载          │
│  [段 4: 步骤 4-6]  ~1000 tokens  ← 按阶段加载          │
│  [段 5: 异常处理]  ~600 tokens   ← 出错时按需加载       │
│  [段 6: 附录]      ~400 tokens   ← 极少使用，按需加载    │
└──────────────────────────────────────────────────────┘

加载策略：
  初始化 → [段 1] + [段 2] (1000 tokens)
  步骤 1 → [段 3] (1200 tokens)
  步骤 4 → [段 4] (1000 tokens)
  错误   → [段 5] (600 tokens)
  引用   → [段 6] (400 tokens)
```

### 5.2 优先级加载 vs 按需加载

| 加载策略 | 适用场景 | Token 消耗 | 延迟 |
|---------|---------|-----------|------|
| **全量加载** | 小 Skill（< 1000 tokens）、延迟敏感场景 | 最大 | 无 |
| **优先级加载** | 中 Skill（1000-3000 tokens）、常规场景 | 中等 | 初始化时稍有延迟 |
| **按需加载** | 大 Skill（> 3000 tokens）、复杂多步骤场景 | 最小 | 步骤切换时有加载延迟 |

```yaml
# 分段加载的 SKILL.md 配置
---
name: large_codebase_refactor
version: 1.2.0
execution:
  mode: sequential
  lazy_loading:
    enabled: true
    strategy: priority        # priority: 优先级加载

priority_segments:
  - id: core_identity
    priority: 10              # 最高优先级，始终加载
    content: "role_and_constraints"
    tokens: ~800

  - id: analyze_phase
    priority: 7
    content: "steps_1_to_3"   # 分析阶段
    tokens: ~1500
    load_condition: "on_phase_entry:analyze"

  - id: transform_phase
    priority: 5
    content: "steps_4_to_6"   # 转换阶段
    tokens: ~1200
    load_condition: "on_phase_entry:transform"

  - id: error_handling
    priority: 3
    content: "error_recovery"
    tokens: ~600
    load_condition: "on_demand"  # 按需加载

  - id: appendix
    priority: 1
    content: "reference_tables"
    tokens: ~400
    load_condition: "on_demand"
---

## 角色与约束

<!-- 核心身份，始终加载 -->

你是一个大型代码库重构专家。你负责分析代码结构，识别重构机会，并执行安全的代码转换。

## 约束

- 只修改明确指定的目标文件
- 每次重构操作前先创建备份
- 对公共 API 的修改需要标注 BREAKING CHANGE

<!-- 以下内容按阶段加载 -->

## 步骤 1-3：分析阶段

<!-- 仅在进入 analyze 阶段时加载 -->

### 步骤 1：代码映射
调用 search_code 工具获取项目结构...

### 步骤 2：依赖分析
调用 analyze_deps 工具识别模块间依赖...

### 步骤 3：重构机会识别
基于步骤 1 和 2 的结果，识别可重构的代码区域...

## 步骤 4-6：转换阶段

<!-- 仅在进入 transform 阶段时加载 -->

### 步骤 4：执行重构
...
```

### 5.3 示例：大型审查 Skill 的分段加载方案

以一个大型"全栈安全审查"Skill 为例，展示完整的分段加载设计：

```yaml
---
name: full_stack_security_review
version: 2.0.0
description: "全栈安全审查 Skill - 12000 tokens 优化为 4500 tokens 分段加载"
execution:
  mode: sequential
  lazy_loading:
    enabled: true
    strategy: phased

segments:
  - id: core
    load: always                    # 始终加载
    tokens: 800
    content: |
      ## 角色
      你是全栈安全专家...
      ## 全局约束
      - 只读审查，不修改代码
      - 基于 OWASP Top 10 标准

  - id: frontend_check
    load: on_match: "frontend"      # 输入匹配"frontend"时加载
    tokens: 1500
    content: |
      ## 前端安全检查
      ### XSS 检测
      ### CSRF 防护评估
      ### 依赖漏洞检查

  - id: backend_check
    load: on_match: "backend"
    tokens: 2000
    content: |
      ## 后端安全检查
      ### 认证机制审查
      ### 授权模型评估
      ### SQL 注入检测
      ### API 安全配置

  - id: infra_check
    load: on_match: "infrastructure"
    tokens: 1200
    content: |
      ## 基础设施安全检查
      ### 云服务配置审查
      ### 网络策略评估
      ### 密钥管理检查

  - id: report_generation
    load: on_phase: "report"        # 最后阶段加载
    tokens: 800
    content: |
      ## 报告输出格式
      - severity/category/description/recommendation
      - 按严重程度排序
      - 每个发现附 CVSS 评分
---

## 核心指令

<!-- 始终加载 -->
...
```

优化效果：

| 指标 | 全量加载 | 分段加载 | 节省 |
|------|---------|---------|------|
| 单次执行平均 Token 消耗 | 12,000 | 3,500 | ~71% |
| 后端检查场景（仅加载 core + backend + report） | 12,000 | 3,600 | ~70% |
| 全栈检查场景（core + frontend + backend + infra + report） | 12,000 | 6,300 | ~48% |
| 错误处理时触发额外加载 | - | +600-1,200 | 可控 |

---

## 六、Token 监控体系

### 6.1 埋点设计与数据采集

没有度量就没有优化。Token 监控的第一步是在 Skill 执行的关键节点埋点：

```python
# token_monitor.py
import time
import json
from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class TokenEvent:
    """单次 Token 消耗事件"""
    skill_name: str
    skill_version: str
    phase: str               # initialization/execution/completion
    tokens_consumed: int
    tokens_in_skill_file: int
    cache_hit: bool
    duration_ms: float
    execution_id: str
    llm_model: str
    timestamp: float = field(default_factory=time.time)
    metadata: dict = field(default_factory=dict)


class TokenTracker:
    """Token 消耗追踪器"""

    def __init__(self):
        self.events: list[TokenEvent] = []
        self._current_execution_id: Optional[str] = None

    def start_execution(self, skill_name: str, skill_version: str):
        """开始追踪一次 Skill 执行"""
        import uuid
        self._current_execution_id = str(uuid.uuid4())[:8]
        self._execution_start = time.time()

    def record(self, phase: str, tokens: int, skill_tokens: int,
               cache_hit: bool, llm_model: str = "claude-4",
               **metadata):
        """记录一次 Token 消耗事件"""
        if not self._current_execution_id:
            raise RuntimeError("Must call start_execution first")

        event = TokenEvent(
            skill_name="",
            skill_version="",
            phase=phase,
            tokens_consumed=tokens,
            tokens_in_skill_file=skill_tokens,
            cache_hit=cache_hit,
            duration_ms=(time.time() - self._execution_start) * 1000,
            execution_id=self._current_execution_id,
            llm_model=llm_model,
            metadata=metadata,
        )
        self.events.append(event)
        return event

    def flush(self, output_path: str = "token_events.jsonl"):
        """将事件刷写到磁盘"""
        with open(output_path, "a", encoding="utf-8") as f:
            for event in self.events[-1:]:  # 只写最新的
                f.write(json.dumps(asdict(event), ensure_ascii=False) + "\n")
```

### 6.2 Token 消耗的统计分析

有了数据之后，下一步是分析 Token 消耗的模式：

```python
class TokenAnalytics:
    """Token 消耗分析器"""

    def __init__(self, events: list[TokenEvent]):
        self.events = events

    def total_by_skill(self) -> dict:
        """按 Skill 统计总消耗"""
        from collections import defaultdict
        result = defaultdict(int)
        for e in self.events:
            result[e.skill_name] += e.tokens_consumed
        return dict(result)

    def average_per_execution(self, skill_name: str) -> dict:
        """单次执行的平均 Token 消耗"""
        skill_events = [
            e for e in self.events if e.skill_name == skill_name
        ]
        if not skill_events:
            return {}

        total_tokens = sum(e.tokens_consumed for e in skill_events)
        total_executions = len(set(e.execution_id for e in skill_events))

        return {
            "skill": skill_name,
            "total_executions": total_executions,
            "total_tokens": total_tokens,
            "avg_per_execution": total_tokens / total_executions,
            "max_per_execution": max(
                e.tokens_consumed for e in skill_events
            ),
            "min_per_execution": min(
                e.tokens_consumed for e in skill_events
            ),
        }

    def phase_breakdown(self, skill_name: str) -> dict:
        """各阶段的 Token 消耗占比"""
        skill_events = [
            e for e in self.events if e.skill_name == skill_name
        ]
        from collections import defaultdict
        phase_tokens = defaultdict(int)
        for e in skill_events:
            phase_tokens[e.phase] += e.tokens_consumed
        total = sum(phase_tokens.values())

        return {
            phase: {
                "tokens": tokens,
                "percentage": f"{tokens / total * 100:.1f}%",
            }
            for phase, tokens in phase_tokens.items()
        }
```

### 6.3 异常告警

Token 消耗异常是最重要的告警信号之一——它通常意味着 Skill 的执行路径出现了预期之外的情况（如陷入循环、条件分支爆炸等）：

```python
class TokenAlertManager:
    """Token 异常告警管理器"""

    def __init__(self):
        self.thresholds = {
            "single_execution_max": 50000,     # 单次执行最多消耗 50K tokens
            "hourly_budget": 500000,            # 每小时最多 500K tokens
            "burst_ratio": 3.0,                 # 单次超过平均 3 倍触发告警
        }

    def check_single_execution(self, event: TokenEvent) -> Optional[str]:
        """检查单次执行是否超限"""
        max_tokens = self.thresholds["single_execution_max"]
        if event.tokens_consumed > max_tokens:
            return (
                f"Token 消耗超限: Skill={event.skill_name}, "
                f"消耗={event.tokens_consumed}, "
                f"阈值={max_tokens}"
            )
        return None

    def check_burst(self, event: TokenEvent,
                    recent_avg: float) -> Optional[str]:
        """检查突发消耗"""
        if recent_avg > 0:
            ratio = event.tokens_consumed / recent_avg
            if ratio > self.thresholds["burst_ratio"]:
                return (
                    f"Token 消耗突增: Skill={event.skill_name}, "
                    f"当前={event.tokens_consumed}, "
                    f"近期平均={recent_avg:.0f}, "
                    f"比率={ratio:.1f}x"
                )
        return None

    def escalate(self, alert_message: str):
        """升级告警（集成到 PagerDuty/Slack 等）"""
        import logging
        logger = logging.getLogger("token_alerts")
        logger.error(f"[TOKEN_ALERT] {alert_message}")
        # 实际场景中可调用 webhook 发送到通知渠道
```

---

## 七、性能调优案例

### 一个大型 Skill 的 Token 优化全过程

为了展示上述策略的实战效果，这里用一个真实场景串联所有优化手段。

**背景**：一个名为 `full_stack_codebase_audit` 的 Skill，负责对大型代码库进行全面的质量审计，包括代码风格检查、安全扫描、性能分析和依赖审计。

**优化前的状态**：

| 指标 | 值 |
|------|------|
| SKILL.md 大小 | 15,200 tokens |
| 工具声明 | 12 个工具 |
| 执行步骤 | 42 步（含条件分支） |
| 平均单次执行消耗 | 18,500 tokens |
| 每月成本（~2000 次执行） | ~$370 |

**优化过程**：

#### 第一轮：重复指令消除（节省 3,200 tokens）

发现安全约束、输出格式、错误处理策略在 Skill 内部的 5 个不同部分被重复描述了 3-7 次。

```
优化前后对比：
  安全约束：出现 5 次 × 240 tokens = 1,200 → 1 次 × 240 = 240
  输出格式：出现 3 次 × 180 tokens = 540   → 1 次 × 180 = 180
  错误处理：出现 4 次 × 380 tokens = 1,520  → 1 次 × 380 = 380
```

#### 第二轮：分段加载（节省 7,500 tokens）

将 Skill 按执行阶段拆分为 4 个独立段落：

```yaml
segments:
  - id: core           # 始终加载: 1,800 tokens
  - id: analysis       # 阶段 1: 4,200 tokens
  - id: fix            # 阶段 2 (仅在分析发现问题时加载): 2,800 tokens
  - id: report         # 输出阶段: 1,200 tokens
```

典型执行路径的 Token 消耗：1,800（core）+ 4,200（analysis）+ 1,200（report）= 7,200 tokens，相比优化前的 15,200，节省了 53%。

#### 第三轮：缓存策略（减少重复加载）

| 缓存类型 | 对每个 Skill 的影响 |
|---------|-------------------|
| 指令体缓存 | 同会话中后续执行无需重新解析 YAML |
| 工具描述缓存 | 所有工具描述约 1,500 tokens，仅需加载一次 |
| 结果缓存 | 相同输入的直接返回，避免重复执行 |

#### 优化结果

| 指标 | 优化前 | 优化后 | 改善 |
|------|-------|-------|------|
| SKILL.md 大小 | 15,200 | 7,200 | -53% |
| 平均单次执行消耗 | 18,500 | 7,800 | -58% |
| 月度 Token 消耗 | ~37M | ~15.6M | -58% |
| 月成本（估计） | ~$370 | ~$156 | -58% |
| 缓存命中后消耗 | N/A | ~2,000（仅结果读取） | -89% |

**: 优化不是一次性的。建议建立 Token 预算基线，每周检查 Top 5 最耗 Token 的 Skill，持续迭代优化。

---

## 八、思考题

1. **缓存一致性 vs 实时性**：在结果缓存中，我们设置了 60 秒的 TTL。但如果某个外部数据在这 60 秒内发生了变化（例如 CI 构建状态从 pending 变为 success），缓存的"过时"结果可能导致错误的后续决策。请分析：在什么场景下缓存过时的危害最大？你会如何设计一个"先验证再使用"的缓存策略，既维持高缓存命中率，又避免过时数据的风险？

2. **分段加载的边界条件设计**：分段加载的核心挑战是"应该把哪段指令放在哪个段里"。如果分段太粗，失去优化意义；如果分段太细，加载开销（Token 和延迟）可能反超节省。请为一篇负责"数据分析 + 可视化 + 报告生成"的 6000-token Skill 设计分段方案，并解释你的分段标准和评估方法。

3. **渐进式披露 vs 上下文完整性**：渐进式披露的核心假设是"Agent 可以在信息不完整的情况下做出过渡性决策"。但实践中，缺少某些上下文可能导致 Agent 做出次优甚至错误的中间决策。请设计一个"上下文完整性检查"机制——在每步决策前，快速验证 Agent 是否已经拥有了做出该决策所需的全部上下文信息。缺失时，触发按需加载。

4. **Token 消耗预测**：给定一个 SKILL.md 文件和输入参数，能否在**不实际执行**的情况下预测 Token 消耗？哪些因素使得 Token 消耗难以预测，哪些因素是相对确定的？请设计一个预测模型，输入为 SKILL.md 内容 + 输入参数特征，输出为一个 Token 消耗范围估计（最小/期望/最大）。

---

## 九、本章小结

Token 优化不是单纯的"压缩指令"，而是围绕"在有限上下文窗口中最大化执行质量"这一目标的多维优化：

1. **Token 预算管理**：渐进式披露策略确保核心信息优先加载，非核心信息按需加载。不同规模的 Skill 需要不同的预算分配模型，核心原则是"执行流程和工具描述"占据最大比重。

2. **三级缓存策略**：指令体缓存（LRU + TTL）避免重复文件加载，工具描述缓存（预加载 + 增量更新）减少重复的工具信息注入，结果缓存（去重 + 有效期管理）对相同输入直接复用输出。缓存命中率监控是衡量缓存健康度的关键。

3. **重复指令消除**：通过公共指令片段提取（类似 CSS Class 抽取）和跨 Skill 语义去重，消除体系中大量的冗余 Token 消耗。

4. **懒加载与分段加载**：长 Skill 按阶段或按功能模块分段，优先级加载确保高频路径、按需加载覆盖低频路径。分段粒度需要在"加载开销"和"上下文空间"之间取得平衡。

5. **Token 监控体系**：埋点采集、统计分析、异常告警构成了 Token Observability 的三要素。没有监控的优化是盲目的。

6. **性能调优案例**：一个大型 Skill 通过三轮优化（重复消除、分段加载、缓存策略），Token 消耗降低了 58%，月成本从 $370 降至 $156。

Token 优化的最终目标是让每一分 Token 消耗都服务于 Agent 的行为质量。这不是一次性的"压缩"活动，而是伴随 Skill 生命周期的持续过程。

---

## 十、参考资料

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) —— Anthropic 官方提示工程指南，本章渐进式披露策略的设计参考了其中关于"先给关键约束再给细节"的推荐做法
- [Claude Tokenizer](https://docs.anthropic.com/en/docs/resources/glossary#token) —— Token 计数和估算工具，本章中的 Token 估算使用了 Anthropic 的 Tokenizer
- [Anthropic Caching Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) —— Anthropic 的提示缓存功能文档，本章三级缓存策略的设计受其启发
- Denning, P. J. (1995). *The Locality Principle*. Communications of the ACM. —— 局部性原理的经典论文，本章 LRU 缓存策略的理论基础
- [OWASP Top 10 - 2021](https://owasp.org/Top10/) —— 本章"全栈安全审查"Skill 分段方案的 OWASP 参考标准
- Aho, A. V., Denning, P. J., & Ullman, J. D. (1971). *Principles of Optimal Page Replacement*. —— 页面置换算法的基础文献，本章缓存淘汰策略参考了其中的理论框架
- [ClawHub Skills Marketplace](https://clawhub.dev/skills) —— 社区 Skills 市场，本章的重复指令消除策略参考了社区 Top 100 Skills 的 Token 分布分析
- Williams, B. (2025). "Practical Token Optimization for Agent Skills". *Anthropic Research Blog*. —— Anthropic 关于 Skill Token 优化的实践文章
- [Spring Cache Abstraction](https://docs.spring.io/spring-framework/reference/integration/cache.html) —— 本章缓存策略的分层设计参考了 Spring Cache 的抽象模式

---

[← 上一章：Skill 测试策略](./09-testing-strategy) | [返回索引](./) | [下一章：企业级 Skill 治理体系 →](./11-enterprise-governance)
