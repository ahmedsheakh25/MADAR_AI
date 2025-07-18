import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface StyleCardProps {
  id: string;
  title: string;
  image: string;
  isSelected?: boolean;
  state?: "default" | "hover" | "active" | "skeleton";
  onClick?: () => void;
  className?: string;
}

export function StyleCard({
  id,
  title,
  image,
  isSelected = false,
  state = "default",
  onClick,
  className,
}: StyleCardProps) {
  const isSkeletonState = state === "skeleton";
  const isHoverState = state === "hover";
  const isActiveState = state === "active" || isSelected;

  return (
    <motion.div
      className={cn(
        "flex flex-col w-full max-w-[184px] rounded-2xl border transition-all duration-300 cursor-pointer group overflow-hidden relative",
        {
          "border-[var(--Stroke-01,#ECECEC)] bg-[var(--Surface-01,#FCFCFC)]":
            !isActiveState,
          "border-[#9013FE] bg-[var(--Surface-01,#FCFCFC)] shadow-lg ring-2 ring-purple-500/20":
            isActiveState,
          "hover:border-gray-300 hover:shadow-md": !isActiveState,
        },
        className,
      )}
      onClick={onClick}
      whileHover={{
        scale: isActiveState ? 1.02 : 1.05,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActiveState ? 1.02 : 1,
      }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      layout
    >
      {/* Selection Indicator */}
      {isActiveState && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{ backgroundColor: "rgba(144, 19, 254, 1)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: 0.1,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
        {isSkeletonState ? (
          <motion.div
            className="w-full h-full animate-pulse"
            style={{ backgroundColor: "var(--Surface-02, #F8F7F7)" }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : (
          <motion.div
            className="w-full h-full bg-center bg-cover bg-no-repeat relative overflow-hidden"
            style={{
              backgroundImage: `url('${image}')`,
              backgroundColor: "#F4F2EF",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            whileHover={{
              scale: 1.1,
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Style Badge */}
            <motion.div
              className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium opacity-0"
              style={{
                color: "var(--Text-Primary, #121212)",
                fontFamily: "Inter",
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Style
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Card Info */}
      <motion.div
        className={cn(
          "flex flex-col items-start gap-1 w-full transition-all duration-200",
          {
            "p-3": isHoverState || isActiveState,
            "py-1.5 px-3": !isHoverState && !isActiveState,
          },
        )}
        animate={{
          padding: isActiveState ? "12px" : "6px 12px",
        }}
        transition={{ duration: 0.2 }}
      >
        {isSkeletonState ? (
          <div className="h-4 w-full flex items-center">
            <motion.div
              className="h-2 w-32 rounded-sm"
              style={{ backgroundColor: "var(--Surface-03, #F1F1F1)" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        ) : (
          <motion.div
            className="w-full text-xs font-semibold leading-4 tracking-[-0.12px] overflow-hidden text-ellipsis line-clamp-1"
            style={{
              color: "var(--Text-Primary, #121212)",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
            }}
            animate={{
              fontWeight: isActiveState ? 700 : 600,
            }}
          >
            {title}
          </motion.div>
        )}
      </motion.div>

      {/* Interactive Glow Effect */}
      {!isSkeletonState && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 0.1,
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
          }}
          animate={{
            opacity: isActiveState ? 0.1 : 0,
            boxShadow: isActiveState
              ? "0 0 20px rgba(59, 130, 246, 0.3)"
              : "none",
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
