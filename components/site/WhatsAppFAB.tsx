"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import {
  useWhatsAppNumero,
  useWhatsAppFabMensagem,
} from "@/components/site/SiteConfigContext";

export function WhatsAppFAB() {
  const numero = useWhatsAppNumero();
  const mensagem = useWhatsAppFabMensagem();
  const link = buildWhatsAppLink(numero, mensagem);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-[80] w-[58px] h-[58px] rounded-full bg-r3-whatsapp flex items-center justify-center shadow-lg transition-transform hover:scale-[1.06]"
    >
      <MessageCircle
        size={28}
        strokeWidth={2}
        fill="white"
        className="text-r3-whatsapp"
      />
    </a>
  );
}
