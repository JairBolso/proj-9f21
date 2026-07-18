"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/site/CartContext";
import type { CartItem } from "@/lib/types";

const VARIANTS = {
  primary: "bg-accent text-r3-black hover:brightness-90",
  dark: "bg-r3-dark2 text-white hover:bg-accent hover:text-r3-black",
};

interface AddToCartButtonProps {
  produto: Omit<CartItem, "qtd">;
  qtd?: number;
  variant?: keyof typeof VARIANTS;
  className?: string;
}

export function AddToCartButton({
  produto,
  qtd = 1,
  variant = "primary",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [adicionado, setAdicionado] = useState(false);

  function handleClick() {
    addItem(produto, qtd);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3.5 font-barlow font-bold text-[13px] uppercase tracking-[.1em] transition-colors",
        adicionado ? "bg-r3-whatsapp text-white" : VARIANTS[variant],
        className,
      )}
    >
      {adicionado ? (
        <>
          <Check size={16} strokeWidth={2.4} />
          Adicionado ao carrinho
        </>
      ) : (
        <>
          <ShoppingCart size={16} strokeWidth={2} />
          Adicionar ao Carrinho
        </>
      )}
    </button>
  );
}
