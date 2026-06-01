# Brand Brief Generator

A single-page web app that serves **agency-quality branding briefs** from a curated catalog. Users enter an industry and pick a style; the app returns a complete brief (name, positioning, audience, voice, palette, typography, visual direction). No LLM call at request time — briefs are pre-written and read from a static catalog.

## Tech

- **Next.js 16** (App Router) + **React 18** + **TypeScript** + **Tailwind CSS**
- No database — briefs are JSON files in `data/catalog/`
- No API keys required at runtime

## Folder structure

```
.
├── app/
│   ├── api/generate/route.ts   Reads from the catalog; no external API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                Single-page UI
├── components/
│   └── BriefDisplay.tsx        Rendered brief + copy-to-clipboard
├── data/
│   └── catalog/                Drop one JSON file per industry here
│       └── README.md           Catalog file schema
├── lib/
│   ├── catalog.ts              Loader + closest-match picker
│   ├── generator.ts            Brief types + plain-text serializer
│   └── industries.ts           50-industry registry with aliases
```

## How it works

1. User submits **industry** (free text) and **style** (dropdown).
2. The server route resolves the industry through the 50-industry registry — exact match → alias → fuzzy (Levenshtein).
3. It picks a random brief from `data/catalog/<industry>.json` for the matched style.
4. The client tracks "seen" brief IDs in `localStorage`, so **Regenerate** always returns a different one until the cell is exhausted.

If the catalog has no brief for the requested cell, the API returns a clear `cell-empty` / `industry-unknown` / `catalog-empty` error and the UI surfaces it gracefully.

## Adding briefs to the catalog

Each industry gets its own JSON file at `data/catalog/<industry-key>.json` matching this shape:

```json
{
  "industry": "coffee",
  "briefs": {
    "Modern":    [ { /* Brief object */ }, ... ],
    "Luxury":    [ ... ],
    "Minimal":   [ ... ],
    "Corporate": [ ... ],
    "Creative":  [ ... ]
  }
}
```

- Use the keys from `lib/industries.ts` (e.g. `coffee`, `fintech`, `skincare`).
- The `Brief` object schema is defined as the `Brief` interface in `lib/generator.ts`.
- Append more briefs to a cell at any time — the picker reads the file at request time.
- After editing catalog files, redeploy (or `npm run dev` will pick them up live).

## Local setup

Requirements: Node.js 18.17+ (Node 20 LTS recommended).

```bash
npm install
npm run dev
# open http://localhost:3000
```

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # next lint
```

## Deploying on Vercel (free)

1. Push the repo to GitHub.
2. Go to <https://vercel.com/new> and import the repo.
3. Vercel auto-detects **Next.js**. Leave defaults.
4. **No environment variables required.**
5. Deploy.

Every push to the default branch auto-deploys.

## Customizing

- **Add a new industry:** add an entry to `INDUSTRIES` in `lib/industries.ts` (key + label + aliases), then create `data/catalog/<key>.json`.
- **Add a new style:** add it to the `Style` union and `STYLES` array in `lib/generator.ts`. The dropdown reads from the same list.
- **Tweak fallback behavior:** edit `resolveIndustry` in `lib/industries.ts` (Levenshtein threshold, alias matching).
- **Change "seen" memory:** edit `SEEN_LIMIT` in `app/page.tsx`.

## License

MIT.
