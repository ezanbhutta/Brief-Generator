"use client";

import { useState } from "react";
import type { Brief, Style } from "@/lib/generator";
import { briefToPlainText } from "@/lib/generator";

interface Props {
  brief: Brief;
  industry: string;
  style: Style;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-zinc-200 pt-6">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </h3>
      <div className="mt-3 text-zinc-800 leading-relaxed">{children}</div>
    </section>
  );
}

export default function BriefDisplay({ brief, industry, style }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyAll() {
    const text = briefToPlainText(brief, industry, style);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {style} · {industry}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
            {brief.brandName}
          </h2>
          <p className="mt-1 text-zinc-600 italic">{brief.tagline}</p>
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 hover:border-zinc-400 active:scale-[0.98]"
          aria-live="polite"
        >
          {copied ? "Copied" : "Copy full brief"}
        </button>
      </header>

      <div className="mt-8 space-y-6">
        <Section title="Why this name">
          <p>{brief.brandNameRationale}</p>
        </Section>

        <Section title="Industry Summary">
          <p>{brief.industrySummary}</p>
        </Section>

        <Section title="Competitive Landscape">
          <p>{brief.competitorLandscape}</p>
        </Section>

        <Section title="Brand Positioning">
          <p className="text-zinc-900 font-medium">{brief.positioningStatement}</p>
          <p className="mt-3 text-zinc-700">{brief.positioningRationale}</p>
        </Section>

        <Section title="Target Audience">
          <p className="text-zinc-900">{brief.targetAudience.primary}</p>
          {brief.targetAudience.behaviors.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Behaviors
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-zinc-400">
                {brief.targetAudience.behaviors.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          {brief.targetAudience.motivations.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Motivations
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-zinc-400">
                {brief.targetAudience.motivations.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section title="Brand Personality">
          <ul className="flex flex-wrap gap-2">
            {brief.brandPersonalityTraits.map((p) => (
              <li
                key={p}
                className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm text-zinc-800"
              >
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Voice & Tone">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Do
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-800">
                {brief.voiceAndTone.dos.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Don&apos;t
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-800">
                {brief.voiceAndTone.donts.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-rose-600">✗</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Messaging Pillars">
          <ul className="space-y-3">
            {brief.messagingPillars.map((p) => (
              <li key={p.name} className="rounded-xl border border-zinc-200 p-4">
                <p className="font-medium text-zinc-900">{p.name}</p>
                <p className="mt-1 text-zinc-700 text-sm">{p.description}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Logo Direction">
          <p>{brief.logoDirection}</p>
        </Section>

        <Section title="Color Palette">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {brief.colorPalette.map((c) => (
              <li
                key={c.hex + c.name}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 p-3"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-block h-12 w-12 shrink-0 rounded-md border border-zinc-200"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-zinc-900">{c.name}</span>
                    <span className="text-xs uppercase tracking-wider text-zinc-500">
                      {c.hex}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700">{c.meaning}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    <span className="font-medium text-zinc-600">Use:</span> {c.usage}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Typography Direction">
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-[max-content_1fr] sm:gap-x-6">
            <dt className="text-sm text-zinc-500">Primary</dt>
            <dd className="text-zinc-900">{brief.typography.primary}</dd>
            <dt className="text-sm text-zinc-500">Secondary</dt>
            <dd className="text-zinc-900">{brief.typography.secondary}</dd>
            <dt className="text-sm text-zinc-500">Rationale</dt>
            <dd className="text-zinc-800">{brief.typography.rationale}</dd>
          </dl>
        </Section>

        <Section title="Visual Identity Ideas">
          <ul className="list-disc space-y-1 pl-5 marker:text-zinc-400">
            {brief.visualIdentityIdeas.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Section>
      </div>
    </article>
  );
}
