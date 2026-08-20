import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { JsonLd, WikiSidebar } from "@/components/site";
import { getAllContent, getDynamicNavigation, type ContentItem, CONTENT_TYPES } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";
import HomePageClient from "./HomePageClient";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.agefieldhighrocktheschool.online").replace(/\/$/, "");

type Messages = typeof en;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as Messages;
  const image = `${siteUrl}/images/hero.webp`;
  const title = "Agefield High Wiki – Walkthrough, Map, Endings & Guides";
  const description = "Agefield High: Rock the School wiki with the complete walkthrough, usable map, character guide, endings, missions, and gameplay help.";
  return {
    title,
    description,
    alternates: { canonical: locale === "en" ? "/" : `/${locale}`, languages: { en: "/", es: "/es", "pt-BR": "/br", ru: "/ru", "x-default": "/" } },
    openGraph: { title, description, url: locale === "en" ? siteUrl : `${siteUrl}/${locale}`, siteName: "Agefield High: Rock the School Wiki", images: [{ url: image, width: 2500, height: 1168, alt: "Agefield High: Rock the School" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const messages = (await getMessages({ locale })) as Messages;
  const navGroups = getDynamicNavigation(loc);
  const localizedUrl = locale === "en" ? siteUrl : `${siteUrl}/${locale}`;
  const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: "Agefield High: Rock the School Wiki", alternateName: "Agefield High Wiki", url: localizedUrl, description: "Fan-made Agefield High: Rock the School mission walkthroughs, endings, platform details, and gameplay guides.", inLanguage: locale, image: `${siteUrl}/images/hero.webp`, publisher: { "@type": "Organization", name: "Agefield High: Rock the School Wiki", url: siteUrl } };

  // 动态加载所有 content 目录下的文章
  const allArticles: ContentItem[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, loc);
    allArticles.push(...items);
  }

  // Keep the homepage update list concise; the category pages retain every article.
  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = a.metadata.lastModified || a.metadata.date;
      const dateB = b.metadata.lastModified || b.metadata.date;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd data={webSite} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
        <div className="min-w-0">
          <HomePageClient home={messages.home} nav={messages.nav} locale={locale} articles={allArticles} recentArticles={recentArticles} />
        </div>
        <div className="min-w-0">
          <WikiSidebar locale={locale} navGroups={navGroups} />
        </div>
      </div>
    </main>
  );
}
