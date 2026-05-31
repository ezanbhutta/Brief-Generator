# Brand Brief Generator

A single-page web app that generates a complete branding brief — brand name, positioning, palette, typography, and visual identity — from two inputs: **industry** and **style**.

- Instant generation, no login, no API keys required.
- Clean, modern, mobile-responsive UI.
- One-click "Copy full brief" to clipboard.

## Tech

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- 100% client-side generation — deploys as static-friendly Next output.

## Folder structure

```
.
├── app/
│   ├── globals.css        # Tailwind + base styles
│   ├── layout.tsx         # Root layout / metadata
│   └── page.tsx           # Main single-page UI
├── components/
│   └── BriefDisplay.tsx   # Rendered brief + copy-to-clipboard
├── lib/
│   └── generator.ts       # Deterministic brief generator (logic + word banks)
├── next.config.js
├── next-env.d.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Local setup

Requirements: Node.js 18.17+ (Node 20 LTS recommended).

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open http://localhost:3000
```

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # next lint
```

## How it works

The generator (`lib/generator.ts`) maps the chosen style to a curated word bank — name prefixes/suffixes, palette options, typography recommendations, logo concepts, and visual identity ideas. The industry input is woven into the industry summary, positioning, and tagline. A small FNV-1a hash of `industry + style + nonce` seeds the selection so the same inputs reliably produce the same brief, and the "Regenerate variation" button reseeds for a fresh take.

This keeps the MVP truly free (no LLM API costs) while producing coherent, on-style briefs. To swap in an LLM later, replace `generateBrief` with an API call — the `Brief` type defines the contract.

## Free deployment on Vercel

Vercel's Hobby tier is free and fits this app perfectly.

### Option A — Deploy from GitHub (recommended)

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new>.
3. Click **Import** next to your repo.
4. Framework preset is auto-detected as **Next.js**. Leave defaults:
   - Build command: `next build`
   - Output directory: `.next`
   - Install command: `npm install`
5. No environment variables required.
6. Click **Deploy**.

Every subsequent push to the default branch auto-deploys to production; PR branches get preview URLs.

### Option B — Deploy from your terminal

```bash
npm install -g vercel
vercel        # first-time: links the project and creates a preview deploy
vercel --prod # promote to production
```

That's it — no backend to configure, no secrets, no database.

## Customizing the briefs

Open `lib/generator.ts` and edit `STYLE_WORD_BANK`:

- Add or remove **prefixes** / **suffixes** to influence brand-name shape.
- Tune **palette** entries (each is a `{ name, hex, meaning }` swatch).
- Swap **typography** pairings or **logoConcepts**.
- Adjust **personality** traits and **visualIdeas**.

Add a new style by adding a `Style` literal and a matching entry in `STYLE_WORD_BANK` — the dropdown reads from the same list.

## License

MIT.
