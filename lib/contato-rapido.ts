import type { ProdutoCotado } from "@/lib/supabase/database.types";

export function buildMensagemContato(params: {
  leadNome: string | null;
  vendedorNome: string;
  produtos: ProdutoCotado[];
}): string {
  const { leadNome, vendedorNome, produtos } = params;

  const saudacao = leadNome
    ? `Olá, ${leadNome}! Tudo bem?`
    : "Olá! Tudo bem?";

  const abertura = `Aqui é ${vendedorNome}, da R3 Fitness.`;

  const listaProdutos = produtos.length
    ? [
        "Recebemos sua solicitação de orçamento para os seguintes equipamentos:",
        "",
        ...produtos.map((p) => {
          const linha = p.linha ? ` (${p.linha})` : "";
          const qtd = p.qtd > 1 ? ` — qtd ${p.qtd}` : "";
          return `• ${p.nome}${linha}${qtd}`;
        }),
      ]
    : ["Recebemos sua solicitação de orçamento com a R3 Fitness."];

  const fechamento =
    "Já estou preparando os detalhes do seu orçamento e fico à disposição para qualquer dúvida. Em breve retorno com as informações completas!";

  return [saudacao, "", abertura, ...listaProdutos, "", fechamento].join("\n");
}

export function buildAssuntoEmail(leadNome: string | null): string {
  return leadNome
    ? `Orçamento R3 Fitness — ${leadNome}`
    : "Orçamento R3 Fitness";
}
