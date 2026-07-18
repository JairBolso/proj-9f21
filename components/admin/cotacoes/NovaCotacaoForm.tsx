"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { criarCotacaoManual } from "@/lib/actions/admin-cotacoes";
import { CidadeInput } from "@/components/CidadeInput";

interface ProdutoOpcao {
  id: string;
  nome: string;
  slug: string;
  linha?: string;
}

interface ItemSelecionado extends ProdutoOpcao {
  qtd: number;
}

const TIPOS_ESPACO = ["Academia", "Studio", "Condomínio", "Residencial", "Hotel", "Outro"];

export function NovaCotacaoForm({ produtos }: { produtos: ProdutoOpcao[] }) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [itens, setItens] = useState<ItemSelecionado[]>([]);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const sugestoes = useMemo(() => {
    if (!busca.trim()) return [];
    const q = busca.toLowerCase();
    return produtos
      .filter(
        (p) =>
          p.nome.toLowerCase().includes(q) &&
          !itens.some((i) => i.id === p.id),
      )
      .slice(0, 6);
  }, [busca, produtos, itens]);

  function adicionar(p: ProdutoOpcao) {
    setItens((prev) => [...prev, { ...p, qtd: 1 }]);
    setBusca("");
  }

  function mudarQtd(id: string, delta: number) {
    setItens((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qtd: i.qtd + delta } : i))
        .filter((i) => i.qtd > 0),
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const resultado = await criarCotacaoManual({
        nome: String(form.get("nome") ?? ""),
        whatsapp: String(form.get("whatsapp") ?? ""),
        email: String(form.get("email") ?? ""),
        cidade: String(form.get("cidade") ?? ""),
        tipo_espaco: String(form.get("tipo_espaco") ?? ""),
        produtos: itens.map((i) => ({
          produto_id: i.id,
          nome: i.nome,
          slug: i.slug,
          linha: i.linha,
          qtd: i.qtd,
        })),
      });

      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.push(`/admin/cotacoes/${resultado.id}`);
    });
  }

  const inputClass =
    "w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent";

  return (
    <form onSubmit={handleSubmit} className="max-w-[560px] space-y-5">
      {erro && (
        <div className="border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[13px] px-4 py-3">
          {erro}
        </div>
      )}

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Nome do lead *
        </label>
        <input name="nome" required className={inputClass} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            WhatsApp *
          </label>
          <input name="whatsapp" required placeholder="(17) 99999-9999" className={inputClass} />
        </div>
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            E-mail
          </label>
          <input type="email" name="email" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            Cidade
          </label>
          <CidadeInput className={inputClass} />
        </div>
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            Tipo de espaço
          </label>
          <select name="tipo_espaco" className={inputClass}>
            {TIPOS_ESPACO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Produtos de interesse
        </label>
        <div className="relative">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produto pelo nome..."
            className={inputClass}
          />
          {sugestoes.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-admin-card border border-admin-border shadow-lg">
              {sugestoes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => adicionar(p)}
                  className="w-full text-left px-3.5 py-2.5 text-[13px] text-admin-textSecondary hover:bg-admin-activeNav hover:text-admin-text"
                >
                  {p.nome}
                  {p.linha && (
                    <span className="text-admin-textFaint"> — {p.linha}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {itens.length > 0 && (
          <ul className="mt-3 divide-y divide-admin-divider border border-admin-border">
            {itens.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-3.5 py-2.5">
                <span className="flex-1 text-[13px] text-admin-text truncate">
                  {item.nome}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => mudarQtd(item.id, -1)}
                    className="p-1 text-admin-textMuted hover:text-admin-text"
                    aria-label="Diminuir"
                  >
                    <Minus size={13} strokeWidth={2} />
                  </button>
                  <span className="w-6 text-center text-[13px] text-admin-text">
                    {item.qtd}
                  </span>
                  <button
                    type="button"
                    onClick={() => mudarQtd(item.id, 1)}
                    className="p-1 text-admin-textMuted hover:text-admin-text"
                    aria-label="Aumentar"
                  >
                    <Plus size={13} strokeWidth={2} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setItens((prev) => prev.filter((i) => i.id !== item.id))
                  }
                  className="p-1 text-admin-textMuted hover:text-admin-danger"
                  aria-label="Remover"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Adicionar Lead"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/cotacoes")}
          className="px-6 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
