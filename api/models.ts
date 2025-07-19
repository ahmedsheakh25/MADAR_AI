import { AVAILABLE_MODELS, PROVIDER_CONFIGS } from "./ai-gateway-config.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Filter models based on available API keys
    const availableModels = AVAILABLE_MODELS.filter(model => {
      const providerConfig = PROVIDER_CONFIGS[model.provider];
      return providerConfig?.apiKey; // Only include if API key is configured
    });

    // Add provider status information
    const modelsWithStatus = availableModels.map(model => ({
      ...model,
      isAvailable: true,
      providerStatus: PROVIDER_CONFIGS[model.provider]?.apiKey ? "configured" : "missing_key",
    }));

    // Group models by provider for better organization
    const modelsByProvider = modelsWithStatus.reduce((acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    }, {} as Record<string, any[]>);

    return new Response(JSON.stringify({
      success: true,
      models: modelsWithStatus,
      modelsByProvider,
      totalAvailable: availableModels.length,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to get models:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to retrieve model configurations",
      models: [],
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 