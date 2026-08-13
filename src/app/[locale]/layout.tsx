import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { FixedSidebarAds } from "@/components/ads/fixed-sidebar-ads";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://agefieldhighrocktheschool.online").replace(/\/$/, "");
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-GD3D4FKH9B";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07111f",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const image = `${siteUrl}/images/hero.webp`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "Agefield High: Rock the School Wiki", template: "%s" },
    description: "Fan-made Agefield High: Rock the School guides covering missions, classes, platforms, endings, achievements, and gameplay tips.",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.json",
    openGraph: { type: "website", locale, url: siteUrl, siteName: "Agefield High: Rock the School Wiki", images: [{ url: image, width: 2500, height: 1168, alt: "Agefield High: Rock the School" }] },
    twitter: { card: "summary_large_image", title: "Agefield High: Rock the School Wiki", description: "Mission walkthroughs, endings, platform details, and gameplay guides.", images: [image] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Agefield High: Rock the School Wiki",
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    image: `${siteUrl}/images/hero.webp`,
  };

  return (
    <html lang={locale} className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={organization} />
          <SiteHeader locale={locale} />
          <FixedSidebarAds />
          {children}
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
