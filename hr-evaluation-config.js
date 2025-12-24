// 腾讯HR评估标准配置文件
// 你可以随时修改这个文件来调整AI的评估逻辑

const HR_EVALUATION_CONFIG = {
    // ==================== 评分严格度配置 ====================
    scoring: {
        strictness: 'balanced',  // 选项: 'strict' (严格), 'balanced' (平衡), 'lenient' (宽松)
        
        // 各等级分数线（可调整）
        excellent: 90,    // 优秀线
        good: 80,         // 良好线
        acceptable: 70,   // 及格线
        needImprove: 60   // 需改进线
    },

    // ==================== 岗位类型权重配置 ====================
    jobTypes: {
        communication: {
            name: '沟通型',
            weights: {
                interpersonal: 25,      // 人际敏感度
                influence: 25,          // 沟通影响力
                service: 20,            // 服务意识
                teamwork: 15,           // 团队协作
                emotionalControl: 15    // 情绪管理
            }
        },
        analysis: {
            name: '分析型',
            weights: {
                dataAnalysis: 30,       // 数据分析能力
                logic: 25,              // 逻辑思维
                business: 20,           // 业务理解
                tools: 15,              // 工具应用
                insight: 10             // 洞察能力
            }
        },
        creative: {
            name: '创意型',
            weights: {
                innovation: 25,         // 创新思维
                content: 25,            // 内容策划
                userExperience: 20,     // 用户体验
                execution: 15,          // 项目执行
                trendSensitivity: 15    // 趋势敏感
            }
        }
    },

    // ==================== 腾讯文化价值观权重 ====================
    tencentValues: {
        enabled: true,  // 是否启用文化契合度评估
        weight: 10,     // 文化契合度在总分中的权重（0-20）
        dimensions: {
            integrity: '正直',      // 诚信、透明、负责任
            progress: '进取',       // 自驱、学习、结果导向
            cooperation: '合作',    // 团队、开放、利他
            innovation: '创新'      // 突破、变化、试错
        }
    },

    // ==================== 关键词加分项配置 ====================
    bonusKeywords: {
        // 顶级加分（每个+5分，最多+15分）
        tier1: [
            '腾讯', '阿里', '字节', '华为',  // 大厂实习
            '国赛一等奖', '全国冠军',         // 顶级奖项
            '万+粉丝', '10万+阅读'           // 显著影响力
        ],
        
        // 一般加分（每个+3分，最多+9分）
        tier2: [
            'HR实习', '数据分析实习', '校园大使',
            '省赛一等奖', '校级特等奖',
            'Python', 'SQL', 'Tableau',
            '学生会主席', '社团负责人'
        ],
        
        // 小加分（每个+1分，最多+3分）
        tier3: [
            'Excel', 'PPT', 'Word',
            '志愿者', '实践活动',
            'GPA 3.5+', '奖学金'
        ]
    },

    // ==================== 扣分项配置 ====================
    penalties: {
        // 严重扣分（每项-10分）
        severe: [
            '简历造假', '夸大经历', '逻辑矛盾'
        ],
        
        // 一般扣分（每项-5分）
        moderate: [
            '无实习经历', '无社团经历', '无获奖经历',
            'GPA < 3.0', '专业完全不相关'
        ],
        
        // 轻微扣分（每项-2分）
        minor: [
            '简历格式混乱', '错别字较多', '信息不完整'
        ]
    },

    // ==================== 真实评估案例库 ====================
    referenceExamples: {
        communication: {
            high: {
                score: 88,
                profile: '学生会主席 + HR实习 + 志愿者领袖',
                strengths: [
                    '组织30+大型活动，影响5000+学生',
                    'HR实习独立负责15场宣讲，满意度4.8/5',
                    '连续3年支教，获优秀志愿者称号'
                ],
                improvements: [
                    '缺少数据分析经验',
                    '对HR Tech工具了解较少'
                ]
            },
            medium: {
                score: 75,
                profile: '社团部长 + 活动策划经历',
                strengths: [
                    '社团活动组织经验丰富',
                    '有一定的沟通协调能力'
                ],
                improvements: [
                    '缺少大规模影响力证明',
                    '无HR相关实习经历',
                    '服务意识体现不足'
                ]
            }
        },
        analysis: {
            high: {
                score: 92,
                profile: '数据分析实习 + 建模竞赛获奖 + 技术栈完整',
                strengths: [
                    '用Python分析10万+数据，效率提升40%',
                    '数学建模国赛一等奖',
                    '掌握Python/SQL/Tableau全栈'
                ],
                improvements: [
                    '缺少团队协作经历',
                    '沟通影响力待提升'
                ]
            },
            medium: {
                score: 72,
                profile: '会用Excel + 有数据处理经验',
                strengths: [
                    '熟练使用Excel数据分析',
                    '有基础的逻辑思维能力'
                ],
                improvements: [
                    '缺少编程能力（Python/SQL）',
                    '无真实数据项目经验',
                    '分析深度不足'
                ]
            }
        },
        creative: {
            high: {
                score: 85,
                profile: '公众号10万+粉丝 + 营销大赛获奖',
                strengths: [
                    '公众号从0到10万粉丝，爆文阅读100万+',
                    '营销策划大赛全国冠军',
                    '短视频播放量500万+'
                ],
                improvements: [
                    '缺少HR场景的创意应用',
                    '数据分析能力较弱'
                ]
            },
            medium: {
                score: 72,
                profile: '公众号3000粉丝 + 参与活动策划',
                strengths: [
                    '有内容创作经验',
                    '对新媒体敏感'
                ],
                improvements: [
                    '影响力规模较小',
                    '缺少爆款案例',
                    '创意深度不足'
                ]
            }
        }
    },

    // ==================== 建议模板库 ====================
    suggestionTemplates: {
        dataAnalysis: [
            '短期(1-3个月)：学习Python数据分析课程（推荐：Coursera《Python for Data Analysis》）',
            '中期(3-6个月)：完成2-3个真实数据分析项目，建立作品集',
            '实战：参加数据分析类竞赛（如：阿里天池、Kaggle入门赛）',
            '认证：考取Excel MOS专家级认证或Python数据分析证书'
        ],
        communication: [
            '短期：参加演讲训练营，提升表达和影响力（推荐：Toastmasters）',
            '实战：主动承担团队中的协调角色，积累跨部门沟通经验',
            '阅读：《关键对话》《非暴力沟通》《影响力》',
            '实习：寻找HR/市场/运营类实习，积累真实场景沟通经验'
        ],
        creativity: [
            '短期：学习新媒体运营，尝试运营个人公众号/小红书/B站',
            '实战：参加营销/创意类竞赛（如：金犊奖、大广赛）',
            '工具：学习Figma/Canva等设计工具，提升视觉表达能力',
            '趋势：关注HR Tech和招聘创新案例，思考创意应用'
        ],
        hrKnowledge: [
            '系统学习HR知识体系（推荐书籍：《人力资源管理》《组织行为学》）',
            '关注腾讯HR官方账号，了解真实业务场景和行业趋势',
            '参加HR案例分析大赛，深度理解HR工作逻辑',
            '考虑考取HR相关证书（如：三级人力资源管理师、SHRM）'
        ]
    }
};

// ==================== 使用说明 ====================
/*
如何调整评估标准：

1. 调整评分严格度：
   - 修改 scoring.strictness = 'strict' / 'balanced' / 'lenient'
   - 或直接调整各等级分数线（excellent, good等）

2. 调整岗位类型权重：
   - 修改 jobTypes 中各能力维度的权重
   - 总和应为100

3. 启用/禁用文化契合度评估：
   - tencentValues.enabled = true/false
   - 调整权重 tencentValues.weight (0-20)

4. 添加自定义关键词：
   - 在 bonusKeywords 中添加你认为重要的关键词
   - 分为三档：tier1(+5分), tier2(+3分), tier3(+1分)

5. 参考真实案例：
   - referenceExamples 中存储了真实评估案例
   - AI会参考这些案例来校准评分标准
   - 你可以添加更多真实案例

6. 自定义建议模板：
   - suggestionTemplates 中可以添加更多针对性建议
   - AI会从中选择最匹配的建议

示例：
如果你想让AI更严格评分，改为：
scoring.strictness = 'strict'
scoring.excellent = 95
scoring.good = 85
scoring.acceptable = 75
*/
