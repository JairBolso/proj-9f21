import { createClient } from "@/lib/supabase/server";
import type { StatusCotacao } from "@/lib/supabase/database.types";

export interface CotacaoComVendedor {
  id: string;
  nome: string | null;
  whatsapp: string | null;
  email: string | null;
  cidade: string | null;
  tipo_espaco: string | null;
  produtos: { produto_id: string; nome: string; slug: string; linha?: string; qtd: number }[];
  origem_utm: Record<string, string> | null;
  status: StatusCotacao;
  vendedor_id: string | null;
  valor_venda: number | null;
  valor_estimado: number | null;
  produtos_vendidos: { produto_id: string; nome: string; slug: string; linha?: string; qtd: number }[] | null;
  anotacoes: string | null;
  created_at: string;
  updated_at: string;
  vendedor: { id: string; nome: string } | null;
}

const COTACAO_SELECT = `
  id, nome, whatsapp, email, cidade, tipo_espaco, produtos, origem_utm,
  status, vendedor_id, valor_venda, valor_estimado, produtos_vendidos,
  anotacoes, created_at, updated_at,
  vendedor:usuarios ( id, nome )
`;

export async function getCotacoes(filters?: {
  status?: StatusCotacao;
  vendedorId?: string;
  from?: string;
  to?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("cotacoes")
    .select(COTACAO_SELECT)
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.vendedorId) query = query.eq("vendedor_id", filters.vendedorId);
  if (filters?.from) query = query.gte("created_at", filters.from);
  if (filters?.to) query = query.lte("created_at", filters.to);

  const { data, error } = await query.overrideTypes<
    CotacaoComVendedor[],
    { merge: false }
  >();

  if (error) throw new Error(error.message);
  return data;
}

export async function getCotacaoById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cotacoes")
    .select(COTACAO_SELECT)
    .eq("id", id)
    .single()
    .overrideTypes<CotacaoComVendedor, { merge: false }>();

  if (error) return null;
  return data;
}

// Inclui admin: qualquer admin também pode ser vendedor responsável por
// uma cotação, além dos usuários com papel "vendedor".
export async function getVendedores() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome")
    .in("papel", ["vendedor", "admin"])
    .eq("ativo", true)
    .order("nome");

  if (error) throw new Error(error.message);
  return data;
}
