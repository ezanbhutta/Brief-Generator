"use client";

import { useState } from "react";
import type { Brief, Style, SectionKey } from "@/lib/generator";
import { briefToPlainText, DEFAULT_SECTION_ORDER, DEFAULT_SECTION_TITLES } from "@/lib/generator";

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

function hasText(s?: string | null): s is string {
  return typeof s === "string" && s.trim().length > 0;
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

  const hasPositioning = hasText(brief.positioningStatement) || hasText(brief.positioningRationale);
  const audience = brief.targetAudience;
  const hasAudience =
    audience &&
    (hasText(audience.primary) ||
      (audience.behaviors && audience.behaviors.length > 0) ||
      (audience.motivations && audience.motivations.length > 0));
  const traits = brief.brandPersonalityTraits ?? [];
  const voice = brief.voiceAndTone;
  const hasVoice =
    voice && ((voice.dos && voice.dos.length > 0) || (voice.donts && voice.donts.length > 0));
  const pillars = brief.messagingPillars ?? [];
  const palette = brief.colorPalette ?? [];
  const visuals = brief.visualIdentityIdeas ?? [];
  const customs = brief.customSections ?? [];
  const typo = brief.typography;
  const hasTypo = typo && (hasText(typo.primary) || hasText(typo.secondary) || hasText(typo.rationale));

  const labelFor = (k: SectionKey): string =>
    brief.sectionLabels?.[k] ?? DEFAULT_SECTION_TITLES[k];

  const sectionHasData: Record<SectionKey, boolean> = {
    brandNameRationale: hasText(brief.brandNameRationale),
    story: hasText(brief.story),
    manifesto: hasText(brief.manifesto),
    industrySummary: hasText(brief.industrySummary),
    competitorLandscape: hasText(brief.competitorLandscape),
    positioning: hasPositioning,
    targetAudience: !!hasAudience,
    personality: traits.length > 0,
    voiceAndTone: !!hasVoice,
    messagingPillars: pillars.length > 0,
    logoDirection: hasText(brief.logoDirection),
    colorPalette: palette.length > 0,
    typography: !!hasTypo,
    visualIdentityIdeas: visuals.length > 0,
  };

  const orderedKeys: SectionKey[] = (brief.sectionOrder ?? DEFAULT_SECTION_ORDER).filter(
    (k) => sectionHasData[k],
  );

  function renderSection(key: SectionKey): React.ReactNode {
    const title = labelFor(key);
    switch (key) {
      case "brandNameRationale":
        return (
          <Section key={key} title={title}>
            <p>{brief.brandNameRationale}</p>
          </Section>
        );
      case "story":
        return (
          <Section key={key} title={title}>
            <p className="whitespace-pre-line">{brief.story}</p>
          </Section>
        );
      case "manifesto":
        return (
          <Section key={key} title={title}>
            <p className="whitespace-pre-line text-lg leading-relaxed">{brief.manifesto}</p>
          </Section>
        );
      case "industrySummary":
        return (
          <Section key={key} title={title}>
            <p>{brief.industrySummary}</p>
          </Section>
        );
      case "competitorLandscape":
        return (
          <Section key={key} title={title}>
            <p>{brief.competitorLandscape}</p>
          </Section>
        );
      case "positioning":
        return (
          <Section key={key} title={title}>
            {hasText(brief.positioningStatement) && (
              <p className="text-zinc-900 font-medium">{brief.positioningStatement}</p>
            )}
            {hasText(brief.positioningRationale) && (
              <p className="mt-3 text-zinc-700">{brief.positioningRationale}</p>
            )}
          </Section>
        );
      case "targetAudience":
        if (!audience) return null;
        return (
          <Section key={key} title={title}>
            {hasText(audience.primary) && <p className="text-zinc-900">{audience.primary}</p>}
            {audience.behaviors && audience.behaviors.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Behaviors
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-zinc-400">
                  {audience.behaviors.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {audience.motivations && audience.motivations.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Motivations
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-zinc-400">
                  {audience.motivations.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        );
      case "personality":
        return (
          <Section key={key} title={title}>
            <ul className="flex flex-wrap gap-2">
              {traits.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-sm text-zinc-800"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Section>
        );
      case "voiceAndTone":
        if (!voice) return null;
        return (
          <Section key={key} title={title}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {voice.dos && voice.dos.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Do
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-zinc-800">
                    {voice.dos.map((d) => (
                      <li key={d} className="flex gap-2">
                        <span className="text-emerald-600">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {voice.donts && voice.donts.length > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                    Don&apos;t
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-zinc-800">
                    {voice.donts.map((d) => (
                      <li key={d} className="flex gap-2">
                        <span className="text-rose-600">✗</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        );
      case "messagingPillars":
        return (
          <Section key={key} title={title}>
            <ul className="space-y-3">
              {pillars.map((p) => (
                <li key={p.name} className="rounded-xl border border-zinc-200 p-4">
                  <p className="font-medium text-zinc-900">{p.name}</p>
                  <p className="mt-1 text-zinc-700 text-sm">{p.description}</p>
                </li>
              ))}
            </ul>
          </Section>
        );
      case "logoDirection":
        return (
          <Section key={key} title={title}>
            <p className="whitespace-pre-line">{brief.logoDirection}</p>
          </Section>
        );
      case "colorPalette":
        return (
          <Section key={key} title={title}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {palette.map((c) => (
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
                    {hasText(c.meaning) && (
                      <p className="text-sm text-zinc-700">{c.meaning}</p>
                    )}
                    {hasText(c.usage) && (
                      <p className="mt-1 text-xs text-zinc-500">
                        <span className="font-medium text-zinc-600">Use:</span> {c.usage}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        );
      case "typography":
        if (!typo) return null;
        return (
          <Section key={key} title={title}>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-[max-content_1fr] sm:gap-x-6">
              {hasText(typo.primary) && (
                <>
                  <dt className="text-sm text-zinc-500">Primary</dt>
                  <dd className="text-zinc-900">{typo.primary}</dd>
                </>
              )}
              {hasText(typo.secondary) && (
                <>
                  <dt className="text-sm text-zinc-500">Secondary</dt>
                  <dd className="text-zinc-900">{typo.secondary}</dd>
                </>
              )}
              {hasText(typo.rationale) && (
                <>
                  <dt className="text-sm text-zinc-500">Rationale</dt>
                  <dd className="text-zinc-800">{typo.rationale}</dd>
                </>
              )}
            </dl>
          </Section>
        );
      case "visualIdentityIdeas":
        return (
          <Section key={key} title={title}>
            <ul className="list-disc space-y-1 pl-5 marker:text-zinc-400">
              {visuals.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Section>
        );
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
          {hasText(brief.tagline) && (
            <p className="mt-1 text-zinc-600 italic">{brief.tagline}</p>
          )}
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
        {orderedKeys.map((key) => renderSection(key))}

        {customs.map((s) => (
          <Section key={s.title} title={s.title}>
            <p className="whitespace-pre-line">{s.body}</p>
          </Section>
        ))}
      </div>
    </article>
  );
}
