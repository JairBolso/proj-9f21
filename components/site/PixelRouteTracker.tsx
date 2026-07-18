"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Dispara PageView (Meta) e page_view (dataLayer/GTM) a cada troca de rota,
// já que o app router navega sem recarregar a página.
export function PixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.fbq?.("track", "PageView");

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "page_view",
      page_path: `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`,
    });
  }, [pathname, searchParams]);

  return null;
}
