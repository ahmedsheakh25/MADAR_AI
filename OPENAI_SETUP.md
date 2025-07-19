# AI Gateway Integration Setup

## Overview

This project features a sophisticated AI Gateway system supporting multiple providers with enterprise-grade features. Users can seamlessly switch between AI models with enhanced observability, caching, and cost optimization.

### ✨ **Enterprise Features**
- 🚀 **Multi-Provider Support** - Fal AI, OpenAI DALL-E models
- 🌐 **AI Gateway Integration** - Cloudflare/Vercel AI Gateway support  
- 📊 **Real-time Observability** - Request logging and performance tracking
- 💰 **Cost Optimization** - Intelligent caching and usage monitoring
- ⚡ **Smart Model Selection** - Dynamic model availability based on API configuration
- 🛡️ **Enhanced Error Handling** - Provider-specific error recovery

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Fal AI Configuration (existing)
FAL_KEY=your_fal_ai_api_key_here

# Vercel AI Gateway Configuration (PRIMARY)
VERCEL_AI_GATEWAY_KEY=pILy0A986lbdtYyvRkdmacgN
VERCEL_AI_GATEWAY_URL=https://api.vercel.com/v1/ai

# Optional: OpenAI Configuration (if using direct OpenAI)
# OPENAI_API_KEY=your_openai_api_key_here

# Optional: Cloudflare AI Gateway
# OPENAI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_slug}/openai
```

### Standard Setup
For basic OpenAI integration, only `OPENAI_API_KEY` is required.

### Enhanced Setup with AI Gateway (Optional)
For enterprise features like caching, analytics, and rate limiting:

1. Set up [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
2. Get your gateway URL from Cloudflare dashboard
3. Add `OPENAI_GATEWAY_URL` to route OpenAI requests through the gateway

**Benefits of AI Gateway:**
- 📊 **Analytics & Observability** - Request logs and usage analytics
- 🚀 **Caching** - Reduce API calls and improve response times
- 🛡️ **Rate Limiting** - Additional protection against quota exhaustion
- 💰 **Cost Tracking** - Detailed usage and cost monitoring

## API Keys Setup

### Fal AI API Key
- Visit [fal.ai](https://fal.ai) and create an account
- Generate an API key from your dashboard
- Add it to your environment variables as `FAL_KEY`

### OpenAI API Key
- Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- Create an account and generate an API key
- Add it to your environment variables as `OPENAI_API_KEY`

## Available Models

The integration supports the following models:

### Vercel AI Gateway (PRIMARY)
- **gpt-image-1** - Vercel AI Gateway optimized image generation model

### Fal AI
- **fal-ai/fast-sdxl** - Fast, high-quality image generation

### OpenAI (Optional)
- **dall-e-3** - OpenAI's latest image generation model
- **dall-e-2** - OpenAI's previous generation model

## Usage

1. Start the application with both API keys configured
2. Navigate to the Generator page
3. Select your preferred AI model from the dropdown
4. Choose a style and enter your prompt
5. Generate your image

## Model Selection

The model selection is now available in the generator interface:
- Users can switch between Fal AI and OpenAI models
- Each model has its own characteristics and capabilities
- The API automatically routes requests to the correct provider based on the selected model

## Error Handling

The system includes comprehensive error handling:
- Missing API keys are detected and reported
- Provider-specific errors are properly handled
- Fallback behavior for service unavailability

## Monitoring & Observability

### Request Logging
The integration automatically logs generation requests with:
- Model selection (Fal AI vs OpenAI)
- Request timing and success/failure rates
- Log IDs for debugging (when using AI Gateway)

### Usage Tracking
Monitor your usage across providers:
- **OpenAI Dashboard**: [OpenAI Usage](https://platform.openai.com/usage)
- **Fal AI Dashboard**: [Fal Dashboard](https://fal.ai/dashboard)
- **Cloudflare AI Gateway** (if enabled): Request analytics and caching stats

### Performance Comparison
Track performance metrics:
- **DALL-E 3**: Higher quality, slower generation (~10-30s)
- **DALL-E 2**: Good quality, moderate speed (~5-15s)
- **Fal AI Fast SDXL**: Fast generation, good quality (~3-10s)

## Notes

- Both API services have their own rate limits and pricing
- Make sure to monitor your usage on both platforms
- DALL-E 3 supports additional parameters like quality and style
- Fal AI models may have different parameter options
- AI Gateway can provide cost savings through intelligent caching 