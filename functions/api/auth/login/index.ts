import bcrypt from 'bcryptjs'

export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

export async function POST(request: Request, context: { env: Env }) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, password } = await request.json()
    
    console.log('認証リクエスト:', { email, password: password ? '***' : 'undefined' })

    // 環境変数の確認
    const supabaseUrl = context.env.SUPABASE_URL
    const supabaseKey = context.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    // 動的インポートでSupabaseクライアントを作成
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // バリデーション
    if (!email || !password) {
      console.log('バリデーションエラー: メールアドレスまたはパスワードが不足')
      return new Response(
        JSON.stringify({ error: 'メールアドレスとパスワードを入力してください' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
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
      return new Response(
        JSON.stringify({ error: 'ユーザーが見つかりません' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    console.log('パスワード検証中...')
    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    
    console.log('パスワード検証結果:', { isValid: isValidPassword })

    if (!isValidPassword) {
      console.log('パスワードが正しくありません')
      return new Response(
        JSON.stringify({ error: 'パスワードが正しくありません' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
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
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )

  } catch (error) {
    console.error('認証エラー:', error)
    return new Response(
      JSON.stringify({ error: '認証中にエラーが発生しました' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  }
} 