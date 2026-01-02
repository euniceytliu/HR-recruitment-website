-- 创建案例提交表
CREATE TABLE IF NOT EXISTS case_submissions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- 学生基本信息
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    school TEXT NOT NULL,
    
    -- 案例信息
    case_name TEXT NOT NULL,
    product_url TEXT NOT NULL,
    video_url TEXT NOT NULL,
    
    -- 核心内容
    prompts TEXT NOT NULL,
    summary TEXT NOT NULL,
    
    -- 文件信息
    document_url TEXT,
    document_name TEXT,
    
    -- 状态管理
    status TEXT DEFAULT 'pending', -- pending(待审核), reviewing(评审中), approved(通过), rejected(未通过)
    score INTEGER, -- 评分（0-100）
    feedback TEXT, -- 评审反馈
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_case_submissions_status ON case_submissions(status);
CREATE INDEX IF NOT EXISTS idx_case_submissions_created_at ON case_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_submissions_email ON case_submissions(email);

-- 添加注释
COMMENT ON TABLE case_submissions IS '案例挑战提交记录';
COMMENT ON COLUMN case_submissions.name IS '学生姓名';
COMMENT ON COLUMN case_submissions.phone IS '联系电话';
COMMENT ON COLUMN case_submissions.email IS '邮箱';
COMMENT ON COLUMN case_submissions.school IS '学校及专业';
COMMENT ON COLUMN case_submissions.case_name IS '选择的案例';
COMMENT ON COLUMN case_submissions.product_url IS '产品链接';
COMMENT ON COLUMN case_submissions.video_url IS '演示视频链接';
COMMENT ON COLUMN case_submissions.prompts IS 'AI提示词';
COMMENT ON COLUMN case_submissions.summary IS '产品说明与测试结果';
COMMENT ON COLUMN case_submissions.document_url IS '文档URL';
COMMENT ON COLUMN case_submissions.document_name IS '文档文件名';
COMMENT ON COLUMN case_submissions.status IS '状态：pending/reviewing/approved/rejected';
COMMENT ON COLUMN case_submissions.score IS '评分（0-100分）';
COMMENT ON COLUMN case_submissions.feedback IS '评审反馈';
COMMENT ON COLUMN case_submissions.reviewed_at IS '评审时间';
COMMENT ON COLUMN case_submissions.reviewer IS '评审人';

-- 启用行级安全（RLS）
ALTER TABLE case_submissions ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许任何人插入数据（学生提交）
CREATE POLICY "允许提交案例" ON case_submissions
    FOR INSERT
    WITH CHECK (true);

-- 创建策略：允许任何人查看自己的提交（通过邮箱）
CREATE POLICY "查看自己的提交" ON case_submissions
    FOR SELECT
    USING (true);

-- 创建策略：只有认证用户可以更新（评审）
CREATE POLICY "管理员可更新" ON case_submissions
    FOR UPDATE
    USING (auth.role() = 'authenticated');
