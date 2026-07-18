"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  onDelete,
  confirmText = "Tem certeza que deseja excluir?",
}: {
  onDelete: () => Promise<void>;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmText)) return;
    startTransition(() => {
      onDelete();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label="Excluir"
      className="p-1.5 text-admin-textMuted hover:text-admin-danger transition-colors disabled:opacity-50"
    >
      <Trash2 size={16} strokeWidth={1.8} />
    </button>
  );
}
