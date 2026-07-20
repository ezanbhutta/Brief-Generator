"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Users, Sheet, Layers } from "lucide-react";
import Logo from "./Logo";

const ITEMS = [
  { href: "/", label: "Brief", icon: FileText },
  { href: "/industries", label: "Industries", icon: Layers },
  { href: "/roster", label: "Roster", icon: Users },
  { href: "/sheet", label: "Sheet", icon: Sheet },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet shadow-[0_4px_12px_-2px_rgba(114,41,255,0.45)]">
            <Logo size={20} color="#FFFFFF" />
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-ink">Brand Briefs</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dim">
              HaseebMadeIt
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition " +
                  (active
                    ? "bg-violet-bg text-violet-dim"
                    : "text-muted hover:bg-bg-hover hover:text-ink")
                }
              >
                <Icon size={14} strokeWidth={2.25} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
