"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUsuario } from "@/lib/auth";
import type { Papel } from "@/lib/supabase/database.types";

async function exigirAdmin() {
  const usuario = await getCurrentUsuario();
  if (usuario?.papel !== "admin") {
    throw new Error("Apenas administradores podem gerenciar permissões.");
  }
}

export async function alternarPermissao(
  papel: Papel,
  itemId: string,
  permitido: boolean,
) {
  await exigirAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("permissoes")
    .upsert(
      { papel, item_id: itemId, permitido },
      { onConflict: "papel,item_id" },
    );

  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
}

export async function redefinirPermissoesPadrao() {
  await exigirAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("permissoes")
    .delete()
    .not("papel", "is", null);

  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
}
