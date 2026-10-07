import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_HTTP = 'msa_ref';
const COOKIE_JS = 'msa_ref_js';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const APP_HOSTS = new Set([
  'marketingautoaz.com',
  'www.marketingautoaz.com',
  'localhost',
  '127.0.0.1',
]);
const RESERVED_LP_SLUGS = new Set([
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

/**
 * Chỉ rewrite subdomain landing (slug.marketingautoaz.com).
 * Apex, www, localhost và mọi host khác giữ routing hiện tại.
 * Không import shared barrel — tránh kéo Node API vào middleware.
 */
function shouldRouteLandingPageHost(hostname: string, pathname: string): boolean {
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/lp-host') ||
    pathname === '/favicon.ico'
  ) {
    return false;
  }
  const host = hostname.trim().toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
  if (!host || APP_HOSTS.has(host)) return false;
  const base = 'marketingautoaz.com';
  if (!host.endsWith(`.${base}`)) return false;
  const slug = host.slice(0, -(base.length + 1));
  if (!slug || slug.includes('.') || RESERVED_LP_SLUGS.has(slug)) return false;
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(slug);
}

/** Lưu ?ref=CODE cookie 30 ngày (HttpOnly + JS mirror) — SameSite=Lax, Secure trên HTTPS */
export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  if (shouldRouteLandingPageHost(hostname, request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/lp-host';
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-lp-host', hostname);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const ref = request.nextUrl.searchParams.get('ref')?.trim().toUpperCase();
  const res = NextResponse.next();
  if (ref && /^[A-Z0-9]{4,32}$/.test(ref)) {
    const secure = request.nextUrl.protocol === 'https:';
    const host = request.nextUrl.hostname;
    // Host-only cookie cho apex; thêm Domain=.example.com nếu vào qua www
    const cookieDomain = host.startsWith('www.') ? `.${host.slice(4)}` : undefined;
    const common = {
      sameSite: 'lax' as const,
      secure,
      path: '/',
      maxAge: MAX_AGE,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    res.cookies.set(COOKIE_HTTP, ref, { ...common, httpOnly: true });
    // Mirror đọc được từ JS / gửi X-Affiliate-Ref khi HttpOnly không tới API
    res.cookies.set(COOKIE_JS, ref, { ...common, httpOnly: false });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
