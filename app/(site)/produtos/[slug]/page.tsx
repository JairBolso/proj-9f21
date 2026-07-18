import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { LinhaBadge, CategoriaBadge } from "@/components/site/Badge";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import { ProductCard } from "@/components/site/ProductCard";
import { ProdutoViewTracker } from "@/components/site/ProdutoViewTracker";
import { getProdutoBySlug, getProdutosRelacionados } from "@/lib/data/produtos";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProdutoBySlug(slug);
  if (!produto) return {};

  return {
    title: produto.nome,
    description:
      produto.descricao ??
      `${produto.nome} — equipamento profissional R3 Fitness para academias.`,
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const produto = await getProdutoBySlug(slug);
  if (!produto) notFound();

  const relacionados = await getProdutosRelacionados(
    produto.linha?.id ?? null,
    produto.slug,
  );

  const fotos = produto.fotos ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: produto.nome,
            description: produto.descricao,
            brand: { "@type": "Brand", name: "R3 Fitness" },
            image: fotos,
          }),
        }}
      />
      <ProdutoViewTracker
        id={produto.id}
        nome={produto.nome}
        linha={produto.linha?.nome}
      />

      <div className="bg-r3-offwhite">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center gap-2 text-[13px] text-r3-muted">
          <Link href="/" className="hover:text-r3-heading">
            Home
          </Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-r3-heading">
            Produtos
          </Link>
          <span>/</span>
          <span className="text-r3-heading">{produto.nome}</span>
        </div>
      </div>

      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-square bg-r3-offwhite">
              {fotos[0] ? (
                <Image
                  src={fotos[0]}
                  alt={produto.nome}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <ImagePlaceholder
                  label={`Foto do produto: ${produto.nome}`}
                  className="absolute inset-0"
                />
              )}
            </div>
            {fotos.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {fotos.slice(1, 5).map((foto, i) => (
                  <div key={foto} className="relative aspect-square bg-r3-offwhite">
                    <Image
                      src={foto}
                      alt={`${produto.nome} — foto ${i + 2}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {produto.linha && <LinhaBadge>{produto.linha.nome}</LinhaBadge>}
              {produto.categoria && (
                <CategoriaBadge>{produto.categoria.nome}</CategoriaBadge>
              )}
            </div>

            <h1 className="mt-4 font-oswald font-bold uppercase text-[clamp(28px,4vw,42px)] leading-[1.03] text-r3-heading">
              {produto.nome}
            </h1>

            {produto.descricao && (
              <p className="mt-4 text-[16px] leading-relaxed text-r3-body">
                {produto.descricao}
              </p>
            )}

            <AddToCartButton
              produto={{
                produto_id: produto.id,
                nome: produto.nome,
                slug: produto.slug,
                linha: produto.linha?.nome,
                foto: fotos[0] ?? null,
              }}
              className="mt-8 w-full sm:w-auto"
            />

            {produto.grupos?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {produto.grupos
                  .filter((g) => g.grupo)
                  .map((g) => (
                    <span
                      key={g.grupo!.id}
                      className="text-[11px] uppercase tracking-[.08em] border border-r3-border text-r3-muted px-2.5 py-1"
                    >
                      {g.grupo!.nome}
                    </span>
                  ))}
              </div>
            )}

            {produto.garantia && (
              <div className="mt-6 flex items-center gap-3 border border-r3-border px-4 py-3.5">
                <ShieldCheck size={22} strokeWidth={1.6} className="text-accent flex-shrink-0" />
                <span className="text-[14px] text-r3-body">
                  {produto.garantia} de garantia de fábrica
                </span>
              </div>
            )}

            {produto.ficha_tecnica?.length > 0 && (
              <div className="mt-10">
                <h2 className="font-oswald font-semibold uppercase text-[20px] text-r3-heading mb-4">
                  Especificações técnicas
                </h2>
                <table className="w-full text-[14px]">
                  <tbody>
                    {produto.ficha_tecnica.map((item) => (
                      <tr key={item.campo} className="border-b border-r3-border">
                        <td className="py-3 pr-4 text-r3-muted">
                          {item.campo}
                        </td>
                        <td className="py-3 text-right font-medium text-r3-heading">
                          {item.valor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="bg-r3-offwhite">
          <div className="max-w-[1280px] mx-auto px-6 py-16">
            <h2 className="font-oswald font-semibold uppercase text-[26px] text-r3-heading mb-8">
              Produtos relacionados
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relacionados.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
