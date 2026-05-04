# 模块六：AI 编程工具

> **学习目标**：掌握主流 AI 编程工具的使用方法，建立高效的 AI 辅助开发工作流

> **预计时间**：8-10 小时

> **前置知识**：
> - 基本的编程经验
> - 熟悉命令行操作
> - 了解 Git 基础

## 模块介绍

AI 编程工具已经从"锦上添花"变成"必需品"。2025 年，约 84% 的开发者在使用 AI 辅助编程。

这个模块会带你了解：
- **Cursor**：AI 原生 IDE，深度集成，功能最强
- **Claude Code**：终端工具，灵活可扩展
- **其他工具**：从 GitHub Copilot 到国产 IDE（Trae、CodeBuddy）、CLI 代理（Gemini CLI、Codex CLI）、Vibe Coding（v0、Lovable）、开源方案（Aider、Continue）等
- **最佳实践**：怎么用好这些工具
- **环境搭建**：从零开始的配置指南

**你会学到：**
1. 选择适合你的 AI 编程工具
2. 配置和优化开发环境
3. 建立高效的 AI 辅助工作流
4. 避免常见陷阱

**学习方式：**
- 理论 + 实践结合
- 每个工具都有详细说明
- 提供真实使用场景
- 包含配置文件示例

## 章节列表

- [Cursor 编辑器](/agent-ecosystem/06-ai-coding-tools/01-cursor) - AI 原生 IDE，功能最强大
- [Claude Code](/agent-ecosystem/06-ai-coding-tools/02-claude-code) - 终端 AI 助手，高度可定制
- [其他 AI 编程工具](/agent-ecosystem/06-ai-coding-tools/03-other-tools) - 国产 IDE、CLI 代理、Vibe Coding、开源方案等全景对比
- [最佳实践](/agent-ecosystem/06-ai-coding-tools/04-best-practices) - 高效使用 AI 工具的方法
- [开发环境搭建](/agent-ecosystem/06-ai-coding-tools/05-environment-setup) - 从零开始的配置指南
- [CC Switch](/agent-ecosystem/06-ai-coding-tools/06-cc-switch) - API 配置管理中心，多供应商一键切换

## 为什么学这个

### AI 改变了编程

**之前：**
- 手写每一行代码
- 遇到问题搜 Stack Overflow
- 重复性工作耗时
- 代码质量靠经验

**现在：**
- AI 生成代码，你审查
- AI 直接回答问题
- AI 处理重复工作
- AI 帮助提升质量

### 效率提升

根据业界数据：
- **开发速度**：提升 2-3 倍
- **代码质量**：Bug 减少 30-50%
- **学习曲线**：新框架上手快 50%
- **重复工作**：减少 70%

### 但不是魔法

AI 工具：
- ✅ 加速你的工作
- ✅ 提供代码建议
- ✅ 解释复杂逻辑
- ❌ 不能替代架构设计
- ❌ 不能替代业务理解
- ❌ 可能引入 bug

**关键**：学会正确使用。

## 学习路径

### 路线 1：新手入门（推荐）

```
1. 环境搭建 ← 从这里开始
2. Cursor 编辑器 ← 容易上手（或 Trae 国内版）
3. 最佳实践 ← 避免走弯路
4. 其他工具 ← 了解全景
5. Claude Code ← 进阶使用
6. CC Switch ← API 统一管理
```

### 路线 2：快速体验

```
1. 其他工具 ← 快速了解全景
2. 环境搭建 ← 选一个试试
3. 最佳实践 ← 学习用法
```

### 路线 3：深度学习

```
1. Cursor 编辑器 ← 主力工具
2. Claude Code ← 高级技巧
3. 最佳实践 ← 深入理解
4. 环境搭建 → 自定义配置
5. 其他工具 ← 补充了解
6. CC Switch ← API 配置中心
```

## 工具选择建议

### 个人开发者

| 情况 | 推荐 | 原因 |
|------|------|------|
| 想要最佳体验 | Cursor | 功能最强，体验最好 |
| 预算有限 | Gemini CLI / Aider | 完全免费，终端可用 |
| 国内开发者 | Trae 国内版 | 免费 + 国内直连 + 豆包/DeepSeek 模型 |
| 喜欢命令行 | Claude Code / Codex CLI | 灵活可扩展 |
| VS Code 用户 | VS Code + Copilot | 无缝集成 |

### 团队协作

| 场景 | 推荐 | 原因 |
|------|------|------|
| 小团队（< 10 人） | Cursor Pro | 成本合理，效果好 |
| 中型团队 | Cursor Business | 集中管理 |
| 大企业 | Copilot Enterprise | 安全合规 |
| 敏感代码 | Tabnine Enterprise | 本地部署 |
| 国内企业 | CodeBuddy / Trae | 国产定制，合规 |
| 腾讯生态团队 | CodeBuddy 企业版 | 微信/企微生态集成 |

### 不同语言

| 语言 | 推荐工具 |
|------|----------|
| TypeScript/JavaScript | Cursor |
| Python | Cursor / Claude Code |
| Go | Cursor |
| Java | Copilot |
| C/C++ | Codeium |

## 学习检验

完成本模块学习后，你应该能够：

### 基础技能
- [ ] 了解主流 AI 编程工具的特点（含国产 IDE 和 CLI 代理）
- [ ] 选择适合自己的工具
- [ ] 完成基本安装和配置

### 进阶技能
- [ ] 配置 `.cursorrules` 或 `CLAUDE.md`
- [ ] 使用 Agent 模式处理复杂任务
- [ ] 编写有效的 Prompt
- [ ] 配置 MCP 服务器或自定义命令
- [ ] 尝试 CLI 代理工具（Gemini CLI / Aider）

### 实践能力
- [ ] 在真实项目中使用 AI 工具
- [ ] 建立高效的工作流
- [ ] 避免 AI 使用的常见陷阱
- [ ] 评估工具的性价比

### 高级能力
- [ ] 组合使用多个工具
- [ ] 为团队配置统一环境
- [ ] 创建自定义技能和命令
- [ ] 优化 AI 工作流程

## 扩展阅读

### 官方文档
- [Cursor 官方文档](https://cursor.sh/docs)
- [Claude Code 文档](https://code.claude.com/docs)
- [GitHub Copilot 指南](https://docs.github.com/en/copilot)
- [Gemini CLI 文档](https://developers.google.com/gemini-code-assist/docs/gemini-cli)
- [Codex CLI 文档](https://github.com/openai/codex)
- [Trae 文档](https://docs.trae.ai)

### 深度文章
- [Addy Osmani: My LLM coding workflow](https://addyosmani.com/blog/ai-coding-workflow/)
- [2026 AI 编程工具完全指南](https://www.the-ai-corner.com/p/ai-coding-tools-complete-guide-2026)
- [Every AI Coding CLI in 2026: 30+ Tools Compared](https://dev.to/soulentheo/every-ai-coding-cli-in-2026-the-complete-map-30-tools-compared-4gob)
- [2026国产AI编程工具横评](https://zhuanlan.zhihu.com/p/2025589657207881943)

### 社区资源
- [Cursor Discord](https://discord.gg/cursor)
- [Claude Discord](https://discord.gg/anthropic)
- [Reddit r/cursor](https://reddit.com/r/cursor)
- [Aider GitHub](https://github.com/Aider-AI/aider)
- [CC Switch GitHub](https://github.com/farion1231/cc-switch) — 57K+ Stars 的 API 配置管理工具
- [CC Switch 菜鸟教程](https://www.runoob.com/ai-agent/cc-switch.html)

### 视频教程
- [Claude Code 初学者教程（Leon van Zyl）](https://www.youtube.com/watch?v=kddjxKEeCuM)
- [Cursor 快速上手（Mikey No Code）](https://www.youtube.com/watch?v=oQDCAJnr1aY)
- [AI Coding Tools 2026: Complete Ranking](https://www.youtube.com/watch?v=zqiYTXiQq-0)

## 常见问题

**Q: 我该学哪个工具？**
A: 建议从 Cursor 或 Trae（国内用户）开始。Cursor 功能最强，Trae 国内版完全免费。熟练后再尝试其他工具。

**Q: 需要编程基础吗？**
A: 需要。AI 工具是辅助，不能替代编程知识。至少要懂一门语言和基本开发流程。

**Q: 免费版够用吗？**
A: 看情况。轻度学习可以，日常开发建议付费版。$20/月对提升效率来说很值。

**Q: AI 会取代程序员吗？**
A: 不会。但不会用 AI 的程序员会处于劣势。AI 是工具，让你更高效，不是替代你。

**Q: 需要多长时间掌握？**
A: 基本使用 1-2 小时，熟练需要 1-2 周实践。关键是多用，积累经验。

## 学习建议

### 第一周：熟悉工具
- 安装配置（2 小时）
- 基本功能（3 小时）
- 在小项目上试试（5 小时）

### 第二周：深入实践
- 在真实项目使用
- 学习高级功能
- 配置和优化

### 第三-四周：建立工作流
- 总结有效 Prompt
- 建立配置文件
- 形成习惯

### 持续改进
- 定期反思效率
- 关注工具更新
- 分享团队经验

## 接下来

选择一个起点：

**🚀 快速开始**
→ [开发环境搭建](/agent-ecosystem/06-ai-coding-tools/05-environment-setup)

**📖 系统学习**
→ [Cursor 编辑器](/agent-ecosystem/06-ai-coding-tools/01-cursor)

**🔍 先了解全景**
→ [其他 AI 编程工具](/agent-ecosystem/06-ai-coding-tools/03-other-tools)（国产 IDE、CLI 代理、Vibe Coding 等）

**💡 学习方法**
→ [最佳实践](/agent-ecosystem/06-ai-coding-tools/04-best-practices)

---

[← 返回课程目录](/preface) | [继续学习：Cursor 编辑器 →](/agent-ecosystem/06-ai-coding-tools/01-cursor)
