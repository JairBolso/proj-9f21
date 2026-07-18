"use client";

import { useOptimistic, useTransition } from "react";
import { Switch } from "@/components/admin/Switch";

export function ToggleCell({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(checked);

  function handleChange(next: boolean) {
    startTransition(async () => {
      setOptimisticChecked(next);
      await onToggle(next);
    });
  }

  return <Switch checked={optimisticChecked} onChange={handleChange} />;
}
