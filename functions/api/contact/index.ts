import { createClient } from '@supabase/supabase-js';
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
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = await context.request.json();
    
    // お問い合わせデータをSupabaseに保存（contactsテーブルがある場合）
    try {
      await supabase
        .from('contacts')
        .insert([{
          name: data.name,
          email: data.email,
          message: data.message,
          created_at: new Date().toISOString()
        }]);
    } catch (dbError) {
      console.error('Database insert failed:', dbError);
      // データベース保存に失敗してもメール送信は続行
    }
    
    // メール送信
    const apiKey = context.env.RESEND_API_KEY;
    await sendContactEmail(data, apiKey);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 