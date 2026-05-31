"use client";

import { useState, FormEvent, useEffect } from "react";
import BriefDisplay from "@/components/BriefDisplay";
import { STYLES, type Brief, type Style } from "@/lib/generator";

const LOADING_STAGES = [
  "Mapping the competitive landscape…",
  "Identifying the category tension…",
  "Sharpening the positioning…",
  "Naming and writing the brand voice…",
  "Selecting palette and typography…",
];

export default function HomePage() {
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState<Style>("Modern");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [submitted, setSubmitted] = useState<{ industry: string; style: Style } | null>(null);
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setStageIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStageIndex((i) => (i + 1) % LOADING_STAGES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [loading]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = industry.trim();
    if (!trimmed) {
      setError("Please enter an industry.");
      return;
    }
    setError(null);
    setLoading(true);
    setBrief(null);
    setSubmitted({ industry: trimmed, style });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ industry: trimmed, style }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed (${res.status}).`);
      }
      if (!data?.brief) {
        throw new Error("Response missing brief.");
      }
      setBrief(data.brief as Brief);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setSubmitted(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-16">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Brand Brief Generator
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900">
          Agency-quality brand briefs, on demand.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          Enter an industry and pick a style. Get a deeply researched branding brief —
          name, positioning, audience, voice, palette, typography, and visual direction.
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
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-60"
              disabled={loading}
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Style</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as Style)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-60"
              disabled={loading}
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

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            Briefs are researched, not templated. Generation takes ~20–40 seconds.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span
                  className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden
                />
                Researching…
              </>
            ) : (
              "Generate brief"
            )}
          </button>
        </div>
      </form>

      {loading && submitted && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900"
              aria-hidden
            />
            <p className="text-sm font-medium text-zinc-700">
              Researching {submitted.style.toLowerCase()} brand for{" "}
              <span className="text-zinc-900">{submitted.industry}</span>
            </p>
          </div>
          <p
            key={stageIndex}
            className="mt-4 text-zinc-500 text-sm animate-[fadeIn_400ms_ease-out]"
          >
            {LOADING_STAGES[stageIndex]}
          </p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-1/3 animate-[slide_2.4s_ease-in-out_infinite] bg-zinc-900/80" />
          </div>
        </div>
      )}

      {brief && submitted && !loading && (
        <BriefDisplay brief={brief} industry={submitted.industry} style={submitted.style} />
      )}

      <footer className="pt-6 text-center text-xs text-zinc-500">
        Built with Next.js · Briefs by Claude.
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </main>
  );
}
