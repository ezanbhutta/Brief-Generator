"use client";

import { useEffect, useState, FormEvent } from "react";
import { Users, UserPlus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import {
  getRoster,
  addDesigner,
  removeDesigner,
  type Designer,
} from "@/lib/roster";

export default function RosterPage() {
  const [roster, setRoster] = useState<Designer[]>([]);
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function refresh() {
    try {
      const list = await getRoster();
      setRoster(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roster.");
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setAdding(true);
    setError(null);
    try {
      await addDesigner(trimmed);
      setName("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add designer.");
    } finally {
      setAdding(false);
    }
  }

  async function onRemove(id: string) {
    try {
      await removeDesigner(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove designer.");
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-12">
        <div className="mb-6 animate-fade-up">
          <div className="text-[10px] font-semibold uppercase tracking-label text-dim mb-1.5 flex items-center gap-1.5">
            <Users size={11} strokeWidth={2.5} />
            Roster
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">
            Designers on the team
          </h1>
          <p className="mt-1 text-sm text-muted">
            Pick from this list when assigning a brief. Add or remove as the team changes.
          </p>
        </div>

        <form
          onSubmit={onAdd}
          className="flex flex-col sm:flex-row gap-2 mb-6 animate-fade-up"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Designer name"
            disabled={adding}
            className="flex-1 rounded-lg border border-border bg-bg-card px-3.5 py-2.5 text-[15px] text-ink placeholder:text-dim outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!name.trim() || adding}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(114,41,255,0.55)] transition hover:bg-violet-dim disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <>
                <Loader2 size={13} strokeWidth={2.5} className="animate-spin" />
                Adding…
              </>
            ) : (
              <>
                <UserPlus size={13} strokeWidth={2.5} />
                Add designer
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-coral/30 bg-coral-bg px-3.5 py-2.5 text-[13px] text-coral animate-fade-in">
            <AlertCircle size={14} strokeWidth={2.25} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loaded ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-card py-10 text-[13px] text-dim">
            <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
            Loading roster…
          </div>
        ) : roster.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-hi bg-bg-card p-10 text-center animate-fade-up">
            <Users size={22} strokeWidth={2} className="mx-auto text-dim" />
            <p className="mt-3 text-[15px] font-medium text-ink">No designers yet.</p>
            <p className="mt-1 text-[13px] text-muted">
              Add one above to start assigning briefs.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-bg-card overflow-hidden animate-fade-up">
            {roster.map((d, i) => (
              <li
                key={d.id}
                className="flex items-center justify-between px-4 sm:px-5 py-3 transition hover:bg-bg-hover"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="mono inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-raised text-[11px] font-semibold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] text-ink truncate">{d.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(d.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-card px-2.5 py-1 text-[12px] font-medium text-muted transition hover:border-coral/40 hover:bg-coral-bg hover:text-coral"
                  aria-label={`Remove ${d.name}`}
                >
                  <Trash2 size={12} strokeWidth={2.25} />
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {loaded && roster.length > 0 && (
          <p className="mt-3 text-[12px] text-dim">
            {roster.length} designer{roster.length === 1 ? "" : "s"} on the roster.
          </p>
        )}
      </main>
    </>
  );
}
