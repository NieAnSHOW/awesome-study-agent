# 本地部署方案

> 万亿参数模型跑在消费级显卡上？从量化到推理的全流程部署指南 | 预计阅读时间：25 分钟

---

## 一、引言

DeepSeek V4 发布以后，我收到最多的问题不是"模型能做什么"，而是"我能在自己电脑上跑吗"。

这个问题之所以被反复问，原因很直接：DeepSeek V4 在 API 评测上表现亮眼，但 API 调用毕竟不是本地运行——你的数据要经过别人的服务器，你的请求受限于别人的频率限制，你的隐私取决于别人的安全策略。对于企业用户、数据敏感行业、以及想要深度定制的开发者来说，本地部署是刚需。

但 V4 不是一个小模型。Pro 版本 1.6T 总参数、49B 激活参数，Flash 版本 284B 总参数、13B 激活参数——光看数字就知道这不是随便一台笔记本能跑的东西。好在 DeepSeek 在模型设计上做了一些关键取舍，使得它在合理硬件上依然具备部署可行性：

- **MoE 架构**：每次推理只激活部分参数（Flash 仅 13B），实际计算量远低于总参数量
- **FP4 原生量化**：模型权重本身就是混合精度，不需要额外的后训练量化步骤
- **MIT 协议**：没有任何商业使用限制，可以自由部署到任意环境
- **开源权重**：权重完全公开，可以从 HuggingFace 直接下载

本地部署的意义可以归纳为三个方面：

**隐私与安全。** 对于医疗、金融、法律等数据敏感行业，把业务数据发送到第三方 API 是不可接受的。本地部署意味着所有数据都在自己的硬件上处理，不出内网。

**成本可控。** API 按 token 计费，高频调用时成本会很快累积。如果机器已经买了，本地推理的边际成本接近零——只有电费。

**延迟最小化。** API 调用在最好的情况下也有 100-300ms 的网络延迟。本地推理省去了网络传输时间，对于强实时性场景（如代码补全、对话 Agent）有明显优势。

当然，本地部署也有代价：你需要自己管理硬件、配置环境、处理依赖冲突。但好消息是，社区工具已经大幅降低了这个门槛。这篇文章会覆盖从模型下载到生产部署的完整流程。

---

## 二、开源协议

### 2.1 MIT 意味着什么

DeepSeek V4 采用 MIT 开源协议。这不是一个"部分开源"或"仅研究使用"的协议——MIT 是目前最宽松的开源许可之一，它只要求你在分发时保留版权声明，除此之外几乎没有限制。

具体来说，MIT 协议允许你：

- **任意使用**：无论是研究、个人项目还是商业产品
- **任意修改**：对模型权重进行量化、剪枝、蒸馏等操作
- **任意分发**：可以重新打包、二次发布，甚至捆绑到商业产品中销售
- **任意部署**：可以被集成到 SaaS 平台、内部系统、嵌入式设备中

唯一的义务只有一条：在软件或文档中保留原始版权声明。

### 2.2 与主流开源协议的对比

| 协议 | DeepSeek V4 | Llama 3.1 | Qwen 2.5 | GLM-4 |
|------|-------------|-----------|----------|-------|
| 协议类型 | MIT | Llama 3.1 Community | Apache 2.0 | GLM-4 |
| 商业使用 | 完全允许 | 月活 7 亿以下免费，以上需授权 | 完全允许 | 完全允许 |
| 模型再分发 | 允许 | 有条件 | 允许 | 允许 |
| 修改后分发 | 允许 | 有条件 | 允许 | 允许 |
| 是否需要申请 | 不需要 | 需要填写申请表 | 不需要 | 不需要 |
| 最长上下文 | 1M | 128K | 128K | 128K |

对比下来，DeepSeek V4 的 MIT 协议在商业自由度上是最高的。Llama 3.1 虽然也允许商业使用，但附加了月活用户数的限制——如果你的产品用户量大了，需要额外申请授权。DeepSeek V4 没有这个限制，无论你的用户是 100 人还是 1 亿人，协议条款不会变。

### 2.3 协议对部署的影响

MIT 协议为本地部署提供了两个直接的好处：

第一，**你可以在内网部署而不需要任何外部授权**。不需要向 DeepSeek 申请许可，不需要签署 NDA，不需要定期汇报使用情况。下载权重、部署服务、投入使用——三步走完。

第二，**你可以基于 V4 二次开发并商业化**。包括但不限于：对模型做领域微调后作为商业 API 出售，将量化后的模型嵌入到硬件设备中，基于 V4 构建 SaaS 平台。这些在 MIT 协议下都是完全合法的。

---

## 三、模型权重获取

### 3.1 权重发布渠道

DeepSeek V4 的权重通过两个主流平台发布：

| 平台 | 模型名 | 下载方式 | 国内访问速度 |
|------|--------|---------|-------------|
| HuggingFace | `deepseek-ai/DeepSeek-V4-Pro` | `git lfs` 或 `huggingface-cli` | 较慢，建议使用镜像 |
| HuggingFace | `deepseek-ai/DeepSeek-V4-Pro-Base` | `git lfs` 或 `huggingface-cli` | 较慢，建议使用镜像 |
| HuggingFace | `deepseek-ai/DeepSeek-V4-Flash` | `git lfs` 或 `huggingface-cli` | 较慢，建议使用镜像 |
| HuggingFace | `deepseek-ai/DeepSeek-V4-Flash-Base` | `git lfs` 或 `huggingface-cli` | 较慢，建议使用镜像 |
| ModelScope | `deepseek-ai/DeepSeek-V4-Flash` | `modelscope` CLI | 快（国内服务器） |
| ModelScope | `deepseek-ai/DeepSeek-V4-Pro` | `modelscope` CLI | 快（国内服务器） |

Base 版本是未经过指令微调的基座模型，主要适用于微调和研究场景。如果你直接用于对话，推荐下载 Instruct 版本（即没有 -Base 后缀的版本）。

### 3.2 下载方法

**方法一：使用 HuggingFace CLI**

```bash
# 安装
pip install huggingface_hub

# 下载 Flash Instruct 版本（约 160 GB）
huggingface-cli download deepseek-ai/DeepSeek-V4-Flash \
    --local-dir ./models/DeepSeek-V4-Flash \
    --resume-download

# 下载 Pro Instruct 版本（约 320 GB）
huggingface-cli download deepseek-ai/DeepSeek-V4-Pro \
    --local-dir ./models/DeepSeek-V4-Pro \
    --resume-download
```

如果使用 HuggingFace 镜像（国内用户推荐）：

```bash
# 设置镜像环境变量
export HF_ENDPOINT=https://hf-mirror.com

# 下载 Flash
huggingface-cli download deepseek-ai/DeepSeek-V4-Flash \
    --local-dir ./models/DeepSeek-V4-Flash \
    --resume-download
```

**方法二：使用 ModelScope CLI**

```bash
# 安装
pip install modelscope

# 下载 Flash
modelscope download deepseek-ai/DeepSeek-V4-Flash \
    --local-dir ./models/DeepSeek-V4-Flash

# 下载 Pro
modelscope download deepseek-ai/DeepSeek-V4-Pro \
    --local-dir ./models/DeepSeek-V4-Pro
```

对于国内用户，ModelScope 的下载速度显著更快——服务器在国内，可以跑满带宽。

**方法三：使用 Git LFS**

```bash
# 安装 git lfs
git lfs install

# 克隆 Flash 模型（注意：只拉取推理所需的最小文件集）
GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash
cd DeepSeek-V4-Flash

# 只下载需要的文件
git lfs pull --include "*.safetensors"
```

### 3.3 文件结构

下载完成后，模型目录的结构如下：

```
DeepSeek-V4-Flash/
├── config.json              # 模型配置（架构参数、词表大小等）
├── tokenizer.json           # Tokenizer 文件
├── tokenizer_config.json    # Tokenizer 配置
├── model-00001-of-000XX.safetensors  # 模型权重分片文件
├── model-00002-of-000XX.safetensors
├── ...
├── model.safetensors.index.json      # 权重分片索引
└── special_tokens_map.json           # 特殊 token 映射
```

Flash 版本的权重文件数量取决于量化精度：

| 量化精度 | 文件数量 | 总大小 |
|---------|---------|--------|
| FP8/FP4 原生 | ~30 个分片 | ~160 GB |
| Q8_0 GGUF | 单文件 | ~282 GB |
| Q4_K_M GGUF | 单文件 | ~160 GB |
| IQ4_XS GGUF | 单文件 | ~130 GB |

Pro 版本的体积大约是 Flash 的两倍，原生权重约 320 GB，量化后约 200-280 GB。

---

## 四、量化方案详解

### 4.1 为什么要量化

DeepSeek V4 的模型权重非常大——即使是较小的 Flash 版本，原生 FP8/FP4 混合精度也有约 160 GB。这意味着一块消费级显卡根本放不下。

量化的核心思路是把模型权重的数值精度降低，从而减少显存占用。举个直观的例子：一个 40 亿参数的模型，如果用 FP32（4 字节/参数）存储，需要 16 GB 显存；降到 INT4（0.5 字节/参数），只需要 2 GB。量化就是在"模型大小"和"模型质量"之间做取舍。

### 4.2 V4 的 FP4 原生量化优势

DeepSeek V4 与其他模型在量化上有一个根本区别：**它的权重本身就是量化后的**。

大部分大模型的训练和推理都在 FP16 或 BF16 精度下进行，量化是一个后处理步骤——训练完成后，额外跑一遍量化校准流程。而 DeepSeek V4 在预训练阶段就使用了 FP8/FP4 混合精度方案，模型权重天然就是量化状态。

这意味着两件事：

- **不需要额外的量化校准**。大多数模型在做 INT4 量化时，需要准备一个校准数据集（calibration dataset），跑一遍 FP16→INT4 的转换过程，这个过程可能还需要微调量化参数来减少精度损失。V4 不需要这一步——权重直接下载就能用。

- **原生量化的质量优势**。因为量化在训练阶段就参与计算了，模型在量化状态下的行为分布已经被优化过。相比之下，后训练量化（PTQ）会在权重转换时引入额外的精度损失，且这个损失很难完全恢复。

简单说，V4 的 INT4 精度比其他模型做 PTQ 后的 INT4 更接近无损。

### 4.3 主流量化方案对比

对于需要进一步压缩的用户，社区已经提供了多种量化方案：

| 量化方案 | 位宽 | Flash 体积 | 质量影响 | 推荐场景 |
|---------|------|-----------|---------|---------|
| FP8/FP4 原生 | 8/4 bit 混合 | ~160 GB | 基准线 | 生产部署，有充足显存 |
| Q8_0 GGUF | 8 bit | ~282 GB | 几乎无损 | GGUF 格式的最优起点 |
| Q6_K GGUF | 6 bit | ~210 GB | 接近无损 | 高端显卡方案 |
| Q4_K_M GGUF | 4 bit | ~160 GB | 微小下降 | 消费级显卡推荐 |
| Q4_K_S GGUF | 4 bit | ~150 GB | 小幅下降 | 显存极度紧张 |
| IQ4_XS GGUF | 4 bit | ~130 GB | 小幅下降 | 极致压缩 |
| IQ3_M GGUF | 3 bit | ~100 GB | 明显下降 | 仅测试用途 |

其中 Q4_K_M 是性价比最高的方案——体积只有原生的 1/2 左右，但质量损失在实际使用中几乎不可感知。

### 4.4 量化后的模型大小

不同量化精度下，两个版本在显存中的实际占用：

| 方案 | Flash 磁盘大小 | Flash 显存占用 | Pro 磁盘大小 | Pro 显存占用 |
|------|---------------|---------------|-------------|-------------|
| FP8/FP4 原生 | ~160 GB | ~170 GB | ~320 GB | ~340 GB |
| Q4_K_M | ~160 GB | ~170 GB | ~220 GB | ~240 GB |
| IQ4_XS | ~130 GB | ~140 GB | ~200 GB | ~210 GB |

注意：显存占用大于磁盘大小，原因在于推理时需要额外存储 KV Cache 和中间激活值。Q4_K_M 的磁盘和原生差不多，但在推理时因为精度统一，显存利用率更高。

### 4.5 量化在实践中的质量影响

量化对模型质量的影响因任务类型而异。我参考了社区测试数据：

| 任务类型 | Q4_K_M vs 原生 | IQ4_XS vs 原生 |
|---------|---------------|----------------|
| 通用对话 | 几乎无差异 | 几乎无差异 |
| 代码生成 | 差异 < 1% | 差异 ~1-2% |
| 数学推理 | 差异 < 1% | 差异 ~2-3% |
| 长文档理解 | 差异 < 1% | 差异 ~1% |
| 复杂 Agent 任务 | 差异 ~1-2% | 差异 ~3-5% |

对于绝大部分使用场景来说，Q4_K_M 量化后的质量损失可以忽略。如果你对质量极其敏感（比如跑 Agent 评测），可以保留原生 FP8/FP4 格式。

---

## 五、硬件需求指南

### 5.1 推理显存估算方法

推理所需的显存主要由三部分组成：

1. **模型权重**：取决于参数量和量化精度
2. **KV Cache**：取决于序列长度和 batch size
3. **中间激活值**：取决于模型层数和 batch size

一个粗略的估算公式：

```
显存 ≈ 权重大小 × 1.2 + 序列长度 × 层数 × batch_size × 2KB
```

系数 1.2 是为 KV Cache 和中间激活预留的余量。

### 5.2 硬件方案对比

以下方案选取了市面主流的 GPU 配置，评估能否运行量化后的 V4 模型：

| 硬件方案 | 显存 | 可运行的模型 | 预期推理速度 | 估算成本 |
|---------|------|-------------|-------------|---------|
| 单张 RTX 4090 | 24 GB | 不可运行 V4（仅适配 7-13B 小模型） | — | ~1.5万 |
| 双路 RTX 4090 | 48 GB | 不可运行 V4（Flash Q4 需要 ~170 GB） | — | ~3万 |
| 单张 RTX 5090 | 32 GB | 不可运行完整 V4 | — | ~2万 |
| 4× RTX 5090 | 128 GB | Flash Q4_K_M（需进一步量化 IQ3） | 1-3 tok/s | ~8万 |
| 双路 RTX 5090 | 64 GB | 不可运行 V4 | — | ~4万 |
| 8× RTX 4090 | 192 GB | Flash Q4_K_M（勉强） | 5-10 tok/s | ~12万 |
| 单张 H100 80GB | 80 GB | 不可运行完整 V4 | — | ~25万 |
| 双路 H100 80GB | 160 GB | Flash Q4_K_M | 40-80 tok/s | ~50万 |
| 4× H100 80GB | 320 GB | Flash 原生 / Pro Q4_K_M | 15-30 tok/s | ~100万 |
| 8× H100 80GB | 640 GB | Pro 原生 | 15-30 tok/s | ~200万 |
| 4× A100 80GB | 320 GB | Flash 原生 / Pro Q4_K_M | 25-50 tok/s | ~80万 |
| 8× A100 40GB | 320 GB | Flash 原生 | 15-30 tok/s | ~60万 |
| Mac Studio M3 Ultra 192GB | 192 GB（统一内存） | Flash Q4_K_M（使用 MLX 或 llama.cpp） | 5-15 tok/s | ~7万 |
| Mac Studio M3 Ultra 256GB | 256 GB（统一内存） | Flash 原生 | 5-15 tok/s | ~10万 |
| 双路 H200 141GB | 282 GB | Flash 原生 | 50-100 tok/s | ~80万 |
| 16× H100 80GB | 1.28 TB | Pro 原生 + 长上下文 | 15-30 tok/s | ~400万 |

**关键结论：**

- **Flash Q4_K_M** 的最低门槛是 4× RTX 5090（128 GB 显存）或双路 H100（160 GB），或者 Apple Silicon 的 192 GB 统一内存方案
- **Flash 原生** 需要 4× H100/A100（至少 320 GB）
- **Pro Q4_K_M** 需要 4-8× H100（240-320 GB）
- **Pro 原生** 需要 8-16× H100（640 GB+）
- **消费级显卡（RTX 4090/5090 单卡或双卡）不足以运行完整 V4**。V4 的设计目标是"能在硬件上跑"但没打算在消费级硬件上跑

### 5.3 Apple Silicon 方案的可行性

Apple Silicon 的优势在于统一内存架构——M3 Ultra 最高支持 256 GB 统一内存，这意味着 GPU 可以直接访问所有内存，不存在"显存不够、CPU/GPU 之间拷贝数据"的问题。

实际部署效果：

| 硬件 | 模型 | 量化 | 推理速度 | 体验 |
|------|------|------|---------|------|
| M3 Ultra 192GB | Flash | Q4_K_M | 8-12 tok/s | 可用，适合个人使用 |
| M3 Ultra 256GB | Flash | 原生 | 6-10 tok/s | 可用，个人使用 |
| M2 Ultra 192GB | Flash | Q4_K_M | 5-8 tok/s | 略慢但可用 |

Apple Silicon 方案对于个人开发者来说性价比很高——一台 Mac Studio M3 Ultra 192GB 的价格大约 7 万人民币，远低于 4× H100 的配置，虽然速度慢一些，但对于个人对话、代码辅助等场景完全够用。

### 5.4 企业级参考配置

对于需要服务多用户的企业场景，建议以下配置：

**方案 A：中端生产部署（推荐）**
- 硬件：4× H100 80GB 或 4× A100 80GB
- 模型：Flash 原生或 Q4_K_M
- 场景：内部知识库问答、代码辅助、文档分析
- 并发：支持 10-20 个并发请求
- 估算成本：80-100 万硬件 + 运维

**方案 B：高端生产部署**
- 硬件：8× H100 80GB
- 模型：Pro Q4_K_M
- 场景：Agent 系统、高精度推理、复杂编码
- 并发：支持 10-20 个并发请求（Pro 较慢）
- 估算成本：200 万硬件 + 运维

**方案 C：极致离线批处理**
- 硬件：16× H100 80GB
- 模型：Pro 原生
- 场景：大规模离线推理、自动数据标注
- 并发：高吞吐批处理模式
- 估算成本：400 万+硬件 + 运维

---

## 六、Ollama 快速上手

### 6.1 为什么选 Ollama

Ollama 是目前上手本地大模型最简单的工具。它的设计哲学和 Docker 很像——你不需要关心底层依赖，不需要手动编译 CUDA 内核，不需要配置 Python 环境。装好 Ollama，一行命令拉模型，一行命令启动推理。

对于只是想快速体验 V4 的开发者来说，Ollama 是最快的路径。

### 6.2 安装 Ollama

**Linux / macOS：**

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**macOS（Homebrew）：**

```bash
brew install ollama
```

**Windows：** 从 Ollama 官网下载安装程序，或通过 WSL2 安装 Linux 版本。

安装完成后，验证版本：

```bash
ollama --version
# 输出类似：ollama version 0.3.8
```

### 6.3 拉取 V4 模型

Ollama 官方模型库中尚未收录 V4 的官方量化版本，但社区已经贡献了多种量化版本。拉取方式如下：

```bash
# 拉取 Flash Q4_K_M（推荐，质量/体积最佳平衡）
ollama pull deepseek-v4-flash:q4_k_m

# 拉取 Flash 原生（需更大显存）
ollama pull deepseek-v4-flash

# 拉取 Pro Q4_K_M
ollama pull deepseek-v4-pro:q4_k_m
```

如果使用镜像加速：

```bash
# 设置 Ollama 使用镜像（国内用户）
export OLLAMA_HOST=http://localhost:11434
ollama pull deepseek-v4-flash:q4_k_m
```

下载完成后，可以用 `ollama list` 查看已拉取的模型：

```bash
ollama list

# 输出示例：
# NAME                                ID              SIZE      MODIFIED
# deepseek-v4-flash:q4_k_m            abcdef123456    160 GB    2 minutes ago
```

### 6.4 运行推理

```bash
# 直接运行对话
ollama run deepseek-v4-flash:q4_k_m
```

启动后进入交互式对话模式，你可以直接输入问题和模型对话。

如果需要一次性问题：

```bash
# 单次问答（非交互模式）
ollama run deepseek-v4-flash:q4_k_m "请用 Python 写一个快速排序算法"
```

### 6.5 API 访问

Ollama 启动后默认在本地 `11434` 端口提供 OpenAI 兼容的 API 服务。你可以在任何支持 OpenAI API 的工具中配置使用。

**检查 Ollama 服务状态：**

```bash
# 确认服务正在运行
curl http://localhost:11434/api/tags
```

**使用 curl 调用推理 API：**

```bash
curl http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash:q4_k_m",
    "messages": [
      {"role": "user", "content": "解释一下什么是 MoE 架构"}
    ],
    "stream": false
  }'
```

**使用 OpenAI Python SDK 访问 Ollama：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",  # Ollama 的 OpenAI 兼容端点
    api_key="ollama"  # Ollama 不需要真实 API Key，但字段不能为空
)

response = client.chat.completions.create(
    model="deepseek-v4-flash:q4_k_m",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "什么是 Transformer 架构？"}
    ],
    stream=False
)

print(response.choices[0].message.content)
```

**配置任意 OpenAI 兼容客户端：**

```
Base URL: http://localhost:11434/v1
API Key: ollama（任意字符串，Ollama 不校验）
Model: deepseek-v4-flash:q4_k_m
```

这意味着你可以在 Cursor、Continue、ChatGPT Next Web 等工具中直接配置 Ollama 作为后端。

### 6.6 Ollama 性能调优

Ollama 默认配置偏向保守。一些实用调优参数：

```bash
# 设置并发请求数（默认 1，调高后可以多用户同时使用）
export OLLAMA_NUM_PARALLEL=4

# 设置最大加载模型数
export OLLAMA_MAX_LOADED_MODELS=2

# 设置单次请求最大 token 输出（默认 2048）
export OLLAMA_MAX_TOKENS=16384

# 设置 KV Cache 大小（显存充足时可以提高）
export OLLAMA_KV_CACHE_TYPE=q8_0
```

生产环境中建议将这些配置写入 `~/.ollama/config.json` 或系统环境变量。

---

## 七、vLLM 生产部署

### 7.1 为什么选 vLLM

如果 Ollama 是"拿来就能跑"的瑞士军刀，那 vLLM 就是"扛得住生产压力"的工业引擎。

vLLM 的优势在于：

- **PagedAttention**：高效管理 KV Cache，显存利用率远超常规方案
- **连续批处理**：动态聚合多个推理请求，大幅提升吞吐量
- **OpenAI 兼容 API**：开箱即用，无需额外适配
- **多 GPU 张量并行**：天然支持多卡分布式推理
- **Prefix Caching**：缓存公共前缀的计算结果，降低重复计算

对于需要服务多用户、高并发的生产场景，vLLM 是首选。

### 7.2 安装 vLLM

**使用 pip 安装（推荐）：**

```bash
# 创建独立 Python 环境
python3 -m venv vllm-env
source vllm-env/bin/activate

# 安装 vLLM
pip install vllm

# 验证安装
python -c "import vllm; print(vllm.__version__)"
```

**从源码安装（需要最新特性时）：**

```bash
git clone https://github.com/vllm-project/vllm.git
cd vllm
pip install -e .
```

**硬件要求：**

- Linux 操作系统（推荐 Ubuntu 22.04+）
- NVIDIA GPU（Compute Capability 8.0+，即 Ampere 架构或更新）
- CUDA 12.1+
- 至少 32 GB 系统内存

### 7.3 模型加载与推理服务启动

**启动 Flash 模型推理服务：**

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --dtype auto \
    --max-model-len 32768 \
    --gpu-memory-utilization 0.90 \
    --port 8000
```

参数说明：

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `--model` | 模型路径或 HuggingFace 模型名 | 本地路径或 `deepseek-ai/DeepSeek-V4-Flash` |
| `--tensor-parallel-size` | 张量并行数（使用的 GPU 数量） | 等于 GPU 数量 |
| `--dtype` | 推理精度 | `auto`（自动检测） |
| `--max-model-len` | 最大序列长度 | 根据显存调整 |
| `--gpu-memory-utilization` | GPU 显存利用率上限 | 0.85-0.95 |
| `--port` | HTTP 服务端口 | 8000 |

**启动 Pro 模型（需要更多 GPU）：**

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Pro \
    --tensor-parallel-size 8 \
    --dtype auto \
    --max-model-len 16384 \
    --gpu-memory-utilization 0.90 \
    --port 8000
```

### 7.4 调用推理服务

vLLM 启动后提供完全 OpenAI 兼容的接口：

```python
from openai import OpenAI

# 连接到本地 vLLM 服务
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="token-abc123"  # vLLM 的默认 API Key 格式
)

# 基本对话
response = client.chat.completions.create(
    model="/path/to/DeepSeek-V4-Flash",  # 或模型名称
    messages=[
        {"role": "system", "content": "你是一个有用的 AI 助手。"},
        {"role": "user", "content": "解释一下张量并行和流水线并行的区别。"}
    ],
    max_tokens=1024,
    temperature=0.7,
    stream=False
)

print(response.choices[0].message.content)
```

### 7.5 批处理配置

vLLM 的批处理能力是它的核心优势。通过合理配置，可以在显存允许的范围内最大化吞吐：

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --max-num-seqs 64 \          # 最大并发序列数
    --max-num-batched-tokens 8192 \  # 每批最大 token 数
    --gpu-memory-utilization 0.95 \
    --port 8000
```

| 参数 | 作用 | 显存充足时 | 显存受限时 |
|------|------|-----------|-----------|
| `--max-num-seqs` | 最大并发处理序列数 | 64-128 | 16-32 |
| `--max-num-batched-tokens` | 一批中最大 token 数 | 8192-16384 | 4096 |
| `--gpu-memory-utilization` | 显存利用率 | 0.95 | 0.85 |

对于内部服务场景（5-20 个并发用户），建议 `max-num-seqs=64` 配合 `gpu-memory-utilization=0.90`，这个配置在吞吐和稳定性之间取得了较好的平衡。

### 7.6 SGLang 作为替代方案

除了 vLLM，SGLang 也是一个值得关注的生产部署框架。它在某些场景下的性能甚至优于 vLLM：

| 对比维度 | vLLM | SGLang |
|---------|------|--------|
| 核心优势 | PagedAttention、生态成熟 | RadixAttention、前缀缓存优化更激进 |
| 前缀缓存 | 支持 | 更强（RadixAttention 自动缓存） |
| 多模态支持 | 有限 | 更好 |
| 社区规模 | 更大 | 增长中 |
| 部署文档 | 完善 | 逐步完善 |

如果 vLLM 在你的场景下遇到性能瓶颈，SGLang 是一个值得尝试的替代。安装方式类似：

```bash
pip install sglang[all]

python -m sglang.launch_server \
    --model-path /path/to/DeepSeek-V4-Flash \
    --tp 4 \
    --port 8000
```

---

## 八、性能调优

### 8.1 显存优化

显存是本地部署 V4 最稀缺的资源。以下策略可以有效降低显存占用：

**开启 Flash Attention：**

```bash
# vLLM 默认开启，Ollama 需要手动配置
export OLLAMA_FLASH_ATTENTION=1
```

Flash Attention 通过重新排列注意力计算顺序，将 Attention 的显存复杂度从 O(n²) 降到 O(n)，对于长序列特别有效。在 vLLM 中默认启用。

**使用 KV Cache 量化：**

KV Cache 是长序列推理时最大的显存消耗源之一。将其从 FP16 量化到 INT8 可以节省约 50% 的 KV Cache 显存，而质量影响极小。

```bash
# vLLM 配置 KV Cache 量化
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --kv-cache-dtype fp8 \       # KV Cache 使用 FP8
    --gpu-memory-utilization 0.90 \
    --port 8000
```

**调整 max-model-len：**

不一定要用满 1M 上下文。对于大多数实际场景，32K-128K 的上下文窗口已经完全够用。减小 max-model-len 可以显著减少 KV Cache 占用：

```bash
# 限制最大序列长度到 32K
--max-model-len 32768
```

**显存使用速查表：**

| 优化措施 | Flash 显存节省 | Pro 显存节省 | 质量影响 |
|---------|---------------|-------------|---------|
| Flash Attention | ~10% | ~10% | 无 |
| KV Cache FP8 | ~20-30% | ~20-30% | 极微 |
| 限制 max-model-len 到 32K | ~15% | ~15% | 视场景而定 |
| 降低 gpu-memory-utilization | 保护显存 | 保护显存 | 无 |

### 8.2 KV Cache 配置

KV Cache 的大小直接决定了你能处理多长的上下文和多少并发。

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --max-num-seqs 32 \          # 每块 GPU 并发请求数
    --max-model-len 32768 \      # 最大序列长度
    --kv-cache-dtype fp8 \       # KV Cache 量化
    --gpu-memory-utilization 0.90 \
    --port 8000
```

KV Cache 大小的粗略公式：

```
KV Cache 大小 ≈ 序列长度 × 层数 × (隐藏维度 × 2) × 缓存精度字节数 × batch_size
```

对于 V4 Flash：

| 序列长度 | 并发 1 | 并发 4 | 并发 16 |
|---------|--------|--------|---------|
| 4K | ~2 GB | ~8 GB | ~32 GB |
| 16K | ~8 GB | ~32 GB | ~128 GB |
| 32K | ~16 GB | ~64 GB | 显存不足 |
| 128K | ~64 GB | 显存不足 | 显存不足 |

这个表说明了一个重要事实：**长序列和高并发不可兼得**。如果你需要处理 128K 以上的长文档，每块 GPU 的并发数最好控制在 1-2。

### 8.3 Prefix Caching

Prefix Caching 是 vLLM 的一个关键特性——当多个请求共享相同的前缀（比如相同的 system prompt 或用户输入）时，只需要计算一次。

**在 vLLM 中启用：**

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --enable-prefix-caching \    # 启用前缀缓存
    --gpu-memory-utilization 0.90 \
    --port 8000
```

**适用场景：**

- **Agent 工作流**：多个 Agent 共享相同的 system prompt 和工具定义，缓存命中率极高
- **知识库问答**：同一份文档被反复检索，前缀缓存可以大幅降低延迟
- **批量评估**：多个测试用例使用相同指令模板

在一个典型的 Agent 部署场景中，Prefix Caching 可以将首 token 延迟降低 40-60%，显著改善用户体验。

### 8.4 连续批处理

vLLM 的连续批处理（Continuous Batching）是它吞吐量领先的核心技术。

传统批处理方式是"等待一批请求集齐后再统一处理"——这个等待时间浪费了 GPU 算力。连续批处理的做法是：只要 GPU 有空闲，就立即把新的请求加入当前正在处理的批次中。

**配置要点：**

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --max-num-seqs 64 \       # 批次最大容量
    --max-num-batched-tokens 8192 \  # 每批最大 token 数
    --gpu-memory-utilization 0.90 \
    --port 8000
```

实践中的调优经验：

- 如果用户请求短（几十到几百 token），增加 `max-num-seqs` 到 64-128
- 如果用户请求长（数千 token），降低 `max-num-seqs` 到 16-32
- `max-num-batched-tokens` 大约是 `max-num-seqs × 平均序列长度`
- 设得太大会因为显存不足而报错，设得太小会浪费 GPU 算力

### 8.5 推理框架性能对比

| 框架 | 首 token 延迟 | 吞吐量 | 显存效率 | 推荐场景 |
|------|-------------|--------|---------|---------|
| vLLM | 中等 | 最高 | 最高 | 生产部署、多用户 |
| Ollama | 低（仅单用户） | 中等 | 中等 | 个人使用、快速上手 |
| SGLang | 低 | 高 | 高 | 需要前缀缓存优化 |
| llama.cpp | 低（个人） | 低 | 中等 | Apple Silicon、CPU 推理 |
| TensorRT-LLM | 最低 | 最高 | 最高 | 极致优化、企业部署 |

---

## 九、常见问题

### 9.1 显存不足怎么办

这是本地部署 V4 最常见的问题。如果启动时报错 "CUDA out of memory"，按以下顺序排查：

**第一步：检查实际显存需求**

```bash
# 查看 GPU 显存
nvidia-smi

# 估算 V4 的显存需求
# Flash Q4_K_M: ~170 GB
# Flash 原生: ~180 GB
# Pro Q4_K_M: ~240 GB
```

**第二步：调整模型加载配置**

如果显存接近但不够，尝试以下调整：

1. 降低 `--gpu-memory-utilization` 到 0.85
2. 减小 `--max-model-len` 到 16384
3. 启用 `--kv-cache-dtype fp8`
4. 降低 `--max-num-seqs` 到 8

```bash
# 显存紧张时的保守配置
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --max-model-len 16384 \
    --max-num-seqs 8 \
    --kv-cache-dtype fp8 \
    --gpu-memory-utilization 0.85 \
    --port 8000
```

**第三步：考虑更激进的量化**

如果原生 Q4_K_M 也装不下，尝试 IQ4_XS 或 Q3_M。代价是模型质量会有一定下降，但至少能跑起来。

**第四步：考虑更换硬件方案**

如果尝试了所有优化后仍然显存不足，说明当前硬件确实不足以运行 V4——这时可以考虑：

- 升级 GPU 配置（增加更多 GPU）
- 使用云 GPU 实例
- 使用更小的替代模型（如 V2 或蒸馏版）

### 9.2 推理速度慢怎么优化

本地部署 V4 的推理速度通常比 API 调用慢。以下是加速策略：

**优先级从高到低：**

1. **开启 Flash Attention**：vLLM 默认开启，Ollama 需要手动配置
2. **使用连续批处理**：多用户场景下提升吞吐
3. **降低序列长度**：限制 `max-model-len` 到实际需要的长度
4. **量化 KV Cache**：FP8 KV Cache 减少读写开销
5. **确保 GPU 间互联带宽充足**：NVLink 比 PCIe 快 5-10 倍

**vLLM 加速配置示例：**

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /path/to/DeepSeek-V4-Flash \
    --tensor-parallel-size 4 \
    --max-model-len 16384 \
    --kv-cache-dtype fp8 \
    --enable-prefix-caching \
    --gpu-memory-utilization 0.90 \
    --port 8000
```

**不同硬件上的预期速度：**

| 硬件 | 模型 | 量化 | 推理速度 |
|------|------|------|---------|
| 4× H100 80GB | Flash | 原生 | 40-80 tok/s |
| 4× A100 80GB | Flash | Q4_K_M | 25-50 tok/s |
| 8× H100 80GB | Pro | Q4_K_M | 15-30 tok/s |
| Mac Studio M3 Ultra | Flash | Q4_K_M | 8-15 tok/s |
| 4× RTX 5090 | Flash | IQ4_XS | 5-10 tok/s |

### 9.3 量化后质量下降

如果发现量化后的模型质量明显下降，检查以下几点：

**首先，确认你使用的是 Q4_K_M 而不是 IQ3_M 或更低精度。** Q4_K_M 是当前公认的"质量几乎无损"的最低精度。

**其次，检查量化工具版本。** llama.cpp 对 V4 架构的支持还在完善中（需要 PR #22378 之后的版本）。使用过时的工具可能导致量化质量异常。

**第三，对比原生权重测试。** 在不同任务上对比原生 FP8/FP4 权重和量化权重的表现。一般来说，Q4_K_M 在通用对话、代码生成上的差异应该很小。如果差异显著，说明量化过程或推理框架有问题。

**最后，调整采样参数。** 量化后的模型可能对温度参数更敏感。尝试降低 `temperature` 到 0.5-0.6，提高 `top_p` 到 0.9，可能获得更稳定的输出。

### 9.4 模型加载失败

**问题：找不到模型文件**

确保模型路径正确，且所有分片文件完整：

```bash
ls /path/to/DeepSeek-V4-Flash/*.safetensors | wc -l
# 应匹配 config.json 中 num_shards 的定义
```

**问题：不支持的架构**

如果遇到 "architecture not supported" 错误，说明推理框架版本太旧，无法识别 DeepSeek V4 的架构。解决方案：

- vLLM：升级到最新版本（v0.8+）
- Ollama：确保是 0.5+ 版本
- llama.cpp：确保已合并 DeepSeek V4 支持（PR #22378）

**问题：CUDA 版本不兼容**

vLLM 需要 CUDA 12.1+。如果遇到 CUDA 相关错误：

```bash
# 检查 CUDA 版本
nvcc --version

# 如果需要升级
pip install torch --index-url https://download.pytorch.org/whl/cu121
```

### 9.5 多用户并发问题

在服务多用户场景下，两个关键配置决定了并发能力：

```bash
--max-num-seqs   # 最大并发序列数（决定了同时能处理多少请求）
--max-model-len  # 最大序列长度（决定了单请求能用多长的上下文）
```

这两者需要平衡。设得太高会导致显存溢出，设得太低会浪费 GPU 算力。

建议的初始值：

| 场景 | max-num-seqs | max-model-len | 预期并发 |
|------|-------------|---------------|---------|
| 个人使用 | 4-8 | 32768 | 1-2 用户 |
| 小团队（5-10人） | 16-32 | 16384 | 5-10 用户 |
| 企业内（20-50人） | 32-64 | 8192 | 10-20 用户 |

---

## 小结

DeepSeek V4 的本地部署虽然不是"一张显卡就能搞定"的事情，但通过合理的量化和框架选型，无论是个人研究者还是企业团队都可以找到可行的方案。

四个要点回顾：

1. **MIT 协议使部署零障碍**。不需要申请、不需要授权、不需要汇报使用情况。下载权重、部署服务、投入生产——三步完成。

2. **V4 的 FP4 原生量化是独特优势**。与其他模型需要后训练量化不同，V4 的权重本身就是量化状态——不需要额外的校准流程，也不需要担心 PTQ 导致的精度损失。

3. **Flash 版本是本地部署的主力**。284B 总参、13B 激活的 MoE 设计，结合 Q4_K_M 量化，可以在 4× H100 或 M3 Ultra 192GB 上运行，推理速度足够日常使用。Pro 版本则需要更多 GPU。

4. **Ollama 适合起步，vLLM 适合生产**。个人体验用 Ollama 最快，5 分钟就能跑起来；企业部署用 vLLM，连续批处理 + Prefix Caching 可以服务几十个并发用户。

---

## 检验标准

- [ ] 知道 DeepSeek V4 采用 MIT 协议，理解其与 Llama 3.1 协议在商业使用上的核心区别
- [ ] 能够从 HuggingFace 或 ModelScope 下载 V4 模型权重，理解模型文件结构
- [ ] 掌握 Q4_K_M 量化的含义和效果，能根据硬件配置选择合适的量化方案，确定 Flash/Pro 版本的最低硬件门槛
- [ ] 能够使用 Ollama 快速部署 V4 并进行 API 调用，能够使用 vLLM 搭建生产级推理服务并完成基本性能调优

[← 上一篇：API 接入与开发实践](./10-api-integration) | [下一篇：国产算力适配实战 →](./12-domestic-chips)
