"use client";

import { useTransition } from "react";
import { atribuirVendedor } from "@/lib/actions/admin-cotacoes";

export function VendedorCard({
  cotacaoId,
  vendedorIdAtual,
  vendedores,
  podeEditar,
}: {
  cotacaoId: string;
  vendedorIdAtual: string | null;
  vendedores: { id: string; nome: string }[];
  podeEditar: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const nomeAtual =
    vendedores.find((v) => v.id === vendedorIdAtual)?.nome ?? "Não atribuído";

  function handleChange(id: string) {
    const nome = vendedores.find((v) => v.id === id)?.nome ?? null;
    startTransition(() => {
      atribuirVendedor(cotacaoId, id || null, nome);
    });
  }

  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
        Vendedor responsável
      </h2>
      {podeEditar ? (
        <select
          defaultValue={vendedorIdAtual ?? ""}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-60"
        >
          <option value="">Não atribuído</option>
          {vendedores.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nome}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-[13px] text-admin-textSecondary">{nomeAtual}</p>
      )}
    </div>
  );
}
