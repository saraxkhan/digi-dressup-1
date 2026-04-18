import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface View360Props {
  image: string;
}

const View360: React.FC<View360Props> = ({ image }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRot, setStartRot] = useState(0);
  const [perspective, setPerspective] = useState(0);
  const animRef = useRef<number>();

  // Auto-spin when idle
  useEffect(() => {
    if (!dragging) {
      const spin = () => {
        setRotation(r => r + 0.15);
        animRef.current = requestAnimationFrame(spin);
      };
      const t = setTimeout(() => { animRef.current = requestAnimationFrame(spin); }, 2000);
      return () => {
        clearTimeout(t);
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
  }, [dragging]);

  const onStart = useCallback((x: number) => {
    setDragging(true);
    setStartX(x);
    setStartRot(rotation);
  }, [rotation]);

  const onMove = useCallback((x: number) => {
    if (!dragging || !containerRef.current) return;
    const dx = x - startX;
    const w = containerRef.current.clientWidth;
    setRotation(startRot + (dx / w) * 360);
    setPerspective(dx / w);
  }, [dragging, startX, startRot]);

  const onEnd = useCallback(() => {
    setDragging(false);
    setPerspective(0);
  }, []);

  // Perspective warp based on rotation — simulates 3D feel
  const rot = rotation % 360;
  const normalizedRot = ((rot % 360) + 360) % 360;
  const skewAmount = Math.sin((normalizedRot * Math.PI) / 180) * 4;
  const scaleX = 0.94 + Math.abs(Math.cos((normalizedRot * Math.PI) / 180)) * 0.06;
  const brightness = 0.75 + Math.abs(Math.cos((normalizedRot * Math.PI) / 180)) * 0.25;

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="view-360-frame relative rounded-xl overflow-hidden aspect-[3/4] max-h-[60vh]"
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
      >
        <img
          src={image}
          alt="360 view"
          className="w-full h-full object-cover"
          style={{
            transform: `skewY(${skewAmount}deg) scaleX(${scaleX})`,
            filter: `brightness(${brightness})`,
            transition: dragging ? "none" : "transform 0.1s ease",
            userSelect: "none",
            pointerEvents: "none",
          }}
          draggable={false}
        />
        {/* Overlay shimmer */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(${normalizedRot}deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)`,
        }} />
        {/* Guide */}
        {!dragging && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-4 inset-x-0 flex justify-center"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/80 text-xs">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M2 7L5 4M2 7L5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M12 7L9 4M12 7L9 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Drag to rotate
            </div>
          </motion.div>
        )}
        {/* Rotation indicator */}
        <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/70">
          {Math.round(((normalizedRot + 180) % 360))}°
        </div>
      </div>
      {/* Rotation bar */}
      <div className="flex items-center gap-3">
        <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(normalizedRot / 360) * 100}%`,
              background: "linear-gradient(90deg, hsl(270 80% 65%), hsl(340 85% 62%))",
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono w-8">{Math.round(normalizedRot)}°</span>
      </div>
    </div>
  );
};

export default View360;
