import { NextRequest, NextResponse } from 'next/server'
import { supabase, Reservation } from '../../../lib/supabase'
import { sendReservationEmail } from '../../../lib/email'

// 新規予約作成
export async function POST(request: NextRequest) {
  try {
    const data: Reservation = await request.json()

    // バリデーション
    if (!data.name || !data.email || !data.phone || !data.checkin_date || 
        !data.checkout_date || !data.checkin_time || !data.num_guests || 
        !data.room_type || !data.status) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // 日付の妥当性チェック
    const checkinDate = new Date(data.checkin_date)
    const checkoutDate = new Date(data.checkout_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkinDate < today) {
      return NextResponse.json(
        { error: 'チェックイン日は今日以降の日付を選択してください' },
        { status: 400 }
      )
    }

    if (checkoutDate <= checkinDate) {
      return NextResponse.json(
        { error: 'チェックアウト日はチェックイン日より後の日付を選択してください' },
        { status: 400 }
      )
    }

    // 重複予約チェック（同じ日付の予約があるか）
    const { data: existingReservations, error: checkError } = await supabase
      .from('reservations')
      .select('*')
      .eq('status', 'confirmed')
      .or(`checkin_date.lte.${data.checkout_date},checkout_date.gte.${data.checkin_date}`)

    if (checkError) {
      console.error('重複チェックエラー:', checkError)
      return NextResponse.json(
        { error: '予約状況の確認中にエラーが発生しました' },
        { status: 500 }
      )
    }

    if (existingReservations && existingReservations.length > 0) {
      return NextResponse.json(
        { error: '指定された期間は既に予約が入っています' },
        { status: 409 }
      )
    }

    // 予約データをDBに保存
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('予約保存エラー:', error)
      return NextResponse.json(
        { error: '予約の保存中にエラーが発生しました' },
        { status: 500 }
      )
    }

    // メール送信
    try {
      await sendReservationEmail({
        checkIn: data.checkin_date,
        checkOut: data.checkout_date,
        checkInTime: data.checkin_time,
        guests: data.num_guests,
        adultMale: data.adult_male || 0,
        adultFemale: data.adult_female || 0,
        child: data.child || 0,
        roomType: data.room_type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes
      }, process.env.RESEND_API_KEY!)
    } catch (emailError) {
      console.error('メール送信エラー:', emailError)
      // メール送信失敗でも予約は保存済みなので、エラーは記録のみ
    }

    return NextResponse.json(
      { 
        message: '予約が完了しました',
        reservation: reservation
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('予約APIエラー:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 予約一覧取得（管理者用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    let query = supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })

    // フィルタリング
    if (status) {
      query = query.eq('status', status)
    }
    if (startDate) {
      query = query.gte('checkin_date', startDate)
    }
    if (endDate) {
      query = query.lte('checkout_date', endDate)
    }

    const { data: reservations, error } = await query

    if (error) {
      console.error('予約取得エラー:', error)
      return NextResponse.json(
        { error: '予約データの取得中にエラーが発生しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ reservations })

  } catch (error) {
    console.error('予約取得APIエラー:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
} 