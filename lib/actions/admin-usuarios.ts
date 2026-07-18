"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUsuario } from "@/lib/auth";
import type { Papel } from "@/lib/supabase/database.types";

async function exigirAdmin() {
  const usuario = await getCurrentUsuario();
  if (usuario?.papel !== "admin") {
    throw new Error("Apenas administradores podem gerenciar usuários.");
  }
}

export async function criarUsuario(input: {
  nome: string;
  email: string;
  senha: string;
  papel: Papel;
}) {
  await exigirAdmin();

  const adminClient = createAdminClient();
  const { data: authUser, error: authError } =
    await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.senha,
      email_confirm: true,
    });

  if (authError || !authUser.user) {
    throw new Error(authError?.message ?? "Falha ao criar usuário.");
  }

  const { error: dbError } = await adminClient.from("usuarios").insert({
    id: authUser.user.id,
    nome: input.nome,
    email: input.email,
    papel: input.papel,
    ativo: true,
  });

  if (dbError) {
    await adminClient.auth.admin.deleteUser(authUser.user.id);
    throw new Error(dbError.message);
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function atualizarUsuario(
  id: string,
  input: { nome: string; papel: Papel; ativo: boolean },
) {
  await exigirAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("usuarios")
    .update({ nome: input.nome, papel: input.papel, ativo: input.ativo })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function toggleUsuarioAtivo(id: string, ativo: boolean) {
  await exigirAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("usuarios")
    .update({ ativo })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/usuarios");
}

export async function excluirUsuario(id: string) {
  await exigirAdmin();

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/usuarios");
}
