"use client";

import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useWhatsAppNumero } from "@/components/site/SiteConfigContext";
import type { ProdutoCotado } from "@/lib/supabase/database.types";

const VARIANTS = {
  primary:
    "bg-accent text-r3-black hover:brightness-90 border border-transparent",
  outline:
    "border border-white/55 text-white hover:border-accent hover:text-accent",
  dark: "bg-r3-dark2 text-white hover:bg-accent hover:text-r3-black",
  whatsapp:
    "bg-r3-whatsapp text-white hover:brightness-90 border border-transparent shadow-lg",
};

interface WhatsAppCTAButtonProps {
  mensagem: string;
  // Mantido por compatibilidade com chamadas existentes; não gera cotação —
  // só quem preenche o formulário (ContatoForm/checkout) vira lead.
  produto?: ProdutoCotado;
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: React.ReactNode;
}

export function WhatsAppCTAButton({
  mensagem,
  variant = "primary",
  className,
  children,
}: WhatsAppCTAButtonProps) {
  const whatsappNumero = useWhatsAppNumero();

  function handleClick() {
    const waLink = buildWhatsAppLink(whatsappNumero, mensagem);
    window.open(waLink, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
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
