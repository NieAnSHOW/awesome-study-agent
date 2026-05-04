# WorkBuddy 模块重写实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将模块十一（11-workbuddy/）的全部内容从虚构产品描述替换为腾讯真实 WorkBuddy 产品文档

**架构:** 保留 7 个文件结构（index + 6 章），全面替换内容。侧边栏配置中的"概览与关系澄清"改为"概览"

**Tech Stack:** VitePress Markdown

**设计文档:** `docs/superpowers/specs/2026-04-27-workbuddy-rewrite-design.md`

---

### Task 0: 更新侧边栏配置

**Files:**
- Modify: `config/.vitepress/config.mts:257`

- [ ] **将侧边栏标题"概览与关系澄清"改为"概览"**

```bash
# Edit line 257: { text: '概览与关系澄清', link: '11-workbuddy/01-overview' }
# Change to: { text: '概览', link: '11-workbuddy/01-overview' }
```

- [ ] **验证配置格式正确**

```bash
grep -n "11-workbuddy" config/.vitepress/config.mts
```

- [ ] **Commit**

```bash
git add config/.vitepress/config.mts
git commit -m "chore: 更新侧边栏 WorkBuddy 概览章节名"
```

---

### Task 1: 重写模块首页（index.md）

**Files:**
- Modify: `config/basics/11-workbuddy/index.md`

- [ ] **重写整个 index.md 文件**

内容要点：
- 学习目标：去掉 OpenClaw/EasyClaw 相关，改为"理解腾讯 WorkBuddy 定位 → 掌握 12 个真实场景 → 学会安装配置和远程操控"
- 前置知识：去掉模块 09/10 的强依赖
- 模块介绍：腾讯云 CodeBuddy 团队出品，2026 年 3 月 9 日上线，AI 原生桌面智能体工作台
- 章节列表：6 章，每章描述改为真实内容
- 学习检验：去掉 OpenClaw/EasyClaw 相关条目
- 扩展阅读：指向真实官网和文档

- [ ] **Commit**

```bash
git add config/basics/11-workbuddy/index.md
git commit -m "docs: 重写 WorkBuddy 模块首页，对齐腾讯真实产品"
```

---

### Task 2: 重写概览章（01-overview.md）

**Files:**
- Modify: `config/basics/11-workbuddy/01-overview.md`

- [ ] **重写 01-overview.md 文件**

内容要点：
- 删除所有 OpenClaw→EasyClaw→WorkBuddy 三层关系描述
- 删除四大设计原则（虚构内容）
- 新增真实产品定义：AI 原生桌面智能体工作台
- 核心能力：智能内容生成、本地信息自动化、外部信息调研、业务数据洞察
- 技术底座：CodeBuddy 自研架构，兼容 OpenClaw 技能
- 与 CodeBuddy/QClaw 的定位区别（腾讯 AI 矩阵）
- 多模型支持：混元/DeepSeek/GLM/Kimi/MiniMax
- IM 集成：企业微信/QQ/飞书/钉钉
- 适用场景与局限

- [ ] **Commit**

```bash
git add config/basics/11-workbuddy/01-overview.md
git commit -m "docs: 重写 WorkBuddy 概览章，替换虚构三层架构为真实产品介绍"
```

---

### Task 3: 重写通用办公案例章（02-office-cases.md）

**Files:**
- Modify: `config/basics/11-workbuddy/02-office-cases.md`

- [ ] **重写 02-office-cases.md 文件**

内容要点：
- 删除原 14 个虚构案例
- 按统一案例模板编写 3 个真实场景：

1. **本地文件批量整理**
   - 指令示例："帮我把桌面下载文件夹按类型（图片/文档/压缩包）自动分类归档"
   - 核心能力：本地文件操作、自动分类
   - 适用人群：所有职场人

2. **Excel 数据清洗与分析**
   - 指令示例："读取桌面的销售数据.xlsx，清洗空值和重复行，按部门汇总并生成柱状图"
   - 核心能力：数据分析、可视化
   - 适用人群：运营/销售/财务

3. **票据信息提取**
   - 指令示例："从 /财务/发票文件夹 中提取所有发票的金额、日期和发票号，汇总到 Excel"
   - 核心能力：OCR/多模态、数据提取
   - 适用人群：财务/行政

- 末尾添加「扩展思路」段落

- [ ] **Commit**

```bash
git add config/basics/11-workbuddy/02-office-cases.md
git commit -m "docs: 重写 WorkBuddy 办公案例章，替换为 3 个真实场景"
```

---

### Task 4: 重写市场销售案例章（03-marketing-cases.md）

**Files:**
- Modify: `config/basics/11-workbuddy/03-marketing-cases.md`

- [ ] **重写 03-marketing-cases.md 文件**

内容要点：
- 删除原 13 个虚构案例
- 按统一案例模板编写 3 个真实场景：

1. **行业调研报告**
   - 指令示例："帮我调研 2026 年 AI Agent 行业趋势，分析主要玩家和市场格局，生成调研报告"
   - 核心能力：信息搜索、文档生成
   - 适用人群：市场/战略/产品

2. **竞品分析**
   - 指令示例："搜索 A 产品和 B 产品的功能对比和用户评价，生成竞品分析报告"
   - 核心能力：信息聚合、对比分析
   - 适用人群：运营/产品/市场

3. **PPT 演示文稿制作**
   - 指令示例："基于上面的调研结果，生成一套 10 页左右的行业趋势宣讲 PPT，使用渐变风格"
   - 核心能力：PPT 生成、设计排版
   - 适用人群：所有需要做汇报的职场人

- 末尾添加「扩展思路」段落

- [ ] **Commit**

```bash
git add config/basics/11-workbuddy/03-marketing-cases.md
git commit -m "docs: 重写 WorkBuddy 市场案例章，替换为 3 个真实场景"
```

---

### Task 5: 重写技术研发案例章（04-tech-cases.md）

**Files:**
- Modify: `config/basics/11-workbuddy/04-tech-cases.md`

- [ ] **重写 04-tech-cases.md 文件**

内容要点：
- 删除原 14 个虚构案例
- 按统一案例模板编写 3 个真实场景：

1. **代码审查**
   - 指令示例："审查 /src 目录代码，找出潜在 bug 和性能问题，输出审查报告"
   - 核心能力：代码分析
   - 适用人群：开发者

2. **技术文档生成**
   - 指令示例："阅读项目的 README 和主要代码，生成一份 API 接口文档"
   - 核心能力：文档生成
   - 适用人群：开发者/技术写作

3. **日志自动化处理**
   - 指令示例："把 /logs 目录的所有 .log 文件按日期归档，压缩后移动到 /archive"
   - 核心能力：文件操作、脚本执行
   - 适用人群：运维/开发者

- 末尾添加「扩展思路」段落

- [ ] **Commit**

```bash
git add config/basics/11-workbuddy/04-tech-cases.md
git commit -m "docs: 重写 WorkBuddy 技术案例章，替换为 3 个真实场景"
```

---

### Task 6: 重写创意与设计案例章（05-creative-cases.md）

**Files:**
- Modify: `config/basics/11-workbuddy/05-creative-cases.md`

- [ ] **重写 05-creative-cases.md 文件**

内容要点：
- 删除原 11 个虚构案例
- 按统一案例模板编写 3 个真实场景：

1. **宣传海报生成**
   - 指令示例："为 WorkBuddy 做一个产品宣传海报，风格：渐变玻璃卡片，画幅 3:4"
   - 核心能力：多模态生成
   - 适用人群：设计/运营

2. **品牌文案创作**
   - 指令示例："根据这个产品介绍，写一篇 800 字左右的品牌故事，适合微信公众号发布"
   - 核心能力：内容生成
   - 适用人群：文案/市场

3. **内容矩阵规划**
   - 指令示例："帮我规划一个月的内容发布计划，包含主题、形式、发布时间表"
   - 核心能力：规划、文档生成
   - 适用人群：运营/新媒体

- 末尾添加「扩展思路」段落

- [ ] **Commit**

```bash
git add config/basics/11-workbuddy/05-creative-cases.md
git commit -m "docs: 重写 WorkBuddy 创意案例章，替换为 3 个真实场景"
```

---

### Task 7: 重写用前必读章（06-before-use.md）

**Files:**
- Modify: `config/basics/11-workbuddy/06-before-use.md`

- [ ] **重写 06-before-use.md 文件**

内容要点：
- 删除原 API Key 管理、文件范围限制、提示词调优等虚构内容
- 新增：

1. **安装与环境**
   - macOS 11.0+ / Windows 10+
   - 下载即用，免部署
   - 大小和系统要求

2. **积分体系**
   - 5000 Credits 新手福利
   - 每日签到、社区发帖、邀请好友获取方式
   - Credits 有效期提醒
   - 使用页面：https://www.codebuddy.cn/profile/usage

3. **多模型配置**
   - 内置混元/DeepSeek/GLM/Kimi/MiniMax 一键切换
   - 无需自备 API Key

4. **ClawBot 远程控制**
   - 微信/企业微信/钉钉/飞书接入设置
   - Bot ID 和 Secret 配置
   - 远程操控使用场景

5. **定时任务**
   - 每日/每周/一次性任务创建
   - 实用场景推荐（签到提醒、周报生成）

6. **安全注意事项**
   - 操作可审计、可追溯
   - 高风险命令拦截
   - 沙箱环境运行
   - 敏感操作需人工确认
   - 文件访问范围控制

7. **局限性说明**
   - 复杂任务稳定性有待提高
   - 小众专业软件兼容性有限
   - 技能生态仍在建设中
   - 付费订阅制（非免费）

- [ ] **Commit**

```bash
git add config/basics/11-workbuddy/06-before-use.md
git commit -m "docs: 重写 WorkBuddy 用前必读章，对齐真实产品的安装积分远程控制等特性"
```

---

### Task 8: 验证

- [ ] **启动开发服务器验证无构建错误**

```bash
pnpm run docs:build 2>&1 | tail -20
```

- [ ] **检查所有章节链接和侧边栏一致性**

```bash
grep -c "11-workbuddy" config/.vitepress/config.mts
```

- [ ] **检查目录文件完整性**

```bash
ls -la config/basics/11-workbuddy/
```

- [ ] **最终 Commit（如果构建修复了问题）**

```bash
git add -A
git commit -m "chore: 验证 WorkBuddy 模块重写完成"
```
