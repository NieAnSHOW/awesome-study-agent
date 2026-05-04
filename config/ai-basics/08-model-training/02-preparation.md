# 微调准备

## 工作清单

在开始微调前,你需要做好这些准备:

```
□ 选择基础模型
□ 准备训练数据
□ 配置训练环境
□ 选择微调方法
□ 设计评估方案
```

## 第一步:选择基础模型

### 模型规模选择

| 显存 | 推荐模型 | 训练方式 | 适用场景 |
|------|---------|---------|---------|
| 8GB | Qwen-1.5B/1.5B | QLoRA | 个人学习、简单任务 |
| 16GB | Qwen-7B/Llama3-8B | LoRA | 中等复杂度任务 |
| 24GB+ | Qwen-14B/Llama3-70B | 全量微调 | 高要求专业任务 |

### 主流开源模型(2025)

#### 中文友好型
- **Qwen2.5** (阿里): 综合实力强,中文优秀
- **DeepSeek-V3**: 推理能力强,长文本好
- **Yi系列**: 代码和逻辑推理出色

#### 英文为主
- **Llama 3.1**: Meta出品,生态最好
- **Mistral 7B**: 性价比高
- **Gemma 2**: Google出品,轻量级

### 选择建议

```python
# 任务类型推荐模型
task_model_map = {
    "中文对话": "Qwen2.5-7B-Instruct",
    "代码生成": "DeepSeek-Coder-V2",
    "长文本": "Qwen2.5-32B"  # 支持128K上下文
    "推理": "Llama3.1-70B"
}
```

**选择要点**:
1. **任务匹配**: 代码任务选Code模型
2. **语言支持**: 中文任务选Qwen/DeepSeek
3. **资源预算**: 显存决定模型规模
4. **许可协议**: 商业用途注意Llama等限制

## 第二步:准备训练数据

### 数据质量标准

#### 最小数据量
```
简单任务: 500-1000条
一般任务: 3000-5000条
复杂任务: 10000+条
```

#### 数据质量检查清单

```python
# 检查项
quality_checks = {
    "格式一致性": "所有样本遵循相同模板",
    "无重复数据": "去重,避免信息泄露",
    "多样性充足": "覆盖不同场景和边界情况",
    "标注准确": "人工抽检100条样本",
    "无有害内容": "过滤敏感信息"
}
```

### 数据格式

#### 格式1:指令微调(最常用)
```json
{
  "instruction": "解释什么是递归",
  "input": "",
  "output": "递归是一种编程技巧,函数调用自身来解决问题..."
}
```

#### 格式2:对话格式
```json
{
  "conversations": [
    {"from": "human", "value": "Python中什么是装饰器?"},
    {"from": "assistant", "value": "装饰器是Python的高级特性..."},
    {"from": "human", "value": "能给个例子吗?"},
    {"from": "assistant", "value": "当然,这是装饰器的示例..."}
  ]
}
```

#### 格式3:完成式
```json
{
  "prompt": "def fibonacci(n):",
  "completion": "    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
}
```

### 数据来源

#### 自建数据集
**场景**:企业内部知识、专业领域

**方法**:
1. 从实际业务日志提取问答对
2. 组织人工编写数据
3. 使用大模型生成,人工校验

**案例**:法律问答微调
```
原始数据:10000条法律咨询记录
清洗:去隐私→格式化→人工校验
最终:3000条高质量训练数据
```

#### 开源数据集
**中文数据集**:
- **COIG-CQIA**: 中文指令微调数据
- **Firefly**: 中文多任务数据集
- **Zhihu-KOL**: 知乎高质量回答

**英文数据集**:
- **Alpaca**: 52K指令数据
- **Dolly**: 15K高质量指令
- **OpenOrca**: 400万条蒸馏数据

**提示**:先用开源数据"预热"模型,再用自己的数据精调。

#### 合成数据生成

用GPT-4/Claude生成训练数据:

```python
# 示例:生成分类任务数据
prompt = """
你是一个数据生成助手。请生成100个(文本,类别)对,
用于训练情感分类模型。要求:
1. 包含正面、负面、中性各占1/3
2. 文本长度20-50字
3. 风格自然,避免机械

输出JSON格式:
{"text": "...", "label": "positive/negative/neutral"}
"""
```

**优点**:快速、成本低

**注意**:质量可能参差不齐,需严格审核

### 数据预处理

#### 清洗步骤
```bash
# 1. 去重
python deduplicate.py --input raw.jsonl --output clean.jsonl

# 2. 过滤过长文本
python filter_length.py --max-length 2048

# 3. 分割训练/验证集
python split.py --ratio 0.9 --train train.jsonl --val val.jsonl
```

#### 数据增强(可选)
```python
# 回译增强
"今天天气很好" → 英文 → "Today's weather is good" → 中文
→ "今日天气甚佳"

# 同义词替换
"我很开心" → "我很高兴"
```

**注意**:增强数据可能引入噪声,谨慎使用。

## 第三步:配置训练环境

### 硬件需求

#### GPU推荐(2025标准)
```
微调7B模型(LoRA):
最低: RTX 3060 (12GB)
推荐: RTX 4090 (24GB)
专业: A100 (40/80GB)

微调14B+模型:
推荐: A100 40GB × 2
```

#### 云平台选择
| 平台 | 优势 | 成本(7B LoRA) |
|------|------|--------------|
| **AutoDL** | 国内便宜,现货 | ¥2-3/小时 |
| **阿里云PAI** | 稳定,有代金券 | ¥5-8/小时 |
| **Google Colab Pro** | 方便,有免费额度 | $10/月 |
| **RunPod** | 国外便宜 | $0.5/小时 |

### 软件环境

#### 基础环境
```bash
# 创建虚拟环境
conda create -n finetune python=3.10
conda activate finetune

# 安装PyTorch(A100示例)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# 安装核心库
pip install transformers datasets peft accelerate bitsandbytes
```

#### 一键工具
```bash
# Axolotl(推荐新手)
git clone https://github.com/OpenAccess-AI-Collective/axolotl
cd axolotl
pip install -e .

# LLaMA-Factory(可视化)
git clone https://github.com/hiyouga/LLaMA-Factory
cd LLaMA-Factory
pip install -r requirements.txt
```

## 第四步:选择微调方法

### 决策流程图

```
开始
  ↓
显存 < 12GB?
  ├─ 是 → QLoRA (4-bit量化)
  └─ 否
     ↓
     数据量 < 5000?
       ├─ 是 → LoRA
       └─ 否
          ↓
          需要大幅度改变能力?
            ├─ 是 → 全量微调
            └─ 否 → LoRA
```

### 方法对比

| 方法 | 显存需求(7B) | 训练速度 | 效果 | 推荐度 |
|------|-------------|---------|------|--------|
| QLoRA | 6GB | 慢 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| LoRA | 12GB | 中 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 全量微调 | 28GB | 快 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 超参数配置

#### LoRA常用参数
```yaml
lora_r: 8 # rank,越大参数越多(推荐4-16)
lora_alpha: 16 # 缩放因子,通常=r×2
lora_dropout: 0.05 # dropout防止过拟合
target_modules: # 要微调的模块
  - q_proj
  - v_proj
  - k_proj
  - o_proj
```

#### 训练参数
```yaml
learning_rate: 2e-4 # LoRA推荐值
batch_size: 4 # 根据显存调整
num_epochs: 3-5 # 过多会过拟合
warmup_ratio: 0.03 # 预热比例
gradient_accumulation_steps: 4 # 梯度累积
```

## 第五步:设计评估方案

### 评估集准备

```python
# 至少保留10%数据作为验证集
train, val = train_test_split(data, test_size=0.1, random_state=42)

# 确保验证集覆盖关键场景
val_samples = {
    "常见情况": 70%,  # 分布和训练集一致
    "边界情况": 20%,  # 长文本、特殊格式
    "困难样本": 10%   # 人工标注的困难案例
}
```

### 评估指标

#### 自动评估
```python
metrics = {
    "困惑度": "越低越好,衡量语言模型质量",
    "BLEU": "机器翻译质量",
    "ROUGE": "摘要质量",
    "准确率": "分类/选择题"
}
```

#### 人工评估模板
```markdown
## 微调模型评估表

样本ID: 001
问题: ...
模型回答: ...
标准答案: ...

评分(1-5分):
- 准确性: ___
- 完整性: ___
- 流畅性: ___
- 有用性: ___

备注: ___
```

### A/B测试设计

```
对照组: 基础模型(GPT-3.5)
实验组: 微调后模型

测试指标:
- 用户满意度
- 任务完成率
- 平均对话轮次
- 人工评分对比
```

## 常见问题

### Q1:数据量不够怎么办?
**A**:
1. 使用数据增强
2. 先用开源数据预训练
3. 考虑few-shot而不是微调

### Q2:显存不足怎么办?
**A**:
1. 使用QLoRA(4bit量化)
2. 减小batch size,增加梯度累积
3. 使用梯度检查点
4. 换更小的模型

### Q3:训练多久合适?
**A**:
- 监控验证集loss
- 2-3个epoch通常足够
- 过多会过拟合

### Q4:如何判断过拟合?
**A**:
```
正常: train_loss和val_loss都下降
过拟合: train_loss下降,val_loss上升
```

## 检查清单

开始训练前,确认:

```
□ 已选择合适的基础模型
□ 数据已清洗并格式化
□ 训练/验证集已分割
□ 环境配置完成,依赖已安装
□ 已选择微调方法(LoRA/QLoRA/全量)
□ 超参数已配置
□ 评估方案已设计
□ 已设置checkpoint保存
□ 准备了监控脚本
```

## 下一步

准备就绪后,进入实战环节:
- [微调实践](/ai-basics/08-model-training/03-fine-tuning-practice) - 动手完成第一次微调

## 参考资料

- [Hugging Face数据集文档](https://huggingface.co/docs/datasets)
- [Axolotl配置指南](https://github.com/OpenAccess-AI-Collective/axolotl)
- [LLaMA-Factory文档](https://llama-factory.readthedocs.io)
