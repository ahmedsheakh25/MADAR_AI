import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Type,
  Wand2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "../design-system/Button";
import { StyleCard } from "../design-system/StyleCard";
import { ColorPicker } from "../design-system/ColorPicker";
import { useTranslation } from "../../hooks/use-translation";
import { cn } from "../../lib/utils";

// Style definitions for AI generation
const GENERATION_STYLES = [
  {
    id: "voxel-3d",
    title: "Voxel 3D",
    image:
      "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Ff5038dd119ce4266a439e75fa658dd29?alt=media&token=e6d7e49c-b1ec-4082-839d-72aa4ae2e3b4&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
    defaultPrompt:
      "Transform into a 3D voxel-style icon with blocky, pixelated aesthetic",
    falPrompt:
      "3d voxel style, minecraft aesthetic, blocky pixels, isometric view, clean edges",
  },
  {
    id: "minimal-icon",
    title: "Minimal Icon",
    image:
      "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc12cd84fc6ac457f87e4e84fa37e5d42?alt=media&token=6fd8b27f-2183-44b2-afdf-71079796d6c5&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
    defaultPrompt:
      "Create a minimal, clean icon with simple shapes and limited colors",
    falPrompt:
      "minimal icon design, clean lines, simple shapes, flat design, limited color palette",
  },
  {
    id: "glass-morphism",
    title: "Glass Morphism",
    image:
      "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F76fbd13e4c7549a0b62438f39eef35a4?alt=media&token=05934085-674e-4985-9c54-c0a085edeca1&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
    defaultPrompt: "Apply glassmorphism effect with transparency and blur",
    falPrompt:
      "glassmorphism style, translucent materials, frosted glass effect, soft shadows, transparency",
  },
  {
    id: "neon-glow",
    title: "Neon Glow",
    image:
      "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc7f3b2331b3b4344a48def6baa70715b?alt=media&token=f762499c-39c3-44f2-ba79-99ab0d4d3177&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
    defaultPrompt: "Add vibrant neon glow effects with electric colors",
    falPrompt:
      "neon glow effect, vibrant electric colors, glowing edges, cyberpunk aesthetic, bright illumination",
  },
  {
    id: "toy-figurine",
    title: "Toy Figurine",
    image:
      "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fa611edc775cd44bfb251ff0515872774?alt=media&token=3f9bfe10-0e70-461e-bf8f-90f3d1ad8c09&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
    defaultPrompt:
      "Transform into a collectible toy figurine with plastic-like finish",
    falPrompt:
      "toy figurine style, collectible figure, plastic material, smooth finish, miniature scale",
  },
];

export interface GenerationFormData {
  style: string;
  inputType: "text" | "image";
  textPrompt?: string;
  uploadedImage?: File;
  customColors: string[];
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
}

export interface GenerationFormProps {
  onGenerate: (formData: GenerationFormData) => Promise<void>;
  isGenerating?: boolean;
  className?: string;
}

export function GenerationForm({
  onGenerate,
  isGenerating = false,
  className,
}: GenerationFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<GenerationFormData>({
    style: "voxel-3d",
    inputType: "text",
    textPrompt: "",
    customColors: [],
    aspectRatio: "1:1",
  });

  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const selectedStyle = GENERATION_STYLES.find((s) => s.id === formData.style);

  const handleStyleSelect = useCallback((styleId: string) => {
    const style = GENERATION_STYLES.find((s) => s.id === styleId);
    setFormData((prev) => ({
      ...prev,
      style: styleId,
      textPrompt: style?.defaultPrompt || "",
    }));
  }, []);

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setFormData((prev) => ({
      ...prev,
      uploadedImage: file,
      inputType: "image",
    }));
    setUploadStatus("success");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload],
  );

  const handleGenerate = useCallback(async () => {
    if (!formData.style) return;
    if (formData.inputType === "text" && !formData.textPrompt?.trim()) return;
    if (formData.inputType === "image" && !formData.uploadedImage) return;

    try {
      await onGenerate(formData);
    } catch (error) {
      console.error("Generation failed:", error);
    }
  }, [formData, onGenerate]);

  const canGenerate =
    formData.style &&
    ((formData.inputType === "text" && formData.textPrompt?.trim()) ||
      (formData.inputType === "image" && formData.uploadedImage));

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-8", className)}>
      {/* Style Selection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">
          {t("pages.homepage.styleSection.title")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {GENERATION_STYLES.map((style) => (
            <StyleCard
              key={style.id}
              id={style.id}
              title={style.title}
              image={style.image}
              isSelected={formData.style === style.id}
              onClick={() => handleStyleSelect(style.id)}
            />
          ))}
        </div>
      </motion.section>

      {/* Input Type Toggle */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">
          {t("pages.homepage.inputType.title")}
        </h2>
        <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
          <button
            onClick={() =>
              setFormData((prev) => ({ ...prev, inputType: "text" }))
            }
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              formData.inputType === "text"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Type className="w-4 h-4" />
            {t("pages.homepage.inputType.text")}
          </button>
          <button
            onClick={() =>
              setFormData((prev) => ({ ...prev, inputType: "image" }))
            }
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              formData.inputType === "image"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ImageIcon className="w-4 h-4" />
            {t("pages.homepage.inputType.image")}
          </button>
        </div>
      </motion.section>

      {/* Input Content */}
      <AnimatePresence mode="wait">
        {formData.inputType === "text" ? (
          <motion.section
            key="text-input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-foreground">
              {t("pages.homepage.promptSection.title")}
            </h2>
            <div className="relative">
              <textarea
                value={formData.textPrompt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textPrompt: e.target.value,
                  }))
                }
                placeholder={
                  selectedStyle?.defaultPrompt ||
                  t("pages.homepage.promptInput.placeholder")
                }
                className="w-full min-h-32 p-4 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {formData.textPrompt?.length || 0}/500
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="image-input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-foreground">
              {t("pages.homepage.uploadSection.title")}
            </h2>

            {!formData.uploadedImage ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                className={cn(
                  "relative border-2 border-dashed border-border rounded-lg p-8 text-center transition-all",
                  dragOver && "border-primary bg-primary/5",
                  uploadStatus === "uploading" && "pointer-events-none",
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadStatus === "uploading"}
                />

                <div className="flex flex-col items-center gap-4">
                  {uploadStatus === "uploading" ? (
                    <>
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      <div className="space-y-2">
                        <p className="text-foreground font-medium">
                          {t("pages.homepage.fileUpload.uploading")}...
                        </p>
                        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-foreground font-medium">
                          {t("pages.homepage.fileUpload.chooseFile")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("pages.homepage.fileUpload.supportedFormats")}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-4">
                  {uploadStatus === "success" && (
                    <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {formData.uploadedImage.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(formData.uploadedImage.size / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        uploadedImage: undefined,
                      }))
                    }
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Custom Colors */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-base text-gray-800 dark:text-gray-200 font-medium">
          {t("pages.homepage.colorSection.title")} (
          {formData.customColors.length}/3)
        </h2>
        <div className="flex gap-2 flex-wrap">
          {formData.customColors.map((color, index) => (
            <ColorPicker
              key={index}
              color={color}
              onChange={(newColor) => {
                const newColors = [...formData.customColors];
                newColors[index] = newColor;
                setFormData((prev) => ({ ...prev, customColors: newColors }));
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-gray-300" style={{ backgroundColor: color }} />
            </ColorPicker>
          ))}
          {formData.customColors.length < 3 && (
            <button
              type="button"
              onClick={() => {
                const newColors = [...formData.customColors, "#3B82F6"];
                setFormData((prev) => ({ ...prev, customColors: newColors }));
              }}
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600"
            >
              +
            </button>
          )}
        </div>
      </motion.section>

      {/* Aspect Ratio */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">
          {t("pages.homepage.aspectRatioSection.title")}
        </h2>
        <div className="flex gap-2">
          {[
            { id: "1:1", label: "1:1", icon: "□" },
            { id: "16:9", label: "16:9", icon: "▭" },
            { id: "9:16", label: "9:16", icon: "▯" },
            { id: "4:3", label: "4:3", icon: "▬" },
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  aspectRatio: ratio.id as any,
                }))
              }
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                formData.aspectRatio === ratio.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <span className="text-lg">{ratio.icon}</span>
              <span className="text-sm font-medium">{ratio.label}</span>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          size="lg"
          className="min-w-48"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("pages.homepage.generating")}
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              {t("pages.homepage.promptInput.generateButton")}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
