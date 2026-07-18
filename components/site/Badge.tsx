import { cn } from "@/lib/utils";

export function LinhaBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block bg-accent text-r3-black font-barlow font-bold text-[10px] uppercase tracking-[.16em] px-3 py-1",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CategoriaBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-r3-muted border border-r3-border text-[11px] font-barlow px-2.5 py-1",
        className,
      )}
    >
      {children}
    </span>
  );
}
