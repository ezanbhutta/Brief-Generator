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
    <section className="border-t border-ink/10 pt-7">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/55">
        {title}
      </h3>
      <div className="mt-3 text-ink/85 leading-relaxed">{children}</div>
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
              <p className="text-ink font-medium">{brief.positioningStatement}</p>
            )}
            {hasText(brief.positioningRationale) && (
              <p className="mt-3 text-ink/70">{brief.positioningRationale}</p>
            )}
          </Section>
        );
      case "targetAudience":
        if (!audience) return null;
        return (
          <Section key={key} title={title}>
            {hasText(audience.primary) && <p className="text-ink">{audience.primary}</p>}
            {audience.behaviors && audience.behaviors.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/55">
                  Behaviors
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-ink/40">
                  {audience.behaviors.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {audience.motivations && audience.motivations.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/55">
                  Motivations
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-ink/40">
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
                  className="rounded-full border border-ink/15 bg-cream px-3 py-1 text-sm text-ink/85"
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
                  <ul className="mt-2 space-y-1.5 text-sm text-ink/85">
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
                  <ul className="mt-2 space-y-1.5 text-sm text-ink/85">
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
                <li key={p.name} className="rounded-xl border border-ink/10 p-4">
                  <p className="font-medium text-ink">{p.name}</p>
                  <p className="mt-1 text-ink/70 text-sm">{p.description}</p>
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
                  className="flex items-start gap-3 rounded-xl border border-ink/10 p-3"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 inline-block h-12 w-12 shrink-0 rounded-md border border-ink/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-ink">{c.name}</span>
                      <span className="text-xs uppercase tracking-wider text-ink/55">
                        {c.hex}
                      </span>
                    </div>
                    {hasText(c.meaning) && (
                      <p className="text-sm text-ink/70">{c.meaning}</p>
                    )}
                    {hasText(c.usage) && (
                      <p className="mt-1 text-xs text-ink/55">
                        <span className="font-medium text-ink/60">Use:</span> {c.usage}
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
                  <dt className="text-sm text-ink/55">Primary</dt>
                  <dd className="text-ink">{typo.primary}</dd>
                </>
              )}
              {hasText(typo.secondary) && (
                <>
                  <dt className="text-sm text-ink/55">Secondary</dt>
                  <dd className="text-ink">{typo.secondary}</dd>
                </>
              )}
              {hasText(typo.rationale) && (
                <>
                  <dt className="text-sm text-ink/55">Rationale</dt>
                  <dd className="text-ink/85">{typo.rationale}</dd>
                </>
              )}
            </dl>
          </Section>
        );
      case "visualIdentityIdeas":
        return (
          <Section key={key} title={title}>
            <ul className="list-disc space-y-1 pl-5 marker:text-ink/40">
              {visuals.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Section>
        );
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-[0_30px_80px_-40px_rgba(22,10,51,0.25)]">
      {/* Magazine cover-strip header */}
      <div className="border-b border-ink/10 bg-ink text-cream px-6 sm:px-10 py-4 flex items-center justify-between text-[11px] uppercase tracking-[0.24em]">
        <div className="flex items-center gap-3">
          <span className="text-lavender">✦</span>
          <span>The Brief</span>
        </div>
        <div className="text-cream/70">
          {style} · {industry}
        </div>
      </div>

      <header className="px-6 sm:px-10 pt-10 pb-2 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink/45">
            Brand name
          </p>
          <h2 className="mt-2 font-display text-5xl sm:text-7xl text-ink break-words">
            {brief.brandName}
          </h2>
          {hasText(brief.tagline) && (
            <p className="mt-3 font-display text-2xl sm:text-3xl italic text-ink/65">
              {brief.tagline}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/15 bg-cream px-5 py-2.5 text-sm font-medium text-ink/80 transition hover:border-violet hover:text-violet-deep active:scale-[0.97]"
          aria-live="polite"
        >
          {copied ? "✓ Copied" : "Copy full brief"}
        </button>
      </header>

      <div className="px-6 sm:px-10 pb-10 mt-8 space-y-7">
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
