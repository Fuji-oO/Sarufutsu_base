import { createClient } from '@supabase/supabase-js';

export const onRequestPost = async (context: any) => {
  try {
    // デバッグ用ログ
    console.log('=== Login Function Called ===');
    console.log('process.env keys:', Object.keys(process.env || {}));
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    
    // 正しい環境変数名を使用
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Environment variables missing');
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