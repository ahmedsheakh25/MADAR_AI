import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Share2,
  Copy,
  Heart,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
} from "lucide-react";
import { Button } from "../design-system/Button";
import { useTranslation } from "../../hooks/use-translation";
import { cn } from "../../lib/utils";
import type { GalleryItem } from "./GalleryGrid";

export interface ImageViewerModalProps {
  isOpen: boolean;
  item: GalleryItem | null;
  items?: GalleryItem[];
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onDownload?: (item: GalleryItem) => void;
  onShare?: (item: GalleryItem) => void;
  onLike?: (item: GalleryItem) => void;
  onCopyPrompt?: (prompt: string) => void;
  className?: string;
}

export function ImageViewerModal({
  isOpen,
  item,
  items,
  onClose,
  onNext,
  onPrevious,
  onDownload,
  onShare,
  onLike,
  onCopyPrompt,
  className,
}: ImageViewerModalProps) {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset zoom and rotation when item changes
  useEffect(() => {
    if (item) {
      setZoom(1);
      setRotation(0);
    }
  }, [item]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrevious?.();
          break;
        case "ArrowRight":
          onNext?.();
          break;
        case "+":
        case "=":
          setZoom((prev) => Math.min(prev * 1.2, 5));
          break;
        case "-":
          setZoom((prev) => Math.max(prev / 1.2, 0.1));
          break;
        case "0":
          setZoom(1);
          setRotation(0);
          break;
        case "r":
          setRotation((prev) => prev + 90);
          break;
        case "i":
          setShowDetails((prev) => !prev);
          break;
        case "f":
          setIsFullscreen((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!item) return null;

  const currentIndex = items?.findIndex((i) => i.id === item.id) ?? -1;
  const hasNavigation = items && items.length > 1;
  const canGoPrevious = hasNavigation && currentIndex > 0;
  const canGoNext = hasNavigation && currentIndex < items.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 bg-black/90 backdrop-blur-sm",
            isFullscreen && "bg-black",
            className,
          )}
          onClick={onClose}
        >
          {/* Navigation */}
          {hasNavigation && (
            <>
              {/* Previous Button */}
              <AnimatePresence>
                {canGoPrevious && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrevious?.();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Next Button */}
              <AnimatePresence>
                {canGoNext && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext?.();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Top Controls */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-4 right-4 z-60 flex items-center justify-between"
            >
              {/* Image Counter */}
              {hasNavigation && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 text-white text-sm rounded-lg">
                  <span>
                    {currentIndex + 1} / {items.length}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 px-2 py-1.5 bg-black/50 text-white rounded-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoom((prev) => Math.max(prev / 1.2, 0.1));
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs px-2 min-w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoom((prev) => Math.min(prev * 1.2, 5));
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Other Controls */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRotation((prev) => prev + 90);
                  }}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(!isFullscreen);
                  }}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="flex h-full">
            {/* Image Container */}
            <div
              className={cn(
                "flex-1 flex items-center justify-center p-4",
                !isFullscreen && showDetails && "pr-80",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-full max-h-full"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Details Panel */}
            <AnimatePresence>
              {!isFullscreen && showDetails && (
                <motion.div
                  initial={{ opacity: 0, x: 320 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 320 }}
                  className="absolute right-0 top-0 w-80 h-full bg-background border-l border-border overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">
                        {t("pages.gallery.imageDetails.title")}
                      </h2>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground">
                          {t("pages.generation.details.prompt")}
                        </h3>
                        <button
                          onClick={() => onCopyPrompt?.(item.prompt)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>

                    {/* Generation Details */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground">
                        {t("pages.generation.details.generationInfo")}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("pages.generation.details.style")}:
                          </span>
                          <span className="text-foreground">{item.style}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("pages.generation.details.aspectRatio")}:
                          </span>
                          <span className="text-foreground">
                            {item.aspectRatio}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("pages.generation.details.created")}:
                          </span>
                          <span className="text-foreground">
                            {new Intl.DateTimeFormat(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(item.createdAt))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Colors */}
                    {item.colors && item.colors.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground">
                          {t("pages.generation.details.colors")}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {item.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 border border-border rounded-lg"
                            >
                              <div
                                className="w-6 h-6 rounded-full border border-border"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs text-muted-foreground font-mono">
                                {color}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground">
                        {t("pages.gallery.imageDetails.actions")}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => onDownload?.(item)}
                          size="sm"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t("common.buttons.download")}
                        </Button>
                        <Button
                          onClick={() => onShare?.(item)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          {t("common.buttons.share")}
                        </Button>
                      </div>
                      <Button
                        onClick={() => onLike?.(item)}
                        variant={item.isLiked ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4 mr-2",
                            item.isLiked && "fill-current",
                          )}
                        />
                        {item.isLiked
                          ? t("pages.gallery.actions.unlike")
                          : t("pages.gallery.actions.like")}
                      </Button>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="space-y-3 pt-6 border-t border-border">
                      <h3 className="text-sm font-medium text-foreground">
                        {t("pages.gallery.imageDetails.shortcuts")}
                      </h3>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>←/→</span>
                          <span>{t("pages.gallery.shortcuts.navigate")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>+/-</span>
                          <span>{t("pages.gallery.shortcuts.zoom")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>R</span>
                          <span>{t("pages.gallery.shortcuts.rotate")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>0</span>
                          <span>{t("pages.gallery.shortcuts.reset")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>I</span>
                          <span>{t("pages.gallery.shortcuts.toggleInfo")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>F</span>
                          <span>{t("pages.gallery.shortcuts.fullscreen")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ESC</span>
                          <span>{t("pages.gallery.shortcuts.close")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Details Button (when hidden) */}
            {!isFullscreen && !showDetails && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setShowDetails(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
