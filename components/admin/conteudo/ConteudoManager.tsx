"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import {
  SalvarAlteracaoButton,
  type EstadoSalvar,
} from "@/components/admin/conteudo/SalvarAlteracaoButton";
import { atualizarConteudoVarios } from "@/lib/actions/admin-conteudo";

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
  hero_contato_imagem: { desktop: "1920 × 700px (proporção ~21:9)", mobile: "900 × 1200px (proporção 3:4)" },
  cta_final_imagem: { desktop: "1920 × 700px (proporção ~21:9)", mobile: "900 × 1200px (proporção 3:4)" },
  monte_academia_imagem: { desktop: "1000 × 1000px (proporção 1:1)", mobile: "900 × 1125px (proporção 4:5)" },
};

const PROPORCAO_UNICA: Record<string, string> = {
  og_imagem: "1200 × 630px (proporção 1.91:1)",
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

/**
 * Controla um bloco salvável: guarda o rascunho de cada chave, sabe se há
 * alteração pendente e cuida do estado do botão (salvando → atualizado).
 */
function useBlocoSalvavel(rows: ConteudoRow[]) {
  const inicial = Object.fromEntries(rows.map((r) => [r.chave, r.valor]));
  const [salvos, setSalvos] = useState<Record<string, string | null>>(inicial);
  const [rascunho, setRascunho] = useState<Record<string, string | null>>(inicial);
  const [estado, setEstado] = useState<EstadoSalvar>("idle");
  const [erro, setErro] = useState<string | null>(null);

  const pendente = rows.some((r) => (rascunho[r.chave] ?? "") !== (salvos[r.chave] ?? ""));

  function alterar(chave: string, valor: string | null) {
    setRascunho((prev) => ({ ...prev, [chave]: valor }));
    setEstado("idle");
  }

  async function salvar() {
    setErro(null);
    setEstado("salvando");
    try {
      await atualizarConteudoVarios(
        rows.map((r) => ({ chave: r.chave, valor: rascunho[r.chave] ?? null })),
      );
      setSalvos({ ...rascunho });
      setEstado("salvo");
      setTimeout(() => setEstado("idle"), 2400);
    } catch {
      setEstado("idle");
      setErro("Não foi possível salvar. Tente novamente.");
    }
  }

  return { rascunho, alterar, pendente, estado, salvar, erro };
}

function BarraSalvar({
  pendente,
  estado,
  erro,
  onSalvar,
}: {
  pendente: boolean;
  estado: EstadoSalvar;
  erro: string | null;
  onSalvar: () => void;
}) {
  return (
    <div className="mt-3 flex items-center gap-3 flex-wrap">
      <SalvarAlteracaoButton
        estado={estado}
        pendente={pendente}
        onClick={onSalvar}
      />
      {pendente && estado === "idle" && (
        <span className="text-[11px] uppercase tracking-[.06em] text-admin-accent">
          Alteração não salva
        </span>
      )}
      {erro && <span className="text-[12px] text-admin-danger">{erro}</span>}
    </div>
  );
}

function CampoTexto({
  row,
  valor,
  onChange,
}: {
  row: ConteudoRow;
  valor: string | null;
  onChange: (v: string) => void;
}) {
  const multilinha = row.chave.includes("mensagem");

  return (
    <div>
      <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
        {row.descricao ?? row.chave}
      </label>
      {multilinha ? (
        <textarea
          rows={3}
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        />
      ) : (
        <input
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        />
      )}
    </div>
  );
}

/** Bloco de um campo de texto só, com botão próprio. */
function BlocoTexto({ row }: { row: ConteudoRow }) {
  const bloco = useBlocoSalvavel([row]);

  return (
    <div className="mb-7 max-w-[520px]">
      <CampoTexto
        row={row}
        valor={bloco.rascunho[row.chave]}
        onChange={(v) => bloco.alterar(row.chave, v)}
      />
      <BarraSalvar
        pendente={bloco.pendente}
        estado={bloco.estado}
        erro={bloco.erro}
        onSalvar={bloco.salvar}
      />
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
      {rows.map((row) => (
        <BlocoTexto key={row.chave} row={row} />
      ))}
    </div>
  );
}

/** Par desktop/mobile de um banner, salvos juntos. */
function ParBanner({
  titulo,
  desktop,
  mobile,
}: {
  titulo: string;
  desktop: ConteudoRow;
  mobile?: ConteudoRow;
}) {
  const rows = mobile ? [desktop, mobile] : [desktop];
  const bloco = useBlocoSalvavel(rows);
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
          <SingleImageUploader
            value={bloco.rascunho[desktop.chave] ?? null}
            onChange={(url) => bloco.alterar(desktop.chave, url)}
            bucket="site"
            folder="conteudo"
            aspectClassName="aspect-video"
            helperText={proporcao?.desktop}
          />
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
            <SingleImageUploader
              value={bloco.rascunho[mobile.chave] ?? null}
              onChange={(url) => bloco.alterar(mobile.chave, url)}
              bucket="site"
              folder="conteudo"
              aspectClassName="aspect-video"
              helperText={proporcao?.mobile}
            />
          </div>
        )}
      </div>
      <BarraSalvar
        pendente={bloco.pendente}
        estado={bloco.estado}
        erro={bloco.erro}
        onSalvar={bloco.salvar}
      />
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
    <div className="bg-admin-card border border-admin-border p-6 space-y-9">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text">
        {titulo}
      </h2>
      {pares.map((par) => (
        <ParBanner key={par.desktop.chave} {...par} />
      ))}
    </div>
  );
}

/** Imagem única (foto do processo, imagem de compartilhamento). */
function BlocoImagem({ row }: { row: ConteudoRow }) {
  const bloco = useBlocoSalvavel([row]);
  const proporcao = PROPORCAO_UNICA[row.chave];

  return (
    <div>
      <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
        {row.descricao ?? row.chave}
        {proporcao && (
          <span className="block normal-case text-admin-textFaint mt-0.5">
            {proporcao}
          </span>
        )}
      </label>
      <SingleImageUploader
        value={bloco.rascunho[row.chave] ?? null}
        onChange={(url) => bloco.alterar(row.chave, url)}
        bucket="site"
        folder="conteudo"
        aspectClassName="aspect-video"
      />
      <BarraSalvar
        pendente={bloco.pendente}
        estado={bloco.estado}
        erro={bloco.erro}
        onSalvar={bloco.salvar}
      />
    </div>
  );
}

function SecaoImagensSimples({
  titulo,
  rows,
  colunas = 3,
}: {
  titulo: string;
  rows: ConteudoRow[];
  colunas?: 1 | 3;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-5">
        {titulo}
      </h2>
      <div
        className={
          colunas === 1
            ? "max-w-[420px]"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {rows.map((row) => (
          <BlocoImagem key={row.chave} row={row} />
        ))}
      </div>
    </div>
  );
}

/** Uma pessoa da equipe: foto, nome e função salvos juntos. */
function PessoaEquipe({
  indice,
  foto,
  nome,
  cargo,
}: {
  indice: number;
  foto?: ConteudoRow;
  nome?: ConteudoRow;
  cargo?: ConteudoRow;
}) {
  const rows = [foto, nome, cargo].filter((r): r is ConteudoRow => Boolean(r));
  const bloco = useBlocoSalvavel(rows);
  if (rows.length === 0) return null;

  return (
    <div className="border border-admin-border p-4">
      <h3 className="text-[12px] font-semibold uppercase tracking-[.06em] text-admin-textMuted mb-3">
        Pessoa {indice}
      </h3>

      {foto && (
        <>
          <SingleImageUploader
            value={bloco.rascunho[foto.chave] ?? null}
            onChange={(url) => bloco.alterar(foto.chave, url)}
            bucket="site"
            folder="conteudo"
            aspectClassName="aspect-square"
            helperText={PROPORCAO_UNICA[foto.chave]}
          />
          <div className="h-4" />
        </>
      )}

      <div className="space-y-4">
        {nome && (
          <div>
            <label className="block text-[11px] uppercase tracking-[.06em] text-admin-textMuted mb-1.5">
              Nome
            </label>
            <input
              value={bloco.rascunho[nome.chave] ?? ""}
              onChange={(e) => bloco.alterar(nome.chave, e.target.value)}
              className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-2.5 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>
        )}
        {cargo && (
          <div>
            <label className="block text-[11px] uppercase tracking-[.06em] text-admin-textMuted mb-1.5">
              Função
            </label>
            <input
              value={bloco.rascunho[cargo.chave] ?? ""}
              onChange={(e) => bloco.alterar(cargo.chave, e.target.value)}
              className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-2.5 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>
        )}
      </div>

      <BarraSalvar
        pendente={bloco.pendente}
        estado={bloco.estado}
        erro={bloco.erro}
        onSalvar={bloco.salvar}
      />
    </div>
  );
}

export function ConteudoManager({ rows }: { rows: ConteudoRow[] }) {
  const porChave = new Map(rows.map((r) => [r.chave, r]));
  const pegar = (chaves: string[]) =>
    chaves
      .map((c) => porChave.get(c))
      .filter((r): r is ConteudoRow => Boolean(r));

  const botoes = pegar([
    "cta_topo_texto",
    "cta_topo_mensagem",
    "whatsapp_numero",
    "whatsapp_fab_mensagem",
  ]);

  const redes = pegar(["instagram_url", "youtube_url"]);

  const bannerChaves = [
    { titulo: "Banner — Home", base: "hero_home_imagem" },
    { titulo: "Banner — Produtos", base: "hero_produtos_imagem" },
    { titulo: "Banner — Linhas", base: "hero_linhas_imagem" },
    { titulo: "Banner — Sobre", base: "hero_sobre_imagem" },
    { titulo: "Banner — Contato", base: "hero_contato_imagem" },
    {
      titulo: 'Fundo dos blocos "Solicitar Orçamento" (fim das páginas)',
      base: "cta_final_imagem",
    },
    { titulo: "Foto — Monte sua academia completa (Home)", base: "monte_academia_imagem" },
  ];

  const pares = bannerChaves
    .map(({ titulo, base }) => {
      const desktop = porChave.get(base);
      if (!desktop) return null;
      return { titulo, desktop, mobile: porChave.get(`${base}_mobile`) };
    })
    .filter(
      (p): p is { titulo: string; desktop: ConteudoRow; mobile: ConteudoRow | undefined } =>
        Boolean(p),
    );

  const compartilhamento = pegar(["og_imagem"]);

  const sobreProcesso = pegar([
    "sobre_historia_imagem",
    "sobre_processo_1_imagem",
    "sobre_processo_2_imagem",
    "sobre_processo_3_imagem",
    "sobre_processo_4_imagem",
  ]);

  const equipe = [1, 2, 3, 4].map((i) => ({
    indice: i,
    foto: porChave.get(`sobre_equipe_${i}_imagem`),
    nome: porChave.get(`sobre_equipe_${i}_nome`),
    cargo: porChave.get(`sobre_equipe_${i}_cargo`),
  }));

  return (
    <div className="space-y-6">
      <SecaoTextos titulo="Botões e Contato" rows={botoes} />
      <SecaoTextos titulo="Redes sociais (rodapé)" rows={redes} />
      <SecaoBanners titulo="Banners das páginas" pares={pares} />
      <SecaoImagensSimples
        titulo="Compartilhamento (WhatsApp e redes sociais)"
        rows={compartilhamento}
        colunas={1}
      />
      <SecaoImagensSimples
        titulo="Página Sobre — Processo de fabricação"
        rows={sobreProcesso}
      />

      <div className="bg-admin-card border border-admin-border p-6">
        <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text mb-5">
          Página Sobre — Equipe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {equipe.map((pessoa) => (
            <PessoaEquipe key={pessoa.indice} {...pessoa} />
          ))}
        </div>
      </div>
    </div>
  );
}
