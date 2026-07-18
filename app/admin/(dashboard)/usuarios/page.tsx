import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { UsuariosTable } from "@/components/admin/usuarios/UsuariosTable";
import { PermissoesModal } from "@/components/admin/usuarios/PermissoesModal";
import { AtividadesModal } from "@/components/admin/usuarios/AtividadesModal";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUsuario } from "@/lib/auth";
import { getNavItemsEfetivos, getAcoesEfetivas } from "@/lib/data/permissoes";
import { getAtividades } from "@/lib/data/atividades";

export const metadata: Metadata = { title: "Usuários" };

export default async function AdminUsuariosPage() {
  const supabase = await createClient();
  const [{ data }, usuarioAtual, navItems, acoes] = await Promise.all([
    supabase.from("usuarios").select("*").order("nome"),
    getCurrentUsuario(),
    getNavItemsEfetivos(),
    getAcoesEfetivas(),
  ]);
  const usuarios = data ?? [];
  const ehAdmin = usuarioAtual?.papel === "admin";
  const atividades = ehAdmin ? await getAtividades() : [];

  return (
    <div>
      <PageHeader
        title="Usuários"
        subtitle={`${usuarios.length} usuários com acesso ao painel`}
        actions={
          <>
            {ehAdmin && <AtividadesModal atividades={atividades} />}
            <PermissoesModal
              navItems={navItems}
              acoes={acoes}
              podeEditar={ehAdmin}
            />
            <Link
              href="/admin/usuarios/novo"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors"
            >
              <Plus size={15} strokeWidth={2.4} />
              Novo Usuário
            </Link>
          </>
        }
      />

      <UsuariosTable usuarios={usuarios} />
    </div>
  );
}
