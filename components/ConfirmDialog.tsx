"use client";

import { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, onConfirm]);

  const confirmClass = destructive
    ? "bg-coral text-white shadow-[0_6px_18px_-6px_rgba(239,68,68,0.55)] hover:opacity-90"
    : "bg-violet text-white shadow-[0_6px_18px_-6px_rgba(114,41,255,0.55)] hover:bg-violet-dim";

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-bg-card p-5 shadow-[0_30px_80px_-20px_rgba(22,10,51,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              destructive ? "bg-coral-bg" : "bg-violet-bg"
            }`}
          >
            <AlertCircle
              size={16}
              strokeWidth={2.5}
              className={destructive ? "text-coral" : "text-violet"}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-ink leading-tight">{title}</h3>
            <p className="mt-1 text-[13px] text-muted">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="-mr-1 -mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-dim transition hover:bg-bg-hover hover:text-ink"
            aria-label="Close"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border bg-bg-card px-3.5 py-2 text-[13px] font-medium text-muted transition hover:border-border-hi hover:text-ink"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold transition ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
