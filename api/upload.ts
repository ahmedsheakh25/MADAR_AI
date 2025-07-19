import { requireAuth, createUnauthorizedResponse } from "../lib/middleware.js";

export const runtime = "edge";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function POST(req: Request) {
  try {
    // Require authentication
    const authResult = await requireAuth(req);
    if (!authResult.success || !authResult.user) {
      return createUnauthorizedResponse(authResult.error);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No file provided",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid file type. Only images are allowed.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "File too large. Maximum size is 10MB.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Convert file to base64 for now (can be replaced with cloud storage later)
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64String}`;

    // For demo purposes, we're returning a data URL
    // In production, you would upload to S3, Vercel Blob, or similar service
    const responseData = {
      success: true,
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("File upload failed:", error);

    const responseData = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "File upload failed. Please try again.",
    };

    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
