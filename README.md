# MarketingAutoAZ — Landing Page feature (extracted backup)

This repository is a **source snapshot** of the Landing Page feature from the MarketingAutoAZ monorepo. It is intended for backup, review, and migration — **not** as a standalone runnable app.

## Source of truth (this backup)

- **Release tree:** `/var/www/marketingaut_usr/data/releases/landing-page-graft-20260916/` (live production graft)
- **Builder UI:** **NEW** layout — **no left sidebar**; Layers / Theme / Add / AI live on the **right Inspector rail** (+ Thành phần / Thiết kế tổng thể).

### Do **not** use the old builder UI

An earlier commit in this repo was extracted from `/var/www/marketingaut_usr/data/www/marketingautoaz.com`, which still renders `<LandingPageBuilderSidebar` (legacy left sidebar). **That tree is not the current builder.** Always sync from the graft release above.

### How to verify you have the new UI

In `apps/web/src/components/landing-pages/landing-page-builder.tsx`:

1. There must **not** be a JSX render of `<LandingPageBuilderSidebar`.
2. There **must** be a comment like: `Left sidebar removed — Layers / Theme / Add / AI live on right Inspector rail`.

Quick check:

```bash
grep -n 'Left sidebar removed' apps/web/src/components/landing-pages/landing-page-builder.tsx
! grep -n '<LandingPageBuilderSidebar' apps/web/src/components/landing-pages/landing-page-builder.tsx
```

## What is included

| Area | Monorepo path |
|------|----------------|
| Builder UI & renderer | `apps/web/src/components/landing-pages/**` |
| App routes (dashboard) | `apps/web/src/app/(app)/landing-pages/**` |
| Public subdomain host | `apps/web/src/app/lp-host/**`, `apps/web/src/lib/landing-page-host.ts`, `apps/web/src/middleware.ts` (LP host rewrite) |
| REST API | `apps/api/src/landing-pages/**` |
| Shared types/templates | `packages/shared/src/landing-page-*.ts` (+ `index.ts` exports reference) |
| DB | `packages/database/prisma/migrations/20260916130000_landing_page_additive/`, `schema-landing-pages.excerpt.prisma` |
| DB/json backup | `data/landing-page-backup-20261007_151018/` (JSON + SQL; uploads excluded) |
| Wiring hints | `docs/monorepo-integration/*.snippet` |

## What is **not** included (still required to run)

- Full monorepo: `package.json`, workspace config, other apps/packages
- Environment secrets (`.env` — never commit)
- `node_modules`, `.next`, production uploads (large media under backup `uploads/` omitted)
- Unrelated Prisma models — only LP-related excerpt + additive migration

## Restore / develop

1. Clone the full MarketingAutoAZ monorepo and merge these paths on top (or use as reference).
2. Register `LandingPagesModule` in `apps/api/src/app.module.ts` (see snippet).
3. Add nav entries in `apps/web/src/config/navigation.ts` (see snippet).
4. Apply Prisma migration or use SQL/JSON under `data/` per `RESTORE.md`.

## Public assets

There is no dedicated `apps/web/public/landing-pages/` tree in the monorepo; LP assets are stored in DB/spec and optional backup uploads (excluded here due to size).
