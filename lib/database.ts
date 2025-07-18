import { eq, sql } from "drizzle-orm";
import { db } from "./db.js";
import { usersTable, imagesTable, stylesTable, sessionsTable } from "./schema.js";
import type { User, NewUser, Image, NewImage, Style, Session, NewSession } from "./schema.js";

export class DatabaseService {
  // User management
  static async createUser(userData: NewUser): Promise<User> {
    const [user] = await db.insert(usersTable).values(userData).returning();
    return user;
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user || null;
  }

  static async findUserByGoogleId(googleId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.googleId, googleId));
    return user || null;
  }

  static async createUserFromGoogle(googleUser: {
    email: string;
    name: string;
    googleId: string;
    profilePicture?: string;
  }): Promise<User> {
    const [user] = await db
      .insert(usersTable)
      .values({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.googleId,
        profilePicture: googleUser.profilePicture,
        generationCount: 0,
        lastLoginAt: new Date(),
      })
      .returning();
    return user;
  }

  static async updateLastLogin(userId: string): Promise<User> {
    const [user] = await db
      .update(usersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(usersTable.id, userId))
      .returning();
    return user;
  }

  static async getUserById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user || null;
  }

  static async updateUserGenerationCount(
    userId: string,
    increment: number = 1,
  ): Promise<User> {
    const [user] = await db
      .update(usersTable)
      .set({
        generationCount: sql`${usersTable.generationCount} + ${increment}`,
      })
      .where(eq(usersTable.id, userId))
      .returning();
    return user;
  }

  static async resetUserGenerationCount(userId: string): Promise<User> {
    const [user] = await db
      .update(usersTable)
      .set({
        generationCount: 0,
        resetDate: new Date(),
      })
      .where(eq(usersTable.id, userId))
      .returning();
    return user;
  }

  // Image management
  static async saveImage(imageData: NewImage): Promise<Image> {
    const [image] = await db.insert(imagesTable).values(imageData).returning();
    return image;
  }

  static async getUserImages(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Image[]> {
    return db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.userId, userId))
      .orderBy(sql`${imagesTable.createdAt} DESC`)
      .limit(limit)
      .offset(offset);
  }

  static async deleteImage(imageId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(imagesTable)
      .where(
        sql`${imagesTable.id} = ${imageId} AND ${imagesTable.userId} = ${userId}`,
      );
    return result.rowCount > 0;
  }

  // Style management
  static async getAllStyles(): Promise<Style[]> {
    return db.select().from(stylesTable);
  }

  static async getStyleById(id: string): Promise<Style | null> {
    const [style] = await db
      .select()
      .from(stylesTable)
      .where(eq(stylesTable.id, id));
    return style || null;
  }

  static async getStyleByName(name: string): Promise<Style | null> {
    const [style] = await db
      .select()
      .from(stylesTable)
      .where(eq(stylesTable.name, name));
    return style || null;
  }

  static async createStyle(styleData: Partial<Style>): Promise<Style> {
    const [style] = await db.insert(stylesTable).values(styleData).returning();
    return style;
  }

  static async updateStyle(
    id: string,
    updates: Partial<Style>,
  ): Promise<Style> {
    const [style] = await db
      .update(stylesTable)
      .set(updates)
      .where(eq(stylesTable.id, id))
      .returning();
    return style;
  }

  static async deleteStyle(id: string): Promise<boolean> {
    const result = await db.delete(stylesTable).where(eq(stylesTable.id, id));
    return result.rowCount > 0;
  }

  // Admin utilities
  static async getAllUsers(
    limit: number = 50,
    offset: number = 0,
  ): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .orderBy(sql`${usersTable.resetDate} DESC`)
      .limit(limit)
      .offset(offset);
  }

  static async getUserCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable);
    return result.count;
  }

  // Session management
  static async createSession(sessionData: NewSession): Promise<Session> {
    const [session] = await db
      .insert(sessionsTable)
      .values(sessionData)
      .returning();
    return session;
  }

  static async findSessionByToken(token: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.token, token));
    return session || null;
  }

  static async deleteSession(token: string): Promise<boolean> {
    const result = await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.token, token));
    return result.rowCount > 0;
  }

  static async deleteExpiredSessions(): Promise<number> {
    const result = await db
      .delete(sessionsTable)
      .where(sql`${sessionsTable.expiresAt} < ${new Date()}`);
    return result.rowCount;
  }

  static async deleteUserSessions(userId: string): Promise<number> {
    const result = await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.userId, userId));
    return result.rowCount;
  }
} 