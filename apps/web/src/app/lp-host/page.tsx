import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  PublicLandingPageClient,
  type PublicLandingPayload,
} from '@/components/landing-pages/public-landing-page-client';

export const revalidate = 60;

function apiBase(): string {
  const raw =
    process.env.LANDING_PAGE_API_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    'http://127.0.0.1:4010';
  return raw.replace(/\/$/, '');
}

async function fetchByHost(host: string): Promise<PublicLandingPayload | null> {
  try {
    const res = await fetch(
      `${apiBase()}/api/v1/landing-pages/public/resolve-host?host=${encodeURIComponent(host)}`,
      { next: { revalidate: 60, tags: [`lp-host-${host}`] } },
    );
    if (!res.ok) return null;
    return (await res.json()) as PublicLandingPayload;
  } catch {
    return null;
  }
}

function readRequestHost(h: Headers): string {
  return (
    h.get('x-lp-host')?.trim() ||
    h.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    h.get('host') ||
    ''
  )
    .replace(/:\d+$/, '')
    .toLowerCase();
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = readRequestHost(h);
  const data = host ? await fetchByHost(host) : null;
  if (!data) {
    return { title: 'Landing page', robots: { index: false, follow: false } };
  }
  const title = data.seo.title || data.name;
  const description = data.seo.description || '';
  const indexable = data.seo.robotsIndex !== false;
  const canonical = data.seo.canonical || (host ? `https://${host}` : undefined);
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'website',
      ...(data.seo.ogImage ? { images: [{ url: data.seo.ogImage }] } : {}),
    },
  };
}

/** Host-based public landing page — auto subdomain or verified custom domain. */
export default async function LandingPageHostRoute() {
  const h = await headers();
  const host = readRequestHost(h);
  if (!host) notFound();

  const data = await fetchByHost(host);
  if (!data) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.seo.title || data.name,
    description: data.seo.description || undefined,
    url: data.seo.canonical || `https://${host}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicLandingPageClient initial={data} />
    </>
  );
}
