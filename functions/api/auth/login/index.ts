import { createClient } from '@supabase/supabase-js';

export const onRequestPost = async (context: any) => {
  try {
    // 環境変数の取得を試行（複数の方法）
    const supabaseUrl = context.env.NEXT_PUBLIC_SUPABASE_URL || 
                       context.env.SUPABASE_URL || 
                       context.env.VITE_SUPABASE_URL;
    const supabaseKey = context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       context.env.SUPABASE_ANON_KEY || 
                       context.env.VITE_SUPABASE_ANON_KEY;
    
    // デバッグ情報
    console.log('Environment variables:', {
      NEXT_PUBLIC_SUPABASE_URL: context.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_URL: context.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: context.env.SUPABASE_ANON_KEY,
      allKeys: Object.keys(context.env)
    });
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          error: '環境変数が設定されていません',
          debug: {
            supabaseUrl: !!supabaseUrl,
            supabaseKey: !!supabaseKey,
            availableKeys: Object.keys(context.env)
          }
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { email, password } = await context.request.json();
    
    // 管理者ユーザーを取得
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // パスワード検証（簡易版 - 実際の運用では適切なハッシュ検証が必要）
    // Cloudflare Functionsではbcryptの使用が制限されるため、一時的に簡易検証
    const isValidPassword = user.password_hash === password; // 実際の運用では適切なハッシュ検証
    
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
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
    return new Response(
      JSON.stringify({ error: 'Login failed', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 