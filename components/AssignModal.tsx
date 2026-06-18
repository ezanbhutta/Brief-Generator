"use client";

import { useEffect, useState } from "react";
import { X, UserPlus, AlertCircle, Loader2 } from "lucide-react";
import { addAssignment, getRoster, type Designer } from "@/lib/roster";

interface Props {
  brandName: string;
  industry: string;
  style: string;
  onClose: () => void;
  onAssigned?: (designerName: string) => void;
}

export default function AssignModal({
  brandName,
  industry,
  style,
  onClose,
  onAssigned,
}: Props) {
  const [roster, setRoster] = useState<Designer[]>([]);
  const [rosterLoading, setRosterLoading] = useState(true);
  const [designerId, setDesignerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getRoster();
        if (!cancelled) setRoster(list);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load roster.");
      } finally {
        if (!cancelled) setRosterLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleAssign() {
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
    setSaving(true);
    try {
      await addAssignment({
        brandName,
        industry,
        style,
        designerId: designer.id,
        designerName: designer.name,
        dueDate,
      });
      onAssigned?.(designer.name);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-bg-card p-6 shadow-[0_30px_80px_-20px_rgba(22,10,51,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-label text-dim">
              Assign brief
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink leading-tight break-words">
              {brandName}
            </h3>
            <p className="mt-0.5 text-[13px] text-muted">
              {style} · {industry}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-dim transition hover:bg-bg-hover hover:text-ink"
            aria-label="Close"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-5">
          <label className="block text-[10px] font-semibold uppercase tracking-label text-dim">
            Designer
          </label>
          {rosterLoading ? (
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-border bg-bg-raised px-3 py-2.5 text-[13px] text-muted">
              <Loader2 size={13} strokeWidth={2.5} className="animate-spin" />
              Loading roster…
            </div>
          ) : roster.length === 0 ? (
            <p className="mt-1.5 flex items-start gap-2 rounded-lg border border-amber/30 bg-amber-bg px-3 py-2.5 text-[13px] text-ink">
              <AlertCircle size={13} strokeWidth={2.25} className="mt-0.5 shrink-0 text-amber" />
              <span>
                No designers in the roster. Add one on the{" "}
                <a href="/roster" className="font-semibold text-violet-dim underline">
                  Roster page
                </a>
                .
              </span>
            </p>
          ) : (
            <select
              value={designerId}
              onChange={(e) => {
                setDesignerId(e.target.value);
                setError(null);
              }}
              className="mt-1.5 block w-full rounded-lg border border-border bg-bg-card px-3 py-2.5 text-[14px] text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15"
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
          <label className="block text-[10px] font-semibold uppercase tracking-label text-dim">
            Due date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              setError(null);
            }}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg-card px-3 py-2.5 text-[14px] text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15"
          />
        </div>

        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-lg border border-coral/30 bg-coral-bg px-3 py-2 text-[13px] text-coral">
            <AlertCircle size={13} strokeWidth={2.25} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-bg-card px-4 py-2.5 text-[13px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={roster.length === 0 || saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(114,41,255,0.55)] transition hover:bg-violet-dim disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={13} strokeWidth={2.5} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <UserPlus size={13} strokeWidth={2.5} />
                Add to sheet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
