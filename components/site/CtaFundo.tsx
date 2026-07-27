import Image from "next/image";

/**
 * Foto de fundo opcional dos blocos "Solicitar Orçamento" no fim das páginas.
 * Sem imagem cadastrada, a seção continua com o fundo preto de sempre — por
 * isso não usa SmartImage (que renderiza um placeholder no lugar).
 */
export function CtaFundo({
  src,
  srcMobile,
}: {
  src?: string | null;
  srcMobile?: string | null;
}) {
  if (!src) return null;

  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          aria-hidden
          className={`object-cover opacity-25 ${srcMobile ? "hidden md:block" : ""}`}
        />
        {srcMobile && (
          <Image
            src={srcMobile}
            alt=""
            fill
            aria-hidden
            className="object-cover opacity-25 md:hidden"
          />
        )}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-r3-black via-r3-black/85 to-r3-black/60"
      />
    </>
  );
}
