# baraka Stock Landing Page CMS

## Overview

A multilingual Content Management System (CMS) for managing stock landing pages for the baraka fintech application. The system supports 10,000+ stock pages with English (LTR) and Arabic (RTL) language support, combining real-time market data widgets with long-form editorial content.

The CMS provides:
- Stock page management with metadata, content blocks, and SEO configuration
- Live preview functionality with language switching
- Internal linking between related stocks
- Asset library for images, videos, and documents
- Blog and banner management modules
- **Newsletter + Spotlight + Blog Sync Module**: Content marketing automation with:
  - Newsletter management with templates and block-based content editing
  - Spotlight banners with scheduling and multi-placement targeting
  - Automatic spotlight/newsletter creation when blog posts are published
  - Subscriber management with CSV import
  - Public API endpoints for content consumption
  - Audit logging for all content operations
- **Newsletter Block System**: Comprehensive block editing for newsletters:
  - **Template-Based Architecture**: Templates define which block types are available per zone
    - Templates managed at `/admin/newsletter-templates`
    - Zone-based configuration (header/body/footer zones with constraints)
    - Per-block-type enabling/disabling with default value configuration
    - Newsletter editor automatically filters available blocks based on assigned template
  - **12 custom content block types** with inline search:
    - **Hero**: Main header with title, subtitle, image and CTA
    - **Introduction**: Title, subtitle, body text for newsletter opening
    - **Featured Content**: Curated articles with inline article search
    - **Articles List**: Multiple articles with excerpts and inline search
    - **Stock Collection**: Multiple stocks with inline stock search
    - **Assets Under $500**: Affordable stocks with inline search
    - **What Users Picked**: User-favorite stocks with inline search
    - **Asset Highlight**: Single featured stock with detailed description
    - **Term Of The Day**: Financial term with definition and example
    - **In Other News**: External news items with headlines and sources
    - **Call To Action**: CTA section with button text and URL
    - **Footer**: Legal text, company info, unsubscribe link
  - Stock search integrated into block editors (searches StockPage entities)
  - Article search integrated into content blocks (searches BlogPost entities)
  - NewsletterBlockInstances for per-newsletter block editing with add/update/delete/reorder
  - **Template Default Merging**: When adding blocks, template defaults are merged with base block defaults
- **Compliance Scanner Module** (`/admin/compliance`): Content compliance checking for fintech regulatory requirements:
  - **Rules & Keywords Tab**: Manage 60+ compliance rules with categories (guaranteed_returns, fomo_urgency, misleading_claims, advice_language, regulatory_claims, personalized_claims, performance_claims)
  - **Match Types**: Exact (word boundaries), Contains (substring), Regex (custom patterns)
  - **Scan Content Tab**: Scan blog posts, custom text, or external URLs for compliance issues
  - **URL Scanner**: Fetches and extracts text from URLs with SSRF protection (blocks private IPs, metadata endpoints, validates redirects)
  - **Scan History Tab**: Review past scans with approve/reject workflow
  - **Severity Levels**: low, medium, high, critical with visual indicators
  - **CSV Export**: Export all rules for backup/analysis
  - **Security Note**: URL scanning includes SSRF protections but does not perform DNS resolution validation; for maximum security in production, consider using an allowlist of trusted domains
- **Bond Pages Module** (`/admin/bonds`): Fixed income investment page management mirroring stock page architecture:
  - **Admin List Page**: Multi-dimensional filters (status, currency, issuer type, risk level) with stats dashboard
  - **Editor with Simple/Pro Mode**: Toggle between simplified and advanced field views
    - **Basics Tab**: Identity (title, slug, ISIN, CUSIP), classification (instrument/issuer/coupon type, seniority), key metrics
    - **Pricing & Yield Tab** (Pro): Clean/dirty price, YTM, current yield, bid/ask prices and yields
    - **Cashflow Tab** (Pro): Coupon frequency, payment dates, principal repayment type
    - **Risk & Credit Tab** (Pro): Duration, convexity, risk notes, credit ratings
    - **Liquidity Tab** (Pro): Liquidity score, trading volume, platform availability
    - **Content Tab**: Hero summary, how it works, risk disclosure (bilingual EN/AR)
    - **SEO Tab**: Meta titles, descriptions, OG tags for both languages
    - **Compliance Tab**: Run compliance scans, view status, publish gating
  - **11 Bond-Specific Block Types**: bond_hero, key_facts, income_calculator, coupon_schedule, risk_summary, charts, issuer_profile, liquidity_exit, similar_bonds, faq, disclosures
  - **Compliance Integration**: Dedicated scan endpoint with keyword matching, violation detection, publish blocking
  - **Public Landing Page** (`/bonds`): Browse all bonds with search, featured bonds section, and full listing
  - **Public Detail Page** (`/bonds/:slug`): Renders bond metrics, issuer profile, risk disclosures, trading info
  - **Seed Data**: 6 sample bonds auto-loaded on startup (3 featured: US Treasury, UAE Government, High Yield Corp)
  - **Bond Types**: BondInstrumentType, BondIssuerType, BondCouponType, BondSeniority, BondRiskLevel for type safety
- **Crypto Pages Module** (`/admin/crypto`): Full CMS for cryptocurrency landing pages:
  - **Admin List Page** (`/admin/crypto`): Multi-dimensional filters (status, asset type, compliance, featured) with stats dashboard, search, bulk actions
  - **Admin Editor Page** (`/admin/crypto/:id/edit`): Multi-tab editor with Simple/Pro mode toggle:
    - **Basics Tab**: Identity (name, symbol, title EN/AR, slug - read-only), CoinGecko ID, asset type, market cap rank, featured/stablecoin/editorial lock toggles
    - **Content Tab**: Hero summary, WYSIWYG editors for whatIsIt, howItWorks, risks (EN/AR), disclaimers management
    - **Modules Tab** (Pro): Page module configuration for flexible layout (hero, price_chart, key_stats, markets_table, news_feed, about, how_it_works, use_cases, faq, risk_callout, disclosures, related_assets, quick_trade_cta)
    - **SEO Tab**: Meta titles, descriptions, OG tags for both EN/AR languages
    - **Compliance Tab**: Run compliance scans, view violations, compliance status
    - **Live Data Tab** (Pro): Read-only view of real-time market data from CoinGecko
  - **Slug Immutability**: Slug is system-generated as `{symbol}-{coingeckoId}` on create and cannot be edited in UI or updated via API
  - **Publish Gating**: API validates required fields (title_en, slug, coingeckoId, risks_en, disclaimers_en, complianceStatus='pass') before allowing status='published'
  - **Seed Data**: 3 sample crypto pages (Bitcoin, Ethereum, Tether) auto-loaded on startup for testing
  - **Seed Script**: `scripts/seed-crypto-top100.ts` generates pages for top 100 cryptos from CoinGecko with editorial content, bilingual support, and mandatory disclaimers
  - **Demo Gallery**: `/crypto/demo-gallery` route for visual preview of seeded pages
  - **CryptoDataService**: Server-side API aggregation with intelligent caching (TTL + stale-while-revalidate), CoinGecko primary provider with CoinCap fallback
  - **Public Landing Page** (`/crypto`): Browse all cryptocurrencies with search, featured cryptos, market data display
  - **Public Detail Page** (`/crypto/:slug`): Price, 24h change, market cap, volume, supply info, editorial content
  - **Bilingual Support**: English/Arabic language toggle with RTL layout support
  - **Market Data**: CryptoMarketSnapshot entities for real-time price data from CoinGecko
  - **Editorial Content**: CryptoPage entities with whatIsIt, howItWorks, useCases, risks, disclaimers (EN/AR)
  - **API Endpoints**:
    - GET `/api/crypto/pages` - List all crypto pages
    - GET `/api/crypto/pages/:id` - Get single crypto page by ID
    - GET `/api/crypto/pages/slug/:slug` - Get crypto page by slug
    - POST `/api/crypto/pages` - Create new crypto page (auto-generates slug)
    - PUT `/api/crypto/pages/:id` - Update crypto page (slug updates rejected)
    - DELETE `/api/crypto/pages/:id` - Delete crypto page
    - POST `/api/crypto/pages/:id/scan` - Run compliance check
    - POST `/api/crypto/pages/:id/toggle-lock` - Toggle editorial lock
    - GET `/api/crypto/snapshots` - Get market data snapshots
    - GET `/api/crypto/data/:coingeckoId/summary` - Asset summary data
    - GET `/api/crypto/data/:coingeckoId/chart` - Price chart data
    - GET `/api/crypto/data/:coingeckoId/markets` - Exchange tickers
    - GET `/api/crypto/data/:coingeckoId/profile` - Asset profile/metadata
    - GET `/api/crypto/live/market` - Live market summary with caching (legacy)
    - GET `/api/crypto/live/asset/:coingeckoId` - Live asset details (legacy)
    - GET `/api/crypto/live/chart/:coingeckoId` - Live price chart data (legacy)
    - GET `/api/crypto/live/markets/:coingeckoId` - Exchange tickers (legacy)
    - GET `/api/crypto/live/profile/:coingeckoId` - Asset profile/metadata (legacy)
    - POST `/api/crypto/live/refresh` - Refresh market snapshots
  - **Editorial Lock**: editorialLocked flag prevents auto-generation from overwriting human edits
  - **Compliance Integration**: Uses existing compliance rules for content scanning
  - **Navigation**: Crypto link in BarakaHeader nav bar + CMS sidebar navigation
  - **13 Page Module Types**: hero, price_chart, key_stats, markets_table, news_feed, about, how_it_works, use_cases, faq, risk_callout, disclosures, related_assets, quick_trade_cta

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React single-page application with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: tsx for TypeScript execution, Vite middleware for frontend
- **Production**: esbuild bundles server, Vite builds frontend to `dist/public`

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Storage Interface**: Abstract `IStorage` interface with in-memory implementation (database can be connected later)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route page components
│   ├── lib/             # Utilities and mock data
│   └── hooks/           # Custom React hooks
├── server/              # Express backend
├── shared/              # Shared types and schemas
└── migrations/          # Drizzle database migrations
```

### Design System
- Material Design/Enterprise SaaS patterns for fintech B2B aesthetic
- Inter font family with RTL support for Arabic
- Neutral color palette with CSS custom properties
- Consistent spacing system using Tailwind units (2, 4, 6, 8, 12, 16, 24)

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `@neondatabase/serverless`
- **Drizzle Kit**: Database migrations and schema management
- **Connection**: Requires `DATABASE_URL` environment variable

### UI Libraries
- **Radix UI**: Full primitive component suite (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Calendar/date picker
- **vaul**: Drawer component
- **react-resizable-panels**: Resizable panel layouts
- **recharts**: Charting library
- **cmdk**: Command palette

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for validation
- **zod**: Schema validation

### Development Tools
- **Replit plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Full type coverage across client/server/shared