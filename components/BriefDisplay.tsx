"use client";

import { useState } from "react";
import type { Brief, Style, SectionKey } from "@/lib/generator";
import { briefToPlainText, DEFAULT_SECTION_ORDER, DEFAULT_SECTION_TITLES } from "@/lib/generator";
import Logo from "./Logo";
import AssignModal from "./AssignModal";

interface Props {
  brief: Brief;
  industry: string;
  style: Style;
}

function hasText(s?: string | null): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

// One paragraph section with the heading inline as a bold lead-in.
// Easier to copy-paste into a Word doc than big numbered cards.
function Para({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-ink/85 leading-relaxed">
      <span className="font-semibold text-ink">{label}. </span>
      {children}
    </p>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-ink/85 leading-relaxed">
      <span className="font-semibold text-ink">{label}.</span>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default function BriefDisplay({ brief, industry, style }: Props) {
  const [copied, setCopied] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);

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

  function renderSection(key: SectionKey): React.ReactNode {
    const label = DEFAULT_SECTION_TITLES[key];
    switch (key) {
      case "brandDescription":
        return <Para key={key} label={label}>{brief.brandDescription}</Para>;
      case "scope":
        return (
          <Section key={key} label={label}>
            <p className="whitespace-pre-line">{brief.scope}</p>
          </Section>
        );
      case "mission":
        return <Para key={key} label={label}>{brief.mission}</Para>;
      case "vision":
        return <Para key={key} label={label}>{brief.vision}</Para>;
      case "coreValues":
        return (
          <Section key={key} label={label}>
            <ul className="list-disc space-y-1 pl-5 marker:text-violet/60">
              {values.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Section>
        );
      case "personality":
        return (
          <Para key={key} label={label}>
            {traits.join(", ")}.
          </Para>
        );
      case "brandNameRationale":
        return <Para key={key} label={label}>{brief.brandNameRationale}</Para>;
      case "story":
        return (
          <Section key={key} label={label}>
            <p className="whitespace-pre-line">{brief.story}</p>
          </Section>
        );
      case "manifesto":
        return (
          <Section key={key} label={label}>
            <p className="whitespace-pre-line">{brief.manifesto}</p>
          </Section>
        );
      case "industrySummary":
        return <Para key={key} label={label}>{brief.industrySummary}</Para>;
      case "competitorLandscape":
        return <Para key={key} label={label}>{brief.competitorLandscape}</Para>;
      case "positioning":
        return (
          <Section key={key} label={label}>
            {hasText(brief.positioningStatement) && (
              <p className="text-ink font-medium">{brief.positioningStatement}</p>
            )}
            {hasText(brief.positioningRationale) && (
              <p className="mt-1.5 text-ink/75">{brief.positioningRationale}</p>
            )}
          </Section>
        );
      case "targetAudience":
        if (!audience) return null;
        return (
          <Section key={key} label={label}>
            {hasText(audience.primary) && <p>{audience.primary}</p>}
            {audience.behaviors && audience.behaviors.length > 0 && (
              <p className="mt-2">
                <span className="font-medium text-ink">Behaviors. </span>
                {audience.behaviors.join(" ")}
              </p>
            )}
            {audience.motivations && audience.motivations.length > 0 && (
              <p className="mt-2">
                <span className="font-medium text-ink">Motivations. </span>
                {audience.motivations.join(" ")}
              </p>
            )}
          </Section>
        );
      case "voiceAndTone":
        if (!voice) return null;
        return (
          <Section key={key} label={label}>
            {voice.dos && voice.dos.length > 0 && (
              <p>
                <span className="font-medium text-emerald-700">Do. </span>
                {voice.dos.join(" ")}
              </p>
            )}
            {voice.donts && voice.donts.length > 0 && (
              <p className="mt-1.5">
                <span className="font-medium text-rose-700">Don&apos;t. </span>
                {voice.donts.join(" ")}
              </p>
            )}
          </Section>
        );
      case "messagingPillars":
        return (
          <Section key={key} label={label}>
            <div className="space-y-2">
              {pillars.map((p) => (
                <p key={p.name}>
                  <span className="font-medium text-ink">{p.name}. </span>
                  {p.description}
                </p>
              ))}
            </div>
          </Section>
        );
      case "logoDirection":
        return (
          <Section key={key} label={label}>
            <p className="whitespace-pre-line">{brief.logoDirection}</p>
          </Section>
        );
      case "colorPalette":
        return (
          <Section key={key} label={label}>
            <ul className="space-y-1.5">
              {palette.map((c) => (
                <li key={c.hex + c.name} className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-ink/15"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>
                    <span className="font-medium text-ink">{c.name}</span>{" "}
                    <span className="font-mono text-xs text-ink/55 uppercase">{c.hex}</span>
                    {hasText(c.meaning) && <span className="text-ink/75"> — {c.meaning}</span>}
                    {hasText(c.usage) && (
                      <span className="text-ink/60"> Used for: {c.usage}.</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        );
      case "typography":
        if (!typo) return null;
        return (
          <Section key={key} label={label}>
            {hasText(typo.primary) && (
              <p>
                <span className="font-medium text-ink">Primary. </span>
                {typo.primary}
              </p>
            )}
            {hasText(typo.secondary) && (
              <p className="mt-1">
                <span className="font-medium text-ink">Secondary. </span>
                {typo.secondary}
              </p>
            )}
            {hasText(typo.rationale) && (
              <p className="mt-1">
                <span className="font-medium text-ink">Rationale. </span>
                {typo.rationale}
              </p>
            )}
          </Section>
        );
      case "visualIdentityIdeas":
        return (
          <Section key={key} label={label}>
            <ul className="list-disc space-y-0.5 pl-5 marker:text-ink/40">
              {visuals.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Section>
        );
    }
  }

  return (
    <>
      <article className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-[0_30px_80px_-40px_rgba(22,10,51,0.25)]">
        {/* Header strip */}
        <div className="border-b border-ink/10 bg-ink text-cream px-6 sm:px-10 py-4 flex items-center justify-between text-[11px] uppercase tracking-[0.24em]">
          <div className="flex items-center gap-3">
            <Logo size={18} color="#C9BCFF" />
            <span>The Brief</span>
          </div>
          <div className="text-cream/70">
            {style} · {industry}
          </div>
        </div>

        {/* Title block */}
        <header className="px-6 sm:px-10 pt-8 pb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-display text-4xl sm:text-5xl text-ink break-words leading-tight">
              {brief.brandName}
            </h2>
            {hasText(brief.tagline) && (
              <p className="mt-1.5 font-display text-xl sm:text-2xl italic text-ink/65">
                {brief.tagline}
              </p>
            )}
            {assignedTo && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800">
                ✓ Added to sheet — assigned to {assignedTo}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAssign(true)}
              className="inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(114,41,255,0.55)] transition hover:bg-violet-deep active:scale-[0.97]"
            >
              I&apos;m using this
            </button>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream px-5 py-2.5 text-sm font-medium text-ink/80 transition hover:border-violet hover:text-violet-deep active:scale-[0.97]"
            >
              {copied ? "✓ Copied" : "Copy full brief"}
            </button>
          </div>
        </header>

        {/* Paragraph body */}
        <div className="px-6 sm:px-10 pt-4 pb-10 mt-2 space-y-4 text-[15px]">
          {orderedKeys.map((key) => renderSection(key))}
          {customs.map((s) => (
            <Section key={s.title} label={s.title}>
              <p className="whitespace-pre-line">{s.body}</p>
            </Section>
          ))}
        </div>
      </article>

      {showAssign && (
        <AssignModal
          brandName={brief.brandName}
          industry={industry}
          style={style}
          onClose={() => setShowAssign(false)}
          onAssigned={() => {
            // Read the most recent assignment to surface the designer name.
            try {
              const raw = window.localStorage.getItem("bbg.assignments");
              if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr) && arr.length > 0) {
                  setAssignedTo(arr[arr.length - 1].designerName ?? null);
                }
              }
            } catch {
              /* ignore */
            }
          }}
        />
      )}
    </>
  );
}
