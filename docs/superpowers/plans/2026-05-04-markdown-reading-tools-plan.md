# 模块十五：Markdown 阅读工具 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在基础模块中新增"Markdown 阅读工具"模块（模块十五），包含 5 款免费工具的详细入门指南 + 横向对比。

**Architecture:** 纯内容模块，7 个 Markdown 页面 + 1 个配置文件更新。每页遵循统一模板（简介→核心特点→下载安装→快速上手→核心功能→优缺点），使用 huashu-perspective 写作风格。

**Tech Stack:** VitePress + Markdown

---

### 前置准备：huashu-perspective 写作风格指引

所有内容输出请遵循花叔的写作风格：
- **结论前置**：先说结论再解释过程。每一节的标题就是结论
- **短句**：砍长句，一个观点一句话
- **场景化**：用"你打开电脑第一次..."这种场景描述代替抽象说明
- **口语化**：像在跟朋友聊天，不是在上课
- **无废话**：能一句话说清楚的事不写两句话
- **数据锚定**：能说具体数字就不说"很多"
- **金句收束**：每页结尾用一句有画面感的话收束

---

### Task 1: 使用 unified-search 搜索各工具最新信息

**Files:** 无（搜索任务，结果用于后续内容撰写）

- [ ] **搜索 Obsidian 最新版本和国内下载源**

Run: `python3 /Users/niean/.cc-switch/skills/unified-search/dispatcher.py "Obsidian 最新版本 下载 2026" --max-results 5 --compact`

Expected: 获取最新版本号、官网、GitHub releases、国内镜像地址

- [ ] **搜索 Logseq 最新版本和国内下载源**

Run: `python3 /Users/niean/.cc-switch/skills/unified-search/dispatcher.py "Logseq 最新版本 下载 2026" --max-results 5 --compact`

Expected: 获取最新版本号、官网、GitHub releases、国内下载地址

- [ ] **搜索 MarkText 最新版本和国内下载源**

Run: `python3 /Users/niean/.cc-switch/skills/unified-search/dispatcher.py "MarkText 最新版本 下载 2026 开源" --max-results 5 --compact`

Expected: 获取最新版本号、GitHub releases、国内下载地址

- [ ] **搜索 Joplin 最新版本和国内下载源**

Run: `python3 /Users/niean/.cc-switch/skills/unified-search/dispatcher.py "Joplin 最新版本 下载 2026" --max-results 5 --compact`

Expected: 获取最新版本号、官网、GitHub releases、国内下载地址

- [ ] **搜索 Zettlr 最新版本和国内下载源**

Run: `python3 /Users/niean/.cc-switch/skills/unified-search/dispatcher.py "Zettlr 最新版本 下载 2026" --max-results 5 --compact`

Expected: 获取最新版本号、官网、GitHub releases、国内下载地址

---

### Task 2: 创建目录结构和模块入口页

**Files:**
- Create: `config/basics/15-markdown-reading-tools/index.md`

- [ ] **创建模块目录**

Run: `mkdir -p config/basics/15-markdown-reading-tools/`

- [ ] **编写 index.md**

内容结构：
1. 标题 + 一句话定义模块价值
2. 什么是 Markdown（极简解释 ≤ 50 字）
3. 为什么学习 AI Agent 需要 Markdown 工具（1-2 个场景）
4. 工具全景一览（表格列出 5 款工具的定位和一句话简介）
5. 学习路径建议：新手从哪款入手
6. 相关资源推荐（可选）

写作风格要点（花叔式）：
- 开头直接说"这个模块干什么"，不铺垫
- 解释 Markdown 时用"它不是..."而是"..."句式的反转感
- "为什么需要"部分用一个具体场景切入（比如"你下载了一堆模型配置文件，打开一看全是乱码"）

篇幅：400-500 字

---

### Task 3: 编写 Obsidian 页面

**Files:**
- Create: `config/basics/15-markdown-reading-tools/01-obsidian.md`

- [ ] **编写 01-obsidian.md**

内容结构（按顺序）：
1. **一句话介绍**：Obsidian 是本地优先的个人知识管理工具，基于 Markdown，以"双向链接"为核心组织知识
2. **核心特点**（3-5 点 bullet）：
   - 本地文件存储，你的数据只属于你
   - 双向链接 + 图谱视图，让知识自动"联网"
   - 5000+ 社区插件，几乎能做任何事
   - 完全免费（商用也不花钱）
3. **下载与安装**（分平台）：
   - Windows: 官网 obsidian.md/download 下载 exe 安装包 / [待补充：国内镜像]
   - macOS: 官网下载 dmg / App Store 搜索 Obsidian
   - Linux: AppImage 或 Snap
   - 安卓/iOS: 官方应用商店下载
4. **快速上手**：创建第一个笔记 → 用 `[[` 建立链接 → 打开图谱视图
5. **核心功能速览**：
   - 文件管理器 vs 图谱视图的双重视角
   - 标签 + 文件夹 + 链接的三维组织方式
   - 插件市场里找几个必装插件
6. **优缺点**：诚实列出
   - 优点：本地安全、插件丰富、社区活跃
   - 缺点：同步需付费（Obsidian Sync）、有一定学习曲线

写作风格：篇幅最长（800-1000 字），有画面感的描述，比如"想象一下你的笔记不再是文件夹里一个个孤立的文档，而是像维基百科页面一样，点一下就跳转到另一个相关话题"

---

### Task 4: 编写 Logseq 页面

**Files:**
- Create: `config/basics/15-markdown-reading-tools/02-logseq.md`

- [ ] **编写 02-logseq.md**

内容结构（同模板）：
1. **一句话介绍**：Logseq 是开源的大纲式知识管理工具，以"块"为最小单位组织信息
2. **核心特点**：
   - 开源免费（MIT 协议）
   - 大纲式编辑，每一行都是一个"块"
   - 块级引用：可以精确引用到某一行内容
   - 本地优先，支持 Git 同步
   - 白板功能：可视化组织思路
3. **下载与安装**（分平台）：
   - Windows: 官网 logseq.com/downloads 下载安装包
   - macOS: 官网下载 dmg
   - Linux: AppImage
   - 安卓: GitHub Releases / F-Droid
   - iOS: App Store
   - [待补充：国内镜像]
4. **快速上手**：创建页面 → 用缩进写大纲 → 用 `/` 命令插入各种元素
5. **核心功能速览**：
   - Block 和 Page 的核心概念
   - 标签和命名空间的层级管理
   - 白板功能简介
6. **优缺点**

篇幅：600-800 字

---

### Task 5: 编写 MarkText 页面

**Files:**
- Create: `config/basics/15-markdown-reading-tools/03-marktext.md`

- [ ] **编写 03-marktext.md**

内容结构（同模板）：
1. **一句话介绍**：MarkText 是一款简洁优雅的开源 Markdown 编辑器，所见即所得
2. **核心特点**：
   - 三种编辑模式（源码/打字机/预览）
   - 实时渲染，所见即所得
   - 支持表格、代码块、数学公式等扩展语法
   - 极简界面，打开即用
   - 跨平台（Windows/macOS/Linux）
3. **下载与安装**：
   - GitHub Releases 下载安装包
   - [待补充：国内镜像]
4. **快速上手**：打开软件 → 打开一个 .md 文件或新建 → 直接开始写
5. **核心功能速览**：
   - 三种模式切换
   - 图片粘贴
   - 导出为 HTML 和 PDF
6. **优缺点**

篇幅：500-600 字

---

### Task 6: 编写 Joplin 页面

**Files:**
- Create: `config/basics/15-markdown-reading-tools/04-joplin.md`

- [ ] **编写 04-joplin.md**

内容结构（同模板）：
1. **一句话介绍**：Joplin 是开源跨平台的笔记应用，支持 Markdown 编辑和多端同步
2. **核心特点**：
   - 端到端加密，隐私安全
   - 支持多种同步方式（NextCloud、Dropbox、OneDrive、Joplin Cloud 等）
   - 内置待办事项管理
   - Web Clipper 浏览器插件（一键保存网页）
   - 丰富的插件和主题
3. **下载与安装**：
   - 官网 joplinapp.org 下载
   - GitHub Releases
   - App Store / Google Play
   - [待补充：国内镜像]
4. **快速上手**：安装 → 创建第一个笔记本 → 写笔记 → 添加标签
5. **核心功能速览**：
   - 笔记本 + 标签的组织体系
   - 待办事项
   - 搜索功能
   - 同步配置
6. **优缺点**

篇幅：500-600 字

---

### Task 7: 编写 Zettlr 页面

**Files:**
- Create: `config/basics/15-markdown-reading-tools/05-zettlr.md`

- [ ] **编写 05-zettlr.md**

内容结构（同模板）：
1. **一句话介绍**：Zettlr 是面向学术写作的免费开源 Markdown 编辑器，特别适合论文和长文写作
2. **核心特点**：
   - 支持学术引用，集成 Zotero 文献管理
   - CiteKey 引用补全
   - 支持导出为 Word、LaTeX、PDF 等学术格式
   - 内置代码高亮
   - 专注模式 + 黑暗模式
3. **下载与安装**：
   - 官网 zettlr.com/download 下载
   - GitHub Releases
   - [待补充：国内镜像]
4. **快速上手**：安装 → 创建一个新项目 → 写 Markdown → 导出为 Word
5. **核心功能速览**：
   - 引用与文献管理
   - 导出功能
   - 专注模式
6. **优缺点**

篇幅：500-600 字

---

### Task 8: 编写横向对比页

**Files:**
- Create: `config/basics/15-markdown-reading-tools/06-comparison.md`

- [ ] **编写 06-comparison.md**

内容：
1. **一句话开篇**：选工具不是选最好的，是选最合适的
2. **横向对比表**：

| 考量维度 | Obsidian | Logseq | MarkText | Joplin | Zettlr |
|---------|----------|--------|---------|--------|--------|
| 核心定位 | 双链知识管理 | 大纲式知识管理 | Markdown 编辑器 | 笔记同步应用 | 学术写作 |
| 编辑方式 | 普通编辑 | 大纲式(Outliner) | 所见即所得 | 分栏编辑 | 分栏编辑 |
| 上手难度 | ⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| 数据存储 | 本地文件 | 本地文件 | 本地文件 | 本地+云端 | 本地文件 |
| 插件生态 | 极其丰富 | 较丰富 | 较少 | 中等 | 中等 |
| 适合人群 | 知识工作者 | 结构化思维者 | 轻量编辑 | 多设备用户 | 学生/研究者 |

3. **选型建议**（花叔式直接推荐）：
   - 只读不写 → 选 MarkText，打开最快
   - 记笔记管知识 → 选 Obsidian，社区最大
   - 写论文搞学术 → 选 Zettlr，引文管理
   - 多设备同步 → 选 Joplin，免费同步
   - 喜欢结构化 → 选 Logseq，大纲式思维

篇幅：300-400 字

---

### Task 9: 更新 VitePress 配置

**Files:**
- Modify: `config/.vitepress/config.mts`

- [ ] **更新导航栏**

在 `nav` 的「基础知识」下拉菜单末尾新增：
```typescript
{ text: 'Markdown 阅读工具', link: '/basics/15-markdown-reading-tools/' },
```

- [ ] **更新侧边栏**

在 sidebar 的 `/basics/` 路径「基础型路径」items 末尾新增模块十五配置：
```typescript
{
  text: '模块十五：Markdown 阅读工具',
  collapsed: true,
  items: [
    { text: '模块介绍', link: '15-markdown-reading-tools/' },
    { text: 'Obsidian', link: '15-markdown-reading-tools/01-obsidian' },
    { text: 'Logseq', link: '15-markdown-reading-tools/02-logseq' },
    { text: 'MarkText', link: '15-markdown-reading-tools/03-marktext' },
    { text: 'Joplin', link: '15-markdown-reading-tools/04-joplin' },
    { text: 'Zettlr', link: '15-markdown-reading-tools/05-zettlr' },
    { text: '横向对比与选型', link: '15-markdown-reading-tools/06-comparison' },
  ]
},
```

- [ ] **验证配置正确**

Run: `pnpm run docs:build`
Expected: 构建成功，无报错

---

## 自检清单

1. **Spec 覆盖检查**：
   - ✅ 所有 5 个工具页面 + 1 个对比页 + 1 个 index 页 = 7 页
   - ✅ 统一模板（简介→核心特点→下载安装→快速上手→核心功能→优缺点）
   - ✅ 下载链接优先级策略（官网→GitHub→国内站→占位符）
   - ✅ 配置变更（导航栏 + 侧边栏）
   - ✅ 使用 huashu-perspective 写作风格
   - ✅ 使用 unified-search 预先搜索最新信息

2. **占位符检查**：无 TBD/TODO。`[待补充]` 是设计策略中明确允许的占位策略

3. **类型一致性检查**：所有文件路径、页面命名一致

4. **完整性检查**：每页内容结构明确，篇幅给定，关键内容点已列出
