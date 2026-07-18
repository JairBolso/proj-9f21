import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProdutosTable, type ProdutoRow } from "@/components/admin/produtos/ProdutosTable";
import { createClient } from "@/lib/supabase/server";
import { getLinhas } from "@/lib/data/linhas";
import { getCategorias } from "@/lib/data/categorias";

export const metadata: Metadata = { title: "Produtos" };

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    destaque?: string;
    linha?: string;
    categoria?: string;
  }>;
}) {
  const { status, destaque, linha, categoria } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("produtos")
    .select(
      `id, nome, fotos, ativo, destaque,
       linha:linhas ( nome ),
       categoria:categorias ( nome ),
       grupos:produto_grupo ( grupo:grupos_musculares ( nome ) )`,
    )
    .order("nome");

  if (status === "ativo") query = query.eq("ativo", true);
  if (status === "inativo") query = query.eq("ativo", false);
  if (destaque === "sim") query = query.eq("destaque", true);
  if (destaque === "nao") query = query.eq("destaque", false);
  if (linha) query = query.eq("linha_id", linha);
  if (categoria) query = query.eq("categoria_id", categoria);

  const [{ data }, linhas, categorias] = await Promise.all([
    query.overrideTypes<ProdutoRow[], { merge: false }>(),
    getLinhas(),
    getCategorias(),
  ]);

  const produtos = data ?? [];

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle={`${produtos.length} produtos cadastrados`}
        actions={
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors"
          >
            <Plus size={15} strokeWidth={2.4} />
            Novo Produto
          </Link>
        }
      />

      <ProdutosTable produtos={produtos} linhas={linhas} categorias={categorias} />
    </div>
  );
}
