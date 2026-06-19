export type Style = "Modern" | "Luxury" | "Minimal" | "Corporate" | "Creative";

export const STYLES: Style[] = ["Modern", "Luxury", "Minimal", "Corporate", "Creative"];

export interface ColorSwatch {
  name: string;
  hex: string;
  meaning?: string;
  usage?: string;
}

export interface MessagingPillar {
  name: string;
  description: string;
}

export interface TargetAudience {
  primary: string;
  behaviors?: string[];
  motivations?: string[];
}

export interface VoiceAndTone {
  dos: string[];
  donts: string[];
}

export interface Typography {
  primary: string;
  secondary?: string;
  rationale?: string;
}

export interface CustomSection {
  title: string;
  body: string;
}

export type BriefFormat = "structured" | "editorial" | "compact" | "story";

export type SectionKey =
  | "brandDescription"
  | "scope"
  | "mission"
  | "vision"
  | "coreValues"
  | "personality"
  | "brandNameRationale"
  | "story"
  | "manifesto"
  | "industrySummary"
  | "competitorLandscape"
  | "positioning"
  | "targetAudience"
  | "voiceAndTone"
  | "messagingPillars"
  | "logoDirection"
  | "colorPalette"
  | "typography"
  | "visualIdentityIdeas";

export type SectionLabels = Partial<Record<SectionKey, string>>;

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "brandDescription",
  "scope",
  "mission",
  "vision",
  "coreValues",
  "personality",
  "brandNameRationale",
  "story",
  "manifesto",
  "industrySummary",
  "competitorLandscape",
  "positioning",
  "targetAudience",
  "voiceAndTone",
  "messagingPillars",
  "logoDirection",
  "colorPalette",
  "typography",
  "visualIdentityIdeas",
];

export const DEFAULT_SECTION_TITLES: Record<SectionKey, string> = {
  brandDescription: "Brand Description",
  scope: "Scope of the Project",
  mission: "Mission",
  vision: "Vision",
  coreValues: "Core Values",
  personality: "Brand Personality",
  brandNameRationale: "Why This Name",
  story: "Brand Story",
  manifesto: "Manifesto",
  industrySummary: "Industry Summary",
  competitorLandscape: "Competitive Landscape",
  positioning: "Brand Positioning",
  targetAudience: "Target Audience",
  voiceAndTone: "Voice & Tone",
  messagingPillars: "Messaging Pillars",
  logoDirection: "Logo Direction",
  colorPalette: "Color Palette",
  typography: "Typography",
  visualIdentityIdeas: "Visual Identity Ideas",
};

export interface Brief {
  brandName: string;

  tagline?: string;
  brandDescription?: string;
  scope?: string;
  mission?: string;
  vision?: string;
  coreValues?: string[];

  brandNameRationale?: string;
  story?: string;
  manifesto?: string;

  industrySummary?: string;
  competitorLandscape?: string;
  positioningStatement?: string;
  positioningRationale?: string;

  targetAudience?: TargetAudience;
  brandPersonalityTraits?: string[];
  voiceAndTone?: VoiceAndTone;
  messagingPillars?: MessagingPillar[];

  logoDirection?: string;
  colorPalette?: ColorSwatch[];
  typography?: Typography;
  visualIdentityIdeas?: string[];

  customSections?: CustomSection[];

  sectionLabels?: SectionLabels;
  sectionOrder?: SectionKey[];

  format?: BriefFormat;
}

function pushIf(lines: string[], label: string, value: string | undefined | null) {
  if (value && value.trim()) {
    lines.push(label);
    lines.push(value.trim());
    lines.push("");
  }
}

function pushBullets(lines: string[], label: string, items: string[] | undefined, marker = "•") {
  if (items && items.length > 0) {
    lines.push(label);
    for (const i of items) lines.push(`  ${marker} ${i}`);
    lines.push("");
  }
}

export function briefToPlainText(b: Brief, industry: string, style: Style): string {
  const lines: string[] = [];
  const hr = "─".repeat(60);

  lines.push("BRAND BRIEF");
  lines.push(`Industry: ${industry}`);
  lines.push(`Style: ${style}`);
  lines.push(hr);
  lines.push("");

  lines.push("BRAND NAME");
  lines.push(b.brandName);
  if (b.tagline) lines.push(`Tagline: ${b.tagline}`);
  lines.push("");

  pushIf(lines, "BRAND DESCRIPTION", b.brandDescription);
  pushIf(lines, "SCOPE OF THE PROJECT", b.scope);
  pushIf(lines, "MISSION", b.mission);
  pushIf(lines, "VISION", b.vision);

  if (b.coreValues && b.coreValues.length > 0) {
    lines.push("CORE VALUES");
    for (const v of b.coreValues) lines.push(`• ${v}`);
    lines.push("");
  }

  if (b.brandPersonalityTraits && b.brandPersonalityTraits.length > 0) {
    lines.push("BRAND PERSONALITY");
    lines.push(b.brandPersonalityTraits.join(" · "));
    lines.push("");
  }

  pushIf(lines, "BRAND STORY", b.story);
  pushIf(lines, "MANIFESTO", b.manifesto);

  pushIf(lines, "INDUSTRY SUMMARY", b.industrySummary);
  pushIf(lines, "COMPETITIVE LANDSCAPE", b.competitorLandscape);

  if (b.positioningStatement || b.positioningRationale) {
    lines.push("BRAND POSITIONING");
    if (b.positioningStatement) lines.push(b.positioningStatement);
    lines.push("");
    pushIf(lines, "Why it works:", b.positioningRationale);
  }

  if (b.targetAudience) {
    lines.push("TARGET AUDIENCE");
    lines.push(`Primary: ${b.targetAudience.primary}`);
    lines.push("");
    pushBullets(lines, "Behaviors:", b.targetAudience.behaviors);
    pushBullets(lines, "Motivations:", b.targetAudience.motivations);
  }

  if (b.messagingPillars && b.messagingPillars.length > 0) {
    lines.push("MESSAGING PILLARS");
    for (const p of b.messagingPillars) {
      lines.push(`• ${p.name}`);
      lines.push(`  ${p.description}`);
    }
    lines.push("");
  }

  if (b.colorPalette && b.colorPalette.length > 0) {
    lines.push("COLOR PALETTE");
    for (const c of b.colorPalette) {
      lines.push(`• ${c.name} (${c.hex})`);
      if (c.meaning) lines.push(`  Meaning: ${c.meaning}`);
      if (c.usage) lines.push(`  Usage: ${c.usage}`);
    }
    lines.push("");
  }

  if (b.visualIdentityIdeas && b.visualIdentityIdeas.length > 0) {
    lines.push("VISUAL IDENTITY IDEAS");
    for (const v of b.visualIdentityIdeas) lines.push(`• ${v}`);
    lines.push("");
  }

  if (b.customSections && b.customSections.length > 0) {
    for (const s of b.customSections) {
      lines.push(s.title.toUpperCase());
      lines.push(s.body);
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}
