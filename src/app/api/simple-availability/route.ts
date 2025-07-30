import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Simple availability API called')
    
    // 基本的なクエリテスト
    const { data, error } = await supabase
      .from('reservations')
      .select('checkin_date, checkout_date, status')
      .eq('status', 'confirmed')
      .limit(5)
    
    console.log('Simple query result:', { 
      dataCount: data?.length || 0, 
      error: error?.message || null,
      data: data
    })
    
    if (error) {
      return NextResponse.json({
        error: 'クエリエラー',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      dataCount: data?.length || 0,
      data: data,
      error: null
    })
    
  } catch (error) {
    console.error('Simple availability API error:', error)
    return NextResponse.json({
      error: '予期せぬエラー',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 