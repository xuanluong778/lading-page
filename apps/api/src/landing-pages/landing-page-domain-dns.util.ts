import {
  buildLandingPageCustomDomainDnsRecords,
  type LandingPageDnsInstruction,
} from '@marketingspa/shared';
import {
  lookupCname,
  lookupTxt,
  normalizeSenderDomain,
  isValidSenderDomain,
} from '../email-marketing/email-domain-dns.util';
import { Resolver } from 'node:dns/promises';

/** Default CNAME/ALIAS target for MarketingAutoAZ landing pages. Override via env. */
export function landingPageCnameTarget(): string {
  const fromEnv = process.env.LANDING_PAGE_CNAME_TARGET?.trim().toLowerCase();
  return (fromEnv || 'lp-edge.marketingautoaz.com').replace(/\.$/, '');
}

/** A record target for apex custom domains. Override via env. */
export function landingPageARecordTarget(): string | null {
  const fromEnv = process.env.LANDING_PAGE_A_RECORD_TARGET?.trim();
  return fromEnv || null;
}

export function normalizeLandingCustomDomain(input: string): string {
  return normalizeSenderDomain(input);
}

export function isValidLandingCustomDomain(domain: string): boolean {
  return isValidSenderDomain(domain);
}

function publicResolver(): Resolver {
  const resolver = new Resolver();
  resolver.setServers(['8.8.8.8', '1.1.1.1']);
  return resolver;
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function lookupA(name: string): Promise<string[]> {
  const resolver = publicResolver();
  try {
    const rows = await withTimeout(resolver.resolve4(name), 5000, [] as string[]);
    return rows.filter(Boolean);
  } catch {
    return [];
  }
}

function cnameMatchesExpected(found: string[], expected: string): boolean {
  return found.some((v) => v === expected || v.endsWith(`.${expected}`));
}

export async function verifyLandingPageCname(domain: string): Promise<{
  ok: boolean;
  expected: string;
  found: string[];
  error?: string;
  method: 'CNAME';
}> {
  const expected = landingPageCnameTarget();
  const host = normalizeLandingCustomDomain(domain);
  if (!isValidLandingCustomDomain(host)) {
    return { ok: false, expected, found: [], error: 'Domain không hợp lệ', method: 'CNAME' };
  }
  const found = await lookupCname(host);
  const ok = cnameMatchesExpected(found, expected);
  return {
    ok,
    expected,
    found,
    error: ok ? undefined : `CNAME chưa trỏ tới ${expected}`,
    method: 'CNAME',
  };
}

function isApexDomain(domain: string): boolean {
  return domain.split('.').filter(Boolean).length === 2;
}

export async function verifyLandingPageDns(domain: string): Promise<{
  ok: boolean;
  expected: string;
  found: string[];
  error?: string;
  method: 'CNAME' | 'A' | 'ALIAS';
  aRecordTarget?: string | null;
}> {
  const host = normalizeLandingCustomDomain(domain);
  const cnameTarget = landingPageCnameTarget();
  const aTarget = landingPageARecordTarget();

  if (!isValidLandingCustomDomain(host)) {
    return {
      ok: false,
      expected: cnameTarget,
      found: [],
      error: 'Domain không hợp lệ',
      method: 'CNAME',
      aRecordTarget: aTarget,
    };
  }

  if (!isApexDomain(host)) {
    const cname = await verifyLandingPageCname(host);
    return { ...cname, aRecordTarget: aTarget };
  }

  const aFound = await lookupA(host);
  if (aTarget && aFound.includes(aTarget)) {
    return {
      ok: true,
      expected: aTarget,
      found: aFound,
      method: 'A',
      aRecordTarget: aTarget,
    };
  }

  const cnameFound = await lookupCname(host);
  if (cnameMatchesExpected(cnameFound, cnameTarget)) {
    return {
      ok: true,
      expected: cnameTarget,
      found: cnameFound,
      method: 'ALIAS',
      aRecordTarget: aTarget,
    };
  }

  // Some apex domains expose flattened CNAME via TXT/ALIAS — accept A if any found matches cname target IPs
  const edgeIps = await lookupA(cnameTarget);
  if (edgeIps.length && aFound.some((ip) => edgeIps.includes(ip))) {
    return {
      ok: true,
      expected: cnameTarget,
      found: aFound,
      method: 'A',
      aRecordTarget: aTarget,
    };
  }

  const expectedHint = aTarget
    ? `A @ → ${aTarget} hoặc ALIAS/CNAME @ → ${cnameTarget}`
    : `ALIAS/CNAME @ → ${cnameTarget}`;
  return {
    ok: false,
    expected: aTarget || cnameTarget,
    found: [...aFound, ...cnameFound],
    error: `DNS apex chưa đúng — cần ${expectedHint}`,
    method: isApexDomain(host) ? 'A' : 'CNAME',
    aRecordTarget: aTarget,
  };
}

export function landingPageDnsInstructions(domain: string): LandingPageDnsInstruction[] {
  return buildLandingPageCustomDomainDnsRecords({
    domain: normalizeLandingCustomDomain(domain),
    cnameTarget: landingPageCnameTarget(),
    aRecordTarget: landingPageARecordTarget(),
  });
}

/** Reserved for future SSL provisioning checks. */
export async function lookupDomainTxt(name: string): Promise<string[]> {
  return lookupTxt(name);
}
