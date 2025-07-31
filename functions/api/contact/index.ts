import { sendContactEmail } from '../../../src/lib/email';

export const onRequestPost = async (context: any) => {
  try {
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { name, email, message } = await context.request.json();
    
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // データベースに保存
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }])
      .select();
    
    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save message' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // メール送信
    try {
      const apiKey = context.env.RESEND_API_KEY;
      await sendContactEmail({ name, email, message }, apiKey);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // メール送信に失敗してもデータベース保存は成功とする
    }
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 