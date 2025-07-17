import { useCallback } from "react";
import { useLanguageAwareNavigation } from "../../../lib/routing";

export interface NavigationAction {
  path: string;
  requiresAuth?: boolean;
}

export const useNavigation = () => {
  const {
    navigateToPath: navigate,
    isCurrentPath,
    currentPathWithoutLang,
  } = useLanguageAwareNavigation();

  const navigateToPath = useCallback(
    (action: NavigationAction) => {
      // Add any navigation analytics or tracking here
      console.log(`Navigating to: ${action.path}`);

      // Handle authentication requirements
      if (action.requiresAuth) {
        // Check if user is authenticated
        // If not, redirect to login
        // For now, just navigate normally
      }

      navigate({ path: action.path, requiresAuth: action.requiresAuth });
    },
    [navigate],
  );

  return {
    navigateToPath,
    isCurrentPath,
    currentPath: currentPathWithoutLang,
  };
};
