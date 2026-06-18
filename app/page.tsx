"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  Sparkles,
  RefreshCcw,
  ArrowRight,
  Loader2,
  AlertCircle,
  RotateCcw,
  Layers,
  Library,
  Palette,
  CheckCheck,
} from "lucide-react";
import BriefDisplay from "@/components/BriefDisplay";
import Nav from "@/components/Nav";
import StatCard from "@/components/StatCard";
import { STYLES, type Brief, type Style } from "@/lib/generator";

interface BriefResponse {
  brief: Brief & { id: string };
  matchedIndustry: { key: string; label: string };
  confidence: "exact" | "alias" | "fuzzy";
  fuzzyDistance?: number;
  totalInCell: number;
}

interface Stats {
  industries: number;
  styles: number;
  briefs: number;
  designers: number;
  usedBriefs: number;
}

const SEEN_STORAGE_PREFIX = "bbg.seen.";
const SEEN_LIMIT = 20;

const SUGGESTIONS = [
  "specialty coffee",
  "fintech",
  "skincare",
  "fashion",
  "real estate",
  "SaaS",
  "restaurants",
];

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
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setError(null);
  }, [industry, style]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Stats;
        if (!cancelled) setStats(data);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchBrief(industryArg: string, styleArg: Style, excludeIds: string[]) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ industry: industryArg, style: styleArg, excludeIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status}).`);
    return data as BriefResponse;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = industry.trim();
    if (!trimmed) {
      setError("Type an industry first.");
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
          `No exact match for "${trimmed}". Closest neighbor: ${data.matchedIndustry.label}.`,
        );
      } else {
        setNotice(null);
      }
      setTimeout(() => {
        const el = document.getElementById("brief-output");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
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
    <>
      <Nav />

      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10">
        {/* Hero */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-label text-dim mb-1.5 flex items-center gap-1.5">
              <Sparkles size={11} strokeWidth={2.5} />
              Generator
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">
              Generate a brand brief
            </h1>
            <p className="mt-1 text-sm text-muted">
              Type an industry, pick a style. We pull a full brief from the catalog and hand it to a designer.
            </p>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-label text-dim mono">
            {stats ? (
              <span>
                <span className="text-mint">●</span> Live · {stats.briefs} briefs
              </span>
            ) : (
              <span className="text-dim">● Connecting…</span>
            )}
          </div>
        </div>

        {/* KPI grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 animate-fade-up">
          <StatCard
            label="Industries"
            value={stats ? stats.industries : "—"}
            sub="ready to brief"
            accent="violet"
            icon={Layers}
          />
          <StatCard
            label="Briefs in catalog"
            value={stats ? stats.briefs : "—"}
            sub="hand-written, ready to ship"
            accent="mint"
            icon={Library}
          />
          <StatCard
            label="Styles"
            value={stats ? stats.styles : "—"}
            sub="per brief"
            accent="cyan"
            icon={Palette}
          />
          <StatCard
            label="Used briefs"
            value={stats ? stats.usedBriefs : "—"}
            sub="already on the sheet"
            accent="amber"
            icon={CheckCheck}
          />
        </div>

        {/* Generator section head */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-ink">
            New brief <span className="font-normal text-dim">· pick an industry and a style</span>
          </h2>
          <span className="text-[10px] uppercase tracking-label text-dim">Step 1</span>
        </div>

        {/* Generator card */}
        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-border bg-bg-card p-6 sm:p-7 animate-fade-up"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-label text-dim">
                Industry
              </span>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="coffee, fintech, hotel, robotics..."
                className="mt-1.5 block w-full rounded-lg border border-border bg-bg-card px-3.5 py-2.5 text-[15px] text-ink placeholder:text-dim outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15 disabled:opacity-50"
                disabled={loading}
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-label text-dim">
                Style
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    disabled={loading}
                    aria-pressed={style === s}
                    className={
                      "rounded-lg border px-3 py-2 text-[13px] font-medium transition " +
                      (style === s
                        ? "border-violet bg-violet text-white shadow-[0_4px_12px_-4px_rgba(114,41,255,0.45)]"
                        : "border-border bg-bg-card text-muted hover:border-border-hi hover:text-ink")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-label text-dim mr-1">
              Try
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setIndustry(s)}
                disabled={loading}
                className="rounded-md border border-border bg-bg-raised px-2.5 py-1 text-[12px] text-muted transition hover:border-violet/30 hover:bg-violet-bg hover:text-violet-dim"
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-coral/30 bg-coral-bg px-3.5 py-2.5 text-[13px] text-coral">
              <AlertCircle size={14} strokeWidth={2.25} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
            {response && !loading && (
              <button
                type="button"
                onClick={regenerate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-4 py-2.5 text-[13px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
              >
                <RefreshCcw size={13} strokeWidth={2.25} />
                Regenerate
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(114,41,255,0.55)] transition hover:bg-violet-dim disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={13} strokeWidth={2.5} className="animate-spin" />
                  Drafting…
                </>
              ) : (
                <>
                  Generate brief
                  <ArrowRight size={13} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Brief output */}
        <section id="brief-output" className="mt-8">
          {(response || loading) && (
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-ink">
                The brief <span className="font-normal text-dim">· ready to copy and ship</span>
              </h2>
              <span className="text-[10px] uppercase tracking-label text-dim">Step 2</span>
            </div>
          )}

          {notice && response && !loading && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber/30 bg-amber-bg px-3.5 py-2.5 text-[13px] text-ink animate-fade-in">
              <AlertCircle size={14} strokeWidth={2.25} className="mt-0.5 shrink-0 text-amber" />
              <span>{notice}</span>
            </div>
          )}

          {response && submitted && !loading && (
            <div className="animate-fade-up">
              <BriefDisplay
                brief={response.brief}
                industry={response.matchedIndustry.label}
                style={submitted.style}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setResponse(null);
                    setSubmitted(null);
                    setIndustry("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-3.5 py-2 text-[12px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
                >
                  <RotateCcw size={12} strokeWidth={2.25} />
                  Start over
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
