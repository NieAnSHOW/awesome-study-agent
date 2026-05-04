# 微调实践

## 本章目标

通过完整案例,从零完成一次模型微调。

### 实战项目:医疗问答助手

**目标**:微调一个回答常见医疗问题的模型

**数据**:500条医疗问答对

**模型**:Qwen2.5-7B

**方法**:LoRA

**硬件**:单张RTX 4090(24GB)

## 方案一:使用LLaMA-Factory(推荐新手)

### 安装

```bash
# 克隆仓库
git clone https://github.com/hiyouga/LLaMA-Factory.git
cd LLaMA-Factory

# 安装依赖
pip install -r requirements.txt

# 启动Web界面
python src/train_web.py
```

启动后访问 `http://localhost:7860`

### 准备数据

创建 `medical_qa.json`:

```json
[
  {
    "instruction": "感冒了应该多喝水吗?",
    "input": "",
    "output": "是的,感冒时适量多喝水有助于:\n1. 补充因发热流失的水分\n2. 稀释痰液,缓解咳嗽\n3. 促进新陈代谢\n\n建议喝温水,避免冰饮。如果症状严重,请及时就医。"
  },
  {
    "instruction": "高血压患者日常注意事项",
    "input": "",
    "output": "高血压患者日常应注意:\n\n1. **饮食控制**\n   - 低盐(<6g/天)\n   - 低脂\n   - 多吃蔬果\n\n2. **规律运动**\n   - 每周3-5次\n   - 中低强度\n   - 避免剧烈运动\n\n3. **按时服药**\n   - 不可擅自停药\n   - 定期监测血压\n\n4. **情绪管理**\n   - 保持心态平和\n   - 避免情绪激动\n\n5. **定期复查**\n   - 每月至少测血压2次\n   - 每年全面检查1次"
  }
]
```

### 配置训练参数

在Web界面中填写:

```yaml
模型名称: Qwen/Qwen2.5-7B-Instruct
微调方法: lora
数据集: 自定义数据集(选择medical_qa.json)

学习率: 0.0002
批处理大小: 4
训练轮数: 3
LoRA rank: 8
LoRA alpha: 16

最大长度: 512
```

### 开始训练

点击"开始训练",观察进度:

```
训练进度: 45% (450/1000 steps)
当前损失: 0.345
预计剩余: 25分钟
```

### 测试模型

训练完成后,在"推理"标签页测试:

```
输入: 发烧了物理降温方法有哪些?

输出:
物理降温是安全的退烧方法,包括:

1. **温水擦浴**
   - 用32-34°C温水擦拭身体
   - 重点擦拭腋下、腹股沟
   - 每次15-20分钟

2. **冰袋降温**
   - 放置额头、腋下
   - 用毛巾包裹,避免冻伤

3. **多喝温水**
   - 促进散热
   - 补充水分

注意事项:
- 体温>39°C建议就医
- 儿童慎用冰袋
- 出汗后及时擦干更换衣物
```

### 导出模型

```
导出格式: GGUF / PyTorch
量化位数: Q4_K_M (推荐)
输出路径: ./models/medical-qa-qwen
```

## 方案二:使用Axolotl(推荐进阶)

### Axolotl特点

- 🔥 配置文件驱动,版本可控
- 🚀 性能优化,训练更快
- 📦 支持分布式训练
- 🎨 高度可定制

### 安装

```bash
git clone https://github.com/OpenAccess-AI-Collective/axolotl
cd axolotl
pip install -e .
```

### 配置文件

创建 `medical.yml`:

```yaml
# 模型配置
base_model: Qwen/Qwen2.5-7B
model_type: AutoModelForCausalLM
tokenizer_type: AutoTokenizer

# LoRA配置
lora_r: 8
lora_alpha: 16
lora_dropout: 0.05
lora_target_modules:
  - q_proj
  - v_proj
  - k_proj
  - o_proj
  - gate_proj
  - up_proj
  - down_proj

# 数据配置
datasets:
  - path: medical_qa.json
    type: alpaca
    ds_type: json

# 训练参数
output_dir: ./output/medical-qa
num_train_epochs: 3
max_steps: -1
batch_size: 4
gradient_accumulation_steps: 4
learning_rate: 0.0002
warmup_ratio: 0.03

# 序列长度
sequence_len: 512

# 显存优化
flash_attention: true
gradient_checkpointing: true

# 评估
val_set_size: 0.1
eval_steps: 50

# 保存
save_steps: 100
logging_steps: 10
```

### 启动训练

```bash
# 单GPU
accelerate launch -m axolotl.cli.train medical.yml

# 多GPU
accelerate launch --multi_gpu --num_processes=2 -m axolotl.cli.train medical.yml

# 监控训练
tensorboard --logdir ./output/medical-qa/logs
```

### 训练监控

关键指标:
```bash
# 训练损失
train/loss: 0.345 → 0.212 → 0.156 ✓

# 验证损失
val/loss: 0.389 → 0.298 → 0.278 ✓

# 学习率
train/learning_rate: 2e-4 → 1.8e-4 → 0
```

**正常曲线**:
```
Loss
  │
  │╲
  │ ╲    ╲
  │  ╲    ╲
  │   ╲────╲___
  │
  └───────────── Step
```

**过拟合警示**:
```
Loss
  │
  │ train: ╲___
  │ val:   ╲╱╲↗
  │
  └───────────── Step
         ↑
      停止训练
```

## 方案三:原生Hugging Face(完全掌控)

### 代码实现

```python
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model
from datasets import load_dataset

# 1. 加载模型和分词器
model_path = "Qwen/Qwen2.5-7B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float16,
    device_map="auto",
    trust_remote_code=True,
)

# 2. 配置LoRA
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # 输出可训练参数占比

# 3. 加载数据
dataset = load_dataset("json", data_files="medical_qa.json", split="train")

def format_prompt(example):
    prompt = f"### 指令:\n{example['instruction']}\n\n### 回答:\n{example['output']}"
    return {"text": prompt}

dataset = dataset.map(format_prompt)

def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        truncation=True,
        max_length=512,
        padding="max_length",
    )

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# 4. 训练参数
training_args = TrainingArguments(
    output_dir="./medical-qa-checkpoint",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    warmup_ratio=0.03,
    logging_steps=10,
    save_steps=100,
    eval_steps=50,
    fp16=True,
    gradient_checkpointing=True,
)

# 5. 训练
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

trainer.train()

# 6. 保存模型
model.save_pretrained("./medical-qa-lora")
tokenizer.save_pretrained("./medical-qa-lora")
```

### 推理测试

```python
from peft import PeftModel

# 加载基础模型
base_model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    torch_dtype=torch.float16,
    device_map="auto",
)

# 加载LoRA权重
model = PeftModel.from_pretrained(base_model, "./medical-qa-lora")

# 推理
question = "糖尿病患者饮食禁忌有哪些?"
prompt = f"### 指令:\n{question}\n\n### 回答:\n"

inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=512, temperature=0.7)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)
```

## 进阶技巧

### 1. 多阶段训练

```yaml
# 第一阶段:通用知识
stage1_epochs: 2
stage1_lr: 2e-4

# 第二阶段:专业领域
stage2_epochs: 1
stage2_lr: 1e-4  # 降低学习率

# 第三阶段:指令精调
stage3_epochs: 1
stage3_lr: 5e-5
```

### 3. 类别平衡采样

```python
# 检查类别分布
from collections import Counter
labels = [item['category'] for item in dataset]
print(Counter(labels))

# 输出: {'内科': 300, '外科': 100, '儿科': 100}
# 问题:数据不平衡
from torch.utils.data import WeightedRandomSampler
weights = [1.0/Counter(labels)[label] for label in labels]
sampler = WeightedRandomSampler(weights, len(weights))
```

### 3. 动态学习率调度

```python
from transformers import get_cosine_schedule_with_warmup

scheduler = get_cosine_schedule_with_warmup(
    optimizer,
    num_warmup_steps=100,
    num_training_steps=1000,
)
# 学习率从0升到2e-4,再按cosine曲线降到0
```

### 5. 混合精度训练

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

for batch in dataloader:
    with autocast():  # 自动混合精度
        loss = model(**batch)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

## 常见问题排查

### 问题1:显存溢出(OOM)

**现象**:
```
RuntimeError: CUDA out of memory
```

**解决方案**:
```python
# 1. 减小batch size
batch_size: 4 → 2

# 2. 增加梯度累积
gradient_accumulation_steps: 2 → 4

# 3. 启用梯度检查点
gradient_checkpointing: true

# 4. 减小序列长度
max_length: 1024 → 512

# 5. 使用4bit量化
load_in_4bit: true
```

### 问题2:训练不收敛

**现象**:
```
Step 100: loss=0.5
Step 200: loss=1.2  ← 上升了!
Step 300: loss=2.1  ← 继续上升!
```

**解决方案**:
```python
# 1. 降低学习率
learning_rate: 2e-4 → 5e-5

# 2. 检查数据质量
# 找出导致loss激增的样本

# 3. 增加warmup
warmup_ratio: 0.03 → 0.1

# 4. 检查梯度裁剪
max_grad_norm: 1.0
```

### 问题3:效果提升不明显

### 可能原因:
1. 数据量不足(<1000条)
2. 数据质量差
3. 基础模型选择不当
4. 任务不适合微调

**排查步骤**:
```bash
# 1. 检查数据
python check_data.py --data medical_qa.json

# 2. 人工评估
python evaluate.py --samples 100

# 3. 对比基线
python compare.py --base_model qwen --ft_model medical-qa
```

## 成功案例分享

### 案例1:法律咨询助手

**任务**:法律问答

**数据**:3000条法律问答对

**方法**:QLoRA

**结果**:
- 准确率:65% → 82%
- 用户满意度提升40%

### 案例2:代码生成模型

**任务**:生成SQL查询

**数据**:5000条(问题,SQL)对

**方法**:LoRA + DeepSeek-Coder

**结果**:
- SQL正确率:70% → 91%
- 实际部署使用

### 案例3:客户服务机器人

**任务**:客服对话

**数据**:10000条真实客服对话

**方法**:全量微调

**结果**:
- 问题解决率提升35%
- 平均对话轮次减少20%

### 性能优化建议

#### 训练加速

```yaml
# 1. Flash Attention
flash_attention: true  # 加速20-30%

# 2. 深度速度ZeRO
deepspeed: zero2  # 多GPU优化

# 3. 混合精度
fp16: true  # 加速,省显存

# 4. 数据预加载
dataloader_num_workers: 4
```

#### 质量提升

```yaml
# 1. 更大的rank
lora_r: 8 → 16  # 效果更好但更慢

# 2. 更多数据
500条 → 5000条  # 明显提升

# 3. 数据质量优先
高质量1000条 > 低质量10000条

# 4. 多阶段训练
先通用再专业
```

## 下一步

微调完成后:
- [模型优化](/basics/08-model-training/04-model-optimization) - 量化、剪枝等优化技术

## 参考资料

- [LLaMA-Factory文档](https://github.com/hiyouga/LLaMA-Factory)
- [Axolotl教程](https://github.com/OpenAccess-AI-Collective/axolotl)
- [Hugging Face PEFT](https://huggingface.co/docs/peft)
