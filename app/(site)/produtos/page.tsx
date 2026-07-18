import type { Metadata } from "next";
import { ProductCard } from "@/components/site/ProductCard";
import { CatalogFilters } from "@/components/site/CatalogFilters";
import { WhatsAppCTAButton } from "@/components/site/WhatsAppCTAButton";
import { SmartImage } from "@/components/site/SmartImage";
import { getProdutosAtivos, getGruposDosProdutos } from "@/lib/data/produtos";
import { getLinhas } from "@/lib/data/linhas";
import { getCategorias } from "@/lib/data/categorias";
import { getConteudoSiteMap } from "@/lib/data/conteudo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo completo de equipamentos R3 Fitness: cardio, articulados, pesos livres e acessórios para academias.",
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ linha?: string; categoria?: string; grupo?: string }>;
}) {
  const {
    linha: activeLinha,
    categoria: activeCategoria,
    grupo: activeGrupo,
  } = await searchParams;

  const supabase = await createClient();
  const [produtos, linhas, categorias, { data: todosGrupos }, conteudo] = await Promise.all([
    getProdutosAtivos(),
    getLinhas(),
    getCategorias(),
    supabase.from("grupos_musculares").select("id, nome").order("nome"),
    getConteudoSiteMap(),
  ]);

  const gruposPorProduto = await getGruposDosProdutos(produtos.map((p) => p.id));

  const linhaFacets = linhas.map((l) => ({
    value: l.slug,
    nome: l.nome,
    count: produtos.filter((p) => p.linha?.slug === l.slug).length,
  }));

  const categoriaFacets = categorias.map((c) => ({
    value: c.slug,
    nome: c.nome,
    count: produtos.filter((p) => p.categoria?.slug === c.slug).length,
  }));

  const grupoFacets = (todosGrupos ?? []).map((g) => ({
    value: g.id,
    nome: g.nome,
    count: produtos.filter((p) =>
      (gruposPorProduto.get(p.id) ?? []).some((gr) => gr.id === g.id),
    ).length,
  }));

  const filtrados = produtos.filter((p) => {
    if (activeLinha && p.linha?.slug !== activeLinha) return false;
    if (activeCategoria && p.categoria?.slug !== activeCategoria)
      return false;
    if (
      activeGrupo &&
      !(gruposPorProduto.get(p.id) ?? []).some((g) => g.id === activeGrupo)
    )
      return false;
    return true;
  });

  return (
    <>
      <section className="relative bg-r3-black text-white overflow-hidden">
        <SmartImage
          src={conteudo.hero_produtos_imagem}
          srcMobile={conteudo.hero_produtos_imagem_mobile}
          alt="Catálogo de equipamentos R3"
          label="Banner do catálogo de produtos"
          dark
          className="absolute inset-0 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-r3-black via-r3-black/85 to-r3-black/50" />
        <div className="relative max-w-[1280px] mx-auto px-6 py-16 sm:py-20">
          <h1 className="font-oswald font-bold uppercase text-[clamp(32px,5vw,54px)] leading-[1.02]">
            Equipamentos profissionais R3
          </h1>
          <p className="mt-4 max-w-[60ch] text-[16px] text-r3-mutedDark leading-relaxed">
            Cardio, articulados, pesos livres e acessórios fabricados pela R3,
            com entrega e montagem para todo o Brasil.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col lg:flex-row gap-10">
          <CatalogFilters
            linhas={linhaFacets}
            categorias={categoriaFacets}
            grupos={grupoFacets}
            activeLinha={activeLinha}
            activeCategoria={activeCategoria}
            activeGrupo={activeGrupo}
          />

          <div className="flex-1">
            {filtrados.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filtrados.map((produto) => (
                  <ProductCard key={produto.id} produto={produto} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-r3-borderMuted py-20 text-center">
                <p className="text-[15px] text-r3-muted">
                  Nenhum produto encontrado com esses filtros.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-r3-black text-white text-center">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(28px,4vw,42px)] leading-[1.05]">
            Não achou o que precisa?
          </h2>
          <p className="mt-4 text-[15px] text-r3-mutedDark">
            Fale com a gente e monte um projeto sob medida para sua academia.
          </p>
          <div className="mt-8">
            <WhatsAppCTAButton mensagem="Olá! Gostaria de solicitar um orçamento para equipamentos R3 Fitness.">
              Solicitar Orçamento
            </WhatsAppCTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
