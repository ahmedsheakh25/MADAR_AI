import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  MoreHorizontal,
  RefreshCw,
  UserCheck,
  Calendar,
  Mail,
  Hash,
  Shield,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/design-system";
import { useNavigation } from "../components/navigation/hooks/useNavigation";
import { useTranslation } from "../hooks/use-translation";
import { useAuth } from "../hooks/use-auth";
import type { AdminUser } from "@shared/api";

// Mock admin data - this would come from API in production
const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "user-1",
    email: "john.doe@example.com",
    name: "John Doe",
    generationCount: 25,
    resetDate: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    generationCount: 8,
    resetDate: "2024-01-10T14:20:00Z",
  },
  {
    id: "user-3",
    email: "ahmed.hassan@example.com",
    name: "Ahmed Hassan",
    generationCount: 30,
    resetDate: "2024-01-01T09:00:00Z",
  },
  {
    id: "user-4",
    email: "sarah.wilson@example.com",
    name: "Sarah Wilson",
    generationCount: 15,
    resetDate: "2024-01-20T16:45:00Z",
  },
  {
    id: "user-5",
    email: "dev@example.com",
    name: "Dev User",
    generationCount: 0,
    resetDate: new Date().toISOString(),
  },
];

export default function AdminUsers() {
  const { t } = useTranslation();
  const { navigateToPath } = useNavigation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check admin access
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      navigateToPath({ path: "/generator" });
      return;
    }
  }, [authLoading, isAuthenticated, user, navigateToPath]);

  // Fetch users data
  useEffect(() => {
    if (!user?.isAdmin || authLoading) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("madar_auth_token");
        if (!token) throw new Error("No auth token");

        const response = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.users || []);
        } else {
          throw new Error(data.error || "Failed to fetch users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user?.isAdmin, authLoading]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <h2 className="text-xl font-semibold text-foreground">
            Checking permissions...
          </h2>
        </div>
      </div>
    );
  }

  // Don't render if not admin (will redirect)
  if (!user?.isAdmin) {
    return null;
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleResetUserQuota = async (userId: string) => {
    setIsLoading(true);
    try {
      // This would be an API call in production
      // await resetUserQuota(userId);

      // Mock implementation
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                generationCount: 0,
                resetDate: new Date().toISOString(),
              }
            : user,
        ),
      );

      alert("User quota reset successfully!");
    } catch (error) {
      console.error("Failed to reset user quota:", error);
      alert("Failed to reset user quota. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshUsers = async () => {
    setIsLoading(true);
    try {
      // This would be an API call in production
      // const result = await fetchAdminUsers();
      // setUsers(result.users);

      // Mock refresh
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to refresh users:", error);
      setIsLoading(false);
    }
  };

  const getRemainingGenerations = (generationCount: number) => {
    return Math.max(0, 30 - generationCount);
  };

  const getQuotaStatus = (generationCount: number) => {
    const remaining = getRemainingGenerations(generationCount);
    if (remaining === 0) return { status: "exhausted", color: "text-red-500" };
    if (remaining <= 5) return { status: "low", color: "text-yellow-500" };
    return { status: "good", color: "text-green-500" };
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigateToPath({ path: "/" })}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              User Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage user quotas and generation limits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefreshUsers}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg border border-border min-w-[300px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground border-none outline-none flex-1"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      User
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Generations Used
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Remaining
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Last Reset
                    </div>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user, index) => {
                  const quotaStatus = getQuotaStatus(user.generationCount);
                  const remaining = getRemainingGenerations(
                    user.generationCount,
                  );

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="font-medium text-foreground">
                            {user.name || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-foreground">
                            {user.generationCount}/30
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                user.generationCount > 25
                                  ? "bg-red-500"
                                  : user.generationCount > 20
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${(user.generationCount / 30) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-sm font-medium ${quotaStatus.color}`}
                        >
                          {remaining}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(user.resetDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleResetUserQuota(user.id)}
                              disabled={isLoading}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Reset Quota
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSelectedUser(user)}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No users found matching your search."
                  : "No users found."}
              </p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">
              {users.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">
              {users.filter((u) => u.generationCount >= 30).length}
            </div>
            <div className="text-sm text-muted-foreground">Quota Exhausted</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">
              {
                users.filter(
                  (u) => u.generationCount > 25 && u.generationCount < 30,
                ).length
              }
            </div>
            <div className="text-sm text-muted-foreground">Low Quota</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-foreground">
              {users.reduce((sum, u) => sum + u.generationCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Generations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
