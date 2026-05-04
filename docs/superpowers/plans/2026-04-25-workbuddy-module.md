# 模块十一：WorkBuddy 数字员工实践 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在基础型路径中新增模块十一 WorkBuddy，包含概览、4 章案例库（52 个案例覆盖 30 种职业）和用前必读，同时更新侧边栏导航。

**Architecture:** 在 `config/basics/` 下新建 `11-workbuddy/` 目录，创建 7 个 Markdown 文件，遵循其他模块的文件命名和内容风格；更新 `config/.vitepress/config.mts` 的侧边栏配置。

**Tech Stack:** VitePress, Markdown (with vitepress-theme-teek custom containers)

**设计文档:** `docs/superpowers/specs/2026-04-25-workbuddy-module-design.md`

**参考文件:**
- `config/basics/10-openclaw/index.md` — index.md 的格式模板
- `config/basics/10-openclaw/01-openclaw-overview.md` — 章节文件格式模板
- `docs/superpowers/specs/2026-04-25-workbuddy-module-design.md` — 完整设计

---

### Task 1: 创建目录结构和模块首页

**Files:**
- Create: `config/basics/11-workbuddy/index.md`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p /Users/niean/Documents/project/awesome-study-agent/config/basics/11-workbuddy/
```

- [ ] **Step 2: 写入 index.md**

文件路径: `config/basics/11-workbuddy/index.md`

内容包含：模块介绍、学习目标、预计时间、难度等级、前置知识、章节列表（6 章）、学习检验清单、扩展阅读链接。

格式参考 `config/basics/10-openclaw/index.md`，使用同样的 vitepress-theme-teek 自定义容器（`::: tip`, `::: info` 等）。

- [ ] **Step 3: 提交**

```bash
git add config/basics/11-workbuddy/
git commit -m "docs: 创建模块十一 WorkBuddy 目录结构和首页"
```

---

### Task 2: 撰写第 1 章 - 概览与关系澄清

**Files:**
- Create: `config/basics/11-workbuddy/01-overview.md`

- [ ] **Step 1: 写入文件**

文件路径: `config/basics/11-workbuddy/01-overview.md`

内容结构：

```
# WorkBuddy 概览

> 学习目标、预计时间、难度等级

## 一、WorkBuddy 是什么

### 1.1 一句话定义
WorkBuddy 不是聊天机器人，是"数字员工"——能操控浏览器、读写本地文件、执行代码、调用 API、完成复杂多步骤工作流的 AI Agent。

### 1.2 核心能力图谱
表格展示十大能力：NLP/LLM 分析 (50+)、多步骤工作流编排 (40+)、本地文件读写 (35+)、API 调用 (30+)、浏览器自动化 (30+)、定时任务 (25+)、代码执行 (25+)、OCR/多模态 (20+)、向量检索/RAG (15+)、邮件自动化 (15+)

## 二、三层关系链（核心）

用 ASCII 图和类比解释 OpenClaw → EasyClaw → WorkBuddy 的关系：

```
OpenClaw（开源 Agent 运行时）→ EasyClaw（托管部署平台）→ WorkBuddy（AI 工作助手）
```

对比表格展示三者的角色、用户群、开源/商业属性差异。

## 三、四大设计原则

- **Desk-native（桌面原生）**：嵌入团队现有工作流
- **Workflow-aware（流程感知）**：保持上下文、步骤和输出可见
- **Review-ready（可审查）**：输出供人类审核
- **Human-in-the-loop（人在回路）**：最终决策权在人类

## 四、适用场景与局限

### 最适合
- 重复性、多步骤、跨系统的工作流
- 定时执行的自动化任务
- 数据整理、格式转换、报告生成

### 不太适合
- 需要实时创意协作的场景
- 复杂业务逻辑开发
- 低延迟实时交互

## 五、与其他工具的分工

与 Claude Code/Cursor、OpenClaw 的角色对比表格。

---

## 思考题

## 本节小结

## 页脚导航和脚注
```

首页和每章末尾都需要思考题和小结，格式参考现有模块。

- [ ] **Step 2: 提交**

```bash
git add config/basics/11-workbuddy/01-overview.md
git commit -m "docs: 完成模块十一第1章 概览与关系澄清"
```

---

### Task 3: 撰写第 2 章 - 通用办公案例

**Files:**
- Create: `config/basics/11-workbuddy/02-office-cases.md`

- [ ] **Step 1: 写入文件**

文件路径: `config/basics/11-workbuddy/02-office-cases.md`

内容包含 14 个案例，组织结构：

```
# 通用办公案例

> 学习目标、预计时间、难度等级

## 一、财务人员场景

### 案例 1：多源对账自动化
**场景说明**: 自动下载银行流水和 ERP 导出，逐笔匹配差异
**核心能力**: 定时任务 / 浏览器自动化 / 本地文件读写
**适用人群**: 财务人员

**示例对话**:
用户: "帮我核对上个月的对账单"
WorkBuddy: [执行过程和输出结果]

**输出效果**: 差异对账表和汇总报告

### 案例 2：发票自动归档
### 案例 3：税务政策速报

## 二、HR / 招聘场景

### 案例 4：简历自动化筛选
### 案例 5：入职包自动准备
### 案例 6：候选人面试调研

## 三、法务场景

### 案例 7：合同合规审查
### 案例 8：法律检索
### 案例 9：证照到期提醒

## 四、行政与运营场景

### 案例 10：资产自动化盘点
### 案例 11：差旅核算与分类
### 案例 12：桌面文件自动归类

## 五、采购与高管助理场景

### 案例 13：多源报价横评
### 案例 14：碎片邀约转日程

## 案例速查表

[汇总表格：案例编号、场景名称、核心能力、适用人群]

---

## 思考题

## 本节小结

## 页脚导航和脚注
```

每个案例包含：场景说明、核心能力、适用人群、示例对话、输出效果。

所有案例内容使用从 workbuddy.lol / awesome-workbuddy-use-cases 研究中获取的真实场景数据。

- [ ] **Step 2: 提交**

```bash
git add config/basics/11-workbuddy/02-office-cases.md
git commit -m "docs: 完成模块十一第2章 通用办公案例（14个场景）"
```

---

### Task 4: 撰写第 3 章 - 市场销售案例

**Files:**
- Create: `config/basics/11-workbuddy/03-marketing-cases.md`

- [ ] **Step 1: 写入文件**

文件路径: `config/basics/11-workbuddy/03-marketing-cases.md`

内容包含 13 个案例：

```
## 一、新媒体运营场景（3 个）
- 案例 15：爆款选题库
- 案例 16：多平台分发排版
- 案例 17：评论区情感分析

## 二、电商运营场景（2 个）
- 案例 18：差评监控预警
- 案例 19：竞品价格追踪

## 三、销售与公关场景（3 个）
- 案例 20：个性化"开场白"
- 案例 21：舆情监控预警
- 案例 22：通稿多版本转换

## 四、SEO 与客服场景（3 个）
- 案例 23：长尾词挖掘清洗
- 案例 24：工单情感打标
- 案例 25：话术库动态沉淀

## 五、市场调研场景（2 个）
- 案例 26：财报核心数据扒取
- 案例 27：前沿趋势翻译提炼

## 案例速查表
```

每个案例格式同 Task 3（场景说明、核心能力、适用人群、示例对话、输出效果）。

- [ ] **Step 2: 提交**

```bash
git add config/basics/11-workbuddy/03-marketing-cases.md
git commit -m "docs: 完成模块十一第3章 市场销售案例（13个场景）"
```

---

### Task 5: 撰写第 4 章 - 技术研发案例

**Files:**
- Create: `config/basics/11-workbuddy/04-tech-cases.md`

- [ ] **Step 1: 写入文件**

文件路径: `config/basics/11-workbuddy/04-tech-cases.md`

内容包含 14 个案例：

```
## 一、程序员场景（3 个）
- 案例 28：PR 自动审查
- 案例 29：技术文档同步
- 案例 30：分布式日志监控

## 二、产品经理场景（3 个）
- 案例 31：竞品分析报告
- 案例 32：PRD 自动补全
- 案例 33：反馈聚合

## 三、数据分析师场景（3 个）
- 案例 34：报表自动化
- 案例 35：异常数据检测
- 案例 36：SQL 自然语言查询

## 四、运维与架构场景（3 个）
- 案例 37：自动化环境搭建
- 案例 38：集群智能扩缩容
- 案例 39：数据库备份与加密

## 五、学术研究场景（2 个）
- 案例 40：文献批量扫读
- 案例 41：引文自动格式化

## 案例速查表
```

- [ ] **Step 2: 提交**

```bash
git add config/basics/11-workbuddy/04-tech-cases.md
git commit -m "docs: 完成模块十一第4章 技术研发案例（14个场景）"
```

---

### Task 6: 撰写第 5 章 - 创意与设计案例

**Files:**
- Create: `config/basics/11-workbuddy/05-creative-cases.md`

- [ ] **Step 1: 写入文件**

文件路径: `config/basics/11-workbuddy/05-creative-cases.md`

内容包含 11 个案例：

```
## 一、文案策划场景（3 个）
- 案例 42：爆款标题 A/B 组生成
- 案例 43：大型演讲结构搭建
- 案例 44：多语种创译

## 二、设计师场景（3 个）
- 案例 45：素材库自动整理
- 案例 46：竞品视觉巡检
- 案例 47：UI 设计稿转代码

## 三、视频创作场景（3 个）
- 案例 48：长视频自动"找梗"
- 案例 49：短视频混剪代理
- 案例 50：视频自动译制

## 四、创作者通用场景（2 个）
- 案例 51：Midjourney 提示词裂变
- 案例 52：全平台灵感碎片收集

## 案例速查表
```

- [ ] **Step 2: 提交**

```bash
git add config/basics/11-workbuddy/05-creative-cases.md
git commit -m "docs: 完成模块十一第5章 创意与设计案例（11个场景）"
```

---

### Task 7: 撰写第 6 章 - 用前必读

**Files:**
- Create: `config/basics/11-workbuddy/06-before-use.md`

- [ ] **Step 1: 写入文件**

文件路径: `config/basics/11-workbuddy/06-before-use.md`

内容结构：

```
# 用前必读

> 学习目标、预计时间、难度等级

## 一、安全注意事项

- API Key 管理（环境变量、不要硬编码）
- 限制作业可访问的文件范围
- 自动化操作权限边界（只读 vs 读写）
- 浏览器登录凭据安全

## 二、场景模板使用方法

- 步骤 1：找到对应职业或任务类型
- 步骤 2：复制场景描述
- 步骤 3：修改指令中的具体参数（公司名、人名、文件路径）
- 步骤 4：交给 WorkBuddy 执行
- 步骤 5：验证输出结果

## 三、提示词调优技巧

- 指令四要素：做什么、用什么工具、输出到哪、什么格式
- 常见失败原因排查
- 调试方法：先简化验证，再上复杂参数

## 四、从模板到自建工作流

- 什么时候该用 WorkBuddy vs 自己写代码
- 将已验证的模板组合成多步骤工作流
- 定期回顾和优化

## 五、局限性说明

- 复杂多步骤可能超时
- 浏览器自动化对反爬机制的限制
- 跨平台调用的稳定性考量

---

## 思考题

## 本节小结

## 页脚导航和脚注
```

- [ ] **Step 2: 提交**

```bash
git add config/basics/11-workbuddy/06-before-use.md
git commit -m "docs: 完成模块十一第6章 用前必读"
```

---

### Task 8: 更新侧边栏和导航配置

**Files:**
- Modify: `config/.vitepress/config.mts` (sidebar section, around line 236)

- [ ] **Step 1: 在模块十 OpenClaw 和模块十二之间插入 WorkBuddy 模块**

在 `config/.vitepress/config.mts` 中，找到模块十的结束位置（在 `10-openclaw` 的 items 闭括号后），在下一个模块（`12-ai-video-generation`）之前插入 WorkBuddy 模块配置：

```javascript
              {
                text: '模块十一：WorkBuddy 数字员工实践',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '11-workbuddy/' },
                  { text: '概览与关系澄清', link: '11-workbuddy/01-overview' },
                  { text: '通用办公案例', link: '11-workbuddy/02-office-cases' },
                  { text: '市场销售案例', link: '11-workbuddy/03-marketing-cases' },
                  { text: '技术研发案例', link: '11-workbuddy/04-tech-cases' },
                  { text: '创意与设计案例', link: '11-workbuddy/05-creative-cases' },
                  { text: '用前必读', link: '11-workbuddy/06-before-use' },
                ]
              },
```

- [ ] **Step 2: 验证配置语法**

```bash
cd /Users/niean/Documents/project/awesome-study-agent && npx vitepress build config --no-logs 2>&1 | head -20
```

预期输出：构建成功，无语法错误。

- [ ] **Step 3: 提交**

```bash
git add config/.vitepress/config.mts
git commit -m "chore: 更新侧边栏配置，添加模块十一 WorkBuddy"
```

---

### Task 9: 整体验证

**Files:**
- Verify: `/Users/niean/Documents/project/awesome-study-agent/config/basics/11-workbuddy/` 目录完整性
- Verify: 侧边栏配置正确
- Verify: 构建可通过

- [ ] **Step 1: 检查文件完整性**

```bash
ls -la /Users/niean/Documents/project/awesome-study-agent/config/basics/11-workbuddy/
```

预期看到 7 个文件：`index.md`、`01-overview.md`、`02-office-cases.md`、`03-marketing-cases.md`、`04-tech-cases.md`、`05-creative-cases.md`、`06-before-use.md`

- [ ] **Step 2: 构建验证**

```bash
cd /Users/niean/Documents/project/awesome-study-agent && npx vitepress build config
```

预期输出：构建成功，无警告错误。

- [ ] **Step 3: 如有失败，修复后重新构建**
