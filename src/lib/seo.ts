import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function pageMetadata(title: string, description: string, path: string, options: { noIndex?: boolean } = {}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: options.noIndex ? { index: false, follow: false, noarchive: true } : undefined,
    openGraph: { title, description, url, siteName: siteConfig.name, locale: siteConfig.locale, type: "website" },
    twitter: { card: "summary_large_image", title, description }
  };
}

export function safeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path)
    }))
  };
}

export function authorSchema(author: { name: string; slug: string; role: string; bio: string }) {
  const isEditorialTeam = /desk|team|staff/i.test(`${author.name} ${author.role}`);
  return {
    "@type": isEditorialTeam ? "Organization" : "Person",
    name: author.name,
    url: absoluteUrl(`/author/${author.slug}`),
    description: author.bio,
    ...(isEditorialTeam ? {} : { jobTitle: author.role, worksFor: { "@id": `${siteConfig.url}/#organization` } })
  };
}
