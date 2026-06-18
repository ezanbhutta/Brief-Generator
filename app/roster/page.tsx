"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import {
  Users,
  UserPlus,
  Trash2,
  Pencil,
  Check,
  X,
  AlertCircle,
  Loader2,
  Shield,
  type LucideIcon,
} from "lucide-react";
import Nav from "@/components/Nav";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import {
  getRoster,
  addDesigner,
  renameDesigner,
  removeDesigner,
  type Designer,
  type RosterRole,
} from "@/lib/roster";

interface RosterListProps {
  title: string;
  subtitle: string;
  role: RosterRole;
  accent: "violet" | "cyan" | "amber";
  icon: LucideIcon;
  placeholder: string;
}

const ACCENT: Record<RosterListProps["accent"], { bg: string; fg: string }> = {
  violet: { bg: "bg-violet-bg", fg: "text-violet" },
  cyan: { bg: "bg-cyan-bg", fg: "text-cyan" },
  amber: { bg: "bg-amber-bg", fg: "text-amber" },
};

function RosterList({ title, subtitle, role, accent, icon: Icon, placeholder }: RosterListProps) {
  const toast = useToast();
  const [items, setItems] = useState<Designer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<Designer | null>(null);
  const editRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    try {
      const list = await getRoster(role);
      setItems(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setAdding(true);
    setError(null);
    // Optimistic — show in list instantly
    const optimistic: Designer = { id: `__pending-${Date.now()}`, name: trimmed, role };
    setItems((prev) => [...prev, optimistic]);
    setName("");
    try {
      await addDesigner(trimmed, role);
      await refresh();
      toast.push(`${trimmed} added to ${title.toLowerCase()}.`);
    } catch (err) {
      // Roll back optimistic insert
      setItems((prev) => prev.filter((d) => d.id !== optimistic.id));
      const msg = err instanceof Error ? err.message : "Failed to add.";
      setError(msg);
      toast.push(msg, "error");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(d: Designer) {
    setEditingId(d.id);
    setEditName(d.name);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function saveEdit(id: string) {
    const trimmed = editName.trim();
    if (!trimmed) return;
    const original = items.find((d) => d.id === id);
    // Optimistic
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, name: trimmed } : d)));
    setEditingId(null);
    setEditName("");
    try {
      await renameDesigner(id, trimmed);
      toast.push("Saved.");
    } catch (err) {
      if (original) {
        setItems((prev) => prev.map((d) => (d.id === id ? original : d)));
      }
      const msg = err instanceof Error ? err.message : "Failed to rename.";
      setError(msg);
      toast.push(msg, "error");
    }
  }

  async function onRemove(d: Designer) {
    // Optimistic
    setItems((prev) => prev.filter((x) => x.id !== d.id));
    try {
      await removeDesigner(d.id);
      toast.push(`${d.name} removed.`);
    } catch (err) {
      // Roll back
      await refresh();
      const msg = err instanceof Error ? err.message : "Failed to remove.";
      setError(msg);
      toast.push(msg, "error");
    }
  }

  const a = ACCENT[accent];

  return (
    <>
      <section className="rounded-xl border border-border bg-bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${a.bg}`}>
              <Icon size={13} strokeWidth={2.5} className={a.fg} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[13px] font-semibold text-ink leading-tight">
                {title}{" "}
                <span className="mono font-normal text-dim">
                  · {loaded ? String(items.length).padStart(2, "0") : "…"}
                </span>
              </h2>
              <p className="text-[11px] text-dim truncate">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Add row */}
        <form onSubmit={onAdd} className="flex gap-2 border-b border-border bg-bg-raised px-4 py-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={placeholder}
            disabled={adding}
            className="flex-1 rounded-md border border-border bg-bg-card px-3 py-1.5 text-[13px] text-ink placeholder:text-dim outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!name.trim() || adding}
            className="inline-flex items-center gap-1 rounded-md bg-violet px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(114,41,255,0.45)] transition hover:bg-violet-dim disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <Loader2 size={12} strokeWidth={2.5} className="animate-spin" />
            ) : (
              <UserPlus size={12} strokeWidth={2.5} />
            )}
            Add
          </button>
        </form>

        {error && (
          <div className="flex items-start gap-2 border-b border-border bg-coral-bg px-4 py-2.5 text-[12px] text-coral">
            <AlertCircle size={12} strokeWidth={2.25} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        {!loaded ? (
          <div className="flex items-center justify-center gap-2 py-8 text-[12px] text-dim">
            <Loader2 size={12} strokeWidth={2.5} className="animate-spin" />
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-muted">Empty list.</p>
            <p className="text-[12px] text-dim mt-0.5">Add one above to get started.</p>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-bg-raised">
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-label text-dim w-10">
                  #
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-label text-dim">
                  Name
                </th>
                <th className="px-3 py-2 w-24" />
              </tr>
            </thead>
            <tbody>
              {items.map((d, i) => (
                <tr key={d.id} className="border-t border-border transition hover:bg-bg-hover">
                  <td className="px-4 py-2.5">
                    <span className="mono text-[12px] text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {editingId === d.id ? (
                      <input
                        ref={editRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(d.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        onBlur={() => saveEdit(d.id)}
                        className="block w-full rounded-md border border-violet bg-bg-card px-2.5 py-1 text-[13px] text-ink outline-none ring-2 ring-violet/15"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(d)}
                        className="text-left text-ink hover:text-violet-dim transition"
                        title="Click to edit"
                      >
                        {d.name}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === d.id ? (
                        <>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              saveEdit(d.id);
                            }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-mint-bg text-mint transition hover:opacity-80"
                            aria-label="Save"
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              cancelEdit();
                            }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-bg-raised text-dim transition hover:text-ink"
                            aria-label="Cancel"
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(d)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-dim transition hover:bg-violet-bg hover:text-violet"
                            aria-label={`Edit ${d.name}`}
                          >
                            <Pencil size={12} strokeWidth={2.25} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmRemove(d)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-dim transition hover:bg-coral-bg hover:text-coral"
                            aria-label={`Remove ${d.name}`}
                          >
                            <Trash2 size={12} strokeWidth={2.25} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {confirmRemove && (
        <ConfirmDialog
          title={`Remove ${confirmRemove.name}?`}
          message={`This will remove them from the ${title.toLowerCase()} list. Past assignments stay on the sheet.`}
          confirmLabel="Remove"
          destructive
          onCancel={() => setConfirmRemove(null)}
          onConfirm={() => {
            const d = confirmRemove;
            setConfirmRemove(null);
            onRemove(d);
          }}
        />
      )}
    </>
  );
}

export default function RosterPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10">
        {/* Hero */}
        <div className="mb-6 animate-fade-up">
          <div className="text-[10px] font-semibold uppercase tracking-label text-dim mb-1.5 flex items-center gap-1.5">
            <Users size={11} strokeWidth={2.5} />
            Roster
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">
            The team
          </h1>
          <p className="mt-1 text-sm text-muted">
            Designers do the work. Assigners hand it off. Click a name to rename.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 animate-fade-up">
          <RosterList
            title="Designers"
            subtitle="logo designers on the team"
            role="designer"
            accent="violet"
            icon={Users}
            placeholder="Add designer…"
          />
          <RosterList
            title="Assigners"
            subtitle="who's handing the brief over"
            role="assigner"
            accent="cyan"
            icon={Shield}
            placeholder="Add assigner…"
          />
        </div>
      </main>
    </>
  );
}
