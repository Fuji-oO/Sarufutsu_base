import { createClient } from '@supabase/supabase-js';

export const onRequestPost = async (context: any) => {
  try {
    // デバッグ用ログ - 環境変数の詳細確認
    console.log('=== Environment Variables Debug ===');
    console.log('context.env keys:', Object.keys(context.env || {}));
    console.log('NEXT_PUBLIC_SUPABASE_URL:', context.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    console.log('RESEND_API_KEY:', context.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
    
    const supabaseUrl = context.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Environment variables missing - URL:', !!supabaseUrl, 'KEY:', !!supabaseKey);
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Supabase URL (first 20 chars):', supabaseUrl.substring(0, 20) + '...');
    console.log('Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { email, password } = await context.request.json();
    
    console.log('Login attempt for email:', email);
    
    // 管理者ユーザーを取得
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      console.log('User not found or error:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('User found:', user.email);
    
    // パスワード検証（簡易版 - 実際の運用では適切なハッシュ検証が必要）
    // Cloudflare Functionsではbcryptの使用が制限されるため、一時的に簡易検証
    const isValidPassword = user.password_hash === password; // 実際の運用では適切なハッシュ検証
    
    console.log('Password validation result:', isValidPassword);
    
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Login successful');
    
    return new Response(JSON.stringify({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      } 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 