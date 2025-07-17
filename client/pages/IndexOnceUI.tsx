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
  Input,
  Badge,
  Avatar,
  Label,
  GradientText,
} from "@/components/design-system";
import { LanguageSwitcherOnceUI as LanguageSwitcher } from "@/components/LanguageSwitcherOnceUI";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VersionSwitcher } from "@/components/VersionSwitcher";

const STYLE_OPTIONS = [
  {
    value: "3d-pixel-isometric",
    label: "3D Pixel Isometric",
    nameAr: "أيزومترك بكسل ثلاثي الأبعاد",
  },
  { value: "minimal-icon", label: "Minimal Icon", nameAr: "أيقونة بسيطة" },
  { value: "toy-figurine", label: "Toy Figurine", nameAr: "دمية لعبة" },
  { value: "glass-morph", label: "Glass Morphism", nameAr: "تأثير زجاجي" },
  { value: "neon-glow", label: "Neon Glow", nameAr: "توهج نيون" },
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

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
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

export default function IndexOnceUI() {
  const [selectedStyle, setSelectedStyle] = useState("3d-pixel-isometric");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [prompt, setPrompt] = useState(
    "Transform the uploaded image into a collectible toy figure that could be included as a gift with a McDonald's burger meal. Stylize the character as a small, plastic figurine placed on a simple display base. Include a realistic McDonald's burger and its branded packaging in the background to give the impression of a Happy Meal toy promotion. Use soft lighting and a clean background, keeping the colors vibrant and playful.",
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
      <VersionSwitcher />
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50"
      >
                <Flex
          className="container mx-auto px-4 py-4"
          justify="between"
          align="center"
        >
                    <Flex align="center" gap="4">
                        <Flex align="center" gap="2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center"
              >
                <Text size="sm" weight="bold" className="text-white">
                  م
                </Text>
              </motion.div>
              <div>
                                <GradientText gradient="primary">
                  <Heading as="h1" size="lg">
                    Madar
                  </Heading>
                </GradientText>
                <Text size="xs" className="text-muted-foreground font-arabic">
                  مدار
                </Text>
              </div>
            </Flex>
          </Flex>

                    <Flex as="nav" className="hidden md:flex" align="center" gap="6">
            <Text size="sm" weight="medium" className="text-foreground">
              المولد
            </Text>
            <Link
              to="/gallery"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              معرض أعمالي
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/login">
              <Button variant="secondary" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
          </Flex>
        </Flex>
      </motion.header>

            <Container size="xl" className="py-8">
        <Grid
          className="max-w-7xl mx-auto"
          cols={1}
          responsive={{ lg: 3 }}
          gap="8"
          animate
          stagger
        >
          {/* Left Sidebar - Controls */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="lg:col-span-1"
          >
            <Card className="glass gradient-border h-fit p-6">
              <Flex direction="column" gap="6">
                {/* Upload Section */}
                <div>
                  <Heading as="h3" size="md" className="mb-4 font-arabic">
                    رفع الصورة
                  </Heading>
                  <motion.div
                    whileHover={{ borderColor: "hsl(264, 100%, 50%)" }}
                    className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-6 text-center"
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
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer"
                          >
                            <Button variant="secondary" size="sm">
                              تغيير الصورة
                            </Button>
                          </label>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <ImageIcon className="w-14 h-14 text-muted-foreground mx-auto" />
                          </motion.div>
                          <div>
                            <Text size="sm" className="mb-2 font-arabic">
                              اضغط لرفع الصورة أو اسحبها هنا
                            </Text>
                            <Text
                              size="xs"
                              className="text-muted-foreground font-arabic"
                            >
                              يدعم PNG، JPG، JPEG
                            </Text>
                          </div>
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer"
                          >
                            <motion.div
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                size="sm"
                                className="bg-gradient-primary hover:bg-gradient-primary/90"
                              >
                                اختيار صورة
                              </Button>
                            </motion.div>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Style Selection */}
                <div>
                  <Heading as="h3" size="md" className="mb-4 font-arabic">
                    نمط التصميم
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
                          <div className="flex flex-col">
                            <span>{style.label}</span>
                            <span className="text-xs text-muted-foreground font-arabic">
                              {style.nameAr}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <Heading as="h3" size="md" className="mb-4 font-arabic">
                    نس��ة العرض للارتفاع
                  </Heading>
                                    <Flex gap="3">
                    {["1:1", "3:2", "2:3"].map((ratio) => (
                      <motion.div
                        key={ratio}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={
                            aspectRatio === ratio ? "primary" : "secondary"
                          }
                          size="sm"
                          onClick={() => setAspectRatio(ratio)}
                        >
                          {ratio}
                        </Button>
                      </motion.div>
                    ))}
                  </Flex>
                </div>

                {/* Prompt */}
                <div>
                  <Heading as="h3" size="md" className="mb-4 font-arabic">
                    وصف التحويل
                  </Heading>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="glass min-h-[120px] resize-none"
                    placeholder="صف كيف تريد ��حويل صورتك..."
                  />
                  <Flex alignItems="center" gap="2" className="mt-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-black text-xs">!</span>
                    </div>
                    <Text
                      size="xs"
                      className="text-muted-foreground font-arabic"
                    >
                      يستغرق التوليد 3-5 دقائق، لا تقم بتحديث الصفحة
                    </Text>
                  </Flex>
                </div>

                {/* Generate Button */}
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={handleGenerate}
                    disabled={!uploadedImage || isGenerating}
                    className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold py-3 text-base"
                    size="lg"
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
                          <span className="font-arabic">جاري التوليد...</span>
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
                            توليد الصورة (1 رصيد)
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </Flex>
            </Card>
          </motion.div>

          {/* Right Side - Preview & Examples */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass gradient-border h-full p-6">
              <Flex direction="column" className="h-full">
                {/* Hero Section */}
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
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
                    <Heading
                      as="h1"
                      size="2xl"
                      className="mb-4 bg-gradient-primary bg-clip-text text-transparent"
                    >
                      حوّل أي صورة إلى تصميم ثلاثي الأبعاد مميز
                    </Heading>
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
                      استخدم الذكاء الاصطناعي لتحويل صورك إلى تص��ميم إبداعية
                      ثلاثية الأبعاد بخلفية شفافة، مثالية للمصممين والمبدعين
                    </Text>
                  </motion.div>

                  {/* Rating */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="center"
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
                        +12,500 مستخدم استفاد من هذا التأثير
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
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    className="mb-6"
                  >
                    <Heading as="h2" size="lg" className="font-arabic">
                      🎨 أمثلة على التصاميم ثلاثية الأبعاد
                    </Heading>
                    <Button variant="secondary" size="sm">
                      <span className="font-arabic">المزيد من الأمثلة</span>
                      <span className="flip-for-rtl ms-1">←</span>
                    </Button>
                  </Flex>

                  <Grid columns={{ initial: 1, md: 2 }} gap="4">
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
                                الأصلية
                              </Badge>
                            </div>
                            <div className="relative border-s-2 border-primary">
                              <img
                                src={img.src}
                                alt="Generated"
                                className="w-full h-full object-cover"
                              />
                              <Badge
                                variant="primary"
                                className="absolute top-2 end-2"
                              >
                                ثلاثي الأبعاد
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </Grid>

                  <Flex justifyContent="center" className="mt-6">
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                        <Upload className="w-5 h-5 me-2" />
                        <span className="font-arabic">ارفع صورتك الآن</span>
                      </Button>
                    </motion.div>
                  </Flex>
                </motion.div>
              </Flex>
            </Card>
          </motion.div>
        </Grid>
      </Flex>
    </motion.div>
  );
}