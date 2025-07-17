import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Image as ImageIcon,
  Star,
  Filter,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  GalleryCard,
  Heading,
  Text,
  Badge,
  Flex,
} from "@/components/design-system";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";

// Mock data for demonstration
const MOCK_IMAGES = [
  {
    id: 1,
    src: "/placeholder.svg",
    prompt:
      "3D pixel character design with vibrant colors and geometric shapes",
    style: "3D Pixel Isometric",
    createdAt: "2024-01-15",
    aspectRatio: "1:1",
    likes: 42,
    views: 156,
  },
  {
    id: 2,
    src: "/placeholder.svg",
    prompt: "Minimal icon with glass effect and subtle gradients",
    style: "Glass Morphism",
    createdAt: "2024-01-14",
    aspectRatio: "3:2",
    likes: 28,
    views: 89,
  },
  {
    id: 3,
    src: "/placeholder.svg",
    prompt: "Neon toy figurine design with glowing accents",
    style: "Neon Glow",
    createdAt: "2024-01-13",
    aspectRatio: "2:3",
    likes: 67,
    views: 203,
  },
];

export default function Gallery() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [images] = useState(MOCK_IMAGES);

  const filteredImages = images.filter((img) =>
    img.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownload = (imageId: number) => {
    // Download logic would go here
    console.log("Downloading image:", imageId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header removed - navigation moved to dock */}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Heading as="h1" size="3xl" className="mb-2 font-arabic">
            {t("pages.gallery.title")}
          </Heading>
          <Text size="lg" className="text-muted-foreground font-arabic">
            {t("pages.gallery.subtitle")}
          </Text>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 glass"
              placeholder={t("pages.gallery.searchPlaceholder")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              animate
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              animate
            >
              <List className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" animate>
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-arabic">{t("common.buttons.filter")}</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredImages.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <ImageGrid
            images={filteredImages}
            viewMode={viewMode}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  const { t } = useTranslation();

  return (
    <Card className="glass gradient-border">
      <CardContent className="py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ImageIcon className="w-12 h-12 text-primary" />
        </div>

        {searchQuery ? (
          <>
            <Heading as="h3" size="xl" className="mb-2">
              {t("pages.gallery.emptyState.noResults")}
            </Heading>
            <Text size="lg" className="text-muted-foreground mb-6 font-arabic">
              {t("pages.gallery.emptyState.noResultsText", {
                searchQuery: searchQuery,
              })}
            </Text>
          </>
        ) : (
          <>
            <Heading as="h3" size="xl" className="mb-2 font-arabic">
              {t("pages.gallery.emptyState.noDesigns")}
            </Heading>
            <Text size="lg" className="text-muted-foreground mb-6 font-arabic">
              {t("pages.gallery.emptyState.noDesignsText")}
            </Text>
          </>
        )}

        <Link to="/">
          <Button variant="gradient" animate>
            <Star className="w-4 h-4 mr-2" />
            <span className="font-arabic">
              {t("common.buttons.startDesigning")}
            </span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ImageGrid({
  images,
  viewMode,
  onDownload,
}: {
  images: typeof MOCK_IMAGES;
  viewMode: "grid" | "list";
  onDownload: (id: number) => void;
}) {
  const { t } = useTranslation();

  const handleLike = (id: number) => {
    console.log("Liked image:", id);
  };

  const handleShare = (id: number) => {
    console.log("Shared image:", id);
  };

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {images.map((image) => (
          <Card key={image.id} className="glass gradient-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={image.src}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>

                                  <div className="flex-1 min-w-0">
                    <Heading as="h3" size="md" className="truncate mb-1">
                      {image.prompt}
                    </Heading>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="font-arabic">
                        {image.style}
                      </Badge>
                      <Text size="sm">{image.aspectRatio}</Text>
                      <Text size="sm">{image.createdAt}</Text>
                    </div>
                  </div>

                  <Button
                    onClick={() => onDownload(image.id)}
                    variant="outline"
                    size="sm"
                    animate
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span className="font-arabic">
                      {t("common.buttons.download")}
                    </span>
                  </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {images.map((image) => (
        <GalleryCard
          key={image.id}
          id={image.id}
          src={image.src}
          prompt={image.prompt}
          style={image.style}
          createdAt={image.createdAt}
          aspectRatio={image.aspectRatio}
          likes={image.likes}
          views={image.views}
          onDownload={onDownload}
          onLike={handleLike}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}
