module.exports = (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    env: {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      supabaseUrlLength: supabaseUrl ? supabaseUrl.length : 0,
      supabaseKeyLength: supabaseKey ? supabaseKey.length : 0,
      supabaseUrlFirstChars: supabaseUrl ? supabaseUrl.substring(0, 20) : 'none'
    }
  });
};
