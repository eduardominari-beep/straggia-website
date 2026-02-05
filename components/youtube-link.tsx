// components/youtube-link.tsx
import { Youtube } from "lucide-react";
import { YOUTUBE_URL } from "@/lib/social";

export function YoutubeLink({ className }: { className?: string }) {
  if (!YOUTUBE_URL) return null;
  return (
    <a
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir canal no YouTube"
      title="YouTube"
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
                  focus-visible:outline-none focus-visible:ring hover:opacity-90 ${className ?? ""}`}
    >
      <Youtube className="h-4 w-4" aria-hidden />
      <span className="sr-only">YouTube</span>
      <span className="hidden sm:inline">YouTube</span>
    </a>
  );
}