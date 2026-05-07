# 综合实战：搭建个人 AI 工作站

> **学习目标**：把前面模块学的 AI 搜索、RAG、No-Code Agent、自动化工作流全部串联——搭建一条完整的"信息获取 → AI 处理 → 内容生成 → 自动分发"流水线——拥有一个 7×24 小时运转的个人 AI 工作站
>
> **预计时间**：50 分钟
>
> **难度等级**：⭐⭐⭐☆☆

---

## 一、什么是"个人 AI 工作站"

先说结论：**个人 AI 工作站不是一台电脑，而是一条流水线——它每天自动获取信息、用 AI 处理、生成内容、推送到你需要的地方。**

想象你有这样一个系统：

```
早 8:00 → AI 已经帮你读完 100 篇文章，摘要写好了
早 8:30 → AI 根据摘要生成了一篇推文草稿
早 9:00 → 推文发到你手机上，你花 2 分钟看一眼→发出一篇推文
中 12:00 → AI 自动追踪的竞品动态推送到飞书
晚 20:00 → 当天的学习笔记自动整理归档
```

你什么都没做，但它每天在为你工作。**这就是个人 AI 工作站的意义——让你的知识工作自动化。**

### 1.1 跟之前的区别

之前的学习笔记：

```
模块 17 → 你学会了用 AI 搜索获取信息
模块 18 → 你学会了用 Coze 搭 Agent
模块 21 → 你学会了用 n8n/Zapier 搭自动化
```

这个实战课把这些**全部串联**——不是单独用每个工具，而是让它们协同工作。

### 1.2 本案例用到的技术栈

| 工具 | 在这个案例中干什么 | 备选方案 |
|------|-------------------|---------|
| **n8n** | 工作流编排核心（自部署） | Zapier / Make |
| **AI 搜索** | 获取外部信息 | Web Scraper / RSS |
| **OpenAI / Claude** | AI 处理核心（总结、生成、分类） | DeepSeek、本地模型 |
| **Notion / 飞书** | 内容存储和分发 | Slack、语雀、Obsidian |
| **Coze Agent（可选）** | 高级 AI 处理步骤 | Dify Agent |

---

## 二、整体架构

### 2.1 四阶段流程图

```
┌────────────────────────────────────────────────────────┐
│              个人 AI 工作站 整体架构                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─────────────────────────────────────────────────────┐│
│ │  阶段一：信息获取                                    ││
│ │                                                     ││
│ │  [定时触发器] → [RSS 抓取] → [AI 搜索]                ││
│ │  每天 8:00      HN/36Kr/博客   补充搜索热点           ││
│ └─────────────────────┬───────────────────────────────┘│
│                       │                                │
│                       ▼                                │
│ ┌─────────────────────────────────────────────────────┐│
│ │  阶段二：AI 处理                                     ││
│ │                                                     ││
│ │  [去重/过滤] → [AI 总结] → [AI 分类] → [AI 打分]     ││
│ │  已处理的跳过   每篇 100 字  按主题分   按质量排序     ││
│ └─────────────────────┬───────────────────────────────┘│
│                       │                                │
│                       ▼                                │
│ ┌─────────────────────────────────────────────────────┐│
│ │  阶段三：内容生成                                    ││
│ │                                                     ││
│ │  [选择最佳内容] → [AI 生成推文] → [AI 生成日报]       ││
│ │  从处理结果中选    多版本草稿    当日要闻汇总          ││
│ └─────────────────────┬───────────────────────────────┘│
│                       │                                │
│                       ▼                                │
│ ┌─────────────────────────────────────────────────────┐│
│ │  阶段四：分发推送                                    ││
│ │                                                     ││
│ │  [保存到 Notion] → [推送到飞书] → [API 供调用]        ││
│ │  知识库存档      团队 / 个人通知   对外接口           ││
│ └─────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

### 2.2 数据流详解

```
输入 → 原始文章列表（标题 + URL + 摘要）
  ↓
阶段一输出 → 去重后的文章列表 + AI 搜索补充内容
  ↓
阶段二输出 → 结构化知识条目（标题 + 中文总结 + 分类 + 质量分）
  ↓
阶段三输出 → 推文草稿（3 个版本）+ 日报摘要
  ↓
阶段四输出 → 存 Notion + 推送到飞书/Slack
```

---

## 三、具体配置步骤

### 3.1 前置准备

1. n8n 已部署运行（参考第 3 章）
2. OpenAI 或类似 API Key
3. Notion 账号 + API Token（可选）
4. 飞书/钉钉/Slack 的 Webhook URL（可选）

如果 n8n 还没部署，现在先跑一下 Docker 部署命令：

```bash
mkdir ~/n8n-workstation && cd ~/n8n-workstation
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_secure_password
    volumes:
      - ./n8n_data:/home/node/.n8n
    restart: unless-stopped
EOF
docker compose up -d
```

### 3.2 阶段一：配置信息获取

**目标**：每天早上 8 点自动获取多个来源的信息。

**在 n8n 中搭建：**

**步骤 1.1：定时触发器**

添加 **Schedule Trigger** 节点：

```
Trigger:
  - Rule: Every Day
  - Time: 08:00
```

**步骤 1.2：RSS 抓取**

添加 **RSS Feed Read** 节点（或 HTTP Request 节点）：

```
当然也可以直接用 HTTP Request 来抓 RSS：

URL: https://hn.algolia.com/api/v1/search?query=AI&tags=story
Method: GET
Options:
  Response Format: JSON

继续添加 RSS 源。如果有多个 RSS 源，可以克隆这个节点。

推荐 RSS 源：
├─ Hacker News: https://hn.algolia.com/api/v1/search?query=AI&tags=story
├─ 少数派: https://sspai.com/feed
├─ 36Kr: https://36kr.com/feed
└─ 你自己的 Feedly / Inoreader 订阅
```

把多个 RSS 源的数据合并成统一的格式（用 **Merge** 节点或 **Code** 节点）：

```javascript
// Code 节点：统一数据格式
const items = $input.all().map(item => ({
  title: item.json.title || item.json.name,
  url: item.json.url || item.json.link,
  summary: item.json.summary || item.json.description || '',
  source: item.json.source || 'unknown',
  published: item.json.pubDate || item.json.published || new Date().toISOString()
}));
return items;
```

### 3.3 阶段二：AI 处理流程

**目标**：对获取到的所有信息进行去重、总结、分类、打分。

**步骤 2.1：去重**

用 **Code** 节点实现简单的去重（基于数据库记录判断是否已处理）：

```javascript
// Code 节点：去重逻辑
const items = $input.all();
const processedUrls = new Set();

// 存储历史 URL（从某个数据源获取）
// 这里简化处理，实际可以从数据库/文件读取
const history = global.get('processed_urls') || [];

return items.filter(item => {
  if (processedUrls.has(item.json.url)) return false;
  if (history.includes(item.json.url)) return false;
  processedUrls.add(item.json.url);
  return true;
});
```

**步骤 2.2：AI 总结**

添加 **OpenAI** 节点：

```
Operation: Create Message
Model: gpt-4o-mini  ← 总结任务用 mini 就够了，省 Token

System Prompt:
你是一个技术文章摘要助手。用中文给每篇文章写一个 100 字以内的摘要。
要求：
1. 第一句说清楚"讲了什么"（核心结论）
2. 第二句补充"为什么重要"（价值判断）
3. 不要写"本文介绍了"这种废话

User Message:
---
标题：{{ $json.title }}
原文：{{ $json.summary }}
---

输出格式（JSON）：
{"summary": "摘要内容"}
```

```javascript
// 后续的 Code 节点：解析 AI 输出
const items = $input.all();
return items.map(item => {
  let aiOutput = item.json.ai_output;
  // 尝试解析 JSON
  try {
    const parsed = JSON.parse(aiOutput);
    item.json.ai_summary = parsed.summary;
  } catch(e) {
    item.json.ai_summary = aiOutput;  // 非 JSON 格式就直接用
  }
  return item;
});
```

**步骤 2.3：AI 分类**

添加另一个 **OpenAI** 节点（用更便宜的模型）：

```
Model: gpt-4o-mini
Prompt:
判断这篇文章属于哪个类别：
- AI/技术
- 产品/商业
- 学术/研究
- 效率/工具
- 其他

标题：{{ $json.title }}
摘要：{{ $json.ai_summary }}

只输出一个类别名称。
```

**步骤 2.4：AI 质量打分**

再添加一个 **OpenAI** 节点：

```
Model: gpt-4o-mini
Prompt:
给这篇文章的质量打分（1-5 分），标准如下：
5分：颠覆性观点或有重大价值
4分：有实质性内容，值得一读
3分：一般性内容，普通价值
2分：标题党或内容浅薄
1分：无关或低质内容

标题：{{ $json.title }}
摘要：{{ $json.ai_summary }}

只输出数字（1-5）。
```

### 3.4 阶段三：内容生成

**目标**：从处理结果中筛选高质量内容，生成推文草稿和日报摘要。

**步骤 3.1：筛选高质量内容**

用 **IF** 节点：

```
Condition: {{ $json.quality_score }} >= 4 AND {{ $json.category }} != "其他"
```

只保留质量分 4 以上且分类明确的文章。

**步骤 3.2：生成推文草稿**

添加 **OpenAI** 节点（这次用好模型）：

```
Model: gpt-4o

System Prompt:
你是一个 AI 领域的社交媒体运营。基于以下文章生成 3 条推文草稿。
风格：简洁有力，适合中文社交媒体传播。

用户 Message:
文章标题：{{ $json.title }}
摘要：{{ $json.ai_summary }}

请输出 3 条推文草稿，每条不超过 140 字，用列表格式：
1. （版本一：直接传达核心结论）
2. （版本二：用提问引发好奇）
3. （版本三：加入个人观点和推荐）
```

**步骤 3.3：生成日报摘要**

用另一个 **OpenAI** 节点：

```
Model: gpt-4o

System Prompt:
以下是今天的文章汇总。请生成一份日报摘要，包含：
1. 今日核心主题（一句话概括）
2. 3-5 条重点内容（每条一句话 + 来源）
3. 推荐深度阅读（1-2 篇最值得读的）

格式：Markdown
```

### 3.5 阶段四：分发推送

**步骤 4.1：保存到 Notion**

添加 **Notion** 节点（需要提前配置 Notion Connection）：

```
Operation: Create Database Item
Database: 你的 Notion 数据库 ID

Properties:
  Title: {{ $json.title }}
  URL: {{ $json.url }}
  AI Summary: {{ $json.ai_summary }}
  Category: {{ $json.category }}
  Quality Score: {{ $json.quality_score }}
  Created: {{ $json.published || now }}
```

**步骤 4.2：推送到飞书 / Slack**

以飞书为例（Webhook 方式）：

添加 **HTTP Request** 节点：

```
Method: POST
URL: https://open.feishu.cn/open-apis/bot/v2/hook/你的Webhook地址
Headers:
  Content-Type: application/json

Body:
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": {"tag": "plain_text", "content": "🤖 AI 早报已生成"}
    },
    "elements": [
      {"tag": "markdown", "content": "今日收录 {{items.length}} 篇文章\n精选 {{highQuality}} 篇\n日报：https://your-dashboard-url"}
    ]
  }
}
```

如果是 Slack：

```
Method: POST
URL: https://hooks.slack.com/services/你的Webhook
Body:
{
  "text": "🤖 AI 早报已生成\n今日收录 {{items.length}} 篇文章\n查看详情：https://your-dashboard-url"
}
```

**步骤 4.3：存储当日运行状态**

把当日执行摘要也存入本地（用于可观测性：

```javascript
// Code 节点：记录执行状态
const items = $input.all();
const stats = {
  date: new Date().toISOString().split('T')[0],
  total_articles: items.length,
  high_quality: items.filter(i => i.json.quality_score >= 4).length,
  categories: {},
  status: 'completed'
};

items.forEach(item => {
  const cat = item.json.category;
  stats.categories[cat] = (stats.categories[cat] || 0) + 1;
});

// 存储到全局变量
const history = global.get('run_history') || [];
history.push(stats);
if (history.length > 30) history.shift();  // 只保留30天
global.set('run_history', history);

return [{ json: stats }];
```

### 3.6 完整工作流节点结构

以下是整个 n8n 工作流的节点结构总览：

```
1. [Schedule Trigger]   ─── 每天早上 8:00 触发
      │
2. [RSS Feed Read]      ─── 抓取 HN 文章（AI 相关）
      │
3. [HTTP Request]        ─── 抓取 36Kr 文章
      │
4. [HTTP Request]        ─── 抓取少数派文章
      │
5. [Merge]               ─── 合并所有数据源
      │
6. [Code: 去重]          ─── 过滤已处理过的 URL
      │
7. [OpenAI: 总结]        ─── 每篇文章写 100 字摘要
      │
8. [OpenAI: 分类]        ─── 判断文章类别
      │
9. [OpenAI: 质量打分]    ─── 1-5 分评分
      │
10. [IF: 质量筛选]       ─── 过滤 4 分以下的文章
      │            │
   [不达标]         │
      │             │
11. [End]            ▼
              12. [OpenAI: 生成推文]  ─── 3 个版本
                      │
              13. [OpenAI: 生成日报]  ─── 当日汇总
                      │
              14. [Notion: 保存]      ─── 存档到知识库
                      │
              15. [HTTP: 飞书通知]    ─── 推送通知
                      │
              16. [Code: 记录日志]    ─── 保存运行状态
```

---

## 四、让工作站持续运行

### 4.1 部署到服务器

如果 n8n 跑在你的个人电脑上，关机了就不会运行了。要让工作站 7×24 运行：

| 方案 | 费用 | 说明 |
|------|------|------|
| **云服务器（VPS）** | $5-10/月 | 最推荐，一台最低配服务器就够了 |
| **NAS 自托管** | 已有设备 | 群晖等 NAS 上运行 Docker |
| **Raspberry Pi** | $50-80 一次 | 低功耗，但性能有限 |
| **Oracle Cloud 免费版** | 免费 | 有免费 ARM 服务器，但注册稍麻烦 |

**最低配置要求**：1 核 CPU、1GB 内存、20GB 磁盘——一台最低配的云服务器完全够用。

### 4.2 设置 SSL 和域名（可选）

如果你需要外部系统（如 Zapier）的 Webhook 访问 n8n：

```
使用 Caddy 或 Nginx 反代 n8n：
n8n.example.com → localhost:5678
自动 SSL（Caddy 自动搞定）
```

### 4.3 监控和维护

```bash
# 查看 n8n 日志
docker logs n8n

# 重启 n8n
docker restart n8n

# 更新 n8n 版本
docker pull n8nio/n8n:latest
docker compose up -d
```

**推荐设置**：
- 每周检查一次运行日志
- 每月更新一次 n8n 版本
- 每天收到推送（成功的不必管，失败才需要看）

---

## 五、拓展和进阶

### 5.1 增加更多数据源

| 数据源 | 接入方式 | 价值 |
|--------|---------|------|
| **微信公众号** | WeRSS / 公众号采集 | 中文内容补充 |
| **Twitter/LinkedIn** | 官方 API | 行业动态 |
| **ArXiv / 论文** | API 抓取 | 学术前沿 |
| **播客转文字** | Whisper API | 音频内容 |
| **Newsletter** | 邮件抓取 | 深度内容 |

### 5.2 增加更多 AI 处理

| 处理类型 | 作用 |
|---------|------|
| **趋势分析** | 按周/月统计关键词频率，发现趋势变化 |
| **知识图谱** | 提取文章中的实体和关系，建知识图谱 |
| **多语言翻译** | 英文文章自动翻译为中文 |
| **情感分析** | 判断文章情感倾向（正面/负面/中性） |
| **关联推荐** | 基于已有知识库，推荐相关文章 |

### 5.3 结合 Coze Agent

把 n8n 处理后的结果喂给 Coze Agent，让 Agent 做更复杂的处理：

```
n8n 处理结果 → Webhook → Coze Agent
  │                           │
  │                    [Agent 深度分析]
  │                           │
  │                    [生成更高质量的内容]
  │                           │
  └────────────────── Webhook 回调 → n8n 继续分发
```

这样 n8n 负责"跑腿调度"，Coze Agent 负责"深度思考"——两个模块串联起来了。

### 5.4 对团队扩展

如果这个工作站跑得不错，可以考虑扩展到团队场景：

```
每人一个"个人 AI 工作站"
          ↓
每天输出的内容汇总到"团队知识库"
          ↓
基于团队知识库生成"团队日报"
          ↓
AI 分析知识库中的内容关联 → 自动推荐协作
```

---

## 六、常见问题排查

| 问题 | 原因 | 解决 |
|------|------|------|
| **早上没收到日报** | n8n 服务器可能宕机了 | 检查服务器状态、docker ps |
| **AI 总结全是空的** | OpenAI API Key 过期或额度用尽 | 检查 API 余额 |
| **文章全是重复的** | 去重逻辑没跑通 | 检查 Code 节点中的 URL 去重逻辑 |
| **Notion 没写入** | Notion Integration 权限配置不对 | 重新授权 |
| **飞书没收到通知** | Webhook URL 配置错误或地址变了 | 测试 Webhook URL |
| **处理速度太慢** | 文章太多或 AI 模型响应慢 | 改用更快的模型（GPT-4o-mini）、分批处理 |

---

## 检验标准

完成本实战后，你应该能做到以下 7 件事：

::: info 检验清单
- [ ] 能用 n8n 搭建一条完整的"信息获取 → AI 处理 → 内容生成 → 分发推送"流水线
- [ ] 能配置 3 个以上不同的数据源（RSS/API/Webhook），并统一数据格式
- [ ] 能使用 AI 对内容进行总结、分类、质量打分
- [ ] 能实现去重机制，防止同一条内容被重复处理
- [ ] 能将处理结果同时保存到知识库（Notion）和推送到通知渠道（飞书/Slack）
- [ ] 能配置工作流的错误处理和日志记录，出现问题能快速定位
- [ ] 能在云服务器上部署 n8n 并让流水线 7×24 稳定运行
:::

---

## 本节小结

::: info 回顾要点
✅ 个人 AI 工作站 = 信息获取 + AI 处理 + 内容生成 + 分发推送 四阶段

✅ 本案例串起了模块 17（AI 搜索）、模块 18（Coze Agent）、模块 21（n8n 自动化）的全部知识

✅ 具体配置：用 n8n 的 Schedule Trigger → RSS/API 抓取 → OpenAI 总结/分类/打分 → IF 筛选 → 再生成推文和日报 → Notion 存档 + 飞书推送

✅ 部署到 VPS 实现 7×24 运行，最低 $5/月 的服务器就够了

✅ 这不是终点——可以继续扩展数据源、增加 AI 处理类型、结合 Coze Agent 深度分析

✅ **从'用工具'到'造流水线'——这才是基础模块的毕业课**
:::

---

[← 返回章节目录](/agent-ecosystem/21-ai-automation-workflow/) | [← 返回 Agent 生态目录](/agent-ecosystem/)
