import { route } from "@fal-ai/serverless-proxy/nextjs";

export const runtime = "edge";

// Export the standard HTTP methods for the Fal AI proxy
export const { GET, POST } = route;
