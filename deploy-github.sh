#!/bin/bash
# GitHub Pages 部署脚本

echo "📦 准备部署到 GitHub Pages..."

# 1. 在GitHub上创建仓库（如果还没有）
echo "请先在 GitHub 上创建一个新仓库，名称如：my-blog"
echo "然后复制仓库地址，例如：https://github.com/你的用户名/my-blog.git"
echo ""
read -p "请输入GitHub仓库地址: " REPO_URL

# 2. 添加远程仓库
git remote add origin $REPO_URL

# 3. 推送代码
echo "🚀 推送代码到GitHub..."
git push -u origin main
git push origin 博客-v1.0.0

# 4. 启用GitHub Pages
echo ""
echo "✅ 代码已推送到GitHub"
echo ""
echo "📝 接下来请手动完成以下步骤："
echo "1. 访问你的GitHub仓库"
echo "2. 点击 Settings（设置）"
echo "3. 在左侧菜单找到 Pages"
echo "4. 在 Source 下选择 main 分支"
echo "5. 点击 Save"
echo ""
echo "🎉 几分钟后，你的网站将在以下地址访问："
echo "   https://你的用户名.github.io/仓库名/"
