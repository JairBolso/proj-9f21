import Link from "next/link";
import { Camera, Play } from "lucide-react";
import { Logo } from "@/components/site/Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/produtos", label: "Produtos" },
  { href: "/linhas", label: "Linhas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

const POLICIES = [
  { href: "/politicas/garantia", label: "Garantia e assistência" },
  { href: "/politicas/entrega", label: "Entrega e montagem" },
  { href: "/politicas/devolucao", label: "Reembolso e devoluções" },
  { href: "/politicas/privacidade", label: "Política de privacidade" },
  { href: "/politicas/termos", label: "Termos de uso" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-r3-footer border-t border-r3-divider">
      <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <Logo variant="white" className="h-10" />
          <p className="mt-4 text-[14px] leading-relaxed text-r3-mutedDark max-w-[26ch]">
            Fabricação própria de equipamentos para academias, entregue e
            montado em todo o Brasil.
          </p>
          <p className="mt-4 text-[12px] text-r3-faint">
            CNPJ 28.722.145/0001-15
          </p>
        </div>

        <div>
          <h3 className="font-barlow font-semibold text-[12px] uppercase tracking-[.14em] text-white mb-4">
            Navegação
          </h3>
          <ul className="space-y-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-r3-mutedDark hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-barlow font-semibold text-[12px] uppercase tracking-[.14em] text-white mb-4">
            Políticas
          </h3>
          <ul className="space-y-3">
            {POLICIES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-r3-mutedDark hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-barlow font-semibold text-[12px] uppercase tracking-[.14em] text-white mb-4">
            Contato
          </h3>
          <ul className="space-y-3 text-[14px] text-r3-mutedDark">
            <li>(17) 99716-8842</li>
            <li>orcamento@r3fitness.com.br</li>
            <li>Seg a sex, 8h às 17h</li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center border border-r3-divider text-r3-mutedDark hover:text-accent hover:border-accent transition-colors"
            >
              <Camera size={16} strokeWidth={1.8} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-9 h-9 flex items-center justify-center border border-r3-divider text-r3-mutedDark hover:text-accent hover:border-accent transition-colors"
            >
              <Play size={16} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-r3-divider">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-r3-faint">
          <span>© {year} R3 Fitness. Todos os direitos reservados.</span>
          <div className="flex flex-wrap gap-2">
            {["Pix", "Cartão em até 12x", "Boleto", "Condições para projetos"].map(
              (label) => (
                <span
                  key={label}
                  className="px-3 py-1 border border-r3-divider text-r3-navInactive"
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
