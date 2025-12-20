// Supabase配置文件
const SUPABASE_URL = 'https://gevvmjwjmpjhwczfuiru.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I'

// 创建Supabase客户端
let supabase = null

// 初始化Supabase客户端
function initSupabase() {
  if (typeof supabase === 'undefined' || !supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabase
}
