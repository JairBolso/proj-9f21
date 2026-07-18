export function PoliticaLayout({
  titulo,
  atualizadoEm,
  children,
}: {
  titulo: string;
  atualizadoEm: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-r3-black text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-14 sm:py-16">
          <h1 className="font-oswald font-bold uppercase text-[clamp(28px,4.4vw,44px)] leading-[1.02]">
            {titulo}
          </h1>
          <p className="mt-3 text-[13px] text-r3-mutedDark">
            Última atualização: {atualizadoEm}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[760px] mx-auto px-6 py-16 text-[15px] leading-relaxed text-r3-body [&_div+div]:mt-8 [&_h2]:font-oswald [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:text-[20px] [&_h2]:text-r3-heading [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_p]:mb-0">
          {children}
        </div>
      </section>
    </>
  );
}
