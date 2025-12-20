# Supabase数据库集成指南

## 📋 概述
本项目已集成Supabase数据库,用于存储和管理博客文章数据。

## 🚀 快速开始

### 1. 在Supabase创建项目
1. 访问 [Supabase官网](https://supabase.com)
2. 创建一个新项目
3. 等待项目初始化完成

### 2. 配置数据库

#### 方式一:使用SQL编辑器(推荐)
1. 在Supabase控制台中,进入 **SQL Editor**
2. 打开项目中的 `create-articles-table.sql` 文件
3. 复制所有SQL代码
4. 粘贴到SQL编辑器中
5. 点击 **RUN** 执行

#### 方式二:使用表编辑器
在 **Table Editor** 中手动创建 `articles` 表,包含以下字段:
- `id` (BIGSERIAL, PRIMARY KEY)
- `title` (VARCHAR(255), NOT NULL)
- `category` (VARCHAR(100))
- `excerpt` (TEXT)
- `content` (TEXT, NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)
- `slug` (VARCHAR(255), UNIQUE)
- `published` (BOOLEAN, DEFAULT true)

### 3. 获取API密钥
1. 在Supabase控制台中,进入 **Settings** → **API**
2. 复制以下信息:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)

### 4. 更新配置文件
打开 `supabase-config.js` 文件,替换为你的实际配置:

```javascript
const SUPABASE_URL = 'https://你的项目ID.supabase.co'
const SUPABASE_ANON_KEY = '你的anon-key'
```

### 5. 设置行级安全策略(RLS)

为了允许公开读取文章,需要在Supabase中设置RLS策略:

1. 在Supabase控制台,进入 **Authentication** → **Policies**
2. 选择 `articles` 表
3. 点击 **New Policy**
4. 选择 **Create a policy from scratch**
5. 配置策略:
   - Policy name: `Enable read access for all users`
   - Target roles: `anon, authenticated`
   - Policy command: `SELECT`
   - USING expression: `published = true`

或者在SQL编辑器中执行:

```sql
-- 启用RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 创建允许所有人读取已发布文章的策略
CREATE POLICY "Enable read access for all users" 
ON articles FOR SELECT 
USING (published = true);
```

## 📁 文件说明

### 核心文件
- `supabase-config.js` - Supabase配置文件(需要填入你的API密钥)
- `db-operations.js` - 数据库操作函数库
- `create-articles-table.sql` - 创建表和插入示例数据的SQL脚本

### 页面文件
- `blog.html` - 博客列表页面(从数据库读取文章列表)
- `article-detail.html` - 文章详情页面(从数据库读取文章详情)

## 🔧 主要功能

### 数据库操作函数

1. **getArticles(limit)** - 获取文章列表
   ```javascript
   const articles = await getArticles(10) // 获取最新的10篇文章
   ```

2. **getArticleById(id)** - 根据ID获取文章详情
   ```javascript
   const article = await getArticleById(1)
   ```

3. **getArticleBySlug(slug)** - 根据slug获取文章详情
   ```javascript
   const article = await getArticleBySlug('my-first-article')
   ```

4. **getArticlesByCategory(category)** - 根据分类获取文章
   ```javascript
   const articles = await getArticlesByCategory('职业发展')
   ```

## 📊 数据库表结构

### articles表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键,自增ID |
| title | VARCHAR(255) | 文章标题 |
| category | VARCHAR(100) | 文章分类 |
| excerpt | TEXT | 文章摘要 |
| content | TEXT | 文章内容(支持HTML) |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |
| slug | VARCHAR(255) | URL友好的文章标识 |
| published | BOOLEAN | 是否已发布 |

## 🎯 使用示例

### 在博客列表页显示文章
```javascript
// blog.html中已包含此代码
const articles = await getArticles()
renderArticleList(articles, 'blog-container')
```

### 显示文章详情
```javascript
// article-detail.html中已包含此代码
const article = await getArticleById(articleId)
renderArticleDetail(article)
```

## 🔒 安全说明

- 当前配置使用 `anon` key,仅允许读取已发布的文章
- 所有写操作需要在Supabase后台进行,或者配置适当的认证和授权
- 建议不要在客户端代码中执行敏感操作

## 📝 添加新文章

### 方式一:在Supabase控制台添加
1. 进入 **Table Editor**
2. 选择 `articles` 表
3. 点击 **Insert row**
4. 填写文章信息并保存

### 方式二:使用SQL
```sql
INSERT INTO articles (title, category, excerpt, content, slug) VALUES
(
  '文章标题',
  '分类',
  '文章摘要',
  '<h1>文章标题</h1><p>文章内容...</p>',
  'article-slug'
);
```

## ❓ 常见问题

### Q: 页面显示"加载失败"
A: 检查以下几点:
1. `supabase-config.js` 中的URL和Key是否正确
2. 浏览器控制台是否有错误信息
3. Supabase项目是否正常运行
4. 是否正确设置了RLS策略

### Q: 无法读取文章
A: 确保已经:
1. 创建了 `articles` 表
2. 插入了示例数据或自己的数据
3. 设置了正确的RLS策略允许公开读取

### Q: 如何修改文章
A: 在Supabase控制台的Table Editor中直接编辑,或使用SQL:
```sql
UPDATE articles 
SET title = '新标题', content = '新内容'
WHERE id = 1;
```

## 📚 更多资源

- [Supabase官方文档](https://supabase.com/docs)
- [Supabase JavaScript客户端](https://supabase.com/docs/reference/javascript)
- [行级安全策略指南](https://supabase.com/docs/guides/auth/row-level-security)
