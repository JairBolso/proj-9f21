"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { FichaTecnicaItem } from "@/lib/supabase/database.types";

export interface ProdutoInput {
  nome: string;
  slug?: string;
  descricao: string;
  linha_id: string | null;
  categoria_id: string | null;
  fotos: string[];
  ficha_tecnica: FichaTecnicaItem[];
  destaque: boolean;
  ativo: boolean;
  garantia: string;
  grupoIds: string[];
}

async function sincronizarGrupos(produtoId: string, grupoIds: string[]) {
  const supabase = await createClient();
  await supabase.from("produto_grupo").delete().eq("produto_id", produtoId);
  if (grupoIds.length > 0) {
    await supabase
      .from("produto_grupo")
      .insert(grupoIds.map((grupoId) => ({ produto_id: produtoId, grupo_id: grupoId })));
  }
}

export async function criarProduto(input: ProdutoInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produtos")
    .insert({
      nome: input.nome,
      slug: input.slug || slugify(input.nome),
      descricao: input.descricao || null,
      linha_id: input.linha_id,
      categoria_id: input.categoria_id,
      fotos: input.fotos,
      ficha_tecnica: input.ficha_tecnica,
      destaque: input.destaque,
      ativo: input.ativo,
      garantia: input.garantia || null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await sincronizarGrupos(data.id, input.grupoIds);

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function atualizarProduto(id: string, input: ProdutoInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("produtos")
    .update({
      nome: input.nome,
      slug: input.slug || slugify(input.nome),
      descricao: input.descricao || null,
      linha_id: input.linha_id,
      categoria_id: input.categoria_id,
      fotos: input.fotos,
      ficha_tecnica: input.ficha_tecnica,
      destaque: input.destaque,
      ativo: input.ativo,
      garantia: input.garantia || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await sincronizarGrupos(id, input.grupoIds);

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function toggleProdutoAtivo(id: string, ativo: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("produtos").update({ ativo }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produtos");
}

export async function toggleProdutoDestaque(id: string, destaque: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("produtos")
    .update({ destaque })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produtos");
}

export async function excluirProduto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produtos");
}
