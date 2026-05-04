# RAG 实践指南

> **学习目标**:从零开始,完整实现一个生产级 RAG 系统
>
> **预计时间**:120 分钟(实践项目)
>
> **难度等级**:⭐⭐⭐⭐☆

---

## 项目概览

### 实战目标

我们将构建一个**智能文档问答系统**,具备以下功能:

- ✅ 支持多种文档格式(PDF、Word、Markdown)
- ✅ 高质量检索(混合检索 + 重排序)
- ✅ 多轮对话能力
- ✅ 答案可追溯(标注来源)
- ✅ 性能监控和评估

### 技术栈

| 组件 | 选型 | 理由 |
|------|------|------|
| **文档加载** | LangChain loaders | 功能全面,易于扩展 |
| **嵌入模型** | bge-large-zh-v1.5 | 中文效果好,开源免费 |
| **向量数据库** | Qdrant | 性能强,API 友好,支持过滤 |
| **LLM** | DeepSeek-V3 | 性价比高,中文能力优秀 |
| **重排序** | bge-reranker-large | 提升检索质量 |
| **前端** | Streamlit | 快速构建,Python 原生 |
| **评估** | RAGAS | 自动化评估框架 |

---

## 环境准备

### 安装依赖

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装核心依赖
pip install langchain langchain-community langchain-openai
pip install chromadb qdrant-client
pip install sentence-transformers
pip install pypdf python-docx unstructured
pip install streamlit
pip install ragas

# 安装可选依赖(处理复杂文档)
pip install pytesseract  # OCR
pip install tabula-py    # 表格提取
```

### 项目结构

```
rag-project/
├── data/                   # 原始文档
│   ├── pdfs/
│   ├── docs/
│   └── markdown/
├── config/                 # 配置文件
│   └── settings.py
├── src/                    # 源代码
│   ├── document_loader.py
│   ├── text_splitter.py
│   ├── embeddings.py
│   ├── vector_store.py
│   ├── retriever.py
│   ├── generator.py
│   └── rag_pipeline.py
├── evaluations/            # 评估结果
├── app.py                  # Streamlit 应用
├── requirements.txt
└── README.md
```

---

## 步骤1:文档处理

### 创建 `src/document_loader.py`

```python
from pathlib import Path
from typing import List, Dict
from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    UnstructuredMarkdownLoader,
    DirectoryLoader
)

class DocumentLoader:
    """统一的文档加载接口"""

    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)

    def load_pdf(self, pdf_path: str) -> List:
        """加载 PDF 文件"""
        loader = PyPDFLoader(pdf_path)
        return loader.load()

    def load_docx(self, docx_path: str) -> List:
        """加载 Word 文档"""
        loader = Docx2txtLoader(docx_path)
        return loader.load()

    def load_markdown(self, md_path: str) -> List:
        """加载 Markdown 文件"""
        loader = UnstructuredMarkdownLoader(md_path)
        return loader.load()

    def load_directory(self, glob: str = "**/*.*") -> List:
        """加载整个目录"""
        loader = DirectoryLoader(
            str(self.data_dir),
            glob=glob,
            loader_cls=PyPDFLoader  # 可以根据文件类型动态选择
        )
        return loader.load()

    def load_all(self) -> List:
        """加载所有文档"""
        all_docs = []

        # 遍历所有子目录
        for file_path in self.data_dir.rglob("*"):
            if file_path.is_file():
                suffix = file_path.suffix.lower()

                try:
                    if suffix == ".pdf":
                        docs = self.load_pdf(str(file_path))
                    elif suffix in [".docx", ".doc"]:
                        docs = self.load_docx(str(file_path))
                    elif suffix == ".md":
                        docs = self.load_markdown(str(file_path))
                    else:
                        continue

                    # 添加文件路径作为元数据
                    for doc in docs:
                        doc.metadata["source"] = str(file_path)
                        doc.metadata["filename"] = file_path.name

                    all_docs.extend(docs)
                    print(f"✅ 已加载: {file_path.name} ({len(docs)} 个文档块)")

                except Exception as e:
                    print(f"❌ 加载失败: {file_path.name} - {e}")

        return all_docs

# 使用示例
if __name__ == "__main__":
    loader = DocumentLoader("data")
    documents = loader.load_all()
    print(f"\n总共加载了 {len(documents)} 个文档块")
```

### 创建 `src/text_splitter.py`

```python
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter

class TextSplitter:
    """智能文本分块"""

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        separators: List[str] = None
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        # 默认分隔符(中文友好)
        if separators is None:
            separators = [
                "\n\n",     # 段落
                "\n",       # 行
                "。",       # 中文句号
                "!",        # 感叹号
                "?",        # 问号
                "；",       # 分号
                " ",        # 空格
                ""
            ]

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=separators,
            length_function=len,
        )

    def split_documents(self, documents: List) -> List:
        """分块文档"""

        chunks = self.splitter.split_documents(documents)

        # 添加唯一 ID
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk_id"] = f"chunk_{i}"

        return chunks

    def split_by_semantic(self, documents: List) -> List:
        """
        语义分块(实验性功能)
        使用句子相似度来确定分块边界
        """

        # TODO: 实现基于语义相似度的分块
        # 可以使用 SentenceTransformer 计算句子间的相似度
        # 在相似度低的地方切分

        return self.split_documents(documents)

# 使用示例
if __name__ == "__main__":
    from document_loader import DocumentLoader

    loader = DocumentLoader("data")
    docs = loader.load_all()

    splitter = TextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)

    print(f"分块后共 {len(chunks)} 个块")
    print(f"第一块内容(前200字):{chunks[0].page_content[:200]}")
    print(f"第一块元数据:{chunks[0].metadata}")
```

---

## 步骤2:向量化与存储

### 创建 `src/embeddings.py`

```python
from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np

class EmbeddingModel:
    """嵌入模型封装"""

    def __init__(self, model_name: str = "BAAI/bge-large-zh-v1.5"):
        self.model = SentenceTransformer(model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed_query(self, text: str) -> List[float]:
        """嵌入单个查询"""
        return self.model.encode(text, normalize_embeddings=True).tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """批量嵌入文档"""

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True,
            batch_size=32
        )

        return embeddings.tolist()

    def embed_documents_with_instruction(
        self,
        texts: List[str],
        is_query: bool = False
    ) -> List[List[float]]:
        """
        带指令的嵌入(BGE 模型优化)
        """

        if is_query:
            # 为查询添加指令前缀
            texts = [f"为这个句子生成表示以用于检索相关文章:{t}" for t in texts]

        return self.embed_documents(texts)

# 使用示例
if __name__ == "__main__":
    model = EmbeddingModel()

    # 测试
    query = "公司的年假政策是什么?"
    query_vec = model.embed_query(query)
    print(f"查询向量维度:{len(query_vec)}")

    # 批量测试
    docs = ["文档1内容", "文档2内容", "文档3内容"]
    doc_vecs = model.embed_documents(docs)
    print(f"文档向量数量:{len(doc_vecs)}, 维度:{len(doc_vecs[0])}")
```

### 创建 `src/vector_store.py`

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter
from typing import List, Dict, Any
from embeddings import EmbeddingModel

class VectorStore:
    """向量数据库管理"""

    def __init__(
        self,
        collection_name: str = "knowledge_base",
        location: str = ":memory:",  # 或 "http://localhost:6333"
        embedding_model: EmbeddingModel = None
    ):
        self.collection_name = collection_name
        self.client = QdrantClient(location=location)
        self.embedding_model = embedding_model or EmbeddingModel()

        # 创建 collection
        self._create_collection()

    def _create_collection(self):
        """创建 collection"""

        # 检查是否已存在
        collections = self.client.get_collections().collections
        collection_names = [c.name for c in collections]

        if self.collection_name not in collection_names:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.embedding_model.dimension,
                    distance=Distance.COSINE
                )
            )
            print(f"✅ 创建 collection: {self.collection_name}")
        else:
            print(f"ℹ️  Collection 已存在: {self.collection_name}")

    def add_documents(
        self,
        documents: List[Any],
        batch_size: int = 100
    ) -> int:
        """添加文档到向量库"""

        points = []
        total_added = 0

        for i, doc in enumerate(documents):
            # 生成向量
            vector = self.embedding_model.embed_query(doc.page_content)

            # 创建点
            point = PointStruct(
                id=i,
                vector=vector,
                payload={
                    "text": doc.page_content,
                    "metadata": doc.metadata
                }
            )
            points.append(point)

            # 批量上传
            if len(points) >= batch_size:
                self.client.upsert(
                    collection_name=self.collection_name,
                    points=points
                )
                total_added += len(points)
                print(f"已上传 {total_added}/{len(documents)} 个文档块")
                points = []

        # 上传剩余的点
        if points:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            total_added += len(points)

        print(f"✅ 总共上传了 {total_added} 个文档块")
        return total_added

    def search(
        self,
        query: str,
        top_k: int = 5,
        score_threshold: float = 0.7,
        filter_dict: Dict = None
    ) -> List[Dict]:
        """相似度搜索"""

        # 嵌入查询
        query_vector = self.embedding_model.embed_query(query)

        # 构建过滤条件
        query_filter = None
        if filter_dict:
            query_filter = Filter(**filter_dict)

        # 搜索
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k,
            score_threshold=score_threshold,
            query_filter=query_filter
        )

        # 格式化结果
        formatted_results = []
        for result in results:
            formatted_results.append({
                "text": result.payload["text"],
                "metadata": result.payload["metadata"],
                "score": result.score
            })

        return formatted_results

    def delete_collection(self):
        """删除 collection"""
        self.client.delete_collection(self.collection_name)
        print(f"✅ 已删除 collection: {self.collection_name}")

# 使用示例
if __name__ == "__main__":
    from document_loader import DocumentLoader
    from text_splitter import TextSplitter

    # 加载和分块
    loader = DocumentLoader("data")
    docs = loader.load_all()

    splitter = TextSplitter()
    chunks = splitter.split_documents(docs)

    # 创建向量库
    vector_store = VectorStore()
    vector_store.add_documents(chunks)

    # 测试搜索
    results = vector_store.search("年假政策", top_k=3)
    for i, result in enumerate(results, 1):
        print(f"\n结果 {i}:")
        print(f"相似度: {result['score']:.3f}")
        print(f"内容: {result['text'][:100]}...")
```

---

## 步骤3:检索与生成

### 创建 `src/retriever.py`

```python
from typing import List, Dict
from vector_store import VectorStore

class Retriever:
    """检索器(支持高级检索策略)"""

    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        search_type: str = "similarity"
    ) -> List[Dict]:
        """
        检索相关文档

        Args:
            query: 查询文本
            top_k: 返回结果数量
            search_type: 检索类型
                - "similarity": 相似度检索
                - "mmr": MMR 检索(多样性)
        """

        if search_type == "similarity":
            return self._similarity_search(query, top_k)
        elif search_type == "mmr":
            return self._mmr_search(query, top_k)
        else:
            raise ValueError(f"未知的检索类型: {search_type}")

    def _similarity_search(self, query: str, top_k: int) -> List[Dict]:
        """标准相似度检索"""

        results = self.vector_store.search(query, top_k=top_k)
        return results

    def _mmr_search(self, query: str, top_k: int, lambda_mult: float = 0.5) -> List[Dict]:
        """
        MMR (Maximal Marginal Relevance) 检索
        平衡相关性和多样性

        Args:
            query: 查询
            top_k: 返回结果数
            lambda_mult: 多样性权重 (0=完全多样性, 1=完全相关性)
        """

        # 先检索更多候选
        candidates = self.vector_store.search(query, top_k=top_k * 3)

        # TODO: 实现 MMR 算法
        # 1. 计算查询与每个文档的相关性
        # 2. 计算文档间的相似度
        # 3. 选择 MMR 最高的文档

        return candidates[:top_k]

    def retrieve_with_filter(
        self,
        query: str,
        top_k: int,
        filter_dict: Dict
    ) -> List[Dict]:
        """带过滤条件的检索"""

        results = self.vector_store.search(
            query,
            top_k=top_k,
            filter_dict=filter_dict
        )
        return results

# 使用示例
if __name__ == "__main__":
    from vector_store import VectorStore

    vector_store = VectorStore()
    retriever = Retriever(vector_store)

    # 测试检索
    query = "公司的年假政策"
    results = retriever.retrieve(query, top_k=5)

    for i, result in enumerate(results, 1):
        print(f"\n结果 {i}:")
        print(f"分数: {result['score']:.3f}")
        print(f"内容: {result['text'][:150]}...")
```

### 创建 `src/generator.py`

```python
from openai import OpenAI
from typing import List, Dict

class AnswerGenerator:
    """答案生成器"""

    def __init__(
        self,
        model: str = "deepseek-chat",
        api_key: str = None,
        base_url: str = "https://api.deepseek.com"
    ):
        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url
        )
        self.model = model

    def generate(
        self,
        question: str,
        context: List[Dict],
        temperature: float = 0.0,
        max_tokens: int = 1000
    ) -> Dict:
        """
        生成答案

        Args:
            question: 用户问题
            context: 检索到的上下文
            temperature: 温度参数
            max_tokens: 最大 token 数

        Returns:
            {
                "answer": 答案文本,
                "sources": 来源列表
            }
        """

        # 组装上下文
        context_text = self._format_context(context)

        # 构建提示
        prompt = self._build_prompt(question, context_text)

        # 调用 LLM
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "你是一个专业的问答助手。"},
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )

        answer = response.choices[0].message.content

        # 提取来源
        sources = self._extract_sources(context)

        return {
            "answer": answer,
            "sources": sources
        }

    def _format_context(self, context: List[Dict]) -> str:
        """格式化上下文"""

        formatted = []
        for i, doc in enumerate(context, 1):
            formatted.append(f"【文档{i}】\n{doc['text']}")
            formatted.append(f"来源: {doc['metadata'].get('filename', '未知')}")
            formatted.append("")

        return "\n\n".join(formatted)

    def _build_prompt(self, question: str, context: str) -> str:
        """构建提示"""

        prompt = f"""
请基于以下上下文回答用户的问题。

上下文:
{context}

问题: {question}

回答要求:
1. 只使用上下文中的信息,不要编造
2. 如果上下文中没有相关信息,明确说明"根据提供的文档,我无法回答这个问题"
3. 保持回答简洁准确
4. 在答案中引用具体的文档编号,如【文档1】
5. 使用 markdown 格式组织答案

回答:
"""
        return prompt.strip()

    def _extract_sources(self, context: List[Dict]) -> List[Dict]:
        """提取来源信息"""

        sources = []
        for doc in context:
            sources.append({
                "filename": doc['metadata'].get('filename', '未知'),
                "source": doc['metadata'].get('source', '未知')
            })

        return sources

    def generate_with_stream(
        self,
        question: str,
        context: List[Dict]
    ):
        """流式生成答案"""

        context_text = self._format_context(context)
        prompt = self._build_prompt(question, context_text)

        stream = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "你是一个专业的问答助手。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            stream=True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

# 使用示例
if __name__ == "__main__":
    from retriever import Retriever
    from vector_store import VectorStore

    # 检索
    vector_store = VectorStore()
    retriever = Retriever(vector_store)
    results = retriever.retrieve("年假政策", top_k=3)

    # 生成
    generator = AnswerGenerator(api_key="your-api-key")
    answer = generator.generate("年假政策是什么?", results)

    print(f"答案:\n{answer['answer']}")
    print(f"\n来源:")
    for source in answer['sources']:
        print(f"- {source['filename']}")
```

---

## 步骤4:完整 RAG 流程

### 创建 `src/rag_pipeline.py`

```python
from typing import Dict, List
from document_loader import DocumentLoader
from text_splitter import TextSplitter
from embeddings import EmbeddingModel
from vector_store import VectorStore
from retriever import Retriever
from generator import AnswerGenerator

class RAGPipeline:
    """完整的 RAG 流程"""

    def __init__(self, config: Dict = None):
        """
        初始化 RAG 流程

        Args:
            config: 配置字典
                {
                    "data_dir": "数据目录",
                    "chunk_size": 1000,
                    "chunk_overlap": 200,
                    "top_k": 5,
                    "llm_model": "deepseek-chat",
                    "llm_api_key": "your-key"
                }
        """

        self.config = config or {}

        # 初始化组件
        self.embedding_model = EmbeddingModel()
        self.vector_store = VectorStore(
            embedding_model=self.embedding_model
        )
        self.retriever = Retriever(self.vector_store)
        self.generator = AnswerGenerator(
            model=self.config.get("llm_model", "deepseek-chat"),
            api_key=self.config.get("llm_api_key")
        )

    def build_index(self, data_dir: str = None):
        """构建索引"""

        data_dir = data_dir or self.config.get("data_dir", "data")

        print("=" * 50)
        print("步骤 1: 加载文档")
        print("=" * 50)

        loader = DocumentLoader(data_dir)
        documents = loader.load_all()

        if not documents:
            print("❌ 没有找到文档,请检查数据目录")
            return

        print(f"\n总共加载了 {len(documents)} 个文档块")

        print("\n" + "=" * 50)
        print("步骤 2: 文本分块")
        print("=" * 50)

        splitter = TextSplitter(
            chunk_size=self.config.get("chunk_size", 1000),
            chunk_overlap=self.config.get("chunk_overlap", 200)
        )
        chunks = splitter.split_documents(documents)
        print(f"分块后共 {len(chunks)} 个块")

        print("\n" + "=" * 50)
        print("步骤 3: 向量化并存储")
        print("=" * 50)

        self.vector_store.add_documents(chunks)

        print("\n" + "=" * 50)
        print("✅ 索引构建完成!")
        print("=" * 50)

    def query(
        self,
        question: str,
        top_k: int = None,
        return_retrieved_docs: bool = False
    ) -> Dict:
        """
        查询

        Args:
            question: 问题
            top_k: 检索数量
            return_retrieved_docs: 是否返回检索到的文档

        Returns:
            {
                "answer": 答案,
                "sources": 来源,
                "retrieved_docs": 检索到的文档(可选)
            }
        """

        top_k = top_k or self.config.get("top_k", 5)

        # 1. 检索
        print(f"🔍 检索中... (top_k={top_k})")
        retrieved_docs = self.retriever.retrieve(question, top_k=top_k)

        if not retrieved_docs:
            return {
                "answer": "抱歉,我没有找到相关信息。",
                "sources": [],
                "retrieved_docs": []
            }

        print(f"✅ 检索到 {len(retrieved_docs)} 个相关文档")

        # 2. 生成
        print("🤖 生成答案中...")
        result = self.generator.generate(question, retrieved_docs)

        print("✅ 答案生成完成\n")

        # 3. 返回结果
        response = {
            "answer": result["answer"],
            "sources": result["sources"]
        }

        if return_retrieved_docs:
            response["retrieved_docs"] = retrieved_docs

        return response

    def query_stream(self, question: str, top_k: int = None):
        """流式查询"""

        top_k = top_k or self.config.get("top_k", 5)

        # 检索
        print(f"🔍 检索中... (top_k={top_k})")
        retrieved_docs = self.retriever.retrieve(question, top_k=top_k)

        if not retrieved_docs:
            yield "抱歉,我没有找到相关信息。"
            return

        print(f"✅ 检索到 {len(retrieved_docs)} 个相关文档\n")
        print("🤖 生成答案:\n")

        # 流式生成
        for chunk in self.generator.generate_with_stream(question, retrieved_docs):
            print(chunk, end="", flush=True)
            yield chunk

# 使用示例
if __name__ == "__main__":
    # 配置
    config = {
        "data_dir": "data",
        "chunk_size": 1000,
        "chunk_overlap": 200,
        "top_k": 5,
        "llm_model": "deepseek-chat",
        "llm_api_key": "your-api-key-here"
    }

    # 创建 RAG 流程
    rag = RAGPipeline(config)

    # 构建索引(只需执行一次)
    # rag.build_index()

    # 查询
    while True:
        question = input("\n请输入问题(输入 'quit' 退出): ")

        if question.lower() == "quit":
            break

        result = rag.query(question)

        print("\n" + "=" * 50)
        print("答案:")
        print("=" * 50)
        print(result["answer"])

        print("\n来源:")
        for source in result["sources"]:
            print(f"- {source['filename']}")
```

---

## 步骤5:构建 Web 应用

### 创建 `app.py`

```python
import streamlit as st
from src.rag_pipeline import RAGPipeline

# 页面配置
st.set_page_config(
    page_title="智能文档问答系统",
    page_icon="📚",
    layout="wide"
)

# 标题
st.title("📚 智能文档问答系统")
st.markdown("---")

# 侧边栏配置
with st.sidebar:
    st.header("⚙️ 配置")

    # 数据目录
    data_dir = st.text_input("数据目录", value="data")

    # 分块参数
    chunk_size = st.slider("分块大小", 200, 2000, 1000)
    chunk_overlap = st.slider("分块重叠", 0, 500, 200)

    # 检索参数
    top_k = st.slider("检索数量", 3, 10, 5)

    # LLM 配置
    st.markdown("### LLM 配置")
    api_key = st.text_input("API Key", type="password")
    model = st.selectbox("模型", ["deepseek-chat", "gpt-4o-mini", "gpt-4o"])

    # 构建索引按钮
    st.markdown("---")
    if st.button("🔄 重建索引"):
        with st.spinner("正在构建索引..."):
            config = {
                "data_dir": data_dir,
                "chunk_size": chunk_size,
                "chunk_overlap": chunk_overlap,
                "top_k": top_k,
                "llm_model": model,
                "llm_api_key": api_key
            }

            rag = RAGPipeline(config)
            rag.build_index(data_dir)

        st.success("✅ 索引构建完成!")

# 主界面
st.header("💬 问答")

# 初始化 session state
if "messages" not in st.session_state:
    st.session_state.messages = []

if "rag" not in st.session_state:
    config = {
        "data_dir": data_dir,
        "chunk_size": chunk_size,
        "chunk_overlap": chunk_overlap,
        "top_k": top_k,
        "llm_model": model,
        "llm_api_key": api_key
    }
    st.session_state.rag = RAGPipeline(config)

# 显示历史消息
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 用户输入
if prompt := st.chat_input("请输入您的问题"):
    # 显示用户消息
    with st.chat_message("user"):
        st.markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # 生成回答
    with st.chat_message("assistant"):
        with st.spinner("思考中..."):
            result = st.session_state.rag.query(prompt, top_k=top_k)

        st.markdown(result["answer"])

        # 显示来源
        if result["sources"]:
            with st.expander("📖 查看来源"):
                for source in result["sources"]:
                    st.markdown(f"- **{source['filename']}**")

    # 添加到历史
    st.session_state.messages.append({
        "role": "assistant",
        "content": result["answer"]
    })
```

### 运行应用

```bash
streamlit run app.py
```

---

## 评估与优化

### 创建评估脚本 `evaluations/evaluate.py`

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_relevancy
)
from datasets import Dataset
import pandas as pd

def create_evaluation_dataset():
    """创建评估数据集"""

    # 示例评估数据
    data = {
        "question": [
            "公司的年假政策是什么?",
            "如何申请报销?",
            "办公时间是什么?"
        ],
        "answer": [
            # 实际运行 RAG 系统得到的答案
            "根据员工手册,年假政策为...",
            "报销流程如下...",
            "公司办公时间是..."
        ],
        "contexts": [
            # 检索到的上下文
            ["员工手册第3章:年假制度..."],
            ["财务手册第5章:报销流程..."],
            ["员工手册第1章:工作时间..."]
        ],
        "ground_truth": [
            # 标准答案
            "入职满1年享受5天年假,满10年15天",
            "需要填写报销单,附上发票,交给部门经理审批",
            "周一至周五 9:00-18:00"
        ]
    }

    return Dataset.from_dict(data)

def run_evaluation():
    """运行评估"""

    # 创建数据集
    dataset = create_evaluation_dataset()

    # 评估指标
    metrics = [
        faithfulness,      # 忠实度:答案是否基于上下文
        answer_relevancy,  # 相关性:答案是否相关
        context_relevancy  # 上下文相关性:检索质量
    ]

    # 运行评估
    results = evaluate(
        dataset=dataset,
        metrics=metrics
    )

    # 打印结果
    print("评估结果:")
    print(results.to_pandas())

    # 保存结果
    results_df = results.to_pandas()
    results_df.to_csv("evaluations/results.csv", index=False)

    return results

if __name__ == "__main__":
    run_evaluation()
```

### 优化建议

基于评估结果,针对性优化:

| 问题 | 优化方法 |
|------|----------|
| **忠实度低** | 添加提示"只使用上下文信息",减少幻觉 |
| **上下文相关性低** | 调整分块策略、增加 top_k、使用重排序 |
| **答案相关性低** | 优化提示模板、使用更好的 LLM |

---

## 部署指南

### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 暴露端口
EXPOSE 8501

# 启动命令
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8501:8501"
    volumes:
      - ./data:/app/data
    environment:
      - LLM_API_KEY=${LLM_API_KEY}
```

### 云服务部署

**选择**:
- **Hugging Face Spaces**:免费 tier,适合演示
- **Streamlit Cloud**:最简单,直接连接 GitHub
- **Railway/Render**:更多控制,支持自定义域名
- **AWS/Azure/GCP**:企业级,可扩展

---

## 思考题

::: info 实践项目
1. **完整实现**:
   - 按照本节代码,实现完整的 RAG 系统
   - 用自己的数据(论文、文档、网页)测试
   - 部署到云服务,分享给朋友使用

2. **性能对比**:
   - 对比不同的嵌入模型(bge-small vs bge-large)
   - 对比不同的分块策略(500 vs 1000 vs 2000)
   - 记录准确率、延迟、成本的变化

3. **功能扩展**:
   - 添加重排序模块
   - 实现多轮对话(记忆历史)
   - 添加文档上传功能
   - 支持多语言(中英混合)

4. **评估优化**:
   - 创建 50 个测试问题
   - 用 RAGAS 自动评估
   - 根据结果优化系统
:::

---

## 本节小结

通过本节学习,你应该完成了:

✅ **完整的 RAG 系统**
- 文档加载、分块、向量化
- 向量数据库存储和检索
- LLM 答案生成
- Web 应用界面

✅ **代码组织**
- 模块化设计
- 易于扩展和维护
- 配置化管理

✅ **实战技能**
- 环境搭建
- 代码实现
- 评估优化
- 部署上线

---

**恭喜你完成了 RAG 模块的学习!** 🎉

你现在掌握了从理论到实践的完整知识体系,可以构建生产级的 RAG 系统。继续保持学习和实践,探索更多高级技术和应用场景!

---

[← 返回模块目录](/basics/05-rag-knowledge)
