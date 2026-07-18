import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { LinhasTable } from "@/components/admin/linhas/LinhasTable";
import { getLinhas } from "@/lib/data/linhas";

export const metadata: Metadata = { title: "Linhas" };

export default async function AdminLinhasPage() {
  const linhas = await getLinhas();

  return (
    <div>
      <PageHeader
        title="Linhas"
        subtitle={`${linhas.length} linhas cadastradas`}
        actions={
          <Link
            href="/admin/linhas/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors"
          >
            <Plus size={15} strokeWidth={2.4} />
            Nova Linha
          </Link>
        }
      />

      <LinhasTable linhas={linhas} />
    </div>
  );
}
