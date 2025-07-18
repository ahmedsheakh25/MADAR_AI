import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface SceneCardProps {
  title: string;
  image: string;
  state?: "default" | "hover" | "active" | "skeleton";
  onClick?: () => void;
  className?: string;
}

export function SceneCard({
  title,
  image,
  state = "default",
  onClick,
  className,
}: SceneCardProps) {
  const isSkeletonState = state === "skeleton";
  const isHoverState = state === "hover";
  const isActiveState = state === "active";

  return (
    <motion.div
      className={cn(
        "flex flex-col w-full max-w-[184px] rounded-2xl border transition-all duration-200 cursor-pointer group overflow-hidden",
        {
          "border-[var(--Stroke-01,#ECECEC)] bg-[var(--Surface-01,#FCFCFC)]":
            !isActiveState,
          "border-[var(--Text-Primary,#121212)] bg-[var(--Surface-01,#FCFCFC)] shadow-sm":
            isActiveState,
        },
        className,
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[184/140.62] rounded-2xl overflow-hidden">
        {isSkeletonState ? (
          <div
            className="w-full h-full animate-pulse"
            style={{ backgroundColor: "var(--Surface-02, #F8F7F7)" }}
          />
        ) : (
          <div
            className="w-full h-full bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${image}')`,
              backgroundColor: "#F4F2EF",
              backgroundSize: "61.6% 82.133%",
              backgroundPosition: "35.328px 13.221px",
            }}
          />
        )}
      </div>

      {/* Card Info */}
      <div
        className={cn(
          "flex flex-col items-start gap-1 w-full transition-all duration-200",
          {
            "p-3": isHoverState || isActiveState,
            "py-1.5 px-3": !isHoverState && !isActiveState,
          },
        )}
      >
        {isSkeletonState ? (
          <div className="h-4 w-full flex items-center">
            <div
              className="h-2 w-32 rounded-sm animate-pulse"
              style={{ backgroundColor: "var(--Surface-03, #F1F1F1)" }}
            />
          </div>
        ) : (
          <div
            className="w-full text-xs font-semibold leading-4 tracking-[-0.12px] overflow-hidden text-ellipsis line-clamp-1"
            style={{
              color: "var(--Text-Primary, #121212)",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            {title}
          </div>
        )}
      </div>
    </motion.div>
  );
}
