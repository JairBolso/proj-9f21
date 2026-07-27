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

/**
 * Salva várias chaves de uma vez — usado pelos blocos que têm um único botão
 * "Salvar alteração" para mais de um campo (par de banner, pessoa da equipe).
 */
export async function atualizarConteudoVarios(
  itens: { chave: string; valor: string | null }[],
) {
  const supabase = await createClient();

  for (const { chave, valor } of itens) {
    const { error } = await supabase
      .from("conteudo_site")
      .update({ valor })
      .eq("chave", chave);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/conteudo");
}
