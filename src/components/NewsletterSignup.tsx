"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export function NewsletterSignup() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const form = event.currentTarget;

    try {
      const response = await fetch("/api/newsletter", { method: "POST", body: new FormData(form) });
      const data = (await response.json()) as { message: string };
      setMessage(data.message);
      if (response.ok) form.reset();
    } catch {
      setMessage("The signup service is unavailable. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl bg-ink p-8 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-gold">Newsletter</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight">Get The Major Brief</h2>
      <p className="mt-3 max-w-2xl text-slate-300">A planned daily briefing for finance, AI, markets, science, and the biggest internet signals worth understanding.</p>
      <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={subscribe}>
        <label className="sr-only" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" className="rounded-full border border-white/20 bg-white px-5 py-3 text-ink outline-none ring-gold focus:ring-2" />
        <button className="rounded-full bg-gold px-6 py-3 font-black text-ink disabled:cursor-wait disabled:opacity-70" type="submit" disabled={isSubmitting}>{isSubmitting ? "Subscribing…" : "Subscribe"}</button>
      </form>
      <p className="mt-3 text-xs text-slate-400">No spam. Unsubscribe at any time.</p>
      <p className="mt-3 text-sm font-semibold text-gold" aria-live="polite">{message}</p>
    </section>
  );
}
