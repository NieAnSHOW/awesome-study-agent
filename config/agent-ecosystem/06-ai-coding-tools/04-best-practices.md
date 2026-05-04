# AI 编程最佳实践

工具重要，但怎么用更重要。这里总结 2025-2026 年开发者总结出的 AI 编程经验。

## 核心原则

### 1. AI 是结对程序员，不是替代品

Addy Osmani（Chrome 团队工程师）说得对：AI 辅助编程不是"按个按钮就完事"，需要清晰的方向、上下文和监督。

**正确心态：**
- AI 加速你的工作，不是替代你思考
- 你负责架构和决策，AI 负责实现
- 你审查代码，AI 生成代码

**错误心态：**
- 让 AI 写所有代码
- 不理解就复制粘贴
- 完全依赖 AI 做决策

### 2. 规范先于代码

AI 最大的坑：模糊的需求产生糟糕的代码。

**好的流程：**
1. 定义问题
2. 跟 AI 讨论方案
3. 制定详细规范
4. 然后 AI 生成代码
5. 你审查和调整

**坏的流程：**
1. 告诉 AI "我要个登录功能"
2. 直接用生成的代码
3. 出问题了再修

### 3. 保持代码所有权

AI 写的代码，你要负责理解、维护、扩展。

**实践：**
- AI 生成代码后，你要通读理解
- 能解释每一行在干什么
- 能手动修改和优化
- 测试边界情况

## 工作流程

### 推荐工作流

基于社区实践（Addy Osmani、Mukesh Murugan 等）：

**阶段 1：规划**

1. **写清楚需求**
   ```
   差：加个用户注册
   好：实现用户注册功能：
   - 邮箱+密码注册
   - 密码强度验证（8位以上，大小写+数字）
   - 邮箱验证链接
   - 错误处理和用户反馈
   - 遵循现有 API 结构
   ```

2. **跟 AI 讨论方案**
   ```
   "我需要实现用户注册。你建议什么技术方案？
   考虑以下因素：
   - 后端用 Node.js + Express
   - 数据库用 PostgreSQL
   - 需要邮箱验证
   - 遵循 RESTful API 设计"
   ```

3. **让 AI 生成详细规范**
   ```
   "基于上面的讨论，生成详细的实现规范：
   - API 端点设计
   - 数据模型
   - 错误处理
   - 测试计划"
   ```

**阶段 2：实现**

4. **分步实现**
   ```
   "第一步：创建用户数据模型
   第二步：实现注册 API
   第三步：添加邮箱验证
   第四步：写测试"
   ```

5. **审查代码**
   - 安全性（SQL 注入、XSS）
   - 性能（N+1 查询、内存泄漏）
   - 可维护性（命名、结构）
   - 测试覆盖

**阶段 3：测试和优化**

6. **让 AI 写测试**
   ```
   "为注册功能写单元测试和集成测试，
   覆盖以下场景：
   - 正常注册
   - 邮箱已存在
   - 密码太弱
   - 邮箱格式错误"
   ```

7. **性能优化**
   ```
   "分析这段代码的性能瓶颈，
   查询慢、内存占用高"
   ```

### 典型场景模式

**场景 1：理解代码库**

```
你: "这个项目是做什么的？架构是怎样的？"

AI: [分析目录结构、README、package.json]

你: "核心业务逻辑在哪些文件？"

AI: [指出关键文件和它们的关系]

你: "我想改 X 功能，会影响哪些地方？"

AI: [分析依赖关系，给出影响范围]
```

**场景 2：重构**

```
你: "重构这段代码：
1. 提高可读性
2. 减少重复
3. 改善命名
@./src/utils/formatters.ts"

AI: [展示重构方案]

你: "解释你的改动"

AI: [说明每个改动的理由]
```

**场景 3：调试**

```
# 测试失败
npm test
# 3 个失败

你: "分析测试失败的原因：
@./tests/auth.test.js
@./src/auth/login.js"

AI: [执行测试，分析错误，定位问题]

AI: "问题在这里：[解释 bug]
修复方案：[展示代码]"

你: "应用修复"

AI: [修改代码，重新测试]
```

**场景 4：学习新技术**

```
你: "我要用 Zustand 做状态管理，
给你一个 Redux 代码例子，
帮我转换成 Zustand"

AI: [分析 Redux 代码，生成 Zustand 等价代码]

你: "解释差异和最佳实践"

AI: [对比两种方案，说明 Zustand 特点]
```

## Prompt 工程

### 好的 Prompt 原则

**1. 具体明确**

```
❌ "优化这个函数"

✅ "优化这个函数的性能：
- 当前处理 1000 条数据需要 2 秒
- 目标：200ms 以内
- 不能改变输出结果
- 保持代码可读性
@./src/utils/dataProcessor.ts"
```

**2. 提供上下文**

```
❌ "添加错误处理"

✅ "给这些 API 调用添加错误处理：
- 网络错误显示用户友好提示
- 401 跳转登录页
- 500 显示重试按钮
- 遵循项目现有的错误处理模式
@./src/api/*.ts"
```

**3. 遵循规范**

```
❌ "写个用户组件"

✅ "创建用户列表组件：
- 用函数式组件 + Hooks
- 样式用 Tailwind
- TypeScript 严格模式
- 遵循 src/components/UserCard.tsx 的模式
- 支持分页和搜索"
```

**4. 分步骤**

```
❌ "实现完整的用户认证"

✅ "分步实现用户认证：
第一步：设计数据模型
第二步：实现注册 API
第三步：实现登录 API
第四步：添加 JWT 认证中间件
每一步完成后再继续"
```

### Prompt 模板

**功能实现模板：**

```
"实现 [功能名]：

需求：
- [具体需求1]
- [具体需求2]

技术约束：
- 语言/框架：[TypeScript/React 等]
- 遵循规范：[项目编码规范]
- 参考文件：@./path/to/example.ts

验收标准：
- [标准1]
- [标准2]

分步实现，每步确认后继续"
```

**重构模板：**

```
"重构 [文件/函数]：
@./path/to/file.ts

改进目标：
- [可读性/性能/可维护性]

约束：
- 不改变 API 接口
- 保持测试通过
- 遵循团队编码规范

先展示重构方案，确认后再应用"
```

**调试模板：**

```
"调试问题：
- 错误信息：[贴错误信息]
- 相关代码：@./path/to/file.ts
- 测试代码：@./tests/file.test.ts

分析问题原因，提供修复方案"
```

## 配置和规范

### CLAUDE.md / .cursorrules

这些文件能大幅提升 AI 效果。

**完整的 CLAUDE.md 示例：**

```markdown
# 项目：电商后台管理系统

## 技术栈
- 前端：Next.js 14 + TypeScript
- UI：Tailwind CSS + shadcn/ui
- 后端：Node.js + Express
- 数据库：PostgreSQL + Prisma
- 认证：NextAuth.js

## 编码规范

### TypeScript
- 严格模式开启
- 所有函数有类型注解
- 避免 any，用 unknown

### React
- 只用函数式组件
- Hooks 遵循规则
- 状态：简单用 useState，复杂用 Zustand
- 服务端数据用 React Query

### 命名
- 组件：PascalCase (UserProfile.tsx)
- 函数：camelCase (getUserById)
- 常量：UPPER_SNAKE_CASE (API_BASE_URL)
- 文件夹：kebab-case (user-management/)

### 文件结构
src/
├── app/              # Next.js App Router
├── components/       # React 组件
│   ├── ui/          # shadcn/ui 组件
│   └── features/    # 功能组件
├── lib/             # 工具库
├── hooks/           # 自定义 Hooks
├── types/           # TypeScript 类型
└── styles/          # 全局样式

### 代码风格
- 用 Prettier（配置在 .prettierrc）
- ESLint 规则在 .eslintrc
- 导入顺序：React → 第三方 → 本地模块
- 组件内顺序：类型定义 → Hooks → 函数 → JSX

## API 规范

### RESTful 设计
- GET /api/users      - 列表
- GET /api/users/:id  - 详情
- POST /api/users     - 创建
- PUT /api/users/:id  - 更新
- DELETE /api/users/:id - 删除

### 错误处理
- 400：参数错误
- 401：未认证
- 403：无权限
- 404：不存在
- 500：服务器错误

所有 API 返回统一格式：
```typescript
{
  success: boolean,
  data?: T,
  error?: {
    code: string,
    message: string
  }
}
```

## 测试规范

- 单元测试用 Vitest
- 组件测试用 Testing Library
- E2E 测试用 Playwright
- 测试覆盖率 > 80%

## 安全要求

- 所有 API 调用必须有错误处理
- 敏感数据存环境变量
- 用户输入必须验证和清理
- SQL 查询用 Prisma（防注入）

## 性能要求

- 列表超过 50 项用虚拟滚动
- 图片用 Next/Image 优化
- 路由预加载
- 避免不必要的重渲染

## 常见问题

- 认证用 NextAuth.js，不要自己实现
- 状态管理优先用 React Query
- 表单用 react-hook-form + Zod 验证
- 日期用 date-fns，不用 moment.js
```

### 设置文件（settings.json）

```json
{
  "model": "claude-sonnet-4-6",
  "maxTokens": 8192,
  "permissions": {
    "allowedTools": [
      "Read",
      "Write",
      "Bash(git *)",
      "Bash(npm test)",
      "Bash(npm run dev)"
    ],
    "deny": [
      "Write(./.env*)",
      "Write(./production*)",
      "Bash(rm -rf *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.{ts,tsx})",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $file"
          }
        ]
      }
    ]
  }
}
```

## 安全和隐私

### 数据安全

**不要分享给 AI：**
- API 密钥
- 数据库密码
- 用户敏感信息
- 商业机密

**配置文件忽略：**

```bash
# .gitignore 和 .cursorignore
.env
.env.local
.env.production
*.key
*.pem
secrets/
```

**权限设置：**

```json
{
  "permissions": {
    "deny": [
      "Read(.env*)",
      "Write(.env*)",
      "Read(secrets/*)",
      "Bash(aws *)",
      "Bash(gpg *)"
    ]
  }
}
```

### 代码隐私

**理解工具的数据政策：**

| 工具 | 是否用代码训练 | 隐私政策 |
|------|---------------|----------|
| Cursor | 否 | 不用于训练其他模型 |
| Claude Code | 否 | Anthropic 隐私政策 |
| GitHub Copilot | 可选 | 默认用于训练，可关闭 |
| Tabnine | 可选 | 本地版不发送数据 |

**企业用户考虑：**
- Tabnine Enterprise（本地部署）
- 自托管模型
- 企业版 Copilot（不用于训练）

## 避免常见陷阱

### 1. 过度依赖

**表现：**
- 不看代码直接用
- 不理解原理
- 离开 AI 写不出代码

**预防：**
- AI 生成后，手动重写一遍
- 定期"禁用 AI"练习
- 理解 AI 的每一个建议

### 2. 接受第一次答案

AI 可能犯错或给出次优方案。

**正确做法：**
```
你: "实现快速排序"

AI: [给出方案]

你: "有更优的实现吗？"

AI: [给出改进方案]

你: "分析时间和空间复杂度"

AI: [详细分析]
```

### 3. 忽视安全性

AI 不会自动考虑安全。

**检查清单：**
- [ ] SQL 注入
- [ ] XSS 攻击
- [ ] CSRF 保护
- [ ] 输入验证
- [ ] 敏感数据泄露
- [ ] 依赖漏洞

**专门问 AI：**
```
"审查这段代码的安全问题：
- SQL 注入风险
- XSS 可能性
- 权限检查
@./src/api/users.ts"
```

### 4. 忽视性能

AI 写的代码能跑，但不一定快。

**性能检查：**
```
"分析这段代码的性能：
- 时间复杂度
- 内存占用
- 可能的优化
@./src/utils/dataProcessor.ts"
```

**让 AI 写性能测试：**
```
"为这个函数写性能基准测试，
处理 10000 条数据的耗时"
```

### 5. 不测试

AI 生成的代码可能有 bug。

**实践：**
```
"为这个功能写测试：
- 单元测试
- 边界情况
- 错误处理
@./src/features/userAuth.ts"
```

**测试覆盖率检查：**
```
"检查测试覆盖率，
找出未测试的代码路径"
```

## 团队协作

### 统一工具

**团队用同一套工具和配置：**

1. 共享 `.cursorrules` 或 `CLAUDE.md`
2. 统一 `settings.json`（版本控制）
3. 编写团队 Prompt 模板

### 代码审查

**AI 生成代码也要审查：**

- 理解逻辑
- 检查安全性
- 验证性能
- 确认测试覆盖
- 符合团队规范

**审查清单：**
```
- [ ] 代码逻辑正确
- [ ] 没有安全隐患
- [ ] 性能可接受
- [ ] 有测试覆盖
- [ ] 符合编码规范
- [ ] 注释充分
- [ ] 文档更新
```

### 知识分享

**团队学习：**
- 分享好的 Prompt
- 总结最佳实践
- 记录常见问题
- 定期讨论 AI 使用心得

## 持续改进

### 记录有效 Prompt

建立团队的 Prompt 库：

```markdown
# Prompt 库

## 功能开发
- 用户认证：[具体 prompt]
- 数据导出：[具体 prompt]
- 批量操作：[具体 prompt]

## 代码审查
- 安全审查：[具体 prompt]
- 性能分析：[具体 prompt]
- 重构建议：[具体 prompt]

## 调试
- 测试失败：[具体 prompt]
- 性能问题：[具体 prompt]
- 内存泄漏：[具体 prompt]
```

### 定期评估

**每个月问自己：**
- AI 帮我省了多少时间？
- 哪些场景最有用？
- 哪些场景不适合用 AI？
- 怎么提高使用效率？

**跟踪指标：**
- 开发速度（功能/周）
- Bug 数量
- 代码审查时间
- 学习曲线

## 进阶技巧

### 1. 分阶段使用 AI

```
阶段 1：头脑风暴
"给我列出实现 X 的 5 种方案"

阶段 2：详细设计
"基于方案 A，设计详细架构"

阶段 3：实现
"分步实现这个设计"

阶段 4：优化
"分析性能，给出优化建议"

阶段 5：文档
"生成技术文档和用户文档"
```

### 2. 用 AI 学习

```
"这段代码用了我不熟悉的模式，
解释它的工作原理和最佳实践"
```

```
"对比 React.memo、useMemo、useCallback，
说明使用场景和注意事项"
```

### 3. 代码迁移

```
"把这个组件从 JavaScript 迁移到 TypeScript，
添加完整的类型定义"
```

```
"把 Redux 代码迁移到 Zustand，
保持功能不变"
```

### 4. 文档生成

```
"为这个 API 生成文档：
- 功能描述
- 参数说明
- 返回值
- 使用示例
- 错误处理"
```

## 参考资源

**实践指南：**
- [Addy Osmani 的 AI 工作流](https://addyosmani.com/blog/ai-coding-workflow/)
- [Mukesh 的 Claude Code 指南](https://codewithmukesh.com/blog/claude-code-for-beginners/)
- [Prompt Engineering 最佳实践](https://www.digitalapplied.com/blog/prompt-engineering-advanced-techniques-2026)

**工具文档：**
- [Cursor 文档](https://cursor.sh/docs)
- [Claude Code 文档](https://code.claude.com/docs)
- [GitHub Copilot 指南](https://docs.github.com/en/copilot)

**社区：**
- [r/LocalLLama](https://reddit.com/r/LocalLLama) - AI 编程讨论
- [Cursor Discord](https://discord.gg/cursor)
- [Claude Discord](https://discord.gg/anthropic)

## 下一步

1. 选择一个工具，深入使用
2. 建立自己的配置文件
3. 记录有效的 Prompt
4. 定期反思和改进
5. 分享给团队

[继续学习：开发环境搭建 →](/agent-ecosystem/06-ai-coding-tools/05-environment-setup)
