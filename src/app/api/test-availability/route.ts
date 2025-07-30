import { NextRequest, NextResponse } from 'next/server'

// Next.js 13+ App Router対応
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    console.log('Test availability API called:', { startDate, endDate })

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: '開始日と終了日を指定してください' },
        { status: 400 }
      )
    }

    // ハードコードされた空室状況（テスト用）
    const availabilityStatus: { [date: string]: 'available' | 'limited' | 'full' } = {}
    
    // 8月の各日について、サンプルデータに基づいて空室状況を設定
    for (let i = 1; i <= 31; i++) {
      const date = `2025-08-${i.toString().padStart(2, '0')}`
      
      // サンプルデータに基づいて空室状況を設定
      if ([1, 2, 3, 5, 6, 7, 10, 11, 12, 15, 16, 17, 20, 21, 22].includes(i)) {
        availabilityStatus[date] = 'full' // 予約済み
      } else {
        availabilityStatus[date] = 'available' // 空き
      }
    }

    console.log('Test availability result:', availabilityStatus)

    return NextResponse.json({
      availability: availabilityStatus,
      maxRooms: 2,
      dateRange: { start: startDate, end: endDate }
    })

  } catch (error) {
    console.error('Test availability API error:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 