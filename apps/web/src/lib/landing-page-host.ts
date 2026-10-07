/** Edge-safe host parser — keep in sync with packages/shared/src/landing-page-domain.ts */

const RESERVED = new Set([
  'www',
  'api',
  'dev',
  'app',
  'admin',
  'mail',
  'smtp',
  'ftp',
  'lp',
  'lp-edge',
  'edge',
  'cdn',
  'static',
  'assets',
  'staging',
  'test',
  'demo',
  'marketingautoaz',
]);

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function subdomainBase(): string {
  return (process.env.NEXT_PUBLIC_LP_SUBDOMAIN_BASE || 'marketingautoaz.com')
    .trim()
    .toLowerCase()
    .replace(/\.$/, '');
}

function appHosts(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_LP_APP_HOSTS?.trim();
  const base = subdomainBase();
  const defaults = [base, `www.${base}`, 'dev.marketingautoaz.com', 'localhost', '127.0.0.1'];
  if (!fromEnv) return defaults;
  return fromEnv.split(',').map((h) => h.trim().toLowerCase()).filter(Boolean);
}

export type LandingPageHostKind =
  | { kind: 'app' }
  | { kind: 'subdomain'; subdomainSlug: string }
  | { kind: 'custom'; domain: string };

export function parseLandingPageRequestHost(host: string): LandingPageHostKind {
  let normalized = host.trim().toLowerCase();
  normalized = normalized.replace(/:\d+$/, '').replace(/\.$/, '');
  if (!normalized) return { kind: 'app' };
  if (appHosts().includes(normalized)) return { kind: 'app' };

  const base = subdomainBase();
  if (normalized === base) return { kind: 'app' };
  if (normalized.endsWith(`.${base}`)) {
    const subdomainSlug = normalized.slice(0, -(base.length + 1));
    if (
      subdomainSlug &&
      !subdomainSlug.includes('.') &&
      SLUG_RE.test(subdomainSlug) &&
      !RESERVED.has(subdomainSlug)
    ) {
      return { kind: 'subdomain', subdomainSlug };
    }
    return { kind: 'app' };
  }

  return { kind: 'custom', domain: normalized };
}
