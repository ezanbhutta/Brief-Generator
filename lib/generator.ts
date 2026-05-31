export type Style = "Modern" | "Luxury" | "Minimal" | "Corporate" | "Creative";

export const STYLES: Style[] = ["Modern", "Luxury", "Minimal", "Corporate", "Creative"];

export interface ColorSwatch {
  name: string;
  hex: string;
  meaning: string;
  usage: string;
}

export interface MessagingPillar {
  name: string;
  description: string;
}

export interface TargetAudience {
  primary: string;
  behaviors: string[];
  motivations: string[];
}

export interface VoiceAndTone {
  dos: string[];
  donts: string[];
}

export interface Typography {
  primary: string;
  secondary: string;
  rationale: string;
}

export interface Brief {
  brandName: string;
  brandNameRationale: string;
  tagline: string;
  industrySummary: string;
  competitorLandscape: string;
  positioningStatement: string;
  positioningRationale: string;
  targetAudience: TargetAudience;
  brandPersonalityTraits: string[];
  voiceAndTone: VoiceAndTone;
  messagingPillars: MessagingPillar[];
  logoDirection: string;
  colorPalette: ColorSwatch[];
  typography: Typography;
  visualIdentityIdeas: string[];
}

export function briefToPlainText(b: Brief, industry: string, style: Style): string {
  const lines: string[] = [];
  const hr = "─".repeat(60);

  lines.push(`BRAND BRIEF`);
  lines.push(`Industry: ${industry}`);
  lines.push(`Style: ${style}`);
  lines.push(hr);
  lines.push(``);

  lines.push(`BRAND NAME`);
  lines.push(b.brandName);
  lines.push(`Tagline: ${b.tagline}`);
  lines.push(``);
  lines.push(`Why this name:`);
  lines.push(b.brandNameRationale);
  lines.push(``);

  lines.push(hr);
  lines.push(`INDUSTRY SUMMARY`);
  lines.push(b.industrySummary);
  lines.push(``);

  lines.push(`COMPETITIVE LANDSCAPE`);
  lines.push(b.competitorLandscape);
  lines.push(``);

  lines.push(`BRAND POSITIONING`);
  lines.push(b.positioningStatement);
  lines.push(``);
  lines.push(`Why it works:`);
  lines.push(b.positioningRationale);
  lines.push(``);

  lines.push(`TARGET AUDIENCE`);
  lines.push(`Primary: ${b.targetAudience.primary}`);
  lines.push(``);
  lines.push(`Behaviors:`);
  for (const x of b.targetAudience.behaviors) lines.push(`  • ${x}`);
  lines.push(``);
  lines.push(`Motivations:`);
  for (const x of b.targetAudience.motivations) lines.push(`  • ${x}`);
  lines.push(``);

  lines.push(`BRAND PERSONALITY`);
  lines.push(b.brandPersonalityTraits.join(" · "));
  lines.push(``);

  lines.push(`VOICE & TONE`);
  lines.push(`Do:`);
  for (const x of b.voiceAndTone.dos) lines.push(`  ✓ ${x}`);
  lines.push(``);
  lines.push(`Don't:`);
  for (const x of b.voiceAndTone.donts) lines.push(`  ✗ ${x}`);
  lines.push(``);

  lines.push(`MESSAGING PILLARS`);
  for (const p of b.messagingPillars) {
    lines.push(`• ${p.name}`);
    lines.push(`  ${p.description}`);
  }
  lines.push(``);

  lines.push(hr);
  lines.push(`LOGO DIRECTION`);
  lines.push(b.logoDirection);
  lines.push(``);

  lines.push(`COLOR PALETTE`);
  for (const c of b.colorPalette) {
    lines.push(`• ${c.name} (${c.hex})`);
    lines.push(`  Meaning: ${c.meaning}`);
    lines.push(`  Usage: ${c.usage}`);
  }
  lines.push(``);

  lines.push(`TYPOGRAPHY`);
  lines.push(`Primary: ${b.typography.primary}`);
  lines.push(`Secondary: ${b.typography.secondary}`);
  lines.push(`Rationale: ${b.typography.rationale}`);
  lines.push(``);

  lines.push(`VISUAL IDENTITY IDEAS`);
  for (const v of b.visualIdentityIdeas) lines.push(`• ${v}`);

  return lines.join("\n");
}
