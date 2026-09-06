import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage } from "@/components/EditorialPage";
import { pageMetadata } from "@/lib/seo";
import { monetizationConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Advertise",
  "Advertising and sponsorship opportunities with The Major Insight.",
  "/advertise"
);

export default function Page() {
  return (
    <EditorialPage eyebrow="Partnerships" title="Advertise" intro="Reach curious decision-makers across markets, technology, science, and culture.">
      <h2>Audience and placements</h2>
      <p>We keep monetization configurable so ads can remain disabled until approval and compliance review are complete.</p>
      <ul>
        <li>After article intro</li>
        <li>Mid article</li>
        <li>Before related articles</li>
        <li>Desktop sidebar</li>
        <li>Between homepage sections</li>
      </ul>
      <h2>Partnership options</h2>
      <ul>
        <li>Display placements configured through reusable ad slots.</li>
        <li>Newsletter sponsorships.</li>
        <li>Clearly labeled custom programs.</li>
        <li>Affiliate-support placements with visible disclosure.</li>
      </ul>
      <h2>Editorial independence</h2>
      <p>Commercial partnerships are labeled and separated from newsroom decision-making. Sponsors do not receive approval over independent editorial coverage.</p>
      {monetizationConfig.adsEnabled ? (
        <p className="text-sm text-muted">Ads are currently enabled by environment configuration.</p>
      ) : (
        <p className="text-sm text-muted">Ads are currently disabled in configuration until approval is complete.</p>
      )}
      <h2>Start a conversation</h2>
      <p>Share your campaign goals, timing, intended audience, and budget through our <Link className="text-link font-semibold" href="/contact">contact page</Link>.</p>
    </EditorialPage>
  );
}
