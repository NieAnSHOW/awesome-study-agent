# 上下文质量评估

> 如何评估上下文的质量，并持续改进

---

## 为什么需要评估？

### 上下文质量的影响

```
高质量上下文 → AI 理解准确 → 生成高质量代码
低质量上下文 → AI 理解偏差 → 生成不符合需求的代码
```

2025 年 AI 代码质量状况报告显示，开发者最希望改进的是"提高上下文理解能力"（26%），比"减少幻觉/事实错误"（24%）更受关注。"上下文是有效使用人工智能工具的关键"

### 2025：从提示词工程到上下文工程

决定 AI 应用质量的关键，已经不再是"你怎么问"，而是**"你给 AI 喂了什么料"**。

上下文工程（Context Engineering）已成为 2025 年的核心开发技能，包含五大组件：

| 组件 | 说明 | 示例 |
|------|------|------|
| **系统提示** | 定义角色、边界和风格 | "你是资深的 Python 后端工程师" |
| **检索增强（RAG）** | 动态获取外部知识 | 从知识库检索 API 文档 |
| **记忆（Memory）** | 保存跨轮对话和关键事实 | 记住用户选择的技术栈 |
| **工具使用** | 调用外部 API 或数据库 | 执行 SQL 查询验证数据 |
| **结构化输出** | 让输出可解析、可监控 | JSON 格式的代码审查报告 |

### 评估的价值

```
1. 发现问题
   - 哪些文档有用
   - 哪些文档缺失
   - 哪些内容过时

2. 持续改进
   - 数据驱动决策
   - 优先级排序
   - 效果验证

3. 投入产出
   - 评估维护成本
   - 计算节省时间
   - 证明价值
```

---

## 评估维度

### 1. 完整性

**定义**：上下文是否覆盖了必要的信息。

根据 2025 年上下文工程实践，完整性包括三个层次：

| 层次 | 范围 | 关键内容 |
|------|------|----------|
| **L1: 单次对话** | 一次独立的 AI 交互 | 需求描述、约束条件、输出格式 |
| **L2: 会话级** | 连续的对话会话 | 对话历史、用户偏好、上下文记忆 |
| **L3: 项目级** | 整个项目生命周期 | 代码库理解、架构知识、团队规范 |

**检查清单**：

```markdown
## 项目基础信息
- [ ] 项目简介
- [ ] 技术栈
- [ ] 架构设计
- [ ] 开发环境

## 开发规范
- [ ] 编码风格
- [ ] 命名规范
- [ ] 错误处理
- [ ] 测试要求

## 业务规则
- [ ] 核心业务流程
- [ ] 数据模型
- [ ] 业务规则
- [ ] 边界情况

## API 文档
- [ ] 端点列表
- [ ] 请求/响应格式
- [ ] 认证方式
- [ ] 错误码

## 模块文档
- [ ] 每个模块的说明
- [ ] 模块间依赖
- [ ] 接口定义
```

**评分方法**：

```python
def calculate_completeness(checklist):
    total = len(checklist)
    completed = sum(1 for item in checklist if item['done'])
    return completed / total

# 示例
checklist = [
    {"name": "项目简介", "done": True},
    {"name": "技术栈", "done": True},
    {"name": "架构设计", "done": False},
    # ...
]

score = calculate_completeness(checklist)
print(f"完整性得分: {score:.1%}")
```

### 2. 准确性

**定义**：上下文是否与实际代码/需求一致。

RAG 系统的质量评估已成为企业级知识库落地的关键。准确性评估包括：

**RAG 三大核心指标**（来源：DeepEval、Ragas 2025）：

| 指标 | 说明 | 评估方法 | 工具支持 |
|------|------|----------|----------|
| **Faithfulness（忠实度）** | 答案是否严格反映检索到的上下文 | 检查答案中的每个主张是否都有上下文支持 | DeepEval, Ragas |
| **Contextual Relevancy（上下文相关性）** | 检索到的上下文是否与查询相关 | 计算相关上下文占总检索内容的比例 | LangChain, Ragas |
| **Answer Relevancy（答案相关性）** | 生成的答案是否解决了用户问题 | 将答案反向生成问题，与原问题对比 | OpenEvals |

**检查方法**：

```python
import ast
import re

def check_api_accuracy():
    """检查 API 文档是否准确"""

    # 1. 从代码中提取实际 API
    actual_apis = extract_apis_from_code('./src')

    # 2. 从文档中提取文档 API
    doc_apis = extract_apis_from_docs('./docs/api')

    # 3. 对比
    missing = []
    inconsistent = []

    for api in actual_apis:
        if api not in doc_apis:
            missing.append(api)

    for doc_api in doc_apis:
        if doc_api in actual_apis:
            if not compare_signature(doc_api, actual_apis[doc_api]):
                inconsistent.append(doc_api)

    return {
        "missing": missing,
        "inconsistent": inconsistent
    }

def extract_apis_from_code(path):
    """从代码中提取 API 定义"""
    apis = {}

    for file in find_files(path, '*.ts'):
        tree = ast.parse(open(file).read())

        for node in ast.walk(tree):
            if isinstance(node, FunctionDef):
                decorators = get_decorators(node)
                if has_route_decorator(decorators):
                    route = extract_route(decorators)
                    apis[route] = extract_signature(node)

    return apis
```

**自动化检查**：

```bash
# 运行检查脚本
python scripts/check_doc_accuracy.py

# 输出示例
✓ API /api/users/login - 文档准确
✗ API /api/users/profile - 文档缺失
⚠ API /api/orders/create - 参数不一致
```

### 3. 清晰度

**定义**：上下文是否易于理解。

| 指标 | 说明 | 目标值 | 评估工具 |
|------|------|--------|----------|
| **可读性评分** | Flesch Reading Ease（英文） | >60 | Textstat, TextGears |
| **平均句长** | 句子的平均长度 | <20 词 | Textstat |
| **技术术语密度** | 专业术语占比 | <30% | 自定义脚本 |
| **代码示例覆盖率** | 有示例的章节比例 | >50% | 人工检查 |
| **多语言支持** | 支持中文等非英语语言 | - | TextGears, 在线工具 |

**Textstat：主流文本可读性工具**

```python
# 安装
pip install textstat

# 基础使用
import textstat

text = """
这是一个示例文本，用于演示 Textstat 的基本功能。
它可以计算多种可读性指标，帮助评估文档质量。
"""

# 英文文本分析
en_text = "Playing games has always been thought to be important to the development of well-balanced and creative children."

print(f"Flesch Reading Ease: {textstat.flesch_reading_ease(en_text)}")
print(f"Flesch-Kincaid Grade: {textstat.flesch_kincaid_grade(en_text)}")
print(f"SMOG Index: {textstat.smog_index(en_text)}")
print(f"平均句长: {textstat.avg_sentence_length(en_text)}")

# 多语言支持
textstat.set_lang('es')  # 西班牙语
# textstat.set_lang('de')  # 德语
# textstat.set_lang('fr')  # 法语
```

**评分标准**（Flesch Reading Ease）：

```
90-100: 非常容易（5年级）
80-89:  容易（6年级）
70-79:  比较容易（7年级）
60-69:  标准（8-9年级）
50-59:  比较困难（10-12年级）
30-49:  困难（大学水平）
0-29:   非常难（专业学者）
```

**中文可读性评估**：

由于 Textstat 主要针对英文，中文文档可使用：

```python
# 中文可读性评估方案
def chinese_readability_score(text):
    """
    中文可读性评分（简化版）
    参考：中文可读性公式（如《中文文本可读性研究》）
    """
    import re

    # 1. 平均句长（字数）
    sentences = re.split(r'[。！？]', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    avg_sentence_length = sum(len(s) for s in sentences) / len(sentences)

    # 2. 词语难度（基于词典）
    # 这里简化处理，实际应使用专业词典
    difficult_chars = len([c for c in text if ord(c) > 0x9FA5])  # 生僻字

    # 3. 句子复杂度
    complex_sentences = len([s for s in sentences if '，' in s and s.count('，') > 2])

    # 简化评分（越低越容易）
    score = (avg_sentence_length * 0.5 +
             difficult_chars / len(text) * 100 +
             complex_sentences / len(sentences) * 20)

    return score

# 使用
text = "这是一个测试文本，用于评估中文文档的可读性。"
score = chinese_readability_score(text)
print(f"中文可读性分数: {score:.2f}（越低越容易）")
```

**在线工具选择**（2025 年推荐）：

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| **TextGears** | 支持 11 种语言包括中文 | 多语言项目 |
| **Grammarly** | 语法检查 + 可读性 | 英文技术文档 |
| **听脑AI** | 支持 10 万字以上长文档 | 会议记录、长文档总结 |

**检查工具**：

```python
import textstat

def assess_clarity(text):
    return {
        "readability": textstat.flesch_reading_ease(text),
        "avg_sentence_length": textstat.avg_sentence_length(text),
        "syllable_count": textstat.syllable_count(text),
        "lexicon_count": textstat.lexicon_count(text)
    }

# 使用
with open('docs/architecture.md') as f:
    text = f.read()

score = assess_clarity(text)
print(f"可读性: {score['readability']:.1f}")
print(f"平均句长: {score['avg_sentence_length']:.1f} 词")
```

### 4. 实用性

**定义**：上下文是否真正帮助 AI 生成更好的结果。

**评估方法**：A/B 测试

```python
# 场景：让 AI 实现一个功能
task = "实现用户忘记密码功能"

# 无上下文
result_without = ai.generate(task)

# 有上下文
result_with = ai.generate(task, context=wiki_content)

# 人工评分
score_without = human_evaluate(result_without)
score_with = human_evaluate(result_with)

improvement = (score_with - score_without) / score_without
print(f"改进幅度: {improvement:.1%}")
```

### 5. 时效性

**定义**：上下文是否保持最新。

**检查方法**：

```python
from datetime import datetime, timedelta
import os

def check_freshness(docs_path):
    """检查文档的时效性"""
    stale_docs = []
    threshold = timedelta(days=90)  # 90天

    for root, dirs, files in os.walk(docs_path):
        for file in files:
            if file.endswith('.md'):
                path = os.path.join(root, file)
                mtime = datetime.fromtimestamp(os.path.getmtime(path))
                age = datetime.now() - mtime

                if age > threshold:
                    stale_docs.append({
                        "path": path,
                        "last_modified": mtime,
                        "age_days": age.days
                    })

    return sorted(stale_docs, key=lambda x: x['age_days'], reverse=True)

# 使用
stale = check_freshness('./docs')
for doc in stale[:5]:
    print(f"{doc['path']}: {doc['age_days']} 天未更新")
```

---

## 综合评估

### 评估框架（2025）

**LangChain OpenEvals / AgentEvals**：

```python
# 安装
pip install -U openevals agentevals

# 创建轨迹评估器（用于 Agent）
from agentevals.trajectory.match import create_trajectory_match_evaluator
import json

# 评估 Agent 的工具调用顺序是否正确
trajectory_evaluator = create_trajectory_match_evaluator()

outputs = [
    {
        "role": "assistant",
        "tool_calls": [
            {"function": {"name": "get_weather", "arguments": json.dumps({"city": "san francisco"})}},
            {"function": {"name": "get_directions", "arguments": json.dumps({"destination": "presidio"})}}
        ]
    }
]

reference_outputs = [
    {
        "role": "assistant",
        "tool_calls": [
            {"function": {"name": "get_weather", "arguments": json.dumps({"city": "san francisco"})}},
            {"function": {"name": "get_directions", "arguments": json.dumps({"destination": "presidio"})}}
        ]
    }
]

result = trajectory_evaluator(outputs=outputs, reference_outputs=reference_outputs)
print(f"轨迹匹配度: {result['score']}")
```

**RAG 评估框架（Ragas + LangChain）**：

```python
# 安装
pip install ragas langchain-openai

from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_relevancy,
    context_recall
)
from datasets import Dataset

# 准备评估数据
dataset = Dataset.from_dict({
    "question": ["如何实现用户登录？", "数据库连接超时怎么办？"],
    "answer": ["使用 JWT 令牌认证...", "检查连接池配置..."],
    "contexts": [
        ["JWT 认证流程...", "令牌生成..."],
        ["连接池配置说明...", "超时参数设置..."]
    ],
    "ground_truth": ["使用 JWT 认证", "增加连接超时时间"]
})

# 运行评估
result = evaluate(
    dataset=dataset,
    metrics=[
        faithfulness,      # 忠实度：答案是否基于上下文
        answer_relevancy,  # 答案相关性
        context_relevancy, # 上下文相关性
        context_recall     # 上下文召回率
    ]
)

print(result)
# 输出示例：
# {'faithfulness': 0.85, 'answer_relevancy': 0.92, 'context_relevancy': 0.78, 'context_recall': 0.80}
```

**完整的上下文质量评估框架**：

```python
class ContextQualityEvaluator:
    def __init__(self, project_path):
        self.project_path = project_path

    def evaluate(self):
        """综合评估"""
        results = {
            "completeness": self.check_completeness(),
            "accuracy": self.check_accuracy(),
            "clarity": self.check_clarity(),
            "utility": self.check_utility(),
            "freshness": self.check_freshness()
        }

        # 计算总分
        weights = {
            "completeness": 0.25,
            "accuracy": 0.30,
            "clarity": 0.15,
            "utility": 0.20,
            "freshness": 0.10
        }

        total_score = sum(
            results[dim] * weights[dim]
            for dim in results
        )

        results["total"] = total_score
        return results

    def check_completeness(self):
        """检查完整性"""
        checklist = self._load_checklist()
        completed = sum(1 for item in checklist if self._has_content(item))
        return completed / len(checklist)

    def check_accuracy(self):
        """检查准确性"""
        mismatches = self._compare_docs_to_code()
        return 1 - (len(mismatches) / self._total_apis())

    def check_clarity(self):
        """检查清晰度"""
        docs = self._load_all_docs()
        scores = [textstat.flesch_reading_ease(doc) for doc in docs]
        return sum(scores) / len(scores) / 100  # 归一化

    def check_utility(self):
        """检查实用性"""
        # 通过历史对话记录评估
        return self._calculate_utility_from_history()

    def check_freshness(self):
        """检查时效性"""
        docs = self._get_all_doc_dates()
        fresh = sum(
            1 for _, date in docs
            if (datetime.now() - date).days < 90
        )
        return fresh / len(docs)
```

### 评分标准

```
总分 90-100分：优秀
- 文档完整、准确、清晰
- 显著提升 AI 效果
- 保持最新

总分 70-89分：良好
- 文档基本完整
- 大部分准确
- 有改进空间

总分 50-69分：及格
- 存在明显缺失
- 部分过时
- 需要改进

总分 <50分：不及格
- 文档严重不足
- 准确性差
- 急需重建
```

---

## 改进建议

### 针对完整性问题

**1. 使用 ACE 框架**

ACE（Agentic Context Engineering）让上下文从一次性提示变成可维护的知识资产：

```python
# ACE 上下文剧本结构
context_playbook = {
    "version": "1.0",
    "metadata": {
        "created": "2025-02-25",
        "last_updated": "2025-02-25",
        "maintainer": "团队名称"
    },
    "sections": [
        {
            "id": "system_role",
            "type": "system_prompt",
            "content": "你是资深的 Python 后端工程师，专注于 FastAPI 开发...",
            "priority": "high",
            "immutable": True
        },
        {
            "id": "tech_stack",
            "type": "knowledge",
            "content": {
                "framework": "FastAPI 0.104+",
                "database": "PostgreSQL 15",
                "orm": "SQLAlchemy 2.0"
            },
            "priority": "high",
            "version": "2.0"
        },
        {
            "id": "code_patterns",
            "type": "examples",
            "content": "常见代码模式示例...",
            "priority": "medium",
            "update_frequency": "monthly"
        }
    ],
    "evolution": {
        "strategy": "generate-reflect-curate",
        "update_triggers": ["code_review", "bug_report", "feature_change"]
    }
}
```

**2. 建立模板库**

```
优先级排序：
1. 高频使用的功能 → 优先补充
2. 核心架构 → 确保完整
3. 业务规则 → 避免歧义
```

**上下文模板示例**：

```markdown
# 功能开发上下文模板

## 1. 需求背景
- 功能描述：
- 用户故事：
- 验收标准：

## 2. 技术约束
- 技术栈：
- 性能要求：
- 安全要求：
- 兼容性要求：

## 3. 上下文资源
- 相关文档：
- 代码示例：
- API 参考：
- 类似实现：

## 4. 输出要求
- 代码风格：
- 测试要求：
- 文档要求：
- 审查要点：
```

### 针对准确性问题

**1. 使用 RAG 自动化评估**

```python
from deepeval import evaluate
from deepeval.metrics import FaithfulnessMetric, ContextualRelevancyMetric

# 配置 Faithfulness 评估
faithfulness_metric = FaithfulnessMetric(
    threshold=0.7,
    model="gpt-4o",
    include_reasoning=True
)

# 配置 Contextual Relevancy 评估
contextual_relevancy_metric = ContextualRelevancyMetric(
    threshold=0.7,
    model="gpt-4o",
    include_reasoning=True
)

# 测试用例
test_case = {
    "input": "如何实现用户登录？",
    "actual_output": "使用 JWT 令牌认证，有效期 24 小时...",
    "retrieval_context": [
        "JWT 认证流程说明...",
        "令牌生成代码示例..."
    ]
}

# 运行评估
result = faithfulness_metric.measure(test_case)
print(f"忠实度得分: {result.score}")
print(f"推理过程: {result.reason}")
```

**2. 持续验证机制**

```python
# 定期检查文档与代码的一致性
from pathlib import Path
import ast

def check_doc_code_consistency(project_path):
    """检查文档与代码的一致性"""

    issues = []

    # 1. 扫描所有 Python 文件
    for py_file in Path(project_path).rglob("*.py"):
        # 提取函数和类定义
        with open(py_file) as f:
            tree = ast.parse(f.read())

        functions = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
        classes = [node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]

        # 2. 检查对应的文档是否存在
        doc_file = py_file.with_suffix('.md')
        if doc_file.exists():
            with open(doc_file) as f:
                doc_content = f.read()

            # 检查函数是否在文档中提及
            for func in functions:
                if func not in doc_content:
                    issues.append({
                        "file": str(py_file),
                        "type": "missing_function_doc",
                        "function": func
                    })

        else:
            issues.append({
                "file": str(py_file),
                "type": "missing_doc_file"
            })

    return issues

# 使用
issues = check_doc_code_consistency("./src")
for issue in issues:
    print(f"⚠️  {issue['file']}: {issue.get('function', issue['type'])}")
```

**3. 定期审查**

```python
# 从代码自动生成文档
def auto_generate_docs():
    # 提取 API
    apis = extract_apis('./src')

    # 生成文档
    for api in apis:
        doc = generate_api_doc(api)
        save_doc(f'./docs/api/{api.name}.md', doc)

    # 对比差异
    diff = compare_with_existing()
    print("需要更新的文档：")
    for file in diff:
        print(f"  - {file}")
```

**2. 定期审查**

```
每周：
- 代码审查时检查文档

每月：
- 全面审查文档准确性

每季度：
- 运行自动化检查
- 修复发现的问题
```

### 针对清晰度问题

**1. 使用简单语言（去 AI 味）**

```
❌ 复杂表述（AI 味浓）：
"该模块通过封装底层数据访问逻辑，实现了业务逻辑与数据持久层的解耦，
采用 Repository 模式进行抽象，利用依赖注入实现可测试性。
此外，该模块还具备高度的可扩展性和灵活性，能够适应不同场景的需求。"

✅ 简单表述：
"数据访问模块把数据库操作从业务代码中分离出来。
这样业务代码不需要关心数据库细节，测试时也更容易模拟数据。
"
```

**2025 年写作原则**（来源：Wikipedia AI Cleanup）：

| 原则 | 说明 | 示例 |
|------|------|------|
| **删除填充短语** | 去除开场白和拐杖词 | "值得注意的是" → 删除 |
| **打破公式结构** | 避免三段式、二元对比 | "不仅……而且……" → 直接陈述 |
| **变化节奏** | 混合句子长度 | 两项优于三项 |
| **信任读者** | 不手把手引导 | 删除"让我们来看看" |
| **删除金句** | 避免可引用语句 | "标志着新的里程碑" → 删除 |

**2. 添加示例**

```markdown
## 用户注册

### 基本用法

\`\`\`typescript
const result = await userService.register({
  phone: '13800138000',
  password: 'password123',
  code: '123456'
});

// 返回用户信息
console.log(result.user);
// 返回认证 token
console.log(result.token);
\`\`\`

### 错误处理

\`\`\`typescript
try {
  await userService.register(input);
} catch (e) {
  if (e instanceof DuplicatePhoneError) {
    // 手机号已存在
  } else if (e instanceof InvalidCodeError) {
    // 验证码错误
  }
}
\`\`\`
```

### 针对时效性问题

**1. 设置更新提醒**

```python
# 检测代码变更并提醒更新文档
def check_doc_updates():
    # 获取最近修改的代码
    changed_files = get_changed_files(days=7)

    # 找到相关文档
    for file in changed_files:
        docs = find_related_docs(file)

        # 发送提醒
        if docs:
            send_remind(f"""
代码 {file} 已更新，请检查相关文档是否需要更新：
{chr(10).join(docs)}
            """)
```

**2. 版本标记**

```markdown
# 用户 API

> 最后更新：2025-02-15
> 适用版本：v2.3.0+

## POST /api/users/register

注册新用户。

**变更历史**：
- v2.3.0 (2025-02-15): 新增邮箱注册支持
- v2.0.0 (2024-12-01): 添加验证码验证
```

---

## 持续改进

### 建立反馈循环

**将上下文工程纳入 CI/CD 流程**：

```yaml
# .github/workflows/context-quality.yml
name: Context Quality Check

on:
  pull_request:
    paths:
      - 'docs/**'
      - '.claude/**'
  push:
    branches: [main]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install textstat ragas deepeval

      - name: Check readability
        run: |
          python scripts/check_readability.py --docs docs/

      - name: Check RAG quality
        run: |
          python scripts/check_rag_quality.py
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Generate quality report
        run: |
          python scripts/generate_quality_report.py > quality-report.md

      - name: Comment PR with results
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('quality-report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
```

**质量监控仪表盘**：

```python
# quality_dashboard.py
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List
import json

@dataclass
class QualityMetrics:
    """质量指标数据类"""
    completeness: float  # 完整性得分
    accuracy: float      # 准确性得分
    clarity: float       # 清晰度得分
    freshness: float     # 时效性得分
    timestamp: datetime

    @property
    def overall_score(self) -> float:
        """综合得分"""
        weights = {
            "completeness": 0.25,
            "accuracy": 0.30,
            "clarity": 0.15,
            "freshness": 0.10
        }
        return (
            self.completeness * weights["completeness"] +
            self.accuracy * weights["accuracy"] +
            self.clarity * weights["clarity"] +
            self.freshness * weights["freshness"]
        )

class QualityMonitor:
    """上下文质量监控系统"""

    def __init__(self, config_file: str = "quality_config.json"):
        with open(config_file) as f:
            self.config = json.load(f)
        self.metrics_history: List[QualityMetrics] = []

    def collect_metrics(self) -> QualityMetrics:
        """收集当前质量指标"""
        return QualityMetrics(
            completeness=self._check_completeness(),
            accuracy=self._check_accuracy(),
            clarity=self._check_clarity(),
            freshness=self._check_freshness(),
            timestamp=datetime.now()
        )

    def _check_completeness(self) -> float:
        """检查完整性"""
        # 检查必需的文档文件是否存在
        required_docs = self.config.get("required_docs", [])
        existing = sum(1 for doc in required_docs if Path(doc).exists())
        return existing / len(required_docs) if required_docs else 0

    def _check_accuracy(self) -> float:
        """检查准确性（运行 RAG 评估）"""
        # 这里集成实际的 RAG 评估
        # 简化示例：
        return 0.85  # 假设评估结果

    def _check_clarity(self) -> float:
        """检查清晰度"""
        import textstat
        total_score = 0
        count = 0

        for doc_file in Path("docs").rglob("*.md"):
            with open(doc_file) as f:
                text = f.read()
            score = textstat.flesch_reading_ease(text)
            # 归一化到 0-1
            normalized = min(score / 100, 1.0)
            total_score += normalized
            count += 1

        return total_score / count if count > 0 else 0

    def _check_freshness(self) -> float:
        """检查时效性"""
        from datetime import timedelta

        threshold = timedelta(days=90)  # 90天
        fresh_count = 0
        total_count = 0

        for doc_file in Path("docs").rglob("*.md"):
            mtime = datetime.fromtimestamp(doc_file.stat().st_mtime)
            age = datetime.now() - mtime
            if age < threshold:
                fresh_count += 1
            total_count += 1

        return fresh_count / total_count if total_count > 0 else 0

    def generate_report(self) -> str:
        """生成质量报告"""
        if not self.metrics_history:
            return "# 质量报告\n\n暂无数据。"

        latest = self.metrics_history[-1]
        previous = self.metrics_history[-2] if len(self.metrics_history) > 1 else None

        report = f"""# 上下文质量报告
生成时间：{latest.timestamp.strftime('%Y-%m-%d %H:%M:%S')}

## 总体得分：{latest.overall_score:.1%}

### 分项得分
- 完整性：{latest.completeness:.1%}
- 准确性：{latest.accuracy:.1%}
- 清晰度：{latest.clarity:.1%}
- 时效性：{latest.freshness:.1%}

### 趋势分析
"""

        if previous:
            for metric in ["completeness", "accuracy", "clarity", "freshness"]:
                current_val = getattr(latest, metric)
                previous_val = getattr(previous, metric)
                change = current_val - previous_val
                arrow = "↑" if change > 0 else "↓" if change < 0 else "→"
                report += f"- {metric}: {arrow} {abs(change):.1%}\n"

        return report

# 使用示例
monitor = QualityMonitor()
metrics = monitor.collect_metrics()
monitor.metrics_history.append(metrics)
print(monitor.generate_report())
```

**建立持续改进流程**：

```python
def generate_improvement_suggestions():
    """基于评估结果生成改进建议"""
    score = evaluate_quality()

    suggestions = []

    # 完整性
    if score['completeness'] < 0.7:
        suggestions.append({
            "priority": "high",
            "category": "completeness",
            "action": "补充缺失的模块文档",
            "details": get_missing_modules()
        })

    # 准确性
    if score['accuracy'] < 0.8:
        suggestions.append({
            "priority": "high",
            "category": "accuracy",
            "action": "修复与代码不一致的文档",
            "details": get_inconsistent_docs()
        })

    # 清晰度
    if score['clarity'] < 0.6:
        suggestions.append({
            "priority": "medium",
            "category": "clarity",
            "action": "简化语言，添加示例",
            "details": get_unclear_sections()
        })

    # 时效性
    if score['freshness'] < 0.7:
        suggestions.append({
            "priority": "medium",
            "category": "freshness",
            "action": "更新过时文档",
            "details": get_stale_docs()
        })

    return suggestions
```

---

## 上下文管理的反模式

> 知道"什么不该做"和知道"什么该做"同样重要。以下是 2025-2026 年社区总结的常见错误。

### 反模式 1：一个 Prompt 搞定一切

**表现**：试图在一个系统提示词里包含所有规则、所有文档、所有场景。

```
❌ 错误的做法：
系统提示词写了 15,000 tokens，包含：
- 技术栈说明（3,000 tokens）
- 完整 API 文档（8,000 tokens）
- 所有模块的业务规则（4,000 tokens）
- 代码规范、命名约定、错误处理...

结果：
- 大部分内容与当前任务无关
- AI 被大量低相关性信息稀释注意力
- "Lost in the Middle"问题加剧
```

**为什么是个反模式**：上下文越长，AI 对中间部分的关注度越低。2025-2026 年多项研究（arXiv 2511.13900, 2510.10276）证实，即使长上下文模型性能提升，"中间遗忘"问题依然存在。

**正确做法**：

```
✅ 正确的做法：
系统提示词只包含：
- 角色定义（200 tokens）
- 核心约束（300 tokens）

内容通过 RAG 或按需引用按需加载：
"参考项目文档的 API 章节，帮我写..."
```

### 反模式 2：上下文越多越好

**表现**：只要能塞进上下文窗口的信息，不管相关不相关，全塞进去。

```
❌ "我给了 AI 整个代码库（50 万 tokens），它应该什么都知道了吧？"

结果：
- AI 的准确率和召回率反而下降
- 响应变慢（处理 50 万 tokens 需要时间）
- 费用飙升（输入 token 按量计费）
- 中间代码文件被忽略
```

**为什么是个反模式**：Anthropic 官方文档明确指出 "More context isn't automatically better"。上下文窗口越大，准确率并非线性提升——在某些场景下反而是下降的。2025-2026 年对 Claude、GPT、Gemini 的长上下文实际效果测试表明，**有效上下文往往远小于最大上下文窗口**。

**正确做法**：

```
✅ 按需提供，分层加载
第 1 层：系统提示（1K tokens）— 角色和基本约束
第 2 层：项目上下文（5K tokens）— 技术栈和规范
第 3 层：按需加载 — 具体代码文件或文档

别一次性全塞进去。
```

### 反模式 3：不验证 AI 的理解

**表现**：给了上下文就默认 AI 正确理解了，直接接受输出。

```
❌
你：项目用 TypeScript + Zustand，请帮我写一个组件
AI：（生成了一段用 Redux + JavaScript 的代码）
你：（复制粘贴到项目里，报错）
```

**为什么是个反模式**：AI 可能忽略了你提供的上下文，或者在长对话中"遗忘"了早期提供的规范。不是 AI 不听话，而是上下文在注意力机制中的衰减是结构性的。

**正确做法**：

```
✅
你：项目用 TypeScript + Zustand，请帮我写一个组件
    （提供后追问）
    "在开始之前，请确认你理解了我的项目：
    1. 用的什么框架？
    2. 用什么状态管理？
    3. 代码风格要求？"
AI：（复述确认）
你：正确，开始吧
```

### 反模式 4：静态上下文从不更新

**表现**：CLAUDE.md 或 Wiki 文档写了就再也没改过。

```
❌
Wiki 里写："状态管理用 Redux"
实际项目：半年前已迁移到 Zustand
AI 每次还按 Redux 生成代码
```

**为什么是个反模式**：过时的上下文比没有上下文更危险——它不仅不帮助 AI，还误导 AI。Stack Overflow 的调查显示，"缺乏良好文档"是开发效率的主要障碍，但"过时的文档"其实更糟。

**正确做法**：

```
✅
- 代码变更时同步更新文档
- 把文档检查纳入 PR 模板
- 定期审计：标记超过 90 天未更新的文档
- 标注最后更新时间，让 AI 自己判断时效
```

### 反模式 5：忽略"中间遗忘"问题

**表现**：以为给了足够的上下文，AI 就应该用到，不管这些内容在上下文的什么位置。

```
❌
系统提示（开头部分）：
"项目用 React 18，组件命名用 PascalCase"

...中间塞了 50K tokens 的其他内容...

最后（最新部分）：
"帮我写一个新的用户组件"

AI：生成了 `user_component.js`（不符合 PascalCase）
```

**为什么是个反模式**：多项研究（从 2023 年 Stanford 的"Lost in the Middle"到 2025 年的新论文）一致发现，LLM 对上下文两端的信息关注度高，对中间的信息关注度低。

**正确做法**：

```
✅
1. 关键信息放开头或结尾
2. 重要的约束条件在需要时重复提及
3. 用结构化格式（列表、表格）替代大段文本
4. 避免在关键信息之间插入大量无关内容
```

### 反模式 6：上下文泄漏/污染

**表现**：把不同场景、不同用户的上下文混在一起，或者把敏感信息当作上下文。

```
❌
- 把 A 模块的规则传给正在写 B 模块的 AI
- 在生产环境的对话中使用开发环境的配置
- 把 API 密钥、数据库密码包含在上下文中
- 多租户系统中没有隔离不同用户的上下文
```

**为什么是个反模式**：上下文泄漏对 AI 输出的准确性和安全性都有影响。2025 年 Sec-Context 项目专门总结了 AI 代码安全的反模式。

**正确做法**：

```
✅
- 严格隔离不同模块的上下文
- 只提供当前任务需要的信息
- 敏感信息必须从上下文中过滤
- 多租户系统使用 RAG + 元数据过滤实现上下文隔离
```

### 反模式总结表

| 反模式 | 症状 | 修复方案 |
|--------|------|---------|
| 一个 Prompt 搞定一切 | 系统提示词太长，效果差 | 按需加载，RAG 检索 |
| 上下文越多越好 | 塞满上下文窗口 | 最小有效集原则 |
| 不验证理解 | AI 输出与预期不符 | 让 AI 复述确认 |
| 静态上下文不更新 | AI 用过时信息生成代码 | 建立更新机制，CI/CD |
| 忽略中间遗忘 | 关键信息被忽略 | 关键信息放两端/重复 |
| 上下文泄漏/污染 | 无关或敏感信息混入 | 隔离、过滤、最小权限 |

```
提示词工程 → 上下文工程
关注"怎么问"  → 关注"喂什么料"
单次优化     → 持续演化的知识资产
```

上下文工程已被视为与测试、代码审查同等重要的核心开发技能。

**2. 五大评估维度**

| 维度 | 重点 | 评估工具 |
|------|------|----------|
| **完整性** | L1/L2/L3 三层上下文 | ACE 框架 |
| **准确性** | RAG 三大指标 | Ragas, DeepEval |
| **清晰度** | 多语言可读性 | Textstat, TextGears |
| **实用性** | AI 输出质量提升 | A/B 测试 |
| **时效性** | 自动化过期检测 | CI/CD 集成 |

**3. 评估工具生态成熟**

- **LangChain OpenEvals/AgentEvals**：快速开始 LLM 和 Agent 评估
- **Ragas**：RAG 系统专项评估
- **DeepEval**：企业级 LLM 评估框架
- **Textstat**：文本可读性分析
- **TextGears**：多语言可读性检查

**4. 将质量纳入 CI/CD**

```yaml
评估 → 监控 → 改进 → 验证
  ↑      ↓      ↑      ↓
  └──────┴──────┴──────┘
      持续改进闭环
```

**5. 从"写提示"到"设计系统"**

上下文工程不是优化一句话，而是设计让模型工作的信息环境：

```
提示工程：优化单次指令
上下文工程：设计信息生态
  ├─ 系统提示（角色定义）
  ├─ 知识库（RAG 检索）
  ├─ 记忆（上下文历史）
  ├─ 工具（API 调用）
  └─ 结构化输出（可解析结果）
```

### 评估检查清单

```markdown
## 评估准备
- [ ] 确定评估范围
- [ ] 准备评估工具
- [ ] 设置基准线

## 执行评估
- [ ] 运行自动化检查
- [ ] 收集反馈数据
- [ ] 计算各维度得分

## 分析结果
- [ ] 识别问题
- [ ] 分析根本原因
- [ ] 确定优先级

## 实施改进
- [ ] 制定改进计划
- [ ] 分配责任人
- [ ] 设置截止日期

## 验证效果
- [ ] 重新评估
- [ ] 对比改进前后
- [ ] 记录经验教训
```

### 下一步

掌握了上下文质量评估后，我们将学习：

- [未来趋势与工具](./09-future-trends/) → 新兴技术和方向
- [AI Agent 记忆系统](./10-ai-agent-memory/) → Agent 长期记忆架构

---

[← 返回文章目录](../context-management/) | [继续学习：未来趋势与工具 →](./09-future-trends/)
