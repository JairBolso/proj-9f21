import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { DepoimentoForm } from "@/components/admin/depoimentos/DepoimentoForm";

export const metadata: Metadata = { title: "Novo Depoimento" };

export default function NovoDepoimentoPage() {
  return (
    <div>
      <PageHeader title="Novo Depoimento" subtitle="Cadastre um depoimento de cliente" />
      <DepoimentoForm />
    </div>
  );
}
