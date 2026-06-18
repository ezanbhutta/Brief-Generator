"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Check, AlertCircle, X, Info } from "lucide-react";

type ToastKind = "success" | "error" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastCtx {
  push: (message: string, kind?: ToastKind) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, kind: ToastKind = "success") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const styles = {
    success: { Icon: Check, bg: "bg-bg-card", border: "border-mint/40", fg: "text-mint" },
    error: { Icon: AlertCircle, bg: "bg-bg-card", border: "border-coral/40", fg: "text-coral" },
    info: { Icon: Info, bg: "bg-bg-card", border: "border-violet/40", fg: "text-violet" },
  } as const;
  const { Icon, bg, border, fg } = styles[toast.kind];

  return (
    <div
      className={[
        "pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border px-3.5 py-2.5 shadow-[0_10px_30px_-12px_rgba(22,10,51,0.35)] transition-all",
        bg,
        border,
        mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      ].join(" ")}
    >
      <Icon size={14} strokeWidth={2.5} className={`mt-0.5 shrink-0 ${fg}`} />
      <span className="flex-1 text-[13px] text-ink">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="-mr-1 -mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-dim transition hover:bg-bg-hover hover:text-ink"
        aria-label="Dismiss"
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}
