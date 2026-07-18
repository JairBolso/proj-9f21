import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { CotacoesTable } from "@/components/admin/cotacoes/CotacoesTable";
import { getCotacoes, getVendedores } from "@/lib/data/cotacoes";
import { usuarioAtualPodeExecutarAcao } from "@/lib/data/permissoes";
import type { StatusCotacao } from "@/lib/supabase/database.types";

export const metadata: Metadata = { title: "Cotações" };

export default async function CotacoesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    vendedor?: string;
    de?: string;
    ate?: string;
  }>;
}) {
  const { status, vendedor, de, ate } = await searchParams;

  const [cotacoes, vendedores, podeExcluir] = await Promise.all([
    getCotacoes({
      status: status as StatusCotacao | undefined,
      vendedorId: vendedor,
      from: de ? `${de}T00:00:00` : undefined,
      to: ate ? `${ate}T23:59:59` : undefined,
    }),
    getVendedores(),
    usuarioAtualPodeExecutarAcao("cotacoes.excluir_lead"),
  ]);

  return (
    <div>
      <PageHeader
        title="Cotações"
        subtitle={`${cotacoes.length} cotações encontradas`}
        actions={
          <Link
            href="/admin/cotacoes/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors"
          >
            <Plus size={15} strokeWidth={2.4} />
            Adicionar Lead
          </Link>
        }
      />

      <CotacoesTable
        cotacoes={cotacoes}
        vendedores={vendedores}
        podeExcluir={podeExcluir}
      />
    </div>
  );
}
