// Claude API 配置文件（示例）
// 使用方法：
// 1. 复制此文件为 claude-api-config.js
// 2. 将 apiKey 替换为你的真实 API Key
// 3. claude-api-config.js 不会被上传到 GitHub（已在 .gitignore 中）

const CLAUDE_CONFIG = {
    // 替换为你的 Claude API Key
    // 获取方式：https://console.anthropic.com/
    apiKey: 'sk-ant-api03-your-api-key-here',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 2000
};

// Claude API 调用函数
async function callClaudeAPI(resumeText, fileName) {
    // ... 完整代码请参考 zhipu-api-config.example.js 中的结构
    // 这里省略以节省空间，实际使用时可以参考智谱AI的实现
}

// 带重试机制的API调用
async function analyzeWithClaudeRetry(resumeText, fileName, maxRetries = 2) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await callClaudeAPI(resumeText, fileName);
        } catch (error) {
            console.log(`第 ${i + 1} 次尝试失败，${i < maxRetries - 1 ? '重试中...' : '已达最大重试次数'}`);
            if (i === maxRetries - 1) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
