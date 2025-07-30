import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== 予約データ確認API開始 ===');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: '環境変数が設定されていません' }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 8月の予約データを取得
    const { data: augustReservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('status', 'confirmed')
      .gte('checkin_date', '2025-08-01')
      .lte('checkout_date', '2025-08-31');
    
    if (error) {
      console.error('予約データ取得エラー:', error);
      return NextResponse.json({ error: 'データベースエラーが発生しました' }, { status: 500 });
    }
    
    console.log('8月の予約データ:', augustReservations);
    
    // 貸切予約を特別に確認
    const kashikiriReservations = augustReservations?.filter(reservation => 
      reservation.room_type === '貸切'
    ) || [];
    
    console.log('8月の貸切予約:', kashikiriReservations);
    
    return NextResponse.json({
      totalReservations: augustReservations?.length || 0,
      augustReservations,
      kashikiriReservations,
      kashikiriCount: kashikiriReservations.length
    });
    
  } catch (error) {
    console.error('予約データ確認APIエラー:', error);
    return NextResponse.json({ 
      error: '予期せぬエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 