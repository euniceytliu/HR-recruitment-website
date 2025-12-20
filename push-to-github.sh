#!/bin/bash
# 推送代码到GitHub脚本

echo "📦 准备推送代码到GitHub..."
echo ""
echo "⚠️  请先确保你已经："
echo "1. 在 https://github.com/new 创建了新仓库"
echo "2. 仓库设置为 Public（公开）"
echo "3. 复制了仓库地址"
echo ""
read -p "请输入GitHub仓库地址（例如：https://github.com/用户名/my-blog.git）: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 错误：仓库地址不能为空"
    exit 1
fi

echo ""
echo "🔗 设置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

echo "📤 推送代码到GitHub..."
git push -u origin main

echo ""
echo "🏷️  推送标签..."
git push origin --tags

echo ""
echo "✅ 代码已成功推送到GitHub！"
echo ""
echo "📝 接下来的步骤："
echo "1. 访问 https://app.netlify.com"
echo "2. 进入你的网站控制台"
echo "3. 点击 Site settings → Build & deploy"
echo "4. 点击 Link repository"
echo "5. 选择 GitHub"
echo "6. 选择你的仓库：$(basename $REPO_URL .git)"
echo "7. 点击 Link repository 完成连接"
echo ""
echo "🎉 完成后，每次推送代码到GitHub，Netlify会自动部署！"
