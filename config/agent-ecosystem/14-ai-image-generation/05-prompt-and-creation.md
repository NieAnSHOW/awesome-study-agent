# 提示词工程与创作实战

> **学习目标**：掌握 AI 绘画提示词设计方法、参数调控技巧和完整创作工作流
>
> **预计时间**：90 分钟
>
> **难度**：⭐⭐⭐

---

如果说前几章是让你"会用" AI 绘画工具，那么这一章就是教你"用好"。提示词（Prompt）是 AI 绘画的"咒语"，同一句话在不同人手中能产生天差地别的效果。本章将从基础结构到高级技巧，再到完整工作流，带你系统掌握 AI 绘画的创作方法论。

---

## 1. 提示词基础结构

### 四要素框架

一个高质量的 AI 绘画提示词，通常由四个核心要素构成：

| 要素 | 含义 | 示例 |
|------|------|------|
| **主体（Subject）** | 画面中主要表现的对象 | "a warrior with silver armor" |
| **环境（Environment）** | 背景、场景、氛围 | "in a misty forest at dawn" |
| **风格（Style）** | 艺术风格、媒介、流派 | "digital painting, fantasy art" |
| **参数（Parameters）** | 画幅、质量、参考等 | "--ar 16:9 --s 250" |

### 提示词公式

将四要素展开，一个更完整的提示词公式可以表达为：

```
[主体描述] + [动作/状态] + [环境背景] + [光照氛围] + [风格媒介] + [质量修饰词]
```

**公式解析：**

```
精致的银甲战士    挥舞长剑    在魔法森林中    晨光穿过树冠    概念艺术，8K    细节丰富
 ──主体──      ──动作──     ──背景──      ──光照──    ──风格──    ──质量──
```

### 提示词设计原则

1. **具体而非抽象**：不要说"beautiful"，要说"detailed, intricate, high contrast"
2. **前置核心信息**：最重要的内容放在提示词开头，模型对前几个词响应最强
3. **适度长度**：Midjourney 推荐 10-20 个关键词，SD/Flux 可以更长（50-100 词）
4. **避免矛盾描述**：不要同时说"sunny day"和"heavy rain"，模型会困惑
5. **用逗号分隔**：清晰的语义分隔有助于模型正确理解

::: tip 初学者提示
不必追求一步到位的高质量提示词。一个实用的工作习惯是：先用简短提示快速出图 → 观察效果 → 逐步添加细节 → 微调参数。这和烹饪一样，先炒熟再调味，而不是一开始就放齐所有调料。
:::

---

## 2. Midjourney 提示词体系

### 基础提示词结构

Midjourney 的提示词分为文本提示和参数两部分：

```
/Imagine prompt: [文本描述] [参数列表]
```

**示例：**

```
/imagine prompt: a majestic lion in the savanna at sunset, golden hour lighting, cinematic photography --ar 16:9 --s 250 --v 7
```

### 参数详解

| 参数 | 语法 | 取值范围 | 默认值 | 作用 |
|------|------|---------|--------|------|
| **宽高比** | `--ar` | 任意比例如 16:9, 4:3, 1:1, 9:16 | 1:1 | 控制画幅比例 |
| **风格化** | `--s` | 0-1000 | 100（V7）/ 250（V6） | 数值越高，艺术性越强但可能偏离提示词 |
| **混乱度** | `--c` | 0-100 | 0 | 数值越高，四张图差异越大 |
| **图片权重** | `--iw` | 0.5-2.0 | 1.0 | 控制参考图片对结果的影响强度 |
| **版本** | `--v` | 6, 6.1, 7 | 7 | 指定模型版本 |
| **否定** | `--no` | 排除的元素 | 无 | 告诉模型不要生成什么，如 `--no text, watermark` |
| **角色参考** | `--cref` | 图片 URL | 无 | 保持角色特征一致（V6+） |
| **风格参考** | `--sref` | 图片 URL | 无 | 提取参考图的视觉风格 |
| **高分辨率** | `--hd` | 无参数 | 无 | V8 Alpha 中启用原生 2K 分辨率（消耗 4x 资源） |
| **增强连贯** | `--q 4` | 无参数 | 无 | 增强复杂场景的连贯性（消耗 4x 资源） |

### 多提示词与权重分离

使用 `::` 作为分隔符，可以将提示词拆分为多个独立部分，并分别赋予不同权重：

```
/imagine prompt: a steampunk cityscape::2 futuristic cityscape::1 --ar 16:9
```

权重可以是正数也可以是负数：

```
/imagine prompt: a beautiful garden:: flowers:: trees:: --no grass::1.5
```

**应用场景：**
- **风格混合**：将两种风格分别赋予权重
- **元素控制**：强调主要元素、压制次要元素
- **否定权重**：用负权重排除不需要的元素

### Remix 模式

Remix 模式允许你在一次生成结果的基础上，修改提示词后重新生成，保留构图但改变内容。

```
启用方式：/settings → 开启 Remix Mode

工作流程：
1. 首先生成一幅图
2. 点击 "Vary (Region)" 或 "Vary (Subtle/Strong)"
3. 在弹出的对话框中修改提示词
4. 生成新的变体，保留原构图
```

**典型应用：**
- 保持人物姿势不变，改变服装/场景
- 保持构图不变，改变配色方案
- 在产品设计中将白色款改为黑色款而不改变造型

### 排列组合批量生成

使用 `{option1, option2, option3}` 语法，可以一次性生成多种排列组合：

```
/imagine prompt: a {cat, dog, rabbit} wearing a {top hat, beret, crown} --ar 1:1
```

上面的提示词会生成 3×3=9 种组合（每张图包含不同的动物+帽子组合），全部分配独立作业池。

::: tip 实用技巧
排列功能非常适合：
- **A/B 测试**：不同配色、不同风格快速对比
- **产品选型**：同一产品不同款式同时预览
- **风格探索**：多种艺术风格横向对比
:::

### Midjourney 提示词示例库

**场景一：写实摄影风格**

```
/imagine prompt: a portrait of a woman with freckles, soft diffused lighting, natural skin texture, 85mm lens, shallow depth of field, photorealistic --ar 3:4 --s 150 --v 7
```

**场景二：动漫/二次元风格**

```
/imagine prompt: anime girl with long blue hair in a school uniform, cherry blossom trees, vibrant colors, Makoto Shinkai style, Studio Ghibli background, soft pastel atmosphere --ar 16:9 --s 300 --v 7 --niji 7
```

::: info Niji 模型说明
Niji 7 是 Midjourney 专为动漫/二次元风格训练的模型，支持更丰富的 anime 风格表现。在提示词末尾加上 `--niji 7` 即可启用。
:::

**场景三：概念艺术**

```
/imagine prompt: floating crystalline islands in the sky, waterfalls cascading into void, bioluminescent flora, epic scale, concept art, intricate details, ethereal atmosphere, wide angle --ar 16:9 --s 500 --v 7
```

**场景四：产品展示**

```
/imagine prompt: a minimalist white wireless earphone case, on a marble surface, studio lighting, clean background, product photography, commercial concept, 8K detail --ar 4:3 --s 100 --v 7
```

**场景五：建筑可视化**

```
/imagine prompt: modern glass house in the forest at twilight, warm interior lights, reflective glass facade, minimalist architecture, architectural visualization, cinematic lighting --ar 16:9 --s 200 --v 7
```

---

## 3. Stable Diffusion 提示词体系

### 正向提示词与负向提示词

Stable Diffusion 将提示词分为两类：

- **正向提示词（Positive Prompt）**：描述你想要呈现的内容
- **负向提示词（Negative Prompt）**：描述你不想看到的内容

```
正向提示词：
masterpiece, best quality, 1girl, blue eyes, long hair, flower field, sunset

负向提示词：
nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry
```

### 权重语法

SD 提供了多种方式调整关键词的权重：

| 语法 | 等效写法 | 效果 |
|------|---------|------|
| `(word:1.2)` | 权重 1.2 | 增强词的影响 |
| `(word:0.8)` | 权重 0.8 | 减弱词的影响 |
| `(word)` | `(word:1.1)` | 简写，增强约 10% |
| `[word]` | `(word:0.9)` | 简写，减弱约 10% |
| `word+` | 非标准语法 | 某些 GUI 支持，增强 |
| `word-` | 非标准语法 | 某些 GUI 支持，减弱 |
| `(word:1.5)` | - | 强烈增强 |

**多层嵌套：**

```
((masterpiece:1.2), best quality:1.1), (detailed eyes:1.3), (sunset:1.2)
```

### Embedding（Textual Inversion）

Embedding 是一种轻量级的模型微调方式，本质上是将特定概念编码为一组 Token 向量：

```
使用方法：将 .pt 或 .safetensors 文件放入 embeddings 目录
在提示词中使用文件名调用：easynegative, bad-hands-5
```

**常用 Embedding 示例：**

| Embedding | 用途 | 位置 |
|-----------|------|------|
| `easynegative` | 通用负向优化 | 负向提示词 |
| `bad-hands-5` | 修正手部细节 | 负向提示词 |
| `Deep Negative` | 深层负向优化 | 负向提示词 |
| `bad_prompt` | 修正错误提示 | 负向提示词 |

### 提示词模板与风格（Style）

大多数 SD 前端（如 Automatic1111、ComfyUI）支持预设风格模板。以 Automatic1111 为例：

```
风格模板通常包含：
- 正向模板：{prompt}, masterpiece, best quality, art by XXX
- 负向模板：nsfw, lowres, bad anatomy, (bad hands:1.3), ...

使用方式：在 Style 下拉菜单选择预设，SD 会自动将模板拼接到提示词前后
```

**常用风格模板方向：**

```
写实摄影风格：
  + : cinematic, photorealistic, 8K, intricate details, natural lighting, sharp focus

二次元动漫风格：
  + : anime style, vibrant colors, cel shading, lineart, detailed background

手绘插画风格：
  + : watercolor, soft brush strokes, artistic, sketch, painterly

概念艺术风格：
  + : concept art, fantasy art, epic, intricate, detailed, atmospheric
```

---

## 4. 风格控制进阶

### 摄影风格库

| 风格关键词 | 效果 | 适用场景 |
|-----------|------|---------|
| Cinematic | 电影感布光，宽银幕比例感 | 故事感强烈的画面 |
| Photorealistic | 照片级真实感 | 产品图、写实肖像 |
| Analog / Film Grain | 胶片颗粒感，暖色调 | 复古风格 |
| Portrait Photography | 人像摄影布光，虚化背景 | 人像创作 |
| Golden Hour | 黄金时段暖色调光线 | 风景、户外人像 |
| Street Photography | 街头抓拍感，纪实风格 | 城市生活场景 |
| Macro Shot | 微距摄影，极致细节 | 产品细节、昆虫花卉 |

**示例组合：**

```
street style fashion model in Tokyo, cinematic lighting, anamorphic lens, 
film grain, street photography style, vivid neon signs --ar 2:3
```

### 艺术风格库

| 风格关键词 | 效果 | 适用场景 |
|-----------|------|---------|
| Oil Painting | 油画质感，厚重笔触 | 古典、肖像、风景 |
| Watercolor | 水彩轻盈透明感 | 插画、儿童读物 |
| Sketch / Pencil Drawing | 铅笔素描，线条感 | 概念草图、设计稿 |
| Anime | 日式动漫风格 | 角色设计、场景 |
| Pixel Art | 像素风，复古游戏风格 | 游戏素材、怀旧 |
| Ukiyo-e | 浮世绘风格，东方美学 | 传统日式主题 |
| Pop Art | 波普艺术，高饱和对比 | 现代艺术、海报 |
| Expressionism | 表现主义，强烈情感色彩 | 艺术作品、抽象 |

### 质量修饰词库

| 修饰词 | 效果 | 使用位置 |
|--------|------|---------|
| 8K / 4K | 暗示极高细节 | 正向提示词末尾 |
| Masterpiece | 杰作品质 | 正向提示词开头 |
| Trending on ArtStation | 艺术社区热门风格 | 风格提示 |
| Award Winning | 获奖级质量 | 质量提示 |
| High Details / Intricate Details | 高细节度 | 正向提示词 |
| Sharp Focus / Sharp | 清晰对焦 | 正向提示词 |
| High Contrast | 高对比度 | 风格提示 |

### 光照风格库

| 光照关键词 | 效果 | 适用场景 |
|-----------|------|---------|
| Studio Lighting | 专业棚拍，均匀布光 | 产品图、人像 |
| Dramatic Lighting | 戏剧性光影，高对比 | 概念艺术、氛围 |
| Volumetric Lighting | 体积光，丁达尔效应 | 森林、教堂等场景 |
| Rim Lighting | 轮廓光，逆光边缘光 | 人物剪影、产品 |
| Crepuscular Rays | 耶稣光，云隙光 | 风景、天空 |
| Soft Diffused Lighting | 柔光，漫射光 | 人像、静物 |
| Neon Lighting | 霓虹灯光效果 | 赛博朋克、城市 |
| God Rays | 神圣光束 | 室内、自然场景 |

### 构图风格库

| 构图关键词 | 效果 | 适用场景 |
|-----------|------|---------|
| Close-up | 特写镜头 | 人脸、产品细节 |
| Wide Shot | 广角大全景 | 风景、建筑、宏大场景 |
| Bird's Eye View | 俯视鸟瞰 | 城市、地形 |
| Dutch Angle | 斜角镜头，倾斜构图 | 悬疑、动感、不安感 |
| Macro Shot | 微距 | 极近距离细节 |
| Rule of Thirds | 三分法构图 | 通用构图 |
| Symmetrical | 对称构图 | 建筑、正式场景 |
| Leading Lines | 引导线构图 | 道路、走廊等纵深场景 |

::: tip 风格组合技巧
不要等量混合所有风格。一个常见的做法是**主风格占 70%，辅助风格占 30%**。例如：主提示词 "oil painting portrait" 搭配辅助 "with subtle watercolor background" 会产生独特的混搭效果，而不会让模型左右为难。
:::

---

## 5. 工作流实战

### Text-to-Image 标准流程

AI 图像创作并非简单的"输入 → 输出"，而是一个完整的创作流程：

```
构思描述 → 初版生成 → 评估效果 → 迭代优化 → 精修定稿 → 后处理增强
```

**第一步：构思描述**
- 明确创作目标：用途是什么？风格需要什么？输出给谁？
- 收集参考图：为风格、构图、配色找参考
- 写出初始提示词：遵循前面的四要素公式

**第二步：初版生成**
- 先用较低参数（如 Midjourney `--s 100` 或 SD CFG 7）快速出图
- 生成 4-8 张变体，作为"灵感板"
- 重点关注构图、主体、整体氛围是否到位

**第三步：评估效果**
- 从四方面评估：语义匹配度、构图美感、细节质量、物理合理性
- 记录问题点：哪个元素没出来？哪个细节有问题？

**第四步：迭代优化**
- 根据评估结果调整提示词
- 可使用 Remix 模式（Midjourney）或种子锁定（SD）保留满意部分
- 调整参数（风格化、权重、CFG Scale 等）

**第五步：精修定稿**
- 使用 Inpainting 修复局部问题（手部、面部等）
- 使用 Upscale 提升分辨率
- 使用 Photoshop/后期工具做最终调整

**第六步：后处理增强**
- 图片放大（Topaz Gigapixel、Real-ESRGAN）
- 色彩校正（Lightroom、Photoshop）
- 添加文字、合成到最终设计中

### Image-to-Image（Img2Img）

Img2Img 使用一张源图片作为起点，结合提示词生成新的变体：

```
源图片 + 提示词 + 降噪强度（Denoising Strength） → 新图片
```

**核心参数：降噪强度**

| 强度 | 效果 | 应用场景 |
|------|------|---------|
| 0.0-0.3 | 微小调整，基本保持原图 | 细节润色、颜色调整 |
| 0.3-0.5 | 中等变化，保留构图 | 风格迁移 |
| 0.5-0.7 | 大幅变化，保留大致结构 | 草图到成品 |
| 0.7-1.0 | 完全重绘，仅参考颜色/布局 | 全新创作 |

**典型应用：**

**风格迁移：**
```
源图：一张手机拍摄的照片
提示词："watercolor painting of a garden, soft brush strokes, artistic"
降噪强度：0.4-0.5
结果：照片保持构图但变成水彩风格
```

**草图到成品：**
```
源图：手绘线稿
提示词："colorful fantasy landscape, detailed background, volumetric lighting"
降噪强度：0.6-0.7
结果：线稿基础上生成完整彩色图像
```

**产品变体：**
```
源图：白色产品实物照
提示词："same product in {red, blue, black}, studio lighting"
降噪强度：0.3-0.4
结果：同一产品不同配色
```

### Inpainting（局部重绘）

Inpainting 允许你只修改图像的特定区域，而不影响其他部分：

```
工作流程：
1. 生成或上传一张基础图像
2. 标记需要修改的区域（MASK 遮罩）
3. 输入针对该区域的提示词
4. 只生成遮罩区域内的内容
```

**遮罩生成方式：**

| 方式 | 方法 | 适用场景 |
|------|------|---------|
| 手动涂抹 | 用画笔在图像上涂抹 | 精确控制修改区域 |
| 框选区域 | 拉选框覆盖目标区域 | 大块区域替换 |
| 语义自动 | 选中对象自动生成遮罩 | 一键替换特定物体 |

**实战技巧：**

- **留边处理**：遮罩区域不要和边缘贴太紧，留一些边界让模型自然过渡
- **提示词匹配**：Inpainting 的提示词应该与修复区域周围内容呼应
- **多次尝试**：同一遮罩多生成几次，挑选最佳结果
- **分层修复**：复杂场景分多次修复不同区域，而非一次处理

::: warning Inpainting 常见问题
Inpainting 区域如果和周围风格不匹配，会产生明显的"缝合感"。解决方法：
1. 遮罩边缘留出羽化空间（feathering）
2. 降低降噪强度到 0.5-0.7
3. 增加周围区域描述到提示词中
4. 必要时结合 Photoshop 手动过渡
:::

### Outpainting / 画布扩展

Outpainting 将图像向四周扩展，AI 自动补全扩展区域的内容。在 Midjourney 中使用 "Pan" 功能（支持上下左右四个方向移动）。

```
典型场景：
- 将竖版照片扩展为横版（适合社交媒体封面）
- 为已完成的插画添加更多环境背景
- 扩展现有构图以改变视觉焦点

执行策略：
1. 方向：一次延伸一个方向，不要四个方向同时做
2. 内容：提示词描述扩展区域应该有什么
3. 迭代：多次小幅扩展比一次大幅扩展效果好
```

### ComfyUI 工作流示例

以下描述三个典型的 ComfyUI 工作流（基于节点图的概念描述）：

**工作流一：基础文生图**

```
输入节点：
  - Checkpoint Loader → 加载基础模型（SDXL / FLUX）
  - CLIP Text Encode (Positive) → 正向提示词
  - CLIP Text Encode (Negative) → 负向提示词
  - Empty Latent Image → 设置分辨率

处理节点：
  - KSampler → 采样器，设置 CFG、Steps、Sampler

输出节点：
  - VAE Decode → 将 Latent 转为像素图像
  - Save Image → 保存结果

步骤：(1) 加载模型 → (2) 输入提示 → (3) 设置参数 → (4) 生成 → (5) 保存
```

**工作流二：ControlNet 姿态控制**

```
额外节点：
  - Load Image → 加载参考姿势图
  - ControlNet Loader → 加载 ControlNet（OpenPose）
  - Preprocessor → 预处理（DW Preprocessor 提取骨架）

连接方式：
  正向提示词 → ControlNet (OpenPose) → KSampler
  参考姿势图 → Preprocessor → ControlNet

优势：保持指定人物姿势的前提下，完全改变外观、服装、背景

参数建议：ControlNet 权重 0.7-0.8，起始 0.0，终止 1.0
```

**工作流三：批量换脸**

```
核心组件：
  - Face Swapper → 换脸节点（如 IP-Adapter FaceID）
  - 源人脸图片 → 需要保留的面部特征
  - 目标人脸图片 → 需要被替换的面部
  - KSampler → 生成批次

工作步骤：
  1. 基础文生图工作流生成一批人像
  2. 向每一个结果应用 Face Swapper
  3. 批量输出换脸后的图像

注意事项：
  - 源人脸和目标人脸的朝向最好接近
  - 检查换脸后的皮肤色调是否匹配
  - 可能需要 Inpainting 修复边缘过渡
```

::: info ComfyUI 的优势
相比 Automatic1111，ComfyUI 的最大优势是**工作流可视化**和**可复用性**。一个复杂工作流配置号后可以导出为 JSON，分享给其他人直接使用。ComfyUI Hub 上有上万社区共享的工作流，从基础的文生图到复杂的视频处理无所不有。
:::

---

## 6. 质量评判与常见问题

### 质量评判维度

AI 绘画结果的好坏，可以从以下四个维度来评判：

**维度一：提示词匹配度**

对照你的提示词，逐项检查模型是否准确呈现了：
- 主体是否正确？（猫而不是狗）
- 动作是否匹配？（奔跑而不是静止）
- 环境是否到位？（沙滩而不是森林）
- 风格是否符合？（水彩而不是油画）

**维度二：构图与光影**

- 构图是否平衡？有无明显倾斜或空边？
- 光影是否符合描述？（逆光、侧光、柔光）
- 主体是否在合理位置？焦点是否正确？
- 色彩搭配是否和谐？

**维度三：细节丰富度**

- 皮肤/材质纹理是否自然？
- 前景背景层次是否分明？
- 细节处（发丝、布料纹理、树叶）是否有足够精度？
- 放大后是否仍有可接受的细节？

**维度四：物理合理性**

- 人体结构是否正确？（手指数量、关节位置）
- 透视关系是否合理？（近大远小、消失点）
- 光影一致性？（光源方向是否统一）
- 物体间比例是否正常？（人和建筑的大小关系）

### 常见问题诊断表

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| **手指/手部畸形** | 模型对手部建模不足 | 负提示词增加 `bad hands, extra fingers`；使用手部修正 LoRA；Inpainting 局部修复 |
| **面部扭曲/崩坏** | CFG 过高、面部区域过小 | 降低 CFG 到 7-9；使用面部修复（Restore Face）；ADetailer 自动检测修复 |
| **语义遗漏** | 提示词过长、权重分配不当 | 简化提示词，将核心词放在最前；使用 `(keyword:1.3)` 强调关键元素 |
| **风格不一致** | ControlNet 权重与提示词冲突 | 降低 ControlNet 权重到 0.5-0.7；或增强提示词中的风格描述 |
| **背景杂乱** | 未指定背景内容 | 明确描述背景环境；使用 `--no cluttered, messy` 排除杂乱 |
| **过度平滑** | CFG 过低或模型限制 | 提高 CFG 到 10-12；加入 `highly detailed` 类质量修饰词 |
| **色彩失真** | 采样器选择不当 | 尝试不同的采样器（DPM++ 2M Karras、Euler a）；调整 CFG |
| **重复元素** | 长提示词中语义冲突 | 精简提示词；检查是否有矛盾的描述 |
| **文字乱码** | 模型文字渲染能力不足 | 使用 FLUX/Midjourney V8/DALL-E 3 等文字渲染强的模型；避免过少文字 |
| **过度风格化** | 风格化参数过高 | 降低 `--s`（Midjourney）或 CFG（SD）；选择更平衡的模型版本 |

### 进阶调试流程

当遇到质量问题时，按以下顺序排查：

```
Step 1: 检查基础设置
  ├─ 模型版本是否正确？（V7 / SDXL / FLUX）
  └─ 分辨率是否合理？（不要超出模型训练范围）

Step 2: 检查提示词
  ├─ 提示词是否过于冗长？
  ├─ 是否有相互矛盾的描述？
  └─ 核心信息是否放在前 5 个词？

Step 3: 调整核心参数
  ├─ CFG Scale（SD）或 --s（MJ）：影响提示词跟随度
  ├─ Steps（SD）：影响生成充分度
  └─ Denoising Strength（Img2Img）：影响变化幅度

Step 4: 更换模型/工具
  ├─ 换用不同的基础模型（SDXL → FLUX）
  ├─ 添加 LoRA/ControlNet 辅助控制
  └─ 换用本地部署方案获取更多控制能力

Step 5: 后处理修复
  ├─ Inpainting 修复局部
  ├─ Upscale 提升分辨率
  └─ Photoshop 做最终微调
```

::: warning 不要过度优化
很多初学者容易陷入"调参无限循环"——为了 5% 的提升花掉 50% 的时间。一个实用的原则是：**80% 的效果来自于提示词的合理设计，15% 来自于参数微调，5% 来自于后处理**。不要在参数微调上消耗过多精力，把时间更多地放在提示词设计和创意构思上。
:::

---

## 7. 本章小结

提示词工程是 AI 绘画的核心技能，也是区分"会用"和"用好"的关键分水岭。本章我们学习了：

1. **四要素框架**：主体、环境、风格、参数构成了提示词的基本骨架
2. **Midjourney 体系**：权重分离、Remix 模式、排列组合批量生成——MJ 提供了一套高效的创意探索工具
3. **Stable Diffusion 体系**：正负提示词分离、灵活权重语法、Embedding 扩展——SD 强调精确控制
4. **风格控制库**：摄影、艺术、质量、光照、构图五大类风格词库，让你能精准表达视觉意图
5. **完整工作流**：从构思到成品的六步流程，以及 Img2Img、Inpainting、Outpainting 等高级应用
6. **质量控制**：系统的诊断流程帮助你快速定位和解决常见问题

**核心收获：** 好的提示词不是写出来的，是"炼"出来的。每次迭代都是一次学习，每一次"翻车"都在训练你对 AI 模型的理解。保持实验心态，建立自己的提示词库，多对比不同平台的输出差异——这些习惯会让你快速从新手成长为高手。

---

::: info 实践建议
1. **建立提示词库**：将你每次成功的提示词记录下来，标注平台、参数和效果
2. **对比实验**：同一提示词在不同平台上生成，对比差异并分析原因
3. **从模仿开始**：在 Discord、Reddit、ArtStation 等社区学习他人的优秀提示词
4. **跨媒体尝试**：将 AI 绘画与视频生成、3D 建模结合，探索更多可能性
:::

---

**导航：** [← 返回章节目录](/agent-ecosystem/14-ai-image-generation) | [继续学习：商业应用与案例 →](/agent-ecosystem/14-ai-image-generation/06-business-cases)
