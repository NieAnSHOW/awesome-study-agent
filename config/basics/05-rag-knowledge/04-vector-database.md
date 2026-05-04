# 向量数据库

> **学习目标**:理解向量数据库的作用、主流产品选型和实际应用技巧
>
> **预计时间**:80 分钟
>
> **难度等级**:⭐⭐⭐☆☆

---

## 核心概念

### 什么是向量数据库?

**向量数据库**(Vector Database)是专门用于存储、索引和查询高维向量的数据库。它的核心功能是**快速找出与给定向量最相似的 k 个向量**。

::: tip 为什么不能用传统数据库?
假设你有 100 万个文档块,用户问了一个问题:

**传统数据库**(PostgreSQL):
```sql
-- 需要计算与所有文档的相似度
SELECT *, cosine_similarity(query_vector, doc_vector) as sim
FROM documents
ORDER BY sim DESC
LIMIT 5;
-- 问题:需要遍历 100 万行,太慢!
```

**向量数据库**(Pinecone/Milvus):
```python
# 使用近似最近邻(ANN)算法
results = index.query(vector=query_vector, top_k=5)
-- 速度提升 100-1000 倍!
```
:::

### 向量数据库 vs 传统数据库

| 特性 | 向量数据库 | 传统数据库(MySQL/PostgreSQL) |
|------|-----------|---------------------------|
| **核心能力** | 高维向量相似度搜索 | 精确匹配、事务处理 |
| **索引方式** | HNSW、IVF、PQ 等 | B-tree、Hash |
| **查询类型** | 近似最近邻(ANN) | 精确查询 |
| **性能** | 百万级数据,毫秒级响应 | 全表扫描慢 |
| **适用场景** | RAG、推荐、图像搜索 | 关系型数据管理 |

::: info 混合使用
实际项目中,通常是:
- **PostgreSQL** 存储原始文档和元数据
- **向量数据库** 存储向量索引
- 两者通过 ID 关联
:::

---

## 核心算法

### KNN vs ANN

**KNN**(K-Nearest Neighbors,K 近邻):
- 精确计算与所有向量的距离
- 准确率 100%,但速度慢
- 适合小规模数据(< 10 万)

**ANN**(Approximate Nearest Neighbors,近似最近邻):
- 通过索引快速缩小搜索范围
- 牺牲少量准确率(95-99%),换取 100 倍速度提升
- RAG 系统的标准选择

### 主流 ANN 算法

| 算法 | 原理 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|----------|
| **HNSW**[^1] | 分层图结构 | 速度快,召回率高 | 内存占用大 | 通用,大多数场景首选 |
| **IVF** | 倒排文件 | 内存友好,可调节 | 需要训练聚类 | 大规模数据(> 10M) |
| **PQ** | 乘积量化 | 超高压缩比 | 准确率下降 | 极端资源受限 |
| **SCANN** | 向量量化+ANNS | 平衡速度和精度 | 实现复杂 | Google 内部使用 |

### HNSW 算法详解

**核心思想**:像高速公路网一样分层

```
第 3 层:  ─────  节点稀疏,快速定位区域
           |
第 2 层:  ────┼────  节点适中,缩小范围
           |
第 1 层:  ─┬─┬─┼─┬─┬─  节点密集,精确搜索
           ↓
查询起点
```

**查询过程**:
1. 从顶层开始,快速移动到目标区域
2. 逐层下降,逐步细化
3. 底层精确搜索

**效果**:
- 不需要遍历所有节点
- 时间复杂度:O(log N)
- 百万级数据,毫秒级响应

**参数调优**:
```python
# HNSW 参数
ef_construction = 200  # 构建索引时搜索宽度(越大质量越高,构建越慢)
M = 16                # 每个节点的最大连接数

# 查询参数
ef_search = 100        # 查询时搜索范围(越大召回率越高,查询越慢)

# 经验值:
# 追求质量: ef_construction=400, M=32, ef_search=200
# 平衡模式: ef_construction=200, M=16, ef_search=100
# 追求速度: ef_construction=100, M=8,  ef_search=50
```

---

## 主流向量数据库对比

### 开源方案

#### 1. Chroma

**特点**:
- 🎯 **最简单易用**,3 行代码上手
- 🌐 纯 Python,无需额外服务
- 💾 支持多种后端(DuckDB、SQLite、PostgreSQL)

**适用场景**:原型开发、学习、小规模应用(< 100 万向量)

**代码示例**:
```python
import chromadb
from chromadb.config import Settings

# 创建客户端(内存模式)
client = chromadb.Client()

# 创建 collection
collection = client.create_collection(
    name="knowledge_base",
    metadata={"hnsw:space": "cosine"}
)

# 添加数据
collection.add(
    documents=["文档1", "文档2", "文档3"],
    embeddings=[[0.1, 0.2, ...], [0.3, 0.4, ...], ...],
    metadatas=[{"source": "pdf"}, {"source": "web"}, {"source": "pdf"}],
    ids=["doc1", "doc2", "doc3"]
)

# 查询
results = collection.query(
    query_embeddings=[[0.15, 0.25, ...]],
    n_results=2
)
```

**优势**:
- 零配置,开箱即用
- 与 LangChain/LlamaIndex 深度集成
- 支持持久化存储

**局限**:
- 性能不如专用向量库
- 大规模数据(> 1M)性能下降

#### 2. FAISS

**特点**:
- 🚀 Facebook 出品,性能顶尖
- 📦 只是一个库,不是完整数据库
- 🔧 需要自己管理存储和元数据

**适用场景**:大规模检索、对性能有极致要求

**代码示例**:
```python
import faiss
import numpy as np

# 准备数据
vectors = np.random.rand(100000, 768).astype('float32')  # 10 万个向量

# 创建索引(HNSW)
dimension = 768
index = faiss.IndexHNSWFlat(dimension, M=32)
index.hnsw.efConstruction = 200
index.add(vectors)

# 查询
query = np.random.rand(1, 768).astype('float32')
distances, indices = index.search(query, k=5)

print(f"最相似的 5 个文档 ID:{indices[0]}")
```

**优势**:
- 速度最快,性能最优
- 支持多种索引算法(IVF、PQ、HNSW)
- 支持GPU加速

**局限**:
- 需要自己实现元数据存储
- 没有原生 Python API(需通过 SWIG)

#### 3. Milvus

**特点**:
- 🏢 **企业级功能最全**
- 🔍 支持 10 种+索引类型
- 📊 内置监控和运维工具

**适用场景**:企业生产环境、大规模部署

**架构**:
```
┌─────────────┐
│  SDK        │ (Python/Go/Java)
└──────┬──────┘
       │
┌──────▼──────┐
│  Proxy      │ (负载均衡、路由)
└──────┬──────┘
       │
┌──────▼──────┐
│  Root Coord │ (管理元数据)
└──────┬──────┘
       │
┌──────▼──────┐
│  Data Node  │ (存储和索引)
└─────────────┘
```

**代码示例**:
```python
from pymilvus import MilvusClient

# 连接 Milvus
client = MilvusClient("http://localhost:19530")

# 创建 collection
client.create_collection(
    collection_name="kb",
    dimension=768,
    metric_type="COSINE"
)

# 插入数据
client.insert(
    collection_name="kb",
    data=[
        {"id": 1, "vector": [0.1, 0.2, ...], "text": "文档1", "source": "pdf"},
        {"id": 2, "vector": [0.3, 0.4, ...], "text": "文档2", "source": "web"},
    ]
)

# 搜索
results = client.search(
    collection_name="kb",
    data=[[0.15, 0.25, ...]],
    limit=5,
    output_fields=["text", "source"]
)
```

**优势**:
- 可扩展到 10 亿+ 向量
- 支持分布式部署
- 丰富的索引和查询选项
- 活跃的社区支持

**局限**:
- 部署复杂,需要运维
- 资源占用较大

#### 4. Qdrant

**特点**:
- ⚡ 用 Rust 编写,性能顶尖
- 🔌 API 设计优秀,易用性强
- 🎨 支持过滤、推荐等多场景

**适用场景**:性能敏感、需要高级查询功能

**代码示例**:
```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# 连接
client = QdrantClient("http://localhost:6333")

# 创建 collection
client.create_collection(
    collection_name="kb",
    vectors_config=VectorParams(size=768, distance=Distance.COSINE)
)

# 插入
client.upsert(
    collection_name="kb",
    points=[
        PointStruct(id=1, vector=[0.1, 0.2, ...], payload={"text": "文档1"}),
        PointStruct(id=2, vector=[0.3, 0.4, ...], payload={"text": "文档2"}),
    ]
)

# 搜索 + 过滤
results = client.search(
    collection_name="kb",
    query_vector=[0.15, 0.25, ...],
    query_filter={
        "must": [
            {"key": "source", "match": {"value": "pdf"}}
        ]
    },
    limit=5
)
```

### 托管方案

#### Pinecone

**特点**:
- ☁️ 全托管,零运维
- 🚀 性能优秀,可扩展
- 💰 付费方案(有免费 tier)

**定价**(2025):
| 方案 | 向量数量 | 价格 |
|------|----------|------|
| Starter | 10 万 | 免费 |
| Pod-based | 100 万-1 亿 | $70-700/月 |
| Serverless | 按使用付费 | $0.10-0.30/百万向量 |

**适用场景**:不想运维数据库,快速上线

**代码示例**:
```python
from pinecone import Pinecone, ServerlessSpec

# 初始化
pc = Pinecone(api_key="your-api-key")

# 创建 index
pc.create_index(
    name="kb",
    dimension=768,
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)

# 连接
index = pc.Index("kb")

# 插入
index.upsert([
    {"id": "1", "values": [0.1, 0.2, ...], "metadata": {"text": "文档1"}},
    {"id": "2", "values": [0.3, 0.4, ...], "metadata": {"text": "文档2"}},
])

# 查询
results = index.query(
    vector=[0.15, 0.25, ...],
    top_k=5,
    include_metadata=True
)
```

#### Weaviate

**特点**:
- 🧠 支持向量化模块集成(OpenAI、Cohere 等)
- 🔍 支持混合检索(向量+关键词)
- 🏢 开源+托管双重方案

**适用场景**:需要混合检索、多模态数据

---

## 选型指南

### 决策树

```
开始
  │
  ├─ 数据规模 < 100 万?
  │   └─ Yes → Chroma 或 FAISS
  │   └─ No  → 继续判断
  │
  ├─ 需要自己部署还是托管?
  │   ├─ 托管 → Pinecone
  │   └─ 自己部署 → 继续
  │
  ├─ 团队有运维能力?
  │   ├─ Yes → Milvus 或 Qdrant
  │   └─ No  → Chroma + PostgreSQL
  │
  └─ 需要高级功能(过滤、混合检索)?
      ├─ Yes → Weaviate 或 Qdrant
      └─ No  → FAISS(最快)
```

### 对比总结

| 数据库 | 易用性 | 性能 | 可扩展性 | 成本 | 推荐指数 |
|--------|--------|------|----------|------|----------|
| **Chroma** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | 免费 | ⭐⭐⭐⭐⭐ 原型首选 |
| **FAISS** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 免费 | ⭐⭐⭐⭐ 极致性能 |
| **Milvus** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 免费(自托管) | ⭐⭐⭐⭐⭐ 企业级 |
| **Qdrant** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 免费(自托管) | ⭐⭐⭐⭐⭐ 性能+易用 |
| **Pinecone** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 付费 | ⭐⭐⭐⭐ 快速上线 |
| **Weaviate** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 混合 | ⭐⭐⭐⭐ 混合检索 |

---

## 实战技巧

### 1. 元数据过滤

**问题**:有时候不仅需要语义相似,还需要满足特定条件。

**例子**:
```python
# 查询"2024年的产品发布"
# 只检索2024年的文档
results = client.search(
    collection_name="kb",
    query_vector=query_embedding,
    query_filter={
        "must": [
            {"key": "year", "match": {"value": 2024}},
            {"key": "category", "match": {"value": "product"}}
        ]
    },
    limit=5
)
```

**常见过滤场景**:
- 按日期范围:`"2024-01-01" <= date <= "2024-12-31"`
- 按文档类型:`source == "pdf"`
- 按权限等级:`access_level <= user_level`
- 按标签:`tags in ["tech", "tutorial"]`

### 2. 混合检索

**核心思想**:向量检索 + 关键词检索,取交集或加权融合。

**实现方法**:
```python
# 方法1:分别检索后合并
# 向量检索
vector_results = vector_search(query, top_k=20)

# 关键词检索
keyword_results = keyword_search(query, top_k=20)

# 融合(倒分融合 Reciprocal Rank Fusion)
def rrf fusion(vector_results, keyword_results, k=60):
    scores = {}
    for rank, doc in enumerate(vector_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1/(k + rank)

    for rank, doc in enumerate(keyword_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1/(k + rank)

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)[:5]

# 方法2:使用内置混合检索(Qdrant/Weaviate 支持)
results = client.search(
    collection_name="kb",
    query_vector=vector,
    query_text="产品发布 2024",  # 关键词
    hybrid_alpha=0.7,  # 0.7向量 + 0.3关键词
    limit=5
)
```

**效果**:研究表明,混合检索能提升 5-15% 的准确率[^2]。

### 3. 分片策略

**问题**:单机无法存储海量向量,需要分片。

**策略**:

| 策略 | 方法 | 优点 | 缺点 |
|------|------|------|------|
| **随机分片** | 文档随机分配到不同节点 | 负载均衡 | 需要查询所有节点 |
| **按类别分片** | 同类文档放同一节点 | 可精准过滤 | 数据倾斜 |
| **按时间分片** | 按日期范围分片 | 时序查询快 | 跨时间查询慢 |

**Milvus 分片示例**:
```python
client.create_collection(
    collection_name="kb",
    dimension=768,
    num_shards=4  # 4 个分片
)
```

### 4. 性能优化

**索引优化**:
```python
# Milvus:选择合适的索引类型
- HNSW:速度和召回率平衡(推荐)
- IVF_FLAT:内存受限场景
- IVF_PQ:极致压缩(牺牲准确率)

# 示例
index_params = {
    "index_type": "HNSW",
    "metric_type": "COSINE",
    "params": {
        "M": 16,
        "efConstruction": 200
    }
}
```

**查询优化**:
```python
# 1. 调整 ef_search
index.search(query, k=5, ef_search=100)  # 增加搜索范围

# 2. 批量查询
results = index.search_batch([query1, query2, query3], k=5)

# 3. 使用 GPU
index = faiss.index_cpu_to_all_gpus(index)
```

**存储优化**:
```python
# 向量量化
quantizer = faiss.IndexFlatL2(768)
index = faiss.IndexIVFPQ(quantizer, 768, 100, 8, 8)
# 压缩比: 4字节(float32) → 1字节(uint8)
```

### 5. 监控指标

**关键指标**:

| 指标 | 说明 | 目标值 |
|------|------|--------|
| **召回率** | top-k 中相关文档占比 | > 90% |
| **查询延迟** | 单次查询响应时间 | < 100ms |
| **吞吐量** | 每秒处理查询数 | > 100 QPS |
| **存储占用** | 向量+索引大小 | < 1TB(1000万向量) |

**监控代码**(Milvus):
```python
from pymilvus import utility

# 获取 collection 统计
stats = client.get_collection_stats("kb")
print(f"向量数量:{stats['num_vectors']}")
print(f"索引大小:{stats['index_size']} MB")

# 查询性能测试
import time

start = time.time()
results = client.search(...)
latency = (time.time() - start) * 1000
print(f"查询延迟:{latency:.2f} ms")
```

---

## 常见问题

### Q1: 向量数据库需要专门的硬件吗?

**不一定**:
- **小规模**(< 100 万向量):普通云服务器(4 核 8G)足够
- **中等规模**(100 万-1000 万):建议 16 核 32G + SSD
- **大规模** (> 1000 万):需要 GPU 加速 + 分布式集群

**成本估算**(100 万向量,768 维):
- 存储空间:约 3GB(原始向量) + 6GB(索引) = 9GB
- 内存:建议 16GB(索引常驻内存)
- CPU:8 核足以

### Q2: 为什么检索结果有时不理想?

**可能原因**:
1. **嵌入模型不合适**:领域不匹配
2. **分块策略不当**:语义被破坏
3. **查询质量问题**:用户表述模糊
4. **索引参数不当**:ef_search 太小

**排查方法**:
```python
# 1. 检查相似度分数
results = collection.query(...)
for result in results:
    print(f"相似度:{result['distance']:.3f}, 文档:{result['text']}")
# 如果所有分数都很低(< 0.7),可能是模型问题

# 2. 检查检索数量
results = collection.query(..., n_results=10)  # 增加到 10
# 观察相关文档是否排在后面

# 3. 调整查询
query_rewritten = rewrite_query(original_query)  # 查询重写
results = collection.query(query_embeddings=[embed(query_rewritten)])
```

### Q3: 如何备份和恢复向量数据库?

**Chroma**:
```python
# 导出
client.persist(path="./backup")

# 恢复
client = chromadb.Client(settings=chromadb.Settings(
    persist_directory="./backup"
))
```

**Milvus**:
```bash
# 备份
milvus-backup create -n my_backup -c kb

# 恢复
milvus-backup restore -n my_backup -c kb
```

---

## 思考题

::: info 实践项目
1. **搭建向量数据库**:
   - 选择一个向量库(推荐 Chroma 或 Qdrant)
   - 下载 100 篇中文文档(新闻、博客等)
   - 分块、向量化、存储
   - 实现 5 个查询,评估结果质量

2. **性能对比**:
   - 同样的数据集(1 万、10 万、100 万向量)
   - 测试不同数据库的查询延迟
   - 绘制性能对比曲线图

3. **混合检索实现**:
   - 实现向量检索 + BM25 关键词检索
   - 用 RRF 算法融合结果
   - 对比纯向量检索和混合检索的效果差异
:::

---

## 本节小结

通过本节学习,你应该掌握了:

✅ **向量数据库的作用**
- 高效存储和检索高维向量
- 支持近似最近邻搜索(ANN)
- 与传统数据库互补

✅ **核心算法**
- HNSW:分层图结构,平衡速度和准确率
- IVF、PQ:不同场景的优化策略

✅ **产品选型**
- 小规模/原型:Chroma
- 企业级:Milvus、Qdrant
- 托管服务:Pinecone
- 极致性能:FAISS

✅ **实战技巧**
- 元数据过滤
- 混合检索
- 分片策略
- 性能优化

---

**下一步**:在[下一节](/basics/05-rag-knowledge/05-advanced-rag)中,我们会学习高级 RAG 技术,包括混合检索、重排序、Agent RAG 等,让你的系统达到生产级水准。

---

[← 返回模块目录](/basics/05-rag-knowledge) | [继续学习:进阶 RAG →](/basics/05-rag-knowledge/05-advanced-rag)

---

[^1]: HNSW (Hierarchical Navigable Small World):Malkov, Y. A., & Yashunin, D. A. (2018). "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs"
[^2]: "Mixtape: A Simple Approach to Robust and Efficient Dense + Sparse Retrieval", Google Research 2023
