module.exports = (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY
    }
  });
};
