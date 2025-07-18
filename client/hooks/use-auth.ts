import { useDevAuth } from "./use-dev-auth";

export function useAuth() {
  const {
    user: devUser,
    signIn: devSignIn,
    signOut: devSignOut,
    isDevMode,
  } = useDevAuth();

  // For now, always use dev auth until Stack Auth credentials are properly configured
  return {
    user: devUser,
    signIn: devSignIn,
    signOut: devSignOut,
    isDevMode: true,
  };
}
