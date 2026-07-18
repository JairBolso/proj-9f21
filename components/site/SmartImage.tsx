import Image from "next/image";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

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
          <Image src={src} alt={alt} fill className="object-cover" />
        </div>
        <div className={`relative block md:hidden ${className ?? ""}`}>
          <Image src={srcMobile} alt={alt} fill className="object-cover" />
        </div>
      </>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
