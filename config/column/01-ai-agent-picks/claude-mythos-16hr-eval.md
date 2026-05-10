# 16 小时自主作战：Claude Mythos 为什么强到不敢发布

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" style="max-width:100%;height:auto;margin:20px 0;border-radius:12px;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <defs>
    <linearGradient id="bar1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="bar2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="bar3" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="bar4" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f472b6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- 背景网格 -->
  <g opacity="0.05">
    <line x1="160" y1="80" x2="160" y2="820" stroke="#fff" stroke-width="1"/>
    <line x1="310" y1="80" x2="310" y2="820" stroke="#fff" stroke-width="1"/>
    <line x1="460" y1="80" x2="460" y2="820" stroke="#fff" stroke-width="1"/>
    <line x1="610" y1="80" x2="610" y2="820" stroke="#fff" stroke-width="1"/>
    <line x1="760" y1="80" x2="760" y2="820" stroke="#fff" stroke-width="1"/>
  </g>

  <!-- 标题 -->
  <text x="400" y="55" text-anchor="middle" fill="#e2e8f0" font-size="24" font-weight="700" letter-spacing="2">AI Agent 自主工作时距演进</text>
  <text x="400" y="80" text-anchor="middle" fill="#64748b" font-size="14" letter-spacing="1">METR 50%-Time-Horizon 评估</text>

  <!-- Y轴标签 -->
  <text x="130" y="820" text-anchor="end" fill="#64748b" font-size="12">2023</text>
  <text x="130" y="695" text-anchor="end" fill="#64748b" font-size="12">2024</text>
  <text x="130" y="520" text-anchor="end" fill="#64748b" font-size="12">2025</text>
  <text x="130" y="240" text-anchor="end" fill="#64748b" font-size="12">2026</text>

  <!-- X轴网格线 -->
  <line x1="160" y1="810" x2="760" y2="810" stroke="#334155" stroke-width="1"/>
  <line x1="160" y1="680" x2="760" y2="680" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="160" y1="500" x2="760" y2="500" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="160" y1="220" x2="760" y2="220" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>

  <!-- X轴刻度标签（时距） -->
  <text x="180" y="835" fill="#64748b" font-size="11" text-anchor="middle">10min</text>
  <text x="310" y="835" fill="#64748b" font-size="11" text-anchor="middle">30min</text>
  <text x="460" y="835" fill="#64748b" font-size="11" text-anchor="middle">2h</text>
  <text x="610" y="835" fill="#64748b" font-size="11" text-anchor="middle">10h</text>
  <text x="755" y="835" fill="#64748b" font-size="11" text-anchor="middle">16h</text>

  <!-- Bar 1: GPT-4 (2023) - 10 min -->
  <rect x="160" y="795" width="20" height="15" rx="4" fill="url(#bar1)"/>
  <text x="190" y="808" fill="#94a3b8" font-size="13">GPT-4&ensp;<tspan fill="#3b82f6" font-weight="600">&lt;10 分钟</tspan></text>

  <!-- Bar 2: Claude 3 Opus (2024) - 30 min -->
  <rect x="160" y="665" width="40" height="15" rx="4" fill="url(#bar2)"/>
  <text x="210" y="678" fill="#94a3b8" font-size="13">Claude 3 Opus&ensp;<tspan fill="#0ea5e9" font-weight="600">~30 分钟</tspan></text>

  <!-- Bar 3: Opus 4.5 (2025) - 2h -->
  <rect x="160" y="485" width="120" height="15" rx="4" fill="url(#bar3)"/>
  <text x="290" y="498" fill="#94a3b8" font-size="13">Claude Opus 4.5&ensp;<tspan fill="#8b5cf6" font-weight="600">~2 小时</tspan></text>

  <!-- Bar 4: Mythos Preview (2026) - 16h -->
  <rect x="160" y="205" width="575" height="15" rx="4" fill="url(#bar4)" filter="url(#glow)"/>
  <text x="745" y="218" fill="#94a3b8" font-size="13" text-anchor="end">Claude Mythos Preview&ensp;<tspan fill="#ec4899" font-weight="700">≥ 16 小时</tspan></text>

  <!-- 置信区间线 (Mythos) -->
  <line x1="530" y1="210" x2="760" y2="210" stroke="#f472b6" stroke-width="2" stroke-dasharray="6,3" opacity="0.6"/>
  <text x="760" y="198" fill="#f472b6" font-size="10" opacity="0.7">95% CI: 8.5h – 55h</text>

  <!-- 箭头标注 -->
  <path d="M 735 195 L 750 190" stroke="#f472b6" stroke-width="1.5" fill="none" opacity="0.5"/>
  <path d="M 735 225 L 750 230" stroke="#f472b6" stroke-width="1.5" fill="none" opacity="0.5"/>

  <!-- 底部说明 -->
  <text x="400" y="875" text-anchor="middle" fill="#475569" font-size="11">来源: METR 评估数据 · Ethan Mollick @emollick · 2026.05</text>
</svg>

2026 年 5 月 9 日，Ethan Mollick 转发了一条来自 METR 的评估数据：Claude Mythos Preview 的 50%-time-horizon 达到了 **16 小时**，95% 置信区间 8.5 到 55 小时。

一个数字。但你不该只看数字，要看它打破了什么。

## 16 小时是什么概念

METR（Model Evaluation and Threat Research）是当前最权威的 AI 自主能力评估机构。它的 50%-time-horizon 指标衡量的是：一个模型在不依赖人类干预的情况下，能自主完成多长时间的复杂任务。

在这之前，主流模型的时距在 **30 分钟到 2 小时**之间。Claude Opus 4.5 的评估数据也没有突破这个范围。

16 小时意味着什么？

- 一场完整的渗透测试——从信息收集到漏洞利用到权限维持——可以全自动化完成
- 一个复杂的研究课题——从文献检索到实验设计到结果分析——可以交给 AI 独立执行
- 一个大型代码库的审计——从代码阅读到漏洞发现到修复建议——不需要人类醒来

人类的正常工作日上午 9 点到下午 5 点，扣掉午休和会议，真正的专注工作时间大约 **3-4 小时**。一个模型能自主工作 16 小时，已经超出了人类单日的有效工作时间。

这不是"更好的聊天机器人"。这是 **AI Agent 自主性的一次台阶式跨越**。

## METR 评估说了什么

关键不是 16 小时这个数字本身，而是 METR 在评估报告中的潜台词：**当前的评估框架已经不够用了**。

| 指标 | 数值 | 含义 |
|------|------|------|
| 50%-time-horizon | ≥ 16 小时 | 一半以上的复杂任务能自主完成 |
| 95% 置信区间下限 | 8.5 小时 | 最低估计也远超前代模型 |
| 95% 置信区间上限 | 55 小时 | 部分任务可能需要两天以上的连续工作 |
| 评估窗口 | 2026 年 3 月 | 早期版本，正式版可能更强 |

METR 的现有任务套件是为评测 1-4 小时的模型能力设计的。当模型跨越了 16 小时门槛，现有的评测任务变得"太简单"——模型有充足的时间规划、迭代、试错。

> 业界当前的评估体系，约等于用小学试卷考大学生。不是大学生太强，是试卷需要升级了。

## 不只是时距长——能力本身也变了

Claude Mythos Preview 的能力地图不只是"续航长"，它在网络安全领域的表现是**质的飞跃**。

### 27 年零日漏洞

OpenBSD——公认全球最安全的操作系统之一——存在一个 27 年未被发现的漏洞。Claude Mythos Preview 在不到 50 美元的计算成本内找到了它。

98 美元，挖出一个 27 年的零日漏洞。这个成本曲线让整个安全行业无法忽视。

### Project Glasswing

Anthropic 为这个模型启动了一个专门的安全项目 Project Glasswing。核心思路：

1. 用 Mythos 扫描全球最关键的软件基础设施
2. 主动发现并修复漏洞，而不是等黑客利用
3. 为整个行业建立新的安全实践标准

这个项目的存在本身就是一个信号：**Anthropic 不是在"担心"模型的网络安全能力，而是在用它做实事**。

### Red Team 报告的关键结论

Anthropic 的 Red Team 报告有几个不常被引用的细节：

- **零门槛效应**：非安全专业背景的人，使用 Mythos 也能完成基础的网络攻击。这不是"给黑客的工具"，这是"给所有人的攻击工具"
- **端到端攻击能力**：模型能独立完成从小型企业网络的侦察到渗透的完整攻击链
- **漏洞发现量 > 99% 未修复**：报告披露时，99%+ 的已发现漏洞还没有补丁——公开细节可能造成更大危害

## 为什么 Anthropic 决定不公开发布

这是最反直觉也最值得聊的部分。

从商业角度看：不发布最强模型 = 放弃收入。Claude Opus 4.6 是 Anthropic 的主力收入模型，Mythos Preview 比它更强，但 Anthropic 选择不卖。

从产品思维看，这个决策其实不复杂——**锚定用户，而不是锚定功能**。

大部分 AI 公司的产品逻辑是：模型能力越强 = 产品越好 = 卖得越贵。这是功能锚定。

Anthropic 的逻辑是：用户的信任 = 产品能持续存在 = 长期价值。这是用户锚定。

如果 Mythos 的能力在安全领域被滥用，受损的不只是"这个模型"的声誉，而是 **Anthropic 整个品牌的安全可信度**。在大模型军备竞赛中，可信度是最难建立的资产。

### 另一个视角：最危险的类比

这个决定有个不太让人舒服的类比：**核材料**。

你不是因为铀-235 的物理性质"危险"就不研究它。你研究它、理解它、用它发电——但你不把它放在超市货架上。

Mythos 的能力性质决定它不是消费品。它是基础设施级的工具，需要基础设施级的安全措施。

| 类比维度 | 核材料 | 超级 AI 模型 |
|---------|--------|------------|
| 核心价值 | 清洁能源 | 自主智能 |
| 潜在风险 | 核扩散/污染 | 自动化攻击 |
| 控制手段 | 许可制+国际监管 | 有限发布+Project Glasswing |
| 不可逆性 | 污染持久 | 一旦开源无法回收 |
| 类比决定 | 不公开流通 | 不公开发布 |

这个类比有争议——很多人会觉得"过于夸张"。但在 Anthropic 内部，这个类比是真实存在的讨论框架。

## 对独立开发者和 AI 工具生态的启示

这件事离普通人远吗？不那么远。

### 你的 AI 工具可能比你以为的强

Claude Code、Cursor、Copilot——这些日常编程工具背后的模型也在快速进化。16 小时自主执行可能听起来是"前沿模型的事"，但这个曲线的斜率在加速。

回顾时间线：

| 时间 | 里程碑 | 风险时距 |
|------|--------|---------|
| 2023 年初 | GPT-4 发布 | < 10 分钟 |
| 2024 年 | Claude 3 Opus | ~30 分钟 |
| 2025 年 | Claude Opus 4.5 | ~2 小时 |
| 2026 年 3 月 | Claude Mythos Preview | ≥ 16 小时 |

每代模型的时距大约翻一个数量级。这个趋势没有停下。

### 如何用长时距 Agent

长时距 Agent 不是"更耐心地聊天"，它的产品形态完全不同：

- **过夜任务**：下班前提交一个任务，第二天早上看到完整输出——不再需要实时交互
- **多轮迭代**：Agent 可以自己写代码、跑测试、看错误、改代码、再跑测试——形成一个完整的闭环
- **复杂项目分解**：16 小时的时间窗口允许 Agent 把大问题拆成子问题、规划路径、逐步执行

从现在开始，设计 AI 工作流时应该考虑一个前提：**Agent 可能可以保持数小时的有效状态，不需要每次都从头开始**。记忆管理、上下文规划、任务分解——这些能力会随着时距的延长而越来越重要。

### 安全意识的必要性上升

如果最强模型的能力可以用于网络攻击，那么普通开发者的代码也可能成为攻击目标。不是让你恐慌，但安全意识——代码审计、依赖管理、最小权限原则——正在从"好习惯"变成"必需品"。

## 产品思维的思考：不发布是最优解吗？

回到最初的问题："能力太强所以不发布"这个逻辑成立吗？

从短期看，成立。从长期看，**不成立**。

6 个月内，不发布保护了 Anthropic 的品牌，避免了潜在的安全灾难，展现了企业责任感。这是理性的。

12-18 个月后，市场会有竞争。如果其他公司（或者开源社区）推出了同等能力的模型——而且发布了——Anthropic 的"不发布"策略就从"负责任"变成了"失去先发优势"。

一个朴素的产品规则：**你可以选择不做一个功能，但不能选择别人不做**。

Project Glasswing 的高明之处在于，它把"不发布"这个防御决策变成了一个主动行动——用模型的能力去加固安全防御，而不是把模型藏起来。这是在争取时间：在模型广泛可用之前，先把防御体系建好。

这是产品策略，不是道德声明。

## 写在最后

16 小时不是一个终点标记。评估框架的上限是 55 小时——我们甚至不知道这个模型的真实上限在哪。

这不是在预测末日。这是在说：**当一个工具的能力超过了你对它的理解速度，你的使用方式需要改变**。

AI 产品的下一步不是更强的模型，而是更好的"缰绳"——一套能让用户安全、可控地使用强大能力的工程体系。这才是当下最有价值的命题。

**能力的上限不是模型参数，是我们对它的驾驭能力。**

---

### 参考资料

- [Assessing Claude Mythos Preview's cybersecurity capabilities - Anthropic](https://red.anthropic.com/2026/mythos-preview)
- [Ethan Mollick on LinkedIn: Claude Mythos Raises Security Risks](https://www.linkedin.com/posts/emollick_assessing-claude-mythos-previews-cybersecurity-activity-7447345299989217281-Q1ep)
- [Claude Mythos Preview hits 16hr eval window - Blockchain.News](https://blockchain.news/ainews/claude-mythos-preview-hits-16hr-eval-window)
- [Claude Mythos #2: Cybersecurity and Project Glasswing](https://thezvi.substack.com/p/claude-mythos-2-cybersecurity-and)
- [Anthropic 内部报告首次披露：最强 AI 模型为何"对齐最好"却"风险最高" - 知乎](https://zhuanlan.zhihu.com/p/2029219152905222091)

### 检验标准

- [ ] 能解释 METR 50%-time-horizon 的含义和意义
- [ ] 理解 Claude Mythos Preview 在网络安全领域的特殊能力
- [ ] 能分析 Anthropic 不公开发布 Mythos 的决策逻辑
- [ ] 理解长时距 Agent 对产品设计和工作流的影响
- [ ] 能用自己的话解释"能力的上限不是模型参数，是我们对它的驾驭能力"
