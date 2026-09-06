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
    <section className="border-y border-ink py-9 md:grid md:grid-cols-[1fr_1.25fr] md:gap-12 md:py-12" aria-labelledby="newsletter-heading">
      <div>
        <p className="eyebrow">The Major Brief</p>
        <h2 id="newsletter-heading" className="mt-3 font-editorial text-3xl font-semibold tracking-tight md:text-4xl">
          Intelligence, delivered with clarity.
        </h2>
      </div>
      <div className="mt-6 md:mt-0">
        <p className="max-w-xl text-sm leading-6 text-muted">A concise briefing on finance, technology, science, and the signals shaping what comes next.</p>
        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={subscribe}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder="Email address" className="min-h-11 min-w-0 flex-1 rounded border border-rule bg-white px-4 text-ink placeholder:text-muted focus:border-ink focus:outline-none" />
          <input type="hidden" name="source" value="website" />
          <input type="hidden" name="interests" value="finance,tech,science,pulse" />
          <button className="button-primary disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Subscribing..." : "Subscribe"}</button>
        </form>
        <p className="mt-3 text-xs text-muted">No noise. Unsubscribe at any time.</p>
        <p className="mt-2 text-sm font-semibold text-accent" role="status" aria-live="polite">{message}</p>
      </div>
    </section>
  );
}
