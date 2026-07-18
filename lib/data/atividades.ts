import { createClient } from "@/lib/supabase/server";

export interface Atividade {
  id: string;
  usuario_id: string | null;
  usuario_nome: string;
  acao: string;
  entidade: string | null;
  entidade_id: string | null;
  created_at: string;
}

// Últimas atividades do painel (só admin enxerga, por RLS). O filtro por
// usuário é feito no cliente, dentro do modal.
export async function getAtividades(limite = 300): Promise<Atividade[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("atividades")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite);
  return data ?? [];
}
