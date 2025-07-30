import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== デバッグAPI開始 ===');
    
    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('環境変数確認:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定');
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: '環境変数が設定されていません',
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      }, { status: 500 });
    }
    
    // Supabaseクライアントの作成テスト
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      console.log('Supabaseクライアント作成: 成功');
      
      // テーブル存在確認
      const { data: tableCheck, error: tableError } = await supabase
        .from('reservations')
        .select('count')
        .limit(1);
      
      console.log('テーブルアクセス確認:');
      console.log('- データ:', tableCheck);
      console.log('- エラー:', tableError);
      
      if (tableError) {
        return NextResponse.json({ 
          error: 'テーブルアクセスエラー',
          details: tableError.message,
          code: tableError.code
        }, { status: 500 });
      }
      
      // サンプルクエリテスト
      const { data: sampleData, error: sampleError } = await supabase
        .from('reservations')
        .select('checkin_date, checkout_date, room_type, status')
        .eq('status', 'confirmed')
        .limit(5);
      
      console.log('サンプルクエリ結果:');
      console.log('- データ件数:', sampleData?.length || 0);
      console.log('- エラー:', sampleError);
      
      return NextResponse.json({
        success: true,
        environment: 'OK',
        tableAccess: 'OK',
        sampleDataCount: sampleData?.length || 0,
        sampleData: sampleData
      });
      
    } catch (clientError) {
      console.error('Supabaseクライアント作成エラー:', clientError);
      return NextResponse.json({ 
        error: 'Supabaseクライアント作成エラー',
        details: clientError instanceof Error ? clientError.message : 'Unknown error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('デバッグAPIエラー:', error);
    return NextResponse.json({ 
      error: '予期せぬエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 