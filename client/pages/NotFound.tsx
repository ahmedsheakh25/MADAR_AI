import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4">
        <Card className="glass gradient-border max-w-md mx-auto">
          <CardContent className="py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl font-bold text-primary">
                {t("pages.notFound.title")}
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {t("pages.notFound.message")}
            </h1>

            <Link to="/">
              <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                <Home className="w-4 h-4 mr-2" />
                {t("pages.notFound.returnHome")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
