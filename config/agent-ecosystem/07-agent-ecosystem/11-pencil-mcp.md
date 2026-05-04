# Pencil MCP 集成

> **学习目标**: 掌握通过 MCP 协议集成 Pencil 设计工具的方法，了解 16 个 MCP 工具的功能和使用场景
>
> **预计时间**: 40 分钟
>
> **难度等级**: ⭐⭐⭐☆☆
>
> **更新时间**: 2026 年 5 月

---

## MCP 与设计工具的桥梁

### MCP 协议回顾

在[前面的文章](/agent-ecosystem/07-agent-ecosystem/03-mcp-protocol)中我们了解到，MCP（Model Context Protocol）让 AI Agent 能够调用外部工具和数据源。一个 MCP 服务器可以暴露工具（Tools）、资源（Resources）和提示（Prompts），Agent 通过统一的协议调用它们。

如果把 MCP 比作"USB 接口"，那 MCP 服务器就是各种"外设"——文件系统、数据库、API……**而 Pencil 是第一款原生支持 MCP 的设计工具**。

### 为什么这是重要的转折

在 Pencil 之前，AI 和设计工具的关系是这样的：

```
AI: "我来帮你生成设计代码。"
你: "好的，这是 Figma 截图。"
AI: "我照着截图写了 HTML/CSS。"
你: "但设计文件本身还是得手动改。"
```

AI 只能"看"设计，不能"改"设计。Figma 虽然也有 MCP 服务器，但只提供只读能力——Agent 可以查看设计内容，但不能创建或修改元素。

**Pencil 打破了这堵墙**。它的 MCP 服务器提供完整的读写能力：

- **读取**: 搜索节点、获取属性、查看变量
- **写入**: 创建元素、修改样式、删除节点
- **验证**: 截屏预览、分析布局

这意味着你可以对 AI 说"给登录页面加一个注册表单"，AI 就直接在你的设计文件里操作——不用打开设计工具，不用手动拖拽。

### Pencil MCP 能做什么

| 能力 | 说明 |
|------|------|
| **读取设计** | 搜索元素、查看层级结构、获取变量定义 |
| **创建修改** | 插入形状/文字/组件、调整属性、修改布局 |
| **截图验证** | 渲染设计预览，确认视觉输出 |
| **布局分析** | 检测重叠、裁剪等布局问题 |
| **变量管理** | 读取和更新设计 Token，实现主题切换 |
| **批量操作** | 一次调用执行最多 25 个设计操作 |
| **导出交付** | 导出为 PNG/JPEG/WEBP/PDF |
| **子代理协作** | 启动独立子任务进行代码生成等耗时操作 |

---

## Pencil MCP 架构

### 工作原理

Pencil MCP 采用标准的客户端-服务器架构：

```
┌─────────────────────────────────────────────┐
│               AI 助手                         │
│  (Claude Code / Cursor / Windsurf / Codex)   │
└──────────────────┬──────────────────────────┘
                   │
                   │ MCP 协议 (JSON-RPC 2.0)
                   │
┌──────────────────▼──────────────────────────┐
│           Pencil MCP 服务器                    │
│  运行在本地，随 Pencil 启动而自动启动           │
├──────────────────────────────────────────────┤
│  工具层 (16 个 MCP Tools)                     │
│  - batch_design / batch_get                   │
│  - get_screenshot / snapshot_layout           │
│  - get_variables / set_variables              │
│  - export_nodes / find_empty_space            │
│  - get_guidelines / get_editor_state          │
│  - spawn_agents / ...                         │
└──────────────────────────────────────────────┘
```

**关键特点**:

1. **纯本地运行**: MCP 服务器在本地启动，设计文件不出机器
2. **自动启动**: 安装 Pencil 扩展或桌面应用后，打开 `.pen` 文件时自动激活
3. **自动注册**: 安装时自动配置 `~/.claude.json`，Claude Code 无需手动配置

### 完整的 MCP 工具清单

Pencil MCP 服务器暴露了 **16 个工具**，分为几个功能组：

#### 文档操作

| 工具 | 功能 | 典型用法 |
|------|------|---------|
| `open_document` | 打开已有 `.pen` 文件或创建新文档 | `open_document("new")` 创建空白画布 |
| `get_editor_state` | 获取当前编辑器状态、选中元素 | 获取当前上下文，了解画布内容 |

#### 读取与搜索

| 工具 | 功能 | 典型用法 |
|------|------|---------|
| `batch_get` | 按模式搜索或按 ID 读取节点 | 搜索所有按钮组件、读取特定元素属性 |
| `get_variables` | 获取变量和主题定义 | 读取颜色、字号等设计 Token |
| `get_screenshot` | 截取节点截图 | 验证设计效果，进行前后对比 |
| `snapshot_layout` | 分析布局结构，检测裁剪/重叠 | 检查布局问题，定位异常元素 |
| `search_all_unique_properties` | 搜索文档中的所有唯一属性值 | 整理设计规范，提取使用的颜色/字体 |

#### 创建与修改

| 工具 | 功能 | 典型用法 |
|------|------|---------|
| `batch_design` | 批量插入/复制/更新/替换/移动/删除 | 创建页面、添加组件、调整样式 |
| `set_variables` | 更新变量和主题定义 | 切换明暗主题、修改品牌色 |
| `replace_all_matching_properties` | 全局替换匹配的属性值 | 一键替换所有按钮的圆角大小 |
| `find_empty_space_on_canvas` | 查找画布上的空白区域 | 在合适位置插入新元素 |

#### 设计辅助

| 工具 | 功能 | 典型用法 |
|------|------|---------|
| `get_guidelines` | 获取设计指南 | 加载 `web-app` / `mobile-app` 等设计规范 |
| `get_style_guide` | 按标签获取风格指南 | 获取 warm / tech / minimalist 等风格 |
| `get_style_guide_tags` | 列出所有可用的风格标签 | 查看所有风格选项 |

#### 导出与协作

| 工具 | 功能 | 典型用法 |
|------|------|---------|
| `export_nodes` | 导出为 PNG/JPEG/WEBP/PDF | 导出设计稿交付或放入文档 |
| `spawn_agents` | 启动子代理任务（实验性） | 在新线程中执行代码生成等耗时操作 |

### 支持的 AI 助手

Pencil MCP 支持以下平台，其中部分会自动配置：

| 平台 | 自动配置 | 需手动授权 |
|------|---------|-----------|
| **Claude Code CLI** | 是（写入 `~/.claude.json`） | 是（`~/.claude/settings.json`） |
| **Claude Desktop** | 是 | 否 |
| **Cursor** | 否 | 手动配置 `~/.cursor/mcp.json` |
| **Windsurf IDE** | 否 | 手动配置 |
| **Codex CLI (OpenAI)** | 是（写入 `~/.codex/config.toml`） | 否 |
| **OpenCode CLI** | 是 | 否 |
| **Gemini CLI** | 是 | 否 |
| **Copilot IDE (VS Code)** | 是（项目级 `mcp.json`） | 否 |

---

## 核心操作演示

### 环境准备与验证

**Claude Code 用户**（安装 Pencil 扩展后自动完成，无需手动配置）：

验证 MCP 连接：
```bash
# 确保 Pencil 已启动（点击 VS Code 侧栏的 Pencil 图标）
# 打开一个 .pen 文件并保持为活动标签页
# 在 Claude Code 中，MCP 工具会自动可用
```

**Cursor 用户**（需手动配置）：

在 `~/.cursor/mcp.json` 中添加：
```json
{
  "mcpServers": {
    "pencil": {
      "command": "/path/to/pencil/mcp-server-darwin-arm64",
      "args": ["--app", "cursor"],
      "env": {}
    }
  }
}
```

> MCP 服务器可执行文件的路径可以在 Pencil 扩展安装目录中找到。macOS 上典型的路径是 `/Applications/Pencil.app/Contents/Resources/app.asar.unpacked/out/mcp-server-darwin-arm64`。

### 通过 MCP 创建新设计

**操作流程**: Agent 收到"创建一个登录页面"的指令后，内部会执行一系列 MCP 工具调用：

**步骤 1**: 获取设计指南
```json
// 工具调用: get_guidelines
// Agent 内部调用，获取 web-app 设计规范
{
  "category": "guide",
  "name": "web-app"
}
```

**步骤 2**: 创建画布和页面结构
```json
// 工具调用: batch_design
// 创建主框架和子元素
[
  // 操作 1: 创建页面对话框
  { "type": "I", "parent": "document", "data": {
    "type": "frame",
    "name": "登录页面",
    "width": 1440,
    "height": 900,
    "layout": "vertical"
  }},
  // 操作 2: 添加标题
  { "type": "I", "parent": "frame-1", "data": {
    "type": "text",
    "name": "标题",
    "content": "欢迎回来",
    "fontSize": 32,
    "fontWeight": "bold"
  }}
]
```

**步骤 3**: 设置设计变量
```json
// 工具调用: set_variables
{
  "primary": "#3B82F6",
  "secondary": "#6366F1",
  "background": "#FFFFFF",
  "text": "#1F2937",
  "border-radius": "8px"
}
```

**步骤 4**: 截屏验证
```json
// 工具调用: get_screenshot
{
  "filePath": "design.pen",
  "nodeId": "frame-1"
}
```

### 搜索和读取已有设计

```json
// 工具调用: batch_get
// 搜索画布上所有按钮
{
  "patterns": [{ "name": "button" }],
  "searchDepth": 3
}
```

返回结果包含匹配节点的 ID、类型、名称、位置、尺寸等信息，Agent 据此决定下一步操作。

### 调整元素属性

```json
// 工具调用: batch_design
// 更新按钮颜色和圆角
[
  { "type": "U", "target": "frame-1/btn-login", "data": {
    "fill": "$primary",
    "cornerRadius": [8, 8, 8, 8],
    "padding": [12, 24, 12, 24]
  }},
  { "type": "U", "target": "frame-1/btn-register", "data": {
    "fill": "$secondary",
    "cornerRadius": [8, 8, 8, 8],
    "padding": [12, 24, 12, 24]
  }}
]
```

### 查找空白区域并插入新元素

```json
// 步骤 1: 查找空白区域
// 工具调用: find_empty_space_on_canvas
{
  "direction": "bottom",
  "width": 800,
  "height": 200,
  "padding": 20,
  "nodeId": "frame-1"
}

// 步骤 2: 在空白区域插入元素
// 工具调用: batch_design
// 根据返回的空闲位置坐标，在正确的位置插入元素
```

### 导出设计

```json
// 工具调用: export_nodes
// 导出为 PNG
{
  "nodeIds": ["frame-1"],
  "format": "png",
  "scale": 2
}

// 导出为 PDF（多页）
{
  "nodeIds": ["frame-1", "frame-2"],
  "format": "pdf"
}
```

---

## 自动化设计工作流

### 用 Agent 驱动 Pencil 自动生成原型

Pencil MCP 的真正价值体现在**端到端的自动化**。你可以在一个对话中完成从空白画布到完整原型的全部工作：

```
用户:
"请用 Pencil 创建一个移动端登录页，包含以下元素：
1. 顶部应用 Logo 区域
2. 手机号输入框
3. 密码输入框
4. 登录按钮（主色）
5. 注册入口文字链接
风格使用科技感蓝色调。"
```

Agent 内部自动执行的操作序列：

```
1. get_guidelines("mobile-app")      → 获取移动端设计规范
2. get_style_guide("tech")           → 获取科技感风格指南
3. open_document("new")              → 创建新画布
4. batch_design (8 次操作)           → 创建 Logo、输入框、按钮、文字
5. set_variables                     → 设置蓝色主题变量
6. get_screenshot("frame-1")         → 截屏验证效果
7. snapshot_layout("frame-1")        → 检查布局是否有重叠
```

整个过程用户只需要输入一句话需求，剩下的由 Agent 自动完成。

### 批量修改设计

当需要跨设计文件执行一致性修改时，批量操作的优势就体现出来了：

```json
// 将画布上所有按钮的圆角从 4px 改为 8px
// 步骤 1: 搜索所有按钮
[
  { "type": "U", "target": "main-frame/btn-login", "data": {
    "cornerRadius": [8, 8, 8, 8]
  }},
  { "type": "U", "target": "main-frame/btn-signup", "data": {
    "cornerRadius": [8, 8, 8, 8]
  }},
  { "type": "U", "target": "main-frame/btn-submit", "data": {
    "cornerRadius": [8, 8, 8, 8]
  }}
]
```

对于更大范围的修改，可以使用 `replace_all_matching_properties` 工具：

```json
// 全局替换：将所有 fill 为 #FF6B6B 的元素改为 $primary 变量
{
  "parents": ["frame-1"],
  "properties": {
    "fillColor": [{ "from": "#FF6B6B", "to": "$primary" }]
  }
}
```

### 模板自动化复用

当你有一套标准的设计模板，可以通过 MCP 脚本实现模板的自动化复用：

1. **准备模板**: 将设计系统或页面模板保存在单独的 `.pen` 文件中
2. **复制节点**: Agent 通过 MCP 从模板文件读取节点，复制到目标文件
3. **替换内容**: 用新内容替换占位文本和占位图片
4. **适配布局**: 根据目标尺寸调整布局

### Code on Canvas 与 Script 节点

Pencil 的 Script 节点可以通过 MCP 进行管理。Agent 可以创建或修改脚本节点，动态调整代码生成的设计内容：

```javascript
// 这是一个在 Pencil 画布上运行的 Script 节点
// Agent 可以通过 MCP 修改这个脚本的输入参数
/**
 * @schema 2.11
 * @input columns: number(min=1) = 4
 * @input color: color = #3B82F6
 */
const cols = Math.floor(pencil.input.columns);
const cellW = pencil.width / cols;

const nodes = [];
for (let c = 0; c < cols; c++) {
  nodes.push({
    type: "rectangle",
    x: c * cellW, y: 0,
    width: cellW - 4, height: pencil.height,
    fill: pencil.input.color,
  });
}
return nodes;
```

Agent 可以在对话中调整 `columns` 和 `color` 参数，画布内容实时更新——**设计和代码在同一处联动**。

---

## Agent + Pencil 实践案例

### 场景：从需求描述到原型输出

下面是一个完整的端到端案例，展示 Agent 如何利用 Pencil MCP 完成从需求到交付的全流程。

**用户输入**:

> "帮我设计一个 SaaS 仪表盘首页，包含左侧导航栏、顶部搜索栏、4 个统计卡片和一个最近订单的表格。使用磨砂玻璃（Glassmorphism）风格，蓝色主调，先做出来再看效果。"

**Agent 执行过程**:

```
第 1 步: get_guidelines("web-app")
→ 获取 Web 应用设计规范

第 2 步: get_style_guide_tags()
→ 查找是否有 glassmorphism 风格标签
→ 取相近的 "modern-minimal" 风格

第 3 步: open_document("new")
→ 创建新画布 saas-dashboard.pen

第 4 步: batch_design (20 次操作)
→ 创建主框架 1440×900
→ 创建左侧导航栏（Logo + 6 个导航项）
→ 创建顶部栏（搜索框 + 用户头像）
→ 创建 4 个统计卡片容器
→ 创建表格容器（5 列 + 标题行）

第 5 步: set_variables
→ 主色: #3B82F6 (蓝色)
→ 背景: rgba(255,255,255,0.1) 半透明
→ 毛玻璃效果: backdrop-filter: blur(20px)
→ 边框: rgba(255,255,255,0.18)

第 6 步: batch_design (15 次操作)
→ 填充统计卡片内容（标题、数字、趋势箭头）
→ 填充表格数据行
→ 应用毛玻璃样式到卡片和导航栏

第 7 步: get_screenshot("frame-1")
→ 截屏确认布局效果
→ 如果发现重叠或裁剪问题，执行 snapshot_layout 检查

第 8 步: export_nodes(["frame-1", "frame-2"], "png", 2)
→ 导出 2x 高清 PNG
```

**完整执行时间**: 约 2-3 分钟（取决于 AI 响应速度）。

**交付物**: 一个可编辑的 `.pen` 设计文件 + 高清设计预览图。

### 场景：从已有代码反向生成设计

如果你已经有了 React 组件，可以让 AI 读取代码并生成对应的 Pencil 设计：

```
用户:
"读取 src/components/Button.tsx 的代码，
在 Pencil 中创建一个对应的按钮组件，
包含 primary、secondary、outline 三种变体。"
```

Agent 流程：
1. 读取 Button.tsx 源码，提取 props、样式类名、状态
2. 调用 `batch_design` 创建 three 个按钮变体
3. 应用组件的 color/border/radius 到设计元素
4. 创建为 Pencil 组件（原型），方便复用
5. 截屏验证

---

## 局限与注意

### 当前 MCP 能力边界

| 限制 | 说明 | 应对建议 |
|------|------|---------|
| **每次最多 25 个操作** | `batch_design` 单次调用上限 | 将大型设计拆分为多次调用，按逻辑分组 |
| **子代理（实验性）** | `spawn_agents` 尚未稳定 | 关键任务避免依赖子代理 |
| **没有撤销机制** | MCP 修改是直接操作，不支持 MCP 层面的 `Ctrl+Z` | 频繁 Git 提交，用版本管理替代撤销 |
| **不支持 Figma 导出** | 可从 Figma 导入，但不能导出 Figma 格式 | 在 Pencil 中完成设计，导出为代码或图片 |
| **版本兼容性** | 扩展更新后 MCP 路径可能变化 | 更新后检查 `~/.claude.json` 中的路径 |
| **依赖活动文件** | MCP 调用要求 `.pen` 文件标签页处于活动状态 | 保持 `.pen` 文件在当前标签页 |

### 最佳实践建议

1. **先规划再执行**: 复杂设计先让 AI 输出计划，确认后再执行 batch_design
2. **频繁截屏验证**: 每个阶段后调用 `get_screenshot` 确认效果
3. **用变量管理样式**: 不要硬编码颜色值，始终使用变量（`$primary`、`$secondary`）
4. **拆分大型请求**: 将"创建一个完整仪表盘"拆分为多个步骤
5. **保持小型迭代**: 每次 batch_design 控制在 10-15 个操作，避免超出限制
6. **Git 频繁提交**: MCP 修改直接写入文件，良好的 Git 习惯是安全网
7. **验证布局**: 完成布局后调用 `snapshot_layout` 检查裁剪或重叠

### 版本兼容性说明

- Pencil MCP 与 Pencil 编辑器版本绑定，更新编辑器时 MCP 也会更新
- 扩展更新后，MCP 可执行文件路径中的版本号可能变化，需检查配置文件
- Pencil CLI 版本与桌面版/扩展版的 MCP 工具集保持一致
- 建议使用最新稳定版的 Pencil 和 AI 助手

---

## 思考题

::: info 检验你的理解

- [ ] 1. **Pencil MCP 和 Figma MCP 在权限上的核心差异是什么？**

- [ ] 2. **你在设计一个包含 50 个元素的复杂页面时，应该怎么使用 batch_design？**
      提示：考虑单次调用上限和合理的拆分策略

- [ ] 3. **以下哪些工具组合可以实现"先找空白位置再插入按钮"的操作？**
      A. find_empty_space_on_canvas + batch_design
      B. get_screenshot + snapshot_layout
      C. batch_get + set_variables
      D. export_nodes + get_guidelines

- [ ] 4. **为什么要在设计中使用变量（$primary、$secondary）而不是硬编码颜色值？**
      请结合 set_variables 工具的能力说明。

- [ ] 5. **如果 Pencil 扩展更新后，Claude Code 提示 "tool not found"，可能是什么原因？如何排查？**

- [ ] 6. **思考题: Agent + Pencil 的自动化设计流相比传统的 Figma + 手动设计，在哪些场景下优势明显，哪些场景下仍有不足？**

:::

---

## 本节小结

通过本节学习，你应该掌握了:

✅ **Pencil MCP 架构**
- 纯本地运行的 MCP 服务器，随 Pencil 自动启动
- 完整的双向读写能力，区别于 Figma 的只读 MCP
- 支持 Claude Code、Cursor、Windsurf、Codex CLI 等主流 AI 工具

✅ **16 个 MCP 工具**
- 文档操作: `open_document`、`get_editor_state`
- 读取搜索: `batch_get`、`get_variables`、`get_screenshot`、`snapshot_layout`
- 创建修改: `batch_design`、`set_variables`、`find_empty_space_on_canvas`
- 设计辅助: `get_guidelines`、`get_style_guide`、`get_style_guide_tags`
- 导出协作: `export_nodes`、`spawn_agents`

✅ **核心操作**
- 创建新设计: 获取指南 → 批量创建 → 设置变量 → 截屏验证
- 搜索和读取: 按模式匹配或按 ID 精确读取
- 批量修改: 单次最多 25 个操作，支持全局属性替换
- 导出交付: PNG/JPEG/WEBP/PDF，可指定 2x 高清

✅ **自动化工作流**
- 一句话需求到完整原型的端到端自动化
- 设计模板的自动化复用
- Code on Canvas 脚本节点的 MCP 管理
- 从代码反向生成 Pencil 设计

✅ **最佳实践**
- 拆分大型设计为多步操作
- 频繁截屏验证 + 布局检测
- 使用变量管理样式而非硬编码
- Git 频繁提交作为安全网

---

**下一步**: 本模块的内容到此结束。你可以[返回模块目录](/agent-ecosystem/07-agent-ecosystem)回顾所有内容，或浏览其他模块深入 AI 开发的不同方面。

---

## 延伸阅读

- [Pencil AI Integration 文档](https://docs.pencil.dev/getting-started/ai-integration) - 官方 AI 集成指南
- [Pencil CLI 文档](https://docs.pencil.dev/for-developers/pencil-cli) - 命令行工具完整参考
- [MCP 协议详解](/agent-ecosystem/07-agent-ecosystem/03-mcp-protocol) - 回顾 MCP 基础概念
- [Pencil 原型设计工具入门](/agent-ecosystem/07-agent-ecosystem/10-pencil-intro) - Pencil 基础操作
- [Claude Code MCP 配置](https://docs.anthropic.com/en/docs/claude-code/mcp) - 官方 MCP 配置文档
- [Pencil Skills (GitHub)](https://github.com/partme-ai/pencil-skills) - 引导 LLM 使用 Pencil 工具的 Skills 集合

---

[← Pencil 原型设计工具入门](/agent-ecosystem/07-agent-ecosystem/10-pencil-intro) | [返回模块目录](/agent-ecosystem/07-agent-ecosystem)
