import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    fs: {
      deny: ["api/**"], // Prevent Vite from serving api folder as static files
    },
  },
  build: {
    outDir: "dist",
  },
  define: {
    global: "globalThis",
  },
  plugins: [
    react(),
    {
      name: "express-dev-server",
      configureServer(server) {
        // Note: Using Vercel API routes (api/ directory) instead of Express server
        // The server/index.js integration is disabled for Vercel deployment
        
        // // Import and setup Express server for API routes
        // const { createServer } = await import("./server/index.js");
        // const app = createServer();

        // // Use the Express app to handle /api routes
        // server.middlewares.use("/api", (req, res, next) => {
        //   app(req, res, next);
        // });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));
