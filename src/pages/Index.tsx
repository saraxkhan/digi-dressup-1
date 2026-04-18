import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUploader from "@/components/ImageUploader";
import ClothingConfig, { type ClothingOptions } from "@/components/ClothingConfig";
import SizeSelector, { type SizeOptions } from "@/components/SizeSelector";
import BodyMeasurements, { type Measurements } from "@/components/BodyMeasurements";
import ResultViewer from "@/components/ResultViewer";
import StepIndicator from "@/components/StepIndicator";
import TrendingGallery from "@/components/TrendingGallery";
import CameraCapture from "@/components/CameraCapture";

const steps = ["Upload", "Configure", "Size & Fit", "Result"];

const LOADING_MESSAGES = [
  "AI is measuring you up...",
  "Draping the fabric...",
  "Adjusting the fit...",
  "Adding light and shadows...",
  "Final stitches...",
  "Almost there...",
];

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [clothingOptions, setClothingOptions] = useState<ClothingOptions>({
    type: "stitched", clothingItem: "", fabricType: "", intendedOutfit: "",
  });
  const [sizeOptions, setSizeOptions] = useState<SizeOptions>({ size: "M", fit: "Regular" });
  const [measurements, setMeasurements] = useState<Measurements>({
    chest: 95, waist: 80, hips: 100, height: 170, unit: "cm",
  });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [trendingSelected, setTrendingSelected] = useState<string | null>(null);

  const canNext = () => {
    if (step === 0) return !!personImage && !!clothingImage;
    if (step === 1) {
      if (clothingOptions.type === "stitched") return !!clothingOptions.clothingItem;
      return !!clothingOptions.fabricType && !!clothingOptions.intendedOutfit;
    }
    if (step === 2) return !!sizeOptions.size && !!sizeOptions.fit;
    return true;
  };

  const handleGenerate = async () => {
    setProcessing(true);
    setLoadingMsg(0);
    const interval = setInterval(() => setLoadingMsg(m => (m + 1) % LOADING_MESSAGES.length), 3000);
    try {
      const { data, error } = await supabase.functions.invoke("virtual-tryon", {
        body: {
          personImage,
          clothingImage,
          clothingOptions,
          sizeOptions,
          measurements,
        },
      });
      if (error) throw new Error(error.message || "Processing failed");
      if (data?.error) throw new Error(data.error);
      if (!data?.resultImage) throw new Error("No result image received");
      setResultImage(data.resultImage);
      setStep(3);
    } catch (err: any) {
      toast({
        title: "Generation Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setPersonImage(null);
    setClothingImage(null);
    setResultImage(null);
    setTrendingSelected(null);
    setClothingOptions({ type: "stitched", clothingItem: "", fabricType: "", intendedOutfit: "" });
    setSizeOptions({ size: "M", fit: "Regular" });
  };

  const handleTrendingSelect = (url: string, label: string) => {
    setTrendingSelected(url);
    // Fetch image and convert to base64
    fetch(url).then(r => r.blob()).then(blob => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setClothingImage(e.target?.result as string);
      };
      reader.readAsDataURL(blob);
    }).catch(() => setClothingImage(url));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="animate-mesh-1 absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(270 80% 65%), transparent 70%)" }} />
        <div className="animate-mesh-2 absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(340 85% 62%), transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, hsl(175 70% 52%), transparent 60%)" }} />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 glass-heavy sticky top-0 z-50">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center glow-primary border border-primary/30">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg gradient-text leading-none">DressAI</h1>
              <span className="text-[10px] text-muted-foreground">Virtual Try-On</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary/60 border border-border/40">
              <Zap className="w-3 h-3 text-primary" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 relative z-10">
        <StepIndicator steps={steps} current={step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">Upload Images</h2>
                <p className="text-sm text-muted-foreground">Add a photo of yourself and the clothing item — or pick from trending.</p>
              </div>

              {showCamera ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <CameraCapture
                    onCapture={(dataUrl) => { setPersonImage(dataUrl); setShowCamera(false); }}
                    onClose={() => setShowCamera(false)}
                  />
                </motion.div>
              ) : (
                <div className="flex gap-4 flex-col sm:flex-row">
                  <ImageUploader
                    label="Person (full body)"
                    icon="person"
                    image={personImage}
                    onImageChange={setPersonImage}
                    onCameraClick={() => setShowCamera(true)}
                  />
                  <ImageUploader
                    label="Clothing Item"
                    icon="clothing"
                    image={clothingImage}
                    onImageChange={setClothingImage}
                    trendingGallery={
                      <TrendingGallery
                        onSelect={handleTrendingSelect}
                        selected={trendingSelected}
                      />
                    }
                  />
                </div>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="config" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Configure Clothing</h2>
              <p className="text-sm text-muted-foreground mb-6">Tell us about the clothing item.</p>
              <ClothingConfig options={clothingOptions} onChange={setClothingOptions} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="size" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Size & Fit</h2>
              <p className="text-sm text-muted-foreground mb-6">Precise measurements give better AI results.</p>
              <div className="space-y-5">
                <SizeSelector options={sizeOptions} onChange={setSizeOptions} />
                <BodyMeasurements measurements={measurements} onChange={setMeasurements} />
              </div>
            </motion.div>
          )}

          {step === 3 && resultImage && personImage && (
            <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Your Look</h2>
              <p className="text-sm text-muted-foreground mb-6">AI-generated virtual try-on — explore all views below.</p>
              <ResultViewer
                personImage={personImage}
                resultImage={resultImage}
                clothingOptions={clothingOptions}
                sizeOptions={sizeOptions}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing overlay */}
        <AnimatePresence>
          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/85 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-5"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-t border-accent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
              </div>
              <motion.p
                key={loadingMsg}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-semibold text-foreground text-lg"
              >
                {LOADING_MESSAGES[loadingMsg]}
              </motion.p>
              <p className="text-sm text-muted-foreground">This takes 10–30 seconds</p>
              <div className="flex gap-1">
                {LOADING_MESSAGES.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === loadingMsg ? "bg-primary scale-125" : "bg-border"}`} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between mt-8 pt-4 border-t border-border/30"
          >
            <Button variant="ghost" onClick={() => { if (step === 0 && showCamera) setShowCamera(false); else setStep(step - 1); }} disabled={step === 0 && !showCamera}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="glow-primary min-w-24">
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={!canNext() || processing} className="glow-primary min-w-32">
                <Sparkles className="w-4 h-4 mr-1" /> Generate
              </Button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
