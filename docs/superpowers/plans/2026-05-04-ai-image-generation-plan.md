# 模块十四：AI 图像生成模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `config/basics/14-ai-image-generation/` 下创建完整的 AI 图像生成学习模块（7 个 Markdown 文件），更新导航栏和侧边栏配置

**架构:** 6 章内容 + 1 模块首页，与模块 12（AI 视频生成）结构呼应，与模块 13（多模态 AI）互补

**Tech Stack:** VitePress (Markdown), pnpm

**内容优先级:** index → 01-overview → 05-prompt-and-creation → 02-main-platforms → 04-china-platforms → 03-open-source → 06-business-cases

---

### Task 0: 初始化目录与网络搜索

**Files:**
- Create: `config/basics/14-ai-image-generation/` (目录)

- [ ] **Step 0.1: 创建模块目录**

```bash
mkdir -p /Users/niean/Documents/project/awesome-study-agent/config/basics/14-ai-image-generation
```

- [ ] **Step 0.2: 网络搜索补充最新资料**

使用 unified-search 搜索以下信息，记录到临时文本供各章节参考：
- AI 图像生成 2025-2026 市场规模和用户数据
- Midjourney v6.1/v7 最新版本特性、定价
- DALL-E 3 当前集成方式、定价（含 ChatGPT/API）
- Adobe Firefly Image 3 最新功能、定价
- Stable Diffusion 3 / Flux 最新进展
- ComfyUI 2025-2026 版本状态
- ControlNet / LoRA / IP-Adapter 最新发展
- 通义万相、文心一格、即梦、可灵最新定价和功能
- 腾讯混元、MiniMax、智谱 CogView 最新动态

---

### Task 1: 模块首页 (index.md)

**Files:**
- Create: `config/basics/14-ai-image-generation/index.md`

**Style:** 与模块 12 首页结构保持一致（学习目标、章节表格、学习路径、适用人群）

- [ ] **Step 1.1: 编写 index.md**

内容结构：
1. 标题 + 学习目标（理解原理、熟悉平台、掌握提示词、能创作商业级图像）
2. 预计时间：4-6 小时，难度等级
3. 6 章结构表格（编号、主题、难度）
4. 章节概述段落（AI 绘画在 2026 年的地位）
5. 学习目标明细列表（理解、熟悉、实践、创作四个维度）
6. 适用人群 + 前置知识
7. 为什么学习 AI 绘画（创作门槛、效率提升、成本对比、创意自由）
8. 2026 年市场格局（市场规模、主流平台格局、技术成熟度表）
9. 核心挑战（技术局限、商业挑战、伦理问题）
10. 未来趋势（技术方向、应用方向、市场方向）
11. 学习路径（快速入门 30min / 深入掌握 3-5h / 专业应用）
12. 与其他模块的关联（指向模块 12 视频生成、模块 13 多模态 AI）
13. 学习检验（4 道思考题）
14. 导航链接 [← 返回基础模块] / [继续学习：AI 绘画概述 →]

**参考格式：** 模块 12 首页 `config/basics/12-ai-video-generation/index.md` 结构

**篇幅：** ~200 行

---

### Task 2: AI 绘画概述 (01-overview.md)

**Files:**
- Create: `config/basics/14-ai-image-generation/01-overview.md`

- [ ] **Step 2.1: 编写 01-overview.md**

内容结构：
1. 什么是 AI 绘画（定义、三大技术路径、与人类创作的区别）
2. 技术发展历程（萌芽/爆发/成熟/普及 四阶段，每阶段代表产品、能力、市场状态）
3. 2026 年行业格局（市场规模、主流平台对比表）
4. AI 绘画的核心能力边界（能做什么 / 暂时不能 / 需要警惕的）
5. 与 AI 视频生成的对比（技术异同、生态关系、综合工作流）
6. 本章小结 + 导航链接

**关键数据来源：** Task 0.2 的搜索记录

**篇幅：** ~300 行

---

### Task 3: 提示词工程与创作 (05-prompt-and-creation.md)

**Files:**
- Create: `config/basics/14-ai-image-generation/05-prompt-and-creation.md`

- [ ] **Step 3.1: 编写 05-prompt-and-creation.md**

内容结构：
1. 提示词基础（四要素框架：主体、环境、风格、参数；公式化表达）
2. Midjourney 提示词体系（基础结构、参数详解表、多提示词、Remix、Permutation、示例库）
3. Stable Diffusion 提示词体系（正面/负面、权重语法、Embedding、模板）
4. 风格控制进阶（风格类型库：摄影/艺术/质量/光照/构图关键词）
5. 工作流实战（文生图流程、图生图、局部重绘、图像扩展、ComfyUI 工作流示例）
6. 质量评判与常见问题（评估维度、问题诊断表、修复技巧）
7. 本章小结 + 导航链接

**篇幅：** ~500 行（最长章节，核心实践内容）

---

### Task 4: 主流平台详解 (02-main-platforms.md)

**Files:**
- Create: `config/basics/14-ai-image-generation/02-main-platforms.md`

- [ ] **Step 4.1: 编写 02-main-platforms.md**

内容结构：
1. Midjourney（定位、版本特性、定价、交互方式、参数体系、特色功能、优点/缺点、适用场景）
2. DALL-E 3（定位、集成方式、核心能力、限制、适用场景）
3. Adobe Firefly（定位、集成生态、核心技术、版权优势、适用场景）
4. Stable Diffusion 3 / Flux（SD3 特点、Flux 定位、开源 vs 商业对比）
5. 平台综合对比表（5 个维度：质量、提示词遵循、可定制性、版权、价格）
6. 各平台入门指引（快速开始步骤、免费试用方案）
7. 本章小结 + 导航链接

**版本和定价数据：** 参考 Task 0.2 搜索结果

**篇幅：** ~400 行

---

### Task 5: 中国 AI 绘画平台 (04-china-platforms.md)

**Files:**
- Create: `config/basics/14-ai-image-generation/04-china-platforms.md`

- [ ] **Step 5.1: 编写 04-china-platforms.md**

内容结构：
1. 通义万相（核心能力、定价、优缺点、适用场景）
2. 文心一格（核心能力、定价、优缺点、适用场景）
3. 即梦（核心能力、定价、优缺点、适用场景）
4. 可灵（核心能力、定价、优缺点、适用场景）
5. 腾讯混元（核心能力、定价、生态优势）
6. 其他值得关注的平台（MiniMax/智谱清言/星绘/美图 WHEE）
7. 中国 vs 国际平台对比总表（中文理解、质量、中国风、价格、商业版权）
8. 如何选择适合的平台（场景化选型建议）
9. 本章小结 + 导航链接

**功能和定价数据：** 参考 Task 0.2 搜索结果

**篇幅：** ~350 行

---

### Task 6: 开源生态与本地部署 (03-open-source.md)

**Files:**
- Create: `config/basics/14-ai-image-generation/03-open-source.md`

- [ ] **Step 6.1: 编写 03-open-source.md**

内容结构：
1. Stable Diffusion 生态谱系（模型代际演进、Flux 新势力、主流社区 Checkpoint、模型获取渠道）
2. 部署方案对比表（Auto1111 / ComfyUI / Fooocus / Forge / 云端方案，含推荐人群）
3. 各部署方案的安装要点和环境要求
4. 核心控制技术（ControlNet 各模型详解、LoRA 概念与使用、IP-Adapter、InstantID/Pulid）
5. 图像编辑与后处理（Inpainting / Outpainting / Upscaling / Batch 处理）
6. 本章小结 + 导航链接

**篇幅：** ~450 行

---

### Task 7: 商业应用与案例 (06-business-cases.md)

**Files:**
- Create: `config/basics/14-ai-image-generation/06-business-cases.md`

- [ ] **Step 7.1: 编写 06-business-cases.md**

内容结构：
1. 电商行业（产品图生成、模特换装、详情页 → 案例：上新效率提升 5 倍）
2. 广告营销（创意概念探索、社交媒体素材、品牌视觉 → 案例：提案时间从 3 天缩至 2 小时）
3. 游戏美术（概念设计、UI 素材、角色立绘 → 案例：独立团队全角色 LoRA 方案）
4. 建筑设计（外观效果图、室内设计、景观规划 → 案例：ControlNet + MJ 结构控制）
5. 影视与动漫（分镜设计、角色/场景概念 → 案例：前期探索成本降 60%）
6. 出版与文创（图书插画、封面设计、IP 衍生品 → 案例：AI 辅助绘本插画）
7. 应用选型参考表（按场景推荐工具和理由）
8. 本章小结 + 导航链接

**篇幅：** ~350 行

---

### Task 8: 更新导航栏与侧边栏配置

**Files:**
- Modify: `config/.vitepress/config.mts`

- [ ] **Step 8.1: 在导航栏追加 AI 图像生成链接**

在 nav 中 "基础知识" 下拉菜单的末尾（"多模态 AI 技术" 之后）添加：
```json
{ text: 'AI 图像生成', link: '/basics/14-ai-image-generation/' }
```

- [ ] **Step 8.2: 在侧边栏追加模块十四配置**

在 `sidebar['/basics/']` 的 "基础型路径" 下的 items 末尾（"多模态 AI 技术" 分组之后）添加新的侧边栏分组，包含 7 个子项（模块介绍 + 6 章）

- [ ] **Step 8.3: 验证构建**

```bash
cd /Users/niean/Documents/project/awesome-study-agent
pnpm run docs:build
```

Expected: 构建成功，无 404 链接错误
