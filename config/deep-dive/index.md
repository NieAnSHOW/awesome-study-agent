# 深度指南

> 深入探索 AI Agent 技术的方方面面

## 深度指南 vs 基础路径

## 当前主题

### Agent Skills 系统深度指南

**链接**: [Agent Skills 系统](./agent-skills/)

**简介**: 深入探索 Agent Skills 系统的设计哲学、技术架构与工程实践，从认知科学层面的 Why 到工程实践层面的 How

**适合读者**:
- 已完成基础模块 09 学习，希望深入理解 Skills 的开发者
- 需要在团队中推行 Skills 标准化治理的技术决策者
- 从事 AI Agent 框架开发或工具链构建的工程师

**主要内容**:

1. [Skills 的认知科学基础](./agent-skills/01-cognitive-foundations) - 策略漂移、推理护栏与 Token 经济模型
2. [四元组形式化分析](./agent-skills/02-formal-analysis) - Context/Policy/Tools/Result 的工程数学模型
3. [SKILL.md 完整规范](./agent-skills/03-skillmd-advanced) - 高级字段、三级缓存与版本化策略
4. [依赖管理与版本治理](./agent-skills/04-dependency-management) - 三重依赖模型与解析算法
5. [四大框架实现深度剖析](./agent-skills/05-framework-comparison) - Claude/CrewAI/LangChain/扣子 2.0
6. [跨框架互操作性](./agent-skills/06-interoperability) - 标准演进与适配层实现
7. [Skill 设计模式目录](./agent-skills/07-design-patterns) - 六大设计模式详解 ⭐
8. [复杂 Skill 组合与编排](./agent-skills/08-composition-orchestration) - DAG 调度与降级熔断
9. [Skill 测试策略](./agent-skills/09-testing-strategy) - 测试金字塔与沙箱执行
10. [Token 优化与性能调优](./agent-skills/10-token-optimization) - 预算管理与三级缓存
11. [企业级 Skill 治理](./agent-skills/11-enterprise-governance) - 权限模型与合规管控
12. [开发工作流与 CI/CD](./agent-skills/12-devops-workflow) - DevOps 管道与版本发布
13. [安全威胁深度分析](./agent-skills/13-security-threats) - ClawHavoc 事件复盘 ⭐
14. [生态演进与未来趋势](./agent-skills/14-future-trends) - MCP 融合与 Meta-Skilling

---

### 大模型上下文管理深度指南

**链接**: [大模型上下文管理](./context-management/)

**简介**: 深入探讨大模型上下文管理的原理、方法与实践

**适合读者**:
- 正在使用 AI 辅助开发的开发者
- 需要让 AI 理解复杂项目的技术人员
- 希望 AI 生成更符合项目规范的团队

**主要内容**:

1. [大模型上下文原理解析](./context-management/01-context-principles) - 理解上下文窗口、Token 限制、上下文衰减
2. [上下文的类型与层次](./context-management/02-context-types) - 静态/动态、全局/局部、显式/隐式上下文
3. [Wiki 系统最佳实践](./context-management/03-wiki-best-practices) - 如何用 Wiki 管理上下文
4. [代码即文档](./context-management/04-code-as-docs) - 从代码自动提取上下文
5. [让 AI 使用上下文的技巧](./context-management/05-ai-context-tips) - 直接引用、总结传递、自动检索
6. [RAG 系统深度实践](./context-management/06-rag-systems) - 搭建智能检索系统
7. [不同规模项目的上下文策略](./context-management/07-scaling-strategies) - 个人到企业级
8. [上下文质量评估](./context-management/08-context-quality) - 如何评估和改进
9. [未来趋势与工具](./context-management/09-future-trends) - 新兴技术和方向

---

### OpenClaw 深度指南

**链接**: [OpenClaw 深度指南](./openclaw/)

**简介**: 深入剖析 OpenClaw 开源 AI 助手的架构设计、组件实现、部署运维与安全模型，从源码级理解这个 25 万 Stars 的 Agent 运行时

**适合读者**:
- 已完成基础模块 10 学习，希望深入理解 OpenClaw 的用户
- 需要部署和运维 OpenClaw 的技术人员
- 希望开发 OpenClaw Skills 的开发者

**主要内容**:

1. [Gateway 架构深度剖析](./openclaw/01-gateway-architecture) - 单进程事件循环与模块间通信
2. [Brain 组件深度剖析](./openclaw/02-brain-llm-orchestration) - LLM 编排与 Prompt 工程
3. [Hands 工具执行引擎](./openclaw/03-hands-tool-engine) - 工具注册、沙箱与生命周期管理
4. [Memory 四层记忆体系](./openclaw/04-memory-system-deep) - 对话/事实/任务/总结记忆设计
5. [Heartbeat 心跳调度引擎](./openclaw/05-heartbeat-scheduler) - 自主任务调度与冲突处理
6. [Channels 适配器模式](./openclaw/06-channels-adapter) - 50+ 消息平台的统一接入
7. [Skill 开发进阶](./openclaw/07-skill-development) - 从 SKILL.md 到 Skill 工程化
8. [SOUL.md 与 Agent 人设工程](./openclaw/08-soul-engineering) - 身份设计与 Prompt 防护
9. [高级部署与运维](./openclaw/09-deployment-ops) - Docker/K8s 生产级部署
10. [性能调优与成本优化](./openclaw/10-performance-cost) - Token 预算与混合模型策略
11. [安全模型](./openclaw/11-security-model) - 沙箱、权限、审计与威胁分析
12. [Live Canvas 与 A2UI 协议](./openclaw/12-live-canvas-a2ui) - AI 生成 UI 的协议与实现
13. [生态对比与混合架构](./openclaw/13-ecosystem-comparison) - 方案选型与 MCP/A2A 融合
14. [实战案例](./openclaw/14-scenarios-cases) - 个人/团队/家居/开发四种场景

---

## 即将推出

- **Agent 架构设计深度指南**
  - 单 Agent vs 多 Agent 架构
  - Agent 编排模式
  - 状态管理设计
  - 错误处理与重试机制

- **RAG 系统从入门到精通**
  - 检索增强生成原理
  - 向量数据库选型与优化
  - 混合检索策略
  - 生产级 RAG 架构

- **AI 编程工具深度对比**
  - Cursor vs Claude Code vs Copilot
  - 自定义 AI 编程工具
  - 团队协作最佳实践
  - 效率提升量化分析

---

## 学习建议

**按需学习**：遇到具体问题 → 阅读相关章节 → 实践应用

**系统学习**：从头到尾完整阅读 → 完成练习 → 在项目中应用

**结合基础路径**：先学基础路径了解概念 → 再读深度指南深入理解

## 学习路径推荐

**上下文管理专家**：

1. 基础型路径 → 模块六：AI 编程工具
2. 零基础实战 → 模块二：上下文管理
3. 深度指南 → 大模型上下文管理深度指南
4. 实战项目 → 在项目中应用

**AI 辅助开发高手**：

1. 落地型路径 → 模块十：AI 编程实战
2. 深度指南 → 大模型上下文管理深度指南
3. 实战项目 → 完整使用 AI 辅助开发

---

## 贡献与反馈

如果您在学习过程中有任何问题或建议，欢迎：

- 提交 Issue 指出内容问题
- 提交 PR 补充或改进内容
- 在评论区分享学习心得

您希望看到哪些深度指南主题？欢迎提出建议！

---

[← 返回首页](/) | [开始学习：Agent Skills 系统 →](./agent-skills/)
