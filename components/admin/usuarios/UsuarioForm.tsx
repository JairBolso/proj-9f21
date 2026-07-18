"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { criarUsuario, atualizarUsuario } from "@/lib/actions/admin-usuarios";
import type { Papel } from "@/lib/supabase/database.types";

const PAPEIS: { value: Papel; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "vendedor", label: "Vendedor" },
  { value: "editor", label: "Editor" },
];

interface UsuarioFormProps {
  usuario?: {
    id: string;
    nome: string;
    email: string;
    papel: Papel;
    ativo: boolean;
  };
}

export function UsuarioForm({ usuario }: UsuarioFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState<Papel>(usuario?.papel ?? "vendedor");
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    startTransition(async () => {
      try {
        if (usuario) {
          await atualizarUsuario(usuario.id, { nome, papel, ativo });
        } else {
          await criarUsuario({ nome, email, senha, papel });
        }
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
          E-mail
        </label>
        <input
          type="email"
          required
          disabled={Boolean(usuario)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-60"
        />
      </div>

      {!usuario && (
        <div>
          <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
            Senha provisória
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
          />
        </div>
      )}

      <div>
        <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
          Papel
        </label>
        <select
          value={papel}
          onChange={(e) => setPapel(e.target.value as Papel)}
          className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
        >
          {PAPEIS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {usuario && (
        <label className="flex items-center gap-2.5 text-[13px] text-admin-textSecondary">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="accent-admin-accent w-4 h-4"
          />
          Usuário ativo (desmarcar bloqueia o acesso ao painel)
        </label>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar Usuário"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/usuarios")}
          className="px-6 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
