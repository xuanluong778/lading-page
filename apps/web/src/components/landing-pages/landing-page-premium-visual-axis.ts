/**
 * Premium production visual axis — SaaS-gold quality for all 200 templates.
 * Scoped via [data-lp-canvas-root]; no per-slug rules. v23 production pass.
 *
 * Rhythm: base → soft/tinted → brand → contrast/dark → CTA
 * Cards: elevated / bordered / tinted / accent / dark / editorial / image-card
 */

export const LP_PREMIUM_VISUAL_AXIS_CSS = `
/* ═══ Content axis lock — centered body, single gutter ═══ */
[data-lp-canvas-root] {
  overflow-x: clip;
  --lp-gutter: clamp(1rem, 3.2vw, 1.5rem);
}
[data-lp-canvas-root] [data-lp-container-inner],
[data-lp-canvas-root] [data-lp-header-inner],
[data-lp-canvas-root] [data-lp-footer-inner],
[data-lp-canvas-root] .max-w-3xl,
[data-lp-canvas-root] .max-w-5xl,
[data-lp-canvas-root] .max-w-6xl {
  width: 100%;
  max-width: min(var(--lp-container, 68rem), 100%);
  margin-inline: auto;
  padding-inline: var(--lp-gutter, clamp(1rem, 3.2vw, 1.5rem));
  box-sizing: border-box;
}
[data-lp-canvas-root] [data-lp-cards-grid],
[data-lp-canvas-root] [data-lp-pricing-grid],
[data-lp-canvas-root] [data-lp-testimonials-grid],
[data-lp-canvas-root] [data-lp-process-grid],
[data-lp-canvas-root] [data-lp-stats-grid],
[data-lp-canvas-root] [data-lp-gallery-grid] {
  width: 100%;
  margin-inline: 0;
  justify-items: stretch;
}
[data-lp-canvas-root] [data-lp-form-card],
[data-lp-canvas-root] [data-lp-cta-band],
[data-lp-canvas-root] [data-lp-cta-split] {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  box-sizing: border-box;
}
[data-lp-canvas-root] img[data-lp-content-image],
[data-lp-canvas-root] [data-lp-img-fallback] {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

/* ═══ Section color rhythm — tone drives visible surface ═══ */
[data-lp-canvas-root] [data-lp-section-tone="canvas"] {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--lp-primary) 5%, var(--lp-canvas, #f8fafc)) 0%,
    var(--lp-canvas, #f8fafc) 45%,
    color-mix(in srgb, var(--lp-surface-alt, var(--lp-surface)) 35%, var(--lp-canvas)) 100%
  ) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="surface"] {
  background: var(--lp-surface, #fff) !important;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--lp-border, #e2e8f0) 55%, transparent);
}
[data-lp-canvas-root] [data-lp-section-tone="cream"] {
  background-color: #faf7f0 !important;
  background-image: linear-gradient(180deg, #f5f1e6 0%, #faf7f0 52%, #f3efe4 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="editorial"] {
  background-color: #fafaf8 !important;
  background-image: linear-gradient(180deg, #f8f6f2 0%, #fafaf8 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="glow"] {
  /* default = light warm (cosmetics / soft industries); SaaS overrides below */
  background-color: #ffedd5 !important;
  background-image: linear-gradient(120deg, #fff7ed 0%, #ffedd5 45%, #fef3c7 100%) !important;
  color: #0f172a;
}
[data-lp-category="saas"] [data-lp-canvas-root] [data-lp-section-tone="glow"],
[data-lp-gold-standard="ai-modern"] [data-lp-section-tone="glow"],
[data-lp-gold-standard="product-led"] [data-lp-section-tone="glow"] {
  background-color: #1e1b4b !important;
  background-image: linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #0f172a 100%) !important;
  color: #f8fafc;
}
[data-lp-canvas-root] [data-lp-section-tone="luxury"] {
  background-color: #1c1917 !important;
  background-image: linear-gradient(165deg, #1c1917 0%, #292524 48%, #0c0a09 100%) !important;
  color: #fafaf9;
}
[data-lp-canvas-root] [data-lp-section-tone="dark"] {
  background-color: #0a0a0a !important;
  background-image: linear-gradient(165deg, #0a0a0a 0%, #141414 48%, #0e0e0e 100%) !important;
  color: #f5f5f4;
}
[data-lp-canvas-root] [data-lp-section-tone="authority"] {
  background-color: #0b1220 !important;
  background-image: linear-gradient(165deg, #0b1220 0%, #111827 52%, #0f172a 100%) !important;
  color: #f8fafc;
}
[data-lp-canvas-root] [data-lp-section-tone="accent"] {
  background-color: var(--lp-primary) !important;
  background-image: linear-gradient(
    120deg,
    var(--lp-primary) 0%,
    color-mix(in srgb, var(--lp-primary) 58%, #0a0a0a) 100%
  ) !important;
  color: #fff;
}
[data-lp-canvas-root] [data-lp-section-tone="organic"] {
  background-color: #f0fdf4 !important;
  background-image: linear-gradient(
    180deg,
    color-mix(in srgb, var(--lp-primary) 8%, #f0fdf4) 0%,
    #f8fafc 55%,
    var(--lp-canvas, #f8fafc) 100%
  ) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="data"] {
  background-color: #eef2ff !important;
  background-image: linear-gradient(180deg, #eef2ff 0%, #f8fafc 50%, var(--lp-surface) 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="clinical"] {
  background-color: #f0fdfa !important;
  background-image: linear-gradient(180deg, #f0fdfa 0%, #f8fafc 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="beauty"] {
  background-color: #fdf2f8 !important;
  background-image: linear-gradient(180deg, #fdf2f8 0%, #faf5ff 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="warm"] {
  background-color: #fffbeb !important;
  background-image: linear-gradient(180deg, #fff7ed 0%, #fffbeb 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="trust"] {
  background-color: #eff6ff !important;
  background-image: linear-gradient(180deg, #eff6ff 0%, #f8fafc 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="sage"],
[data-lp-canvas-root] [data-lp-section-tone="craft"] {
  background-color: #ecfdf5 !important;
  background-image: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="showcase"],
[data-lp-canvas-root] [data-lp-section-tone="dev"] {
  background-color: #f8fafc !important;
  background-image: linear-gradient(180deg, #f1f5f9 0%, #f8fafc 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="local"] {
  background-color: #f0fdfa !important;
  background-image: linear-gradient(180deg, #ecfeff 0%, #f0fdfa 50%, #fff 100%) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="corporate"] {
  background-color: #eef2ff !important;
  background-image: linear-gradient(180deg, #eef2ff 0%, #f8fafc 50%, #fff 100%) !important;
}

/* Soft brand tint on even surface slots — breaks white streaks */
[data-lp-canvas-root] [data-lp-block-slot]:nth-child(4n + 2) [data-lp-section-tone="surface"] {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--lp-primary) 4%, var(--lp-surface)) 0%,
    var(--lp-surface) 100%
  ) !important;
}
[data-lp-canvas-root] [data-lp-block-slot]:nth-child(4n + 3) [data-lp-section-tone="canvas"] {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--lp-surface-alt, #f1f5f9) 65%, var(--lp-canvas)) 0%,
    var(--lp-canvas) 100%
  ) !important;
}

/* ═══ Typography hierarchy by designFamily ═══ */
[data-lp-design-family="editorial"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="editorial"] {
  --lp-heading-font: "Playfair Display", "Fraunces", Georgia, serif;
  --lp-body-font: "DM Sans", "Inter", system-ui, sans-serif;
}
[data-lp-design-family="minimal"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="minimal"] {
  --lp-heading-font: "Oswald", "Inter", sans-serif;
  --lp-body-font: "Inter", "Segoe UI", system-ui, sans-serif;
}
[data-lp-design-family="luxury"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="luxury"] {
  --lp-heading-font: "Cormorant Garamond", "Playfair Display", Georgia, serif;
  --lp-body-font: "Manrope", "DM Sans", system-ui, sans-serif;
}
[data-lp-design-family="bold"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="bold"],
[data-lp-design-family="conversion"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="conversion"] {
  --lp-heading-font: "Oswald", "Inter", sans-serif;
  --lp-body-font: "Inter", "Segoe UI", system-ui, sans-serif;
}
[data-lp-design-family="organic"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="organic"] {
  --lp-heading-font: "Fraunces", "Playfair Display", Georgia, serif;
  --lp-body-font: "Manrope", "DM Sans", system-ui, sans-serif;
}
[data-lp-design-family="corporate"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="corporate"] {
  --lp-heading-font: "Inter", "IBM Plex Sans", sans-serif;
  --lp-body-font: "IBM Plex Sans", "Inter", system-ui, sans-serif;
}
[data-lp-design-family="portfolio"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="portfolio"] {
  --lp-heading-font: "Playfair Display", "Fraunces", Georgia, serif;
  --lp-body-font: "DM Sans", "Inter", system-ui, sans-serif;
}
[data-lp-design-family="local"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="local"] {
  --lp-heading-font: "Plus Jakarta Sans", "Manrope", sans-serif;
  --lp-body-font: "Manrope", "Plus Jakarta Sans", system-ui, sans-serif;
}
[data-lp-design-family="product"] [data-lp-canvas-root],
[data-lp-canvas-root][data-lp-design-family="product"] {
  --lp-heading-font: "Space Grotesk", "Inter", sans-serif;
  --lp-body-font: "Inter", "DM Sans", system-ui, sans-serif;
}
[data-lp-canvas-root] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-head] h2,
[data-lp-canvas-root] h1,
[data-lp-canvas-root] h2 {
  font-family: var(--lp-heading-font, inherit);
  font-weight: var(--lp-fw-heading, 700);
  line-height: var(--lp-lh-heading, 1.15);
  letter-spacing: -0.02em;
  text-wrap: balance;
  overflow-wrap: break-word;
  max-width: 100%;
}
[data-lp-canvas-root] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-card-item] p,
[data-lp-canvas-root] body,
[data-lp-canvas-root] {
  font-family: var(--lp-body-font, inherit);
}
[data-lp-canvas-root] [data-lp-section-eyebrow],
[data-lp-canvas-root] [data-lp-hero-copy] [data-lp-inline-field="eyebrow"],
[data-lp-canvas-root] .lp-eyebrow {
  font-family: var(--lp-body-font, inherit);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}
[data-lp-canvas-root] [data-lp-hero-copy] h1 {
  font-size: var(--lp-fs-hero, clamp(2rem, 4.8vw, 3.25rem));
  line-height: 1.08;
}
[data-lp-canvas-root] [data-lp-section-head] h2 {
  font-size: clamp(1.375rem, 2.6vw, 2rem);
}

/* ═══ Hero prominence ═══ */
[data-lp-canvas-root] [data-lp-block-slot]:has([data-lp-hero-copy]) section,
[data-lp-canvas-root] [data-lp-block-slot]:has([data-lp-hero-copy]) header {
  min-height: min(44vh, 480px);
  /* Kill stacked top padding (section py-* + foundation padding-block) —
     was rendering as a dead white band above hero copy on blank LPs. */
  padding-top: 0 !important;
}
[data-lp-canvas-root] [data-lp-variant="minimal-copy"] {
  position: relative;
}
[data-lp-canvas-root] [data-lp-variant="minimal-copy"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 50% 0%,
    color-mix(in srgb, var(--lp-primary) 9%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
}
[data-lp-canvas-root] [data-lp-variant="minimal-copy"] [data-lp-hero-copy] {
  position: relative;
  z-index: 1;
  padding-top: 0;
  padding-bottom: clamp(2rem, 5vw, 3.5rem);
  max-width: min(var(--lp-text-width, 40rem), 100%);
  margin-inline: auto;
  text-align: center;
}
[data-lp-canvas-root] [data-lp-variant="minimal-copy"] [data-lp-hero-copy] h1 {
  font-size: clamp(2rem, 4.8vw, 3.25rem);
  letter-spacing: -0.035em;
  line-height: 1.08;
}
[data-lp-canvas-root] [data-lp-variant="centered"] [data-lp-hero-copy] {
  padding-top: 0;
  padding-bottom: clamp(2.25rem, 5.5vw, 4rem);
  text-align: center;
  margin-inline: auto;
  max-width: min(var(--lp-text-width, 42rem), 100%);
}
[data-lp-canvas-root] [data-lp-variant="split-left"] [data-lp-hero-grid],
[data-lp-canvas-root] [data-lp-variant="split-right"] [data-lp-hero-grid] {
  padding-top: 0;
  padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
  align-items: center;
}
[data-lp-canvas-root] [data-lp-hero-cta] a {
  font-weight: 700;
  letter-spacing: 0.01em;
  min-height: 2.75rem;
  box-shadow: 0 10px 28px color-mix(in srgb, var(--lp-primary) 32%, rgba(15, 23, 42, 0.18));
}

/* ═══ Card system — elevated / bordered / tinted / accent / editorial / image ═══ */
[data-lp-canvas-root] [data-lp-card-item] {
  border-radius: var(--lp-radius, 12px);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
/* elevated (default grid) */
[data-lp-canvas-root] [data-lp-list-variant="icon-grid"] [data-lp-card-item],
[data-lp-canvas-root] [data-lp-cards-grid] > [data-lp-card-item],
[data-lp-canvas-root] [data-lp-free-surface][data-lp-cards-grid] [data-lp-card-item] {
  background: linear-gradient(
    165deg,
    var(--lp-surface) 0%,
    color-mix(in srgb, var(--lp-primary) 5%, var(--lp-surface)) 100%
  );
  border: 1px solid color-mix(in srgb, var(--lp-primary) 12%, var(--lp-border, #e2e8f0));
  box-shadow: var(--lp-card-shadow-elevated, 0 10px 28px rgba(15, 23, 42, 0.1));
}
/* bordered / accent-left */
[data-lp-canvas-root] [data-lp-list-variant="numbered"] [data-lp-card-item] {
  border-left: 4px solid var(--lp-primary);
  background: var(--lp-surface);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}
/* editorial / minimal — hairline, no box */
[data-lp-canvas-root] [data-lp-list-variant="editorial-list"] [data-lp-card-item],
[data-lp-canvas-root] [data-lp-list-variant="minimal-list"] [data-lp-card-item] {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid color-mix(in srgb, var(--lp-border) 70%, transparent) !important;
  border-radius: 0 !important;
  padding-inline: 0 !important;
}
/* alternating — elevated bordered */
[data-lp-canvas-root] [data-lp-list-variant="alternating"] [data-lp-card-item] {
  background: var(--lp-surface);
  border: 1px solid color-mix(in srgb, var(--lp-border) 85%, transparent);
  box-shadow: var(--lp-card-shadow-elevated, 0 10px 28px rgba(15, 23, 42, 0.1));
  padding: 1.25rem 1.35rem;
}
/* image-card / gallery */
[data-lp-canvas-root] [data-lp-gallery-variant="masonry"] [data-lp-card-item],
[data-lp-canvas-root] [data-lp-gallery-variant="editorial-mosaic"] [data-lp-card-item],
[data-lp-canvas-root] [data-lp-gallery-variant="featured-plus-grid"] [data-lp-card-item] {
  padding: 0;
  overflow: hidden;
  border: none;
  box-shadow: var(--lp-card-shadow-elevated, 0 12px 32px rgba(15, 23, 42, 0.12));
}
[data-lp-canvas-root] [data-lp-gallery-variant] [data-lp-card-item] > div:last-child,
[data-lp-canvas-root] [data-lp-gallery-variant] [data-lp-card-item] .min-w-0 {
  padding: 1rem 1.1rem 1.15rem;
}
/* tinted accent rotation */
[data-lp-canvas-root] [data-lp-card-item][data-lp-card-accent="1"] {
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.11);
  border-color: color-mix(in srgb, var(--lp-primary) 18%, var(--lp-border, #e2e8f0));
}
[data-lp-canvas-root] [data-lp-card-item][data-lp-card-accent="2"] {
  background: color-mix(in srgb, var(--lp-primary) 4%, var(--lp-surface)) !important;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.07);
}

/* Pricing identity */
[data-lp-canvas-root] [data-lp-pricing-variant] [data-lp-pricing-card] {
  background: var(--lp-surface);
  border: 1px solid color-mix(in srgb, var(--lp-border) 88%, transparent);
  box-shadow: var(--lp-card-shadow-elevated, 0 10px 28px rgba(15, 23, 42, 0.1));
  border-radius: var(--lp-radius, 12px);
}
[data-lp-canvas-root] [data-lp-pricing-card][data-lp-featured="1"] {
  border: 2px solid color-mix(in srgb, var(--lp-primary) 48%, transparent);
  box-shadow: 0 18px 44px color-mix(in srgb, var(--lp-primary) 16%, rgba(15, 23, 42, 0.14));
  transform: translateY(-4px);
}

/* Testimonials identity */
[data-lp-canvas-root] [data-lp-testimonials-variant] [data-lp-card-item] {
  background: var(--lp-surface);
  border: 1px solid color-mix(in srgb, var(--lp-border) 80%, transparent);
  border-left: 3px solid color-mix(in srgb, var(--lp-primary) 55%, transparent);
  box-shadow: var(--lp-card-shadow-elevated, 0 8px 24px rgba(15, 23, 42, 0.08));
}
[data-lp-canvas-root] [data-lp-testimonials-variant="portrait-quotes"] [data-lp-card-item],
[data-lp-canvas-root] [data-lp-testimonials-variant="editorial"] [data-lp-card-item] {
  border-left: none;
  border-top: 3px solid var(--lp-primary);
}

/* CTA identity */
[data-lp-canvas-root] [data-lp-cta-variant="minimal"] [data-lp-cta-band],
[data-lp-canvas-root] [data-lp-cta-variant="minimal"] [data-lp-free-surface] {
  background: color-mix(in srgb, var(--lp-primary) 7%, var(--lp-surface)) !important;
  border: 1px solid color-mix(in srgb, var(--lp-primary) 22%, var(--lp-border));
  border-radius: var(--lp-radius-lg, calc(var(--lp-radius) + 6px));
  padding: 1.35rem 1.5rem;
  box-shadow: var(--lp-card-shadow-elevated, 0 10px 28px rgba(15, 23, 42, 0.09));
}
[data-lp-canvas-root] [data-lp-cta-variant="banner"] [data-lp-cta-band],
[data-lp-canvas-root] [data-lp-cta-variant="split"] [data-lp-cta-split] {
  box-shadow: 0 16px 40px color-mix(in srgb, var(--lp-primary) 22%, rgba(15, 23, 42, 0.2));
}

/* Form identity — conversion zone */
[data-lp-canvas-root] [data-lp-form-variant] [data-lp-form-card] form#lead-form,
[data-lp-canvas-root] [data-lp-form-block] form#lead-form {
  background: linear-gradient(
    165deg,
    var(--lp-surface) 0%,
    color-mix(in srgb, var(--lp-primary) 5%, var(--lp-surface)) 100%
  ) !important;
  border: 1px solid color-mix(in srgb, var(--lp-primary) 18%, var(--lp-border));
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.1);
  border-radius: var(--lp-radius-lg, calc(var(--lp-radius) + 4px));
}
[data-lp-canvas-root] [data-lp-form-card] button[type="submit"] {
  font-weight: 700;
  min-height: 2.75rem;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--lp-primary) 28%, rgba(15, 23, 42, 0.15));
}

[data-lp-canvas-root] [data-lp-guarantee-variant="banner"] > div {
  border: 1px solid color-mix(in srgb, var(--lp-primary) 20%, var(--lp-border));
  background: color-mix(in srgb, var(--lp-primary) 8%, var(--lp-surface));
  border-radius: var(--lp-radius-md, var(--lp-radius));
  box-shadow: var(--lp-card-shadow-elevated, 0 8px 24px rgba(15, 23, 42, 0.08));
}

/* Design family radius / density accents */
[data-lp-design-family="minimal"] [data-lp-canvas-root] {
  --lp-radius: 8px;
  --lp-card-shadow-elevated: 0 8px 24px rgba(15, 23, 42, 0.09);
}
[data-lp-design-family="bold"] [data-lp-canvas-root] [data-lp-hero-copy] h1 {
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
[data-lp-design-family="luxury"] [data-lp-canvas-root] [data-lp-card-item] {
  border-radius: calc(var(--lp-radius) + 4px);
}
[data-lp-design-family="corporate"] [data-lp-canvas-root] [data-lp-pricing-card] {
  border-radius: var(--lp-radius-md, var(--lp-radius));
}
[data-lp-design-family="organic"] [data-lp-canvas-root] [data-lp-card-item] {
  border-radius: var(--lp-radius-lg, calc(var(--lp-radius) + 8px));
}

/* Dark / accent / authority / luxury / saas-glow — readable heads */
[data-lp-canvas-root] [data-lp-section-tone="dark"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="authority"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="luxury"] [data-lp-hero-copy] h1,
[data-lp-category="saas"] [data-lp-section-tone="glow"] [data-lp-hero-copy] h1,
[data-lp-gold-standard="ai-modern"] [data-lp-section-tone="glow"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="dark"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="authority"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="luxury"] [data-lp-section-head] h2,
[data-lp-category="saas"] [data-lp-section-tone="glow"] [data-lp-section-head] h2,
[data-lp-gold-standard="ai-modern"] [data-lp-section-tone="glow"] [data-lp-section-head] h2 {
  color: #fafaf9 !important;
}
[data-lp-canvas-root] [data-lp-section-tone="dark"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="authority"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="luxury"] [data-lp-hero-copy] p,
[data-lp-category="saas"] [data-lp-section-tone="glow"] [data-lp-hero-copy] p,
[data-lp-gold-standard="ai-modern"] [data-lp-section-tone="glow"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="dark"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="authority"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="luxury"] [data-lp-section-head] p,
[data-lp-category="saas"] [data-lp-section-tone="glow"] [data-lp-section-head] p,
[data-lp-gold-standard="ai-modern"] [data-lp-section-tone="glow"] [data-lp-section-head] p {
  color: #d4d4d8 !important;
}
[data-lp-canvas-root] [data-lp-section-tone="accent"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="accent"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="accent"] [data-lp-section-head] h2 {
  color: #fff !important;
}
[data-lp-canvas-root] [data-lp-section-tone="accent"] [data-lp-section-head] p {
  color: #f1f5f9 !important;
}

/* Light tones — never inherit white hero/section text (dark themes too) */
[data-lp-canvas-root] [data-lp-section-tone="canvas"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="surface"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="cream"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="cream"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="editorial"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="editorial"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="beauty"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="beauty"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="organic"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="organic"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="data"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="data"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="clinical"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="clinical"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="warm"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="warm"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="trust"] [data-lp-hero-copy] h1,
[data-lp-canvas-root] [data-lp-section-tone="trust"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="sage"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="craft"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="showcase"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="corporate"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="local"] [data-lp-section-head] h2,
[data-lp-category="cosmetics"] [data-lp-section-tone="glow"] [data-lp-hero-copy] h1,
[data-lp-category="cosmetics"] [data-lp-section-tone="glow"] [data-lp-section-head] h2,
[data-lp-canvas-root] [data-lp-section-tone="glow"] [data-lp-section-head] h2 {
  color: var(--lp-text-on-light, #0f172a) !important;
}
[data-lp-canvas-root] [data-lp-section-tone="canvas"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="surface"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="cream"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="cream"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="editorial"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="editorial"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="beauty"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="beauty"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="organic"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="organic"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="data"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="data"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="clinical"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="clinical"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="warm"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="warm"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="trust"] [data-lp-hero-copy] p,
[data-lp-canvas-root] [data-lp-section-tone="trust"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="sage"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="craft"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="showcase"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="corporate"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="local"] [data-lp-section-head] p,
[data-lp-category="cosmetics"] [data-lp-section-tone="glow"] [data-lp-hero-copy] p,
[data-lp-category="cosmetics"] [data-lp-section-tone="glow"] [data-lp-section-head] p,
[data-lp-canvas-root] [data-lp-section-tone="glow"] [data-lp-section-head] p {
  color: var(--lp-muted-on-light, #475569) !important;
}

/* Responsive — keep axis on tablet/mobile */
@media (max-width: 1023px) {
  [data-lp-canvas-root] [data-lp-hero-grid],
  [data-lp-canvas-root] [data-lp-cards-grid],
  [data-lp-canvas-root] [data-lp-pricing-grid],
  [data-lp-canvas-root] [data-lp-testimonials-grid] {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  [data-lp-canvas-root] [data-lp-pricing-card][data-lp-featured="1"] {
    transform: none;
  }
}
@media (max-width: 640px) {
  [data-lp-canvas-root] {
    --lp-gutter: 1rem;
  }
  [data-lp-canvas-root] [data-lp-hero-copy] h1 {
    font-size: clamp(1.75rem, 8vw, 2.35rem);
  }
}
`.trim();
