import { EditorialPage } from "@/components/EditorialPage";

export default function Page() {
  return (
    <EditorialPage eyebrow="Newsletter" title="Preferences" intro="Manage topics, frequency, and update preferences from your subscription email link.">
      <h2>What you can manage</h2>
      <ul>
        <li>Topic interests</li>
        <li>Email frequency</li>
        <li>Confirmation state</li>
        <li>Unsubscribe and resubscribe controls</li>
      </ul>
      <p className="text-sm text-muted">This page is a public entry point; tokenized account actions should be handled by secure links from email.</p>
    </EditorialPage>
  );
}
