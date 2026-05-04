# Skills 系统

> **学习目标**: 理解 Claude Agent Skills 的设计理念、使用方法和最佳实践
>
> **预计时间**: 40 分钟
>
> **难度等级**: ⭐⭐☆☆☆

---

## 核心概念

### 什么是 Skills?

**Skills** 是 Claude Agent 的能力模块,类似于"插件"或"技能包"。

::: tip 通俗理解
把 Agent 想象成一个工人,Skills 就是他的工具箱。需要木工活就带上锯子和锤子,需要电工活就带上万用表和剥线钳。不同任务组合不同的 Skills。
::

**与传统 Agent 的区别**:

| 传统 Agent | Skills Agent |
|-----------|-------------|
| 每个 Agent 从零构建 | 从预构建 Skills 组装 |
| 能力固定在 Agent 定义中 | 动态加载/卸载 Skills |
| 代码重复,难以复用 | Skills 可跨 Agent 复用 |
| 维护成本高 | 统一更新和测试 |

---

## Skills 发展历程

### 关键节点

| 时间 | 事件 |
|------|------|
| 2025 年 9 月 | Claude Agent SDK 发布,内建 Skills 支持 |
| 2025 年 10 月 | Skills 在 Claude.ai、Claude Code 中可用 |
| 2025 年 12 月 | Anthropic 将 Skills 作为**开放标准**发布[^1] |
| 2026 年 1 月 | 社区贡献超过 500 个 Skills |

### 开放标准的意义

**之前**: Skills 只能在 Claude 生态中使用

**现在**: 任何 Agent 框架都可以实现 Skills 协议

**影响**:
- Skills 可以跨平台迁移
- 社区可以贡献和维护 Skills
- 避免供应商锁定

---

## Skills 架构

### Skill 定义结构

```yaml
# 示例: 代码搜索 Skill
name: code_search
version: 1.0.0
description: "在代码库中搜索代码片段"

# 元数据
author: "Anthropic"
tags: ["code", "search", "development"]

# 所需工具
tools:
  - name: grep
    description: "使用 grep 搜索文件内容"
  - name: find
    description: "使用 find 搜索文件名"

# 指令
instructions: |
  你是一个代码搜索专家。

  工作流程:
  1. 理解用户的搜索意图
  2. 选择合适的搜索工具(grep 或 find)
  3. 构建搜索查询
  4. 执行搜索并返回结果

  注意事项:
  - 优先使用 grep 搜索代码内容
  - 只在需要匹配文件名时使用 find
  - 返回文件路径和匹配的代码行
  - 高亮关键词

# 示例用法
examples:
  - input: "找到所有使用 useState 的地方"
    output: "使用 grep -r 'useState' --include='*.js' --include='*.jsx'"
  - input: "找到所有测试文件"
    output: "使用 find . -name '*.test.js' -o -name '*.spec.js'"
```

### Skill 组成部分

#### 1. 元数据(Metadata)

```yaml
name: file_operations         # Skill 唯一标识
version: 1.2.0                # 版本号
description: "文件读写操作"    # 功能描述
author: "社区贡献者"          # 作者
tags: ["filesystem", "io"]    # 标签(用于搜索)
license: "MIT"                # 许可证
```

#### 2. 工具依赖(Tools)

Skill 需要哪些工具才能工作:

```yaml
tools:
  - name: read_file
    type: mcp                 # MCP 工具
    server: filesystem        # MCP 服务器名称

  - name: write_file
    type: mcp
    server: filesystem

  - name: git_status
    type: function            # 函数调用
    implementation: custom.git_status
```

#### 3. 指令(Instructions)

告诉 Agent 如何使用这些工具:

```yaml
instructions: |
  你可以安全地读写文件。

  流程:
  1. 读取文件前先检查文件是否存在
  2. 写入文件前建议用户备份
  3. 写入后显示修改摘要

  约束:
  - 只能操作项目目录下的文件
  - 不能写入可执行文件
  - 大文件(>10MB)需要用户确认
```

#### 4. 示例(Examples)

展示 Skill 的典型用法:

```yaml
examples:
  - scenario: "读取配置文件"
    input: "读取 .env 文件"
    steps:
      - 检查文件是否存在
      - 读取文件内容
      - 解析键值对
    output: "DB_HOST=localhost\nDB_PORT=5432\n..."

  - scenario: "创建新文件"
    input: "创建 utils/helpers.py"
    steps:
      - 检查目录是否存在
      - 创建文件并写入初始内容
      - 通知用户
    output: "已创建 utils/helpers.py"
```

---

## 使用 Skills

### 在 Claude Desktop 中

**1. 打开 Skills 面板**

点击左侧工具栏的 Skills 图标

**2. 浏览和搜索**

- 按类别浏览:代码、数据、Web、文档
- 搜索关键词:"数据库"、"图表"、"API"

**3. 启用 Skills**

勾选需要的 Skills,Agent 会自动加载

**4. 开始对话**

```
你: 使用 code_search 找到所有使用 useEffect 的文件

Claude: 我来帮你搜索...

[使用 code_search Skill]
执行: grep -r "useEffect" --include="*.js" --include="*.jsx"

找到 15 个文件:
- src/components/Header.jsx (line 23)
- src/hooks/useAuth.js (line 12)
...
```

---

### 在 Claude Code 中

**IDE 集成**:

```python
# JetBrains / VS Code 插件

agent = ClaudeCodeAgent(
    skills=[
        "code_search",      # 代码搜索
        "refactor",         # 代码重构
        "test_generation",  # 测试生成
        "documentation"     # 文档生成
    ]
)

# 在编辑器中运行
agent.refactor_selection(
    file="src/utils/helpers.js",
    start_line=10,
    end_line=25,
    instruction="提取为独立函数,添加类型注解"
)
```

**实时预览**:

IDE 中显示 Agent 的操作过程:
- 正在读取文件...
- 正在分析代码...
- 正在生成重构方案...
- 应用更改

---

### 在代码中(Claude Agent SDK)

```python
from anthropic import AnthropicBedrock
from anthropic.skills import SkillLoader

client = AnthropicBedrock()

# 加载 Skills
skill_loader = SkillLoader()
code_skill = skill_loader.load("code_analysis")
git_skill = skill_loader.load("git_operations")

# 创建 Agent
agent = client.agent(
    name="代码审查员",
    skills=[code_skill, git_skill],
    instructions="""
    你是一个资深代码审查员。
    使用 code_analysis 分析代码质量。
    使用 git_operations 查看修改历史。
    """
)

# 运行
result = agent.run("审查最近的 PR #123")
```

**动态加载/卸载**:

```python
# 运行时添加 Skill
agent.add_skill("performance_profiling")

# 执行性能分析
agent.run("分析这段代码的性能瓶颈")

# 完成后移除
agent.remove_skill("performance_profiling")
```

---

### 在 Agent 平台中

**Claude.ai Team/Enterprise**:

管理员可以为团队配置 Skills:

```yaml
# 团队 Skills 配置
team_skills:
  - name: code_review
    enabled: true
    config:
      max_file_size: 1MB
      allowed_extensions: [".py", ".js", ".ts"]

  - name: security_scan
    enabled: true
    config:
      severity_threshold: "medium"
      ignore_patterns: ["*.test.js"]
```

团队成员使用时,这些 Skills 会自动可用。

---

## 官方 Skills 库

### 代码操作类

| Skill | 功能 | 典型用法 |
|-------|------|---------|
| **code_search** | 搜索代码 | "找到所有调用 API 的地方" |
| **refactor** | 代码重构 | "把这个函数拆成更小的函数" |
| **code_explain** | 代码解释 | "这段代码是干什么的?" |
| **debug** | 调试辅助 | "帮我找这个 bug 的原因" |
| **test_generation** | 生成测试 | "为这个函数写单元测试" |

### 数据处理类

| Skill | 功能 | 典型用法 |
|-------|------|---------|
| **csv_operations** | CSV 处理 | "分析 sales.csv 的趋势" |
| **json_tools** | JSON 操作 | "从 API 响应提取字段" |
| **database_query** | 数据库查询 | "查询上个月的新用户" |
| **data_visualization** | 数据可视化 | "生成销售额折线图" |

### Web 操作类

| Skill | 功能 | 典型用法 |
|-------|------|---------|
| **web_scraper** | 网页抓取 | "抓取这个网页的正文" |
| **api_client** | API 调用 | "调用 GitHub API 获取 PR 信息" |
| **web_search** | 网络搜索 | "搜索最新的 Python 版本" |
| **rss_reader** | RSS 阅读 | "总结今天的科技新闻" |

### 文档处理类

| Skill | 功能 | 典型用法 |
|-------|------|---------|
| **pdf_parser** | PDF 解析 | "提取 PDF 中的表格" |
| **markdown_tools** | Markdown 操作 | "把这些内容转为 Markdown" |
| **docx_converter** | Word 转换 | "把 .docx 转为 Markdown" |
| **document_summarizer** | 文档摘要 | "总结这份 50 页的报告" |

### DevOps 类

| Skill | 功能 | 典型用法 |
|-------|------|---------|
| **git_operations** | Git 操作 | "查看最近的提交历史" |
| **docker_tools** | Docker 管理 | "构建并运行容器" |
| **deployment** | 部署辅助 | "部署到 AWS Lambda" |
| **log_analyzer** | 日志分析 | "找出错误日志的模式" |

---

## 构建 Skills

### 基础 Skill

**文件结构**:

```
my_skill/
├── skill.yaml          # Skill 定义
├── instructions.md     # 详细指令
├── examples/
│   ├── example1.yaml
│   └── example2.yaml
└── tests/
    └── test_skill.py
```

**skill.yaml**:

```yaml
name: my_custom_skill
version: 1.0.0
description: "我的自定义 Skill"

tools:
  - name: my_tool
    type: mcp
    server: my_mcp_server

instructions: |
  你是一个专业助手。

  使用 my_tool 来完成以下任务:
  1. 理解用户需求
  2. 准备参数
  3. 调用工具
  4. 返回结果

examples:
  - input: "示例输入"
    output: "示例输出"
```

### 高级 Skill

**条件逻辑**:

```yaml
instructions: |
  根据不同情况选择不同策略:

  如果用户输入包含"搜索":
    - 使用 search_tool
    - 返回前 10 个结果

  如果用户输入包含"分析":
    - 使用 analyze_tool
    - 生成详细报告

  如果用户输入包含"导出":
    - 使用 export_tool
    - 支持 CSV、JSON、PDF 格式
```

**多工具协作**:

```yaml
tools:
  - name: search
    server: code_search
  - name: analyze
    server: code_analysis
  - name: refactor
    server: code_refactor

instructions: |
  典型工作流:

  1. 搜索阶段:
     - 使用 search 找到相关代码

  2. 分析阶段:
     - 使用 analyze 理解代码逻辑

  3. 重构阶段:
     - 使用 refactor 应用改进

  每个阶段完成后向用户确认再继续。
```

**参数校验**:

```yaml
parameters:
  - name: file_path
    type: string
    required: true
    validation:
      pattern: ".*\\.(py|js|ts)$"
      message: "只支持 Python 和 JavaScript 文件"

  - name: max_results
    type: integer
    required: false
    default: 10
    validation:
      min: 1
      max: 100
      message: "结果数必须在 1-100 之间"
```

### 测试 Skill

```python
# tests/test_skill.py
import pytest
from anthropic.skills import SkillLoader

def test_skill_loading():
    skill = SkillLoader().load("my_custom_skill")
    assert skill.name == "my_custom_skill"
    assert len(skill.tools) > 0

def test_skill_execution():
    skill = SkillLoader().load("my_custom_skill")

    result = skill.execute(
        tool="my_tool",
        parameters={"input": "test"}
    )

    assert result["status"] == "success"

@pytest.mark.parametrize("input,expected", [
    ("搜索代码", "使用 search_tool"),
    ("分析代码", "使用 analyze_tool"),
])
def test_skill_routing(input, expected):
    skill = SkillLoader().load("my_custom_skill")

    route = skill.route(input)
    assert expected in route["instructions"]
```

---

## 发布 Skills

### 本地使用

```bash
# 放在本地 Skills 目录
cp -r my_skill ~/.claude/skills/

# 在 Claude Desktop 中可用
```

### 社区发布

**1. 推送到 GitHub**

```bash
git init
git add .
git commit -m "Add my_custom_skill"
git remote add origin https://github.com/username/skills.git
git push
```

**2. 提交到 Skills Registry**

访问 https://registry.anthropic.com/skills/submit

**3. 等待审核**

Anthropic 团队会审核:
- 代码质量
- 文档完整性
- 安全性
- 实用性

**4. 发布**

审核通过后,其他用户就可以搜索并使用你的 Skill。

---

## 最佳实践

### Skill 设计原则

#### 1. 单一职责

**好**:

```yaml
name: csv_export
description: "导出数据为 CSV 格式"
```

**不好**:

```yaml
name: data_operations
description: "导出、导入、转换、分析、可视化数据"
# 太宽泛,难以维护
```

#### 2. 明确的输入输出

```yaml
inputs:
  - name: data
    type: array
    description: "要导出的数据数组"
  - name: filename
    type: string
    description: "输出文件名"

outputs:
  type: file
  format: csv
  description: "生成的 CSV 文件"
```

#### 3. 提供示例

```yaml
examples:
  - scenario: "导出用户列表"
    input: {
      "data": [
        {"name": "Alice", "age": 30},
        {"name": "Bob", "age": 25}
      ],
      "filename": "users.csv"
    }
    output: "已生成 users.csv,包含 2 条记录"
```

#### 4. 错误处理

```yaml
instructions: |
  错误处理策略:

  1. 输入验证:
     - 检查必需参数
     - 验证数据类型
     - 拒绝非法输入

  2. 优雅降级:
     - 如果工具不可用,建议替代方案
     - 如果部分失败,返回已完成的操作

  3. 清晰的错误消息:
     - 说明问题原因
     - 提供解决建议
```

### 性能优化

#### 1. 缓存

```yaml
cache:
  enabled: true
  ttl: 3600  # 缓存 1 小时
  key_prefix: "my_skill"
```

#### 2. 批处理

```yaml
instructions: |
  如果用户请求多个类似操作,批处理以提高效率。

  不好:
  - 处理文件 A
  - 处理文件 B
  - 处理文件 C

  好:
  - 批量处理文件 A、B、C
```

#### 3. 流式输出

```yaml
streaming:
  enabled: true
  chunk_size: 1000  # 每 1000 tokens 返回一次
```

---

## 思考题

::: info 检验你的理解
1. **Skills 和 MCP 工具有什么区别?什么时候用哪个?**

2. **为什么 Anthropic 要将 Skills 作为开放标准发布?这对生态有什么好处?**

3. **设计一个 Skill 来"生成 API 文档",需要包含哪些部分?**
   - 提示:工具、指令、示例、错误处理

4. **如何测试一个 Skill 的质量和可靠性?**
:::

---

## 本节小结

通过本节学习,你应该掌握了:

✅ **Skills 概念**
- 可复用的 Agent 能力模块
- 从预构建 Skills 组装 Agent
- 开放标准的意义

✅ **Skills 架构**
- 元数据、工具、指令、示例
- 官方 Skills 库
- 自定义 Skill 构建

✅ **实际应用**
- 在 Claude Desktop/Code 中使用
- 在代码中动态加载
- 发布到社区

✅ **最佳实践**
- 单一职责原则
- 明确的输入输出
- 错误处理和性能优化

---

**下一步**: 在[下一节](/agent-ecosystem/07-agent-ecosystem/05-function-calling)中,我们将对比 Function Calling 的不同实现,深入理解工具调用的技术细节。

---

[← 返回模块目录](/agent-ecosystem/07-agent-ecosystem) | [继续学习:Function Calling →](/agent-ecosystem/07-agent-ecosystem/05-function-calling)

---

[^1]: Anthropic Engineering Blog, "Introducing Claude Agent Skills as an Open Standard", December 2025. https://www.anthropic.com/engineering/skills-open-standard
