# Netlify Git部署指南

## 前提条件
1. 有GitHub账号
2. 代码已推送到GitHub仓库

## 部署步骤

### 1. 推送代码到GitHub

```bash
# 在GitHub上创建新仓库
# 访问 https://github.com/new
# 仓库名：my-blog
# 设为Public

# 在本地推送代码
cd "/Users/euniceytliu/Desktop/my first website"
git remote add origin https://github.com/你的用户名/my-blog.git
git push -u origin main
```

### 2. 在Netlify导入项目

1. 登录 Netlify
2. 点击 **"Add new site"** → **"Import an existing project"**
3. 选择 **GitHub**
4. 授权Netlify访问你的GitHub
5. 选择 `my-blog` 仓库
6. 配置如下：
   - **Branch to deploy**: main
   - **Build command**: (留空)
   - **Publish directory**: `.` (或留空)
7. 点击 **"Deploy site"**

### 3. 自动部署

以后每次你修改代码并推送到GitHub，Netlify会自动重新部署！

```bash
# 修改代码后
git add .
git commit -m "更新内容"
git push

# Netlify会自动检测并部署
```

## 优势

✅ 自动部署
✅ 版本控制
✅ 回滚功能
✅ 预览分支
