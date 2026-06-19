"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, UserPlus, FileText } from "lucide-react";
import type { Brief, Style } from "@/lib/generator";
import { briefToPlainText } from "@/lib/generator";
import AssignModal from "./AssignModal";
import { useToast } from "./Toast";
import {
  CardsFormat,
  EditorialFormat,
  ParagraphFormat,
  FORMAT_LABELS,
  type FormatId,
} from "./BriefFormats";

const LAST_FORMAT_KEY = "bbg.lastFormat";
const ALL_FORMATS: FormatId[] = ["paragraph", "cards", "editorial"];

function pickFreshFormat(): FormatId {
  if (typeof window === "undefined") return "paragraph";
  let last: FormatId | null = null;
  try {
    const raw = window.localStorage.getItem(LAST_FORMAT_KEY);
    if (raw && ALL_FORMATS.includes(raw as FormatId)) last = raw as FormatId;
  } catch {
    /* ignore */
  }
  const candidates = last ? ALL_FORMATS.filter((f) => f !== last) : ALL_FORMATS;
  const next = candidates[Math.floor(Math.random() * candidates.length)];
  try {
    window.localStorage.setItem(LAST_FORMAT_KEY, next);
  } catch {
    /* ignore */
  }
  return next;
}

interface Props {
  brief: Brief & { id: string };
  industry: string;
  style: Style;
}

function hasText(s?: string | null): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export default function BriefDisplay({ brief, industry, style }: Props) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);

  const [format, setFormat] = useState<FormatId>(() => pickFreshFormat());
  const didMount = useRef(false);
  useEffect(() => {
    // Skip the first run — useState already picked. Re-pick on every new brief.id.
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    setFormat(pickFreshFormat());
  }, [brief.id]);

  async function copyAll() {
    const text = briefToPlainText(brief, industry, style);
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
    toast.push("Full brief copied to clipboard.");
    setTimeout(() => setCopied(false), 1800);
  }

  const Body =
    format === "cards" ? CardsFormat : format === "editorial" ? EditorialFormat : ParagraphFormat;

  return (
    <>
      <article className="overflow-hidden rounded-xl border border-border bg-bg-card">
        {/* Header strip */}
        <div className="border-b border-border bg-bg-raised px-6 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-label text-dim">
            <FileText size={11} strokeWidth={2.5} />
            The Brief
          </div>
          <div className="mono text-[11px] uppercase tracking-[0.12em] text-muted flex items-center gap-3">
            <span className="rounded border border-violet/20 bg-violet-bg px-1.5 py-0.5 text-[9px] font-semibold tracking-label text-violet-dim">
              {FORMAT_LABELS[format]}
            </span>
            <span>{style} · {industry}</span>
          </div>
        </div>

        {/* Title block */}
        <header className="px-6 sm:px-8 pt-7 pb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight break-words">
              {brief.brandName}
            </h2>
            {hasText(brief.tagline) && (
              <p className="mt-1.5 text-base sm:text-lg text-muted italic">{brief.tagline}</p>
            )}
            {assignedTo && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-mint/30 bg-mint-bg px-2.5 py-1 text-[12px] font-medium text-mint">
                <Check size={12} strokeWidth={2.5} />
                On sheet — {assignedTo}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAssign(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(114,41,255,0.55)] transition hover:bg-violet-dim"
            >
              <UserPlus size={13} strokeWidth={2.5} />
              I&apos;m using this
            </button>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-4 py-2.5 text-[13px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
            >
              {copied ? (
                <>
                  <Check size={13} strokeWidth={2.5} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={13} strokeWidth={2.25} />
                  Copy brief
                </>
              )}
            </button>
          </div>
        </header>

        {/* Body — format-dependent */}
        <Body brief={brief} />
      </article>

      {showAssign && (
        <AssignModal
          briefId={brief.id}
          brandName={brief.brandName}
          industry={industry}
          style={style}
          onClose={() => setShowAssign(false)}
          onAssigned={(name) => {
            setAssignedTo(name);
            toast.push(`Assigned to ${name}.`);
          }}
        />
      )}
    </>
  );
}
