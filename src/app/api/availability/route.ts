import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// 空室状況取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: '開始日と終了日を指定してください' },
        { status: 400 }
      )
    }

    // 指定期間の予約データを取得
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('checkin_date, checkout_date, status')
      .eq('status', 'confirmed')
      .or(`checkin_date.lte.${endDate},checkout_date.gte.${startDate}`)

    if (error) {
      console.error('空室状況取得エラー:', error)
      return NextResponse.json(
        { error: '空室状況の取得中にエラーが発生しました' },
        { status: 500 }
      )
    }

    // 日付ごとの予約数を集計
    const availability: { [date: string]: number } = {}
    const start = new Date(startDate)
    const end = new Date(endDate)

    // 日付範囲を初期化
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      availability[dateStr] = 0
    }

    // 予約データから日付ごとの予約数を計算
    reservations?.forEach(reservation => {
      const checkin = new Date(reservation.checkin_date)
      const checkout = new Date(reservation.checkout_date)

      for (let d = new Date(checkin); d < checkout; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        if (availability[dateStr] !== undefined) {
          availability[dateStr]++
        }
      }
    })

    // 空室状況を判定（例：最大2部屋と仮定）
    const maxRooms = 2
    const availabilityStatus: { [date: string]: 'available' | 'limited' | 'full' } = {}

    Object.keys(availability).forEach(date => {
      const count = availability[date]
      if (count === 0) {
        availabilityStatus[date] = 'available' // 空き
      } else if (count < maxRooms) {
        availabilityStatus[date] = 'limited' // 残りわずか
      } else {
        availabilityStatus[date] = 'full' // 満室
      }
    })

    return NextResponse.json({
      availability: availabilityStatus,
      maxRooms,
      dateRange: { start: startDate, end: endDate }
    })

  } catch (error) {
    console.error('空室状況APIエラー:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
} 