import { EditorialPage } from "@/components/EditorialPage";
import { workerConfig } from "@/lib/worker-config";

export default function Page() {
  return (
    <EditorialPage eyebrow="Automation" title="Cloudflare Worker" intro="Trend discovery and editorial support run separately from the website and CMS.">
      <h2>What this layer does</h2>
      <ul>
        <li>Discovers trends from approved public sources.</li>
        <li>Stores opportunities for editor review.</li>
        <li>Suggests briefs, outlines, and newsletter candidates.</li>
        <li>Never publishes final editorial content automatically.</li>
      </ul>
      <h2>Cron jobs</h2>
      <ul>
        {workerConfig.cron.map((job) => <li key={job}>{job}</li>)}
      </ul>
      <h2>Approved source types</h2>
      <ul>
        {workerConfig.sources.map((source) => <li key={source}>{source}</li>)}
      </ul>
      <p className="text-sm text-muted">{workerConfig.note}</p>
    </EditorialPage>
  );
}
