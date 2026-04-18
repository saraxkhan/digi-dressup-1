import React from "react";
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface SizeOptions {
  size: string;
  fit: string;
}

interface SizeSelectorProps {
  options: SizeOptions;
  onChange: (options: SizeOptions) => void;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const fits = ["Slim", "Regular", "Loose"];

const SizeSelector: React.FC<SizeSelectorProps> = ({ options, onChange }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-foreground">Size</h3>
        <ToggleGroup
          type="single"
          value={options.size}
          onValueChange={(v) => v && onChange({ ...options, size: v })}
          className="flex flex-wrap gap-2"
        >
          {sizes.map((s) => (
            <ToggleGroupItem
              key={s}
              value={s}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                options.size === s
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-foreground">Fit</h3>
        <ToggleGroup
          type="single"
          value={options.fit}
          onValueChange={(v) => v && onChange({ ...options, fit: v })}
          className="flex gap-2"
        >
          {fits.map((f) => (
            <ToggleGroupItem
              key={f}
              value={f}
              className={`flex-1 px-5 py-3 rounded-lg text-sm font-medium transition-all ${
                options.fit === f
                  ? "bg-accent text-accent-foreground glow-accent"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </motion.div>
  );
};

export default SizeSelector;
