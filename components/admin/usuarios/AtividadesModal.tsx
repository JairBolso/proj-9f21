"use client";

import { useMemo, useState } from "react";
import { History, X } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Atividade } from "@/lib/data/atividades";

export function AtividadesModal({
  atividades,
}: {
  atividades: Atividade[];
}) {
  const [aberto, setAberto] = useState(false);
  const [filtroUsuario, setFiltroUsuario] = useState("");

  // Lista de usuários distintos presentes no log, para o filtro.
  const usuarios = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const a of atividades) {
      const id = a.usuario_id ?? `nome:${a.usuario_nome}`;
      if (!mapa.has(id)) mapa.set(id, a.usuario_nome);
    }
    return Array.from(mapa.entries()).map(([id, nome]) => ({ id, nome }));
  }, [atividades]);

  const filtradas = useMemo(() => {
    if (!filtroUsuario) return atividades;
    return atividades.filter(
      (a) => (a.usuario_id ?? `nome:${a.usuario_nome}`) === filtroUsuario,
    );
  }, [atividades, filtroUsuario]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
      >
        <History size={15} strokeWidth={2} />
        Atividades
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/60 cursor-default"
            onClick={() => setAberto(false)}
          />
          <div className="relative z-10 w-full max-w-[680px] max-h-[85vh] flex flex-col bg-admin-card border border-admin-border">
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-admin-border">
              <div>
                <h2 className="font-mono font-bold text-[15px] uppercase tracking-[.04em] text-admin-text">
                  Registro de atividades
                </h2>
                <p className="mt-1 text-[13px] text-admin-textMuted">
                  Tudo o que a equipe fez no painel, mais recente primeiro.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="p-1.5 text-admin-textMuted hover:text-admin-text"
                aria-label="Fechar"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-admin-divider flex items-center gap-3">
              <label className="text-[12px] uppercase tracking-[.06em] text-admin-textMuted">
                Filtrar por
              </label>
              <select
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
                className="bg-admin-input border border-admin-borderInput px-3 py-2 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
              >
                <option value="">Todos os usuários</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
              <span className="ml-auto text-[12px] text-admin-textFaint">
                {filtradas.length} registro(s)
              </span>
            </div>

            <div className="overflow-y-auto flex-1 p-6 pt-4">
              {filtradas.length === 0 ? (
                <p className="text-[13px] text-admin-textMuted">
                  Nenhuma atividade registrada ainda.
                </p>
              ) : (
                <ul className="space-y-0">
                  {filtradas.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-start gap-3 py-3 border-b border-admin-divider last:border-b-0"
                    >
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-admin-accent flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-admin-textSecondary">
                          <span className="text-admin-text font-medium">
                            {a.usuario_nome}
                          </span>{" "}
                          {a.acao}
                        </p>
                        <p className="mt-0.5 text-[11px] font-mono text-admin-textFaint">
                          {formatDateTime(a.created_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
