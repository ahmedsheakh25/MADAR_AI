import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/use-auth";

interface DevStatusData {
  success: boolean;
  devMode: boolean;
  environment: string;
  devModeAuth: boolean;
  hasGoogleCredentials: {
    clientId: boolean;
    clientSecret: boolean;
    redirectUri: boolean;
  };
  message: string;
  error?: string;
}

export default function DevStatus() {
  const [devStatus, setDevStatus] = useState<DevStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const { devMode, devModeMessage, signIn, user, isAuthenticated } = useAuth();

  useEffect(() => {
    checkDevStatus();
  }, []);

  const checkDevStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/dev-status");
      const data = await response.json();
      setDevStatus(data);
    } catch (error) {
      console.error("Failed to fetch dev status:", error);
      setDevStatus({
        success: false,
        devMode: false,
        environment: "unknown",
        devModeAuth: false,
        hasGoogleCredentials: {
          clientId: false,
          clientSecret: false,
          redirectUri: false,
        },
        message: "Failed to fetch status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Loading dev status...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Google Auth Development Status</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {devStatus?.devMode ? "🔧" : "🚀"} Authentication Mode
          </CardTitle>
          <CardDescription>
            Current authentication configuration status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Environment Info</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  Environment: <code>{devStatus?.environment}</code>
                </li>
                <li>
                  Dev Mode:{" "}
                  <span
                    className={
                      devStatus?.devMode ? "text-green-600" : "text-red-600"
                    }
                  >
                    {devStatus?.devMode ? "✅ Active" : "❌ Inactive"}
                  </span>
                </li>
                <li>
                  Dev Auth Flag:{" "}
                  <span
                    className={
                      devStatus?.devModeAuth ? "text-green-600" : "text-red-600"
                    }
                  >
                    {devStatus?.devModeAuth ? "✅ Enabled" : "❌ Disabled"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Google Credentials</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  Client ID:{" "}
                  <span
                    className={
                      devStatus?.hasGoogleCredentials.clientId
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {devStatus?.hasGoogleCredentials.clientId ? "✅" : "❌"}
                  </span>
                </li>
                <li>
                  Client Secret:{" "}
                  <span
                    className={
                      devStatus?.hasGoogleCredentials.clientSecret
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {devStatus?.hasGoogleCredentials.clientSecret ? "✅" : "❌"}
                  </span>
                </li>
                <li>
                  Redirect URI:{" "}
                  <span
                    className={
                      devStatus?.hasGoogleCredentials.redirectUri
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {devStatus?.hasGoogleCredentials.redirectUri ? "✅" : "❌"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Status Message:</p>
            <p className="text-sm">{devStatus?.message}</p>
          </div>

          {devStatus?.error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="font-medium text-destructive">Error:</p>
              <p className="text-sm text-destructive">{devStatus.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Testing</CardTitle>
          <CardDescription>
            Test the authentication flow in{" "}
            {devStatus?.devMode ? "development" : "production"} mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <p className="text-green-600">✅ Currently authenticated</p>
              <div className="text-sm space-y-1">
                <p>User: {user.name || "Unknown"}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role || "user"}</p>
                <p>Generations: {user.generationCount}/30</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-orange-600">⚠️ Not authenticated</p>
              <Button onClick={signIn} className="w-full">
                Test Authentication Flow
              </Button>
            </div>
          )}

          {devModeMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{devModeMessage}</p>
            </div>
          )}

          <Button onClick={checkDevStatus} variant="outline" className="w-full">
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
