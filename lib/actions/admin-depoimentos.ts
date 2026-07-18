"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface DepoimentoInput {
  nome: string;
  academia: string;
  cidade: string;
  texto: string;
  imagem_url?: string | null;
  aprovado: boolean;
}

export async function criarDepoimento(input: DepoimentoInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("depoimentos").insert({
    nome: input.nome,
    academia: input.academia || null,
    cidade: input.cidade || null,
    texto: input.texto,
    imagem_url: input.imagem_url ?? null,
    aprovado: input.aprovado,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/depoimentos");
  redirect("/admin/depoimentos");
}

export async function atualizarDepoimento(id: string, input: DepoimentoInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("depoimentos")
    .update({
      nome: input.nome,
      academia: input.academia || null,
      cidade: input.cidade || null,
      texto: input.texto,
      imagem_url: input.imagem_url ?? null,
      aprovado: input.aprovado,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/depoimentos");
  redirect("/admin/depoimentos");
}

export async function toggleDepoimentoAprovado(id: string, aprovado: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("depoimentos")
    .update({ aprovado })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/depoimentos");
}

export async function excluirDepoimento(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("depoimentos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/depoimentos");
}
