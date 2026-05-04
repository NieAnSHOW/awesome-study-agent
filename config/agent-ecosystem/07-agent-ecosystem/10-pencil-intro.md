# Pencil 原型设计工具入门

> **学习目标**: 了解 Pencil (pencil.dev) 这一 AI-native 设计画布的基本功能和使用方法,掌握在 IDE 中进行原型设计的基础流程
>
> **预计时间**: 30 分钟
>
> **难度等级**: ⭐⭐☆☆☆
>
> **更新时间**: 2026 年 5 月

---

## Pencil 是什么

Pencil 是一款 **AI-native 的矢量设计画布**,由 Pencil Labs 开发。与传统的 Figma/Sketch 不同,Pencil 直接运行在 VS Code/Cursor 这类 IDE 中,设计文件以 JSON 格式的 `.pen` 文件保存在代码仓库里,原生支持 MCP 协议——这意味着 AI Agent 可以直接读写你的设计文件。

一句话概括:**Pencil 把设计变成了代码仓库里的一等公民**。

### 核心特性

- **IDE 原生集成**:作为 VS Code/Cursor 扩展运行,无需在浏览器和编辑器之间切来切去
- **JSON 格式的 `.pen` 文件**:设计数据是结构化、可读的 JSON,支持 Git 版本管理、分支和 PR 评审
- **MCP 原生支持**:AI Agent 通过 MCP 协议可以直接读取、创建、修改设计元素,实现双向读写
- **Design as Code**:设计文件和代码在同一个仓库里,一起提交、一起审查、一起发布
- **无限画布**:高性能 WebGL 渲染,支持无限尺寸的设计空间
- **Code on Canvas**:脚本节点用 JavaScript 生成设计元素——图表、网格、图案,一切皆可编程

### 适用场景

| 场景 | 说明 |
|------|------|
| **UI 原型设计** | 在开发环境中直接设计界面,减少设计到代码的交接成本 |
| **Design as Code** | 将设计文件纳入 Git 管理,设计变更通过 PR 评审 |
| **Agent 驱动设计** | 通过 MCP 让 AI Agent 自动生成和修改设计 |
| **设计系统管理** | 用变量和组件库维护跨项目的设计一致性 |
| **代码生成** | 从设计直接导出 React/HTML/CSS 代码 |

### 与 Figma 的差异

| 维度 | Pencil (pencil.dev) | Figma |
|------|---------------------|-------|
| **运行环境** | VS Code/Cursor 扩展 + 桌面应用 | 浏览器 + 桌面应用 |
| **文件存储** | 本地 `.pen` 文件,可 Git 管理 | 云端 Figma 项目 |
| **AI 权限** | 双向读写(MCP 读写) | 只读(Figma MCP 只支持查看) |
| **代码输出** | 直接生成 React/HTML/CSS | 开发模式查看 |
| **开源** | 文件格式开源,源码私有 | 闭源商业产品 |
| **数据隐私** | 完全本地(文件在你自己仓库里) | 云端存储 |
| **协作方式** | Git 驱动(分支+PR) | 实时多人协作 |
| **适合** | 开发者/小团队/Agent 工作流 | 专业设计团队 |

Pencil 不是 Figma 的替代品——在大规模设计协作和专业设计系统管理上,Figma 仍然是标准。Pencil 的优势在于:**它把设计和开发放在了同一个地方,而且让 AI Agent 也能参与进来**。

---

## 安装与界面

### 安装方式

Pencil 支持三种使用方式,你可以根据自己的习惯选择:

**1. VS Code 扩展(推荐)**

1. 打开 VS Code,进入扩展面板(`Cmd/Ctrl + Shift + X`)
2. 搜索 "Pencil",点击安装
3. 创建一个 `.pen` 后缀的文件(如 `test.pen`),双击打开
4. 编辑器右上角会出现 Pencil 图标,表示扩展已激活

**2. Cursor 扩展**

步骤与 VS Code 相同——在扩展市场搜索安装,创建 `.pen` 文件即可使用。

**3. 桌面应用**

访问 [pencil.dev](https://www.pencil.dev/) 下载对应平台的安装包:
- **macOS**: `.dmg` 安装包,支持 Apple Silicon 和 Intel
- **Linux**: `.deb` / `.AppImage` 格式
- **Windows**: 桌面应用 + VS Code/Cursor 扩展

::: tip AI 功能需要 Claude Code
Pencil 的 AI 功能需要安装并通过 `claude` 命令完成 Claude Code 的登录认证。这是为了确保 AI 操作的安全性和可追溯性。
:::

### 核心界面组成

启动 Pencil 并打开一个 `.pen` 文件后,你会看到如下界面布局:

```
┌─────────────────────────────────────────────┐
│  工具栏 (顶部)                               │
│  [选择] [形状] [文字] [画笔] [组件] [导出]    │
├──────────┬──────────────────┬────────────────┤
│          │                  │                │
│  图层面板 │   无限画布        │  属性面板     │
│  (左侧)   │   (中央)         │  (右侧)       │
│          │                  │                │
│  元素层级 │   无限缩放        │  样式/布局    │
│  页面管理 │   拖拽放置        │  变量绑定     │
│  组件列表 │   对齐辅助        │  脚本属性     │
│          │   网格参考        │  导出设置     │
├──────────┴──────────────────┴────────────────┤
│  状态栏 (底部)                                │
│  - 缩放比例 / 选中元素信息 / MCP 连接状态      │
└─────────────────────────────────────────────┘
```

**各区域功能**:

- **工具栏**:包含选择、形状、文字、画笔等核心工具,以及组件管理和导出入口
- **图层面板**:显示画布上所有元素的层级结构,支持拖拽排序、重命名、显示/隐藏
- **无限画布**:核心设计区域,支持无限缩放和平移。按住空格拖拽平移,滚动缩放
- **属性面板**:选中元素后显示其样式、布局、效果等可编辑属性

### 常用快捷键

| 操作 | 快捷键 |
|------|--------|
| 平移画布 | `Space + 拖拽` |
| 缩放 | `Cmd/Ctrl + 滚轮` |
| 缩放至 100% | `0` |
| 适应画布 | `1` |
| 选中元素 | 单击 |
| 多选 | `Shift + 单击` |
| 全选 | `Cmd/Ctrl + A` |
| 撤销 | `Cmd/Ctrl + Z` |
| 重做 | `Cmd/Ctrl + Shift + Z` |

### .pen 文件的概念

`.pen` 文件是 Pencil 的设计文件格式,核心特点:

- **JSON 格式**:文件内容是可读的结构化数据,可以用任何文本编辑器打开查看
- **可版本管理**:像代码一样提交 Git、做 diff、走 PR 评审
- **便携**:复制文件即可分享,不依赖云端服务

```json
// .pen 文件内部结构示意(实际内容更复杂)
{
  "version": "2.11",
  "nodes": [
    {
      "id": "frame-1",
      "type": "frame",
      "name": "首页",
      "width": 1440,
      "height": 900,
      "children": [...]
    }
  ],
  "variables": {...}
}
```

::: tip 最佳实践
- 勤保存(`Cmd/Ctrl + S`),目前不支持自动保存
- 将 `.pen` 文件放在代码仓库中和代码一起管理
- 使用有意义的文件名:`dashboard.pen`、`components.pen`
- 定期 Git 提交作为版本历史
:::

---

## 基本操作

### 创建你的第一个设计

1. 在项目中创建一个 `.pen` 文件(如 `my-first-design.pen`)
2. 双击打开,Pencil 会自动激活并显示空白画布
3. 在工具栏选择形状工具,点击画布放置一个矩形
4. 选中矩形,右侧属性面板调整大小和颜色
5. `Cmd/Ctrl + S` 保存

不到 1 分钟,你就完成了第一个设计文件。

### 添加和编辑元素

Pencil 支持以下核心元素类型:

| 元素类型 | 用途 | 创建方式 |
|---------|------|---------|
| **Frame(框架)** | 页面容器,组织相关元素 | 工具栏选择 Frame 或快捷键 |
| **Shape(形状)** | 矩形、圆形、线条、多边形、路径 | 工具栏形状下拉菜单 |
| **Text(文字)** | 标题、正文、标签 | 工具栏文字工具 |
| **Component(组件)** | 可复用的设计元素 | 从组件库拖拽或自定义创建 |
| **Script(脚本)** | 用 JavaScript 生成动态内容 | 工具栏形状下拉菜单 → Script |

**基本操作技巧**:

- **移动**:选中元素后直接拖拽
- **调整大小**:拖动元素边缘的控制点
- **多选**:按住 `Shift` 单击,或框选
- **对齐**:选中多个元素后,属性面板中点击对齐按钮
- **删除**:选中元素后按 `Delete` 或 `Backspace`

### 属性编辑

选中元素后,右侧属性面板显示以下可编辑属性:

**布局属性**:

| 属性 | 说明 |
|------|------|
| 位置(X/Y) | 元素相对于画布或父容器的坐标 |
| 尺寸(W/H) | 宽度和高度 |
| 旋转 | 元素旋转角度 |
| 布局模式 | 自由布局或弹性布局(Flex) |

**样式属性**:

| 属性 | 说明 |
|------|------|
| 填充 | 背景色/渐变/图片填充,支持变量绑定 |
| 描边 | 边框颜色和粗细 |
| 圆角 | 圆角矩形控制 |
| 阴影 | 投影/内阴影效果 |
| 透明度 | 0-100% 透明度 |

**文字属性**(选中文字元素时):

| 属性 | 说明 |
|------|------|
| 字体 | 支持系统已安装字体 |
| 字号 | 像素单位 |
| 字重 | Light/Regular/Medium/Bold 等 |
| 颜色 | 文字颜色,支持变量绑定 |
| 对齐 | 左/中/右/两端对齐 |
| 行高 | 行间距控制 |

### 图层管理

图层面板(左侧)显示画布上所有元素的层级树:

- **重命名**:双击图层名称
- **调整层级**:拖拽图层上下移动
- **显示/隐藏**:点击图层右侧的眼睛图标
- **分组**:选中多个元素,右键 → 分组(`Cmd/Ctrl + G`)
- **Flex 布局**:选中元素后 `Cmd/Ctrl + Option + G` 应用弹性布局

### 页面组织

一个 `.pen` 文件可以包含多个页面:

- 在图层面板顶部管理页面
- 每个页面相当于一个"屏幕"或"视图"
- 页面间可以通过链接模拟交互流程

---

## 设计系统组件

### 内置组件库

Pencil 提供了一些内置组件和设计套件(Design Kits),包括:

- **基础 UI 元素**:按钮、输入框、卡片、导航栏等
- **布局模板**:常见页面布局的起点
- **图标库**:常用 UI 图标

### 创建自定义组件

当你需要在多个页面或项目中复用同一组元素时:

1. 在画布上设计好元素组合
2. 选中所有元素,右键 → `创建组件(Create Component)`
3. 组件会出现在组件库中,可以拖拽复用到任意位置
4. 修改组件原型(Origin),所有实例(Instance)自动更新

::: tip 组件颜色标识
在画布上,组件原型(原始定义)显示为**品红色**边框,组件实例(复用副本)显示为**紫色**边框。修改品红色原型,所有紫色实例自动同步更新。
:::

### 设计变量与主题

Pencil 支持设计变量(Design Tokens)管理:

- **颜色变量**:定义 `$primary`、`$secondary` 等全局颜色
- **字号变量**:定义 `$font-size-base`、`$font-size-lg` 等排版尺度
- **间距变量**:定义 `$spacing-unit` 等布局规范
- **主题切换**:通过修改变量值实现明暗主题切换

通过 MCP 的 `get_variables` 和 `set_variables` 工具,AI Agent 可以直接读取和修改这些设计变量——这在下一篇文章中会详细介绍。

### Code on Canvas: 用代码生成设计

Pencil 有一个很酷的特性——Script 节点。你可以在画布上放置一个脚本节点,关联一个 `.js` 文件,用 JavaScript 代码生成设计元素:

```javascript
/**
 * @schema 2.11
 *
 * @input columns: number(min=1) = 3
 * @input color: color = #3B82F6
 */
const cols = Math.floor(pencil.input.columns);
const cellW = pencil.width / cols;

const nodes = [];
for (let c = 0; c < cols; c++) {
  nodes.push({
    type: "rectangle",
    x: c * cellW,
    y: 0,
    width: cellW - 4,
    height: pencil.height,
    fill: pencil.input.color,
  });
}
return nodes;
```

这段代码会生成 `columns` 个并排的彩色矩形。调整脚本节点大小或修改参数,生成的内容会实时更新。这对数据可视化、网格布局、图案生成等场景特别有用。

---

## MCP 集成简介

### Pencil 的 MCP 能力

Pencil 最核心的特色之一就是**原生 MCP 支持**。当你启动 Pencil(桌面应用或 IDE 扩展)时,它会自动启动一个本地 MCP 服务器。AI 助手(如 Claude Code、Cursor AI)可以通过 MCP 协议连接到这个服务器,获得以下能力:

| MCP 工具 | 功能 |
|----------|------|
| `batch_design` | 创建、修改、删除设计元素 |
| `batch_get` | 读取设计组件和层级结构 |
| `get_screenshot` | 渲染设计预览截图 |
| `snapshot_layout` | 分析布局结构,检测重叠/裁剪问题 |
| `get_variables` / `set_variables` | 读取和更新设计变量/主题 |
| `get_editor_state` | 获取当前编辑器状态 |
| `get_guidelines` | 加载指南和样式参考 |
| `export_nodes` | 导出设计为 PNG/JPEG/WEBP/PDF |
| `find_empty_space_on_canvas` | 寻找画布上的空白区域 |

### 为什么 MCP 很重要

传统的工作流程是:设计师在 Figma 画好 → 导出设计稿 → 开发者照着写代码。这是一个单向的、容易产生偏差的过程。

有了 Pencil 的 MCP 集成,流程变成了:

1. **Agent 可以读取设计**:`batch_get` 获取设计文件的结构和数据
2. **Agent 可以直接修改设计**:`batch_design` 创建、移动、更新元素
3. **Agent 可以验证效果**:`get_screenshot` 截图确认视觉输出
4. **设计就在代码旁边**:`.pen` 文件放在项目仓库中,Agent 同时看到设计和代码

这意味着你可以对 AI 说"给这个页面加一个登录表单",AI 就能直接操作设计文件完成——不需要你手动打开设计工具。

### 支持的 AI 助手

Pencil 通过 MCP 支持以下 AI 工具:

- **Claude Code**(CLI 和 IDE)
- **Cursor**(内置 AI)
- **Codex CLI**(OpenAI)
- **Windsurf IDE**
- **Claude Desktop**

### 快速体验 MCP 连接

安装完成后,验证 MCP 连接是否正常:

**在 Cursor 中**:设置 → Tools & MCP,查看 Pencil 是否出现在服务器列表中。

**在 Codex CLI 中**:
```bash
/mcp
# Pencil 应出现在 MCP 服务器列表中
```

**在 Claude Code 中**:打开一个 `.pen` 文件后,Claude 会自动通过 MCP 连接到 Pencil。

> 下一篇文章会详细讲解 Pencil MCP 的配置和使用方法。

---

## 导出与交付

Pencil 支持将设计导出为多种格式,满足不同的交付场景。

### 导出为代码(最推荐)

Pencil 可以直接从设计生成代码:

- **React 组件**:将设计转换为生产可用的 React 组件
- **HTML/CSS**:生成标准网页代码
- **Tailwind CSS**:导出时自动应用 Tailwind 类名

你可以在 AI 面板中直接询问:"Generate React code for this component"。

### 导出为图片

| 格式 | 用途 | 特点 |
|------|------|------|
| **PNG** | 图片展示、文档插图 | 支持透明背景,推荐 2x 分辨率 |
| **JPEG** | 照片级输出 | 文件体积小 |
| **WEBP** | 现代网页使用 | 同等质量下体积更小 |
| **PDF** | 文档交付、打印 | 矢量内容,适合存档 |

### CLI 导出

安装了 Pencil CLI(`npm install -g @pencil.dev/cli`)后,可以在终端中导出:

```bash
# 导出为 PNG
pencil --in design.pen --export hero.png --export-scale 2

# 导出为 PDF
pencil --in design.pen --export output.pdf
```

### 与 Git 工作流集成

Pencil 的 Design as Code 理念意味着设计文件的交付就是一次 Git 提交:

```bash
git add src/designs/landing-page.pen
git commit -m "Update landing page design"
git push origin feature/new-landing-page
```

设计变更通过 PR 评审,与其他代码变更一起合入主分支。这让"设计-开发-交付"的流程变得前所未有的平滑。

---

## 思考题

::: info 检验你的理解
1. **Pencil 的设计文件使用什么格式?**
   - A. `.sketch` 二进制格式
   - B. `.pen` JSON 格式
   - C. `.fig` 云端格式

2. **Pencil 通过什么协议让 AI Agent 读写设计文件?**
   - A. REST API
   - B. WebSocket
   - C. MCP (Model Context Protocol)
   - D. GraphQL

3. **Pencil 的 MCP 和 Figma 的 MCP 在权限上有什么区别?**

4. **如果你在一个 React 项目中引入了 Pencil,请描述从新建 .pen 文件到最终交付的完整工作流。**

5. **思考:Code on Canvas(Script 节点)可以用于哪些场景?请列出至少两个实际应用。**
:::

---

## 本节小结

通过本节学习,你应该掌握了:

✅ **Pencil 的定位**
- AI-native 设计画布,运行在 IDE 中
- `.pen` JSON 文件格式,支持 Git 版本管理
- 与 Figma 最大的区别:MCP 双向读写 + Design as Code

✅ **安装与界面**
- VS Code/Cursor 扩展或桌面应用
- 核心界面:工具栏 + 图层面板 + 无限画布 + 属性面板
- `.pen` 文件是 JSON 格式,可读可版本管理

✅ **基本操作**
- 创建 Frame、Shape、Text、Component、Script 五种元素
- 属性编辑覆盖布局、样式、文字三大维度
- 图层管理和页面组织

✅ **设计系统组件**
- 创建自定义组件,原型修改自动同步所有实例
- 设计变量管理颜色、字号、间距等设计 Token
- Code on Canvas:用 JavaScript 生成设计元素

✅ **MCP 集成**
- Pencil 启动时自动运行本地 MCP 服务器
- 支持 batch_design、batch_get、get_screenshot 等 MCP 工具
- AI Agent 可以读写设计文件——这是 Pencil 最核心的能力

✅ **导出与交付**
- 直接导出 React/HTML/CSS 代码
- 导出 PNG/JPEG/WEBP/PDF 图片
- 设计文件通过 Git 提交,走 PR 评审流程

---

**下一步**: 在 [Pencil MCP 集成](/agent-ecosystem/07-agent-ecosystem/11-pencil-mcp) 中,我们将深入学习如何配置 Pencil MCP 服务器、通过 MCP 工具操控设计文件,以及实战一个 Agent 自动生成设计的完整示例。

---

## 延伸阅读

- [Pencil 官网](https://www.pencil.dev/) - 官方项目首页和下载
- [Pencil 文档](https://docs.pencil.dev/) - 完整的使用指南和 API 参考
- [.pen 文件格式说明](https://docs.pencil.dev/core-concepts/pen-files) - 深入了解 .pen 文件结构
- [MCP 协议介绍](/agent-ecosystem/07-agent-ecosystem/03-mcp-protocol) - 回顾 MCP 协议基础知识
- [Pencil CLI 文档](https://docs.pencil.dev/for-developers/pencil-cli) - 命令行工具使用参考

---

[← 返回模块目录](/agent-ecosystem/07-agent-ecosystem) | [继续学习:Pencil MCP 集成 →](/agent-ecosystem/07-agent-ecosystem/11-pencil-mcp)
