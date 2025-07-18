export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Since we're using JWT tokens, logout is handled client-side
    // by removing the token from storage. We could add token blacklisting here if needed.
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logged out successfully',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Logout failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 