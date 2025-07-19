export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  
  try {
    // Test environment variables (without exposing them)
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const hasFalApiKey = !!process.env.FAL_KEY;
    
    const responseData = {
      success: true,
      message: 'Edge Function test successful',
      method: 'GET',
      path: url.pathname,
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabaseUrl,
        hasFalApiKey,
      },
      aiSdk: {
        version: 'v4.3.19',
        provider: '@ai-sdk/fal v0.1.12',
        migration: 'AI SDK v5 Standard Patterns',
        integration: 'Vercel FAL_KEY Automatic Integration',
      },
    };

    return new Response(JSON.stringify(responseData, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }, null, 2),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 