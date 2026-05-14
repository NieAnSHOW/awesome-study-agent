# MiMo V2.5 Pro 登顶 DesignArena 开源前三：手机厂造的大模型，为什么让硅谷坐不住了

![](https://www.marktechpost.com/wp-content/uploads/2026/04/blog-1-14.png)

2026 年 5 月 14 日，DesignArena 官方账号发了一条推文：**MiMo V2.5 Pro（Thinking）在开源模型总排行榜上拿到第三名**，比非 Thinking 版本一口气蹿升了 8 个名次。在前端编码任务上，它和 Claude Sonnet 4.6 打了个平手。

DesignArena 不是什么野鸡榜。它是全球第一个面向真实设计任务的 AI 评测平台，靠 370 万+ 创作者的人头投票说话——盲测对比，谁生成的代码更好用，谁就排前面。不是跑固定测试集，不是刷分，是真刀真枪的人类偏好。

![](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2FXwWMU8OIL95yCkWKc3gJU%2Fd507611fda1c4b9e22b33dee48861452%2FHG7fjt8agAAuBQm.jpg%3Fw%3D1000%26q%3D100&w=3840&q=75)

一个做手机的公司，在大模型设计编码这个最硬核的赛道上，站到了开源世界的领奖台。这件事值得拆开看。

## 先搞清楚 MiMo V2.5 Pro 是什么

小米 4 月 22 日发布，4 月 27 日开源，MIT 协议。

核心参数：

| 维度 | 数据 |
|------|------|
| 总参数量 | 1.02T（万亿级） |
| 激活参数 | 42B |
| 架构 | MoE（混合专家）+ 混合注意力 |
| 上下文窗口 | 原生 100 万 Token |
| 定价 | $1 输入 / $3 输出（每百万 Token） |

几个数字直接对标：**SWE-bench Pro 57.2%，超过 Claude Opus 4.6 的 53.4%**，和 GPT-5.4 的 57.7% 只有 0.5 个百分点的差距。在 ClawEval 上用 70K Token 达到 64% Pass³，比 Claude Opus 4.6、Gemini 3.1 Pro、GPT-5.4 **省 40-60% 的 Token**。

输出价格是 Claude Opus 4.6 的 1/8。

这不是"接近"的叙事，这是正面硬刚的数据。

![](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2FXwWMU8OIL95yCkWKc3gJU%2Fd507611fda1c4b9e22b33dee48861452%2FHG7fjt8agAAuBQm.jpg%3Fw%3D1000%26q%3D100&w=3840&q=75)

## DesignArena 第三名意味着什么

先说这个排名的含金量。

DesignArena 用的是 Bradley-Terry 模型算 Elo 分。不是让模型跑几道固定题，是让真人设计师看两个模型生成的代码，盲选哪个更好。这和 Chatbot Arena 一个逻辑——靠人头投票，不是靠跑分刷榜。

MiMo V2.5 Pro 在**前端编码任务**上达到了 Claude Sonnet 4.6 的性能水平。前端编码是什么概念？这是 AI 编程里最讲"审美"的领域——不是能不能跑的问题，是好不好看、交互合不合理、代码能不能直接交付的问题。

在 DesignArena 的排行体系里，前端编码一直是 Anthropic 的绝对主场。Claude Opus 4.6 在 3 月份的评测中横扫了网页开发、3D 设计、游戏开发、数据可视化几乎所有前端品类。能在这个主场和 Sonnet 4.6 打平，说明 MiMo V2.5 Pro 的代码生成不只是"能用"，而是到了"好看且好用"的层次。

Thinking 版本比非 Thinking 版本提升了 8 个名次，这说明什么？MiMo 的推理能力（chain-of-thought）不是花架子，在真实编码任务中确实能转化为质量提升。

## 三个 Demo：不是跑分，是干活

小米在发布时给了三个真实 Demo，不是精心设计的 benchmark case，是让模型自己干完整项目：

**Demo 1：SysY 编译器（Rust）**

参考北大编译原理课设——实现一个完整的 SysY 编译器，包括词法分析、语法分析、AST、Koopa IR 代码生成、RISC-V 汇编后端和性能优化。正常情况下北大计算机专业的学生要花几周。MiMo V2.5 Pro 用了 **4.3 小时、672 次工具调用，满分 233/233**。

有意思的不是满分，是过程：它先搭好整个流水线骨架，第一次编译就过了 137/233 个测试——说明架构设计在第一轮就是对的。中间第 512 轮重构导致部分测试回退，它自己诊断、修复、继续推。不是瞎试，是有结构的工程行为。

**Demo 2：桌面视频编辑器**

一个完整的多轨道时间线、剪辑、交叉淡入淡出、音频混合、导出管线的桌面应用。最终代码 **8192 行、1868 次工具调用、11.5 小时**自主完成。

**Demo 3：模拟电路 EDA 设计**

在 TSMC 180nm 工艺下从零设计 FVF-LDO 稳压器。这个任务通常需要电子工程硕士级别的专业知识。模型接上 ngspice 仿真环路，一个小时左右完成闭环迭代，六项指标全部达标，其中四项关键指标比初始方案提升了一个数量级。

![](https://www.marktechpost.com/wp-content/uploads/2026/04/Screenshot-2026-04-22-at-8.34.28-PM.png)

## Token 效率：这才是真正的杀手锏

跑分高不稀奇，稀奇的是跑分高的同时还省钱。

ClawEval 上的数据：MiMo V2.5 Pro 达到 64% Pass³，每条轨迹大约消耗 70K Token。同等级别的分数，Claude Opus 4.6 要用 140K+，GPT-5.4 也要 140K+。

**少用 40-60% 的 Token，意味着账单直接砍半甚至更多。**

这对跑 Agent 的人来说是实打实的区别。现在 GitHub Copilot 已经全面转向按 Token 计费，Cursor、Claude Code 这类工具的 Token 消耗更是一个月比一个月高。一个 1000+ 轮工具调用的长程任务，用 Opus 跑和用 MiMo 跑，成本差可能是一个数量级。

小米官方把 MiMo V2.5 Pro 定位为 Claude Code、OpenCode、Kilo 的 drop-in 替代。什么意思？你不需要改任何代码，把模型 ID 换一下就行。对于 Token 账单已经很高的团队来说，这是一个不需要任何迁移成本的降本方案。

![](https://www.marktechpost.com/wp-content/uploads/2026/04/Screenshot-2026-04-22-at-8.37.35-PM.png)

## MIT 协议：不是"开放"，是"自由"

这一点很多人没意识到有多重要。

MiMo V2.5 Pro 用的是 **MIT 协议**。不是"开放权重但有限制"，不是"非商业使用请授权"，是最宽松的开源协议。你可以：

- 拿去商用，不用跟小米打招呼
- 在自己数据上微调，发布衍生模型
- 部署到私有云或本地服务器
- 没有收入上限，没有用户数限制

对比一下：很多号称"开源"的模型用的是自定义协议，加了各种"可接受使用政策"、收入天花板、商业授权门槛。MIT 意味着小米在说：这个东西就是公共设施，你们随便用。

对企业来说，这意味着合规成本为零。不用法务审核，不用风险评估，直接下权重、部署、干活。

## 为什么说硅谷该紧张了

不是因为小米的模型比谁强了 0.5 分，是因为这家公司的迭代速度和资源投入量。

看时间线：

- 2025 年 12 月：发布 MiMo V2-Flash
- 2026 年 3 月：发布 V2 系列（Pro / Omni / TTS 三件套）
- 2026 年 4 月 22 日：发布 V2.5 系列
- 2026 年 4 月 27 日：全面开源
- 2026 年 5 月 14 日：DesignArena 开源模型第三名

**从 V2 到 V2.5 登顶，只用了 36 天。**

雷军宣布未来三年在 AI 领域投入超过 600 亿元。这不是画饼，小米在 AI 上的发布节奏已经证明了钱在快速变成能力。

更值得注意的是这个信号：中国大模型已经从"追赶"进入了"并跑甚至领跑"的阶段。Artificial Analysis 的全球排行榜上，前十里中国模型占了六席。小米作为一家手机厂，成了全球第一个在开源大模型综合榜单登顶的手机公司。

小米 MiMo 项目负责人罗福莉（前 DeepSeek 核心成员）在 X 上说了一句话："A model's value isn't measured by rankings alone — it's measured by the problems it solves."

这句话本身就是一种姿态：我们不跟你刷榜，我们解决实际问题。

## 对独立开发者意味着什么

三个字：**有的选了。**

在此之前，如果你要跑 Claude Code 做 Agent 开发，你的模型选择基本锁定在 Claude 系列。现在你有了一个 MIT 协议、开源可部署、Token 效率极高、SWE-bench Pro 分数超过 Opus 4.6 的替代品。

具体场景：

- **Claude Code 用户**：切换模型 ID 就行，Token 成本直接砍半起步
- **需要私有部署的团队**：MIT 协议，下载权重，部署到自己的服务器，数据不出域
- **预算有限的独立开发者**：$1/$3 的定价，比 Opus 4.6 的 $5/$25 便宜 8 倍

不是每个场景都适合替换——在深度推理、Desktop Computer Use 等方面 GPT-5.4 仍然领先。但对于编码 Agent 这个当下最热的使用场景，MiMo V2.5 Pro 已经是一个严肃的选择。

## 写在最后

小米造手机、造车、造大模型。这三个业务放在一起看，"人车家"的生态闭环已经很明显了——823M+ 的 IoT 设备、HyperOS 操作系统、SU7 和 YU7 汽车，所有这些都需要一个足够强的大脑。

MiMo V2.5 Pro 不只是一个模型，它是小米整个"人车家"生态的智能底座。这个底座能不能持续跑赢专业的 AI 公司，取决于小米能不能保持这个迭代速度。但至少现在，他们已经证明了一件事：**大模型不是互联网巨头的专属游戏。** 一个手机厂，只要投入足够、节奏够快、方向够准，也能站在开源 AI 的最前沿。

OpenClaw、Hermes Agent、Claude Code——这些 Agent 框架的背后，正在快速形成一个多模型供给的市场。MiMo V2.5 Pro 的出现，让这个市场的竞争变得更激烈了。对开发者来说，竞争永远是最好的消息。

---

*参考来源：[DesignArena 官方推文](https://x.com/Designarena/status/2054776484833952000)、[小米 MiMo 官方页面](https://mimo.xiaomi.com/mimo-v2-5-pro/)、[MarkTechPost 报道](https://www.marktechpost.com/2026/04/22/xiaomi-releases-mimo-v2-5-pro-and-mimo-v2-5-matching-frontier-model-benchmarks-at-significantly-lower-token-cost/)、[VentureBeat 报道](https://venturebeat.com/technology/open-source-xiaomi-mimo-v2-5-and-v2-5-pro-are-among-the-most-efficient-and-affordable-at-agentic-claw-tasks)、[BuildFastWithAI 评测](https://www.buildfastwithai.com/blogs/xiaomi-mimo-v2-5-pro-review-2026)、[Artificial Analysis 数据](https://artificialanalysis.ai/models/mimo-v2-5-pro/providers)*
