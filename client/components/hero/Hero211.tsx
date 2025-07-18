"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import React from "react";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { cn } from "../../lib/utils";
import { Button } from "../design-system/Button";

const Hero211 = () => {
  const images = [
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/random11.jpeg",
      alt: "Portrait of Joanna Doe in urban setting",
      name: "Joanna Doe",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/random1.jpeg",
      alt: "Portrait of Joan Doe in natural lighting",
      name: "Joan Doe",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/random2.jpeg",
      alt: "Portrait of Sarah Chen in studio setting",
      name: "Sarah Chen",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person1.jpeg",
      alt: "Portrait of Joanna Doe in urban setting",
      name: "Joanna Doe",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person2.jpeg",
      alt: "Portrait of Joan Doe in natural lighting",
      name: "Joan Doe",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person3.jpeg",
      alt: "Portrait of Sarah Chen in studio setting",
      name: "Sarah Chen",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person4.jpeg",
      alt: "Portrait of Joanna Doe in urban setting",
      name: "Joanna Doe",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw11.jpeg",
      alt: "Portrait of Joan Doe in natural lighting",
      name: "Joan Doe",
    },
  ];

  const css = `
  .swiper {
    width: 250px;
    height: 280px;
    border-radius: 20px;
    background-color: hsl(var(--card));
    border: 1px solid hsl(var(--border));
  }
  
    @media (min-width: 768px) {
    .swiper {
      width: 280px;
      height: 310px;
      border-radius: 25px;
    }
  }

  @media (min-width: 1440px) {
    .swiper {
      width: 300px;
      height: 330px;
      border-radius: 30px;
    }
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    color: hsl(var(--card-foreground));
    border-radius: 25px;
    background-color: hsl(var(--card));
  }

  .swiper-pagination-bullet {
    background-color: hsl(var(--muted-foreground));
    opacity: 0.5;
  }

  .swiper-pagination-bullet-active {
    background-color: hsl(var(--primary));
    opacity: 1;
  }
`;

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-24 md:py-32">
      <style>{css}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-4">
          <h1 className="text-center font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground break-words">
            Create Amazing 3D Objects with AI
          </h1>
          <p className="px-4 sm:px-10 text-center text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl">
            Transform your ideas into stunning 3D models using advanced AI
            technology. Upload reference images and generate professional 3D
            content instantly.
          </p>
        </div>

        <div className="relative mt-12 sm:mt-16 flex h-full items-center justify-center">
          <Swiper
            loop={true}
            grabCursor={true}
            className="border border-border bg-card max-w-full"
            autoplay={{
              delay: 1500,
              disableOnInteraction: true,
            }}
            effect="creative"
            pagination={{
              clickable: true,
            }}
            creativeEffect={{
              prev: {
                shadow: true,
                origin: "left center",
                translate: ["-5%", 0, -200],
                rotate: [0, 100, 0],
              },
              next: {
                origin: "right center",
                translate: ["5%", 0, -200],
                rotate: [0, -100, 0],
              },
            }}
            modules={[EffectCreative, Pagination, Autoplay]}
          >
            {images.map((image, idx) => (
              <SwiperSlide key={idx}>
                <img
                  className="h-full w-full object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="relative z-10 mx-auto mt-8 sm:mt-10 flex w-fit justify-center">
          <Button className="rounded-full px-6 py-3 active:scale-105">
            Get Started
          </Button>
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="absolute -top-[18px] left-[150px] h-1 hidden sm:block"
          >
            <p className="font-caveat text-xl tracking-tight text-muted-foreground">
              Its 100% Free!
            </p>
            <svg
              width="82"
              className="-translate-x-1/2 pr-4 text-foreground"
              height="45"
              viewBox="0 0 82 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                d="M80.2759 1.95576C67.8687 20.6075 49.1102 55.0246 21.9767 39.1283C15.3299 35.2342 12.7124 29.0489 9.38472 22.4634C9.24096 22.1789 6.96955 15.0574 7.91833 15.4904C10.4589 16.65 25.535 23.253 15.8013 18.8782C14.7716 18.4154 8.31018 14.0924 7.25323 14.6265C4.37354 16.0816 2.6512 30.2469 1.58546 33.4898"
                stroke="currentColor"
                strokeWidth="2.40332"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 overflow-hidden">
          <SkiperUiMarquee />
        </div>
      </div>
    </section>
  );
};

export { Hero211 };

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: unknown;
}

function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row ![animation-duration:10s]": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

function Card() {
  const id = useId();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { delay: Math.random() * 2, ease: "easeOut", duration: 1 },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      key={id}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn(
        "relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer overflow-hidden rounded-2xl border p-3 sm:p-4",
        "border-border bg-card",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
      )}
    ></motion.div>
  );
}

export function SkiperUiMarquee() {
  return (
    <div className="mx-auto px-4 py-8 sm:py-12 md:px-8">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex w-full flex-col items-center justify-center"
            >
              <Marquee reverse repeat={5}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Card key={idx} />
                ))}
              </Marquee>
            </div>
          ))}
          <div className="absolute right-0 h-full w-16 sm:w-24 bg-gradient-to-r from-transparent to-background to-70%" />
          <div className="absolute left-0 h-full w-16 sm:w-24 bg-gradient-to-l from-transparent to-background to-70%" />
          <div className="absolute bottom-0 h-24 sm:h-36 w-full bg-gradient-to-b from-transparent to-background to-70%" />
        </div>
      </div>
    </div>
  );
}

export default Hero211;
