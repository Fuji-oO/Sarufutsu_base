export const onRequestGet = async (context: any) => {
  try {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: context.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: context.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      RESEND_API_KEY: context.env.RESEND_API_KEY,
      allEnvKeys: Object.keys(context.env)
    };
    
    return new Response(JSON.stringify(envVars, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 