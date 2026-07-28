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
      role="img"
      aria-label={label}
      className={cn(dark ? "bg-r3-card" : "bg-r3-offwhite", className)}
    />
  );
}
