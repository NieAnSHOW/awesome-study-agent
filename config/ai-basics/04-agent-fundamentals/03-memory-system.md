# 记忆系统

> **本章学习目标**：理解 AI Agent 的记忆机制、不同类型的记忆、实现方式以及最佳实践
>
> **预计阅读时间**：40 分钟

---

## 一、记忆系统概述

### 1.1 为什么 Agent 需要记忆？

想象一下，如果你没有记忆：

```
❌ 每次对话都要重新介绍自己
❌ 无法记住之前讨论的内容
❌ 无法从过去的经验中学习
❌ 无法建立长期关系
❌ 总是重复同样的错误
```

Agent 也是一样。记忆是 Agent 的关键能力：

```
✅ 理解上下文
✅ 保持对话连贯性
✅ 从经验中学习
✅ 建立个性化
✅ 持续改进
```

### 1.2 记忆的作用

```
┌─────────────────────────────────────────┐
│         记忆在 Agent 中的作用            │
├─────────────────────────────────────────┤
│ 1. 上下文保持                           │
│    • 理解"它"指的是什么                 │
│    • 跟踪对话状态                       │
│                                         │
│ 2. 知识积累                             │
│    • 存储学到的信息                     │
│    • 构建知识库                         │
│                                         │
│ 3. 个性化                               │
│    • 记住用户偏好                       │
│    • 适应交互风格                       │
│                                         │
│ 4. 经验学习                             │
│    • 记住成功案例                       │
│    • 避免重复错误                       │
│                                         │
│ 5. 任务连续性                           │
│    • 跨会话保持状态                     │
│    • 恢复未完成任务                     │
└─────────────────────────────────────────┘
```

---

## 二、记忆的类型

### 2.1 感觉寄存器 (Sensory Memory)

**定义**：
瞬时记忆，保存原始输入信息。

**特点**：
```
✓ 容量极大
✓ 持续时间极短（毫秒级）
✗ 未经处理的信息
```

**例子**：
```
用户输入：消息文本
Agent：立即接收，准备处理
```

---

### 2.2 工作记忆 (Working Memory / Short-term Memory)

**定义**：
当前任务相关的信息，存在于执行过程中。

**特点**：
```
✓ 快速访问
✓ 容量有限
✓ 持续时间短（秒到分钟）
✓ 保存当前正在处理的信息
```

**包含内容**：
```
• 当前对话历史
• 任务上下文
• 中间结果
• 临时状态
• 正在使用的工具和参数
```

**实现方式**：
```python
# 工作记忆示例
class WorkingMemory:
    def __init__(self, max_tokens=8000):
        self.messages = []  # 对话历史
        self.context = {}   # 当前上下文
        self.temp_data = {} # 临时数据

    def add_message(self, role, content):
        self.messages.append({"role": role, "content": content})

    def get_context(self):
        # 返回最近的对话作为上下文
        return self.messages[-self.max_tokens:]

    def clear(self):
        # 任务完成后清空
        self.messages = []
        self.context = {}
```

---

### 2.3 长期记忆 (Long-term Memory)

**定义**：
持久化的知识存储，可以跨越会话保存。

**特点**：
```
✓ 容量几乎无限
✓ 持续时间长（永久）
✓ 需要检索机制
✓ 可以组织和索引
```

**包含内容**：
```
• 历史对话
• 用户偏好
• 学到的知识
• 成功案例
• 错误经验
• 领域知识
• 任务模板
```

**实现方式**：
```python
# 长期记忆示例
class LongTermMemory:
    def __init__(self):
        self.vector_db = VectorDatabase()  # 向量数据库
        self.key_value_store = {}           # 键值存储
        self.graph_db = GraphDatabase()     # 知识图谱（可选）

    def store(self, information, metadata=None):
        """存储信息到长期记忆"""
        # 转换为向量并存储
        embedding = self.embed(information)
        self.vector_db.add(embedding, information, metadata)

    def retrieve(self, query, top_k=5):
        """检索相关记忆"""
        query_embedding = self.embed(query)
        results = self.vector_db.search(query_embedding, top_k)
        return results

    def update(self, memory_id, new_info):
        """更新已有记忆"""
        self.vector_db.update(memory_id, new_info)

    def forget(self, memory_id):
        """删除记忆"""
        self.vector_db.delete(memory_id)
```

---

### 2.4 三种记忆的协作

```
┌──────────────────────────────────────────────┐
│              感觉寄存器                       │
│        (瞬时保存原始输入)                     │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│              工作记忆                         │
│    (当前任务的信息，快速访问)                 │
│    • 对话历史                                │
│    • 任务状态                                │
│    • 中间结果                                │
└──────────┬───────────────────┬───────────────┘
           ↑                   ↓
           │           长期记忆
           │      (持久化知识库)
           │           ↑                   ↓
           └───────────┴───────────────────┘
                    检索和存储
```

**工作流程**：
```
1. 输入进入感觉寄存器
2. 相关信息从长期记忆检索到工作记忆
3. 工作记忆处理信息
4. 重要信息存储到长期记忆
5. 不重要信息遗忘
```

---

## 三、记忆的实现技术

### 3.1 对话上下文（简单场景）

**适用**：短对话、单次任务

**实现**：利用 LLM 的上下文窗口

```python
class SimpleMemory:
    def __init__(self, max_messages=20):
        self.messages = []

    def add(self, role, content):
        self.messages.append({"role": role, "content": content})
        # 保持消息数量在限制内
        if len(self.messages) > max_messages:
            self.messages = self.messages[-max_messages:]

    def get_context(self):
        return self.messages
```

**优点**：
- ✓ 简单
- ✓ 快速
- ✓ LLM 原生支持

**缺点**：
- ✗ 容量有限（受上下文窗口限制）
- ✗ 跨会话无法保存
- ✗ 无法智能检索

---

### 3.2 向量数据库（推荐）

**适用**：需要语义检索、长期存储

**技术原理**：
```
文本 → Embedding 模型 → 向量
                              ↓
                        向量数据库
                              ↓
                        相似度搜索
```

**主流向量数据库**：

| 数据库 | 特点 | 适用场景 |
|--------|------|---------|
| **Chroma** | 轻量、易用 | 原型开发 |
| **Pinecone** | 托管服务、性能好 | 生产环境 |
| **Weaviate** | 开源、功能全 | 自托管 |
| **Milvus** | 高性能、可扩展 | 大规模部署 |

**实现示例**：
```python
import chromadb
from chromadb.config import Settings

class VectorMemory:
    def __init__(self):
        # 初始化 Chroma
        self.client = chromadb.Client(Settings())
        self.collection = self.client.create_collection(
            name="agent_memory",
            metadata={"hnsw:space": "cosine"}
        )

    def add_memory(self, content, metadata=None):
        """添加记忆"""
        # 生成 ID
        memory_id = str(uuid.uuid4())

        # 存储到向量数据库
        self.collection.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[memory_id]
        )
        return memory_id

    def search_memory(self, query, n_results=5):
        """搜索相关记忆"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results

    def get_recent(self, n=10):
        """获取最近的记忆"""
        results = self.collection.get(
            limit=n,
            include=["documents", "metadatas"]
        )
        return results
```

**使用示例**：
```python
# 初始化记忆系统
memory = VectorMemory()

# 存储对话
memory.add_memory(
    "用户喜欢Python和机器学习",
    metadata={"type": "preference", "user": "user123"}
)

memory.add_memory(
    "用户正在学习AI Agent开发",
    metadata={"type": "interest", "user": "user123"}
)

# 检索相关记忆
query = "用户对什么编程语言感兴趣？"
results = memory.search_memory(query, n_results=3)

# 返回最相关的记忆
for doc, metadata in zip(results['documents'][0], results['metadatas'][0]):
    print(f"记忆: {doc}")
    print(f"元数据: {metadata}\n")
```

---

### 3.3 键值存储（结构化数据）

**适用**：精确查询、结构化数据

**实现**：
```python
import json
import os

class KeyValueMemory:
    def __init__(self, file_path="memory.json"):
        self.file_path = file_path
        self.data = self.load()

    def load(self):
        """从文件加载"""
        if os.path.exists(self.file_path):
            with open(self.file_path, 'r') as f:
                return json.load(f)
        return {}

    def save(self):
        """保存到文件"""
        with open(self.file_path, 'w') as f:
            json.dump(self.data, f, indent=2)

    def set(self, key, value):
        """设置键值"""
        self.data[key] = value
        self.save()

    def get(self, key, default=None):
        """获取值"""
        return self.data.get(key, default)

    def delete(self, key):
        """删除键"""
        if key in self.data:
            del self.data[key]
            self.save()
```

**使用场景**：
```python
# 存储用户偏好
preferences = KeyValueMemory("user_preferences.json")
preferences.set("language", "Chinese")
preferences.set("theme", "dark")
preferences.set("timezone", "Asia/Shanghai")

# 存储任务状态
tasks = KeyValueMemory("task_status.json")
tasks.set("task_001", {"status": "completed", "result": "..."})
tasks.set("task_002", {"status": "in_progress", "step": 3})
```

---

### 3.4 混合方案（生产推荐）

**结合多种存储方式**：

```
┌─────────────────────────────────────────┐
│          混合记忆系统                    │
├─────────────────────────────────────────┤
│                                         │
│  对话上下文（LLM 窗口）                 │
│  • 最近的消息                           │
│  • 快速访问                             │
│                                         │
│  + 向量数据库（语义检索）               │
│  • 历史对话                             │
│  • 知识库                               │
│                                         │
│  + 键值存储（精确查询）                 │
│  • 用户偏好                             │
│  • 任务状态                             │
│                                         │
│  + 图数据库（可选）                     │
│  • 知识图谱                             │
│  • 关系网络                             │
└─────────────────────────────────────────┘
```

**实现示例**：
```python
class HybridMemory:
    def __init__(self):
        self.working_memory = []  # 对话上下文
        self.vector_memory = VectorMemory()  # 向量数据库
        self.key_value_memory = KeyValueMemory()  # 键值存储

    def add_to_working(self, message):
        """添加到工作记忆"""
        self.working_memory.append(message)
        # 限制长度
        if len(self.working_memory) > 100:
            self.working_memory = self.working_memory[-100:]

    def store_long_term(self, content, metadata):
        """存储到长期记忆"""
        # 根据类型选择存储方式
        if metadata.get("type") == "preference":
            # 用户偏好用键值存储
            self.key_value_memory.set(metadata["key"], content)
        else:
            # 其他信息用向量存储
            self.vector_memory.add_memory(content, metadata)

    def retrieve(self, query):
        """检索信息"""
        # 先从工作记忆找
        working_results = self._search_working(query)

        # 再从长期记忆检索
        long_term_results = self.vector_memory.search_memory(query)

        # 合并结果
        return working_results + long_term_results

    def get_preference(self, key):
        """获取用户偏好"""
        return self.key_value_memory.get(key)
```

---

## 四、记忆管理策略

### 4.1 记忆分层

```
热数据 (Hot Data)
    ↓ 频繁访问
    • 当前对话
    • 任务上下文
    → 存储在：工作记忆

温数据 (Warm Data)
    ↓ 偶尔访问
    • 最近的历史
    • 常用知识
    → 存储在：向量数据库（快速存储）

冷数据 (Cold Data)
    ↓ 很少访问
    • 早期历史
    • 归档数据
    → 存储在：向量数据库（归档）或对象存储
```

### 4.2 记忆更新

**重要性评分**：
```python
def calculate_importance(memory):
    """计算记忆的重要性分数"""
    score = 0

    # 因素 1：情感强度
    if memory.get("emotion") == "strong":
        score += 3

    # 因素 2：与任务的相关性
    if memory.get("relevant"):
        score += 2

    # 因素 3：新颖性（新信息）
    if memory.get("is_new"):
        score += 2

    # 因素 4：引用次数
    score += memory.get("reference_count", 0) * 0.5

    return score
```

**记忆更新策略**：
```python
def update_memory(agent, new_info):
    """更新记忆"""
    importance = calculate_importance(new_info)

    if importance > 5:
        # 重要信息，立即存储并强化
        agent.memory.store(new_info, importance="high")
        agent.memory.reinforce(new_info)

    elif importance > 2:
        # 中等信息，正常存储
        agent.memory.store(new_info, importance="medium")

    else:
        # 低重要性，可能不存储或延迟存储
        if agent.memory.should_store(new_info):
            agent.memory.store(new_info, importance="low")
```

### 4.3 记忆检索

**检索策略**：

1. **时间窗口检索**：
```python
# 检索最近 N 条记忆
recent_memories = memory.get_last_n(10)
```

2. **语义检索**：
```python
# 根据语义相似度检索
related_memories = memory.search(query="用户喜欢什么编程语言？")
```

3. **元数据过滤**：
```python
# 根据元数据过滤
preferences = memory.filter(metadata={"type": "preference", "user": "user123"})
```

4. **混合检索**：
```python
# 结合时间和语义
memories = memory.search(
    query="编程语言",
    time_range="last_7_days",
    metadata={"user": "user123"}
)
```

### 4.4 记忆清理

**定期清理策略**：
```python
def cleanup_memory(memory):
    """清理记忆"""

    # 1. 删除低重要性且长时间未访问的记忆
    memory.delete(
        condition=lambda m: (
            m.importance < 1 and
            m.last_accessed > datetime.now() - timedelta(days=90)
        )
    )

    # 2. 归档不活跃的记忆
    memory.archive(
        condition=lambda m: m.last_accessed > datetime.now() - timedelta(days=30)
    )

    # 3. 压缩相似的记忆
    memory.compress_similar(threshold=0.9)
```

---

## 五、记忆系统设计模式

### 5.1 累积式记忆

**模式**：所有信息都保留

```
优点：
✓ 不丢失信息
✓ 可以追溯历史

缺点：
✗ 存储成本高
✗ 检索变慢
✗ 噪音信息多
```

**适用**：短期、小规模

---

### 5.2 滑动窗口记忆

**模式**：只保留最近的 N 条记忆

```python
class SlidingWindowMemory:
    def __init__(self, window_size=100):
        self.window_size = window_size
        self.memories = []

    def add(self, memory):
        self.memories.append(memory)
        # 超出窗口大小，删除最旧的
        if len(self.memories) > self.window_size:
            self.memories.pop(0)
```

**优点**：
- ✓ 存储可控
- ✓ 检索快速

**缺点**：
- ✗ 丢失历史信息
- ✗ 可能遗忘重要内容

**适用**：对话系统、短期任务

---

### 5.3 总结式记忆

**模式**：定期总结并压缩记忆

```
原始记忆：
"用户说喜欢Python"
"用户说正在学习机器学习"
"用户说在做一个分类项目"
"用户问如何处理缺失值"
"用户说数据有1000行"
...

↓ 总结 ↓

压缩记忆：
"用户正在用Python做机器学习分类项目，
数据量1000行，遇到了缺失值处理问题"
```

**实现**：
```python
class SummarizingMemory:
    def __init__(self, summary_interval=10):
        self.memories = []
        self.summary_interval = summary_interval

    def add(self, memory):
        self.memories.append(memory)

        # 达到阈值，触发总结
        if len(self.memories) >= self.summary_interval:
            self.summarize()

    def summarize(self):
        """总结最近的记忆"""
        # 使用 LLM 总结
        summary = llm.summarize(self.memories)

        # 保留总结，删除原始记忆
        self.memories = [summary]
```

**优点**：
- ✓ 节省存储
- ✓ 保留关键信息
- ✓ 降低检索噪音

**缺点**：
- ✗ 丢失细节
- ✗ 可能遗漏重要信息

**适用**：长期对话、知识积累

---

### 5.4 分层记忆

**模式**：不同重要性的信息存储不同层次

```
层次 1：工作记忆（当前对话）
    ↓ 完成任务后

层次 2：短期记忆（最近几天）
    ↓ 定期总结

层次 3：长期记忆（重要知识）
    ↓ 永久保存
```

**实现**：
```python
class TieredMemory:
    def __init__(self):
        self.working = WorkingMemory(max_items=50)
        self.short_term = VectorMemory(ttl=7)  # 7天过期
        self.long_term = VectorMemory(ttl=None)  # 永久

    def add(self, memory, importance):
        if importance == "critical":
            # 直接进入长期记忆
            self.long_term.add(memory)

        elif importance == "high":
            # 进入短期记忆，定期评估是否升级
            self.short_term.add(memory)

        else:
            # 仅在工作记忆
            self.working.add(memory)

    def promote(self, memory_id):
        """将记忆从短期提升到长期"""
        memory = self.short_term.get(memory_id)
        if memory:
            self.long_term.add(memory)
            self.short_term.delete(memory_id)
```

---

## 六、最佳实践

### 6.1 记忆设计原则

```
1. 明确性
   • 清晰的元数据
   • 结构化的存储

2. 可检索性
   • 好的索引
   • 语义搜索

3. 可扩展性
   • 支持增长
   • 分层存储

4. 隐私保护
   • 敏感数据加密
   • 访问控制

5. 成本控制
   • 定期清理
   • 压缩存储
```

### 6.2 元数据设计

**好的元数据**：
```python
{
    "content": "用户喜欢Python和机器学习",
    "metadata": {
        "timestamp": "2025-01-15T10:30:00Z",
        "type": "preference",
        "user_id": "user123",
        "source": "chat",
        "importance": 8,
        "tags": ["programming", "ml", "preference"],
        "emotion": "neutral",
        "verified": True
    }
}
```

### 6.3 记忆查询优化

```python
# ❌ 不好：检索所有记忆
all_memories = memory.get_all()

# ✓ 好：精确查询
relevant_memories = memory.search(
    query="用户偏好",
    filters={
        "type": "preference",
        "user_id": "user123",
        "time_range": "last_30_days"
    },
    limit=10
)
```

### 6.4 记忆安全

```python
class SecureMemory:
    def __init__(self):
        self.memory = VectorMemory()
        self.sensitive_fields = ["password", "token", "secret"]

    def add(self, content, metadata):
        # 检测敏感信息
        if self.contains_sensitive_info(content):
            # 加密或脱敏
            content = self.sanitize(content)
            metadata["sensitive"] = True

        self.memory.add(content, metadata)

    def get(self, memory_id, user_id):
        memory = self.memory.get(memory_id)

        # 检查权限
        if memory.metadata.get("user_id") != user_id:
            raise PermissionError("无权访问此记忆")

        # 解密（如果是敏感信息）
        if memory.metadata.get("sensitive"):
            memory.content = self.decrypt(memory.content)

        return memory
```

---

## 本章小结

### 核心要点

1. **三种记忆类型**：
   - 感觉寄存器：瞬时保存
   - 工作记忆：当前任务
   - 长期记忆：持久化知识

2. **实现技术**：
   - 简单场景：对话上下文
   - 语义检索：向量数据库
   - 精确查询：键值存储
   - 生产环境：混合方案

3. **管理策略**：
   - 分层存储
   - 重要性评分
   - 定期清理
   - 智能检索

4. **设计模式**：
   - 累积式
   - 滑动窗口
   - 总结式
   - 分层记忆

5. **最佳实践**：
   - 明确的元数据
   - 优化查询
   - 安全保护
   - 成本控制

### 记忆系统架构图

```
┌──────────────────────────────────────┐
│          Agent 记忆系统               │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐   │
│  │   工作记忆 (当前对话)         │   │
│  │   • 最近消息                 │   │
│  │   • 任务状态                 │   │
│  │   • 快速访问                 │   │
│  └──────┬───────────────────────┘   │
│         │                           │
│         ↓ 存储                      │
│  ┌──────────────────────────────┐   │
│  │   短期记忆 (向量数据库)       │   │
│  │   • 近期对话                 │   │
│  │   • 语义检索                 │   │
│  │   • TTL: 7-30 天             │   │
│  └──────┬───────────────────────┘   │
│         │                           │
│         ↓ 总结/提升                 │
│  ┌──────────────────────────────┐   │
│  │   长期记忆 (向量数据库)       │   │
│  │   • 重要知识                 │   │
│  │   • 用户偏好                 │   │
│  │   • 永久保存                 │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

---

## 思考题

1. **基础题**：对比工作记忆和长期记忆，列出 3 个主要区别。

2. **进阶题**：在什么情况下应该使用"总结式记忆"而不是"累积式记忆"？请举例说明。

3. **挑战题**：设计一个记忆系统，能够自动识别并记住用户的"隐含偏好"（不是用户直接说出的，而是从对话中推断出来的）。

---

## 实践探索

**实验活动**：
使用 ChromaDB 实现一个简单的记忆系统：
```python
import chromadb

# 初始化
client = chromadb.Client()
memory = client.create_collection("my_memory")

# 添加记忆
memory.add(
    documents=["我喜欢Python编程"],
    metadatas={"type": "preference"},
    ids=["mem1"]
)

# 检索记忆
results = memory.query(
    query_texts=["编程语言"],
    n_results=1
)
```

**设计练习**：
为以下 Agent 设计记忆系统：
1. 客服 Agent：需要记住客户历史问题和解决方案
2. 个人助理：需要记住日程、偏好、待办事项
3. 学习助手：需要记住学习进度、薄弱环节

---

## 扩展阅读

**向量数据库**：
- [Chroma 文档](https://docs.trychroma.com/) - 轻量级向量数据库
- [Pinecone 文档](https://docs.pinecone.io/) - 托管向量数据库

**经典论文**：
- "Recurrent Neural Networks for Computation" - 记忆机制的理论基础

**实现框架**：
- [LangChain Memory](https://python.langchain.com/docs/modules/memory/) - LangChain 的记忆模块
- [MemGPT](https://memgpt.ai/) - 专门的长记忆 Agent 框架

---

**下一章**：我们将学习 Agent 如何使用工具。

[← 返回模块首页](/ai-basics/04-agent-fundamentals) | [继续学习：工具使用 →](/ai-basics/04-agent-fundamentals/04-tool-use)
