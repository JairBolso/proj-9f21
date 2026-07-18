import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoriaForm } from "@/components/admin/categorias/CategoriaForm";

export const metadata: Metadata = { title: "Nova Categoria" };

export default function NovaCategoriaPage() {
  return (
    <div>
      <PageHeader
        title="Nova Categoria"
        subtitle="Cadastre uma nova categoria de produtos"
      />
      <CategoriaForm />
    </div>
  );
}
