import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
}

const CompareSlider: React.FC<CompareSliderProps> = ({ beforeImage, afterImage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setDragging(true); };
  const onTouchStart = () => setDragging(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging) updatePosition(e.clientX); };
    const onTouchMove = (e: TouchEvent) => { if (dragging) updatePosition(e.touches[0].clientX); };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePosition]);

  return (
    <div ref={containerRef} className="relative rounded-xl overflow-hidden aspect-[3/4] max-h-[60vh] select-none cursor-ew-resize" onClick={(e) => updatePosition(e.clientX)}>
      {/* After (full) */}
      <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${100 * 100 / Math.max(position, 1)}%` }} />
        <div className="absolute inset-y-0 right-0 w-px bg-white/80" />
      </div>
      {/* Labels */}
      <div className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/90">Before</div>
      <div className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/90">After</div>
      {/* Handle */}
      <div
        className="compare-slider-handle absolute top-0 bottom-0 flex items-center justify-center"
        style={{ left: `calc(${position}% - 20px)`, width: 40 }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <motion.div
          animate={{ scale: dragging ? 1.1 : 1 }}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center border border-white/20"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default CompareSlider;
