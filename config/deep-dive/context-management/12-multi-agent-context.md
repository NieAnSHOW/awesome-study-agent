# 多 Agent 系统的上下文管理

> 单个 Agent 管理上下文已经够复杂了，多个 Agent 协作时，上下文问题复杂度又翻了几倍。

---

## 为什么多 Agent 上下文不一样

前面所有章节讨论的都是"一个 AI 如何管理上下文"。但在多 Agent 系统中，问题变成了：

- **共享 vs 隔离**：哪些上下文是所有 Agent 共享的？哪些是某个 Agent 私有的？
- **一致性**：Agent A 修改了上下文，Agent B 怎么知道？
- **层级化**：编排 Agent 分发任务时，怎么传递"子上下文"？
- **冲突**：两个 Agent 从不同角度得出了矛盾的上下文信息，怎么办？

```
单 Agent 上下文模型：
┌─────────────────┐
│    上下文      │ ← 一个 Agent，一个上下文
│   (一个池子)   │
└─────────────────┘

多 Agent 上下文模型：
┌─────────────────────────────────┐
│         共享上下文池              │
│  (技术栈、架构、全局规范)         │
└────────────────┬────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐ ┌───▼────┐ ┌───▼────┐
│ Agent A│ │ Agent B│ │ Agent C│
│ 上下文  │ │ 上下文  │ │ 上下文  │
│ (私有)  │ │ (私有)  │ │ (私有)  │
└────────┘ └────────┘ └────────┘
```

---

## 上下文的三层模型

### 全局层（Global Context）

所有 Agent 共享的基础上下文。通常只读，不会在运行时修改。

```yaml
# 全局上下文（只读）
project_context:
  tech_stack:
    frontend: "React 18 + TypeScript"
    backend: "Nest.js + Prisma"
    database: "PostgreSQL"

  architecture:
    pattern: "模块化"
    modules: ["user", "order", "payment"]

  coding_standards:
    naming: "camelCase"
    comments: "JSDoc"
```

**特点**：
- 所有 Agent 可见
- 通常只读
- 变化频率低
- 放在配置文件或共享存储中

### 共享层（Shared Context）

多个 Agent 协作时需要共享的上下文——当前任务的进度、中间结果、决策记录。

```yaml
# 共享上下文（读写）
shared_context:
  current_sprint: "Sprint 12"
  task_status:
    payment_module:
      status: "in_progress"
      completed_by: "Agent-A"
      pending_review: "Agent-B"

  agreed_patterns:
    - "所有金额用分为单位"
    - "错误码格式：模块_编号"
```

**特点**：
- 相关 Agent 可见
- 可读写
- 需要同步机制
- 变化频率中

### 私有层（Private Context）

每个 Agent 自己的工作记忆——当前正在处理的任务、临时思考、中间状态。

```yaml
# Agent-A 的私有上下文
agent_a_private:
  current_task: "实现支付模块的退款接口"
  working_notes:
    - "参考了订单模块的取消接口实现"
    - "需要处理并发退款问题（用 Redis 锁）"
    - "待确认：退款是否要经过人工审核"
  local_cache:
    order_schema: "..."
    payment_schema: "..."
```

**特点**：
- 仅该 Agent 可见
- 可读写
- 不需要同步
- 变化频率高

### 三层关系

```
全局上下文
   │ 所有 Agent 启动时加载
   ▼
共享上下文 ←── Agent A 写入 → Agent B 读取 ←── Agent C 写入
   │ 协作 Agent 们共同维护
   ▼
私有上下文（Agent A）  私有上下文（Agent B）  私有上下文（Agent C）
   │ 各自的工作记忆
```

---

## Agent 间上下文共享模式

### 模式 1：黑板上模式（Blackboard Pattern）

所有 Agent 通过一个共享的"黑板"交换信息：

```
┌─────────────────────────────────┐
│           黑板上下文              │
│                                 │
│  Agent A 写入:                  │
│    "用户模块已分析完毕"          │
│    "user.service.ts 包含认证逻辑"│
│                                 │
│  Agent B 读取:                  │
│    → 知道用户模块有认证逻辑      │
│    → 在设计订单模块时引用        │
│                                 │
│  Agent C 更新:                  │
│    "发现 /api/orders 需要认证"   │
└─────────────────────────────────┘
```

**适用场景**：Agent 之间没有固定协作顺序，各自独立贡献信息。

**实现方式**：共享向量数据库或键值存储，所有 Agent 可读写。

### 模式 2：管道模式（Pipeline Pattern）

Agent 按顺序处理，前一个的输出是后一个的上下文：

```
请求
  │
  ▼
Agent A（需求分析）
  │ 输出：需求文档 + 技术约束
  ▼
Agent B（架构设计）
  │ 输出：架构方案 + 模块划分
  ▼
Agent C（代码实现）
  │ 输出：代码 + 测试用例
  ▼
Agent D（代码审查）
  │ 输出：审查意见
  ▼
最终结果
```

**适用场景**：有明确的处理流程，Agent 按顺序执行。

**关键点**：
- 每个 Agent 的输出都要结构化，方便下一个 Agent 解析
- 传递的上下文需要"有损压缩"——不是直接把所有内容传给下一个 Agent
- 中间结果需要持久化，方便追溯

### 模式 3：事件总线模式（Event Bus Pattern）

Agent 通过事件机制发布和订阅上下文变更：

```python
class ContextEventBus:
    """上下文事件总线"""

    def __init__(self):
        self.subscribers = {}  # event_type → [agent_id]

    def publish(self, event_type: str, data: dict):
        """发布上下文变更事件"""
        for agent_id in self.subscribers.get(event_type, []):
            self.notify(agent_id, event_type, data)

    def subscribe(self, event_type: str, agent_id: str):
        """订阅特定类型的上下文变更"""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(agent_id)

# 使用示例
bus = ContextEventBus()

# Agent A 订阅"数据模型变更"事件
bus.subscribe("schema_change", "agent_b")

# Agent C 修改了数据模型后发布事件
bus.publish("schema_change", {
    "entity": "Order",
    "change": "added field: discount_amount",
    "changed_by": "agent_c"
})

# Agent B 收到通知，更新自己的上下文
```

**适用场景**：Agent 之间松耦合，需要对上下文变更做出反应。

---

## 上下文一致性问题

多 Agent 系统中，最常见的故障模式是："信息不一致"。

### 常见的不一致场景

```
场景 1：竞争写入
Agent A 写入："用户模块用 Zustand 状态管理"
Agent B 写入："用户模块用 Redux 状态管理"
（两个 Agent 从不同文档得出不同结论）

场景 2：过时读取
Agent C 读取了 Agent A 的写入（Zustand）
但此时 Agent A 已经修正为 "Jotai"
Agent C 基于过时信息做决策

场景 3：循环依赖
Agent A 的上下文依赖 Agent B 的输出
Agent B 的上下文依赖 Agent A 的输出
（死锁）
```

### 解决方案

**方案 1：写入锁**

```python
class ContextLock:
    """上下文写入锁，防止竞争写入"""

    def __init__(self):
        self.locks = {}

    def acquire(self, key: str, agent_id: str):
        """获取某个上下文键的写入锁"""
        if key in self.locks:
            return False  # 已被锁定
        self.locks[key] = agent_id
        return True

    def release(self, key: str, agent_id: str):
        """释放写入锁"""
        if self.locks.get(key) == agent_id:
            del self.locks[key]

    @contextmanager
    def write_context(self, key: str, agent_id: str):
        """上下文写入的上下文管理器"""
        if not self.acquire(key, agent_id):
            raise ContextLockedError(f"{key} 已被其他 Agent 锁定")
        try:
            yield
        finally:
            self.release(key, agent_id)
```

**方案 2：版本号**

每条上下文记录带版本号，写入时检查版本是否一致：

```python
class VersionedContext:
    """带版本号的上下文记录"""

    def __init__(self, storage):
        self.storage = storage

    def write(self, key: str, value: any, agent_id: str):
        """带乐观锁的写入"""
        current = self.storage.get(key)
        if current and current.get("locked_by") not in [None, agent_id]:
            raise ContextConflictError(f"{key} 被 {current['locked_by']} 锁定")

        version = (current["version"] if current else 0) + 1
        self.storage.set(key, {
            "value": value,
            "version": version,
            "updated_by": agent_id,
            "updated_at": timestamp()
        })

    def read(self, key: str) -> dict:
        """读取，包含版本号"""
        return self.storage.get(key)
```

**方案 3：仲裁 Agent**

在复杂场景下，引入一个专门的仲裁 Agent 来解决冲突：

```python
def arbiter_resolve(conflicts: list) -> dict:
    """仲裁 Agent：解决上下文冲突"""
    prompt = f"""
    以下上下文存在冲突，请根据以下原则仲裁：

    冲突内容：
    {conflicts}

    仲裁原则：
    1. 最新的信息优先（检查时间戳）
    2. 来自权威来源的优先（官方文档 > 推测）
    3. 如果无法确定，标记为"待确认"
    """
    resolution = arbiter_llm.generate(prompt)
    return resolution
```

### 一致性模型对比

| 模型 | 适用场景 | 一致性保证 | 性能影响 |
|------|---------|-----------|---------|
| **最终一致性** | 非关键场景 | 弱 | 低 |
| **写入锁** | 关键数据 | 强 | 中 |
| **版本号乐观锁** | 高并发读 | 中 | 低 |
| **仲裁 Agent** | 复杂决策 | 强 | 高 |

---

## 层级化上下文传递

### 编排水管模式

编排 Agent 将大任务分解后，为每个子任务 Agent 组装"子上下文"：

```
编排 Agent
    │
    │  "实现订单模块：技术栈=React+Nest.js"
    │  "子任务1：数据库 schema → 上下文={schema规范}"
    │  "子任务2：API 实现  → 上下文={API规范, schema}"
    │  "子任务3：前端页面  → 上下文={API端点, 组件规范}"
    │
    ├── Agent A（数据库 schema）
    │   接收上下文：全局 + schema规范
    │   输出：创建好的数据表
    │
    ├── Agent B（API 实现）
    │   接收上下文：全局 + API规范 + schema输出
    │   输出：API 代码
    │
    └── Agent C（前端页面）
        接收上下文：全局 + 组件规范 + API端点
        输出：前端组件
```

**关键设计**：每个子任务 Agent 拿到的上下文是"裁剪后"的，不是完整的全局上下文。

### 上下文传递原则

```
向下传递：
  保留 → 全局上下文（通用信息）
  添加 → 任务特定上下文（具体需求）
  排除 → 当前子任务不需要的信息

向上回传：
  传递 → 结果概要
  回传 → 发现的关键信息（可加入共享上下文）
  过滤 → 内部实现细节
```

### 子上下文组装示例

```python
def assemble_sub_context(agent_role, global_ctx, shared_ctx, task):
    """为特定 Agent 组装上下文"""

    # 基础：全局上下文
    context = {
        "tech_stack": global_ctx["tech_stack"],
        "standards": global_ctx["coding_standards"],
    }

    # 按角色添加上下文
    if agent_role == "backend":
        context["api_style"] = global_ctx["api_design"]
        context["database"] = global_ctx["data_models"]
    elif agent_role == "frontend":
        context["ui_components"] = global_ctx["component_library"]
        context["state_management"] = global_ctx["state_pattern"]

    # 添加共享的当前状态
    if task["depends_on"]:
        for dep in task["depends_on"]:
            if dep in shared_ctx:
                context[f"{dep}_output"] = shared_ctx[dep]["summary"]

    # 添加任务描述
    context["task"] = task

    return context
```

---

## 2026 年实践建议

### 框架层面的上下文支持

| 框架 | 上下文管理方式 | 适合场景 |
|------|-------------|---------|
| **LangGraph** | 状态图（StateGraph），显式的上下文传递 | 有状态的 Agent 工作流 |
| **CrewAI** | 任务上下文 + 共享知识 | 团队式 Agent 协作 |
| **AutoGen** | 对话上下文中继 | 对话式多 Agent |
| **Mastra** | 记忆工具（memorize/remember） | TypeScript 生态 |
| **Semantic Kernel** | 插件上下文层级 | 企业 .NET 项目 |

### 起步建议

```
从简单到复杂的演进路径：

第 1 步：先管好单 Agent 上下文
  → 确保基础扎实（前面 10 章的内容）

第 2 步：引入共享上下文池
  → 多个 Agent 读取同一份基础配置
  → 先只读，不涉及写入冲突

第 3 步：加入 Agent 间通信
  → 黑板模式或事件总路线
  → 明确上下文的读写边界

第 4 步：处理一致性问题
  → 在出现冲突的地方加锁或仲裁
  → 不是所有数据都需要强一致

第 5 步：优化层级化传递
  → 编排 Agent 裁剪子上下文
  → 减少每个 Agent 的上下文负担
```

---

[← 返回文章目录](../context-management/) | [继续学习：实战案例 →](./13-case-study-evolution/)
