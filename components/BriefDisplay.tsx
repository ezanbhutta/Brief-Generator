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
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/15 pt-8">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-display text-xl text-violet">{number}</span>
        <h3 className="font-display text-2xl sm:text-3xl text-ink">{title}</h3>
      </div>
      <div className="text-ink/85 leading-relaxed text-base">{children}</div>
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
  const values = brief.coreValues ?? [];
  const voice = brief.voiceAndTone;
  const hasVoice =
    voice && ((voice.dos && voice.dos.length > 0) || (voice.donts && voice.donts.length > 0));
  const pillars = brief.messagingPillars ?? [];
  const palette = brief.colorPalette ?? [];
  const visuals = brief.visualIdentityIdeas ?? [];
  const customs = brief.customSections ?? [];
  const typo = brief.typography;
  const hasTypo = typo && (hasText(typo.primary) || hasText(typo.secondary) || hasText(typo.rationale));

  const sectionHasData: Record<SectionKey, boolean> = {
    brandDescription: hasText(brief.brandDescription),
    scope: hasText(brief.scope),
    mission: hasText(brief.mission),
    vision: hasText(brief.vision),
    coreValues: values.length > 0,
    personality: traits.length > 0,
    brandNameRationale: hasText(brief.brandNameRationale),
    story: hasText(brief.story),
    manifesto: hasText(brief.manifesto),
    industrySummary: hasText(brief.industrySummary),
    competitorLandscape: hasText(brief.competitorLandscape),
    positioning: hasPositioning,
    targetAudience: !!hasAudience,
    voiceAndTone: !!hasVoice,
    messagingPillars: pillars.length > 0,
    logoDirection: hasText(brief.logoDirection),
    colorPalette: palette.length > 0,
    typography: !!hasTypo,
    visualIdentityIdeas: visuals.length > 0,
  };

  const orderedKeys: SectionKey[] = DEFAULT_SECTION_ORDER.filter((k) => sectionHasData[k]);

  function renderSection(key: SectionKey, idx: number): React.ReactNode {
    const number = String(idx + 1).padStart(2, "0");
    const title = DEFAULT_SECTION_TITLES[key];
    switch (key) {
      case "brandDescription":
        return (
          <Section key={key} number={number} title={title}>
            <p className="text-lg leading-relaxed">{brief.brandDescription}</p>
          </Section>
        );
      case "scope":
        return (
          <Section key={key} number={number} title={title}>
            <p className="whitespace-pre-line">{brief.scope}</p>
          </Section>
        );
      case "mission":
        return (
          <Section key={key} number={number} title={title}>
            <p className="text-lg leading-relaxed">{brief.mission}</p>
          </Section>
        );
      case "vision":
        return (
          <Section key={key} number={number} title={title}>
            <p className="text-lg leading-relaxed">{brief.vision}</p>
          </Section>
        );
      case "coreValues":
        return (
          <Section key={key} number={number} title={title}>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {values.map((v) => (
                <li
                  key={v}
                  className="flex gap-3 rounded-xl border border-ink/10 bg-cream/60 px-4 py-3"
                >
                  <span className="text-violet" aria-hidden>●</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </Section>
        );
      case "personality":
        return (
          <Section key={key} number={number} title={title}>
            <ul className="flex flex-wrap gap-2">
              {traits.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-ink/15 bg-cream px-4 py-1.5 text-sm font-medium text-ink"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Section>
        );
      case "brandNameRationale":
        return (
          <Section key={key} number={number} title={title}>
            <p className="whitespace-pre-line">{brief.brandNameRationale}</p>
          </Section>
        );
      case "story":
        return (
          <Section key={key} number={number} title={title}>
            <p className="whitespace-pre-line">{brief.story}</p>
          </Section>
        );
      case "manifesto":
        return (
          <Section key={key} number={number} title={title}>
            <p className="whitespace-pre-line text-lg leading-relaxed">{brief.manifesto}</p>
          </Section>
        );
      case "industrySummary":
        return (
          <Section key={key} number={number} title={title}>
            <p>{brief.industrySummary}</p>
          </Section>
        );
      case "competitorLandscape":
        return (
          <Section key={key} number={number} title={title}>
            <p>{brief.competitorLandscape}</p>
          </Section>
        );
      case "positioning":
        return (
          <Section key={key} number={number} title={title}>
            {hasText(brief.positioningStatement) && (
              <p className="text-ink font-medium text-lg">{brief.positioningStatement}</p>
            )}
            {hasText(brief.positioningRationale) && (
              <p className="mt-3 text-ink/75">{brief.positioningRationale}</p>
            )}
          </Section>
        );
      case "targetAudience":
        if (!audience) return null;
        return (
          <Section key={key} number={number} title={title}>
            {hasText(audience.primary) && (
              <p className="text-ink text-lg leading-relaxed">{audience.primary}</p>
            )}
            {audience.behaviors && audience.behaviors.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Behaviors
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-violet">
                  {audience.behaviors.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {audience.motivations && audience.motivations.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
                  Motivations
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-violet">
                  {audience.motivations.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        );
      case "voiceAndTone":
        if (!voice) return null;
        return (
          <Section key={key} number={number} title={title}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {voice.dos && voice.dos.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Do
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink/85">
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
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                    Don&apos;t
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink/85">
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
          <Section key={key} number={number} title={title}>
            <ul className="space-y-3">
              {pillars.map((p) => (
                <li key={p.name} className="rounded-xl border border-ink/10 bg-cream/40 p-5">
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="mt-2 text-ink/75 text-sm leading-relaxed">{p.description}</p>
                </li>
              ))}
            </ul>
          </Section>
        );
      case "logoDirection":
        return (
          <Section key={key} number={number} title={title}>
            <p className="whitespace-pre-line">{brief.logoDirection}</p>
          </Section>
        );
      case "colorPalette":
        return (
          <Section key={key} number={number} title={title}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {palette.map((c) => (
                <li
                  key={c.hex + c.name}
                  className="flex items-start gap-4 rounded-xl border border-ink/10 bg-cream/40 p-4"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 inline-block h-16 w-16 shrink-0 rounded-lg border border-ink/10 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-ink">{c.name}</span>
                      <span className="text-xs font-mono uppercase text-ink/55">
                        {c.hex}
                      </span>
                    </div>
                    {hasText(c.meaning) && (
                      <p className="mt-1 text-sm text-ink/75">{c.meaning}</p>
                    )}
                    {hasText(c.usage) && (
                      <p className="mt-1 text-xs text-ink/55">
                        <span className="font-medium text-ink/65">Use: </span>
                        {c.usage}
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
          <Section key={key} number={number} title={title}>
            <div className="rounded-xl border border-ink/10 bg-cream/40 p-5 space-y-4">
              {hasText(typo.primary) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
                    Primary
                  </p>
                  <p className="mt-1 text-ink">{typo.primary}</p>
                </div>
              )}
              {hasText(typo.secondary) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
                    Secondary
                  </p>
                  <p className="mt-1 text-ink">{typo.secondary}</p>
                </div>
              )}
              {hasText(typo.rationale) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">
                    Rationale
                  </p>
                  <p className="mt-1 text-ink/80">{typo.rationale}</p>
                </div>
              )}
            </div>
          </Section>
        );
      case "visualIdentityIdeas":
        return (
          <Section key={key} number={number} title={title}>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-violet">
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
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink/45">Brand name</p>
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

      <div className="px-6 sm:px-10 pb-10 mt-10 space-y-10">
        {orderedKeys.map((key, idx) => renderSection(key, idx))}

        {customs.map((s, i) => (
          <Section
            key={s.title}
            number={String(orderedKeys.length + i + 1).padStart(2, "0")}
            title={s.title}
          >
            <p className="whitespace-pre-line">{s.body}</p>
          </Section>
        ))}
      </div>
    </article>
  );
}
