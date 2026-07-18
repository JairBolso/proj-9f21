"use client";

import { useState, useTransition } from "react";
import { adicionarAnotacao } from "@/lib/actions/admin-cotacoes";

export function AnotacoesCard({
  cotacaoId,
  historico,
}: {
  cotacaoId: string;
  historico: string[];
}) {
  const [nota, setNota] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdicionar() {
    if (!nota.trim()) return;
    startTransition(async () => {
      await adicionarAnotacao(cotacaoId, nota);
      setNota("");
    });
  }

  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
        Anotações
      </h2>

      <textarea
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        rows={3}
        placeholder="Escreva uma anotação sobre este atendimento..."
        className="w-full bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent"
      />
      <button
        type="button"
        disabled={pending || !nota.trim()}
        onClick={handleAdicionar}
        className="mt-2 px-4 py-2 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
      >
        Adicionar nota
      </button>

      {historico.length > 0 && (
        <div className="mt-6">
          <h3 className="font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint mb-3">
            Histórico
          </h3>
          <ul className="space-y-3 border-l border-admin-divider pl-4">
            {historico
              .slice()
              .reverse()
              .map((linha, i) => (
                <li key={i} className="relative text-[13px] text-admin-textSecondary">
                  <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-admin-accent" />
                  {linha}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
