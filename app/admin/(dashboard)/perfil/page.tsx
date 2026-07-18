import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { PerfilForm } from "@/components/admin/perfil/PerfilForm";
import { getCurrentUsuario } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Meu Perfil" };

export default async function PerfilPage() {
  const usuario = await getCurrentUsuario();
  if (!usuario) redirect("/admin/login");

  return (
    <div>
      <PageHeader title="Meu Perfil" subtitle="Edite seus dados de acesso ao painel" />
      <PerfilForm
        nome={usuario.nome}
        email={usuario.email}
        avatarUrl={usuario.avatar_url}
      />
    </div>
  );
}
