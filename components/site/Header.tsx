"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { WhatsAppCTAButton } from "@/components/site/WhatsAppCTAButton";
import { useCart } from "@/components/site/CartContext";
import { useCtaTopoTexto, useCtaTopoMensagem } from "@/components/site/SiteConfigContext";
import { cn } from "@/lib/utils";

export interface LinhaNav {
  id: string;
  nome: string;
  slug: string;
}

const NAV = [
  { href: "/", label: "Home" },
  { href: "/produtos", label: "Produtos" },
  { href: "/linhas", label: "Linhas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

function isAtivo(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header({ linhas = [] }: { linhas?: LinhaNav[] }) {
  const pathname = usePathname();
  const { count } = useCart();
  const ctaTexto = useCtaTopoTexto();
  const ctaMensagem = useCtaTopoMensagem();
  const [menuAberto, setMenuAberto] = useState(false);
  const [linhasAbertas, setLinhasAbertas] = useState(false);
  const [linhasAbertasMobile, setLinhasAbertasMobile] = useState(false);
  // Pequeno atraso ao sair com o mouse, para o submenu não fechar no
  // caminho entre o item do menu e o painel.
  const fecharTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fecha os menus ao navegar
  useEffect(() => {
    setMenuAberto(false);
    setLinhasAbertas(false);
    setLinhasAbertasMobile(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (fecharTimer.current) clearTimeout(fecharTimer.current);
    };
  }, []);

  function abrirLinhas() {
    if (fecharTimer.current) clearTimeout(fecharTimer.current);
    setLinhasAbertas(true);
  }

  function fecharLinhas() {
    if (fecharTimer.current) clearTimeout(fecharTimer.current);
    fecharTimer.current = setTimeout(() => setLinhasAbertas(false), 140);
  }

  const temLinhas = linhas.length > 0;

  return (
    <header className="sticky top-0 z-[70] bg-r3-black/95 backdrop-blur-md border-b border-r3-divider">
      <div className="max-w-[1280px] mx-auto px-6 h-[76px] flex items-center justify-between gap-8">
        <Logo variant="white" className="h-9" />

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => {
            const active = isAtivo(item.href, pathname);
            const linkClass = cn(
              "font-barlow text-[14px] font-medium uppercase tracking-[.06em] pb-1 border-b-2 transition-colors",
              active
                ? "text-white border-accent"
                : "text-r3-navInactive border-transparent hover:text-white",
            );

            if (item.href === "/linhas" && temLinhas) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={abrirLinhas}
                  onMouseLeave={fecharLinhas}
                >
                  <button
                    type="button"
                    onClick={() => setLinhasAbertas((v) => !v)}
                    aria-expanded={linhasAbertas}
                    aria-haspopup="true"
                    className={cn(linkClass, "flex items-center gap-1.5")}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={2.2}
                      className={cn(
                        "transition-transform duration-200",
                        linhasAbertas && "rotate-180",
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200",
                      linhasAbertas
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-1 invisible pointer-events-none",
                    )}
                  >
                    <ul className="min-w-[248px] bg-r3-card border border-r3-cardBorder shadow-2xl shadow-black/50 py-2">
                      {linhas.map((linha) => (
                        <li key={linha.id}>
                          <Link
                            href={`/produtos?linha=${linha.slug}`}
                            className="block px-5 py-3 font-barlow text-[14px] font-medium uppercase tracking-[.05em] text-r3-navInactive hover:text-accent hover:bg-r3-black transition-colors"
                          >
                            {linha.nome}
                          </Link>
                        </li>
                      ))}
                      <li className="border-t border-r3-divider mt-1 pt-1">
                        <Link
                          href="/linhas"
                          className="block px-5 py-3 font-barlow text-[12px] font-semibold uppercase tracking-[.08em] text-r3-faint hover:text-white transition-colors"
                        >
                          Conhecer as linhas →
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/carrinho"
            aria-label="Ver carrinho"
            className="relative text-white hover:text-accent transition-colors"
          >
            <ShoppingCart size={22} strokeWidth={1.8} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-accent text-r3-black text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <WhatsAppCTAButton
            mensagem={ctaMensagem}
            className="hidden sm:inline-flex px-6 py-3 text-[12px]"
          >
            {ctaTexto}
          </WhatsAppCTAButton>

          <button
            type="button"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            className="lg:hidden text-white hover:text-accent transition-colors"
          >
            {menuAberto ? (
              <X size={24} strokeWidth={1.8} />
            ) : (
              <Menu size={24} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="lg:hidden border-t border-r3-divider bg-r3-black">
          <ul>
            {NAV.map((item) => {
              const active = isAtivo(item.href, pathname);
              const itemClass = cn(
                "w-full flex items-center justify-between px-6 py-4 font-barlow text-[15px] font-medium uppercase tracking-[.06em] border-l-2 text-left",
                active
                  ? "text-accent border-accent bg-r3-card"
                  : "text-r3-navInactive border-transparent",
              );

              if (item.href === "/linhas" && temLinhas) {
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => setLinhasAbertasMobile((v) => !v)}
                      aria-expanded={linhasAbertasMobile}
                      className={itemClass}
                    >
                      {item.label}
                      <ChevronDown
                        size={17}
                        strokeWidth={2.2}
                        className={cn(
                          "transition-transform duration-200",
                          linhasAbertasMobile && "rotate-180",
                        )}
                      />
                    </button>

                    {linhasAbertasMobile && (
                      <ul className="bg-r3-card/60 border-l-2 border-accent">
                        {linhas.map((linha) => (
                          <li key={linha.id}>
                            <Link
                              href={`/produtos?linha=${linha.slug}`}
                              className="block pl-10 pr-6 py-3.5 font-barlow text-[14px] uppercase tracking-[.05em] text-r3-navInactive"
                            >
                              {linha.nome}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href="/linhas"
                            className="block pl-10 pr-6 py-3.5 font-barlow text-[12px] font-semibold uppercase tracking-[.08em] text-r3-faint"
                          >
                            Conhecer as linhas →
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link href={item.href} className={itemClass}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="p-4 sm:hidden">
              <WhatsAppCTAButton mensagem={ctaMensagem} className="w-full py-3.5 text-[13px]">
                {ctaTexto}
              </WhatsAppCTAButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
