"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function atualizarMeuPerfil(input: {
  nome: string;
  avatar_url: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, erro: "Sessão expirada." };

  const { error } = await supabase
    .from("usuarios")
    .update({ nome: input.nome, avatar_url: input.avatar_url })
    .eq("id", user.id);

  if (error) return { ok: false as const, erro: error.message };

  revalidatePath("/admin", "layout");
  return { ok: true as const };
}

export async function alterarMinhaSenha(novaSenha: string) {
  if (novaSenha.length < 6) {
    return { ok: false as const, erro: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: novaSenha });

  if (error) return { ok: false as const, erro: error.message };
  return { ok: true as const };
}
