import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage, Language } from "../../hooks/use-language";
import { extractLanguageFromPath } from "../../lib/routing";

interface LanguageRouteProps {
  children: React.ReactNode;
}

export function LanguageRoute({ children }: LanguageRouteProps) {
  const { lang } = useParams<{ lang: Language }>();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { language: pathLang, pathWithoutLang } = extractLanguageFromPath(
      location.pathname,
    );

    // If no language in path, redirect to current language
    if (!pathLang) {
      const newPath = `/${language}${pathWithoutLang}`;
      navigate(newPath, { replace: true });
      return;
    }

    // If language in path differs from current language, update it
    if (pathLang !== language) {
      setLanguage(pathLang);
    }
  }, [location.pathname, language, setLanguage, navigate]);

  return <>{children}</>;
}
