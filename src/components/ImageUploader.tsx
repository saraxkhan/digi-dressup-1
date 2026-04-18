import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, User, Shirt, Camera } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  icon: "person" | "clothing";
  image: string | null;
  onImageChange: (img: string | null) => void;
  onCameraClick?: () => void;
  trendingGallery?: React.ReactNode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, icon, image, onImageChange, onCameraClick, trendingGallery }) => {
  const [dragOver, setDragOver] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onImageChange(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const Icon = icon === "person" ? User : Shirt;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-[240px] space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground font-display">{label}</p>
        {!image && (
          <div className="flex gap-1">
            {onCameraClick && (
              <button
                onClick={onCameraClick}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
              >
                <Camera className="w-2.5 h-2.5" /> Camera
              </button>
            )}
            {trendingGallery && (
              <button
                onClick={() => setShowGallery(s => !s)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                  showGallery ? "bg-primary/20 border-primary/40 text-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Trending
              </button>
            )}
          </div>
        )}
      </div>

      {image ? (
        <div className="relative group rounded-2xl overflow-hidden border border-border/60 aspect-[3/4]">
          <img src={image} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={() => onImageChange(null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 inset-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-white text-xs cursor-pointer hover:bg-white/20">
              <Upload className="w-3 h-3" /> Replace
              <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {showGallery && trendingGallery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {trendingGallery}
              </motion.div>
            )}
          </AnimatePresence>
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer aspect-[3/4] transition-all ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-card/40"
            }`}
          >
            <div className="p-4 rounded-2xl bg-secondary">
              <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5 justify-center">
                <Upload className="w-4 h-4" /> Drop or click
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
          </label>
        </div>
      )}
    </motion.div>
  );
};

export default ImageUploader;
