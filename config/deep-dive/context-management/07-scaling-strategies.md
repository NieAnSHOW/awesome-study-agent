# 不同规模项目的上下文策略

根据项目规模选择合适的上下文管理方案。

---

按规模分类，从个人项目到大型企业，每个规模有不同的特点和需求。

---

## 个人项目

### 特点

- 文档量少（通常 <10 页）
- 变化频繁
- 维护者唯一
- 成本敏感

### 推荐方案：README + Claude Projects

#### 方案 A：增强型 README

这是最基础也是最重要的方案。一个好的 README 应该让其他人（包括未来的你）能够快速理解项目并开始工作。

**模板示例**：

```markdown
# 项目名称

> 一句话描述项目是什么

## 快速开始
\`\`\`bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 运行测试
pnpm test
\`\`\`

## 技术栈
- **前端**：React 19 + TypeScript 5.8 + Vite
- **状态管理**：Zustand 5
- **样式**：Tailwind CSS 4
- **后端**：Node.js + Hono
- **数据库**：PostgreSQL + Drizzle ORM

## 项目结构
\`\`\`
src/
├── components/    # React 组件
│   ├── ui/        # 基础 UI 组件
│   └── features/  # 业务组件
├── hooks/         # 自定义 Hooks
├── lib/           # 工具函数和第三方库配置
├── stores/        # Zustand stores
├── types/         # TypeScript 类型定义
└── App.tsx        # 应用入口
\`\`\`

## 开发规范
- 使用 Biome 代替 ESLint/Prettier（更快的性能）
- 提交前运行 \`pnpm lint\` 和 \`pnpm test\`
- 遵循 Conventional Commits 规范
- 分支命名：\`feature/xxx\`、\`fix/xxx\`、\`docs/xxx\`

## 常用命令
| 命令 | 说明 |
|------|------|
| \`pnpm dev\` | 启动开发服务器 |
| \`pnpm build\` | 构建生产版本 |
| \`pnpm test\` | 运行测试 |
| \`pnpm lint\` | 代码检查 |
| \`pnpm format\` | 代码格式化 |

## 常见问题
**Q: 如何添加新页面？**
A: 在 \`src/pages/\` 下创建新组件，路由会自动注册。

**Q: 数据库迁移怎么做？**
A: 运行 \`pnpm db:migrate\`，迁移文件在 \`drizzle/\` 目录。

**Q: 如何调试 API？**
A: 开发环境已集成 Zod 自动 OpenAPI 文档，访问 /docs 查看

## 环境变量
复制 \`.env.example\` 为 \`.env.local\` 并填写：
\`\`\`
DATABASE_URL=postgresql://...
API_KEY=your_api_key_here
\`\`\`

## 相关链接
- [在线文档](https://your-docs-site.com)
- [问题反馈](https://github.com/xxx/issues)
```

#### 方案 B：使用 Claude Projects（推荐）

Claude Projects 是 Anthropic 在 2025 年推出的项目上下文管理功能，可以大幅提升 AI 编程效率。

**设置步骤**：

```bash
# 1. 在 Claude Code 中创建项目
claude project create my-awesome-project

# 2. 添加项目文件
claude project add README.md
claude project add src/

# 3. 设置项目提示词（通过 .claude/ 项目配置）
```

**`.claude/settings.md` 配置示例**：

```markdown
# 项目上下文

## 项目概述
这是一个个人项目，使用 React 19 + TypeScript 构建的现代化 Web 应用。

## 技术栈约束
- **必须使用**：函数式组件 + Hooks（不使用 Class 组件）
- **状态管理**：Zustand（不使用 Redux）
- **API 调用**：使用 fetch + async/await（不使用 axios）
- **样式**：优先使用 Tailwind CSS 类名

## 代码风格
- 使用 Biome 进行格式化
- 组件命名：PascalCase（如 \`UserList.tsx\`）
- 工具函数命名：camelCase（如 \`formatDate.ts\`）
- 常量命名：UPPER_SNAKE_CASE（如 \`API_BASE_URL\`）

## 禁止事项
- 不要使用 \`any\` 类型，优先使用 \`unknown\` 或具体类型
- 不要直接修改 props，优先使用 \`useState\` 复制
- 不要在组件中直接调用 API，使用自定义 Hooks 封装

## 文档约定
- 复杂逻辑必须添加注释说明
- 公共组件必须添加 JSDoc 注释
- API 调用必须说明参数和返回值类型
```

**Claude Projects 的核心优势**：

1. **持久化上下文**：项目配置和文档会跨会话保持，不用每次重新解释
2. **智能文件关联**：自动识别项目结构，理解模块间依赖关系
3. **增量同步**：只同步变更的文件，节省 Token 成本
4. **团队共享**：可以共享 Projects 配置，团队使用同一套规范

### 何时升级？

满足以下任一条件时考虑升级：

```
┌─────────────────────────────────────────────────────┐
│ 升级信号检查清单                                      │
├─────────────────────────────────────────────────────┤
│ README 超过 300 行   □ 是  □ 否                     │
│ 需要维护 >5 个文档文件   □ 是  □ 否                 │
│ 需要与 AI 进行复杂协作（如重构、架构设计）  □ 是  □ 否 │
│ 开始与他人协作开发   □ 是  □ 否                      │
│ 需要版本管理和历史记录   □ 是  □ 否                   │
└─────────────────────────────────────────────────────┘

如果勾选 ≥2 项，建议升级到小团队方案。
```

---

## 小团队项目（2-10人）

### 特点

- 需要团队共享知识
- 文档量中等（10-50 页）
- 有一定规范要求
- 需要版本控制
- 成本敏感但愿意投入工具提升效率

### 推荐方案：VitePress Wiki + Claude Projects

#### 方案 A：Notion（适合非技术团队）

**优点**：
- 界面友好，上手零门槛
- 模板丰富，支持多种内容类型
- 实时协作体验好
- 与其他工具集成丰富（Slack、GitHub 等）

**缺点**：
- 搜索功能较弱（不支持高级搜索）
- 版本管理困难（虽然有历史记录，但难以对比）
- API 不友好，难以自动化
- 数据导出后格式混乱
- 定价较高（2025 年起个人版 $10/月）

**适合场景**：非技术团队、产品团队、设计团队，或快速原型阶段

#### 方案 B：GitHub Wiki（适合开源项目）

**优点**：
- 与代码仓库无缝集成
- 免费，无额外成本
- 支持版本控制和 PR 审查
- 开源项目天然支持

**缺点**：
- 界面简陋，定制性差
- 搜索功能基础
- 不支持复杂导航结构
- 无权限管理

**典型结构**：

```markdown
# 项目 Wiki 结构

Home
├── 快速开始
├── 开发指南
│   ├── 环境搭建
│   ├── 代码规范
│   └── 测试指南
├── 架构设计
│   ├── 技术栈
│   ├── 目录结构
│   └── 模块说明
└── API 文档
    ├── 用户模块
    ├── 订单模块
    └── 支付模块
```

#### 方案 C：VitePress（推荐，适合技术团队）

VitePress 是 Vue 团队开发的现代化静态站点生成器，基于 Vite 构建，拥有极快的开发体验和构建性能。

**核心优势**：

1. **性能出众**：
   - 开发服务器启动不到 100 毫秒
   - 热更新几乎零延迟
   - 构建速度比 VuePress 快 10-20 倍

2. **开发体验**：
   - 配置文件原生支持 TypeScript
   - Markdown 里直接写 Vue 组件
   - 内置搜索（Algolia 或本地）
   - 主题定制灵活

3. **部署简单**：
   - 生成纯静态文件，部署到任何静态托管
   - 支持 GitHub Pages、Netlify、Vercel
   - 自动生成 Sitemap

**快速开始**：

```bash
# 安装
pnpm add -D vitepress

# 初始化
npx vitepress init

# 目录结构
docs/
├── .vitepress/
│   ├── config.mts     # 配置文件
│   └── theme/         # 自定义主题（可选）
├── index.md           # 首页
├── guide/             # 开发指南
│   ├── setup.md
│   ├── coding-standards.md
│   └── testing.md
└── api/               # API 文档
    ├── users.md
    └── orders.md

# 启动开发服务器
pnpm docs:dev

# 构建
pnpm docs:build
```

**配置示例（VitePress 1.6+）**：

```typescript
// docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '我的项目 Wiki',
  description: '团队协作文档中心',
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '开发指南', link: '/guide/setup' },
      { text: 'API 文档', link: '/api/users' },
      {
        text: '更多',
        items: [
          { text: 'GitHub', link: 'https://github.com/xxx' },
          { text: '更新日志', link: '/changelog' }
        ]
      }
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开发指南',
          items: [
            { text: '环境搭建', link: '/guide/setup' },
            { text: '代码规范', link: '/guide/coding-standards' },
            { text: '测试指南', link: '/guide/testing' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '用户模块', link: '/api/users' },
            { text: '订单模块', link: '/api/orders' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xxx' }
    ],

    // 搜索配置（使用 Algolia）
    search: {
      provider: 'algolia',
      options: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_SEARCH_API_KEY',
        indexName: 'YOUR_INDEX_NAME'
      }
    }
  },

  // Markdown 配置
  markdown: {
    // 行号
    lineNumbers: true,
    // 代码分组
    codeGroups: true,
    // 排版（支持中文标点优化）
    config: (md) => {
      // 可以添加 markdown-it 插件
    }
  }
})
```

**高级功能：团队定制主题**

```typescript
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    // app.component('MyComponent', MyComponent)
  }
} satisfies Theme
```

**与 Claude Projects 集成**：

```markdown
<!-- .claude/settings.md -->
# 项目上下文

## Wiki 文档
本项目的完整文档托管在 VitePress Wiki 中：
- 本地：\`docs/\` 目录
- 在线：https://wiki.your-project.com

## 重要文档链接
- [开发指南](https://wiki.your-project.com/guide/setup)
- [代码规范](https://wiki.your-project.com/guide/coding-standards)
- [API 文档](https://wiki.your-project.com/api/users)

## 使用方式
在向 AI 提问时，可以引用具体的 Wiki 页面链接，
AI 会自动获取页面内容作为上下文。
```

### 团队协作实践

#### 1. 文档更新流程

建立"文档即代码"（Docs as Code）的工作流：

```
┌─────────┐      ┌─────────┐      ┌──────────┐
│ 代码变更 │ ──→ │ 文档更新 │ ──→ │ 单个 PR  │
└─────────┘      └─────────┘      └──────────┘
                                         │
                                         ▼
                                    ┌─────────┐
                                    │  Code   │
                                    │ Review  │
                                    └─────────┘
                                         │
                                         ▼
                                    ┌─────────┐
                                    │ 合并到  │
                                    │  main   │
                                    └─────────┘
                                         │
                                         ▼
                                    ┌─────────┐
                                    │ 自动部署 │
                                    │  Wiki   │
                                    └─────────┘
```

**实施建议**：

1. 在 PR 模板中添加文档检查项：
   ```markdown
   ## 文档更新
   - [ ] 代码变更已更新相关文档
   - [ ] 新功能已添加文档说明
   - [ ] Breaking changes 已标注
   ```

2. 使用自动化工具检查文档：
   - Lint-staged 检查文档格式
   - Markdown Lint 检查语法
   - Spell Check 检查拼写

3. 设置 CI/CD 自动部署：
   ```yaml
   # .github/workflows/docs.yml
   name: Deploy Docs

   on:
     push:
       branches: [main]
       paths: ['docs/**']

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - run: pnpm install
         - run: pnpm docs:build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: docs/.vitepress/dist
   ```

#### 2. 定期文档维护

**每周例会（15 分钟）**：
- 检查是否有未记录的 API 变更
- 补充缺失的文档内容
- 讨论文档改进建议
- 分配有更新任务

**每月审查（1 小时）**：
- 全面审查文档完整性
- 删除过时内容
- 优化组织结构
- 更新截图和示例

**每季度复盘**：
- 评估文档质量
- 收集团队反馈
- 调整文档策略
- 培训新成员

#### 3. AI 协作最佳实践

**方式一：Claude Projects 共享**

```bash
# 团队共享项目配置
# .claude/settings.md

# 项目上下文

## 团队 Wiki
- 在线文档：https://wiki.team.com
- 本地路径：\`docs/\` 目录

## 使用约定
1. 所有技术决策必须在 Wiki 中记录
2. API 变更必须更新 API 文档
3. 代码规范参考 \`/guide/coding-standards.md\`
4. 提问时优先引用 Wiki 链接

## 快速链接
- [项目架构](https://wiki.team.com/architecture/overview)
- [API 文档](https://wiki.team.com/api/)
- [常见问题](https://wiki.team.com/faq)
```

**方式二：文档链接引用**

在向 AI 提问时，直接引用 Wiki 页面：

```
请帮我实现用户登录功能，参考这个文档：
https://wiki.team.com/guide/authentication.md

相关 API 文档：
https://wiki.team.com/api/auth
```

**方式三：本地文档索引**

```markdown
# .claude/docs-index.md

## 文档索引

### 架构设计
- [系统架构](../docs/architecture/overview.md)
- [数据库设计](../docs/architecture/database.md)
- [API 设计](../docs/architecture/api.md)

### 开发指南
- [环境搭建](../docs/guide/setup.md)
- [代码规范](../docs/guide/coding-standards.md)
- [测试指南](../docs/guide/testing.md)

### API 文档
- [认证模块](../docs/api/auth.md)
- [用户模块](../docs/api/users.md)
- [订单模块](../docs/api/orders.md)
```

#### 4. 文档质量保证

**建立文档规范**：

1. **统一的文档结构**：
   ```markdown
   # 页面标题

   > 简要说明（可选）

   ## 背景/动机
   为什么需要这个功能/模块

   ## 实现方案
   具体的实现细节

   ## 使用示例
   代码示例或操作步骤

   ## 注意事项
   需要特别注意的点

   ## 相关链接
   - 相关 Issue: #123
   - 相关 PR: #456
   ```

2. **代码注释规范**：
   ```typescript
   /**
    * 用户认证服务
    *
    * @description 处理用户登录、注册、token 管理等功能
    *
    * @example
    * ```ts
    * const authService = new AuthService()
    * const token = await authService.login('user@example.com', 'password')
    * ```
    */
   export class AuthService {
     // ...
   }
   ```

3. **API 文档模板**：
   ```markdown
   # API 模块名称

   ## 概述
   简要说明这个模块的作用

   ## 接口列表

   ### POST /api/users/create

   **描述**：创建新用户

   **请求参数**：
   | 参数 | 类型 | 必填 | 说明 |
   |------|------|------|------|
   | email | string | 是 | 用户邮箱 |
   | password | string | 是 | 密码（最少 8 位） |

   **响应示例**：
   \`\`\`json
   {
     "code": 0,
     "data": {
       "id": "user_123",
       "email": "user@example.com"
     }
   }
   \`\`\`

   **错误码**：
   | 错误码 | 说明 |
   |--------|------|
   | 40001 | 邮箱已存在 |
   | 40002 | 密码格式错误 |
   ```

### 何时升级？

```
┌─────────────────────────────────────────────────────┐
│ 升级信号检查清单                                      │
├─────────────────────────────────────────────────────┤
│ 文档超过 50 页   □ 是  □ 否                          │
│ 团队超过 10 人   □ 是  □ 否                          │
│ 需要细粒度权限控制（不同团队看不同内容）  □ 是  □ 否  │
│ 需要高级搜索功能（全文搜索、语义搜索）  □ 是  □ 否   │
│ 文档更新频繁，需要自动同步到 AI  □ 是  □ 否          │
│ 多个产品线需要独立文档空间  □ 是  □ 否                │
└─────────────────────────────────────────────────────┘

如果勾选 ≥3 项，建议升级到中型团队方案。
```

**成本对比**：

| 方案 | 月成本 | 设置时间 | 维护成本 |
|------|--------|----------|----------|
| VitePress + GitHub Pages | 免费 | 2-4 小时 | 低 |
| Notion | $10/用户 | 30 分钟 | 低 |
| GitBook | $15/用户 | 1 小时 | 低 |
| Confluence | ~$100/10人 | 4-8 小时 | 中 |

---

## 中型团队（10-50人）

### 特点

- 文档量大（50-500 页）
- 多个产品线或业务线
- 需要权限管理（不同团队/角色可见不同内容）
- 需要强大的搜索功能
- 有专门的文档维护人员或团队
- 愿意投入成本提升效率

### 推荐方案：专业 Wiki + RAG 系统

#### 方案对比

| 方案 | 适合场景 | 月成本 | 优势 | 劣势 |
|------|----------|--------|------|------|
| **GitBook** | 技术团队、开源项目 | $15+/用户 | 界面美观、搜索强、Git 集成 | 付费、定制有限 |
| **Confluence** | 使用 Atlassian 全家桶 | ~$200-500/50人 | 功能强大、企业权限、插件丰富 | 昂贵、复杂、学习成本高 |
| **VitePress + RAG** | 技术团队、有开发能力 | 低（主要是服务器成本） | 灵活可控、可深度定制 | 需要开发维护 |

#### 方案 A：GitBook（适合有预算的技术团队）

GitBook 是专为技术文档设计的知识库平台，2025 年已成为许多技术团队的首选。

**核心优势**：

1. **开发者友好**：
   - 原生支持 Markdown
   - 与 Git 无缝集成
   - API 友好，支持自动化
   - Webhook 集成

2. **强大的搜索**：
   - 全文搜索
   - 语义搜索（2025 年新增）
   - 搜索结果高亮
   - 搜索分析

3. **权限管理**：
   - 基于空间的权限
   - 公开/私有内容分离
   - SSO 单点登录

4. **协作功能**：
   - 多人实时编辑
   - 评论和讨论
   - 变更历史和对比
   - 分支和合并

**定价（2025 年）**：
- Personal：免费（公开内容）
- Pro：$15/用户/月
- Team：$25/用户/月（含权限管理）
- Enterprise：定制（含 SSO、审计等）

#### 方案 B：Confluence（适合使用 Atlassian 全家桶）

Confluence 是 Atlassian 公司的企业级知识管理平台，与 Jira、Bitbucket 深度集成。

**核心优势**：

1. **企业级功能**：
   - 细粒度权限控制（页面级、空间级）
   - 审批流程
   - 版本管理和对比
   - 审计日志

2. **丰富的插件生态**：
   - Chart 宏（数据可视化）
   - Code 宏（代码高亮）
   - 任务管理
   - 页面模板

3. **与 Jira 集成**：
   - 需求文档关联 Jira Ticket
   - 自动同步状态
   - Sprint  retrospective

**挑战**：
- 成本较高（50 人团队约 $300-500/月）
- 界面较复杂，学习成本高
- 搜索速度慢（大量内容时）
- 需要专门的管理员

#### 方案 C：自建 VitePress + RAG 系统（推荐，适合技术团队）

这是最具性价比和灵活性的方案，特别适合有开发能力的团队。

**架构设计**：

```
┌─────────────────────────────────────────────────────┐
│                  用户界面层                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ VS Code 插件 │  │  Web 搜索    │  │  CLI 工具   │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                  API 网关层                          │
│  ┌───────────────────────────────────────────────┐ │
│  │  FastAPI / Express / Next.js API Routes       │ │
│  │  - 身份认证                                    │ │
│  │  - 权限检查                                    │ │
│  │  - 请求限流                                    │ │
│  └───────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌────────────────────┐
│   VitePress Wiki │    │    RAG 系统        │
│  - 公开文档       │    │  - 向量数据库      │
│  - 开发指南       │◄───┤  - 检索引擎        │
│  - API 文档       │    │  - 权限过滤        │
└──────────────────┘    └───────────┬─────────┘
                                     │
                                     ▼
                           ┌────────────────────┐
                           │   文档存储         │
                           │  - Git 仓库        │
                           │  - 对象存储        │
                           └────────────────────┘
```

**技术栈选型（2025 年推荐）**：

| 组件 | 推荐方案 | 说明 |
|------|----------|------|
| **Wiki 生成** | VitePress 1.6+ | 性能优秀，开发体验好 |
| **向量数据库** | Chroma / Qdrant | 开源、易部署 |
| **嵌入模型** | OpenAI text-embedding-3 / BGE | 效果和成本平衡 |
| **检索框架** | LangChain 0.3+ / LlamaIndex | 生态成熟 |
| **API 框架** | FastAPI / Hono | 性能好，类型安全 |
| **前端** | Next.js 15 | 现代化，部署简单 |

**实现示例（2025 年技术栈）**：

```python
# rag_service.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader, TextLoader
import os

app = FastAPI(title="知识库 RAG 服务", version="2.0.0")

# ============ 配置 ============
class Config:
    # 向量数据库配置
    CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    # OpenAI 配置（或使用本地嵌入模型）
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    # 文档目录
    DOCS_DIR = os.getenv("DOCS_DIR", "./docs")

# ============ 数据模型 ============
class SearchRequest(BaseModel):
    query: str
    team: Optional[str] = None
    top_k: int = 5

class SearchResponse(BaseModel):
    results: List[dict]

class AskRequest(BaseModel):
    query: str
    team: Optional[str] = None
    context_length: int = 3

# ============ 初始化 ============
# 初始化嵌入模型（可以使用更经济的方案）
embeddings = OpenAIEmbeddings(
    openai_api_key=Config.OPENAI_API_KEY,
    model="text-embedding-3-small"  # 更便宜的模型
)

# 初始化向量数据库
vectorstore = Chroma(
    persist_directory=Config.CHROMA_PERSIST_DIR,
    embedding_function=embeddings,
    collection_name="knowledge_base"
)

# ============ API 端点 ============

@app.post("/api/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """
    搜索文档，支持团队过滤

    Args:
        request: 搜索请求参数

    Returns:
        搜索结果列表
    """
    try:
        # 构建搜索参数
        search_kwargs = {"k": request.top_k}

        # 添加团队过滤（元数据过滤）
        if request.team:
            search_kwargs["filter"] = {"team": request.team}

        # 执行相似性搜索
        results = vectorstore.similarity_search(
            request.query,
            **search_kwargs
        )

        # 格式化结果
        formatted_results = [
            {
                "content": result.page_content[:500],  # 限制长度
                "source": result.metadata.get("source", "unknown"),
                "team": result.metadata.get("team", "all"),
                "score": getattr(result, 'score', 0.0)
            }
            for result in results
        ]

        return SearchResponse(results=formatted_results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ask")
async def ask(request: AskRequest):
    """
    使用 RAG 回答问题（基于检索增强生成）

    Args:
        request: 问答请求参数

    Returns:
        答案和来源文档
    """
    from langchain.chains import RetrievalQA
    from langchain_openai import ChatOpenAI
    from langchain.prompts import PromptTemplate

    try:
        # 构建检索器
        search_kwargs = {}
        if request.team:
            search_kwargs["filter"] = {"team": request.team}

        retriever = vectorstore.as_retriever(
            search_kwargs=search_kwargs,
            search_type="similarity",
            search_kwargs={"k": request.context_length}
        )

        # 自定义 Prompt
        prompt_template = """使用以下上下文来回答问题。如果不知道答案，就说不知道，不要编造答案。

上下文：
{context}

问题：{question}

答案："""

        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )

        # 创建 QA 链
        llm = ChatOpenAI(
            model="gpt-4o-mini",  # 使用更经济的模型
            temperature=0,
            openai_api_key=Config.OPENAI_API_KEY
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": PROMPT}
        )

        # 执行问答
        result = qa_chain({"query": request.query})

        return {
            "answer": result["result"],
            "sources": [
                {
                    "source": doc.metadata.get("source", "unknown"),
                    "content": doc.page_content[:200]
                }
                for doc in result["source_documents"]
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/index")
async def index_documents():
    """
    索引文档到向量数据库

    当文档更新时调用此端点重新索引
    """
    try:
        # 加载文档
        loader = DirectoryLoader(
            Config.DOCS_DIR,
            glob="**/*.md",
            loader_cls=TextLoader
        )
        documents = loader.load()

        # 分割文档
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

        texts = text_splitter.split_documents(documents)

        # 添加元数据
        for text in texts:
            # 从文件路径提取团队信息
            source = text.metadata.get("source", "")
            if "/backend/" in source:
                text.metadata["team"] = "backend"
            elif "/frontend/" in source:
                text.metadata["team"] = "frontend"
            else:
                text.metadata["team"] = "all"

        # 向量化并存储
        vectorstore.add_documents(texts)

        return {
            "message": "文档索引完成",
            "indexed_count": len(texts)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "service": "RAG Knowledge Base"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**部署配置（Docker Compose）**：

```yaml
# docker-compose.yml
version: '3.8'

services:
  # RAG API 服务
  rag-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - CHROMA_PERSIST_DIR=/chroma_db
      - DOCS_DIR=/docs
    volumes:
      - chroma_data:/chroma_db
      - ./docs:/docs
    restart: unless-stopped

  # Chroma 向量数据库（可选，也可以使用嵌入式）
  chroma:
    image: chromadb/chroma:latest
    ports:
      - "8001:8000"
    volumes:
      - chroma_data:/chroma/chroma
    restart: unless-stopped

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - rag-api
    restart: unless-stopped

volumes:
  chroma_data:
```

**VS Code 插件集成**：

```typescript
// extension.ts - VS Code 插件示例
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 注册搜索命令
    const searchCommand = vscode.commands.registerCommand(
        'knowledgeBase.search',
        async () => {
            // 获取用户输入
            const query = await vscode.window.showInputBox({
                prompt: '搜索知识库',
                placeHolder: '输入问题...'
            });

            if (!query) return;

            // 调用 RAG API
            const response = await fetch('http://localhost:8000/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, top_k: 5 })
            });

            const results = await response.json();

            // 显示结果
            const items = results.results.map((r: any) => ({
                label: r.source,
                detail: r.content.substring(0, 100),
                description: `Score: ${r.score.toFixed(2)}`
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: '搜索结果'
            });

            if (selected) {
                // 打开对应文档
                vscode.commands.executeCommand(
                    'vscode.open',
                    vscode.Uri.parse(selected.label)
                );
            }
        }
    );

    context.subscriptions.push(searchCommand);
}
```

### 权限管理

对于中型团队，需要实现基本的权限控制，确保不同团队只能访问相关文档。

**按团队的权限配置**：

```python
# permissions.py
from typing import List, Dict
from enum import Enum

class Team(str, Enum):
    FRONTEND = "frontend"
    BACKEND = "backend"
    DEVOPS = "devops"
    PRODUCT = "product"
    DESIGN = "design"
    ALL = "all"

# 文档空间与团队映射
DOCUMENT_SPACES: Dict[Team, List[str]] = {
    Team.FRONTEND: [
        "docs/frontend/",
        "docs/api/client/",
        "docs/guide/frontend/"
    ],
    Team.BACKEND: [
        "docs/backend/",
        "docs/api/server/",
        "docs/database/",
        "docs/guide/backend/"
    ],
    Team.DEVOPS: [
        "docs/deployment/",
        "docs/monitoring/",
        "docs/infrastructure/"
    ],
    Team.PRODUCT: [
        "docs/product/",
        "docs/requirements/",
        "docs/roadmap/"
    ],
    Team.DESIGN: [
        "docs/design/",
        "docs/assets/",
        "docs/brand/"
    ],
    Team.ALL: [
        "docs/about/",
        "docs/faq/",
        "docs/getting-started/"
    ]
}

# 用户团队映射（实际应用中应从数据库或 SSO 获取）
USER_TEAMS: Dict[str, List[Team]] = {
    "user@example.com": [Team.FRONTEND],
    "backend-dev@example.com": [Team.BACKEND],
    "devops@example.com": [Team.DEVOPS],
    "pm@example.com": [Team.PRODUCT],
    # 多角色用户
    "tech-lead@example.com": [Team.FRONTEND, Team.BACKEND, Team.ALL]
}

class PermissionChecker:
    """权限检查器"""

    @staticmethod
    def check_access(user_email: str, doc_path: str) -> bool:
        """
        检查用户是否有权限访问指定文档

        Args:
            user_email: 用户邮箱
            doc_path: 文档路径

        Returns:
            是否有权限
        """
        user_teams = USER_TEAMS.get(user_email, [])

        for team in user_teams:
            allowed_paths = DOCUMENT_SPACES.get(team, [])
            if any(doc_path.startswith(path) for path in allowed_paths):
                return True

        return False

    @staticmethod
    def get_accessible_paths(user_email: str) -> List[str]:
        """
        获取用户可访问的所有路径

        Args:
            user_email: 用户邮箱

        Returns:
            可访问路径列表
        """
        user_teams = USER_TEAMS.get(user_email, [])
        paths = set()

        for team in user_teams:
            paths.update(DOCUMENT_SPACES.get(team, []))

        return list(paths)

    @staticmethod
    def filter_results(user_email: str, results: List[dict]) -> List[dict]:
        """
        过滤搜索结果，只返回用户有权限的内容

        Args:
            user_email: 用户邮箱
            results: 搜索结果列表

        Returns:
            过滤后的结果
        """
        accessible_paths = PermissionChecker.get_accessible_paths(user_email)

        return [
            r for r in results
            if any(r.get('source', '').startswith(path) for path in accessible_paths)
        ]
```

**FastAPI 中的权限集成**：

```python
# rag_service.py (续)
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from permissions import PermissionChecker

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> str:
    """
    从 Bearer Token 中提取用户信息
    实际应用中应验证 JWT 或使用 SSO
    """
    token = credentials.credentials

    # 简化示例：直接使用 token 作为邮箱
    # 生产环境应验证 JWT 签名
    if "@" in token:
        return token

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials"
)


@app.post("/api/search", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    current_user: str = Depends(get_current_user)
):
    """带权限检查的搜索"""
    try:
        search_kwargs = {"k": request.top_k}

        # 执行搜索（不过滤团队，获取所有结果）
        results = vectorstore.similarity_search(
            request.query,
            **search_kwargs
        )

        # 权限过滤
        filtered_results = PermissionChecker.filter_results(
            current_user,
            [{"source": r.metadata.get("source", ""),
              "content": r.page_content,
              "team": r.metadata.get("team", "all")}
             for r in results]
        )

        return SearchResponse(results=filtered_results[:request.top_k])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 何时升级？

```
┌─────────────────────────────────────────────────────┐
│ 升级信号检查清单                                      │
├─────────────────────────────────────────────────────┤
│ 文档超过 500 页   □ 是  □ 否                         │
│ 团队超过 50 人   □ 是  □ 否                          │
│ 多个产品线独立运营   □ 是  □ 否                       │
│ 需要复杂的审批流程（文档发布前需审核）  □ 是  □ 否    │
│ 需要知识图谱（实体关联、智能推荐）  □ 是  □ 否        │
│ 有合规要求（需要审计日志、权限追溯）  □ 是  □ 否      │
│ 需要多语言支持（国际化团队）  □ 是  □ 否              │
└─────────────────────────────────────────────────────┘

如果勾选 ≥4 项，建议升级到大型企业方案。
```

**成本估算**：

| 方案 | 初始成本 | 年度成本 | 维护成本 |
|------|----------|----------|----------|
| GitBook | $0 | $15,000 (50人) | 低 |
| Confluence | $0 | $6,000-12,000 | 中（需管理员） |
| 自建 VitePress + RAG | $5,000-20,000 | $2,000-5,000（服务器） | 高（需开发） |

---

## 大型企业（50+人）

### 特点

- 文档海量化（>500 页，可能数万页）
- 多产品线、多业务单元、多地域
- 复杂权限体系（RBAC、ABAC）
- 合规要求（审计、数据 residency、安全认证）
- 多语言支持（全球化团队）
- 需要专门的知识管理团队
- 预算充足，追求稳定和安全

### 推荐方案：企业级知识平台

#### 方案对比

| 方案 | 适合场景 | 年成本 | 优势 | 劣势 |
|------|----------|--------|------|------|
| **SharePoint + Copilot** | 使用 Microsoft 365 生态 | $20-50/用户 | 深度集成、企业级安全、Copilot AI | 昂贵、复杂 |
| **Atlassian 全家桶** | 技术企业、使用 Jira | $30-80/用户 | 生态完整、插件丰富 | 成本高、迁移难 |
| **ServiceNow** | 大型企业、ITSM 集成 | $100+/用户 | 功能全面、工作流强大 | 非常昂贵、复杂 |
| **自建知识平台** | 有技术团队、需求特殊 | 定制 | 完全可控、可深度定制 | 开发成本高 |

#### 方案 A：Microsoft SharePoint + Copilot（2025 年推荐）

对于已经使用 Microsoft 365 的大型企业，SharePoint + Microsoft 365 Copilot 是最自然的选择。

**核心能力（2025 年更新）**：

1. **SharePoint 知识库**：
   - 文档中心（Document Center）
   - 版本控制和审批流程
   - 细粒度权限（项目级、文档库级、文档级）
   - 内容类型和元数据
   - 保留策略（Retention Policy）

2. **Microsoft 365 Copilot 集成**：
   - 在 Teams 中直接询问文档内容
   - Word/PowerPoint 中的智能辅助
   - 自动总结和摘要
   - 跨 SharePoint 站点搜索

3. **知识代理（Knowledge Agent，2025 新功能）**：

   *来源：Microsoft Learn - 知识代理概述*

   知识代理是 Microsoft 2025 年推出的新功能，可以让 Copilot 访问特定的 SharePoint 知识源：

   ```typescript
   // 配置知识代理
   const knowledgeAgent = {
       name: "公司知识库",
       sources: [
           {
               type: "sharepoint",
               siteUrl: "https://contoso.sharepoint.com/sites/knowledge"
           }
       ],
       permissions: {
           allowAllUsers: true,
           restrictedGroups: ["外部协作者"]
       }
   }
   ```

**架构示例**：

```
┌──────────────────────────────────────────────────────────┐
│                    用户界面层                              │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌───────┐ │
│  │   Teams    │  │  SharePoint│  │  Word    │  │ Outlook│ │
│  └────────────┘  └────────────┘  └──────────┘  └───────┘ │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Microsoft 365 Copilot                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  知识代理 (Knowledge Agent)                        │  │
│  │  - SharePoint 知识源                               │  │
│  │  - 权限感知检索                                    │  │
│  │  - 多租户支持                                      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              SharePoint + OneDrive                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ 文档中心      │  │ 知识库站点    │  │ 个人 OneDrive  │ │
│  └──────────────┘  └──────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Microsoft Purview（合规）                    │
│  - 数据生命周期管理                                       │
│  - 敏感信息保护                                           │
│  - 审计日志                                              │
└──────────────────────────────────────────────────────────┘
```

**实施步骤**：

1. **规划和设计**（2-4 周）：
   - 识别知识域和内容类型
   - 设计信息架构（IA）
   - 规划权限模型

2. **配置 SharePoint**（2-4 周）：
   - 创建知识库站点
   - 配置文档库和内容类型
   - 设置元数据和分类
   - 配置权限组

3. **启用知识代理**（1-2 周）：
   - 配置 Copilot 知识源
   - 设置权限过滤
   - 测试和调优

4. **培训和推广**（持续）：
   - 用户培训
   - 创建使用指南
   - 收集反馈优化

**成本估算**：

| 许可证 | 价格/月 | 功能 |
|--------|---------|------|
| Microsoft 365 E3 | $32/用户 | 基础功能 |
| Microsoft 365 E5 | $57/用户 | 包含 Copilot |
| Copilot add-on | $30/用户 | E3 订阅的 Copilot 加购 |

*50 人团队，使用 E5：~$34,200/年*

#### 方案 B：自建知识图谱 + RAG 平台

对于有特殊需求或追求完全自主控制的企业，可以自建知识图谱增强的 RAG 平台。

**架构设计（2025 年最佳实践）**：

```
┌───────────────────────────────────────────────────────────────┐
│                       应用层                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Web 门户    │  │  VS Code     │  │  Teams/Slack Bot    │ │
│  │  - 智能搜索  │  │  插件        │  │  - 问答助手          │ │
│  │  - 知识浏览  │  │  - 代码上下文│  │  - 文档推荐          │ │
│  │  - AI 助手   │  │              │  │                      │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                    API 网关与编排层                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  - 身份认证 (SSO/OIDC)                                   │  │
│  │  - 权限检查 (RBAC/ABAC)                                  │  │
│  │  - 请求路由                                              │  │
│  │  - 限流和缓存                                            │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   知识图谱层     │  │    RAG 引擎层    │  │   全文搜索层     │
│  - Neo4j / Nebula│  │  - 向量检索      │  │  - Elasticsearch│
│  - 实体关系      │  │  - 混合检索      │  │  - OpenSearch   │
│  - 语义推理      │  │  - 重排序        │  │  - 关键词匹配   │
│  - 知识推理      │  │  - 上下文增强    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                      数据存储层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  文档存储     │  │  向量数据库    │  │  图数据库          │  │
│  │  - S3/OSS    │  │  - Qdrant     │  │  - Neo4j          │  │
│  │  - Git LFS   │  │  - Milvus     │  │                   │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                      数据摄取层                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  - 连接器：Git、SharePoint、Confluence、Notion         │  │
│  │  - 文档解析：Markdown、PDF、Word、HTML                  │  │
│  │  - 信息抽取：实体、关系、元数据                          │  │
│  │  - 向量化：文本、代码、图像                              │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

**核心组件实现**：

**1. 智能检索引擎（混合检索 + 重排序）**

```python
# retrieval_engine.py
from typing import List, Dict, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from elasticsearch import Elasticsearch
import numpy as np

class HybridRetrievalEngine:
    """混合检索引擎：结合向量检索、全文搜索和知识图谱"""

    def __init__(
        self,
        qdrant_client: QdrantClient,
        es_client: Elasticsearch,
        knowledge_graph
    ):
        self.qdrant = qdrant_client
        self.es = es_client
        self.kg = knowledge_graph

    async def retrieve(
        self,
        query: str,
        user: str,
        top_k: int = 10,
        filters: Optional[Dict] = None
    ) -> List[Dict]:
        """
        混合检索：向量 + 全文 + 知识图谱

        Args:
            query: 查询文本
            user: 用户标识（用于权限过滤）
            top_k: 返回结果数量
            filters: 额外的过滤条件

        Returns:
            检索结果列表
        """
        # 并行执行三种检索
        results = await asyncio.gather(
            self._semantic_search(query, user, top_k * 2, filters),
            self._keyword_search(query, user, top_k * 2, filters),
            self._graph_search(query, user, top_k, filters)
        )

        semantic_results, keyword_results, graph_results = results

        # 融合和重排序
        final_results = self._hybrid_rerank(
            semantic_results,
            keyword_results,
            graph_results,
            query
        )

        return final_results[:top_k]

    async def _semantic_search(
        self,
        query: str,
        user: str,
        top_k: int,
        filters: Optional[Dict]
    ) -> List[Dict]:
        """语义检索（向量）"""
        # 获取用户可访问的文档范围
        accessible_scopes = await self._get_accessible_scopes(user)

        # 构建 Qdrant 过滤器
        query_filter = Filter(
            must=[
                FieldCondition(
                    key="access_scope",
                    match=MatchValue(any=accessible_scopes)
                )
            ]
        )

        # 添加额外过滤条件
        if filters:
            # 根据 filters 构建额外的过滤条件
            pass

        # 向量检索
        search_result = self.qdrant.search(
            collection_name="documents",
            query_vector=await self._embed(query),
            limit=top_k,
            query_filter=query_filter
        )

        return [
            {
                "id": r.id,
                "score": r.score,
                "source": r.payload.get("source"),
                "content": r.payload.get("content"),
                "type": "semantic"
            }
            for r in search_result
        ]

    async def _keyword_search(
        self,
        query: str,
        user: str,
        top_k: int,
        filters: Optional[Dict]
    ) -> List[Dict]:
        """关键词检索（全文搜索）"""
        # 构建 Elasticsearch 查询
        es_query = {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": query,
                            "fields": ["title^2", "content", "tags"],
                            "type": "best_fields"
                        }
                    }
                ],
                "filter": [
                    {"terms": {"access_scope": await self._get_accessible_scopes(user)}}
                ]
            }
        }

        response = self.es.search(
            index="documents",
            body=es_query,
            size=top_k
        )

        return [
            {
                "id": hit["_id"],
                "score": hit["_score"],
                "source": hit["_source"].get("source"),
                "content": hit["_source"].get("content"),
                "type": "keyword"
            }
            for hit in response["hits"]["hits"]
        ]

    async def _graph_search(
        self,
        query: str,
        user: str,
        top_k: int,
        filters: Optional[Dict]
    ) -> List[Dict]:
        """知识图谱检索"""
        # 从查询中抽取实体
        entities = await self._extract_entities(query)

        # Cypher 查询
        cypher = """
        MATCH (d:Document)-[:RELATED_TO]->(e:Entity)
        WHERE e.name IN $entities
        AND $user IN d.access_users
        RETURN d, COUNT(e) AS relevance
        ORDER BY relevance DESC
        LIMIT $top_k
        """

        results = self.kg.run(
            cypher,
            parameters={
                "entities": entities,
                "user": user,
                "top_k": top_k
            }
        )

        return [
            {
                "id": r["d"]["id"],
                "score": r["relevance"],
                "source": r["d"]["source"],
                "content": r["d"]["content"],
                "type": "graph"
            }
            for r in results
        ]

    def _hybrid_rerank(
        self,
        semantic_results: List[Dict],
        keyword_results: List[Dict],
        graph_results: List[Dict],
        query: str
    ) -> List[Dict]:
        """混合重排序"""
        # 合并结果
        all_results = {}

        for result in semantic_results + keyword_results + graph_results:
            doc_id = result["id"]
            if doc_id not in all_results:
                all_results[doc_id] = {
                    "id": doc_id,
                    "source": result["source"],
                    "content": result["content"],
                    "scores": {}
                }

            # 记录各类型的分数
            result_type = result["type"]
            all_results[doc_id]["scores"][result_type] = result["score"]

        # 计算综合分数
        for doc in all_results.values():
            scores = doc["scores"]

            # 加权融合（可调整权重）
            semantic_weight = 0.4
            keyword_weight = 0.3
            graph_weight = 0.3

            # 归一化分数
            semantic_score = scores.get("semantic", 0)
            keyword_score = scores.get("keyword", 0) / 10  # 归一化
            graph_score = scores.get("graph", 0) / 5  # 归一化

            # 计算最终分数
            doc["final_score"] = (
                semantic_score * semantic_weight +
                keyword_score * keyword_weight +
                graph_score * graph_weight
            )

            # 奖励出现在多个检索结果中的文档
            diversity_bonus = len(scores) * 0.1
            doc["final_score"] += diversity_bonus

        # 排序
        sorted_results = sorted(
            all_results.values(),
            key=lambda x: x["final_score"],
            reverse=True
        )

        return sorted_results
```

**2. 权限感知检索**

```python
# permission_service.py
from typing import List
from enum import Enum

class PermissionLevel(str, Enum):
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    SECRET = "secret"

class PermissionService:
    """权限服务：RBAC + ABAC"""

    def __init__(self, db_client):
        self.db = db_client

    async def get_user_permissions(self, user_id: str) -> Dict:
        """
        获取用户权限信息

        Returns:
            {
                "roles": ["admin", "developer"],
                "teams": ["frontend", "backend"],
                "clearance": "confidential",
                "accessible_projects": ["project-a", "project-b"]
            }
        """
        # 从数据库查询用户权限
        # 实际实现应使用缓存
        pass

    async def check_document_access(
        self,
        user_id: str,
        document_id: str
    ) -> bool:
        """
        检查用户是否有权限访问文档

        支持多维度权限控制：
        - 基于角色（RBAC）
        - 基于属性（ABAC）
        - 基于项目
        - 基于密级
        """
        user_perms = await self.get_user_permissions(user_id)
        doc_perms = await self.get_document_permissions(document_id)

        # 检查角色权限
        if not set(user_perms["roles"]) & set(doc_perms["allowed_roles"]):
            return False

        # 检查团队权限
        if not set(user_perms["teams"]) & set(doc_perms["allowed_teams"]):
            return False

        # 检查密级
        if self._compare_clearance(
            user_perms["clearance"],
            doc_perms["clearance_level"]
        ) < 0:
            return False

        # 检查项目权限
        if doc_perms["project"] not in user_perms["accessible_projects"]:
            return False

        return True

    async def filter_search_results(
        self,
        user_id: str,
        results: List[Dict]
    ) -> List[Dict]:
        """
        过滤搜索结果，只返回用户有权限的文档

        批量检查优化：
        1. 批量获取用户权限
        2. 批量获取文档权限
        3. 批量检查访问权限
        """
        user_perms = await self.get_user_permissions(user_id)
        doc_ids = [r["id"] for r in results]
        doc_perms = await self.get_documents_permissions(doc_ids)

        # 批量过滤
        filtered = []
        for result in results:
            doc_perm = doc_perms.get(result["id"])
            if self._has_access(user_perms, doc_perm):
                filtered.append(result)

        return filtered

    def _compare_clearance(self, user_clearance: str, doc_clearance: str) -> int:
        """比较密级，返回 >=0 表示有权限"""
        levels = {
            PermissionLevel.PUBLIC: 0,
            PermissionLevel.INTERNAL: 1,
            PermissionLevel.CONFIDENTIAL: 2,
            PermissionLevel.SECRET: 3
        }
        return levels[user_clearance] - levels[doc_clearance]

    def _has_access(self, user_perms: Dict, doc_perms: Dict) -> bool:
        """检查是否有访问权限"""
        # 实现具体的权限检查逻辑
        pass
```

**3. 知识推荐引擎**

```python
# recommendation_engine.py
from typing import List, Dict
from datetime import datetime, timedelta

class KnowledgeRecommendationEngine:
    """知识推荐引擎：基于上下文推荐相关知识"""

    def __init__(self, retrieval_engine, user_activity_db):
        self.retrieval = retrieval_engine
        self.activity_db = user_activity_db

    async def recommend(
        self,
        user_id: str,
        context: Dict,
        limit: int = 10
    ) -> List[Dict]:
        """
        基于上下文推荐相关知识

        Args:
            user_id: 用户ID
            context: 上下文信息
                {
                    "current_task": "实现用户登录",
                    "current_file": "src/auth/login.ts",
                    "recent_queries": ["如何实现 JWT", "token 存储方式"],
                    "stack": ["React", "TypeScript"],
                    "team": "frontend"
                }
            limit: 推荐数量

        Returns:
            推荐文档列表
        """
        # 1. 分析当前任务
        task = await self._analyze_task(context)

        # 2. 多策略检索
        strategies = [
            self._recommend_by_task(task, user_id),
            self._recommend_by_collaborative_filtering(user_id),
            self._recommend_by_trending(context["team"]),
            self._recommend_by_reading_history(user_id)
        ]

        results = await asyncio.gather(*strategies)

        # 3. 合并和去重
        recommendations = self._merge_and_deduplicate(results)

        # 4. 过滤已读和低质量内容
        filtered = await self._filter_content(user_id, recommendations)

        # 5. 排序（多维度打分）
        ranked = self._rank_by_multi_dimension(filtered, context, user_id)

        return ranked[:limit]

    async def _analyze_task(self, context: Dict) -> str:
        """分析当前任务，提取关键词"""
        # 使用 LLM 分析任务
        pass

    async def _recommend_by_task(self, task: str, user_id: str) -> List[Dict]:
        """基于任务推荐"""
        return await self.retrieval.retrieve(
            query=task,
            user=user_id,
            top_k=20
        )

    async def _recommend_by_collaborative_filtering(self, user_id: str) -> List[Dict]:
        """协同过滤：相似用户也看了什么"""
        # 1. 找到相似用户
        similar_users = await self._find_similar_users(user_id)

        # 2. 获取他们最近访问的文档
        docs = await self.activity_db.get_recently_accessed(
            users=similar_users,
            days=7
        )

        return docs

    async def _recommend_by_trending(self, team: str) -> List[Dict]:
        """团队内热门文档"""
        return await self.activity_db.get_trending(
            team=team,
            days=30
        )

    async def _recommend_by_reading_history(self, user_id: str) -> List[Dict]:
        """基于阅读历史推荐"""
        # 获取用户最近阅读的文档
        recent_docs = await self.activity_db.get_reading_history(user_id, days=30)

        # 基于这些文档找相似内容
        similar_docs = []
        for doc in recent_docs:
            results = await self.retrieval.retrieve(
                query=doc["content"],
                user=user_id,
                top_k=3
            )
            similar_docs.extend(results)

        return similar_docs

    def _rank_by_multi_dimension(
        self,
        docs: List[Dict],
        context: Dict,
        user_id: str
    ) -> List[Dict]:
        """多维度排序"""
        for doc in docs:
            scores = {
                # 相关性分数
                "relevance": doc.get("final_score", 0),

                # 时效性分数（最近更新的得分更高）
                "freshness": self._calculate_freshness(doc.get("updated_at")),

                # 权威性分数（官方文档、认证作者的得分更高）
                "authority": self._calculate_authority(doc),

                # 受欢迎程度（访问量、点赞数）
                "popularity": doc.get("view_count", 0) / 1000,

                # 个性化分数（符合用户偏好）
                "personalization": self._calculate_personalization(doc, user_id)
            }

            # 加权求和
            doc["rank_score"] = (
                scores["relevance"] * 0.4 +
                scores["freshness"] * 0.2 +
                scores["authority"] * 0.2 +
                scores["popularity"] * 0.1 +
                scores["personalization"] * 0.1
            )

        return sorted(docs, key=lambda x: x["rank_score"], reverse=True)

    def _calculate_freshness(self, updated_at: str) -> float:
        """计算时效性分数"""
        if not updated_at:
            return 0.5

        days_since_update = (datetime.now() - datetime.fromisoformat(updated_at)).days

        # 指数衰减
        return max(0.1, np.exp(-days_since_update / 90))

    def _calculate_authority(self, doc: Dict) -> float:
        """计算权威性分数"""
        score = 0.5

        # 官方文档
        if doc.get("is_official", False):
            score += 0.3

        # 认证作者
        if doc.get("author_verified", False):
            score += 0.2

        # 经过审核
        if doc.get("reviewed", False):
            score += 0.2

        return min(score, 1.0)

    def _calculate_personalization(self, doc: Dict, user_id: str) -> float:
        """计算个性化分数"""
        # 基于用户历史偏好
        # 实际实现应使用机器学习模型
        return 0.5
```

### 企业级实践

大型企业的知识管理不仅是技术问题，更是组织和管理问题。

#### 1. 文档生命周期管理

建立完整的文档生命周期管理流程：

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│  创建   │  ─→  │  审核   │  ─→  │  发布   │  ─→  │  更新   │  ─→  │  归档   │
└─────────┘      └─────────┘      └─────────┘      └─────────┘      └─────────┘
     │                │                │                │                │
     ▼                ▼                ▼                ▼                ▼
 草稿状态          审核中            已发布            需更新            已归档
                  ↓                ↓                ↓                ↓
              审批人审批        公开可见          版本控制          只读访问
              合规检查          搜索索引          更新通知          定期清理
```

**实施建议**：

**创建阶段**：
- 使用统一的文档模板
- 必填元数据：作者、部门、密级、标签
- 自动保存和版本控制

**审核阶段**：
- 技术文档：技术负责人审核
- 产品文档：产品经理审核
- 对外文档：法务/市场审核
- 重要文档：多级审核

**发布阶段**：
- 自动通知相关团队
- 更新搜索索引
- 记录发布日志

**更新阶段**：
- 定期审查（每季度）
- 用户反馈触发更新
- API 变更自动标记

**归档阶段**：
- 过期内容自动归档
- 保留历史版本
- 按合规要求定期清理

**配置示例（SharePoint 工作流）**：

```json
{
  "workflow": {
    "name": "文档发布审批",
    "stages": [
      {
        "name": "草稿",
        "permissions": ["作者", "编辑者"],
        "transitions": ["提交审核"]
      },
      {
        "name": "审核中",
        "permissions": ["审核者"],
        "approvers": ["技术负责人", "法务"],
        "transitions": ["批准", "拒绝"]
      },
      {
        "name": "已发布",
        "permissions": ["所有人"],
        "actions": ["通知订阅者", "更新索引"]
      }
    ]
  }
}
```

#### 2. 知识治理

建立专门的知识治理体系：

**知识委员会**：

```typescript
// 知识委员会结构
interface KnowledgeGovernance {
  // 委员会组成
  committee: {
    chair: "CTO / 知识管理负责人",
    members: [
      "各业务线代表",
      "技术文档专家",
      "法务/合规代表",
      "IT 管理员"
    ]
  }

  // 职责
  responsibilities: {
    policy: "制定文档标准和规范",
    quality: "审核重要文档质量",
    metrics: "评估知识管理效果",
    improvement: "推动工具和流程改进"
  }

  // 定期会议
  meetings: {
    weekly: "快速同步（30分钟）",
    monthly: "全面审查（2小时）",
    quarterly: "战略规划（半天）"
  }
}
```

**知识度量指标**：

| 维度 | 指标 | 目标 | 测量方式 |
|------|------|------|----------|
| **覆盖率** | 文档覆盖率 | >80% | 已文档化功能 / 总功能数 |
| **质量** | 文档准确率 | >95% | 用户反馈准确数 / 总反馈数 |
| **搜索** | 搜索成功率 | >70% | 找到答案次数 / 总搜索次数 |
| **使用** | 月活用户 | >60% | 每月至少访问一次的用户数 |
| **时效** | 平均更新延迟 | <7天 | 变更发生到文档更新的天数 |
| **满意** | 用户满意度 | >4/5 | 用户评分平均分 |

**数据收集示例**：

```python
# metrics_collector.py
from datetime import datetime, timedelta
from typing import Dict

class KnowledgeMetricsCollector:
    """知识管理指标收集器"""

    def collect_metrics(self, period: str = "monthly") -> Dict:
        """收集知识管理指标"""
        now = datetime.now()

        if period == "monthly":
            start_date = now - timedelta(days=30)
        elif period == "quarterly":
            start_date = now - timedelta(days=90)
        else:
            start_date = now - timedelta(days=7)

        return {
            "period": period,
            "start_date": start_date.isoformat(),
            "end_date": now.isoformat(),
            "metrics": {
                # 覆盖率指标
                "coverage": {
                    "documented_features": self._count_documented_features(),
                    "total_features": self._count_total_features(),
                    "coverage_rate": 0.0  # 计算
                },

                # 搜索指标
                "search": {
                    "total_searches": self._count_searches(start_date),
                    "successful_searches": self._count_successful_searches(start_date),
                    "success_rate": 0.0  # 计算
                },

                # 使用指标
                "usage": {
                    "active_users": self._count_active_users(start_date),
                    "total_users": self._count_total_users(),
                    "activation_rate": 0.0  # 计算
                },

                # 质量指标
                "quality": {
                    "accuracy_rate": self._calculate_accuracy_rate(start_date),
                    "user_satisfaction": self._calculate_satisfaction(start_date)
                }
            }
        }

    def generate_report(self) -> str:
        """生成指标报告"""
        metrics = self.collect_metrics("monthly")

        report = f"""
# 知识管理月报 ({metrics['period']})

## 覆盖率
- 已文档化功能：{metrics['metrics']['coverage']['documented_features']}
- 总功能数：{metrics['metrics']['coverage']['total_features']}
- 覆盖率：{metrics['metrics']['coverage']['coverage_rate']:.1%}%

## 搜索效果
- 总搜索次数：{metrics['metrics']['search']['total_searches']}
- 成功搜索：{metrics['metrics']['search']['successful_searches']}
- 成功率：{metrics['metrics']['search']['success_rate']:.1%}%

## 用户活跃度
- 活跃用户：{metrics['metrics']['usage']['active_users']}
- 总用户数：{metrics['metrics']['usage']['total_users']}
- 活跃率：{metrics['metrics']['usage']['activation_rate']:.1%}%

## 质量评估
- 准确率：{metrics['metrics']['quality']['accuracy_rate']:.1%}%
- 满意度：{metrics['metrics']['quality']['user_satisfaction']:.2}/5

## 改进建议
[基于指标自动生成改进建议]
"""
        return report
```

#### 3. AI 助手集成

将 AI 助手深度集成到企业工作流中：

**企业 AI 助手架构（2025）**：

```typescript
// enterprise-assistant.ts
import { RAGSystem } from './rag-system';
import { PermissionService } from './permission-service';
import { AuditLogger } from './audit-logger';

interface User {
  id: string;
  email: string;
  roles: string[];
  teams: string[];
}

interface Answer {
  content: string;
  sources: Array<{
    id: string;
    title: string;
    url: string;
    confidence: number;
  }>;
  followUpQuestions?: string[];
}

class EnterpriseAssistant {
  constructor(
    private rag: RAGSystem,
    private permission: PermissionService,
    private logger: AuditLogger,
    private recommender: KnowledgeRecommendationEngine
  ) {}

  /**
   * 主问答接口
   */
  async ask(query: string, user: User, context?: any): Promise<Answer> {
    const startTime = Date.now();

    try {
      // 1. 权限检查
      if (!await this.permission.canAsk(user)) {
        throw new PermissionDeniedError("用户无权使用 AI 助手");
      }

      // 2. 查询分析（提取意图、实体）
      const analysis = await this.analyzeQuery(query, context);

      // 3. 检索知识（权限感知）
      const docs = await this.rag.retrieve(
        analysis.query,
        user,
        {
          filters: analysis.filters,
          topK: 10,
          strategy: "hybrid" // 语义 + 关键词 + 图谱
        }
      );

      // 4. 生成答案
      const answer = await this.rag.generate(
        analysis.query,
        docs,
        {
          user: user,
          context: context,
          format: "structured"
        }
      );

      // 5. 后处理
      const processedAnswer = await this.postProcess(answer, user);

      // 6. 生成推荐问题
      const followUpQuestions = await this.generateFollowUpQuestions(
        query,
        processedAnswer,
        user
      );

      // 7. 审计日志
      await this.logger.log({
        timestamp: new Date().toISOString(),
        user: user.id,
        query: query,
        sources: docs.map(d => d.id),
        answer: processedAnswer.content,
        latency: Date.now() - startTime,
        success: true
      });

      return {
        ...processedAnswer,
        followUpQuestions
      };

    } catch (error) {
      // 错误日志
      await this.logger.log({
        timestamp: new Date().toISOString(),
        user: user.id,
        query: query,
        error: error.message,
        latency: Date.now() - startTime,
        success: false
      });

      throw error;
    }
  }

  /**
   * 知识推荐
   */
  async recommend(user: User, context: any): Promise<Answer[]> {
    // 获取推荐内容
    const recommendations = await this.recommender.recommend(
      user.id,
      context,
      10
    );

    // 权限过滤
    const filtered = await this.permission.filterResults(
      user,
      recommendations
    );

    // 格式化返回
    return filtered.map(doc => ({
      content: doc.content,
      sources: [{
        id: doc.id,
        title: doc.title,
        url: doc.url,
        confidence: doc.rank_score
      }]
    }));
  }

  /**
   * 查询分析
   */
  private async analyzeQuery(query: string, context?: any) {
    // 使用 LLM 分析查询
    // - 提取主要意图
    // - 识别实体
    // - 生成过滤条件

    return {
      query: query,
      intent: "search",
      entities: [],
      filters: {}
    };
  }

  /**
   * 后处理
   */
  private async postProcess(answer: any, user: User) {
    // - 添加引用链接
    // - 检查敏感信息
    // - 格式化输出

    return answer;
  }

  /**
   * 生成推荐问题
   */
  private async generateFollowUpQuestions(
    originalQuery: string,
    answer: Answer,
    user: User
  ): Promise<string[]> {
    // 基于答案内容生成相关问题

    return [
      "还有什么相关问题？",
      "如何深入理解这个概念？"
    ];
  }
}

// 使用示例
const assistant = new EnterpriseAssistant(
  ragSystem,
  permissionService,
  auditLogger,
  recommender
);

// 用户提问
const answer = await assistant.ask(
  "如何实现单点登录？",
  {
    id: "user123",
    email: "user@company.com",
    roles: ["developer"],
    teams: ["frontend"]
  },
  {
    currentTask: "实现 SSO",
    currentFile: "src/auth/sso.ts"
  }
);

console.log(answer.content);
console.log("来源：", answer.sources);
console.log("相关问题：", answer.followUpQuestions);
```

**审计日志示例**：

```typescript
// audit-logger.ts
interface AuditLog {
  timestamp: string;
  user: string;
  query: string;
  sources: string[];
  answer: string;
  latency: number;
  success: boolean;
  error?: string;
}

class AuditLogger {
  private logs: AuditLog[] = [];

  async log(entry: AuditLog) {
    // 存储到审计日志
    this.logs.push(entry);

    // 发送到日志系统（Splunk、ELK 等）
    await this.sendToLogSystem(entry);

    // 检查异常行为
    await this.detectAnomalies(entry);
  }

  async detectAnomalies(entry: AuditLog) {
    // - 异常高频查询
    // - 敏感内容访问
    // - 异常时间段访问
    // - 权限违规尝试
  }

  async generateComplianceReport(startDate: Date, endDate: Date) {
    // 生成合规报告
    // - 使用统计
    // - 敏感操作记录
    // - 权限变更记录
  }
}
```

---

## 方案对比

### 详细对比表（2025 年更新）

| 维度 | 个人项目 | 小团队 (2-10人) | 中型团队 (10-50人) | 大型企业 (50+人) |
|------|----------|-----------------|-------------------|-----------------|
| **文档量** | <10 页 | 10-50 页 | 50-500 页 | >500 页 |
| **推荐方案** | README + Claude Projects | VitePress + Projects | VitePress + RAG / GitBook | SharePoint + Copilot / 自建平台 |
| **年度成本** | $0 | $0 - $600 | $2,000 - $15,000 | $20,000 - $200,000+ |
| **初始投入** | <1 小时 | 4-8 小时 | 1-2 周 | 2-6 个月 |
| **维护成本** | 低 | 低 | 中 | 高（需专门团队） |
| **技术门槛** | 无 | 低（基础 Markdown） | 中（需开发能力） | 高（需 IT 团队） |
| **搜索能力** | 无/基础 | 内置搜索 | 强（语义搜索） | 很强（多模态 + 知识图谱） |
| **权限管理** | 无 | 无/简单 | 团队级 | 复杂（RBAC + ABAC） |
| **AI 集成** | Claude Projects | Claude Projects | RAG 系统 | RAG + 知识图谱 + Copilot |
| **协作功能** | 无 | 基础 | 中等 | 强大 |
| **版本管理** | Git | Git | Git + 审批流 | 企业级版本管理 |
| **合规支持** | 无 | 无 | 基础审计 | 完整合规（审计、保留策略） |
| **多语言** | 手动 | 手动 | 插件支持 | 原生支持 |
| **离线访问** | 是 | 是 | 部分 | 否（通常在线） |

### 技术栈对比

#### 文档生成工具

| 工具 | 优势 | 劣势 | 适合场景 |
|------|------|------|----------|
| **VitePress** | 性能优秀、开发体验好、免费 | 定制需开发 | 技术团队 |
| **Docusaurus** | Facebook 维护、插件丰富 | 配置复杂 | React 项目 |
| **GitBook** | 界面美观、易用 | 付费、定制受限 | 有预算团队 |
| **Notion** | 协作友好、上手快 | 搜索弱、API 差 | 非技术团队 |
| **Confluence** | 功能强大、企业级 | 昂贵、复杂 | 大型企业 |

#### 向量数据库（2025 年）

| 数据库 | 优势 | 劣势 | 推荐场景 |
|--------|------|------|----------|
| **Chroma** | 简单易用、与 LangChain 深度集成 | 大规模性能一般 | 原型开发 |
| **Qdrant** | 性能优秀、支持过滤 | 学习曲线 | 生产环境 |
| **Pinecone** | 托管服务、性能好 | 付费、厂商锁定 | 追求简便 |
| **Milvus** | 开源、性能强大 | 部署复杂 | 大规模场景 |
| **Weaviate** | 多模态、GraphQL | 社区较小 | 多媒体内容 |

#### 知识图谱数据库

| 数据库 | 优势 | 劣势 | 推荐场景 |
|--------|------|------|----------|
| **Neo4j** | 成熟、文档丰富、Cypher 语法 | 昂贵（企业版） | 企业级应用 |
| **NebulaGraph** | 开源、分布式、性能好 | 学习曲线 | 大规模图数据 |
| **ArangoDB** | 多模型（图 + 文档） | 图功能较弱 | 多数据模型需求 |

---

## 迁移指南

### 从 README 到 Wiki

**适用场景**：README 超过 300 行，或团队开始协作

**步骤详解**：

```
第 1 步：选择 Wiki 工具（1-2 小时）
├── 评估团队需求
├── 对比工具（VitePress / GitBook / Notion）
└── 做出选择

第 2 步：安装和配置（2-4 小时）
├── 安装 VitePress：pnpm add -D vitepress
├── 初始化项目：npx vitepress init
├── 配置导航和侧边栏
└── 自定义主题（可选）

第 3 步：迁移内容（4-8 小时）
├── 分析 README 结构
├── 创建目录结构
├── 拆分内容到多个文件
├── 添加导航链接
└── 检查内部链接

第 4 步：团队评审（2-4 小时）
├── 分发给团队成员
├── 收集反馈
└── 迭代改进

第 5 步：部署和发布（1-2 小时）
├── 配置 CI/CD
├── 部署到服务器
└── 配置域名
```

**VitePress 迁移示例**：

```bash
# 1. 创建项目目录
mkdir docs && cd docs

# 2. 初始化 VitePress
pnpm init
pnpm add -D vitepress

# 3. 创建目录结构
mkdir -p guide api

# 4. 从 README 拆分内容
# README.md → index.md（保留快速开始）
# 项目结构 → guide/project-structure.md
# 开发规范 → guide/coding-standards.md
# API 文档 → api/overview.md

# 5. 配置 .vitepress/config.mts
```

**配置文件示例**：

```typescript
// .vitepress/config.mts
export default {
  title: '项目文档',
  description: '团队协作文档中心',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '开发指南', link: '/guide/project-structure' },
      { text: 'API 文档', link: '/api/overview' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开发指南',
          items: [
            { text: '项目结构', link: '/guide/project-structure' },
            { text: '开发规范', link: '/guide/coding-standards' },
            { text: '测试指南', link: '/guide/testing' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: '概览', link: '/api/overview' },
            { text: '认证', link: '/api/auth' },
            { text: '用户', link: '/api/users' }
          ]
        }
      ]
    }
  }
}
```

### 从简单 Wiki 到 RAG

**适用场景**：文档超过 50 页，搜索困难

**步骤详解**：

```
第 1 步：需求评估（1-2 天）
├── 明确使用场景
├── 定义搜索需求
├── 确定权限要求
└── 评估团队能力

第 2 步：技术选型（2-3 天）
├── 选择向量数据库（Chroma / Qdrant / Pinecone）
├── 选择嵌入模型（OpenAI / 本地模型）
├── 选择检索框架（LangChain / LlamaIndex）
└── 估算成本

第 3 步：原型开发（1-2 周）
├── 搭建基础架构
├── 实现文档索引
├── 实现基础搜索
└── 内部测试

第 4 步：集成到现有工具（1-2 周）
├── VS Code 插件
├── Web 界面
├── CLI 工具
└── 与 Wiki 集成

第 5 步：灰度测试（2-4 周）
├── 小范围试用
├── 收集反馈
├── 优化性能
└── 修复问题

第 6 步：全面推广（持续）
├── 团队培训
├── 编写文档
├── 监控使用情况
└── 持续优化
```

**快速原型（Python + FastAPI + Chroma）**：

```python
# 1. 安装依赖
# pip install fastapi uvicorn langchain chromadb langchain-openai

# 2. 创建 rag_service.py（见前面完整示例）

# 3. 创建索引脚本
# scripts/index_docs.py

import sys
from pathlib import Path
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from rag_service import vectorstore, Config

def index_documents():
    """索引文档到向量数据库"""

    # 加载文档
    loader = DirectoryLoader(
        Config.DOCS_DIR,
        glob="**/*.md",
        loader_cls=TextLoader
    )
    documents = loader.load()

    print(f"加载了 {len(documents)} 个文档")

    # 分割文档
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    texts = text_splitter.split_documents(documents)

    print(f"分割成 {len(texts)} 个文本块")

    # 添加元数据
    for text in texts:
        source = text.metadata.get("source", "")
        text.metadata["source"] = source.replace(Config.DOCS_DIR, "")

        # 从路径推断团队
        if "/frontend/" in source:
            text.metadata["team"] = "frontend"
        elif "/backend/" in source:
            text.metadata["team"] = "backend"
        else:
            text.metadata["team"] = "all"

    # 向量化
    print("开始向量化...")
    vectorstore.add_documents(texts)

    print(f"索引完成！共索引 {len(texts)} 个文本块")

if __name__ == "__main__":
    index_documents()
```

**部署配置**：

```yaml
# docker-compose.yml
version: '3.8'

services:
  rag-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./docs:/docs
      - chroma_data:/chroma_db
    restart: unless-stopped

volumes:
  chroma_data:
```

### 从 RAG 到 知识平台

**适用场景**：企业级应用，需要知识图谱、高级权限、合规支持

**步骤详解**：

```
第 1 步：需求分析（2-4 周）
├── 业务需求调研
├── 技术架构设计
├── 成本预算
└── 风险评估

第 2 步：选型决策（2-4 周）
├── 自建 vs 采购
├── 供应商评估（SharePoint / Confluence / 自建）
├── POC 测试
└── 最终决策

第 3 步：实施规划（4-8 周）
├── 制定实施计划
├── 资源准备
├── 风险预案
└── 里程碑设定

第 4 步：数据迁移（4-12 周）
├── 数据清洗
├── 格式转换
├── 权限映射
└── 迁移执行

第 5 步：系统配置（4-8 周）
├── 权限体系配置
├── 工作流配置
├── 集成配置
└── 安全配置

第 6 步：用户培训（持续）
├── 管理员培训
├── 最终用户培训
├── 文档编写
└── 支持体系建立

第 7 步：上线和优化（持续）
├── 灰度发布
├── 全面上线
├── 监控和优化
└── 持续改进
```

**采购 vs 自建决策框架**：

```
决策因素分析：

1. 成本因素
   ├── 初期成本：自建高（开发），采购低（订阅）
   ├── 长期成本：自建低（维护），采购高（持续付费）
   └── 50 人 × 3 年：采购 ~$100K+，自建 ~$50K

2. 时间因素
   ├── 上线时间：采购快（1-2 月），自建慢（6-12 月）
   └── 是否紧迫？

3. 能力因素
   ├── 是否有开发团队？
   ├── 是否有运维能力？
   └── 是否需要深度定制？

4. 风险因素
   ├── 采购：厂商锁定、价格变动
   └── 自建：技术债务、人员流失

推荐决策：
├── 采购，如果：预算充足、时间紧迫、无开发团队
└── 自建，如果：有特殊需求、有开发团队、长期成本敏感
```

**迁移检查清单**：

```markdown
# 迁移前检查清单

## 数据准备
- [ ] 所有文档已整理和分类
- [ ] 文档元数据已完善
- [ ] 敏感信息已标识
- [ ] 过期内容已清理

## 权限准备
- [ ] 用户列表已准备
- [ ] 权限模型已设计
- [ ] 权限映射已确认

## 技术准备
- [ ] 环境已搭建
- [ ] 集成已测试
- [ ] 备份已创建

## 用户准备
- [ ] 培训计划已制定
- [ ] 用户手册已编写
- [ ] 支持流程已建立

## 上线准备
- [ ] 灰度计划已确认
- [ ] 回滚方案已准备
- [ ] 监控已配置
```

---

## 总结

### 核心要点

**1. 规模决定方案，渐进式演进**

```
个人（1人）
    └─ README + Claude Projects
        ↓ 文档>300行 或 开始协作
小团队（2-10人）
    └─ VitePress + Projects
        ↓ 文档>50页 或 需要权限
中型团队（10-50人）
    └─ VitePress + RAG / GitBook
        ↓ 文档>500页 或 复杂权限
大型企业（50+人）
    └─ SharePoint + Copilot / 自建知识平台
```

**关键原则**：
- **不要过度设计**：从小规模开始，按需扩展
- **成本效益优先**：投入产出比要合理
- **工具为人服务**：不要为了工具而工具
- **保持简单**：复杂的系统难以维护

**2. 投入产出比分析**

| 方案 | 初始投入 | 年度成本 | 维护成本 | 产出（效率提升） |
|------|----------|----------|----------|------------------|
| README + Projects | <1 小时 | $0 | 低 | 个人效率 +30% |
| VitePress + Projects | 4-8 小时 | $0 | 低 | 团队效率 +40% |
| VitePress + RAG | 1-2 周 | $2K-5K | 中 | 搜索效率 +60% |
| GitBook | 1-2 周 | $10K-15K | 低 | 协作效率 +50% |
| SharePoint + Copilot | 2-3 月 | $30K-50K | 高 | 企业效率 +40% |
| 自建平台 | 6-12 月 | $10K-50K | 很高 | 定制化、完全可控 |

**3. 团队协作是关键**

工具只是手段，文化和流程才是核心：

```
成功的知识管理 = 好工具 × 好流程 × 好文化
                  1/3       1/3       1/3
```

**关键实践**：
- **文档优先**：代码和文档同步更新
- **定期维护**：设立文档维护日
- **激励机制**：奖励高质量文档贡献者
- **持续优化**：根据数据和反馈改进

**4. AI 是加速器**

2025 年，AI 已成为知识管理的核心组件：

| AI 能力 | 个人项目 | 小团队 | 中型团队 | 大型企业 |
|---------|----------|--------|----------|----------|
| **代码理解** | Claude Projects | Projects | RAG | RAG + KG |
| **智能搜索** | 无 | 基础搜索 | 语义搜索 | 多模态搜索 |
| **知识问答** | Claude 对话 | RAG 基础 | RAG 高级 | Copilot 集成 |
| **内容推荐** | 无 | 无 | 协同过滤 | 智能推荐 |
| **自动总结** | Claude | Claude | RAG | Copilot |

### 决策流程图

```
┌─────────────────────┐
│   从项目规模开始      │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ 团队规模？    │
    └──┬───────────┘
       │
       ├─ 1人 → README + Claude Projects
       │   └── 成本：$0
       │
       ├─ 2-10人 → VitePress + Projects
       │   ├── 需要权限？→ 否 → 使用 VitePress
       │   └── 需要权限？→ 是 → 考虑 GitBook
       │   └── 成本：$0 - $600/年
       │
       ├─ 10-50人 → VitePress + RAG
       │   ├── 有开发能力？→ 是 → 自建 RAG
       │   ├── 有预算？→ 是 → GitBook
       │   └── 使用 Atlassian？→ 是 → Confluence
       │   └── 成本：$2K - $15K/年
       │
       └─ 50+人 → 企业级平台
           ├── 使用 Microsoft 365？→ 是 → SharePoint + Copilot
           ├── 有特殊需求？→ 是 → 自建知识平台
           └── 预算充足？→ 是 → Confluence / ServiceNow
           └── 成本：$20K - $200K+/年
```

### 常见错误

| 错误 | 后果 | 规避建议 |
|------|------|----------|
| 过度设计 | 浪费资源、难维护 | 从小规模开始，按需扩展 |
| 忽视维护 | 文档过时、失去信任 | 设立定期维护机制 |
| 工具至上 | 买了不用、浪费 | 先培养文化，再引入工具 |
| 权限过度 | 访问困难、效率低 | 最小权限原则，定期审查 |
| 缺乏培训 | 使用率低、效果差 | 制定培训计划，持续推广 |

### 趋势展望（2025-2026）

**1. AI 原生知识管理**

```
传统：文档 → 搜索 → 阅读
未来：问题 → AI 回答 → 追溯来源
```

特点：
- 对话式交互
- 上下文感知
- 主动推荐
- 多模态理解

**2. 知识图谱普及**

- 从文档网络到知识网络
- 实体关系自动抽取
- 推理和关联发现
- 可视化知识导航

**3. 实时协作**

- 多人同时编辑
- 变更实时同步
- 评论和讨论
- 版本历史对比

**4. 智能内容生成**

- AI 辅助文档编写
- 自动更新过期内容
- 多语言翻译
- 格式自动转换

**5. 多端访问**

- VS Code 插件
- 浏览器扩展
- 移动端应用
- CLI 工具
- AI 助手集成

### 下一步

理解了不同规模的策略后，建议继续学习：

- **[上下文质量评估](./08-context-quality/)** → 如何评估和改进上下文质量
- **[未来趋势与工具](./09-future-trends/)** → 新兴技术和方向
- **[实战案例](../case-studies/)** → 真实项目案例分析

---

## 延伸阅读

**工具文档**：
- [VitePress 官方文档](https://vitepress.dev/)
- [LangChain 文档](https://python.langchain.com/)
- [ChromaDB 文档](https://docs.trychroma.com/)
- [Microsoft Copilot 文档](https://learn.microsoft.com/en-us/microsoft-365-copilot/)

**最佳实践**：
- [Docs as Code 实践指南](https://www.writethedocs.org/guide/docs-as-code/)
- [企业知识管理白皮书](https://www.gartner.com/en/information-technology)

**社区资源**：
- [Write the Docs](https://www.writethedocs.org/) - 技术文档写作社区
- [Knowledge Management Community](https://www.km.org/) - 知识管理社区

---

[← 返回文章目录](../context-management/) | [继续学习：上下文质量评估 →](./08-context-quality/)
