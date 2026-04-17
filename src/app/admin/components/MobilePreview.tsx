"use client";

import { Smartphone } from "lucide-react";

interface MobilePreviewProps {
  /** Optional label shown above the phone */
  label?: string;
  /** Live preview content rendered inside the phone frame */
  children: React.ReactNode;
}

export default function MobilePreview({ label, children }: MobilePreviewProps) {
  return (
    <div className="hidden xl:flex flex-col items-center sticky top-8 shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Smartphone className="w-4 h-4 text-white/30" />
        <span className="text-xs text-white/30 uppercase tracking-widest font-medium">
          {label || "Live Preview"}
        </span>
      </div>

      {/* Phone frame */}
      <div className="relative">
        <div className="w-[280px] h-[560px] bg-[#1a1a1a] rounded-[2.5rem] border-[3px] border-white/10 shadow-2xl shadow-black/50 overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1a1a1a] rounded-b-2xl z-10" />

          {/* Screen content */}
          <div className="w-full h-full rounded-[2.2rem] overflow-y-auto overflow-x-hidden bg-[#0a0a0a] pt-6 px-4 text-white">
            {children}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/15 rounded-full z-10" />
        </div>
      </div>
    </div>
  );
}
