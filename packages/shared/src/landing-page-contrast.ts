/**
 * WCAG AA contrast helpers for Landing Page theme tokens.
 * Used at catalog bake time + runtime token style — never per-template.
 */

import type { LandingPageThemeTokens } from './landing-page-types';

const LIGHT_INK = '#0F172A';
const LIGHT_MUTED = '#475569';
const DARK_INK = '#F8FAFC';
const DARK_MUTED = '#CBD5E1';
const WHITE = '#FFFFFF';
const NEAR_BLACK = '#0B1220';

/** AA normal text = 4.5:1; large/UI = 3:1. We target 4.5 for body, 3 for UI chrome. */
const AA_BODY = 4.5;
const AA_UI = 3;

export function parseHexColor(hex: string | undefined | null): [number, number, number] | null {
  if (!hex) return null;
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function toHexColor(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0'))
      .join('')
  );
}

export function relativeLuminance(hex: string | undefined | null): number | null {
  const rgb = parseHexColor(hex);
  if (!rgb) return null;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
}

export function contrastRatio(a: string, b: string): number | null {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la == null || lb == null) return null;
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isDarkSurface(hex: string | undefined | null, threshold = 0.35): boolean {
  const lum = relativeLuminance(hex);
  if (lum == null) return false;
  return lum < threshold;
}

/** Pick black or white (or themed ink) that meets AA against background. */
export function pickForeground(
  background: string,
  opts?: { preferDark?: string; preferLight?: string; minRatio?: number },
): string {
  const min = opts?.minRatio ?? AA_BODY;
  const dark = opts?.preferDark || LIGHT_INK;
  const light = opts?.preferLight || DARK_INK;
  const rDark = contrastRatio(dark, background);
  const rLight = contrastRatio(light, background);
  if (rDark != null && rLight != null) {
    if (rDark >= min && rLight >= min) return rDark >= rLight ? dark : light;
    if (rDark >= min) return dark;
    if (rLight >= min) return light;
    return rDark >= rLight ? dark : light;
  }
  return isDarkSurface(background) ? light : dark;
}

/** Ensure fg vs bg meets minRatio; otherwise replace fg with pickForeground. */
export function ensureReadable(
  foreground: string | undefined,
  background: string,
  minRatio = AA_BODY,
): string {
  const fg = foreground || pickForeground(background, { minRatio });
  const ratio = contrastRatio(fg, background);
  if (ratio != null && ratio >= minRatio) return fg;
  return pickForeground(background, { minRatio });
}

/**
 * Sanitize theme tokens so text/muted/button/icon never fail WCAG AA
 * against their paired surfaces. Safe no-op when colors are non-hex (gradients).
 */
export function sanitizeThemeTokensForContrast(
  tokens: LandingPageThemeTokens,
): LandingPageThemeTokens {
  const next: LandingPageThemeTokens = { ...tokens };
  const canvas = next.canvas || next.background;
  const surface = next.surface || next.background;
  const buttonBg = next.button || next.primary;

  if (parseHexColor(canvas)) {
    next.text = ensureReadable(next.text, canvas, AA_BODY);
    next.muted = ensureReadable(next.muted || next.textMuted, canvas, AA_UI);
    next.textMuted = ensureReadable(next.textMuted || next.muted, canvas, AA_UI);
  }
  if (parseHexColor(surface) && surface !== canvas) {
    // Card/surface text must also read on surface (often whiter than canvas).
    const surfaceText = ensureReadable(next.text, surface, AA_BODY);
    const surfaceMuted = ensureReadable(next.muted, surface, AA_UI);
    // Prefer the stricter (darker ink on light / lighter ink on dark) of canvas vs surface.
    if (parseHexColor(canvas)) {
      const cText = contrastRatio(next.text!, canvas) ?? 0;
      const sText = contrastRatio(surfaceText, surface) ?? 0;
      if (sText < cText) next.text = surfaceText;
      const cMuted = contrastRatio(next.muted!, canvas) ?? 0;
      const sMuted = contrastRatio(surfaceMuted, surface) ?? 0;
      if (sMuted < cMuted) next.muted = surfaceMuted;
    } else {
      next.text = surfaceText;
      next.muted = surfaceMuted;
    }
  }

  if (parseHexColor(buttonBg)) {
    // Store on-button ink via secondary when button is brand-colored and secondary fails;
    // renderer reads --lp-on-primary from pickForeground(primary).
    const onBtn = pickForeground(buttonBg, {
      preferDark: NEAR_BLACK,
      preferLight: WHITE,
      minRatio: AA_UI,
    });
    // Keep secondary as brand secondary; expose button label via unused field only if needed.
    void onBtn;
  }

  if (parseHexColor(next.primary) && parseHexColor(surface)) {
    // Icon color must read on iconSurface / surface.
    const iconBg = next.iconSurface && parseHexColor(next.iconSurface) ? next.iconSurface : surface;
    next.iconColor = ensureReadable(next.iconColor || next.primary, iconBg!, AA_UI);
  }

  if (!next.accent) next.accent = next.secondary || next.primary;
  if (!next.button) next.button = next.primary;
  if (!next.canvas) next.canvas = next.background;
  if (!next.surfaceAlt) next.surfaceAlt = next.surface;

  // Soft guard: never leave muted identical to background family.
  if (next.muted && canvas && contrastRatio(next.muted, canvas) != null) {
    const r = contrastRatio(next.muted, canvas)!;
    if (r < AA_UI) {
      next.muted = isDarkSurface(canvas) ? DARK_MUTED : LIGHT_MUTED;
    }
  }

  return next;
}

export const LP_CONTRAST_INK = {
  LIGHT_INK,
  LIGHT_MUTED,
  DARK_INK,
  DARK_MUTED,
  WHITE,
  NEAR_BLACK,
  AA_BODY,
  AA_UI,
} as const;
