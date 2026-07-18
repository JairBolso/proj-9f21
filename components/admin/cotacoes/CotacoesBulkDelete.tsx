"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import { excluirCotacoes } from "@/lib/actions/admin-cotacoes";

// Botão de lixeira (aparece ao lado de "Colunas" quando há seleção) +
// modal de confirmação. Renderizado pelo bulkActionsSlot do DataTable.
export function CotacoesBulkDelete({
  selectedIds,
  clearSelection,
}: {
  selectedIds: string[];
  clearSelection: () => void;
}) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (selectedIds.length === 0) return null;

  function handleConfirmar() {
    setErro(null);
    startTransition(async () => {
      const resultado = await excluirCotacoes(selectedIds);
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      setConfirmando(false);
      clearSelection();
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErro(null);
          setConfirmando(true);
        }}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-admin-danger/50 text-admin-danger text-[12px] font-mono font-semibold uppercase tracking-[.06em] hover:bg-admin-danger/10 transition-colors"
      >
        <Trash2 size={14} strokeWidth={2} />
        Excluir ({selectedIds.length})
      </button>

      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/60 cursor-default"
            onClick={() => setConfirmando(false)}
          />
          <div className="relative z-10 w-full max-w-[440px] bg-admin-card border border-admin-border p-6">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="font-mono font-bold text-[15px] uppercase tracking-[.04em] text-admin-text">
                Excluir cotações
              </h2>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="p-1.5 text-admin-textMuted hover:text-admin-text"
                aria-label="Fechar"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <p className="mb-5 text-[13px] text-admin-textMuted">
              Você vai excluir{" "}
              <strong className="text-admin-text">
                {selectedIds.length} cotação(ões)
              </strong>{" "}
              permanentemente. Essa ação não pode ser desfeita.
            </p>

            {erro && (
              <div className="mb-4 border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[12px] px-3 py-2">
                {erro}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={handleConfirmar}
                className="flex-1 py-3 bg-admin-danger text-white font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:brightness-110 transition-[filter] disabled:opacity-60"
              >
                {pending ? "Excluindo..." : "Sim, excluir"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="px-6 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
