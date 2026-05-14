# Kimi WebBridge：一个浏览器扩展，让所有 AI Agent 共用同一双「真手」

![](https://lh3.googleusercontent.com/ng9i0ytggyHTzBUxJqyknv1EFNqoJ9UGXIIMZI3b0fpfNwLDzaXChcswrs84eueKCJBijKPkcdEH1XX6AIq1O0JWZQ=s120)

如果你的 Claude Code 能像人一样打开浏览器、点击按钮、填表单——而且不需要任何 API 对接、不用过 OAuth、不用处理登录态——你觉得值多少钱？

Kimi 刚给出的答案是：**免费，装个浏览器扩展就行。**

## 这不是又一个「AI 浏览器插件」

先搞清楚 Kimi WebBridge 到底是什么。

它不是那种帮你浏览网页的 AI 助手。它是一根**桥**——一头连着你的真实浏览器（Chrome 或 Edge），另一头连着你的 AI Agent（Claude Code、Cursor、Codex、Hermes、OpenClaw、Kimi Code，随便你用什么）。

工作原理很简单：

```
AI Agent → 本地桥接服务 → Chrome DevTools Protocol → 你的真实浏览器 → 操作结果返回
```

Agent 发指令给本地服务，本地服务用 CDP 协议操作你的浏览器——打开网页、点击、滚动、填表单、截图、读取页面内容。所有操作都在你本机执行，**用你浏览器里已经登录的会话**。

这是整件事最聪明的地方。

## 第一个差异点：它不管你用什么 Agent

现在市面上的 AI 浏览器方案，基本是一个模型配一个扩展：

- **Codex Chrome Extension** —— 只给 Codex 用
- **Claude for Chrome** —— 只给 Claude 用
- **Chrome MCP Server** —— 给所有 MCP 客户端用，但需要自己配置

Kimi WebBridge 选了第三条路：**Agent 无关**。

它明确支持的 Agent 列表包括 Claude Code、Cursor、Codex、Hermes、OpenClaw、Kimi Code。既不是你自家的 Kimi Code 独占，也不是只给最火的 Claude Code 用——谁都能接。

这是一个产品决策，更是一个**哲学决策**。

![](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop)

做 AI 基础设施的人和做 AI 应用的人，区别在哪？做基础设施的人不在乎你用谁的模型，他在乎的是你能不能在他的基础上干活。做应用的人只希望你在他的生态里干活。

Kimi 在这里选了前者的定位。一个浏览器桥，谁都能接。这比 OpenAI 和 Anthropic 的封闭策略更聪明——**封闭策略赢得当下，开放策略赢得生态**。

## 第二个差异点：它直接借用了你的登录态

这是 WebBridge 最核心的价值，也是我认为它最具杀伤力的一点。

AI Agent 为什么很难真正「用」网页？本质原因不是技术能力不够，是**登录态**。

企业内部的 SaaS 后台、管理工具、数据分析平台——这些真实世界的业务系统，共同特征是什么？要登录。OAuth 流程、MFA 验证、IP 白名单、SSO 跳转……你让人家 API 去调用，先走完三个月权限审批流程再说。

Kimi WebBridge 的解法极其简单粗暴：**不调 API，直接用你的 Chrome 会话。**

你在浏览器里登了 Salesforce、Gmail、钉钉后台、飞书管理面板——WebBridge 不关心这些网站具体是什么认证方式，它就用你已经登录的 Cookie 和会话去做事。Agent 发一个「帮我查一下本月销售数据」，WebBridge 打开你的 Salesforce 页面，以你的身份登录状态进去干活。

这相当于什么？**把 AI Agent 的身份验证问题，从工程问题变成了安装问题。**

## 隐私方面：本地执行，不走云端

Kimi 做对了一件事：**WebBridge 的所有操作都在本地。**

数据和操作流程是这样的：

- Agent 发指令 → 本地桥接服务接收 → CDP 协议控制你的浏览器 → 结果返回 Agent
- **没有任何一个环节的数据必须经过 Kimi 的服务器**
- 所有截图、页面内容、表单输入，都在你自己的设备上流转

这个设计对个人开发者来说可能感觉不明显，但对团队和企业用户来说，是上线的必要条件。特别是金融、医疗、合规敏感的场景——「数据不出本地」是底线，不是加分项。

## 和几个竞品放在一起看

| 方案 | 费用 | 需要什么 | 支持 Agent | 数据 |
|------|------|---------|-----------|------|
| **Kimi WebBridge** | 免费 | 装 Chrome 扩展 | Claude Code、Cursor、Codex、Hermes、OpenClaw、Kimi Code | 本地执行 |
| **Codex Chrome 扩展** | Codex 订阅 | Codex 桌面端 | 仅 Codex | OpenAI 服务器 |
| **Claude for Chrome** | Claude 订阅 | Claude 桌面端 | 仅 Claude | Anthropic 服务器 |
| **BrowserBridge (开源)** | 免费 | npm 全局安装 + 扩展 | 通用 MCP | 本地执行 |
| **Chrome MCP Server** | 免费 | 自己配 + 命令行 | 通用 MCP | 本地执行 |

Kimi WebBridge 在这张表里的位置很微妙：它既像 BrowserBridge 那样开箱即用（装个扩展就行），又保持了像本地方案那样的数据隐私，同时兼容性做得最好——**你没看错，Claude Code 和 Codex 都能用 Kimi 做的浏览器桥**。

## 为什么这件事值得关注

**第一，「桥」模式的杀伤力比「独占」大得多。**

OpenAI 做 Chrome 扩展只给 Codex 用，Anthropic 做 Chrome 集成只给 Claude 用。每一家都在建围墙。Kimi 的做法是：我把桥修好，你们谁都能过。用户装一个扩展，手里所有的 Agent 都能开浏览器干活——这种使用成本，远低于「每家装一个」。

**第二，登录态是 AI Agent 真实落地的最后一公里，WebBridge 直接跑完了。**

如果你自己做过 Agent 接入网页的尝试，应该知道最大的坑是什么：不是模型不会用浏览器，是网站不肯让你用。验证码、登录态、反爬机制——每一个都是大坑。WebBridge 借用了你真实浏览器的环境和会话——对这些阻碍天然免疫。

**第三，Kimi 在从模型公司转型为 Agent 基础设施公司。**

K2.5 / K2.6 确实是不错的模型，但 Kimi Code、Kimi Claw、Kimi WebBridge 这一套组合拳打出来，意图已经很明显了：不满足于卖模型 API，要做 Agent 时代的操作系统层。

WebBridge 是这个战略里很关键的一环——它是去品牌化的基础设施工具，而不是 Kimi 生态的专属配件。

## 当前限制

也得说实话，不是所有东西都完美。

**浏览器兼容问题**：目前只支持 Chrome 和 Edge 的桌面版。Arc、Brave、Vivaldi 这些 Chromium 内核的浏览器没明确支持，Safari 和 Firefox 就更不用想了。

**需要一个桌面 Agent**：WebBridge 本身是个桥，不是个 Agent。你得先有一个能跑在本地终端的 AI Agent（Claude Code、Codex、Kimi Code 等），才能用 WebBridge 给它接上浏览器。对于纯粹用 ChatGPT Web 版的用户来说，这个门槛存在。

**权限范围较广**：既然要操作浏览器，Chrome 扩展的权限自然不小——「读取和修改所有网站数据」「管理标签组」等。虽然 Kimi 声称数据不走云端，但扩展本身的权限边界是很大的，安全敏感场景需要自行评估。

**仍在早期阶段**：Chrome Web Store 显示 1 万+ 用户，版本 1.9.6，更新于 2026 年 5 月 10 日。产品还在快速迭代中，一些边缘场景和对文档描述的精确遵守可能会有偏差。

## 检验标准

- [ ] 你能说清楚 Kimi WebBridge 和 Claude for Chrome / Codex Chrome 扩展的核心差异吗？
- [ ] 你理解「借用真实浏览器的登录态」这个设计对 AI Agent 落地的意义吗？
- [ ] 你能解释为什么 Kimi 选择做 Agent 无关的桥，而不是 Kimi Code 独占？
- [ ] 你知道 WebBridge 的数据隐私模型和几个竞品的区别吗？

---

*发布日期：2026-05-14*
*信息来源：Kimi Help Center、Kimi Chrome Web Store、Moonshot AI Official、Exa Web Search*
