# 插件与工具调用

> **学习目标**：掌握 Coze 和 Dify 的插件/工具体系，能让 Agent 调用搜索、代码执行、图像生成等外部能力，以及接入自定义 API
>
> **预计时间**：30 分钟
>
> **难度等级**：⭐⭐⭐☆☆

---

## 一、为什么 Agent 需要插件

先说结论：**没有插件的 Agent 只会"说话"，有了插件才会"干活"。**

一个只会聊天的 Agent，本质上就是个定制版的 ChatGPT。但真正的 Agent 应该能做事：

| 没有插件 | 有插件 |
|----------|--------|
| "你可以试试搜索一下xxx" | 直接搜索并把结果整理好给你 |
| "你可以用 Python 算一下" | 直接运行代码把结果告诉你 |
| "你可以用 DALL-E 画一张图" | 直接生成图片展示给你 |
| "你可以查一下天气 API" | 直接调用 API 返回天气 |

插件让 Agent 从"建议者"变成"执行者"。这不是量变，是质变。

---

## 二、搜索插件

### 2.1 网页搜索

最常用的插件类型。让 Agent 能搜索互联网获取最新信息。

**Coze 内置搜索插件**：

1. 在 Bot 配置页面点击"插件"标签
2. 点击"添加插件"
3. 搜索"搜索"或"web search"
4. 选择内置的搜索插件（如"头条搜索"）
5. 保存即可

启用后，Agent 会在知识库找不到答案时自动搜索网页。

**Dify 的搜索工具**：

Dify 没有内置搜索插件，但可以通过以下方式实现：

1. **HTTP 请求节点**：调用搜索 API（如 Serper、Tavily）
2. **自定义工具**：配置搜索 API 的 OpenAPI Schema

```
# 用 Serper 搜索 API 的 HTTP 请求配置示例
URL: https://google.serper.dev/search
Method: POST
Headers:
  X-API-KEY: your_serper_api_key
Body:
  {
    "q": "{{user_query}}"
  }
```

### 2.2 学术搜索

如果你的 Agent 面向学术场景，可以接入学术搜索：

| 工具 | 说明 | 接入方式 |
|------|------|---------|
| **Google Scholar** | 学术论文搜索 | 通过 HTTP 请求接入 Serper Scholar API |
| **arXiv** | 预印本论文 | 通过 arXiv API |
| **Semantic Scholar** | 学术搜索 | 免费 API |

---

## 三、代码执行

### 3.1 为什么需要代码执行？

有些问题靠 LLM "想"是做不好的，必须跑代码：

- 数学计算（LLM 算数不可靠）
- 数据处理（排序、筛选、统计）
- 生成图表
- 格式转换

### 3.2 Coze 代码插件

Coze 内置代码执行沙箱，支持 Python 和 JavaScript。

**配置方式**：

1. 在插件市场搜索"代码"或"Code Runner"
2. 添加到 Bot
3. Agent 会在需要时自动调用

**实际效果**：

```
用户：帮我算一下 (234 + 567) * 12 / 3.5

Agent：我帮你算一下。
[调用代码执行插件]
结果：2748.0

(234 + 567) × 12 ÷ 3.5 = 2748.0
```

### 3.3 Dify 代码节点

Dify 的代码节点更灵活，支持 Python 和 JavaScript：

```python
# Dify 代码节点示例：数据处理
def main(data_list: list) -> dict:
    # 统计分析
    total = sum(data_list)
    average = total / len(data_list)
    max_val = max(data_list)
    min_val = min(data_list)

    return {
        "total": total,
        "average": round(average, 2),
        "max": max_val,
        "min": min_val
    }
```

代码节点的输入输出通过变量传递，可以和工作流中的其他节点无缝衔接。

---

## 四、图像生成

### 4.1 Coze 图像生成

Coze 支持多种图像生成方式：

| 方式 | 说明 |
|------|------|
| **内置图像插件** | 插件市场搜索"图像生成"，一键添加 |
| **DALL-E 插件** | 国际版支持，需要 OpenAI API |
| **豆包图像生成** | 国内版默认，免费额度 |

**配置步骤**：

1. 插件市场搜索"图像"或"画图"
2. 添加"图像生成"插件
3. 在人设中添加指令："当用户要求画图时，调用图像生成插件"

### 4.2 Dify 图像生成

通过 HTTP 请求节点调用 DALL-E 或 Stable Diffusion API：

```
# DALL-E API 调用配置
URL: https://api.openai.com/v1/images/generations
Method: POST
Headers:
  Authorization: Bearer your_openai_api_key
Body:
  {
    "model": "dall-e-3",
    "prompt": "{{image_prompt}}",
    "n": 1,
    "size": "1024x1024"
  }
```

---

## 五、API 调用（自定义 HTTP 请求）

这是最灵活的工具类型。只要一个服务提供 API，你的 Agent 就能调用它。

### 5.1 Coze 自定义插件

Coze 支持通过 OpenAPI Schema 导入自定义 API：

1. 在插件管理页面点击"创建插件"
2. 选择"云端插件"
3. 填写 API 的基础信息（名称、描述、服务器地址）
4. 导入 OpenAPI Schema 或手动添加接口定义
5. 配置认证方式（API Key / OAuth）
6. 发布插件

**示例 — 接入天气 API**：

```yaml
# OpenAPI Schema 示例
openapi: 3.0.0
info:
  title: 天气查询
  version: 1.0.0
servers:
  - url: https://api.weatherapi.com/v1
paths:
  /current.json:
    get:
      summary: 查询当前天气
      parameters:
        - name: key
          in: query
          required: true
          schema:
            type: string
        - name: q
          in: query
          required: true
          description: 城市名称
          schema:
            type: string
      responses:
        '200':
          description: 天气数据
```

### 5.2 Dify HTTP 请求节点

Dify 通过"HTTP 请求"节点实现 API 调用，配置更直观：

1. 在工作流中添加"HTTP 请求"节点
2. 选择请求方法（GET/POST/PUT/DELETE）
3. 填写 URL（支持变量：`{{user_input}}`）
4. 配置 Headers（认证信息）
5. 配置 Body（请求体）
6. 设置输出变量映射

**不需要写 OpenAPI Schema**——直接在可视化界面配置。

---

## 六、自定义工具接入方法

### 6.1 Coze：三种接入方式

| 方式 | 难度 | 灵活度 | 适合场景 |
|------|------|--------|---------|
| **插件市场安装** | 最简单 | 低 | 标准功能（搜索、天气等） |
| **OpenAPI Schema 导入** | 中等 | 高 | 已有 API 的服务 |
| **工作流中调用** | 中等 | 高 | 需要多步处理 |

### 6.2 Dify：两种接入方式

| 方式 | 难度 | 灵活度 | 适合场景 |
|------|------|--------|---------|
| **HTTP 请求节点** | 简单 | 高 | 任何 REST API |
| **自定义工具（OpenAPI Schema）** | 中等 | 更高 | 复杂 API、多接口 |

### 6.3 接入流程对比

```
Coze 接入自定义工具：
1. 准备 OpenAPI Schema → 2. 在插件管理创建 → 3. 配置认证 → 4. 在 Bot 中启用

Dify 接入自定义工具：
1. 在工作流添加节点 → 2. 填 URL + 参数 → 3. 配置输出映射 → 完成
```

Dify 的流程更轻量——不用写 Schema，直接在节点里配参数就行。

---

## 七、插件组合策略

### 7.1 三个原则

**原则一：按需添加，不要贪多。**

每个插件都增加 Agent 的响应时间和出错概率。只添加真正需要的。

**原则二：插件之间要有优先级。**

```
用户问了一个问题：
1. 先查知识库 → 有答案就直接回答
2. 知识库没有 → 调搜索插件查网页
3. 网页也查不到 → 用 LLM 通用知识回答
```

这个优先级需要在工作流中通过条件分支来实现。

**原则三：加插件后必须重新测试。**

每加一个新插件，跑一遍之前的测试用例，确保新插件没有影响已有功能。

### 7.2 常见插件组合

| Agent 类型 | 推荐插件组合 |
|-----------|-------------|
| **客服 Agent** | 知识库 + 搜索 + 工单系统 API |
| **学习助手** | 知识库 + 搜索 + 代码执行 |
| **内容创作** | 搜索 + 图像生成 + 代码执行（做图表） |
| **数据分析** | 代码执行 + 数据库连接 + 图像生成（可视化） |
| **个人助理** | 搜索 + 天气 + 日历 API + 待办 API |

---

## 八、本节小结

::: info 回顾要点
✅ 插件让 Agent 从"只会说话"变成"能干活"——这是质变，不是量变

✅ 四类常用插件：搜索、代码执行、图像生成、API 调用

✅ Coze 用插件市场 + OpenAPI Schema 接入工具，Dify 用 HTTP 请求节点

✅ 插件组合三原则：按需添加、设优先级、加完重新测试

✅ 推荐组合：客服 = 知识库+搜索+工单 API；学习助手 = 知识库+搜索+代码执行
:::

---

[← 返回章节目录](/agent-ecosystem/18-nocode-agent-building) | [继续学习：从想法到上线的完整案例 →](/agent-ecosystem/18-nocode-agent-building/06-full-case)
