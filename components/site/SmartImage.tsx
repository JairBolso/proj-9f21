import Image from "next/image";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

const EXTENSOES_VIDEO = [".mp4", ".webm", ".mov", ".m4v"];

function ehVideo(src: string) {
  const semQuery = src.split("?")[0].toLowerCase();
  return EXTENSOES_VIDEO.some((ext) => semQuery.endsWith(ext));
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
  if (!src) {
    return <ImagePlaceholder label={label} dark={dark} className={className} />;
  }

  if (srcMobile) {
    return (
      <>
        <div className={`relative hidden md:block ${className ?? ""}`}>
          <Midia src={src} alt={alt} />
        </div>
        <div className={`relative block md:hidden ${className ?? ""}`}>
          <Midia src={srcMobile} alt={alt} />
        </div>
      </>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <Midia src={src} alt={alt} />
    </div>
  );
}
