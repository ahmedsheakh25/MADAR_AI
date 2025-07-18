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
    <div className={cn("mx-auto max-w-2xl", className)}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          align: "center",
          direction: "rtl", // RTL support for Arabic layout
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="py-8 px-4">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={cn("basis-[60%] md:basis-[45%] lg:basis-[40%]")}
            >
              <Card
                className={cn(
                  "transition-all duration-700 ease-out border bg-card hover:shadow-2xl",
                  "rounded-xl overflow-hidden group cursor-pointer",
                  {
                    "scale-110 z-10 shadow-2xl border-primary/60 ring-2 ring-primary/20":
                      index === current,
                    "scale-95 opacity-75 border-border/50": index !== current,
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
              <div className="mt-4 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-all duration-500 font-arabic",
                    index === current
                      ? "text-primary font-semibold text-base"
                      : "text-muted-foreground",
                  )}
                >
                  {image.name}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom styled navigation buttons with RTL support */}
        <CarouselPrevious
          className={cn(
            "h-12 w-12 border-2 border-border/50 bg-background/90 backdrop-blur-sm",
            "hover:bg-accent hover:border-primary/50 transition-all duration-300",
            "shadow-lg hover:shadow-xl",
            // RTL positioning adjustments
            "start-2 end-auto [dir=rtl]:start-auto [dir=rtl]:end-2",
          )}
        />
        <CarouselNext
          className={cn(
            "h-12 w-12 border-2 border-border/50 bg-background/90 backdrop-blur-sm",
            "hover:bg-accent hover:border-primary/50 transition-all duration-300",
            "shadow-lg hover:shadow-xl",
            // RTL positioning adjustments
            "end-2 start-auto [dir=rtl]:end-auto [dir=rtl]:start-2",
          )}
        />
      </Carousel>

      {/* Custom dots indicator with better spacing */}
      <div className="flex justify-center gap-3 mt-8">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300 hover:scale-110",
              index === current
                ? "bg-primary w-8 shadow-lg"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2",
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
