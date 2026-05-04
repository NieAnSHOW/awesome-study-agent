import { defineConfig } from 'vitepress'
import { defineTeekConfig } from "vitepress-theme-teek/config";
// Teek 主题配置
const teekConfig = defineTeekConfig({
  themeEnhance: {
    themeColor: {
      defaultColorName: "vp-green",
    },
     layoutSwitch: {
      disabled: true,
    },
  },
  teekTheme: true,
  anchorScroll: true,
  vpHome: true,
  teekHome: false,
  toComment: {
    enabled: false, // 关闭评论功能
  },
  viewTransition: {
    enabled: true, // 是否启用深浅色切换动画效果
    mode: "out-in", // 动画模式，out 始终从点击点往全屏扩散，out-in 第一次从点击点往全屏扩散，再次点击从全屏回到点击点
    duration: 300, // 动画持续时间，当 mode 为 out 时，默认为 300ms，mode 为 out-in 时，默认为 600ms
    easing: "ease-in", // 缓动函数
  },
  private: {
    enabled: true,
  },
  footerInfo: {
    // 主题版权配置
    theme: {
      show: false, // 是否显示主题版权，建议显示
    },
  },
  codeBlock: {
    enabled: true, // 是否启用新版代码块
    collapseHeight: 700, // 超出高度后自动折叠，设置 true 则默认折叠，false 则默认不折叠
    overlay: false, // 代码块底部是否显示展开/折叠遮罩层
    overlayHeight: 400, // 当出现遮罩层时，指定代码块显示高度，当 overlay 为 true 时生效
    langTextTransform: "uppercase", // 语言文本显示样式，为 text-transform 的值:none, capitalize, lowercase, uppercase
    copiedDone: TkMessage => TkMessage.success("复制成功！"), // 复制代码完成后的回调
  },
  windowTransition: true,
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  title: "Awesome Study Agent",
  description: "系统性学习 AI Agent，从零基础到实战专家，让你轻松掌握 AI Agent 核心技能",
  lang: 'zh-CN',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3B82F6' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap', rel: 'stylesheet' }],
  ],
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '序言', link: '/preface' },
      {
        text: 'AI 基础知识',
        items: [
          { text: 'AI 概述', link: '/ai-basics/01-ai-overview/' },
          { text: 'LLM 基础', link: '/ai-basics/02-llm-fundamentals/' },
          { text: '提示词工程', link: '/ai-basics/03-prompt-engineering/' },
          { text: 'Agent 基础', link: '/ai-basics/04-agent-fundamentals/' },
          { text: 'RAG 技术', link: '/ai-basics/05-rag-knowledge/' },
          { text: '模型训练', link: '/ai-basics/08-model-training/' },
          { text: '多模态 AI 技术', link: '/ai-basics/13-multimodal-ai/' },
        ]
      },
      {
        text: 'Agent 生态',
        items: [
          { text: 'AI 编程工具', link: '/agent-ecosystem/06-ai-coding-tools/' },
          { text: 'Agent 生态', link: '/agent-ecosystem/07-agent-ecosystem/' },
          { text: 'Agent Skills', link: '/agent-ecosystem/09-agent-skills/' },
          { text: 'OpenClaw', link: '/agent-ecosystem/10-openclaw/' },
          { text: 'WorkBuddy', link: '/agent-ecosystem/11-workbuddy/' },
          { text: 'AI 视频生成', link: '/agent-ecosystem/12-ai-video-generation/' },
          { text: 'AI 图像生成', link: '/agent-ecosystem/14-ai-image-generation/' },
        ]
      },
      {
        text: '工具推荐',
        items: [
          { text: 'Markdown 阅读工具', link: '/tools-recommendation/15-markdown-reading-tools/' },
        ]
      },
      {
        text: '深度指南',
        items: [
          { text: 'Agent Skills 系统', link: '/deep-dive/agent-skills/' },
          { text: '大模型上下文管理', link: '/deep-dive/context-management/' },
          { text: 'OpenClaw 深度指南', link: '/deep-dive/openclaw/' },
        ]
      },
      {
        text: '附录',
        items: [
          { text: '术语表', link: '/appendix/glossary' },
          { text: '工具清单', link: '/appendix/tools-list' },
          { text: '提示词库', link: '/appendix/prompts-library' },
          { text: 'FAQ', link: '/appendix/faq' },
          { text: '资源推荐', link: '/appendix/resources' },
        ]
      },
    ],

    // 侧边栏配置
    sidebar: {
      '/ai-basics/': {
        base: '/ai-basics/',
        items: [
          {
            text: 'AI 基础知识',
            items: [
              {
                text: 'AI 概述与 Agent 概念',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '01-ai-overview/' },
                  { text: '什么是 AI？', link: '01-ai-overview/01-what-is-ai' },
                  { text: 'AI 发展简史', link: '01-ai-overview/02-ai-history' },
                  { text: '什么是 AI Agent？', link: '01-ai-overview/03-ai-agent-concept' },
                  { text: '为什么 Agent 是未来？', link: '01-ai-overview/04-why-agent-matters' },
                ]
              },
              {
                text: '大语言模型基础',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '02-llm-fundamentals/' },
                  { text: '什么是大语言模型？', link: '02-llm-fundamentals/01-what-is-llm' },
                  { text: 'LLM 如何工作？', link: '02-llm-fundamentals/02-how-llm-works' },
                  { text: '主流大模型介绍', link: '02-llm-fundamentals/03-major-models' },
                  { text: 'LLM 的核心能力', link: '02-llm-fundamentals/04-model-capabilities' },
                  { text: 'LLM 的挑战', link: '02-llm-fundamentals/05-limits-and-challenges' },
                ]
              },
              {
                text: '提示词工程',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '03-prompt-engineering/' },
                  { text: '提示词基础', link: '03-prompt-engineering/01-prompt-basics' },
                  { text: '提示词模式', link: '03-prompt-engineering/02-prompt-patterns' },
                  { text: '进阶技巧', link: '03-prompt-engineering/03-advanced-techniques' },
                  { text: '不同任务的提示词设计', link: '03-prompt-engineering/04-prompt-for-different-tasks' },
                  { text: '工具与资源', link: '03-prompt-engineering/05-tools-and-resources' },
                ]
              },
              {
                text: 'Agent 基础与架构',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '04-agent-fundamentals/' },
                  { text: 'Agent 架构', link: '04-agent-fundamentals/01-agent-architecture' },
                  { text: 'Agent 类型', link: '04-agent-fundamentals/02-agent-types' },
                  { text: '记忆系统', link: '04-agent-fundamentals/03-memory-system' },
                  { text: '工具使用', link: '04-agent-fundamentals/04-tool-use' },
                  { text: '规划与推理', link: '04-agent-fundamentals/05-planning-and-reasoning' },
                ]
              },
              {
                text: 'RAG 与知识增强',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '05-rag-knowledge/' },
                  { text: '什么是 RAG？', link: '05-rag-knowledge/01-what-is-rag' },
                  { text: 'RAG 流程', link: '05-rag-knowledge/02-rag-pipeline' },
                  { text: '向量化', link: '05-rag-knowledge/03-embedding' },
                  { text: '向量数据库', link: '05-rag-knowledge/04-vector-database' },
                  { text: '进阶 RAG', link: '05-rag-knowledge/05-advanced-rag' },
                  { text: 'RAG 实践', link: '05-rag-knowledge/06-rag-practice' },
                ]
              },
              {
                text: '模型训练与优化',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '08-model-training/' },
                  { text: '微调基础', link: '08-model-training/01-fine-tuning-basics' },
                  { text: '微调准备', link: '08-model-training/02-preparation' },
                  { text: '微调实践', link: '08-model-training/03-fine-tuning-practice' },
                  { text: '模型优化', link: '08-model-training/04-model-optimization' },
                  { text: '模型部署', link: '08-model-training/05-deployment' },
                  { text: '模型评估', link: '08-model-training/06-evaluation' },
                ]
              },
              {
                text: '多模态 AI 技术',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '13-multimodal-ai/' },
                  { text: '核心概念', link: '13-multimodal-ai/01-concepts' },
                  { text: '模型架构', link: '13-multimodal-ai/02-architectures' },
                  { text: '跨模态对齐', link: '13-multimodal-ai/03-cross-modal-alignment' },
                  { text: '多模态 Transformer', link: '13-multimodal-ai/04-multimodal-transformers' },
                  { text: '应用场景', link: '13-multimodal-ai/05-applications' },
                  { text: 'Agent 集成实践', link: '13-multimodal-ai/06-agent-integration' },
                ]
              },
            ]
          }
        ]
      },
      '/agent-ecosystem/': {
        base: '/agent-ecosystem/',
        items: [
          {
            text: 'Agent 生态',
            items: [
              {
                text: 'AI 编程工具',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '06-ai-coding-tools/' },
                  { text: 'Cursor 编辑器', link: '06-ai-coding-tools/01-cursor' },
                  { text: 'Claude Code', link: '06-ai-coding-tools/02-claude-code' },
                  { text: '其他 AI 编程工具', link: '06-ai-coding-tools/03-other-tools' },
                  { text: '最佳实践', link: '06-ai-coding-tools/04-best-practices' },
                  { text: '开发环境搭建', link: '06-ai-coding-tools/05-environment-setup' },
                  { text: 'CC Switch 配置管理', link: '06-ai-coding-tools/06-cc-switch' },
                ]
              },
              {
                text: 'Agent 生态与协议',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '07-agent-ecosystem/' },
                  { text: 'Agent 框架', link: '07-agent-ecosystem/01-agent-frameworks' },
                  { text: 'Agent 平台', link: '07-agent-ecosystem/02-agent-platforms' },
                  { text: 'MCP 协议', link: '07-agent-ecosystem/03-mcp-protocol' },
                  { text: 'Skills 系统', link: '07-agent-ecosystem/04-skills-system' },
                  { text: 'Function Calling', link: '07-agent-ecosystem/05-function-calling' },
                  { text: 'Agent 编排', link: '07-agent-ecosystem/06-orchestration' },
                  { text: 'Hermes Agent 概述', link: '07-agent-ecosystem/07-hermes-agent-overview' },
                  { text: 'Hermes Agent 实战部署', link: '07-agent-ecosystem/08-hermes-agent-deploy' },
                  { text: 'Claude 设计能力', link: '07-agent-ecosystem/09-claude-design' },
                  { text: 'Pencil 原型设计工具入门', link: '07-agent-ecosystem/10-pencil-intro' },
                  { text: 'Pencil MCP 集成', link: '07-agent-ecosystem/11-pencil-mcp' },
                ]
              },
              {
                text: 'Agent Skills 系统',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '09-agent-skills/' },
                  { text: '什么是 Agent Skills', link: '09-agent-skills/01-what-are-skills' },
                  { text: 'Skills 技术架构', link: '09-agent-skills/02-skill-architecture' },
                  { text: '主流框架的 Skills 实现', link: '09-agent-skills/03-skill-frameworks' },
                  { text: 'Skill 设计与实战', link: '09-agent-skills/04-skill-design' },
                  { text: 'Skills 生态与安全', link: '09-agent-skills/05-skill-ecosystem' },
                ]
              },
              {
                text: 'OpenClaw 开源 AI 助手',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '10-openclaw/' },
                  { text: 'OpenClaw 概览', link: '10-openclaw/01-openclaw-overview' },
                  { text: 'OpenClaw 架构', link: '10-openclaw/02-architecture' },
                  { text: '快速上手', link: '10-openclaw/03-getting-started' },
                  { text: 'Skills 与记忆系统', link: '10-openclaw/04-skills-and-memory' },
                  { text: '社区生态与展望', link: '10-openclaw/05-community-and-future' },
                ]
              },
              {
                text: 'WorkBuddy 数字员工实践',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '11-workbuddy/' },
                  { text: '概览', link: '11-workbuddy/01-overview' },
                  { text: '通用办公案例', link: '11-workbuddy/02-office-cases' },
                  { text: '市场销售案例', link: '11-workbuddy/03-marketing-cases' },
                  { text: '技术研发案例', link: '11-workbuddy/04-tech-cases' },
                  { text: '创意与设计案例', link: '11-workbuddy/05-creative-cases' },
                  { text: '用前必读', link: '11-workbuddy/06-before-use' },
                ]
              },
              {
                text: 'AI 视频生成',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '12-ai-video-generation/' },
                  { text: 'AI 视频生成概述', link: '12-ai-video-generation/01-overview' },
                  { text: '主流平台详解', link: '12-ai-video-generation/02-main-platforms' },
                  { text: '核心技术', link: '12-ai-video-generation/03-core-technologies' },
                  { text: '实战指南', link: '12-ai-video-generation/04-practical-guide' },
                  { text: '创作工作流', link: '12-ai-video-generation/05-creation-workflow' },
                  { text: '商业应用', link: '12-ai-video-generation/06-business-application' },
                ]
              },
              {
                text: 'AI 图像生成',
                collapsed: true,
                items: [
                  { text: '模块介绍', link: '14-ai-image-generation/' },
                  { text: 'AI 绘画概述', link: '14-ai-image-generation/01-overview' },
                  { text: '主流平台详解', link: '14-ai-image-generation/02-main-platforms' },
                  { text: '开源生态与本地部署', link: '14-ai-image-generation/03-open-source' },
                  { text: '中国 AI 绘画平台', link: '14-ai-image-generation/04-china-platforms' },
                  { text: '提示词工程与创作', link: '14-ai-image-generation/05-prompt-and-creation' },
                  { text: '商业应用与案例', link: '14-ai-image-generation/06-business-cases' },
                ]
              },
            ]
          }
        ]
      },
      '/deep-dive/': {
        base: '/deep-dive/',
        items: [
          {
            text: '深度指南',
            items: [
              { text: '深度指南概览', link: '/' },
              {
                text: 'Agent Skills 系统深度指南',
                collapsed: true,
                items: [
                  { text: '本指南主页', link: 'agent-skills/' },
                  { text: '一、Skills 的认知科学基础', link: 'agent-skills/01-cognitive-foundations' },
                  { text: '二、Skills 的四元组形式化分析', link: 'agent-skills/02-formal-analysis' },
                  { text: '三、SKILL.md 完整规范与高级特性', link: 'agent-skills/03-skillmd-advanced' },
                  { text: '四、Skill 依赖管理与版本治理', link: 'agent-skills/04-dependency-management' },
                  { text: '五、四大框架 Skills 实现深度剖析', link: 'agent-skills/05-framework-comparison' },
                  { text: '六、跨框架互操作性与标准融合', link: 'agent-skills/06-interoperability' },
                  { text: '七、Skill 设计模式目录', link: 'agent-skills/07-design-patterns' },
                  { text: '八、复杂 Skill 组合与编排', link: 'agent-skills/08-composition-orchestration' },
                  { text: '九、Skill 测试策略', link: 'agent-skills/09-testing-strategy' },
                  { text: '十、Token 优化与性能调优', link: 'agent-skills/10-token-optimization' },
                  { text: '十一、企业级 Skill 治理体系', link: 'agent-skills/11-enterprise-governance' },
                  { text: '十二、Skill 开发工作流与 CI/CD', link: 'agent-skills/12-devops-workflow' },
                  { text: '十三、Skills 安全威胁深度分析', link: 'agent-skills/13-security-threats' },
                  { text: '十四、生态演进与未来趋势', link: 'agent-skills/14-future-trends' },
                ]
              },
              {
                text: '大模型上下文管理深度指南',
                collapsed: true,
                items: [
                  { text: '文章主页', link: 'context-management/' },
                  { text: '一、大模型上下文原理解析', link: 'context-management/01-context-principles' },
                  { text: '二、上下文的类型与层次', link: 'context-management/02-context-types' },
                  { text: '三、Wiki 系统最佳实践', link: 'context-management/03-wiki-best-practices' },
                  { text: '四、代码即文档', link: 'context-management/04-code-as-docs' },
                  { text: '五、让 AI 使用上下文的技巧', link: 'context-management/05-ai-context-tips' },
                  { text: '六、RAG 系统深度实践', link: 'context-management/06-rag-systems' },
                  { text: '七、不同规模项目的上下文策略', link: 'context-management/07-scaling-strategies' },
                  { text: '八、上下文质量评估', link: 'context-management/08-context-quality' },
                  { text: '九、未来趋势与工具', link: 'context-management/09-future-trends' },
                  { text: '十、AI Agent 记忆系统', link: 'context-management/10-ai-agent-memory' },
                  { text: '十一、上下文安全与隐私', link: 'context-management/11-context-safety' },
                  { text: '十二、多 Agent 系统的上下文管理', link: 'context-management/12-multi-agent-context' },
                  { text: '十三、实战案例：上下文建设演进', link: 'context-management/13-case-study-evolution' },
                  { text: '十四、上下文工程工具链全景', link: 'context-management/14-toolchain-overview' },
                ]
              },
              {
                text: 'OpenClaw 深度指南',
                collapsed: true,
                items: [
                  { text: '本指南主页', link: 'openclaw/' },
                  { text: '一、Gateway 架构深度剖析', link: 'openclaw/01-gateway-architecture' },
                  { text: '二、Brain 组件深度剖析', link: 'openclaw/02-brain-llm-orchestration' },
                  { text: '三、Hands 工具执行引擎', link: 'openclaw/03-hands-tool-engine' },
                  { text: '四、Memory 四层记忆体系', link: 'openclaw/04-memory-system-deep' },
                  { text: '五、Heartbeat 心跳调度引擎', link: 'openclaw/05-heartbeat-scheduler' },
                  { text: '六、Channels 适配器模式与平台接入', link: 'openclaw/06-channels-adapter' },
                  { text: '七、Skill 开发进阶', link: 'openclaw/07-skill-development' },
                  { text: '八、SOUL.md 与 Agent 人设工程', link: 'openclaw/08-soul-engineering' },
                  { text: '九、高级部署与运维', link: 'openclaw/09-deployment-ops' },
                  { text: '十、性能调优与 Token 成本优化', link: 'openclaw/10-performance-cost' },
                  { text: '十一、安全模型：沙箱、权限、审计', link: 'openclaw/11-security-model' },
                  { text: '十二、Live Canvas 与 A2UI 协议', link: 'openclaw/12-live-canvas-a2ui' },
                  { text: '十三、生态对比与混合架构决策', link: 'openclaw/13-ecosystem-comparison' },
                  { text: '十四、实战案例与场景最佳实践', link: 'openclaw/14-scenarios-cases' },
                ]
              },
            ]
          }
        ]
      },
      '/appendix/': {
        base: '/appendix/',
        items: [
          {
            text: '附录',
            items: [
              { text: '附录概览', link: '/' },
              { text: '术语表', link: 'glossary' },
              { text: '工具清单', link: 'tools-list' },
              { text: '提示词模板库', link: 'prompts-library' },
              { text: '常见问题', link: 'faq' },
              { text: '资源推荐', link: 'resources' },
            ]
          }
        ]
      },
      '/tools-recommendation/': {
        base: '/tools-recommendation/',
        items: [
          {
            text: '工具推荐',
            items: [
              { text: '概览', link: '/' },
              {
                text: 'Markdown 阅读工具',
                collapsed: false,
                items: [
                  { text: '模块介绍', link: '15-markdown-reading-tools/' },
                  { text: 'Obsidian', link: '15-markdown-reading-tools/01-obsidian' },
                  { text: 'Logseq', link: '15-markdown-reading-tools/02-logseq' },
                  { text: 'MarkText', link: '15-markdown-reading-tools/03-marktext' },
                  { text: 'Joplin', link: '15-markdown-reading-tools/04-joplin' },
                  { text: 'Zettlr', link: '15-markdown-reading-tools/05-zettlr' },
                  { text: '横向对比与选型', link: '15-markdown-reading-tools/06-comparison' },
                ]
              },
            ]
          }
        ]
      },
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/NieAnSHOW/awesome-study-agent' }
    ],

    // 页脚
    footer: {
      message: '基于 MIT LICENSE 许可发布',
      copyright: 'Copyright © 2026-present Awesome Study Agent'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/NieAnSHOW/awesome-study-agent',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新文本
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    config: (md) => {
      // 可以在这里添加 markdown-it 插件
    }
  }
})
