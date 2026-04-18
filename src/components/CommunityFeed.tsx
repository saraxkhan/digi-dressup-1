import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ThumbsUp, Users, X } from "lucide-react";

interface FeedItem {
  id: string;
  image: string;
  label: string;
  hot: number;
  not: number;
  clothing: string;
}

// Seeded demo data
const DEMO_FEED: FeedItem[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", label: "Summer Look", hot: 124, not: 23, clothing: "Summer Dress" },
  { id: "2", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", label: "Office Fit", hot: 89, not: 41, clothing: "Linen Suit" },
  { id: "3", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=80", label: "Evening Glam", hot: 201, not: 18, clothing: "Evening Gown" },
];

const STORAGE_KEY = "dressai_community";

const CommunityFeed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? [...JSON.parse(stored), ...DEMO_FEED] : DEMO_FEED;
    } catch { return DEMO_FEED; }
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [votes, setVotes] = useState<Record<string, "hot" | "not">>({});

  const vote = (dir: "left" | "right") => {
    const item = feed[currentIdx];
    if (!item) return;
    setSwipeDir(dir);
    const voteType = dir === "right" ? "hot" : "not";
    setVotes(v => ({ ...v, [item.id]: voteType }));
    setFeed(f => f.map(i => i.id === item.id ? { ...i, [voteType]: i[voteType] + 1 } : i));
    setTimeout(() => {
      setSwipeDir(null);
      setCurrentIdx(i => Math.min(i + 1, feed.length - 1));
    }, 400);
  };

  const item = feed[currentIdx];
  const allVoted = currentIdx >= feed.length - 1 && swipeDir !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-foreground">Community Votes</h3>
        <span className="text-xs text-muted-foreground ml-auto">{currentIdx}/{feed.length} reviewed</span>
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          {item && !allVoted ? (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{
                opacity: 1, scale: 1, y: 0,
                x: swipeDir === "left" ? -300 : swipeDir === "right" ? 300 : 0,
                rotate: swipeDir === "left" ? -12 : swipeDir === "right" ? 12 : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xs"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-border">
                <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                {/* Labels */}
                <AnimatePresence>
                  {swipeDir === "right" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <span className="font-display text-4xl font-black text-green-400 border-4 border-green-400 px-4 py-1 rounded-xl rotate-[-15deg]">HOT 🔥</span>
                    </motion.div>
                  )}
                  {swipeDir === "left" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <span className="font-display text-4xl font-black text-red-400 border-4 border-red-400 px-4 py-1 rounded-xl rotate-[15deg]">PASS</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="font-display font-semibold text-white text-sm">{item.label}</p>
                  <p className="text-white/60 text-xs">{item.clothing}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-green-400">🔥 {item.hot}</span>
                    <span className="text-xs text-red-400">✗ {item.not}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-muted-foreground">
              <ThumbsUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">You've voted on all looks! Check back soon.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {item && !allVoted && (
          <div className="flex gap-4">
            <button
              onClick={() => vote("left")}
              className="w-14 h-14 rounded-full bg-secondary border border-border text-red-400 text-xl font-bold flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/40 transition-all active:scale-95"
            >✗</button>
            <button
              onClick={() => vote("right")}
              className="w-14 h-14 rounded-full bg-secondary border border-border text-green-400 text-xl flex items-center justify-center hover:bg-green-500/10 hover:border-green-500/40 transition-all active:scale-95"
            >🔥</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
