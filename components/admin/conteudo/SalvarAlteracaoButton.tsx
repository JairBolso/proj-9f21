"use client";

import { Check, Loader2, Save } from "lucide-react";

export type EstadoSalvar = "idle" | "salvando" | "salvo";

/**
 * Botão padrão de "Salvar alteração" do Conteúdo do Site: fica apagado
 * enquanto nada mudou e vira "Atualizado" com animação após salvar.
 */
export function SalvarAlteracaoButton({
  estado,
  pendente,
  onClick,
}: {
  estado: EstadoSalvar;
  pendente: boolean;
  onClick: () => void;
}) {
  if (estado === "salvo") {
    return (
      <button
        type="button"
        disabled
        className="salvo-pop inline-flex items-center gap-2 px-4 py-2.5 bg-admin-statusFechado text-white font-mono font-bold text-[11px] uppercase tracking-[.1em]"
      >
        <Check size={14} strokeWidth={3} />
        Atualizado
      </button>
    );
  }

  const salvando = estado === "salvando";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!pendente || salvando}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[11px] uppercase tracking-[.1em] hover:bg-admin-accentHover transition-colors disabled:bg-admin-pill disabled:text-admin-disabled disabled:cursor-not-allowed"
    >
      {salvando ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Save size={14} strokeWidth={2.2} />
      )}
      {salvando ? "Salvando..." : "Salvar alteração"}
    </button>
  );
}
