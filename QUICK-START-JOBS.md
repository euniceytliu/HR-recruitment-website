# 🚀 热招岗位系统快速启动指南

## 问题诊断

如果点击"保存岗位"后，热招岗位页面没有显示岗位信息，通常是以下原因：

### 1️⃣ jobs表还未创建（最常见）

**解决方法：**

1. 访问 Supabase 控制台：https://app.supabase.com
2. 选择你的项目：`gevvmjwjmpjhwczfuiru`
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query**
5. 复制粘贴以下SQL代码：

```sql
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    requirements TEXT[],
    is_hot BOOLEAN DEFAULT FALSE,
    apply_url TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

6. 点击 **RUN** 执行

### 2️⃣ 测试数据库连接

在浏览器中打开 `test-jobs-connection.html` 文件，按照页面上的按钮逐步测试：

1. 测试Supabase连接
2. 检查jobs表是否存在
3. 获取岗位数据
4. 创建测试岗位

### 3️⃣ 检查浏览器控制台

1. 在 `jobs-admin.html` 页面按 `F12` 打开开发者工具
2. 切换到 **Console** 标签
3. 查看是否有红色错误信息
4. 常见错误及解决方法：
   - `relation "jobs" does not exist` → jobs表未创建，执行上面的SQL
   - `Failed to load jobs-db.js` → 文件路径问题，检查文件是否存在
   - `CORS error` → Supabase配置问题

## 📝 完整操作流程

### 步骤1: 创建数据库表

按照上面 1️⃣ 的说明创建jobs表

### 步骤2: 添加测试岗位

有两种方法：

**方法A: 使用测试页面（推荐）**
1. 在浏览器中打开 `test-jobs-connection.html`
2. 点击"4. 创建测试岗位"按钮
3. 如果成功，会显示"测试岗位创建成功"

**方法B: 使用管理页面**
1. 在浏览器中打开 `jobs-admin.html`
2. 填写岗位信息
3. 点击"保存岗位"

### 步骤3: 查看岗位

1. 在浏览器中打开 `jobs.html`
2. 应该能看到刚才创建的岗位信息

## 🔍 故障排除

### 问题：点击"保存岗位"后没有反应

**检查清单：**
- [ ] 浏览器控制台有没有错误信息？
- [ ] jobs表是否已创建？
- [ ] 网络请求是否成功？（查看Network标签）
- [ ] Supabase密钥是否正确？

### 问题：显示"jobs表不存在"

**解决方案：**
- 执行 `create-jobs-table.sql` 中的SQL代码
- 或者使用 `test-jobs-connection.html` 页面中提供的SQL代码

### 问题：显示"权限不足"

**解决方案：**
1. 访问 Supabase 控制台
2. 进入 Authentication → Policies
3. 确保jobs表有适当的RLS（Row Level Security）策略
4. 或者暂时禁用RLS（仅用于测试）：
   ```sql
   ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
   ```

## 📞 需要帮助？

1. 先运行 `test-jobs-connection.html` 进行诊断
2. 查看浏览器控制台的错误信息
3. 检查Supabase控制台的日志

## ✅ 成功标志

当一切正常时，你应该看到：
- `jobs-admin.html` 页面能成功添加岗位
- `jobs.html` 页面能显示岗位列表
- 浏览器控制台没有红色错误信息