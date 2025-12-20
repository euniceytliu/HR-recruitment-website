// 数据库操作函数

/**
 * 获取所有文章列表(按创建时间倒序)
 * @param {number} limit - 限制返回的文章数量
 * @returns {Promise<Array>} 文章列表
 */
async function getArticles(limit = 100) {
  try {
    console.log('📡 正在初始化Supabase客户端...')
    const supabase = initSupabase()
    console.log('✓ Supabase客户端初始化成功')
    
    console.log('📡 正在查询articles表...')
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, excerpt, created_at, slug')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ 获取文章列表失败:', error)
      console.error('错误详情:', JSON.stringify(error, null, 2))
      return []
    }

    console.log('✓ 成功获取文章:', data ? data.length : 0, '篇')
    return data || []
  } catch (err) {
    console.error('❌ 获取文章列表异常:', err)
    console.error('异常堆栈:', err.stack)
    return []
  }
}

/**
 * 根据ID获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise<Object|null>} 文章详情
 */
async function getArticleById(id) {
  try {
    const supabase = initSupabase()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single()

    if (error) {
      console.error('获取文章详情失败:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('获取文章详情异常:', err)
    return null
  }
}

/**
 * 根据slug获取文章详情
 * @param {string} slug - 文章slug
 * @returns {Promise<Object|null>} 文章详情
 */
async function getArticleBySlug(slug) {
  try {
    const supabase = initSupabase()
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('获取文章详情失败:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('获取文章详情异常:', err)
    return null
  }
}

/**
 * 根据分类获取文章列表
 * @param {string} category - 文章分类
 * @returns {Promise<Array>} 文章列表
 */
async function getArticlesByCategory(category) {
  try {
    const supabase = initSupabase()
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, excerpt, created_at, slug')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取分类文章列表失败:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('获取分类文章列表异常:', err)
    return []
  }
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 渲染文章列表到页面
 * @param {Array} articles - 文章数组
 * @param {string} containerId - 容器元素ID
 */
function renderArticleList(articles, containerId = 'blog-container') {
  const container = document.querySelector(`.${containerId}`)
  if (!container) {
    console.error('未找到容器元素:', containerId)
    return
  }

  if (!articles || articles.length === 0) {
    container.innerHTML = '<p class="no-articles">暂无文章</p>'
    return
  }

  const articlesHTML = articles.map(article => `
    <article class="blog-card">
      <div class="blog-meta">
        <span class="blog-date">📅 ${formatDate(article.created_at)}</span>
        <span class="blog-category">${article.category || '未分类'}</span>
      </div>
      <h2 class="blog-title">
        <a href="article-detail.html?id=${article.id}">${article.title}</a>
      </h2>
      <p class="blog-excerpt">
        ${article.excerpt || ''}
      </p>
      <a href="article-detail.html?id=${article.id}" class="read-more">阅读全文 →</a>
    </article>
  `).join('')

  container.innerHTML = articlesHTML
}

/**
 * 渲染文章详情到页面
 * @param {Object} article - 文章对象
 */
function renderArticleDetail(article) {
  if (!article) {
    document.body.innerHTML = '<h1>文章未找到</h1>'
    return
  }

  // 更新页面标题
  document.title = `${article.title} - Eunice`

  // 渲染文章内容
  const main = document.querySelector('main')
  if (main) {
    main.innerHTML = `
      <article class="article-detail">
        <header class="article-header">
          <div class="article-meta">
            <span class="article-date">📅 ${formatDate(article.created_at)}</span>
            <span class="article-category">${article.category || '未分类'}</span>
          </div>
          <h1 class="article-title">${article.title}</h1>
        </header>
        <div class="article-content">
          ${article.content}
        </div>
        <footer class="article-footer">
          <a href="blog.html" class="back-link">← 返回博客列表</a>
        </footer>
      </article>
    `
  }
}
