"use client";

import { useState, FormEvent, useEffect } from "react";
import BriefDisplay from "@/components/BriefDisplay";
import { STYLES, type Brief, type Style } from "@/lib/generator";

interface BriefResponse {
  brief: Brief & { id: string };
  matchedIndustry: { key: string; label: string };
  confidence: "exact" | "alias" | "fuzzy";
  fuzzyDistance?: number;
  totalInCell: number;
}

const SEEN_STORAGE_PREFIX = "bbg.seen.";
const SEEN_LIMIT = 20;

function seenKey(industryKey: string, style: Style): string {
  return `${SEEN_STORAGE_PREFIX}${industryKey}.${style}`;
}

function loadSeen(industryKey: string, style: Style): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(seenKey(industryKey, style));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveSeen(industryKey: string, style: Style, ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = ids.slice(-SEEN_LIMIT);
    window.localStorage.setItem(seenKey(industryKey, style), JSON.stringify(trimmed));
  } catch {
    /* ignore */
  }
}

export default function HomePage() {
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState<Style>("Modern");
  const [response, setResponse] = useState<BriefResponse | null>(null);
  const [submitted, setSubmitted] = useState<{ industry: string; style: Style } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [industry, style]);

  async function fetchBrief(industryArg: string, styleArg: Style, excludeIds: string[]) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ industry: industryArg, style: styleArg, excludeIds }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error ?? `Request failed (${res.status}).`);
    }
    return data as BriefResponse;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = industry.trim();
    if (!trimmed) {
      setError("Please enter an industry.");
      return;
    }
    setError(null);
    setNotice(null);
    setLoading(true);
    setResponse(null);
    setSubmitted({ industry: trimmed, style });

    try {
      const data = await fetchBrief(trimmed, style, []);
      setResponse(data);
      saveSeen(data.matchedIndustry.key, style, [data.brief.id]);
      if (data.confidence === "fuzzy") {
        setNotice(
          `We didn't find an exact match for "${trimmed}" — showing the closest: ${data.matchedIndustry.label}.`,
        );
      } else if (data.confidence === "alias") {
        setNotice(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setSubmitted(null);
    } finally {
      setLoading(false);
    }
  }

  async function regenerate() {
    if (!submitted || !response) return;
    setLoading(true);
    try {
      const seen = loadSeen(response.matchedIndustry.key, submitted.style);
      const data = await fetchBrief(submitted.industry, submitted.style, seen);
      setResponse(data);
      saveSeen(data.matchedIndustry.key, submitted.style, [...seen, data.brief.id]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
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
          Enter an industry and pick a style. Get a complete branding brief — name, positioning,
          audience, voice, palette, typography, and visual direction.
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
              placeholder="e.g. specialty coffee, fintech, skincare, fitness studio"
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

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            {response && !loading && (
              <button
                type="button"
                onClick={regenerate}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 active:scale-[0.98]"
              >
                Regenerate
              </button>
            )}
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
                  Loading…
                </>
              ) : (
                "Generate brief"
              )}
            </button>
          </div>
        </div>
      </form>

      {notice && response && !loading && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-sm text-amber-900">
          {notice}
        </div>
      )}

      {response && submitted && !loading && (
        <BriefDisplay
          brief={response.brief}
          industry={response.matchedIndustry.label}
          style={submitted.style}
        />
      )}
    </main>
  );
}
