export const onRequestGet = async (context: any) => {
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
    const url = new URL(context.request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'startDate and endDate are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 指定された期間に重複する予約を取得
    const { data: overlappingReservations, error } = await supabase
      .from('reservations')
      .select('*')
      .or(`checkin_date.lte.${endDate},checkout_date.gte.${startDate}`)
      .eq('status', 'confirmed');
    
    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to check availability' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 重複する予約がある場合は利用不可
    const isAvailable = !overlappingReservations || overlappingReservations.length === 0;
    
    return new Response(JSON.stringify({ 
      available: isAvailable,
      overlappingReservations: overlappingReservations || []
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to check availability' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 