# RAG 系统深度实践

> 从零构建智能检索系统，让 AI 自动从文档库中获取上下文

> 数据来源：本文基于 2025-2026 年最新 RAG 技术实践，参考了 LangChain v0.3 官方文档、LlamaIndex 2025 教程、微软 GraphRAG 白皮书、以及多个生产环境案例研究。

---

## 什么是 RAG？

RAG（Retrieval-Augmented Generation，检索增强生成）结合信息检索与文本生成，让大语言模型能够访问外部知识库。

```
传统方式：
用户提问 → LLM → 回答
（仅依赖模型训练知识，可能产生幻觉）

RAG 方式：
用户提问 → 检索相关文档 → LLM + 文档 → 回答
（基于真实文档，减少幻觉）
```

## 为什么 RAG 在 2025 年变得至关重要？

### 知识截止问题

LLM 训练数据有截止时间（例如 GPT-4 到 2023 年 4 月），无法回答之后发生的事件。RAG 可以检索最新文档，突破时间限制。

### 领域知识匮乏

LLM 是通用模型，不了解你的业务细节。它无法回答公司内部流程、产品规格等问题。RAG 可以检索项目文档和知识库，填补这个空白。

### 幻觉问题

斯坦福 AI Lab 2025 的研究发现，未优化的 RAG 系统仍有 40% 的响应存在幻觉。RAG 强制基于检索文档回答，结合评估框架（如 RAGAS、DeepEval）可将幻觉率降至 5% 以下。

---

## 核心组件

### 1. 文档加载器

将各种格式的文档转换为文本。

```python
from langchain.document_loaders import (
    DirectoryLoader,
    TextLoader,
    PDFLoader,
    MarkdownLoader
)

# 加载目录中的所有 markdown 文件
loader = DirectoryLoader(
    './wiki',
    glob='**/*.md',
    loader_cls=MarkdownLoader
)

documents = loader.load()
```

**支持的格式**：
- 文本：txt, md, csv
- 文档：pdf, docx
- 网页：html
- 代码：各种编程语言

### 2. 文档分割器

长文档需要切分成小块。

```python
from langchain.text_splitter import MarkdownHeaderTextSplitter

markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ]
)

docs = markdown_splitter.split_text(document_content)
```

| 策略 | 适合场景 | 特点 |
|------|----------|------|
| 按字符分割 | 通用 | 简单直接 |
| 按标题分割 | Markdown | 保持语义完整 |
| 按代码块分割 | 代码文档 | 保留代码结构 |
| 递归分割 | 长文档 | 自适应调整 |

块大小建议 500-1000 字符，重叠 100-200 字符（有助于保持上下文连贯性）。

### 3. 向量化模型

将文本转换为向量表示。

```python
from langchain.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(
    openai_api_key="your-api-key"
)

# 向量化文本
vector = embeddings.embed_query("用户注册流程")

# 向量化文档列表
vectors = embeddings.embed_documents([
    "用户需要提供手机号",
    "系统发送验证码",
    "用户验证后创建账户"
])
```

| 模型 | 维度 | 成本 | 质量 | 推荐场景 |
|------|------|------|------|----------|
| **text-embedding-3-small** | 1536 | 低 | 高 | 中文、通用 |
| **text-embedding-3-large** | 3072 | 中 | 很高 | 复杂语义 |
| **bge-m3** (开源) | 1024 | 免费 | 高 | 本地部署 |

### 4. 向量数据库

> 数据来源：[向量数据库性能对比 2026](https://m.blog.csdn.net/sara_han/article/details/153577100) (2025-10-20)

存储和检索向量。根据 2026 年性能测试（1M 向量，1536 维）：

| 数据库 | p50 延迟 | p99 延迟 | 部署方式 | 适合场景 |
|--------|----------|----------|----------|----------|
| **Qdrant** | 4ms | 25ms | 开源/托管 | 高性能需求、复杂过滤、Rust 实现 |
| **Pinecone** | 8ms | 45ms | 托管 | 零运维、快速原型 |
| **ChromaDB** | 12ms | 70ms | 开源 | 本地开发、小规模 |
| **pgvector** | 18ms | 90ms | 开源扩展 | 已有 PostgreSQL |
| **Milvus** | 5ms | 30ms | 开源/托管 | 超大规模、GPU 加速 |
| **Weaviate** | 10ms | 55ms | 开源/托管 | 混合搜索 |

```python
from langchain_chroma import Chroma
from langchain_qdrant import QdrantVectorStore

# 个人项目：ChromaDB
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 生产环境：Qdrant
vectorstore = QdrantVectorStore.from_documents(
    documents=splits,
    embedding=embeddings,
    url="http://localhost:6333",
    collection_name="my_docs",
)
```

---

## 完整实现

### 方案 1：LangChain 0.3+

> 数据来源：[LangChain 官方文档](https://docs.langchain.com/oss/python/langchain/rag) (2025-03-01)

LangChain 0.3 版本引入了全新的 API 架构，更加模块化和生产就绪。

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
    Document(page_content="用户注册需要提供手机号和验证码", metadata={"source": "api.md"}),
    Document(page_content="密码至少 8 位，包含字母和数字", metadata={"source": "rules.md"}),
]

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    separators=["\n\n", "\n", "。", "！", "？", " ", ""]
)

splits = text_splitter.split_documents(documents)

# 2. 创建向量存储
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

retrieve_chain = create_retrieval_chain(
    retriever,
    create_stuff_documents_chain(llm, prompt)
)

# 4. 查询
response = retrieve_chain.invoke({"input": "用户注册需要什么？"})
print(response["answer"])
```

### 方案 2：LlamaIndex 2025

> 数据来源：[Real Python - LlamaIndex RAG Guide](https://realpython.com/llamaindex-examples/) (2025-12-24)

LlamaIndex 2025 引入了 `Settings` 配置系统，API 更加简洁。

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

# 配置模型
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")
Settings.llm = OpenAI(model="gpt-4o", temperature=0)

# 1. 加载文档
documents = SimpleDirectoryReader('./wiki').load_data()

# 2. 创建索引
index = VectorStoreIndex.from_documents(documents)

# 3. 创建查询引擎
query_engine = index.as_query_engine(
    similarity_top_k=5,
    vector_store_query_mode="default",
    alpha=0.7,  # 混合检索权重
)

# 4. 查询
response = query_engine.query("如何实现用户注册功能？")
print(response)

# 5. 聊天引擎
chat_engine = index.as_chat_engine(
    chat_mode="condense_question",
    verbose=True,
)

response = chat_engine.chat("用户登录失败怎么办？")
```

### 方案 3：原生实现

```python
import chromadb
from openai import OpenAI

chroma_client = chromadb.PersistentClient(path='./db')
openai_client = OpenAI()

collection = chroma_client.get_or_create_collection(
    name="wiki_docs",
    metadata={"hnsw:space": "cosine"}
)

def add_documents(file_paths):
    for path in file_paths:
        with open(path, 'r') as f:
            content = f.read()

        response = openai_client.embeddings.create(
            input=content,
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding

        collection.add(
            documents=[content],
            embeddings=[embedding],
            metadatas=[{"source": path}],
            ids=[path]
        )

def search(query, n_results=3):
    response = openai_client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    )
    query_embedding = response.data[0].embedding

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    return results

def generate_answer(query, context):
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "你是一个技术助手，基于提供的文档回答问题。"
            },
            {
                "role": "user",
                "content": f"""
文档：
{context}

问题：{query}

请基于以上文档回答问题。
"""
            }
        ]
    )

    return response.choices[0].message.content

def ask(query):
    results = search(query, n_results=3)
    context = "\n\n".join(results['documents'][0])
    answer = generate_answer(query, context)

    return {
        "answer": answer,
        "sources": results['metadatas'][0]
    }
```

---

## 高级 RAG 技术（2025-2026）

### GraphRAG：知识图谱增强检索

> 数据来源：[微软 2025 GraphRAG 白皮书](https://www.sohu.com/a/850245247_122139952)

GraphRAG 将传统向量检索与知识图谱结合，通过实体和关系网络提升检索准确性。

实体间的关系被显式建模，解决了"信息孤岛"问题。它支持多跳推理，可通过关系链路找到间接相关信息，检索路径也可追溯。

```python
from llama_index.core import PropertyGraphIndex
from llama_index.graph_stores import Neo4jGraphStore

graph_store = Neo4jGraphStore(
    url="bolt://localhost:7687",
    username="neo4j",
    password="your-password"
)

index = PropertyGraphIndex.from_documents(
    documents,
    graph_store=graph_store,
    show_progress=True,
)

query_engine = index.as_query_engine(
    include_text=True,
    similarity_top_k=2,
    graph_depth=2,
)

response = query_engine.query("用户注册失败与哪些模块有关？")
# 可以检索到：用户注册 → 验证码服务 → 短信网关 → 运营商接口
```

**应用场景**：
- 企业知识库：员工、项目、文档之间的关系网络
- 医疗诊断：症状、疾病、药物之间的关联
- 法律文档：案件、法条、判例之间的引用关系

### Self-RAG：自我反思的检索系统

> 数据来源：[Self-RAG GitHub](https://github.com/anikch/self_RAG) (2024-01-10)

Self-RAG 让 LLM 学会自我评估：什么时候需要检索？检索的内容是否相关？生成的内容是否基于事实？

```python
from langchain.chains import SelfRAGChain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)

self_rag = SelfRAGChain.from_llm(
    llm=llm,
    retriever=retriever,
    retrieve_token="[检索]",
    relevance_token="[相关]",
    support_token="[有支持]",
    complete_token="[完整]",
)

response = self_rag.invoke("如何实现用户注册？")
```

### Adaptive RAG：自适应路由

> 数据来源：[连续尝试 18 种 RAG 技术](https://www.51cto.com/aigc/4845.html) (2025-04-02)

Adaptive RAG 根据问题类型动态选择检索策略。

```python
from langchain.chains import create_retrieval_chain
from langchain_core.runnables import RunnableBranch

simple_retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
complex_retriever = vectorstore.as_retriever(
    search_kwargs={"k": 10, "search_type": "mmr"}
)

branch = RunnableBranch(
    (lambda x: "是什么" in x["input"] or "列表" in x["input"], simple_retriever),
    (lambda x: "如何" in x["input"] or "为什么" in x["input"], complex_retriever),
    vectorstore.as_retriever(search_kwargs={"k": 5})
)

adaptive_chain = create_retrieval_chain(branch, create_stuff_documents_chain(llm, prompt))
```

**实验结果**（1000 问测试）：
- 简单问题延迟降低 40%
- 复杂问题准确率提升 25%
- 整体用户满意度从 0.72 提升到 0.86

---

## 文档切片策略（2025 最佳实践）

> 数据来源：[Best Chunking Strategies for RAG in 2025](https://www.firecrawl.dev/blog/best-chunking-strategies-rag-2025) (2025-10-10)

错误的切片策略会导致检索准确率下降 9%。

### 固定大小切片

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    length_function=len,
)

splits = text_splitter.split_documents(documents)
```

简单快速，但可能破坏语义边界。

### 语义切片

语义切片保持句子完整性，检索准确率比固定大小提升 15-25%。

```python
from langchain_experimental.text_splitter import SemanticChunker

semantic_splitter = SemanticChunker(
    embeddings=OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile",
)

splits = semantic_splitter.split_documents(documents)

# 原文："用户注册流程如下：1. 输入手机号 2. 获取验证码 3. 设置密码"
# 固定切片：["用户注册流程如下：1. 输入", ...]  ❌
# 语义切片：["用户注册流程如下：1. 输入手机号 2. 获取验证码", ...]  ✅
```

### 混合切片

> 数据来源：[Document Chunking for RAG: 9 Strategies Tested](https://langcopilot.com/posts/2025-10-11-document-chunking-for-rag-practical-guide) (2025-10-11)

结合多种方法，适合包含表格、代码、混合格式的文档。

```python
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
)

markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ],
)

md_splits = markdown_splitter.split_text(document_content)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
    separators=["\n\n", "\n", "。", "！", "？", " ", ""],
)

final_splits = []
for section in md_splits:
    final_splits.extend(text_splitter.split_documents([section]))
```

| 切片策略 | 检索准确率 | 计算成本 | 实现难度 | 推荐场景 |
|----------|-----------|----------|----------|----------|
| 固定大小 | 65% | 低 | 简单 | 原型开发 |
| 递归切片 | 75% | 中 | 中 | 通用 RAG |
| 语义切片 | 85% | 高（3-5x） | 中 | 生产环境 |
| 混合切片 | 90% | 很高 | 复杂 | 复杂文档 |

**最佳实践参数**（2025 验证）：
- Chunk size: 400-800 tokens（BERT/LLaMA 系列）
- Overlap: 15-25%
- 嵌入模型：`text-embedding-3-small` (1536 维，性价比高)

---

## 评估与优化（2025 框架）

### RAGAS：自动化 RAG 评估

> 数据来源：[RAGAS Documentation](https://docs.ragas.io/en/latest/concepts/metrics/) (2025-01-24)

RAGAS 是最流行的 RAG 评估框架。

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevance,
    context_precision,
    context_recall,
)

test_data = [
    {
        "question": "如何实现用户注册？",
        "answer": "用户需要提供手机号和验证码，系统验证后创建账户",
        "contexts": ["用户注册流程：1. 输入手机号 2. 获取验证码"],
        "ground_truth": "用户注册需要手机号、验证码和密码"
    }
]

result = evaluate(
    test_data,
    metrics=[
        faithfulness,      # 答案与上下文一致性（目标 >0.8）
        answer_relevance,  # 答案与问题相关性（目标 >0.8）
        context_precision, # 上下文精确度（目标 >0.7）
        context_recall,    # 上下文召回率（目标 >0.7）
    ]
)

print(result)
```

### DeepEval：开发者友好的评估框架

> 数据来源：[DeepEval GitHub](https://github.com/richardsonjf/confident-ai-deepeval)

DeepEval 集成 Pytest，像写单元测试一样评估 RAG。

```python
from deepeval import assert_test
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
)
from deepeval.test_case import LLMTestCase

test_case = LLMTestCase(
    input="如何实现用户注册？",
    actual_output="用户需要提供手机号",
    retrieval_context=["用户注册需要手机号和密码"],
)

answer_relevancy = AnswerRelevancyMetric(threshold=0.7)
faithfulness = FaithfulnessMetric(threshold=0.8)

assert_test(test_case, [answer_relevancy, faithfulness])
```

### TruLens：RAG TRIAD 评估

> 数据来源：[TruLens GitHub](https://github.com/truera/trulens)

TruLens 提供"RAG 三元组"评估体系。

```python
from trulens_eval import Tru
from trulens_eval.feedback import Groundedness

tru = Tru()
grounded = Groundedness(groundedness_provider=openai)

tru_recorder = TruRecorder(rag_chain, app_id="my_rag_v1")

with tru_recorder as recording:
    response = rag_chain.invoke("如何注册？")

tru.run_dashboard()
```

| 框架 | 指标丰富度 | 易用性 | 集成能力 | 推荐场景 |
|------|-----------|--------|----------|----------|
| **RAGAS** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 全面评估 |
| **DeepEval** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | CI/CD 集成 |
| **TruLens** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 可视化分析 |
| **Phoenix** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 实时监控 |

---

## 生产部署

### Docker Compose 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - QDRANT_URL=http://qdrant:6333
    volumes:
      - ./data:/app/data
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:v1.9
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant_storage:/qdrant/storage

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

### 监控指标

```python
from prometheus_client import Counter, Histogram, Gauge
import time

query_count = Counter('rag_queries_total', 'Total queries')
query_latency = Histogram('rag_query_duration_seconds', 'Query latency')
retrieval_count = Counter('rag_retrievals_total', 'Total retrievals')
hallucination_rate = Gauge('rag_hallucination_rate', 'Hallucination rate')

@query_latency.time()
def query_with_metrics(question):
    query_count.inc()

    start_retrieve = time.time()
    docs = retriever.invoke(question)
    retrieval_count.inc()

    response = llm.invoke(docs)

    retrieve_latency = time.time() - start_retrieve

    return response

from prometheus_client import start_http_server
start_http_server(8001)
```

### 成本估算（2026 年价格）

```
OpenAI API 成本（1000 次查询/天）：
- Embedding (text-embedding-3-small):
  - 价格：$0.02 / 1M tokens
  - 1000 页文档 ≈ 500K tokens
  - 一次性成本：$0.01

- GPT-4o 生成：
  - 价格：$2.5 / 1M input tokens
  - 100 次查询 × 500 tokens = $0.125 / 天
  - 月度成本：~$3.75

向量数据库成本（100 万向量）：
- Qdrant 自建：$0（服务器成本约 $20/月）
- Pinecone 托管：$70/月（Starter 版）
- ChromaDB 本地：$0

月度总成本估算：
- 小型项目（自建）：~$25/月
- 中型项目（托管）：~$100/月
- 大型项目（分布式）：~$500+/月
```

---

## 2025-2026 新趋势

### Agentic RAG：从被动检索到主动代理

#### 和传统 RAG 的区别

传统 RAG 是被动的——用户提问，系统检索，LLM 回答。Agentic RAG 让 LLM 自己决定**什么时候需要检索、检索什么、怎么用检索结果**。

```
传统 RAG：
用户提问 → 强制检索 → 生成回答
（每次都检索，不管是否需要）

Agentic RAG：
用户提问 → LLM 判断是否需要检索
  ├── 不需要 → 直接生成回答（节省成本和延迟）
  └── 需要 → 决定检索什么 → 选择检索策略 → 评估结果 → 生成回答
              （可能多次检索，也可能调用其他工具）
```

AWS 在 2025 年的博客中描述了三种 Agentic RAG 模式：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **路由式** | 先判断问题类型，再路由到不同的检索策略 | 混合问答系统 |
| **工具式** | 检索是 Agent 可选工具之一，可决定是否使用 | 通用 AI 助手 |
| **多步式** | Agent 自主规划多步检索和执行流程 | 复杂任务 |

#### 模式 1：路由式 RAG

```python
def routing_rag(query):
    """根据问题类型路由到不同的处理策略"""

    # 1. 分析问题类型
    intent = classify_intent(query)

    if intent == "factual":
        # 事实性问题 → 直接生成
        return llm.generate(query)

    elif intent == "knowledge":
        # 知识性问题 → 检索后生成
        docs = vector_store.search(query, k=5)
        return llm.generate(query, context=docs)

    elif intent == "complex":
        # 复杂问题 → 多步检索 + 推理
        return multi_step_rag(query)

    else:
        # 默认：简单检索
        docs = vector_store.search(query, k=3)
        return llm.generate(query, context=docs)
```

2025 年的实验数据表明：路由式 RAG 将简单问题延迟降低 **40%**，复杂问题准确率提升 **25%**。

#### 模式 2：工具式 RAG

检索被当作 Agent 的一个工具，Agent 自主决定是否调用：

```python
from langchain.agents import create_react_agent
from langchain.tools import Tool

# 检索工具——Agent 可以自主决定是否使用
retrieval_tool = Tool(
    name="knowledge_search",
    func=vector_store.search,
    description="当需要项目文档、技术规范、API 说明时使用。"
                "不用于一般性问题、问候、闲聊。"
)

# 其他工具
tools = [
    retrieval_tool,
    calculator_tool,
    code_executor_tool,
    web_search_tool,
]

# Agent 自主决定何时检索
agent = create_react_agent(llm, tools, prompt)
```

**典型的 Agent 决策路径**：

```
用户：帮我写一个用户注册接口

Agent 思考：
- 这是一个编码任务
- 我需要知道项目的技术栈和现有代码风格
- → 调用 knowledge_search

Agent 思考：
- 技术栈找到了：Nest.js + Prisma
- 现有代码风格找到了：参考 user.module.ts
- 我现在可以生成代码了
- → 直接生成回复
```

#### 模式 3：多步式 RAG

复杂任务中，Agent 自主规划多步检索和执行：

```python
def multi_step_rag(query):
    """多步 RAG：自主规划和执行"""

    # 第 1 步：理解问题，制定检索计划
    plan = llm.plan(query)
    # "要回答这个问题，我需要：
    #  1. 查找用户模块的数据库 schema
    #  2. 找到用户注册的业务逻辑
    #  3. 了解项目的错误处理规范"

    # 第 2 步：按计划执行检索
    results = {}
    for step in plan:
        docs = vector_store.search(step.query, k=3)
        results[step.name] = docs

    # 第 3 步：验证检索结果是否足够
    missing = llm.check_gaps(query, results)
    if missing:
        # 补充检索
        for gap in missing:
            docs = web_search.search(gap)
            results[gap.name] = docs

    # 第 4 步：综合生成
    return llm.generate(query, context=results)
```

#### 2026 年的发展趋势

**1. 多模态 Agentic RAG**

Agent 不仅检索文本，还能检索和生成图像、代码、结构化数据：

```
用户：帮我画一个用户注册的流程图

Agent：需要找到用户注册的"业务流程"
→ 检索文本文档 → 检索已有流程图 → 生成新的流程图
```

**2. 协同多 Agent RAG**

多个 Agent 协同完成复杂检索任务：

```
主 Agent：拆解问题
  ├── Agent A：检索技术文档
  ├── Agent B：检索业务规则
  ├── Agent C：检索相似代码
  └── 汇总 Agent：综合生成回答
```

**3. 自愈 RAG**

Agent 自我评估检索质量，不足时自动修复：

```python
def self_healing_rag(query):
    answer = generate(query, retrieved_docs)

    # 自我评估
    quality = self_evaluate(answer, query, retrieved_docs)

    if quality < threshold:
        # 诊断问题
        issues = diagnose(query, answer)
        # 修复：重新检索或调整策略
        if "missing_context" in issues:
            new_docs = retrieve_more(query)
            answer = generate(query, new_docs)
        elif "hallucination" in issues:
            answer = grounding(query, retrieved_docs)

    return answer
```

#### 实践建议

```
开始使用 Agentic RAG 的步骤：

第 1 步：从路由式开始
- 判断问题是否复杂
- 简单直接答，复杂再检索

第 2 步：过渡到工具式
- 检索成为 Agent 的工具之一
- Agent 自主决定是否检索

第 3 步：完善为多步式
- Agent 自主规划检索路径
- 可调用多个工具
- 能自我验证和修正

推荐从第 1 步开始，不要在项目第一天就追求多步式。
```

### 混合检索成为主流

语义检索 + 关键词检索 + 重排序的组合成为标配。

```python
from langchain.retrievers import (
    BM25Retriever,
    EnsembleRetriever,
)

vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})
bm25_retriever = BM25Retriever.from_documents(documents, k=10)

ensemble_retriever = EnsembleRetriever(
    retrievers=[vector_retriever, bm25_retriever],
    weights=[0.7, 0.3],
)

from langchain_cohere import CohereRerank

reranker = CohereRerank(top_n=3)
final_chain = ensemble_retriever | reranker
```

### 上下文窗口突破

Claude 4 系列支持 200K token（约 15 万汉字），GPT-4o 支持 128K token。但实践中，长上下文不是万能的，检索仍然必要；更大的窗口需要更精细的切片策略；成本随窗口大小线性增长。

### RAG 评估标准化

RAGAS、DeepEval、TruLens 成为事实标准。行业基准测试（RAG Benchmark）开始出现，企业开始建立内部的 RAG 评估流程。

---

## 总结：RAG 系统成熟度模型

根据 2025 年的实践：

**Level 1：基础 RAG**
- 固定大小切片
- 单一向量检索
- 简单的生成链
- 无评估机制

**Level 2：优化 RAG**（当前大多数团队）
- 语义切片
- 混合检索
- 基础评估（RAGAS）
- 生产部署

**Level 3：高级 RAG**（领先团队）
- GraphRAG / Self-RAG
- 自适应路由
- 完整评估体系
- 成本优化

**Level 4：代理 RAG**（2026 前沿）
- Agentic RAG
- 多模态检索
- 实时学习
- 自愈系统

### 关键建议

1. **从简单开始**：先用 LangChain 或 LlamaIndex 快速原型
2. **重视评估**：RAGAS 或 DeepEval，越早越好
3. **优化切片**：语义切片比固定大小提升 15-25%
4. **混合检索**：向量 + BM25 + Rerank 是当前最佳实践
5. **监控成本**：建立成本监控，避免意外增长
6. **持续迭代**：RAG 是持续优化的过程，不是一次性的项目

---

### 下一步

- [实战案例：构建企业知识库](../real-world-examples/enterprise-kb/) → 端到端实现
- [RAG 性能优化深度剖析](../optimization/rag-performance/) → 高级技巧

---

[← 返回文章目录](../context-management/) | [继续学习：实战案例 →](../real-world-examples/)
