import type { SocialLinkData } from "@/lib/types";

interface FooterProps {
  readonly socialLinks: SocialLinkData[];
}

export default function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.04] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-white/25">
          &copy; {new Date().getFullYear()} Vivek Kumar Singh
        </div>
        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-gold transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
