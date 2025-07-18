import type { Request, Response } from "express";
import { DatabaseService } from "../../lib/database.js";
import { AuthService } from "../../lib/auth.js";
import {
  requireAdmin,
  createUnauthorizedResponse,
  createForbiddenResponse,
} from "../../lib/middleware.js";

// Get all users (admin only)
export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    // Create a Request object for auth middleware
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as HeadersInit,
    });

    // Require admin authentication
    const authResult = await requireAdmin(webRequest);
    if (!authResult.success || !authResult.user) {
      return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
        success: false,
        error: authResult.error || "Unauthorized",
      });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await DatabaseService.getAllUsers(limit, offset);
    const totalCount = await DatabaseService.getUserCount();

    // Don't return sensitive information
    const safeUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      generationCount: user.generationCount,
      resetDate: user.resetDate?.toISOString(),
      createdAt: user.createdAt?.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      isMasterAdmin: AuthService.isMasterAdmin(user.email),
    }));

    res.json({
      success: true,
      users: safeUsers,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

// Promote user to admin (master admin only)
export const handlePromoteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Create a Request object for auth middleware
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as HeadersInit,
    });

    // Require admin authentication
    const authResult = await requireAdmin(webRequest);
    if (!authResult.success || !authResult.user) {
      return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
        success: false,
        error: authResult.error || "Unauthorized",
      });
    }

    // Only master admin can promote users
    if (!AuthService.isMasterAdmin(authResult.user.email)) {
      return res.status(403).json({
        success: false,
        error: "Only master admin can promote users",
      });
    }

    const success = await AuthService.promoteToAdmin(userId, authResult.user);

    if (success) {
      res.json({
        success: true,
        message: "User promoted to admin successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to promote user",
      });
    }
  } catch (error) {
    console.error("Promote user error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to promote user",
    });
  }
};

// Demote user from admin (master admin only)
export const handleDemoteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Create a Request object for auth middleware
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as HeadersInit,
    });

    // Require admin authentication
    const authResult = await requireAdmin(webRequest);
    if (!authResult.success || !authResult.user) {
      return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
        success: false,
        error: authResult.error || "Unauthorized",
      });
    }

    // Only master admin can demote users
    if (!AuthService.isMasterAdmin(authResult.user.email)) {
      return res.status(403).json({
        success: false,
        error: "Only master admin can demote users",
      });
    }

    const success = await AuthService.demoteFromAdmin(userId, authResult.user);

    if (success) {
      res.json({
        success: true,
        message: "User demoted from admin successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to demote user",
      });
    }
  } catch (error) {
    console.error("Demote user error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to demote user",
    });
  }
};

// Reset user generation count (admin only)
export const handleResetUserGenerations = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    // Create a Request object for auth middleware
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as HeadersInit,
    });

    // Require admin authentication
    const authResult = await requireAdmin(webRequest);
    if (!authResult.success || !authResult.user) {
      return res.status(authResult.error?.includes("Admin") ? 403 : 401).json({
        success: false,
        error: authResult.error || "Unauthorized",
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
        resetDate: user.resetDate?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Reset user generations error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reset user generation count",
    });
  }
};
