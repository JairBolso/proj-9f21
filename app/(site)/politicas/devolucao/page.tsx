import type { Metadata } from "next";
import { PoliticaLayout } from "@/components/site/PoliticaLayout";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export const metadata: Metadata = {
  title: "Reembolso e Devoluções",
  description:
    "Condições para devolução de equipamentos e prazos de reembolso da R3 Fitness.",
};

export default async function DevolucaoPage() {
  const conteudo = await getConteudoSiteMap();

  return (
    <PoliticaLayout titulo="Reembolso e Devoluções" atualizadoEm="julho de 2026">
      <div
        dangerouslySetInnerHTML={{
          __html: conteudo.politica_devolucao_corpo ?? "",
        }}
      />
    </PoliticaLayout>
  );
}
