"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { ToggleCell } from "@/components/admin/ToggleCell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  toggleDepoimentoAprovado,
  excluirDepoimento,
} from "@/lib/actions/admin-depoimentos";

interface Depoimento {
  id: string;
  nome: string;
  academia: string | null;
  cidade: string | null;
  texto: string;
  imagem_url: string | null;
  aprovado: boolean;
}

export function DepoimentosTable({
  depoimentos,
}: {
  depoimentos: Depoimento[];
}) {
  const columns: DataTableColumn<Depoimento>[] = [
    {
      key: "nome",
      header: "Nome",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          {r.imagem_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={r.imagem_url}
              alt=""
              className="w-8 h-8 object-cover rounded-full flex-shrink-0"
            />
          )}
          <span className="text-admin-text">{r.nome}</span>
        </div>
      ),
    },
    {
      key: "academia",
      header: "Academia / Cidade",
      render: (r) => [r.academia, r.cidade].filter(Boolean).join(" · ") || "—",
    },
    {
      key: "texto",
      header: "Depoimento",
      render: (r) => (
        <span className="line-clamp-2 max-w-[360px] block">{r.texto}</span>
      ),
    },
    {
      key: "aprovado",
      header: "Aprovado",
      render: (r) => (
        <ToggleCell
          checked={r.aprovado}
          onToggle={(next) => toggleDepoimentoAprovado(r.id, next)}
        />
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/depoimentos/${r.id}`}
            className="p-1.5 text-admin-textMuted hover:text-admin-accent transition-colors"
          >
            <Pencil size={16} strokeWidth={1.8} />
          </Link>
          <DeleteButton
            onDelete={() => excluirDepoimento(r.id)}
            confirmText={`Excluir o depoimento de "${r.nome}"?`}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={depoimentos}
      getRowId={(r) => r.id}
      searchPlaceholder="Buscar depoimento..."
      searchFn={(r, q) =>
        r.nome.toLowerCase().includes(q.toLowerCase()) ||
        r.texto.toLowerCase().includes(q.toLowerCase())
      }
      emptyMessage="Nenhum depoimento cadastrado."
    />
  );
}
