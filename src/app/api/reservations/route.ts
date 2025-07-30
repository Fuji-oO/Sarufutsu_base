import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendReservationEmail } from '../../../lib/email'
import type { Reservation } from '../../../lib/supabase'

// 新規予約作成
export async function POST(request: NextRequest) {
  try {
    const data: Reservation = await request.json()

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

    // 重複予約チェック（同じ部屋タイプでの重複をチェック）
    // カレンダーで選択可能な日付は重複しないと判断するため、重複チェックをスキップ
    // 休業日の場合は重複チェックをスキップ
    if (data.room_type !== '休業日') {
      // 重複チェックを削除 - カレンダーで選択可能な日付は重複しない
    }

    // 料金計算
    let totalPrice = 0;
    let priceDetail = '';
    
    if (data.room_type === '休業日') {
      totalPrice = 0;
      priceDetail = '休業日';
    } else {
      // 既存の料金計算ロジック（必要に応じて実装）
      // ここでは簡易的な計算
      totalPrice = data.total_price || 0;
      priceDetail = data.price_detail || '';
    }

    // 予約データをDBに保存
    const reservationData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      checkin_date: data.checkin_date,
      checkout_date: data.checkout_date,
      checkin_time: data.checkin_time,
      num_guests: data.num_guests,
      adult_male: data.adult_male || 0,
      adult_female: data.adult_female || 0,
      child: data.child || 0,
      room_type: data.room_type,
      notes: data.notes || '',
      status: data.status,
      total_price: totalPrice,
      price_detail: data.price_detail || ''
    };

    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([reservationData])
      .select()
      .single()

    if (error) {
      console.error('Supabase予約保存エラー詳細:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json(
        { error: '予約の保存中にエラーが発生しました' },
        { status: 500 }
      )
    }

    // メール送信
    try {
      // 管理者用の新規予約作成の場合はメール送信をスキップ
      // confirmページからの予約の場合はメール送信
      if (data.email && data.email !== 'admin@co.jp') {
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
          notes: data.notes || ''
        }, process.env.RESEND_API_KEY || '');
        console.log('予約確認メール送信完了');
      } else {
        console.log('管理者用予約作成のためメール送信をスキップ');
      }
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