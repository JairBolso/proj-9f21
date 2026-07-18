import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoriaForm } from "@/components/admin/categorias/CategoriaForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Editar Categoria" };

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: categoria } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .single();

  if (!categoria) notFound();

  return (
    <div>
      <PageHeader title="Editar Categoria" subtitle={categoria.nome} />
      <CategoriaForm categoria={categoria} />
    </div>
  );
}
