"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Package,
  Menu,
  X,
  UserCircle,
  LogOut,
} from "lucide-react";
import type { AdminNavItem } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/client";
import type { Papel } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

// Itens fixos da barra inferior (filtrados por papel); o resto vai no "Mais".
const BARRA = ["dashboard", "cotacoes", "produtos"];

const ICONES: Record<string, typeof Menu> = {
  dashboard: LayoutDashboard,
  cotacoes: MessageCircle,
  produtos: Package,
};

export function AdminMobileNav({
  papel,
  cotacoesNovasCount,
  navItems,
}: {
  papel: Papel;
  cotacoesNovasCount: number;
  navItems: AdminNavItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [maisAberto, setMaisAberto] = useState(false);

  const permitidos = navItems.filter((i) => i.roles.includes(papel));
  const fixos = permitidos.filter((i) => BARRA.includes(i.id));
  const restantes = permitidos.filter((i) => !BARRA.includes(i.id));

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {maisAberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/60 cursor-default"
            onClick={() => setMaisAberto(false)}
          />
          <div className="absolute bottom-[64px] left-0 right-0 max-h-[70vh] overflow-y-auto bg-admin-card border-t border-admin-border">
            <div className="flex items-center justify-between px-5 py-4 border-b border-admin-divider">
              <span className="font-mono font-bold text-[12px] uppercase tracking-[.1em] text-admin-textMuted">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMaisAberto(false)}
                className="p-1 text-admin-textMuted"
                aria-label="Fechar"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <ul>
              {restantes.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setMaisAberto(false)}
                    className="block px-5 py-3.5 text-[14px] text-admin-textSecondary hover:bg-admin-activeNav active:bg-admin-activeNav"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-admin-divider">
                <Link
                  href="/admin/perfil"
                  onClick={() => setMaisAberto(false)}
                  className="flex items-center gap-2.5 px-5 py-3.5 text-[14px] text-admin-textSecondary hover:bg-admin-activeNav"
                >
                  <UserCircle size={16} strokeWidth={1.8} />
                  Ver Perfil
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-5 py-3.5 text-[14px] text-admin-textSecondary hover:bg-admin-activeNav"
                >
                  <LogOut size={16} strokeWidth={1.8} />
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-16 bg-admin-sidebar border-t border-admin-border grid auto-cols-fr grid-flow-col">
        {fixos.map((item) => {
          const Icon = ICONES[item.id] ?? Menu;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-[.04em]",
                active ? "text-admin-accent" : "text-admin-textMuted",
              )}
            >
              <Icon size={20} strokeWidth={1.8} />
              {item.label.split(" ")[0]}
              {item.id === "cotacoes" && cotacoesNovasCount > 0 && (
                <span className="absolute top-2 right-1/2 translate-x-4 min-w-[16px] h-4 px-1 rounded-full bg-admin-accent text-r3-black text-[10px] font-bold flex items-center justify-center">
                  {cotacoesNovasCount}
                </span>
              )}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMaisAberto((v) => !v)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-[.04em]",
            maisAberto ? "text-admin-accent" : "text-admin-textMuted",
          )}
        >
          <Menu size={20} strokeWidth={1.8} />
          Mais
        </button>
      </nav>
    </>
  );
}
