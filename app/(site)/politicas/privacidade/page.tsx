import type { Metadata } from "next";
import { PoliticaLayout } from "@/components/site/PoliticaLayout";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a R3 Fitness coleta, usa e protege seus dados pessoais.",
};

export default async function PrivacidadePage() {
  const conteudo = await getConteudoSiteMap();

  return (
    <PoliticaLayout titulo="Política de Privacidade" atualizadoEm="julho de 2026">
      <div
        dangerouslySetInnerHTML={{
          __html: conteudo.politica_privacidade_corpo ?? "",
        }}
      />
    </PoliticaLayout>
  );
}
