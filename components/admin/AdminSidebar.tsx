"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/client";
import { useAdminTheme } from "@/components/admin/AdminThemeShell";
import {
  Zap,
  LayoutDashboard,
  MessageCircle,
  Package,
  Layers,
  Grid3x3,
  Dumbbell,
  Star,
  Settings,
  Users,
  Image as ImageIcon,
  FileText,
  ChevronUp,
  UserCircle,
  LogOut,
} from "lucide-react";
import type { AdminNavItem } from "@/lib/permissions";
import type { Papel } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Zap> = {
  "quick-start": Zap,
  dashboard: LayoutDashboard,
  cotacoes: MessageCircle,
  produtos: Package,
  linhas: Layers,
  categorias: Grid3x3,
  "grupos-musculares": Dumbbell,
  depoimentos: Star,
  conteudo: ImageIcon,
  politicas: FileText,
  integracoes: Settings,
  usuarios: Users,
};

const SECOES = ["Geral", "Catálogo", "Conteúdo", "Sistema"] as const;

export function AdminSidebar({
  papel,
  nome,
  cotacoesNovasCount,
  avatarUrl,
  navItems,
}: {
  papel: Papel;
  nome: string;
  cotacoesNovasCount: number;
  avatarUrl?: string | null;
  navItems: AdminNavItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { tema } = useAdminTheme();
  const [menuAberto, setMenuAberto] = useState(false);
  const iniciais = nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="relative w-[252px] flex-shrink-0 bg-admin-sidebar border-r border-admin-border flex flex-col h-screen sticky top-0">
      <div className="px-[22px] py-[20px]">
        <Logo variant={tema === "light" ? "black" : "white"} className="h-7" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
        {SECOES.map((secao) => {
          const items = navItems.filter(
            (item) => item.section === secao && item.roles.includes(papel),
          );
          if (items.length === 0) return null;

          return (
            <div key={secao}>
              <div className="px-3 mb-1.5 font-mono font-bold text-[10px] uppercase tracking-[.18em] text-admin-sectionLabel">
                {secao}
              </div>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = ICONS[item.id];
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-[11px] px-3 py-2.5 text-[14px] border-l-2 transition-colors",
                          active
                            ? "bg-admin-activeNav text-admin-text border-admin-accent"
                            : "text-admin-textMuted border-transparent hover:bg-admin-activeNav hover:text-admin-text",
                        )}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                          className={active ? "text-admin-accent" : ""}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.id === "cotacoes" && cotacoesNovasCount > 0 && (
                          <span className="bg-admin-accent text-r3-black text-[11px] font-mono font-bold px-1.5 py-0.5 leading-none">
                            {cotacoesNovasCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {menuAberto && (
        <>
          <button
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setMenuAberto(false)}
          />
          <div className="absolute bottom-[68px] left-4 right-4 z-40 bg-admin-card border border-admin-border shadow-lg">
            <Link
              href="/admin/perfil"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-admin-textSecondary hover:bg-admin-activeNav hover:text-admin-text transition-colors"
            >
              <UserCircle size={16} strokeWidth={1.8} />
              Ver Perfil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-admin-textSecondary hover:bg-admin-activeNav hover:text-admin-danger transition-colors"
            >
              <LogOut size={16} strokeWidth={1.8} />
              Sair
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setMenuAberto((v) => !v)}
        className="relative z-40 border-t border-admin-border px-4 py-4 flex items-center gap-3 hover:bg-admin-activeNav transition-colors"
      >
        <div className="w-[34px] h-[34px] bg-admin-accent text-r3-black font-mono font-bold text-[12px] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            iniciais
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[13px] text-admin-text truncate">{nome}</div>
          <div className="text-[11px] text-admin-textMuted capitalize">
            {papel}
          </div>
        </div>
        <ChevronUp
          size={15}
          strokeWidth={2}
          className={cn(
            "text-admin-textMuted transition-transform",
            menuAberto ? "" : "rotate-180",
          )}
        />
      </button>
    </aside>
  );
}
