# 跨模态对齐

## 什么是跨模态对齐？

跨模态对齐（Cross-modal Alignment）是指将不同模态的信息映射到统一的语义空间，使 AI 系统能够：

1. **理解模态间的语义关系**：知道图像中的物体与文本描述的对应
2. **执行跨模态推理**：基于多种模态的联合信息进行决策
3. **生成一致的多模态输出**：确保生成的各模态内容相互匹配

## 核心挑战

### 1. 模态异构性（Modality Heterogeneity）

**问题描述**：
- 文本：离散的符号序列
- 图像：连续的像素网格
- 音频：时序的波形数据
- 不同模态的数据结构和统计特性完全不同

**技术难点**：
```python
# 模态异构性示例
text_input = "一只猫坐在沙发上"  # 离散符号
image_input = [[255, 255, 255], ...]  # 连续像素
audio_input = [0.1, -0.2, 0.3, ...]  # 时序波形

# 如何将这些异构数据对齐到统一空间？
# 1. 需要模态特定的编码器
# 2. 需要统一的嵌入空间
# 3. 需要有效的对齐目标
```

### 2. 模态偏见（Modal Bias）

**问题描述**：
不同模态的信息可能存在冲突，导致推理结果不一致

**示例**：
- 图像显示：一只黑色的狗
- 文本描述：一只白色的猫
- 推理冲突：应该相信图像还是文本？

**技术影响**：
- 推理不一致
- 生成质量下降
- 用户体验困惑

### 3. 细粒度对齐（Fine-grained Alignment）

**问题描述**：
不仅要对齐整体语义，还要对齐细粒度的局部信息

**示例**：
```python
# 细粒度对齐示例
image = [
    [cat_head, body],   # 猫头，身体
    [cat_paws, tail],   # 猫爪，尾巴
    [background, sofa]   # 背景，沙发
]

text = "一只猫坐在沙发上"

# 需要对齐：
# cat_head ↔ "猫"
# body ↔ "一只"
# paws + tail ↔ "坐"
# sofa ↔ "沙发上"
```

## 对齐技术

### 1. 对比学习（Contrastive Learning）

#### CLIP 对比损失

**核心思想**：
通过对比学习拉近匹配的图像-文本对，推远不匹配的对

**算法实现**：
```python
# CLIP 对比损失
def clip_contrastive_loss(image_embeddings, text_embeddings, temperature=0.07):
    batch_size = len(image_embeddings)
    labels = torch.arange(batch_size)

    # 计算所有图像-文本对的相似度
    # shape: [batch_size, batch_size]
    logits = image_embeddings @ text_embeddings.T / temperature

    # 交叉熵损失
    loss_i2t = F.cross_entropy(logits, labels)  # 图像到文本
    loss_t2i = F.cross_entropy(logits.T, labels)  # 文本到图像

    # 双向损失
    loss = (loss_i2t + loss_t2i) / 2
    return loss
```

**技术特点**：
- 简单有效的对齐目标
- 统一的嵌入空间
- 支持零样本学习

**适用场景**：
- 图像-文本检索
- 零样本分类
- 跨模态相似度计算

### 2. 跨模态注意力（Cross-modal Attention）

#### 标准 Cross-Attention

**核心思想**：
让一个模态作为 Query，去"关注"另一个模态的 Key 和 Value

**算法实现**：
```python
# 跨模态注意力
class CrossModalAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads

    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)

        # 线性变换
        Q = self.W_q(query)  # [batch, n_heads, seq_len, d_k]
        K = self.W_k(key)    # [batch, n_heads, seq_len, d_k]
        V = self.W_v(value)  # [batch, n_heads, seq_len, d_k]

        # 缩放点积注意力
        scores = torch.matmul(Q, K.transpose(-2, -1)) / \
                 torch.sqrt(torch.tensor(self.d_k, dtype=torch.float32))

        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)

        attention_weights = F.softmax(scores, dim=-1)

        # 加权求和
        output = torch.matmul(attention_weights, V)

        return output
```

**使用示例**：
```python
# 文本-图像跨模态注意力
# Query: 文本嵌入
# Key, Value: 图像嵌入
text_query = text_encoder("用户想要一张可爱的猫咪图片")
image_key, image_value = image_encoder(input_image)

# 文本关注图像的哪些部分
attention_output = cross_modal_attention(
    query=text_query,
    key=image_key,
    value=image_value
)

# attention_output 包含文本关注的图像区域
```

**技术特点**：
- 细粒度的模态交互
- 动态的权重分配
- 灵活的模态组合

### 3. 模态注意力机制（Modality-specific Attention）

#### 模态特定注意力

**核心思想**：
对不同模态使用不同的注意力机制，充分利用各模态的特性

**算法实现**：
```python
# 模态特定注意力
class ModalitySpecificAttention(nn.Module):
    def __init__(self, d_model):
        # 文本：标准自注意力
        self.text_attention = MultiHeadAttention(d_model)

        # 图像：空间注意力（关注局部区域）
        self.image_attention = SpatialAttention(d_model)

        # 音频：时序注意力（关注时序模式）
        self.audio_attention = TemporalAttention(d_model)

    def forward(self, modalities):
        outputs = []

        for modality, data in modalities.items():
            if modality == 'text':
                out = self.text_attention(data)
            elif modality == 'image':
                out = self.image_attention(data)
            elif modality == 'audio':
                out = self.audio_attention(data)

            outputs.append(out)

        return concat(outputs)
```

**技术特点**：
- 充分利用各模态特性
- 更高效的信息处理
- 可扩展的架构

### 4. 联合表示学习（Joint Representation Learning）

#### 统一嵌入空间

**核心思想**：
学习一个统一的嵌入空间，所有模态都能映射到该空间并保持语义一致性

**算法实现**：
```python
# 统一嵌入空间学习
class JointEmbeddingSpace(nn.Module):
    def __init__(self, d_model, latent_dim):
        # 模态特定编码器
        self.text_encoder = TextEncoder(d_model)
        self.image_encoder = ImageEncoder(d_model)
        self.audio_encoder = AudioEncoder(d_model)

        # 统一的投影头
        self.text_projection = nn.Linear(d_model, latent_dim)
        self.image_projection = nn.Linear(d_model, latent_dim)
        self.audio_projection = nn.Linear(d_model, latent_dim)

        # 对齐损失
        self.alignment_loss = nn.MSELoss()

    def forward(self, text, image, audio):
        # 编码各模态
        text_feat = self.text_encoder(text)
        image_feat = self.image_encoder(image)
        audio_feat = self.audio_encoder(audio)

        # 投影到统一空间
        text_emb = self.text_projection(text_feat)
        image_emb = self.image_projection(image_feat)
        audio_emb = self.audio_projection(audio_feat)

        return text_emb, image_emb, audio_emb

    def compute_alignment_loss(self, text_emb, image_emb, audio_emb):
        # 跨模态对齐损失
        loss_ti = self.alignment_loss(text_emb, image_emb)
        loss_ta = self.alignment_loss(text_emb, audio_emb)
        loss_ia = self.alignment_loss(image_emb, audio_emb)

        # 总对齐损失
        total_loss = loss_ti + loss_ta + loss_ia
        return total_loss
```

**技术特点**：
- 统一的语义空间
- 跨模态一致性保证
- 可扩展到新模态

### 5. 一致性约束（Consistency Constraints）

#### 跨模态一致性损失

**核心思想**：
引入额外的损失项，强制模型保持跨模态的一致性

**算法实现**：
```python
# 一致性损失
class ConsistencyLoss(nn.Module):
    def __init__(self):
        self.cyclic_consistency = CyclicConsistency()
        self.modality_balance = ModalityBalance()

    def forward(self, modalities, predictions):
        losses = {}

        # 循环一致性：text → image → audio → text
        cycle_loss = self.cyclic_consistency(modalities)
        losses['cycle'] = cycle_loss

        # 模态平衡：防止某个模态主导
        balance_loss = self.modality_balance(modalities)
        losses['balance'] = balance_loss

        # 预测一致性：不同模态的预测应该一致
        pred_consistency = self.prediction_consistency(predictions)
        losses['pred'] = pred_consistency

        total_loss = sum(losses.values())
        return total_loss, losses

class CyclicConsistency(nn.Module):
    def forward(self, modalities):
        # text → image
        t2i = self.translate('text', 'image', modalities['text'])
        # image → audio
        i2a = self.translate('image', 'audio', modalities['image'])
        # audio → text
        a2t = self.translate('audio', 'text', modalities['audio'])

        # 循环一致性损失
        original_text = modalities['text']
        loss = F.mse_loss(a2t, original_text)
        return loss
```

**技术特点**：
- 确保跨模态转换的一致性
- 防止模态偏见
- 提升整体对齐质量

## 对齐质量评估

### 评估指标

1. **检索性能**
   - Recall@K：前 K 个结果中包含正确结果的比率
   - Mean Rank：正确结果的平均排名
   - Median Rank：正确结果的中位数排名

2. **对齐质量**
   - Cross-modal Similarity：跨模态嵌入的相似度
   - Alignment Consistency：对齐的一致性分数
   - Modality Balance：各模态的平衡性

3. **细粒度对齐**
   - Token-level Alignment：Token 级别的对齐精度
   - Region-text Alignment：区域-文本对齐精度
   - Temporal Alignment：时序对齐精度

### 评估方法

```python
# 对齐质量评估
class AlignmentEvaluator:
    def __init__(self):
        self.retrieval_metrics = RetrievalMetrics()
        self.alignment_quality = AlignmentQuality()

    def evaluate(self, model, test_dataset):
        results = {}

        # 检索性能
        retrieval_scores = self.retrieval_metrics.evaluate(
            model, test_dataset
        )
        results['retrieval'] = retrieval_scores

        # 对齐质量
        alignment_scores = self.alignment_quality.evaluate(
            model, test_dataset
        )
        results['alignment'] = alignment_scores

        return results
```

## 对齐技术的应用

### 1. 图文对齐

**应用场景**：
- 图像描述生成
- 图文检索
- 视觉问答

**技术要点**：
- CLIP 风格的对比学习
- 跨模态注意力
- 细粒度区域对齐

### 2. 语音文本对齐

**应用场景**：
- 语音识别
- 说话人识别
- 语音情感分析

**技术要点**：
- CTC（Connectionist Temporal Classification）
- 注意力对齐机制
- 时序一致性约束

### 3. 视频文本对齐

**应用场景**：
- 视频描述生成
- 视频检索
- 视频问答

**技术要点**：
- 时序对齐
- 帧级注意力
- 跨模态推理

## 学习检验

#### 技术理解

- [ ] 能解释跨模态对齐的核心挑战
- [ ] 理解对比学习、跨模态注意力等技术的原理
- [ ] 能区分不同对齐技术的适用场景
- [ ] 能实现基本的跨模态对齐机制

#### 实践能力

- [ ] 能设计跨模态对齐的损失函数
- [ ] 能评估多模态模型的对齐质量
- [ ] 能选择合适的对齐技术处理特定任务
- [ ] 能优化跨模态对齐的训练过程

---

[下一节：多模态 Transformer →](./04-multimodal-transformers.md)
