import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConteudoManager } from "@/components/admin/conteudo/ConteudoManager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Conteúdo do Site" };

export default async function AdminConteudoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conteudo_site")
    .select("chave, tipo, valor, descricao")
    .order("chave");

  return (
    <div>
      <PageHeader
        title="Conteúdo do Site"
        subtitle="Banners, fotos e textos editáveis do site público"
      />
      <ConteudoManager rows={data ?? []} />
    </div>
  );
}
