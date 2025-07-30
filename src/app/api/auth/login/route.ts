import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('認証リクエスト:', { email, password: password ? '***' : 'undefined' })

    // バリデーション
    if (!email || !password) {
      console.log('バリデーションエラー: メールアドレスまたはパスワードが不足')
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      )
    }

    // ユーザー情報を取得
    console.log('ユーザー検索中:', email)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    console.log('ユーザー検索結果:', { user: user ? 'found' : 'not found', error: userError })

    if (userError || !user) {
      console.log('ユーザーが見つかりません:', userError)
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 401 }
      )
    }

    console.log('パスワード検証中...')
    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    
    console.log('パスワード検証結果:', { isValid: isValidPassword })

    if (!isValidPassword) {
      console.log('パスワードが正しくありません')
      return NextResponse.json(
        { error: 'パスワードが正しくありません' },
        { status: 401 }
      )
    }

    console.log('ログイン成功、最終ログイン時刻を更新中...')
    // 最終ログイン時刻を更新
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // ログイン成功
    console.log('認証完了:', { userId: user.id, email: user.email })
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('認証エラー:', error)
    return NextResponse.json(
      { error: '認証中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 