"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Columns3, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  hideByDefault?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  // Renderizado ao lado do botão "Colunas". Recebe os ids selecionados e
  // uma função para limpar a seleção (ex: após excluir).
  bulkActionsSlot?: (
    selectedIds: string[],
    clearSelection: () => void,
  ) => React.ReactNode;
  filtersSlot?: React.ReactNode;
  emptyMessage?: string;
  pageSizeOptions?: number[];
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  searchPlaceholder = "Buscar...",
  searchFn,
  selectable = false,
  onSelectionChange,
  bulkActionsSlot,
  filtersSlot,
  emptyMessage = "Nenhum registro encontrado.",
  pageSizeOptions = [10, 25, 50],
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(
    new Set(columns.filter((c) => c.hideByDefault).map((c) => c.key)),
  );
  const [colsMenuOpen, setColsMenuOpen] = useState(false);

  const filteredRows = useMemo(() => {
    if (!search || !searchFn) return rows;
    return rows.filter((row) => searchFn(row, search));
  }, [rows, search, searchFn]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const visibleColumns = columns.filter((c) => !hiddenCols.has(c.key));

  function toggleSelected(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  }

  function toggleSelectAllPage() {
    const pageIds = pageRows.map(getRowId);
    const allSelected = pageIds.every((id) => selected.has(id));
    const next = new Set(selected);
    pageIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  }

  function toggleColumn(key: string) {
    const next = new Set(hiddenCols);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setHiddenCols(next);
  }

  function clearSelection() {
    setSelected(new Set());
    onSelectionChange?.([]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {searchFn && (
          <div className="relative">
            <Search
              size={15}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-textFaint"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-9 pr-4 py-2.5 bg-admin-input border border-admin-borderInput text-[13px] text-admin-text placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent w-[220px]"
            />
          </div>
        )}

        {filtersSlot}

        <div className="ml-auto flex items-center gap-3">
        {bulkActionsSlot?.(Array.from(selected), clearSelection)}

        <div className="relative">
          <button
            type="button"
            onClick={() => setColsMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-admin-borderBtn text-admin-textMuted text-[12px] font-mono font-semibold uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
          >
            <Columns3 size={14} strokeWidth={2} />
            Colunas
          </button>
          {colsMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-admin-card border border-admin-border shadow-lg z-30 p-2">
              {columns.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2.5 px-2 py-2 text-[13px] text-admin-textSecondary hover:bg-admin-activeNav cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!hiddenCols.has(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="accent-admin-accent"
                  />
                  {col.header}
                </label>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="bg-admin-input border-b border-admin-border">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      pageRows.length > 0 &&
                      pageRows.every((r) => selected.has(getRowId(r)))
                    }
                    onChange={toggleSelectAllPage}
                    className="accent-admin-accent"
                  />
                </th>
              )}
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 font-mono font-bold text-[11px] uppercase tracking-[.1em] text-admin-textFaint"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-[13px] text-admin-textMuted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = getRowId(row);
                return (
                  <tr
                    key={id}
                    className="border-b border-admin-divider last:border-b-0"
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(id)}
                          onChange={() => toggleSelected(id)}
                          className="accent-admin-accent"
                        />
                      </td>
                    )}
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-[14px] text-admin-textSecondary"
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2 text-[13px] text-admin-textMuted">
          Linhas por página
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-admin-input border border-admin-borderInput px-2 py-1.5 text-admin-text text-[13px] focus:outline-none focus:border-admin-accent"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-[13px] text-admin-textMuted">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={cn(
                "p-1.5 border border-admin-borderBtn",
                currentPage <= 1
                  ? "text-admin-disabled cursor-not-allowed"
                  : "text-admin-text hover:border-admin-accent hover:text-admin-accent",
              )}
            >
              <ChevronLeft size={15} strokeWidth={2} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={cn(
                "p-1.5 border border-admin-borderBtn",
                currentPage >= totalPages
                  ? "text-admin-disabled cursor-not-allowed"
                  : "text-admin-text hover:border-admin-accent hover:text-admin-accent",
              )}
            >
              <ChevronRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
