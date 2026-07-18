"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Toast {
  id: string;
  nome: string;
}

// Escuta INSERT/UPDATE em cotacoes via Supabase Realtime. Quando um lead
// novo chega: dispara notificação do navegador (se permitida), mostra um
// toast dentro do painel (não depende de permissão do navegador) e
// atualiza os Server Components (dashboard, badge da sidebar, listagem)
// via refresh. Mudanças de status/vendedor feitas por outra pessoa também
// disparam refresh, silenciosamente, para manter tudo ao vivo sem F5.
export function LeadRealtimeListener() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const supabase = createClient();
    const channel = supabase
      .channel("leads-novos")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cotacoes" },
        (payload) => {
          const nome =
            (payload.new as { nome?: string | null }).nome ?? "Lead do site";

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("🔔 Novo lead recebido!", {
              body: `${nome} solicitou um orçamento.`,
              icon: "/icon.png",
              tag: "novo-lead",
            });
          }

          const id = crypto.randomUUID();
          setToasts((prev) => [...prev, { id, nome }]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, 8000);

          router.refresh();
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "cotacoes" },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[300px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-lead flex items-start gap-3 bg-admin-card border border-admin-accent/50 shadow-lg p-4"
        >
          <Bell size={17} strokeWidth={2} className="text-admin-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-mono font-bold text-[12px] uppercase tracking-[.04em] text-admin-text">
              Novo lead recebido
            </div>
            <p className="mt-0.5 text-[13px] text-admin-textMuted truncate">
              {t.nome} solicitou um orçamento.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-admin-textMuted hover:text-admin-text flex-shrink-0"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}
