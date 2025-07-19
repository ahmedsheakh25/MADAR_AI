import { DatabaseService } from "../lib/database.js";
import { requireAuth, createUnauthorizedResponse } from "../lib/middleware.js";
import { fal } from "@ai-sdk/fal";
import { experimental_generateImage as generateImage } from "ai";
import type {
  GenerateImageRequest,
  GenerateImageResponse,
} from "../shared/api.js";

export const runtime = "nodejs";

const MAX_GENERATIONS_PER_MONTH = 30;

export async function POST(req: Request) {
  let authResult: any;
  let body: GenerateImageRequest;

  try {
    // Require authentication
    authResult = await requireAuth(req);
    if (!authResult.success || !authResult.user) {
      return createUnauthorizedResponse(authResult.error);
    }

    body = await req.json();
    const { prompt, styleId, colors, uploadedImageUrl } = body;

    // Validate input
    if (!prompt || !styleId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Prompt and style ID are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    let user = authResult.user;

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

    if (user.generationCount >= MAX_GENERATIONS_PER_MONTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `You've reached your generation limit of ${MAX_GENERATIONS_PER_MONTH} images per month. Your quota will reset next month.`,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    // Reserve generation slot
    await DatabaseService.reserveGeneration(user.id);

    // Enhance prompt based on style and colors
    let enhancedPrompt = prompt;
    if (colors && colors.length > 0) {
      const colorDescription = colors
        .map((color) => `${color}`)
        .join(", ");
      enhancedPrompt = `${prompt}, using colors: ${colorDescription}`;
    }

    // Add style-specific enhancements based on styleId
    const styleEnhancements = {
      minimal: "clean, minimalist, simple, elegant",
      vibrant: "colorful, energetic, bold, dynamic",
      professional: "polished, sophisticated, high-quality",
      artistic: "creative, expressive, artistic, unique",
    };

    const stylePrompt = styleEnhancements[styleId as keyof typeof styleEnhancements] || "";
    if (stylePrompt) {
      enhancedPrompt = `${enhancedPrompt}, ${stylePrompt}`;
    }

    enhancedPrompt = enhancedPrompt
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join(", ");

    // Check API key configuration  
    if (!process.env.FAL_API_KEY && !process.env.FAL_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Image generation service is not configured.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("🎨 Starting image generation with AI SDK v5...");

    // Generate image using AI SDK v5 with FAL provider
    const result = await generateImage({
      model: fal.image("fal-ai/fast-sdxl"),
      prompt: enhancedPrompt,
      aspectRatio: "1:1", // Square HD equivalent
      n: 1,
      providerOptions: {
        fal: {
          num_inference_steps: uploadedImageUrl ? 20 : 25,
          guidance_scale: 7.5,
          enable_safety_checker: true,
          scheduler: "DPM++ 2M Karras",
          safety_tolerance: 2,
          ...(uploadedImageUrl && {
            image_url: uploadedImageUrl,
            strength: 0.8,
          }),
        },
      },
      headers: {
        "User-Agent": "MADAR-AI/1.0",
      },
    });

    // Extract image URL from AI SDK v5 response
    let imageUrl: string;
    
    // AI SDK v5 returns image with base64 or uint8Array data
    if (result.image.base64) {
      // Convert base64 to a data URL if needed, or handle as required by your app
      imageUrl = `data:image/png;base64,${result.image.base64}`;
    } else {
      throw new Error("No image data received from AI service");
    }

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    console.log("✅ Image generation successful");

    // Record successful generation usage
    await DatabaseService.recordGenerationUsage({
      userId: user.id,
      styleUsed: styleId,
      promptUsed: enhancedPrompt,
      uploadedImageUsed: uploadedImageUrl || null,
      colorsUsed: colors || [],
      generatedImageUrl: imageUrl,
      success: true,
      errorMessage: null,
    });

    // Calculate remaining generations
    const updatedGenerationCount = user.generationCount || 0;
    const remainingGenerations = MAX_GENERATIONS_PER_MONTH - updatedGenerationCount;

    const responseData: GenerateImageResponse = {
      success: true,
      imageUrl,
      remainingGenerations,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Image generation failed:", error);

    // AI SDK v5 standard error handling
    let userFriendlyMessage = "Image generation failed. Please try again.";
    let httpStatus = 500;

    // Handle AI SDK v5 standard errors
    if (error && typeof error === 'object' && 'name' in error) {
      switch (error.name) {
        case 'AI_NoImageGeneratedError':
          userFriendlyMessage = "Unable to generate image. Please try a different prompt.";
          httpStatus = 400;
          break;
        case 'AI_APICallError':
          if (error.message?.toLowerCase().includes('content policy')) {
            userFriendlyMessage = "Your prompt contains content that violates our content policy. Please try a different prompt.";
            httpStatus = 400;
          } else if (error.message?.toLowerCase().includes('rate limit')) {
            userFriendlyMessage = "Service is currently busy. Please try again in a moment.";
            httpStatus = 429;
          } else {
            userFriendlyMessage = "Service temporarily unavailable. Please try again.";
            httpStatus = 503;
          }
          break;
        default:
          // Keep default message
          break;
      }
    }

    // Record failed generation usage
    if (authResult?.user) {
      try {
        await DatabaseService.recordGenerationUsage({
          userId: authResult.user.id,
          styleUsed: body?.styleId || "",
          promptUsed: body?.prompt || "",
          uploadedImageUsed: body?.uploadedImageUrl || null,
          colorsUsed: body?.colors || [],
          generatedImageUrl: null,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });
      } catch (trackingError) {
        console.error("Failed to record generation usage:", trackingError);
      }

      // Release the reserved slot
      await DatabaseService.releaseGeneration(authResult.user.id);
    }

    const responseData: GenerateImageResponse = {
      success: false,
      error: userFriendlyMessage,
    };

    return new Response(JSON.stringify(responseData), {
      status: httpStatus,
      headers: { "Content-Type": "application/json" },
    });
  }
}
