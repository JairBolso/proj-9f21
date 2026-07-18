"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function ProdutoViewTracker({
  id,
  nome,
  linha,
}: {
  id: string;
  nome: string;
  linha?: string;
}) {
  useEffect(() => {
    window.fbq?.("track", "ViewContent", {
      content_ids: [id],
      content_name: nome,
      content_type: "product",
      content_category: linha,
    });

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        items: [{ item_id: id, item_name: nome, item_category: linha }],
      },
    });
  }, [id, nome, linha]);

  return null;
}
