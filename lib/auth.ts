import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { DatabaseService } from "./database.js";
import { db } from "./db.js";
import { usersTable } from "./schema.js";
import type { User } from "./schema.js";

// JWT secret key - should be set in environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
);

const JWT_ISSUER = "madar-ai";
const JWT_AUDIENCE = "madar-ai-users";

export interface AuthToken {
  userId: string;
  email: string;
  name: string;
  exp: number;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export class AuthService {
  // Generate JWT token for authenticated user
  static async generateToken(user: User): Promise<string> {
    const jwt = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name || "",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime("7d") // Token expires in 7 days
      .sign(JWT_SECRET);

    return jwt;
  }

  // Verify JWT token and return payload
  static async verifyToken(token: string): Promise<AuthToken | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });

      return payload as unknown as AuthToken;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return null;
    }
  }

  // Extract user from request Authorization header
  static async getUserFromRequest(req: Request): Promise<User | null> {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const payload = await this.verifyToken(token);

      if (!payload) {
        return null;
      }

      // Get fresh user data from database
      const user = await DatabaseService.getUserById(payload.userId);
      return user;
    } catch (error) {
      console.error("Error extracting user from request:", error);
      return null;
    }
  }

  // Google OAuth: Exchange authorization code for user info
  static async exchangeGoogleCode(
    code: string,
  ): Promise<GoogleUserInfo | null> {
    try {
      console.log("Starting Google OAuth code exchange...");
      console.log("Code received:", code ? "✅ Present" : "❌ Missing");
      console.log("Environment variables:", {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
        clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...",
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
      });

      // Determine the correct redirect URI based on environment
      let redirectUri = process.env.GOOGLE_REDIRECT_URI || "";

      // Server-side redirect URI determination
      if (!redirectUri || redirectUri.includes("localhost")) {
        if (process.env.FLY_APP_NAME || process.env.NODE_ENV === "production") {
          redirectUri =
            "https://fd74908a35154ad5afc7c401121ae97f-95c6c5cfd1dc4d0696d3cffd0.fly.dev/api/auth/callback";
        } else {
          redirectUri = "http://localhost:8080/api/auth/callback";
        }
      }

      console.log("Using redirect URI:", redirectUri);

      // Exchange code for access token
      const tokenParams = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });

      console.log("Making token exchange request to Google...");
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenParams,
      });

      console.log("Token response status:", tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText,
        });
        throw new Error(
          `Failed to exchange code for token: ${tokenResponse.status} ${errorText}`,
        );
      }

      const tokenData = await tokenResponse.json();
      console.log(
        "Token exchange successful, access token received:",
        !!tokenData.access_token,
      );

      if (!tokenData.access_token) {
        console.error("No access token in response:", tokenData);
        throw new Error("No access token received from Google");
      }

      const accessToken = tokenData.access_token;

      // Get user info from Google
      console.log("Fetching user info from Google...");
      const userResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
      );

      console.log("User info response status:", userResponse.status);

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error("User info fetch failed:", {
          status: userResponse.status,
          statusText: userResponse.statusText,
          error: errorText,
        });
        throw new Error(
          `Failed to get user info from Google: ${userResponse.status} ${errorText}`,
        );
      }

      const userData: GoogleUserInfo = await userResponse.json();
      console.log("User info received:", {
        hasId: !!userData.id,
        hasEmail: !!userData.email,
        hasName: !!userData.name,
        email: userData.email,
      });

      return userData;
    } catch (error) {
      console.error("Google OAuth error:", error);
      return null;
    }
  }

  // Google OAuth: Get or create user from Google profile
  static async authenticateWithGoogle(
    googleUser: GoogleUserInfo,
  ): Promise<{ user: User; token: string; isNewUser: boolean }> {
    // Check if user already exists by Google ID
    let user = await DatabaseService.findUserByGoogleId(googleUser.id);
    let isNewUser = false;

    if (!user) {
      // Check if user exists by email
      user = await DatabaseService.findUserByEmail(googleUser.email);

      if (user) {
        // Update existing user with Google ID
        const [updatedUser] = await db
          .update(usersTable)
          .set({
            googleId: googleUser.id,
            profilePicture: googleUser.picture,
            lastLoginAt: new Date(),
          })
          .where(eq(usersTable.id, user.id))
          .returning();
        user = updatedUser;
      } else {
        // Create new user
        const userData = {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          profilePicture: googleUser.picture,
          // Auto-assign admin role if this is the master admin email
          role: this.isMasterAdmin(googleUser.email) ? "admin" : "user",
        };
        user = await DatabaseService.createUserFromGoogle(userData);
        isNewUser = true;
      }
    } else {
      // Update last login for existing user
      user = await DatabaseService.updateLastLogin(user.id);
    }

    // Generate JWT token
    const token = await this.generateToken(user);

    return { user, token, isNewUser };
  }

  // Generate Google OAuth URL
  static getGoogleAuthUrl(): string {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    // Get and validate client ID
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("GOOGLE_CLIENT_ID environment variable is not set");
      throw new Error("Google OAuth configuration error: Missing client ID");
    }

    // Determine the correct redirect URI based on environment
    let redirectUri = process.env.GOOGLE_REDIRECT_URI || "";

    // If no explicit redirect URI is set, auto-detect based on environment
    if (!redirectUri || redirectUri.includes("localhost")) {
      // Check if we're in production
      if (process.env.FLY_APP_NAME || process.env.NODE_ENV === "production") {
        redirectUri = "https://www.madar.ofspace.studio/api/auth/callback";
      } else {
        redirectUri = "http://localhost:8080/api/auth/callback";
      }
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    const authUrl = `${baseUrl}?${params.toString()}`;
    console.log(
      "Generated OAuth URL with client_id:",
      clientId.substring(0, 10) + "...",
    );

    return authUrl;
  }

  // Check if user is master admin
  static isMasterAdmin(email: string): boolean {
    const masterAdminEmail = "ahmed.sheakh25@gmail.com";
    return email.toLowerCase() === masterAdminEmail.toLowerCase();
  }

  // Check if user has admin role
  static isAdmin(user: User): boolean {
    return user.role === "admin" || this.isMasterAdmin(user.email);
  }

  // Promote user to admin (only master admin can do this)
  static async promoteToAdmin(
    userId: string,
    promotingUser: User,
  ): Promise<boolean> {
    if (!this.isMasterAdmin(promotingUser.email)) {
      throw new Error("Only master admin can promote users to admin");
    }

    try {
      await db
        .update(usersTable)
        .set({ role: "admin" })
        .where(eq(usersTable.id, userId));
      return true;
    } catch (error) {
      console.error("Failed to promote user to admin:", error);
      return false;
    }
  }

  // Demote admin user (only master admin can do this)
  static async demoteFromAdmin(
    userId: string,
    demotingUser: User,
  ): Promise<boolean> {
    if (!this.isMasterAdmin(demotingUser.email)) {
      throw new Error("Only master admin can demote admin users");
    }

    // Cannot demote master admin
    const targetUser = await DatabaseService.getUserById(userId);
    if (targetUser && this.isMasterAdmin(targetUser.email)) {
      throw new Error("Cannot demote master admin");
    }

    try {
      await db
        .update(usersTable)
        .set({ role: "user" })
        .where(eq(usersTable.id, userId));
      return true;
    } catch (error) {
      console.error("Failed to demote user from admin:", error);
      return false;
    }
  }
}
