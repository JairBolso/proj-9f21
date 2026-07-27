"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdVisible, setPwdVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setErro(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });

    if (error) {
      setErro("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    // admin-scope é o que define as variáveis de cor do painel (--admin-*).
    // Sem ele, esta página fica com fundo e texto brancos.
    <div
      data-theme="dark"
      className="admin-scope font-inter min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-admin-bg"
    >
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 text-admin-text"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <Logo variant="white" className="h-9" />

        <div>
          <span className="inline-block bg-admin-accent text-r3-black font-mono font-bold text-[11px] uppercase tracking-[.14em] px-3 py-1.5">
            Painel Administrativo
          </span>
          <h1 className="mt-6 font-mono font-bold uppercase leading-[0.95] text-[clamp(48px,6vw,80px)]">
            Gerencie a <span className="text-admin-accent">R3</span>
          </h1>
          <p className="mt-4 max-w-[42ch] text-[15px] text-admin-textMuted">
            Catálogo, cotações, vendas e conteúdo do site em um só lugar.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-admin-textMuted hover:text-admin-accent transition-colors w-fit"
        >
          <ArrowLeft size={15} strokeWidth={1.8} />
          Voltar para o site
        </Link>
      </div>

      <div className="flex items-center justify-center bg-admin-card px-6 py-12 sm:px-10 border-l border-admin-border">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden mb-10 flex items-center justify-between">
            <Logo variant="white" className="h-8" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12px] text-admin-textMuted hover:text-admin-accent transition-colors"
            >
              <ArrowLeft size={13} strokeWidth={1.8} />
              Site
            </Link>
          </div>

          <h2 className="font-mono font-bold text-[28px] leading-tight text-admin-text">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-[14px] text-admin-textMuted">
            Entre com seu e-mail e senha cadastrados.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {erro && (
              <div className="border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[13px] px-4 py-3">
                {erro}
              </div>
            )}

            <div>
              <label
                htmlFor="login-email"
                className="block text-[11px] font-semibold uppercase tracking-[.1em] text-admin-textMuted mb-2"
              >
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-admin-input border border-admin-borderInput px-4 py-3.5 text-[15px] text-admin-text focus:outline-none focus:border-admin-accent transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="login-senha"
                className="block text-[11px] font-semibold uppercase tracking-[.1em] text-admin-textMuted mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-senha"
                  type={pwdVisible ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="w-full bg-admin-input border border-admin-borderInput px-4 py-3.5 pr-12 text-[15px] text-admin-text focus:outline-none focus:border-admin-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setPwdVisible((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-admin-textMuted hover:text-admin-text transition-colors"
                  aria-label={pwdVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                  {pwdVisible ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-admin-accent text-r3-black font-mono font-bold text-[13px] uppercase tracking-[.08em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 pt-6 border-t border-admin-divider text-[12px] leading-relaxed text-admin-textFaint">
            Acesso restrito à equipe R3 Fitness. Esqueceu a senha ou precisa de
            um acesso? Fale com o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
