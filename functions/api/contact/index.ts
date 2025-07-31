import { createClient } from '@supabase/supabase-js';
import { sendContactEmail } from '../../../src/lib/email';

export const onRequestPost = async (context: any) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || context.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || context.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { name, email, message } = await context.request.json();
    
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }])
      .select();
    
    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to send message' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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