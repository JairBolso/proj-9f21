"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { extractUtmParams } from "@/lib/utm";
import { criarCotacao } from "@/lib/actions/cotacoes";
import { useWhatsAppNumero } from "@/components/site/SiteConfigContext";
import type { ProdutoCotado } from "@/lib/supabase/database.types";

const VARIANTS = {
  primary:
    "bg-accent text-r3-black hover:brightness-90 border border-transparent",
  outline:
    "border border-white/55 text-white hover:border-accent hover:text-accent",
  dark: "bg-r3-dark2 text-white hover:bg-accent hover:text-r3-black",
};

interface WhatsAppCTAButtonProps {
  mensagem: string;
  produto?: ProdutoCotado;
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: React.ReactNode;
}

export function WhatsAppCTAButton({
  mensagem,
  produto,
  variant = "primary",
  className,
  children,
}: WhatsAppCTAButtonProps) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const whatsappNumero = useWhatsAppNumero();

  async function handleClick() {
    setLoading(true);
    const waLink = buildWhatsAppLink(whatsappNumero, mensagem);

    try {
      await criarCotacao({
        produtos: produto ? [produto] : [],
        origem_utm: extractUtmParams(searchParams),
      });
    } finally {
      window.open(waLink, "_blank", "noopener,noreferrer");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3.5 font-barlow font-bold text-[13px] uppercase tracking-[.1em] transition-colors disabled:opacity-60",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
