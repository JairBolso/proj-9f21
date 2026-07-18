import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { LinhaForm } from "@/components/admin/linhas/LinhaForm";

export const metadata: Metadata = { title: "Nova Linha" };

export default function NovaLinhaPage() {
  return (
    <div>
      <PageHeader title="Nova Linha" subtitle="Cadastre uma nova linha de produtos" />
      <LinhaForm />
    </div>
  );
}
