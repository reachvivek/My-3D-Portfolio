"use client";

import { useState } from "react";
import { Heart, Share2, LinkIcon, Twitter, Linkedin, MessageCircle, Eye } from "lucide-react";

interface Props {
  slug: string;
  initialClaps: number;
  views: number;
}

export default function BlogInteractions({ slug, initialClaps, views }: Props) {
  const [claps, setClaps] = useState(initialClaps);
  const [clapped, setClapped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const url = `https://reachvivek.vercel.app/blog/${slug}`;

  function handleClap() {
    if (!clapped) {
      setClaps((c) => c + 1);
      setClapped(true);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between py-4 border-y border-white/8">
      {/* Left: Claps + Views */}
      <div className="flex items-center gap-5">
        <button
          onClick={handleClap}
          className={`flex items-center gap-2 text-sm transition-all ${
            clapped
              ? "text-gold"
              : "text-white/35 hover:text-gold"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              clapped ? "fill-gold text-gold scale-110" : ""
            }`}
          />
          <span>{claps}</span>
        </button>

        <span className="flex items-center gap-1.5 text-sm text-white/25">
          <MessageCircle className="w-4 h-4" />
          0
        </span>
      </div>

      {/* Right: Views + Share */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-white/25">
          <Eye className="w-3.5 h-3.5" />
          {views.toLocaleString()}
        </span>

        <div className="relative">
          <button
            onClick={() => setShowShare(!showShare)}
            className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {showShare && (
            <div className="absolute right-0 top-full mt-2 py-2 px-1 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl min-w-[180px] z-50">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Share on X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </a>
              <button
                onClick={handleCopy}
                className="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full text-left"
              >
                <LinkIcon className="w-4 h-4" />
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
