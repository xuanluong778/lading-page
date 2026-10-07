/**
 * Stamp per-section surface shells from architecture DNA.
 * Renderer already reads block.background via landingPageSectionSurfaceStyle —
 * catalog stamping is the missing visual differentiation layer.
 */

import type { LandingPageBlock, LandingPageCategory } from './landing-page-types';
import type { LandingPageDesignFamily } from './landing-page-template-foundation';
import { verifiedBackdropUrl } from './landing-page-verified-backdrops';
import {
  goldSectionBackground,
  goldSectionTone,
  resolveAgencyPremiumStandard,
} from './landing-page-agency-gold-system';
import {
  clinicGoldSectionBackground,
  clinicGoldSectionTone,
  resolveClinicGoldStandard,
} from './landing-page-clinic-gold-system';
import {
  saasGoldSectionBackground,
  saasGoldSectionTone,
  resolveSaasPremiumStandard,
} from './landing-page-saas-gold-system';
import {
  consultingGoldSectionBackground,
  consultingGoldSectionTone,
  resolveConsultingPremiumStandard,
} from './landing-page-consulting-gold-system';
import {
  resolveSeoPremiumStandard,
  seoGoldSectionBackground,
  seoGoldSectionTone,
} from './landing-page-seo-gold-system';
import {
  resolveServicePremiumStandard,
  serviceGoldSectionBackground,
  serviceGoldSectionTone,
} from './landing-page-service-gold-system';
import {
  resolveWebsitePremiumStandard,
  websiteGoldSectionBackground,
  websiteGoldSectionTone,
} from './landing-page-website-gold-system';
import {
  cosmeticsGoldSectionBackground,
  cosmeticsGoldSectionTone,
  resolveCosmeticsPremiumStandard,
} from './landing-page-cosmetics-gold-system';
import {
  fashionGoldSectionBackground,
  fashionGoldSectionTone,
  resolveFashionPremiumStandard,
} from './landing-page-fashion-gold-system';
import {
  productGoldSectionBackground,
  productGoldSectionTone,
  resolveProductPremiumStandard,
} from './landing-page-product-gold-system';

export type SectionShellContext = {
  category: LandingPageCategory | string;
  designFamily: LandingPageDesignFamily | string;
  visualComposition?: string;
  variantIndex: number;
  conversionGoal?: string;
  architectureId?: string;
};

type ShellKind =
  | 'canvas'
  | 'surface'
  | 'surfaceAlt'
  | 'muted'
  | 'dark'
  | 'primarySoft'
  | 'gradient'
  | 'hero'
  | 'cta'
  | 'form'
  | 'transparent';

function shellCss(kind: ShellKind): string | null {
  switch (kind) {
    case 'canvas':
      return 'var(--lp-canvas, var(--lp-bg))';
    case 'surface':
      return 'var(--lp-surface)';
    case 'surfaceAlt':
      return 'var(--lp-surface-alt, var(--lp-surface))';
    case 'muted':
      return 'color-mix(in srgb, var(--lp-surface-alt, var(--lp-surface)) 88%, var(--lp-muted) 12%)';
    case 'dark':
      return 'linear-gradient(160deg, #0B1220 0%, #111827 55%, #0F172A 100%)';
    case 'primarySoft':
      return 'color-mix(in srgb, var(--lp-primary) 10%, var(--lp-surface) 90%)';
    case 'gradient':
      return 'var(--lp-gradient)';
    case 'hero':
      return 'var(--lp-gradient)';
    case 'cta':
      return 'linear-gradient(120deg, var(--lp-primary) 0%, color-mix(in srgb, var(--lp-primary) 55%, #0F172A) 100%)';
    case 'form':
      return 'color-mix(in srgb, var(--lp-surface-alt, var(--lp-surface)) 70%, var(--lp-primary) 8%)';
    case 'transparent':
      return null;
    default:
      return null;
  }
}

function shellForBlock(
  type: LandingPageBlock['type'],
  index: number,
  ctx: SectionShellContext,
  variant?: string | null,
): { background: string | null; spacing?: LandingPageBlock['spacing'] } {
  const family = String(ctx.designFamily || '');
  const composition = String(ctx.visualComposition || '');
  const darkFamily = family === 'bold' || family === 'portfolio';
  const isDarkCanvas = darkFamily && (ctx.variantIndex % 10 === 0 || ctx.variantIndex === 5 || ctx.variantIndex === 7);
  const isAgency = ctx.category === 'agency';
  const sectionSpace = (preferred: LandingPageBlock['spacing']) =>
    isAgency && preferred === 'lg' ? 'md' : preferred;

  switch (type) {
    case 'Header':
      return {
        background: shellCss(isDarkCanvas || darkFamily ? 'dark' : 'surface'),
        spacing: 'sm',
      };
    case 'Hero': {
      if (variant === 'editorial-overlay' || variant === 'fullscreen-image') {
        return { background: shellCss('dark'), spacing: 'lg' };
      }
      if (variant === 'minimal-copy') {
        return { background: shellCss('canvas'), spacing: 'lg' };
      }
      if (variant === 'floating-card') {
        return { background: shellCss('gradient'), spacing: 'lg' };
      }
      return { background: shellCss('hero'), spacing: 'lg' };
    }
    case 'Speaker':
      return {
        background: shellCss(composition === 'portrait_speaker' ? 'surfaceAlt' : 'surface'),
        spacing: 'lg',
      };
    case 'Gallery':
      if (composition === 'gallery_heavy' || index === 0) {
        return { background: shellCss(darkFamily ? 'dark' : 'muted'), spacing: sectionSpace('lg') };
      }
      return { background: shellCss(index % 2 === 0 ? 'surfaceAlt' : 'canvas'), spacing: 'md' };
    case 'Video':
      return { background: shellCss('dark'), spacing: 'lg' };
    case 'Features':
    case 'Benefits':
      if (variant === 'editorial-list' || variant === 'minimal-list') {
        return { background: shellCss('canvas'), spacing: 'lg' };
      }
      if (variant === 'alternating' || variant === 'image-cards') {
        return { background: shellCss('surfaceAlt'), spacing: 'lg' };
      }
      return {
        background: shellCss(index % 2 === 0 ? 'surface' : 'surfaceAlt'),
        spacing: 'md',
      };
    case 'Process':
      return {
        background: shellCss(variant === 'timeline' ? 'surfaceAlt' : 'canvas'),
        spacing: sectionSpace('md'),
      };
    case 'Testimonials':
      return {
        background: shellCss(
          variant === 'quote-centered' || variant === 'editorial' ? 'muted' : 'surfaceAlt',
        ),
        spacing: sectionSpace('md'),
      };
    case 'Pricing':
      return {
        background: shellCss(variant === 'comparison' ? 'surfaceAlt' : 'canvas'),
        spacing: sectionSpace('md'),
      };
    case 'FAQ':
      return {
        background: shellCss(variant === 'accordion' ? 'canvas' : 'surfaceAlt'),
        spacing: 'md',
      };
    case 'Guarantee':
      return {
        background: shellCss(variant === 'banner' ? 'primarySoft' : 'surface'),
        spacing: variant === 'banner' ? 'md' : 'sm',
      };
    case 'CTA':
      if (variant === 'minimal') {
        return { background: shellCss('transparent'), spacing: 'md' };
      }
      if (variant === 'banner' || variant === 'image-background') {
        return { background: shellCss('cta'), spacing: 'lg' };
      }
      return { background: shellCss('primarySoft'), spacing: 'md' };
    case 'LeadForm':
      if (variant === 'split' || variant === 'floating-card') {
        return { background: shellCss(darkFamily ? 'dark' : 'form'), spacing: 'lg' };
      }
      if (variant === 'booking') {
        return { background: shellCss('surfaceAlt'), spacing: 'lg' };
      }
      if (variant === 'minimal' || variant === 'inline') {
        return { background: shellCss('canvas'), spacing: 'md' };
      }
      return { background: shellCss('form'), spacing: 'md' };
    case 'Footer':
      return {
        background: shellCss(darkFamily || isDarkCanvas ? 'dark' : 'muted'),
        spacing: 'sm',
      };
    case 'Product':
      return { background: shellCss('surfaceAlt'), spacing: 'lg' };
    case 'Countdown':
      return { background: shellCss('primarySoft'), spacing: 'md' };
    default:
      return { background: shellCss(index % 2 === 0 ? 'transparent' : 'surfaceAlt') };
  }
}

/**
 * SaaS-gold quality rhythm for categories without a dedicated gold system.
 * Pattern: base → soft/tinted → brand → contrast/dark → CTA.
 * Soft tone follows designFamily so industries stay visually distinct.
 */
function productionSoftTone(ctx: SectionShellContext): string {
  const family = String(ctx.designFamily || '');
  if (family === 'editorial' || family === 'luxury' || family === 'portfolio') return 'cream';
  if (family === 'organic' || family === 'local') return 'organic';
  if (family === 'corporate' || family === 'product') return 'data';
  if (family === 'bold' || family === 'conversion') return 'editorial';
  if (ctx.category === 'spa' || ctx.category === 'clinic') return 'clinical';
  if (ctx.category === 'cosmetics' || ctx.category === 'fashion') return 'beauty';
  if (ctx.category === 'restaurant') return 'warm';
  if (ctx.category === 'real_estate') return 'trust';
  return 'cream';
}

function productionRhythmTone(
  blockType: string,
  index: number,
  ctx: SectionShellContext,
): string {
  const even = index % 2 === 0;
  const family = String(ctx.designFamily || '');
  const soft = productionSoftTone(ctx);
  const darkFamily = family === 'bold' || family === 'portfolio';

  switch (blockType) {
    case 'Header':
      return darkFamily ? 'dark' : 'surface';
    case 'Hero':
      if (darkFamily) return 'dark';
      if (family === 'editorial' || family === 'luxury') return 'cream';
      if (family === 'minimal') return 'editorial';
      return even ? 'editorial' : 'canvas';
    case 'Gallery':
    case 'Video':
      return index <= 2 ? 'dark' : even ? 'canvas' : 'surface';
    case 'Features':
    case 'Benefits':
      return even ? soft : 'surface';
    case 'Process':
      return even ? 'canvas' : soft;
    case 'Testimonials':
    case 'Speaker':
      return soft;
    case 'Pricing':
    case 'Product':
      return 'surface';
    case 'FAQ':
      return even ? 'canvas' : soft;
    case 'Guarantee':
    case 'CTA':
    case 'LeadForm':
    case 'Countdown':
      return 'accent';
    case 'Footer':
      return darkFamily ? 'dark' : 'canvas';
    default:
      return even ? 'canvas' : 'surface';
  }
}

function productionToneBackground(tone: string): string | null {
  switch (tone) {
    case 'dark':
      return 'linear-gradient(165deg, #0A0A0A 0%, #141414 48%, #0E0E0E 100%)';
    case 'cream':
      return 'linear-gradient(180deg, #F5F1E6 0%, #FAF7F0 52%, #F3EFE4 100%)';
    case 'editorial':
      return 'linear-gradient(180deg, #F8F6F2 0%, #FAFAF8 50%, #FFFFFF 100%)';
    case 'accent':
      return 'linear-gradient(120deg, var(--lp-primary) 0%, color-mix(in srgb, var(--lp-primary) 55%, #0F172A) 100%)';
    case 'organic':
      return 'linear-gradient(180deg, color-mix(in srgb, var(--lp-primary) 8%, #F0FDF4) 0%, #F8FAFC 55%, var(--lp-canvas, #F8FAFC) 100%)';
    case 'data':
      return 'linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 50%, var(--lp-surface) 100%)';
    case 'clinical':
      return 'linear-gradient(180deg, #F0FDFA 0%, #F8FAFC 50%, #FFFFFF 100%)';
    case 'beauty':
      return 'linear-gradient(180deg, #FDF2F8 0%, #FAF5FF 50%, #FFFFFF 100%)';
    case 'warm':
      return 'linear-gradient(180deg, #FFF7ED 0%, #FFFBEB 50%, #FFFFFF 100%)';
    case 'trust':
      return 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 50%, #FFFFFF 100%)';
    case 'surface':
      return 'var(--lp-surface, #FFFFFF)';
    case 'canvas':
      return 'var(--lp-canvas, #F8FAFC)';
    default:
      return null;
  }
}

/**
 * Apply section background + spacing rhythm. Idempotent for already-stamped backgrounds
 * unless `force` is true.
 */
export function applySectionShells(
  blocks: LandingPageBlock[],
  ctx: SectionShellContext,
  opts?: { force?: boolean },
): LandingPageBlock[] {
  const agencyPremium = resolveAgencyPremiumStandard(ctx.architectureId);
  const clinicGold = resolveClinicGoldStandard(ctx.architectureId);
  const saasPremium = resolveSaasPremiumStandard(ctx.architectureId);
  const servicePremium = resolveServicePremiumStandard(ctx.architectureId);
  const consultingPremium = resolveConsultingPremiumStandard(ctx.architectureId);
  const seoPremium = resolveSeoPremiumStandard(ctx.architectureId);
  const websitePremium = resolveWebsitePremiumStandard(ctx.architectureId);
  const productPremium = resolveProductPremiumStandard(ctx.architectureId);
  const fashionPremium = resolveFashionPremiumStandard(ctx.architectureId);
  const cosmeticsPremium = resolveCosmeticsPremiumStandard(ctx.architectureId);
  const hasGold =
    agencyPremium ||
    clinicGold ||
    saasPremium ||
    servicePremium ||
    consultingPremium ||
    seoPremium ||
    websitePremium ||
    productPremium ||
    fashionPremium ||
    cosmeticsPremium;

  return blocks.map((block, index) => {
    const existingTone = (block.style as { lpSectionTone?: string } | undefined)?.lpSectionTone;
    if (!opts?.force && block.background && existingTone) return block;
    const goldBg = agencyPremium
      ? goldSectionBackground(goldSectionTone(agencyPremium, block.type, index))
      : clinicGold
        ? clinicGoldSectionBackground(clinicGoldSectionTone(clinicGold, block.type, index))
        : saasPremium
          ? saasGoldSectionBackground(saasGoldSectionTone(saasPremium, block.type, index))
          : servicePremium
            ? serviceGoldSectionBackground(serviceGoldSectionTone(servicePremium, block.type, index))
            : consultingPremium
              ? consultingGoldSectionBackground(
                  consultingGoldSectionTone(consultingPremium, block.type, index),
                )
              : seoPremium
                ? seoGoldSectionBackground(seoGoldSectionTone(seoPremium, block.type, index))
                : websitePremium
                  ? websiteGoldSectionBackground(
                      websiteGoldSectionTone(websitePremium, block.type, index),
                    )
                  : productPremium
                    ? productGoldSectionBackground(
                        productGoldSectionTone(productPremium, block.type, index),
                      )
                    : fashionPremium
                      ? fashionGoldSectionBackground(
                          fashionGoldSectionTone(fashionPremium, block.type, index),
                        )
                      : cosmeticsPremium
                        ? cosmeticsGoldSectionBackground(
                            cosmeticsGoldSectionTone(cosmeticsPremium, block.type, index),
                          )
                        : null;
    const shell = goldBg
      ? { background: goldBg, spacing: shellForBlock(block.type, index, ctx, block.variant).spacing }
      : shellForBlock(block.type, index, ctx, block.variant);
    const next: LandingPageBlock = { ...block };
    if (shell.background) next.background = shell.background;
    if (shell.spacing && (!block.spacing || block.spacing === 'md')) {
      next.spacing = shell.spacing;
    }
    // Section tone — gold systems first; ungilded use SaaS-quality production rhythm.
    let tone: string | undefined;
    if (agencyPremium) {
      tone = goldSectionTone(agencyPremium, block.type, index);
    } else if (clinicGold) {
      tone = clinicGoldSectionTone(clinicGold, block.type, index);
    } else if (saasPremium) {
      tone = saasGoldSectionTone(saasPremium, block.type, index);
    } else if (servicePremium) {
      tone = serviceGoldSectionTone(servicePremium, block.type, index);
    } else if (consultingPremium) {
      tone = consultingGoldSectionTone(consultingPremium, block.type, index);
    } else if (seoPremium) {
      tone = seoGoldSectionTone(seoPremium, block.type, index);
    } else if (websitePremium) {
      tone = websiteGoldSectionTone(websitePremium, block.type, index);
    } else if (productPremium) {
      tone = productGoldSectionTone(productPremium, block.type, index);
    } else if (fashionPremium) {
      tone = fashionGoldSectionTone(fashionPremium, block.type, index);
    } else if (cosmeticsPremium) {
      tone = cosmeticsGoldSectionTone(cosmeticsPremium, block.type, index);
    } else {
      tone = productionRhythmTone(block.type, index, ctx);
      const prodBg = productionToneBackground(tone);
      if (prodBg) next.background = prodBg;
    }
    if (!tone && shell.background) {
      if (
        shell.background.includes('#0B1220') ||
        shell.background.includes('#020617') ||
        shell.background.includes('#111827') ||
        shell.background.includes('#0A0A0A') ||
        shell.background.includes('#141414') ||
        shell.background.startsWith('linear-gradient(165deg, #0A0A0A')
      ) {
        tone = 'dark';
      } else if (shell.background.includes('F5F1E6') || shell.background.includes('FAF7F0')) {
        tone = 'cream';
      } else if (shell.background.includes('F8F6F2') || shell.background.includes('FAFAF8')) {
        tone = 'editorial';
      } else if (shell.background.startsWith('linear-gradient(120deg, var(--lp-primary)')) {
        tone = 'accent';
      }
    }
    if (!tone && !hasGold) {
      tone = productionRhythmTone(block.type, index, ctx);
    }
    if (tone) {
      next.style = {
        ...(next.style || {}),
        lpSectionTone: tone,
      } as LandingPageBlock['style'];
    }
    return next;
  });
}

/** Stock image for CTA/Hero/Gallery shells — verified Unsplash pool only. */
export function defaultCtaBackdropUrl(category: string, variantIndex: number): string {
  return verifiedBackdropUrl(category, variantIndex);
}
