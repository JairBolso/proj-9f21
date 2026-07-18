import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { LinhaForm } from "@/components/admin/linhas/LinhaForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Editar Linha" };

export default async function EditarLinhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: linha } = await supabase
    .from("linhas")
    .select("*")
    .eq("id", id)
    .single();

  if (!linha) notFound();

  return (
    <div>
      <PageHeader title="Editar Linha" subtitle={linha.nome} />
      <LinhaForm linha={linha} />
    </div>
  );
}
