import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Admin403Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg text-white font-inter px-6">
      <div className="max-w-[440px] text-center">
        <ShieldAlert
          size={40}
          strokeWidth={1.6}
          className="mx-auto text-admin-danger"
        />
        <h1 className="mt-6 font-mono font-bold text-[24px] uppercase">
          Sem permissão
        </h1>
        <p className="mt-3 text-[14px] text-admin-textMuted">
          Seu usuário não tem acesso a esta área do painel. Se você acredita
          que isso é um engano, fale com um administrador.
        </p>
        <Link
          href="/admin"
          className="mt-8 inline-block px-6 py-3 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.08em] hover:bg-admin-accentHover transition-colors"
        >
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
