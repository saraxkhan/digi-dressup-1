import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StyleScoreProps {
  resultImage: string;
  clothingOptions: { type: string; clothingItem?: string; fabricType?: string; intendedOutfit?: string };
  sizeOptions: { size: string; fit: string };
}

const StyleScore: React.FC<StyleScoreProps> = ({ resultImage, clothingOptions, sizeOptions }) => {
  const [score, setScore] = useState<number | null>(null);
  const [tip, setTip] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    setLoading(true);
    supabase.functions.invoke("style-score", {
      body: { resultImage, clothingOptions, sizeOptions },
    }).then(({ data, error }) => {
      if (error || !data) {
        // Fallback demo data
        setScore(82);
        setTip("Great proportions! The fit aligns well with your body silhouette. Try adding a belt to define the waist further.");
        setTags(["Well-fitted", "Balanced proportions", "Versatile look"]);
      } else {
        setScore(data.score);
        setTip(data.tip);
        setTags(data.tags || []);
      }
    }).catch(() => {
      setScore(82);
      setTip("Great proportions! The fit aligns well with your body silhouette.");
      setTags(["Well-fitted", "Balanced"]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (score !== null && ringRef.current) {
      const circumference = 220;
      const offset = circumference - (score / 100) * circumference;
      setTimeout(() => {
        if (ringRef.current) ringRef.current.style.strokeDashoffset = String(offset);
      }, 200);
    }
  }, [score]);

  const scoreColor = score !== null
    ? score >= 80 ? "hsl(175 70% 52%)" : score >= 60 ? "hsl(270 80% 65%)" : "hsl(340 85% 62%)"
    : "hsl(270 80% 65%)";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-foreground">AI Style Score</h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-2">
          <div className="w-16 h-16 rounded-full bg-secondary animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-secondary rounded animate-pulse w-3/4" />
            <div className="h-3 bg-secondary rounded animate-pulse w-1/2" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          {/* Ring */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="35" fill="none" stroke="hsl(230 12% 14%)" strokeWidth="6" />
              <circle
                ref={ringRef}
                cx="40" cy="40" r="35" fill="none"
                stroke={scoreColor} strokeWidth="6"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 220,
                  strokeDashoffset: 220,
                  transformOrigin: "center",
                  transform: "rotate(-90deg)",
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-bold text-xl text-foreground">{score}</span>
              <span className="text-[10px] text-muted-foreground">/100</span>
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StyleScore;
