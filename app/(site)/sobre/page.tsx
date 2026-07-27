import type { Metadata } from "next";
import { SmartImage } from "@/components/site/SmartImage";
import { CtaFundo } from "@/components/site/CtaFundo";
import { WhatsAppCTAButton } from "@/components/site/WhatsAppCTAButton";
import { getConteudoSiteMap } from "@/lib/data/conteudo";
import { Weight, Factory, HeartHandshake, MapPinned } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "9 anos fabricando equipamentos de academia no Brasil. Conheça a história, o processo de fabricação e a equipe da R3 Fitness.",
};

const PROCESSO = [
  { chave: "sobre_processo_1_imagem", numero: "01", titulo: "Corte e usinagem", descricao: "Corte de precisão em tubos e chapas de aço estrutural." },
  { chave: "sobre_processo_2_imagem", numero: "02", titulo: "Solda estrutural", descricao: "Solda robusta para suportar cargas de uso intenso." },
  { chave: "sobre_processo_3_imagem", numero: "03", titulo: "Pintura eletrostática", descricao: "Acabamento resistente a impacto, suor e umidade." },
  { chave: "sobre_processo_4_imagem", numero: "04", titulo: "Montagem e teste", descricao: "Cada equipamento é montado e testado antes de sair da fábrica." },
];

const VALORES = [
  { icon: Weight, titulo: "Robustez sem exagero", descricao: "Equipamentos dimensionados para uso profissional intenso, sem peso ou custo desnecessário." },
  { icon: Factory, titulo: "Fabricação própria", descricao: "Da usinagem à pintura, tudo acontece dentro da nossa fábrica." },
  { icon: HeartHandshake, titulo: "Compromisso pós-venda", descricao: "Suporte técnico direto com quem fabricou o equipamento." },
  { icon: MapPinned, titulo: "Brasil inteiro", descricao: "Entrega e montagem em qualquer estado, com equipe própria." },
];

// Nome e função de cada pessoa são editáveis em Conteúdo do Site; os valores
// abaixo só entram se a chave estiver vazia no banco.
const EQUIPE = [
  { indice: 1, nome: "Ricardo Alves", cargo: "Diretor de Fábrica" },
  { indice: 2, nome: "Renata Souza", cargo: "Engenharia de Produto" },
  { indice: 3, nome: "Rafael Torres", cargo: "Coordenação Comercial" },
  { indice: 4, nome: "Camila Duarte", cargo: "Suporte Técnico" },
];

export default async function SobrePage() {
  const conteudo = await getConteudoSiteMap();

  return (
    <>
      <section className="relative bg-r3-black text-white overflow-hidden">
        <SmartImage
          src={conteudo.hero_sobre_imagem}
          srcMobile={conteudo.hero_sobre_imagem_mobile}
          alt="Fachada ou chão de fábrica R3"
          label="Foto: fachada ou chão de fábrica R3"
          dark
          className="absolute inset-0 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-r3-black via-r3-black/80 to-r3-black/40" />
        <div className="relative max-w-[1280px] mx-auto px-6 py-20 sm:py-28">
          <h1 className="font-oswald font-bold uppercase text-[clamp(32px,5.4vw,64px)] leading-[1.02] max-w-[18ch]">
            9 anos fabricando força para o Brasil
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-oswald font-semibold uppercase text-[clamp(28px,3.6vw,40px)] leading-[1.05] text-r3-heading">
              Nascemos do chão de fábrica, não de uma vitrine
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-r3-body">
              A R3 Fitness nasceu com um propósito simples: fabricar
              equipamentos de academia robustos, seguros e duráveis, sem
              depender de terceiros. Hoje, cada máquina que sai da nossa
              fábrica passa pelas mesmas mãos que projetam, soldam, pintam e
              testam — do primeiro corte de aço até a entrega na sua
              academia.
            </p>
          </div>
          <SmartImage
            src={conteudo.sobre_historia_imagem}
            alt="Linha de produção R3"
            label="Foto: linha de produção R3"
            className="aspect-[4/3]"
          />
        </div>
      </section>

      <section className="bg-r3-black text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(28px,3.6vw,40px)] leading-[1.05]">
            Processo de fabricação
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESSO.map((etapa) => (
              <div key={etapa.numero}>
                <SmartImage
                  src={conteudo[etapa.chave]}
                  alt={etapa.titulo}
                  label={etapa.titulo}
                  dark
                  className="aspect-[4/3]"
                />
                <div className="mt-4 font-oswald font-bold text-accent text-[15px]">
                  {etapa.numero}
                </div>
                <h3 className="mt-1 font-barlow font-semibold text-[15px] uppercase">
                  {etapa.titulo}
                </h3>
                <p className="mt-1 text-[13px] text-r3-mutedDark leading-relaxed">
                  {etapa.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(28px,3.6vw,40px)] leading-[1.05] text-r3-heading">
            Valores
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALORES.map((valor) => (
              <div key={valor.titulo}>
                <div className="w-12 h-12 bg-accent flex items-center justify-center">
                  <valor.icon size={22} strokeWidth={1.8} className="text-r3-black" />
                </div>
                <h3 className="mt-4 font-barlow font-semibold text-[16px] uppercase text-r3-heading">
                  {valor.titulo}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-r3-muted">
                  {valor.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-r3-offwhite">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(28px,3.6vw,40px)] leading-[1.05] text-r3-heading">
            Equipe
          </h2>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {EQUIPE.map((pessoa) => {
              const nome =
                conteudo[`sobre_equipe_${pessoa.indice}_nome`] || pessoa.nome;
              const cargo =
                conteudo[`sobre_equipe_${pessoa.indice}_cargo`] || pessoa.cargo;

              return (
                <div key={pessoa.indice}>
                  <SmartImage
                    src={conteudo[`sobre_equipe_${pessoa.indice}_imagem`]}
                    alt={nome}
                    label={nome}
                    className="aspect-square"
                  />
                  <h3 className="mt-3 font-barlow font-semibold text-[15px] text-r3-heading">
                    {nome}
                  </h3>
                  <p className="text-[13px] text-r3-muted">{cargo}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-r3-black text-white text-center">
        <CtaFundo
          src={conteudo.cta_final_imagem}
          srcMobile={conteudo.cta_final_imagem_mobile}
        />
        <div className="relative max-w-[720px] mx-auto px-6 py-20">
          <h2 className="font-oswald font-semibold uppercase text-[clamp(28px,4vw,42px)] leading-[1.05]">
            Quer conhecer a R3 de perto?
          </h2>
          <div className="mt-8">
            <WhatsAppCTAButton mensagem="Olá! Gostaria de conhecer mais sobre a R3 Fitness.">
              Solicitar Orçamento
            </WhatsAppCTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
