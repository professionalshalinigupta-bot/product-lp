"use client";

import { Minus, Plus } from "lucide-react";

type QuantityPickerProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantityPicker({ value, onChange }: QuantityPickerProps) {
  return (
    <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-leaf/20 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="focus-ring grid h-12 w-12 place-items-center text-charcoal transition hover:bg-mint"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus size={18} />
      </button>
      <span className="min-w-12 text-center text-lg font-bold">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="focus-ring grid h-12 w-12 place-items-center text-charcoal transition hover:bg-mint"
        onClick={() => onChange(value + 1)}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
