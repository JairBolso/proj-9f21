import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { IntegracoesForm } from "@/components/admin/integracoes/IntegracoesForm";
import { getIntegracoes } from "@/lib/data/integracoes";

export const metadata: Metadata = { title: "Integrações" };

export default async function AdminIntegracoesPage() {
  const integracoes = await getIntegracoes();

  return (
    <div>
      <PageHeader
        title="Integrações"
        subtitle="Meta Pixel, Google Tag Manager e scripts customizados do site"
      />
      <IntegracoesForm integracoes={integracoes} />
    </div>
  );
}
