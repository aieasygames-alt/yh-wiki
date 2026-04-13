import { notFound } from "next/navigation";
import Script from "next/script";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { GaRouteTracker } from "../../components/GaRouteTracker";
import type { Locale } from "../../lib/i18n";

const GA_ID = "G-KLVBV8S58R";

const locales: Locale[] = ["zh", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  return (
    <html lang={lang}>
      <head>
        <meta name="msvalidate.01" content="1FDBEDECCADE86F6C58D3B85E9492A14" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
        <Script id="ga-init" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <GaRouteTracker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
