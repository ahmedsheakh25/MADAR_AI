import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Language } from "../hooks/use-language";

export interface NavigateToPathProps {
  path: string;
  language?: Language;
  replace?: boolean;
  requiresAuth?: boolean;
}

export function getLocalizedPath(path: string, language: Language): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // Handle root path
  if (!cleanPath || cleanPath === "") {
    return `/${language}`;
  }

  // Handle paths that already have language prefix
  if (cleanPath.startsWith("en/") || cleanPath.startsWith("ar/")) {
    const pathWithoutLang = cleanPath.substring(3);
    return `/${language}/${pathWithoutLang}`;
  }

  return `/${language}/${cleanPath}`;
}

export function extractLanguageFromPath(pathname: string): {
  language: Language | null;
  pathWithoutLang: string;
} {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { language: null, pathWithoutLang: "/" };
  }

  const firstSegment = segments[0];

  if (firstSegment === "en" || firstSegment === "ar") {
    const pathWithoutLang = "/" + segments.slice(1).join("/");
    return {
      language: firstSegment,
      pathWithoutLang: pathWithoutLang === "/" ? "/" : pathWithoutLang,
    };
  }

  return { language: null, pathWithoutLang: pathname };
}

export function useLanguageAwareNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToPath = ({
    path,
    language,
    replace = false,
    requiresAuth = false,
  }: NavigateToPathProps) => {
    // If language is not provided, extract from current URL or use default
    let targetLanguage = language;

    if (!targetLanguage) {
      const { language: currentLang } = extractLanguageFromPath(
        location.pathname,
      );
      targetLanguage = currentLang || "en";
    }

    // TODO: Add authentication check if requiresAuth is true
    if (requiresAuth) {
      // Add auth logic here when needed
    }

    const localizedPath = getLocalizedPath(path, targetLanguage);
    navigate(localizedPath, { replace });
  };

  const getCurrentLanguageFromPath = (): Language => {
    const { language } = extractLanguageFromPath(location.pathname);
    return language || "en";
  };

  const isCurrentPath = (path: string): boolean => {
    const { pathWithoutLang } = extractLanguageFromPath(location.pathname);
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return (
      pathWithoutLang === normalizedPath ||
      (pathWithoutLang === "/" && normalizedPath === "/")
    );
  };

  return {
    navigateToPath,
    getCurrentLanguageFromPath,
    isCurrentPath,
    currentPathWithoutLang: extractLanguageFromPath(location.pathname)
      .pathWithoutLang,
  };
}
