import { createClient } from "@/lib/supabase/server";

export async function getIntegracoes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("integracoes")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data;
}
