import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Copy,
  Share2,
  Wand2,
} from "lucide-react";
import { Button } from "../design-system/Button";
import { useTranslation } from "../../hooks/use-translation";
import { cn } from "../../lib/utils";

export type GenerationStage =
  | "idle"
  | "uploading"
  | "processing"
  | "generating"
  | "finalizing"
  | "completed"
  | "error";

export interface GenerationResult {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  colors?: string[];
  createdAt: Date;
  downloadUrl?: string;
}

export interface GenerationStatusProps {
  stage: GenerationStage;
  progress?: number;
  result?: GenerationResult;
  error?: string;
  onDownload?: (result: GenerationResult) => void;
  onViewFullSize?: (result: GenerationResult) => void;
  onCopyPrompt?: (prompt: string) => void;
  onShare?: (result: GenerationResult) => void;
  onGenerateAgain?: () => void;
  className?: string;
}

const STAGE_MESSAGES = {
  uploading: "pages.generation.status.uploading",
  processing: "pages.generation.status.processing",
  generating: "pages.generation.status.generating",
  finalizing: "pages.generation.status.finalizing",
  completed: "pages.generation.status.completed",
  error: "pages.generation.status.error",
} as const;

const STAGE_PROGRESS = {
  uploading: 20,
  processing: 40,
  generating: 80,
  finalizing: 95,
  completed: 100,
} as const;

export function GenerationStatus({
  stage,
  progress,
  result,
  error,
  onDownload,
  onViewFullSize,
  onCopyPrompt,
  onShare,
  onGenerateAgain,
  className,
}: GenerationStatusProps) {
  const { t } = useTranslation();

  const displayProgress =
    progress ??
    (stage !== "idle"
      ? (STAGE_PROGRESS[stage as keyof typeof STAGE_PROGRESS] ?? 0)
      : 0);

  const isLoading = [
    "uploading",
    "processing",
    "generating",
    "finalizing",
  ].includes(stage);

  return (
    <AnimatePresence mode="wait">
      {stage !== "idle" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "w-full max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg",
            className,
          )}
        >
          {/* Loading States */}
          {isLoading && (
            <div className="text-center space-y-6">
              {/* Animated Icon */}
              <motion.div
                className="flex justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative">
                  <Wand2 className="w-16 h-16 text-primary" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>

              {/* Status Message */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {t(STAGE_MESSAGES[stage as keyof typeof STAGE_MESSAGES])}
                </h3>
                <p className="text-muted-foreground">
                  {t("pages.generation.status.pleaseWait")}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("pages.generation.status.progress")}</span>
                  <span>{displayProgress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Estimated Time */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-muted-foreground"
              >
                {t("pages.generation.status.estimatedTime")}
              </motion.p>
            </div>
          )}

          {/* Success State */}
          {stage === "completed" && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Success Header */}
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="flex justify-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t("pages.generation.status.success")}
                </h3>
                <p className="text-muted-foreground">
                  {t("pages.generation.status.successMessage")}
                </p>
              </div>

              {/* Generated Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-border bg-muted"
                onClick={() => onViewFullSize?.(result)}
              >
                <img
                  src={result.thumbnailUrl || result.imageUrl}
                  alt={result.prompt}
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="bg-background/90 backdrop-blur-sm rounded-full p-3"
                  >
                    <Eye className="w-6 h-6 text-foreground" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Generation Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {t("pages.generation.details.prompt")}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.prompt}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopyPrompt?.(result.prompt)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {t("pages.generation.details.style")}:
                    </span>
                    <span className="ml-2 text-foreground">{result.style}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {t("pages.generation.details.aspectRatio")}:
                    </span>
                    <span className="ml-2 text-foreground">
                      {result.aspectRatio}
                    </span>
                  </div>
                </div>

                {result.colors && result.colors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("pages.generation.details.colors")}:
                    </span>
                    <div className="flex gap-1">
                      {result.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-3"
              >
                <Button
                  onClick={() => onDownload?.(result)}
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t("common.buttons.download")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onShare?.(result)}
                  className="flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t("common.buttons.share")}
                </Button>
              </motion.div>

              {/* Generate Again Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-2"
              >
                <Button
                  variant="ghost"
                  onClick={onGenerateAgain}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {t("pages.generation.actions.generateAgain")}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Error State */}
          {stage === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <AlertCircle className="w-16 h-16 text-destructive" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("pages.generation.status.error")}
                </h3>
                <p className="text-muted-foreground">
                  {error || t("pages.generation.status.errorMessage")}
                </p>
              </div>

              <Button onClick={onGenerateAgain} variant="outline">
                {t("pages.generation.actions.tryAgain")}
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
