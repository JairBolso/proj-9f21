import type { Metadata } from "next";
import { PoliticaLayout } from "@/components/site/PoliticaLayout";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site e da loja R3 Fitness.",
};

export default async function TermosPage() {
  const conteudo = await getConteudoSiteMap();

  return (
    <PoliticaLayout titulo="Termos de Uso" atualizadoEm="julho de 2026">
      <div
        dangerouslySetInnerHTML={{
          __html: conteudo.politica_termos_corpo ?? "",
        }}
      />
    </PoliticaLayout>
  );
}
