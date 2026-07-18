"use client";

import { useState, useTransition } from "react";
import { Check, Monitor, Smartphone } from "lucide-react";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { atualizarConteudo } from "@/lib/actions/admin-conteudo";

interface ConteudoRow {
  chave: string;
  tipo: "imagem" | "texto";
  valor: string | null;
  descricao: string | null;
}

// Proporção recomendada por par de banner (chave base, sem "_mobile").
const PROPORCAO: Record<string, { desktop: string; mobile: string }> = {
  hero_home_imagem: { desktop: "1920 × 800px (proporção ~21:9)", mobile: "900 × 1200px (proporção 3:4)" },
  hero_produtos_imagem: { desktop: "1920 × 700px (proporção ~21:9)", mobile: "900 × 1200px (proporção 3:4)" },
  hero_linhas_imagem: { desktop: "1920 × 700px (proporção ~21:9)", mobile: "900 × 1200px (proporção 3:4)" },
  hero_sobre_imagem: { desktop: "1920 × 900px (proporção ~21:9)", mobile: "900 × 1200px (proporção 3:4)" },
  monte_academia_imagem: { desktop: "1000 × 1000px (proporção 1:1)", mobile: "900 × 1125px (proporção 4:5)" },
};

const PROPORCAO_UNICA: Record<string, string> = {
  sobre_historia_imagem: "1200 × 900px (proporção 4:3)",
  sobre_processo_1_imagem: "800 × 600px (proporção 4:3)",
  sobre_processo_2_imagem: "800 × 600px (proporção 4:3)",
  sobre_processo_3_imagem: "800 × 600px (proporção 4:3)",
  sobre_processo_4_imagem: "800 × 600px (proporção 4:3)",
  sobre_equipe_1_imagem: "800 × 800px (proporção 1:1)",
  sobre_equipe_2_imagem: "800 × 800px (proporção 1:1)",
  sobre_equipe_3_imagem: "800 × 800px (proporção 1:1)",
  sobre_equipe_4_imagem: "800 × 800px (proporção 1:1)",
};

function TextoField({ row }: { row: ConteudoRow }) {
  const isMensagem = row.chave.includes("mensagem");
  const [valor, setValor] = useState(row.valor ?? "");
  const [pending, startTransition] = useTransition();
  const [salvo, setSalvo] = useState(false);

  function handleBlur() {
    if (valor === (row.valor ?? "")) return;
    startTransition(async () => {
      await atualizarConteudo(row.chave, valor);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 1500);
    });
  }

  return (
    <div className="mb-5">
      <label className="flex items-center gap-2 text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
        {row.descricao ?? row.chave}
        {pending && <span className="text-admin-textFaint">salvando...</span>}
        {salvo && <Check size={13} className="text-admin-statusFechado" />}
      </label>
      {isMensagem ? (
        <textarea
          rows={3}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        />
      ) : (
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        />
      )}
    </div>
  );
}

function CampoImagem({
  row,
  proporcao,
}: {
  row: ConteudoRow;
  proporcao?: string;
}) {
  const [valor, setValor] = useState(row.valor);
  const [, startTransition] = useTransition();

  function handleChange(url: string | null) {
    setValor(url);
    startTransition(() => {
      atualizarConteudo(row.chave, url);
    });
  }

  return (
    <SingleImageUploader
      value={valor}
      onChange={handleChange}
      bucket="site"
      folder="conteudo"
      aspectClassName="aspect-video"
      helperText={proporcao}
    />
  );
}

function ParBanner({
  titulo,
  desktop,
  mobile,
}: {
  titulo: string;
  desktop: ConteudoRow;
  mobile?: ConteudoRow;
}) {
  const proporcao = PROPORCAO[desktop.chave];

  return (
    <div>
      <h3 className="text-[13px] font-semibold text-admin-text mb-3">{titulo}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            <Monitor size={13} strokeWidth={1.8} />
            Desktop
            {proporcao && (
              <span className="normal-case text-admin-textFaint">
                — {proporcao.desktop}
              </span>
            )}
          </label>
          <CampoImagem row={desktop} proporcao={proporcao?.desktop} />
        </div>
        {mobile && (
          <div>
            <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
              <Smartphone size={13} strokeWidth={1.8} />
              Mobile
              {proporcao && (
                <span className="normal-case text-admin-textFaint">
                  — {proporcao.mobile}
                </span>
              )}
            </label>
            <CampoImagem row={mobile} proporcao={proporcao?.mobile} />
          </div>
        )}
      </div>
    </div>
  );
}

function SecaoTextos({ titulo, rows }: { titulo: string; rows: ConteudoRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-5">
        {titulo}
      </h2>
      <div className="max-w-[480px]">
        {rows.map((row) => (
          <TextoField key={row.chave} row={row} />
        ))}
      </div>
    </div>
  );
}

function SecaoBanners({
  titulo,
  pares,
}: {
  titulo: string;
  pares: { titulo: string; desktop: ConteudoRow; mobile?: ConteudoRow }[];
}) {
  if (pares.length === 0) return null;
  return (
    <div className="bg-admin-card border border-admin-border p-6 space-y-8">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text">
        {titulo}
      </h2>
      {pares.map((par) => (
        <ParBanner key={par.desktop.chave} {...par} />
      ))}
    </div>
  );
}

function SecaoImagensSimples({ titulo, rows }: { titulo: string; rows: ConteudoRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-5">
        {titulo}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((row) => (
          <div key={row.chave}>
            <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
              {row.descricao ?? row.chave}
              {PROPORCAO_UNICA[row.chave] && (
                <span className="block normal-case text-admin-textFaint mt-0.5">
                  {PROPORCAO_UNICA[row.chave]}
                </span>
              )}
            </label>
            <CampoImagem row={row} proporcao={PROPORCAO_UNICA[row.chave]} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConteudoManager({ rows }: { rows: ConteudoRow[] }) {
  const porChave = new Map(rows.map((r) => [r.chave, r]));
  const byPrefix = (prefix: string) =>
    rows.filter((r) => r.chave.startsWith(prefix));

  const botoes = rows.filter((r) =>
    ["cta_topo_texto", "cta_topo_mensagem", "whatsapp_numero", "whatsapp_fab_mensagem"].includes(
      r.chave,
    ),
  );

  const bannerChaves = [
    { titulo: "Banner — Home", base: "hero_home_imagem" },
    { titulo: "Banner — Produtos", base: "hero_produtos_imagem" },
    { titulo: "Banner — Linhas", base: "hero_linhas_imagem" },
    { titulo: "Banner — Sobre", base: "hero_sobre_imagem" },
    { titulo: "Foto — Monte sua academia completa (Home)", base: "monte_academia_imagem" },
  ];

  const pares = bannerChaves
    .map(({ titulo, base }) => {
      const desktop = porChave.get(base);
      if (!desktop) return null;
      const mobile = porChave.get(`${base}_mobile`);
      return { titulo, desktop, mobile };
    })
    .filter(
      (p): p is { titulo: string; desktop: ConteudoRow; mobile: ConteudoRow | undefined } =>
        Boolean(p),
    );

  const sobreProcesso = [
    ...byPrefix("sobre_historia"),
    ...byPrefix("sobre_processo"),
  ].filter((r) => !r.chave.endsWith("_mobile"));
  const sobreEquipe = byPrefix("sobre_equipe").filter((r) => !r.chave.endsWith("_mobile"));

  return (
    <div className="space-y-6">
      <SecaoTextos titulo="Botões e Contato" rows={botoes} />
      <SecaoBanners titulo="Banners das páginas" pares={pares} />
      <SecaoImagensSimples
        titulo="Página Sobre — Processo de fabricação"
        rows={sobreProcesso}
      />
      <SecaoImagensSimples titulo="Página Sobre — Equipe" rows={sobreEquipe} />
    </div>
  );
}
