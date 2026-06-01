import { NextResponse } from "next/server";
import type { Style } from "@/lib/generator";
import { STYLES } from "@/lib/generator";
import { pickBrief } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isStyle(s: unknown): s is Style {
  return typeof s === "string" && (STYLES as readonly string[]).includes(s);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { industry, style, excludeIds } = (body ?? {}) as {
    industry?: unknown;
    style?: unknown;
    excludeIds?: unknown;
  };

  if (typeof industry !== "string" || !industry.trim()) {
    return NextResponse.json({ error: "Industry is required." }, { status: 400 });
  }
  if (!isStyle(style)) {
    return NextResponse.json(
      { error: "Style must be one of: " + STYLES.join(", ") },
      { status: 400 },
    );
  }
  const exclude = Array.isArray(excludeIds)
    ? excludeIds.filter((x): x is string => typeof x === "string")
    : [];

  const result = pickBrief(industry.trim(), style, exclude);

  if (!result.ok) {
    const r = result.data;
    if (r.reason === "catalog-empty") {
      return NextResponse.json(
        {
          error:
            "The brief catalog is empty. Add JSON files under data/catalog/ and redeploy.",
          reason: "catalog-empty",
        },
        { status: 503 },
      );
    }
    if (r.reason === "industry-unknown") {
      return NextResponse.json(
        {
          error: `We don't have briefs for "${industry}" yet.`,
          reason: "industry-unknown",
          availableIndustries: r.availableIndustries,
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        error: `No ${style} briefs available yet for ${r.matchedIndustry?.label ?? industry}.`,
        reason: "cell-empty",
        matchedIndustry: r.matchedIndustry,
        availableIndustries: r.availableIndustries,
      },
      { status: 404 },
    );
  }

  const { brief, matchedIndustry, confidence, fuzzyDistance, totalInCell } = result.data;
  return NextResponse.json({
    brief,
    matchedIndustry: { key: matchedIndustry.key, label: matchedIndustry.label },
    confidence,
    fuzzyDistance,
    totalInCell,
  });
}
