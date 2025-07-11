// import type { PagesFunction } from '@cloudflare/workers-types';
import { sendReservationEmail } from '../../src/lib/email';

export const onRequestPost = async (context: any) => {
  try {
    const data = await context.request.json();
    const apiKey = context.env.RESEND_API_KEY;
    await sendReservationEmail(data, apiKey);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 