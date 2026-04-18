import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, FlipHorizontal, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mirrored, setMirrored] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
      setError(null);
    } catch (err: any) {
      setError("Camera access denied. Please allow camera in browser settings.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setActive(false);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    if (mirrored) {
      ctx.scale(-1, 1);
      ctx.drawImage(v, -c.width, 0);
    } else {
      ctx.drawImage(v, 0, 0);
    }
    const dataUrl = c.toDataURL("image/jpeg", 0.92);
    stopCamera();
    onCapture(dataUrl);
  }, [mirrored, stopCamera, onCapture]);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(null);
        capture();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [capture]);

  React.useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-heavy rounded-2xl overflow-hidden"
    >
      {!active ? (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Live Camera</h3>
            <p className="text-sm text-muted-foreground mt-1">Take a photo using your device camera</p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={startCamera} className="flex-1 glow-primary">
              <Camera className="w-4 h-4 mr-2" /> Start Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-[3/4] object-cover"
            style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          {/* Countdown overlay */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="font-display text-8xl font-black text-white drop-shadow-2xl">{countdown}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "33.33% 33.33%",
          }} />
          {/* Controls */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
            <button onClick={() => setMirrored(m => !m)} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center">
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={startCountdown}
              disabled={countdown !== null}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-white/30 active:scale-95 transition-transform disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full bg-white border-4 border-gray-300" />
            </button>
            <button onClick={() => { stopCamera(); onClose(); }} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Tip */}
          <div className="absolute top-3 inset-x-3 text-center">
            <span className="text-xs px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/80">
              Stand 2-3m away, full body visible
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CameraCapture;
