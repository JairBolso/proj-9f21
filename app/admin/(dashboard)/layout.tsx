import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminThemeShell } from "@/components/admin/AdminThemeShell";
import { LeadRealtimeListener } from "@/components/admin/LeadRealtimeListener";
import { getCurrentUsuario } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getNavItemsEfetivos } from "@/lib/data/permissoes";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await getCurrentUsuario();
  if (!usuario) redirect("/admin/login");

  const navItems = await getNavItemsEfetivos();

  const podeVerCotacoes =
    usuario.papel === "admin" || usuario.papel === "vendedor";

  let cotacoesNovasCount = 0;
  if (podeVerCotacoes) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("cotacoes")
      .select("id", { count: "exact", head: true })
      .eq("status", "novo");
    cotacoesNovasCount = count ?? 0;
  }

  return (
    <AdminThemeShell>
      {podeVerCotacoes && <LeadRealtimeListener />}
      <div className="hidden lg:block">
        <AdminSidebar
          papel={usuario.papel}
          nome={usuario.nome}
          cotacoesNovasCount={cotacoesNovasCount}
          avatarUrl={usuario.avatar_url}
          navItems={navItems}
        />
      </div>
      <div className="flex-1 min-w-0">
        <AdminTopbar />
        <main className="px-4 sm:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <AdminMobileNav
        papel={usuario.papel}
        cotacoesNovasCount={cotacoesNovasCount}
        navItems={navItems}
      />
    </AdminThemeShell>
  );
}
