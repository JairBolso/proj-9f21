"use client";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-white">
      <h1 className="font-oswald font-semibold uppercase text-[28px] text-r3-heading">
        Algo deu errado
      </h1>
      <p className="mt-3 text-[15px] text-r3-muted max-w-[42ch]">
        Não conseguimos carregar esta página agora. Tente novamente em
        instantes.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 px-6 py-3 bg-accent text-r3-black font-barlow font-bold text-[13px] uppercase tracking-[.1em] hover:brightness-90 transition-[filter]"
      >
        Tentar novamente
      </button>
    </div>
  );
}
