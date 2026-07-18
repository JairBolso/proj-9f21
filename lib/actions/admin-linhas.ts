"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export interface LinhaInput {
  nome: string;
  slug?: string;
  descricao: string;
  imagem_url?: string | null;
  exibir_home: boolean;
  ordem: number;
}

export async function criarLinha(input: LinhaInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("linhas").insert({
    nome: input.nome,
    slug: input.slug || slugify(input.nome),
    descricao: input.descricao || null,
    imagem_url: input.imagem_url ?? null,
    exibir_home: input.exibir_home,
    ordem: input.ordem,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/linhas");
  redirect("/admin/linhas");
}

export async function atualizarLinha(id: string, input: LinhaInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("linhas")
    .update({
      nome: input.nome,
      slug: input.slug || slugify(input.nome),
      descricao: input.descricao || null,
      imagem_url: input.imagem_url ?? null,
      exibir_home: input.exibir_home,
      ordem: input.ordem,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/linhas");
  redirect("/admin/linhas");
}

export async function toggleLinhaExibirHome(id: string, exibirHome: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("linhas")
    .update({ exibir_home: exibirHome })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/linhas");
}

export async function excluirLinha(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("linhas").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/linhas");
}
