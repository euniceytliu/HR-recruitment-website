# 🔐 HR 登录功能设置指南

## 📋 概述

HR 管理系统现在需要登录才能访问。本指南将帮助您创建 HR 账号。

---

## 🚀 快速设置（3步骤，5分钟）

### **步骤1：在 Supabase 启用邮箱认证**

1. **登录 Supabase 控制台**
   - 访问：https://supabase.com/dashboard
   - 选择您的项目：`gevvmjwjmpjhwczfuiru`

2. **进入 Authentication 设置**
   - 左侧菜单 → **Authentication**
   - 点击 **Providers** 标签

3. **确认 Email Provider 已启用**
   - 找到 **Email**
   - 确保开关是 **ON**（绿色）
   - 如果是关闭的，点击开启

---

### **步骤2：创建 HR 账号**

有两种方法创建 HR 账号：

#### **方法A：通过 Supabase 控制台（推荐）**

1. **进入 Authentication → Users**
   - 左侧菜单 → **Authentication** → **Users**

2. **点击 "Add user" 或 "Invite user"**

3. **填写 HR 账号信息**
   ```
   Email: hr@tencent.com（或您的邮箱）
   Password: 设置一个强密码（至少6位）
   ```

4. **点击 "Create user"**

5. **确认邮箱验证**
   - 如果需要邮箱验证，可以在用户列表中点击用户
   - 手动标记为 "Email confirmed"

---

#### **方法B：通过 SQL 创建（更快）**

在 **SQL Editor** 中执行：

```sql
-- 插入用户到 auth.users 表
-- 注意：这个方法需要手动生成密码哈希

-- 方法1：使用 Supabase Admin API（推荐在控制台操作）
-- 在 Authentication → Users 中创建更简单

-- 方法2：临时禁用邮箱验证（仅用于测试）
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'hr@tencent.com';
```

**推荐使用方法A（通过控制台），更简单安全。**

---

### **步骤3：测试登录**

1. **访问登录页面**
   - 本地：`http://localhost:8888/hr-login.html`
   - 线上：`https://tencent-hr-website.vercel.app/hr-login.html`

2. **输入账号信息**
   ```
   邮箱：hr@tencent.com
   密码：您设置的密码
   ```

3. **点击登录**
   - 成功后会自动跳转到 `case-evaluation-ai.html`
   - 页面右上角会显示您的邮箱和"登出"按钮

---

## 📊 登录功能说明

### **已实现的功能**

✅ **登录验证**
- 使用 Supabase Auth 进行身份验证
- 密码加密存储

✅ **会话管理**
- 登录后保持会话状态
- 刷新页面无需重新登录

✅ **访问控制**
- 未登录无法访问 HR 管理页面
- 自动跳转到登录页面

✅ **登出功能**
- 右上角显示登出按钮
- 点击后清除会话并跳转

---

## 🔒 安全性

### **当前安全级别**

| 功能 | 状态 | 说明 |
|------|------|------|
| 密码加密 | ✅ | Supabase 自动加密 |
| 会话管理 | ✅ | JWT Token |
| HTTPS | ✅ | Vercel 自动启用 |
| RLS 策略 | ✅ | 只有认证用户能操作 |

### **建议的安全增强（可选）**

1. **启用邮箱验证**
   - 在 Authentication → Settings 中配置
   - 新用户注册后需验证邮箱

2. **设置密码强度**
   - 在 Authentication → Policies 中配置
   - 要求更复杂的密码

3. **启用 MFA（多因素认证）**
   - Supabase 支持 TOTP
   - 更高的安全级别

---

## 🎯 使用流程

### **HR 工作流程**

```
1. 访问 hr-login.html
   ↓
2. 输入邮箱和密码
   ↓
3. 登录成功，跳转到 case-evaluation-ai.html
   ↓
4. 查看待审核案例列表
   ↓
5. 选择案例进行 AI 评估
   ↓
6. 保存评估结果到数据库
   ↓
7. 完成后点击"登出"
```

---

## ⚠️ 常见问题

### **Q1：忘记密码怎么办？**

**方法1：在 Supabase 控制台重置**
- Authentication → Users
- 找到用户，点击"Reset Password"
- 设置新密码

**方法2：启用找回密码功能**
- 需要配置邮件服务
- 用户可以自助重置密码

---

### **Q2：登录后立即跳转回登录页面？**

**可能原因：**
- RLS 策略问题（已修复）
- 会话未保存

**解决方案：**
- 清除浏览器缓存
- 检查 Supabase 连接

---

### **Q3：如何创建多个 HR 账号？**

重复步骤2，创建多个用户即可：
```
hr1@tencent.com
hr2@tencent.com
hr-manager@tencent.com
...
```

---

## 📝 首次设置清单

- [ ] 在 Supabase 启用邮箱认证
- [ ] 创建至少一个 HR 账号
- [ ] 测试登录功能
- [ ] 测试评估和保存功能
- [ ] 测试登出功能
- [ ] 确认 RLS 策略正确
- [ ] 部署到生产环境

---

## 🚀 下一步

### **推荐的改进（可选）**

1. **添加用户角色**
   - 普通 HR：只能评估
   - 管理员：可以管理岗位

2. **添加操作日志**
   - 记录谁评估了哪个案例
   - 审计功能

3. **添加邮件通知**
   - 评估完成后通知学生
   - HR 收到新提交时通知

---

## 📞 需要帮助？

如果遇到问题，请检查：

1. **浏览器控制台**（F12）
   - 查看错误信息

2. **Supabase 日志**
   - Dashboard → Logs
   - 查看认证失败原因

3. **RLS 策略**
   - 确认 `allow_authenticated_select` 和 `allow_authenticated_update` 存在

---

**祝您使用愉快！** 🎉
