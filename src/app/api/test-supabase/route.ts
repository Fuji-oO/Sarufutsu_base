import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Next.js 13+ App Router対応
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Supabase接続テスト開始')
    
    // 環境変数確認
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // reservationsテーブルの存在確認
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('*')
      .limit(1)
    
    console.log('Reservations table check:', { 
      dataCount: reservations?.length || 0, 
      error: reservationsError?.message || null 
    })
    
    if (reservationsError) {
      return NextResponse.json({
        error: 'reservationsテーブルアクセスエラー',
        details: reservationsError.message,
        code: reservationsError.code
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      reservationsTableExists: true,
      dataCount: reservations?.length || 0,
      error: null
    })
    
  } catch (error) {
    console.error('Supabase接続テストエラー:', error)
    return NextResponse.json({
      error: '接続テストエラー',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 