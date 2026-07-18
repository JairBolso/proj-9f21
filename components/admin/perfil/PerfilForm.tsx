"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { atualizarMeuPerfil, alterarMinhaSenha } from "@/lib/actions/perfil";

export function PerfilForm({
  nome: nomeInicial,
  email,
  avatarUrl: avatarInicial,
}: {
  nome: string;
  email: string;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const [nome, setNome] = useState(nomeInicial);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(avatarInicial);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [pendingPerfil, startPerfil] = useTransition();
  const [pendingSenha, startSenha] = useTransition();
  const [msgPerfil, setMsgPerfil] = useState<string | null>(null);
  const [msgSenha, setMsgSenha] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  function handleSalvarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setMsgPerfil(null);
    startPerfil(async () => {
      const resultado = await atualizarMeuPerfil({ nome, avatar_url: avatarUrl });
      if (resultado.ok) {
        setMsgPerfil("Perfil atualizado.");
        router.refresh();
      } else {
        setMsgPerfil(resultado.erro);
      }
    });
  }

  function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();
    setMsgSenha(null);

    if (novaSenha !== confirmarSenha) {
      setMsgSenha({ tipo: "erro", texto: "As senhas não coincidem." });
      return;
    }

    startSenha(async () => {
      const resultado = await alterarMinhaSenha(novaSenha);
      if (resultado.ok) {
        setMsgSenha({ tipo: "ok", texto: "Senha alterada com sucesso." });
        setNovaSenha("");
        setConfirmarSenha("");
      } else {
        setMsgSenha({ tipo: "erro", texto: resultado.erro });
      }
    });
  }

  return (
    <div className="space-y-6 max-w-[640px]">
      <form
        onSubmit={handleSalvarPerfil}
        className="bg-admin-card border border-admin-border p-6 space-y-5"
      >
        <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text">
          Dados do perfil
        </h2>

        {msgPerfil && (
          <div className="text-[13px] text-admin-statusFechado">{msgPerfil}</div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="flex-shrink-0">
            <label className="block text-[11px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
              Foto
            </label>
            <SingleImageUploader
              value={avatarUrl}
              onChange={setAvatarUrl}
              bucket="avatars"
              aspectClassName="aspect-square w-[64px] rounded-full overflow-hidden"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                disabled
                value={email}
                className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-textMuted opacity-60"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={pendingPerfil}
          className="px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.06em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
        >
          {pendingPerfil ? "Salvando..." : "Salvar Perfil"}
        </button>
      </form>

      <form
        onSubmit={handleAlterarSenha}
        className="bg-admin-card border border-admin-border p-6 space-y-5"
      >
        <h2 className="font-mono font-bold text-[13px] uppercase tracking-[.06em] text-admin-text">
          Alterar senha
        </h2>

        {msgSenha && (
          <div
            className={
              msgSenha.tipo === "ok"
                ? "text-[13px] text-admin-statusFechado"
                : "text-[13px] text-admin-danger"
            }
          >
            {msgSenha.texto}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
              Nova senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-[.06em] text-admin-textMuted mb-2">
              Confirmar nova senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full bg-admin-input border border-admin-borderInput px-3.5 py-3 text-[14px] text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pendingSenha || !novaSenha}
          className="px-6 py-3 border border-admin-borderBtn text-admin-text font-mono font-semibold text-[12px] uppercase tracking-[.06em] hover:border-admin-accent hover:text-admin-accent transition-colors disabled:opacity-60"
        >
          {pendingSenha ? "Alterando..." : "Alterar Senha"}
        </button>
      </form>
    </div>
  );
}
