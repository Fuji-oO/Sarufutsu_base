import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge';

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Supabaseに予約データを挿入
    const { data: insertedData, error } = await supabase
      .from('reservations')
      .insert([data])
      .select()
    
    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create reservation' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, data: insertedData });
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // YYYY-MM形式
    
    let query = supabase
      .from('reservations')
      .select('*')
    
    // 月別フィルター
    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = `${year}-${monthNum}-01`
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0]
      
      // その月に関連する予約を取得（チェックイン日またはチェックアウト日がその月に含まれる）
      query = query.or(`checkin_date.gte.${startDate},checkin_date.lte.${endDate},checkout_date.gte.${startDate},checkout_date.lte.${endDate}`)
    }
    
    const { data, error } = await query.order('checkin_date', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reservations' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    )
  }
} 