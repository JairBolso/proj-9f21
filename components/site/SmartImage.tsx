import Image from "next/image";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

const EXTENSOES_VIDEO = [".mp4", ".webm", ".mov", ".m4v"];

function ehVideo(src: string) {
  const semQuery = src.split("?")[0].toLowerCase();
  return EXTENSOES_VIDEO.some((ext) => semQuery.endsWith(ext));
}

// Evita empilhar "relative" com um "absolute/fixed/sticky" vindo de fora: as
// duas classes de posicionamento têm a mesma especificidade, e como o
// Tailwind gera ".absolute" antes de ".relative" no CSS, a última sempre
// vence — o que faz a div colapsar (sem altura) e a mídia desaparecer.
function classePosicao(className?: string) {
  const jaPosicionado = /(^|\s)(absolute|fixed|sticky|static)(\s|$)/.test(className ?? "");
  return jaPosicionado ? "" : "relative";
}

function Midia({ src, alt }: { src: string; alt: string }) {
  if (ehVideo(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  return <Image src={src} alt={alt} fill className="object-cover" />;
}

export function SmartImage({
  src,
  srcMobile,
  alt,
  label,
  className,
  dark = false,
}: {
  src: string | null | undefined;
  srcMobile?: string | null;
  alt: string;
  label: string;
  className?: string;
  dark?: boolean;
}) {
  if (!src && !srcMobile) {
    return <ImagePlaceholder label={label} dark={dark} className={className} />;
  }

  if (srcMobile && srcMobile !== src) {
    return (
      <>
        <div className={`${classePosicao(className)} hidden md:block ${className ?? ""}`}>
          {src ? (
            <Midia src={src} alt={alt} />
          ) : (
            <ImagePlaceholder label={label} dark={dark} className="w-full h-full" />
          )}
        </div>
        <div className={`${classePosicao(className)} block md:hidden ${className ?? ""}`}>
          <Midia src={srcMobile} alt={alt} />
        </div>
      </>
    );
  }

  return (
    <div className={`${classePosicao(className)} ${className ?? ""}`}>
      <Midia src={(src ?? srcMobile)!} alt={alt} />
    </div>
  );
}
