// Vercel Serverless Function: 处理案例提交
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: '只支持 POST 请求' 
        });
    }

    try {
        // 初始化 Supabase 客户端（放在函数内部）
        const supabaseUrl = process.env.SUPABASE_URL || 'https://gevvmjwjmpjhwczfuiru.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I';
        const supabase = createClient(supabaseUrl, supabaseKey);
        const {
            name,
            phone,
            email,
            school,
            case_name,
            product_url,
            video_url,
            prompts,
            summary,
            document_url,
            document_name
        } = req.body;

        // 验证必填字段
        if (!name || !phone || !email || !school || !case_name || 
            !product_url || !video_url || !prompts || !summary) {
            return res.status(400).json({
                success: false,
                error: '请填写所有必填字段'
            });
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: '邮箱格式不正确'
            });
        }

        // 验证URL格式
        try {
            new URL(product_url);
            new URL(video_url);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: '产品链接或视频链接格式不正确'
            });
        }

        // 插入数据到 Supabase
        const { data, error } = await supabase
            .from('case_submissions')
            .insert([
                {
                    name,
                    phone,
                    email,
                    school,
                    case_name,
                    product_url,
                    video_url,
                    prompts,
                    summary,
                    document_url: document_url || null,
                    document_name: document_name || null,
                    status: 'pending'
                }
            ])
            .select();

        if (error) {
            console.error('Supabase 插入错误:', error);
            return res.status(500).json({
                success: false,
                error: '提交失败，请稍后重试',
                details: error.message
            });
        }

        console.log('✅ 案例提交成功:', data[0].id);

        return res.status(200).json({
            success: true,
            message: '提交成功！我们将在5个工作日内完成评审',
            data: {
                id: data[0].id,
                created_at: data[0].created_at
            }
        });

    } catch (error) {
        console.error('❌ 提交处理错误:', error);
        return res.status(500).json({
            success: false,
            error: '服务器错误，请稍后重试',
            details: error.message
        });
    }
}
