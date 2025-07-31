export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

// 予約更新
export async function PUT(
  request: Request,
  context: { env: Env; params: { id: string } }
) {
  try {
    const { id } = context.params
    const data = await request.json()

    if (!id) {
      return new Response(
        JSON.stringify({ error: '予約IDが指定されていません' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 環境変数の確認
    const supabaseUrl = context.env.SUPABASE_URL
    const supabaseKey = context.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 動的インポートでSupabaseクライアントを作成
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // バリデーション
    if (data.checkin_date && data.checkout_date) {
      const checkinDate = new Date(data.checkin_date)
      const checkoutDate = new Date(data.checkout_date)

      if (checkoutDate <= checkinDate) {
        return new Response(
          JSON.stringify({ error: 'チェックアウト日はチェックイン日より後の日付を選択してください' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // 予約を更新
    const { data: reservation, error } = await supabase
      .from('reservations')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase更新エラー:', error)
      return new Response(
        JSON.stringify({ error: '予約の更新に失敗しました' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: '予約が正常に更新されました',
        reservation: reservation
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('予約更新APIエラー:', error)
    return new Response(
      JSON.stringify({ error: '予期せぬエラーが発生しました' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// 予約削除
export async function DELETE(
  request: Request,
  context: { env: Env; params: { id: string } }
) {
  try {
    const { id } = context.params

    if (!id) {
      return new Response(
        JSON.stringify({ error: '予約IDが指定されていません' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 環境変数の確認
    const supabaseUrl = context.env.SUPABASE_URL
    const supabaseKey = context.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: '環境変数が設定されていません' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 動的インポートでSupabaseクライアントを作成
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 予約を削除
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase削除エラー:', error)
      return new Response(
        JSON.stringify({ error: '予約の削除に失敗しました' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ message: '予約が正常に削除されました' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('予約削除APIエラー:', error)
    return new Response(
      JSON.stringify({ error: '予期せぬエラーが発生しました' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 