'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { apiClient } from '@/lib/api-client';
import { useT } from '@/i18n/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DnsInstruction = {
  type: 'CNAME' | 'A' | 'ALIAS';
  host: string;
  value: string;
  hint: string;
};

type DomainRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  subdomainSlug: string | null;
  subdomainHost: string | null;
  subdomainUrl: string | null;
  customDomain: string | null;
  customDomainStatus: string | null;
  customDomainStatusLabel: string;
  customDomainUrl: string | null;
  customDomainError: string | null;
  customDomainVerifiedAt?: string | null;
  dnsInstructions?: DnsInstruction[];
};

type Architecture = {
  subdomainBase?: string;
  defaultSubdomain?: string;
  cnameTarget?: string;
  aRecordTarget?: string | null;
  customDomain?: string;
  statuses?: string[];
};

function statusClass(label: string) {
  if (label === 'VERIFIED' || label === 'ACTIVE') return 'text-emerald-300';
  if (label === 'FAILED') return 'text-red-300';
  if (label === 'PENDING') return 'text-amber-200';
  return 'text-zinc-400';
}

export default function LandingPagesDomainPage() {
  const t = useT();
  const [items, setItems] = useState<DomainRow[]>([]);
  const [architecture, setArchitecture] = useState<Architecture | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [domain, setDomain] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState('');

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) || null,
    [items, selectedId],
  );

  async function reload(keepSelection = true) {
    const res = await apiClient<{ items: DomainRow[]; architecture: Architecture }>(
      '/landing-pages/domains',
    );
    setItems(res.items);
    setArchitecture(res.architecture);
    if (!keepSelection || !selectedId) {
      if (res.items[0]) setSelectedId(res.items[0].id);
    }
  }

  useEffect(() => {
    void reload(false).catch((e) => setMsg(e instanceof Error ? e.message : 'Error'));
  }, []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMsg(`Đã copy: ${text}`);
    } catch {
      setMsg('Không copy được — chọn text và copy thủ công');
    }
  }

  async function saveDomain() {
    if (!selectedId || !domain.trim()) return;
    setBusy('save');
    try {
      await apiClient(`/landing-pages/${selectedId}/domain`, {
        method: 'POST',
        body: JSON.stringify({ customDomain: domain.trim() }),
      });
      setMsg('Đã lưu domain (PENDING) — thêm DNS rồi bấm Verify');
      setDomain('');
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi gắn domain');
    } finally {
      setBusy('');
    }
  }

  async function verify() {
    if (!selectedId) return;
    setBusy('verify');
    try {
      const res = await apiClient<{
        page: DomainRow;
        dns: { ok: boolean; expected: string; found: string[]; error?: string; method?: string };
      }>(`/landing-pages/${selectedId}/domain/verify`, { method: 'POST', body: '{}' });
      setMsg(
        res.dns.ok
          ? `VERIFIED — ${res.dns.method || 'DNS'} OK → ${res.dns.expected}`
          : `FAILED — ${res.dns.error || 'DNS mismatch'} (found: ${res.dns.found.join(', ') || 'none'})`,
      );
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Verify thất bại');
    } finally {
      setBusy('');
    }
  }

  async function removeDomain() {
    if (!selectedId || !selected?.customDomain) return;
    setBusy('remove');
    try {
      await apiClient(`/landing-pages/${selectedId}/domain`, { method: 'DELETE' });
      setMsg('Đã gỡ custom domain');
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Không gỡ được domain');
    } finally {
      setBusy('');
    }
  }

  const subdomainLive = selected?.status === 'PUBLISHED';

  return (
    <div className="space-y-4">
      <PageHeader title={t('landingPages.domain')} description={t('landingPages.domainDesc')} />

      {architecture ? (
        <div className="rounded-lg border border-white/10 p-3 text-sm opacity-80">
          <div>Auto subdomain: {architecture.defaultSubdomain}</div>
          <div className="mt-1">Custom DNS: {architecture.customDomain}</div>
          {architecture.cnameTarget ? (
            <div className="mt-1">CNAME target: {architecture.cnameTarget}</div>
          ) : null}
          {architecture.aRecordTarget ? (
            <div className="mt-1">A record IP: {architecture.aRecordTarget}</div>
          ) : null}
        </div>
      ) : null}

      <div className="flex max-w-3xl flex-col gap-2 sm:flex-row sm:flex-wrap">
        <select
          className="lp-dark-select w-full rounded-md border border-white/10 bg-zinc-900 px-2 py-2 text-sm text-white sm:w-auto"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.status})
            </option>
          ))}
        </select>
        <Input
          className="w-full sm:max-w-xs"
          placeholder="landing.khachhang.com hoặc khachhang.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button disabled={busy === 'save'} onClick={() => void saveDomain()}>
            Add domain
          </Button>
          <Button variant="outline" disabled={busy === 'verify'} onClick={() => void verify()}>
            Verify DNS
          </Button>
          <Button variant="outline" disabled={busy === 'remove' || !selected?.customDomain} onClick={() => void removeDomain()}>
            Remove
          </Button>
        </div>
      </div>

      {msg ? <p className="text-sm opacity-70">{msg}</p> : null}

      {selected ? (
        <section className="grid gap-3 lg:grid-cols-2">
          <article className="rounded-lg border border-white/10 p-4 text-sm">
            <h2 className="font-medium">Auto subdomain</h2>
            <p className="mt-2 break-all opacity-80">
              {selected.subdomainHost || '—'}
            </p>
            <p className={`mt-1 text-xs ${subdomainLive ? 'text-emerald-300' : 'text-amber-200'}`}>
              {subdomainLive
                ? 'Published — subdomain public khi DNS wildcard đã trỏ vào server.'
                : 'Draft / chưa publish — subdomain không public.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!selected.subdomainUrl}
                onClick={() => void copy(selected.subdomainUrl || '')}
              >
                Copy
              </Button>
              {selected.subdomainUrl && subdomainLive ? (
                <a
                  className="inline-flex items-center rounded-md border border-white/15 px-3 py-1 text-xs"
                  href={selected.subdomainUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              ) : null}
              <a
                className="inline-flex items-center text-xs underline opacity-70"
                href={`/p/${selected.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                /p/{selected.slug}
              </a>
            </div>
          </article>

          <article className="rounded-lg border border-white/10 p-4 text-sm">
            <h2 className="font-medium">Custom domain</h2>
            <p className="mt-2 break-all">
              {selected.customDomain || 'Chưa gắn'}
              <span className={`ml-2 text-xs font-medium ${statusClass(selected.customDomainStatusLabel)}`}>
                {selected.customDomainStatusLabel || 'NONE'}
              </span>
            </p>
            {selected.customDomainError ? (
              <p className="mt-1 text-xs text-red-300">{selected.customDomainError}</p>
            ) : null}
            <p className="mt-1 text-xs opacity-60">
              Chỉ VERIFIED + Published mới public. Tenant khác không claim được domain đã dùng.
            </p>
            {selected.customDomainUrl ? (
              <a
                className="mt-2 inline-flex text-xs underline"
                href={selected.customDomainUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open custom domain
              </a>
            ) : null}
          </article>
        </section>
      ) : null}

      {selected?.dnsInstructions?.length ? (
        <>
          <section className="space-y-2 sm:hidden">
            {selected.dnsInstructions.map((row, i) => (
              <article
                key={`${row.type}-${row.host}-${i}`}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{row.type}</span>
                  <span className="text-xs opacity-60">Host: {row.host}</span>
                </div>
                <button
                  type="button"
                  className="mt-1 break-all text-left text-xs underline"
                  onClick={() => void copy(row.value)}
                >
                  {row.value}
                </button>
                {row.hint ? <p className="mt-1 text-xs opacity-70">{row.hint}</p> : null}
              </article>
            ))}
          </section>
          <section className="hidden overflow-x-auto rounded-lg border border-white/10 sm:block">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase opacity-60">
                <tr>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Host</th>
                  <th className="px-3 py-2">Value</th>
                  <th className="px-3 py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {selected.dnsInstructions.map((row, i) => (
                  <tr key={`${row.type}-${row.host}-${i}`} className="border-b border-white/5">
                    <td className="px-3 py-2 font-medium">{row.type}</td>
                    <td className="px-3 py-2">{row.host}</td>
                    <td className="px-3 py-2">
                      <button
                        className="break-all text-left underline"
                        onClick={() => void copy(row.value)}
                      >
                        {row.value}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-xs opacity-70">{row.hint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}

      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className="rounded-lg border border-white/10 px-3 py-2 text-sm">
            <button className="text-left font-medium" onClick={() => setSelectedId(i.id)}>
              {i.name}
            </button>
            <div className="break-all text-xs opacity-60">
              {i.subdomainHost || 'no subdomain'} · custom: {i.customDomain || '—'} ·{' '}
              <span className={statusClass(i.customDomainStatusLabel)}>{i.customDomainStatusLabel}</span>
              {i.customDomainError ? ` · ${i.customDomainError}` : ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
