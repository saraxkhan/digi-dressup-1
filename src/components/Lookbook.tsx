import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LookbookItem {
  id: string;
  image: string;
  label: string;
  timestamp: number;
}

interface LookbookProps {
  currentImage: string | null;
  onClose: () => void;
}

const STORAGE_KEY = "dressai_lookbook";

const Lookbook: React.FC<LookbookProps> = ({ currentImage, onClose }) => {
  const [items, setItems] = useState<LookbookItem[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (newItems: LookbookItem[]) => {
    setItems(newItems);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems)); } catch {}
  };

  const addCurrent = () => {
    if (!currentImage) return;
    const item: LookbookItem = {
      id: Date.now().toString(),
      image: currentImage,
      label: `Look ${items.length + 1}`,
      timestamp: Date.now(),
    };
    save([...items, item]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const remove = (id: string) => save(items.filter(i => i.id !== id));

  const downloadAll = () => {
    items.forEach((item, idx) => {
      const a = document.createElement("a");
      a.href = item.image;
      a.download = `look-${idx + 1}.png`;
      a.click();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-foreground">My Lookbook</h3>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">{items.length}</span>
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <Button size="sm" variant="ghost" onClick={downloadAll} className="h-7 text-xs gap-1">
              <Download className="w-3 h-3" /> All
            </Button>
          )}
          {currentImage && (
            <Button size="sm" onClick={addCurrent} className="h-7 text-xs gap-1 glow-primary">
              {saved ? "✓ Saved!" : <><Plus className="w-3 h-3" /> Save Look</>}
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No looks saved yet. Save this result to build your lookbook!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="lookbook-item relative group rounded-xl overflow-hidden aspect-[3/4] bg-secondary"
              >
                <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button onClick={() => remove(item.id)} className="p-1.5 rounded-full bg-red-500/80 text-white">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white/90 text-center font-medium">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Lookbook;
