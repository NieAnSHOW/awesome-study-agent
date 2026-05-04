# 进阶 RAG 技术

> **学习目标**:掌握高级 RAG 技术,构建生产级系统
>
> **预计时间**:90 分钟
>
> **难度等级**:⭐⭐⭐⭐☆

---

## 从基础到进阶

前面的章节我们学习了标准 RAG 流程,它能解决很多问题,但在实际生产环境中,你可能会遇到这些挑战:

| 问题 | 现象 | 标准RAG表现 | 需要的技术 |
|------|------|------------|-----------|
| **检索不精准** | 答案相关的文档没被检索到 | 准确率 60-70% | 查询重写、混合检索 |
| **答案质量差** | LLM 使用了不相关的内容 | 幻觉、答非所问 | 重排序、过滤 |
| **多跳推理** | 需要多个文档综合信息 | 无法完成 | Agent RAG、迭代检索 |
| **长文档处理** | 书籍、长报告 | 上下文超出限制 | 层级索引、摘要 |
| **数据实时性** | 新闻、动态内容 | 信息过时 | 增量更新、网络检索 |
| **多模态数据** | 图文混合、表格 | 无法处理 | 多模态嵌入 |

本章会逐一介绍这些高级技术。

---

## 查询优化

### 查询重写(Query Rewriting)

**核心思想**:用户的原始问题可能表述不清,通过重写提升检索质量。

**方法1:LLM 重写**
```python
def rewrite_query(original_query, llm):
    prompt = f"""
    你是一个查询优化专家。请将用户的查询改写成更适合检索的版本。

    原始查询:{original_query}

    改写要求:
    1. 补充缺失的上下文
    2. 明确模糊的指代
    3. 添加相关关键词
    4. 保持简洁(不超过20字)

    改写后的查询:
    """

    rewritten = llm.invoke(prompt).content.strip()
    return rewritten

# 例子
original = "怎么申请?"
rewritten = rewrite_query(original, llm)
# 输出:"公司年假申请流程和所需材料"
```

**方法2:多查询生成**
```python
def generate_multiple_queries(query, llm, n=3):
    prompt = f"""
    为以下查询生成 {n} 个不同角度的改写版本,以提升检索覆盖度。

    原始查询:{query}

    改写版本(每行一个):
    """

    result = llm.invoke(prompt).content.strip()
    queries = [query] + result.split('\n')[:n]
    return queries

# 对每个查询检索,然后合并结果
queries = generate_multiple_queries("公司报销政策")
all_results = []
for q in queries:
    results = vector_search(q, top_k=3)
    all_results.extend(results)

# 去重和排序
unique_results = deduplicate_and_rank(all_results)
```

**方法3:查询扩展(同义词、领域术语)**
```python
def expand_query(query, domain_dict):
    """添加领域相关词汇"""

    # 检查是否有领域术语
    for term, synonyms in domain_dict.items():
        if term in query:
            query += f" {synonyms}"

    # 示例:医疗领域
    domain_dict = {
        "感冒": "流感 上呼吸道感染",
        "头痛": "头疼 偏头痛 脑痛"
    }

    return query

# 例子
query = "感冒怎么办?"
expanded = expand_query(query, medical_dict)
# 输出:"感冒怎么办? 流感 上呼吸道感染"
```

### 查询-文档对比优化

**问题**:查询和文档的风格、长度差异大,影响相似度计算。

**解决方案**:HyDE(Hypothetical Document Embeddings)[^1]

**核心思想**:让 LLM 先生成一个"假设性答案",然后用这个答案去检索。

```python
def hyde_retrieval(query, llm, retriever):
    # 1. 生成假设性答案
    prompt = f"""
    请为以下问题生成一个详细、准确的答案(即使是编造的)。
    目的是为了用这个答案找到相似的文档。

    问题:{query}

    假设性答案:
    """

    hypothetical_answer = llm.invoke(prompt).content.strip()

    # 2. 用假设性答案检索
    results = retriever.retrieve(hypothetical_answer, top_k=5)

    # 3. 返回检索结果
    return results

# 例子
query = "公司年假怎么算?"
hypothetical = "根据公司规定,员工入职满一年可享受5天年假,满十年15天..."
# 用这个假设性答案去检索,能找到更相关的政策文档
```

**效果**:研究表明,HyDE 能提升 10-20% 的检索准确率[^2]。

---

## 检索后处理

### 重排序(Reranking)

**核心思想**:先检索大量候选文档(如 top-100),再用精准模型重新排序。

**为什么需要**?
- 向量检索是近似搜索,可能遗漏相关文档
- 交叉编码器(Cross-Encoder)更精准,但计算成本高
- 两阶段:快速召回 + 精准排序

**代码示例**:
```python
from sentence_transformers import CrossEncoder

# 1. 第一阶段:向量检索(快速召回大量候选)
candidates = vector_search(query, top_k=100)

# 2. 第二阶段:重排序(精准排序)
reranker = CrossEncoder('BAAI/bge-reranker-large')

# 准备 (query, document) 对
pairs = [(query, doc.text) for doc in candidates]

# 计算分数
scores = reranker.predict(pairs)

# 排序
reranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
final_results = [doc for doc, score in reranked[:5]]

print(f"重排序后的 top-5:{[doc.metadata for doc in final_results]}")
```

**主流重排序模型**:

| 模型 | 特点 | 性能 | 速度 |
|------|------|------|------|
| **bge-reranker-large** | 中文效果顶尖 | ⭐⭐⭐⭐⭐ | 慢 |
| **bge-reranker-base** | 平衡性能和速度 | ⭐⭐⭐⭐ | 中等 |
| **Cohere Rerank v3** | 商业 API,多语言 | ⭐⭐⭐⭐⭐ | 快 |
| **flashrank** | 极速,本地部署 | ⭐⭐⭐ | 最快 |

**性能权衡**:
```python
# 选项1:只用向量检索
latency = 50ms  # 毫秒
accuracy = 65%

# 选项2:向量检索 + 轻量级重排序
latency = 50ms + 100ms = 150ms
accuracy = 75%

# 选项3:向量检索 + 顶级重排序
latency = 50ms + 500ms = 550ms
accuracy = 82%

# 建议:
# - 对延迟敏感:选项1或2
# - 追求准确率:选项3
```

### 过滤和去重

**内容过滤**:
```python
def filter_results(results, query, threshold=0.7):
    """过滤掉相似度过低的结果"""

    filtered = []
    for result in results:
        if result.score > threshold:
            # 检查内容是否真的相关
            if is_relevant(result.text, query):
                filtered.append(result)

    return filtered

def is_relevant(text, query):
    """用 LLM 判断相关性"""

    prompt = f"""
    判断以下文档是否与查询相关。

    查询:{query}
    文档:{text[:200]}...

    只回答"是"或"否":
    """

    response = llm.invoke(prompt).content.strip()
    return response == "是"
```

**去重**:
```python
def deduplicate_results(results, similarity_threshold=0.95):
    """去掉重复或高度相似的文档"""

    unique = []
    for result in results:
        is_duplicate = False

        for existing in unique:
            # 计算相似度
            sim = cosine_similarity(
                embed(result.text),
                embed(existing.text)
            )

            if sim > similarity_threshold:
                is_duplicate = True
                break

        if not is_duplicate:
            unique.append(result)

    return unique
```

---

## 混合检索

### 向量 + 关键词检索

**核心思想**:结合语义理解和精确匹配。

**实现方法1:倒分融合(RRF)**
```python
def reciprocal_rank_fusion(vector_results, keyword_results, k=60):
    """
    RRF 算法:融合多个检索结果

    Args:
        vector_results: 向量检索结果
        keyword_results: 关键词检索结果
        k: 常数,控制排名影响(通常 60)

    Returns:
        融合后的结果
    """

    scores = {}

    # 处理向量检索结果
    for rank, doc in enumerate(vector_results):
        doc_id = doc.id
        scores[doc_id] = scores.get(doc_id, 0) + 1/(k + rank)

    # 处理关键词检索结果
    for rank, doc in enumerate(keyword_results):
        doc_id = doc.id
        scores[doc_id] = scores.get(doc_id, 0) + 1/(k + rank)

    # 按分数排序
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    return ranked[:5]

# 使用
vector_res = vector_search(query, top_k=50)
keyword_res = bm25_search(query, top_k=50)
final = reciprocal_rank_fusion(vector_res, keyword_res)
```

**实现方法2:加权融合**
```python
def weighted_fusion(vector_results, keyword_results, alpha=0.7):
    """
    加权融合:alpha * 向量分数 + (1-alpha) * 关键词分数
    """

    # 归一化分数到 [0, 1]
    vector_scores = normalize([r.score for r in vector_results])
    keyword_scores = normalize([r.score for r in keyword_results])

    # 融合
    final_scores = {}
    for doc, v_score in zip(vector_results, vector_scores):
        final_scores[doc.id] = alpha * v_score

    for doc, k_score in zip(keyword_results, keyword_scores):
        if doc.id in final_scores:
            final_scores[doc.id] += (1 - alpha) * k_score
        else:
            final_scores[doc.id] = (1 - alpha) * k_score

    # 排序
    ranked = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)
    return ranked[:5]
```

**性能对比**[^3]:
| 方法 | 准确率 | 延迟 | 推荐度 |
|------|--------|------|--------|
| 纯向量检索 | 68% | 50ms | ⭐⭐⭐ |
| 纯关键词检索 | 55% | 30ms | ⭐⭐ |
| 混合检索(RRF) | 79% | 80ms | ⭐⭐⭐⭐⭐ |
| 混合检索(加权) | 77% | 80ms | ⭐⭐⭐⭐ |

---

## 高级 RAG 架构

### 1. 自适应 RAG(Self-RAG)[^4]

**核心思想**:让 LLM 自己判断是否需要检索、检索结果是否相关、是否需要重新检索。

```python
def self_rag(query, llm, retriever, max_iterations=3):
    """
    Self-RAG 流程
    """

    iteration = 0

    while iteration < max_iterations:
        # 1. 判断是否需要检索
        should_retrieve = llm.should_retrieve(query)
        if not should_retrieve:
            return llm.generate(query)

        # 2. 检索
        docs = retriever.retrieve(query, top_k=5)

        # 3. 评估检索质量
        is_relevant = llm.evaluate_relevance(query, docs)

        if not is_relevant:
            # 检索结果不相关,重写查询
            query = llm.rewrite_query(query)
            iteration += 1
            continue

        # 4. 生成答案
        answer = llm.generate_with_context(query, docs)

        # 5. 评估答案质量
        is_supported = llm.verify_support(answer, docs)

        if is_supported:
            return answer
        else:
            # 答案无依据,重新检索
            query = llm.expand_query(query)
            iteration += 1

    return "抱歉,我无法找到相关信息。"
```

**效果**:在需要多跳推理的任务上,准确率提升 15-25%。

### 2. Agent RAG

**核心思想**:让 Agent 自主决定检索策略,而不是固定流程。

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool

# 定义检索工具
def search_company_docs(query: str) -> str:
    """搜索公司文档"""
    results = vector_search(query, index="company_docs", top_k=3)
    return "\n".join([r.text for r in results])

def search_public_web(query: str) -> str:
    """搜索公开网页"""
    results = web_search(query, num_results=3)
    return "\n".join([r.snippet for r in results])

def search_codebase(query: str) -> str:
    """搜索代码库"""
    results = vector_search(query, index="code", top_k=3)
    return "\n".join([r.text for r in results])

# 创建工具列表
tools = [
    Tool(
        name="SearchDocs",
        func=search_company_docs,
        description="搜索公司内部文档,包括政策、手册等"
    ),
    Tool(
        name="SearchWeb",
        func=search_public_web,
        description="搜索公开网页,获取最新信息"
    ),
    Tool(
        name="SearchCode",
        func=search_codebase,
        description="搜索代码库,查找函数和类"
    )
]

# 创建 Agent
agent = create_react_agent(
    llm=ChatOpenAI(model="gpt-4"),
    tools=tools,
    prompt="""你是一个智能助手。用户会问你问题,你需要:
    1. 分析问题类型
    2. 选择合适的检索工具
    3. 基于检索结果生成准确答案

    可用工具:{tools}
    """
)

# 执行
agent_executor = AgentExecutor(agent=agent, tools=tools)
response = agent_executor.invoke({"input": "公司的年假政策是什么?如果找不到,搜索最新的劳动法规定"})
```

**优势**:
- ✅ 灵活应对不同类型的问题
- ✅ 可以使用多个数据源
- ✅ 支持多步推理

### 3. 层级 RAG(Hierarchical RAG)

**问题**:处理长文档(书籍、长报告)

**方案**:
```
层级结构:
Level 1: 文档摘要
    ↓ (检索到相关章节)
Level 2: 章节内容
    ↓ (检索到具体段落)
Level 3: 详细内容
```

**实现**:
```python
def hierarchical_retrieval(query, hierarchy):
    """
    层级检索

    hierarchy: {
        "doc_id": {
            "summary": "文档摘要",
            "chapters": {
                "chapter1": {
                    "summary": "章节摘要",
                    "chunks": ["段落1", "段落2", ...]
                },
                ...
            }
        }
    }
    """

    # 1. 检索最相关的文档
    doc = retrieve_from_summaries(query, hierarchy, top_k=1)

    # 2. 在该文档中检索最相关的章节
    chapter = retrieve_from_chapters(query, doc["chapters"], top_k=1)

    # 3. 在该章节中检索详细内容
    chunks = retrieve_from_chunks(query, chapter["chunks"], top_k=5)

    return chunks

# 例子
query = "如何安装Python?"
# Level 1: 检索到《Python入门指南》
# Level 2: 检索到"第2章:环境搭建"
# Level 3: 检索到具体安装步骤
```

### 4. 联合检索 RAG(Fusion RAG)

**场景**:需要整合多个信息源

```python
def fusion_retrieval(query, sources):
    """
    从多个源检索并融合

    sources: [
        {"name": "内部文档", "index": internal_db},
        {"name": "公开网页", "index": web_db},
        {"name": "学术论文", "index": papers_db}
    ]
    """

    all_results = []

    for source in sources:
        # 从每个源检索
        results = source["index"].search(query, top_k=5)

        # 标注来源
        for r in results:
            r.metadata["source"] = source["name"]

        all_results.extend(results)

    # 全局重排序
    reranked = global_rerank(query, all_results)

    # 确保多样性(不同源都有代表)
    diverse = diversify_results(reranked)

    return diverse[:5]
```

---

## 多模态 RAG

### 处理图文混合内容

**场景**:技术文档、图表、表格

**方法1:OCR + 文本 RAG**
```python
import pytesseract
from PIL import Image

# 图片转文字
def extract_text_from_image(image_path):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image, lang='chi_sim+eng')
    return text

# 表格提取
from tabula import read_pdf

def extract_tables(pdf_path):
    tables = read_pdf(pdf_path, pages='all', multiple_tables=True)
    return tables

# 使用 RAG
text = extract_text_from_image("chart.png")
results = vector_search("解释这个图表", context=[text])
```

**方法2:多模态嵌入模型**
```python
from sentence_transformers import SentenceTransformer

# 使用多模态模型
model = SentenceTransformer('clip-ViT-B-32')  # 图文对比模型

# 图片和文本都能编码
image_embedding = model.encode(Image.open('chart.png'))
text_embedding = model.encode("这是一个折线图")

# 计算相似度
sim = cosine_similarity(image_embedding, text_embedding)
```

---

## 性能优化

### 缓存策略

```python
from functools import lru_cache
import hashlib

class CachedRAG:
    def __init__(self, retriever, llm):
        self.retriever = retriever
        self.llm = llm
        self.cache = {}  # 查询缓存

    def query(self, question):
        # 1. 检查缓存
        cache_key = hashlib.md5(question.encode()).hexdigest()
        if cache_key in self.cache:
            print("从缓存返回")
            return self.cache[cache_key]

        # 2. 检索
        docs = self.retriever.retrieve(question)

        # 3. 生成
        answer = self.llm.generate(question, docs)

        # 4. 存入缓存
        self.cache[cache_key] = answer

        return answer

# 使用 LRU 缓存
@lru_cache(maxsize=1000)
def cached_retrieve(query):
    return retriever.retrieve(query)
```

### 批量查询

```python
def batch_query(queries, retriever, llm, batch_size=8):
    """批量处理多个查询"""

    all_answers = []

    for i in range(0, len(queries), batch_size):
        batch = queries[i:i+batch_size]

        # 批量检索
        all_docs = [retriever.retrieve(q) for q in batch]

        # 批量生成
        answers = llm.generate_batch(batch, all_docs)

        all_answers.extend(answers)

    return all_answers
```

---

## 思考题

::: info 实践挑战
1. **实现混合检索**:
   - 选择 RRF 或加权融合
   - 对比纯向量检索和混合检索的效果
   - 记录准确率、延迟的变化

2. **实现重排序**:
   - 选择一个重排序模型(bge-reranker 或 Cohere)
   - 对比重排序前后的 top-5 结果
   - 分析哪些类型的查询提升最大

3. **搭建 Agent RAG**:
   - 定义 3 个不同的检索工具
   - 创建一个简单的 ReAct Agent
   - 测试多步推理问题
:::

---

## 本节小结

通过本节学习,你应该掌握了:

✅ **查询优化**
- 查询重写、多查询生成
- HyDE 假设性文档嵌入
- 查询扩展(同义词、领域术语)

✅ **检索后处理**
- 重排序(Cross-Encoder)
- 内容过滤、去重

✅ **混合检索**
- 向量 + 关键词融合
- RRF、加权融合算法

✅ **高级架构**
- 自适应 RAG(Self-RAG)
- Agent RAG
- 层级 RAG
- 联合检索 RAG

✅ **多模态支持**
- OCR 处理图片
- 表格提取
- 多模态嵌入模型

✅ **性能优化**
- 缓存策略
- 批量查询

---

**下一步**:在[下一节](/ai-basics/05-rag-knowledge/06-rag-practice)中,我们会从头到尾实现一个完整的 RAG 项目,整合所学知识。

---

[← 返回模块目录](/ai-basics/05-rag-knowledge) | [继续学习:RAG 实践 →](/ai-basics/05-rag-knowledge/06-rag-practice)

---

[^1]: Gao, L., et al. (2022). "Precise Zero-Shot Dense Retrieval without Relevance Labels"
[^2]: "Query Understanding for Enhanced Retrieval: A Survey" (2024)
[^3]: "Hybrid Search Effectiveness in Modern Search Engines" (2023)
[^4]: "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection" (2023)
