"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import {
  getAssignments,
  removeAssignment,
  type Assignment,
} from "@/lib/roster";

function formatDate(iso: string): string {
  if (!iso) return "";
  // iso is YYYY-MM-DD; render in a friendlier form without timezone games.
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
  const header = ["Due Date", "Project Name", "Designer Name", "Industry", "Style"];
  const lines = [header.join("\t")];
  for (const a of rows) {
    lines.push(
      [
        a.dueDate,
        a.brandName,
        a.designerName,
        a.industry,
        a.style,
      ].join("\t"),
    );
  }
  return lines.join("\n");
}

export default function SheetPage() {
  const [rows, setRows] = useState<Assignment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRows(getAssignments());
    setLoaded(true);
  }, []);

  // Sort by due date ascending so the next deadline is at the top.
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
      // ignore
    }
  }

  function onRemove(id: string) {
    removeAssignment(id);
    setRows(getAssignments());
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-ink/55">
              <span className="text-violet">●</span> Sheet
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink leading-tight">
              Briefs in progress.
            </h1>
            <p className="mt-3 text-ink/70 max-w-xl">
              Every brief marked &ldquo;I&apos;m using this&rdquo; lands here
              with its due date and assigned designer.
            </p>
          </div>
          {sorted.length > 0 && (
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-ink/15 bg-paper px-5 py-2.5 text-sm font-medium text-ink/80 transition hover:border-violet hover:text-violet-deep active:scale-[0.97]"
            >
              {copied ? "✓ Copied as TSV" : "Copy for spreadsheet"}
            </button>
          )}
        </header>

        {!loaded ? null : sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-paper/50 p-10 text-center">
            <p className="font-display text-xl italic text-ink/55">
              No briefs assigned yet.
            </p>
            <p className="mt-1 text-sm text-ink/50">
              Generate a brief, click &ldquo;I&apos;m using this&rdquo;, and
              it&apos;ll show up here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-paper">
            <table className="w-full text-sm">
              <thead className="border-b border-ink/10 bg-cream/40 text-left">
                <tr>
                  <th className="px-4 sm:px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    Due date
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    Project name
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    Designer
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55 hidden sm:table-cell">
                    Style · Industry
                  </th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {sorted.map((a) => (
                  <tr key={a.id} className="hover:bg-cream/30">
                    <td className="px-4 sm:px-5 py-3 text-ink whitespace-nowrap">
                      {formatDate(a.dueDate)}
                    </td>
                    <td className="px-4 sm:px-5 py-3 font-medium text-ink">
                      {a.brandName}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-ink/85">
                      {a.designerName}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-ink/60 hidden sm:table-cell">
                      {a.style} · {a.industry}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() => onRemove(a.id)}
                        className="rounded-full border border-ink/15 bg-paper px-2.5 py-1 text-xs font-medium text-ink/55 transition hover:border-rose-400 hover:text-rose-700 active:scale-[0.97]"
                        aria-label={`Remove ${a.brandName}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {loaded && sorted.length > 0 && (
          <p className="mt-4 text-xs text-ink/50">
            {sorted.length} brief{sorted.length === 1 ? "" : "s"} on the sheet.
          </p>
        )}
      </main>
    </>
  );
}
