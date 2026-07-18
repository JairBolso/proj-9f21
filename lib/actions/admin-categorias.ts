"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export interface CategoriaInput {
  nome: string;
  slug?: string;
  imagem_url?: string | null;
  exibir_home: boolean;
  ordem: number;
}

export async function criarCategoria(input: CategoriaInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("categorias").insert({
    nome: input.nome,
    slug: input.slug || slugify(input.nome),
    imagem_url: input.imagem_url ?? null,
    exibir_home: input.exibir_home,
    ordem: input.ordem,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function atualizarCategoria(id: string, input: CategoriaInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categorias")
    .update({
      nome: input.nome,
      slug: input.slug || slugify(input.nome),
      imagem_url: input.imagem_url ?? null,
      exibir_home: input.exibir_home,
      ordem: input.ordem,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function toggleCategoriaExibirHome(
  id: string,
  exibirHome: boolean,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categorias")
    .update({ exibir_home: exibirHome })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categorias");
}

export async function excluirCategoria(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categorias");
}
