"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import {
  criarDepoimento,
  atualizarDepoimento,
} from "@/lib/actions/admin-depoimentos";

interface DepoimentoFormProps {
  depoimento?: {
    id: string;
    nome: string;
    academia: string | null;
    cidade: string | null;
    texto: string;
    imagem_url: string | null;
    aprovado: boolean;
  };
}

export function DepoimentoForm({ depoimento }: DepoimentoFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(depoimento?.nome ?? "");
  const [academia, setAcademia] = useState(depoimento?.academia ?? "");
  const [cidade, setCidade] = useState(depoimento?.cidade ?? "");
  const [texto, setTexto] = useState(depoimento?.texto ?? "");
  const [imagemUrl, setImagemUrl] = useState<string | null>(
    depoimento?.imagem_url ?? null,
  );
  const [aprovado, setAprovado] = useState(depoimento?.aprovado ?? false);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      try {
        const input = {
          nome,
          academia,
          cidade,
          texto,
          imagem_url: imagemUrl,
          aprovado,
        };
        if (depoimento) await atualizarDepoimento(depoimento.id, input);
        else await criarDepoimento(input);
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
          Imagem (logo, foto da pessoa ou do local — opcional)
        </label>
        <div className="max-w-[200px]">
          <SingleImageUploader
            value={imagemUrl}
            onChange={setImagemUrl}
            bucket="site"
            folder="depoimentos"
            aspectClassName="aspect-square"
            helperText="Recomendado: 400 × 400px (quadrada)"
          />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            Academia
          </label>
          <input
            value={academia}
            onChange={(e) => setAcademia(e.target.value)}
            className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
          />
        </div>
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            Cidade
          </label>
          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Depoimento
        </label>
        <textarea
          required
          rows={5}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        />
      </div>

      <label className="flex items-center gap-2.5 text-[13px] text-admin-textSecondary">
        <input
          type="checkbox"
          checked={aprovado}
          onChange={(e) => setAprovado(e.target.checked)}
          className="accent-admin-accent w-4 h-4"
        />
        Aprovado (visível na home do site)
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar Depoimento"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/depoimentos")}
          className="px-6 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
