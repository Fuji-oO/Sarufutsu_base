import { createClient } from '@supabase/supabase-js';

export const onRequestGet = async (context: any) => {
  try {
    const supabaseUrl = context.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const url = new URL(context.request.url);
    const month = url.searchParams.get('month');
    const excludeReservationId = url.searchParams.get('exclude_reservation_id');
    
    if (!month) {
      return new Response(
        JSON.stringify({ error: 'Month parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0];
    
    let query = supabase
      .from('reservations')
      .select('checkin_date, checkout_date, room_type')
      .or(`checkin_date.gte.${startDate},checkin_date.lte.${endDate},checkout_date.gte.${startDate},checkout_date.lte.${endDate}`);
    
    if (excludeReservationId) {
      query = query.neq('id', excludeReservationId);
    }
    
    const { data: reservations, error } = await query;
    
    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch availability' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 日付ごとの予約状況を計算
    const availability = {};
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayReservations = reservations.filter(r => {
        const checkin = new Date(r.checkin_date);
        const checkout = new Date(r.checkout_date);
        const current = new Date(dateStr);
        return current >= checkin && current < checkout;
      });
      
      const room1Count = dayReservations.filter(r => r.room_type === 'room1').length;
      const room2Count = dayReservations.filter(r => r.room_type === 'room2').length;
      
      availability[dateStr] = {
        room1: room1Count < 1,
        room2: room2Count < 1,
      };
    }
    
    return new Response(JSON.stringify(availability), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch availability' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 