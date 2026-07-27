import { Topbar } from "@/components/site/Topbar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { IntegracoesScripts } from "@/components/site/IntegracoesScripts";
import { PixelRouteTracker } from "@/components/site/PixelRouteTracker";
import { CartProvider } from "@/components/site/CartContext";
import { SiteConfigProvider } from "@/components/site/SiteConfigContext";
import type { Metadata } from "next";
import { getIntegracoes } from "@/lib/data/integracoes";
import { getConteudoSiteMap } from "@/lib/data/conteudo";
import { getLinhas } from "@/lib/data/linhas";

// Imagem exibida ao compartilhar qualquer página do site (WhatsApp, redes
// sociais). Cadastrada em Conteúdo do Site.
export async function generateMetadata(): Promise<Metadata> {
  const conteudo = await getConteudoSiteMap();
  const imagem = conteudo.og_imagem;
  if (!imagem) return {};

  return {
    openGraph: { images: [imagem] },
    twitter: { card: "summary_large_image", images: [imagem] },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [integracoes, conteudo, linhas] = await Promise.all([
    getIntegracoes(),
    getConteudoSiteMap(),
    getLinhas(),
  ]);

  return (
    <SiteConfigProvider value={conteudo}>
      <CartProvider>
        <IntegracoesScripts data={integracoes} />
        <PixelRouteTracker />
        <Topbar />
        <Header
          linhas={linhas.map((l) => ({ id: l.id, nome: l.nome, slug: l.slug }))}
        />
        <main>{children}</main>
        <Footer
          instagramUrl={conteudo.instagram_url}
          youtubeUrl={conteudo.youtube_url}
        />
        <WhatsAppFAB />
      </CartProvider>
    </SiteConfigProvider>
  );
}
