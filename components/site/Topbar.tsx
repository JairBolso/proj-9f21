export function Topbar() {
  return (
    <div style={{ background: "var(--r3-accent, #FFC62B)" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-2 flex flex-wrap justify-center gap-3 text-r3-black font-barlow font-semibold text-[12px] uppercase tracking-[.08em]">
        <span>Fabricação própria</span>
        <span aria-hidden>•</span>
        <span>Entrega e montagem para todo o Brasil</span>
        <span aria-hidden>•</span>
        <span>Garantia de fábrica</span>
      </div>
    </div>
  );
}
