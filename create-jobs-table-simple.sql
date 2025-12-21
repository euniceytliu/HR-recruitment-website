-- 创建jobs表
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

-- 禁用RLS（行级安全），允许公开访问
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;

-- 插入一个测试岗位
INSERT INTO jobs (title, department, location, requirements, is_hot, apply_url) VALUES
('测试岗位 - 高级前端工程师', '技术部', '深圳', ARRAY['3年以上前端开发经验', '精通 React/Vue', '良好的沟通能力'], TRUE, 'https://careers.tencent.com');