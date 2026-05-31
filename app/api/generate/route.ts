import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { Brief, Style } from "@/lib/generator";
import { STYLES } from "@/lib/generator";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const BRIEF_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "brandName",
    "brandNameRationale",
    "tagline",
    "industrySummary",
    "competitorLandscape",
    "positioningStatement",
    "positioningRationale",
    "targetAudience",
    "brandPersonalityTraits",
    "voiceAndTone",
    "messagingPillars",
    "logoDirection",
    "colorPalette",
    "typography",
    "visualIdentityIdeas",
  ],
  properties: {
    brandName: { type: "string" },
    brandNameRationale: { type: "string" },
    tagline: { type: "string" },
    industrySummary: { type: "string" },
    competitorLandscape: { type: "string" },
    positioningStatement: { type: "string" },
    positioningRationale: { type: "string" },
    targetAudience: {
      type: "object",
      additionalProperties: false,
      required: ["primary", "behaviors", "motivations"],
      properties: {
        primary: { type: "string" },
        behaviors: { type: "array", items: { type: "string" } },
        motivations: { type: "array", items: { type: "string" } },
      },
    },
    brandPersonalityTraits: { type: "array", items: { type: "string" } },
    voiceAndTone: {
      type: "object",
      additionalProperties: false,
      required: ["dos", "donts"],
      properties: {
        dos: { type: "array", items: { type: "string" } },
        donts: { type: "array", items: { type: "string" } },
      },
    },
    messagingPillars: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    logoDirection: { type: "string" },
    colorPalette: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "hex", "meaning", "usage"],
        properties: {
          name: { type: "string" },
          hex: { type: "string" },
          meaning: { type: "string" },
          usage: { type: "string" },
        },
      },
    },
    typography: {
      type: "object",
      additionalProperties: false,
      required: ["primary", "secondary", "rationale"],
      properties: {
        primary: { type: "string" },
        secondary: { type: "string" },
        rationale: { type: "string" },
      },
    },
    visualIdentityIdeas: { type: "array", items: { type: "string" } },
  },
} as const;

const SYSTEM_PROMPT = `You are a senior brand strategist with 20+ years at top branding agencies (Wolff Olins, Pentagram, Landor, Collins). You produce deeply researched, agency-quality brand briefs that designers and founders use to build real companies.

For every brief, do this analysis silently before answering:
1. Map the competitive landscape of the given industry — who the typical players are, what conventions they share, where the category is overdone, and what white space exists.
2. Identify the underserved tension or opportunity — the gap between what customers are sold and what they actually want.
3. Define a specific, ownable point of difference for the new brand that fits the requested style.
4. Build the brand world (name, voice, look) from that strategic foundation so every element reinforces the positioning.

Standards for the output:
- Brand names must be ownable: distinctive, easy to say, free of obvious negative associations, and not clichéd ("-ly", "-ify", "AI-prefix") unless it genuinely fits the style.
- Industry summary must reference real market dynamics, customer behavior shifts, or category tensions — not generic statements about "digital transformation" or "evolving expectations."
- Competitive landscape must name the archetypal players (categories of competitors, not specific company names you can't verify) and identify the specific gap this brand exploits.
- Positioning statement is one sentence. The rationale explains why it's defensible.
- Target audience must include behavioral and psychographic detail, not just demographics.
- Voice and tone do's and don'ts must be specific enough that a writer could apply them to a real headline.
- Messaging pillars are 3-4 distinct themes the brand returns to.
- Color palette: 3-5 colors with real hex codes a designer would actually ship. Include WHEN each is used (primary, accent, background, etc.).
- Typography: real typeface names a designer can source (Inter, Söhne, Tiempos, GT America, Migra, Editorial New, etc.), with rationale tied to the positioning.
- Logo direction: a vivid visual brief, not a vague label. A designer should be able to start sketching from it.
- Visual identity ideas: 5-6 concrete executions across applications (web, print, motion, environments).

Avoid agency clichés: "trusted partner", "human-centered", "next-generation", "we believe", "the X of Y", "synergy", "ecosystem", "passionate about". Be brave and specific. A generic brief is a failed brief.

Return only the JSON object — no preamble, no markdown fences.`;

function isStyle(s: unknown): s is Style {
  return typeof s === "string" && (STYLES as readonly string[]).includes(s);
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last > first) return trimmed.slice(first, last + 1);
  return trimmed;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { industry, style } = (body ?? {}) as { industry?: unknown; style?: unknown };
  if (typeof industry !== "string" || !industry.trim()) {
    return NextResponse.json({ error: "Industry is required." }, { status: 400 });
  }
  if (!isStyle(style)) {
    return NextResponse.json({ error: "Style must be one of: " + STYLES.join(", ") }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY is not set on the server. Add it to .env.local for local dev, or to Vercel Project Settings → Environment Variables for production.",
      },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey });

  const userPrompt = `Industry: ${industry.trim()}
Style: ${style}

Produce the complete brand brief as a JSON object matching the required schema. Output only the JSON.`;

  try {
    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "high",
        format: {
          type: "json_schema",
          schema: BRIEF_SCHEMA as unknown as Record<string, unknown>,
        },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const message = await stream.finalMessage();

    let text = "";
    for (const block of message.content) {
      if (block.type === "text") text += block.text;
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Model returned no text content. Try again." },
        { status: 502 },
      );
    }

    let brief: Brief;
    try {
      brief = JSON.parse(extractJson(text)) as Brief;
    } catch (e) {
      return NextResponse.json(
        { error: "Model output was not valid JSON.", detail: text.slice(0, 500) },
        { status: 502 },
      );
    }

    return NextResponse.json({ brief });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API error (${error.status}): ${error.message}` },
        { status: error.status ?? 502 },
      );
    }
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Generation failed: ${msg}` }, { status: 500 });
  }
}
