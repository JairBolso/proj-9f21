import type { Metadata } from "next";
import { PoliticaLayout } from "@/components/site/PoliticaLayout";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export const metadata: Metadata = {
  title: "Entrega e Montagem",
  description:
    "Como funciona a entrega e a montagem dos equipamentos R3 Fitness em todo o Brasil.",
};

export default async function EntregaPage() {
  const conteudo = await getConteudoSiteMap();

  return (
    <PoliticaLayout titulo="Entrega e Montagem" atualizadoEm="julho de 2026">
      <div
        dangerouslySetInnerHTML={{
          __html: conteudo.politica_entrega_corpo ?? "",
        }}
      />
    </PoliticaLayout>
  );
}
