import Link from "next/link";
import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { LinhaBadge } from "@/components/site/Badge";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import type { ProdutoComRelacoes } from "@/lib/types";

export function ProductCard({ produto }: { produto: ProdutoComRelacoes }) {
  const foto = produto.fotos?.[0];

  return (
    <div className="group flex flex-col bg-white border border-r3-border hover:border-r3-borderMuted transition-colors">
      <Link
        href={`/produtos/${produto.slug}`}
        className="relative aspect-square bg-r3-offwhite overflow-hidden"
      >
        {foto ? (
          <Image
            src={foto}
            alt={produto.nome}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-r3-borderMuted">
            <Dumbbell size={40} strokeWidth={1.3} />
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {produto.linha && <LinhaBadge>{produto.linha.nome}</LinhaBadge>}
        </div>

        <Link
          href={`/produtos/${produto.slug}`}
          className="font-oswald font-semibold text-[17px] uppercase leading-tight text-r3-heading hover:text-accent transition-colors"
        >
          {produto.nome}
        </Link>

        <AddToCartButton
          produto={{
            produto_id: produto.id,
            nome: produto.nome,
            slug: produto.slug,
            linha: produto.linha?.nome,
            foto: foto ?? null,
          }}
          variant="dark"
          className="mt-auto w-full py-3 text-[12px]"
        />
      </div>
    </div>
  );
}
