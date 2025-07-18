import { useState, useEffect } from "react";
import {
  ChevronUp,
  Plus,
  ArrowUp,
  MoreHorizontal,
  Grid,
  Image,
  LogOut,
  Trash2,
  Bookmark,
  Wand2,
  ZoomIn,
  Download,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  StyleCard,
  ColorPicker,
  Slider,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "../components/design-system";
import { Hero211 } from "../components/hero/Hero211";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useNavigation } from "../components/navigation/hooks/useNavigation";
import { useOnceUITheme } from "../hooks/use-once-ui-theme";
import { useTranslation } from "../hooks/use-translation";
import { useAuth } from "../hooks/use-auth";
import {
  useGenerateImage,
  useSaveImage,
  useUserStats,
  useStyles,
} from "../hooks/use-api";
import type { Style } from "@shared/api";

export default function Generator() {
  const { theme } = useOnceUITheme();
  const { t } = useTranslation();
  const { user, signOut, isAuthenticated, isLoading: authLoading } = useAuth();
  const { navigateToPath } = useNavigation();

  // Style selection data for generative styles
  const STYLE_DATA = [
    {
      id: "voxel-3d",
      title: "Voxel 3D",
      image:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Ff5038dd119ce4266a439e75fa658dd29?alt=media&token=e6d7e49c-b1ec-4082-839d-72aa4ae2e3b4&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      defaultPrompt: "Create me a 3D icon of a frog on a lily pad",
      defaultColors: ["#FFC0CB", "#FF6B6B", "#F5F5DC", "#228B22", "#87CEEB"], // soft pinks, warm reds, off-whites, forest greens, cool blues
      resultImage:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F41e8e9a8879f4ba6aa46bab08d9265d4?alt=media&token=47164c09-1c72-4c6f-ac46-4352d516ed52&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      jsonPrompt: {
        style: "3D Pixel Isometric",
        geometry: {
          voxel_size: "uniform",
          blocky_structure: true,
          isometric_projection: true,
        },
        materials: { texture: "flat colors", surface_reflectivity: "matte" },
        background: { color: "transparent", transparent_png_ready: true },
      },
    },
    {
      id: "style-2",
      title: "Style 2",
      image:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Ff247b3d4ad5c42489a207df73147e781?alt=media&token=ef9f481e-cffd-4dee-8cf2-aadd19d75984&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
    },
    {
      id: "style-3",
      title: "Style 3",
      image:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc12cd84fc6ac457f87e4e84fa37e5d42?alt=media&token=6fd8b27f-2183-44b2-afdf-71079796d6c5&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
    },
    {
      id: "clay-3d",
      title: "Clay 3D",
      image:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F76fbd13e4c7549a0b62438f39eef35a4?alt=media&token=05934085-674e-4985-9c54-c0a085edeca1&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      defaultPrompt: "Create me a 3D clay icon of a frog on a lily pad",
      defaultColors: ["#8B4513", "#CD853F", "#DEB887", "#D2691E", "#A0522D"], // clay browns, sandy browns, wheat tones
      resultImage:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F41e8e9a8879f4ba6aa46bab08d9265d4?alt=media&token=47164c09-1c72-4c6f-ac46-4352d516ed52&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      jsonPrompt: {
        style: "3D Clay Sculpture",
        materials: { texture: "clay", surface_reflectivity: "matte" },
        background: { color: "transparent", transparent_png_ready: true },
      },
    },
    {
      id: "crystal-3d",
      title: "Crystal 3D",
      image:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc7f3b2331b3b4344a48def6baa70715b?alt=media&token=f762499c-39c3-44f2-ba79-99ab0d4d3177&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      defaultPrompt: "Create me a 3D crystal icon of a frog on a lily pad",
      defaultColors: ["#87CEEB", "#B0E0E6", "#E0FFFF", "#F0F8FF", "#98FB98"], // crystal blues, light blues, cyan tones
      resultImage:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F41e8e9a8879f4ba6aa46bab08d9265d4?alt=media&token=47164c09-1c72-4c6f-ac46-4352d516ed52&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      jsonPrompt: {
        style: "3D Crystal",
        materials: { texture: "crystal", surface_reflectivity: "reflective" },
        background: { color: "transparent", transparent_png_ready: true },
      },
    },
    {
      id: "fire-jelly-3d",
      title: "Fire Jelly 3D",
      image:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fa611edc775cd44bfb251ff0515872774?alt=media&token=3f9bfe10-0e70-461e-bf8f-90f3d1ad8c09&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      defaultPrompt: "Create me a 3D fire jelly icon of a frog on a lily pad",
      defaultColors: ["#FF4500", "#FF6347", "#FF7F50", "#FFA500", "#FFD700"], // fire oranges, reds, golden tones
      resultImage:
        "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F41e8e9a8879f4ba6aa46bab08d9265d4?alt=media&token=47164c09-1c72-4c6f-ac46-4352d516ed52&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      jsonPrompt: {
        style: "3D Fire Jelly",
        materials: { texture: "translucent", surface_reflectivity: "glossy" },
        background: { color: "transparent", transparent_png_ready: true },
      },
    },
  ];
  const [isStyleSelectionExpanded, setIsStyleSelectionExpanded] =
    useState(true);
  const [isCustomColorsExpanded, setIsCustomColorsExpanded] = useState(true);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("voxel-3d");
  const [customColors, setCustomColors] = useState([
    { id: 1, hex: "#34C759", opacity: 100 },
  ]);
  const [editingColorId, setEditingColorId] = useState<number | null>(null);
  const [editingHex, setEditingHex] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [isPromptFocused, setIsPromptFocused] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [generatedResultImage, setGeneratedResultImage] = useState<
    string | null
  >(null);
  const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageProcessed, setImageProcessed] = useState<boolean>(false);
  const [processedImageData, setProcessedImageData] = useState(null);

  // API hooks
  const {
    generateImage,
    isGenerating: isGeneratingAPI,
    error: generateError,
  } = useGenerateImage();
  const { saveImage, isSaving, error: saveError } = useSaveImage();
  const { getUserStats } = useUserStats();
  const { getStyles } = useStyles();

  // User stats
  const [userStats, setUserStats] = useState<{
    remainingGenerations: number;
    maxGenerations: number;
  } | null>(null);
  const [availableStyles, setAvailableStyles] = useState<Style[]>([]);

  // Enhanced upload states
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(
    new Map(),
  );
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());
  const [failedFiles, setFailedFiles] = useState<Set<string>>(new Set());

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigateToPath({ path: "/login" });
      return;
    }
  }, [authLoading, isAuthenticated, navigateToPath]);

  // Initialize component and load data
  useEffect(() => {
    // Don't initialize if not authenticated
    if (!isAuthenticated || authLoading) {
      return;
    }

    const initializeData = async () => {
      try {
        console.log("Starting data initialization...");

        // Load user stats with fallback
        try {
          const stats = await getUserStats();
          setUserStats({
            remainingGenerations: stats.remainingGenerations,
            maxGenerations: stats.maxGenerations,
          });
          console.log("User stats loaded successfully");
        } catch (userError) {
          console.warn("Failed to load user stats, using defaults:", userError);
          // Set default values if API fails
          setUserStats({
            remainingGenerations: 30,
            maxGenerations: 30,
          });
        }

        // Load available styles with fallback
        try {
          const stylesData = await getStyles();
          setAvailableStyles(stylesData.styles);
          console.log("Styles loaded successfully");

          // Set default style to first available or voxel-3d
          const defaultStyle =
            stylesData.styles.find((s) => s.name === "Voxel 3D") ||
            stylesData.styles[0];
          if (defaultStyle) {
            handleStyleSelection(defaultStyle.id);
          }
        } catch (stylesError) {
          console.warn(
            "Failed to load styles, using hardcoded data:",
            stylesError,
          );
          // Fallback to existing hardcoded data
          setAvailableStyles([]);
          handleStyleSelection("voxel-3d");
        }
      } catch (error) {
        console.error("Failed to initialize data:", error);
        // Ultimate fallback to existing hardcoded data
        setUserStats({
          remainingGenerations: 30,
          maxGenerations: 30,
        });
        setAvailableStyles([]);
        handleStyleSelection("voxel-3d");
      }
    };

    initializeData();
  }, [isAuthenticated, authLoading, getUserStats, getStyles]);

  // Confetti celebration effect
  const triggerCelebration = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      // Left cannon
      if (typeof window !== "undefined" && (window as any).confetti) {
        (window as any).confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });

        // Right cannon
        (window as any).confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });
      }

      requestAnimationFrame(frame);
    };

    frame();
  };

  // Action button handlers
  const handleSaveToLibrary = async () => {
    if (!generatedResultImage) return;

    try {
      const selectedStyle =
        availableStyles.find((style) => style.id === selectedStyleId) ||
        STYLE_DATA.find((style) => style.id === selectedStyleId);

      const result = await saveImage({
        imageUrl: generatedResultImage,
        prompt: promptText,
        styleName:
          "name" in (selectedStyle || {})
            ? (selectedStyle as Style).name
            : "title" in (selectedStyle || {})
              ? (selectedStyle as (typeof STYLE_DATA)[0]).title
              : "Unknown Style",
        colors: customColors.map((c) => c.hex),
      });

      if (result.success) {
        alert("Image saved to your library!");
      } else {
        throw new Error(result.error || "Save failed");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save image. Please try again.",
      );
    }
  };

  const handleRemoveBackground = () => {
    console.log("Removing background... (PRO feature)");
    // Implementation for background removal (premium feature)
  };

  const handleUpscale = () => {
    console.log("Upscaling image... (PRO feature)");
    // Implementation for upscaling (premium feature)
  };

  const handleDownload = () => {
    if (generatedResultImage) {
      const link = document.createElement("a");
      link.href = generatedResultImage;
      link.download = "generated-3d-object.png";
      link.click();
    }
  };

  // File upload helpers
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const simulateUpload = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadingFiles((prev) => new Map(prev.set(fileId, 0)));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadingFiles((prev) => new Map(prev.set(fileId, progress)));
    }

    // Simulate random success/failure
    const success = Math.random() > 0.3; // 70% success rate

    setUploadingFiles((prev) => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });

    if (success) {
      setCompletedFiles((prev) => new Set(prev.add(fileId)));
    } else {
      setFailedFiles((prev) => new Set(prev.add(fileId)));
    }

    return { fileId, success };
  };

  const handleFileUpload = async (files: File[]) => {
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024, // 10MB limit
    );

    if (validFiles.length === 0) return;

    // Only take the first file for single upload
    const singleFile = validFiles[0];
    setUploadedFiles([singleFile]);

    // Simulate upload for the single file
    simulateUpload(singleFile);
  };

  const retryUpload = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setFailedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(`${file.name}-${Date.now()}`);
      return newSet;
    });

    await simulateUpload(file);
  };

  const removeFile = (file: File, index: number) => {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setCompletedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
    setFailedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
  };

  const handleStyleSelection = (styleId: string) => {
    setSelectedStyleId(styleId);
    const selectedStyle = STYLE_DATA.find((style) => style.id === styleId);

    if (selectedStyle?.defaultPrompt) {
      setPromptText(selectedStyle.defaultPrompt);
      setCharCount(selectedStyle.defaultPrompt.length);
    }

    if (selectedStyle?.defaultColors) {
      // Convert hex colors to the format expected by customColors
      const newColors = selectedStyle.defaultColors
        .slice(0, 2)
        .map((hex, index) => ({
          id: index + 1,
          hex: hex,
          opacity: 100,
        }));
      setCustomColors(newColors);
    }
  };

  const handleGenerate = async () => {
    if (promptText.trim().length === 0 || isGenerating || isGeneratingAPI)
      return;

    // Check user quota
    if (userStats && userStats.remainingGenerations <= 0) {
      alert(
        "You have reached your monthly generation limit. Please wait until next month.",
      );
      return;
    }

    setIsGenerating(true);
    setShowActionButtons(false);
    setGeneratedResultImage(null);

    try {
      // Find the selected style
      const selectedStyle =
        availableStyles.find((style) => style.id === selectedStyleId) ||
        STYLE_DATA.find((style) => style.id === selectedStyleId);

      if (!selectedStyle) {
        throw new Error("Selected style not found");
      }

      const result = await generateImage({
        prompt: promptText,
        styleId: selectedStyleId,
        colors: customColors.map((c) => c.hex),
        uploadedImageUrl:
          uploadedFiles.length > 0 ? "uploaded-image-url" : undefined,
      });

      if (result.success && result.imageUrl) {
        setGeneratedResultImage(result.imageUrl);
        setImageProcessed(true);

        // Update user stats
        if (result.remainingGenerations !== undefined) {
          setUserStats((prev) =>
            prev
              ? {
                  ...prev,
                  remainingGenerations: result.remainingGenerations!,
                }
              : null,
          );
        }

        // Trigger celebration effect
        setTimeout(() => {
          triggerCelebration();
          setTimeout(() => {
            setShowActionButtons(true);
          }, 800);
        }, 500);
      } else {
        throw new Error(result.error || "Generation failed");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Generation failed. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-inter">
      {/* CSS for PRO badge animation */}
      <style>{`
        .pro-badge {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .action-button:hover {
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
        }

        @media (max-width: 767px) {
          .action-button {
            min-height: 48px;
          }
        }
      `}</style>
      {/* Background gradient for dark/light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />
      <div className="w-full max-w-[1440px] h-[1024px] flex items-center gap-8 p-8">
        {/* Left Sidebar */}
        <div className="w-[442px] flex flex-col justify-between items-center h-full rounded-[20px] border border-border bg-card shadow-lg">
          {/* Top Section */}
          <div className="flex flex-col items-start self-stretch rounded-[20px]">
            {/* Project Header */}
            <div className="flex p-3 px-2.5 flex-col justify-start gap-2 self-stretch sticky top-0 z-10 bg-card rounded-t-[20px]">
              <div className="flex py-1 px-1.5 justify-between items-center self-stretch">
                {/* Logo */}
                <img
                  src={
                    theme === "dark"
                      ? "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fb7a440ba59d348d6a7dc75e25e912748?format=webp&width=800"
                      : "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F207bcd63914a43c2b81f7d68a2d3eab8?format=webp&width=800"
                  }
                  alt="Madar Logo"
                  width="150"
                  height="32"
                  className="object-contain"
                />

                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                  {/* Page Navigation Buttons */}
                  <motion.button
                    onClick={() => navigateToPath({ path: "/" })}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={t("common.navigation.home")}
                  >
                    <Home className="w-4 h-4 text-muted-foreground" />
                  </motion.button>

                  <motion.button
                    onClick={() => navigateToPath({ path: "/generator" })}
                    className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={t("common.navigation.generator")}
                  >
                    <Grid className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => navigateToPath({ path: "/gallery" })}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={t("common.navigation.gallery")}
                  >
                    <Image className="w-4 h-4 text-muted-foreground" />
                  </motion.button>

                  {/* Language and Theme Toggles */}
                  <LanguageSwitcher />
                  <ThemeToggle />

                  {/* Three Dots Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user && (
                        <DropdownMenuItem onClick={signOut}>
                          <LogOut className="w-4 h-4 mr-2" />
                          {t("common.buttons.signOut")}
                        </DropdownMenuItem>
                      )}
                      {!user && (
                        <DropdownMenuItem
                          onClick={() => navigateToPath({ path: "/login" })}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {t("common.buttons.signIn")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Project Details */}
              <div className="flex flex-col items-start self-stretch">
                <div className="flex items-center justify-between self-stretch rounded-md">
                  <div className="flex px-1.5 items-center">
                    <div
                      className="text-xs font-normal leading-4 tracking-[-0.1px] max-w-[174px] overflow-hidden text-ellipsis text-foreground"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        fontFamily: "Inter",
                      }}
                    >
                      <span className="text-[15px] font-bold">
                        {t("brand.name")}{" "}
                      </span>
                      <span className="text-[10px] font-normal">
                        {t("brand.beta")}
                      </span>
                    </div>
                  </div>

                  {/* User Quota Display */}
                  {userStats && (
                    <div className="flex items-center gap-2 px-2">
                      <div className="text-[10px] font-medium text-muted-foreground">
                        {userStats.remainingGenerations}/
                        {userStats.maxGenerations}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              userStats.remainingGenerations > 5
                                ? "bg-green-500"
                                : userStats.remainingGenerations > 2
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${(userStats.remainingGenerations / userStats.maxGenerations) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Upload Area */}
            <motion.div
              className="flex-1 p-4 border-t border-border w-full self-stretch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              {/* New Enhanced File Upload Component */}
              <div className="w-full space-y-4">
                {/* Main Upload Area */}
                {uploadedFiles.length === 0 ? (
                  <motion.div
                    className={`relative w-full min-h-[120px] rounded-xl border-2 border-dashed transition-all duration-300 flex items-center gap-4 p-4 cursor-pointer ${
                      isDragOver
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsDragOver(false);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const files = Array.from(e.dataTransfer.files);
                      handleFileUpload(files);
                    }}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.multiple = false;
                      input.onchange = (e) => {
                        const files = Array.from(
                          (e.target as HTMLInputElement).files || [],
                        );
                        handleFileUpload(files);
                      };
                      input.click();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Upload Icon */}
                    <motion.div
                      animate={{
                        scale: isDragOver ? 1.1 : 1,
                        rotate: isDragOver ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-muted-foreground"
                      >
                        <path
                          d="M40.2 29.4V34.8H45.6V38.4H40.2V43.8H36.6V38.4H31.2V34.8H36.6V29.4H40.2ZM40.2144 7.80005C41.2008 7.80005 42 8.60105 42 9.58745V26.4156C40.8437 26.0072 39.6263 25.799 38.4 25.8V11.4H9.6L9.6018 36.6L26.3274 19.8726C26.6369 19.5621 27.0492 19.3754 27.4868 19.3475C27.9244 19.3197 28.357 19.4527 28.7034 19.7214L28.8708 19.8744L35.2536 26.2644C33.858 26.6897 32.5629 27.3932 31.4465 28.3326C30.3301 29.2719 29.4155 30.4276 28.7578 31.73C28.1002 33.0323 27.7131 34.4544 27.6199 35.9104C27.5267 37.3664 27.7293 38.8263 28.2156 40.2018L7.7856 40.2C7.31186 40.1996 6.85769 40.011 6.52288 39.6759C6.18807 39.3407 6 38.8864 6 38.4126V9.58745C6.00329 9.11473 6.19242 8.66228 6.52652 8.32784C6.86063 7.9934 7.31288 7.80382 7.7856 7.80005H40.2144ZM16.8 15C17.7548 15 18.6705 15.3793 19.3456 16.0545C20.0207 16.7296 20.4 17.6453 20.4 18.6C20.4 19.5548 20.0207 20.4705 19.3456 21.1456C18.6705 21.8208 17.7548 22.2 16.8 22.2C15.8452 22.2 14.9295 21.8208 14.2544 21.1456C13.5793 20.4705 13.2 19.5548 13.2 18.6C13.2 17.6453 13.5793 16.7296 14.2544 16.0545C14.9295 15.3793 15.8452 15 16.8 15Z"
                          fill="currentColor"
                        />
                      </svg>
                    </motion.div>

                    {/* Upload Text */}
                    <div className="flex-1">
                      <motion.h3
                        className="text-sm font-medium text-foreground mb-1"
                        animate={{
                          color: isDragOver
                            ? "hsl(var(--primary))"
                            : "hsl(var(--foreground))",
                        }}
                      >
                        {isDragOver
                          ? t("pages.homepage.fileUpload.dropFiles")
                          : t("pages.homepage.fileUpload.chooseFile")}
                      </motion.h3>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG up to 10 MB.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* Single File Uploaded State */
                  (() => {
                    const file = uploadedFiles[0];
                    const fileId = `${file.name}-${Date.now()}`;
                    const isUploading = uploadingFiles.has(fileId);
                    const isCompleted = completedFiles.has(fileId);
                    const isFailed = failedFiles.has(fileId);
                    const progress = uploadingFiles.get(fileId) || 0;

                    return (
                      <motion.div
                        className={`relative w-full min-h-[120px] rounded-xl border-2 transition-all duration-300 flex items-center gap-4 p-4 ${
                          isFailed
                            ? "border-destructive bg-destructive/5"
                            : isCompleted
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-border bg-card"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        {/* File Icon */}
                        <motion.div
                          animate={{
                            scale: isUploading ? [1, 1.05, 1] : 1,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: isUploading ? Infinity : 0,
                          }}
                        >
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 0.75H20.5146C21.907 0.75 23.242 1.30354 24.2266 2.28809L33.7119 11.7734C34.6965 12.758 35.25 14.093 35.25 15.4854V34C35.25 36.8995 32.8995 39.25 30 39.25H10C7.10051 39.25 4.75 36.8995 4.75 34V6C4.75 3.10051 7.10051 0.75 10 0.75Z"
                              fill="white"
                              stroke="#CACFD8"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M23 1V9C23 11.2091 24.7909 13 27 13H35"
                              stroke="#CACFD8"
                              strokeWidth="1.5"
                            />
                            <rect
                              x="0"
                              y="22"
                              width="30"
                              height="12"
                              rx="4"
                              fill="#7D52F4"
                            />
                            <text
                              x="3"
                              y="30"
                              fill="white"
                              fontSize="11"
                              fontWeight="600"
                              fontFamily="Inter"
                            >
                              {getFileExtension(file.name).toUpperCase()}
                            </text>
                          </svg>
                        </motion.div>

                        {/* File Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate mb-1">
                            {file.name}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <span>{getFileSize(file.size)}</span>
                            <span>•</span>
                            {isUploading && (
                              <div className="flex items-center gap-1">
                                <motion.div
                                  className="w-3 h-3"
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8 2C8.15913 2 8.31174 2.06321 8.42426 2.17574C8.53679 2.28826 8.6 2.44087 8.6 2.6V4.4C8.6 4.55913 8.53679 4.71174 8.42426 4.82426C8.31174 4.93679 8.15913 5 8 5C7.84087 5 7.68826 4.93679 7.57574 4.82426C7.46321 4.71174 7.4 4.55913 7.4 4.4V2.6C7.4 2.44087 7.46321 2.28826 7.57574 2.17574C7.68826 2.06321 7.84087 2 8 2Z"
                                      fill="#335CFF"
                                    />
                                  </svg>
                                </motion.div>
                                <span className="text-foreground">
                                  {t("pages.homepage.fileUpload.uploading")}...
                                </span>
                              </div>
                            )}
                            {isCompleted && (
                              <div className="flex items-center gap-1">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z"
                                    fill="#1FC16B"
                                  />
                                </svg>
                                <span className="text-foreground">
                                  {t("pages.homepage.fileUpload.completed")}
                                </span>
                              </div>
                            )}
                            {isFailed && (
                              <div className="flex items-center gap-1">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4 9.8V11H8.6V9.8H7.4ZM7.4 5V8.6H8.6V5H7.4Z"
                                    fill="#FB3748"
                                  />
                                </svg>
                                <span className="text-foreground">
                                  {t("pages.homepage.fileUpload.failed")}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {isUploading && (
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mb-2">
                              <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}

                          {/* Try Again Link for Failed Files */}
                          {isFailed && (
                            <motion.button
                              onClick={() => retryUpload(file)}
                              className="text-xs text-destructive underline hover:no-underline"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Try Again
                            </motion.button>
                          )}
                        </div>

                        {/* Action Button */}
                        <motion.button
                          onClick={() => removeFile(file, 0)}
                          className="p-2 rounded-md hover:bg-muted transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isFailed ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.75 5.5H17.5V7H16V16.75C16 16.9489 15.921 17.1397 15.7803 17.2803C15.6397 17.421 15.4489 17.5 15.25 17.5H4.75C4.55109 17.5 4.36032 17.421 4.21967 17.2803C4.07902 17.1397 4 16.9489 4 16.75V7H2.5V5.5H6.25V3.25C6.25 3.05109 6.32902 2.86032 6.46967 2.71967C6.61032 2.57902 6.80109 2.5 7 2.5H13C13.1989 2.5 13.3897 2.57902 13.5303 2.71967C13.671 2.86032 13.75 3.05109 13.75 3.25V5.5ZM14.5 7H5.5V16H14.5V7ZM7.75 9.25H9.25V13.75H7.75V9.25ZM10.75 9.25H12.25V13.75H10.75V9.25ZM7.75 4V5.5H12.25V4H7.75Z"
                                fill="#FB3748"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0001 8.93955L13.7126 5.22705L14.7731 6.28755L11.0606 10.0001L14.7731 13.7126L13.7126 14.7731L10.0001 11.0606L6.28755 14.7731L5.22705 13.7126L8.93955 10.0001L5.22705 6.28755L6.28755 5.22705L10.0001 8.93955Z"
                                fill="currentColor"
                                className="text-muted-foreground"
                              />
                            </svg>
                          )}
                        </motion.button>
                      </motion.div>
                    );
                  })()
                )}
              </div>
            </motion.div>

            {/* Style Selection Section */}
            <div className="flex flex-col items-start self-stretch">
              <div
                className="flex h-12 py-3 px-4 justify-between items-center self-stretch border-t border-border cursor-pointer"
                onClick={() =>
                  setIsStyleSelectionExpanded(!isStyleSelectionExpanded)
                }
              >
                <div
                  className="text-xs font-semibold leading-4 tracking-[-0.12px] text-foreground"
                  style={{
                    fontFamily: "Inter",
                  }}
                >
                  {t("pages.homepage.styleSection.title")}
                </div>
                <div className="flex p-1 justify-center items-center gap-2 rounded-md">
                  <ChevronUp
                    className="w-4 h-4"
                    style={{ color: "var(--Text-Secondary, #7B7B7B)" }}
                  />
                </div>
              </div>

              {/* Style Selection Grid */}
              {isStyleSelectionExpanded && (
                <motion.div
                  className="flex p-4 content-start gap-2 self-stretch flex-row overflow-auto"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {STYLE_DATA.map((style, index) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <StyleCard
                        id={style.id}
                        title={style.title}
                        image={style.image}
                        isSelected={selectedStyleId === style.id}
                        onClick={() => handleStyleSelection(style.id)}
                        className="w-[184px] h-[180px]"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Custom Colors Section */}
            <div className="flex flex-col items-start self-stretch">
              <div
                className="flex h-12 py-3 px-4 justify-between items-center self-stretch border-t border-border cursor-pointer"
                onClick={() =>
                  setIsCustomColorsExpanded(!isCustomColorsExpanded)
                }
              >
                <div
                  className="text-xs font-semibold leading-4 tracking-[-0.12px] text-foreground"
                  style={{
                    fontFamily: "Inter",
                  }}
                >
                  {t("pages.homepage.colorSection.title")} (
                  {customColors.length}/2)
                </div>
                <div
                  className={`flex p-1 justify-center items-center gap-2 rounded-md transition-colors ${
                    customColors.length >= 2
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customColors.length < 2) {
                      const newColor = {
                        id: Date.now(),
                        hex: `#${Math.floor(Math.random() * 16777215)
                          .toString(16)
                          .padStart(6, "0")}`,
                        opacity: 100,
                      };
                      setCustomColors([...customColors, newColor]);
                    }
                  }}
                  title={
                    customColors.length >= 2
                      ? t("pages.homepage.colorPicker.maxColors")
                      : t("pages.homepage.colorPicker.addColor")
                  }
                >
                  <Plus
                    className="w-4 h-4"
                    style={{ color: "var(--Text-Secondary, #7B7B7B)" }}
                  />
                </div>
              </div>

              {/* Color Picker */}
              {isCustomColorsExpanded && (
                <div className="flex py-0 px-4 pb-4 flex-col items-start gap-2 self-stretch">
                  {customColors.map((color) => (
                    <div
                      key={color.id}
                      className="flex p-1 items-center self-stretch rounded-[10px] border border-border bg-muted group hover:border-muted-foreground/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 border-r border-[rgba(50,50,50,0.10)]">
                        <ColorPicker
                          color={color.hex}
                          onChange={(newHex) => {
                            setCustomColors(
                              customColors.map((c) =>
                                c.id === color.id ? { ...c, hex: newHex } : c,
                              ),
                            );
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-md border cursor-pointer hover:scale-105 transition-transform"
                            style={{
                              borderColor: "rgba(50, 50, 50, 0.10)",
                              backgroundColor: color.hex,
                            }}
                          ></div>
                        </ColorPicker>
                        {editingColorId === color.id ? (
                          <input
                            type="text"
                            value={editingHex}
                            onChange={(e) => setEditingHex(e.target.value)}
                            onBlur={() => {
                              const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(
                                editingHex,
                              );
                              if (isValidHex) {
                                setCustomColors(
                                  customColors.map((c) =>
                                    c.id === color.id
                                      ? { ...c, hex: editingHex.toUpperCase() }
                                      : c,
                                  ),
                                );
                              } else {
                                setEditingHex(color.hex.toUpperCase());
                              }
                              setEditingColorId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              } else if (e.key === "Escape") {
                                setEditingHex(color.hex.toUpperCase());
                                setEditingColorId(null);
                              }
                            }}
                            className="text-xs font-medium leading-4 tracking-[-0.12px] bg-transparent border-none outline-none focus:outline-none w-16 text-center px-1 py-0.5 rounded hover:bg-muted focus:bg-muted text-foreground"
                            style={{
                              fontFamily: "Inter",
                            }}
                            autoFocus
                          />
                        ) : (
                          <div
                            className="text-xs font-medium leading-4 tracking-[-0.12px] cursor-pointer px-1 py-0.5 rounded hover:bg-muted transition-colors text-foreground"
                            style={{
                              fontFamily: "Inter",
                            }}
                            onClick={() => {
                              setEditingColorId(color.id);
                              setEditingHex(color.hex.toUpperCase());
                            }}
                          >
                            {color.hex.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex py-0 px-3 justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            setCustomColors(
                              customColors.filter((c) => c.id !== color.id),
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Prompt Input */}
          <motion.div
            className="flex p-3 flex-col items-start gap-6 self-stretch rounded-3xl border backdrop-blur-md shadow-lg bg-card mx-3 mb-3"
            style={{
              borderColor: isPromptFocused
                ? "rgba(144, 19, 254, 0.3)"
                : "hsl(var(--border))",
            }}
            animate={{
              scale: isPromptFocused ? 1.01 : 1,
              borderColor: isPromptFocused
                ? "rgba(144, 19, 254, 0.3)"
                : "var(--Stroke-01, #ECECEC)",
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Textarea Container */}
            <div className="flex p-2 items-start gap-2 self-stretch relative">
              <textarea
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  setCharCount(e.target.value.length);
                  // Auto-resize
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 150) + "px";
                }}
                onFocus={() => setIsPromptFocused(true)}
                onBlur={() => setIsPromptFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder={
                  [
                    "voxel-3d",
                    "clay-3d",
                    "crystal-3d",
                    "fire-jelly-3d",
                  ].includes(selectedStyleId) && promptText === ""
                    ? STYLE_DATA.find((style) => style.id === selectedStyleId)
                        ?.defaultPrompt ||
                      t("pages.homepage.promptInput.placeholder")
                    : t("pages.homepage.promptInput.placeholder")
                }
                className="text-[15px] font-normal leading-6 tracking-[-0.3px] flex-1 resize-none border-none outline-none bg-transparent min-h-[90px] max-h-[150px] transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                style={{
                  fontFamily: "Inter",
                  height: promptText ? "auto" : "90px",
                }}
                maxLength={500}
              />

              {/* Character Count */}
              <motion.div
                className="absolute bottom-2 right-2 text-xs text-muted-foreground"
                style={{
                  color:
                    charCount > 450
                      ? "#ef4444"
                      : "hsl(var(--muted-foreground))",
                  fontFamily: "Inter",
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isPromptFocused || charCount > 0 ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {t("pages.homepage.promptInput.charCount", {
                  count: charCount,
                })}
              </motion.div>
            </div>

            {/* Actions Row */}
            <motion.div
              className="flex justify-between items-center self-stretch pt-2"
              style={{
                borderTop: isPromptFocused
                  ? "1px solid rgba(144, 19, 254, 0.2)"
                  : "1px solid transparent",
              }}
              animate={{
                borderTopColor: isPromptFocused
                  ? "rgba(144, 19, 254, 0.2)"
                  : "transparent",
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {promptText.length > 0 && !isGenerating && (
                  <motion.div
                    className="flex items-center gap-1 px-2 py-1 rounded-md"
                    style={{ backgroundColor: "rgba(144, 19, 254, 0.1)" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <motion.div
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: "#9013FE" }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: "#9013FE",
                        fontFamily: "Inter",
                      }}
                    >
                      {t("common.buttons.generate")}
                    </span>
                  </motion.div>
                )}

                {(isGenerating || isGeneratingAPI) && (
                  <motion.div
                    className="flex items-center gap-2 px-2 py-1 rounded-md"
                    style={{ backgroundColor: "rgba(144, 19, 254, 0.1)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: "#9013FE",
                        fontFamily: "Inter",
                      }}
                    >
                      Generating...
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                className="flex w-10 h-10 py-3 px-8 justify-center items-center gap-2 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: isGenerating
                    ? "linear-gradient(180deg, #9013FE 0%, #7c3aed 100%)"
                    : promptText.trim().length > 0
                      ? "linear-gradient(180deg, #9013FE 0%, #7c3aed 100%)"
                      : "linear-gradient(180deg, #E5E5E5 0%, #E2E2E2 100%)",
                  boxShadow:
                    promptText.trim().length > 0 || isGenerating
                      ? "0px 3px 4px -1px rgba(144, 19, 254, 0.3), 0px 1px 0px 0px rgba(255, 255, 255, 0.33) inset, 0px 0px 0px 1px rgba(144, 19, 254, 0.5)"
                      : "0px 3px 4px -1px rgba(0, 0, 0, 0.15), 0px 1px 0px 0px rgba(255, 255, 255, 0.33) inset, 0px 0px 0px 1px #D4D4D4",
                }}
                whileHover={{
                  scale: promptText.trim().length > 0 ? 1.05 : 1,
                  y: promptText.trim().length > 0 ? -1 : 0,
                }}
                whileTap={{ scale: 0.95 }}
                disabled={
                  promptText.trim().length === 0 ||
                  isGenerating ||
                  isGeneratingAPI ||
                  (userStats?.remainingGenerations || 0) <= 0
                }
                onClick={handleGenerate}
              >
                {isGenerating || isGeneratingAPI ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  <ArrowUp
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color:
                        promptText.trim().length > 0
                          ? "white"
                          : "var(--Text-Primary, #121212)",
                    }}
                  />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Sidebar - Canvas/Preview Area */}
        <div className="flex flex-col items-center justify-center flex-1 self-stretch rounded-[20px] border border-border bg-card shadow-lg">
          {!imageProcessed ? (
            <div className="hero-wrapper w-full h-full">
              <Hero211 />
            </div>
          ) : (
            <div className="processed-image-container w-full h-full flex flex-col items-center justify-center gap-4 p-8">
              {generatedResultImage ? (
                <div
                  className="flex flex-col items-center gap-4 w-full max-w-md"
                  style={{ alignSelf: "center" }}
                >
                  {/* Preview Image with Fade-in Animation */}
                  <motion.div
                    className="w-[600px] h-[600px] rounded-2xl overflow-hidden border border-border bg-card shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={generatedResultImage}
                      alt="Generated 3D Result"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Success Message */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div
                      className="text-lg font-medium mb-2 text-foreground"
                      style={{
                        fontFamily: "Inter",
                      }}
                    >
                      🎉 Generation Complete!
                    </div>
                    <div
                      className="text-sm text-muted-foreground"
                      style={{
                        fontFamily: "Inter",
                      }}
                    >
                      Your 3D object has been generated successfully!
                    </div>
                  </motion.div>

                  {/* Action Buttons - Slide up animation */}
                  {showActionButtons && (
                    <motion.div
                      className="w-full mt-4"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {/* Action Buttons Container */}
                      <div className="bg-black/5 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
                        {/* Primary Actions Row */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {/* Save to Library */}
                          <motion.button
                            onClick={handleSaveToLibrary}
                            className="action-button bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Bookmark className="w-4 h-4" />
                            <span className="text-sm">Save to Library</span>
                          </motion.button>

                          {/* Download */}
                          <motion.button
                            onClick={handleDownload}
                            className="action-button bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 border border-border"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Download</span>
                          </motion.button>
                        </div>

                        {/* Premium Actions Row */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Remove Background - PRO */}
                          <motion.button
                            onClick={handleRemoveBackground}
                            className="action-button bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 border border-border relative"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Wand2 className="w-4 h-4" />
                            <span className="text-sm">Remove BG</span>
                            {/* PRO Badge */}
                            <div className="pro-badge absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                              PRO
                            </div>
                          </motion.button>

                          {/* Upscale - PRO */}
                          <motion.button
                            onClick={handleUpscale}
                            className="action-button bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 border border-border relative"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ZoomIn className="w-4 h-4" />
                            <span className="text-sm">Upscale</span>
                            {/* PRO Badge */}
                            <div className="pro-badge absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                              PRO
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L2 7L12 12L22 7L12 2Z"
                        stroke="#7B7B7B"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17L12 22L22 17"
                        stroke="#7B7B7B"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12L12 17L22 12"
                        stroke="#7B7B7B"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-medium mb-2 text-foreground"
                      style={{
                        fontFamily: "Inter",
                      }}
                    >
                      Processed Image
                    </div>
                    <div
                      className="text-sm text-muted-foreground"
                      style={{
                        fontFamily: "Inter",
                      }}
                    >
                      Your processed 3D objects will appear here
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
