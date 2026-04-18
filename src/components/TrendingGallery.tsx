import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Check } from "lucide-react";

interface TrendingItem {
  id: string;
  url: string;
  label: string;
  category: string;
}

// Using picsum + unsplash-style placeholder outfits
const TRENDING: TrendingItem[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80", label: "Linen Suit", category: "Formal" },
  { id: "2", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80", label: "Summer Dress", category: "Casual" },
  { id: "3", url: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=300&q=80", label: "Denim Jacket", category: "Street" },
  { id: "4", url: "https://images.unsplash.com/photo-1619603364853-34c3eda1e1a4?w=300&q=80", label: "Kurta Set", category: "Ethnic" },
  { id: "5", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80&sat=-100", label: "Monochrome", category: "Minimal" },
  { id: "6", url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&q=80", label: "Evening Gown", category: "Formal" },
  { id: "7", url: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=300&q=80", label: "Blazer", category: "Smart" },
  { id: "8", url: "https://images.unsplash.com/photo-1603217040956-45b34e85f4f5?w=300&q=80", label: "Track Suit", category: "Sport" },
];

const CATEGORIES = ["All", "Formal", "Casual", "Street", "Ethnic", "Minimal", "Sport"];

interface TrendingGalleryProps {
  onSelect: (imageUrl: string, label: string) => void;
  selected: string | null;
}

const TrendingGallery: React.FC<TrendingGalleryProps> = ({ onSelect, selected }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? TRENDING
    : TRENDING.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-accent" />
        <h3 className="font-display font-semibold text-sm text-foreground">Trending Outfits</h3>
        <span className="text-xs text-muted-foreground">— pick or upload your own</span>
      </div>
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scroll-hidden pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1 rounded-full flex-shrink-0 transition-all font-medium ${
              activeCategory === cat
                ? "bg-primary/20 text-primary border border-primary/40"
                : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        <AnimatePresence mode="popLayout">
          {filtered.map(item => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => onSelect(item.url, item.label)}
              className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all ${
                selected === item.url
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
              {selected === item.url && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-[10px] text-white/90 text-center font-medium leading-tight">{item.label}</p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrendingGallery;
