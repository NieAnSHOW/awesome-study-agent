# A2UI 实战

> **学习目标**: 掌握 A2UI 组件定义、渲染器使用、Agent 集成和自定义组件扩展
>
> **预计时间**: 45 分钟
>
> **难度等级**: ⭐⭐⭐☆☆
>
> **更新时间**: 2026年5月

---

## 环境准备

### 软件依赖

A2UI 是一个声明式 UI 协议 + 渲染器组合，安装依赖非常轻量。根据你的前端技术栈选择对应的渲染器包：

| 软件 | 版本要求 | 用途 |
|------|---------|------|
| **Node.js** | 18+ | 渲染器运行环境 |
| **npm** | 9+（通常随 Node.js 自带） | 包管理 |
| **Lit** | 3.x（渲染器内置） | Web Components 渲染（推荐） |
| **Flutter** | 3.22+（可选） | Flutter 渲染器 |

安装完成后，验证 Node.js 版本：

```bash
node --version     # 确认 Node.js 版本 >= 18
npm --version      # 确认 npm 版本
```

### 安装渲染器

A2UI 的渲染器以 npm 包形式分发，根据你的前端框架选择安装：

```bash
# Lit 项目（推荐，基于 Web Components，通用性最好）
npm install @a2ui/lit @a2ui/web_core

# Angular 项目
npm install @a2ui/angular

# CopilotKit 集成（如果你使用 CopilotKit 框架）
npm install @a2ui/copilotkit
```

::: tip 渲染器选择
如果你不确定选哪个，选 **Lit**。Lit 渲染器基于 Web Components 标准，输出的组件可以在任何前端框架中使用——React、Vue、Angular、Svelte 都行。它不要求你的项目本身使用 Lit 框架。
:::

::: warning React 渲染器
截至 2026 年 5 月，React 渲染器仍在开发中（预计 2026 Q1 发布）。React 项目暂时可以通过 Lit 渲染器 + Web Components 的方式桥接使用，或者直接操作原生 DOM。
:::

---

## 快速上手

本节带你从零创建一个可运行的 A2UI 示例。最终效果：一个"预约会议"的交互界面，包含标题、日期时间输入框和提交按钮。

### 第一步：初始化项目

```bash
mkdir a2ui-demo && cd a2ui-demo
npm init -y
npm install @a2ui/lit @a2ui/web_core
```

### 第二步：定义 A2UI 组件

创建 `booking.json`，用 A2UI 的邻接表模型描述一个预约界面：

```json
{
  "surfaceUpdate": {
    "surfaceId": "booking-ui",
    "surfaceType": "dialog",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["title", "input-row", "submit-btn"]
      },
      {
        "id": "title",
        "component": "Text",
        "text": "预约会议",
        "variant": "h1"
      },
      {
        "id": "input-row",
        "component": "Row",
        "children": ["date-input", "time-input"]
      },
      {
        "id": "date-input",
        "component": "DateTimeInput",
        "label": "日期"
      },
      {
        "id": "time-input",
        "component": "TextField",
        "label": "时间"
      },
      {
        "id": "submit-btn",
        "component": "Button",
        "child": "submit-text",
        "variant": "primary",
        "action": {
          "event": {
            "name": "confirm_booking"
          }
        }
      },
      {
        "id": "submit-text",
        "component": "Text",
        "text": "确认预约"
      }
    ]
  }
}
```

注意这个 JSON 的结构：所有组件平铺在 `components` 数组中，通过 `id` 和 `children` 建立树形关系。这就是 A2UI 的**邻接表模型**——扁平列表 + ID 引用。

### 第三步：创建渲染页面

创建 `index.html`，引入 Lit 渲染器并渲染上面的 JSON：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>A2UI Demo</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; max-width: 640px; margin: 0 auto; }
  </style>
</head>
<body>
  <!-- 渲染容器 -->
  <div id="a2ui-root"></div>

  <script type="module">
    import { LitRenderer } from "@a2ui/lit";
    import { BasicCatalog } from "@a2ui/web_core";

    // 1. 创建渲染器实例，注册默认 Catalog（18 个基础组件）
    const renderer = new LitRenderer({
      catalog: BasicCatalog,
      container: document.getElementById("a2ui-root")
    });

    // 2. 加载 A2UI JSON（这里直接内联，实际场景来自 Agent 输出）
    const bookingUI = {
      surfaceUpdate: {
        surfaceId: "booking-ui",
        surfaceType: "dialog",
        components: [
          { id: "root", component: "Column", children: ["title", "input-row", "submit-btn"] },
          { id: "title", component: "Text", text: "预约会议", variant: "h1" },
          { id: "input-row", component: "Row", children: ["date-input", "time-input"] },
          { id: "date-input", component: "DateTimeInput", label: "日期" },
          { id: "time-input", component: "TextField", label: "时间" },
          { id: "submit-btn", component: "Button", child: "submit-text", variant: "primary",
            action: { event: { name: "confirm_booking" } } },
          { id: "submit-text", component: "Text", text: "确认预约" }
        ]
      }
    };

    // 3. 渲染
    renderer.render(bookingUI);

    // 4. 监听用户交互事件
    renderer.on("confirm_booking", (event) => {
      console.log("用户点击了确认预约", event.data);
      alert("预约已确认！");
    });
  </script>
</body>
</html>
```

### 第四步：运行

```bash
# 使用任意静态服务器运行（如果没有，安装一个）
npx serve .
```

打开浏览器访问 `http://localhost:3000`，你应该能看到一个包含标题、两个输入框和一个按钮的预约界面。

::: tip 关键理解
上面的代码展示了 A2UI 的核心工作流程：

1. **定义 Catalog**：`BasicCatalog` 提供了 18 个开箱即用的基础组件
2. **创建 Renderer**：`LitRenderer` 负责将 JSON 解析为 DOM 元素
3. **传入 JSON**：Agent（或你手动）生成的 A2UI JSON
4. **监听事件**：通过 `renderer.on()` 捕获用户在 UI 上的操作

整个过程是声明式的——你不写 HTML 模板，不操作 DOM，只需要描述"界面长什么样"和"事件怎么处理"。
:::

---

## 组件使用

A2UI 的 18 个基础组件分为三类：展示型、布局型和输入型。本节通过具体示例展示常用组件的 JSON 定义方式。

### Card — 信息展示

Card 是最常见的展示容器，适合呈现结构化信息：

```json
{
  "surfaceUpdate": {
    "surfaceId": "card-demo",
    "surfaceType": "sidebar",
    "components": [
      {
        "id": "root",
        "component": "Card",
        "children": ["card-title", "card-body", "card-footer"]
      },
      {
        "id": "card-title",
        "component": "Text",
        "text": "AI 助手状态",
        "variant": "h2"
      },
      {
        "id": "card-body",
        "component": "Column",
        "children": ["status-text", "detail-text"]
      },
      {
        "id": "status-text",
        "component": "Text",
        "text": "运行中"
      },
      {
        "id": "detail-text",
        "component": "Text",
        "text": "已处理 128 条任务，平均响应时间 1.2s"
      },
      {
        "id": "card-footer",
        "component": "Button",
        "child": "btn-label",
        "variant": "secondary",
        "action": { "event": { "name": "view_details" } }
      },
      {
        "id": "btn-label",
        "component": "Text",
        "text": "查看详情"
      }
    ]
  }
}
```

### Form — 用户输入

A2UI 没有专门的 Form 组件，但通过 Column + 输入组件 + 数据绑定，可以组合出功能完整的表单：

```json
{
  "surfaceUpdate": {
    "surfaceId": "form-demo",
    "surfaceType": "dialog",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["form-title", "name-field", "email-field", "role-picker", "agree-check", "submit-btn"]
      },
      {
        "id": "form-title",
        "component": "Text",
        "text": "用户注册",
        "variant": "h2"
      },
      {
        "id": "name-field",
        "component": "TextField",
        "label": "姓名",
        "binding": {
          "ref": "name",
          "validations": [
            {"fn": "required", "ref": "name"},
            {"fn": "length", "ref": "name", "args": [2, 20]}
          ]
        }
      },
      {
        "id": "email-field",
        "component": "TextField",
        "label": "邮箱",
        "binding": {
          "ref": "email",
          "validations": [
            {"fn": "required", "ref": "email"},
            {"fn": "email", "ref": "email"}
          ]
        }
      },
      {
        "id": "role-picker",
        "component": "ChoicePicker",
        "label": "角色",
        "choices": [
          {"label": "开发者", "value": "dev"},
          {"label": "设计师", "value": "design"},
          {"label": "产品经理", "value": "pm"}
        ]
      },
      {
        "id": "agree-check",
        "component": "CheckBox",
        "label": "我同意服务条款"
      },
      {
        "id": "submit-btn",
        "component": "Button",
        "child": "submit-label",
        "variant": "primary",
        "action": { "event": { "name": "register_submit" } }
      },
      {
        "id": "submit-label",
        "component": "Text",
        "text": "注册"
      }
    ]
  }
}
```

::: tip 数据绑定校验
上面的表单使用了 A2UI 内置的 14 个数据绑定函数中的 3 个：`required`（必填）、`length`（长度范围）、`email`（邮箱格式）。渲染器会自动执行校验，在输入不合法时显示错误提示——你不需要手写校验逻辑。
:::

### Chart — 数据可视化

Chart 组件用于展示数据图表。A2UI 的 Chart 组件支持常见图表类型：

```json
{
  "surfaceUpdate": {
    "surfaceId": "chart-demo",
    "surfaceType": "main",
    "components": [
      {
        "id": "root",
        "component": "Card",
        "children": ["chart-title", "chart-widget", "chart-footer"]
      },
      {
        "id": "chart-title",
        "component": "Text",
        "text": "本周任务统计",
        "variant": "h3"
      },
      {
        "id": "chart-widget",
        "component": "Chart",
        "chartType": "bar",
        "data": {
          "labels": ["周一", "周二", "周三", "周四", "周五"],
          "datasets": [
            {
              "label": "完成任务",
              "data": [12, 19, 8, 15, 22]
            },
            {
              "label": "新增任务",
              "data": [15, 12, 14, 18, 10]
            }
          ]
        }
      },
      {
        "id": "chart-footer",
        "component": "Text",
        "text": "本周完成率 78%"
      }
    ]
  }
}
```

### Table — 结构化数据

Table 组件适合展示行列结构的数据：

```json
{
  "surfaceUpdate": {
    "surfaceId": "table-demo",
    "surfaceType": "main",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["table-title", "data-table"]
      },
      {
        "id": "table-title",
        "component": "Text",
        "text": "Agent 运行日志",
        "variant": "h3"
      },
      {
        "id": "data-table",
        "component": "Table",
        "columns": [
          {"key": "time", "label": "时间"},
          {"key": "agent", "label": "Agent"},
          {"key": "action", "label": "操作"},
          {"key": "status", "label": "状态"}
        ],
        "rows": [
          {"time": "10:30:01", "agent": "Lead Agent", "action": "任务拆解", "status": "完成"},
          {"time": "10:30:15", "agent": "Search Agent", "action": "信息检索", "status": "完成"},
          {"time": "10:31:02", "agent": "Code Agent", "action": "代码生成", "status": "运行中"},
          {"time": "10:31:45", "agent": "Review Agent", "action": "代码审查", "status": "等待中"}
        ]
      }
    ]
  }
}
```

---

## Agent 集成

前面的示例都是手动写 JSON，实际场景中 A2UI 的 JSON 是由 Agent 生成的。本节展示如何将 A2UI 集成到 Agent 工作流中。

### Agent 返回 A2UI JSON

Agent 在 Function Calling 中返回 A2UI JSON，告诉前端"请渲染这个界面"。以下是一个 Python Agent 的示例：

```python
import json

def get_booking_ui(params):
    """Agent Tool：根据参数生成预约界面"""
    return {
        "surfaceUpdate": {
            "surfaceId": "booking-ui",
            "surfaceType": "dialog",
            "components": [
                {"id": "root", "component": "Column", "children": ["title", "date-input", "submit-btn"]},
                {"id": "title", "component": "Text", "text": f"预约：{params.get('meeting_name', '会议')}", "variant": "h2"},
                {"id": "date-input", "component": "DateTimeInput", "label": "选择日期"},
                {"id": "submit-btn", "component": "Button", "child": "btn-text", "variant": "primary",
                 "action": {"event": {"name": "confirm_booking"}}},
                {"id": "btn-text", "component": "Text", "text": "确认预约"}
            ]
        }
    }

# Agent 调用 Tool，返回 A2UI JSON 给前端
ui_json = get_booking_ui({"meeting_name": "产品周会"})
print(json.dumps(ui_json, ensure_ascii=False, indent=2))
```

### 前端监听 Agent 输出

前端需要监听 Agent 的输出流，解析 A2UI 消息并交给渲染器处理：

```typescript
import { LitRenderer } from "@a2ui/lit";
import { BasicCatalog } from "@a2ui/web_core";

const renderer = new LitRenderer({
  catalog: BasicCatalog,
  container: document.getElementById("agent-ui")
});

// 监听 Agent 的 SSE 输出流
const eventSource = new EventSource("/api/agent/stream");

eventSource.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);

    switch (Object.keys(message)[0]) {
      case "surfaceUpdate":
        // 创建或更新 Surface
        renderer.render(message);
        break;
      case "dataModelUpdate":
        // 更新数据模型（表单数据、状态等）
        renderer.updateDataModel(message.dataModelUpdate);
        break;
      case "beginRendering":
        // 标记渲染开始（可以显示 loading 状态）
        console.log("开始渲染 Surface:", message.beginRendering.surfaceId);
        break;
      case "deleteSurface":
        // 删除 Surface
        renderer.deleteSurface(message.deleteSurface.surfaceId);
        break;
    }
  } catch (e) {
    console.error("解析 Agent 消息失败:", e);
  }
};

// 监听用户交互事件，发送回 Agent
renderer.on("confirm_booking", (event) => {
  fetch("/api/agent/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "confirm_booking",
      data: event.data
    })
  });
});
```

### 流式渲染（SSE / WebSocket）

A2UI 原生支持流式渲染。Agent 不需要一次性生成完整的界面 JSON，而是通过 JSONL（JSON Lines）逐步推送更新：

**SSE（Server-Sent Events）方式**：

```typescript
// 前端：通过 SSE 接收 Agent 的 JSONL 流
const response = await fetch("/api/agent/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "帮我创建一个预约会议的界面" })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });

  // 按行解析 JSONL
  const lines = buffer.split("\n");
  buffer = lines.pop(); // 保留未完成的行

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const message = JSON.parse(line);
      renderer.render(message);
    } catch (e) {
      console.warn("JSONL 解析错误:", line);
    }
  }
}
```

**WebSocket 方式**：

```typescript
// 前端：通过 WebSocket 接收实时更新
const ws = new WebSocket("ws://localhost:8080/agent/ws");

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  // 处理 A2UI 消息
  if (message.surfaceUpdate) {
    renderer.render(message);
  }
};

// 用户交互事件通过 WebSocket 发回
renderer.on("confirm_booking", (event) => {
  ws.send(JSON.stringify({
    type: "user_event",
    event: "confirm_booking",
    data: event.data
  }));
});
```

::: tip 流式渲染的优势
流式渲染让 Agent 可以"边想边画"——先推送一个 loading 状态，再逐步填充内容。用户体验比等 Agent 生成完整 JSON 一次性渲染好得多。这也是 A2UI 设计 JSONL 格式的核心动机。
:::

---

## 框架适配

本节详细介绍各框架渲染器的使用方式。

### Lit Renderer 使用

Lit 渲染器是目前最成熟的选择，基于 Web Components 标准。

#### 安装与初始化

```bash
npm install @a2ui/lit @a2ui/web_core
```

```typescript
import { LitRenderer } from "@a2ui/lit";
import { BasicCatalog } from "@a2ui/web_core";

// 创建渲染器
const renderer = new LitRenderer({
  catalog: BasicCatalog,          // 组件目录
  container: document.getElementById("app"),  // 渲染容器
  theme: "light"                  // 主题：light / dark
});
```

#### 注册自定义组件

Lit 渲染器使用 Smart Wrappers 机制注册自定义组件——把服务端组件类型映射到客户端实现：

```typescript
import { LitRenderer } from "@a2ui/lit";
import { BasicCatalog } from "@a2ui/web_core";

// 自定义组件：一个带评分的卡片
class RatingCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const rating = this.getAttribute("rating") || "0";
    const stars = "★".repeat(Number(rating)) + "☆".repeat(5 - Number(rating));

    this.innerHTML = `
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
        <h3>${title}</h3>
        <div style="color: #f5a623; font-size: 18px;">${stars}</div>
      </div>
    `;
  }
}

// 注册自定义组件
customElements.define("rating-card", RatingCard);

// 扩展 Catalog，加入自定义组件
const extendedCatalog = BasicCatalog.extend({
  RatingCard: {
    component: "rating-card",
    attributes: ["title", "rating"]
  }
});

// 使用扩展后的 Catalog 创建渲染器
const renderer = new LitRenderer({
  catalog: extendedCatalog,
  container: document.getElementById("app")
});
```

#### 事件处理

渲染器提供了统一的事件处理接口：

```typescript
// 监听单个事件
renderer.on("confirm_booking", (event) => {
  console.log("预约确认:", event.data);
});

// 监听所有事件
renderer.onAny((eventName, event) => {
  console.log(`事件: ${eventName}`, event.data);
});

// 移除事件监听
const handler = (event) => console.log(event);
renderer.on("confirm_booking", handler);
renderer.off("confirm_booking", handler);
```

### Flutter Renderer 使用

Flutter 渲染器由 Flutter 团队官方维护，通过 GenUI SDK 提供。

#### 安装

```yaml
# pubspec.yaml
dependencies:
  genui_sdk: ^0.8.0
```

#### 初始化与使用

```dart
import 'package:genui_sdk/genui_sdk.dart';

// 1. 初始化渲染器
final renderer = GenuiRenderer(
  catalog: BasicCatalog.defaultCatalog,
);

// 2. 解析 A2UI JSON 并生成 Widget 树
final jsonString = '''
{
  "surfaceUpdate": {
    "surfaceId": "greeting",
    "surfaceType": "dialog",
    "components": [
      {"id": "root", "component": "Column", "children": ["title"]},
      {"id": "title", "component": "Text", "text": "Hello from A2UI!", "variant": "h1"}
    ]
  }
}
''';

final message = A2UIMessage.fromJson(jsonDecode(jsonString));
final widget = renderer.render(message);

// 3. 在 Flutter Widget 树中使用
runApp(MaterialApp(
  home: Scaffold(
    body: A2UISurface(widget: widget),
  ),
));
```

#### Widget 映射

Flutter 渲染器会将 A2UI 组件映射为对应的 Flutter Widget：

| A2UI 组件 | Flutter Widget | 说明 |
|-----------|---------------|------|
| `Column` | `Column` | 垂直布局 |
| `Row` | `Row` | 水平布局 |
| `Text` | `Text` | 文本展示 |
| `Button` | `ElevatedButton` | 按钮 |
| `TextField` | `TextField` | 文本输入 |
| `Card` | `Card` | 卡片容器 |
| `List` | `ListView` | 列表 |
| `Image` | `Image` | 图片展示 |
| `CheckBox` | `Checkbox` | 复选框 |
| `Slider` | `Slider` | 滑块 |

::: tip 跨平台一致性
由于 A2UI 是声明式协议，同一份 JSON 在 Lit 和 Flutter 上会渲染出功能一致的界面——布局结构、组件层级、事件名称完全相同。差异仅在视觉样式上（各框架的原生风格）。
:::

---

## 自定义组件

当 18 个基础组件无法满足需求时，你可以扩展自定义组件。

### Schema 扩展格式

自定义组件的 Schema 扩展遵循开放注册表模式（Open Registry），在 Catalog 中定义组件名和属性映射：

```typescript
// 自定义组件 Schema 定义
const MyCustomComponents = {
  // 组件名称（在 JSON 中通过 component 字段引用）
  WeatherCard: {
    // 属性列表（JSON 中可传入的属性名）
    properties: {
      city: { type: "string", required: true },
      temperature: { type: "number", required: true },
      condition: { type: "string", required: true },
      icon: { type: "string" }
    },
    // 事件列表（组件可触发的 action）
    actions: {
      refresh: { name: "weather_refresh" },
      setLocation: { name: "weather_set_location" }
    }
  },

  ProgressTracker: {
    properties: {
      steps: { type: "array", required: true },
      currentStep: { type: "number", default: 0 }
    },
    actions: {
      nextStep: { name: "progress_next" },
      prevStep: { name: "progress_prev" }
    }
  }
};
```

### 组件注册流程

将自定义 Schema 注册到 Catalog，并绑定渲染实现：

```typescript
import { LitRenderer } from "@a2ui/lit";
import { BasicCatalog } from "@a2ui/web_core";

// Step 1: 定义 Web Component
class WeatherCardElement extends HTMLElement {
  connectedCallback() {
    const city = this.getAttribute("city") || "未知";
    const temp = this.getAttribute("temperature") || "--";
    const condition = this.getAttribute("condition") || "晴";
    const icon = this.getAttribute("icon") || "☀️";

    this.innerHTML = `
      <div style="
        border-radius: 12px;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: system-ui, sans-serif;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0 0 8px 0; font-size: 20px;">${city}</h2>
            <div style="font-size: 36px; font-weight: bold;">${temp}°C</div>
            <div style="opacity: 0.8; margin-top: 4px;">${condition}</div>
          </div>
          <div style="font-size: 48px;">${icon}</div>
        </div>
      </div>
    `;

    // 点击触发 refresh 事件
    this.style.cursor = "pointer";
    this.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("a2ui-action", {
        bubbles: true,
        detail: { event: "weather_refresh", data: { city } }
      }));
    });
  }
}

// Step 2: 注册 Web Component
customElements.define("weather-card", WeatherCardElement);

// Step 3: 扩展 Catalog
const myCatalog = BasicCatalog.extend({
  WeatherCard: {
    component: "weather-card",
    attributes: ["city", "temperature", "condition", "icon"]
  }
});

// Step 4: 创建渲染器
const renderer = new LitRenderer({
  catalog: myCatalog,
  container: document.getElementById("app")
});
```

### 使用自定义组件

注册完成后，Agent 可以在 JSON 中直接使用你的自定义组件：

```json
{
  "surfaceUpdate": {
    "surfaceId": "weather-widget",
    "surfaceType": "sidebar",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["weather-title", "weather-card"]
      },
      {
        "id": "weather-title",
        "component": "Text",
        "text": "天气信息",
        "variant": "h3"
      },
      {
        "id": "weather-card",
        "component": "WeatherCard",
        "city": "北京",
        "temperature": 28,
        "condition": "晴转多云",
        "icon": "🌤️"
      }
    ]
  }
}
```

::: warning 自定义组件的边界
自定义组件扩展了 A2UI 的表达力，但也引入了额外的维护成本。每新增一个自定义组件，你需要：

1. 在 Catalog 中注册 Schema
2. 在每个目标平台的渲染器中实现对应的渲染逻辑
3. 如果 Agent 需要生成这个组件，还需要在 Agent 的 System Prompt 中描述组件的用法

建议优先使用 18 个基础组件组合实现需求，只有在基础组件确实无法满足时才引入自定义组件。
:::

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| **渲染器找不到组件** | Schema 版本不匹配，组件名拼写错误 | 检查 JSON 中的 `component` 字段与 Catalog 中的注册名是否完全一致；确认渲染器和 `@a2ui/web_core` 版本匹配 |
| **JSONL 解析失败** | 消息格式错误，缺少换行符 | 确保 JSONL 中每行是独立的合法 JSON；检查是否有 BOM 头或多余空行 |
| **事件不触发** | `action` 配置错误，事件名不匹配 | 检查 JSON 中 `action.event.name` 的值与 `renderer.on()` 监听的事件名是否一致 |
| **跨框架渲染不一致** | 各框架 Catalog 差异 | 使用 `BasicCatalog` 作为基准，确保各框架注册了相同的自定义组件 |
| **数据绑定校验失效** | 绑定函数名错误或参数格式不对 | 对照 14 个内置函数名检查拼写；确认 `args` 参数的类型和顺序正确 |
| **v0.8 升级 v0.9 失败** | Breaking Change 导致 Schema 不兼容 | 参考 [A2UI 迁移指南](https://a2ui.org/docs/migration)，注意组件属性名和消息格式的变更 |
| **CopilotKit 集成报错** | `injectA2UITool` 的 Catalog 配置缺失 | 确认 `createCatalog()` 中注册了 Agent 会用到的所有组件类型 |
| **Flutter 渲染空白** | Widget 映射未注册 | 检查 GenUI SDK 版本是否与 A2UI v0.8 兼容；确认 Catalog 包含所需组件 |

---

## 思考题

::: info 检验你的理解
- [ ] 能独立完成 Lit 渲染器的安装、初始化和第一个 A2UI 组件的渲染
- [ ] 理解邻接表模型的 JSON 结构，能手动编写 Card、Form、Chart、Table 四类组件的 JSON
- [ ] 能实现 Agent 返回 A2UI JSON + 前端监听渲染的完整链路
- [ ] 理解 JSONL 流式渲染的工作原理，能通过 SSE 或 WebSocket 实现流式 UI 更新
- [ ] 能通过 Smart Wrappers 注册自定义组件并扩展 Catalog
- [ ] 理解不同框架渲染器（Lit / Flutter）的差异和适用场景
:::

---

## 本节小结

通过本节学习，你应该掌握了：

✅ **环境准备**
- 软件依赖：Node.js 18+、渲染器选择（Lit 推荐 / Angular / Flutter）
- 安装命令：`npm install @a2ui/lit @a2ui/web_core`
- React 渲染器开发中，可通过 Web Components 桥接

✅ **快速上手**
- 邻接表模型：扁平组件数组 + ID 引用
- 四步工作流：创建 Catalog → 创建 Renderer → 传入 JSON → 监听事件
- 完整可运行的 HTML 示例

✅ **组件使用**
- Card：信息展示容器
- Form：Column + 输入组件 + 数据绑定校验（required / length / email）
- Chart：数据可视化（bar / line / pie）
- Table：行列结构数据展示

✅ **Agent 集成**
- Agent 返回 A2UI JSON 的 Tool 定义方式
- 前端监听 Agent 输出的四种消息类型：surfaceUpdate / dataModelUpdate / beginRendering / deleteSurface
- 流式渲染：SSE 和 WebSocket 两种实现方式

✅ **框架适配**
- Lit Renderer：安装、初始化、Smart Wrappers 注册自定义组件、事件处理
- Flutter Renderer：GenUI SDK 安装、Widget 映射表

✅ **自定义组件**
- Schema 扩展格式：properties + actions
- 四步注册流程：定义 Web Component → 注册 → 扩展 Catalog → 创建 Renderer
- 自定义组件的维护边界

---

## 延伸阅读

- [A2UI GitHub 仓库](https://github.com/google/A2UI)
- [A2UI 官网](https://a2ui.org)
- [A2UI 概述](/agent-ecosystem/07-agent-ecosystem/16-a2ui-overview)
- [A2A Protocol GitHub 仓库](https://github.com/google/A2A)
- [CopilotKit 官方文档](https://docs.copilotkit.ai)
- [Lit 官方文档](https://lit.dev)
- [Flutter GenUI SDK](https://pub.dev/packages/genui_sdk)
- [Agent 编排模式](/agent-ecosystem/07-agent-ecosystem/06-orchestration)
- [MCP 协议](/agent-ecosystem/07-agent-ecosystem/03-mcp-protocol)

---

[← A2UI 概述](/agent-ecosystem/07-agent-ecosystem/16-a2ui-overview) | [返回模块目录](/agent-ecosystem/07-agent-ecosystem)
