"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import React from "react";

import { cn } from "../../lib/utils";
import { Button } from "../design-system/Button";
import { useTranslation } from "../../hooks/use-translation";
import { useNavigation } from "../navigation/hooks/useNavigation";
import { useAuth } from "../../hooks/use-auth";
import StyleCarousel from "./StyleCarousel";

const Hero211 = () => {
  const { t } = useTranslation();
  const { navigateToPath } = useNavigation();
  const { user, isDevMode } = useAuth();

  const handleGetStartedClick = () => {
    if (user) {
      navigateToPath({ path: "/generator" });
    } else {
      // Always redirect to login page since we're using dev auth
      navigateToPath({ path: "/login" });
    }
  };

  const images = [
    {
      src: "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F410a3151b0e04c31b16b2fa811b010d6?alt=media&token=0c7f06f3-7d62-4b04-b45b-9dd99bfa2aa7&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      alt: "3D Style Example 1",
      name: "Voxel 3D",
    },
    {
      src: "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Ff247b3d4ad5c42489a207df73147e781?alt=media&token=ef9f481e-cffd-4dee-8cf2-aadd19d75984&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      alt: "3D Style Example 2",
      name: "Clay 3D",
    },
    {
      src: "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc12cd84fc6ac457f87e4e84fa37e5d42?alt=media&token=6fd8b27f-2183-44b2-afdf-71079796d6c5&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      alt: "3D Style Example 3",
      name: "Low Poly",
    },
    {
      src: "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F76fbd13e4c7549a0b62438f39eef35a4?alt=media&token=05934085-674e-4985-9c54-c0a085edeca1&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      alt: "3D Style Example 4",
      name: "Cartoon 3D",
    },
    {
      src: "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc7f3b2331b3b4344a48def6baa70715b?alt=media&token=f762499c-39c3-44f2-ba79-99ab0d4d3177&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      alt: "3D Style Example 5",
      name: "Isometric",
    },
    {
      src: "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fa611edc775cd44bfb251ff0515872774?alt=media&token=3f9bfe10-0e70-461e-bf8f-90f3d1ad8c09&apiKey=3f900ffbafd84b58a77a4df01e4d869c",
      alt: "3D Style Example 6",
      name: "Pixel Art",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-4">
          <h1 className="text-center font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground break-words">
            {t("pages.homepage.hero.title")}
          </h1>
          <p className="px-4 sm:px-10 text-center text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl">
            {t("pages.homepage.hero.subtitle")}
          </p>
        </div>

        <div className="relative mt-12 sm:mt-16 flex h-full items-center justify-center">
          <StyleCarousel images={images} className="w-full max-w-2xl" />
        </div>

        <div className="relative z-10 mx-auto mt-8 sm:mt-10 flex w-fit justify-center">
          <Button
            className="rounded-full px-6 py-3 active:scale-105"
            onClick={handleGetStartedClick}
          >
            {t("pages.homepage.hero.getStarted")}
          </Button>
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="absolute -top-[18px] left-[150px] h-1 hidden sm:block"
          >
            <p className="font-caveat text-xl tracking-tight text-muted-foreground">
              {t("pages.homepage.hero.freeText")}
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
