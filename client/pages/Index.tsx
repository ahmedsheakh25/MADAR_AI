import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  Image as ImageIcon,
  Zap,
  Star,
  Download,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { VersionSwitcher } from "@/components/VersionSwitcher";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";

const STYLE_OPTIONS = [
  {
    value: "3d-pixel-isometric",
    labelKey: "pages.homepage.styleSection.styles.3dPixelIsometric",
  },
  {
    value: "minimal-icon",
    labelKey: "pages.homepage.styleSection.styles.minimalIcon",
  },
  {
    value: "toy-figurine",
    labelKey: "pages.homepage.styleSection.styles.toyFigurine",
  },
  {
    value: "glass-morph",
    labelKey: "pages.homepage.styleSection.styles.glassMorphism",
  },
  {
    value: "neon-glow",
    labelKey: "pages.homepage.styleSection.styles.neonGlow",
  },
];

const EXAMPLE_IMAGES = [
  { id: 1, src: "/placeholder.svg", alt: "Example 1" },
  { id: 2, src: "/placeholder.svg", alt: "Example 2" },
  { id: 3, src: "/placeholder.svg", alt: "Example 3" },
];

export default function Index() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedStyle, setSelectedStyle] = useState("3d-pixel-isometric");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [prompt, setPrompt] = useState(
    t("pages.homepage.promptSection.defaultPrompt"),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <VersionSwitcher />
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {language === "ar"
                      ? t("brand.nameArabic")
                      : t("brand.name").charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {t("brand.name")}
                  </h1>
                  <p className="text-xs text-muted-foreground font-arabic">
                    {language === "ar"
                      ? t("brand.name")
                      : t("brand.nameArabic")}
                  </p>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm text-foreground font-medium">
                {t("common.navigation.generator")}
              </span>
              <Link
                to="/gallery"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("common.navigation.gallery")}
              </Link>
              <LanguageSwitcher />
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t("common.buttons.signIn")}
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            <Card className="glass gradient-border h-fit">
              <CardContent className="p-6 space-y-6">
                {/* Upload Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 font-arabic">
                    {t("pages.homepage.uploadSection.title")}
                  </h3>
                  <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-6 text-center">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Button variant="secondary" size="sm" asChild>
                            <span>{t("common.buttons.changeImage")}</span>
                          </Button>
                        </Label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="w-14 h-14 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-sm text-foreground mb-2 font-arabic">
                            {t("common.messages.clickToUpload")}
                          </p>
                          <p className="text-xs text-muted-foreground font-arabic">
                            {t("common.messages.supportedFormats")}
                          </p>
                        </div>
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Button
                            size="sm"
                            className="bg-gradient-primary hover:bg-gradient-primary/90"
                          >
                            {t("common.buttons.chooseImage")}
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Style Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 font-arabic">
                    {t("pages.homepage.styleSection.title")}
                  </h3>
                  <Select
                    value={selectedStyle}
                    onValueChange={setSelectedStyle}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLE_OPTIONS.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {t(style.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 font-arabic">
                    {t("pages.homepage.aspectRatioSection.title")}
                  </h3>
                  <RadioGroup
                    value={aspectRatio}
                    onValueChange={setAspectRatio}
                    className="flex gap-3"
                  >
                    {["1:1", "3:2", "2:3"].map((ratio) => (
                      <div key={ratio} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={ratio}
                          id={ratio}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label
                          htmlFor={ratio}
                          className="text-sm font-medium cursor-pointer px-3 py-2 rounded-lg glass"
                        >
                          {ratio}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Prompt */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 font-arabic">
                    {t("pages.homepage.promptSection.title")}
                  </h3>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="glass min-h-[120px] resize-none"
                    placeholder={t("pages.homepage.promptSection.placeholder")}
                  />
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-black text-xs">!</span>
                    </div>
                    <span className="font-arabic">
                      {t("common.messages.generationTakes")}
                    </span>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!uploadedImage || isGenerating}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold py-3 text-base"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="font-arabic">
                        {t("common.buttons.generating")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span className="font-arabic">
                        {t("common.buttons.generateImage")}
                      </span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview & Examples */}
          <div className="lg:col-span-2">
            <Card className="glass gradient-border h-full">
              <CardContent className="p-6">
                <div className="h-full flex flex-col">
                  {/* Hero Section */}
                  <div className="text-center py-12 flex-1 flex flex-col justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                      <Play className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                      {t("pages.homepage.hero.title")}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto font-arabic">
                      {t("pages.homepage.hero.subtitle")}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground font-arabic">
                        {t("pages.homepage.hero.ratingText")}
                      </p>
                    </div>
                  </div>

                  {/* Examples Section */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold font-arabic">
                        {t("pages.homepage.examplesSection.title")}
                      </h2>
                      <Button variant="outline" size="sm">
                        <span className="font-arabic">
                          {t("common.buttons.moreExamples")}
                        </span>
                        <span className="flip-for-rtl ms-1">←</span>
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {EXAMPLE_IMAGES.map((img) => (
                        <div key={img.id} className="group relative">
                          <div className="aspect-[3/2] relative overflow-hidden rounded-xl border border-border/50">
                            {/* Before/After Split View */}
                            <div className="absolute inset-0 grid grid-cols-2">
                              <div className="relative">
                                <img
                                  src={img.src}
                                  alt="Original"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 start-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {t(
                                    "pages.homepage.examplesSection.beforeLabel",
                                  )}
                                </div>
                              </div>
                              <div className="relative border-s-2 border-primary">
                                <img
                                  src={img.src}
                                  alt="Generated"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 end-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                  {t(
                                    "pages.homepage.examplesSection.afterLabel",
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                        <Upload className="w-5 h-5 me-2" />
                        <span className="font-arabic">
                          {t("common.buttons.uploadNow")}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
