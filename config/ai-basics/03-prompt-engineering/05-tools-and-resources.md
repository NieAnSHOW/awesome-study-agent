# 第五章:工具与资源

> **学习目标**:了解提示词管理平台、评估工具和学习资源,建立系统化的提示词工程实践
>
> **预计时间**:60-90 分钟
>
> **难度**:⭐⭐

## 5.1 提示词管理平台

### 为什么需要专门的工具?

随着提示词数量增多和项目复杂度提升,仅靠文本文件管理会遇到一些问题:

- 版本混乱: 不清楚哪个版本最优
- 协作困难: 团队成员难以共享和同步
- 测试麻烦: 难以系统化地A/B测试
- 缺乏追踪: 无法追溯历史变更和效果
- 成本失控: 难以监控token消耗和成本

### PromptLayer

**定位**: 提示词版本管理和A/B测试平台[^1]

#### 核心功能

1. 提示词注册表 (Prompt Registry)
   - 可视化提示词管理
   - 版本控制和diff对比
   - 元数据标签(团队、用途、语言)

2. A/B测试
   - 内置流量分配
   - 自动化效果对比
   - 统计显著性检验

3. 无代码编辑器
   - 可视化提示词编辑
   - 实时预览
   - 变量管理

4. 评估框架
   - 批量测试
   - 回归测试
   - 人机和混合评分

#### 适用场景

- ✅ 中小型团队(1-20人)
- ✅ 快速迭代和实验
- ✅ 需要非技术人员协作
- ❌ 超复杂的Agent工作流

#### 快速上手

```python
# 安装
pip install promptlayer

# 使用
import promptlayer

# 记录提示词调用
promptlayer.prompt.publish(
    "my-prompt-template",
    prompt_template="你是一个{role},请{task}",
    tags=["customer-service", "v1.0"]
)

# 使用提示词
response = promptlayer.openai.chat.completions.create(
    model="gpt-4",
    messages=[{
        "role": "user",
        "content": promptlayer.prompt.get("my-prompt-template").format(
            role="客服助手",
            task="回答用户问题"
        )
    }],
    pl_tags=["production"]
)
```

### LangSmith

**定位**: LangChain生态的全生命周期开发平台[^2]

#### 核心功能

1. 调用追踪
   - 详细的执行链可视化
   - 每一步的输入输出
   - 延迟和成本分析

2. 数据集管理
   - 创建和管理测试数据集
   - 版本化的数据集
   - 数据集标注工具

3. 评估器
   - 内置评估指标
   - 自定义评估器
   - LLM-as-a-judge

4. Playground
   - 交互式测试环境
   - 实时调试
   - 多模型对比

#### 适用场景

- ✅ 使用LangChain/LangGraph构建应用
- ✅ 需要深度调试和追踪
- ✅ 复杂的多步Agent工作流
- ❌ 简单的单次提示任务

#### 快速上手

```python
# 安装
pip install langsmith

# 配置
export LANGCHAIN_API_KEY="your-key"
export LANGCHAIN_TRACING_V2=true

# 使用
from langchain_openai import ChatOpenAI
from langchain.smith import RunEvalConfig

# 创建数据集
client.create_dataset(
    name="customer-support-dataset",
    description="客服对话测试集"
)

# 评估
evaluation_config = RunEvalConfig(
    evaluators=[
        "criteria",  # 内置评估器
        "embedding_similarity",  # 嵌入相似度
    ]
)

results = client.run_on_dataset(
    dataset_name="customer-support-dataset",
    llm_or_chain_factory=my_chain,
    evaluation=evaluation_config
)
```

### Maxim AI

**定位**: 企业级提示词管理和LLM网关[^3]

#### 核心功能

1. 统一管理
   - 提示词IDE
   - 版本控制+元数据
   - 团队协作+RBAC

2. LLM网关(Bifrost)
   - 支持250+模型
   - 多provider路由
   - 自动故障转移
   - 50x性能提升

3. Agent模拟
   - 多轮对话模拟
   - 工具调用测试
   - 边界情况覆盖

4. 可观测性
   - Span级别追踪
   - 成本和延迟监控
   - 异常检测和告警

#### 适用场景

- ✅ 企业级生产环境
- ✅ 需要高可用和性能
- ✅ 多provider策略
- ✅ 严格的合规要求

### 工具对比

| 特性 | PromptLayer | LangSmith | Maxim AI |
|------|------------|-----------|----------|
| 提示词管理 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 版本控制 | Git-style diff | Chain diff | Granular diff |
| A/B测试 | ✅ 内置 | ❌ | ✅ 内置 |
| 可视化 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Agent模拟 | ❌ | 🔶 Beta | ✅ 全功能 |
| LLM网关 | ❌ | ❌ | ✅ (250+模型) |
| 深度追踪 | Prompt对 | Step级 | Span级 |
| 价格(月) | $50/user | $39/user | 企业定制 |
| 免费层 | 200k tokens | 5k traces | 1M tokens |

---

## 5.2 评估和测试工具

### 评估指标

#### 准确性指标

```python
# 准确率 (Accuracy)
correct = sum(1 for p, a in zip(predictions, actuals) if p == a)
accuracy = correct / len(predictions)

# F1分数
from sklearn.metrics import f1_score
f1 = f1_score(actuals, predictions, average='weighted')

# 精确率和召回率
precision = precision_score(actuals, predictions)
recall = recall_score(actuals, predictions)
```

#### 相似度指标

```python
# 余弦相似度
from sklearn.metrics.pairwise import cosine_similarity
similarity = cosine_similarity([embedding1], [embedding2])[0][0]

# BLEU分数(用于文本生成)
from nltk.translate.bleu_score import sentence_bleu
reference = [["this", "is", "a", "test"]]
candidate = ["this", "is", "test"]
score = sentence_bleu(reference, candidate)

# ROUGE分数(用于摘要)
from rouge import Rouge
rouge = Rouge()
scores = rouge.get_scores(hypothesis, reference)
```

#### 自定义评估器

```python
def custom_evaluator(output, expected):
    """自定义评估逻辑"""
    score = 0

    # 检查是否包含关键信息
    if expected['key_info'] in output:
        score += 0.3

    # 检查格式
    if expected['format'] == 'json':
        try:
            json.loads(output)
            score += 0.2
        except:
            pass

    # 检查长度
    if expected['min_length'] <= len(output) <= expected['max_length']:
        score += 0.2

    # 人工评分
    score += human_rating(output) * 0.3

    return score
```

### 自动化测试框架

#### 基础测试框架

```python
import pytest
from openai import OpenAI

class TestPromptEngine:
    """提示词测试类"""

    @pytest.fixture
    def client(self):
        return OpenAI()

    @pytest.fixture
    def test_cases(self):
        return [
            {
                "input": "测试输入1",
                "expected": {"category": "A", "confidence": 0.9}
            },
            {
                "input": "测试输入2",
                "expected": {"category": "B", "confidence": 0.8}
            }
        ]

    def test_classification_prompt(self, client, test_cases):
        """测试分类提示词"""
        for case in test_cases:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{
                    "role": "user",
                    "content": f"请分类: {case['input']}"
                }]
            )

            result = parse_response(response.choices[0].message.content)

            # 断言
            assert result['category'] == case['expected']['category']
            assert result['confidence'] >= case['expected']['confidence'] - 0.1

    def test_regression(self, client):
        """回归测试:确保输出不会意外改变"""
        # 使用固定的种子或mock
        expected_output = load_baseline("test_baseline.json")

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[...]
        )

        assert response == expected_output
```

#### Promptfoo评估

```bash
# 安装
npm install -g promptfoo

# 配置文件 promptfooconfig.yaml
prompts:
  - path: 'prompt1.txt'
    id: 'v1'
  - path: 'prompt2.txt'
    id: 'v2'

providers:
  - openai:gpt-4
  - openai:gpt-3.5-turbo

tests:
  - description: '测试案例1'
    vars:
      query: '用户问题'
    assert:
      - type: 'contains'
        value: '期望包含的内容'

# 运行评估
promptfoo eval

# 查看结果
promptfoo view
```

---

## 5.3 提示词优化工具

### 自动优化

#### 自动提示词工程师

```python
"""
Auto Prompt Engineer思路:
1. 生成多个候选提示词
2. 在测试集上评估
3. 选择最佳提示词
4. 迭代改进
"""

def auto_optimize_prompt(base_prompt, test_cases, iterations=5):
    best_prompt = base_prompt
    best_score = evaluate_prompt(best_prompt, test_cases)

    for i in range(iterations):
        # 生成变体
        variants = generate_prompt_variants(best_prompt, n=3)

        # 评估每个变体
        for variant in variants:
            score = evaluate_prompt(variant, test_cases)

            if score > best_score:
                best_score = score
                best_prompt = variant
                print(f"Iteration {i}: Improved score to {score:.3f}")

    return best_prompt, best_score

def generate_prompt_variants(prompt, n=3):
    """生成提示词变体"""
    variants = []

    # 策略1: 添加细节
    variants.append(prompt + "\n请仔细思考后回答。")

    # 策略2: 添加示例
    variants.append(prompt + "\n示例: [添加示例]")

    # 策略3: 改写
    variants.append(rewrite_prompt(prompt))

    return variants[:n]
```

### A/B测试

```python
import random
from typing import Dict, List

class PromptABTest:
    """提示词A/B测试"""

    def __init__(self, prompt_a: str, prompt_b: str):
        self.prompt_a = prompt_a
        self.prompt_b = prompt_b
        self.results_a = []
        self.results_b = []

    def split_traffic(self, traffic_ratio=0.5):
        """随机选择提示词"""
        if random.random() < traffic_ratio:
            return 'A', self.prompt_a
        else:
            return 'B', self.prompt_b

    def record_result(self, variant: str, input: str,
                     output: str, score: float):
        """记录结果"""
        if variant == 'A':
            self.results_a.append({
                'input': input,
                'output': output,
                'score': score
            })
        else:
            self.results_b.append({
                'input': input,
                'output': output,
                'score': score
            })

    def analyze(self):
        """分析A/B测试结果"""
        from scipy import stats

        scores_a = [r['score'] for r in self.results_a]
        scores_b = [r['score'] for r in self.results_b]

        # t检验
        t_stat, p_value = stats.ttest_ind(scores_a, scores_b)

        return {
            'avg_a': sum(scores_a) / len(scores_a),
            'avg_b': sum(scores_b) / len(scores_b),
            'improvement': (sum(scores_b) / len(scores_b) -
                          sum(scores_a) / len(scores_a)),
            'significant': p_value < 0.05,
            'p_value': p_value
        }

# 使用示例
ab_test = PromptABTest(
    prompt_a="原始提示词",
    prompt_b="优化后提示词"
)

for input in test_inputs:
    variant, prompt = ab_test.split_traffic()
    output = call_llm(prompt, input)
    score = evaluate_output(output)
    ab_test.record_result(variant, input, output, score)

results = ab_test.analyze()
print(f"改进幅度: {results['improvement']:.2%}")
print(f"统计显著性: {results['significant']}")
```

---

## 5.4 学习资源

### 经典指南和教程

1. **[Prompt Engineering Guide](https://www.promptingguide.ai/zh)**[^4]
   - 最全面的免费指南
   - 涵盖所有基础模式
   - 支持多语言
   - 定期更新

2. **[Learn Prompting](https://learnprompting.org/zh-Hans)**[^5]
   - 系统化课程
   - 从零基础到高级
   - 包含互动练习
   - 社区支持

3. **OpenAI 官方文档**
   - [Prompt engineering guide](https://platform.openai.com/docs/guides/prompt-engineering)
   - [Examples](https://platform.openai.com/examples)
   - 最佳实践

### 研究论文

#### 必读论文

1. **Language Models are Few-Shot Learners** (GPT-3论文)
   - 提出了Few-shot学习概念
   - https://arxiv.org/abs/2005.14165

2. **Chain-of-Thought Prompting**
   - CoT的奠基性工作
   - https://arxiv.org/abs/2201.11903

3. **ReAct: Synergizing Reasoning and Acting in Language Models**
   - ReAct模式的原论文
   - https://arxiv.org/abs/2210.03629

### 社区和博客

1. **PromptLayer Blog**
   - 提示词工程最佳实践
   - 案例研究
   - https://blog.promptlayer.com

2. **Lil'Log**
   - Lilian Weng的博客
   - 深入的技术分析
   - https://lilianweng.github.io

3. **Reddit社区**
   - r/LocalLLaMA
   - r/ChatGPT
   - r/OpenAI

### 视频课程

1. **Andrew Ng的AI课程**
   - DeepLearning.AI
   - "AI for Everyone"

2. **YouTube频道**
   - LangChain
   - Harrison Chase
   - Sam Witteveen

---

## 5.5 实用资源库

### 提示词模板库

#### Awesome Prompt Engineering

```markdown
# GitHub Repositories

1. **Awesome ChatGPT Prompts**
   https://github.com/f/awesome-chatgpt-prompts
   - 社区驱动的提示词集合
   - 分类齐全

2. **Prompt Engineering Guide**
   https://github.com/PromptEngineeringGuide/Prompt-Engineering-Guide-zh-CN
   - 中文翻译版本

3. **Learn Prompting**
   https://github.com/learnprompting/learnprompting
   - 开源教程
```

### 按任务分类的模板

#### 数据分析

```python
DATA_ANALYSIS_TEMPLATE = """
你是一位数据分析师。

## 任务
分析以下数据并提取洞察

## 数据
{data}

## 要求
1. 计算关键指标
2. 识别趋势和异常
3. 提供行动建议

## 输出格式
- 使用表格
- 包含图表建议
- 结构化洞察
"""
```

#### 代码审查

```python
CODE_REVIEW_TEMPLATE = """
你是一位资深代码审查专家。

## 代码
```{language}
{code}
```

## 审查维度
1. 代码质量
2. 性能
3. 安全性
4. 最佳实践

## 输出格式
### 问题
[按优先级列出]

### 建议
[具体改进方案]

### 评分
{score}/10
"""
```

---

## 5.6 建立个人提示词库

### 组织结构

```
prompt-library/
├── README.md           # 目录说明
├── categories/         # 分类
│   ├── writing/
│   │   ├── blog-post.md
│   │   ├── email.md
│   │   └── social-media.md
│   ├── coding/
│   │   ├── code-gen.md
│   │   ├── code-review.md
│   │   └── debug.md
│   ├── analysis/
│   │   ├── data-summary.md
│   │   └── sentiment.md
│   └── business/
│       ├── market-research.md
│       └── pricing.md
├── templates/          # 可复用模板
│   ├── few-shot.json
│   └── cot.json
└── versions/           # 版本历史
    └── prompt-name/
        ├── v1.0.md
        ├── v1.1.md
        └── changelog.md
```

### 元数据模板

```markdown
---
name: "Customer Service Email Response"
category: "Writing"
tags: ["customer-service", "email", "business"]
version: "1.2"
last_updated: "2025-01-22"
author: "Your Name"
performance:
  accuracy: 0.92
  avg_tokens: 450
  cost_per_call: 0.009
variants:
  - v1.0: "Initial version"
  - v1.1: "Added empathy guidelines"
  - v1.2: "Optimized for length"
---

## Prompt
[提示词内容]

## Usage Examples
[使用示例]

## Notes
[使用注意事项]
```

---

## 5.7 实战练习

### 练习1:选择合适的工具

根据以下场景,推荐最合适的提示词管理工具:

1. 一个3人的创业团队,使用ChatGPT API快速构建MVP
2. 一个使用LangChain构建复杂Agent的20人团队
3. 一个大型企业,需要高可用和严格合规

<details>
<summary>查看推荐</summary>

1. **PromptLayer** - 成本友好,快速上手,适合小团队
2. **LangSmith** - 与LangChain深度集成,强大的追踪能力
3. **Maxim AI** - 企业级功能,网关和高可用性

</details>

### 练习2:设计评估框架

为一个"客户情感分析"提示词设计评估框架。

<details>
<summary>查看参考方案</summary>

```python
# 评估维度
dimensions = {
    "accuracy": "分类准确率",
    "f1_score": "F1分数(考虑类别不平衡)",
    "response_time": "响应时间",
    "cost": "每次调用成本",
    "consistency": "相同输入的一致性"
}

# 测试集
test_cases = [
    {
        "input": "产品太棒了!",
        "expected": "positive"
    },
    {
        "input": "质量一般,价格偏贵",
        "expected": "neutral"
    },
    # ... 更多测试案例
]

# 评估函数
def evaluate_sentiment_prompt(prompt, test_cases):
    results = []

    for case in test_cases:
        output = call_llm(prompt, case['input'])
        prediction = parse_sentiment(output)

        results.append({
            'input': case['input'],
            'expected': case['expected'],
            'predicted': prediction,
            'correct': prediction == case['expected']
        })

    accuracy = sum(r['correct'] for r in results) / len(results)

    return {
        'accuracy': accuracy,
        'detailed_results': results
    }
```

</details>

### 练习3:建立个人提示词库

创建你的第一个提示词库,包含至少3个常用提示词。

<details>
<summary>查看组织建议</summary>

1. 选择你最常做的3类任务
2. 为每类任务设计优化过的提示词
3. 使用元数据模板记录
4. 建立版本控制
5. 编写使用文档

推荐工具:
- GitHub/GitLab: 版本控制
- Notion/Obsidian: 知识管理
- 专用平台: PromptLayer/LangSmith

</details>

---

## 5.8 本章小结

### 核心要点

1. 管理平台: PromptLayer、LangSmith、Maxim AI等各有优势
2. 评估工具:准确性指标、相似度指标和自定义评估器
3. 优化方法: A/B测试、自动优化和迭代改进
4. 学习资源:官方文档、研究论文和社区博客
5. 个人实践: 建立自己的提示词库

### 工具选择决策树

```
团队规模?
├─ 1-5人 → PromptLayer (成本友好)
└─ 5+人
    ├─ 使用LangChain? → LangSmith
    └─ 不使用 → Maxim AI (企业级)

是否需要LLM网关?
├─ 是 → Maxim AI
└─ 否 → PromptLayer/LangSmith

预算?
├─ 免费 → 开源工具(GitHub管理)
├─ 低 → PromptLayer ($50/月)
└─ 高 → Maxim AI (企业定制)
```

### 下一步行动

1. 选择一个管理平台并开始试用
2. 建立个人提示词库
3. 设置评估框架测试你的提示词
4. 加入社区持续学习

---

## 思考题

1. 根据你当前的项目和团队,哪个提示词管理平台最适合?为什么?

2. 如何平衡使用第三方工具和自己构建简单工具的利弊?

3. 设计一个评估框架来衡量"好"的提示词,应该包含哪些指标?

4. 如何在团队中建立提示词的最佳实践和知识共享机制?

---

[← 返回模块三](/ai-basics/03-prompt-engineering) | [返回课程目录](/preface)

---

**🎉 恭喜你完成了模块三的学习!**

现在你已经掌握了提示词工程的核心知识和实践技能。下一步建议:
1. 在实际项目中应用所学知识
2. 建立自己的提示词库
3. 持续学习和优化
4. 分享你的经验和最佳实践

**💡 终身学习**: 提示词工程是一个快速发展的领域,保持学习的心态,关注最新研究和工具,你会不断进步!

---

## 扩展资源汇总

### 工具平台
- [PromptLayer](https://promptlayer.com) - 提示词版本管理
- [LangSmith](https://smith.langchain.com) - LangChain生态平台
- [Maxim AI](https://getmaxim.ai) - 企业级管理平台

### 学习资源
- [Prompt Engineering Guide](https://www.promptingguide.ai/zh) - 全面指南
- [Learn Prompting](https://learnprompting.org/zh-Hans) - 系统教程
- [OpenAI 官方文档](https://platform.openai.com/docs/guides/prompt-engineering)

### 开源项目
- [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts)
- [Prompt Engineering Guide 中文版](https://github.com/PromptEngineeringGuide/Prompt-Engineering-Guide-zh-CN)

### 社区
- r/LocalLLaMA - Reddit社区
- Discord - AI开发者社区
- GitHub - 开源项目

---

**参考来源**:

[^1]: PromptLayer, https://promptlayer.com
[^2]: LangSmith, https://smith.langchain.com
[^3]: Maxim AI, https://www.getmaxim.ai/articles/prompt-engineering-platforms-that-actually-work-2025s-top-picks/
[^4]: Prompt Engineering Guide, https://www.promptingguide.ai/zh
[^5]: Learn Prompting, https://learnprompting.org/zh-Hans
