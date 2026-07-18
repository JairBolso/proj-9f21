"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultWhatsAppNumber } from "@/lib/whatsapp";

type ConteudoMap = Record<string, string | null>;

const SiteConfigContext = createContext<ConteudoMap>({});

export function SiteConfigProvider({
  value,
  children,
}: {
  value: ConteudoMap;
  children: ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useConteudo(chave: string): string | null {
  const map = useContext(SiteConfigContext);
  return map[chave] ?? null;
}

export function useWhatsAppNumero(): string {
  const numero = useConteudo("whatsapp_numero");
  return numero || defaultWhatsAppNumber();
}

export function useCtaTopoTexto(): string {
  return useConteudo("cta_topo_texto") || "Solicitar Orçamento";
}

export function useCtaTopoMensagem(): string {
  return (
    useConteudo("cta_topo_mensagem") ||
    "Olá! Gostaria de solicitar um orçamento para equipamentos R3 Fitness."
  );
}

export function useWhatsAppFabMensagem(): string {
  return (
    useConteudo("whatsapp_fab_mensagem") ||
    "Olá! Gostaria de falar com a R3 Fitness."
  );
}
