#!/bin/bash
# 启动本地HTTP服务器脚本

cd "/Users/euniceytliu/Desktop/my first website"
echo "🚀 正在启动本地服务器..."
echo "📍 服务器地址: http://localhost:8080"
echo "📝 博客页面: http://localhost:8080/blog.html"
echo "🏠 首页: http://localhost:8080/index.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"
python3 -m http.server 8080
