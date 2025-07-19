/**
 * AI Gateway Configuration for Multiple Providers
 * Based on Vercel AI Gateway models and providers patterns
 */

import { createOpenAI } from "@ai-sdk/openai";
import { fal } from "@ai-sdk/fal";

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens?: number;
  supportedSizes?: string[];
  estimatedTime?: string;
  costPerImage?: number;
}

export interface ProviderConfig {
  id: string;
  name: string;
  baseURL?: string;
  apiKey?: string;
  models: ModelConfig[];
}

// Define available models with their configurations
export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "fal-ai/fast-sdxl",
    name: "Fast SDXL",
    provider: "fal",
    description: "Fast, high-quality image generation with SDXL",
    supportedSizes: ["1024x1024", "1024x768", "768x1024"],
    estimatedTime: "3-10 seconds",
    costPerImage: 0.05,
  },
  {
    id: "gpt-image-1",
    name: "GPT Image 1",
    provider: "vercel-gateway",
    description: "Vercel AI Gateway optimized image generation model",
    supportedSizes: ["1024x1024", "1792x1024", "1024x1792"],
    estimatedTime: "8-20 seconds",
    costPerImage: 0.06,
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "openai",
    description: "OpenAI's latest high-quality image generation",
    supportedSizes: ["1024x1024", "1792x1024", "1024x1792"],
    estimatedTime: "10-30 seconds",
    costPerImage: 0.08,
  },
  {
    id: "dall-e-2",
    name: "DALL-E 2",
    provider: "openai",
    description: "OpenAI's reliable image generation model",
    supportedSizes: ["1024x1024", "512x512", "256x256"],
    estimatedTime: "5-15 seconds",
    costPerImage: 0.02,
  },
];

// Provider configurations with Vercel AI Gateway support
export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  "vercel-gateway": {
    id: "vercel-gateway",
    name: "Vercel AI Gateway",
    baseURL: process.env.VERCEL_AI_GATEWAY_URL || "https://api.vercel.com/v1/ai",
    apiKey: process.env.VERCEL_AI_GATEWAY_KEY,
    models: AVAILABLE_MODELS.filter(m => m.provider === "vercel-gateway"),
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    baseURL: process.env.OPENAI_GATEWAY_URL || "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    models: AVAILABLE_MODELS.filter(m => m.provider === "openai"),
  },
  fal: {
    id: "fal",
    name: "Fal AI",
    apiKey: process.env.FAL_KEY,
    models: AVAILABLE_MODELS.filter(m => m.provider === "fal"),
  },
};

/**
 * Create provider instance with AI Gateway support
 */
export function createProviderInstance(providerId: string) {
  const config = PROVIDER_CONFIGS[providerId];
  
  if (!config) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  switch (providerId) {
    case "vercel-gateway":
      if (!config.apiKey) {
        throw new Error("Vercel AI Gateway key not configured");
      }
      
      console.log(`🌐 Using Vercel AI Gateway: ${config.baseURL}`);
      return createOpenAI({
        baseURL: config.baseURL,
        apiKey: config.apiKey,
        headers: {
          "X-Vercel-AI-Gateway": "true",
        },
      });

    case "openai":
      if (!config.apiKey) {
        throw new Error("OpenAI API key not configured");
      }
      
      // Use AI Gateway URL if configured, otherwise standard OpenAI
      if (process.env.OPENAI_GATEWAY_URL) {
        console.log(`🌐 Using AI Gateway for OpenAI: ${process.env.OPENAI_GATEWAY_URL}`);
        return createOpenAI({
          baseURL: config.baseURL,
          apiKey: config.apiKey,
        });
      }
      
      return createOpenAI({
        apiKey: config.apiKey,
      });

    case "fal":
      if (!config.apiKey) {
        throw new Error("Fal AI API key not configured");
      }
      return fal;

    default:
      throw new Error(`Provider ${providerId} not implemented`);
  }
}

/**
 * Get model configuration by ID
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return AVAILABLE_MODELS.find(model => model.id === modelId);
}

/**
 * Get available models for a provider
 */
export function getProviderModels(providerId: string): ModelConfig[] {
  return AVAILABLE_MODELS.filter(model => model.provider === providerId);
}

/**
 * Validate model and provider configuration
 */
export function validateModelProvider(modelId: string): {
  isValid: boolean;
  provider: string;
  config?: ModelConfig;
  error?: string;
} {
  const config = getModelConfig(modelId);
  
  if (!config) {
    return {
      isValid: false,
      provider: "",
      error: `Model ${modelId} not found`,
    };
  }

  const providerConfig = PROVIDER_CONFIGS[config.provider];
  if (!providerConfig?.apiKey) {
    return {
      isValid: false,
      provider: config.provider,
      error: `API key not configured for provider ${config.provider}`,
    };
  }

  return {
    isValid: true,
    provider: config.provider,
    config,
  };
}

/**
 * Get optimal size for model
 */
export function getOptimalSize(modelId: string, preferredSize?: string): string {
  const config = getModelConfig(modelId);
  
  if (!config?.supportedSizes) {
    return "1024x1024"; // Default fallback
  }

  // Return preferred size if supported
  if (preferredSize && config.supportedSizes.includes(preferredSize)) {
    return preferredSize;
  }

  // Return first supported size (usually the optimal one)
  return config.supportedSizes[0];
} 