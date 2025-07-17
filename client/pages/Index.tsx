import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Zap, Star, Play } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Text,
  Heading,
  Flex,
  Grid,
  Container,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Badge,
  Label,
  GradientText,
} from "@/components/design-system";
// Navigation imports removed - using dock navigation
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

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

// Button animation variants
const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 25px rgba(138, 43, 226, 0.3)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

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
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-background"
    >
      {/* Header removed - navigation moved to dock */}

      <Container size="xl" className="p-[90px]">
        <Grid cols={1} responsive={{ lg: 3 }} gap="8" animate stagger>
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            <Card animate hoverEffect className="glass gradient-border h-full">
              <CardContent className="p-6 h-full flex-1">
                <Flex direction="column" gap="6" className="h-fit flex-1">
                  {/* Upload Section */}
                  <div className="w-auto self-stretch">
                    <Heading
                      as="h3"
                      size="md"
                      className="mb-4 font-arabic"
                      animate
                    >
                      {t("pages.homepage.uploadSection.title")}
                    </Heading>
                    <motion.div
                      whileHover={{ borderColor: "hsl(264, 100%, 50%)" }}
                      className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-6 text-center flex flex-col"
                    >
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <AnimatePresence mode="wait">
                        {uploadedImage ? (
                          <motion.div
                            key="uploaded"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="space-y-4"
                          >
                            <img
                              src={uploadedImage}
                              alt="Uploaded"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Label
                              htmlFor="image-upload"
                              className="cursor-pointer"
                            >
                              <Button variant="secondary" size="sm">
                                {t("common.buttons.changeImage")}
                              </Button>
                            </Label>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4 flex flex-col h-fit flex-0"
                          >
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="flex-0"
                            >
                              <ImageIcon className="w-14 h-14 text-muted-foreground mx-auto" />
                            </motion.div>
                            <div className="flex flex-col">
                              <Text size="sm" className="mb-2 font-arabic">
                                {t("common.messages.clickToUpload")}
                              </Text>
                              <Text
                                size="xs"
                                className="text-muted-foreground font-arabic"
                              >
                                {t("common.messages.supportedFormats")}
                              </Text>
                            </div>
                            <Label
                              htmlFor="image-upload"
                              className="cursor-pointer w-full self-stretch"
                            >
                              <Button
                                size="sm"
                                variant="gradient"
                                animate
                                className="w-full self-stretch"
                              >
                                {t("common.buttons.chooseImage")}
                              </Button>
                            </Label>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Style Selection */}
                  <div className="w-auto self-stretch">
                    <Heading
                      as="h3"
                      size="md"
                      className="mb-4 font-arabic"
                      animate
                    >
                      {t("pages.homepage.styleSection.title")}
                    </Heading>
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
                  <div className="w-auto self-stretch">
                    <Heading
                      as="h3"
                      size="md"
                      className="mb-4 font-arabic"
                      animate
                    >
                      {t("pages.homepage.aspectRatioSection.title")}
                    </Heading>
                    <Flex gap="3">
                      {["1:1", "3:2", "2:3"].map((ratio) => (
                        <Button
                          key={ratio}
                          variant={
                            aspectRatio === ratio ? "default" : "secondary"
                          }
                          size="sm"
                          onClick={() => setAspectRatio(ratio)}
                          animate
                          className="w-auto flex-1 w-full"
                        >
                          {ratio}
                        </Button>
                      ))}
                    </Flex>
                  </div>

                  {/* Prompt */}
                  <div className="w-auto self-stretch">
                    <Heading
                      as="h3"
                      size="md"
                      className="mb-4 font-arabic"
                      animate
                    >
                      {t("pages.homepage.promptSection.title")}
                    </Heading>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="glass min-h-[120px] resize-none"
                      placeholder={t(
                        "pages.homepage.promptSection.placeholder",
                      )}
                    />
                    <Flex align="center" gap="2" className="mt-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="text-black text-xs">!</span>
                      </div>
                      <Text
                        size="xs"
                        className="text-muted-foreground font-arabic"
                      >
                        {t("common.messages.generationTakes")}
                      </Text>
                    </Flex>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!uploadedImage || isGenerating}
                    className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold py-3 text-base w-auto self-stretch"
                    size="lg"
                    animate
                  >
                    <AnimatePresence mode="wait">
                      {isGenerating ? (
                        <motion.div
                          key="generating"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span className="font-arabic">
                            {t("common.buttons.generating")}
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="generate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Zap className="w-5 h-5" />
                          <span className="font-arabic">
                            {t("common.buttons.generateImage")}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </Flex>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview & Examples */}
          <div className="lg:col-span-2">
            <Card animate hoverEffect className="glass gradient-border h-full">
              <CardContent className="p-6">
                <Flex direction="column" className="h-full">
                  {/* Hero Section */}
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    className="text-center py-12 flex-1"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <Play className="w-10 h-10 text-primary" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <GradientText gradient="primary">
                        <Heading as="h1" size="4xl" className="mb-4">
                          {t("pages.homepage.hero.title")}
                        </Heading>
                      </GradientText>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <Text
                        size="lg"
                        className="text-muted-foreground mb-6 max-w-2xl mx-auto font-arabic"
                      >
                        {t("pages.homepage.hero.subtitle")}
                      </Text>
                    </motion.div>

                    {/* Rating */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <Flex
                        align="center"
                        justify="center"
                        gap="2"
                        className="mb-8"
                      >
                        <Flex gap="1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                            >
                              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          ))}
                        </Flex>
                        <Text
                          size="sm"
                          className="text-muted-foreground font-arabic"
                        >
                          {t("pages.homepage.hero.ratingText")}
                        </Text>
                      </Flex>
                    </motion.div>
                  </Flex>

                  {/* Examples Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="mt-auto"
                  >
                    <Flex justify="between" align="center" className="mb-6">
                      <Heading as="h2" size="lg" className="font-arabic">
                        {t("pages.homepage.examplesSection.title")}
                      </Heading>
                      <Button variant="secondary" size="sm">
                        <span className="font-arabic">
                          {t("common.buttons.moreExamples")}
                        </span>
                        <span className="flip-for-rtl ms-1">←</span>
                      </Button>
                    </Flex>

                    <Grid cols={1} responsive={{ md: 2 }} gap="4">
                      {EXAMPLE_IMAGES.map((img, index) => (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 },
                          }}
                          className="group relative"
                        >
                          <div className="aspect-[3/2] relative overflow-hidden rounded-xl border border-border/50">
                            <div className="absolute inset-0 grid grid-cols-2">
                              <div className="relative">
                                <img
                                  src={img.src}
                                  alt="Original"
                                  className="w-full h-full object-cover"
                                />
                                <Badge
                                  variant="secondary"
                                  className="absolute top-2 start-2"
                                >
                                  {t(
                                    "pages.homepage.examplesSection.beforeLabel",
                                  )}
                                </Badge>
                              </div>
                              <div className="relative border-s-2 border-primary">
                                <img
                                  src={img.src}
                                  alt="Generated"
                                  className="w-full h-full object-cover"
                                />
                                <Badge
                                  variant="default"
                                  className="absolute top-2 end-2"
                                >
                                  {t(
                                    "pages.homepage.examplesSection.afterLabel",
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </Grid>

                    <Flex justify="center" className="mt-6">
                      <Button variant="gradient" animate>
                        <Upload className="w-5 h-5 me-2" />
                        <span className="font-arabic">
                          {t("common.buttons.uploadNow")}
                        </span>
                      </Button>
                    </Flex>
                  </motion.div>
                </Flex>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Container>
    </motion.div>
  );
}
