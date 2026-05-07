"use client";

/**
 * Stylization slider per Gemini A1 + Inklings handoff §"Picture-Assisted
 * Character Creation Flow". Maps 0-100 to Flux style_strength.
 *
 * Left  = "Keep it looking like my drawing"
 * Right = "Make it more magical"
 */
import { useState } from "react";

export function StylizationSlider({
  defaultValue = 50,
  onChange,
}: {
  defaultValue?: number;
  onChange?: (v: number) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-ink-700">
        <span>Just like my drawing</span>
        <span>More magical</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          setValue(v);
          onChange?.(v);
        }}
        className="mt-3 w-full accent-coral"
      />
      <p className="mt-2 text-center text-xs uppercase tracking-wider text-ink-500">{value}% magical</p>
    </div>
  );
}
