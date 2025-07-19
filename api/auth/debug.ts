export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const devParam = url.searchParams.get("dev");
    const devMode = devParam === "true";

    const isDevModeEnabled =
      process.env.DEV_MODE_AUTH === "true" ||
      process.env.NODE_ENV === "development";

    return new Response(
      JSON.stringify({
        success: true,
        debug: {
          devParam,
          devMode,
          devModeAuth: process.env.DEV_MODE_AUTH,
          nodeEnv: process.env.NODE_ENV,
          isDevModeEnabled,
          condition: devMode && isDevModeEnabled,
          url: req.url,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
