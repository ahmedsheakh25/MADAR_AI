import { useState, useRef } from "react";
import { motion } from "framer-motion";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;

    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  // Add global mouse event listeners when dragging
  if (typeof window !== "undefined") {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  }

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 bg-gray-200 rounded-full cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
      style={{ backgroundColor: "var(--Surface-03, #F1F1F1)" }}
    >
      {/* Track */}
      <div
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
        style={{
          width: `${percentage}%`,
          backgroundColor: "var(--Text-Primary, #121212)",
        }}
      />

      {/* Thumb */}
      <motion.div
        className="absolute top-1/2 w-4 h-4 bg-white border-2 rounded-full shadow-sm cursor-grab active:cursor-grabbing"
        style={{
          left: `${percentage}%`,
          transform: "translate(-50%, -50%)",
          borderColor: "var(--Text-Primary, #121212)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isDragging ? 1.2 : 1,
        }}
      />
    </div>
  );
}
