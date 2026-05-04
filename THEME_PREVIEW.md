# 🎨 Awesome Study Agent - 主题预览指南

## ✨ 新主题已成功安装!

开发服务器已启动,请访问: **http://localhost:5174/**

## 🌟 主题特性一览

### 1. 🎨 现代化配色方案
- **主色调**: 蓝色系 (#3B82F6) - 专业、可信
- **强调色**: 橙色 (#F97316) - 醒目、行动导向
- **中性色**: Slate 色系 - 现代感、易读性高

### 2. 🌓 完整暗色模式
- 默认启用暗色模式
- 自动检测系统偏好
- 手动切换按钮在导航栏
- 精心优化的暗色对比度

### 3. 📝 优化的排版系统
- **字体**: Inter + JetBrains Mono
- **行高**: 1.7 (最佳可读性)
- **行长度**: 最大 75ch
- **清晰的标题层次**

### 4. ⚡ 流畅的微交互
- 悬停动画 (200ms 过渡)
- 链接渐变下划线
- 卡片提升效果
- 按钮反馈动画

### 5. 📱 完美响应式
- 手机 (< 768px)
- 平板 (768px - 1024px)
- 桌面 (> 1024px)
- 自适应布局

### 6. ♿ 可访问性
- WCAG 2.1 AA 标准
- 对比度 ≥ 4.5:1
- 键盘导航支持
- 屏幕阅读器友好

## 🔍 预览要点

### 首页 (http://localhost:5174/)
- ✅ 渐变色标题
- ✅ 优化的 Hero 区域
- ✅ 特性卡片悬停效果
- ✅ CTA 按钮样式

### 导航栏
- ✅ 毛玻璃效果
- ✅ 响应式菜单
- ✅ 暗色模式切换
- ✅ 搜索框样式

### 侧边栏
- ✅ 当前页面高亮
- ✅ 悬停背景效果
- ✅ 清晰的层次结构
- ✅ 折叠/展开动画

### 内容区域
- ✅ 标题层次
- ✅ 链接样式
- ✅ 代码块优化
- ✅ 自定义容器

## 🎯 测试暗色模式

1. 访问 http://localhost:5174/
2. 点击导航栏右上角的切换按钮
3. 观察暗色模式效果:
   - 深色背景 (#0F172A)
   - 浅色文本 (#F1F5F9)
   - 优化的对比度
   - 柔和的阴影

## 📝 测试自定义容器

在任何 Markdown 文件中使用:

```markdown
::: info
这是一个信息提示框
:::

::: tip
这是一个技巧提示框
:::

::: warning
这是一个警告提示框
:::

::: danger
这是一个危险提示框
:::

::: details
这是一个可折叠的详情框
:::
```

## 🎨 自定义主题

### 修改主色调
编辑 `config/.vitepress/theme/styles/vars.css`:
```css
:root {
  --vp-c-primary: #你的颜色;
  /* 例如: 紫色主题 */
  --vp-c-primary: #8B5CF6;
}
```

### 修改字体
编辑 `config/.vitepress/theme/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

:root {
  --vp-font-family-base: 'Noto Sans SC', sans-serif;
}
```

### 调整暗色模式
编辑 `config/.vitepress/config.mts`:
```typescript
export default defineConfig({
  appearance: 'light', // 默认亮色
  // 或 false 强制亮色
})
```

## 🔗 快速链接

- 首页: http://localhost:5174/
- 序言: http://localhost:5174/preface
- 课程目录: http://localhost:5174/curriculum
- 基础路径: http://localhost:5174/basics/01-ai-overview/
- 实战项目: http://localhost:5174/projects/

## 📊 性能检查

### Lighthouse 评分 (预期)
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### 优化措施
- ✅ 字体预加载
- ✅ CSS 变量减少重复
- ✅ 最小化重绘
- ✅ 代码分割

## 🐛 问题排查

### 样式未生效
```bash
# 清除缓存并重启
pnpm run docs:dev -- --force
```

### 字体未加载
检查网络连接,确保可以访问 Google Fonts

### 暗色模式不切换
检查浏览器是否禁用了 JavaScript

## 📚 相关文档

- [主题设计文档](./config/.vitepress/theme/README.md)
- [VitePress 官方文档](https://vitepress.dev/)
- [UI/UX 设计系统](https://github.com/your-repo/ui-ux-pro-max)

## 🎉 下一步

1. ✅ 浏览首页,查看整体效果
2. ✅ 切换暗色模式,测试配色
3. ✅ 访问不同页面,测试一致性
4. ✅ 在移动设备上测试响应式
5. ✅ 根据需要自定义颜色和字体

---

**享受你的新主题!** 🚀

如有问题,请查看 [主题设计文档](./config/.vitepress/theme/README.md) 或提交 Issue。
