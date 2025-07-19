// TODO: Fix FAL proxy import - package may need update or different import path
// import { route } from "@fal-ai/server-proxy/nextjs";

export const runtime = "edge";

// Temporary implementation - need to fix proxy setup
export async function GET() {
  return new Response(JSON.stringify({ error: "Proxy not configured" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST() {
  return new Response(JSON.stringify({ error: "Proxy not configured" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

// Export the standard HTTP methods for the Fal AI proxy
// export const { GET, POST } = route;
