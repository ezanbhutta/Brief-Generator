"use client";

import { useEffect, useState, FormEvent } from "react";
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

  useEffect(() => {
    setRoster(getRoster());
    setLoaded(true);
  }, []);

  function onAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addDesigner(trimmed);
    setRoster(getRoster());
    setName("");
  }

  function onRemove(id: string) {
    removeDesigner(id);
    setRoster(getRoster());
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-ink/55">
            <span className="text-violet">●</span> Roster
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink leading-tight">
            Designers on the team.
          </h1>
          <p className="mt-3 text-ink/70 max-w-xl">
            Add the designers you assign briefs to. The list shows up in the
            assign dialog when you mark a brief as &ldquo;I&apos;m using
            this&rdquo;.
          </p>
        </header>

        <form
          onSubmit={onAdd}
          className="flex flex-col sm:flex-row gap-2 mb-8"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Designer name"
            className="flex-1 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/20"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-lg bg-violet px-6 py-3 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(114,41,255,0.55)] transition hover:bg-violet-deep active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add designer
          </button>
        </form>

        {!loaded ? null : roster.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-paper/50 p-10 text-center">
            <p className="font-display text-xl italic text-ink/55">
              No designers yet.
            </p>
            <p className="mt-1 text-sm text-ink/50">
              Add one above to start assigning briefs.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-paper overflow-hidden">
            {roster.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-cream/40"
              >
                <span className="text-ink">{d.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(d.id)}
                  className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-medium text-ink/65 transition hover:border-rose-400 hover:text-rose-700 active:scale-[0.97]"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {loaded && roster.length > 0 && (
          <p className="mt-4 text-xs text-ink/50">
            {roster.length} designer{roster.length === 1 ? "" : "s"} on the
            roster.
          </p>
        )}
      </main>
    </>
  );
}
