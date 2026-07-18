import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { UsuarioForm } from "@/components/admin/usuarios/UsuarioForm";

export const metadata: Metadata = { title: "Novo Usuário" };

export default function NovoUsuarioPage() {
  return (
    <div>
      <PageHeader
        title="Novo Usuário"
        subtitle="Crie um acesso ao painel para um membro da equipe"
      />
      <UsuarioForm />
    </div>
  );
}
