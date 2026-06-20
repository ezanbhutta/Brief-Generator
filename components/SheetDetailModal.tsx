"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, AlertCircle, Loader2, Calendar, User, Shield } from "lucide-react";
import type { Brief, Style } from "@/lib/generator";
import { briefToPlainText } from "@/lib/generator";
import type { Assignment } from "@/lib/roster";
import { useToast } from "./Toast";
import { ParagraphFormat, resolveSections, TEMPLATES } from "./BriefFormats";

interface Props {
  assignment: Assignment;
  onClose: () => void;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SheetDetailModal({ assignment, onClose }: Props) {
  const toast = useToast();
  const [brief, setBrief] = useState<(Brief & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!assignment.briefId) {
        if (!cancelled) {
          setError("This row was added before briefs were tracked. Open it from the generator.");
          setLoading(false);
        }
        return;
      }
      try {
        const res = await fetch(`/api/brief/${encodeURIComponent(assignment.briefId)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? `Failed (${res.status}).`);
        if (!cancelled) setBrief(data.brief);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load brief.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [assignment.briefId]);

  async function copyAll() {
    if (!brief) return;
    const text = briefToPlainText(brief, assignment.industry, assignment.style as Style);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast.push("Brief copied to clipboard.");
    setTimeout(() => setCopied(false), 1800);
  }

  // Always render the brief in the "Full Brief" template inside the modal so
  // the user gets the complete document, not a slim variant.
  const fullTemplate = TEMPLATES.find((t) => t.id === "fullBrief") ?? TEMPLATES[0];
  const ordered = brief ? resolveSections(brief, fullTemplate) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 backdrop-blur-sm px-4 py-8 sm:py-12 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-border bg-bg-card shadow-[0_30px_80px_-20px_rgba(22,10,51,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-border bg-bg-raised px-6 py-3.5 flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-label text-dim">
            Sheet entry
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-dim transition hover:bg-bg-hover hover:text-ink"
            aria-label="Close"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Title + metadata */}
        <div className="px-6 pt-6 pb-5 border-b border-border">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight break-words">
            {assignment.brandName}
          </h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {assignment.style} · {assignment.industry}
          </p>

          <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <Calendar size={13} strokeWidth={2.25} className="mt-0.5 shrink-0 text-violet" />
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-label text-dim">
                  Due date
                </dt>
                <dd className="mono text-[13px] text-ink">{formatDate(assignment.dueDate)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User size={13} strokeWidth={2.25} className="mt-0.5 shrink-0 text-violet" />
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-label text-dim">
                  Designer
                </dt>
                <dd className="text-[13px] text-ink truncate">{assignment.designerName}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield size={13} strokeWidth={2.25} className="mt-0.5 shrink-0 text-cyan" />
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-label text-dim">
                  Assigner
                </dt>
                <dd className="text-[13px] text-ink truncate">
                  {assignment.assignerName || "—"}
                </dd>
              </div>
            </div>
          </dl>

          {brief && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={copyAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-3.5 py-2 text-[12px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
              >
                {copied ? (
                  <>
                    <Check size={12} strokeWidth={2.5} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} strokeWidth={2.25} />
                    Copy brief
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Brief body */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-dim">
            <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
            Loading brief…
          </div>
        ) : error ? (
          <div className="m-6 flex items-start gap-2 rounded-lg border border-amber/30 bg-amber-bg px-3.5 py-2.5 text-[13px] text-ink">
            <AlertCircle size={14} strokeWidth={2.25} className="mt-0.5 shrink-0 text-amber" />
            <span>{error}</span>
          </div>
        ) : brief ? (
          <ParagraphFormat brief={brief} ordered={ordered} />
        ) : null}
      </div>
    </div>
  );
}
