# 复杂 Skill 组合与编排

> 从"单个 Skill 能做什么"到"多个 Skill 如何协同"，深入理解 Skill 编排引擎的核心挑战：串行/并行/条件组合、状态管理、DAG 调度与降级熔断 | 预计阅读时间：45 分钟

---

## 一、引言

在第 7 章中，我们学习了六种 Skill 设计模式。每一种模式解决的是**单个 Skill 内部**的结构问题——如何组织 Skill 内的步骤、如何处理错误、如何保障安全。但真实的 Agent 系统远比单个 Skill 复杂。

考虑一个典型的生产场景：

> 开发者提问："帮我审查这个 PR，如果安全没问题就部署到 staging 环境，然后运行集成测试，最后通知团队。"

这个请求中包含了四个不同职责的 Skill：
- **代码审查 Skill**：审查变更文件
- **部署 Skill**：将应用部署到 staging
- **测试 Skill**：运行集成测试套件
- **通知 Skill**：发送结果到团队聊天频道

这四个 Skill 之间存在着明确的**编排关系**：部署必须在审查通过后执行，测试必须在部署完成后执行，通知必须在测试结果出来后执行。而且，如果审查发现了严重的安全问题，部署和测试应该被跳过。

这就引出了本章的核心命题：**当多个 Skill 需要协同工作时，如何可靠、高效、安全地编排它们？**

### 从 Skills 可以组合到编排引擎

"Skills 可以组合"在第 3 章和第 4 章中都有提及——通过依赖声明或子 Skill 引用，一个 Skill 可以调用另一个 Skill。但这只是组合的**声明层**。在**运行时层**，我们需要面对一系列更具挑战性的工程问题：

```
声明层（Design Time）             运行时层（Runtime）
─────────────────                ─────────────────
Skill A 声明依赖 Skill B          Skill A 和 B 的数据如何传递？
Skill C 引用 Skill D              Skill C 和 D 并行还是串行？
Skill E 的条件分支                 条件判断的执行时机？
                                 出错时如何传播 Cancellation？
                                 状态冲突如何检测和解决？
```

编排引擎就是应对这些问题的**运行时基础设施**。它不关心 Skill 内部的具体逻辑，但负责 Skill 之间的通信、调度、错误处理和状态管理。

::: info 编排（Orchestration）vs 编排（Choreography）
在分布式系统领域，"编排"有两种截然不同的解释：

- **编排（Orchestration）**：有一个中央控制器（本章的编排引擎）来决定谁在何时做什么。相当于乐队指挥。
- **编排（Choreography）**：没有中央控制器，每个参与者自行决定何时响应事件。相当于舞者各自根据音乐舞动。

本章讨论的是 **Orchestration**——有中央控制器的编排方式。这是 Agent Skill 系统更常见的模式，因为在强约束的生产环境中，我们需要可预测的、可审计的执行路径。
:::

---

## 二、串行组合

### 2.1 管道模式的数据流

串行组合是最基本的组合形式：一个 Skill 的输出作为下一个 Skill 的输入，形成数据流管道。

```
Skill A (代码审查)             Skill B (生成报告)            Skill C (发送通知)
  │                              │                              │
  ├─ 输入: PR 变更文件           ├─ 输入: 审查结果 JSON        ├─ 输入: 报告 Markdown
  ├─ 输出: 审查结果 JSON         ├─ 输出: 报告 Markdown        ├─ 输出: 发送状态
  └─ 语义: "审查代码"            └─ 语义: "生成可读报告"        └─ 语义: "通知团队"
```

这种组合的关键约束是：**相邻 Skill 的输出 Schema 必须与下一个 Skill 的输入 Schema 兼容**。但在实践中，Schema 完全匹配是罕见的——因此需要输入/输出适配器。

### 2.2 输入/输出适配器（Schema 转换）

适配器是串行组合中最容易被忽视但又最重要的组件。它的职责很简单：**将 Skill A 的输出格式转换为 Skill B 能接受的输入格式**。

```yaml
# Schema 适配器配置示例
adapters:
  - from_skill: code_review      # 源 Skill
    to_skill: report_generator   # 目标 Skill
    transform: |
      输入：code_review 的输出 JSON
      输出：report_generator 的输入 JSON
      
      映射规则：
        code_review.findings[]        → report_generator.items[]
        code_review.findings[].file   → report_generator.items[].source_file
        code_review.findings[].type   → report_generator.items[].category
        code_review.findings[].desc   → report_generator.items[].description
        code_review.summary           → report_generator.context.summary
        code_review.risk_level        → report_generator.context.severity

  - from_skill: report_generator
    to_skill: notification_sender
    transform: |
      输入：report_generator 的输出 Markdown
      输出：notification_sender 的输入
      
      映射规则：
        report_generator.markdown_text  → notification_sender.message.content
        report_generator.title          → notification_sender.message.title
                                         → notification_sender.channel = "code-review"
```

::: tip 适配器模式 vs Schema 兼容
适配器层存在两种设计策略：
1. **显式适配**：为每个 Skill 对声明转换规则（如上例）。优点是精确可控，缺点是维护成本随 Skill 数量平方增长。
2. **规范适配**：定义全局的"规范数据格式"，所有 Skill 的输出/输入都适配到规范格式。优点是线性复杂度，缺点是规范格式的演化成本高。

对于超过 10 个 Skill 的系统，建议采用**规范适配**策略。
:::

### 2.3 完整示例：代码审查 → 生成报告 → 发送通知

```yaml
---
name: review_pipeline_chain
version: 1.0.0
description: "串行组合三个 Skill：审查代码 → 生成报告 → 发送通知"
execution:
  mode: sync
  chain:
    - skill: code_review
      ref: .claude/skills/code_review/SKILL.md
      adapter:
        from_skill: user_input
        to_skill: code_review
        mapping:
          "pr_url" → "target"
          "review_depth" → "depth"
          
    - skill: report_generator
      ref: .claude/skills/report_generate/SKILL.md
      adapter:
        from_skill: code_review
        to_skill: report_generator
        mapping:
          "findings" → "items"
          "summary" → "context.summary"
          
    - skill: notification_sender
      ref: .claude/skills/notification/SKILL.md
      adapter:
        from_skill: report_generator
        to_skill: notification_sender
        mapping:
          "markdown" → "message.body"
          "title" → "message.subject"
      config:                        # 硬编码配置
        channel: "#code-reviews"
        priority: high
---

## 编排执行策略

### 步骤一：代码审查

调用 `code_review` Skill，输入来自用户的 PR URL。

等待完成，输出为 JSON 格式的审查结果。

### 步骤二：适配转换

将 `code_review` 的输出通过适配器转换为 `report_generator` 的输入格式。

适配器处理以下差异：
- 字段重命名（`findings` → `items`）
- 结构重组织（`summary` 和 `risk_level` 封装到 `context` 对象中）
- 类型转换（数值型的严重级别转为枚举字符串）

### 步骤三：生成报告

调用 `report_generator` Skill，输入适配后的数据结构。

输出为 Markdown 格式的报告文档。

### 步骤四：适配转换（2）

将报告内容适配为通知消息格式，附加固定配置（频道、优先级）。

### 步骤五：发送通知

调用 `notification_sender` Skill，发送格式化的审查报告到指定的聊天频道。

### 错误处理

```
串行链的错误传播：
  如果 code_review 失败 → 直接返回错误，不执行后续步骤
  如果 report_generator 失败 → 使用 code_review 的原始输出生成简化报告
  如果 notification_sender 失败 → 记录日志，返回报告结果给调用方
  
  关键原则：下游错误不应丢失上游已完成的成果。
```

---

## 三、并行组合

### 3.1 Fan-out/Fan-in 模式实现

并行组合的核心是 **Fan-out（扇出）/ Fan-in（扇入）** 模式：一个任务被拆分为多个并行子任务，然后结果被聚合回来。

```
                   ┌───────── Skill A (文件1审查) ──────┐
                   │                                     │
输入 ── Fan-out ──┼── Skill B (文件2审查) ── Fan-in ──→ 输出
                   │                                     │
                   └───────── Skill C (文件3审查) ──────┘
```

在编排引擎中，Fan-out/Fan-in 的实现涉及三个要素：

1. **拆分器（Splitter）**：决定如何将输入拆分为并行子任务
2. **调度器（Scheduler）**：控制子任务的创建和执行
3. **聚合器（Aggregator）**：收集和合并子任务的结果

```yaml
---
name: parallel_multi_file_review
version: 1.0.0
description: "并行组合示例：同时审查多个文件后汇总结果"
execution:
  mode: async
  parallelism:
    pattern: fan_out_fan_in
    splitter:
      strategy: by_file                          # 按文件拆分
      max_concurrency: 15                        # 最大并行数 15
      batch_size: 5                              # 每批 5 个文件
    aggregator:
      strategy: merge_all                        # 合并所有结果
      timeout: 300                               # 聚合超时 5 分钟
      partial_results: true                      # 允许部分结果
sub_skills:
  - name: file_reviewer
    ref: .claude/skills/single_file_review/SKILL.md
---

## 编排执行策略

### Fan-out 阶段

```
输入：变更文件列表 files = [f1.py, f2.py, f3.js, f4.go, f5.ts, ...]

批次划分（batch_size = 5）：
  批次 1: [f1.py, f2.py, f3.js, f4.go, f5.ts]      → 并行执行
  批次 2: [f6.py, f7.py, f8.js, f9.go, f10.ts]      → 并行执行
  ...

每批次内：
  对每个文件 file in batch:
    创建 file_reviewer Skill 的独立实例
    输入：file_path = file, context = 共享的 PR 上下文
    并行执行，等待所有完成

批次间：
  批次 2 必须在批次 1 完成后启动
  原因：控制并发数，避免资源耗尽
```

### 并发控制逻辑

```python
# 伪代码：Fan-out 调度器
def fan_out_scheduler(files, max_concurrency, batch_size):
    """调度并行子任务，控制并发数"""
    results = []
    batches = partition(files, batch_size)
    
    for batch in batches:
        batch_tasks = []
        for file in batch:
            # 创建子 Skill 调用
            task = create_sub_skill_call(
                skill_name="file_reviewer",
                input={"file_path": file.path, "pr_context": shared_context}
            )
            batch_tasks.append(task)
        
        # 等待当前批次全部完成
        batch_results = execute_parallel(batch_tasks, max_concurrency=max_concurrency)
        results.extend(batch_results)
    
    return results
```

### Fan-in 阶段

```
聚合策略：merge_all

输入：所有审查结果列表
处理步骤：
  1. 汇总统计：总文件数、发现问题数、严重级别分布
  2. 去重：合并跨文件的重复发现（如同一个变量在多个文件中的使用问题）
  3. 排序：按严重级别降序排列
  4. 生成摘要：Top 3 最关键的问题

如果启用了 partial_results：
  若有文件审查失败，记录失败原因，使用已有结果生成聚合报告
  标记报告为 "部分完成 (N/M files reviewed)"

最终输出：
  {
    "summary": "审查摘要",
    "critical_findings": [...],
    "high_findings": [...],
    "total_files": 15,
    "reviewed_files": 14,
    "failed_files": ["f6.py"],    # 审查失败的文件
    "overall_verdict": "PASS / WARNING / FAIL"
  }
```

### 3.2 并发控制与资源限制

并发控制是并行组合的难点。不加限制的并发会导致：

1. **上下文窗口溢出**：每个子 Skill 调用都会消耗上下文窗口中的 Token
2. **工具调用限流**：外部 API 通常有调用频率限制
3. **LLM 推理退化**：过多的并行请求可能导致推理质量下降

```yaml
# 资源限流配置
resource_limits:
  # Token 预算
  token_budget:
    per_skill_call: 16000          # 每个子 Skill 调用的 Token 上限
    total_budget: 128000           # 整个编排的 Token 上限
    strategy: fail                 # fail（超预算终止）或 queue（排队等待）

  # 并发限制
  concurrency:
    max_concurrent_skills: 10      # 同时执行的 Skill 数上限
    max_parallel_tools: 5          # 每个 Skill 的并行工具调用上限
    
  # 速率限制
  rate_limits:
    - resource: llm_api
      max_per_minute: 60
      max_per_second: 5
    - resource: git_api
      max_per_minute: 30
```

```python
# 伪代码：带资源控制的并发执行器
class ResourceAwareExecutor:
    """资源感知的并发执行器"""
    
    def __init__(self, limits: ResourceLimits):
        self.semaphore = asyncio.Semaphore(limits.max_concurrent_skills)
        self.token_counter = TokenCounter(limits.token_budget)
        self.rate_limiter = RateLimiter(limits.rate_limits)
    
    async def execute_sub_skill(self, skill_call: SkillCall):
        async with self.semaphore:                     # 并发数控制
            await self.rate_limiter.acquire()          # 速率控制
            async with self.token_counter.reserve():   # Token 预算控制
                result = await skill_call.execute()
        
        return result
```

---

## 四、条件组合

### 4.1 基于中间结果动态选择执行路径

条件组合让 Skill 编排从"线性执行"扩展到"分支执行"。它的核心是**条件节点**——一个评估条件表达式并从多个候选路径中选择一个的决策点。

```
                  ┌───────────────────┐
                  │   安全审查 Skill    │
                  └────────┬──────────┘
                           │
                    ┌──────▼──────┐
                    │  条件节点     │
                    │  审查结果？   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │ 严重问题          │ 中低风险          │ 无风险
        ▼                  ▼                  ▼
   ┌──────────┐     ┌──────────┐      ┌──────────┐
   │深度安全   │     │常规修复   │      │正常发布   │
   │分析 Skill│     │建议 Skill │      │流程 Skill│
   └──────────┘     └──────────┘      └──────────┘
```

### 4.2 Switch/Conditional 节点设计

编排引擎中的条件节点需要支持多种条件类型：

```yaml
# 条件节点配置
conditional_branches:
  - name: security_severity_routing
    type: switch                          # switch 类型（多分支）
    expression: "${security_review.risk_level}"
    cases:
      - value: "critical"
        description: "发现致命安全漏洞"
        goto: deep_security_analysis      # 跳转到深度安全分析 Skill
      - value: "high"
        description: "发现高风险漏洞"
        goto: deep_security_analysis
      - value: "medium"
        description: "发现中等风险问题"
        goto: standard_fix_recommendation  # 跳转到常规修复建议 Skill
      - value: "low"
        description: "发现低风险问题"
        goto: standard_fix_recommendation
      - value: "none"
        description: "未发现安全问题"
        goto: normal_release_pipeline      # 跳转到正常发布流程 Skill
    default:
      goto: standard_fix_recommendation    # 默认路径
      description: "无法识别的风险级别，走常规修复路径"
```

```yaml
# 更简单的条件节点（二分支）
conditional_branches:
  - name: check_if_tests_pass
    type: if_else
    condition: "${test_result.passed == true AND test_result.coverage >= 80}"
    if_true:
      goto: deploy_skill
      description: "测试通过且覆盖率达标，执行部署"
    if_false:
      goto: fix_and_retry
      description: "测试失败或覆盖率不达标，进入修复流程"
```

```python
# 伪代码：条件节点评估引擎
def evaluate_condition(expression: str, context: ExecutionContext) -> bool:
    """评估条件表达式"""
    # 1. 变量替换
    resolved = resolve_variables(expression, context.variables)
    
    # 2. 表达式解析（支持 operators: ==, !=, >, <, >=, <=, AND, OR, NOT, IN）
    ast = parse_expression(resolved)
    
    # 3. 求值
    result = evaluate_ast(ast)
    
    return result


def resolve_variables(expression: str, variables: dict) -> str:
    """解析 ${path.to.variable} 引用"""
    import re
    
    def replace_var(match):
        var_path = match.group(1)
        value = deep_get(variables, var_path)
        if value is None:
            raise UnknownVariableError(f"Variable {var_path} not found in context")
        return str(value)
    
    return re.sub(r'\$\{([^}]+)\}', replace_var, expression)
```

### 4.3 条件节点设计原则

| 原则 | 说明 | 反例 |
|------|------|------|
| **条件原子性** | 每个条件节点只判断一件事 | ❌ `"${a} > 1 AND ${b} == 'x' OR ${c} != null"` |
| **显式默认路径** | 所有条件必须有一个 `default` | ❌ 只覆盖了已知条件值，遗漏未知值 |
| **循环检测** | 条件跳转不能形成循环 | ❌ A → B → C → A 的无限循环 |
| **条件幂等性** | 相同输入应产生相同分支决策 | ❌ 依赖随机数或时间戳的条件 |
| **分支粒度适中** | 分支太多则逻辑难以理解 | ❌ 一个 switch 有 15+ 个 case |

---

## 五、状态共享与隔离

### 5.1 命名空间 vs 全局状态

在多 Skill 编排中，状态管理面临一个核心矛盾：**Skill 之间需要共享数据，但又不能互相污染**。

编排引擎通过**分层状态空间**来解决这个问题：

```
全局状态 (Global Context)
├── 用户信息 (user_id, role, permissions)
├── 任务元信息 (task_id, created_at, priority)
├── 项目配置 (project_root, base_branch, language)
└── 全局变量 (global_config, shared_constants)

Skill A 命名空间 (skill_a: namespace)
├── A.input_data
├── A.intermediate_results
└── A.output

Skill B 命名空间 (skill_b: namespace)
├── B.input_data
├── B.intermediate_results
└── B.output
```

```yaml
# 状态空间配置
state:
  global:                       # 全局状态 - 所有 Skill 可读，部分可写
    readable: true
    writable_fields:            # 全局状态中哪些字段可写
      - task_status
      - shared_results
    fields:
      user:
        type: object
        description: "用户信息，由编排引擎注入"
      project:
        type: object
        description: "项目上下文，由编排引擎注入"
  
  skill_namespaces:             # Skill 命名空间 - 隔离的
    default_policy:
      readable_by_other: false   # 默认不可被其他 Skill 读取
      writable_by_other: false   # 默认不可被其他 Skill 写入
      retention: "session"       # 会话结束后清理
    overrides:                   # 显式覆盖
      - skill: report_generator
        readable_by:
          - code_review          # 允许 code_review 读取 report_generator 的状态
          - notification_sender  # 允许 notification_sender 读取
```

### 5.2 状态冲突处理

当多个 Skill 同时操作共享状态时，可能发生两种冲突：

**写冲突（Write Conflict）**：多个 Skill 同时写入同一状态变量。

```
时间线：
T1: Skill A 读取 counter = 0
T2: Skill B 读取 counter = 0
T3: Skill A 写入 counter = counter + 1  →  counter = 1
T4: Skill B 写入 counter = counter + 1  →  counter = 1  (⚠️ 覆盖了 A 的写入)
```

```yaml
# 写冲突解决策略
write_conflict:
  strategy: last_writer_wins    # 可选方案：
                                # last_writer_wins - 最后写入者获胜（默认）
                                # first_writer_wins - 首次写入后锁定
                                # merge - 合并写入（需提供合并函数）
                                # fail - 检测到冲突时失败
  lock_type: optimistic         # optimistic（乐观锁 - 版本号检测）
                                # pessimistic（悲观锁 - 写入前锁定）
```

**过期读（Stale Read）**：Skill 读取了过期的状态值。

```
时间线：
T1: Skill B 写入 config = {db_host: "old-host"}
T2: Skill C 读取 config.db_host → 获得 "old-host" （正确）
T3: Skill B 更新 config.db_host = "new-host"
T4: Skill C 再次读取 config.db_host → 获得 "new-host" （正确）
T5（问题场景）:
   T5a: Skill A 读取 config.db_host → 获得 "old-host"（⚠️ 被缓存的过期值）
   T5b: Skill B 更新 config.db_host = "new-host"
```

```yaml
# 过期读预防
stale_read:
  ttl: 30                       # 状态缓存有效期为 30 秒
  invalidation:
    - on_write: true            # 写入时使相关缓存失效
    - on_complete: true         # Skill 完成时使其输出缓存失效
  refresh_strategy:             # 读取过期数据时的行为
    on_stale_read: refresh      # refresh - 重新读取
                                # use_stale - 使用过期值（可接受）
                                # error - 报错
```

### 5.3 上下文传播机制

上下文传播是指在编排链中，关键上下文信息（如请求 ID、用户身份、安全令牌）自动从父 Skill 传递到子 Skill。

```python
class ContextPropagator:
    """上下文传播机制"""
    
    PROPAGATED_KEYS = {
        "request_id",         # 请求追踪 ID
        "user_id",            # 用户标识
        "auth_token",         # 鉴权令牌
        "trace_id",           # 分布式追踪 ID
        "session_id",         # 会话 ID
        "locale",             # 语言区域
    }
    
    @classmethod
    def propagate(cls, parent_context: dict, child_namespace: str) -> dict:
        """从父上下文提取 propagate 的字段注入到子命名空间"""
        propagated = {}
        for key in cls.PROPAGATED_KEYS:
            if key in parent_context:
                propagated[key] = parent_context[key]
        
        propagated["parent_trace"] = parent_context.get("trace_id")
        propagated["depth"] = parent_context.get("depth", 0) + 1
        
        return propagated
```

---

## 六、编排引擎调度策略

### 6.1 DAG 调度算法

多个 Skill 之间的依赖关系构成一个**有向无环图（DAG）**。编排引擎的核心能力就是将这个 DAG 转换为可执行的调度计划。

#### Skill 依赖图的 DAG 表示

```yaml
# 一个包含 6 个 Skill 的编排 DAG
skills:
  - name: A    # 代码克隆
    depends_on: []
  - name: B    # 静态分析
    depends_on: [A]
  - name: C    # 安全扫描
    depends_on: [A]
  - name: D    # 单元测试
    depends_on: [A]
  - name: E    # 集成测试
    depends_on: [B, C]
  - name: F    # 报告生成
    depends_on: [D, E]
```

```
依赖图拓扑：
            ┌─── B (静态分析) ──┐
            │                   │
A (克隆) ───┼─── C (安全扫描) ──┼─── E (集成测试) ──┐
            │                   │                    │
            └─── D (单元测试) ──┘                    │
                                                     │
                                              F (报告生成)
```

#### 拓扑排序 + 并行执行

```python
from collections import defaultdict, deque
from dataclasses import dataclass, field
from typing import Dict, List, Optional
import asyncio


@dataclass
class SkillNode:
    """DAG 中的一个 Skill 节点"""
    name: str
    depends_on: List[str] = field(default_factory=list)
    execution_time: Optional[int] = None  # 预估执行时间（秒）


class DAGScheduler:
    """基于拓扑排序的 DAG 调度器"""
    
    def __init__(self, nodes: Dict[str, SkillNode]):
        self.nodes = nodes
        self.dependency_graph = self._build_graph()
    
    def _build_graph(self):
        """构建依赖图：每个节点记录其依赖项和后续节点"""
        graph = {name: {"deps": node.depends_on, "dependents": []} 
                 for name, node in self.nodes.items()}
        
        for name, node in self.nodes.items():
            for dep in node.depends_on:
                graph[dep]["dependents"].append(name)
        
        return graph
    
    def topological_sort(self) -> List[List[str]]:
        """
        拓扑排序，返回并行层列表。
        同一层中的 Skill 可以并行执行。
        """
        # 计算每个节点的入度（依赖数）
        in_degree = {}
        for name in self.nodes:
            in_degree[name] = len(self.nodes[name].depends_on)
        
        # 入度为 0 的节点放入队列（第一层可并行执行的节点）
        queue = deque([name for name, deg in in_degree.items() if deg == 0])
        
        # 分层输出
        layers = []
        visited = set()
        
        while queue:
            layer_size = len(queue)
            current_layer = []
            
            for _ in range(layer_size):
                node = queue.popleft()
                if node in visited:
                    continue
                visited.add(node)
                current_layer.append(node)
                
                # 减少后续节点的入度
                for dependent in self.dependency_graph[node]["dependents"]:
                    in_degree[dependent] -= 1
                    if in_degree[dependent] == 0:
                        queue.append(dependent)
            
            if current_layer:
                layers.append(current_layer)
        
        # 检测环
        if len(visited) != len(self.nodes):
            raise ValueError("检测到循环依赖！")
        
        return layers
    
    async def execute(self):
        """
        分层执行：同一层的 Skill 并行执行，
        所有完成后进入下一层。
        """
        layers = self.topological_sort()
        results = {}
        
        for layer_idx, layer in enumerate(layers):
            print(f"执行层 {layer_idx + 1}: {layer}")
            
            # 创建当前层的所有 Skill 任务
            tasks = {}
            for skill_name in layer:
                # 收集该 Skill 的依赖结果
                dep_results = {
                    dep: results[dep] 
                    for dep in self.nodes[skill_name].depends_on
                }
                
                task = asyncio.create_task(
                    self._execute_skill(skill_name, dep_results)
                )
                tasks[skill_name] = task
            
            # 并行等待当前层所有 Skill 完成
            for skill_name, task in tasks.items():
                results[skill_name] = await task
        
        return results
    
    async def _execute_skill(self, name: str, dep_results: dict):
        """执行单个 Skill（实际实现会调用 SKILL.md）"""
        # 实际实现会调用 Agent 执行 Skill
        print(f"  执行 {name}，依赖结果: {list(dep_results.keys())}")
        await asyncio.sleep(0.1)  # 模拟执行
        return {"skill": name, "status": "completed"}
```

```python
# 执行示例
nodes = {
    "A": SkillNode("A", []),
    "B": SkillNode("B", ["A"]),
    "C": SkillNode("C", ["A"]),
    "D": SkillNode("D", ["A"]),
    "E": SkillNode("E", ["B", "C"]),
    "F": SkillNode("F", ["D", "E"]),
}

scheduler = DAGScheduler(nodes)
layers = scheduler.topological_sort()
print("并行层:", layers)
# 输出: [['A'], ['B', 'C', 'D'], ['E'], ['F']]

# asyncio.run(scheduler.execute())
```

### 6.2 优先级队列

当同时有多个编排请求时，调度器需要根据优先级决定先处理哪个请求。

```yaml
# 优先级队列配置
priority_queue:
  levels:
    - name: critical
      priority: 100
      description: "安全相关操作，立即执行"
      preempt: true              # 允许抢占低优先级任务
    
    - name: high
      priority: 70
      description: "用户交互任务，响应时间敏感"
      preempt: false
    
    - name: normal
      priority: 40
      description: "常规后台任务"
      preempt: false
    
    - name: batch
      priority: 10
      description: "批量处理任务，可延迟"
      preempt: false
  
  deadline_policy:
    critical: 30                 # 关键任务 30 秒内必须开始执行
    high: 120                    # 高优先级 2 分钟内开始执行
    normal: 600                  # 普通任务 10 分钟内开始执行
    batch: 3600                  # 批量任务 1 小时内开始执行
  
  scheduling:
    strategy: weighted_fair      # 加权公平调度
    weights:                     # 各优先级的资源分配权重
      critical: 5
      high: 3
      normal: 2
      batch: 1
```

### 6.3 超时控制与 Cancellation 传播

编排中最难处理的问题之一是：**当一个上游 Skill 超时或失败时，如何正确地取消所有依赖它的下游 Skill？**

```
Cancellation 传播链：

Skill B (静态分析) 超时
  │
  ├──→ 标记 B 为 failed
  │
  ├──→ 检测到 E 依赖 B
  │     └──→ 标记 E 为 cancelled (依赖失败)
  │           └──→ 检测到 F 依赖 E
  │                 └──→ 标记 F 为 cancelled (依赖失败)
  │
  ├──→ C 和 D 不依赖 B → 继续执行
  │
  └──→ 通知编排引擎：E 和 F 已被取消
```

```python
class CancellationToken:
    """可传播的取消令牌"""
    
    def __init__(self, parent: Optional['CancellationToken'] = None):
        self._cancelled = False
        self._children = []
        self._parent = parent
        self._lock = asyncio.Lock()
        
        if parent:
            parent._children.append(self)
    
    def cancel(self):
        """取消当前令牌及其所有子令牌"""
        async def _cancel():
            async with self._lock:
                if self._cancelled:
                    return
                self._cancelled = True
                # 级联取消所有子任务
                for child in self._children:
                    child.cancel()
        
        asyncio.create_task(_cancel())
    
    @property
    def is_cancelled(self) -> bool:
        return self._cancelled or (self._parent and self._parent.is_cancelled)


class TimeoutController:
    """超时控制"""
    
    @staticmethod
    async def with_timeout(coro, timeout: float, skill_name: str, cancel_token: CancellationToken):
        """为 Skill 执行添加超时控制"""
        try:
            return await asyncio.wait_for(coro, timeout=timeout)
        except asyncio.TimeoutError:
            print(f"Skill {skill_name} 超时 (>{timeout}s)")
            cancel_token.cancel()  # 传播取消信号
            raise TimeoutError(f"Skill {skill_name} 执行超时")
```

---

## 七、降级与熔断

### 7.1 部分 Skill 失效时的优雅降级

编排中的降级不是"全有或全无"。一个 Skill 失败不意味着整个编排应该失败。优雅降级意味着：**在部分能力缺失的情况下，系统仍能提供尽可能多的价值**。

```yaml
# 降级策略配置
degradation:
  strategy: minimize_impact          # 最小化影响
  partial_results: true              # 允许部分结果
  
  rules:
    - condition: "${security_scan.status == 'failed'}"
      impact:
        - skill: deployment
          action: block              # 安全扫描失败 → 阻止部署
        - skill: code_review
          action: allow              # 但代码审查结果仍然返回
          annotation: "security scan unavailable"
    
    - condition: "${integration_test.status == 'failed'}"
      impact:
        - skill: deployment
          action: allow_with_label   # 集成测试失败 → 允许部署但标红
          label: "deployed without integration test verification"
    
    - condition: "${notification.status == 'failed'}"
      impact:
        - skill: report_generator
          action: allow              # 通知失败不影响报告生成
        - skill: deployment
          action: allow
          annotation: "notification channel unavailable"
```

### 7.2 熔断器模式在 Skill 编排中的应用

熔断器模式（Circuit Breaker）源自分布式系统——当一个外部服务持续失败时，熔断器"断开"以避免连锁故障。在 Skill 编排中，熔断器可以防止一个故障的 Skill 拖垮整个编排引擎。

```
熔断器状态机：

        ┌──────────────────────────────┐
        │                              │
        ▼   失败计数 > 阈值             │
   ┌─────────┐     ──────────→  ┌──────────┐
   │ CLOSED  │                  │  OPEN     │
   │ (闭合)   │                  │  (断开)    │
   └─────────┘                  └──────────┘
        ↑                            │
        │                            │
        │      超时后尝试半开         │
        │    ┌────────────────┐       │
        │    │                │       │
        └────┴─── HALF_OPEN ──┘←─────┘
        (成功→闭合)          (仍失败→断开)
```

```yaml
# 熔断器配置
circuit_breaker:
  - skill: external_search_api
    enabled: true
    failure_threshold: 5              # 连续 5 次失败触发断开
    reset_timeout: 60                 # 60 秒后尝试半开
    half_open_max_requests: 3         # 半开状态下最多允许 3 个请求
    monitored_errors:
      - timeout                       # 超时
      - server_error                  # 服务端错误
      - service_unavailable           # 服务不可用
    non_monitored_errors:
      - invalid_query                 # 无效查询不算
    fallback_on_open:
      strategy: use_cache
      description: "熔断器打开，使用缓存数据"

  - skill: heavy_llm_call
    enabled: true
    failure_threshold: 3
    reset_timeout: 120
    half_open_max_requests: 1
    monitored_errors:
      - timeout
      - token_limit_exceeded
    fallback_on_open:
      strategy: switch_to_lighter_model
      description: "熔断器打开，切换到轻量模型"
```

```python
class CircuitBreaker:
    """熔断器实现"""
    
    def __init__(self, name: str, config: dict):
        self.name = name
        self.state = "CLOSED"          # CLOSED / OPEN / HALF_OPEN
        self.failure_count = 0
        self.failure_threshold = config["failure_threshold"]
        self.reset_timeout = config["reset_timeout"]
        self.half_open_max = config.get("half_open_max_requests", 1)
        self.half_open_count = 0
        self.last_failure_time = 0
        self.fallback = config.get("fallback_on_open", {})
    
    async def call(self, skill_func):
        """调用 Skill，熔断器保护"""
        
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.reset_timeout:
                self.state = "HALF_OPEN"
                self.half_open_count = 0
            else:
                return await self._fallback()
        
        try:
            result = await skill_func()
            
            # 成功处理
            if self.state == "HALF_OPEN":
                self.half_open_count += 1
                if self.half_open_count >= self.half_open_max:
                    self.state = "CLOSED"
                    self.failure_count = 0
            
            self.failure_count = 0
            return result
            
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
                print(f"熔断器 {self.name} 断开 (连续 {self.failure_count} 次失败)")
            
            raise
    
    async def _fallback(self):
        """执行降级策略"""
        strategy = self.fallback.get("strategy", "fail")
        if strategy == "use_cache":
            return await self._read_cache()
        elif strategy == "switch_to_lighter_model":
            return await self._call_lighter_model()
        else:
            raise CircuitBreakerOpenError(f"熔断器 {self.name} 打开中")
```

### 7.3 示例：搜索引擎不可用 → 使用本地缓存搜索

```yaml
---
name: resilient_orchestrated_search
version: 1.0.0
description: "熔断器 + 降级：搜索引擎不可用时切换到本地缓存"
execution:
  mode: async
  circuit_breakers:
    - skill: web_search
      failure_threshold: 3
      reset_timeout: 30
      fallback_on_open:
        strategy: use_cache
        cache_source: "local_search_cache"

sub_skills:
  - name: query_parser
    ref: .claude/skills/query_parse/SKILL.md
  - name: web_search
    ref: .claude/skills/web_search/SKILL.md
  - name: local_search_cache
    ref: .claude/skills/local_search/SKILL.md
  - name: result_ranker
    ref: .claude/skills/result_rank/SKILL.md
---

## 编排策略

### 正常路径

```
query_parser → web_search → result_ranker → 输出
```

### 降级路径

```
query_parser → [熔断器检测 web_search 断开]
            → local_search_cache → result_ranker → 输出
            → 标记：结果来自缓存（可能过期）
```

### 恢复路径

```
熔断器半开后：
  → 尝试 1 次 web_search
  → 成功：恢复到正常路径，熔断器闭合
  → 失败：回到熔断器断开状态，继续使用缓存
```

---

## 八、实战示例：多 Skill 编排的完整实现

下面是一个完整的多 Skill 编排示例，展示一个"智能 CI/CD Pipeline"的 YAML 定义和对应的状态图。

### YAML 定义

```yaml
---
name: smart_ci_cd_pipeline
version: 1.0.0
description: "完整的 CI/CD 编排：代码审查 + 安全扫描 + 测试 + 部署 + 通知"

execution:
  mode: async
  timeout: 1800                       # 整体 30 分钟超时
  max_retries: 1                      # 全局重试一次

# 子 Skill 声明
sub_skills:
  - name: checkout
    ref: .claude/skills/git_checkout/SKILL.md
    timeout: 120
    
  - name: code_review
    ref: .claude/skills/code_review/SKILL.md
    timeout: 300
    depends_on: [checkout]
    
  - name: security_scan
    ref: .claude/skills/security_scan/SKILL.md
    timeout: 300
    depends_on: [checkout]
    
  - name: unit_test
    ref: .claude/skills/unit_test/SKILL.md
    timeout: 600
    depends_on: [checkout]
    
  - name: integration_test
    ref: .claude/skills/integration_test/SKILL.md
    timeout: 600
    depends_on: [checkout]
    
  - name: result_assembly
    ref: .claude/skills/result_assembly/SKILL.md
    timeout: 60
    depends_on: [code_review, security_scan, unit_test, integration_test]

# 条件分支
conditional:
  - name: verdict_routing
    expression: "${result_assembly.verdict}"
    cases:
      - value: "pass"
        goto: deploy
      - value: "fail"
        goto: notification_fail
      - value: "warning"
        goto: manual_approval

# 降级和熔断
degradation:
  partial_results: true
  rules:
    - condition: "${unit_test.status == 'partial'}"
      impact:
        - skill: integration_test
          action: skip
          reason: "单元测试部分失败，跳过集成测试"
    - condition: "${security_scan.status == 'failed'}"
      impact:
        - skill: deploy
          action: block
          reason: "安全扫描失败，阻止部署"

circuit_breakers:
  - skill: security_scan
    failure_threshold: 3
    reset_timeout: 60
    fallback_on_open:
      strategy: skip
      annotation: "安全扫描服务不可用，已跳过"

# 串行步骤
steps:
  - name: deploy
    skill: .claude/skills/deploy/SKILL.md
    timeout: 300
    depends_on: [result_assembly]
    
  - name: notification_fail
    skill: .claude/skills/notification/SKILL.md
    config:
      channel: "#ci-failures"
      template: failure_template
      
  - name: notification_success
    skill: .claude/skills/notification/SKILL.md
    config:
      channel: "#deployments"
      template: success_template
      
  - name: manual_approval
    skill: .claude/skills/manual_approval/SKILL.md
    timeout: 3600
    config:
      approvers_role: "tech-lead"
    next_on_approve: deploy
    next_on_reject: notification_fail
---

## 编排策略

### 状态图

```
                   ┌──────────────┐
                   │   checkout   │
                   └──────┬───────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌──────────┐   ┌──────────────┐   ┌─────────┐
   │code_     │   │security_scan │   │unit_test│
   │review    │   │              │   │         │
   └─────┬────┘   └──────┬───────┘   └────┬────┘
         │               │                │
         └───────┬───────┴────────┬───────┘
                 │                │
                 ▼                ▼
          ┌──────────────┐  ┌──────────────┐
          │ integration_ │  │   result_    │
          │ test         │  │   assembly   │
          └──────────────┘  └──────┬───────┘
                                   │
                          ┌────────▼────────┐
                          │   verdict_      │
                          │   routing       │
                          └────────┬────────┘
                                   │
                   ┌───────────────┼───────────────┐
                   │               │               │
                   ▼               ▼               ▼
            ┌──────────┐   ┌──────────┐   ┌────────────────┐
            │  deploy  │   │notification_fail   │   manual_   │
            │          │   │          │   │   approval      │
            └────┬─────┘   └──────────┘   └────────┬───────┘
                 │                                  │
                 ▼                          ┌───────┴───────┐
          ┌──────────────┐          approve │               │ reject
          │notification_ │          ┌───────▼────┐   ┌──────▼──────┐
          │success       │          │   deploy   │   │notification │
          └──────────────┘          └─────┬──────┘   │_fail        │
                                          │          └─────────────┘
                                          ▼
                                   ┌──────────────┐
                                   │notification_ │
                                   │success       │
                                   └──────────────┘
```

### 并发和依赖矩阵

```
Skill                | 依赖            | 与谁并发         | 超时(秒) | 熔断器
─────────────────────+─────────────────+──────────────────+─────────+───────
checkout             | 无              | —                | 120     | 否
code_review          | checkout        | security_scan,   | 300     | 否
                     |                 | unit_test,       |         |
                     |                 | integration_test |         |
security_scan        | checkout        | code_review,     | 300     | 是
                     |                 | unit_test,       |         |
                     |                 | integration_test |         |
unit_test            | checkout        | code_review,     | 600     | 否
                     |                 | security_scan,   |         |
                     |                 | integration_test |         |
integration_test     | checkout        | code_review,     | 600     | 否
                     |                 | security_scan,   |         |
                     |                 | unit_test        |         |
result_assembly      | code_review,    | —                | 60      | 否
                     | security_scan,  |                  |         |
                     | unit_test,      |                  |         |
                     | integration_test|                  |         |
deploy               | result_assembly | —                | 300     | 否
notification_fail    | 条件触发        | —                | 30      | 否
manual_approval      | 条件触发        | —                | 3600    | 否
notification_success | deploy          | —                | 30      | 否
```

### 异常处理路径

```
安全扫描失败 (security_scan.status == 'failed')：
  → 熔断器记录失败计数
  → result_assembly 收到 security_scan 的失败状态
  → verdict = "fail"（因为安全扫描失败触发一票否决）
  → 跳过 deploy
  → 执行 notification_fail

安全检查熔断 (熔断器打开)：
  → security_scan 被跳过
  → result_assembly 收到 "security_scan: skipped (circuit breaker open)"
  → verdict 不因此为 fail
  → 继续执行其他路径

单元测试部分失败：
  → unit_test 标记为 partial
  → 降级规则触发：跳过 integration_test
  → result_assembly 在无 integration_test 结果的情况下继续
  → verdict = "warning"
  → 进入 manual_approval
  → 技术负责人批准后 → deploy

deploy 部署失败：
  → 自动回滚到上一个稳定版本
  → 执行 notification_fail
  → 不执行 notification_success
```

---

## 九、思考题

1. **DAG 调度 vs 管道模式**：第 7 章的管道模式和本章的 DAG 调度都涉及"顺序执行"。它们有什么区别？什么时候应该选择管道模式而不是 DAG 调度？请从表达能力、执行效率和错误处理三个维度分析。

2. **条件组合的幂等性**：假设一个编排流程中包含条件节点"如果代码审查通过，则执行部署"。如果部署执行到一半时系统崩溃，重启后编排引擎从断点恢复——此时如何确保条件判断的结果不会因为上下文状态的变化而产生不同的分支选择？请设计一个恢复策略。

3. **熔断器参数设计**：在一个生产环境中，安全扫描服务偶尔会超时，通常平均每 100 次调用中会有 3-5 次超时。你被要求为这个服务配置熔断器。请考虑以下问题并给出你的配置：
   - `failure_threshold` 设定为多少？
   - `reset_timeout` 设定为多少？
   - 半开状态下的 `half_open_max_requests` 设定为多少？
   - 熔断后使用什么降级策略？
   - 如何避免"频繁断开-恢复"的振荡？

4. **上下文传播的安全性**：在一个涉及多个 Skill 的编排中，上下文传播机制会自动传递 `auth_token` 到所有子 Skill。但有一个"报告生成"Skill 只需要读取代码审查结果，不需要进行任何授权操作。请分析以下问题：
   - 自动传播的 `auth_token` 在不需要它的 Skill 中是否存在安全风险？
   - 如何设计"最小权限"的上下文传播策略？
   - 在子 Skill 被攻击者控制的情况下，传播的上下文可能被如何滥用？

---

## 十、本章小结

本章从"多个 Skill 如何协同工作"出发，系统探讨了 Skill 编排的核心挑战和解决方案：

1. **串行组合**：管道数据流 + Schema 适配器，确保 Skill 间的数据正确传递
2. **并行组合**：Fan-out/Fan-in 模式，配合资源限流实现安全高效的并行执行
3. **条件组合**：条件节点设计，支持基于中间结果的动态路径选择
4. **状态管理**：命名空间隔离 + 写冲突解决 + 过期读预防 + 上下文传播
5. **DAG 调度**：拓扑排序分层执行，支持最大程度并行的技能编排
6. **降级熔断**：优雅降级策略和熔断器模式，在部分失效时保持系统可用性

编排引擎是 Agent 系统从"能用"走向"好用"的关键基础设施。它不直接产生业务价值，但它决定了系统能否可靠地协调多个专业能力。

结合第 7 章的设计模式和第 8 章的编排策略，你已经具备了设计大型 Skill 系统的理论基础。下一章将从"开发"视角切换到"质量保障"视角，探讨如何测试 Skill、如何确保编排的正确性和可靠性。

---

## 十一、参考资料

- Dean, J., & Ghemawat, S. (2004). "MapReduce: Simplified Data Processing on Large Clusters". *OSDI'04*. —— 本章并行组合部分的 Fan-out/Fan-in 模式受 MapReduce 论文启发
- Nygard, M. (2007). *Release It!: Design and Deploy Production-Ready Software*. Pragmatic Bookshelf. —— 本章熔断器模式和降级策略的理论来源，经典的生产就绪软件设计指南
- Kahn, G. (1974). "The Semantics of a Simple Language for Parallel Programming". *IFIP Congress*. —— Kahn Process Network 模型，本章 DAG 调度算法的理论基础
- Fowler, M. (2004). "Circuit Breaker". *martinfowler.com/bliki/CircuitBreaker.html*. —— 熔断器模式的经典描述
- [Agent Skills Open Standard (agentskills.io)](https://agentskills.io) —— SKILL.md 开放标准，本章编排 `execution` 配置的字段定义参考了该标准
- [Anthropic Skills 构建指南](https://cloud.tencent.com/developer/article/2631678) —— Anthropic 官方实践指南
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/) —— LangChain 的状态图编排实现，本章 DAG 调度部分的设计受其架构启发
- [ClawHub Skills Marketplace](https://clawhub.dev/skills) —— 社区 Skills 市场，本章实战示例的编排结构参考了多个社区 CI/CD Skills 的最佳实践
- Apache Airflow Documentation —— DAG 调度器设计的行业参考，本章 `topological_sort` 算法借鉴了 Airflow 的调度模型
- Hystrix (Netflix) — Circuit Breaker Pattern —— Netflix 的熔断器实现，本章熔断器模式的参数设计参考了 Hystrix 的生产经验

---

[← 上一章：Skill 设计模式目录](./07-design-patterns) | [返回索引](./) | [下一章：Skill 测试策略 →](./09-testing-strategy)
