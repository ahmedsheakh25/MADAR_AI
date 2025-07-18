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
          role: googleUser.role || "user",
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
        let redirectUri = process.env.GOOGLE_REDIRECT_URI || "";
        if (!redirectUri || redirectUri.includes("localhost")) {
          if (process.env.FLY_APP_NAME || process.env.NODE_ENV === "production") {
            redirectUri = "https://www.madar.ofspace.studio/api/auth/callback";
          } else {
            redirectUri = "http://localhost:8080/api/auth/callback";
          }
        }
        const params = new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent"
        });
        return `${baseUrl}?${params.toString()}`;
      }
      // Check if user is master admin
      static isMasterAdmin(email) {
        const masterAdminEmail = "ahmed.sheakh25@gmail.com";
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
async function requireAdmin(req) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success || !authResult.user) {
      return authResult;
    }
    if (!AuthService.isAdmin(authResult.user)) {
      return {
        success: false,
        error: "Admin access required"
      };
    }
    return authResult;
  } catch (error) {
    console.error("Admin authentication middleware error:", error);
    return {
      success: false,
      error: "Admin authentication failed"
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
            role: user.role || "user",
            generationCount: userGenerationCount,
            resetDate: user.resetDate?.toISOString() || (/* @__PURE__ */ new Date()).toISOString(),
            isAdmin: user.role === "admin",
            isMasterAdmin: user.email.toLowerCase() === "ahmed.sheakh@gmail.com"
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
        const baseUrl = process.env.FLY_APP_NAME || process.env.NODE_ENV === "production" ? "https://madar-ai.fly.dev" : "http://localhost:8080";
        const callbackUrl = new URL("/ar/auth/callback", baseUrl);
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

// server/routes/admin.ts
var handleGetAllUsers, handlePromoteUser, handleDemoteUser, handleResetUserGenerations;
var init_admin = __esm({
  "server/routes/admin.ts"() {
    init_database();
    init_auth();
    init_middleware();
    handleGetAllUsers = async (req, res) => {
      try {
        const url = new URL(req.originalUrl, `http://${req.headers.host}`);
        const webRequest = new Request(url.toString(), {
          method: req.method,
          headers: req.headers
        });
        const authResult = await requireAdmin(webRequest);
        if (!authResult.success || !authResult.user) {
          return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
            success: false,
            error: authResult.error || "Unauthorized"
          });
        }
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const users = await DatabaseService.getAllUsers(limit, offset);
        const totalCount = await DatabaseService.getUserCount();
        const safeUsers = users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          generationCount: user.generationCount,
          resetDate: user.resetDate?.toISOString(),
          createdAt: user.createdAt?.toISOString(),
          lastLoginAt: user.lastLoginAt?.toISOString(),
          isMasterAdmin: AuthService.isMasterAdmin(user.email)
        }));
        res.json({
          success: true,
          users: safeUsers,
          pagination: {
            total: totalCount,
            limit,
            offset,
            hasMore: offset + limit < totalCount
          }
        });
      } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
          success: false,
          error: "Failed to fetch users"
        });
      }
    };
    handlePromoteUser = async (req, res) => {
      try {
        const { userId } = req.params;
        const url = new URL(req.originalUrl, `http://${req.headers.host}`);
        const webRequest = new Request(url.toString(), {
          method: req.method,
          headers: req.headers
        });
        const authResult = await requireAdmin(webRequest);
        if (!authResult.success || !authResult.user) {
          return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
            success: false,
            error: authResult.error || "Unauthorized"
          });
        }
        if (!AuthService.isMasterAdmin(authResult.user.email)) {
          return res.status(403).json({
            success: false,
            error: "Only master admin can promote users"
          });
        }
        const success = await AuthService.promoteToAdmin(userId, authResult.user);
        if (success) {
          res.json({
            success: true,
            message: "User promoted to admin successfully"
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Failed to promote user"
          });
        }
      } catch (error) {
        console.error("Promote user error:", error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Failed to promote user"
        });
      }
    };
    handleDemoteUser = async (req, res) => {
      try {
        const { userId } = req.params;
        const url = new URL(req.originalUrl, `http://${req.headers.host}`);
        const webRequest = new Request(url.toString(), {
          method: req.method,
          headers: req.headers
        });
        const authResult = await requireAdmin(webRequest);
        if (!authResult.success || !authResult.user) {
          return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
            success: false,
            error: authResult.error || "Unauthorized"
          });
        }
        if (!AuthService.isMasterAdmin(authResult.user.email)) {
          return res.status(403).json({
            success: false,
            error: "Only master admin can demote users"
          });
        }
        const success = await AuthService.demoteFromAdmin(userId, authResult.user);
        if (success) {
          res.json({
            success: true,
            message: "User demoted from admin successfully"
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Failed to demote user"
          });
        }
      } catch (error) {
        console.error("Demote user error:", error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Failed to demote user"
        });
      }
    };
    handleResetUserGenerations = async (req, res) => {
      try {
        const { userId } = req.params;
        const url = new URL(req.originalUrl, `http://${req.headers.host}`);
        const webRequest = new Request(url.toString(), {
          method: req.method,
          headers: req.headers
        });
        const authResult = await requireAdmin(webRequest);
        if (!authResult.success || !authResult.user) {
          return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
            success: false,
            error: authResult.error || "Unauthorized"
          });
        }
        const user = await DatabaseService.resetUserGenerationCount(userId);
        res.json({
          success: true,
          message: "User generation count reset successfully",
          user: {
            id: user.id,
            email: user.email,
            generationCount: user.generationCount,
            resetDate: user.resetDate?.toISOString()
          }
        });
      } catch (error) {
        console.error("Reset user generations error:", error);
        res.status(500).json({
          success: false,
          error: "Failed to reset user generation count"
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
  app.get("/auth/config", (req, res) => {
    const isProduction = process.env.FLY_APP_NAME || process.env.NODE_ENV === "production";
    const redirectUri = isProduction ? "https://madar-ai.fly.dev/api/auth/callback" : "http://localhost:8080/api/auth/callback";
    res.json({
      environment: isProduction ? "production" : "development",
      redirectUri,
      clientId: process.env.GOOGLE_CLIENT_ID ? "***configured***" : "not set",
      flyAppName: process.env.FLY_APP_NAME || "not set",
      nodeEnv: process.env.NODE_ENV || "not set"
    });
  });
  app.get("/admin/users", handleGetAllUsers);
  app.post("/admin/users/:userId/promote", handlePromoteUser);
  app.post("/admin/users/:userId/demote", handleDemoteUser);
  app.post(
    "/admin/users/:userId/reset-generations",
    handleResetUserGenerations
  );
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
    init_admin();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGliL3NjaGVtYS50cyIsICJsaWIvZGIudHMiLCAibGliL2RhdGFiYXNlLnRzIiwgImxpYi9hdXRoLnRzIiwgImxpYi9taWRkbGV3YXJlLnRzIiwgInNlcnZlci9yb3V0ZXMvdXNlci50cyIsICJzZXJ2ZXIvcm91dGVzL3N0eWxlcy50cyIsICJzZXJ2ZXIvcm91dGVzL2F1dGgudHMiLCAic2VydmVyL3JvdXRlcy9hZG1pbi50cyIsICJzZXJ2ZXIvaW5kZXgudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvbGliXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvbGliL3NjaGVtYS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvbGliL3NjaGVtYS50c1wiO2ltcG9ydCB7XG4gIHBnVGFibGUsXG4gIHV1aWQsXG4gIHRleHQsXG4gIGludGVnZXIsXG4gIHRpbWVzdGFtcCxcbiAganNvbmIsXG4gIHZhcmNoYXIsXG59IGZyb20gXCJkcml6emxlLW9ybS9wZy1jb3JlXCI7XG5cbi8vIFVzZXJzIHRhYmxlXG5leHBvcnQgY29uc3QgdXNlcnNUYWJsZSA9IHBnVGFibGUoXCJ1c2Vyc1wiLCB7XG4gIGlkOiB1dWlkKFwiaWRcIikucHJpbWFyeUtleSgpLmRlZmF1bHRSYW5kb20oKSxcbiAgZW1haWw6IHRleHQoXCJlbWFpbFwiKS5ub3ROdWxsKCkudW5pcXVlKCksXG4gIG5hbWU6IHRleHQoXCJuYW1lXCIpLFxuICBnb29nbGVJZDogdGV4dChcImdvb2dsZV9pZFwiKS51bmlxdWUoKSxcbiAgcHJvZmlsZVBpY3R1cmU6IHRleHQoXCJwcm9maWxlX3BpY3R1cmVcIiksXG4gIHJvbGU6IHZhcmNoYXIoXCJyb2xlXCIsIHsgbGVuZ3RoOiAyMCB9KS5kZWZhdWx0KFwidXNlclwiKSwgLy8gJ3VzZXInLCAnYWRtaW4nXG4gIGdlbmVyYXRpb25Db3VudDogaW50ZWdlcihcImdlbmVyYXRpb25fY291bnRcIikuZGVmYXVsdCgwKSxcbiAgcmVzZXREYXRlOiB0aW1lc3RhbXAoXCJyZXNldF9kYXRlXCIpLmRlZmF1bHROb3coKSxcbiAgY3JlYXRlZEF0OiB0aW1lc3RhbXAoXCJjcmVhdGVkX2F0XCIpLmRlZmF1bHROb3coKSxcbiAgbGFzdExvZ2luQXQ6IHRpbWVzdGFtcChcImxhc3RfbG9naW5fYXRcIiksXG59KTtcblxuLy8gU2Vzc2lvbnMgdGFibGUgZm9yIG1hbmFnaW5nIHVzZXIgc2Vzc2lvbnNcbmV4cG9ydCBjb25zdCBzZXNzaW9uc1RhYmxlID0gcGdUYWJsZShcInNlc3Npb25zXCIsIHtcbiAgaWQ6IHV1aWQoXCJpZFwiKS5wcmltYXJ5S2V5KCkuZGVmYXVsdFJhbmRvbSgpLFxuICB1c2VySWQ6IHV1aWQoXCJ1c2VyX2lkXCIpLnJlZmVyZW5jZXMoKCkgPT4gdXNlcnNUYWJsZS5pZCwge1xuICAgIG9uRGVsZXRlOiBcImNhc2NhZGVcIixcbiAgfSksXG4gIHRva2VuOiB0ZXh0KFwidG9rZW5cIikubm90TnVsbCgpLnVuaXF1ZSgpLFxuICBleHBpcmVzQXQ6IHRpbWVzdGFtcChcImV4cGlyZXNfYXRcIikubm90TnVsbCgpLFxuICBjcmVhdGVkQXQ6IHRpbWVzdGFtcChcImNyZWF0ZWRfYXRcIikuZGVmYXVsdE5vdygpLFxufSk7XG5cbi8vIEltYWdlcyB0YWJsZVxuZXhwb3J0IGNvbnN0IGltYWdlc1RhYmxlID0gcGdUYWJsZShcImltYWdlc1wiLCB7XG4gIGlkOiB1dWlkKFwiaWRcIikucHJpbWFyeUtleSgpLmRlZmF1bHRSYW5kb20oKSxcbiAgdXNlcklkOiB1dWlkKFwidXNlcl9pZFwiKS5yZWZlcmVuY2VzKCgpID0+IHVzZXJzVGFibGUuaWQpLFxuICBpbWFnZVVybDogdGV4dChcImltYWdlX3VybFwiKSxcbiAgcHJvbXB0OiB0ZXh0KFwicHJvbXB0XCIpLFxuICBzdHlsZU5hbWU6IHRleHQoXCJzdHlsZV9uYW1lXCIpLFxuICBjb2xvcnM6IHRleHQoXCJjb2xvcnNcIikuYXJyYXkoKSxcbiAgY3JlYXRlZEF0OiB0aW1lc3RhbXAoXCJjcmVhdGVkX2F0XCIpLmRlZmF1bHROb3coKSxcbn0pO1xuXG4vLyBTdHlsZXMgdGFibGVcbmV4cG9ydCBjb25zdCBzdHlsZXNUYWJsZSA9IHBnVGFibGUoXCJzdHlsZXNcIiwge1xuICBpZDogdXVpZChcImlkXCIpLnByaW1hcnlLZXkoKS5kZWZhdWx0UmFuZG9tKCksXG4gIG5hbWU6IHRleHQoXCJuYW1lXCIpLFxuICBkZXNjcmlwdGlvbjogdGV4dChcImRlc2NyaXB0aW9uXCIpLFxuICB0aHVtYm5haWw6IHRleHQoXCJ0aHVtYm5haWxcIiksXG4gIHByb21wdEpzb246IGpzb25iKFwicHJvbXB0X2pzb25cIiksXG59KTtcblxuLy8gRXhwb3J0IHR5cGVzXG5leHBvcnQgdHlwZSBVc2VyID0gdHlwZW9mIHVzZXJzVGFibGUuJGluZmVyU2VsZWN0O1xuZXhwb3J0IHR5cGUgTmV3VXNlciA9IHR5cGVvZiB1c2Vyc1RhYmxlLiRpbmZlckluc2VydDtcblxuZXhwb3J0IHR5cGUgU2Vzc2lvbiA9IHR5cGVvZiBzZXNzaW9uc1RhYmxlLiRpbmZlclNlbGVjdDtcbmV4cG9ydCB0eXBlIE5ld1Nlc3Npb24gPSB0eXBlb2Ygc2Vzc2lvbnNUYWJsZS4kaW5mZXJJbnNlcnQ7XG5cbmV4cG9ydCB0eXBlIEltYWdlID0gdHlwZW9mIGltYWdlc1RhYmxlLiRpbmZlclNlbGVjdDtcbmV4cG9ydCB0eXBlIE5ld0ltYWdlID0gdHlwZW9mIGltYWdlc1RhYmxlLiRpbmZlckluc2VydDtcblxuZXhwb3J0IHR5cGUgU3R5bGUgPSB0eXBlb2Ygc3R5bGVzVGFibGUuJGluZmVyU2VsZWN0O1xuZXhwb3J0IHR5cGUgTmV3U3R5bGUgPSB0eXBlb2Ygc3R5bGVzVGFibGUuJGluZmVySW5zZXJ0O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvbGliXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvbGliL2RiLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9saWIvZGIudHNcIjtpbXBvcnQgeyBkcml6emxlIH0gZnJvbSBcImRyaXp6bGUtb3JtL25lb24taHR0cFwiO1xuaW1wb3J0IHsgbmVvbiB9IGZyb20gXCJAbmVvbmRhdGFiYXNlL3NlcnZlcmxlc3NcIjtcbmltcG9ydCAqIGFzIHNjaGVtYSBmcm9tIFwiLi9zY2hlbWEuanNcIjtcblxuaWYgKCFwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwiREFUQUJBU0VfVVJMIGlzIHJlcXVpcmVkXCIpO1xufVxuXG4vLyBDcmVhdGUgTmVvbiBIVFRQIGNsaWVudCAtIEVkZ2UgUnVudGltZSBjb21wYXRpYmxlXG5jb25zdCBzcWwgPSBuZW9uKHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCk7XG5cbi8vIENyZWF0ZSBEcml6emxlIGluc3RhbmNlIHdpdGggTmVvbiBIVFRQIGFkYXB0ZXIgZm9yIEVkZ2UgUnVudGltZVxuZXhwb3J0IGNvbnN0IGRiID0gZHJpenpsZShzcWwsIHsgc2NoZW1hIH0pO1xuXG5leHBvcnQgdHlwZSBEYXRhYmFzZSA9IHR5cGVvZiBkYjtcblxuLy8gVGVzdCBjb25uZWN0aW9uIGZ1bmN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdERhdGFiYXNlQ29ubmVjdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvLyBTaW1wbGUgcXVlcnkgdG8gdGVzdCBjb25uZWN0aW9uXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3FsYFNFTEVDVCAxIGFzIHRlc3RgO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHJlc3VsdCB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7IFxuICAgICAgc3VjY2VzczogZmFsc2UsIFxuICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZGF0YWJhc2UgZXJyb3InIFxuICAgIH07XG4gIH1cbn0gIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvbGliXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvbGliL2RhdGFiYXNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9saWIvZGF0YWJhc2UudHNcIjtpbXBvcnQgeyBlcSwgc3FsIH0gZnJvbSBcImRyaXp6bGUtb3JtXCI7XG5pbXBvcnQgeyBkYiB9IGZyb20gXCIuL2RiLmpzXCI7XG5pbXBvcnQge1xuICB1c2Vyc1RhYmxlLFxuICBpbWFnZXNUYWJsZSxcbiAgc3R5bGVzVGFibGUsXG4gIHNlc3Npb25zVGFibGUsXG59IGZyb20gXCIuL3NjaGVtYS5qc1wiO1xuaW1wb3J0IHR5cGUge1xuICBVc2VyLFxuICBOZXdVc2VyLFxuICBJbWFnZSxcbiAgTmV3SW1hZ2UsXG4gIFN0eWxlLFxuICBTZXNzaW9uLFxuICBOZXdTZXNzaW9uLFxufSBmcm9tIFwiLi9zY2hlbWEuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFiYXNlU2VydmljZSB7XG4gIC8vIFVzZXIgbWFuYWdlbWVudFxuICBzdGF0aWMgYXN5bmMgY3JlYXRlVXNlcih1c2VyRGF0YTogTmV3VXNlcik6IFByb21pc2U8VXNlcj4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiLmluc2VydCh1c2Vyc1RhYmxlKS52YWx1ZXModXNlckRhdGEpLnJldHVybmluZygpO1xuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZpbmRVc2VyQnlFbWFpbChlbWFpbDogc3RyaW5nKTogUHJvbWlzZTxVc2VyIHwgbnVsbD4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHVzZXJzVGFibGUpXG4gICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5lbWFpbCwgZW1haWwpKTtcbiAgICByZXR1cm4gdXNlciB8fCBudWxsO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZpbmRVc2VyQnlHb29nbGVJZChnb29nbGVJZDogc3RyaW5nKTogUHJvbWlzZTxVc2VyIHwgbnVsbD4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHVzZXJzVGFibGUpXG4gICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5nb29nbGVJZCwgZ29vZ2xlSWQpKTtcbiAgICByZXR1cm4gdXNlciB8fCBudWxsO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZVVzZXJGcm9tR29vZ2xlKGdvb2dsZVVzZXI6IHtcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBnb29nbGVJZDogc3RyaW5nO1xuICAgIHByb2ZpbGVQaWN0dXJlPzogc3RyaW5nO1xuICAgIHJvbGU/OiBzdHJpbmc7XG4gIH0pOiBQcm9taXNlPFVzZXI+IHtcbiAgICBjb25zdCBbdXNlcl0gPSBhd2FpdCBkYlxuICAgICAgLmluc2VydCh1c2Vyc1RhYmxlKVxuICAgICAgLnZhbHVlcyh7XG4gICAgICAgIGVtYWlsOiBnb29nbGVVc2VyLmVtYWlsLFxuICAgICAgICBuYW1lOiBnb29nbGVVc2VyLm5hbWUsXG4gICAgICAgIGdvb2dsZUlkOiBnb29nbGVVc2VyLmdvb2dsZUlkLFxuICAgICAgICBwcm9maWxlUGljdHVyZTogZ29vZ2xlVXNlci5wcm9maWxlUGljdHVyZSxcbiAgICAgICAgcm9sZTogZ29vZ2xlVXNlci5yb2xlIHx8IFwidXNlclwiLFxuICAgICAgICBnZW5lcmF0aW9uQ291bnQ6IDAsXG4gICAgICAgIGxhc3RMb2dpbkF0OiBuZXcgRGF0ZSgpLFxuICAgICAgfSlcbiAgICAgIC5yZXR1cm5pbmcoKTtcbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyB1cGRhdGVMYXN0TG9naW4odXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPFVzZXI+IHtcbiAgICBjb25zdCBbdXNlcl0gPSBhd2FpdCBkYlxuICAgICAgLnVwZGF0ZSh1c2Vyc1RhYmxlKVxuICAgICAgLnNldCh7IGxhc3RMb2dpbkF0OiBuZXcgRGF0ZSgpIH0pXG4gICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5pZCwgdXNlcklkKSlcbiAgICAgIC5yZXR1cm5pbmcoKTtcbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXRVc2VyQnlJZChpZDogc3RyaW5nKTogUHJvbWlzZTxVc2VyIHwgbnVsbD4ge1xuICAgIGNvbnN0IFt1c2VyXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHVzZXJzVGFibGUpXG4gICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5pZCwgaWQpKTtcbiAgICByZXR1cm4gdXNlciB8fCBudWxsO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIHVwZGF0ZVVzZXJHZW5lcmF0aW9uQ291bnQoXG4gICAgdXNlcklkOiBzdHJpbmcsXG4gICAgaW5jcmVtZW50OiBudW1iZXIgPSAxLFxuICApOiBQcm9taXNlPFVzZXI+IHtcbiAgICBjb25zdCBbdXNlcl0gPSBhd2FpdCBkYlxuICAgICAgLnVwZGF0ZSh1c2Vyc1RhYmxlKVxuICAgICAgLnNldCh7XG4gICAgICAgIGdlbmVyYXRpb25Db3VudDogc3FsYCR7dXNlcnNUYWJsZS5nZW5lcmF0aW9uQ291bnR9ICsgJHtpbmNyZW1lbnR9YCxcbiAgICAgIH0pXG4gICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5pZCwgdXNlcklkKSlcbiAgICAgIC5yZXR1cm5pbmcoKTtcbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyByZXNldFVzZXJHZW5lcmF0aW9uQ291bnQodXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPFVzZXI+IHtcbiAgICBjb25zdCBbdXNlcl0gPSBhd2FpdCBkYlxuICAgICAgLnVwZGF0ZSh1c2Vyc1RhYmxlKVxuICAgICAgLnNldCh7XG4gICAgICAgIGdlbmVyYXRpb25Db3VudDogMCxcbiAgICAgICAgcmVzZXREYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgfSlcbiAgICAgIC53aGVyZShlcSh1c2Vyc1RhYmxlLmlkLCB1c2VySWQpKVxuICAgICAgLnJldHVybmluZygpO1xuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgLy8gSW1hZ2UgbWFuYWdlbWVudFxuICBzdGF0aWMgYXN5bmMgc2F2ZUltYWdlKGltYWdlRGF0YTogTmV3SW1hZ2UpOiBQcm9taXNlPEltYWdlPiB7XG4gICAgY29uc3QgW2ltYWdlXSA9IGF3YWl0IGRiLmluc2VydChpbWFnZXNUYWJsZSkudmFsdWVzKGltYWdlRGF0YSkucmV0dXJuaW5nKCk7XG4gICAgcmV0dXJuIGltYWdlO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdldFVzZXJJbWFnZXMoXG4gICAgdXNlcklkOiBzdHJpbmcsXG4gICAgbGltaXQ6IG51bWJlciA9IDUwLFxuICAgIG9mZnNldDogbnVtYmVyID0gMCxcbiAgKTogUHJvbWlzZTxJbWFnZVtdPiB7XG4gICAgcmV0dXJuIGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKGltYWdlc1RhYmxlKVxuICAgICAgLndoZXJlKGVxKGltYWdlc1RhYmxlLnVzZXJJZCwgdXNlcklkKSlcbiAgICAgIC5vcmRlckJ5KHNxbGAke2ltYWdlc1RhYmxlLmNyZWF0ZWRBdH0gREVTQ2ApXG4gICAgICAubGltaXQobGltaXQpXG4gICAgICAub2Zmc2V0KG9mZnNldCk7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZGVsZXRlSW1hZ2UoaW1hZ2VJZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiXG4gICAgICAuZGVsZXRlKGltYWdlc1RhYmxlKVxuICAgICAgLndoZXJlKFxuICAgICAgICBzcWxgJHtpbWFnZXNUYWJsZS5pZH0gPSAke2ltYWdlSWR9IEFORCAke2ltYWdlc1RhYmxlLnVzZXJJZH0gPSAke3VzZXJJZH1gLFxuICAgICAgKTtcbiAgICByZXR1cm4gcmVzdWx0LnJvd0NvdW50ID4gMDtcbiAgfVxuXG4gIC8vIFN0eWxlIG1hbmFnZW1lbnRcbiAgc3RhdGljIGFzeW5jIGdldEFsbFN0eWxlcygpOiBQcm9taXNlPFN0eWxlW10+IHtcbiAgICByZXR1cm4gZGIuc2VsZWN0KCkuZnJvbShzdHlsZXNUYWJsZSk7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZ2V0U3R5bGVCeUlkKGlkOiBzdHJpbmcpOiBQcm9taXNlPFN0eWxlIHwgbnVsbD4ge1xuICAgIGNvbnN0IFtzdHlsZV0gPSBhd2FpdCBkYlxuICAgICAgLnNlbGVjdCgpXG4gICAgICAuZnJvbShzdHlsZXNUYWJsZSlcbiAgICAgIC53aGVyZShlcShzdHlsZXNUYWJsZS5pZCwgaWQpKTtcbiAgICByZXR1cm4gc3R5bGUgfHwgbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXRTdHlsZUJ5TmFtZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPFN0eWxlIHwgbnVsbD4ge1xuICAgIGNvbnN0IFtzdHlsZV0gPSBhd2FpdCBkYlxuICAgICAgLnNlbGVjdCgpXG4gICAgICAuZnJvbShzdHlsZXNUYWJsZSlcbiAgICAgIC53aGVyZShlcShzdHlsZXNUYWJsZS5uYW1lLCBuYW1lKSk7XG4gICAgcmV0dXJuIHN0eWxlIHx8IG51bGw7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgY3JlYXRlU3R5bGUoc3R5bGVEYXRhOiBQYXJ0aWFsPFN0eWxlPik6IFByb21pc2U8U3R5bGU+IHtcbiAgICBjb25zdCBbc3R5bGVdID0gYXdhaXQgZGIuaW5zZXJ0KHN0eWxlc1RhYmxlKS52YWx1ZXMoc3R5bGVEYXRhKS5yZXR1cm5pbmcoKTtcbiAgICByZXR1cm4gc3R5bGU7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgdXBkYXRlU3R5bGUoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB1cGRhdGVzOiBQYXJ0aWFsPFN0eWxlPixcbiAgKTogUHJvbWlzZTxTdHlsZT4ge1xuICAgIGNvbnN0IFtzdHlsZV0gPSBhd2FpdCBkYlxuICAgICAgLnVwZGF0ZShzdHlsZXNUYWJsZSlcbiAgICAgIC5zZXQodXBkYXRlcylcbiAgICAgIC53aGVyZShlcShzdHlsZXNUYWJsZS5pZCwgaWQpKVxuICAgICAgLnJldHVybmluZygpO1xuICAgIHJldHVybiBzdHlsZTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBkZWxldGVTdHlsZShpZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGIuZGVsZXRlKHN0eWxlc1RhYmxlKS53aGVyZShlcShzdHlsZXNUYWJsZS5pZCwgaWQpKTtcbiAgICByZXR1cm4gcmVzdWx0LnJvd0NvdW50ID4gMDtcbiAgfVxuXG4gIC8vIEFkbWluIHV0aWxpdGllc1xuICBzdGF0aWMgYXN5bmMgZ2V0QWxsVXNlcnMoXG4gICAgbGltaXQ6IG51bWJlciA9IDUwLFxuICAgIG9mZnNldDogbnVtYmVyID0gMCxcbiAgKTogUHJvbWlzZTxVc2VyW10+IHtcbiAgICByZXR1cm4gZGJcbiAgICAgIC5zZWxlY3QoKVxuICAgICAgLmZyb20odXNlcnNUYWJsZSlcbiAgICAgIC5vcmRlckJ5KHNxbGAke3VzZXJzVGFibGUucmVzZXREYXRlfSBERVNDYClcbiAgICAgIC5saW1pdChsaW1pdClcbiAgICAgIC5vZmZzZXQob2Zmc2V0KTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZXRVc2VyQ291bnQoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICBjb25zdCBbcmVzdWx0XSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KHsgY291bnQ6IHNxbDxudW1iZXI+YGNvdW50KCopYCB9KVxuICAgICAgLmZyb20odXNlcnNUYWJsZSk7XG4gICAgcmV0dXJuIHJlc3VsdC5jb3VudDtcbiAgfVxuXG4gIC8vIFNlc3Npb24gbWFuYWdlbWVudFxuICBzdGF0aWMgYXN5bmMgY3JlYXRlU2Vzc2lvbihzZXNzaW9uRGF0YTogTmV3U2Vzc2lvbik6IFByb21pc2U8U2Vzc2lvbj4ge1xuICAgIGNvbnN0IFtzZXNzaW9uXSA9IGF3YWl0IGRiXG4gICAgICAuaW5zZXJ0KHNlc3Npb25zVGFibGUpXG4gICAgICAudmFsdWVzKHNlc3Npb25EYXRhKVxuICAgICAgLnJldHVybmluZygpO1xuICAgIHJldHVybiBzZXNzaW9uO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZpbmRTZXNzaW9uQnlUb2tlbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxTZXNzaW9uIHwgbnVsbD4ge1xuICAgIGNvbnN0IFtzZXNzaW9uXSA9IGF3YWl0IGRiXG4gICAgICAuc2VsZWN0KClcbiAgICAgIC5mcm9tKHNlc3Npb25zVGFibGUpXG4gICAgICAud2hlcmUoZXEoc2Vzc2lvbnNUYWJsZS50b2tlbiwgdG9rZW4pKTtcbiAgICByZXR1cm4gc2Vzc2lvbiB8fCBudWxsO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGRlbGV0ZVNlc3Npb24odG9rZW46IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiXG4gICAgICAuZGVsZXRlKHNlc3Npb25zVGFibGUpXG4gICAgICAud2hlcmUoZXEoc2Vzc2lvbnNUYWJsZS50b2tlbiwgdG9rZW4pKTtcbiAgICByZXR1cm4gcmVzdWx0LnJvd0NvdW50ID4gMDtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBkZWxldGVFeHBpcmVkU2Vzc2lvbnMoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYlxuICAgICAgLmRlbGV0ZShzZXNzaW9uc1RhYmxlKVxuICAgICAgLndoZXJlKHNxbGAke3Nlc3Npb25zVGFibGUuZXhwaXJlc0F0fSA8ICR7bmV3IERhdGUoKX1gKTtcbiAgICByZXR1cm4gcmVzdWx0LnJvd0NvdW50O1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGRlbGV0ZVVzZXJTZXNzaW9ucyh1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGJcbiAgICAgIC5kZWxldGUoc2Vzc2lvbnNUYWJsZSlcbiAgICAgIC53aGVyZShlcShzZXNzaW9uc1RhYmxlLnVzZXJJZCwgdXNlcklkKSk7XG4gICAgcmV0dXJuIHJlc3VsdC5yb3dDb3VudDtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvbGliXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvbGliL2F1dGgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL2xpYi9hdXRoLnRzXCI7aW1wb3J0IHsgU2lnbkpXVCwgand0VmVyaWZ5IH0gZnJvbSBcImpvc2VcIjtcbmltcG9ydCB7IGVxIH0gZnJvbSBcImRyaXp6bGUtb3JtXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVNlcnZpY2UgfSBmcm9tIFwiLi9kYXRhYmFzZS5qc1wiO1xuaW1wb3J0IHsgZGIgfSBmcm9tIFwiLi9kYi5qc1wiO1xuaW1wb3J0IHsgdXNlcnNUYWJsZSB9IGZyb20gXCIuL3NjaGVtYS5qc1wiO1xuaW1wb3J0IHR5cGUgeyBVc2VyIH0gZnJvbSBcIi4vc2NoZW1hLmpzXCI7XG5cbi8vIEpXVCBzZWNyZXQga2V5IC0gc2hvdWxkIGJlIHNldCBpbiBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbmNvbnN0IEpXVF9TRUNSRVQgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoXG4gIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHxcbiAgICBcInlvdXItc3VwZXItc2VjcmV0LWp3dC1rZXktY2hhbmdlLXRoaXMtaW4tcHJvZHVjdGlvblwiLFxuKTtcblxuY29uc3QgSldUX0lTU1VFUiA9IFwibWFkYXItYWlcIjtcbmNvbnN0IEpXVF9BVURJRU5DRSA9IFwibWFkYXItYWktdXNlcnNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBdXRoVG9rZW4ge1xuICB1c2VySWQ6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBleHA6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHb29nbGVVc2VySW5mbyB7XG4gIGlkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIHZlcmlmaWVkX2VtYWlsOiBib29sZWFuO1xuICBuYW1lOiBzdHJpbmc7XG4gIGdpdmVuX25hbWU6IHN0cmluZztcbiAgZmFtaWx5X25hbWU6IHN0cmluZztcbiAgcGljdHVyZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAvLyBHZW5lcmF0ZSBKV1QgdG9rZW4gZm9yIGF1dGhlbnRpY2F0ZWQgdXNlclxuICBzdGF0aWMgYXN5bmMgZ2VuZXJhdGVUb2tlbih1c2VyOiBVc2VyKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBqd3QgPSBhd2FpdCBuZXcgU2lnbkpXVCh7XG4gICAgICB1c2VySWQ6IHVzZXIuaWQsXG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIG5hbWU6IHVzZXIubmFtZSB8fCBcIlwiLFxuICAgIH0pXG4gICAgICAuc2V0UHJvdGVjdGVkSGVhZGVyKHsgYWxnOiBcIkhTMjU2XCIgfSlcbiAgICAgIC5zZXRJc3N1ZWRBdCgpXG4gICAgICAuc2V0SXNzdWVyKEpXVF9JU1NVRVIpXG4gICAgICAuc2V0QXVkaWVuY2UoSldUX0FVRElFTkNFKVxuICAgICAgLnNldEV4cGlyYXRpb25UaW1lKFwiN2RcIikgLy8gVG9rZW4gZXhwaXJlcyBpbiA3IGRheXNcbiAgICAgIC5zaWduKEpXVF9TRUNSRVQpO1xuXG4gICAgcmV0dXJuIGp3dDtcbiAgfVxuXG4gIC8vIFZlcmlmeSBKV1QgdG9rZW4gYW5kIHJldHVybiBwYXlsb2FkXG4gIHN0YXRpYyBhc3luYyB2ZXJpZnlUb2tlbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxBdXRoVG9rZW4gfCBudWxsPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gYXdhaXQgand0VmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVULCB7XG4gICAgICAgIGlzc3VlcjogSldUX0lTU1VFUixcbiAgICAgICAgYXVkaWVuY2U6IEpXVF9BVURJRU5DRSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcGF5bG9hZCBhcyB1bmtub3duIGFzIEF1dGhUb2tlbjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkpXVCB2ZXJpZmljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvLyBFeHRyYWN0IHVzZXIgZnJvbSByZXF1ZXN0IEF1dGhvcml6YXRpb24gaGVhZGVyXG4gIHN0YXRpYyBhc3luYyBnZXRVc2VyRnJvbVJlcXVlc3QocmVxOiBSZXF1ZXN0KTogUHJvbWlzZTxVc2VyIHwgbnVsbD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBhdXRoSGVhZGVyID0gcmVxLmhlYWRlcnMuZ2V0KFwiQXV0aG9yaXphdGlvblwiKTtcbiAgICAgIGlmICghYXV0aEhlYWRlciB8fCAhYXV0aEhlYWRlci5zdGFydHNXaXRoKFwiQmVhcmVyIFwiKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG9rZW4gPSBhdXRoSGVhZGVyLnN1YnN0cmluZyg3KTsgLy8gUmVtb3ZlICdCZWFyZXIgJyBwcmVmaXhcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCB0aGlzLnZlcmlmeVRva2VuKHRva2VuKTtcblxuICAgICAgaWYgKCFwYXlsb2FkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBHZXQgZnJlc2ggdXNlciBkYXRhIGZyb20gZGF0YWJhc2VcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBEYXRhYmFzZVNlcnZpY2UuZ2V0VXNlckJ5SWQocGF5bG9hZC51c2VySWQpO1xuICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBleHRyYWN0aW5nIHVzZXIgZnJvbSByZXF1ZXN0OlwiLCBlcnJvcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvLyBHb29nbGUgT0F1dGg6IEV4Y2hhbmdlIGF1dGhvcml6YXRpb24gY29kZSBmb3IgdXNlciBpbmZvXG4gIHN0YXRpYyBhc3luYyBleGNoYW5nZUdvb2dsZUNvZGUoXG4gICAgY29kZTogc3RyaW5nLFxuICApOiBQcm9taXNlPEdvb2dsZVVzZXJJbmZvIHwgbnVsbD4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBFeGNoYW5nZSBjb2RlIGZvciBhY2Nlc3MgdG9rZW5cbiAgICAgIGNvbnN0IHRva2VuUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IG5ldyBVUkxTZWFyY2hQYXJhbXMoe1xuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgY2xpZW50X2lkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEIHx8IFwiXCIsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQgfHwgXCJcIixcbiAgICAgICAgICByZWRpcmVjdF91cmk6IHByb2Nlc3MuZW52LkdPT0dMRV9SRURJUkVDVF9VUkkgfHwgXCJcIixcbiAgICAgICAgICBncmFudF90eXBlOiBcImF1dGhvcml6YXRpb25fY29kZVwiLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRva2VuUmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGV4Y2hhbmdlIGNvZGUgZm9yIHRva2VuXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2tlbkRhdGEgPSBhd2FpdCB0b2tlblJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gdG9rZW5EYXRhLmFjY2Vzc190b2tlbjtcblxuICAgICAgLy8gR2V0IHVzZXIgaW5mbyBmcm9tIEdvb2dsZVxuICAgICAgY29uc3QgdXNlclJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICAgIGBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjIvdXNlcmluZm8/YWNjZXNzX3Rva2VuPSR7YWNjZXNzVG9rZW59YCxcbiAgICAgICk7XG5cbiAgICAgIGlmICghdXNlclJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgdXNlciBpbmZvIGZyb20gR29vZ2xlXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1c2VyRGF0YTogR29vZ2xlVXNlckluZm8gPSBhd2FpdCB1c2VyUmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIHVzZXJEYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiR29vZ2xlIE9BdXRoIGVycm9yOlwiLCBlcnJvcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvLyBHb29nbGUgT0F1dGg6IEdldCBvciBjcmVhdGUgdXNlciBmcm9tIEdvb2dsZSBwcm9maWxlXG4gIHN0YXRpYyBhc3luYyBhdXRoZW50aWNhdGVXaXRoR29vZ2xlKFxuICAgIGdvb2dsZVVzZXI6IEdvb2dsZVVzZXJJbmZvLFxuICApOiBQcm9taXNlPHsgdXNlcjogVXNlcjsgdG9rZW46IHN0cmluZzsgaXNOZXdVc2VyOiBib29sZWFuIH0+IHtcbiAgICAvLyBDaGVjayBpZiB1c2VyIGFscmVhZHkgZXhpc3RzIGJ5IEdvb2dsZSBJRFxuICAgIGxldCB1c2VyID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLmZpbmRVc2VyQnlHb29nbGVJZChnb29nbGVVc2VyLmlkKTtcbiAgICBsZXQgaXNOZXdVc2VyID0gZmFsc2U7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIC8vIENoZWNrIGlmIHVzZXIgZXhpc3RzIGJ5IGVtYWlsXG4gICAgICB1c2VyID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLmZpbmRVc2VyQnlFbWFpbChnb29nbGVVc2VyLmVtYWlsKTtcblxuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHVzZXIgd2l0aCBHb29nbGUgSURcbiAgICAgICAgY29uc3QgW3VwZGF0ZWRVc2VyXSA9IGF3YWl0IGRiXG4gICAgICAgICAgLnVwZGF0ZSh1c2Vyc1RhYmxlKVxuICAgICAgICAgIC5zZXQoe1xuICAgICAgICAgICAgZ29vZ2xlSWQ6IGdvb2dsZVVzZXIuaWQsXG4gICAgICAgICAgICBwcm9maWxlUGljdHVyZTogZ29vZ2xlVXNlci5waWN0dXJlLFxuICAgICAgICAgICAgbGFzdExvZ2luQXQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgfSlcbiAgICAgICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5pZCwgdXNlci5pZCkpXG4gICAgICAgICAgLnJldHVybmluZygpO1xuICAgICAgICB1c2VyID0gdXBkYXRlZFVzZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDcmVhdGUgbmV3IHVzZXJcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB7XG4gICAgICAgICAgZW1haWw6IGdvb2dsZVVzZXIuZW1haWwsXG4gICAgICAgICAgbmFtZTogZ29vZ2xlVXNlci5uYW1lLFxuICAgICAgICAgIGdvb2dsZUlkOiBnb29nbGVVc2VyLmlkLFxuICAgICAgICAgIHByb2ZpbGVQaWN0dXJlOiBnb29nbGVVc2VyLnBpY3R1cmUsXG4gICAgICAgICAgLy8gQXV0by1hc3NpZ24gYWRtaW4gcm9sZSBpZiB0aGlzIGlzIHRoZSBtYXN0ZXIgYWRtaW4gZW1haWxcbiAgICAgICAgICByb2xlOiB0aGlzLmlzTWFzdGVyQWRtaW4oZ29vZ2xlVXNlci5lbWFpbCkgPyBcImFkbWluXCIgOiBcInVzZXJcIixcbiAgICAgICAgfTtcbiAgICAgICAgdXNlciA9IGF3YWl0IERhdGFiYXNlU2VydmljZS5jcmVhdGVVc2VyRnJvbUdvb2dsZSh1c2VyRGF0YSk7XG4gICAgICAgIGlzTmV3VXNlciA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVwZGF0ZSBsYXN0IGxvZ2luIGZvciBleGlzdGluZyB1c2VyXG4gICAgICB1c2VyID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLnVwZGF0ZUxhc3RMb2dpbih1c2VyLmlkKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBKV1QgdG9rZW5cbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVUb2tlbih1c2VyKTtcblxuICAgIHJldHVybiB7IHVzZXIsIHRva2VuLCBpc05ld1VzZXIgfTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRlIEdvb2dsZSBPQXV0aCBVUkxcbiAgc3RhdGljIGdldEdvb2dsZUF1dGhVcmwoKTogc3RyaW5nIHtcbiAgICBjb25zdCBiYXNlVXJsID0gXCJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvdjIvYXV0aFwiO1xuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBjb3JyZWN0IHJlZGlyZWN0IFVSSSBiYXNlZCBvbiBlbnZpcm9ubWVudFxuICAgIGxldCByZWRpcmVjdFVyaSA9IHByb2Nlc3MuZW52LkdPT0dMRV9SRURJUkVDVF9VUkkgfHwgXCJcIjtcblxuICAgIC8vIElmIG5vIGV4cGxpY2l0IHJlZGlyZWN0IFVSSSBpcyBzZXQsIGF1dG8tZGV0ZWN0IGJhc2VkIG9uIGVudmlyb25tZW50XG4gICAgaWYgKCFyZWRpcmVjdFVyaSB8fCByZWRpcmVjdFVyaS5pbmNsdWRlcyhcImxvY2FsaG9zdFwiKSkge1xuICAgICAgLy8gQ2hlY2sgaWYgd2UncmUgaW4gcHJvZHVjdGlvblxuICAgICAgaWYgKHByb2Nlc3MuZW52LkZMWV9BUFBfTkFNRSB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgcmVkaXJlY3RVcmkgPSBcImh0dHBzOi8vd3d3Lm1hZGFyLm9mc3BhY2Uuc3R1ZGlvL2FwaS9hdXRoL2NhbGxiYWNrXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWRpcmVjdFVyaSA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9hdXRoL2NhbGxiYWNrXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7XG4gICAgICBjbGllbnRfaWQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfSUQgfHwgXCJcIixcbiAgICAgIHJlZGlyZWN0X3VyaTogcmVkaXJlY3RVcmksXG4gICAgICByZXNwb25zZV90eXBlOiBcImNvZGVcIixcbiAgICAgIHNjb3BlOiBcIm9wZW5pZCBlbWFpbCBwcm9maWxlXCIsXG4gICAgICBhY2Nlc3NfdHlwZTogXCJvZmZsaW5lXCIsXG4gICAgICBwcm9tcHQ6IFwiY29uc2VudFwiLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGAke2Jhc2VVcmx9PyR7cGFyYW1zLnRvU3RyaW5nKCl9YDtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIHVzZXIgaXMgbWFzdGVyIGFkbWluXG4gIHN0YXRpYyBpc01hc3RlckFkbWluKGVtYWlsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBtYXN0ZXJBZG1pbkVtYWlsID0gXCJhaG1lZC5zaGVha2gyNUBnbWFpbC5jb21cIjtcbiAgICByZXR1cm4gZW1haWwudG9Mb3dlckNhc2UoKSA9PT0gbWFzdGVyQWRtaW5FbWFpbC50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgdXNlciBoYXMgYWRtaW4gcm9sZVxuICBzdGF0aWMgaXNBZG1pbih1c2VyOiBVc2VyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHVzZXIucm9sZSA9PT0gXCJhZG1pblwiIHx8IHRoaXMuaXNNYXN0ZXJBZG1pbih1c2VyLmVtYWlsKTtcbiAgfVxuXG4gIC8vIFByb21vdGUgdXNlciB0byBhZG1pbiAob25seSBtYXN0ZXIgYWRtaW4gY2FuIGRvIHRoaXMpXG4gIHN0YXRpYyBhc3luYyBwcm9tb3RlVG9BZG1pbihcbiAgICB1c2VySWQ6IHN0cmluZyxcbiAgICBwcm9tb3RpbmdVc2VyOiBVc2VyLFxuICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuaXNNYXN0ZXJBZG1pbihwcm9tb3RpbmdVc2VyLmVtYWlsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSBtYXN0ZXIgYWRtaW4gY2FuIHByb21vdGUgdXNlcnMgdG8gYWRtaW5cIik7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRiXG4gICAgICAgIC51cGRhdGUodXNlcnNUYWJsZSlcbiAgICAgICAgLnNldCh7IHJvbGU6IFwiYWRtaW5cIiB9KVxuICAgICAgICAud2hlcmUoZXEodXNlcnNUYWJsZS5pZCwgdXNlcklkKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBwcm9tb3RlIHVzZXIgdG8gYWRtaW46XCIsIGVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBEZW1vdGUgYWRtaW4gdXNlciAob25seSBtYXN0ZXIgYWRtaW4gY2FuIGRvIHRoaXMpXG4gIHN0YXRpYyBhc3luYyBkZW1vdGVGcm9tQWRtaW4oXG4gICAgdXNlcklkOiBzdHJpbmcsXG4gICAgZGVtb3RpbmdVc2VyOiBVc2VyLFxuICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuaXNNYXN0ZXJBZG1pbihkZW1vdGluZ1VzZXIuZW1haWwpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IG1hc3RlciBhZG1pbiBjYW4gZGVtb3RlIGFkbWluIHVzZXJzXCIpO1xuICAgIH1cblxuICAgIC8vIENhbm5vdCBkZW1vdGUgbWFzdGVyIGFkbWluXG4gICAgY29uc3QgdGFyZ2V0VXNlciA9IGF3YWl0IERhdGFiYXNlU2VydmljZS5nZXRVc2VyQnlJZCh1c2VySWQpO1xuICAgIGlmICh0YXJnZXRVc2VyICYmIHRoaXMuaXNNYXN0ZXJBZG1pbih0YXJnZXRVc2VyLmVtYWlsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGRlbW90ZSBtYXN0ZXIgYWRtaW5cIik7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRiXG4gICAgICAgIC51cGRhdGUodXNlcnNUYWJsZSlcbiAgICAgICAgLnNldCh7IHJvbGU6IFwidXNlclwiIH0pXG4gICAgICAgIC53aGVyZShlcSh1c2Vyc1RhYmxlLmlkLCB1c2VySWQpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGRlbW90ZSB1c2VyIGZyb20gYWRtaW46XCIsIGVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2xpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2xpYi9taWRkbGV3YXJlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9saWIvbWlkZGxld2FyZS50c1wiO2ltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSBcIi4vYXV0aC5qc1wiO1xuaW1wb3J0IHR5cGUgeyBVc2VyIH0gZnJvbSBcIi4vc2NoZW1hLmpzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aGVudGljYXRlZFJlcXVlc3QgZXh0ZW5kcyBSZXF1ZXN0IHtcbiAgdXNlcjogVXNlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBdXRoUmVzdWx0IHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgdXNlcj86IFVzZXI7XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG4vLyBNaWRkbGV3YXJlIHRvIHJlcXVpcmUgYXV0aGVudGljYXRpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlQXV0aChyZXE6IFJlcXVlc3QpOiBQcm9taXNlPEF1dGhSZXN1bHQ+IHtcbiAgdHJ5IHtcbiAgICAvLyBSZWFsIGF1dGhlbnRpY2F0aW9uIGlzIG5vdyBlbmFibGVkIC0gbm8gZGV2IG1vZGVcblxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBBdXRoU2VydmljZS5nZXRVc2VyRnJvbVJlcXVlc3QocmVxKTtcblxuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIkF1dGhlbnRpY2F0aW9uIHJlcXVpcmVkLiBQbGVhc2UgbG9nIGluLlwiLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHVzZXIsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiQXV0aGVudGljYXRpb24gbWlkZGxld2FyZSBlcnJvcjpcIiwgZXJyb3IpO1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZFwiLFxuICAgIH07XG4gIH1cbn1cblxuLy8gSGVscGVyIHRvIGNyZWF0ZSB1bmF1dGhvcml6ZWQgcmVzcG9uc2VcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVbmF1dGhvcml6ZWRSZXNwb25zZShtZXNzYWdlPzogc3RyaW5nKTogUmVzcG9uc2Uge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKFxuICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IG1lc3NhZ2UgfHwgXCJBdXRoZW50aWNhdGlvbiByZXF1aXJlZFwiLFxuICAgIH0pLFxuICAgIHtcbiAgICAgIHN0YXR1czogNDAxLFxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIH0sXG4gICk7XG59XG5cbi8vIEhlbHBlciB0byBjcmVhdGUgZm9yYmlkZGVuIHJlc3BvbnNlXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRm9yYmlkZGVuUmVzcG9uc2UobWVzc2FnZT86IHN0cmluZyk6IFJlc3BvbnNlIHtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBtZXNzYWdlIHx8IFwiQWRtaW4gYWNjZXNzIHJlcXVpcmVkXCIsXG4gICAgfSksXG4gICAge1xuICAgICAgc3RhdHVzOiA0MDMsXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgfSxcbiAgKTtcbn1cblxuLy8gT3B0aW9uYWwgYXV0aGVudGljYXRpb24gKGRvZXNuJ3QgZmFpbCBpZiBubyBhdXRoKVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wdGlvbmFsQXV0aChyZXE6IFJlcXVlc3QpOiBQcm9taXNlPFVzZXIgfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgLy8gUmVhbCBhdXRoZW50aWNhdGlvbiBpcyBub3cgZW5hYmxlZCAtIG5vIGRldiBtb2RlXG5cbiAgICByZXR1cm4gYXdhaXQgQXV0aFNlcnZpY2UuZ2V0VXNlckZyb21SZXF1ZXN0KHJlcSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIk9wdGlvbmFsIGF1dGggZXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBNaWRkbGV3YXJlIHRvIHJlcXVpcmUgYWRtaW4gYXV0aGVudGljYXRpb25cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlQWRtaW4ocmVxOiBSZXF1ZXN0KTogUHJvbWlzZTxBdXRoUmVzdWx0PiB7XG4gIHRyeSB7XG4gICAgLy8gRmlyc3QgY2hlY2sgaWYgdXNlciBpcyBhdXRoZW50aWNhdGVkXG4gICAgY29uc3QgYXV0aFJlc3VsdCA9IGF3YWl0IHJlcXVpcmVBdXRoKHJlcSk7XG4gICAgaWYgKCFhdXRoUmVzdWx0LnN1Y2Nlc3MgfHwgIWF1dGhSZXN1bHQudXNlcikge1xuICAgICAgcmV0dXJuIGF1dGhSZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBoYXMgYWRtaW4gcHJpdmlsZWdlc1xuICAgIGlmICghQXV0aFNlcnZpY2UuaXNBZG1pbihhdXRoUmVzdWx0LnVzZXIpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IFwiQWRtaW4gYWNjZXNzIHJlcXVpcmVkXCIsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBhdXRoUmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJBZG1pbiBhdXRoZW50aWNhdGlvbiBtaWRkbGV3YXJlIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IFwiQWRtaW4gYXV0aGVudGljYXRpb24gZmFpbGVkXCIsXG4gICAgfTtcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3JvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXMvdXNlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvc2VydmVyL3JvdXRlcy91c2VyLnRzXCI7aW1wb3J0IHsgUmVxdWVzdEhhbmRsZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL2xpYi9kYXRhYmFzZS5qc1wiO1xuaW1wb3J0IHtcbiAgcmVxdWlyZUF1dGgsXG4gIGNyZWF0ZVVuYXV0aG9yaXplZFJlc3BvbnNlLFxufSBmcm9tIFwiLi4vLi4vbGliL21pZGRsZXdhcmUuanNcIjtcbmltcG9ydCB0eXBlIHsgVXNlclN0YXRzUmVzcG9uc2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2FwaS5qc1wiO1xuXG5jb25zdCBNQVhfR0VORVJBVElPTlNfUEVSX01PTlRIID0gMzA7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVVc2VyU3RhdHM6IFJlcXVlc3RIYW5kbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gQ3JlYXRlIGEgUmVxdWVzdCBvYmplY3QgZm9yIGF1dGggbWlkZGxld2FyZVxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxLm9yaWdpbmFsVXJsLCBgaHR0cDovLyR7cmVxLmhlYWRlcnMuaG9zdH1gKTtcbiAgICBjb25zdCB3ZWJSZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLnRvU3RyaW5nKCksIHtcbiAgICAgIG1ldGhvZDogcmVxLm1ldGhvZCxcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzIGFzIEhlYWRlcnNJbml0LFxuICAgIH0pO1xuXG4gICAgLy8gUmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgIGNvbnN0IGF1dGhSZXN1bHQgPSBhd2FpdCByZXF1aXJlQXV0aCh3ZWJSZXF1ZXN0KTtcbiAgICBpZiAoIWF1dGhSZXN1bHQuc3VjY2VzcyB8fCAhYXV0aFJlc3VsdC51c2VyKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGF1dGhSZXN1bHQuZXJyb3IgfHwgXCJVbmF1dGhvcml6ZWRcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCB1c2VyID0gYXV0aFJlc3VsdC51c2VyO1xuXG4gICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byByZXNldCB0aGUgY291bnQgZm9yIG5ldyBtb250aFxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXNldERhdGUgPSB1c2VyLnJlc2V0RGF0ZSA/IG5ldyBEYXRlKHVzZXIucmVzZXREYXRlKSA6IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgbW9udGhzRGlmZiA9XG4gICAgICAoY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSAtIHJlc2V0RGF0ZS5nZXRGdWxsWWVhcigpKSAqIDEyICtcbiAgICAgIGN1cnJlbnREYXRlLmdldE1vbnRoKCkgLVxuICAgICAgcmVzZXREYXRlLmdldE1vbnRoKCk7XG5cbiAgICBpZiAobW9udGhzRGlmZiA+PSAxKSB7XG4gICAgICB1c2VyID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLnJlc2V0VXNlckdlbmVyYXRpb25Db3VudCh1c2VyLmlkKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyR2VuZXJhdGlvbkNvdW50ID0gdXNlci5nZW5lcmF0aW9uQ291bnQgfHwgMDtcbiAgICBjb25zdCByZW1haW5pbmdHZW5lcmF0aW9ucyA9IE1hdGgubWF4KFxuICAgICAgMCxcbiAgICAgIE1BWF9HRU5FUkFUSU9OU19QRVJfTU9OVEggLSB1c2VyR2VuZXJhdGlvbkNvdW50LFxuICAgICk7XG5cbiAgICBjb25zdCByZXNwb25zZURhdGE6IFVzZXJTdGF0c1Jlc3BvbnNlID0ge1xuICAgICAgdXNlcjoge1xuICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIG5hbWU6IHVzZXIubmFtZSB8fCBcIlwiLFxuICAgICAgICByb2xlOiB1c2VyLnJvbGUgfHwgXCJ1c2VyXCIsXG4gICAgICAgIGdlbmVyYXRpb25Db3VudDogdXNlckdlbmVyYXRpb25Db3VudCxcbiAgICAgICAgcmVzZXREYXRlOiB1c2VyLnJlc2V0RGF0ZT8udG9JU09TdHJpbmcoKSB8fCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIGlzQWRtaW46IHVzZXIucm9sZSA9PT0gXCJhZG1pblwiLFxuICAgICAgICBpc01hc3RlckFkbWluOiB1c2VyLmVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IFwiYWhtZWQuc2hlYWtoQGdtYWlsLmNvbVwiLFxuICAgICAgfSxcbiAgICAgIHJlbWFpbmluZ0dlbmVyYXRpb25zLFxuICAgICAgbWF4R2VuZXJhdGlvbnM6IE1BWF9HRU5FUkFUSU9OU19QRVJfTU9OVEgsXG4gICAgfTtcblxuICAgIHJlcy5qc29uKHJlc3BvbnNlRGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlVzZXIgc3RhdHMgZW5kcG9pbnQgZXJyb3I6XCIsIGVycm9yKTtcblxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IFwiRmFpbGVkIHRvIGdldCB1c2VyIHN0YXRzXCIsXG4gICAgfSk7XG4gIH1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3JvdXRlcy9zdHlsZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXMvc3R5bGVzLnRzXCI7aW1wb3J0IHsgUmVxdWVzdEhhbmRsZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgRGF0YWJhc2VTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL2xpYi9kYXRhYmFzZS5qc1wiO1xuaW1wb3J0IHR5cGUgeyBTdHlsZXNSZXNwb25zZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvYXBpLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTdHlsZXM6IFJlcXVlc3RIYW5kbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gR2V0IGFsbCBzdHlsZXMgZnJvbSBkYXRhYmFzZVxuICAgIGNvbnN0IHN0eWxlcyA9IGF3YWl0IERhdGFiYXNlU2VydmljZS5nZXRBbGxTdHlsZXMoKTtcblxuICAgIC8vIFRyYW5zZm9ybSBkYXRhYmFzZSBzdHlsZXMgdG8gQVBJIGZvcm1hdFxuICAgIGNvbnN0IGZvcm1hdHRlZFN0eWxlcyA9IHN0eWxlcy5tYXAoKHN0eWxlKSA9PiAoe1xuICAgICAgaWQ6IHN0eWxlLmlkLFxuICAgICAgbmFtZTogc3R5bGUubmFtZSB8fCBcIlwiLFxuICAgICAgZGVzY3JpcHRpb246IHN0eWxlLmRlc2NyaXB0aW9uIHx8IFwiXCIsXG4gICAgICB0aHVtYm5haWw6IHN0eWxlLnRodW1ibmFpbCB8fCBcIlwiLFxuICAgICAgcHJvbXB0SnNvbjogc3R5bGUucHJvbXB0SnNvbiB8fCB7fSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCByZXNwb25zZURhdGE6IFN0eWxlc1Jlc3BvbnNlID0ge1xuICAgICAgc3R5bGVzOiBmb3JtYXR0ZWRTdHlsZXMsXG4gICAgfTtcblxuICAgIHJlcy5qc29uKHJlc3BvbnNlRGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlN0eWxlcyBlbmRwb2ludCBlcnJvcjpcIiwgZXJyb3IpO1xuXG4gICAgY29uc3QgcmVzcG9uc2VEYXRhOiBTdHlsZXNSZXNwb25zZSA9IHtcbiAgICAgIHN0eWxlczogW10sXG4gICAgfTtcblxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHJlc3BvbnNlRGF0YSk7XG4gIH1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3JvdXRlcy9hdXRoLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9zZXJ2ZXIvcm91dGVzL2F1dGgudHNcIjtpbXBvcnQgdHlwZSB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL2xpYi9hdXRoLmpzXCI7XG5cbi8vIEdvb2dsZSBPQXV0aCBVUkwgZW5kcG9pbnRcbmV4cG9ydCBjb25zdCBoYW5kbGVHb29nbGVBdXRoID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xuICB0cnkge1xuICAgIC8vIEdlbmVyYXRlIEdvb2dsZSBPQXV0aCBVUkxcbiAgICBjb25zdCBhdXRoVXJsID0gQXV0aFNlcnZpY2UuZ2V0R29vZ2xlQXV0aFVybCgpO1xuXG4gICAgcmVzLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGF1dGhVcmwsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkdvb2dsZSBPQXV0aCBVUkwgZ2VuZXJhdGlvbiBlcnJvcjpcIiwgZXJyb3IpO1xuXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgYXV0aGVudGljYXRpb24gVVJMXCIsXG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIEdvb2dsZSBPQXV0aCBjYWxsYmFjayBlbmRwb2ludFxuZXhwb3J0IGNvbnN0IGhhbmRsZUF1dGhDYWxsYmFjayA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGNvZGUsIGVycm9yIH0gPSByZXEucXVlcnk7XG5cbiAgICAvLyBIYW5kbGUgT0F1dGggZXJyb3JzXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGBPQXV0aCBlcnJvcjogJHtlcnJvcn1gLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFjb2RlIHx8IHR5cGVvZiBjb2RlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IFwiQXV0aG9yaXphdGlvbiBjb2RlIG5vdCBwcm92aWRlZFwiLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRXhjaGFuZ2UgY29kZSBmb3IgdXNlciBpbmZvXG4gICAgY29uc3QgZ29vZ2xlVXNlciA9IGF3YWl0IEF1dGhTZXJ2aWNlLmV4Y2hhbmdlR29vZ2xlQ29kZShjb2RlKTtcbiAgICBpZiAoIWdvb2dsZVVzZXIpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogXCJGYWlsZWQgdG8gYXV0aGVudGljYXRlIHdpdGggR29vZ2xlXCIsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBdXRoZW50aWNhdGUgb3IgY3JlYXRlIHVzZXJcbiAgICBjb25zdCB7IHVzZXIsIHRva2VuLCBpc05ld1VzZXIgfSA9XG4gICAgICBhd2FpdCBBdXRoU2VydmljZS5hdXRoZW50aWNhdGVXaXRoR29vZ2xlKGdvb2dsZVVzZXIpO1xuXG4gICAgLy8gUmVkaXJlY3QgdG8gZnJvbnRlbmQgY2FsbGJhY2sgcGFnZSB3aXRoIHRva2VuIGFuZCB1c2VyIGRhdGEgaW4gVVJMXG4gICAgY29uc3QgYmFzZVVybCA9XG4gICAgICBwcm9jZXNzLmVudi5GTFlfQVBQX05BTUUgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiXG4gICAgICAgID8gXCJodHRwczovL21hZGFyLWFpLmZseS5kZXZcIlxuICAgICAgICA6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwXCI7XG4gICAgY29uc3QgY2FsbGJhY2tVcmwgPSBuZXcgVVJMKFwiL2FyL2F1dGgvY2FsbGJhY2tcIiwgYmFzZVVybCk7XG4gICAgY2FsbGJhY2tVcmwuc2VhcmNoUGFyYW1zLnNldChcInRva2VuXCIsIHRva2VuKTtcbiAgICBjYWxsYmFja1VybC5zZWFyY2hQYXJhbXMuc2V0KFxuICAgICAgXCJ1c2VyXCIsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICBwcm9maWxlUGljdHVyZTogdXNlci5wcm9maWxlUGljdHVyZSxcbiAgICAgICAgZ2VuZXJhdGlvbkNvdW50OiB1c2VyLmdlbmVyYXRpb25Db3VudCxcbiAgICAgICAgcmVzZXREYXRlOiB1c2VyLnJlc2V0RGF0ZT8udG9JU09TdHJpbmcoKSxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgY2FsbGJhY2tVcmwuc2VhcmNoUGFyYW1zLnNldChcImlzTmV3VXNlclwiLCBpc05ld1VzZXIudG9TdHJpbmcoKSk7XG5cbiAgICByZXMucmVkaXJlY3QoY2FsbGJhY2tVcmwudG9TdHJpbmcoKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkdvb2dsZSBPQXV0aCBjYWxsYmFjayBlcnJvcjpcIiwgZXJyb3IpO1xuXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJBdXRoZW50aWNhdGlvbiBmYWlsZWRcIixcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gTG9nb3V0IGVuZHBvaW50XG5leHBvcnQgY29uc3QgaGFuZGxlTG9nb3V0ID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xuICB0cnkge1xuICAgIC8vIEZvciBub3csIGxvZ291dCBpcyBoYW5kbGVkIGNsaWVudC1zaWRlIChjbGVhcmluZyBKV1QpXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgd2UgY291bGQgYWRkIHRva2VuIGJsYWNrbGlzdGluZyBoZXJlXG5cbiAgICByZXMuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgbWVzc2FnZTogXCJMb2dnZWQgb3V0IHN1Y2Nlc3NmdWxseVwiLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJMb2dvdXQgZXJyb3I6XCIsIGVycm9yKTtcblxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IFwiTG9nb3V0IGZhaWxlZFwiLFxuICAgIH0pO1xuICB9XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvc2VydmVyL3JvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXMvYWRtaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9yb3V0ZXMvYWRtaW4udHNcIjtpbXBvcnQgdHlwZSB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IERhdGFiYXNlU2VydmljZSB9IGZyb20gXCIuLi8uLi9saWIvZGF0YWJhc2UuanNcIjtcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL2xpYi9hdXRoLmpzXCI7XG5pbXBvcnQge1xuICByZXF1aXJlQWRtaW4sXG4gIGNyZWF0ZVVuYXV0aG9yaXplZFJlc3BvbnNlLFxuICBjcmVhdGVGb3JiaWRkZW5SZXNwb25zZSxcbn0gZnJvbSBcIi4uLy4uL2xpYi9taWRkbGV3YXJlLmpzXCI7XG5cbi8vIEdldCBhbGwgdXNlcnMgKGFkbWluIG9ubHkpXG5leHBvcnQgY29uc3QgaGFuZGxlR2V0QWxsVXNlcnMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gQ3JlYXRlIGEgUmVxdWVzdCBvYmplY3QgZm9yIGF1dGggbWlkZGxld2FyZVxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxLm9yaWdpbmFsVXJsLCBgaHR0cDovLyR7cmVxLmhlYWRlcnMuaG9zdH1gKTtcbiAgICBjb25zdCB3ZWJSZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLnRvU3RyaW5nKCksIHtcbiAgICAgIG1ldGhvZDogcmVxLm1ldGhvZCxcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzIGFzIEhlYWRlcnNJbml0LFxuICAgIH0pO1xuXG4gICAgLy8gUmVxdWlyZSBhZG1pbiBhdXRoZW50aWNhdGlvblxuICAgIGNvbnN0IGF1dGhSZXN1bHQgPSBhd2FpdCByZXF1aXJlQWRtaW4od2ViUmVxdWVzdCk7XG4gICAgaWYgKCFhdXRoUmVzdWx0LnN1Y2Nlc3MgfHwgIWF1dGhSZXN1bHQudXNlcikge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoYXV0aFJlc3VsdC5lcnJvcj8uaW5jbHVkZXMoXCJBZG1pblwiKSA/IDQwMyA6IDQwMSkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogYXV0aFJlc3VsdC5lcnJvciB8fCBcIlVuYXV0aG9yaXplZFwiLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbGltaXQgPSBwYXJzZUludChyZXEucXVlcnkubGltaXQgYXMgc3RyaW5nKSB8fCA1MDtcbiAgICBjb25zdCBvZmZzZXQgPSBwYXJzZUludChyZXEucXVlcnkub2Zmc2V0IGFzIHN0cmluZykgfHwgMDtcblxuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLmdldEFsbFVzZXJzKGxpbWl0LCBvZmZzZXQpO1xuICAgIGNvbnN0IHRvdGFsQ291bnQgPSBhd2FpdCBEYXRhYmFzZVNlcnZpY2UuZ2V0VXNlckNvdW50KCk7XG5cbiAgICAvLyBEb24ndCByZXR1cm4gc2Vuc2l0aXZlIGluZm9ybWF0aW9uXG4gICAgY29uc3Qgc2FmZVVzZXJzID0gdXNlcnMubWFwKCh1c2VyKSA9PiAoe1xuICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgIGdlbmVyYXRpb25Db3VudDogdXNlci5nZW5lcmF0aW9uQ291bnQsXG4gICAgICByZXNldERhdGU6IHVzZXIucmVzZXREYXRlPy50b0lTT1N0cmluZygpLFxuICAgICAgY3JlYXRlZEF0OiB1c2VyLmNyZWF0ZWRBdD8udG9JU09TdHJpbmcoKSxcbiAgICAgIGxhc3RMb2dpbkF0OiB1c2VyLmxhc3RMb2dpbkF0Py50b0lTT1N0cmluZygpLFxuICAgICAgaXNNYXN0ZXJBZG1pbjogQXV0aFNlcnZpY2UuaXNNYXN0ZXJBZG1pbih1c2VyLmVtYWlsKSxcbiAgICB9KSk7XG5cbiAgICByZXMuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgdXNlcnM6IHNhZmVVc2VycyxcbiAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgdG90YWw6IHRvdGFsQ291bnQsXG4gICAgICAgIGxpbWl0LFxuICAgICAgICBvZmZzZXQsXG4gICAgICAgIGhhc01vcmU6IG9mZnNldCArIGxpbWl0IDwgdG90YWxDb3VudCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkdldCBhbGwgdXNlcnMgZXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBcIkZhaWxlZCB0byBmZXRjaCB1c2Vyc1wiLFxuICAgIH0pO1xuICB9XG59O1xuXG4vLyBQcm9tb3RlIHVzZXIgdG8gYWRtaW4gKG1hc3RlciBhZG1pbiBvbmx5KVxuZXhwb3J0IGNvbnN0IGhhbmRsZVByb21vdGVVc2VyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgdXNlcklkIH0gPSByZXEucGFyYW1zO1xuXG4gICAgLy8gQ3JlYXRlIGEgUmVxdWVzdCBvYmplY3QgZm9yIGF1dGggbWlkZGxld2FyZVxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxLm9yaWdpbmFsVXJsLCBgaHR0cDovLyR7cmVxLmhlYWRlcnMuaG9zdH1gKTtcbiAgICBjb25zdCB3ZWJSZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLnRvU3RyaW5nKCksIHtcbiAgICAgIG1ldGhvZDogcmVxLm1ldGhvZCxcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzIGFzIEhlYWRlcnNJbml0LFxuICAgIH0pO1xuXG4gICAgLy8gUmVxdWlyZSBhZG1pbiBhdXRoZW50aWNhdGlvblxuICAgIGNvbnN0IGF1dGhSZXN1bHQgPSBhd2FpdCByZXF1aXJlQWRtaW4od2ViUmVxdWVzdCk7XG4gICAgaWYgKCFhdXRoUmVzdWx0LnN1Y2Nlc3MgfHwgIWF1dGhSZXN1bHQudXNlcikge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoYXV0aFJlc3VsdC5lcnJvcj8uaW5jbHVkZXMoXCJBZG1pblwiKSA/IDQwMyA6IDQwMSkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogYXV0aFJlc3VsdC5lcnJvciB8fCBcIlVuYXV0aG9yaXplZFwiLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT25seSBtYXN0ZXIgYWRtaW4gY2FuIHByb21vdGUgdXNlcnNcbiAgICBpZiAoIUF1dGhTZXJ2aWNlLmlzTWFzdGVyQWRtaW4oYXV0aFJlc3VsdC51c2VyLmVtYWlsKSkge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAzKS5qc29uKHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIk9ubHkgbWFzdGVyIGFkbWluIGNhbiBwcm9tb3RlIHVzZXJzXCIsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQgQXV0aFNlcnZpY2UucHJvbW90ZVRvQWRtaW4odXNlcklkLCBhdXRoUmVzdWx0LnVzZXIpO1xuXG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgIHJlcy5qc29uKHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogXCJVc2VyIHByb21vdGVkIHRvIGFkbWluIHN1Y2Nlc3NmdWxseVwiLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIkZhaWxlZCB0byBwcm9tb3RlIHVzZXJcIixcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiUHJvbW90ZSB1c2VyIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byBwcm9tb3RlIHVzZXJcIixcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gRGVtb3RlIHVzZXIgZnJvbSBhZG1pbiAobWFzdGVyIGFkbWluIG9ubHkpXG5leHBvcnQgY29uc3QgaGFuZGxlRGVtb3RlVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHVzZXJJZCB9ID0gcmVxLnBhcmFtcztcblxuICAgIC8vIENyZWF0ZSBhIFJlcXVlc3Qgb2JqZWN0IGZvciBhdXRoIG1pZGRsZXdhcmVcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcS5vcmlnaW5hbFVybCwgYGh0dHA6Ly8ke3JlcS5oZWFkZXJzLmhvc3R9YCk7XG4gICAgY29uc3Qgd2ViUmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybC50b1N0cmluZygpLCB7XG4gICAgICBtZXRob2Q6IHJlcS5tZXRob2QsXG4gICAgICBoZWFkZXJzOiByZXEuaGVhZGVycyBhcyBIZWFkZXJzSW5pdCxcbiAgICB9KTtcblxuICAgIC8vIFJlcXVpcmUgYWRtaW4gYXV0aGVudGljYXRpb25cbiAgICBjb25zdCBhdXRoUmVzdWx0ID0gYXdhaXQgcmVxdWlyZUFkbWluKHdlYlJlcXVlc3QpO1xuICAgIGlmICghYXV0aFJlc3VsdC5zdWNjZXNzIHx8ICFhdXRoUmVzdWx0LnVzZXIpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKGF1dGhSZXN1bHQuZXJyb3I/LmluY2x1ZGVzKFwiQWRtaW5cIikgPyA0MDMgOiA0MDEpLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGF1dGhSZXN1bHQuZXJyb3IgfHwgXCJVbmF1dGhvcml6ZWRcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE9ubHkgbWFzdGVyIGFkbWluIGNhbiBkZW1vdGUgdXNlcnNcbiAgICBpZiAoIUF1dGhTZXJ2aWNlLmlzTWFzdGVyQWRtaW4oYXV0aFJlc3VsdC51c2VyLmVtYWlsKSkge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAzKS5qc29uKHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIk9ubHkgbWFzdGVyIGFkbWluIGNhbiBkZW1vdGUgdXNlcnNcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCBBdXRoU2VydmljZS5kZW1vdGVGcm9tQWRtaW4odXNlcklkLCBhdXRoUmVzdWx0LnVzZXIpO1xuXG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgIHJlcy5qc29uKHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogXCJVc2VyIGRlbW90ZWQgZnJvbSBhZG1pbiBzdWNjZXNzZnVsbHlcIixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogXCJGYWlsZWQgdG8gZGVtb3RlIHVzZXJcIixcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRGVtb3RlIHVzZXIgZXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIGRlbW90ZSB1c2VyXCIsXG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIFJlc2V0IHVzZXIgZ2VuZXJhdGlvbiBjb3VudCAoYWRtaW4gb25seSlcbmV4cG9ydCBjb25zdCBoYW5kbGVSZXNldFVzZXJHZW5lcmF0aW9ucyA9IGFzeW5jIChcbiAgcmVxOiBSZXF1ZXN0LFxuICByZXM6IFJlc3BvbnNlLFxuKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyB1c2VySWQgfSA9IHJlcS5wYXJhbXM7XG5cbiAgICAvLyBDcmVhdGUgYSBSZXF1ZXN0IG9iamVjdCBmb3IgYXV0aCBtaWRkbGV3YXJlXG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXEub3JpZ2luYWxVcmwsIGBodHRwOi8vJHtyZXEuaGVhZGVycy5ob3N0fWApO1xuICAgIGNvbnN0IHdlYlJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwudG9TdHJpbmcoKSwge1xuICAgICAgbWV0aG9kOiByZXEubWV0aG9kLFxuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMgYXMgSGVhZGVyc0luaXQsXG4gICAgfSk7XG5cbiAgICAvLyBSZXF1aXJlIGFkbWluIGF1dGhlbnRpY2F0aW9uXG4gICAgY29uc3QgYXV0aFJlc3VsdCA9IGF3YWl0IHJlcXVpcmVBZG1pbih3ZWJSZXF1ZXN0KTtcbiAgICBpZiAoIWF1dGhSZXN1bHQuc3VjY2VzcyB8fCAhYXV0aFJlc3VsdC51c2VyKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyhhdXRoUmVzdWx0LmVycm9yPy5pbmNsdWRlcyhcIkFkbWluXCIpID8gNDAzIDogNDAxKS5qc29uKHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBhdXRoUmVzdWx0LmVycm9yIHx8IFwiVW5hdXRob3JpemVkXCIsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyID0gYXdhaXQgRGF0YWJhc2VTZXJ2aWNlLnJlc2V0VXNlckdlbmVyYXRpb25Db3VudCh1c2VySWQpO1xuXG4gICAgcmVzLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiVXNlciBnZW5lcmF0aW9uIGNvdW50IHJlc2V0IHN1Y2Nlc3NmdWxseVwiLFxuICAgICAgdXNlcjoge1xuICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIGdlbmVyYXRpb25Db3VudDogdXNlci5nZW5lcmF0aW9uQ291bnQsXG4gICAgICAgIHJlc2V0RGF0ZTogdXNlci5yZXNldERhdGU/LnRvSVNPU3RyaW5nKCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJSZXNldCB1c2VyIGdlbmVyYXRpb25zIGVycm9yOlwiLCBlcnJvcik7XG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogXCJGYWlsZWQgdG8gcmVzZXQgdXNlciBnZW5lcmF0aW9uIGNvdW50XCIsXG4gICAgfSk7XG4gIH1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9zZXJ2ZXIvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3NlcnZlci9pbmRleC50c1wiO2ltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuXG4vLyBJbXBvcnQgRXhwcmVzcyByb3V0ZSBoYW5kbGVyc1xuaW1wb3J0IHsgaGFuZGxlVXNlclN0YXRzIH0gZnJvbSBcIi4vcm91dGVzL3VzZXIuanNcIjtcbmltcG9ydCB7IGhhbmRsZVN0eWxlcyB9IGZyb20gXCIuL3JvdXRlcy9zdHlsZXMuanNcIjtcbmltcG9ydCB7XG4gIGhhbmRsZUdvb2dsZUF1dGgsXG4gIGhhbmRsZUF1dGhDYWxsYmFjayxcbiAgaGFuZGxlTG9nb3V0LFxufSBmcm9tIFwiLi9yb3V0ZXMvYXV0aC5qc1wiO1xuaW1wb3J0IHtcbiAgaGFuZGxlR2V0QWxsVXNlcnMsXG4gIGhhbmRsZVByb21vdGVVc2VyLFxuICBoYW5kbGVEZW1vdGVVc2VyLFxuICBoYW5kbGVSZXNldFVzZXJHZW5lcmF0aW9ucyxcbn0gZnJvbSBcIi4vcm91dGVzL2FkbWluLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXJ2ZXIoKSB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuICAvLyBNaWRkbGV3YXJlXG4gIGFwcC51c2UoY29ycygpKTtcbiAgYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogXCIxMG1iXCIgfSkpO1xuICBhcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcblxuICAvLyBBUEkgUm91dGVzXG4gIGFwcC5nZXQoXCIvcGluZ1wiLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiTUFEQVIgQUkgRXhwcmVzcyBTZXJ2ZXIgaXMgcnVubmluZyFcIiB9KTtcbiAgfSk7XG5cbiAgYXBwLmdldChcIi91c2VyXCIsIGhhbmRsZVVzZXJTdGF0cyk7XG4gIGFwcC5nZXQoXCIvc3R5bGVzXCIsIGhhbmRsZVN0eWxlcyk7XG5cbiAgLy8gQXV0aCByb3V0ZXNcbiAgYXBwLmdldChcIi9hdXRoL2dvb2dsZVwiLCBoYW5kbGVHb29nbGVBdXRoKTtcbiAgYXBwLmdldChcIi9hdXRoL2NhbGxiYWNrXCIsIGhhbmRsZUF1dGhDYWxsYmFjayk7XG4gIGFwcC5wb3N0KFwiL2F1dGgvbG9nb3V0XCIsIGhhbmRsZUxvZ291dCk7XG5cbiAgLy8gRGVidWcgZW5kcG9pbnQgdG8gY2hlY2sgT0F1dGggY29uZmlnXG4gIGFwcC5nZXQoXCIvYXV0aC9jb25maWdcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgaXNQcm9kdWN0aW9uID1cbiAgICAgIHByb2Nlc3MuZW52LkZMWV9BUFBfTkFNRSB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCI7XG4gICAgY29uc3QgcmVkaXJlY3RVcmkgPSBpc1Byb2R1Y3Rpb25cbiAgICAgID8gXCJodHRwczovL21hZGFyLWFpLmZseS5kZXYvYXBpL2F1dGgvY2FsbGJhY2tcIlxuICAgICAgOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvYXV0aC9jYWxsYmFja1wiO1xuXG4gICAgcmVzLmpzb24oe1xuICAgICAgZW52aXJvbm1lbnQ6IGlzUHJvZHVjdGlvbiA/IFwicHJvZHVjdGlvblwiIDogXCJkZXZlbG9wbWVudFwiLFxuICAgICAgcmVkaXJlY3RVcmksXG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCA/IFwiKioqY29uZmlndXJlZCoqKlwiIDogXCJub3Qgc2V0XCIsXG4gICAgICBmbHlBcHBOYW1lOiBwcm9jZXNzLmVudi5GTFlfQVBQX05BTUUgfHwgXCJub3Qgc2V0XCIsXG4gICAgICBub2RlRW52OiBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCBcIm5vdCBzZXRcIixcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gQWRtaW4gcm91dGVzXG4gIGFwcC5nZXQoXCIvYWRtaW4vdXNlcnNcIiwgaGFuZGxlR2V0QWxsVXNlcnMpO1xuICBhcHAucG9zdChcIi9hZG1pbi91c2Vycy86dXNlcklkL3Byb21vdGVcIiwgaGFuZGxlUHJvbW90ZVVzZXIpO1xuICBhcHAucG9zdChcIi9hZG1pbi91c2Vycy86dXNlcklkL2RlbW90ZVwiLCBoYW5kbGVEZW1vdGVVc2VyKTtcbiAgYXBwLnBvc3QoXG4gICAgXCIvYWRtaW4vdXNlcnMvOnVzZXJJZC9yZXNldC1nZW5lcmF0aW9uc1wiLFxuICAgIGhhbmRsZVJlc2V0VXNlckdlbmVyYXRpb25zLFxuICApO1xuXG4gIC8vIE1pZ3JhdGlvbiByb3V0ZSAoZGV2ZWxvcG1lbnQgb25seSlcbiAgYXBwLmdldChcIi9ydW4tbWlncmF0aW9uXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IG5lb24gfSA9IGF3YWl0IGltcG9ydChcIkBuZW9uZGF0YWJhc2Uvc2VydmVybGVzc1wiKTtcblxuICAgICAgaWYgKCFwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiREFUQUJBU0VfVVJMIG5vdCBjb25maWd1cmVkXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzcWwgPSBuZW9uKHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCk7XG5cbiAgICAgIGNvbnN0IG1pZ3JhdGlvblNRTCA9IGBcbiAgICAgICAgLS0gRHJvcCBleGlzdGluZyB0YWJsZXMgaWYgdGhleSBleGlzdCB0byBzdGFydCBmcmVzaFxuICAgICAgICBEUk9QIFRBQkxFIElGIEVYSVNUUyBcImltYWdlc1wiIENBU0NBREU7XG4gICAgICAgIERST1AgVEFCTEUgSUYgRVhJU1RTIFwic2Vzc2lvbnNcIiBDQVNDQURFO1xuICAgICAgICBEUk9QIFRBQkxFIElGIEVYSVNUUyBcInN0eWxlc1wiIENBU0NBREU7XG4gICAgICAgIERST1AgVEFCTEUgSUYgRVhJU1RTIFwidXNlcnNcIiBDQVNDQURFO1xuXG4gICAgICAgIC0tIENyZWF0ZSB1c2VycyB0YWJsZVxuICAgICAgICBDUkVBVEUgVEFCTEUgXCJ1c2Vyc1wiIChcbiAgICAgICAgICBcImlkXCIgdXVpZCBQUklNQVJZIEtFWSBERUZBVUxUIGdlbl9yYW5kb21fdXVpZCgpIE5PVCBOVUxMLFxuICAgICAgICAgIFwiZW1haWxcIiB0ZXh0IE5PVCBOVUxMLFxuICAgICAgICAgIFwibmFtZVwiIHRleHQsXG4gICAgICAgICAgXCJnb29nbGVfaWRcIiB0ZXh0LFxuICAgICAgICAgIFwicHJvZmlsZV9waWN0dXJlXCIgdGV4dCxcbiAgICAgICAgICBcImdlbmVyYXRpb25fY291bnRcIiBpbnRlZ2VyIERFRkFVTFQgMCxcbiAgICAgICAgICBcInJlc2V0X2RhdGVcIiB0aW1lc3RhbXAgREVGQVVMVCBub3coKSxcbiAgICAgICAgICBcImNyZWF0ZWRfYXRcIiB0aW1lc3RhbXAgREVGQVVMVCBub3coKSxcbiAgICAgICAgICBcImxhc3RfbG9naW5fYXRcIiB0aW1lc3RhbXAsXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInVzZXJzX2VtYWlsX3VuaXF1ZVwiIFVOSVFVRShcImVtYWlsXCIpLFxuICAgICAgICAgIENPTlNUUkFJTlQgXCJ1c2Vyc19nb29nbGVfaWRfdW5pcXVlXCIgVU5JUVVFKFwiZ29vZ2xlX2lkXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgLS0gQ3JlYXRlIHNlc3Npb25zIHRhYmxlXG4gICAgICAgIENSRUFURSBUQUJMRSBcInNlc3Npb25zXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJ1c2VyX2lkXCIgdXVpZCxcbiAgICAgICAgICBcInRva2VuXCIgdGV4dCBOT1QgTlVMTCxcbiAgICAgICAgICBcImV4cGlyZXNfYXRcIiB0aW1lc3RhbXAgTk9UIE5VTEwsXG4gICAgICAgICAgXCJjcmVhdGVkX2F0XCIgdGltZXN0YW1wIERFRkFVTFQgbm93KCksXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInNlc3Npb25zX3Rva2VuX3VuaXF1ZVwiIFVOSVFVRShcInRva2VuXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgLS0gQ3JlYXRlIHN0eWxlcyB0YWJsZVxuICAgICAgICBDUkVBVEUgVEFCTEUgXCJzdHlsZXNcIiAoXG4gICAgICAgICAgXCJpZFwiIHV1aWQgUFJJTUFSWSBLRVkgREVGQVVMVCBnZW5fcmFuZG9tX3V1aWQoKSBOT1QgTlVMTCxcbiAgICAgICAgICBcIm5hbWVcIiB0ZXh0LFxuICAgICAgICAgIFwiZGVzY3JpcHRpb25cIiB0ZXh0LFxuICAgICAgICAgIFwidGh1bWJuYWlsXCIgdGV4dCxcbiAgICAgICAgICBcInByb21wdF9qc29uXCIganNvbmJcbiAgICAgICAgKTtcblxuICAgICAgICAtLSBDcmVhdGUgaW1hZ2VzIHRhYmxlXG4gICAgICAgIENSRUFURSBUQUJMRSBcImltYWdlc1wiIChcbiAgICAgICAgICBcImlkXCIgdXVpZCBQUklNQVJZIEtFWSBERUZBVUxUIGdlbl9yYW5kb21fdXVpZCgpIE5PVCBOVUxMLFxuICAgICAgICAgIFwidXNlcl9pZFwiIHV1aWQsXG4gICAgICAgICAgXCJpbWFnZV91cmxcIiB0ZXh0LFxuICAgICAgICAgIFwicHJvbXB0XCIgdGV4dCxcbiAgICAgICAgICBcInN0eWxlX25hbWVcIiB0ZXh0LFxuICAgICAgICAgIFwiY29sb3JzXCIgdGV4dFtdLFxuICAgICAgICAgIFwiY3JlYXRlZF9hdFwiIHRpbWVzdGFtcCBERUZBVUxUIG5vdygpXG4gICAgICAgICk7XG5cbiAgICAgICAgLS0gQWRkIGZvcmVpZ24ga2V5IGNvbnN0cmFpbnRzXG4gICAgICAgIEFMVEVSIFRBQkxFIFwiaW1hZ2VzXCIgQUREIENPTlNUUkFJTlQgXCJpbWFnZXNfdXNlcl9pZF91c2Vyc19pZF9ma1wiXG4gICAgICAgICAgRk9SRUlHTiBLRVkgKFwidXNlcl9pZFwiKSBSRUZFUkVOQ0VTIFwicHVibGljXCIuXCJ1c2Vyc1wiKFwiaWRcIikgT04gREVMRVRFIG5vIGFjdGlvbiBPTiBVUERBVEUgbm8gYWN0aW9uO1xuXG4gICAgICAgIEFMVEVSIFRBQkxFIFwic2Vzc2lvbnNcIiBBREQgQ09OU1RSQUlOVCBcInNlc3Npb25zX3VzZXJfaWRfdXNlcnNfaWRfZmtcIlxuICAgICAgICAgIEZPUkVJR04gS0VZIChcInVzZXJfaWRcIikgUkVGRVJFTkNFUyBcInB1YmxpY1wiLlwidXNlcnNcIihcImlkXCIpIE9OIERFTEVURSBjYXNjYWRlIE9OIFVQREFURSBubyBhY3Rpb247XG4gICAgICBgO1xuXG4gICAgICAvLyBSdW4gdGhlIG1pZ3JhdGlvbiBzdGF0ZW1lbnRzIHNlcGFyYXRlbHlcbiAgICAgIGF3YWl0IHNxbGBEUk9QIFRBQkxFIElGIEVYSVNUUyBcImltYWdlc1wiIENBU0NBREVgO1xuICAgICAgYXdhaXQgc3FsYERST1AgVEFCTEUgSUYgRVhJU1RTIFwic2Vzc2lvbnNcIiBDQVNDQURFYDtcbiAgICAgIGF3YWl0IHNxbGBEUk9QIFRBQkxFIElGIEVYSVNUUyBcInN0eWxlc1wiIENBU0NBREVgO1xuICAgICAgYXdhaXQgc3FsYERST1AgVEFCTEUgSUYgRVhJU1RTIFwidXNlcnNcIiBDQVNDQURFYDtcblxuICAgICAgLy8gQ3JlYXRlIHVzZXJzIHRhYmxlXG4gICAgICBhd2FpdCBzcWxgXG4gICAgICAgIENSRUFURSBUQUJMRSBcInVzZXJzXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJlbWFpbFwiIHRleHQgTk9UIE5VTEwsXG4gICAgICAgICAgXCJuYW1lXCIgdGV4dCxcbiAgICAgICAgICBcImdvb2dsZV9pZFwiIHRleHQsXG4gICAgICAgICAgXCJwcm9maWxlX3BpY3R1cmVcIiB0ZXh0LFxuICAgICAgICAgIFwiZ2VuZXJhdGlvbl9jb3VudFwiIGludGVnZXIgREVGQVVMVCAwLFxuICAgICAgICAgIFwicmVzZXRfZGF0ZVwiIHRpbWVzdGFtcCBERUZBVUxUIG5vdygpLFxuICAgICAgICAgIFwiY3JlYXRlZF9hdFwiIHRpbWVzdGFtcCBERUZBVUxUIG5vdygpLFxuICAgICAgICAgIFwibGFzdF9sb2dpbl9hdFwiIHRpbWVzdGFtcCxcbiAgICAgICAgICBDT05TVFJBSU5UIFwidXNlcnNfZW1haWxfdW5pcXVlXCIgVU5JUVVFKFwiZW1haWxcIiksXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInVzZXJzX2dvb2dsZV9pZF91bmlxdWVcIiBVTklRVUUoXCJnb29nbGVfaWRcIilcbiAgICAgICAgKVxuICAgICAgYDtcblxuICAgICAgLy8gQ3JlYXRlIHNlc3Npb25zIHRhYmxlXG4gICAgICBhd2FpdCBzcWxgXG4gICAgICAgIENSRUFURSBUQUJMRSBcInNlc3Npb25zXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJ1c2VyX2lkXCIgdXVpZCxcbiAgICAgICAgICBcInRva2VuXCIgdGV4dCBOT1QgTlVMTCxcbiAgICAgICAgICBcImV4cGlyZXNfYXRcIiB0aW1lc3RhbXAgTk9UIE5VTEwsXG4gICAgICAgICAgXCJjcmVhdGVkX2F0XCIgdGltZXN0YW1wIERFRkFVTFQgbm93KCksXG4gICAgICAgICAgQ09OU1RSQUlOVCBcInNlc3Npb25zX3Rva2VuX3VuaXF1ZVwiIFVOSVFVRShcInRva2VuXCIpXG4gICAgICAgIClcbiAgICAgIGA7XG5cbiAgICAgIC8vIENyZWF0ZSBzdHlsZXMgdGFibGVcbiAgICAgIGF3YWl0IHNxbGBcbiAgICAgICAgQ1JFQVRFIFRBQkxFIFwic3R5bGVzXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJuYW1lXCIgdGV4dCxcbiAgICAgICAgICBcImRlc2NyaXB0aW9uXCIgdGV4dCxcbiAgICAgICAgICBcInRodW1ibmFpbFwiIHRleHQsXG4gICAgICAgICAgXCJwcm9tcHRfanNvblwiIGpzb25iXG4gICAgICAgIClcbiAgICAgIGA7XG5cbiAgICAgIC8vIENyZWF0ZSBpbWFnZXMgdGFibGVcbiAgICAgIGF3YWl0IHNxbGBcbiAgICAgICAgQ1JFQVRFIFRBQkxFIFwiaW1hZ2VzXCIgKFxuICAgICAgICAgIFwiaWRcIiB1dWlkIFBSSU1BUlkgS0VZIERFRkFVTFQgZ2VuX3JhbmRvbV91dWlkKCkgTk9UIE5VTEwsXG4gICAgICAgICAgXCJ1c2VyX2lkXCIgdXVpZCxcbiAgICAgICAgICBcImltYWdlX3VybFwiIHRleHQsXG4gICAgICAgICAgXCJwcm9tcHRcIiB0ZXh0LFxuICAgICAgICAgIFwic3R5bGVfbmFtZVwiIHRleHQsXG4gICAgICAgICAgXCJjb2xvcnNcIiB0ZXh0W10sXG4gICAgICAgICAgXCJjcmVhdGVkX2F0XCIgdGltZXN0YW1wIERFRkFVTFQgbm93KClcbiAgICAgICAgKVxuICAgICAgYDtcblxuICAgICAgLy8gQWRkIGZvcmVpZ24ga2V5IGNvbnN0cmFpbnRzXG4gICAgICBhd2FpdCBzcWxgXG4gICAgICAgIEFMVEVSIFRBQkxFIFwiaW1hZ2VzXCIgQUREIENPTlNUUkFJTlQgXCJpbWFnZXNfdXNlcl9pZF91c2Vyc19pZF9ma1wiXG4gICAgICAgIEZPUkVJR04gS0VZIChcInVzZXJfaWRcIikgUkVGRVJFTkNFUyBcInB1YmxpY1wiLlwidXNlcnNcIihcImlkXCIpIE9OIERFTEVURSBubyBhY3Rpb24gT04gVVBEQVRFIG5vIGFjdGlvblxuICAgICAgYDtcblxuICAgICAgYXdhaXQgc3FsYFxuICAgICAgICBBTFRFUiBUQUJMRSBcInNlc3Npb25zXCIgQUREIENPTlNUUkFJTlQgXCJzZXNzaW9uc191c2VyX2lkX3VzZXJzX2lkX2ZrXCJcbiAgICAgICAgRk9SRUlHTiBLRVkgKFwidXNlcl9pZFwiKSBSRUZFUkVOQ0VTIFwicHVibGljXCIuXCJ1c2Vyc1wiKFwiaWRcIikgT04gREVMRVRFIGNhc2NhZGUgT04gVVBEQVRFIG5vIGFjdGlvblxuICAgICAgYDtcblxuICAgICAgcmVzLmpzb24oe1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBcIkRhdGFiYXNlIG1pZ3JhdGlvbiBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIsXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaWdyYXRpb24gZXJyb3I6XCIsIGVycm9yKTtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiTWlncmF0aW9uIGZhaWxlZFwiLFxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gUGxhY2Vob2xkZXIgcm91dGVzIGZvciBvdGhlciBlbmRwb2ludHNcbiAgYXBwLmdldChcIi9nYWxsZXJ5XCIsIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5qc29uKHsgaW1hZ2VzOiBbXSB9KTtcbiAgfSk7XG5cbiAgYXBwLnBvc3QoXCIvZ2VuZXJhdGVcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnN0YXR1cyg1MDEpLmpzb24oeyBlcnJvcjogXCJHZW5lcmF0ZSBlbmRwb2ludCBub3QgaW1wbGVtZW50ZWQgeWV0XCIgfSk7XG4gIH0pO1xuXG4gIGFwcC5wb3N0KFwiL3NhdmVcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnN0YXR1cyg1MDEpLmpzb24oeyBlcnJvcjogXCJTYXZlIGVuZHBvaW50IG5vdCBpbXBsZW1lbnRlZCB5ZXRcIiB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFwcDtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgbWlkZGxld2FyZU1vZGU6IGZhbHNlLFxuICAgIGZzOiB7XG4gICAgICBkZW55OiBbXCJhcGkvKipcIl0sIC8vIFByZXZlbnQgVml0ZSBmcm9tIHNlcnZpbmcgYXBpIGZvbGRlciBhcyBzdGF0aWMgZmlsZXNcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCJkaXN0XCIsXG4gIH0sXG4gIGRlZmluZToge1xuICAgIGdsb2JhbDogXCJnbG9iYWxUaGlzXCIsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHtcbiAgICAgIG5hbWU6IFwiZXhwcmVzcy1kZXYtc2VydmVyXCIsXG4gICAgICBjb25maWd1cmVTZXJ2ZXI6IGFzeW5jIChzZXJ2ZXIpID0+IHtcbiAgICAgICAgLy8gTG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICAgICAgY29uc3QgeyBjb25maWcgfSA9IGF3YWl0IGltcG9ydChcImRvdGVudlwiKTtcbiAgICAgICAgY29uZmlnKCk7XG5cbiAgICAgICAgLy8gSW1wb3J0IGFuZCBzZXR1cCBFeHByZXNzIHNlcnZlciBmb3IgQVBJIHJvdXRlc1xuICAgICAgICBjb25zdCB7IGNyZWF0ZVNlcnZlciB9ID0gYXdhaXQgaW1wb3J0KFwiLi9zZXJ2ZXIvaW5kZXguanNcIik7XG4gICAgICAgIGNvbnN0IGFwcCA9IGNyZWF0ZVNlcnZlcigpO1xuXG4gICAgICAgIC8vIFVzZSB0aGUgRXhwcmVzcyBhcHAgdG8gaGFuZGxlIC9hcGkgcm91dGVzXG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoXCIvYXBpXCIsIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIGFwcChyZXEsIHJlcywgbmV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vY2xpZW50XCIpLFxuICAgICAgXCJAc2hhcmVkXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zaGFyZWRcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBK007QUFBQSxFQUM3TTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE9BQ0s7QUFSUCxJQVdhLFlBY0EsZUFXQSxhQVdBO0FBL0NiO0FBQUE7QUFXTyxJQUFNLGFBQWEsUUFBUSxTQUFTO0FBQUEsTUFDekMsSUFBSSxLQUFLLElBQUksRUFBRSxXQUFXLEVBQUUsY0FBYztBQUFBLE1BQzFDLE9BQU8sS0FBSyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU87QUFBQSxNQUN0QyxNQUFNLEtBQUssTUFBTTtBQUFBLE1BQ2pCLFVBQVUsS0FBSyxXQUFXLEVBQUUsT0FBTztBQUFBLE1BQ25DLGdCQUFnQixLQUFLLGlCQUFpQjtBQUFBLE1BQ3RDLE1BQU0sUUFBUSxRQUFRLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLE1BQU07QUFBQTtBQUFBLE1BQ3BELGlCQUFpQixRQUFRLGtCQUFrQixFQUFFLFFBQVEsQ0FBQztBQUFBLE1BQ3RELFdBQVcsVUFBVSxZQUFZLEVBQUUsV0FBVztBQUFBLE1BQzlDLFdBQVcsVUFBVSxZQUFZLEVBQUUsV0FBVztBQUFBLE1BQzlDLGFBQWEsVUFBVSxlQUFlO0FBQUEsSUFDeEMsQ0FBQztBQUdNLElBQU0sZ0JBQWdC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QUFDO0FBQUEsRUFDekIsQ0FBQztBQUVELE1BQUksS0FBSyxhQUFhLENBQUMsS0FBSyxRQUFRO0FBQ2xDLFFBQUksT0FBTyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sd0NBQXdDLENBQUM7QUFBQSxFQUN6RSxDQUFDO0FBRUQsTUFBSSxLQUFLLFNBQVMsQ0FBQyxLQUFLLFFBQVE7QUFDOUIsUUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxvQ0FBb0MsQ0FBQztBQUFBLEVBQ3JFLENBQUM7QUFFRCxTQUFPO0FBQ1Q7QUEzT0E7QUFBQTtBQUlBO0FBQ0E7QUFDQSxJQUFBQztBQUtBO0FBQUE7QUFBQTs7O0FDWDZNLFNBQVMsb0JBQW9CO0FBQzFPLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixnQkFBZ0I7QUFBQSxJQUNoQixJQUFJO0FBQUEsTUFDRixNQUFNLENBQUMsUUFBUTtBQUFBO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixpQkFBaUIsT0FBTyxXQUFXO0FBRWpDLGNBQU0sRUFBRSxPQUFPLElBQUksTUFBTSxPQUFPLGtEQUFRO0FBQ3hDLGVBQU87QUFHUCxjQUFNLEVBQUUsY0FBQUMsY0FBYSxJQUFJLE1BQU07QUFDL0IsY0FBTSxNQUFNQSxjQUFhO0FBR3pCLGVBQU8sWUFBWSxJQUFJLFFBQVEsQ0FBQyxLQUFLLEtBQUssU0FBUztBQUNqRCxjQUFJLEtBQUssS0FBSyxJQUFJO0FBQUEsUUFDcEIsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsVUFBVTtBQUFBLE1BQ3ZDLFdBQVcsS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogWyJzcWwiLCAiZXEiLCAiaW5pdF9hdXRoIiwgIm5lb24iLCAic3FsIiwgImluaXRfYXV0aCIsICJjcmVhdGVTZXJ2ZXIiXQp9Cg==
