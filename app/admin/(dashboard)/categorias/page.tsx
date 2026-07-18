import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoriasTable } from "@/components/admin/categorias/CategoriasTable";
import { getCategorias } from "@/lib/data/categorias";

export const metadata: Metadata = { title: "Categorias" };

export default async function AdminCategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div>
      <PageHeader
        title="Categorias"
        subtitle={`${categorias.length} categorias cadastradas`}
        actions={
          <Link
            href="/admin/categorias/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors"
          >
            <Plus size={15} strokeWidth={2.4} />
            Nova Categoria
          </Link>
        }
      />

      <CategoriasTable categorias={categorias} />
    </div>
  );
}
