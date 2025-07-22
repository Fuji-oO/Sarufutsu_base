import { NextRequest, NextResponse } from 'next/server'
import { supabase, Reservation } from '../../../../lib/supabase'

// 個別予約取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: reservation, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('予約取得エラー:', error)
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ reservation })

  } catch (error) {
    console.error('予約取得APIエラー:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 予約更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data: Partial<Reservation> = await request.json()

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

    const { data: reservation, error } = await supabase
      .from('reservations')
      .update(data)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('予約更新エラー:', error)
      return NextResponse.json(
        { error: '予約の更新中にエラーが発生しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: '予約を更新しました',
      reservation 
    })

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
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('予約削除エラー:', error)
      return NextResponse.json(
        { error: '予約の削除中にエラーが発生しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: '予約を削除しました'
    })

  } catch (error) {
    console.error('予約削除APIエラー:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
} 