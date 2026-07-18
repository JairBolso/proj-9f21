import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { UsuarioForm } from "@/components/admin/usuarios/UsuarioForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Editar Usuário" };

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  if (!usuario) notFound();

  return (
    <div>
      <PageHeader title="Editar Usuário" subtitle={usuario.nome} />
      <UsuarioForm usuario={usuario} />
    </div>
  );
}
