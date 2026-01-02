# 📊 案例提交系统部署指南（Supabase）

## 🎯 系统功能

- ✅ 学生在网站提交案例（产品链接、视频、提示词、说明文档）
- ✅ 数据自动保存到 Supabase 数据库
- ✅ 管理后台查看所有提交（实时更新）
- ✅ 可按状态、案例类型筛选
- ✅ 查看详情、评审、导出Excel

---

## 🚀 部署步骤（5分钟）

### **第 1 步：在 Supabase 创建数据表**

1. 访问你的 Supabase 项目：https://supabase.com/dashboard

2. 点击左侧 **SQL Editor**

3. 复制 `create-case-submissions-table.sql` 文件的内容

4. 粘贴到 SQL 编辑器中

5. 点击 **Run** 执行

6. 看到 "Success. No rows returned" → **数据表创建成功！**

---

### **第 2 步：配置 Vercel 环境变量（可选）**

如果你想把 Supabase 凭据存储在环境变量中（更安全）：

1. 访问 Vercel 项目设置：
   ```
   https://vercel.com/euniceytlius-projects/tencent-hr-website/settings/environment-variables
   ```

2. 添加环境变量：
   - **Name**: `SUPABASE_URL`
   - **Value**: `https://gevvmjwjmpjhwczfuiru.supabase.co`
   - **Environments**: 全选

3. 添加第二个环境变量：
   - **Name**: `SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I`
   - **Environments**: 全选

4. 点击 **Save**

---

### **第 3 步：安装依赖并部署**

在终端执行：

```bash
cd "/Users/euniceytliu/Desktop/my first website"

# 安装依赖
npm install

# 提交代码
git add .
git commit -m "✨ 集成Supabase案例提交系统"
git push origin main

# 部署到 Vercel
npx vercel --prod
```

等待约 20-30 秒，部署完成！

---

### **第 4 步：测试提交功能**

1. 访问你的网站：
   ```
   https://tencent-hr-website.vercel.app/application.html
   ```

2. 填写表单并提交测试数据

3. 看到「✅ 提交成功！提交编号：#1」→ **提交功能正常！**

---

### **第 5 步：访问管理后台**

1. 访问管理后台：
   ```
   https://tencent-hr-website.vercel.app/case-admin.html
   ```

2. 你会看到：
   - 📊 统计卡片（总提交数、待审核、评审中、已通过）
   - 🔍 筛选器（按状态、案例类型、搜索）
   - 📋 数据表格（所有提交记录）
   - 👁️ 查看详情按钮

3. 点击「查看详情」可以看到：
   - 学生基本信息
   - 产品链接、演示视频
   - AI提示词
   - 产品说明与测试结果
   - 文档下载

4. 点击「导出Excel」可以下载所有数据的CSV文件

---

## 📊 管理后台功能

### **查看提交数据**
- ✅ 实时显示所有提交
- ✅ 按时间倒序排列（最新的在最前面）
- ✅ 统计总数、待审核、评审中、已通过数量

### **筛选与搜索**
- ✅ 按状态筛选（待审核、评审中、已通过、未通过）
- ✅ 按案例类型筛选（案例一、案例二、案例三）
- ✅ 搜索姓名、邮箱、学校

### **查看详情**
- ✅ 查看学生完整提交信息
- ✅ 点击产品链接、视频链接直接访问
- ✅ 查看AI提示词和产品说明

### **导出数据**
- ✅ 一键导出所有数据为CSV文件
- ✅ 可在Excel中打开分析

---

## 🔐 数据安全说明

### **已配置的安全措施：**

1. ✅ **行级安全（RLS）**：已启用
2. ✅ **插入权限**：任何人可以提交（学生提交案例）
3. ✅ **查询权限**：任何人可以查看（管理后台查看数据）
4. ✅ **更新权限**：只有认证用户可以更新（评审功能）

### **⚠️ 重要提醒：**

目前管理后台**没有登录保护**，任何人访问链接都能看到数据！

**建议：**
- 不要公开分享管理后台链接
- 或者添加简单的密码保护（需要额外配置）

---

## 📝 后续优化建议

### **1. 文件上传功能（目前未实现）**

目前学生提交时，文档文件没有真正上传，只记录了文件名。

**实现步骤：**
1. 在 Supabase 创建 Storage Bucket
2. 前端上传文件到 Storage
3. 获取文件URL并保存到数据库

**预计时间：30分钟**

---

### **2. 评审功能**

在管理后台添加评审功能：
- 修改状态（待审核 → 评审中 → 已通过/未通过）
- 打分（0-100分）
- 填写评审反馈

**预计时间：1小时**

---

### **3. 邮件通知**

学生提交后自动发送确认邮件，评审完成后发送结果邮件。

**实现步骤：**
1. 集成邮件服务（如 Resend、SendGrid）
2. 创建邮件模板
3. 在 API 中触发邮件发送

**预计时间：1-2小时**

---

### **4. 管理后台登录保护**

添加简单的密码保护或完整的登录系统。

**简单方案（5分钟）：**
- 在 `case-admin.html` 开头添加密码验证
- 用户输入密码后才能查看数据

**完整方案（1小时）：**
- 使用 Supabase Auth 实现登录
- 只有管理员账号可以访问后台

---

## 🎯 使用流程

### **学生端：**

1. 访问网站 `/application.html`
2. 选择案例
3. 填写表单（产品链接、视频链接、提示词、说明）
4. 上传文档（可选）
5. 点击提交
6. 收到提交成功提示（显示提交编号）

### **管理端：**

1. 访问管理后台 `/case-admin.html`
2. 查看所有提交数据
3. 使用筛选器查找特定提交
4. 点击「查看详情」查看完整信息
5. 访问学生的产品链接和视频
6. 导出数据进行分析

---

## ❓ 常见问题

### **Q1: 提交后看不到数据？**

**检查步骤：**
1. 打开浏览器 F12 控制台，看是否有错误
2. 确认 Supabase 数据表已创建
3. 检查 `supabase-config.js` 中的 URL 和 Key 是否正确

---

### **Q2: 管理后台加载不出数据？**

**检查步骤：**
1. 打开浏览器 F12 控制台，看是否有错误
2. 确认 Supabase 配置正确
3. 检查 RLS 策略是否正确配置

---

### **Q3: 如何修改提交状态？**

目前需要手动在 Supabase Dashboard 中修改：
1. 访问 Supabase Dashboard
2. 进入 Table Editor
3. 找到 `case_submissions` 表
4. 点击要修改的行，编辑 `status`、`score`、`feedback` 字段

**未来优化：**在管理后台添加直接修改功能

---

## 🎉 部署完成清单

- [ ] 在 Supabase 创建数据表
- [ ] 安装依赖（`npm install`）
- [ ] 提交代码到 GitHub
- [ ] 部署到 Vercel
- [ ] 测试提交功能（提交1条测试数据）
- [ ] 访问管理后台，确认能看到数据
- [ ] 测试筛选和搜索功能
- [ ] 测试导出Excel功能

---

**全部完成后，你就有一个完整的案例提交管理系统了！** 🎊

**有任何问题随时告诉我！** 💪
