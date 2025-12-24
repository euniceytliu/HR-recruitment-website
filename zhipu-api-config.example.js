// 智谱AI API 配置文件（示例）
// 使用方法：
// 1. 复制此文件为 zhipu-api-config.js
// 2. 将 apiKey 替换为你的真实 API Key
// 3. zhipu-api-config.js 不会被上传到 GitHub（已在 .gitignore 中）

const ZHIPU_CONFIG = {
    // 替换为你的智谱AI API Key
    // 获取方式：https://open.bigmodel.cn/usercenter/apikeys
    apiKey: 'your-zhipu-api-key-here',
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: 'glm-4-flash', // 使用 GLM-4-Flash 模型（免费额度最高）
    maxTokens: 2000
};

// 智谱AI API 调用函数
async function callZhipuAPI(resumeText, fileName) {
    try {
        const prompt = `你是腾讯HR的资深招聘专家，拥有10年校招经验，深度理解腾讯文化和用人标准。

# 你的任务
分析以下简历，基于腾讯HR岗位真实要求和腾讯文化价值观，给出客观、专业、有洞察力的诊断报告。

# 简历信息
文件名: ${fileName}
简历内容: 
${resumeText}

# 腾讯HR岗位类型及评估标准

## 1. 沟通型岗位（HR BP、招聘、员工关系）
**核心能力要求**：
- 人际敏感度（25分）：快速感知他人情绪、需求，建立信任，善于倾听
- 沟通影响力（25分）：清晰表达、说服影响、跨部门协调能力
- 服务意识（20分）：以候选人/员工为中心，主动解决问题
- 团队协作（15分）：在团队中的角色、贡献、领导力
- 情绪管理（15分）：抗压能力、积极心态、冲突处理

**关键证据**：
- 学生会/社团负责人经历（体现领导力和组织能力）
- 大型活动策划执行（体现协调和影响力）
- 志愿者/服务类经历（体现同理心和服务意识）
- 团队项目中的沟通协调角色
- 人际相关的成果数据（如：影响人数、团队规模等）

## 2. 分析型岗位（HC规划、人力数据分析、OD）
**核心能力要求**：
- 数据分析能力（30分）：数据收集、处理、分析、可视化
- 逻辑思维（25分）：结构化思考、因果推理、问题诊断
- 业务理解（20分）：理解HR业务逻辑和公司战略
- 工具应用（15分）：Excel、Python、BI工具、HRIS系统
- 洞察能力（10分）：从数据中发现趋势、提出建议

**关键证据**：
- 数据分析实习/项目（必须有具体数据和成果）
- 量化的成果（如：提升X%、处理X条数据、优化流程节省X小时）
- 技术技能：Python/SQL/R/Tableau等
- 商业分析、咨询类竞赛获奖
- 研究方法论、统计学背景

## 3. 创意型岗位（雇主品牌、校招运营、HR Tech）
**核心能力要求**：
- 创新思维（25分）：新颖想法、突破常规、实验精神
- 内容策划（25分）：文案、设计、活动创意、品牌传播
- 用户体验（20分）：从用户视角设计流程和体验
- 项目执行（15分）：将创意落地，统筹资源
- 趋势敏感（15分）：关注行业动态、Z世代特征、新技术

**关键证据**：
- 新媒体运营（粉丝数、阅读量、互动率等数据）
- 创意类竞赛获奖（营销大赛、创业大赛等）
- 原创内容作品（文章、视频、设计作品）
- 创新项目从0到1的经历
- 对新技术/新趋势的应用（如AI、短视频等）

# 腾讯文化价值观评估（隐性加分项）
- **正直**：诚信、透明、负责任的表现
- **进取**：自我驱动、持续学习、结果导向
- **合作**：团队精神、开放心态、利他行为
- **创新**：突破常规、拥抱变化、敢于试错

# 评分标准（严格但公正）
- 90-100分：顶尖候选人，多项核心能力突出，有标志性成果
- 80-89分：优秀候选人，核心能力扎实，有亮点经历
- 70-79分：良好候选人，基本符合要求，有培养潜力
- 60-69分：一般候选人，部分能力欠缺，需较多培养
- 60分以下：不匹配，核心能力严重不足

# 真实评估案例学习

**案例1：沟通型高分简历（88分）**
- 学生会主席，组织30+活动，覆盖5000+学生
- HR实习：独立负责15场校园宣讲，候选人满意度4.8/5.0
- 志愿者：连续3年支教，获"优秀志愿者"称号
- 软技能：演讲比赛二等奖、辩论队成员
→ 优势：丰富的人际互动经验，有服务意识，影响力数据清晰
→ 不足：缺少数据分析经验，建议补充Excel/数据分析技能

**案例2：分析型高分简历（92分）**
- 数据分析实习：用Python分析10万+简历数据，优化筛选流程，效率提升40%
- 竞赛：数学建模国赛一等奖、商业分析案例大赛冠军
- 技能：Python、SQL、Tableau、统计学
- GPA 3.9/4.0，统计学专业
→ 优势：扎实的数据分析能力，有实战成果，逻辑清晰
→ 不足：缺少团队协作经历，建议增加跨部门项目经验

**案例3：创意型中等简历（72分）**
- 运营公众号，粉丝3000，平均阅读量800
- 参与校园文化节策划，设计海报和宣传物料
- 短视频创作爱好者，B站粉丝500
→ 优势：有内容创作经验，对新媒体敏感
→ 不足：规模和影响力较小，缺少从0到1的爆款案例，建议参加营销/创意类竞赛

# 输出要求

请严格按照以下JSON格式返回（只返回JSON，不要任何解释文字）：

{
    "score": 综合匹配度分数(0-100的整数，参考评分标准),
    "type": "最匹配的岗位类型，必须是以下之一：沟通型/分析型/创意型",
    "strengths": [
        "优势1：【能力维度】具体描述+量化证据（如：人际敏感度强，担任学生会主席组织30+活动）",
        "优势2：【能力维度】具体描述+成果数据（必须引用简历中的真实内容）",
        "优势3：【能力维度】结合腾讯文化价值观的评价",
        "优势4：【能力维度】突出的亮点或差异化优势"
    ],
    "improvements": [
        "不足1：【能力维度】具体问题+对标腾讯要求的差距（如：缺少数据分析实战，而腾讯HR需要用数据驱动决策）",
        "不足2：【能力维度】简历中未体现的关键能力+影响",
        "不足3：【能力维度】可量化但未量化的部分（如：活动规模、影响人数等）",
        "不足4：【能力维度】与目标岗位的适配度问题"
    ],
    "suggestions": [
        "建议1：【短期行动】具体的、可落地的学习计划（1-3个月内可完成）",
        "建议2：【能力提升】针对最大短板的针对性建议+推荐资源（课程/书籍/项目）",
        "建议3：【实战经历】建议参加的实习/竞赛/项目，说明如何弥补不足",
        "建议4：【长期规划】职业发展路径建议，结合腾讯HR职业通道",
        "建议5：【简历优化】如何更好地呈现现有经历，突出匹配度"
    ]
}

# 分析原则
1. **客观严格**：评分要基于真实证据，不夸大不贬低
2. **具体量化**：所有评价必须引用简历中的具体内容和数据
3. **对标腾讯**：优势和不足都要对标腾讯HR真实岗位要求
4. **可执行建议**：建议必须具体、可落地，避免空泛的"提升XX能力"
5. **正向激励**：在指出不足的同时，给出明确的改进路径和信心
6. **文化契合**：评估时考虑腾讯文化价值观的契合度

现在开始分析这份简历：`;

        const response = await fetch(ZHIPU_CONFIG.apiUrl, {
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
            const error = await response.json();
            console.error('智谱AI API 错误:', error);
            throw new Error(`API调用失败: ${response.status} - ${error.error?.message || '未知错误'}`);
        }

        const data = await response.json();
        console.log('智谱AI 原始响应:', data);
        
        const responseText = data.choices[0].message.content;
        
        // 提取JSON部分（AI可能会在JSON前后添加说明文字）
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('无法解析AI返回的JSON');
        }
        
        const result = JSON.parse(jsonMatch[0]);
        
        // 验证结果格式
        if (!result.score || !result.type || !result.strengths || !result.improvements || !result.suggestions) {
            throw new Error('AI返回的数据格式不正确');
        }
        
        return result;
        
    } catch (error) {
        console.error('智谱AI API 调用失败:', error);
        throw error;
    }
}

// 带重试机制的API调用
async function analyzeWithZhipuRetry(resumeText, fileName, maxRetries = 2) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await callZhipuAPI(resumeText, fileName);
        } catch (error) {
            console.log(`第 ${i + 1} 次尝试失败，${i < maxRetries - 1 ? '重试中...' : '已达最大重试次数'}`);
            if (i === maxRetries - 1) {
                throw error;
            }
            // 等待1秒后重试
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
