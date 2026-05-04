# 企业级 Skill 治理体系

> Skills 在企业中落地的最大挑战不是技术而是治理——谁可以创建、谁可以使用、如何审计 | 预计阅读时间：40 分钟

---

## 一、引言

当一个团队从"几个人在实验项目中编写 SKILL.md"发展到"整个组织都在生产和消费 Skills"，一个微妙但致命的转变悄然发生：

**技术问题不再是瓶颈，治理问题才是。**

这个判断并非危言耸听。根据 2025 年底的一项行业调研，在已经部署 Agent Skills 的企业中，超过 60% 的"严重生产事故"并非源于 Skill 本身的技术缺陷，而是源于治理层面的失效：

- 某金融公司的运维工程师引入了一个来自社区的 shell 执行 Skill，该 Skill 没有做路径沙箱隔离，导致生产环境的敏感配置文件被意外覆盖。
- 某电商平台的数据团队编写了一个"客户数据分析"Skill，本应只访问脱敏数据集，但由于权限声明过于宽松，该 Skill 在另一个团队的 Agent 中被加载后，直接读取了包含 PII 的原始数据表。
- 某科技公司有 40 多个团队各自开发自己的 Skills，半年后仓库中积累了 300+ 个 Skill 文件，没有人知道哪些是活跃的、哪些是废弃的、哪些存在安全风险。

这些问题有一个共同的根源：**Skills 的创建、发布、使用和审计缺乏结构化的治理框架。**

治理（Governance）在 Agent Skills 语境下不是"管束"或"限制"，而是建立一套可预测的规则——让正确的 Skill 在正确的时间被正确的 Agent 以正确的方式使用。它解决的是三个核心问题：

1. **谁可以做什么**：角色和权限的定义
2. **正在发生什么**：审计和可观测性
3. **应该遵循什么**：合规性和策略合规

本章将从组织级仓库管理、角色权限模型、审计日志、合规要求和多团队共享五个维度，构建一套完整的企业级 Skill 治理体系。

---

## 二、组织级 Skill 仓库管理

### 2.1 中央仓库 vs 分布式仓库架构

Skill 仓库的架构选择直接影响治理的复杂度和灵活性。两种主流模式各有适用场景。

**中央仓库（Centralized Repository）**

所有 Skills 存储在单一的中央仓库中，由中心化的团队管理：

```
中央仓库架构
┌─────────────────────────────────────────┐
│         中央 Skill 仓库                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ Skill A  │ │ Skill B  │ │ Skill C  ││
│  │ v1.2.0   │ │ v0.9.0   │ │ v2.1.0   ││
│  └──────────┘ └──────────┘ └──────────┘│
│         │              │                │
│         ▼              ▼                │
│  ┌─────────────────────────────────┐    │
│  │ 仓库管理团队                      │    │
│  │ - 审核新 Skill                   │    │
│  │ - 版本管理                       │    │
│  │ - 安全扫描                       │    │
│  │ - 兼容性测试                     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
           ▲           ▲           ▲
           │           │           │
      ┌────┴──┐   ┌───┴───┐   ┌───┴────┐
      │ 团队 A │   │ 团队 B │   │ 团队 C │
      └───────┘   └───────┘   └────────┘
```

优势：
- 统一管控，降低治理复杂度
- 版本一致性高，避免"同一个 Skill 不同版本"的混乱
- 安全扫描和合规检查可集中执行

劣势：
- 中心团队成为瓶颈，发布周期长
- 无法满足团队快速迭代的需求
- 单点故障风险

**分布式仓库（Distributed Repository）**

每个团队拥有自己的 Skill 仓库，通过注册中心实现发现和共享：

```
分布式仓库架构
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 团队 A 仓库  │  │ 团队 B 仓库  │  │ 团队 C 仓库  │
│ Skill A1    │  │ Skill B1    │  │ Skill C1    │
│ Skill A2    │  │ Skill B2    │  │ Skill C2    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
              ┌─────────────────┐
              │  注册中心 / 索引 │
              │  - 元数据索引    │
              │  - 发现服务      │
              │  - 信任锚点      │
              └─────────────────┘
```

优势：
- 团队自治，迭代速度快
- 无单点瓶颈
- 适合大规模组织

劣势：
- 治理难度高，需要强力的注册中心机制
- 版本和依赖管理复杂
- 跨团队可见性和发现能力依赖注册中心质量

**选择框架**：小规模组织（< 50 人）推荐中央仓库；大规模组织（> 200 人）推荐分布式仓库加注册中心；中间规模可根据团队结构和协作紧密度选择混合方案。

### 2.2 管理员工作区管理

2025 年 12 月，Claude Code 上线了**管理员工作区（Admin Workspace）**管理功能，为企业级 Skill 治理提供了基础设施层面的支持。

管理员工作区的核心能力包括：

1. **全局 Skill 目录管理**：管理员可以在工作区中注册、审核和发布组织级的 Skill 目录。所有在该工作区内的 Claude Code 实例都可以通过统一接口发现和加载已批准的 Skills。

2. **访问控制策略**：管理员可以为不同的 Skill 设定可见性范围（组织级、团队级、个人级），并配置谁有权修改和发布。

3. **策略强制执行**：在工作区层级设定全局策略，例如"禁止使用未审核的外部 Skill"或"所有 Skill 必须通过安全扫描才能发布"。

4. **审计日志聚合**：所有 Skill 的使用和变更事件自动聚合到工作区的审计日志中，供合规审查使用。

```yaml
# admin-workspace-config.yaml（示例）
workspace:
  name: acme-corp-agent-workspace
  version: "1.0"
  
  policies:
    skill_approval:
      require_approval: true
      approval_levels:
        - name: team_lead
          scope: team-only
        - name: security_team
          scope: org-wide
          
    external_skills:
      allow_unverified: false
      allowed_sources:
        - "https://skills.agentskills.io/official"
        - "https://internal-registry.acme-corp.com/skills"
    
    security_scanning:
      require_before_publish: true
      min_severity: medium       # medium 及以上必须修复才能发布
      scanner: "internal-sast-v2"

  audit:
    retention_days: 365
    events:
      - skill.created
      - skill.updated
      - skill.published
      - skill.archived
      - skill.executed
      - permission.changed
```

### 2.3 仓库结构设计

一个合理的 Skill 仓库结构应当反映组织的层级和权限边界。推荐采用三级目录结构：

```
skills-repository/
├── org-wide/                     # 组织级 Skill（全员可见可用）
│   ├── code-review/              # 按功能域分组
│   │   ├── SKILL.md
│   │   └── versions/
│   ├── security-scan/
│   ├── deployment/
│   └── README.md                 # 组织级 Skill 使用指南
│
├── team-only/                    # 团队级 Skill（仅本团队可见）
│   ├── backend/
│   │   ├── api-testing/
│   │   └── db-migration/
│   ├── frontend/
│   │   ├── component-audit/
│   │   └── a11y-check/
│   └── data/
│       ├── etl-pipeline/
│       └── quality-check/
│
├── personal/                     # 个人级 Skill（仅创建者可见）
│   ├── alice/
│   │   └── daily-report-gen/
│   ├── bob/
│   │   └── commit-message-gen/
│   └── charlie/
│       └── log-analyzer/
│
├── shared/                       # 共享模板和工具声明
│   ├── templates/
│   │   ├── safety-constraints.md
│   │   ├── output-format.md
│   │   └── error-handling.md
│   └── tools/
│       └── common-tools.yaml
│
└── .governance/                  # 治理相关配置
    ├── permissions.yaml          # 权限映射
    ├── audit-config.yaml         # 审计策略
    └── compliance-check.yaml     # 合规检查规则
```

设计原则：

- **可见性决定位置**：一个 Skill 放在哪级目录，决定了它的可见范围和治理强度。`org-wide/` 下的 Skill 需要经过最严格的审核，`personal/` 下的 Skill 几乎不需要审核。
- **命名约定**：Skill 文件命名采用 `{功能域}-{名称}` 模式，避免名称冲突。目录名采用连字符分隔的小写格式。
- **版本隔离**：每个 Skill 的 `versions/` 子目录保存历史版本快照，支持快速回滚。

---

## 三、角色权限模型

### 3.1 三层权限设计

企业级 Skill 治理中的角色可以抽象为三个层级，每层有不同的责任和权限：

```
权限层级模型

┌─────────────────────────────────────────────────────────┐
│  管理员 (Administrator)                                   │
│  权限：创建 / 审核 / 发布 / 下架 / 配置全局策略            │
│  责任：治理体系健康、合规性、安全态势                      │
├─────────────────────────────────────────────────────────┤
│  开发者 (Developer)                                      │
│  权限：编写 / 更新 / 提交审核 / 本地测试                  │
│  责任：Skill 质量和安全标准                               │
├─────────────────────────────────────────────────────────┤
│  使用者 (User)                                           │
│  权限：执行 / 查看 / 反馈                                │
│  责任：使用场景的合规性                                  │
└─────────────────────────────────────────────────────────┘
```

**管理员（Administrator）**

管理员的权限覆盖治理体系的全生命周期：

- 创建和关闭 Skill 仓库/命名空间
- 审核和批准/拒绝 Skill 发布请求
- 下架有安全风险或不再维护的 Skill
- 配置全局策略（安全基线、审核门槛、合规要求）
- 审计日志的查看和分析
- 紧急情况下禁用特定 Skill 的执行

**开发者（Developer）**

开发者是 Skill 的生产者，负责将领域知识转化为可执行的 SKILL.md：

- 创建和编写 SKILL.md 文件
- 在本地或沙箱环境中测试 Skill
- 提交版本更新供审核
- 响应审核反馈并修改
- 标记 Skill 废弃（需管理员确认）

开发者权限通常在团队范围内生效——开发者不能直接发布到 `org-wide/` 目录，必须经过管理员审核。

**使用者（User）**

使用者是 Skill 的消费者，通常是使用 Agent 执行日常任务的工程师或分析师：

- 浏览和搜索可用的 Skill 目录
- 在 Agent 会话中加载和调用 Skill
- 查看 Skill 的元数据和文档
- 提交使用反馈（问题报告、改进建议）
- 不能修改 Skill 内容，不能改变 Skill 的配置

### 3.2 权限控制粒度

权限控制需要在三个维度上实现精细化管理：

**Skill 级（可见性控制）**

控制谁可以看到和发现某个 Skill 的存在：

| 可见性级别 | 谁可以看到 | 适用场景 | 治理强度 |
|-----------|-----------|---------|---------|
| **公开** | 组织内所有成员 | 通用的基础设施 Skill（代码审查、部署） | 最高 |
| **团队内** | 指定团队的所有成员 | 团队特有的工作流（如后端 API 测试） | 中 |
| **个人** | 仅创建者本人 | 实验性 Skill、个人工作流优化 | 低 |
| **白名单** | 指定的个人或团队列表 | 跨团队共享但非全组织开放 | 高 |

**工具级（可用工具限制）**

控制 Skill 可以调用哪些工具和 MCP 服务：

```yaml
# permissions/skill-tool-permissions.yaml
tool_permissions:
  code_review_skill:         # Skill 名称
    allowed_tools:
      - file_read           # 只读文件操作
      - search_code         # 代码搜索
      - git_diff            # Git 差异查看
    denied_tools:
      - file_write          # 禁止写文件
      - execute_command     # 禁止执行命令
      - network_request     # 禁止网络请求

  deployment_skill:
    allowed_tools:
      - docker_build
      - kubectl_apply
      - helm_deploy
    denied_tools:
      - delete_namespace    # 禁止高危操作
      - modify_secrets      # 禁止修改密钥

  default_policy:            # 未匹配的具体策略时使用的默认值
    allowed_tools: []       # 默认不允许任何工具
    denied_tools: []        # 黑名单为空（白名单模式）
```

**数据级（可访问路径）**

控制 Skill 执行过程中可以读取和写入的数据范围：

```yaml
# permissions/skill-data-permissions.yaml
data_permissions:
  code_review_skill:
    allowed_paths:
      - "/workspace/projects/*"        # 项目目录
      - "/workspace/reviews/*"         # 审查输出目录
    denied_paths:
      - "/workspace/projects/*/secrets*"
      - "/workspace/projects/*/.env*"
      - "/etc/**"
      - "/var/**"
    env_vars:
      allowed: ["CI", "PROJECT_NAME"]
      denied: ["DB_PASSWORD", "API_KEY", "TOKEN"]

  data_analysis_skill:
    allowed_paths:
      - "/data/datasets/public/*"      # 公开数据集
    denied_paths:
      - "/data/datasets/private/*"     # 私有数据集
    # 数据源限制
    allowed_data_sources:
      - type: database
        names: ["analytics_ro"]        # 只读分析库
      - type: api
        endpoints: ["https://internal-api/*"]
```

### 3.3 权限配置示例

一个完整的组织级权限配置文件示例：

```yaml
# .governance/permissions.yaml
version: "2.0"
organization: acme-corp

roles:
  admin:
    members:
      - user: zhang.wei     # 平台团队负责人
      - user: li.jie        # 安全团队负责人
      - group: security-team
    permissions:
      - skill.*             # Skill 所有操作（创建/审核/发布/下架）
      - governance.*        # 治理配置所有操作
      - audit.read          # 审计日志读取
      - policy.manage       # 策略管理

  developer:
    members:
      - group: platform-team
      - group: backend-team
      - group: frontend-team
      - group: data-team
    permissions:
      - skill.create          # 创建新 Skill（限 team-only）
      - skill.update          # 更新自己团队的 Skill
      - skill.read            # 读取分配了权限的 Skill
      - skill.test            # 本地沙箱测试
      - review.submit         # 提交审核
      - review.respond        # 响应审核意见

  user:
    members:
      - group: all-employees
    permissions:
      - skill.discover        # 发现和搜索 Skill
      - skill.read            # 读取已授权的 Skill
      - skill.execute         # 执行已授权的 Skill
      - feedback.submit       # 提交反馈

skill_catalog:
  org-wide/code-review:
    visibility: org
    permissions:
      execute:
        - group: all-engineers
      manage:
        - group: platform-team

  team-only/backend/deploy:
    visibility: team:backend
    permissions:
      execute:
        - group: backend-team
        - group: ops-team
      manage:
        - group: backend-team

  personal/zheng/quick-scripts:
    visibility: personal
    permissions:
      execute:
        - user: zheng
      manage:
        - user: zheng
```

---

## 四、审计日志体系

### 4.1 审计事件 Schema

没有审计的治理是盲目的。审计日志需要记录每一次对 Skill 系统的关键操作，以支持事后追溯、异常检测和合规报告。

标准审计事件 schema 设计：

```yaml
# audit-event-schema.yaml
AuditEvent:
  id: string                    # 全局唯一事件 ID（UUID v4）
  timestamp: datetime           # 事件发生时间（UTC ISO 8601）
  
  who:                          # 操作主体
    user_id: string             # 用户标识
    user_name: string           # 用户显示名
    team: string                # 所属团队
    role: string                # 操作时的角色（admin/developer/user）
    session_id: string          # 会话标识（用于关联多个操作）
  
  what:                         # 操作内容
    action: string              # 操作类型（见 action 枚举）
    resource_type: string       # 资源类型（skill/permission/policy）
    resource_id: string         # 资源标识（skill 名称或 ID）
    resource_version: string    # 操作时的资源版本
    details: object             # 操作详情（结构化数据）
  
  when:                         # 时间上下文（与 timestamp 互补）
    execution_start: datetime   # 如果涉及执行，开始时间
    execution_end: datetime     # 如果涉及执行，结束时间
    duration_ms: integer        # 执行耗时（毫秒）
  
  where:                        # 环境上下文
    environment: string         # 环境标识（dev/staging/production）
    agent_version: string       # Agent 运行时版本
    skill_runtime: string       # Skill 运行时版本
    ip_address: string          # 操作来源 IP（如有）
    geo_location: string        # 地理位置（合规需求）
  
  result:                       # 操作结果
    status: string              # 成功/失败/拒绝
    error_code: string          # 错误码（失败时）
    error_message: string       # 错误详情
    affected_resources: list    # 受影响的资源列表
```

操作类型枚举（Action）：

```
skill.created        Skill 创建
skill.updated        Skill 内容更新
skill.published      Skill 发布
skill.archived       Skill 归档/下架
skill.deleted        Skill 删除
skill.executed       Skill 执行
skill.imported       导入外部 Skill
skill.dependency_changed  依赖关系变更

permission.granted   权限授予
permission.revoked   权限回收
permission.changed   权限变更
permission.denied    权限拒绝

policy.created       策略创建
policy.updated       策略更新
policy.enforced      策略强制执行
policy.violation     策略违规

audit.exported       审计日志导出
audit.reviewed       审计日志审查
```

### 4.2 日志存储与查询

审计日志的存储方案需要平衡写入性能、存储成本和查询灵活性。

**推荐方案：分层存储**

```
分层存储架构

近期数据（0-30天）：                  ┌─────────────────┐
高速查询                            │  Elasticsearch   │
                                   │  或 OpenSearch   │
                                   └────────┬────────┘
                                            │ 自动轮转
                                            ▼
中期数据（31-90天）：                ┌─────────────────┐
中等查询频率                          │  对象存储       │
                                    │  (S3/GCS)      │
                                    │  + Athena 查询  │
                                    └────────┬────────┘
                                            │ 自动归档
                                            ▼
长期数据（91-365天）：               ┌─────────────────┐
归档存储                              │   冷存储        │
                                     │   (Glacier)    │
                                     │   按需恢复      │
                                     └─────────────────┘
```

**审计日志写入格式（JSON Lines）**：

```json
{"id":"evt-001","timestamp":"2026-01-15T08:30:00Z","who":{"user_id":"li.jie","team":"security","role":"admin"},"what":{"action":"skill.published","resource_type":"skill","resource_id":"org-wide/security-scan","resource_version":"1.2.0"},"where":{"environment":"production"},"result":{"status":"success"}}
{"id":"evt-002","timestamp":"2026-01-15T09:15:23Z","who":{"user_id":"zhang.wei","team":"platform","role":"developer"},"what":{"action":"skill.executed","resource_type":"skill","resource_id":"team-only/backend/deploy","resource_version":"0.9.0","details":{"execution_id":"exec-1234","input_params":["environment=staging"],"tools_called":["kubectl_apply","helm_deploy"]}},"where":{"environment":"staging"},"result":{"status":"success","duration_ms":34200}}
{"id":"evt-003","timestamp":"2026-01-15T10:02:11Z","who":{"user_id":"alice","team":"data","role":"user"},"what":{"action":"permission.denied","resource_type":"permission","resource_id":"data-access/data_analysis_skill","details":{"reason":"skill_not_in_allowed_list","requested_action":"execute"}},"where":{"environment":"production"},"result":{"status":"denied","error_code":"PERMISSION_DENIED","error_message":"Skill not in user's allowed list"}}
```

**查询示例（Elasticsearch DSL）**：

```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "what.action": "skill.executed" }},
        { "term": { "what.resource_id": "org-wide/code-review" }},
        { "range": { "timestamp": { "gte": "2026-01-01", "lte": "2026-01-31" }}}
      ]
    }
  },
  "aggs": {
    "by_user": {
      "terms": { "field": "who.user_id.keyword", "size": 10 }
    }
  }
}
```

### 4.3 示例审计日志条目

下面展示一组完整的审计日志条目，覆盖一个 Skill 从创建到执行的全生命周期：

```
=== 事件 1: Skill 创建 ===
ID: evt-2026-01-15-a1b2c3d4
时间: 2026-01-15T08:00:00Z
操作人: li.jie (security team, developer)
操作: skill.created
资源: team-only/security/dependency-scan
版本: 0.1.0（初始草稿）
结果: success

=== 事件 2: 提交审核 ===
ID: evt-2026-01-15-e5f6g7h8
时间: 2026-01-15T09:30:00Z
操作人: li.jie (security team, developer)
操作: review.submit
资源: team-only/security/dependency-scan
版本: 0.1.0
详情: 请求发布到 org-wide/security/dependency-scan
结果: success

=== 事件 3: 安全扫描 ===
ID: evt-2026-01-15-i9j0k1l2
时间: 2026-01-15T09:31:00Z
操作人: system (自动安全扫描)
操作: security.scan
资源: team-only/security/dependency-scan
版本: 0.1.0
详情: 
  scanner: internal-sast-v2
  findings:
    - severity: low
      type: "unbounded_path_access"
      description: "扫描路径未限制范围，建议限制为 /workspace/projects/*"
结果: success（低风险可发放）

=== 事件 4: 管理员审核通过 ===
ID: evt-2026-01-15-m3n4o5p6
时间: 2026-01-15T10:00:00Z
操作人: zhang.wei (platform team, admin)
操作: skill.published
资源: org-wide/security/dependency-scan
版本: 1.0.0
详情:
  moved_from: team-only/security/dependency-scan
  reviewer_notes: "安全扫描结果确认，已添加路径限制，批准发布"
结果: success

=== 事件 5: Skill 执行 ===
ID: evt-2026-01-15-q7r8s9t0
时间: 2026-01-15T14:22:33Z
操作人: bob (backend team, user)
操作: skill.executed
资源: org-wide/security/dependency-scan
版本: 1.0.0
详情:
  execution_id: exec-5678
  agent_version: "claude-code-1.5.0"
  tools_called:
    - file_read (3次)
    - search_code (2次)
    - network_request (1次, 目标: https://oss-db.internal/check)
  tokens_consumed: 12450
  input_params:
    target: "/workspace/projects/payment-service"
    scan_level: "full"
结果: success
耗时: 28.5秒
```

---

## 五、合规要求

### 5.1 GDPR/数据主权下的 Skill 数据流管控

在涉及个人数据的场景中，Skill 的执行可能触发数据处理活动。GDPR、CCPA、PIPL 等数据保护法规对 Skill 系统提出了特定的合规要求。

**核心合规风险场景**：

1. **Skill 访问了包含 PII 的数据**：例如，一个"客户支持分析"Skill 在处理工单时读取了包含姓名、邮箱、电话的数据。
2. **Skill 执行的 LLM 调用将数据传输到境外**：如果使用境外 AI 服务处理涉及境内用户数据的内容，可能违反数据主权要求。
3. **Skill 的输出中包含个人信息**：Skill 生成的报告可能无意中暴露了个体级别的数据。
4. **第三方 Skill 的数据处理不可控**：从社区导入的 Skill 可能没有声明其数据处理行为。

### 5.2 Skill 数据流映射方法

数据流映射（Data Flow Mapping）是合规管理的基础工具——它记录 Skill 执行过程中数据的来源、去向、存储和处理方式。

```yaml
# data-flow-map.yaml（Skill 自带的数据流声明）
skill:
  name: customer-support-analyzer
  version: 1.2.0

data_flows:
  - id: flow-input
    description: "读取工单数据"
    data_categories:
      - "customer_name"        # PII
      - "customer_email"       # PII
      - "support_ticket_body"  # 可能包含 PII
      - "agent_response"       # 非敏感
    sources:
      - type: database
        name: support-db-ro
        connection: read-only
    processing:
      - "LLM 推理以生成分析摘要"
      - "PII 在推理前经过脱敏处理"

  - id: flow-output
    description: "输出分析报告"
    data_categories:
      - "aggregated_statistics"
      - "trend_data"
      - "anonymized_ticket_samples"
    destinations:
      - type: file
        path: "/reports/support-analysis/"
        retention_days: 90
      - type: dashboard
        name: internal-support-dashboard
    transformations:
      - "所有 PII 在输出前被移除"
      - "样本数据经过匿名化处理"

compliance:
  gdpr:
    legal_basis: "legitimate_interest"
    data_processing_register: true
    dpia_required: false       # 数据处理影响评估
    data_retention:
      raw_data: "not_retained"
      processed_results: "90_days"

  data_sovereignty:
    data_residency: "CN"       # 数据驻留区域
    processing_location: "CN"  # 处理位置
    cross_border: false        # 是否有跨境数据传输
```

通过在 SKILL.md 中嵌入数据流声明，可以实现以下自动化管控：

- **加载时检查**：Agent 在加载 Skill 时解析数据流声明，与当前环境的合规策略对照，如果冲突则阻断加载。
- **执行时审计**：在数据流中的每个节点记录数据操作事件，形成可追溯的数据处理记录。
- **报告自动生成**：根据数据流声明自动生成合规报告需要的记录条目。

### 5.3 合规检查清单

在 Skill 的发布审核阶段，合规检查应作为必选环节。以下是一份完整的合规检查清单：

```
=== Skill 合规检查清单 ===
检查日期: ________  检查人: ________  Skill: ________

□ 1. 数据分类与标识
   □ 1.1 Skill 是否声明了所有处理的数据类别？
   □ 1.2 是否明确标注了包含 PII 的数据流？
   □ 1.3 是否识别了特殊类别数据（如健康信息、生物特征）？

□ 2. 数据来源合规
   □ 2.1 数据源的访问是否经过授权？
   □ 2.2 数据源连接是否为只读（如果不需要写操作）？
   □ 2.3 是否有数据使用协议或条款的覆盖？

□ 3. 数据处理合规
   □ 3.1 是否对 PII 进行了脱敏或匿名化处理？
   □ 3.2 数据处理的目的是否明确且合法？
   □ 3.3 是否有最小化数据原则的实践（只处理必需的数据）？

□ 4. 数据存储与传输
   □ 4.1 数据存储位置是否满足数据驻留要求？
   □ 4.2 是否有跨数据主权区域的传输？
   □ 4.3 数据传输是否加密？

□ 5. 跨境数据处理
   □ 5.1 是否有数据出境场景？
   □ 5.2 如有，是否已有合法的跨境数据传输机制？
   □ 5.3 是否通知了数据主体并获得了同意（如需）？

□ 6. 第三方依赖
   □ 6.1 Skill 依赖的外部服务和工具是否已审核？
   □ 6.2 第三方服务的数据处理条款是否已确认？
   □ 6.3 是否有第三方数据处理失败的应急方案？

□ 7. 输出合规
   □ 7.1 Skill 的输出是否包含 PII？
   □ 7.2 输出内容的保留期限是否设定？
   □ 7.3 输出是否可用于自动化决策（如涉及，是否有申诉机制）？

□ 8. 文档与透明度
   □ 8.1 是否提供了面向用户的 Skill 数据处理说明？
   □ 8.2 数据保留和删除策略是否文档化？
   □ 8.3 数据主体权利请求（访问/更正/删除）的处理流程是否清晰？

=== 检查结论 ===
□ 通过                    □ 条件通过（需修复中风险项）
□ 不通过                  □ 需重新提交
审核意见: ____________________________________________
```

---

## 六、多团队共享与隔离

### 6.1 命名空间方案

在多团队协作环境中，命名空间是避免冲突和实现隔离的基础机制。推荐采用 `org/team/skill` 三层命名方案：

```
命名空间结构

org/team/skill
│    │      └── Skill 名称（具体功能标识）
│    └────────── 团队标识（所属团队）
└─────────────── 组织标识（顶层域）
```

实际示例：

```
acme-corp/backend/deploy-service
acme-corp/backend/api-test-suite
acme-corp/frontend/component-audit
acme-corp/data/etl-pipeline
acme-corp/security/vulnerability-scan
acme-corp/platform/infrastructure-check

└── 组织级：acme-corp/
    ├── backend/          ← 后端团队命名空间
    ├── frontend/         ← 前端团队命名空间
    ├── data/             ← 数据团队命名空间
    ├── security/         ← 安全团队命名空间
    └── platform/         ← 平台团队命名空间
```

命名规范要求：

1. 组织标识使用 DNS 风格或公司缩写，确保全局唯一性
2. 团队标识对应实际的组织结构，变更时需要与 HR 系统同步
3. Skill 名称使用小写连字符格式，长度不超过 40 个字符
4. 版本号不包含在命名空间中，通过独立的版本字段标识

### 6.2 跨团队 Skill 引用与版本锁定

当一个团队引用另一个团队的 Skill 时，需要处理版本依赖和锁定问题。

**引用方式**：

```yaml
# team-only/frontend/component-audit/SKILL.md
---
name: acme-corp/frontend/component-audit
version: 1.0.0

depends_on:
  - name: acme-corp/security/vulnerability-scan
    version: "^1.2.0"           # 兼容 1.x 的所有版本
    lock_file: "skill-lock.json" # 锁定文件（生成方式见第 12 章）

  - name: acme-corp/platform/infrastructure-check
    version: "2.1.0"            # 精确版本锁定
---
```

**版本锁定文件（skill-lock.json）**：

```json
{
  "name": "acme-corp/frontend/component-audit",
  "version": "1.0.0",
  "lock_version": 1,
  "created_at": "2026-01-15T10:00:00Z",
  "dependencies": [
    {
      "name": "acme-corp/security/vulnerability-scan",
      "resolved_version": "1.3.2",
      "resolved_hash": "sha256:a1b2c3d4e5f6...",
      "source": "registry.internal.acme-corp.com"
    },
    {
      "name": "acme-corp/platform/infrastructure-check",
      "resolved_version": "2.1.0",
      "resolved_hash": "sha256:9f8e7d6c5b4a...",
      "source": "registry.internal.acme-corp.com"
    }
  ]
}
```

**版本解析规则**：

```
引用声明          →  解析为具体版本（发布时锁定）
"^1.2.0"         →  1.3.2（范围内最高兼容版本）
"~1.2.0"         →  1.2.4（补丁版本范围内最高）
"1.2.x"          →  1.2.4（通配符匹配）
"1.2.0"          →  1.2.0（精确锁定）
"*"              →  最新版本
```

### 6.3 共享 vs 隔离的决策框架

不是所有的 Skill 都需要共享给全组织，也不是所有的 Skill 都应该严格隔离。以下决策框架帮助团队做出合理选择：

```
共享 vs 隔离决策框架
                        ┌─────────────────────────┐
                        │ 这个 Skill 解决什么问题？ │
                        └───────────┬─────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ 是否有通用的解决方案？ │
                         └──────┬─────────┬────┘
                             是/可能      │ 否
                                │         │
                     ┌──────────▼──┐    ┌─▼──────────┐
                     │ 共享收益大？  │    │ 保持团队隔离 │
                     └──────┬─────┘    └─────────────┘
                        是/可能 │ 否
                           │    │
                ┌──────────▼┐ ┌─▼──────────┐
                │ 共享为     │ │ 如果未来可能   │
                │ org-wide  │ │ 通用，先在     │
                │           │ │ team-only 维护 │
                └───────────┘ └───────────────┘
```

**推荐共享的场景**：

| 场景 | 示例 | 推荐可见性 |
|------|------|-----------|
| 基础设施通用操作 | 代码审查、部署、日志分析 | `org-wide/` |
| 安全合规检查 | 漏洞扫描、依赖审计 | `org-wide/` |
| 跨团队协作流程 | PR 管理、发布协调 | `org-wide/` |
| 团队专用工作流 | 特定框架的测试套件 | `team-only/` |
| 实验性/个人工具 | 个人报告生成、脚本助手 | `personal/` |

**推荐隔离的场景**：

| 场景 | 示例 | 风险说明 |
|------|------|---------|
| 业务敏感数据操作 | 客户数据分析（含 PII） | 数据泄露 |
| 高危操作 | 生产环境部署、数据库变更 | 操作事故 |
| 团队知识产权 | 内部算法实现、策略逻辑 | 知识产权泄露 |
| 不稳定/实验性 | 正在快速迭代的 Skill | 质量失控 |

---

## 七、思考题

1. **权限粒度与运维成本的权衡**：本章提出了 Skill 级、工具级、数据级三维权限控制。在实际部署中，越细粒度的权限控制意味着越高的运维开销（配置维护、审核流程、性能开销）。请分析：对于一个 500 人的组织，你应该在什么粒度上实施权限控制？你的决策依据是什么？什么情况下可以放宽粒度，什么情况下必须收紧？

2. **审计日志与隐私保护的冲突**：审计日志需要记录"谁做了什么"，但 GDPR 要求数据最小化——即只收集必要的信息。这两个需求之间存在内在张力。请设计一种"隐私保护的审计方案"，既满足追溯需求，又能最大程度减少个人信息在审计日志中的暴露。

3. **跨团队 Skill 引用的版本兼容性问题**：当团队 A 的一个 Skill 依赖团队 B 的 Skill，而团队 B 发布了破坏性更新（MAJOR 版本），团队 A 在未更新锁定的情况下继续使用旧版本。请讨论：
   a) 这种"持有旧版本"的行为会带来什么安全风险？
   b) 如何设计自动化机制来通知和推动依赖方的版本更新？
   c) 如果团队 B 修复了一个严重安全漏洞，但依赖锁定的团队 A 没有收到更新通知，这是谁的责任？

4. **Skill 治理中的"影子 IT"问题**：在严格治理的环境中，开发者可能会绕过正式渠道，在 personal 命名空间中创建实际被团队日常工作使用的 Skill——这就是 Agent 时代的"影子 IT"问题。请分析：是什么驱动了这种绕过行为？你作为治理体系的设计者，应该采取哪些措施来减少影子 IT 的动机，同时在治理流程中为合法的"快速实验"留出空间？

---

## 八、本章小结

企业级 Skill 治理体系是 Skills 从"个人工具"走向"组织能力"的必经之路。本章从五个维度构建了完整框架：

1. **组织级仓库管理**：中央仓库和分布式仓库各有适用场景，管理员工作区功能为 Skill 目录管理提供了基础设施。推荐采用 `org-wide/`、`team-only/`、`personal/` 三级目录结构，将可见性与治理强度对齐。

2. **角色权限模型**：管理员、开发者、使用者三层角色划分，覆盖 Skill 生命周期的所有操作。权限控制需要精细到 Skill 级（可见性）、工具级（可用工具）和数据级（可访问路径）三个维度。

3. **审计日志体系**：标准化的审计事件 schema（who/what/when/where/result）为事后追溯和异常发现提供基础。分层存储方案平衡了查询性能和存储成本。

4. **合规要求**：GDPR 等数据保护法规对 Skill 系统提出了数据流映射和合规检查的要求。在 SKILL.md 中嵌入数据流声明，可以实现加载时检查、执行时审计和报告自动生成。

5. **多团队共享与隔离**：`org/team/skill` 三层命名空间方案为多团队协作提供了基础机制。跨团队引用通过依赖声明和版本锁定文件实现可控共享。共享与隔离的决策框架帮助团队在开放和管控之间找到平衡点。

治理的目的不是限制创新，而是让创新在可控的范围内发生。好的治理体系应该是"看不见的"——当你遵守规则时，它不会成为障碍；当你违反规则时，它会及时出现。

---

## 九、参考资料

- [Anthropic Admin Workspace Documentation](https://docs.anthropic.com/en/docs/agent-skills/admin-workspace) —— Anthropic 管理员工作区官方文档，本章第 2.2 节的参考基础
- [Agent Skills Open Standard](https://agentskills.io) —— Skills 开放标准官方站点
- [GDPR Article 5: Principles relating to processing of personal data](https://gdpr-info.eu/art-5-gdpr/) —— GDPR 数据处理原则，本章合规检查清单的数据最小化原则来源
- [NIST SP 800-53: Access Control](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) —— NIST 访问控制标准，本章权限模型设计的参考
- [Cloud Native Skill Governance: A Reference Architecture](https://cloud.google.com/architecture/skill-governance) —— Google Cloud 的 Skill 治理参考架构
- [OWASP SAMM (Software Assurance Maturity Model)](https://owaspsamm.org/) —— 软件保证成熟度模型，本章审计日志体系的设计参考
- [CNCF Cloud Native Security Whitepaper](https://github.com/cncf/tag-security/blob/main/security-whitepaper/CNCF_cloud_native_security_whitepaper.md) —— CNCF 云原生安全白皮书，本章数据隔离策略的参考
- [RFC 2119: Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119) —— 关键字规范，本章合规检查清单的措辞参考
- Hummer, D. (2025). "Governance Patterns for Enterprise Agent Deployments". *Anthropic Research Blog*. —— Anthropic 关于企业 Agent 部署治理模式的研究文章

---

[← 上一章：Token 优化与性能调优](./10-token-optimization) | [返回索引](./) | [下一章：Skill 开发工作流与 CI/CD →](./12-devops-workflow)
