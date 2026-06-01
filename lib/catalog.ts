import fs from "fs";
import path from "path";
import type { Brief, Style } from "@/lib/generator";
import { INDUSTRIES, resolveIndustry, type IndustryEntry } from "@/lib/industries";

export interface CatalogFile {
  industry: string;
  aliases?: string[];
  briefs: Partial<Record<Style, Brief[]>>;
}

export interface BriefWithId extends Brief {
  id: string;
}

type Catalog = Map<string, CatalogFile>;

let cache: Catalog | null = null;

function catalogDir(): string {
  return path.join(process.cwd(), "data", "catalog");
}

function loadCatalog(): Catalog {
  if (cache) return cache;
  const map: Catalog = new Map();
  const dir = catalogDir();
  if (!fs.existsSync(dir)) {
    cache = map;
    return map;
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const full = path.join(dir, f);
    try {
      const raw = fs.readFileSync(full, "utf-8");
      const parsed = JSON.parse(raw) as CatalogFile;
      if (parsed?.industry && parsed?.briefs) {
        map.set(parsed.industry, parsed);
      }
    } catch (e) {
      console.error(`[catalog] failed to load ${f}:`, e);
    }
  }
  cache = map;
  return map;
}

export function getCatalogStats() {
  const cat = loadCatalog();
  let total = 0;
  const perIndustry: Record<string, number> = {};
  for (const [key, file] of cat) {
    let count = 0;
    for (const style of Object.keys(file.briefs) as Style[]) {
      count += file.briefs[style]?.length ?? 0;
    }
    perIndustry[key] = count;
    total += count;
  }
  return { total, perIndustry, industries: Array.from(cat.keys()) };
}

function briefSignature(b: Brief): string {
  return `${b.brandName}::${b.tagline}`;
}

export interface PickResult {
  brief: BriefWithId;
  matchedIndustry: IndustryEntry;
  confidence: "exact" | "alias" | "fuzzy";
  fuzzyDistance?: number;
  totalInCell: number;
  catalogIsEmpty: boolean;
}

export interface NoMatchResult {
  reason: "industry-unknown" | "cell-empty" | "catalog-empty";
  matchedIndustry?: IndustryEntry;
  availableIndustries: string[];
}

export type LookupResult =
  | { ok: true; data: PickResult }
  | { ok: false; data: NoMatchResult };

export function pickBrief(
  industryInput: string,
  style: Style,
  excludeIds: string[] = [],
): LookupResult {
  const cat = loadCatalog();
  const available = Array.from(cat.keys());

  if (cat.size === 0) {
    return {
      ok: false,
      data: {
        reason: "catalog-empty",
        availableIndustries: [],
      },
    };
  }

  const match = resolveIndustry(industryInput);
  if (!match) {
    return {
      ok: false,
      data: {
        reason: "industry-unknown",
        availableIndustries: available,
      },
    };
  }

  const file = cat.get(match.entry.key);
  const briefs = file?.briefs[style] ?? [];

  if (briefs.length === 0) {
    return {
      ok: false,
      data: {
        reason: "cell-empty",
        matchedIndustry: match.entry,
        availableIndustries: available,
      },
    };
  }

  const withIds: BriefWithId[] = briefs.map((b) => ({ ...b, id: briefSignature(b) }));
  const excluded = new Set(excludeIds);
  let pool = withIds.filter((b) => !excluded.has(b.id));
  if (pool.length === 0) pool = withIds;

  const pick = pool[Math.floor(Math.random() * pool.length)];

  return {
    ok: true,
    data: {
      brief: pick,
      matchedIndustry: match.entry,
      confidence: match.confidence,
      fuzzyDistance: match.distance,
      totalInCell: briefs.length,
      catalogIsEmpty: false,
    },
  };
}

export function allIndustryLabels(): { key: string; label: string }[] {
  return INDUSTRIES.map((i) => ({ key: i.key, label: i.label }));
}
