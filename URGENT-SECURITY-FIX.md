# 🚨 紧急安全加固指南

## ⚠️ 当前状况

**您的网站已部署到公网**：`https://tencent-hr-website.vercel.app`

**存在的严重安全问题**：
1. ❌ 任何人都可以访问 `case-result-public.html` 看到所有学生案例
2. ❌ Supabase RLS 策略过于宽松（`USING (true)`）
3. ❌ 前端代码可以直接查询数据库所有数据

---

## 🔥 立即执行（10分钟紧急修复）

### **步骤1：移除公开展示页面（1分钟）**

`case-result-public.html` 会显示所有案例，必须移除或重命名：

```bash
cd "/Users/euniceytliu/Desktop/my first website"
mv case-result-public.html debug_pages/
```

### **步骤2：加强数据库 RLS 策略（3分钟）**

登录 Supabase：https://supabase.com/dashboard/project/gevvmjwjmpjhwczfuiru

进入 SQL Editor，执行：

```sql
-- ========== 紧急安全加固 ==========

-- 1. 删除过于宽松的查询策略
DROP POLICY IF EXISTS "允许所有人读取案例" ON case_submissions;
DROP POLICY IF EXISTS "认证用户可读" ON case_submissions;

-- 2. 创建严格的策略

-- 2.1 允许提交（学生提交案例）
DROP POLICY IF EXISTS "允许提交案例" ON case_submissions;
DROP POLICY IF EXISTS "允许所有人提交案例" ON case_submissions;

CREATE POLICY "允许提交新案例"
ON case_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2.2 禁止匿名用户直接查询
CREATE POLICY "禁止匿名直接查询"
ON case_submissions
FOR SELECT
TO anon
USING (false);  -- 完全禁止前端直接SELECT

-- 2.3 只允许认证用户查询（HR后台）
CREATE POLICY "认证用户可查询所有"
ON case_submissions
FOR SELECT
TO authenticated
USING (true);

-- 2.4 只允许认证用户更新
DROP POLICY IF EXISTS "允许所有人更新案例" ON case_submissions;
DROP POLICY IF EXISTS "只能评估待审核案例" ON case_submissions;
DROP POLICY IF EXISTS "允许更新新案例的估结果" ON case_submissions;

CREATE POLICY "认证用户可更新"
ON case_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
```

**执行后效果**：
- ✅ 学生可以提交案例
- ❌ 前端 JavaScript 无法直接查询数据库
- ✅ HR 后台（认证用户）可以看到和更新所有案例

---

### **步骤3：创建安全的查询 API（6分钟）**

因为禁止了前端直接查询，需要创建一个后端 API：

#### 3.1 创建 API 文件

创建 `/api/query-case.js`：

```javascript
// 安全的案例查询 API
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, email } = req.body

  // 验证输入
  if (!phone || !email) {
    return res.status(400).json({ error: '手机号和邮箱不能为空' })
  }

  // 基本格式验证
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: '手机号格式不正确' })
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ error: '邮箱格式不正确' })
  }

  // 使用 Service Role Key（只在后端，不会暴露）
  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://gevvmjwjmpjhwczfuiru.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  )

  try {
    // 查询数据，只返回必要字段
    const { data, error } = await supabase
      .from('case_submissions')
      .select('id, case_name, status, score, feedback, created_at, reviewed_at, reviewer')
      .eq('phone', phone)
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()  // 如果没有记录，返回 null 而不是报错

    if (error) {
      console.error('查询错误:', error)
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: '未找到匹配的案例记录' })
    }

    // 返回结果（不包含敏感的 phone, email, name, school）
    return res.status(200).json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('查询失败:', error)
    return res.status(500).json({ 
      error: '查询失败',
      message: error.message 
    })
  }
}
```

#### 3.2 修改前端查询页面

修改 `case-result.html`，将直接数据库查询改为调用 API：

在 `case-result.html` 中找到 `async function queryResult()` 函数，替换为：

```javascript
async function queryResult() {
    const phone = document.getElementById('phoneInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const queryBtn = document.getElementById('queryBtn');
    const resultCard = document.getElementById('resultCard');

    // 验证输入
    if (!phone || !email) {
        alert('❌ 请输入手机号和邮箱');
        return;
    }

    // 禁用按钮，显示加载状态
    queryBtn.disabled = true;
    queryBtn.innerHTML = '⏳ 查询中...';

    try {
        // 调用后端 API（安全）
        const response = await fetch('/api/query-case', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, email })
        });

        const result = await response.json();

        if (!response.ok) {
            alert('❌ ' + (result.error || '查询失败'));
            return;
        }

        if (!result.success || !result.data) {
            alert('❌ 未找到匹配的案例记录\n\n请检查手机号和邮箱是否正确。');
            return;
        }

        // 显示结果
        displayResult(result.data);
        
        // 隐藏查询卡片，显示结果卡片
        document.getElementById('queryCard').style.display = 'none';
        resultCard.style.display = 'block';

    } catch (error) {
        console.error('查询失败:', error);
        alert('❌ 查询失败: ' + error.message);
    } finally {
        queryBtn.disabled = false;
        queryBtn.innerHTML = '🔍 查询结果';
    }
}
```

---

### **步骤4：提交并重新部署（3分钟）**

```bash
cd "/Users/euniceytliu/Desktop/my first website"

# 添加修改
git add .
git commit -m "🔒 安全加固：移除公开页面，创建安全API"

# 推送到 GitHub
git push

# 部署到 Vercel（如果已安装 Vercel CLI）
vercel --prod

# 或者让 GitHub Action 自动部署
```

---

## ✅ 执行后的效果

### **对学生：**
- ✅ 可以提交案例（`application.html`）
- ✅ 可以通过手机号+邮箱查询自己的结果（`case-result.html`）
- ❌ 无法看到其他人的案例

### **对 HR：**
- ✅ 可以在后台管理和评估案例（`case-admin.html` 和 `case-evaluation-ai.html`）
- ⚠️ 需要使用 Supabase Auth 登录（下一步骤）

### **对恶意用户：**
- ❌ 无法直接访问数据库
- ❌ 无法看到所有案例列表
- ❌ 无法暴力枚举手机号和邮箱（后续可添加频率限制）

---

## 🔍 验证安全性

### 测试1：确认前端无法直接查询

打开浏览器控制台，执行：

```javascript
const { createClient } = supabase
const client = createClient(
  'https://gevvmjwjmpjhwczfuiru.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I'
)

const { data, error } = await client
  .from('case_submissions')
  .select('*')

console.log({ data, error })
```

**预期结果**：`data` 应该是 `[]` 或 `null`，`error` 可能提示权限不足。

---

### 测试2：确认 API 查询正常

```bash
curl -X POST https://tencent-hr-website.vercel.app/api/query-case \
  -H "Content-Type: application/json" \
  -d '{"phone":"18612596585","email":"euniceytliu@tencent.com"}'
```

**预期结果**：返回案例数据（不包含敏感字段）

---

### 测试3：确认公开页面已移除

访问：`https://tencent-hr-website.vercel.app/case-result-public.html`

**预期结果**：404 Not Found

---

## 📋 下一步（可选，但强烈推荐）

### 1. 添加频率限制（防止暴力破解）

使用 Vercel 的 Edge Config 或 Upstash Redis

### 2. 添加验证码

集成 hCaptcha 或 Google reCAPTCHA

### 3. 为 HR 添加登录

使用 Supabase Auth，HR 需要登录后才能访问后台

### 4. 数据脱敏

在返回数据时，脱敏显示手机号和邮箱

---

## 🆘 遇到问题？

### 问题1：API 返回 500 错误

**原因**：可能是 Supabase Service Role Key 未配置

**解决**：在 Vercel 项目设置中添加环境变量：
- `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`

在 Supabase Dashboard → Settings → API → service_role key 找到。

---

### 问题2：学生查询显示"未找到记录"

**原因**：数据库中该手机号+邮箱组合不存在

**解决**：让学生确认输入的信息与提交时一致

---

### 问题3：HR 后台无法更新案例

**原因**：HR 没有使用认证用户身份

**解决**：需要集成 Supabase Auth（详见下一步指南）

---

## 📞 联系支持

如果执行过程中遇到任何问题，请提供：
1. 执行到哪一步
2. 错误信息截图
3. 浏览器控制台日志

我会立即帮您解决！
