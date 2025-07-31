import { sendContactEmail } from '../../../src/lib/email'

export interface Env {
  RESEND_API_KEY: string
}

export async function POST(request: Request, context: { env: Env }) {
  try {
    const data = await request.json()
    await sendContactEmail(data, context.env.RESEND_API_KEY)
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 