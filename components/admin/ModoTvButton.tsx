"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tv } from "lucide-react";

export function ModoTvButton() {
  const router = useRouter();
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    function handleChange() {
      setAtivo(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  useEffect(() => {
    if (!ativo) return;
    const interval = setInterval(() => router.refresh(), 60_000);
    return () => clearInterval(interval);
  }, [ativo, router]);

  async function toggleTv() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTv}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-accent text-r3-black font-mono font-bold text-[12px] uppercase tracking-[.08em] hover:bg-admin-accentHover transition-colors"
    >
      <Tv size={15} strokeWidth={2} />
      {ativo ? "Sair do Modo TV" : "Modo TV"}
    </button>
  );
}
