import { useState, useEffect } from "react";

// Development-only authentication state for testing
// This should be replaced with actual Stack Auth once credentials are configured
export interface DevUser {
  id: string;
  displayName: string;
  primaryEmail: string;
  signOut: () => void;
}

const DEV_USER: DevUser = {
  id: "dev-user-1",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  signOut: () => {
    localStorage.removeItem("dev-auth-user");
    window.location.reload();
  },
};

export function useDevAuth() {
  const [user, setUser] = useState<DevUser | null>(null);

  useEffect(() => {
    // Check if we're in development mode and Stack Auth is not properly configured
    const isDev = import.meta.env.DEV;
    const hasValidStackAuth =
      import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY &&
      !import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY.includes(
        "placeholder",
      );

    if (isDev && !hasValidStackAuth) {
      // Use localStorage to persist dev auth state
      const storedUser = localStorage.getItem("dev-auth-user");
      if (storedUser) {
        setUser(DEV_USER);
      }
    }
  }, []);

  const signIn = () => {
    localStorage.setItem("dev-auth-user", "true");
    setUser(DEV_USER);
  };

  const signOut = () => {
    localStorage.removeItem("dev-auth-user");
    setUser(null);
  };

  return {
    user,
    signIn,
    signOut,
    isDevMode:
      import.meta.env.DEV &&
      (!import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY ||
        import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY.includes(
          "placeholder",
        )),
  };
}
