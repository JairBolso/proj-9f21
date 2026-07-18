"use client";

import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-9 h-5 flex-shrink-0 border border-admin-border transition-colors disabled:opacity-50",
        checked ? "bg-admin-accent" : "bg-admin-switchOff",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-[15px] h-[15px] transition-[left]",
          checked ? "left-[19px] bg-r3-black" : "left-[2px] bg-admin-switchThumbOff",
        )}
      />
    </button>
  );
}
