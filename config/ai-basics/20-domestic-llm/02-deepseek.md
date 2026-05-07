# DeepSeek 深度解析

> **学习目标**: 掌握 DeepSeek V4/R1 的核心能力，了解开源生态，学会调用 API
>
> **预计时间**: 35 分钟
>
> **难度**: ⭐⭐⭐☆☆

---

DeepSeek 可能是我个人最欣赏的国产 AI 公司。

不是因为它最强，而是因为它的选择。在大厂疯狂烧钱卷参数量的时候，DeepSeek 做了一件反常识的事：**把推理成本干到 1/20，然后全部开源**。

本篇文章带你深度拆解 DeepSeek 的产品线和能力。

## DeepSeek 是谁?

深度求索（DeepSeek），2023 年成立，母公司是幻方量化（国内顶级量化基金）。

创始团队的背景很有意思：一群做量化交易的人转行做 AI。这也解释了 DeepSeek 区别于其他公司的两个特质：

1. **效率优先**。量化交易的核心不是"有多少钱"，是"怎么用更少的钱赚更多的钱"。DeepSeek 做模型的思路一样——同样的能力，成本要比别人低一个数量级。
2. **结果说话**。不搞 PR，不写软文，不开发布会。发论文+开源权重+上架 App，完事。

## 产品矩阵

DeepSeek 目前有两条核心产品线:

| 产品 | 类型 | 发布时间 | 核心能力 |
|------|------|---------|---------|
| **DeepSeek V4** | 通用模型 | 2026.02 | 原生多模态、推理、编程、百万上下文 |
| **DeepSeek R1** | 推理模型 | 2025.01 | 思维链推理、数学、科学 |
| **DeepSeek V3** | 通用模型（上一代） | 2024.12 | MoE 671B，训练成本 $5.6M |

### DeepSeek V4 — 主力模型

V4 是 DeepSeek 目前的旗舰。几个关键数据:

| 指标 | 数据 |
|------|------|
| 上下文窗口 | **100万+ tokens** |
| 架构 | mHC 流形约束超连接 + Engram 条件记忆 |
| 多模态 | 原生支持（文本+图像+代码） |
| 记忆准确率 | **98.2%** |
| 国产芯片适配 | 华为昇腾、寒武纪、海光 |
| 推理成本 | 约 ¥1/M tokens（输入），¥2/M tokens（输出） |

V4 和上一代 V3 最大的区别是：V3 是纯文本模型，V4 是原生多模态。

> 不是"加了图像理解模块"，是从训练开始就把文本和图像放在一起学。这就像一个人从小同时学中英文，和大学才开始学第二外语——语感不在一个级别。

### DeepSeek R1 — 推理模型

R1 是 DeepSeek 的"杀手锏"产品。

R1 做的事情本质上很简单：**让模型学会慢下来思考**。不是直接给答案，是先想几步再回答。这就是"思维链推理"（Chain of Thought）。

R1 的关键数据:

| 指标 | 数据 |
|------|------|
| 训练方法 | 强化学习（RL）+ 思维链 |
| AIME 2025 数学竞赛 | 48%（V3 是 27%） |
| 推理成本 | GPT-o1 的 **1/20** |
| 开源状态 | 完全开源 MIT 许可证 |

R1 的意义不在它的绝对分数，在于它证明了一个事情: **用十分之一的成本，强化学习训练出来的推理模型，能接近甚至追平 GPT-o1 的推理能力**。

这对行业的影响非常大:
- 以前大家觉得推理能力是 GPT 的护城河
- R1 告诉大家: 只要有好的训练方法和足够的算力，开源模型也能做到

2025 年 1 月 R1 发布后，DeepSeek 的日活从几百万暴涨到 1 亿+，登顶全球 App Store。

### 开源生态

DeepSeek 在 GitHub 上开源了以下项目:

```
deepseek-ai/
├── DeepSeek-V4        # V4 模型权重 + 推理代码
├── DeepSeek-R1        # R1 模型权重 + 论文
├── DeepSeek-V3        # V3 模型权重
├── DeepSeek-Coder     # 编程专用模型系列
│   ├── V2 (33B)
│   └── Lite (16B)
├── Janus-Pro          # 多模态理解模型（7B）
└── DeepGEMM           # FP8 矩阵运算库（通用工具）
```

社区数据（截至 2026.05）:

- GitHub Stars 合计: **18万+**
- Hugging Face 下载量: **2,000 万+**（中国镜像站 hf-mirror 数据）
- 社区微调版本: 超过 1,000 个衍生模型
- 论文引用: 超过 5,000 次

> R1 论文在 2025 年初发布后，被 Andrej Karpathy 等大佬转发，一度成为 AI 圈最热的论文之一。

## API 使用指南

### 注册

访问 [platform.deepseek.com](https://platform.deepseek.com):

1. 手机号/邮箱注册
2. 实名认证（国内 API 都需要的步骤）
3. 充值（最低 ¥10）
4. 创建 API Key

::: tip 新手提示
DeepSeek 注册即送 **¥10 体验金**，足够你调用 V4 跑上百次对话。先试试再说。
:::

### API 调用

DeepSeek 兼容 OpenAI SDK 格式，如果你用过 OpenAI 的 API，零切换成本。

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-deepseek-api-key",
    base_url="https://api.deepseek.com"
)

# 调用 V4
response = client.chat.completions.create(
    model="deepseek-chat",  # V4 的模型名
    messages=[
        {"role": "system", "content": "你是一个编程助手。"},
        {"role": "user", "content": "用 Python 写一个斐波那契数列生成器"}
    ],
    temperature=0.7,
    max_tokens=2000
)

print(response.choices[0].message.content)

# 调用 R1（推理模型）
response_r1 = client.chat.completions.create(
    model="deepseek-reasoner",  # R1 的模型名
    messages=[
        {"role": "user", "content": "用数学归纳法证明：1+2+...+n = n(n+1)/2"}
    ],
    # R1 会自动进行思维链推理
)

print(response_r1.choices[0].message.content)
```

### 完整参数说明

```
model: "deepseek-chat"   → V4 通用模型
       "deepseek-reasoner" → R1 推理模型

temperature: 0.0-1.0     → 控制随机性
max_tokens: 1-8192       → 最大输出长度
stream: true/false       → 是否流式输出
top_p: 0.0-1.0           → 核采样参数
frequency_penalty: 0-2   → 频率惩罚

# V4 额外参数（多模态）
images: [...]            → 图像输入列表
```

### 定价

```
DeepSeek V4:
  - 输入: ¥1/百万 tokens
  - 输出: ¥2/百万 tokens
  - 缓存命中: ¥0.2/百万 tokens

DeepSeek R1:
  - 输入: ¥2/百万 tokens
  - 输出: ¥8/百万 tokens
  - 思考 tokens: ¥4/百万 tokens
```

一个典型使用场景的成本估算:

> 写一篇 2000 字的中文技术文章:
> - 输入提示约 500 tokens × ¥1/百万 = ¥0.0005
> - 输出约 1500 tokens × ¥2/百万 = ¥0.003
> - **总计: ¥0.0035**，相当于 3 毛钱能跑 100 篇文章

### Function Calling

DeepSeek V4 支持 Function Calling（工具调用）:

```python
functions = [
    {
        "name": "get_weather",
        "description": "获取指定城市的天气",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "城市名称"}
            },
            "required": ["city"]
        }
    }
]

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "北京的天气怎么样？"}],
    functions=functions
)
```

## 与 Claude/GPT 的对比

| 维度 | DeepSeek V4 | GPT-5.4 | Claude Opus 4.6 |
|------|------------|---------|-----------------|
| 推理 | ★★★★☆ | ★★★★★ | ★★★★★ |
| 代码 | ★★★★★ | ★★★★★ | ★★★★★ |
| 中文 | ★★★★★ | ★★★★☆ | ★★★★☆ |
| 多模态 | ★★★★☆ | ★★★★★ | ★★★★☆ |
| 长上下文 | ★★★★☆(100万) | ★★★★★(100万) | ★★★★★(100万Beta) |
| 价格 | ★★★★★(低) | ★★★☆☆(中) | ★★☆☆☆(高) |
| 开源 | ✅ 完整开源 | ❌ | ❌ |
| 国产适配 | ✅ 深度适配 | ❌ | ❌ |

一句话总结:

> **DeepSeek不是国产平替，是实打实的全球竞争者。** 在编程和推理上追平 GPT，在中文上优于海外模型，在价格上碾压。唯一的短板是生态和品牌认知。

---

## 本节小结

✅ DeepSeek V4: 原生多模态通用模型，百万上下文，¥1-2/M tokens
✅ DeepSeek R1: 推理模型，成本是 GPT-o1 的 1/20，完全开源
✅ API 兼容 OpenAI 格式，注册送 ¥10 体验金
✅ 开源生态活跃，GitHub 18 万+ Stars，支持本地部署
✅ 在编程和推理上追平 GPT，中文优于海外模型

---

[← 返回章节目录](/ai-basics/20-domestic-llm) | [继续学习:通义千问与 Qwen 生态 →](/ai-basics/20-domestic-llm/03-qwen)
