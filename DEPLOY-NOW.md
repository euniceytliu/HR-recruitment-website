# 🚀 快速部署腾讯HR网站到公网

## 📌 推荐方案：Vercel 命令行部署

### **步骤 1：安装 Vercel CLI**

打开终端，执行：

```bash
npm install -g vercel
```

---

### **步骤 2：登录 Vercel**

```bash
cd "/Users/euniceytliu/Desktop/my first website"
vercel login
```

会打开浏览器，选择登录方式（推荐用 GitHub）。

---

### **步骤 3：部署项目**

```bash
vercel
```

按照提示回答问题：

```
? Set up and deploy? → Y
? Which scope? → 选择你的用户名
? Link to existing project? → N（第一次）
? Project name? → tencent-hr-website
? In which directory? → 直接回车
? Override settings? → N
```

等待30秒，部署完成！

---

### **步骤 4：配置环境变量**

#### **方式 A：网页配置（推荐）**

1. 访问：https://vercel.com/dashboard
2. 进入项目 → Settings → Environment Variables
3. 添加：
   - Name: `ZHIPU_API_KEY`
   - Value: `171e7421f0a845f4848b5817d5362ce9.UlvTUVhj2YKFxnF1`
   - Environment: 全选
4. 保存

#### **方式 B：命令行配置**

```bash
vercel env add ZHIPU_API_KEY
```

输入值并选择环境。

---

### **步骤 5：重新部署（让环境变量生效）**

```bash
vercel --prod
```

---

### **步骤 6：测试功能**

访问：https://tencent-hr-website.vercel.app

测试以下功能：
- ✅ 首页加载正常
- ✅ 认知腾讯HR 文章可以点击
- ✅ 能力诊断 AI分析可用
- ✅ 面试直通卡 案例提交表单正常
- ✅ 查询结果 可以查询评估结果

---

## 🎯 部署成功后的 URL

您的网站将部署在：

**主域名：**
```
https://tencent-hr-website.vercel.app
```

**各页面 URL：**
- 首页：`/index.html`
- 认知腾讯HR：`/cognition.html`
- 能力诊断：`/diagnosis.html`
- 面试直通卡：`/application.html`
- 查询结果：`/case-result.html`
- HR管理后台：`/case-admin.html`
- AI评估后台：`/case-evaluation-ai.html`

---

## 🔧 自动部署设置

部署成功后，Vercel 会自动监听您的 GitHub 仓库：

- ✅ 每次 `git push` 到 `main` 分支 → 自动部署到生产环境
- ✅ 每次创建 Pull Request → 自动创建预览环境
- ✅ 无需手动操作，自动更新

---

## 🎨 自定义域名（可选）

如果您有自己的域名（如 `hr.example.com`）：

1. 进入 Vercel Dashboard → 项目 → Settings → Domains
2. 输入您的域名
3. 按照提示配置 DNS 记录
4. 等待生效（通常几分钟）

---

## 📊 监控和分析

Vercel 提供免费的分析功能：

- **Analytics**：查看访问量、页面性能
- **Functions**：监控 API 调用次数
- **Logs**：查看部署日志和运行日志

访问：https://vercel.com/dashboard → 选择项目 → Analytics

---

## ⚠️ 注意事项

### **1. API Key 安全**
- ✅ API Key 已存储在环境变量中（安全）
- ❌ 不要在前端代码中硬编码 API Key
- ✅ 通过后端 API 调用智谱AI

### **2. Supabase 配置**
确保 `supabase-config.js` 中的配置正确：
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_KEY = 'your-anon-key'
```

### **3. 跨域问题**
如果遇到跨域错误，检查：
- Supabase Dashboard → Settings → API → CORS allowed origins
- 添加您的 Vercel 域名：`https://tencent-hr-website.vercel.app`

---

## 🐛 故障排查

### **问题 1：部署成功但页面空白**
- 检查浏览器控制台（F12）
- 查看 Vercel 部署日志
- 确认文件路径正确

### **问题 2：AI 评估功能无法使用**
- 检查环境变量是否配置
- 重新部署：`vercel --prod`
- 查看 Vercel Functions 日志

### **问题 3：案例提交失败**
- 检查 Supabase 配置
- 确认数据库表已创建
- 检查 API 权限设置

---

## 🎉 部署成功！

现在您可以：
- ✅ 分享网站链接给朋友
- ✅ 在任何设备访问
- ✅ 所有功能正常使用
- ✅ 自动更新部署

**网站地址：** https://tencent-hr-website.vercel.app

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel 部署日志
2. 查看浏览器控制台错误
3. 随时联系我继续调试！
