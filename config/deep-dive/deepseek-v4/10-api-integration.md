# API 接入与开发实践

> 从拿到 API Key 到跑通百万上下文对话，30 分钟上手 DeepSeek V4 | 预计阅读时间：30 分钟

---

## 一、引言

DeepSeek V4 发布后，很多人问的第一句话不是"模型有多强"，而是"能不能直接换上去"。

这个问题很实在。对一个已经在用大模型 API 的开发者来说，换模型最关心的三件事：接口改多少、代码要不要重写、成本差多少。

答案是：**接口基本不用改，代码改一行 model 名就行，成本降到十分之一甚至更低。**

V4 延续了 DeepSeek 一贯的策略——与 OpenAI Chat Completions 接口完全兼容。如果你之前用过 OpenAI、通义千问、GLM 等任何一家的 API，V4 的接入方式你几乎已经会了。另外，V4 还新增了对 Anthropic 接口格式的支持，你可以在 Claude Code、Cursor 等工具中直接配置 DeepSeek 作为后端模型。

这篇文章的目标很简单：让你看完就能跑通。从申请 API Key 开始，到基本的对话调用，再到流式输出、思考模式、函数调用、超长上下文——每一步都有完整的可运行代码，Python 和 Node.js 两个版本都给你。

另外还会覆盖一个实操中容易踩坑的问题：旧接口迁移。如果你的代码里现在还写着 `deepseek-chat` 或 `deepseek-reasoner`，这篇文章的第九章就是为你写的——这两个模型名会在 2026 年 7 月 24 日停用，现在不迁移，到时候可能措手不及。

---

## 二、API 概览

### 2.1 接口格式

DeepSeek API 提供两套兼容格式：

| 接口格式 | Base URL | 适用场景 |
|---------|---------|---------|
| OpenAI Chat Completions | `https://api.deepseek.com` | 常规开发、OpenAI SDK、各语言客户端 |
| Anthropic Messages | `https://api.deepseek.com/anthropic` | Claude Code、Anthropic SDK 用户 |

两套接口指向的是同一组模型，你可以根据自己习惯或工具生态选择。对于大部分开发者来说，推荐从 OpenAI 格式入手——生态最成熟，SDK 覆盖最广，社区文档最多。

### 2.2 获取 API Key

在 DeepSeek 开放平台（https://platform.deepseek.com）注册账号后，进入 API Keys 页面创建一个新的 Key。

几个注意事项：

- **额度管理**：创建 Key 后需要在"充值"页面购买额度，新注册用户通常有少量免费体验额度
- **安全存储**：不要硬编码 API Key 到代码里，使用环境变量 `.env` 或密钥管理服务
- **多 Key 管理**：可以为不同项目创建不同的 Key，方便分开统计用量和限制单个 Key 的额度

建议将 API Key 配置为环境变量：

```bash
export DEEPSEEK_API_KEY="sk-你的API密钥"
```

### 2.3 接口参数一览

以下是 V4 API 支持的常用参数：

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `model` | string | 模型名称：`deepseek-v4-pro` / `deepseek-v4-flash` | 必填 |
| `messages` | array | 消息列表，支持 system / user / assistant / tool 角色 | 必填 |
| `stream` | boolean | 是否启用流式输出 | `false` |
| `temperature` | float | 生成随机性，范围 [0, 2] | `1.0` |
| `top_p` | float | 核采样参数，范围 [0, 1] | `1.0` |
| `max_tokens` | integer | 最大输出 token 数 | 4096（最大 384K） |
| `stop` | array | 停止序列，最多 16 个 | `null` |
| `presence_penalty` | float | 话题重复惩罚，范围 [-2, 2] | `0.0` |
| `frequency_penalty` | float | 词频重复惩罚，范围 [-2, 2] | `0.0` |
| `reasoning_effort` | string | 思考模式强度：`null` / `"high"` / `"max"` | `null` |
| `response_format` | object | 输出格式，支持 `{"type": "json_object"}` | `null` |
| `tools` | array | 函数调用工具定义，最多 128 个 | `null` |
| `tool_choice` | string/object | 工具选择策略：`"auto"` / `"none"` / `"required"` | `"auto"` |

### 2.4 一个重要的兼容性说明

V4 的 API 在思考模式（`reasoning_effort` 不为 `null`）下，`temperature`、`top_p`、`presence_penalty`、`frequency_penalty` 这几个参数虽然可以传入，但不会生效。思考模式的采样逻辑由模型内部控制，你的温度设置会被忽略。如果你需要精细控制生成多样性，请关闭思考模式（不传 `reasoning_effort` 或设为 `null`）。

---

## 三、模型选择

### 3.1 两个官方模型

V4 提供两个模型版本，各自有不同的定位：

| 维度 | deepseek-v4-pro | deepseek-v4-flash |
|------|----------------|------------------|
| 总参数量 | 1.6T | 284B |
| 激活参数 | 49B | 13B |
| 上下文 | 1M tokens | 1M tokens |
| 最大输出 | 384K tokens | 384K tokens |
| 思考模式 | 支持（默认开启） | 支持（默认开启） |
| 输入价格 | $1.74 / 1M tokens | $0.14 / 1M tokens |
| 输出价格 | $3.48 / 1M tokens | $0.28 / 1M tokens |

### 3.2 选型建议

**Pro 适合的场景：**

- 复杂推理任务（数学证明、代码生成、逻辑分析）
- 长上下文深度理解（整本技术文档分析、代码仓库审查）
- Agent 工作流（需要 tool calling 的多步复杂任务）
- 高精度要求的生产环境（用户希望输出质量极高）

**Flash 适合的场景：**

- 日常对话和问答
- 大规模批量处理（数据清洗、分类、标签）
- 延迟敏感场景（实时聊天、流式输出）
- 成本受限的创业项目
- 原型验证和快速迭代

一个实用原则：**先用 Flash 做原型验证，Pro 做最终交付。** Flash 的价格是 Pro 的 1/12，开发阶段几乎所有调用都可以走 Flash。只有关键任务输出才用 Pro。这个策略下，开发成本可以降低 90% 以上。

### 3.3 思考模式的影响

两个模型都支持思考模式，但思考模式对性能和延迟的影响不同：

- V4-Flash + 思考：思考深度有限，适合中度推理
- V4-Pro + 思考（Max）：达到深度思考效果，适合需要严谨推理的任务
- V4-Pro 非思考模式：速度接近 Flash，但质量和创造性更高

思考模式的详细参数配置参见第七章。

---

## 四、Python 快速入门

### 4.1 安装依赖

使用 Python 调用 DeepSeek V4 需要安装 `openai` Python 包。这是 OpenAI 官方 SDK，但通过修改 Base URL 可以接入任何兼容 OpenAI 格式的 API。

```bash
pip3 install openai python-dotenv
```

### 4.2 环境变量准备

创建 `.env` 文件：

```bash
# .env
DEEPSEEK_API_KEY="sk-你的API密钥"
```

### 4.3 基本对话（非流式）

以下是最基础的调用示例，发送一条消息并获取完整回复：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# 初始化客户端，设置 DeepSeek 的 Base URL
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# 创建对话补全请求
response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "用一句话解释什么是大语言模型。"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
```

运行这段代码，你会看到模型直接返回完整的回复内容。这是最简单的非流式调用——请求发出去，等几秒钟，拿到结果。

### 4.4 多轮对话

DeepSeek API 是无状态的——服务器不会记录对话历史。每次请求都需要把完整的历史对话传过去：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# 初始消息
messages = [
    {"role": "system", "content": "你是一个技术顾问，回答问题简洁明了。"},
    {"role": "user", "content": "Python 中列表和元组的区别是什么？"}
]

# 第一轮
response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=messages
)

# 将助手回复追加到消息列表
messages.append(response.choices[0].message)
print("助手:", response.choices[0].message.content)

# 第二轮：用户继续追问
messages.append({"role": "user", "content": "能不能给个代码示例？"})

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=messages
)

messages.append(response.choices[0].message)
print("助手:", response.choices[0].message.content)
```

注意 `messages.append(response.choices[0].message)` ——这里追加的是 `response.choices[0].message` 对象本身，它包含了 `role="assistant"` 和 `content` 以及可能存在的 `tool_calls`。如果直接追加字典，需要确保格式正确。

### 4.5 使用 V4-Pro

把 `model` 参数从 `"deepseek-v4-flash"` 改成 `"deepseek-v4-pro"`，就切换到了性能更强的 Pro 版本。其余所有代码不变。

```python
response = client.chat.completions.create(
    model="deepseek-v4-pro",  # 仅修改这一行
    messages=[
        {"role": "user", "content": "请推导一下泰勒展开公式。"}
    ]
)
```

---

## 五、Python 进阶用法

### 5.1 流式输出（Stream）

流式输出的核心价值在于用户体验——用户不需要盯着空白屏幕等几秒钟，而是看着文字逐字逐句显现。对于长回复，流式输出在感知速度上比非流式快很多：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

stream = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {"role": "user", "content": "写一篇 200 字左右的短文，介绍云计算的发展历史。"}
    ],
    stream=True,
    max_tokens=1000
)

# 逐 chunk 接收并打印
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)

print()  # 最后换行
```

流式输出的每个 chunk 包含增量内容（`delta.content`），你需要自己拼接这些片段来获取完整回复。如果你在流式模式下还需要获取完整的 token 用量统计，可以设置 `stream_options={"include_usage": True}`：

```python
stream = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[{"role": "user", "content": "你好"}],
    stream=True,
    stream_options={"include_usage": True}
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)
    # 最后一个 chunk 会携带 usage 信息
    if hasattr(chunk, 'usage') and chunk.usage is not None:
        print(f"\n输入 tokens: {chunk.usage.prompt_tokens}")
        print(f"输出 tokens: {chunk.usage.completion_tokens}")
        print(f"总 tokens: {chunk.usage.total_tokens}")
```

### 5.2 思考模式配置

V4 默认启用了思考模式，但你也可以显式控制。在 OpenAI SDK 中，思考模式通过传递 `extra_body` 参数实现：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {"role": "user", "content": "8 个外观相同的球，其中一个重量不同（可能更重或更轻），\
如何用天平在 3 次称量中找到这个球并确定它是更重还是更轻？"}
    ],
    extra_body={
        "reasoning_effort": "high"
    }
)

# 思考过程在 response.choices[0].message 中
# 思考内容可通过 reasoning_content 字段获取
msg = response.choices[0].message
print("思考过程:", getattr(msg, 'reasoning_content', '无'))
print("\n最终回答:", msg.content)
```

关于 `reasoning_effort` 的详细说明和不同配置的效果对比，请参见第七章。

### 5.3 System Prompt 设置

System Prompt 是控制模型行为倾向的关键手段。通过系统提示词，你可以设定角色的身份、行为规则、输出格式等：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {
            "role": "system",
            "content": "你是专业的 Python 代码审查员。每次回复时：\n\
1. 先指出代码中的潜在问题\n\
2. 给出改进建议\n\
3. 最后展示修改后的代码\n\
请使用中文回复。"
        },
        {
            "role": "user",
            "content": "def add(a,b):\n    return a+b"
        }
    ]
)

print(response.choices[0].message.content)
```

### 5.4 Function Calling（工具调用）

DeepSeek V4 支持 Function Calling，可以定义工具函数让模型在需要时调用。这在构建 Agent 应用时非常有用：

```python
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# 定义工具函数
def get_weather(location: str, unit: str = "celsius") -> str:
    """模拟获取天气信息"""
    weather_data = {
        "北京": {"temperature": 25, "condition": "晴"},
        "上海": {"temperature": 28, "condition": "多云"},
        "深圳": {"temperature": 30, "condition": "阵雨"},
    }
    info = weather_data.get(location, {"temperature": 22, "condition": "未知"})
    return json.dumps(info, ensure_ascii=False)

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "城市名称，如北京、上海"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# 第一轮：用户提问，模型决定调用函数
messages = [
    {"role": "system", "content": "你是一个天气预报助手，使用中文回答。"},
    {"role": "user", "content": "北京今天天气怎么样？"}
]

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message
messages.append(msg)

# 处理工具调用
if msg.tool_calls:
    for tool_call in msg.tool_calls:
        if tool_call.function.name == "get_weather":
            args = json.loads(tool_call.function.arguments)
            result = get_weather(**args)
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })

    # 第二轮：将函数调用结果发给模型，生成最终回复
    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
        tools=tools
    )

    final_msg = response.choices[0].message
    print("助手:", final_msg.content)
```

### 5.5 JSON 输出模式

如果你需要模型输出结构化的 JSON 数据（比如数据提取、格式转换），可以启用 JSON 输出模式：

```python
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {
            "role": "system",
            "content": "从用户输入中提取信息并输出 JSON 格式。"
        },
        {
            "role": "user",
            "content": "我叫张三，今年 28 岁，在北京做软件工程师。"
        }
    ],
    response_format={"type": "json_object"},
    temperature=0.0  # JSON 模式下建议使用较低的温度
)

data = json.loads(response.choices[0].message.content)
print("姓名:", data.get("name"))
print("年龄:", data.get("age"))
print("城市:", data.get("city"))
print("职业:", data.get("profession"))
```

JSON 模式下，模型会尽力输出合法 JSON，但你依然需要在代码层面做异常处理——模型偶尔可能输出格式有缺陷的 JSON。

---

## 六、Node.js 调用

### 6.1 安装依赖

Node.js 环境同样使用 OpenAI 官方 SDK：

```bash
npm install openai dotenv
```

### 6.2 环境变量

创建 `.env` 文件：

```
DEEPSEEK_API_KEY="sk-你的API密钥"
```

### 6.3 基本对话（非流式）

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages: [
      { role: 'system', content: '你是一个有帮助的助手。' },
      { role: 'user', content: '用一句话解释什么是 API。' }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  console.log(response.choices[0].message.content);
}

main();
```

### 6.4 流式输出

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function main() {
  const stream = await client.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages: [
      { role: 'user', content: '写一篇 200 字的短文介绍 Node.js 的事件循环机制。' }
    ],
    stream: true,
    max_tokens: 1000
  });

  let fullContent = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      fullContent += content;
      process.stdout.write(content);
    }
  }
  console.log('\n\n--- 完成 ---');
}

main();
```

### 6.5 思考模式

Node.js 中同样通过 `extra_body` 传递思考模式配置：

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      {
        role: 'user',
        content: '一辆汽车从静止开始以 2 m/s² 的加速度行驶，5 秒后速度是多少？\
行驶了多少距离？'
      }
    ],
    extra_body: {
      reasoning_effort: 'high'
    }
  });

  const msg = response.choices[0].message;
  console.log('思考过程:', msg.reasoning_content || '无');
  console.log('\n最终回答:', msg.content);
}

main();
```

### 6.6 多轮对话 + 函数调用

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
});

async function main() {
  const messages = [
    { role: 'system', content: '你是电商客服助手。' },
    { role: 'user', content: '我想查一下订单 20260507 的物流状态。' }
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'query_order',
        description: '查询订单状态',
        parameters: {
          type: 'object',
          properties: {
            order_id: { type: 'string', description: '订单号' }
          },
          required: ['order_id']
        }
      }
    }
  ];

  // 第一轮
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages,
    tools
  });

  const msg = response.choices[0].message;
  messages.push(msg);

  // 处理工具调用
  if (msg.tool_calls) {
    for (const toolCall of msg.tool_calls) {
      if (toolCall.function.name === 'query_order') {
        const args = JSON.parse(toolCall.function.arguments);
        // 模拟查询结果
        const result = JSON.stringify({
          order_id: args.order_id,
          status: '已发货',
          logistics: '顺丰快递 SF1234567890',
          estimated_delivery: '2026-05-10'
        });
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result
        });
      }
    }

    // 第二轮
    const finalResponse = await client.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages,
      tools
    });

    console.log('助手:', finalResponse.choices[0].message.content);
  }
}

main();
```

---

## 七、思考模式详解

### 7.1 思考模式的原理

DeepSeek V4 的思考模式（Thinking Mode）是 V4 的一项核心功能。简单来说，在思考模式下，模型在生成最终答案之前，会先生成一段内部的"思考链"——这段内容不直接输出给用户，但模型会用它来推理、验证和自我纠错。

思考模式的行为通过两个概念控制：

- **`thinking`**：一个对象，包含 `type` 字段，值为 `"enabled"`（开启）或 `"disabled"`（关闭）。默认开启。
- **`reasoning_effort`**：推理强度，可选 `null`（无思考）、`"high"`（高推理）、`"max"`（最大推理）。

`reasoning_effort` 是核心控制参数，它和 `thinking` 的对应关系如下：

| thinking | reasoning_effort | 效果 |
|---------|-----------------|------|
| `{"type": "disabled"}` | 不传 | 非思考模式，直接输出 |
| `{"type": "enabled"}` 或不传 | `null` 或 `"low"` | 基础思考模式（默认行为） |
| `{"type": "enabled"}` 或不传 | `"high"` | 高推理强度 |
| `{"type": "enabled"}` 或不传 | `"max"` | 最大推理强度 |

在实际调用中，你只需要在 `extra_body` 中指定 `reasoning_effort`：

```python
# 关闭思考模式
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "巴黎是哪个国家的首都？"}],
    extra_body={
        "thinking": {"type": "disabled"}
    }
)

# 高推理强度
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "复杂推理问题..."}],
    extra_body={
        "reasoning_effort": "high"
    }
)

# 最大推理强度
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "高难度数学证明..."}],
    extra_body={
        "reasoning_effort": "max"
    }
)
```

### 7.2 三种模式的对比

| 模式 | reasoning_effort | 适用场景 | 延迟 | 成本 | 思考内容可获取 |
|------|-----------------|---------|------|------|-------------|
| 非思考（直接输出） | 不传 或 `thinking: disabled` | 简单问答、摘要、翻译 | 低 | 低 | 无 |
| 思考（高） | `"high"` | 代码生成、中等推理、逻辑分析 | 中 | 中 | 可通过 `reasoning_content` 获取 |
| 思考（最大） | `"max"` | 数学证明、复杂推理、多步验证 | 高 | 高 | 可通过 `reasoning_content` 获取 |

需要说明的是，非思考模式并不等于"能力下降"。对于不需要深度推理的任务（如翻译、信息提取、简单分类），非思考模式的输出速度更快、成本更低，且质量不受影响。思考模式只在你需要模型进行严谨推理时才启用。

### 7.3 思考模式在 Agent 场景下的选择

在 Agent 工作流中，思考模式的配置需要根据 Agent 的具体任务来定：

- **工具调用型 Agent**（需要多次调用工具完成任务）：建议开启 `"high"`。模型会在每次工具调用前思考"该用什么工具、参数是什么"，减少无效调用。关闭思考模式时，模型可能会过快作出判断，导致工具调用错误率上升。
- **信息检索型 Agent**（RAG、知识库问答）：建议关闭思考模式或使用 `"high"`。检索类任务对推理深度要求不高，开启 `"max"` 只会增加延迟而没有实质收益。
- **编程 Agent**（代码生成、调试、审查）：建议使用 `"high"`。代码生成需要一定的推理能力，但 `"max"` 在大部分编程任务上收益有限，更多是增加 token 消耗。
- **复杂推理 Agent**（数学证明、合同审查、多步规划）：建议使用 `"max"`。这些任务需要模型做多步验证和自纠错，`"max"` 模式下的推理深度更能保证质量。

---

## 八、超长上下文使用

### 8.1 1M token 能做什么

V4 的上下文窗口是 1M tokens，约 80 万汉字。这意味着：

- 一整本《三体》三部曲可以一次性塞进去
- 一个中型项目的完整代码仓库（数万行代码）可以整体作为上下文
- 一套产品文档、技术规范、历史对话——全量传入
- 过去需要 RAG 分块处理的任务，现在可以直接全量输入

### 8.2 超长上下文的写法

先看一段使用超长上下文的代码示例。假设你需要分析一本完整的 Markdown 格式的技术书籍：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# 读取完整的技术文档
with open("path/to/technical_book.md", "r", encoding="utf-8") as f:
    book_content = f.read()

# 注意：book_content 可能非常长，这里只是示例
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {
            "role": "system",
            "content": "你是一名技术书籍分析专家。基于用户提供的完整书籍内容回答问题。"
        },
        {
            "role": "user",
            "content": f"以下是整本书的内容：\n\n{book_content}\n\n\
请回答以下问题：\n\
1. 这本书的核心主题是什么？\n\
2. 作者的核心论点或主张是什么？\n\
3. 书中提供了哪些证据或案例来支持论点？\n\
4. 这本书适合什么类型的读者？"
        }
    ],
    extra_body={
        "reasoning_effort": "high"
    },
    max_tokens=8000  # 回答可以更长一些
)

print(response.choices[0].message.content)
```

### 8.3 超长上下文的使用策略

在实际使用中，有几点需要特别注意：

**Token 计算**：1M tokens 虽然很大，但不是无限。上传前最好估算一下文本的 token 量。一个粗略的换算：中文约 1.5-2 个 token/字，英文约 1.3 个 token/词。一篇 50 万汉字的中文文档大概需要 75-100 万 tokens。使用 DeepSeek 官方提供的 tokenizer 做精确计算更可靠。

**系统提示词 + 文档内容 + 用户问题** 的总和必须控制在 1M tokens 以内，同时还要为输出留出空间。

**分段的性价比**：很多时候不需要把整个文档塞进去。V4 的缓存命中价格远低于缓存未命中价格。如果同一个输入前缀被多次请求（比如同一个系统提示词 + 同一份文档被反复查询），重复部分会命中缓存，成本只有正常价格的 1/10。但如果你每次请求都传不同的文档，就不会有缓存优惠。

**实际限制**：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# 估算消息总长度
def estimate_tokens(text: str) -> int:
    """粗略估计 token 数量"""
    return int(len(text) * 1.5)  # 中文近似

long_doc = "人工智能是..." * 10000  # 模拟长文本

total_input_tokens = estimate_tokens(long_doc) + 200  # 加上提示词

print(f"预估输入 tokens: {total_input_tokens}")

if total_input_tokens > 900000:
    print("警告：接近 1M 限制，建议裁剪内容或分段处理")
elif total_input_tokens > 1000000:
    print("错误：超出上下文窗口限制")
    exit(1)

# 设置足够长的超时时间
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {"role": "system", "content": "分析下面内容的核心观点。"},
        {"role": "user", "content": long_doc}
    ],
    extra_body={"reasoning_effort": "high"},
    max_tokens=16000,
    timeout=300  # 超长上下文可能需要更多时间，设置 5 分钟超时
)

print(response.choices[0].message.content)
```

超长上下文场景下，网络超时设置很重要。默认的 SDK 超时可能只有 30 秒，对于 1M 上下文的请求远远不够。建议设置为 300 秒（5 分钟）或更长，视文档大小而定。

### 8.4 超长上下文与思考模式的交互

思考模式在超长上下文场景下有特殊的联动效果。当文档较长时，开启 `reasoning_effort: "high"` 或 `"max"`，模型会在回答前对长文档做内部的"再理解"——它会扫描关键信息、建立内容间的关联、验证自己是否遗漏重要细节。这与第七章提到的 Needle in Haystack 测试结果一致：开启思考模式后，模型在长文档检索上的准确率从 53.8%（Pro 标准模式）提升到了 71.7%（Pro + Max 模式）。

所以如果你在处理超长文档并进行关键信息提取，建议开启思考模式，尤其是需要高精度回答的场景。

---

## 九、旧接口迁移

### 9.1 为什么需要迁移

DeepSeek 官方公告：**`deepseek-chat` 和 `deepseek-reasoner` 两个模型名称将于 2026 年 7 月 24 日 15:59 UTC 正式停止服务。**

这两个名称的历史含义：

| 旧模型名 | 对应关系 | 状态 |
|---------|---------|------|
| `deepseek-chat` | 对应 `deepseek-v4-flash` 的非思考模式 | 2026-07-24 停用 |
| `deepseek-reasoner` | 对应 `deepseek-v4-flash` 的思考模式 | 2026-07-24 停用 |

注意，这两个旧名称都映射到了 Flash 版本，而不是 Pro。所以如果你之前用 `deepseek-chat` 跑出了不错的质量，换成 `deepseek-v4-flash` 加上合理的思考模式配置后，效果只会有提升。

### 9.2 迁移对照表

| 旧配置 | 新配置 | 说明 |
|-------|-------|------|
| `model="deepseek-chat"` | `model="deepseek-v4-flash"` + `extra_body={"thinking": {"type": "disabled"}}` | 非思考模式，保持原有行为 |
| `model="deepseek-chat"` | `model="deepseek-v4-flash"` | 要启用默认思考模式 |
| `model="deepseek-reasoner"` | `model="deepseek-v4-flash"` + `extra_body={"reasoning_effort": "high"}` | 思考模式推荐配置 |
| `model="deepseek-reasoner"` | `model="deepseek-v4-pro"` + `extra_body={"reasoning_effort": "high"}` | 升级到 Pro 思考模式（代价更高） |

### 9.3 迁移脚本示例

对于已经上线的系统，建议分步迁移：

```python
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# OLD: 旧接口用法
# response = client.chat.completions.create(
#     model="deepseek-chat",
#     messages=[...]
# )

# NEW: 新接口 -- deepseek-chat 对应关系
def chat_completion(messages, use_reasoning=False, use_pro=False):
    """兼容新旧接口的封装函数"""
    model = "deepseek-v4-pro" if use_pro else "deepseek-v4-flash"

    kwargs = {
        "model": model,
        "messages": messages,
    }

    if use_reasoning:
        kwargs["extra_body"] = {"reasoning_effort": "high"}
    else:
        # 主动关闭思考模式，保持旧 deepseek-chat 的行为
        kwargs["extra_body"] = {"thinking": {"type": "disabled"}}

    return client.chat.completions.create(**kwargs)

# 用法与旧 deepseek-chat 一致
response = chat_completion(
    messages=[{"role": "user", "content": "Hello!"}],
    use_reasoning=False
)
print(response.choices[0].message.content)

# 用法与旧 deepseek-reasoner 一致
response = chat_completion(
    messages=[{"role": "user", "content": "solve: 3x + 7 = 22"}],
    use_reasoning=True
)
print(response.choices[0].message.content)
```

### 9.4 迁移检查清单

在 7 月 24 日截止日期前，建议完成以下操作：

1. **搜索代码库**：全局搜索 `"deepseek-chat"` 和 `"deepseek-reasoner"`，确定所有引用位置
2. **列出影响的项目**：包括后端 API 调用、配置文件、CI/CD 脚本、README 文档中的示例代码
3. **逐个替换**：根据上面的迁移对照表替换为新的模型名
4. **测试验证**：替换后最好做回归测试，尤其是使用了 `deepseek-reasoner` 的思考场景
5. **留意 4xx 错误**：如果 7 月 24 日后 API 返回 400 或 404 错误，检查是不是 model 名还在用旧的

---

## 十、聚合平台选择

### 10.1 为什么需要考虑聚合平台

虽然 DeepSeek 官方 API 已经非常便宜，但聚合平台在某些场景下仍有吸引力：

- **多模型统一管理**：一个 API Key 管理多个厂商的模型，方便切换和对比
- **中国区合规**：某些聚合平台有国内节点，延迟更低
- **额外的缓存层**：部分平台有自家的缓存策略，可能进一步降低成本
- **信用额度**：先用后付，对个人开发者比较友好

### 10.2 主流可选平台

以下是几个接入 DeepSeek V4 的聚合平台，信息截至 2026 年 5 月：

| 平台 | 模型 ID | 特点 | 价格 |
|------|---------|------|------|
| **OpenRouter** | `deepseek/deepseek-v4-pro` / `deepseek/deepseek-v4-flash` | 全球节点，多模型路由，支持思考模式 | 官方价 + 少量溢价 |
| **Vercel AI Gateway** | `deepseek/deepseek-v4-pro` / `deepseek/deepseek-v4-flash` | Vercel 生态集成，自动重试和故障转移 | 官方价 + Gateway 服务费 |
| **Atlas Cloud** | `deepseek-ai/deepseek-v4-pro` | 亚太节点，延迟较低 | 官方价 + 服务费 |
| **Azure AI Foundry** | DeepSeek 部署 | 企业合规，微软云生态 | 按 Azure 定价 |
| **阿里云百炼** | DeepSeek V4 系列 | 国内节点，最快延迟 | 人民币计费 |

如果你是独立开发或小微团队，**OpenRouter** 是起步最方便的选择——注册即用，支持多模型切换，不锁定厂商。如果你已经用了 Vercel，AI Gateway 的无缝集成会省掉不少运维成本。对于国内开发者，阿里云百炼的延迟优势最明显。

但需要注意：聚合平台通常在模型 ID 命名上有自己的规则（如 `deepseek/deepseek-v4-pro`），调用代码和官方略有区别。另外，聚合平台的思考模式支持情况不一，接入前建议确认。

### 10.3 选择建议

适用官方 API 的场景：

- 追求最低延迟（直连通常比中转快 20-50ms）
- 追求最低价格（官方没有中间商赚差价）
- 不需要多模型路由
- 可以接受直接对 DeepSeek 平台充值

适用聚合平台的场景：

- 需要在一个接口下管理多个模型
- 对特定地区节点的延迟有要求
- 不想管理多个平台的账单和 Key
- 需要额外的网关功能（缓存、重试、限流）

---

## 十一、最佳实践

### 11.1 错误处理

调用 API 可能遇到多种异常，合理的错误处理能让你的应用更稳健：

```python
import os
import time
from openai import OpenAI
from openai import (
    APIConnectionError,
    RateLimitError,
    APITimeoutError,
    BadRequestError,
    AuthenticationError
)
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

def safe_chat_completion(messages, model="deepseek-v4-flash", max_retries=3):
    """带错误处理和重试的聊天完成调用"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                timeout=60
            )
            return response.choices[0].message.content

        except AuthenticationError as e:
            print(f"认证失败：请检查 API Key ({e})")
            return None

        except BadRequestError as e:
            print(f"请求参数错误：{e}")
            if "model" in str(e):
                print("提示：检查 model 参数是否正确")
            return None

        except RateLimitError as e:
            wait_time = 2 ** attempt  # 指数退避：2s, 4s, 8s
            print(f"触发频率限制，{wait_time}秒后重试...")
            time.sleep(wait_time)

        except APITimeoutError:
            print(f"请求超时（第 {attempt+1} 次尝试）")
            if attempt < max_retries - 1:
                time.sleep(2)

        except APIConnectionError as e:
            print(f"连接错误：{e}")
            if attempt < max_retries - 1:
                time.sleep(5)

        except Exception as e:
            print(f"未知错误：{e}")
            return None

    print("所有重试均失败")
    return None

# 使用示例
result = safe_chat_completion(
    messages=[{"role": "user", "content": "写一首关于春天的五言诗。"}]
)
if result:
    print(result)
```

### 11.2 重试策略

API 调用不可能永远成功，网络抖动、服务端负载波动都是正常现象。推荐按照"指数退避 + 有限重试"的策略来处理：

1. **第一次失败**：等待 2 秒重试
2. **第二次失败**：等待 4 秒重试
3. **第三次失败**：等待 8 秒重试（如果依然失败则放弃）

不同错误类型的处理方式：

| 错误类型 | 处理方式 | 是否重试 |
|---------|---------|---------|
| 400 Bad Request | 检查请求参数，不重试 | 否 |
| 401 Unauthorized | 检查 API Key | 否 |
| 429 Rate Limit | 指数退避重试 | 是（最多 3 次） |
| 500 Server Error | 指数退避重试 | 是（最多 3 次） |
| 503 Service Unavailable | 等待后重试 | 是（最多 3 次） |
| Timeout | 增加超时时间后重试 | 是（最多 2 次） |

### 11.3 成本控制

虽然 V4 已经很便宜了，但如果没有成本意识，高并发的 API 调用还是可能产生意外账单。几个实用的成本控制手段：

**使用 Token 计数做预算检查**：

```python
def estimate_cost(text: str, model_type: str = "flash") -> float:
    """估算一次 API 调用的成本"""
    # 粗略估算：中文约 1.5 token/字
    token_count = int(len(text) * 1.5)

    if model_type == "pro":
        input_cost = token_count * 1.74 / 1_000_000
        output_cost = token_count * 3.48 / 1_000_000  # 假设输出同等长度
    else:  # flash
        input_cost = token_count * 0.14 / 1_000_000
        output_cost = token_count * 0.28 / 1_000_000

    total = input_cost + output_cost
    return total

user_input = "请详细分析..." * 1000  # 长输入
cost = estimate_cost(user_input, "flash")
print(f"预估成本: ${cost:.6f}")

if cost > 0.1:
    print("提示：该请求成本超过 0.1 美元，请确认是否继续")
```

**实际成本控制策略：**

- **默认使用 Flash**：代码中默认使用 `deepseek-v4-flash`，只有在明确需要高质量输出时才切换到 Pro
- **设置 max_tokens**：始终设置 `max_tokens`，防止模型无限输出
- **监控和告警**：通过 DeepSeek 平台的用量仪表盘设置月度预算告警
- **缓存频繁命中**：如果系统提示词和输入前缀高度重复，利用缓存命中价格优势
- **低谷时段调度**：批量处理任务安排在低谷时段（北京时间 23:00-07:00），享受 50% 折扣

### 11.4 并发限制

DeepSeek API 默认有频率限制（Rate Limit）。不同账号等级的并发限制不同。

一个简单的并发控制模式：

```python
import os
import time
import threading
from queue import Queue
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

class RateLimiter:
    """简单的速率限制器，控制每秒请求数"""
    def __init__(self, max_rps=5):
        self.max_rps = max_rps
        self.last_reset = time.time()
        self.count = 0
        self.lock = threading.Lock()

    def wait_if_needed(self):
        with self.lock:
            now = time.time()
            elapsed = now - self.last_reset

            if elapsed >= 1.0:
                # 进入新的一秒，重置计数
                self.count = 0
                self.last_reset = now
                return

            if self.count >= self.max_rps:
                # 超过了限制，等待到下一秒
                sleep_time = 1.0 - elapsed
                time.sleep(sleep_time)
                self.count = 0
                self.last_reset = time.time()
            else:
                self.count += 1

limiter = RateLimiter(max_rps=5)

def rate_limited_chat(messages):
    """受速率限制的 API 调用"""
    limiter.wait_if_needed()
    return client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages
    )

# 批量处理示例
questions = [
    "什么是机器学习？",
    "解释一下反向传播算法。",
    "什么是卷积神经网络？",
    "RNN 和 LSTM 有什么区别？",
    "什么是 Transformer 架构？"
]

for q in questions:
    response = rate_limited_chat([
        {"role": "user", "content": q}
    ])
    print(f"Q: {q}")
    print(f"A: {response.choices[0].message.content[:100]}...")
    print("---")
```

### 11.5 安全性建议

- **API Key 不要硬编码**：使用环境变量、密钥管理服务或 Vault
- **前端不要直接暴露 API Key**：如果做 Web 应用，API 调用应该从后端代理
- **设置用量上限**：在 DeepSeek 平台设置月度消费上限
- **使用独立 Key**：不同环境（开发/测试/生产）使用不同的 API Key
- **监控异常调用**：定期检查 API 用量，发现异常及时处理

---

## 小结

DeepSeek V4 的 API 接入可以用四句话总结：

1. **接口不变**：完全兼容 OpenAI Chat Completions 格式，现有代码只需改 model 名和 base URL
2. **两套模型**：Flash 日常用，Pro 关键任务用，开发阶段先 Flash 再 Pro
3. **思考模式灵活**：`reasoning_effort` 参数控制推理深度，不传就是非思考模式
4. **旧接口 7 月停用**：`deepseek-chat` 和 `deepseek-reasoner` 尽早换成 `deepseek-v4-flash`

经过前面九章的代码示例和最佳实践，你现在应该已经能独立完成：

- 申请 API Key 并完成基本对话调用
- 用 Python 和 Node.js 实现流式输出、思考模式、函数调用
- 区分思考模式的三种配置并选择合适的场景
- 在超长上下文场景下正确调用 API
- 规划旧接口迁移路径
- 选择合适的调用平台并配置错误处理和重试

下一步可以进入《本地部署方案》，了解如何在自有硬件上运行 V4 模型。

---

## 检验标准

- [ ] 能够使用 Python 和 Node.js 分别编写完整的 DeepSeek V4 API 调用代码（包括非流式和流式）
- [ ] 理解 `deepseek-v4-pro` 和 `deepseek-v4-flash` 的选型区别，知道什么场景用什么模型
- [ ] 掌握思考模式的三个配置（关闭 / high / max），能在不同场景下做出合适选择
- [ ] 了解旧接口（deepseek-chat / deepseek-reasoner）的迁移路径和截止日期

[← 上一篇：定价经济学](./09-pricing-economics) | [下一篇：本地部署方案 →](./11-local-deployment)
