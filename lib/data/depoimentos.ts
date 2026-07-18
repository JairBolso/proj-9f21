import { createClient } from "@/lib/supabase/server";

export async function getDepoimentosAprovados() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("depoimentos")
    .select("*")
    .eq("aprovado", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
