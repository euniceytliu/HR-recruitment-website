# 🚀 Vercel 部署指南（后端 API 版）

## 📋 概述

本指南将帮你部署带有后端 API 的网站到 Vercel，实现**线上 AI 简历分析功能**。

### ✅ 部署后效果

- 🌐 **线上网站可访问**：https://你的域名.vercel.app
- 🤖 **AI 简历分析可用**：线上用户也能使用真实 AI 分析
- 🔒 **API Key 安全**：API Key 存储在 Vercel 环境变量，不会泄露
- ⚡ **访问速度快**：Vercel CDN 全球加速

---

## 🎯 部署步骤

### **步骤 1：安装 Vercel CLI**

打开终端，执行：

```bash
npm install -g vercel
```

或者如果你用的是 pnpm：

```bash
pnpm add -g vercel
```

---

### **步骤 2：登录 Vercel**

在项目目录执行：

```bash
cd "/Users/euniceytliu/Desktop/my first website"
vercel login
```

会打开浏览器，选择登录方式：
- GitHub（推荐）
- GitLab
- Bitbucket
- Email

登录成功后，终端会显示 ✅ Success!

---

### **步骤 3：首次部署**

在项目目录执行：

```bash
vercel
```

会出现以下问题，按提示操作：

```
? Set up and deploy "~/Desktop/my first website"? [Y/n] 
→ 输入 Y

? Which scope do you want to deploy to? 
→ 选择你的用户名（用方向键选择，回车确认）

? Link to existing project? [y/N] 
→ 输入 N（第一次部署）

? What's your project's name? 
→ 输入：tencent-hr-website（或其他你喜欢的名字）

? In which directory is your code located? 
→ 直接回车（使用当前目录）

? Want to override the settings? [y/N]
→ 输入 N
```

然后 Vercel 会开始部署，大约 30 秒后会显示：

```
✅  Production: https://tencent-hr-website.vercel.app [复制的部署地址]
```

**⚠️ 注意**：此时部署成功了，但 AI 功能还不能用！需要继续配置环境变量。

---

### **步骤 4：配置环境变量（关键！）**

#### **方式 1：通过 Vercel Dashboard（推荐，可视化）**

1. 访问 https://vercel.com/dashboard
2. 找到你的项目（tencent-hr-website）
3. 点击进入项目
4. 点击顶部 **Settings** 选项卡
5. 左侧菜单选择 **Environment Variables**
6. 添加环境变量：
   - **Name**: `ZHIPU_API_KEY`
   - **Value**: `171e7421f0a845f4848b5817d5362ce9.UlvTUVhj2YKFxnF1`（你的真实 API Key）
   - **Environment**: 勾选 **Production**, **Preview**, **Development**
7. 点击 **Save** 保存

#### **方式 2：通过命令行**

```bash
vercel env add ZHIPU_API_KEY
```

然后输入你的 API Key：

```
What's the value of ZHIPU_API_KEY?
→ 粘贴：171e7421f0a845f4848b5817d5362ce9.UlvTUVhj2YKFxnF1

Add ZHIPU_API_KEY to which Environments?
→ 选择 Production, Preview, Development（空格选择，回车确认）
```

---

### **步骤 5：重新部署（让环境变量生效）**

配置完环境变量后，需要重新部署：

```bash
vercel --prod
```

等待部署完成，会显示新的部署地址：

```
✅  Production: https://tencent-hr-website.vercel.app
```

---

### **步骤 6：测试 AI 功能**

1. 访问你的网站：https://你的域名.vercel.app
2. 点击「简历诊断」页面
3. 上传一份简历测试
4. 如果看到 AI 分析结果（3-5秒内返回），说明部署成功！✅

---

## 🔍 故障排查

### **问题 1：AI 分析失败，返回「API Key 未配置」**

**原因**：环境变量没有正确配置

**解决方法**：
1. 检查 Vercel Dashboard → Settings → Environment Variables
2. 确认 `ZHIPU_API_KEY` 存在且值正确
3. 重新部署：`vercel --prod`

---

### **问题 2：部署成功但 AI 分析速度很慢**

**原因**：智谱 AI 可能响应较慢，或 Vercel Serverless Function 冷启动

**解决方法**：
- 第一次调用会慢（冷启动），后续会快
- 可以考虑升级智谱 AI 套餐
- 或者改用其他 AI 服务（Claude API）

---

### **问题 3：本地测试后端 API**

如果想在本地测试后端 API：

```bash
vercel dev
```

然后访问 http://localhost:3000/diagnosis.html

---

## 📊 部署架构

```
用户浏览器
    ↓
Vercel CDN (静态文件: HTML/CSS/JS)
    ↓
用户上传简历 → diagnosis.html
    ↓
调用后端 API: /api/analyze-resume
    ↓
Vercel Serverless Function (analyze-resume.js)
    ↓
读取环境变量 ZHIPU_API_KEY
    ↓
调用智谱AI API
    ↓
返回分析结果给前端
    ↓
展示诊断报告
```

---

## 🎯 优势总结

| 对比项 | 之前（前端直接调用） | 现在（后端 API） |
|--------|---------------------|------------------|
| **API Key 安全性** | ❌ 暴露在前端代码 | ✅ 存储在服务器环境变量 |
| **线上可用性** | ❌ 线上无法使用 AI | ✅ 线上可以使用 AI |
| **访问控制** | ❌ 任何人都能盗用 Key | ✅ 可以添加访问限制 |
| **成本控制** | ❌ 无法限制调用次数 | ✅ 可以监控和限制 |
| **用户体验** | ⚠️ 本地才能用 AI | ✅ 任何地方都能用 |

---

## 🚀 后续优化建议

### **1. 添加 API 调用限流**

防止恶意用户大量调用 API：

```javascript
// 在 api/analyze-resume.js 中添加
const rateLimit = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimit.get(ip) || [];
    const recentRequests = userRequests.filter(time => now - time < 60000); // 1分钟内
    
    if (recentRequests.length >= 5) {
        throw new Error('请求过于频繁，请稍后再试');
    }
    
    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);
}
```

### **2. 添加访问密码保护**

只允许特定用户使用：

```javascript
// 在 api/analyze-resume.js 中添加
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD;

if (req.body.password !== ACCESS_PASSWORD) {
    return res.status(403).json({ error: '访问密码错误' });
}
```

### **3. 监控 API 使用情况**

在 Vercel Dashboard 查看：
- Functions → 查看调用次数
- Analytics → 查看流量统计

---

## ✅ 部署检查清单

- [ ] 安装了 Vercel CLI
- [ ] 登录了 Vercel 账号
- [ ] 执行了 `vercel` 完成首次部署
- [ ] 在 Vercel Dashboard 配置了 `ZHIPU_API_KEY` 环境变量
- [ ] 执行了 `vercel --prod` 重新部署
- [ ] 测试了线上网站的 AI 简历分析功能
- [ ] AI 分析成功返回结果

---

## 📞 需要帮助？

如果遇到问题：

1. 查看 Vercel 部署日志：
   ```bash
   vercel logs
   ```

2. 查看浏览器控制台错误：
   - F12 打开开发者工具
   - 查看 Console 和 Network 选项卡

3. 联系我继续帮你调试！

---

**祝部署成功！🎉**
