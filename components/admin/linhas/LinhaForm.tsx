"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { criarLinha, atualizarLinha } from "@/lib/actions/admin-linhas";

interface LinhaFormProps {
  linha?: {
    id: string;
    nome: string;
    slug: string;
    descricao: string | null;
    imagem_url: string | null;
    exibir_home: boolean;
    ordem: number;
  };
}

export function LinhaForm({ linha }: LinhaFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(linha?.nome ?? "");
  const [slug, setSlug] = useState(linha?.slug ?? "");
  const [descricao, setDescricao] = useState(linha?.descricao ?? "");
  const [imagemUrl, setImagemUrl] = useState<string | null>(linha?.imagem_url ?? null);
  const [exibirHome, setExibirHome] = useState(linha?.exibir_home ?? true);
  const [ordem, setOrdem] = useState(linha?.ordem ?? 0);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      try {
        const input = {
          nome,
          slug,
          descricao,
          imagem_url: imagemUrl,
          exibir_home: exibirHome,
          ordem,
        };
        if (linha) await atualizarLinha(linha.id, input);
        else await criarLinha(input);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[560px] space-y-5">
      {erro && (
        <div className="border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[13px] px-4 py-3">
          {erro}
        </div>
      )}

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Foto da linha
        </label>
        <SingleImageUploader
          value={imagemUrl}
          onChange={setImagemUrl}
          bucket="site"
          folder="linhas"
          aspectClassName="aspect-[4/3]"
        />
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Nome
        </label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        />
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Slug (opcional — gerado a partir do nome se vazio)
        </label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text font-mono focus:outline-none focus:border-admin-accent"
        />
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Descrição
        </label>
        <textarea
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        />
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            Ordem
          </label>
          <input
            type="number"
            value={ordem}
            onChange={(e) => setOrdem(Number(e.target.value))}
            className="w-24 bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
          />
        </div>

        <label className="flex items-center gap-2.5 text-[13px] text-admin-textSecondary mt-6">
          <input
            type="checkbox"
            checked={exibirHome}
            onChange={(e) => setExibirHome(e.target.checked)}
            className="accent-admin-accent w-4 h-4"
          />
          Exibir na Home
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar Linha"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/linhas")}
          className="px-6 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
