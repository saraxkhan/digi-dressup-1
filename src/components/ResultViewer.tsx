import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RotateCcw, Share2, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompareSlider from "./CompareSlider";
import View360 from "./View360";
import StyleScore from "./StyleScore";
import ColorVariants from "./ColorVariants";
import Lookbook from "./Lookbook";
import CommunityFeed from "./CommunityFeed";

interface ResultViewerProps {
  personImage: string;
  resultImage: string;
  clothingOptions: { type: string; clothingItem?: string; fabricType?: string; intendedOutfit?: string };
  sizeOptions: { size: string; fit: string };
  onReset: () => void;
}

type Tab = "result" | "compare" | "360" | "score" | "community";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "result", label: "Result", icon: "✦" },
  { id: "compare", label: "Compare", icon: "◫" },
  { id: "360", label: "360°", icon: "⟳" },
  { id: "score", label: "Score", icon: "★" },
  { id: "community", label: "Votes", icon: "♡" },
];

const ResultViewer: React.FC<ResultViewerProps> = ({ personImage, resultImage, clothingOptions, sizeOptions, onReset }) => {
  const [tab, setTab] = useState<Tab>("result");
  const [showLookbook, setShowLookbook] = useState(false);
  const [activeVariantFilter, setActiveVariantFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string>("");

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `dressai-result-${Date.now()}.png`;
    a.click();
  };

  const handleShare = async () => {
    try {
      const res = await fetch(resultImage);
      const blob = await res.blob();
      const file = new File([blob], "look.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "My AI Try-On", files: [file] });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch { handleDownload(); }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 bg-secondary/60 backdrop-blur-xl rounded-2xl p-1 border border-border/40">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition-all ${
              tab === t.id
                ? "bg-card text-foreground shadow-sm border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden sm:inline">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "result" && (
          <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div
              className="rounded-2xl overflow-hidden border border-border/60 aspect-[3/4] max-h-[60vh] relative"
            >
              <img
                src={resultImage}
                alt="Try-on result"
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: colorFilter }}
              />
              {activeVariantFilter && (
                <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/80">
                  {activeVariantFilter}
                </div>
              )}
            </div>
            <ColorVariants
              resultImage={resultImage}
              onVariantSelect={(name, _) => {
                if (name === "Original") { setColorFilter(""); setActiveVariantFilter(null); }
                else {
                  const colors: Record<string, string> = {
                    Navy: "hue-rotate(220deg) saturate(1.2) brightness(0.7)",
                    Burgundy: "hue-rotate(340deg) saturate(1.4) brightness(0.75)",
                    Forest: "hue-rotate(120deg) saturate(1.3) brightness(0.75)",
                    Camel: "hue-rotate(30deg) saturate(0.7) brightness(1.1) sepia(0.4)",
                    Chalk: "saturate(0.15) brightness(1.35)",
                    Slate: "hue-rotate(210deg) saturate(0.4) brightness(0.85)",
                    Coral: "hue-rotate(10deg) saturate(1.5) brightness(0.95)",
                  };
                  setColorFilter(colors[name] || "");
                  setActiveVariantFilter(name);
                }
              }}
            />
          </motion.div>
        )}

        {tab === "compare" && (
          <motion.div key="compare" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CompareSlider beforeImage={personImage} afterImage={resultImage} />
          </motion.div>
        )}

        {tab === "360" && (
          <motion.div key="360" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <View360 image={resultImage} />
            <p className="text-xs text-muted-foreground text-center mt-2">
              360° uses perspective simulation — drag left/right to rotate
            </p>
          </motion.div>
        )}

        {tab === "score" && (
          <motion.div key="score" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StyleScore resultImage={resultImage} clothingOptions={clothingOptions} sizeOptions={sizeOptions} />
          </motion.div>
        )}

        {tab === "community" && (
          <motion.div key="community" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CommunityFeed />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleDownload} className="glow-primary">
          <Download className="w-4 h-4 mr-2" /> Download
        </Button>
        <Button onClick={handleShare} variant="secondary">
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
        <Button onClick={() => setShowLookbook(s => !s)} variant="secondary" className={showLookbook ? "border-primary/40 text-primary" : ""}>
          <BookOpen className="w-4 h-4 mr-2" /> Lookbook
        </Button>
        <Button onClick={onReset} variant="secondary">
          <RotateCcw className="w-4 h-4 mr-2" /> Try Another
        </Button>
      </div>

      {/* Lookbook */}
      <AnimatePresence>
        {showLookbook && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Lookbook currentImage={resultImage} onClose={() => setShowLookbook(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultViewer;
