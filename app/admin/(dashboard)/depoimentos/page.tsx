import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DepoimentosTable } from "@/components/admin/depoimentos/DepoimentosTable";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Depoimentos" };

export default async function AdminDepoimentosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("depoimentos")
    .select("*")
    .order("created_at", { ascending: false });
  const depoimentos = data ?? [];

  return (
    <div>
      <PageHeader
        title="Depoimentos"
        subtitle={`${depoimentos.length} depoimentos cadastrados`}
        actions={
          <Link
            href="/admin/depoimentos/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors"
          >
            <Plus size={15} strokeWidth={2.4} />
            Novo Depoimento
          </Link>
        }
      />

      <DepoimentosTable depoimentos={depoimentos} />
    </div>
  );
}
