# 模型部署

## 部署全景

```
模型训练完成 → 选择部署方案 → 监控运维
                    ↓
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     本地部署    云部署     边缘部署
     (开发测试)  (生产环境)  (移动设备)
```

## 部署方案选择

### 方案对比

| 方案 | 成本 | 性能 | 可扩展性 | 维护难度 | 适用场景 |
|------|------|------|---------|---------|---------|
| **本地部署** | 低(一次性) | 高 | 低 | 低 | 开发测试 |
| **云GPU** | 中高 | 高 | 高 | 中 | 初创公司 |
| **Kubernetes** | 中 | 高 | 很高 | 高 | 大规模生产 |
| **Serverless** | 低中 | 中 | 很高 | 低 | 波动流量 |
| **边缘部署** | 低 | 低 | 中 | 高 | 离线场景 |

### 决策流程

```
用户量 < 100?
  ├─ 是 → 本地部署 / Ollama
  └─ 否
     ↓
     需要自动扩展?
       ├─ 是 → 云服务(AWS/阿里云) + K8s
       └─ 否
          ↓
          预算充足?
            ├─ 是 → GPU云服务
            └─ 否 → Serverless / CPU推理
```

## 方案一:本地部署(Ollama)

### Ollama特点

- 🚀 一行命令启动
- 💻 Mac/Linux/Windows全平台
- 🔄 自动模型管理
- 📦 内置量化支持
- 🌐 本地API服务

### 安装和启动

```bash
# Mac/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 从 ollama.com 下载安装包

# 启动服务(自动后台运行)
ollama serve
```

### 下载和运行模型

```bash
# 下载模型(自动量化到4bit)
ollama pull qwen2.5:7b

# 运行交互式对话
ollama run qwen2.5:7b

# 指定参数
ollama run qwen2.5:7b --temperature 0.7
```

### API调用

```bash
# 启动API服务
ollama serve

# 聊天API
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5:7b",
  "messages": [
    {"role": "user", "content": "你好"}
  ]
}'

# 生成API
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "写一个Python函数"
}'
```

### Python集成

```python
import ollama

# 同步调用
response = ollama.chat(model='qwen2.5:7b', messages=[
  {'role': 'user', 'content': '解释什么是量子计算'}
])
print(response['message']['content'])

# 流式输出
for chunk in ollama.chat(
  model='qwen2.5:7b',
  messages=[{'role': 'user', 'content': '讲个故事'}],
  stream=True,
):
  print(chunk['message']['content'], end='', flush=True)
```

### 加载自定义模型

```bash
# 1. 导出GGUF模型
./quantize model.gguf model-q4_k_m.gguf Q4_K_M

# 2. 创建Modelfile
cat > Modelfile <<EOF
FROM ./model-q4_k_m.gguf
PARAMETER temperature 0.7
PARAMETER top_p 0.9
TEMPLATE """
{{- range .Messages }}
{{- if eq .Role "user" }}User: {{ .Content }}
{{- else if eq .Role "assistant" }}Assistant: {{ .Content }}
{{- end }}
{{- end }}
Assistant:
"""
EOF

# 3. 创建模型
ollama create my-model -f Modelfile

# 4. 运行
ollama run my-model
```

## 方案二:云GPU部署

### 平台选择

#### AWS SageMaker

```bash
# 1. 创建SageMaker endpoint
aws sagemaker create-endpoint \
  --endpoint-name qwen-7b-endpoint \
  --endpoint-config-name qwen-7b-config

# 2. 部署模型
from sagemaker.huggingface import HuggingFaceModel

model = HuggingFaceModel(
  model_data="s3://my-bucket/qwen-7b.tar.gz",
  role="arn:aws:iam::123456:role/SageMakerRole",
  transformers_version="4.36",
  pytorch_version="2.1",
  py_version="py310",
)

predictor = model.deploy(
  initial_instance_count=1,
  instance_type="ml.g5.2xlarge",  # GPU实例
)
```

**成本**:
- ml.g5.2xlarge: $1.516/小时
- 月成本(24×7): ~$1,100

#### 阿里云PAI-EAS

```bash
# 使用PAI-EAS部署
euserv deploy \
  --model qwen-7b \
  --instance gpu.gpu.large \
  --replicas 1
```

#### Google Cloud Vertex AI

```python
from google.cloud import aiplatform

# 部署到Vertex AI
model.upload(display_name="qwen-7b")
endpoint = endpoint.deploy(
  model=model,
  deployed_model_display_name="qwen-7b-deployed",
  machine_type="a2-highgpu-1g",
  min_replica_count=1,
  max_replica_count=5,
)
```

### Docker容器化

```dockerfile
# Dockerfile
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y python3.10 python3-pip

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY model/ /model/
COPY app.py .

EXPOSE 8000

CMD ["python3", "app.py"]
```

```python
# app.py
from fastapi import FastAPI
from transformers import AutoModelForCausalLM, AutoTokenizer

app = FastAPI()

model = AutoModelForCausalLM.from_pretrained(
    "/model",
    torch_dtype=torch.float16,
    device_map="cuda",
)
tokenizer = AutoTokenizer.from_pretrained("/model")

@app.post("/generate")
async def generate(prompt: str):
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=512)
    return {"text": tokenizer.decode(outputs[0])}
```

```bash
# 构建镜像
docker build -t qwen-7b-service .

# 运行容器
docker run --gpus all -p 8000:8000 qwen-7b-service
```

## 方案三:Kubernetes部署

### 架构设计

```
                    Load Balancer
                          ↓
                    Ingress Controller
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
    Pod 1             Pod 2             Pod 3
  (GPU Node)        (GPU Node)        (GPU Node)
```

### 部署配置

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qwen-7b-deployment
spec:
  replicas: 3  # 3个副本
  selector:
    matchLabels:
      app: qwen-7b
  template:
    metadata:
      labels:
        app: qwen-7b
    spec:
      containers:
      - name: qwen-7b
        image: your-registry/qwen-7b:latest
        resources:
          limits:
            nvidia.com/gpu: 1  # 需要GPU
          requests:
            memory: "16Gi"
            cpu: "4"
        ports:
        - containerPort: 8000
        env:
        - name: MODEL_PATH
          value: "/models/qwen-7b"
        volumeMounts:
        - name: model-storage
          mountPath: /models
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-pvc
      nodeSelector:
        accelerator: nvidia-tesla-v100  # GPU节点选择
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: qwen-7b-service
spec:
  selector:
    app: qwen-7b
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

### 自动扩展

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: qwen-7b-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: qwen-7b-deployment
  minReplicas: 1
  maxReplicas: 10  # 最多扩展到10个Pod
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # CPU超过70%时扩展
```

## 方案四:Serverless部署

### AWS Lambda + Lambda Adapter

```python
# lambda_handler.py
import json
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# 全局初始化(容器复用)
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    if model is None:
        model = AutoModelForCausalLM.from_pretrained(
            "./model",
            torch_dtype=torch.float16,
            device_map="cpu",  # Lambda只能用CPU
        )
        tokenizer = AutoTokenizer.from_pretrained("./model")

def lambda_handler(event, context):
    load_model()

    prompt = json.loads(event['body'])['prompt']

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=256)

    return {
        'statusCode': 200,
        'body': json.dumps({
            'text': tokenizer.decode(outputs[0])
        })
    }
```

### Lambda特点

**优点**:
- 按需付费,零请求时成本为0
- 自动扩展
- 无需管理服务器

**缺点**:
- 冷启动慢(首次请求1-2分钟)
- 只能CPU推理,速度慢

### Google Cloud Functions

```bash
# 部署到Cloud Functions
gcloud functions deploy qwen-7b \
  --runtime python310 \
  --memory 8GB \
  --timeout 300s \
  --source ./
```

## 方案五:边缘部署

### Android部署

```kotlin
// 使用MLC LLM
import org.mlc_llm.ChatModule

class MainActivity : AppCompatActivity() {
    private lateinit var chatModule: ChatModule

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 加载模型
        chatModule = ChatModule(
            modelBuilder = {
                modelPath = "qwen-1.5b-q4f16_1-MLC"
                quantization = "q4f16_1"
                libPath = "lib"
            }
        )

        // 生成
        lifecycleScope.launch {
            val response = chatModule.generate("你好")
            textView.text = response
        }
    }
}
```

### iOS部署

```swift
import MLCLLM

class ChatViewController: UIViewController {
    var chatModule: LLMChatModule?

    override func viewDidLoad() {
        super.viewDidLoad()

        // 初始化模型
        chatModule = LLMChatModule(
            modelPath: "qwen-1.5b-q4f16_1-MLC"
        )

        // 生成文本
        Task {
            let response = await chatModule?.generate("你好")
            textView.text = response
        }
    }
}
```

### 嵌入式设备

```c
// 使用llama.cpp
#include "llama.h"

int main() {
    // 加载模型
    llama_model_params params = llama_model_default_params();
    llama_model* model = llama_load_model_from_file(
        "qwen-1.5b-q4_k_m.gguf",
        params
    );

    // 初始化上下文
    llama_context* ctx = llama_new_context_with_model(
        model,
        llama_context_default_params()
    );

    // 生成
    const char* prompt = "你好";
    llama_tokenize(ctx, prompt, strlen(prompt), true);

    for (int i = 0; i < 256; i++) {
        llama_token token = llama_sample_token(ctx);
        printf("%s", llama_token_to_str(ctx, token));
    }

    // 清理
    llama_free(ctx);
    llama_free_model(model);

    return 0;
}
```

## 监控和日志

### Prometheus监控

```python
from prometheus_client import Counter, Histogram, generate_latest

# 定义指标
request_count = Counter(
    'llm_requests_total',
    'Total requests',
    ['model', 'status']
)

request_duration = Histogram(
    'llm_request_duration_seconds',
    'Request duration',
    ['model']
)

# 在API中使用
@app.post("/generate")
async def generate(prompt: str):
    start_time = time.time()

    try:
        output = model.generate(prompt)
        request_count.labels(model='qwen-7b', status='success').inc()
        return {"text": output}
    except Exception as e:
        request_count.labels(model='qwen-7b', status='error').inc()
        raise
    finally:
        request_duration.labels(model='qwen-7b').observe(time.time() - start_time)
```

### 日志记录

```python
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.post("/generate")
async def generate(prompt: str):
    logger.info(f"Received request: {prompt[:50]}...")

    start_time = datetime.now()
    output = model.generate(prompt)
    duration = (datetime.now() - start_time).total_seconds()

    logger.info(f"Generated {len(output)} chars in {duration:.2f}s")

    return {"text": output}
```

## 性能优化

### 连接池

```python
from concurrent.futures import ThreadPoolExecutor

class ModelPool:
    def __init__(self, model_path, pool_size=3):
        self.pool = ThreadPoolExecutor(max_workers=pool_size)
        self.models = [
            load_model(model_path) for _ in range(pool_size)
        ]
        self.current = 0

    def generate(self, prompt):
        model = self.models[self.current % len(self.models)]
        self.current += 1
        return self.pool.submit(model.generate, prompt)

# 使用
pool = ModelPool("qwen-7b", pool_size=3)
future = pool.generate("你好")
result = future.result()
```

### 缓存策略

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_generate(prompt: str) -> str:
    # 相同输入返回缓存结果
    return model.generate(prompt)

def generate_with_cache(prompt: str, use_cache: bool = True):
    if use_cache:
        # 对prompt哈希,避免特殊字符问题
        key = hashlib.md5(prompt.encode()).hexdigest()
        return cache.get(key, lambda: model.generate(prompt))
    else:
        return model.generate(prompt)
```

## 安全加固

### API认证

```python
from fastapi import HTTPException, Header

API_KEYS = {"key123", "key456"}

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key not in API_KEYS:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return x_api_key

@app.post("/generate", dependencies=[Depends(verify_api_key)])
async def generate(prompt: str):
    return {"text": model.generate(prompt)}
```

### 内容过滤

```python
def check_safety(content: str) -> bool:
    # 简单关键词过滤
    forbidden = ["暴力", "色情", "非法"]
    return not any(word in content for word in forbidden)

@app.post("/generate")
async def generate(prompt: str):
    if not check_safety(prompt):
        raise HTTPException(status_code=400, detail="Inappropriate content")

    output = model.generate(prompt)

    if not check_safety(output):
        raise HTTPException(status_code=500, detail="Model generated unsafe content")

    return {"text": output}
```

### 速率限制

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/generate")
@limiter.limit("10/minute")  # 每分钟最多10次请求
async def generate(request: Request, prompt: str):
    return {"text": model.generate(prompt)}
```

## 成本优化

### 策略对比

| 策略 | 月成本(估算) | 优点 | 缺点 |
|------|-------------|------|------|
| **本地部署** | $0(硬件) | 长期免费 | 维护复杂 |
| **预留实例** | $500-1000 | 稳定,便宜 | 资源闲置浪费 |
| **Spot实例** | $100-300 | 很便宜 | 可能被回收 |
| **Serverless** | $50-500 | 按需付费 | 冷启动慢 |

### Spot实例部署

```yaml
# 使用AWS Spot实例
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      nodeSelector:
        k8s.amazonaws.com/capacityType: SPOT  # Spot实例
```

## 常见问题

### Q1:如何选择云服务商?

**A**:
```python
# 对比维度
comparison = {
    "AWS": {
        "优势": "生态最全,稳定",
        "劣势": "价格偏高",
        "推荐": "大规模生产"
    },
    "阿里云": {
        "优势": "国内便宜,中文支持好",
        "劣势": "国际生态一般",
        "推荐": "国内业务"
    },
    "Google Cloud": {
        "优势": "AI/ML强,TPF快",
        "劣势": "市场份额小",
        "推荐": "AI应用"
    }
}
```

### Q2:如何降低部署成本?

**A**:
1. 使用量化模型(INT4)
2. 开启自动扩展,不用时缩容
3. 使用Spot/预留实例
4. 多模型共享GPU(vLLM)
5. 设置请求超时和token限制

### Q3:部署后如何监控质量?

**A**:
```python
# 收集用户反馈
feedback_data = {
    "request_id": "123",
    "prompt": "问题",
    "response": "回答",
    "user_rating": 4,  # 1-5星
    "feedback": "回答不太准确"
}

# 定期分析
weekly_report = analyze_feedback(feedback_data)
if weekly_report["avg_rating"] < 3.5:
    alert_team("Model quality degraded, consider retraining")
```

## 下一步

部署后需要持续评估:
- [模型评估](/ai-basics/08-model-training/06-evaluation) - 评估模型效果

## 参考资料

- [Ollama文档](https://ollama.com)
- [vLLM部署指南](https://docs.vllm.ai)
- [AWS SageMaker教程](https://docs.aws.amazon.com/sagemaker)
- [Kubernetes文档](https://kubernetes.io/docs)
