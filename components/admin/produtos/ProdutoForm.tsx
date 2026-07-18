"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/admin/Switch";
import { FotosUploader } from "@/components/admin/produtos/FotosUploader";
import { FichaTecnicaEditor } from "@/components/admin/produtos/FichaTecnicaEditor";
import { SeoPreview } from "@/components/admin/produtos/SeoPreview";
import { criarProduto, atualizarProduto } from "@/lib/actions/admin-produtos";
import type { FichaTecnicaItem } from "@/lib/supabase/database.types";

const GARANTIAS = ["1 ano", "2 anos", "3 anos", "5 anos (estrutura)"];

// Campos que aparecem na maioria das fichas técnicas de equipamentos de
// academia — já vêm no formulário do produto novo, o editor só preenche
// o valor (pode apagar os que não se aplicam e adicionar outros).
const FICHA_PADRAO: FichaTecnicaItem[] = [
  { campo: "Dimensões (C x L x A)", valor: "" },
  { campo: "Peso do equipamento", valor: "" },
  { campo: "Carga máxima suportada", valor: "" },
  { campo: "Capacidade de peso do usuário", valor: "" },
  { campo: "Material da estrutura", valor: "" },
  { campo: "Acabamento / Pintura", valor: "" },
  { campo: "Revestimento (assento/encosto)", valor: "" },
  { campo: "Sistema de regulagem", valor: "" },
];

interface ProdutoFormProps {
  produto?: {
    id: string;
    nome: string;
    slug: string;
    descricao: string | null;
    linha_id: string | null;
    categoria_id: string | null;
    fotos: string[];
    ficha_tecnica: FichaTecnicaItem[];
    destaque: boolean;
    ativo: boolean;
    garantia: string | null;
    grupoIds: string[];
  };
  linhas: { id: string; nome: string }[];
  categorias: { id: string; nome: string }[];
  gruposMusculares: { id: string; nome: string }[];
}

export function ProdutoForm({
  produto,
  linhas,
  categorias,
  gruposMusculares,
}: ProdutoFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [slug, setSlug] = useState(produto?.slug ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [linhaId, setLinhaId] = useState(produto?.linha_id ?? "");
  const [categoriaId, setCategoriaId] = useState(produto?.categoria_id ?? "");
  const [fotos, setFotos] = useState<string[]>(produto?.fotos ?? []);
  const [fichaTecnica, setFichaTecnica] = useState<FichaTecnicaItem[]>(
    produto?.ficha_tecnica ?? FICHA_PADRAO,
  );
  const [gruposSel, setGruposSel] = useState<Set<string>>(
    new Set(produto?.grupoIds ?? []),
  );
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [garantia, setGarantia] = useState(produto?.garantia ?? GARANTIAS[1]);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function toggleGrupo(id: string) {
    setGruposSel((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      try {
        const input = {
          nome,
          slug,
          descricao,
          linha_id: linhaId || null,
          categoria_id: categoriaId || null,
          fotos,
          ficha_tecnica: fichaTecnica.filter((f) => f.campo.trim()),
          destaque,
          ativo,
          garantia,
          grupoIds: Array.from(gruposSel),
        };
        if (produto) await atualizarProduto(produto.id, input);
        else await criarProduto(input);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {erro && (
        <div className="mb-5 border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[13px] px-4 py-3">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Fotos do produto
            </h2>
            <FotosUploader fotos={fotos} onChange={setFotos} />
          </div>

          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Informações gerais
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
                  Nome
                </label>
                <input
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
                  Slug (opcional)
                </label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text font-mono focus:outline-none focus:border-admin-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
                    Linha
                  </label>
                  <select
                    value={linhaId}
                    onChange={(e) => setLinhaId(e.target.value)}
                    className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
                  >
                    <option value="">Selecionar linha</option>
                    {linhas.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
                    Categoria
                  </label>
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
                  >
                    <option value="">Selecionar categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
                  Grupos musculares
                </label>
                <div className="flex flex-wrap gap-2">
                  {gruposMusculares.map((g) => {
                    const selecionado = gruposSel.has(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGrupo(g.id)}
                        className={
                          selecionado
                            ? "px-3 py-1.5 text-[12px] bg-admin-accent text-r3-black border border-admin-accent"
                            : "px-3 py-1.5 text-[12px] bg-transparent text-admin-textMuted border border-admin-borderInput hover:border-admin-accent hover:text-admin-accent"
                        }
                      >
                        {g.nome}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
                  Descrição técnica
                </label>
                <textarea
                  rows={5}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
                />
              </div>
            </div>
          </div>

          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Ficha técnica
            </h2>
            <FichaTecnicaEditor itens={fichaTecnica} onChange={setFichaTecnica} />
          </div>

          <SeoPreview nome={nome} descricao={descricao} slug={slug} />
        </div>

        <div className="space-y-6">
          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Publicação
            </h2>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] text-admin-textSecondary">
                Ativo no site
              </span>
              <Switch checked={ativo} onChange={setAtivo} />
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-[13px] text-admin-textSecondary">
                Destaque na Home
              </span>
              <Switch checked={destaque} onChange={setDestaque} />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
            >
              {pending ? "Salvando..." : "Salvar Produto"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/produtos")}
              className="w-full mt-2 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
            >
              Cancelar
            </button>
          </div>

          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Garantia
            </h2>
            <select
              value={garantia}
              onChange={(e) => setGarantia(e.target.value)}
              className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
            >
              {GARANTIAS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
