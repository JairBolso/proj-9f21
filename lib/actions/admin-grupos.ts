"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarGrupoMuscular(nome: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("grupos_musculares").insert({ nome });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/grupos-musculares");
}

export async function atualizarGrupoMuscular(id: string, nome: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("grupos_musculares")
    .update({ nome })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/grupos-musculares");
}

export async function excluirGrupoMuscular(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("grupos_musculares")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/grupos-musculares");
}
