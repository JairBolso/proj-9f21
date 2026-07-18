"use client";

const SITE_TITLE = "R3 Fitness";
const SITE_URL = "r3fitness.com.br";

interface Faixa {
  min: number;
  max: number;
  label: string;
  cor: string;
}

const FAIXAS_TITULO: Faixa[] = [
  { min: 0, max: 29, label: "Curto — pode render mais no Google", cor: "text-admin-statusAtendimento" },
  { min: 30, max: 60, label: "Bom tamanho de título", cor: "text-admin-statusFechado" },
  { min: 61, max: Infinity, label: "Longo — o Google pode cortar", cor: "text-admin-danger" },
];

const FAIXAS_DESCRICAO: Faixa[] = [
  { min: 0, max: 69, label: "Curta — aproveite mais o espaço", cor: "text-admin-statusAtendimento" },
  { min: 70, max: 160, label: "Bom tamanho de descrição", cor: "text-admin-statusFechado" },
  { min: 161, max: Infinity, label: "Longa — o Google vai cortar", cor: "text-admin-danger" },
];

function avaliar(tamanho: number, faixas: Faixa[]) {
  return faixas.find((f) => tamanho >= f.min && tamanho <= f.max)!;
}

export function SeoPreview({
  nome,
  descricao,
  slug,
}: {
  nome: string;
  descricao: string;
  slug: string;
}) {
  const tituloCompleto = nome ? `${nome} | ${SITE_TITLE}` : SITE_TITLE;
  const descricaoFinal =
    descricao.trim() || `${nome || "Produto"} — equipamento profissional R3 Fitness para academias.`;
  const url = `${SITE_URL} › produtos › ${slug || "sua-url-aqui"}`;

  const avaliacaoTitulo = avaliar(tituloCompleto.length, FAIXAS_TITULO);
  const avaliacaoDescricao = avaliar(descricaoFinal.length, FAIXAS_DESCRICAO);

  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-4">
        Como fica no Google
      </h2>

      <div className="bg-white p-4 border border-admin-border">
        <div className="text-[13px] text-[#4d5156]">{url}</div>
        <div className="text-[19px] text-[#1a0dab] leading-snug mt-0.5 truncate">
          {tituloCompleto}
        </div>
        <p className="text-[13px] text-[#4d5156] leading-snug mt-1 line-clamp-2">
          {descricaoFinal}
        </p>
      </div>

      <div className="mt-4 space-y-1.5 text-[12px]">
        <div className="flex items-center justify-between">
          <span className="text-admin-textMuted">
            Título ({tituloCompleto.length} caracteres — separador &quot;|&quot; + &quot;{SITE_TITLE}&quot; incluso)
          </span>
          <span className={avaliacaoTitulo.cor}>{avaliacaoTitulo.label}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-admin-textMuted">
            Descrição ({descricaoFinal.length} caracteres)
          </span>
          <span className={avaliacaoDescricao.cor}>{avaliacaoDescricao.label}</span>
        </div>
      </div>
    </div>
  );
}
