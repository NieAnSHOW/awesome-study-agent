# 代码即文档

> 从代码自动提取上下文，减少手动维护文档的负担

在 AI Agent 开发中，"上下文"决定了 AI 能否准确理解你的项目。手动写文档来喂给 AI？太慢了，而且永远跟不上代码变化的速度。更聪明的做法是——让代码自己说话。

通过 AST 解析、类型提取、装饰器分析等手段，直接从源码中提取结构化信息，自动生成 AI 可消费的上下文——这就是"代码即文档"。

---

## 为什么需要代码即文档？

### 传统文档的困境

每个开发团队都经历过这样的循环：

```
开发流程：
写代码 → 更新文档 → 代码变更 → 文档过时 → 继续写代码
                                      ↓
                              文档与代码脱节
```

Stack Overflow 的开发者调查显示，超过 60% 的开发者认为"缺乏良好文档"是影响开发效率的主要障碍。这个数字背后是一个结构性问题——文档和代码是两个独立的产物，它们之间没有强制的同步机制。

**问题出在哪**：

- **文档更新不及时**：开发者更倾向于写代码而非写文档，代码提交后文档更新往往被推迟甚至遗忘
- **维护文档需要额外时间**：编写一份完整的 API 文档可能需要数小时，而且每次接口变更都要手动同步
- **容易遗漏细节**：复制粘贴错误、参数名写错、示例代码跑不通，这些问题在手写文档中频繁出现
- **代码改了文档没改**：这是最致命的——过时的文档比没有文档更危险，它会误导使用者

这种"文档债务"会随着项目规模增长而加速累积。一个拥有上百个 API 端点的后端项目，光靠人力维护文档就是一场持久战。

### 代码即文档的理念

换一种思路：如果代码本身就包含了足够的信息，为什么还要另外写一份文档？

```
开发流程：
写代码 → 代码本身就是文档 → 自动提取上下文
   ↑                              ↓
   └──── 代码变更自动反映 ←────────┘
```

TypeScript 的类型系统、NestJS 的装饰器、Prisma 的 Schema 定义——这些现代开发工具已经在代码中嵌入了大量的结构化元数据。我们需要做的，只是把这些信息提取出来。

**优势**：

- **代码和文档天然同步**：信息直接来源于代码，不存在"脱节"的可能
- **无额外维护成本**：写好代码就等于写好了文档，不需要额外的文档编写工作
- **细节完整准确**：AST 解析能捕获每一个参数、每一个类型、每一个装饰器，不会遗漏
- **实时反映最新状态**：代码一改，提取的信息立刻更新
- **AI 友好**：提取出的结构化数据天然适合作为 LLM 的上下文输入

在 AI 编程工具（Cursor、Claude Code、GitHub Copilot）越来越普及的当下，代码即文档已经不只是理念层面的东西，它是 AI 理解代码库的基础设施。Cursor 打开项目时会自动对代码库做 AST 解析和向量化索引，干的就是"代码即文档"这件事。

---

## 基本原理

### AST：代码即文档的底层支撑

要从代码中提取信息，绑定的技术是 AST（Abstract Syntax Tree，抽象语法树）。

你写的每一行代码，对计算机来说只是一串字符。解析器的工作就是把这串字符变成一棵结构化的树——AST。有了这棵树，程序就能"看懂"代码的骨架：哪里是函数定义、哪里是变量声明、哪里是类型注解。

拿一段简单的 Python 代码举例：

```python
if x > 5:
    print("Hello")
```

解析后的 AST 长这样：

```
if_statement
├── condition: comparison_expression
│   ├── left: variable_name (x)
│   ├── operator: >
│   └── right: number (5)
└── body: block
    └── statement: call_expression
        ├── function: name (print)
        └── arguments: string_literal ("Hello")
```

没有 AST，所谓的"代码即文档"就是空中楼阁。正则表达式能匹配字符串模式，但它不知道代码的结构——`for` 里套 `if` 再套 `for`，正则就懵了。AST 才是让机器真正"理解"代码结构的方式。

### 从代码中提取什么？

明确了 AST 是基础之后，来看看我们具体能从代码中提取哪些有价值的信息。

**1. 结构信息**

项目的目录结构本身就是一份架构文档。通过扫描文件树和解析模块关系，可以自动推断出项目的组织方式：

```typescript
// 源码目录
src/
├── modules/
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.entity.ts
│   └── order/
│       ├── order.controller.ts
│       └── order.service.ts

// 自动提取的信息
- 项目采用模块化结构（NestJS 风格）
- 每个模块包含 controller / service / entity 三层
- 已有模块：user（用户）、order（订单）
- 遵循单一职责原则，每个文件只处理一个关注点
```

这类信息对 AI 来说价值很大——当你让 AI "新增一个商品模块"时，它能参考已有模块的结构来生成代码，而不是凭空猜测。

**2. 类型定义**

TypeScript 的类型系统是"代码即文档"最好的载体。一个 `interface` 定义包含的信息量，远超一段自然语言描述：

```typescript
// 源码
interface User {
  id: string;          // UUID 格式的主键
  phone: string;       // 手机号，用于登录
  password: string;    // 加密后的密码
  createdAt: Date;     // 创建时间
  role: 'admin' | 'user';  // 用户角色
}

// 提取的信息
- User 实体包含 5 个字段
- 主键：id (string)，推测为 UUID
- 业务字段：phone, password
- 时间戳：createdAt (Date)
- 枚举字段：role，可选值为 'admin' 或 'user'
- 所有字段均为必填（没有 ? 标记）
```

类型定义描述了数据的形状，同时也隐含了业务规则。`role: 'admin' | 'user'` 这个联合类型，比任何文档都更精确地说明了系统支持哪些角色。

**3. 函数签名**

函数签名是 API 的契约。从签名中可以提取出函数的输入、输出、是否异步、泛型约束等关键信息：

```typescript
// 源码
async registerUser(dto: RegisterDto): Promise<User> {
  // 实现细节...
}

// 提取的信息
- 函数名：registerUser（用户注册）
- 输入参数：dto，类型为 RegisterDto
- 返回值：Promise<User>（异步返回 User 对象）
- 关键特征：async 函数，涉及异步操作（可能是数据库写入）
```

更进一步，如果我们追踪 `RegisterDto` 的定义，还能获取到完整的入参结构。这种"类型穿透"能力是代码即文档最大的优势。

**4. 注释和文档块**

JSDoc / TSDoc 注释是代码中最接近自然语言的部分。好的注释能补充类型系统无法表达的业务语义：

```typescript
/**
 * 用户注册
 *
 * 业务规则：
 * 1. 同一手机号只能注册一次
 * 2. 密码至少 8 位，包含字母和数字
 * 3. 注册成功后自动发送验证短信
 *
 * @param phone - 手机号，必须唯一
 * @param password - 密码，至少 8 位
 * @throws {DuplicatePhoneError} 手机号已存在时抛出
 * @throws {WeakPasswordError} 密码强度不足时抛出
 * @returns 新创建的用户对象
 *
 * @example
 * ```typescript
 * const user = await registerUser('13800138000', 'Pass1234');
 * console.log(user.id); // UUID
 * ```
 */
async registerUser(phone: string, password: string): Promise<User>

// 提取的信息
- 功能：用户注册
- 业务规则：手机号唯一、密码强度要求、自动发短信
- 参数说明和约束条件
- 可能抛出的异常类型
- 返回值描述
- 使用示例
```

注释和类型信息结合起来，就构成了一份完整的 API 文档——而且这份文档永远和代码保持同步。

---

## 实现方法

有了 AST 的概念基础，接下来看看具体怎么从代码中提取信息。根据精度、性能和使用场景的不同，主要有三种方法。

### 方法 1：使用 TypeScript Compiler API

TypeScript 官方提供了一套完整的编译器 API，允许你以编程方式读取、分析甚至修改 TypeScript 代码。这是精度最高的方案——毕竟，谁比编译器自己更懂 TypeScript 呢？

**工作流程**：

```
源码文件 → ts.createProgram() → 获取 SourceFile → 遍历 AST 节点 → 提取信息
                                       ↓
                              ts.getTypeChecker() → 获取精确类型信息
```

**基础示例：提取类的方法和参数**

```typescript
import * as ts from 'typescript';

function extractFromFile(filePath: string) {
  // 创建编译程序，这一步会解析文件并构建完整的类型信息
  const program = ts.createProgram([filePath], {
    strict: true,
    target: ts.ScriptTarget.ES2020
  });

  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return;

  // 类型检查器——获取精确类型信息的关键
  const typeChecker = program.getTypeChecker();

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node)) {
      console.log('类名:', node.name?.text);

      // 提取方法
      node.members.forEach(member => {
        if (ts.isMethodDeclaration(member)) {
          const name = member.name?.getText();
          const params = member.parameters.map(p => {
            const paramType = typeChecker.getTypeAtLocation(p);
            return {
              name: p.name.getText(),
              type: typeChecker.typeToString(paramType)
            };
          });
          console.log('方法:', name, '参数:', params);

          // 提取返回值类型
          if (member.type) {
            const returnType = typeChecker.getTypeAtLocation(member);
            console.log('返回值:', typeChecker.typeToString(
              typeChecker.getSignaturesOfType(returnType,
                ts.SignatureKind.Call)[0]?.getReturnType()
            ));
          }
        }
      });
    }
  });
}
```

**进阶：提取接口的完整类型结构**

TypeScript Compiler API 的真正威力在于 `TypeChecker`。它能穿透类型别名、解析泛型、追踪类型引用，给你最精确的类型信息：

```typescript
import * as ts from 'typescript';

function extractTypeSchema(
  typeChecker: ts.TypeChecker,
  type: ts.Type
): Record<string, string> {
  const result: Record<string, string> = {};

  // 遍历类型的所有属性
  for (const prop of type.getProperties()) {
    const propType = typeChecker.getTypeOfSymbolAtLocation(
      prop, prop.valueDeclaration!
    );

    // 递归处理嵌套对象
    if (propType.getProperties().length > 0 &&
        !(propType.flags & ts.TypeFlags.String)) {
      result[prop.name] = extractTypeSchema(typeChecker, propType);
    } else {
      result[prop.name] = typeChecker.typeToString(propType);
    }
  }

  return result;
}

// 使用示例：提取 User 接口的完整结构
// 输出：{ id: "string", phone: "string", role: "'admin' | 'user'" }
```

**适用场景**：

- 需要 100% 精确的类型信息（包括泛型推断、条件类型等）
- 构建代码生成工具、自定义 Linter
- 生成 API 文档、类型定义文件

**优势**：
- 完全准确的类型信息，包括推断类型和复杂泛型
- 支持所有 TypeScript 特性，包括装饰器、条件类型、映射类型
- 官方维护，与 TypeScript 版本同步更新

**劣势**：
- API 复杂，学习曲线陡峭（AST 节点类型有上百种）
- 性能相对较慢，解析大型项目需要数秒
- 只支持 TypeScript/JavaScript，不适合多语言项目

::: tip 实用建议
如果觉得原生 Compiler API 太底层，可以试试 [ts-morph](https://github.com/dsherret/ts-morph)——它在 Compiler API 之上做了一层封装，API 更友好，同时保留了完整的类型信息访问能力。
:::

---

### 方法 2：使用 AST 解析库

如果你不需要 TypeScript 编译器那种级别的类型精度，或者需要处理多种编程语言，AST 解析库是更轻量的选择。

**推荐库**：

#### 1. @babel/parser（JavaScript/TypeScript）

Babel 是 JavaScript 生态中最成熟的编译工具链。它的解析器速度快、容错性好，而且 API 设计直观——Parse、Transform、Generate 三步走，清晰明了。

```javascript
import parser from '@babel/parser';
import traverse from '@babel/traverse';

const code = `
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

interface Config {
  port: number;
  host: string;
  debug?: boolean;
}
`;

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['typescript']  // 启用 TypeScript 支持
});

// 遍历 AST，提取函数和接口信息
const extracted = { functions: [], interfaces: [] };

traverse(ast, {
  // 捕获函数声明
  FunctionDeclaration(path) {
    extracted.functions.push({
      name: path.node.id.name,
      params: path.node.params.map(p => ({
        name: p.name,
        type: p.typeAnnotation?.typeAnnotation?.typeName?.name || 'unknown'
      })),
      returnType: path.node.returnType?.typeAnnotation?.typeName?.name
    });
  },
  // 捕获接口声明
  TSInterfaceDeclaration(path) {
    extracted.interfaces.push({
      name: path.node.id.name,
      properties: path.node.body.body.map(prop => ({
        name: prop.key.name,
        optional: prop.optional || false,
        type: prop.typeAnnotation?.typeAnnotation?.type
      }))
    });
  }
});

console.log(JSON.stringify(extracted, null, 2));
```

Babel 的优势在于它的插件生态——你可以用 `@babel/types` 手动构建 AST 节点来生成代码，也可以用 `@babel/generator` 把修改后的 AST 还原为代码。ESLint、webpack、Vue 模板编译器的底层都在用 Babel。

#### 2. @typescript-eslint/parser（TypeScript 专用）

如果你的项目已经在用 ESLint，这个解析器是现成的。它生成的 AST 兼容 ESTree 规范，同时保留了 TypeScript 的类型注解信息：

```typescript
import { parse } from '@typescript-eslint/parser';

const code = `
interface User {
  id: string;
  name: string;
  email?: string;
}

type UserCreateInput = Omit<User, 'id'>;
`;

const ast = parse(code, {
  sourceType: 'module',
  ecmaVersion: 2020,
  // 开启类型信息（需要 tsconfig.json）
  project: './tsconfig.json'
});

// AST 包含完整的类型注解节点
// 可以直接用 ESLint 的 visitor 模式遍历
```

#### 3. Tree-sitter（多语言支持）——重点推荐

Tree-sitter 是近几年代码解析领域冒出来的重量级工具。由 GitHub 工程师 Max Brunsfeld 于 2015 年创建，目标很明确：为代码编辑器提供超高速、可增量、准确的语法解析。

它和传统解析器的区别在哪？看这张对比表：

| 特性 | 正则匹配 | 传统 AST 解析器 | Tree-sitter |
|------|---------|---------------|-------------|
| 解析速度 | 快 | 慢（10万行需数秒） | 极快（10万行 < 10ms） |
| 增量解析 | 不支持 | 不支持 | 支持（只重解析修改部分） |
| 语言支持 | 任意 | 单语言 | 20+ 语言 |
| 嵌套处理 | 失败 | 准确 | 准确 |
| 错误恢复 | 无 | 差 | 智能恢复 |

Tree-sitter 的杀手锏是**增量解析**——你改了一行代码，它不需要重新解析整个文件，只更新 AST 中受影响的部分。这让它特别适合编辑器场景和实时代码分析。

```typescript
import Parser from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';

const parser = new Parser();
parser.setLanguage(TypeScript.typescript);

const code = `
export class UserService {
  async findById(id: string): Promise<User> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }
}
`;

const tree = parser.parse(code);

// 使用 S-expression 查询语法精准定位代码元素
const query = new Parser.Query(TypeScript.typescript, `
  (method_definition
    name: (property_identifier) @method.name
    parameters: (formal_parameters) @method.params
    return_type: (type_annotation) @method.return_type
  )
`);

const matches = query.matches(tree.rootNode);
matches.forEach(match => {
  const name = match.captures.find(c => c.name === 'method.name');
  console.log('方法:', name?.node.text);
});
```

**谁在用 Tree-sitter？**

| 工具 | 用途 |
|------|------|
| GitHub Copilot | 代码理解的核心引擎 |
| VS Code | 语法高亮和代码折叠 |
| Neovim | 官方语法解析方案 |
| Cursor | 代码库索引和 AST 分块 |
| Sourcegraph | 代码搜索和导航 |
| Semgrep | 静态代码分析 |
| Continue (AI 助手) | 代码符号提取 |

如果你在做 AI 编程工具，Tree-sitter 几乎是绑不开的选择。Cursor 做代码库索引时的"智能分块"就是靠它——按函数、类等语义边界切分代码，而不是简单地按 token 数量切割。

::: warning 注意
Tree-sitter 生成的是具体语法树（CST），保留了注释、空白符等所有细节，和传统的抽象语法树（AST）略有不同。CST 的好处是信息更完整，但节点数量也更多。
:::

**三种方法的选择建议**：

| 场景 | 推荐方法 |
|------|---------|
| TypeScript 项目，需要精确类型信息 | TypeScript Compiler API |
| JavaScript 项目，需要代码转换 | Babel Parser |
| 多语言项目，需要统一处理 | Tree-sitter |
| 编辑器/IDE 集成，需要实时解析 | Tree-sitter |
| 快速原型，不需要深度类型分析 | Babel Parser |

---

### 方法 3：使用现成工具

不想从零写解析逻辑？直接用成熟的文档生成工具，几行配置就能跑起来。

**1. TypeDoc**

TypeScript 项目的首选文档生成器。它直接调用 TypeScript Compiler API，所以类型信息 100% 准确。

```bash
# 安装
npm install -D typedoc

# 一行命令生成文档
npx typedoc --out docs src
```

**配置文件** `typedoc.json`：

```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "exclude": ["**/*.test.ts", "**/*.spec.ts"],
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "none",
  "kindSortOrder": [
    "Module", "Namespace", "Enum", "EnumMember",
    "Class", "Interface", "TypeAlias",
    "Function", "Variable"
  ],
  "categorizeByGroup": true,
  "excludePrivate": true,
  "excludeInternal": true
}
```

TypeDoc 生成的文档包含完整的类型层级、函数签名、参数说明和交叉引用。配合 `typedoc-plugin-markdown` 插件，还能输出 Markdown 格式，直接喂给 AI 做上下文。

**2. API Extractor**

Microsoft 出品，专为库项目设计。它能生成文档，也能做 API 审查——每次代码变更时自动检测公共 API 是否发生了破坏性变化。

```bash
npm install -D @microsoft/api-extractor @microsoft/api-documenter

# 提取 API 信息
npx api-extractor run --local

# 生成 Markdown 文档
npx api-documenter markdown -i temp -o docs
```

tldraw（开源白板工具）就用 API Extractor 管理它的公共 API。每次 PR 都会自动检查 API 变更，确保不会意外破坏下游用户。

**3. JSDoc + TypeScript**

最轻量的方案——在代码里写好 JSDoc 注释，然后用 TypeDoc 或其他工具自动提取：

```typescript
/**
 * 计算含税价格
 *
 * @example
 * ```ts
 * calculateTaxIncludedPrice(100, 0.1) // returns 110
 * calculateTaxIncludedPrice(200, 0.2) // returns 240
 * ```
 *
 * @param price - 商品原价（单位：元）
 * @param taxRate - 税率（0.1 表示 10%）
 * @returns 含税价格，保留两位小数
 * @throws {RangeError} 当 price 为负数时抛出
 *
 * @since 1.2.0
 * @see {@link calculateDiscount} 折扣计算
 */
function calculateTaxIncludedPrice(
  price: number,
  taxRate: number
): number {
  if (price < 0) throw new RangeError('Price cannot be negative');
  return Math.round(price * (1 + taxRate) * 100) / 100;
}
```

JSDoc 的好处是零配置——注释就在代码旁边，IDE 能直接显示，TypeDoc 能直接提取，AI 也能直接读取。

**4. AST Explorer**

不是生成工具，但在开发阶段非常有用。打开 [astexplorer.net](https://astexplorer.net)，粘贴一段代码，立刻看到它的 AST 结构。支持几十种语言和解析器，是调试 AST 查询的利器。

---

## 提取内容的类型

知道了怎么提取，接下来的问题是：提取什么？不是所有代码信息都值得提取，重点是找到那些对理解项目帮助最大的内容。

### 1. 导入依赖

导入语句看起来不起眼，但它是项目技术栈的"自白书"。

```typescript
// 源码
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { RedisService } from '../shared/redis.service';
```

从这四行 import 中，我们可以提取出大量信息：

```
技术栈推断：
├── ORM 层：TypeORM（关系型数据库）
├── 数据验证：class-validator（装饰器风格验证）
├── API 文档：Swagger/OpenAPI（自动生成接口文档）
└── 缓存层：Redis（自建服务封装）

架构推断：
├── 使用了装饰器驱动的开发模式（NestJS 风格）
├── 有统一的共享服务层（../shared/）
└── 关注 API 文档化（集成了 Swagger）
```

更进一步，通过分析整个项目的 import 关系，可以构建出模块依赖图。工具如 Madge 和 dependency-cruiser 就是干这个的：

```bash
# 使用 Madge 生成依赖关系图
npx madge --image dependency-graph.svg src/

# 使用 dependency-cruiser 检测循环依赖
npx depcruise --output-type dot src/ | dot -T svg > deps.svg
```

依赖图能回答不少架构层面的问题：哪些模块耦合度高？有没有循环依赖？某个模块被多少地方引用？这些对 AI 理解项目架构很有帮助。

::: tip 实用工具
- **Madge**：轻量级，支持 CommonJS/AMD/ES6，可生成 SVG/PNG 依赖图
- **dependency-cruiser**：功能更强，支持自定义规则验证依赖关系是否合规
- **Import Cost**（VS Code 插件）：实时显示每个 import 的包体积
:::

### 2. 装饰器信息

装饰器是元数据的富矿。NestJS、Angular、TypeORM 这些框架里，装饰器塞满了业务语义和配置。

```typescript
// 源码
@Entity('users')
@Index(['email', 'phone'])  // 复合索引
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  @IsString()
  @ApiProperty({ description: '用户手机号', example: '13800138000' })
  phone: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'banned'] })
  @ApiProperty({ enum: ['active', 'inactive', 'banned'] })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Organization, org => org.members)
  @JoinColumn({ name: 'org_id' })
  organization: Organization;
}
```

从这段代码中可以提取出一份完整的数据模型文档：

```
实体：User（表名：users）
索引：复合索引 [email, phone]

字段清单：
┌──────────────┬──────────┬─────────────────────────────┐
│ 字段          │ 类型     │ 约束                         │
├──────────────┼──────────┼─────────────────────────────┤
│ id           │ uuid     │ 主键，自动生成                │
│ phone        │ string   │ 唯一，最大长度 50             │
│ status       │ enum     │ 可选值：active/inactive/banned│
│ createdAt    │ Date     │ 自动填充创建时间              │
│ organization │ 关联实体  │ 多对一关联 Organization       │
└──────────────┴──────────┴─────────────────────────────┘
```

装饰器提取的技术原理是 `Reflect.getMetadata`。NestJS 在运行时通过 `reflect-metadata` 这个 polyfill 来存取元数据，而我们在静态分析阶段可以通过 AST 直接解析装饰器的参数：

```typescript
// 提取装饰器参数的简化示例
function extractDecorators(node: ts.ClassDeclaration) {
  const decorators = ts.getDecorators(node) || [];

  return decorators.map(decorator => {
    const expr = decorator.expression;
    if (ts.isCallExpression(expr)) {
      return {
        name: expr.expression.getText(),
        args: expr.arguments.map(arg => arg.getText())
      };
    }
    return { name: expr.getText(), args: [] };
  });
}

// 输出：[{ name: 'Entity', args: ["'users'"] }, { name: 'Index', args: ["['email', 'phone']"] }]
```

### 3. 路由定义

路由是后端项目的"门面"，提取路由信息等于自动生成了一份 API 清单。

```typescript
// 源码
@ApiTags('用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ): Promise<PaginatedResult<User>> { /* ... */ }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> { /* ... */ }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() dto: CreateUserDto): Promise<User> { /* ... */ }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto
  ): Promise<User> { /* ... */ }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> { /* ... */ }
}
```

提取后可以生成结构化的 API 文档：

```
模块：用户管理
基础路径：/users
全局守卫：JwtAuthGuard（需要 JWT 认证）

┌────────┬──────────┬──────────────┬──────────┬─────────────────┐
│ 方法    │ 路径     │ 说明          │ 权限     │ 参数             │
├────────┼──────────┼──────────────┼──────────┼─────────────────┤
│ GET    │ /        │ 获取用户列表  │ 登录即可  │ page, limit     │
│ GET    │ /:id     │ 获取用户详情  │ 登录即可  │ id (UUID)       │
│ POST   │ /        │ 创建用户      │ admin    │ CreateUserDto   │
│ PUT    │ /:id     │ 更新用户      │ admin    │ id, UpdateUserDto│
│ DELETE │ /:id     │ 删除用户      │ admin    │ id              │
└────────┴──────────┴──────────────┴──────────┴─────────────────┘
```

注意这里不光提取了路由路径和 HTTP 方法，还拿到了权限要求（`@Roles`）、参数验证（`ParseUUIDPipe`）、响应状态码（`@HttpCode(204)`）这些细节。AI 要理解一个 API 的完整行为，这些东西缺一不可。

如果项目集成了 Swagger，NestJS 的 `@nestjs/swagger` 模块会在运行时自动完成类似的提取工作，生成 OpenAPI 规范的 JSON。但静态 AST 分析的优势在于不需要启动应用就能获取这些信息。

### 4. 配置文件

配置文件定义了项目的运行环境和行为约束，是理解项目的重要上下文。

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // 启用所有严格类型检查
    "esModuleInterop": true,           // 支持 ES 模块互操作
    "experimentalDecorators": true,    // 启用装饰器（NestJS 必需）
    "emitDecoratorMetadata": true,     // 生成装饰器元数据（DI 必需）
    "paths": {
      "@modules/*": ["src/modules/*"], // 模块路径别名
      "@shared/*": ["src/shared/*"]    // 共享模块路径别名
    }
  }
}
```

从这份配置中可以提取出：

```
项目特征：
├── 严格模式：开启（代码质量要求高）
├── 装饰器：启用（使用 NestJS/Angular 等框架）
├── 元数据反射：启用（依赖注入需要）
└── 路径别名：@modules/ → src/modules/，@shared/ → src/shared/

对 AI 的意义：
├── 生成代码时必须符合严格类型检查
├── 可以使用装饰器语法
├── import 路径可以使用 @modules/ 和 @shared/ 别名
└── 不需要写 .js 扩展名（moduleResolution 默认配置）
```

配置文件不限于 `tsconfig.json`，还包括：

| 配置文件 | 提取价值 |
|---------|---------|
| `package.json` | 项目依赖、脚本命令、Node 版本要求 |
| `.eslintrc` | 代码规范、禁用规则、自定义规则 |
| `docker-compose.yml` | 服务架构、依赖的中间件（Redis、MySQL 等） |
| `.env.example` | 环境变量清单、配置项说明 |
| `prisma/schema.prisma` | 完整的数据模型定义 |
| `nest-cli.json` | NestJS 项目结构、monorepo 配置 |

::: warning 注意
提取 `.env` 文件时要格外小心，绝对不能把真实的密钥、密码等敏感信息传递给 AI。应该只提取 `.env.example` 中的变量名和说明，而非实际值。
:::

---

## 实战案例

前面讲了原理和方法，现在来看两个完整的实战案例，展示如何把"代码即文档"落地到真实项目中。

### 案例 1：生成 NestJS API 清单

场景：一个中型 NestJS 项目有 30+ 个 Controller，手动维护 API 文档已经跟不上迭代速度。我们要写一个脚本，自动扫描所有 Controller 文件，提取路由信息，生成一份完整的 API 清单。

```typescript
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

// API 端点的类型定义
interface ApiEndpoint {
  controller: string;
  basePath: string;
  method: string;
  path: string;
  fullPath: string;
  handler: string;
  params: Array<{ name: string; source: string; type: string }>;
  guards: string[];
  file: string;
}

// HTTP 方法装饰器映射
const HTTP_METHODS = ['Get', 'Post', 'Put', 'Delete', 'Patch', 'Head', 'Options'];

function extractApiEndpoints(projectPath: string): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];

  function getDecoratorName(decorator: ts.Decorator): string | null {
    const expr = decorator.expression;
    if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
      return expr.expression.text;
    }
    if (ts.isIdentifier(expr)) {
      return expr.text;
    }
    return null;
  }

  function getDecoratorArg(decorator: ts.Decorator, index = 0): string {
    const expr = decorator.expression;
    if (ts.isCallExpression(expr) && expr.arguments[index]) {
      const arg = expr.arguments[index];
      // 去掉引号
      return arg.getText().replace(/['"]/g, '');
    }
    return '';
  }

  function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath, content, ts.ScriptTarget.Latest, true
    );

    function visit(node: ts.Node) {
      if (!ts.isClassDeclaration(node) || !node.name) {
        ts.forEachChild(node, visit);
        return;
      }

      const decorators = ts.getDecorators(node) || [];
      const controllerDec = decorators.find(
        d => getDecoratorName(d) === 'Controller'
      );

      if (!controllerDec) {
        ts.forEachChild(node, visit);
        return;
      }

      const basePath = '/' + getDecoratorArg(controllerDec);
      const controllerName = node.name.text;

      // 提取类级别的守卫
      const classGuards = decorators
        .filter(d => getDecoratorName(d) === 'UseGuards')
        .map(d => getDecoratorArg(d));

      // 遍历类的方法
      node.members.forEach(member => {
        if (!ts.isMethodDeclaration(member) || !member.name) return;

        const methodDecorators = ts.getDecorators(member) || [];
        const httpDec = methodDecorators.find(d => {
          const name = getDecoratorName(d);
          return name !== null && HTTP_METHODS.includes(name);
        });

        if (!httpDec) return;

        const httpMethod = getDecoratorName(httpDec)!.toUpperCase();
        const routePath = getDecoratorArg(httpDec);
        const fullPath = routePath
          ? `${basePath}/${routePath}`.replace(/\/+/g, '/')
          : basePath;

        // 提取方法参数
        const params = member.parameters.map(param => {
          const paramDecs = ts.getDecorators(param) || [];
          const source = paramDecs.length > 0
            ? getDecoratorName(paramDecs[0]) || 'unknown'
            : 'unknown';
          return {
            name: param.name.getText(),
            source,  // Param, Query, Body 等
            type: param.type?.getText() || 'any'
          };
        });

        // 提取方法级别的守卫和角色
        const methodGuards = methodDecorators
          .filter(d => ['UseGuards', 'Roles'].includes(getDecoratorName(d) || ''))
          .map(d => `${getDecoratorName(d)}(${getDecoratorArg(d)})`);

        endpoints.push({
          controller: controllerName,
          basePath,
          method: httpMethod,
          path: routePath || '/',
          fullPath,
          handler: member.name.getText(),
          params,
          guards: [...classGuards, ...methodGuards],
          file: path.relative(projectPath, filePath)
        });
      });

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  // 递归扫描 .controller.ts 文件
  function walkDir(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.controller.ts')) {
        processFile(fullPath);
      }
    }
  }

  walkDir(projectPath);
  return endpoints;
}

// 执行提取并输出 Markdown 格式
const endpoints = extractApiEndpoints('./src');

// 按 Controller 分组输出
const grouped = endpoints.reduce((acc, ep) => {
  (acc[ep.controller] ??= []).push(ep);
  return acc;
}, {} as Record<string, ApiEndpoint[]>);

let markdown = '# API 清单\n\n';
for (const [controller, eps] of Object.entries(grouped)) {
  markdown += `## ${controller}\n\n`;
  markdown += '| 方法 | 路径 | 处理函数 | 参数 |\n';
  markdown += '|------|------|---------|------|\n';
  for (const ep of eps) {
    const params = ep.params
      .map(p => `${p.name}(${p.source})`)
      .join(', ');
    markdown += `| ${ep.method} | ${ep.fullPath} | ${ep.handler} | ${params} |\n`;
  }
  markdown += '\n';
}

fs.writeFileSync('./docs/api-list.md', markdown);
```

**输出示例**（`docs/api-list.md`）：

```markdown
# API 清单

## UserController

| 方法   | 路径         | 处理函数  | 参数                              |
|--------|-------------|----------|-----------------------------------|
| GET    | /users      | findAll  | page(Query), limit(Query)         |
| GET    | /users/:id  | findOne  | id(Param)                         |
| POST   | /users      | create   | dto(Body)                         |
| PUT    | /users/:id  | update   | id(Param), dto(Body)              |
| DELETE | /users/:id  | remove   | id(Param)                         |

## OrderController

| 方法   | 路径              | 处理函数     | 参数                        |
|--------|------------------|-------------|----------------------------|
| GET    | /orders          | findAll     | query(Query)               |
| POST   | /orders          | create      | dto(Body)                  |
| POST   | /orders/:id/pay  | processPayment | id(Param), dto(Body)   |
```

这个脚本的改进点：
- 只扫描 `*.controller.ts` 文件，避免处理无关文件
- 提取了完整的路由路径（基础路径 + 方法路径）
- 捕获了参数来源（Query、Param、Body）
- 记录了守卫和权限信息
- 输出 Markdown 格式，方便直接作为文档使用

---

### 案例 2：提取数据模型与关系图谱

场景：项目中有几十个 Entity 和 Interface 定义，散落在不同模块中。我们要提取所有数据模型，包括字段信息、关联关系和验证规则，生成一份可供 AI 消费的结构化文档。

```typescript
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface FieldInfo {
  name: string;
  type: string;
  optional: boolean;
  decorators: string[];
  description?: string;  // 从 JSDoc 或 @ApiProperty 提取
}

interface RelationInfo {
  type: 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany';
  target: string;
  joinColumn?: string;
}

interface EntityInfo {
  name: string;
  tableName?: string;
  fields: FieldInfo[];
  relations: RelationInfo[];
  source: string;
}

function extractEntities(projectPath: string): EntityInfo[] {
  const entities: EntityInfo[] = [];

  function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath, content, ts.ScriptTarget.Latest, true
    );

    function visit(node: ts.Node) {
      if (!ts.isClassDeclaration(node) || !node.name) {
        ts.forEachChild(node, visit);
        return;
      }

      const decorators = ts.getDecorators(node) || [];
      const entityDec = decorators.find(d => {
        const expr = d.expression;
        if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
          return expr.expression.text === 'Entity';
        }
        return false;
      });

      // 同时处理 @Entity 类和普通 interface
      const isEntity = !!entityDec;
      if (!isEntity && !ts.isInterfaceDeclaration(node as any)) {
        // 检查是否有 export 关键字的类（DTO 等）
        const hasExport = node.modifiers?.some(
          m => m.kind === ts.SyntaxKind.ExportKeyword
        );
        if (!hasExport) {
          ts.forEachChild(node, visit);
          return;
        }
      }

      // 提取表名
      let tableName: string | undefined;
      if (entityDec && ts.isCallExpression(entityDec.expression)) {
        const arg = entityDec.expression.arguments[0];
        if (arg) tableName = arg.getText().replace(/['"]/g, '');
      }

      const fields: FieldInfo[] = [];
      const relations: RelationInfo[] = [];

      // 遍历类成员
      node.members.forEach(member => {
        if (!ts.isPropertyDeclaration(member) && !ts.isPropertySignature(member)) return;
        if (!member.name) return;

        const memberDecs = ts.getDecorators(member) || [];
        const decNames = memberDecs.map(d => {
          const expr = d.expression;
          if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
            return expr.expression.text;
          }
          return ts.isIdentifier(expr) ? expr.text : '';
        });

        // 检测关联关系
        const relationTypes = ['OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany'];
        const relDec = decNames.find(n => relationTypes.includes(n));
        if (relDec) {
          // 从装饰器参数中提取目标实体
          const dec = memberDecs[decNames.indexOf(relDec)];
          let target = member.type?.getText() || 'unknown';
          // 清理泛型包装，如 Promise<User> → User
          target = target.replace(/Promise<(.+)>/, '$1')
                         .replace(/Relation<(.+)>/, '$1');

          relations.push({
            type: relDec as RelationInfo['type'],
            target,
            joinColumn: decNames.includes('JoinColumn')
              ? member.name.getText() : undefined
          });
          return;
        }

        // 提取 JSDoc 注释
        const jsDocComment = ts.getJSDocCommentsAndTags(member);
        const description = jsDocComment.length > 0
          ? jsDocComment[0].getText().replace(/\/\*\*|\*\/|\*/g, '').trim()
          : undefined;

        fields.push({
          name: member.name.getText(),
          type: member.type?.getText() || 'any',
          optional: !!member.questionToken,
          decorators: decNames.filter(Boolean),
          description
        });
      });

      entities.push({
        name: node.name.text,
        tableName,
        fields,
        relations,
        source: path.relative(projectPath, filePath)
      });

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  // 扫描 entity 和 dto 文件
  function walkDir(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (/\.(entity|dto|model)\.ts$/.test(entry.name)) {
        processFile(fullPath);
      }
    }
  }

  walkDir(projectPath);
  return entities;
}
```

**输出示例**：

```json
[
  {
    "name": "User",
    "tableName": "users",
    "fields": [
      { "name": "id", "type": "string", "optional": false, "decorators": ["PrimaryGeneratedColumn"] },
      { "name": "phone", "type": "string", "optional": false, "decorators": ["Column", "IsString"] },
      { "name": "status", "type": "UserStatus", "optional": false, "decorators": ["Column"] }
    ],
    "relations": [
      { "type": "ManyToOne", "target": "Organization", "joinColumn": "organization" },
      { "type": "OneToMany", "target": "Order[]" }
    ],
    "source": "modules/user/user.entity.ts"
  }
]
```

有了这份数据，可以进一步生成实体关系图（ER 图）：

```
User ──ManyToOne──▶ Organization
  │                     │
  │OneToMany            │OneToMany
  ▼                     ▼
Order               Department
  │
  │ManyToMany
  ▼
Product
```

这种结构化的模型信息对 AI 帮助很大——你让 AI "帮我写一个查询用户及其所有订单的接口"，它能从关系图谱里知道 User 和 Order 是一对多关系，直接生成正确的 JOIN 查询或 TypeORM 的 `relations` 配置。

---

## 与 AI 集成

提取出来的代码上下文，最终要喂给 AI 才能派上用场。根据项目规模和使用场景，有三种常见的集成方式。

### 方案 1：直接传递上下文（适合中小项目）

最直接的方式——把提取的信息拼成文本，塞进 prompt 里。简单粗暴，但对中小项目非常有效。

```typescript
import { extractEntities, extractApis } from './extractors';
import Anthropic from '@anthropic-ai/sdk';

// 1. 提取项目信息
const entities = extractEntities('./src');
const apis = extractApis('./src');

// 2. 构建结构化上下文
function buildContext(): string {
  let context = '# 项目代码上下文\n\n';

  // 数据模型部分
  context += '## 数据模型\n\n';
  for (const entity of entities) {
    context += `### ${entity.name}`;
    if (entity.tableName) context += ` (表: ${entity.tableName})`;
    context += '\n\n';

    // 字段列表
    context += '| 字段 | 类型 | 必填 | 说明 |\n';
    context += '|------|------|------|------|\n';
    for (const field of entity.fields) {
      context += `| ${field.name} | ${field.type} | ${field.optional ? '否' : '是'} | ${field.description || '-'} |\n`;
    }
    context += '\n';

    // 关联关系
    if (entity.relations.length > 0) {
      context += '关联关系：\n';
      for (const rel of entity.relations) {
        context += `- ${rel.type} → ${rel.target}\n`;
      }
      context += '\n';
    }
  }

  // API 端点部分
  context += '## API 端点\n\n';
  for (const api of apis) {
    context += `- \`${api.method} ${api.fullPath}\` → ${api.handler}`;
    if (api.guards.length > 0) {
      context += ` [权限: ${api.guards.join(', ')}]`;
    }
    context += '\n';
  }

  return context;
}

// 3. 调用 AI
const client = new Anthropic();
const context = buildContext();

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: `你是一个熟悉本项目的高级开发者。以下是项目的代码上下文：\n\n${context}`,
  messages: [{
    role: 'user',
    content: '帮我写一个用户注册接口，要求：手机号注册，密码加密存储，返回 JWT token'
  }]
});
```

这种方式的关键在于上下文的组织格式。几个经验：

- **Markdown 表格**比 JSON 更省 token，AI 也更容易理解
- **按模块分组**而非按文件分组，让 AI 更容易把握业务逻辑
- **只传相关上下文**，不要把整个项目的信息都塞进去——token 是有成本的

::: tip 上下文预算
Claude 的上下文窗口是 200K token，但并不意味着你应该塞满它。实践中，代码上下文控制在 10K-30K token 之间效果最好。信息太多反而会稀释重点，导致 AI 的回答质量下降。
:::

### 方案 2：构建 RAG 索引（适合大型项目）

当项目规模大到无法把所有上下文塞进一个 prompt 时，就需要 RAG（Retrieval-Augmented Generation）了。思路是：先把代码上下文向量化存入数据库，用户提问时检索最相关的片段，只把这些片段传给 AI。

```
RAG 工作流：

代码库 → AST 提取 → 结构化文档 → 向量化 → 存入向量数据库
                                                    ↓
用户提问 → 向量化查询 → 检索 Top-K 相关片段 → 拼入 prompt → AI 回答
```

```typescript
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import { extractEntities, extractApis, extractModuleInfo } from './extractors';
import * as fs from 'fs';

// 初始化向量数据库和 embedding 函数
const client = new ChromaClient();
const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
  openai_model: 'text-embedding-3-small'
});

async function buildCodeIndex(projectPath: string) {
  const collection = await client.getOrCreateCollection({
    name: 'code-context',
    embeddingFunction: embedder,
    metadata: { 'hnsw:space': 'cosine' }  // 使用余弦相似度
  });

  const allFiles = getAllSourceFiles(projectPath);
  const documents: string[] = [];
  const metadatas: Record<string, string>[] = [];
  const ids: string[] = [];

  for (const file of allFiles) {
    // 提取不同维度的信息
    const entities = extractEntities(file);
    const apis = extractApis(file);
    const moduleInfo = extractModuleInfo(file);

    // 每个实体单独作为一个文档（粒度更细，检索更精准）
    for (const entity of entities) {
      const doc = [
        `## 数据模型: ${entity.name}`,
        entity.tableName ? `表名: ${entity.tableName}` : '',
        '字段:',
        ...entity.fields.map(f =>
          `- ${f.name}: ${f.type}${f.optional ? '?' : ''} ${f.description || ''}`
        ),
        entity.relations.length > 0 ? '关联:' : '',
        ...entity.relations.map(r => `- ${r.type} → ${r.target}`)
      ].filter(Boolean).join('\n');

      documents.push(doc);
      metadatas.push({
        source: file,
        type: 'entity',
        name: entity.name
      });
      ids.push(`entity:${entity.name}`);
    }

    // 每个 API 端点也单独索引
    for (const api of apis) {
      const doc = `API: ${api.method} ${api.fullPath}\n` +
        `处理函数: ${api.controller}.${api.handler}\n` +
        `参数: ${api.params.map(p => `${p.name}(${p.source}): ${p.type}`).join(', ')}\n` +
        `权限: ${api.guards.join(', ') || '无'}`;

      documents.push(doc);
      metadatas.push({ source: file, type: 'api', method: api.method });
      ids.push(`api:${api.method}:${api.fullPath}`);
    }
  }

  // 批量写入（ChromaDB 单次最多 5461 条）
  const batchSize = 5000;
  for (let i = 0; i < documents.length; i += batchSize) {
    await collection.add({
      documents: documents.slice(i, i + batchSize),
      metadatas: metadatas.slice(i, i + batchSize),
      ids: ids.slice(i, i + batchSize)
    });
  }

  console.log(`索引完成: ${documents.length} 个文档片段`);
}

// 检索相关上下文
async function queryContext(question: string, topK = 5) {
  const collection = await client.getCollection({
    name: 'code-context',
    embeddingFunction: embedder
  });

  const results = await collection.query({
    queryTexts: [question],
    nResults: topK,
    // 可以用 metadata 过滤，比如只搜索 entity 类型
    // where: { type: 'entity' }
  });

  return results.documents[0]?.join('\n\n---\n\n') || '';
}

// 使用示例
const context = await queryContext('用户注册需要哪些字段，关联了哪些表？');
// 返回最相关的 5 个文档片段，包含 User entity、CreateUserDto、相关 API 等
```

Cursor 内部的代码索引机制和这个思路类似——它在打开项目时会用 Tree-sitter 解析代码库的 AST，生成向量 embedding 存入本地索引。当你在编辑器中提问时，Cursor 先检索相关代码片段，再把它们作为上下文传给 LLM。Roo Code 在 2025 年也采用了类似方案，用 Tree-sitter 解析 AST 后做向量化，替代了之前纯文本的 embedding 方式。

::: details 向量数据库选型参考

| 数据库 | 特点 | 适用场景 |
|--------|------|---------|
| **ChromaDB** | 轻量、Python/JS SDK、本地运行 | 个人项目、原型验证 |
| **Qdrant** | 高性能、支持过滤、Rust 实现 | 中大型项目、生产环境 |
| **Weaviate** | GraphQL API、混合搜索 | 需要结构化+语义混合查询 |
| **FAISS** | Meta 出品、纯向量检索、极快 | 对延迟要求极高的场景 |
| **Milvus** | 分布式、亿级向量 | 超大规模代码库 |

对于大多数团队项目，ChromaDB 或 Qdrant 就够用了。只有代码库超过百万行时才需要考虑 Milvus 这类分布式方案。
:::

### 方案 3：生成持久化文档（适合团队协作）

第三种方式是把提取的信息生成为 Markdown 文件，提交到代码仓库中。这样团队成员和 AI 工具都能直接读取，不需要额外的基础设施。

```typescript
import { extractEntities, extractApis } from './extractors';
import * as fs from 'fs';

function generateProjectContext(projectPath: string) {
  const entities = extractEntities(projectPath);
  const apis = extractApis(projectPath);

  // 生成 CONTEXT.md
  let content = '# 项目代码上下文\n\n';
  content += '> 此文件由脚本自动生成，请勿手动编辑\n';
  content += `> 最后更新: ${new Date().toISOString()}\n\n`;

  content += '## 数据模型\n\n';
  for (const entity of entities) {
    content += `### ${entity.name}\n\n`;
    content += `| 字段 | 类型 | 说明 |\n|------|------|------|\n`;
    for (const f of entity.fields) {
      content += `| ${f.name} | \`${f.type}\` | ${f.description || '-'} |\n`;
    }
    content += '\n';
  }

  content += '## API 端点\n\n';
  content += '| 方法 | 路径 | 处理函数 | 权限 |\n';
  content += '|------|------|---------|------|\n';
  for (const api of apis) {
    content += `| ${api.method} | ${api.fullPath} | ${api.handler} | ${api.guards.join(', ') || '-'} |\n`;
  }

  fs.writeFileSync('./CONTEXT.md', content);
}
```

然后在 `package.json` 中加一个脚本，配合 Git hooks 实现自动更新：

```json
{
  "scripts": {
    "context:generate": "ts-node scripts/generate-context.ts",
    "precommit": "npm run context:generate && git add CONTEXT.md"
  }
}
```

这种方式的好处是：
- 不依赖任何外部服务（向量数据库等）
- 文件直接提交到仓库，所有人都能看到
- Claude Code、Cursor 等工具可以直接读取 `CONTEXT.md` 作为项目上下文
- 通过 Git 历史可以追踪上下文的变化

Claude Code 的 `CLAUDE.md` 文件就是这个思路的实践——把项目的关键信息写在一个固定位置的文件中，AI 工具启动时自动读取。

---

## 工具推荐

不想从零造轮子？下面这些工具可以帮你快速把"代码即文档"落地。

### TypeScript/JavaScript 生态

| 工具 | 用途 | 特点 | 适用场景 |
|------|------|------|---------|
| **TypeDoc** | API 文档生成 | 支持插件扩展，可输出 HTML/Markdown/JSON | 库和框架项目，需要对外发布 API 文档 |
| **API Extractor** | API 审查与提取 | Microsoft 出品，生成 `.api.md` 报告 | 大型库项目，需要严格的 API 变更审查 |
| **@microsoft/api-documenter** | Markdown 文档 | 与 API Extractor 配合，生成结构化文档 | 已使用 API Extractor 的项目 |
| **Compodoc** | Angular 文档 | 专为 Angular 设计，支持路由/模块/管道分析 | Angular 项目 |
| **Storybook** | 组件文档 | 可视化组件库，支持交互式文档 | React/Vue/Angular 组件库 |
| **ts-morph** | 代码分析/转换 | TypeScript Compiler API 的高级封装 | 自定义提取脚本开发 |

**推荐组合**：

- 库项目：TypeDoc + typedoc-plugin-markdown → 生成 Markdown API 文档
- 应用项目：自定义脚本（ts-morph）→ 生成 CONTEXT.md
- 组件库：Storybook + TypeDoc → 可视化文档 + API 参考

### Python 生态

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **Sphinx** | 功能最全，支持 reStructuredText 和 Markdown，插件丰富 | 大型项目、需要完整文档站点 |
| **pdoc** | 零配置，自动从 docstring 生成文档 | 中小项目、快速生成 API 参考 |
| **mkdocstrings** | MkDocs 插件，从代码自动提取文档 | 已使用 MkDocs 的项目 |
| **pydantic** | 数据模型自带 JSON Schema 导出 | FastAPI 项目、需要模型文档 |

Python 的 type hints + docstring 组合天然适合"代码即文档"。特别是 FastAPI 项目，Pydantic 模型定义本身就能自动生成 OpenAPI 文档，几乎不需要额外工作。

### 其他语言

| 语言 | 工具 | 说明 |
|------|------|------|
| **Go** | `godoc`、`pkgsite` | Go 的文档文化很强，注释即文档是语言级别的约定 |
| **Rust** | `rustdoc` | 内置于 cargo，`cargo doc` 一键生成，支持文档测试 |
| **Java** | Javadoc、Dokka（Kotlin） | 成熟的文档生态，IDE 深度集成 |
| **C#** | DocFX、Sandcastle | DocFX 支持 Markdown + API 参考混合文档 |
| **Swift** | DocC | Apple 官方工具，支持交互式教程 |

### AI 原生工具

这个领域变化很快，下面几个工具专门为"代码 → AI 上下文"设计：

| 工具 | 说明 |
|------|------|
| **Aider** | 开源 AI 编程助手，使用 repo map（基于 Tree-sitter）自动生成代码库摘要 |
| **CocoIndex** | AI 原生的数据管线工具，支持代码库实时索引和增量更新 |
| **mcp-vector-search** | MCP 协议的语义代码搜索工具，自动索引代码库并提供向量检索 |
| **Cursor** | 内置代码库索引，打开项目自动进行 AST 解析和向量化 |

---

## 最佳实践

工具再好，代码写得烂也没用。"代码即文档"能跑起来的前提是——代码本身得有足够的可读性和结构化信息。下面是一些让代码更"好提取"的经验。

### 1. 编写可自解释的代码

好的命名是最廉价也最有效的文档。AST 提取出来的函数名、变量名、类名，直接决定了 AI 能否理解代码的意图。

```typescript
// ❌ 不好的命名——提取出来 AI 也看不懂
function proc(d: Data) {
  return d.v * 1.2;
}

// ✅ 好的命名——函数名本身就是文档
function calculateTaxIncludedPrice(price: Price): Price {
  return price.value * (1 + TAX_RATE);
}
```

```typescript
// ❌ 魔法数字——提取出来毫无意义
if (user.role === 3) { /* ... */ }

// ✅ 枚举/常量——语义清晰
enum UserRole {
  GUEST = 'guest',
  MEMBER = 'member',
  ADMIN = 'admin'
}
if (user.role === UserRole.ADMIN) { /* ... */ }
```

一个简单的判断标准：如果把函数签名单独拿出来，不看实现，能不能猜到它干什么？如果能，说明命名到位了。

### 2. 善用 JSDoc/TSDoc 注释

注释不是越多越好，而是要写在"代码本身说不清楚"的地方。业务规则、异常情况、使用示例——这些是 AST 提取时最有价值的注释内容。

```typescript
/**
 * 用户注册
 *
 * 业务规则：
 * - 同一手机号 24 小时内最多注册 3 次（防刷）
 * - 密码必须包含大小写字母和数字，长度 8-20
 * - 注册成功后自动发送验证短信
 *
 * @param input - 注册信息
 * @returns 新创建的用户（不含密码字段）
 * @throws {DuplicatePhoneError} 当手机号已被注册时
 * @throws {InvalidPasswordError} 当密码不符合规则时
 * @throws {RateLimitError} 当注册频率超限时
 *
 * @example
 * ```typescript
 * const user = await userService.register({
 *   phone: '13800138000',
 *   password: 'MyPass123'
 * });
 * // user.id => 'uuid-xxx'
 * ```
 *
 * @since v1.2.0
 * @see {@link UserService.sendVerificationSms} 注册后的短信发送逻辑
 */
async register(input: RegisterInput): Promise<User>
```

几个写注释的原则：
- **写 Why，不写 What**：代码已经说了"做什么"，注释要说"为什么这么做"
- **标注业务规则**：这些信息在代码中往往不直观，但对 AI 理解业务逻辑很重要
- **列出异常情况**：`@throws` 标签让 AI 知道需要处理哪些错误
- **给出使用示例**：`@example` 是最直观的文档，AI 可以直接参考

### 3. 保持类型定义清晰

类型是"代码即文档"中信息密度最高的部分。一个清晰的类型定义，胜过十行注释。

```typescript
// ❌ 模糊的类型——提取出来等于没提取
function process(data: any): any {
  // ...
}

// ✅ 明确的类型——每个字段都是文档
interface OrderCreateInput {
  /** 商品 ID 列表 */
  productIds: string[];
  /** 收货地址 ID */
  addressId: string;
  /** 优惠券码（可选） */
  couponCode?: string;
  /** 备注信息 */
  remark?: string;
}

interface OrderCreateResult {
  /** 订单 ID */
  orderId: string;
  /** 应付金额（单位：分） */
  totalAmount: number;
  /** 支付截止时间 */
  paymentDeadline: Date;
}

function createOrder(input: OrderCreateInput): Promise<OrderCreateResult> {
  // ...
}
```

几个让类型更"可提取"的技巧：

- **用联合类型代替魔法字符串**：`status: 'pending' | 'paid' | 'shipped'` 比 `status: string` 信息量大得多
- **用 `Omit`/`Pick`/`Partial` 表达类型关系**：`type UpdateInput = Partial<Omit<User, 'id'>>` 让 AI 一眼看出这是 User 的部分更新
- **给字段加行内注释**：TypeDoc 和 AST 工具都能提取 `/** */` 格式的字段注释

### 4. 导出关键类型并建立类型体系

把核心类型集中管理，并通过 TypeScript 的工具类型建立类型之间的派生关系，这样 AST 提取时能一次性获取完整的类型图谱。

```typescript
// src/types/user.ts

/** 用户基础模型 */
export interface User {
  id: string;
  phone: string;
  nickname: string;
  role: 'admin' | 'member' | 'guest';
  status: 'active' | 'inactive' | 'banned';
  createdAt: Date;
  updatedAt: Date;
}

/** 创建用户的输入（去掉系统自动生成的字段） */
export type UserCreateInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

/** 更新用户的输入（所有字段可选） */
export type UserUpdateInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

/** API 返回的用户信息（去掉敏感字段） */
export type UserResponse = Omit<User, 'updatedAt'>;

/** 用户列表查询参数 */
export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: User['role'];
  status?: User['status'];
  keyword?: string;
}
```

这种类型体系的好处是：AI 只需要看到 `User` 的定义，就能推断出 `UserCreateInput`、`UserUpdateInput` 等派生类型的结构。提取工具也能通过分析 `Omit`、`Partial`、`Pick` 等工具类型，自动生成完整的类型关系图。

### 5. 项目结构即文档

目录结构本身就是一份架构文档。遵循约定俗成的命名规范，让 AI 仅通过文件路径就能推断出代码的职责：

```
src/
├── modules/           # 业务模块（按领域划分）
│   ├── user/
│   │   ├── user.controller.ts    # 路由处理
│   │   ├── user.service.ts       # 业务逻辑
│   │   ├── user.entity.ts        # 数据模型
│   │   ├── user.module.ts        # 模块定义
│   │   └── dto/                  # 数据传输对象
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   └── order/
│       └── ...
├── shared/            # 共享模块
│   ├── guards/        # 认证/授权守卫
│   ├── interceptors/  # 拦截器
│   ├── filters/       # 异常过滤器
│   └── pipes/         # 数据转换管道
└── config/            # 配置文件
```

当文件命名遵循 `*.controller.ts`、`*.service.ts`、`*.entity.ts` 这样的模式时，提取脚本可以精准地只扫描需要的文件类型，大幅提升效率。

---

## 局限性

### 代码即文档不能替代一切

"代码即文档"挺强，但它有明确的能力边界。搞清楚能干什么、不能干什么，才能在项目里用对地方。

**擅长提取的内容**（结构化、可机器解析）：

| 类型 | 示例 | 提取难度 |
|------|------|---------|
| API 接口清单 | 路由、HTTP 方法、参数、返回类型 | 低 |
| 数据模型定义 | Entity 字段、类型、约束、关联关系 | 低 |
| 函数签名 | 参数类型、返回类型、泛型约束 | 低 |
| 类型关系 | 继承、实现、泛型派生 | 中 |
| 依赖关系 | import 图谱、模块依赖 | 中 |
| 配置信息 | 编译选项、环境变量、中间件配置 | 低 |

**不擅长提取的内容**（需要人类理解和判断）：

| 类型 | 为什么难 | 替代方案 |
|------|---------|---------|
| 架构设计思想 | "为什么选择微服务而非单体"——这种决策背景不在代码里 | ADR（Architecture Decision Records） |
| 业务规则的完整语境 | 代码能告诉你"满 200 减 30"，但说不清楚这个规则的适用范围和例外情况 | 业务文档、产品需求文档 |
| 历史决策背景 | "为什么这里用了 workaround"——代码注释可能提到，但往往不够完整 | Git commit message、PR description |
| 部署和运维流程 | CI/CD 配置能提取，但"为什么选择蓝绿部署"这类决策不在代码中 | 运维文档、Runbook |
| 用户使用指南 | 代码面向开发者，不面向最终用户 | 用户文档、帮助中心 |

### 技术层面的限制

**1. 动态行为难以静态分析**

AST 分析是静态的，它看不到运行时的行为：

```typescript
// 静态分析能看到这个函数签名
function getHandler(type: string): Handler {
  return handlerMap[type];  // 但 handlerMap 的内容是运行时动态注册的
}

// 动态路由注册——AST 提取不到
app.use(dynamicRoutes.map(r => router[r.method](r.path, r.handler)));
```

**2. 跨文件引用的复杂性**

简单的 import 关系容易追踪，但涉及到依赖注入、动态导入、barrel exports 时，静态分析的准确性会下降：

```typescript
// barrel export——需要递归解析才能知道实际导出了什么
export * from './user';
export * from './order';
export * from './product';

// 动态导入——静态分析时不知道会加载什么
const module = await import(`./modules/${moduleName}`);
```

**3. 提取质量依赖代码质量**

垃圾进，垃圾出。代码本身命名混乱、类型全是 `any`、没有注释，提取出来的东西也没啥用。"代码即文档"不是万能药，它放大的是好代码的优势。

---

## 总结

### 要点回顾

```
代码即文档的技术栈：

                    ┌─────────────────┐
                    │   AI 消费层      │
                    │ (Prompt / RAG)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   输出格式层     │
                    │ (Markdown/JSON)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
     │ TS Compiler   │ │ Babel /  │ │ 现成工具    │
     │ API           │ │ Tree-    │ │ TypeDoc /   │
     │               │ │ sitter   │ │ API Extractor│
     └────────┬──────┘ └────┬─────┘ └─────┬──────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │   AST 解析层     │
                    │ (代码 → 语法树)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   源代码         │
                    │ (TypeScript等)   │
                    └─────────────────┘
```

**1. AST 解析是基础**

所有"代码即文档"的实现都建在 AST 之上。三种方案各有各的场景：
- TypeScript Compiler API：类型信息最准确，适合 TS 项目深度分析
- Tree-sitter：多语言支持、增量解析，适合需要跨语言的工具链
- 现成工具（TypeDoc 等）：开箱即用，适合快速落地

**2. 提取有价值的信息**

不是所有代码信息都值得提取。优先级从高到低：
- 类型定义和数据模型（信息密度最高）
- API 路由和函数签名（直接描述系统能力）
- 装饰器元数据（承载业务配置）
- 依赖关系和项目结构（描述架构）
- 注释和文档字符串（补充业务语境）

**3. 与 AI 集成的三条路径**

| 方案 | 适用规模 | 基础设施要求 | 实时性 |
|------|---------|-------------|--------|
| 直接传递上下文 | 中小项目（<50 文件） | 无 | 实时 |
| RAG 向量索引 | 大型项目（50+ 文件） | 向量数据库 | 近实时 |
| 持久化文档 | 任意规模 | 无（Git 即可） | 构建时更新 |

**4. 代码质量决定提取质量**

好的命名、清晰的类型、恰当的注释——这些编码习惯不光让人更容易读懂代码，也让机器更容易提取有用的信息。"代码即文档"不是什么魔法，它放大的是好代码的优势。

### 下一步

掌握代码即文档后，我们将学习：

- [RAG 系统深度实践](./06-rag-systems/) → 搭建智能检索系统，让 AI 在海量代码中精准找到相关上下文
- [不同规模项目的上下文策略](./07-scaling-strategies/) → 从个人项目到大型团队，如何选择合适的上下文管理方案

---

[← 返回文章目录](../context-management/) | [继续学习：RAG 系统深度实践 →](./06-rag-systems/)
