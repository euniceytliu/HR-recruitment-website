// Jobs数据库操作相关函数

// 获取所有热招岗位
async function getJobs(limit = 100) {
    try {
        const supabase = window.supabase.createClient(
            'https://gevvmjwjmpjhwczfuiru.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I'
        );
        
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('published', true)
            .order('is_hot', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('❌ 查询失败:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('❌ 异常:', err);
        return [];
    }
}

// 添加新岗位
async function addJob(jobData) {
    try {
        const supabase = window.supabase.createClient(
            'https://gevvmjwjmpjhwczfuiru.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I'
        );
        
        const { data, error } = await supabase
            .from('jobs')
            .insert(jobData);

        if (error) {
            console.error('❌ 添加失败:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('❌ 异常:', err);
        return null;
    }
}

// 更新岗位信息
async function updateJob(id, jobData) {
    try {
        const supabase = window.supabase.createClient(
            'https://gevvmjwjmpjhwczfuiru.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I'
        );
        
        const { data, error } = await supabase
            .from('jobs')
            .update(jobData)
            .eq('id', id);

        if (error) {
            console.error('❌ 更新失败:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('❌ 异常:', err);
        return null;
    }
}

// 删除岗位
async function deleteJob(id) {
    try {
        const supabase = window.supabase.createClient(
            'https://gevvmjwjmpjhwczfuiru.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldnZtandqbXBqaHdjemZ1aXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTkyOTYsImV4cCI6MjA4MTc5NTI5Nn0.iA0eIjnudgmYHsVE_ioHTR8fR84oIciQqqNcbSBZ33I'
        );
        
        const { data, error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('❌ 删除失败:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('❌ 异常:', err);
        return false;
    }
}

// 渲染岗位列表
function renderJobList(jobs, containerId = 'jobs-container') {
    const container = document.querySelector(`.${containerId}`);
    if (!container) {
        console.error('未找到容器:', containerId);
        return;
    }

    if (!jobs || jobs.length === 0) {
        container.innerHTML = '<p class="no-jobs">暂无招聘岗位</p>';
        return;
    }

    const jobsHTML = jobs.map(job => {
        const hotBadge = job.is_hot ? `<div class="job-badge">🔥 热招</div>` : '';
        const requirements = job.requirements ? job.requirements.map(req => `<li>${req}</li>`).join('') : '';
        
        return `
            <div class="job-card ${job.is_hot ? 'hot' : ''}">
                ${hotBadge}
                <h3 class="job-title">${job.title}</h3>
                <div class="job-info">
                    <span class="job-dept">📍 ${job.department || '未知部门'}</span>
                    <span class="job-location">📌 ${job.location || '未知地点'}</span>
                </div>
                <div class="job-requirements">
                    <h4>岗位要求：</h4>
                    <ul>${requirements}</ul>
                </div>
                <a href="${job.apply_url || '#'}" class="apply-btn" target="_blank">立即申请 →</a>
            </div>
        `;
    }).join('');

    container.innerHTML = jobsHTML;
}