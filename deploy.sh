#!/bin/bash

# Vercel 快速部署脚本
# 使用 npx，无需全局安装 vercel

echo "🚀 开始部署到 Vercel..."
echo ""

cd "/Users/euniceytliu/Desktop/my first website"

# 检查是否已登录
echo "📝 步骤 1/3: 登录 Vercel"
echo "浏览器会自动打开，请选择 GitHub 登录"
npx vercel login

echo ""
echo "📝 步骤 2/3: 首次部署"
echo "请按以下方式回答问题："
echo "  - Set up and deploy? → Y"
echo "  - Which scope? → 选择你的用户名（回车）"
echo "  - Link to existing project? → N"
echo "  - Project name? → 直接回车（使用默认名）"
echo "  - Directory? → 直接回车"
echo "  - Override settings? → N"
echo ""

npx vercel

echo ""
echo "⚠️  重要提示："
echo "现在需要配置环境变量（API Key）才能让 AI 功能生效！"
echo ""
echo "请访问: https://vercel.com/dashboard"
echo "1. 找到你的项目"
echo "2. 进入 Settings → Environment Variables"
echo "3. 添加环境变量："
echo "   - Name: ZHIPU_API_KEY"
echo "   - Value: 171e7421f0a845f4848b5817d5362ce9.UlvTUVhj2YKFxnF1"
echo "   - Environment: 全选"
echo "4. 点击 Save"
echo ""
echo "配置完成后，执行以下命令重新部署："
echo "  npx vercel --prod"
echo ""
