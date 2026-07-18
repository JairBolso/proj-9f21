import { createClient } from "@/lib/supabase/server";
import { getCurrentUsuario } from "@/lib/auth";

// Helper server-side chamado dentro das Server Actions para registrar uma
// atividade no log global de auditoria. Nunca lança: falha de log não
// deve derrubar a ação principal.
export async function registrarAtividade(
  acao: string,
  entidade?: string,
  entidadeId?: string,
) {
  try {
    const usuario = await getCurrentUsuario();
    const supabase = await createClient();
    await supabase.from("atividades").insert({
      usuario_id: usuario?.id ?? null,
      usuario_nome: usuario?.nome ?? "sistema",
      acao,
      entidade: entidade ?? null,
      entidade_id: entidadeId ?? null,
    });
  } catch {
    // silencioso de propósito — ver comentário acima
  }
}
