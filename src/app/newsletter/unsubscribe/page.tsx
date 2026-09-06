import { EditorialPage } from "@/components/EditorialPage";

export default function Page() {
  return (
    <EditorialPage eyebrow="Newsletter" title="Unsubscribe" intro="Manage your email preferences or unsubscribe using the secure link from your inbox.">
      <h2>How unsubscribe works</h2>
      <ul>
        <li>The email link contains a tokenized action.</li>
        <li>Unsubscribe tokens should never be exposed in client-visible logs.</li>
        <li>Subscribers can resubscribe later through the newsletter form.</li>
      </ul>
      <p className="text-sm text-muted">This page exists as the public landing destination for unsubscribe flows.</p>
    </EditorialPage>
  );
}
