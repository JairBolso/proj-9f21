"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STATUS_LABELS } from "@/components/admin/StatusBadge";
import type { StatusCotacao } from "@/lib/supabase/database.types";

const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [StatusCotacao, string][];

export function CotacoesFilters({
  vendedores,
}: {
  vendedores: { id: string; nome: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/cotacoes?${params.toString()}`);
  }

  return (
    <>
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      >
        <option value="">Todos os status</option>
        {STATUS_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("vendedor") ?? ""}
        onChange={(e) => setParam("vendedor", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      >
        <option value="">Todos os vendedores</option>
        {vendedores.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nome}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={searchParams.get("de") ?? ""}
        onChange={(e) => setParam("de", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      />
      <input
        type="date"
        value={searchParams.get("ate") ?? ""}
        onChange={(e) => setParam("ate", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      />
    </>
  );
}
