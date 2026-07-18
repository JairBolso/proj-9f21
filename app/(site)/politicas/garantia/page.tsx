import type { Metadata } from "next";
import { PoliticaLayout } from "@/components/site/PoliticaLayout";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export const metadata: Metadata = {
  title: "Garantia e Assistência",
  description:
    "Condições de garantia de fábrica e assistência técnica dos equipamentos R3 Fitness.",
};

export default async function GarantiaPage() {
  const conteudo = await getConteudoSiteMap();

  return (
    <PoliticaLayout titulo="Garantia e Assistência" atualizadoEm="julho de 2026">
      <div
        dangerouslySetInnerHTML={{
          __html: conteudo.politica_garantia_corpo ?? "",
        }}
      />
    </PoliticaLayout>
  );
}
