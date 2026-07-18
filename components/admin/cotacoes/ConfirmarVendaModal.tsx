"use client";

import { useState, useTransition } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { confirmarVenda } from "@/lib/actions/admin-cotacoes";
import type { ProdutoCotado } from "@/lib/supabase/database.types";

interface ItemConfirmado extends ProdutoCotado {
  incluido: boolean;
}

export function ConfirmarVendaModal({
  cotacaoId,
  produtosCotados,
  aberto,
  onFechar,
  onConfirmado,
}: {
  cotacaoId: string;
  produtosCotados: ProdutoCotado[];
  aberto: boolean;
  onFechar: () => void;
  onConfirmado: () => void;
}) {
  const [itens, setItens] = useState<ItemConfirmado[]>(() =>
    produtosCotados.map((p) => ({ ...p, incluido: true })),
  );
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!aberto) return null;

  function mudarQtd(produtoId: string, delta: number) {
    setItens((prev) =>
      prev.map((i) =>
        i.produto_id === produtoId
          ? { ...i, qtd: Math.max(1, i.qtd + delta) }
          : i,
      ),
    );
  }

  function alternarIncluido(produtoId: string) {
    setItens((prev) =>
      prev.map((i) =>
        i.produto_id === produtoId ? { ...i, incluido: !i.incluido } : i,
      ),
    );
  }

  function handleConfirmar() {
    setErro(null);
    const produtosVendidos: ProdutoCotado[] = itens
      .filter((i) => i.incluido)
      .map((i) => ({
        produto_id: i.produto_id,
        nome: i.nome,
        slug: i.slug,
        linha: i.linha,
        qtd: i.qtd,
      }));

    if (produtosVendidos.length === 0) {
      setErro("Selecione ao menos um produto vendido.");
      return;
    }
    if (!valor || Number(valor) <= 0) {
      setErro("Informe o valor da venda.");
      return;
    }

    startTransition(async () => {
      try {
        await confirmarVenda(cotacaoId, produtosVendidos, Number(valor));
        onConfirmado();
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Falha ao registrar a venda.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-black/60 cursor-default"
        onClick={onFechar}
      />
      <div className="relative z-10 w-full max-w-[520px] max-h-[85vh] overflow-y-auto bg-admin-card border border-admin-border p-6">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="font-mono font-bold text-[15px] uppercase tracking-[.04em] text-admin-text">
            Confirmar venda
          </h2>
          <button
            type="button"
            onClick={onFechar}
            className="p-1.5 text-admin-textMuted hover:text-admin-text"
            aria-label="Fechar"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <p className="mb-5 text-[13px] text-admin-textMuted">
          Confira o que a pessoa realmente comprou antes de registrar a
          venda.
        </p>

        {erro && (
          <div className="mb-4 border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[12px] px-3 py-2">
            {erro}
          </div>
        )}

        {itens.length === 0 ? (
          <p className="text-[13px] text-admin-textMuted">
            Nenhum produto cotado para confirmar.
          </p>
        ) : (
          <ul className="divide-y divide-admin-divider border border-admin-border mb-5">
            {itens.map((item) => (
              <li
                key={item.produto_id}
                className={`flex items-center gap-3 px-3.5 py-2.5 ${!item.incluido ? "opacity-40" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={item.incluido}
                  onChange={() => alternarIncluido(item.produto_id)}
                  className="accent-admin-accent"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-admin-text truncate">
                    {item.nome}
                  </div>
                  {item.linha && (
                    <div className="text-[11px] text-admin-textMuted">
                      {item.linha}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!item.incluido}
                    onClick={() => mudarQtd(item.produto_id, -1)}
                    className="p-1 text-admin-textMuted hover:text-admin-text disabled:opacity-40"
                    aria-label="Diminuir"
                  >
                    <Minus size={13} strokeWidth={2} />
                  </button>
                  <span className="w-6 text-center text-[13px] text-admin-text">
                    {item.qtd}
                  </span>
                  <button
                    type="button"
                    disabled={!item.incluido}
                    onClick={() => mudarQtd(item.produto_id, 1)}
                    className="p-1 text-admin-textMuted hover:text-admin-text disabled:opacity-40"
                    aria-label="Aumentar"
                  >
                    <Plus size={13} strokeWidth={2} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => alternarIncluido(item.produto_id)}
                  className="p-1 text-admin-textMuted hover:text-admin-danger"
                  aria-label={item.incluido ? "Remover da venda" : "Incluir na venda"}
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mb-5">
          <label className="block text-[11px] uppercase tracking-[.06em] text-admin-textMuted mb-1.5">
            Valor da venda (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={handleConfirmar}
            className="flex-1 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
          >
            {pending ? "Registrando..." : "Confirmar e fechar venda"}
          </button>
          <button
            type="button"
            onClick={onFechar}
            className="px-6 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
