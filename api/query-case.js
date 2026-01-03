// 安全的案例查询 API
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, email } = req.body

  // 验证输入
  if (!phone || !email) {
    return res.status(400).json({ error: '手机号和邮箱不能为空' })
  }

  // 基本格式验证
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: '手机号格式不正确' })
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ error: '邮箱格式不正确' })
  }

  // 使用 Service Role Key（只在后端，不会暴露）
  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://gevvmjwjmpjhwczfuiru.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  )

  try {
    // 查询数据，只返回必要字段
    const { data, error } = await supabase
      .from('case_submissions')
      .select('id, case_name, status, score, feedback, created_at, reviewed_at, reviewer')
      .eq('phone', phone)
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()  // 如果没有记录，返回 null 而不是报错

    if (error) {
      console.error('查询错误:', error)
      throw error
    }

    if (!data) {
      return res.status(404).json({ error: '未找到匹配的案例记录' })
    }

    // 返回结果（不包含敏感的 phone, email, name, school）
    return res.status(200).json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('查询失败:', error)
    return res.status(500).json({ 
      error: '查询失败',
      message: error.message 
    })
  }
}
