# Skill 开发工作流与 CI/CD

> Skill 和代码一样需要工程化管理——CI/CD 不是可选项而是必需品 | 预计阅读时间：40 分钟

---

## 一、引言

假设这样一个场景：你在本地编写了一个 SKILL.md，手动测试了一两个场景，感觉没问题，直接提交到了主分支。第二天，平台团队收到告警——生产环境的代码审查 Agent 行为异常，输出的审查报告中缺失了严重安全问题的标记。

调查发现：昨天提交的"小改动"在指令中漏写了一个"不"字，将"不忽略 critical 级安全问题"写成了"忽略 critical 级安全问题"。一字之差，导致整个安全审查体系失去作用，而这个错误在提交前没有被任何检查机制捕捉到。

这个场景暴露了一个核心问题：**Skill 开发和软件代码开发一样需要工程化的质量保障流程。**

任何人不会将未经测试、未经审查、未经安全扫描的代码直接部署到生产环境。但面对 SKILL.md——一份直接影响 Agent 行为的生产级指令文件——很多团队却抱着"不就是写点文档吗"的心态，跳过了所有工程化步骤。

这种双重标准是危险的。SKILL.md 不是"文档"，而是**运行时策略**。它被 Agent 解析执行，直接影响工具调用、数据访问和业务决策。它是一个有副作用的可执行指令，和代码一样需要：

- **本地验证**：编写阶段的语法检查和 Schema 校验
- **自动化测试**：工具调用序列和行为正确性的验证
- **安全扫描**：潜在安全风险（如未限制的路径访问）的检测
- **发布审批**：版本发布前的审核门禁
- **生产监控**：部署后的行为监控和异常告警

本章将建立一套完整的 Skill DevOps 管道，涵盖从本地开发到生产部署的六个阶段，并给出具体的工具链配置和 CI/CD 集成方案。

---

## 二、完整 DevOps 管道

### 2.1 六阶段管道

Skill 的 DevOps 管道包含六个阶段，每个阶段有明确的输出物和判定标准：

```
Skill DevOps 管道

 阶段 1           阶段 2           阶段 3           阶段 4           阶段 5           阶段 6
┌────────┐     ┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐
│ 编写   │ ──> │ 本地   │ ──>  │ 自动化 │ ──>  │ 安全   │ ──>  │ 发布   │ ──>  │ 生产   │
│       │     │ 验证   │      │ 测试   │      │ 扫描   │      │ 审批   │      │ 部署   │
├────────┤     ├────────┤      ├────────┤      ├────────┤      ├────────┤      ├────────┤
│ 编辑   │     │ Schema │      │ 单元   │      │ SAST   │      │ 人工   │      │ 灰度   │
│ SKILL. │     │ 校验   │      │ 测试   │      │ 扫描   │      │ 审核   │      │ 发布   │
│ md     │     │        │      │        │      │        │      │        │      │        │
│        │     │ 工具   │      │ 集成   │      │ 依赖   │      │ 版本   │      │ 全量   │
│        │     │ 声明   │      │ 测试   │      │ 审查   │      │ 标签   │      │ 发布   │
│        │     │ 完整   │      │        │      │        │      │        │      │        │
│        │     │ 性     │      │ Mock   │      │ 秘密   │      │ CHAN-  │      │ 监控   │
│        │     │        │      │ 执行   │      │ 检测   │      │ GELOG  │      │ 告警   │
│        │     │ 引用   │      │        │      │        │      │ 更新   │      │        │
│        │     │ 完整   │      │        │      │        │      │        │      │        │
│        │     │ 性     │      │        │      │        │      │        │      │        │
└────────┘     └────────┘      └────────┘      └────────┘      └────────┘      └────────┘
    │              │               │               │               │               │
    ▼              ▼               ▼               ▼               ▼               ▼
输出:       输出:           输出:           输出:           输出:           输出:
SKILL.md  验证报告       测试报告        安全报告        发布确认       部署确认
           (pass/fail)   (覆盖率/通过率) (风险等级)      (版本号)       (健康状态)
```

### 2.2 各阶段的工具链与判定标准

**阶段 1：编写**

| 项目 | 内容 |
|------|------|
| 工具 | VS Code / 任意文本编辑器 + claw CLI |
| 活动 | 编写或修改 SKILL.md 文件 |
| 输出 | 原始 SKILL.md 文件 |
| 判定标准 | 文件语法正确，YAML frontmatter 可解析 |

**阶段 2：本地验证**

| 项目 | 内容 |
|------|------|
| 工具 | `claw validate` / 自定义 Schema 校验器 |
| 活动 | Schema 校验、工具声明完整性检查、引用完整性检查 |
| 输出 | 验证报告（通过/失败 + 错误详情） |
| 判定标准 | 所有 Schema 字段合规；所有引用的工具和依赖可解析 |
| 失败处理 | 输出具体错误位置和修正建议，阻止进入下一阶段 |

**阶段 3：自动化测试**

| 项目 | 内容 |
|------|------|
| 工具 | Skill 测试框架（如 `claw test` 或自定义测试套件） |
| 活动 | 单元测试（元数据）+ 集成测试（Mock 工具调用）+ E2E 测试 |
| 输出 | 测试报告（通过率、覆盖率、失败详情） |
| 判定标准 | 单元测试 100% 通过；集成测试覆盖所有主要执行路径 |
| 失败处理 | 标记失败的测试用例，提供 Mock 执行日志供开发者调试 |

**阶段 4：安全扫描**

| 项目 | 内容 |
|------|------|
| 工具 | SAST 扫描器（如 `claw scan` 或集成安全工具） |
| 活动 | 指令安全分析、路径访问范围检查、依赖漏洞扫描 |
| 输出 | 安全扫描报告（风险等级、发现列表、修复建议） |
| 判定标准 | 无 high/critical 级风险项；medium 级风险项有合理解释 |
| 失败处理 | blocking 级别的问题阻止发布，提供修复指引 |

**阶段 5：发布审批**

| 项目 | 内容 |
|------|------|
| 工具 | 代码审查平台（GitHub PR / GitLab MR）+ 审批工作流 |
| 活动 | 人工审核 Skill 变更内容；版本标签创建；CHANGELOG 更新 |
| 输出 | 审核通过的版本发布确认 |
| 判定标准 | 至少 1 名 maintainer 审批通过；版本号符合 SemVer 规范 |
| 失败处理 | 审核者提供反馈，开发者修改后重新提交 |

**阶段 6：生产部署**

| 项目 | 内容 |
|------|------|
| 工具 | CI/CD pipeline + 注册中心（如 internal registry） |
| 活动 | Canary 灰度发布 → 健康监控 → 全量发布 |
| 输出 | 部署确认、健康检查报告 |
| 判定标准 | Canary 阶段无错误率上升；全量发布后关键指标正常 |
| 失败处理 | 自动回滚到上一版本 |

### 2.3 管道示意图（ASCII）

```
                    Skill 开发到部署的完整流程
                                                    
           ┌──────────────────────────────────────────────┐
           │              开发者工作站                      │
           │  ┌──────────┐    ┌──────────────┐            │
           │  │ 编辑       │    │ claw validate │            │
           │  │ SKILL.md  │───>│ Schema 校验   │─── 通过 ──┐│
           │  └──────────┘    └──────────────┘            ││
           │                                              ││
           │  ┌──────────────┐    ┌─────────────┐         ││
           │  │ claw test    │    │ claw scan    │         ││
           │  │ 自动化测试    │───>│ 安全扫描      │─── 通过 ││
           │  └──────────────┘    └─────────────┘         ││
           └──────────────────────────────────────────────┘│
                                                            ▼
           ┌──────────────────────────────────────────────┐
           │                 Git 仓库                      │
           │                                              │
           │  ┌──────────────────────────────────────┐    │
           │  │  Push / PR ──> pre-commit hooks       │    │
           │  │  ┌──────────────┐  ┌─────────────┐   │    │
           │  │  │ Schema 校验   │  │ 集成测试    │   │    │
           │  │  └──────────────┘  └─────────────┘   │    │
           │  │  ┌──────────────┐  ┌─────────────┐   │    │
           │  │  │ 安全扫描     │  │ 依赖审查     │   │    │
           │  │  └──────────────┘  └─────────────┘   │    │
           │  └──────────────────────────────────────┘    │
           └──────────────────────────────────────────────┘
                                                            ▼
           ┌──────────────────────────────────────────────┐
           │              CI/CD Pipeline                   │
           │                                              │
           │  触发: PR merge 或 tag push                   │
           │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
           │  │ 验证阶段  │─>│ 测试阶段  │─>│ 扫描阶段  │  │
           │  └──────────┘  └──────────┘  └──────────┘  │
           │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
           │  │ 审批阶段  │─>│ 灰度发布  │─>│ 全量发布  │  │
           │  └──────────┘  └──────────┘  └──────────┘  │
           └──────────────────────────────────────────────┘
                                                            ▼
           ┌──────────────────────────────────────────────┐
           │             生产环境                           │
           │                                              │
           │  ┌──────────────────────────────────────┐    │
           │  │  Agent Registry / Skill Registry      │    │
           │  │  - v1.0.0 (上一版本, 回滚可用)         │    │
           │  │  - v1.1.0 (当前版本, 健康)            │    │
           │  │  - v1.2.0 (灰度中, 5% 流量)           │    │
           │  └──────────────────────────────────────┘    │
           └──────────────────────────────────────────────┘
```

---

## 三、claw CLI 高级用法

claw CLI 是 Skill 开发和治理的命令行工具集，支持从本地验证到生产发布的完整流程。以下介绍其高级用法。

### 3.1 批量验证：`claw validate -r .`

在拥有大量 Skill 的仓库中，逐个验证是低效的。`claw validate` 的递归模式支持对整个仓库进行批量验证：

```bash
# 验证当前目录下的所有 SKILL.md 文件
claw validate -r .

# 输出示例
[PASS] org-wide/code-review/SKILL.md v1.2.0
[PASS] org-wide/security-scan/SKILL.md v2.0.1
[FAIL] team-only/backend/api-test/SKILL.md v0.9.0
  └─ Error: tools.read_file 声明但未在 frontmatter.tools 中列出
  └─ Warning: dependencies[0].version 范围 "^1.x" 过于宽泛，建议使用精确范围
[PASS] personal/alice/log-analyzer/SKILL.md v0.1.0
[WARN] personal/bob/script-gen/SKILL.md v0.2.0
  └─ Warning: 建议添加 description 字段

Summary: 12 passed, 1 failed, 1 warning
```

常用参数：

```bash
# 限制到特定目录
claw validate -r ./org-wide

# 排除目录
claw validate -r . --exclude personal/

# 输出 JSON 格式结果（便于 CI 解析）
claw validate -r . --format json

# 指定 Schema 版本
claw validate -r . --schema-version 2.0

# 严格模式（将 Warning 升级为 Error）
claw validate -r . --strict
```

### 3.2 依赖锁定：`claw lock`

依赖锁定确保 Skill 的可重复构建——在不同时间、不同环境下锁定相同版本的依赖：

```bash
# 为当前 SKILL.md 生成锁定文件
claw lock

# 为仓库中所有 SKILL.md 生成锁定文件
claw lock -r .

# 更新已过期的锁定
claw lock -r . --update

# 检查锁定是否最新（用于 CI 检查）
claw lock --check
# 输出示例:
# [OK] org-wide/code-review: skill-lock.json 是最新的
# [STALE] org-wide/security-scan: skill-lock.json 已过期 (1.3.0 可用, 锁定 1.2.2)
# [MISSING] team-only/frontend/lint: 缺少 skill-lock.json
```

锁定文件示例（`skill-lock.json`）：

```json
{
  "name": "org-wide/code-review",
  "version": "1.2.0",
  "lock_version": 2,
  "created_at": "2026-02-01T10:00:00Z",
  "updated_at": "2026-02-15T14:30:00Z",
  "resolved_dependencies": [
    {
      "name": "org-wide/tool-definitions/git-tools",
      "resolved_version": "2.1.3",
      "resolved_hash": "sha256:a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
      "source_url": "https://registry.internal.acme-corp.com/skills/org-wide/tool-definitions/git-tools/2.1.3/SKILL.md"
    },
    {
      "name": "team-only/security/vulnerability-db",
      "resolved_version": "1.0.5",
      "resolved_hash": "sha256:9f8e7d6c5b4a3210fedcba9876543210fedcba9876543210fedcba9876543210",
      "source_url": "https://registry.internal.acme-corp.com/skills/team-only/security/vulnerability-db/1.0.5/SKILL.md"
    }
  ],
  "integrity": {
    "algorithm": "sha256",
    "self_hash": "a1b2c3d4..."
  }
}
```

### 3.3 版本发布：`claw publish --tag v1.2.0`

版本发布命令将经过验证的 Skill 发布到注册中心：

```bash
# 基本发布
claw publish --tag v1.2.0

# 发布到指定注册中心
claw publish --tag v1.2.0 --registry https://registry.internal.acme-corp.com

# 发布并生成 CHANGELOG
claw publish --tag v1.2.0 --changelog

# 发布前强制运行所有检查
claw publish --tag v1.2.0 --check

# Canary 发布（仅 10% 流量）
claw publish --tag v1.2.0 --canary 10

# 带发布说明
claw publish --tag v1.2.0 \
  --notes "新增 XSS 检测模块; 优化输出格式; 修复依赖路径问题"
```

发布流程内部检查清单：

```
claw publish --check 执行的项目:

☐ Schema 校验 - YAML frontmatter 是否符合当前 Schema 版本
☐ 工具声明完整 - tools 字段中声明的工具在指令体中都有对应使用
☐ 引用完整性 - imports/depends_on 中所有引用可解析
☐ 依赖锁定 - skill-lock.json 存在且为最新
☐ 测试通过 - 最近一次的测试结果为通过
☐ 安全扫描 - 无 high/critical 风险项
☐ 版本一致性 - SKILL.md 中的版本号与 tag 一致
☐ 版本递增 - 新版本号大于已发布的最高版本号
☐ CHANGELOG 更新 - CHANGELOG.md 包含本次变更内容
```

### 3.4 本地沙箱测试：`claw run --dry-run`

在不调用真实工具的情况下模拟 Skill 执行，验证指令执行流程和工具调用序列：

```bash
# 干运行（不调用真实工具，只输出工具调用计划）
claw run --dry-run

# 指定输入参数
claw run --dry-run --input '{"target": "/workspace/project", "scan_level": "full"}'

# 输出工具调用序列为 JSON
claw run --dry-run --format json > plan.json

# 带 Mock 数据运行
claw run --dry-run --mock-file ./test/fixtures/mock-responses.yaml

# 限制执行步骤（调试用）
claw run --dry-run --max-steps 5
```

干运行输出示例：

```json
{
  "skill": "org-wide/code-review",
  "version": "1.2.0",
  "mode": "dry-run",
  "execution_plan": {
    "steps": [
      {
        "step": 1,
        "phase": "analyze",
        "tool": "file_read",
        "expected_params": {
          "path": "/workspace/project/package.json"
        },
        "mock_response": {
          "content": "{ \"name\": \"my-app\", \"dependencies\": {...} }"
        },
        "condition": "always"
      },
      {
        "step": 2,
        "phase": "analyze",
        "tool": "search_code",
        "expected_params": {
          "pattern": "eval\\(",
          "paths": ["/workspace/project/src"]
        },
        "mock_response": {
          "results": []
        },
        "condition": "step_1_success"
      }
    ],
    "warnings": [
      "步骤 2 的搜索模式 'eval\\(' 可能产生空结果，建议添加 fallback 处理"
    ],
    "estimated_tokens": 3400
  }
}
```

---

## 四、pre-commit hooks

### 4.1 自动化检查链

在 Git 的 pre-commit 阶段插入 Skill 检查，是防止有问题的 Skill 进入仓库的第一道防线。推荐的检查链包括三个环节：

```
pre-commit 检查链

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Schema 校验   │───>│ 单元测试     │───>│ 安全扫描     │
│             │    │             │    │             │
│ 检查 YAML    │    │ 验证元数据    │    │ 路径越权     │
│ frontmatter │    │ 检查工具     │    │ 依赖漏洞     │
│ 引用完整性   │    │ 声明一致性   │    │ 秘密泄露     │
│ 依赖可解析   │    │ 基础断言     │    │ 危险命令     │
│             │    │             │    │             │
│ 耗时: <1s   │    │ 耗时: 2-5s  │    │ 耗时: 3-10s │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                 │                   │
       └─────────────────┼───────────────────┘
                         │
                    ┌────▼────┐
                    │ 任何环   │
                    │ 节失败?  │
                    └────┬────┘
                    ┌────┴────┐
                    │         │
                  是/         │ 否
                    │         │
                    ▼         ▼
              ┌────────┐  ┌────────┐
              │ 阻止    │  │ 允许    │
              │ commit  │  │ commit  │
              └────────┘  └────────┘
```

### 4.2 `.pre-commit-config.yaml` 完整配置

```yaml
# .pre-commit-config.yaml
repos:
  # 基础 Schema 校验
  - repo: https://github.com/agentskills/pre-commit-hooks
    rev: v2.1.0
    hooks:
      - id: skill-validate
        name: Skill Schema Validation
        description: "验证 SKILL.md 的 YAML frontmatter 是否符合 Schema"
        entry: claw validate
        args: ["--strict"]
        files: 'SKILL\.md$'
        stages: [commit]

      - id: skill-lock-check
        name: Skill Lock File Check
        description: "检查 skill-lock.json 是否最新"
        entry: claw lock --check
        files: 'SKILL\.md$'
        stages: [commit]

  # 自动化测试
  - repo: https://github.com/agentskills/skill-testing
    rev: v1.3.0
    hooks:
      - id: skill-unit-test
        name: Skill Unit Tests
        description: "运行 Skill 单元测试（元数据 + 工具声明）"
        entry: claw test --type unit
        files: 'SKILL\.md$'
        stages: [commit]
        verbose: true

      - id: skill-integration-test
        name: Skill Integration Tests
        description: "运行 Mock 环境下的集成测试"
        entry: claw test --type integration
        files: 'SKILL\.md$'
        stages: [push]       # 集成测试较慢，在 push 阶段运行
        verbose: true

  # 安全扫描
  - repo: https://github.com/agentskills/security-hooks
    rev: v1.1.0
    hooks:
      - id: skill-sast
        name: Skill SAST Scan
        description: "静态安全扫描 Skill 指令"
        entry: claw scan
        args: ["--severity", "medium"]
        files: 'SKILL\.md$'
        stages: [commit]

      - id: skill-secrets
        name: Secrets Detection
        description: "检测 SKILL.md 中是否包含硬编码的秘密"
        entry: detect-secrets
        files: 'SKILL\.md$'
        stages: [commit]

  # 通用检查
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
        files: 'SKILL\.md$'
      - id: end-of-file-fixer
        files: 'SKILL\.md$'
      - id: check-yaml
        files: 'SKILL\.md$'
```

### 4.3 Hook 失败的处理流程

当 pre-commit hook 失败时，开发者需要按照以下流程处理：

```
Hook 失败处理流程

                    ┌─────────────────────┐
                    │  pre-commit hook 失败 │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  查看失败信息          │
                    │  claw 会输出具体错误    │
                    │  位置和修正建议        │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                    │
            ▼                  ▼                    ▼
    ┌────────────────┐ ┌────────────────┐  ┌────────────────┐
    │ Schema 错误     │ │ 测试失败        │  │ 安全风险        │
    │                │ │                │  │                │
    │ 修复 YAML 格式  │ │ 查看失败用例     │  │ 查看风险详情     │
    │ 补充缺失字段     │ │ 修正指令逻辑     │  │ 修复漏洞         │
    │ 修正引用路径     │ │ 添加缺失断言     │  │ 收紧路径限制     │
    │                │ │                │  │ 移除危险指令     │
    │ 重新 git add    │ │ 重新 git add    │  │                │
    │ 重新 git commit │ │ 重新 git commit │  │ 如果风险已确认   │
    └────────────────┘ └────────────────┘  │ 但无法立即修复:  │
                                           │ 1. 添加 --no-verify│
                                           │ 2. 记录问题到 Issue│
                                           │ 3. 设置修复截止日期│
                                           └────────────────┘
                                                    │
                                                    ▼
                                           ┌────────────────┐
                                           │ 仅限紧急情况     │
                                           │ 使用 --no-verify │
                                           │ 必须附带 Issue   │
                                           │ 链接 + 截止日期  │
                                           └────────────────┘
```

::: warning 安全警告
`git commit --no-verify` 应被严格限制使用。建议在组织层面实施策略：任何跳过的 pre-commit 检查必须在对应的 commit message 中注明原因和 issue 链接。

```
# 允许的 --no-verify 提交信息格式
git commit -m "fix: 临时绕过安全扫描（原因：安全扫描器误报，见 ISSUE-442）" --no-verify
```
:::

---

## 五、版本发布策略

### 5.1 灰度发布：Canary 部署方案

Skills 的 Canary 部署与微服务的 Canary 部署思路类似——先向一小部分流量或用户暴露新版本，观察行为正确性后逐步放量。

```
Canary 发布流程

                              ┌──────────────┐
                              │ 发布 v1.2.0   │
                              └──────┬───────┘
                                     │
                         ┌───────────▼───────────┐
                         │  Canary 阶段 1: 5% 流量 │
                         │  观察时间: 30 分钟       │
                         │  监控指标:              │
                         │   - 错误率              │
                         │   - 执行耗时             │
                         │   - 输出格式正确性        │
                         └───────────┬───────────┘
                                     │
                      ┌──────────────┴──────────────┐
                      │                              │
                  正常/                              │ 异常
                      │                              │
          ┌───────────▼───────────┐                  │
          │  Canary 阶段 2: 20%    │                  │
          │  观察时间: 60 分钟      │                  │
          │  更多指标:              │                  │
          │   - Token 消耗变化     │                  │
          │   - 工具调用序列稳定性  │                  │
          └───────────┬───────────┘                  │
                      │                              │
                      │ 正常                          │
                      │                              ▼
          ┌───────────▼───────────┐          ┌───────────────┐
          │  Canary 阶段 3: 50%    │          │  自动回滚     │
          │  观察时间: 120 分钟     │          │  触发告警     │
          └───────────┬───────────┘          │  分析根因     │
                      │                      └───────────────┘
                      │ 正常
                      ▼
          ┌───────────────────────┐
          │  全量发布: 100%        │
          │  标记为 stable 版本    │
          └───────────────────────┘
```

Canary 发布配置示例（与 CI/CD 集成）：

```yaml
# canary-config.yaml
canary:
  enabled: true
  stages:
    - name: canary-5pct
      traffic_percentage: 5
      observation_period: 30m      # 观察 30 分钟
      metrics:
        - name: error_rate
          threshold: 0.01          # 错误率 < 1%
        - name: p95_latency
          threshold: 30000         # P95 延迟 < 30 秒
        - name: output_validity
          threshold: 0.99          # 输出格式正确性 > 99%

    - name: canary-20pct
      traffic_percentage: 20
      observation_period: 60m
      metrics:
        - name: error_rate
          threshold: 0.005
        - name: token_delta
          threshold: 0.15          # Token 消耗变化 < 15%
        - name: tool_call_anomaly
          threshold: 0.02          # 新工具调用出现率 < 2%

    - name: canary-50pct
      traffic_percentage: 50
      observation_period: 120m
      metrics:
        - name: error_rate
          threshold: 0.002
        - name: user_feedback_negative
          threshold: 5             # 用户负面反馈 < 5 条
```

### 5.2 回滚机制

一旦 Canary 或全量发布出现异常，需要快速回滚到上一个稳定版本。回滚机制的关键设计点：

**版本快照**：每次发布时，发布系统自动保存当前版本快照：

```bash
# 发布时自动创建版本快照
claw publish --tag v1.2.0 --snapshot

# 查看版本历史
claw history --skill org-wide/code-review

# 输出
# v1.2.0 (current) - 2026-03-01 - 状态: canary-20pct
# v1.1.0 (stable)  - 2026-02-15 - 状态: active
# v1.0.0           - 2026-01-20 - 状态: active
# v0.9.0           - 2026-01-10 - 状态: superseded
```

**快速回切**：回滚到指定版本：

```bash
# 一键回滚到上一个 stable 版本
claw rollback --skill org-wide/code-review

# 回滚到指定版本
claw rollback --skill org-wide/code-review --to v1.1.0

# 回滚并通知所有依赖方
claw rollback --skill org-wide/code-review --notify-dependents
```

**自动回滚条件**：

```yaml
# auto-rollback-config.yaml
auto_rollback:
  enabled: true
  
  # 触发条件（任一满足即触发）
  conditions:
    - metric: error_rate
      operator: ">"
      value: 0.05              # 错误率超过 5%
      duration: 5m             # 持续 5 分钟
    
    - metric: p95_latency
      operator: ">"
      value: 60000             # P95 延迟超过 60 秒
      duration: 3m
    
    - metric: token_consumption
      operator: ">"
      value: 2.0               # Token 消耗超过基线的 2 倍
      duration: 10m
  
  # 回滚动作
  actions:
    - type: rollback
      target: last-stable
    - type: notify
      channels:
        - slack: "#skill-alerts"
        - email: "platform-team@acme-corp.com"
    - type: disable
      # 禁用问题版本，防止再次加载
      version: "v1.2.0"
```

### 5.3 语义化版本自动化工具

手动维护版本号容易出错。推荐使用自动化工具管理 Skill 的版本号：

```bash
# 查看当前版本
claw version
# v1.1.0

# 自动升 PATCH（修复性变更）
claw version --patch
# v1.1.0 → v1.1.1

# 自动升 MINOR（功能增强）
claw version --minor
# v1.1.0 → v1.2.0

# 自动升 MAJOR（破坏性变更）
claw version --major
# v1.1.0 → v2.0.0

# 根据 Git 提交信息自动推断版本变更
claw version --detect
# 分析最近提交信息，决定升级类型
# "fix: ..." → PATCH
# "feat: ..." → MINOR
# "feat!: ..." 或 "BREAKING CHANGE: ..." → MAJOR
```

版本号自动检测的逻辑：

```
版本升级规则

┌────────────────────────────────────────────────────────────┐
│  Commit 前缀         →  版本升级类型                        │
│────────────────────────────────────────────────────────────│
│  fix: / fix(skill):   →  PATCH (1.1.0 → 1.1.1)             │
│  feat: / feat(skill): →  MINOR (1.1.0 → 1.2.0)             │
│  feat!:                →  MAJOR (1.1.0 → 2.0.0)             │
│  fix!:                 →  MAJOR (1.1.0 → 2.0.0)             │
│  BREAKING CHANGE:      →  MAJOR (1.1.0 → 2.0.0)             │
│  chore: / docs: / refactor: → PATCH (行为不变)              │
│────────────────────────────────────────────────────────────│
│  多个提交时的规则：取最高级                                  │
│  例: feat + fix → MINOR (因为 feat 要求 MINOR)              │
└────────────────────────────────────────────────────────────┘
```

---

## 六、CI/CD 配置示例

### 6.1 GitHub Actions Workflow

一个完整的 GitHub Actions 工作流，覆盖验证、测试、安全扫描和发布审批：

```yaml
# .github/workflows/skill-pipeline.yml
name: Skill CI/CD Pipeline

on:
  push:
    branches: [main]
    paths: ['**/SKILL.md', '**/skill-lock.json']
  pull_request:
    paths: ['**/SKILL.md', '**/skill-lock.json']
  workflow_dispatch:
    inputs:
      publish:
        description: 'Publish to registry?'
        type: boolean
        default: false

env:
  CLAW_VERSION: v2.1.0
  REGISTRY_URL: https://registry.internal.acme-corp.com

jobs:
  validate:
    name: "Phase 1-2: Schema Validation"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install claw CLI
        run: |
          curl -sSL https://github.com/agentskills/claw/releases/download/${{ env.CLAW_VERSION }}/claw-linux-amd64 -o /usr/local/bin/claw
          chmod +x /usr/local/bin/claw
      
      - name: Schema Validation
        run: |
          claw validate -r . --strict --format json > validation-report.json
      
      - name: Dependency Lock Check
        run: |
          claw lock --check --format json > lock-check-report.json
      
      - name: Upload Reports
        uses: actions/upload-artifact@v4
        with:
          name: validation-reports
          path: |
            validation-report.json
            lock-check-report.json
      
      - name: Fail if Validation Failed
        run: |
          if jq -e '.summary.failed > 0' validation-report.json > /dev/null 2>&1; then
            echo "::error::Schema validation failed"
            exit 1
          fi

  test:
    name: "Phase 3: Automated Testing"
    needs: [validate]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install claw CLI
        run: |
          curl -sSL https://github.com/agentskills/claw/releases/download/${{ env.CLAW_VERSION }}/claw-linux-amd64 -o /usr/local/bin/claw
          chmod +x /usr/local/bin/claw
      
      - name: Unit Tests
        run: |
          claw test --type unit --format json > unit-test-report.json
      
      - name: Integration Tests
        run: |
          claw test --type integration --format json > integration-test-report.json
      
      - name: Upload Reports
        uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: |
            unit-test-report.json
            integration-test-report.json
      
      - name: Check Test Results
        run: |
          UNIT_PASS=$(jq -r '.summary.passed' unit-test-report.json)
          INTEGRATION_PASS=$(jq -r '.summary.passed' integration-test-report.json)
          
          if [ "$UNIT_PASS" != "true" ]; then
            echo "::error::Unit tests failed"
            exit 1
          fi
          
          if [ "$INTEGRATION_PASS" != "true" ]; then
            echo "::error::Integration tests failed"
            exit 1
          fi
          
          echo "All tests passed!"

  security:
    name: "Phase 4: Security Scanning"
    needs: [test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install claw CLI
        run: |
          curl -sSL https://github.com/agentskills/claw/releases/download/${{ env.CLAW_VERSION }}/claw-linux-amd64 -o /usr/local/bin/claw
          chmod +x /usr/local/bin/claw
      
      - name: SAST Scan
        run: |
          claw scan --severity medium --format json > security-report.json
      
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: security-reports
          path: security-report.json
      
      - name: Check Security Findings
        run: |
          HIGH_CRITICAL=$(jq -r '.summary.high + .summary.critical' security-report.json)
          
          if [ "$HIGH_CRITICAL" -gt 0 ]; then
            echo "::error::High/Critical security findings found!"
            jq '.findings[] | select(.severity == "high" or .severity == "critical")' security-report.json
            exit 1
          fi
          
          echo "Security scan passed!"

  # PR 的审批门禁 - 要求管理员批准
  approval-gate:
    name: "Phase 5: Release Approval"
    needs: [security]
    if: github.event_name == 'workflow_dispatch' && github.event.inputs.publish == 'true'
    runs-on: ubuntu-latest
    environment:
      name: skill-publishing
      url: https://registry.internal.acme-corp.com/releases
    steps:
      - name: Wait for Approval
        run: echo "等待管理员审批..."
        # environment 配置要求至少 1 名批准者

  publish:
    name: "Phase 6: Production Deployment"
    needs: [approval-gate]
    if: github.event_name == 'workflow_dispatch' && github.event.inputs.publish == 'true'
    runs-on: ubuntu-latest
    environment:
      name: skill-production
    steps:
      - uses: actions/checkout@v4
      
      - name: Install claw CLI
        run: |
          curl -sSL https://github.com/agentskills/claw/releases/download/${{ env.CLAW_VERSION }}/claw-linux-amd64 -o /usr/local/bin/claw
          chmod +x /usr/local/bin/claw
      
      - name: Canary Publish (5%)
        run: |
          claw publish --tag $(claw version --show) --canary 5 --registry ${{ env.REGISTRY_URL }}
      
      - name: Wait for Canary Observation
        run: sleep 1800  # 等待 30 分钟观察
      
      - name: Check Canary Health
        run: |
          claw health --skill $(claw version --show) --registry ${{ env.REGISTRY_URL }} > canary-health.json
          
          HEALTHY=$(jq -r '.healthy' canary-health.json)
          if [ "$HEALTHY" != "true" ]; then
            echo "::error::Canary health check failed, initiating rollback"
            claw rollback --registry ${{ env.REGISTRY_URL }}
            exit 1
          fi
      
      - name: Full Publish
        run: |
          claw publish --tag $(claw version --show) --full --registry ${{ env.REGISTRY_URL }}
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v$(claw version --show)
          files: |
            **/SKILL.md
            **/skill-lock.json
```

### 6.2 GitLab CI Pipeline

适用于使用 GitLab 的团队：

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - test
  - security
  - approval
  - deploy

variables:
  CLAW_VERSION: "v2.1.0"
  REGISTRY_URL: "https://registry.internal.acme-corp.com"

cache:
  paths:
    - .claw/cache/

# 阶段 1-2：验证
validate:
  stage: validate
  script:
    - apt-get update && apt-get install -y curl jq
    - curl -sSL https://github.com/agentskills/claw/releases/download/${CLAW_VERSION}/claw-linux-amd64 -o /usr/local/bin/claw
    - chmod +x /usr/local/bin/claw
    - claw validate -r . --strict --format json > validation-report.json
    - claw lock --check --format json > lock-report.json
    - |
      if jq -e '.summary.failed > 0' validation-report.json > /dev/null 2>&1; then
        echo "Schema validation failed"
        exit 1
      fi
  artifacts:
    paths:
      - validation-report.json
      - lock-report.json
  only:
    changes:
      - "**/SKILL.md"
      - "**/skill-lock.json"

# 阶段 3：测试
unit-test:
  stage: test
  script:
    - curl -sSL https://github.com/agentskills/claw/releases/download/${CLAW_VERSION}/claw-linux-amd64 -o /usr/local/bin/claw
    - chmod +x /usr/local/bin/claw
    - claw test --type unit --format json > unit-test-report.json
  artifacts:
    paths:
      - unit-test-report.json

integration-test:
  stage: test
  script:
    - curl -sSL https://github.com/agentskills/claw/releases/download/${CLAW_VERSION}/claw-linux-amd64 -o /usr/local/bin/claw
    - chmod +x /usr/local/bin/claw
    - claw test --type integration --format json > integration-test-report.json
  artifacts:
    paths:
      - integration-test-report.json
  needs: ["unit-test"]

# 阶段 4：安全扫描
security-scan:
  stage: security
  script:
    - curl -sSL https://github.com/agentskills/claw/releases/download/${CLAW_VERSION}/claw-linux-amd64 -o /usr/local/bin/claw
    - chmod +x /usr/local/bin/claw
    - claw scan --severity medium --format json > security-report.json
    - |
      HIGH_CRITICAL=$(jq -r '.summary.high + .summary.critical' security-report.json)
      if [ "$HIGH_CRITICAL" -gt 0 ]; then
        echo "High/Critical security findings detected!"
        exit 1
      fi
  artifacts:
    paths:
      - security-report.json

# 阶段 5：审批门禁（手动触发）
approval:
  stage: approval
  when: manual
  allow_failure: false
  script:
    - echo "Release requires manual approval"
  only:
    - main

# 阶段 6：部署
deploy-canary:
  stage: deploy
  when: manual
  script:
    - curl -sSL https://github.com/agentskills/claw/releases/download/${CLAW_VERSION}/claw-linux-amd64 -o /usr/local/bin/claw
    - chmod +x /usr/local/bin/claw
    - claw publish --tag $(claw version --show) --canary 10 --registry ${REGISTRY_URL}
  environment:
    name: canary
  only:
    - main

deploy-production:
  stage: deploy
  when: manual
  script:
    - curl -sSL https://github.com/agentskills/claw/releases/download/${CLAW_VERSION}/claw-linux-amd64 -o /usr/local/bin/claw
    - chmod +x /usr/local/bin/claw
    - claw publish --tag $(claw version --show) --full --registry ${REGISTRY_URL}
  environment:
    name: production
  only:
    - main
  needs: ["deploy-canary"]
```

### 6.3 各阶段的判定条件与操作

| 阶段 | CI 作业 | 触发条件 | 判定标准 | 失败操作 |
|------|---------|---------|---------|---------|
| 验证 | `validate` | PR 创建/更新、Push 到 main | Schema 校验通过、依赖锁定最新 | PR 标记为 check-failed，输出错误报告 |
| 测试 | `unit-test` | 验证通过 | 单元测试全部通过 | 阻断 pipeline，开发者收到通知 |
| 测试 | `integration-test` | 单元测试通过 | 关键路径集成测试通过 | 阻断 pipeline，提供 Mock 执行日志 |
| 安全 | `security-scan` | 集成测试通过 | 无 high/critical 风险 | 阻断 pipeline，安全团队自动收到告警 |
| 审批 | `approval` | (仅 main 分支) 安全扫描通过 | 至少 1 名 maintainer 手动确认 | pipeline 暂停，等待审批 |
| 部署 | `deploy-canary` | 审批通过 | Canary 观察期内错误率 < 1% | 自动回滚，通知平台团队 |
| 部署 | `deploy-production` | Canary 通过 | 全量发布后关键指标正常 | 回滚到上一版本 |

---

## 七、思考题

1. **Canary 发布中的"假阳性"问题**：在 Canary 灰度阶段，如果观察到错误率短暂飙高然后恢复正常（例如由于网络抖动而非 Skill 问题），自动回滚机制会产生"假阳性"回滚。请设计一种"抖动容忍"的回滚策略，区分瞬时的环境异常和真正的 Skill 缺陷。

2. **Skill 测试的确定性困境**：本章的测试方案假设 Skill 的测试结果可以做"通过/失败"的二元判断。但考虑到 LLM 输出的概率性特征，同一个 Skill 在同样的输入下可能产生不同的行为。请分析：这种概率性特征对 CI/CD 管道的可靠性有什么影响？你会采用什么策略来保证测试结果的稳定性和可重复性？

3. **pre-commit hook 的执行时间问题**：当仓库中包含 50+ 个 SKILL.md 时，pre-commit hook 中运行所有安全扫描可能需要 5 分钟以上。长时间的 pre-commit hook 会严重影响开发者的提交体验，导致开发者寻找绕过 hook 的方法。请设计一个"增量检查"策略——只对本次提交变更的 Skill 执行 pre-commit 检查，而非运行全量检查。你的设计方案中如何确保"增量检查"不会遗漏跨文件的依赖变更？

4. **版本发布与依赖方通知的时序问题**：当 Skill A 发布新版本，而依赖 Skill A 的 Skill B 尚未更新其 skill-lock.json 时，存在一个时间窗口——Skill A 的新版本已可用，但 Skill B 仍在引用旧版本。如果 Skill A 的新版本修复了一个安全漏洞，这个时间窗口就构成了安全风险。请设计一种"级联通知"或"自动更新依赖锁定"的机制，最小化从发布到所有依赖方完成更新的延迟。

---

## 八、本章小结

Skill 的工程化管理不是可选项——当 Skills 从个人实验走向生产级组织能力时，DevOps 实践是质量、安全和效率的保障。本章从六个维度建立了完整的 Skill DevOps 框架：

1. **六阶段 DevOps 管道**：编写 → 本地验证 → 自动化测试 → 安全扫描 → 发布审批 → 生产部署。每个阶段有明确的工具链、判定标准和失败处理流程，确保问题在早期被发现和修复。

2. **claw CLI 高级用法**：`claw validate -r .` 实现批量 Schema 校验，`claw lock` 确保可重复的依赖解析，`claw publish` 支持带审核的版本发布，`claw run --dry-run` 提供无副作用的本地沙箱测试。

3. **pre-commit hooks**：Schema 校验 + 单元测试 + 安全扫描的三道自动化防线，在代码入库前拦截问题。集成测试推荐在 push 阶段而非 commit 阶段运行，以平衡检查覆盖度和开发体验。

4. **版本发布策略**：Canary 灰度发布（5% → 20% → 50% → 100%）降低发布风险；版本快照和 `claw rollback` 实现分钟级快速回切；语义化版本自动化工具消除人工操作错误。

5. **CI/CD 配置**：GitHub Actions 和 GitLab CI 的完整示例覆盖了全部六个阶段，PR 的审批环境（environment）作为人工门禁，Canary 健康检查作为自动门禁。

Skill 的 CI/CD 不是传统软件 CI/CD 的简单复制——它需要处理 LLM 输出的概率性、自然语言指令的质量评估和 Agent 行为的可观测性等独特挑战。但核心原则是一致的：**尽早发现问题，自动化重复劳动，保留人工判断关键决策**。

---

## 九、参考资料

- [Claw CLI Official Documentation](https://docs.agentskills.io/cli) —— claw 命令行工具的官方文档，本章所有 claw 命令的参考来源
- [GitHub Actions Documentation](https://docs.github.com/en/actions) —— GitHub Actions 官方文档，本章 6.1 节的配置参考
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/) —— GitLab CI/CD 官方文档，本章 6.2 节的配置参考
- [pre-commit](https://pre-commit.com/) —— pre-commit 框架官方文档，本章 4.2 节的配置参考
- [Semantic Versioning Specification 2.0.0](https://semver.org/) —— 语义化版本规范，本章 5.3 节的版本管理基础
- [Canary Deployments: Best Practices](https://martinfowler.com/bliki/CanaryRelease.html) —— Martin Fowler 关于 Canary 发布的经典文章，本章灰度发布策略的理论基础
- [Continuous Delivery for Machine Learning (CD4ML)](https://martinfowler.com/articles/cd4ml.html) —— 持续交付在机器学习场景的应用，本章的部分思路受 CD4ML 启发
- Hummer, D. (2025). "CI/CD Pipeline Design for Agent Skills". *Anthropic Engineering Blog*. —— Anthropic 关于 Skill CI/CD 管道设计的工程实践文章
- [Conventional Commits Specification](https://www.conventionalcommits.org/) —— 约定式提交规范，本章 5.3 节版本号自动检测的提交前缀规范来源
- [SLSA (Supply-chain Levels for Software Artifacts)](https://slsa.dev/) —— 软件供应链安全标准，本章依赖锁定和完整性校验的设计参考

---

[← 上一章：企业级 Skill 治理体系](./11-enterprise-governance) | [返回索引](./) | [下一章：Skills 安全威胁深度分析 →](./13-security-threats)
