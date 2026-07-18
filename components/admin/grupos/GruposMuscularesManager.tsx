"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  criarGrupoMuscular,
  atualizarGrupoMuscular,
  excluirGrupoMuscular,
} from "@/lib/actions/admin-grupos";

interface Grupo {
  id: string;
  nome: string;
}

export function GruposMuscularesManager({ grupos }: { grupos: Grupo[] }) {
  const [novoNome, setNovoNome] = useState("");
  const [pending, startTransition] = useTransition();

  function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!novoNome.trim()) return;
    startTransition(async () => {
      await criarGrupoMuscular(novoNome.trim());
      setNovoNome("");
    });
  }

  function handleRename(id: string, nome: string) {
    if (!nome.trim()) return;
    startTransition(() => {
      atualizarGrupoMuscular(id, nome.trim());
    });
  }

  return (
    <div>
      <form onSubmit={handleCriar} className="flex gap-3 mb-6 max-w-[420px]">
        <input
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nome do grupo muscular"
          className="flex-1 bg-admin-input border border-admin-borderInput px-3.5 py-2.5 text-[14px] text-admin-text placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent"
        />
        <button
          type="submit"
          disabled={pending || !novoNome.trim()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
        >
          <Plus size={15} strokeWidth={2.4} />
          Adicionar
        </button>
      </form>

      <div className="bg-admin-card border border-admin-border divide-y divide-admin-divider max-w-[560px]">
        {grupos.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-admin-textMuted">
            Nenhum grupo muscular cadastrado.
          </p>
        ) : (
          grupos.map((grupo) => (
            <div key={grupo.id} className="flex items-center gap-3 px-4 py-3">
              <input
                defaultValue={grupo.nome}
                onBlur={(e) => {
                  if (e.target.value !== grupo.nome) {
                    handleRename(grupo.id, e.target.value);
                  }
                }}
                className="flex-1 bg-transparent text-[14px] text-admin-text focus:outline-none focus:border-b focus:border-admin-accent"
              />
              <DeleteButton
                onDelete={() => excluirGrupoMuscular(grupo.id)}
                confirmText={`Excluir o grupo muscular "${grupo.nome}"?`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
