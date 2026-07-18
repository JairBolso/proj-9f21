import { MessageCircle, Phone, Mail } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildMensagemContato, buildAssuntoEmail } from "@/lib/contato-rapido";
import type { ProdutoCotado } from "@/lib/supabase/database.types";

export function ContatoRapidoCard({
  leadNome,
  whatsapp,
  email,
  produtos,
  vendedorNome,
}: {
  leadNome: string | null;
  whatsapp: string | null;
  email: string | null;
  produtos: ProdutoCotado[];
  vendedorNome: string;
}) {
  const mensagem = buildMensagemContato({ leadNome, vendedorNome, produtos });

  const waLink = whatsapp ? buildWhatsAppLink(whatsapp, mensagem) : null;
  const telLink = whatsapp ? `tel:+${whatsapp.replace(/\D/g, "")}` : null;
  const mailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(buildAssuntoEmail(leadNome))}&body=${encodeURIComponent(mensagem)}`
    : null;

  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-1.5">
        Entrar em contato
      </h2>
      <p className="text-[12px] text-admin-textMuted mb-4">
        Abre uma mensagem pronta com os equipamentos cotados.
      </p>

      <div className="space-y-2.5">
        <a
          href={waLink ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!waLink}
          className={`flex items-center justify-center gap-2 py-3 font-mono font-bold text-[12px] uppercase tracking-[.06em] transition-colors ${
            waLink
              ? "bg-r3-whatsapp text-admin-text hover:brightness-90"
              : "bg-admin-pill text-admin-disabled cursor-not-allowed pointer-events-none"
          }`}
        >
          <MessageCircle size={15} strokeWidth={2} />
          WhatsApp
        </a>

        <a
          href={telLink ?? undefined}
          aria-disabled={!telLink}
          className={`flex items-center justify-center gap-2 py-3 border font-mono font-semibold text-[12px] uppercase tracking-[.06em] transition-colors ${
            telLink
              ? "border-admin-borderBtn text-admin-text hover:border-admin-accent hover:text-admin-accent"
              : "border-admin-border text-admin-disabled cursor-not-allowed pointer-events-none"
          }`}
        >
          <Phone size={15} strokeWidth={2} />
          Ligação
        </a>

        <a
          href={mailLink ?? undefined}
          aria-disabled={!mailLink}
          className={`flex items-center justify-center gap-2 py-3 border font-mono font-semibold text-[12px] uppercase tracking-[.06em] transition-colors ${
            mailLink
              ? "border-admin-borderBtn text-admin-text hover:border-admin-accent hover:text-admin-accent"
              : "border-admin-border text-admin-disabled cursor-not-allowed pointer-events-none"
          }`}
        >
          <Mail size={15} strokeWidth={2} />
          {mailLink ? "E-mail" : "E-mail (não informado)"}
        </a>
      </div>
    </div>
  );
}
