var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// lib/schema.ts
var schema_exports = {};
__export(schema_exports, {
  imagesTable: () => imagesTable,
  sessionsTable: () => sessionsTable,
  stylesTable: () => stylesTable,
  usersTable: () => usersTable
});
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  varchar
} from "file:///app/code/node_modules/drizzle-orm/pg-core/index.js";
var usersTable, sessionsTable, imagesTable, stylesTable;
var init_schema = __esm({
  "lib/schema.ts"() {
    usersTable = pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      email: text("email").notNull().unique(),
      name: text("name"),
      googleId: text("google_id").unique(),
      profilePicture: text("profile_picture"),
      role: varchar("role", { length: 20 }).default("user"),
      // 'user', 'admin'
      generationCount: integer("generation_count").default(0),
      resetDate: timestamp("reset_date").defaultNow(),
      createdAt: timestamp("created_at").defaultNow(),
      lastLoginAt: timestamp("last_login_at")
    });
    sessionsTable = pgTable("sessions", {
      id: uuid("id").primaryKey().defaultRandom(),
      userId: uuid("user_id").references(() => usersTable.id, {
        onDelete: "cascade"
      }),
      token: text("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    imagesTable = pgTable("images", {
      id: uuid("id").primaryKey().defaultRandom(),
      userId: uuid("user_id").references(() => usersTable.id),
      imageUrl: text("image_url"),
      prompt: text("prompt"),
      styleName: text("style_name"),
      colors: text("colors").array(),
      createdAt: timestamp("created_at").defaultNow()
    });
    stylesTable = pgTable("styles", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name"),
      description: text("description"),
      thumbnail: text("thumbnail"),
      promptJson: jsonb("prompt_json")
    });
  }
});

// lib/db.ts
import { drizzle } from "file:///app/code/node_modules/drizzle-orm/neon-http/index.js";
import { neon } from "file:///app/code/node_modules/@neondatabase/serverless/index.mjs";
var sql, db;
var init_db = __esm({
  "lib/db.ts"() {
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required");
    }
    sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema: schema_exports });
  }
});

// lib/database.ts
import { eq, sql as sql2 } from "file:///app/code/node_modules/drizzle-orm/index.js";
var DatabaseService;
var init_database = __esm({
  "lib/database.ts"() {
    init_db();
    init_schema();
    DatabaseService = class {
      // User management
      static async createUser(userData) {
        const [user] = await db.insert(usersTable).values(userData).returning();
        return user;
      }
      static async findUserByEmail(email) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        return user || null;
      }
      static async findUserByGoogleId(googleId) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.googleId, googleId));
        return user || null;
      }
      static async createUserFromGoogle(googleUser) {
        const [user] = await db.insert(usersTable).values({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.googleId,
          profilePicture: googleUser.profilePicture,
          generationCount: 0,
          lastLoginAt: /* @__PURE__ */ new Date()
        }).returning();
        return user;
      }
      static async updateLastLogin(userId) {
        const [user] = await db.update(usersTable).set({ lastLoginAt: /* @__PURE__ */ new Date() }).where(eq(usersTable.id, userId)).returning();
        return user;
      }
      static async getUserById(id) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
        return user || null;
      }
      static async updateUserGenerationCount(userId, increment = 1) {
        const [user] = await db.update(usersTable).set({
          generationCount: sql2`${usersTable.generationCount} + ${increment}`
        }).where(eq(usersTable.id, userId)).returning();
        return user;
      }
      static async resetUserGenerationCount(userId) {
        const [user] = await db.update(usersTable).set({
          generationCount: 0,
          resetDate: /* @__PURE__ */ new Date()
        }).where(eq(usersTable.id, userId)).returning();
        return user;
      }
      // Image management
      static async saveImage(imageData) {
        const [image] = await db.insert(imagesTable).values(imageData).returning();
        return image;
      }
      static async getUserImages(userId, limit = 50, offset = 0) {
        return db.select().from(imagesTable).where(eq(imagesTable.userId, userId)).orderBy(sql2`${imagesTable.createdAt} DESC`).limit(limit).offset(offset);
      }
      static async deleteImage(imageId, userId) {
        const result = await db.delete(imagesTable).where(
          sql2`${imagesTable.id} = ${imageId} AND ${imagesTable.userId} = ${userId}`
        );
        return result.rowCount > 0;
      }
      // Style management
      static async getAllStyles() {
        return db.select().from(stylesTable);
      }
      static async getStyleById(id) {
        const [style] = await db.select().from(stylesTable).where(eq(stylesTable.id, id));
        return style || null;
      }
      static async getStyleByName(name) {
        const [style] = await db.select().from(stylesTable).where(eq(stylesTable.name, name));
        return style || null;
      }
      static async createStyle(styleData) {
        const [style] = await db.insert(stylesTable).values(styleData).returning();
        return style;
      }
      static async updateStyle(id, updates) {
        const [style] = await db.update(stylesTable).set(updates).where(eq(stylesTable.id, id)).returning();
        return style;
      }
      static async deleteStyle(id) {
        const result = await db.delete(stylesTable).where(eq(stylesTable.id, id));
        return result.rowCount > 0;
      }
      // Admin utilities
      static async getAllUsers(limit = 50, offset = 0) {
        return db.select().from(usersTable).orderBy(sql2`${usersTable.resetDate} DESC`).limit(limit).offset(offset);
      }
      static async getUserCount() {
        const [result] = await db.select({ count: sql2`count(*)` }).from(usersTable);
        return result.count;
      }
      // Session management
      static async createSession(sessionData) {
        const [session] = await db.insert(sessionsTable).values(sessionData).returning();
        return session;
      }
      static async findSessionByToken(token) {
        const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.token, token));
        return session || null;
      }
      static async deleteSession(token) {
        const result = await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
        return result.rowCount > 0;
      }
      static async deleteExpiredSessions() {
        const result = await db.delete(sessionsTable).where(sql2`${sessionsTable.expiresAt} < ${/* @__PURE__ */ new Date()}`);
        return result.rowCount;
      }
      static async deleteUserSessions(userId) {
        const result = await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
        return result.rowCount;
      }
    };
  }
});

// lib/auth.ts
import { SignJWT, jwtVerify } from "file:///app/code/node_modules/jose/dist/webapi/index.js";
import { eq as eq2 } from "file:///app/code/node_modules/drizzle-orm/index.js";
var JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE, AuthService;
var init_auth = __esm({
  "lib/auth.ts"() {
    init_database();
    init_db();
    init_schema();
    JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
    );
    JWT_ISSUER = "madar-ai";
    JWT_AUDIENCE = "madar-ai-users";
    AuthService = class {
      // Generate JWT token for authenticated user
      static async generateToken(user) {
        const jwt = await new SignJWT({
          userId: user.id,
          email: user.email,
          name: user.name || ""
        }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setIssuer(JWT_ISSUER).setAudience(JWT_AUDIENCE).setExpirationTime("7d").sign(JWT_SECRET);
        return jwt;
      }
      // Verify JWT token and return payload
      static async verifyToken(token) {
        try {
          const { payload } = await jwtVerify(token, JWT_SECRET, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE
          });
          return payload;
        } catch (error) {
          console.error("JWT verification failed:", error);
          return null;
        }
      }
      // Extract user from request Authorization header
      static async getUserFromRequest(req) {
        try {
          const authHeader = req.headers.get("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
          }
          const token = authHeader.substring(7);
          const payload = await this.verifyToken(token);
          if (!payload) {
            return null;
          }
          const user = await DatabaseService.getUserById(payload.userId);
          return user;
        } catch (error) {
          console.error("Error extracting user from request:", error);
          return null;
        }
      }
      // Google OAuth: Exchange authorization code for user info
      static async exchangeGoogleCode(code) {
        try {
          const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              code,
              client_id: process.env.GOOGLE_CLIENT_ID || "",
              client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
              redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
              grant_type: "authorization_code"
            })
          });
          if (!tokenResponse.ok) {
            throw new Error("Failed to exchange code for token");
          }
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;
          const userResponse = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
          );
          if (!userResponse.ok) {
            throw new Error("Failed to get user info from Google");
          }
          const userData = await userResponse.json();
          return userData;
        } catch (error) {
          console.error("Google OAuth error:", error);
          return null;
        }
      }
      // Google OAuth: Get or create user from Google profile
      static async authenticateWithGoogle(googleUser) {
        let user = await DatabaseService.findUserByGoogleId(googleUser.id);
        let isNewUser = false;
        if (!user) {
          user = await DatabaseService.findUserByEmail(googleUser.email);
          if (user) {
            const [updatedUser] = await db.update(usersTable).set({
              googleId: googleUser.id,
              profilePicture: googleUser.picture,
              lastLoginAt: /* @__PURE__ */ new Date()
            }).where(eq2(usersTable.id, user.id)).returning();
            user = updatedUser;
          } else {
            const userData = {
              email: googleUser.email,
              name: googleUser.name,
              googleId: googleUser.id,
              profilePicture: googleUser.picture,
              // Auto-assign admin role if this is the master admin email
              role: this.isMasterAdmin(googleUser.email) ? "admin" : "user"
            };
            user = await DatabaseService.createUserFromGoogle(userData);
            isNewUser = true;
          }
        } else {
          user = await DatabaseService.updateLastLogin(user.id);
        }
        const token = await this.generateToken(user);
        return { user, token, isNewUser };
      }
      // Generate Google OAuth URL
      static getGoogleAuthUrl() {
        const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
          response_type: "code",
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent"
        });
        return `${baseUrl}?${params.toString()}`;
      }
      // Check if user is master admin
      static isMasterAdmin(email) {
        const masterAdminEmail = "ahmed.sheakh@gmail.com";
        return email.toLowerCase() === masterAdminEmail.toLowerCase();
      }
      // Check if user has admin role
      static isAdmin(user) {
        return user.role === "admin" || this.isMasterAdmin(user.email);
      }
      // Promote user to admin (only master admin can do this)
      static async promoteToAdmin(userId, promotingUser) {
        if (!this.isMasterAdmin(promotingUser.email)) {
          throw new Error("Only master admin can promote users to admin");
        }
        try {
          await db.update(usersTable).set({ role: "admin" }).where(eq2(usersTable.id, userId));
          return true;
        } catch (error) {
          console.error("Failed to promote user to admin:", error);
          return false;
        }
      }
      // Demote admin user (only master admin can do this)
      static async demoteFromAdmin(userId, demotingUser) {
        if (!this.isMasterAdmin(demotingUser.email)) {
          throw new Error("Only master admin can demote admin users");
        }
        const targetUser = await DatabaseService.getUserById(userId);
        if (targetUser && this.isMasterAdmin(targetUser.email)) {
          throw new Error("Cannot demote master admin");
        }
        try {
          await db.update(usersTable).set({ role: "user" }).where(eq2(usersTable.id, userId));
          return true;
        } catch (error) {
          console.error("Failed to demote user from admin:", error);
          return false;
        }
      }
    };
  }
});

// lib/middleware.ts
async function requireAuth(req) {
  try {
    const user = await AuthService.getUserFromRequest(req);
    if (!user) {
      return {
        success: false,
        error: "Authentication required. Please log in."
      };
    }
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return {
      success: false,
      error: "Authentication failed"
    };
  }
}
var init_middleware = __esm({
  "lib/middleware.ts"() {
    init_auth();
  }
});

// server/routes/user.ts
var MAX_GENERATIONS_PER_MONTH, handleUserStats;
var init_user = __esm({
  "server/routes/user.ts"() {
    init_database();
    init_middleware();
    MAX_GENERATIONS_PER_MONTH = 30;
    handleUserStats = async (req, res) => {
      try {
        const url = new URL(req.originalUrl, `http://${req.headers.host}`);
        const webRequest = new Request(url.toString(), {
          method: req.method,
          headers: req.headers
        });
        const authResult = await requireAuth(webRequest);
        if (!authResult.success || !authResult.user) {
          return res.status(401).json({
            success: false,
            error: authResult.error || "Unauthorized"
          });
        }
        let user = authResult.user;
        const currentDate = /* @__PURE__ */ new Date();
        const resetDate = user.resetDate ? new Date(user.resetDate) : /* @__PURE__ */ new Date();
        const monthsDiff = (currentDate.getFullYear() - resetDate.getFullYear()) * 12 + currentDate.getMonth() - resetDate.getMonth();
        if (monthsDiff >= 1) {
          user = await DatabaseService.resetUserGenerationCount(user.id);
        }
        const userGenerationCount = user.generationCount || 0;
        const remainingGenerations = Math.max(
          0,
          MAX_GENERATIONS_PER_MONTH - userGenerationCount
        );
        const responseData = {
          user: {
            id: user.id,
            email: user.email,
            name: user.name || "",
            generationCount: userGenerationCount,
            resetDate: user.resetDate?.toISOString() || (/* @__PURE__ */ new Date()).toISOString()
          },
          remainingGenerations,
          maxGenerations: MAX_GENERATIONS_PER_MONTH
        };
        res.json(responseData);
      } catch (error) {
        console.error("User stats endpoint error:", error);
        res.status(500).json({
          success: false,
          error: "Failed to get user stats"
        });
      }
    };
  }
});

// server/routes/styles.ts
var handleStyles;
var init_styles = __esm({
  "server/routes/styles.ts"() {
    init_database();
    handleStyles = async (req, res) => {
      try {
        const styles = await DatabaseService.getAllStyles();
        const formattedStyles = styles.map((style) => ({
          id: style.id,
          name: style.name || "",
          description: style.description || "",
          thumbnail: style.thumbnail || "",
          promptJson: style.promptJson || {}
        }));
        const responseData = {
          styles: formattedStyles
        };
        res.json(responseData);
      } catch (error) {
        console.error("Styles endpoint error:", error);
        const responseData = {
          styles: []
        };
        res.status(500).json(responseData);
      }
    };
  }
});

// server/routes/auth.ts
var handleGoogleAuth, handleAuthCallback, handleLogout;
var init_auth2 = __esm({
  "server/routes/auth.ts"() {
    init_auth();
    handleGoogleAuth = async (req, res) => {
      try {
        const authUrl = AuthService.getGoogleAuthUrl();
        res.json({
          success: true,
          authUrl
        });
      } catch (error) {
        console.error("Google OAuth URL generation error:", error);
        res.status(500).json({
          success: false,
          error: "Failed to generate authentication URL"
        });
      }
    };
    handleAuthCallback = async (req, res) => {
      try {
        const { code, error } = req.query;
        if (error) {
          return res.status(400).json({
            success: false,
            error: `OAuth error: ${error}`
          });
        }
        if (!code || typeof code !== "string") {
          return res.status(400).json({
            success: false,
            error: "Authorization code not provided"
          });
        }
        const googleUser = await AuthService.exchangeGoogleCode(code);
        if (!googleUser) {
          return res.status(400).json({
            success: false,
            error: "Failed to authenticate with Google"
          });
        }
        const { user, token, isNewUser } = await AuthService.authenticateWithGoogle(googleUser);
        const callbackUrl = new URL("/ar/auth/callback", "http://localhost:8080");
        callbackUrl.searchParams.set("token", token);
        callbackUrl.searchParams.set(
          "user",
          JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
            generationCount: user.generationCount,
            resetDate: user.resetDate?.toISOString()
          })
        );
        callbackUrl.searchParams.set("isNewUser", isNewUser.toString());
        res.redirect(callbackUrl.toString());
      } catch (error) {
        console.error("Google OAuth callback error:", error);
        res.status(500).json({
          success: false,
          error: "Authentication failed"
        });
      }
    };
    handleLogout = async (req, res) => {
      try {
        res.json({
          success: true,
          message: "Logged out successfully"
        });
      } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
          success: false,
          error: "Logout failed"
        });
      }
    };
  }
});

// server/index.ts
var server_exports = {};
__export(server_exports, {
  createServer: () => createServer
});
import express from "file:///app/code/node_modules/express/index.js";
import cors from "file:///app/code/node_modules/cors/lib/index.js";
function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.get("/ping", (req, res) => {
    res.json({ message: "MADAR AI Express Server is running!" });
  });
  app.get("/user", handleUserStats);
  app.get("/styles", handleStyles);
  app.get("/auth/google", handleGoogleAuth);
  app.get("/auth/callback", handleAuthCallback);
  app.post("/auth/logout", handleLogout);
  app.get("/run-migration", async (req, res) => {
    try {
      const { neon: neon2 } = await import("file:///app/code/node_modules/@neondatabase/serverless/index.mjs");
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL not configured");
      }
      const sql3 = neon2(process.env.DATABASE_URL);
      const migrationSQL = `
        -- Drop existing tables if they exist to start fresh
        DROP TABLE IF EXISTS "images" CASCADE;
        DROP TABLE IF EXISTS "sessions" CASCADE;
        DROP TABLE IF EXISTS "styles" CASCADE;
        DROP TABLE IF EXISTS "users" CASCADE;

        -- Create users table
        CREATE TABLE "users" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "email" text NOT NULL,
          "name" text,
          "google_id" text,
          "profile_picture" text,
          "generation_count" integer DEFAULT 0,
          "reset_date" timestamp DEFAULT now(),
          "created_at" timestamp DEFAULT now(),
          "last_login_at" timestamp,
          CONSTRAINT "users_email_unique" UNIQUE("email"),
          CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
        );

        -- Create sessions table
        CREATE TABLE "sessions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "token" text NOT NULL,
          "expires_at" timestamp NOT NULL,
          "created_at" timestamp DEFAULT now(),
          CONSTRAINT "sessions_token_unique" UNIQUE("token")
        );

        -- Create styles table
        CREATE TABLE "styles" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "name" text,
          "description" text,
          "thumbnail" text,
          "prompt_json" jsonb
        );

        -- Create images table
        CREATE TABLE "images" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "image_url" text,
          "prompt" text,
          "style_name" text,
          "colors" text[],
          "created_at" timestamp DEFAULT now()
        );

        -- Add foreign key constraints
        ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

        ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      `;
      await sql3`DROP TABLE IF EXISTS "images" CASCADE`;
      await sql3`DROP TABLE IF EXISTS "sessions" CASCADE`;
      await sql3`DROP TABLE IF EXISTS "styles" CASCADE`;
      await sql3`DROP TABLE IF EXISTS "users" CASCADE`;
      await sql3`
        CREATE TABLE "users" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "email" text NOT NULL,
          "name" text,
          "google_id" text,
          "profile_picture" text,
          "generation_count" integer DEFAULT 0,
          "reset_date" timestamp DEFAULT now(),
          "created_at" timestamp DEFAULT now(),
          "last_login_at" timestamp,
          CONSTRAINT "users_email_unique" UNIQUE("email"),
          CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
        )
      `;
      await sql3`
        CREATE TABLE "sessions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "token" text NOT NULL,
          "expires_at" timestamp NOT NULL,
          "created_at" timestamp DEFAULT now(),
          CONSTRAINT "sessions_token_unique" UNIQUE("token")
        )
      `;
      await sql3`
        CREATE TABLE "styles" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "name" text,
          "description" text,
          "thumbnail" text,
          "prompt_json" jsonb
        )
      `;
      await sql3`
        CREATE TABLE "images" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "image_url" text,
          "prompt" text,
          "style_name" text,
          "colors" text[],
          "created_at" timestamp DEFAULT now()
        )
      `;
      await sql3`
        ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action
      `;
      await sql3`
        ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
      `;
      res.json({
        success: true,
        message: "Database migration completed successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Migration failed",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app.get("/gallery", (req, res) => {
    res.json({ images: [] });
  });
  app.post("/generate", (req, res) => {
    res.status(501).json({ error: "Generate endpoint not implemented yet" });
  });
  app.post("/save", (req, res) => {
    res.status(501).json({ error: "Save endpoint not implemented yet" });
  });
  return app;
}
var init_server = __esm({
  "server/index.ts"() {
    init_user();
    init_styles();
    init_auth2();
  }
});

// vite.config.ts
import { defineConfig } from "file:///app/code/node_modules/vite/dist/node/index.js";
import react from "file:///app/code/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/app/code";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    fs: {
      deny: ["api/**"]
      // Prevent Vite from serving api folder as static files
    }
  },
  build: {
    outDir: "dist"
  },
  define: {
    global: "globalThis"
  },
  plugins: [
    react(),
    {
      name: "express-dev-server",
      configureServer: async (server) => {
        const { config } = await import("file:///app/code/node_modules/dotenv/lib/main.js");
        config();
        const { createServer: createServer2 } = await Promise.resolve().then(() => (init_server(), server_exports));
        const app = createServer2();
        server.middlewares.use("/api", (req, res, next) => {
          app(req, res, next);
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./client"),
      "@shared": path.resolve(__vite_injected_original_dirname, "./shared")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGliL3NjaGVtYS50cyIsICJsaWIvZGIudHMiLCAibGliL2RhdGFiYXNlLnRzIiwgImxpYi9hdXRoLnRzIiwgImxpYi9taWRkbGV3YXJlLnRzIiwgInNlcnZlci9yb3V0ZXMvdXNlci50cyIsICJzZXJ2ZXIvcm91dGVzL3N0eWxlcy50cyIsICJzZXJ2ZXIvcm91dGVzL2F1dGgudHMiLCAic2VydmVyL2luZGV4LnRzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2xpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2xpYi9zY2hlbWEudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL2xpYi9zY2hlbWEudHNcIjtpbXBvcnQge1xuICBwZ1RhYmxlLFxuICB1dWlkLFxuICB0ZXh0LFxuICBpbnRlZ2VyLFxuICB0aW1lc3RhbXAsXG4gIGpzb25iLFxuICB2YXJjaGFyLFxufSBmcm9tIFwiZHJpenpsZS1vcm0vcGctY29yZVwiO1xuXG4vLyBVc2VycyB0YWJsZVxuZXhwb3J0IGNvbnN0IHVzZXJzVGFibGUgPSBwZ1RhYmxlKFwidXNlcnNcIiwge1xuICBpZDogdXVpZChcImlkXCIpLnByaW1hcnlLZXkoKS5kZWZhdWx0UmFuZG9tKCksXG4gIGVtYWlsOiB0ZXh0KFwiZW1haWxcIikubm90TnVsbCgpLnVuaXF1ZSgpLFxuICBuYW1lOiB0ZXh0KFwibmFtZVwiKSxcbiAgZ29vZ2xlSWQ6IHRleHQoXCJnb29nbGVfaWRcIikudW5pcXVlKCksXG4gIHByb2ZpbGVQaWN0dXJlOiB0ZXh0KFwicHJvZmlsZV9waWN0dXJlXCIpLFxuICByb2xlOiB2YXJjaGFyKFwicm9sZVwiLCB7IGxlbmd0aDogMjAgfSkuZGVmYXVsdChcInVzZXJcIiksIC8vICd1c2VyJywgJ2FkbWluJ1xuICBnZW5lcmF0aW9uQ291bnQ6IGludGVnZXIoXCJnZW5lcmF0aW9uX2NvdW50XCIpLmRlZmF1bHQoMCksXG4gIHJlc2V0RGF0ZTogdGltZXN0YW1wKFwicmVzZXRfZGF0ZVwiKS5kZWZhdWx0Tm93KCksXG4gIGNyZWF0ZWRBdDogdGltZXN0YW1wKFwiY3JlYXRlZF9hdFwiKS5kZWZhdWx0Tm93KCksXG4gIGxhc3RMb2dpbkF0OiB0aW1lc3RhbXAoXCJsYXN0X2xvZ2luX2F0XCIpLFxufSk7XG5cbi8vIFNlc3Npb25zIHRhYmxlIGZvciBtYW5hZ2luZyB1c2VyIHNlc3Npb25zXG5leHBvcnQgY29uc3Qgc2Vzc2lvbnNUYWJsZSA9IHBnVGFibGUoXCJzZXNzaW9uc1wiLCB7XG4gIGlkOiB1dWlkKFwiaWRcIikucHJpbWFyeUtleSgpLmRlZmF1bHRSYW5kb20oKSxcbiAgdXNlcklkOiB1dWlkKFwidXNlcl9pZFwiKS5yZWZlcmVuY2VzKCgpID0+IHVzZXJzVGFibGUuaWQsIHtcbiAgICBvbkRlbGV0ZTogXCJjYXNjYWRlXCIsXG4gIH0pLFxuICB0b2tlbjogdGV4dChcInRva2VuXCIpLm5vdE51bGwoKS51bmlxdWUoKSxcbiAgZXhwaXJlc0F0OiB0aW1lc3RhbXAoXCJleHBpcmVzX2F0XCIpLm5vdE51bGwoKSxcbiAgY3JlYXRlZEF0OiB0aW1lc3RhbXAoXCJjcmVhdGVkX2F0XCIpLmRlZmF1bHROb3coKSxcbn0pO1xuXG4vLyBJbWFnZXMgdGFibGVcbmV4cG9ydCBjb25zdCBpbWFnZXNUYWJsZSA9IHBnVGFibGUoXCJpbWFnZXNcIiwge1xuICBpZDogdXVpZChcImlkXCIpLnByaW1hcnlLZXkoKS5kZWZhdWx0UmFuZG9tKCksXG4gIHVzZXJJZDogdXVpZChcInVzZXJfaWRcIikucmVmZXJlbmNlcygoKSA9PiB1c2Vyc1RhYmxlLmlkKSxcbiAgaW1hZ2VVcmw6IHRleHQoXCJpbWFnZV91cmxcIiksXG4gIHByb21wdDogdGV4dChcInByb21wdFwiKSxcbiAgc3R5bGVOYW1lOiB0ZXh0KFwic3R5bGVfbmFtZVwiKSxcbiAgY29sb3JzOiB0ZXh0KFwiY29sb3JzXCIpLmFycmF5KCksXG4gIGNyZWF0ZWRBdDogdGltZXN0YW1wKFwiY3JlYXRlZF9hdFwiKS5kZWZhdWx0Tm93KCksXG59KTtcblxuLy8gU3R5bGVzIHRhYmxlXG5leHBvcnQgY29uc3Qgc3R5bGVzVGFibGUgPSBwZ1RhYmxlKFwic3R5bGVzXCIsIHtcbiAgaWQ6IHV1aWQoXCJpZFwiKS5wcmltYXJ5S2V5KCkuZGVmYXVsdFJhbmRvbSgpLFxuICBuYW1lOiB0ZXh0KFwibmFtZVwiKSxcbiAgZGVzY3JpcHRpb246IHRleHQoXCJkZXNjcmlwdGlvblwiKSxcbiAgdGh1bWJuYWlsOiB0ZXh0KFwidGh1bWJuYWlsXCIpLFxuICBwcm9tcHRKc29uOiBqc29uYihcInByb21wdF9qc29uXCIpLFxufSk7XG5cbi8vIEV4cG9ydCB0eXBlc1xuZXhwb3J0IHR5cGUgVXNlciA9IHR5cGVvZiB1c2Vyc1RhYmxlLiRpbmZlclNlbGVjdDtcbmV4cG9ydCB0eXBlIE5ld1VzZXIgPSB0eXBlb2YgdXNlcnNUYWJsZS4kaW5mZXJJbnNlcnQ7XG5cbmV4cG9ydCB0eXBlIFNlc3Npb24gPSB0eXBlb2Ygc2Vzc2lvbnNUYWJsZS4kaW5mZXJTZWxlY3Q7XG5leHBvcnQgdHlwZSBOZXdTZXNzaW9uID0gdHlwZW9mIHNlc3Npb25zVGFibGUuJGluZmVySW5zZXJ0O1xuXG5leHBvcnQgdHlwZSBJbWFnZSA9IHR5cGVvZiBpbWFnZXNUYWJsZS4kaW5mZXJTZWxlY3Q7XG5leHBvcnQgdHlwZSBOZXdJbWFnZSA9IHR5cGVvZiBpbWFnZXNUYWJsZS4kaW5mZXJJbnNlcnQ7XG5cbmV4cG9ydCB0eXBlIFN0eWxlID0gdHlwZW9mIHN0eWxlc1RhYmxlLiRpbmZlclNlbGVjdDtcbmV4cG9ydCB0eXBlIE5ld1N0eWxlID0gdHlwZW9mIHN0eWxlc1RhYmxlLiRpbmZlckluc2VydDtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2xpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2xpYi9kYi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvbGliL2RiLnRzXCI7aW1wb3J0IHsgZHJpenpsZSB9IGZyb20gXCJkcml6emxlLW9ybS9uZW9uLWh0dHBcIjtcbmltcG9ydCB7IG5lb24gfSBmcm9tIFwiQG5lb25kYXRhYmFzZS9zZXJ2ZXJsZXNzXCI7XG5pbXBvcnQgKiBhcyBzY2hlbWEgZnJvbSBcIi4vc2NoZW1hLmpzXCI7XG5cbmlmICghcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIkRBVEFCQVNFX1VSTCBpcyByZXF1aXJlZFwiKTtcbn1cblxuLy8gQ3JlYXRlIE5lb24gSFRUUCBjbGllbnQgLSBFZGdlIFJ1bnRpbWUgY29tcGF0aWJsZVxuY29uc3Qgc3FsID0gbmVvbihwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwpO1xuXG4vLyBDcmVhdGUgRHJpenpsZSBpbnN0YW5jZSB3aXRoIE5lb24gSFRUUCBhZGFwdGVyIGZvciBFZGdlIFJ1bnRpbWVcbmV4cG9ydCBjb25zdCBkYiA9IGRyaXp6bGUoc3FsLCB7IHNjaGVtYSB9KTtcblxuZXhwb3J0IHR5cGUgRGF0YWJhc2UgPSB0eXBlb2YgZGI7XG5cbi8vIFRlc3QgY29ubmVjdGlvbiBmdW5jdGlvblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3REYXRhYmFzZUNvbm5lY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gU2ltcGxlIHF1ZXJ5IHRvIHRlc3QgY29ubmVjdGlvblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNxbGBTRUxFQ1QgMSBhcyB0ZXN0YDtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCByZXN1bHQgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcbiAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGRhdGFiYXNlIGVycm9yJyBcbiAgICB9O1xuICB9XG59ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2xpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2xpYi9kYXRhYmFzZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvbGliL2RhdGFiYXNlLnRzXCI7aW1wb3J0IHsgZXEsIHNxbCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgZGIgfSBmcm9tIFwiLi9kYi5qc1wiO1xuaW1wb3J0IHsgdXNlcnNUYWJsZSwgaW1hZ2VzVGFibGUsIHN0eWxlc1RhYmxlLCBzZXNzaW9uc1RhYmxlIH0gZnJvbSBcIi4vc2NoZW1hLmpzXCI7XG5pbXBvcnQgdHlwZSB7IFVzZXIsIE5ld1VzZXIsIEltYWdlLCBOZXdJbWFnZSwgU3R5bGUsIFNlc3Npb24sIE5ld1Nlc3Npb24gfSBmcm9tIFwiLi9zY2hlbWEuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFiYXNlU2VydmljZSB7XG4gIC8vIFVzZXIgbWFuYWdlbWVudFxuICBzdGF0aWMgYXN5bmMgY3JlYXRlVXNlcih1c2VyRGF0YTogTmV3VXNlcik6IFByb21pc2U8VXNlcj4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiLmluc2VydCh1c2Vyc1RhYmxlKS52YWx1ZXModXNlckRhdGEpLnJldHVybmluZygpO1xuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZpbmRVc2VyQnlFbWFpbChlbWFpbDogc3RyaW5nKTogUHJvbWlzZTxVc2VyIHwgbnVsbD4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHVzZXJzVGFibGUpXG4gICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5lbWFpbCwgZW1haWwpKTtcbiAgICByZXR1cm4gdXNlciB8fCBudWxsO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZpbmRVc2VyQnlHb29nbGVJZChnb29nbGVJZDogc3RyaW5nKTogUHJvbWlzZTxVc2VyIHwgbnVsbD4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHVzZXJzVGFibGUpXG4gICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5nb29nbGVJZCwgZ29vZ2xlSWQpKTtcbiAgICByZXR1cm4gdXNlciB8fCBudWxsO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZVVzZXJGcm9tR29vZ2xlKGdvb2dsZVVzZXI6IHtcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBnb29nbGVJZDogc3RyaW5nO1xuICAgIHByb2ZpbGVQaWN0dXJlPzogc3RyaW5nO1xuICB9KTogUHJvbWlzZTxVc2VyPiB7XG4gICAgY29uc3QgW3VzZXJdID0gYXdhaXQgZGJcbiAgICAgIC5pbnNlcnQodXNlcnNUYWJsZSlcbiAgICAgIC52YWx1ZXMoe1xuICAgICAgICBlbWFpbDogZ29vZ2xlVXNlci5lbWFpbCxcbiAgICAgICAgbmFtZTogZ29vZ2xlVXNlci5uYW1lLFxuICAgICAgICBnb29nbGVJZDogZ29vZ2xlVXNlci5nb29nbGVJZCxcbiAgICAgICAgcHJvZmlsZVBpY3R1cmU6IGdvb2dsZVVzZXIucHJvZmlsZVBpY3R1cmUsXG4gICAgICAgIGdlbmVyYXRpb25Db3VudDogMCxcbiAgICAgICAgbGFzdExvZ2luQXQ6IG5ldyBEYXRlKCksXG4gICAgICB9KVxuICAgICAgLnJldHVybmluZygpO1xuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIHVwZGF0ZUxhc3RMb2dpbih1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8VXNlcj4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAudXBkYXRlKHVzZXJzVGFibGUpXG4gICAgICAuc2V0KHsgbGFzdExvZ2luQXQ6IG5ldyBEYXRlKCkgfSlcbiAgICAgIC53aGVyZShlcSh1c2Vyc1RhYmxlLmlkLCB1c2VySWQpKVxuICAgICAgLnJldHVybmluZygpO1xuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldFVzZXJCeUlkKGlkOiBzdHJpbmcpOiBQcm9taXNlPFVzZXIgfCBudWxsPiB7XG4gICAgY29uc3QgW3VzZXJdID0gYXdhaXQgZGJcbiAgICAgIC5zZWxlY3QoKVxuICAgICAgLmZyb20odXNlcnNUYWJsZSlcbiAgICAgIC53aGVyZShlcSh1c2Vyc1RhYmxlLmlkLCBpZCkpO1xuICAgIHJldHVybiB1c2VyIHx8IG51bGw7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgdXBkYXRlVXNlckdlbmVyYXRpb25Db3VudChcbiAgICB1c2VySWQ6IHN0cmluZyxcbiAgICBpbmNyZW1lbnQ6IG51bWJlciA9IDEsXG4gICk6IFByb21pc2U8VXNlcj4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAudXBkYXRlKHVzZXJzVGFibGUpXG4gICAgICAuc2V0KHtcbiAgICAgICAgZ2VuZXJhdGlvbkNvdW50OiBzcWxgJHt1c2Vyc1RhYmxlLmdlbmVyYXRpb25Db3VudH0gKyAke2luY3JlbWVudH1gLFxuICAgICAgfSlcbiAgICAgIC53aGVyZShlcSh1c2Vyc1RhYmxlLmlkLCB1c2VySWQpKVxuICAgICAgLnJldHVybmluZygpO1xuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIHJlc2V0VXNlckdlbmVyYXRpb25Db3VudCh1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8VXNlcj4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAudXBkYXRlKHVzZXJzVGFibGUpXG4gICAgICAuc2V0KHtcbiAgICAgICAgZ2VuZXJhdGlvbkNvdW50OiAwLFxuICAgICAgICByZXNldERhdGU6IG5ldyBEYXRlKCksXG4gICAgICB9KVxuICAgICAgLndoZXJlKGVxKHVzZXJzVGFibGUuaWQsIHVzZXJJZCkpXG4gICAgICAucmV0dXJuaW5nKCk7XG4gICAgcmV0dXJuIHVzZXI7XG4gIH1cblxuICAvLyBJbWFnZSBtYW5hZ2VtZW50XG4gIHN0YXRpYyBhc3luYyBzYXZlSW1hZ2UoaW1hZ2VEYXRhOiBOZXdJbWFnZSk6IFByb21pc2U8SW1hZ2U+IHtcbiAgICBjb25zdCBbaW1hZ2VdID0gYXdhaXQgZGIuaW5zZXJ0KGltYWdlc1RhYmxlKS52YWx1ZXMoaW1hZ2VEYXRhKS5yZXR1cm5pbmcoKTtcbiAgICByZXR1cm4gaW1hZ2U7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZ2V0VXNlckltYWdlcyhcbiAgICB1c2VySWQ6IHN0cmluZyxcbiAgICBsaW1pdDogbnVtYmVyID0gNTAsXG4gICAgb2Zmc2V0OiBudW1iZXIgPSAwLFxuICApOiBQcm9taXNlPEltYWdlW10+IHtcbiAgICByZXR1cm4gZGJcbiAgICAgIC5zZWxlY3QoKVxuICAgICAgLmZyb20oaW1hZ2VzVGFibGUpXG4gICAgICAud2hlcmUoZXEoaW1hZ2VzVGFibGUudXNlcklkLCB1c2VySWQpKVxuICAgICAgLm9yZGVyQnkoc3FsYCR7aW1hZ2VzVGFibGUuY3JlYXRlZEF0fSBERVNDYClcbiAgICAgIC5saW1pdChsaW1pdClcbiAgICAgIC5vZmZzZXQob2Zmc2V0KTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBkZWxldGVJbWFnZShpbWFnZUlkOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGJcbiAgICAgIC5kZWxldGUoaW1hZ2VzVGFibGUpXG4gICAgICAud2hlcmUoXG4gICAgICAgIHNxbGAke2ltYWdlc1RhYmxlLmlkfSA9ICR7aW1hZ2VJZH0gQU5EICR7aW1hZ2VzVGFibGUudXNlcklkfSA9ICR7dXNlcklkfWAsXG4gICAgICApO1xuICAgIHJldHVybiByZXN1bHQucm93Q291bnQgPiAwO1xuICB9XG5cbiAgLy8gU3R5bGUgbWFuYWdlbWVudFxuICBzdGF0aWMgYXN5bmMgZ2V0QWxsU3R5bGVzKCk6IFByb21pc2U8U3R5bGVbXT4ge1xuICAgIHJldHVybiBkYi5zZWxlY3QoKS5mcm9tKHN0eWxlc1RhYmxlKTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXRTdHlsZUJ5SWQoaWQ6IHN0cmluZyk6IFByb21pc2U8U3R5bGUgfCBudWxsPiB7XG4gICAgY29uc3QgW3N0eWxlXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHN0eWxlc1RhYmxlKVxuICAgICAgLndoZXJlKGVxKHN0eWxlc1RhYmxlLmlkLCBpZCkpO1xuICAgIHJldHVybiBzdHlsZSB8fCBudWxsO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldFN0eWxlQnlOYW1lKG5hbWU6IHN0cmluZyk6IFByb21pc2U8U3R5bGUgfCBudWxsPiB7XG4gICAgY29uc3QgW3N0eWxlXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHN0eWxlc1RhYmxlKVxuICAgICAgLndoZXJlKGVxKHN0eWxlc1RhYmxlLm5hbWUsIG5hbWUpKTtcbiAgICByZXR1cm4gc3R5bGUgfHwgbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBjcmVhdGVTdHlsZShzdHlsZURhdGE6IFBhcnRpYWw8U3R5bGU+KTogUHJvbWlzZTxTdHlsZT4ge1xuICAgIGNvbnN0IFtzdHlsZV0gPSBhd2FpdCBkYi5pbnNlcnQoc3R5bGVzVGFibGUpLnZhbHVlcyhzdHlsZURhdGEpLnJldHVybmluZygpO1xuICAgIHJldHVybiBzdHlsZTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyB1cGRhdGVTdHlsZShcbiAgICBpZDogc3RyaW5nLFxuICAgIHVwZGF0ZXM6IFBhcnRpYWw8U3R5bGU+LFxuICApOiBQcm9taXNlPFN0eWxlPiB7XG4gICAgY29uc3QgW3N0eWxlXSA9IGF3YWl0IGRiXG4gICAgICAudXBkYXRlKHN0eWxlc1RhYmxlKVxuICAgICAgLnNldCh1cGRhdGVzKVxuICAgICAgLndoZXJlKGVxKHN0eWxlc1RhYmxlLmlkLCBpZCkpXG4gICAgICAucmV0dXJuaW5nKCk7XG4gICAgcmV0dXJuIHN0eWxlO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGRlbGV0ZVN0eWxlKGlkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYi5kZWxldGUoc3R5bGVzVGFibGUpLndoZXJlKGVxKHN0eWxlc1RhYmxlLmlkLCBpZCkpO1xuICAgIHJldHVybiByZXN1bHQucm93Q291bnQgPiAwO1xuICB9XG5cbiAgLy8gQWRtaW4gdXRpbGl0aWVzXG4gIHN0YXRpYyBhc3luYyBnZXRBbGxVc2VycyhcbiAgICBsaW1pdDogbnVtYmVyID0gNTAsXG4gICAgb2Zmc2V0OiBudW1iZXIgPSAwLFxuICApOiBQcm9taXNlPFVzZXJbXT4ge1xuICAgIHJldHVybiBkYlxuICAgICAgLnNlbGVjdCgpXG4gICAgICAuZnJvbSh1c2Vyc1RhYmxlKVxuICAgICAgLm9yZGVyQnkoc3FsYCR7dXNlcnNUYWJsZS5yZXNldERhdGV9IERFU0NgKVxuICAgICAgLmxpbWl0KGxpbWl0KVxuICAgICAgLm9mZnNldChvZmZzZXQpO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldFVzZXJDb3VudCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIGNvbnN0IFtyZXN1bHRdID0gYXdhaXQgZGJcbiAgICAgIC5zZWxlY3QoeyBjb3VudDogc3FsPG51bWJlcj5gY291bnQoKilgIH0pXG4gICAgICAuZnJvbSh1c2Vyc1RhYmxlKTtcbiAgICByZXR1cm4gcmVzdWx0LmNvdW50O1xuICB9XG5cbiAgLy8gU2Vzc2lvbiBtYW5hZ2VtZW50XG4gIHN0YXRpYyBhc3luYyBjcmVhdGVTZXNzaW9uKHNlc3Npb25EYXRhOiBOZXdTZXNzaW9uKTogUHJvbWlzZTxTZXNzaW9uPiB7XG4gICAgY29uc3QgW3Nlc3Npb25dID0gYXdhaXQgZGJcbiAgICAgIC5pbnNlcnQoc2Vzc2lvbnNUYWJsZSlcbiAgICAgIC52YWx1ZXMoc2Vzc2lvbkRhdGEpXG4gICAgICAucmV0dXJuaW5nKCk7XG4gICAgcmV0dXJuIHNlc3Npb247XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmluZFNlc3Npb25CeVRva2VuKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPFNlc3Npb24gfCBudWxsPiB7XG4gICAgY29uc3QgW3Nlc3Npb25dID0gYXdhaXQgZGJcbiAgICAgIC5zZWxlY3QoKVxuICAgICAgLmZyb20oc2Vzc2lvbnNUYWJsZSlcbiAgICAgIC53aGVyZShlcShzZXNzaW9uc1RhYmxlLnRva2VuLCB0b2tlbikpO1xuICAgIHJldHVybiBzZXNzaW9uIHx8IG51bGw7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZGVsZXRlU2Vzc2lvbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGJcbiAgICAgIC5kZWxldGUoc2Vzc2lvbnNUYWJsZSlcbiAgICAgIC53aGVyZShlcShzZXNzaW9uc1RhYmxlLnRva2VuLCB0b2tlbikpO1xuICAgIHJldHVybiByZXN1bHQucm93Q291bnQgPiAwO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGRlbGV0ZUV4cGlyZWRTZXNzaW9ucygpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiXG4gICAgICAuZGVsZXRlKHNlc3Npb25zVGFibGUpXG4gICAgICAud2hlcmUoc3FsYCR7c2Vzc2lvbnNUYWJsZS5leHBpcmVzQXR9IDwgJHtuZXcgRGF0ZSgpfWApO1xuICAgIHJldHVybiByZXN1bHQucm93Q291bnQ7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZGVsZXRlVXNlclNlc3Npb25zKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYlxuICAgICAgLmRlbGV0ZShzZXNzaW9uc1RhYmxlKVxuICAgICAgLndoZXJlKGVxKHNlc3Npb25zVGFibGUudXNlcklkLCB1c2VySWQpKTtcbiAgICByZXR1cm4gcmVzdWx0LnJvd0NvdW50O1xuICB9XG59ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2xpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2xpYi9hdXRoLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9saWIvYXV0aC50c1wiO2ltcG9ydCB7IFNpZ25KV1QsIGp3dFZlcmlmeSB9IGZyb20gXCJqb3NlXCI7XG5pbXBvcnQgeyBlcSB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4vZGF0YWJhc2UuanNcIjtcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4vZGIuanNcIjtcbmltcG9ydCB7IHVzZXJzVGFibGUgfSBmcm9tIFwiLi9zY2hlbWEuanNcIjtcbmltcG9ydCB0eXBlIHsgVXNlciB9IGZyb20gXCIuL3NjaGVtYS5qc1wiO1xuXG4vLyBKV1Qgc2VjcmV0IGtleSAtIHNob3VsZCBiZSBzZXQgaW4gZW52aXJvbm1lbnQgdmFyaWFibGVzXG5jb25zdCBKV1RfU0VDUkVUID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKFxuICBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8XG4gICAgXCJ5b3VyLXN1cGVyLXNlY3JldC1qd3Qta2V5LWNoYW5nZS10aGlzLWluLXByb2R1Y3Rpb25cIixcbik7XG5cbmNvbnN0IEpXVF9JU1NVRVIgPSBcIm1hZGFyLWFpXCI7XG5jb25zdCBKV1RfQVVESUVOQ0UgPSBcIm1hZGFyLWFpLXVzZXJzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aFRva2VuIHtcbiAgdXNlcklkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZXhwOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR29vZ2xlVXNlckluZm8ge1xuICBpZDogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICB2ZXJpZmllZF9lbWFpbDogYm9vbGVhbjtcbiAgbmFtZTogc3RyaW5nO1xuICBnaXZlbl9uYW1lOiBzdHJpbmc7XG4gIGZhbWlseV9uYW1lOiBzdHJpbmc7XG4gIHBpY3R1cmU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcbiAgLy8gR2VuZXJhdGUgSldUIHRva2VuIGZvciBhdXRoZW50aWNhdGVkIHVzZXJcbiAgc3RhdGljIGFzeW5jIGdlbmVyYXRlVG9rZW4odXNlcjogVXNlcik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3Qgand0ID0gYXdhaXQgbmV3IFNpZ25KV1Qoe1xuICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICBuYW1lOiB1c2VyLm5hbWUgfHwgXCJcIixcbiAgICB9KVxuICAgICAgLnNldFByb3RlY3RlZEhlYWRlcih7IGFsZzogXCJIUzI1NlwiIH0pXG4gICAgICAuc2V0SXNzdWVkQXQoKVxuICAgICAgLnNldElzc3VlcihKV1RfSVNTVUVSKVxuICAgICAgLnNldEF1ZGllbmNlKEpXVF9BVURJRU5DRSlcbiAgICAgIC5zZXRFeHBpcmF0aW9uVGltZShcIjdkXCIpIC8vIFRva2VuIGV4cGlyZXMgaW4gNyBkYXlzXG4gICAgICAuc2lnbihKV1RfU0VDUkVUKTtcblxuICAgIHJldHVybiBqd3Q7XG4gIH1cblxuICAvLyBWZXJpZnkgSldUIHRva2VuIGFuZCByZXR1cm4gcGF5bG9hZFxuICBzdGF0aWMgYXN5bmMgdmVyaWZ5VG9rZW4odG9rZW46IHN0cmluZyk6IFByb21pc2U8QXV0aFRva2VuIHwgbnVsbD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHBheWxvYWQgfSA9IGF3YWl0IGp3dFZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCwge1xuICAgICAgICBpc3N1ZXI6IEpXVF9JU1NVRVIsXG4gICAgICAgIGF1ZGllbmNlOiBKV1RfQVVESUVOQ0UsXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHBheWxvYWQgYXMgdW5rbm93biBhcyBBdXRoVG9rZW47XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJKV1QgdmVyaWZpY2F0aW9uIGZhaWxlZDpcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gRXh0cmFjdCB1c2VyIGZyb20gcmVxdWVzdCBBdXRob3JpemF0aW9uIGhlYWRlclxuICBzdGF0aWMgYXN5bmMgZ2V0VXNlckZyb21SZXF1ZXN0KHJlcTogUmVxdWVzdCk6IFByb21pc2U8VXNlciB8IG51bGw+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcS5oZWFkZXJzLmdldChcIkF1dGhvcml6YXRpb25cIik7XG4gICAgICBpZiAoIWF1dGhIZWFkZXIgfHwgIWF1dGhIZWFkZXIuc3RhcnRzV2l0aChcIkJlYXJlciBcIikpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuID0gYXV0aEhlYWRlci5zdWJzdHJpbmcoNyk7IC8vIFJlbW92ZSAnQmVhcmVyICcgcHJlZml4XG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgdGhpcy52ZXJpZnlUb2tlbih0b2tlbik7XG5cbiAgICAgIGlmICghcGF5bG9hZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gR2V0IGZyZXNoIHVzZXIgZGF0YSBmcm9tIGRhdGFiYXNlXG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLmdldFVzZXJCeUlkKHBheWxvYWQudXNlcklkKTtcbiAgICAgIHJldHVybiB1c2VyO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZXh0cmFjdGluZyB1c2VyIGZyb20gcmVxdWVzdDpcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gR29vZ2xlIE9BdXRoOiBFeGNoYW5nZSBhdXRob3JpemF0aW9uIGNvZGUgZm9yIHVzZXIgaW5mb1xuICBzdGF0aWMgYXN5bmMgZXhjaGFuZ2VHb29nbGVDb2RlKFxuICAgIGNvZGU6IHN0cmluZyxcbiAgKTogUHJvbWlzZTxHb29nbGVVc2VySW5mbyB8IG51bGw+IHtcbiAgICB0cnkge1xuICAgICAgLy8gRXhjaGFuZ2UgY29kZSBmb3IgYWNjZXNzIHRva2VuXG4gICAgICBjb25zdCB0b2tlblJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlblwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAgICAgICBjb2RlLFxuICAgICAgICAgIGNsaWVudF9pZDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCB8fCBcIlwiLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUIHx8IFwiXCIsXG4gICAgICAgICAgcmVkaXJlY3RfdXJpOiBwcm9jZXNzLmVudi5HT09HTEVfUkVESVJFQ1RfVVJJIHx8IFwiXCIsXG4gICAgICAgICAgZ3JhbnRfdHlwZTogXCJhdXRob3JpemF0aW9uX2NvZGVcIixcbiAgICAgICAgfSksXG4gICAgICB9KTtcblxuICAgICAgaWYgKCF0b2tlblJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBleGNoYW5nZSBjb2RlIGZvciB0b2tlblwiKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG9rZW5EYXRhID0gYXdhaXQgdG9rZW5SZXNwb25zZS5qc29uKCk7XG4gICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHRva2VuRGF0YS5hY2Nlc3NfdG9rZW47XG5cbiAgICAgIC8vIEdldCB1c2VyIGluZm8gZnJvbSBHb29nbGVcbiAgICAgIGNvbnN0IHVzZXJSZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICBgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YyL3VzZXJpbmZvP2FjY2Vzc190b2tlbj0ke2FjY2Vzc1Rva2VufWAsXG4gICAgICApO1xuXG4gICAgICBpZiAoIXVzZXJSZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IHVzZXIgaW5mbyBmcm9tIEdvb2dsZVwiKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXNlckRhdGE6IEdvb2dsZVVzZXJJbmZvID0gYXdhaXQgdXNlclJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHJldHVybiB1c2VyRGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkdvb2dsZSBPQXV0aCBlcnJvcjpcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gR29vZ2xlIE9BdXRoOiBHZXQgb3IgY3JlYXRlIHVzZXIgZnJvbSBHb29nbGUgcHJvZmlsZVxuICBzdGF0aWMgYXN5bmMgYXV0aGVudGljYXRlV2l0aEdvb2dsZShcbiAgICBnb29nbGVVc2VyOiBHb29nbGVVc2VySW5mbyxcbiAgKTogUHJvbWlzZTx7IHVzZXI6IFVzZXI7IHRva2VuOiBzdHJpbmc7IGlzTmV3VXNlcjogYm9vbGVhbiB9PiB7XG4gICAgLy8gQ2hlY2sgaWYgdXNlciBhbHJlYWR5IGV4aXN0cyBieSBHb29nbGUgSURcbiAgICBsZXQgdXNlciA9IGF3YWl0IERhdGFiYXNlU2VydmljZS5maW5kVXNlckJ5R29vZ2xlSWQoZ29vZ2xlVXNlci5pZCk7XG4gICAgbGV0IGlzTmV3VXNlciA9IGZhbHNlO1xuXG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICAvLyBDaGVjayBpZiB1c2VyIGV4aXN0cyBieSBlbWFpbFxuICAgICAgdXNlciA9IGF3YWl0IERhdGFiYXNlU2VydmljZS5maW5kVXNlckJ5RW1haWwoZ29vZ2xlVXNlci5lbWFpbCk7XG5cbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyB1c2VyIHdpdGggR29vZ2xlIElEXG4gICAgICAgIGNvbnN0IFt1cGRhdGVkVXNlcl0gPSBhd2FpdCBkYlxuICAgICAgICAgIC51cGRhdGUodXNlcnNUYWJsZSlcbiAgICAgICAgICAuc2V0KHtcbiAgICAgICAgICAgIGdvb2dsZUlkOiBnb29nbGVVc2VyLmlkLFxuICAgICAgICAgICAgcHJvZmlsZVBpY3R1cmU6IGdvb2dsZVVzZXIucGljdHVyZSxcbiAgICAgICAgICAgIGxhc3RMb2dpbkF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLndoZXJlKGVxKHVzZXJzVGFibGUuaWQsIHVzZXIuaWQpKVxuICAgICAgICAgIC5yZXR1cm5pbmcoKTtcbiAgICAgICAgdXNlciA9IHVwZGF0ZWRVc2VyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB1c2VyXG4gICAgICAgIGNvbnN0IHVzZXJEYXRhID0ge1xuICAgICAgICAgIGVtYWlsOiBnb29nbGVVc2VyLmVtYWlsLFxuICAgICAgICAgIG5hbWU6IGdvb2dsZVVzZXIubmFtZSxcbiAgICAgICAgICBnb29nbGVJZDogZ29vZ2xlVXNlci5pZCxcbiAgICAgICAgICBwcm9maWxlUGljdHVyZTogZ29vZ2xlVXNlci5waWN0dXJlLFxuICAgICAgICAgIC8vIEF1dG8tYXNzaWduIGFkbWluIHJvbGUgaWYgdGhpcyBpcyB0aGUgbWFzdGVyIGFkbWluIGVtYWlsXG4gICAgICAgICAgcm9sZTogdGhpcy5pc01hc3RlckFkbWluKGdvb2dsZVVzZXIuZW1haWwpID8gXCJhZG1pblwiIDogXCJ1c2VyXCIsXG4gICAgICAgIH07XG4gICAgICAgIHVzZXIgPSBhd2FpdCBEYXRhYmFzZVNlcnZpY2UuY3JlYXRlVXNlckZyb21Hb29nbGUodXNlckRhdGEpO1xuICAgICAgICBpc05ld1VzZXIgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVcGRhdGUgbGFzdCBsb2dpbiBmb3IgZXhpc3RpbmcgdXNlclxuICAgICAgdXNlciA9IGF3YWl0IERhdGFiYXNlU2VydmljZS51cGRhdGVMYXN0TG9naW4odXNlci5pZCk7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhdGUgSldUIHRva2VuXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmdlbmVyYXRlVG9rZW4odXNlcik7XG5cbiAgICByZXR1cm4geyB1c2VyLCB0b2tlbiwgaXNOZXdVc2VyIH07XG4gIH1cblxuICAvLyBHZW5lcmF0ZSBHb29nbGUgT0F1dGggVVJMXG4gIHN0YXRpYyBnZXRHb29nbGVBdXRoVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgYmFzZVVybCA9IFwiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL3YyL2F1dGhcIjtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAgIGNsaWVudF9pZDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCB8fCBcIlwiLFxuICAgICAgcmVkaXJlY3RfdXJpOiBwcm9jZXNzLmVudi5HT09HTEVfUkVESVJFQ1RfVVJJIHx8IFwiXCIsXG4gICAgICByZXNwb25zZV90eXBlOiBcImNvZGVcIixcbiAgICAgIHNjb3BlOiBcIm9wZW5pZCBlbWFpbCBwcm9maWxlXCIsXG4gICAgICBhY2Nlc3NfdHlwZTogXCJvZmZsaW5lXCIsXG4gICAgICBwcm9tcHQ6IFwiY29uc2VudFwiLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGAke2Jhc2VVcmx9PyR7cGFyYW1zLnRvU3RyaW5nKCl9YDtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIHVzZXIgaXMgbWFzdGVyIGFkbWluXG4gIHN0YXRpYyBpc01hc3RlckFkbWluKGVtYWlsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBtYXN0ZXJBZG1pbkVtYWlsID0gXCJhaG1lZC5zaGVha2hAZ21haWwuY29tXCI7XG4gICAgcmV0dXJuIGVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IG1hc3RlckFkbWluRW1haWwudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIHVzZXIgaGFzIGFkbWluIHJvbGVcbiAgc3RhdGljIGlzQWRtaW4odXNlcjogVXNlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB1c2VyLnJvbGUgPT09IFwiYWRtaW5cIiB8fCB0aGlzLmlzTWFzdGVyQWRtaW4odXNlci5lbWFpbCk7XG4gIH1cblxuICAvLyBQcm9tb3RlIHVzZXIgdG8gYWRtaW4gKG9ubHkgbWFzdGVyIGFkbWluIGNhbiBkbyB0aGlzKVxuICBzdGF0aWMgYXN5bmMgcHJvbW90ZVRvQWRtaW4oXG4gICAgdXNlcklkOiBzdHJpbmcsXG4gICAgcHJvbW90aW5nVXNlcjogVXNlcixcbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKCF0aGlzLmlzTWFzdGVyQWRtaW4ocHJvbW90aW5nVXNlci5lbWFpbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgbWFzdGVyIGFkbWluIGNhbiBwcm9tb3RlIHVzZXJzIHRvIGFkbWluXCIpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYlxuICAgICAgICAudXBkYXRlKHVzZXJzVGFibGUpXG4gICAgICAgIC5zZXQoeyByb2xlOiBcImFkbWluXCIgfSlcbiAgICAgICAgLndoZXJlKGVxKHVzZXJzVGFibGUuaWQsIHVzZXJJZCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcHJvbW90ZSB1c2VyIHRvIGFkbWluOlwiLCBlcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gRGVtb3RlIGFkbWluIHVzZXIgKG9ubHkgbWFzdGVyIGFkbWluIGNhbiBkbyB0aGlzKVxuICBzdGF0aWMgYXN5bmMgZGVtb3RlRnJvbUFkbWluKFxuICAgIHVzZXJJZDogc3RyaW5nLFxuICAgIGRlbW90aW5nVXNlcjogVXNlcixcbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKCF0aGlzLmlzTWFzdGVyQWRtaW4oZGVtb3RpbmdVc2VyLmVtYWlsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSBtYXN0ZXIgYWRtaW4gY2FuIGRlbW90ZSBhZG1pbiB1c2Vyc1wiKTtcbiAgICB9XG5cbiAgICAvLyBDYW5ub3QgZGVtb3RlIG1hc3RlciBhZG1pblxuICAgIGNvbnN0IHRhcmdldFVzZXIgPSBhd2FpdCBEYXRhYmFzZVNlcnZpY2UuZ2V0VXNlckJ5SWQodXNlcklkKTtcbiAgICBpZiAodGFyZ2V0VXNlciAmJiB0aGlzLmlzTWFzdGVyQWRtaW4odGFyZ2V0VXNlci5lbWFpbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBkZW1vdGUgbWFzdGVyIGFkbWluXCIpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkYlxuICAgICAgICAudXBkYXRlKHVzZXJzVGFibGUpXG4gICAgICAgIC5zZXQoeyByb2xlOiBcInVzZXJcIiB9KVxuICAgICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5pZCwgdXNlcklkKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBkZW1vdGUgdXNlciBmcm9tIGFkbWluOlwiLCBlcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9saWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9saWIvbWlkZGxld2FyZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvbGliL21pZGRsZXdhcmUudHNcIjtpbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gXCIuL2F1dGguanNcIjtcbmltcG9ydCB0eXBlIHsgVXNlciB9IGZyb20gXCIuL3NjaGVtYS5qc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhlbnRpY2F0ZWRSZXF1ZXN0IGV4dGVuZHMgUmVxdWVzdCB7XG4gIHVzZXI6IFVzZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aFJlc3VsdCB7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIHVzZXI/OiBVc2VyO1xuICBlcnJvcj86IHN0cmluZztcbn1cblxuLy8gTWlkZGxld2FyZSB0byByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZUF1dGgocmVxOiBSZXF1ZXN0KTogUHJvbWlzZTxBdXRoUmVzdWx0PiB7XG4gIHRyeSB7XG4gICAgLy8gUmVhbCBhdXRoZW50aWNhdGlvbiBpcyBub3cgZW5hYmxlZCAtIG5vIGRldiBtb2RlXG5cbiAgICBjb25zdCB1c2VyID0gYXdhaXQgQXV0aFNlcnZpY2UuZ2V0VXNlckZyb21SZXF1ZXN0KHJlcSk7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogXCJBdXRoZW50aWNhdGlvbiByZXF1aXJlZC4gUGxlYXNlIGxvZyBpbi5cIixcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICB1c2VyLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkF1dGhlbnRpY2F0aW9uIG1pZGRsZXdhcmUgZXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJBdXRoZW50aWNhdGlvbiBmYWlsZWRcIixcbiAgICB9O1xuICB9XG59XG5cbi8vIEhlbHBlciB0byBjcmVhdGUgdW5hdXRob3JpemVkIHJlc3BvbnNlXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVW5hdXRob3JpemVkUmVzcG9uc2UobWVzc2FnZT86IHN0cmluZyk6IFJlc3BvbnNlIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBtZXNzYWdlIHx8IFwiQXV0aGVudGljYXRpb24gcmVxdWlyZWRcIixcbiAgICB9KSxcbiAgICB7XG4gICAgICBzdGF0dXM6IDQwMSxcbiAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICB9LFxuICApO1xufVxuXG4vLyBPcHRpb25hbCBhdXRoZW50aWNhdGlvbiAoZG9lc24ndCBmYWlsIGlmIG5vIGF1dGgpXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3B0aW9uYWxBdXRoKHJlcTogUmVxdWVzdCk6IFByb21pc2U8VXNlciB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICAvLyBSZWFsIGF1dGhlbnRpY2F0aW9uIGlzIG5vdyBlbmFibGVkIC0gbm8gZGV2IG1vZGVcblxuICAgIHJldHVybiBhd2FpdCBBdXRoU2VydmljZS5nZXRVc2VyRnJvbVJlcXVlc3QocmVxKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiT3B0aW9uYWwgYXV0aCBlcnJvcjpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3JvdXRlcy91c2VyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzL3VzZXIudHNcIjtpbXBvcnQgeyBSZXF1ZXN0SGFuZGxlciB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vbGliL2RhdGFiYXNlLmpzXCI7XG5pbXBvcnQge1xuICByZXF1aXJlQXV0aCxcbiAgY3JlYXRlVW5hdXRob3JpemVkUmVzcG9uc2UsXG59IGZyb20gXCIuLi8uLi9saWIvbWlkZGxld2FyZS5qc1wiO1xuaW1wb3J0IHR5cGUgeyBVc2VyU3RhdHNSZXNwb25zZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYXBpLmpzXCI7XG5cbmNvbnN0IE1BWF9HRU5FUkFUSU9OU19QRVJfTU9OVEggPSAzMDtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZVVzZXJTdGF0czogUmVxdWVzdEhhbmRsZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBDcmVhdGUgYSBSZXF1ZXN0IG9iamVjdCBmb3IgYXV0aCBtaWRkbGV3YXJlXG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXEub3JpZ2luYWxVcmwsIGBodHRwOi8vJHtyZXEuaGVhZGVycy5ob3N0fWApO1xuICAgIGNvbnN0IHdlYlJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwudG9TdHJpbmcoKSwge1xuICAgICAgbWV0aG9kOiByZXEubWV0aG9kLFxuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMgYXMgSGVhZGVyc0luaXQsXG4gICAgfSk7XG5cbiAgICAvLyBSZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgY29uc3QgYXV0aFJlc3VsdCA9IGF3YWl0IHJlcXVpcmVBdXRoKHdlYlJlcXVlc3QpO1xuICAgIGlmICghYXV0aFJlc3VsdC5zdWNjZXNzIHx8ICFhdXRoUmVzdWx0LnVzZXIpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogYXV0aFJlc3VsdC5lcnJvciB8fCBcIlVuYXV0aG9yaXplZFwiLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IHVzZXIgPSBhdXRoUmVzdWx0LnVzZXI7XG5cbiAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIHJlc2V0IHRoZSBjb3VudCBmb3IgbmV3IG1vbnRoXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHJlc2V0RGF0ZSA9IHVzZXIucmVzZXREYXRlID8gbmV3IERhdGUodXNlci5yZXNldERhdGUpIDogbmV3IERhdGUoKTtcbiAgICBjb25zdCBtb250aHNEaWZmID1cbiAgICAgIChjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpIC0gcmVzZXREYXRlLmdldEZ1bGxZZWFyKCkpICogMTIgK1xuICAgICAgY3VycmVudERhdGUuZ2V0TW9udGgoKSAtXG4gICAgICByZXNldERhdGUuZ2V0TW9udGgoKTtcblxuICAgIGlmIChtb250aHNEaWZmID49IDEpIHtcbiAgICAgIHVzZXIgPSBhd2FpdCBEYXRhYmFzZVNlcnZpY2UucmVzZXRVc2VyR2VuZXJhdGlvbkNvdW50KHVzZXIuaWQpO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXJHZW5lcmF0aW9uQ291bnQgPSB1c2VyLmdlbmVyYXRpb25Db3VudCB8fCAwO1xuICAgIGNvbnN0IHJlbWFpbmluZ0dlbmVyYXRpb25zID0gTWF0aC5tYXgoXG4gICAgICAwLFxuICAgICAgTUFYX0dFTkVSQVRJT05TX1BFUl9NT05USCAtIHVzZXJHZW5lcmF0aW9uQ291bnQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogVXNlclN0YXRzUmVzcG9uc2UgPSB7XG4gICAgICB1c2VyOiB7XG4gICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgbmFtZTogdXNlci5uYW1lIHx8IFwiXCIsXG4gICAgICAgIGdlbmVyYXRpb25Db3VudDogdXNlckdlbmVyYXRpb25Db3VudCxcbiAgICAgICAgcmVzZXREYXRlOiB1c2VyLnJlc2V0RGF0ZT8udG9JU09TdHJpbmcoKSB8fCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICB9LFxuICAgICAgcmVtYWluaW5nR2VuZXJhdGlvbnMsXG4gICAgICBtYXhHZW5lcmF0aW9uczogTUFYX0dFTkVSQVRJT05TX1BFUl9NT05USCxcbiAgICB9O1xuXG4gICAgcmVzLmpzb24ocmVzcG9uc2VEYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVXNlciBzdGF0cyBlbmRwb2ludCBlcnJvcjpcIiwgZXJyb3IpO1xuXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJGYWlsZWQgdG8gZ2V0IHVzZXIgc3RhdHNcIixcbiAgICB9KTtcbiAgfVxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzL3N0eWxlcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvc2VydmVyL3JvdXRlcy9zdHlsZXMudHNcIjtpbXBvcnQgeyBSZXF1ZXN0SGFuZGxlciB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vbGliL2RhdGFiYXNlLmpzXCI7XG5pbXBvcnQgdHlwZSB7IFN0eWxlc1Jlc3BvbnNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9hcGkuanNcIjtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZVN0eWxlczogUmVxdWVzdEhhbmRsZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBHZXQgYWxsIHN0eWxlcyBmcm9tIGRhdGFiYXNlXG4gICAgY29uc3Qgc3R5bGVzID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLmdldEFsbFN0eWxlcygpO1xuXG4gICAgLy8gVHJhbnNmb3JtIGRhdGFiYXNlIHN0eWxlcyB0byBBUEkgZm9ybWF0XG4gICAgY29uc3QgZm9ybWF0dGVkU3R5bGVzID0gc3R5bGVzLm1hcCgoc3R5bGUpID0+ICh7XG4gICAgICBpZDogc3R5bGUuaWQsXG4gICAgICBuYW1lOiBzdHlsZS5uYW1lIHx8IFwiXCIsXG4gICAgICBkZXNjcmlwdGlvbjogc3R5bGUuZGVzY3JpcHRpb24gfHwgXCJcIixcbiAgICAgIHRodW1ibmFpbDogc3R5bGUudGh1bWJuYWlsIHx8IFwiXCIsXG4gICAgICBwcm9tcHRKc29uOiBzdHlsZS5wcm9tcHRKc29uIHx8IHt9LFxuICAgIH0pKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlRGF0YTogU3R5bGVzUmVzcG9uc2UgPSB7XG4gICAgICBzdHlsZXM6IGZvcm1hdHRlZFN0eWxlcyxcbiAgICB9O1xuXG4gICAgcmVzLmpzb24ocmVzcG9uc2VEYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiU3R5bGVzIGVuZHBvaW50IGVycm9yOlwiLCBlcnJvcik7XG5cbiAgICBjb25zdCByZXNwb25zZURhdGE6IFN0eWxlc1Jlc3BvbnNlID0ge1xuICAgICAgc3R5bGVzOiBbXSxcbiAgICB9O1xuXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24ocmVzcG9uc2VEYXRhKTtcbiAgfVxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzL2F1dGgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXMvYXV0aC50c1wiO2ltcG9ydCB0eXBlIHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vbGliL2F1dGguanNcIjtcblxuLy8gR29vZ2xlIE9BdXRoIFVSTCBlbmRwb2ludFxuZXhwb3J0IGNvbnN0IGhhbmRsZUdvb2dsZUF1dGggPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gR2VuZXJhdGUgR29vZ2xlIE9BdXRoIFVSTFxuICAgIGNvbnN0IGF1dGhVcmwgPSBBdXRoU2VydmljZS5nZXRHb29nbGVBdXRoVXJsKCk7XG5cbiAgICByZXMuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgYXV0aFVybCxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiR29vZ2xlIE9BdXRoIFVSTCBnZW5lcmF0aW9uIGVycm9yOlwiLCBlcnJvcik7XG5cbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBcIkZhaWxlZCB0byBnZW5lcmF0ZSBhdXRoZW50aWNhdGlvbiBVUkxcIixcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gR29vZ2xlIE9BdXRoIGNhbGxiYWNrIGVuZHBvaW50XG5leHBvcnQgY29uc3QgaGFuZGxlQXV0aENhbGxiYWNrID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgY29kZSwgZXJyb3IgfSA9IHJlcS5xdWVyeTtcblxuICAgIC8vIEhhbmRsZSBPQXV0aCBlcnJvcnNcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogYE9BdXRoIGVycm9yOiAke2Vycm9yfWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIWNvZGUgfHwgdHlwZW9mIGNvZGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogXCJBdXRob3JpemF0aW9uIGNvZGUgbm90IHByb3ZpZGVkXCIsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBFeGNoYW5nZSBjb2RlIGZvciB1c2VyIGluZm9cbiAgICBjb25zdCBnb29nbGVVc2VyID0gYXdhaXQgQXV0aFNlcnZpY2UuZXhjaGFuZ2VHb29nbGVDb2RlKGNvZGUpO1xuICAgIGlmICghZ29vZ2xlVXNlcikge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIkZhaWxlZCB0byBhdXRoZW50aWNhdGUgd2l0aCBHb29nbGVcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEF1dGhlbnRpY2F0ZSBvciBjcmVhdGUgdXNlclxuICAgIGNvbnN0IHsgdXNlciwgdG9rZW4sIGlzTmV3VXNlciB9ID1cbiAgICAgIGF3YWl0IEF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0ZVdpdGhHb29nbGUoZ29vZ2xlVXNlcik7XG5cbiAgICAvLyBSZWRpcmVjdCB0byBmcm9udGVuZCBjYWxsYmFjayBwYWdlIHdpdGggdG9rZW4gYW5kIHVzZXIgZGF0YSBpbiBVUkxcbiAgICBjb25zdCBjYWxsYmFja1VybCA9IG5ldyBVUkwoXCIvYXIvYXV0aC9jYWxsYmFja1wiLCBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiKTtcbiAgICBjYWxsYmFja1VybC5zZWFyY2hQYXJhbXMuc2V0KFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIGNhbGxiYWNrVXJsLnNlYXJjaFBhcmFtcy5zZXQoXG4gICAgICBcInVzZXJcIixcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgIHByb2ZpbGVQaWN0dXJlOiB1c2VyLnByb2ZpbGVQaWN0dXJlLFxuICAgICAgICBnZW5lcmF0aW9uQ291bnQ6IHVzZXIuZ2VuZXJhdGlvbkNvdW50LFxuICAgICAgICByZXNldERhdGU6IHVzZXIucmVzZXREYXRlPy50b0lTT1N0cmluZygpLFxuICAgICAgfSksXG4gICAgKTtcbiAgICBjYWxsYmFja1VybC5zZWFyY2hQYXJhbXMuc2V0KFwiaXNOZXdVc2VyXCIsIGlzTmV3VXNlci50b1N0cmluZygpKTtcblxuICAgIHJlcy5yZWRpcmVjdChjYWxsYmFja1VybC50b1N0cmluZygpKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiR29vZ2xlIE9BdXRoIGNhbGxiYWNrIGVycm9yOlwiLCBlcnJvcik7XG5cbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZFwiLFxuICAgIH0pO1xuICB9XG59O1xuXG4vLyBMb2dvdXQgZW5kcG9pbnRcbmV4cG9ydCBjb25zdCBoYW5kbGVMb2dvdXQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gRm9yIG5vdywgbG9nb3V0IGlzIGhhbmRsZWQgY2xpZW50LXNpZGUgKGNsZWFyaW5nIEpXVClcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCB3ZSBjb3VsZCBhZGQgdG9rZW4gYmxhY2tsaXN0aW5nIGhlcmVcblxuICAgIHJlcy5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIkxvZ2dlZCBvdXQgc3VjY2Vzc2Z1bGx5XCIsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkxvZ291dCBlcnJvcjpcIiwgZXJyb3IpO1xuXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJMb2dvdXQgZmFpbGVkXCIsXG4gICAgfSk7XG4gIH1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9pbmRleC50c1wiO2ltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuXG4vLyBJbXBvcnQgRXhwcmVzcyByb3V0ZSBoYW5kbGVyc1xuaW1wb3J0IHsgaGFuZGxlVXNlclN0YXRzIH0gZnJvbSBcIi4vcm91dGVzL3VzZXIuanNcIjtcbmltcG9ydCB7IGhhbmRsZVN0eWxlcyB9IGZyb20gXCIuL3JvdXRlcy9zdHlsZXMuanNcIjtcbmltcG9ydCB7XG4gIGhhbmRsZUdvb2dsZUF1dGgsXG4gIGhhbmRsZUF1dGhDYWxsYmFjayxcbiAgaGFuZGxlTG9nb3V0LFxufSBmcm9tIFwiLi9yb3V0ZXMvYXV0aC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2VydmVyKCkge1xuICBjb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbiAgLy8gTWlkZGxld2FyZVxuICBhcHAudXNlKGNvcnMoKSk7XG4gIGFwcC51c2UoZXhwcmVzcy5qc29uKHsgbGltaXQ6IFwiMTBtYlwiIH0pKTtcbiAgYXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XG5cbiAgLy8gQVBJIFJvdXRlc1xuICBhcHAuZ2V0KFwiL3BpbmdcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIk1BREFSIEFJIEV4cHJlc3MgU2VydmVyIGlzIHJ1bm5pbmchXCIgfSk7XG4gIH0pO1xuXG4gIGFwcC5nZXQoXCIvdXNlclwiLCBoYW5kbGVVc2VyU3RhdHMpO1xuICBhcHAuZ2V0KFwiL3N0eWxlc1wiLCBoYW5kbGVTdHlsZXMpO1xuXG4gIC8vIEF1dGggcm91dGVzXG4gIGFwcC5nZXQoXCIvYXV0aC9nb29nbGVcIiwgaGFuZGxlR29vZ2xlQXV0aCk7XG4gIGFwcC5nZXQoXCIvYXV0aC9jYWxsYmFja1wiLCBoYW5kbGVBdXRoQ2FsbGJhY2spO1xuICBhcHAucG9zdChcIi9hdXRoL2xvZ291dFwiLCBoYW5kbGVMb2dvdXQpO1xuXG4gIC8vIE1pZ3JhdGlvbiByb3V0ZSAoZGV2ZWxvcG1lbnQgb25seSlcbiAgYXBwLmdldChcIi9ydW4tbWlncmF0aW9uXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IG5lb24gfSA9IGF3YWl0IGltcG9ydChcIkBuZW9uZGF0YWJhc2Uvc2VydmVybGVzc1wiKTtcblxuICAgICAgaWYgKCFwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiREFUQUJBU0VfVVJMIG5vdCBjb25maWd1cmVkXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzcWwgPSBuZW9uKHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCk7XG5cbiAgICAgIGNvbnN0IG1pZ3JhdGlvblNRTCA9IGBcbiAgICAgICAgLS0gRHJvcCBleGlzdGluZyB0YWJsZXMgaWYgdGhleSBleGlzdCB0byBzdGFydCBmcmVzaFxuICAgICAgICBEUk9QIFRBQkxFIElGIEVYSVNUUyBcImltYWdlc1wiIENBU0NBREU7XG4gICAgICAgIERST1AgVEFCTEUgSUYgRVhJU1RTIFwic2Vzc2lvbnNcIiBDQVNDQURFO1xuICAgICAgICBEUk9QIFRBQkxFIElGIEVYSVNUUyBcInN0eWxlc1wiIENBU0NBREU7XG4gICAgICAgIERST1AgVEFCTEUgSUYgRVhJU1RTIFwidXNlcnNcIiBDQVNDQURFO1xuXG4gICAgICAgIC0tIENyZWF0ZSB1c2VycyB0YWJsZVxuICAgICAgICBDUkVBVEUgVEFCTEUgXCJ1c2Vyc1wiIChcbiAgICAgICAgICBcImlkXCIgdXVpZCBQUklNQVJZIEtFWSBERUZBVUxUIGdlbl9yYW5kb21fdXVpZCgpIE5PVCBOVUxMLFxuICAgICAgICAgIFwiZW1haWxcIiB0ZXh0IE5PVCBOVUxMLFxuICAgICAgICAgIFwibmFtZVwiIHRleHQsXG4gICAgICAgICAgXCJnb29nbGVfaWRcIiB0ZXh0LFxuICAgICAgICAgIFwicHJvZmlsZV9waWN0dXJlXCIgdGV4dCxcbiAgICAgICAgICBcImdlbmVyYXRpb25fY291bnRcIiBpbnRlZ2VyIERFRkFVTFQgMCxcbiAgICAgICAgICBcInJlc2V0X2RhdGVcIiB0aW1lc3RhbXAgREVGQVVMVCBub3coKSxcbiAgICAgICAgICBcImNyZWF0ZWRfYXRcIiB0aW1lc3RhbXAgREVGQVVMVCBub3coKSxcbiAgICAgICAgICBcImxhc3RfbG9naW5fYXRcIiB0aW1lc3RhbXAsXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInVzZXJzX2VtYWlsX3VuaXF1ZVwiIFVOSVFVRShcImVtYWlsXCIpLFxuICAgICAgICAgIENPTlNUUkFJTlQgXCJ1c2Vyc19nb29nbGVfaWRfdW5pcXVlXCIgVU5JUVVFKFwiZ29vZ2xlX2lkXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgLS0gQ3JlYXRlIHNlc3Npb25zIHRhYmxlXG4gICAgICAgIENSRUFURSBUQUJMRSBcInNlc3Npb25zXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJ1c2VyX2lkXCIgdXVpZCxcbiAgICAgICAgICBcInRva2VuXCIgdGV4dCBOT1QgTlVMTCxcbiAgICAgICAgICBcImV4cGlyZXNfYXRcIiB0aW1lc3RhbXAgTk9UIE5VTEwsXG4gICAgICAgICAgXCJjcmVhdGVkX2F0XCIgdGltZXN0YW1wIERFRkFVTFQgbm93KCksXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInNlc3Npb25zX3Rva2VuX3VuaXF1ZVwiIFVOSVFVRShcInRva2VuXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgLS0gQ3JlYXRlIHN0eWxlcyB0YWJsZVxuICAgICAgICBDUkVBVEUgVEFCTEUgXCJzdHlsZXNcIiAoXG4gICAgICAgICAgXCJpZFwiIHV1aWQgUFJJTUFSWSBLRVkgREVGQVVMVCBnZW5fcmFuZG9tX3V1aWQoKSBOT1QgTlVMTCxcbiAgICAgICAgICBcIm5hbWVcIiB0ZXh0LFxuICAgICAgICAgIFwiZGVzY3JpcHRpb25cIiB0ZXh0LFxuICAgICAgICAgIFwidGh1bWJuYWlsXCIgdGV4dCxcbiAgICAgICAgICBcInByb21wdF9qc29uXCIganNvbmJcbiAgICAgICAgKTtcblxuICAgICAgICAtLSBDcmVhdGUgaW1hZ2VzIHRhYmxlXG4gICAgICAgIENSRUFURSBUQUJMRSBcImltYWdlc1wiIChcbiAgICAgICAgICBcImlkXCIgdXVpZCBQUklNQVJZIEtFWSBERUZBVUxUIGdlbl9yYW5kb21fdXVpZCgpIE5PVCBOVUxMLFxuICAgICAgICAgIFwidXNlcl9pZFwiIHV1aWQsXG4gICAgICAgICAgXCJpbWFnZV91cmxcIiB0ZXh0LFxuICAgICAgICAgIFwicHJvbXB0XCIgdGV4dCxcbiAgICAgICAgICBcInN0eWxlX25hbWVcIiB0ZXh0LFxuICAgICAgICAgIFwiY29sb3JzXCIgdGV4dFtdLFxuICAgICAgICAgIFwiY3JlYXRlZF9hdFwiIHRpbWVzdGFtcCBERUZBVUxUIG5vdygpXG4gICAgICAgICk7XG5cbiAgICAgICAgLS0gQWRkIGZvcmVpZ24ga2V5IGNvbnN0cmFpbnRzXG4gICAgICAgIEFMVEVSIFRBQkxFIFwiaW1hZ2VzXCIgQUREIENPTlNUUkFJTlQgXCJpbWFnZXNfdXNlcl9pZF91c2Vyc19pZF9ma1wiXG4gICAgICAgICAgRk9SRUlHTiBLRVkgKFwidXNlcl9pZFwiKSBSRUZFUkVOQ0VTIFwicHVibGljXCIuXCJ1c2Vyc1wiKFwiaWRcIikgT04gREVMRVRFIG5vIGFjdGlvbiBPTiBVUERBVEUgbm8gYWN0aW9uO1xuXG4gICAgICAgIEFMVEVSIFRBQkxFIFwic2Vzc2lvbnNcIiBBREQgQ09OU1RSQUlOVCBcInNlc3Npb25zX3VzZXJfaWRfdXNlcnNfaWRfZmtcIlxuICAgICAgICAgIEZPUkVJR04gS0VZIChcInVzZXJfaWRcIikgUkVGRVJFTkNFUyBcInB1YmxpY1wiLlwidXNlcnNcIihcImlkXCIpIE9OIERFTEVURSBjYXNjYWRlIE9OIFVQREFURSBubyBhY3Rpb247XG4gICAgICBgO1xuXG4gICAgICAvLyBSdW4gdGhlIG1pZ3JhdGlvbiBzdGF0ZW1lbnRzIHNlcGFyYXRlbHlcbiAgICAgIGF3YWl0IHNxbGBEUk9QIFRBQkxFIElGIEVYSVNUUyBcImltYWdlc1wiIENBU0NBREVgO1xuICAgICAgYXdhaXQgc3FsYERST1AgVEFCTEUgSUYgRVhJU1RTIFwic2Vzc2lvbnNcIiBDQVNDQURFYDtcbiAgICAgIGF3YWl0IHNxbGBEUk9QIFRBQkxFIElGIEVYSVNUUyBcInN0eWxlc1wiIENBU0NBREVgO1xuICAgICAgYXdhaXQgc3FsYERST1AgVEFCTEUgSUYgRVhJU1RTIFwidXNlcnNcIiBDQVNDQURFYDtcblxuICAgICAgLy8gQ3JlYXRlIHVzZXJzIHRhYmxlXG4gICAgICBhd2FpdCBzcWxgXG4gICAgICAgIENSRUFURSBUQUJMRSBcInVzZXJzXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJlbWFpbFwiIHRleHQgTk9UIE5VTEwsXG4gICAgICAgICAgXCJuYW1lXCIgdGV4dCxcbiAgICAgICAgICBcImdvb2dsZV9pZFwiIHRleHQsXG4gICAgICAgICAgXCJwcm9maWxlX3BpY3R1cmVcIiB0ZXh0LFxuICAgICAgICAgIFwiZ2VuZXJhdGlvbl9jb3VudFwiIGludGVnZXIgREVGQVVMVCAwLFxuICAgICAgICAgIFwicmVzZXRfZGF0ZVwiIHRpbWVzdGFtcCBERUZBVUxUIG5vdygpLFxuICAgICAgICAgIFwiY3JlYXRlZF9hdFwiIHRpbWVzdGFtcCBERUZBVUxUIG5vdygpLFxuICAgICAgICAgIFwibGFzdF9sb2dpbl9hdFwiIHRpbWVzdGFtcCxcbiAgICAgICAgICBDT05TVFJBSU5UIFwidXNlcnNfZW1haWxfdW5pcXVlXCIgVU5JUVVFKFwiZW1haWxcIiksXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInVzZXJzX2dvb2dsZV9pZF91bmlxdWVcIiBVTklRVUUoXCJnb29nbGVfaWRcIilcbiAgICAgICAgKVxuICAgICAgYDtcblxuICAgICAgLy8gQ3JlYXRlIHNlc3Npb25zIHRhYmxlXG4gICAgICBhd2FpdCBzcWxgXG4gICAgICAgIENSRUFURSBUQUJMRSBcInNlc3Npb25zXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJ1c2VyX2lkXCIgdXVpZCxcbiAgICAgICAgICBcInRva2VuXCIgdGV4dCBOT1QgTlVMTCxcbiAgICAgICAgICBcImV4cGlyZXNfYXRcIiB0aW1lc3RhbXAgTk9UIE5VTEwsXG4gICAgICAgICAgXCJjcmVhdGVkX2F0XCIgdGltZXN0YW1wIERFRkFVTFQgbm93KCksXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInNlc3Npb25zX3Rva2VuX3VuaXF1ZVwiIFVOSVFVRShcInRva2VuXCIpXG4gICAgICAgIClcbiAgICAgIGA7XG5cbiAgICAgIC8vIENyZWF0ZSBzdHlsZXMgdGFibGVcbiAgICAgIGF3YWl0IHNxbGBcbiAgICAgICAgQ1JFQVRFIFRBQkxFIFwic3R5bGVzXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJuYW1lXCIgdGV4dCxcbiAgICAgICAgICBcImRlc2NyaXB0aW9uXCIgdGV4dCxcbiAgICAgICAgICBcInRodW1ibmFpbFwiIHRleHQsXG4gICAgICAgICAgXCJwcm9tcHRfanNvblwiIGpzb25iXG4gICAgICAgIClcbiAgICAgIGA7XG5cbiAgICAgIC8vIENyZWF0ZSBpbWFnZXMgdGFibGVcbiAgICAgIGF3YWl0IHNxbGBcbiAgICAgICAgQ1JFQVRFIFRBQkxFIFwiaW1hZ2VzXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJ1c2VyX2lkXCIgdXVpZCxcbiAgICAgICAgICBcImltYWdlX3VybFwiIHRleHQsXG4gICAgICAgICAgXCJwcm9tcHRcIiB0ZXh0LFxuICAgICAgICAgIFwic3R5bGVfbmFtZVwiIHRleHQsXG4gICAgICAgICAgXCJjb2xvcnNcIiB0ZXh0W10sXG4gICAgICAgICAgXCJjcmVhdGVkX2F0XCIgdGltZXN0YW1wIERFRkFVTFQgbm93KClcbiAgICAgICAgKVxuICAgICAgYDtcblxuICAgICAgLy8gQWRkIGZvcmVpZ24ga2V5IGNvbnN0cmFpbnRzXG4gICAgICBhd2FpdCBzcWxgXG4gICAgICAgIEFMVEVSIFRBQkxFIFwiaW1hZ2VzXCIgQUREIENPTlNUUkFJTlQgXCJpbWFnZXNfdXNlcl9pZF91c2Vyc19pZF9ma1wiXG4gICAgICAgIEZPUkVJR04gS0VZIChcInVzZXJfaWRcIikgUkVGRVJFTkNFUyBcInB1YmxpY1wiLlwidXNlcnNcIihcImlkXCIpIE9OIERFTEVURSBubyBhY3Rpb24gT04gVVBEQVRFIG5vIGFjdGlvblxuICAgICAgYDtcblxuICAgICAgYXdhaXQgc3FsYFxuICAgICAgICBBTFRFUiBUQUJMRSBcInNlc3Npb25zXCIgQUREIENPTlNUUkFJTlQgXCJzZXNzaW9uc191c2VyX2lkX3VzZXJzX2lkX2ZrXCJcbiAgICAgICAgRk9SRUlHTiBLRVkgKFwidXNlcl9pZFwiKSBSRUZFUkVOQ0VTIFwicHVibGljXCIuXCJ1c2Vyc1wiKFwiaWRcIikgT04gREVMRVRFIGNhc2NhZGUgT04gVVBEQVRFIG5vIGFjdGlvblxuICAgICAgYDtcblxuICAgICAgcmVzLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBcIkRhdGFiYXNlIG1pZ3JhdGlvbiBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIsXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaWdyYXRpb24gZXJyb3I6XCIsIGVycm9yKTtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiTWlncmF0aW9uIGZhaWxlZFwiLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gUGxhY2Vob2xkZXIgcm91dGVzIGZvciBvdGhlciBlbmRwb2ludHNcbiAgYXBwLmdldChcIi9nYWxsZXJ5XCIsIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5qc29uKHsgaW1hZ2VzOiBbXSB9KTtcbiAgfSk7XG5cbiAgYXBwLnBvc3QoXCIvZ2VuZXJhdGVcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnN0YXR1cyg1MDEpLmpzb24oeyBlcnJvcjogXCJHZW5lcmF0ZSBlbmRwb2ludCBub3QgaW1wbGVtZW50ZWQgeWV0XCIgfSk7XG4gIH0pO1xuXG4gIGFwcC5wb3N0KFwiL3NhdmVcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnN0YXR1cyg1MDEpLmpzb24oeyBlcnJvcjogXCJTYXZlIGVuZHBvaW50IG5vdCBpbXBsZW1lbnRlZCB5ZXRcIiB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFwcDtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgbWlkZGxld2FyZU1vZGU6IGZhbHNlLFxuICAgIGZzOiB7XG4gICAgICBkZW55OiBbXCJhcGkvKipcIl0sIC8vIFByZXZlbnQgVml0ZSBmcm9tIHNlcnZpbmcgYXBpIGZvbGRlciBhcyBzdGF0aWMgZmlsZXNcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCJkaXN0XCIsXG4gIH0sXG4gIGRlZmluZToge1xuICAgIGdsb2JhbDogXCJnbG9iYWxUaGlzXCIsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHtcbiAgICAgIG5hbWU6IFwiZXhwcmVzcy1kZXYtc2VydmVyXCIsXG4gICAgICBjb25maWd1cmVTZXJ2ZXI6IGFzeW5jIChzZXJ2ZXIpID0+IHtcbiAgICAgICAgLy8gTG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICAgICAgY29uc3QgeyBjb25maWcgfSA9IGF3YWl0IGltcG9ydChcImRvdGVudlwiKTtcbiAgICAgICAgY29uZmlnKCk7XG5cbiAgICAgICAgLy8gSW1wb3J0IGFuZCBzZXR1cCBFeHByZXNzIHNlcnZlciBmb3IgQVBJIHJvdXRlc1xuICAgICAgICBjb25zdCB7IGNyZWF0ZVNlcnZlciB9ID0gYXdhaXQgaW1wb3J0KFwiLi9zZXJ2ZXIvaW5kZXguanNcIik7XG4gICAgICAgIGNvbnN0IGFwcCA9IGNyZWF0ZVNlcnZlcigpO1xuXG4gICAgICAgIC8vIFVzZSB0aGUgRXhwcmVzcyBhcHAgdG8gaGFuZGxlIC9hcGkgcm91dGVzXG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoXCIvYXBpXCIsIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIGFwcChyZXEsIHJlcywgbmV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vY2xpZW50XCIpLFxuICAgICAgXCJAc2hhcmVkXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zaGFyZWRcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBK007QUFBQSxFQUM3TTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE9BQ0s7QUFSUCxJQVdhLFlBY0EsZUFXQSxhQVdBO0FBL0NiO0FBQUE7QUFXTyxJQUFNLGFBQWEsUUFBUSxTQUFTO0FBQUEsTUFDekMsSUFBSSxLQUFLLElBQUksRUFBRSxXQUFXLEVBQUUsY0FBYztBQUFBLE1BQzFDLE9BQU8sS0FBSyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU87QUFBQSxNQUN0QyxNQUFNLEtBQUssTUFBTTtBQUFBLE1BQ2pCLFVBQVUsS0FBSyxXQUFXLEVBQUUsT0FBTztBQUFBLE1BQ25DLGdCQUFnQixLQUFLLGlCQUFpQjtBQUFBLE1BQ3RDLE1BQU0sUUFBUSxRQUFRLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLE1BQU07QUFBQTtBQUFBLE1BQ3BELGlCQUFpQixRQUFRLGtCQUFrQixFQUFFLFFBQVEsQ0FBQztBQUFBLE1BQ3RELFdBQVcsVUFBVSxZQUFZLEVBQUUsV0FBVztBQUFBLE1BQzlDLFdBQVcsVUFBVSxZQUFZLEVBQUUsV0FBVztBQUFBLE1BQzlDLGFBQWEsVUFBVSxlQUFlO0FBQUEsSUFDeEMsQ0FBQztBQUdNLElBQU0sZ0JBQWdCLFFBQVEsWUFBWTtBQUFBLE1BQy9DLElBQUksS0FBSyxJQUFJLEVBQUUsV0FBVyxFQUFFLGNBQWM7QUFBQSxNQUMxQyxRQUFRLEtBQUssU0FBUyxFQUFFLFdBQVcsTUFB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QUNFLE1BQU07QUFBQSxNQUNOLGlCQUFpQixPQUFPLFdBQVc7QUFFakMsY0FBTSxFQUFFLE9BQU8sSUFBSSxNQUFNLE9BQU8sa0RBQVE7QUFDeEMsZUFBTztBQUdQLGNBQU0sRUFBRSxjQUFBQyxjQUFhLElBQUksTUFBTTtBQUMvQixjQUFNLE1BQU1BLGNBQWE7QUFHekIsZUFBTyxZQUFZLElBQUksUUFBUSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQ2pELGNBQUksS0FBSyxLQUFLLElBQUk7QUFBQSxRQUNwQixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxVQUFVO0FBQUEsTUFDdkMsV0FBVyxLQUFLLFFBQVEsa0NBQVcsVUFBVTtBQUFBLElBQy9DO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbInNxbCIsICJlcSIsICJpbml0X2F1dGgiLCAibmVvbiIsICJzcWwiLCAiaW5pdF9hdXRoIiwgImNyZWF0ZVNlcnZlciJdCn0K
