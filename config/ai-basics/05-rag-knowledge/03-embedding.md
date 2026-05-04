# 向量化

> **学习目标**:深入理解文本向量化的原理、方法和实践技巧
>
> **预计时间**:70 分钟
>
> **难度等级**:⭐⭐⭐☆☆

---

## 核心概念

### 什么是向量化(Embedding)?

**向量化**(也叫嵌入,Embedding)是将文本转换成数字向量(一组有序的数字)的技术。这些向量捕获了文本的语义信息——**语义相近的文本,它们的向量在空间中距离更近**。

::: tip 通俗理解
想象在一个巨大的三维空间中:
- "猫"和"狗"都在"动物"这个区域
- "苹果"和"香蕉"在"水果"区域
- "电脑"和"手机"在"电子产品"区域

虽然我们画不出几千维的空间,但计算机可以!向量化就是给每个词或句子在这个高维空间中找到坐标。
:::

### 为什么需要向量化?

计算机不能直接理解文字,只能处理数字。传统方法(如独热编码 One-hot)的问题:

| 方法 | "猫"的表示 | "狗"的表示 | 问题 |
|------|-----------|-----------|------|
| **独热编码** | [1, 0, 0, ...] | [0, 1, 0, ...] | 无法表示相似度,所有词之间距离相等 |
| **Word2Vec** | [0.2, -0.5, 0.8, ...] | [0.3, -0.4, 0.7, ...] | ✅ 语义相近的向量距离更近 |

**向量化的优势**:
1. **语义理解**:计算"猫"和"狗"的相似度 > "猫"和"汽车"
2. **高维空间**:成百上千个维度,捕获细微差异
3. **下游任务**:相似度搜索、聚类、分类等

---

## 向量化技术的发展

### 第一代:静态词向量(2013)

**代表模型**:Word2Vec、GloVe、FastText

**核心思想**:每个词用一个固定向量表示。

**局限性**:
- **一词多义**:"苹果"(水果)和"苹果"(公司)向量相同
- **上下文无关**:不考虑词在句子中的位置和语境

**例子**:
```python
# Word2Vec 时代的简化示例
word_vectors = {
    "苹果": [0.5, -0.2, 0.8, ...],
    "香蕉": [0.6, -0.1, 0.7, ...],
    "公司": [0.1, 0.9, -0.3, ...]
}

# 问题:无法区分不同含义
similarity("苹果", "香蕉")  # 高相似度(都是水果)
similarity("苹果", "公司")  # 低相似度
# 但如果句子是"苹果公司发布新产品",这是不对的!
```

### 第二代:上下文相关向量(2018)

**代表模型**:BERT、RoBERTa

**突破**:
- 根据上下文动态生成向量
- "苹果"在不同句子中有不同表示

**例子**:
```
句子1:"我吃了一个[苹果]" → 苹果的向量倾向于"水果"
句子2:"[苹果]公司发布了新品" → 苹果的向量倾向于"科技公司"
```

**缺点**:每个词需要独立计算,速度慢,不适合大规模检索。

### 第三代:句子级嵌入(2019-至今)

**代表模型**:SBERT、E5、BGE、OpenAI Embeddings

**创新**:
- 直接对整个句子/段落编码
- 一次生成固定维度向量
- 专为语义检索优化

**现在的标准**:RAG 系统中使用的都是这类模型。

---

## 嵌入模型的工作原理

### Transformer 架构核心

现代嵌入模型都基于 Transformer,关键组件:

```
输入文本 → Token 分词 → 编码层 → 注意力机制 → 输出向量
                ↓
       ["我", "爱", "编程"]
                ↓
      [101, 202, 303] (token IDs)
                ↓
    [0.2, -0.5, 0.8, ...] (768/1024/1536 维向量)
```

### 自注意力机制

**为什么叫"注意力"?**

模型在生成某个词的表示时,会"关注"句子中的其他相关词。

**例子**:
```
句子:"这家餐厅的食物很好,但服务很差。"

编码"服务"这个词时,模型会:
- 强烈关注"餐厅"(相关名词)
- 强烈关注"差"(形容词)
- 较少关注"食物"(距离远且语义不相关)
```

**数学直观**:
```
注意力权重 = 相似度(当前词, 其他词)

注意力(服务, 餐厅) = 0.8  (高度相关)
注意力(服务, 食物) = 0.1  (弱相关)
注意力(服务, 差)   = 0.9  (修饰关系)
```

### 向量如何捕获语义?

通过海量文本训练,模型学会了将语义相关的词映射到相近的向量。

**训练目标**:
```
正样本对:[输入:"如何申请年假?", 正确答案:"请参考员工手册 3.2 节"]
负样本对:[输入:"如何申请年假?", 负例:"今天的天气很好"]

模型目标:
- 让正样本对的向量距离尽可能近
- 让负样本对的向量距离尽可能远
```

**训练数据规模**:
- 小模型:百万级句子对
- 大模型:十亿级句子对(如 OpenAI embeddings)

---

## 主流嵌入模型对比

### 评价指标

| 指标 | 说明 | 重要程度 |
|------|------|----------|
| **MTEB 评分** | 多任务嵌入基准测试,涵盖检索、分类等 | ⭐⭐⭐⭐⭐ |
| **检索准确率** | 找到相关文档的能力(RAG 最核心) | ⭐⭐⭐⭐⭐ |
| **推理速度** | 单位时间处理文本数量 | ⭐⭐⭐ |
| **向量维度** | 影响存储和计算成本 | ⭐⭐⭐ |
| **上下文长度** | 单次能处理的最大文本长度 | ⭐⭐ |
| **成本** | API 费用或本地部署成本 | ⭐⭐⭐⭐ |

### 英文模型

| 模型 | 维度 | MTEB 得分[^1] | 特点 | 推荐场景 |
|------|------|--------------|------|----------|
| **text-embedding-3-small** | 1536 | 62.1 | OpenAI 最新,性价比高 | 英文为主,追求平衡 |
| **text-embedding-3-large** | 3072 | 64.8 | OpenAI 旗舰,性能最强 | 预算充足,要求最高质量 |
| **e5-large-v2** | 1024 | 60.3 | 多语言支持好 | 多语言环境 |
| **bge-large-en-v1.5** | 1024 | 63.1 | 开源英文最强 | 本地部署,性能敏感 |
| **jina-embeddings-v2-base** | 768 | 59.1 | 支持 8K 上下文 | 长文档处理 |

### 中文模型

| 模型 | 维度 | C-MTEB 得分[^2] | 特点 | 推荐场景 |
|------|------|----------------|------|----------|
| **bge-large-zh-v1.5** | 1024 | 70.1 | 中文效果顶尖 | 中文为主的 RAG |
| **bge-small-zh-v1.5** | 512 | 66.3 | 轻量级,速度快 | 资源受限环境 |
| **m3e-base** | 768 | 64.5 | 社区常用 | 通用中文场景 |
| **text-embedding-3-small** | 1536 | 65.8 | 中英双语均衡 | 中英混合内容 |

### 多语言模型

| 模型 | 支持语言 | 特点 |
|------|----------|------|
| **bge-m3** | 100+ | 支持 8192 上下文,多语言顶尖 |
| **e5-mistral-7b** | 90+ | 基于 Mistral,性能强但计算量大 |
| **Cohere embed-v3** | 100+ | 商业 API,支持优化检索 |

::: tip 选择建议
- **纯中文**:bge-large-zh-v1.5
- **纯英文**:text-embedding-3-small 或 bge-large-en-v1.5
- **多语言**:bge-m3 或 text-embedding-3-large
- **长文档**:jina-embeddings-v2-base (8K) 或 bge-m3 (8K)
- **本地部署**:BGE 系列(开源、性能强)
- **最省事**:OpenAI embeddings(API 稳定、效果好)
:::

---

## 实践指南

### 使用 OpenAI Embeddings

```python
from langchain_openai import OpenAIEmbeddings

# 初始化
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    # dimensions=512  # 可选:降低维度减少成本
)

# 单个文本向量化
text = "RAG 是检索增强生成技术"
vector = embeddings.embed_query(text)
print(f"向量维度:{len(vector)}")  # 1536

# 批量向量化(更快)
texts = ["文本1", "文本2", "文本3"]
vectors = embeddings.embed_documents(texts)

# 成本估算
# text-embedding-3-small: $0.02 / 1M tokens
# 1000 个中文句子(平均 50 字) ≈ 0.001 USD
```

### 使用开源模型(HuggingFace)

```python
from langchain_community.embeddings import HuggingFaceEmbeddings

# 方法1:使用 Transformer 库(本地运行)
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-large-zh-v1.5",
    model_kwargs={'device': 'cuda'},  # 使用 GPU
    encode_kwargs={'normalize_embeddings': True}  # 归一化(使用余弦相似度)
)

# 方法2:使用推理 API(更快)
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-large-zh-v1.5",
    huggingfacehub_api_token="your_token"
)

# 使用
vector = embeddings.embed_query("测试文本")
```

**性能优化**:
```python
# 1. 批量处理
texts = ["文本1", "文本2", ..., "文本100"]
vectors = embeddings.embed_documents(texts)  # 比循环快 10x

# 2. GPU 加速
model_kwargs = {
    'device': 'cuda',  # NVIDIA GPU
    # 或 'mps' (Mac M1/M2)
    # 或 'cpu' (兼容性最好,最慢)
}

# 3. 量化(减少显存)
model_kwargs = {
    'device': 'cuda',
    'load_in_8bit': True  # 8位量化
}

# 4. 模型缓存(重复查询)
from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_embed(text):
    return embeddings.embed_query(text)
```

### 使用 Jina AI Embeddings

```python
from langchain_community.embeddings import JinaEmbeddings

embeddings = JinaEmbeddings(
    model_name="jina-embeddings-v2-base-zh",  # 中文模型
    jina_api_key="your_api_key"
)

# Jina 的优势:
# 1. 支持 8K 上下文
# 2. 免费 tier: 每月 40万 tokens
# 3. 响应速度快
```

---

## 相似度计算

### 余弦相似度(推荐)

**公式**:
```
similarity = cos(A, B) = (A · B) / (||A|| × ||B||)

其中:
A · B = Σ(Ai × Bi)  (点积)
||A|| = √(ΣAi²)      (向量长度)
```

**直观理解**:
- 只看方向,不看长度
- 值域:[-1, 1],1 表示完全相同
- RAG 中通常用余弦相似度

**代码实现**:
```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# 方法1:使用 sklearn
sim = cosine_similarity([vec1], [vec2])[0][0]

# 方法2:手动实现
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

sim = cosine_sim(vec1, vec2)
print(f"相似度:{sim:.3f}")  # 输出:0.856
```

### 欧氏距离

**公式**:
```
distance = -√(Σ(Ai - Bi)²)

注意:前面加负号,因为距离越小越相似
```

**适用场景**:
- 需要考虑向量长度
- 某些向量数据库只支持距离度量

**代码**:
```python
from scipy.spatial.distance import euclidean

distance = euclidean(vec1, vec2)
similarity = -distance  # 转换成相似度
```

### 点积

**公式**:
```
similarity = A · B = Σ(Ai × Bi)
```

**适用条件**:
- 向量已经归一化(长度为 1)
- 此时点积 = 余弦相似度

**代码**:
```python
import numpy as np

# 归一化
vec1_norm = vec1 / np.linalg.norm(vec1)
vec2_norm = vec2 / np.linalg.norm(vec2)

# 点积
sim = np.dot(vec1_norm, vec2_norm)
```

---

## 向量化最佳实践

### 1. 查询和文档使用相同模型

❌ **错误**:
```python
query_vec = model1.embed_query("查询")
doc_vec = model2.embed_query("文档")  # 不同模型!
sim = cosine_sim(query_vec, doc_vec)   # 无意义
```

✅ **正确**:
```python
embeddings = HuggingFaceEmbeddings(model_name="bge-large-zh-v1.5")

query_vec = embeddings.embed_query("查询")
doc_vec = embeddings.embed_query("文档")
sim = cosine_sim(query_vec, doc_vec)
```

### 2. 特殊指令优化

某些模型支持给查询和文档加特殊前缀,提升效果:

```python
# BGE 模型推荐
def embed_with_instruction(text, is_query=False):
    if is_query:
        text = "为这个句子生成表示以用于检索相关文章:" + text
    return embeddings.embed_query(text)

query_vec = embed_with_instruction("如何申请年假?", is_query=True)
doc_vec = embed_with_instruction("员工手册3.2节:年假申请流程", is_query=False)
```

### 3. 降维策略

高维度(3072)占用更多存储和计算资源,可以适当降低:

```python
# OpenAI embeddings 支持指定维度
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-large",
    dimensions=512  # 从 3072 降到 512
)
```

**权衡**:
| 维度 | 存储 | 速度 | 准确率 | 推荐场景 |
|------|------|------|--------|----------|
| 256 | 最小 | 最快 | 下降 10-15% | 资源极度受限 |
| 512 | 小 | 快 | 下降 5-8% | 一般场景推荐 |
| 1024 | 中等 | 中等 | 基准 | 大多数开源模型 |
| 1536+ | 大 | 慢 | +2-5% | 追求极致性能 |

### 4. 批量处理优化

```python
def batch_embed(texts, batch_size=32):
    """批量向量化,提升速度"""
    all_vectors = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        vectors = embeddings.embed_documents(batch)
        all_vectors.extend(vectors)
    return all_vectors

# 使用
texts = [f"文档{i}" for i in range(1000)]
vectors = batch_embed(texts, batch_size=64)
```

---

## 常见问题

### Q1: 为什么相似度高的文本,有时候感觉不相关?

**原因**:
1. **嵌入模型领域不匹配**:用通用模型处理专业术语(医学术语、法律条文)
2. **分块破坏语义**:"公司的年假政策"被切成"公司的"和"年假政策"
3. **多义词问题**:"苹果"可能是水果或公司

**解决方案**:
```python
# 1. 使用领域专用模型
embeddings = HuggingFaceEmbeddings(
    model_name="microsoft/BiomedNLP-PubMedBERT"  # 医疗领域
)

# 2. 优化分块,保持语义完整
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", "。", "；"]  # 用中文标点
)

# 3. 查询扩展
query_expansion = f"原始查询:{query}\n相关词汇:{get_synonyms(query)}"
```

### Q2: 向量维度越大越好吗?

**不一定**。研究发现:

| 维度 | 性能提升 | 成本增加 | 性价比 |
|------|----------|----------|--------|
| 512 → 1024 | +8% | +100% | ⭐⭐⭐⭐⭐ |
| 1024 → 2048 | +3% | +100% | ⭐⭐⭐ |
| 2048 → 3072 | +1% | +50% | ⭐⭐ |

**建议**:大多数场景用 512-1024 维就够了。

### Q3: 如何评估嵌入模型的质量?

**方法1:人工测试**
```python
queries = [
    ("公司的年假政策", "员工手册-年假", 期望高相似),
    ("如何退款", "产品介绍", 期望低相似),
    ...
]

for query, doc, expected in queries:
    sim = compute_similarity(query, doc)
    print(f"查询:{query}, 文档:{doc}, 相似度:{sim:.2f}, 符合预期:{sim > 0.7 == expected}")
```

**方法2:使用评估数据集**
```python
from sentence_transformers import evaluation

evaluator = evaluation.InformationRetrievalEvaluator(
    queries=queries_dict,
    corpus=corpus_dict,
    relevant_docs=relevant_docs_dict
)

results = evaluator(model)
print(f"MAP(Mean Average Precision):{results['MAP']}")
```

---

## 思考题

::: info 实践检验
1. **对比实验**:选择 3 个不同的嵌入模型,用同一组文档和查询测试,记录:
   - 检索准确率(前 5 个结果中有几个相关)
   - 推理速度
   - 资源占用(CPU/GPU,内存)

2. **可视化向量空间**:
   - 使用 t-SNE 或 UMAP 将高维向量降到 2D
   - 用 Matplotlib 绘制散点图
   - 观察语义相近的文本是否聚集在一起

3. **领域适配**:
   - 如果你的文档是法律条文,如何优化嵌入模型?
   - 提示:考虑微调(fine-tune)嵌入模型
:::

---

## 本节小结

通过本节学习,你应该掌握了:

✅ **向量化原理**
- 将文本映射到高维空间,捕获语义信息
- 从静态词向量到上下文相关嵌入的发展

✅ **模型选择**
- 中文:bge-large-zh-v1.5
- 英文:text-embedding-3-small
- 多语言:bge-m3

✅ **实践方法**
- 使用 OpenAI/HuggingFace/Jina API
- 批量处理、GPU 加速、量化优化

✅ **相似度计算**
- 余弦相似度(推荐)
- 欧氏距离、点积

✅ **最佳实践**
- 查询和文档用相同模型
- 适当降维
- 领域适配

---

**下一步**:在[下一节](/ai-basics/05-rag-knowledge/04-vector-database)中,我们会学习向量数据库,看看如何高效存储和检索百万级的向量。

---

[← 返回模块目录](/ai-basics/05-rag-knowledge) | [继续学习:向量数据库 →](/ai-basics/05-rag-knowledge/04-vector-database)

---

[^1]: MTEB (Massive Text Embedding Benchmark) 榜单:https://huggingface.co/spaces/mteb/leaderboard
[^2]: C-MTEB (Chinese Massive Text Embedding Benchmark) 中文嵌入模型排行榜
