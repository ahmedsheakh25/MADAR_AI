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

    // Check API key configuration - using Vercel's automatic FAL integration
    if (!process.env.FAL_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Image generation service is not configured.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("🎨 Starting image generation with AI SDK v5...");
    console.log("Enhanced prompt:", enhancedPrompt);
    console.log("Upload image URL:", uploadedImageUrl);
    console.log("FAL_KEY present:", !!process.env.FAL_KEY);

    let result;
    
    try {
      // Minimal AI SDK v5 test - no providerOptions first
      console.log("🧪 Attempting minimal AI SDK v5 call...");
      
      result = await generateImage({
        model: fal.image("fal-ai/fast-sdxl"),
        prompt: enhancedPrompt,
        aspectRatio: "1:1",
      });

      console.log("✅ Minimal call successful!");
      
    } catch (minimalError) {
      console.error("❌ Minimal call failed:", minimalError);
      console.error("Error details:", {
        name: minimalError?.name,
        message: minimalError?.message,
        stack: minimalError?.stack?.split('\n').slice(0, 5) // First 5 lines of stack
      });
      
      // Try with basic providerOptions
      console.log("🧪 Trying with basic provider options...");
      
      result = await generateImage({
        model: fal.image("fal-ai/fast-sdxl"),
        prompt: enhancedPrompt,
        aspectRatio: "1:1",
        providerOptions: {
          fal: {
            num_inference_steps: 25,
            guidance_scale: 7.5,
          },
        },
      });
      
      console.log("✅ Basic provider options call successful!");
    }

    console.log("✅ AI SDK result received:", {
      hasImage: !!result.image,
      hasBase64: !!result.image?.base64,
      hasUint8Array: !!result.image?.uint8Array,
    });

    // Extract image URL from AI SDK v5 response
    let imageUrl: string;
    
    console.log("🔍 Debugging image response structure:", {
      resultKeys: Object.keys(result),
      imageKeys: result.image ? Object.keys(result.image) : null,
      resultType: typeof result,
      imageType: typeof result.image
    });
    
    // AI SDK v5 returns image with base64 or uint8Array data
    if (result.image?.base64) {
      console.log("✅ Using base64 data");
      imageUrl = `data:image/png;base64,${result.image.base64}`;
    } else if (result.image?.uint8Array) {
      console.log("✅ Converting uint8Array to base64");
      // Convert uint8Array to base64
      const base64 = Buffer.from(result.image.uint8Array).toString('base64');
      imageUrl = `data:image/png;base64,${base64}`;
    } else {
      console.error("❌ No image data found in result:", result);
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
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    });

    // AI SDK v5 standard error handling with detailed logging
    let userFriendlyMessage = "Image generation failed. Please try again.";
    let httpStatus = 500;

    // Handle AI SDK v5 standard errors
    if (error && typeof error === 'object' && 'name' in error) {
      console.log("AI SDK Error type:", error.name);
      
      switch (error.name) {
        case 'AI_NoImageGeneratedError':
          userFriendlyMessage = "Unable to generate image. Please try a different prompt.";
          httpStatus = 400;
          break;
        case 'AI_APICallError':
          console.log("API Call Error details:", error.message);
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
          console.log("Unknown AI SDK error:", error.name, error.message);
          // Keep default message
          break;
      }
    } else if (error instanceof Error) {
      console.log("Standard Error:", error.message);
      if (error.message.includes('FAL_KEY') || error.message.includes('API key')) {
        userFriendlyMessage = "Service configuration error. Please try again later.";
        httpStatus = 503;
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
