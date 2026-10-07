# MarketingAutoAZ — Landing Page feature (extracted backup)

This repository is a **source snapshot** of the Landing Page feature extracted from the MarketingAutoAZ monorepo on the VPS (`marketingautoaz.com`). It is intended for backup, review, and migration — **not** as a standalone runnable app.

## Origin

- Monorepo root: `/var/www/marketingaut_usr/data/www/marketingautoaz.com`
- Paths below mirror the monorepo layout so you can copy files back or diff against `main`.

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
- `node_modules`, production uploads (large media under backup `uploads/` omitted)
- Unrelated Prisma models — only LP-related excerpt + additive migration

## Restore / develop

1. Clone the full MarketingAutoAZ monorepo and merge these paths on top (or use as reference).
2. Register `LandingPagesModule` in `apps/api/src/app.module.ts` (see snippet).
3. Add nav entries in `apps/web/src/config/navigation.ts` (see snippet).
4. Apply Prisma migration or use SQL/JSON under `data/` per `RESTORE.md`.

## Public assets

There is no dedicated `apps/web/public/landing-pages/` tree in the monorepo; LP assets are stored in DB/spec and optional backup uploads (excluded here due to size).
