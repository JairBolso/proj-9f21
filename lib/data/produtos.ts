import { createClient } from "@/lib/supabase/server";
import type { ProdutoComRelacoes, ProdutoDetalhado } from "@/lib/types";

const PRODUTO_SELECT = `
  id, nome, slug, descricao, ficha_tecnica, fotos, destaque, ativo, garantia,
  linha:linhas ( id, nome, slug ),
  categoria:categorias ( id, nome, slug )
`;

export async function getProdutosAtivos(filters?: {
  linhaSlug?: string;
  categoriaSlug?: string;
  grupoId?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("produtos")
    .select(PRODUTO_SELECT)
    .eq("ativo", true)
    .order("nome");

  if (filters?.linhaSlug) {
    const { data: linha } = await supabase
      .from("linhas")
      .select("id")
      .eq("slug", filters.linhaSlug)
      .single();
    if (linha) query = query.eq("linha_id", linha.id);
  }

  if (filters?.categoriaSlug) {
    const { data: categoria } = await supabase
      .from("categorias")
      .select("id")
      .eq("slug", filters.categoriaSlug)
      .single();
    if (categoria) query = query.eq("categoria_id", categoria.id);
  }

  if (filters?.grupoId) {
    const { data: vinculos } = await supabase
      .from("produto_grupo")
      .select("produto_id")
      .eq("grupo_id", filters.grupoId);
    const ids = (vinculos ?? []).map((v) => v.produto_id);
    query = query.in("id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"]);
  }

  const { data, error } = await query.overrideTypes<
    ProdutoComRelacoes[],
    { merge: false }
  >();
  if (error) throw new Error(error.message);
  return data;
}

export async function getGruposDosProdutos(
  produtoIds: string[],
): Promise<Map<string, { id: string; nome: string }[]>> {
  if (produtoIds.length === 0) return new Map();

  const supabase = await createClient();
  const { data } = await supabase
    .from("produto_grupo")
    .select("produto_id, grupo:grupos_musculares ( id, nome )")
    .in("produto_id", produtoIds)
    .overrideTypes<
      { produto_id: string; grupo: { id: string; nome: string } | null }[],
      { merge: false }
    >();

  const mapa = new Map<string, { id: string; nome: string }[]>();
  for (const row of data ?? []) {
    if (!row.grupo) continue;
    const atual = mapa.get(row.produto_id) ?? [];
    atual.push(row.grupo);
    mapa.set(row.produto_id, atual);
  }
  return mapa;
}

export async function getProdutosDestaque(limit = 12) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produtos")
    .select(PRODUTO_SELECT)
    .eq("ativo", true)
    .eq("destaque", true)
    .order("nome")
    .limit(limit)
    .overrideTypes<ProdutoComRelacoes[], { merge: false }>();

  if (error) throw new Error(error.message);
  return data;
}

export async function getProdutoBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produtos")
    .select(
      `${PRODUTO_SELECT}, grupos:produto_grupo ( grupo:grupos_musculares ( id, nome ) )`,
    )
    .eq("slug", slug)
    .eq("ativo", true)
    .single()
    .overrideTypes<ProdutoDetalhado, { merge: false }>();

  if (error) return null;
  return data;
}

export async function getProdutosRelacionados(
  linhaId: string | null,
  excludeSlug: string,
  limit = 4,
) {
  const supabase = await createClient();
  let query = supabase
    .from("produtos")
    .select(PRODUTO_SELECT)
    .eq("ativo", true)
    .neq("slug", excludeSlug)
    .limit(limit);

  if (linhaId) query = query.eq("linha_id", linhaId);

  const { data, error } = await query.overrideTypes<
    ProdutoComRelacoes[],
    { merge: false }
  >();
  if (error) throw new Error(error.message);
  return data;
}
