"use client";

import { useEffect, useState } from "react";

type ArticleEngagementProps = { slug: string; title: string; url: string };

export function ArticleEngagement({ slug, title, url }: ArticleEngagementProps) {
  const [views, setViews] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = `tmi-viewed-${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((response) => response.json())
      .then((data: { views: number | null }) => setViews(data.views))
      .catch(() => setViews(null));
  }, [slug]);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-rule py-4" aria-label="Article engagement">
      {views !== null && <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-muted">{views.toLocaleString()} views</span>}
      <a className="share-button" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">LinkedIn</a>
      <a className="share-button" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">X</a>
      <a className="share-button" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook</a>
      <button className="share-button" type="button" onClick={copyLink}>{copied ? "Copied" : "Copy link"}</button>
    </div>
  );
}
