import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { DepoimentoForm } from "@/components/admin/depoimentos/DepoimentoForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Editar Depoimento" };

export default async function EditarDepoimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: depoimento } = await supabase
    .from("depoimentos")
    .select("*")
    .eq("id", id)
    .single();

  if (!depoimento) notFound();

  return (
    <div>
      <PageHeader title="Editar Depoimento" subtitle={depoimento.nome} />
      <DepoimentoForm depoimento={depoimento} />
    </div>
  );
}
