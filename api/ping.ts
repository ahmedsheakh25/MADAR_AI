export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const responseData = {
    message: 'Madar AI API is running on Vercel Edge Functions!',
    timestamp: new Date().toISOString(),
    runtime: 'edge',
  };

  return new Response(JSON.stringify(responseData), {
    headers: { 'Content-Type': 'application/json' },
  });
} 