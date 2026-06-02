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

const SUGGESTIONS = [
  "specialty coffee",
  "fintech",
  "skincare",
  "fashion",
  "real estate",
  "SaaS",
  "restaurants",
];

const MARQUEE_NAMES = [
  "OFF SEASON",
  "Stoneham & Vail",
  "COFFEE AND",
  "MONEY OK",
  "GOOD SKIN DAY",
  "OPEN KITCHEN",
  "TIP WELL",
  "DRESS BETTER",
  "WEAR",
  "HOT LINE",
  "PAYDAY",
  "Smithson House",
  "STILL HOT",
  "THIRD CHAIR",
  "MAYBE LATER",
  "MENU",
  "Eastbury Trust",
  "Salt & Almond",
  "CLEAR DAY",
  "Harland & Mark",
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
      {/* Top strip */}
      <div className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 text-[11px] uppercase tracking-[0.22em] text-ink/60">
          <div className="flex items-center gap-2">
            <span className="text-violet">✦</span>
            <span>Brand Briefs Co.</span>
            <span className="hidden sm:inline text-ink/30">— Est. 2026</span>
          </div>
          <div className="hidden sm:flex items-center gap-5">
            <span>250 briefs</span>
            <span className="text-ink/30">·</span>
            <span>50 industries</span>
            <span className="text-ink/30">·</span>
            <span>5 styles</span>
          </div>
          <div className="sm:hidden">250 / 50 / 5</div>
        </div>
      </div>

      <main className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* HERO */}
        <section className="pt-14 sm:pt-24 pb-10 sm:pb-16 animate-fade-up">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ink/55">
                <span className="text-violet">●</span> The Brand Brief Generator
              </p>
              <h1 className="mt-5 font-display text-[56px] sm:text-[88px] lg:text-[112px] text-ink">
                Your boss will think
                <br />
                you paid an{" "}
                <span className="italic text-violet">agency</span>.
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-base sm:text-lg leading-relaxed text-ink/75">
                Type an industry. Pick a style. Get the whole brief in about a second.
                Name, positioning, audience, voice, palette, type. The full deck.
              </p>
              <p className="mt-4 text-sm text-ink/55 italic font-display text-xl">
                No prompt engineering required.
              </p>
            </div>
          </div>
        </section>

        {/* MARQUEE OF BRAND NAMES */}
        <section className="relative -mx-5 sm:-mx-8 border-y border-ink/10 bg-paper/60 py-5 overflow-hidden">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...MARQUEE_NAMES, ...MARQUEE_NAMES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display text-2xl sm:text-3xl text-ink/70 whitespace-nowrap flex items-center gap-10"
              >
                {name}
                <span className="text-violet">✦</span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cream to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-cream to-transparent" />
        </section>

        {/* FORM */}
        <section className="pt-12 sm:pt-20 pb-8">
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-8">
            {/* Industry block */}
            <div>
              <label className="flex items-baseline gap-3">
                <span className="font-display text-2xl text-violet">01</span>
                <span className="text-xs uppercase tracking-[0.22em] text-ink/55">
                  Industry
                </span>
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Type anything — coffee, fintech, hotel..."
                className="mt-3 block w-full border-0 border-b-2 border-ink/20 bg-transparent pb-3 font-display text-3xl sm:text-5xl text-ink placeholder:text-ink/30 outline-none transition focus:border-violet disabled:opacity-50"
                disabled={loading}
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />

              {/* Suggestion chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="self-center text-[11px] uppercase tracking-[0.2em] text-ink/45 mr-1">
                  Try
                </span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setIndustry(s)}
                    disabled={loading}
                    className="rounded-full border border-ink/15 bg-paper px-3.5 py-1.5 text-sm text-ink/75 transition hover:border-violet hover:bg-violet-tint hover:text-violet-deep active:scale-[0.97]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Style + submit */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label className="flex items-baseline gap-3">
                  <span className="font-display text-2xl text-violet">02</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-ink/55">
                    Style
                  </span>
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      disabled={loading}
                      aria-pressed={style === s}
                      className={
                        "rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.97] " +
                        (style === s
                          ? "border-ink bg-ink text-cream"
                          : "border-ink/15 bg-paper text-ink/75 hover:border-ink/40")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-violet px-8 text-base font-semibold text-cream shadow-[0_14px_40px_-12px_rgba(114,41,255,0.6)] transition hover:bg-violet-deep active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
                      aria-hidden
                    />
                    <span>Drafting…</span>
                  </>
                ) : (
                  <>
                    <span>Generate the brief</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <p
                className="rounded-xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm text-rose-800"
                role="alert"
              >
                {error}
              </p>
            )}
          </form>
        </section>

        {/* OUTPUT */}
        <section id="brief-output" className="pb-24">
          {notice && response && !loading && (
            <div className="mb-6 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 animate-fade-in">
              {notice}
            </div>
          )}

          {response && submitted && !loading && (
            <div className="animate-fade-up">
              <BriefDisplay
                brief={response.brief}
                industry={response.matchedIndustry.label}
                style={submitted.style}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={regenerate}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-3 text-sm font-medium text-ink/80 transition hover:border-violet hover:text-violet-deep active:scale-[0.97]"
                >
                  ↻ Generate a different one
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResponse(null);
                    setSubmitted(null);
                    setIndustry("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-3 text-sm font-medium text-ink/80 transition hover:border-ink/40 active:scale-[0.97]"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          {!response && !loading && (
            <div className="rounded-3xl border border-dashed border-ink/15 bg-paper/50 p-10 text-center">
              <p className="font-display text-2xl italic text-ink/55">
                Your brief will land here.
              </p>
              <p className="mt-2 text-sm text-ink/45">
                Naming, positioning, voice, palette, and type — in one scroll.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 bg-paper/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl italic text-ink/70">
            Made for designers who hate writing decks.
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-ink/45">
            © 2026 Brand Briefs Co. — All names fictional.
          </p>
        </div>
      </footer>
    </>
  );
}
