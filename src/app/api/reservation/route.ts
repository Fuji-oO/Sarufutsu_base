import { NextRequest, NextResponse } from 'next/server';
import { sendReservationEmail } from '../../../lib/email';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await sendReservationEmail(data, process.env.RESEND_API_KEY);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 