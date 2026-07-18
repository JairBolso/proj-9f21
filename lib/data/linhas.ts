import { createClient } from "@/lib/supabase/server";

export async function getLinhas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("linhas")
    .select("*")
    .order("ordem")
    .order("nome");

  if (error) throw new Error(error.message);
  return data;
}

export async function getLinhasHome() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("linhas")
    .select("*")
    .eq("exibir_home", true)
    .order("ordem")
    .order("nome");

  if (error) throw new Error(error.message);
  return data;
}

export async function getLinhaBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("linhas")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}
