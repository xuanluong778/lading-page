# Restore Landing Page tab database

Portable backup of PostgreSQL tables:
- `landing_page_templates`
- `landing_pages`
- `landing_page_versions`
- `landing_page_events`

**Requirements:** Docker, a running Postgres container (default name `marketingspa-postgres-dev`), database `marketingspa`, user `marketingspa`. FK to `organizations` must exist before loading `landing_pages`.

---

## Linux / macOS (bash)

```bash
BACKUP_DIR="./landing-page-YYYYMMDD_HHMMSS"   # extracted folder
CONTAINER=marketingspa-postgres-dev

# Option A — custom format (recommended)
docker cp "$BACKUP_DIR/sql/landing_pages.dump" "$CONTAINER:/tmp/landing_pages.dump"
docker exec -i "$CONTAINER" pg_restore -U marketingspa -d marketingspa \
  --clean --if-exists --no-owner --no-acl /tmp/landing_pages.dump
docker exec "$CONTAINER" rm -f /tmp/landing_pages.dump

# Option B — plain SQL (schema + data)
gunzip -c "$BACKUP_DIR/sql/landing_pages_full.sql.gz" | \
  docker exec -i "$CONTAINER" psql -U marketingspa -d marketingspa

# Option C — data only (schema already migrated via Prisma)
docker exec -i "$CONTAINER" psql -U marketingspa -d marketingspa <<'SQL'
TRUNCATE landing_page_events, landing_page_versions, landing_pages, landing_page_templates RESTART IDENTITY CASCADE;
SQL
gunzip -c "$BACKUP_DIR/sql/landing_pages_data_only.sql.gz" | \
  docker exec -i "$CONTAINER" psql -U marketingspa -d marketingspa
```

Verify:

```bash
docker exec -i "$CONTAINER" psql -U marketingspa -d marketingspa -c "
SELECT 'templates', count(*) FROM landing_page_templates
UNION ALL SELECT 'pages', count(*) FROM landing_pages
UNION ALL SELECT 'versions', count(*) FROM landing_page_versions
UNION ALL SELECT 'events', count(*) FROM landing_page_events;"
cat "$BACKUP_DIR/meta/counts.txt"
```

---

## Windows (PowerShell)

Adjust `$BackupDir`, `$Container`, and paths to your extracted backup folder.

```powershell
$BackupDir = "$env:USERPROFILE\Downloads\landing-page-YYYYMMDD_HHMMSS"
$Container = "marketingspa-postgres-dev"

# Option A — pg_restore (custom dump)
docker cp "$BackupDir\sql\landing_pages.dump" "${Container}:/tmp/landing_pages.dump"
docker exec -i $Container pg_restore -U marketingspa -d marketingspa `
  --clean --if-exists --no-owner --no-acl /tmp/landing_pages.dump
docker exec $Container rm -f /tmp/landing_pages.dump

# Option B — full SQL
cmd /c "gzip -dc `"$BackupDir\sql\landing_pages_full.sql.gz`" | docker exec -i $Container psql -U marketingspa -d marketingspa"
# If gzip is unavailable, use WSL: wsl gunzip -c ... | docker exec -i ...

# Option C — data only after TRUNCATE
@"
TRUNCATE landing_page_events, landing_page_versions, landing_pages, landing_page_templates RESTART IDENTITY CASCADE;
"@ | docker exec -i $Container psql -U marketingspa -d marketingspa
cmd /c "gzip -dc `"$BackupDir\sql\landing_pages_data_only.sql.gz`" | docker exec -i $Container psql -U marketingspa -d marketingspa"
```

**Dev stack port:** host Postgres is usually `127.0.0.1:5434` when using project `docker-compose` (`DEV_POSTGRES_PORT=5434` on Windows before `pnpm dev`).

---

## Assets (images)

- System template images: `apps/web/public/landing-pages/` in the MarketingAutoAZ repo.
- User-uploaded media referenced in `draft_spec` / `published_spec` (e.g. `/uploads/...`) are included in this backup as `uploads/uploads.tar.gz` (same tree as `uploads/` on the server project root).

### Restore uploads (Linux / macOS)

From the **extracted backup folder**, with `PROJECT` set to your app root (e.g. `/var/www/.../marketingautoaz.com` or local clone):

```bash
BACKUP_DIR="./landing-page-YYYYMMDD_HHMMSS"   # extracted folder
PROJECT="/path/to/marketingautoaz.com"

# Extract so PROJECT/uploads/ is created (archive paths are uploads/...)
tar -xzf "$BACKUP_DIR/uploads/uploads.tar.gz" -C "$PROJECT"

# Optional: verify size
du -sh "$PROJECT/uploads"
```

### Restore uploads (Windows PowerShell)

```powershell
$BackupDir = "$env:USERPROFILE\Downloads\landing-page-YYYYMMDD_HHMMSS"
$Project   = "C:\path\to\marketingautoaz.com"

tar -xzf "$BackupDir\uploads\uploads.tar.gz" -C $Project
# Requires tar (Windows 10+ built-in) or use WSL with the same command.
```

**Standalone uploads archive:** you can also use `uploads-YYYYMMDD_HHMMSS.tar.gz` from the backups folder; extract with the same `-C $Project` / `-C "$PROJECT"` so files land in `Project\uploads\` or `PROJECT/uploads/`.
