import { DatabaseService } from '../lib/database.js';
import { requireAuth, createUnauthorizedResponse } from '../lib/middleware.js';
import type { SaveImageRequest, SaveImageResponse } from '../shared/api.js';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Require authentication
    const authResult = await requireAuth(req);
    if (!authResult.success || !authResult.user) {
      return createUnauthorizedResponse(authResult.error);
    }

    const body: SaveImageRequest = await req.json();
    const { imageUrl, prompt, styleName, colors } = body;

    // Validate input
    if (!imageUrl || !prompt || !styleName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Image URL, prompt, and style name are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = authResult.user;

    // Save image to database
    const savedImage = await DatabaseService.saveImage({
      userId: user.id,
      imageUrl,
      prompt,
      styleName,
      colors,
    });

    const responseData: SaveImageResponse = {
      success: true,
      imageId: savedImage.id,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Save image error:', error);
    
    const responseData: SaveImageResponse = {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'Failed to save image. Please try again.',
    };

    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 