"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/site/CartContext";
import { finalizarCheckout } from "@/lib/actions/checkout";
import { validarWhatsappBR } from "@/lib/validation";
import { extractUtmParams } from "@/lib/utm";

export default function CarrinhoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, count, removeItem, updateQtd, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Verificação humana: soma simples, gerada uma vez por visita à página.
  const desafio = useMemo(
    () => ({
      a: Math.floor(Math.random() * 8) + 1,
      b: Math.floor(Math.random() * 8) + 1,
    }),
    [],
  );

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
    if (respostaDesafio !== desafio.a + desafio.b) {
      setErro("Resposta da verificação incorreta. Tente novamente.");
      return;
    }

    const telefone = validarWhatsappBR(String(form.get("whatsapp") ?? ""));
    if (!telefone.valido) {
      setErro(telefone.erro ?? "WhatsApp inválido.");
      return;
    }

    setLoading(true);

    const resultado = await finalizarCheckout({
      nome: String(form.get("nome") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      produtos: items.map((i) => ({
        produto_id: i.produto_id,
        nome: i.nome,
        slug: i.slug,
        linha: i.linha,
        qtd: i.qtd,
      })),
      origem_utm: extractUtmParams(searchParams),
    });

    if (!resultado.ok) {
      setErro(resultado.erro);
      setLoading(false);
      return;
    }

    clear();
    router.push("/obrigado");
  }

  if (count === 0) {
    return (
      <section className="bg-white">
        <div className="max-w-[560px] mx-auto px-6 py-24 text-center">
          <ShoppingCart size={40} strokeWidth={1.3} className="mx-auto text-r3-borderMuted" />
          <h1 className="mt-6 font-oswald font-semibold uppercase text-[28px] text-r3-heading">
            Seu carrinho está vazio
          </h1>
          <p className="mt-3 text-[15px] text-r3-muted">
            Adicione equipamentos ao carrinho para solicitar um orçamento.
          </p>
          <Link
            href="/produtos"
            className="mt-8 inline-block px-8 py-3.5 bg-accent text-r3-black font-barlow font-bold text-[13px] uppercase tracking-[.1em] hover:brightness-90 transition-[filter]"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-r3-black text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-14 sm:py-16">
          <h1 className="font-oswald font-bold uppercase text-[clamp(28px,4.4vw,44px)] leading-[1.02]">
            Seu carrinho de orçamento
          </h1>
          <p className="mt-3 text-[15px] text-r3-mutedDark">
            Revise os equipamentos e preencha seus dados para receber o orçamento.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12">
          <div>
            <h2 className="font-oswald font-semibold uppercase text-[20px] text-r3-heading mb-5">
              Equipamentos ({count})
            </h2>
            <ul className="divide-y divide-r3-border border-y border-r3-border">
              {items.map((item) => (
                <li key={item.produto_id} className="flex items-center gap-4 py-5">
                  <div className="relative w-16 h-16 bg-r3-offwhite flex-shrink-0">
                    {item.foto ? (
                      <Image
                        src={item.foto}
                        alt={item.nome}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-r3-heading truncate">
                      {item.nome}
                    </div>
                    {item.linha && (
                      <div className="text-[12px] text-r3-muted">{item.linha}</div>
                    )}
                  </div>

                  <div className="flex items-center border border-r3-borderMuted">
                    <button
                      type="button"
                      onClick={() => updateQtd(item.produto_id, item.qtd - 1)}
                      className="p-2 text-r3-muted hover:text-r3-heading"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span className="w-8 text-center text-[14px]">{item.qtd}</span>
                    <button
                      type="button"
                      onClick={() => updateQtd(item.produto_id, item.qtd + 1)}
                      className="p-2 text-r3-muted hover:text-r3-heading"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.produto_id)}
                    aria-label="Remover"
                    className="p-2 text-r3-muted hover:text-admin-danger"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>

            <Link
              href="/produtos"
              className="mt-6 inline-block text-[13px] font-semibold uppercase tracking-[.08em] text-r3-muted hover:text-r3-heading"
            >
              ← Continuar adicionando equipamentos
            </Link>
          </div>

          <div>
            <h2 className="font-oswald font-semibold uppercase text-[20px] text-r3-heading mb-5">
              Seus dados
            </h2>

            {erro && (
              <div className="mb-5 border border-red-300 bg-red-50 text-red-700 text-[13px] px-4 py-3">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
                  Nome completo *
                </label>
                <input
                  name="nome"
                  required
                  className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] focus:outline-none focus:border-r3-heading"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-heading mb-2">
                  WhatsApp *
                </label>
                <input
                  name="whatsapp"
                  required
                  placeholder="(17) 99999-9999"
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
                  Verificação: quanto é {desafio.a} + {desafio.b}? *
                </label>
                <input
                  type="number"
                  name="verificacao"
                  required
                  inputMode="numeric"
                  className="w-full border border-r3-borderMuted px-4 py-3.5 text-[15px] focus:outline-none focus:border-r3-heading"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-accent text-r3-black font-barlow font-bold text-[13px] uppercase tracking-[.1em] hover:brightness-90 transition-[filter] disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Finalizar Solicitação de Orçamento"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
