import { createClient } from "@/lib/supabase/server";

export async function getConteudoSiteMap(): Promise<Record<string, string | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_site")
    .select("chave, valor");

  if (error) return {};
  return Object.fromEntries(data.map((row) => [row.chave, row.valor]));
}
