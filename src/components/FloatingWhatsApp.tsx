"use client";

import { useState, useEffect } from "react";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay so it doesn't flash on load
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="https://wa.me/971501480042"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-gold animate-wa-ping opacity-30" />

        {/* Button */}
        <div className="relative w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/25 transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold-light">
          <svg
            viewBox="0 0 32 32"
            fill="black"
            className="w-7 h-7"
          >
            <path d="M16.004 3.2C8.94 3.2 3.204 8.936 3.204 16c0 2.264.592 4.468 1.716 6.412L3.2 28.8l6.596-1.728A12.72 12.72 0 0016.004 28.8c7.064 0 12.796-5.736 12.796-12.8S23.068 3.2 16.004 3.2zm0 23.2a10.36 10.36 0 01-5.56-1.612l-.4-.236-3.908 1.024 1.044-3.808-.264-.416A10.32 10.32 0 015.604 16c0-5.744 4.656-10.4 10.4-10.4 5.744 0 10.396 4.656 10.396 10.4 0 5.744-4.652 10.4-10.396 10.4zm5.7-7.784c-.312-.156-1.848-.912-2.136-1.016-.284-.108-.492-.156-.7.156-.208.312-.808 1.016-.992 1.228-.184.208-.364.236-.676.08-.312-.156-1.316-.484-2.508-1.548-.928-.824-1.552-1.844-1.736-2.156-.18-.312-.02-.48.136-.636.14-.14.312-.364.468-.548.156-.184.208-.312.312-.52.108-.208.056-.392-.024-.548-.08-.156-.7-1.692-.96-2.316-.252-.608-.508-.524-.7-.536l-.596-.008a1.14 1.14 0 00-.832.392c-.284.312-1.088 1.064-1.088 2.596s1.112 3.012 1.268 3.22c.156.208 2.188 3.34 5.3 4.684.74.32 1.32.512 1.772.656.744.236 1.42.204 1.956.124.596-.088 1.848-.756 2.108-1.484.264-.728.264-1.352.184-1.484-.076-.132-.284-.208-.596-.364z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
