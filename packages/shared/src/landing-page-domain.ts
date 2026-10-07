/** Landing Page domain routing — auto subdomain + custom domain helpers. */

const SUBDOMAIN_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export const LANDING_PAGE_RESERVED_SUBDOMAIN_SLUGS = new Set([
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

export function landingPageSubdomainBase(): string {
  const fromEnv = process.env.LANDING_PAGE_SUBDOMAIN_BASE?.trim().toLowerCase();
  return (fromEnv || 'marketingautoaz.com').replace(/\.$/, '');
}

export function landingPageAppHosts(): string[] {
  const fromEnv = process.env.LANDING_PAGE_APP_HOSTS?.trim();
  const base = landingPageSubdomainBase();
  const defaults = [base, `www.${base}`, 'dev.marketingautoaz.com', 'localhost', '127.0.0.1'];
  if (!fromEnv) return defaults;
  return fromEnv
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeLandingPageHost(host: string): string {
  let value = host.trim().toLowerCase();
  value = value.replace(/:\d+$/, '');
  value = value.replace(/\.$/, '');
  return value;
}

export function isReservedSubdomainSlug(slug: string): boolean {
  return LANDING_PAGE_RESERVED_SUBDOMAIN_SLUGS.has(slug.trim().toLowerCase());
}

export function isValidLandingPageSubdomainSlug(slug: string): boolean {
  const v = slug.trim().toLowerCase();
  return SUBDOMAIN_SLUG_RE.test(v) && !isReservedSubdomainSlug(v);
}

export function buildLandingPageSubdomainHost(subdomainSlug: string): string | null {
  const slug = subdomainSlug.trim().toLowerCase();
  if (!isValidLandingPageSubdomainSlug(slug)) return null;
  return `${slug}.${landingPageSubdomainBase()}`;
}

export function buildLandingPageSubdomainUrl(
  subdomainSlug: string,
  protocol: 'http' | 'https' = 'https',
): string | null {
  const host = buildLandingPageSubdomainHost(subdomainSlug);
  return host ? `${protocol}://${host}` : null;
}

export type LandingPageHostResolution =
  | { kind: 'app' }
  | { kind: 'subdomain'; subdomainSlug: string }
  | { kind: 'custom'; domain: string };

export function parseLandingPageHost(host: string): LandingPageHostResolution {
  const normalized = normalizeLandingPageHost(host);
  if (!normalized) return { kind: 'app' };

  const appHosts = landingPageAppHosts();
  if (appHosts.includes(normalized)) return { kind: 'app' };

  const base = landingPageSubdomainBase();
  if (normalized === base || normalized.endsWith(`.${base}`)) {
    if (normalized === base) return { kind: 'app' };
    const subdomainSlug = normalized.slice(0, -(base.length + 1));
    if (
      subdomainSlug &&
      !subdomainSlug.includes('.') &&
      isValidLandingPageSubdomainSlug(subdomainSlug)
    ) {
      return { kind: 'subdomain', subdomainSlug };
    }
    return { kind: 'app' };
  }

  return { kind: 'custom', domain: normalized };
}

/** UI label: ACTIVE → VERIFIED for custom domain status. */
export function landingPageCustomDomainStatusLabel(status: string | null | undefined): string {
  switch (status) {
    case 'ACTIVE':
      return 'VERIFIED';
    case 'VERIFYING':
      return 'PENDING';
    case 'PENDING':
      return 'PENDING';
    case 'FAILED':
      return 'FAILED';
    default:
      return 'NONE';
  }
}

export type LandingPageDnsInstruction = {
  type: 'CNAME' | 'A' | 'ALIAS';
  host: string;
  value: string;
  hint: string;
};

export function buildLandingPageCustomDomainDnsRecords(input: {
  domain: string;
  cnameTarget: string;
  aRecordTarget?: string | null;
}): LandingPageDnsInstruction[] {
  const domain = input.domain.trim().toLowerCase().replace(/\.$/, '');
  const cnameTarget = input.cnameTarget.trim().toLowerCase().replace(/\.$/, '');
  const parts = domain.split('.');
  const isApex = parts.length === 2;
  const records: LandingPageDnsInstruction[] = [];

  if (isApex) {
    if (input.aRecordTarget?.trim()) {
      records.push({
        type: 'A',
        host: '@',
        value: input.aRecordTarget.trim(),
        hint: 'Trỏ apex domain (khachhang.com) tới IP edge server.',
      });
    }
    records.push({
      type: 'ALIAS',
      host: '@',
      value: cnameTarget,
      hint: 'Nếu DNS hỗ trợ ALIAS/ANAME hoặc Cloudflare CNAME flattening, trỏ apex tới target này.',
    });
    records.push({
      type: 'CNAME',
      host: 'www',
      value: cnameTarget,
      hint: 'Khuyến nghị: www trỏ CNAME tới edge target.',
    });
    return records;
  }

  const label = parts[0] || 'landing';
  records.push({
    type: 'CNAME',
    host: label,
    value: cnameTarget,
    hint: `Trỏ ${domain} (CNAME) tới edge target — ví dụ landing.khachhang.com.`,
  });
  return records;
}
