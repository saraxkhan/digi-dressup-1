import React, { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Loader2 } from "lucide-react";

interface ColorVariantsProps {
  resultImage: string;
  onVariantSelect: (colorName: string, filteredImage: string) => void;
}

const COLORS = [
  { name: "Original", hue: null, saturation: null, label: "OG" },
  { name: "Navy", css: "#1a2a4a", filter: "hue-rotate(220deg) saturate(1.2) brightness(0.7)" },
  { name: "Burgundy", css: "#5c1a2e", filter: "hue-rotate(340deg) saturate(1.4) brightness(0.75)" },
  { name: "Forest", css: "#1a3d2b", filter: "hue-rotate(120deg) saturate(1.3) brightness(0.75)" },
  { name: "Camel", css: "#c09050", filter: "hue-rotate(30deg) saturate(0.7) brightness(1.1) sepia(0.4)" },
  { name: "Chalk", css: "#e8e4de", filter: "saturate(0.15) brightness(1.35)" },
  { name: "Slate", css: "#4a5568", filter: "hue-rotate(210deg) saturate(0.4) brightness(0.85)" },
  { name: "Coral", css: "#d4604a", filter: "hue-rotate(10deg) saturate(1.5) brightness(0.95)" },
];

const ColorVariants: React.FC<ColorVariantsProps> = ({ resultImage, onVariantSelect }) => {
  const [selected, setSelected] = useState(0);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    const color = COLORS[idx];
    onVariantSelect(color.name, resultImage);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-accent" />
        <h3 className="font-display font-semibold text-sm text-foreground">Color Variants</h3>
        <span className="text-xs text-muted-foreground ml-auto">CSS filter preview</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {COLORS.map((color, idx) => (
          <button
            key={color.name}
            onClick={() => handleSelect(idx)}
            onMouseEnter={() => setHoveredFilter(color.filter || null)}
            onMouseLeave={() => setHoveredFilter(selected > 0 ? COLORS[selected].filter || null : null)}
            title={color.name}
            className={`relative w-8 h-8 rounded-full border-2 transition-all ${
              selected === idx
                ? "border-white scale-110 shadow-lg"
                : "border-border hover:border-white/50 hover:scale-105"
            }`}
            style={{
              background: idx === 0
                ? "conic-gradient(#e24b4a, #f09595, #faeeda, #97c459, #85b7eb, #afa9ec, #ed93b1, #e24b4a)"
                : color.css,
            }}
          />
        ))}
      </div>
      {/* Live preview */}
      {selected > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl overflow-hidden"
          style={{ maxHeight: 120 }}
        >
          <img
            src={resultImage}
            alt="Color variant"
            className="w-full h-28 object-cover object-top transition-all duration-300"
            style={{ filter: COLORS[selected].filter }}
          />
          <div className="bg-secondary/60 px-3 py-1 text-xs text-muted-foreground text-center">
            {COLORS[selected].name} — filter preview only; regenerate for AI result
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ColorVariants;
