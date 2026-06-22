import { notFound } from "next/navigation";
import Script from "next/script";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { GaRouteTracker } from "../../components/GaRouteTracker";
import { QuickLinks } from "../../components/QuickLinks";
import { LOCALES, toHtmlLang } from "../../lib/i18n";
import type { Locale } from "../../lib/i18n";

// Third-party IDs are configurable via env so dev / preview / prod can differ.
// Defaults keep legacy behaviour if env is unset.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-KLVBV8S58R";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-1719881162787470";
const MSVALIDATE = process.env.NEXT_PUBLIC_MSVALIDATE || "1FDBEDECCADE86F6C58D3B85E9492A14";

export async function generateMetadata() {
  return {};
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) {
    notFound();
  }

  return (
    <html lang={toHtmlLang(lang)}>
      <head>
        {MSVALIDATE && <meta name="msvalidate.01" content={MSVALIDATE} />}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        {/* AdSense loader — lazy so it doesn't block FCP. Next.js <Script> with
            afterInteractive runs after the page is interactive but before
            load event; AdSense fills slots on its own schedule after that. */}
        {ADSENSE_CLIENT && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <GaRouteTracker />
        <Header />
        <main className="flex-1">{children}</main>
        <QuickLinks lang={lang} />
        <Footer />
      </body>
    </html>
  );
}
