import { AuthService } from '../../lib/auth.js';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // Generate Google OAuth URL
    const authUrl = AuthService.getGoogleAuthUrl();
    
    return new Response(
      JSON.stringify({
        success: true,
        authUrl,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Google OAuth URL generation error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to generate authentication URL',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 