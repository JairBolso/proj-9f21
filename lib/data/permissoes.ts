import { createClient } from "@/lib/supabase/server";
import {
  resolverNavItems,
  resolverAcoes,
  papelPodeExecutarAcao,
  type PermissaoOverride,
} from "@/lib/permissions";
import { getCurrentUsuario } from "@/lib/auth";

export async function getOverridesPermissoes(): Promise<PermissaoOverride[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("permissoes")
    .select("papel, item_id, permitido");
  return data ?? [];
}

export async function getNavItemsEfetivos() {
  const overrides = await getOverridesPermissoes();
  return resolverNavItems(overrides);
}

export async function getAcoesEfetivas() {
  const overrides = await getOverridesPermissoes();
  return resolverAcoes(overrides);
}

// Para uso em Server Actions: confere se o usuário logado pode executar
// a ação, buscando o papel dele e os overrides salvos.
export async function usuarioAtualPodeExecutarAcao(actionId: string) {
  const usuario = await getCurrentUsuario();
  if (!usuario) return false;
  const acoes = await getAcoesEfetivas();
  return papelPodeExecutarAcao(usuario.papel, actionId, acoes);
}
