# 实战案例与场景最佳实践

> **本章导读**: 前面十三章我们深入剖析了 OpenClaw 的每个核心组件——从 Gateway 的事件总线到 Brain 的 Prompt 编排，从 Hands 的工具执行到 Memory 的四层记忆，从 Heartbeat 的主动调度到 Channels 的多平台接入。但知识只有串联起来才能释放真正的力量。本章将四个真实场景从头到尾完整展开，演示如何将学到的全部知识融合到实际部署中。每一个案例都是可以照搬的模板，你可以根据自己的需求直接修改使用。
>
> **前置知识**: 完整阅读过第 01-13 章、基础模块 10 OpenClaw 章节
>
> **难度等级**: ⭐⭐⭐☆☆

---

如果说前面十三章是在教你怎么造车，那这一章就是带你上路。

你可能已经看过很多"Hello World"级别的 OpenClaw 教程——装一个 `weather` Skill，配一个 Telegram 频道，问一句"今天天气如何"。但这些零散的演示无法回答一个更实际的问题：**一个真正在用的 OpenClaw 助手，到底长什么样？**

本章选取了四个差异化的使用场景，覆盖个人效率、团队协作、智能家居和开发者工作流四个方向。每个案例都遵循同一套结构：

1. **场景描述与架构设计**——我们要解决什么问题，系统的模块如何划分
2. **Skills 清单与安装**——需要哪些能力，从哪里获取
3. **核心配置**——Config、SOUL.md、Channel 设置、记忆模板的完整实现
4. **关键技术决策**——为什么这样设计，有什么取舍
5. **效果演示**——用户与 Agent 的真实对话流
6. **部署要点与注意事项**——哪些坑我们已经踩过了

---

## 一、案例一：个人信息助手

### 1.1 场景描述

> "每天早上醒来，我想知道今天该穿什么衣服、有什么会议要参加、以及昨天的重大新闻。"

这是一个典型的个人信息聚合场景。核心需求是**多数据源的被动应答 + 主动推送**的结合：用户随时可以问天气、查日程、看新闻；同时 Agent 在每天早晨自动推送晨报。

### 1.2 架构设计

```
┌──────────────────────────────────────────────────────────────────┐
│                    个人信息助手 — 架构总览                         │
│                                                                  │
│  用户入口层                                                       │
│  ┌───────────┐  ┌───────────┐  ┌────────────┐                   │
│  │ Telegram  │  │ 微信(桥梁)  │  │  Web Chat  │                   │
│  └─────┬─────┘  └─────┬─────┘  └─────┬──────┘                   │
│        └───────────────┼──────────────┘                          │
│                        ▼                                         │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   Gateway (端口 18789)                     │    │
│  │                                                           │    │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐   │    │
│  │  │  Brain  │  │  Hands  │  │  Memory  │  │ Heartbeat│   │    │
│  │  │(Claude) │  │执行引擎  │  │四层记忆  │  │ 晨报调度  │   │    │
│  │  └────┬────┘  └────┬────┘  └────┬─────┘  └────┬─────┘   │    │
│  └───────┼────────────┼────────────┼──────────────┼─────────┘    │
│          ▼            ▼            ▼              ▼              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐        │
│  │  Weather │ │ Calendar │ │  News    │ │  CRON 触发器  │        │
│  │  Skill   │ │  Skill   │ │  Skill   │ │  07:30 每日  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

这是一个**单 Agent 多 Skill**的架构：一个 Agent 同时加载多个独立的 Skills，通过 Brain 的 LLM 编排自动选择合适的工具来回答用户问题。

### 1.3 所需 Skills

| Skill 名称 | 来源 | 功能说明 | 依赖 |
|-----------|------|---------|------|
| `weather` | ClawHub 官方 | 查询实时天气、空气质量、未来预报 | `curl`, 免费天气 API Key |
| `news-digest` | ClawHub 社区 | 抓取 RSS/Twitter 热点，生成新闻摘要 | `jq`, RSS 源配置 |
| `calendar` | 自建或社区版 | 读取 iCal/CalDAV 日历，查询日程 | 日历 URL 或本地 `.ics` 文件 |

```bash
# 安装命令
openclaw skill install clawhub:weather          # 安装天气 Skill
openclaw skill install clawhub:news-digest      # 安装新闻摘要 Skill
openclaw skill install clawhub:calendar          # 安装日历管理 Skill

# 验证安装
openclaw skill list
# 输出:
# ☁️  weather            v2.1.0  ClawHub 官方
# 📰  news-digest        v1.5.0  ClawHub 社区
# 📅  calendar           v1.3.0  ClawHub 社区
```

### 1.4 核心配置

#### Agent 配置

```yaml
# ~/.openclaw/agents/personal-assistant/config.yaml
name: personal-assistant
description: "我的个人信息助手"

brain:
  provider: anthropic
  model: claude-sonnet-4-20250514
  # 个人场景不需要高吞吐，标准模式即可
  maxTokens: 4096
  temperature: 0.3  # 信息类任务使用较低温度，提高准确性

skills:
  - weather
  - news-digest
  - calendar

memory:
  # 个人信息助手需要更长的记忆跨度
  working:
    maxMessages: 50
  files:
    enabled: true
    baseDir: ./data/personal-assistant/memory/
  knowledge:
    enabled: true
    # 存储用户的个人信息（如常去城市、常用关键词）
    embeddings:
      provider: local

channels:
  - type: telegram
    config:
      botToken: "{{TELEGRAM_BOT_TOKEN}}"
      allowedUserIds:
        - "{{MY_TELEGRAM_ID}}"  # 仅允许自己使用
  - type: web
    config:
      enabled: true
      port: 8080
```

#### SOUL.md

```markdown
# 个人信息助手

## 身份定义
你是「小雅」，我的个人 AI 助手。你亲切、高效、值得信赖。

## 性格特点
- 回答问题直接简洁，不要长篇大论
- 报告的格式：先给结论，再说原因，最后给建议
- 对于不确定的信息，诚实地说"我不确定"

## 工作范围
- 你负责三件事：天气、日程、新闻
- 对于这三者之外的问题，可以说"这个问题我不擅长，需要我帮你查找资料吗？"
- 不要尝试修改我的日历事件（只读模式）
- 不要代表我发送任何消息

## 沟通偏好
- 使用中文，语气友好但不啰嗦
- 天气信息使用温度、湿度、风速、空气质量四个维度
- 日程信息使用时间线格式，标注优先级
- 新闻摘要使用编号列表，每条不超过一句话

## 特殊指令
- 每天早上 07:30，主动推送晨报（包含今日天气、日程、昨日重要新闻 3 条）
- 当我问"我今天有什么安排"时，列出今天的日程并按时间排序
- 当我问"有什么新闻"时，优先推荐科技和行业新闻
- 如果天气预报有极端天气（暴雨/高温/暴雪），主动提醒我
```

#### Heartbeat 晨报配置

```yaml
# ~/.openclaw/agents/personal-assistant/heartbeat.yaml
heartbeats:
  - name: morning-briefing
    description: "每日 07:30 推送晨报"
    schedule: "30 7 * * *"   # cron 表达式：每天早上 7:30
    timezone: "Asia/Shanghai"
    prompt: |
      执行以下步骤：
      1. 调用天气 Skill 查询今天本地天气
      2. 调用日历 Skill 查询今天的日程安排
      3. 调用新闻 Skill 获取昨日重要新闻摘要（限 3 条）
      4. 将结果整理为晨报格式发送给我
    output:
      channel: telegram
      format: markdown
```

### 1.5 关键技术决策

**为什么选择单 Agent 而非多 Agent？**

个人信息助手的用户只有一个人，所有问题都是"我问你答"或"定时推送"的模式。单 Agent 架构让 Brain 可以在一次推理中同时调用多个 Skills（例如同时查天气和日程），减少延迟。多 Agent 在这里反而增加了不必要的通信开销。

**Memory 配置策略**

个人信息助手的记忆需要保存两类信息：用户的偏好（常去的城市、关心的新闻话题）和交互历史。`knowledge` 向量记忆用于第一类，`working` 对话记忆用于第二类。不需要启用`files`记忆中的大量文件存储，因为不涉及文档处理。

**Telegram 权限收紧**

个人助手只对一个人服务，所以在 `allowedUserIds` 中明确指定自己的 ID。这样做不仅是安全考虑，也避免了 Telegram Bot 被陌生人发现并滥用的情况——如果你不小心把 Bot Token 泄露到 GitHub，至少还有 ID 白名单这道防线。

### 1.6 效果演示

**场景一：日常查询**

```
用户:  今天上海天气怎么样？

Agent: ☁️ 上海今天（5月15日）天气如下：
       - 气温：22°C ~ 28°C
       - 湿度：65%
       - 风力：东南风 3-4 级
       - 空气质量：良好 (AQI 72)
       
       建议穿短袖出门，早晚温差较大，可带一件薄外套。
```

**场景二：日程查询**

```
用户:  我今天有什么安排？

Agent: 📅 你今天有 3 项日程：
       
       1. 🟢 10:00 - 11:30  团队周会 (Zoom)
       2. 🟡 14:00 - 15:00  项目评审会议 (3F 会议室)
       3. 🔴 16:30 - 17:00  与客户确认方案 (腾讯会议)
       
       提醒：下午的评审会议需要准备演示材料，建议上午抽时间整理一下。
```

**场景三：每日晨报（Heartbeat 自动推送）**

```
Agent: 🌅 早上好！这是你的 5月15日 晨报：

       ☀️ 今日天气：22-28°C，晴转多云，适合户外活动
       
       📅 今日日程：
       - 10:00 团队周会
       - 14:00 项目评审
       - 16:30 客户沟通
       
       📰 昨日要闻：
       1. OpenAI 发布 GPT-5 轻量版，API 价格降幅达 60%
       2. 国内首个 Agent 安全标准征求意见稿发布
       3. 全球气温连续 12 个月创新高
       
       祝你今天工作顺利！☕
```

### 1.7 部署要点

- **API Key 管理**：天气 API、LLM API 的密钥使用环境变量或 Docker Secrets 注入，不要写在配置文件中
- **晨报时区**：Heartbeat 的 `timezone` 字段务必设置正确，否则你可能在凌晨 3 点收到晨报
- **新闻源配置**：`news-digest` Skill 默认抓取全球新闻源，建议在 Skill 配置中指定你关心的 RSS 地址（如 `https://feeds.bbci.co.uk/news/technology/rss.xml`）
- **本地开发 vs 生产部署**：本地开发时可仅使用 Telegram 和 Web 两个 Channel；生产部署建议使用 Docker 化方案（参考第 09 章）

---

## 二、案例二：团队协作 Bot

### 2.1 场景描述

> "开发团队需要一个共享助手：能帮我们追踪任务进度、检索项目知识库、每天晚上自动汇总各人的工作日报。"

团队 Bot 和个人助手最大的区别在于**多用户隔离**：同一个 Agent 面向多个团队成员，每个人的数据不能互相污染。此外，Bot 需要与项目管理工具（Notion、Jira、Linear 等）集成，知识库检索也需要访问团队共享的文档。

### 2.2 架构设计

```
┌───────────────────────────────────────────────────────────────────┐
│                    团队协作 Bot — 架构总览                          │
│                                                                   │
│                   ┌─────────────────┐                             │
│  用户层            │   Slack Channel  │                             │
│                   │  #team-bot 频道  │                             │
│                   └────────┬────────┘                             │
│                            │ WebSocket                            │
│                            ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Gateway 实例                              │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │              Agent Router（多 Agent 路由）              │   │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │   │
│  │  │  │ 通用助手  │ │ 任务追踪  │ │ 知识库   │             │   │   │
│  │  │  │ (默认)   │ │ Agent    │ │ Agent    │             │   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘             │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │  Brain  │  │  Hands  │  │  Memory  │  │ Heartbeat│     │   │
│  │  └─────────┘  └─────────┘  └──────────┘  └──────────┘     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                            │                                      │
│                            ▼                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐    │
│  │ Jira     │ │ Notion   │ │ GitLab   │ │ 团队 Wiki (文档)  │    │
│  │ API 集成  │ │ 知识库    │ │ Issue    │ │ 向量数据库        │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
```

这个架构的显著特征是多 Agent 路由 + 共享技能。同一个 Gateway 托管多个 Agent，每个 Agent 有独立的 SOUL.md 和工具范围，但底层复用同一套基础设施。

### 2.3 所需 Skills

| Skill 名称 | 来源 | 功能说明 | 依赖 |
|-----------|------|---------|------|
| `jira-tracker` | 自建 | 查询和创建 Jira Issue、更新状态 | Jira API Token, 项目 Key |
| `wiki-search` | ClawHub 社区 | 向量化搜索团队知识库文档 | 本地向量库, 文档源路径 |
| `daily-report` | 自建 | 汇总团队成员的工作日志并生成日报 | Git 提交记录 API |
| `notion-bridge` | ClawHub 社区 | 读写 Notion 数据库 | Notion Integration Token |
| `team-reminder` | 自建 | 定时提醒、@成员通知 | Heartbeat 配置 |

```bash
# 安装社区 Skills
openclaw skill install clawhub:wiki-search
openclaw skill install clawhub:notion-bridge

# 安装自建 Skills（从私有仓库）
openclaw skill install git+https://github.com/team/openclaw-skills.git//jira-tracker
openclaw skill install git+https://github.com/team/openclaw-skills.git//daily-report
openclaw skill install git+https://github.com/team/openclaw-skills.git//team-reminder
```

### 2.4 核心配置

#### 多 Agent 路由配置

```yaml
# ~/.openclaw/agents/router.yaml
# 主路由器——负责将消息分发到正确的 Agent
name: team-bot-router
description: "团队 Bot 消息路由器"

brain:
  provider: anthropic
  model: claude-sonnet-4-20250514

router:
  strategy: semantic          # 基于语义匹配的路由策略
  defaultAgent: general-helper # 无法匹配时转到通用助手
  agents:
    - name: task-tracker
      description: "处理 Jira 任务查询、创建、状态更新相关的问题"
      matchKeywords:
        - 任务
        - Jira
        - Issue
        - 工单
        - 缺陷
        - Sprint
        - 故事点
    - name: knowledge-base
      description: "检索团队文档、Wiki、技术方案、API 文档"
      matchKeywords:
        - 文档
        - 知识库
        - Wiki
        - 方案
        - 技术
        - 架构
    - name: general-helper
      description: "非以上专有领域的通用问答和提醒"

channels:
  - type: slack
    config:
      botToken: "{{SLACK_BOT_TOKEN}}"
      signingSecret: "{{SLACK_SIGNING_SECRET}}"
      # 在 Slack 中通过 @TeamBot 唤起
```

#### 任务追踪 Agent 配置

```yaml
# ~/.openclaw/agents/task-tracker/config.yaml
name: task-tracker

brain:
  provider: anthropic
  model: claude-sonnet-4-20250514
  instructions: |
    你是团队任务追踪 Agent。你负责查询和管理 Jira 中的任务。

skills:
  - jira-tracker

memory:
  working:
    # 多用户的对话隔离通过 Slack 的 channel_id + user_id 实现
    maxMessages: 30
    scope: channel  # 每个频道独立记忆
```

#### 任务追踪的 SOUL.md

```markdown
# 任务追踪助手

## 身份定义
你是团队的「任务小管家」，专门管理 Jira 任务和 Issue。

## 工作范围
- ✅ 按项目/负责人/状态查询任务列表
- ✅ 创建新的 Issue（需要用户提供标题、描述、优先级）
- ✅ 更新任务状态（待办 → 进行中 → 已完成）
- ✅ 查询 Sprint 进度和燃尽图数据
- ✅ 提醒即将到期的任务
- ❌ 不能删除任务（需要管理员手动操作）
- ❌ 不能修改任务的预估工时

## 使用规则
- 用户在命令中可以 @ 其他成员，你需要识别并转换为 Jira 的 Assignee
- 创建任务时，如果用户没有提供"优先级"，默认为 Medium
- 查询结果用表格展示，字段不超过：编号、标题、负责人、状态、优先级、截止日期
- 对于"所有"这类量词，确认后再执行（"所有未完成的任务"会列出 20+ 条，确认后再展示）

## 沟通风格
- 使用项目缩写（如"电商2.0"项目）
- 状态变更后自动加上时间戳
- 使用 Slack 的 markdown 格式：*加粗*、`代码`、~删除线~
```

#### 日报 Agent Heartbeat 配置

```yaml
# ~/.openclaw/agents/daily-report/heartbeat.yaml
heartbeats:
  - name: daily-summary
    description: "每日 18:00 生成团队日报"
    schedule: "0 18 * * 1-5"   # 工作日 18:00
    timezone: "Asia/Shanghai"
    prompt: |
      执行以下步骤生成今日团队日报：
      
      1. 通过 git API 查询今日各成员的提交记录
      2. 通过 jira-tracker 查询今日状态变更的任务
      3. 汇总为日报格式

      日报模板：
      ## 📋 团队日报 — {日期}
      
      ### 代码提交
      - 总计 {N} 次提交，涉及 {M} 个仓库
      - 成员贡献：{各成员提交数}
      
      ### 任务进展
      - 新创建：{N} 个
      - 已完成：{M} 个
      - 进行中：{K} 个
      
      ### ⚠️ 需要关注
      - 超期未完成的任务
      - 没有分配负责人的新 Issue
      
      ### 明日计划
      - Sprint 剩余 {D} 天
      - 明日到期任务：{列表}
    output:
      channel: slack
      channelId: "#team-daily"
```

### 2.5 多用户隔离策略

团队 Bot 面临的核心挑战是：**同一个 Agent 实例为多人服务，如何保证每个人只看到自己的数据？**

OpenClaw 提供了三层隔离机制：

| 隔离层级 | 实现方式 | 保护范围 | 配置位置 |
|---------|---------|---------|---------|
| **会话级** | 每个 Slack 频道/私信使用独立的 Memory 上下文 | 对话历史不串扰 | `memory.working.scope: channel` |
| **查询级** | Jira Skill 在执行查询时注入当前用户身份 | 数据权限受控于 API | Skill 自行实现 |
| **路由级** | 不同子 Agent 拥有不同的工具集合 | 功能边界隔离 | `router.agents` 定义 |

**会话隔离的细节**：在 `working` 记忆中将 `scope` 设为 `channel` 后，Gateway 会以 `channel_id + user_id` 为 Key 存储对话历史。这意味着：

- 用户在 Slack 私信中与 Bot 对话，只有他自己能看到历史
- 用户在公共频道中 @Bot，同一频道的所有人都能看到上下文
- 不同频道的对话完全隔离，即使在两个频道中问同样的问题，每边的上下文也不会交叉

**数据权限的实现**：Jira Skill 在调用 API 时，会将 Slack 用户的身份映射到 Jira 用户。查询时自动加上 `assignee = currentUser()` 或 `project = teamProject AND reporter = currentUser()` 的过滤条件，确保一个成员无法看到另一个成员的个人任务。

### 2.6 效果演示

**场景一：任务查询**

```
用户(@开发组):  @TeamBot 查一下电商 2.0 Sprint 24 的未完成任务

Agent: 📋 电商 2.0 — Sprint 24 未完成任务（共 5 个）

       | 编号 | 标题 | 负责人 | 状态 | 优先级 | 截止日期 |
       |------|------|--------|------|--------|---------|
       | JIRA-234 | 用户登录异常 | 张三 | 进行中 | 🔴 最高 | 5月16日 |
       | JIRA-235 | 支付页面优化 | 李四 | 待办 | 🟡 高 | 5月18日 |
       | JIRA-236 | 搜索结果排序 | 王五 | 进行中 | 🟢 中 | 5月20日 |
       | JIRA-237 | 日志采集接入 | 赵六 | 待办 | 🟢 中 | 5月22日 |
       | JIRA-238 | 数据看板改版 | — | 待办 | 🔵 低 | 5月25日 |

       ⚠️ 注意：JIRA-238 尚未分配负责人，需要安排一下吗？
```

**场景二：知识库检索**

```
用户(@开发组):  @TeamBot 去年的架构评审记录在哪？

Agent: 根据知识库检索，我找到了 3 篇相关文档：

       1. 📄 *2025年架构评审总结*（2025-12-20）
          → 涉及：微服务拆分方案、数据库分库策略
          → 位置：团队 Wiki / 技术方案 / 架构评审
          
       2. 📄 *Q4 技术债务清理方案*（2025-10-15）
          → 涉及：历史代码重构计划、测试覆盖率目标
          → 位置：团队 Wiki / 项目管理 / 技术债务
          
       3. 📄 *API 网关选型报告*（2025-08-03）
          → 涉及：Gateway 技术对比、Kong vs APISIX 测试数据
          → 位置：团队 Wiki / 基础设施 / 网关
       
       需要我为你摘要哪一篇的内容？
```

**场景三：自动日报（Heartbeat 推送）**

```
Agent: 📋 团队日报 — 2026年5月15日

       ### 代码提交
       - 总计 23 次提交，涉及 4 个仓库
       - 张三: 8次 (feature/payment-redesign)
       - 李四: 6次 (fix/login-expiry)
       - 王五: 5次 (docs/api-spec)
       - 赵六: 4次 (chore/deps-update)

       ### 任务进展
       - 新创建：3 个
       - 已完成：5 个
       - 进行中：8 个

       ### ⚠️ 需要关注
       - JIRA-238 上线前需验证（未分配负责人）
       - Sprint 24 剩余 7 天，仍有 5 个任务未开始

       ### 明日计划
       - 10:00 站会（3F 会议室）
       - Sprint 24 中期检查
```

### 2.7 部署要点

- **Slack Bot Token 权限**：确保 Bot Token 具有 `channels:history`、`chat:write`、`users:read` 权限，否则无法读取频道消息和发送消息
- **Jira API 速率限制**：Jira Cloud API 有每分钟请求限制，建议在 Jira Skill 中实现简单的请求间隔控制
- **知识库索引更新**：`wiki-search` 的向量索引不会自动更新，需要配合一个定时任务（如每 6 小时）重新索引文档目录
- **服务器选择**：团队 Bot 需要 7x24 小时在线，建议部署在云服务器（如 AWS EC2 t3.medium，2C4G）或团队内部 NAS 上
- **日志与监控**：参考第 09 章设置日志轮转和健康检查，因为团队 Bot 由多人使用，排查问题时日志是唯一的线索

---

## 三、案例三：智能家居中枢

### 3.1 场景描述

> "我希望回家说一句'我回来了'，灯就自动打开、空调调到 26 度、音响开始播放我的歌单。出门时不用关任何东西，一句'我走了'就行。"

智能家居场景对 Agent 的核心要求是**实时性**和**可靠性**：控制指令必须在秒级生效，设备状态必须随时可查。OpenClaw 通过 Heartbeat + MCP 协议连接到 Home Assistant，可以将 LLM 的语义理解能力带入家庭自动化系统。

### 3.2 架构设计

```
┌────────────────────────────────────────────────────────────────────┐
│                      智能家居中枢 — 架构总览                          │
│                                                                    │
│  交互层                                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                     │
│  │  语音唤醒  │  │ 微信小程序 │  │ Web 面板  │                     │
│  │ (Porcupine)│  │           │  │           │                     │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘                     │
│        └───────────────┼──────────────┘                            │
│                        ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Gateway (端口 18789)                      │   │
│  │                                                             │   │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │  Brain  │  │  Hands  │  │  Memory  │  │ Heartbeat│     │   │
│  │  │ (本地LLM │  │ 执行引擎  │  │ 设备状态  │  │ 设备巡检  │     │   │
│  │  │  优先)   │  │         │  │  缓存     │  │ 自动化    │     │   │
│  │  └────┬────┘  └────┬────┘  └────┬─────┘  └────┬─────┘     │   │
│  └───────┼────────────┼────────────┼──────────────┼───────────┘   │
│          ▼            ▼            ▼              ▼                │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │                 MCP 协议桥梁                                │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │     │
│  │  │  HA MCP      │  │  TTS MCP     │  │  STT MCP     │   │     │
│  │  │  Server      │  │  Server      │  │  Server      │   │     │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │     │
│  └─────────┼─────────────────┼──────────────────┼───────────┘     │
│            │                 │                  │                  │
│            ▼                 ▼                  ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐        │
│  │ Home Assistant│  │   音箱/扬声器  │  │  麦克风阵列       │        │
│  │ (设备控制)    │  │  (语音输出)   │  │  (语音输入)       │        │
│  └──────────────┘  └──────────────┘  └──────────────────┘        │
└────────────────────────────────────────────────────────────────────┘
```

这个架构的一个关键设计是**本地优先**：Brain 默认使用本地部署的小模型（如 Ollama 托管的 Qwen 系列），仅在复杂请求退回到云端 LLM。这样做一是为了降低延迟（本地模型响应时间 < 500ms），二是为了保护家庭隐私（设备控制指令不经过外部网络）。

### 3.3 所需 Skills 和 MCP 服务

| 组件 | 类型 | 功能说明 | 依赖 |
|-----|------|---------|------|
| `ha-mcp` | MCP Server | 通过 WebSocket 连接 Home Assistant | Home Assistant 运行实例、Long-Lived Token |
| `smart-home` | Skill（自建） | 设备控制指令的语义理解与翻译 | `ha-mcp` Server |
| `tts-mcp` | MCP Server | 文本转语音（播放通知/回答） | 本地 TTS 引擎或云端 API |
| `stt-mcp` | MCP Server | 语音转文字（接收语音指令） | 本地 Whisper 或云端 ASR |
| `device-patrol` | Skill（自建） | 定时检查设备在线状态和安全状态 | Heartbeat 配置 |

```bash
# 安装 MCP Servers
openclaw mcp install git+https://github.com/openclaw-hub/mcp-home-assistant.git
openclaw mcp install git+https://github.com/openclaw-hub/mcp-tts.git
openclaw mcp install git+https://github.com/openclaw-hub/mcp-stt.git

# 安装智能家居 Skill
openclaw skill install clawhub:smart-home

# 验证
openclaw mcp list
# ha-mcp      v1.2.0  Home Assistant MCP 桥梁
# tts-mcp     v0.9.0  文本转语音服务
# stt-mcp     v0.9.0  语音转文字服务

openclaw skill list
# 🏠  smart-home         v1.0.0  智能家居控制 Skill
```

### 3.4 核心配置

#### Agent 配置

```yaml
# ~/.openclaw/agents/home-hub/config.yaml
name: home-hub
description: "智能家居中枢"

brain:
  # 本地模型优先，低延迟保证控制体验
  provider: ollama
  model: qwen2.5:7b
  maxTokens: 2048
  temperature: 0.1     # 控制指令需要极高的确定性
  # 退回到云端模型处理复杂请求
  fallback:
    provider: anthropic
    model: claude-sonnet-4-20250514
    condition: "当本地模型置信度低于 0.7 或设备操作涉及安全确认"

skills:
  - smart-home
  - device-patrol

memory:
  working:
    maxMessages: 20   # 家居场景不需要长对话历史
  knowledge:
    enabled: true
    # 存储家的"空间拓扑"——哪个房间有什么设备
    baseDir: ./data/home-hub/space/

channels:
  - type: web
    config:
      enabled: true
  - type: mcp
    config:
      sttServer: stt-mcp    # 语音输入通道
      ttsServer: tts-mcp    # 语音输出通道
```

#### 智能家居 SOUL.md

```markdown
# 智能家居助手

## 身份定义
你是家的「智能管家」，负责控制家中所有智能设备。你已经在这个家工作了 3 年，熟悉每个房间的布局和每个设备的习惯。

## 空间拓扑
```
客厅:
  - 主灯 (LIGHT-001): 可调光
  - 灯带 (LIGHT-002): RGB
  - 空调 (AC-001): 格力, 支持制冷/制热/除湿
  - 电视 (TV-001): Sony, 支持 CEC
  - 窗帘 (CURTAIN-001): 支持开/关/半开
  - 音箱 (SPEAKER-001): 支持播放音乐

主卧:
  - 主灯 (LIGHT-003): 可调光
  - 床头灯 (LIGHT-004, LIGHT-005): 双控
  - 空调 (AC-002): 美的
  - 窗帘 (CURTAIN-002)
  - 智能床垫 (BED-001): 支持状态查询
  
厨房:
  - 顶灯 (LIGHT-006)
  - 烟雾报警器 (SMOKE-001)
  - 智能插座 (SOCKET-001, SOCKET-002, SOCKET-003)
  
全屋:
  - 门锁 (LOCK-001): 指纹 + 密码
  - 门磁 (DOOR-001): 大门状态
  - 人体传感器 (MOTION-001 ~ 005)
  - 温湿度传感器 (TEMP-001 ~ 004)
```

## 工作范围
- ✅ 控制灯光（开/关/亮度/颜色）
- ✅ 控制空调（开/关/温度/模式）
- ✅ 控制窗帘（开/关/指定开度）
- ✅ 控制电视（开/关/切换输入源/音量）
- ✅ 播放音乐（指定歌单/艺人/风格）
- ✅ 查询设备状态（各房间温湿度、门锁状态、能耗）
- ✅ 设备异常提醒（传感器离线、烟雾报警、门未关）
- ❌ 不能控制门锁（需要指纹或密码确认，仅监控状态）
- ❌ 不能修改安防系统的布防/撤防状态

## 沟通偏好
- 语音回答必须简短（控制在 15 字以内），因为是音箱播放
- 文本回答可以稍长，但也不要超过 3 句
- 涉及安全操作（如"把门打开"）必须二次确认
- 群组控制时，汇报操作结果："客厅灯已打开，空调已调到 26°C"

## 特殊指令
- 当我使用短语"我回来了"时：开大门灯 + 空调 26°C + 播放轻音乐
- 当我使用短语"我走了"时：关所有灯 + 关空调 + 检查门窗是否关闭
- 当我使用短语"晚安"时：关卧室外的所有灯 + 关窗帘 + 设置空调睡眠模式
- 每天早上 7:00 汇报：室外天气 + 室内温湿度 + 日历日程
- 每周日晚上 21:00 汇报：本周能耗报告
```

#### Heartbeat 设备巡检配置

```yaml
# ~/.openclaw/agents/home-hub/heartbeat.yaml
heartbeats:
  - name: device-patrol
    description: "每 15 分钟检查设备在线状态"
    schedule: "*/15 * * * *"
    priority: high
    prompt: |
      执行设备巡检：
      1. 通过 HA MCP 查询所有设备状态
      2. 标记离线或异常设备
      3. 如果有任何设备异常（尤其是烟雾报警器、门磁、冰箱），立即通知我
    output:
      channel: web        # Web 面板展示
      notifyOnAlert: true # 仅异常时推送

  - name: morning-report
    description: "早晨 7:00 晨间播报"
    schedule: "0 7 * * *"
    timezone: "Asia/Shanghai"
    prompt: |
      生成晨间播报：
      1. 通过天气 Skill 查询今日天气
      2. 通过 HA 查询室内各房间温湿度
      3. 通过日历 Skill 查询今日日程
      4. 整理为播报文本（限 60 字，因为语音播报）
    output:
      channel: tts-mcp    # 通过音箱语音播报
```

### 3.5 关键技术决策

**为什么用 MCP 协议连接 Home Assistant 而不是写一个 Skill？**

Home Assistant 提供了丰富的 WebSocket API，但从一个 Shell 脚本 Skill 去调用它，缺乏连接管理、重连机制和事件订阅能力。MCP Server 是一个长期运行的 Node.js 进程，与 Gateway 通过标准化的 MCP 协议通信，天然支持 WebSocket 长连接、心跳保活和自动重连。将"连接 HA"这件事封装为 MCP Server，让 Skill 层的职责更纯粹——只做语义理解，不做协议适配。

**本地模型 vs 云端模型的选择**

在智能家居场景中，每一个语音指令都需要在 1-2 秒内完成"语音识别 -> 语义理解 -> 设备操作 -> 语音反馈"的全链路。如果每一步都调用云端 API：
- 语音识别（云端）：~300ms
- LLM 理解（云端）：~800ms - 2s
- 设备控制（局域网）：~100ms
- 语音合成（云端）：~300ms

总计 1.5s - 3s，这还没算网络延迟。换成本地模型：
- 语音识别（Whisper 本地）：~200ms
- LLM 理解（Qwen 7B 本地）：~300ms
- 设备控制（局域网）：~100ms
- 语音合成（本地）：~200ms

总计 ~800ms，响应体验明显提升。

**安全确认的设计**

SOUL.md 中对门锁和安防操作做了明确限制。但在 Brain 层面，还需要一个额外的安全检查层：任何涉及"门锁"、"撤防"、"摄像头关闭"的操作，Brain 都会自动插入一条确认请求，等待用户明确回复"确认"后才执行。这通过 Brain 的 `confirmationRequired` 机制实现：

```yaml
# 在 Brain 配置中
brain:
  safety:
    confirmationRequired:
      - pattern: ".*(门锁|开门|撤防|关闭摄像头).*"
        timeout: 30      # 30 秒内未确认则取消
        message: "⚠️ 这是一个安全操作，请输入'确认'继续"
```

### 3.6 效果演示

**场景一：语音控制**

```
用户:  我回来了（语音触发）

Agent: （语音回复）欢迎回家，已为您打开客厅灯和空调
       （自动化执行）
       ✅ 客厅主灯 → 已打开（亮度 80%）
       ✅ 空调 → 已开启，设定温度 26°C
       ✅ 音箱 → 正在播放"轻松阅读"歌单
```

**场景二：状态查询**

```
用户:  家里现在温度怎么样？

Agent: 🌡️ 当前室内温度：
       - 客厅：26.3°C / 55%
       - 主卧：25.8°C / 60%
       - 厨房：27.1°C / 50%
       - 室外：22°C / 70%（小雨）
       
       建议关闭厨房窗户，外面在下雨。
```

**场景三：设备异常自动告警**

```
Agent: ⚠️ 检测到异常：
       
       ❌ 厨房烟雾报警器 — 离线（已离线 30 分钟）
       ❌ 大门门磁 — 门已敞开超过 15 分钟
       
       🛠️ 已自动尝试：重新连接烟雾报警器（失败）
       💡 建议：回家后检查烟雾报警器电池，
       同时大门请确认是否已关闭。
```

**场景四：晨间播报**

```
Agent: （语音自动播放）
       "早上好，今天是 5月15日，多云，22到28度。
       客厅 26度，卧室 25度，体感舒适。
       您今天有 3 个会议，第一个在 10 点。
       祝你有愉快的一天。"
```

### 3.7 部署要点

- **Home Assistant 版本**：需要 HA 2024.12 以上版本，WebSocket API 才完整支持设备控制
- **硬件推荐**：建议在树莓派 5（8GB）或 NUC 上部署，需确保运行 Gateway 的设备与 HA 在同一局域网内
- **语音唤醒**：使用 Porcupine 的离线唤醒词引擎，关键词可自定义（如"小雅小雅"），完全离线运行
- **本地 LLM 资源消耗**：Qwen 2.5 7B 量化版约占用 4GB 内存 + 部分 GPU 显存，树莓派上跑不动，建议使用更小的模型（如 Qwen 2.5 1.5B）或仅在 x86 主机上使用 7B 模型
- **Fail-safe 设计**：如果 Gateway 或 Brain 崩溃，设备应保持最后状态而不是全部关闭。HA 端配置 Automation 作为后备（例如"如果 10 分钟没有收到 Heartbeat，将所有设备设为安全状态"）

---

## 四、案例四：开发者工作流

### 4.1 场景描述

> "我不想为了看 CI 结果反复打开浏览器。我希望在终端里就能收到代码审查提醒、部署状态通知，甚至直接通过聊天创建 Issue。"

开发者工作流是 OpenClaw 与现有 DevOps 工具链融合的场景。核心需求是**将开发过程中的信息流汇集到一个地方**：不用在 Slack、邮箱、GitHub、CI 平台之间来回切换，所有通知通过一个 Agent 统一推送，所有操作也通过一个入口完成。

### 4.2 架构设计

```
┌────────────────────────────────────────────────────────────────────┐
│                     开发者工作流 — 架构总览                          │
│                                                                   │
│  用户侧                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐     │
│  │  CLI (终端)     │  │  Slack / Teams  │  │  Web 面板       │     │
│  │  直接输入指令    │  │  消息通知       │  │  仪表盘         │     │
│  └───────┬────────┘  └───────┬────────┘  └────────┬────────┘     │
│          └───────────────────┼────────────────────┘               │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                     Gateway 实例                             │   │
│  │                                                             │   │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │  Brain  │  │  Hands  │  │  Memory  │  │ Heartbeat│     │   │
│  │  │ (代码+   │  │ 沙箱执行 │  │ 项目记忆  │  │ CI 监控  │     │   │
│  │  │  技术专注)│  │         │  │          │  │ 调度     │     │   │
│  │  └────┬────┘  └────┬────┘  └────┬─────┘  └────┬─────┘     │   │
│  └───────┼────────────┼────────────┼──────────────┼───────────┘   │
│          ▼            ▼            ▼              ▼                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐         │
│  │ GitHub   │ │ GitLab   │ │  CI/CD   │ │  代码审查     │         │
│  │ 集成     │ │ 集成     │ │ Webhook  │ │  Skill       │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘         │
│       │            │            │               │                 │
│       ▼            ▼            ▼               ▼                 │
│  ┌──────┐   ┌────────┐  ┌───────────┐  ┌──────────────┐         │
│  │GitHub│   │ GitLab │  │ Jenkins / │  │ 内建          │         │
│  │ API  │   │ API    │  │ GitHub    │  │ 代码风格      │         │
│  │      │   │        │  │ Actions   │  │ 检查器        │         │
│  └──────┘   └────────┘  └───────────┘  └──────────────┘         │
└────────────────────────────────────────────────────────────────────┘
```

这个架构的特点是**事件驱动**：CI/CD Webhook 是主要的输入源之一（通过 Gateway 的 HTTP 端点），Heartbeat 负责定期巡检（检查 PR 待审查时间），用户主动查询是第三种输入。三者形成"推送 + 轮询 + 拉取"的完整信息流。

### 4.3 所需 Skills

| Skill 名称 | 来源 | 功能说明 | 依赖 |
|-----------|------|---------|------|
| `github-manager` | ClawHub 官方 | Issue/PR 管理、代码审查、Release 追踪 | GitHub Token, `gh` CLI |
| `gitlab-manager` | ClawHub 社区 | 类似 github-manager 但适配 GitLab | GitLab Token, `glab` CLI |
| `ci-notifier` | 自建 | 解析 CI/CD Webhook 结果并生成通知 | CI 平台 Webhook 配置 |
| `code-review` | 自建 | 对 PR 变更进行自动代码审查 | 审校规则配置文件 |
| `dev-summary` | 自建 | 每日/每周开发进度汇总 | Heartbeat 配置 |

```bash
# 安装社区 Skills
openclaw skill install clawhub:github-manager
openclaw skill install clawhub:gitlab-manager

# 安装自建 Skills
openclaw skill install git+https://github.com/team/openclaw-skills.git//ci-notifier
openclaw skill install git+https://github.com/team/openclaw-skills.git//code-review
openclaw skill install git+https://github.com/team/openclaw-skills.git//dev-summary

# 安装 CLI 工具依赖
brew install gh       # GitHub CLI
brew install glab     # GitLab CLI
```

### 4.4 核心配置

#### Agent 配置

```yaml
# ~/.openclaw/agents/dev-workflow/config.yaml
name: dev-workflow
description: "开发者工作流助手"

brain:
  provider: anthropic
  model: claude-sonnet-4-20250514
  maxTokens: 8192          # 代码审查需要更大的上下文
  temperature: 0.2         # 代码相关任务需要较高的准确性

skills:
  - github-manager
  - gitlab-manager
  - ci-notifier
  - code-review
  - dev-summary

memory:
  working:
    maxMessages: 30
  files:
    enabled: true
    baseDir: ./data/dev-workflow/memory/
  knowledge:
    enabled: true
    # 存储项目架构知识、编码规范等
    embeddings:
      provider: local

channels:
  - type: slack
    config:
      botToken: "{{SLACK_BOT_TOKEN}}"
      allowedChannels:
        - "#dev-notify"      # CI 和部署通知频道
        - "#code-review"     # PR 审查请求频道
  - type: terminal
    config:
      enabled: true
      # 允许在终端中直接与 Agent 对话
      promptPrefix: "> "

# Webhook 端点：接收 CI/CD 回调
webhooks:
  - path: /webhook/ci
    description: "接收 CI/CD 构建结果"
    skills: [ci-notifier]
    secret: "{{CI_WEBHOOK_SECRET}}"
  - path: /webhook/github
    description: "接收 GitHub 事件"
    skills: [github-manager]
    secret: "{{GITHUB_WEBHOOK_SECRET}}"
```

#### SOUL.md

```markdown
# 开发者工作流助手

## 身份定义
你是「DevBot」，团队的开发助手。你连接了 GitHub、GitLab 和 CI 系统，帮助团队管理代码和发布流程。

## 性格特点
- 技术问题回答精确，必要时给出命令示例
- 对 PR 的代码审查意见使用 "建议" 语气，而非命令
- 不要评价代码质量的好坏，只指出事实和潜在问题
- 涉及安全漏洞时使用 ⚠️ 标记重要性

## 工作范围
### 代码仓库管理
- 查询/创建/关闭 Issue
- 列出 PR/MR，查看详情和 diff
- 合并 PR（需要用户确认）
- 查看 Release 和 Tag

### CI/CD 监控
- 接收构建完成通知
- 自动分析失败原因
- 部署状态通报

### 代码审查
- 对 PR 的变更进行静态分析
- 检查是否符合团队编码规范
- 标记潜在的安全风险
- 注意：审查意见仅供参考，最终决定权在开发人员

## 沟通偏好
- 终端输出使用简洁的纯文本格式
- Slack 消息使用 markdown 格式
- 涉及超链接时，输出完整 URL 以便终端点击
- CI 失败消息需要包含：失败 Stage + 错误摘要 + 重现命令（如果有）
- 使用项目名缩写（如"core-api", "admin-panel"）

## 特殊指令
- 当 CI 构建失败时，主动在 #dev-notify 频道推送失败分析
- 当一个 PR 超过 24 小时未审查时，在 #code-review 频道 @ 相关人员
- 每周五 17:00 生成本周开发进展汇总
- 当检测到新的安全漏洞 Issue 时，立即推送到 #dev-notify
```

#### CI Webhook 处理 + Heartbeat 通知

```yaml
# 配置在 ci-notifier Skill 的配置文件中
# ~/.openclaw/skills/ci-notifier/config.yaml

name: ci-notifier
version: 1.0.0

webhooks:
  # CI 构建完成后的回调地址
  - path: /webhook/ci
    method: POST
    secret: "{{CI_WEBHOOK_SECRET}}"
    handler: |
      1. 解析请求体中的构建结果（success/failure）
      2. 提取：项目名、分支名、提交信息、失败Stage、错误日志摘要
      3. 构建结果推送到 Slack #dev-notify 频道
      4. 如果构建失败，调用 code-review Skill 生成失败分析

heartbeats:
  - name: stale-pr-check
    description: "检查超过 24 小时未审查的 PR"
    schedule: "0 10,16 * * 1-5"  # 工作日 10:00 和 16:00
    prompt: |
      执行以下操作：
      1. 查询所有开放 PR，筛选 lastReviewedAt < now - 24h 的
      2. 在 #code-review 频道 @ 相关的 reviewers
      3. 同时列出 PR 链接和标题
    output:
      channel: slack
      channelId: "#code-review"
  
  - name: weekly-summary
    description: "每周五 17:00 生成周报"
    schedule: "0 17 * * 5"
    prompt: |
      生成本周的开发周报：
      1. 查询本周合并的 PR 列表
      2. 查询本周创建的 Issue 和已关闭的 Issue
      3. 查询本周的 Release 和 Tag
      4. 汇总为周报格式
      周报模板：
      ## 📊 开发周报 — {日期范围}
      
      ### 合并的 PR: {N} 个
      {PR 列表}
      
      ### Issue 动态
      - 新建: {N} | 关闭: {M} | 进行中: {K}
      
      ### 发布
      - {版本号} — {发布日期}
      
      ### 代码统计
      - 总增删行数: +{A} / -{D}
      - 涉及仓库: {列表}
      
      ### ⚠️ 待办事项
      - 未分配 Issue: {N} 个
      - 待审查 PR: {M} 个
    output:
      channel: slack
      channelId: "#dev-notify"
```

### 4.5 关键技术决策

**Slack 频道分流 vs 单一频道**

开发者工作流涉及多种类型的通知（CI 结果、PR 提醒、周报），将它们分到不同的 Slack 频道有显著好处：
- `#dev-notify`：所有自动化通知，开发人员可以选择静音或关注
- `#code-review`：专门用于 PR 审查请求，避免被其他通知淹没
- 个人 DM：用户可以私信 Bot 查询个人相关的问题

**自建 code-review Skill 的定位**

`code-review` Skill 不替代人工 Code Review，而是做机械性的预检查——编码风格一致性、常见安全模式（SQL 注入、XSS）、依赖安全漏洞等。这些是 LLM 擅长且不会因为疲劳而遗漏的。复杂的逻辑评审和架构决策仍然需要人来做。Skill 的 SOUL.md 中明确写了"审查意见仅供参考，最终决定权在开发人员"，这既是对团队文化的尊重，也是法律责任边界的声明。

**Webhook 安全**

CI/CD Webhook 的端点暴露在公网上，安全设计至关重要：
1. **Secret 验证**：每个 Webhook 端点配置 `secret`，Gateway 在接收请求时验证签名
2. **来源 IP 白名单**：仅在配置中允许 CI 平台（如 GitHub Actions 的 IP 段）调用
3. **只读优先**：Webhook 处理的 Skill 只有读取和通知权限，不能主动合并 PR
4. **速率限制**：每个 Webhook 端点有每秒 10 次的调用上限

### 4.6 效果演示

**场景一：终端查询**

```
用户:  > 看看我的待审查 PR

Agent: 📋 你有 3 个待审查的 PR：

       1. core-api #234 feat: 添加用户权限缓存
          作者: @zhangsan | 等待: 8h | 文件: 12 | +245/-67
          → https://github.com/team/core-api/pull/234

       2. admin-panel #89 fix: 修复日期选择器时区问题
          作者: @lisi | 等待: 2h | 文件: 3 | +34/-12
          → https://github.com/team/admin-panel/pull/89

       3. docs-site #45 chore: 更新部署文档
          作者: @wangwu | 等待: 30h ⚠️ | 文件: 1 | +18/-9
          → https://github.com/team/docs-site/pull/45

       💡 #45 已等待超过 24 小时，建议优先审查。
```

**场景二：CI 失败自动通知**

```
# Slack #dev-notify 频道

Agent: ❌ CI 构建失败 — core-api (main)

       构建 #3421 | 提交: a3f2b1e "fix: 修复订单查询超时"
       
       🔴 失败 Stage: test (integration)
       
       📋 错误摘要:
       ```
       FAIL tests/integration/order.test.ts (48.3s)
       × should handle concurrent order creation
       
       AssertionError: expected 200 to be 201
         at OrderService.createOrder (src/services/order.ts:142)
       ```
       
       💡 可能原因：并发场景下事务冲突未处理
       🔗 构建链接: https://ci.team.com/core-api/3421
       
       @zhangsan 请检查 order.ts:142 附近的并发处理逻辑。
```

**场景三：创建 Issue**

```
用户:  帮我创建一个 Issue：core-api 项目，标题是"优化慢查询接口"，
       描述是"用户列表接口 /api/users 在 10 万数据量下响应超过 5 秒，
       需要加索引和分页"，标签为 performance，指派给李四。

Agent: ✅ Issue 已创建：
       
       📌 core-api #235 — 优化慢查询接口
       ├ 描述: 用户列表接口 /api/users 在 10 万数据量下响应超过 5 秒...
       ├ 标签: performance
       ├ 负责人: @lisi
       └ 链接: https://github.com/team/core-api/issues/235
```

**场景四：周报推送**

```
Agent: 📊 开发周报 — 5月12日 ~ 5月16日

       ### 合并的 PR: 14 个
       - core-api: 5 个 PR（权限缓存、慢查询修复等）
       - admin-panel: 3 个 PR（时区修复、表单优化等）
       - docs-site: 2 个 PR（部署文档更新）
       - mobile-app: 4 个 PR（支付流程优化）

       ### Issue 动态
       - 新建: 8 | 关闭: 6 | 进行中: 12

       ### 发布
       - core-api v2.3.0 — 5月14日
       - admin-panel v1.8.1 — 5月15日

       ### 代码统计
       - 总增删: +3,245 / -1,876
       - 涉及仓库: 4 个

       ### ⚠️ 待办事项
       - 未分配 Issue: 3 个
       - 待审查 PR: 2 个（请相关 reviewer 尽快处理）
```

### 4.7 部署要点

- **GitHub Token 权限**：`github-manager` Skill 需要的 Token 至少要有 `repo` 和 `read:org` 权限。如果使用 GitHub App 安装，权限粒度更精细
- **Webhook 公网可达**：CI/CD Webhook 需要 Gateway 的 HTTP 端口能从 CI 平台访问。如果在内网部署，可以使用 ngrok 或 frp 做反向代理
- **CLI 模式的终端集成**：OpenClaw 的 Terminal Channel 支持在终端中直接与 Agent 对话。建议在 shell 配置中添加 alias：`alias devbot='openclaw channel terminal --agent dev-workflow'`
- **日志级别调整**：开发者场景 Agent 的交互频率较高，建议将 Heartbeat 任务的日志级别设为 `info`，用户对话的日志级别设为 `debug`，方便排查问题
- **成本控制**：代码审查需要 `maxTokens: 8192`，每次审查的 Token 消耗较大。建议限制每个 PR 的自动审查频率（每个 PR 仅审查一次，后续变更不再重复审查），避免无谓的 API 调用费用

---

## 五、案例对比与选型建议

四个案例覆盖了 OpenClaw 在不同场景下的典型用法。它们之间的关键差异可以帮助你确定哪个模板最适合自己的需求：

| 对比维度 | 个人信息助手 | 团队协作 Bot | 智能家居中枢 | 开发者工作流 |
|---------|------------|-------------|------------|------------|
| **用户数** | 1 人 | 5-50 人 | 家庭 2-5 人 | 团队 5-20 人 |
| **部署位置** | 本地笔记本 / NAS | 云服务器 | 树莓派 / 家庭服务器 | 云服务器 / 内网 |
| **LLM 选型** | 云端（Sonnet） | 云端（Sonnet） | 本地优先（Qwen+云端） | 云端（Sonnet） |
| **关键 Channel** | Telegram | Slack | 语音 + TTS | Slack + CLI |
| **主要 Skills** | 3 个外部 | 5 个（含自建） | 2 个 + 3 个 MCP | 5 个（含自建） |
| **Heartbeat 密度** | 1 次/天 | 1-2 次/天 | 每 15 分钟 | 2-3 次/天 |
| **安全等级** | 低（仅自己） | 中（多用户隔离） | 高（物理安全） | 中（代码权限） |
| **记忆需求** | 用户偏好 | 频道隔离 | 空间拓扑 | 项目知识 |
| **典型月 Token 消耗** | ~500K | ~2M | ~1M（本地不计） | ~5M |
| **上手复杂度** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 5.1 通用最佳实践清单

无论你选择哪个案例，以下实践同样适用：

1. **所有配置写入版本控制**：将 `~/.openclaw/` 目录进行 Git 管理（排除包含 Token 的配置文件），方便回滚和迁移
2. **渐进式启用 Heartbeat**：Heartbeat 产生持续 Token 消耗，建议先观察一周后再决定优化策略（参考第 10 章）
3. **从 Telegram Channel 起步**：Telegram 是对开发者最友好的消息平台——注册 Bot 免费、API 文档完善、调试方便。其他平台可以在稳定后再接入
4. **定期审查 Skill 权限**：每个 Skill 安装时都会声明所需权限（读文件、执行命令、网络访问），定期用 `openclaw skill audit` 检查是否有多余的权限声明
5. **设置月度成本预算**：在 Brain 配置中设置 `monthlyTokenBudget`。一旦当月 Token 消耗超出预算，Agent 自动进入节能模式（降级为更便宜的模型、降低 Heartbeat 频率）
6. **配置日志自动轮转**：第 09 章的日志配置是必须的——当你的 Agent 运行了三个月后出问题，没有日志你将无从下手

### 5.2 从案例到生产环境

这四个案例的设计可以交叉组合。例如，你可以将个人信息助手中的晨报功能与开发者工作流中的 CI 通知结合起来——在早晨的日报中同时包含天气和昨晚的构建结果。你也可以将团队的 Slack Bot 扩展出智能家居控制能力，在办公室场景中控制会议室设备。

组合的关键是保持 SOUL.md 的身份一致性。如果在一个 Agent 中混入了"个人助理"和"开发助手"两种身份，LLM 在不同上下文中会出现行为漂移。原则是：**一个 Agent 一个身份，能力扩展通过 Skills 而非身份混淆**。当需求复杂到单一身份无法覆盖时，使用多 Agent 路由（如案例二所示）分离职责。

---

## 延伸阅读

- 第 01 章 — Gateway 架构：理解单进程事件循环如何承载多 Channel 并发
- 第 05 章 — Heartbeat 调度引擎：深入定时任务的工作机制和性能考量
- 第 07 章 — Skill 开发进阶：学习如何自建案例中的自定义 Skills
- 第 08 章 — SOUL.md 人设工程：掌握 Agent 身份设计的方法论
- 第 09 章 — 部署与运维：将案例从本地开发环境迁移到生产环境
- 第 11 章 — 安全模型：理解案例三中的物理安全约束和案例四的 Webhook 安全
