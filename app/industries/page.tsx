"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layers,
  Search,
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import Nav from "@/components/Nav";
import { STYLES, type Style } from "@/lib/generator";

interface CellCount {
  total: number;
  used: number;
  remaining: number;
}
interface IndustryRow {
  key: string;
  label: string;
  total: number;
  used: number;
  remaining: number;
  styles: Record<Style, CellCount>;
}
interface Payload {
  count: number;
  totals: { total: number; used: number; remaining: number };
  industries: IndustryRow[];
}

type SortKey = "label" | "remaining" | "used" | "total";

function Bar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
      <div
        className="h-full rounded-full bg-violet transition-all"
        style={{ width: `${pct}%` }}
        aria-hidden
      />
    </div>
  );
}

export default function IndustriesPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("label");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/industries", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? `Failed (${res.status}).`);
        if (!cancelled) setData(json as Payload);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    let list = data.industries;
    if (q) list = list.filter((i) => i.label.toLowerCase().includes(q) || i.key.includes(q));
    const sorted = [...list].sort((a, b) => {
      if (sort === "label") return a.label.localeCompare(b.label);
      if (sort === "remaining") return b.remaining - a.remaining || a.label.localeCompare(b.label);
      if (sort === "used") return b.used - a.used || a.label.localeCompare(b.label);
      return b.total - a.total || a.label.localeCompare(b.label);
    });
    return sorted;
  }, [data, query, sort]);

  function cycleSort() {
    setSort((s) =>
      s === "label" ? "remaining" : s === "remaining" ? "used" : s === "used" ? "total" : "label",
    );
  }
  const sortLabel = { label: "A–Z", remaining: "Most remaining", used: "Most used", total: "Largest" }[sort];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10">
        {/* Hero */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-label text-dim mb-1.5 flex items-center gap-1.5">
              <Layers size={11} strokeWidth={2.5} />
              Industries
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">
              What&apos;s in the catalog
            </h1>
            <p className="mt-1 text-sm text-muted">
              Every industry the generator can brief, and how many briefs are still unused.
            </p>
          </div>
          {data && (
            <div className="mono text-[11px] uppercase tracking-label text-dim text-right leading-relaxed">
              <div>{data.count} industries</div>
              <div className="text-mint">{data.totals.remaining} remaining</div>
              <div className="text-muted">
                {data.totals.used} used · {data.totals.total} total
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {loaded && data && (
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center animate-fade-up">
            <div className="relative flex-1">
              <Search
                size={13}
                strokeWidth={2.25}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search industries… (coffee, real estate, packaging)"
                className="w-full rounded-lg border border-border bg-bg-card pl-9 pr-9 py-2 text-[13px] text-ink placeholder:text-dim outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-dim transition hover:bg-bg-hover hover:text-ink"
                  aria-label="Clear"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={cycleSort}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-3 py-2 text-[12px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
            >
              <ArrowUpDown size={12} strokeWidth={2.25} />
              Sort: {sortLabel}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-coral/30 bg-coral-bg px-3.5 py-2.5 text-[13px] text-coral animate-fade-in">
            <AlertCircle size={14} strokeWidth={2.25} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loaded ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-card py-10 text-[13px] text-dim">
            <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
            Loading industries…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-hi bg-bg-card p-10 text-center animate-fade-up">
            <Search size={22} strokeWidth={2} className="mx-auto text-dim" />
            <p className="mt-3 text-[15px] font-medium text-ink">No matches.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-bg-card animate-fade-up">
            <table className="w-full text-[14px]">
              <thead className="border-b border-border bg-bg-raised text-left">
                <tr>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-label text-dim">
                    Industry
                  </th>
                  <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-label text-dim text-right w-20">
                    Remaining
                  </th>
                  <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-label text-dim text-right w-16 hidden sm:table-cell">
                    Used
                  </th>
                  <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-label text-dim text-right w-16 hidden sm:table-cell">
                    Total
                  </th>
                  <th className="px-4 sm:px-5 py-3 w-40 hidden md:table-cell" />
                  <th className="px-2 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((ind) => {
                  const isOpen = expanded === ind.key;
                  const soldOut = ind.remaining === 0;
                  return (
                    <>
                      <tr
                        key={ind.key}
                        onClick={() => setExpanded(isOpen ? null : ind.key)}
                        className="cursor-pointer transition hover:bg-bg-hover"
                      >
                        <td className="px-4 sm:px-5 py-3 font-medium text-ink">{ind.label}</td>
                        <td className="px-3 py-3 text-right">
                          <span
                            className={
                              "mono font-semibold " +
                              (soldOut ? "text-coral" : ind.remaining <= 3 ? "text-amber" : "text-mint")
                            }
                          >
                            {ind.remaining}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right mono text-muted hidden sm:table-cell">
                          {ind.used}
                        </td>
                        <td className="px-3 py-3 text-right mono text-dim hidden sm:table-cell">
                          {ind.total}
                        </td>
                        <td className="px-4 sm:px-5 py-3 hidden md:table-cell">
                          <Bar used={ind.used} total={ind.total} />
                        </td>
                        <td className="px-2 py-3 text-dim">
                          <ChevronDown
                            size={14}
                            strokeWidth={2.25}
                            className={"transition " + (isOpen ? "rotate-180" : "")}
                          />
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={ind.key + "-exp"} className="bg-bg-raised/40">
                          <td colSpan={6} className="px-4 sm:px-5 py-3">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                              {STYLES.map((s) => {
                                const c = ind.styles[s];
                                const out = c.remaining === 0;
                                return (
                                  <div
                                    key={s}
                                    className="rounded-lg border border-border bg-bg-card px-3 py-2"
                                  >
                                    <div className="text-[10px] font-semibold uppercase tracking-label text-dim">
                                      {s}
                                    </div>
                                    <div className="mt-0.5 flex items-baseline gap-1">
                                      <span
                                        className={
                                          "mono text-[15px] font-semibold " +
                                          (out ? "text-coral" : "text-ink")
                                        }
                                      >
                                        {c.remaining}
                                      </span>
                                      <span className="mono text-[11px] text-dim">/ {c.total}</span>
                                    </div>
                                    <div className="mt-1">
                                      <Bar used={c.used} total={c.total} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {loaded && data && rows.length > 0 && (
          <p className="mt-3 text-[12px] text-dim">
            Showing {rows.length} of {data.count} industries.
            <span className="ml-2">
              <span className="text-mint">●</span> plenty ·{" "}
              <span className="text-amber">●</span> ≤3 left ·{" "}
              <span className="text-coral">●</span> none left
            </span>
          </p>
        )}
      </main>
    </>
  );
}
