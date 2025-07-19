"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

interface StyleImage {
  src: string;
  alt: string;
  name: string;
}

interface StyleCarouselProps {
  images: StyleImage[];
  className?: string;
}

export default function StyleCarousel({
  images,
  className,
}: StyleCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true }),
  );

  return (
    <div className={cn("mx-auto w-full relative z-50", className)}>
      {/* Left fade overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-40 pointer-events-none" />

      {/* Right fade overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-40 pointer-events-none" />

      <Carousel
        setApi={setApi}
        className="w-full relative z-50"
        opts={{
          loop: true,
          align: "center",
          direction: "rtl", // RTL support for Arabic layout
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="py-4 sm:py-6 md:py-8 px-2 sm:px-4">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "basis-[70%] sm:basis-[60%] md:basis-[50%] lg:basis-[40%] xl:basis-[35%] pl-2 sm:pl-4",
              )}
            >
              <Card
                className={cn(
                  "transition-all duration-700 ease-out border bg-card hover:shadow-2xl relative",
                  "rounded-xl overflow-hidden group cursor-pointer",
                  {
                    "scale-105 sm:scale-110 z-20 shadow-2xl border-primary/60 ring-2 ring-primary/20":
                      index === current,
                    "scale-90 sm:scale-95 opacity-75 border-border/50 z-10":
                      index !== current,
                  },
                )}
              >
                <CardContent className="flex aspect-square items-center justify-center p-0 overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-700",
                      "group-hover:scale-105",
                      {
                        "brightness-110": index === current,
                        "brightness-90": index !== current,
                      },
                    )}
                    loading="lazy"
                  />
                </CardContent>
              </Card>

              {/* Style name indicator */}
              <div className="mt-3 sm:mt-4 text-center">
                <p
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-all duration-500 font-arabic",
                    index === current
                      ? "text-primary font-semibold text-sm sm:text-base"
                      : "text-muted-foreground",
                  )}
                >
                  {image.name}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom styled navigation buttons with RTL support and improved responsive design */}
        <CarouselPrevious
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 border-2 border-border/50 bg-background/90 backdrop-blur-sm z-30",
            "hover:bg-accent hover:border-primary/50 transition-all duration-300",
            "shadow-lg hover:shadow-xl",
            // RTL positioning adjustments with responsive spacing
            "start-1 sm:start-2 end-auto [dir=rtl]:start-auto [dir=rtl]:end-1 [dir=rtl]:sm:end-2",
            // Hide on very small screens to prevent overlap
            "hidden xs:flex",
          )}
        />
        <CarouselNext
          className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 border-2 border-border/50 bg-background/90 backdrop-blur-sm z-30",
            "hover:bg-accent hover:border-primary/50 transition-all duration-300",
            "shadow-lg hover:shadow-xl",
            // RTL positioning adjustments with responsive spacing
            "end-1 sm:end-2 start-auto [dir=rtl]:end-auto [dir=rtl]:start-1 [dir=rtl]:sm:start-2",
            // Hide on very small screens to prevent overlap
            "hidden xs:flex",
          )}
        />
      </Carousel>

      {/* Custom dots indicator with better responsive spacing */}
      <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 relative z-30">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all duration-300 hover:scale-110",
              index === current
                ? "bg-primary w-6 sm:w-8 shadow-lg"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5 sm:w-2",
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
