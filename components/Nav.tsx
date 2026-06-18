"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const ITEMS = [
  { href: "/", label: "Brief" },
  { href: "/roster", label: "Roster" },
  { href: "/sheet", label: "Sheet" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-ink/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 text-[11px] uppercase tracking-[0.22em] text-ink/60">
        <Link href="/" className="flex items-center gap-2.5 hover:text-ink transition">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet">
            <Logo size={20} color="#FFFFFF" />
          </span>
          <span>Brand Briefs Co.</span>
        </Link>
        <nav className="flex items-center gap-1">
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-full px-3 py-1.5 transition " +
                  (active
                    ? "bg-ink text-cream"
                    : "text-ink/65 hover:text-ink hover:bg-ink/5")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
