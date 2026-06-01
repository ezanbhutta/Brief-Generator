# Catalog directory

Each industry gets one JSON file: `data/catalog/<industry-key>.json`.

Schema:
```json
{
  "industry": "<industry-key>",
  "aliases": ["optional", "extra", "aliases"],
  "briefs": {
    "Modern": [ { brief object }, { brief object }, ... ],
    "Luxury": [ ... ],
    "Minimal": [ ... ],
    "Corporate": [ ... ],
    "Creative": [ ... ]
  }
}
```

Industry keys must match those in `lib/industries.ts`.
Brief object schema is defined in `lib/generator.ts` (interface `Brief`).
