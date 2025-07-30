import { NextRequest, NextResponse } from 'next/server'

// Next.js 13+ App Router対応
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug API called')
    
    // 環境変数の確認
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKeyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV
    }
    
    console.log('Environment variables:', envVars)
    
    // Supabaseクライアントの作成テスト
    let supabaseClient = null
    let supabaseError = null
    
    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      console.log('Supabase client created successfully')
    } catch (error) {
      supabaseError = error instanceof Error ? error.message : 'Unknown error'
      console.error('Supabase client creation error:', error)
    }
    
    // 簡単なクエリテスト
    let queryResult = null
    let queryError = null
    
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('reservations')
          .select('count')
          .limit(1)
        
        queryResult = { data, error: error?.message || null }
        console.log('Query result:', queryResult)
      } catch (error) {
        queryError = error instanceof Error ? error.message : 'Unknown error'
        console.error('Query error:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envVars,
      supabaseClientCreated: !!supabaseClient,
      supabaseError,
      queryResult,
      queryError
    })
    
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 