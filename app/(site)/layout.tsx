import { Topbar } from "@/components/site/Topbar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";
import { IntegracoesScripts } from "@/components/site/IntegracoesScripts";
import { PixelRouteTracker } from "@/components/site/PixelRouteTracker";
import { CartProvider } from "@/components/site/CartContext";
import { SiteConfigProvider } from "@/components/site/SiteConfigContext";
import { getIntegracoes } from "@/lib/data/integracoes";
import { getConteudoSiteMap } from "@/lib/data/conteudo";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [integracoes, conteudo] = await Promise.all([
    getIntegracoes(),
    getConteudoSiteMap(),
  ]);

  return (
    <SiteConfigProvider value={conteudo}>
      <CartProvider>
        <IntegracoesScripts data={integracoes} />
        <PixelRouteTracker />
        <Topbar />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFAB />
      </CartProvider>
    </SiteConfigProvider>
  );
}
