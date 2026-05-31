export type Style = "Modern" | "Luxury" | "Minimal" | "Corporate" | "Creative";

export interface ColorSwatch {
  name: string;
  hex: string;
  meaning: string;
}

export interface Brief {
  brandName: string;
  tagline: string;
  industrySummary: string;
  positioning: string;
  targetAudience: string;
  logoDirection: string;
  colorPalette: ColorSwatch[];
  typography: {
    primary: string;
    secondary: string;
    rationale: string;
  };
  personalityTraits: string[];
  visualIdentityIdeas: string[];
}

const STYLE_WORD_BANK: Record<
  Style,
  {
    prefixes: string[];
    suffixes: string[];
    descriptors: string[];
    audiences: string[];
    personality: string[];
    palette: ColorSwatch[][];
    typography: { primary: string; secondary: string; rationale: string }[];
    logoConcepts: string[];
    visualIdeas: string[];
  }
> = {
  Modern: {
    prefixes: ["Nova", "Vexa", "Lumen", "Arcus", "Pulse", "Kinetic", "Forma", "Apex"],
    suffixes: ["Labs", "Studio", "Works", "Co", "Forge", "Hub", "Stack", "Loop"],
    descriptors: ["forward-thinking", "tech-led", "agile", "human-centered", "future-ready"],
    audiences: [
      "early-adopter founders and product teams aged 25–45",
      "digital-native professionals seeking smarter, faster tools",
      "growth-focused startups and innovation departments",
    ],
    personality: ["Innovative", "Bold", "Approachable", "Confident", "Optimistic", "Curious"],
    palette: [
      [
        { name: "Electric Indigo", hex: "#4F46E5", meaning: "Innovation, trust in technology" },
        { name: "Cyber Mint", hex: "#34D399", meaning: "Growth, momentum, freshness" },
        { name: "Soft Cloud", hex: "#F4F6FB", meaning: "Clarity and open space" },
        { name: "Graphite", hex: "#1F2937", meaning: "Stability and depth" },
        { name: "Signal Coral", hex: "#FB7185", meaning: "Energy and human warmth" },
      ],
      [
        { name: "Deep Sky", hex: "#2563EB", meaning: "Trust, intelligence, openness" },
        { name: "Lime Pulse", hex: "#A3E635", meaning: "Vitality and forward motion" },
        { name: "Pearl", hex: "#F8FAFC", meaning: "Simplicity and clarity" },
        { name: "Midnight", hex: "#0F172A", meaning: "Authority and precision" },
      ],
    ],
    typography: [
      {
        primary: "Inter",
        secondary: "Söhne or IBM Plex Sans",
        rationale:
          "Geometric, neutral sans-serifs that feel native to digital interfaces while remaining warm in long-form copy.",
      },
      {
        primary: "General Sans",
        secondary: "JetBrains Mono (for accents)",
        rationale:
          "A clean humanist sans paired with a monospace accent signals a product-led, technical sensibility.",
      },
    ],
    logoConcepts: [
      "A geometric monogram built from the first letter, balanced with a single accent shape (dot, slash, or arc) that hints at motion.",
      "A wordmark in a precise geometric sans with a subtle ligature or cut letterform — distinctive without being decorative.",
      "An abstract mark formed by intersecting planes or vectors, suggesting connection, speed, and forward motion.",
    ],
    visualIdeas: [
      "Generous whitespace, modular grid layouts, and bold pull quotes.",
      "Soft gradient meshes used sparingly as hero accents.",
      "Iconography drawn on a 24px grid with consistent 1.5px stroke.",
      "Subtle motion: hover micro-interactions, easing-in fades, and cursor-reactive elements.",
    ],
  },
  Luxury: {
    prefixes: ["Maison", "Velour", "Aurea", "Noir", "Sablé", "Étoile", "Veneré", "Orior"],
    suffixes: ["& Co.", "Atelier", "Maison", "House", "Collection", "Privé"],
    descriptors: ["refined", "heritage-rich", "considered", "uncompromising", "timeless"],
    audiences: [
      "discerning professionals aged 35–65 with high disposable income",
      "collectors and connoisseurs who value craft over trend",
      "executives and tastemakers seeking signature, lasting pieces",
    ],
    personality: ["Refined", "Confident", "Exclusive", "Timeless", "Discreet", "Authoritative"],
    palette: [
      [
        { name: "Onyx", hex: "#0B0B0B", meaning: "Authority, mystery, prestige" },
        { name: "Champagne Gold", hex: "#C9A75A", meaning: "Heritage, craft, value" },
        { name: "Ivory", hex: "#F4EFE6", meaning: "Quiet luxury and timelessness" },
        { name: "Deep Bordeaux", hex: "#5B1A2B", meaning: "Tradition and richness" },
      ],
      [
        { name: "Obsidian", hex: "#111111", meaning: "Elegance and gravitas" },
        { name: "Antique Brass", hex: "#B08D57", meaning: "Craft and warmth" },
        { name: "Cream", hex: "#EFE9DD", meaning: "Refinement, subtlety" },
        { name: "Forest Velvet", hex: "#1F3B2D", meaning: "Heritage and depth" },
        { name: "Pearl White", hex: "#FBFAF7", meaning: "Purity and exclusivity" },
      ],
    ],
    typography: [
      {
        primary: "Canela or Tiempos Headline",
        secondary: "Söhne or Neue Haas Grotesk",
        rationale:
          "A high-contrast serif for headlines signals craft and heritage; a refined neutral sans keeps body copy clean and modern.",
      },
      {
        primary: "Playfair Display",
        secondary: "Inter",
        rationale:
          "Classic serif headlines with a contemporary sans pair tradition with accessibility.",
      },
    ],
    logoConcepts: [
      "A serif wordmark with elegant ligatures, set in wide tracking — quiet, assured, never shouting.",
      "A crest or monogram with thin engraved lines, recalling heritage stamps and seal-craft.",
      "A minimalist serif lockup paired with a single ornamental flourish used only in formal applications.",
    ],
    visualIdeas: [
      "Editorial layouts with large negative space and slow-paced typographic rhythm.",
      "Foil-stamp, deboss, and matte/spot-gloss finishes on print collateral.",
      "Cinematic still photography with directional lighting and shallow depth of field.",
      "Restrained motion — only fades and subtle parallax, never bouncy easing.",
    ],
  },
  Minimal: {
    prefixes: ["Form", "Plane", "Quiet", "Mute", "North", "Even", "Klar", "Linn"],
    suffixes: ["Studio", "Goods", "Co", "Object", "Press", "Type"],
    descriptors: ["essentialist", "considered", "quiet", "intentional", "honest"],
    audiences: [
      "design-literate buyers aged 28–50 who value restraint and function",
      "creative professionals and small studios seeking calm tools",
      "consumers tired of visual noise — looking for clarity in everyday objects",
    ],
    personality: ["Calm", "Honest", "Precise", "Thoughtful", "Understated", "Considered"],
    palette: [
      [
        { name: "Off-White", hex: "#F5F4F0", meaning: "Calm, clarity, breathing room" },
        { name: "Soft Black", hex: "#1A1A1A", meaning: "Honesty and weight" },
        { name: "Warm Stone", hex: "#C7BFB1", meaning: "Texture and quiet warmth" },
      ],
      [
        { name: "Paper", hex: "#FAFAF7", meaning: "Openness and simplicity" },
        { name: "Ink", hex: "#111111", meaning: "Intentional contrast" },
        { name: "Sand", hex: "#D9D2C5", meaning: "Natural, tactile, unhurried" },
        { name: "Sage", hex: "#A6B5A3", meaning: "Subtle, organic depth" },
      ],
    ],
    typography: [
      {
        primary: "Neue Haas Grotesk",
        secondary: "Söhne Mono",
        rationale:
          "A neutral Swiss-grotesk that disappears into the message, with a quiet mono for captions and metadata.",
      },
      {
        primary: "ABC Diatype",
        secondary: "GT America Mono",
        rationale:
          "Disciplined, gridded letterforms reinforce a minimal point of view without becoming sterile.",
      },
    ],
    logoConcepts: [
      "Pure wordmark, set lowercase, with slightly modified terminals — distinctive only on close inspection.",
      "A single-letter mark inside a precise geometric container (circle or square) with mathematically tuned proportions.",
      "Stacked lockup with a thin hairline divider — composition does the work, no ornament needed.",
    ],
    visualIdeas: [
      "Strict 12-column grid, generous margins, and a single-accent color used sparingly.",
      "Black-and-white photography, often cropped tight on texture and material.",
      "Iconography reduced to single-weight outlines on a 16px grid.",
      "Pacing through whitespace — let the reader breathe between sections.",
    ],
  },
  Corporate: {
    prefixes: ["Meridian", "Axiom", "Vanguard", "Sterling", "Pinnacle", "Atlas", "Verity", "Crest"],
    suffixes: ["Group", "Partners", "Holdings", "Capital", "Advisors", "Global", "Systems"],
    descriptors: ["trusted", "established", "consultative", "rigorous", "results-driven"],
    audiences: [
      "C-level decision-makers, enterprise procurement, and institutional clients",
      "mid-market and enterprise organizations seeking proven partners",
      "professional services buyers who require credibility and consistency",
    ],
    personality: ["Trustworthy", "Authoritative", "Reliable", "Pragmatic", "Disciplined", "Insightful"],
    palette: [
      [
        { name: "Deep Navy", hex: "#0B2545", meaning: "Trust, stability, expertise" },
        { name: "Steel Blue", hex: "#3E647F", meaning: "Calm professionalism" },
        { name: "Slate Grey", hex: "#5F6B7A", meaning: "Neutrality and rigor" },
        { name: "Pearl", hex: "#F2F4F7", meaning: "Clarity in communication" },
        { name: "Accent Gold", hex: "#C8A24A", meaning: "Achievement and quality" },
      ],
      [
        { name: "Charcoal", hex: "#1F2933", meaning: "Authority" },
        { name: "Royal Blue", hex: "#1E3A8A", meaning: "Trust and tradition" },
        { name: "Cool Grey", hex: "#9AA5B1", meaning: "Balance and structure" },
        { name: "Soft White", hex: "#FFFFFF", meaning: "Transparency" },
      ],
    ],
    typography: [
      {
        primary: "Söhne",
        secondary: "Tiempos Text",
        rationale:
          "A composed sans for UI and titles paired with a transitional serif for long-form reports — both communicate credibility.",
      },
      {
        primary: "Inter",
        secondary: "Source Serif Pro",
        rationale:
          "A widely-supported sans and a classic serif keep collateral consistent across digital, print, and presentations.",
      },
    ],
    logoConcepts: [
      "A confident serif or transitional sans wordmark, paired with a geometric emblem — square, shield, or pillar — suggesting permanence.",
      "Monogram in a circular badge with subtle separators — refined, never decorative.",
      "Wordmark with a structured symbol mark that scales cleanly from boardroom decks to favicon.",
    ],
    visualIdeas: [
      "Data-led layouts: clear hierarchy, well-set tables, and considered chart styling.",
      "Photography of real teams and environments — natural light, no stock posing.",
      "Icon set drawn with consistent stroke weight and right-angled construction.",
      "Restrained motion focused on readability: smooth scroll, no bounce or playful easing.",
    ],
  },
  Creative: {
    prefixes: ["Fable", "Riot", "Bloom", "Tangle", "Kismet", "Holler", "Plume", "Zest"],
    suffixes: ["Studio", "Club", "Press", "Makers", "Collective", "& Friends", "House"],
    descriptors: ["playful", "expressive", "bold", "story-driven", "unexpected"],
    audiences: [
      "culture-forward consumers aged 18–35 who reward originality",
      "indie founders, makers, and creative agencies",
      "audiences seeking warmth, humor, and personality in the brands they choose",
    ],
    personality: ["Playful", "Bold", "Expressive", "Witty", "Warm", "Imaginative"],
    palette: [
      [
        { name: "Hot Marigold", hex: "#F59E0B", meaning: "Energy, optimism, warmth" },
        { name: "Punch Pink", hex: "#EC4899", meaning: "Playfulness and personality" },
        { name: "Cobalt", hex: "#2563EB", meaning: "Confidence and depth" },
        { name: "Cream", hex: "#FFF8EB", meaning: "Friendly canvas" },
        { name: "Forest", hex: "#166534", meaning: "Grounded, real, alive" },
      ],
      [
        { name: "Tangerine", hex: "#FB923C", meaning: "Joy and movement" },
        { name: "Plum", hex: "#7C3AED", meaning: "Imagination" },
        { name: "Lemon", hex: "#FDE047", meaning: "Surprise and delight" },
        { name: "Off-White", hex: "#FFFDF7", meaning: "Open canvas for play" },
      ],
    ],
    typography: [
      {
        primary: "Migra or Editorial New",
        secondary: "ABC Diatype",
        rationale:
          "A characterful display serif gives the brand a voice; a clean sans keeps long-form readable and lets the headline sing.",
      },
      {
        primary: "Tobias",
        secondary: "PP Neue Montreal",
        rationale:
          "Expressive serif headlines paired with a quirky, contemporary sans signal craft and personality together.",
      },
    ],
    logoConcepts: [
      "Custom-drawn wordmark with one unexpected letterform twist — a swash, cut, or wink.",
      "Illustrated mascot or symbol that can flex across moods, used as both logo and editorial device.",
      "Sticker-style lockup with rounded forms, designed to feel hand-touched and reproducible across merch.",
    ],
    visualIdeas: [
      "Bold typographic posters using oversized headlines and unexpected color blocking.",
      "Illustration as a primary visual language — characters, scenes, or motifs.",
      "Editorial photography with playful styling, candid framing, and saturated color.",
      "Lively motion: bouncy easing, kinetic typography, and looping micro-animations.",
    ],
  },
};

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function industryKeyword(industry: string): string {
  const cleaned = industry.trim().replace(/\s+/g, " ");
  if (!cleaned) return "the industry";
  return cleaned.toLowerCase();
}

function industryNoun(industry: string): string {
  const words = industry.trim().split(/\s+/);
  const last = words[words.length - 1] || "Sector";
  return titleCase(last);
}

export function generateBrief(industryRaw: string, style: Style, nonce = 0): Brief {
  const industry = industryRaw.trim() || "General";
  const seed = hash(`${industry.toLowerCase()}::${style}::${nonce}`);
  const bank = STYLE_WORD_BANK[style];

  const prefix = pick(bank.prefixes, seed, 1);
  const suffix = pick(bank.suffixes, seed, 3);
  const brandName =
    style === "Luxury" || style === "Corporate"
      ? `${prefix} ${suffix}`
      : seed % 3 === 0
      ? `${prefix}${suffix}`
      : `${prefix} ${suffix}`;

  const descriptor = pick(bank.descriptors, seed, 5);
  const audience = pick(bank.audiences, seed, 7);
  const palette = pick(bank.palette, seed, 9);
  const typography = pick(bank.typography, seed, 11);
  const logoDirection = pick(bank.logoConcepts, seed, 13);
  const personality: string[] = [];
  for (let i = 0; personality.length < 4 && i < bank.personality.length * 2; i++) {
    const t = pick(bank.personality, seed, 17 + i * 7);
    if (!personality.includes(t)) personality.push(t);
  }

  const noun = industryNoun(industry);
  const keyword = industryKeyword(industry);

  const industrySummary =
    `${titleCase(industry)} is a category defined by evolving customer expectations, shifting digital behaviors, ` +
    `and rising competition for attention. Buyers in ${keyword} increasingly reward brands that combine clear ` +
    `value with a distinct, ${descriptor} point of view.`;

  const positioning =
    `${brandName} is the ${descriptor} ${noun.toLowerCase()} brand for people who want substance without compromise. ` +
    `We exist to make ${keyword} feel more human, more useful, and more worth choosing — by leading with clarity, ` +
    `craft, and a signature voice that competitors can't replicate.`;

  const tagline =
    style === "Luxury"
      ? "Quietly exceptional."
      : style === "Modern"
      ? "Built for what's next."
      : style === "Minimal"
      ? "Less, done better."
      : style === "Corporate"
      ? "Trusted outcomes, delivered."
      : "Made to be remembered.";

  return {
    brandName,
    tagline,
    industrySummary,
    positioning,
    targetAudience: `Primary: ${audience}. Secondary: adjacent decision-makers and recommenders who influence the primary buyer.`,
    logoDirection,
    colorPalette: palette,
    typography,
    personalityTraits: personality,
    visualIdentityIdeas: bank.visualIdeas,
  };
}

export function briefToPlainText(b: Brief, industry: string, style: Style): string {
  const lines: string[] = [];
  lines.push(`BRAND BRIEF`);
  lines.push(`Industry: ${industry}`);
  lines.push(`Style: ${style}`);
  lines.push(``);
  lines.push(`BRAND NAME`);
  lines.push(b.brandName);
  lines.push(`Tagline: ${b.tagline}`);
  lines.push(``);
  lines.push(`INDUSTRY SUMMARY`);
  lines.push(b.industrySummary);
  lines.push(``);
  lines.push(`BRAND POSITIONING`);
  lines.push(b.positioning);
  lines.push(``);
  lines.push(`TARGET AUDIENCE`);
  lines.push(b.targetAudience);
  lines.push(``);
  lines.push(`LOGO DIRECTION`);
  lines.push(b.logoDirection);
  lines.push(``);
  lines.push(`COLOR PALETTE`);
  for (const c of b.colorPalette) {
    lines.push(`- ${c.name} (${c.hex}) — ${c.meaning}`);
  }
  lines.push(``);
  lines.push(`TYPOGRAPHY`);
  lines.push(`Primary: ${b.typography.primary}`);
  lines.push(`Secondary: ${b.typography.secondary}`);
  lines.push(`Rationale: ${b.typography.rationale}`);
  lines.push(``);
  lines.push(`BRAND PERSONALITY`);
  lines.push(b.personalityTraits.join(", "));
  lines.push(``);
  lines.push(`VISUAL IDENTITY IDEAS`);
  for (const v of b.visualIdentityIdeas) {
    lines.push(`- ${v}`);
  }
  return lines.join("\n");
}
