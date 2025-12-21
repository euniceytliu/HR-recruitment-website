# 📝 如何更新热招岗位

## 快速指南

热招岗位页面位于 `jobs.html` 文件中，你可以轻松手动更新岗位信息。

## 🔄 更新岗位步骤

### 1. 打开文件
用任何文本编辑器打开 `jobs.html` 文件（推荐使用 VS Code 或记事本）

### 2. 找到岗位卡片区域
搜索 `<!-- 岗位列表 -->` 或 `jobs-container`，你会看到类似这样的代码：

```html
<div class="job-card hot">
    <div class="job-badge">🔥 热招</div>
    <h3 class="job-title">高级前端开发工程师</h3>
    <div class="job-info">
        <span class="job-dept">📍 技术工程事业群 (TEG)</span>
        <span class="job-location">📌 深圳/北京</span>
    </div>
    <div class="job-requirements">
        <h4>岗位要求：</h4>
        <ul>
            <li>3年以上前端开发经验</li>
            <li>精通 React/Vue 等主流框架</li>
            <li>熟悉 TypeScript、Webpack 等工具</li>
            <li>有大型项目经验优先</li>
        </ul>
    </div>
    <a href="https://careers.tencent.com" class="apply-btn" target="_blank">立即申请 →</a>
</div>
```

### 3. 修改内容

#### 修改岗位标题
```html
<h3 class="job-title">改成你的岗位名称</h3>
```

#### 修改部门和地点
```html
<span class="job-dept">📍 你的部门名称</span>
<span class="job-location">📌 你的工作地点</span>
```

#### 修改岗位要求
```html
<li>第一个要求</li>
<li>第二个要求</li>
<li>第三个要求</li>
```

#### 修改申请链接
```html
<a href="你的申请链接" class="apply-btn" target="_blank">立即申请 →</a>
```

### 4. 添加"热招"标签

如果想让某个岗位显示 🔥 热招标签：

1. 在 `<div class="job-card">` 中添加 `hot` 类：
   ```html
   <div class="job-card hot">
   ```

2. 在岗位标题前添加徽章：
   ```html
   <div class="job-badge">🔥 热招</div>
   ```

### 5. 添加新岗位

复制整个岗位卡片代码块（从 `<div class="job-card">` 到 `</div>`），粘贴到岗位列表中，然后修改内容。

### 6. 删除岗位

删除整个岗位卡片代码块即可。

## 💡 小技巧

1. **保持一致性**：所有岗位卡片结构应该相同
2. **使用表情符号**：让页面更生动（📍 📌 🔥 💼 等）
3. **控制岗位数量**：建议保持 4-8 个岗位，太多会让页面过长
4. **及时更新**：定期删除已招满的岗位，添加新的机会

## 🚀 更新后重新部署

修改完成后，重新上传到 Netlify：
1. 访问 https://app.netlify.com
2. 找到你的网站
3. 点击 "Deploys"
4. 拖拽整个文件夹重新上传

## 📞 需要帮助？

如果遇到问题，可以：
- 检查 HTML 标签是否正确闭合
- 确保引号使用正确（推荐使用双引号 ""）
- 保存文件后用浏览器打开预览效果
