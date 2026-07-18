"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUsuario } from "@/lib/auth";
import { usuarioAtualPodeExecutarAcao } from "@/lib/data/permissoes";
import { registrarAtividade } from "@/lib/atividades";
import { formatDateTime } from "@/lib/format";
import { STATUS_LABELS } from "@/components/admin/StatusBadge";
import type { StatusCotacao, ProdutoCotado } from "@/lib/supabase/database.types";

function refCotacao(id: string) {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

async function registrarNota(id: string, linha: string) {
  const supabase = await createClient();
  const { data: atual } = await supabase
    .from("cotacoes")
    .select("anotacoes")
    .eq("id", id)
    .single();

  const proximo = [atual?.anotacoes, linha].filter(Boolean).join("\n");
  await supabase.from("cotacoes").update({ anotacoes: proximo }).eq("id", id);
}

export async function atualizarStatusCotacao(
  id: string,
  status: StatusCotacao,
  valorVenda?: number | null,
  valorEstimado?: number | null,
) {
  const supabase = await createClient();
  const usuario = await getCurrentUsuario();

  const update: {
    status: StatusCotacao;
    valor_venda?: number | null;
    valor_estimado?: number | null;
  } = { status };
  if (status === "fechado" && valorVenda != null) {
    update.valor_venda = valorVenda;
  }
  if (status === "proposta" && valorEstimado != null) {
    update.valor_estimado = valorEstimado;
  }

  const { error } = await supabase.from("cotacoes").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  await registrarNota(
    id,
    `[${formatDateTime(new Date().toISOString())}] Status alterado para "${STATUS_LABELS[status]}" por ${usuario?.nome ?? "sistema"}.`,
  );
  await registrarAtividade(
    `Alterou o status da cotação ${refCotacao(id)} para "${STATUS_LABELS[status]}"`,
    "cotacao",
    id,
  );

  revalidatePath(`/admin/cotacoes/${id}`);
  revalidatePath("/admin/cotacoes");
}

// Fecha a cotação confirmando exatamente o que foi vendido (pode diferir
// do que foi originalmente cotado) — sempre passa pela confirmação, não
// dá pra fechar sem dizer o que a pessoa comprou.
export async function confirmarVenda(
  id: string,
  produtosVendidos: ProdutoCotado[],
  valorVenda: number,
) {
  const supabase = await createClient();
  const usuario = await getCurrentUsuario();

  const { error } = await supabase
    .from("cotacoes")
    .update({
      status: "fechado",
      valor_venda: valorVenda,
      produtos_vendidos: produtosVendidos,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const resumoProdutos = produtosVendidos
    .map((p) => `${p.qtd}x ${p.nome}`)
    .join(", ");
  await registrarNota(
    id,
    `[${formatDateTime(new Date().toISOString())}] Venda fechada por ${usuario?.nome ?? "sistema"}. Produtos: ${resumoProdutos || "nenhum"}. Valor: ${valorVenda}.`,
  );
  await registrarAtividade(
    `Fechou a venda da cotação ${refCotacao(id)} (${resumoProdutos || "sem produtos"}) por R$ ${valorVenda}`,
    "cotacao",
    id,
  );

  revalidatePath(`/admin/cotacoes/${id}`);
  revalidatePath("/admin/cotacoes");
  revalidatePath("/admin");
}

export async function atribuirVendedor(
  id: string,
  vendedorId: string | null,
  vendedorNome: string | null,
) {
  const permitido = await usuarioAtualPodeExecutarAcao(
    "cotacoes.atribuir_vendedor",
  );
  if (!permitido) {
    throw new Error(
      "Você não tem permissão para reatribuir o vendedor responsável.",
    );
  }

  const supabase = await createClient();
  const usuario = await getCurrentUsuario();

  const { error } = await supabase
    .from("cotacoes")
    .update({ vendedor_id: vendedorId })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await registrarNota(
    id,
    `[${formatDateTime(new Date().toISOString())}] Vendedor responsável definido como "${vendedorNome ?? "nenhum"}" por ${usuario?.nome ?? "sistema"}.`,
  );
  await registrarAtividade(
    `Definiu o vendedor responsável da cotação ${refCotacao(id)} como "${vendedorNome ?? "nenhum"}"`,
    "cotacao",
    id,
  );

  revalidatePath(`/admin/cotacoes/${id}`);
  revalidatePath("/admin/cotacoes");
}

export async function criarCotacaoManual(input: {
  nome: string;
  whatsapp: string;
  email?: string;
  cidade?: string;
  tipo_espaco?: string;
  produtos: { produto_id: string; nome: string; slug: string; linha?: string; qtd: number }[];
}) {
  const supabase = await createClient();
  const usuario = await getCurrentUsuario();

  const { data, error } = await supabase
    .from("cotacoes")
    .insert({
      nome: input.nome,
      whatsapp: input.whatsapp,
      email: input.email || null,
      cidade: input.cidade || null,
      tipo_espaco: input.tipo_espaco || null,
      produtos: input.produtos,
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, erro: error.message };

  await registrarNota(
    data.id,
    `[${formatDateTime(new Date().toISOString())}] Lead adicionado manualmente por ${usuario?.nome ?? "equipe"}.`,
  );
  await registrarAtividade(
    `Adicionou manualmente o lead "${input.nome}" (${refCotacao(data.id)})`,
    "cotacao",
    data.id,
  );

  revalidatePath("/admin/cotacoes");
  return { ok: true as const, id: data.id };
}

// Exclusão de leads/cotações — só quem tem a permissão "cotacoes.excluir_lead"
// (por padrão admin, mas pode ser revogada até do próprio admin). Recebe
// vários ids de uma vez (seleção em massa na listagem).
export async function excluirCotacoes(ids: string[]) {
  const permitido = await usuarioAtualPodeExecutarAcao("cotacoes.excluir_lead");
  if (!permitido) {
    return {
      ok: false as const,
      erro: "Você não tem permissão para excluir cotações.",
    };
  }
  if (ids.length === 0) {
    return { ok: false as const, erro: "Nenhuma cotação selecionada." };
  }

  const supabase = await createClient();

  // Nomes para o log, antes de apagar.
  const { data: alvos } = await supabase
    .from("cotacoes")
    .select("id, nome")
    .in("id", ids);

  const { error } = await supabase.from("cotacoes").delete().in("id", ids);
  if (error) return { ok: false as const, erro: error.message };

  const resumo = (alvos ?? [])
    .map((c) => `${c.nome ?? "Sem identificação"} (${refCotacao(c.id)})`)
    .join(", ");
  await registrarAtividade(
    `Excluiu ${ids.length} cotação(ões): ${resumo || ids.map(refCotacao).join(", ")}`,
    "cotacao",
  );

  revalidatePath("/admin/cotacoes");
  revalidatePath("/admin");
  return { ok: true as const, quantidade: ids.length };
}

export async function adicionarAnotacao(id: string, texto: string) {
  if (!texto.trim()) return;
  const usuario = await getCurrentUsuario();

  await registrarNota(
    id,
    `[${formatDateTime(new Date().toISOString())}] ${usuario?.nome ?? "Equipe"}: ${texto.trim()}`,
  );

  revalidatePath(`/admin/cotacoes/${id}`);
}
