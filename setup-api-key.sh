#!/bin/bash

# 自动配置 Vercel 环境变量
# 配置智谱AI的API Key

echo "🔐 开始配置 Vercel 环境变量..."
echo ""

cd "/Users/euniceytliu/Desktop/my first website"

API_KEY="171e7421f0a845f4848b5817d5362ce9.UlvTUVhj2YKFxnF1"

echo "📝 配置 ZHIPU_API_KEY..."
echo "$API_KEY" | npx vercel env add ZHIPU_API_KEY production preview development

echo ""
echo "✅ API Key 配置完成！"
echo ""
echo "🚀 现在重新部署网站，让 API Key 生效..."
npx vercel --prod

echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 测试步骤："
echo "1. 访问: https://tencent-hr-website.vercel.app/diagnosis.html"
echo "2. 点击「上传简历」"
echo "3. 上传一份 Word 或 PDF 简历"
echo "4. 等待 3-5 秒，应该会看到 AI 分析报告"
echo ""
echo "🔍 如果还不行，打开浏览器按 F12 查看控制台错误信息"
echo ""
