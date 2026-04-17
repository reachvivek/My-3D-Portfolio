import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vivek Kumar Singh | Full-Stack Developer & AI Engineer",
    short_name: "Vivek Singh",
    description:
      "Top full-stack developer and AI engineer in Dubai, UAE. Building premium websites, web apps, e-commerce stores, and AI-powered products.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#d4a853",
    orientation: "portrait",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    categories: ["business", "productivity", "developer"],
  };
}
