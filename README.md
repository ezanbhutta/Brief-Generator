# Brand Brief Generator

A single-page web app that generates **deeply researched** branding briefs — brand name, positioning, audience, voice, palette, typography, and visual identity — from two inputs: **industry** and **style**.

Briefs are produced by **Claude (Anthropic) with adaptive thinking + high effort** behind a Next.js server route. Generation takes ~20–40 seconds and is meaningfully better than templated output.

## Tech

- **Next.js 16** (App Router) + **React 18** + **TypeScript** + **Tailwind CSS**
- **Anthropic SDK** (`@anthropic-ai/sdk`) using `claude-sonnet-4-6` with structured JSON output
- No database, no auth — your API key is the only secret

## Folder structure

```
.
├── app/
│   ├── api/generate/route.ts   Server route — calls Claude
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                Single-page UI
├── components/
│   └── BriefDisplay.tsx        Rendered brief + copy-to-clipboard
├── lib/
│   └── generator.ts            Brief types + plain-text serializer
├── .env.example
├── next.config.js · tailwind.config.ts · tsconfig.json · package.json …
```

## Local setup

Requirements: Node.js 18.17+ (Node 20 LTS recommended) and an Anthropic API key.

```bash
# 1. Install
npm install

# 2. Add your key
cp .env.example .env.local
# then open .env.local and paste your real key after ANTHROPIC_API_KEY=
# Get a key: https://console.anthropic.com/settings/keys

# 3. Run
npm run dev
# open http://localhost:3000
```

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # next lint
```

## How a brief is generated

1. The user submits **industry** and **style**.
2. The browser POSTs `/api/generate`.
3. The server route calls Claude with:
   - **Model:** `claude-sonnet-4-6`
   - **Adaptive thinking** on — the model decides how much to reason per request
   - **Effort:** `high`
   - **Structured JSON output** — the response is constrained to the brief schema, so it's always parseable
   - A senior-brand-strategist system prompt that requires competitive-landscape analysis, category-tension identification, and a defensible point of difference before generating any output
4. The parsed JSON is returned and rendered.

To swap the model (Opus for max quality, Haiku for speed/cost), edit `app/api/generate/route.ts` and change the `model:` string. See model docs: <https://platform.claude.com/docs/en/about-claude/models/overview>.

## Deploying free on Vercel

Vercel's Hobby tier is free and fits this app — the server route is set to `maxDuration = 60` seconds, which Hobby allows.

### Deploy from GitHub

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and import the repo.
3. Framework preset is auto-detected as **Next.js**. Leave the defaults:
   - Build: `next build`
   - Output: `.next`
   - Install: `npm install`
4. **Add the environment variable:** in the import screen (or later under Project → Settings → Environment Variables) add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key
   - **Environments:** Production, Preview, Development
5. Click **Deploy**. You'll get a live URL in ~60 seconds.

Every push to your default branch redeploys to production; PRs get preview URLs.

### Deploy from your terminal

```bash
npm install -g vercel
vercel              # first-time: links the project, creates a preview
vercel env add ANTHROPIC_API_KEY    # paste the key, pick all environments
vercel --prod       # promote to production
```

## Costs

Each brief uses Sonnet 4.6: roughly 5–15K input tokens and 3–6K output tokens, including thinking. At list pricing that's typically **$0.05–$0.15 per brief**. Anthropic offers a small starting credit when you create an account.

To reduce cost: lower `effort` to `"medium"` in `app/api/generate/route.ts`, or switch the model to `claude-haiku-4-5`.

## Customizing the briefs

- **Change the brand-strategist persona / standards:** edit `SYSTEM_PROMPT` in `app/api/generate/route.ts`.
- **Add or remove fields:** update `Brief` and `briefToPlainText` in `lib/generator.ts`, update `BRIEF_SCHEMA` in the API route, and update `components/BriefDisplay.tsx` to render the new fields.
- **Add a new style:** add it to the `Style` union and `STYLES` array in `lib/generator.ts`. The dropdown reads from the same list.

## License

MIT.
