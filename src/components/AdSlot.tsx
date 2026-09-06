export function AdSlot({ label }: { label: string }) {
  return (
    <aside className="my-8 rounded border border-dashed border-rule bg-muted/30 p-6 text-center text-sm text-muted" aria-label={label}>
      <span className="block font-semibold text-ink">Ad placement reserved</span>
      <span className="mt-1 block">{label}</span>
    </aside>
  );
}
