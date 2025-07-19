import { DatabaseService } from "../lib/database.js";
import { requireAuth, createUnauthorizedResponse } from "../lib/middleware.js";
import * as fal from "@fal-ai/serverless-client";
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

    const userGenerationCount = user.generationCount || 0;
    if (userGenerationCount >= MAX_GENERATIONS_PER_MONTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Monthly generation limit exceeded. Please wait until next month.",
          remainingGenerations: 0,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    // Get style information
    const style = await DatabaseService.getStyleById(styleId);
    if (!style) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Style not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Build enhanced prompt with optimal structure for AI generation
    const styleData = style.promptJson as any;
    const stylePrompt = styleData?.prompt || "";

    // Build color modifiers from user color selection
    const colorModifiers =
      colors && colors.length > 0
        ? `with primary colors ${colors.slice(0, 2).join(" and ")}`
        : "";

    // Assemble prompt in optimal order: user description + style prompt + color modifiers + quality enhancers
    const enhancedPrompt = [
      prompt.trim(), // User's creative input first
      stylePrompt, // Style-specific instructions
      colorModifiers, // Color preferences
      "high quality, detailed, professional", // Quality enhancers
    ]
      .filter(Boolean)
      .join(", ");

    // Check if API key is configured
    if (
      !process.env.FAL_AI_API_KEY ||
      process.env.FAL_AI_API_KEY === "your_fal_ai_api_key_here"
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Fal AI API key is not configured. Please set FAL_AI_API_KEY environment variable.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Configure FAL client with optimized settings
    fal.config({
      credentials: process.env.FAL_AI_API_KEY,
    });

    // Determine the best model based on requirements
    const modelId = uploadedImageUrl ? "fal-ai/fast-sdxl" : "fal-ai/fast-sdxl"; // Could be expanded for different models
    
    // Prepare optimized FAL input parameters
    const falInput = {
      prompt: enhancedPrompt,
      image_size: "square_hd", // 1024x1024 for high quality
      num_inference_steps: uploadedImageUrl ? 20 : 25, // Fewer steps for img2img
      guidance_scale: 7.5,
      num_images: 1,
      enable_safety_checker: true,
      scheduler: "DPM++ 2M Karras", // High quality scheduler
      safety_tolerance: 2,
      ...(uploadedImageUrl && { 
        image_url: uploadedImageUrl,
        strength: 0.8, // For image-to-image generation
      }),
    };

    // Generate image using FAL client with retry logic
    let imageUrl: string | null = null;
    let lastError: Error | null = null;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Generation attempt ${attempt + 1}/${maxRetries + 1}...`);
        
        const result = await fal.subscribe(modelId, {
          input: falInput,
          logs: false,
        });

        // Extract image URL from FAL response
        const typedResult = result as { images?: Array<{ url?: string }> };
        imageUrl = typedResult.images?.[0]?.url || null;

        if (!imageUrl) {
          const error = new Error(
            "No image URL generated - empty or invalid response from AI service",
          );
          lastError = error;

          if (attempt < maxRetries) {
            console.warn(
              `Generation attempt ${attempt + 1} failed, retrying...`,
              error.message,
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (attempt + 1)),
            );
            continue;
          }

          throw error;
        }

        // Validate image URL
        if (!imageUrl.startsWith("http")) {
          const error = new Error("Invalid image URL received from AI service");
          lastError = error;

          if (attempt < maxRetries) {
            console.warn(
              `Generation attempt ${attempt + 1} failed, retrying...`,
              error.message,
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (attempt + 1)),
            );
            continue;
          }

          throw error;
        }

        // Success - break out of retry loop
        console.log("✅ Image generation successful:", imageUrl);
        break;
      } catch (error) {
        lastError = error as Error;
        const errorMessage = (error as Error).message;
        console.warn(
          `Generation attempt ${attempt + 1} failed:`,
          errorMessage,
        );

        // Enhanced error categorization for better handling
        const isNetworkError = 
          errorMessage.toLowerCase().includes("network") ||
          errorMessage.toLowerCase().includes("fetch") ||
          errorMessage.toLowerCase().includes("connection") ||
          errorMessage.toLowerCase().includes("timeout");

        const isServerError = 
          errorMessage.includes("500") ||
          errorMessage.includes("502") ||
          errorMessage.includes("503") ||
          errorMessage.includes("504") ||
          errorMessage.toLowerCase().includes("internal server error");

        const isRateLimitError = 
          errorMessage.includes("429") ||
          errorMessage.toLowerCase().includes("rate limit") ||
          errorMessage.toLowerCase().includes("quota exceeded");

        const isContentPolicyError = 
          errorMessage.toLowerCase().includes("content policy") ||
          errorMessage.toLowerCase().includes("safety") ||
          errorMessage.toLowerCase().includes("inappropriate");

        const isAuthError = 
          errorMessage.includes("401") ||
          errorMessage.includes("403") ||
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("invalid api key");

        // Only retry on certain errors
        if (attempt < maxRetries) {
          const isRetryable = isNetworkError || isServerError || isRateLimitError;
          
          if (isRetryable) {
            const retryDelay = isRateLimitError ? 5000 : 1000 * (attempt + 1);
            console.warn(`Retryable error detected, retrying in ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          }
        }

        // Add specific error context for non-retryable errors
        if (isContentPolicyError) {
          lastError = new Error("Your prompt contains content that violates our content policy. Please try a different prompt.");
        } else if (isAuthError) {
          lastError = new Error("Authentication failed. Please check your API configuration.");
        } else if (errorMessage.toLowerCase().includes("insufficient credits")) {
          lastError = new Error("Insufficient API credits. Please check your FAL AI account balance.");
        }

        // Don't retry on client errors or after max attempts
        throw lastError;
      }
    }

    if (!imageUrl) {
      throw (
        lastError ||
        new Error("Failed to generate image after multiple attempts")
      );
    }

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

    // Generation was already reserved, so just calculate remaining count
    const updatedGenerationCount = user.generationCount || 0;
    const remainingGenerations =
      MAX_GENERATIONS_PER_MONTH - updatedGenerationCount;

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

    // Categorize error for better user experience
    let userFriendlyMessage = "Image generation failed. Please try again.";
    let httpStatus = 500;

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes("content policy") || errorMessage.includes("inappropriate")) {
        userFriendlyMessage = "Your prompt contains content that violates our content policy. Please try a different prompt.";
        httpStatus = 400;
      } else if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
        userFriendlyMessage = "You have reached your generation limit for this month. Please try again next month.";
        httpStatus = 429;
      } else if (errorMessage.includes("unauthorized") || errorMessage.includes("api key")) {
        userFriendlyMessage = "Service temporarily unavailable. Please try again in a few minutes.";
        httpStatus = 503;
      } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
        userFriendlyMessage = "Network error occurred. Please check your connection and try again.";
        httpStatus = 503;
      } else if (errorMessage.includes("insufficient credits")) {
        userFriendlyMessage = "Service temporarily unavailable due to capacity limits. Please try again later.";
        httpStatus = 503;
      }
    }

    // Record failed generation usage
    if (authResult.user) {
      try {
        await DatabaseService.recordGenerationUsage({
          userId: authResult.user.id,
          styleUsed: body.styleId,
          promptUsed: body.prompt,
          uploadedImageUsed: body.uploadedImageUrl || null,
          colorsUsed: body.colors || [],
          generatedImageUrl: null,
          success: false,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
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
