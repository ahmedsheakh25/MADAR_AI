import { DatabaseService } from '../lib/database.js';
import type { GenerateImageRequest, GenerateImageResponse } from '../shared/api.js';

export const runtime = 'edge';

const MAX_GENERATIONS_PER_MONTH = 30;

export async function POST(req: Request) {

  try {
    const body: GenerateImageRequest = await req.json();
    const { prompt, styleId, colors, uploadedImageUrl } = body;

    // Validate input
    if (!prompt || !styleId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Prompt and style ID are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user from request (for now, using dev user)
    const userEmail = 'dev@example.com';
    let user = await DatabaseService.findUserByEmail(userEmail);

    if (!user) {
      user = await DatabaseService.createUser({
        email: userEmail,
        name: 'Dev User',
        generationCount: 0,
      });
    }

    // Check generation quota
    const currentDate = new Date();
    const resetDate = user.resetDate ? new Date(user.resetDate) : new Date();
    const monthsDiff =
      (currentDate.getFullYear() - resetDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      resetDate.getMonth();

    if (monthsDiff >= 1) {
      user = await DatabaseService.resetUserGenerationCount(user.id);
    }

    const userGenerationCount = user.generationCount || 0;
    if (userGenerationCount >= MAX_GENERATIONS_PER_MONTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Monthly generation limit exceeded. Please wait until next month.',
          remainingGenerations: 0,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get style information
    const style = await DatabaseService.getStyleById(styleId);
    if (!style) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Style not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build enhanced prompt with style
    const styleData = style.promptJson as any;
    const stylePrompt = styleData?.prompt || '';
    const colorsText = colors ? `, using colors: ${colors.join(', ')}` : '';
    const enhancedPrompt = `${prompt}, ${stylePrompt}${colorsText}`;

    // Generate image using Fal AI
    const falInput = {
      prompt: enhancedPrompt,
      image_size: 'square_hd',
      num_inference_steps: 25,
      guidance_scale: 7.5,
      num_images: 1,
      enable_safety_checker: true,
      ...(uploadedImageUrl && { image_url: uploadedImageUrl }),
    };

    const response = await fetch('https://fal.run/fal-ai/fast-sdxl', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(falInput),
    });

    if (!response.ok) {
      throw new Error(`Fal AI API error: ${response.statusText}`);
    }

    const result = await response.json();
    const imageUrl = result.images?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // Update user generation count
    const updatedUser = await DatabaseService.updateUserGenerationCount(user.id);
    const updatedGenerationCount = updatedUser.generationCount || 0;
    const remainingGenerations = MAX_GENERATIONS_PER_MONTH - updatedGenerationCount;

    const responseData: GenerateImageResponse = {
      success: true,
      imageUrl,
      remainingGenerations,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Image generation failed:', error);
    
    const responseData: GenerateImageResponse = {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'Image generation failed. Please try again.',
    };

    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 