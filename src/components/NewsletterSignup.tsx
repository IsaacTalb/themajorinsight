export function NewsletterSignup() {
  return (
    <section className="rounded-3xl bg-ink p-8 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-gold">Newsletter</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight">Get The Major Brief</h2>
      <p className="mt-3 max-w-2xl text-slate-300">A planned daily briefing for finance, AI, markets, science, and the biggest internet signals worth understanding.</p>
      <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]" action="/api/newsletter" method="post">
        <label className="sr-only" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" className="rounded-full border border-white/20 bg-white px-5 py-3 text-ink outline-none ring-gold focus:ring-2" />
        <button className="rounded-full bg-gold px-6 py-3 font-black text-ink" type="submit">Subscribe</button>
      </form>
      <p className="mt-3 text-xs text-slate-400">Production signup storage will connect to Supabase and Resend in the next backend step.</p>
    </section>
  );
}
