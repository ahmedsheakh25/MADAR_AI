import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  Download,
  Eye,
  Trash2,
  Copy,
  Share2,
  Calendar,
  Palette,
  Wand2,
  Heart,
  MoreVertical,
} from "lucide-react";
import { Button } from "../design-system/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../design-system/DropdownMenu";
import { useTranslation } from "../../hooks/use-translation";
import { useAuth } from "../../hooks/use-auth";
import { cn } from "../../lib/utils";

export interface GalleryItem {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  colors?: string[];
  createdAt: Date;
  downloadUrl?: string;
  isLiked?: boolean;
  downloadCount?: number;
}

export interface GalleryGridProps {
  items: GalleryItem[];
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onItemClick?: (item: GalleryItem) => void;
  onDownload?: (item: GalleryItem) => void;
  onDelete?: (item: GalleryItem) => void;
  onLike?: (item: GalleryItem) => void;
  onShare?: (item: GalleryItem) => void;
  onCopyPrompt?: (prompt: string) => void;
  className?: string;
}

type ViewMode = "grid" | "list";
type SortBy = "newest" | "oldest" | "liked" | "downloaded";

export function GalleryGrid({
  items,
  isLoading = false,
  searchQuery = "",
  onSearchChange,
  onItemClick,
  onDownload,
  onDelete,
  onLike,
  onShare,
  onCopyPrompt,
  className,
}: GalleryGridProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  // Filter items based on search query
  const filteredItems = items.filter(
    (item) =>
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.style.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "liked":
        return (b.isLiked ? 1 : 0) - (a.isLiked ? 1 : 0);
      case "downloaded":
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      default:
        return 0;
    }
  });

  const handleItemAction = useCallback(
    (action: string, item: GalleryItem) => {
      switch (action) {
        case "view":
          onItemClick?.(item);
          break;
        case "download":
          onDownload?.(item);
          break;
        case "delete":
          onDelete?.(item);
          break;
        case "like":
          onLike?.(item);
          break;
        case "share":
          onShare?.(item);
          break;
        case "copy-prompt":
          onCopyPrompt?.(item.prompt);
          break;
      }
    },
    [onItemClick, onDownload, onDelete, onLike, onShare, onCopyPrompt],
  );

  // Show auth prompt if user not logged in
  if (!user) {
    return (
      <div className={cn("text-center py-12", className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Wand2 className="w-16 h-16 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold text-foreground">
            {t("pages.gallery.auth.title")}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("pages.gallery.auth.message")}
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            {t("common.buttons.signIn")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header with Search and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t("pages.gallery.searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* View Controls */}
          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {t(`pages.gallery.filters.${sortBy}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("pages.gallery.filters.newest")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("pages.gallery.filters.oldest")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("liked")}>
                  <Heart className="w-4 h-4 mr-2" />
                  {t("pages.gallery.filters.liked")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("downloaded")}>
                  <Download className="w-4 h-4 mr-2" />
                  {t("pages.gallery.filters.downloaded")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("pages.gallery.resultsCount", { count: sortedItems.length })}
          </span>
          {searchQuery && (
            <span>
              {t("pages.gallery.searchResults", { query: searchQuery })}
            </span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="aspect-square bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Wand2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery
              ? t("pages.gallery.emptyState.noResults")
              : t("pages.gallery.emptyState.noDesigns")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? t("pages.gallery.emptyState.noResultsText", {
                  searchQuery,
                })
              : t("pages.gallery.emptyState.noDesignsText")}
          </p>
          {!searchQuery && (
            <Button onClick={() => (window.location.href = "/generator")}>
              <Wand2 className="w-4 h-4 mr-2" />
              {t("pages.gallery.startCreating")}
            </Button>
          )}
        </motion.div>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === "grid" && sortedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div
                  className="aspect-square bg-muted cursor-pointer overflow-hidden"
                  onClick={() => handleItemAction("view", item)}
                >
                  <img
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4 mr-2" />
                      {t("common.buttons.view")}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.style}</span>
                      <span>•</span>
                      <span>{item.aspectRatio}</span>
                    </div>
                  </div>

                  {/* Colors */}
                  {item.colors && item.colors.length > 0 && (
                    <div className="flex gap-1">
                      {item.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleItemAction("like", item)}
                        className={cn(
                          "p-1 rounded transition-colors",
                          item.isLiked
                            ? "text-red-500 hover:text-red-600"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4",
                            item.isLiked && "fill-current",
                          )}
                        />
                      </button>
                      <button
                        onClick={() => handleItemAction("download", item)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleItemAction("view", item)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t("common.buttons.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleItemAction("copy-prompt", item)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t("pages.gallery.actions.copyPrompt")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleItemAction("share", item)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          {t("common.buttons.share")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleItemAction("delete", item)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("common.buttons.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Creation Date */}
                  <div className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* List View */}
      {!isLoading && viewMode === "list" && sortedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.02 }}
                className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div
                  className="w-20 h-20 bg-muted rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={() => handleItemAction("view", item)}
                >
                  <img
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-1">
                        {item.prompt}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.style}</span>
                        <span>•</span>
                        <span>{item.aspectRatio}</span>
                        <span>•</span>
                        <span>
                          {new Intl.DateTimeFormat().format(
                            new Date(item.createdAt),
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleItemAction("like", item)}
                        className={cn(
                          "p-2 rounded transition-colors",
                          item.isLiked
                            ? "text-red-500 hover:text-red-600"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4",
                            item.isLiked && "fill-current",
                          )}
                        />
                      </button>
                      <button
                        onClick={() => handleItemAction("download", item)}
                        className="p-2 rounded text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded text-muted-foreground hover:text-foreground transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleItemAction("view", item)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t("common.buttons.view")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleItemAction("copy-prompt", item)
                            }
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {t("pages.gallery.actions.copyPrompt")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleItemAction("share", item)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            {t("common.buttons.share")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleItemAction("delete", item)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("common.buttons.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Colors */}
                  {item.colors && item.colors.length > 0 && (
                    <div className="flex gap-1">
                      {item.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
