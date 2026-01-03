/**
 * 自动评估配置
 * 控制案例提交后是否自动触发AI评估
 */

const AUTO_EVALUATION_CONFIG = {
    // 是否启用自动评估（true=提交即评估, false=手动评估）
    enabled: false,
    
    // 前置检查：只有通过这些检查的案例才会自动评估
    preChecks: {
        // 产品链接最小长度
        minUrlLength: 20,
        
        // AI提示词最小字数
        minPromptsLength: 100,
        
        // 产品说明最小字数
        minSummaryLength: 200,
        
        // 是否需要有效的视频链接
        requireVideo: false,
        
        // 是否需要文档
        requireDocument: false,
        
        // 黑名单关键词（包含这些词的提交不会自动评估）
        blacklistKeywords: ['test', '测试', 'demo', '示例']
    },
    
    // 评估策略
    strategy: {
        // 评估延迟（秒）- 提交后延迟评估，防止重复提交
        delaySeconds: 5,
        
        // 失败重试次数
        maxRetries: 2,
        
        // 重试间隔（秒）
        retryIntervalSeconds: 3
    },
    
    // 通知设置
    notification: {
        // 是否发送邮件通知学生
        sendEmail: false,
        
        // 是否在页面显示评估进度
        showProgress: true
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AUTO_EVALUATION_CONFIG;
}
