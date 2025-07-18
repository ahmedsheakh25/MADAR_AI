import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Zap,
  Filter,
  ChevronUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/design-system";
import { useTranslation } from "@/hooks/use-translation";
import { useGallery } from "@/hooks/use-api";
import type { GalleryImage } from "@shared/api";

const FILTER_OPTIONS = [
  { id: "all", label: "All scenes", active: true, shortcut: "⌘ 0" },
  { id: "designs", label: "Designs", active: false, shortcut: "⌘ -" },
  { id: "animation", label: "Animation", active: false, shortcut: "⌘ +" },
];

export default function Gallery() {
  const { t } = useTranslation();
  const { getGallery, isLoading } = useGallery();

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const SORT_OPTIONS = [
    {
      id: "newest",
      label: t("pages.gallery.filters.newest"),
      active: true,
      shortcut: "⌘ 0",
    },
    {
      id: "oldest",
      label: t("pages.gallery.filters.oldest"),
      active: false,
      shortcut: "⌘ 0",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [undoDisabled] = useState(true);

  // Load gallery images on component mount
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setIsLoadingImages(true);
        const result = await getGallery(50, 0);
        setGalleryImages(result.images);
      } catch (error) {
        console.error("Failed to load gallery:", error);
        setGalleryImages([]);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadGallery();
  }, [getGallery]);

  return (
    <div className="min-h-screen bg-background dark:bg-background font-inter">
      {/* Topbar */}
      <div className="flex items-center justify-between w-full px-5 py-5 border-b border-border dark:border-border bg-background dark:bg-background">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Undo/Redo */}
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                undoDisabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-accent dark:hover:bg-accent"
              }`}
              disabled={undoDisabled}
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent dark:bg-accent hover:bg-accent/80 dark:hover:bg-accent/80 transition-all">
              <ArrowRight className="w-5 h-5 text-foreground dark:text-foreground" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center justify-between w-65 h-10 px-2.5 py-1 rounded-xl border border-border dark:border-border bg-muted dark:bg-muted">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 p-2 rounded-lg">
                <Search className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="bg-transparent text-xs font-medium text-muted-foreground dark:text-muted-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground border-none outline-none flex-1"
              />
            </div>
            <div className="flex items-center justify-center px-1.5 py-0.5 rounded-md bg-accent dark:bg-accent text-xs font-medium text-muted-foreground dark:text-muted-foreground">
              ⌘ K
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <div className="relative w-10 h-10">
            <button className="flex items-center justify-center w-10 h-10 p-2.5 rounded-lg hover:bg-accent dark:hover:bg-accent transition-all">
              <Zap className="w-5 h-5 text-foreground dark:text-foreground" />
            </button>
            <div className="absolute top-1 right-2 w-1 h-1 rounded-full bg-destructive"></div>
          </div>

          {/* Create Button */}
          <Button className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-border to-border/80 dark:from-border dark:to-border/80 text-foreground dark:text-foreground text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
            Create
          </Button>

          {/* User Avatar */}
          <div className="flex items-center justify-center w-10 h-10 p-1">
            <div className="w-8 h-8 rounded-full bg-primary overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col items-center w-full max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-12 py-4">
          <h1 className="text-xl font-medium text-foreground dark:text-foreground">
            My Scenes
          </h1>

          {/* Filter */}
          <div className="relative w-34 h-10">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between w-34 px-2 py-2 rounded-xl border border-border dark:border-border bg-muted dark:bg-muted h-10 hover:bg-accent dark:hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-1">
                <div className="flex items-center justify-center p-1">
                  <Filter className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground dark:text-foreground">
                  All scenes
                </span>
              </div>
              <div className="flex items-center justify-center p-1">
                <ChevronUp className="w-4 h-4 text-foreground dark:text-foreground" />
              </div>
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-12 -left-1.5 w-43 rounded-2xl border border-border dark:border-border bg-background dark:bg-background shadow-2xl backdrop-blur-md z-10">
                <div className="flex flex-col p-2">
                  {FILTER_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between h-9 px-2 py-1.5 rounded-xl hover:bg-accent dark:hover:bg-accent cursor-pointer"
                    >
                      <div className="flex items-center gap-1 flex-1">
                        <div className="flex items-center justify-center p-1 rounded-md">
                          {option.active && (
                            <Check className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-foreground dark:text-foreground">
                          {option.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-8 px-1.5 py-0.5 rounded-md bg-accent dark:bg-accent text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                        {option.shortcut}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border dark:border-border p-2">
                  {SORT_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between h-9 px-2 py-1.5 rounded-xl hover:bg-accent dark:hover:bg-accent cursor-pointer"
                    >
                      <div className="flex items-center gap-1 flex-1">
                        <div className="flex items-center justify-center p-1 rounded-md">
                          {option.active && (
                            <Check className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-foreground dark:text-foreground">
                          {option.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-8 px-1.5 py-0.5 rounded-md bg-accent dark:bg-accent text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                        {option.shortcut}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-wrap justify-center items-start gap-3 w-full px-12 pb-12">
          {/* Loading State */}
          {isLoadingImages && (
            <div className="flex items-center justify-center w-full py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Loading your gallery...
                </p>
              </div>
            </div>
          )}

          {/* Gallery Images */}
          {!isLoadingImages &&
            galleryImages.length > 0 &&
            galleryImages.map((image) => (
              <div
                key={image.id}
                className="flex flex-col items-start gap-0 min-w-[260px] flex-1 p-2 rounded-3xl border border-border dark:border-border bg-background dark:bg-background relative group hover:shadow-lg transition-all duration-300"
              >
                <div className="w-full h-[238px] relative rounded-2xl overflow-hidden">
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="text-[rgb(2,8,23)] bg-black font-normal text-base leading-6 font-inter">
                    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden overscroll-none touch-pan-x touch-pan-y font-normal" />
                  </div>
                </div>

                {/* Card Info */}
                <div className="flex flex-col items-start gap-1 w-full p-3">
                  <h3 className="text-xs font-semibold text-foreground dark:text-foreground truncate w-full">
                    {image.prompt.length > 40
                      ? `${image.prompt.substring(0, 40)}...`
                      : image.prompt}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground opacity-80 w-full">
                    {image.styleName} •{" "}
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

          {/* Empty State */}
          {!isLoadingImages && galleryImages.length === 0 && (
            <div className="text-center py-12 w-full">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
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
                <p className="text-lg text-muted-foreground mb-2">
                  No images in your gallery yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Generate some amazing 3D objects to see them here!
                </p>
              </div>
            </div>
          )}

          {/* Bottom Overlay */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background dark:from-background to-transparent backdrop-blur-xl pointer-events-none opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
