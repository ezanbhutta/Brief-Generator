"use client";

import { useEffect, useState } from "react";
import { Sheet, Copy, Check, Trash2, AlertCircle, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
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

  const sorted = [...rows].sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return a.createdAt.localeCompare(b.createdAt);
  });

  async function handleCopy() {
    const text = copyAsTsv(sorted);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function onRemove(id: string) {
    try {
      await removeAssignment(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove.");
    }
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
        ) : sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-hi bg-bg-card p-10 text-center animate-fade-up">
            <Sheet size={22} strokeWidth={2} className="mx-auto text-dim" />
            <p className="mt-3 text-[15px] font-medium text-ink">No briefs assigned yet.</p>
            <p className="mt-1 text-[13px] text-muted">
              Generate a brief, click &ldquo;I&apos;m using this&rdquo;, and it&apos;ll show up here.
            </p>
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
                        onClick={() => onRemove(a.id)}
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
            {sorted.length} brief{sorted.length === 1 ? "" : "s"} on the sheet.
          </p>
        )}
      </main>
    </>
  );
}
