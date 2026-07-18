"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { WhatsAppCTAButton } from "@/components/site/WhatsAppCTAButton";
import { useCart } from "@/components/site/CartContext";
import { useCtaTopoTexto, useCtaTopoMensagem } from "@/components/site/SiteConfigContext";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/produtos", label: "Produtos" },
  { href: "/linhas", label: "Linhas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const ctaTexto = useCtaTopoTexto();
  const ctaMensagem = useCtaTopoMensagem();
  const [menuAberto, setMenuAberto] = useState(false);

  // Fecha o menu mobile ao navegar
  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[70] bg-r3-black/95 backdrop-blur-md border-b border-r3-divider">
      <div className="max-w-[1280px] mx-auto px-6 h-[76px] flex items-center justify-between gap-8">
        <Logo variant="white" className="h-9" />

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-barlow text-[14px] font-medium uppercase tracking-[.06em] pb-1 border-b-2 transition-colors",
                  active
                    ? "text-white border-accent"
                    : "text-r3-navInactive border-transparent hover:text-white",
                )}
              >
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
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-6 py-4 font-barlow text-[15px] font-medium uppercase tracking-[.06em] border-l-2",
                      active
                        ? "text-accent border-accent bg-r3-card"
                        : "text-r3-navInactive border-transparent",
                    )}
                  >
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
