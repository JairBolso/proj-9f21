"use client";

import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 font-inter">
      <AlertTriangle size={32} strokeWidth={1.6} className="text-admin-danger" />
      <h1 className="mt-4 font-mono font-bold uppercase text-[20px] text-admin-text">
        Algo deu errado
      </h1>
      <p className="mt-2 text-[13px] text-admin-textMuted max-w-[46ch]">
        {error.message || "Não foi possível carregar esta página."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}
