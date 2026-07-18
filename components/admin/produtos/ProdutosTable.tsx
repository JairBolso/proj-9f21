"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { ToggleCell } from "@/components/admin/ToggleCell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ProdutosFilters } from "@/components/admin/produtos/ProdutosFilters";
import {
  toggleProdutoAtivo,
  toggleProdutoDestaque,
  excluirProduto,
} from "@/lib/actions/admin-produtos";

export interface ProdutoRow {
  id: string;
  nome: string;
  fotos: string[];
  ativo: boolean;
  destaque: boolean;
  linha: { nome: string } | null;
  categoria: { nome: string } | null;
  grupos: { grupo: { nome: string } | null }[];
}

export function ProdutosTable({
  produtos,
  linhas,
  categorias,
}: {
  produtos: ProdutoRow[];
  linhas: { id: string; nome: string }[];
  categorias: { id: string; nome: string }[];
}) {
  const columns: DataTableColumn<ProdutoRow>[] = [
    {
      key: "produto",
      header: "Produto",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-admin-input flex-shrink-0 overflow-hidden">
            {r.fotos?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.fotos[0]}
                alt={r.nome}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-admin-text">{r.nome}</span>
        </div>
      ),
    },
    {
      key: "linha",
      header: "Linha",
      render: (r) =>
        r.linha ? (
          <span className="bg-admin-accent text-r3-black text-[10px] font-mono font-bold uppercase px-2 py-0.5">
            {r.linha.nome}
          </span>
        ) : (
          "—"
        ),
    },
    { key: "categoria", header: "Categoria", render: (r) => r.categoria?.nome ?? "—" },
    {
      key: "grupos",
      header: "Grupos Musc.",
      render: (r) =>
        r.grupos.map((g) => g.grupo?.nome).filter(Boolean).join(", ") || "—",
      hideByDefault: true,
    },
    {
      key: "ativo",
      header: "Ativo",
      render: (r) => (
        <ToggleCell
          checked={r.ativo}
          onToggle={(next) => toggleProdutoAtivo(r.id, next)}
        />
      ),
    },
    {
      key: "destaque",
      header: "Destaque",
      render: (r) => (
        <ToggleCell
          checked={r.destaque}
          onToggle={(next) => toggleProdutoDestaque(r.id, next)}
        />
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/produtos/${r.id}`}
            className="p-1.5 text-admin-textMuted hover:text-admin-accent transition-colors"
          >
            <Pencil size={16} strokeWidth={1.8} />
          </Link>
          <DeleteButton
            onDelete={() => excluirProduto(r.id)}
            confirmText={`Excluir o produto "${r.nome}"?`}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={produtos}
      getRowId={(r) => r.id}
      selectable
      searchPlaceholder="Buscar produto..."
      searchFn={(r, q) => r.nome.toLowerCase().includes(q.toLowerCase())}
      filtersSlot={<ProdutosFilters linhas={linhas} categorias={categorias} />}
      emptyMessage="Nenhum produto encontrado com esses filtros."
    />
  );
}
