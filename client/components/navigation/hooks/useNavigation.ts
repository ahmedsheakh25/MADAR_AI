import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface NavigationAction {
  path: string;
  requiresAuth?: boolean;
}

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

      navigate(action.path);
    },
    [navigate],
  );

  const isCurrentPath = useCallback(
    (path: string) => {
      return location.pathname === path;
    },
    [location.pathname],
  );

  return {
    navigateToPath,
    isCurrentPath,
    currentPath: location.pathname,
  };
};
