"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] font-inter">
      <div
        className="relative hidden lg:flex flex-col justify-between bg-admin-bg text-white p-12"
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
          <h1 className="mt-6 font-mono font-bold uppercase leading-[0.95] text-[clamp(48px,7vw,92px)]">
            Gerencie a <span className="text-admin-accent">R3</span>
          </h1>
          <p className="mt-4 max-w-[42ch] text-[15px] text-admin-textMuted">
            Catálogo, cotações, vendas e conteúdo do site em um só lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-[380px]">
          <h2 className="font-mono font-bold text-[30px] text-r3-black">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-[14px] text-r3-muted">
            Entre com seu e-mail e senha cadastrados.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {erro && (
              <div className="border border-admin-danger/40 bg-admin-danger/10 text-admin-danger text-[13px] px-4 py-3">
                {erro}
              </div>
            )}

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-black mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#DCDCDC] px-4 py-3.5 text-[15px] bg-[#FAFAFA] focus:outline-none focus:border-admin-accent focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-[.06em] text-r3-black mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={pwdVisible ? "text" : "password"}
                  required
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="w-full border border-[#DCDCDC] px-4 py-3.5 pr-12 text-[15px] bg-[#FAFAFA] focus:outline-none focus:border-admin-accent focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setPwdVisible((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-r3-muted hover:text-r3-black"
                  aria-label={pwdVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                  {pwdVisible ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
              <a
                href="#"
                className="mt-2 inline-block text-[13px] text-r3-muted hover:text-r3-black"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-admin-accent text-r3-black font-mono font-bold text-[13px] uppercase tracking-[.08em] hover:bg-admin-accentHover transition-colors disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-[12px] text-r3-muted">
            Acesso restrito à equipe R3 Fitness. Em caso de dúvidas, fale com
            o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
