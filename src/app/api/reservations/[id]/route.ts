import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 予約更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: '予約IDが指定されていません' },
        { status: 400 }
      )
    }

    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: '環境変数が設定されていません' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // バリデーション
    if (data.checkin_date && data.checkout_date) {
      const checkinDate = new Date(data.checkin_date)
      const checkoutDate = new Date(data.checkout_date)

      if (checkoutDate <= checkinDate) {
        return NextResponse.json(
          { error: 'チェックアウト日はチェックイン日より後の日付を選択してください' },
          { status: 400 }
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
      return NextResponse.json(
        { error: '予約の更新に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: '予約が正常に更新されました',
        reservation: reservation
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('予約更新APIエラー:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 予約削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: '予約IDが指定されていません' },
        { status: 400 }
      )
    }

    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: '環境変数が設定されていません' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 予約を削除
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase削除エラー:', error)
      return NextResponse.json(
        { error: '予約の削除に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: '予約が正常に削除されました' },
      { status: 200 }
    )

  } catch (error) {
    console.error('予約削除APIエラー:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
} 