# 🤖 AI简历分析集成指南

## 方案一：接入 Claude API（推荐）

### 📋 步骤

#### 1. 获取 Claude API Key

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册账号（支持Google、GitHub登录）
3. 进入 API Keys 页面
4. 点击 "Create Key" 创建新的API密钥
5. 复制生成的 API Key（格式：`sk-ant-api03-...`）

#### 2. 配置 API Key

打开 `claude-api-config.js` 文件，找到第5行：

```javascript
apiKey: 'sk-ant-api03-your-api-key-here',
```

替换为你的真实API Key：

```javascript
apiKey: 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
```

#### 3. 测试

1. 打开 `diagnosis.html` 页面
2. 上传一份简历（支持PDF、TXT格式）
3. 等待3-5秒
4. 查看AI生成的真实分析报告

### 💰 定价（2024年12月）

Claude 3.5 Sonnet 定价：
- **输入**：$3 / 百万tokens
- **输出**：$15 / 百万tokens

**预估成本**：
- 每份简历分析约使用 2000-3000 tokens
- **每份简历成本**：约 $0.05-0.08（约0.3-0.5元人民币）
- 每月100份简历分析：约5-8美元（约35-55元人民币）

**免费额度**：
- 新用户通常有 $5 免费额度
- 可分析约60-100份简历

### 🔒 安全提醒

⚠️ **重要**：当前配置将API Key暴露在前端，**仅适合开发测试**！

**生产环境必须**：
1. 创建后端API服务（Node.js/Python/Go等）
2. 将API Key存储在后端环境变量
3. 前端调用你的后端接口，后端再调用Claude API
4. 添加访问频率限制和用户认证

---

## 方案二：训练自己的HR招聘专用模型

### 🎯 为什么需要专用模型？

1. **成本更低**：自有模型运行成本可控
2. **数据私密**：简历数据不外传
3. **定制化强**：完全符合腾讯HR标准
4. **响应更快**：本地部署，毫秒级响应

### 📊 训练流程

#### 阶段1：数据准备（最关键）

**需要收集的数据**：

```
数据集结构：
hr-resume-dataset/
├── train/
│   ├── communication/    # 沟通型简历（500+份）
│   ├── analysis/         # 分析型简历（500+份）
│   └── creative/         # 创意型简历（500+份）
├── labels/
│   └── annotations.json  # 标注数据
└── test/
    └── ...              # 测试集（各100份）
```

**标注格式示例**：

```json
{
  "resume_id": "001",
  "file_path": "communication/resume_001.txt",
  "labels": {
    "type": "沟通型",
    "score": 85,
    "strengths": [
      "具备3年学生会主席经验",
      "组织过20+大型活动，参与人数超5000人",
      "擅长跨部门协调，沟通能力强"
    ],
    "improvements": [
      "数据分析能力较弱",
      "缺少HR实习经历"
    ],
    "reasoning": "候选人展现出色的领导力和组织协调能力，符合沟通型岗位要求"
  }
}
```

#### 阶段2：选择基座模型

**推荐方案**：

1. **方案A：微调 Llama 3（推荐）**
   - 模型：`meta-llama/Llama-3.1-8B-Instruct`
   - 优点：开源、性能好、支持中文
   - 硬件要求：24GB+ GPU（如RTX 4090）

2. **方案B：微调 Qwen（通义千问）**
   - 模型：`Qwen/Qwen2.5-7B-Instruct`
   - 优点：中文能力强、阿里开源
   - 硬件要求：16GB+ GPU

3. **方案C：微调 ChatGLM**
   - 模型：`THUDM/chatglm3-6b`
   - 优点：国产、轻量
   - 硬件要求：12GB+ GPU

#### 阶段3：微调训练

使用 **LoRA（低秩适应）** 技术进行高效微调：

```python
# 示例代码（使用Hugging Face Transformers）
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model
import torch

# 1. 加载基座模型
model_name = "meta-llama/Llama-3.1-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 2. 配置LoRA
lora_config = LoraConfig(
    r=16,  # 秩
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)

# 3. 准备训练数据
def format_prompt(resume_text):
    return f"""你是腾讯HR招聘专家。分析以下简历：

简历内容：
{resume_text}

请给出：
1. 岗位类型（沟通型/分析型/创意型）
2. 匹配度分数（0-100）
3. 核心优势（4条）
4. 需提升方向（4条）
5. 发展建议（5条）
"""

# 4. 训练（使用你标注的数据）
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./hr-model-lora",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    learning_rate=2e-4,
    save_steps=100,
    logging_steps=10
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,  # 你的数据集
    eval_dataset=eval_dataset
)

trainer.train()
```

#### 阶段4：模型部署

**部署方式**：

1. **本地部署（GPU服务器）**
   ```bash
   # 使用 vLLM 高性能推理
   pip install vllm
   
   python -m vllm.entrypoints.openai.api_server \
       --model ./hr-model-lora \
       --port 8000
   ```

2. **云端部署**
   - AWS SageMaker
   - Google Cloud Vertex AI
   - 阿里云PAI
   - 华为云ModelArts

3. **边缘部署（量化）**
   ```bash
   # 使用 llama.cpp 量化到 4-bit
   python convert.py --model ./hr-model-lora --outtype q4_0
   ```

#### 阶段5：前端集成

创建后端API：

```javascript
// backend/api.js
const express = require('express');
const app = express();

app.post('/api/analyze-resume', async (req, res) => {
    const { resumeText } = req.body;
    
    // 调用本地模型
    const response = await fetch('http://localhost:8000/v1/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'hr-model-lora',
            prompt: formatPrompt(resumeText),
            max_tokens: 1000
        })
    });
    
    const result = await response.json();
    res.json(parseResult(result));
});

app.listen(3000);
```

前端调用：

```javascript
// diagnosis.html
async function analyzeWithCustomModel(resumeText) {
    const response = await fetch('http://your-domain.com/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
    });
    
    return await response.json();
}
```

### 📈 预期效果

训练良好的专用模型可以达到：
- **准确率**：85-90%
- **响应时间**：1-3秒
- **成本**：GPU服务器约 $0.5/小时，可处理1000+份简历

### 💡 快速开始建议

**如果你是初学者**：
1. 先用 Claude API 快速验证功能
2. 收集100-200份标注数据
3. 使用 OpenAI GPT-4 fine-tuning（最简单）
4. 逐步过渡到自有模型

**如果有技术团队**：
1. 直接收集1500+份标注数据
2. 使用 Llama 3 + LoRA 微调
3. 部署在云端GPU实例
4. 实现完整的MLOps流程

---

## 🔄 当前系统架构

```
用户上传简历
    ↓
前端文件读取（PDF.js / FileReader）
    ↓
判断API配置
    ├─ 有Claude API Key → 调用Claude API
    └─ 无API Key → 智能关键词分析
    ↓
展示分析结果
```

---

## 📞 需要帮助？

- Claude API文档：https://docs.anthropic.com/
- Hugging Face文档：https://huggingface.co/docs
- LoRA训练教程：https://github.com/huggingface/peft

---

## ⚡ 快速测试 Claude API

修改 `claude-api-config.js` 后，运行测试：

```javascript
// 在浏览器控制台执行
const testResume = "姓名：张三\n学校：清华大学\n经历：学生会主席、组织20+活动";
analyzeWithClaudeRetry(testResume, "test.txt")
    .then(result => console.log('✅ Claude API 测试成功！', result))
    .catch(error => console.error('❌ 测试失败:', error));
```

