import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { PoliticasManager } from "@/components/admin/politicas/PoliticasManager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Páginas de Política" };

const PAGINAS = [
  { chave: "politica_garantia_corpo", label: "Garantia e Assistência", href: "/politicas/garantia" },
  { chave: "politica_entrega_corpo", label: "Entrega e Montagem", href: "/politicas/entrega" },
  { chave: "politica_devolucao_corpo", label: "Reembolso e Devoluções", href: "/politicas/devolucao" },
  { chave: "politica_privacidade_corpo", label: "Política de Privacidade", href: "/politicas/privacidade" },
  { chave: "politica_termos_corpo", label: "Termos de Uso", href: "/politicas/termos" },
];

export default async function AdminPoliticasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conteudo_site")
    .select("chave, valor")
    .in(
      "chave",
      PAGINAS.map((p) => p.chave),
    );

  const valores = Object.fromEntries(
    (data ?? []).map((row) => [row.chave, row.valor ?? ""]),
  );

  return (
    <div>
      <PageHeader
        title="Páginas de Política"
        subtitle="Edite o texto de garantia, entrega, devolução, privacidade e termos"
      />
      <PoliticasManager
        paginas={PAGINAS.map((p) => ({ ...p, valor: valores[p.chave] ?? "" }))}
      />
    </div>
  );
}
