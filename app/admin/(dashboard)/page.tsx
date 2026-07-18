import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ModoTvButton } from "@/components/admin/ModoTvButton";
import {
  getMetricasPeriodo,
  getAtendimentoPorVendedorHoje,
  getRankingVendas30Dias,
  getProdutosMaisCotados30Dias,
  type MetricasPeriodo,
} from "@/lib/data/dashboard";
import { formatBRL, formatPercent } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

const LINHAS_METRICA: {
  key: keyof MetricasPeriodo;
  label: string;
  format: (v: number) => string;
}[] = [
  { key: "leadsGerados", label: "Leads gerados", format: (v) => String(v) },
  { key: "atendidos", label: "Atendidos", format: (v) => String(v) },
  { key: "semResposta", label: "Sem resposta", format: (v) => String(v) },
  { key: "vendasFechadas", label: "Vendas fechadas", format: (v) => String(v) },
  { key: "receita", label: "Receita (R$)", format: formatBRL },
  { key: "conversao", label: "Conversão (%)", format: formatPercent },
];

const RANK_COLORS = ["text-admin-rankGold", "text-admin-rankSilver", "text-admin-rankBronze"];

export default async function AdminDashboardPage() {
  const [hoje, semana, mes, atendimento, ranking, produtosMaisCotados] =
    await Promise.all([
      getMetricasPeriodo("hoje"),
      getMetricasPeriodo("7d"),
      getMetricasPeriodo("30d"),
      getAtendimentoPorVendedorHoje(),
      getRankingVendas30Dias(),
      getProdutosMaisCotados30Dias(),
    ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Relatório de vendas e desempenho comercial"
        actions={<ModoTvButton />}
      />

      <div className="bg-admin-card border border-admin-border overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="bg-admin-input border-b border-admin-border">
              <th className="px-4 py-3 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint">
                Métrica
              </th>
              <th className="px-4 py-3 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint">
                Hoje
              </th>
              <th className="px-4 py-3 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint">
                7 dias
              </th>
              <th className="px-4 py-3 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint">
                30 dias
              </th>
            </tr>
          </thead>
          <tbody>
            {LINHAS_METRICA.map((linha) => (
              <tr key={linha.key} className="border-b border-admin-divider last:border-b-0">
                <td className="px-4 py-3 text-[14px] text-admin-textSecondary">
                  {linha.label}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-[15px] text-admin-text">
                  {linha.format(hoje[linha.key])}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-[15px] text-admin-text">
                  {linha.format(semana[linha.key])}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-[15px] text-admin-text">
                  {linha.format(mes[linha.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[12px] text-admin-textFaint">
        * Receita = soma do valor de venda das cotações marcadas como
        &quot;Fechado&quot; no período, informado em{" "}
        <span className="text-admin-textMuted">Cotações → Status do atendimento</span>{" "}
        ao confirmar o fechamento.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-admin-card border border-admin-border p-6">
          <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-5">
            Atendimento por vendedor (hoje)
          </h2>
          {atendimento.length === 0 ? (
            <p className="text-[13px] text-admin-textMuted">
              Nenhum vendedor cadastrado.
            </p>
          ) : (
            <ul className="space-y-4">
              {atendimento.map((v) => (
                <li key={v.vendedorId}>
                  <div className="flex items-center justify-between text-[13px] text-admin-textSecondary mb-1.5">
                    <span>{v.nome}</span>
                    <span>
                      {v.atendidos}/{v.total} ·{" "}
                      <span
                        className={
                          v.pctSemResposta > 0 ? "text-admin-danger" : ""
                        }
                      >
                        {formatPercent(v.pctSemResposta)} s/resp
                      </span>
                    </span>
                  </div>
                  <div className="h-[5px] bg-admin-pill">
                    <div
                      className="h-full bg-admin-accent"
                      style={{ width: `${v.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-admin-card border border-admin-border p-6">
          <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-5">
            Ranking de vendas (30 dias)
          </h2>
          {ranking.length === 0 ? (
            <p className="text-[13px] text-admin-textMuted">
              Nenhuma venda fechada no período.
            </p>
          ) : (
            <ol className="space-y-3.5">
              {ranking.map((v, i) => (
                <li key={v.vendedorId} className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold text-[15px] w-5 ${RANK_COLORS[i] ?? "text-admin-textMuted"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[14px] text-admin-textSecondary">
                    {v.nome}
                  </span>
                  <span className="text-[12px] text-admin-textMuted">
                    {v.vendas} vendas
                  </span>
                  <span className="font-mono font-semibold text-[13px] text-admin-accent">
                    {formatBRL(v.valor)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="bg-admin-card border border-admin-border p-6">
          <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-5">
            Produtos mais cotados no site (30 dias)
          </h2>
          {produtosMaisCotados.length === 0 ? (
            <p className="text-[13px] text-admin-textMuted">
              Nenhuma cotação registrada no período.
            </p>
          ) : (
            <ul className="space-y-3">
              {produtosMaisCotados.map((p) => (
                <li
                  key={p.nome}
                  className="flex items-center justify-between text-[14px] text-admin-textSecondary"
                >
                  <span>{p.nome}</span>
                  <span className="bg-admin-pill text-admin-pillText text-[12px] font-mono px-2 py-0.5">
                    {p.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
