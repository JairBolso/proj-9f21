"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Sun, Moon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/site/Logo";
import { useAdminTheme } from "@/components/admin/AdminThemeShell";

export function AdminTopbar() {
  const router = useRouter();
  const { tema, alternarTema } = useAdminTheme();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-20 h-16 bg-admin-bg border-b border-admin-border flex items-center justify-between lg:justify-end gap-3 px-4 sm:px-8">
      <div className="lg:hidden">
        <Logo variant={tema === "light" ? "black" : "white"} className="h-6" />
      </div>

      <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={alternarTema}
        aria-label="Alternar modo claro/escuro"
        title={tema === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
        className="relative w-[56px] h-7 flex-shrink-0 border border-admin-borderBtn bg-admin-card flex items-center justify-between px-[6px]"
      >
        <Moon size={13} strokeWidth={2.2} className="relative z-10 text-admin-textMuted" />
        <Sun size={13} strokeWidth={2.2} className="relative z-10 text-admin-textMuted" />
        <span
          className="absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] bg-admin-accent flex items-center justify-center transition-[left] z-20"
          style={{ left: tema === "dark" ? "2px" : "30px" }}
        >
          {tema === "dark" ? (
            <Moon size={13} strokeWidth={2.4} className="text-r3-black" />
          ) : (
            <Sun size={13} strokeWidth={2.4} className="text-r3-black" />
          )}
        </span>
      </button>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 border border-admin-borderBtn text-admin-textMuted text-[12px] font-mono font-semibold uppercase tracking-[.08em] hover:border-admin-accent hover:text-admin-accent transition-colors"
      >
        <span className="hidden sm:inline">Ver site</span>
        <ExternalLink size={14} strokeWidth={2} />
      </a>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 px-4 py-2 border border-admin-borderBtn text-admin-textMuted text-[12px] font-mono font-semibold uppercase tracking-[.08em] hover:border-admin-danger hover:text-admin-danger transition-colors"
      >
        <span className="hidden sm:inline">Sair</span>
        <LogOut size={14} strokeWidth={2} />
      </button>
      </div>
    </div>
  );
}
