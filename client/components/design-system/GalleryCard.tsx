import * as React from "react";
import { motion } from "framer-motion";
import { Download, Heart, Share2, Eye, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface GalleryCardProps {
  id: number;
  src: string;
  prompt: string;
  style: string;
  createdAt: string;
  aspectRatio: string;
  likes?: number;
  views?: number;
  onDownload: (id: number) => void;
  onLike?: (id: number) => void;
  onShare?: (id: number) => void;
  className?: string;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  hover: {
    y: -8,
    scale: 1.02,
  },
};

const overlayVariants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
  },
};

const actionsVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  src,
  prompt,
  style,
  createdAt,
  aspectRatio,
  likes = 0,
  views = 0,
  onDownload,
  onLike,
  onShare,
  className,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(id);
  };

  const handleShare = () => {
    onShare?.(id);
  };

  const handleDownload = () => {
    onDownload(id);
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-xl",
        className,
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={src}
            alt={prompt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              onClick={handleShare}
              className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleLike}
              className={cn(
                "p-2 backdrop-blur-sm rounded-full transition-colors",
                isLiked
                  ? "bg-red-500/80 text-white"
                  : "bg-black/20 text-white hover:bg-black/40",
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </motion.button>
          </div>

          {/* Hover Actions Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={overlayVariants}
            initial="hidden"
            animate="hidden"
            whileHover="visible"
          >
            <motion.div variants={actionsVariants} className="flex gap-3">
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-white/90 text-black hover:bg-white backdrop-blur-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs">
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <Eye className="w-3 h-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <Heart className="w-3 h-3" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-2 text-white/90 leading-relaxed">
          {prompt}
        </h3>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <span className="font-medium">{style}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{createdAt}</span>
          </div>
        </div>

        {/* Aspect Ratio Badge */}
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
            {aspectRatio}
          </span>

          {/* Quick action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Subtle border animation */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 3s ease infinite",
        }}
      />
    </motion.div>
  );
};

// Add the gradient animation to global CSS or use a style tag
const gradientAnimation = `
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Inject the animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = gradientAnimation;
  document.head.appendChild(style);
}
