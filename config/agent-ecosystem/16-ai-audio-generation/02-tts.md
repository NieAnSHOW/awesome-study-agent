# 文本转语音（TTS）

> **学习目标**：能用 4 个 TTS 工具生成可用的语音内容，知道每个工具适合什么场景
>
> **预计时间**：50 分钟
>
> **难度**：⭐⭐

---

## 先说结论

TTS（Text-to-Speech）是 AI 音频里最成熟、最实用的方向。2026 年，好的 TTS 工具生成的语音，普通人已经分辨不出是 AI 还是真人。

**不是所有 TTS 都一样。** 中文场景选豆包语音或 Edge TTS，英文场景选 ElevenLabs，想自己部署选 IndexTTS。这四个工具覆盖了 95% 的使用需求。

---

## 工具一：ElevenLabs

ElevenLabs 是目前 TTS 领域的标杆。2023 年上线，2025 年估值超过 **33 亿美元**。英语语音质量是行业天花板，中文也不错。

### 注册

1. 打开 [elevenlabs.io](https://elevenlabs.io)
2. 点击 "Sign Up"，用 Google 或邮箱注册
3. 免费账号立即生效

### 免费额度

| 项目 | 免费额度 |
|------|----------|
| 字符数/月 | 10,000 字符（约 2,500 个中文字） |
| 声音数量 | 可使用社区分享的数千种声音 |
| API 调用 | 支持，但受字符数限制 |

::: tip 额度够用吗？
10,000 字符大约能生成 **3-5 分钟**的语音。如果你只是试试效果或做个短视频配音，免费额度完全够。长期使用需要付费，最便宜的套餐是 $5/月（30,000 字符）。
:::

### 使用步骤

**Step 1：选择声音**

登录后进入 "Speech Synthesis" 页面。左侧是声音选择区，ElevenLabs 提供了几十种预设声音。可以按语言、性别、年龄筛选。

推荐试这几个：
- `Rachel`：标准女声，适合旁白
- `Adam`：低沉男声，适合纪录片风格
- `Clyde`：年轻男声，适合播客

**Step 2：输入文本**

在文本框中输入或粘贴文字。支持中文、英文、日文等 32 种语言。

**Step 3：调整设置**

| 参数 | 作用 | 建议 |
|------|------|------|
| Stability | 控制声音稳定性 vs 表现力 | 旁白用 0.7-0.8，有情感的内容用 0.3-0.5 |
| Similarity | 控制与原始声音的相似度 | 一般保持默认 0.75 |
| Style Exaggeration | 风格夸张度 | 默认 0 即可，需要戏剧化效果时调高 |

**Step 4：生成并下载**

点击 "Generate Speech"，几秒后即可试听。满意了点下载，MP3 格式。

### ElevenLabs 的优势

- **多语言**：32 种语言，切换声音就能切换语言
- **声音质量**：英文效果是行业最好的，没有之一
- **声音克隆**：付费用户可以上传自己的音频来克隆声音（下节详讲）
- **API 友好**：开发者可以快速集成

### ElevenLabs 的不足

- 中文效果虽好，但不如豆包语音自然
- 免费额度偏少，重度使用需要付费
- 国内访问速度不稳定

---

## 工具二：IndexTTS（开源）

IndexTTS 是一个开源的 TTS 方案，适合想自己部署、或者需要大量生成语音的用户。

### 特点

| 特点 | 说明 |
|------|------|
| **开源免费** | 无字符限制，生成多少都行 |
| **中文优化** | 对中文支持经过专门调优 |
| **本地部署** | 数据不出本地，适合隐私敏感场景 |
| **需要 GPU** | 最低 4GB 显存的 GPU |

### 部署步骤（简述）

```bash
# 克隆项目
git clone https://github.com/IndexTeam/IndexTTS
cd IndexTTS

# 安装依赖
pip install -r requirements.txt

# 下载模型（约 1.5GB）
python download_model.py

# 启动 Web UI
python webui.py
```

::: info 适合谁？
IndexTTS 适合有技术背景、需要批量生成语音、或者对数据隐私有要求的用户。普通用户用 ElevenLabs 或豆包语音就够了。
:::

---

## 工具三：豆包语音（中文首选）

豆包语音是字节跳动推出的 TTS 服务。如果你主要处理中文内容，这是目前效果最好的选择之一。

### 注册

1. 打开 [www.volcengine.com](https://www.volcengine.com)（火山引擎控制台）
2. 注册火山引擎账号（支持手机号注册）
3. 在产品列表中找到"语音合成"并开通

### 免费额度

| 项目 | 免费额度 |
|------|----------|
| 字符数/月 | 开通即赠送一定额度（具体以官网为准） |
| 声音选择 | 提供多种中文声音，含方言支持 |
| API 调用 | 支持 REST API |

### 使用方式

豆包语音主要通过 API 调用，但也有在线体验页面。

**在线体验：**

1. 登录火山引擎控制台
2. 进入"语音合成"产品
3. 找到"在线体验"入口
4. 输入文字，选择声音，点击合成

**API 调用示例：**

```python
import requests
import json

url = "https://openspeech.bytedance.com/api/v1/tts"
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}
data = {
    "text": "你好，这是豆包语音的演示。",
    "speaker": "zh_female_shuangkuaisisi_mars_bigtts",
    "audio_config": {
        "format": "mp3",
        "sample_rate": 24000
    }
}
response = requests.post(url, headers=headers, json=data)
with open("output.mp3", "wb") as f:
    f.write(response.content)
```

### 豆包语音的优势

- **中文效果最好**：毕竟是字节的产品，中文训练数据充足
- **方言支持**：粤语、四川话等方言也支持
- **速度快**：国内服务器，延迟低
- **价格便宜**：比 ElevenLabs 便宜不少

### 豆包语音的不足

- 英语效果不如 ElevenLabs
- 注册流程比 ElevenLabs 繁琐（需要火山引擎账号）
- 文档偏技术向，非技术用户上手门槛稍高

---

## 工具四：Edge TTS（完全免费）

Edge TTS 是微软 Edge 浏览器自带的 TTS 引擎，通过第三方库可以直接调用。**完全免费，没有字符限制。**

### 安装

```bash
pip install edge-tts
```

### 使用

**命令行方式：**

```bash
# 列出所有可用声音
edge-tts --list-voices

# 生成中文语音
edge-tts --text "你好，这是 Edge TTS 生成的语音。" --voice zh-CN-YunxiNeural --write-media output.mp3

# 生成英文语音
edge-tts --text "Hello, this is Edge TTS." --voice en-US-AriaNeural --write-media output_en.mp3
```

**Python 代码方式：**

```python
import asyncio
import edge_tts

async def generate_tts(text, voice, output_file):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)

# 生成语音
asyncio.run(generate_tts(
    "大家好，欢迎来到 AI 音频生成的世界。",
    "zh-CN-YunxiNeural",
    "output.mp3"
))
```

### 推荐声音

| 声音名称 | 语言 | 特点 |
|----------|------|------|
| `zh-CN-YunxiNeural` | 中文 | 年轻男声，声音清晰自然 |
| `zh-CN-XiaoxiaoNeural` | 中文 | 标准女声，适合旁白 |
| `en-US-AriaNeural` | 英文 | 自然女声 |
| `en-US-GuyNeural` | 英文 | 沉稳男声 |
| `ja-JP-NanamiNeural` | 日文 | 日语女声 |

### Edge TTS 的优势

- **完全免费**：没有字符限制，没有次数限制
- **多语言**：支持 100+ 种语言和方言
- **离线可用**：通过 Python 库调用，可以集成到任何项目中
- **质量不错**：微软的 Neural TTS 引擎，质量在免费方案中是最好的

### Edge TTS 的不足

- 没有可视化界面（需要命令行或代码）
- 没有情感控制参数
- 声音种类不如 ElevenLabs 丰富
- 偶尔出现服务不稳定（毕竟用的是微软的公共接口）

::: tip 什么时候用 Edge TTS？
批量生成、脚本自动化、预算为零的项目。Edge TTS 是性价比最高的 TTS 方案——不是最好听的，但是免费里面最好的。
:::

---

## 四个工具对比

| 维度 | ElevenLabs | IndexTTS | 豆包语音 | Edge TTS |
|------|-----------|----------|----------|----------|
| **英文质量** | 最好 | 良好 | 一般 | 良好 |
| **中文质量** | 良好 | 优秀 | 最好 | 良好 |
| **免费额度** | 1 万字符/月 | 无限制 | 有赠送额度 | 无限制 |
| **使用门槛** | 极低 | 需要部署 | 中等 | 需要代码 |
| **适合场景** | 英文配音、多语言 | 本地部署、批量生成 | 中文配音 | 免费方案、自动化 |

---

## 实操建议

### 场景一：做短视频中文配音

推荐：**豆包语音** 或 **Edge TTS（zh-CN-YunxiNeural）**

步骤：
1. 写好配音文案
2. 用工具生成语音
3. 在剪映里把语音和视频合成

### 场景二：做英文播客

推荐：**ElevenLabs**

步骤：
1. 写好播客脚本
2. 选择一个喜欢的声音
3. 调整 Stability 到 0.5-0.6，让语调更自然
4. 逐段生成，拼接在一起

### 场景三：批量生成通知语音

推荐：**Edge TTS**

步骤：
1. 准备文本列表
2. 写一个 Python 脚本循环调用 Edge TTS
3. 批量输出 MP3 文件

```python
import asyncio
import edge_tts

texts = [
    ("欢迎来到展厅", "zh-CN-YunxiNeural", "welcome.mp3"),
    ("请注意安全", "zh-CN-XiaoxiaoNeural", "safety.mp3"),
    ("谢谢参观", "zh-CN-YunxiNeural", "thanks.mp3"),
]

async def batch_generate():
    for text, voice, filename in texts:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(filename)
        print(f"已生成: {filename}")

asyncio.run(batch_generate())
```

---

## 本节小结

通过本节学习，你应该掌握了：

✅ 四个 TTS 工具的注册、使用和免费额度——ElevenLabs、IndexTTS、豆包语音、Edge TTS
✅ 各工具的优劣对比——英文选 ElevenLabs，中文选豆包语音，免费选 Edge TTS
✅ 三个典型场景的实操方案——短视频配音、英文播客、批量生成

---

**下一步**：在 [下一节](/agent-ecosystem/16-ai-audio-generation/03-music-generation) 中，我们从"说话"切换到"唱歌"——用 Suno 等工具生成完整的音乐作品。

---

[← 返回章节目录](/agent-ecosystem/16-ai-audio-generation) | [继续学习：AI 音乐生成 →](/agent-ecosystem/16-ai-audio-generation/03-music-generation)
