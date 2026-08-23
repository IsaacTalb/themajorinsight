export const POST_STATUSES = ["draft", "review", "scheduled", "published", "archived"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function makeSlug(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}

/** A deliberately small HTML allow-list for content produced by the article editor. */
export function sanitizeArticleHtml(input: string) {
  let html = input.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|iframe|object|embed|form|input|button)[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<(script|style|iframe|object|embed|form|input|button)[^>]*\/?\s*>/gi, "");
  const allowed = new Set(["p","h2","h3","strong","b","em","i","a","ul","ol","li","blockquote","img","table","thead","tbody","tr","th","td","hr","aside","code","pre","br"]);
  html = html.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, name: string, attrs: string) => {
    name = name.toLowerCase();
    if (!allowed.has(name)) return "";
    if (tag.startsWith("</")) return `</${name}>`;
    const clean: string[] = [];
    attrs.replace(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g, (_: string, key: string, a: string, b: string, c: string) => {
      key = key.toLowerCase(); const value = a ?? b ?? c ?? "";
      if (name === "a" && key === "href" && /^(https?:\/\/|mailto:|\/|#)/i.test(value)) clean.push(`href="${escapeAttribute(value)}"`);
      if (name === "a" && key === "target" && value === "_blank") clean.push('target="_blank"', 'rel="noopener noreferrer"');
      if (name === "img" && ["src","alt","title"].includes(key) && (key !== "src" || /^(https?:\/\/|\/)/i.test(value))) clean.push(`${key}="${escapeAttribute(value)}"`);
      if (["th","td"].includes(name) && ["colspan","rowspan"].includes(key) && /^\d{1,2}$/.test(value)) clean.push(`${key}="${value}"`);
      if (name === "aside" && key === "data-callout") clean.push('data-callout="true"');
      return "";
    });
    return `<${name}${clean.length ? ` ${[...new Set(clean)].join(" ")}` : ""}>`;
  });
  return html.trim();
}

function escapeAttribute(value: string) { return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
export function plainText(html: string) { return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }

export type EditorialWarningsInput = { title:string; slug:string; authorId:string; bodyHtml:string; featuredImageUrl:string; featuredImageAlt:string; seoDescription:string; sources:{label:string;url:string}[]; scheduledAt:string; duplicateSlug?:boolean };
export function editorialWarnings(p: EditorialWarningsInput) {
  const warnings: string[] = [];
  if (!p.authorId) warnings.push("Missing author");
  if (!p.sources.some(s => s.label.trim() && /^https?:\/\//.test(s.url))) warnings.push("Missing sources");
  if (p.featuredImageUrl && !p.featuredImageAlt.trim()) warnings.push("Missing featured-image alt text");
  if (!p.seoDescription.trim()) warnings.push("Empty SEO description");
  if (!slugPattern.test(p.slug)) warnings.push("Invalid slug");
  if (p.duplicateSlug) warnings.push("Duplicate slug");
  if (p.scheduledAt && new Date(p.scheduledAt).getTime() <= Date.now()) warnings.push("Scheduled date is in the past");
  if (!p.title.trim() || plainText(p.bodyHtml).length < 100) warnings.push("Unfinished content");
  return warnings;
}
