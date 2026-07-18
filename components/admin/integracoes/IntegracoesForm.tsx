"use client";

import { useState, useTransition } from "react";
import { salvarIntegracoes } from "@/lib/actions/admin-integracoes";

interface IntegracoesFormProps {
  integracoes: {
    id: string;
    meta_pixel_id: string | null;
    gtm_id: string | null;
    scripts_custom: string | null;
  } | null;
}

export function IntegracoesForm({ integracoes }: IntegracoesFormProps) {
  const [metaPixelId, setMetaPixelId] = useState(
    integracoes?.meta_pixel_id ?? "",
  );
  const [gtmId, setGtmId] = useState(integracoes?.gtm_id ?? "");
  const [scriptsCustom, setScriptsCustom] = useState(
    integracoes?.scripts_custom ?? "",
  );
  const [pending, startTransition] = useTransition();
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvo(false);
    startTransition(async () => {
      try {
        await salvarIntegracoes({
          id: integracoes?.id,
          meta_pixel_id: metaPixelId,
          gtm_id: gtmId,
          scripts_custom: scriptsCustom,
        });
        setSalvo(true);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[640px] space-y-6">
      {erro && (
        <div className="border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[13px] px-4 py-3">
          {erro}
        </div>
      )}
      {salvo && (
        <div className="border border-admin-statusFechado/40 bg-admin-statusFechado/10 text-admin-statusFechado text-[13px] px-4 py-3">
          Integrações salvas com sucesso.
        </div>
      )}

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Meta Pixel ID
        </label>
        <input
          value={metaPixelId}
          onChange={(e) => setMetaPixelId(e.target.value)}
          placeholder="Ex: 1234567890123456"
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text font-mono placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent"
        />
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Google Tag Manager ID
        </label>
        <input
          value={gtmId}
          onChange={(e) => setGtmId(e.target.value)}
          placeholder="Ex: GTM-XXXXXXX"
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text font-mono placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent"
        />
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Scripts customizados (HTML/JS injetado no site)
        </label>
        <textarea
          rows={6}
          value={scriptsCustom}
          onChange={(e) => setScriptsCustom(e.target.value)}
          placeholder="<script>...</script>"
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[13px] text-admin-text font-mono placeholder:text-admin-textFaint focus:outline-none focus:border-admin-accent"
        />
        <p className="mt-1.5 text-[12px] text-admin-textMuted">
          Executado em todas as páginas do site público. Use com cuidado — o
          conteúdo aqui não passa por sanitização.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar Integrações"}
      </button>
    </form>
  );
}
