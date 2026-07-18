import type { StatusCotacao } from "@/lib/supabase/database.types";

export const STATUS_LABELS: Record<StatusCotacao, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  proposta: "Proposta enviada",
  fechado: "Fechado",
  perdido: "Perdido",
};

const STATUS_STYLES: Record<StatusCotacao, string> = {
  novo: "bg-admin-statusNovoBg text-admin-statusNovoText",
  em_atendimento: "bg-admin-statusAtendimento text-r3-black",
  proposta: "bg-admin-statusProposta text-white",
  fechado: "bg-admin-statusFechado text-white",
  perdido: "bg-admin-statusPerdido text-white",
};

export function StatusBadge({ status }: { status: StatusCotacao }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-[.06em] ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
