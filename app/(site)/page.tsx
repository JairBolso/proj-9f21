import Link from "next/link";
import { Truck, ShieldCheck, CreditCard, Headset } from "lucide-react";
import { SmartImage } from "@/components/site/SmartImage";
import { CtaFundo } from "@/components/site/CtaFundo";
import { ProductCard } from "@/components/site/ProductCard";
import { WhatsAppCTAButton } from "@/components/site/WhatsAppCTAButton";
import { getCategoriasHome } from "@/lib/data/categorias";
import { getLinhasHome } from "@/lib/data/linhas";
import { getProdutosDestaque } from "@/lib/data/produtos";
import { getDepoimentosAprovados } from "@/lib/data/depoimentos";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

const NUMEROS = [
  { valor: "9 anos", label: "De fabricação própria" },
  { valor: "Todo o Brasil", label: "Entrega para qualquer estado" },
  { valor: "Montagem inclusa", label: "Equipe própria de instalação" },
  { valor: "Garantia de fábrica", label: "Assistência direto com quem fabrica" },
];

const PROCESSO = [
  {
    numero: "01",
    titulo: "Layout da sala",
    descricao: "Levantamento do espaço e projeto de distribuição dos equipamentos.",
  },
  {
    numero: "02",
    titulo: "Seleção de equipamentos",
    descricao: "Escolha das linhas e máquinas de acordo com o perfil da academia.",
  },
  {
    numero: "03",
    titulo: "Entrega e montagem",
    descricao: "Transporte e instalação por equipe própria em todo o Brasil.",
  },
  {
    numero: "04",
    titulo: "Pós-venda de fábrica",
    descricao: "Suporte técnico e garantia direto com quem fabricou o equipamento.",
  },
];

const DIFERENCIAIS = [
  {
    icon: Truck,
    titulo: "Entrega Nacional",
    descricao: "Logística própria para academias em qualquer região do Brasil.",
  },
  {
    icon: ShieldCheck,
    titulo: "Montagem Garantida",
    descricao: "Instalação feita por equipe técnica especializada da R3.",
  },
  {
    icon: CreditCard,
    titulo: "Pagamento Flexível",
    descricao: "Pix, cartão em até 12x, boleto ou condições para projetos.",
  },
  {
    icon: Headset,
    titulo: "Suporte Especializado",
    descricao: "Atendimento técnico e comercial direto com a fábrica.",
  },
];

export default async function HomePage() {
  const [categorias, linhas, destaques, depoimentos, conteudo] = await Promise.all([
    getCategoriasHome(),
    getLinhasHome(),
    getProdutosDestaque(),
    getDepoimentosAprovados(),
    getConteudoSiteMap(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "R3 Fitness",
            description:
              "Fabricação própria de equipamentos para academias, com entrega e montagem para todo o Brasil.",
            url: "https://r3fitness.com.br",
            telephone: "+5517997168842",
            email: "orcamento@r3fitness.com.br",
          }),
        }}
      />

      {/* Hero */}
      <section className="relative bg-r3-black text-white overflow-hidden">
        <SmartImage
          src={conteudo.hero_home_imagem}
          srcMobile={conteudo.hero_home_imagem_mobile}
          alt="Academia equipada com máquinas R3"
          label="Foto ou frame de vídeo: academia equipada com máquinas R3"
          dark
          className="absolute inset-0 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-r3-black via-r3-black/80 to-r3-black/40" />
        <div className="relative max-w-[1280px] mx-auto px-6 pt-28 pb-24 sm:pt-36 sm:pb-32">
          <h1 className="font-oswald font-bold uppercase leading-[0.98] text-[clamp(46px,7.4vw,96px)] max-w-[16ch]">
            Equipamentos que constroem{" "}
            <span className="text-accent">academias fortes</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[17px] sm:text-[19px] leading-relaxed text-r3-mutedDark">
            Fabricação própria de equipamentos profissionais para academias,
            studios e condomínios — com entrega e montagem em todo o Brasil.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <WhatsAppCTAButton mensagem="Olá! Gostaria de solicitar um orçamento para equipamentos R3 Fitness.">
              Solicitar Orçamento
            </WhatsAppCTAButton>
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/55 text-white font-barlow font-semibold text-[14px] uppercase tracking-[.12em] hover:border-accent hover:text-accent transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="bg-r3-dark2 text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-r3-divider">
          {NUMEROS.map((item, i) => (
            <div
              key={item.valor}
              className={`px-4 py-6 sm:py-0 text-center ${
                i > 0 ? "lg:border-l lg:border-r3-divider" : ""
              }`}
            >
              <div className="font-oswald font-semibold text-[26px] uppercase">
                {item.valor}
              </div>
              <div className="mt-1 text-[12px] text-r3-mutedDark uppercase tracking-[.06em]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      {categorias.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1280px] mx-auto px-6 py-20">
            <h2 className="font-oswald font-semibold uppercase text-[clamp(34px,4.6vw,54px)] leading-[1.02] text-r3-heading">
              Categorias
            </h2>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {categorias.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/produtos?categoria=${categoria.slug}`}
                  className="group block border border-r3-border hover:border-r3-borderMuted transition-colors"
                >
                  <SmartImage
                    src={categoria.imagem_url}
                    alt={categoria.nome}
                    label={categoria.nome}
                    className="aspect-[4/5]"
                  />
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-barlow font-semibold text-[14px] uppercase tracking-[.04em]">
                      {categoria.nome}
                    </span>
                    <span className="text-accent group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Linhas */}
      {linhas.length > 0 && (
        <section className="bg-r3-black text-white">
          <div className="max-w-[1280px] mx-auto px-6 py-20">
            <h2 className="font-oswald font-semibold uppercase text-[clamp(34px,4.6vw,54px)] leading-[1.02]">
              Nossas Linhas
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {linhas.map((linha) => (
                <Link
                  key={linha.id}
                  href={`/linhas#${linha.slug}`}
                  className="group flex flex-col bg-r3-card border border-r3-cardBorder hover:border-accent transition-colors"
                >
                  <SmartImage
                    src={linha.imagem_url}
                    alt={`Equipamentos da linha ${linha.nome}`}
                    label={`Foto da linha ${linha.nome}`}
                    dark
                    className="aspect-[4/3]"
                  />
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-oswald font-semibold text-[22px] uppercase">
                      {linha.nome}
                    </h3>
                    {linha.descricao && (
                      <p className="mt-3 text-[14px] leading-relaxed text-r3-mutedDark flex-1">
                        {linha.descricao}
                      </p>
                    )}
                    <span className="mt-6 text-[13px] font-semibold uppercase tracking-[.08em] text-accent group-hover:underline">
                      Conhecer linha →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produtos em destaque */}
      {destaques.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1280px] mx-auto px-6 py-20">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="font-oswald font-semibold uppercase text-[clamp(34px,4.6vw,54px)] leading-[1.02] text-r3-heading">
                Produtos em destaque
              </h2>
              <Link
                href="/produtos"
                className="text-[13px] font-barlow font-semibold uppercase tracking-[.08em] text-r3-muted hover:text-r3-heading"
              >
                Ver catálogo completo →
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {destaques.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Monte sua academia completa */}
      <section className="bg-r3-offwhite">
        <div className="max-w-[1280px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-oswald font-semibold uppercase text-[clamp(30px,4vw,44px)] leading-[1.05] text-r3-heading">
              Monte sua academia completa
            </h2>
            <ol className="mt-8 space-y-8">
              {PROCESSO.map((etapa) => (
                <li key={etapa.numero} className="flex gap-5">
                  <span className="font-oswald font-bold text-[28px] text-accent leading-none">
                    {etapa.numero}
                  </span>
                  <div>
                    <h3 className="font-barlow font-semibold text-[16px] uppercase tracking-[.02em] text-r3-heading">
                      {etapa.titulo}
                    </h3>
                    <p className="mt-1 text-[14px] text-r3-body leading-relaxed">
                      {etapa.descricao}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <SmartImage
            src={conteudo.monte_academia_imagem}
            srcMobile={conteudo.monte_academia_imagem_mobile}
            alt="Equipe R3 montando equipamentos em uma academia"
            label="Foto: equipe R3 montando equipamentos em uma academia"
            className="aspect-[4/5] lg:aspect-square"
          />
        </div>
      </section>

      {/* Diferenciais */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(34px,4.6vw,54px)] leading-[1.02] text-r3-heading">
            Diferenciais
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DIFERENCIAIS.map((item) => (
              <div key={item.titulo}>
                <div className="w-12 h-12 bg-accent flex items-center justify-center">
                  <item.icon size={22} strokeWidth={1.8} className="text-r3-black" />
                </div>
                <h3 className="mt-4 font-barlow font-semibold text-[16px] uppercase text-r3-heading">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-r3-muted">
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      {depoimentos.length > 0 && (
        <section className="bg-r3-offwhite">
          <div className="max-w-[1280px] mx-auto px-6 py-20">
            <h2 className="font-oswald font-semibold uppercase text-[clamp(34px,4.6vw,54px)] leading-[1.02] text-r3-heading">
              Depoimentos
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {depoimentos.slice(0, 3).map((depoimento) => (
                <div
                  key={depoimento.id}
                  className="bg-white border border-r3-border p-7"
                >
                  <span className="font-oswald text-[42px] text-accent leading-none">
                    &ldquo;
                  </span>
                  <p className="mt-2 text-[15px] leading-relaxed text-r3-body">
                    {depoimento.texto}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    {depoimento.imagem_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={depoimento.imagem_url}
                        alt={depoimento.nome}
                        className="w-11 h-11 object-cover rounded-full border border-r3-border"
                      />
                    )}
                    <div>
                      <div className="font-barlow font-semibold text-[14px] text-r3-heading">
                        {depoimento.nome}
                      </div>
                      <div className="text-[13px] text-r3-muted">
                        {[depoimento.academia, depoimento.cidade]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="relative overflow-hidden bg-r3-black text-white text-center">
        <CtaFundo
          src={conteudo.cta_final_imagem}
          srcMobile={conteudo.cta_final_imagem_mobile}
        />
        <div className="relative max-w-[720px] mx-auto px-6 py-24">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(30px,4.4vw,48px)] leading-[1.05]">
            Pronto para equipar sua academia?
          </h2>
          <p className="mt-4 text-[16px] text-r3-mutedDark">
            Fale agora com a R3 e receba um projeto sob medida para o seu
            espaço.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <WhatsAppCTAButton mensagem="Olá! Gostaria de solicitar um orçamento para equipamentos R3 Fitness.">
              Solicitar Orçamento
            </WhatsAppCTAButton>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/55 text-white font-barlow font-semibold text-[14px] uppercase tracking-[.12em] hover:border-accent hover:text-accent transition-colors"
            >
              Falar com a equipe
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
