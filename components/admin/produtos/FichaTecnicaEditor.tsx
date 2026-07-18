"use client";

import { Plus, X } from "lucide-react";
import type { FichaTecnicaItem } from "@/lib/supabase/database.types";

export function FichaTecnicaEditor({
  itens,
  onChange,
}: {
  itens: FichaTecnicaItem[];
  onChange: (itens: FichaTecnicaItem[]) => void;
}) {
  function updateCampo(index: number, campo: string) {
    onChange(itens.map((it, i) => (i === index ? { ...it, campo } : it)));
  }

  function updateValor(index: number, valor: string) {
    onChange(itens.map((it, i) => (i === index ? { ...it, valor } : it)));
  }

  function remover(index: number) {
    onChange(itens.filter((_, i) => i !== index));
  }

  function adicionar() {
    onChange([...itens, { campo: "", valor: "" }]);
  }

  return (
    <div className="space-y-2.5">
      {itens.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item.campo}
            onChange={(e) => updateCampo(i, e.target.value)}
            placeholder="Campo"
            className="w-[200px] bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-textMuted font-mono placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent"
          />
          <input
            value={item.valor}
            onChange={(e) => updateValor(i, e.target.value)}
            placeholder="Valor"
            className="flex-1 bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent"
          />
          <button
            type="button"
            onClick={() => remover(i)}
            className="px-2 text-admin-textMuted hover:text-admin-danger transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={adicionar}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-admin-borderInput py-2.5 text-[12px] font-mono text-admin-textMuted uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
      >
        <Plus size={14} strokeWidth={2.4} />
        Adicionar campo
      </button>
    </div>
  );
}
