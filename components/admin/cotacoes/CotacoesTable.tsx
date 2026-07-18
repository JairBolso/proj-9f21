"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CotacoesFilters } from "@/components/admin/CotacoesFilters";
import { CotacoesBulkDelete } from "@/components/admin/cotacoes/CotacoesBulkDelete";
import { formatDateTime, formatBRL } from "@/lib/format";
import type { CotacaoComVendedor } from "@/lib/data/cotacoes";

export function CotacoesTable({
  cotacoes,
  vendedores,
  podeExcluir = false,
}: {
  cotacoes: CotacaoComVendedor[];
  vendedores: { id: string; nome: string }[];
  podeExcluir?: boolean;
}) {
  const columns: DataTableColumn<CotacaoComVendedor>[] = [
    {
      key: "lead",
      header: "Lead",
      render: (row) => (
        <Link
          href={`/admin/cotacoes/${row.id}`}
          className="hover:text-admin-accent"
        >
          <div className="text-admin-text">{row.nome ?? "Sem identificação"}</div>
          {row.whatsapp && (
            <div className="text-[12px] text-admin-textMuted">
              {row.whatsapp}
            </div>
          )}
        </Link>
      ),
    },
    {
      key: "cidade",
      header: "Cidade",
      render: (row) => row.cidade ?? "—",
    },
    {
      key: "tipo_espaco",
      header: "Tipo de espaço",
      render: (row) => row.tipo_espaco ?? "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "vendedor",
      header: "Vendedor",
      render: (row) => row.vendedor?.nome ?? "—",
    },
    {
      key: "valor_venda",
      header: "Valor",
      render: (row) =>
        row.valor_venda != null ? (
          <span className="text-admin-accent font-mono font-semibold">
            {formatBRL(row.valor_venda)}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "created_at",
      header: "Recebida em",
      render: (row) => formatDateTime(row.created_at),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={cotacoes}
      getRowId={(row) => row.id}
      selectable={podeExcluir}
      bulkActionsSlot={
        podeExcluir
          ? (selectedIds, clearSelection) => (
              <CotacoesBulkDelete
                selectedIds={selectedIds}
                clearSelection={clearSelection}
              />
            )
          : undefined
      }
      searchPlaceholder="Buscar por nome ou WhatsApp..."
      searchFn={(row, query) => {
        const q = query.toLowerCase();
        return (
          (row.nome ?? "").toLowerCase().includes(q) ||
          (row.whatsapp ?? "").toLowerCase().includes(q)
        );
      }}
      filtersSlot={<CotacoesFilters vendedores={vendedores} />}
      emptyMessage="Nenhuma cotação encontrada com esses filtros."
    />
  );
}
