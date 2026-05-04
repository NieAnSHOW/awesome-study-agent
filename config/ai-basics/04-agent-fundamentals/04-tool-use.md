# 工具使用

> **本章学习目标**：理解 AI Agent 如何使用外部工具、工具调用的机制、常见工具类型以及最佳实践
>
> **预计阅读时间**：45 分钟

---

## 一、工具使用概述

### 1.1 什么是工具使用？

**工具 (Tool)** 是 Agent 连接外部世界的桥梁。

```
没有工具的 Agent：
❌ 只能基于训练数据回答
❌ 无法访问实时信息
❌ 无法执行具体操作
❌ 能力受限于模型

有工具的 Agent：
✅ 能调用外部 API
✅ 能获取实时数据
✅ 能执行具体操作
✅ 能力无限扩展
```

### 1.2 工具的作用

```
┌────────────────────────────────────────┐
│         工具扩展了 Agent 的能力         │
├────────────────────────────────────────┤
│                                        │
│  信息获取能力                          │
│  • 搜索引擎（实时信息）                │
│  • 数据库查询（结构化数据）            │
│  • 文件读取（本地文件）                │
│                                        │
│  操作执行能力                          │
│  • API 调用（服务集成）                │
│  • 代码执行（运行程序）                │
│  • 系统操作（文件管理）                │
│                                        │
│  计算处理能力                          │
│  • 数学计算（复杂运算）                │
│  • 数据分析（统计处理）                │
│  • 图像处理（视觉任务）                │
│                                        │
│  创作生成能力                          │
│  • 图像生成（文生图）                  │
│  • 文档生成（报告写作）                │
│  • 代码生成（程序开发）                │
│                                        │
└────────────────────────────────────────┘
```

### 1.3 工具调用的基本流程

```
┌─────────────┐
│ Agent 决策  │ "我需要搜索最新信息"
└──────┬──────┘
       ↓
┌──────────────────────────────────┐
│  1. 选择工具                      │
│     • 分析需求                    │
│     • 匹配工具                    │
│     • 准备参数                    │
└──────────┬───────────────────────┘
           ↓
┌──────────────────────────────────┐
│  2. 调用工具                      │
│     • 发送请求                    │
│     • 等待执行                    │
│     • 获取结果                    │
└──────────┬───────────────────────┘
           ↓
┌──────────────────────────────────┐
│  3. 处理结果                      │
│     • 解析响应                    │
│     • 提取信息                    │
│     • 集成到推理中                │
└──────────┬───────────────────────┘
           ↓
┌──────────────────────────────────┐
│  4. 继续任务                      │
│     • 基于结果决策                │
│     • 可能调用更多工具            │
│     • 或返回最终答案              │
└──────────────────────────────────┘
```

---

## 二、工具调用的实现方式

### 2.1 Function Calling（推荐）

**定义**：
LLM 原生支持的工具调用机制。

**工作原理**：
```
1. 给 LLM 提供工具的定义（名称、描述、参数）
2. LLM 决定是否调用工具
3. 返回结构化的函数调用请求
4. 系统执行函数
5. 将结果返回给 LLM
6. LLM 基于结果生成最终响应
```

**示例**：
```python
import openai

# 定义工具
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# Agent 决策
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "北京今天天气怎么样？"}
    ],
    tools=tools
)

# 检查是否要调用工具
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    function_name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)

    # 执行工具
    if function_name == "get_weather":
        result = get_weather(arguments["city"])

    # 将结果返回给 LLM
    second_response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "北京今天天气怎么样？"},
            response.choices[0].message,
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            }
        ]
    )

    print(second_response.choices[0].message.content)
```

**优点**：
- ✓ 结构化、可靠
- ✓ 精确的参数提取
- ✓ 减少解析错误
- ✓ 原生支持

**缺点**：
- ✗ 仅部分模型支持
- ✗ 格式固定

---

### 2.2 文本解析

**定义**：
从 LLM 的文本输出中解析工具调用。

**实现方式**：
```python
# 方式 1: 特殊标记
prompt = """
你可以使用以下工具：
- search: 搜索引擎，格式：SEARCH[查询内容]
- calculate: 计算器，格式：CALCULATE[数学表达式]

用户问题：100 乘以 25 等于多少？
"""

# LLM 输出：CALCULATE[100 * 25]
# 解析并执行
if "CALCULATE[" in output:
    expr = output.split("CALCULATE[")[1].split("]")[0]
    result = eval(expr)

# 方式 2: JSON 格式
prompt = """
以 JSON 格式返回工具调用：
{
  "tool": "search",
  "parameters": {"query": "..."}
}
"""
```

**优点**：
- ✓ 兼容所有模型
- ✓ 灵活

**缺点**：
- ✗ 不稳定
- ✗ 容易解析错误
- ✗ 需要精心设计提示词

---

### 2.3 路由器模式

**定义**：
通过预定义规则将任务路由到合适的工具。

**实现**：
```python
class ToolRouter:
    def __init__(self):
        self.tools = {
            "search": SearchTool(),
            "calculator": CalculatorTool(),
            "weather": WeatherTool(),
            "database": DatabaseTool()
        }
        self.router_rules = {
            "keywords": {
                "搜索|查找|search": "search",
                "计算|乘|除|calculate": "calculator",
                "天气|气温|weather": "weather",
                "数据库|查询|database": "database"
            }
        }

    def route(self, user_input):
        """根据输入路由到合适的工具"""
        # 意图识别
        for pattern, tool_name in self.router_rules["keywords"].items():
            if re.search(pattern, user_input):
                tool = self.tools[tool_name]
                return tool

        # 默认让 LLM 决定
        return self.llm_decide(user_input)

    def llm_decide(self, user_input):
        """使用 LLM 决定"""
        prompt = f"""
        用户输入：{user_input}

        可用工具：{list(self.tools.keys())}

        返回最合适的工具名称（只返回名称）：
        """
        tool_name = llm.generate(prompt)
        return self.tools.get(tool_name.strip())
```

**优点**：
- ✓ 快速
- ✓ 可控
- ✓ 成本低

**缺点**：
- ✗ 灵活性差
- ✗ 需要维护规则

---

## 三、常见工具类型

### 3.1 信息获取工具

#### 搜索引擎
```python
class SearchTool:
    """使用搜索引擎获取实时信息"""

    def search(self, query, num_results=5):
        """
        执行搜索

        参数：
            query: 搜索关键词
            num_results: 返回结果数量

        返回：
            搜索结果列表
        """
        # 使用搜索 API（如 Google、Bing、DuckDuckGo）
        results = search_api.search(query, num=num_results)

        return {
            "query": query,
            "results": [
                {
                    "title": r.title,
                    "url": r.url,
                    "snippet": r.snippet,
                    "date": r.date
                }
                for r in results
            ]
        }

# 使用示例
search = SearchTool()
results = search.search("AI Agent 最新进展")
```

#### 数据库查询
```python
class DatabaseTool:
    """查询结构化数据"""

    def query(self, sql, params=None):
        """执行 SQL 查询"""
        try:
            # 安全检查
            if not self.is_safe_sql(sql):
                return {"error": "不安全的 SQL"}

            # 执行查询
            results = self.db.execute(sql, params)

            return {
                "success": True,
                "rows": results,
                "count": len(results)
            }
        except Exception as e:
            return {"error": str(e)}

    def is_safe_sql(self, sql):
        """检查 SQL 安全性"""
        # 只允许 SELECT 语句
        if not sql.strip().upper().startswith("SELECT"):
            return False
        # 检查危险关键字
        dangerous = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER"]
        return not any(kw in sql.upper() for kw in dangerous)
```

#### 文件读取
```python
class FileTool:
    """读取文件内容"""

    def read(self, filepath):
        """读取文件"""
        try:
            # 路径安全检查
            if not self.is_safe_path(filepath):
                return {"error": "不安全的路径"}

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            return {
                "success": True,
                "content": content,
                "size": len(content)
            }
        except Exception as e:
            return {"error": str(e)}

    def is_safe_path(self, path):
        """路径安全检查"""
        # 不允许路径遍历
        if ".." in path:
            return False
        # 限制在特定目录
        allowed_dir = "/allowed/directory"
        real_path = os.path.realpath(path)
        return real_path.startswith(allowed_dir)
```

---

### 3.2 操作执行工具

#### API 调用
```python
class APITool:
    """调用外部 API"""

    def __init__(self):
        self.endpoints = {
            "weather": "https://api.weather.com/v1/forecast",
            "stock": "https://api.finance.com/v1/quote",
            "email": "https://api.email.com/v1/send"
        }

    def call(self, service, params):
        """调用 API"""
        if service not in self.endpoints:
            return {"error": f"未知的服务：{service}"}

        url = self.endpoints[service]

        try:
            response = requests.post(url, json=params, timeout=10)
            response.raise_for_status()

            return {
                "success": True,
                "data": response.json()
            }
        except requests.RequestException as e:
            return {"error": f"API 调用失败：{str(e)}"}

# 使用示例
api_tool = APITool()
result = api_tool.call("weather", {
    "city": "北京",
    "days": 3
})
```

#### 代码执行
```python
class CodeExecutionTool:
    """安全执行代码"""

    def execute_python(self, code):
        """执行 Python 代码"""
        try:
            # 创建受限环境
            safe_globals = {
                "__builtins__": {
                    "print": print,
                    "range": range,
                    "len": len,
                    # 只允许安全的内置函数
                },
                "math": math,
                "json": json,
            }

            # 执行代码
            exec_result = {}
            exec(code, safe_globals, exec_result)

            return {
                "success": True,
                "output": exec_result
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def execute_sandboxed(self, code, language="python"):
        """在沙箱中执行代码"""
        # 使用 Docker 或其他沙箱技术
        # 这里是简化示例
        container = self.create_sandbox(language)
        result = container.execute(code)
        return result
```

---

### 3.3 计算处理工具

#### 数学计算
```python
class CalculatorTool:
    """高级计算器"""

    def calculate(self, expression):
        """计算数学表达式"""
        try:
            # 使用安全的计算库
            result = sympy.sympify(expression)

            return {
                "success": True,
                "result": str(result),
                "numeric": float(result.evalf())
            }
        except Exception as e:
            return {"error": f"计算错误：{str(e)}"}

    def statistics(self, data):
        """统计计算"""
        import numpy as np

        return {
            "mean": np.mean(data),
            "median": np.median(data),
            "std": np.std(data),
            "min": np.min(data),
            "max": np.max(data),
            "quartiles": np.percentile(data, [25, 50, 75])
        }
```

#### 数据分析
```python
class AnalysisTool:
    """数据分析工具"""

    def analyze_csv(self, filepath):
        """分析 CSV 文件"""
        import pandas as pd

        try:
            df = pd.read_csv(filepath)

            return {
                "rows": len(df),
                "columns": list(df.columns),
                "dtypes": df.dtypes.to_dict(),
                "summary": df.describe().to_dict(),
                "head": df.head().to_dict(),
                "missing": df.isnull().sum().to_dict()
            }
        except Exception as e:
            return {"error": str(e)}

    def visualize(self, data, chart_type="bar"):
        """生成数据可视化"""
        import matplotlib.pyplot as plt

        if chart_type == "bar":
            plt.bar(data.keys(), data.values())
        elif chart_type == "line":
            plt.plot(data.keys(), data.values())
        elif chart_type == "pie":
            plt.pie(data.values(), labels=data.keys())

        # 保存图像
        plt.savefig("chart.png")
        return {"image_path": "chart.png"}
```

---

### 3.4 创作生成工具

#### 图像生成
```python
class ImageGenerationTool:
    """生成图像"""

    def generate(self, prompt, style="realistic"):
        """使用 DALL-E 或 Stable Diffusion"""
        # 调用图像生成 API
        response = image_api.generate(
            prompt=prompt,
            style=style,
            size="1024x1024"
        )

        return {
            "image_url": response.url,
            "prompt": prompt,
            "style": style
        }

    def edit(self, image_url, instruction):
        """编辑图像"""
        # 调用图像编辑 API
        return image_api.edit(image_url, instruction)
```

#### 文档生成
```python
class DocumentTool:
    """生成各种格式的文档"""

    def create_pdf(self, content, title="Document"):
        """生成 PDF"""
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas

        filename = f"{title}.pdf"
        c = canvas.Canvas(filename, pagesize=letter)

        # 添加内容
        c.drawString(100, 750, title)
        y = 700
        for line in content.split('\n'):
            c.drawString(100, y, line)
            y -= 20

        c.save()
        return {"file_path": filename}

    def create_markdown(self, content, title="Document"):
        """生成 Markdown"""
        filename = f"{title}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# {title}\n\n")
            f.write(content)

        return {"file_path": filename}
```

---

## 四、工具集成最佳实践

### 4.1 工具定义规范

**好的工具定义**：
```python
{
    "name": "get_stock_price",  # 清晰的名称
    "description": """           # 详细描述
        获取股票的实时价格。

        使用场景：
        - 查询特定股票的价格
        - 比较多个股票
        - 获取历史数据

        注意：只支持美股
    """,
    "parameters": {
        "type": "object",
        "properties": {
            "symbol": {
                "type": "string",
                "description": "股票代码，如 AAPL、GOOGL",
                "examples": ["AAPL", "TSLA", "MSFT"]
            },
            "interval": {
                "type": "string",
                "description": "时间间隔",
                "enum": ["1m", "5m", "1h", "1d"],
                "default": "1d"
            }
        },
        "required": ["symbol"]
    }
}
```

**定义工具的技巧**：
```
✓ 名称：动词+名词，如 get_weather、search_web
✓ 描述：说明功能、使用场景、注意事项
✓ 参数：类型、是否必需、默认值、示例
✗ 避免：模糊的描述、不一致的命名
```

### 4.2 错误处理

```python
class RobustTool:
    """健壮的工具实现"""

    def execute(self, **kwargs):
        try:
            # 1. 参数验证
            if not self.validate_params(kwargs):
                return {
                    "success": False,
                    "error": "参数验证失败"
                }

            # 2. 执行操作
            result = self.do_work(kwargs)

            # 3. 验证结果
            if not self.validate_result(result):
                return {
                    "success": False,
                    "error": "结果验证失败"
                }

            # 4. 返回成功
            return {
                "success": True,
                "data": result
            }

        except TimeoutError:
            return {
                "success": False,
                "error": "操作超时",
                "retry": True  # 可以重试
            }

        except Exception as e:
            # 记录错误日志
            logger.error(f"Tool error: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    def validate_params(self, params):
        """验证参数"""
        required = ["symbol", "date"]
        for p in required:
            if p not in params:
                return False
        return True
```

### 4.3 工具组合

```python
class ToolChain:
    """工具链：组合多个工具"""

    def __init__(self):
        self.tools = {
            "search": SearchTool(),
            "summarize": SummarizeTool(),
            "translate": TranslateTool()
        }

    def research_and_translate(self, topic, target_lang="Chinese"):
        """研究并翻译"""
        # 1. 搜索
        search_results = self.tools["search"].search(topic)

        # 2. 总结
        summary = self.tools["summarize"].summarize(search_results)

        # 3. 翻译
        translated = self.tools["translate"].translate(
            summary,
            target_lang=target_lang
        )

        return translated
```

### 4.4 工具性能优化

```python
class OptimizedToolSet:
    """优化的工具集"""

    def __init__(self):
        self.cache = {}  # 缓存结果
        self.rate_limiter = RateLimiter(max_calls=100, window=60)

    def call_with_cache(self, tool_name, params):
        """带缓存的工具调用"""
        # 生成缓存键
        cache_key = f"{tool_name}:{json.dumps(params, sort_keys=True)}"

        # 检查缓存
        if cache_key in self.cache:
            return self.cache[cache_key]

        # 限流检查
        if not self.rate_limiter.can_call():
            time.sleep(1)

        # 调用工具
        result = self.tools[tool_name].execute(**params)

        # 缓存结果（如果成功）
        if result.get("success"):
            self.cache[cache_key] = result

        return result

    async def call_parallel(self, tool_calls):
        """并行调用多个工具"""
        tasks = [self.call_with_cache(**call) for call in tool_calls]
        return await asyncio.gather(*tasks)
```

---

## 五、工具安全

### 5.1 权限控制

```python
class SecureTool:
    """安全的工具"""

    def __init__(self):
        # 定义权限等级
        self.permissions = {
            "read": ["user", "admin"],
            "write": ["admin"],
            "delete": ["admin"],
            "execute": ["user", "admin"]
        }
        self.user_roles = {}

    def check_permission(self, user, tool, action):
        """检查用户权限"""
        user_role = self.user_roles.get(user, "user")

        if action in self.permissions:
            return user_role in self.permissions[action]

        return False

    def execute(self, user, tool, action, params):
        """执行工具（带权限检查）"""
        if not self.check_permission(user, tool, action):
            return {
                "success": False,
                "error": "权限不足"
            }

        # 记录操作日志
        self.log_action(user, tool, action, params)

        # 执行操作
        return self.do_execute(tool, action, params)
```

### 5.2 沙箱执行

```python
class SandboxedTool:
    """沙箱中执行的工具"""

    def execute_code(self, code):
        """在沙箱中执行代码"""
        # 使用 Docker 容器
        client = docker.from_client()

        # 创建临时容器
        container = client.containers.create(
            image="python:3.9-slim",
            command=f"python -c '{code}'",
            mem_limit="128m",      # 内存限制
            cpu_quota=50000,      # CPU 限制
            network_disabled=True # 禁用网络
        )

        try:
            # 启动并等待
            container.start()
            result = container.wait(timeout=5)

            # 获取输出
            logs = container.logs().decode('utf-8')

            return {"success": True, "output": logs}

        finally:
            # 清理容器
            container.remove(force=True)
```

### 5.3 输入验证

```python
class ValidatedTool:
    """带输入验证的工具"""

    def search_web(self, query):
        """搜索网络"""
        # 1. 验证查询
        if not self.is_safe_query(query):
            return {"error": "不安全的查询"}

        # 2. 清理输入
        clean_query = self.sanitize(query)

        # 3. 执行搜索
        results = self.search_api.search(clean_query)

        # 4. 过滤结果
        safe_results = self.filter_results(results)

        return safe_results

    def is_safe_query(self, query):
        """检查查询是否安全"""
        # 长度限制
        if len(query) > 500:
            return False

        # 危险关键字
        dangerous = ["DROP", "DELETE", "<script"]
        return not any(d in query.upper() for d in dangerous)
```

---

## 六、实战案例

### 6.1 研究 Agent 的工具集

```python
class ResearchAgentToolSet:
    """研究 Agent 的工具集"""

    def __init__(self):
        self.tools = {
            # 信息获取
            "search_web": SearchTool(),
            "search_scholar": ScholarSearchTool(),
            "read_paper": PDFReaderTool(),

            # 数据处理
            "extract_data": DataExtractor(),
            "summarize": SummarizerTool(),
            "analyze": AnalysisTool(),

            # 内容生成
            "generate_report": ReportGenerator(),
            "create_charts": ChartGenerator(),
            "export_pdf": PDFExporter()
        }

    def research(self, topic):
        """完整的研究流程"""
        # 1. 搜索相关文献
        papers = self.tools["search_scholar"].search(topic)

        # 2. 阅读论文
        findings = []
        for paper in papers[:5]:  # 阅读前 5 篇
            content = self.tools["read_paper"].read(paper.url)
            summary = self.tools["summarize"].summarize(content)
            findings.append(summary)

        # 3. 分析趋势
        analysis = self.tools["analyze"].analyze(findings)

        # 4. 生成报告
        report = self.tools["generate_report"].generate(
            topic=topic,
            findings=findings,
            analysis=analysis
        )

        # 5. 创建图表
        charts = self.tools["create_charts"].create(analysis)

        # 6. 导出 PDF
        pdf = self.tools["export_pdf"].export(report, charts)

        return pdf
```

### 6.2 客服 Agent 的工具集

```python
class CustomerServiceToolSet:
    """客服 Agent 的工具集"""

    def __init__(self):
        self.tools = {
            # 查询工具
            "query_order": OrderQueryTool(),
            "query_product": ProductQueryTool(),
            "query_user": UserQueryTool(),

            # 操作工具
            "create_ticket": TicketCreator(),
            "process_return": ReturnProcessor(),
            "update_order": OrderUpdater(),

            # 知识工具
            "search_kb": KnowledgeBaseSearch(),
            "get_faq": FAQRetriever()
        }

    def handle_complaint(self, user_id, issue):
        """处理投诉"""
        # 1. 查询用户信息
        user = self.tools["query_user"].get(user_id)

        # 2. 搜索相关知识
        solutions = self.tools["search_kb"].search(issue)

        # 3. 创建工单
        ticket = self.tools["create_ticket"].create(
            user_id=user_id,
            issue=issue,
            priority=self.calculate_priority(user, issue)
        )

        # 4. 如果需要，处理退货
        if "退货" in issue:
            self.tools["process_return"].initiate(user_id)

        return {
            "ticket_id": ticket.id,
            "solutions": solutions,
            "status": "处理中"
        }
```

---

## 本章小结

### 核心要点

1. **工具是 Agent 的扩展能力**：
   - 信息获取
   - 操作执行
   - 计算处理
   - 创作生成

2. **三种实现方式**：
   - Function Calling：推荐、可靠
   - 文本解析：兼容性好
   - 路由器：快速可控

3. **常见工具类型**：
   - 搜索、数据库、文件
   - API 调用、代码执行
   - 计算、分析
   - 图像、文档生成

4. **最佳实践**：
   - 清晰的工具定义
   - 完善的错误处理
   - 合理的工具组合
   - 性能优化（缓存、并行）

5. **安全考虑**：
   - 权限控制
   - 沙箱执行
   - 输入验证
   - 输出过滤

### 工具调用流程记忆口诀

```
决策选工具，
准备参数齐，
调用取结果，
处理继续推。
```

---

## 思考题

1. **基础题**：列出至少 5 种 Agent 常用的工具类型，并说明各自的用途。

2. **进阶题**：对比 Function Calling 和文本解析两种工具调用方式，分析它们的优缺点。

3. **挑战题**：设计一个"智能客服 Agent"的工具集。它应该包含哪些工具？每个工具的功能是什么？如何组合使用？

---

## 实践探索

**实现练习**：
实现一个简单的工具调用系统：
```python
class SimpleTool:
    def execute(self, **params):
        # 实现工具功能
        pass

class ToolSet:
    def __init__(self):
        self.tools = {
            "calculator": CalculatorTool(),
            "weather": WeatherTool()
        }

    def use(self, tool_name, **params):
        if tool_name in self.tools:
            return self.tools[tool_name].execute(**params)
        return {"error": "Tool not found"}
```

**设计练习**：
为以下 Agent 设计工具集：
1. 个人理财 Agent
2. 学习助手 Agent
3. 代码审查 Agent

---

## 扩展阅读

**Function Calling**：
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling) - 官方文档
- [Anthropic Tool Use](https://docs.anthropic.com/claude/docs/tool-use) - Claude 的工具使用

**工具框架**：
- [LangChain Tools](https://python.langchain.com/docs/modules/tools/) - LangChain 工具文档
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) - 通用工具协议

**安全实践**：
- "Secure AI Agent Design" - AI Agent 安全设计指南
- OWASP AI Security - AI 安全指南

---

**下一章**：我们将学习 Agent 的规划与推理能力。

[← 返回模块首页](/ai-basics/04-agent-fundamentals) | [继续学习：规划与推理 →](/ai-basics/04-agent-fundamentals/05-planning-and-reasoning)
