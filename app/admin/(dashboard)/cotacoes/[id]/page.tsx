import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCotacaoById, getVendedores } from "@/lib/data/cotacoes";
import { formatDateTime, formatBRL } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getCurrentUsuario } from "@/lib/auth";
import { usuarioAtualPodeExecutarAcao } from "@/lib/data/permissoes";
import { StatusCard } from "@/components/admin/cotacoes/StatusCard";
import { VendedorCard } from "@/components/admin/cotacoes/VendedorCard";
import { AnotacoesCard } from "@/components/admin/cotacoes/AnotacoesCard";
import { ContatoRapidoCard } from "@/components/admin/cotacoes/ContatoRapidoCard";

export const metadata: Metadata = { title: "Cotação" };

export default async function CotacaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [cotacao, vendedores, usuarioAtual, podeAtribuirVendedor] =
    await Promise.all([
      getCotacaoById(id),
      getVendedores(),
      getCurrentUsuario(),
      usuarioAtualPodeExecutarAcao("cotacoes.atribuir_vendedor"),
    ]);

  if (!cotacao) notFound();

  const historico = (cotacao.anotacoes ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const ticket = cotacao.id.slice(0, 8).toUpperCase();

  return (
    <div>
      <div className="flex items-center gap-2 text-[13px] font-mono text-admin-textFaint mb-4">
        <Link href="/admin" className="hover:text-admin-text">
          Painel
        </Link>
        <span>/</span>
        <Link href="/admin/cotacoes" className="hover:text-admin-text">
          Cotações
        </Link>
        <span>/</span>
        <span className="text-admin-text">#{ticket}</span>
      </div>

      <h1 className="font-mono font-bold text-[26px] uppercase text-admin-text">
        Cotação #{ticket}
      </h1>
      <p className="mt-1 text-[14px] text-admin-textMuted">
        Recebida em {formatDateTime(cotacao.created_at)}
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Dados do lead
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <div className="text-[11px] uppercase text-admin-textMuted mb-1">
                  Nome
                </div>
                <div className="text-[14px] text-admin-textSecondary">
                  {cotacao.nome ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-admin-textMuted mb-1">
                  WhatsApp
                </div>
                {cotacao.whatsapp ? (
                  <a
                    href={buildWhatsAppLink(cotacao.whatsapp, "Olá!")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-admin-accent hover:underline"
                  >
                    {cotacao.whatsapp}
                  </a>
                ) : (
                  <span className="text-[14px] text-admin-textSecondary">—</span>
                )}
              </div>
              <div>
                <div className="text-[11px] uppercase text-admin-textMuted mb-1">
                  Cidade
                </div>
                <div className="text-[14px] text-admin-textSecondary">
                  {cotacao.cidade ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-admin-textMuted mb-1">
                  Tipo de espaço
                </div>
                <div className="text-[14px] text-admin-textSecondary">
                  {cotacao.tipo_espaco ?? "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Produtos cotados
            </h2>
            {cotacao.produtos.length === 0 ? (
              <p className="text-[13px] text-admin-textMuted">
                Nenhum produto associado a esta cotação.
              </p>
            ) : (
              <ul className="divide-y divide-admin-divider">
                {cotacao.produtos.map((p, i) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-[14px] text-admin-text">{p.nome}</div>
                      {p.linha && (
                        <div className="text-[12px] text-admin-textMuted">
                          {p.linha}
                        </div>
                      )}
                    </div>
                    <span className="text-[12px] text-admin-textMuted">
                      qtd {p.qtd}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cotacao.produtos_vendidos && cotacao.produtos_vendidos.length > 0 && (
            <div className="bg-admin-card border border-admin-accent/50 p-6">
              <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
                Produtos vendidos
              </h2>
              <ul className="divide-y divide-admin-divider">
                {cotacao.produtos_vendidos.map((p, i) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-[14px] text-admin-text">{p.nome}</div>
                      {p.linha && (
                        <div className="text-[12px] text-admin-textMuted">
                          {p.linha}
                        </div>
                      )}
                    </div>
                    <span className="text-[12px] text-admin-textMuted">
                      qtd {p.qtd}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AnotacoesCard cotacaoId={cotacao.id} historico={historico} />
        </div>

        <div className="space-y-6">
          <ContatoRapidoCard
            leadNome={cotacao.nome}
            whatsapp={cotacao.whatsapp}
            email={cotacao.email}
            produtos={cotacao.produtos}
            vendedorNome={
              cotacao.vendedor?.nome ?? usuarioAtual?.nome ?? "equipe R3 Fitness"
            }
          />

          <StatusCard
            cotacaoId={cotacao.id}
            statusAtual={cotacao.status}
            valorEstimadoAtual={cotacao.valor_estimado}
            produtosCotados={cotacao.produtos}
          />

          <VendedorCard
            cotacaoId={cotacao.id}
            vendedorIdAtual={cotacao.vendedor_id}
            vendedores={vendedores}
            podeEditar={podeAtribuirVendedor}
          />

          <div className="bg-admin-card border border-admin-border p-6">
            <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
              Origem
            </h2>
            <dl className="space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-admin-textMuted">Canal</dt>
                <dd className="text-admin-textSecondary">Site</dd>
              </div>
              {Object.entries(cotacao.origem_utm ?? {}).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3">
                  <dt className="text-admin-textMuted">{key}</dt>
                  <dd className="text-admin-textSecondary truncate">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {cotacao.valor_venda != null && (
            <div className="bg-admin-card border border-admin-border p-6">
              <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-2">
                Valor da venda
              </h2>
              <p className="font-mono font-bold text-[22px] text-admin-accent">
                {formatBRL(cotacao.valor_venda)}
              </p>
            </div>
          )}

          {cotacao.valor_venda == null && cotacao.valor_estimado != null && (
            <div className="bg-admin-card border border-admin-border p-6">
              <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-2">
                Valor estimado
              </h2>
              <p className="font-mono font-bold text-[22px] text-admin-text">
                {formatBRL(cotacao.valor_estimado)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
