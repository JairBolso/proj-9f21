import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProdutoForm } from "@/components/admin/produtos/ProdutoForm";
import { getLinhas } from "@/lib/data/linhas";
import { getCategorias } from "@/lib/data/categorias";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Editar Produto" };

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: produto }, linhas, categorias, { data: grupos }, { data: grupoLinks }] =
    await Promise.all([
      supabase.from("produtos").select("*").eq("id", id).single(),
      getLinhas(),
      getCategorias(),
      supabase.from("grupos_musculares").select("id, nome").order("nome"),
      supabase.from("produto_grupo").select("grupo_id").eq("produto_id", id),
    ]);

  if (!produto) notFound();

  return (
    <div>
      <PageHeader title="Editar Produto" subtitle={produto.nome} />
      <ProdutoForm
        produto={{
          ...produto,
          grupoIds: (grupoLinks ?? []).map((g) => g.grupo_id),
        }}
        linhas={linhas}
        categorias={categorias}
        gruposMusculares={grupos ?? []}
      />
    </div>
  );
}
