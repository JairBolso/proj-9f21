import type { Metadata } from "next";
import Link from "next/link";
import { SmartImage } from "@/components/site/SmartImage";
import { WhatsAppCTAButton } from "@/components/site/WhatsAppCTAButton";
import { getLinhas } from "@/lib/data/linhas";
import { getProdutosAtivos } from "@/lib/data/produtos";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export const metadata: Metadata = {
  title: "Linhas",
  description:
    "Conheça as linhas de equipamentos R3 Fitness: uma linha para cada projeto de academia.",
};

export default async function LinhasPage() {
  const [linhas, produtos, conteudo] = await Promise.all([
    getLinhas(),
    getProdutosAtivos(),
    getConteudoSiteMap(),
  ]);

  return (
    <>
      <section className="relative bg-r3-black text-white overflow-hidden">
        <SmartImage
          src={conteudo.hero_linhas_imagem}
          srcMobile={conteudo.hero_linhas_imagem_mobile}
          alt="Linhas de equipamentos R3"
          label="Banner da página de linhas"
          dark
          className="absolute inset-0 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-r3-black via-r3-black/85 to-r3-black/50" />
        <div className="relative max-w-[1280px] mx-auto px-6 py-16 sm:py-20">
          <h1 className="font-oswald font-bold uppercase text-[clamp(32px,5vw,54px)] leading-[1.02] max-w-[18ch]">
            Uma linha para cada projeto de academia
          </h1>
        </div>
      </section>

      {linhas.map((linha, i) => {
        const produtosDaLinha = produtos.filter(
          (p) => p.linha?.id === linha.id,
        );
        const escura = i % 2 === 0;

        return (
          <section
            key={linha.id}
            id={linha.slug}
            className={escura ? "bg-r3-black text-white" : "bg-white"}
          >
            <div className="max-w-[1280px] mx-auto px-6 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span
                  className={
                    "inline-block text-[11px] font-barlow font-bold uppercase tracking-[.16em] px-3 py-1 " +
                    (escura
                      ? "bg-accent text-r3-black"
                      : "bg-r3-heading text-white")
                  }
                >
                  Linha {linha.nome}
                </span>

                <h2 className="mt-4 font-oswald font-semibold uppercase text-[clamp(28px,3.6vw,42px)] leading-[1.03]">
                  {linha.nome}
                </h2>

                {linha.descricao && (
                  <p
                    className={
                      "mt-4 text-[15px] leading-relaxed max-w-[52ch] " +
                      (escura ? "text-r3-mutedDark" : "text-r3-body")
                    }
                  >
                    {linha.descricao}
                  </p>
                )}

                {produtosDaLinha.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {produtosDaLinha.slice(0, 6).map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/produtos/${p.slug}`}
                          className={
                            "inline-block text-[12px] px-3 py-1.5 border transition-colors " +
                            (escura
                              ? "border-white/25 text-r3-mutedDark hover:border-accent hover:text-accent"
                              : "border-r3-border text-r3-muted hover:border-r3-heading hover:text-r3-heading")
                          }
                        >
                          {p.nome}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <WhatsAppCTAButton
                  mensagem={`Olá! Gostaria de solicitar um orçamento para a linha ${linha.nome} da R3 Fitness.`}
                  className="mt-8"
                >
                  Solicitar Orçamento — {linha.nome}
                </WhatsAppCTAButton>
              </div>

              <SmartImage
                src={linha.imagem_url}
                alt={`Equipamentos da linha ${linha.nome}`}
                label={`Foto: equipamentos da linha ${linha.nome}`}
                dark={escura}
                className={i % 2 === 1 ? "lg:order-1 aspect-[4/3]" : "aspect-[4/3]"}
              />
            </div>
          </section>
        );
      })}

      <section className="bg-r3-black text-white text-center">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(28px,4vw,42px)] leading-[1.05]">
            Ainda não sabe qual linha escolher?
          </h2>
          <p className="mt-4 text-[15px] text-r3-mutedDark">
            A equipe R3 ajuda a montar o projeto ideal para o seu espaço.
          </p>
          <div className="mt-8">
            <WhatsAppCTAButton mensagem="Olá! Gostaria de ajuda para escolher a linha ideal de equipamentos R3 Fitness.">
              Solicitar Orçamento
            </WhatsAppCTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
