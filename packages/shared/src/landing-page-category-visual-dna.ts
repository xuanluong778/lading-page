/**
 * Per-category visual DNA — palettes, imagery, design families, index overrides.
 * Data-driven visual differentiation for catalog expand (no slug hardcoding).
 */

import type { LandingPageBlock, LandingPageCategory } from './landing-page-types';
import type { LandingPageThemeTokens } from './landing-page-types';
import type { LandingPageDesignFamily } from './landing-page-template-foundation';
import { getVerifiedBackdropPhotoIds } from './landing-page-verified-backdrops';
import {
  ensureReadable,
  isDarkSurface,
  LP_CONTRAST_INK,
} from './landing-page-contrast';
type ArchitectureVariantLike = { designFamily: LandingPageDesignFamily; variantIndex: number };

type PaletteSlot = {
  mode: 'light' | 'dark';
  primary: string;
  secondary?: string;
  background?: string;
  canvas?: string;
  surface?: string;
  surfaceAlt?: string;
  accent?: string;
  border?: string;
  fontFamily?: string;
  density?: LandingPageThemeTokens['density'];
  buttonStyle?: LandingPageThemeTokens['buttonStyle'];
  imageTreatment?: LandingPageThemeTokens['imageTreatment'];
  fontWeightHeading?: number;
  fontSizeHero?: string;
  gradient?: string | 'auto' | 'none';
  radius?: string;
};

function parseHex(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    return [
      parseInt(h[0]! + h[0]!, 16),
      parseInt(h[1]! + h[1]!, 16),
      parseInt(h[2]! + h[2]!, 16),
    ];
  }
  if (h.length === 6) {
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  return null;
}

function toHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0'))
      .join('')
  );
}

/** Mix two hex colors; t=0 → a, t=1 → b. */
function mixHex(a: string, b: string, t: number): string {
  const A = parseHex(a);
  const B = parseHex(b);
  if (!A || !B) return a;
  return toHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}

function buildPalette(slot: PaletteSlot): Partial<LandingPageThemeTokens> {
  const secondary = slot.secondary || (slot.mode === 'dark' ? '#F8FAFC' : '#0F172A');
  const accent = slot.accent || slot.primary;
  const radius = slot.radius || (slot.mode === 'dark' ? '14px' : '12px');

  if (slot.mode === 'dark') {
    const canvas = slot.canvas || mixHex('#0B0E14', slot.primary, 0.1);
    const surface = slot.surface || mixHex('#12161F', slot.primary, 0.08);
    const surfaceAlt = slot.surfaceAlt || mixHex('#1A2234', slot.primary, 0.16);
    const border = slot.border || mixHex('#2A3348', slot.primary, 0.22);
    const glow = mixHex(canvas, slot.primary, 0.45);
    const text = ensureReadable(LP_CONTRAST_INK.DARK_INK, canvas, LP_CONTRAST_INK.AA_BODY);
    const muted = ensureReadable(LP_CONTRAST_INK.DARK_MUTED, canvas, LP_CONTRAST_INK.AA_UI);
    const gradient =
      slot.gradient === 'none'
        ? 'none'
        : slot.gradient === 'auto' || !slot.gradient
          ? `radial-gradient(ellipse 85% 55% at 88% 8%, ${mixHex(glow, slot.primary, 0.35)}55 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 8% 92%, ${mixHex(glow, secondary, 0.4)}40 0%, transparent 50%), linear-gradient(155deg, ${canvas} 0%, ${surfaceAlt} 48%, ${surface} 100%)`
          : slot.gradient;
    const iconSurface = mixHex(surfaceAlt, slot.primary, 0.28);
    return {
      primary: slot.primary,
      secondary,
      accent,
      background: canvas,
      canvas,
      surface,
      surfaceAlt,
      text,
      muted,
      border,
      button: slot.primary,
      gradient,
      shadow: `0 18px 48px ${mixHex('#000000', slot.primary, 0.25)}66`,
      shadowSm: '0 4px 16px rgba(0, 0, 0, 0.28)',
      shadowMd: `0 14px 40px ${mixHex('#000000', slot.primary, 0.2)}55`,
      shadowLg: `0 28px 72px ${mixHex('#000000', slot.primary, 0.28)}77`,
      iconSurface,
      iconColor: ensureReadable(slot.primary, iconSurface, LP_CONTRAST_INK.AA_UI),
      fontFamily: slot.fontFamily,
      density: slot.density,
      buttonStyle: slot.buttonStyle || 'solid',
      imageTreatment: slot.imageTreatment,
      fontWeightHeading: slot.fontWeightHeading ?? 800,
      fontSizeHero: slot.fontSizeHero,
      radius,
      radiusMd: radius,
      radiusLg: `calc(${radius} + 6px)`,
    };
  }

  const canvas = slot.canvas || mixHex('#F8FAFC', slot.primary, 0.06);
  const surface = slot.surface || slot.background || '#FFFFFF';
  const surfaceAlt = slot.surfaceAlt || mixHex('#F1F5F9', slot.primary, 0.12);
  const border = slot.border || mixHex('#E2E8F0', slot.primary, 0.18);
  // Prefer secondary when it already contrasts; otherwise force slate ink (AA).
  const text = ensureReadable(
    isDarkSurface(secondary) ? secondary : LP_CONTRAST_INK.LIGHT_INK,
    surface,
    LP_CONTRAST_INK.AA_BODY,
  );
  const muted = ensureReadable(LP_CONTRAST_INK.LIGHT_MUTED, surface, LP_CONTRAST_INK.AA_UI);
  const gradient =
    slot.gradient === 'none'
      ? 'none'
      : slot.gradient === 'auto' || !slot.gradient
        ? `radial-gradient(ellipse 80% 45% at 90% 0%, ${mixHex('#FFFFFF', slot.primary, 0.22)} 0%, transparent 55%), linear-gradient(165deg, ${surfaceAlt} 0%, ${surface} 42%, ${canvas} 100%)`
        : slot.gradient;
  const iconSurface = mixHex(surface, slot.primary, 0.12);

  return {
    primary: slot.primary,
    secondary,
    accent,
    background: surface,
    canvas,
    surface,
    surfaceAlt,
    text,
    muted,
    border,
    button: slot.primary,
    gradient,
    shadow: `0 14px 40px ${mixHex('#0F172A', slot.primary, 0.35)}14`,
    shadowSm: '0 4px 14px rgba(15, 23, 42, 0.06)',
    shadowMd: `0 12px 36px ${mixHex('#0F172A', slot.primary, 0.3)}12`,
    shadowLg: `0 24px 60px ${mixHex('#0F172A', slot.primary, 0.35)}16`,
    iconSurface,
    iconColor: ensureReadable(slot.primary, iconSurface, LP_CONTRAST_INK.AA_UI),
    fontFamily: slot.fontFamily,
    density: slot.density,
    buttonStyle: slot.buttonStyle,
    imageTreatment: slot.imageTreatment,
    fontWeightHeading: slot.fontWeightHeading,
    fontSizeHero: slot.fontSizeHero,
    radius,
    radiusMd: radius,
    radiusLg: `calc(${radius} + 6px)`,
  };
}

function palettes(slots: PaletteSlot[]): Partial<LandingPageThemeTokens>[] {
  return slots.map(buildPalette);
}

type CategoryVisualDna = {
  palettes: Partial<LandingPageThemeTokens>[];
  images: string[];
  designFamilies: LandingPageDesignFamily[];
  indexOverrides: Array<Partial<Record<LandingPageBlock['type'], string>>>;
};

/**
 * Per-index hero + section overrides — every row gets a distinct Hero so catalogs
 * cannot collapse to centered/minimal wireframes.
 */
function richIndexOverrides(
  leadForm: string,
  heroCycle: readonly string[],
  extras?: Partial<Record<LandingPageBlock['type'], string>>,
): Array<Partial<Record<LandingPageBlock['type'], string>>> {
  const lf = leadForm;
  const h = (i: number) => heroCycle[i % heroCycle.length]!;
  return [
    { Hero: h(0), LeadForm: lf, Features: 'editorial-list', CTA: 'split', ...extras },
    { Hero: h(1), Testimonials: 'portrait-quotes', Guarantee: 'banner', LeadForm: lf, Features: 'icon-grid' },
    { Hero: h(2), Pricing: 'comparison', FAQ: 'two-column', LeadForm: lf, CTA: 'banner' },
    { Hero: h(3), Process: 'timeline', Features: 'numbered', LeadForm: lf, CTA: 'minimal' },
    { Hero: h(4), Gallery: 'masonry', CTA: 'image-background', LeadForm: lf === 'booking' ? 'booking' : 'inline' },
    { Hero: h(5), Features: 'alternating', LeadForm: lf, CTA: 'split' },
    { Hero: h(6), FAQ: 'accordion', Guarantee: 'banner', LeadForm: lf, Features: 'image-cards' },
    { Hero: h(7), Header: 'minimal', Footer: 'columns', CTA: 'split', LeadForm: lf === 'card' ? 'floating-card' : lf },
    { Hero: h(8), LeadForm: lf, Features: 'numbered', CTA: 'banner', Testimonials: 'metric-plus-quote' },
    { Hero: h(9), Features: 'minimal-list', CTA: 'minimal', LeadForm: lf === 'split' ? 'minimal' : lf, Gallery: 'featured-plus-grid' },
  ];
}

/** Industry-tuned 10-slot hero cycles — rotated per variantIndex. */
const HERO_CYCLE_SPA = [
  'editorial-overlay',
  'asymmetric',
  'layered-cards',
  'fullscreen-image',
  'split-right',
  'dark-cinematic',
  'gradient-mesh',
  'image-collage',
  'floating-card',
  'conversion-proof',
] as const;
const HERO_CYCLE_SAAS = [
  'product-screenshot',
  'gradient-mesh',
  'layered-cards',
  'conversion-proof',
  'asymmetric',
  'dark-cinematic',
  'floating-card',
  'image-collage',
  'fullscreen-image',
  'split-right',
] as const;
const HERO_CYCLE_CLINIC = [
  'split-left',
  'conversion-proof',
  'floating-card',
  'asymmetric',
  'editorial-overlay',
  'layered-cards',
  'product-screenshot',
  'fullscreen-image',
  'split-right',
  'gradient-mesh',
] as const;
const HERO_CYCLE_RESTAURANT = [
  'fullscreen-image',
  'image-collage',
  'editorial-overlay',
  'asymmetric',
  'dark-cinematic',
  'split-right',
  'layered-cards',
  'gradient-mesh',
  'floating-card',
  'conversion-proof',
] as const;
const HERO_CYCLE_FASHION = [
  'editorial-overlay',
  'asymmetric',
  'image-collage',
  'fullscreen-image',
  'dark-cinematic',
  'split-right',
  'layered-cards',
  'gradient-mesh',
  'conversion-proof',
  'floating-card',
] as const;
const HERO_CYCLE_REAL_ESTATE = [
  'fullscreen-image',
  'asymmetric',
  'editorial-overlay',
  'split-left',
  'dark-cinematic',
  'layered-cards',
  'image-collage',
  'gradient-mesh',
  'floating-card',
  'conversion-proof',
] as const;
const HERO_CYCLE_COURSE = [
  'split-left',
  'conversion-proof',
  'layered-cards',
  'product-screenshot',
  'floating-card',
  'asymmetric',
  'editorial-overlay',
  'gradient-mesh',
  'fullscreen-image',
  'split-right',
] as const;
const HERO_CYCLE_LOCAL = [
  'conversion-proof',
  'floating-card',
  'split-left',
  'asymmetric',
  'layered-cards',
  'editorial-overlay',
  'fullscreen-image',
  'gradient-mesh',
  'image-collage',
  'split-right',
] as const;
const HERO_CYCLE_CONVERSION = [
  'conversion-proof',
  'floating-card',
  'layered-cards',
  'gradient-mesh',
  'split-left',
  'asymmetric',
  'product-screenshot',
  'dark-cinematic',
  'editorial-overlay',
  'fullscreen-image',
] as const;
const HERO_CYCLE_DEFAULT = [
  'asymmetric',
  'image-collage',
  'editorial-overlay',
  'layered-cards',
  'fullscreen-image',
  'gradient-mesh',
  'product-screenshot',
  'conversion-proof',
  'dark-cinematic',
  'split-right',
] as const;

const CATEGORY_HERO_CYCLES: Partial<Record<LandingPageCategory, readonly string[]>> = {
  spa: HERO_CYCLE_SPA,
  cosmetics: HERO_CYCLE_SPA,
  saas: HERO_CYCLE_SAAS,
  demo: HERO_CYCLE_SAAS,
  website: HERO_CYCLE_SAAS,
  clinic: HERO_CYCLE_CLINIC,
  restaurant: HERO_CYCLE_RESTAURANT,
  fashion: HERO_CYCLE_FASHION,
  product: HERO_CYCLE_FASHION,
  real_estate: HERO_CYCLE_REAL_ESTATE,
  course: HERO_CYCLE_COURSE,
  webinar: HERO_CYCLE_COURSE,
  coaching: HERO_CYCLE_COURSE,
  ebook: HERO_CYCLE_COURSE,
  service: HERO_CYCLE_LOCAL,
  agency: HERO_CYCLE_LOCAL,
  consulting: HERO_CYCLE_LOCAL,
  quote: HERO_CYCLE_LOCAL,
  seo: HERO_CYCLE_CONVERSION,
  lead_magnet: HERO_CYCLE_CONVERSION,
};

/** Resolve premium hero for category × variantIndex (DNA SoT). */
export function getCategoryHeroVariant(
  category: LandingPageCategory | string,
  variantIndex: number,
): string {
  const cycle = CATEGORY_HERO_CYCLES[category as LandingPageCategory] || HERO_CYCLE_DEFAULT;
  const offset = Math.abs(
    [...String(category)].reduce((a, c) => a + c.charCodeAt(0), 0),
  );
  return cycle[(variantIndex + offset) % cycle.length]!;
}

const CATEGORY_VISUAL_DNA: Partial<Record<LandingPageCategory, CategoryVisualDna>> = {
  seo: {
    palettes: palettes([
      { mode: 'dark', primary: '#22C55E', secondary: '#ECFDF5', density: 'spacious', imageTreatment: 'product-flat', fontFamily: '"IBM Plex Sans", sans-serif' },
      { mode: 'light', primary: '#2563EB', secondary: '#1E3A8A', density: 'comfortable', fontFamily: '"IBM Plex Sans", sans-serif' },
      { mode: 'light', primary: '#059669', secondary: '#064E3B', canvas: '#F0FDF4', background: '#F0FDF4', density: 'compact', fontWeightHeading: 800 },
      { mode: 'light', primary: '#0F172A', secondary: '#334155', buttonStyle: 'outline', density: 'compact', gradient: 'none' },
      { mode: 'dark', primary: '#10B981', density: 'spacious', imageTreatment: 'editorial', fontWeightHeading: 800 },
      { mode: 'light', primary: '#7C3AED', secondary: '#4C1D95', density: 'comfortable' },
      { mode: 'light', primary: '#0369A1', secondary: '#0C4A6E', density: 'spacious', imageTreatment: 'photo-real' },
      { mode: 'dark', primary: '#3B82F6', density: 'comfortable', fontFamily: '"Manrope", sans-serif' },
      { mode: 'light', primary: '#EA580C', secondary: '#9A3412', density: 'compact', fontWeightHeading: 900 },
      { mode: 'light', primary: '#171717', secondary: '#525252', buttonStyle: 'outline', fontSizeHero: 'clamp(1.85rem, 3.8vw, 2.85rem)', gradient: 'none' },
    ]),
    images: [
      'photo-1460925895917-afdab827c52f',
      'photo-1551288049-bebda4e38f71',
      'photo-1553877522-43269d4ea984',
      'photo-1504868584819-f8e8b4b6d7e3',
      'photo-1556761175-5973dc0f32e7',
      'photo-1542744173-8e7e53415bb0',
    ],
    designFamilies: ['corporate', 'conversion', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('card', HERO_CYCLE_CONVERSION),
  },

  website: {
    palettes: palettes([
      { mode: 'dark', primary: '#6366F1', density: 'spacious', imageTreatment: 'editorial', fontFamily: '"Fraunces", serif' },
      { mode: 'light', primary: '#2563EB', secondary: '#1E40AF', density: 'comfortable', fontFamily: '"Manrope", sans-serif' },
      { mode: 'light', primary: '#DB2777', secondary: '#831843', density: 'compact', fontWeightHeading: 900 },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none', density: 'compact' },
      { mode: 'dark', primary: '#F97316', imageTreatment: 'editorial', fontWeightHeading: 800 },
      { mode: 'light', primary: '#7C3AED', secondary: '#5B21B6', density: 'spacious' },
      { mode: 'light', primary: '#0891B2', secondary: '#164E63', imageTreatment: 'product-flat' },
      { mode: 'dark', primary: '#38BDF8', fontFamily: '"IBM Plex Sans", sans-serif' },
      { mode: 'light', primary: '#E11D48', secondary: '#881337', density: 'compact' },
      { mode: 'light', primary: '#404040', buttonStyle: 'outline', fontSizeHero: 'clamp(1.9rem, 4vw, 2.9rem)', gradient: 'none' },
    ]),
    images: [
      'photo-1498050108023-c5249f4df085',
      'photo-1467236648965-937a688b4365',
      'photo-1507238691740-187a5b1d37b8',
      'photo-1555066931-4365d14bab8c',
      'photo-1517694712202-14dd9538aa97',
      'photo-1547658719-da2b51169166',
    ],
    designFamilies: ['portfolio', 'corporate', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'portfolio', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('split', HERO_CYCLE_SAAS),
  },

  service: {
    palettes: palettes([
      { mode: 'light', primary: '#0D9488', secondary: '#134E4A', density: 'comfortable', imageTreatment: 'photo-real', fontFamily: '"Manrope", sans-serif', radius: '14px' },
      { mode: 'light', primary: '#0284C7', secondary: '#0C4A6E', density: 'spacious' },
      { mode: 'light', primary: '#2563EB', secondary: '#1E3A8A', density: 'comfortable' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none', density: 'compact' },
      { mode: 'dark', primary: '#14B8A6', imageTreatment: 'photo-real' },
      { mode: 'light', primary: '#EA580C', secondary: '#9A3412', fontWeightHeading: 800 },
      { mode: 'light', primary: '#059669', secondary: '#065F46', density: 'spacious' },
      { mode: 'dark', primary: '#38BDF8', density: 'comfortable' },
      { mode: 'light', primary: '#DC2626', secondary: '#991B1B', density: 'compact' },
      { mode: 'light', primary: '#475569', buttonStyle: 'outline', fontSizeHero: 'clamp(1.85rem, 3.8vw, 2.85rem)' },
    ]),
    images: [
      'photo-1581578731548-c64695cc6952',
      'photo-1621905252507-b35492cc74b4',
      'photo-1504307651254-35680f356dfd',
      'photo-1503387762-592deb58ef4e',
      'photo-1504917595217-d4dc5ebe6122',
      'photo-1454165804606-c3d57bc86b40',
    ],
    designFamilies: ['local', 'corporate', 'conversion', 'minimal', 'portfolio', 'conversion', 'corporate', 'local', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('booking', HERO_CYCLE_LOCAL),
  },

  course: {
    palettes: palettes([
      { mode: 'dark', primary: '#EC4899', secondary: '#A855F7', accent: '#22D3EE', density: 'spacious', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeightHeading: 800, radius: '16px', imageTreatment: 'editorial' },
      { mode: 'light', primary: '#7C3AED', secondary: '#5B21B6', density: 'spacious', fontFamily: '"Fraunces", serif', radius: '14px' },
      { mode: 'light', primary: '#2563EB', secondary: '#1E40AF', density: 'comfortable', canvas: '#EFF6FF' },
      { mode: 'dark', primary: '#22D3EE', secondary: '#A78BFA', accent: '#EC4899', fontWeightHeading: 800, radius: '16px' },
      { mode: 'light', primary: '#EA580C', secondary: '#C2410C', fontWeightHeading: 900, canvas: '#FFF7ED' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none', radius: '8px' },
      { mode: 'dark', primary: '#A78BFA', secondary: '#F472B6', imageTreatment: 'editorial', density: 'spacious' },
      { mode: 'light', primary: '#0891B2', secondary: '#155E75', canvas: '#ECFEFF' },
      { mode: 'light', primary: '#059669', secondary: '#047857', density: 'spacious', canvas: '#ECFDF5' },
      { mode: 'dark', primary: '#F97316', secondary: '#FBBF24', fontWeightHeading: 800, radius: '14px' },
    ]),
    images: [
      'photo-1524178232363-1fb2b075b655',
      'photo-1434030216411-0b793f4b4173',
      'photo-1503676260728-1c00da094a0b',
      'photo-1522202176988-66273c2fd55f',
      'photo-1516321318423-f06f85e504b3',
      'photo-1523240795612-9a054b0db644',
    ],
    designFamilies: ['conversion', 'corporate', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('split', HERO_CYCLE_COURSE),
  },

  webinar: {
    palettes: palettes([
      { mode: 'dark', primary: '#EF4444', density: 'spacious', fontWeightHeading: 800 },
      { mode: 'light', primary: '#2563EB', secondary: '#1E3A8A', density: 'comfortable' },
      { mode: 'light', primary: '#7C3AED', secondary: '#5B21B6' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#F97316', imageTreatment: 'editorial' },
      { mode: 'light', primary: '#DC2626', secondary: '#991B1B', fontWeightHeading: 900 },
      { mode: 'light', primary: '#0891B2', secondary: '#0E7490' },
      { mode: 'dark', primary: '#6366F1', fontFamily: '"IBM Plex Sans", sans-serif' },
      { mode: 'light', primary: '#EA580C', secondary: '#9A3412' },
      { mode: 'light', primary: '#525252', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1540575467063-178a50c2df87',
      'photo-1475721027880-d021e0fec107',
      'photo-1505373877841-8d25f7d46678',
      'photo-1591115765373-5207764f72e7',
      'photo-1511578314322-379afb476865',
      'photo-1505373877841-8d25f7d46678',
    ],
    designFamilies: ['conversion', 'corporate', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('compact', HERO_CYCLE_COURSE),
  },

  coaching: {
    palettes: palettes([
      { mode: 'light', primary: '#EA580C', secondary: '#9A3412', density: 'spacious', fontFamily: '"Fraunces", serif' },
      { mode: 'light', primary: '#059669', secondary: '#065F46', imageTreatment: 'photo-real' },
      { mode: 'light', primary: '#7C3AED', secondary: '#6D28D9' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#F97316', fontWeightHeading: 800 },
      { mode: 'light', primary: '#0284C7', secondary: '#0369A1' },
      { mode: 'light', primary: '#DB2777', secondary: '#BE185D', density: 'comfortable' },
      { mode: 'dark', primary: '#34D399', imageTreatment: 'editorial' },
      { mode: 'light', primary: '#CA8A04', secondary: '#854D0E', fontWeightHeading: 900 },
      { mode: 'light', primary: '#44403C', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1571019614242-c5c5dee9f50b',
      'photo-1518611012118-696072aa579a',
      'photo-1544367567-0f2fcb009e0b',
      'photo-1517836357463-d25dfeac3438',
      'photo-1506126613408-eca07ce68773',
      'photo-1518611012118-696072aa579a',
    ],
    designFamilies: ['conversion', 'local', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('split', HERO_CYCLE_COURSE),
  },

  consulting: {
    palettes: palettes([
      { mode: 'dark', primary: '#D97706', secondary: '#FEF3C7', density: 'spacious', fontFamily: '"Fraunces", serif' },
      { mode: 'light', primary: '#1E3A8A', secondary: '#1E40AF', density: 'comfortable', fontFamily: '"IBM Plex Sans", sans-serif' },
      { mode: 'light', primary: '#0F766E', secondary: '#134E4A' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#F59E0B', fontWeightHeading: 800 },
      { mode: 'light', primary: '#4338CA', secondary: '#3730A3' },
      { mode: 'light', primary: '#0369A1', secondary: '#075985' },
      { mode: 'dark', primary: '#60A5FA', density: 'comfortable' },
      { mode: 'light', primary: '#B45309', secondary: '#92400E', fontWeightHeading: 900 },
      { mode: 'light', primary: '#334155', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1556761175-b413da4baf72',
      'photo-1553877522-43269d4ea984',
      'photo-1600880292203-757bb62b4baf',
      'photo-1552664730-d307ca884978',
      'photo-1522071820081-009f0129c71c',
      'photo-1556761175-5973dc0f32e7',
    ],
    designFamilies: ['corporate', 'corporate', 'conversion', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('split', HERO_CYCLE_LOCAL),
  },

  quote: {
    palettes: palettes([
      { mode: 'light', primary: '#EA580C', secondary: '#9A3412', density: 'comfortable', fontWeightHeading: 800 },
      { mode: 'light', primary: '#2563EB', secondary: '#1E40AF', fontFamily: '"IBM Plex Sans", sans-serif' },
      { mode: 'light', primary: '#059669', secondary: '#047857' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#FB923C', imageTreatment: 'photo-real' },
      { mode: 'light', primary: '#DC2626', secondary: '#991B1B' },
      { mode: 'light', primary: '#0284C7', secondary: '#0369A1' },
      { mode: 'dark', primary: '#38BDF8' },
      { mode: 'light', primary: '#CA8A04', secondary: '#A16207' },
      { mode: 'light', primary: '#57534E', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1504307651254-35680f356dfd',
      'photo-1503387762-592deb58ef4e',
      'photo-1581094794399-8440e7c2f1f1',
      'photo-1504917595217-d4dc5ebe6122',
      'photo-1581578731548-c64695cc6952',
      'photo-1503387762-592deb58ef4e',
    ],
    designFamilies: ['conversion', 'corporate', 'bold', 'minimal', 'local', 'conversion', 'corporate', 'conversion', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('split', HERO_CYCLE_LOCAL),
  },

  ebook: {
    palettes: palettes([
      { mode: 'light', primary: '#059669', secondary: '#065F46', fontFamily: '"Fraunces", serif', density: 'spacious' },
      { mode: 'light', primary: '#2563EB', secondary: '#1E40AF', density: 'comfortable' },
      { mode: 'light', primary: '#7C3AED', secondary: '#6D28D9' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#34D399', imageTreatment: 'editorial' },
      { mode: 'light', primary: '#DB2777', secondary: '#BE185D' },
      { mode: 'light', primary: '#0891B2', secondary: '#0E7490' },
      { mode: 'dark', primary: '#A78BFA' },
      { mode: 'light', primary: '#CA8A04', secondary: '#854D0E', fontWeightHeading: 900 },
      { mode: 'light', primary: '#44403C', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1512820790804-4153f7372b4c',
      'photo-1481627834876-b7833e8f5570',
      'photo-1456513080510-7bf3a84b82f8',
      'photo-1507003211169-0a1dd7228f2d',
      'photo-1497633762265-9d179a990aa6',
      'photo-1524995992477-879a36b4ae91',
    ],
    designFamilies: ['editorial', 'conversion', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'minimal'],
    indexOverrides: richIndexOverrides('inline', HERO_CYCLE_COURSE),
  },

  demo: {
    palettes: palettes([
      { mode: 'dark', primary: '#6366F1', density: 'spacious', fontFamily: '"IBM Plex Sans", sans-serif' },
      { mode: 'light', primary: '#2563EB', secondary: '#1E40AF', density: 'comfortable' },
      { mode: 'light', primary: '#7C3AED', secondary: '#5B21B6', fontWeightHeading: 900 },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#8B5CF6', imageTreatment: 'product-flat' },
      { mode: 'light', primary: '#0891B2', secondary: '#155E75' },
      { mode: 'light', primary: '#059669', secondary: '#047857' },
      { mode: 'dark', primary: '#38BDF8' },
      { mode: 'light', primary: '#EA580C', secondary: '#C2410C' },
      { mode: 'light', primary: '#475569', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1551434678-e076c223a692d',
      'photo-1553877522-43269d4ea984',
      'photo-1460925895917-afdab827c52f',
      'photo-1551288049-bebda4e38f71',
      'photo-1519389950473-47ba0277781c',
      'photo-1498050108023-c5249f4df085',
    ],
    designFamilies: ['conversion', 'corporate', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('floating-card', HERO_CYCLE_SAAS),
  },

  lead_magnet: {
    palettes: palettes([
      { mode: 'light', primary: '#DC2626', secondary: '#991B1B', fontWeightHeading: 900, density: 'compact' },
      { mode: 'light', primary: '#2563EB', secondary: '#1E40AF', density: 'comfortable' },
      { mode: 'light', primary: '#EA580C', secondary: '#C2410C' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#F97316', fontWeightHeading: 800 },
      { mode: 'light', primary: '#7C3AED', secondary: '#6D28D9' },
      { mode: 'light', primary: '#059669', secondary: '#047857' },
      { mode: 'dark', primary: '#EF4444' },
      { mode: 'light', primary: '#DB2777', secondary: '#BE185D' },
      { mode: 'light', primary: '#525252', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1556761175-5973dc0f32e7',
      'photo-1553877522-43269d4ea984',
      'photo-1454165804606-c3d57bc86b40',
      'photo-1504868584819-f8e8b4b6d7e3',
      'photo-1522071820081-009f0129c71c',
      'photo-1552664730-d307ca884978',
    ],
    designFamilies: ['conversion', 'corporate', 'bold', 'minimal', 'portfolio', 'conversion', 'corporate', 'conversion', 'conversion', 'minimal'],
    indexOverrides: richIndexOverrides('compact', HERO_CYCLE_CONVERSION),
  },

  product: {
    palettes: palettes([
      { mode: 'light', primary: '#2563EB', secondary: '#1E40AF', imageTreatment: 'product-flat', density: 'comfortable' },
      { mode: 'light', primary: '#0F172A', secondary: '#334155', buttonStyle: 'outline' },
      { mode: 'light', primary: '#DC2626', secondary: '#991B1B', fontWeightHeading: 900 },
      { mode: 'light', primary: '#059669', secondary: '#047857' },
      { mode: 'dark', primary: '#F97316', imageTreatment: 'product-flat' },
      { mode: 'light', primary: '#7C3AED', secondary: '#6D28D9' },
      { mode: 'light', primary: '#0891B2', secondary: '#0E7490' },
      { mode: 'dark', primary: '#38BDF8' },
      { mode: 'light', primary: '#DB2777', secondary: '#BE185D' },
      { mode: 'light', primary: '#404040', buttonStyle: 'outline', fontSizeHero: 'clamp(1.9rem, 4vw, 2.9rem)' },
    ]),
    images: [
      'photo-1523275335684-37898b6baf30',
      'photo-1505740420928-5e56006be30d',
      'photo-1572635196237-14b3f281503f',
      'photo-1560343090-f0409e92796a',
      'photo-1526170375885-4d8ecf77b99f',
      'photo-1491553895911-67a25a47a089',
    ],
    designFamilies: ['product', 'minimal', 'bold', 'conversion', 'portfolio', 'conversion', 'corporate', 'product', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('inline', HERO_CYCLE_FASHION),
  },

  cosmetics: {
    palettes: palettes([
      { mode: 'light', primary: '#DB2777', secondary: '#9D174D', density: 'spacious', fontFamily: '"Fraunces", serif', radius: '14px' },
      { mode: 'light', primary: '#BE185D', secondary: '#831843', imageTreatment: 'editorial' },
      { mode: 'dark', primary: '#F472B6', fontWeightHeading: 800 },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'dark', primary: '#D97706', secondary: '#FEF3C7', imageTreatment: 'editorial' },
      { mode: 'light', primary: '#7C3AED', secondary: '#6D28D9' },
      { mode: 'light', primary: '#0891B2', secondary: '#155E75', density: 'comfortable' },
      { mode: 'dark', primary: '#EC4899' },
      { mode: 'light', primary: '#CA8A04', secondary: '#A16207', fontWeightHeading: 900 },
      { mode: 'light', primary: '#44403C', buttonStyle: 'outline' },
    ]),
    images: [
      'photo-1596462502278-27bfdc403348',
      'photo-1522335789203-aabd1fc54bc9',
      'photo-1570172619644-dfd03ed75981',
      'photo-1512496015851-a90fb38ba796',
      'photo-1487412947417-5cebf100ffc2',
      'photo-1596755389378-c179efa9a2c0',
    ],
    designFamilies: ['luxury', 'organic', 'bold', 'minimal', 'portfolio', 'conversion', 'luxury', 'organic', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('booking', HERO_CYCLE_SPA),
  },

  fashion: {
    palettes: palettes([
      { mode: 'dark', primary: '#FAFAF9', secondary: '#E7E5E4', density: 'spacious', imageTreatment: 'editorial', fontFamily: '"Fraunces", serif' },
      { mode: 'light', primary: '#0F172A', secondary: '#171717', buttonStyle: 'outline', gradient: 'none' },
      { mode: 'light', primary: '#DC2626', secondary: '#991B1B', fontWeightHeading: 900 },
      { mode: 'light', primary: '#78716C', secondary: '#44403C', density: 'compact' },
      { mode: 'dark', primary: '#E11D48', imageTreatment: 'editorial' },
      { mode: 'light', primary: '#7C3AED', secondary: '#5B21B6' },
      { mode: 'light', primary: '#0891B2', secondary: '#0E7490' },
      { mode: 'dark', primary: '#F5F5F4' },
      { mode: 'light', primary: '#CA8A04', secondary: '#854D0E' },
      { mode: 'light', primary: '#A8A29E', buttonStyle: 'outline', fontSizeHero: 'clamp(2rem, 4.5vw, 3.2rem)' },
    ]),
    images: [
      'photo-1483985988355-763728e3685b',
      'photo-1469334031218-e382a71b716b',
      'photo-1490481651871-ab68de25d43d',
      'photo-1515886657613-9f3515b0c78f',
      'photo-1539109136882-3baa02d2a4f6',
      'photo-1558618666-fcd25c85cd64',
    ],
    designFamilies: ['luxury', 'minimal', 'bold', 'editorial', 'portfolio', 'conversion', 'luxury', 'product', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('inline', HERO_CYCLE_FASHION),
  },

  restaurant: {
    palettes: palettes([
      { mode: 'dark', primary: '#D97706', secondary: '#FEF3C7', accent: '#F59E0B', density: 'spacious', fontFamily: '"Fraunces", serif', imageTreatment: 'photo-real', radius: '14px', canvas: '#0C0A09' },
      { mode: 'light', primary: '#DC2626', secondary: '#991B1B', density: 'comfortable', canvas: '#FEF2F2', radius: '12px' },
      { mode: 'light', primary: '#059669', secondary: '#047857', canvas: '#ECFDF5' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none', radius: '8px' },
      { mode: 'dark', primary: '#EA580C', secondary: '#FDBA74', fontWeightHeading: 800, radius: '14px', canvas: '#1C1917' },
      { mode: 'light', primary: '#B45309', secondary: '#92400E', canvas: '#FFFBEB', radius: '12px' },
      { mode: 'light', primary: '#7C2D12', secondary: '#431407', density: 'spacious', canvas: '#FFF7ED', radius: '14px' },
      { mode: 'dark', primary: '#FB923C', secondary: '#FED7AA', accent: '#DC2626', radius: '16px' },
      { mode: 'light', primary: '#CA8A04', secondary: '#854D0E', fontWeightHeading: 900, canvas: '#FEFCE8' },
      { mode: 'light', primary: '#57534E', buttonStyle: 'outline', canvas: '#FAFAF9' },
    ]),
    images: [
      'photo-1517248135467-4c7edcad34c4',
      'photo-1414235077428-338989a2e8c0',
      'photo-1555396273-367ea4eb4db5',
      'photo-1559339352-11d035aa65de',
      'photo-1424847651672-bf1950a495fa',
      'photo-1550966841-3eeb8c938e7b',
    ],
    designFamilies: ['luxury', 'local', 'conversion', 'minimal', 'portfolio', 'conversion', 'organic', 'local', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('booking', HERO_CYCLE_RESTAURANT),
  },

  real_estate: {
    palettes: palettes([
      { mode: 'dark', primary: '#D97706', secondary: '#FEF3C7', density: 'spacious', fontFamily: '"Fraunces", serif', radius: '12px', canvas: '#0C0A09', imageTreatment: 'editorial' },
      { mode: 'light', primary: '#1E3A8A', secondary: '#1E40AF', density: 'comfortable', fontFamily: '"Manrope", sans-serif', canvas: '#EFF6FF', radius: '10px' },
      { mode: 'light', primary: '#059669', secondary: '#047857', canvas: '#ECFDF5' },
      { mode: 'light', primary: '#0F172A', buttonStyle: 'outline', gradient: 'none', radius: '8px' },
      { mode: 'dark', primary: '#F59E0B', secondary: '#FDE68A', imageTreatment: 'editorial', fontWeightHeading: 800, radius: '12px' },
      { mode: 'light', primary: '#0284C7', secondary: '#0369A1', canvas: '#F0F9FF' },
      { mode: 'light', primary: '#7C3AED', secondary: '#6D28D9', canvas: '#F5F3FF' },
      { mode: 'dark', primary: '#60A5FA', secondary: '#BFDBFE', accent: '#F59E0B', radius: '12px' },
      { mode: 'light', primary: '#B45309', secondary: '#92400E', fontWeightHeading: 900, canvas: '#FFFBEB' },
      { mode: 'light', primary: '#44403C', buttonStyle: 'outline', canvas: '#FAFAF9' },
    ]),
    images: [
      'photo-1600596542815-ffad4c1539a9',
      'photo-1600585154340-be6161a56a0c',
      'photo-1600607687939-ce8a6c25118c',
      'photo-1600566753190-17f0baa2a6c3',
      'photo-1564013799919-ab600027ffc6',
      'photo-1605276374104-de6862b9b645',
    ],
    designFamilies: ['luxury', 'local', 'conversion', 'minimal', 'portfolio', 'conversion', 'corporate', 'local', 'conversion', 'editorial'],
    indexOverrides: richIndexOverrides('booking', HERO_CYCLE_REAL_ESTATE),
  },

  spa: {
    palettes: palettes([
      { mode: 'light', primary: '#0D9488', secondary: '#134E4A', density: 'spacious', fontFamily: '"Fraunces", serif', radius: '20px', imageTreatment: 'editorial', canvas: '#F0FDFA' },
      { mode: 'light', primary: '#A8A29E', secondary: '#57534E', density: 'comfortable', buttonStyle: 'outline', gradient: 'none', radius: '14px', canvas: '#FAFAF9' },
      { mode: 'light', primary: '#0284C7', secondary: '#0C4A6E', imageTreatment: 'photo-real', canvas: '#F0F9FF', radius: '18px' },
      { mode: 'dark', primary: '#D97706', secondary: '#FEF3C7', fontWeightHeading: 800, imageTreatment: 'editorial', radius: '18px', canvas: '#1C1917' },
      { mode: 'light', primary: '#059669', secondary: '#065F46', density: 'spacious', canvas: '#ECFDF5', radius: '18px' },
      { mode: 'dark', primary: '#14B8A6', secondary: '#F9A8D4', imageTreatment: 'editorial', radius: '20px' },
      { mode: 'light', primary: '#BE185D', secondary: '#9D174D', canvas: '#FDF2F8', radius: '18px' },
      { mode: 'dark', primary: '#F472B6', secondary: '#5EEAD4', density: 'spacious', radius: '20px' },
      { mode: 'light', primary: '#CA8A04', secondary: '#854D0E', fontWeightHeading: 900, canvas: '#FFFBEB', radius: '16px' },
      { mode: 'light', primary: '#44403C', buttonStyle: 'outline', fontSizeHero: 'clamp(2rem, 4.5vw, 3.2rem)', radius: '12px' },
    ]),
    images: [
      'photo-1540555700478-4be289fbecef',
      'photo-1600334089648-b0d9d2788b70',
      'photo-1544161515-4ab6ce5db272',
      'photo-1519823551278-64b927cf2421',
      'photo-1515377902423-a895c1b77c27',
      'photo-1610639535210-6dbd866d5c67',
    ],
    designFamilies: ['luxury', 'minimal', 'corporate', 'bold', 'organic', 'conversion', 'portfolio', 'local', 'editorial', 'corporate'],
    indexOverrides: richIndexOverrides('booking', HERO_CYCLE_SPA),
  },
};

/** Categories with Batch 1 hand-tuned palettes (keep in design-tokens). */
export const VISUAL_DNA_BATCH1_CATEGORIES = new Set<LandingPageCategory>(['agency', 'clinic', 'saas']);

/** Hand-authored designFamily — do not overwrite via DNA stamp. */
const SKIP_DESIGN_FAMILY_STAMP = new Set<LandingPageCategory>([
  ...VISUAL_DNA_BATCH1_CATEGORIES,
  'spa',
]);

export function getCategoryVisualPalette(
  category: LandingPageCategory | string,
  variantIndex: number,
): Partial<LandingPageThemeTokens> {
  const dna = CATEGORY_VISUAL_DNA[category as LandingPageCategory];
  if (!dna?.palettes.length) return {};
  return dna.palettes[variantIndex % dna.palettes.length] || {};
}

export function getCategoryBackdropImages(category: LandingPageCategory | string): string[] {
  return [...getVerifiedBackdropPhotoIds(category)];
}

export function getCategoryIndexOverrides(
  category: LandingPageCategory,
): Array<Partial<Record<LandingPageBlock['type'], string>>> | undefined {
  return CATEGORY_VISUAL_DNA[category]?.indexOverrides;
}

export function getCategoryDesignFamily(
  category: LandingPageCategory | string,
  variantIndex: number,
): LandingPageDesignFamily | undefined {
  const dna = CATEGORY_VISUAL_DNA[category as LandingPageCategory];
  return dna?.designFamilies[variantIndex % (dna.designFamilies.length || 1)];
}

/** Stamp designFamily from DNA on architectures that lack explicit family. */
export function stampArchitecturesFromVisualDna(
  architectures: Record<string, ArchitectureVariantLike[]>,
): void {
  for (const [cat, variants] of Object.entries(architectures)) {
    if (SKIP_DESIGN_FAMILY_STAMP.has(cat as LandingPageCategory)) continue;
    const dna = CATEGORY_VISUAL_DNA[cat as LandingPageCategory];
    if (!dna) continue;
    variants.forEach((variant, i) => {
      const stamped = dna.designFamilies[i];
      if (stamped) variant.designFamily = stamped;
    });
  }
}
