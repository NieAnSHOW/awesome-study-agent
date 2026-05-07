# Windsurf 与 Antigravity

> **学习目标**：了解 Windsurf 的 Cascade 引擎和 Antigravity 的特色功能
> **预计时间**：40 分钟
> **难度**：⭐⭐

---

## 一句话结论

Windsurf 是 Cursor 最强劲的对手。Cascade 引擎的 Flow 体验丝滑到令人上瘾——不是用 AI 补全代码，是 AI 感知你的光标位置、预判你的操作。Arena Mode 让你盲测模型，不被品牌偏见影响。2025 年被 Google 收购后路线图有变，但产品本身值得一试。不是更好的 Cursor，是另一个维度的选择。

## Windsurf 是什么

Windsurf 是 Codeium 出品的 AI 编辑器。跟 Cursor 一样从 VS Code fork 而来，但走了一条不同的路——**主打速度和体验**。

花叔的评价：Cursor 是"大而全"的瑞士军刀，Windsurf 是"快而美"的战术刀。两个都是好工具，只是哲学不同。

2024 年底，Windsurf 取代了老产品 Codeium。2025 年被 Cognition（Devin 母公司）收购，随后又被转入 Google 旗下。创始人 Varun Mohan 带着整个团队去了 Google DeepMind。

## Cascade 引擎

Cascade 是 Windsurf 的核心引擎，也是它区别于所有竞品的关键。

### Cascade 不是什么

Cascade 不是简单的"对话→生成代码"。它是一个多步骤的 Agentic 流程引擎：

```
你描述需求
    ↓
Cascade 分析项目结构
    ↓
制定执行计划
    ↓
多步骤自动执行
    ↓
实时展示进度
    ↓
你审查确认
```

**跟 Cursor Agent 的区别：**
Cursor Agent 偏"重"，一次任务可能改几十个文件，适合大规模操作。Cascade 偏"快"，分步执行、实时反馈，你随时可以介入调整。

花叔的比喻：Cursor Agent 是外包团队，说好需求一周后交付。Cascade 是结对编程的搭档，每写一行都跟你对齐。

### Flow 体验

Flow 是 Cascade 的交互方式，Windsurf 的杀手级特色。

**不是人跟机器的对话，是两个人结对编程。**

**传统 AI 编辑器的体验：**
1. 你打字
2. AI 回复
3. 你再打字

**Flow 的体验：**
1. 你打字
2. AI 感知你的光标位置，主动提供建议
3. 你移动光标，AI 跟随调整建议
4. AI 和你的操作无缝交替

**感受：** 像在跟一个人结对编程，不是在用工具。花叔第一次用 Flow 的时候说了一句话："这东西有毒，用了就回不去了。"

### Arena Mode — 盲测模型

Arena Mode 是 Windsurf 的独门功能。你提一个问题，两个匿名模型同时回答，你选更好的那个。

**不是比参数，是比输出。**

**为什么有用：**
- 不被品牌影响判断，纯粹看代码质量
- 发现你之前没注意到的强模型
- 对比不同模型的编程风格

**实测发现：** 很多时候小模型的表现不输大模型，帮你省钱。花叔在一个 React 项目中测试，本地小模型在简单 CRUD 场景中表现跟 GPT-5 差不多，但成本差 10 倍。

### Plan Mode — 结构化工作流

Plan Mode 让 Cascade 先规划再执行：

1. 你描述需求
2. Cascade 生成详细的执行计划
3. 你审查计划，可以调整
4. 确认后 Cascade 按计划逐步执行

适合复杂任务，不想让 AI"自由发挥"的场景。**不是让 AI 猜你想做什么，是让 AI 先告诉你它打算做什么，你同意再动手。**

### SWE-grep — RL 训练的代码搜索

Windsurf 用强化学习训练了专门的代码搜索模型 SWE-grep。比普通的 grep 和语义搜索更快、更准地找到相关代码。

**实际效果：** 在大型项目中搜索相关代码，SWE-grep 比传统方法快 3-5 倍。对 monorepo 特别有用。

## Google 收购后的变化

2025 年，Windsurf 被 Cognition 以约 $250M 收购。随后 Google 又从 Cognition 手中接手了 Windsurf 团队。

### 收购影响了什么

**正面：**
- 背靠 Google 资源，模型集成更深入
- Gemini 模型在 Windsurf 中有更好的优化
- 代码搜索能力继续增强（Google 最擅长的领域）

**负面：**
- 团队变动频繁，路线图不确定性增加
- 部分原有功能可能被调整
- 长期竞争力取决于 Google 的战略重心

花叔的判断：产品能力没问题，但长期方向不确定。如果你是 Windsurf 重度用户，建议同时保持对 Cursor 的关注。**不要把鸡蛋放在一个篮子里。**

### Antigravity 方向

Antigravity 是 Windsurf 团队在 Google 旗下推出的新方向。核心思路是：

**将 AI 编程从编辑器扩展到整个开发环境。**

不是帮你写代码，而是帮你管理整个开发流程——从需求理解、代码实现、测试验证到部署上线。

Antigravity 目前还比较早期，但方向值得关注。花叔观点：如果 Antigravity 做成了，AI 编程工具就不再是 IDE 插件了，而是"开发环境操作系统"。

## 定价

Windsurf 的定价经历了从免费到付费的演变：

| 版本 | 价格 | 包含内容 |
|------|------|---------|
| Free | $0 | 无限基础补全，每月 20-50 次高级 Cascade |
| Pro | $15/月 | 所有高级模型 + 500 prompt credits/月 |
| Team | 定制价格 | 团队管理和共享 |

**对比 Cursor：** Windsurf Pro（$15/月）比 Cursor Pro（$20/月）便宜 $5，但 Agent 能力弱于 Cursor。

花叔建议：如果 Cursor 的信用额制度让你预算吃紧，Windsurf Pro $15/月是不错的备选。

## 跟 Cursor 的差异对比

| 维度 | Windsurf | Cursor |
|------|----------|--------|
| **响应速度** | 更快（Flow 体验） | 稍慢但更深入 |
| **Agent 能力** | Cascade 分步执行 | Agent 模式 + Background Agent |
| **多文件编辑** | 支持 | Composer 2 更强 |
| **异步智能体** | 暂无 | Async Subagents |
| **模型选择** | Arena 盲测 | 多模型可选 |
| **价格** | $15/月 Pro | $20/月 Pro |
| **社区** | 较小但活跃 | 大且活跃 |
| **稳定性** | 收购后路线图不确定 | 稳定迭代 |
| **上手难度** | 低 | 中 |

**花叔的推荐：**
- 追求速度和体验 → Windsurf
- 追求功能和深度 → Cursor
- 预算有限 → Windsurf Pro（省 $5/月）
- 对 Google 生态信任 → Windsurf + Gemini 模型
- 想要最稳定的工具 → Cursor

## 快速上手

### 安装

1. 去 [windsurf.com](https://windsurf.com) 下载
2. 登录（Google/GitHub）
3. 导入 VS Code 配置

### 推荐设置

```json
{
  "windsurf.cascade.enable": true,
  "windsurf.flow.enable": true,
  "windsurf.arena.enable": true
}
```

### 快捷键

| 功能 | macOS | Windows |
|------|-------|---------|
| Cascade Chat | `Cmd + L` | `Ctrl + L` |
| Flow 触发 | `Cmd + I` | `Ctrl + I` |
| Arena Mode | `Cmd + Shift + A` | `Ctrl + Shift + A` |

## 常见问题

**Q: Windsurf 和 Cursor 选哪个？**
A: 试试两个的免费版。喜欢哪个就用哪个。功能上 Cursor 更强，体验上 Windsurf 更快。

**Q: 被收购后还值得用吗？**
A: 值得。产品能力没变，只是长期方向有不确定性。短中期没问题。如果你是重度用户，建议保持备选方案。

**Q: Free 版够用吗？**
A: 轻度使用够了。日常开发建议 Pro（$15/月），性价比很高。

**Q: Antigravity 什么时候能用？**
A: 还在早期阶段，Google 没有公布具体发布时间线。值得关注。

---

## 本节小结

- Windsurf 的 Cascade 引擎 + Flow 体验是它最大的差异化——不是更快，是更"懂你"
- Arena Mode 盲测模型很有趣，帮你发现性价比最高的模型
- 被 Google 收购后产品能力没问题，但路线图有不确定性
- 价格比 Cursor 便宜 $5/月，适合预算敏感的开发者
- Antigravity 代表了 AI 编程工具的下一个可能方向，值得关注

---

[← 返回章节目录](/agent-ecosystem/06-ai-coding-tools) | [继续学习：OpenAI Codex 与 Kiro →](/agent-ecosystem/06-ai-coding-tools/04-best-practices)
