-- 创建articles表
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  excerpt TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  published BOOLEAN DEFAULT true
);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为articles表创建触发器
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据
INSERT INTO articles (title, category, excerpt, content, created_at, slug) VALUES
(
  '如何在面试中展现真实的自己',
  '职业发展',
  '在多年的招聘经验中,我发现最成功的候选人往往不是那些准备得最完美的人,而是能够真诚展现自我的人。本文将分享如何在面试中既保持专业又展现真实个性...',
  '<h1>如何在面试中展现真实的自己</h1>
<p>在多年的招聘经验中,我发现最成功的候选人往往不是那些准备得最完美的人,而是能够真诚展现自我的人。</p>
<h2>为什么真实性如此重要?</h2>
<p>真实性能够帮助建立信任,让面试官看到你真正的能力和潜力...</p>',
  '2025-01-15 00:00:00+00',
  'how-to-be-authentic-in-interviews'
),
(
  '2025年科技行业人才趋势观察',
  '人才洞察',
  '随着AI技术的快速发展,科技行业的人才需求正在发生深刻变化。本文将探讨当前最受欢迎的技能、新兴的职位类型,以及如何为未来的职业发展做好准备...',
  '<h1>2025年科技行业人才趋势观察</h1>
<p>随着AI技术的快速发展,科技行业的人才需求正在发生深刻变化...</p>',
  '2025-01-08 00:00:00+00',
  'tech-talent-trends-2025'
),
(
  '平衡工作与生活:我的时间管理心得',
  '个人成长',
  '作为一名HR,我每天都要面对大量的候选人沟通、面试安排和项目协调。如何在繁忙的工作中保持生活的平衡?这里分享我的一些实践经验...',
  '<h1>平衡工作与生活:我的时间管理心得</h1>
<p>作为一名HR,我每天都要面对大量的候选人沟通、面试安排和项目协调...</p>',
  '2024-12-28 00:00:00+00',
  'work-life-balance-tips'
),
(
  '简历优化指南:让HR眼前一亮的5个技巧',
  '职场技巧',
  '每天我会收到数百份简历,但只有少数能真正吸引我的注意。本文将从HR的视角,分享如何打造一份出色的简历,提高你的面试邀约率...',
  '<h1>简历优化指南:让HR眼前一亮的5个技巧</h1>
<p>每天我会收到数百份简历,但只有少数能真正吸引我的注意...</p>',
  '2024-12-15 00:00:00+00',
  'resume-optimization-guide'
);

-- 为常用查询创建索引
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
