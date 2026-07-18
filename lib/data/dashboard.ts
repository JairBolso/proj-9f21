import { createClient } from "@/lib/supabase/server";
import type { StatusCotacao } from "@/lib/supabase/database.types";

export type PeriodoDashboard = "hoje" | "7d" | "30d";

function inicioDoDia(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function periodoParaIntervalo(
  periodo: PeriodoDashboard | { from: string; to: string },
) {
  const agora = new Date();

  if (typeof periodo === "object") {
    return {
      from: new Date(`${periodo.from}T00:00:00`),
      to: new Date(`${periodo.to}T23:59:59`),
    };
  }

  if (periodo === "hoje") {
    return { from: inicioDoDia(agora), to: agora };
  }

  const dias = periodo === "7d" ? 7 : 30;
  const from = new Date(agora);
  from.setDate(from.getDate() - dias);
  return { from, to: agora };
}

export interface MetricasPeriodo {
  leadsGerados: number;
  atendidos: number;
  semResposta: number;
  vendasFechadas: number;
  receita: number;
  conversao: number;
}

const STATUS_ATENDIDO: StatusCotacao[] = [
  "em_atendimento",
  "proposta",
  "fechado",
  "perdido",
];

export async function getMetricasPeriodo(
  periodo: PeriodoDashboard | { from: string; to: string },
): Promise<MetricasPeriodo> {
  const supabase = await createClient();
  const { from, to } = periodoParaIntervalo(periodo);

  const [{ data: gerados }, { data: fechadasNoPeriodo }] = await Promise.all([
    supabase
      .from("cotacoes")
      .select("id, status")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString()),
    supabase
      .from("cotacoes")
      .select("id, valor_venda")
      .eq("status", "fechado")
      .gte("updated_at", from.toISOString())
      .lte("updated_at", to.toISOString()),
  ]);

  const leadsGerados = gerados?.length ?? 0;
  const atendidos =
    gerados?.filter((c) => STATUS_ATENDIDO.includes(c.status)).length ?? 0;
  const semResposta = leadsGerados - atendidos;
  const vendasFechadas = fechadasNoPeriodo?.length ?? 0;
  const receita =
    fechadasNoPeriodo?.reduce((sum, c) => sum + (c.valor_venda ?? 0), 0) ?? 0;
  const conversao = leadsGerados > 0 ? (vendasFechadas / leadsGerados) * 100 : 0;

  return { leadsGerados, atendidos, semResposta, vendasFechadas, receita, conversao };
}

export interface AtendimentoVendedor {
  vendedorId: string;
  nome: string;
  atendidos: number;
  total: number;
  pct: number;
  pctSemResposta: number;
}

export async function getAtendimentoPorVendedorHoje(): Promise<
  AtendimentoVendedor[]
> {
  const supabase = await createClient();
  const { from, to } = periodoParaIntervalo("hoje");

  const [{ data: vendedores }, { data: cotacoes }] = await Promise.all([
    supabase
      .from("usuarios")
      .select("id, nome")
      .eq("papel", "vendedor")
      .eq("ativo", true),
    supabase
      .from("cotacoes")
      .select("vendedor_id, status")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString())
      .not("vendedor_id", "is", null),
  ]);

  return (vendedores ?? []).map((v) => {
    const doVendedor = (cotacoes ?? []).filter((c) => c.vendedor_id === v.id);
    const total = doVendedor.length;
    const atendidos = doVendedor.filter((c) =>
      STATUS_ATENDIDO.includes(c.status),
    ).length;
    const semResposta = total - atendidos;
    return {
      vendedorId: v.id,
      nome: v.nome,
      atendidos,
      total,
      pct: total > 0 ? (atendidos / total) * 100 : 0,
      pctSemResposta: total > 0 ? (semResposta / total) * 100 : 0,
    };
  });
}

export interface RankingVendedor {
  vendedorId: string;
  nome: string;
  vendas: number;
  valor: number;
}

export async function getRankingVendas30Dias(): Promise<RankingVendedor[]> {
  const supabase = await createClient();
  const { from, to } = periodoParaIntervalo("30d");

  const { data: cotacoes } = await supabase
    .from("cotacoes")
    .select("vendedor_id, valor_venda, usuarios:vendedor_id ( id, nome )")
    .eq("status", "fechado")
    .gte("updated_at", from.toISOString())
    .lte("updated_at", to.toISOString())
    .not("vendedor_id", "is", null)
    .overrideTypes<
      { vendedor_id: string; valor_venda: number | null; usuarios: { id: string; nome: string } | null }[],
      { merge: false }
    >();

  const porVendedor = new Map<string, RankingVendedor>();
  for (const c of cotacoes ?? []) {
    if (!c.vendedor_id || !c.usuarios) continue;
    const atual = porVendedor.get(c.vendedor_id) ?? {
      vendedorId: c.vendedor_id,
      nome: c.usuarios.nome,
      vendas: 0,
      valor: 0,
    };
    atual.vendas += 1;
    atual.valor += c.valor_venda ?? 0;
    porVendedor.set(c.vendedor_id, atual);
  }

  return Array.from(porVendedor.values()).sort((a, b) => b.vendas - a.vendas);
}

export interface ProdutoCotadoRanking {
  nome: string;
  count: number;
}

export async function getProdutosMaisCotados30Dias(
  limit = 8,
): Promise<ProdutoCotadoRanking[]> {
  const supabase = await createClient();
  const { from, to } = periodoParaIntervalo("30d");

  const { data: cotacoes } = await supabase
    .from("cotacoes")
    .select("produtos")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString());

  const contagem = new Map<string, number>();
  for (const c of cotacoes ?? []) {
    for (const p of c.produtos ?? []) {
      contagem.set(p.nome, (contagem.get(p.nome) ?? 0) + (p.qtd || 1));
    }
  }

  return Array.from(contagem.entries())
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
