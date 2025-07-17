import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";

export default function Login() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleGoogleLogin = () => {
    // Google OAuth logic would go here
    console.log("Google login");
  };

  return (
    <div className="min-h-screen flex" dir="ltr">
      {/* Left Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {language === "ar"
                    ? t("brand.nameArabic")
                    : t("brand.name").charAt(0)}
                </span>
              </div>
              <div className="text-start">
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {t("brand.name")}
                </h1>
                <p className="text-sm text-muted-foreground font-arabic">
                  {language === "ar" ? t("brand.name") : t("brand.nameArabic")}
                </p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {t("pages.login.title")}
            </h2>
            <p className="text-muted-foreground font-arabic">
              {t("pages.login.subtitle")}
            </p>
          </div>

          {/* Login Form */}
          <Card className="glass gradient-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold">
                {t("pages.login.signInCard")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("common.forms.emailAddress")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="ps-10 glass"
                      placeholder={t("common.forms.emailPlaceholder")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t("common.forms.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="ps-10 pe-10 glass"
                      placeholder={t("common.forms.passwordPlaceholder")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {t("common.buttons.forgotPassword")}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("common.buttons.signingIn")}
                    </div>
                  ) : (
                    t("common.buttons.signIn")
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("common.messages.orContinueWith")}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full glass border-border/50 hover:border-primary/50"
              >
                <svg
                  className="w-5 h-5 me-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t("common.buttons.loginWithGoogle")}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t("common.messages.dontHaveAccount")}{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {t("common.buttons.signUpFree")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />

        {/* Floating Elements */}
        <div className="absolute top-20 end-20 w-16 h-16 bg-gradient-primary rounded-full opacity-20 animate-float" />
        <div
          className="absolute bottom-32 end-32 w-8 h-8 bg-gradient-primary rounded-full opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 end-12 w-12 h-12 bg-gradient-primary rounded-full opacity-15 animate-float"
          style={{ animationDelay: "4s" }}
        />

        <div
          className="flex-1 flex flex-col justify-center p-12 relative z-10"
          dir="rtl"
        >
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-glow" />
              <span className="text-primary font-semibold">
                {t("brand.tagline")}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-arabic leading-tight">
              {t("pages.login.heroTitle")}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 font-arabic leading-relaxed">
              {t("pages.login.heroSubtitle")}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-lg">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <span className="font-arabic">
                  {t("pages.login.features.highQuality")}
                </span>
              </div>

              <div className="flex items-center gap-3 text-lg">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <span className="font-arabic">
                  {t("pages.login.features.transparentBackground")}
                </span>
              </div>

              <div className="flex items-center gap-3 text-lg">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <span className="font-arabic">
                  {t("pages.login.features.freeForDesigners")}
                </span>
              </div>
            </div>

            <div className="mt-8 p-4 glass rounded-xl border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-arabic">
                    {t("pages.login.activeUsers")}
                  </p>
                  <p className="text-2xl font-bold text-primary">+12,500</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
