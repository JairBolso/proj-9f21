import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Stand-in for photography that hasn't been produced/uploaded yet.
// Swap for a real <Image> as soon as an asset exists for the slot.
export function ImagePlaceholder({
  label,
  className,
  dark = false,
}: {
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 text-center px-6",
        dark
          ? "bg-r3-card text-r3-mutedDark"
          : "bg-r3-offwhite text-r3-muted",
        className,
      )}
    >
      <ImageIcon size={32} strokeWidth={1.3} />
      <span className="text-[11px] font-barlow uppercase tracking-[.1em] max-w-[28ch]">
        {label}
      </span>
    </div>
  );
}
