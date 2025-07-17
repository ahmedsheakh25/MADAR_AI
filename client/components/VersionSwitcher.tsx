import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function VersionSwitcher() {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-40 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg"
    >
      <div className="flex gap-2">
        <Link
          to="/"
          className={`px-3 py-1 rounded text-sm transition-colors ${
            location.pathname === "/"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          Once UI
        </Link>
        <Link
          to="/original"
          className={`px-3 py-1 rounded text-sm transition-colors ${
            location.pathname === "/original"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          Original
        </Link>
      </div>
    </motion.div>
  );
}
