"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { ToggleCell } from "@/components/admin/ToggleCell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { toggleUsuarioAtivo, excluirUsuario } from "@/lib/actions/admin-usuarios";
import type { Papel } from "@/lib/supabase/database.types";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
}

const PAPEL_LABEL: Record<Papel, string> = {
  admin: "Admin",
  vendedor: "Vendedor",
  editor: "Editor",
};

export function UsuariosTable({ usuarios }: { usuarios: Usuario[] }) {
  const columns: DataTableColumn<Usuario>[] = [
    { key: "nome", header: "Nome", render: (r) => <span className="text-admin-text">{r.nome}</span> },
    { key: "email", header: "E-mail", render: (r) => r.email },
    { key: "papel", header: "Papel", render: (r) => PAPEL_LABEL[r.papel] },
    {
      key: "ativo",
      header: "Ativo",
      render: (r) => (
        <ToggleCell
          checked={r.ativo}
          onToggle={(next) => toggleUsuarioAtivo(r.id, next)}
        />
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/usuarios/${r.id}`}
            className="p-1.5 text-admin-textMuted hover:text-admin-accent transition-colors"
          >
            <Pencil size={16} strokeWidth={1.8} />
          </Link>
          <DeleteButton
            onDelete={() => excluirUsuario(r.id)}
            confirmText={`Excluir o usuário "${r.nome}"? Essa ação remove o acesso ao painel imediatamente.`}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={usuarios}
      getRowId={(r) => r.id}
      searchPlaceholder="Buscar usuário..."
      searchFn={(r, q) =>
        r.nome.toLowerCase().includes(q.toLowerCase()) ||
        r.email.toLowerCase().includes(q.toLowerCase())
      }
      emptyMessage="Nenhum usuário cadastrado."
    />
  );
}
