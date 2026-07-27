import type { Metadata } from "next";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { ContatoForm } from "@/components/site/ContatoForm";
import { SmartImage } from "@/components/site/SmartImage";
import { buildWhatsAppLink, defaultWhatsAppNumber } from "@/lib/whatsapp";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Receba um projeto sob medida de equipamentos para academia. Fale com a R3 Fitness por WhatsApp, e-mail ou formulário.",
};

const BENEFICIOS = [
  "Projeto sob medida para o seu espaço",
  "Atendimento direto com quem fabrica",
  "Entrega e montagem inclusas",
  "Condições especiais para projetos completos",
];

export default async function ContatoPage() {
  const conteudo = await getConteudoSiteMap();

  const waLink = buildWhatsAppLink(
    defaultWhatsAppNumber(),
    "Olá! Gostaria de falar com a R3 Fitness.",
  );

  return (
    <>
      <section className="relative bg-r3-black text-white overflow-hidden">
        {conteudo.hero_contato_imagem && (
          <>
            <SmartImage
              src={conteudo.hero_contato_imagem}
              srcMobile={conteudo.hero_contato_imagem_mobile}
              alt="Equipe R3 Fitness em atendimento"
              label="Banner da página de contato"
              dark
              className="absolute inset-0 opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-r3-black via-r3-black/85 to-r3-black/50" />
          </>
        )}
        <div className="relative max-w-[1280px] mx-auto px-6 py-16 sm:py-20">
          <h1 className="font-oswald font-bold uppercase text-[clamp(32px,5vw,54px)] leading-[1.02] max-w-[18ch]">
            Receba um projeto sob medida
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12">
          <div>
            <ContatoForm />
          </div>

          <div className="space-y-6">
            <div className="bg-r3-black text-white p-8">
              <h3 className="font-oswald font-semibold uppercase text-[18px] mb-5">
                Fale direto com a gente
              </h3>
              <ul className="space-y-4 text-[14px]">
                <li className="flex items-center gap-3 text-r3-mutedDark">
                  <Phone size={18} strokeWidth={1.8} className="text-accent flex-shrink-0" />
                  (17) 99716-8842
                </li>
                <li className="flex items-center gap-3 text-r3-mutedDark">
                  <Mail size={18} strokeWidth={1.8} className="text-accent flex-shrink-0" />
                  orcamento@r3fitness.com.br
                </li>
                <li className="flex items-center gap-3 text-r3-mutedDark">
                  <Clock size={18} strokeWidth={1.8} className="text-accent flex-shrink-0" />
                  Seg a sex, 8h às 17h
                </li>
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-r3-black font-barlow font-bold text-[13px] uppercase tracking-[.1em] hover:brightness-90 transition-[filter]"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Chamar no WhatsApp
              </a>
            </div>

            <div className="border border-r3-border p-8">
              <h3 className="font-oswald font-semibold uppercase text-[18px] text-r3-heading mb-4">
                Por que solicitar um orçamento?
              </h3>
              <ul className="space-y-3">
                {BENEFICIOS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[14px] text-r3-body"
                  >
                    <span className="text-accent mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
