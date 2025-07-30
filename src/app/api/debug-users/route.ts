import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('usersテーブルの内容を確認中...')
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('usersテーブル取得エラー:', error)
      return NextResponse.json(
        { error: 'usersテーブルの取得に失敗しました', details: error },
        { status: 500 }
      )
    }
    
    console.log('usersテーブルの内容:', users)
    
    return NextResponse.json({
      success: true,
      users: users,
      count: users?.length || 0
    })
    
  } catch (error) {
    console.error('デバッグAPIエラー:', error)
    return NextResponse.json(
      { error: 'デバッグ中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 