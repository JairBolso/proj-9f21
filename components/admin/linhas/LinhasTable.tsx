"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { ToggleCell } from "@/components/admin/ToggleCell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { toggleLinhaExibirHome, excluirLinha } from "@/lib/actions/admin-linhas";

interface Linha {
  id: string;
  nome: string;
  slug: string;
  exibir_home: boolean;
  ordem: number;
}

export function LinhasTable({ linhas }: { linhas: Linha[] }) {
  const columns: DataTableColumn<Linha>[] = [
    { key: "nome", header: "Nome", render: (r) => <span className="text-admin-text">{r.nome}</span> },
    { key: "slug", header: "Slug", render: (r) => r.slug },
    {
      key: "exibir_home",
      header: "Exibir na Home",
      render: (r) => (
        <ToggleCell
          checked={r.exibir_home}
          onToggle={(next) => toggleLinhaExibirHome(r.id, next)}
        />
      ),
    },
    { key: "ordem", header: "Ordem", render: (r) => r.ordem },
    {
      key: "acoes",
      header: "Ações",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/linhas/${r.id}`}
            className="p-1.5 text-admin-textMuted hover:text-admin-accent transition-colors"
          >
            <Pencil size={16} strokeWidth={1.8} />
          </Link>
          <DeleteButton
            onDelete={() => excluirLinha(r.id)}
            confirmText={`Excluir a linha "${r.nome}"?`}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={linhas}
      getRowId={(r) => r.id}
      searchPlaceholder="Buscar linha..."
      searchFn={(r, q) => r.nome.toLowerCase().includes(q.toLowerCase())}
      emptyMessage="Nenhuma linha cadastrada."
    />
  );
}
