# Landing Page backup — NEW builder UI (no left sidebar)

**Source of truth:** `landing-page-graft-20260916` on the live server  
**Packaged:** 2026-10-09

This archive is the **current production landing-page feature**, not the older tree under `marketingautoaz.com` that still renders `<LandingPageBuilderSidebar>` on the left.

## How to verify you have the NEW UI

1. Open `apps/web/src/components/landing-pages/landing-page-builder.tsx`.
2. **Must contain** the comment: `Left sidebar removed` (Inspector rail on the right).
3. **Must NOT** import or render JSX `<LandingPageBuilderSidebar` in the main builder flow.

Quick check:

```bash
grep -F "Left sidebar removed" apps/web/src/components/landing-pages/landing-page-builder.tsx
grep -F "<LandingPageBuilderSidebar" apps/web/src/components/landing-pages/landing-page-builder.tsx && echo FAIL || echo OK
```

Note: `landing-page-builder-sidebar.tsx` may still exist as legacy/unused code; the builder must not mount it.

## Recent CSS / headline fix (included)

- `apps/web/src/components/landing-pages/landing-page-premium-visual-axis.ts` — headline color follows `[data-lp-inline-field="headline"]`, not only `h1`.
- `apps/web/src/app/globals.css` — canvas heading color uses inherit where applicable.

## Contents

| Path | Description |
|------|-------------|
| `apps/web/src/components/landing-pages/` | Builder, renderer, inspector, templates UI |
| `apps/web/src/app/(app)/landing-pages/` | App routes (list, builder, templates, analytics, …) |
| `apps/web/src/app/lp-host/` | Public host page |
| `apps/web/src/lib/landing-page-host.ts` | Host resolution helpers |
| `apps/web/src/middleware.ts` | `/lp-host` routing |
| `apps/api/src/landing-pages/` | NestJS API module |
| `packages/shared/src/landing-page-*.ts` | Shared types, templates, tokens |
| `packages/database/prisma/` | Landing-page schema excerpt + additive migration |
| `public/landing-pages/` | Template thumbnails & long previews (`/landing-pages/templates/*.webp`) |
| `data/` | PostgreSQL dumps (`.dump` custom format + `.sql.gz`) and JSON index/counts |

## Database restore (dev)

Tables: `landing_page_templates`, `landing_pages`, `landing_page_versions`, `landing_page_events`.

```bash
# Custom format
pg_restore -U marketingspa -d marketingspa --clean --if-exists data/landing_pages_tables_*.dump

# Or SQL
gunzip -c data/landing_pages_tables_*.sql.gz | psql -U marketingspa -d marketingspa
```

`data/landing_pages_index.json` — page metadata **without** full `draft_spec` / `published_spec` JSON blobs.

## Template images

Serve from Next `public/` at URLs like:

`/landing-pages/templates/{slug}-thumb.webp`

Copy `public/landing-pages/` into your app’s `apps/web/public/landing-pages/`.

## Not included (intentionally)

- `node_modules`, `.next`, `.env`, secrets, full monorepo

Restore into your Marketing SPA monorepo layout or merge paths manually.

---

**Server ZIP (same content):** `/var/www/marketingaut_usr/data/backups/landing-page-latest-20261009_222200.zip` (33M)
