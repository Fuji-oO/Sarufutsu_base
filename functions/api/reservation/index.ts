import { createClient } from '@supabase/supabase-js';
import { sendReservationEmail } from '../../../src/lib/email';

export const onRequestPost = async (context: any) => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = await context.request.json();
    
    // Supabaseに予約データを挿入
    const { data: insertedData, error } = await supabase
      .from('reservations')
      .insert([data])
      .select();
    
    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create reservation' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // メール送信（room_typeが'休業日'でない場合のみ）
    if (data.room_type !== '休業日') {
      try {
        const apiKey = process.env.RESEND_API_KEY;
        await sendReservationEmail(data, apiKey);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // メール送信に失敗しても予約作成は成功とする
      }
    }
    
    return new Response(JSON.stringify({ success: true, data: insertedData }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestGet = async (context: any) => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const url = new URL(context.request.url);
    const month = url.searchParams.get('month');
    
    let query = supabase.from('reservations').select('*');
    
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0];
      query = query.or(`checkin_date.gte.${startDate},checkin_date.lte.${endDate},checkout_date.gte.${startDate},checkout_date.lte.${endDate}`);
    }
    
    const { data, error } = await query.order('checkin_date', { ascending: false });
    
    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch reservations' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(JSON.stringify(data || []), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch reservations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 