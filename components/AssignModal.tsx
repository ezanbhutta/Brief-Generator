"use client";

import { useEffect, useState } from "react";
import { addAssignment, getRoster, type Designer } from "@/lib/roster";

interface Props {
  brandName: string;
  industry: string;
  style: string;
  onClose: () => void;
  onAssigned?: () => void;
}

export default function AssignModal({
  brandName,
  industry,
  style,
  onClose,
  onAssigned,
}: Props) {
  const [roster, setRoster] = useState<Designer[]>([]);
  const [designerId, setDesignerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRoster(getRoster());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleAssign() {
    if (!designerId) {
      setError("Pick a designer.");
      return;
    }
    if (!dueDate) {
      setError("Pick a due date.");
      return;
    }
    const designer = roster.find((d) => d.id === designerId);
    if (!designer) {
      setError("Designer not found. Refresh and try again.");
      return;
    }
    addAssignment({
      brandName,
      industry,
      style,
      designerId: designer.id,
      designerName: designer.name,
      dueDate,
    });
    onAssigned?.();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-6 shadow-[0_30px_80px_-40px_rgba(22,10,51,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
          Assign to designer
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink leading-tight">{brandName}</h3>
        <p className="mt-1 text-sm text-ink/60">
          {style} · {industry}
        </p>

        <div className="mt-5">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Designer
          </label>
          {roster.length === 0 ? (
            <p className="mt-2 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              No designers in the roster yet. Add one on the{" "}
              <a href="/roster" className="font-semibold underline">
                Roster page
              </a>
              .
            </p>
          ) : (
            <select
              value={designerId}
              onChange={(e) => {
                setDesignerId(e.target.value);
                setError(null);
              }}
              className="mt-1.5 block w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/20"
            >
              <option value="">Pick a designer…</option>
              {roster.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Due date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              setError(null);
            }}
            className="mt-1.5 block w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/20"
          />
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-rose-300/60 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink/15 bg-paper px-5 py-2.5 text-sm font-medium text-ink/80 transition hover:border-ink/40 active:scale-[0.97]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={roster.length === 0}
            className="rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(114,41,255,0.55)] transition hover:bg-violet-deep active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to sheet
          </button>
        </div>
      </div>
    </div>
  );
}
