"use client";

import type { Brief, SectionKey } from "@/lib/generator";
import { DEFAULT_SECTION_TITLES } from "@/lib/generator";

export type FormatId = "paragraph" | "cards" | "editorial";

// ── Templates ────────────────────────────────────────────────────────────
// A template combines a visual format with a specific section order and a
// section subset. Picking a template gives the brief a different shape —
// different ordering, different size, different visual treatment.

export type TemplateId =
  | "designerBrief"
  | "founderMemo"
  | "quickReference"
  | "strategyDeck"
  | "brandStory"
  | "fullBrief";

export interface Template {
  id: TemplateId;
  label: string;
  format: FormatId;
  sections: SectionKey[];
}

// Sections we never render anywhere — copy excludes them too.
const SUPPRESSED: SectionKey[] = [
  "brandNameRationale",
  "voiceAndTone",
  "logoDirection",
  "typography",
];

export const TEMPLATES: Template[] = [
  {
    id: "designerBrief",
    label: "Designer Brief",
    format: "cards",
    sections: [
      "brandDescription",
      "scope",
      "positioning",
      "targetAudience",
      "personality",
      "messagingPillars",
      "industrySummary",
      "competitorLandscape",
      "mission",
      "vision",
      "coreValues",
      "colorPalette",
      "visualIdentityIdeas",
    ],
  },
  {
    id: "founderMemo",
    label: "Founder Memo",
    format: "editorial",
    sections: [
      "positioning",
      "brandDescription",
      "industrySummary",
      "competitorLandscape",
      "targetAudience",
      "messagingPillars",
      "personality",
      "mission",
      "vision",
      "coreValues",
      "colorPalette",
      "visualIdentityIdeas",
    ],
  },
  {
    id: "quickReference",
    label: "Strategy Note",
    format: "paragraph",
    sections: [
      "brandDescription",
      "positioning",
      "industrySummary",
      "competitorLandscape",
      "targetAudience",
      "personality",
      "messagingPillars",
      "mission",
      "vision",
      "coreValues",
      "colorPalette",
      "visualIdentityIdeas",
    ],
  },
  {
    id: "strategyDeck",
    label: "Strategy Deck",
    format: "cards",
    sections: [
      "industrySummary",
      "competitorLandscape",
      "positioning",
      "targetAudience",
      "messagingPillars",
      "personality",
      "brandDescription",
      "scope",
      "mission",
      "vision",
      "coreValues",
      "colorPalette",
      "visualIdentityIdeas",
    ],
  },
  {
    id: "brandStory",
    label: "Brand Story",
    format: "editorial",
    sections: [
      "manifesto",
      "story",
      "brandDescription",
      "mission",
      "vision",
      "coreValues",
      "positioning",
      "personality",
      "targetAudience",
      "messagingPillars",
      "industrySummary",
      "colorPalette",
      "visualIdentityIdeas",
    ],
  },
  {
    id: "fullBrief",
    label: "Full Brief",
    format: "paragraph",
    sections: [
      "brandDescription",
      "scope",
      "mission",
      "vision",
      "coreValues",
      "personality",
      "story",
      "manifesto",
      "industrySummary",
      "competitorLandscape",
      "positioning",
      "targetAudience",
      "messagingPillars",
      "colorPalette",
      "visualIdentityIdeas",
    ],
  },
];

export function getTemplate(id: TemplateId): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

// ── Fresh layout builder ──────────────────────────────────────────────────
// The catalog now generates a genuinely new shape on every render: a shuffled
// section ordering AND a visual format, both guaranteed different from the
// previous one. This replaces the fixed 6-template rotation so no two briefs
// in a row share a hierarchy or a format.

export const ALL_FORMATS: FormatId[] = ["paragraph", "cards", "editorial"];

// Canonical full order — every section the display supports, minus suppressed.
const FULL_ORDER: SectionKey[] = [
  "brandDescription",
  "scope",
  "positioning",
  "industrySummary",
  "competitorLandscape",
  "targetAudience",
  "messagingPillars",
  "personality",
  "mission",
  "vision",
  "coreValues",
  "story",
  "manifesto",
  "colorPalette",
  "visualIdentityIdeas",
];

// Sections that read well as the FIRST thing in a brief. We always lead with
// one of these (never open on a color swatch list) so the shuffle stays
// coherent while every ordering below the opener is randomized.
const OPENERS: SectionKey[] = [
  "brandDescription",
  "positioning",
  "manifesto",
  "industrySummary",
  "story",
  "mission",
];

export interface Layout {
  format: FormatId;
  sections: SectionKey[];
}

function hasSectionData(brief: Brief): Record<SectionKey, boolean> {
  const audience = brief.targetAudience;
  const hasAudience =
    audience &&
    (hasText(audience.primary) ||
      (audience.behaviors && audience.behaviors.length > 0) ||
      (audience.motivations && audience.motivations.length > 0));
  return {
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
    voiceAndTone: false,
    messagingPillars: (brief.messagingPillars ?? []).length > 0,
    logoDirection: false,
    colorPalette: (brief.colorPalette ?? []).length > 0,
    typography: false,
    visualIdentityIdeas: (brief.visualIdentityIdeas ?? []).length > 0,
  };
}

// Every section this brief actually has data for, suppressed ones removed.
export function availableSections(brief: Brief): SectionKey[] {
  const has = hasSectionData(brief);
  return FULL_ORDER.filter((k) => has[k] && !SUPPRESSED.includes(k));
}

// Build a fresh layout: random opener + Fisher-Yates shuffle of the rest, plus
// a format. `avoidOrderKey` / `avoidFormat` steer away from the previous render
// so consecutive briefs never match. Falls back gracefully with 1-2 sections.
export function buildLayout(
  brief: Brief,
  rand: () => number,
  avoidOrderKey?: string | null,
  avoidFormat?: string | null,
): Layout {
  const avail = availableSections(brief);

  const shuffleOnce = (): SectionKey[] => {
    if (avail.length <= 1) return [...avail];
    const openers = avail.filter((s) => OPENERS.includes(s));
    const opener =
      openers.length > 0 ? openers[Math.floor(rand() * openers.length)] : avail[0];
    const rest = avail.filter((s) => s !== opener);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return [opener, ...rest];
  };

  // Try a few shuffles to land on an ordering different from the last one.
  let sections = shuffleOnce();
  for (let attempt = 0; attempt < 6 && avoidOrderKey; attempt++) {
    if (sections.join(">") !== avoidOrderKey) break;
    sections = shuffleOnce();
  }

  // Format: prefer one different from the last.
  const formatPool = avoidFormat
    ? ALL_FORMATS.filter((f) => f !== avoidFormat)
    : ALL_FORMATS;
  const pool = formatPool.length > 0 ? formatPool : ALL_FORMATS;
  const format = pool[Math.floor(rand() * pool.length)];

  return { format, sections };
}

export function formatLabel(f: FormatId): string {
  return f === "cards" ? "Cards" : f === "editorial" ? "Editorial" : "Paragraph";
}

function hasText(s?: string | null): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

// Filter a template's section list down to ones the brief actually has data
// for. Suppressed sections are always dropped.
export function resolveSections(brief: Brief, template: Template): SectionKey[] {
  const audience = brief.targetAudience;
  const hasAudience =
    audience &&
    (hasText(audience.primary) ||
      (audience.behaviors && audience.behaviors.length > 0) ||
      (audience.motivations && audience.motivations.length > 0));
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
    voiceAndTone: false,
    messagingPillars: (brief.messagingPillars ?? []).length > 0,
    logoDirection: false,
    colorPalette: (brief.colorPalette ?? []).length > 0,
    typography: false,
    visualIdentityIdeas: (brief.visualIdentityIdeas ?? []).length > 0,
  };
  return template.sections.filter((k) => sectionHasData[k] && !SUPPRESSED.includes(k));
}

// ── Shared section content renderer ──────────────────────────────────────
function SectionInner({ keyName, brief }: { keyName: SectionKey; brief: Brief }): React.ReactNode {
  const palette = brief.colorPalette ?? [];
  const traits = brief.brandPersonalityTraits ?? [];
  const values = brief.coreValues ?? [];
  const pillars = brief.messagingPillars ?? [];
  const visuals = brief.visualIdentityIdeas ?? [];
  const audience = brief.targetAudience;
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
    case "visualIdentityIdeas":
      return (
        <ul className="list-disc space-y-0.5 pl-5 marker:text-dim">
          {visuals.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

function shortSection(keyName: SectionKey): boolean {
  return [
    "brandDescription",
    "mission",
    "vision",
    "personality",
    "industrySummary",
    "competitorLandscape",
  ].includes(keyName);
}

// ── Format renderers ─────────────────────────────────────────────────────
// Each format takes a Brief + the resolved ordered section list.

interface RenderProps {
  brief: Brief;
  ordered: SectionKey[];
}

export function ParagraphFormat({ brief, ordered }: RenderProps) {
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
    </div>
  );
}

export function CardsFormat({ brief, ordered }: RenderProps) {
  return (
    <div className="px-6 sm:px-8 pt-4 pb-8 mt-2 grid gap-3 sm:grid-cols-2">
      {ordered.map((key, i) => (
        <div key={key} className="rounded-lg border border-border bg-bg-raised/40 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="mono text-[10px] font-semibold text-violet">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-label text-dim">
              {DEFAULT_SECTION_TITLES[key]}
            </span>
          </div>
          <div className="text-[14px] leading-relaxed text-ink/85">
            <SectionInner keyName={key} brief={brief} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EditorialFormat({ brief, ordered }: RenderProps) {
  const positioningStatement = brief.positioningStatement;
  // If positioning is in the section list, hoist it to the pull quote and skip the body section.
  const showPullQuote = ordered.includes("positioning") && hasText(positioningStatement);
  const body = showPullQuote ? ordered.filter((k) => k !== "positioning") : ordered;
  return (
    <div className="px-6 sm:px-10 pt-6 pb-10 mt-2">
      {showPullQuote && (
        <blockquote className="mb-6 border-l-2 border-violet pl-4 py-1">
          <p className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
            &ldquo;{positioningStatement}&rdquo;
          </p>
          <p className="mt-1.5 text-[11px] uppercase tracking-label text-dim">
            Positioning
          </p>
        </blockquote>
      )}
      <div className="space-y-6">
        {body.map((key, i) => (
          <section key={key}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-label text-violet">
              {DEFAULT_SECTION_TITLES[key]}
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
        ))}
      </div>
    </div>
  );
}
