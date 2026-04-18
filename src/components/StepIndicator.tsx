import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, current }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: i <= current ? "hsl(263 70% 58%)" : "hsl(240 10% 14%)",
                scale: i === current ? 1.1 : 1,
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            >
              {i < current ? <Check className="w-4 h-4 text-primary-foreground" /> : (
                <span className={i <= current ? "text-primary-foreground" : "text-muted-foreground"}>{i + 1}</span>
              )}
            </motion.div>
            <span className={`text-xs font-medium hidden sm:inline ${i <= current ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 ${i < current ? "bg-primary" : "bg-border"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
