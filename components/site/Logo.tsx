import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SRC = {
  white: "/logo-wordmark-white.png",
  black: "/logo-wordmark-black.png",
} as const;

export function Logo({
  variant = "white",
  className,
}: {
  variant?: keyof typeof SRC;
  className?: string;
}) {
  return (
    <Link href="/" className={cn("block shrink-0", className)}>
      <Image
        src={SRC[variant]}
        alt="R3 Fitness"
        width={1280}
        height={502}
        className="h-full w-auto object-contain"
        priority
      />
    </Link>
  );
}
