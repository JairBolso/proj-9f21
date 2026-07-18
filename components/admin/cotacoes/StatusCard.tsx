"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge, STATUS_LABELS } from "@/components/admin/StatusBadge";
import { atualizarStatusCotacao } from "@/lib/actions/admin-cotacoes";
import { ConfirmarVendaModal } from "@/components/admin/cotacoes/ConfirmarVendaModal";
import type { StatusCotacao, ProdutoCotado } from "@/lib/supabase/database.types";

const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [StatusCotacao, string][];

export function StatusCard({
  cotacaoId,
  statusAtual,
  valorEstimadoAtual,
  produtosCotados,
}: {
  cotacaoId: string;
  statusAtual: StatusCotacao;
  valorEstimadoAtual: number | null;
  produtosCotados: ProdutoCotado[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(statusAtual);
  const [statusSalvo, setStatusSalvo] = useState(statusAtual);
  const [valorEstimado, setValorEstimado] = useState(
    valorEstimadoAtual?.toString() ?? "",
  );
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleStatusChange(novo: StatusCotacao) {
    setStatus(novo);
    if (novo === "fechado") {
      setModalVendaAberto(true);
      return;
    }
    if (novo !== "proposta") {
      startTransition(() => {
        atualizarStatusCotacao(cotacaoId, novo);
        setStatusSalvo(novo);
      });
    }
  }

  function handleConfirmarProposta() {
    startTransition(() => {
      atualizarStatusCotacao(
        cotacaoId,
        "proposta",
        undefined,
        Number(valorEstimado) || 0,
      );
      setStatusSalvo("proposta");
    });
  }

  function handleFecharModalVenda() {
    setModalVendaAberto(false);
    setStatus(statusSalvo);
  }

  function handleVendaConfirmada() {
    setModalVendaAberto(false);
    setStatus("fechado");
    setStatusSalvo("fechado");
    router.refresh();
  }

  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
        Status do atendimento
      </h2>

      <StatusBadge status={status} />

      <select
        value={status}
        disabled={pending}
        onChange={(e) => handleStatusChange(e.target.value as StatusCotacao)}
        className="mt-4 w-full bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-60"
      >
        {STATUS_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {status === "proposta" && (
        <div className="mt-3">
          <label className="block text-[11px] uppercase tracking-[.06em] text-admin-textMuted mb-1.5">
            Valor estimado (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={valorEstimado}
            onChange={(e) => setValorEstimado(e.target.value)}
            className="w-full bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
          />
          <button
            type="button"
            disabled={pending}
            onClick={handleConfirmarProposta}
            className="mt-2 w-full py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
          >
            Confirmar proposta
          </button>
        </div>
      )}

      <ConfirmarVendaModal
        cotacaoId={cotacaoId}
        produtosCotados={produtosCotados}
        aberto={modalVendaAberto}
        onFechar={handleFecharModalVenda}
        onConfirmado={handleVendaConfirmada}
      />
    </div>
  );
}
