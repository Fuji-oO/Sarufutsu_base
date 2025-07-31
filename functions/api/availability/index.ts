export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

export async function GET(request: Request, context: { env: Env }) {
  try {
    console.log('=== 空室状況API開始 ===');
    
    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const roomType = url.searchParams.get('room_type');
    const excludeReservationId = url.searchParams.get('exclude_reservation_id');

    console.log('リクエストパラメータ:', { startDate, endDate, roomType, excludeReservationId });

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: '開始日と終了日が必要です' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 環境変数の確認
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;

    console.log('環境変数確認:');
    console.log('- SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定');
    console.log('- SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定');

    if (!supabaseUrl || !supabaseKey) {
      console.error('環境変数が設定されていません');
      return new Response(
        JSON.stringify({ 
          error: '環境変数が設定されていません',
          details: 'SUPABASE_URL または SUPABASE_ANON_KEY が設定されていません'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 動的インポートでSupabaseクライアントを作成
    let supabase;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('Supabaseクライアント作成: 成功');
    } catch (clientError) {
      console.error('Supabaseクライアント作成エラー:', clientError);
      return new Response(
        JSON.stringify({ 
          error: 'Supabaseクライアント作成エラー',
          details: clientError instanceof Error ? clientError.message : 'Unknown error'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 指定された期間の確認済み予約を取得
    console.log('予約データ取得開始...');
    let query = supabase
      .from('reservations')
      .select('checkin_date, checkout_date, room_type, status')
      .eq('status', 'confirmed');
    
    // 編集時は現在の予約を除外
    if (excludeReservationId) {
      query = query.neq('id', excludeReservationId);
    }
    
    const { data: reservations, error } = await query;

    if (error) {
      console.error('Supabaseクエリエラー:', error);
      return new Response(
        JSON.stringify({ 
          error: 'データベースエラーが発生しました',
          details: error.message,
          code: error.code
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('取得された予約データ件数:', reservations?.length || 0);
    console.log('取得された予約データ:', reservations);

    // 日付ごとの予約数を計算
    const availability: Record<string, boolean> = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('空室状況計算開始...');
    console.log('計算期間:', { start: start.toISOString(), end: end.toISOString() });

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      // その日の予約数をカウント
      const dayReservations = reservations?.filter(reservation => {
        const checkin = new Date(reservation.checkin_date);
        const checkout = new Date(reservation.checkout_date);
        const currentDate = new Date(dateStr);
        
        return currentDate >= checkin && currentDate < checkout;
      }) || [];

      // 部屋タイプ別の予約数をカウント
      const roomTypeReservations = dayReservations.filter(reservation => {
        if (roomType === '貸切') {
          // 貸切の場合、Room1またはRoom2のいずれかに予約があるか、貸切予約がある日は満室
          return reservation.room_type === 'Room1' || reservation.room_type === 'Room2' || reservation.room_type === '貸切' || reservation.room_type === '休業日';
        } else if (roomType === 'Room1' || roomType === 'Room2') {
          // Room1またはRoom2の場合、同じ部屋タイプまたは貸切予約がある日は満室
          return reservation.room_type === roomType || reservation.room_type === '貸切' || reservation.room_type === '休業日';
        }
        return false;
      });

      // 最大部屋数（貸切の場合は1、Room1/Room2の場合は1）
      const maxRooms = 1;
      
      // 空室状況を判定
      availability[dateStr] = roomTypeReservations.length < maxRooms;
    }

    console.log('計算された空室状況:', availability);

    return new Response(
      JSON.stringify({
        availability,
        maxRooms: 1,
        dateRange: { start: startDate, end: endDate }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('空室状況取得エラー:', error);
    return new Response(
      JSON.stringify({ 
        error: '予期せぬエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 