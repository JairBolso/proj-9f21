import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProdutoForm } from "@/components/admin/produtos/ProdutoForm";
import { getLinhas } from "@/lib/data/linhas";
import { getCategorias } from "@/lib/data/categorias";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Novo Produto" };

export default async function NovoProdutoPage() {
  const supabase = await createClient();
  const [linhas, categorias, { data: grupos }] = await Promise.all([
    getLinhas(),
    getCategorias(),
    supabase.from("grupos_musculares").select("id, nome").order("nome"),
  ]);

  return (
    <div>
      <PageHeader title="Novo Produto" subtitle="Cadastre um novo produto no catálogo" />
      <ProdutoForm
        linhas={linhas}
        categorias={categorias}
        gruposMusculares={grupos ?? []}
      />
    </div>
  );
}
