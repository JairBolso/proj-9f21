"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { criarCotacao } from "@/lib/actions/cotacoes";
import { buildWhatsAppLink, defaultWhatsAppNumber } from "@/lib/whatsapp";
import { extractUtmParams } from "@/lib/utm";
import { validarWhatsappBR } from "@/lib/validation";
import { CidadeInput } from "@/components/CidadeInput";

const TIPOS_ESPACO = [
  "Academia",
  "Studio",
  "Condomínio",
  "Residencial",
  "Hotel",
  "Outro",
];

export function ContatoForm() {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Verificação humana: soma simples, gerada uma vez por visita à página.
  // Só é sorteada no cliente (useEffect) para não divergir do HTML do
  // servidor e causar erro de hidratação.
  const [desafio, setDesafio] = useState<{ a: number; b: number } | null>(
    null,
  );
  useEffect(() => {
    setDesafio({
      a: Math.floor(Math.random() * 8) + 1,
      b: Math.floor(Math.random() * 8) + 1,
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    const form = new FormData(event.currentTarget);

    // Honeypot: campo invisível que humanos deixam vazio.
    if (String(form.get("website") ?? "")) {
      setErro("Não foi possível validar o envio. Tente novamente.");
      return;
    }

    const respostaDesafio = Number(form.get("verificacao"));
    if (!desafio || respostaDesafio !== desafio.a + desafio.b) {
      setErro("Resposta da verificação incorreta. Tente novamente.");
      return;
    }

    const nome = String(form.get("nome") ?? "");
    const whatsappBruto = String(form.get("whatsapp") ?? "");
    const cidade = String(form.get("cidade") ?? "");
    const tipoEspaco = String(form.get("tipo_espaco") ?? "");
    const mensagem = String(form.get("mensagem") ?? "");

    const telefone = validarWhatsappBR(whatsappBruto);
    if (!telefone.valido) {
      setErro(telefone.erro ?? "WhatsApp inválido.");
      return;
    }

    setLoading(true);

    const texto = [
      `Olá! Meu nome é ${nome}.`,
      cidade && `Cidade: ${cidade}`,
      tipoEspaco && `Tipo de espaço: ${tipoEspaco}`,
      mensagem && `Mensagem: ${mensagem}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await criarCotacao({
        nome,
        whatsapp: telefone.digitos,
        cidade,
        tipo_espaco: tipoEspaco,
        origem_utm: extractUtmParams(searchParams),
      });
    } finally {
      window.open(
        buildWhatsAppLink(defaultWhatsAppNumber(), texto),
        "_blank",
        "noopener,noreferrer",
      );
      setEnviado(true);
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <div className="border border-r3-border bg-r3-offwhite p-8 flex items-start gap-4">
        <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-barlow font-semibold text-[16px] text-r3-heading">
            Recebemos sua solicitação!
          </h3>
          <p className="mt-1 text-[14px] text-r3-body">
            Abrimos o WhatsApp com sua mensagem pronta — é só enviar que a
            nossa equipe responde em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {erro && (
        <div className="border border-red-300 bg-red-50 text-red-700 text-[13px] px-4 py-3">
          {erro}
        </div>
      )}

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
          Nome completo
        </label>
        <input
          name="nome"
          required
          className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] placeholder:text-r3-mutedDark focus:outline-none focus:border-r3-heading"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
          WhatsApp
        </label>
        <input
          name="whatsapp"
          required
          placeholder="(17) 99999-9999"
          className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] placeholder:text-r3-mutedDark focus:outline-none focus:border-r3-heading"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
          Cidade
        </label>
        <CidadeInput className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] placeholder:text-r3-mutedDark focus:outline-none focus:border-r3-heading" />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
          Tipo de espaço
        </label>
        <select
          name="tipo_espaco"
          className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] bg-white focus:outline-none focus:border-r3-heading"
        >
          {TIPOS_ESPACO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
          Mensagem
        </label>
        <textarea
          name="mensagem"
          rows={4}
          className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] placeholder:text-r3-mutedDark focus:outline-none focus:border-r3-heading"
        />
      </div>

      {/* Honeypot — humanos não veem nem preenchem */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
          Verificação: quanto é {desafio ? `${desafio.a} + ${desafio.b}` : "…"}?
        </label>
        <input
          type="number"
          name="verificacao"
          required
          disabled={!desafio}
          inputMode="numeric"
          className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] focus:outline-none focus:border-r3-heading disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !desafio}
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent text-r3-black font-barlow font-bold text-[13px] uppercase tracking-[.1em] hover:brightness-90 transition-[filter] disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Solicitar Orçamento"}
      </button>
    </form>
  );
}
