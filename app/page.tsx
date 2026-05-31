"use client";

import { useState, FormEvent } from "react";
import BriefDisplay from "@/components/BriefDisplay";
import { generateBrief, type Brief, type Style } from "@/lib/generator";

const STYLES: Style[] = ["Modern", "Luxury", "Minimal", "Corporate", "Creative"];

export default function HomePage() {
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState<Style>("Modern");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [submitted, setSubmitted] = useState<{ industry: string; style: Style } | null>(null);
  const [nonce, setNonce] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = industry.trim();
    if (!trimmed) {
      setError("Please enter an industry.");
      return;
    }
    setError(null);
    setBrief(generateBrief(trimmed, style, nonce));
    setSubmitted({ industry: trimmed, style });
  }

  function regenerate() {
    if (!submitted) return;
    const next = nonce + 1;
    setNonce(next);
    setBrief(generateBrief(submitted.industry, submitted.style, next));
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-16">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Brand Brief Generator
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900">
          Name, position, and style your brand in seconds.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          Enter an industry and pick a style. Get a complete branding brief — brand
          name, positioning, palette, typography, and visual direction — instantly.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_220px]">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Industry</span>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. specialty coffee, fintech for freelancers, AI for legal teams"
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Style</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as Style)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p className="mt-3 text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          {brief && (
            <button
              type="button"
              onClick={regenerate}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 active:scale-[0.98]"
            >
              Regenerate variation
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98]"
          >
            Generate brief
          </button>
        </div>
      </form>

      {brief && submitted && (
        <BriefDisplay brief={brief} industry={submitted.industry} style={submitted.style} />
      )}

      <footer className="pt-6 text-center text-xs text-zinc-500">
        Built with Next.js · Generates instantly, no sign-up required.
      </footer>
    </main>
  );
}
