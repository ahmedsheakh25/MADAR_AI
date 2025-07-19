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

    // Configure Fal AI client
    fal.config({
      credentials: process.env.FAL_AI_API_KEY,
    });

    // Generate image using Fal AI SDK
    const falInput = {
      prompt: enhancedPrompt,
      image_size: "square_hd",
      num_inference_steps: 25,
      guidance_scale: 7.5,
      num_images: 1,
      enable_safety_checker: true,
      ...(uploadedImageUrl && { image_url: uploadedImageUrl }),
    };

    // Implement retry logic for FAL AI requests
    let imageUrl: string | null = null;
    let lastError: Error | null = null;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fal.subscribe("fal-ai/fast-sdxl", {
          input: falInput,
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              console.log("Generation in progress...", update);
            }
          },
        });

        const images = (result as any).images;
        imageUrl = images?.[0]?.url;

        if (!imageUrl || !images || images.length === 0) {
          const error = new Error(
            "No image generated - empty or invalid response from AI service",
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
        break;
      } catch (error) {
        lastError = error as Error;

        // Only retry on network errors or 5xx server errors
        if (
          attempt < maxRetries &&
          (!(error as any).status || (error as any).status >= 500)
        ) {
          console.warn(
            `Generation attempt ${attempt + 1} failed with error, retrying...`,
            (error as Error).message,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1)),
          );
          continue;
        }

        throw error;
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
      error:
        error instanceof Error
          ? error.message
          : "Image generation failed. Please try again.",
    };

    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
