import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Image as ImageIcon,
  Star,
  Filter,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for demonstration
const MOCK_IMAGES = [
  {
    id: 1,
    src: "/placeholder.svg",
    prompt: "3D pixel character design",
    style: "3D Pixel Isometric",
    createdAt: "2024-01-15",
    aspectRatio: "1:1",
  },
  {
    id: 2,
    src: "/placeholder.svg",
    prompt: "Minimal icon with glass effect",
    style: "Glass Morphism",
    createdAt: "2024-01-14",
    aspectRatio: "3:2",
  },
  {
    id: 3,
    src: "/placeholder.svg",
    prompt: "Neon toy figurine design",
    style: "Neon Glow",
    createdAt: "2024-01-13",
    aspectRatio: "2:3",
  },
];

export default function Gallery() {
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
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">م</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Madar
                  </h1>
                  <p className="text-xs text-muted-foreground font-arabic">
                    مدار
                  </p>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                المولد
              </Link>
              <span className="text-sm text-foreground font-medium">
                معرض أعمالي
              </span>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  تسجيل الخروج
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-arabic">معرض أعمالي</h1>
            <p className="text-muted-foreground font-arabic">
              جميع التصاميم التي قمت بإنشائها باستخدام الذكاء الاصطناعي
            </p>
          </div>

          <Link to="/">
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
              <ArrowRight className="w-4 h-4 me-2 flip-for-rtl" />
              <span className="font-arabic">العودة للمولد</span>
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass"
              placeholder="ابحث في تصاميمك..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-arabic">تصفية</span>
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
  return (
    <Card className="glass gradient-border">
      <CardContent className="py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <ImageIcon className="w-12 h-12 text-primary" />
        </div>

        {searchQuery ? (
          <>
            <h3 className="text-xl font-semibold mb-2">لم نجد نتائج للبحث</h3>
            <p className="text-muted-foreground mb-6 font-arabic">
              لم نجد أي تصاميم تحتوي على "{searchQuery}"
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2 font-arabic">
              لا توجد تصاميم بعد
            </h3>
            <p className="text-muted-foreground mb-6 font-arabic">
              ابدأ في إنشاء تصاميمك الأولى باستخدام الذكاء الاصطناعي
            </p>
          </>
        )}

        <Link to="/">
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
            <Star className="w-4 h-4 mr-2" />
            <span className="font-arabic">ابدأ التصميم الآن</span>
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
                  <h3 className="font-semibold truncate mb-1">
                    {image.prompt}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-arabic">{image.style}</span>
                    <span>{image.aspectRatio}</span>
                    <span>{image.createdAt}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onDownload(image.id)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="font-arabic">تحميل</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <Card key={image.id} className="glass gradient-border group">
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <img
                src={image.src}
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  onClick={() => onDownload(image.id)}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="font-arabic">تحميل</span>
                </Button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">
                {image.prompt}
              </h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-arabic">{image.style}</span>
                <span>{image.createdAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
