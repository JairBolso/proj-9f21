"use server";

import { createClient } from "@/lib/supabase/server";
import { validarWhatsappBR } from "@/lib/validation";
import type { ProdutoCotado } from "@/lib/supabase/database.types";

export interface CriarCotacaoInput {
  nome?: string;
  whatsapp?: string;
  email?: string;
  cidade?: string;
  tipo_espaco?: string;
  produtos?: ProdutoCotado[];
  origem_utm?: Record<string, string> | null;
}

export async function criarCotacao(input: CriarCotacaoInput) {
  // Defesa extra além da validação client-side: se um WhatsApp foi
  // enviado, precisa ter formato válido (o clique direto em "Solicitar
  // Orçamento" sem formulário legitimamente não envia nenhum).
  let whatsapp = input.whatsapp ?? null;
  if (whatsapp) {
    const telefone = validarWhatsappBR(whatsapp);
    if (!telefone.valido) {
      console.error("Cotação rejeitada: WhatsApp com formato inválido.");
      return;
    }
    whatsapp = telefone.digitos;
  }

  const supabase = await createClient();

  const { error } = await supabase.from("cotacoes").insert({
    nome: input.nome ?? null,
    whatsapp,
    email: input.email ?? null,
    cidade: input.cidade ?? null,
    tipo_espaco: input.tipo_espaco ?? null,
    produtos: input.produtos ?? [],
    origem_utm: input.origem_utm ?? null,
  });

  if (error) {
    // Não bloqueia a conversão: se o registro falhar, o visitante ainda
    // deve conseguir seguir para o WhatsApp.
    console.error("Falha ao registrar cotação:", error.message);
  }
}
