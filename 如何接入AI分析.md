# 🚀 如何接入真实AI简历分析

## 📦 已为你准备好的文件

```
my first website/
├── diagnosis.html                 # 简历诊断页面（已集成AI）
├── claude-api-config.js          # Claude API 配置文件 ⭐
├── test-claude-api.html          # API测试工具 ⭐
└── AI-INTEGRATION-GUIDE.md       # 完整集成指南 ⭐
```

---

## ⚡ 快速开始（5分钟接入Claude API）

### 步骤1：获取 Claude API Key

1. 访问 https://console.anthropic.com/
2. 注册/登录账号
3. 点击 **API Keys** → **Create Key**
4. 复制生成的API Key（格式：`sk-ant-api03-...`）

### 步骤2：配置API Key

1. 打开文件：`claude-api-config.js`
2. 找到第5行：
   ```javascript
   apiKey: 'sk-ant-api03-your-api-key-here',
   ```
3. 替换为你的真实API Key：
   ```javascript
   apiKey: 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
   ```
4. 保存文件

### 步骤3：测试API

双击打开 `test-claude-api.html`，你会看到：

- ✅ API配置状态
- 📝 测试简历输入框
- 🚀 "开始测试"按钮

点击测试，如果成功会显示：
```json
{
  "score": 85,
  "type": "沟通型",
  "strengths": [...],
  "improvements": [...],
  "suggestions": [...]
}
```

### 步骤4：使用真实AI分析

打开 `diagnosis.html`，上传简历：

1. 系统会**自动检测**是否配置了Claude API
2. **有API Key** → 使用Claude进行真实AI分析（3-5秒）
3. **无API Key** → 使用智能关键词分析（即时）

---

## 💰 费用说明

### Claude API 定价

| 项目 | 价格 | 说明 |
|------|------|------|
| 输入Tokens | $3 / 百万 | 简历内容 |
| 输出Tokens | $15 / 百万 | AI分析报告 |
| **每份简历** | **约$0.05-0.08** | **约0.3-0.5元人民币** |

### 免费额度

- 新用户：**$5 免费额度**
- 可分析：**60-100份简历**
- 适合：**测试和小规模使用**

### 成本对比

| 方案 | 成本/份 | 质量 | 速度 |
|------|---------|------|------|
| Claude API | ¥0.3-0.5 | ⭐⭐⭐⭐⭐ | 3-5秒 |
| 智能关键词 | 免费 | ⭐⭐⭐ | 即时 |
| 自训练模型 | ¥0.01-0.05 | ⭐⭐⭐⭐ | 1-3秒 |

---

## 🔒 安全性说明

### ⚠️ 当前配置（开发环境）

- API Key 存储在前端 JavaScript 文件
- **风险**：任何人都能看到你的API Key
- **适用场景**：仅限本地测试

### ✅ 生产环境配置（推荐）

**必须创建后端服务**：

```
前端 → 你的后端API → Claude API
       (保护API Key)
```

**简单后端示例（Node.js）**：

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/analyze', async (req, res) => {
    const { resumeText } = req.body;
    
    // 从环境变量读取API Key（安全）
    const apiKey = process.env.CLAUDE_API_KEY;
    
    // 调用Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'content-type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            messages: [{ role: 'user', content: resumeText }]
        })
    });
    
    const data = await response.json();
    res.json(data);
});

app.listen(3000);
```

---

## 🎯 训练专用模型（长期方案）

### 为什么需要？

1. **成本降低90%**：从¥0.5/份 → ¥0.05/份
2. **数据安全**：简历不外传
3. **完全可控**：100%符合腾讯HR标准
4. **无限调用**：不受API限制

### 训练流程概览

```
1. 数据准备
   ├─ 收集1500+份标注简历
   ├─ 分类：沟通型/分析型/创意型
   └─ 标注：分数、优势、建议

2. 选择基座模型
   ├─ Llama 3 (推荐)
   ├─ Qwen (通义千问)
   └─ ChatGLM (国产)

3. LoRA微调
   ├─ 训练2-3天
   ├─ GPU: RTX 4090或云端GPU
   └─ 成本: ¥500-2000

4. 部署运行
   ├─ 云端: AWS/阿里云
   ├─ 本地: GPU服务器
   └─ 成本: ¥0.5-2/小时
```

### 详细步骤

参考 `AI-INTEGRATION-GUIDE.md` 完整文档，包含：
- 数据标注格式
- 训练代码示例
- 部署脚本
- 成本预估

---

## 📊 三种方案对比

| 维度 | Claude API | 智能关键词 | 自训练模型 |
|------|-----------|-----------|-----------|
| **开发时间** | 5分钟 | 已完成 | 2-4周 |
| **成本/份** | ¥0.3-0.5 | 免费 | ¥0.01-0.05 |
| **分析质量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **响应速度** | 3-5秒 | 即时 | 1-3秒 |
| **数据安全** | 发送到Anthropic | 本地处理 | 本地处理 |
| **可定制性** | 低 | 中 | 高 |
| **适用场景** | 快速验证 | 小规模测试 | 大规模生产 |

---

## 🎓 学习路径建议

### 阶段1：快速验证（1-2天）
- ✅ 使用Claude API
- ✅ 测试20-50份真实简历
- ✅ 收集用户反馈

### 阶段2：数据积累（1-2个月）
- 收集1000+份简历
- HR专家人工标注
- 建立评分标准

### 阶段3：模型训练（1个月）
- 学习LoRA微调技术
- 训练第一版专用模型
- A/B测试对比Claude

### 阶段4：优化迭代（持续）
- 收集badcase
- 持续优化模型
- 降低成本

---

## ❓ 常见问题

### Q1: API Key会被别人看到吗？

**开发环境**：会（存在前端代码）
**生产环境**：不会（需要建后端）

### Q2: 每月分析100份简历要多少钱？

- Claude API: ¥30-50/月
- 自训练模型: ¥50-200/月（GPU成本）

### Q3: 不会编程怎么办？

1. 使用智能关键词分析（已完成）
2. 找技术合作伙伴
3. 使用no-code平台（如Zapier + Claude）

### Q4: Claude和GPT-4选哪个？

| 维度 | Claude 3.5 Sonnet | GPT-4 Turbo |
|------|------------------|-------------|
| 价格 | $3/$15 | $10/$30 |
| 中文能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 上下文 | 200K tokens | 128K tokens |
| **推荐** | ✅ **更适合** | - |

---

## 📞 获取帮助

### 文档资源
- Claude API文档: https://docs.anthropic.com/
- Hugging Face教程: https://huggingface.co/docs/transformers

### 测试工具
- 本地测试: 打开 `test-claude-api.html`
- 在线Playground: https://console.anthropic.com/workbench

### 技术支持
- 查看浏览器控制台的错误信息
- 参考 `AI-INTEGRATION-GUIDE.md` 详细文档

---

## ✅ 下一步行动

### 立即开始（推荐）
1. ✅ 获取Claude API Key
2. ✅ 配置 `claude-api-config.js`
3. ✅ 测试 `test-claude-api.html`
4. ✅ 在 `diagnosis.html` 上传真实简历

### 长期规划
1. 收集100+份简历反馈
2. 评估是否需要自训练模型
3. 建立后端服务（生产环境）
4. 持续优化分析质量

---

**现在就开始吧！🚀**

打开 `test-claude-api.html` 测试你的第一个AI分析！
