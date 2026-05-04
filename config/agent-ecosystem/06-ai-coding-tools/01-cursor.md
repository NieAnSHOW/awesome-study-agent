# Cursor 编辑器

## Cursor 是什么

Cursor 从 VS Code fork 而来，把 AI 做进了编辑器内核。这不是插件，是完整的 IDE。

**主要区别：**
- VS Code + Copilot：AI 是外挂
- Cursor：AI 是编辑器的一部分

定价：Hobby 免费，Pro 版 $20/月，Pro+ $60/月，Ultra $200/月（2025年6月起改为信用额制度）。

## Composer 模式

2025年底上线的功能，改变了 AI 编程的交互方式。

**之前：**
1. 选中文件
2. 告诉 AI 要做什么
3. 手动复制粘贴修改

**现在：**
1. 描述任务
2. AI 自己规划、修改多个文件
3. 你审查结果

**实际例子：**

输入："创建用户登录页，包含表单验证、错误提示和 API"

Cursor 会：
- 分析现有代码风格
- 创建登录组件
- 写验证逻辑
- 添加错误提示
- 更新 API 函数
- 修改路由配置

一次可以改几十个文件。

## Cursor Tab（智能补全）

不是只补全下一行，而是预测整个代码块。2026 年更新后，Tab 模型支持**多文件编辑建议**——修改一个文件时，Cursor 会自动推荐其他相关文件中需要同步修改的地方。

**跟 Copilot 的区别：**
- Copilot：基于 GitHub 开源代码
- Cursor Tab：基于你的项目 + 大模型

使用时你会看到灰色文字预览，按 Tab 接受。

## Chat 功能

类似 ChatGPT，但知道你的项目。

**常用场景：**
- "这段代码干什么用的？"
- "重构成函数式风格"
- "为什么会报这个错？"

**使用技巧：**
- 打开的文件自动进入上下文
- 用 `@文件名` 手动添加文件
- 用 `@目录/` 添加整个目录
- 用 `@folders` 添加项目文件夹结构作为上下文

## Agent 模式

2026年的更新，Cursor 可以自己跑命令、修 bug。

**例子：**

你输入："给这些函数加单元测试"

Cursor Agent 会：
1. 找出测试框架（Jest/Vitest）
2. 找到没测试的函数
3. 生成测试用例
4. 跑测试
5. 失败就分析原因重写
6. 重复到测试通过

它能自己执行 npm install、npm test 这些命令。

## Background Agent

2026 年的重磅更新。Background Agent 可以在**云端**并行执行多个任务。

**跟 Agent 模式的区别：**
- Agent 模式：在前台执行，你看着它跑
- Background Agent：在云端后台运行，你可以继续编码

**使用方式：**

1. 描述任务，选择"Send to Background"
2. Cursor 在云端创建独立环境执行
3. 完成后通知你审查变更
4. 审查通过后合并到你的代码

**适合场景：**
- 大规模重构（改几十个文件）
- 批量生成测试
- 多个独立任务同时进行

你可以在 Background Agent 跑任务的同时，继续用 Cursor 写其他代码。

## 快速上手

### 安装

1. 去 [cursor.com](https://cursor.com) 下载
2. 登录（Google/GitHub 账号都能用）
3. 导入 VS Code 配置（可选）

### 推荐设置

```json
{
  "cursor.completion.enable": true,
  "cursor.chat.enable": true,
  "cursor.agent.enable": true
}
```

### 快捷键

| 功能 | macOS | Windows |
|------|-------|---------|
| Chat | `Cmd + L` | `Ctrl + L` |
| Composer | `Cmd + I` | `Ctrl + I` |
| 快速修复 | `Cmd + K` | `Ctrl + K` |
| Agent 模式 | `Cmd + Shift + A` | `Ctrl + Shift + A` |
| Background Agent | `Cmd + Shift + B` | `Ctrl + Shift + B` |

## 项目规则（.cursorrules）

在项目根目录创建 `.cursorrules` 文件，告诉 AI 你的编码规范。

**示例：**

```markdown
# 编码规范
- 用 TypeScript 严格模式
- 组件名 PascalCase，函数名 camelCase
- API 调用必须处理错误
- 新功能必须有测试

# 代码风格
- 用函数式组件和 Hooks
- 样式用 Tailwind
- 导入顺序：React → 第三方库 → 本地
```

这样 Cursor 生成的代码就会符合你项目的风格。

## 使用技巧

### 上下文管理

```
# 引用单个文件
@./src/components/Button.tsx 这个按钮怎么实现无障碍？

# 引用目录
@./src/api/ 所有 API 端点加认证
```

大型项目用 `.cursorignore` 排除 node_modules、build 这些不需要的目录。

### Prompt 怎么写

**好的：**
```
"用户注册表单加：
1. 密码强度指示（8位以上，大小写+数字）
2. 实时验证
3. 密码可见性切换
保持现有表单样式"
```

**不好的：**
```
"改进表单"
```

具体说明要什么，Cursor 才能给出好结果。

### 模型选择

| 任务 | 推荐模型 |
|------|----------|
| 写代码 | Claude Sonnet 4.6 |
| 复杂逻辑推理 | GPT-5.4 |
| 快速补全 | Claude Haiku 4.5 |
| 重构 | Claude Sonnet 4.6 |

Claude 写代码质量高，GPT-5.4 推理强，Haiku 快速便宜。

::: tip Max Mode
遇到特别复杂的任务时，可以开启 **Max Mode**。Max Mode 使用最强模型（如 Opus 4.6），按 Token 用量单独计费，适合架构设计、复杂重构等高难度场景。在 Chat 或 Composer 中点击模型选择器旁的 Max 开关即可启用。
:::

## 定价

2025 年 6 月起，Cursor 从按次请求转为**信用额制度**（Usage-based pricing）。

| 版本 | 价格 | 信用额 | 说明 |
|------|------|--------|------|
| Hobby | $0 | 有限免费额度 | 体验基础功能 |
| Pro | $20/月 | 足量日常额度 | 适合个人开发者 |
| Pro+ | $60/月 | 更高额度和 Max Mode | 重度使用者 |
| Ultra | $200/月 | 最高额度 | 团队和极限用户 |
| Teams | $30/用户/月 | 团队共享额度 | 团队协作管理 |

超出额度后可按量付费。Pro 版适合大多数开发者，Hobby 版可以先体验。

## 优缺点

**优点：**
- 不是插件，是编辑器本身，所以集成更深
- 理解整个项目，不只是单个文件
- Composer 一次改多个文件
- 完全兼容 VS Code 插件和配置
- Agent 能自己跑任务
- Background Agent 云端并行执行
- 信用额制度，按需付费更灵活

**缺点：**
- 要花钱（$20/月）
- 需要网络
- 学会最佳实践需要时间
- 容易依赖，影响自己写代码能力

## 什么时候用

**适合：**
- 全栈项目
- 重构代码
- 快速原型
- 接手别人项目
- 重复性编码工作

**不适合：**
- 简单文本编辑（VS Code 够用）
- 离线开发
- 需要完全控制的场景

## 实战例子

### 例子 1：创建 CRUD 功能

输入：
```
"创建博客文章管理：
- 列表页（分页、搜索、筛选）
- 编辑器（Markdown）
- 删除确认
- 用现有 API
- 保持项目组件风格"
```

Cursor 会：
1. 看现有 API 结构
2. 创建组件
3. 写状态管理
4. 配路由
5. 加到导航栏

### 例子 2：性能优化

输入：
```
"分析这个组件的性能问题：
@./src/components/UserList.tsx

1000条数据时卡顿"
```

Cursor 会：
1. 找出瓶颈
2. 建议虚拟滚动
3. 实现分页或懒加载
4. 优化重渲染
5. 对比优化前后性能

## 学习资源

**官方：**
- [Cursor 官网](https://cursor.com)
- [文档](https://cursor.sh/docs)

**社区：**
- [Discord](https://discord.gg/cursor)
- [Reddit r/cursor](https://reddit.com/r/cursor)

**教程：**
- [Cursor 2026 深度评测](https://createaiagent.net/tools/cursor/)
- [AI 编辑器对比](https://playcode.io/blog/best-ai-code-editors-2026)

## 常见问题

**Q: 我的代码会被用来训练吗？**
A: 不会。代码只在你自己的会话里用。

**Q: 能离线用吗？**
A: AI 功能需要联网，但基础编辑功能可以离线。

**Q: 支持哪些语言？**
A: 主流语言都行，TypeScript、Python、JavaScript、Go、Rust 支持最好。

**Q: 怎么避免过度依赖？**
A:
- 看 AI 生成代码，理解逻辑
- 定期自己写代码
- 把 AI 当学习工具，不是替代

**Q: 会取代程序员吗？**
A: 不会。它是工具，让你更快。架构设计、业务理解还是要人。

## 下一步

1. [下载 Cursor](https://cursor.com)
2. 导入一个真实项目试试
3. 用 Composer 改点东西
4. 写 `.cursorrules` 规范代码风格
5. 学几个快捷键

[继续学习：Claude Code →](/agent-ecosystem/06-ai-coding-tools/02-claude-code)
