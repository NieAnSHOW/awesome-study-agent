# AI Image Generation Market & Tools Reference Data (2025-2026)

> Compiled on 2026-05-04 from web research. All data and facts extracted from search results are presented as-is for reference purposes.

---

## Table of Contents

1. [Market Size & Industry Data](#1-market-size--industry-data)
2. [Midjourney](#2-midjourney)
3. [DALL-E 3 (OpenAI)](#3-dall-e-3-openai)
4. [Adobe Firefly](#4-adobe-firefly)
5. [Stable Diffusion 3 / FLUX (Black Forest Labs)](#5-stable-diffusion-3--flux-black-forest-labs)
6. [ComfyUI](#6-comfyui)
7. [ControlNet / LoRA / IP-Adapter](#7-controlnet--lora--ip-adapter)
8. [Tongyi Wanxiang (通义万相 - Alibaba)](#8-tongyi-wanxiang-通义万相---alibaba)
9. [Wenxin Yige (文心一格 - Baidu)](#9-wenxin-yige-文心一格---baidu)
10. [Jimeng AI (即梦AI - ByteDance)](#10-jimeng-ai-即梦ai---bytedance)
11. [Kling AI (可灵AI - Kuaishou)](#11-kling-ai-可灵ai---kuaishou)
12. [Tencent Hunyuan / MiniMax / Zhipu CogView](#12-tencent-hunyuan--minimax--zhipu-cogview)

---

## 1. Market Size & Industry Data

### Global AI Image Generator Market Size Estimates (2026)

Multiple research firms provide varying estimates, each with a different scope:

| Source | 2025 Value | 2026 Value | 2030/2035 Value | CAGR | Source URL |
|--------|-----------|-----------|-----------------|------|-----------|
| Research & Markets (Feb 2026) | $0.43B | $0.51B | $0.97B (2030) | 17.4-17.5% | researchandmarkets.com |
| Technavio (2025) | - | - | $2.39B growth (2024-2029) | 31.5% | technavio.com |
| Fundamental Business Insights | $467.67M | $541.36M | $2.39B (2035) | 17.7% | fundamentalbusinessinsights.com |
| Market Research Future (MRFR) | $0.4956B | - | $2.594B (2035) | 18.0% | marketresearchfuture.com |
| Value Market Research (Feb 2026) | $491.45M | - | $2,186.45M (2034) | 18.04% | valuemarketresearch.com |
| KSI (2026) | - | $0.56B | $1.68B (2031) | 24.6% | giiresearch.com |
| SkyQuest (Dec 2025) | $3.16B | - | $30.02B (2033) | 32.5% | giiresearch.com |
| **zsky.ai (2026 estimate)** | **$2.1B** | **$4.8B** | **$12.3B (2028)** | **~32%** | zsky.ai |

**Key observations:**
- Narrow-scope reports (pure image generator software): ~$0.5B in 2026
- Broader-scope reports including enterprise APIs, integrations, hardware: up to $4.8B in 2026
- Consensus CAGR range: 17-32% depending on scope
- North America holds ~46% market share (2025)

### Market Segments Breakdown (zsky.ai 2026 Estimate)

| Segment | 2024 | 2025 | 2026 (est.) | 2028 (proj.) | CAGR |
|---------|------|------|-------------|-------------|------|
| Consumer Platforms | $320M | $780M | $1.6B | $3.8B | 36% |
| Enterprise APIs | $210M | $580M | $1.4B | $4.2B | 42% |
| Platform Integrations | $150M | $410M | $960M | $2.4B | 35% |
| Open-Source Ecosystem | $80M | $190M | $480M | $1.1B | 28% |
| Hardware (GPUs) | $40M | $140M | $360M | $850M | 38% |
| **Total** | **$800M** | **$2.1B** | **$4.8B** | **$12.3B** | **32%** |

### Key Market Drivers (2026)
- Advancements in neural networks and generative AI algorithms
- Growing demand for digital content across social media, marketing, gaming
- Integration of AI image generators with marketing platforms
- Expansion of cloud-based image generation services
- Increasing use in gaming and entertainment industries
- Demand for personalized visual content
- U.S. arts and cultural production industries (2023): $265.8B, grew 10.6%

### Major Companies Mentioned in Market Reports
OpenAI (US), Adobe (US), NVIDIA (US), Stability AI (GB), DeepAI (US), Runway (US), DALL-E (US), Artbreeder (US), NightCafe (AU), Meta Platforms (US), AMD (US)

---

## 2. Midjourney

### Current Status (April 2026)

- **Default model**: V7 (production default since June 16, 2025)
- **Alpha models**: V8 Alpha (March 17, 2026), V8.1 Alpha (April 14, 2026) -- accessible via alpha.midjourney.com
- **Anime model**: Niji 7 (launched January 9, 2026)
- **Web app**: Full-featured at midjourney.com -- Discord is now optional
- **Free tier**: Discontinued in late 2024
- **Public API**: None generally available; Enterprise API is invitation-gated

### Midjourney V8 Alpha (March 17, 2026)

**Key improvements:**
- **5x faster generation** vs V7 -- renders in under 10 seconds (was 30-60s)
- **New GPU-native codebase** -- complete architectural rewrite
- **Native 2K resolution** via `--hd` parameter (no separate upscaling needed)
- **Improved text rendering** -- quoted text strings rendered more reliably inside images
- **Better prompt understanding** -- complex multi-element prompts followed more accurately
- **Style Creator**: Extract reusable visual styles from reference images as shareable codes
- **Enhanced personalization** via `--personalize` / `--p` parameter
- **`--q 4` mode**: Enhanced image coherence for complex scenes
- Parameters: `--chaos`, `--weird`, `--exp`, `--raw`

**V8.1 Alpha** (April 14, 2026): Default HD mode, native 2K images without explicit upscale step.

**Premium features cost 4x more:**
| Feature | Cost | Speed |
|---------|------|-------|
| Standard generation | 1x | ~5x faster than V7 |
| `--hd` (2K resolution) | 4x | 4x slower than standard |
| `--q 4` (enhanced coherence) | 4x | 4x slower than standard |
| Style references (--sref) | 4x | 4x slower than standard |
| Moodboard references | 4x | 4x slower than standard |

**Relax mode**: Not available at V8 launch; added for V8 Alpha on March 21, 2026.

### Pricing Plans (Verified April 2026)

| Plan | Monthly | Annual (per month) | Fast GPU Hours | Relax Mode | Stealth Mode | Target User |
|------|---------|-------------------|----------------|------------|-------------|-------------|
| Basic | $10 | $8 | 3.3 hr (~200 images) | No | No | Hobbyists |
| Standard | $30 | $24 | 15 hr (~900 images) | Unlimited | No | Most working designers |
| Pro | $60 | $48 | 30 hr (~1,800 images) | Unlimited | Yes | Agency / client work |
| Mega | $120 | $96 | 60 hr (~3,600 images) | Unlimited | Yes | High-volume studios |

- Annual billing saves 20% across all tiers
- Commercial rights included on all paid tiers
- Businesses with >$1M annual revenue must use Pro or Mega for commercial use
- Extra GPU time: $4/hr

### Midjourney vs Competitors (2026)
- **Strengths**: Best artistic quality and aesthetics, strong community, commercial rights bundled
- **Weaknesses**: Text rendering still imperfect (V8 improved), no free tier, no public API, closed ecosystem
- **Best for**: Creators prioritizing aesthetic quality and creative expression

---

## 3. DALL-E 3 (OpenAI)

### Current Status (2026)

- **Release date**: September/October 2023
- **Access**: Via ChatGPT (Free/Plus/Team/Enterprise) and OpenAI API
- **Technology**: Autoregressive image synthesis, built natively on ChatGPT/GPT-4o infrastructure
- **Provenance classifier**: 99%+ accuracy detecting DALL-E 3 generated images (internal)

### Key Features
- **Superior prompt adherence** -- follows complex instructions with high fidelity
- **Native typography support** -- renders coherent text within images (labels, signs, logos)
- **HD quality mode**: Standard vs. HD quality parameter
- **Style options**: "vivid" (hyper-real, cinematic - default in ChatGPT) vs "natural" (grounded, photographic)
- **Aspect ratios**: 1024x1024, 1024x1792 (portrait), 1792x1024 (landscape)
- **Safety mitigations**: Declines requests for public figures, living artists' styles, violent/adult content
- **Multi-turn editing**: Inpainting via conversation in ChatGPT
- **Prompt rewriting**: GPT-4 auto-optimizes prompts before passing to DALL-E 3

### Pricing (2026)

**ChatGPT Integration:**
- ChatGPT Free: 2 images per day
- ChatGPT Plus: $20/month (unlimited images included)
- ChatGPT Enterprise: Custom pricing

**API Pricing:**
| Size | Standard Quality | HD Quality |
|------|-----------------|------------|
| 1024x1024 | $0.04 | $0.08 |
| 1024x1536 / 1536x1024 | $0.08 | $0.12 |

**API Rate Limits:**
| Tier | Images per minute |
|------|------------------|
| Free | Not supported |
| Tier 1 | 500 |
| Tier 2 | 2,500 |
| Tier 3 | 5,000 |
| Tier 4 | 7,500 |
| Tier 5 | 10,000 |

### Important: API Deprecation
- **DALL-E 3 API is deprecated as of May 12, 2026**
- Developers must migrate to alternatives (FLUX, Stable Diffusion 3.5, ModelsLab)
- ChatGPT integration remains unaffected

### Strengths & Weaknesses
- **Strengths**: Deep ChatGPT integration, excellent text rendering, conversational editing workflow
- **Weaknesses**: API costs high for volume, API being deprecated, no variations/inpainting via API (only ChatGPT)
- **Best for**: Existing ChatGPT Plus subscribers who need occasional image generation

---

## 4. Adobe Firefly

### Current Status (April 2026)

- **Positioning**: "All-in-one creative AI studio"
- **Platform**: firefly.adobe.com, Firefly Boards, mobile app (iOS/Android)
- **Integration**: Photoshop, Premiere Pro, Express, Illustrator, Figma (plugin), Acrobat

### Latest Features (2026 Updates)

**Image Editing Tools (March 2026):**
- **Generative Fill**: Add, replace, or refine elements with context-aware results
- **Generative Remove**: Quickly eliminate unwanted objects
- **Generative Expand**: Seamlessly adapt images to new sizes and aspect ratios
- **Generative Upscale**: Increase resolution and sharpen details
- **Remove Background**: Isolate subjects with one click

**Precision Flow & AI Markup (April 2026):**
- **Precision Flow**: Browse variations from a single prompt using an intuitive slider -- subtle shifts to dramatic transformations
- **AI Markup**: Draw directly on images using brush, rectangle, or reference images to place objects, sketch elements, refine lighting

**Partner Model Ecosystem (30+ models available):**
Firefly offers choice of models:
- Adobe's commercially safe Firefly models
- Google Nano Banana 2 & Veo 3.1
- OpenAI's GPT Image Generation / GPT Image 2
- Runway Gen-4.5
- Black Forest Labs FLUX.2 [pro]
- Kling 3.0 & Kling 3.0 Omni
- Luma AI Ray3.14
- ElevenLabs Multilingual v2
- Topaz Lab Topaz Astra

**Custom Models (Public Beta, March 2026):**
- Train a model on your own images for character, illustration, or photographic styles
- Supports illustration styles (stroke weight, fills, color consistency), character consistency, photographic styles

**Firefly AI Assistant (Public Beta, April 27, 2026):**
- Orchestrates multi-step workflows across Photoshop, Premiere, Firefly, and more
- Access to 60+ pro-grade tools
- Available for Creative Cloud Pro or paid Firefly plan subscribers

**Video Editor Capabilities (2026):**
- Quick Cut: Turn raw footage into structured first cut from prompts
- Audio upgrades: Enhance Speech, noise reduction, reverb balance
- Color adjustments: Exposure, contrast, saturation, temperature with one-click looks
- Adobe Stock integration: 800M+ licensed assets

### Unlimited Generations Promotion
- As of February 2026: Unlimited generations with industry-leading models (Google Nano Banana Pro, GPT Image Generation, Runway Gen-4 Image, Adobe Firefly models)
- 2K resolution included

### Pricing
Plans include: Firefly Pro, Firefly Premium, credit-based plans (4,000, 7,000, 50,000 credits)
- Free version: Limited generations
- Unlimited generations for paid subscribers
- Photoshop web/mobile: 20 free generations for free users, unlimited for paid (promotional)

### Photoshop Generative Fill Update (April 2026)
- Redesigned interface with reference image support
- Model picker in contextual task bar
- New default model: Firefly Fill & Expand
- Partner models: Gemini 3 (Nano Banana Pro), FLUX.2 pro
- Generative AI credit balance visible in task bar

---

## 5. Stable Diffusion 3 / FLUX (Black Forest Labs)

### Company Background
- **Black Forest Labs**: Founded 2024 in Freiburg, Germany by Robin Rombach, Andreas Blattmann, and other original creators of Stable Diffusion
- **Mission**: Build best image generation models, open-source core tech, monetize through commercial API
- **FLUX lineage**: FLUX.1 (Aug 2024) -> FLUX.2 (Nov 2025) -> FLUX.2 [klein] (Jan 2026)

### FLUX.2 Family (November 2025)

FLUX.2 is a production-grade image generation and editing system with:
- Multi-reference editing (up to 10 images combined)
- Exact color control
- Structured prompting
- Output up to 4MP (megapixels)
- Character and style consistency across reference images
- Text rendering accuracy: 92% for complex layouts
- Spatial relationships error rate decreased by 37%

**Architecture**: Latent flow matching + Mistral-3 24B vision-language model + rectified flow transformer
- New VAE autoencoder: Latent space compression improved 18%

**Model Variants:**

| Model | Parameters | License | Best For |
|-------|-----------|---------|----------|
| FLUX.2 [pro] | - | Commercial API | Production, highest quality |
| FLUX.2 [flex] | - | Commercial API | Developer control, steps/guidance adjustment |
| FLUX.2 [dev] | 32B | Non-commercial (open weights) | Research, fine-tuning |
| FLUX.2 [klein] 4B | 4B | Apache 2.0 | Local, sub-second inference, consumer GPUs |
| FLUX.2 [klein] 9B | 9B | Non-commercial | Higher quality local, fine-tuning |

**FLUX.2 [klein] highlights (January 2026):**
- Sub-second inference on consumer hardware
- Fits in ~8GB VRAM (RTX 3090/4070+) for 4B model
- Apache 2.0 license on 4B variants
- Text-to-image, single-ref editing, multi-ref editing all in one model

**FLUX.2 [pro] speed** (March 2026): ~2x faster for T2I and editing, no price change
**FLUX.2 [flex] speed** (January 2026): Up to 3x faster, improved typography

### FLUX.1 Models (August 2024 - Legacy)

| Model | Parameters | License |
|-------|-----------|---------|
| FLUX.1 [schnell] | 12B | Apache 2.0 |
| FLUX.1 [dev] | 12B | Non-commercial |
| FLUX.1 [pro] | - | Commercial API |
| FLUX.1 Fill [dev] | - | Non-commercial |
| FLUX.1 Canny/Depth [dev] | - | Non-commercial |
| FLUX.1 Redux [dev] | - | Non-commercial |
| FLUX.1 Kontext [dev] | - | Non-commercial |
| FLUX.1 Krea [dev] | - | Non-commercial |

### Stable Diffusion 3.5 (Stability AI)

**Model Suite:**
- SD3.5 Medium: ~2B params, 9.9GB VRAM, designed for consumer hardware
- SD3.5 Large: ~8B params, strongest prompt adherence and quality
- SD3.5 Large Turbo: Distilled for speed

**Status (April 2026):**
- Open weights available (Community license)
- ControlNets available for SD3.5 Large
- Strongest option for self-hosting, local customization, builder-first workflows
- Stability's hosted services: Stable Image Ultra, Stable Image Core

### FLUX vs Stable Diffusion (2026 Summary)

| Criteria | FLUX Winner | Why |
|----------|------------|-----|
| Typography | FLUX | Excellent text rendering |
| Prompt adherence | FLUX | Flow matching architecture |
| Photorealism | Tie | Both excellent |
| Community ecosystem | Stable Diffusion | Mature, extensive LoRAs/checkpoints |
| Open weights | Stable Diffusion | More open licensing options |
| Commercial API | FLUX | Clear rate card, production-ready |
| Local speed | FLUX (klein) | Sub-second on consumer GPUs |
| Fine-tuning | Stable Diffusion | Larger LoRA ecosystem |

### GitHub Activity
- **FLUX.1 repo**: 25,428 stars, 1,875 forks, 30 contributors
- **FLUX.2 repo**: 2,177 stars, 146 forks, 5 contributors

---

## 6. ComfyUI

### Current Status (2026)

- **Developer**: Comfy Org
- **GitHub stars**: 109,838 (as of April 2026)
- **Latest release**: v0.19.3 (April 17, 2026)
- **License**: GPL v3.0
- **Release cadence**: Weekly stable releases, fortnightly frontend updates
- **Desktop**: Standalone installers for Windows and macOS (ARM), currently in Beta

### Core Platform

**What it is**: Open-source, node-based interface for AI image/video/3D/audio generation pipelines. Users connect nodes on an infinite canvas to build visual workflows.

**Supported Models:**
- **Image**: SD1.x, SD2.x, SDXL (Turbo), Stable Cascade, SD3, SD3.5, Pixart Alpha/Sigma, AuraFlow, HunyuanDiT, FLUX (1 + 2), Lumina Image 2.0, HiDream, Qwen Image, Hunyuan Image 2.1, Z Image
- **Video**: Stable Video Diffusion, Mochi, LTX-Video, Hunyuan Video, Nvidia Cosmos, Wan 2.1
- **Audio**: Stable Audio, ACE Step
- **3D**: Hunyuan3D 2.0

**Supported Techniques:**
- LoRA (regular, locon, loha), Textual Inversion, Hypernetworks
- ControlNet, T2I-Adapters, GLIGEN
- Embeddings
- Area composition, inpainting

### Platform Components

| Component | Description |
|-----------|-------------|
| **Comfy Local** | Run on own hardware |
| **Comfy Cloud** | Full power from anywhere (cloud credits) |
| **Comfy API** | Turn workflows into production endpoints |
| **Comfy Enterprise** | Enterprise-grade infrastructure |
| **Comfy Hub** | 60,000+ community nodes, thousands of shared workflows |

### Usage & Adoption
- Industry-grade creative engine used in film, VFX, animation, brand work, gaming
- Used by Corridor Crew, Coca-Cola (Silverside AI), Puma, Salesforce, Magnopus
- 300+ contributors to core repo
- Workflows can be embedded in generated PNG/WebP metadata

### Key Features
- Graph/nodes/flowchart interface (no coding required)
- Smart caching and model management
- Full workflow portability (JSON export/import)
- App Mode: Simplified view for beginners
- Custom node ecosystem for extensibility
- Configuration file for model search paths

---

## 7. ControlNet / LoRA / IP-Adapter

### Overview (2025-2026)

These three techniques form the "control stack" for AI image generation:

| Technique | Purpose | Method |
|-----------|---------|--------|
| **ControlNet** | Spatial structure control | Feeds edges, depth maps, pose skeletons into diffusion |
| **LoRA (Low-Rank Adaptation)** | Fine-tune weights for specific styles/characters | Small adapter weights applied to base model |
| **IP-Adapter** | Style/identity from reference images | Injects image embeddings into cross-attention layers |

### Combined Power

**IP-Adapter + ControlNet combo (2025-2026):**
- Style accuracy: 96% with 1 reference image
- Content preservation: 99%+ with ControlNet guidance
- Generation time: 10-30 seconds (vs hours for traditional methods)
- Zero training required
- VRAM: 8GB min, 12GB for SDXL, 16GB+ for multi-ControlNet
- IP-Adapter scale: 0.5-0.7 typical sweet spot
- ControlNet scale: 0.7-0.8 for strong guidance

### ControlNet Guidance Levels

| Scale | Effect |
|-------|--------|
| 0.3-0.5 | Loose guidance, creative liberties |
| 0.7-0.8 | Strong guidance, architectural/product work |
| 1.0+ | Rigid, pixel-accurate structure |

### IP-Adapter Presets (ComfyUI)

| Preset | Purpose |
|--------|---------|
| LIGHT | Subtle style hint |
| STANDARD | Balanced style transfer |
| PLUS | Enhanced quality (22M params) |
| FULL FACE | Face identity transfer |
| COMPOSITION | Composition/style from reference |
| FACEID/FACEID PLUS/FACEID PLUS V2 | Face identity (SD1.5) |
| FACEID PORTRAIT UNNORM | Face identity (SDXL) |

### FLUX Ecosystem Support
- FLUX ControlNets: V1, V2, V3 (Canny, Depth, HED) available
- FLUX IP-Adapter: Released for FLUX.1
- FLUX LoRAs: Available on HuggingFace, Civitai
- T-LoRA (AAAI 2026): Timestep-dependent LoRA for single-image customization without overfitting

### CtrLoRA (ICLR 2025)
- Framework combining Base ControlNet + condition-specific LoRAs
- 90% fewer learnable parameters vs ControlNet
- As few as 1,000 data pairs and <1 hour single-GPU training for new conditions

### Ultimate Workflow (LoRA + ControlNet + IP-Adapter + Prompt)
- Workflow: Text Prompt -> CLIP Embedding -> Latent Noise
  - Parallel: ControlNet (structure) + LoRA (trained identity) + IP-Adapter (style/face)
  - -> U-Net -> VAE Decode -> Final Image

---

## 8. Tongyi Wanxiang (通义万相 - Alibaba)

### Current Status (2026)

- **Developer**: Alibaba Cloud (Alibaba Group)
- **Launch date**: July 7, 2023
- **Latest model**: Wan 2.6 series (December 2025)
- **Platform**: tongyi.aliyun.com/wanxiang/ (web), Tongyi App
- **Brand family**: Part of Alibaba's "Tongyi" (通义) AI suite

### Key Statistics
- Cumulative: 390M+ images generated, 70M+ videos
- Open-source models: 20+ models since February 2025
- Community downloads: 30M+ on HuggingFace and third-party platforms
- Model parameters: 5B (base Composer model)

### Wan 2.6 Series (Latest, December 2025)
Five models: Text-to-Video, Image-to-Video, Reference-to-Video, Image Generation, Text-to-Image

**Video Generation Upgrades:**
- **Role-Playing**: First domestic model supporting character role-playing -- reference appearance and voice
- **Multi-shot narration**: Convert simple prompts into multi-shot scripts with consistent subjects/scenes
- **Audio-sync**: Natural multi-person dialogue, voice generation, music/song generation
- **15s long video**: Up to 15s per generation (reference video: 10s)
- **Audio-driven generation**: Driven by text + audio input with multi-shot performance

**Image Generation Upgrades:**
- **Text-Image mixed output**: Integrated generation of multiple images + text with logical reasoning
- **Multi-image fusion**: Reference, combine, or replace multiple images arbitrarily
- **Commercial-grade consistency**: Consistent characters, styles, or elements
- **Aesthetic migration**: Extract color, style, composition from reference images
- **Precise lens and lighting control**: Specify perspective, distance, lighting details

**Text-to-Image Features:**
- Text generation: Charts, illustrations, poster design
- Support for Chinese/English long text content
- Accuracy in poster, infographic, information chart generation

### Previous Milestones
- **Wan 2.1**: Breakthrough in Chinese text-to-video, unlimited 1080P video codec, IC-LoRA technology
- **Open-source**: Wan 2.1 14B and 1.3B models open-sourced

### Supported Functions
- Text-to-Image (20+ styles including realistic, anime, ink painting, oil, cyberpunk)
- Image-to-Image (style transfer, similar image generation)
- Scribble-to-Image
- Virtual Model (personal photos, family portraits)
- AI Art Text
- Style Transfer
- Background Generation (e-commerce)
- Image Editing (super-resolution, declutter, smart edit)
- Video Generation, Video Editing/Extension
- API access via Alibaba Cloud Bailian platform

### Pricing Model
- **Free tier**: 50 inspiration points on registration, 50 daily from login
- Each generation costs 1 point
- API pricing via Alibaba Cloud
- Enterprise: Custom pricing, training support (LoRA, DreamBooth, fine-tuning)

### Positioning
- Strong Chinese language understanding
- No VPN/great firewall required
- Excellent at Chinese-style aesthetics (guofeng, traditional ink painting)
- Open-source strategy for developer community

---

## 9. Wenxin Yige (文心一格 - Baidu)

### Current Status (2026)

- **Developer**: Baidu
- **Launch date**: August 19, 2022 (at CCIG 2022)
- **Technology**: PaddlePaddle deep learning framework + ERNIE-ViLG (Wenxin) multimodal model
- **Architecture**: Fusion of GAN + Diffusion Model
- **Registered users**: 6M+ (as of May 2023)
- **Status**: Service merged into Wenxin Yiyan (文心一言) website on April 1, 2025

### Core Technology
- ERNIE-ViLG 2.0 cross-modal model -- one of the largest AI painting models globally by parameters
- Knowledge-enhanced: Knowledge-based prompt engineering, progressive diffusion, cross-modal matching for output ranking
- API available for developers with PaddlePaddle tools

### Supported Functions
- Text-to-Image (10+ styles: guofeng, oil painting, watercolor, anime, realistic)
- Image-to-Image
- Image Editing (expand, smudge erase, smudge edit, image stitching, clarity enhancement)
- Poster Creation
- Art Text Generation
- Lab features: Human action recognition -> creation, line art -> creation, custom models

### Pricing Model

**Free + Premium Model:**
- New users: 50 "electricity" (电量) on registration
- Daily free: Via check-in, sharing, public works
- Electricity purchase options:
  - 9.9 yuan = 80 electricity
  - 15.9 yuan = 200 electricity
  - 49.9 yuan = 800 electricity
  - 599 yuan = 10,000 electricity

**Membership Plans (post-2023):**
| Tier | Monthly | Continuous Monthly | Features |
|------|---------|-------------------|----------|
| Silver | 69 yuan | 66 yuan | AI creation, 3 concurrent groups, AI editing |
| Gold | 139 yuan | 119 yuan | 5 concurrent groups, posters, art text, AI editing |
| Platinum | 339 yuan | 299 yuan | 10 concurrent groups, priority processing |
| Union (Yige + Yiyan) | 99 yuan | - | Combined Wenxin Yiyan + Wenxin Yige access |

### Commercial Use Cases
- **JD.com**: First AI offline ad in e-commerce (618 campaign) -- production cycle from weeks to days, ~80% cost savings
- **Lianxiang (Lenovo Zhaoyang)**: AIGC brand campaign storyboard generation
- **Zhou Hei Ya**: AI packaging design competition
- **798 Art Festival**: AI painting exhibition

### 2025 Changes
- April 1, 2025: Services merged into Wenxin Yiyan (文心一言) platform
- Apple Vision Pro app launched

---

## 10. Jimeng AI (即梦AI - ByteDance)

### Current Status (2026)

- **Developer**: ByteDance (剪映/Jianying team)
- **Launch**: March 2024 (as "Dreamina"), renamed "Jimeng" May 2024
- **Web**: jimeng.jianying.com
- **Mobile**: iOS and Android App Store
- **International version**: Dreamina (dreamina.capcut.com)
- **MAU**: 10.12M (as of September 2025, QuestMobile)
- **Q2 2025 MoM growth**: 68.2%

### Latest Models (2026)

**Seedance 2.0 (Video Model - February 12, 2026):**
- Architecture: Dual-branch diffusion transformer
- Multi-modal input: image, video, audio, text
- Max: 9 images + 3 videos + 3 audio + text (12 files total)
- Max generation: 15-60 seconds video
- Multi-shot coherent video with "montage" transitions
- Audio-sync: Lip-sync, sound effects, ambient sound
- Reference: Image (composition, character), Video (camera language, complex motion)
- Real-person verification required for using personal images

**Seedream 5.0 Lite (Image Model - February 12, 2026):**
- Real-time web search capability for image generation
- Precise editing and control
- Logical reasoning for complex multi-step requirements
- Built-in vertical domain knowledge (biology, architecture)
- 2K and 4K resolution support
- 2K generation < 1.8 seconds

### Core Platform Features

**Image Creation:**
- Text-to-Image, Image-to-Image (20+ styles: surreal, portrait, anime)
- Multi-modal image editing (Seedream 4.0 from September 2025)
- Group image generation (series of related images)
- Up to 8K output resolution
- HD lossless optimization

**Video Creation:**
- Text-to-Video, Image-to-Video
- Camera control, speed adjustment, start/end frame setting
- Longest 60-second video
- Action imitation (upload person photo + reference video)
- Story creation: Script to storyboard to video
- Digital human: Lip-sync with audio

**Smart Canvas:**
- Multi-layer editing
- Local repaint, one-click expand, object removal, cutout
- AI composition fusion

**Additional Features:**
- AI Music Generation (vocals + instrumental)
- Creative community with prompt sharing
- DeepSeek integration for prompt generation

### Pricing

| Tier | Monthly | Features |
|------|---------|----------|
| Free | 0 yuan | 60-100 daily credits, basic features |
| Basic | ~79 yuan | More credits, faster generation |
| Standard | ~139 yuan | Additional features |
| Premium | ~649 yuan | High-volume, all features |

- 5s video: ~60 credits, 15s video: ~90 credits
- Credits available via daily login or direct purchase
- Annual standard: ~659 yuan/year (~55 yuan/month)

### Competitive Position
- **vs Kling**: Jimeng stronger in aesthetic output, camera flexibility, digital human lip-sync, generation speed
- **vs Midjourney**: Jimeng better for Chinese creators, fast output, local ecosystem
- **Ecosystem integration**: Deep integration with Jianying (CapCut) and Douyin (TikTok)

---

## 11. Kling AI (可灵AI - Kuaishou)

### Current Status (2026)

- **Developer**: Kuaishou (快手) AI team
- **Launch**: June 6, 2024
- **Latest model**: Kling 3.0 series (February 5, 2026)
- **Global users**: 60M+ creators
- **Videos generated**: 600M+
- **Enterprise customers**: 30,000+
- **2025 revenue**: 700M+ yuan in first 3 quarters, projected 1B+ yuan for full year

### Kling 3.0 Series (February 5, 2026)

**Models**: Kling Video 3.0, Kling Video 3.0 Omni, Kling Image 3.0, Kling Image 3.0 Omni

**Architecture**: All-in-One multi-modal architecture
- Single native architecture for text-to-video, image-to-video, reference-to-video, in-video editing
- Full multi-modal input/output (text, image, audio, video)

**Key Capabilities:**
- **Multi-shot storyboard**: Specify duration, shot size, perspective, narrative content, camera movement per shot
- **Consistency**: Character visual + voice features extracted from reference video, faithfully reproduced in new scenes
- **Photo-realistic output**: Vivid expressions, dynamic performances, realistic characters
- **Text preservation**: High-accuracy retention/generation of text in images (logos, subtitles, brand elements)
- **Native audio generation**: Multi-language, dialect, accent support
- **Max video length**: 15 seconds
- **2K and 4K output** (Image 3.0 Omni)

### Model Evolution Timeline

| Version | Date | Key Features |
|---------|------|-------------|
| 1.0 | June 2024 | Initial release, 1080p, 2min video, figure-video |
| 1.5 | 2024 | Higher quality, 1080p direct output, bug fixes |
| 1.6 | Dec 2024 | Improved motion, quality |
| 2.0 | April 2025 | Semantic response, dynamic quality, visual texture, multi-modal editing |
| 2.1 | May 2025 | Efficiency +65% cost reduction |
| 2.5 Turbo | Sep 2025 | 30% cost reduction |
| 2.6 | Dec 2025 | Audio-video sync (voice, sound effects, ambient), character voice control |
| O1 | Dec 2025 | Chain-of-thought model |
| **3.0** | **Feb 2026** | All-in-One architecture, multi-shot, Omni reference, 4K |

### Key Features by Version

**Kling 2.6 (December 2025):**
- First "audio-video sync" model
- "Text-to-Audio-Video" and "Image-to-Audio-Video" paths
- Voice control: Character-specific voice lines
- Action control: Complex movements up to 30 seconds, one-take

**Kling 2.0 (April 2025):**
- Semantic response significantly improved
- Dynamic quality leap
- Film-quality visual texture (Kling Image 2.0)
- Multi-modal video editing: Add, delete, modify elements via text/image prompts

### Competitive Position
- **vs Jimeng (ByteDance)**: Kling better in film-level quality, physics engine realism, high-frequency motion
- **vs Jimeng**: But Jimeng stronger in aesthetic output, speed, digital human lip-sync
- **vs Runway**: Direct competitor in professional video generation
- Chinese AI video generation No. 1 position claimed
- Featured at Busan International Film Festival (Sep 2025), MIPCOM Cannes (Oct 2025)

### Pricing
- Free credits + membership/point system
- Global membership: 3 tiers available
- Ultra subscription: Early access to 3.0 series

---

## 12. Tencent Hunyuan / MiniMax / Zhipu CogView

### 12.1 Tencent Hunyuan Image (腾讯混元生图)

**Platform**: Tencent Cloud (cloud.tencent.com)

**Model Versions:**
- **Hunyuan Image 3.0**: Can autonomously think about image layout, composition, brushstrokes; understands thousand-word complex semantics
- **Hunyuan Image 2.0**: Rich style diversity, excellent realism, instruction editing support
- **Hunyuan Turbo Edition**: Ultra-high compression codec, fast response, high quality

**Key Features:**
- Self-developed algorithm based on Tencent's Hunyuan LLM
- Natural language + computer vision integration
- Strong Chinese understanding from high-quality Chinese text-image training
- Eastern aesthetic bias in painting creation
- Full API support through Tencent Cloud
- Console visual editor available
- Image stylization (rich art styles)
- AI portrait photography

**Pricing**: API-based, pay-per-use via Tencent Cloud

### 12.2 MiniMax (Image-01)

**Company**: MiniMax -- Chinese AI startup, competing for "first listed AI company" with Zhipu

**Image-01 Model** (First text-to-image model):
- **Precision prompt control**: Leveraging Hailuo AI Video-01 experience
- **Visual composition**: Cinematic-level accuracy in lighting, complex scenes, artistic composition
- **Realistic rendering**: High-fidelity skin texture, natural facial expressions, product details
- **Aspect ratios**: 16:9, 4:3, 3:2, 2:3, 3:4, 9:16, 21:9
- **Batch processing**: Up to 9 images per request, 10 requests/minute
- **Pricing**: ~1/10th of comparable products ("extremely competitive")

**MCP Server (March 2026):**
- MiniMax official MCP server for Claude Desktop, Cursor, Windsurf
- Methods: text_to_audio, list_voices, voice_clone, generate_video, text_to_image

**Business Model**: Application-layer product focus (vs Zhipu's MaaS model)

### 12.3 Zhipu AI - CogView-4

**Company**: Zhipu AI (智谱) -- Chinese AI独角兽
**Funding**: 1 billion yuan (10亿) strategic financing from Hangzhou (2025)

**CogView-4** (March 4, 2025 -- Open Source Year Release #1):
- **Parameters**: 6B (60亿)
- **License**: Apache 2.0 (first image generation model under Apache 2.0)
- **Benchmark**: DPG-Bench comprehensive score #1, SOTA in open-source text-to-image

**Key Innovations:**
- **First open-source model supporting Chinese character generation** in images
- **Chinese-English dual input**: Replaced T5 with GLM-4 encoder for bilingual capability
- **Any-length prompts**: Supports arbitrarily long text descriptions
- **Any resolution**: Generates arbitrary resolution images within range (up to 2048)
- **6B parameters with relatively low hardware requirements**: ~12GB GPU minimum

**Availability:**
- GitHub: github.com/THUDM/CogView4
- Hugging Face, ModelScope for online demo
- Zhipu Qingyan (智谱清言) for cloud service
- Diffusers version already adapted and open-sourced
- Planned: ControlNet, ComfyUI, full fine-tuning tools

**Performance:**
- ~70 seconds for 1024x1024 on A800-80G (cloud)
- Slower than commercial models, but open-source advantage
- Chinese text generation quality good but error rate higher than English
- Aesthetic quality behind Midjourney, but usable as base for fine-tuning

**Zhipu's 2025 Open Source Year Strategy:**
- Multiple model releases planned across the year
- GLM-4, GLM-4-Voice, CogVideoX v1.5, CogAgent also open-sourced
- After DeepSeek open-source week, Zhipu positioning as open-source champion

---

*End of reference data. Compiled for educational/research purposes from publicly available sources as of May 2026.*
