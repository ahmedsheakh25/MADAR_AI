import { DatabaseService } from '../lib/database.js';
import type { SaveImageRequest, SaveImageResponse } from '../shared/api.js';

export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
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

    // Get user from request (for now, using dev user)
    const userEmail = 'dev@example.com';
    const user = await DatabaseService.findUserByEmail(userEmail);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User not found. Please sign in.',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

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