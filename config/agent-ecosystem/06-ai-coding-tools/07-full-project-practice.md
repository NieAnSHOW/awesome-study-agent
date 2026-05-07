# 从零搭建实战

> **学习目标**：通过一个完整项目，体验 AI 编程工具的全流程应用
> **预计时间**：60 分钟
> **难度**：⭐⭐⭐

---

## 一句话结论

学再多理论，不如亲手做一遍。这节我们用 Cursor + Claude Code 从零搭一个"个人书签管理器"——包含用户认证、书签 CRUD、标签分类、全文搜索、一键部署。不是教你写代码，是教你**用 AI 写代码**。你会看到：90% 的代码是 AI 生成的，你只做两件事——提需求和审代码。

## 项目概览

### 我们要做什么

一个**个人书签管理器**（Markie）：
- 用户注册/登录（JWT 认证）
- 添加/编辑/删除书签
- 标签分类和筛选
- 全文搜索（标题 + 描述 + URL）
- 简洁的 UI

### 技术栈

```
前端：React 18 + TypeScript + Vite + Tailwind CSS
后端：Node.js + Express + TypeScript
数据库：SQLite（本地开发）→ PostgreSQL（部署）
部署：Vercel（前端）+ Railway（后端）
```

### 为什么选这些技术

不是因为这些技术最好，是因为它们对 AI 编程最友好：
- React + TypeScript → Cursor 训练数据最丰富
- Tailwind → AI 生成样式的一致性最高
- Vite → 零配置，AI 出错概率低
- SQLite + Prisma → ORM 模式固定，AI 不容易跑偏

花叔原则：**选 AI 最熟悉的栈，不是选你自己最想学的栈。**

## 第一阶段：项目初始化

### 1.1 用 Cursor 创建项目

打开 Cursor，创建一个新目录并打开：

```bash
mkdir markie
cd markie
cursor .
```

在 Cursor 的 Composer 中输入：

```
用 Vite + React + TypeScript 创建一个前端项目
目录结构：
markie/
├── client/     ← React 前端
├── server/     ← Express 后端
├── package.json  ← workspace 根目录
```

Cursor 会：
1. 在 `client/` 初始化 React + Vite + TypeScript
2. 在 `server/` 初始化 Express + TypeScript
3. 配置根目录的 npm workspaces
4. 安装所有依赖

**花叔提示：** 第一次用 Composer 创建项目时，可能不会一次完美。如果报错了，把错误信息复制给 Cursor，它会自己修。

### 1.2 配置项目规则

创建 `.cursorrules` 文件，告诉 AI 我们项目的规则：

```
# Markie 书签管理器

## 技术栈
- 前端: React 18 + TypeScript + Vite + Tailwind CSS
- 后端: Node.js + Express + TypeScript
- 数据库: SQLite + Prisma ORM
- 认证: JWT

## 编码规范
- TypeScript 严格模式，禁止 any
- 函数式组件 + React Hooks
- API 路径统一用 /api/v1/
- 所有 API 必须鉴权（除了注册和登录）
- 错误返回格式: { error: string, code: number }

## 前端风格
- Tailwind CSS
- 无 UI 框架，纯手写组件
- 响应式设计
- 深色/浅色主题
```

## 第二阶段：后端搭建

### 2.1 数据库设计

在 Cursor Chat 中输入：

```
在 server/ 中设置 Prisma + SQLite
创建书签数据模型：
- User: id, email, password(hashed), name, createdAt
- Bookmark: id, userId, title, url, description, tags, createdAt, updatedAt

生成 Prisma Client
创建初始 migration
```

Cursor 会：
1. 安装 Prisma 和相关依赖
2. 创建 `schema.prisma`
3. 生成 migration
4. 创建数据库文件

### 2.2 认证系统

```
创建用户认证模块：
- POST /api/v1/auth/register — 注册（加密密码）
- POST /api/v1/auth/login — 登录（返回 JWT）
- POST /api/v1/auth/me — 获取当前用户

用 bcrypt 加密密码
用 jsonwebtoken 做认证
```

### 2.3 书签 CRUD

```
创建书签 API：
- GET    /api/v1/bookmarks — 获取用户的所有书签（含搜索和标签筛选）
- POST   /api/v1/bookmarks — 创建书签
- PUT    /api/v1/bookmarks/:id — 更新书签
- DELETE /api/v1/bookmarks/:id — 删除书签

支持分页（page/limit）
支持搜索（query 参数搜索标题和描述）
支持标签筛选（tag 参数）
```

## 第三阶段：前端搭建

### 3.1 项目配置

```
在 client/ 中配置 Tailwind CSS
创建目录结构：
├── src/
│   ├── components/     ← 通用组件
│   ├── pages/          ← 页面组件
│   ├── hooks/          ← 自定义 Hooks
│   ├── api/            ← API 调用
│   ├── types/          ← TypeScript 类型
│   └── contexts/       ← React Context（认证状态）
```

### 3.2 认证页面

```
创建登录和注册页面：
- 登录页：邮箱 + 密码表单
- 注册页：名 + 邮箱 + 密码 + 确认密码
- 表单验证：邮箱格式、密码长度
- 错误提示：登录失败显示错误信息
- 登录成功后跳转到主页

用 React Context 管理认证状态
用 localStorage 存储 token
```

### 3.3 主页面

```
创建书签管理主页面：
- 顶部导航栏（搜索框 + 用户信息 + 退出登录）
- 左侧标签列表（点击筛选对应标签）
- 右侧书签列表
- 右上角"添加书签"按钮

每个书签卡片显示：标题、URL、描述（截断）、标签、操作按钮
URL 自动提取域名作为 favicon（https://www.google.com/s2/favicons?domain=xxx）
```

### 3.4 书签操作

```
创建书签编辑对话框：
- 添加/编辑书签的弹窗表单
- 标题、URL、描述输入框
- 标签输入（输入后 Enter 添加标签 tag）
- 表单验证
- 创建成功关闭弹窗并刷新列表
- 删除书签需要确认弹窗
```

## 第四阶段：用 Claude Code 优化

项目基本功能完成后，切换到 Claude Code 进行优化。

```bash
# 在项目根目录启动 Claude Code
claude
```

### 4.1 代码审查

```
审查 server/src/ 目录的所有代码：
1. 安全性问题（SQL 注入、XSS、CSRF）
2. 错误处理是否完整
3. 代码结构是否合理
4. 性能瓶颈

给出改进方案。先列问题，再逐个修复。
```

### 4.2 批量修复

```
/loop "修复所有 TypeScript 类型错误"

# 如果类型错误很多，这个命令会自动
# 检查 → 修复 → 重新检查 → 再修复
# 直到所有类型错误消失
```

### 4.3 添加测试

```
用 Vitest 给 API 端点写测试：
1. 测试注册逻辑
2. 测试登录逻辑（正常 + 错误密码）
3. 测试书签 CRUD

测试覆盖主要场景即可，不需要 100%
```

## 第五阶段：用 Codex CLI 安全审查

如果有安全敏感的模块（如密码重置、API Key 管理），用 Codex CLI 做安全审查：

```bash
# 审查认证模块
codex "审查 server/src/auth/ 目录的代码安全性"

# Codex 会在沙箱中分析代码
# 给出安全建议
```

## 第六阶段：部署

### 6.1 前端部署到 Vercel

```
在 Cursor 终端执行：
1. npm install -g vercel
2. cd client && vercel
3. 按提示登录和配置
```

### 6.2 后端部署到 Railway

```
在 Cursor 终端执行：
1. 在 Railway 创建新项目
2. 连接 GitHub 仓库
3. 配置环境变量（DATABASE_URL、JWT_SECRET）
4. 自动部署
```

### 6.3 配置自定义域名（可选）

```
用 Cloudflare 管理 DNS：
markie.yourdomain.com → Vercel 分配的 URL
api.markie.yourdomain.com → Railway 分配的 URL
```

## 实战总结

### 时间统计

| 阶段 | 时间 | 工具 | 代码来源 |
|------|------|------|---------|
| 项目初始化 | 5 分钟 | Cursor Composer | AI 100% |
| 后端 API | 15 分钟 | Cursor Chat + Composer | AI 90% + 手动调整 10% |
| 前端页面 | 20 分钟 | Cursor Chat + Composer | AI 85% + 手动调整 15% |
| 代码审查 + 优化 | 10 分钟 | Claude Code | 审查 + 修复 |
| 部署 | 10 分钟 | 终端 + Vercel/Railway | 手动 |
| **总计** | **60 分钟** | | **AI 生成 ~88%** |

### 关键数据

- **AI 生成比例**：约 88% 的代码由 AI 生成
- **手动代码**：主要是配置文件和少数逻辑调整
- **调试次数**：约 5-8 次报错，全部由 AI 修复
- **最终结果**：一个可运行的完整 Web 应用

### 花叔的实操心得

**1. 第一次成功率约 60%**

不要指望一条 Prompt AI 就把所有代码写对。你会遇到：
- 类型错误 → 把报错复制给 AI
- 路由配置错误 → 把错误信息给 AI
- 样式不对 → 截图给 AI

**2. 最重要的技能不是写 Prompt，是审查代码**

AI 写的代码不一定对。花叔建议的审查重点：
- 安全检查：用户输入是否验证？
- 错误处理：出错会不会崩？
- 代码规范：风格是否一致？

**3. 遇到复杂 bug，关闭 Composer 开 Chat**

Composer 适合大块工作，Chat 适合排查问题。遇到复杂 bug 时，在 Chat 里逐步分析比在 Composer 里重新生成更高效。

**4. 先出功能，再优化代码**

花叔原则：**先做 20 个垃圾出来。** 功能跑通了再回头优化。不要在第一版追求完美代码——那是优化阶段的事情。

## 扩展挑战

如果你完成了基础版，可以尝试以下扩展：

1. **添加浏览器扩展**：用 Claude Code 生成 Chrome 扩展，一键保存当前页面
2. **导入/导出**：支持从浏览器书签 HTML 导入，支持 JSON 导出
3. **AI 自动标签**：集成 AI 接口，根据 URL 内容自动生成标签
4. **分享功能**：生成公开分享链接

---

## 检验标准

完成本节学习后，你应该能够：

- [ ] 用 Cursor Composer 从零初始化一个全栈项目
- [ ] 用 Cursor 的 Chat 和 Composer 完成后端 CRUD API
- [ ] 用 Cursor 的 Chat 和 Composer 完成前端页面
- [ ] 用 Claude Code 做代码审查和批量修复
- [ ] 用 /loop 命令自动修复类型错误
- [ ] 部署前端到 Vercel，后端到 Railway
- [ ] 评估 AI 生成代码的质量：哪些可以信任，哪些需要人工审查
- [ ] 理解"先出功能，再优化"的花叔原则

---

[← 返回章节目录](/agent-ecosystem/06-ai-coding-tools) | [继续学习：返回模块首页 →](/agent-ecosystem/06-ai-coding-tools)
