"use client";

import { useState, useTransition } from "react";
import { Check, ExternalLink } from "lucide-react";
import { atualizarConteudo } from "@/lib/actions/admin-conteudo";

interface Pagina {
  chave: string;
  label: string;
  href: string;
  valor: string;
}

function PaginaEditor({ pagina }: { pagina: Pagina }) {
  const [valor, setValor] = useState(pagina.valor);
  const [pending, startTransition] = useTransition();
  const [salvo, setSalvo] = useState(false);

  function handleSalvar() {
    startTransition(async () => {
      await atualizarConteudo(pagina.chave, valor);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 1500);
    });
  }

  return (
    <div className="bg-admin-card border border-admin-border p-6">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text">
          {pagina.label}
        </h2>
        <a
          href={pagina.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] text-admin-textMuted hover:text-admin-accent"
        >
          Ver página
          <ExternalLink size={13} strokeWidth={2} />
        </a>
      </div>
      <p className="mb-3 text-[12px] text-admin-textFaint">
        HTML simples é permitido: <code>&lt;div&gt;</code>,{" "}
        <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>,{" "}
        <code>&lt;ul&gt;&lt;li&gt;</code>, <code>&lt;strong&gt;</code>. Cada
        seção deve ficar dentro de um <code>&lt;div&gt;</code> próprio.
      </p>
      <textarea
        rows={12}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[13px] font-mono text-admin-text focus:outline-none focus:border-admin-accent"
      />
      <button
        type="button"
        disabled={pending || valor === pagina.valor}
        onClick={handleSalvar}
        className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar"}
        {salvo && <Check size={14} strokeWidth={2.6} />}
      </button>
    </div>
  );
}

export function PoliticasManager({ paginas }: { paginas: Pagina[] }) {
  return (
    <div className="space-y-6">
      {paginas.map((p) => (
        <PaginaEditor key={p.chave} pagina={p} />
      ))}
    </div>
  );
}
