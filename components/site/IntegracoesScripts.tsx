import Script from "next/script";
import type { Database } from "@/lib/supabase/database.types";

type Integracoes = Database["public"]["Tables"]["integracoes"]["Row"] | null;

// Scripts vêm da tabela `integracoes`, editável apenas por admins (RLS) —
// é conteúdo de primeira parte, não entrada de visitante.
export function IntegracoesScripts({ data }: { data: Integracoes }) {
  if (!data) return null;

  return (
    <>
      {data.meta_pixel_id && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${data.meta_pixel_id}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {data.gtm_id && (
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${data.gtm_id}');
          `}
        </Script>
      )}

      {data.scripts_custom && (
        <Script
          id="integracoes-custom"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: data.scripts_custom }}
        />
      )}
    </>
  );
}
