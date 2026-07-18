"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProdutosFilters({
  linhas,
  categorias,
}: {
  linhas: { id: string; nome: string }[];
  categorias: { id: string; nome: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/produtos?${params.toString()}`);
  }

  return (
    <>
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      >
        <option value="">Status: Todos</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>

      <select
        value={searchParams.get("destaque") ?? ""}
        onChange={(e) => setParam("destaque", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      >
        <option value="">Destaque: Todos</option>
        <option value="sim">Na Home</option>
        <option value="nao">Fora da Home</option>
      </select>

      <select
        value={searchParams.get("linha") ?? ""}
        onChange={(e) => setParam("linha", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      >
        <option value="">Linha: Todas</option>
        {linhas.map((l) => (
          <option key={l.id} value={l.id}>
            {l.nome}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("categoria") ?? ""}
        onChange={(e) => setParam("categoria", e.target.value)}
        className="bg-admin-input border border-admin-borderInput px-3 py-2.5 text-[13px] text-admin-text focus:outline-none focus:border-admin-accent"
      >
        <option value="">Categoria: Todas</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>
    </>
  );
}
