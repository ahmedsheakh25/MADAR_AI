import { DatabaseService } from '../lib/database.js';
import { requireAuth, createUnauthorizedResponse } from '../lib/middleware.js';
import type { GalleryResponse } from '../shared/api.js';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // Require authentication
    const authResult = await requireAuth(req);
    if (!authResult.success || !authResult.user) {
      return createUnauthorizedResponse(authResult.error);
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const user = authResult.user;

    // Get user's images
    const images = await DatabaseService.getUserImages(user.id, limit, offset);

    // Transform database images to gallery format
    const galleryImages = images.map(image => ({
      id: image.id,
      imageUrl: image.imageUrl || '',
      prompt: image.prompt || '',
      styleName: image.styleName || '',
      colors: image.colors || [],
      createdAt: image.createdAt?.toISOString() || new Date().toISOString(),
    }));

    const responseData: GalleryResponse = {
      images: galleryImages,
      total: galleryImages.length,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gallery endpoint error:', error);
    
    const responseData: GalleryResponse = {
      images: [],
      total: 0,
    };

    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 