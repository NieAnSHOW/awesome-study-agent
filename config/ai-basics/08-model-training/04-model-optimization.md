# 模型优化

## 为什么需要优化?

微调后的模型通常面临这些问题:

```
文件大小: 7B模型 = 14GB
推理速度: 生成100字需要5秒
显存占用: 推理需要16GB显存
部署成本: 需要昂贵的GPU服务器
```

优化后:

```
文件大小: 14GB → 4GB (量化)
推理速度: 5秒 → 1秒 (投机采样)
显存占用: 16GB → 6GB (量化+Flash Attention)
部署成本: GPU → CPU (量化)
```

## 优化技术全景

```
模型优化
├── 压缩技术
│   ├── 量化 (Quantization)
│   ├── 剪枝 (Pruning)
│   └── 蒸馏 (Distillation)
├── 推理加速
│   ├── Flash Attention
│   ├── KV Cache
│   ├── 投机采样 (Speculative Decoding)
│   └── 连续批处理 (Continuous Batching)
└── 部署优化
    ├── 模型格式转换
    ├── 批处理优化
    └── 缓存策略
```

## 技术一:量化(Quantization)

### 量化原理

**原理**:降低参数精度,减少模型大小和计算量

```
FP32 (32位浮点): -123.456789012345
FP16 (16位浮点): -123.457
INT8 (8位整数): -123
INT4 (4位整数): -120  ← 精度最低,但压缩比最大
```

### 量化方法对比

| 方法 | 精度 | 模型大小 | 显存需求 | 性能损失 | 适用场景 |
|------|------|---------|---------|---------|---------|
| **FP16** | 高 | 14GB | 16GB | 0% | 高质量要求 |
| **INT8** | 中 | 7GB | 8GB | <1% | 生产环境推荐 |
| **INT4** | 低 | 3.5GB | 4GB | 2-5% | 边缘设备 |

### 量化实战

#### 方法1:GPTQ量化(训练后量化)

```bash
# 安装
pip install auto-gptq

# 量化
python quantize_gptq.py \
  --model Qwen/Qwen2.5-7B \
  --output ./qwen-7b-gptq-int4 \
  --bits 4 \
  --group-size 128
```

**效果**:7B模型从14GB压缩到4GB,精度损失<3%

#### 方法2:AWQ量化(激活感知量化)

```bash
pip install awq

# AWQ在保持精度的同时量化效果更好
python awq/quantize.py \
  --model Qwen/Qwen2.5-7B \
  --w_bit 4 \
  --q_group_size 128 \
  --save_path ./qwen-7b-awq-int4
```

**优势**:相比GPTQ,精度更高,尤其适合4bit量化

#### 方法3:GGUF量化(适合CPU部署)

```bash
# 转换为GGUF格式
python convert-hf-to-gguf.py Qwen/Qwen2.5-7B

# 量化
./quantize \
  qwen-2.5-7b-f16.gguf \
  qwen-2.5-7b-q4_k_m.gguf \
  Q4_K_M

# Q4_K_M:推荐配置,平衡速度和精度
```

**GGUF量化级别**:
```
Q4_K_M: 4-bit,中等矩阵(推荐)
Q5_K_M: 5-bit,更好精度
Q8_0: 8-bit,接近原始精度
```

### 量化对比实验

```
模型: Qwen2.5-7B
测试集: MMLU(知识问答)

精度      大小    显存   MMLU分数
FP32:    14GB    28GB   72.5
FP16:    14GB    16GB   72.5  (无损)
INT8:    7GB     8GB    72.1  (-0.4%)
INT4(GPTQ): 3.5GB 4GB   70.8  (-1.7%)
INT4(AWQ): 3.5GB 4GB   71.5  (-1.0%)
```

**结论**:INT4量化仅损失1-2%精度,但显存减少75%

## 技术二:Flash Attention

### 问题:标准Attention很慢

```python
# 标准Attention
# 需要存储巨大的注意力矩阵(N×N)
attention_matrix = Q @ K.T  # 对于2K上下文,这是4M个元素!
```

### Flash Attention原理

**核心思想**:不计算完整注意力矩阵,分块计算

```
标准Attention:
计算整个矩阵 → 存储内存 → Softmax → 输出
速度慢,显存占用高

Flash Attention:
分块计算 → 即用即弃 → 软最大化 → 输出
速度快2-3倍,显存减半
```

### 使用方法

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    torch_dtype=torch.float16,
    use_flash_attention_2=True,  # 启用Flash Attention 2
    device_map="auto",
)
```

**效果**:
- 推理加速:1.5-2倍
- 显存节省:30-40%
- 长文本性能提升更明显

## 技术三:KV Cache优化

### KV Cache原理

```
生成第1个token: 计算完整attention
生成第2个token: 缓存K1,V1,只计算新token
生成第3个token: 缓存K1-2,V1-2,只计算新token
...
```

### 实现方式

```python
# 启用KV Cache(默认开启)
outputs = model.generate(
    inputs,
    use_cache=True,  # 默认True
    past_key_values=None,
)

# 手动管理KV Cache(高级用法)
past_key_values = None
for i in range(max_new_tokens):
    outputs = model(
        inputs,
        past_key_values=past_key_values,
        use_cache=True,
    )
    past_key_values = outputs.past_key_values
```

### 多级KV Cache

```python
# 量化KV Cache进一步省显存
from transformers import QuantoConfig

quantization_config = QuantoConfig(
    weights="int8",
    activations="int8",
)

model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B",
    quantization_config=quantization_config,
)
```

**效果**:显存再节省20-30%

## 技术四:投机采样(Speculative Decoding)

### 投机采样原理

```
小模型快速预测 → 大模型验证 → 接受/拒绝

示例:
小模型: "今天天气"
大模型: 验证 ✓→ 接受
小模型: "很好,适合"
大模型: 验证 ✓→ 接受
小模型: "出去游玩"
大模型: 验证 ✗→ 拒绝,自己生成
大模型: "散步"
```

### 实现方式

```python
from transformers import AutoModelForCausalLM
from speculative_decoding import speculative_generate

# 大模型(慢但准)
large_model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B")

# 小模型(快但可能不准)
small_model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-1.5B")

# 投机采样
outputs = speculative_generate(
    draft_model=small_model,  # 草稿模型
    target_model=large_model, # 目标模型
    inputs=inputs,
    max_new_tokens=512,
)

# 加速比: 1.5-2倍
```

## 技术五:连续批处理(Continuous Batching)

### 传统批处理问题

```python
# 静态批处理:等所有请求完成
batch = [req1, req2, req3]
# req1很快完成,但要等req3才能处理下一批
# 浪费计算资源
```

### 连续批处理

```python
# 动态批处理:完成一个,添加一个
batch = [req1, req2, req3]
req1完成 → 添加req4
batch = [req2, req3, req4]
req2完成 → 添加req5
batch = [req3, req4, req5]
...
```

### vLLM实现

```bash
pip install vllm

# 启动vLLM服务器
python -m vllm.entrypoints.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --quantization awq \
  --tensor-parallel-size 2

# 请求吞吐量提升3-5倍
```

## 技术六:模型蒸馏(Distillation)

### 蒸馏原理

```
教师模型(大模型,7B)
    ↓ 教授知识
学生模型(小模型,1B)
```

### 蒸馏方法

```python
# 1. 准备教师模型和学生模型
teacher_model = AutoModelForCausalLM.from_pretrained("Qwen2.5-7B")
student_model = AutoModelForCausalLM.from_pretrained("Qwen2.5-1.5B")

# 2. 收集教师模型输出
teacher_outputs = teacher_model.generate(train_data)

# 3. 训练学生模型模仿教师
loss = KL_divergence(
    student_logits,
    teacher_logits,
    temperature=3.0,  # 软化概率分布
)
```

**效果**:
- 模型大小:7B → 1.5B (减少78%)
- 推理速度:提升3-5倍
- 精度损失:5-10%

## 技术七:剪枝(Pruning)

### 剪枝原理

删除不重要的权重,让模型变稀疏

```
密集模型: [0.2, -0.1, 0.8, 0.05, 0.3, ...]
剪枝后:  [0.2, 0,    0.8, 0,    0.3, ...]
         ↑              ↑
    保留重要权重   删除不重要权重(置0)
```

### 结构化剪枝

```python
from transformers import AutoModelForCausalLM
from prune import structured_prune

model = AutoModelForCausalLM.from_pretrained("Qwen2.5-7B")

# 剪枝20%的attention heads
pruned_model = structured_prune(
    model,
    prune_ratio=0.2,
    prune_type="head",  # 剪枝attention head
)

# 模型变稀疏,推理加速
```

## 优化组合策略

### 策略一:极致压缩
```
量化(INT4) + 剪枝(20%) + 蒸馏
模型大小: 14GB → 2GB
精度损失: 5-8%
适用:边缘设备、手机
```

### 策略二:平衡方案
```
量化(INT8) + Flash Attention + KV Cache
模型大小: 14GB → 7GB
推理加速: 2倍
精度损失: <1%
适用:生产环境
```

### 策略三:速度优先
```
Flash Attention + 投机采样 + vLLM
推理加速: 3-5倍
模型大小:不变
适用:高并发场景
```

## 性能对比实验

```
测试环境: RTX 4090
模型: Qwen2.5-7B
任务: 生成1000字

配置              推理时间  显存占用  吞吐量
原始(FP16):        5.2s    14GB     1.0x
+量化(INT8):       3.8s    7GB      1.4x
+量化(INT4):       2.9s    4GB      1.8x
+Flash Attention:  2.1s    3GB      2.5x
+vLLM(batch=8):    0.8s    -        6.5x
+投机采样:         0.5s    -        10x
```

## 工具推荐

### 量化工具
- **auto-gptq**: GPTQ量化
- **auto-awq**: AWQ量化
- **llama.cpp**: GGUF量化,CPU推理

### 推理框架
- **vLLM**: 高吞吐量推理
- **TensorRT-LLM**: NVIDIA加速
- **llama.cpp**: CPU/GPU通用
- **MLC LLM**: 多平台部署

### 压缩工具
- **NVIDIA Model Optimizer**: 综合优化
- **TorchAO**: PyTorch官方优化库

## 实战案例

### 案例1:手机端部署

**需求**:在Android手机运行Qwen2.5-7B

**方案**:
```bash
# 1. 量化到4bit
./quantize qwen-f16.gguf qwen-q4_k_m.gguf Q4_K_M

# 2. 转换为Android格式
python convert_to_android.py qwen-q4_k_m.gguf

# 3. 集成到App
// Kotlin代码
val model = LlamaModel.load(modelPath)
val output = model.generate("你好")
```

**结果**:
- 模型大小:4GB
- 内存占用:5GB
- 推理速度:2-3字/秒

### 案例2:高并发API服务

**需求**:支持100并发用户

**方案**:
```bash
# 使用vLLM + 多GPU
python -m vllm.entrypoints.api_server \
  --model Qwen2.5-7B \
  --tensor-parallel-size 4 \
  --quantization awq \
  --gpu-memory-utilization 0.9
```

**结果**:
- 吞吐量:500请求/秒
- P99延迟:<500ms
- GPU利用率:85%

## 常见问题

### Q1:量化后模型变傻了怎么办?

**A**:
```python
# 1. 尝试不同量化方法
GPTQ → AWQ → GGUF

# 2. 提高量化位数
INT4 → INT5 → INT8

# 3. 使用量化感知训练(QAT)
在微调时就考虑量化
```

### Q2:优化后速度还是慢?

**A**:
```bash
# 1. 检查batch size
batch_size = 1 → 8 → 16

# 2. 使用更小的模型
7B → 3B → 1.5B

# 3. 投机采样
加速1.5-2倍
```

### Q3:如何在CPU上运行?

**A**:
```bash
# 使用GGUF格式
./main -m qwen-q4_k_m.gguf -p "你好" -n 512

# 或者使用llama-cpp-python
pip install llama-cpp-python
```

## 下一步

优化后的模型准备部署:
- [模型部署](/ai-basics/08-model-training/05-deployment) - 部署到生产环境

## 参考资料

- [vLLM文档](https://docs.vllm.ai)
- [GPTQ论文](https://arxiv.org/abs/2210.17323)
- [AWQ论文](https://arxiv.org/abs/2306.00978)
- [Flash Attention 2](https://arxiv.org/abs/2307.08691)
