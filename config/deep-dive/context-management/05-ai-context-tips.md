# 让 AI 使用上下文的技巧

> 如何让 AI 有效地读取和使用项目上下文

---

## 三种基本方法

AI 使用上下文的方式主要有三种，每种都有自己的适用场景。

```
┌─────────────────────────────────────────────────────────┐
│                   AI 使用上下文的方法                     │
├─────────────┬──────────────┬──────────────┬─────────────┤
│    方法     │   难度       │   效果       │   推荐度     │
├─────────────┼──────────────┼──────────────┼─────────────┤
│ 直接引用    │     ⭐       │    ⭐⭐       │    ⭐⭐⭐    │
│ 总结传递    │    ⭐⭐       │   ⭐⭐⭐       │   ⭐⭐⭐⭐   │
│ 自动检索    │   ⭐⭐⭐       │  ⭐⭐⭐⭐⭐     │  ⭐⭐⭐⭐⭐  │
└─────────────┴──────────────┴──────────────┴─────────────┘
```

---

## 方法 1：直接引用

明确告诉 AI 参考哪些文档，让 AI 自己读取。

这种方式适合在使用 Claude Code 这类支持文件读取的工具时，或者你的项目已经有结构化的文档存放在本地。

**第一步：确保文档存在**

```bash
wiki/
├── tech-stack.md
├── coding-standards.md
└── api/
    └── users.md
```

**第二步：在对话中引用**

```
你：帮我写一个用户登录功能

参考文档：
- wiki/tech-stack.md（技术栈）
- wiki/coding-standards.md（编码规范）
- wiki/api/users.md（用户 API 示例）
```

**第三步：AI 自动读取**

```
AI：我读取了你的文档：

从 tech-stack.md 得知：
- 使用 Nest.js + TypeORM
- 数据库：PostgreSQL
- 认证：JWT

从 coding-standards.md 得知：
- 函数名用 camelCase
- 必须有 JSDoc 注释
- 错误要抛出自定义异常

现在我来实现用户登录功能...
```

### 实践建议

**引用具体章节**

"参考项目文档"这种说法太模糊。更好的方式是明确指出位置：

```
✓ "参考 wiki/tech-stack.md 的后端部分
   参考 wiki/coding-standards.md 的错误处理章节"
```

**按重要性排序**

```
参考（按重要性）：
1. wiki/development/coding-standards.md
2. wiki/modules/user-module.md
3. wiki/overview/tech-stack.md
```

**说明关注点**

```
你：帮我写用户登录功能

参考：
- wiki/tech-stack.md（关注认证方案）
- wiki/coding-standards.md（关注错误处理）
- src/modules/user/auth.service.ts（参考现有实现）
```

### 优缺点

**优势**：简单直接，AI 总是读取最新内容，不占用对话 token

**劣势**：需要手动引用，依赖文件系统访问，AI 可能读错文件

---

## 方法 2：总结传递

把关键信息提取出来，直接告诉 AI，不需要 AI 自己去读文档。

这种方法在 AI 工具不支持文件读取，或者上下文信息不多时很实用。

### 操作步骤

**提取关键信息**

```markdown
技术栈：
- 后端：Nest.js + TypeORM + PostgreSQL
- 前端：React + TypeScript + Tailwind

编码规范：
- 命名：camelCase
- 必须有 JSDoc
- 错误用 CustomError

业务规则：
- 用户手机号唯一
- 密码至少 8 位
```

**组织成结构化信息**

```
你：帮我写一个用户登录功能

项目信息：

## 技术栈
- 框架：Nest.js
- ORM：TypeORM
- 数据库：PostgreSQL
- 认证：JWT

## 编码规范
- 函数名：camelCase
- 必须有 JSDoc 注释
- 错误处理：抛出 CustomError

## 业务规则
- 手机号必须唯一
- 密码至少 8 位，包含字母和数字
- 登录失败 5 次锁定账号

## 参考代码
现有实现：src/modules/user/auth.service.ts
```

### 实践建议

**使用模板**

保存一个项目信息模板，每次使用时填写：

```markdown
## 项目信息模板

### 技术栈
- 前端框架：
- 后端框架：
- 数据库：
- 其他：

### 编码规范
- 命名规范：
- 注释要求：
- 错误处理：

### 业务规则
- 规则 1：
- 规则 2：

### 参考代码
- 相关文件：
- 类似实现：
```

**控制长度**

复制整个 Wiki（5000+ tokens）会适得其反。只提取关键信息，控制在 500-1000 token，详细内容让 AI 需要时再问。

**用代码块配置**

```
你：帮我写用户登录

配置：
```typescript
// 技术栈配置
export const CONFIG = {
  framework: 'Nest.js',
  orm: 'TypeORM',
  database: 'PostgreSQL',
  auth: 'JWT'
}

// 编码规范
export const STANDARDS = {
  naming: 'camelCase',
  comments: 'JSDoc',
  errors: 'CustomError'
}
```

这样更清晰，AI 更容易理解。
```

### 优缺点

**优势**：不需要文件访问，信息明确不会误解，适合任何 AI 工具

**劣势**：手动总结费时，可能遗漏细节，占用对话 token

---

## 方法 3：自动检索（RAG）

搭建 RAG 系统，让 AI 自动从文档库中检索相关信息。

当文档量很大，或者频繁需要 AI 帮忙时，这个一次性投入是值得的。

### 工作原理

```
┌─────────────────────────────────────────────────┐
│                   用户提问                        │
│       "如何实现订单取消功能？"                    │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              RAG 系统                            │
│                                                 │
│  1. 理解问题意图 → "订单"、"取消"               │
│  2. 向量化查询 → Embedding                      │
│  3. 检索相关文档 → 找到 3-5 个最相关的文档        │
│  4. 排序和过滤 → 去重、评分                      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│            检索到的文档                          │
│                                                 │
│  - business/rules.md（订单规则章节）            │
│  - api/orders.md（取消订单 API）                │
│  - modules/order-service.md（订单服务）         │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│               LLM 生成答案                       │
│                                                 │
│  基于检索到的文档，生成符合项目的答案              │
└─────────────────────────────────────────────────┘
```

### 技术实现

> 以下代码示例基于 2025-2026 年的最新框架 API

**方案 1：使用 LangChain 0.3+**

```python
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. 准备文档并切分
documents = [
    Document(page_content="...", metadata={"source": "tech-stack.md"}),
    # ... 更多文档
]

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)

splits = text_splitter.split_documents(documents)

# 2. 创建向量存储（ChromaDB）
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
    persist_directory="./chroma_db",
)

retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"k": 3, "score_threshold": 0.5},
)

# 3. 创建 RAG 链
llm = ChatOpenAI(model="gpt-4o", temperature=0)

prompt = ChatPromptTemplate.from_template("""
根据以下文档回答问题。如果你不知道答案，就说不知道，不要编造。

上下文：
{context}

问题：{input}

答案：
""")

# 创建组合链
retrieve_chain = create_retrieval_chain(
    retriever,
    create_stuff_documents_chain(llm, prompt)
)

# 4. 查询
response = retrieve_chain.invoke({"input": "如何实现订单取消功能？"})
print(response["answer"])
```

**方案 2：使用 LlamaIndex**

> 数据来源：[Real Python - LlamaIndex RAG Guide](https://realpython.com/llamaindex-examples/) (2025-12-24)

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

# 配置模型（推荐使用最新版本）
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")
Settings.llm = OpenAI(model="gpt-4o", temperature=0)

# 1. 加载文档
documents = SimpleDirectoryReader('./wiki').load_data()

# 2. 创建索引（自动分块和向量化）
index = VectorStoreIndex.from_documents(documents)

# 3. 创建查询引擎（支持多种检索模式）
query_engine = index.as_query_engine(
    similarity_top_k=5,
    vector_store_query_mode="default",
    alpha=0.7,  # 混合检索权重（0=纯向量，1=纯关键词）
)

# 4. 查询
response = query_engine.query("如何实现订单取消功能？")
print(response)

# 5. 高级：创建聊天引擎（支持多轮对话）
chat_engine = index.as_chat_engine(
    chat_mode="condense_question",
    verbose=True,
)

response = chat_engine.chat("用户登录失败怎么办？")
```

### 实践建议

**文档切片**

整篇文档太长会影响检索精准度。按章节或主题切片效果更好：

```
切片前：
- tech-stack.md（一篇长文）

切片后：
- tech-stack/frontend.md
- tech-stack/backend.md
- tech-stack/database.md
```

**添加元数据**

```python
# 给文档添加元数据
documents = [
    Document(
        page_content="...",
        metadata={
            "category": "api",
            "module": "user",
            "version": "v1"
        }
    )
]

# 检索时过滤
results = vectorstore.similarity_search(
    "用户登录",
    filter={"category": "api", "module": "user"}
)
```

**选择向量数据库**

> 数据来源：[Vector Database Benchmark 2026](https://www.salttechnoai.ai/datasets/vector-database-performance-benchmark-2026/) (2026-02-15)

根据 2026 年性能测试（1M 向量，1536 维）：

| 数据库 | p50 延迟 | p99 延迟 | 部署方式 | 适合场景 |
|--------|----------|----------|----------|----------|
| **Qdrant** | 4ms | 25ms | 开源/托管 | 高性能需求、复杂过滤 |
| **Pinecone** | 8ms | 45ms | 托管 | 零运维、快速原型 |
| **ChromaDB** | 12ms | 70ms | 开源 | 本地开发、小规模 |
| **pgvector** | 18ms | 90ms | 开源扩展 | 已有 PostgreSQL |

个人项目用 ChromaDB 或 Pinecone 就够了，大型项目再考虑 Qdrant 或 Milvus。

### 优缺点

**优势**：完全自动化，可以处理大量文档，检索精准（如果配置得当）

**劣势**：搭建复杂，需要额外成本，需要维护

---

## 方法选择指南

### 决策流程

```
你的情况
    │
    ├─ AI 工具支持文件读取？
    │   ├─ 是 → 直接引用（推荐）
    │   └─ 否 → 继续
    │
    ├─ 文档量 < 10 篇？
    │   ├─ 是 → 总结传递
    │   └─ 否 → 继续
    │
    ├─ 经常需要 AI 帮忙？
    │   ├─ 是 → 考虑 RAG
    │   └─ 否 → 总结传递
    │
    └─ 有技术能力搭建系统？
        ├─ 是 → RAG
        └─ 否 → 总结传递
```

### 推荐方案

**个人项目**：总结传递（简单快捷）

**小团队项目**：直接引用 + Projects 功能（如 Claude Projects、ChatGPT Projects）

**大型项目**：Wiki + RAG 系统

---

## 实战技巧

### 技巧 1：上下文卡片

创建"上下文卡片"保存关键信息，使用时直接粘贴：

```markdown
---
Context Card: User Module
---

## 技术信息
- 框架：Nest.js
- ORM：TypeORM
- 数据库：PostgreSQL

## 编码规范
- 命名：camelCase
- 必须有 JSDoc
- 错误：CustomError

## 业务规则
- 手机号唯一
- 密码 >= 8 位
- 失败 5 次锁定

## 相关代码
- src/modules/user/
- wiki/api/users.md
```

### 技巧 2：渐进式提供

第一次可以给基础信息，如果 AI 理解不够再补充。找到"最小有效集"后记录下来，以后都用这个级别。

```
第 1 次："用 Nest.js 写用户注册"
   ↓ AI 不够理解
第 2 次："用 Nest.js + TypeORM，手机号唯一，密码加密"
   ↓ AI 理解了
记录：以后都用这个级别的信息
```

### 技巧 3：让 AI 询问

```
你：写用户注册功能

AI：我需要了解：
1. 用什么框架？
2. 有什么业务规则？
3. 需要哪些字段？

你：
1. Nest.js
2. 手机号唯一，密码加密
3. 手机号、密码、验证码
```

让 AI 主动收集信息可以避免提供过多或过少，确保理解正确。

### 技巧 4：使用 Projects 功能

**Claude Projects**

```
1. 创建项目：拉了么
2. 上传文档：wiki/overview/tech-stack.md 等
3. 设置项目指令："这是一个外卖订餐系统，
   使用 Nest.js + PostgreSQL。回答问题时参考上传的文档。"
4. 开始对话
```

**ChatGPT Projects**

流程类似，创建项目 → 添加知识文件 → 设置自定义指令 → 开始对话

### 技巧 8：CLAUDE.md 最佳实践（以本项目为例）

CLAUDE.md 是项目根目录下的一个 Markdown 文件，AI 编程工具（Claude Code、Cursor 等）启动时自动读取。它是"把上下文放在 AI 嘴边"最直接的方式。

#### 为什么 CLAUDE.md 有效

```
没有 CLAUDE.md：
你：帮我写一个用户注册功能
AI：好的（不知道你的技术栈、目录结构、编码规范）
→ 你需要手动告诉 AI 所有背景信息

有 CLAUDE.md：
你：帮我写一个用户注册功能
AI：我注意到项目使用 Nest.js + TypeScript，遵循模块化结构...
（AI 已经通过 CLAUDE.md 了解了项目）
→ 你只需要描述具体需求
```

本质上，CLAUDE.md 是每个 AI 对话的"系统预设"——不管你怎么问，这些信息都在上下文里。

#### 写什么、不写什么

**应该写的**（以本项目的 CLAUDE.md 为例）：

```markdown
# CLAUDE.md

## 项目概述
一句话清晰描述项目。

## 开发命令
开发者最常用的命令。当被问到开发相关问题时，AI 直接知道怎么运行。
- 启动：pnpm run docs:dev
- 构建：pnpm run docs:build
- 预览：pnpm run docs:preview

## 项目架构
核心目录结构（只写关键路径，不列 node_modules）。
只写对 AI 理解项目有用的结构信息。

## 添加新内容
新增文件的步骤说明。
```

**不应该写的**：

```
❌ AI 已经知道的：
- React、Vue、Python 的基础用法
- 通用编程概念和最佳实践

❌ 很快就会变的：
- 当前迭代的具体 task 列表
- 临时的约定和规则

❌ 太长太细的：
- 完整的 API 文档（应该放在 Wiki 里，需要时引用）
- 整个技术栈的历史版本记录
```

#### 结构化的威力

对比两种写法的效果：

```
❌ 平铺式（AI 需要自己找重点）：
"我们项目是一个基于 VitePress 的文档网站，
使用 pnpm 作为包管理器，
构建命令是 pnpm run docs:build..."

✅ 结构化（AI 一眼看到关键信息）：
## 开发命令
- 启动：pnpm run docs:dev
- 构建：pnpm run docs:build

## 项目架构
config/ 目录是文档根目录
```

同样的信息量，结构化写法让 AI 的"信息提取成本"低得多。

#### 维护策略

CLAUDE.md 最大的敌人是**过时**。几个经验：

```
1. 随项目一起更新
   改了构建命令？同时更新 CLAUDE.md 的开发命令部分。
   最佳实践：在 PR 模板中加一项 "更新了 CLAUDE.md？"

2. 只写稳定的信息
   技术栈、架构、开发命令——这些变了才改。
   不要写当前 sprint 的任务——那是动态上下文。

3. 定期审查
   每季度检查一次：CLAUDE.md 里的信息还准吗？
   超过 6 个月没改：要么项目特别稳定，要么文档被人遗忘了。
```

#### 与 Projects 配合

CLAUDE.md 负责项目级别的"全局上下文"，Projects 负责会话级别的"任务上下文"：

```
CLAUDE.md（项目级别，持续有效）：
- 技术栈
- 目录结构
- 开发命令
- 项目架构

Projects（会话级别，按需加载）：
- 当前迭代的目标
- 待解决的问题
- 近期变更
- 临时约定
```

两者互补，不是替代。

#### 配置优化：提示缓存

如果你使用 Anthropic API 直接调用，CLAUDE.md 的内容是缓存的理想对象：

```python
messages = [
    {
        "role": "system",
        "content": [
            {
                "type": "text",
                "text": CLAUDE_MD_CONTENT,
                "cache_control": {"type": "ephemeral"}
            }
        ]
    },
    {"role": "user", "content": user_input}
]
```

CLAUDE.md 的内容每次对话都一样，天然适合放入缓存前缀。配合 cache-aware rate limits，这部分内容不占用 ITPM 限制。

> MCP 是 2025 年由 Anthropic 推出的开放协议，定义了 AI 应用程序如何连接外部数据源和工具。2026 年已成为 AI 工具集成的标准协议。

#### 从"复制粘贴"到"协议集成"

在 MCP 出现之前，让 AI 获取外部数据只有两条路：
- **手动复制粘贴**：把数据粘贴到对话里——麻烦、过时、容易出错
- **硬编码集成**：为每个工具写专属插件——开发量大、维护困难

MCP 的解决思路很简单：**给 AI 一个统一的标准"插座"**。任何实现了 MCP 标准的数据源或工具，AI 都可以自动连接和使用。

```
MCP 出现前：
每个 AI 工具需要为每个数据源写独立集成
    AI 工具 A ──→ 自定义插件 ──→ GitHub
    AI 工具 A ──→ 自定义插件 ──→ 数据库
    AI 工具 A ──→ 自定义插件 ──→ 文件系统
    AI 工具 B ──→ 重新实现一次

MCP 出现后：
    AI 工具 A ──→ MCP 客户端 ←── MCP 服务器 ←── GitHub
                                     ←── 数据库
                                     ←── 文件系统
    AI 工具 B ──→ MCP 客户端 ←── (复用相同的服务器)
```

#### 核心架构

MCP 采用标准的客户端-服务器架构：

```
┌────────────────────┐     ┌────────────────────┐
│       AI 主机       │     │    MCP 客户端       │
│  (Claude Code,     │────→│   (内置于 AI 工具)   │
│   Cursor, 等)      │     │                     │
└────────────────────┘     └────────┬───────────┘
                                    │
                                    │ MCP 协议
                                    │ (JSON-RPC 2.0)
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼────┐   ┌─────▼────┐   ┌─────▼────┐
              │ MCP 服务器 │   │ MCP 服务器 │   │ MCP 服务器 │
              │  (GitHub)  │   │ (数据库)   │   │ (文件系统) │
              └───────────┘   └───────────┘   └───────────┘
```

**核心组件**：

| 组件 | 角色 | 说明 |
|------|------|------|
| **主机（Host）** | AI 应用 | Claude Code、Cursor 等，用户与之交互的程序 |
| **客户端（Client）** | 连接器 | AI 主机内置，管理与服务器的 1:1 连接 |
| **服务器（Server）** | 数据/工具提供者 | 轻量级程序，暴露特定功能（读取文件、查询 DB 等） |

**MCP 提供的能力**：

- **Resources**：资源读取，类似 GET 请求——AI 可以读取文件、查询数据库、获取 API 数据
- **Tools**：工具调用，类似 POST 请求——AI 可以创建 PR、发送消息、执行命令
- **Prompts**：预设提示词模板——预定义的交互模式

#### 实用配置示例

**1. 基础：本地开发环境**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_xxx" }
    }
  }
}
```

**2. 中阶：数据库和 API**

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/mydb"
      }
    },
    "seq": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**3. 高阶：自定义 MCP 服务器**

```python
# 一个简单的 MCP 服务器示例
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio

async def main():
    server = Server("my-custom-server")

    # 注册一个工具
    @server.list_tools()
    async def handle_list_tools():
        return [
            {
                "name": "search_code",
                "description": "在代码库中搜索关键词",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "keyword": {"type": "string"},
                        "file_ext": {"type": "string"}
                    },
                    "required": ["keyword"]
                }
            }
        ]

    @server.call_tool()
    async def handle_call_tool(name: str, arguments: dict):
        if name == "search_code":
            keyword = arguments["keyword"]
            # 执行搜索逻辑
            return [{"type": "text", "text": f"搜索 {keyword} 的结果..."}]

    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream, write_stream,
            InitializationOptions(
                server_name="my-custom-server",
                server_version="1.0.0"
            )
        )
```

#### MCP vs A2A：两个协议的分工

2026 年，有两个重要的 AI 协议：

```
MCP（Model Context Protocol）
  → AI ↔ 工具/数据
  → 让 AI 获取上下文、执行操作
  → 类比：USB-C（设备和外设的连接标准）

A2A（Agent-to-Agent Protocol）
  → Agent ↔ Agent
  → 让不同 AI Agent 之间协作
  → 类比：HTTP（浏览器和服务器的通信标准）
```

两者互补，不是竞争。MCP 管 AI 怎么获取数据，A2A 管 Agent 之间怎么协作。一个典型的场景：

```
你：帮我处理这个订单

AI Agent（编排者）←── A2A ──→ 支付 Agent
     │                            │
     │ MCP                         │ MCP
     ▼                            ▼
  数据库                        支付网关
```

#### 2026 MCP 路线图

2026 年 MCP 的重要更新方向：

| 时间 | 更新 | 影响 |
|------|------|------|
| 2025 Q4 | MCP v1.0 正式发布 | 协议稳定，进入生产环境 |
| 2026 Q1 | Tool Search（工具搜索） | AI 自动发现可用的工具，减少 95% 上下文占用 |
| 2026 Q1 | Streaming results | 工具调用支持流式返回结果 |
| 2026 Q2 | 认证和授权 | 标准化的 OAuth 2.0 集成 |
| 2026 Q3 | 企业级部署 | 审计日志、权限管理、高可用 |
| 2026 Q4 | 远程 MCP 服务器 | 支持跨网络连接 |

**Tool Search 是 2026 年最重要的更新**：以前每个工具都要在提示词中声明（占用上下文），Tool Search 让 AI 在需要时自动发现和加载工具，不占用上下文窗口。这在有几十个 MCP 工具的场景下意义重大。

#### OWASP MCP Top 10 安全要点

2026 年 OWASP 发布了 MCP 安全 Top 10，使用 MCP 时需要注意：

| 风险 | 说明 | 防范 |
|------|------|------|
| 过度权限 | 服务器可以访问所有资源 | 最小权限原则，限制文件路径 |
| Prompt 注入 | 恶意数据注入攻击 | 输入验证和输出过滤 |
| 中间人攻击 | 未加密的通信 | 使用 TLS 加密 |
| 数据泄露 | 敏感数据通过 MCP 暴露 | 对敏感资源加访问控制 |
| 未授权访问 | 缺少身份认证 | OAuth 2.0 集成 |

**实践建议**：
- 不要在生产环境使用带有完整数据库权限的 MCP 服务器
- 自定义 MCP 服务器时，验证所有输入参数
- MCP 服务器的 `env` 字段不要硬编码密钥，使用环境变量引用

#### 适用场景对比

| 场景 | 用 MCP | 不用 MCP |
|------|--------|----------|
| 需要实时数据（GitHub PR, DB 查询） | ✅ 自动获取 | ❌ 手动复制粘贴 |
| 需要执行操作（创建 PR, 发消息） | ✅ 自动执行 | ❌ 手动操作 |
| 自定义数据源 | ✅ 写一个服务器 | ❌ 每次复制数据 |
| 单次简单查询 | — | ✅ 直接复制粘贴更快 |
| 文件读取 | ✅ 更规范 | ✅ Claude Code 已内置 |

### 技巧 6：验证理解

```
你：写用户注册功能
项目信息：[提供上下文]

你（追问）：在我继续之前，请确认你理解了：
1. 使用什么框架？
2. 有什么业务规则？
3. 需要哪些验证？

AI：我理解了：
1. Nest.js + TypeORM
2. 手机号唯一，密码 >= 8 位
3. 手机号格式、密码强度、验证码

你：正确，请继续
```

让 AI 先复述理解，确认正确后再继续，可以避免很多返工。

---

## 常见问题

### AI 忽略了我提供的上下文

**原因**：上下文太长被截断、不清晰、或 AI 注意力在其他地方

**解决**：缩短上下文只保留关键信息，用结构化格式（Markdown、表格），在每次回复时强调"参考上面的项目信息"

### AI 理解错了我的项目

**原因**：上下文不够具体、有歧义、AI 做了错误假设

**解决**：提供代码示例，明确说明"不要假设，按文档来"，让 AI 先复述理解确认正确

### 每次都要重复提供上下文，太麻烦

**解决**：
- 使用 Projects 功能
- 保存上下文模板，复制粘贴
- 搭建 RAG 系统（一次性投入）

### Wiki 更新了，AI 还在用旧信息

**解决**：
- 在 Projects 中重新上传文档
- 在对话中明确说明"最新信息如下"
- RAG 系统自动更新（重新索引）

---

## 总结

三种方法各有适用场景：直接引用适合有文件访问的工具，总结传递适合任何工具但费时，自动检索适合大型项目但复杂。

个人项目用总结传递就够了，团队项目可以考虑直接引用加 Projects 功能，大型项目再投入 RAG 系统。

实践中，上下文卡片、渐进式提供、让 AI 询问、验证理解这些小技巧很实用。

### 最佳实践

- 结构化提供上下文（Markdown、表格）
- 控制上下文长度（关键信息优先）
- 使用 Projects 功能（避免重复）
- 配置 MCP 服务器（自动获取外部数据）
- 验证 AI 的理解（确认后继续）
- 记录有效的上下文组合

### 2025-2026 新趋势

**智能上下文管理**

- Claude Skills：三层上下文架构（主上下文、技能元数据、按需加载）
- MCP Tool Search：2026 年新增，自动懒加载工具，减少 95% 上下文占用
- 提示缓存：重复上下文无需重复付费（详见下方"技巧 7"）

---

## 技巧 7：Prompt Caching（提示缓存）

Prompt Caching 是一项目前被低估的技术——它不是"省一点 token"那么简单，而是**从根本上改变了上下文管理的成本结构**。

### 原理

大模型 API 调用时，系统提示词、文档内容这些"固定部分"每次都要重新计算一遍 embedding。Prompt Caching 的做法是：把这些固定内容缓存起来，下次同样的内容过来直接复用缓存结果。

```
没有缓存：
每次调用 → 重新处理完整的系统提示 + 文档（全价付费）
有缓存：
第一次调用 → 处理并缓存系统提示 + 文档（全价）
后续调用 → 只处理用户输入部分（缓存部分 90% 折扣）
```

Anthropic 在 2025 年 3 月正式推出 Prompt Caching，Claude 3.7 Sonnet 支持后扩展到全系列模型。

### 效果

根据 Anthropic 官方数据和社区实践：

| 指标 | 提升幅度 |
|------|---------|
| **成本降低** | 最高 90%（长提示场景） |
| **延迟降低** | 最高 85%（缓存命中时） |
| **ITPM 不占用** | 缓存读取不占用输入速率限制 |

Cache-aware rate limits 是这里的关键优化：**缓存读取 token 不计入 ITPM（每分钟输入 token 限制）**。这意味着你可以保持大量上下文在缓存中，同时不影响吞吐量。

### 缓存断点策略

正确设置缓存断点（cache breakpoints）是发挥 Prompt Caching 效果的关键：

```python
# 错误的做法：每个请求独立
messages = [
    {"role": "user", "content": "帮我写一个登录功能"}
]  # 无法缓存

# 正确的做法：固定系统提示 + 文档作为缓存前缀
messages = [
    {
        "role": "system",
        "content": [
            {
                "type": "text",
                "text": "你是一个资深全栈工程师...",
                "cache_control": {"type": "ephemeral"}  # ← 设置缓存断点
            },
            {
                "type": "text",
                "text": project_context_doc,
                "cache_control": {"type": "ephemeral"}  # ← 第二个缓存断点
            }
        ]
    },
    {"role": "user", "content": "帮我写一个登录功能"}
]
```

**经验法则**：

- **系统提示词 + 项目文档** → 放缓存前缀。这类内容每次对话都一样
- **对话历史** → 最近几轮可以放缓存前缀，最新的用户输入不放
- **最长的缓存前缀自动生效**：Anthropic API 2025 年更新后，不需要手动指定使用哪个缓存段，API 自动选择最长匹配的缓存前缀

### 缓存命中率的优化技巧

2026 年的一些实践建议：

1. **把变化最少的内容放在缓存前缀的开头**：系统提示词 > 项目文档 > 代码示例
2. **缓存 TTL 是 5 分钟**：如果两次调用间隔超过 5 分钟，缓存会过期。高频调用的场景缓存效果更好
3. **平衡缓存长度和命中率**：缓存前缀越长，节省越多，但首次加载成本也越高。测试你的场景找到平衡点
4. **利用多段缓存**：API 支持多个缓存断点，把不同层级的上下文分开缓存

### 效果对比

```markdown
场景：AI 编码助手，每次请求携带 20K token 的项目文档

无缓存：
每次请求花费：20K + 用户输入
月度成本（10,000 次请求）：
  20K * 10,000 = 200M token/月 × $3/M = $600

有缓存（90% 命中率）：
首次请求：20K（全价）
后续 9,999 次：缓存命中，20K 部分 10% 价格
月度成本：
  首次：20K × $3/M = $0.06
  缓存部分：200M × 10% × $3/M = $60
  用户输入部分：正常计费
  总计：约 $60 + 用户输入费用

节省：约 85-90%
```

### 其他模型的 Prompt Caching

| 模型 | 缓存机制 | TTL | 折扣 |
|------|---------|-----|------|
| **Claude 3.7+** | 显式缓存断点 | 5 分钟 | 缓存部分 90% 折扣 |
| **GPT-4o** | 自动缓存 | 5-10 分钟 | 缓存部分 50% 折扣 |
| **Gemini** | 自动缓存 | 可变 | 缓存部分 50% 折扣 |

Claude 的折扣力度最大（90% vs 50%），而且支持手动控制缓存位置（断点），灵活性最高。

### 一句话总结

```
Prompt Caching 是上下文管理的"免费午餐"。
一次付出缓存成本，后续享受 90% 折扣。
对高频调用的 AI 应用，这是必须做的优化。
```

**外部知识库集成**

传统方式是手动复制粘贴，浪费时间且容易出错。现在用 MCP 服务器可以自动获取、实时更新。

**混合检索成为主流**

语义检索加关键词检索，加上 ReRanker 二次排序。GraphRAG（知识图谱增强）和 Self-RAG（AI 自我评估检索需求）也开始应用。

**上下文窗口突破**

Claude 4 系列最高支持 200K token（约 15 万汉字），GPT-4o 支持 128K token。不过实践中仍需精简上下文，质量比数量更重要。

---

### 下一步

掌握了让 AI 使用上下文的技巧后，我们将学习：

- ["拉了么"项目深度剖析](./07-lamo-deep-dive/) → 真实项目实践
- [不同规模项目的上下文策略](./08-scaling-strategies/) → 如何根据项目规模选择策略

---

[← 返回文章目录](../context-management/) | [继续学习："拉了么"项目深度剖析 →](./07-lamo-deep-dive/)
