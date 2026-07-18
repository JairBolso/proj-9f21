import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { NovaCotacaoForm } from "@/components/admin/cotacoes/NovaCotacaoForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nova Cotação" };

interface ProdutoRow {
  id: string;
  nome: string;
  slug: string;
  linha: { nome: string } | null;
}

export default async function NovaCotacaoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("produtos")
    .select("id, nome, slug, linha:linhas ( nome )")
    .eq("ativo", true)
    .order("nome")
    .overrideTypes<ProdutoRow[], { merge: false }>();

  const produtos = (data ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    slug: p.slug,
    linha: p.linha?.nome,
  }));

  return (
    <div>
      <PageHeader
        title="Nova Cotação"
        subtitle="Adicione um lead que chegou por outro canal (telefone, indicação, feira...)"
      />
      <NovaCotacaoForm produtos={produtos} />
    </div>
  );
}
