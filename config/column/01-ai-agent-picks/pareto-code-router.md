# OpenRouter Pareto Code：一个参数解决「选模型焦虑症」

> 2026 年 4 月 21 日，OpenRouter 上线了 Pareto Code Router（`openrouter/pareto-code`）。你不需要选模型了。只需告诉它你需要多强的编码能力——一个 0 到 1 的分数——它自动从当前最优的编码模型中挑一个给你。路由本身不收费，按实际使用的模型计费。听起来像个小功能，但我觉得这是 AI 编码工具链里一个被低估的拐点。

---

## 先说结论：不要「选模型」，要「设阈值」

做 AI 编码的人都有一个共同烦恼——**模型更新太快了**。

今天你觉得 Claude Opus 4.7 写代码最好，明天 GPT-5.5 出来了，后天 DeepSeek V4 Pro 又刷新了某个 benchmark。你需要在代码里硬编码 model name，然后定期手动更新。更头疼的是——不同任务需要不同能力级别的模型。写一个工具函数用顶级模型是浪费，但重构核心逻辑用低端模型又不够稳。

OpenRouter 的解法：**把「选模型」变成「设阈值」**。

```
model: "openrouter/pareto-code"
// 可选参数
min_coding_score: 0.8  // 0 到 1，越高越强
```

就这么简单。你不需要知道底层跑的是哪个模型。你只需要告诉系统：我要多强的编码能力。


![](https://fastly.jsdelivr.net/gh/bucketio/img1@main/2026/05/10/1778411532745-959c80cb-0f8f-4015-a2a2-bbaa7b77cbc9.jpeg)


名字里的 "Pareto" 来源于帕累托最优——在任意一个成本或能力点上，路由到 OpenRouter 维护的「质量/成本前沿」上的模型。

---

## 三档路由：High、Medium、Low

背后是一个按编码能力排序的精选模型列表，基于 Artificial Analysis 的编码评分 percentile。当前分成三档：

| 档次 | min_coding_score | 路由到的模型 |
|------|-----------------|-------------|
| High | ≥ 0.66 | GPT-5.5、Gemini 3.1 Pro Preview、Claude Opus 4.7、DeepSeek V4 Pro |
| Medium | 0.33 ~ 0.66 | GPT-5.4 Mini、Claude Sonnet 4.6、Kimi K2.6、Grok 4.3 |
| Low | < 0.33 | Mimo V2.5 Pro、Qwen 3.6 Max Preview、GLM 5.1、DeepSeek V4 Flash、Claude Haiku 4.5 |

不传 `min_coding_score` 时，默认走 High 档，也就是最强的模型。

每档内按价格排序，同一档内确定性选择（同一个 score 始终选同一个模型）。某次请求后发现选错了模型？不用改代码——换个 score 就行。

---

## 最值钱的设计：隐形降级

看文档的时候注意到一个细节——**fallback 逻辑**。

如果当前档次的所有模型都暂时不可用（超载、降级、故障），系统不会报错，而是自动降到相邻档次找一个可用的编码模型顶上来。你的请求永远不会因为「这个模型挂了」而失败。

做产品的都知道这意味着什么：**可靠性的提升 > 单次模型能力的微小差距**。模型再强，不可用就是零。Pareto Code 用相邻档次兜底，把「单点故障」变成了「平滑降级」。这比大多数 API 网关做得都好。

---

## 谁最需要这个东西

### 1. AI 编码工具和 Agent 开发者

如果你在做一个 AI 编码工具（像 OpenCode、Kilo Code 这种），需要用最短的代码支持最多的模型。不用在设置页面加一个长长模型下拉框了——让用户选一个 score 就够了。

实际上 OpenCode 已经支持了 `openrouter/pareto-code` 作为模型选项。用户装好 OpenCode、连上 OpenRouter API key、在配置里写一个 `min_coding_score`，就可以直接用了。

### 2. 独立开发者和小团队

没必要为每个项目纠结「该用哪个模型写这段代码」。高频场景下，调高 score 用最强模型；日常开发用中等 score；成本敏感时调低。**一个参数完事，不需要运维人。**

### 3. 在代码里硬编码了 model name 的人

如果你写过 `model: "claude-sonnet-4-20250101"` 这种代码——承认吧，三个月后你就忘了更新。改用 Pareto Code，当新模型上线时，名单会自动更新，你的代码一行都不用改。

---

## 和 Auto Router 的区别

OpenRouter 之前有一个 Auto Router，走的是另一条路线——用一个 meta-model 分析你的 prompt，然后决定哪个模型最合适。更像「智能推荐」。

Pareto Code 的思路正好相反：**不要猜测、直接告诉它你的要求**。两者各有适用场景：

- **Auto Router**：适合通用场景，不知道用什么模型好，让系统帮你判断
- **Pareto Code**：适合编码场景，你清楚需要多强的能力，只要设一个阈值

Pareto Code 还多一个优势：**零额外费用**。Pareto 路由本身不收费，只收底层模型的钱。Auto Router 在调用 meta-model 时有微小开销。

---

## 坦率地说：它还不够完美

有几个点值得注意：

**第一，当前只有三个档次。** 0 到 1 的连续分数听起来很灵活，但实际的模型池只有三档。随着模型增多，OpenRouter 承诺会加更多颗粒度，但现在用起来其实就三档，中间的微调空间有限。

**第二，只在编码场景下有效。** 通用对话、图片生成、音频处理——这些场景不适用 Pareto Code，它专门为编码用例调优。别的场景还得用 Auto Router 或者手动选模型。

**第三，你放弃了「知道用的是哪个模型」的权利。** 对某些场景来说这无所谓，但如果你的产品需要明确告知用户「当前由 GPT-5.5 提供服务」或者需要固定模型的输出一致性，Pareto Code 就不太适合。虽然返回结果里会带上实际使用的 model name，但下次请求可能就换了。

**第四，不能直接控制成本和延迟。** `min_coding_score` 越高，模型越贵——但这个关系是间接的。你不能说「我付的钱不能超过 X」。你只能通过降低 score 来间接省钱。

---

## 更大的图景：路由层正在变成 AI 基础设施的关键组件

Pareto Code 背后有一个更大的趋势——

当模型从几十个变成几百个，「选哪个模型」就不再是一个用户决策，而是一个**基础设施决策**。路由层就是干这个的。

把这件事做大，就是「模型路由即服务」：

- **质量路由**（像 Pareto Code）：按能力阈值路由
- **成本路由**：按预算上限路由，自动挑性价比最高的
- **延迟路由**：按响应时间要求路由，Nitro 变体已经在做了
- **混合路由**：综合多个维度优化

OpenRouter 实际上是模型路由领域跑得最快的玩家。Pareto Code、Auto Router、Nitro 变体——它们已经在构建一个「模型编排层」，让上层应用不需要关心下面跑的是什么。这跟云服务从「自己管服务器」到「Serverless」的演进是一个逻辑。

**2025 年选模型是技术活儿，2026 年选模型应该是基础设施的活儿。** Pareto Code 就是这个转变的一个信号。

---

## 怎么用

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="<YOUR_API_KEY>",
)

completion = client.chat.completions.create(
    extra_headers={
        "X-Title": "My App",
    },
    model="openrouter/pareto-code",
    messages=[{"role": "user", "content": "用 Go 写一个并发安全的 LRU Cache"}],
)
```

就这么简单。如果你对编码质量要求更高，加上 `min_coding_score` 参数：

```python
completion = client.chat.completions.create(
    model="openrouter/pareto-code",
    # ... 加上 pareto-router 插件配置
    extra_body={
        "plugins": [{"id": "pareto-router", "min_coding_score": 0.8}]
    },
    messages=[{"role": "user", "content": "..."}],
)
```

---

## 一点看法

Pareto Code 不是一个炫酷的产品发布。没有爆炸性 demo，没有打破某个 benchmark。但它指向了一个正确的方向：**AI 工具链里那些「本该自动化却还在手动做」的事情，正在被逐一自动化。**

「选模型」这件事在模型只有 5 个的时候不是问题。现在 OpenRouter 上有 400+ 个模型，其中编码相关的至少有几十个。再让人手动选，不合理了。就像你不会手动为每次 HTTP 请求选择路由路径一样——这个决策应该由基础设施替你完成。

Pareto Code 的价值就是：它把「我该用哪个模型写这段代码」这个问题，变成了「我要用多强的模型写这段代码」。而后者是一个更简单、更稳定的信号。

对独立开发者来说，这意味着少操一份心，多做一件事。就够了。

---

*OpenRouter Pareto Code 于 2026 年 4 月 21 日上线。当前支持 High/Medium/Low 三档路由，未来会支持更细粒度的分档。路由本身免费，按实际使用模型计费。详情：[openrouter.ai/openrouter/pareto-code](https://openrouter.ai/openrouter/pareto-code)*
