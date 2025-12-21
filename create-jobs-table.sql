-- ========================================
-- 第一步：创建jobs表
-- ========================================
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    requirements TEXT[],
    is_hot BOOLEAN DEFAULT FALSE,
    apply_url TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 第二步：禁用RLS或设置策略（二选一）
-- ========================================

-- 选项A：完全禁用RLS（简单，适合个人网站）
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;

-- 选项B：启用RLS并设置公开访问策略（更安全）
-- 如果使用选项B，请注释掉上面的选项A，然后取消下面代码的注释：
/*
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看已发布的岗位
CREATE POLICY "允许查看已发布岗位" ON jobs
    FOR SELECT
    USING (published = true);

-- 允许所有人查看所有岗位（包括未发布的，用于管理页面）
CREATE POLICY "允许查看所有岗位" ON jobs
    FOR SELECT
    USING (true);

-- 允许所有人插入岗位
CREATE POLICY "允许插入岗位" ON jobs
    FOR INSERT
    WITH CHECK (true);

-- 允许所有人更新岗位
CREATE POLICY "允许更新岗位" ON jobs
    FOR UPDATE
    USING (true);

-- 允许所有人删除岗位
CREATE POLICY "允许删除岗位" ON jobs
    FOR DELETE
    USING (true);
*/

-- ========================================
-- 第三步：创建更新时间的触发器
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE
    ON jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ========================================
-- 第四步：插入示例数据（可选）
-- ========================================
INSERT INTO jobs (title, department, location, requirements, is_hot, apply_url) VALUES
('高级前端开发工程师', '技术工程事业群 (TEG)', '深圳/北京', ARRAY['3年以上前端开发经验', '精通 React/Vue 等主流框架', '熟悉 TypeScript、Webpack 等工具', '有大型项目经验优先'], TRUE, 'https://careers.tencent.com'),
('产品经理 (AI方向)', '云与智慧产业事业群 (CSIG)', '深圳/上海', ARRAY['5年以上产品经验，AI相关优先', '优秀的需求分析和产品设计能力', '良好的沟通协调能力', '计算机或相关专业背景'], FALSE, 'https://careers.tencent.com'),
('数据分析专家', '互动娱乐事业群 (IEG)', '深圳', ARRAY['3年以上数据分析经验', '精通 SQL、Python，熟悉机器学习', '有游戏或互联网行业经验优先', '优秀的数据洞察和业务理解能力'], TRUE, 'https://careers.tencent.com'),
('用户研究专家', '平台与内容事业群 (PCG)', '北京/深圳', ARRAY['3年以上用户研究经验', '熟练掌握定性和定量研究方法', '心理学、社会学相关专业背景', '优秀的报告撰写和演讲能力'], FALSE, 'https://careers.tencent.com'),
('后端开发工程师 (Java)', '微信事业群 (WXG)', '广州/深圳', ARRAY['3年以上 Java 开发经验', '熟悉微服务架构、分布式系统', '熟练使用 Spring Boot、MyBatis 等框架', '有高并发系统开发经验优先'], FALSE, 'https://careers.tencent.com'),
('AI算法工程师', 'AI Lab', '深圳/北京', ARRAY['硕士及以上学历，计算机相关专业', '精通深度学习框架 (TensorFlow/PyTorch)', '有 NLP/CV/推荐系统经验优先', '顶会论文发表者优先'], TRUE, 'https://careers.tencent.com');