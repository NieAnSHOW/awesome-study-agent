# A2UI 概述

> **学习目标**: 理解 A2UI 声明式 Agent UI 协议的设计动机、核心架构、生态定位和适用场景
>
> **预计时间**: 35 分钟
>
> **难度等级**: ⭐⭐☆☆☆
>
> **更新时间**: 2026年5月

---

## A2UI 是什么

### 项目背景

A2UI 出自 **Google** 之手，2026 年 4 月以 **Apache 2.0 开源协议**正式对外发布。目前处于 **v0.8 Public Preview** 阶段，仓库托管在 [github.com/google/A2UI](https://github.com/google/A2UI)，官网为 [a2ui.org](https://a2ui.org)。

版本演进节奏比较快：

| 版本 | 状态 | 说明 |
|------|------|------|
| **v0.8** | 当前稳定 | Public Preview，可实际使用 |
| **v0.9** | 草案 | 部分规范调整中 |
| **v0.10** | 提案中 | 社区讨论阶段 |

A2UI 的全称是 **Agent-to-User Interface**——Agent 到用户的界面协议。它要解决的核心问题是：**当 AI Agent 需要向用户展示交互界面时，怎样做既安全又灵活？**

> Google 在 Agent 基础设施上的布局很系统：A2A Protocol 解决 Agent 间通信，A2UI 解决 Agent 到用户的界面呈现。一个管"Agent 之间怎么说话"，一个管"Agent 怎么给用户看东西"。两者互补，共同构成 Agent 生态的通信基石。

### 核心定位

A2UI 将自己定位为 **Agent 驱动界面的声明式 UI 协议**，核心理念用一句话概括：

> **"Safe like data, but expressive like code."**
> 安全如数据，表达力如代码。

这意味着 A2UI 的 JSON 描述是纯数据——不可执行、不能跑脚本，所以天然安全。但通过精心设计的组件体系和数据绑定机制，它又能表达足够丰富的交互界面。

---

## 核心问题：Agent 怎么展示 UI？

在 A2UI 出现之前，Agent 要向用户展示界面，基本上有三条路可走。理解这三条路的利弊，就能理解 A2UI 为什么选择声明式 JSON 这条路。

### 路径一：可执行代码（Executable Code）

Agent 直接生成并在前端执行代码——比如 React 组件、HTML+JavaScript、WebAssembly。

**优点**：表达力最强，理论上什么界面都能做。

**缺点**：安全风险极高。XSS 攻击、供应链注入、沙箱绕过……在 Agent 场景下，你信任的不仅是代码本身，还有生成这段代码的 Agent、Agent 背后的 LLM、LLM 训练数据中的每一个样本。信任链太长了。

### 路径二：模板系统（Template System）

预定义一批经过审核的模板，Agent 从中选择并填充数据。

**优点**：安全——模板是人工审核过的，不存在执行风险。

**缺点**：表达力受限。每新增一种界面样式就要新增一个模板，维护成本随着业务复杂度线性增长。而且模板之间的组合和嵌套是个难题。

### 路径三：声明式 JSON（A2UI 的选择）

Agent 输出一份 JSON 描述，前端根据 JSON 渲染界面。JSON 是纯数据，不可执行。

**优点**：安全（纯数据不可执行）、跨平台（JSON 谁都能解析）、LLM 生成友好（大模型生成结构化 JSON 比生成可运行代码容易得多）。

**缺点**：受限于 Catalog 中预定义的组件类型。如果 Catalog 里没有你要的组件，就无法表达。

### 安全性对比

| 维度 | 可执行代码 | 模板系统 | 声明式 JSON (A2UI) |
|------|-----------|---------|-------------------|
| 代码执行风险 | 高 | 低 | **无** |
| XSS 风险 | 高 | 低 | **无** |
| 供应链攻击 | 高 | 低 | **无** |
| 跨信任边界 | 不安全 | 安全 | **安全** |
| 表达力 | 最高 | 最低 | 中高 |
| 跨平台 | 差 | 中 | **好** |
| LLM 生成难度 | 高 | 低 | **低** |

::: tip
如果你仔细看这张表，会发现 A2UI 在安全维度全部是"无"或"安全"，而在表达力和 LLM 生成友好度上也不差。这正是声明式协议的价值所在——用结构的约束换取安全的保障，同时通过精心的组件设计保留足够的表达力。
:::

---

## 声明式 UI 协议

### 邻接表模型

A2UI 的 JSON 格式采用的是**邻接表模型**（Adjacency List）。说人话就是：扁平列表 + ID 引用。所有组件都平铺在一个数组里，通过 `id` 和 `children` 字段建立父子关系。

来看一个实际例子——一个"预约会议"的界面：

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

::: warning
注意邻接表模型的一个设计约束：**组件之间只能通过 ID 引用建立关系，不能嵌套定义**。这意味着 `root` 组件不会把自己的子组件内联写在自身内部，而是通过 `children: ["title", "input-row", "submit-btn"]` 引用数组中其他组件的 ID。

这种设计看起来比嵌套 JSON 多了一些冗余，但好处是：扁平结构让 LLM 生成时不需要关心缩进层级，渲染器解析时不需要递归遍历，增量更新时只需替换单个组件而非整个子树。
:::

### 三大核心支柱

A2UI 的能力建立在三个核心支柱之上。

#### 1. Streaming Messages（流式消息）

A2UI 使用 **JSONL（JSON Lines）** 格式进行流式传输，而不是一次性发送完整的 JSON。这意味着 Agent 可以边思考边更新界面——先展示一个加载状态，然后逐步填充内容。

支持的消息类型：

| 消息类型 | 作用 |
|---------|------|
| `surfaceUpdate` | 创建或更新一个 Surface 上的组件 |
| `dataModelUpdate` | 更新数据模型（数据绑定用） |
| `beginRendering` | 通知客户端开始渲染 |
| `deleteSurface` | 删除一个 Surface |

#### 2. Declarative Components（声明式组件）

A2UI 定义了 **18 个基础组件**，覆盖了绝大多数 Agent 场景需要的 UI 元素：

| 组件 | 用途 |
|------|------|
| **Text** | 文本展示 |
| **Image** | 图片 |
| **Icon** | 图标 |
| **Row / Column** | 布局容器（水平/垂直） |
| **List** | 列表 |
| **Card** | 卡片容器 |
| **Modal** | 模态弹窗 |
| **Button** | 按钮（支持 Action 事件） |
| **TextField** | 文本输入 |
| **CheckBox** | 复选框 |
| **ChoicePicker** | 单选/多选 |
| **Slider** | 滑块 |
| **DateTimeInput** | 日期时间输入 |
| **Video** | 视频播放 |
| **AudioPlayer** | 音频播放 |
| **Divider** | 分割线 |
| **Tabs** | 标签页切换 |

#### 3. Data Binding（数据绑定）

A2UI 内置了 **14 个数据绑定函数**，让组件可以引用和转换数据模型中的值：

| 函数 | 用途 | 示例 |
|------|------|------|
| `required` | 必填校验 | `{"fn": "required", "ref": "email"}` |
| `regex` | 正则校验 | `{"fn": "regex", "ref": "phone", "args": ["^\\d{11}$"]}` |
| `length` | 长度校验 | `{"fn": "length", "ref": "name", "args": [2, 20]}` |
| `numeric` | 数值校验 | `{"fn": "numeric", "ref": "age"}` |
| `email` | 邮箱校验 | `{"fn": "email", "ref": "email"}` |
| `formatString` | 字符串格式化 | `{"fn": "formatString", "args": ["你好，{0}"], "refs": ["name"]}` |
| `formatNumber` | 数字格式化 | 千分位、小数位等 |
| `formatCurrency` | 货币格式化 | `{"fn": "formatCurrency", "ref": "price", "args": ["CNY"]}` |
| `formatDate` | 日期格式化 | `{"fn": "formatDate", "ref": "createdAt", "args": ["yyyy-MM-dd"]}` |
| `pluralize` | 复数处理 | "1 item" vs "3 items" |
| `and / or / not` | 逻辑组合 | 组合多个条件表达式 |
| `openUrl` | 打开链接 | `{"fn": "openUrl", "args": ["https://..."]}` |

### Surface 与 Catalog

理解 A2UI 还需要知道两个核心概念：

**Surface（界面画布）**：Agent 界面的"容器"或"画布"。一个 Surface 就是一个独立的 UI 区域——它可以是对话框（dialog）、侧边栏（sidebar）或主内容区（main）。Agent 可以同时管理多个 Surface。

**Catalog（组件目录）**：可用组件类型的集合。宿主应用可以定义自己的 Catalog，决定支持哪些组件。默认 Catalog 包含上述 18 个基础组件，你也可以扩展自定义组件。

```
Agent 输出 JSON
      │
      ▼
┌─────────────────────────────┐
│  Surface（界面画布）           │
│  ┌─────────────────────────┐│
│  │  Catalog（组件目录）      ││
│  │  ┌───┐ ┌───┐ ┌───┐     ││
│  │  │Btn│ │Txt│ │Inp│ ... ││
│  │  └───┘ └───┘ └───┘     ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

---

## 架构设计

A2UI 采用清晰的三层架构，每一层各司其职：

```
┌─────────────────────────────────────────────────────────┐
│                Layer 3: Framework（框架层）               │
│     宿主应用集成 —— React / Angular / Flutter / ...       │
├─────────────────────────────────────────────────────────┤
│                Layer 2: Renderer（渲染层）                │
│          JSON → 原生 UI 映射，组件实例化                   │
├─────────────────────────────────────────────────────────┤
│                Layer 1: Schema（协议层）                  │
│        JSON Schema 定义，消息格式，传输无关                 │
└─────────────────────────────────────────────────────────┘
```

### Layer 1: Schema（协议层）

协议层是 A2UI 的核心。它定义了 JSON Schema 规范——组件长什么样、消息格式是什么、数据绑定怎么写。这一层**与传输协议无关**：你可以通过 HTTP、WebSocket、JSONL 流式传输，甚至把 A2UI JSON 嵌入到其他协议中。

协议层的稳定性是整个体系的基础。Google 承诺在同一大版本内（比如 v0.x）保持 Schema 向后兼容。

### Layer 2: Renderer（渲染层）

渲染层负责把 JSON 描述变成真正的 UI 组件。每个目标框架（React、Angular、Flutter 等）都需要一个对应的 Renderer。Renderer 的工作是：

- 解析 JSON 中的组件树
- 将 A2UI 组件映射为原生框架组件
- 处理数据绑定和事件回调
- 管理 Surface 的生命周期

### Layer 3: Framework（框架层）

框架层是宿主应用与 A2UI 的集成点。宿主应用只需要：

1. 引入对应框架的 A2UI 包
2. 注册 Catalog（声明支持哪些组件）
3. 将 Agent 的 JSONL 输出接入 Renderer

```
宿主应用
   │
   │  引入 @a2ui/lit（或其他框架包）
   │  注册 Catalog
   │
   ▼
Agent JSONL ──→ Renderer ──→ 原生 UI
```

---

## 框架适配

A2UI 的跨平台能力取决于各框架的适配器实现。目前的支持状态如下：

| 框架 | 状态 | 包名 | 说明 |
|------|------|------|------|
| **Lit** | ✅ 稳定 | `@a2ui/lit` | Web Components 实现，通用性最好 |
| **Angular** | ✅ 稳定 | `@a2ui/angular` | Google 内部广泛使用 |
| **Flutter** | ✅ 稳定 | Flutter GenUI SDK | Flutter 团队官方维护 |
| **React** | 🚧 开发中 | 待定 | 预计 2026 Q1 发布 |
| **SwiftUI** | 📋 计划中 | 待定 | 预计 2026 Q2 启动 |
| **Jetpack Compose** | 📋 计划中 | 待定 | 预计 2026 Q2 启动 |

::: tip
Lit 和 Angular 的适配器是目前最成熟的选择。如果你需要在 Web 端使用 A2UI，Lit 版本基于 Web Components 标准，可以在任何前端框架中使用——不限于 Lit 项目本身。Flutter 版本则由 Flutter 团队直接维护，品质有保障。

React 适配器尚未发布，这对于国内大量使用 React 的团队来说是一个实际的限制。
:::

---

## 生态集成

A2UI 不是孤立的协议，它在 Agent 生态中有明确的协作定位。

### 与 A2A Protocol

[A2A Protocol](https://github.com/google/A2A) 解决的是 **Agent 间通信**（Agent-to-Agent），A2UI 解决的是 **Agent 到用户的界面**（Agent-to-User）。两者天然互补：

- A2A 让多个 Agent 互相协作完成任务
- A2UI 让 Agent 把任务结果和交互界面展示给用户

在 Google 的愿景中，一个完整的 Agent 交互场景可能是：用户通过 A2UI 界面发起请求 → Agent 通过 A2A 协作处理 → 处理结果通过 A2UI 展示给用户。

### 与 AG-UI

AG-UI 是由 CopilotKit 主导的 **Agent-UI 通信协议**，定位与 A2UI 有重叠但侧重不同。AG-UI 更侧重于 Agent 与前端应用的实时交互协议（事件流、状态同步），而 A2UI 更侧重于界面描述的标准格式。

A2UI 已经定义了 **AG-UI 传输绑定**，意味着你可以通过 AG-UI 协议传输 A2UI JSON——两者可以组合使用而非二选一。

### 与 CopilotKit

CopilotKit 对 A2UI 提供了 **Day-Zero 兼容**——A2UI 发布之初 CopilotKit 就宣布支持。集成方式很简洁：

- `injectA2UITool()`：将 A2UI 作为一个 Tool 注入到 Agent 中
- `createCatalog()`：自定义组件目录

### Google 内部采用

A2UI 在 Google 内部已经有多个产品在使用：

| 产品 | 用途 |
|------|------|
| **Opal** | AI mini-apps，快速构建 Agent 小应用 |
| **Gemini Enterprise** | 企业版 Gemini 中的 Agent 交互界面 |
| **AI Powered Google** | Google 搜索等产品的 AI 增强功能 |
| **Flutter GenUI SDK** | Flutter 的服务端驱动 UI 能力 |

> Google 内部的广泛采用意味着 A2UI 的协议设计经过了大量实际场景的验证。反过来，Google 自家产品的持续使用也保证了协议会持续迭代，不会轻易"弃坑"。

---

## 与传统方案对比

把 A2UI 放在更广阔的技术视野中，与几种常见的"动态 UI"方案做个对比：

| 维度 | A2UI | React Server Components (RSC) | Code-generated UI | 模板系统 |
|------|------|-------------------------------|-------------------|---------|
| **安全性** | 高（声明式 JSON） | 中（服务端执行） | 低（可执行代码） | 高（审核模板） |
| **LLM 友好度** | 高（扁平 JSON） | 低（需要生成 JSX） | 中（需要生成可运行代码） | 低（需要匹配模板 ID） |
| **跨框架** | 高（协议层抽象） | 低（仅 React） | 低（依赖特定运行时） | 中（模板可适配多端） |
| **可控性** | 高（Catalog 限制） | 中 | 低（代码自由度太高） | 高（模板完全可控） |
| **实时更新** | 支持（JSONL 流式） | 支持（流式 RSC） | 需自行实现 | 需自行实现 |
| **学习成本** | 低 | 中 | 低 | 低 |

**选型建议**：

- **Agent 需要展示交互界面，且安全是第一优先级** → **A2UI**
- **纯 React 技术栈，不需要跨框架** → **RSC** 足够
- **快速原型验证，不在意安全风险** → **Code-generated UI** 最快
- **界面样式固定，只需要填充数据** → **模板系统** 最简单

---

## 适用场景

### 1. AI Agent 交互界面

这是 A2UI 的"本命场景"。当 Agent 需要向用户展示比纯文本更丰富的界面——表单、卡片、列表、图表容器——A2UI 提供了安全且跨平台的标准方案。

### 2. 跨平台 Agent UI

如果你需要在 Web、移动端（Flutter）、甚至桌面端同时展示 Agent 的界面，A2UI 的协议层抽象让同一份 JSON 可以在不同平台上渲染。

### 3. 企业级安全场景

在金融、医疗、政务等对安全合规要求极高的领域，A2UI 的"纯数据不可执行"特性消除了代码注入风险，使得 Agent 生成的界面可以通过安全审计。

### 4. LLM 直接生成 UI

大模型生成结构化 JSON 比生成可运行代码容易得多。你可以让 LLM 直接输出 A2UI JSON，经过 Catalog 校验后安全渲染——不需要代码沙箱。

### 5. 多 Agent 协作界面

结合 A2A Protocol，多个 Agent 协作完成任务后，各自负责不同 Surface 的界面渲染，最终组合成完整的用户交互体验。

### 不适合的场景

- **高度定制化视觉设计**：如果你的界面需要精确的像素级控制、复杂动画、自定义绘制，18 个基础组件不够用
- **纯 Web 应用开发**：A2UI 不是 Web 框架的替代品，用它写常规 Web 应用是大材小用
- **离线应用**：A2UI 的流式消息机制依赖网络连接
- **游戏/实时图形**：游戏 UI 需要帧级渲染控制，声明式协议的更新粒度不够
- **复杂表单逻辑**：虽然 A2UI 有数据绑定和校验函数，但复杂的跨字段联动、异步校验、条件分支表单仍然受限

::: warning
A2UI 目前处于 v0.8 Public Preview 阶段，协议还没有完全稳定。v0.8 到 v0.9 之间会有 Breaking Change。如果你打算在生产环境使用，需要做好版本升级的准备。另外，React 适配器的缺失和社区规模较小，也是当前需要考虑的实际因素。
:::

---

## 思考题

::: info 检验你的理解
- [ ] 能说出 Agent 展示 UI 的三种方案及其安全性和表达力对比
- [ ] 理解邻接表模型的设计思路，能解释为什么选择扁平列表 + ID 引用而非嵌套 JSON
- [ ] 能区分 A2UI 的三大核心支柱（流式消息/声明式组件/数据绑定）各自的作用
- [ ] 理解三层架构（Schema → Renderer → Framework）中每一层的职责
- [ ] 能解释 A2UI 与 A2A Protocol、AG-UI 之间的互补关系
- [ ] 能根据具体场景判断 A2UI 是否是合适的选择
:::

---

## 本节小结

通过本节学习，你应该掌握了：

✅ **A2UI 背景**
- Google 出品，Apache 2.0 开源，v0.8 Public Preview
- 核心定位：Agent 驱动界面的声明式 UI 协议
- 核心理念："Safe like data, but expressive like code"

✅ **核心问题**
- Agent UI 三种方案：可执行代码 / 模板系统 / 声明式 JSON
- 安全性对比：声明式 JSON 在安全性上全面占优

✅ **声明式协议**
- 邻接表模型：扁平列表 + ID 引用
- 18 个基础组件 + 14 个数据绑定函数
- Surface（界面画布）与 Catalog（组件目录）

✅ **架构设计**
- 三层架构：Schema → Renderer → Framework
- 协议层传输无关，渲染层框架适配，框架层宿主集成

✅ **框架适配**
- Lit / Angular / Flutter 已稳定，React 开发中，SwiftUI / Compose 计划中

✅ **生态集成**
- A2A + A2UI 互补（Agent 间通信 + Agent 到用户界面）
- AG-UI 传输绑定、CopilotKit Day-Zero 兼容
- Google 内部广泛采用

✅ **适用与不适用场景**
- 适合：Agent 交互界面、跨平台、企业安全、LLM 生成 UI
- 不适合：高度定制化视觉、纯 Web 开发、离线应用、游戏

---

## 延伸阅读

- [A2UI GitHub 仓库](https://github.com/google/A2UI)
- [A2UI 官网](https://a2ui.org)
- [A2A Protocol GitHub 仓库](https://github.com/google/A2A)
- [AG-UI 协议](https://docs.ag-ui.com)
- [CopilotKit 官方文档](https://docs.copilotkit.ai)
- [Agent 编排模式](/agent-ecosystem/07-agent-ecosystem/06-orchestration)
- [MCP 协议](/agent-ecosystem/07-agent-ecosystem/03-mcp-protocol)

---

[← 返回模块目录](/agent-ecosystem/07-agent-ecosystem) | [继续学习: A2UI 实战 →](/agent-ecosystem/07-agent-ecosystem/17-a2ui-deploy)
