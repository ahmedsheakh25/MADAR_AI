import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { APIManager } from "../lib/api-manager";
import { AuthManager } from "../lib/auth-manager";
import { motion } from "framer-motion";
import { useNavigation } from "../components/navigation/hooks/useNavigation";
import { useTranslation } from "../hooks/use-translation";

export default function AuthCallback() {
  const { t } = useTranslation();
  const { navigateToPath } = useNavigation();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(`OAuth error: ${error}`);
          setTimeout(() => {
            navigateToPath({ path: "/login" });
          }, 3000);
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received");
          setTimeout(() => {
            navigateToPath({ path: "/login" });
          }, 3000);
          return;
        }

        // Call the callback API to exchange code for token
        const response = await fetch(`/api/auth/callback?code=${code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success && data.token) {
          // Store the auth token
          AuthManager.setToken(data.token);

          // Store user data in cache
          if (data.user) {
            localStorage.setItem("user-cache", JSON.stringify(data.user));
          }

          setStatus("success");
          setMessage(data.isNewUser ? "Welcome to MADAR AI!" : "Welcome back!");

          // Redirect to generator after successful auth
          setTimeout(() => {
            navigateToPath({ path: "/generator" });
          }, 2000);
        } else {
          throw new Error(data.error || "Authentication failed");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Authentication failed",
        );
        setTimeout(() => {
          navigateToPath({ path: "/login" });
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [navigateToPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <motion.div
              className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <h2 className="text-xl font-semibold text-foreground">
              {t("auth.callback.authenticating")}
            </h2>
            <p className="text-muted-foreground">
              {t("auth.callback.pleaseWait")}
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold text-foreground">
              {t("auth.callback.success")}
            </h2>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">
              {t("auth.callback.redirecting")}
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold text-foreground">
              {t("auth.callback.error")}
            </h2>
            <p className="text-red-600">{message}</p>
            <p className="text-sm text-muted-foreground">
              {t("auth.callback.redirectingToLogin")}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
