"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function atualizarConteudo(chave: string, valor: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("conteudo_site")
    .update({ valor })
    .eq("chave", chave);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/conteudo");
}
