"use server";

import { createClient } from "@/lib/supabase/server";
import { validarWhatsappBR } from "@/lib/validation";
import type { ProdutoCotado } from "@/lib/supabase/database.types";

export interface FinalizarCheckoutInput {
  nome: string;
  whatsapp: string;
  email: string;
  cidade?: string;
  tipo_espaco?: string;
  produtos: ProdutoCotado[];
  origem_utm?: Record<string, string> | null;
}

export async function finalizarCheckout(input: FinalizarCheckoutInput) {
  const nome = input.nome.trim();
  const whatsapp = input.whatsapp.trim();
  const email = input.email.trim();

  if (!nome || !whatsapp || !email) {
    return { ok: false as const, erro: "Nome, WhatsApp e e-mail são obrigatórios." };
  }
  const telefone = validarWhatsappBR(whatsapp);
  if (!telefone.valido) {
    return { ok: false as const, erro: telefone.erro ?? "WhatsApp inválido." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false as const, erro: "Informe um e-mail válido." };
  }
  if (input.produtos.length === 0) {
    return { ok: false as const, erro: "Seu carrinho está vazio." };
  }

  const supabase = await createClient();
  // Sem .select() após o insert: a RLS de cotacoes permite INSERT anônimo,
  // mas SELECT é restrito a staff — ler o registro de volta falharia para visitantes.
  const { error } = await supabase.from("cotacoes").insert({
    nome,
    whatsapp: telefone.digitos,
    email,
    cidade: input.cidade || null,
    tipo_espaco: input.tipo_espaco || null,
    produtos: input.produtos,
    origem_utm: input.origem_utm ?? null,
  });

  if (error) {
    return { ok: false as const, erro: "Não foi possível enviar sua solicitação. Tente novamente." };
  }

  return { ok: true as const };
}
