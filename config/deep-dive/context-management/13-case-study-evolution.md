# 实战案例：上下文建设从零到一的演进

> 一个虚构但真实感极强的项目——"拉了么"外卖平台，从单枪匹马到 50 人团队，看上下文管理方案如何随项目规模一起成长。

---

## 案例背景

### 项目简介

"拉了么（Lamo）"是一个外卖订餐平台，支持用户端、商家端、配送员端三个子系统。我们从个人项目阶段开始，完整经历了团队成长的全过程。

### 演进路线图

```
Phase 1（1人，第 1 个月）
  README + Claude Projects
  → 目标是"先跑起来"

Phase 2（2-5人，第 2-6 个月）
  VitePress Wiki + 代码注释规范
  → 目标是"团队协作不迷路"

Phase 3（5-15人，第 6-12 个月）
  Wiki + RAG 系统 + Agent 提示词模板
  → 目标是"AI 理解整个项目"

Phase 4（15-50人，第 12+ 个月）
  RAG + Agent 记忆系统 + 知识图谱
  → 目标是"自动化上下文管理"
```

这不是纸上谈兵——每一步都来自真实项目的常见问题。

---

## Phase 1：个人项目（1人）

### 状态

一个人写代码，技术栈还在摸索中，代码库不到 1 万行。

### 上下文方案

**README.md**

```markdown
# 拉了么（Lamo）

一个外卖订餐平台。

## 技术栈（初版）
- 前端：React
- 后端：Node.js
- 数据库：PostgreSQL

## 快速开始
pnpm install
pnpm dev

## 项目结构
src/
├── client/       # 用户端
├── admin/        # 管理后台
└── shared/       # 共享代码
```

**Claude Projects 配置**

在与 Claude Code 对话时，使用 Projects 功能保存一个项目配置。每次开始新会话时自动加载，不需要重复解释技术栈。

### 实际效果

```
和 AI 对话时：
你：帮我写一个用户注册接口
AI：了解。项目使用 React + Node.js + PostgreSQL。
    我来生成对应的代码。

（因为有 Projects 配置，AI 已经知道技术栈）
```

### 踩过的坑

```
1. README 写成了技术笔记
   ❌ 写了一大段"为什么选择 React"（AI 不需要知道这个）
   ✅ 只写"用什么"不写"为什么用"

2. Projects 配置更新不及时
   ❌ 切换到 Zustand 后忘记更新 Projects
   ✅ 养成了"技术栈变更立刻更新 Projects"的习惯

3. 对话历史太长忽略早期约定
   ❌ 第 30 轮对话后，AI 忘了用 TypeScript
   ✅ 定期在对话中重申关键约束
```

### 成本

```
时间投入：1 小时（写 README）+ 15 分钟（配置 Projects）
金钱成本：$0
维护成本：基本为零
```

---

## Phase 2：小团队（2-5人）

### 状态

加入了 2 个后端和 1 个前端。代码增长到 5 万行，开始出现多个模块。新成员入职时需要了解项目全貌。

### 核心痛点

```
"那个订单状态在哪个文件里定义的？"
"数据库迁移文件在哪？"
"这个接口的请求格式是什么？"
```

### 上下文方案：VitePress Wiki

**目录结构**

```
docs/
├── index.md              # Wiki 首页
├── overview/
│   ├── intro.md          # 项目介绍
│   ├── tech-stack.md     # 技术栈（从 README 迁移过来）
│   └── architecture.md   # 架构设计
├── development/
│   ├── setup.md          # 环境搭建
│   ├── structure.md      # 目录结构说明
│   └── coding-standards.md
├── business/
│   ├── order-flow.md     # 订单流程
│   └── data-model.md     # 数据模型
└── api/
    ├── users.md
    ├── orders.md
    └── payments.md
```

**关键配置：AI 自动读取 Wiki**

在 CLAUDE.md 中告诉 AI 文档在哪：

```markdown
# CLAUDE.md

## 项目文档
Wiki 文档位于 docs/ 目录：
- 架构设计：docs/overview/architecture.md
- 开发指南：docs/development/
- 业务规则：docs/business/data-model.md
- API 文档：docs/api/

在回答问题前，先查看相关文档。
```

### 实际效果

```
你：帮我查一下订单状态有哪些

AI：根据 wiki 文档：
订单状态包括：pending → paid → preparing → delivering → completed
                                            ↓
                                         cancelled

来自：docs/business/order-flow.md
```

团队协作时，新成员也能直接问 AI 关于项目的问题，不需要打断老成员。

### 第一行代码即文档

团队统一了代码注释规范：

```typescript
/**
 * 计算订单配送费
 *
 * 规则：
 * - 基础费 5 元（3 公里内）
 * - 超出部分每公里 2 元
 * - 恶劣天气附加费 50%
 *
 * @param distance - 配送距离（公里）
 * @param isBadWeather - 是否恶劣天气
 * @returns 配送费（分）
 */
function calculateDeliveryFee(distance: number, isBadWeather: boolean): number
```

这样 AI 在读取代码时能直接理解业务逻辑。

### 踩过的坑

```
1. Wiki 内容过时
   代码改了一周后，Wiki 还是旧版本。
   解决方案：在 PR 模板中加入文档检查项。

2. Wiki 内容太多
   每个人都在往 Wiki 里加内容，首页越来越长。
   解决方案：按模块分类，首页只放目录。

3. AI 读文档太慢
   每次对话 AI 都要重新扫描 docs/ 目录。
   解决方案：用 CLAUDE.md 中的文档索引缩小搜索范围。
```

### 成本

```
时间投入：8 小时搭建 Wiki + 持续的文档维护
金钱成本：$0（VitePress + GitHub Pages）
学习曲线：团队成员需要 1-2 天适应文档协作
```

---

## Phase 3：中型团队（5-15人）

### 状态

前后端各 5-6 人，还有产品经理和设计师。代码增长到 20 万行，Wiki 文档超过 50 页。频繁需要 AI 帮忙理解代码。

### 核心痛点

```
"这个功能在 10 个文件里都有相关代码，AI 看完这 10 个文件上下文就满了"
"新来的实习生问的问题太多了，能不能让 AI 做内部问答？"
"我们的 API 有 200 个端点，文档跟不上迭代速度"
```

### 上下文方案：Wiki + RAG 系统

**RAG 系统架构**

```
项目文档 (Markdown)   +   代码 (TypeScript)
       │                         │
       3. 定期重新索引           │
       ▼                         │
┌──────────────────────┐          │
│  文档切片 + 向量化    │◄────────┘
│  (ChromaDB +         │
│   text-embedding-3)  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   语义检索 API        │
│   /api/search         │
│   /api/ask            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   VS Code 插件        │
│   / 浏览器搜索界面     │
└──────────────────────┘
```

**实际配置**

```python
# 文档切片配置
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150,
    separators=["\n\n", "\n", "。", "！", "？", " ", ""]
)

# 检索配置
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "k": 5,
        "score_threshold": 0.5
    }
)
```

**自动生成 API 清单**

使用第 4 章的方法，从 NestJS Controller 自动提取 API 端点：

```bash
# 每周自动运行
npm run context:generate-api-docs
```

输出 `docs/api-list.md`，保持 API 文档和代码同步。

### 提示词模板库

为常见场景准备 AI 提示词模板：

```markdown
## 新功能开发模板（context-card）

## 技术约束
- 框架：
- ORM：
- 测试框架：

## 业务规则
- 规则 1：
- 规则 2：

## 相关代码
- 参考文件：
- 类似实现：

## 输出要求
- 代码风格：
- 测试覆盖率：
```

### 实际效果

```
你：帮我写一个商家订单统计 API

AI 自动：
1. 检索到项目中已有 5 个类似统计 API
2. 找到数据模型中的 Order 和 Payment 实体
3. 了解项目的 API 返回格式规范
4. 生成符合项目风格的代码

减少了解释上下文的时间，从 5 分钟降到 0。
```

### 踩过的坑

```
1. RAG 检索不相关的内容
   chunk_size 过小，语义被切碎。
   调整到 800 tokens + 150 overlap 后改善。

2. 文档更新后 RAG 索引滞后
   修复：在 CI 中加入文档变更时自动重新索引。

3. 代码库太大，全部向量化成本高
   修复：只索引核心模块的代码摘要，完整代码按需读取。
```

### 成本

```
向量数据库：ChromaDB（$0，自建）
嵌入 API：OpenAI text-embedding-3-small，约 $30/月
RAG API 服务器：约 $20/月
维护工作：每周 1-2 小时
```

---

## Phase 4：大型团队（15-50人）

### 状态

多个产品线并行开发。团队包括前端、后端、数据、运维、产品等不同职能。代码 50 万行+，Wiki 超过 200 页。

### 核心痛点

```
"不同团队需要看不同的文档，不能一锅粥"
"很多时候问题是一样的，但每个人都在问 AI 同样的问题"
"能不能让 AI 记住之前解决过的问题，避免重复排查？"
"新功能开发时，AI 能不能参考之前的实现模式？"
```

### 上下文方案：RAG + Agent 记忆系统 + 知识图谱

**完整架构**

```
┌──────────────────────────────────────────┐
│             用户交互层                     │
│   VS Code  ←→  Web Portal  ←→  CLI     │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│          API 网关（权限 + 路由）           │
└────────┬────────────────────┬────────────┘
         │                    │
┌────────▼────────┐  ┌────────▼────────┐
│  智能检索引擎    │  │  Agent 编排器    │
│  - 向量检索      │  │  - 任务分解      │
│  - 全文搜索      │  │  - Agent 调度    │
│  - 知识图谱      │  │  - 结果汇总      │
└────────┬────────┘  └────────┬────────┘
         │                    │
         └────────┬───────────┘
                  │
┌─────────────────▼────────────────────────┐
│              记忆系统                      │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ 情景记忆  │  │ 语义记忆  │  │程序记忆│ │
│  │ (向量DB) │  │ (知识图谱)│  │(规则库)│ │
│  └──────────┘  └──────────┘  └────────┘ │
└──────────────────────────────────────────┘
```

### 权限隔离

不同团队只能访问相关文档：

```python
# 权限配置
DOCUMENT_PERMISSIONS = {
    "frontend_team": ["docs/frontend/", "docs/api/client/"],
    "backend_team": ["docs/backend/", "docs/api/server/", "docs/database/"],
    "devops_team": ["docs/deployment/", "docs/monitoring/"],
    "product_team": ["docs/product/", "docs/requirements/"],
}

# 检索时自动添加权限过滤
def search_with_permission(query, user_team):
    docs = vector_store.search(query, k=10)
    allowed_paths = DOCUMENT_PERMISSIONS[user_team]
    return [doc for doc in docs
            if any(doc.path.startswith(p) for p in allowed_paths)]
```

### Agent 记忆集成

引入 Mem0 实现 Agent 跨会话记忆：

```python
from mem0 import MemoryManager

# 配置 Agent 记忆
memory = MemoryManager(
    user_id="backend_team",
    storage="qdrant://localhost:6333",
    enable_graph=True,  # 开启图谱记忆
)

# 每次任务开始时加载相关记忆
def on_task_start(task_description, user):
    # 检索相关记忆
    relevant_memories = memory.search(task_description)

    # 注入到 Agent 上下文
    agent_context = {
        "current_task": task_description,
        "past_experiences": relevant_memories,
        # ...
    }

    return agent_context
```

### 知识图谱集成

将实体关系建成知识图谱：

```
节点：
User, Order, Payment, Product, Restaurant, Delivery

关系：
User ──[下单]──→ Order
Order ──[包含]──→ Product
Order ──[支付]──→ Payment
Order ──[配送]──→ Delivery
Product ──[属于]──→ Restaurant
```

Agent 可以基于图谱做多跳推理：

```
你：用户投诉说订单状态不对

Agent 的推理路径：
Order → 关联的 Payment 状态 → 关联的 Delivery 状态
→ 发现：支付成功但配送员未接单
→ 建议：触发配送重新分配
```

### 实际效果

```
指标对比：

                      Phase 1    Phase 2    Phase 3    Phase 4
新人上手时间：          3 天       1 天       4 小时     2 小时
AI 代码采纳率：         40%        60%        75%        85%
重复问题率：            -          30%        15%        5%
文档维护时间/周：       <30分钟    2 小时     1 小时     <30分钟（自动）
```

### 成本

```
向量数据库：Qdrant 自建，约 $50/月
嵌入 API：约 $100/月
记忆系统：Mem0 开源版，$0
知识图谱：Neo4j 自建，约 $30/月
运维：每周 2-3 小时
总计月成本：约 $200-300
```

---

## 演进经验总结

### 不要在一开始就追求完美方案

```
Phase 1 就用 RAG？
→ 个人项目没必要，README 就够了

Phase 2 就用知识图谱？
→ 知识不够多，图谱是空壳

Phase 3 才做 RAG？
→ 文档 50 页前，直接引用更快
```

### 升级信号

| 阶段升级 | 触发条件 |
|---------|---------|
| Phase 1 → 2 | README 超过 300 行 / 有第 2 个开发者 |
| Phase 2 → 3 | 文档超过 50 页 / AI 频繁需要多文件上下文 |
| Phase 3 → 4 | 超过 15 人 / 开始需要权限隔离 / 出现重复问题 |

### 关键启示

1. **上下文方案的规模适配比技术选型更重要**——大炮打蚊子不是本事
2. **每个阶段都有价值**——README 阶段不是"低级"，是最适合当时场景的方案
3. **迁移成本要提前考虑**——一开始用 Markdown 格式存储内容，后面迁移到哪个系统都方便
4. **AI 是第一用户**——从第一天起，文档就是写给 AI 看的，不只是人看的

---

[← 返回文章目录](../context-management/) | [继续学习：上下文工程工具链全景 →](./14-toolchain-overview/)
