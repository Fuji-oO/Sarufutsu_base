import { createClient } from '@supabase/supabase-js'
import { sendReservationEmail } from '../../../src/lib/email'

export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  RESEND_API_KEY: string
}

export interface Reservation {
  name: string
  email: string
  phone: string
  checkin_date: string
  checkout_date: string
  checkin_time: string
  num_guests: number
  adult_male?: number
  adult_female?: number
  child?: number
  room_type: string
  notes?: string
  status: string
  total_price?: number
  price_detail?: string
}

// 新規予約作成
export async function POST(request: Request, context: { env: Env }) {
  try {
    const data: Reservation = await request.json()

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
    if (!data.name || !data.email || !data.phone || !data.checkin_date || 
        !data.checkout_date || !data.checkin_time || !data.num_guests || 
        !data.room_type || !data.status) {
      return new Response(
        JSON.stringify({ error: '必須項目が不足しています' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 日付の妥当性チェック
    const checkinDate = new Date(data.checkin_date)
    const checkoutDate = new Date(data.checkout_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkinDate < today) {
      return new Response(
        JSON.stringify({ error: 'チェックイン日は今日以降の日付を選択してください' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (checkoutDate <= checkinDate) {
      return new Response(
        JSON.stringify({ error: 'チェックアウト日はチェックイン日より後の日付を選択してください' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 料金計算
    let totalPrice = 0;
    let priceDetail = '';
    
    if (data.room_type === '休業日') {
      totalPrice = 0;
      priceDetail = '休業日';
    } else {
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
      return new Response(
        JSON.stringify({ error: '予約の保存中にエラーが発生しました' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // メール送信
    try {
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
        }, context.env.RESEND_API_KEY);
        console.log('予約確認メール送信完了');
      } else {
        console.log('管理者用予約作成のためメール送信をスキップ');
      }
    } catch (emailError) {
      console.error('メール送信エラー:', emailError)
    }

    return new Response(
      JSON.stringify({ 
        message: '予約が完了しました',
        reservation: reservation
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('予約APIエラー:', error)
    return new Response(
      JSON.stringify({ error: '予期せぬエラーが発生しました' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// 予約一覧取得（管理者用）
export async function GET(request: Request, context: { env: Env }) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')

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
      return new Response(
        JSON.stringify({ error: '予約データの取得中にエラーが発生しました' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ reservations }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('予約取得APIエラー:', error)
    return new Response(
      JSON.stringify({ error: '予期せぬエラーが発生しました' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 