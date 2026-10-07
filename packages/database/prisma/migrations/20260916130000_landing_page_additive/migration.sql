-- CreateEnum
CREATE TYPE "LandingPageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LandingPageTheme" AS ENUM ('MODERN', 'PREMIUM', 'MINIMAL', 'BOLD', 'CORPORATE');

-- CreateEnum
CREATE TYPE "LandingPageDomainStatus" AS ENUM ('PENDING', 'VERIFYING', 'ACTIVE', 'FAILED');

-- CreateEnum
CREATE TYPE "LandingPageEventType" AS ENUM ('PAGE_VIEW', 'CTA_CLICK', 'FORM_START', 'FORM_SUBMIT', 'LEAD');

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "landing_page_block_id" VARCHAR(64),
ADD COLUMN     "landing_page_id" TEXT;

-- CreateTable
CREATE TABLE "landing_page_templates" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "theme" "LandingPageTheme" NOT NULL DEFAULT 'MODERN',
    "description" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "thumbnail_url" VARCHAR(2000),
    "definition" JSONB NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_page_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_pages" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "template_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "LandingPageStatus" NOT NULL DEFAULT 'DRAFT',
    "theme" "LandingPageTheme" NOT NULL DEFAULT 'MODERN',
    "draft_spec" JSONB NOT NULL,
    "published_spec" JSONB,
    "seo_title" VARCHAR(200),
    "seo_description" VARCHAR(500),
    "seo_canonical" VARCHAR(2000),
    "og_image" VARCHAR(2000),
    "robots_index" BOOLEAN NOT NULL DEFAULT true,
    "subdomain_slug" TEXT,
    "custom_domain" VARCHAR(255),
    "custom_domain_status" "LandingPageDomainStatus",
    "custom_domain_error" VARCHAR(500),
    "custom_domain_verified_at" TIMESTAMP(3),
    "tracking_config" JSONB,
    "preview_token" VARCHAR(64),
    "preview_expires_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_page_versions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "landing_page_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" VARCHAR(500),
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landing_page_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_page_events" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "landing_page_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "event_type" "LandingPageEventType" NOT NULL,
    "visitor_id" VARCHAR(80),
    "session_id" VARCHAR(80),
    "device" VARCHAR(40),
    "utm_source" VARCHAR(120),
    "utm_medium" VARCHAR(120),
    "utm_campaign" VARCHAR(160),
    "utm_content" VARCHAR(160),
    "utm_term" VARCHAR(160),
    "referrer" VARCHAR(2000),
    "meta" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landing_page_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_profiles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "brand_name" VARCHAR(120),
    "company_name" VARCHAR(160),
    "website" VARCHAR(2000),
    "industry" VARCHAR(120),
    "description" TEXT,
    "product_service" VARCHAR(400),
    "target_customer" VARCHAR(400),
    "usp" VARCHAR(800),
    "hotline" VARCHAR(40),
    "email" VARCHAR(160),
    "address" VARCHAR(500),
    "logo_url" VARCHAR(2000),
    "brand_color" VARCHAR(32),
    "facebook_url" VARCHAR(2000),
    "social_links" JSONB,
    "default_cta" VARCHAR(80),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "landing_page_templates_organization_id_updated_at_idx" ON "landing_page_templates"("organization_id", "updated_at");

-- CreateIndex
CREATE INDEX "landing_page_templates_slug_idx" ON "landing_page_templates"("slug");

-- CreateIndex
CREATE INDEX "landing_page_templates_is_system_slug_idx" ON "landing_page_templates"("is_system", "slug");

-- CreateIndex
CREATE INDEX "landing_page_templates_is_system_category_idx" ON "landing_page_templates"("is_system", "category");

-- CreateIndex
CREATE UNIQUE INDEX "landing_pages_subdomain_slug_key" ON "landing_pages"("subdomain_slug");

-- CreateIndex
CREATE UNIQUE INDEX "landing_pages_custom_domain_key" ON "landing_pages"("custom_domain");

-- CreateIndex
CREATE UNIQUE INDEX "landing_pages_preview_token_key" ON "landing_pages"("preview_token");

-- CreateIndex
CREATE INDEX "landing_pages_organization_id_status_updated_at_idx" ON "landing_pages"("organization_id", "status", "updated_at");

-- CreateIndex
CREATE INDEX "landing_pages_organization_id_subdomain_slug_idx" ON "landing_pages"("organization_id", "subdomain_slug");

-- CreateIndex
CREATE INDEX "landing_pages_custom_domain_idx" ON "landing_pages"("custom_domain");

-- CreateIndex
CREATE INDEX "landing_pages_preview_expires_at_idx" ON "landing_pages"("preview_expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "landing_pages_organization_id_slug_key" ON "landing_pages"("organization_id", "slug");

-- CreateIndex
CREATE INDEX "landing_page_versions_organization_id_landing_page_id_creat_idx" ON "landing_page_versions"("organization_id", "landing_page_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "landing_page_versions_landing_page_id_version_key" ON "landing_page_versions"("landing_page_id", "version");

-- CreateIndex
CREATE INDEX "landing_page_events_organization_id_landing_page_id_event_t_idx" ON "landing_page_events"("organization_id", "landing_page_id", "event_type", "occurred_at");

-- CreateIndex
CREATE INDEX "landing_page_events_organization_id_occurred_at_idx" ON "landing_page_events"("organization_id", "occurred_at");

-- CreateIndex
CREATE INDEX "landing_page_events_organization_id_utm_source_utm_campaign_idx" ON "landing_page_events"("organization_id", "utm_source", "utm_campaign");

-- CreateIndex
CREATE INDEX "landing_page_events_organization_id_visitor_id_idx" ON "landing_page_events"("organization_id", "visitor_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_organization_id_key" ON "business_profiles"("organization_id");

-- CreateIndex
CREATE INDEX "leads_landing_page_id_idx" ON "leads"("landing_page_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "landing_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_page_templates" ADD CONSTRAINT "landing_page_templates_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "landing_page_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_page_versions" ADD CONSTRAINT "landing_page_versions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_page_versions" ADD CONSTRAINT "landing_page_versions_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "landing_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_page_events" ADD CONSTRAINT "landing_page_events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_page_events" ADD CONSTRAINT "landing_page_events_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "landing_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

