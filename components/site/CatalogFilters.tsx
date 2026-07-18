import Link from "next/link";
import { cn } from "@/lib/utils";

interface FacetOption {
  value: string;
  nome: string;
  count: number;
}

type FacetKey = "linha" | "categoria" | "grupo";

function buildHref(
  base: Record<string, string | undefined>,
  key: FacetKey,
  value: string,
  active: string | undefined,
) {
  const next = { ...base };
  if (active === value) {
    delete next[key];
  } else {
    next[key] = value;
  }
  const params = new URLSearchParams(
    Object.entries(next).filter((e): e is [string, string] => Boolean(e[1])),
  ).toString();
  return params ? `/produtos?${params}` : "/produtos";
}

function FacetList({
  title,
  options,
  facetKey,
  active,
  currentParams,
}: {
  title: string;
  options: FacetOption[];
  facetKey: FacetKey;
  active?: string;
  currentParams: Record<string, string | undefined>;
}) {
  if (options.length === 0) return null;

  return (
    <div>
      <h3 className="font-barlow font-semibold text-[12px] uppercase tracking-[.12em] text-r3-heading mb-3">
        {title}
      </h3>
      <ul className="space-y-2">
        {options.map((option) => {
          const isActive = active === option.value;
          return (
            <li key={option.value}>
              <Link
                href={buildHref(currentParams, facetKey, option.value, active)}
                className="flex items-center justify-between gap-2 group"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "w-4 h-4 border flex-shrink-0",
                      isActive
                        ? "bg-accent border-accent"
                        : "border-r3-borderMuted group-hover:border-r3-heading",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[14px]",
                      isActive
                        ? "text-r3-heading font-medium"
                        : "text-r3-body",
                    )}
                  >
                    {option.nome}
                  </span>
                </span>
                <span className="text-[12px] text-r3-muted">
                  {option.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CatalogFilters({
  linhas,
  categorias,
  grupos,
  activeLinha,
  activeCategoria,
  activeGrupo,
}: {
  linhas: FacetOption[];
  categorias: FacetOption[];
  grupos: FacetOption[];
  activeLinha?: string;
  activeCategoria?: string;
  activeGrupo?: string;
}) {
  const currentParams = {
    linha: activeLinha,
    categoria: activeCategoria,
    grupo: activeGrupo,
  };
  const hasFilters = Boolean(activeLinha || activeCategoria || activeGrupo);

  return (
    <aside className="lg:w-[260px] flex-shrink-0 space-y-8">
      <FacetList
        title="Linha"
        options={linhas}
        facetKey="linha"
        active={activeLinha}
        currentParams={currentParams}
      />
      <FacetList
        title="Categoria"
        options={categorias}
        facetKey="categoria"
        active={activeCategoria}
        currentParams={currentParams}
      />
      <FacetList
        title="Grupo muscular"
        options={grupos}
        facetKey="grupo"
        active={activeGrupo}
        currentParams={currentParams}
      />
      {hasFilters && (
        <Link
          href="/produtos"
          className="inline-block border border-r3-borderMuted text-r3-heading text-[12px] font-semibold uppercase tracking-[.1em] px-4 py-2.5 hover:border-r3-heading transition-colors"
        >
          Limpar filtros
        </Link>
      )}
    </aside>
  );
}
