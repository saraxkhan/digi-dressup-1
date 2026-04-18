import React from "react";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ClothingOptions {
  type: "stitched" | "unstitched";
  clothingItem: string;
  fabricType: string;
  intendedOutfit: string;
}

interface ClothingConfigProps {
  options: ClothingOptions;
  onChange: (options: ClothingOptions) => void;
}

const stitchedItems = ["Blazer", "Coat", "Shirt", "Kurta", "Pant", "Dress", "Jacket", "T-Shirt"];
const fabricTypes = ["Cotton", "Silk", "Wool", "Denim", "Linen", "Chiffon", "Velvet", "Polyester"];
const outfitTypes = ["Suit", "Kurta Set", "Casual Dress", "Formal Wear", "Ethnic Wear", "Western Wear"];

const ClothingConfig: React.FC<ClothingConfigProps> = ({ options, onChange }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-foreground">Clothing Type</h3>
        <RadioGroup
          value={options.type}
          onValueChange={(v) => onChange({ ...options, type: v as "stitched" | "unstitched" })}
          className="flex gap-4"
        >
          {(["stitched", "unstitched"] as const).map((t) => (
            <Label
              key={t}
              htmlFor={t}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                options.type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <RadioGroupItem value={t} id={t} />
              <span className="capitalize font-medium text-sm">{t}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {options.type === "stitched" ? (
        <motion.div key="stitched" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-5 space-y-3">
          <h3 className="font-display font-semibold text-foreground text-sm">Clothing Item</h3>
          <Select value={options.clothingItem} onValueChange={(v) => onChange({ ...options, clothingItem: v })}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select item" /></SelectTrigger>
            <SelectContent>{stitchedItems.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
          </Select>
        </motion.div>
      ) : (
        <motion.div key="unstitched" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-5 space-y-4">
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Fabric Type</h3>
            <Select value={options.fabricType} onValueChange={(v) => onChange({ ...options, fabricType: v })}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select fabric" /></SelectTrigger>
              <SelectContent>{fabricTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-foreground text-sm">Intended Outfit</h3>
            <Select value={options.intendedOutfit} onValueChange={(v) => onChange({ ...options, intendedOutfit: v })}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select outfit" /></SelectTrigger>
              <SelectContent>{outfitTypes.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClothingConfig;
