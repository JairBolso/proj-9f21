"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, X, Check, RotateCcw } from "lucide-react";
import {
  alternarPermissao,
  redefinirPermissoesPadrao,
} from "@/lib/actions/admin-permissoes";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_ACTION_ITEMS,
  type AdminNavItem,
  type AdminActionItem,
} from "@/lib/permissions";
import type { Papel } from "@/lib/supabase/database.types";

const PAPEIS: { papel: Papel; label: string; resumo: string }[] = [
  { papel: "admin", label: "Admin", resumo: "Acesso total, incluindo usuários e integrações" },
  { papel: "vendedor", label: "Vendedor", resumo: "Dashboard e atendimento de cotações" },
  { papel: "editor", label: "Editor", resumo: "Catálogo e conteúdo do site" },
];

// "usuarios" x "admin" fica sempre travado: sem ele, ninguém conseguiria
// voltar a esta tela para desfazer um erro de permissão.
function celulaTravada(itemId: string, papel: Papel) {
  return itemId === "usuarios" && papel === "admin";
}

export function PermissoesModal({
  navItems,
  acoes,
  podeEditar,
}: {
  navItems: AdminNavItem[];
  acoes: AdminActionItem[];
  podeEditar: boolean;
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [items, setItems] = useState(navItems);
  const [acoesState, setAcoesState] = useState(acoes);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleToggle(itemId: string, papel: Papel, permitidoAtual: boolean) {
    if (celulaTravada(itemId, papel)) return;
    setErro(null);
    const proximo = !permitidoAtual;
    const anterior = items;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const roles = new Set(item.roles);
        if (proximo) roles.add(papel);
        else roles.delete(papel);
        return { ...item, roles: Array.from(roles) };
      }),
    );

    startTransition(async () => {
      try {
        await alternarPermissao(papel, itemId, proximo);
        router.refresh();
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Falha ao salvar.");
        setItems(anterior);
      }
    });
  }

  function handleToggleAcao(itemId: string, papel: Papel, permitidoAtual: boolean) {
    setErro(null);
    const proximo = !permitidoAtual;
    const anterior = acoesState;

    setAcoesState((prev) =>
      prev.map((acao) => {
        if (acao.id !== itemId) return acao;
        const roles = new Set(acao.roles);
        if (proximo) roles.add(papel);
        else roles.delete(papel);
        return { ...acao, roles: Array.from(roles) };
      }),
    );

    startTransition(async () => {
      try {
        await alternarPermissao(papel, itemId, proximo);
        router.refresh();
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Falha ao salvar.");
        setAcoesState(anterior);
      }
    });
  }

  function handleRedefinir() {
    if (!window.confirm("Redefinir todas as permissões para o padrão original?"))
      return;
    setErro(null);
    const anteriorItems = items;
    const anteriorAcoes = acoesState;

    startTransition(async () => {
      try {
        await redefinirPermissoesPadrao();
        setItems(ADMIN_NAV_ITEMS);
        setAcoesState(ADMIN_ACTION_ITEMS);
        router.refresh();
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Falha ao redefinir.");
        setItems(anteriorItems);
        setAcoesState(anteriorAcoes);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setItems(navItems);
          setAcoesState(acoes);
          setAberto(true);
        }}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
      >
        <ShieldCheck size={15} strokeWidth={2} />
        Permissões
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/60 cursor-default"
            onClick={() => setAberto(false)}
          />
          <div className="relative z-10 w-full max-w-[640px] max-h-[85vh] overflow-y-auto bg-admin-card border border-admin-border p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-mono font-bold text-[15px] uppercase tracking-[.04em] text-admin-text">
                  Permissões por papel
                </h2>
                <p className="mt-1 text-[13px] text-admin-textMuted">
                  {podeEditar
                    ? "Clique nas células para liberar ou bloquear o acesso de cada papel."
                    : "O que cada tipo de usuário pode acessar no painel."}
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

            {erro && (
              <div className="mb-4 border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[12px] px-3 py-2">
                {erro}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {PAPEIS.map((p) => (
                <div key={p.papel} className="border border-admin-border p-3.5">
                  <div className="font-mono font-bold text-[12px] uppercase text-admin-accent">
                    {p.label}
                  </div>
                  <p className="mt-1 text-[12px] text-admin-textMuted leading-relaxed">
                    {p.resumo}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px]">
                <thead>
                  <tr className="border-b border-admin-border">
                    <th className="text-left px-3 py-2.5 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint">
                      Área
                    </th>
                    {PAPEIS.map((p) => (
                      <th
                        key={p.papel}
                        className="text-center px-3 py-2.5 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint"
                      >
                        {p.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-admin-divider last:border-b-0">
                      <td className="px-3 py-2.5 text-[13px] text-admin-textSecondary">
                        {item.label}
                      </td>
                      {PAPEIS.map((p) => {
                        const permitido = item.roles.includes(p.papel);
                        const travado = celulaTravada(item.id, p.papel);
                        return (
                          <td key={p.papel} className="px-3 py-2.5 text-center">
                            {podeEditar ? (
                              <button
                                type="button"
                                disabled={pending || travado}
                                title={
                                  travado
                                    ? "Sempre liberado para admin"
                                    : undefined
                                }
                                onClick={() =>
                                  handleToggle(item.id, p.papel, permitido)
                                }
                                className={`inline-flex items-center justify-center w-6 h-6 border transition-colors disabled:cursor-not-allowed ${
                                  permitido
                                    ? "bg-admin-accent border-admin-accent text-r3-black"
                                    : "border-admin-borderInput text-transparent hover:border-admin-accent"
                                } ${travado ? "opacity-70" : ""}`}
                              >
                                <Check size={13} strokeWidth={3} />
                              </button>
                            ) : permitido ? (
                              <Check
                                size={15}
                                strokeWidth={2.6}
                                className="inline text-admin-statusFechado"
                              />
                            ) : (
                              <span className="inline-block w-[15px] h-[2px] bg-admin-disabled" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[12px] text-admin-textMuted">
              O papel é definido ao criar ou editar cada usuário. Todos também
              têm acesso ao próprio perfil (nome, senha e foto).
            </p>

            <h3 className="mt-7 font-mono font-bold text-[13px] uppercase tracking-[.04em] text-admin-text">
              Ações em Cotações
            </h3>
            <p className="mt-1 mb-4 text-[13px] text-admin-textMuted">
              Controle fino do que cada papel pode fazer dentro de uma
              cotação. Ações irreversíveis (como excluir) podem ser bloqueadas
              até para o admin.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px]">
                <thead>
                  <tr className="border-b border-admin-border">
                    <th className="text-left px-3 py-2.5 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint">
                      Ação
                    </th>
                    {PAPEIS.map((p) => (
                      <th
                        key={p.papel}
                        className="text-center px-3 py-2.5 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint"
                      >
                        {p.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {acoesState.map((acao) => (
                    <tr key={acao.id} className="border-b border-admin-divider last:border-b-0">
                      <td className="px-3 py-2.5 text-[13px] text-admin-textSecondary">
                        {acao.label}
                      </td>
                      {PAPEIS.map((p) => {
                        const permitido = acao.roles.includes(p.papel);
                        const travado = p.papel === "admin" && acao.adminForcado;
                        return (
                          <td key={p.papel} className="px-3 py-2.5 text-center">
                            {podeEditar ? (
                              <button
                                type="button"
                                disabled={pending || travado}
                                title={
                                  travado ? "Admin sempre pode" : undefined
                                }
                                onClick={() =>
                                  handleToggleAcao(acao.id, p.papel, permitido)
                                }
                                className={`inline-flex items-center justify-center w-6 h-6 border transition-colors disabled:cursor-not-allowed ${
                                  permitido
                                    ? "bg-admin-accent border-admin-accent text-r3-black"
                                    : "border-admin-borderInput text-transparent hover:border-admin-accent"
                                } ${travado ? "opacity-70" : ""}`}
                              >
                                <Check size={13} strokeWidth={3} />
                              </button>
                            ) : permitido ? (
                              <Check
                                size={15}
                                strokeWidth={2.6}
                                className="inline text-admin-statusFechado"
                              />
                            ) : (
                              <span className="inline-block w-[15px] h-[2px] bg-admin-disabled" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {podeEditar && (
              <button
                type="button"
                disabled={pending}
                onClick={handleRedefinir}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 border border-admin-borderBtn text-admin-textMuted font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-danger hover:text-admin-danger transition-colors disabled:opacity-60"
              >
                <RotateCcw size={14} strokeWidth={2} />
                Redefinir padrão
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
