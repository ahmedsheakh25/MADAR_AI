export const runtime = 'edge';

export async function GET(req: Request) {
  const responseData = {
    message: 'Madar AI API is running on Vercel Edge Functions!',
    timestamp: new Date().toISOString(),
    runtime: 'edge',
  };

  return new Response(JSON.stringify(responseData), {
    headers: { 'Content-Type': 'application/json' },
  });
} 