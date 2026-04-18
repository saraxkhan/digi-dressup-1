import React from "react";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export interface Measurements {
  chest: number;
  waist: number;
  hips: number;
  height: number;
  unit: "cm" | "in";
}

interface BodyMeasurementsProps {
  measurements: Measurements;
  onChange: (m: Measurements) => void;
}

const FIELDS: { key: keyof Omit<Measurements, "unit">; label: string; cmRange: [number, number]; icon: string }[] = [
  { key: "height", label: "Height", cmRange: [140, 210], icon: "↕" },
  { key: "chest", label: "Chest", cmRange: [70, 140], icon: "◉" },
  { key: "waist", label: "Waist", cmRange: [55, 130], icon: "∘" },
  { key: "hips", label: "Hips", cmRange: [70, 145], icon: "◎" },
];

const cmToIn = (cm: number) => Math.round(cm / 2.54 * 10) / 10;
const inToCm = (inch: number) => Math.round(inch * 2.54);

const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({ measurements, onChange }) => {
  const isIn = measurements.unit === "in";

  const displayVal = (key: keyof Omit<Measurements, "unit">) =>
    isIn ? cmToIn(measurements[key] as number) : measurements[key];

  const setVal = (key: keyof Omit<Measurements, "unit">, val: number) => {
    const cmVal = isIn ? inToCm(val) : val;
    onChange({ ...measurements, [key]: cmVal });
  };

  const toggleUnit = () => onChange({ ...measurements, unit: isIn ? "cm" : "in" });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Body Measurements</h3>
        </div>
        <button
          onClick={toggleUnit}
          className="text-xs px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all"
        >
          {isIn ? "Switch to cm" : "Switch to in"}
        </button>
      </div>

      <div className="space-y-5">
        {FIELDS.map(({ key, label, cmRange, icon }) => {
          const [min, max] = isIn
            ? [Math.round(cmToIn(cmRange[0]) * 10) / 10, Math.round(cmToIn(cmRange[1]) * 10) / 10]
            : cmRange;
          const val = displayVal(key);
          const step = isIn ? 0.5 : 1;
          const pct = ((Number(val) - min) / (max - min)) * 100;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-4 text-center">{icon}</span>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-display font-semibold text-primary text-sm">{val}</span>
                  <span className="text-xs text-muted-foreground">{measurements.unit}</span>
                </div>
              </div>
              <div className="relative">
                <Slider
                  min={min}
                  max={max}
                  step={step}
                  value={[Number(val)]}
                  onValueChange={([v]) => setVal(key, v)}
                  className="w-full"
                />
                {/* Size hint */}
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground/50">{min}{measurements.unit}</span>
                  <span className="text-[10px] text-muted-foreground/50">{max}{measurements.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Body type inference */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Inferred fit</span>
          <span className="text-primary font-medium">
            {measurements.hips - measurements.waist > 25 ? "Hourglass" :
             measurements.chest > measurements.hips ? "Inverted Triangle" :
             measurements.waist - measurements.hips < 5 ? "Rectangle" : "Pear"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BodyMeasurements;
