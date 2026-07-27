"use client";

import { useEffect, useState } from "react";

const SELOS = [
  "Fabricação própria",
  "Entrega e montagem para todo o Brasil",
  "Garantia de fábrica",
];

// Tempo de cada selo na tela — o bastante para ler sem travar a leitura.
const INTERVALO_MS = 3400;

export function Topbar() {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setAtual((i) => (i + 1) % SELOS.length),
      INTERVALO_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: "var(--r3-accent, #FFC62B)" }}>
      <div className="max-w-[1280px] mx-auto px-6 h-9 flex items-center justify-center overflow-hidden">
        {/* A key reinicia a animação a cada troca de selo */}
        <span
          key={atual}
          className="topbar-selo block text-center text-r3-black font-barlow font-semibold text-[12px] uppercase tracking-[.08em]"
        >
          {SELOS[atual]}
        </span>
      </div>
    </div>
  );
}
