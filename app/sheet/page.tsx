"use client";

import { useEffect, useMemo, useState } from "react";
import { Sheet, Copy, Check, Trash2, AlertCircle, Loader2, Search, X } from "lucide-react";
import Nav from "@/components/Nav";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import {
  getAssignments,
  removeAssignment,
  type Assignment,
} from "@/lib/roster";

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function copyAsTsv(rows: Assignment[]): string {
  const header = ["Due Date", "Project Name", "Designer", "Assigner", "Industry", "Style"];
  const lines = [header.join("\t")];
  for (const a of rows) {
    lines.push(
      [a.dueDate, a.brandName, a.designerName, a.assignerName, a.industry, a.style].join("\t"),
    );
  }
  return lines.join("\n");
}

export default function SheetPage() {
  const [rows, setRows] = useState<Assignment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Assignment | null>(null);
  const [query, setQuery] = useState("");
  const [designerFilter, setDesignerFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const toast = useToast();

  async function refresh() {
    try {
      const list = await getAssignments();
      setRows(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sheet.");
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const designers = useMemo(
    () => Array.from(new Set(rows.map((r) => r.designerName).filter(Boolean))).sort(),
    [rows],
  );
  const styles = useMemo(
    () => Array.from(new Set(rows.map((r) => r.style).filter(Boolean))).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (designerFilter && r.designerName !== designerFilter) return false;
      if (styleFilter && r.style !== styleFilter) return false;
      if (!q) return true;
      const hay = [r.brandName, r.designerName, r.assignerName, r.industry, r.style]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, designerFilter, styleFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
  }, [filtered]);

  const hasActiveFilter = Boolean(query || designerFilter || styleFilter);

  async function handleCopy() {
    const text = copyAsTsv(sorted);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.push("Sheet copied as TSV.");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.push("Copy failed.", "error");
    }
  }

  async function onRemove(a: Assignment) {
    setRows((prev) => prev.filter((x) => x.id !== a.id));
    try {
      await removeAssignment(a.id);
      toast.push(`${a.brandName} removed from sheet.`);
    } catch (err) {
      await refresh();
      const msg = err instanceof Error ? err.message : "Failed to remove.";
      setError(msg);
      toast.push(msg, "error");
    }
  }

  function clearFilters() {
    setQuery("");
    setDesignerFilter("");
    setStyleFilter("");
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-label text-dim mb-1.5 flex items-center gap-1.5">
              <Sheet size={11} strokeWidth={2.5} />
              Sheet
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">
              Briefs in progress
            </h1>
            <p className="mt-1 text-sm text-muted">
              Every brief you mark &ldquo;I&apos;m using this&rdquo; lands here with its due date and designer.
            </p>
          </div>
          {sorted.length > 0 && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-4 py-2.5 text-[13px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
            >
              {copied ? (
                <>
                  <Check size={13} strokeWidth={2.5} />
                  Copied as TSV
                </>
              ) : (
                <>
                  <Copy size={13} strokeWidth={2.25} />
                  Copy for spreadsheet
                </>
              )}
            </button>
          )}
        </div>

        {/* Search + filters */}
        {loaded && rows.length > 0 && (
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
                placeholder="Search brand, designer, assigner, industry…"
                className="w-full rounded-lg border border-border bg-bg-card pl-9 pr-9 py-2 text-[13px] text-ink placeholder:text-dim outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md text-dim transition hover:bg-bg-hover hover:text-ink"
                  aria-label="Clear search"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
            <select
              value={designerFilter}
              onChange={(e) => setDesignerFilter(e.target.value)}
              className="rounded-lg border border-border bg-bg-card px-3 py-2 text-[13px] text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15"
            >
              <option value="">All designers</option>
              {designers.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="rounded-lg border border-border bg-bg-card px-3 py-2 text-[13px] text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15"
            >
              <option value="">All styles</option>
              {styles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-[12px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
              >
                <X size={12} strokeWidth={2.5} />
                Clear
              </button>
            )}
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
            Loading sheet…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-hi bg-bg-card p-10 text-center animate-fade-up">
            <Sheet size={22} strokeWidth={2} className="mx-auto text-dim" />
            <p className="mt-3 text-[15px] font-medium text-ink">No briefs assigned yet.</p>
            <p className="mt-1 text-[13px] text-muted">
              Generate a brief, click &ldquo;I&apos;m using this&rdquo;, and it&apos;ll show up here.
            </p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-hi bg-bg-card p-10 text-center animate-fade-up">
            <Search size={22} strokeWidth={2} className="mx-auto text-dim" />
            <p className="mt-3 text-[15px] font-medium text-ink">No matches.</p>
            <p className="mt-1 text-[13px] text-muted">Try clearing the filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-bg-card animate-fade-up">
            <table className="w-full text-[14px]">
              <thead className="border-b border-border bg-bg-raised text-left">
                <tr>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-label text-dim">
                    Due date
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-label text-dim">
                    Project name
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-label text-dim">
                    Designer
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-label text-dim hidden md:table-cell">
                    Assigner
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-label text-dim hidden sm:table-cell">
                    Style · Industry
                  </th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((a) => (
                  <tr key={a.id} className="transition hover:bg-bg-hover">
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap">
                      <span className="mono text-[13px] text-ink">{formatDate(a.dueDate)}</span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 font-medium text-ink">{a.brandName}</td>
                    <td className="px-4 sm:px-5 py-3 text-muted">{a.designerName}</td>
                    <td className="px-4 sm:px-5 py-3 text-muted hidden md:table-cell">
                      {a.assignerName || <span className="text-dim">—</span>}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-dim hidden sm:table-cell">
                      {a.style} · {a.industry}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(a)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-dim transition hover:bg-coral-bg hover:text-coral"
                        aria-label={`Remove ${a.brandName}`}
                      >
                        <Trash2 size={13} strokeWidth={2.25} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {loaded && sorted.length > 0 && (
          <p className="mt-3 text-[12px] text-dim">
            {sorted.length} of {rows.length} brief{rows.length === 1 ? "" : "s"}
            {hasActiveFilter ? " match the filters." : " on the sheet."}
          </p>
        )}
      </main>

      {confirmRemove && (
        <ConfirmDialog
          title={`Remove ${confirmRemove.brandName}?`}
          message="This removes the row from the sheet. The brief stays in the catalog."
          confirmLabel="Remove"
          destructive
          onCancel={() => setConfirmRemove(null)}
          onConfirm={() => {
            const a = confirmRemove;
            setConfirmRemove(null);
            onRemove(a);
          }}
        />
      )}
    </>
  );
}
