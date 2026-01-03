/**
 * 自动评估器
 * 在案例提交后自动触发AI评估
 */

class AutoEvaluator {
    constructor(config) {
        this.config = config;
        this.evaluating = false;
    }

    /**
     * 前置检查：判断案例是否符合自动评估条件
     */
    passPreChecks(caseData) {
        const checks = this.config.preChecks;
        const issues = [];

        // 检查产品链接
        if (!caseData.product_url || caseData.product_url.length < checks.minUrlLength) {
            issues.push('产品链接过短或为空');
        }

        // 检查黑名单关键词
        const textToCheck = [
            caseData.product_url || '',
            caseData.prompts || '',
            caseData.summary || '',
            caseData.case_name || ''
        ].join(' ').toLowerCase();

        for (const keyword of checks.blacklistKeywords) {
            if (textToCheck.includes(keyword.toLowerCase())) {
                issues.push(`包含测试关键词: ${keyword}`);
                break;
            }
        }

        // 检查提示词长度
        if (!caseData.prompts || caseData.prompts.length < checks.minPromptsLength) {
            issues.push(`AI提示词过短 (少于${checks.minPromptsLength}字)`);
        }

        // 检查产品说明长度
        if (!caseData.summary || caseData.summary.length < checks.minSummaryLength) {
            issues.push(`产品说明过短 (少于${checks.minSummaryLength}字)`);
        }

        // 检查视频（可选）
        if (checks.requireVideo && (!caseData.video_url || caseData.video_url.length < 20)) {
            issues.push('缺少有效的演示视频链接');
        }

        // 检查文档（可选）
        if (checks.requireDocument && !caseData.document_url) {
            issues.push('缺少说明文档');
        }

        return {
            passed: issues.length === 0,
            issues: issues
        };
    }

    /**
     * 自动评估案例
     */
    async evaluateCase(caseId, caseData) {
        if (this.evaluating) {
            console.log('⚠️ 评估进行中，跳过');
            return { success: false, error: '评估进行中' };
        }

        this.evaluating = true;

        try {
            // 前置检查
            const checkResult = this.passPreChecks(caseData);
            if (!checkResult.passed) {
                console.log('❌ 前置检查未通过:', checkResult.issues);
                return {
                    success: false,
                    reason: 'pre_check_failed',
                    issues: checkResult.issues
                };
            }

            console.log('✅ 前置检查通过，开始自动评估...');

            // 延迟评估（防止重复提交）
            if (this.config.strategy.delaySeconds > 0) {
                console.log(`⏳ 延迟 ${this.config.strategy.delaySeconds} 秒后开始评估...`);
                await this.sleep(this.config.strategy.delaySeconds * 1000);
            }

            // 调用AI评估（带重试机制）
            let result = null;
            let lastError = null;

            for (let attempt = 1; attempt <= this.config.strategy.maxRetries + 1; attempt++) {
                try {
                    console.log(`🤖 第 ${attempt} 次尝试评估...`);
                    result = await this.callAIEvaluation(caseData);
                    
                    if (result) {
                        console.log('✅ AI评估成功');
                        break;
                    }
                } catch (error) {
                    lastError = error;
                    console.error(`❌ 第 ${attempt} 次评估失败:`, error.message);
                    
                    if (attempt < this.config.strategy.maxRetries + 1) {
                        console.log(`⏳ 等待 ${this.config.strategy.retryIntervalSeconds} 秒后重试...`);
                        await this.sleep(this.config.strategy.retryIntervalSeconds * 1000);
                    }
                }
            }

            if (!result) {
                throw lastError || new Error('评估失败');
            }

            // 保存评估结果到数据库
            await this.saveEvaluation(caseId, result);
            console.log('✅ 评估结果已保存');

            return {
                success: true,
                evaluation: result
            };

        } catch (error) {
            console.error('❌ 自动评估失败:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.evaluating = false;
        }
    }

    /**
     * 调用AI评估API
     */
    async callAIEvaluation(caseData) {
        // 检查AI配置
        if (typeof ZHIPU_CONFIG === 'undefined') {
            throw new Error('智谱AI配置未加载');
        }

        // 构建评估提示词（复用 case-evaluation-ai.html 的逻辑）
        const prompt = this.buildEvaluationPrompt(caseData);

        // 调用智谱AI
        const response = await fetch(ZHIPU_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: ZHIPU_CONFIG.model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: ZHIPU_CONFIG.maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.statusText}`);
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content;
        
        // 提取JSON
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI返回格式错误');
        }

        return JSON.parse(jsonMatch[0]);
    }

    /**
     * 构建评估提示词（简化版）
     */
    buildEvaluationPrompt(caseData) {
        // 这里可以复用 case-evaluation-ai.html 中的提示词逻辑
        // 为了简化，这里使用基础版本
        return `你是腾讯HR的专业案例评估专家。请严格评估以下学生提交的案例：

案例名称：${caseData.case_name}
产品链接：${caseData.product_url}
演示视频：${caseData.video_url || '未提供'}
AI提示词（${caseData.prompts.length}字）：
${caseData.prompts}

产品说明（${caseData.summary.length}字）：
${caseData.summary}

请按照JSON格式输出评估结果（包含总分、各维度得分、优势、建议等）。`;
    }

    /**
     * 保存评估结果
     */
    async saveEvaluation(caseId, evaluation) {
        const SUPABASE_URL = 'https://gevvmjwjmpjhwczfuiru.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I';

        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { error } = await supabase
            .from('case_submissions')
            .update({
                score: evaluation.totalScore,
                feedback: JSON.stringify(evaluation, null, 2),
                status: 'reviewed',
                reviewed_at: new Date().toISOString(),
                reviewer: 'AI自动评估'
            })
            .eq('id', caseId);

        if (error) {
            throw new Error(`保存失败: ${error.message}`);
        }
    }

    /**
     * 延迟函数
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoEvaluator;
}
