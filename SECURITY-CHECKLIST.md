# 🔒 安全检查清单

## ✅ 立即执行（高优先级）

### 1. 数据库访问控制
- [ ] **已完成**: RLS 策略已启用
- [ ] **待做**: 限制匿名用户查询权限
- [ ] **待做**: 审查所有 RLS 策略，确保最小权限原则

**执行命令**（Supabase SQL Editor）：
```sql
-- 查看当前策略
SELECT * FROM pg_policies WHERE tablename = 'case_submissions';
```

---

### 2. 敏感文件保护
- [ ] **待做**: 移动调试页面到安全目录
- [ ] **待做**: 更新 .gitignore
- [ ] **待做**: 确保不部署测试文件

**执行命令**：
```bash
chmod +x protect-debug-pages.sh
./protect-debug-pages.sh
```

**需要保护的文件清单**：
- ❌ `test-*.html` - 测试页面
- ❌ `*-debug.html` - 调试页面  
- ❌ `show-phone-email.html` - 暴露敏感数据
- ❌ `check-save-status.html` - 调试工具
- ❌ `test-update-permission.html` - 权限测试

---

### 3. 查询页面安全加固
- [x] **已完成**: `case-result.html` 只查询必要字段
- [ ] **待做**: 添加频率限制（防止暴力枚举）
- [ ] **待做**: 添加验证码

---

## 📊 当前风险评估

### 高风险项（需立即处理）

#### 1. 公开的数据库访问 🔴
**风险**：任何人可以直接查询数据库  
**影响**：隐私泄露  
**解决方案**：
```sql
-- 在 Supabase SQL Editor 执行
DROP POLICY IF EXISTS "允许所有人读取案例" ON case_submissions;

CREATE POLICY "限制读取"
ON case_submissions  
FOR SELECT
TO anon
USING (false);  -- 禁止匿名直接读取
```

#### 2. 调试页面暴露 🔴
**风险**：`show-phone-email.html` 等页面显示所有数据  
**影响**：所有学生信息泄露  
**解决方案**：删除或移动这些文件

---

### 中风险项（建议处理）

#### 3. 无频率限制 🟡
**风险**：恶意用户可以暴力枚举手机号+邮箱组合  
**影响**：可能破解其他用户的评估结果  
**解决方案**：添加 Cloudflare Rate Limiting 或使用后端 API

#### 4. 无验证码 🟡
**风险**：机器人可以自动提交垃圾数据  
**影响**：数据质量下降  
**解决方案**：集成 hCaptcha 或 Google reCAPTCHA

---

### 低风险项（可选）

#### 5. ANON KEY 暴露 🟢
**风险**：前端代码包含数据库密钥  
**影响**：有限（Supabase 设计如此，RLS 提供保护）  
**解决方案**：这是 Supabase 的标准做法，确保 RLS 配置正确即可

---

## 🛡️ 三种安全方案对比

### 方案A：最小改动（适合测试环境）
**预计时间**：10 分钟  
**安全等级**：⭐⭐⭐

**步骤**：
1. 加强 RLS 策略
2. 删除调试页面
3. 限制查询字段

**优点**：快速、无需改代码  
**缺点**：仍有一定风险

---

### 方案B：中等安全（适合小规模生产）
**预计时间**：1 小时  
**安全等级**：⭐⭐⭐⭐

**步骤**：
1. 方案A的所有步骤
2. 添加 Supabase Auth
3. HR 需要登录才能评估
4. 学生使用魔法链接验证

**优点**：用户身份可验证  
**缺点**：需要用户注册/登录

---

### 方案C：企业级安全（适合大规模生产）
**预计时间**：4-8 小时  
**安全等级**：⭐⭐⭐⭐⭐

**步骤**：
1. 创建后端 API（Vercel Functions）
2. 数据库密钥移到后端
3. 添加验证码
4. 添加频率限制
5. 添加日志和监控
6. 数据脱敏

**优点**：最安全、符合企业标准  
**缺点**：需要较多开发工作

---

## 🚀 立即执行的 5 步加固（10分钟）

### 步骤1：限制数据库直接访问（3分钟）

登录 Supabase → SQL Editor → 执行：

```sql
-- 1. 删除过于宽松的策略
DROP POLICY IF EXISTS "允许所有人读取案例" ON case_submissions;

-- 2. 禁止匿名直接读取
CREATE POLICY "禁止匿名读取"
ON case_submissions
FOR SELECT
TO anon
USING (false);

-- 3. 允许认证用户读取（HR后台）
CREATE POLICY "认证用户可读"
ON case_submissions
FOR SELECT
TO authenticated
USING (true);
```

**⚠️ 注意**：这会导致 `case-result.html` 无法工作！需要配合步骤2。

---

### 步骤2：创建安全查询 API（3分钟）

创建文件：`api/query-case-secure.js`

```javascript
// 安全的案例查询 API
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, email } = req.body

  // 验证输入
  if (!phone || !email) {
    return res.status(400).json({ error: '手机号和邮箱不能为空' })
  }

  // 使用 Service Role Key（后端才有）
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY  // 后端密钥
  )

  try {
    // 查询数据，只返回必要字段
    const { data, error } = await supabase
      .from('case_submissions')
      .select('id, case_name, status, score, feedback, created_at, reviewed_at')
      .eq('phone', phone)
      .eq('email', email)
      .limit(1)
      .single()

    if (error) throw error

    // 成功返回
    return res.status(200).json(data)
  } catch (error) {
    console.error('查询失败:', error)
    return res.status(404).json({ error: '未找到匹配的案例' })
  }
}
```

---

### 步骤3：修改前端调用 API（2分钟）

修改 `case-result.html`：

```javascript
// 旧代码
const { data, error } = await supabaseClient
  .from('case_submissions')
  .select('*')
  .eq('phone', phone)
  .eq('email', email)

// 新代码
const response = await fetch('/api/query-case-secure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone, email })
})
const data = await response.json()
```

---

### 步骤4：保护调试文件（1分钟）

```bash
chmod +x protect-debug-pages.sh
./protect-debug-pages.sh
```

---

### 步骤5：验证（1分钟）

1. 测试学生查询是否正常：`case-result.html`
2. 确认调试页面已移除
3. 尝试直接访问数据库（应该被拒绝）

---

## 📝 部署前检查清单

### 代码检查
- [ ] 删除所有 `console.log` 中的敏感信息
- [ ] 删除或移动调试页面
- [ ] 确认 `.gitignore` 包含敏感文件

### 数据库检查
- [ ] RLS 策略已启用并测试
- [ ] 没有 `USING (true)` 的宽松策略
- [ ] 测试匿名用户无法直接读取数据

### API 检查
- [ ] 所有敏感操作通过后端 API
- [ ] API 有错误处理
- [ ] API 有频率限制（如果可能）

### 文件检查
- [ ] 以下文件不在部署包中：
  - `test-*.html`
  - `*-debug.html`
  - `show-*.html`
  - `check-*.html`
  - `claude-api-config.js`
  - `zhipu-api-config.js`

---

## 🆘 发现数据泄露？

### 立即执行

1. **禁用网站**（如果已部署）
```bash
# Netlify
netlify sites:delete

# Vercel  
vercel remove
```

2. **重置数据库密钥**
- 登录 Supabase Dashboard
- Settings → API → Reset anon key

3. **检查数据库日志**
- Supabase → Logs → API Logs
- 查看是否有异常访问

4. **通知用户**（如果必要）

---

## 📞 需要帮助？

如果您需要：
1. 实施任何安全方案
2. 评估当前风险
3. 紧急处理数据泄露

请告诉我您的需求！
