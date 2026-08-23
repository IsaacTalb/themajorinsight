import "server-only";

import { fixtureArticles } from "@/lib/article-fixtures";
import { createAdminSupabaseClient, createPublicSupabaseClient } from "@/lib/supabase";

export type Article = {
  type: "Analysis" | "News" | "Explainer" | "Guide" | "Review" | "Comparison" | "Report" | "Opinion";
  title: string; slug: string; categorySlug: string; categoryName: string; excerpt: string;
  publishedAt: string; updatedAt: string; readingTime: string; focusKeyword: string; tags: string[];
  imageAlt: string; image?: { src: string; caption: string; credit: string };
  author: { name: string; slug: string; role: string; bio: string };
  keyTakeaways?: string[]; body: string[]; sources: { label: string; url: string }[];
};

export type Pagination = { page?: number; pageSize?: number };
export type ArticlePage = { articles: Article[]; page: number; pageSize: number; total: number; totalPages: number };

const select = `title,slug,excerpt,content,content_type,published_at,updated_at,reading_time_minutes,focus_keyword,featured_image_url,featured_image_alt,featured_image_caption,featured_image_credit,categories!inner(name,slug),authors!inner(name,slug,position,bio),post_tags(tags(name,slug)),post_sources(label,url,sort_order)`;

function mapPost(row: any): Article {
  const content = row.content ?? {};
  const paragraphs = Array.isArray(content.paragraphs) ? content.paragraphs.filter((x: unknown): x is string => typeof x === "string") : [];
  const takeaways = Array.isArray(content.key_takeaways) ? content.key_takeaways.filter((x: unknown): x is string => typeof x === "string") : undefined;
  return {
    type: row.content_type, title: row.title, slug: row.slug, excerpt: row.excerpt,
    categorySlug: row.categories.slug, categoryName: row.categories.name,
    publishedAt: row.published_at, updatedAt: row.updated_at,
    readingTime: `${row.reading_time_minutes || 1} min read`, focusKeyword: row.focus_keyword ?? "",
    tags: (row.post_tags ?? []).map((x: any) => x.tags.name), imageAlt: row.featured_image_alt ?? "",
    image: row.featured_image_url ? { src: row.featured_image_url, caption: row.featured_image_caption ?? "", credit: row.featured_image_credit ?? "" } : undefined,
    author: { name: row.authors.name, slug: row.authors.slug, role: row.authors.position, bio: row.authors.bio ?? "" },
    keyTakeaways: takeaways, body: paragraphs,
    sources: (row.post_sources ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((x: any) => ({ label: x.label, url: x.url }))
  };
}

function fallback(items = fixtureArticles): Article[] { return items as Article[]; }

export async function getArticles({ page = 1, pageSize = 12 }: Pagination = {}): Promise<ArticlePage> {
  const safePage = Math.max(1, page); const safeSize = Math.min(50, Math.max(1, pageSize));
  const client = createPublicSupabaseClient();
  if (!client) { const items = fallback(); return { articles: items.slice((safePage - 1) * safeSize, safePage * safeSize), page: safePage, pageSize: safeSize, total: items.length, totalPages: Math.ceil(items.length / safeSize) }; }
  const from = (safePage - 1) * safeSize;
  const { data, count, error } = await client.from("posts").select(select, { count: "exact" }).eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).range(from, from + safeSize - 1);
  if (error) throw new Error(`Unable to load published articles: ${error.message}`);
  return { articles: (data ?? []).map(mapPost), page: safePage, pageSize: safeSize, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / safeSize) };
}

export async function getArticleBySlug(slug: string) {
  const client = createPublicSupabaseClient();
  if (!client) return fallback().find((article) => article.slug === slug) ?? null;
  const { data, error } = await client.from("posts").select(select).eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
  if (error) throw new Error(`Unable to load article: ${error.message}`);
  return data ? mapPost(data) : null;
}

export async function getArticlesByCategory(slug: string, pagination?: Pagination) { const page = await getArticles(pagination); return { ...page, articles: page.articles.filter((x) => x.categorySlug === slug) }; }
export async function getArticlesByTag(slug: string, pagination?: Pagination) { const page = await getArticles(pagination); return { ...page, articles: page.articles.filter((x) => x.tags.some((tag) => tag.toLowerCase().replaceAll(" ", "-") === slug)) }; }
export async function getArticlesByAuthor(slug: string, pagination?: Pagination) { const page = await getArticles(pagination); return { ...page, articles: page.articles.filter((x) => x.author.slug === slug) }; }
export async function getLatestInsights(limit = 6) { return (await getArticles({ pageSize: limit })).articles; }
export async function getFeaturedInsights(limit = 6) { return getFlaggedArticles("is_featured", limit); }
export async function getTrendingInsights(limit = 6) { return getFlaggedArticles("view_count", limit); }

async function getFlaggedArticles(field: "is_featured" | "view_count", limit: number) {
  const client = createPublicSupabaseClient(); if (!client) return fallback().slice(0, limit);
  let query = client.from("posts").select(select).eq("status", "published").lte("published_at", new Date().toISOString());
  query = field === "is_featured" ? query.eq(field, true).order("published_at", { ascending: false }) : query.order(field, { ascending: false });
  const { data, error } = await query.limit(limit); if (error) throw new Error(`Unable to load insights: ${error.message}`); return (data ?? []).map(mapPost);
}

/** Trusted editorial access; callers must authenticate and authorize an admin first. */
export async function getAdminPosts(status?: "draft" | "review" | "scheduled" | "published" | "archived", pagination: Pagination = {}) {
  const page = Math.max(1, pagination.page ?? 1), pageSize = Math.min(100, Math.max(1, pagination.pageSize ?? 25));
  let query = createAdminSupabaseClient().from("posts").select("*", { count: "exact" }).order("updated_at", { ascending: false });
  if (status) query = query.eq("status", status);
  return query.range((page - 1) * pageSize, page * pageSize - 1);
}
