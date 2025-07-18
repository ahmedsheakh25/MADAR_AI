import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
}

export function ColorPicker({ color, onChange, children }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Update HSL when color prop changes (external update)
  useEffect(() => {
    if (!isInternalUpdate.current) {
      const [h, s, l] = hexToHsl(color);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
    isInternalUpdate.current = false;
  }, [color]);

  // Handle internal HSL changes
  const handleHSLChange = useCallback(
    (newHue?: number, newSat?: number, newLight?: number) => {
      const h = newHue ?? hue;
      const s = newSat ?? saturation;
      const l = newLight ?? lightness;

      const newColor = hslToHex(h, s, l);
      if (newColor !== color) {
        isInternalUpdate.current = true;
        onChange(newColor);
      }
    },
    [hue, saturation, lightness, color, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg border shadow-lg z-50 min-w-[280px]"
            style={{
              borderColor: "var(--Stroke-01, #ECECEC)",
              backgroundColor: "var(--Surface-01, #FCFCFC)",
            }}
          >
            {/* Color Saturation/Lightness Picker */}
            <div
              className="relative w-full h-32 mb-4 rounded-lg cursor-crosshair"
              style={{
                background: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%)), linear-gradient(to top, #000, transparent)`,
                backgroundBlendMode: "multiply",
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const newSat = (x / rect.width) * 100;
                const newLight = 100 - (y / rect.height) * 100;
                setSaturation(newSat);
                setLightness(newLight);
                handleHSLChange(hue, newSat, newLight);
              }}
            >
              <div
                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-md pointer-events-none"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            {/* Hue Slider */}
            <div className="mb-4">
              <div
                className="relative w-full h-4 rounded-lg cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const newHue = (x / rect.width) * 360;
                  setHue(newHue);
                  handleHSLChange(newHue, saturation, lightness);
                }}
              >
                <div
                  className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    transform: "translate(-50%, 0)",
                  }}
                />
              </div>
            </div>

            {/* Preset Colors */}
            <div className="grid grid-cols-8 gap-2">
              {[
                "#FF0000",
                "#FF8000",
                "#FFFF00",
                "#80FF00",
                "#00FF00",
                "#00FF80",
                "#00FFFF",
                "#0080FF",
                "#0000FF",
                "#8000FF",
                "#FF00FF",
                "#FF0080",
                "#000000",
                "#404040",
                "#808080",
                "#C0C0C0",
              ].map((presetColor) => (
                <div
                  key={presetColor}
                  className="w-6 h-6 rounded border cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onChange(presetColor)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
