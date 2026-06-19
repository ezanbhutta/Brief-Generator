"use client";

import type { Brief, SectionKey } from "@/lib/generator";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_TITLES } from "@/lib/generator";

export type FormatId = "paragraph" | "cards" | "editorial";

export const FORMAT_LABELS: Record<FormatId, string> = {
  paragraph: "Paragraph",
  cards: "Cards",
  editorial: "Editorial",
};

// Stable-per-brief format selection. Same brief always renders the same way;
// different briefs spread across the available formats.
export function pickFormat(briefId: string): FormatId {
  let h = 0;
  for (let i = 0; i < briefId.length; i++) h = (h * 31 + briefId.charCodeAt(i)) >>> 0;
  const formats: FormatId[] = ["paragraph", "cards", "editorial"];
  return formats[h % formats.length];
}

function hasText(s?: string | null): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

interface BriefSectionData {
  ordered: SectionKey[];
  custom: { title: string; body: string }[];
}

export function getBriefSections(brief: Brief): BriefSectionData {
  const audience = brief.targetAudience;
  const hasAudience =
    audience &&
    (hasText(audience.primary) ||
      (audience.behaviors && audience.behaviors.length > 0) ||
      (audience.motivations && audience.motivations.length > 0));
  const voice = brief.voiceAndTone;
  const hasVoice =
    voice && ((voice.dos && voice.dos.length > 0) || (voice.donts && voice.donts.length > 0));
  const typo = brief.typography;
  const hasTypo =
    typo && (hasText(typo.primary) || hasText(typo.secondary) || hasText(typo.rationale));
  const sectionHasData: Record<SectionKey, boolean> = {
    brandDescription: hasText(brief.brandDescription),
    scope: hasText(brief.scope),
    mission: hasText(brief.mission),
    vision: hasText(brief.vision),
    coreValues: (brief.coreValues ?? []).length > 0,
    personality: (brief.brandPersonalityTraits ?? []).length > 0,
    brandNameRationale: hasText(brief.brandNameRationale),
    story: hasText(brief.story),
    manifesto: hasText(brief.manifesto),
    industrySummary: hasText(brief.industrySummary),
    competitorLandscape: hasText(brief.competitorLandscape),
    positioning: hasText(brief.positioningStatement) || hasText(brief.positioningRationale),
    targetAudience: !!hasAudience,
    voiceAndTone: !!hasVoice,
    messagingPillars: (brief.messagingPillars ?? []).length > 0,
    logoDirection: hasText(brief.logoDirection),
    colorPalette: (brief.colorPalette ?? []).length > 0,
    typography: !!hasTypo,
    visualIdentityIdeas: (brief.visualIdentityIdeas ?? []).length > 0,
  };
  // Sections that don't render anywhere in the UI — copy excludes them too.
  const SUPPRESSED: SectionKey[] = ["brandNameRationale", "voiceAndTone", "logoDirection", "typography"];
  return {
    ordered: DEFAULT_SECTION_ORDER.filter((k) => sectionHasData[k] && !SUPPRESSED.includes(k)),
    custom: brief.customSections ?? [],
  };
}

// ── Shared section content renderer (used by every format) ─────────────────
// Returns the raw inner content for a section. Each format wraps this
// content in its own visual container.

interface InnerProps {
  brief: Brief;
}

function SectionInner({ keyName, brief }: { keyName: SectionKey } & InnerProps): React.ReactNode {
  const palette = brief.colorPalette ?? [];
  const traits = brief.brandPersonalityTraits ?? [];
  const values = brief.coreValues ?? [];
  const pillars = brief.messagingPillars ?? [];
  const visuals = brief.visualIdentityIdeas ?? [];
  const audience = brief.targetAudience;
  const voice = brief.voiceAndTone;
  const typo = brief.typography;

  switch (keyName) {
    case "brandDescription":
      return <p>{brief.brandDescription}</p>;
    case "scope":
      return <p className="whitespace-pre-line">{brief.scope}</p>;
    case "mission":
      return <p>{brief.mission}</p>;
    case "vision":
      return <p>{brief.vision}</p>;
    case "coreValues":
      return (
        <ul className="list-disc space-y-1 pl-5 marker:text-violet/60">
          {values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      );
    case "personality":
      return <p>{traits.join(", ")}.</p>;
    case "brandNameRationale":
      return <p>{brief.brandNameRationale}</p>;
    case "story":
      return <p className="whitespace-pre-line">{brief.story}</p>;
    case "manifesto":
      return <p className="whitespace-pre-line">{brief.manifesto}</p>;
    case "industrySummary":
      return <p>{brief.industrySummary}</p>;
    case "competitorLandscape":
      return <p>{brief.competitorLandscape}</p>;
    case "positioning":
      return (
        <>
          {hasText(brief.positioningStatement) && (
            <p className="font-medium text-ink">{brief.positioningStatement}</p>
          )}
          {hasText(brief.positioningRationale) && (
            <p className="mt-1.5 text-ink/75">{brief.positioningRationale}</p>
          )}
        </>
      );
    case "targetAudience":
      if (!audience) return null;
      return (
        <>
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
        </>
      );
    case "voiceAndTone":
      if (!voice) return null;
      return (
        <>
          {voice.dos && voice.dos.length > 0 && (
            <p>
              <span className="font-medium text-mint">Do. </span>
              {voice.dos.join(" ")}
            </p>
          )}
          {voice.donts && voice.donts.length > 0 && (
            <p className="mt-1.5">
              <span className="font-medium text-coral">Don&apos;t. </span>
              {voice.donts.join(" ")}
            </p>
          )}
        </>
      );
    case "messagingPillars":
      return (
        <div className="space-y-2">
          {pillars.map((p) => (
            <p key={p.name}>
              <span className="font-medium text-ink">{p.name}. </span>
              {p.description}
            </p>
          ))}
        </div>
      );
    case "logoDirection":
      return <p className="whitespace-pre-line">{brief.logoDirection}</p>;
    case "colorPalette":
      return (
        <ul className="space-y-1.5">
          {palette.map((c) => (
            <li key={c.hex + c.name} className="flex items-start gap-2.5">
              <span
                aria-hidden
                className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-border-hi"
                style={{ backgroundColor: c.hex }}
              />
              <span>
                <span className="font-medium text-ink">{c.name}</span>{" "}
                <span className="mono text-[12px] uppercase text-dim">{c.hex}</span>
                {hasText(c.meaning) && <span className="text-ink/75"> — {c.meaning}</span>}
                {hasText(c.usage) && <span className="text-muted"> Used for: {c.usage}.</span>}
              </span>
            </li>
          ))}
        </ul>
      );
    case "typography":
      if (!typo) return null;
      return (
        <>
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
        </>
      );
    case "visualIdentityIdeas":
      return (
        <ul className="list-disc space-y-0.5 pl-5 marker:text-dim">
          {visuals.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      );
  }
}

function shortSection(keyName: SectionKey): boolean {
  // Sections that read well as a single-sentence paragraph with a lead-in.
  return [
    "brandDescription",
    "mission",
    "vision",
    "personality",
    "brandNameRationale",
    "industrySummary",
    "competitorLandscape",
  ].includes(keyName);
}

// ── Format 1: Paragraph ────────────────────────────────────────────────────
// Sections flow inline. Short ones use a bold lead-in; longer ones stack.

export function ParagraphFormat({ brief }: InnerProps) {
  const { ordered, custom } = getBriefSections(brief);
  return (
    <div className="px-6 sm:px-8 pt-4 pb-8 mt-2 space-y-4">
      {ordered.map((key) => {
        const label = DEFAULT_SECTION_TITLES[key];
        if (shortSection(key)) {
          return (
            <p key={key} className="text-[15px] leading-relaxed text-ink/85">
              <span className="font-semibold text-ink">{label}. </span>
              <SectionInner keyName={key} brief={brief} />
            </p>
          );
        }
        return (
          <div key={key} className="text-[15px] leading-relaxed text-ink/85">
            <span className="font-semibold text-ink">{label}.</span>
            <div className="mt-1.5">
              <SectionInner keyName={key} brief={brief} />
            </div>
          </div>
        );
      })}
      {custom.map((s) => (
        <div key={s.title} className="text-[15px] leading-relaxed text-ink/85">
          <span className="font-semibold text-ink">{s.title}.</span>
          <p className="mt-1.5 whitespace-pre-line">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

// ── Format 2: Cards ────────────────────────────────────────────────────────
// Numbered, bordered cards — easier to scan, feels like a deliverables list.

export function CardsFormat({ brief }: InnerProps) {
  const { ordered, custom } = getBriefSections(brief);
  const items: { label: string; key: string; node: React.ReactNode }[] = [
    ...ordered.map((k) => ({
      label: DEFAULT_SECTION_TITLES[k],
      key: k,
      node: <SectionInner keyName={k} brief={brief} />,
    })),
    ...custom.map((s) => ({
      label: s.title,
      key: `custom-${s.title}`,
      node: <p className="whitespace-pre-line">{s.body}</p>,
    })),
  ];
  return (
    <div className="px-6 sm:px-8 pt-4 pb-8 mt-2 grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => (
        <div
          key={item.key}
          className="rounded-lg border border-border bg-bg-raised/40 p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="mono text-[10px] font-semibold text-violet">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-label text-dim">
              {item.label}
            </span>
          </div>
          <div className="text-[14px] leading-relaxed text-ink/85">{item.node}</div>
        </div>
      ))}
    </div>
  );
}

// ── Format 3: Editorial ────────────────────────────────────────────────────
// Magazine layout — drop cap on the first section, oversized section labels,
// pull-quote treatment on positioning.

export function EditorialFormat({ brief }: InnerProps) {
  const { ordered, custom } = getBriefSections(brief);
  const positioningStatement = brief.positioningStatement;
  return (
    <div className="px-6 sm:px-10 pt-6 pb-10 mt-2">
      {hasText(positioningStatement) && (
        <blockquote className="mb-6 border-l-2 border-violet pl-4 py-1">
          <p className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
            &ldquo;{positioningStatement}&rdquo;
          </p>
          <p className="mt-1.5 text-[11px] uppercase tracking-label text-dim">
            Positioning statement
          </p>
        </blockquote>
      )}
      <div className="space-y-6">
        {ordered.map((key, i) => {
          if (key === "positioning") return null;
          const label = DEFAULT_SECTION_TITLES[key];
          return (
            <section key={key}>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-label text-violet">
                {label}
              </h3>
              <div
                className={
                  "text-[15px] leading-relaxed text-ink/85" +
                  (i === 0 ? " editorial-dropcap" : "")
                }
              >
                <SectionInner keyName={key} brief={brief} />
              </div>
            </section>
          );
        })}
        {custom.map((s) => (
          <section key={s.title}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-label text-violet">
              {s.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-ink/85 whitespace-pre-line">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
